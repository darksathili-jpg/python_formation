import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const fail = message => { throw new Error(`Student Zero T2/T3: ${message}`); };
const t3 = modules.find(module => module.id === 'T3');
if (!t3) fail('module T3 introuvable');

const lessonText = t3.lessons.map(l => `${l.title} ${l.html || ''} ${(l.points || []).join(' ')}`).join('\n');
for (const marker of [
  'Transition T2 → T3',
  'Type abstrait',
  'Pile : LIFO',
  'File : FIFO',
  'la pile n’est pas « une liste »',
  'Même interface, autre implémentation',
  'File simple et file avec deux piles',
  'Choisir la structure par la règle de sortie'
]) {
  if (!lessonText.includes(marker)) fail(`leçon manquante: ${marker}`);
}

if (!t3.bo.includes('interface') || !t3.bo.includes('implémentation')) fail('BO interface/implémentation absent');
if (!t3.objectives.some(x => x.includes('type abstrait'))) fail('objectif type abstrait absent');
if (!t3.objectives.some(x => x.includes('LIFO') && x.includes('FIFO'))) fail('objectif LIFO/FIFO absent');

const byId = (list, id) => list.find(item => item.id === id);
const e1 = byId(t3.exercises, 'T3-E1');
const e2 = byId(t3.exercises, 'T3-E2');
const e3 = byId(t3.exercises, 'T3-E3');
for (const exercise of [e1, e2, e3]) if (!exercise) fail('un exercice cœur T3 manque');

for (const token of ['empiler', 'depiler', 'est_vide', '_data']) {
  if (!e1.solution.includes(token)) fail(`T3-E1 doit contenir ${token}`);
}
if (!e1.tests.some(t => t.raises === 'AssertionError')) fail('T3-E1 doit tester la précondition pile vide');
if (!e2.prompt.includes('utilise uniquement son interface')) fail('T3-E2 doit imposer l’usage de l’interface');
if (!e2.solution.includes('pile.empiler') || !e2.solution.includes('pile.depiler') || !e2.solution.includes('pile.est_vide')) fail('T3-E2 n’utilise pas l’interface abstraite');
if (!e3.prompt.includes('FIFO') || !e3.solution.includes('self.entree') || !e3.solution.includes('self.sortie')) fail('T3-E3 file deux piles incomplète');
if (!e3.solution.includes('while len(self.entree) > 0')) fail('T3-E3 transfert entre piles absent');

const practice = practiceBank.filter(item => item.moduleId === 'T3');
if (practice.length !== 5) fail(`5 entraînements T3 attendus, reçu ${practice.length}`);
const kinds = new Set(practice.map(item => item.kind));
for (const kind of ['compléter', 'écrire', 'déboguer', 'transfert']) if (!kinds.has(kind)) fail(`type d’entraînement manquant: ${kind}`);
if (!byId(practice, 'T3-X3')?.prompt.includes('file FIFO')) fail('débogage LIFO/FIFO T3-X3 absent');
if (!byId(practice, 'T3-X4')?.prompt.includes('N’accède à aucun attribut interne')) fail('T3-X4 ne protège pas l’abstraction');
if (!byId(practice, 'T3-X5')?.prompt.includes('deux piles')) fail('transfert file avec deux piles absent');

const primm = primmBank.find(item => item.moduleId === 'T3');
if (!primm || !primm.title.includes('Même interface')) fail('PRIMM interface/implémentation absent');
if (!primm.investigate.some(q => q.includes('implémentation interne'))) fail('PRIMM ne questionne pas l’indépendance à l’implémentation');

const novice = noviceBank.find(item => item.moduleId === 'T3');
if (!novice) fail('passerelle novice T3 absente');
const vocab = novice.vocabulary.map(v => v[0]);
for (const word of ['type abstrait', 'interface', 'implémentation', 'LIFO', 'FIFO']) {
  if (!vocab.includes(word)) fail(`vocabulaire novice manquant: ${word}`);
}
if (novice.checks.length !== 3) fail(`3 micro-questions T3 attendues, reçu ${novice.checks.length}`);

console.log('Student Zero T2/T3 gate: OK — abstraction, interface/implémentation, LIFO/FIFO et choix de structure verrouillés.');
