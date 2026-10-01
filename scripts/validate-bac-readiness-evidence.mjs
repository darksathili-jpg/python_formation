import fs from 'node:fs';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };

const evidence = fs.readFileSync('assets/bac-readiness-evidence.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/bac-readiness.yml', 'utf8');

need(evidence.includes("BAC_READINESS_EVIDENCE_VERSION = '1.26.0'"), 'Version Recognition Evidence 1.26.0 absente');
need(evidence.includes('MIN_STRATEGY_CHARS = 40'), 'Seuil minimal de stratégie absent');
need(evidence.includes("document.addEventListener('click', handleRunCapture, true)"), 'Interception avant le premier test absente');
need(evidence.includes('entry.lockedAt = now'), 'Verrouillage horodaté de la stratégie absent');
need(evidence.includes('entry.firstTestAt = now'), 'Horodatage du premier test absent');
need(evidence.includes('entry.attemptCount = Number(entry.attemptCount || 0) + 1'), 'Comptage objectif des lancements de tests absent');
need(evidence.includes('firstPassCount'), 'Indicateur de validation au premier lancement absent');
need(evidence.includes('taskHadPriorTest(core, taskId)'), 'Protection contre la reconstruction a posteriori d’une preuve V1.26 absente');
need(evidence.includes('handleResetAfter'), 'Synchronisation de la réinitialisation V1.25/V1.26 absente');
need(evidence.includes('entry.lockedAt <= deadline'), 'Contrôle de la preuve dans la fenêtre chronométrée absent');
need(evidence.includes('corePass && metrics.pass'), 'Le gate final doit combiner le gate historique et la preuve de reconnaissance');
need(evidence.includes('setTextIfChanged'), 'Garde-fou contre les boucles de MutationObserver absent');
need(evidence.includes("Aucun nom de chapitre n'est demandé"), 'La consigne ne doit pas annoncer le chapitre à mobiliser');

need(index.includes('assets/bac-readiness-evidence.js?v=1.26.0'), 'Couche Recognition Evidence absente de index.html');
need(/V1\.(?:2[7-9]|[3-9]\d)/.test(index), 'Shell applicatif antérieur à V1.27');
const shellVersionMatch = sw.match(/APP_VERSION = '(\d+)\.(\d+)\.(\d+)'/);
const shellVersion = shellVersionMatch ? shellVersionMatch.slice(1).map(Number) : null;
need(Boolean(shellVersion), 'Version du service worker introuvable');
need(Boolean(shellVersion) && (shellVersion[0] > 1 || (shellVersion[0] === 1 && shellVersion[1] >= 27)), 'Service worker antérieur au shell V1.27.0');
need(sw.includes("'./assets/bac-readiness-evidence.js?v=1.26.0'"), 'Recognition Evidence absente du cache hors ligne');
need(workflow.includes('node --check assets/bac-readiness-evidence.js'), 'Syntax check Recognition Evidence absent de la CI');
need(workflow.includes('node scripts/validate-bac-readiness-evidence.mjs'), 'Validation Recognition Evidence absente de la CI');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Bac Readiness V1.26 Recognition Evidence sous shell V1.27+: stratégie avant premier test, anti-rattrapage a posteriori, tentatives, reset cohérent, gate strict et cache hors ligne — OK');
