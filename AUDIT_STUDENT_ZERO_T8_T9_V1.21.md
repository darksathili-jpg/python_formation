# AUDIT STUDENT ZERO — T8 → T9 — V1.21

## Objet

La transition **T8 → T9** fait passer l’élève d’un chapitre très conceptuel — paradigmes, programme comme donnée, calculabilité et décidabilité — à une activité algorithmique concrète : **méthode « diviser pour régner » et raisonnement sur le coût**.

Le risque principal identifié est double :

1. faire croire que la complexité est une nouvelle partie des mathématiques à apprendre avant de pouvoir programmer ;
2. faire mémoriser `O(n log n)` ou « tri fusion = n log n » sans être capable de reconstruire pourquoi.

La V1.21 reconstruit donc T9 autour d’un enchaînement observable :

**taille de l’entrée → cas de base → division → sous-problèmes → combinaison → nombre de niveaux → travail par niveau → ordre de grandeur du coût**.

---

## Ancrage programme

Programme Terminale NSI en vigueur :

- https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g
- https://eduscol.education.fr/document/30010/download

Ressource officielle « Diviser pour régner » :

- https://eduscol.education.fr/document/10100/download

La ressource Éduscol présente explicitement :

- **Diviser** l’entrée en morceaux ;
- **Résoudre** récursivement les sous-problèmes ;
- **Combiner** les résultats ;
- et rappelle que le **cas de base** est indispensable.

Le programme demande d’écrire un algorithme utilisant cette méthode. Le tri fusion permet en outre de réinvestir la récursivité et de mettre en évidence un coût en **n log n dans le pire des cas**. La V1.21 reste strictement dans ce niveau attendu : elle n’introduit ni théorème maître, ni résolution formelle de récurrence, ni calcul avancé de logarithmes.

---

## Diagnostic de la version précédente

Le module T9 précédent comportait de bons ingrédients techniques — fusion, tri fusion, réduction par moitié — mais présentait plusieurs fragilités pour un élève novice :

- la transition avec T8 n’explicitait pas assez la différence entre **« existence d’un algorithme »** et **« efficacité d’un algorithme existant »** ;
- le coût apparaissait trop vite sous forme d’étiquettes `n²`, `n log n`, `log n` ;
- `moities(8) == 4` comptait aussi le passage `1 → 0`, ce qui brouillait la lecture du nombre de niveaux du découpage ;
- le tri fusion était présenté avant que l’élève ne dispose d’un modèle mental solide de **taille du problème** et de **travail par niveau** ;
- l’idée fausse « couper en deux rend forcément plus rapide » n’était pas suffisamment attaquée ;
- aucun garde-fou permanent ne garantissait que la complexité reste expliquée sans dériver vers un formalisme mathématique non exigé.

---

## Modèle mental retenu

### 1. Revenir de T8 vers un problème concret

T8 pose :

> Existe-t-il un algorithme universel qui résout ce problème ?

T9 pose ensuite :

> Si un algorithme existe, comment son travail grandit-il lorsque l’entrée grandit ?

Cette rupture empêche la confusion :

**indécidable ≠ lent** et **calculable ≠ efficace**.

### 2. Toujours définir la taille avant le coût

La variable `n` est présentée comme une mesure concrète : nombre d’éléments d’une liste, nombre de caractères, etc.

On refuse les formulations du type « cet algorithme est rapide » sans préciser comment le travail évolue avec `n`.

### 3. Quatre questions pour diviser pour régner

L’élève doit savoir répondre à :

1. **Cas de base** — quand sait-on répondre directement ?
2. **Diviser** — comment produit-on des problèmes plus petits ?
3. **Résoudre** — quels sous-problèmes sont réellement traités ?
4. **Combiner** — comment reconstitue-t-on la réponse ?

### 4. Le logarithme est d’abord une trace de tailles

Aucun appel à `math.log` n’est nécessaire.

Pour `n = 8` :

`8 → 4 → 2 → 1`

Il y a **3 divisions**. Pour `n = 1024`, il y en a **10**.

Le symbole `log₂(n)` n’est introduit qu’après cette observation comme une écriture compacte de ce nombre de réductions par moitié.

### 5. Une récurrence reste une phrase sur le programme

L’écriture :

`T(n) ≈ 2 × T(n/2) + travail_de_combinaison`

