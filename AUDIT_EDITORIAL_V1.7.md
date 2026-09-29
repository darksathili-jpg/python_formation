# PYTHON//FORGE V1.7 — Passe éditoriale des énoncés

## Pourquoi une V1.7 après le Statement Quality Gate V1.6 ?

La V1.6 garantissait qu'aucun exercice n'était laissé avec une consigne brute seule : mission, contrat, guidage, cas de validation et critères de réussite étaient systématiquement présents.

L'audit éditorial a toutefois mis en évidence une dette plus fine : certains blocs restaient trop génériques. En particulier, « paramètre fourni à la fonction » ou « le résultat doit respecter la règle décrite » ne suffisent pas pour un élève qui découvre la programmation. Un bon énoncé doit pouvoir être compris sans deviner à partir du nom d'une fonction, d'un paramètre, du squelette Python ou des tests cachés.

## Standard éditorial V1.7

Chaque activité programmée doit rendre directement lisibles les éléments suivants :

1. **Ce que tu dois réellement faire** : reformulation complète de la tâche en français, en distinguant écrire, compléter, déboguer, transférer ou construire une application.
2. **Contrat précis** : fonctions, classes et méthodes attendues, avec leurs signatures.
3. **Données reçues** : rôle concret de chaque paramètre, pas seulement son nom.
4. **Valeur ou effet attendu** : description explicite de la sortie ou de l'effet de bord autorisé.
5. **Avant d'écrire du Python** : démarche de résolution liée à la notion du module.
6. **Erreur classique à éviter** : misconception typique de la notion.
7. **Contraintes et cas frontières** : conditions qui distinguent une solution réellement correcte d'une solution approximative.
8. **Exemples contrôlés** : cas de validation lisibles, avec l'expression d'appel affichée lorsqu'elle reste pédagogique.
9. **Critères de réussite** : être capable d'expliquer le contrat et l'algorithme, pas uniquement obtenir des tests verts.

## Principe pour les élèves sans spécialité mathématiques

La difficulté recherchée est informatique. Lorsqu'une relation mathématique extérieure à la compétence de programmation est nécessaire, elle doit être fournie. L'élève ne doit pas échouer parce qu'il doit reconstruire une formule implicite.

## Références de conception

- Programmes et ressources NSI, Éduscol : https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g
- Épreuve pratique NSI 2026 : https://sti.eduscol.education.fr/concours_examens/epreuve-pratique-bac-specialite-numerique-et-sciences-informatiques-2026
- Sujets zéro de l'épreuve pratique : https://sti.eduscol.education.fr/concours_examens/sujets-zero-epreuve-pratique-bac-specialite-nsi-2026
- France-IOI — cours et problèmes : https://www.france-ioi.org/algo/chapters.php
- PRIMM et apprentissage progressif de la programmation : https://www.raspberrypi.org/blog/using-primm-to-teach-programming-a-new-short-course-for-educators/
- Parsons Problems comme échafaudage de l'écriture de code : https://doi.org/10.1145/3501385.3543977

Ces références servent à fixer la qualité pédagogique, la progressivité et la précision des consignes. Les activités de PYTHON//FORGE restent originales.

## Garde-fou automatique

`scripts/validate-statements.mjs` couvre les 164 activités programmées. Le gate refuse désormais notamment :

- un résultat attendu vide ou purement générique ;
- une reformulation éditoriale trop courte ;
- une absence d'erreur classique à éviter ;
- un paramètre insuffisamment décrit lorsque son rôle n'est pas explicité dans la mission ;
- la disparition des blocs « contrat », « résultat », « avant de coder », « exemples » ou « critères de réussite ».

Le but du gate n'est pas de remplacer la relecture humaine, mais d'empêcher le retour de la dette éditoriale déjà identifiée.
