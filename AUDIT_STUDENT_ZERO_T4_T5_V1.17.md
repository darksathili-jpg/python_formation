# AUDIT STUDENT ZERO — T4 → T5 — V1.17

## But

Éprouver la transition **arbres binaires → graphes** comme un élève de Terminale NSI qui sait déjà manipuler récursivité, arbres, piles et files, mais qui découvre le modèle de graphe.

Le risque principal identifié est un faux modèle mental : considérer un graphe comme un simple arbre « avec davantage de branches ». Ce raccourci masque précisément ce qui rend les graphes nouveaux : absence éventuelle de racine, nombre quelconque de voisins, orientation possible, plusieurs chemins entre deux sommets, composantes distinctes et surtout **cycles**.

## Appuis officiels

Le cadrage suit le programme de Terminale NSI et la page Éduscol « Programmes et ressources en numérique et sciences informatiques — voie générale », partie **Algorithmes sur les graphes**. Éduscol y référence des ressources travaillant le vocabulaire, les parcours en largeur et en profondeur, la détection de cycles, la recherche de chemins et le plus court chemin dans les graphes non pondérés.

## Dettes détectées avant V1.17

1. Le module introduisait très vite le dictionnaire de successeurs sans construire suffisamment la différence arbre/graphe.
2. Sommet, arête, orientation et cycle étaient sous-explicités avant BFS/DFS.
3. `visites` était présenté surtout comme un détail d’implémentation alors qu’il répond à une nécessité conceptuelle : empêcher les revisites dans un graphe cyclique.
4. La différence DFS/BFS était donnée, mais le rôle commun de la **frontière** n’était pas assez construit.
5. Le lien T3 → T5 (pile pour DFS, file pour BFS) devait devenir un transfert explicite.
6. La propriété « BFS donne une distance minimale » devait être bornée aux **graphes non pondérés**.
7. Les exercices devaient davantage forcer l’élève à lire la représentation du graphe avant de coder.

## Décisions V1.17

### 1. Arbre ≠ graphe

Le module commence désormais par une comparaison explicite :

- arbre : hiérarchie enracinée étudiée sans cycle ;
- graphe : relations générales, racine non obligatoire, voisins multiples, chemins multiples, cycles possibles, parties éventuellement déconnectées.

### 2. Vocabulaire installé avant l’algorithme

Les notions suivantes sont définies et illustrées avant BFS/DFS :

- sommet ;
- arête ;
- arc ;
- voisin / successeur ;
- orienté / non orienté ;
- chemin ;
- cycle.

### 3. Représentation séparée de l’objet abstrait

Le dictionnaire de listes de voisins est présenté comme **une représentation Python possible**, pas comme la définition d’un graphe. Une matrice d’adjacence est montrée comme autre représentation du même objet conceptuel.

### 4. `visites` devient un concept, pas une rustine

L’élève voit un cycle explicite et doit comprendre pourquoi une exploration sans mémoire peut revenir indéfiniment sur des sommets déjà rencontrés. Le sommet est marqué lors de sa **découverte**, avant son ajout à la frontière.

### 5. Frontière commune, politique différente

La même idée de frontière est utilisée pour comparer :

- DFS → pile / LIFO ;
- BFS → file / FIFO.

Cette construction réactive directement les types abstraits de T3.

### 6. BFS et distance minimale

La propriété est formulée précisément : dans un graphe **non pondéré**, BFS traite les sommets par couches de distance croissante en nombre d’arêtes. Elle n’est pas généralisée aux graphes pondérés.

## Exercices cœur

- `T5-E1` : lire la représentation et calculer un degré ;
- `T5-E2` : DFS avec cycle et marquage à la découverte ;
- `T5-E3` : BFS et distance minimale dans un graphe non pondéré.

## Entraînements

- `T5-X1` : liste de voisins et copie indépendante ;
- `T5-X2` : sommets isolés ;
- `T5-X3` : déboguer un DFS qui boucle sur un cycle ;
- `T5-X4` : existence d’un chemin avec DFS ;
- `T5-X5` : reconstruire un itinéraire minimal avec BFS.

## PRIMM

Le PRIMM T5 utilise un graphe cyclique. L’élève doit prédire simultanément :

- ordre de traitement ;
- contenu de la file ;
- contenu de `visites` ;
- raison pour laquelle un sommet déjà découvert n’est jamais réenfilé.

## Invariants ajoutés à la CI

Le gate V1.17 refuse notamment :

- disparition de la distinction arbre/graphe ;
- disparition du vocabulaire orientation/cycle ;
- DFS sans mémoire des sommets découverts ;
- BFS qui ne marque pas les sommets avant enfilement ;
- disparition du lien pile↔DFS / file↔BFS ;
- formulation du plus court chemin sans préciser le cadre non pondéré ;
- suppression du PRIMM cyclique ou de la passerelle novice associée.

## Résultat attendu

Un élève ne doit plus réciter « DFS = pile, BFS = file ». Il doit pouvoir expliquer :

1. ce que représente le dictionnaire ;
2. pourquoi un cycle rend `visites` nécessaire ;
3. ce que contient la frontière ;
4. pourquoi la politique LIFO/FIFO change l’ordre d’exploration ;
5. pourquoi BFS fournit une distance minimale en nombre d’arêtes dans le cadre non pondéré.
