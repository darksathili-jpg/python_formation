import { view, state, escapeHTML, getRoute, showToast, attachEditorTabBehavior } from './app-shell.js';
import { APP_VERSION } from './runtime-config.js?v=1.1.0';
import { bacReadinessFrame, errorTags, readinessSessions, readinessGate } from './bac-readiness.js';

const STORAGE_KEY = 'python-forge-bac-readiness-v1';
let selectedSessionId = null;
let timerHandle = 0;
let queued = false;

function loadStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const store = loadStore();

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function blankSession(session) {
  return {
    startedAt: 0,
    endedAt: 0,
    timedOut: false,
    code: Object.fromEntries(session.tasks.map(task => [task.id, task.starter])),
    passedTasks: {},
    lastResults: {},
    written: '',
    writtenUpdatedAt: 0,
    criteria: [],
    dialogue: Object.fromEntries(session.dialogue.map((_, i) => [String(i), ''])),
    errors: []
  };
}

function getSessionState(session) {
  if (!store[session.id]) store[session.id] = blankSession(session);
  return store[session.id];
}

function deadlineFor(session, sessionState) {
  return sessionState.startedAt + session.duration * 60_000;
}

function autoCloseExpired() {
  let changed = false;
  const now = Date.now();
  for (const session of readinessSessions) {
    const s = getSessionState(session);
    if (s.startedAt && !s.endedAt && now >= deadlineFor(session, s)) {
      s.endedAt = deadlineFor(session, s);
      s.timedOut = true;
      changed = true;
      if (!selectedSessionId) selectedSessionId = session.id;
    }
  }
  if (changed) saveStore();
}

function runningSession() {
  autoCloseExpired();
  return readinessSessions.find(session => {
    const s = getSessionState(session);
    return s.startedAt && !s.endedAt;
  });
}

function fmtTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function taskPassedCount(session, s) {
  return session.tasks.filter(task => Boolean(s.passedTasks[task.id])).length;
}

function sessionTimingPass(session, s) {
  if (!s.startedAt || !s.endedAt) return false;
  const deadline = deadlineFor(session, s);
  const tasksOnTime = session.tasks.every(task => s.passedTasks[task.id] && s.passedTasks[task.id] <= deadline);
  const writtenOnTime = s.written.trim().length >= 80 && s.writtenUpdatedAt && s.writtenUpdatedAt <= deadline;
  return tasksOnTime && writtenOnTime;
}

function gateMetrics() {
  const sessionsComplete = readinessSessions.every(session => Boolean(getSessionState(session).endedAt));
  const allTasks = readinessSessions.flatMap(session => session.tasks.map(task => [session, task]));
  const codePassed = allTasks.filter(([session, task]) => Boolean(getSessionState(session).passedTasks[task.id])).length;
  const codeTotal = allTasks.length;
  const reasoningPassed = readinessSessions.filter(session => getSessionState(session).criteria.length >= 3).length;
  const dialoguePassed = readinessSessions.filter(session => session.dialogue.every((_, i) => (getSessionState(session).dialogue[String(i)] || '').trim().length >= 8)).length;
  const timingPassed = readinessSessions.filter(session => sessionTimingPass(session, getSessionState(session))).length;
  const pass = sessionsComplete && codePassed === codeTotal && reasoningPassed === readinessSessions.length && dialoguePassed === readinessSessions.length && timingPassed === readinessSessions.length;
  return { sessionsComplete, codePassed, codeTotal, reasoningPassed, dialoguePassed, timingPassed, pass };
}

class ReadinessRunner {
  constructor() {
    this.worker = null;
    this.ready = null;
    this.pending = new Map();
    this.seq = 0;
  }

