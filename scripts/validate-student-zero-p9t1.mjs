import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const fail = message => { throw new Error(message); };
const t1 = modules.find(m => m.id === 'T1');
const p9 = modules.find(m => m.id === 'P9');
if (!p9 || !t1) fail('P9/T1 introuvables');

const t1Practice = practiceBank.filter(ex => ex.moduleId === 'T1');
const primm = primmBank.find(x => x.moduleId === 'T1');
const novice = noviceBank.find(x => x.moduleId === 'T1');
if (t1.exercises.length !== 3) fail(`T1: ${t1.exercises.length} exercices cœur au lieu de 3`);
if (t1Practice.length !== 5) fail(`T1: ${t1Practice.length} entraînements au lieu de 5`);
if (!primm) fail('T1: PRIMM absent');
if (!novice) fail('T1: passerelle novice absente');
if (novice.checks.length !== 3) fail(`T1: exactement 3 micro-questions attendues, reçu ${novice.checks.length}`);

const titles = t1.lessons.map(l => l.title).join('\n');
for (const marker of [
  'Récursion : même problème, instance plus petite',
  'Itération et récursion',
  'base, progrès, combinaison',
  'Descente',
  'Remontée',
  'sans slice',
  'Tracer avant d’écrire',
  'Quand choisir la récursion'
]) {
  if (!titles.includes(marker)) fail(`T1: leçon manquante — ${marker}`);
}
if (!p9.lessons.some(l => l.title.includes('Transition P9 → T1'))) fail('P9: transition explicite vers T1 absente');

const allLearningCode = [
  ...t1.lessons.map(l => l.code || ''),
  ...t1.exercises.flatMap(e => [e.starter || '', e.solution || '']),
  ...t1Practice.flatMap(e => [e.starter || '', e.solution || '']),
  primm.seed || '',
  novice.worked?.code || ''
].join('\n');
const slicePattern = /\[[^\]\n]*:[^\]\n]*\]/;
if (slicePattern.test(allLearningCode)) fail('T1: un slice Python apparaît dans un code d’apprentissage');

const [e1,e2,e3] = ['T1-E1','T1-E2','T1-E3'].map(id => t1.exercises.find(e => e.id === id));
if (!e1 || !e2 || !e3) fail('T1: exercices cœur incomplets');
if (!e1.solution.includes('if n == 0') || !e1.solution.includes('somme_n(n - 1)')) fail('T1-E1: cas de base/progression non verrouillés');
if (!e2.solution.includes('if i == len(tab)') || !e2.solution.includes('i + 1')) fail('T1-E2: progression par indice non verrouillée');
if (!e3.solution.includes('if g >= d') || !e3.solution.includes('g + 1') || !e3.solution.includes('d - 1')) fail('T1-E3: rapprochement des bornes non verrouillé');
if (/=\s*0\)/.test(e2.starter.split('\n')[0])) fail('T1-E2: paramètre par défaut caché encore présent');
if (/=\s*None/.test(e3.starter.split('\n')[0])) fail('T1-E3: paramètre sentinelle caché encore présent');

for (const ex of [...t1.exercises, ...t1Practice]) {
  if (/\b(sorted|min|max)\s*\(/.test(ex.solution || '') || /\.sort\s*\(/.test(ex.solution || '')) {
    fail(`${ex.id}: fonction qui masque l’algorithme dans une solution récursive`);
  }
}

const debug = t1Practice.find(e => e.id === 'T1-X3');
if (!debug?.starter.includes('somme_n(n + 1)')) fail('T1-X3: bug de progression attendu absent du starter');
if (!debug?.solution.includes('somme_n(n - 1)')) fail('T1-X3: correction de progression absente');
const fast = t1Practice.find(e => e.id === 'T1-X4');
if (!fast?.prompt.includes('Aucune formule n’est à retrouver')) fail('T1-X4: garde-fou sans prérequis mathématique absent');
if ((fast?.solution.match(/puissance_rapide\(a, n \/\/ 2\)/g) || []).length !== 1) fail('T1-X4: sous-problème pair doit être calculé une seule fois');

const lessonText = t1.lessons.map(l => `${l.title} ${l.html || ''} ${(l.points || []).join(' ')}`).join(' ');
for (const marker of ['pile d’appels','RecursionError','cas de base','mesure de progression','itératif','remontée']) {
  if (!lessonText.toLowerCase().includes(marker.toLowerCase())) fail(`T1: modèle mental incomplet — ${marker}`);
}
if (!primm.seed.includes("print('descente'" ) || !primm.seed.includes("print('remontee'")) fail('T1 PRIMM: descente/remontée non observables');
if (!primm.seed.includes('explorer(n - 1)')) fail('T1 PRIMM: progression récursive absente');
if (!novice.harness.includes('variant') || !novice.harness.includes('remontée')) fail('T1 novice: lien itération/récursion insuffisant');

console.log('Student Zero P9/T1 Gate: transition itération→récursion, cas de base, mesure de progression, pile d’appels, descente/remontée, analyse sans slice et choix récursif/itératif — OK');
