import { view, escapeHTML, getRoute, showToast, attachEditorTabBehavior } from './app-shell.js';
import { bacWrittenCorpus, bacWrittenFrame, writtenSkillTracks, writtenMicroDrills } from './bac-written-corpus.js';
import { bacWrittenExerciseIndex, bacWrittenSemanticStats } from './bac-written-detailed.js';

export const BAC_WRITTEN_VERSION = '1.29.0';
const STORAGE_KEY = 'python-forge-bac-written-v1';
const MOCK_DURATION_MS = 210 * 60_000;
let timerHandle = 0;
let renderQueued = false;
let queryRenderHandle = 0;

function loadState() {
  const defaults = {
    tab: 'overview',
    selectedDrillId: writtenMicroDrills[0]?.id || '',
    drillAnswers: {}, drillRevealed: {}, drillCriteria: {}, drillLastDone: {},
    annalsYear: '2026', annalsQuery: '',
    guidedSubjectId: bacWrittenCorpus.find(s => s.year === 2026)?.id || bacWrittenCorpus[0]?.id || '',
    guidedExercise: 1, guidedPlan: {}, guidedReflection: {}, guidedReveal: {}, guidedPriority: {},
    adaptiveLastKey: '',
    mock: { subjectId:'', startedAt:0, endedAt:0, notes:{}, checkpoints:[], postmortem:[] }
  };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...defaults, ...parsed,
      mock: { ...defaults.mock, ...(parsed.mock || {}) },
      drillAnswers: parsed.drillAnswers || {}, drillRevealed: parsed.drillRevealed || {},
      drillCriteria: parsed.drillCriteria || {}, drillLastDone: parsed.drillLastDone || {},
      guidedPlan: parsed.guidedPlan || {}, guidedReflection: parsed.guidedReflection || {},
      guidedReveal: parsed.guidedReveal || {}, guidedPriority: parsed.guidedPriority || {}
    };
  } catch { return defaults; }
}

const state = loadState();
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function subjectById(id) { return bacWrittenCorpus.find(s => s.id === id); }
function drillById(id) { return writtenMicroDrills.find(d => d.id === id); }
function skillById(id) { return writtenSkillTracks.find(s => s.id === id); }
function rowByKey(key) { return bacWrittenExerciseIndex.find(row => row.key === key); }

function alignmentLabel(subject) {
  if (subject.alignment === 'reference-2027') return ['Référence prioritaire', 'good'];
  if (subject.alignment === 'proche') return ['Format proche', ''];
  return ['Archive utile', 'warn'];
}
function themesFor(subject, exercise = null) {
  return exercise ? subject.themes.filter(t => Number(t.n) === Number(exercise)) : subject.themes;
}
function canonicalItems(subject, exercise = null) {
  const byId = new Map();
  for (const theme of themesFor(subject, exercise)) for (const item of theme.canonical || []) byId.set(item.id, item);
  return [...byId.values()];
}
function themeText(subject, exercise = null) { return canonicalItems(subject, exercise).map(item => item.label).join(' · '); }
function sourceThemeText(subject, exercise = null) { return themesFor(subject, exercise).map(t => t.sourceTheme || '').filter(Boolean).join(' · '); }
function subjectSearchText(subject) {
  const semantic = subject.themes.flatMap(t => (t.canonical || []).flatMap(c => [c.label, c.domainLabel])).join(' ');
  const source = subject.themes.map(t => t.sourceTheme || '').join(' ');
  return `${subject.zone} ${subject.session} ${semantic} ${source}`.toLowerCase();
}
function completedDrill(id) {
  const drill = drillById(id); const checked = new Set(state.drillCriteria[id] || []);
  return Boolean(state.drillRevealed[id]) && drill?.criteria?.length && checked.size >= Math.min(2, drill.criteria.length);
}
function completedCount() { return writtenMicroDrills.filter(d => completedDrill(d.id)).length; }
function activateNav() { document.querySelectorAll('[data-route-link]').forEach(link => link.classList.toggle('active', link.dataset.routeLink === 'written')); }

