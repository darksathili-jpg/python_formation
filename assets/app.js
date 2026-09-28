import { modules, tracks } from './content.js';
import { html, toastEl, searchDialog, searchInput, searchResults, state, flashState, saveState, escapeHTML, stripHTML, routeTo, getRoute, showToast, moduleProgress, render, labPresets, renderPractice, flashQuestionsFor, attachEditorTabBehavior, setDynamicBinder } from './app-shell.js';

let searchIndex = -1;

class PythonRunner {
  constructor() { this.worker = null; this.ready = null; this.pending = new Map(); this.seq = 0; }
  ensureWorker() {
    if (this.worker && this.ready) return this.ready;
    this.worker = new Worker(new URL('./python-worker.js', import.meta.url), { type: 'module' });
    this.ready = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Le moteur Python met trop de temps à se charger. Vérifie la connexion Internet.')), 25000);
      this.worker.addEventListener('message', event => {
        const data = event.data || {};
        if (data.type === 'ready') { clearTimeout(timer); resolve(); }
        if (data.type === 'boot-error') { clearTimeout(timer); reject(new Error(data.error || 'Impossible de charger Python.')); }
        if (data.type === 'result' && this.pending.has(data.requestId)) {
          const { resolve: res, timer: runTimer } = this.pending.get(data.requestId);
          clearTimeout(runTimer); this.pending.delete(data.requestId); res(data);
        }
      });
      this.worker.addEventListener('error', error => { clearTimeout(timer); reject(error); });
    });
    return this.ready;
  }
  async run(code, tests = []) {
    await this.ensureWorker(); const requestId = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId); this.reset(); reject(new Error('Exécution interrompue après 6 s. Vérifie notamment tes boucles while et tes appels récursifs.'));
      }, 6000);
      this.pending.set(requestId, { resolve, reject, timer });
      this.worker.postMessage({ type: 'run', requestId, code, tests });
    });
  }
  reset() {
    if (this.worker) this.worker.terminate();
    for (const { reject, timer } of this.pending.values()) { clearTimeout(timer); reject(new Error('Moteur Python redémarré.')); }
    this.pending.clear(); this.worker = null; this.ready = null;
  }
}

const pythonRunner = new PythonRunner();

function findExercise(id) {
  for (const module of modules) { const ex = module.exercises.find(e => e.id === id); if (ex) return { ex, module }; }
  return null;
}

async function runExercise(id) {
  const found = findExercise(id); if (!found) return;
  const { ex, module } = found;
  const editor = document.querySelector(`#editor-${CSS.escape(id)}`); const output = document.querySelector(`#output-${CSS.escape(id)}`); const status = document.querySelector(`#status-${CSS.escape(id)}`); const btn = document.querySelector(`[data-run-exercise="${id}"]`);
  if (!editor || !output || !status || !btn) return;
  state.attempts[id] = (state.attempts[id] || 0) + 1; saveState(); btn.disabled = true; btn.textContent = '⏳ Test en cours…'; status.textContent = 'chargement/exécution'; output.textContent = 'Initialisation du moteur Python…';
  try {
    const result = await pythonRunner.run(editor.value, ex.tests); const lines = [];
    if (result.stdout) lines.push('SORTIE DU PROGRAMME\n' + result.stdout.trim()); if (result.error) lines.push('ERREUR\n' + result.error); lines.push('TESTS');
    const testHtml = result.tests.map(t => `<div class="test-item ${t.pass ? 'pass' : 'fail'}">${t.pass ? '✓' : '✗'} ${escapeHTML(t.label)}${t.error ? ` — ${escapeHTML(t.error)}` : ''}</div>`).join('');
    output.innerHTML = `${lines.length ? `<div>${escapeHTML(lines.filter(x => x !== 'TESTS').join('\n\n'))}</div>` : ''}<div class="test-list">${testHtml}</div>`;
    const allPass = result.ok && result.tests.length === ex.tests.length && result.tests.every(t => t.pass);
    if (allPass) {
      state.solved[id] = true; saveState(); status.textContent = '✓ tous les tests passent';
      output.insertAdjacentHTML('afterbegin', `<div style="color:#8ff0b1;margin-bottom:.8rem">✓ Mission validée. Explique maintenant pourquoi ton algorithme fonctionne : c’est cette explication qui transforme un test réussi en apprentissage.</div>`);
      showToast(`${id} validé — progression enregistrée localement.`); document.getElementById(id)?.querySelector('.exercise-head .chip')?.classList.add('ok'); updateModuleProgressDOM(module);
    } else status.textContent = result.error ? 'erreur d’exécution' : 'tests à corriger';
  } catch (err) { status.textContent = 'moteur redémarré'; output.textContent = err.message || String(err); }
  finally { btn.disabled = false; btn.textContent = '▶ Tester'; }
}

