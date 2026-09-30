# PYTHON//FORGE V1.19 — Student Zero Gate T6 → T7

## Objectif

Éprouver la transition **bases de données → modularité, tests et mise au point** du point de vue d’un élève de Terminale NSI qui sait déjà écrire des fonctions et exécuter des requêtes simples, mais ne possède encore aucune méthode systématique pour organiser ou déboguer un programme.

Le risque identifié était double :

1. réduire la modularité à « mettre du code dans plusieurs fichiers » ;
2. réduire la mise au point à « modifier jusqu’à ce que les tests deviennent verts ».

La V1.19 construit au contraire le modèle mental :

**contrat → responsabilité → API → cas de test → observation → hypothèse → correction ciblée → test de régression**.

## Références de cadrage

Le programme de Terminale NSI place dans « Langages et programmation » la **modularité** ainsi que la **mise au point des programmes et gestion des bugs**.

Éduscol propose dans les ressources de Terminale trois documents directement liés à cette passe :

- *Modularité et API* ;
- *Écriture de tests* ;
- *Mise au point des programmes, gestion des bugs*.

Page officielle : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g

Le cadrage de PYTHON//FORGE reste volontairement au niveau lycée : aucun framework professionnel de test n’est exigé, aucune architecture logicielle lourde n’est introduite, et la notion d’API reste limitée à une interface explicite et stable entre parties d’un programme.

## Dette pédagogique trouvée

Avant V1.19, T7 contenait déjà de bons micro-problèmes de débogage, mais l’enchaînement ne construisait pas assez explicitement :

- la différence entre **programme qui marche sur un exemple** et **programme respectant un contrat** ;
- la notion de **responsabilité** ;
- la notion d’**API** comme interface stable ;
- la différence entre test nominal et test discriminant ;
- la valeur d’un **test de régression** ;
- une procédure de mise au point reproductible ;
- la distinction entre erreur de syntaxe, erreur à l’exécution et erreur logique ;
- l’instrumentation temporaire pour tester une hypothèse.

Le PRIMM T7 était centré sur un bug d’alias, utile mais insuffisant pour apprendre une démarche générale de diagnostic.

## Décisions V1.19

### 1. Construire le lien T6 → T7

Une requête SQL correcte peut être intégrée dans une fonction qui valide, exécute, transforme et affiche tout à la fois. T7 montre pourquoi séparer ces responsabilités facilite le test et la correction.

### 2. Définir l’API sans cours de génie logiciel

Une API est présentée comme l’ensemble des noms publics, signatures et comportements promis par un module. L’élève doit comprendre qu’une implémentation interne peut changer sans casser les utilisateurs si le contrat public reste stable.

### 3. Donner un vocabulaire minimal de test

Le module installe seulement ce qui est directement utile :

- cas nominal ;
- cas frontière ;
- cas invalide lorsque le contrat le prévoit ;
- cas discriminant ;
- test de régression.

Les `assert` et le moteur de tests de PYTHON//FORGE suffisent. `pytest`, mocks et autres frameworks ne sont pas des prérequis élèves.

### 4. Installer une méthode de mise au point

L’élève apprend à :

1. reproduire avec le plus petit cas possible ;
2. comparer attendu et obtenu ;
3. formuler une hypothèse ;
4. instrumenter si nécessaire ;
5. corriger une seule cause ;
6. conserver le cas révélateur comme test de régression.

### 5. Transformer les exercices en preuves du modèle mental

- `T7-E1` : résultat correct **et** absence d’effet de bord ;
- `T7-E2` : frontières 0 et 9 ;
- `T7-E3` : égalité comme cas discriminant pour « strictement croissante » ;
- `T7-X3` : ancien bug matérialisé par un test de régression ;
- `T7-X4` : deux causes indépendantes, isolées par deux cas différents ;
- `T7-X5` : contrat d’API et cas frontière 1000.

### 6. Refaire le PRIMM

Le nouveau PRIMM part d’une fonction qui accepte `0` alors que le contrat exige une valeur strictement négative. L’élève doit produire un petit contre-exemple, classifier le défaut comme logique, formuler l’hypothèse sur `<=`, corriger une seule ligne et proposer le test de régression `[0]`.

## Invariants protégés par la CI

Le gate V1.19 refuse notamment :

- la disparition des notions responsabilité / API / régression / instrumentation ;
- un rappel insuffisant sur les limites d’un jeu de tests ;
- un T7-E1 qui ne vérifie plus l’absence d’effet de bord ;
- un T7-E2 qui ne teste plus les deux frontières ;
- un T7-E3 qui oublie l’égalité ;
- un PRIMM sans petit cas, hypothèse et test de régression ;
- l’introduction de `pytest` ou de mocks comme prérequis dans les codes élèves ;
- la disparition de la passerelle novice V1.19.

## Critère de sortie

Un élève sortant de T7 doit être capable d’expliquer et d’appliquer la boucle suivante :

**je fixe le contrat → je reproduis le défaut → je réduis le cas → j’observe → je formule une hypothèse → je corrige une cause → je conserve le cas comme test**.

Il n’est pas attendu qu’il maîtrise un framework industriel, une architecture multicouche ou des techniques formelles de vérification logicielle.
