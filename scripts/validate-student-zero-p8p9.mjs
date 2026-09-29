import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const p8 = modules.find(m => m.id === 'P8');
const p9 = modules.find(m => m.id === 'P9');
const byId = (list, id) => list.find(x => x.id === id);
const byModule = (list, id) => list.find(x => x.moduleId === id);
const hasSlice = text => /\[[^\]\n]*:[^\]\n]*\]/.test(text || '');

if (!p8 || !p9) errors.push('P8 ou P9 introuvable');

if (p8) {
  const bridge = p8.lessons.find(l => l.title.includes('Transition P8 → P9'));
  if (!bridge) errors.push('P8: transition explicite vers P9 absente');
  else {
    const text = `${bridge.html} ${bridge.code || ''} ${(bridge.points || []).join(' ')}`;
    for (const marker of ['structure des données', 'nombre d’étapes', "notes.append(ligne['note'])"]) {
      if (!text.includes(marker)) errors.push(`P8→P9: notion manquante — ${marker}`);
    }
  }
}

if (p9) {
  const lessonText = p9.lessons.map(l => `${l.title} ${l.html} ${(l.points || []).join(' ')} ${l.code || ''}`).join('\n');
  for (const marker of [
    'Parcours linéaire',
    'meilleur courant',
    'n - 1',
    'précondition',
    'liste triée',
    'g = m + 1',
    'd = m - 1',
    'Tri par sélection',
    'Tri par insertion',
    'quadratiquement'
  ]) {
    if (!lessonText.includes(marker)) errors.push(`P9: notion manquante — ${marker}`);
  }

  const p9Artifacts = [
    ...p9.lessons.map(l => l.code || ''),
    ...p9.exercises.flatMap(e => [e.starter || '', e.solution || '']),
    ...practiceBank.filter(e => e.moduleId === 'P9').flatMap(e => [e.starter || '', e.solution || ''])
  ];
  if (p9Artifacts.some(hasSlice)) errors.push('P9: un slice reste nécessaire dans un code d’apprentissage ou une solution');

  const e1 = byId(p9.exercises, 'P9-E1');
  if (!e1 || !e1.prompt.includes('sans slice') || !e1.solution.includes('range(1, len(tab))') || hasSlice(e1.solution)) {
    errors.push('P9-E1: minimum novice doit parcourir par indices sans slice');
  }

  const e2 = byId(p9.exercises, 'P9-E2');
  if (!e2 || !e2.prompt.includes('triée par ordre croissant') || !e2.solution.includes('g = m + 1') || !e2.solution.includes('d = m - 1') || !e2.tests.some(t => t.label.includes('liste vide'))) {
    errors.push('P9-E2: précondition, réduction stricte ou cas vide insuffisants');
  }

  const e3 = byId(p9.exercises, 'P9-E3');
  if (!e3 || !e3.prompt.includes('tri_selection') || !e3.solution.includes('imin = i') || !e3.solution.includes('for j in range(i + 1, len(t))') || /\bsorted\s*\(|\.sort\s*\(/.test(e3.solution)) {
    errors.push('P9-E3: tri par sélection non explicite ou algorithme masqué');
  }
}

const x1 = byId(practiceBank, 'P9-X1');
if (!x1 || !x1.prompt.includes('peut être non triée') || !x1.tests.some(t => t.label === 'vide')) errors.push('P9-X1: recherche séquentielle ou cas vide insuffisants');

const x4 = byId(practiceBank, 'P9-X4');
if (!x4 || !x4.prompt.includes('croissante au sens large')) errors.push('P9-X4: vérification de précondition de tri insuffisante');

const x2 = byId(practiceBank, 'P9-X2');
if (!x2 || !x2.prompt.includes('triée par ordre croissant') || !x2.solution.includes('g = m + 1') || !x2.solution.includes('d = m - 1')) errors.push('P9-X2: débogage dichotomique insuffisant');

const x3 = byId(practiceBank, 'P9-X3');
if (!x3 || !x3.prompt.includes('tri par insertion') || /\bsorted\s*\(|\.sort\s*\(/.test(x3.solution || '') || hasSlice(x3.solution)) errors.push('P9-X3: tri par insertion doit rester explicite');

const p9Order = practiceBank.filter(x => x.moduleId === 'P9').map(x => x.id).join(',');
if (p9Order !== 'P9-X1,P9-X4,P9-X2,P9-X3,P9-X5') errors.push(`Ordre P9 inattendu: ${p9Order}`);

const noviceP9 = byModule(noviceBank, 'P9');
if (!noviceP9 || !noviceP9.goal.includes('précondition de tri') || !noviceP9.vocabulary.some(([term]) => term === 'invariant') || !noviceP9.harness.includes('slices')) {
  errors.push('Passerelle novice P9 non recalibrée');
}

const primmP9 = byModule(primmBank, 'P9');
if (!primmP9 || !primmP9.seed.includes('while g <= d') || !primmP9.predict.includes('précondition') || !primmP9.make.includes('triée par ordre croissant')) {
  errors.push('PRIMM P9: trace, précondition ou production finale insuffisantes');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Student Zero Gate P8/P9 OK : transition données→algorithmes explicite, parcours/extremum sans slice, coût compté, dichotomie sous précondition triée, réduction stricte des bornes et tris sélection/insertion expliqués par invariants.');
