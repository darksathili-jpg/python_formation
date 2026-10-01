import { showToast } from './app-shell.js';
import { loadPack } from './bac-exam-studio-catalog.js';

// PYTHON//FORGE — Navigation UX patch V1.31.3
// Remplace le tiroir PDF historique par un vrai dialogue modal natif.
const STORAGE_KEY = 'python-forge-bac-exam-studio-v1';
let sourceTrigger = null;
let opening = false;
let dialog = null;
let frame = null;
let externalLink = null;
let fullscreenButton = null;

function sanitizeLegacySourceState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (state.sourceOpen) {
      state.sourceOpen = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch { /* stockage indisponible : aucune incidence sur la navigation */ }
}

function withViewerHint(url) {
  if (!url) return '';
  if (url.includes('#')) return url;
  return `${url}#page=1&zoom=page-width&navpanes=0`;
}

function ensureDialog() {
  if (dialog?.isConnected) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'studio-source-modal';
  dialog.setAttribute('aria-labelledby', 'studio-source-modal-title');
  dialog.innerHTML = `
    <div class="studio-source-modal-shell">
      <header class="studio-source-modal-head">
        <div class="studio-source-modal-titleblock">
          <div class="page-kicker">Source officielle · consultation</div>
          <h2 id="studio-source-modal-title">Sujet officiel Eduscol</h2>
          <p>Le PDF sert à vérifier une figure, la mise en page ou la formulation d’origine. Le travail reste dans le Studio.</p>
        </div>
        <div class="studio-source-modal-actions">
          <button type="button" class="btn" data-studio-source-fullscreen>⛶ Plein écran</button>
          <a class="btn" data-studio-source-external target="_blank" rel="noopener noreferrer">Ouvrir dans un onglet ↗</a>
          <button type="button" class="btn primary studio-source-close" data-studio-source-modal-close autofocus>Fermer</button>
        </div>
      </header>
      <div class="studio-source-modal-help" role="note">
        <strong>Navigation :</strong> <kbd>Échap</kbd> ferme ce panneau. Le bouton « Plein écran » agrandit uniquement le document. Si une extension PDF du navigateur affiche ses propres messages, ceux-ci appartiennent au lecteur du navigateur et non au Studio.
      </div>
      <div class="studio-source-modal-viewport">
        <iframe class="studio-source-modal-frame" title="Sujet officiel de baccalauréat" loading="lazy" src="about:blank"></iframe>
      </div>
    </div>`;
  document.body.append(dialog);
  frame = dialog.querySelector('.studio-source-modal-frame');
  externalLink = dialog.querySelector('[data-studio-source-external]');
  fullscreenButton = dialog.querySelector('[data-studio-source-fullscreen]');

  dialog.querySelector('[data-studio-source-modal-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('pointerdown', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('cancel', () => {
    // Le comportement natif ferme déjà le dialogue avec Échap.
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('studio-modal-open');
    if (frame) frame.src = 'about:blank';
    const target = sourceTrigger;
    sourceTrigger = null;
    requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));
  });
  fullscreenButton?.addEventListener('click', async () => {
    try {
      if (frame?.requestFullscreen) await frame.requestFullscreen();
      else showToast?.('Le plein écran n’est pas disponible dans ce navigateur. Utilise « Ouvrir dans un onglet ».');
    } catch {
      showToast?.('Le navigateur a refusé le plein écran. Le PDF peut être ouvert dans un onglet séparé.');
    }
  });
  return dialog;
}

async function openOfficialSource(trigger) {
  if (opening) return;
  opening = true;
  sourceTrigger = trigger;
  const originalText = trigger.textContent;
  trigger.setAttribute('aria-busy', 'true');
  trigger.textContent = 'Ouverture…';
  try {
    const packKey = document.querySelector('[data-studio-pack]')?.value;
    if (!packKey) throw new Error('Pack courant introuvable');
    const pack = await loadPack(packKey);
    if (!pack?.sourceUrl) throw new Error('URL de source absente');

    const modal = ensureDialog();
    const url = withViewerHint(pack.sourceUrl);
    frame.src = url;
    externalLink.href = pack.sourceUrl;
    document.body.classList.add('studio-modal-open');

    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
      requestAnimationFrame(() => modal.querySelector('[data-studio-source-modal-close]')?.focus({ preventScroll: true }));
    } else {
      document.body.classList.remove('studio-modal-open');
      frame.src = 'about:blank';
      window.open(pack.sourceUrl, '_blank', 'noopener');
      showToast?.('Ce navigateur ne prend pas en charge l’aperçu modal : le PDF a été ouvert dans un nouvel onglet.');
    }
  } catch (error) {
    console.error(error);
    document.body.classList.remove('studio-modal-open');
    showToast?.('Impossible d’ouvrir la source officielle. Réessaie ou utilise le lien Eduscol du sujet.');
  } finally {
    trigger.removeAttribute('aria-busy');
    trigger.textContent = originalText;
    opening = false;
  }
}

function syncTopbarHeight() {
  const topbar = document.querySelector('.topbar');
  const height = Math.ceil(topbar?.getBoundingClientRect().height || 72);
  document.documentElement.style.setProperty('--app-topbar-height', `${height}px`);
}

function installTopbarObserver() {
  syncTopbarHeight();
  const topbar = document.querySelector('.topbar');
  if (topbar && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(syncTopbarHeight);
    observer.observe(topbar);
  }
  window.addEventListener('resize', syncTopbarHeight, { passive: true });
}

function removeLegacyDrawer(root = document) {
  root.querySelectorAll?.('.studio-source-drawer').forEach(node => node.remove());
}

sanitizeLegacySourceState();
installTopbarObserver();

// Capture avant le gestionnaire historique du Studio : le vieux tiroir ne s’ouvre plus.
document.addEventListener('click', event => {
  const trigger = event.target.closest?.('[data-studio-source]');
  if (!trigger) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openOfficialSource(trigger);
}, true);

// Défense pour une session déjà ouverte avec l’ancien état en mémoire.
new MutationObserver(records => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.matches?.('.studio-source-drawer')) node.remove();
      else removeLegacyDrawer(node);
    }
  }
}).observe(document.body, { childList: true, subtree: true });

removeLegacyDrawer();
