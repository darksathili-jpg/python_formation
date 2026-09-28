import { modules, tracks, practiceBank, primmBank, capstones } from './content.js';
import { view, state, saveState, escapeHTML, getRoute, routeTo, showToast, attachEditorTabBehavior } from './app-shell.js';
import { APP_VERSION } from './runtime-config.js?v=1.1.0';

const PED_VERSION = '1.2.0';
const trainingByModule = new Map(modules.map(m => [m.id, practiceBank.filter(e => e.moduleId === m.id)]));
const primmByModule = new Map(primmBank.map(a => [a.moduleId, a]));
const moduleById = new Map(modules.map(m => [m.id, m]));
const exerciseById = new Map([...practiceBank, ...capstones].map(e => [e.id, e]));
const parsonsState = new Map();
let enhanceQueued = false;

state.history = state.history || {};

class LearningRunner {
  constructor() {
    this.worker = null;
    this.ready = null;
    this.pending = new Map();
    this.seq = 0;
    this.idleTimer = 0;
  }
  ensure() {
    clearTimeout(this.idleTimer);
    if (this.worker && this.ready) return this.ready;
    const worker = new Worker(new URL(`./python-worker.js?v=${APP_VERSION}`, import.meta.url), { type: 'module' });
    this.worker = worker;
    this.ready = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Le moteur Python met trop de temps à démarrer.')), 30000);
      worker.addEventListener('message', event => {
        const data = event.data || {};
        if (data.type === 'ready') { clearTimeout(timer); resolve(); }
        if (data.type === 'boot-error') { clearTimeout(timer); reject(new Error(data.error || 'Python indisponible.')); }
        if (data.type === 'result' && this.pending.has(data.requestId)) {
          const pending = this.pending.get(data.requestId);
          clearTimeout(pending.timer);
          this.pending.delete(data.requestId);
          pending.resolve(data);
          this.scheduleIdleStop();
        }
      });
      worker.addEventListener('error', error => { clearTimeout(timer); reject(error); });
    }).catch(error => {
      if (this.worker === worker) worker.terminate();
      this.worker = null;
      this.ready = null;
      throw error;
    });
    return this.ready;
  }
  scheduleIdleStop() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (this.pending.size === 0 && this.worker) {
        this.worker.terminate();
        this.worker = null;
        this.ready = null;
      }
    }, 90000);
  }
  async run(code, tests = []) {
    await this.ensure();
    const requestId = ++this.seq;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        if (this.worker) this.worker.terminate();
        this.worker = null;
        this.ready = null;
        reject(new Error('Exécution interrompue après 6 s. Vérifie tes boucles et appels récursifs.'));
      }, 6000);
      this.pending.set(requestId, { resolve, reject, timer });
      this.worker.postMessage({ type: 'run', requestId, code, tests, stdin: '' });
    });
  }
}
const runner = new LearningRunner();

function trackOfExercise(ex) {
  if (ex.track) return ex.track;
  const module = moduleById.get(ex.moduleId);
  return module?.track || 'premiere';
}

function totalForTrack(track) {
  const core = modules.filter(m => m.track === track).reduce((n,m) => n + m.exercises.length, 0);
  const extra = practiceBank.filter(e => trackOfExercise(e) === track).length;
  return core + extra;
}
function solvedForTrack(track) {
  const ids = [
    ...modules.filter(m => m.track === track).flatMap(m => m.exercises.map(e => e.id)),
    ...practiceBank.filter(e => trackOfExercise(e) === track).map(e => e.id)
  ];
  return ids.filter(id => state.solved[id]).length;
}
function moduleTrainingProgress(moduleId) {
  const items = trainingByModule.get(moduleId) || [];
  const done = items.filter(e => state.solved[e.id]).length;
  return { done, total: items.length };
}

function kindLabel(kind) {
  return ({'compléter':'À compléter','déboguer':'Débogage','écrire':'Écriture','transfert':'Transfert','application':'Application'})[kind] || kind;
}

