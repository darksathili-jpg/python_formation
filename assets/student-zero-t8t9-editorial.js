import { editorialOverrides } from './editorial-overrides.js';

// V1.21 — explicit editorial contracts for the redesigned T9 sequence.
// These keep the global statement gate strict instead of falling back to generic prose.
Object.assign(editorialOverrides.RESULT_OVERRIDES, {
  'T9-E1': 'fusion(a, b) doit renvoyer une nouvelle liste triée contenant exactement tous les éléments des deux listes déjà triées a et b, sans modifier les deux listes reçues.',
  'T9-E2': 'tri_fusion(tab) doit renvoyer une nouvelle liste contenant les mêmes éléments que tab dans l’ordre croissant. Les listes vide et à un élément sont des cas de base et tab doit rester inchangée.',
  'T9-E3': 'niveaux_moitie(n) doit renvoyer le nombre entier de divisions successives par 2 nécessaires pour rendre n inférieur ou égal à 1 : 1 donne 0, 8 donne 3 et 1024 donne 10.',
  'T9-X1': 'fusion(a, b) doit produire une nouvelle liste triée contenant tous les scores des deux listes déjà triées, y compris les éléments restant lorsque l’une des deux listes est épuisée.',
  'T9-X2': 'Après correction, tri_fusion(tab) doit terminer aussi pour la liste vide : toute liste de taille 0 ou 1 est renvoyée immédiatement comme cas de base.',
  'T9-X3': 'tailles_moitie(n) doit renvoyer toutes les tailles successives depuis n jusqu’à 1 inclus en utilisant la division entière par 2 ; ainsi 8 produit [8, 4, 2, 1].',
  'T9-X4': 'compte_div(tab, x) doit renvoyer le nombre exact d’occurrences de x dans tab en traitant récursivement les deux moitiés ; une liste vide renvoie 0.',
  'T9-X5': 'dicho_rec(tab, x, g, d) doit renvoyer True si x apparaît dans la liste triée tab et False sinon, en ne poursuivant qu’une seule moitié après chaque comparaison au milieu.'
});

Object.assign(editorialOverrides.PARAM_OVERRIDES, {
  'T9-E3': {
    n: 'taille entière positive dont on compte les divisions successives par 2 avant d’atteindre une valeur inférieure ou égale à 1'
  },
  'T9-X3': {
    n: 'taille entière positive à partir de laquelle construire la suite des tailles obtenues par divisions entières successives par 2'
  },
  'T9-X4': {
    tab: 'liste dans laquelle toutes les occurrences de la valeur x doivent être comptées en traitant récursivement les deux moitiés',
    x: 'valeur dont on veut compter le nombre d’occurrences dans l’ensemble de la liste tab'
  },
  'T9-X5': {
    tab: 'liste triée par ordre croissant dans laquelle la recherche dichotomique récursive est effectuée',
    x: 'valeur recherchée dans la liste triée tab',
    g: 'indice gauche inclus de la zone de recherche encore possible',
    d: 'indice droit inclus de la zone de recherche encore possible ; None déclenche son initialisation au dernier indice'
  }
});
