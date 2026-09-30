# Audit transversal Terminale T1 → T11 — V1.24

## Objet

Cette passe ne cherche plus un défaut local de module. Elle examine le parcours Terminale comme le vivrait un élève sur plusieurs mois : dépendances entre notions, charge cognitive, stabilité du vocabulaire, qualité du transfert, réactivation des acquis et préparation réaliste au baccalauréat.

## Références de cadrage

- Programme NSI Terminale en vigueur : BO spécial n°8 du 25 juillet 2019.
- Ressources Éduscol NSI : structures de données, récursivité, modularité, tests, graphes, arbres, SQL, diviser pour régner, programmation dynamique, Boyer-Moore.
- Épreuve terminale NSI à compter de la session 2027 : note de service du 11 septembre 2026, BO spécial n°4 du 17 septembre 2026.

Le format 2027 change la manière de préparer l’élève : l’écrit dure 3 h 30 et comporte trois exercices indépendants ; la maîtrise de la langue et la formulation du raisonnement comptent explicitement pour 2 points sur 20. La pratique dure 1 h et consiste à programmer une application à partir d’un document, avec dialogue avec l’examinateur. La note finale donne un poids de 75 % à l’écrit et 25 % à la pratique.

## Diagnostic transversal

### 1. Dépendances : bonne progression locale, dette de visibilité globale

Les Student Zero successifs ont sécurisé chaque passage adjacent, mais l’élève ne voyait pas encore clairement que certaines notions reviennent plusieurs modules plus tard :

- T1 récursivité → T4 arbres, T9 diviser pour régner, T10 top-down ;
- T2 objets → T3 structures abstraites et T4 représentation des nœuds ;
- T3 piles/files → T4 parcours en largeur et T5 DFS/BFS ;
- T7 contrats/tests → T9, T10, T11 ;
- T9 sous-problèmes → T10 chevauchement et réutilisation ;
- T10 information mémorisée → T11 information tirée d’un échec de comparaison.

**Action V1.24 :** carte de dépendances T1→T11 visible dans l’interface et bloc de réactivation ciblée au début de chaque module Terminale.

### 2. Charge cognitive : le risque n’est plus la syntaxe, mais l’empilement des modèles mentaux

Les modules T4, T5, T8, T9, T10 et T11 concentrent plusieurs changements de représentation. La solution retenue n’est pas d’ajouter encore davantage de cours, mais de limiter la réactivation à deux ou trois notions directement utiles avant le nouveau module.

**Action V1.24 :** chaque module possède désormais une passerelle transversale explicite « ce qu’il faut remettre en mémoire » et un pont conceptuel vers la nouvelle notion.

### 3. Vocabulaire : pas de contradiction majeure, mais besoin d’un lexique canonique

Onze notions pivots ont été figées pour éviter les glissements de sens : cas de base, instance/objet, interface/implémentation, sous-arbre, visités, relation, test de régression, décidable, combiner, état, alignement.

**Action V1.24 :** vocabulaire canonique transversal accessible depuis le parcours Terminale et validé en CI.

### 4. Répétitions : conserver la réactivation, supprimer la sensation de refaire le même exercice

Le parcours contient déjà trois exercices cœur + cinq entraînements + un PRIMM par module. Cette quantité est suffisante pour la répétition espacée, mais le transfert doit varier davantage les contextes.

**Action V1.24 :** aucune nouvelle série mécanique par module. L’effort est déplacé vers les applications intégratives, les questions écrites argumentées et les liens entre modules.

### 5. Transfert : quatre applications de 60 min étaient insuffisantes pour couvrir le spectre Terminale

Les quatre premières applications couvraient bien listes/dictionnaires, POO/file, graphes/BFS et débogage, mais laissaient peu de place aux arbres, SQL, diviser pour régner, programmation dynamique et recherche textuelle.

**Action V1.24 :** la banque passe à neuf applications originales de 60 min. Les nouvelles situations ajoutent :

- arbre de diagnostic d’un robot — T1/T4 ;
- médiathèque et requêtes SQL sûres — T6/T7 ;
- fusion de journaux triés — T1/T7/T9 ;
- drone avec zones bloquées — T7/T10 ;
- scanner de signature textuelle — T7/T11.

T8 reste volontairement traité dans le versant écrit et conceptuel : le forcer dans une application pratique aurait créé une activité artificielle.

### 6. Préparation Bac : dette majeure détectée sur l’argumentation écrite et le dialogue

Le site préparait déjà fortement à écrire et tester du code, mais moins à expliquer un raisonnement en phrases complètes. Or la note de service 2027 donne explicitement une place à la langue écrite et prévoit un dialogue pendant la pratique.

**Action V1.24 :**

- 11 questions écrites express, une par module T1→T11, avec critères attendus masqués ;
- 3 questions de dialogue après chaque application intégrative ;
- affichage explicite du format 2027 : 3 h 30 / trois exercices / 2 points de langue ; 1 h pratique / application / dialogue ; pondération 75/25.

### 7. Limite de périmètre à ne pas masquer

PYTHON//FORGE reste un outil centré sur Python, structures de données, bases de données et algorithmique. Il ne couvre pas à lui seul l’ensemble de la préparation écrite NSI, notamment les rubriques systèmes, architectures matérielles et réseaux.

**Action V1.24 :** cette limite est désormais affichée dans le mode Bac et dans les notes de périmètre du site.

## Garde-fou permanent

Le script `scripts/validate-terminale-transversal.mjs` bloque désormais les régressions suivantes :

- ordre T1→T11 rompu ;
- module sans 5 entraînements, PRIMM ou progression niveaux 1/2/3 ;
- dépendance Terminale circulaire ou orientée vers un module futur ;
- vocabulaire canonique incomplet ;
- module absent des 11 questions écrites ;
- disparition des paramètres officiels du Bac 2027 ;
- application sans 3 questions de dialogue ;
- perte de couverture pratique T1–T7 et T9–T11 ;
- oubli du périmètre systèmes/réseaux ;
- assets transversaux absents du cache hors ligne.

## Critère de sortie de la V1.24

La V1.24 est acceptable seulement si :

1. toutes les solutions Python, entraînements et applications passent leurs tests ;
2. le nouveau Transversal Gate est vert ;
3. le Quality Gate global reste vert ;
4. le cache hors ligne contient les nouveaux assets ;
5. GitHub Pages se déploie sans erreur.