function priorityWeight(value) { return value === 'revoir' ? 0 : value === 'fragile' ? 1 : value === 'solide' ? 4 : 2; }
function adaptiveRecommendation() {
  const candidates = bacWrittenExerciseIndex.filter(row => row.canonical?.length && !row.canonical.every(topic => topic.id === 'transversal'));
  if (!candidates.length) return null;
  const scored = candidates.map(row => {
    const topicWeight = Math.min(...row.canonical.map(topic => priorityWeight(state.guidedPriority[topic.id])));
    const attemptedPenalty = state.guidedReveal[row.key] ? 6 : 0;
    const recentPenalty = state.adaptiveLastKey === row.key ? 4 : 0;
    const yearPenalty = row.year === 2026 ? 0 : row.year === 2025 ? .6 : row.year >= 2023 ? 1.2 : 2.2;
    return { row, score: topicWeight * 3 + attemptedPenalty + recentPenalty + yearPenalty };
  }).sort((a,b) => a.score - b.score || b.row.year - a.row.year || a.row.key.localeCompare(b.row.key));
  return scored[0]?.row || null;
}
function prioritySummary() {
  const values = Object.values(state.guidedPriority || {});
  return { revoir:values.filter(v=>v==='revoir').length, fragile:values.filter(v=>v==='fragile').length, solide:values.filter(v=>v==='solide').length };
}

