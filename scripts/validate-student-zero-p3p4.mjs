import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors=[];
const moduleById=new Map(modules.map(m=>[m.id,m]));
const p3=moduleById.get('P3');
const p4=moduleById.get('P4');
const extras=id=>practiceBank.filter(e=>e.moduleId===id);
const textOf=o=>JSON.stringify(o);

if(!p3||!p4) errors.push('P3/P4 absents');

if(p3){
  if(p3.lessons.length<5) errors.push(`P3: ${p3.lessons.length} leçons, 5 attendues`);
  const lessons=textOf(p3.lessons);
  for(const token of ['for','while','compteur','accumulateur','range(len(tab))','variant','def / return']) if(!lessons.includes(token)) errors.push(`P3: notion explicitée manquante: ${token}`);
  if(!p3.exercises.every(e=>e.kind==='compléter')) errors.push('P3: les 3 exercices cœur doivent rester des complétions guidées');
  if(p3.exercises.some(e=>/Écris (?:entièrement )?(?:la )?fonction/i.test(e.prompt))) errors.push('P3: ne doit pas demander de construire une fonction complète');
  const x3=extras('P3').find(e=>e.id==='P3-X3');
  if(!x3 || /append\(|resultat\s*=\s*\[/.test(`${x3.starter} ${x3.solution}`)) errors.push('P3-X3: manipulation avancée de liste encore cachée dans le débogage while');
  if(!p3.exercises.find(e=>e.id==='P3-E3')?.prompt.includes('n // 2')) errors.push('P3-E3: évolution du variant insuffisamment explicite');
}

if(p4){
  if(p4.lessons.length<6) errors.push(`P4: ${p4.lessons.length} leçons, 6 attendues`);
  const lessons=textOf(p4.lessons);
  for(const token of ['paramètre','argument','return','print','précondition','assert','cas frontière','signature']) if(!lessons.includes(token)) errors.push(`P4: notion explicitée manquante: ${token}`);
  const e1=p4.exercises.find(e=>e.id==='P4-E1');
  if(!e1?.prompt.includes('Écris entièrement')) errors.push('P4-E1: transfert de responsabilité vers une fonction complète non explicite');
  if(/^\s*def\s+maximum/.test(e1?.starter||'')) errors.push('P4-E1: la signature ne doit plus être préremplie');
  if(!p4.exercises.every(e=>e.kind==='écrire')) errors.push('P4: les exercices cœur doivent demander une fonction complète');
  const all=textOf([...p4.exercises,...extras('P4')]);
  if(/isalpha\(|isalnum\(/.test(all)) errors.push('P4: méthodes de chaînes introduites avant P5');
  const x4=extras('P4').find(e=>e.id==='P4-X4');
  if(!x4?.prompt.includes('mini <= maxi') || !x4?.solution.includes('assert mini <= maxi')) errors.push('P4-X4: transfert contrat/précondition insuffisant');
}

const p3Order=extras('P3').map(e=>e.id).join(',');
if(p3Order!=='P3-X1,P3-X2,P3-X3,P3-X5,P3-X4') errors.push(`P3: ordre entraînement inattendu: ${p3Order}`);
const p4Order=extras('P4').map(e=>e.id).join(',');
if(p4Order!=='P4-X1,P4-X2,P4-X3,P4-X5,P4-X4') errors.push(`P4: ordre entraînement inattendu: ${p4Order}`);

const n3=noviceBank.find(n=>n.moduleId==='P3');
const n4=noviceBank.find(n=>n.moduleId==='P4');
if(!n3?.harness.includes('fonction complète commence en P4')) errors.push('P3: maintien du cadre fourni insuffisamment explicite');
if(!n4?.harness.includes('contrat → signature → corps → tests')) errors.push('P4: méthode de retrait du cadre non explicite');

const r3=primmBank.find(x=>x.moduleId==='P3');
const r4=primmBank.find(x=>x.moduleId==='P4');
if(!r3?.make.includes('Ne crée pas encore de fonction')) errors.push('P3 PRIMM: Make demande encore trop tôt une fonction');
if(!r4?.make.includes('page vide')) errors.push('P4 PRIMM: Make ne matérialise pas le passage à la production autonome');

if(extras('P3').length!==5||extras('P4').length!==5) errors.push('P3/P4: 5 entraînements attendus par module');
if((p3?.exercises.length||0)!==3||(p4?.exercises.length||0)!==3) errors.push('P3/P4: 3 exercices cœur attendus par module');

if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Student Zero Gate P3/P4 OK : boucle isolée de la conception de fonction, indices explicités, while traçable, puis retrait progressif du cadre en P4 avec contrats et tests.');
