# Written Training Lab — V1.27

## Objectif

La section **Écrit Bac** transforme le corpus officiel NSI 2021–2026 en parcours d’apprentissage. Elle ne se contente pas d’afficher des PDF : elle entraîne explicitement la lecture d’une consigne, la reconnaissance d’une stratégie, la justification, la rédaction et la gestion du temps.

## Corpus

Le corpus fourni contient **79 sujets officiels Eduscol** :

- 2021 : 8 sujets ;
- 2022 : 19 sujets ;
- 2023 : 12 sujets ;
- 2024 : 13 sujets ;
- 2025 : 15 sujets ;
- 2026 : 12 sujets.

L’index automatique contient **219 sections ou exercices thématiques**. Les formulations anciennes sont conservées comme annales d’entraînement ; les sujets 2026 sont signalés comme référence prioritaire car leur structure à trois exercices est la plus proche du cadre de l’épreuve actuelle.

Les PDF ne sont pas dupliqués dans le dépôt : l’application ouvre les documents officiels Eduscol.

## Cadre de l’épreuve à partir de 2027

La préparation prend comme référence le cadre officiel publié en 2026 :

- durée de l’écrit : **3 h 30** ;
- **trois exercices indépendants**, tous traités ;
- l’écrit représente **75 %** de la note de l’épreuve terminale de spécialité NSI ;
- l’épreuve pratique représente **25 %** ;
- à l’écrit, **2 points sur 20** sont explicitement consacrés à la maîtrise de la langue : correction, clarté du raisonnement et précision du vocabulaire.

## Architecture pédagogique

### 1. Micro-entraînement

Douze tâches originales de 5 à 8 minutes entraînent des gestes récurrents de l’écrit :

- tracer un algorithme ;
- identifier une précondition ;
- choisir une structure ou un algorithme ;
- justifier ;
- expliquer une jointure SQL ;
- raisonner sur une pile ou une file ;
- expliquer la récursivité ;
- identifier la programmation dynamique ;
- lire un préfixe CIDR ;
- justifier un parcours d’ABR ;
- raisonner sur une complexité ;
- expliquer la complémentarité chiffrement symétrique / asymétrique.

La réponse de référence reste masquée tant que l’élève n’a pas produit sa propre réponse. Après révélation, l’élève s’auto-vérifie avec des critères concrets et formule ce qu’il corrigerait sur une vraie copie.

### 2. Annales officielles guidées

L’élève peut filtrer les sujets par année, zone ou notion. Pour un exercice choisi :

1. il ouvre le PDF officiel ;
2. les notions indexées sont masquées ;
3. il rédige d’abord un plan : tâche demandée, données utiles, structure ou algorithme envisagé, cas limite ;
4. la notion n’est révélée qu’après ce plan ;
5. l’élève compare sa reconnaissance initiale au thème réel et consigne son erreur ou son hésitation.

Cette étape mesure la capacité à mobiliser une connaissance **sans que le chapitre soit annoncé**.

### 3. Sujet blanc 3 h 30

Les sujets 2026 peuvent être utilisés en simulation complète :

- chronomètre persistant de 210 minutes ;
- aucune aide ou notion révélée pendant l’épreuve ;
- notes de gestion du temps séparées pour les trois exercices ;
- jalons de copie : budget temps, respect de la consigne, justification, relecture de la langue, retour sur les questions bloquantes ;
- post-mortem immédiat : lecture, connaissance, stratégie, trace/calcul, temps ou rédaction.

Le chronomètre repose sur un horodatage et ne peut donc pas être suspendu par un simple rechargement de page.

### 4. Méthode explicite

La section explique pourquoi l’entraînement alterne :

- rappel actif avant correction ;
- exemples et étayage puis retrait progressif des aides ;
- planification, surveillance et évaluation métacognitives ;
- feedback qui conduit à une action de correction ;
- espacement et alternance des domaines ;
- simulation finale authentique.

## Fondements pédagogiques

La conception s’appuie notamment sur :

- **Institute of Education Sciences — Organizing Instruction and Study to Improve Student Learning** : espacement, rappel actif, alternance exemples/problèmes et questions explicatives ;
- **Education Endowment Foundation — Metacognition and Self-Regulated Learning** : planifier, surveiller et évaluer sa démarche, avec étayage explicite puis autonomie ;
- **Education Endowment Foundation — Teacher Feedback to Improve Pupil Learning** : feedback opportun, ciblé et utilisé par l’élève pour améliorer sa production ;
- **Education Endowment Foundation — Using Digital Technology to Improve Learning** : utiliser le numérique pour augmenter la qualité de la pratique et du feedback, non pour ajouter de la technologie sans besoin pédagogique.

## Données et confidentialité

Les réponses, plans, auto-vérifications et sessions chronométrées sont enregistrés dans `localStorage`. Aucune donnée élève n’est envoyée à un serveur.

## Limites

Le Written Training Lab :

- n’attribue pas automatiquement une note aux réponses longues ;
- ne prétend pas reproduire un barème académique non publié avec chaque annale ;
- ne transforme pas le nombre de tâches réussies en probabilité de réussite au Bac ;
- utilise les sujets anciens comme ressources de pratique même lorsque leur structure historique diffère du format actuel.

Les indicateurs ont une fonction formative : repérer ce qui doit être retravaillé et soutenir l’autonomie de l’élève.
