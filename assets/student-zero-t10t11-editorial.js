import { editorialOverrides } from './editorial-overrides.js';

// V1.23 — human-reviewed contracts for the redesigned T11 sequence.
Object.assign(editorialOverrides.RESULT_OVERRIDES, {
  'T11-E1': 'premiere_naive(texte, motif) doit renvoyer l’indice de la première occurrence du motif dans le texte, 0 pour un motif vide et -1 lorsqu’aucune occurrence n’existe.',
  'T11-E2': 'calcule_a_droite(motif) doit renvoyer un dictionnaire associant chaque caractère présent dans le motif à l’indice de son occurrence la plus à droite.',
  'T11-E3': 'cherche_boyer_moore(texte, motif) doit renvoyer la première position du motif ou -1 s’il est absent, en comparant chaque alignement de droite vers la gauche et en appliquant un déplacement strictement positif justifié par a_droite.',
  'T11-X1': 'premiere_position(texte, motif) doit renvoyer la première position du motif, 0 pour un motif vide et -1 si le motif est absent, en comparant explicitement texte[i+j] à motif[j].',
  'T11-X2': 'saut_sur_echec(a_droite, j, x) doit renvoyer un déplacement entier au moins égal à 1, calculé avec la dernière position connue du caractère x ou -1 lorsque x est absent du motif.',
  'T11-X3': 'compare_alignement(texte, motif, i) doit comparer de droite vers la gauche et renvoyer soit (True, -1, "") si tout le motif correspond, soit (False, j, x) au premier échec rencontré.',
  'T11-X4': 'alignements_bm(texte, motif) doit renvoyer exactement la liste des alignements effectivement examinés par la recherche au mauvais caractère jusqu’au succès ou jusqu’à la fin.',
  'T11-X5': 'cherche_preparee(texte, motif, a_droite) doit renvoyer la première position du motif ou -1 en réutilisant le dictionnaire a_droite fourni, sans reconstruire le prétraitement.'
});

Object.assign(editorialOverrides.PARAM_OVERRIDES, {
  'T11-E1': {
    texte: 'chaîne dans laquelle on recherche la première occurrence du motif',
    motif: 'chaîne recherchée dans texte ; une chaîne vide est considérée comme trouvée à la position 0'
  },
  'T11-E2': {
    motif: 'chaîne à prétraiter afin de mémoriser l’indice le plus à droite de chacun de ses caractères'
  },
  'T11-E3': {
    texte: 'chaîne dans laquelle la recherche par mauvais caractère examine des alignements successifs',
    motif: 'chaîne recherchée ; son prétraitement a_droite est calculé une seule fois avant la boucle de recherche'
  },
  'T11-X1': {
    texte: 'chaîne dans laquelle on teste successivement chaque alignement possible du motif',
    motif: 'chaîne recherchée caractère par caractère à partir de chaque alignement i'
  },
  'T11-X2': {
    a_droite: 'dictionnaire associant chaque caractère du motif à son indice le plus à droite',
    j: 'indice du motif auquel la comparaison courante vient d’échouer',
    x: 'caractère du texte observé à la position de l’échec ; il sert à calculer le déplacement'
  },
  'T11-X3': {
    texte: 'chaîne contenant l’alignement que l’on veut examiner caractère par caractère',
    motif: 'chaîne comparée de son dernier caractère vers son premier caractère',
    i: 'indice de départ du motif dans le texte pour l’alignement actuellement étudié'
  },
  'T11-X4': {
    texte: 'chaîne dans laquelle on veut tracer les alignements réellement visités',
    motif: 'chaîne non vide recherchée par la règle pédagogique du mauvais caractère'
  },
  'T11-X5': {
    texte: 'chaîne dans laquelle on recherche la première occurrence du motif déjà prétraité',
    motif: 'chaîne recherchée ; le dictionnaire fourni doit correspondre à ce motif',
    a_droite: 'prétraitement déjà calculé : dictionnaire caractère → indice le plus à droite dans motif'
  }
});
