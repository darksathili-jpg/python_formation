import { modules, tracks } from './content.js';
import { html, toastEl, searchDialog, searchInput, searchResults, state, flashState, saveState, escapeHTML, stripHTML, routeTo, getRoute, showToast, moduleProgress, render, labPresets, renderPractice, flashQuestionsFor, attachEditorTabBehavior, setDynamicBinder } from './app-shell.js';
import { APP_VERSION, PYODIDE_VERSION, PYODIDE_CORE_URLS } from './runtime-config.js?v=1.1.0';

let searchIndex = -1;
let runtimePreparationPromise = null;

const RUNTIME_CACHE_NAME = `python-forge-pyodide-${PYODIDE_VERSION}`;
const SHELL_CRITICAL_URLS = [
  new URL('./index.html', document.baseURI).href,
  new URL(`./assets/app.js?v=${APP_VERSION}`, document.baseURI).href,
  new URL(`./assets/python-worker.js?v=${APP_VERSION}`, document.baseURI).href
];

class PythonRunner {
  constructor() {
    this.worker = null;
    this.ready = null;
    this.pending = new Map();
    this.seq = 0;
    this.status = 'idle';
    this.version = '';
    this.detail = 'Moteur en veille';
    this.listeners = new Set();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }
  snapshot() {
    return { status: this.status, version: this.version, detail: this.detail };
  }
  emit(status, detail = '') {
    this.status = status;
    this.detail = detail;
    const snapshot = this.snapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }
  ensureWorker() {
    if (this.worker && this.ready) return this.ready;

    this.emit('loading', `Chargement de Pyodide ${PYODIDE_VERSION} depuis le site…`);
    const worker = new Worker(new URL(`./python-worker.js?v=${APP_VERSION}`, import.meta.url), { type: 'module' });
    this.worker = worker;

    const bootPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Le moteur Python met trop de temps à se charger. Vérifie la connexion ou utilise les diagnostics du Python Lab.')), 30000);

      worker.addEventListener('message', event => {
        const data = event.data || {};
        if (data.type === 'ready') {
          clearTimeout(timer);
          this.version = data.version || '';
          this.emit('ready', `CPython ${this.version || '3.14'} · Pyodide ${data.pyodideVersion || PYODIDE_VERSION} · hébergé localement`);
          resolve();
        }
        if (data.type === 'boot-error') {
          clearTimeout(timer);
          reject(new Error(data.error || 'Impossible de charger Python.'));
        }
        if (data.type === 'result' && this.pending.has(data.requestId)) {
          const { resolve: res, timer: runTimer } = this.pending.get(data.requestId);
          clearTimeout(runTimer);
          this.pending.delete(data.requestId);
          res(data);
        }
      });

      worker.addEventListener('error', error => {
        clearTimeout(timer);
        reject(error);
      });
    });

    this.ready = bootPromise.catch(error => {
      if (this.worker === worker) {
        worker.terminate();
        this.worker = null;
        this.ready = null;
      }
      this.emit('error', error.message || String(error));
      throw error;
    });
    return this.ready;
  }
  async prewarm() {
    await this.ensureWorker();
    return this.snapshot();
  }
  async run(code, tests = [], stdin = '') {
    await this.ensureWorker();
    const requestId = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        this.reset('Exécution interrompue après 6 s. Vérifie notamment tes boucles while et tes appels récursifs.');
        reject(new Error('Exécution interrompue après 6 s. Vérifie notamment tes boucles while et tes appels récursifs.'));
      }, 6000);
      this.pending.set(requestId, { resolve, reject, timer });
      this.worker.postMessage({ type: 'run', requestId, code, tests, stdin });
    });
  }
  reset(reason = 'Moteur Python redémarré.') {
    this.emit('restarting', reason);
    if (this.worker) this.worker.terminate();
    for (const { reject, timer } of this.pending.values()) {
      clearTimeout(timer);
      reject(new Error(reason));
    }
    this.pending.clear();
    this.worker = null;
    this.ready = null;
    this.version = '';
    queueMicrotask(() => this.emit('idle', 'Moteur prêt à être relancé.'));
  }
}

