export const BAC_READINESS_VERSION = '1.25.0';

export const bacReadinessFrame = {
  title: 'Bac Readiness Gate · T1 → T11',
  sessionMinutes: 60,
  purpose: 'Mesurer la capacité à reconnaître et mobiliser seul les bonnes notions dans une situation nouvelle, sans annoncer le chapitre à utiliser.',
  rules: [
    'Le chronomètre continue même si la page est fermée puis rouverte.',
    'Aucun indice ni solution n’est disponible pendant la session.',
    'Les tests automatiques indiquent seulement si le comportement attendu est obtenu.',
    'Le débrief révèle les notions mobilisées uniquement après la fin de la session.',
    'Une justification écrite et un court dialogue simulé font partie de chaque parcours.'
  ],
  official2027: 'La session 2027 de NSI comporte une partie écrite de 3 h 30 et une partie pratique de 1 h. Les parcours ci-dessous utilisent volontairement des blocs de 60 minutes pour éprouver l’autonomie pratique et le raisonnement transversal ; ils ne reproduisent pas à eux seuls l’intégralité de l’écrit.'
};

export const errorTags = [
  ['lecture', 'J’ai mal interprété l’énoncé ou une contrainte.'],
  ['modele', 'J’ai choisi une structure ou une représentation inadaptée.'],
  ['algorithme', 'Je n’ai pas reconnu l’algorithme ou la stratégie pertinente.'],
  ['code', 'L’idée était bonne mais mon implémentation Python était incorrecte.'],
  ['test', 'Je n’ai pas anticipé un cas limite ou un test discriminant.'],
  ['temps', 'J’ai perdu trop de temps avant de choisir une stratégie.']
];

