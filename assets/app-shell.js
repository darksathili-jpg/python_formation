import { SITE_VERSION, tracks, modules, flashQuestions, sources, scopeNotes } from './content.js';

const view = document.querySelector('#view');
const html = document.documentElement;
const toastEl = document.querySelector('#toast');
const searchDialog = document.querySelector('#search-dialog');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const storageKey = 'python-forge-nsi-v1';

const state = loadState();
let flashState = { index: 0, answered: false };
let dynamicBinder = () => {};

function loadState() {
  const defaults = { track: 'premiere', solved: {}, attempts: {}, theme: 'dark', projector: false };
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return { ...defaults, ...parsed, solved: parsed.solved || {}, attempts: parsed.attempts || {} };
  } catch {
    return defaults;
  }
}

function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function stripHTML(value = '') {
  const temp = document.createElement('div'); temp.innerHTML = value; return temp.textContent || '';
}

function routeTo(hash) { location.hash = hash; }
function getRoute() { const raw = location.hash.replace(/^#/, '') || 'home'; const [name, id] = raw.split('/'); return { name, id }; }
function setActiveNav(name) {
  document.querySelectorAll('[data-route-link]').forEach(link => link.classList.toggle('active', link.dataset.routeLink === name || (name === 'module' && link.dataset.routeLink === 'home')));
}
function showToast(message) {
  toastEl.textContent = message; toastEl.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
function solvedCount(track = null) { return modules.filter(m => !track || m.track === track).reduce((sum, m) => sum + m.exercises.filter(e => state.solved[e.id]).length, 0); }
function totalExercises(track = null) { return modules.filter(m => !track || m.track === track).reduce((sum, m) => sum + m.exercises.length, 0); }
function moduleProgress(module) {
  const done = module.exercises.filter(e => state.solved[e.id]).length;
  return { done, total: module.exercises.length, percent: module.exercises.length ? Math.round(done * 100 / module.exercises.length) : 0 };
}
function renderCode(code) {
  const lines = escapeHTML(code).split('\n').map(line => `<span class="code-line">${line || ' '}</span>`).join('');
  return `<pre class="code"><button class="copy-code" type="button" data-copy-code="${encodeURIComponent(code)}">Copier</button>${lines}</pre>`;
}
function levelDots(level) { return `<span class="mono" aria-label="niveau ${level} sur 3">${'◆'.repeat(level)}${'◇'.repeat(3-level)}</span>`; }
function trackSwitch(active) {
  return `<div class="track-switch" role="group" aria-label="Choisir le niveau">${Object.entries(tracks).map(([key, t]) => `<button type="button" data-track-switch="${key}" class="${key === active ? 'active' : ''}">${t.label}</button>`).join('')}</div>`;
}
function moduleCards(track) {
  return `<div class="module-grid">${modules.filter(m => m.track === track).map(m => {
    const p = moduleProgress(m);
    return `<a class="module-card ${m.track === 'terminale' ? 'terminal' : ''}" href="#module/${m.id}"><span class="module-code">${m.id} · ${escapeHTML(m.level)}</span><h3>${escapeHTML(m.title)}</h3><p>${escapeHTML(m.summary)}</p><div class="module-meta"><span class="chip">${escapeHTML(m.duration)}</span><span class="chip ${p.percent === 100 ? 'ok' : ''}">${p.done}/${p.total} validés</span></div></a>`;
  }).join('')}</div>`;
}

function renderHome() {
  const track = state.track; const done = solvedCount(track); const total = totalExercises(track); const progress = total ? Math.round(done * 100 / total) : 0;
  view.innerHTML = `
    <section class="hero">
      <div>
        <span class="eyebrow">Atelier Python · spécialité NSI</span>
        <h1>CODE.<span>COMPRENDS.</span>PROUVE.</h1>
        <p>Un parcours interactif calibré pour la Première et la Terminale : cours brefs, exemples exécutables, exercices progressifs, tests automatiques et droit à l’erreur. Python sert ici à apprendre l’informatique — pas à réciter une syntaxe.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#module/${modules.find(m => m.track === track && moduleProgress(m).percent < 100)?.id || modules.find(m => m.track === track)?.id}">▶ Reprendre le parcours</a>
          <a class="btn ghost" href="#practice">⚡ Défi rapide</a>
          <a class="btn ghost" href="#programme">◎ Voir l’alignement BO</a>
        </div>
      </div>
      <aside class="hero-console" aria-label="Aperçu du Python Lab">
        <div class="console-top"><span class="console-dot"></span><span class="console-dot"></span><span class="console-dot"></span>&nbsp; python-forge://mission.py</div>
        <pre><span class="token-c"># Chercher → expliquer → tester</span>
<span class="token-k">def</span> <span class="token-f">dichotomie</span>(tab, cible):
    gauche = <span class="token-n">0</span>
    droite = len(tab) - <span class="token-n">1</span>

    <span class="token-k">while</span> gauche &lt;= droite:
        milieu = (gauche + droite) // <span class="token-n">2</span>
        <span class="token-k">if</span> tab[milieu] == cible:
            <span class="token-k">return</span> milieu
        <span class="token-k">if</span> tab[milieu] &lt; cible:
            gauche = milieu + <span class="token-n">1</span>
        <span class="token-k">else</span>:
            droite = milieu - <span class="token-n">1</span>
    <span class="token-k">return</span> -<span class="token-n">1</span>

<span class="token-c"># Une réussite n’est pas une preuve :</span>
<span class="token-k">assert</span> dichotomie([<span class="token-n">1</span>,<span class="token-n">4</span>,<span class="token-n">7</span>], <span class="token-n">4</span>) == <span class="token-n">1</span></pre>
      </aside>
    </section>
    <section aria-labelledby="progress-title">
      <div class="section-head"><div><div class="page-kicker">Progression locale</div><h2 id="progress-title">Ton tableau de bord</h2></div><p>La progression reste uniquement dans ce navigateur. Aucun compte, aucun traçage élève.</p></div>
      ${trackSwitch(track)}
      <div class="stats-row"><div class="stat"><b>${modules.filter(m => m.track === track).length}</b><small>modules ${tracks[track].label}</small></div><div class="stat"><b>${total}</b><small>exercices progressifs</small></div><div class="stat"><b>${done}</b><small>exercices validés</small></div><div class="stat"><b>${progress}%</b><small>progression</small></div></div>
    </section>
    <section aria-labelledby="modules-title"><div class="section-head"><div><div class="page-kicker">Parcours ${tracks[track].label}</div><h2 id="modules-title">Apprendre par missions</h2></div><p>${escapeHTML(tracks[track].description)}</p></div>${moduleCards(track)}</section>
    <section class="lesson-block" style="margin-top:2rem"><div class="page-kicker">Méthode PYTHON//FORGE</div><div class="key-points"><div class="key-point"><strong>1 · Comprendre</strong><br><span class="muted">Une idée à la fois, reliée explicitement au programme.</span></div><div class="key-point"><strong>2 · Prédire</strong><br><span class="muted">Avant d’exécuter : anticiper résultat, cas limite et invariant.</span></div><div class="key-point"><strong>3 · Manipuler</strong><br><span class="muted">Écrire et exécuter le Python directement dans le navigateur.</span></div><div class="key-point"><strong>4 · Valider</strong><br><span class="muted">Tests visibles, aides graduées, correction seulement quand nécessaire.</span></div></div></section>`;
}

function renderLessonBlock(block, index) {
  return `<section class="lesson-block" id="cours-${index + 1}"><div class="page-kicker">Cours ${String(index + 1).padStart(2, '0')}</div><h2>${escapeHTML(block.title)}</h2><div>${block.html || ''}</div>${block.points ? `<div class="key-points">${block.points.map(p => `<div class="key-point">${p}</div>`).join('')}</div>` : ''}${block.code ? renderCode(block.code) : ''}</section>`;
}

function renderExercise(ex) {
  const solved = Boolean(state.solved[ex.id]); const attempts = state.attempts[ex.id] || 0;
  return `<article class="exercise-card" id="${ex.id}"><header class="exercise-head"><div><div class="page-kicker">Mission ${ex.id}</div><h3>${escapeHTML(ex.title)}</h3></div><div>${levelDots(ex.level)} ${solved ? '<span class="chip ok">✓ validé</span>' : `<span class="chip">${attempts} essai${attempts > 1 ? 's' : ''}</span>`}</div></header><div class="exercise-body"><p class="exercise-prompt">${ex.prompt}</p><div class="exercise-grid"><div><div class="editor-shell"><div class="editor-toolbar"><span>${ex.id.toLowerCase()}.py</span><span>Python 3 · navigateur</span></div><textarea class="code-editor" id="editor-${ex.id}" aria-label="Code Python pour ${escapeHTML(ex.title)}" spellcheck="false">${escapeHTML(ex.starter)}</textarea></div><div class="runner-actions"><button class="btn primary" type="button" data-run-exercise="${ex.id}">▶ Tester</button><button class="btn" type="button" data-reset-exercise="${ex.id}">↺ Réinitialiser</button><button class="btn" type="button" data-hint-exercise="${ex.id}">? Indice</button><button class="btn ghost" type="button" data-solution-exercise="${ex.id}">Voir une solution</button></div><div id="hint-${ex.id}"></div><div id="solution-${ex.id}"></div></div><div class="output-shell"><div class="output-toolbar"><span>VALIDATION</span><span id="status-${ex.id}">${solved ? '✓ réussi' : 'en attente'}</span></div><div class="runner-status" id="output-${ex.id}">Le moteur Python se charge à la première exécution.\n\nObjectif : faire passer ${ex.tests.length} test${ex.tests.length > 1 ? 's' : ''} sans modifier les tests.</div></div></div></div></article>`;
}

function renderModule(id) {
  const module = modules.find(m => m.id === id); if (!module) return renderNotFound();
  state.track = module.track; saveState(); const p = moduleProgress(module);
  view.innerHTML = `<div class="module-layout"><aside class="module-aside"><div class="page-kicker">${module.id} · ${tracks[module.track].label}</div><strong>${escapeHTML(module.title)}</strong><div class="progress-track" aria-label="Progression du module"><span style="width:${p.percent}%"></span></div><p class="tiny">${p.done}/${p.total} exercices validés</p><a href="#intro" data-local-anchor="intro">Vue d’ensemble</a>${module.lessons.map((b, i) => `<a href="#cours-${i+1}" data-local-anchor="cours-${i+1}">Cours ${i+1} · ${escapeHTML(b.title)}</a>`).join('')}<a href="#exercices" data-local-anchor="exercices">Exercices</a><div class="divider"></div><a href="#home">← Tous les modules</a></aside><div class="module-content"><header id="intro"><div class="page-kicker">${module.id} · ${escapeHTML(module.bo)}</div><h1>${escapeHTML(module.title)}</h1><p class="lead">${escapeHTML(module.summary)}</p><div class="hero-actions"><span class="chip">◷ ${escapeHTML(module.duration)}</span><span class="chip">${escapeHTML(module.level)}</span><span class="chip ${p.percent === 100 ? 'ok' : ''}">${p.percent}% validé</span></div></header><section class="lesson-block"><h2>À la fin de cette mission, tu sauras…</h2><div class="key-points">${module.objectives.map(o => `<div class="key-point">${escapeHTML(o)}</div>`).join('')}</div></section>${module.lessons.map(renderLessonBlock).join('')}<section id="exercices"><div class="section-head"><div><div class="page-kicker">Zone de pratique</div><h2>Exercices progressifs</h2></div><p>◆ découverte · ◆◆ consolidation · ◆◆◆ transfert. Les indices se dévoilent un par un.</p></div><div class="exercise-list">${module.exercises.map(renderExercise).join('')}</div></section></div></div>`;
  attachEditorTabBehavior();
}

function renderProgramme() {
  const byTrack = track => modules.filter(m => m.track === track);
  view.innerHTML = `<header><div class="page-kicker">Conformité programme · édition 2026</div><h1 class="page-title">Ce que le site couvre — et ce qu’il ne prétend pas couvrir.</h1><p class="page-intro">PYTHON//FORGE est un parcours de <strong>programmation et d’algorithmique Python pour la NSI</strong>. Le périmètre est volontaire : il s’aligne sur les attendus où Python intervient directement et n’efface pas les autres rubriques du programme.</p></header><div class="programme-grid" style="margin-top:1.5rem">${['premiere','terminale'].map(track => `<section class="programme-panel"><div class="page-kicker">${tracks[track].label}</div><h2>${byTrack(track).length} modules Python</h2><p class="muted">${tracks[track].description}</p><table class="mapping-table"><thead><tr><th>Module</th><th>Correspondance programme</th></tr></thead><tbody>${byTrack(track).map(m => `<tr><td><a href="#module/${m.id}"><strong>${m.id}</strong><br>${escapeHTML(m.title)}</a></td><td>${escapeHTML(m.bo)}</td></tr>`).join('')}</tbody></table><div class="divider"></div>${scopeNotes[track].map(n => `<div class="programme-note" style="margin:.65rem 0">${escapeHTML(n)}</div>`).join('')}</section>`).join('')}</div><section class="lesson-block" style="margin-top:1rem"><h2>Garde-fous pédagogiques intégrés</h2><div class="key-points"><div class="key-point"><strong>Python ≠ finalité.</strong><br><span class="muted">Le langage sert la résolution de problèmes ; l’expertise syntaxique n’est pas l’objectif.</span></div><div class="key-point"><strong>Cas limites.</strong><br><span class="muted">Les tests confrontent régulièrement vide, bornes, doublons, valeurs négatives et erreurs de contrat.</span></div><div class="key-point"><strong>Preuve avant performance.</strong><br><span class="muted">Invariant, variant, correction et coût sont introduits là où ils deviennent utiles.</span></div><div class="key-point"><strong>Pas de hors-programme déguisé.</strong><br><span class="muted">Les extensions sont signalées ; l’héritage/polymorphisme ne sont pas utilisés comme prérequis Terminale.</span></div></div></section>`;
}

function flashQuestionsFor(track) { return flashQuestions.filter(q => q.track === track); }
function renderPractice() {
  const qs = flashQuestionsFor(state.track); if (flashState.index >= qs.length) flashState.index = 0; const q = qs[flashState.index];
  view.innerHTML = `<header><div class="page-kicker">Entraînement actif</div><h1 class="page-title">Répondre vite. Expliquer juste.</h1><p class="page-intro">Questions flash, exercice aléatoire et reprise ciblée. Le but n’est pas le score : c’est de repérer immédiatement ce qui mérite une seconde passe.</p></header><div class="practice-toolbar">${trackSwitch(state.track)}<button class="btn" id="random-exercise" type="button">⚄ Exercice aléatoire</button></div><section class="flash-card"><div style="width:min(760px,100%)"><div class="page-kicker">Question ${flashState.index + 1}/${qs.length} · ${tracks[state.track].label}</div><h2>${escapeHTML(q.q)}</h2><div class="flash-options">${q.options.map((o, i) => `<button type="button" data-flash-answer="${i}">${String.fromCharCode(65+i)} · ${escapeHTML(o)}</button>`).join('')}</div><div id="flash-feedback" class="hint-box" hidden></div><div class="runner-actions" style="justify-content:center;margin-top:1rem"><button class="btn" type="button" id="flash-next">Question suivante →</button></div></div></section><section class="lesson-block" style="margin-top:1rem"><h2>Réviser ce qui résiste</h2><div class="module-grid">${modules.filter(m => m.track === state.track).sort((a,b) => moduleProgress(a).percent - moduleProgress(b).percent).slice(0,3).map(m => { const p = moduleProgress(m); return `<a class="module-card ${m.track === 'terminale' ? 'terminal' : ''}" href="#module/${m.id}"><span class="module-code">${m.id} · ${p.percent}%</span><h3>${escapeHTML(m.title)}</h3><p>${p.percent === 100 ? 'Module validé : idéal pour un rappel espacé.' : `${m.exercises.length-p.done} exercice(s) encore à valider.`}</p><div class="module-meta"><span class="chip">Reprendre</span></div></a>`; }).join('')}</div></section>`;
}

const labPresets = {
  'Fonction': `def est_multiple(n, d):\n    return n % d == 0\n\nprint(est_multiple(42, 7))`,
  'Liste': `valeurs = [7, 2, 9, 2, 5]\nmaximum = valeurs[0]\nfor x in valeurs:\n    if x > maximum:\n        maximum = x\nprint(maximum)`,
  'Récursivité': `def puissance(a, n):\n    if n == 0:\n        return 1\n    return a * puissance(a, n - 1)\n\nprint(puissance(2, 10))`,
  'Classe': `class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def norme_carre(self):\n        return self.x ** 2 + self.y ** 2\n\np = Point(3, 4)\nprint(p.norme_carre())`
};

function renderLab() {
  view.innerHTML = `<header><div class="page-kicker">Python Lab · sandbox local</div><h1 class="page-title">Expérimente sans quitter la page.</h1><p class="page-intro">Le code s’exécute dans un Web Worker grâce à Pyodide : l’interface reste réactive et ton code n’est pas envoyé à notre serveur. Une connexion est nécessaire au premier chargement du moteur Python.</p></header><div class="lab-presets">${Object.keys(labPresets).map(k => `<button type="button" data-lab-preset="${escapeHTML(k)}">${escapeHTML(k)}</button>`).join('')}</div><div class="lab-grid"><div class="editor-shell"><div class="editor-toolbar"><span>lab.py</span><span>Python 3</span></div><textarea id="lab-editor" class="code-editor" spellcheck="false">${escapeHTML(labPresets['Fonction'])}</textarea><div class="runner-actions" style="padding:.7rem"><button id="lab-run" class="btn primary" type="button">▶ Exécuter</button><button id="lab-clear" class="btn" type="button">Effacer la sortie</button></div></div><div class="output-shell"><div class="output-toolbar"><span>SORTIE</span><span id="lab-status">prêt à charger</span></div><div class="runner-status" id="lab-output">Clique sur « Exécuter ».\n\nNote : input() interactif, tkinter et les accès au système local ne font pas partie de ce laboratoire navigateur.</div></div></div><div class="callout" style="margin-top:1rem"><strong>Conseil NSI :</strong> avant d’exécuter, écris mentalement la valeur attendue. L’écart entre ta prédiction et le résultat est souvent l’information la plus utile.</div>`;
  attachEditorTabBehavior();
}

function renderSources() {
  view.innerHTML = `<header><div class="page-kicker">Traçabilité & qualité</div><h1 class="page-title">Sources, choix et limites.</h1><p class="page-intro">Le contenu pédagogique est réécrit pour la NSI : le manuel fourni sert d’appui méthodologique, tandis que le périmètre exigible est piloté par les textes officiels. Le site ne reproduit pas le manuel.</p></header><div class="source-list" style="margin-top:1.5rem">${sources.map(s => `<article class="source-card"><div class="page-kicker">${escapeHTML(s.kind)}</div><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.note)}</p>${s.url ? `<a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">Ouvrir la source ↗</a>` : ''}</article>`).join('')}</div><section class="lesson-block"><h2>Principes de conception</h2><div class="key-points"><div class="key-point"><strong>Progressivité</strong><br><span class="muted">Cours → exemple → exercice guidé → consolidation → transfert.</span></div><div class="key-point"><strong>Feedback actionnable</strong><br><span class="muted">Les tests indiquent quel comportement échoue sans livrer immédiatement la réponse.</span></div><div class="key-point"><strong>Accessibilité</strong><br><span class="muted">Clavier, thèmes clair/sombre, mode projection, réduction des animations et impression propre.</span></div><div class="key-point"><strong>Résilience</strong><br><span class="muted">Pas de base de données requise ; progression en localStorage ; application statique déployable sur GitHub Pages.</span></div></div></section><p class="tiny">Version ${SITE_VERSION} · contenu initial septembre 2026.</p>`;
}
function renderNotFound() { view.innerHTML = `<div class="empty"><h1>Route introuvable</h1><p>Cette mission n’existe pas ou a été déplacée.</p><a class="btn primary" href="#home">Retour au parcours</a></div>`; }
function render() {
  const route = getRoute(); setActiveNav(route.name);
  if (route.name === 'home') renderHome(); else if (route.name === 'module') renderModule(route.id); else if (route.name === 'programme') renderProgramme(); else if (route.name === 'practice') renderPractice(); else if (route.name === 'lab') renderLab(); else if (route.name === 'sources') renderSources(); else renderNotFound();
  dynamicBinder(); if (!location.hash) location.hash = '#home'; window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
function attachEditorTabBehavior() {
  document.querySelectorAll('textarea.code-editor').forEach(editor => editor.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return; event.preventDefault(); const start = editor.selectionStart, end = editor.selectionEnd; editor.value = editor.value.slice(0, start) + '    ' + editor.value.slice(end); editor.selectionStart = editor.selectionEnd = start + 4;
  }));
}
export function setDynamicBinder(fn) { dynamicBinder = fn; }
export { view, html, toastEl, searchDialog, searchInput, searchResults, state, flashState, saveState, escapeHTML, stripHTML, routeTo, getRoute, showToast, moduleProgress, render, labPresets, renderPractice, flashQuestionsFor, attachEditorTabBehavior };
