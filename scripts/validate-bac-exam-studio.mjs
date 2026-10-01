import fs from 'node:fs';
import { BAC_EXAM_STUDIO_BANK_VERSION, bacExamStudioPacks } from '../assets/bac-exam-studio-bank.js';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const kib = file => Math.round(fs.statSync(file).size / 1024 * 10) / 10;

const studioPath = 'assets/bac-exam-studio.js';
const bankPath = 'assets/bac-exam-studio-bank.js';
const cssPath = 'assets/bac-exam-studio.css';
const studio = fs.readFileSync(studioPath, 'utf8');
const bank = fs.readFileSync(bankPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

need(BAC_EXAM_STUDIO_BANK_VERSION === '1.30.0', 'Banque Bac Exam Studio V1.30.0 absente');
need(studio.includes("BAC_EXAM_STUDIO_VERSION = '1.30.0'"), 'Moteur Bac Exam Studio V1.30.0 absent');
need(bacExamStudioPacks.length >= 2, `Au moins 2 packs Gold complets attendus, trouvé ${bacExamStudioPacks.length}`);

const totalQuestions = bacExamStudioPacks.reduce((sum, pack) => sum + pack.questions.length, 0);
need(totalQuestions >= 22, `Au moins 22 questions intégralement corrigées attendues, trouvé ${totalQuestions}`);
need(new Set(bacExamStudioPacks.map(pack => pack.key)).size === bacExamStudioPacks.length, 'Les clés de packs doivent être uniques');

for (const pack of bacExamStudioPacks) {
  need(/^2026-/.test(pack.subjectId), `${pack.key}: les premiers packs Gold doivent cibler le corpus 2026`);
  need(/^https:\/\/eduscol\.education\.gouv\.fr\//.test(pack.sourceUrl), `${pack.key}: source officielle Eduscol absente`);
  need(/^https:\/\//.test(pack.correctionAuditUrl), `${pack.key}: source de contrôle de correction absente`);
  need(pack.context?.length >= 2, `${pack.key}: dossier autonome trop pauvre`);
  need(pack.sections?.length >= 2, `${pack.key}: découpage pédagogique en sections absent`);
  need(pack.estimatedMinutes >= 20, `${pack.key}: durée d’entraînement incohérente`);
  need(new Set(pack.questions.map(question => question.id)).size === pack.questions.length, `${pack.key}: identifiants de questions non uniques`);

  const referenced = new Set(pack.sections.flatMap(section => section.questions));
  need(pack.questions.every(question => referenced.has(question.id)), `${pack.key}: une question n’est rattachée à aucune section`);

  for (const question of pack.questions) {
    const label = `${pack.key}/${question.id}`;
    need(question.prompt?.length >= 55, `${label}: énoncé applicatif trop court`);
    need(['code','text'].includes(question.answerType), `${label}: type de réponse inconnu`);
    need(Array.isArray(question.hints) && question.hints.length >= 3, `${label}: trois indices gradués minimum attendus`);
    need(Array.isArray(question.criteria) && question.criteria.length >= 3, `${label}: trois critères d’auto-vérification minimum attendus`);
    need(question.correction?.recognize?.length >= 45, `${label}: étape de reconnaissance insuffisante`);
    need(Array.isArray(question.correction?.reasoning) && question.correction.reasoning.length >= 2, `${label}: raisonnement détaillé insuffisant`);
    need(question.correction?.expected?.length >= 12, `${label}: réponse attendue absente`);
    need(Array.isArray(question.correction?.traps) && question.correction.traps.length >= 2, `${label}: analyse des pièges insuffisante`);
    need(question.correction?.language?.length >= 35, `${label}: conseil de rédaction Bac insuffisant`);
  }
}

// Garde-fous pédagogiques : production avant correction, aides graduées, métacognition.
need(studio.includes("STORAGE_KEY = 'python-forge-bac-exam-studio-v1'"), 'Persistance locale Bac Exam Studio absente');
need(studio.includes('hints >= Math.min(2, item.hints.length)'), 'Déverrouillage contrôlé de la correction absent');
need(studio.includes('Tentative → indices si nécessaire → correction expliquée'), 'Boucle pédagogique explicite absente');
need(studio.includes('Barème d’entraînement — auto-vérification'), 'Auto-vérification critériée absente');
need(studio.includes('note prédictive'), 'Limite non prédictive absente');
need(studio.includes('ERROR_LABELS') && studio.includes('Reconnaissance de la notion') && studio.includes('Gestion du temps'), 'Taxonomie d’erreurs / post-mortem absente');
need(studio.includes('2 points de langue en 2027'), 'Rappel des critères de langue 2027 absent');
need(studio.includes('correctionAuditUrl'), 'Traçabilité de la source de contrôle absente');

// Garde-fous applicatifs : le PDF officiel est facultatif et chargé seulement sur demande.
need(studio.includes('state.sourceOpen') && studio.includes('loading="lazy"'), 'Chargement à la demande du PDF officiel absent');
need(studio.includes('Le Studio est autonome'), 'Le caractère autonome de la zone d’entraînement doit être explicite');
need(!studio.includes('window.open('), 'Le Studio ne doit pas imposer une ouverture de fenêtre pour travailler');

// Performance : pas de framework lourd, pas de rendu à chaque frappe, instrumentation Runtime.
need(studio.includes('SAVE_DELAY_MS = 320'), 'Autosauvegarde débouncée absente');
need(studio.includes("performance.mark?.('bac-studio-render-start')"), 'Mesure du coût de rendu absente');
need(studio.includes('new PerformanceObserver'), 'PerformanceObserver absent');
need(studio.includes("entryTypes: ['longtask']"), 'Observation des long tasks absente');
need(studio.includes("['Rendu synchrone', perf.lastSyncRenderMs, 50, 'ms']"), 'Budget rendu synchrone ≤ 50 ms absent');
need(studio.includes("['Rendu jusqu’à la frame', perf.lastFrameMs, 100, 'ms']"), 'Budget rendu-frame ≤ 100 ms absent');
need(studio.includes("['Nœuds DOM Studio', nodes, 550, '']"), 'Budget DOM ≤ 550 nœuds absent');
need(studio.includes("['Plus longue tâche observée', Math.round(perf.maxLongTaskMs), 100, 'ms']"), 'Budget long task ≤ 100 ms absent');

// Budgets de poids statiques : une régression doit casser la CI avant le déploiement.
const sizes = { studio: kib(studioPath), bank: kib(bankPath), css: kib(cssPath) };
need(sizes.studio <= 48, `Moteur Studio trop lourd : ${sizes.studio} KiB > 48 KiB`);
need(sizes.bank <= 80, `Banque Gold trop lourde : ${sizes.bank} KiB > 80 KiB`);
need(sizes.css <= 28, `CSS Studio trop lourd : ${sizes.css} KiB > 28 KiB`);

// Accessibilité et responsive : focus visible, cibles confortables, mode mobile et thèmes.
need(css.includes(':focus-visible') && css.includes('outline:3px solid var(--studio-accent)'), 'Focus clavier visible absent');
need(css.includes('min-height:44px'), 'Cibles tactiles de 44 px absentes');
need(css.includes('@media(max-width:820px)') && css.includes('.studio-mobile-tabs'), 'Mode mobile applicatif absent');
need(css.includes('html[data-theme="light"] .bac-exam-studio-shell') && css.includes('html[data-theme="dark"] .bac-exam-studio-shell'), 'Contraste clair/sombre non explicitement pris en charge');
need(css.includes('@media print'), 'Mode impression absent');

// Intégration et cache hors ligne.
need(index.includes('assets/bac-exam-studio.css?v=1.30.0'), 'CSS Studio V1.30 non chargé par index.html');
need(index.includes('assets/bac-exam-studio.js?v=1.30.0'), 'Moteur Studio V1.30 non chargé par index.html');
need(index.includes('· V1.30 ·'), 'Version produit V1.30 absente du footer');
need(sw.includes("APP_VERSION = '1.30.0'"), 'Service worker non basculé en V1.30.0');
for (const asset of ['bac-exam-studio.css','bac-exam-studio.js','bac-exam-studio-bank.js']) {
  need(sw.includes(asset), `Cache hors ligne incomplet : ${asset} absent`);
}

if (errors.length) {
  console.error(`Bac Exam Studio gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Bac Exam Studio V1.30 — OK | ${bacExamStudioPacks.length} packs | ${totalQuestions} questions détaillées | JS ${sizes.studio} KiB | banque ${sizes.bank} KiB | CSS ${sizes.css} KiB`);
