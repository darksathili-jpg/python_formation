# Audit Student Zero T3 → T4 — V1.16

## Objet

Cette passe traite la transition entre les structures linéaires de T3 (piles/files) et les arbres binaires de T4. Le risque principal identifié est l’apprentissage de patrons récursifs sans modèle mental de l’arbre : l’élève écrit `f(a.gauche)` et `f(a.droite)` parce que « c’est la recette », sans savoir que chacun de ces appels reçoit un sous-arbre complet.

## Références de cadrage

- Programme de Terminale NSI : arbres, structures hiérarchiques, arbres binaires, algorithmes sur les arbres binaires et les arbres binaires de recherche.
- Éduscol, page Programmes et ressources NSI : ressources « Généralités sur les arbres » et algorithmes sur les arbres binaires / ABR. La page répertorie explicitement hauteur, parcours infixe/préfixe/suffixe, parcours en largeur, recherche et insertion dans un ABR.

## Dettes repérées

1. Le vocabulaire racine / nœud / feuille / fils / sous-arbre / arbre vide était trop condensé.
2. La définition récursive d’un arbre binaire n’était pas suffisamment reliée au sens des appels récursifs.
3. Taille et hauteur pouvaient être mémorisées comme deux formules sans distinguer somme des deux branches et maximum d’une branche.
4. La convention de hauteur n’était pas assez mise en avant alors que plusieurs conventions coexistent dans les ressources scolaires.
5. Les trois parcours en profondeur étaient présentés sans imposer une lecture préalable sur un petit arbre.
6. Le lien entre la file de T3 et le parcours en largeur était sous-exploité.
7. L’ABR risquait d’être traité comme « un arbre avec une fonction de recherche » plutôt que comme un arbre muni d’une propriété d’ordre permettant d’éliminer un sous-arbre.

## Décisions V1.16

- Introduire le vocabulaire avant les algorithmes.
- Fixer `None` comme représentation de l’arbre vide dans ce parcours.
- Faire verbaliser chaque appel récursif : « cet appel calcule ... sur ce sous-arbre ... ».
- Définir explicitement la hauteur du module comme le nombre de nœuds du plus long chemin racine-feuille : vide = 0, feuille = 1, tout en signalant l’existence d’autres conventions.
- Enseigner les parcours par ordre de traitement du nœud : préfixe N-G-D, infixe G-N-D, suffixe G-D-N.
- Réactiver T3 avec le parcours en largeur et l’usage d’une file.
- Introduire l’ABR par sa propriété d’ordre avant recherche, minimum et insertion.
- Conserver les exercices autonomes dans le Python Lab en fournissant systématiquement la classe `Noeud` nécessaire.

## Progression cible

1. Structure linéaire vs structure hiérarchique.
2. Vocabulaire sur un arbre dessiné.
3. Définition récursive de l’arbre binaire.
4. Sens d’un appel sur un sous-arbre.
5. Taille.
6. Hauteur et convention.
7. Parcours préfixe / infixe / suffixe.
8. Parcours en largeur avec une file.
9. Propriété d’ordre de l’ABR.
10. Recherche, minimum et insertion.

## Garde-fou automatique

`scripts/validate-student-zero-t3t4.mjs` vérifie notamment :

- présence du vocabulaire minimal ;
- définition récursive explicite ;
- convention de hauteur ;
- présence des trois parcours en profondeur ;
- lien largeur ↔ file ;
- propriété d’ordre de l’ABR ;
- taille et infixe conformes ;
- recherche ABR sur un seul sous-arbre ;
- insertion ABR correcte ;
- PRIMM centré sur le sens de chaque sous-appel ;
- absence de slices dans les codes pédagogiques T4.

## Critère de réussite pédagogique

Un élève qui réussit T4 ne doit pas seulement savoir écrire une fonction récursive. Il doit pouvoir prendre un appel comme `taille(a.gauche)` ou `infixe(a.droite)` et expliquer, sans exécuter Python, **quel arbre exact est reçu, ce que l’appel doit calculer sur cet arbre et comment son résultat contribue au nœud courant**.
