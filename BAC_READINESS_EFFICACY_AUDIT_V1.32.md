# Bac Readiness Gate — Audit d’efficacité V1.32

## Objet

Cette passe ne vérifie plus seulement que les modules T1 → T11 sont présents ou pédagogiquement cohérents. Elle vérifie si le **Bac Readiness Gate** recueille des traces permettant d’estimer l’autonomie réelle de l’élève lorsqu’aucun chapitre n’est annoncé.

## État observé sur le main

Le dispositif V1.32 mesure déjà sept axes :

1. sessions chronométrées terminées ;
2. stratégie formulée avant le premier test ;
3. réussite des huit tâches dans le temps ;
4. efficacité des essais ;
5. raisonnement écrit ;
6. dialogue simulé ;
7. post-mortem de session.

Les données restent locales au navigateur.

## Point fort majeur

La stratégie initiale est verrouillée avant le premier retour des tests. Cette contrainte évite de confondre la reconnaissance spontanée d’une structure ou d’un algorithme avec une stratégie reconstruite après plusieurs essais.

## Limite majeure restante

Le Gate V1.32 mesure principalement une **performance immédiate**. Il ne fournit pas encore de preuve suffisante de rétention différée.

Un élève peut réussir un parcours aujourd’hui sans que l’on sache s’il saura, plusieurs jours plus tard :

- reconnaître la même famille de problème dans un autre contexte ;
- choisir seul une représentation ou une structure de données pertinente ;
- retrouver une stratégie algorithmique sans indice ;
- justifier son choix sans reprendre le débrief précédent.

## Gate humain recommandé avant V1.33

Avant d’ajouter un nouveau moteur de scoring, effectuer des pilotes réels avec des élèves de profils contrastés.

Pour chaque élève, comparer :

- la stratégie écrite avant le premier test ;
- le code finalement validé ;
- le nombre et la nature des essais ;
- la justification écrite ;
- les réponses du dialogue simulé ;
- le post-mortem ;
- l’observation de l’enseignant.

Le diagnostic V1.32 ne doit être considéré comme valide que si ces traces correspondent au comportement réellement observé.

## Critères de faux positif

Le Gate est trop permissif si un élève obtient un statut favorable alors que :

- la stratégie initiale est vague ou incorrecte ;
- la réussite provient surtout d’essais successifs sans hypothèse ;
- la justification contient suffisamment de caractères mais peu de raisonnement ;
- le dialogue est rempli de mots-clés sans explication ;
- le post-mortem reste générique.

## Critères de faux négatif

Le Gate est trop sévère si l’élève échoue surtout à cause :

- d’une consigne ambiguë ;
- d’un problème d’interface ;
- d’un dysfonctionnement du moteur Python ;
- d’un seuil textuel arbitraire ;
- d’un chronomètre ou d’une navigation qui perturbent artificiellement la tâche.

## V1.33 à ne déclencher qu’après le pilote

La prochaine couche utile est un **Delayed Transfer Gate**. Elle devra proposer des situations isomorphes mais différentes, après un délai réel, sans révéler la notion cible.

Cette V1.33 devra mesurer au minimum :

- reconnaissance différée ;
- choix de stratégie ;
- réussite technique ;
- justification ;
- comparaison entre stratégie initiale et stratégie différée ;
- conservation de l’autonomie sans aide.

La V1.33 ne doit pas simplement ajouter des exercices supplémentaires au parcours. Elle doit constituer une nouvelle mesure indépendante.

## Correctif CI de cette branche

Le workflow Bac Readiness contrôle désormais explicitement :

- la syntaxe de `assets/bac-readiness-efficacy-model.js` ;
- la syntaxe de `assets/bac-readiness-efficacy.js` ;
- la syntaxe de `scripts/validate-bac-readiness-efficacy.mjs` ;
- l’exécution du validateur V1.32.

Cela évite qu’une régression de la couche d’efficacité puisse être fusionnée alors que l’ancien Gate V1.25/V1.26 reste vert.