  ensure() {
    if (this.worker && this.ready) return this.ready;
    const worker = new Worker(new URL(`./python-worker.js?v=${APP_VERSION}`, import.meta.url), { type: 'module' });
    this.worker = worker;
    this.ready = new Promise((resolve, reject) => {
      const bootTimer = setTimeout(() => reject(new Error('Le moteur Python met trop de temps à démarrer.')), 30_000);
      worker.addEventListener('message', event => {
        const data = event.data || {};
        if (data.type === 'ready') {
          clearTimeout(bootTimer);
          resolve();
        }
        if (data.type === 'boot-error') {
          clearTimeout(bootTimer);
          reject(new Error(data.error || 'Moteur Python indisponible.'));
        }
        if (data.type === 'result' && this.pending.has(data.requestId)) {
          const pending = this.pending.get(data.requestId);
          clearTimeout(pending.timer);
          this.pending.delete(data.requestId);
          pending.resolve(data);
        }
      });
      worker.addEventListener('error', error => {
        clearTimeout(bootTimer);
        reject(error);
      });
    }).catch(error => {
      worker.terminate();
      if (this.worker === worker) {
        this.worker = null;
        this.ready = null;
      }
      throw error;
    });
    return this.ready;
  }

  async run(code, tests) {
    await this.ensure();
    const requestId = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.ready = null;
        reject(new Error('Exécution interrompue après 6 s.'));
      }, 6000);
      this.pending.set(requestId, { resolve, reject, timer });
      this.worker.postMessage({ type:'run', requestId, code, tests, stdin:'' });
    });
  }
}

const runner = new ReadinessRunner();

function cardHTML(session) {
  const s = getSessionState(session);
  const passed = taskPassedCount(session, s);
  const status = !s.startedAt ? 'non commencé' : !s.endedAt ? 'en cours' : sessionTimingPass(session, s) ? 'terminé dans le cadre' : 'terminé à consolider';
  const button = !s.startedAt ? 'Démarrer le parcours' : !s.endedAt ? 'Reprendre le parcours' : 'Voir le débrief';
  const targets = s.endedAt ? `<p class="brg-hidden-targets"><strong>Notions révélées :</strong> ${session.targets.map(escapeHTML).join(' · ')}</p>` : '<p class="brg-hidden-targets muted">Notions mobilisées masquées jusqu’au débrief.</p>';
  return `<article class="brg-card">
    <div class="brg-status"><span class="chip">${escapeHTML(session.id)}</span><span class="chip ${s.endedAt && sessionTimingPass(session,s) ? 'ok' : ''}">${escapeHTML(status)}</span></div>
    <h3>${escapeHTML(session.title)}</h3>
    <p>${escapeHTML(session.context)}</p>
    <p class="muted">${session.duration} min · 2 tâches de programmation · 1 justification écrite · dialogue simulé après débrief.</p>
    ${targets}
    <p><strong>${passed}/${session.tasks.length}</strong> tâches de code validées.</p>
    <button class="btn ${!s.startedAt || !s.endedAt ? 'primary' : ''}" type="button" data-brg-open="${session.id}">${button}</button>
  </article>`;
}

function testOutputHTML(task, s) {
  const result = s.lastResults[task.id];
  if (!result) return 'Aucun test lancé pour cette tâche.';
  if (result.error) return `Erreur d’exécution : ${escapeHTML(result.error)}`;
  const lines = result.tests.map(test => `${test.pass ? '✓' : '✗'} ${test.label}${test.error ? ` — ${test.error}` : ''}`);
  return lines.map(escapeHTML).join('<br>');
}

