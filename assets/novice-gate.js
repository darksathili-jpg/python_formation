import { modules, noviceBank } from './content.js';
import { view, escapeHTML, getRoute, showToast } from './app-shell.js';

const NOVICE_VERSION = '1.3.0';
const STORAGE_KEY = 'python-forge-novice-v1.3';
const noviceByModule = new Map(noviceBank.map(item => [item.moduleId, item]));
let scheduled = false;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
function masteredCount(moduleId) {
  const progress = loadProgress();
  return Object.keys(progress[moduleId] || {}).length;
}
function markMastered(moduleId, questionIndex) {
  const progress = loadProgress();
  progress[moduleId] = progress[moduleId] || {};
  progress[moduleId][questionIndex] = Date.now();
  saveProgress(progress);
}

function codeHTML(code) {
  return `<pre class="novice-code"><code>${escapeHTML(code)}</code></pre>`;
}

function gateHTML(moduleId) {
  const data = noviceByModule.get(moduleId);
  if (!data) return '';
  const done = masteredCount(moduleId);
  return `<section id="novice-gate" class="lesson-block novice-gate" aria-labelledby="novice-title-${moduleId}">
    <div class="section-head novice-head">
      <div><div class="page-kicker">Novice Learning Gate · V${NOVICE_VERSION}</div><h2 id="novice-title-${moduleId}">Avant de coder : construire le bon modèle mental</h2></div>
      <span id="novice-score-${moduleId}" class="chip ${done === data.checks.length ? 'ok' : ''}">${done}/${data.checks.length} repères validés</span>
    </div>
    <p class="novice-goal"><strong>But du module :</strong> ${escapeHTML(data.goal)}</p>
    <div class="novice-three-col">
      <div class="novice-panel"><span class="novice-label">Tu as seulement besoin de…</span><ul>${data.prerequisites.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>
      <div class="novice-panel"><span class="novice-label">Mots à savoir expliquer</span>${data.vocabulary.map(([term,def])=>`<p><strong>${escapeHTML(term)}</strong><br><span>${escapeHTML(def)}</span></p>`).join('')}</div>
      <div class="novice-panel novice-method"><span class="novice-label">Méthode anti-page-blanche</span><ol><li>Lis le problème sans coder.</li><li>Dis ce qui doit changer.</li><li>Choisis la structure : condition, boucle, fonction ou donnée.</li><li>Teste un petit cas à la main.</li><li>Code seulement ensuite.</li></ol></div>
    </div>
    ${data.harness ? `<div class="harness-note"><strong>Important pour ce module :</strong> ${escapeHTML(data.harness)}</div>` : ''}
    <details class="worked-example" open>
      <summary><span>Exemple résolu et commenté</span><strong>${escapeHTML(data.worked.title)}</strong></summary>
      <div class="worked-body">
        <p>${escapeHTML(data.worked.problem)}</p>
        <div class="subgoal-grid">${data.worked.steps.map(([label,text])=>`<div class="subgoal"><b>${escapeHTML(label)}</b><span>${escapeHTML(text)}</span></div>`).join('')}</div>
        ${codeHTML(data.worked.code)}
        <p class="worked-prompt">Avant de passer aux exercices, cache le code quelques secondes et essaie de reformuler les trois étapes avec tes propres mots.</p>
      </div>
    </details>
    <div class="novice-check-zone">
      <div class="section-head compact"><div><div class="page-kicker">Récupération active</div><h3>Trois micro-questions avant la production</h3></div><p>Ce n’est pas une note. Une erreur indique simplement quoi relire.</p></div>
      <div class="novice-check-list">${data.checks.map((check, qi)=>`
        <article class="novice-check" data-novice-question="${qi}">
          <b>${qi+1}. ${escapeHTML(check.q)}</b>
          <div class="novice-options">${check.options.map((option, oi)=>`<button type="button" data-novice-answer="${moduleId}|${qi}|${oi}">${escapeHTML(option)}</button>`).join('')}</div>
          <div class="novice-feedback" id="novice-feedback-${moduleId}-${qi}" aria-live="polite"></div>
        </article>`).join('')}</div>
      <div id="novice-ready-${moduleId}" class="novice-ready">${readinessText(done, data.checks.length)}</div>
    </div>
    <details class="error-guide">
      <summary>Lire une erreur Python sans paniquer</summary>
      <div class="error-guide-grid">
        <p><strong>1.</strong> Lis d’abord le <em>nom</em> de l’erreur.</p>
        <p><strong>2.</strong> Repère la ligne indiquée, puis regarde aussi la ligne juste avant.</p>
        <p><strong>3.</strong> Formule ce que Python croyait devoir manipuler à cet endroit.</p>
        <p><strong>4.</strong> Change une seule chose, puis relance un petit test.</p>
      </div>
    </details>
  </section>`;
}

