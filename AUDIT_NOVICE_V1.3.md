# PYTHON//FORGE — Audit pédagogique novice V1.3

## Finalité

Cet audit évalue l’application comme si elle était utilisée par un élève de Première NSI qui apprend Python, y compris un élève ne suivant pas la spécialité mathématiques. Le critère n’est pas « le code fonctionne-t-il ? », mais « un novice peut-il construire un modèle mental correct, comprendre ses erreurs et devenir progressivement autonome ? ».

## Références de conception

- Programmes NSI Première et Terminale en vigueur, via Éduscol et le Bulletin officiel.
- PRIMM (Predict, Run, Investigate, Modify, Make), approche de Sue Sentance : commencer par lire et expliquer du code avant d’exiger une production autonome.
- Parsons Problems : échafaudage utile lorsque la production à partir d’une page blanche surcharge le novice.
- Recherche sur le code tracing : suivre les variables et expliciter leur rôle aide à corriger des conceptions erronées.
- Recherche sur les messages d’erreur : les messages bruts sont une difficulté importante pour les novices ; ils doivent être appris et accompagnés plutôt que masqués.
- Retrieval practice : récupérer activement une connaissance après un délai est plus formateur qu’une simple relecture.

Sources de référence :
- https://www.raspberrypi.org/teach/pedagogy
- https://www.raspberrypi.org/blog/using-primm-to-teach-programming-a-new-short-course-for-educators/
- https://icer2024.acm.org/details/icer-2024-papers/20/Scaffolding-Novices-Analyzing-When-and-How-Parsons-Problems-Impact-Novice-Programmin
- https://icer2023.acm.org/details/icer-2023-papers/24/Evaluating-Beacons-the-Role-of-Variables-Tracing-and-Abstract-Tracing-for-Teaching
- https://comped.acm.org/working-groups-2/
- https://ies.ed.gov/ncee/WWC/Study/67306
- https://eduscol.education.gouv.fr/5823/programmes-et-ressources-en-numerique-et-sciences-informatiques-voie-g

## Diagnostic de la V1.2

### Points solides à conserver

1. 20 modules alignés sur la progression Python/algorithmique NSI.
2. 160 exercices Python plus 4 applications intégratives.
3. Diversité des formats : compléter, déboguer, écrire, transférer.
4. Ateliers PRIMM dans les 20 modules.
5. Tremplin Parsons après une première tentative.
6. Réactivation espacée et progression locale.
7. Garde-fou explicite : aucune spécialité mathématiques requise ; une formule utile est fournie.
8. Pyodide isolé dans un Web Worker et fonctionnement hors ligne préparé.

### Défauts bloquants ou importants détectés

#### A — Prérequis cachés dans les premiers modules

Les modules P1, P2 et P3 travaillent correctement les expressions, conditions et boucles, mais les exercices sont encapsulés dans des fonctions avec `def` et `return`, alors que les fonctions ne sont étudiées explicitement qu’en P4. Pour un élève déjà à l’aise, ce cadre est transparent ; pour un débutant, il constitue une charge cognitive parasite.

**Correction V1.3 :** chaque passerelle P1-P3 explique explicitement que `def` / `return` servent de cadre de test et ne sont pas encore la compétence évaluée.

#### B — Fuites de notions futures dans la banque P1

Deux exercices supplémentaires P1 introduisaient des notions non encore stabilisées : conversion `str()` et retour d’un tuple.

**Correction V1.3 :** remplacement par deux exercices centrés uniquement sur `//` et `%`, sans chaîne construite ni tuple.

#### C — Contradiction avec le garde-fou « slices non exigibles »

La solution de référence de P9-E1 utilisait `tab[1:]`, alors que la page Programme indique que les slices ne sont pas exigibles en Première.

**Correction V1.3 :** parcours explicite des indices `range(1, len(tab))` dans la solution de référence.

#### D — Cours trop bref avant certaines productions

Les blocs de cours sont efficaces pour réviser, mais parfois trop courts pour un vrai novice. Un élève peut connaître la définition d’un concept sans posséder encore le plan d’action nécessaire pour résoudre un exercice.

**Correction V1.3 :** un exemple résolu à trois sous-objectifs est ajouté dans chacun des 20 modules. L’exemple explicite le raisonnement avant le code.

#### E — Vocabulaire informatique insuffisamment consolidé

Un novice peut réussir un test automatique tout en restant incapable d’expliquer « paramètre », « alias », « clé étrangère », « variant », etc.

**Correction V1.3 :** chaque module possède trois notions que l’élève doit savoir reformuler avec une définition courte et contextualisée.

#### F — Absence de contrôle conceptuel juste avant la production

La V1.2 dispose de questions flash globales, mais pas d’un contrôle très court, local au module, entre l’exemple et les exercices.

**Correction V1.3 :** trois micro-questions par module, soit 60 questions de récupération active avec feedback explicatif. Elles ne bloquent jamais l’accès au code.

#### G — Message d’erreur trop brut pour certains novices

Le message Python doit rester visible, mais une erreur telle que `NameError`, `TypeError` ou `IndexError` n’indique pas spontanément à un débutant quelle première action entreprendre.

**Correction V1.3 :** un coach de débogage s’ajoute au message original. Il traduit le type de problème et propose une première action, sans donner la solution de l’exercice.

## Architecture pédagogique cible V1.3

Pour chaque module :

1. objectif en langage élève ;
2. prérequis réels et limités ;
3. vocabulaire à savoir expliquer ;
4. exemple résolu avec sous-objectifs ;
5. trois micro-questions de récupération active ;
6. PRIMM ;
7. exercices cœur ;
8. cinq variations d’entraînement ;
9. Parsons si blocage ;
10. solution seulement après tentative ;
11. réactivation espacée ultérieure.

Le chemin visé devient donc :

**lire → prédire → expliquer → répondre → modifier → produire → tester → déboguer → transférer → réactiver**.

## Politique « sans spécialité mathématiques »

- aucune formule à découvrir comme prérequis implicite ;
- lorsqu’un calcul est utile, la relation nécessaire est fournie ;
- les contextes mathématiques ne doivent pas masquer la compétence informatique évaluée ;
- priorité aux contextes données, jeux, messages, sécurité, médias, capteurs, fichiers, réseaux et applications ;
- la complexité est expliquée par ordres de grandeur et évolution du nombre d’étapes, sans formalisme mathématique inutile.

## Gate automatisé

`scripts/validate-novice.mjs` vérifie :

- une passerelle novice pour chacun des 20 modules ;
- trois micro-questions par module ;
- un exemple résolu et trois sous-objectifs par module ;
- un vocabulaire minimum ;
- l’explication du cadre `def` / `return` en P1-P3 ;
- l’absence de `str()` dans le nouvel P1-X2 ;
- l’absence de tuple anticipé dans P1-X4 ;
- l’absence de slice dans la solution de P9-E1.

La V1.3 ne prétend pas qu’un gate automatique remplace un test avec de vrais élèves. Il garantit uniquement que les choix pédagogiques structurants ne régressent pas silencieusement.