const pythonRunner = new PythonRunner();

function updateEngineIndicator(snapshot) {
  const button = document.querySelector('#python-engine-status');
  if (!button) return;
  const labels = {
    idle: 'Python · veille',
    loading: 'Python · chargement',
    ready: 'Python · prêt',
    restarting: 'Python · redémarrage',
    error: 'Python · indisponible'
  };
  button.dataset.state = snapshot.status;
  const label = button.querySelector('.engine-status-label');
  if (label) label.textContent = labels[snapshot.status] || 'Python';
  button.setAttribute('aria-label', `État du moteur Python : ${labels[snapshot.status] || snapshot.status}. ${snapshot.detail}`);
  button.title = `${snapshot.detail}\nCliquer pour ouvrir les diagnostics.`;
  updateRuntimeDiagnostics();
}
pythonRunner.subscribe(updateEngineIndicator);

function findExercise(id) {
  for (const module of modules) {
    const ex = module.exercises.find(e => e.id === id);
    if (ex) return { ex, module };
  }
  return null;
}

async function runExercise(id) {
  const found = findExercise(id);
  if (!found) return;
  const { ex, module } = found;
  const editor = document.querySelector(`#editor-${CSS.escape(id)}`);
  const output = document.querySelector(`#output-${CSS.escape(id)}`);
  const status = document.querySelector(`#status-${CSS.escape(id)}`);
  const btn = document.querySelector(`[data-run-exercise="${id}"]`);
  if (!editor || !output || !status || !btn) return;

  state.attempts[id] = (state.attempts[id] || 0) + 1;
  saveState();
  btn.disabled = true;
  btn.textContent = '⏳ Test en cours…';
  status.textContent = 'chargement/exécution';
  output.textContent = 'Initialisation du moteur Python…';

  try {
    const result = await pythonRunner.run(editor.value, ex.tests);
    const lines = [];
    if (result.stdout) lines.push('SORTIE DU PROGRAMME\n' + result.stdout.trim());
    if (result.error) lines.push('ERREUR\n' + result.error);
    lines.push('TESTS');
    const testHtml = result.tests.map(t => `<div class="test-item ${t.pass ? 'pass' : 'fail'}">${t.pass ? '✓' : '✗'} ${escapeHTML(t.label)}${t.error ? ` — ${escapeHTML(t.error)}` : ''}</div>`).join('');
    output.innerHTML = `${lines.length ? `<div>${escapeHTML(lines.filter(x => x !== 'TESTS').join('\n\n'))}</div>` : ''}<div class="test-list">${testHtml}</div>`;
    const allPass = result.ok && result.tests.length === ex.tests.length && result.tests.every(t => t.pass);
    if (allPass) {
      state.solved[id] = true;
      saveState();
      status.textContent = '✓ tous les tests passent';
      output.insertAdjacentHTML('afterbegin', `<div style="color:#8ff0b1;margin-bottom:.8rem">✓ Mission validée. Explique maintenant pourquoi ton algorithme fonctionne : c’est cette explication qui transforme un test réussi en apprentissage.</div>`);
      showToast(`${id} validé — progression enregistrée localement.`);
      document.getElementById(id)?.querySelector('.exercise-head .chip')?.classList.add('ok');
      updateModuleProgressDOM(module);
    } else {
      status.textContent = result.error ? 'erreur d’exécution' : 'tests à corriger';
    }
  } catch (err) {
    status.textContent = 'moteur redémarré';
    output.textContent = err.message || String(err);
  } finally {
    btn.disabled = false;
    btn.textContent = '▶ Tester';
  }
}