function exerciseHTML(ex, mode='training') {
  const solved = Boolean(state.solved[ex.id]);
  const attempts = state.attempts[ex.id] || 0;
  const title = mode === 'capstone' ? `Application ${ex.id}` : `Entraînement ${ex.id}`;
  return `<article class="exercise-card pedagogy-exercise ${mode === 'capstone' ? 'capstone-exercise' : ''}" id="${ex.id}">
    <header class="exercise-head">
      <div><div class="page-kicker">${title}</div><h3>${escapeHTML(ex.title)}</h3></div>
      <div><span class="chip pedagogy-kind">${escapeHTML(kindLabel(ex.kind))}</span> <span class="mono" aria-label="niveau ${ex.level} sur 3">${'◆'.repeat(ex.level)}${'◇'.repeat(3-ex.level)}</span> ${solved ? '<span class="chip ok">✓ validé</span>' : `<span class="chip">${attempts} essai${attempts > 1 ? 's' : ''}</span>`}</div>
    </header>
    <div class="exercise-body">
      <p class="exercise-prompt">${ex.prompt}</p>
      <div class="exercise-grid">
        <div>
          <div class="editor-shell">
            <div class="editor-toolbar"><span>${ex.id.toLowerCase()}.py</span><span>Python 3 · navigateur</span></div>
            <textarea class="code-editor" id="ped-editor-${ex.id}" aria-label="Code Python pour ${escapeHTML(ex.title)}" spellcheck="false">${escapeHTML(ex.starter)}</textarea>
          </div>
          <div class="runner-actions">
            <button class="btn primary" type="button" data-ped-run="${ex.id}">▶ Tester</button>
            <button class="btn" type="button" data-ped-reset="${ex.id}">↺ Réinitialiser</button>
            <button class="btn" type="button" data-ped-hint="${ex.id}">? Indice</button>
            <button class="btn scaffold-btn" type="button" data-ped-parsons="${ex.id}">▦ Tremplin</button>
            <button class="btn ghost" type="button" data-ped-solution="${ex.id}">Voir une solution</button>
          </div>
          <div id="ped-hint-${ex.id}"></div>
          <div id="ped-parsons-${ex.id}"></div>
          <div id="ped-solution-${ex.id}"></div>
        </div>
        <div class="output-shell">
          <div class="output-toolbar"><span>VALIDATION</span><span id="ped-status-${ex.id}">${solved ? '✓ réussi' : 'en attente'}</span></div>
          <div class="runner-status" id="ped-output-${ex.id}">Objectif : faire passer ${ex.tests.length} test${ex.tests.length > 1 ? 's' : ''}. Les aides restent facultatives.</div>
        </div>
      </div>
    </div>
  </article>`;
}

function primmHTML(moduleId) {
  const a = primmByModule.get(moduleId);
  if (!a) return '';
  return `<section class="lesson-block primm-lab" id="primm">
    <div class="section-head">
      <div><div class="page-kicker">Atelier PRIMM · comprendre avant d’écrire</div><h2>${escapeHTML(a.title)}</h2></div>
      <span class="chip">P → R → I → M → M</span>
    </div>
    <div class="primm-steps">
      <div class="primm-step"><b>1 · PRÉDIRE</b><p>${escapeHTML(a.predict)}</p><textarea id="primm-pred-${moduleId}" class="reflection-editor" placeholder="Ma prédiction et ma justification…"></textarea></div>
      <div class="primm-step"><b>2 · EXÉCUTER</b><p>Compare ensuite le résultat réel à ta prédiction.</p></div>
      <div class="primm-step"><b>3 · INVESTIGUER</b><ul>${a.investigate.map(q=>`<li>${escapeHTML(q)}</li>`).join('')}</ul></div>
      <div class="primm-step"><b>4 · MODIFIER</b><p>${escapeHTML(a.modify)}</p></div>
      <div class="primm-step"><b>5 · CRÉER</b><p>${escapeHTML(a.make)}</p></div>
    </div>
    <div class="primm-code-grid">
      <div class="editor-shell"><div class="editor-toolbar"><span>primm-${moduleId.toLowerCase()}.py</span><span>observe → modifie</span></div><textarea id="primm-code-${moduleId}" class="code-editor primm-editor" spellcheck="false">${escapeHTML(a.seed)}</textarea><div class="runner-actions" style="padding:.7rem"><button class="btn primary" type="button" data-primm-run="${moduleId}">▶ Exécuter / comparer</button><button class="btn" type="button" data-primm-reset="${moduleId}">↺ Code initial</button></div></div>
      <div class="output-shell"><div class="output-toolbar"><span>OBSERVATION</span><span>PRIMM</span></div><div class="runner-status" id="primm-output-${moduleId}">Commence par écrire ta prédiction avant d’exécuter.</div></div>
    </div>
  </section>`;
}

