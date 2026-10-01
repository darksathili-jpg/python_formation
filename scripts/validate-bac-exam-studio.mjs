import fs from 'node:fs';
import {
  BAC_EXAM_STUDIO_CATALOG_VERSION,
  bacExamStudioPackCatalog,
  bacExamStudioPackKeysBySubject,
  loadSubjectPacks
} from '../assets/bac-exam-studio-catalog.js';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const kib = file => Math.round(fs.statSync(file).size / 1024 * 10) / 10;
const modulePaths = [
  'assets/bac-exam-studio-bank.js','assets/bac-exam-studio-2026-an1-extra.js','assets/bac-exam-studio-2026-an2.js',
  'assets/bac-exam-studio-2026-ag1.js','assets/bac-exam-studio-2026-ag2.js','assets/bac-exam-studio-2026-ja1.js',
  'assets/bac-exam-studio-2026-ja2.js','assets/bac-exam-studio-2026-g11.js','assets/bac-exam-studio-2026-g12.js',
  'assets/bac-exam-studio-2026-me1.js','assets/bac-exam-studio-2026-me2.js','assets/bac-exam-studio-2026-po1.js','assets/bac-exam-studio-2026-po2.js'
];
const subjectIds = [...bacExamStudioPackKeysBySubject.keys()];
const packs = (await Promise.all(subjectIds.map(loadSubjectPacks))).flat();