function updateModuleProgressDOM(module) {
  const p = moduleProgress(module);
  const bar = document.querySelector('.module-aside .progress-track > span');
  if (bar) bar.style.width = `${p.percent}%`;
  const text = document.querySelector('.module-aside .tiny');
  if (text) text.textContent = `${p.done}/${p.total} exercices validés`;
}

function showHint(id) {
  const found = findExercise(id);
  if (!found) return;
  const target = document.querySelector(`#hint-${CSS.escape(id)}`);
  if (!target) return;
  const shown = Number(target.dataset.shown || 0);
  const next = Math.min(shown, found.ex.hints.length - 1);
  target.dataset.shown = String(next + 1);
  target.innerHTML = `<div class="hint-box"><strong>Indice ${next + 1}/${found.ex.hints.length}</strong><br>${escapeHTML(found.ex.hints[next])}${next + 1 >= found.ex.hints.length ? '<br><span class="tiny">Tous les indices sont maintenant visibles.</span>' : ''}</div>`;
}

function showSolution(id) {
  const found = findExercise(id);
  if (!found) return;
  const target = document.querySelector(`#solution-${CSS.escape(id)}`);
  if (!target) return;
  const attempts = state.attempts[id] || 0;
  if (attempts < 1 && !confirm('Tu n’as encore lancé aucun test. Afficher quand même une solution possible ?')) return;
  target.innerHTML = `<div class="solution"><div class="page-kicker">Une solution possible</div><pre>${escapeHTML(found.ex.solution)}</pre><p class="tiny">Ne la recopie pas : compare-la à ton idée et explique la différence.</p></div>`;
}

function resetExercise(id) {
  const found = findExercise(id);
  if (!found) return;
  const editor = document.querySelector(`#editor-${CSS.escape(id)}`);
  if (editor) editor.value = found.ex.starter;
  const output = document.querySelector(`#output-${CSS.escape(id)}`);
  if (output) output.textContent = 'Code réinitialisé. Les validations déjà obtenues restent conservées.';
}

async function runLab() {
  const editor = document.querySelector('#lab-editor');
  const stdin = document.querySelector('#lab-stdin');
  const output = document.querySelector('#lab-output');
  const status = document.querySelector('#lab-status');
  const btn = document.querySelector('#lab-run');
  if (!editor || !output || !status || !btn) return;

  btn.disabled = true;
  btn.textContent = '⏳ Exécution…';
  status.textContent = 'moteur Python';
  output.textContent = 'Chargement / exécution…';
  try {
    const result = await pythonRunner.run(editor.value, [], stdin?.value || '');
    status.textContent = result.error ? 'erreur' : 'terminé';
    output.textContent = [
      result.stdout ? result.stdout.trimEnd() : '',
      result.stderr ? '\n' + result.stderr.trimEnd() : '',
      result.error ? '\n' + result.error : ''
    ].filter(Boolean).join('\n') || '(aucune sortie — ajoute print(...) pour observer une valeur)';
  } catch (err) {
    status.textContent = 'interrompu';
    output.textContent = err.message || String(err);
  } finally {
    btn.disabled = false;
    btn.textContent = '▶ Exécuter';
    updateRuntimeDiagnostics();
  }
}

async function cacheState(urls) {
  if (!('caches' in window)) return { cached: 0, total: urls.length };
  const matches = await Promise.all(urls.map(url => caches.match(url).catch(() => undefined)));
  return { cached: matches.filter(Boolean).length, total: urls.length };
}

async function getRuntimeDiagnostics() {
  const [runtime, shell] = await Promise.all([
    cacheState(PYODIDE_CORE_URLS),
    cacheState(SHELL_CRITICAL_URLS)
  ]);
  const swActive = Boolean(navigator.serviceWorker?.controller);
  return {
    online: navigator.onLine,
    swActive,
    runtime,
    shell,
    offlineReady: swActive && runtime.cached === runtime.total && shell.cached === shell.total,
    engine: pythonRunner.snapshot()
  };
}

