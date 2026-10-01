import { bacExamStudioPackKeysBySubject, loadSubjectPacks } from '../assets/bac-exam-studio-catalog.js';

const expectedSubjects = [
  '2026-amerique-du-nord-sujet-1','2026-amerique-du-nord-sujet-2',
  '2026-antilles-guyane-sujet-1','2026-antilles-guyane-sujet-2',
  '2026-asie-sujet-1','2026-asie-sujet-2',
  '2026-centres-etrangers-g1-sujet-1','2026-centres-etrangers-g1-sujet-2',
  '2026-metropole-sujet-1','2026-metropole-sujet-2',
  '2026-polynesie-francaise-sujet-1','2026-polynesie-francaise-sujet-2'
];
const errors=[];
const need=(condition,message)=>{ if(!condition) errors.push(message); };
need(JSON.stringify([...bacExamStudioPackKeysBySubject.keys()]) === JSON.stringify(expectedSubjects), 'La liste des 12 sujets Gold 2026 n’est pas celle attendue');
const all=[];
for (const subjectId of expectedSubjects) {
  const packs=await loadSubjectPacks(subjectId);
  all.push(...packs);
  need(packs.length===3, `${subjectId}: trois exercices attendus`);
  need(new Set(packs.map(p=>p.exercise)).size===3, `${subjectId}: numéro d’exercice dupliqué`);
  need(packs.every(p=>[1,2,3].includes(p.exercise)), `${subjectId}: exercice hors 1/2/3`);
  need(packs.every(p=>p.audit?.officialTextChecked && p.audit?.solutionChecked), `${subjectId}: contrôle source/solution incomplet`);
  need(packs.every(p=>p.questions.length>=5), `${subjectId}: chaque pack doit comporter au moins cinq étapes détaillées`);
}
need(all.length===36, `36 packs attendus, trouvé ${all.length}`);
need(new Set(all.map(p=>p.key)).size===36, 'Clés de packs non uniques');
const questions=all.flatMap(p=>p.questions.map(q=>({p,q})));
need(questions.length>=190, `Au moins 190 questions attendues, trouvé ${questions.length}`);
for (const {p,q} of questions) {
  const label=`${p.key}/${q.id}`;
  need(q.sourceQuestion !== undefined && q.sourceQuestion !== null, `${label}: sourceQuestion absent`);
  need(q.hints?.length>=3, `${label}: indices incomplets`);
  need(q.criteria?.length>=3, `${label}: critères incomplets`);
  need(q.correction?.reasoning?.length>=2, `${label}: raisonnement trop court`);
  need(q.correction?.traps?.length>=2, `${label}: pièges insuffisants`);
}
const modes=all.reduce((acc,p)=>{acc[p.audit.correctionMode]=(acc[p.audit.correctionMode]||0)+1;return acc;},{});
if(errors.length){console.error(`Gold 2026 gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);process.exit(1);}
console.log(`Gold 2026 gate — OK | 12 sujets | 36 exercices | ${questions.length} questions | audit: ${Object.entries(modes).map(([k,v])=>`${k}=${v}`).join(', ')}`);
