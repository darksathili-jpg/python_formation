# Audit corpus Écrit Bac — V1.28

## Objet

La V1.27 avait construit une première section d’entraînement à l’écrit à partir des annales officielles NSI 2021–2026. L’audit V1.28 reprend cette base en utilisant directement les **79 PDF fournis** afin de vérifier l’index exercice par exercice.

Le but n’est pas seulement documentaire : un mauvais thème affiché avant ou après un exercice fausse la mesure de reconnaissance et peut orienter l’élève vers une notion qui n’est pas celle réellement mobilisée.

## Corpus effectivement contrôlé

- 2021 : 8 sujets ;
- 2022 : 19 sujets ;
- 2023 : 12 sujets ;
- 2024 : 13 sujets ;
- 2025 : 15 sujets ;
- 2026 : 12 sujets.

Total : **79 sujets**.

L’analyse des en-têtes d’exercices des PDF donne **292 exercices** :

- 27 sujets comportent 5 exercices ;
- 51 sujets comportent 3 exercices ;
- 1 sujet comporte 4 exercices.

La structure historique est donc conservée pour les annales anciennes, tandis que les sujets 2026 restent les références prioritaires pour les simulations proches du cadre 2027.

## Défauts détectés dans l’ancien index

L’ancien index satisfaisait un contrôle quantitatif global, mais plusieurs métadonnées étaient fausses ou incomplètes.

Exemples confirmés sur les PDF :

- **Amérique du Nord 2021, exercice 1** : l’index indiquait pile/file alors que le PDF annonce les bases de données relationnelles et SQL ;
- **Asie 2025 sujet 3** : l’exercice 2, consacré aux réseaux, au routage, aux graphes et à la programmation, était absent de l’index thématique ;
- **Polynésie française 2025 sujet 2** : le PDF contient bien un exercice 3 sur tableaux, dictionnaires, chemins dans un graphe, piles, files et POO ;
- plusieurs sujets 2022 et 2023 avaient un nombre d’exercices sous-estimé ;
- plusieurs thèmes contenaient par erreur le début du contexte narratif de l’exercice.

Ces défauts rendaient le filtre par notion et le mode « annale guidée » moins fiables.

## Correction technique

Le fichier `assets/bac-written-pdf-index.js` constitue désormais la couche de vérité issue des PDF fournis.

`assets/bac-written-detailed.js` fusionne :

1. le catalogue historique et ses liens Eduscol ;
2. l’index thématique existant ;
3. la couche V1.28 issue des PDF réels.

Pour chaque sujet reconnu, `exerciseCount` et `themes` sont remplacés par les données contrôlées sur le PDF, et le sujet reçoit `corpusVerified: true`.

## Nouveau garde-fou CI

Le validateur exige désormais :

- exactement 79 sujets ;
- la distribution annuelle 8 / 19 / 12 / 13 / 15 / 12 ;
- exactement **292 exercices indexés** ;
- `themes.length === exerciseCount` pour chaque sujet ;
- une numérotation continue des exercices ;
- un thème non vide pour chaque exercice ;
- 79 sujets marqués comme réconciliés avec les PDF fournis ;
- le maintien des liens vers les PDF officiels Eduscol ;
- des tests de non-régression sur plusieurs corrections critiques.

Le nouvel index est aussi intégré au cache hors ligne.

## Conséquence pédagogique

La section « Écrit Bac » peut maintenant être utilisée plus sérieusement pour :

- filtrer les annales par notion ;
- masquer puis révéler les notions réellement mobilisées ;
- comparer la stratégie annoncée par l’élève au thème effectif de l’exercice ;
- construire des séquences d’entraînement variées à partir du corpus historique ;
- choisir des sujets blancs proches du format actuel.

## Principes pédagogiques conservés

La V1.28 conserve les choix de la V1.27 :

- rappel actif avant correction ;
- exemples travaillés et retrait progressif de l’étayage ;
- auto-explication ;
- feedback utilisé pour réviser la réponse ;
- planification et métacognition ;
- simulations chronométrées ;
- absence de note prédictive automatique.

Ces choix sont cohérents avec les recommandations de l’Education Endowment Foundation sur les exemples travaillés, le fading, l’explication et la pratique de récupération, ainsi qu’avec les travaux de l’Institute of Education Sciences sur retrieval practice et feedback.

## Étape suivante

La donnée n’est plus le principal risque. La prochaine passe doit devenir **une épreuve élève réelle de la section Écrit Bac** :

1. micro-entraînement guidé ;
2. annale guidée avec thème masqué ;
3. exercice autonome chronométré ;
4. comparaison entre difficulté vécue, qualité de la réponse et diagnostic de l’application.

Les défauts à rechercher sont alors des défauts de compréhension, de dosage de l’aide, de feedback, de charge cognitive ou d’ergonomie — et non plus des erreurs de catalogue.
