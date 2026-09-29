# PYTHON//FORGE V1.10 — Student Zero Gate P5/P6

## Objectif

Éprouver P5 puis P6 comme un élève de Première NSI réellement novice, sans supposer de spécialité mathématiques et sans considérer qu’un nom de méthode ou une syntaxe compacte est déjà connue.

La transition étudiée est critique : **chaîne immuable → liste mutable**. Une mauvaise représentation mentale à cet endroit produit ensuite des erreurs durables sur les indices, les effets de bord, les alias, les copies et les tableaux de tableaux.

## Dettes détectées dans P5

1. L’immutabilité était mentionnée, mais pas suffisamment opposée à l’indexation : un novice pouvait retenir « on accède avec des crochets » sans comprendre pourquoi `texte[i] = ...` est interdit.
2. Le choix entre parcours direct `for c in texte` et parcours par indices n’était pas assez explicité.
3. Plusieurs exercices utilisaient des indices symétriques sans installer d’abord la règle `dernier indice = len(texte) - 1`.
4. `upper()` apparaissait dans un entraînement sans être présenté comme un outil local explicite.
5. Un exercice utilisait un paramètre par défaut (`caractere='*'`) alors que ce mécanisme n’était pas un objectif de P5.
6. Les slices devaient rester non exigibles ; le module doit donc fournir des stratégies d’indexation qui n’en dépendent pas.

## Corrections P5

- construction d’un modèle mental explicite : longueur, premier indice, dernier indice, chaîne vide ;
- distinction ferme entre **lire** `texte[i]` et **modifier** `texte[i]` ;
- transformation présentée comme construction d’une nouvelle chaîne ;
- règle de choix : parcours direct si la position ne sert pas, indices si voisinage/symétrie ;
- palindrome recalibré en complétion guidée ;
- exercice de miroir explicitant `len(texte)-1-i` ;
- `upper()` documenté dans l’énoncé où il apparaît ;
- suppression du paramètre par défaut dans l’exercice de masquage ;
- aucun slice nécessaire dans les solutions P5.

## Dettes détectées dans P6

1. La différence chaîne/liste n’était pas matérialisée suffisamment tôt.
2. `append`, affectation par indice, alias et copie arrivaient vite, sans modèle unifié de « noms qui désignent des objets ».
3. Une compréhension de liste combinait déjà compréhension + expression conditionnelle, ce qui augmentait inutilement la charge cognitive.
4. La copie indépendante était bien évoquée mais la distinction `copie = source` / `copie = list(source)` devait être rendue centrale.
5. Le tableau 2D arrivait avec une solution compacte en compréhension alors que le double indice est déjà une difficulté nouvelle.

## Corrections P6

- première leçon explicitement consacrée à la transition P5 → P6 ;
- mutation par indice et `append` distingués ;
- alias présenté comme « deux noms → un seul objet liste » ;
- copie indépendante introduite avec `list(source)` avant les exercices de transfert ;
- note sur la limite d’une copie superficielle pour les listes imbriquées, sans en faire un prérequis ;
- compréhension enseignée comme version compacte d’une boucle avec `append`, jamais comme formule à mémoriser ;
- P6-E1 conserve une compréhension simple, car cette syntaxe fait partie de l’objectif ;
- P6-X2 revient volontairement à une boucle explicite au lieu de cumuler compréhension + expression conditionnelle ;
- P6-E3 utilise une boucle explicite et `append` pour concentrer l’attention sur `m[i][i]` ;
- ordre des entraînements recalibré : construction simple → alias/copie → transformation → transfert → grille 2D.

## PRIMM

### P5

Le Make demande désormais de créer une nouvelle chaîne en supprimant un caractère donné, uniquement avec boucle, condition et concaténation. Le but est de vérifier que l’élève a compris l’immutabilité et ne recherche pas une méthode magique.

### P6

Le Make demande une fonction `ajoute_sans_modifier(tab, valeur)` qui :

1. crée une copie avec `list(tab)` ;
2. modifie uniquement la copie ;
3. renvoie la copie ;
4. teste que la liste d’origine reste inchangée.

Le transfert porte donc explicitement sur les effets de bord.

## Invariants V1.10

Le gate automatique doit refuser toute régression si :

- P5 perd l’explication de l’immutabilité ;
- une solution P5 requiert une slice ;
- P5 réintroduit un paramètre par défaut caché dans l’exercice de masquage ;
- P6 perd la distinction alias/copie ;
- la compréhension simple de P6-E1 disparaît ;
- P6-X2 redevient une compréhension conditionnelle compacte ;
- P6-E3 masque le double indice derrière une compréhension ;
- l’ordre pédagogique des entraînements P5/P6 change sans réévaluation.

## Résultat attendu du parcours

À la fin de P6, un élève doit pouvoir expliquer oralement :

- pourquoi `texte[0] = 'A'` est interdit alors que `tab[0] = 10` est autorisé ;
- pourquoi `b = a` ne crée pas une copie d’une liste ;
- pourquoi `list(a)` permet de préserver la liste extérieure d’origine dans les cas simples ;
- comment passer d’une boucle `append` à une compréhension simple ;
- comment lire `m[i][j]` comme « ligne i, puis colonne j » ;
- pourquoi aucune slice n’est nécessaire pour réussir le parcours de Première.
