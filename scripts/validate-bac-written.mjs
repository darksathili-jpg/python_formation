import fs from 'node:fs';
import { bacWrittenCorpus, writtenMicroDrills, writtenSkillTracks } from '../assets/bac-written-corpus.js';
import { bacWritten2021 } from '../assets/bac-written-2021.js';
import { bacWritten2022 } from '../assets/bac-written-2022.js';
import { bacWritten2023 } from '../assets/bac-written-2023.js';
import { bacWritten2024 } from '../assets/bac-written-2024.js';
import { bacWritten2025 } from '../assets/bac-written-2025.js';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const subjects = [
  ...bacWrittenCorpus.filter(subject => subject.year === 2026),
  ...bacWritten2025,
  ...bacWritten2024,
  ...bacWritten2023,
  ...bacWritten2022,
  ...bacWritten2021
];

const expectedByYear = { 2021:8, 2022:19, 2023:12, 2024:13, 2025:15, 2026:12 };
need(subjects.length === 79, `79 sujets officiels attendus, trouvé ${subjects.length}`);
need(new Set(subjects.map(subject => subject.id)).size === 79, 'Les identifiants des sujets doivent être uniques');
for (const [year, count] of Object.entries(expectedByYear)) {
  need(subjects.filter(subject => subject.year === Number(year)).length === count, `${year}: ${count} sujets attendus`);
}
need(subjects.every(subject => /^https:\/\/eduscol\.education\.gouv\.fr\/sites\/default\/files\//.test(subject.url)), 'Chaque sujet doit pointer vers son PDF officiel Eduscol');
need(subjects.reduce((sum, subject) => sum + subject.themes.length, 0) === 219, '219 sections/exercices thématiques doivent être indexés');

const current = subjects.filter(subject => subject.year === 2026);
need(current.length === 12, '12 sujets 2026 attendus');
need(current.every(subject => subject.exerciseCount === 3), 'Tous les sujets 2026 doivent comporter trois exercices');
need(current.every(subject => subject.themes.length === 3), 'Chaque sujet 2026 doit avoir trois thèmes indexés');
need(current.every(subject => subject.alignment === 'reference-2027'), '2026 doit rester le corpus de référence prioritaire');

need(writtenMicroDrills.length === 12, `12 micro-entraînements attendus, trouvé ${writtenMicroDrills.length}`);
need(writtenSkillTracks.length >= 6, 'Au moins six compétences transversales doivent être explicitées');
for (const drill of writtenMicroDrills) {
  need(drill.prompt?.length >= 80, `${drill.id}: consigne trop courte`);
  need(drill.answer?.length >= 60, `${drill.id}: réponse de référence trop courte`);
  need(Array.isArray(drill.criteria) && drill.criteria.length >= 3, `${drill.id}: au moins trois critères d’auto-vérification attendus`);
}

const ui = fs.readFileSync('assets/bac-written-ui.js', 'utf8');
const detailed = fs.readFileSync('assets/bac-written-detailed.js', 'utf8');
const bootstrap = fs.readFileSync('assets/bac-written-bootstrap.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

need(ui.includes("BAC_WRITTEN_VERSION = '1.27.0'"), 'Version Written Training Lab V1.27.0 absente');
need(ui.includes('MOCK_DURATION_MS = 210 * 60_000'), 'Chronomètre sujet blanc 3 h 30 absent');
need(ui.includes("STORAGE_KEY = 'python-forge-bac-written-v1'"), 'Persistance locale de l’entraînement écrit absente');
need(ui.includes('Rédige d’abord une réponse exploitable'), 'Garde-fou de rappel actif avant correction absent');
need(ui.includes('plan.trim().length<40') || ui.includes("trim().length<40"), 'Plan préalable avant révélation des notions absent');
need(ui.includes('ne prédisent pas une note') || ui.includes('Pas de score prédictif'), 'Limite non prédictive absente');
need(detailed.includes('bacWrittenCorpus.splice'), 'Fusion détaillée 2021–2026 absente');
need(bootstrap.includes("await import('./bac-written-ui.js')"), 'Bootstrap ordonné des annales détaillées absent');

need(index.includes('href="#written"') && index.includes('data-route-link="written"'), 'Navigation Écrit Bac absente');
need(index.includes('assets/bac-written.css?v=1.27.0'), 'CSS Written Training Lab absent');
need(index.includes('assets/bac-written-bootstrap.js?v=1.27.0'), 'Bootstrap Written Training Lab absent');
need(index.includes('V1.27'), 'Footer V1.27 absent');
need(sw.includes("APP_VERSION = '1.27.0'"), 'Service worker non basculé en V1.27.0');
for (const asset of ['bac-written-bootstrap.js','bac-written-ui.js','bac-written-corpus.js','bac-written-detailed.js','bac-written-2021.js','bac-written-2022.js','bac-written-2023.js','bac-written-2024.js','bac-written-2025.js']) {
  need(sw.includes(asset), `Cache hors ligne incomplet : ${asset} absent`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Bac Written Training V1.27: 79 sujets officiels, 219 exercices indexés, 12 drills, annales guidées, sujet blanc 3 h 30, métacognition et cache hors ligne — OK');
