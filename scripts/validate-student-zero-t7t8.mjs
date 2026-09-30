import { modules, practiceBank, primmBank, noviceBank, SITE_VERSION } from '../assets/content.js';

const errors = [];
const t8 = modules.find(m => m.id === 'T8');
const practice = practiceBank.filter(e => e.moduleId === 'T8');
const primm = primmBank.find(p => p.moduleId === 'T8');
const novice = noviceBank.find(n => n.moduleId === 'T8');

function requireCond(condition, message) {
  if (!condition) errors.push(message);
}
function text(value) {
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(text).join(' ');
  return String(value ?? '');
}

requireCond(SITE_VERSION === '1.20.0', `SITE_VERSION=${SITE_VERSION} au lieu de 1.20.0`);
requireCond(Boolean(t8), 'Module T8 introuvable');
requireCond(practice.length === 5, `T8 doit avoir 5 entraînements, trouvé ${practice.length}`);
requireCond(Boolean(primm), 'PRIMM T8 introuvable');
requireCond(Boolean(novice), 'Passerelle novice T8 introuvable');

if (t8) {
  const lessonText = text(t8.lessons).toLowerCase();
  for (const token of ['impératif', 'fonctionnel', 'objet', 'programme', 'donnée', 'calculabil', 'décidab', 'arrêt', 'timeout']) {
    requireCond(lessonText.includes(token), `T8 lessons: notion manquante — ${token}`);
  }
  requireCond(lessonText.includes('f n’est pas f(x)') || lessonText.includes('f n\'est pas f(x)'), 'T8 doit distinguer explicitement f de f(x)');
  requireCond(lessonText.includes('même langage') && lessonText.includes('plusieurs paradigmes'), 'T8 doit rappeler qu’un langage peut utiliser plusieurs paradigmes');
  requireCond(lessonText.includes('ne dépend pas') && lessonText.includes('langage'), 'T8 doit expliciter l’indépendance de la calculabilité vis-à-vis du langage usuel');
  requireCond(lessonText.includes('problème de décision'), 'T8 doit définir un problème de décision avant décidabilité');
  requireCond(lessonText.includes('aucun algorithme universel') || lessonText.includes('décideur universel'), 'T8 doit présenter la portée universelle de l’indécidabilité de l’arrêt');
  requireCond(lessonText.includes('contradiction') && lessonText.includes('contradicteur'), 'T8 doit fournir une explication intuitive de la contradiction du problème de l’arrêt');

  const e1 = t8.exercises.find(e => e.id === 'T8-E1');
  const e2 = t8.exercises.find(e => e.id === 'T8-E2');
  const e3 = t8.exercises.find(e => e.id === 'T8-E3');
  requireCond(/applique\(double, 7\)/.test(e1?.prompt || ''), 'T8-E1 doit montrer le passage d’une fonction nommée sans parenthèses');
  requireCond(/return f\(x\)/.test(e1?.solution || ''), 'T8-E1 doit appeler la fonction reçue avec f(x)');
  requireCond(/prédicat/i.test(e2?.prompt || '') && /est_pair/.test(e2?.starter || ''), 'T8-E2 doit introduire un prédicat via une fonction nommée');
  requireCond(!/\blambda\b/.test(`${e1?.starter || ''}\n${e1?.solution || ''}\n${e2?.starter || ''}\n${e2?.solution || ''}`), 'T8-E1/E2 ne doivent pas imposer lambda dans le code élève');
  requireCond(/programme.*donnée/i.test(e3?.prompt || ''), 'T8-E3 doit expliciter le programme comme donnée');
  requireCond(/commande == 'AJOUTE'/.test(e3?.solution || '') && /commande == 'MULTIPLIE'/.test(e3?.solution || ''), 'T8-E3 doit interpréter explicitement le mini-langage');
  requireCond(!/\beval\s*\(|\bexec\s*\(/.test(e3?.solution || ''), 'T8-E3 ne doit pas utiliser eval/exec');
}

const allVisibleCode = [
  ...(t8?.exercises || []),
  ...practice
].map(e => `${e.starter || ''}\n${e.solution || ''}`).join('\n');
requireCond(!/\blambda\b/.test(allVisibleCode), 'Les codes T8 visibles ne doivent pas exiger lambda');
requireCond(!/\beval\s*\(|\bexec\s*\(/.test(allVisibleCode), 'Les codes T8 visibles ne doivent pas utiliser eval/exec');

const x1 = practice.find(e => e.id === 'T8-X1');
const x3 = practice.find(e => e.id === 'T8-X3');
const x5 = practice.find(e => e.id === 'T8-X5');
requireCond(/carre/.test(x1?.starter || '') && /f\(x\)/.test(x1?.solution || ''), 'T8-X1 doit consolider fonction nommée puis f(x)');
requireCond(/return f\b/.test(x3?.starter || '') && /return f\(x\)/.test(x3?.solution || ''), 'T8-X3 doit déboguer la confusion fonction / résultat d’appel');
requireCond(/programme.*donnée/i.test(x5?.prompt || ''), 'T8-X5 doit réactiver le programme comme donnée');

if (primm) {
  const primmText = text(primm).toLowerCase();
  requireCond(primmText.includes('operation = double'), 'PRIMM T8 doit montrer une fonction stockée sans appel');
  requireCond(primmText.includes('double(5)'), 'PRIMM T8 doit comparer fonction et appel');
  requireCond(primmText.includes('n’utilise pas lambda') || primmText.includes("n'utilise pas lambda"), 'PRIMM T8 doit neutraliser lambda comme prérequis');
}

if (novice) {
  const noviceText = text(novice).toLowerCase();
  for (const token of ['paradigme', 'fonction comme valeur', 'programme comme donnée', 'décidable', 'indécidable']) {
    requireCond(noviceText.includes(token), `Passerelle T8 : notion manquante — ${token}`);
  }
  requireCond((novice.checks || []).length === 3, `Passerelle T8 : 3 micro-questions attendues, trouvé ${(novice.checks || []).length}`);
  requireCond(/oracle impossible/i.test(novice.harness || ''), 'Passerelle T8 doit dire qu’on ne programme pas un oracle d’arrêt');
  requireCond(/lambda/i.test(novice.harness || '') && /ne sont pas nécessaires/i.test(novice.harness || ''), 'Passerelle T8 doit borner lambda/fonctions internes');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Student Zero T7/T8 Gate: paradigmes, fonction comme donnée, programme-donnée, calculabilité et décidabilité — OK');
