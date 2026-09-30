import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const t7 = modules.find(m => m.id === 'T7');
const practice = practiceBank.filter(e => e.moduleId === 'T7');
const primm = primmBank.find(p => p.moduleId === 'T7');
const novice = noviceBank.find(n => n.moduleId === 'T7');

function requireCond(condition, message) {
  if (!condition) errors.push(message);
}
function text(value) {
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(text).join(' ');
  return String(value ?? '');
}

requireCond(Boolean(t7), 'Module T7 introuvable');
requireCond(practice.length === 5, `T7 doit avoir 5 entraînements, trouvé ${practice.length}`);
requireCond(Boolean(primm), 'PRIMM T7 introuvable');
requireCond(Boolean(novice), 'Passerelle novice T7 introuvable');

if (t7) {
  const lessonText = text(t7.lessons).toLowerCase();
  for (const token of ['responsabilit', 'api', 'test de régression', 'reproduire', 'hypothèse', 'instrument']) {
    requireCond(lessonText.includes(token), `T7 lessons: notion manquante — ${token}`);
  }
  requireCond(lessonText.includes('ne prouve pas') || lessonText.includes('ne constitue pas'), 'T7 doit rappeler qu’un test réussi ne prouve pas la correction générale');
  requireCond(!/pytest|unittest\.mock|mock\(/i.test(lessonText), 'T7 ne doit pas dépendre d’un framework de test avancé');

  const e1 = t7.exercises.find(e => e.id === 'T7-E1');
  const e2 = t7.exercises.find(e => e.id === 'T7-E2');
  const e3 = t7.exercises.find(e => e.id === 'T7-E3');
  requireCond(e1?.tests?.some(t => /entrée intacte/i.test(t.label)), 'T7-E1 doit tester explicitement l’absence d’effet de bord');
  requireCond(/list\(tab\)/.test(e1?.solution || ''), 'T7-E1 doit corriger l’alias par une copie indépendante');
  requireCond(e2?.tests?.some(t => /frontière basse/i.test(t.label)) && e2?.tests?.some(t => /frontière haute/i.test(t.label)), 'T7-E2 doit tester les deux frontières');
  requireCond(/0 <= x <= 9/.test(e2?.solution || ''), 'T7-E2 doit corriger les bornes incluses');
  requireCond(e3?.tests?.some(t => /égalité refusée/i.test(t.label)), 'T7-E3 doit contenir un test discriminant sur l’égalité');
  requireCond(/>=/.test(e3?.solution || ''), 'T7-E3 doit refuser égalité et descente');
}

const x3 = practice.find(e => e.id === 'T7-X3');
const x4 = practice.find(e => e.id === 'T7-X4');
requireCond(x3?.tests?.some(t => /régression/i.test(t.label)), 'T7-X3 doit comporter un test de régression explicite');
requireCond((x3?.tests || []).some(t => String(t.expr).includes('[1,1,2,1]')), 'T7-X3 doit préserver une répétition non consécutive');
requireCond(/deux défauts indépendants/i.test(x4?.prompt || ''), 'T7-X4 doit faire isoler deux causes distinctes');

if (primm) {
  const primmText = text(primm).toLowerCase();
  requireCond(primmText.includes('strictement négative'), 'PRIMM T7 doit partir d’un contrat précis');
  requireCond(primmText.includes('plus petit cas'), 'PRIMM T7 doit demander un cas minimal');
  requireCond(primmText.includes('hypothèse'), 'PRIMM T7 doit demander une hypothèse de cause');
  requireCond(primmText.includes('régression'), 'PRIMM T7 doit terminer par un test de régression');
}

if (novice) {
  const vocab = text(novice.vocabulary).toLowerCase();
  requireCond(vocab.includes('api'), 'Passerelle T7 : vocabulaire API manquant');
  requireCond(vocab.includes('régression'), 'Passerelle T7 : test de régression manquant');
  requireCond(vocab.includes('instrumentation'), 'Passerelle T7 : instrumentation manquante');
  requireCond((novice.checks || []).length === 3, `Passerelle T7 : 3 micro-questions attendues, trouvé ${(novice.checks || []).length}`);
  requireCond(/framework de test professionnel/i.test(novice.harness || ''), 'Passerelle T7 doit borner explicitement le niveau de génie logiciel');
}

const displayedCode = [
  ...(t7?.exercises || []),
  ...practice,
].map(e => `${e.starter || ''}\n${e.solution || ''}`).join('\n');
requireCond(!/pytest|unittest\.mock|Mock\(/.test(displayedCode), 'Les codes T7 visibles ne doivent pas imposer pytest/mock');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Student Zero T6/T7 Gate: responsabilités, API, tests discriminants, régression et débogage reproductible — OK');
