import { writtenSkillTracks } from './bac-written-corpus.js';

// Patch éditorial V1.31.2 : formulation positive, précise et adaptée à une préparation au Bac.
const justificationSkill = writtenSkillTracks.find(skill => skill.id === 'justifier');
if (justificationSkill) {
  justificationSkill.title = 'Justifier avec précision';
}

// Navigation guidée : après le rerendu asynchrone du sujet choisi, amener réellement
// l'élève au début de la zone de travail. On attend la mutation de #view afin de ne
// jamais scroller vers l'ancien DOM juste avant son remplacement par bac-written-ui.js.
if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
  let guidedScrollPending = false;

  function scrollToGuidedWritingArea() {
    if (!guidedScrollPending) return;
    const target = document.querySelector('#written-guided');
    if (!target) return;

    guidedScrollPending = false;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }

  // Les cartes « Travailler guidé » et le défi adaptatif reconstruisent la même zone.
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-written-guide-subject],[data-written-adaptive]')) {
      guidedScrollPending = true;
    }
  });

  // Même comportement lorsqu'un sujet est choisi directement dans le sélecteur « Mode guidé ».
  document.addEventListener('change', event => {
    if (event.target.closest?.('[data-written-guided-subject]')) {
      guidedScrollPending = true;
    }
  });

  const writtenView = document.querySelector('#view');
  if (writtenView) {
    new MutationObserver(scrollToGuidedWritingArea).observe(writtenView, { childList: true });
  }
}
