// V1.16 — Student Zero Gate T3 → T4
// Build the tree model before recursive algorithms.

function byId(list, id) {
  return list.find(item => item.id === id);
}

const NOEUD = `class Noeud:
    def __init__(self, valeur, gauche=None, droite=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droite = droite`;

export function applyStudentZeroT3T4(modules, practiceBank, primmBank, noviceBank) {
  const t4 = modules.find(module => module.id === 'T4');
  if (!t4) return;

  t4.duration = '145 min';
  t4.summary = 'Construire un modèle mental précis des arbres binaires avant de programmer : vocabulaire, structure récursive, taille/hauteur, parcours puis arbres binaires de recherche.';
  t4.bo = 'Arbres : structures hiérarchiques ; arbres binaires ; algorithmes sur les arbres binaires et les arbres binaires de recherche';
  t4.objectives = [
    'Identifier racine, nœud, feuille, fils, sous-arbre et arbre vide sur un exemple',
    'Lire un arbre comme un nœud accompagné de deux sous-arbres qui sont eux-mêmes des arbres',
    'Expliquer ce que représente chaque appel récursif avant d’écrire la fonction',
    'Calculer taille et hauteur avec une convention explicitement annoncée',
    'Distinguer parcours préfixe, infixe, suffixe et parcours en largeur',
    'Exploiter la propriété d’ordre d’un arbre binaire de recherche pour chercher ou insérer une valeur'
  ];

  t4.lessons = [
    {
      title: 'Transition T3 → T4 : d’une structure linéaire à une structure hiérarchique',
      html: 'En T3, pile et file imposaient un ordre de sortie sur une suite d’éléments. Un arbre organise au contraire les données en <strong>branches</strong>. Il n’existe donc plus un unique « élément suivant » : depuis un nœud, on peut avoir un sous-arbre gauche et un sous-arbre droit. Les piles et files restent utiles plus tard pour parcourir cette structure.',
      code: `# Une file est linéaire : A → B → C
# Un arbre se ramifie :
#       A
#      / \\
#     B   C`
    },
    {
      title: 'Le vocabulaire avant l’algorithme',
      html: 'Sur un arbre, un <strong>nœud</strong> contient une valeur. Le nœud tout en haut est la <strong>racine</strong>. Un nœud sans fils est une <strong>feuille</strong>. Les nœuds reliés juste en dessous sont ses <strong>fils</strong>. Tout ce qui part d’un fils forme un <strong>sous-arbre</strong>. L’absence de nœud est l’<strong>arbre vide</strong>, représenté ici par <code>None</code>.',
      code: `#       A        ← racine
#      / \\
#     B   C      ← B et C sont les fils de A
#        / \\
#       D   E    ← B, D et E sont des feuilles
#
# Le sous-arbre droit de A a pour racine C.`
    },
    {
      title: 'Un arbre binaire est une structure récursive',
      html: 'Un arbre binaire est soit vide, soit formé d’un nœud et de <strong>deux sous-arbres</strong> — gauche et droit — qui sont eux-mêmes des arbres binaires. C’est cette définition qui justifie la récursion. On ne récite donc pas « appel gauche + appel droit » : chaque appel signifie « résoudre exactement le même problème sur ce sous-arbre ».',
      code: `${NOEUD}

a = Noeud('A',
          Noeud('B'),
          Noeud('C', Noeud('D'), Noeud('E')))`
    },
    {
      title: 'Avant chaque récursion : nommer le sous-problème',
      html: 'Pour éviter les recettes, impose-toi une phrase avant d’écrire un appel récursif. Dans <code>taille(a.gauche)</code>, la phrase est : « calcule le nombre de nœuds du sous-arbre gauche de a ». Dans <code>taille(a.droite)</code> : « calcule le nombre de nœuds du sous-arbre droit ». Le résultat du nœud courant se construit ensuite à partir de ces deux réponses.',
      code: `def taille(a):
    if a is None:
        return 0
    gauche = taille(a.gauche)  # taille du sous-arbre gauche
    droite = taille(a.droite) # taille du sous-arbre droit
    return 1 + gauche + droite`
    },
    {
      title: 'Taille : compter le nœud courant et ses deux sous-arbres',
      html: 'La <strong>taille</strong> est le nombre total de nœuds. L’arbre vide contient 0 nœud. Un arbre non vide contient 1 nœud courant, plus tous les nœuds de son sous-arbre gauche, plus tous ceux de son sous-arbre droit. Le cas de base et la combinaison correspondent directement à la définition de l’arbre.',
      code: `taille(None) = 0

taille(A)
= 1 + taille(sous-arbre gauche de A)
    + taille(sous-arbre droit de A)`
    },
    {
      title: 'Hauteur : annoncer la convention avant de calculer',
      html: 'Plusieurs conventions existent dans les ouvrages. <strong>Dans PYTHON//FORGE, la hauteur est le nombre de nœuds du plus long chemin racine-feuille</strong> : arbre vide → 0, feuille → 1. L’élève doit toujours lire la convention d’un énoncé avant de programmer. Pour un nœud non vide, on garde la plus grande hauteur des deux sous-arbres puis on ajoute 1.',
      code: `def hauteur(a):
    if a is None:
        return 0
    hg = hauteur(a.gauche)
    hd = hauteur(a.droite)
    return 1 + max(hg, hd)`
    },
    {
      title: 'Parcours en profondeur : la position du nœud change l’ordre',
      html: 'Les trois parcours en profondeur utilisent la même structure récursive ; seule la position du traitement du nœud courant change. <strong>Préfixe</strong> : nœud, gauche, droite. <strong>Infixe</strong> : gauche, nœud, droite. <strong>Suffixe</strong> : gauche, droite, nœud. Il faut savoir prédire l’ordre sur un petit arbre avant de coder.',
      points: [
        'Préfixe : N-G-D',
        'Infixe : G-N-D',
        'Suffixe / postfixe : G-D-N'
      ],
      code: `#       A
#      / \\
#     B   C
#
# préfixe : A, B, C
# infixe  : B, A, C
# suffixe : B, C, A`
    },
    {
      title: 'Parcours en largeur : T3 revient avec une file',
      html: 'Le parcours en largeur ne descend pas récursivement dans une branche complète. Il traite l’arbre <strong>niveau par niveau</strong>. On retrouve donc naturellement la file de T3 : la racine est enfilée, puis chaque nœud défilé fait enfiler ses fils non vides. Ce lien montre qu’une structure abstraite choisie pour son comportement devient un outil algorithmique.',
      code: `#       A
#      / \\
#     B   C
#    /     \\
#   D       E
#
# largeur : A, B, C, D, E`
    },
    {
      title: 'ABR : ajouter une propriété d’ordre à l’arbre binaire',
      html: 'Un <strong>arbre binaire de recherche (ABR)</strong> est un arbre binaire qui respecte une propriété d’ordre. Dans ce parcours, toutes les valeurs du sous-arbre gauche sont strictement plus petites que la valeur du nœud, et toutes celles du sous-arbre droit sont strictement plus grandes. Cette propriété permet de choisir <strong>un seul sous-arbre</strong> lors d’une recherche.',
      code: `#        8
#       / \\
#      3   12
#     / \\    \\
#    1   6    15
#
# Chercher 6 : 6 < 8 → gauche ; 6 > 3 → droite.`
    },
    {
      title: 'Chercher ou insérer dans un ABR : justifier chaque direction',
      html: 'À chaque nœud d’un ABR, trois cas suffisent : valeur trouvée ; valeur cherchée plus petite → sous-arbre gauche ; valeur cherchée plus grande → sous-arbre droit. Pour l’insertion, atteindre <code>None</code> signifie que l’on a trouvé la place du nouveau nœud. L’élève doit pouvoir justifier la direction choisie avant d’écrire l’appel récursif.'
    }
  ];

  const e1 = byId(t4.exercises, 'T4-E1');
  Object.assign(e1, {
    title: 'Taille : un appel = un sous-arbre',
    level: 1,
    prompt: 'Avec la classe <code>Noeud</code> fournie, écris <code>taille(a)</code> qui renvoie le nombre total de nœuds de l’arbre binaire <code>a</code>. <code>None</code> représente l’arbre vide et doit renvoyer 0. Pour un nœud non vide, compte le nœud courant puis les nœuds de chacun de ses deux sous-arbres.',
    starter: `${NOEUD}

def taille(a):
    if a is None:
        return 0
    # taille(a.gauche) = nombre de nœuds du sous-arbre gauche
    # taille(a.droite) = nombre de nœuds du sous-arbre droit
    pass`,
    tests: [
      {label:'arbre vide', expr:'taille(None) == 0'},
      {label:'une feuille', expr:'taille(Noeud(5)) == 1'},
      {label:'cinq nœuds', expr:"taille(Noeud('A', Noeud('B'), Noeud('C', Noeud('D'), Noeud('E')))) == 5"}
    ],
    hints: [
      'Commence par dire en français ce que représente taille(a.gauche).',
      'Un arbre non vide contient 1 nœud courant + la taille du sous-arbre gauche + la taille du sous-arbre droit.'
    ],
    solution: `${NOEUD}

def taille(a):
    if a is None:
        return 0
    return 1 + taille(a.gauche) + taille(a.droite)`
  });

  const e2 = byId(t4.exercises, 'T4-E2');
  Object.assign(e2, {
    title: 'Parcours infixe : gauche → nœud → droite',
    level: 2,
    prompt: 'Écris <code>infixe(a)</code> qui renvoie la liste des valeurs d’un arbre binaire dans l’ordre infixe : d’abord toutes les valeurs du sous-arbre gauche, puis la valeur du nœud courant, puis toutes les valeurs du sous-arbre droit. L’arbre vide renvoie une liste vide.',
    starter: `${NOEUD}

def infixe(a):
    if a is None:
        return []
    gauche = infixe(a.gauche)
    # Construis ensuite : gauche + [valeur courante] + droite
    pass`,
    tests: [
      {label:'vide', expr:'infixe(None) == []'},
      {label:'un nœud', expr:"infixe(Noeud('A')) == ['A']"},
      {label:'ordre infixe', expr:"infixe(Noeud('A', Noeud('B'), Noeud('C'))) == ['B','A','C']"}
    ],
    hints: [
      'infixe(a.gauche) représente déjà toute la liste du sous-arbre gauche dans le bon ordre.',
      'Assemble gauche + [a.valeur] + infixe(a.droite).'
    ],
    solution: `${NOEUD}

def infixe(a):
    if a is None:
        return []
    return infixe(a.gauche) + [a.valeur] + infixe(a.droite)`
  });

  const e3 = byId(t4.exercises, 'T4-E3');
  Object.assign(e3, {
    title: 'ABR : chercher en choisissant un seul sous-arbre',
    level: 3,
    prompt: 'Écris <code>contient_abr(a, x)</code> pour un arbre binaire de recherche contenant des valeurs toutes distinctes. La fonction renvoie <code>True</code> si <code>x</code> est présent et <code>False</code> sinon. À chaque nœud, utilise la propriété d’ordre pour poursuivre uniquement à gauche ou uniquement à droite ; ne parcours jamais les deux sous-arbres lorsque la valeur courante est différente de <code>x</code>.',
    starter: `${NOEUD}

def contient_abr(a, x):
    if a is None:
        return False
    if a.valeur == x:
        return True
    # x < a.valeur : un seul sous-arbre est possible.
    # x > a.valeur : l'autre sous-arbre est possible.
    pass`,
    tests: [
      {label:'vide', expr:'contient_abr(None, 4) is False'},
      {label:'présent', expr:'contient_abr(Noeud(8, Noeud(3, Noeud(1), Noeud(6)), Noeud(12)), 6) is True'},
      {label:'absent', expr:'contient_abr(Noeud(8, Noeud(3, Noeud(1), Noeud(6)), Noeud(12)), 7) is False'}
    ],
    hints: [
      'Si x < a.valeur, la propriété de l’ABR interdit x dans le sous-arbre droit.',
      'Sinon x > a.valeur : cherche uniquement dans le sous-arbre droit.'
    ],
    solution: `${NOEUD}

def contient_abr(a, x):
    if a is None:
        return False
    if a.valeur == x:
        return True
    if x < a.valeur:
        return contient_abr(a.gauche, x)
    return contient_abr(a.droite, x)`
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T4');

  const x1 = byId(practice, 'T4-X1');
  Object.assign(x1, {
    title: 'Compter les feuilles',
    kind: 'écrire', level: 1,
    prompt: 'Écris récursivement <code>feuilles(a)</code>. Une feuille est un nœud dont les deux sous-arbres sont vides. L’arbre vide contient 0 feuille ; une feuille compte pour 1 ; sinon le nombre de feuilles est la somme des feuilles du sous-arbre gauche et du sous-arbre droit.',
    starter: `${NOEUD}

def feuilles(a):
    pass`,
    tests: [
      {label:'vide', expr:'feuilles(None) == 0'},
      {label:'une feuille', expr:'feuilles(Noeud(4)) == 1'},
      {label:'trois feuilles', expr:'feuilles(Noeud(1, Noeud(2), Noeud(3, Noeud(4), Noeud(5)))) == 3'}
    ],
    hints: ['Commence par le cas a is None.', 'Une feuille vérifie a.gauche is None and a.droite is None.'],
    solution: `${NOEUD}

def feuilles(a):
    if a is None:
        return 0
    if a.gauche is None and a.droite is None:
        return 1
    return feuilles(a.gauche) + feuilles(a.droite)`
  });

  const x2 = byId(practice, 'T4-X2');
  Object.assign(x2, {
    title: 'Déboguer une hauteur : ne pas additionner les branches',
    kind: 'déboguer', level: 2,
    prompt: 'Dans ce module, la hauteur est le nombre de nœuds du plus long chemin racine-feuille : arbre vide → 0, feuille → 1. La fonction ci-dessous additionne à tort les hauteurs gauche et droite. Corrige uniquement le calcul final pour conserver la branche la plus haute.',
    starter: `${NOEUD}

def hauteur(a):
    if a is None:
        return 0
    hg = hauteur(a.gauche)
    hd = hauteur(a.droite)
    return 1 + hg + hd`,
    tests: [
      {label:'vide', expr:'hauteur(None) == 0'},
      {label:'feuille', expr:'hauteur(Noeud(1)) == 1'},
      {label:'branche de trois niveaux', expr:'hauteur(Noeud(1, Noeud(2, Noeud(3)), Noeud(4))) == 3'}
    ],
    hints: ['La hauteur suit un seul chemin racine-feuille, pas tous les nœuds.', 'Utilise max(hg, hd).'],
    solution: `${NOEUD}

def hauteur(a):
    if a is None:
        return 0
    hg = hauteur(a.gauche)
    hd = hauteur(a.droite)
    return 1 + max(hg, hd)`
  });

  const x3 = byId(practice, 'T4-X3');
  Object.assign(x3, {
    title: 'Passer de l’infixe au préfixe',
    kind: 'compléter', level: 2,
    prompt: 'Complète <code>prefixe(a)</code>. En parcours préfixe, la valeur du nœud courant vient avant le sous-arbre gauche puis le sous-arbre droit : nœud → gauche → droite. L’arbre vide renvoie <code>[]</code>.',
    starter: `${NOEUD}

def prefixe(a):
    if a is None:
        return []
    return ____________ + prefixe(a.gauche) + prefixe(a.droite)`,
    tests: [
      {label:'vide', expr:'prefixe(None) == []'},
      {label:'ordre', expr:"prefixe(Noeud('A', Noeud('B'), Noeud('C'))) == ['A','B','C']"}
    ],
    hints: ['Le nœud courant doit apparaître avant les deux appels récursifs.', 'Utilise [a.valeur].'],
    solution: `${NOEUD}

def prefixe(a):
    if a is None:
        return []
    return [a.valeur] + prefixe(a.gauche) + prefixe(a.droite)`
  });

  const x4 = byId(practice, 'T4-X4');
  Object.assign(x4, {
    title: 'Minimum d’un ABR : suivre uniquement les fils gauches',
    kind: 'écrire', level: 2,
    prompt: 'Dans un ABR non vide à valeurs distinctes, toutes les valeurs plus petites sont à gauche. Écris <code>minimum_abr(a)</code> qui suit les fils gauches jusqu’au premier nœud qui n’en possède plus, puis renvoie sa valeur. Ne construis aucun parcours complet.',
    starter: `${NOEUD}

def minimum_abr(a):
    assert a is not None
    pass`,
    tests: [
      {label:'un nœud', expr:'minimum_abr(Noeud(8)) == 8'},
      {label:'minimum profond', expr:'minimum_abr(Noeud(8, Noeud(3, Noeud(1), Noeud(6)), Noeud(12))) == 1'}
    ],
    hints: ['Tant que a.gauche existe, déplace a vers ce fils.', 'Le premier nœud sans fils gauche contient le minimum.'],
    solution: `${NOEUD}

def minimum_abr(a):
    assert a is not None
    while a.gauche is not None:
        a = a.gauche
    return a.valeur`
  });

  const x5 = byId(practice, 'T4-X5');
  Object.assign(x5, {
    title: 'Insérer dans un ABR',
    kind: 'transfert', level: 3,
    prompt: 'Écris récursivement <code>insere(a, x)</code> dans un ABR où <code>x</code> est absent. Si <code>a</code> est vide, crée et renvoie un nouveau nœud contenant <code>x</code>. Sinon, si <code>x < a.valeur</code>, remplace <code>a.gauche</code> par le sous-arbre gauche après insertion ; si <code>x > a.valeur</code>, fais de même à droite. Renvoie toujours la racine <code>a</code> de l’arbre courant.',
    starter: `${NOEUD}

def insere(a, x):
    if a is None:
        return Noeud(x)
    # Choisis un seul sous-arbre grâce à l'ordre de l'ABR.
    pass`,
    tests: [
      {label:'arbre vide', expr:'insere(None, 5).valeur == 5'},
      {label:'insertion gauche', expr:'insere(Noeud(8), 3).gauche.valeur == 3'},
      {label:'insertion droite', expr:'insere(Noeud(8), 12).droite.valeur == 12'},
      {label:'racine conservée', expr:'insere(Noeud(8, Noeud(3)), 6).valeur == 8'}
    ],
    hints: ['L’appel récursif renvoie la nouvelle racine du sous-arbre modifié.', 'Après avoir modifié gauche ou droite, renvoie a.'],
    solution: `${NOEUD}

def insere(a, x):
    if a is None:
        return Noeud(x)
    if x < a.valeur:
        a.gauche = insere(a.gauche, x)
    else:
        a.droite = insere(a.droite, x)
    return a`
  });

  const primm = primmBank.find(item => item.moduleId === 'T4');
  if (primm) Object.assign(primm, {
    title: 'Chaque appel travaille sur un sous-arbre précis',
    seed: `${NOEUD}

def taille(a, niveau=0):
    if a is None:
        print('  ' * niveau + 'vide -> 0')
        return 0
    print('  ' * niveau + 'entre dans', a.valeur)
    g = taille(a.gauche, niveau + 1)
    d = taille(a.droite, niveau + 1)
    print('  ' * niveau + 'quitte', a.valeur, 'avec', 1 + g + d)
    return 1 + g + d

a = Noeud('A', Noeud('B'), Noeud('C'))
print('taille =', taille(a))`,
    predict: 'Sans exécuter, dessine d’abord l’arbre puis prédis l’ordre des messages « entre dans », « vide » et « quitte ». Pour chaque appel, indique quel sous-arbre il reçoit.',
    investigate: [
      'Que représente exactement taille(a.gauche, niveau + 1) lorsque a vaut A ?',
      'Pourquoi les messages « quitte » apparaissent-ils après les appels sur les deux sous-arbres ?',
      'Quelle valeur renvoie un appel qui reçoit None ?',
      'À quel moment le résultat du nœud A peut-il être calculé ?'
    ],
    modify: 'Remplace le calcul de taille par un calcul de hauteur avec la convention vide=0, feuille=1, tout en conservant les traces d’entrée et de sortie.',
    make: 'Écris une fonction récursive feuilles(a) en annotant chaque appel par une courte phrase expliquant ce que représente le sous-arbre reçu.'
  });

  const novice = noviceBank.find(item => item.moduleId === 'T4');
  if (novice) Object.assign(novice, {
    goal: 'Lire un arbre avant de programmer dessus : nommer chaque élément, reconnaître les sous-arbres et donner un sens précis à chaque appel récursif.',
    prerequisites: ['Récursivité T1 : cas de base, progression, remontée', 'Classes T2 : objets et attributs', 'Pile/file T3 pour comprendre le parcours en largeur'],
    vocabulary: [
      ['nœud', 'Objet de l’arbre qui contient une valeur et éventuellement deux sous-arbres.'],
      ['racine', 'Nœud situé au sommet de l’arbre ; c’est le point d’entrée de la structure.'],
      ['feuille', 'Nœud dont le sous-arbre gauche et le sous-arbre droit sont tous deux vides.'],
      ['fils', 'Nœud directement relié sous un autre nœud ; dans un arbre binaire il existe au plus un fils gauche et un fils droit.'],
      ['sous-arbre', 'Arbre complet dont la racine est un fils du nœud courant.'],
      ['arbre vide', 'Absence de nœud, représentée par None dans ce parcours.']
    ],
    harness: 'Avant de coder une fonction récursive sur un arbre, dessine un petit exemple puis complète la phrase « cet appel calcule ... sur le sous-arbre ... ». Si tu ne peux pas expliquer l’appel sans Python, ne l’écris pas encore.',
    worked: {
      title: 'Taille d’un arbre : traduire le dessin en appels',
      problem: 'Compter les nœuds d’un arbre composé d’une racine A et de deux feuilles B et C.',
      steps: [
        ['1 · Dessiner', 'A est la racine ; B est le sous-arbre gauche réduit à une feuille ; C est le sous-arbre droit réduit à une feuille.'],
        ['2 · Lire le cas vide', 'Les deux enfants de B et les deux enfants de C valent None : chacun de ces arbres vides a taille 0.'],
        ['3 · Donner un sens aux appels', 'taille(a.gauche) calcule la taille du sous-arbre gauche complet ; taille(a.droite) fait la même chose à droite.'],
        ['4 · Combiner', 'Pour A : 1 pour A + 1 pour B + 1 pour C = 3.']
      ],
      code: `${NOEUD}

a = Noeud('A', Noeud('B'), Noeud('C'))
print(taille(a))  # 3`
    },
    checks: [
      {q:'Dans un arbre binaire, a.gauche désigne…', options:['forcément une valeur numérique','le sous-arbre gauche, éventuellement vide','le père de a','tous les nœuds de même niveau'], answer:1, explain:'Le fils gauche est la racine éventuelle d’un sous-arbre complet.'},
      {q:'Avec la convention du module, quelle est la hauteur d’une feuille ?', options:['0','1','2','cela dépend de sa valeur'], answer:1, explain:'Le chemin racine-feuille contient un seul nœud ; l’arbre vide a hauteur 0.'},
      {q:'Dans un ABR, si x < a.valeur, où faut-il poursuivre ?', options:['dans les deux sous-arbres','uniquement à gauche','uniquement à droite','nulle part'], answer:1, explain:'La propriété d’ordre exclut x du sous-arbre droit.'}
    ]
  });
}
