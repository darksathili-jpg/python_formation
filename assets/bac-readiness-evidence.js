import { showToast } from './app-shell.js';
import { readinessSessions } from './bac-readiness.js';

export const BAC_READINESS_EVIDENCE_VERSION = '1.26.0';
export const MIN_STRATEGY_CHARS = 40;

const CORE_STORAGE_KEY = 'python-forge-bac-readiness-v1';
const EVIDENCE_STORAGE_KEY = 'python-forge-bac-readiness-evidence-v1';
const taskToSession = new Map();
let patchQueued = false;

for (const session of readinessSessions) {
  for (const task of session.tasks) taskToSession.set(task.id, session);
}

function readJSON(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const evidenceStore = readJSON(EVIDENCE_STORAGE_KEY);

function saveEvidence() {
  localStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(evidenceStore));
}

function clearEvidence() {
  for (const key of Object.keys(evidenceStore)) delete evidenceStore[key];
  saveEvidence();
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function evidenceFor(taskId) {
  if (!evidenceStore[taskId] || typeof evidenceStore[taskId] !== 'object') {
    evidenceStore[taskId] = { strategy: '', lockedAt: 0, firstTestAt: 0, attemptCount: 0, firstPassAt: 0 };
  }
  const entry = evidenceStore[taskId];
  if (!Number.isFinite(Number(entry.lockedAt))) entry.lockedAt = 0;
  if (!Number.isFinite(Number(entry.firstTestAt))) entry.firstTestAt = 0;
  if (!Number.isFinite(Number(entry.attemptCount))) entry.attemptCount = 0;
  if (!Number.isFinite(Number(entry.firstPassAt))) entry.firstPassAt = 0;
  if (typeof entry.strategy !== 'string') entry.strategy = '';
  return entry;
}

function coreStore() {
  return readJSON(CORE_STORAGE_KEY);
}

function coreSessionState(sessionId) {
  const core = coreStore();
  return core[sessionId] && typeof core[sessionId] === 'object' ? core[sessionId] : {};
}

function deadlineFor(session, coreState) {
  return Number(coreState.startedAt || 0) + Number(session.duration || 60) * 60_000;
}

function strategyIsValid(entry) {
  return String(entry.strategy || '').trim().length >= MIN_STRATEGY_CHARS && Number(entry.lockedAt || 0) > 0;
}

function taskHadPriorTest(coreState, taskId) {
  return Boolean(coreState.lastResults?.[taskId]) || Boolean(coreState.passedTasks?.[taskId]);
}

function syncPassEvidence() {
  let changed = false;
  const core = coreStore();
  for (const session of readinessSessions) {
    const sessionState = core[session.id] || {};
    for (const task of session.tasks) {
      const entry = evidenceFor(task.id);
      const passAt = Number(sessionState.passedTasks?.[task.id] || 0);
      if (entry.lockedAt && passAt && !entry.firstPassAt) {
        entry.firstPassAt = passAt;
        changed = true;
      }
    }
  }
  if (changed) saveEvidence();
}

function taskEvidencePass(task) {
  const session = taskToSession.get(task.id);
  if (!session) return false;
  const core = coreSessionState(session.id);
  const entry = evidenceFor(task.id);
  if (!strategyIsValid(entry) || !core.startedAt) return false;
  const deadline = deadlineFor(session, core);
  return entry.lockedAt >= core.startedAt && entry.lockedAt <= deadline;
}

function sessionEvidencePass(session) {
  return session.tasks.every(taskEvidencePass);
}

function evidenceMetrics() {
  const tasks = readinessSessions.flatMap(session => session.tasks);
  const taskPassed = tasks.filter(taskEvidencePass).length;
  const firstPassCount = tasks.filter(task => {
    const session = taskToSession.get(task.id);
    const core = coreSessionState(session.id);
    const entry = evidenceFor(task.id);
    return taskEvidencePass(task) && Boolean(core.passedTasks?.[task.id]) && Number(entry.attemptCount) === 1;
  }).length;
  const attempts = tasks.reduce((sum, task) => sum + Number(evidenceFor(task.id).attemptCount || 0), 0);
  const sessionPassed = readinessSessions.filter(sessionEvidencePass).length;
  return {
    taskPassed,
    taskTotal: tasks.length,
    firstPassCount,
    attempts,
    sessionPassed,
    sessionTotal: readinessSessions.length,
    pass: taskPassed === tasks.length && sessionPassed === readinessSessions.length
  };
}

function evidenceHTML(task) {
  const session = taskToSession.get(task.id);
  const core = coreSessionState(session.id);
  const entry = evidenceFor(task.id);
  const ended = Boolean(core.endedAt);
  const locked = Boolean(entry.lockedAt);
  const priorTestWithoutEvidence = !locked && taskHadPriorTest(core, task.id);
  const tooLate = locked && core.startedAt && entry.lockedAt > deadlineFor(session, core);
  const stateLabel = priorTestWithoutEvidence
    ? 'trace absente : tâche déjà testée avant V1.26'
    : locked
      ? (tooLate ? 'stratégie verrouillée hors délai' : 'stratégie verrouillée avant le premier test')
      : ended
        ? 'trace non recueillie pendant la session'
        : 'à formuler avant le premier test';
  const disabled = locked || ended || priorTestWithoutEvidence;
  const attemptsLabel = locked ? ` · ${Number(entry.attemptCount || 0)} lancement(s) de tests` : '';
  return `<section class="brg-written brg-recognition-evidence" data-brg-evidence-block="${escapeHTML(task.id)}">
    <div class="page-kicker">V1.26 · preuve de reconnaissance</div>
    <h4>Avant de tester : quelle stratégie vas-tu essayer ?</h4>
    <p>En 2 à 4 phrases, indique la représentation ou structure que tu comptes utiliser, l'idée de l'algorithme et au moins un cas limite à surveiller. Aucun nom de chapitre n'est demandé.</p>
    <textarea class="reflection-editor" data-brg-evidence-strategy="${escapeHTML(task.id)}" ${disabled ? 'disabled' : ''} placeholder="Je représente… Ma stratégie consiste à… Je vérifierai notamment…">${escapeHTML(entry.strategy || '')}</textarea>
    <p class="tiny"><strong>${escapeHTML(stateLabel)}</strong>${escapeHTML(attemptsLabel)} · minimum ${MIN_STRATEGY_CHARS} caractères avant le premier lancement des tests.</p>
  </section>`;
}

function patchTasks(root) {
  for (const session of readinessSessions) {
    for (const task of session.tasks) {
      const article = root.querySelector(`#${CSS.escape(task.id)}`);
      if (!article || article.querySelector('[data-brg-evidence-block]')) continue;
      const editorShell = article.querySelector('.editor-shell');
      if (!editorShell) continue;
      editorShell.insertAdjacentHTML('beforebegin', evidenceHTML(task));
    }
  }
}

function patchHeader(root) {
  const kicker = root.querySelector('.brg-header .page-kicker');
  if (kicker && /V1\.25/.test(kicker.textContent || '')) {
    kicker.textContent = 'V1.26 · Bac Readiness Gate T1 → T11 · Recognition Evidence';
  }
}

function setTextIfChanged(node, value) {
  if (node && node.textContent !== value) node.textContent = value;
}

function patchSummary(root) {
  const summary = root.querySelector('.brg-summary');
  if (!summary) return;
  const metrics = evidenceMetrics();
  const grid = summary.querySelector('.brg-summary-grid');
  if (grid && !grid.querySelector('[data-brg-evidence-summary]')) {
    grid.insertAdjacentHTML('beforeend', `<div class="brg-summary-card" data-brg-evidence-summary><strong>${metrics.taskPassed}/${metrics.taskTotal}</strong><span>stratégies déclarées avant le premier test</span></div>`);
  } else if (grid) {
    setTextIfChanged(grid.querySelector('[data-brg-evidence-summary] strong'), `${metrics.taskPassed}/${metrics.taskTotal}`);
  }
  if (grid && !grid.querySelector('[data-brg-first-pass-summary]')) {
    grid.insertAdjacentHTML('beforeend', `<div class="brg-summary-card" data-brg-first-pass-summary><strong>${metrics.firstPassCount}/${metrics.taskTotal}</strong><span>tâches validées dès le premier lancement</span></div>`);
  } else if (grid) {
    setTextIfChanged(grid.querySelector('[data-brg-first-pass-summary] strong'), `${metrics.firstPassCount}/${metrics.taskTotal}`);
  }

  const gate = summary.querySelector('.brg-gate');
  if (!gate) return;
  if (!gate.dataset.corePass) gate.dataset.corePass = gate.dataset.pass || 'false';
  const corePass = gate.dataset.corePass === 'true';
  const finalPass = corePass && metrics.pass;
  gate.dataset.pass = String(finalPass);

  const chip = summary.querySelector('.section-head .chip');
  if (chip) {
    const chipText = finalPass ? 'Gate vert' : 'Gate non franchi';
    setTextIfChanged(chip, chipText);
    chip.classList.toggle('ok', finalPass);
  }

  const strong = gate.querySelector('strong');
  if (strong) {
    let message = 'Le gate reste ouvert.';
    if (finalPass) {
      message = 'Bac Readiness Gate V1.26 franchi sur le périmètre du site.';
    } else if (corePass && !metrics.pass) {
      message = `Le gate reste ouvert : ${metrics.taskPassed}/${metrics.taskTotal} preuves de reconnaissance recueillies dans le temps.`;
    }
    setTextIfChanged(strong, message);
  }
}

function patchRoot() {
  const root = document.querySelector('#bac-readiness-gate');
  if (!root) return;
  syncPassEvidence();
  patchHeader(root);
  patchTasks(root);
  patchSummary(root);
}

function schedulePatch() {
  if (patchQueued) return;
  patchQueued = true;
  queueMicrotask(() => {
    patchQueued = false;
    patchRoot();
  });
}

function handleStrategyInput(event) {
  const area = event.target.closest?.('[data-brg-evidence-strategy]');
  if (!area) return;
  const taskId = area.dataset.brgEvidenceStrategy;
  const entry = evidenceFor(taskId);
  if (entry.lockedAt) return;
  entry.strategy = area.value;
  saveEvidence();
}

function handleRunCapture(event) {
  const button = event.target.closest?.('[data-brg-run]');
  if (!button) return;
  const taskId = button.dataset.brgRun;
  const session = taskToSession.get(taskId);
  if (!session) return;
  const core = coreSessionState(session.id);
  if (!core.startedAt || core.endedAt) return;

  const entry = evidenceFor(taskId);
  if (!entry.lockedAt && taskHadPriorTest(core, taskId)) {
    showToast(`${taskId} a déjà reçu un retour de test : cette session ne peut plus produire une preuve V1.26 pour cette tâche.`);
    return;
  }

  const now = Date.now();
  if (!entry.lockedAt) {
    const area = document.querySelector(`[data-brg-evidence-strategy="${CSS.escape(taskId)}"]`);
    const strategy = String(area?.value ?? entry.strategy ?? '').trim();
    if (strategy.length < MIN_STRATEGY_CHARS) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast(`Avant le premier test de ${taskId}, formule ta stratégie (${MIN_STRATEGY_CHARS} caractères minimum).`);
      area?.focus();
      return;
    }
    entry.strategy = strategy;
    entry.lockedAt = now;
    entry.firstTestAt = now;
    if (area) area.disabled = true;
  }

  entry.attemptCount = Number(entry.attemptCount || 0) + 1;
  saveEvidence();
  schedulePatch();
}

function handleResetAfter(event) {
  const button = event.target.closest?.('[data-brg-reset-all]');
  if (!button) return;
  setTimeout(() => {
    const core = coreStore();
    const hasCampaignState = readinessSessions.some(session => {
      const s = core[session.id];
      return Boolean(s?.startedAt || s?.endedAt || Object.keys(s?.passedTasks || {}).length || Object.keys(s?.lastResults || {}).length);
    });
    if (!hasCampaignState) {
      clearEvidence();
      schedulePatch();
    }
  }, 0);
}

document.addEventListener('input', handleStrategyInput);
document.addEventListener('click', handleRunCapture, true);
document.addEventListener('click', handleResetAfter);
new MutationObserver(schedulePatch).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('hashchange', schedulePatch);
window.addEventListener('python-forge:track-change', schedulePatch);
setTimeout(schedulePatch, 0);
