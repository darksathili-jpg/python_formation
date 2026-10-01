import { view, escapeHTML, getRoute, showToast } from './app-shell.js';
import {
  BAC_EXAM_STUDIO_CATALOG_VERSION,
  bacExamStudioPackCatalog,
  bacExamStudioPackMetaByKey,
  bacExamStudioPackKeysBySubject,
  firstPackKey,
  loadPack,
  loadedPackCount
} from './bac-exam-studio-catalog.js';

export const BAC_EXAM_STUDIO_VERSION = '1.31.0';
const STORAGE_KEY = 'python-forge-bac-exam-studio-v1';
const SAVE_DELAY_MS = 320;
const ERROR_LABELS = {
  none: 'Aucune difficulté majeure', recognition: 'Reconnaissance de la notion', knowledge: 'Connaissance manquante',
  method: 'Méthode / stratégie', implementation: 'Implémentation / syntaxe', justification: 'Justification / rédaction',
  verification: 'Vérification / test', time: 'Gestion du temps'
};
let active = false;
let saveTimer = 0;
let questionStartedAt = Date.now();
let longTaskObserver = null;
let currentPack = null;
let packLoadToken = 0;
const perf = { lastSyncRenderMs: 0, lastFrameMs: 0, longTasks: 0, maxLongTaskMs: 0 };