n’est utilisée que pour lire l’algorithme : deux sous-problèmes de moitié de taille, puis une combinaison. Aucune résolution formelle n’est demandée.

### 6. Diviser ne signifie pas automatiquement accélérer

Deux contrastes sont installés :

- **dichotomie** : une seule moitié est poursuivie ;
- **comptage par division** : les deux moitiés sont traitées, donc tous les éléments sont finalement examinés.

Cela empêche l’élève d’associer mécaniquement « récursif + moitié » à « logarithmique ».

### 7. Reconstruire n log n

Pour le tri fusion :

- environ `log₂(n)` niveaux ;
- sur un niveau complet, les fusions traitent au total environ `n` éléments ;
- donc l’ordre de grandeur est `n × log₂(n)`.

L’objectif est que l’élève puisse **reconstruire cette phrase**, pas seulement réciter le résultat.

---

## Refonte des exercices cœur

### T9-E1 — Combiner

Fusion de deux listes déjà triées avec deux indices.

Compétence : comprendre ce que coûte l’étape de combinaison.

### T9-E2 — Tri fusion complet

Le squelette demande explicitement :

- cas de base ;
- division ;
- deux appels récursifs ;
- combinaison par `fusion`.

La liste source doit rester inchangée.

### T9-E3 — Niveaux de réduction

`niveaux_moitie(8) == 3` et `niveaux_moitie(1024) == 10`.

L’ancien décompte qui allait jusqu’à `0` est supprimé afin d’aligner le compteur sur les niveaux réels nécessaires pour atteindre une taille triviale.

---

## Refonte des entraînements

- **T9-X1** : fusion complète ;
- **T9-X2** : débogage du cas de base ;
- **T9-X3** : visualisation `8 → 4 → 2 → 1` ;
- **T9-X4** : division en deux avec traitement des deux moitiés — contre-exemple à « diviser = plus rapide » ;
- **T9-X5** : dichotomie récursive — une seule moitié est poursuivie.

La banque couvre ainsi à la fois la structure de la méthode et le raisonnement sur le travail réellement effectué.

---

## PRIMM

Le PRIMM T9 utilise une somme par division récursive avant le tri fusion.

Cette situation volontairement simple permet de faire apparaître sans surcharge :

- les tailles `4 → 2 → 1` ;
- le cas de base ;
- les deux appels récursifs ;
- la combinaison `gauche + droite` ;
- le fait que les deux moitiés sont traitées.

L’élève doit donc comprendre le schéma avant de gérer simultanément le tri et la fusion.

---

## Passerelle novice

La passerelle T9 précise explicitement :

> Aucune spécialité mathématiques requise.

Le logarithme y est lu comme un **nombre de divisions par deux**, puis le tri fusion est expliqué avec la relation :

**nombre de niveaux × travail d’un niveau**.

Trois micro-questions vérifient :

1. le nombre de divisions pour passer de 8 à 1 ;
2. l’origine du facteur `n` dans le tri fusion ;
3. l’erreur « couper en deux garantit une amélioration ».

---

## Garde-fou automatique V1.21

Le fichier `scripts/validate-student-zero-t8t9.mjs` vérifie notamment :

- présence de la transition calculabilité → complexité ;
- définition explicite de la taille `n` ;
- quatre rôles : cas de base / diviser / résoudre / combiner ;
- interprétation concrète de `log₂(n)` ;
- distinction une moitié / deux moitiés ;
- reconstruction qualitative de `n log n` ;
- absence de `math.log` comme prérequis ;
- absence de théorème maître ;
- cas de base correct du tri fusion ;
- conservation de la liste source ;
- PRIMM et passerelle novice alignés.

Le workflow `.github/workflows/student-zero-t8t9.yml` est volontairement **indépendant du numéro de release** afin de continuer à protéger cette transition dans les versions ultérieures.

---

## Critère de réussite pédagogique

Un élève ayant validé T9 doit pouvoir expliquer, sans formule apprise par cœur :

> « Le tri fusion coupe la liste jusqu’à des morceaux de taille 1. Il y a environ autant de niveaux que de divisions par deux nécessaires pour atteindre 1. Quand on remonte, chaque niveau de fusion traite au total les n éléments. C’est pour cela que le travail est de l’ordre de n log n. »

S’il peut produire cette explication et relier chaque phrase au code, la notion est installée au niveau attendu en Terminale NSI.
