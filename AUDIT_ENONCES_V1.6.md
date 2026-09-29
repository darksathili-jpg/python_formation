# PYTHON//FORGE V1.6 — Audit des énoncés et standard de rédaction

## Défaut traité

L’audit V1.5 a mis en évidence une dette pédagogique transversale : de nombreux exercices étaient techniquement testables mais leur consigne courte supposait que l’élève déduise une partie du travail à partir du nom de la fonction, du squelette de code ou des tests. Pour un novice, cela ajoute une charge cognitive qui ne correspond pas à la compétence informatique visée.

## Principe directeur

Un exercice ne doit jamais exiger de « deviner ce que le professeur attend ». L’élève doit pouvoir distinguer explicitement :

1. le problème à résoudre ;
2. les entrées disponibles ;
3. le résultat attendu ;
4. les contraintes à respecter ;
5. les cas de validation importants ;
6. ce qu’il faut comprendre avant de coder ;
7. les critères permettant d’estimer que le travail est réellement réussi.

La difficulté doit provenir du raisonnement algorithmique et de la programmation, pas de l’implicite de l’énoncé.

## Standard V1.6

Chaque exercice cœur, exercice d’entraînement et application intégrative reçoit désormais un **énoncé détaillé structuré** contenant :

- **Mission** : formulation du but en français ;
- **Nature de l’activité** : compléter, déboguer, écrire, transférer ou construire une application ;
- **Contrat du programme** : fonction/classe attendue, paramètres fournis et rôle des entrées ;
- **Résultat attendu** : rappel explicite de ce que le programme doit produire ;
- **Contraintes** : interdictions, cas frontières et règles imposées repérées dans la consigne ;
- **Avant de coder** : quatre étapes de reformulation et de planification ;
- **Cas vérifiés** : exemples lisibles issus des tests de validation ;
- **Critères de réussite** : compréhension, respect du contrat, tests et justification.

## Adaptation au niveau NSI

Le guidage dépend du module. Par exemple :

- boucle : identifier ce qui varie et pourquoi la boucle termine ;
- récursivité : cas de base et quantité qui diminue ;
- graphe : sommets, voisins et ensemble des visités ;
- programmation dynamique : signification exacte de l’état mémorisé ;
- SQL : tables, colonnes, filtre et paramètres ;
- recherche dichotomique : précondition de tri et réduction de l’intervalle.

Cette couche ne donne pas l’algorithme solution : elle rend le problème explicite et donne une méthode de lecture.

## Élèves sans spécialité mathématiques

Le standard interdit de déplacer la difficulté vers un prérequis mathématique caché. Si une formule extérieure au cœur informatique est nécessaire, elle doit être fournie dans la mission. L’élève est évalué sur sa capacité à modéliser, programmer, tester et expliquer.

## Références pédagogiques utilisées

- Programmes et ressources NSI, Éduscol : cadrage disciplinaire et ressources officielles.
- Nouvelle partie pratique NSI à compter de la session 2027 : programmation d’une application à partir d’un document fourni, avec dialogue et justification.
- PRIMM (Predict, Run, Investigate, Modify, Make) : progression de la compréhension du code vers la création autonome ; importance de lire, expliquer et prédire avant d’écrire.
- France-IOI : référence de progression par problèmes nombreux et gradués, avec aides disponibles pour éviter les blocages prolongés.

Les énoncés de PYTHON//FORGE restent originaux ; les ressources externes servent de références de conception pédagogique et non de banque à copier.

## Garde-fou CI

`scripts/validate-statements.mjs` vérifie automatiquement la couverture des 164 activités programmées et impose pour chacune :

- une mission non vide ;
- un guidage avant codage ;
- une question de contrôle conceptuel ;
- au moins un cas de validation explicité ;
- le contrat du programme ;
- les critères de réussite.

Une future modification qui retire cette structure doit faire échouer le Quality Gate.
