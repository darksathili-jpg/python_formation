# Bac Readiness Gate T1 → T11 — V1.26 Recognition Evidence

## Pourquoi cette évolution

La V1.25 vérifie déjà quatre parcours blancs transversaux chronométrés, huit tâches de programmation, une justification écrite, un dialogue simulé, un débrief différé et une analyse des erreurs. Elle répond à la question : **l’élève parvient-il à résoudre les situations dans le temps imparti sans que le chapitre soit annoncé ?**

La V1.26 ajoute une preuve qui manquait pour mesurer réellement le transfert : **avant le premier lancement des tests, l’élève doit déclarer la stratégie qu’il compte utiliser**.

Sans cette trace, un élève pouvait finir par valider les tests après plusieurs essais sans que l’on sache s’il avait reconnu spontanément la bonne structure ou le bon algorithme.

## Principe de la preuve de reconnaissance

Pour chacune des huit tâches BRG-A1 à BRG-D2, un bloc « V1.26 · preuve de reconnaissance » apparaît avant l’éditeur Python.

Avant de pouvoir lancer les tests pour la première fois, l’élève rédige 2 à 4 phrases indiquant :

- la représentation ou la structure de données qu’il pense utiliser ;
- l’idée de sa stratégie algorithmique ;
- au moins un cas limite qu’il compte surveiller.

Le texte doit contenir au moins 40 caractères. Aucun nom de chapitre n’est demandé et aucune notion cible n’est révélée.

Au premier clic sur « Tester » :

1. la stratégie est enregistrée localement ;
2. son horodatage est enregistré ;
3. elle est immédiatement verrouillée ;
4. le premier lancement des tests peut ensuite avoir lieu.

L’élève ne peut donc pas réécrire sa stratégie après avoir reçu le premier retour des tests.

## Effet sur le Gate vert

La V1.26 conserve toutes les exigences de la V1.25 et ajoute une condition supplémentaire : les huit tâches doivent posséder une stratégie valide, verrouillée après le début de la session et avant son échéance de 60 minutes.

Le statut final devient donc :

**Gate V1.26 = Gate V1.25 ET 8/8 preuves de reconnaissance recueillies dans le temps.**

Une réussite technique obtenue sans cette trace ne peut plus produire un Gate vert V1.26.

## Cas des traces V1.25 antérieures

Si une tâche avait déjà été testée avant le déploiement de la V1.26, l’interface l’indique comme « trace absente : tâche déjà testée avant V1.26 ». Cette réussite historique n’est pas transformée artificiellement en preuve de reconnaissance.

Pour obtenir une mesure V1.26 complète, la campagne Bac Readiness doit être recommencée avec la nouvelle couche active.

## Données et confidentialité

La stratégie reste stockée localement dans le navigateur dans `localStorage`, sous une clé distincte du stockage V1.25. Aucune donnée élève n’est envoyée à un serveur.

## Garde-fou CI

Le workflow `.github/workflows/bac-readiness.yml` vérifie désormais :

- la syntaxe de `assets/bac-readiness-evidence.js` ;
- la syntaxe du validateur V1.26 ;
- la présence du verrouillage horodaté avant le premier test ;
- le seuil minimal de stratégie ;
- la combinaison stricte du Gate historique et de la preuve de reconnaissance ;
- le chargement de la couche V1.26 dans `index.html` ;
- son intégration au cache hors ligne du service worker.

## Limite d’interprétation

Le Bac Readiness Gate reste un **indicateur pédagogique local** portant sur le périmètre couvert par PYTHON//FORGE. Il ne constitue ni une note prédictive ni une estimation de probabilité de réussite au baccalauréat.
