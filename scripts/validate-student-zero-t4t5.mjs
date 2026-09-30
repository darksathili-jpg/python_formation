import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const t5 = modules.find(m => m.id === 'T5');
if (!t5) fail('T5 manquant');

const lessonText = (t5?.lessons || []).map(l => `${l.title} ${l.html || ''} ${l.code || ''}`).join('\n');
for (const needle of [
  'un graphe n’est pas « un arbre avec plus de branches »',
  'sommet', 'arête', 'arc', 'orienté', 'non orienté', 'cycle',
  'dictionnaire', 'visites', 'DFS', 'BFS', 'file', 'pile',
  'graphe non pondéré'
]) {
  if (!lessonText.toLowerCase().includes(needle.toLowerCase())) fail(`T5: notion absente: ${needle}`);
}

if (t5?.duration !== '160 min') fail(`T5: durée attendue 160 min, reçue ${t5?.duration}`);
if ((t5?.objectives || []).length < 7) fail('T5: objectifs trop peu nombreux');

const ids = ['T5-E1','T5-E2','T5-E3'];
const core = Object.fromEntries((t5?.exercises || []).map(e => [e.id, e]));
for (const id of ids) if (!core[id]) fail(`${id} manquant`);

if (!/visites\s*=\s*\{depart\}/.test(core['T5-E2']?.solution || '')) fail('T5-E2: le DFS doit marquer le départ comme visité dès la découverte');
if (!/visites\.add\(v\)[\s\S]*pile\.append\(v\)/.test(core['T5-E2']?.solution || '')) fail('T5-E2: un voisin doit être marqué avant empilement');
if (!/file\s*=\s*\[\(depart,\s*0\)\]/.test(core['T5-E3']?.solution || '')) fail('T5-E3: BFS doit transporter la distance dans la file');
if (!/visites\.add\(v\)[\s\S]*file\.append\(\(v,\s*d\s*\+\s*1\)\)/.test(core['T5-E3']?.solution || '')) fail('T5-E3: voisin marqué avant enfilement avec distance + 1');

const practice = Object.fromEntries(practiceBank.filter(e => e.moduleId === 'T5').map(e => [e.id, e]));
for (const id of ['T5-X1','T5-X2','T5-X3','T5-X4','T5-X5']) if (!practice[id]) fail(`${id} manquant`);
if (!/cycle/i.test(practice['T5-X3']?.prompt || '')) fail('T5-X3: le débogage doit expliciter le risque de cycle');
if (!/visites\.add\(v\)[\s\S]*pile\.append\(v\)/.test(practice['T5-X3']?.solution || '')) fail('T5-X3: correction DFS incorrecte');
if (!/plus court|nombre minimal/i.test(practice['T5-X5']?.prompt || '')) fail('T5-X5: objectif de plus court chemin non explicite');

const primm = primmBank.find(p => p.moduleId === 'T5');
if (!primm) fail('PRIMM T5 manquant');
const primmText = JSON.stringify(primm);
for (const needle of ['cycle','file','visites','distance']) {
  if (!primmText.toLowerCase().includes(needle)) fail(`PRIMM T5: ${needle} absent`);
}

const novice = noviceBank.find(n => n.moduleId === 'T5');
if (!novice) fail('Passerelle novice T5 manquante');
const noviceText = JSON.stringify(novice);
for (const needle of ['arbre','graphe','cycle','orienté','visités','BFS']) {
  if (!noviceText.toLowerCase().includes(needle.toLowerCase())) fail(`Passerelle T5: ${needle} absent`);
}
if ((novice?.checks || []).length !== 3) fail(`Passerelle T5: 3 micro-questions attendues, reçu ${(novice?.checks || []).length}`);

if (!process.exitCode) {
  console.log('Student Zero T4/T5 gate: OK — arbre ≠ graphe, vocabulaire, orientation, cycles, visites, DFS/BFS et plus court chemin non pondéré verrouillés.');
}
