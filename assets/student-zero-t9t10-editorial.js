import { editorialOverrides } from './editorial-overrides.js';

// V1.22 — human-reviewed contracts for the redesigned T10 sequence.
Object.assign(editorialOverrides.RESULT_OVERRIDES, {
  'T10-E1': 'facons(n) doit renvoyer le nombre de façons d’atteindre exactement la marche n en avançant de 1 ou 2 marches, avec facons(0)=1 et facons(1)=1, en construisant les états dans l’ordre croissant.',
  'T10-E2': 'facons_memo(n, memo) doit renvoyer le même nombre de façons que la version bottom-up, mais en calculant les états à la demande et en réutilisant le même dictionnaire memo dans tous les appels récursifs.',
  'T10-E3': 'nb_pieces(montant, pieces) doit renvoyer le nombre minimal de pièces permettant de former exactement montant avec réutilisation illimitée des valeurs de pieces, 0 pour un montant nul et -1 si la somme est impossible.',
  'T10-X1': 'etats_escalier(n) doit renvoyer la liste complète des valeurs dp[0] à dp[n] du problème de l’escalier ; par exemple n=4 produit [1, 1, 2, 3, 5].',
  'T10-X2': 'Après correction, constructions(n, memo) doit renvoyer le nombre de constructions de longueur n avec des blocs de longueur 1 ou 2 tout en partageant le même cache entre les deux appels récursifs.',
  'T10-X3': 'chemins(lignes, colonnes) doit renvoyer le nombre de chemins allant du coin supérieur gauche au coin inférieur droit en n’utilisant que des déplacements vers la droite ou vers le bas.',
  'T10-X4': 'score_max(scores) doit renvoyer le meilleur total obtenu en choisissant des bonus de scores sans jamais choisir deux positions voisines ; une liste vide renvoie 0.',
  'T10-X5': 'energie_min(valeurs) doit renvoyer le coût minimal pour atteindre la dernière borne par sauts de 1 ou 2 positions, en ne conservant que les deux coûts précédents plutôt qu’une table complète.'
});

Object.assign(editorialOverrides.PARAM_OVERRIDES, {
  'T10-E1': {
    n: 'indice entier positif ou nul de la marche que le personnage doit atteindre ; 0 représente la position de départ avant tout déplacement'
  },
  'T10-E2': {
    n: 'indice entier positif ou nul de la marche dont on veut calculer le nombre de façons d’accès',
    memo: 'dictionnaire partagé qui associe un état n déjà calculé à son nombre de façons ; None provoque la création du cache au premier appel'
  },
  'T10-E3': {
    montant: 'somme entière supérieure ou égale à 0 à former exactement',
    pieces: 'liste de valeurs de pièces entières strictement positives ; chaque valeur peut être réutilisée autant de fois que nécessaire'
  },
  'T10-X1': {
    n: 'dernier indice d’état à construire pour le problème de l’escalier'
  },
  'T10-X2': {
    n: 'longueur entière supérieure ou égale à 0 à construire avec des blocs de longueur 1 ou 2',
    memo: 'cache partagé entre tous les appels récursifs pour mémoriser les états n déjà résolus'
  },
  'T10-X3': {
    lignes: 'nombre de lignes de la grille, entier au moins égal à 1',
    colonnes: 'nombre de colonnes de la grille, entier au moins égal à 1'
  },
  'T10-X4': {
    scores: 'liste de valeurs positives associées à des bonus placés dans l’ordre sur une ligne ; deux positions voisines ne peuvent pas être choisies ensemble'
  },
  'T10-X5': {
    valeurs: 'liste ordonnée des niveaux d’énergie des bornes traversées par le robot ; un déplacement peut avancer de 1 ou 2 indices'
  }
});
