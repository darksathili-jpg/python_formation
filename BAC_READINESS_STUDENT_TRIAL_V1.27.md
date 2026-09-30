# Épreuve élève réelle — Bac Readiness V1.26 sous PYTHON//FORGE V1.27

## Finalité

Cette passe ne cherche pas à démontrer qu’un élève « réussira le Bac ». Elle vérifie si le **Bac Readiness Gate** mesure bien ce qu’il prétend mesurer sur le périmètre de PYTHON//FORGE :

- compréhension autonome d’une situation non étiquetée par chapitre ;
- reconnaissance d’une structure ou d’une stratégie pertinente ;
- passage du plan au code ;
- gestion des cas limites ;
- capacité à justifier ;
- comportement sous contrainte de temps ;
- cohérence entre le diagnostic produit par l’application et les difficultés réellement rencontrées.

## Conditions de passation

Pour le premier pilote, faire passer **une session V1.26 de 60 minutes** dans des conditions ordinaires de classe : poste habituel, navigateur habituel, aucune aide humaine pendant la session, aucune révision ciblée juste avant et aucune indication sur les chapitres mobilisés.

L’enseignant observe sans corriger. Une intervention n’est autorisée que pour un problème matériel ou logiciel empêchant la poursuite ; elle doit alors être notée, car une friction technique ne doit pas être confondue avec une difficulté de l’élève.

## Ce que l’observateur relève

### Avant le premier test de chaque tâche

- L’élève comprend-il ce qui est demandé sans reformulation externe ?
- Combien de fois relit-il l’énoncé ?
- La stratégie écrite contient-elle une représentation ou structure identifiable ?
- L’idée algorithmique est-elle cohérente avec la tâche ?
- Un cas limite est-il réellement pertinent ou seulement ajouté pour remplir le champ ?
- Temps approximatif entre l’ouverture de la tâche et le premier lancement de tests.

### Pendant les essais

Pour chaque lancement de tests :

- résultat global ;
- nature du changement effectué ensuite ;
- modification locale de code ou changement de stratégie ;
- comportement de tâtonnement éventuel ;
- retour à l’énoncé ou non ;
- temps passé avant l’essai suivant.

Un grand nombre d’essais n’est pas automatiquement négatif : il faut distinguer **débogage méthodique** et **essais sans hypothèse**.

### Sous pression temporelle

Observer notamment :

- l’élève regarde-t-il fréquemment le chronomètre ?
- abandonne-t-il momentanément une question bloquante ?
- accélère-t-il au prix d’une baisse de qualité ?
- laisse-t-il une justification incomplète alors que le code est terminé ?
- la proximité des dix dernières minutes modifie-t-elle sa stratégie ?

## Entretien immédiat de 5 minutes

Juste après le verrouillage de la session, demander oralement :

1. « Qu’est-ce qui t’a fait choisir cette structure ou cet algorithme ? »
2. « À quel moment as-tu compris que ton premier plan était bon ou mauvais ? »
3. « Quel retour des tests t’a le plus aidé ? »
4. « Qu’est-ce qui t’a fait perdre le plus de temps ? »
5. « Le diagnostic affiché à la fin correspond-il à ce qui t’a réellement posé problème ? Pourquoi ? »
6. « Y a-t-il un moment où l’interface t’a gêné alors que tu savais quoi faire ? »

Ces réponses servent à confronter les données enregistrées à l’expérience réelle de l’élève.

## Grille d’observation synthétique

| Dimension | Indice attendu | Signal d’alerte |
|---|---|---|
| Compréhension | démarre sans reformulation externe | mauvaise interprétation due au wording |
| Reconnaissance | stratégie initiale cohérente avant test | stratégie vague mais Gate tout de même vert |
| Transfert | mobilise une notion sans chapitre annoncé | dépend d’indices implicites de l’interface |
| Débogage | formule une hypothèse entre deux tests | changements successifs sans raison identifiable |
| Justification | explique propriété → application → conclusion | validation par simple auto-cochage sans preuve textuelle |
| Temps | arbitre et revient sur un blocage | chronomètre provoquant abandon prématuré ou panique UI |
| Diagnostic | correspond au récit post-session | écart important entre métriques et difficulté vécue |

## Faux positif à rechercher

Le Gate serait trop permissif si un élève obtient un bon diagnostic alors que :

- sa stratégie initiale ne correspond pas à la solution finalement utilisée ;
- il valide surtout par essais successifs sans raisonnement explicite ;
- la justification ou le dialogue sont remplis de façon superficielle ;
- les critères d’auto-évaluation sont cochés sans présence réelle dans la réponse.

Dans ce cas, la métrique doit être renforcée avant toute généralisation.

## Faux négatif à rechercher

Le Gate serait trop sévère si un élève manifestement compétent échoue surtout à cause de :

- consignes ambiguës ;
- champ de saisie ou navigation peu lisible ;
- dysfonctionnement du moteur Python ;
- interaction artificielle avec le chronomètre ;
- seuil textuel arbitraire qui pénalise une réponse courte mais exacte.

Dans ce cas, il faut corriger l’instrument avant de conclure à une lacune pédagogique.

## Critère de décision après le pilote

Après chaque élève, classer les écarts constatés en quatre catégories :

1. **instrument valide** : la métrique reflète correctement l’observation ;
2. **problème de consigne** ;
3. **problème d’interface ou technique** ;
4. **problème de validité du diagnostic**.

Une modification du Gate n’est justifiée que si un écart est reproductible ou suffisamment grave pour fausser l’interprétation.

## Série de pilotes recommandée

Commencer par un petit nombre d’élèves aux profils contrastés pour repérer les défauts majeurs d’usage. Une fois les problèmes bloquants corrigés, élargir le test à une classe ou à un groupe plus important afin de vérifier la stabilité des observations.

Le but est une **validation pédagogique et ergonomique progressive**, pas une étude statistique permettant de prédire une note au baccalauréat.
