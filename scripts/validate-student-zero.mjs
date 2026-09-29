import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors=[];
const moduleById=new Map(modules.map(m=>[m.id,m]));
const p1=moduleById.get('P1');
const p2=moduleById.get('P2');
const extras=id=>practiceBank.filter(e=>e.moduleId===id);
const textOf=o=>JSON.stringify(o);

if(!p1||!p2) errors.push('P1/P2 absents');

if(p1){
  if(p1.lessons.length<4) errors.push(`P1: ${p1.lessons.length} leçons, 4 attendues`);
  const p1Lessons=textOf(p1.lessons);
  for(const token of ['affectation','type','//','%','def','return']) if(!p1Lessons.includes(token)) errors.push(`P1: notion explicitée manquante: ${token}`);
  if(!p1.exercises.every(e=>e.kind==='compléter')) errors.push('P1: les exercices cœur doivent rester des complétions guidées');
  if(p1.exercises.some(e=>/Écris une fonction/i.test(e.prompt))) errors.push('P1: ne doit pas demander d’écrire une fonction complète');
  const p1Activities=[...p1.exercises,...extras('P1')];
  if(p1Activities.some(e=>/\bstr\s*\(/.test(`${e.starter||''}\n${e.solution||''}\n${e.prompt||''}`))) errors.push('P1: str() réintroduit avant son enseignement');
  if(p1Activities.some(e=>(e.solution||'').split('\n').some(line=>/^\s*return\s+[^#\n]*,\s*[^#\n]*$/.test(line)))) errors.push('P1: retour tuple implicite réintroduit');
  if(!p1.exercises.find(e=>e.id==='P1-E3')?.prompt.includes('n % 2')) errors.push('P1-E3: modulo non expliqué dans l’énoncé');
}

if(p2){
  if(p2.lessons.length<4) errors.push(`P2: ${p2.lessons.length} leçons, 4 attendues`);
  const p2Lessons=textOf(p2.lessons);
  for(const token of ['and','or','not','if','elif','frontière']) if(!p2Lessons.includes(token)) errors.push(`P2: notion explicitée manquante: ${token}`);
  const leap=p2.exercises.find(e=>e.id==='P2-E3');
  if(!leap?.prompt.includes('divisible par 400')||!leap.prompt.includes('divisible par 100')||!leap.prompt.includes('divisible par 4')) errors.push('P2-E3: règle bissextile insuffisamment décomposée');
  if(!/if annee % 400[\s\S]*if annee % 100[\s\S]*if annee % 4/.test(leap?.solution||'')) errors.push('P2-E3: solution de référence trop condensée pour Student Zero');
  if(!p2.exercises.find(e=>e.id==='P2-E1')?.prompt.includes('bornes incluses')) errors.push('P2-E1: bornes non explicitées en langage courant');
}

const p1Order=extras('P1').map(e=>e.id).join(',');
if(p1Order!=='P1-X1,P1-X3,P1-X5,P1-X2,P1-X4') errors.push(`P1: ordre entraînement inattendu: ${p1Order}`);
const p2Order=extras('P2').map(e=>e.id).join(',');
if(p2Order!=='P2-X3,P2-X2,P2-X1,P2-X4,P2-X5') errors.push(`P2: ordre entraînement inattendu: ${p2Order}`);

const n1=noviceBank.find(n=>n.moduleId==='P1');
const n2=noviceBank.find(n=>n.moduleId==='P2');
if(!n1?.harness.includes('Les fonctions seront apprises en P4')) errors.push('P1: cadre def/return non dédramatisé explicitement');
if(!n2?.harness.includes('Tu n’as pas encore à concevoir seul')) errors.push('P2: architecture de fonction encore implicite');

const r1=primmBank.find(x=>x.moduleId==='P1');
const r2=primmBank.find(x=>x.moduleId==='P2');
if(!r1?.make.includes('5 lignes')) errors.push('P1 PRIMM: tâche Make encore trop ouverte');
if(!r2?.predict.includes('condition complète')) errors.push('P2 PRIMM: prédiction pas assez décomposée');

if(extras('P1').length!==5||extras('P2').length!==5) errors.push('P1/P2: 5 entraînements attendus par module');
if((p1?.exercises.length||0)!==3||(p2?.exercises.length||0)!==3) errors.push('P1/P2: 3 exercices cœur attendus par module');

if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Student Zero Gate P1/P2 OK : prérequis explicites, lecture avant écriture, seuils guidés, entraînements réordonnés et PRIMM borné.');
