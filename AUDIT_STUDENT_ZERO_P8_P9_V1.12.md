# Audit Student Zero — Transition P8 → P9 — V1.12

## Objet

Éprouver la transition entre **données tabulaires/CSV** et **algorithmes classiques** pour un élève de Première NSI qui connaît les notions des modules précédents mais ne dispose d’aucun raccourci implicite.

Le risque principal était de transformer P9 en catalogue de recettes : minimum avec slice, dichotomie sans précondition de tri explicitée, coût décrit de façon vague, tri appris comme une suite d’instructions sans invariant.

## Défauts relevés avant correction

1. `P9-E1` utilisait `tab[1:]` dans la solution alors que les slices sont explicitement non exigibles dans le parcours.
2. La notion de **meilleur courant** n’était pas suffisamment formalisée pour relier extremum et parcours linéaire.
3. Le coût était évoqué mais sans objet de comptage suffisamment concret.
4. La dichotomie indiquait qu’une liste devait être triée, mais cette propriété n’était pas traitée comme une **précondition** à vérifier mentalement avant d’appliquer l’algorithme.
5. Le rôle de `m + 1` et `m - 1` n’était pas assez relié à la terminaison.
6. Le tri par sélection n’avait pas de leçon dédiée expliquant la zone déjà fixée.
7. Le tri par insertion existait dans la banque d’entraînement mais sans être préparé par un modèle mental explicite dans le cours.
8. Le passage P8 → P9 n’expliquait pas clairement la différence entre **organiser les données** et **choisir une stratégie algorithmique** pour les traiter.

## Corrections V1.12

### Transition P8 → P9

Une leçon passerelle montre comment une colonne d’une table devient une liste ordinaire, puis change la question pédagogique : P8 organise les données ; P9 étudie les étapes nécessaires pour les traiter.

### Parcours et extremum

- meilleur courant initialisé par le premier élément ;
- précondition de non-vacuité explicite ;
- parcours `range(1, len(tab))` ;
- aucun slice ;
- cas unitaire et valeurs répétées testés.

### Coût

Le cours compte désormais des opérations observables : valeurs examinées et comparaisons. Le minimum sur `n` valeurs est relié à `n - 1` comparaisons ; une recherche séquentielle peut examiner jusqu’à `n` valeurs. Le chronométrage machine n’est pas utilisé comme définition du coût.

### Dichotomie

- précondition « liste triée par ordre croissant » répétée dans le cours, les exercices et le PRIMM ;
- zone `[g, d]` expliquée comme zone possible ;
- milieu déjà testé exclu avec `m + 1` ou `m - 1` ;
- terminaison reliée à la diminution stricte de la zone ;
- liste vide testée ;
- activité `est_trie` placée avant le débogage dichotomique dans l’entraînement.

### Tris

Le tri par sélection et le tri par insertion disposent chacun d’un modèle mental explicite et d’un invariant. Les solutions restent écrites avec boucles, indices, comparaisons et échanges/décalages. `min`, `sorted`, `sort` et les slices ne sont pas nécessaires.

## Ordre d’entraînement P9

1. recherche séquentielle ;
2. vérifier si une liste est triée ;
3. déboguer une dichotomie ;
4. tri par insertion ;
5. transfert glouton.

Cet ordre évite de demander une dichotomie avant que la précondition de tri soit réellement comprise.

## Garde-fou automatisé

`scripts/validate-student-zero-p8p9.mjs` bloque notamment :

- le retour d’un slice dans les codes d’apprentissage et solutions P9 ;
- un `P9-E1` qui ne parcourt plus explicitement les indices ;
- une dichotomie sans précondition triée, sans réduction stricte ou sans test du cas vide ;
- un tri par sélection masqué derrière `sorted`/`sort` ;
- un ordre d’entraînement qui replacerait la dichotomie avant la vérification du tri ;
- une passerelle novice ou un PRIMM qui oublierait la précondition.

## Critère de sortie

La transition est considérée acceptable uniquement si les gates existants et le nouveau **Student Zero P8/P9 gate** passent simultanément : syntaxe, intégrité du contenu, 164 solutions/tests, gates novices antérieurs, contrôle éditorial, contraste, fiabilité Classroom et runtime Pyodide.