function updateModuleProgressDOM(module) {
  const p = moduleProgress(module); const bar = document.querySelector('.module-aside .progress-track > span'); if (bar) bar.style.width = `${p.percent}%`; const text = document.querySelector('.module-aside .tiny'); if (text) text.textContent = `${p.done}/${p.total} exercices validés`;
}
function showHint(id) {
  const found = findExercise(id); if (!found) return; const target = document.querySelector(`#hint-${CSS.escape(id)}`); if (!target) return; const shown = Number(target.dataset.shown || 0); const next = Math.min(shown, found.ex.hints.length - 1); target.dataset.shown = String(next + 1); target.innerHTML = `<div class="hint-box"><strong>Indice ${next + 1}/${found.ex.hints.length}</strong><br>${escapeHTML(found.ex.hints[next])}${next + 1 >= found.ex.hints.length ? '<br><span class="tiny">Tous les indices sont maintenant visibles.</span>' : ''}</div>`;
}
function showSolution(id) {
  const found = findExercise(id); if (!found) return; const target = document.querySelector(`#solution-${CSS.escape(id)}`); if (!target) return; const attempts = state.attempts[id] || 0; if (attempts < 1 && !confirm('Tu n’as encore lancé aucun test. Afficher quand même une solution possible ?')) return; target.innerHTML = `<div class="solution"><div class="page-kicker">Une solution possible</div><pre>${escapeHTML(found.ex.solution)}</pre><p class="tiny">Ne la recopie pas : compare-la à ton idée et explique la différence.</p></div>`;
}
function resetExercise(id) {
  const found = findExercise(id); if (!found) return; const editor = document.querySelector(`#editor-${CSS.escape(id)}`); if (editor) editor.value = found.ex.starter; const output = document.querySelector(`#output-${CSS.escape(id)}`); if (output) output.textContent = 'Code réinitialisé. Les validations déjà obtenues restent conservées.';
}

async function runLab() {
  const editor = document.querySelector('#lab-editor'); const output = document.querySelector('#lab-output'); const status = document.querySelector('#lab-status'); const btn = document.querySelector('#lab-run'); if (!editor || !output || !status || !btn) return;
  btn.disabled = true; btn.textContent = '⏳ Exécution…'; status.textContent = 'moteur Python'; output.textContent = 'Chargement / exécution…';
  try {
    const result = await pythonRunner.run(editor.value, []); status.textContent = result.error ? 'erreur' : 'terminé'; output.textContent = [result.stdout ? result.stdout.trimEnd() : '', result.stderr ? '\n' + result.stderr.trimEnd() : '', result.error ? '\n' + result.error : ''].filter(Boolean).join('\n') || '(aucune sortie — ajoute print(...) pour observer une valeur)';
  } catch (err) { status.textContent = 'interrompu'; output.textContent = err.message || String(err); }
  finally { btn.disabled = false; btn.textContent = '▶ Exécuter'; }
}