function taskHTML(session, task, s) {
  const ended = Boolean(s.endedAt);
  const passed = Boolean(s.passedTasks[task.id]);
  return `<article class="brg-task" id="${task.id}">
    <div class="section-head"><div><div class="page-kicker">Tâche ${escapeHTML(task.id)}</div><h3>${escapeHTML(task.title)}</h3></div><span class="chip ${passed ? 'ok' : ''}">${passed ? '✓ comportement validé' : 'à valider'}</span></div>
    <p>${escapeHTML(task.prompt)}</p>
    <div class="editor-shell">
      <div class="editor-toolbar"><span>${task.id.toLowerCase()}.py</span><span>aucun indice pendant le gate</span></div>
      <textarea class="code-editor" data-brg-code="${task.id}" spellcheck="false" ${ended ? 'disabled' : ''}>${escapeHTML(s.code[task.id] ?? task.starter)}</textarea>
    </div>
    <div class="brg-actions">${ended ? '' : `<button class="btn primary" type="button" data-brg-run="${task.id}">▶ Tester</button><button class="btn" type="button" data-brg-reset-task="${task.id}">↺ Code initial</button>`}</div>
    <div class="runner-status brg-output" id="brg-output-${task.id}">${testOutputHTML(task, s)}</div>
  </article>`;
}

function debriefHTML(session, s) {
  if (!s.endedAt) return '';
  return `<section class="brg-debrief">
    <div class="section-head"><div><div class="page-kicker">Débrief différé</div><h3>Ce que cette situation mobilisait réellement</h3></div><span class="chip">${session.targets.map(escapeHTML).join(' · ')}</span></div>
    <div class="brg-debrief-grid">${session.tasks.map(task => `<div class="key-point"><strong>${escapeHTML(task.id)}</strong><br>${escapeHTML(task.debrief.strategy)}<br><span class="muted">${task.debrief.concepts.map(escapeHTML).join(' · ')}</span></div>`).join('')}</div>
    <h3>Auto-vérification de la justification écrite</h3>
    <p class="muted">Ce contrôle n’est pas une correction automatique : coche uniquement un critère réellement présent et correctement expliqué dans ta réponse.</p>
    <div class="brg-checks">${session.written.criteria.map((criterion, index) => `<label><input type="checkbox" data-brg-criterion="${index}" ${s.criteria.includes(index) ? 'checked' : ''}> <span>${escapeHTML(criterion)}</span></label>`).join('')}</div>
    <h3>Dialogue simulé avec l’examinateur</h3>
    <div class="brg-dialogue">${session.dialogue.map((question,index)=>`<label><strong>${index+1}. ${escapeHTML(question)}</strong><textarea data-brg-dialogue="${index}" placeholder="Mots-clés ou réponse orale préparée…">${escapeHTML(s.dialogue[String(index)] || '')}</textarea></label>`).join('')}</div>
    <h3>Analyse des erreurs</h3>
    <p class="muted">Sélectionne les causes qui ont réellement joué pendant la session. Cette trace sert à distinguer un problème de connaissance, de stratégie, de code ou de gestion du temps.</p>
    <div class="brg-errors">${errorTags.map(([id,label])=>`<label><input type="checkbox" data-brg-error="${id}" ${s.errors.includes(id) ? 'checked' : ''}> <span>${escapeHTML(label)}</span></label>`).join('')}</div>
  </section>`;
}