function readinessText(done, total) {
  if (done === total) return '✓ Les trois repères ont déjà été validés. Tu peux passer à la production autonome, puis revenir ici pour te tester à nouveau.';
  if (done === 0) return 'Commence par l’exemple résolu, puis réponds aux trois questions. Tu peux coder à tout moment : ce passage n’est jamais bloquant.';
  return `${done}/${total} repères déjà validés. Revois uniquement ce qui résiste : inutile de tout recommencer.`;
}

function bindGate(moduleId) {
  const data = noviceByModule.get(moduleId);
  if (!data) return;
  document.querySelectorAll('[data-novice-answer]').forEach(button => button.addEventListener('click', () => {
    const [targetModule, qRaw, oRaw] = button.dataset.noviceAnswer.split('|');
    if (targetModule !== moduleId) return;
    const qi = Number(qRaw), oi = Number(oRaw);
    const check = data.checks[qi];
    const card = button.closest('.novice-check');
    const feedback = document.querySelector(`#novice-feedback-${CSS.escape(moduleId)}-${qi}`);
    card.querySelectorAll('[data-novice-answer]').forEach(btn => btn.classList.remove('wrong'));
    if (oi === check.answer) {
      card.querySelectorAll('[data-novice-answer]').forEach(btn => btn.disabled = true);
      button.classList.add('correct');
      feedback.innerHTML = `<strong>✓ Oui.</strong> ${escapeHTML(check.explain)}`;
      markMastered(moduleId, qi);
      const done = masteredCount(moduleId);
      const score = document.querySelector(`#novice-score-${CSS.escape(moduleId)}`);
      if (score) {
        score.textContent = `${done}/${data.checks.length} repères validés`;
        score.classList.toggle('ok', done === data.checks.length);
      }
      const ready = document.querySelector(`#novice-ready-${CSS.escape(moduleId)}`);
      if (ready) ready.textContent = readinessText(done, data.checks.length);
      if (done === data.checks.length) showToast('Repères conceptuels validés — place au code.');
    } else {
      button.classList.add('wrong');
      feedback.innerHTML = `<strong>Pas encore.</strong> ${escapeHTML(check.explain)} Relis l’exemple puis essaie une autre réponse.`;
    }
  }));

  document.querySelectorAll('[data-novice-anchor]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById(link.dataset.noviceAnchor)?.scrollIntoView({ behavior:'smooth', block:'start' });
  }));
}

function enhanceModule(moduleId) {
  if (document.querySelector('#novice-gate')) return;
  const module = modules.find(m => m.id === moduleId);
  if (!module || !noviceByModule.has(moduleId)) return;
  const anchor = view.querySelector('#primm') || view.querySelector('#exercices');
  if (!anchor) return;
  anchor.insertAdjacentHTML('beforebegin', gateHTML(moduleId));
  const aside = view.querySelector('.module-aside');
  const divider = aside?.querySelector('.divider');
  if (divider && !aside.querySelector('[data-novice-anchor]')) {
    divider.insertAdjacentHTML('beforebegin', '<a href="#novice-gate" data-novice-anchor="novice-gate">Passerelle novice</a>');
  }
  bindGate(moduleId);
}

function enhanceHome() {
  if (document.querySelector('#novice-home-note')) return;
  const banner = view.querySelector('#pedagogy-no-math') || view.querySelector('.hero');
  if (!banner) return;
  banner.insertAdjacentHTML('afterend', `<section id="novice-home-note" class="novice-home-note"><div><div class="page-kicker">V1.3 · Novice Learning Gate</div><strong>Lire → expliquer → tracer mentalement → seulement ensuite écrire.</strong><p>Les 20 modules disposent désormais d’un exemple résolu à sous-objectifs, de vocabulaire explicite, de trois micro-questions de récupération active et d’un coach d’erreurs Python. Les premiers modules signalent clairement ce qui n’est pas encore un prérequis, notamment <code>def</code> et <code>return</code>.</p></div></section>`);
}

