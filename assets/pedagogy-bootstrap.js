// V1.2 guard: the pedagogy enhancer intentionally mutates #view after the base router.
// On capstone routes, one enhancement pass is enough; suppressing subsequent observer
// callbacks prevents a self-triggered render loop while keeping the rest of the app unchanged.
const NativeMutationObserver = window.MutationObserver;
let capstoneEnhancementHash = '';

window.MutationObserver = class PedagogyGuardedMutationObserver extends NativeMutationObserver {
  constructor(callback) {
    super((mutations, observer) => {
      const hash = location.hash;
      const isCapstone = hash.startsWith('#capstone/');

      if (isCapstone) {
        if (capstoneEnhancementHash === hash) return;
        capstoneEnhancementHash = hash;
      } else {
        capstoneEnhancementHash = '';
      }

      callback(mutations, observer);
    });
  }
};
