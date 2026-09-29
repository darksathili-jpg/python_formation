import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const p7 = modules.find(m => m.id === 'P7');
const p8 = modules.find(m => m.id === 'P8');
const get = (list, id) => list.find(x => x.id === id);
const getModule = (list, id) => list.find(x => x.moduleId === id);

if (!p7 || !p8) errors.push('P7 ou P8 introuvable');

if (p7) {
  const lessonText = p7.lessons.map(l => `${l.title} ${l.html} ${(l.points || []).join(' ')}`).join('\n');
  for (const marker of [
    'tuple est immuable',
    'Une clé n’est pas un indice',
    'cle in d',
    'items()',
    'effet de bord',
    'une ligne de données peut être un dictionnaire'
  ]) {
    if (!lessonText.includes(marker)) errors.push(`P7: notion manquante — ${marker}`);
  }
  const e3 = get(p7.exercises, 'P7-E3');
  if (!e3 || !e3.solution.includes('notes.items()') || e3.solution.includes('meilleure_note = None')) {
    errors.push('P7-E3: parcours items() ou initialisation novice non conforme');
  }
  const x3 = get(practiceBank, 'P7-X3');
  if (!x3 || !x3.prompt.includes('modifier le dictionnaire scores reçu') || !x3.tests.some(t => t.label.includes('dictionnaire reçu'))) {
    errors.push('P7-X3: effet de bord du dictionnaire non explicite ou non testé');
  }
  const x4 = get(practiceBank, 'P7-X4');
  if (!x4 || !x4.solution.includes('.items()')) errors.push('P7-X4: items() non mobilisé');
}

if (p8) {
  const lessonText = p8.lessons.map(l => `${l.title} ${l.html} ${(l.points || []).join(' ')} ${l.code || ''}`).join('\n');
  const lessonCode = p8.lessons.map(l => l.code || '').join('\n');
  for (const marker of [
    'Transition P7 → P8',
    'table par une liste de ces dictionnaires',
    'csv.DictReader',
    'chaînes de caractères',
    'sorted',
    'Fusion',
    'doublons'
  ]) {
    if (!lessonText.includes(marker)) errors.push(`P8: notion manquante — ${marker}`);
  }
  if (/\blambda\b/.test(lessonCode)) errors.push('P8: lambda introduit dans les exemples exécutables');
  const e1 = get(p8.exercises, 'P8-E1');
  if (!e1 || !e1.solution.includes("resultat.append(ligne)") || /\[[^\]]+for\s+/.test(e1.solution)) {
    errors.push('P8-E1: filtrage explicite attendu avant compréhension');
  }
  const e3 = get(p8.exercises, 'P8-E3');
  if (!e3 || !e3.solution.includes("n['id'] == g['id']") || !e3.solution.includes('resultat.append')) {
    errors.push('P8-E3: fusion par clé id insuffisamment explicite');
  }
  const x1 = get(practiceBank, 'P8-X1');
  if (!x1 || !x1.starter.includes('csv.DictReader') || !x1.solution.includes('return list(lecteur)')) {
    errors.push('P8-X1: import CSV guidé absent');
  }
  const x3 = get(practiceBank, 'P8-X3');
  if (!x3 || !x3.solution.includes("int(ligne['note'])")) errors.push('P8-X3: conversion numérique après CSV absente');
  const x4 = get(practiceBank, 'P8-X4');
  if (!x4 || !x4.solution.includes('sorted(table, key=cle_age)') || /\blambda\b/.test(x4.solution)) {
    errors.push('P8-X4: tri par colonne doit utiliser une fonction nommée sans lambda');
  }
}

const p7Order = practiceBank.filter(x => x.moduleId === 'P7').map(x => x.id).join(',');
if (p7Order !== 'P7-X1,P7-X3,P7-X4,P7-X2,P7-X5') errors.push(`Ordre P7 inattendu: ${p7Order}`);
const p8Order = practiceBank.filter(x => x.moduleId === 'P8').map(x => x.id).join(',');
if (p8Order !== 'P8-X1,P8-X3,P8-X2,P8-X4,P8-X5') errors.push(`Ordre P8 inattendu: ${p8Order}`);

const noviceP7 = getModule(noviceBank, 'P7');
const noviceP8 = getModule(noviceBank, 'P8');
if (!noviceP7 || !noviceP7.goal.includes('indice, clé, valeur')) errors.push('Passerelle novice P7 non recalibrée');
if (!noviceP8 || !noviceP8.goal.includes('type des valeurs')) errors.push('Passerelle novice P8 non recalibrée');

const primmP7 = getModule(primmBank, 'P7');
const primmP8 = getModule(primmBank, 'P8');
if (!primmP7 || !primmP7.seed.includes("profil['badge']") || !primmP7.make.includes('trois clés')) {
  errors.push('PRIMM P7: clés/valeurs/mise à jour insuffisamment verrouillés');
}
if (!primmP8 || !primmP8.seed.includes("int(ligne['note'])") || !primmP8.make.includes('après conversion')) {
  errors.push('PRIMM P8: conversion post-CSV insuffisamment verrouillée');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Student Zero Gate P7/P8 OK : choix de structure, clés/valeurs/items() et effets de bord explicites en P7 ; modèle ligne/table, import CSV, conversion de types, filtrage, tri et fusion gradués en P8.');
