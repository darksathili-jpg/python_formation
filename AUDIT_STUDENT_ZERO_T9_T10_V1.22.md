# V1.22 — Student Zero Gate T9 → T10

## But

Éprouver la transition **diviser pour régner → programmation dynamique** comme un élève de Terminale NSI qui maîtrise la récursivité mais ne suit pas nécessairement la spécialité mathématiques.

Le risque principal identifié était de réduire la programmation dynamique à une recette de code du type « ajouter un dictionnaire à une fonction récursive » ou « créer une liste appelée `dp` », sans modèle mental sur les sous-problèmes, les états et leurs dépendances.

## Références institutionnelles

- Programme Terminale NSI : la programmation dynamique fait partie de la rubrique Algorithmique ; la capacité attendue est d’**utiliser la programmation dynamique pour écrire un algorithme**. Les exemples mentionnés sont notamment le rendu de monnaie et l’alignement de séquences ; une discussion du coût mémoire peut être développée.
- Éduscol — Programmation dynamique : https://eduscol.education.gouv.fr/sites/default/files/document/ra20nsigtprogdyn1298637pdf-89571.pdf
- Éduscol — page Programmes et ressources NSI : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g

La ressource Éduscol insiste notamment sur les sous-problèmes similaires mais plus petits, leur indexation, la réutilisation des solutions de sous-problèmes, les répétitions produites par une récursion naïve, la mémoïsation, le calcul systématique des états et le compromis temps/mémoire.

## Dette de la V1.21 constatée

Le module T10 existant contenait déjà les bons mots-clés — mémoïsation, bottom-up, Fibonacci, chemins et rendu de monnaie — mais la progression était trop rapide :

- aucun contraste explicite avec T9 ;
- l’état n’était pas défini comme une question représentant un sous-problème ;
- la relation de dépendance n’était pas isolée avant le code ;
- la mémoïsation apparaissait immédiatement sous la forme d’un dictionnaire ;
- l’ordre bottom-up était montré mais pas justifié par les dépendances ;
- les exercices mélangeaient plusieurs difficultés avant que le modèle mental soit stabilisé ;
- le coût mémoire était peu exploité alors qu’il constitue une extension explicitement pertinente dans la ressource officielle.

## Nouveau modèle mental

La V1.22 impose l’ordre suivant :

1. **Repérer le chevauchement** : le même sous-problème réapparaît-il ?
2. **Définir l’état** en une phrase précise.
3. **Donner les cas initiaux**.
4. **Écrire la relation de dépendance** entre états.
5. **Choisir l’ordre de calcul** ou l’exploration à la demande.
6. Seulement ensuite choisir une représentation : dictionnaire, liste, grille 2D ou quelques variables.
7. Comparer le temps évité aux résultats supplémentaires conservés en mémoire.

Le contraste avec T9 est volontaire : le tri fusion divise la liste en sous-problèmes distincts ; une récursion dynamique typique fait réapparaître plusieurs fois exactement le même état.

## Exercices cœur

### T10-E1 — Bottom-up : escalier

Objectif : installer `dp[i]` comme un **état doté d’un sens** et faire comprendre l’ordre de calcul.

- `dp[0] = 1`, `dp[1] = 1` ;
- `dp[i] = dp[i-1] + dp[i-2]` ;
- construction de `2` vers `n`.

### T10-E2 — Top-down : même problème, autre organisation

Objectif : montrer que la mémoïsation réutilise les mêmes états sans changer leur sens ni leur relation de dépendance.

Garde-fou : les deux appels récursifs doivent recevoir **le même cache**.

### T10-E3 — Rendu de monnaie

Objectif : transférer le raisonnement vers un problème d’optimisation cité par le programme.

- état `dp[s]` explicité ;
- cas `dp[0] = 0` ;
- essai de toutes les dernières pièces possibles ;
- cas glouton volontairement non optimal avec `montant=6` et `pieces=[1,3,4]` ;
- état impossible représenté puis converti en `-1`.

## Entraînements

Les cinq exercices complémentaires couvrent :

- visualisation des états intermédiaires ;
- débogage d’un cache non partagé ;
- état à deux indices sur une grille ;
- optimisation avec choix « prendre / ne pas prendre » ;
- réduction mémoire lorsque seules deux dépendances précédentes sont utiles.

Cette diversité vise à empêcher l’association erronée « programmation dynamique = Fibonacci ».

## PRIMM

Le PRIMM commence volontairement par une récursion naïve instrumentée avec une liste `appels`. Pour `n=4`, l’élève doit observer que les mêmes valeurs de `n` réapparaissent. La mémoïsation arrive seulement après cette observation, puis l’élève écrit une version bottom-up du même problème.

## Garde-fous permanents

Le gate `scripts/validate-student-zero-t9t10.mjs` vérifie notamment :

- la présence de la transition explicite T9 → T10 ;
- la notion de sous-problèmes qui se chevauchent ;
- état, cas initiaux, dépendances et ordre de calcul ;
- cache réellement partagé en top-down ;
- construction bottom-up ;
- un cas où le glouton échoue ;
- une discussion temps/mémoire ;
- une activité avec état 2D ;
- une activité avec mémoire réduite ;
- l’absence de dépendance à `lru_cache`, `functools.cache`, NumPy ou Pandas.

## Critère de réussite Student Zero

Un élève doit pouvoir expliquer, avant d’écrire le moindre conteneur Python :

> « Mon état représente cette question. Je connais ces cas de base. Cet état dépend de ceux-ci. Je vais soit les demander à la demande avec un cache, soit les construire dans cet ordre. »

À ce stade seulement, le code devient la traduction d’un raisonnement déjà explicite.
