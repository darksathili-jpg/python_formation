# Audit Student Zero — T10 → T11 · V1.23

## Objet

Cette passe reconstruit la dernière transition algorithmique du parcours Terminale : **programmation dynamique → recherche textuelle**.

Le risque pédagogique principal était de conserver un même réflexe mental d’un chapitre à l’autre : « on évite du travail grâce à un dictionnaire ». Ce raccourci est faux. En T10, la mémoire conserve des **résultats de sous-problèmes**. En T11, le prétraitement conserve des **informations sur le motif** qui servent à justifier des décalages après un échec de comparaison.

## Cadre officiel retenu

Le programme de Terminale NSI demande d’**étudier l’algorithme de Boyer-Moore pour la recherche d’un motif dans un texte**. Il précise que **l’intérêt du prétraitement du motif est mis en avant** et que **l’étude du coût, difficile, ne peut être exigée**.

La ressource d’accompagnement Éduscol *L’algorithme de Boyer et Moore* présente notamment :

- la recherche naïve comme référence ;
- la comparaison du motif de droite vers la gauche ;
- la règle du mauvais caractère ;
- la règle du bon suffixe ;
- une version simplifiée programmable ;
- le dictionnaire `aDroite`, calculé une fois pour un motif donné ;
- l’intérêt de réutiliser ce prétraitement lors de plusieurs recherches avec le même motif.

La V1.23 suit ce cadre mais limite l’implémentation exigée à une version pédagogique transparente fondée sur le mauvais caractère. La règle du bon suffixe est identifiée et expliquée comme autre source d’information, sans être transformée en seconde recette obligatoire.

## Modèle mental imposé

La progression doit rendre explicite la chaîne suivante :

**texte → motif → alignement → comparaison naïve → comparaison depuis la droite → échec → mauvais caractère → prétraitement aDroite → décalage sûr → nouvel alignement**

Le déplacement n’est jamais présenté comme une formule magique. L’élève doit être capable de répondre à ces questions avant de coder :

1. Que représentent `i` et `j` ?
2. Pourquoi compare-t-on `motif[j]` avec `texte[i+j]` ?
3. Quel caractère a provoqué l’échec ?
4. Où ce caractère apparaît-il le plus à droite dans le motif ?
5. Pourquoi le déplacement choisi ne peut-il pas être inférieur à 1 ?
6. Quels alignements sont réellement sautés ?

## Exemple pivot

Le couple suivant sert de situation minimale :

```text
texte : XYZABCD
motif : ABCD
```

À `i = 0`, la comparaison commence à droite : `D` est comparé à `A`. L’échec apparaît pour `j = 3`. Dans le motif, `A` apparaît le plus à droite à l’indice `0`. Le déplacement est donc :

```text
max(1, 3 - 0) = 3
```

Le prochain alignement est directement `i = 3`. La recherche naïve aurait examiné `i = 0`, `1`, `2`, puis `3`. La version étudiée examine ici seulement `0` puis `3`. Cet exemple installe la notion de saut sans invoquer de formule de complexité.

## Contenu T11 reconstruit

### Cours

Le module couvre désormais explicitement :

- la différence conceptuelle T10/T11 ;
- le vocabulaire texte / motif / alignement ;
- la recherche naïve sans `find` ;
- la mesure par traces et comparaisons ;
- le parcours du motif de droite vers la gauche ;
- le prétraitement `aDroite` ;
- le calcul `max(1, j-k)` ;
- les trois cas du mauvais caractère : absent, présent à gauche, dernière occurrence à droite ;
- la version pédagogique de Boyer-Moore ;
- l’existence de la règle du bon suffixe ;
- la réutilisation du prétraitement ;
- la nécessité de justifier tout saut.

### Missions cœur

- **T11-E1** : première occurrence par recherche naïve, comparaison explicite `texte[i+j]` / `motif[j]` ;
- **T11-E2** : construction du dictionnaire `a_droite` ;
- **T11-E3** : recherche de droite vers la gauche avec saut sûr fondé sur le mauvais caractère.

### Entraînements

- **T11-X1** : compléter la relation entre `i`, `j`, texte et motif ;
- **T11-X2** : déboguer un déplacement susceptible d’être nul ou négatif ;
- **T11-X3** : rendre observable le premier échec lors d’une comparaison de droite vers la gauche ;
- **T11-X4** : tracer les alignements réellement visités ;
- **T11-X5** : réutiliser un `a_droite` déjà calculé, pour rendre visible l’intérêt du prétraitement.

### PRIMM

Le PRIMM fait d’abord prédire le mauvais caractère, sa dernière position et le déplacement sur `XYZABCD` / `ABCD`. L’élève doit ensuite construire le second alignement, tracer les positions réellement visitées et comparer cette trace à la recherche naïve.

### Passerelle novice

La passerelle novice fixe trois invariants :

- `i` est l’alignement dans le texte ;
- `j` est l’indice dans le motif ;
- `motif[j]` est comparé à `texte[i+j]`.

Elle interdit de commencer par la table de décalage tant que cette relation n’est pas comprise.

## Garde-fous

Le gate `scripts/validate-student-zero-t10t11.mjs` vérifie notamment :

- présence des notions texte, motif, alignement, recherche naïve, comparaison droite→gauche, prétraitement, mauvais caractère et bon suffixe ;
- distinction explicite avec la programmation dynamique ;
- vraie recherche naïve sans délégation à `find` ;
- dernière occurrence correctement mémorisée ;
- progression strictement positive des décalages ;
- exemple où les alignements 1 et 2 sont réellement sautés ;
- exercice qui reçoit un prétraitement déjà calculé ;
- absence de bibliothèque ou d’outil masquant le mécanisme ;
- rappel explicite que l’analyse détaillée du coût n’est pas exigée.

## Critère de validation pédagogique

Un élève peut considérer T11 comme compris s’il sait expliquer avec ses propres mots :

> « Je place le motif à une position `i`. Je compare depuis sa droite. Si un caractère diffère, je regarde où ce caractère apparaît le plus à droite dans le motif. Cette information peut me permettre d’avancer de plusieurs positions, mais je dois toujours pouvoir justifier que le saut ne risque pas de manquer une occurrence. Le dictionnaire est préparé à partir du motif avant la recherche et peut être réutilisé. »

Cette explication vaut davantage que la récitation d’une implémentation complète.
