import { modules, practiceBank, capstones } from '../assets/content.js';
import { buildExerciseBrief, exerciseBriefHTML } from '../assets/exercise-brief.js';

const moduleById = new Map(modules.map(m=>[m.id,m]));
const all = [
  ...modules.flatMap(module=>module.exercises.map(ex=>({ex,module}))),
  ...practiceBank.map(ex=>({ex,module:moduleById.get(ex.moduleId)})),
  ...capstones.map(ex=>({ex,module:moduleById.get(ex.moduleId)}))
];

const errors=[];
for(const {ex,module} of all){
  const b=buildExerciseBrief(ex,module);
  const html=exerciseBriefHTML(ex,module);
  if(!b.task || b.task.length<18) errors.push(`${ex.id}: mission trop courte (${b.task.length})`);
  if(!b.before || b.before.length<70) errors.push(`${ex.id}: guidage avant codage insuffisant`);
  if(!b.check || b.check.length<35) errors.push(`${ex.id}: question de contrôle insuffisante`);
  if(!b.examples.length) errors.push(`${ex.id}: aucun cas de validation explicité`);
  if(!html.includes('Contrat du programme')) errors.push(`${ex.id}: contrat absent du rendu`);
  if(!html.includes('Avant de coder')) errors.push(`${ex.id}: phase de préparation absente`);
  if(!html.includes('Cas que la validation vérifie')) errors.push(`${ex.id}: cas de test non explicités`);
  if(!html.includes('Quand puis-je considérer l’exercice comme réussi ?')) errors.push(`${ex.id}: critères de réussite absents`);
  if(/undefined|null/.test(html)) errors.push(`${ex.id}: valeur indéfinie dans le rendu`);
}

if(all.length!==164) errors.push(`Couverture: ${all.length} exercices au lieu de 164`);
const coveredModules=new Set(all.map(({module,ex})=>module?.id||ex.moduleId).filter(Boolean));
if(coveredModules.size!==20) errors.push(`Couverture modules: ${coveredModules.size}/20`);

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Statement Quality Gate: ${all.length} exercices, ${coveredModules.size} modules — énoncé détaillé, contrat, guidage, cas de test et critères de réussite présents.`);
