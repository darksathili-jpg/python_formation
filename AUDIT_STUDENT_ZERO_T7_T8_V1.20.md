# PYTHON//FORGE — Audit Student Zero T7 → T8 — V1.20

## Risque pédagogique traité

La transition T7 → T8 fait changer de niveau d’abstraction. Après modularité, tests et débogage, l’élève doit distinguer deux objets d’apprentissage qui ne doivent pas être mélangés trop tôt :

1. **les paradigmes de programmation** : plusieurs manières d’organiser un calcul ;
2. **la calculabilité / décidabilité** : ce qu’un algorithme peut ou ne peut pas résoudre en principe.

Le risque principal était qu’un novice associe le paradigme fonctionnel à une syntaxe exotique (`lambda`, fonctions internes, composition compacte) avant d’avoir compris l’idée fondamentale : **une fonction peut être manipulée comme une valeur**.

## Références institutionnelles

Le programme de Terminale NSI demande :

- de distinguer sur des exemples les paradigmes impératif, fonctionnel et objet ;
- de choisir un paradigme selon le champ d’application ;
- de comprendre qu’un même langage et un même programme peuvent utiliser plusieurs paradigmes ;
- de comprendre qu’un programme est aussi une donnée ;
- de comprendre que la calculabilité ne dépend pas du langage de programmation utilisé ;
- de montrer, sans formalisme théorique, que le problème de l’arrêt est indécidable.

Ressources utilisées :

- Programme officiel Terminale NSI ;
- Éduscol — *Le paradigme fonctionnel* ;
- Éduscol — *Calculabilité et décidabilité*.

## Décisions de conception

### 1. Fonction comme valeur avant toute syntaxe compacte

Le parcours installe d’abord :

```python
def double(x):
    return x * 2

operation = double
```

puis seulement :

```python
operation(5)
```

Le contraste `f` / `f(x)` est explicite et récurrent.

`lambda` n’est jamais nécessaire pour réussir T8. Les activités cœur utilisent des fonctions nommées.

### 2. Paradigme ≠ langage

Le module montre qu’un même programme Python peut combiner :

- état mutable et boucles : style impératif ;
- objets regroupant état et opérations : style objet ;
- fonctions comme données et transformations : éléments de style fonctionnel.

L’élève n’a pas à classer tout programme dans une seule case.

### 3. Programme comme donnée par un mini-interpréteur

Au lieu d’utiliser `eval` ou `exec`, un mini-programme est représenté par une liste de tuples :

```python
[('AJOUTE', 3), ('MULTIPLIE', 2)]
```

Une fonction `execute` interprète cette donnée. Cette situation rend concrète la capacité attendue sans risque technique inutile.

### 4. Calculabilité et décidabilité séparées

Le parcours distingue :

- **calculabilité** : existence d’un algorithme produisant le résultat ;
- **problème de décision** : réponse oui/non ;
- **décidabilité** : existence d’un algorithme qui termine toujours et répond correctement ;
- **indécidabilité** : absence d’un tel décideur universel.

Le coût ou la lenteur ne sont jamais confondus avec la calculabilité.

### 5. Problème de l’arrêt sans faux oracle

Aucun exercice ne demande de programmer `arrete(programme, entree)`.

Le raisonnement pédagogique est celui de la contradiction intuitive : supposons un décideur parfait, construisons un programme qui fait l’inverse de sa prédiction sur lui-même, puis observons l’impossibilité.

Le module rappelle explicitement :

- un timeout ne prouve pas une non-terminaison ;
- certains programmes particuliers sont analysables ;
- l’impossibilité concerne un décideur universel pour tous les couples programme/entrée.

## Exercices cœur

### T8-E1 — Passer une fonction nommée comme donnée

But : comprendre `f` puis `f(x)`.

### T8-E2 — Filtrer avec un prédicat nommé

But : utiliser une fonction booléenne reçue en paramètre sans `filter` ni `lambda`.

### T8-E3 — Programme comme donnée

But : interpréter une petite liste d’instructions et distinguer représentation / exécution.

## Entraînements

Les cinq entraînements suivent la montée en abstraction :

1. compléter `f(x)` ;
2. rechercher avec un prédicat nommé ;
3. déboguer la confusion fonction / appel ;
4. appliquer un pipeline de fonctions nommées ;
5. interpréter et compter les instructions d’un programme-donnée.

## PRIMM

Le PRIMM T8 est centré sur la question : **quand la fonction est-elle réellement appelée ?**

L’élève prédit d’abord le comportement de :

```python
operation = double
print(applique(operation, 5))
```

avant de modifier la fonction transmise puis de construire `applique_liste` sans `lambda`.

## Garde-fous CI

`validate-student-zero-t7t8.mjs` bloque notamment :

- disparition des trois paradigmes attendus ;
- confusion paradigme / langage ;
- disparition du contraste `f` / `f(x)` ;
- `lambda` comme prérequis dans les codes visibles T8 ;
- `eval` ou `exec` pour illustrer le programme comme donnée ;
- disparition de la distinction calculabilité / décidabilité ;
- formulation du problème de l’arrêt comme simple difficulté pratique ;
- disparition de l’explication intuitive par contradiction ;
- régression du PRIMM ou de la passerelle novice.

## Critère de sortie V1.20

Un élève Student Zero doit pouvoir expliquer, sans vocabulaire universitaire superflu :

> « Python peut mélanger plusieurs styles. Le nom d’une fonction peut être une donnée ; l’appel se fait seulement avec les parenthèses. Un programme peut lui-même être représenté comme une donnée pour un interpréteur. Un problème décidable possède un algorithme qui termine toujours et répond correctement par oui/non. Le problème de savoir si n’importe quel programme s’arrêtera sur n’importe quelle entrée n’a pas de décideur universel. »
