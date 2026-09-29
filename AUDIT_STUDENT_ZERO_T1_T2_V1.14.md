# PYTHON//FORGE V1.14 — Student Zero Gate T1 → T2

## Objet

Cette passe audite la transition entre `T1 — Récursivité` et `T2 — Programmation objet`. Le risque principal est un changement brutal de modèle mental : l’élève quitte un raisonnement centré sur des fonctions et des appels pour manipuler des entités qui possèdent un état persistant et des opérations associées.

## Cadrage officiel

Le programme et les ressources Éduscol de Terminale NSI retiennent le vocabulaire de la programmation objet : **classes, attributs, méthodes, objets**.

La ressource officielle Éduscol « Vocabulaire de la programmation objet » précise notamment :

- une instance est un objet créé à partir d’une classe ;
- `__init__` permet d’initialiser les attributs du nouvel objet ;
- dans une méthode, le premier paramètre nommé `self` par convention représente l’objet sur lequel la méthode est appliquée ;
- les élèves ont déjà rencontré en Première des usages objet, par exemple `liste.append(...)` ;
- héritage et polymorphisme ne sont pas à aborder dans le cœur du programme ;
- les mécanismes complexes d’encapsulation ou les méthodes spéciales ne sont pas nécessaires à la présentation de base.

Références :

- Programme et ressources NSI : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g
- Ressource Éduscol « Vocabulaire de la programmation objet » : https://eduscol.education.fr/document/7319/download

## Dette observée avant V1.14

Le module T2 disposait déjà d’exemples corrects, mais le Student Zero pouvait encore construire plusieurs modèles faux :

1. **classe = objet** : la distinction existait dans le vocabulaire sans être assez matérialisée par deux instances différentes ;
2. **self = la classe** : le rôle de `self` était formulé, mais peu tracé appel par appel ;
3. **paramètre = attribut** : `x` et `self.x` pouvaient sembler interchangeables ;
4. **variable locale = état persistant** : la différence n’était pas suffisamment exercée ;
5. **méthode = fonction décorée** : l’effet sur l’état d’un objet précis n’était pas assez isolé ;
6. **état partagé** : un entraînement faisait intervenir un attribut de classe partagé, notion inutilement avancée pour le cœur NSI ;
7. **POO = héritage** : même si le site indiquait déjà le hors-programme, aucun gate spécifique n’empêchait une future réintroduction accidentelle de l’héritage ou de méthodes spéciales.

## Stratégie V1.14

### 1. Repartir de ce que l’élève connaît

Le module rappelle que `notes.append(14)` est déjà une interaction objet/méthode connue depuis la Première. L’objectif est de donner un nom à une pratique déjà rencontrée avant d’introduire une nouvelle syntaxe.

### 2. Séparer les concepts

L’ordre devient :

`classe → instance → __init__ → attribut → self → méthode → états indépendants → composition d’objets`.

Aucun exercice ne demande simultanément de découvrir toutes ces idées.

### 3. Installer une routine de lecture

Pour chaque appel `objet.methode(...)`, l’élève est invité à remplacer mentalement `self` par l’objet qui reçoit l’appel. Pour chaque constructeur, il distingue le paramètre temporaire de l’attribut persistant.

### 4. Tester deux instances

Plusieurs tests créent deux objets, agissent sur un seul et vérifient que l’autre conserve son état. Cela rend concrète la différence entre une classe commune et des états d’instance distincts.

### 5. Éliminer une complexité prématurée

L’ancien exercice sur une liste définie comme attribut de classe est remplacé par un défaut plus fondamental et plus utile : une variable locale `valeurs = []` utilisée à la place de `self.valeurs = []`.

### 6. Garder les mathématiques hors de l’obstacle

L’exercice `Segment` conserve son intérêt pour la composition d’objets, mais la formule `dx*dx + dy*dy` est intégralement fournie et l’énoncé indique explicitement qu’aucune connaissance de géométrie n’est évaluée.

## Progression des exercices cœur

- `T2-E1` — compléter `Point.__init__` : paramètre → attribut ;
- `T2-E2` — compléter une méthode `deposer` : agir sur `self.solde`, puis tester deux instances ;
- `T2-E3` — composer deux objets `Point` dans un `Segment` et utiliser leurs attributs.

## Progression des entraînements

- `T2-X1` — compléter des attributs simples ;
- `T2-X2` — construire état + deux méthodes ;
- `T2-X3` — déboguer variable locale / attribut ;
- `T2-X4` — construire une petite classe complète ;
- `T2-X5` — distinguer `self` d’un second objet `autre`.

## PRIMM

Le PRIMM T2 crée deux compteurs :

```python
class Compteur:
    def __init__(self, valeur):
        self.valeur = valeur

    def ajouter(self, n):
        self.valeur += n

a = Compteur(10)
b = Compteur(3)
a.ajouter(5)
print(a.valeur, b.valeur)
```

La prédiction exige `15 3` et l’explication de l’identité de `self` pendant `a.ajouter(5)`.

## Gate automatique

`scripts/validate-student-zero-t1t2.mjs` bloque notamment :

- disparition des blocs classe/instance, `__init__`, `self`, local/attribut et états indépendants ;
- absence de test sur deux instances ;
- retour de l’ancien exercice d’attribut partagé comme étape centrale ;
- introduction d’héritage dans les codes T2 ;
- utilisation de `super`, `__str__`, `__eq__`, `__add__` ou `@property` dans le parcours d’apprentissage ;
- disparition du rappel explicite que héritage et polymorphisme sont hors du cœur attendu.

## Critère de réussite pédagogique

À l’issue de T2, un élève doit pouvoir expliquer avec ses propres mots :

> La classe décrit une famille d’objets. Chaque objet est une instance avec ses propres attributs. `__init__` initialise ces attributs. Dans une méthode, `self` désigne l’objet qui reçoit l’appel ; modifier `self.attribut` modifie donc l’état de cet objet précis.

S’il ne peut pas produire cette explication, le module n’est pas considéré comme acquis, même si ses tests Python sont verts.
