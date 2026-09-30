import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const t10 = modules.find(m => m.id === 'T10');
const practice = practiceBank.filter(e => e.moduleId === 'T10');
const primm = primmBank.find(p => p.moduleId === 'T10');
const novice = noviceBank.find(n => n.moduleId === 'T10');

function need(condition, message) {
  if (!condition) errors.push(message);
}
function text(value) {
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(text).join(' ');
  return String(value ?? '');
}

need(Boolean(t10), 'Module T10 introuvable');
need(practice.length === 5, `T10 doit avoir 5 entraînements, trouvé ${practice.length}`);
need(Boolean(primm), 'PRIMM T10 introuvable');
need(Boolean(novice), 'Passerelle novice T10 introuvable');

if (t10) {
  const lessons = text(t10.lessons);
  const lower = lessons.toLowerCase();
  for (const marker of [
    'Transition T9 → T10',
    'sous-problèmes qui se chevauchent',
    'L’état',
    'Quatre décisions avant de coder',
    'Relation de dépendance',
    'Top-down',
    'Bottom-up',
    'Mémoïsation ≠',
    'Rendu de monnaie',
    'Temps gagné, mémoire utilisée'
  ]) need(lessons.includes(marker), `T10 lessons: notion absente — ${marker}`);

  need(lower.includes('tri fusion') && lower.includes('programmation dynamique'), 'T10 doit relier explicitement T9 et T10');
  need(lower.includes('état') && lower.includes('cas initiaux') && lower.includes('dépendances') && lower.includes('ordre de calcul'), 'T10 doit installer état, bases, dépendances et ordre avant le code');
  need(lower.includes('même cache') || lower.includes('cache partagé'), 'T10 doit expliquer que le même cache est transmis dans la mémoïsation');
  need(lower.includes('dictionnaire n’est qu’une représentation') || lower.includes('dictionnaire n’est qu’une représentation possible'), 'T10 doit refuser l’équation programmation dynamique = dictionnaire');
  need(lower.includes('deux valeurs peuvent parfois remplacer une table complète'), 'T10 doit discuter l’optimisation mémoire lorsque seules deux dépendances restent utiles');
  need(!/lru_cache|functools\.cache|décorateur/i.test(lessons), 'T10 ne doit pas imposer de décorateur de cache avancé');

  const e1 = t10.exercises.find(e => e.id === 'T10-E1');
  const e2 = t10.exercises.find(e => e.id === 'T10-E2');
  const e3 = t10.exercises.find(e => e.id === 'T10-E3');

  need(/dp\[i\]/.test(e1?.prompt || '') && /dp\[i-1\].*dp\[i-2\]/.test(e1?.prompt || ''), 'T10-E1 doit définir l’état et sa dépendance');
  need(/for i in range\(2, n \+ 1\)/.test(e1?.solution || ''), 'T10-E1 doit construire bottom-up dans l’ordre croissant');
  need(e1?.tests?.some(t => t.expr === 'facons(4) == 5'), 'T10-E1 doit tester la progression sur n=4');

  need(/même dictionnaire memo/i.test(e2?.prompt || ''), 'T10-E2 doit expliciter le partage du cache');
  need(/if n in memo/.test(e2?.solution || ''), 'T10-E2 doit réutiliser les états mémorisés');
  need(/facons_memo\(n - 1, memo\)/.test(e2?.solution || '') && /facons_memo\(n - 2, memo\)/.test(e2?.solution || ''), 'T10-E2 doit transmettre le même cache aux deux appels');
  need(e2?.tests?.some(t => /cache/i.test(t.label)), 'T10-E2 doit vérifier le remplissage du cache');

  need(/dp\[s\]/.test(e3?.prompt || '') && /nombre minimal de pièces/i.test(e3?.prompt || ''), 'T10-E3 doit définir clairement l’état du rendu de monnaie');
  need(/for s in range\(1, montant \+ 1\)/.test(e3?.solution || ''), 'T10-E3 doit construire les sommes dans l’ordre croissant');
  need(/for p in pieces/.test(e3?.solution || ''), 'T10-E3 doit examiner les choix de pièce pour chaque état');
  need(e3?.tests?.some(t => /glouton non optimal/i.test(t.label)), 'T10-E3 doit contenir un cas où le choix glouton échoue');
  need(e3?.tests?.some(t => /impossible/i.test(t.label)), 'T10-E3 doit tester un état impossible');
}

