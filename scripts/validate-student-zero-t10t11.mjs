import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const t11 = modules.find(m => m.id === 'T11');
const practice = practiceBank.filter(e => e.moduleId === 'T11');
const primm = primmBank.find(p => p.moduleId === 'T11');
const novice = noviceBank.find(n => n.moduleId === 'T11');

function need(condition, message) {
  if (!condition) errors.push(message);
}
function text(value) {
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(text).join(' ');
  return String(value ?? '');
}

need(Boolean(t11), 'Module T11 introuvable');
need(practice.length === 5, `T11 doit avoir 5 entraînements, trouvé ${practice.length}`);
need(Boolean(primm), 'PRIMM T11 introuvable');
need(Boolean(novice), 'Passerelle novice T11 introuvable');

if (t11) {
  const lessons = text(t11.lessons);
  const lower = lessons.toLowerCase();
  for (const marker of [
    'Transition T10 → T11',
    'texte',
    'motif',
    'alignement',
    'Recherche naïve',
    'droite vers la gauche',
    'Prétraiter le motif',
    'aDroite',
    'max(1, j-k)',
    'Boyer-Moore complet',
    'mauvais caractère',
    'bon suffixe',
    'ne peut pas être exigée'
  ]) need(lessons.includes(marker), `T11 lessons: notion absente — ${marker}`);

  need(lower.includes('réutilisant la réponse d’un sous-problème') && lower.includes('échec de comparaison'), 'T11 doit distinguer explicitement le mécanisme de T10 de celui de T11');
  need(lower.includes('prétraitement') && lower.includes('calculé une seule fois'), 'T11 doit expliquer que le prétraitement dépend du motif et peut être calculé une seule fois');
  need(lower.includes('saut doit être justifié') && lower.includes('manquer une occurrence'), 'T11 doit relier correction et sûreté du décalage');
  need(!/théorème|master theorem/i.test(lessons), 'T11 ne doit pas dériver vers un formalisme de complexité hors programme');

  const e1 = t11.exercises.find(e => e.id === 'T11-E1');
  const e2 = t11.exercises.find(e => e.id === 'T11-E2');
  const e3 = t11.exercises.find(e => e.id === 'T11-E3');

  need(/texte\[i\+j\]/.test((e1?.prompt || '').replace(/\s/g,'')), 'T11-E1 doit matérialiser texte[i+j] face à motif[j]');
  need(!/\.find\(|\.index\(|\[i:i\+/.test(e1?.solution || ''), 'T11-E1 doit rester une vraie recherche naïve caractère par caractère');
  need(/for j in range\(p\)/.test(e1?.solution || ''), 'T11-E1 doit parcourir explicitement les caractères du motif');

  need(/a_droite\[motif\[j\]\] = j/.test(e2?.solution || ''), 'T11-E2 doit mémoriser la dernière occurrence de chaque caractère');
  need(e2?.tests?.some(t => /répétitions/i.test(t.label) && /'A':4/.test(t.expr)), 'T11-E2 doit vérifier qu’une occurrence plus à droite remplace l’ancienne');

  need(/j = p - 1/.test(e3?.solution || ''), 'T11-E3 doit commencer les comparaisons à droite du motif');
  need(/while j >= 0 and texte\[i \+ j\] == motif\[j\]/.test(e3?.solution || ''), 'T11-E3 doit comparer explicitement de droite vers la gauche');
  need(/a_droite\.get\(x, -1\)/.test(e3?.solution || ''), 'T11-E3 doit utiliser la dernière occurrence ou -1 si le caractère est absent');
  need(/max\(1, j - a_droite\.get\(x, -1\)\)/.test(e3?.solution || ''), 'T11-E3 doit imposer un saut strictement positif');
  need(e3?.tests?.some(t => /saut utile/i.test(t.label) && /XYZABCD/.test(t.expr)), 'T11-E3 doit contenir un cas où des alignements sont réellement sautés');
}

const x2 = practice.find(e => e.id === 'T11-X2');
const x3 = practice.find(e => e.id === 'T11-X3');
const x4 = practice.find(e => e.id === 'T11-X4');
const x5 = practice.find(e => e.id === 'T11-X5');

need(/max\(1, j - k\)/.test(x2?.solution || ''), 'T11-X2 doit corriger le saut nul ou négatif');
need(x2?.tests?.some(t => /occurrence à droite/i.test(t.label)), 'T11-X2 doit tester le cas où la dernière occurrence est à droite de j');
need(/j = len\(motif\) - 1/.test(x3?.solution || ''), 'T11-X3 doit partir du dernier indice du motif');
need(/return False, j, texte\[i \+ j\]/.test(x3?.solution || ''), 'T11-X3 doit rendre observable le mauvais caractère et son indice');
need(x4?.tests?.some(t => t.expr === "alignements_bm('XYZABCD', 'ABCD') == [0,3]"), 'T11-X4 doit rendre visibles les alignements 1 et 2 sautés');
need(/visites\.append\(i\)/.test(x4?.solution || ''), 'T11-X4 doit instrumenter les alignements réellement visités');
need(/cherche_preparee\(texte, motif, a_droite\)/.test(x5?.starter || ''), 'T11-X5 doit recevoir le prétraitement comme paramètre');
need(!/a_droite\s*=\s*\{\}/.test(x5?.solution || ''), 'T11-X5 ne doit pas reconstruire le prétraitement');

if (primm) {
  const p = text(primm);
  need(p.includes("texte = 'XYZABCD'") && p.includes("motif = 'ABCD'"), 'PRIMM T11 doit partir d’un exemple où un saut est visible à la main');
  need(p.includes('décalage :') && p.includes('i = 0 à i = 3'), 'PRIMM T11 doit faire prédire et justifier le saut 0 → 3');
  need(p.includes('droite du motif') || p.includes('droite vers la gauche'), 'PRIMM T11 doit faire travailler le sens de comparaison');
  need(p.includes('sans chercher à démontrer une complexité générale'), 'PRIMM T11 doit empêcher la dérive vers une analyse de coût exigible');
}

if (novice) {
  const n = text(novice);
  need(n.includes('Aucune formule de complexité avancée n’est requise'), 'Passerelle T11 doit expliciter l’absence de prérequis de complexité avancée');
  need(n.includes('texte[i+j]') && n.includes('motif[j]'), 'Passerelle T11 doit ancrer la relation entre i et j');
  need(n.includes('Pourquoi peut-on sauter de 0 à 3 ?'), 'Passerelle T11 doit résoudre un saut concret avant l’algorithme général');
  need((novice.checks || []).length === 3, `Passerelle T11 : 3 micro-questions attendues, trouvé ${(novice.checks || []).length}`);
}

const learnerCode = [
  ...(t11?.exercises || []),
  ...practice
].map(e => `${e.starter || ''}\n${e.solution || ''}`).join('\n');
need(!/str\.find|\.find\(/.test(learnerCode), 'T11 ne doit pas déléguer la recherche à find');
need(!/functools|lru_cache|numpy|pandas/i.test(learnerCode), 'T11 doit rester dans les outils du programme et ne pas masquer le mécanisme étudié');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Student Zero T10/T11 Gate: texte, motif, alignement, naïf, droite→gauche, prétraitement, mauvais caractère et saut sûr — OK');