function noMathBanner() {
  return `<section class="no-math-banner" id="pedagogy-no-math">
    <div class="no-math-icon" aria-hidden="true">≠∑</div>
    <div><div class="page-kicker">NSI accessible sans spécialité mathématiques</div><strong>On apprend ici à raisonner comme informaticien.</strong><p>Lorsqu’une formule est utile, elle est donnée. Les exercices évaluent la décomposition d’un problème, les structures de données, les conditions, les boucles, les fonctions, les tests et les algorithmes — pas des prérequis de spécialité maths.</p></div>
  </section>`;
}

function enhanceHome() {
  if (document.querySelector('#pedagogy-no-math')) return;
  const hero = view.querySelector('.hero');
  if (hero) hero.insertAdjacentHTML('afterend', noMathBanner());
  const total = totalForTrack(state.track);
  const done = solvedForTrack(state.track);
  const stats = view.querySelectorAll('.stats-row .stat');
  if (stats.length >= 4) {
    stats[1].querySelector('b').textContent = total;
    stats[1].querySelector('small').textContent = 'exercices Python';
    stats[2].querySelector('b').textContent = done;
    stats[2].querySelector('small').textContent = 'exercices validés';
    stats[3].querySelector('b').textContent = total ? Math.round(done*100/total)+'%' : '0%';
  }
  modules.filter(m=>m.track===state.track).forEach(m => {
    const card = view.querySelector(`a.module-card[href="#module/${m.id}"]`);
    if (!card || card.querySelector('.training-chip')) return;
    const p = moduleTrainingProgress(m.id);
    card.querySelector('.module-meta')?.insertAdjacentHTML('beforeend', `<span class="chip training-chip">${p.done}/${p.total} entraînements</span>`);
  });
}

function enhanceModule(moduleId) {
  if (document.querySelector('#pedagogy-training')) return;
  const module = moduleById.get(moduleId);
  if (!module) return;
  const content = view.querySelector('.module-content');
  const core = content?.querySelector('#exercices');
  if (!content || !core) return;
  core.insertAdjacentHTML('beforebegin', primmHTML(moduleId));
  const items = trainingByModule.get(moduleId) || [];
  const p = moduleTrainingProgress(moduleId);
  core.insertAdjacentHTML('afterend', `<section id="pedagogy-training" class="training-zone">
    <div class="section-head"><div><div class="page-kicker">Terrain d’entraînement · 5 variations</div><h2>Automatiser sans répéter le même exercice</h2></div><p><strong>${p.done}/${p.total}</strong> validés · compléter, déboguer, écrire, transférer.</p></div>
    <div class="training-rationale"><strong>Pourquoi plusieurs formats ?</strong> Reconnaître un code, le réparer, compléter une étape puis produire seul ne sollicitent pas exactement les mêmes stratégies. Le « Tremplin » est optionnel si la page blanche bloque.</div>
    <div class="exercise-list">${items.map(e=>exerciseHTML(e)).join('')}</div>
  </section>`);
  const aside = view.querySelector('.module-aside');
  const divider = aside?.querySelector('.divider');
  if (divider) {
    divider.insertAdjacentHTML('beforebegin', `<a href="#primm" data-ped-anchor="primm">Atelier PRIMM</a><a href="#pedagogy-training" data-ped-anchor="pedagogy-training">Entraînement ×5</a>`);
  }
  attachEditorTabBehavior();
}