function bindDynamicActions() {
  document.querySelectorAll('[data-track-switch]').forEach(btn => btn.addEventListener('click', () => { state.track = btn.dataset.trackSwitch; saveState(); if (getRoute().name === 'practice') { flashState.index = 0; flashState.answered = false; } render(); }));
  document.querySelectorAll('[data-copy-code]').forEach(btn => btn.addEventListener('click', async () => { await navigator.clipboard.writeText(decodeURIComponent(btn.dataset.copyCode)); showToast('Code copié.'); }));
  document.querySelectorAll('[data-run-exercise]').forEach(btn => btn.addEventListener('click', () => runExercise(btn.dataset.runExercise)));
  document.querySelectorAll('[data-reset-exercise]').forEach(btn => btn.addEventListener('click', () => resetExercise(btn.dataset.resetExercise)));
  document.querySelectorAll('[data-hint-exercise]').forEach(btn => btn.addEventListener('click', () => showHint(btn.dataset.hintExercise)));
  document.querySelectorAll('[data-solution-exercise]').forEach(btn => btn.addEventListener('click', () => showSolution(btn.dataset.solutionExercise)));
  document.querySelectorAll('[data-local-anchor]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); document.getElementById(link.dataset.localAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  document.querySelectorAll('[data-flash-answer]').forEach(btn => btn.addEventListener('click', () => answerFlash(Number(btn.dataset.flashAnswer))));
  document.querySelector('#flash-next')?.addEventListener('click', nextFlash);
  document.querySelector('#random-exercise')?.addEventListener('click', () => {
    const pool = modules.filter(m => m.track === state.track).flatMap(m => m.exercises.map(e => ({e,m}))); const unsolved = pool.filter(x => !state.solved[x.e.id]); const source = unsolved.length ? unsolved : pool; const pick = source[Math.floor(Math.random() * source.length)]; routeTo(`module/${pick.m.id}`); setTimeout(() => document.getElementById(pick.e.id)?.scrollIntoView({behavior:'smooth'}), 120);
  });
  document.querySelector('#lab-run')?.addEventListener('click', runLab);
  document.querySelector('#lab-clear')?.addEventListener('click', () => { const out = document.querySelector('#lab-output'); if (out) out.textContent = ''; });
  document.querySelectorAll('[data-lab-preset]').forEach(btn => btn.addEventListener('click', () => { const ed = document.querySelector('#lab-editor'); if (ed) ed.value = labPresets[btn.dataset.labPreset]; }));
}

function answerFlash(index) {
  if (flashState.answered) return; flashState.answered = true; const q = flashQuestionsFor(state.track)[flashState.index];
  document.querySelectorAll('[data-flash-answer]').forEach((btn, i) => { if (i === q.answer) btn.classList.add('correct'); else if (i === index) btn.classList.add('wrong'); btn.disabled = true; });
  const fb = document.querySelector('#flash-feedback'); fb.hidden = false; fb.innerHTML = `<strong>${index === q.answer ? '✓ Correct.' : 'À revoir.'}</strong> ${escapeHTML(q.explain)}`;
}
function nextFlash() { const qs = flashQuestionsFor(state.track); flashState.index = (flashState.index + 1) % qs.length; flashState.answered = false; renderPractice(); bindDynamicActions(); }

function buildSearchResults(query) {
  const q = query.trim().toLocaleLowerCase('fr'); if (!q) return modules.slice(0, 8).map(m => ({href:`#module/${m.id}`, title:`${m.id} · ${m.title}`, detail:tracks[m.track].label})); const results = [];
  for (const m of modules) {
    const hay = [m.id,m.title,m.summary,m.bo,...m.objectives,...m.lessons.map(x => x.title + ' ' + stripHTML(x.html || ''))].join(' ').toLocaleLowerCase('fr');
    if (hay.includes(q)) results.push({href:`#module/${m.id}`,title:`${m.id} · ${m.title}`,detail:`${tracks[m.track].label} · ${m.bo}`});
    for (const e of m.exercises) { const ehay = `${e.id} ${e.title} ${stripHTML(e.prompt)} ${e.hints.join(' ')}`.toLocaleLowerCase('fr'); if (ehay.includes(q)) results.push({href:`#module/${m.id}`,anchor:e.id,title:`${e.id} · ${e.title}`,detail:`Exercice · ${tracks[m.track].label}`}); }
  }
  return results.slice(0, 14);
}
function refreshSearch() {
  const results = buildSearchResults(searchInput.value); searchIndex = results.length ? 0 : -1; searchResults.innerHTML = results.length ? results.map((r, i) => `<a class="search-result ${i===0?'active':''}" href="${r.href}" data-search-index="${i}" data-search-anchor="${r.anchor || ''}"><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.detail)}</small></a>`).join('') : '<div class="empty">Aucun résultat. Essaie « récursivité », « dictionnaire » ou « tri ».</div>';
  searchResults.querySelectorAll('.search-result').forEach(link => link.addEventListener('click', () => { const anchor = link.dataset.searchAnchor; searchDialog.close(); if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({behavior:'smooth'}), 160); }));
}
function moveSearch(delta) { const links = [...searchResults.querySelectorAll('.search-result')]; if (!links.length) return; searchIndex = (searchIndex + delta + links.length) % links.length; links.forEach((a,i) => a.classList.toggle('active',i===searchIndex)); links[searchIndex].scrollIntoView({block:'nearest'}); }
function applyAppearance() { html.dataset.theme = state.theme; html.classList.toggle('projector', Boolean(state.projector)); document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'light' ? '#f4f7f4' : '#071319'); }