function setDiagnosticValue(id, text, stateName = '') {
  const el = document.querySelector(`#${id}`);
  if (!el) return;
  el.textContent = text;
  el.classList.remove('ok', 'warn', 'bad');
  if (stateName) el.classList.add(stateName);
}

async function updateRuntimeDiagnostics() {
  if (!document.querySelector('#runtime-diagnostics')) return;
  const info = await getRuntimeDiagnostics();
  setDiagnosticValue('diag-network', info.online ? 'en ligne' : 'hors ligne', info.online ? 'ok' : 'warn');
  setDiagnosticValue('diag-worker', info.swActive ? 'actif' : 'en attente', info.swActive ? 'ok' : 'warn');
  setDiagnosticValue('diag-cache', `${info.runtime.cached}/${info.runtime.total} fichiers moteur`, info.runtime.cached === info.runtime.total ? 'ok' : 'warn');

  const engineText = info.engine.status === 'ready'
    ? `CPython ${info.engine.version || '3.14'} prêt`
    : info.engine.status === 'loading'
      ? 'chargement…'
      : info.engine.status === 'error'
        ? 'indisponible'
        : 'en veille';
  setDiagnosticValue('diag-engine', engineText, info.engine.status === 'ready' ? 'ok' : info.engine.status === 'error' ? 'bad' : 'warn');
  setDiagnosticValue('diag-offline', info.offlineReady ? '✓ poste prêt pour une coupure réseau' : 'préparation incomplète', info.offlineReady ? 'ok' : 'warn');
}

async function ensureOfflineRuntimeCache() {
  if (!('caches' in window)) return;
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  for (const url of PYODIDE_CORE_URLS) {
    const present = await cache.match(url);
    if (present) continue;
    const response = await fetch(url, { cache: 'reload' });
    if (!response.ok) throw new Error(`Impossible de mettre en cache ${new URL(url).pathname.split('/').pop()}.`);
    await cache.put(url, response.clone());
  }
}

async function prepareClassroomRuntime({ announce = false } = {}) {
  if (runtimePreparationPromise) return runtimePreparationPromise;
  runtimePreparationPromise = (async () => {
    try {
      await pythonRunner.prewarm();
      await ensureOfflineRuntimeCache();
      await updateRuntimeDiagnostics();
      if (announce) showToast('Python est prêt et le moteur hors ligne est en cache.');
    } catch (error) {
      if (announce) showToast(`Préparation Python incomplète : ${error.message || error}`);
      await updateRuntimeDiagnostics();
      throw error;
    } finally {
      runtimePreparationPromise = null;
    }
  })();
  return runtimePreparationPromise;
}

