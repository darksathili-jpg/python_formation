import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

function fail(message) {
  console.error(`Student Zero T1/T2: ${message}`);
  process.exitCode = 1;
}

function require(condition, message) {
  if (!condition) fail(message);
}

const t2 = modules.find(module => module.id === 'T2');
require(t2, 'module T2 introuvable');
if (!t2) process.exit(1);

require(t2.lessons.length >= 9, `T2 doit comporter au moins 9 blocs de construction du modèle mental, reçu ${t2.lessons.length}`);
const lessonText = t2.lessons.map(l => `${l.title}\n${l.html || ''}\n${l.code || ''}`).join('\n');
for (const marker of [
  'Transition T1 → T2',
  'Classe ≠ objet',
  '__init__ initialise',
  'self désigne l’objet courant',
  'Variable locale ≠ attribut',
  'Deux instances',
  'Périmètre NSI'
]) require(lessonText.includes(marker), `bloc manquant : ${marker}`);

require(/héritage/i.test(lessonText) && /polymorphisme/i.test(lessonText), 'le hors-programme héritage/polymorphisme doit être explicitement borné');
require(/append/.test(lessonText) && /list/.test(lessonText), 'la transition doit repartir d’un usage objet déjà connu en Première (list/append)');
require(/self\.valeur/.test(lessonText), 'self doit être matérialisé sur un attribut concret');
require(/variable locale/i.test(lessonText), 'la distinction variable locale / attribut doit être enseignée');

const core = Object.fromEntries(t2.exercises.map(ex => [ex.id, ex]));
for (const id of ['T2-E1','T2-E2','T2-E3']) require(core[id], `${id} introuvable`);
require(core['T2-E1'].starter.includes('self.x = ____________'), 'T2-E1 doit faire compléter explicitement paramètre → attribut');
require(core['T2-E2'].prompt.includes('modifie l’objet'), 'T2-E2 doit distinguer effet sur l’état et affichage/retour');
require(core['T2-E2'].tests.some(t => t.label.includes('indépendantes')), 'T2-E2 doit tester deux instances indépendantes');
require(core['T2-E3'].prompt.includes('La formule est fournie'), 'T2-E3 ne doit pas cacher un prérequis mathématique');
require(core['T2-E3'].solution.includes('self.a = a') && core['T2-E3'].solution.includes('self.b = b'), 'T2-E3 doit travailler la composition de deux objets Point');

const practice = practiceBank.filter(ex => ex.moduleId === 'T2');
require(practice.length === 5, `T2 doit conserver 5 entraînements, reçu ${practice.length}`);
const p = Object.fromEntries(practice.map(ex => [ex.id, ex]));
require(p['T2-X3']?.starter.includes('valeurs = []') && p['T2-X3']?.solution.includes('self.valeurs = []'), 'T2-X3 doit faire corriger variable locale → attribut');
require(p['T2-X3']?.tests.some(t => t.label.includes('indépendants')), 'T2-X3 doit tester l’indépendance des objets');
require(p['T2-X5']?.prompt.includes('self.score') && p['T2-X5']?.prompt.includes('autre.score'), 'T2-X5 doit distinguer l’objet courant d’un autre objet');

const primm = primmBank.find(item => item.moduleId === 'T2');
require(primm?.title === 'Deux objets, deux états', 'PRIMM T2 doit centrer la prédiction sur deux instances');
require(primm?.seed.includes('a = Compteur(10)') && primm?.seed.includes('b = Compteur(3)'), 'PRIMM T2 doit matérialiser deux instances');
require(primm?.predict.includes('self'), 'PRIMM T2 doit demander explicitement qui est self');

const novice = noviceBank.find(item => item.moduleId === 'T2');
require(novice?.checks?.length === 3, 'la passerelle novice T2 doit conserver exactement 3 micro-questions');
require(novice?.vocabulary?.some(([word]) => word.includes('instance')), 'le vocabulaire doit expliciter instance / objet');
require(novice?.vocabulary?.some(([word]) => word === 'self'), 'le vocabulaire doit définir self');
require(novice?.harness?.includes('remplace mentalement self'), 'la méthode novice doit fournir une routine concrète pour lire self');

const learningCode = [
  ...t2.lessons.map(l => l.code || ''),
  ...t2.exercises.flatMap(ex => [ex.starter || '', ex.solution || '']),
  ...practice.flatMap(ex => [ex.starter || '', ex.solution || '']),
  primm?.seed || '',
  novice?.worked?.code || ''
].join('\n');

require(!/class\s+[A-Za-z_]\w*\s*\([^\n:]+\)\s*:/.test(learningCode), 'aucun héritage ne doit être requis dans les codes T2');
for (const forbidden of ['super(', '__str__', '__eq__', '__add__', '@property']) {
  require(!learningCode.includes(forbidden), `construction hors cœur T2 détectée : ${forbidden}`);
}

if (!process.exitCode) {
  console.log('Student Zero T1/T2 Gate OK : classe/instance, __init__, self, attribut/local, méthodes, états indépendants et périmètre NSI verrouillés.');
}
