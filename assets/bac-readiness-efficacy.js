import { readinessSessions } from './bac-readiness.js';
import { evaluateBacReadiness, efficacyPolicy, BAC_READINESS_EFFICACY_VERSION } from './bac-readiness-efficacy-model.js';

const CORE_KEY = 'python-forge-bac-readiness-v1';
const EVIDENCE_KEY = 'python-forge-bac-readiness-evidence-v1';
const REFLECTION_KEY = 'python-forge-bac-readiness-efficacy-v1';
let queued = false;

function readJSON(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch { return {}; }
}
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function reflectionStore() { return readJSON(REFLECTION_KEY); }
function saveReflection(store) { localStorage.setItem(REFLECTION_KEY, JSON.stringify(store)); }

function statusLabel(status) {
  if (status === 'ready') return ['PRÊT SUR LE PÉRIMÈTRE MESURÉ', 'ok'];
  if (status === 'consolidate') return ['À CONSOLIDER', 'warn'];
  return ['MESURE INCOMPLÈTE', ''];
}

function panelHTML() {
  const core = readJSON(CORE_KEY);
  const evidence = readJSON(EVIDENCE_KEY);
  const reflections = reflectionStore();
  const report = evaluateBacReadiness(readinessSessions, core, evidence, reflections);
  const [label, cls] = statusLabel(report.status);
  const rows = [
    ['Sessions terminées', report.axes.sessions, '4 parcours chronométrés terminés'],
    ['Reconnaissance autonome', report.axes.recognition, 'stratégie formulée et verrouillée avant le premier test'],
    ['Code sous contrainte', report.axes.code, '8 tâches validées avant l’échéance'],
    ['Efficacité des essais', report.axes.efficiency, `moyenne ≤ ${efficacyPolicy.efficientAttemptsAverageMax} lancements, aucun > ${efficacyPolicy.efficientAttemptsSingleMax}`],
    ['Raisonnement écrit', report.axes.written, `≥ ${efficacyPolicy.writtenMinChars} caractères + 3 critères sur 4`],
    ['Dialogue simulé', report.axes.dialogue, `3 réponses développées par session (≥ ${efficacyPolicy.dialogueMinChars} caractères)`],
    ['Analyse post-mortem', report.axes.postmortem, `≥ ${efficacyPolicy.postmortemMinChars} caractères par session`]
  ];
  return `<section id="brg-efficacy" class="lesson-block brg-efficacy">
    <div class="section-head"><div><div class="page-kicker">V${BAC_READINESS_EFFICACY_VERSION} · efficacité observable</div><h2>Le parcours est-il réellement mobilisable sans indice de chapitre ?</h2></div><span class="chip ${cls}">${label}</span></div>
    <p>Ce diagnostic ne prédit pas une note au baccalauréat. Il mesure uniquement des traces observables produites dans ces quatre parcours : choix initial, réussite, temps, essais, argumentation et retour sur erreur.</p>
    <div class="brg-efficacy-grid">${rows.map(([name,ok,detail]) => `<article class="brg-efficacy-card" data-pass="${ok}"><strong>${ok?'✓':'○'} ${escapeHTML(name)}</strong><span>${escapeHTML(detail)}</span></article>`).join('')}</div>
    <div class="brg-efficacy-summary"><strong>${report.passedAxes}/${report.totalAxes} axes satisfaits</strong><span>${report.totalAttempts} lancements de tests · moyenne ${report.averageAttempts.toFixed(1)} · maximum ${report.maxAttempts}</span></div>
    <h3>Post-mortem des quatre sessions</h3>
    <p class="muted">Après chaque session terminée, explique ce que tu avais reconnu correctement, l’erreur la plus coûteuse éventuelle, et ce que tu changerais au prochain sujet. Une simple phrase générique ne valide pas cet axe.</p>
    <div class="brg-postmortem-grid">${readinessSessions.map(session => {
      const ended = Boolean(core[session.id]?.endedAt);
      const value = reflections[session.id]?.postmortem || '';
      return `<label class="brg-postmortem"><strong>${session.id} · ${escapeHTML(session.title)}</strong><textarea data-brg-postmortem="${session.id}" ${ended?'':'disabled'} placeholder="${ended?'Je pensais que… J’ai choisi… Mon erreur principale… Au prochain sujet…':'Disponible après la fin de la session.'}">${escapeHTML(value)}</textarea><small>${value.trim().length}/${efficacyPolicy.postmortemMinChars} caractères minimum</small></label>`;
    }).join('')}</div>
  </section>`;
}

function enhance() {
  const root = document.querySelector('#bac-readiness-gate');
  if (!root) return;
  const signature = [localStorage.getItem(CORE_KEY)||'', localStorage.getItem(EVIDENCE_KEY)||'', localStorage.getItem(REFLECTION_KEY)||''].join('|');
  const existing = document.querySelector('#brg-efficacy');
  if (existing?.dataset.signature === signature) return;
  if (existing) existing.remove();
  const actions = root.querySelector('.brg-actions:last-of-type');
  if (actions) actions.insertAdjacentHTML('beforebegin', panelHTML());
  else root.insertAdjacentHTML('beforeend', panelHTML());
  const inserted = document.querySelector('#brg-efficacy');
  if (inserted) inserted.dataset.signature = signature;
}

function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; enhance(); });
}

document.addEventListener('input', event => {
  const area = event.target.closest?.('[data-brg-postmortem]');
  if (!area) return;
  const store = reflectionStore();
  const id = area.dataset.brgPostmortem;
  store[id] = { ...(store[id] || {}), postmortem: area.value, updatedAt: Date.now() };
  saveReflection(store);
  const small = area.parentElement?.querySelector('small');
  if (small) small.textContent = `${area.value.trim().length}/${efficacyPolicy.postmortemMinChars} caractères minimum`;
});

document.addEventListener('change', queue);
document.addEventListener('click', event => {
  if (event.target.closest?.('[data-brg-reset-all]')) {
    localStorage.removeItem(REFLECTION_KEY);
    setTimeout(queue, 80);
    return;
  }
  if (event.target.closest?.('[data-brg-run], [data-brg-finish], [data-brg-open], [data-brg-criterion], [data-brg-dialogue]')) setTimeout(queue, 80);
});
window.addEventListener('hashchange', queue);
new MutationObserver(queue).observe(document.querySelector('#view') || document.body, { childList:true, subtree:true });
queue();