function tabsHTML() {
  const tabs = [['overview','Vue d’ensemble'],['micro','Micro-entraînement'],['annales','Annales officielles'],['map','Cartographie'],['mock','Sujet blanc 3 h 30'],['method','Méthode']];
  return `<nav class="written-tabs" aria-label="Sections de l'entraînement à l'écrit">${tabs.map(([id,label]) => `<button type="button" data-written-tab="${id}" class="${state.tab===id?'active':''}">${label}</button>`).join('')}</nav>`;
}
function heroHTML() {
  const semanticCount = bacWrittenSemanticStats.topics.filter(topic => topic.count > 0).length;
  return `<section class="written-hero"><div class="written-hero-main"><div class="page-kicker">V1.29 · Written Training Lab · Terminale NSI</div><h1>PRÉPARE <span>L’ÉCRIT.</span><br>RAISONNE. RÉDIGE.</h1><p class="lead">Un entraînement construit à partir de 79 sujets officiels 2021–2026 : lecture stratégique, rappel actif, exercices courts, annales guidées, sujets blancs et analyse des erreurs. Le but n’est pas de collectionner des corrections, mais d’apprendre à choisir une stratégie puis à l’expliquer clairement.</p><div class="written-meta"><span class="written-badge good">79 sujets officiels</span><span class="written-badge">${bacWrittenSemanticStats.exerciseCount} exercices indexés</span><span class="written-badge">${semanticCount} notions normalisées</span><span class="written-badge warn">progression locale</span></div></div><aside class="written-format-card" aria-label="Format de l'épreuve écrite 2027"><div class="page-kicker">Cadre session 2027</div><div class="written-format-stat"><b>3 h 30</b><span>durée de la partie écrite</span></div><div class="written-format-stat"><b>3</b><span>exercices indépendants, tous à traiter</span></div><div class="written-format-stat"><b>2/20</b><span>maîtrise de la langue explicitement évaluée</span></div><p class="tiny">${escapeHTML(bacWrittenFrame.language2027)}</p></aside></section>`;
}
function adaptiveCardHTML() {
  const rec = adaptiveRecommendation(); const summary = prioritySummary();
  if (!rec) return '';
  return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Défi adaptatif local</div><h2>Prochain exercice, notion masquée</h2></div><p>La recommandation utilise uniquement tes priorités déclarées et ce que tu as déjà travaillé. Ce n’est pas une estimation de niveau.</p></div><div class="written-adaptive"><div class="written-note"><strong>Priorités enregistrées :</strong> ${summary.revoir} à revoir · ${summary.fragile} fragiles · ${summary.solide} solides. La notion ciblée n’est pas affichée avant ton plan.</div><div class="written-recommendation"><div class="page-kicker">Défi proposé</div><h3>${rec.year} · ${escapeHTML(rec.zone)} · exercice ${rec.exercise}</h3><p>Ouvre le PDF, lis seulement l’exercice indiqué, puis écris ton plan avant toute révélation.</p><button class="btn primary" type="button" data-written-adaptive="${escapeHTML(rec.key)}">Lancer ce défi</button></div></div></section>`;
}
function overviewHTML() {
  const done=completedCount(), pct=Math.round(done*100/Math.max(1,writtenMicroDrills.length));
  return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Plan d’entraînement</div><h2>Quatre fonctions complémentaires</h2></div><p>On alterne exemples, rappel actif, pratique guidée puis autonomie. Les aides diminuent quand la tâche devient plus authentique.</p></div><div class="written-grid"><article class="written-card"><div class="page-kicker">01 · automatiser</div><h3>Micro-entraînement</h3><p>12 tâches courtes sur la trace, la stratégie, la justification et la rédaction. Correction différée et auto-vérification critériée.</p><div class="written-progress"><span style="width:${pct}%"></span></div><small>${done}/${writtenMicroDrills.length} entraînements consolidés</small><button class="btn primary" data-written-tab="micro">Commencer</button></article><article class="written-card"><div class="page-kicker">02 · transférer</div><h3>Annales guidées</h3><p>Travailler un exercice officiel avec un plan préalable. Les notions restent masquées jusqu’au débrief de reconnaissance.</p><button class="btn primary" data-written-tab="annales">Explorer les annales</button></article><article class="written-card"><div class="page-kicker">03 · observer</div><h3>Cartographie</h3><p>Voir les notions réellement rencontrées dans les 292 exercices, avec le vocabulaire normalisé du programme.</p><button class="btn" data-written-tab="map">Voir la cartographie</button></article><article class="written-card"><div class="page-kicker">04 · simuler</div><h3>Sujet blanc</h3><p>Un sujet 2026 complet, chronomètre persistant de 3 h 30 et relecture dédiée aux 2 points de langue.</p><button class="btn primary" data-written-tab="mock">Lancer un blanc</button></article></div></section>${adaptiveCardHTML()}<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Compétences transversales</div><h2>Ce que l’on entraîne vraiment</h2></div><p>Le même chapitre peut produire des questions très différentes : la compétence est de reconnaître ce qu’il faut mobiliser.</p></div><div class="written-method-grid">${writtenSkillTracks.map((s,i)=>`<article class="written-method-card"><div class="written-step"><b>${i+1}</b><div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.goal)}</p></div></div><p class="tiny">${escapeHTML(s.prompt)}</p></article>`).join('')}</div></section>`;
}
function microHTML() {
  const selected=drillById(state.selectedDrillId)||writtenMicroDrills[0], skill=skillById(selected.skill), answer=state.drillAnswers[selected.id]||'', revealed=Boolean(state.drillRevealed[selected.id]), checked=new Set(state.drillCriteria[selected.id]||[]), done=completedCount();
  return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Rappel actif + feedback différé</div><h2>Micro-entraînement écrit</h2></div><p>${done}/${writtenMicroDrills.length} consolidés. Une réponse doit être produite avant d’afficher la référence.</p></div><div class="written-filterbar"><label>Exercice<select data-written-drill-select>${writtenMicroDrills.map(d=>`<option value="${d.id}" ${d.id===selected.id?'selected':''}>${d.id} · ${escapeHTML(d.title)}${completedDrill(d.id)?' ✓':''}</option>`).join('')}</select></label><label>Progression<div class="written-progress"><span style="width:${Math.round(done*100/writtenMicroDrills.length)}%"></span></div><small>${done}/${writtenMicroDrills.length}</small></label><label>Compétence<div class="written-badge">${escapeHTML(skill?.title||selected.skill)}</div></label></div><article class="written-drill"><div class="written-drill-head"><div><div class="page-kicker">${selected.id} · ${escapeHTML(skill?.title||selected.skill)}</div><h3>${escapeHTML(selected.title)}</h3></div><span class="written-badge">≈ ${selected.minutes} min</span></div><p class="lead">${escapeHTML(selected.prompt)}</p><label><strong>Ta réponse</strong><textarea class="written-answer" data-written-drill-answer="${selected.id}" placeholder="Rédige une réponse exploitable sur une copie…">${escapeHTML(answer)}</textarea></label><div class="written-actions"><button class="btn primary" type="button" data-written-reveal-drill="${selected.id}">${revealed?'Réafficher la référence':'Comparer à une réponse de référence'}</button><button class="btn" type="button" data-written-clear-drill="${selected.id}">Réessayer à zéro</button></div>${revealed?`<div class="written-reference"><div class="page-kicker">Réponse de référence</div><p>${escapeHTML(selected.answer)}</p></div><div class="written-criteria"><strong>Auto-vérification : coche uniquement ce qui apparaît réellement dans ta réponse.</strong>${selected.criteria.map((c,i)=>`<label><input type="checkbox" data-written-drill-criterion="${selected.id}" value="${i}" ${checked.has(i)?'checked':''}> <span>${escapeHTML(c)}</span></label>`).join('')}</div><label><strong>Ce que je modifierais sur ma copie</strong><textarea class="written-reflection" data-written-drill-reflection="${selected.id}" placeholder="Une phrase suffit : erreur, manque de précision, vocabulaire à corriger…">${escapeHTML(state.guidedReflection[`drill:${selected.id}`]||'')}</textarea></label>`:'<p class="tiny">Le corrigé reste masqué : produis d’abord une réponse. Cette friction est volontaire.</p>'}</article></section>`;
}
function filteredSubjects() {
  const year=state.annalsYear, q=state.annalsQuery.trim().toLowerCase();
  return bacWrittenCorpus.filter(s=>(year==='all'||String(s.year)===year)&&(!q||subjectSearchText(s).includes(q)));
}
function subjectCardHTML(subject) {
  const [label,cls]=alignmentLabel(subject);
  return `<article class="written-subject-card"><div class="written-meta"><span class="written-badge ${cls}">${label}</span><span class="written-badge">${subject.year}</span><span class="written-badge">${subject.exerciseCount||'?'} ex.</span></div><h3>${escapeHTML(subject.zone)} · ${escapeHTML(subject.session)}</h3><div class="written-themes"><span class="written-theme">Notions masquées en mode guidé</span></div><div class="written-actions"><a class="btn" href="${escapeHTML(subject.url)}" target="_blank" rel="noopener noreferrer">PDF officiel ↗</a><button class="btn primary" data-written-guide-subject="${subject.id}">Travailler guidé</button></div></article>`;
}
function priorityButtonsHTML(items) {
  return items.map(topic => {
    const current=state.guidedPriority[topic.id]||'';
    return `<div class="written-topic-card"><header><h3>${escapeHTML(topic.label)}</h3><span class="written-badge">${escapeHTML(topic.domainLabel)}</span></header><div class="written-priority" aria-label="Priorité de révision pour ${escapeHTML(topic.label)}">${[['revoir','À revoir'],['fragile','Fragile'],['solide','Solide']].map(([value,label])=>`<button type="button" data-written-topic-priority="${topic.id}" data-value="${value}" aria-pressed="${current===value}">${label}</button>`).join('')}</div></div>`;
  }).join('');
}
function annalsHTML() {
  const filtered=filteredSubjects(); const guided=subjectById(state.guidedSubjectId)||filtered[0]||bacWrittenCorpus[0]; const exercise=Math.min(Math.max(1,Number(state.guidedExercise||1)),Math.max(1,guided.exerciseCount||3)); const key=`${guided.id}:${exercise}`; const plan=state.guidedPlan[key]||'', reflection=state.guidedReflection[key]||'', reveal=Boolean(state.guidedReveal[key]); const canonical=canonicalItems(guided,exercise); const source=sourceThemeText(guided,exercise);
  return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Corpus officiel Eduscol · 2021–2026</div><h2>Annales : chercher moins, travailler mieux</h2></div><p>${filtered.length} sujet(s) affiché(s). Les liens pointent vers les PDF officiels.</p></div><div class="written-filterbar"><label>Année<select data-written-year><option value="all">Toutes</option>${[2026,2025,2024,2023,2022,2021].map(y=>`<option value="${y}" ${state.annalsYear===String(y)?'selected':''}>${y}</option>`).join('')}</select></label><label>Notion / zone<input data-written-query value="${escapeHTML(state.annalsQuery)}" placeholder="ex. graphes, SQL, récursivité, Métropole"></label><label>Mode guidé<select data-written-guided-subject>${bacWrittenCorpus.filter(s=>state.annalsYear==='all'||String(s.year)===state.annalsYear).map(s=>`<option value="${s.id}" ${s.id===guided.id?'selected':''}>${s.year} · ${escapeHTML(s.zone)} · ${escapeHTML(s.session)}</option>`).join('')}</select></label></div><div class="written-subject-grid">${filtered.slice(0,18).map(subjectCardHTML).join('')||'<div class="written-empty">Aucun sujet ne correspond à ce filtre.</div>'}</div>${filtered.length>18?`<p class="tiny">${filtered.length-18} autres sujets correspondent au filtre. Affine la recherche pour réduire la liste.</p>`:''}</section><section class="written-panel" id="written-guided"><div class="section-head"><div><div class="page-kicker">Exercice officiel guidé</div><h2>${guided.year} · ${escapeHTML(guided.zone)} · ${escapeHTML(guided.session)}</h2></div><span class="written-badge ${alignmentLabel(guided)[1]}">${alignmentLabel(guided)[0]}</span></div><div class="written-filterbar"><label>Exercice<select data-written-guided-exercise>${Array.from({length:Math.max(1,guided.exerciseCount||3)},(_,i)=>`<option value="${i+1}" ${exercise===i+1?'selected':''}>Exercice ${i+1}</option>`).join('')}</select></label><label>PDF officiel<a class="btn" href="${escapeHTML(guided.url)}" target="_blank" rel="noopener noreferrer">Ouvrir le sujet ↗</a></label><label>Notions mobilisées<div>${reveal?`<span class="written-badge good">révélées après le plan</span>`:'<span class="written-badge warn">masquées avant le plan</span>'}</div></label></div><div class="written-note"><strong>Étape 1 — sans indice de chapitre :</strong> lis uniquement l’exercice choisi. Identifie ce qu’il faut produire, les données utiles, la structure ou l’algorithme probable et un cas limite.</div><label><strong>Plan préalable</strong><textarea class="written-plan" data-written-guided-plan="${escapeHTML(key)}" placeholder="Je dois… Je vais utiliser… parce que… Je vérifierai…">${escapeHTML(plan)}</textarea></label><div class="written-actions"><button class="btn primary" data-written-reveal-guided="${escapeHTML(key)}" ${plan.trim().length<40?'disabled':''}>Révéler les notions après mon plan</button></div>${reveal?`<div class="written-reference"><div class="page-kicker">Débrief de reconnaissance</div><div class="written-themes">${canonical.map(item=>`<span class="written-theme primary">${escapeHTML(item.label)}</span>`).join('')}</div><p>Compare ces notions à ton plan. La question utile n’est pas « ai-je deviné le chapitre ? », mais « mon plan mobilisait-il les bonnes structures et propriétés ? »</p>${source?`<div class="written-source-theme"><strong>Libellé source du sujet :</strong> ${escapeHTML(source)}</div>`:''}</div><label><strong>Après résolution : quelle erreur ou hésitation dois-je retravailler ?</strong><textarea class="written-reflection" data-written-guided-reflection="${escapeHTML(key)}" placeholder="Erreur de lecture, connaissance, stratégie, justification, temps…">${escapeHTML(reflection)}</textarea></label><div class="written-note"><strong>Priorité de révision :</strong> indique ce qui mérite d’être reproposé. Cette auto-évaluation pilote seulement la pratique suivante ; elle ne calcule pas un niveau.</div><div class="written-topic-grid">${priorityButtonsHTML(canonical)}</div>`:''}</section>`;
}
function mapHTML() {
  const topics=bacWrittenSemanticStats.topics.filter(topic=>topic.count>0&&topic.id!=='transversal'); const domains=bacWrittenSemanticStats.domains.filter(domain=>domain.count>0); const maxTopic=Math.max(1,...topics.map(t=>t.count)); const maxDomain=Math.max(1,...domains.map(d=>d.count));
  return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Audit sémantique V1.29</div><h2>292 exercices, vocabulaire normalisé</h2></div><p>Les libellés bruts des PDF sont conservés, puis rattachés à un vocabulaire stable du programme pour rendre les recherches et les diagnostics comparables.</p></div><div class="written-note"><strong>À lire correctement :</strong> ces fréquences décrivent le corpus 2021–2026. Elles ne sont ni des probabilités pour la session 2027, ni une liste de « chapitres à privilégier ».</div><div class="section-head"><div><div class="page-kicker">Domaines</div><h2>Répartition descriptive du corpus</h2></div><p>Un même exercice peut mobiliser plusieurs domaines : les comptes ne s’additionnent donc pas à 292.</p></div><div class="written-domain-list">${domains.map(domain=>`<div class="written-domain-row"><strong>${escapeHTML(domain.label)}</strong><div class="written-progress"><span style="width:${Math.round(domain.count*100/maxDomain)}%"></span></div><span class="written-badge">${domain.count} ex.</span></div>`).join('')}</div><div class="section-head"><div><div class="page-kicker">Notions</div><h2>Ce que les sujets ont réellement mobilisé</h2></div><p>Le bouton de filtre sert à explorer les annales ; le défi adaptatif, lui, garde la notion masquée.</p></div><div class="written-topic-grid">${topics.map(topic=>`<article class="written-topic-card"><header><h3>${escapeHTML(topic.label)}</h3><span class="written-badge">${topic.count} ex.</span></header><small>${escapeHTML(topic.years.join(' · '))}</small><div class="written-topic-bar"><span style="width:${Math.round(topic.count*100/maxTopic)}%"></span></div><button class="btn" type="button" data-written-topic-filter="${topic.id}">Filtrer les annales</button></article>`).join('')}</div></section>`;
}
function mockRemaining() { if(!state.mock.startedAt)return MOCK_DURATION_MS; const stop=state.mock.endedAt||Date.now(); return Math.max(0,state.mock.startedAt+MOCK_DURATION_MS-stop); }
function fmt(ms){const total=Math.max(0,Math.floor(ms/1000)),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function mockHTML() {
  const candidates=bacWrittenCorpus.filter(s=>s.year===2026&&s.exerciseCount===3); let subject=subjectById(state.mock.subjectId); if(!subject||subject.year!==2026)subject=candidates[0]; const started=Boolean(state.mock.startedAt), ended=Boolean(state.mock.endedAt)||(started&&mockRemaining()===0), checkpoints=new Set(state.mock.checkpoints||[]), post=new Set(state.mock.postmortem||[]), remaining=mockRemaining();
  return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Simulation autonome</div><h2>Sujet blanc — 3 h 30</h2></div><span class="written-badge ${ended?'good':''}">${!started?'non commencé':ended?'terminé':'en cours'}</span></div><div class="written-mock-layout"><div><div class="written-filterbar"><label>Sujet 2026<select data-written-mock-subject ${started?'disabled':''}>${candidates.map(s=>`<option value="${s.id}" ${s.id===subject.id?'selected':''}>${escapeHTML(s.zone)} · ${escapeHTML(s.session)}</option>`).join('')}</select></label><label>Document<a class="btn" href="${escapeHTML(subject.url)}" target="_blank" rel="noopener noreferrer">Ouvrir le PDF officiel ↗</a></label><label>Chronomètre<div class="written-timer" data-written-mock-timer data-urgent="${remaining<=30*60_000}">${fmt(remaining)}</div></label></div>${!started?`<div class="written-note"><strong>Protocole :</strong> aucune aide du site pendant les 3 h 30. Les notions ne sont pas affichées. Prévois ton temps avant de commencer et rédige comme sur une copie réelle.</div><div class="written-actions"><button class="btn primary" data-written-start-mock>▶ Démarrer le chronomètre</button><button class="btn" data-written-random-mock>Choisir un autre sujet au hasard</button></div>`:''}${started?`<label><strong>Notes de gestion du temps — Exercice 1</strong><textarea class="written-plan" data-written-mock-note="1" ${ended?'disabled':''}>${escapeHTML(state.mock.notes['1']||'')}</textarea></label><label><strong>Exercice 2</strong><textarea class="written-plan" data-written-mock-note="2" ${ended?'disabled':''}>${escapeHTML(state.mock.notes['2']||'')}</textarea></label><label><strong>Exercice 3</strong><textarea class="written-plan" data-written-mock-note="3" ${ended?'disabled':''}>${escapeHTML(state.mock.notes['3']||'')}</textarea></label>${!ended?'<div class="written-actions"><button class="btn primary" data-written-finish-mock>Terminer la session</button></div>':''}`:''}</div><aside class="written-mock-side"><div class="written-method-card"><div class="page-kicker">Jalons de copie</div><div class="written-checkpoints">${[['plan','J’ai défini un budget de temps par exercice.'],['consigne','Je réponds à la consigne exacte avant d’ajouter des explications.'],['justif','Chaque justification relie propriété, application et conclusion.'],['langue','Je réserve une relecture syntaxe + vocabulaire NSI.'],['retour','Je marque les questions bloquantes pour y revenir.']].map(([id,label])=>`<label><input type="checkbox" data-written-mock-checkpoint="${id}" ${checkpoints.has(id)?'checked':''} ${ended?'disabled':''}> <span>${label}</span></label>`).join('')}</div></div>${ended?`<div class="written-method-card"><div class="page-kicker">Post-mortem immédiat</div><p>Qu’est-ce qui a principalement limité la copie ?</p><div class="written-checkpoints">${[['lecture','lecture / interprétation de la consigne'],['connaissance','connaissance manquante'],['strategie','stratégie mal choisie'],['trace','erreur de trace ou de calcul'],['temps','gestion du temps'],['redaction','justification ou rédaction']].map(([id,label])=>`<label><input type="checkbox" data-written-postmortem="${id}" ${post.has(id)?'checked':''}> <span>${label}</span></label>`).join('')}</div><div class="written-actions"><button class="btn" data-written-reset-mock>Nouvelle session</button></div></div>`:''}</aside></div></section>`;
}
function methodHTML(){return `<section class="written-panel"><div class="section-head"><div><div class="page-kicker">Méthode fondée sur les sciences de l’apprentissage</div><h2>Pourquoi le Written Training Lab fonctionne ainsi</h2></div><p>La technologie n’est utilisée que lorsqu’elle augmente la qualité de la pratique, du feedback ou de l’autorégulation.</p></div><div class="written-method-grid"><article class="written-method-card"><h3>1 · Rappel actif</h3><p>Une réponse est exigée avant l’affichage de la référence.</p></article><article class="written-method-card"><h3>2 · Exemples puis autonomie</h3><p>Les micro-tâches donnent un étayage explicite, puis les annales guidées masquent progressivement l’aide jusqu’au sujet blanc.</p></article><article class="written-method-card"><h3>3 · Reconnaissance avant révélation</h3><p>Les cartes d’annales ne donnent plus le chapitre : l’élève doit écrire un plan avant de voir les notions normalisées.</p></article><article class="written-method-card"><h3>4 · Feedback actionnable</h3><p>La référence n’est pas une note. L’élève compare sa réponse à des critères et écrit ce qu’il modifierait sur une vraie copie.</p></article><article class="written-method-card"><h3>5 · Adaptation prudente</h3><p>Les priorités « à revoir / fragile / solide » servent seulement à choisir le prochain exercice. Elles ne constituent pas un score de maîtrise.</p></article><article class="written-method-card"><h3>6 · Épreuve authentique</h3><p>La simulation finale rétablit les contraintes réelles : document officiel, 3 h 30, trois exercices et absence d’indices.</p></article></div><div class="written-note" style="margin-top:1rem"><strong>Interprétation :</strong> les indicateurs locaux montrent ce qui a été travaillé et les difficultés déclarées. Ils ne prédisent pas une note ni une réussite au baccalauréat.</div></section>`;}
function bodyHTML(){if(state.tab==='micro')return microHTML();if(state.tab==='annales')return annalsHTML();if(state.tab==='map')return mapHTML();if(state.tab==='mock')return mockHTML();if(state.tab==='method')return methodHTML();return overviewHTML();}
function renderWritten(){if(getRoute().name!=='written')return;activateNav();view.innerHTML=`<div id="written-training-lab">${heroHTML()}${tabsHTML()}${bodyHTML()}</div>`;attachEditorTabBehavior?.();startTimerLoop();}
function scheduleRender(){if(renderQueued)return;renderQueued=true;setTimeout(()=>{renderQueued=false;renderWritten();},0);}
function startTimerLoop(){clearInterval(timerHandle);if(getRoute().name!=='written'||state.tab!=='mock'||!state.mock.startedAt||state.mock.endedAt)return;timerHandle=setInterval(()=>{const el=document.querySelector('[data-written-mock-timer]');if(!el)return;const rem=mockRemaining();el.textContent=fmt(rem);el.dataset.urgent=String(rem<=30*60_000);if(rem<=0){state.mock.endedAt=state.mock.startedAt+MOCK_DURATION_MS;saveState();clearInterval(timerHandle);showToast('Sujet blanc terminé : ouvre le post-mortem avant de consulter une correction.');scheduleRender();}},1000);}
function updateArrayToggle(array,value,checked){const set=new Set(array||[]);if(checked)set.add(value);else set.delete(value);return [...set];}
function handleClick(event){
  const tab=event.target.closest?.('[data-written-tab]');if(tab){state.tab=tab.dataset.writtenTab;saveState();scheduleRender();return;}
  const revealDrill=event.target.closest?.('[data-written-reveal-drill]');if(revealDrill){const id=revealDrill.dataset.writtenRevealDrill,answer=String(state.drillAnswers[id]||'').trim();if(answer.length<20){showToast('Rédige d’abord une réponse exploitable avant d’ouvrir la référence.');return;}state.drillRevealed[id]=true;state.drillLastDone[id]=Date.now();saveState();scheduleRender();return;}
  const clearDrill=event.target.closest?.('[data-written-clear-drill]');if(clearDrill){const id=clearDrill.dataset.writtenClearDrill;delete state.drillAnswers[id];delete state.drillRevealed[id];delete state.drillCriteria[id];delete state.drillLastDone[id];delete state.guidedReflection[`drill:${id}`];saveState();scheduleRender();return;}
  const guideSubject=event.target.closest?.('[data-written-guide-subject]');if(guideSubject){state.guidedSubjectId=guideSubject.dataset.writtenGuideSubject;state.guidedExercise=1;state.tab='annales';saveState();scheduleRender();return;}
  const revealGuided=event.target.closest?.('[data-written-reveal-guided]');if(revealGuided){const key=revealGuided.dataset.writtenRevealGuided;if(String(state.guidedPlan[key]||'').trim().length<40){showToast('Écris d’abord un plan assez précis pour pouvoir le comparer au débrief.');return;}state.guidedReveal[key]=true;state.adaptiveLastKey=key;saveState();scheduleRender();return;}
  const priority=event.target.closest?.('[data-written-topic-priority]');if(priority){const id=priority.dataset.writtenTopicPriority,value=priority.dataset.value;state.guidedPriority[id]=state.guidedPriority[id]===value?'':value;saveState();scheduleRender();return;}
  const adaptive=event.target.closest?.('[data-written-adaptive]');if(adaptive){const row=rowByKey(adaptive.dataset.writtenAdaptive);if(row){state.guidedSubjectId=row.subjectId;state.guidedExercise=row.exercise;state.annalsYear=String(row.year);state.annalsQuery='';state.adaptiveLastKey=row.key;state.tab='annales';saveState();scheduleRender();}return;}
  const topicFilter=event.target.closest?.('[data-written-topic-filter]');if(topicFilter){const topic=bacWrittenSemanticStats.topics.find(item=>item.id===topicFilter.dataset.writtenTopicFilter);if(topic){state.annalsYear='all';state.annalsQuery=topic.label;state.tab='annales';saveState();scheduleRender();}return;}
  if(event.target.closest?.('[data-written-random-mock]')){const list=bacWrittenCorpus.filter(s=>s.year===2026&&s.exerciseCount===3),alternatives=list.filter(s=>s.id!==state.mock.subjectId);state.mock.subjectId=(alternatives[Math.floor(Math.random()*alternatives.length)]||list[0]).id;saveState();scheduleRender();return;}
  if(event.target.closest?.('[data-written-start-mock]')){const select=document.querySelector('[data-written-mock-subject]');state.mock.subjectId=select?.value||state.mock.subjectId||bacWrittenCorpus.find(s=>s.year===2026)?.id;state.mock.startedAt=Date.now();state.mock.endedAt=0;state.mock.notes={};state.mock.checkpoints=[];state.mock.postmortem=[];saveState();scheduleRender();return;}
  if(event.target.closest?.('[data-written-finish-mock]')){if(!confirm('Terminer la session maintenant ? Le chronomètre sera arrêté et le post-mortem s’ouvrira.'))return;state.mock.endedAt=Date.now();saveState();scheduleRender();return;}
  if(event.target.closest?.('[data-written-reset-mock]')){if(!confirm('Effacer la session de sujet blanc et repartir de zéro ?'))return;state.mock={subjectId:'',startedAt:0,endedAt:0,notes:{},checkpoints:[],postmortem:[]};saveState();scheduleRender();}
}
function handleInput(event){
  const a=event.target.closest?.('[data-written-drill-answer]');if(a){state.drillAnswers[a.dataset.writtenDrillAnswer]=a.value;saveState();return;}
  const dr=event.target.closest?.('[data-written-drill-reflection]');if(dr){state.guidedReflection[`drill:${dr.dataset.writtenDrillReflection}`]=dr.value;saveState();return;}
  const q=event.target.closest?.('[data-written-query]');if(q){state.annalsQuery=q.value;saveState();clearTimeout(queryRenderHandle);queryRenderHandle=setTimeout(scheduleRender,220);return;}
  const gp=event.target.closest?.('[data-written-guided-plan]');if(gp){state.guidedPlan[gp.dataset.writtenGuidedPlan]=gp.value;saveState();const b=document.querySelector('[data-written-reveal-guided]');if(b)b.disabled=gp.value.trim().length<40;return;}
  const gr=event.target.closest?.('[data-written-guided-reflection]');if(gr){state.guidedReflection[gr.dataset.writtenGuidedReflection]=gr.value;saveState();return;}
  const note=event.target.closest?.('[data-written-mock-note]');if(note){state.mock.notes[note.dataset.writtenMockNote]=note.value;saveState();}
}
function handleChange(event){
  const ds=event.target.closest?.('[data-written-drill-select]');if(ds){state.selectedDrillId=ds.value;saveState();scheduleRender();return;}
  const crit=event.target.closest?.('[data-written-drill-criterion]');if(crit){const id=crit.dataset.writtenDrillCriterion;state.drillCriteria[id]=updateArrayToggle(state.drillCriteria[id],Number(crit.value),crit.checked);state.drillLastDone[id]=Date.now();saveState();return;}
  const year=event.target.closest?.('[data-written-year]');if(year){state.annalsYear=year.value;state.annalsQuery='';const first=bacWrittenCorpus.find(s=>year.value==='all'||String(s.year)===year.value);if(first)state.guidedSubjectId=first.id;saveState();scheduleRender();return;}
  const gs=event.target.closest?.('[data-written-guided-subject]');if(gs){state.guidedSubjectId=gs.value;state.guidedExercise=1;saveState();scheduleRender();return;}
  const ge=event.target.closest?.('[data-written-guided-exercise]');if(ge){state.guidedExercise=Number(ge.value);saveState();scheduleRender();return;}
  const ms=event.target.closest?.('[data-written-mock-subject]');if(ms){state.mock.subjectId=ms.value;saveState();return;}
  const cp=event.target.closest?.('[data-written-mock-checkpoint]');if(cp){state.mock.checkpoints=updateArrayToggle(state.mock.checkpoints,cp.dataset.writtenMockCheckpoint,cp.checked);saveState();return;}
  const pm=event.target.closest?.('[data-written-postmortem]');if(pm){state.mock.postmortem=updateArrayToggle(state.mock.postmortem,pm.dataset.writtenPostmortem,pm.checked);saveState();}
}

document.addEventListener('click',handleClick);
document.addEventListener('input',handleInput);
document.addEventListener('change',handleChange);
window.addEventListener('hashchange',scheduleRender);
new MutationObserver(()=>{if(getRoute().name==='written'&&!document.querySelector('#written-training-lab'))scheduleRender();}).observe(view,{childList:true});
setTimeout(scheduleRender,0);
