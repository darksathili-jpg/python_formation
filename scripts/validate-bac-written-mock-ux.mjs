import fs from 'node:fs';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const js = fs.readFileSync('assets/bac-written-mock-fix.js', 'utf8');
const css = fs.readFileSync('assets/bac-written-mock-fix.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

need(js.includes("MOCK_DURATION_MS = 210 * 60_000"), 'Durée réelle de 3 h 30 absente du correctif');
need(js.includes('started + MOCK_DURATION_MS <= Date.now()'), 'Une session arrivée à zéro n’est pas reconnue comme terminée');
need(js.includes('select.disabled = active'), 'Le sélecteur doit être verrouillé uniquement pendant une session active');
need(js.includes('Session terminée : choisis un autre sujet'), 'Message de reprise après session terminée absent');
need(js.includes('syncOfficialLink(select)'), 'Le PDF officiel ne suit pas le sujet sélectionné');
need(js.includes("state.mock = {\n    subjectId"), 'Réinitialisation explicite de la session absente');
need(js.includes("state.tab = 'mock'"), 'Le retour doit rester sur l’onglet Sujet blanc');
need(js.includes("data-written-mock-restart"), 'Commande visible pour recommencer le même sujet absente');
need(js.includes("document.addEventListener('change'"), 'Gestion du changement de sujet absente');
need(js.includes('MutationObserver(enhanceMockUI)'), 'Le correctif ne survit pas aux rerendus du Written Lab');
need(css.includes('@media(max-width:720px)'), 'Traitement mobile du correctif absent');
need(css.includes('.written-mock-session-actions'), 'Styles de la reprise de session absents');
need(index.includes('assets/bac-written-mock-fix.css?v=1.31.4'), 'CSS V1.31.4 non chargé par index.html');
need(index.includes('assets/bac-written-mock-fix.js?v=1.31.4'), 'JS V1.31.4 non chargé par index.html');
need(sw.includes('assets/bac-written-mock-fix.css?v=1.31.4'), 'CSS V1.31.4 absent du cache hors ligne');
need(sw.includes('assets/bac-written-mock-fix.js?v=1.31.4'), 'JS V1.31.4 absent du cache hors ligne');
need(Buffer.byteLength(js) <= 9000, `Patch JS trop lourd : ${Buffer.byteLength(js)} octets`);
need(Buffer.byteLength(css) <= 4000, `Patch CSS trop lourd : ${Buffer.byteLength(css)} octets`);

if (errors.length) {
  console.error(`Bac Mock UX Gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Bac Mock UX Gate — OK | sujet verrouillé seulement en cours · fin de session déverrouillée · PDF synchronisé · reprise même sujet · mobile · cache hors ligne');