function defaults() {
  return {
    packKey: firstPackKey(), questionId: '', answers: {}, strategies: {}, telemetry: {},
    hints: {}, revealed: {}, criteria: {}, errorTypes: {}, elapsed: {},
    mobilePanel: 'sujet', sourceOpen: false, auditOpen: false
  };
}
function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...defaults(), ...stored, answers: stored.answers || {}, strategies: stored.strategies || {}, telemetry: stored.telemetry || {} };
  } catch { return defaults(); }
}
const state = loadState();
function saveNow() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { /* mode privé ou quota : la séance continue */ }
}
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, SAVE_DELAY_MS); }
function pack() { return currentPack?.key === state.packKey ? currentPack : null; }
function question(p = pack()) { return p?.questions.find(item => item.id === state.questionId) || p?.questions?.[0]; }
function responseKey(p, item) { return `${p.key}:${item.id}`; }
function answerFor(p, item) { return state.answers[responseKey(p, item)] || ''; }
function strategyFor(p, item) { return state.strategies[responseKey(p, item)] || ''; }
function hintsFor(p, item) { return Number(state.hints[responseKey(p, item)] || 0); }
function revealedFor(p, item) { return Boolean(state.revealed[responseKey(p, item)]); }
function checkedFor(p, item) { return new Set(state.criteria[responseKey(p, item)] || []); }
function telemetryFor(p, item) {
  const key = responseKey(p, item);
  if (!state.telemetry[key]) state.telemetry[key] = { packKey: p.key, questionId: item.id, sourceQuestion: item.sourceQuestion || item.number, visits: 0, hintEvents: [], criteriaEvents: [] };
  return state.telemetry[key];
}
function markSeen(p, item, countVisit = false) {
  const t = telemetryFor(p, item), now = Date.now();
  if (!t.firstSeenAt) t.firstSeenAt = now;
  if (countVisit) { t.visits = Number(t.visits || 0) + 1; t.lastVisitAt = now; }
  saveSoon();
}
function completed(p, item) {
  const checked = checkedFor(p, item);
  return revealedFor(p, item) && checked.size >= Math.min(2, item.criteria.length);
}
function packProgress(p) {
  const done = p.questions.filter(item => completed(p, item)).length;
  return { done, total: p.questions.length, pct: Math.round(done * 100 / Math.max(1, p.questions.length)) };
}
function flushQuestionTime() {
  const p = pack(), item = question(p);
  if (!p || !item) return;
  const key = responseKey(p, item);
  const delta = Math.max(0, Date.now() - questionStartedAt);
  if (delta < 20 * 60_000) state.elapsed[key] = Number(state.elapsed[key] || 0) + delta;
  questionStartedAt = Date.now();
}
function resetQuestionClock() { questionStartedAt = Date.now(); }
function minutesFor(p, item) { return Math.max(0, Math.round(Number(state.elapsed[responseKey(p, item)] || 0) / 60000)); }
function htmlList(items, ordered = false) {
  const tag = ordered ? 'ol' : 'ul';
  return `<${tag}>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</${tag}>`;
}
function codeOrText(text, type) {
  return type === 'code' ? `<pre class="studio-code"><code>${escapeHTML(text)}</code></pre>` : `<p>${escapeHTML(text)}</p>`;
}
function sourceDrawerHTML(p) {
  if (!state.sourceOpen) return '';
  return `<aside class="studio-source-drawer" role="dialog" aria-modal="false" aria-label="Sujet officiel">
    <div class="studio-source-head"><div><div class="page-kicker">Source officielle · chargement à la demande</div><h3>Sujet Eduscol</h3></div><button type="button" class="studio-icon" data-studio-source-close aria-label="Fermer le sujet officiel">×</button></div>
    <p class="tiny">Le Studio est autonome : ce document n’est utile que pour vérifier la mise en page, une figure ou la formulation officielle. Aucun PDF n’est chargé avant l’ouverture de ce panneau.</p>
    <iframe class="studio-source-frame" title="Sujet officiel de baccalauréat" loading="lazy" src="${escapeHTML(p.sourceUrl)}"></iframe>
    <a class="btn" href="${escapeHTML(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ouvrir le PDF si l’intégration est bloquée ↗</a>
  </aside>`;
}
function packSelectorHTML(p) {
  return `<label class="studio-pack-select"><span>Pack d’entraînement · 36 exercices Gold 2026</span><select data-studio-pack>${bacExamStudioPackCatalog.map(item => `<option value="${escapeHTML(item.key)}" ${item.key === p.key ? 'selected' : ''}>${item.year} · ${escapeHTML(item.zone)} · ${escapeHTML(item.session)} · Ex. ${item.exercise} · ${escapeHTML(item.title)}</option>`).join('')}</select></label>`;
}
function navHTML(p, current) {
  return `<nav class="studio-question-nav" aria-label="Questions de l’exercice">${p.sections.map(section => `<section><h4>${escapeHTML(section.title)}</h4><div>${section.questions.map(id => {
    const item = p.questions.find(q => q.id === id); if (!item) return '';
    const isCurrent = item.id === current.id, isDone = completed(p, item);
    return `<button type="button" data-studio-question="${item.id}" class="${isCurrent ? 'current' : ''} ${isDone ? 'done' : ''}" aria-current="${isCurrent ? 'step' : 'false'}"><span>${escapeHTML(item.number)}</span><small>${isDone ? 'consolidé' : revealedFor(p, item) ? 'corrigé' : 'à traiter'}</small></button>`;
  }).join('')}</div></section>`).join('')}</nav>`;
}
function briefPaneHTML(p, item) {
  return `<section class="studio-pane studio-brief" data-studio-pane="sujet">
    <div class="studio-pane-head"><span class="studio-pane-index">01</span><div><div class="page-kicker">Dossier intégré</div><h3>Sujet</h3></div></div>
    <div class="studio-context">${p.context.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('')}</div>
    ${navHTML(p, item)}
    <article class="studio-question-card"><div class="studio-question-meta"><span>Question ${escapeHTML(item.number)}</span><span>${item.answerType === 'code' ? 'code / requête' : 'réponse rédigée'}</span></div><h3 id="studio-question-title" tabindex="-1">À toi de jouer</h3><p class="studio-prompt">${escapeHTML(item.prompt)}</p></article>
  </section>`;
}
function copyPaneHTML(p, item) {
  const key = responseKey(p, item), answer = answerFor(p, item), strategy = strategyFor(p, item), time = minutesFor(p, item), locked = revealedFor(p, item);
  return `<section class="studio-pane studio-copy" data-studio-pane="copie">
    <div class="studio-pane-head"><span class="studio-pane-index">02</span><div><div class="page-kicker">Production avant feedback</div><h3>Ma copie</h3></div></div>
    <div class="studio-copy-contract"><strong>Contrat Bac :</strong> réponds d’abord sans correction. Le Studio mesure aussi ta capacité à reconnaître seul la notion utile : écris ta stratégie avant de tester ta réponse.</div>
    <label class="studio-answer-label"><span>Avant de répondre · notion / stratégie envisagée</span><input data-studio-strategy="${escapeHTML(key)}" class="studio-strategy" value="${escapeHTML(strategy)}" ${locked ? 'disabled' : ''} placeholder="Ex. : je reconnais un parcours en largeur car…"></label>
    <label class="studio-answer-label"><span>Réponse à la question ${escapeHTML(item.number)}</span><textarea data-studio-answer="${escapeHTML(key)}" class="studio-answer ${item.answerType === 'code' ? 'is-code' : ''}" ${item.answerType === 'code' ? 'spellcheck="false"' : 'spellcheck="true"'} placeholder="${item.answerType === 'code' ? 'Écris ici le code ou la requête que tu mettrais sur ta copie…' : 'Rédige ici une réponse complète, justifiée et exploitable sur une copie…'}">${escapeHTML(answer)}</textarea></label>
    <div class="studio-copy-footer"><span data-studio-save-status>● sauvegarde locale</span><span>${answer.trim().length} caractères</span><span>≈ ${time} min actives</span></div>
    <div class="studio-copy-actions"><button class="btn" type="button" data-studio-prev>← Question précédente</button><button class="btn primary" type="button" data-studio-next>Question suivante →</button></div>
  </section>`;
}
function correctionHTML(item) {
  const c = item.correction;
  return `<div class="studio-correction" aria-live="polite">
    <section><div class="studio-correction-step">1</div><div><h4>Ce qu’il fallait repérer</h4><p>${escapeHTML(c.recognize)}</p></div></section>
    <section><div class="studio-correction-step">2</div><div><h4>Raisonnement</h4>${htmlList(c.reasoning, true)}</div></section>
    <section><div class="studio-correction-step">3</div><div><h4>Réponse attendue</h4>${codeOrText(c.expected, item.answerType)}</div></section>
    <section><div class="studio-correction-step">4</div><div><h4>Pièges fréquents</h4>${htmlList(c.traps)}</div></section>
    <section><div class="studio-correction-step">5</div><div><h4>Rédaction Bac</h4><p>${escapeHTML(c.language)}</p></div></section>
  </div>`;
}
function coachPaneHTML(p, item) {
  const key = responseKey(p, item), hints = hintsFor(p, item), revealed = revealedFor(p, item), answer = answerFor(p, item), checked = checkedFor(p, item);
  const canReveal = answer.trim().length >= item.minChars || hints >= Math.min(2, item.hints.length);
  return `<section class="studio-pane studio-coach" data-studio-pane="correction">
    <div class="studio-pane-head"><span class="studio-pane-index">03</span><div><div class="page-kicker">Aides graduées + correction</div><h3>Coach</h3></div></div>
    <div class="studio-hints"><div class="studio-hint-head"><strong>Indices</strong><span>${hints}/${item.hints.length} utilisés</span></div>${item.hints.slice(0, hints).map((hint, index) => `<div class="studio-hint"><b>Indice ${index + 1}</b><p>${escapeHTML(hint)}</p></div>`).join('')}${hints < item.hints.length ? `<button class="btn" type="button" data-studio-hint>Révéler l’indice ${hints + 1}</button>` : '<p class="tiny">Tous les indices ont été utilisés.</p>'}</div>
    <div class="studio-reveal-zone"><button class="btn primary" type="button" data-studio-reveal ${canReveal ? '' : 'disabled'}>${revealed ? 'Correction détaillée ouverte' : 'Comparer avec la correction détaillée'}</button>${!canReveal ? '<p class="tiny">Écris une tentative ou consulte au moins deux indices avant d’ouvrir la correction.</p>' : ''}</div>
    ${revealed ? `${correctionHTML(item)}<div class="studio-selfcheck"><h4>Barème d’entraînement — auto-vérification</h4><p class="tiny">Ce n’est pas un barème officiel ni une note prédictive. Coche uniquement ce qui apparaît réellement dans ta réponse.</p>${item.criteria.map((criterion, index) => `<label><input type="checkbox" data-studio-criterion="${index}" ${checked.has(index) ? 'checked' : ''}><span>${escapeHTML(criterion)}</span></label>`).join('')}<label class="studio-error-label"><span>Si quelque chose a bloqué, la cause principale était :</span><select data-studio-error><option value="">— choisir après réflexion —</option>${Object.entries(ERROR_LABELS).map(([value, label]) => `<option value="${value}" ${state.errorTypes[key] === value ? 'selected' : ''}>${escapeHTML(label)}</option>`).join('')}</select></label></div><div class="studio-language-rubric"><strong>2 points de langue en 2027 : réflexe à installer</strong><span>orthographe / syntaxe</span><span>raisonnement formulé</span><span>vocabulaire NSI précis</span></div><p class="studio-source-credit">Correction pédagogique réécrite et recalculée · contrôle : ${escapeHTML(p.audit?.correctionMode === 'cross-checked' ? 'correction externe + recalcul' : 'recalcul indépendant')}. <a href="${escapeHTML(p.correctionAuditUrl)}" target="_blank" rel="noopener noreferrer">Source de contrôle ↗</a></p>` : ''}
  </section>`;
}
function diagnosticHTML(p) {
  const corrected = p.questions.filter(item => revealedFor(p, item));
  if (!corrected.length) return '<p class="tiny">Le diagnostic apparaîtra après les premières corrections. Il ne calcule jamais de note prédictive.</p>';
  const counts = {};
  for (const item of corrected) {
    const value = state.errorTypes[responseKey(p, item)];
    if (value && value !== 'none') counts[value] = (counts[value] || 0) + 1;
  }
  const rows = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  return rows.length ? `<div class="studio-diagnostic-list">${rows.map(([id,count]) => `<div><span>${escapeHTML(ERROR_LABELS[id] || id)}</span><b>${count}</b></div>`).join('')}</div>` : '<p class="tiny">Aucune cause de difficulté n’a encore été déclarée. Continue à renseigner le post-mortem après correction.</p>';
}
function perfAuditHTML(p) {
  if (!state.auditOpen) return '';
  const root = document.querySelector('.bac-exam-studio-shell');
  const nodes = root?.querySelectorAll('*').length || 0;
  const packBytes = new TextEncoder().encode(JSON.stringify(p)).length;
  const storageBytes = new TextEncoder().encode(localStorage.getItem(STORAGE_KEY) || '').length;
  const checks = [
    ['Rendu synchrone', perf.lastSyncRenderMs, 50, 'ms'], ['Rendu jusqu’à la frame', perf.lastFrameMs, 100, 'ms'],
    ['Nœuds DOM Studio', nodes, 550, ''], ['Pack courant sérialisé', Math.round(packBytes/1024), 64, 'KiB'],
    ['État local élève', Math.round(storageBytes/1024), 256, 'KiB'], ['Plus longue tâche observée', Math.round(perf.maxLongTaskMs), 100, 'ms']
  ];
  return `<aside class="studio-audit" aria-label="Audit de performance"><div class="studio-source-head"><div><div class="page-kicker">Runtime Performance Gate</div><h3>Budget de performance</h3></div><button type="button" class="studio-icon" data-studio-audit-close aria-label="Fermer l’audit">×</button></div><p class="tiny">Mesures locales du navigateur. Les 36 packs sont découpés par sujet : seul le module demandé est importé et analysé par JavaScript.</p><div class="studio-audit-grid">${checks.map(([label,value,limit,unit]) => `<div data-pass="${value <= limit}"><span>${escapeHTML(label)}</span><b>${value}${unit ? ` ${unit}` : ''}</b><small>budget ≤ ${limit}${unit ? ` ${unit}` : ''}</small></div>`).join('')}</div><p class="tiny">Modules Gold chargés : ${loadedPackCount()}/36 · long tasks observées : ${perf.longTasks}. Aucun PDF n’est chargé pour travailler dans le Studio.</p></aside>`;
}
function mobileTabsHTML() {
  return `<nav class="studio-mobile-tabs" aria-label="Panneaux du Studio">${[['sujet','Sujet'],['copie','Ma copie'],['correction','Coach']].map(([id,label]) => `<button type="button" data-studio-mobile="${id}" class="${state.mobilePanel === id ? 'active' : ''}">${label}</button>`).join('')}</nav>`;
}
function studioHTML(p, item) {
  const progress = packProgress(p);
  return `<section class="bac-exam-studio-shell" data-mobile-panel="${escapeHTML(state.mobilePanel)}">
    <header class="studio-header"><div><div class="page-kicker">V1.31 · Bac Exam Studio · 36 exercices Gold 2026</div><h2>Le sujet, la copie et la correction dans une seule application.</h2><p>Pas de changement d’onglet obligatoire : dossier réécrit, réponse sauvegardée localement, reconnaissance de stratégie, indices gradués et correction question par question.</p></div><div class="studio-header-meta"><span>${escapeHTML(p.level)}</span><span>${p.points} pts sujet</span><span>≈ ${p.estimatedMinutes} min</span></div></header>
    <div class="studio-toolbar">${packSelectorHTML(p)}<div class="studio-progress-block"><div><span>${progress.done}/${progress.total} consolidées</span><strong>${progress.pct}%</strong></div><div class="studio-progress"><span style="width:${progress.pct}%"></span></div></div><div class="studio-toolbar-actions"><button class="btn" type="button" data-studio-source>Source officielle</button><button class="btn" type="button" data-studio-audit>Audit perf</button><button class="btn" type="button" data-studio-export>Exporter test élève zéro (.json)</button></div></div>
    <div class="studio-source-note"><strong>Pack autonome :</strong> ${escapeHTML(p.sourceNote)}</div>
    ${mobileTabsHTML()}
    <div class="studio-workspace">${briefPaneHTML(p,item)}${copyPaneHTML(p,item)}${coachPaneHTML(p,item)}</div>
    <footer class="studio-footer"><div><strong>Diagnostic d’apprentissage</strong>${diagnosticHTML(p)}</div><div><strong>Principe</strong><p class="tiny">Tentative → indices si nécessaire → correction expliquée → auto-vérification → cause de l’erreur. La télémétrie élève zéro reste locale jusqu’à l’export explicite.</p></div></footer>
    ${sourceDrawerHTML(p)}${perfAuditHTML(p)}
  </section>`;
}
function renderStudioLoading(label = 'Chargement du pack Gold…') {
  if (!active || getRoute().name !== 'written') return;
  const root = document.querySelector('#written-training-lab'); if (!root) return;
  const tabs = root.querySelector('.written-tabs'), hero = root.querySelector('.written-hero'); if (!tabs || !hero) return;
  [...root.children].forEach(child => { if (child !== hero && child !== tabs) child.remove(); });
  root.insertAdjacentHTML('beforeend', `<section class="bac-exam-studio-shell studio-loading" aria-live="polite"><div class="studio-header"><div><div class="page-kicker">V1.31 · chargement modulaire</div><h2>${escapeHTML(label)}</h2><p>Le corpus complet reste disponible hors ligne, mais seul le sujet choisi est analysé par le navigateur.</p></div></div></section>`);
}
function renderStudio({ focusQuestion = false } = {}) {
  if (!active || getRoute().name !== 'written') return;
  const root = document.querySelector('#written-training-lab'); if (!root) return;
  const tabs = root.querySelector('.written-tabs'), hero = root.querySelector('.written-hero'); if (!tabs || !hero) return;
  const p = pack(); if (!p) { renderStudioLoading(); return; }
  if (!p.questions.some(item => item.id === state.questionId)) state.questionId = p.questions[0]?.id || '';
  const item = question(p); if (!item) return;
  markSeen(p, item);
  const started = performance.now();
  performance.mark?.('bac-studio-render-start');
  [...root.children].forEach(child => { if (child !== hero && child !== tabs) child.remove(); });
  root.insertAdjacentHTML('beforeend', studioHTML(p,item));
  perf.lastSyncRenderMs = Math.round((performance.now() - started) * 10) / 10;
  performance.mark?.('bac-studio-render-end');
  try { performance.measure?.('bac-studio-render', 'bac-studio-render-start', 'bac-studio-render-end'); } catch {}
  const launcher = tabs.querySelector('[data-bac-studio-open]');
  tabs.querySelectorAll('button').forEach(button => button.classList.toggle('active', button === launcher));
  const frameStart = performance.now();
  requestAnimationFrame(() => {
    perf.lastFrameMs = Math.round((performance.now() - frameStart + perf.lastSyncRenderMs) * 10) / 10;
    if (focusQuestion) document.querySelector('#studio-question-title')?.focus({ preventScroll: false });
  });
}
async function ensurePack(packKey) {
  const token = ++packLoadToken;
  const loaded = await loadPack(packKey);
  if (token !== packLoadToken || state.packKey !== packKey) return null;
  currentPack = loaded;
  return loaded;
}
function ensureLaunchers() {
  if (getRoute().name !== 'written') { active = false; return; }
  const root = document.querySelector('#written-training-lab'); if (!root) return;
  const tabs = root.querySelector('.written-tabs'); if (!tabs) return;
  let launcher = tabs.querySelector('[data-bac-studio-open]');
  if (!launcher) {
    launcher = document.createElement('button'); launcher.type = 'button'; launcher.dataset.bacStudioOpen = 'true'; launcher.textContent = 'Bac Exam Studio';
    launcher.title = '36 exercices 2026 avec énoncé intégré, indices et correction détaillée';
    tabs.insertBefore(launcher, tabs.children[3] || null);
  }
  root.querySelectorAll('[data-written-guide-subject]').forEach(button => {
    const subjectId = button.dataset.writtenGuideSubject, keys = bacExamStudioPackKeysBySubject.get(subjectId) || [];
    if (!keys.length) return;
    const actions = button.closest('.written-actions');
    if (actions && !actions.querySelector('[data-bac-studio-subject]')) {
      const studioButton = document.createElement('button'); studioButton.type = 'button'; studioButton.className = 'btn';
      studioButton.dataset.bacStudioSubject = subjectId; studioButton.textContent = `Studio Gold · ${keys.length} ex.`; actions.append(studioButton);
    }
  });
  if (active && !root.querySelector('.bac-exam-studio-shell')) renderStudio();
}
function selectQuestion(id) {
  const p = pack(); if (!p?.questions.some(item => item.id === id)) return;
  flushQuestionTime(); state.questionId = id; resetQuestionClock();
  const item = question(p); if (item) markSeen(p, item, true);
  saveNow(); renderStudio({ focusQuestion: true });
}
function adjacentQuestion(delta) {
  const p = pack(), item = question(p); if (!p || !item) return;
  const index = p.questions.findIndex(q => q.id === item.id);
  const next = p.questions[Math.max(0, Math.min(p.questions.length - 1, index + delta))];
  if (next && next.id !== item.id) selectQuestion(next.id);
}
async function openStudio(packKey = '') {
  const target = packKey && bacExamStudioPackMetaByKey.has(packKey) ? packKey : (state.packKey && bacExamStudioPackMetaByKey.has(state.packKey) ? state.packKey : firstPackKey());
  if (active && pack()) flushQuestionTime();
  active = true; state.packKey = target; state.sourceOpen = false; state.auditOpen = false; saveNow(); resetQuestionClock();
  renderStudioLoading();
  try {
    const p = await ensurePack(target); if (!p) return;
    if (!p.questions.some(item => item.id === state.questionId)) state.questionId = p.questions[0]?.id || '';
    const item = question(p); if (item) markSeen(p, item, true);
    saveNow(); renderStudio({ focusQuestion: true });
  } catch (error) {
    console.error(error); renderStudioLoading('Impossible de charger ce pack Gold'); showToast('Le pack n’a pas pu être chargé. Réessaie après actualisation.');
  }
}
function exportStudentZero() {
  const p = pack(), item = question(p); if (p && item) flushQuestionTime();
  const records = Object.entries(state.telemetry).map(([key, t]) => ({
    key, packKey: t.packKey, questionId: t.questionId, sourceQuestion: t.sourceQuestion,
    firstSeenAt: t.firstSeenAt || null, firstInputAt: t.firstInputAt || null,
    comprehensionDelayMs: t.firstSeenAt && t.firstInputAt ? Math.max(0, t.firstInputAt - t.firstSeenAt) : null,
    strategyFirstAt: t.strategyFirstAt || null, strategyAtReveal: t.strategyAtReveal ?? null,
    visits: t.visits || 0, hintEvents: t.hintEvents || [], revealAt: t.revealAt || null,
    answerEdits: t.answerEdits || 0, strategyEdits: t.strategyEdits || 0,
    activeMs: Number(state.elapsed[key] || 0), answerText: state.answers[key] || '', answerChars: (state.answers[key] || '').length,
    strategyText: state.strategies[key] || '', criteriaChecked: state.criteria[key] || [], errorType: state.errorTypes[key] || '',
    answerCharsAtReveal: t.answerCharsAtReveal ?? null, criteriaEvents: t.criteriaEvents || [], errorSelectedAt: t.errorSelectedAt || null
  }));
  const payload = {
    schema: 'python-forge-bac-student-zero-v1', studioVersion: BAC_EXAM_STUDIO_VERSION, catalogVersion: BAC_EXAM_STUDIO_CATALOG_VERSION,
    generatedAt: new Date().toISOString(), privacy: 'Export local déclenché explicitement ; aucune identité n’est collectée automatiquement.',
    device: { hardwareConcurrency: navigator.hardwareConcurrency || null, deviceMemoryGiB: navigator.deviceMemory || null, viewport: `${window.innerWidth}x${window.innerHeight}` },
    performance: { ...perf, loadedGoldPacks: loadedPackCount() }, records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = `bac-student-zero-${new Date().toISOString().slice(0,10)}.json`; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0); showToast('Export élève zéro généré localement.');
}
function handleClick(event) {
  const existingTab = event.target.closest?.('[data-written-tab]');
  if (existingTab) { if (active) flushQuestionTime(); active = false; return; }
  const launcher = event.target.closest?.('[data-bac-studio-open]');
  if (launcher) { event.preventDefault(); event.stopPropagation(); void openStudio(); return; }
  const subject = event.target.closest?.('[data-bac-studio-subject]');
  if (subject) { event.preventDefault(); event.stopPropagation(); const key=(bacExamStudioPackKeysBySubject.get(subject.dataset.bacStudioSubject)||[])[0]; void openStudio(key); return; }
  if (!active) return;
  const qButton = event.target.closest?.('[data-studio-question]'); if (qButton) { selectQuestion(qButton.dataset.studioQuestion); return; }
  if (event.target.closest?.('[data-studio-prev]')) { adjacentQuestion(-1); return; }
  if (event.target.closest?.('[data-studio-next]')) { adjacentQuestion(1); return; }
  if (event.target.closest?.('[data-studio-hint]')) {
    const p=pack(), item=question(p); if (!p || !item) return; const key=responseKey(p,item), next=Math.min(item.hints.length,hintsFor(p,item)+1), t=telemetryFor(p,item);
    state.hints[key]=next; t.hintEvents.push({ level: next, at: Date.now(), answerChars: answerFor(p,item).length, strategyChars: strategyFor(p,item).length }); saveNow(); renderStudio(); return;
  }
  if (event.target.closest?.('[data-studio-reveal]')) {
    const p=pack(), item=question(p); if (!p || !item) return; const key=responseKey(p,item), enough=answerFor(p,item).trim().length>=item.minChars || hintsFor(p,item)>=Math.min(2,item.hints.length);
    if (!enough) { showToast('Produis une tentative ou utilise deux indices avant d’ouvrir la correction.'); return; }
    const t=telemetryFor(p,item); state.revealed[key]=true; if (!t.revealAt) { t.revealAt=Date.now(); t.strategyAtReveal=strategyFor(p,item); t.answerCharsAtReveal=answerFor(p,item).length; }
    saveNow(); renderStudio(); return;
  }
  if (event.target.closest?.('[data-studio-source]')) { state.sourceOpen=true; saveNow(); renderStudio(); return; }
  if (event.target.closest?.('[data-studio-source-close]')) { state.sourceOpen=false; saveNow(); renderStudio(); return; }
  if (event.target.closest?.('[data-studio-audit]')) { state.auditOpen=true; renderStudio(); return; }
  if (event.target.closest?.('[data-studio-audit-close]')) { state.auditOpen=false; renderStudio(); return; }
  if (event.target.closest?.('[data-studio-export]')) { exportStudentZero(); return; }
  const mobile = event.target.closest?.('[data-studio-mobile]'); if (mobile) { state.mobilePanel=mobile.dataset.studioMobile; saveNow(); renderStudio(); }
}
function handleInput(event) {
  const strategy = event.target.closest?.('[data-studio-strategy]');
  if (strategy) {
    const key=strategy.dataset.studioStrategy; state.strategies[key]=strategy.value;
    const t=state.telemetry[key]; if (t) { if (!t.strategyFirstAt && strategy.value.trim()) t.strategyFirstAt=Date.now(); t.strategyEdits=Number(t.strategyEdits||0)+1; }
    saveSoon(); return;
  }
  const answer = event.target.closest?.('[data-studio-answer]'); if (!answer) return;
  const key=answer.dataset.studioAnswer; state.answers[key]=answer.value;
  const t=state.telemetry[key]; if (t) { if (!t.firstInputAt && answer.value.trim()) t.firstInputAt=Date.now(); t.answerEdits=Number(t.answerEdits||0)+1; }
  saveSoon();
  const status = document.querySelector('[data-studio-save-status]'); if (status) status.textContent = '● sauvegarde en cours…';
  clearTimeout(answer._studioStatusTimer); answer._studioStatusTimer = setTimeout(() => { const el=document.querySelector('[data-studio-save-status]'); if(el)el.textContent='● sauvegarde locale'; }, SAVE_DELAY_MS + 80);
}
function handleChange(event) {
  if (!active) return;
  const packSelect = event.target.closest?.('[data-studio-pack]');
  if (packSelect) { void openStudio(packSelect.value); return; }
  const criterion = event.target.closest?.('[data-studio-criterion]');
  if (criterion) {
    const p=pack(), item=question(p); if (!p || !item) return; const key=responseKey(p,item), set=checkedFor(p,item), index=Number(criterion.dataset.studioCriterion), t=telemetryFor(p,item);
    criterion.checked ? set.add(index) : set.delete(index); state.criteria[key]=[...set]; t.criteriaEvents.push({ index, checked: criterion.checked, at: Date.now() }); saveNow(); renderStudio(); return;
  }
  const error = event.target.closest?.('[data-studio-error]');
  if (error) { const p=pack(), item=question(p); if (!p || !item) return; const key=responseKey(p,item), t=telemetryFor(p,item); state.errorTypes[key]=error.value; t.errorSelectedAt=Date.now(); saveNow(); renderStudio(); }
}
function initLongTaskAudit() {
  if (!('PerformanceObserver' in window)) return;
  try {
    longTaskObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) { perf.longTasks += 1; perf.maxLongTaskMs = Math.max(perf.maxLongTaskMs, entry.duration); }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch { longTaskObserver = null; }
}

document.addEventListener('click', handleClick, true);
document.addEventListener('input', handleInput);
document.addEventListener('change', handleChange);
window.addEventListener('hashchange', () => { if (getRoute().name !== 'written') active=false; setTimeout(ensureLaunchers,0); });
document.addEventListener('visibilitychange', () => { if (active && document.visibilityState === 'hidden') { flushQuestionTime(); saveNow(); } else if (active) resetQuestionClock(); });
new MutationObserver(() => setTimeout(ensureLaunchers, 0)).observe(view, { childList: true });
initLongTaskAudit();
setTimeout(ensureLaunchers, 0);

console.info(`[Bac Exam Studio ${BAC_EXAM_STUDIO_VERSION}] catalog ${BAC_EXAM_STUDIO_CATALOG_VERSION} · ${bacExamStudioPackCatalog.length} packs Gold · chargement modulaire`);
