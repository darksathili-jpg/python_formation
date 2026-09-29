# PYTHON//FORGE V1.8 — Student Zero Gate · Première P1 + P2

## Protocole

L’audit relit P1 puis P2 comme si l’élève arrivait sans expérience préalable de Python et sans spécialité mathématiques. La question n’est pas « le code est-il correct ? », mais : **l’élève possède-t-il, au moment exact où une tâche lui est demandée, toutes les connaissances nécessaires pour comprendre la consigne et tenter une solution ?**

Chaque étape est examinée dans l’ordre réel du parcours : passerelle novice → cours → PRIMM → exercices cœur → entraînements. Sont considérés comme défauts : vocabulaire non introduit, cadre `def`/`return` pris pour acquis, syntaxe utilisée avant explication, saut trop important entre lecture et production, consigne mathématisée inutilement, cas frontière implicite, et aide qui donne la solution avant d’avoir donné une méthode.

## Références de conception

- Raspberry Pi Foundation, pédagogie de l’informatique : lire et explorer le code avant de l’écrire, modéliser les processus, rendre les concepts concrets et structurer les leçons.
- PRIMM : Predict, Run, Investigate, Modify, Make ; progression de la lecture d’un programme existant vers une prise en charge graduelle.
- Code tracing : tracer l’exécution pour développer un modèle mental de la machine avant la production autonome.
- France-IOI : petits apports de cours suivis d’exercices progressifs, validation automatique et aides évitant le blocage prolongé.

Ces références guident la structure ; les activités de PYTHON//FORGE restent originales.

## Dette détectée dans P1

### 1. `def` et `return` apparaissaient avant leur enseignement

La passerelle novice expliquait déjà ce choix, mais l’exercice cœur disait encore « Écris une fonction ». Pour Student Zero, le message reçu restait contradictoire : on lui disait qu’il ne devait pas connaître les fonctions, puis on lui demandait d’en écrire une.

**Correction V1.8 :** les trois exercices cœur P1 sont explicitement des activités **à compléter**. Le cadre est fourni et le cours explique comment le lire provisoirement : paramètres = données reçues ; `return` = résultat produit. La conception autonome d’une fonction reste réservée à P4.

### 2. `//` et `%` étaient utilisés sans vraie installation conceptuelle dans le cours

Des entraînements mobilisaient quotient entier et reste, et la parité utilisait `%`, alors que ces opérateurs n’étaient pas suffisamment installés dans la progression visible.

**Correction V1.8 :** une leçon dédiée présente `+`, `-`, `*`, `/`, `//`, `%` et `==` avec sorties concrètes. La parité rappelle explicitement que `%` donne le reste.

### 3. Le premier cours surchargeait inutilement le modèle mental

La représentation approximative des flottants est correcte mais n’aide pas l’élève à franchir son premier obstacle : comprendre ce que fait une affectation.

**Correction V1.8 :** P1 commence désormais par le modèle d’exécution minimal : calculer à droite, puis affecter à gauche. Les types sont ensuite introduits par quatre valeurs concrètes. Les détails avancés ne concurrencent plus ce premier modèle mental.

### 4. L’ordre des entraînements n’était pas optimal

Le quotient entier arrivait avant le débogage de `=` / `==`, alors que ce dernier consolide une distinction fondamentale du module.

**Nouvel ordre :** expression simple → débogage affectation/comparaison → multiplication contextualisée → quotient entier → modulo.

## Dette détectée dans P2

### 1. `and`, `or` et `not` étaient annoncés mais insuffisamment construits

Le cours utilisait `or`, tandis que plusieurs entraînements exigeaient `and` et `not`. Student Zero pouvait réussir par imitation sans comprendre la sémantique.

**Correction V1.8 :** une leçon distincte explique les trois opérateurs en langage naturel, puis les observe sur un même petit contexte.

### 2. Les frontières de seuil n’étaient pas une méthode assez visible

Le site indiquait de vérifier les frontières, mais l’élève n’avait pas encore une routine explicite.

**Correction V1.8 :** la méthode « juste avant / exactement au seuil / juste après » devient une leçon à part entière et est réutilisée dans les exercices.

### 3. L’intervalle fermé pouvait réintroduire un formalisme mathématique inutile

La notation `[a ; b]` est concise pour certains élèves, mais le but de l’exercice est la logique booléenne, pas la lecture d’une notation d’intervalle.

**Correction V1.8 :** l’énoncé dit en toutes lettres « compris entre a et b, bornes incluses », puis donne un exemple numérique concret. La notation mathématique n’est plus nécessaire pour comprendre la tâche.

### 4. L’année bissextile constituait un saut trop brutal

La formule logique condensée était élégante mais transformait un exercice de décision en défi de compression booléenne.

**Correction V1.8 :** la règle est entièrement fournie en trois décisions ordonnées : divisible par 400, sinon par 100, sinon par 4. La solution de référence suit volontairement cette structure avec plusieurs `if`, plus lisible pour un novice. La forme booléenne condensée pourra être comparée plus tard.

### 5. L’ordre des entraînements P2 a été recalibré

Le parcours va désormais de la frontière la plus simple vers les combinaisons logiques : seuil inclus → `or` → `or` + `not` → chaîne `if/elif` → combinaison de trois exigences avec `and` et `not`.

## PRIMM recalibré

Le « Make » de P1 était encore trop ouvert pour un tout premier module. Il est désormais borné par un nombre de lignes, des valeurs imposées et les seules opérations déjà vues. En P2, la prédiction oblige à calculer séparément la comparaison puis la condition complète avant d’annoncer la branche exécutée.

## Invariant sans spécialité mathématiques

P1 et P2 ne demandent aucune recherche de formule. Lorsqu’une formule est utilisée (conversion Fahrenheit/Celsius, nombre de pixels, etc.), elle est explicitement fournie. La difficulté évaluée reste : lire les données, traduire une règle, suivre une valeur, construire une condition et vérifier un cas frontière.

## Student Zero Gate automatique

`scripts/validate-student-zero.mjs` verrouille les décisions issues de cette passe :

- quatre étapes de cours minimum pour P1 et P2 ;
- `def` / `return`, `//` et `%` explicités avant leur emploi ;
- exercices cœur P1 uniquement en complétion guidée ;
- interdiction de réintroduire `str()` ou un retour tuple dans P1 ;
- règle bissextile décomposée et solution de référence lisible ;
- ordres d’entraînement P1/P2 fixés ;
- passerelles novice et PRIMM vérifiés.

Ce gate ne remplace pas un test avec de vrais élèves. Il empêche en revanche les régressions déjà identifiées avant ce test terrain.
