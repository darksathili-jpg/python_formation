# PYTHON//FORGE V1.9 — Student Zero Gate P3/P4

## Objectif

Éprouver les modules P3 et P4 comme un élève de Première réellement novice, sans spécialité mathématiques et sans supposer que la conception de fonctions est déjà acquise.

Le point de vigilance principal est la transition cognitive entre deux tâches différentes :

1. raisonner sur une boucle dans un cadre fourni ;
2. construire ensuite une fonction complète avec une signature, des paramètres, un résultat, un contrat et des tests.

## Dette trouvée dans P3

P3 utilisait déjà des listes, des indices, `range(len(...))`, des fonctions et parfois des constructions de listes sans toujours distinguer ce qui relevait de la boucle de ce qui relevait d’une notion future. Cela augmentait la charge cognitive et rendait difficile l’identification de la compétence réellement travaillée.

### Corrections

- ajout d’un modèle mental explicite de `for` ;
- distinction compteur / accumulateur ;
- mini-outillage sur `len`, indices et `range(len(...))` limité au besoin du module ;
- explication du variant d’un `while` ;
- maintien explicite du cadre `def ... / return` jusqu’à la fin de P3 ;
- suppression d’un exercice de débogage qui imposait `append` et la construction d’une liste avant P6 ;
- transformation des trois exercices cœur en complétions guidées ;
- PRIMM P3 recentré sur une trace de boucle et une production sans fonction.

## Dette trouvée dans P4

P4 devait être le premier endroit où l’élève prend réellement en charge la définition d’une fonction, mais cette rupture n’était pas suffisamment matérialisée. Les notions `paramètre`, `argument`, `return`, `print`, précondition et test étaient présentes sans constituer une procédure complète de conception.

Certains entraînements introduisaient aussi des méthodes de chaînes (`isalpha`, `isalnum`) avant P5, ce qui créait un prérequis caché.

### Corrections

- P4 devient explicitement le point de retrait du cadre fourni ;
- progression : anatomie → paramètre/argument → return/print → contrat → tests → méthode complète ;
- méthode stable : `contrat → signature → corps → tests` ;
- premier exercice cœur réellement écrit depuis une page quasi vide ;
- exercices cœur 2 et 3 également produits en entier ;
- remplacement de l’entraînement utilisant `isalpha()` / `isalnum()` par un transfert sur une fonction `borner` avec précondition ;
- remplacement de l’entraînement de longueur de pseudo par un contrat numérique sans API de chaîne future ;
- PRIMM P4 terminé par une création complète depuis une page vide.

## Invariants Student Zero

### P3

- l’élève n’a pas à inventer une signature de fonction ;
- les boucles sont traçables tour par tour ;
- la terminaison d’un `while` est expliquée par une quantité qui évolue ;
- les indices sont introduits seulement quand la position est nécessaire ;
- aucune manipulation avancée de liste n’est exigée.

### P4

- l’élève sait distinguer paramètre et argument ;
- `return` et `print` ne sont jamais présentés comme équivalents ;
- le contrat est formulé avant le code ;
- la signature est désormais à produire ;
- au moins un cas nominal, un cas frontière et un cas invalide sont discutés lorsque pertinent ;
- aucun prérequis de spécialité mathématiques n’est supposé.

## Garde-fou CI

`scripts/validate-student-zero-p3p4.mjs` vérifie notamment :

- les contenus obligatoires des leçons P3/P4 ;
- la conservation du cadre fourni en P3 ;
- son retrait en P4 ;
- l’absence de méthodes de chaînes prématurées ;
- l’ordre pédagogique des entraînements ;
- le recalibrage PRIMM ;
- la présence de 3 exercices cœur et 5 entraînements par module.

Ce gate s’ajoute aux contrôles existants : solutions Python, Novice Learning, énoncés éditoriaux, contraste, Classroom Reliability et cache hors ligne.
