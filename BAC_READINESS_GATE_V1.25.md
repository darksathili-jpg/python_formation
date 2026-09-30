# Bac Readiness Gate T1 → T11 — V1.25

## Changement de question

Les passes Student Zero puis l’audit transversal V1.24 vérifiaient surtout que le parcours pouvait être appris sans rupture majeure. La V1.25 pose une autre question : **après plusieurs mois, l’élève reconnaît-il seul les notions à mobiliser lorsqu’aucun chapitre n’est annoncé ?**

Le gate ne cherche donc pas à ajouter un chapitre. Il mesure la mobilisation autonome, le respect d’une contrainte de temps, la robustesse du code, la qualité d’une justification écrite et la capacité à expliquer ses choix.

## Cadre officiel 2027

Référence : Bulletin officiel spécial n° 4 du 17 septembre 2026, note de service du 11 septembre 2026, « Épreuve terminale de l’enseignement de spécialité numérique et sciences informatiques (NSI) » :
https://www.education.gouv.fr/bo/2026/Special4/MENE2622643N

À compter de la session 2027 :

- la partie écrite dure 3 h 30 et comporte trois exercices indépendants ;
- la maîtrise de la langue, la formulation du raisonnement et le vocabulaire adapté comptent pour 2 points sur 20 à l’écrit ;
- la partie pratique dure 1 h et consiste à programmer une application à partir d’un document fourni ;
- l’évaluation pratique s’appuie sur un dialogue avec un professeur-examinateur ;
- la note finale pondère l’écrit à 75 % et la pratique à 25 %.

Le Bac Readiness Gate utilise quatre blocs de 60 minutes. Il reprend volontairement la contrainte de temps de la pratique pour mesurer l’autonomie et ajoute une justification écrite. Il ne prétend pas reproduire à lui seul les 3 h 30 de l’épreuve écrite ni couvrir les rubriques systèmes, architectures et réseaux absentes du périmètre principal de PYTHON//FORGE.

## Les quatre parcours

### BRG-A — Réseau de secours

Deux tâches : plus court chemin dans un graphe non pondéré avec zones interdites, puis résumé récursif d’un arbre. Le débrief révèle seulement après la session les liens avec récursivité, objets, file, arbres, graphes et tests.

### BRG-B — Médiathèque sous contrôle

Deux tâches : requête SQLite avec jointure et paramètre, puis gestion d’une file encapsulée dans une classe. Le parcours oblige à changer de représentation sans annoncer « SQL », « POO » ou « type abstrait » dans son titre.

### BRG-C — Planification de mission

Deux tâches : fusion de deux listes triées sans tri global, puis minimisation d’un coût par états successifs. Le débrief fait apparaître la différence entre combinaison de sous-problèmes et réutilisation de sous-problèmes qui se répètent.

### BRG-D — Scanner d’incident

Deux tâches : prétraitement de dernière occurrence puis recherche textuelle avec règle du mauvais caractère. La justification écrite porte sur la distinction entre lenteur d’un programme et indécidabilité.

La couverture cumulée des quatre parcours atteint T1 à T11. Les modules mobilisés ne sont pas affichés avant le débrief.

## Protocole de mesure

Chaque session possède un chronomètre de 60 minutes stocké avec son heure de départ. Recharger ou fermer la page ne suspend pas le temps. Un seul parcours peut être actif à la fois.

Pendant la session :

- aucun indice ;
- aucune solution ;
- uniquement l’énoncé, l’éditeur Python, les tests de comportement et une justification écrite ;
- les notions ciblées restent masquées.

Après la fin :

- débrief des stratégies et notions effectivement mobilisées ;
- auto-vérification de quatre critères rédactionnels ;
- trois questions de dialogue simulé ;
- analyse des erreurs selon six familles : lecture, modèle, algorithme, code, test, temps.

## Critère de passage du gate

Le gate devient vert seulement si les quatre sessions sont terminées et si, pour chacune d’elles :

1. les deux tâches de programmation ont validé tous leurs tests au moins une fois dans la fenêtre de 60 minutes ;
2. la justification écrite a été produite pendant la session et au moins trois critères sur quatre sont réellement présents ;
3. les trois questions de dialogue possèdent une réponse ou des mots-clés exploitables ;
4. les tâches et la justification ont été bouclées dans le temps imparti.

Ce gate est un **indicateur pédagogique local** sur le périmètre du site. Il ne doit pas être interprété comme une note prédictive au baccalauréat.

## Garde-fou permanent

Le workflow `.github/workflows/bac-readiness.yml` exécute :

- la vérification syntaxique des nouveaux assets ;
- `scripts/validate-bac-readiness.mjs` ;
- les solutions de référence des huit tâches contre tous les tests ;
- le validateur historique de l’ensemble des exercices ;
- le Terminale Transversal Gate V1.24/V1.25.

Le validateur vérifie également : quatre sessions de 60 minutes, huit tâches, couverture T1→T11, quatre critères écrits par session, trois questions de dialogue, absence de présentation du gate comme prédiction de résultat et présence des assets dans le cache hors ligne.