function workspaceHTML(session) {
  const s = getSessionState(session);
  const now = Date.now();
  const remaining = s.startedAt && !s.endedAt ? deadlineFor(session,s) - now : 0;
  const timer = s.endedAt ? (sessionTimingPass(session,s) ? 'terminé dans le cadre' : 'session terminée') : fmtTime(remaining);
  return `<section class="brg-workspace" data-brg-session="${session.id}">
    <header class="brg-workspace-head">
      <div><div class="page-kicker">${escapeHTML(session.id)} · parcours blanc transversal</div><h2>${escapeHTML(session.title)}</h2><p>${escapeHTML(session.context)}</p></div>
      <div><div class="brg-timer" data-brg-timer data-urgent="${!s.endedAt && remaining <= 10*60_000}">${escapeHTML(timer)}</div><div class="tiny">chronomètre non suspendu au rechargement</div></div>
    </header>
    <div class="brg-workspace-body">
      ${s.endedAt ? '<div class="programme-note">La session est verrouillée. Le débrief est maintenant disponible ; le code et la justification ne peuvent plus être modifiés.</div>' : '<div class="programme-note">Les chapitres mobilisés ne sont volontairement pas indiqués. Commence par identifier les structures, invariants et cas limites utiles.</div>'}
      ${session.tasks.map(task => taskHTML(session,task,s)).join('')}
      <section class="brg-written"><div class="page-kicker">Justification écrite</div><h3>Expliquer avant le débrief</h3><p>${escapeHTML(session.written.prompt)}</p><textarea class="reflection-editor" data-brg-written aria-label="Justification écrite ${session.id}" ${s.endedAt ? 'disabled' : ''} placeholder="Réponse en phrases complètes…">${escapeHTML(s.written)}</textarea><p class="tiny">Repère conseillé : au moins 80 caractères et un vocabulaire informatique précis.</p></section>
      <div class="brg-actions">${s.endedAt ? '' : '<button class="btn primary" type="button" data-brg-finish>Terminer et ouvrir le débrief</button>'}<button class="btn" type="button" data-brg-back>← Retour aux parcours</button></div>
      ${debriefHTML(session,s)}
    </div>
  </section>`;
}

function summaryHTML() {
  const m = gateMetrics();
  return `<section class="brg-summary">
    <div class="section-head"><div><div class="page-kicker">Mesure cumulative</div><h2>Profil de préparation transversal</h2></div><span class="chip ${m.pass ? 'ok' : ''}">${m.pass ? 'Gate vert' : 'Gate non franchi'}</span></div>
    <div class="brg-summary-grid">
      <div class="brg-summary-card"><strong>${m.codePassed}/${m.codeTotal}</strong><span>tâches de code validées</span></div>
      <div class="brg-summary-card"><strong>${m.reasoningPassed}/${readinessSessions.length}</strong><span>justifications avec ≥ 3 critères</span></div>
      <div class="brg-summary-card"><strong>${m.dialoguePassed}/${readinessSessions.length}</strong><span>dialogues préparés</span></div>
      <div class="brg-summary-card"><strong>${m.timingPassed}/${readinessSessions.length}</strong><span>sessions techniquement bouclées dans le temps</span></div>
    </div>
    <div class="brg-gate" data-pass="${m.pass}"><strong>${m.pass ? 'Bac Readiness Gate franchi sur le périmètre du site.' : 'Le gate reste ouvert.'}</strong><p>${escapeHTML(readinessGate.interpretation)}</p></div>
  </section>`;
}

function rootHTML() {
  const active = selectedSessionId ? readinessSessions.find(session => session.id === selectedSessionId) : runningSession();
  if (!selectedSessionId && active) selectedSessionId = active.id;
  return `<section id="bac-readiness-gate" class="lesson-block bac-readiness">
    <div class="brg-header"><div class="section-head"><div><div class="page-kicker">V1.25 · Bac Readiness Gate T1 → T11</div><h2>Reconnaître seul la bonne stratégie, sous contrainte de temps</h2></div><span class="chip">4 × 60 min</span></div>
    <p>${escapeHTML(bacReadinessFrame.purpose)}</p><div class="brg-official"><strong>Cadre 2027.</strong> ${escapeHTML(bacReadinessFrame.official2027)}</div></div>
    <div class="brg-rules">${bacReadinessFrame.rules.map((rule,index)=>`<div class="brg-rule"><strong>${index+1}</strong><br>${escapeHTML(rule)}</div>`).join('')}</div>
    <div class="brg-grid">${readinessSessions.map(cardHTML).join('')}</div>
    ${active ? workspaceHTML(active) : ''}
    ${summaryHTML()}
    <div class="brg-actions"><button class="btn ghost" type="button" data-brg-reset-all>Réinitialiser toute la mesure</button></div>
  </section>`;
}