const x1 = practice.find(e => e.id === 'T10-X1');
const x2 = practice.find(e => e.id === 'T10-X2');
const x3 = practice.find(e => e.id === 'T10-X3');
const x4 = practice.find(e => e.id === 'T10-X4');
const x5 = practice.find(e => e.id === 'T10-X5');

need(x1?.tests?.some(t => t.expr === 'etats_escalier(4) == [1,1,2,3,5]'), 'T10-X1 doit rendre les états intermédiaires visibles');
need(/constructions\(n - 1, memo\)/.test(x2?.solution || '') && /constructions\(n - 2, memo\)/.test(x2?.solution || ''), 'T10-X2 doit corriger le cache non partagé');
need(/dp\[i\]\[j\]/.test(x3?.prompt || '') && /dp\[i - 1\]\[j\] \+ dp\[i\]\[j - 1\]/.test(x3?.solution || ''), 'T10-X3 doit installer un état à deux indices et ses dépendances');
need(/dp\[i\].*meilleur score/i.test(x4?.prompt || '') && /max\(sans_prendre, en_prenant\)/.test(x4?.solution || ''), 'T10-X4 doit formaliser un choix optimal par état');
need(/n’utilise pas une liste <code>dp<\/code> complète/i.test(x5?.prompt || ''), 'T10-X5 doit demander explicitement une mémoire réduite');
need(!/dp\s*=\s*\[/.test(x5?.solution || ''), 'T10-X5 ne doit pas utiliser une table dp complète');

if (primm) {
  const p = text(primm);
  need(p.includes('appels.append(n)'), 'PRIMM T10 doit rendre visibles les appels répétés');
  need(p.includes('Quelles valeurs de n apparaissent plusieurs fois'), 'PRIMM T10 doit faire identifier les états répétés avant la mémoïsation');
  need(p.includes('tri fusion de T9'), 'PRIMM T10 doit comparer explicitement T9 et T10');
  need(p.includes('version mémoïsée') && p.includes('version bottom-up'), 'PRIMM T10 doit faire transformer le même problème dans les deux formulations');
}

if (novice) {
  const n = text(novice);
  need(n.includes('Aucune spécialité mathématiques requise'), 'Passerelle T10 doit être accessible sans spécialité mathématiques');
  for (const marker of ['état', 'sous-problèmes qui se chevauchent', 'mémoïsation', 'bottom-up', 'relation de dépendance']) {
    need(n.toLowerCase().includes(marker.toLowerCase()), `Passerelle T10 : notion manquante — ${marker}`);
  }
  need((novice.checks || []).length === 3, `Passerelle T10 : 3 micro-questions attendues, trouvé ${(novice.checks || []).length}`);
  need(/ne commence pas par écrire memo = \{\} ou dp = \[\.\.\.\]/.test(novice.harness || ''), 'Passerelle T10 doit imposer le raisonnement avant la structure de données');
}

const learnerCode = [
  ...(t10?.exercises || []),
  ...practice
].map(e => `${e.starter || ''}\n${e.solution || ''}`).join('\n');
need(!/lru_cache|functools\.cache|@cache/.test(learnerCode), 'T10 ne doit pas exiger de mécanisme de cache avancé hors du cœur visé');
need(!/numpy|pandas/.test(learnerCode), 'T10 doit rester en Python standard sans bibliothèque de calcul externe');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Student Zero T9/T10 Gate: chevauchement, état, dépendances, mémoïsation, bottom-up et coût mémoire — OK');