function enhanceLabUI() {
  const labEditor = document.querySelector('#lab-editor');
  if (!labEditor) return;

  const intro = document.querySelector('#view header .page-intro');
  if (intro) {
    intro.textContent = 'Le code s’exécute dans un Web Worker avec Pyodide auto-hébergé sur PYTHON//FORGE. Après la préparation initiale, le moteur et le shell de l’application peuvent fonctionner depuis le cache du navigateur, même lors d’une coupure réseau.';
  }

  const editorShell = labEditor.closest('.editor-shell');
  const actions = editorShell?.querySelector('.runner-actions');
  if (actions && !document.querySelector('#lab-stdin')) {
    actions.insertAdjacentHTML('beforebegin', `
      <div class="stdin-shell">
        <label for="lab-stdin">ENTRÉE STANDARD <span>une ligne consommée par chaque input()</span></label>
        <textarea id="lab-stdin" class="stdin-editor" spellcheck="false" placeholder="Exemple :\nAda\n16"></textarea>
      </div>`);
  }

  const output = document.querySelector('#lab-output');
  if (output && output.textContent.includes('input() interactif')) {
    output.textContent = 'Clique sur « Exécuter ».\n\nPour utiliser input(), prépare les réponses dans « Entrée standard » : chaque appel à input() consomme la ligne suivante.';
  }

  const header = document.querySelector('#view header');
  if (header && !document.querySelector('#runtime-diagnostics')) {
    header.insertAdjacentHTML('afterend', `
      <section id="runtime-diagnostics" class="runtime-diagnostics" aria-labelledby="runtime-title">
        <div class="runtime-diagnostics-head">
          <div>
            <div class="page-kicker">Classroom Reliability · V${APP_VERSION}</div>
            <h2 id="runtime-title">État réel de ce poste</h2>
            <p class="tiny">Ces contrôles permettent de savoir si Python pourra continuer à fonctionner après une coupure du réseau.</p>
          </div>
          <div class="runtime-actions">
            <button id="runtime-prepare" type="button" class="btn primary">Préparer hors ligne</button>
            <button id="runtime-recheck" type="button" class="btn">Re-vérifier</button>
          </div>
        </div>
        <div class="runtime-grid">
          <div class="runtime-card"><strong>Réseau</strong><span id="diag-network" class="runtime-value">test…</span></div>
          <div class="runtime-card"><strong>Service Worker</strong><span id="diag-worker" class="runtime-value">test…</span></div>
          <div class="runtime-card"><strong>Cache Pyodide</strong><span id="diag-cache" class="runtime-value">test…</span></div>
          <div class="runtime-card"><strong>Moteur Python</strong><span id="diag-engine" class="runtime-value">test…</span></div>
        </div>
        <p class="offline-ready-note"><strong id="diag-offline" class="runtime-value">test de disponibilité…</strong></p>
      </section>`);
  }
  updateRuntimeDiagnostics();
}

function bindDynamicActions() {
  if (getRoute().name === 'lab') enhanceLabUI();

  document.querySelectorAll('[data-track-switch]').forEach(btn => btn.addEventListener('click', () => {
    state.track = btn.dataset.trackSwitch;
    saveState();
    if (getRoute().name === 'practice') {
      flashState.index = 0;
      flashState.answered = false;
    }
    render();
  }));
  document.querySelectorAll('[data-copy-code]').forEach(btn => btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.copyCode));
    showToast('Code copié.');
  }));
  document.querySelectorAll('[data-run-exercise]').forEach(btn => btn.addEventListener('click', () => runExercise(btn.dataset.runExercise)));
  document.querySelectorAll('[data-reset-exercise]').forEach(btn => btn.addEventListener('click', () => resetExercise(btn.dataset.resetExercise)));
  document.querySelectorAll('[data-hint-exercise]').forEach(btn => btn.addEventListener('click', () => showHint(btn.dataset.hintExercise)));
  document.querySelectorAll('[data-solution-exercise]').forEach(btn => btn.addEventListener('click', () => showSolution(btn.dataset.solutionExercise)));
  document.querySelectorAll('[data-local-anchor]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById(link.dataset.localAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  document.querySelectorAll('[data-flash-answer]').forEach(btn => btn.addEventListener('click', () => answerFlash(Number(btn.dataset.flashAnswer))));
  document.querySelector('#flash-next')?.addEventListener('click', nextFlash);
  document.querySelector('#random-exercise')?.addEventListener('click', () => {
    const pool = modules.filter(m => m.track === state.track).flatMap(m => m.exercises.map(e => ({ e, m })));
    const unsolved = pool.filter(x => !state.solved[x.e.id]);
    const source = unsolved.length ? unsolved : pool;
    const pick = source[Math.floor(Math.random() * source.length)];
    routeTo(`module/${pick.m.id}`);
    setTimeout(() => document.getElementById(pick.e.id)?.scrollIntoView({ behavior: 'smooth' }), 120);
  });
  document.querySelector('#lab-run')?.addEventListener('click', runLab);
  document.querySelector('#lab-clear')?.addEventListener('click', () => {
    const out = document.querySelector('#lab-output');
    if (out) out.textContent = '';
  });
  document.querySelectorAll('[data-lab-preset]').forEach(btn => btn.addEventListener('click', () => {
    const ed = document.querySelector('#lab-editor');
    if (ed) ed.value = labPresets[btn.dataset.labPreset];
  }));
  document.querySelector('#runtime-prepare')?.addEventListener('click', () => {
    prepareClassroomRuntime({ announce: true }).catch(() => {});
  });
  document.querySelector('#runtime-recheck')?.addEventListener('click', updateRuntimeDiagnostics);
}

