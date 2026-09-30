import { capstones } from './content.js';
import { view, state, escapeHTML, getRoute } from './app-shell.js';
import { terminaleDependencies, canonicalVocabulary, bac2027, bacWrittenPrompts } from './terminale-transversal.js';

let queued = false;

function dependencyFor(id) {
  return terminaleDependencies.find(item => item.id === id);
}

function roadmapHTML() {
  return `<section id="terminale-roadmap" class="lesson-block">
    <div class="section-head"><div><div class="page-kicker">Audit transversal Terminale · T1 → T11</div><h2>Une chaîne de dépendances, pas onze chapitres isolés</h2></div><span class="chip">V1.24</span></div>
    <p>Avant chaque module, réactive seulement les notions qui vont réellement servir. Les ponts ci-dessous rendent visibles les dépendances sans ajouter de prérequis de spécialité mathématiques.</p>
    <table class="mapping-table"><thead><tr><th>Module</th><th>À réactiver</th><th>Pont conceptuel</th></tr></thead><tbody>
      ${terminaleDependencies.map(item => `<tr><td><a href="#module/${item.id}"><strong>${item.id}</strong></a></td><td>${item.recall.map(x=>escapeHTML(x)).join('<br>')}</td><td>${escapeHTML(item.bridge)}</td></tr>`).join('')}
    </tbody></table>
    <details style="margin-top:1rem"><summary><strong>Vocabulaire stable T1 → T11</strong></summary><div class="key-points" style="margin-top:.8rem">${canonicalVocabulary.map(([owner,term,definition])=>`<div class="key-point"><strong>${escapeHTML(owner)} · ${escapeHTML(term)}</strong><br><span class="muted">${escapeHTML(definition)}</span></div>`).join('')}</div></details>
  </section>`;
}

function bacPanelHTML() {
  return `<section id="bac-2027-transversal" class="lesson-block">
    <div class="section-head"><div><div class="page-kicker">Bac NSI · session 2027</div><h2>Coder, justifier, expliquer</h2></div><span class="chip">écrit + pratique</span></div>
    <div class="key-points">
      <div class="key-point"><strong>Écrit · ${escapeHTML(bac2027.written.duration)}</strong><br><span class="muted">${bac2027.written.exercises} exercices indépendants · ${escapeHTML(bac2027.written.weight)}.<br>${escapeHTML(bac2027.written.language)}</span></div>
      <div class="key-point"><strong>Pratique · ${escapeHTML(bac2027.practical.duration)}</strong><br><span class="muted">${escapeHTML(bac2027.practical.weight)}.<br>${escapeHTML(bac2027.practical.format)}</span></div>
      <div class="key-point"><strong>Périmètre de PYTHON//FORGE</strong><br><span class="muted">${escapeHTML(bac2027.scope)}</span></div>
    </div>
    <div class="divider"></div>
    <h3>11 questions écrites express — une par module</h3>
    <p class="muted">Réponds en phrases complètes avant d’ouvrir les critères. Le but est de préparer le raisonnement et le vocabulaire, pas seulement l’exécution de Python.</p>
    <div class="exercise-list">${bacWrittenPrompts.map(q=>`<details class="lesson-block" style="margin:.6rem 0"><summary><strong>${escapeHTML(q.moduleId)} · ${escapeHTML(q.title)}</strong></summary><p>${escapeHTML(q.prompt)}</p><textarea class="reflection-editor" aria-label="Réponse écrite ${escapeHTML(q.moduleId)}" placeholder="Ma réponse argumentée…"></textarea><details style="margin-top:.6rem"><summary>Afficher les critères attendus</summary><ul>${q.criteria.map(c=>`<li>${escapeHTML(c)}</li>`).join('')}</ul></details></details>`).join('')}</div>
  </section>`;
}

