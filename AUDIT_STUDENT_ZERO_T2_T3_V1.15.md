# PYTHON//FORGE V1.15 — Student Zero Gate T2 → T3

## Objet

Cette passe audite la transition entre **T2 — Programmation objet** et **T3 — Types abstraits, piles & files**. Le risque majeur n’est pas la syntaxe Python mais le modèle mental : un élève qui vient d’apprendre les classes peut facilement croire qu’une pile « est une liste Python » ou qu’un type abstrait impose une représentation particulière.

## Références officielles

- Programme de Terminale NSI : structures de données, interface et implémentation ; listes, piles, files ; modes FIFO et LIFO ; choix d’une structure adaptée.
- Éduscol — *Types abstraits de données : implantations et propositions de mise en œuvre* : plusieurs implantations peuvent respecter une même interface ; le code client doit pouvoir rester inchangé alors que l’implantation évolue.
- Éduscol — ressources NSI : exemples d’implantations de files avec liste ou structure chaînée, et réinvestissement des notions par activités.

Références :
- https://www.education.gouv.fr/bo/19/Special8/MENE1921247A.htm
- https://eduscol.education.gouv.fr/sites/default/files/document/ra21lyceegtnsitypes-abstraits-mise-en-oeuvre-72540.pdf
- https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g

## Dette observée avant V1.15

T3 possédait déjà les mots *interface*, *implémentation*, *LIFO* et *FIFO*, mais plusieurs activités utilisaient directement des listes Python. Le risque était donc de produire le raccourci mental :

> pile = liste + append/pop

ou :

> file = liste + pop(0)

Ce raccourci suffit pour faire fonctionner un programme, mais il échoue à installer la notion informatique visée par le programme : **le type abstrait est défini par ses opérations et leur contrat ; l’implémentation est un choix séparé**.

## Décisions V1.15

### 1. Transition explicite depuis la POO

T2 apprend à construire des objets qui conservent un état. T3 réutilise ce savoir pour montrer qu’une classe peut également masquer une représentation derrière une interface stable.

### 2. Vocabulaire stabilisé

Le module distingue systématiquement :

- type abstrait ;
- interface ;
- implémentation ;
- pile / LIFO ;
- file / FIFO.

### 3. Pile et file définies par le comportement

Avant tout code Python, l’élève doit répondre à :

> Quel élément doit sortir maintenant ?

- dernier ajouté → pile / LIFO ;
- plus ancien encore présent → file / FIFO.

### 4. La liste Python redevient une implémentation

Les classes `Pile` et `File` peuvent utiliser une `list` en interne, mais les algorithmes clients doivent utiliser `empiler`, `depiler`, `est_vide` ou `enfiler`, `defiler`, `est_vide` dès que l’exercice vise l’abstraction.

### 5. Préconditions visibles

`depiler()` et `defiler()` supposent ici une structure non vide. Les exercices montrent explicitement le contrôle du vide et testent également le cas invalide.

### 6. Plusieurs implémentations d’une même interface

La file simple puis la file avec deux piles permettent de conserver la même règle FIFO avec deux représentations différentes. Le code utilisateur doit pouvoir continuer à raisonner avec l’interface.

## Exercices cœur

- `T3-E1` — implémenter l’interface minimale d’une pile ;
- `T3-E2` — résoudre le problème des parenthèses en utilisant uniquement l’interface de la pile ;
- `T3-E3` — implémenter une file FIFO avec deux piles et une précondition explicite.

## Entraînements

Les cinq entraînements couvrent :

1. compléter une pile ;
2. écrire une file simple ;
3. déboguer une file qui se comporte comme une pile ;
4. écrire un code client indépendant de l’implémentation ;
5. transférer vers une file à deux piles.

## PRIMM

Le PRIMM T3 demande de prédire un ordre de sortie uniquement à partir du contrat LIFO, puis de repérer que la fonction cliente `ordre_sortie` n’utilise jamais la représentation interne. La phase *Make* demande ensuite une file et un code client qui la vide par son interface.

## Garde-fous CI

Le script `scripts/validate-student-zero-t2t3.mjs` vérifie notamment :

- présence de la transition T2 → T3 ;
- distinction type abstrait / interface / implémentation ;
- présence explicite LIFO et FIFO ;
- pile Python ≠ simple assimilation à `list` ;
- usage de l’interface dans l’exercice parenthèses ;
- file avec deux piles ;
- diversité des entraînements ;
- PRIMM centré sur l’indépendance à l’implémentation ;
- vocabulaire novice complet.

## Invariant pédagogique

À l’issue de T3, un élève doit pouvoir expliquer cette phrase sans regarder du code :

> Une pile et une file sont définies d’abord par leurs opérations et leur ordre de sortie. Une liste Python n’est qu’une manière possible de les implémenter.
