import { modules, practiceBank, capstones } from '../assets/content.js';
import { buildEditorialBrief, exerciseEditorialBriefHTML } from '../assets/editorial-overrides.js';

const moduleById = new Map(modules.map(m=>[m.id,m]));
const all = [
  ...modules.flatMap(module=>module.exercises.map(ex=>({ex,module}))),
  ...practiceBank.map(ex=>({ex,module:moduleById.get(ex.moduleId)})),
  ...capstones.map(ex=>({ex,module:moduleById.get(ex.moduleId)}))
];

const errors=[];
const genericParam = /paramètre fourni|rôle est précisé|signification est donnée par la mission/i;
const genericResult = /respecter exactement la règle décrite|résultat renvoyé ou affiché/i;

for(const {ex,module} of all){
  const b=buildEditorialBrief(ex,module);
  const html=exerciseEditorialBriefHTML(ex,module);
  if(!b.task || b.task.length<18) errors.push(`${ex.id}: mission trop courte (${b.task.length})`);
  if(!b.narrative || b.narrative.length<90) errors.push(`${ex.id}: reformulation éditoriale insuffisante`);
  if(!b.resultRule || b.resultRule.length<45 || genericResult.test(b.resultRule)) errors.push(`${ex.id}: résultat attendu trop générique`);
  if(!b.before || b.before.length<70) errors.push(`${ex.id}: guidage avant codage insuffisant`);
  if(!b.check || b.check.length<35) errors.push(`${ex.id}: question de contrôle insuffisante`);
  if(!b.mistake || b.mistake.length<45) errors.push(`${ex.id}: erreur classique non explicitée`);
  if(!b.examples.length) errors.push(`${ex.id}: aucun cas de validation explicité`);
  if(b.params.some(p=>!p.description || p.description.length<24)) errors.push(`${ex.id}: description de paramètre trop courte`);
  for(const p of b.params){
    if(genericParam.test(p.description) && !new RegExp(`\\b${p.name}\\b`).test(b.task)) {
      errors.push(`${ex.id}: paramètre ${p.name} insuffisamment documenté`);
    }
  }
  for(const marker of ['Ce que tu dois réellement faire','Contrat précis','Données reçues','Valeur ou effet attendu','Avant d’écrire du Python','Erreur classique à éviter','Exemples contrôlés','Critères de réussite']){
    if(!html.includes(marker)) errors.push(`${ex.id}: bloc éditorial manquant — ${marker}`);
  }
  if(/undefined|null/.test(html)) errors.push(`${ex.id}: valeur indéfinie dans le rendu`);
}

if(all.length!==164) errors.push(`Couverture: ${all.length} exercices au lieu de 164`);
const coveredModules=new Set(all.map(({module,ex})=>module?.id||ex.moduleId).filter(Boolean));
if(coveredModules.size!==20) errors.push(`Couverture modules: ${coveredModules.size}/20`);

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Editorial Statement Gate: ${all.length} exercices, ${coveredModules.size} modules — mission reformulée, contrat concret, résultat explicite, paramètres décrits, erreurs classiques, cas frontières et critères de réussite présents.`);