function persistVisibleInputs(session) {
  const s = getSessionState(session);
  document.querySelectorAll('[data-brg-code]').forEach(editor => { s.code[editor.dataset.brgCode] = editor.value; });
  const written = document.querySelector('[data-brg-written]');
  if (written) s.written = written.value;
  saveStore();
}

function startOrOpen(sessionId) {
  const session = readinessSessions.find(item => item.id === sessionId);
  if (!session) return;
  const s = getSessionState(session);
  const running = runningSession();
  if (!s.startedAt) {
    if (running && running.id !== session.id) {
      showToast(`Termine d’abord ${running.id} : un seul chronomètre peut être actif.`);
      return;
    }
    s.startedAt = Date.now();
    s.endedAt = 0;
    s.timedOut = false;
    saveStore();
  }
  selectedSessionId = session.id;
  renderRoot();
}

async function runTask(taskId) {
  const session = readinessSessions.find(item => item.tasks.some(task => task.id === taskId));
  if (!session) return;
  const s = getSessionState(session);
  if (s.endedAt) return;
  persistVisibleInputs(session);
  const task = session.tasks.find(item => item.id === taskId);
  const output = document.querySelector(`#brg-output-${CSS.escape(taskId)}`);
  const editor = document.querySelector(`[data-brg-code="${taskId}"]`);
  if (!editor || !output) return;
  output.textContent = 'Tests en cours…';
  try {
    const result = await runner.run(editor.value, task.tests);
    s.lastResults[taskId] = { ok: Boolean(result.ok), error: result.error || '', tests: result.tests || [] };
    if (result.ok) s.passedTasks[taskId] = Date.now();
    saveStore();
    renderRoot();
  } catch (error) {
    s.lastResults[taskId] = { ok:false, error:String(error?.message || error), tests:[] };
    saveStore();
    renderRoot();
  }
}

function finishSelected() {
  const session = readinessSessions.find(item => item.id === selectedSessionId);
  if (!session) return;
  const s = getSessionState(session);
  if (!s.startedAt || s.endedAt) return;
  persistVisibleInputs(session);
  const written = document.querySelector('[data-brg-written]');
  if (written) {
    s.written = written.value;
    s.writtenUpdatedAt = Date.now();
  }
  s.endedAt = Math.min(Date.now(), deadlineFor(session,s));
  s.timedOut = Date.now() > deadlineFor(session,s);
  saveStore();
  renderRoot();
}

function updateTimer() {
  const session = readinessSessions.find(item => item.id === selectedSessionId);
  if (!session) return;
  const s = getSessionState(session);
  if (!s.startedAt || s.endedAt) return;
  const remaining = deadlineFor(session,s) - Date.now();
  if (remaining <= 0) {
    persistVisibleInputs(session);
    const written = document.querySelector('[data-brg-written]');
    if (written) {
      s.written = written.value;
      s.writtenUpdatedAt = deadlineFor(session,s);
    }
    s.endedAt = deadlineFor(session,s);
    s.timedOut = true;
    saveStore();
    showToast(`${session.id} : temps écoulé, débrief ouvert.`);
    renderRoot();
    return;
  }
  const timer = document.querySelector('[data-brg-timer]');
  if (timer) {
    timer.textContent = fmtTime(remaining);
    timer.dataset.urgent = String(remaining <= 10*60_000);
  }
}

