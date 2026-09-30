// V1.20 — Student Zero Gate T7 → T8
// Separate programming paradigms from calculability, and make function-as-value explicit
// before any optional lambda or nested-function syntax.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT7T8(modules, practiceBank, primmBank, noviceBank) {
  const t8 = modules.find(module => module.id === 'T8');
  if (!t8) return;

  t8.duration = '170 min';
  t8.title = 'Paradigmes, programme-donnée & calculabilité';
  t8.summary = 'Distinguer plusieurs façons d’organiser un calcul, comprendre qu’une fonction et un programme peuvent être manipulés comme des données, puis séparer calculabilité, décidabilité et problème de l’arrêt.';
  t8.bo = 'Paradigmes impératif, fonctionnel et objet ; programme en tant que donnée ; calculabilité et décidabilité ; problème de l’arrêt';
  t8.objectives = [
    'Reconnaître sur un exemple les paradigmes impératif, fonctionnel et objet sans les confondre avec des langages',
    'Comprendre qu’une fonction peut être stockée dans une variable ou passée en paramètre sans être appelée',
    'Distinguer une fonction f de l’appel f(x) et utiliser une fonction nommée comme donnée',
    'Comprendre qu’un programme peut être représenté comme une donnée puis interprété par un autre programme',
    'Distinguer problème de calcul et problème de décision, puis définir qualitativement calculable et décidable',
    'Expliquer sans formalisme théorique pourquoi aucun décideur universel du problème de l’arrêt ne peut exister'
  ];

  t8.lessons = [
    {
      title: 'Transition T7 → T8 : du contrat à la manière d’organiser le calcul',
      html: 'En T7, on a appris à rendre un programme plus sûr grâce aux contrats, aux responsabilités, aux tests et à une méthode de diagnostic. T8 pose une autre question : <strong>comment organiser le calcul lui-même ?</strong> Un paradigme est une manière de structurer un programme. Ce n’est pas un langage. Python permet d’illustrer plusieurs paradigmes dans un même programme.',
      points: [
        'T7 : que promet cette partie du programme et comment la vérifier ?',
        'T8 : comment le calcul est-il organisé ?',
        'Un même langage peut mélanger plusieurs paradigmes.'
      ]
    },
    {
      title: 'Trois paradigmes à reconnaître, pas trois recettes à mémoriser',
      html: 'Le programme de Terminale demande de distinguer sur des exemples les paradigmes <strong>impératif</strong>, <strong>fonctionnel</strong> et <strong>objet</strong>. L’objectif n’est pas de devenir spécialiste d’un langage fonctionnel : il faut reconnaître les idées dominantes et savoir justifier un choix simple.',
      code: `# Impératif : l'état évolue par instructions\ntotal = 0\nfor x in [2, 3, 4]:\n    total = total + x\n\n# Objet : état + opérations regroupés dans des objets\nclass Compteur:\n    def __init__(self):\n        self.valeur = 0\n    def ajouter(self, x):\n        self.valeur += x\n\n# Fonctionnel : on privilégie des transformations par fonctions\ndef carre(x):\n    return x * x`
    },
    {
      title: 'Fonction comme valeur : f n’est pas f(x)',
      html: 'Avant toute syntaxe plus compacte, installe ce modèle mental : le nom <code>carre</code> désigne la fonction elle-même ; <code>carre(5)</code> appelle cette fonction et produit une valeur. Une fonction peut donc être placée dans une variable ou transmise à une autre fonction <strong>sans être appelée immédiatement</strong>.',
      code: `def carre(x):\n    return x * x\n\noperation = carre      # la fonction devient une donnée du programme\nprint(operation(5))    # l'appel a lieu ici\n\ndef applique(f, x):\n    return f(x)\n\nprint(applique(carre, 6))`
    },
    {
      title: 'Commencer par des fonctions nommées : lambda n’est pas un prérequis',
      html: 'Une expression <code>lambda</code> est une écriture compacte d’une petite fonction, mais elle peut masquer l’idée importante chez un débutant. Dans T8, les activités cœur utilisent d’abord des fonctions nommées. Une éventuelle écriture <code>lambda</code> ne doit jamais être nécessaire pour réussir le module.',
      code: `def est_pair(n):\n    return n % 2 == 0\n\ndef garde(predicat, valeurs):\n    resultat = []\n    for x in valeurs:\n        if predicat(x):\n            resultat.append(x)\n    return resultat\n\nprint(garde(est_pair, [1, 2, 3, 4]))`
    },
    {
      title: 'Le paradigme fonctionnel : une idée, pas seulement une syntaxe',
      html: 'Le paradigme fonctionnel considère notamment les fonctions comme des données et privilégie des transformations qui renvoient des résultats plutôt que des modifications dispersées d’un état partagé. Python n’est pas un langage fonctionnel pur : il permet simplement d’en utiliser certains principes. Une fonction d’ordre supérieur reçoit une fonction en paramètre ou en renvoie une.',
      points: [
        'Fonction pure : à mêmes arguments, même résultat, sans effet de bord observable.',
        'Fonction d’ordre supérieur : reçoit ou renvoie une fonction.',
        'En NSI, reconnaître ces idées est plus important que maîtriser une syntaxe compacte.'
      ]
    },
    {
      title: 'Même problème, organisations différentes',
      html: 'Deux programmes peuvent calculer la même chose tout en étant organisés différemment. Le bon réflexe n’est donc pas « quel paradigme est le meilleur ? », mais « quelle organisation rend ce problème plus clair, testable et adapté à son contexte ? ». Un programme réel peut très bien combiner objets, boucles impératives et fonctions de transformation.',
      code: `# Même transformation : doubler trois valeurs\nvaleurs = [1, 2, 3]\n\n# style impératif\nresultat = []\nfor x in valeurs:\n    resultat.append(x * 2)\n\n# style utilisant une fonction comme donnée\ndef double(x):\n    return x * 2\n\ndef transforme(f, tab):\n    resultat = []\n    for x in tab:\n        resultat.append(f(x))\n    return resultat`
    },
    {
      title: 'Un programme peut lui-même devenir une donnée',
      html: 'Un interpréteur, un compilateur ou un système d’exploitation manipule des programmes comme des données. On peut l’illustrer sans <code>eval</code> avec un mini-langage : une liste de commandes décrit le programme, et une autre fonction l’interprète. La liste n’exécute rien toute seule : elle représente des instructions.',
      code: `programme = [('AJOUTE', 3), ('MULTIPLIE', 2)]\n\ndef execute(programme, valeur):\n    for commande, n in programme:\n        if commande == 'AJOUTE':\n            valeur += n\n        elif commande == 'MULTIPLIE':\n            valeur *= n\n    return valeur\n\nprint(execute(programme, 4))  # 14`
    },
    {
      title: 'Calculabilité : existe-t-il un algorithme pour produire le résultat ?',
      html: 'Une fonction est dite <strong>calculable</strong> lorsqu’un algorithme peut en produire le résultat pour toute entrée valide. Pour le niveau NSI, le point essentiel est que cette possibilité ne dépend pas du choix d’un langage usuel particulier : changer Python pour un autre langage général ne transforme pas un problème fondamentalement non calculable en problème calculable.',
      points: [
        '« Difficile » ou « très long » ne signifie pas « non calculable ».',
        'Calculabilité concerne l’existence d’un algorithme, pas sa rapidité.',
        'Le langage utilisé n’est pas la source de la limite fondamentale.'
      ]
    },
    {
      title: 'Décidabilité : un cas particulier avec réponse oui/non',
      html: 'Un <strong>problème de décision</strong> demande une réponse booléenne : oui/non, vrai/faux. Il est <strong>décidable</strong> s’il existe un algorithme qui termine pour toute entrée valide et donne toujours la bonne réponse. Par exemple, « une valeur x apparaît-elle dans cette liste finie ? » est décidable par un parcours.',
      code: `def contient(tab, x):\n    for valeur in tab:\n        if valeur == x:\n            return True\n    return False`
    },
    {
      title: 'Le problème de l’arrêt : la limite est universelle',
      html: 'On aimerait écrire un programme universel <code>arrete(programme, entree)</code> qui terminerait toujours et répondrait correctement pour <em>tout</em> programme et <em>toute</em> entrée : « ce programme finira-t-il par s’arrêter ? ». Le programme de NSI demande de comprendre, sans formalisme théorique lourd, qu’un tel décideur universel n’existe pas : le <strong>problème de l’arrêt est indécidable</strong>.',
      points: [
        'Cela ne signifie pas qu’on ne peut jamais savoir qu’un programme particulier s’arrête.',
        'Cela signifie qu’aucun algorithme universel ne peut décider correctement tous les cas.',
        'Un timeout ne prouve pas qu’un programme ne s’arrêtera jamais.'
      ]
    },
    {
      title: 'Pourquoi l’oracle universel se contredit lui-même',
      html: 'Raisonnement intuitif : supposons qu’un décideur parfait <code>arrete(P, E)</code> existe. On construit alors un programme <code>contradicteur(P)</code> qui boucle si <code>arrete(P, P)</code> répond « s’arrête », et qui s’arrête si le décideur répond « boucle ». Que se passe-t-il pour <code>contradicteur(contradicteur)</code> ? Dans les deux réponses possibles, le programme fait précisément le contraire de la prédiction. L’hypothèse d’un décideur universel parfait conduit donc à une contradiction.',
      code: `# PSEUDO-CODE : on ne cherche pas à l'exécuter.\n# si arrete(P, P) prédit "s'arrête" :\n#     boucler pour toujours\n# sinon :\n#     s'arrêter\n#\n# Que peut prédire arrete(contradicteur, contradicteur) ?`
    },
    {
      title: 'Trois confusions à refuser',
      html: 'Cette partie du programme est conceptuelle : elle ne doit pas être transformée en obstacle syntaxique.',
      points: [
        '<code>f</code> est une fonction ; <code>f(x)</code> est le résultat d’un appel.',
        'Indécidable ne veut pas dire « très difficile » ni « impossible sur tous les cas particuliers ».',
        'Un timeout, mille tests réussis ou une analyse heuristique ne constituent pas un décideur universel du problème de l’arrêt.'
      ]
    }
  ];

  const e1 = byId(t8.exercises, 'T8-E1');
  Object.assign(e1, {
    title: 'Passer une fonction nommée comme donnée',
    level: 1,
    prompt: 'La fonction <code>double(x)</code> est fournie. Complète <code>applique(f, x)</code> pour appeler la fonction reçue dans <code>f</code> avec la valeur <code>x</code> et renvoyer le résultat. Point clé : dans <code>applique(double, 7)</code>, <code>double</code> est transmis sans parenthèses ; l’appel <code>f(x)</code> a lieu à l’intérieur de <code>applique</code>.',
    starter: `def double(x):\n    return x * 2\n\ndef applique(f, x):\n    # f désigne une fonction ; f(x) appelle cette fonction.\n    pass`,
    tests: [
      {label:'fonction nommée', expr:'applique(double, 7) == 14'},
      {label:'fonction Python existante', expr:'applique(abs, -5) == 5'}
    ],
    hints: [
      'Ne cherche pas à savoir à l’avance quelle fonction f contient.',
      'Le corps peut se résumer à : return f(x).'
    ],
    solution: `def double(x):\n    return x * 2\n\ndef applique(f, x):\n    return f(x)`
  });

  const e2 = byId(t8.exercises, 'T8-E2');
  Object.assign(e2, {
    title: 'Filtrer avec un prédicat nommé',
    level: 2,
    prompt: 'On appelle <strong>prédicat</strong> une fonction qui renvoie un booléen. La fonction <code>est_pair(n)</code> est fournie. Écris <code>garde(predicat, tab)</code> qui construit une nouvelle liste contenant, dans le même ordre, uniquement les éléments <code>x</code> pour lesquels <code>predicat(x)</code> vaut <code>True</code>. Ne modifie pas <code>tab</code> et n’utilise pas <code>filter</code> ni <code>lambda</code>.',
    starter: `def est_pair(n):\n    return n % 2 == 0\n\ndef garde(predicat, tab):\n    resultat = []\n    # Parcours tab et interroge predicat(x).\n    return resultat`,
    tests: [
      {label:'pairs', expr:'garde(est_pair, [1,2,3,4,5,6]) == [2,4,6]'},
      {label:'entrée intacte', expr:'(lambda a: (garde(est_pair, a), a)[1])([1,2,3]) == [1,2,3]'}
    ],
    hints: [
      'Dans la boucle, predicat(x) produit True ou False.',
      'Ajoute x au résultat uniquement lorsque le prédicat est vrai.'
    ],
    solution: `def est_pair(n):\n    return n % 2 == 0\n\ndef garde(predicat, tab):\n    resultat = []\n    for x in tab:\n        if predicat(x):\n            resultat.append(x)\n    return resultat`
  });

  const e3 = byId(t8.exercises, 'T8-E3');
  Object.assign(e3, {
    title: 'Programme comme donnée : écrire un mini-interpréteur',
    level: 3,
    prompt: 'Un mini-programme est représenté par une liste de tuples <code>(commande, n)</code>. Les seules commandes valides sont <code>"AJOUTE"</code> et <code>"MULTIPLIE"</code>. Écris <code>execute(programme, valeur)</code> qui lit les commandes dans l’ordre et met à jour <code>valeur</code>. La liste <code>programme</code> est une donnée : elle ne s’exécute pas seule ; c’est <code>execute</code> qui l’interprète. Pour une commande inconnue, déclenche une <code>AssertionError</code>.',
    starter: `def execute(programme, valeur):\n    for commande, n in programme:\n        # Interprète chaque commande.\n        pass\n    return valeur`,
    tests: [
      {label:'deux commandes', expr:"execute([('AJOUTE',3),('MULTIPLIE',2)], 4) == 14"},
      {label:'programme vide', expr:'execute([], 7) == 7'},
      {label:'commande inconnue refusée', expr:"execute([('DIVISE',2)], 8)", raises:'AssertionError'}
    ],
    hints: [
      'Teste commande == "AJOUTE", puis commande == "MULTIPLIE".',
      'Dans le cas restant, utilise assert False pour signaler une commande invalide.'
    ],
    solution: `def execute(programme, valeur):\n    for commande, n in programme:\n        if commande == 'AJOUTE':\n            valeur += n\n        elif commande == 'MULTIPLIE':\n            valeur *= n\n        else:\n            assert False\n    return valeur`
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T8');

  Object.assign(byId(practice, 'T8-X1'), {
    title: 'Fonction ou appel ?', kind: 'compléter', level: 1,
    prompt: 'La fonction <code>carre(x)</code> est fournie. Complète <code>transforme(f, tab)</code> pour appeler la fonction reçue dans <code>f</code> sur chaque élément. Dans l’appel <code>transforme(carre, [1,2,3])</code>, on transmet <code>carre</code> sans parenthèses : le paramètre <code>f</code> reçoit la fonction elle-même.',
    starter: `def carre(x):\n    return x * x\n\ndef transforme(f, tab):\n    resultat = []\n    for x in tab:\n        resultat.append(__________)\n    return resultat`,
    tests: [{label:'carrés', expr:'transforme(carre, [1,2,3]) == [1,4,9]'}],
    hints: ['À l’intérieur de la boucle, appelle f avec x.', 'Il faut écrire f(x), pas seulement f.'],
    solution: `def carre(x):\n    return x * x\n\ndef transforme(f, tab):\n    resultat = []\n    for x in tab:\n        resultat.append(f(x))\n    return resultat`
  });

  Object.assign(byId(practice, 'T8-X2'), {
    title: 'Premier élément accepté', kind: 'écrire', level: 1,
    prompt: 'La fonction <code>est_negatif(n)</code> est fournie et renvoie un booléen. Écris <code>premier_qui(tab, predicat)</code> : parcours la liste dans l’ordre et renvoie le premier élément pour lequel <code>predicat(element)</code> vaut <code>True</code>. Si aucun élément ne convient, renvoie <code>None</code>. Aucune expression <code>lambda</code> n’est nécessaire.',
    starter: `def est_negatif(n):\n    return n < 0\n\ndef premier_qui(tab, predicat):\n    pass`,
    tests: [
      {label:'premier négatif', expr:'premier_qui([3,1,-2,-5], est_negatif) == -2'},
      {label:'aucun', expr:'premier_qui([1,3,8], est_negatif) is None'}
    ],
    hints: ['Teste predicat(x) pendant le parcours.', 'Retourne x dès la première réussite.'],
    solution: `def est_negatif(n):\n    return n < 0\n\ndef premier_qui(tab, predicat):\n    for x in tab:\n        if predicat(x):\n            return x\n    return None`
  });

  Object.assign(byId(practice, 'T8-X3'), {
    title: 'Déboguer : fonction reçue ou fonction appelée ?', kind: 'déboguer', level: 2,
    prompt: 'Le contrat de <code>applique(f, x)</code> est de renvoyer le résultat de l’appel de <code>f</code> sur <code>x</code>. Le programme actuel renvoie la fonction elle-même. Reproduis le défaut, puis corrige uniquement le <code>return</code>.',
    starter: `def triple(x):\n    return x * 3\n\ndef applique(f, x):\n    return f`,
    tests: [
      {label:'valeur attendue', expr:'applique(triple, 4) == 12'},
      {label:'pas une fonction en sortie', expr:'not callable(applique(triple, 4))'}
    ],
    hints: ['f est la fonction ; f(x) est le résultat de son appel.', 'Le bon return contient des parenthèses autour de x.'],
    solution: `def triple(x):\n    return x * 3\n\ndef applique(f, x):\n    return f(x)`
  });

  Object.assign(byId(practice, 'T8-X4'), {
    title: 'Pipeline avec fonctions nommées', kind: 'transfert', level: 2,
    prompt: 'Deux fonctions de transformation sont fournies : <code>retire_espaces</code> et <code>majuscules</code>. Écris <code>pipeline(texte, fonctions)</code> qui applique successivement chaque fonction de la liste <code>fonctions</code> au résultat courant. Une liste vide de fonctions doit laisser le texte inchangé.',
    starter: `def retire_espaces(s):\n    return s.strip()\n\ndef majuscules(s):\n    return s.upper()\n\ndef pipeline(texte, fonctions):\n    pass`,
    tests: [
      {label:'deux transformations', expr:"pipeline(' nsi ', [retire_espaces, majuscules]) == 'NSI'"},
      {label:'aucune transformation', expr:"pipeline('abc', []) == 'abc'"}
    ],
    hints: ['Initialise resultat = texte.', 'Pour chaque f, remplace resultat par f(resultat).'],
    solution: `def retire_espaces(s):\n    return s.strip()\n\ndef majuscules(s):\n    return s.upper()\n\ndef pipeline(texte, fonctions):\n    resultat = texte\n    for f in fonctions:\n        resultat = f(resultat)\n    return resultat`
  });

  Object.assign(byId(practice, 'T8-X5'), {
    title: 'Programme-donnée : compter les instructions exécutées', kind: 'transfert', level: 3,
    prompt: 'Un programme est représenté par une liste de commandes <code>("AJOUTE", n)</code> ou <code>("MULTIPLIE", n)</code>. Écris <code>execute_et_compte(programme, valeur)</code> qui interprète les commandes dans l’ordre puis renvoie le tuple <code>(valeur_finale, nombre_commandes_executees)</code>. Cette activité illustre qu’un programme peut être une donnée manipulée par un interpréteur.',
    starter: `def execute_et_compte(programme, valeur):\n    compteur = 0\n    # Interprète les commandes et compte-les.\n    pass`,
    tests: [
      {label:'résultat + nombre', expr:"execute_et_compte([('AJOUTE',3),('MULTIPLIE',2)],4) == (14,2)"},
      {label:'programme vide', expr:'execute_et_compte([],9) == (9,0)'}
    ],
    hints: ['Incrémente compteur une fois par commande.', 'Renvoie valeur, compteur à la fin.'],
    solution: `def execute_et_compte(programme, valeur):\n    compteur = 0\n    for commande, n in programme:\n        if commande == 'AJOUTE':\n            valeur += n\n        elif commande == 'MULTIPLIE':\n            valeur *= n\n        else:\n            assert False\n        compteur += 1\n    return valeur, compteur`
  });

  const primm = primmBank.find(item => item.moduleId === 'T8');
  if (primm) {
    Object.assign(primm, {
      title: 'Fonction comme donnée : quand a lieu l’appel ?',
      seed: `def double(x):\n    return x * 2\n\ndef ajoute_un(x):\n    return x + 1\n\ndef applique(f, x):\n    print('appel avec', x)\n    return f(x)\n\noperation = double\nprint(applique(operation, 5))`,
      predict: 'Sans exécuter : que contient operation après l’affectation ? À quel moment double est-elle réellement appelée ? Quelles sont les deux lignes affichées ?',
      investigate: [
        'Quelle différence précise y a-t-il entre operation = double et operation = double(5) ?',
        'Dans applique(operation, 5), que contient le paramètre f ?',
        'Python aurait-il besoin de connaître le nom double à l’intérieur de applique ?'
      ],
      modify: 'Remplace operation = double par operation = ajoute_un. Prédit le nouvel affichage avant d’exécuter.',
      make: 'Écris une fonction applique_liste(f, valeurs) qui reçoit une fonction nommée et construit une nouvelle liste avec f(x) pour chaque valeur. N’utilise pas lambda.'
    });
  }

  const novice = noviceBank.find(item => item.moduleId === 'T8');
  if (novice) {
    novice.goal = 'Distinguer paradigmes, fonction comme valeur, programme comme donnée et limites de la décidabilité sans dépendre de syntaxe avancée.';
    novice.prerequisites = ['Fonctions et appels', 'Boucles et listes', 'Contrats et tests vus en T7'];
    novice.vocabulary = [
      ['paradigme', 'Manière d’organiser un calcul ou un programme ; ce n’est pas un langage.'],
      ['fonction comme valeur', 'Le nom d’une fonction peut être stocké ou transmis sans provoquer immédiatement son appel.'],
      ['programme comme donnée', 'Un programme peut être représenté et manipulé par un autre programme, par exemple un interpréteur.'],
      ['décidable', 'Problème oui/non pour lequel un algorithme termine sur toute entrée valide et répond toujours correctement.'],
      ['indécidable', 'Problème de décision pour lequel aucun tel algorithme universel n’existe.']
    ];
    novice.harness = 'Commence avec des fonctions nommées : f désigne la fonction, f(x) son résultat. Les expressions lambda et les fonctions internes ne sont pas nécessaires pour réussir T8. La calculabilité et la décidabilité sont étudiées conceptuellement ; on ne te demandera jamais de programmer un oracle impossible.';
    novice.worked = {
      title: 'Transmettre une fonction sans l’appeler',
      problem: 'On veut appliquer le même mécanisme à plusieurs transformations.',
      steps: [
        ['1 · Nommer une transformation', 'double est une fonction ordinaire définie avec def.'],
        ['2 · Transmettre la fonction', 'applique(double, 4) transmet double sans parenthèses.'],
        ['3 · Appeler au bon endroit', 'C’est f(x), dans applique, qui déclenche l’exécution.']
      ],
      code: `def double(x):\n    return x * 2\n\ndef applique(f, x):\n    return f(x)\n\nprint(applique(double, 4))`
    };
    novice.checks = [
      {
        q:'Dans operation = double, que contient operation ?',
        options:['Le résultat double(0)','La fonction double elle-même','Toujours un nombre','Une erreur'],
        answer:1,
        explain:'Aucune parenthèse : la fonction n’est pas appelée. operation référence la même fonction.'
      },
      {
        q:'Lequel décrit correctement un paradigme de programmation ?',
        options:['Un langage obligatoire','Une manière d’organiser le calcul','Une bibliothèque Python','Un type de processeur'],
        answer:1,
        explain:'Python peut d’ailleurs illustrer plusieurs paradigmes dans un même programme.'
      },
      {
        q:'Que signifie « le problème de l’arrêt est indécidable » ?',
        options:['Aucun programme ne s’arrête jamais','On ne peut jamais analyser un programme particulier','Il n’existe pas d’algorithme universel qui décide correctement tous les couples programme/entrée','Python est trop lent pour répondre'],
        answer:2,
        explain:'La limite est universelle : certains cas particuliers restent évidemment analysables.'
      }
    ];
  }
}
