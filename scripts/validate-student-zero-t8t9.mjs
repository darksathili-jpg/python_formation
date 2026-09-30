import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const t9 = modules.find(m => m.id === 'T9');
const practice = practiceBank.filter(e => e.moduleId === 'T9');
const primm = primmBank.find(p => p.moduleId === 'T9');
const novice = noviceBank.find(n => n.moduleId === 'T9');

function need(condition, message) {
  if (!condition) errors.push(message);
}
function text(value) {
  if (Array.isArray(value)) return value.map(text).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(text).join(' ');
  return String(value ?? '');
}

need(Boolean(t9), 'Module T9 introuvable');
need(practice.length === 5, `T9 doit avoir 5 entraînements, trouvé ${practice.length}`);
need(Boolean(primm), 'PRIMM T9 introuvable');
need(Boolean(novice), 'Passerelle novice T9 introuvable');

if (t9) {
  const lessons = text(t9.lessons);
  const lower = lessons.toLowerCase();
  for (const marker of [
    'Transition T8 → T9',
    'existence ≠ efficacité',
    'taille n',
    'cas de base',
    'Diviser → Résoudre → Combiner',
    'T(n) ≈ 2 × T(n/2)',
    'ne poursuit qu’une moitié',
    'les deux moitiés',
    'n log n',
    'chronomètre'
  ]) need(lessons.includes(marker), `T9 lessons: notion absente — ${marker}`);

  need(lower.includes('calculabilité') && lower.includes('complexité'), 'T9 doit distinguer explicitement calculabilité et complexité');
  need(lower.includes('1024') && lower.includes('10 niveaux'), 'T9 doit matérialiser log₂(n) par des divisions concrètes');
  need(lower.includes('travail total d’un niveau') || lower.includes('travail de fusion sur un niveau complet'), 'T9 doit reconstruire le facteur n par niveau');
  need(!/master theorem|théorème maître|résoudre formellement.*récurrence/i.test(lessons), 'T9 ne doit pas dériver vers une résolution universitaire des récurrences');

  const e1 = t9.exercises.find(e => e.id === 'T9-E1');
  const e2 = t9.exercises.find(e => e.id === 'T9-E2');
  const e3 = t9.exercises.find(e => e.id === 'T9-E3');

  need(/déjà triées/i.test(e1?.prompt || '') && /nouvelle/i.test(e1?.prompt || ''), 'T9-E1 doit expliciter la précondition de tri et la nouvelle liste');
  need(/while i < len\(a\) and j < len\(b\)/.test(e1?.solution || ''), 'T9-E1 doit réaliser une vraie fusion à deux indices');
  need(!/sorted\(|\.sort\(/.test(e1?.solution || ''), 'T9-E1 ne doit pas déléguer la fusion à un tri intégré');

  need(/if len\(tab\) <= 1/.test(e2?.solution || ''), 'T9-E2 doit traiter 0 et 1 comme cas de base');
  need((e2?.solution || '').match(/tri_fusion\(/g)?.length >= 3, 'T9-E2 doit contenir les deux appels récursifs du tri fusion');
  need(/fusion\(gauche, droite\)/.test(e2?.solution || ''), 'T9-E2 doit combiner les deux sous-résultats par fusion');
  need(e2?.tests?.some(t => /entrée intacte/i.test(t.label)), 'T9-E2 doit vérifier que la liste source reste intacte');

  need(e3?.title?.includes('niveaux'), 'T9-E3 doit porter explicitement sur les niveaux de réduction');
  need(e3?.tests?.some(t => t.expr === 'niveaux_moitie(8) == 3'), 'T9-E3 doit compter 3 niveaux pour n=8');
  need(e3?.tests?.some(t => t.expr === 'niveaux_moitie(1024) == 10'), 'T9-E3 doit compter 10 niveaux pour n=1024');
  need(!/math\.log|log2\(/.test(`${e3?.starter || ''}\n${e3?.solution || ''}`), 'T9-E3 doit construire le logarithme par divisions, sans fonction mathématique');
}

const x3 = practice.find(e => e.id === 'T9-X3');
const x4 = practice.find(e => e.id === 'T9-X4');
const x5 = practice.find(e => e.id === 'T9-X5');
need(x3?.tests?.some(t => t.expr === 'tailles_moitie(8) == [8,4,2,1]'), 'T9-X3 doit rendre visibles les tailles 8 → 4 → 2 → 1');
need(/les deux moitiés/i.test(x4?.prompt || '') && /pas automatiquement plus rapide/i.test(x4?.prompt || ''), 'T9-X4 doit déconstruire « diviser = forcément plus rapide »');
need((x4?.solution || '').match(/compte_div\(/g)?.length >= 3, 'T9-X4 doit traiter les deux sous-problèmes');
need(/une seule/i.test(x5?.prompt || '') && /logarithmique/i.test(x5?.prompt || ''), 'T9-X5 doit relier la dichotomie au choix d’une seule moitié');

if (primm) {
  const p = text(primm);
  need(p.includes('somme_div'), 'PRIMM T9 doit proposer un exemple diviser/résoudre/combiner lisible avant le tri fusion');
  need(p.includes('deux problèmes de taille 2') && p.includes('quatre problèmes de taille 1'), 'PRIMM T9 doit faire tracer l’arbre des tailles');
  need(p.includes('les deux') || p.includes('deux moitiés'), 'PRIMM T9 doit faire raisonner sur le nombre de sous-problèmes réellement traités');
  need(p.includes('combinaison'), 'PRIMM T9 doit identifier explicitement l’étape de combinaison');
}

if (novice) {
  const n = text(novice);
  need(n.includes('Aucune spécialité mathématiques requise'), 'Passerelle T9 doit être accessible sans spécialité mathématiques');
  need(n.includes('log₂(n)') && n.includes('divisions par deux'), 'Passerelle T9 doit donner une interprétation concrète du logarithme');
  need((novice.checks || []).length === 3, `Passerelle T9 : 3 micro-questions attendues, trouvé ${(novice.checks || []).length}`);
  need(n.includes('n log n'), 'Passerelle T9 doit reconstruire qualitativement n log n');
}

const learnerCode = [
  ...(t9?.exercises || []),
  ...practice
].map(e => `${e.starter || ''}\n${e.solution || ''}`).join('\n');
need(!/math\.log|math\.log2/.test(learnerCode), 'T9 ne doit pas demander une fonction logarithme pour comprendre le nombre de niveaux');
need(!/Master|master theorem|théorème maître/.test(learnerCode), 'T9 ne doit pas exiger le théorème maître');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Student Zero T8/T9 Gate: taille, cas de base, division, sous-problèmes, combinaison et coût n log n reconstruit qualitativement — OK');