function moduleRecallHTML(item) {
  return `<section id="transversal-recall-${item.id}" class="lesson-block">
    <div class="page-kicker">Réactivation ciblée · avant ${item.id}</div>
    <h2>Ce qu’il faut remettre en mémoire</h2>
    <div class="key-points">${item.recall.map(x=>`<div class="key-point"><strong>${escapeHTML(x)}</strong></div>`).join('')}</div>
    <p class="muted"><strong>Pont :</strong> ${escapeHTML(item.bridge)}</p>
  </section>`;
}

function capstoneDialogueHTML(c) {
  const modules = (c.modules || []).join(' · ');
  return `<section id="capstone-dialogue" class="lesson-block">
    <div class="section-head"><div><div class="page-kicker">Dialogue avec l’examinateur · entraînement 2027</div><h2>Explique tes choix, pas seulement ton code</h2></div>${modules ? `<span class="chip">${escapeHTML(modules)}</span>` : ''}</div>
    <p>Une fois les tests passés, ferme la solution éventuelle et réponds oralement aux trois questions. Tu dois pouvoir nommer les structures, justifier un choix et citer un test pertinent.</p>
    <ol>${(c.dialogue || []).map(q=>`<li style="margin:.55rem 0">${escapeHTML(q)}</li>`).join('')}</ol>
    <textarea class="reflection-editor" aria-label="Notes pour le dialogue avec l’examinateur" placeholder="Mes mots-clés pour expliquer la solution…"></textarea>
  </section>`;
}

function enhanceHome() {
  if (state.track !== 'terminale' || document.querySelector('#terminale-roadmap')) return;
  const modulesSection = view.querySelector('#modules-title')?.closest('section');
  if (modulesSection) modulesSection.insertAdjacentHTML('afterend', roadmapHTML());
  else view.insertAdjacentHTML('beforeend', roadmapHTML());
}

function enhanceModule(id) {
  if (!/^T(?:[1-9]|1[01])$/.test(id)) return;
  const item = dependencyFor(id);
  if (!item || document.querySelector(`#transversal-recall-${id}`)) return;
  const intro = view.querySelector('.module-content header#intro');
  if (intro) intro.insertAdjacentHTML('afterend', moduleRecallHTML(item));
}

function enhancePractice() {
  if (state.track !== 'terminale') return;
  const capList = view.querySelector('.capstone-list');
  if (capList) {
    const p = capList.querySelector('.section-head p');
    if (p) p.textContent = `${capstones.length} situations originales pour assembler plusieurs compétences à partir d’un document de mission.`;
    capList.querySelectorAll('.capstone-card').forEach((card,index)=>{
      const c = capstones[index];
      if (!c || card.querySelector('[data-cap-modules]')) return;
      const tag = document.createElement('small');
      tag.dataset.capModules = '1';
      tag.className = 'muted';
      tag.textContent = (c.modules || []).length ? `Modules mobilisés : ${c.modules.join(' · ')}` : 'Compétences transversales';
      card.querySelector('p')?.insertAdjacentElement('afterend', tag);
    });
    if (!document.querySelector('#bac-2027-transversal')) capList.insertAdjacentHTML('beforebegin', bacPanelHTML());
  }
}

function enhanceCapstone(id) {
  if (document.querySelector('#capstone-dialogue')) return;
  const c = capstones.find(item => item.id === id);
  const situation = view.querySelector('.capstone-situation');
  if (c && situation) situation.insertAdjacentHTML('afterend', capstoneDialogueHTML(c));
}

function enhance() {
  const route = getRoute();
  if (route.name === 'home') enhanceHome();
  else if (route.name === 'module') enhanceModule(route.id);
  else if (route.name === 'practice') enhancePractice();
  else if (route.name === 'capstone') enhanceCapstone(route.id);
}

function schedule() {
  if (queued) return;
  queued = true;
  setTimeout(()=>{ queued = false; enhance(); }, 0);
}

new MutationObserver(schedule).observe(view, { childList:true, subtree:true });
window.addEventListener('hashchange', schedule);
window.addEventListener('python-forge:track-change', schedule);
setTimeout(schedule, 0);
