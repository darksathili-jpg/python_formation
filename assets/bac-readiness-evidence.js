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
    evidenceStore[taskId] = { strategy: '', lockedAt: 0, firstTestAt: 0 };
  }
  return evidenceStore[taskId];
}

function coreSessionState(sessionId) {
  const core = readJSON(CORE_STORAGE_KEY);
  return core[sessionId] && typeof core[sessionId] === 'object' ? core[sessionId] : {};
}

function deadlineFor(session, coreState) {
  return Number(coreState.startedAt || 0) + Number(session.duration || 60) * 60_000;
}

function strategyIsValid(entry) {
  return String(entry.strategy || '').trim().length >= MIN_STRATEGY_CHARS && Number(entry.lockedAt || 0) > 0;
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
  const taskTotal = readinessSessions.reduce((sum, session) => sum + session.tasks.length, 0);
  const taskPassed = readinessSessions.flatMap(session => session.tasks).filter(taskEvidencePass).length;
  const sessionPassed = readinessSessions.filter(sessionEvidencePass).length;
  return {
    taskPassed,
    taskTotal,
    sessionPassed,
    sessionTotal: readinessSessions.length,
    pass: taskPassed === taskTotal && sessionPassed === readinessSessions.length
  };
}

function evidenceHTML(task) {
  const session = taskToSession.get(task.id);
  const core = coreSessionState(session.id);
  const entry = evidenceFor(task.id);
  const ended = Boolean(core.endedAt);
  const locked = Boolean(entry.lockedAt);
  const tooLate = locked && core.startedAt && entry.lockedAt > deadlineFor(session, core);
  const legacyPass = Boolean(core.passedTasks?.[task.id]) && !locked;
  const stateLabel = legacyPass
    ? 'trace absente : tâche déjà testée avant V1.26'
    : locked
      ? (tooLate ? 'stratégie verrouillée hors délai' : 'stratégie verrouillée avant le premier test')
      : ended
        ? 'trace non recueillie pendant la session'
        : 'à formuler avant le premier test';
  const disabled = locked || ended;
  return `<section class="brg-written brg-recognition-evidence" data-brg-evidence-block="${escapeHTML(task.id)}">
    <div class="page-kicker">V1.26 · preuve de reconnaissance</div>
    <h4>Avant de tester : quelle stratégie vas-tu essayer ?</h4>
    <p>En 2 à 4 phrases, indique la représentation ou structure que tu comptes utiliser, l'idée de l'algorithme et au moins un cas limite à surveiller. Aucun nom de chapitre n'est demandé.</p>
    <textarea class="reflection-editor" data-brg-evidence-strategy="${escapeHTML(task.id)}" ${disabled ? 'disabled' : ''} placeholder="Je représente… Ma stratégie consiste à… Je vérifierai notamment…">${escapeHTML(entry.strategy || '')}</textarea>
    <p class="tiny"><strong>${escapeHTML(stateLabel)}</strong> · minimum ${MIN_STRATEGY_CHARS} caractères avant le premier lancement des tests.</p>
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

function patchSummary(root) {
  const summary = root.querySelector('.brg-summary');
  if (!summary) return;
  const metrics = evidenceMetrics();
  const grid = summary.querySelector('.brg-summary-grid');
  if (grid && !grid.querySelector('[data-brg-evidence-summary]')) {
    grid.insertAdjacentHTML('beforeend', `<div class="brg-summary-card" data-brg-evidence-summary><strong>${metrics.taskPassed}/${metrics.taskTotal}</strong><span>stratégies déclarées avant le premier test</span></div>`);
  } else if (grid) {
    const cardStrong = grid.querySelector('[data-brg-evidence-summary] strong');
    const value = `${metrics.taskPassed}/${metrics.taskTotal}`;
    if (cardStrong && cardStrong.textContent !== value) cardStrong.textContent = value;
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
    if (chip.textContent !== chipText) chip.textContent = chipText;
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
    if (strong.textContent !== message) strong.textContent = message;
  }
}

function patchRoot() {
  const root = document.querySelector('#bac-readiness-gate');
  if (!root) return;
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
  if (entry.lockedAt) return;
  const area = document.querySelector(`[data-brg-evidence-strategy="${CSS.escape(taskId)}"]`);
  const strategy = String(area?.value ?? entry.strategy ?? '').trim();
  if (strategy.length < MIN_STRATEGY_CHARS) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showToast(`Avant le premier test de ${taskId}, formule ta stratégie (${MIN_STRATEGY_CHARS} caractères minimum).`);
    area?.focus();
    return;
  }

  const now = Date.now();
  entry.strategy = strategy;
  entry.lockedAt = now;
  entry.firstTestAt = now;
  saveEvidence();
  if (area) area.disabled = true;
  schedulePatch();
}

document.addEventListener('input', handleStrategyInput);
document.addEventListener('click', handleRunCapture, true);
new MutationObserver(schedulePatch).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('hashchange', schedulePatch);
window.addEventListener('python-forge:track-change', schedulePatch);
setTimeout(schedulePatch, 0);