function practiceGymHTML() {
  const track = state.track;
  const bank = practiceBank.filter(e => trackOfExercise(e) === track);
  const done = bank.filter(e => state.solved[e.id]).length;
  const kinds = ['compléter','déboguer','écrire','transfert'];
  const cap = track === 'terminale' ? `<section class="capstone-list"><div class="section-head"><div><div class="page-kicker">Bac NSI · session 2027</div><h2>Applications intégratives · format 60 min</h2></div><p>Quatre situations originales pour assembler plusieurs compétences à partir d’un document de mission.</p></div><div class="capstone-grid">${capstones.map(c=>`<a class="capstone-card" href="#capstone/${c.id}"><span>${escapeHTML(c.duration)}</span><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.focus)}</p><b>Ouvrir l’application →</b></a>`).join('')}</div></section>` : '';
  return `<section id="practice-gym" class="lesson-block practice-gym">
    <div class="section-head"><div><div class="page-kicker">Salle d’entraînement · ${tracks[track].label}</div><h2>${bank.length} exercices supplémentaires, contextes variés</h2></div><span class="chip ${done===bank.length?'ok':''}">${done}/${bank.length} validés</span></div>
    <p>Aucun exercice de cette banque ne suppose la spécialité mathématiques. Les contextes alternent jeux, messages, musique, données, capteurs, fichiers, sécurité et applications concrètes.</p>
    <div class="gym-actions">
      <button class="btn primary" data-ped-random="all">⚄ Exercice surprise</button>
      ${kinds.map(k=>`<button class="btn" data-ped-random="${k}">${escapeHTML(kindLabel(k))}</button>`).join('')}
      <button class="btn ghost" data-ped-reactivate>↻ Réactivation espacée</button>
    </div>
    <div class="retrieval-note"><strong>Réactivation :</strong> lorsqu’un exercice déjà réussi date d’une séance précédente, il redevient une cible utile. Le but n’est pas le score mais la récupération active en mémoire.</div>
  </section>${cap}`;
}

function enhancePractice() {
  if (document.querySelector('#practice-gym')) return;
  const toolbar = view.querySelector('.practice-toolbar');
  if (toolbar) toolbar.insertAdjacentHTML('afterend', noMathBanner() + practiceGymHTML());
  else view.insertAdjacentHTML('beforeend', noMathBanner() + practiceGymHTML());
}

function renderCapstone(capstoneId) {
  const c = capstones.find(x=>x.id===capstoneId);
  if (!c) return;
  view.innerHTML = `<header class="capstone-hero"><div class="page-kicker">Application intégrative · Terminale NSI · session 2027</div><h1 class="page-title">${escapeHTML(c.title)}</h1><p class="page-intro">${escapeHTML(c.focus)} · temps cible ${escapeHTML(c.duration)}</p><div class="hero-actions"><a class="btn" href="#practice">← Retour à l’entraînement</a></div></header>
    <section class="mission-document"><div class="page-kicker">Document de mission</div><h2>Contexte et contrat</h2><p>${escapeHTML(c.document)}</p><div class="capstone-rules"><span>1 · Lire tout le document</span><span>2 · Identifier les fonctions/classes attendues</span><span>3 · Prédire des cas tests</span><span>4 · Programmer</span><span>5 · Justifier au dialogue</span></div></section>
    <section class="capstone-situation">${exerciseHTML(c,'capstone')}</section>`;
  attachEditorTabBehavior();
}

