# Audit Student Zero — P7 → P8 — V1.11

## Objet

Cette passe contrôle la transition entre **P7 — Tuples & dictionnaires** et **P8 — Données tabulaires & CSV** du point de vue d’un élève de Première NSI qui ne possède aucun modèle mental implicite de ces structures.

Le risque principal n’est pas syntaxique : il est conceptuel. Un élève peut facilement confondre **indice**, **clé**, **valeur**, **ligne**, **colonne**, **table**, **fichier CSV** et **type Python réellement obtenu après lecture**. Une syntaxe compacte peut masquer ces confusions au lieu de les corriger.

## Référence programme

Le programme officiel de Première NSI demande notamment :

- de construire une entrée de dictionnaire et d’itérer sur ses éléments ;
- d’utiliser `keys()`, `values()` et `items()` ;
- d’importer une table depuis un fichier texte tabulé ou CSV ;
- de rechercher les lignes vérifiant un critère ;
- de trier une table suivant une colonne ;
- de fusionner deux tables ;
- d’aborder les doublons, la cohérence et les domaines de valeurs.

Références :

- BO spécial n°1 du 22 janvier 2019 — Programme NSI Première : https://www.education.gouv.fr/bo/19/Special1/MENE1901633A.htm
- Éduscol — programmes et ressources NSI : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g

## Défauts identifiés avant V1.11

### P7

1. La différence entre **liste**, **tuple** et **dictionnaire** était trop rapidement résumée.
2. Le mot **clé** apparaissait sans verrouiller suffisamment la différence entre une clé et un indice.
3. `items()` était utilisé rapidement sans expliquer ce qui est fourni à chaque tour.
4. La mutabilité des dictionnaires n’était pas reliée explicitement à la notion d’effet de bord étudiée en P6.
5. `P7-E3` utilisait `None` comme sentinelle sans que cette décision soit nécessaire au concept visé.
6. `P7-X3` modifiait le dictionnaire reçu, mais l’effet de bord n’était pas suffisamment annoncé comme partie du contrat.
7. Le passage vers la représentation d’une ligne tabulaire n’était pas préparé explicitement.

### P8

1. La table était introduite directement comme une liste de dictionnaires sans construire assez explicitement les deux niveaux d’accès : `table[i]` puis `ligne[cle]`.
2. Le premier exemple de filtrage utilisait immédiatement une compréhension de liste.
3. L’import CSV était évoqué, mais la mécanique et surtout le **type des valeurs après lecture** n’étaient pas assez séparés.
4. Le site ne faisait pas pratiquer directement un import CSV dans la banque d’exercices.
5. Le tri annoncé dans les objectifs n’était pas réellement travaillé dans les missions principales ou la banque P8.
6. Une solution naturelle avec `lambda` aurait introduit une syntaxe inutilement avancée pour un novice.
7. La cohérence, les doublons et le domaine de valeurs étaient absents du parcours explicite.

## Décisions pédagogiques V1.11

### P7 — ordre conceptuel

1. **Choisir la structure** : liste / tuple / dictionnaire.
2. **Clé ≠ indice**.
3. Tester l’existence d’une **clé** avec `in`.
4. Parcourir `keys()`, `values()` et `items()`.
5. Rendre explicite la **mutabilité** d’un dictionnaire et les effets de bord.
6. Présenter un dictionnaire comme représentation naturelle d’une **ligne de données** afin de préparer P8.

Le PRIMM P7 ne commence plus par un dictionnaire de fréquences : il travaille d’abord la construction, la lecture et la mise à jour d’entrées.

### P8 — ordre conceptuel

1. **Une table = une liste de lignes** ; **une ligne = un dictionnaire** dans le modèle retenu ici.
2. Distinguer **recherche d’une première ligne** et **filtrage de plusieurs lignes**.
3. Introduire `csv.DictReader` comme mécanisme fourni et observable.
4. Verrouiller le point critique : après lecture CSV, les champs sont d’abord des **chaînes de caractères**.
5. Introduire le tri avec `sorted(..., key=fonction_nommee)` sans `lambda`.
6. Construire une fusion explicite sur une clé commune avec deux boucles imbriquées.
7. Introduire les contrôles de cohérence et les doublons.

## Exercices recalibrés

### P7

- `P7-E1` : tuple ordonné et rôle des positions.
- `P7-E2` : construction explicite d’un dictionnaire de fréquences.
- `P7-E3` : parcours `items()` sans sentinelle `None` inutile.
- `P7-X3` : effet de bord annoncé et testé.
- `P7-X4` : inversion d’un dictionnaire par `items()`.

### P8

- `P8-E1` : filtrage par boucle explicite avant toute compréhension.
- `P8-E2` : recherche d’une première ligne par identifiant.
- `P8-E3` : fusion explicite sur `id`.
- `P8-X1` : import CSV guidé et exécutable dans le navigateur via `StringIO`.
- `P8-X3` : correction d’un bug de type après CSV avec `int(...)`.
- `P8-X4` : tri suivant une colonne avec une fonction de clé nommée, sans `lambda`.
- `P8-X5` : fusion de deux tables sur un identifiant commun.

## Garde-fous automatisés

Le script `scripts/validate-student-zero-p7p8.mjs` vérifie notamment :

- la présence des distinctions liste / tuple / dictionnaire ;
- la différence clé / indice ;
- l’usage explicite de `items()` ;
- l’annonce des effets de bord ;
- la représentation ligne / table ;
- la présence d’un import `csv.DictReader` guidé ;
- la conversion numérique après CSV ;
- le filtrage explicite avant compréhension ;
- le tri par fonction nommée sans `lambda` dans les solutions ;
- la fusion sur une clé `id` ;
- l’ordre pédagogique des cinq entraînements P7 et P8 ;
- le recalibrage des passerelles novice et des PRIMM.

Ce gate s’ajoute aux validations existantes : solutions Python, intégrité de contenu, gate éditorial, contraste, accessibilité et fiabilité du moteur Python.