const studioPath = 'assets/bac-exam-studio.js';
const catalogPath = 'assets/bac-exam-studio-catalog.js';
const toolsPath = 'assets/bac-exam-studio-pack-tools.js';
const cssPath = 'assets/bac-exam-studio.css';
const studio = fs.readFileSync(studioPath, 'utf8');
const catalog = fs.readFileSync(catalogPath, 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

need(BAC_EXAM_STUDIO_CATALOG_VERSION === '1.31.0', 'Catalogue Bac Exam Studio V1.31.0 absent');
need(studio.includes("BAC_EXAM_STUDIO_VERSION = '1.31.0'"), 'Moteur Bac Exam Studio V1.31.0 absent');
need(bacExamStudioPackCatalog.length === 36, `36 packs Gold attendus au catalogue, trouvé ${bacExamStudioPackCatalog.length}`);
need(packs.length === 36, `36 packs Gold chargeables attendus, trouvé ${packs.length}`);
need(subjectIds.length === 12, `12 sujets 2026 attendus, trouvé ${subjectIds.length}`);
need(new Set(packs.map(pack => pack.key)).size === 36, 'Les 36 clés de packs doivent être uniques');

const totalQuestions = packs.reduce((sum, pack) => sum + pack.questions.length, 0);
need(totalQuestions >= 190, `Au moins 190 questions détaillées attendues, trouvé ${totalQuestions}`);
for (const subjectId of subjectIds) {
  const subjectPacks = packs.filter(pack => pack.subjectId === subjectId);
  need(subjectPacks.length === 3, `${subjectId}: exactement 3 exercices Gold attendus`);
  need(JSON.stringify(subjectPacks.map(p => p.exercise).sort()) === '[1,2,3]', `${subjectId}: exercices 1, 2 et 3 attendus`);
}

for (const pack of packs) {
  need(/^2026-/.test(pack.subjectId), `${pack.key}: pack hors corpus 2026`);
  need(/^https:\/\/eduscol\.education\.gouv\.fr\//.test(pack.sourceUrl), `${pack.key}: source officielle Eduscol absente`);
  need(/^https:\/\//.test(pack.correctionAuditUrl), `${pack.key}: source de contrôle absente`);
  need(pack.audit?.officialTextChecked === true, `${pack.key}: contrôle de l'énoncé officiel non déclaré`);
  need(pack.audit?.solutionChecked === true, `${pack.key}: recalcul de solution non déclaré`);
  need(['recomputed','cross-checked'].includes(pack.audit?.correctionMode), `${pack.key}: mode d'audit de correction invalide`);
  need(pack.context?.length >= 2, `${pack.key}: dossier autonome trop pauvre`);
  need(pack.sections?.length >= 1, `${pack.key}: découpage pédagogique absent`);
  need(pack.estimatedMinutes >= 20, `${pack.key}: durée d’entraînement incohérente`);
  need(new Set(pack.questions.map(question => question.id)).size === pack.questions.length, `${pack.key}: identifiants de questions non uniques`);
  const referenced = new Set(pack.sections.flatMap(section => section.questions));
  need(pack.questions.every(question => referenced.has(question.id)), `${pack.key}: une question n’est rattachée à aucune section`);

  for (const question of pack.questions) {
    const label = `${pack.key}/${question.id}`;
    need(question.prompt?.length >= 55, `${label}: énoncé applicatif trop court (${question.prompt?.length || 0})`);
    need(['code','text'].includes(question.answerType), `${label}: type de réponse inconnu`);
    need(Array.isArray(question.hints) && question.hints.length >= 3, `${label}: trois indices gradués minimum attendus`);
    need(Array.isArray(question.criteria) && question.criteria.length >= 3, `${label}: trois critères d’auto-vérification minimum attendus`);
    need(question.correction?.recognize?.length >= 45, `${label}: étape de reconnaissance insuffisante`);
    need(Array.isArray(question.correction?.reasoning) && question.correction.reasoning.length >= 2, `${label}: raisonnement détaillé insuffisant`);
    need(question.correction?.expected?.length >= 12, `${label}: réponse attendue absente`);
    need(Array.isArray(question.correction?.traps) && question.correction.traps.length >= 2, `${label}: analyse des pièges insuffisante`);
    need(question.correction?.language?.length >= 35, `${label}: conseil de rédaction Bac insuffisant`);
    need(String(question.sourceQuestion || '').length > 0, `${label}: traçabilité vers la question source absente`);
  }
}

// Garde-fous pédagogiques : production avant correction, aides graduées et reconnaissance avant révélation.
need(studio.includes("STORAGE_KEY = 'python-forge-bac-exam-studio-v1'"), 'Persistance locale Bac Exam Studio absente');
need(studio.includes('hintsFor(p,item)>=Math.min(2,item.hints.length)'), 'Déverrouillage contrôlé de la correction absent');
need(studio.includes('Tentative → indices si nécessaire → correction expliquée'), 'Boucle pédagogique explicite absente');
need(studio.includes('Barème d’entraînement — auto-vérification'), 'Auto-vérification critériée absente');
need(studio.includes('note prédictive'), 'Limite non prédictive absente');
need(studio.includes('ERROR_LABELS') && studio.includes('Reconnaissance de la notion') && studio.includes('Gestion du temps'), 'Taxonomie d’erreurs / post-mortem absente');
need(studio.includes('2 points de langue en 2027'), 'Rappel des critères de langue 2027 absent');
need(studio.includes('strategyAtReveal') && studio.includes('firstSeenAt') && studio.includes('firstInputAt'), 'Instrumentation reconnaissance/compréhension élève zéro absente');
need(studio.includes('data-studio-export') && studio.includes('exportStudentZero'), 'Export élève zéro absent');
need(studio.includes('aucune identité') || studio.includes('aucune identité'.replace('aucune','Aucune')), 'Garantie de non-collecte d’identité absente de l’export');

// Architecture applicative : catalogue léger et chargement modulaire par sujet.
need(studio.includes("from './bac-exam-studio-catalog.js'"), 'Catalogue modulaire non utilisé par le moteur');
need(studio.includes('loadPack') && studio.includes('renderStudioLoading'), 'Chargement asynchrone des packs absent');
need(catalog.includes("import('./bac-exam-studio-2026-po2.js')"), 'Import dynamique du dernier module 2026 absent');
need(!studio.includes("from './bac-exam-studio-bank.js'"), 'Le moteur ne doit plus importer la banque complète de façon statique');

// Le PDF officiel reste facultatif et chargé seulement sur demande.
need(studio.includes('state.sourceOpen') && studio.includes('loading="lazy"'), 'Chargement à la demande du PDF officiel absent');
need(studio.includes('Le Studio est autonome'), 'Le caractère autonome de la zone d’entraînement doit être explicite');
need(!studio.includes('window.open('), 'Le Studio ne doit pas imposer une ouverture de fenêtre pour travailler');

// Performance Runtime.
need(studio.includes('SAVE_DELAY_MS = 320'), 'Autosauvegarde débouncée absente');
need(studio.includes("performance.mark?.('bac-studio-render-start')"), 'Mesure du coût de rendu absente');
need(studio.includes('new PerformanceObserver'), 'PerformanceObserver absent');
need(studio.includes("entryTypes: ['longtask']"), 'Observation des long tasks absente');
need(studio.includes("['Rendu synchrone', perf.lastSyncRenderMs, 50, 'ms']"), 'Budget rendu synchrone ≤ 50 ms absent');
need(studio.includes("['Rendu jusqu’à la frame', perf.lastFrameMs, 100, 'ms']"), 'Budget rendu-frame ≤ 100 ms absent');
need(studio.includes("['Nœuds DOM Studio', nodes, 550, '']"), 'Budget DOM ≤ 550 nœuds absent');
need(studio.includes("['Plus longue tâche observée', Math.round(perf.maxLongTaskMs), 100, 'ms']"), 'Budget long task ≤ 100 ms absent');

// Budgets statiques par module : le corpus peut grandir sans alourdir le démarrage.
const sizes = { studio: kib(studioPath), catalog: kib(catalogPath), tools: kib(toolsPath), css: kib(cssPath) };
need(sizes.studio <= 56, `Moteur Studio trop lourd : ${sizes.studio} KiB > 56 KiB`);
need(sizes.catalog <= 24, `Catalogue trop lourd : ${sizes.catalog} KiB > 24 KiB`);
need(sizes.tools <= 8, `Factory Gold trop lourde : ${sizes.tools} KiB > 8 KiB`);
need(sizes.css <= 28, `CSS Studio trop lourd : ${sizes.css} KiB > 28 KiB`);
let corpusKiB = 0;
for (const file of modulePaths) {
  const size = kib(file); corpusKiB += size;
  need(size <= 64, `${file}: module Gold trop lourd : ${size} KiB > 64 KiB`);
}
need(corpusKiB <= 520, `Corpus Gold total trop lourd : ${Math.round(corpusKiB*10)/10} KiB > 520 KiB`);

// Accessibilité et responsive.
const css = fs.readFileSync(cssPath, 'utf8');
need(css.includes(':focus-visible') && css.includes('outline:3px solid var(--studio-accent)'), 'Focus clavier visible absent');
need(css.includes('min-height:44px'), 'Cibles tactiles de 44 px absentes');
need(css.includes('@media(max-width:820px)') && css.includes('.studio-mobile-tabs'), 'Mode mobile applicatif absent');
need(css.includes('html[data-theme="light"] .bac-exam-studio-shell') && css.includes('html[data-theme="dark"] .bac-exam-studio-shell'), 'Contraste clair/sombre non explicitement pris en charge');
need(css.includes('@media print'), 'Mode impression absent');

// Intégration et cache hors ligne.
need(index.includes('assets/bac-exam-studio.js?v=1.31.0'), 'Moteur Studio V1.31 non chargé par index.html');
need(index.includes('· V1.31 ·'), 'Version produit V1.31 absente du footer');
need(sw.includes("APP_VERSION = '1.31.0'"), 'Service worker non basculé en V1.31.0');
for (const asset of ['bac-exam-studio-catalog.js','bac-exam-studio-pack-tools.js', ...modulePaths.map(file => file.replace('assets/',''))]) {
  need(sw.includes(asset), `Cache hors ligne incomplet : ${asset} absent`);
}

if (errors.length) {
  console.error(`Bac Exam Studio gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Bac Exam Studio V1.31 — OK | ${packs.length} packs Gold | ${totalQuestions} questions détaillées | 12 sujets | JS ${sizes.studio} KiB | catalogue ${sizes.catalog} KiB | corpus ${Math.round(corpusKiB*10)/10} KiB`);