async function runExercise(id) {
  const ex = exerciseById.get(id);
  if (!ex) return;
  const editor = document.querySelector(`#ped-editor-${CSS.escape(id)}`);
  const output = document.querySelector(`#ped-output-${CSS.escape(id)}`);
  const status = document.querySelector(`#ped-status-${CSS.escape(id)}`);
  const btn = document.querySelector(`[data-ped-run="${CSS.escape(id)}"]`);
  if (!editor || !output || !status || !btn) return;
  state.attempts[id] = (state.attempts[id] || 0) + 1;
  saveState();
  btn.disabled = true; btn.textContent = '⏳ Test en cours…';
  status.textContent = 'exécution'; output.textContent = 'Python vérifie ton programme…';
  try {
    const result = await runner.run(editor.value, ex.tests);
    const testHTML = result.tests.map(t=>`<div class="test-item ${t.pass?'pass':'fail'}">${t.pass?'✓':'✗'} ${escapeHTML(t.label)}${t.error?` — ${escapeHTML(t.error)}`:''}</div>`).join('');
    const logs = [result.stdout?.trim(), result.stderr?.trim(), result.error].filter(Boolean).join('\n');
    output.innerHTML = `${logs?`<pre class="ped-log">${escapeHTML(logs)}</pre>`:''}<div class="test-list">${testHTML}</div>`;
    const ok = result.ok && result.tests.length === ex.tests.length && result.tests.every(t=>t.pass);
    if (ok) {
      state.solved[id] = true;
      state.history[id] = Date.now();
      saveState();
      status.textContent = '✓ tous les tests passent';
      output.insertAdjacentHTML('afterbegin','<div class="mission-success">✓ Validé. Reformule maintenant l’idée de l’algorithme en une phrase.</div>');
      showToast(`${id} validé — apprentissage enregistré localement.`);
      updateTrainingProgress(ex.moduleId);
    } else status.textContent = result.error ? 'erreur d’exécution' : 'tests à corriger';
  } catch (error) {
    status.textContent = 'interrompu';
    output.textContent = error.message || String(error);
  } finally {
    btn.disabled = false; btn.textContent = '▶ Tester';
  }
}

function updateTrainingProgress(moduleId) {
  if (!moduleId) return;
  const p = moduleTrainingProgress(moduleId);
  const zone = document.querySelector('#pedagogy-training .section-head p');
  if (zone) zone.innerHTML = `<strong>${p.done}/${p.total}</strong> validés · compléter, déboguer, écrire, transférer.`;
}

function showHint(id) {
  const ex = exerciseById.get(id); if (!ex) return;
  const target = document.querySelector(`#ped-hint-${CSS.escape(id)}`); if (!target) return;
  const shown = Number(target.dataset.shown || 0);
  const i = Math.min(shown, ex.hints.length - 1);
  target.dataset.shown = String(i+1);
  target.innerHTML = `<div class="hint-box"><strong>Indice ${i+1}/${ex.hints.length}</strong><br>${escapeHTML(ex.hints[i])}</div>`;
}
function showSolution(id) {
  const ex = exerciseById.get(id); if (!ex) return;
  const target = document.querySelector(`#ped-solution-${CSS.escape(id)}`); if (!target) return;
  if (!(state.attempts[id] > 0) && !confirm('Tu n’as encore lancé aucun test. Afficher quand même une solution possible ?')) return;
  target.innerHTML = `<div class="solution"><div class="page-kicker">Une solution possible</div><pre>${escapeHTML(ex.solution)}</pre><p class="tiny">Compare les choix, puis ferme la solution et réécris l’idée sans la recopier.</p></div>`;
}
function resetExercise(id) {
  const ex = exerciseById.get(id); if (!ex) return;
  const editor = document.querySelector(`#ped-editor-${CSS.escape(id)}`);
  const output = document.querySelector(`#ped-output-${CSS.escape(id)}`);
  if (editor) editor.value = ex.starter;
  if (output) output.textContent = 'Code réinitialisé. La validation acquise reste conservée.';
}
function scrambledLines(solution, id) {
  const lines = solution.split('\n').filter(line=>line.trim() !== '');
  return lines.map((line,i)=>({line,key:(i*37 + id.split('').reduce((a,c)=>a+c.charCodeAt(0),0))%97})).sort((a,b)=>a.key-b.key).map(x=>x.line);
}
function showParsons(id) {
  const ex = exerciseById.get(id); if (!ex) return;
  const target = document.querySelector(`#ped-parsons-${CSS.escape(id)}`); if (!target) return;
  if (!(state.attempts[id] > 0)) {
    target.innerHTML = '<div class="hint-box"><strong>Tremplin verrouillé.</strong> Lance d’abord au moins un test : l’erreur obtenue fait partie de l’apprentissage.</div>';
    return;
  }
  let lines = parsonsState.get(id);
  if (!lines) { lines = scrambledLines(ex.solution,id); parsonsState.set(id,lines); }
  renderParsons(id);
}
function renderParsons(id) {
  const target = document.querySelector(`#ped-parsons-${CSS.escape(id)}`); if (!target) return;
  const lines = parsonsState.get(id) || [];
  target.innerHTML = `<div class="parsons-box"><div class="page-kicker">Tremplin Parsons · reconstruis avant de recopier</div><p>Replace les lignes dans l’ordre. L’indentation fait partie du programme.</p><ol class="parsons-list">${lines.map((line,i)=>`<li><code>${escapeHTML(line).replace(/ /g,'&nbsp;')}</code><span><button type="button" aria-label="Monter la ligne" data-parsons-up="${id}" data-index="${i}">↑</button><button type="button" aria-label="Descendre la ligne" data-parsons-down="${id}" data-index="${i}">↓</button></span></li>`).join('')}</ol><div class="runner-actions"><button class="btn" type="button" data-parsons-check="${id}">Vérifier l’ordre</button></div><div id="parsons-feedback-${id}" class="tiny"></div></div>`;
}
function moveParsons(id, index, delta) {
  const lines = parsonsState.get(id); if (!lines) return;
  const j = index + delta; if (j < 0 || j >= lines.length) return;
  [lines[index], lines[j]] = [lines[j], lines[index]];
  renderParsons(id); bindPedagogyActions();
}
function checkParsons(id) {
  const ex=exerciseById.get(id); const lines=parsonsState.get(id); if(!ex||!lines)return;
  const target = ex.solution.split('\n').filter(line=>line.trim()!=='');
  const ok = target.length===lines.length && target.every((line,i)=>line===lines[i]);
  const fb=document.querySelector(`#parsons-feedback-${CSS.escape(id)}`);
  if(fb){fb.textContent=ok?'✓ Ordre correct. Réécris maintenant le code toi-même.':'Pas encore. Repère d’abord le cas de base, les initialisations et l’ordre des blocs.';fb.className=`tiny ${ok?'parsons-ok':'parsons-warn'}`;}
}

