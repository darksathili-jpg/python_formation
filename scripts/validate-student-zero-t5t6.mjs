import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const t6 = modules.find(m => m.id === 'T6');
const practice = practiceBank.filter(e => e.moduleId === 'T6');
const primm = primmBank.find(e => e.moduleId === 'T6');
const novice = noviceBank.find(e => e.moduleId === 'T6');
const errors = [];

function need(condition, message) {
  if (!condition) errors.push(message);
}

need(t6, 'T6 introuvable');
need(practice.length === 5, `T6: ${practice.length} entraînements au lieu de 5`);
need(primm, 'PRIMM T6 introuvable');
need(novice, 'Passerelle novice T6 introuvable');

if (t6) {
  const lessons = (t6.lessons || []).map(l => `${l.title || ''} ${l.html || ''} ${(l.points || []).join(' ')} ${l.code || ''}`).join('\n');
  for (const marker of [
    'Transition T5 → T6',
    'Relation ≠ table Python ≠ feuille de calcul',
    'Schéma, attribut, domaine, tuple',
    'Clé primaire',
    'Clé étrangère',
    'SELECT / FROM / WHERE',
    'JOIN ... ON',
    'INSERT, UPDATE et DELETE',
    'Python + SQL'
  ]) need(lessons.includes(marker), `T6: notion absente — ${marker}`);

  need(/tuple relationnel/i.test(lessons) && /type Python/.test(lessons), 'T6: distinction tuple relationnel / tuple Python absente');
  need(/intégrité référentielle/i.test(lessons), 'T6: intégrité référentielle absente');
  need(!/relation est (une |simplement une )?liste de dictionnaires/i.test(lessons), 'T6: confusion relation / liste de dictionnaires');

  const [e1, e2, e3] = ['T6-E1','T6-E2','T6-E3'].map(id => t6.exercises.find(e => e.id === id));
  need(e1?.prompt.includes('eleve(id, nom, note, groupe_id)'), 'T6-E1: schéma relationnel non fourni');
  need(e1?.solution.includes('SELECT nom FROM eleve WHERE note >= 10'), 'T6-E1: SELECT/WHERE attendu absent');
  need(e2?.prompt.includes('clé étrangère') && e2?.prompt.includes('groupe.id'), 'T6-E2: liaison clé étrangère → clé primaire non explicitée');
  need(e2?.solution.includes('JOIN groupe ON eleve.groupe_id = groupe.id'), 'T6-E2: jointure correcte absente');
  need(e3?.solution.includes("WHERE id = ?") && e3?.solution.includes('(identifiant,)'), 'T6-E3: requête paramétrée incorrecte');
  need(!e3?.solution.includes("+ identifiant") && !e3?.solution.includes('f"SELECT'), 'T6-E3: concaténation SQL interdite');
}

const x3 = practice.find(e => e.id === 'T6-X3');
const x4 = practice.find(e => e.id === 'T6-X4');
const x5 = practice.find(e => e.id === 'T6-X5');
need(x3?.solution.includes('WHERE nom = ?') && x3?.solution.includes('(nom,)'), 'T6-X3: débogage de paramétrage SQL absent');
need(x4?.prompt.includes('clé étrangère') && x4?.solution.includes('morceau.artiste_id = artiste.id'), 'T6-X4: jointure sur clés non explicitée');
need(x5?.solution.includes('UPDATE ticket SET statut = ? WHERE id = ?'), 'T6-X5: UPDATE ciblé absent');
need(x5?.prompt.includes('sans elle, plusieurs tickets pourraient être modifiés'), 'T6-X5: risque d’un UPDATE sans WHERE non explicité');

if (primm) {
  need(primm.title.includes('jointure'), 'PRIMM T6: jointure absente du titre');
  need(primm.seed.includes('JOIN groupe ON eleve.groupe_id = groupe.id'), 'PRIMM T6: jointure sur clés absente');
  need(primm.predict.includes('suis la valeur de eleve.groupe_id jusqu’à groupe.id'), 'PRIMM T6: raisonnement clé étrangère → clé primaire absent');
}

if (novice) {
  need(novice.vocabulary?.some(([term]) => term === 'relation'), 'Novice T6: vocabulaire relation absent');
  need(novice.vocabulary?.some(([term]) => term === 'clé primaire'), 'Novice T6: clé primaire absente');
  need(novice.vocabulary?.some(([term]) => term === 'clé étrangère'), 'Novice T6: clé étrangère absente');
  need((novice.checks || []).length === 3, `Novice T6: ${(novice.checks || []).length} micro-questions au lieu de 3`);
  need(novice.harness?.includes('tuple relationnel') && novice.harness?.includes('tuple de Python'), 'Novice T6: distinction modèle / Python insuffisante');
}

const allSolutions = [
  ...(t6?.exercises || []).map(e => e.solution || ''),
  ...practice.map(e => e.solution || '')
].join('\n');
need(!/SELECT \*/i.test(allSolutions), 'T6: SELECT * réintroduit dans les solutions d’apprentissage');
need(!/execute\([^\n]*\+/.test(allSolutions), 'T6: concaténation SQL réintroduite dans les solutions');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Student Zero T5/T6 Gate: modèle relationnel, clés, schémas, jointures, SQL et paramétrage Python — OK');