function answerFlash(index) {
  if (flashState.answered) return;
  flashState.answered = true;
  const q = flashQuestionsFor(state.track)[flashState.index];
  document.querySelectorAll('[data-flash-answer]').forEach((btn, i) => {
    if (i === q.answer) btn.classList.add('correct');
    else if (i === index) btn.classList.add('wrong');
    btn.disabled = true;
  });
  const fb = document.querySelector('#flash-feedback');
  fb.hidden = false;
  fb.innerHTML = `<strong>${index === q.answer ? '✓ Correct.' : 'À revoir.'}</strong> ${escapeHTML(q.explain)}`;
}

function nextFlash() {
  const qs = flashQuestionsFor(state.track);
  flashState.index = (flashState.index + 1) % qs.length;
  flashState.answered = false;
  renderPractice();
  bindDynamicActions();
}

function buildSearchResults(query) {
  const q = query.trim().toLocaleLowerCase('fr');
  if (!q) return modules.slice(0, 8).map(m => ({ href: `#module/${m.id}`, title: `${m.id} · ${m.title}`, detail: tracks[m.track].label }));
  const results = [];
  for (const m of modules) {
    const hay = [m.id, m.title, m.summary, m.bo, ...m.objectives, ...m.lessons.map(x => x.title + ' ' + stripHTML(x.html || ''))].join(' ').toLocaleLowerCase('fr');
    if (hay.includes(q)) results.push({ href: `#module/${m.id}`, title: `${m.id} · ${m.title}`, detail: `${tracks[m.track].label} · ${m.bo}` });
    for (const e of m.exercises) {
      const ehay = `${e.id} ${e.title} ${stripHTML(e.prompt)} ${e.hints.join(' ')}`.toLocaleLowerCase('fr');
      if (ehay.includes(q)) results.push({ href: `#module/${m.id}`, anchor: e.id, title: `${e.id} · ${e.title}`, detail: `Exercice · ${tracks[m.track].label}` });
    }
  }
  return results.slice(0, 14);
}

function refreshSearch() {
  const results = buildSearchResults(searchInput.value);
  searchIndex = results.length ? 0 : -1;
  searchResults.innerHTML = results.length
    ? results.map((r, i) => `<a class="search-result ${i === 0 ? 'active' : ''}" href="${r.href}" data-search-index="${i}" data-search-anchor="${r.anchor || ''}"><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.detail)}</small></a>`).join('')
    : '<div class="empty">Aucun résultat. Essaie « récursivité », « dictionnaire » ou « tri ».</div>';
  searchResults.querySelectorAll('.search-result').forEach(link => link.addEventListener('click', () => {
    const anchor = link.dataset.searchAnchor;
    searchDialog.close();
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 160);
  }));
}

function moveSearch(delta) {
  const links = [...searchResults.querySelectorAll('.search-result')];
  if (!links.length) return;
  searchIndex = (searchIndex + delta + links.length) % links.length;
  links.forEach((a, i) => a.classList.toggle('active', i === searchIndex));
  links[searchIndex].scrollIntoView({ block: 'nearest' });
}

function applyAppearance() {
  html.dataset.theme = state.theme;
  html.classList.toggle('projector', Boolean(state.projector));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'light' ? '#f4f7f4' : '#071319');
}

