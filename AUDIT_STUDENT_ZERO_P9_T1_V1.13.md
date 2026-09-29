# PYTHON//FORGE V1.13 — Student Zero Gate P9 → T1

## Objet

Cette passe audite la rupture pédagogique entre la fin de Première (`P9 — Algorithmes classiques`) et l’entrée en Terminale (`T1 — Récursivité`). Le risque principal n’est pas syntaxique : un élève peut savoir écrire une fonction et une boucle tout en possédant un modèle mental faux de la récursion.

## Références de cadrage

- Programme officiel de Terminale NSI : la récursivité fait partie des contenus ; les capacités attendues sont **écrire un programme récursif** et **analyser le fonctionnement d’un programme récursif**. Le programme recommande des exemples de domaines variés.
- Ressource Éduscol « Récursivité » : comparaison itératif/récursif, représentation des appels, calcul « à rebours », rôle indispensable des cas de base, exemples sur entiers, listes, chaînes et structures, limites de la récursivité, choix entre solutions récursives et itératives.
- Éduscol précise également que la récursivité terminale n’est pas une notion exigible du programme NSI.

Références :
- https://www.education.gouv.fr/sites/default/files/document/Programme%20de%20num%C3%A9rique%20et%20sciences%20informatiques%20de%20terminale%20g%C3%A9n%C3%A9rale-248211.pdf
- https://eduscol.education.gouv.fr/sites/default/files/document/ra21lyceegtnsirecursivite-72537.pdf

## Dette observée avant V1.13

Le module T1 possédait déjà les mots « cas de base », « appel récursif » et « pile d’appels », mais il restait trop compact pour un Student Zero :

1. le lien avec le variant de boucle étudié en Première n’était pas assez construit ;
2. la différence entre **un état modifié dans une boucle** et **plusieurs appels possédant chacun leurs paramètres** restait implicite ;
3. descente et remontée étaient évoquées sans protocole de trace systématique ;
4. l’exercice `T1-E2` utilisait un paramètre par défaut `i=0`, ajoutant un détail de langage inutile au moment où l’on veut comprendre la récursion ;
5. la puissance rapide arrivait trop tôt dans les exercices cœur ;
6. l’analyse des séquences sans slice devait être rendue plus explicite ;
7. les limites pratiques (`RecursionError`) et le choix raisonné récursif/itératif méritaient une leçon dédiée.

## Décisions V1.13

### 1. Construire une vraie passerelle P9 → T1

Le variant de boucle devient le point d’appui : en itération, une variable évolue vers l’arrêt ; en récursion, une **mesure de progression** doit rapprocher chaque nouvel appel d’un cas de base.

### 2. Utiliser la règle « base → progrès → combinaison »

Avant tout code récursif, l’élève doit répondre à trois questions :

1. Quel est le cas que je sais résoudre directement ?
2. Quelle quantité prouve que l’appel suivant est plus proche de ce cas ?
3. Comment le résultat du sous-problème permet-il de construire le résultat courant ?

### 3. Séparer explicitement descente et remontée

Le cours représente les appels en attente et la remontée des valeurs. Le PRIMM T1 rend ces deux phases visibles par des affichages `descente` puis `remontee`.

### 4. Ne pas cacher l’état dans des slices

Les exercices récursifs sur listes et chaînes utilisent des indices explicites. Les slices ne sont pas nécessaires pour réussir T1. Le gate CI refuse leur réapparition dans les codes d’apprentissage et les solutions du module.

### 5. Recalibrer les exercices cœur

- `T1-E1` : somme récursive guidée — un seul paramètre, base/progrès/combinaison visibles ;
- `T1-E2` : comptage dans une liste à partir d’un indice explicite ;
- `T1-E3` : palindrome par rapprochement de deux indices, sans slice.

La puissance rapide devient un exercice de transfert. Sa règle est fournie afin de ne pas créer un prérequis implicite de spécialité mathématiques.

### 6. Préparer les futures structures récursives

L’entraînement sur une arborescence de dossiers est conservé en transfert : il prépare naturellement les arbres de Terminale sans exiger encore leur vocabulaire formel.

### 7. Enseigner aussi quand ne pas utiliser la récursion

Le module rappelle qu’une solution récursive n’est pas automatiquement supérieure à une solution itérative. La clarté du modèle du problème doit guider le choix. La profondeur d’appels de Python est finie et une mauvaise progression peut provoquer `RecursionError`.

## Invariants CI ajoutés

`scripts/validate-student-zero-p9t1.mjs` refuse notamment :

- l’absence de la transition P9 → T1 ;
- l’absence d’un enseignement explicite de la pile d’appels, de la descente et de la remontée ;
- un slice dans les codes d’apprentissage T1 ;
- un paramètre par défaut cachant l’indice initial dans `T1-E2` ;
- une progression incorrecte des exercices cœur ;
- la disparition de la comparaison itération/récursion ;
- une puissance rapide qui recalculerait deux fois le même sous-problème pair ;
- plus ou moins de trois micro-questions dans la passerelle novice T1.

## Critère de réussite Student Zero

Un élève doit pouvoir, sans spécialité mathématiques :

1. identifier le cas de base d’une fonction récursive ;
2. nommer la mesure qui progresse ;
3. écrire les appels de la descente ;
4. dire quels appels restent en attente ;
5. reconstruire la remontée dans le bon ordre ;
6. corriger un appel qui s’éloigne du cas de base ;
7. écrire une récursion simple sur un entier puis sur une séquence par indices ;
8. expliquer pourquoi une boucle serait parfois plus simple ;
9. réussir un transfert vers une structure hiérarchique.
