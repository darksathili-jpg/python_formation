import { modules, practiceBank, capstones } from './content.js';
import { exerciseEditorialBriefHTML } from './editorial-overrides.js';

const view = document.querySelector('#view');
const moduleById = new Map(modules.map(m=>[m.id,m]));
const exerciseById = new Map();
for (const module of modules) for (const ex of module.exercises) exerciseById.set(ex.id,{ex,module});
for (const ex of practiceBank) exerciseById.set(ex.id,{ex,module:moduleById.get(ex.moduleId)});
for (const ex of capstones) exerciseById.set(ex.id,{ex,module:moduleById.get(ex.moduleId)});

let queued=false;
function enhanceStatements(){
  queued=false;
  if(!view) return;
  for(const card of view.querySelectorAll('.exercise-card[id]')){
    if(card.querySelector('.exercise-brief')) continue;
    const found=exerciseById.get(card.id);
    if(!found) continue;
    const body=card.querySelector('.exercise-body');
    if(!body) continue;
    const prompt=body.querySelector('.exercise-prompt');
    if(prompt){
      prompt.classList.add('exercise-prompt-legacy');
      prompt.setAttribute('aria-hidden','true');
    }
    const target=body.querySelector('.exercise-grid');
    const detailed=exerciseEditorialBriefHTML(found.ex,found.module);
    if(target) target.insertAdjacentHTML('beforebegin',detailed);
    else body.insertAdjacentHTML('afterbegin',detailed);
  }
}
function queueEnhance(){if(queued)return;queued=true;queueMicrotask(enhanceStatements)}
if(view){new MutationObserver(queueEnhance).observe(view,{childList:true,subtree:true});}
queueEnhance();
window.addEventListener('hashchange',queueEnhance);