async function runPrimm(moduleId) {
  const editor=document.querySelector(`#primm-code-${CSS.escape(moduleId)}`);
  const output=document.querySelector(`#primm-output-${CSS.escape(moduleId)}`);
  if(!editor||!output)return;
  output.textContent='Exécution…';
  try {
    const result=await runner.run(editor.value,[]);
    output.textContent=[result.stdout?.trim(),result.stderr?.trim(),result.error].filter(Boolean).join('\n') || '(aucune sortie)';
  } catch(error){output.textContent=error.message||String(error);}
}
function resetPrimm(moduleId) {
  const a=primmByModule.get(moduleId), editor=document.querySelector(`#primm-code-${CSS.escape(moduleId)}`);
  if(a&&editor) editor.value=a.seed;
}

function openRandom(kind='all') {
  let pool=practiceBank.filter(e=>trackOfExercise(e)===state.track && (kind==='all'||e.kind===kind));
  const unsolved=pool.filter(e=>!state.solved[e.id]);
  if(unsolved.length) pool=unsolved;
  if(!pool.length)return;
  const e=pool[Math.floor(Math.random()*pool.length)];
  routeTo(`module/${e.moduleId}`);
  sessionStorage.setItem('python-forge-ped-target',e.id);
}
function reactivate() {
  let pool=practiceBank.filter(e=>trackOfExercise(e)===state.track && state.solved[e.id]);
  if(!pool.length){openRandom('all');return;}
  pool.sort((a,b)=>(state.history[a.id]||0)-(state.history[b.id]||0));
  const e=pool[0];
  routeTo(`module/${e.moduleId}`);
  sessionStorage.setItem('python-forge-ped-target',e.id);
}

