import fs from 'node:fs';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const jsPath = 'assets/bac-exam-studio-navigation.js';
const cssPath = 'assets/bac-exam-studio-navigation.css';
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const core = fs.readFileSync('assets/bac-exam-studio.js', 'utf8');
const base = fs.readFileSync('assets/styles.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const jsBytes = fs.statSync(jsPath).size;
const cssBytes = fs.statSync(cssPath).size;

// Le défaut de la capture ne doit plus pouvoir revenir : ancien drawer sous la topbar.
need(base.includes('.topbar') && base.includes('z-index:100'), 'Référence de z-index de la topbar introuvable');
need(core.includes('studio-source-drawer'), 'Le test ne retrouve plus le composant source historique à neutraliser');
need(css.includes('.studio-source-drawer{display:none!important}'), 'Le tiroir PDF historique n’est pas neutralisé');

// Dialogue modal natif : top layer, fermeture et focus.
need(js.includes("document.createElement('dialog')"), 'Dialogue natif <dialog> absent');
need(js.includes('showModal'), 'Ouverture modale native absente');
need(css.includes('.studio-source-modal::backdrop'), 'Backdrop modal absent');
need(js.includes('data-studio-source-modal-close'), 'Bouton Fermer explicite absent');
need(js.includes("dialog.addEventListener('cancel'"), 'Fermeture clavier Échap non couverte');
need(js.includes("dialog.addEventListener('pointerdown'"), 'Fermeture par clic sur le backdrop absente');
need(js.includes('sourceTrigger') && js.includes("focus?.({ preventScroll: true })"), 'Retour du focus vers le déclencheur absent');
need(js.includes("document.body.classList.add('studio-modal-open')") && css.includes('body.studio-modal-open{overflow:hidden}'), 'Verrouillage du défilement de fond absent');

// Le gestionnaire historique ne doit jamais ouvrir son drawer en parallèle.
need(js.includes("'[data-studio-source]'"), 'Interception du bouton Source officielle absente');
need(js.includes('event.stopImmediatePropagation()'), 'Le gestionnaire historique n’est pas bloqué en capture');
need(js.includes('}, true);'), 'Le gestionnaire Source officielle doit être installé en phase capture');
need(js.includes('sanitizeLegacySourceState'), 'Nettoyage du sourceOpen historique absent');
need(js.includes('MutationObserver') && js.includes('removeLegacyDrawer'), 'Défense contre un vieux drawer déjà en mémoire absente');

// Lisibilité du PDF et sorties de secours.
need(css.includes('width:min(1500px,calc(100vw - 32px))'), 'Largeur desktop quasi plein écran absente');
need(css.includes('height:min(940px,calc(100dvh - 32px))'), 'Hauteur dynamique du lecteur PDF absente');
need(css.includes('.studio-source-modal-frame') && css.includes('height:100%'), 'Le PDF ne remplit pas la zone de lecture');
need(js.includes('requestFullscreen'), 'Action plein écran PDF absente');
need(js.includes('data-studio-source-external'), 'Ouverture de secours dans un onglet absente');
need(js.includes("frame.src = 'about:blank'"), 'Libération du PDF à la fermeture absente');
need(js.includes('#page=1&zoom=page-width&navpanes=0'), 'Indication de vue page-width pour le lecteur PDF absente');
need(css.includes('@media(max-width:720px)') && css.includes('height:100dvh'), 'Mode source plein écran mobile absent');

// Navigation générale : offsets mesurés au lieu de valeurs fragiles.
need(js.includes('ResizeObserver') && js.includes('--app-topbar-height'), 'Mesure dynamique de la hauteur de topbar absente');
need(css.includes('#written-training-lab>.written-tabs') && css.includes('position:sticky'), 'Navigation secondaire Écrit Bac non persistante');
need(css.includes('overflow-x:auto'), 'Navigation secondaire non protégée sur petite largeur');
need(css.includes('.bac-exam-studio-shell .studio-audit') && css.includes('z-index:120'), 'Panneau Audit perf encore susceptible d’être masqué');
need(css.includes('top:calc(var(--app-topbar-height) + 70px)'), 'Offsets des panneaux sticky du Studio non synchronisés avec la navigation');

// Accessibilité / robustesse / coûts.
need(css.includes('@media(prefers-reduced-motion:reduce)'), 'Reduced motion absent du correctif navigation');
need(css.includes('@media print') && css.includes('.studio-source-modal'), 'Le dialogue source n’est pas neutralisé à l’impression');
need(jsBytes <= 12000, `Patch JS trop lourd : ${jsBytes} octets > 12000`);
need(cssBytes <= 10000, `Patch CSS trop lourd : ${cssBytes} octets > 10000`);

for (const asset of ['assets/bac-exam-studio-navigation.css?v=1.31.3','assets/bac-exam-studio-navigation.js?v=1.31.3']) {
  need(index.includes(asset), `index.html ne charge pas ${asset}`);
}
for (const asset of ['bac-exam-studio-navigation.css?v=1.31.3','bac-exam-studio-navigation.js?v=1.31.3']) {
  need(sw.includes(asset), `Cache hors ligne incomplet : ${asset}`);
}

if (errors.length) {
  console.error(`Navigation UX Gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Navigation UX Gate — OK | modal PDF natif · fermer/Échap/backdrop · focus rendu · PDF large/fullscreen · tabs sticky · audit overlay visible · mobile 100dvh · JS ${(jsBytes/1024).toFixed(1)} KiB · CSS ${(cssBytes/1024).toFixed(1)} KiB`);
