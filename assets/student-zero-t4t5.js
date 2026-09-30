// V1.17 — Student Zero Gate T4 → T5
// Build the graph model before BFS/DFS recipes.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT4T5(modules, practiceBank, primmBank, noviceBank) {
  const t5 = modules.find(module => module.id === 'T5');
  if (!t5) return;

  t5.duration = '160 min';
  t5.summary = 'Passer des arbres aux graphes sans confondre les deux modèles : sommets, arêtes/arcs, orientation, voisinage, cycles, représentation par dictionnaire, puis parcours DFS/BFS avec ensemble des visités.';
  t5.bo = 'Graphes : structures relationnelles ; représentations ; parcours en profondeur et en largeur ; cycles ; chemins ; plus court chemin dans un graphe non pondéré';
  t5.objectives = [
    'Distinguer clairement un arbre d’un graphe général',
    'Identifier sommets, arêtes, arcs, voisins, chemins et cycles sur un petit graphe',
    'Lire une représentation par dictionnaire de listes de voisins',
    'Distinguer graphe orienté et non orienté et vérifier la symétrie attendue dans le cas non orienté',
    'Expliquer pourquoi un ensemble de sommets visités est indispensable dès qu’un cycle est possible',
    'Comparer DFS avec une pile et BFS avec une file',
    'Utiliser BFS pour une distance minimale en nombre d’arêtes dans un graphe non pondéré'
  ];

  t5.lessons = [
    {
      title: 'Transition T4 → T5 : un graphe n’est pas « un arbre avec plus de branches »',
      html: 'Un arbre binaire possède une <strong>racine</strong>, chaque nœud a au plus deux fils, et la structure étudiée ne contient pas de cycle. Un <strong>graphe</strong> général ne possède pas forcément de racine, un sommet peut avoir un nombre quelconque de voisins, plusieurs chemins peuvent relier les mêmes sommets et des <strong>cycles</strong> peuvent exister. Il peut même être constitué de plusieurs parties non reliées.',
      code: `# Arbre : hiérarchie sans cycle\n#       A\n#      / \\\n#     B   C\n#\n# Graphe : relations générales\n# A ----- B\n#  \\     /\n#   \\   /\n#     C       ← A-B-C-A forme un cycle`
    },
    {
      title: 'Vocabulaire avant les algorithmes : sommet, arête, arc, voisin',
      html: 'Un <strong>sommet</strong> représente une entité. Dans un graphe <strong>non orienté</strong>, une <strong>arête</strong> relie deux sommets dans les deux sens. Dans un graphe <strong>orienté</strong>, un <strong>arc</strong> possède un sens. Deux sommets reliés sont voisins dans le cas non orienté ; dans le cas orienté, on parle souvent de successeur pour respecter le sens.',
      code: `# Non orienté : A --- B\n# A est voisin de B et B est voisin de A.\n#\n# Orienté : A ---> B\n# B est successeur de A, mais A n'est pas forcément successeur de B.`
    },
    {
      title: 'Chemin et cycle : la différence qui change tout',
      html: 'Un <strong>chemin</strong> est une suite de sommets reliés successivement. Un <strong>cycle</strong> permet de partir d’un sommet et d’y revenir en suivant des liens. Dans un arbre, la structure interdit ce retour cyclique. Dans un graphe, si l’algorithme suit les voisins sans mémoire, il peut donc tourner indéfiniment.',
      code: `# A --- B\n# |     |\n# D --- C\n#\n# A, B, C, D, A est un cycle.`
    },
    {
      title: 'Représentation par dictionnaire : une ligne = un sommet et ses voisins',
      html: 'Dans ce parcours, un graphe est souvent représenté par un dictionnaire : chaque clé est un sommet et la valeur associée est la liste de ses voisins ou successeurs. Il faut savoir lire cette structure avant de programmer un parcours. Dans un graphe non orienté, si B apparaît dans <code>g["A"]</code>, A doit aussi apparaître dans <code>g["B"]</code>.',
      code: `g = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D'],\n    'C': ['A', 'D'],\n    'D': ['B', 'C']\n}\n\n# g['A'] = ['B', 'C'] : B et C sont voisins de A.`
    },
    {
      title: 'Matrice d’adjacence : une autre représentation du même graphe',
      html: 'Le même graphe peut être représenté autrement, par exemple par une matrice d’adjacence. L’important est de distinguer le <strong>graphe</strong>, objet abstrait constitué de sommets et de liens, de sa <strong>représentation en Python</strong>. Comme en T3, interface conceptuelle et implantation ne doivent pas être confondues.',
      code: `# Sommets A, B, C\n#       A B C\n# A     0 1 1\n# B     1 0 0\n# C     1 0 0\n#\n# Ici 1 signifie : une arête relie les deux sommets.`
    },
    {
      title: 'Pourquoi « visites » devient indispensable',
      html: 'Dans un arbre, descendre vers les fils ne ramène jamais vers un ancêtre. Dans un graphe cyclique, un voisin peut conduire vers un sommet déjà rencontré. L’ensemble <code>visites</code> joue donc le rôle de mémoire : lorsqu’un sommet est découvert, on le marque afin de ne pas le remettre indéfiniment dans la frontière.',
      code: `g = {'A':['B','C'], 'B':['A','C'], 'C':['A','B']}\n\nvisites = {'A'}\n# Si B découvre A, A est déjà dans visites : on ne le rajoute pas.`
    },
    {
      title: 'La frontière : ce qui différencie DFS et BFS',
      html: 'Un parcours maintient une <strong>frontière</strong> contenant les sommets découverts mais pas encore traités. Si cette frontière est une <strong>pile</strong>, on obtient un parcours en profondeur (DFS) : on poursuit une branche avant de revenir. Si c’est une <strong>file</strong>, on obtient un parcours en largeur (BFS) : on traite les sommets par couches de distance croissante.',
      points: [
        'DFS → pile (LIFO) ou récursion',
        'BFS → file (FIFO)',
        'Dans les deux cas → mémoriser les sommets déjà découverts'
      ]
    },
    {
      title: 'DFS : aller loin, puis revenir',
      html: 'Pour un DFS itératif, le sommet de départ est placé dans une pile et marqué comme découvert. On dépile un sommet, puis on empile ses voisins encore inconnus. L’ordre exact de visite peut dépendre de l’ordre des listes de voisins, mais l’ensemble des sommets accessibles doit être correct.',
      code: `def dfs(g, depart):\n    visites = {depart}\n    pile = [depart]\n    while pile:\n        s = pile.pop()\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                pile.append(v)\n    return visites`
    },
    {
      title: 'BFS : explorer par couches avec une file',
      html: 'Le BFS traite d’abord le départ, puis tous les sommets à une arête, puis ceux à deux arêtes, etc. Pour éviter qu’un sommet soit enfilé plusieurs fois, on le marque <strong>au moment où il est découvert</strong>, avant de l’ajouter à la file.',
      code: `def bfs(g, depart):\n    visites = {depart}\n    file = [depart]  # implantation simple d'une file\n    ordre = []\n    while file:\n        s = file.pop(0)\n        ordre.append(s)\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                file.append(v)\n    return ordre`
    },
    {
      title: 'BFS et plus court chemin : uniquement dans un graphe non pondéré ici',
      html: 'Dans un graphe <strong>non pondéré</strong>, chaque arête compte pour une étape. Comme BFS explore par distance croissante, la première découverte d’un sommet fournit une distance minimale en nombre d’arêtes. Cette propriété ne signifie pas que BFS résout tous les problèmes de plus court chemin : ici aucune arête n’a de poids différent.',
      code: `# Si A→B→D demande 2 arêtes et A→C→E→D en demande 3,\n# BFS découvre D par la couche de distance 2 avant la couche 3.`
    },
    {
      title: 'Routine avant de coder un parcours de graphe',
      html: 'Avant d’écrire la boucle, réponds à cinq questions : <strong>1.</strong> quel est le sommet de départ ? <strong>2.</strong> comment obtenir ses voisins ? <strong>3.</strong> quelle structure représente la frontière : pile ou file ? <strong>4.</strong> quand un sommet devient-il visité ? <strong>5.</strong> quel résultat doit être produit : ensemble accessible, ordre, booléen, distance ou chemin ?'
    }
  ];

  const e1 = byId(t5.exercises, 'T5-E1');
  Object.assign(e1, {
    title: 'Lire un graphe non orienté : calculer le degré',
    level: 1,
    prompt: 'On représente un graphe non orienté par un dictionnaire <code>g</code> qui associe chaque sommet à la liste de ses voisins. Écris <code>degre(g, s)</code> qui renvoie le nombre de voisins du sommet <code>s</code>. Le sommet <code>s</code> est garanti présent dans le dictionnaire. Un sommet isolé possède une liste de voisins vide et son degré vaut donc 0.',
    starter: `def degre(g, s):\n    # g[s] est la liste des voisins de s.\n    pass`,
    tests: [
      {label:'deux voisins', expr:"degre({'A':['B','C'],'B':['A'],'C':['A']}, 'A') == 2"},
      {label:'un voisin', expr:"degre({'A':['B'],'B':['A']}, 'B') == 1"},
      {label:'sommet isolé', expr:"degre({'A':[]}, 'A') == 0"}
    ],
    hints: [
      'Commence par écrire ce que représente g[s] en français.',
      'Le degré d’un sommet dans ce graphe non orienté est simplement le nombre d’éléments de sa liste de voisins.'
    ],
    solution: `def degre(g, s):\n    return len(g[s])`
  });

  const e2 = byId(t5.exercises, 'T5-E2');
  Object.assign(e2, {
    title: 'DFS : parcourir malgré les cycles',
    level: 2,
    prompt: 'Écris <code>dfs(g, depart)</code> qui renvoie l’ensemble de tous les sommets accessibles depuis <code>depart</code>. Le graphe peut contenir des cycles. Utilise une pile pour la frontière et un ensemble <code>visites</code>. Marque un sommet comme visité dès sa découverte, avant de l’empiler, afin de ne pas ajouter plusieurs fois le même sommet.',
    starter: `def dfs(g, depart):\n    visites = {depart}\n    pile = [depart]\n    while pile:\n        s = pile.pop()\n        # Examiner les voisins de s.\n        # Pour chaque voisin nouveau : le marquer puis l'empiler.\n        pass\n    return visites`,
    tests: [
      {label:'chaîne accessible', expr:"dfs({'A':['B'],'B':['A','C'],'C':['B']}, 'A') == {'A','B','C'}"},
      {label:'cycle', expr:"dfs({'A':['B','C'],'B':['A','C'],'C':['A','B']}, 'A') == {'A','B','C'}"},
      {label:'composante seulement', expr:"dfs({'A':['B'],'B':['A'],'C':[]}, 'A') == {'A','B'}"}
    ],
    hints: [
      'À chaque itération, s est le sommet actuellement traité ; g[s] donne ses voisins.',
      'Pour un voisin v inconnu : visites.add(v), puis pile.append(v).'
    ],
    solution: `def dfs(g, depart):\n    visites = {depart}\n    pile = [depart]\n    while pile:\n        s = pile.pop()\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                pile.append(v)\n    return visites`
  });

  const e3 = byId(t5.exercises, 'T5-E3');
  Object.assign(e3, {
    title: 'BFS : distance minimale dans un graphe non pondéré',
    level: 3,
    prompt: 'Écris <code>distance(g, depart, arrivee)</code> pour un graphe non pondéré représenté par listes de voisins. La fonction renvoie le nombre minimal d’arêtes d’un chemin de <code>depart</code> à <code>arrivee</code>, ou <code>-1</code> si aucun chemin n’existe. Utilise un parcours en largeur. Chaque élément de la file est un couple <code>(sommet, distance_depuis_depart)</code>. Marque un voisin au moment où tu l’enfiles.',
    starter: `def distance(g, depart, arrivee):\n    file = [(depart, 0)]\n    visites = {depart}\n    while file:\n        s, d = file.pop(0)\n        # Si s est la cible, d est une distance minimale.\n        # Sinon découvre ses voisins encore inconnus.\n        pass\n    return -1`,
    tests: [
      {label:'distance 2', expr:"distance({'A':['B'],'B':['A','C'],'C':['B']}, 'A', 'C') == 2"},
      {label:'même sommet', expr:"distance({'A':[]}, 'A', 'A') == 0"},
      {label:'deux chemins : prendre le plus court', expr:"distance({'A':['B','C'],'B':['D'],'C':['E'],'D':[],'E':['F'],'F':['D']}, 'A', 'D') == 2"},
      {label:'inaccessible', expr:"distance({'A':[],'B':[]}, 'A', 'B') == -1"}
    ],
    hints: [
      'BFS traite les couples par distance croissante grâce au comportement FIFO de la file.',
      'Pour un voisin v nouveau découvert depuis une distance d, enfile (v, d + 1).'
    ],
    solution: `def distance(g, depart, arrivee):\n    file = [(depart, 0)]\n    visites = {depart}\n    while file:\n        s, d = file.pop(0)\n        if s == arrivee:\n            return d\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                file.append((v, d + 1))\n    return -1`
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T5');

  const x1 = byId(practice, 'T5-X1');
  Object.assign(x1, {
    title: 'Lire la liste des voisins', kind:'compléter', level:1,
    prompt: 'Complète <code>voisins(g, s)</code> pour renvoyer une <strong>nouvelle liste</strong> contenant les voisins du sommet <code>s</code>. Le dictionnaire <code>g</code> associe chaque sommet à sa liste de voisins et <code>s</code> est garanti présent. La copie évite qu’une modification ultérieure du résultat modifie directement la représentation du graphe.',
    starter: `def voisins(g, s):\n    return list(____________)`,
    tests: [
      {label:'deux voisins', expr:"voisins({'A':['B','C']}, 'A') == ['B','C']"},
      {label:'copie indépendante', expr:"(lambda g: (lambda r: (r.append('X'), g['A']))(voisins(g,'A')))( {'A':['B']} )[-1] == ['B']"}
    ],
    hints:['La liste des voisins du sommet s est stockée dans g[s].','list(g[s]) construit une nouvelle liste.'],
    solution:`def voisins(g, s):\n    return list(g[s])`
  });

  const x2 = byId(practice, 'T5-X2');
  Object.assign(x2, {
    title:'Repérer les sommets isolés', kind:'écrire', level:1,
    prompt:'Dans un graphe non orienté représenté par un dictionnaire de voisins, un sommet est <strong>isolé</strong> lorsque sa liste de voisins est vide. Écris <code>isoles(g)</code> qui renvoie l’ensemble de tous les sommets isolés. Parcours les clés du dictionnaire ; ne suppose pas que le graphe est connexe.',
    starter:`def isoles(g):\n    pass`,
    tests:[
      {label:'un isolé', expr:"isoles({'A':['B'],'B':['A'],'C':[]}) == {'C'}"},
      {label:'aucun', expr:"isoles({'A':['B'],'B':['A']}) == set()"},
      {label:'tous isolés', expr:"isoles({'A':[],'B':[]}) == {'A','B'}"}
    ],
    hints:['Crée un ensemble resultat vide.','Pour chaque sommet s, teste len(g[s]) == 0.'],
    solution:`def isoles(g):\n    resultat = set()\n    for s in g:\n        if len(g[s]) == 0:\n            resultat.add(s)\n    return resultat`
  });

  const x3 = byId(practice, 'T5-X3');
  Object.assign(x3, {
    title:'Déboguer un DFS cyclique', kind:'déboguer', level:2,
    prompt:'Le parcours ci-dessous empile les voisins sans vérifier s’ils ont déjà été découverts. Sur un graphe contenant un cycle, la frontière peut donc se remplir indéfiniment. Corrige le programme pour que chaque sommet soit marqué dans <code>visites</code> au moment de sa découverte et ne soit empilé qu’une seule fois.',
    starter:`def dfs(g, depart):\n    visites = {depart}\n    pile = [depart]\n    while pile:\n        s = pile.pop()\n        for v in g[s]:\n            pile.append(v)   # défaut : aucun contrôle\n    return visites`,
    tests:[
      {label:'cycle triangle', expr:"dfs({'A':['B','C'],'B':['A','C'],'C':['A','B']}, 'A') == {'A','B','C'}"},
      {label:'sommet seul', expr:"dfs({'A':[]}, 'A') == {'A'}"}
    ],
    hints:['Le test porte sur v, pas sur s : v not in visites.','Dans ce parcours, ajoute v à visites avant pile.append(v).'],
    solution:`def dfs(g, depart):\n    visites = {depart}\n    pile = [depart]\n    while pile:\n        s = pile.pop()\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                pile.append(v)\n    return visites`
  });

  const x4 = byId(practice, 'T5-X4');
  Object.assign(x4, {
    title:'Existe-t-il un chemin ?', kind:'écrire', level:2,
    prompt:'Écris <code>chemin_existe(g, depart, arrivee)</code> qui renvoie <code>True</code> s’il existe au moins un chemin de <code>depart</code> vers <code>arrivee</code>, et <code>False</code> sinon. Un DFS convient : on cherche seulement l’existence d’un chemin, pas le plus court. Le graphe peut contenir des cycles ; utilise donc un ensemble de sommets visités.',
    starter:`def chemin_existe(g, depart, arrivee):\n    pass`,
    tests:[
      {label:'chemin existe', expr:"chemin_existe({'A':['B'],'B':['C'],'C':[]}, 'A', 'C') is True"},
      {label:'inaccessible', expr:"chemin_existe({'A':[],'B':[]}, 'A', 'B') is False"},
      {label:'départ = arrivée', expr:"chemin_existe({'A':[]}, 'A', 'A') is True"},
      {label:'cycle sans cible', expr:"chemin_existe({'A':['B'],'B':['A'],'C':[]}, 'A', 'C') is False"}
    ],
    hints:['Si depart == arrivee, le chemin de longueur 0 suffit.','Parcours les sommets accessibles et renvoie True dès que la cible est rencontrée.'],
    solution:`def chemin_existe(g, depart, arrivee):\n    visites = {depart}\n    pile = [depart]\n    while pile:\n        s = pile.pop()\n        if s == arrivee:\n            return True\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                pile.append(v)\n    return False`
  });

  const x5 = byId(practice, 'T5-X5');
  Object.assign(x5, {
    title:'Reconstruire un plus court itinéraire', kind:'transfert', level:3,
    prompt:'Écris <code>itineraire(g, depart, arrivee)</code> qui renvoie un chemin contenant un nombre minimal d’arêtes, sous forme d’une liste de sommets du départ à l’arrivée. Le graphe est non pondéré. Utilise BFS : la file contient des couples <code>(sommet, chemin_jusque_la)</code>. Si la cible est inaccessible, renvoie <code>None</code>. Marque un sommet dès qu’il est enfilé pour ne pas produire plusieurs chemins concurrents vers la même découverte.',
    starter:`def itineraire(g, depart, arrivee):\n    pass`,
    tests:[
      {label:'un des deux chemins minimaux', expr:"itineraire({'A':['B','C'],'B':['D'],'C':['D'],'D':[]}, 'A', 'D') in (['A','B','D'], ['A','C','D'])"},
      {label:'même sommet', expr:"itineraire({'A':[]}, 'A', 'A') == ['A']"},
      {label:'impossible', expr:"itineraire({'A':[],'B':[]}, 'A', 'B') is None"}
    ],
    hints:['Initialise la file avec (depart, [depart]).','Pour un voisin v nouveau, le nouveau chemin vaut chemin + [v].'],
    solution:`def itineraire(g, depart, arrivee):\n    file = [(depart, [depart])]\n    visites = {depart}\n    while file:\n        s, chemin = file.pop(0)\n        if s == arrivee:\n            return chemin\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                file.append((v, chemin + [v]))\n    return None`
  });

  const primm = primmBank.find(item => item.moduleId === 'T5');
  if (primm) Object.assign(primm, {
    title:'Cycle, file et mémoire des découvertes',
    seed:`g = {\n    'A':['B','C'],\n    'B':['A','D'],\n    'C':['A','D'],\n    'D':['B','C']\n}\nfile = ['A']\nvisites = {'A'}\nordre = []\nwhile file:\n    s = file.pop(0)\n    ordre.append(s)\n    for v in g[s]:\n        if v not in visites:\n            visites.add(v)\n            file.append(v)\nprint(ordre)`,
    predict:'Sans exécuter, prédis la liste ordre. Trace après chaque tour le contenu de file et de visites. Explique pourquoi A n’est jamais réenfilé lorsque B ou C le rencontre.',
    investigate:[
      'Quelles arêtes du graphe permettent de revenir vers un sommet déjà découvert ?',
      'À quel moment précis un sommet est-il ajouté à visites : quand il entre dans la file ou quand il en sort ?',
      'Pourquoi une file produit-elle ici des couches de distance croissante depuis A ?'
    ],
    modify:'Ajoute un sommet E voisin de C et D. Prédis d’abord son moment de découverte puis vérifie qu’il n’est ajouté qu’une seule fois à la file.',
    make:'Construis un petit graphe contenant au moins un cycle, puis écris un BFS qui renvoie l’ordre de visite. Pour chaque ligne importante, ajoute un commentaire expliquant le rôle de la file ou de visites.'
  });

  const novice = noviceBank.find(item => item.moduleId === 'T5');
  if (novice) Object.assign(novice, {
    goal:'Passer d’une structure hiérarchique sans cycle à un réseau général, puis parcourir ce réseau en sachant exactement pourquoi la mémoire des sommets visités est nécessaire.',
    prerequisites:['Dictionnaires et ensembles','Pile et file vues en T3','Récursivité et arbres vus en T4'],
    vocabulary:[
      ['sommet','Entité du graphe, représentée ici par une clé du dictionnaire.'],
      ['arête / arc','Lien entre deux sommets ; une arête est sans direction, un arc possède un sens.'],
      ['voisin','Sommet directement relié au sommet courant dans un graphe non orienté.'],
      ['cycle','Chemin qui permet de revenir à un sommet déjà rencontré.'],
      ['visités','Ensemble mémorisant les sommets déjà découverts pour éviter les revisites.']
    ],
    harness:'Avant tout BFS ou DFS, dessine ou lis le petit graphe. Pour chaque sommet, sois capable de dire qui sont ses voisins. Ensuite seulement choisis une pile ou une file et décide quand le sommet devient visité.',
    worked:{
      title:'Explorer un réseau avec un cycle',
      problem:'Le graphe A-B-C-A contient un cycle. On veut partir de A et découvrir chaque sommet une seule fois.',
      steps:[
        ['1 · Représenter les relations','Le dictionnaire donne pour chaque sommet la liste de ses voisins.'],
        ['2 · Préparer mémoire et frontière','A est immédiatement placé dans visites et dans la file.'],
        ['3 · Découvrir sans dupliquer','Quand un voisin est déjà dans visites, on ne le remet pas dans la file.'],
        ['4 · Comprendre le rôle de FIFO','Les sommets découverts en premier sont traités en premier : le parcours avance par couches.']
      ],
      code:`g = {'A':['B','C'], 'B':['A','C'], 'C':['A','B']}\nfile = ['A']\nvisites = {'A'}\nwhile file:\n    s = file.pop(0)\n    print(s)\n    for v in g[s]:\n        if v not in visites:\n            visites.add(v)\n            file.append(v)`
    },
    checks:[
      {q:'Pourquoi un arbre binaire de T4 n’avait-il pas besoin du même mécanisme visites pour ses parcours récursifs classiques ?',options:['Parce qu’un arbre n’a jamais de nœud','Parce que la structure descend vers des sous-arbres sans cycle','Parce que Python mémorise tout automatiquement','Parce qu’une file est interdite'],answer:1,explain:'Dans l’arbre étudié, descendre vers les fils ne permet pas de revenir vers un ancêtre. Un graphe général peut contenir des cycles.'},
      {q:'Dans un graphe non orienté, si B figure dans g["A"], que doit-on normalement retrouver ?',options:['A dans g["B"]','B deux fois dans g["A"]','A absent de tout le graphe','Une matrice obligatoire'],answer:0,explain:'Une arête non orientée relie A et B dans les deux sens ; la représentation par listes de voisins est donc symétrique.'},
      {q:'Quel parcours garantit une distance minimale en nombre d’arêtes dans un graphe non pondéré ?',options:['BFS avec une file','DFS avec une pile','N’importe quel parcours sans mémoire','Le tri par insertion'],answer:0,explain:'BFS explore les sommets par couches de distance croissante à partir du départ.'}
    ]
  });
}
