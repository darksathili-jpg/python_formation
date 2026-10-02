import { bacWrittenCorpus } from './bac-written-corpus.js';

// PYTHON//FORGE — Sujet blanc UX V1.31.4
// Corrige le verrouillage du sélecteur après une session terminée et garde le PDF synchronisé.
const STORAGE_KEY = 'python-forge-bac-written-v1';
const MOCK_DURATION_MS = 210 * 60_000;
let reloadQueued = false;

function readState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function writeState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { /* la session continue même si le stockage local est indisponible */ }
}

function mockStatus() {
  const mock = readState().mock || {};
  const started = Number(mock.startedAt || 0);
  const ended = Boolean(mock.endedAt) || Boolean(started && started + MOCK_DURATION_MS <= Date.now());
  return { mock, started: Boolean(started), ended, active: Boolean(started) && !ended };
}

function subjectById(id) {
  return bacWrittenCorpus.find(subject => subject.id === id && subject.year === 2026 && subject.exerciseCount === 3);
}

function officialLink() {
  const select = document.querySelector('[data-written-mock-subject]');
  const panel = select?.closest('.written-panel');
  return panel?.querySelector('.written-filterbar label:nth-child(2) a.btn') || null;
}

function syncOfficialLink(select) {
  const subject = subjectById(select?.value);
  const link = officialLink();
  if (!subject || !link) return;
  link.href = subject.url;
  link.setAttribute('aria-label', `Ouvrir le PDF officiel : ${subject.zone} · ${subject.session}`);
}

function ensureHint(select, text, kind) {
  const label = select.closest('label');
  if (!label) return;
  let hint = label.querySelector('.written-mock-subject-hint');
  if (!hint) {
    hint = document.createElement('small');
    hint.className = 'written-mock-subject-hint';
    label.append(hint);
  }
  hint.dataset.state = kind;
  if (hint.textContent !== text) hint.textContent = text;
}

function ensureRestartAction(select) {
  const panel = select.closest('.written-panel');
  const filterbar = select.closest('.written-filterbar');
  if (!panel || !filterbar) return;
  let row = panel.querySelector('.written-mock-session-actions');
  if (!row) {
    row = document.createElement('div');
    row.className = 'written-mock-session-actions';
    row.innerHTML = '<button class="btn" type="button" data-written-mock-restart>↻ Recommencer ce sujet</button><span>La session précédente reste visible tant que tu ne choisis pas un nouveau départ.</span>';
    filterbar.insertAdjacentElement('afterend', row);
  }
}

function removeRestartAction(select) {
  select.closest('.written-panel')?.querySelector('.written-mock-session-actions')?.remove();
}

function enhanceMockUI() {
  const select = document.querySelector('[data-written-mock-subject]');
  if (!select) return;
  const { started, ended, active } = mockStatus();

  // Le sujet est immuable uniquement pendant un chrono effectivement en cours.
  select.disabled = active;
  select.toggleAttribute('aria-disabled', active);

  if (active) {
    ensureHint(select, 'Sujet verrouillé pendant le chronomètre. Termine la session avant d’en choisir un autre.', 'active');
    removeRestartAction(select);
  } else if (ended) {
    ensureHint(select, 'Session terminée : choisis un autre sujet pour repartir avec un nouveau chronomètre de 3 h 30.', 'ended');
    ensureRestartAction(select);
  } else if (!started) {
    ensureHint(select, 'Tu peux changer de sujet avant le départ ; le PDF officiel se met à jour immédiatement.', 'ready');
    removeRestartAction(select);
  }

  syncOfficialLink(select);
}

function resetMockSession(subjectId) {
  if (reloadQueued) return;
  reloadQueued = true;
  const state = readState();
  state.mock = {
    subjectId,
    startedAt: 0,
    endedAt: 0,
    notes: {},
    checkpoints: [],
    postmortem: []
  };
  state.tab = 'mock';
  writeState(state);
  location.reload();
}

document.addEventListener('change', event => {
  const select = event.target.closest?.('[data-written-mock-subject]');
  if (!select) return;
  const selectedId = select.value;
  const { ended, active } = mockStatus();

  if (active) return;

  if (ended) {
    // Le gestionnaire V1.29 enregistre d'abord la valeur dans son état mémoire ;
    // on réinitialise ensuite la session pour ne pas laisser startedAt verrouiller le nouveau sujet.
    setTimeout(() => resetMockSession(selectedId), 0);
    return;
  }

  syncOfficialLink(select);
}, true);

document.addEventListener('click', event => {
  const restart = event.target.closest?.('[data-written-mock-restart]');
  if (!restart) return;
  event.preventDefault();
  const select = document.querySelector('[data-written-mock-subject]');
  if (select) resetMockSession(select.value);
});

const view = document.querySelector('#view');
if (view) {
  new MutationObserver(enhanceMockUI).observe(view, { childList: true, subtree: true });
}
window.addEventListener('pageshow', enhanceMockUI);
setTimeout(enhanceMockUI, 0);