function setupGlobalControls() {
  document.querySelector('#theme-toggle').addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; saveState(); applyAppearance(); drawSignalCanvas(); });
  document.querySelector('#projector-toggle').addEventListener('click', () => { state.projector = !state.projector; saveState(); applyAppearance(); showToast(state.projector ? 'Mode vidéoprojecteur activé.' : 'Mode vidéoprojecteur désactivé.'); });
  document.querySelector('#search-open').addEventListener('click', () => { if (!searchDialog.open) { searchDialog.showModal(); refreshSearch(); setTimeout(() => searchInput.focus(), 30); } });
  searchInput.addEventListener('input', refreshSearch);
  searchInput.addEventListener('keydown', event => { if (event.key === 'ArrowDown') { event.preventDefault(); moveSearch(1); } if (event.key === 'ArrowUp') { event.preventDefault(); moveSearch(-1); } if (event.key === 'Enter') { const active = searchResults.querySelector('.search-result.active'); if (active) { event.preventDefault(); active.click(); } } });
  window.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('#search-open').click(); } });
  window.addEventListener('hashchange', render);
}

function drawSignalCanvas() {
  const canvas = document.querySelector('#signal-canvas'); if (!canvas) return; const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; const ctx = canvas.getContext('2d'); let width, height, nodes = [], raf = 0;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2); width = innerWidth; height = innerHeight; canvas.width = width * ratio; canvas.height = height * ratio; canvas.style.width = width+'px'; canvas.style.height = height+'px'; ctx.setTransform(ratio,0,0,ratio,0,0); const count = Math.min(46, Math.max(18, Math.floor(width / 34))); nodes = Array.from({length:count}, (_,i) => ({x:(i*193)%width,y:(i*97)%height,vx:((i%5)-2)*.08,vy:(((i*3)%5)-2)*.06}));
  };
  const renderFrame = () => {
    ctx.clearRect(0,0,width,height); const light = html.dataset.theme === 'light'; ctx.strokeStyle = light ? 'rgba(8,127,103,.13)' : 'rgba(102,251,209,.13)'; ctx.fillStyle = light ? 'rgba(8,127,103,.32)' : 'rgba(102,251,209,.34)';
    nodes.forEach((n,i) => { if (!reduced) { n.x += n.vx; n.y += n.vy; if(n.x<0||n.x>width)n.vx*=-1;if(n.y<0||n.y>height)n.vy*=-1; } ctx.beginPath();ctx.arc(n.x,n.y,1.4,0,Math.PI*2);ctx.fill(); for(let j=i+1;j<nodes.length;j++){const b=nodes[j],dx=n.x-b.x,dy=n.y-b.y,d=Math.hypot(dx,dy);if(d<115){ctx.globalAlpha=1-d/115;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;}} }); if (!reduced) raf=requestAnimationFrame(renderFrame);
  };
  cancelAnimationFrame(raf); resize(); renderFrame(); window.addEventListener('resize', () => { resize(); if(reduced) renderFrame(); }, {passive:true});
}
async function registerServiceWorker() { if (!('serviceWorker' in navigator) || location.protocol === 'file:') return; try { await navigator.serviceWorker.register('./sw.js'); } catch (error) { console.info('Service worker non enregistré :', error); } }

setDynamicBinder(bindDynamicActions); applyAppearance(); setupGlobalControls(); render(); drawSignalCanvas(); registerServiceWorker();
