import fs from 'node:fs';
import { modules, practiceBank, primmBank, capstones, scopeNotes } from '../assets/content.js';
import { terminaleDependencies, canonicalVocabulary, bac2027, bacWrittenPrompts } from '../assets/terminale-transversal.js';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const terminale = modules.filter(m => m.track === 'terminale');
const expectedIds = Array.from({ length: 11 }, (_, i) => `T${i + 1}`);

need(terminale.length === 11, `11 modules Terminale attendus, trouvé ${terminale.length}`);
need(JSON.stringify(terminale.map(m => m.id)) === JSON.stringify(expectedIds), 'L’ordre Terminale doit rester T1 → T11');

for (const module of terminale) {
  const practice = practiceBank.filter(e => e.moduleId === module.id);
  need(module.exercises.length >= 3, `${module.id}: au moins 3 exercices cœur attendus`);
  need(practice.length === 5, `${module.id}: 5 entraînements attendus, trouvé ${practice.length}`);
  need(primmBank.some(p => p.moduleId === module.id), `${module.id}: PRIMM manquant`);
  const levels = new Set([...module.exercises, ...practice].map(e => e.level));
  need(levels.has(1) && levels.has(2) && levels.has(3), `${module.id}: progression niveaux 1/2/3 incomplète`);
  need([...module.exercises, ...practice].some(e => e.level === 3 || e.kind === 'transfert'), `${module.id}: exercice de transfert / niveau 3 manquant`);
}

need(terminaleDependencies.length === 11, `Carte de dépendances: 11 entrées attendues, trouvé ${terminaleDependencies.length}`);
need(new Set(terminaleDependencies.map(d => d.id)).size === 11, 'Carte de dépendances: identifiants dupliqués');
for (const [index, item] of terminaleDependencies.entries()) {
  need(item.id === expectedIds[index], `Carte de dépendances: ${expectedIds[index]} attendu à la position ${index + 1}`);
  need(Array.isArray(item.recall) && item.recall.length >= 2, `${item.id}: au moins deux réactivations ciblées attendues`);
  need(typeof item.bridge === 'string' && item.bridge.length >= 60, `${item.id}: pont conceptuel trop court`);
  for (const ref of item.recall) {
    const match = String(ref).match(/\b(T\d+)\b/);
    if (match) {
      const current = Number(item.id.slice(1));
      const prior = Number(match[1].slice(1));
      need(prior < current, `${item.id}: dépendance Terminale future ou circulaire vers ${match[1]}`);
    }
  }
}

need(canonicalVocabulary.length === 11, `Vocabulaire canonique: 11 notions attendues, trouvé ${canonicalVocabulary.length}`);
need(new Set(canonicalVocabulary.map(v => v[0])).size === 11, 'Chaque module T1→T11 doit posséder une notion canonique');
need(new Set(canonicalVocabulary.map(v => v[1].toLowerCase())).size === canonicalVocabulary.length, 'Le vocabulaire canonique ne doit pas dupliquer un même terme');

need(bacWrittenPrompts.length === 11, `Bac écrit: 11 questions express attendues, trouvé ${bacWrittenPrompts.length}`);
need(new Set(bacWrittenPrompts.map(q => q.moduleId)).size === 11, 'Bac écrit: chaque module doit être représenté une fois');
for (const q of bacWrittenPrompts) {
  need(expectedIds.includes(q.moduleId), `Question Bac reliée à un module inconnu: ${q.moduleId}`);
  need(q.prompt.length >= 90, `${q.id}: question écrite trop courte pour exiger un raisonnement`);
  need(Array.isArray(q.criteria) && q.criteria.length >= 3, `${q.id}: au moins 3 critères de réponse attendus`);
}

need(bac2027.written.duration === '3 h 30', 'Bac 2027: durée écrite attendue 3 h 30');
need(bac2027.written.exercises === 3, 'Bac 2027: l’écrit doit annoncer 3 exercices indépendants');
need(/2 points sur 20/i.test(bac2027.written.language), 'Bac 2027: les 2 points de maîtrise de la langue doivent être visibles');
need(bac2027.practical.duration === '1 h', 'Bac 2027: durée pratique attendue 1 h');
need(/application/i.test(bac2027.practical.format) && /dialogue/i.test(bac2027.practical.format), 'Bac 2027: application + dialogue doivent être annoncés');
need(/75 %/.test(bac2027.written.weight) && /25 %/.test(bac2027.practical.weight), 'Bac 2027: pondération 75/25 attendue');
need(/systèmes/i.test(bac2027.scope) && /réseaux/i.test(bac2027.scope), 'Le périmètre doit expliciter que PYTHON//FORGE ne couvre pas tout le bac');

need(capstones.length === 9, `9 applications intégratives attendues, trouvé ${capstones.length}`);
const practicalCoverage = new Set();
for (const app of capstones) {
  need(app.duration === '60 min', `${app.id}: durée cible 60 min attendue`);
  need(Array.isArray(app.dialogue) && app.dialogue.length === 3, `${app.id}: exactement 3 questions de dialogue attendues`);
  need(Array.isArray(app.modules) && app.modules.length >= 1, `${app.id}: modules mobilisés non déclarés`);
  for (const id of app.modules) if (/^T\d+$/.test(id)) practicalCoverage.add(id);
}
for (const id of ['T1','T2','T3','T4','T5','T6','T7','T9','T10','T11']) {
  need(practicalCoverage.has(id), `Préparation pratique: ${id} n’est couvert par aucune application intégrative`);
}
need(!practicalCoverage.has('T8'), 'T8 est conceptuel : ne pas forcer artificiellement sa présence dans une application pratique');

const terminalScope = (scopeNotes.terminale || []).join(' ');
need(/Neuf applications intégratives/i.test(terminalScope), 'Le périmètre Terminale doit annoncer les 9 applications');
need(/systèmes/i.test(terminalScope) && /réseaux/i.test(terminalScope), 'Le périmètre Terminale doit rappeler les rubriques du bac non couvertes');

const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
need(index.includes('terminale-transversal-ui.js?v=1.24.0'), 'UI transversale non chargée dans index.html');
need(sw.includes('terminale-transversal-ui.js?v=1.24.0') && sw.includes('terminale-transversal.js'), 'Assets transversaux absents du cache hors ligne');
need(index.includes('V1.25'), 'Footer V1.25 absent');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Terminale Transversal Gate: dépendances, charge progressive, vocabulaire, transferts, Bac 2027 écrit/pratique et périmètre — OK');