function updateSearchIntegration() {
  const input=document.querySelector('#search-input');
  if(!input||input.dataset.pedBound)return;
  input.dataset.pedBound='1';
  input.addEventListener('input',()=>setTimeout(()=>{
    const q=input.value.trim().toLocaleLowerCase('fr');
    if(!q)return;
    const container=document.querySelector('#search-results');
    if(!container)return;
    container.querySelectorAll('[data-ped-search]').forEach(n=>n.remove());
    const matches=practiceBank.filter(e=>`${e.id} ${e.title} ${e.tags?.join(' ')} ${e.prompt}`.toLocaleLowerCase('fr').includes(q)).slice(0,5);
    for(const e of matches){
      const a=document.createElement('a');
      a.className='search-result'; a.dataset.pedSearch='1'; a.href=`#module/${e.moduleId}`;
      a.innerHTML=`<strong>${escapeHTML(e.id+' · '+e.title)}</strong><small>Entraînement · ${escapeHTML(kindLabel(e.kind))}</small>`;
      a.addEventListener('click',()=>sessionStorage.setItem('python-forge-ped-target',e.id));
      container.appendChild(a);
    }
    const caps=capstones.filter(c=>`${c.title} ${c.focus}`.toLocaleLowerCase('fr').includes(q)).slice(0,2);
    for(const c of caps){
      const a=document.createElement('a');a.className='search-result';a.dataset.pedSearch='1';a.href=`#capstone/${c.id}`;a.innerHTML=`<strong>${escapeHTML(c.title)}</strong><small>Application intégrative · Terminale</small>`;container.appendChild(a);
    }
  },0));
}

function bindPedagogyActions() {
  document.querySelectorAll('[data-ped-run]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>runExercise(b.dataset.pedRun));}});
  document.querySelectorAll('[data-ped-reset]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>resetExercise(b.dataset.pedReset));}});
  document.querySelectorAll('[data-ped-hint]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>showHint(b.dataset.pedHint));}});
  document.querySelectorAll('[data-ped-solution]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>showSolution(b.dataset.pedSolution));}});
  document.querySelectorAll('[data-ped-parsons]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>showParsons(b.dataset.pedParsons));}});
  document.querySelectorAll('[data-primm-run]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>runPrimm(b.dataset.primmRun));}});
  document.querySelectorAll('[data-primm-reset]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>resetPrimm(b.dataset.primmReset));}});
  document.querySelectorAll('[data-ped-anchor]').forEach(a=>{if(!a.dataset.bound){a.dataset.bound='1';a.addEventListener('click',event=>{event.preventDefault();document.getElementById(a.dataset.pedAnchor)?.scrollIntoView({behavior:'smooth',block:'start'});});}});
  document.querySelectorAll('[data-ped-random]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>openRandom(b.dataset.pedRandom));}});
  document.querySelectorAll('[data-ped-reactivate]').forEach(b=>{if(!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',reactivate);}});
  document.querySelectorAll('[data-parsons-up]').forEach(b=>b.addEventListener('click',()=>moveParsons(b.dataset.parsonsUp,Number(b.dataset.index),-1)));
  document.querySelectorAll('[data-parsons-down]').forEach(b=>b.addEventListener('click',()=>moveParsons(b.dataset.parsonsDown,Number(b.dataset.index),1)));
  document.querySelectorAll('[data-parsons-check]').forEach(b=>b.addEventListener('click',()=>checkParsons(b.dataset.parsonsCheck)));
  updateSearchIntegration();
}

function enhance() {
  const route=getRoute();
  if(route.name==='home') enhanceHome();
  else if(route.name==='module') enhanceModule(route.id);
  else if(route.name==='practice') enhancePractice();
  else if(route.name==='capstone') renderCapstone(route.id);
  bindPedagogyActions();
  const target=sessionStorage.getItem('python-forge-ped-target');
  if(target && document.getElementById(target)){
    sessionStorage.removeItem('python-forge-ped-target');
    setTimeout(()=>document.getElementById(target)?.scrollIntoView({behavior:'smooth',block:'start'}),120);
  }
}
function scheduleEnhance() {
  if(enhanceQueued)return;
  enhanceQueued=true;
  queueMicrotask(()=>{enhanceQueued=false;enhance();});
}

const observer=new MutationObserver(scheduleEnhance);
observer.observe(view,{childList:true});
window.addEventListener('hashchange',()=>setTimeout(scheduleEnhance,0));
setTimeout(scheduleEnhance,0);
console.info(`PYTHON//FORGE Pedagogy Engine v${PED_VERSION} chargé : ${practiceBank.length} entraînements, ${primmBank.length} ateliers PRIMM, ${capstones.length} applications.`);
