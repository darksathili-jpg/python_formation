# AUDIT STUDENT ZERO — T5 → T6 — V1.18

## Objet

Éprouver la transition **graphes → modèle relationnel et SQL** avec le regard d’un élève de Terminale qui connaît les notions précédentes mais découvre les bases de données relationnelles.

## Dette pédagogique observée avant V1.18

Le module T6 savait déjà faire écrire des requêtes `SELECT`, `JOIN` et des requêtes paramétrées, mais le passage au **modèle relationnel** était trop rapide. Un élève pouvait réussir en recopiant des fragments SQL sans avoir construit les distinctions suivantes :

- graphe ≠ base relationnelle ;
- relation ≠ liste de dictionnaires Python ;
- relation ≠ feuille de calcul ;
- tuple relationnel ≠ objet Python `tuple` ;
- clé primaire ≠ « première colonne » ;
- clé étrangère ≠ simple arête de graphe ;
- jointure ≠ rapprochement de lignes par position ;
- requête SQL ≠ chaîne fabriquée avec les données de l’utilisateur.

## Références de cadrage

La passe V1.18 s’aligne sur le programme de Terminale NSI et les ressources Éduscol relatives aux bases de données : modèle relationnel, relation, attribut, domaine, clé primaire, clé étrangère, schéma relationnel, bases relationnelles et langage SQL d’interrogation / mise à jour.

Le périmètre reste volontairement NSI : il ne dérive pas vers la théorie complète de la normalisation ni vers l’administration d’un SGBD.

## Modèle mental imposé

La progression devient :

1. partir des liens du graphe de T5 ;
2. montrer qu’une base relationnelle n’est pas un graphe sérialisé ;
3. installer relation, schéma, attribut, domaine et tuple ;
4. construire le rôle de la clé primaire ;
5. construire le rôle de la clé étrangère et l’intégrité référentielle ;
6. lire une base comme plusieurs relations liées ;
7. seulement ensuite écrire `SELECT / FROM / WHERE` ;
8. relier deux relations avec `JOIN ... ON` en suivant FK → PK ;
9. distinguer interrogation et mise à jour (`INSERT / UPDATE / DELETE`) ;
10. relier Python et SQL avec des paramètres transmis séparément.

## Exercices cœur

### T6-E1 — SELECT / WHERE

Le schéma est fourni avant la requête. L’élève doit verbaliser projection, relation interrogée et condition.

### T6-E2 — JOIN

Les deux schémas et les rôles des clés sont explicités. La condition `ON` est interprétée comme une égalité entre clé étrangère et clé primaire, pas comme une recette syntaxique.

### T6-E3 — Python + SQL

Le curseur, la valeur recherchée, le marqueur `?`, le tuple `(identifiant,)` et `fetchone()` sont décrits. La concaténation d’une donnée utilisateur dans la chaîne SQL est explicitement refusée.

## Entraînements

Les cinq entraînements couvrent :

- projection d’attributs utiles ;
- filtre avec paramètre futur ;
- débogage d’une concaténation SQL ;
- jointure sur clé étrangère ;
- `UPDATE` ciblé et danger d’une mise à jour sans `WHERE`.

## PRIMM

Le PRIMM T6 exécute une petite base SQLite en mémoire. L’élève doit prédire le résultat d’une jointure en suivant les valeurs de clés. L’ordre physique des lignes est volontairement dissocié du raisonnement : la liaison dépend des valeurs `eleve.groupe_id = groupe.id`.

## Passerelle novice

La passerelle insiste sur trois niveaux à ne pas confondre :

- **modèle relationnel** : schéma, relation, attribut, tuple, clés ;
- **SQL** : langage pour interroger / modifier ;
- **Python** : langage hôte qui peut envoyer des requêtes et recevoir des résultats.

## Garde-fous automatisés

`scripts/validate-student-zero-t5t6.mjs` refuse notamment :

- la disparition de la distinction graphe / relation ;
- l’absence des notions de schéma, domaine, tuple, clé primaire ou étrangère ;
- une jointure sans explication FK → PK ;
- une requête paramétrée remplacée par de la concaténation ;
- la généralisation de `SELECT *` dans les solutions d’apprentissage ;
- un `UPDATE` pédagogique qui ne rappelle pas le rôle de `WHERE` ;
- une passerelle novice qui assimilerait une relation à une liste Python.

## Invariant V1.18

Un élève ne doit pas pouvoir « réussir T6 en recopiant du SQL » tout en étant incapable d’expliquer :

- ce qu’est une relation ;
- ce qu’un schéma décrit ;
- pourquoi une clé primaire identifie une ligne ;
- ce qu’une clé étrangère référence ;
- pourquoi une jointure compare deux attributs précis ;
- pourquoi une donnée utilisateur doit être transmise séparément de la chaîne SQL.