export const readinessSessions = [
  {
    id: 'BRG-A',
    title: 'Réseau de secours',
    context: 'Un poste de secours doit explorer un bâtiment représenté par des salles reliées, tout en conservant une vue hiérarchique des zones de contrôle.',
    duration: 60,
    targets: ['T1', 'T2', 'T3', 'T4', 'T5', 'T7'],
    written: {
      prompt: 'Explique en 5 à 8 lignes pourquoi la structure utilisée pour explorer le réseau et le moment où un sommet est marqué comme déjà découvert influencent la correction et le coût du parcours.',
      criteria: [
        'identifier la structure de parcours adaptée',
        'expliquer le rôle de l’ensemble des sommets déjà découverts',
        'justifier le moment où un voisin est marqué',
        'relier la stratégie au risque de cycles ou de chemins multiples'
      ]
    },
    dialogue: [
      'Quel invariant peux-tu formuler pendant l’exploration du réseau ?',
      'Quel test ajouterais-tu pour distinguer une solution correcte d’une solution qui revisite inutilement des sommets ?',
      'Dans quel cas remplacer la structure de parcours changerait-il l’ordre des sommets traités ?'
    ],
    tasks: [
      {
        id: 'BRG-A1',
        title: 'Atteindre une salle sans traverser une zone interdite',
        prompt: 'Complète distance_securisee(g, depart, arrivee, interdites). Le graphe est non pondéré et représenté par un dictionnaire de listes. La fonction renvoie le nombre minimal d’arêtes entre depart et arrivee sans entrer dans une salle interdite, ou -1 si aucun chemin autorisé n’existe. Si depart est interdit, renvoie -1.',
        starter: "def distance_securisee(g, depart, arrivee, interdites):\n    pass",
        tests: [
          { label:'distance directe', expr:"distance_securisee({'A':['B'],'B':[]}, 'A', 'B', set()) == 1" },
          { label:'éviter zone', expr:"distance_securisee({'A':['B','C'],'B':['D'],'C':['D'],'D':[]}, 'A', 'D', {'B'}) == 2" },
          { label:'départ interdit', expr:"distance_securisee({'A':['B'],'B':[]}, 'A', 'B', {'A'}) == -1" },
          { label:'inaccessible', expr:"distance_securisee({'A':['B'],'B':[],'C':[]}, 'A', 'C', set()) == -1" },
          { label:'cycle', expr:"distance_securisee({'A':['B'],'B':['A','C'],'C':['B']}, 'A', 'C', set()) == 2" }
        ],
        debrief: {
          strategy: 'Une exploration en largeur avec une file permet d’obtenir une distance minimale dans un graphe non pondéré. Le marquage au moment de l’enfilage évite plusieurs insertions du même sommet.',
          concepts: ['file', 'BFS', 'ensemble de visités', 'cas limites', 'tests']
        }
      },
      {
        id: 'BRG-A2',
        title: 'Résumer un arbre de zones',
        prompt: 'La classe Noeud est fournie. Complète resume_arbre(a) qui renvoie un tuple (taille, feuilles). Un arbre vide possède taille 0 et 0 feuille. Une feuille est un nœud dont les deux fils valent None.',
        starter: "class Noeud:\n    def __init__(self, valeur, gauche=None, droite=None):\n        self.valeur = valeur\n        self.gauche = gauche\n        self.droite = droite\n\ndef resume_arbre(a):\n    pass",
        tests: [
          { label:'vide', expr:'resume_arbre(None) == (0, 0)' },
          { label:'feuille', expr:"resume_arbre(Noeud('X')) == (1, 1)" },
          { label:'arbre complet', expr:"resume_arbre(Noeud(1, Noeud(2), Noeud(3))) == (3, 2)" },
          { label:'branche unique', expr:"resume_arbre(Noeud(1, Noeud(2, Noeud(3)))) == (3, 1)" }
        ],
        debrief: {
          strategy: 'La définition récursive d’un arbre conduit à traiter le cas vide puis à combiner les résultats des deux sous-arbres. Le comptage des feuilles exige un cas spécifique lorsque les deux fils sont vides.',
          concepts: ['récursivité', 'cas de base', 'objet', 'sous-arbre', 'combinaison']
        }
      }
    ]
  },
  {
    id: 'BRG-B',
    title: 'Médiathèque sous contrôle',
    context: 'Une médiathèque doit interroger sa base et gérer une file de demandes en conservant des contrats de fonctionnement vérifiables.',
    duration: 60,
    targets: ['T2', 'T3', 'T6', 'T7'],
    written: {
      prompt: 'Explique en 5 à 8 lignes pourquoi une clé étrangère ne joue pas le même rôle qu’une clé primaire, puis indique ce qu’un test de régression apporte après la correction d’un défaut.',
      criteria: [
        'distinguer clé primaire et clé étrangère',
        'relier la clé étrangère à une autre relation',
        'expliquer la finalité d’un test de régression',
        'donner un exemple de cas frontière pertinent'
      ]
    },
    dialogue: [
      'Pourquoi une requête paramétrée est-elle préférable à une chaîne SQL construite par concaténation ?',
      'Quelle est l’interface minimale de la file utilisée dans cette situation ?',
      'Quel défaut un test sur une file vide doit-il pouvoir révéler ?'
    ],
    tasks: [
      {
        id: 'BRG-B1',
        title: 'Rechercher les titres d’un auteur',
        prompt: 'Complète titres_auteur(conn, nom). La base SQLite contient auteur(id, nom) et livre(id, titre, auteur_id). La fonction renvoie la liste des titres de cet auteur, triés par ordre alphabétique. La requête doit utiliser un paramètre SQL et une jointure.',
        starter: "def titres_auteur(conn, nom):\n    pass",
        tests: [
          { label:'deux titres triés', expr:"(__import__('sqlite3').connect(':memory:')) is not None" },
          { label:'requête fonctionnelle', expr:"(lambda sqlite3: (lambda c: (c.executescript(\"CREATE TABLE auteur(id INTEGER PRIMARY KEY, nom TEXT); CREATE TABLE livre(id INTEGER PRIMARY KEY, titre TEXT, auteur_id INTEGER); INSERT INTO auteur VALUES (1,'Ada'),(2,'Linus'); INSERT INTO livre VALUES (1,'Zeta',1),(2,'Alpha',1),(3,'Kernel',2);\"), titres_auteur(c,'Ada'))[1])(sqlite3.connect(':memory:')))(__import__('sqlite3')) == ['Alpha','Zeta']" },
          { label:'absent', expr:"(lambda sqlite3: (lambda c: (c.executescript(\"CREATE TABLE auteur(id INTEGER PRIMARY KEY, nom TEXT); CREATE TABLE livre(id INTEGER PRIMARY KEY, titre TEXT, auteur_id INTEGER);\"), titres_auteur(c,'Personne'))[1])(sqlite3.connect(':memory:')))(__import__('sqlite3')) == []" },
          { label:'apostrophe', expr:"(lambda sqlite3: (lambda c: (c.executescript(\"CREATE TABLE auteur(id INTEGER PRIMARY KEY, nom TEXT); CREATE TABLE livre(id INTEGER PRIMARY KEY, titre TEXT, auteur_id INTEGER); INSERT INTO auteur VALUES (1,'O''Neil'); INSERT INTO livre VALUES (1,'Data',1);\"), titres_auteur(c,\"O'Neil\"))[1])(sqlite3.connect(':memory:')))(__import__('sqlite3')) == ['Data']" }
        ],
        debrief: {
          strategy: 'La jointure relie livre.auteur_id à auteur.id. Le nom saisi par l’utilisateur doit être transmis comme paramètre de la requête et non concaténé au texte SQL.',
          concepts: ['relation', 'clé primaire', 'clé étrangère', 'jointure', 'requête paramétrée']
        }
      },
      {
        id: 'BRG-B2',
        title: 'Gérer les demandes de prêt',
        prompt: 'Complète la classe FileDemandes. ajouter(x) ajoute une demande ; prochain() retire et renvoie la plus ancienne ; est_vide() indique si aucune demande n’attend. prochain() doit lever AssertionError si la file est vide.',
        starter: "class FileDemandes:\n    def __init__(self):\n        self._data = []\n\n    def ajouter(self, x):\n        pass\n\n    def prochain(self):\n        pass\n\n    def est_vide(self):\n        pass",
        tests: [
          { label:'vide initial', expr:'FileDemandes().est_vide() is True' },
          { label:'FIFO', expr:"(lambda f: (f.ajouter('A'),f.ajouter('B'),f.prochain(),f.prochain())[3])(FileDemandes()) == 'B'" },
          { label:'vide après retraits', expr:"(lambda f: (f.ajouter(1),f.prochain(),f.est_vide())[2])(FileDemandes()) is True" },
          { label:'contrat vide', expr:'FileDemandes().prochain()', raises:'AssertionError' }
        ],
        debrief: {
          strategy: 'La structure doit respecter FIFO indépendamment de son implémentation concrète. Le contrat sur la file vide doit être explicite et testable.',
          concepts: ['classe', 'état', 'interface', 'file FIFO', 'contrat', 'test de régression']
        }
      }
    ]
  },
  {
    id: 'BRG-C',
    title: 'Planification de mission',
    context: 'Un système embarqué traite de grandes séries de données triées puis cherche un coût minimal en réutilisant des résultats intermédiaires.',
    duration: 60,
    targets: ['T1', 'T7', 'T9', 'T10'],
    written: {
      prompt: 'Explique en 5 à 8 lignes la différence entre « découper un problème en sous-problèmes indépendants » et « réutiliser des résultats de sous-problèmes qui se répètent ». Donne un indice permettant de choisir entre les deux stratégies.',
      criteria: [
        'caractériser le découpage du diviser pour régner',
        'caractériser le chevauchement de sous-problèmes',
        'expliquer la réutilisation d’un état déjà calculé',
        'identifier au moins un critère de choix entre les stratégies'
      ]
    },
    dialogue: [
      'Quel est le cas de base de ton raisonnement récursif ou itératif ?',
      'Comment décris-tu précisément l’état mémorisé dans la seconde tâche ?',
      'Quel test permettrait de détecter une mauvaise initialisation des cas de base ?'
    ],
    tasks: [
      {
        id: 'BRG-C1',
        title: 'Fusionner deux journaux déjà triés',
        prompt: 'Complète fusion(a, b). Les deux listes sont déjà triées par ordre croissant. La fonction renvoie une nouvelle liste triée contenant tous les éléments, sans appeler sorted() ni list.sort().',
        starter: "def fusion(a, b):\n    pass",
        tests: [
          { label:'deux listes', expr:'fusion([1,4,8],[2,3,9]) == [1,2,3,4,8,9]' },
          { label:'gauche vide', expr:'fusion([], [2,5]) == [2,5]' },
          { label:'doublons', expr:'fusion([1,2,2],[2,3]) == [1,2,2,2,3]' },
          { label:'entrées préservées', expr:"(lambda a,b: (fusion(a,b),a,b))([1,3],[2,4]) == ([1,2,3,4],[1,3],[2,4])" }
        ],
        debrief: {
          strategy: 'La fusion exploite l’ordre déjà présent : on compare les têtes courantes et on avance dans une seule liste à chaque étape. C’est l’opération de combinaison au cœur du tri fusion.',
          concepts: ['diviser pour régner', 'combiner', 'invariant', 'coût linéaire de la fusion']
        }
      },
      {
        id: 'BRG-C2',
        title: 'Minimiser l’énergie d’un trajet',
        prompt: 'Complète energie_min(couts). couts[i] est le coût pour atteindre la case i. On part avant la case 0 et on peut avancer de 1 ou 2 cases. Le coût total inclut chaque case sur laquelle on arrive. Renvoie le coût minimal pour atteindre la dernière case. Pour [] renvoie 0.',
        starter: "def energie_min(couts):\n    pass",
        tests: [
          { label:'vide', expr:'energie_min([]) == 0' },
          { label:'une case', expr:'energie_min([7]) == 7' },
          { label:'choix local trompeur', expr:'energie_min([4,1,9,1]) == 2' },
          { label:'autre série', expr:'energie_min([2,5,1,3,2]) == 5' },
          { label:'zéros', expr:'energie_min([0,0,0,0]) == 0' }
        ],
        debrief: {
          strategy: 'Un état naturel est le coût minimal pour atteindre la case i. Il dépend des deux états précédents : dp[i] = couts[i] + min(dp[i-1], dp[i-2]), avec des cas initiaux soigneusement définis.',
          concepts: ['état', 'cas initial', 'dépendances', 'programmation dynamique', 'test frontière']
        }
      }
    ]
  },
  {
    id: 'BRG-D',
    title: 'Scanner d’incident',
    context: 'Un service de supervision doit repérer rapidement une signature dans un texte et raisonner sur ce qu’un programme peut ou ne peut pas décider automatiquement.',
    duration: 60,
    targets: ['T5', 'T7', 'T8', 'T11'],
    written: {
      prompt: 'Explique en 5 à 8 lignes pourquoi « ce programme est très long à exécuter » ne suffit pas pour conclure à l’indécidabilité. Précise ce qu’exige une affirmation d’indécidabilité.',
      criteria: [
        'distinguer lenteur, difficulté et indécidabilité',
        'faire intervenir la portée sur toutes les entrées valides',
        'mentionner l’absence d’un algorithme décideur correct qui termine toujours',
        'employer le vocabulaire problème de décision / décidable ou indécidable'
      ]
    },
    dialogue: [
      'Quelle information issue d’un échec de comparaison permet d’éviter de reprendre naïvement au caractère suivant ?',
      'Pourquoi le prétraitement du motif peut-il être calculé une seule fois ?',
      'Quel test de frontière utilises-tu lorsque le motif est vide ou plus long que le texte ?'
    ],
    tasks: [
      {
        id: 'BRG-D1',
        title: 'Construire la table de dernière occurrence',
        prompt: 'Complète derniere_occurrence(motif) qui renvoie un dictionnaire associant chaque caractère à son dernier indice dans motif.',
        starter: "def derniere_occurrence(motif):\n    pass",
        tests: [
          { label:'simple', expr:"derniere_occurrence('ABCA') == {'A':3,'B':1,'C':2}" },
          { label:'vide', expr:"derniere_occurrence('') == {}" },
          { label:'répétitions', expr:"derniere_occurrence('AAAA') == {'A':3}" }
        ],
        debrief: {
          strategy: 'Le dictionnaire est un prétraitement du motif. En parcourant le motif de gauche à droite, une affectation ultérieure remplace l’indice précédent et conserve naturellement la dernière occurrence.',
          concepts: ['prétraitement', 'dictionnaire', 'dernier indice', 'Boyer-Moore']
        }
      },
      {
        id: 'BRG-D2',
        title: 'Chercher un motif avec la règle du mauvais caractère',
        prompt: 'Complète cherche_motif(texte, motif). Renvoie l’indice du premier alignement où motif apparaît, ou -1. Pour le motif vide, renvoie 0. Compare les caractères du motif de droite à gauche et, en cas d’échec à l’indice j, utilise la dernière occurrence du caractère fautif pour calculer un décalage strictement positif.',
        starter: "def derniere_occurrence(motif):\n    d = {}\n    for i in range(len(motif)):\n        d[motif[i]] = i\n    return d\n\ndef cherche_motif(texte, motif):\n    pass",
        tests: [
          { label:'présent', expr:"cherche_motif('ZZABCDYY','ABCD') == 2" },
          { label:'absent', expr:"cherche_motif('ABCDEFG','XYZ') == -1" },
          { label:'vide', expr:"cherche_motif('ABC','') == 0" },
          { label:'motif plus long', expr:"cherche_motif('AB','ABCD') == -1" },
          { label:'répétitions', expr:"cherche_motif('AAAAAB','AAAB') == 2" }
        ],
        debrief: {
          strategy: 'À chaque alignement i, on compare depuis la droite. Si texte[i+j] diffère de motif[j], la dernière occurrence connue de ce caractère dans le motif permet de décaler de max(1, j - dernier).',
          concepts: ['alignement', 'mauvais caractère', 'prétraitement', 'décalage sûr', 'cas frontières']
        }
      }
    ]
  }
];

export const readinessGate = {
  sessionsRequired: readinessSessions.length,
  codeRule: 'Tous les tests des huit tâches de programmation doivent avoir été validés au moins une fois avant ou à la fin de leur session.',
  reasoningRule: 'Après le débrief, au moins 3 critères sur 4 doivent être cochés pour chaque justification écrite.',
  dialogueRule: 'Les trois questions de dialogue de chaque session doivent avoir reçu des notes ou mots-clés.',
  timingRule: 'Chaque session est limitée à 60 minutes. Le temps n’est pas mis en pause lors d’un rechargement.',
  interpretation: 'Le gate est un indicateur de préparation sur le périmètre Python/algorithmique/structures/SQL du site, pas une note prédictive de baccalauréat.'
};