function bindRoot() {
  const root = document.querySelector('#bac-readiness-gate');
  if (!root) return;
  root.querySelectorAll('[data-brg-open]').forEach(button => button.addEventListener('click', () => startOrOpen(button.dataset.brgOpen)));
  root.querySelectorAll('[data-brg-run]').forEach(button => button.addEventListener('click', () => runTask(button.dataset.brgRun)));
  root.querySelectorAll('[data-brg-reset-task]').forEach(button => button.addEventListener('click', () => {
    const session = readinessSessions.find(item => item.tasks.some(task => task.id === button.dataset.brgResetTask));
    if (!session) return;
    const s = getSessionState(session);
    const task = session.tasks.find(item => item.id === button.dataset.brgResetTask);
    s.code[task.id] = task.starter;
    s.lastResults[task.id] = undefined;
    saveStore();
    renderRoot();
  }));
  root.querySelectorAll('[data-brg-code]').forEach(editor => editor.addEventListener('input', () => {
    const session = readinessSessions.find(item => item.tasks.some(task => task.id === editor.dataset.brgCode));
    if (!session) return;
    getSessionState(session).code[editor.dataset.brgCode] = editor.value;
    saveStore();
  }));
  root.querySelector('[data-brg-written]')?.addEventListener('input', event => {
    const session = readinessSessions.find(item => item.id === selectedSessionId);
    if (!session) return;
    const s = getSessionState(session);
    s.written = event.target.value;
    s.writtenUpdatedAt = Date.now();
    saveStore();
  });
  root.querySelector('[data-brg-finish]')?.addEventListener('click', finishSelected);
  root.querySelector('[data-brg-back]')?.addEventListener('click', () => { selectedSessionId = null; renderRoot(); });
  root.querySelectorAll('[data-brg-criterion]').forEach(input => input.addEventListener('change', () => {
    const session = readinessSessions.find(item => item.id === selectedSessionId);
    if (!session) return;
    const s = getSessionState(session);
    const index = Number(input.dataset.brgCriterion);
    s.criteria = input.checked ? [...new Set([...s.criteria,index])] : s.criteria.filter(value => value !== index);
    saveStore();
    renderRoot();
  }));
  root.querySelectorAll('[data-brg-dialogue]').forEach(area => area.addEventListener('input', () => {
    const session = readinessSessions.find(item => item.id === selectedSessionId);
    if (!session) return;
    getSessionState(session).dialogue[area.dataset.brgDialogue] = area.value;
    saveStore();
  }));
  root.querySelectorAll('[data-brg-error]').forEach(input => input.addEventListener('change', () => {
    const session = readinessSessions.find(item => item.id === selectedSessionId);
    if (!session) return;
    const s = getSessionState(session);
    const id = input.dataset.brgError;
    s.errors = input.checked ? [...new Set([...s.errors,id])] : s.errors.filter(value => value !== id);
    saveStore();
  }));
  root.querySelector('[data-brg-reset-all]')?.addEventListener('click', () => {
    if (!confirm('Réinitialiser les quatre parcours Bac Readiness et toutes les traces locales ?')) return;
    for (const key of Object.keys(store)) delete store[key];
    selectedSessionId = null;
    saveStore();
    renderRoot();
  });
  attachEditorTabBehavior();
}

function renderRoot() {
  autoCloseExpired();
  const root = document.querySelector('#bac-readiness-gate');
  if (!root) return;
  root.outerHTML = rootHTML();
  bindRoot();
  clearInterval(timerHandle);
  timerHandle = setInterval(updateTimer, 1000);
  updateTimer();
}

function enhancePractice() {
  if (getRoute().name !== 'practice') return;
  if (state.track !== 'terminale') {
    document.querySelector('#bac-readiness-gate')?.remove();
    return;
  }
  if (document.querySelector('#bac-readiness-gate')) return;
  const anchor = view.querySelector('#bac-2027-transversal') || view.querySelector('.capstone-list') || view.lastElementChild;
  if (!anchor) return;
  anchor.insertAdjacentHTML('beforebegin', rootHTML());
  bindRoot();
  clearInterval(timerHandle);
  timerHandle = setInterval(updateTimer, 1000);
  updateTimer();
}

function schedule() {
  if (queued) return;
  queued = true;
  setTimeout(() => {
    queued = false;
    enhancePractice();
  }, 0);
}

new MutationObserver(schedule).observe(view, { childList:true, subtree:true });
window.addEventListener('hashchange', schedule);
window.addEventListener('python-forge:track-change', schedule);
setTimeout(schedule, 0);
