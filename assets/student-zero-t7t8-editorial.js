import { editorialOverrides } from './editorial-overrides.js';

// V1.20 — human-reviewed residuals for the redesigned T8 exercises.
// Kept outside the historical override table to avoid weakening the global gate.
Object.assign(editorialOverrides.RESULT_OVERRIDES, {
  'T8-E1': 'La fonction applique(f, x) doit renvoyer exactement la valeur produite par un unique appel f(x). La fonction reçue dans f est transmise sans être appelée avant l’entrée dans applique.',
  'T8-E2': 'La fonction garde(predicat, tab) doit renvoyer une nouvelle liste contenant, dans le même ordre, uniquement les éléments x de tab pour lesquels predicat(x) vaut True. La liste tab doit rester inchangée.',
  'T8-X2': 'La fonction premier_qui(tab, predicat) doit renvoyer le premier élément de tab pour lequel predicat(element) vaut True ; si aucun élément ne convient, elle doit renvoyer None.'
});

editorialOverrides.PARAM_OVERRIDES['T8-X4'] = {
  ...(editorialOverrides.PARAM_OVERRIDES['T8-X4'] || {}),
  s: 'chaîne de caractères reçue par chacune des deux fonctions de transformation fournies ; elle est renvoyée nettoyée ou convertie en majuscules selon la fonction appelée'
};