function setupGlobalControls() {
  document.querySelector('#theme-toggle').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    applyAppearance();
    drawSignalCanvas();
  });
  document.querySelector('#projector-toggle').addEventListener('click', () => {
    state.projector = !state.projector;
    saveState();
    applyAppearance();
    showToast(state.projector ? 'Mode vidéoprojecteur activé.' : 'Mode vidéoprojecteur désactivé.');
  });
  document.querySelector('#python-engine-status')?.addEventListener('click', () => {
    routeTo('lab');
    setTimeout(() => document.querySelector('#runtime-diagnostics')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 180);
  });
  document.querySelector('#search-open').addEventListener('click', () => {
    if (!searchDialog.open) {
      searchDialog.showModal();
      refreshSearch();
      setTimeout(() => searchInput.focus(), 30);
    }
  });
  searchInput.addEventListener('input', refreshSearch);
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveSearch(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); moveSearch(-1); }
    if (event.key === 'Enter') {
      const active = searchResults.querySelector('.search-result.active');
      if (active) { event.preventDefault(); active.click(); }
    }
  });
  window.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      document.querySelector('#search-open').click();
    }
  });
  window.addEventListener('hashchange', render);
  window.addEventListener('online', () => {
    updateRuntimeDiagnostics();
    if (pythonRunner.status === 'error') scheduleRuntimePrewarm(350);
  });
  window.addEventListener('offline', updateRuntimeDiagnostics);
}

function drawSignalCanvas() {
  const canvas = document.querySelector('#signal-canvas');
  if (!canvas) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let width, height, nodes = [], raf = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(46, Math.max(18, Math.floor(width / 34)));
    nodes = Array.from({ length: count }, (_, i) => ({
      x: (i * 193) % width,
      y: (i * 97) % height,
      vx: ((i % 5) - 2) * .08,
      vy: (((i * 3) % 5) - 2) * .06
    }));
  };
  const renderFrame = () => {
    ctx.clearRect(0, 0, width, height);
    const light = html.dataset.theme === 'light';
    ctx.strokeStyle = light ? 'rgba(8,127,103,.13)' : 'rgba(102,251,209,.13)';
    ctx.fillStyle = light ? 'rgba(8,127,103,.32)' : 'rgba(102,251,209,.34)';
    nodes.forEach((n, i) => {
      if (!reduced) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = n.x - b.x, dy = n.y - b.y, d = Math.hypot(dx, dy);
        if (d < 115) {
          ctx.globalAlpha = 1 - d / 115;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });
    if (!reduced) raf = requestAnimationFrame(renderFrame);
  };
  cancelAnimationFrame(raf);
  resize();
  renderFrame();
  window.addEventListener('resize', () => {
    resize();
    if (reduced) renderFrame();
  }, { passive: true });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return false;
  const hadController = Boolean(navigator.serviceWorker.controller);
  try {
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded && !sessionStorage.getItem('python-forge-sw-reloaded-v1.1')) {
        reloaded = true;
        sessionStorage.setItem('python-forge-sw-reloaded-v1.1', '1');
        location.reload();
      }
    });
    await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
    return true;
  } catch (error) {
    console.info('Service worker non enregistré :', error);
    return false;
  }
}

function scheduleRuntimePrewarm(delay = null) {
  if (navigator.connection?.saveData) return;
  const jitter = delay ?? (900 + Math.floor(Math.random() * 2600));
  setTimeout(() => {
    const launch = () => prepareClassroomRuntime().catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(launch, { timeout: 4500 });
    else launch();
  }, jitter);
}

async function bootClassroomReliability() {
  await registerServiceWorker();
  await updateRuntimeDiagnostics();
  scheduleRuntimePrewarm();
}

setDynamicBinder(bindDynamicActions);
applyAppearance();
setupGlobalControls();
render();
drawSignalCanvas();
bootClassroomReliability();
