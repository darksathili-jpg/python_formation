import fs from 'node:fs';
import { bacWrittenCorpus, writtenMicroDrills, writtenSkillTracks } from '../assets/bac-written-corpus.js';
import { BAC_WRITTEN_CORPUS_INDEX_VERSION, BAC_WRITTEN_SUBJECT_COUNT, BAC_WRITTEN_THEME_COUNT, BAC_WRITTEN_VERIFIED_COUNT } from '../assets/bac-written-detailed.js';
import { bacWrittenCorpusPdfIndex } from '../assets/bac-written-pdf-index.js';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const expectedByYear = { 2021:8, 2022:19, 2023:12, 2024:13, 2025:15, 2026:12 };

need(BAC_WRITTEN_CORPUS_INDEX_VERSION === '1.28.0', 'Version d’index PDF V1.28.0 absente');
need(BAC_WRITTEN_SUBJECT_COUNT === 79, `79 sujets officiels attendus, trouvé ${BAC_WRITTEN_SUBJECT_COUNT}`);
need(BAC_WRITTEN_VERIFIED_COUNT === 79, `Les 79 sujets doivent être réconciliés avec les PDF fournis, trouvé ${BAC_WRITTEN_VERIFIED_COUNT}`);
need(Object.keys(bacWrittenCorpusPdfIndex).length === 79, 'L’index issu des PDF doit contenir exactement 79 sujets');
need(new Set(bacWrittenCorpus.map(subject => subject.id)).size === 79, 'Les identifiants des sujets doivent être uniques');
for (const [year, count] of Object.entries(expectedByYear)) {
  need(bacWrittenCorpus.filter(subject => subject.year === Number(year)).length === count, `${year}: ${count} sujets attendus`);
}
need(bacWrittenCorpus.every(subject => /^https:\/\/eduscol\.education\.gouv\.fr\/sites\/default\/files\//.test(subject.url)), 'Chaque sujet doit pointer vers son PDF officiel Eduscol');
need(BAC_WRITTEN_THEME_COUNT === 292, `292 exercices réellement détectés dans les PDF attendus, trouvé ${BAC_WRITTEN_THEME_COUNT}`);
need(bacWrittenCorpus.every(subject => subject.themes.length === subject.exerciseCount), 'Chaque sujet doit avoir exactement un thème indexé par exercice détecté dans le PDF');
need(bacWrittenCorpus.every(subject => subject.themes.every((theme, index) => theme.n === index + 1 && String(theme.theme || '').trim().length >= 3)), 'Les exercices doivent être numérotés sans trou avec un thème non vide');

const current = bacWrittenCorpus.filter(subject => subject.year === 2026);
need(current.length === 12, '12 sujets 2026 attendus');
need(current.every(subject => subject.exerciseCount === 3), 'Tous les sujets 2026 doivent comporter trois exercices');
need(current.every(subject => subject.alignment === 'reference-2027'), '2026 doit rester le corpus de référence prioritaire');

const amerique2021 = bacWrittenCorpus.find(subject => subject.id === '2021-amerique-du-nord-sujet');
need(/bases de données/i.test(amerique2021?.themes?.[0]?.theme || ''), 'Correction critique absente : Amérique du Nord 2021 exercice 1 doit être indexé bases de données/SQL');
const polynesie2025j2 = bacWrittenCorpus.find(subject => subject.id === '2025-polynesie-francaise-sujet-2');
need(polynesie2025j2?.exerciseCount === 3 && /graphe|chemins/i.test(polynesie2025j2?.themes?.[2]?.theme || ''), 'Correction critique absente : Polynésie 2025 sujet 2 doit comporter un exercice 3 sur la recherche de chemins');
const asie2025s3 = bacWrittenCorpus.find(subject => subject.id === '2025-asie-sujet-3');
need(/réseaux|routage/i.test(asie2025s3?.themes?.[1]?.theme || ''), 'Correction critique absente : Asie 2025 sujet 3 exercice 2 doit être indexé réseaux/routage');

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

need(ui.includes("BAC_WRITTEN_VERSION = '1.27.0'"), 'Moteur pédagogique Written Training Lab V1.27.0 absent');
need(ui.includes('MOCK_DURATION_MS = 210 * 60_000'), 'Chronomètre sujet blanc 3 h 30 absent');
need(ui.includes("STORAGE_KEY = 'python-forge-bac-written-v1'"), 'Persistance locale de l’entraînement écrit absente');
need(ui.includes('Rédige d’abord une réponse exploitable'), 'Garde-fou de rappel actif avant correction absent');
need(ui.includes('plan.trim().length<40') || ui.includes("trim().length<40"), 'Plan préalable avant révélation des notions absent');
need(ui.includes('ne prédisent pas une note') || ui.includes('Pas de score prédictif'), 'Limite non prédictive absente');
need(detailed.includes('bacWrittenCorpusPdfIndex') && detailed.includes('corpusVerified: true'), 'Réconciliation avec les PDF fournis absente');
need(bootstrap.includes("await import('./bac-written-ui.js')"), 'Bootstrap ordonné des annales détaillées absent');

need(index.includes('href="#written"') && index.includes('data-route-link="written"'), 'Navigation Écrit Bac absente');
need(index.includes('assets/bac-written.css?v=1.27.0'), 'CSS Written Training Lab absent');
need(index.includes('assets/bac-written-bootstrap.js?v=1.28.0'), 'Bootstrap corpus V1.28 absent');
need(index.includes('V1.28'), 'Footer V1.28 absent');
need(sw.includes("APP_VERSION = '1.28.0'"), 'Service worker non basculé en V1.28.0');
for (const asset of ['bac-written-bootstrap.js','bac-written-ui.js','bac-written-corpus.js','bac-written-detailed.js','bac-written-pdf-index.js','bac-written-2021.js','bac-written-2022.js','bac-written-2023.js','bac-written-2024.js','bac-written-2025.js']) {
  need(sw.includes(asset), `Cache hors ligne incomplet : ${asset} absent`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Bac Written Training V1.28: 79 PDF vérifiés, ${BAC_WRITTEN_THEME_COUNT} exercices réellement indexés, 12 drills, annales guidées, sujet blanc 3 h 30 et cache hors ligne — OK`);