const ERROR_RULES = [
  [/IndentationError/i,'Indentation','Python ne reconnaît pas la structure des blocs.','Regarde les lignes après if, elif, else, for, while ou def : elles doivent être décalées de façon cohérente.'],
  [/SyntaxError/i,'Syntaxe','Python n’arrive pas à lire la phrase de code.','Vérifie d’abord parenthèses, guillemets, deux-points et ligne précédente. Ne modifie qu’un élément à la fois.'],
  [/NameError/i,'Nom inconnu','Un nom est utilisé avant d’avoir reçu de valeur, ou son orthographe diffère.','Compare exactement le nom signalé avec les affectations et paramètres disponibles.'],
  [/TypeError/i,'Types incompatibles','L’opération demandée ne convient pas aux types présents.','Identifie les deux valeurs concernées et demande-toi : entier, chaîne, liste, booléen… ?'],
  [/IndexError/i,'Indice hors limites','Le programme demande une position qui n’existe pas dans la séquence.','Pour une liste de longueur n, les indices valides vont de 0 à n-1. Teste avec une très petite liste.'],
  [/KeyError/i,'Clé absente','Le dictionnaire ne contient pas la clé demandée.','Affiche ou relis les clés réellement présentes avant l’accès d[cle].'],
  [/AssertionError/i,'Contrat non respecté','Une assertion a signalé qu’une condition attendue est fausse.','Relis la précondition ou le test concerné : l’entrée est-elle autorisée ?'],
  [/RecursionError/i,'Récursion sans arrêt','Les appels récursifs ne rejoignent pas assez vite un cas de base.','Repère le cas de base puis vérifie que chaque appel travaille sur un problème strictement plus petit.'],
  [/ZeroDivisionError/i,'Division par zéro','Le diviseur vaut 0 pour au moins un cas.','Cherche quelle entrée produit 0 et décide si elle doit être refusée ou traitée séparément.'],
  [/AttributeError/i,'Attribut ou méthode absent','L’objet ne possède pas le nom demandé.','Vérifie le type de l’objet et l’orthographe de l’attribut ou de la méthode.'],
  [/interrompue après 6 s/i,'Programme qui ne termine pas','Le garde-fou a arrêté l’exécution.','Pour while : quelle variable rapproche de la sortie ? Pour la récursion : quel argument se rapproche du cas de base ?']
];

function coachFor(output) {
  const text = output.textContent || '';
  for (const [regex,title,meaning,action] of ERROR_RULES) {
    if (regex.test(text)) return { key:title, title, meaning, action };
  }
  if (output.querySelector('.test-item.fail') || /✗/.test(text)) {
    return { key:'test', title:'Test qui échoue', meaning:'Le programme s’exécute, mais son comportement ne correspond pas encore à au moins un cas attendu.', action:'Lis le libellé du premier test rouge. Rejoue ce cas à la main avec les valeurs exactes et suis les variables ligne par ligne.' };
  }
  return null;
}

function enhanceErrorFeedback() {
  document.querySelectorAll('.runner-status').forEach(output => {
    const shell = output.closest('.output-shell') || output.parentElement;
    if (!shell) return;
    const existing = shell.querySelector(':scope > .novice-error-coach');
    const coach = coachFor(output);
    if (!coach) { existing?.remove(); return; }
    if (existing?.dataset.coachKey === coach.key) return;
    existing?.remove();
    output.insertAdjacentHTML('afterend', `<aside class="novice-error-coach" data-coach-key="${escapeHTML(coach.key)}"><span class="novice-label">Coach de débogage · ${escapeHTML(coach.title)}</span><p>${escapeHTML(coach.meaning)}</p><p><strong>Première action :</strong> ${escapeHTML(coach.action)}</p><small>Le message Python original reste visible : apprendre à le lire fait partie de l’apprentissage.</small></aside>`);
  });
}

function enhance() {
  const route = getRoute();
  if (route.name === 'home') enhanceHome();
  if (route.name === 'module' && route.id) enhanceModule(route.id);
  enhanceErrorFeedback();
}
function scheduleEnhance() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => { scheduled = false; enhance(); }, 35);
}

const observer = new MutationObserver(scheduleEnhance);
observer.observe(view, { childList:true, subtree:true, characterData:true });
window.addEventListener('hashchange', scheduleEnhance);
setTimeout(scheduleEnhance, 0);
console.info(`PYTHON//FORGE Novice Learning Gate v${NOVICE_VERSION} chargé : ${noviceBank.length} passerelles.`);
