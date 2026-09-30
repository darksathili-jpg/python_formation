// V1.22 — Student Zero Gate T9 → T10
// Build programming dynamics from repeated subproblems, explicit state and dependency
// relations, then compare memoization and bottom-up construction without reducing DP
// to a particular Python container.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT9T10(modules, practiceBank, primmBank, noviceBank) {
  const t10 = modules.find(module => module.id === 'T10');
  if (!t10) return;

  t10.duration = '210 min';
  t10.title = 'Programmation dynamique : états, dépendances & réutilisation';
  t10.summary = 'Passer de sous-problèmes simplement plus petits à des sous-problèmes qui se répètent, définir un état précis, mémoriser les résultats utiles et construire une solution dans un ordre compatible avec ses dépendances.';
  t10.bo = 'Programmation dynamique ; utiliser la programmation dynamique pour écrire un algorithme ; exemples possibles : rendu de monnaie et alignement de séquences ; discussion du coût en mémoire';
  t10.objectives = [
    'Distinguer le découpage en sous-problèmes de T9 du cas où les mêmes sous-problèmes réapparaissent plusieurs fois',
    'Définir un état comme l’information minimale qui identifie un sous-problème',
    'Écrire les cas initiaux et la relation de dépendance entre états avant de coder',
    'Mettre en œuvre une mémoïsation top-down en réutilisant le même cache dans tous les appels',
    'Construire une solution bottom-up dans un ordre où chaque dépendance est déjà connue',
    'Comprendre que la programmation dynamique est une stratégie de réutilisation des sous-résultats, pas « un dictionnaire dans une fonction récursive »',
    'Comparer qualitativement coût en temps et coût en mémoire, et repérer quand toute la table n’a pas besoin d’être conservée'
  ];

  t10.lessons = [
    {
      title: 'Transition T9 → T10 : mêmes mots, problème différent',
      html: 'T9 et T10 parlent tous les deux de <strong>sous-problèmes</strong>, mais le signal décisif n’est pas le même. Dans le tri fusion étudié en T9, les deux moitiés correspondent à des zones distinctes de la liste. En programmation dynamique, une décomposition récursive peut faire réapparaître <strong>exactement le même sous-problème</strong>. Si on le recalcule à chaque fois, on refait inutilement le même travail.',
      points: [
        'T9 : découper, résoudre des parties plus petites, puis combiner.',
        'T10 : repérer des sous-problèmes qui se chevauchent et réutiliser leurs résultats.',
        'Le simple fait d’utiliser la récursivité ou de couper un problème ne suffit pas à faire de la programmation dynamique.'
      ]
    },
    {
      title: 'Voir le chevauchement avant d’ajouter de la mémoire',
      html: 'Considérons un personnage qui atteint la marche <code>n</code> en avançant de 1 ou 2 marches. Si <code>F(n)</code> désigne le nombre de façons d’atteindre <code>n</code>, alors <code>F(n)</code> dépend de <code>F(n-1)</code> et de <code>F(n-2)</code>. Dans la version récursive naïve, le calcul de <code>F(5)</code> redemande plusieurs fois <code>F(3)</code>, <code>F(2)</code> ou <code>F(1)</code>. Ce sont des <strong>sous-problèmes qui se chevauchent</strong>.',
      code: `F(5)\n├─ F(4)\n│  ├─ F(3)\n│  └─ F(2)\n└─ F(3)   ← F(3) réapparaît\n\n# Le problème n'est pas que F(3) soit difficile.\n# Le problème est qu'on le recalcule.`
    },
    {
      title: 'L’état : donner un nom précis au sous-problème',
      html: 'Avant de choisir une liste ou un dictionnaire, on définit l’<strong>état</strong>. Un état décrit exactement la question dont on veut mémoriser la réponse. Pour l’escalier, l’état <code>i</code> peut signifier : « combien de façons existe-t-il pour atteindre exactement la marche i ? ». Pour le rendu de monnaie, l’état <code>s</code> peut signifier : « nombre minimal de pièces pour former exactement la somme s ».',
      points: [
        'Un état n’est pas « une case de tableau » : c’est d’abord une question bien définie.',
        'Deux appels qui décrivent le même état doivent avoir la même réponse.',
        'Un problème peut demander un état à un indice, deux indices ou davantage ; la représentation vient ensuite.'
      ]
    },
    {
      title: 'Quatre décisions avant de coder',
      html: 'Pour concevoir une solution dynamique, on peut utiliser une grille de lecture simple. Elle évite de commencer directement par une structure Python sans savoir ce qu’elle représente.',
      points: [
        '<strong>État</strong> : que signifie précisément <code>dp[i]</code> ou <code>memo[etat]</code> ?',
        '<strong>Cas initiaux</strong> : quelles réponses sont connues sans dépendre d’un autre état ?',
        '<strong>Dépendances</strong> : de quels états plus simples dépend l’état courant ?',
        '<strong>Ordre de calcul</strong> : comment garantir qu’une réponse est disponible au moment où elle est utilisée ?'
      ]
    },
    {
      title: 'Relation de dépendance : une règle de calcul, pas une formule à résoudre',
      html: 'Une écriture comme <code>dp[i] = dp[i-1] + dp[i-2]</code> décrit la dépendance entre états. On ne demande pas de résoudre une suite au sens mathématique. On traduit simplement une propriété du problème : pour atteindre la marche i, le dernier déplacement vient soit de i-1, soit de i-2.',
      code: `# sens de l'état : dp[i] = nombre de façons d'atteindre i\ndp[0] = 1\ndp[1] = 1\n\n# relation de dépendance\ndp[i] = dp[i - 1] + dp[i - 2]`
    },
    {
      title: 'Top-down : calculer à la demande et mémoïser',
      html: 'La <strong>mémoïsation</strong> conserve le résultat d’un état la première fois qu’il est calculé. Si cet état est demandé à nouveau, on renvoie immédiatement la valeur mémorisée. Une implémentation top-down garde donc le raisonnement récursif, mais elle doit transmettre <strong>le même cache</strong> à tous les appels descendants.',
      code: `def facons_memo(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n <= 1:\n        return 1\n    if n in memo:\n        return memo[n]\n    memo[n] = facons_memo(n - 1, memo) + facons_memo(n - 2, memo)\n    return memo[n]`
    },
    {
      title: 'Mémoïsation ≠ « mettre un dictionnaire dans une récursion »',
      html: 'Le dictionnaire n’est qu’une représentation possible du cache. La programmation dynamique vient du raisonnement sur les états et leurs dépendances. Un dictionnaire inutile qui ne réutilise aucun résultat ne crée pas une solution dynamique ; inversement, une solution bottom-up peut être dynamique sans aucun appel récursif ni dictionnaire.',
      points: [
        'Le cache représente des réponses à des états déjà résolus.',
        'La même clé doit désigner le même sous-problème.',
        'Le gain vient du fait qu’un état n’est plus recalculé à chaque apparition.'
      ]
    },
    {
      title: 'Bottom-up : calculer dans l’ordre des dépendances',
      html: 'L’approche <strong>bottom-up</strong> part des cas initiaux puis construit les états suivants. L’ordre est essentiel : lorsqu’on calcule <code>dp[i]</code>, les valeurs dont il dépend doivent déjà être disponibles. Pour l’escalier, l’ordre naturel est 0, 1, 2, 3, …, n.',
      code: `def facons(n):\n    if n <= 1:\n        return 1\n    dp = [1, 1]\n    for i in range(2, n + 1):\n        dp.append(dp[i - 1] + dp[i - 2])\n    return dp[n]`
    },
    {
      title: 'Top-down et bottom-up : deux chemins vers les mêmes états',
      html: 'Les deux approches utilisent la même idée de réutilisation. Le top-down part de l’état demandé et explore uniquement ce qui lui est nécessaire ; le bottom-up construit systématiquement les états dans un ordre sûr. Pour un même problème, les deux peuvent être corrects. Le choix dépend surtout de la structure des dépendances, de la simplicité du code et des états réellement nécessaires.',
      points: [
        'Top-down : appels récursifs + cache, états calculés à la demande.',
        'Bottom-up : boucle(s) + stockage, états calculés dans un ordre explicite.',
        'Ce qui reste invariant : le sens de l’état, les cas initiaux et la relation de dépendance.'
      ]
    },
    {
      title: 'Rendu de monnaie : quand un choix local ne suffit pas',
      html: 'Le programme officiel cite le rendu de monnaie comme exemple possible. Avec des pièces de valeurs 1, 3 et 4, rendre 6 en prenant toujours la plus grosse pièce disponible donne 4 + 1 + 1, soit 3 pièces. Pourtant 3 + 3 n’en utilise que 2. Pour obtenir systématiquement un minimum, on peut définir <code>dp[s]</code> comme le nombre minimal de pièces pour former exactement la somme s, puis tester toutes les dernières pièces possibles.',
      code: `# état : dp[s] = nombre minimal de pièces pour former s\ndp[0] = 0\n\n# pour chaque somme s, on essaie chaque pièce p <= s\n# candidat = 1 + dp[s - p]\n# on garde le meilleur candidat`
    },
    {
      title: 'État impossible : le représenter sans le confondre avec une vraie réponse',
      html: 'Dans un problème d’optimisation, certains états peuvent être impossibles. Pour le rendu de monnaie, on peut initialiser une somme avec une valeur sentinelle comme <code>montant + 1</code>, nécessairement plus grande que tout nombre de pièces valide si la pièce de valeur 1 était disponible. On ne doit pas traiter cette sentinelle comme une solution réelle : elle signifie « aucun chemin connu vers cet état ».',
      points: [
        '0 pièce pour former la somme 0 est un vrai cas initial.',
        'Une grande valeur sentinelle peut représenter temporairement « impossible ».',
        'La fonction peut finalement renvoyer -1 si l’état demandé est resté impossible.'
      ]
    },
    {
      title: 'Temps gagné, mémoire utilisée : le compromis de T10',
      html: 'Mémoriser les résultats évite des recalculs, mais occupe de la mémoire. La ressource Éduscol invite explicitement à discuter ce coût. Dans une approche simple, chaque état utile est calculé une seule fois puis stocké. Le coût dépend alors du nombre d’états et du travail nécessaire pour traiter chacun d’eux.',
      points: [
        'Temps : combien d’états calcule-t-on et combien de choix examine-t-on par état ?',
        'Mémoire : combien de résultats doit-on conserver simultanément ?',
        'Si l’état courant ne dépend que des deux précédents, deux valeurs peuvent parfois remplacer une table complète.'
      ]
    },
    {
      title: 'Reconstruire une solution n’est pas la même chose que calculer sa valeur',
      html: 'Dans certains problèmes, connaître la valeur optimale ne suffit pas : on veut aussi savoir quels choix produisent cette valeur. Il faut alors mémoriser une information supplémentaire, par exemple le choix précédent. Cette idée est utile pour comprendre qu’une table dynamique peut contenir davantage qu’un simple score, mais la reconstruction complète n’est pas un prérequis pour réussir ce module.',
      points: [
        'Valeur optimale : combien coûte ou rapporte la meilleure solution ?',
        'Choix optimal : quelles décisions permettent de reconstruire cette solution ?',
        'Conserver plus d’informations peut augmenter le coût mémoire.'
      ]
    },
    {
      title: 'Checklist Student Zero : reconnaître une vraie situation dynamique',
      html: 'Avant d’écrire du code, pose ces questions dans l’ordre. Si elles restent sans réponse, ajouter un tableau <code>dp</code> ne résoudra pas le problème conceptuel.',
      points: [
        'Quels sont les sous-problèmes et comment les identifier par un état ?',
        'Les mêmes états réapparaissent-ils, ou leurs résultats peuvent-ils être réutilisés ?',
        'Quels sont les cas initiaux ?',
        'Quelle relation permet de calculer un état à partir d’autres états ?',
        'Dans quel ordre peut-on calculer ou demander les états ?',
        'Quels résultats faut-il réellement conserver en mémoire ?'
      ]
    }
  ];

  const e1 = byId(t10.exercises, 'T10-E1');
  Object.assign(e1, {
    title: 'Bottom-up : construire les états d’un escalier',
    level: 1,
    prompt: `Un personnage part avant la marche 1 et peut avancer de 1 ou 2 marches. On définit l’état <code>dp[i]</code> comme le nombre de façons différentes d’atteindre exactement la marche <code>i</code>. Les cas initiaux sont <code>dp[0] = 1</code> (une façon de ne faire aucun déplacement) et <code>dp[1] = 1</code>. Pour <code>i >= 2</code>, toute arrivée sur <code>i</code> vient de <code>i-1</code> ou de <code>i-2</code>, donc <code>dp[i] = dp[i-1] + dp[i-2]</code>. Écris <code>facons(n)</code> en bottom-up et renvoie <code>dp[n]</code>.`,
    starter: `def facons(n):\n    if n <= 1:\n        return 1\n    dp = [1, 1]\n    # Construis dp[2], dp[3], ..., dp[n] dans cet ordre.\n    pass`,
    tests: [
      {label:'état 0', expr:'facons(0) == 1'},
      {label:'état 1', expr:'facons(1) == 1'},
      {label:'marche 4', expr:'facons(4) == 5'},
      {label:'marche 5', expr:'facons(5) == 8'}
    ],
    hints: [
      'Boucle avec for i in range(2, n + 1).',
      'À chaque tour, ajoute dp[i - 1] + dp[i - 2] puis renvoie dp[n].'
    ],
    solution: `def facons(n):\n    if n <= 1:\n        return 1\n    dp = [1, 1]\n    for i in range(2, n + 1):\n        dp.append(dp[i - 1] + dp[i - 2])\n    return dp[n]`
  });

  const e2 = byId(t10.exercises, 'T10-E2');
  Object.assign(e2, {
    title: 'Top-down : mémoïser les mêmes états',
    level: 2,
    prompt: `On reprend exactement le même problème d’escalier, mais cette fois avec une récursion top-down. Écris <code>facons_memo(n, memo=None)</code>. Les cas <code>n = 0</code> et <code>n = 1</code> renvoient 1. Avant de recalculer un état, vérifie s’il existe déjà dans <code>memo</code>. Sinon calcule-le avec les états <code>n-1</code> et <code>n-2</code>, stocke le résultat dans <code>memo[n]</code>, puis renvoie-le. Important : les deux appels récursifs doivent recevoir <strong>le même dictionnaire memo</strong>.`,
    starter: `def facons_memo(n, memo=None):\n    if memo is None:\n        memo = {}\n    # cas initiaux, réutilisation du cache, calcul puis stockage\n    pass`,
    tests: [
      {label:'marche 0', expr:'facons_memo(0) == 1'},
      {label:'marche 5', expr:'facons_memo(5) == 8'},
      {label:'marche 10', expr:'facons_memo(10) == 89'},
      {label:'cache rempli', expr:"(lambda m: (facons_memo(5, m), set([2,3,4,5]).issubset(set(m.keys())))[1])({})"}
    ],
    hints: [
      'Après les cas initiaux : if n in memo: return memo[n].',
      'Calcule memo[n] avec facons_memo(n - 1, memo) et facons_memo(n - 2, memo).'
    ],
    solution: `def facons_memo(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n <= 1:\n        return 1\n    if n in memo:\n        return memo[n]\n    memo[n] = facons_memo(n - 1, memo) + facons_memo(n - 2, memo)\n    return memo[n]`
  });

  const e3 = byId(t10.exercises, 'T10-E3');
  Object.assign(e3, {
    title: 'Rendu de monnaie : minimum par programmation dynamique',
    level: 3,
    prompt: `Écris <code>nb_pieces(montant, pieces)</code>. <code>montant</code> est un entier positif ou nul et <code>pieces</code> contient des valeurs de pièces strictement positives. On peut utiliser chaque valeur autant de fois que nécessaire. Définis <code>dp[s]</code> comme le nombre minimal de pièces permettant de former exactement la somme <code>s</code>. Le cas initial est <code>dp[0] = 0</code>. Pour chaque somme <code>s</code> de 1 à <code>montant</code>, essaie toutes les pièces <code>p <= s</code> et utilise l’état déjà connu <code>dp[s-p]</code>. Renvoie le minimum pour <code>montant</code>, ou <code>-1</code> si aucune combinaison ne permet de former exactement cette somme.`,
    starter: `def nb_pieces(montant, pieces):\n    impossible = montant + 1\n    dp = [0] + [impossible] * montant\n    # dp[s] = minimum de pièces pour former exactement s\n    # Construis les sommes dans l'ordre croissant.\n    pass`,
    tests: [
      {label:'somme nulle', expr:'nb_pieces(0, [1,3,4]) == 0'},
      {label:'glouton non optimal', expr:'nb_pieces(6, [1,3,4]) == 2'},
      {label:'autre minimum', expr:'nb_pieces(7, [1,3,4]) == 2'},
      {label:'somme impossible', expr:'nb_pieces(5, [2,4]) == -1'}
    ],
    hints: [
      'Pour chaque s, parcours les pièces p. Si p <= s et dp[s-p] est possible, 1 + dp[s-p] est un candidat.',
      'Mets à jour avec dp[s] = min(dp[s], 1 + dp[s-p]). À la fin, la sentinelle signifie que la somme est impossible.'
    ],
    solution: `def nb_pieces(montant, pieces):\n    impossible = montant + 1\n    dp = [0] + [impossible] * montant\n    for s in range(1, montant + 1):\n        for p in pieces:\n            if p <= s and dp[s - p] != impossible:\n                dp[s] = min(dp[s], 1 + dp[s - p])\n    if dp[montant] == impossible:\n        return -1\n    return dp[montant]`
  });

  const x1 = byId(practiceBank, 'T10-X1');
  Object.assign(x1, {
    title: 'Rendre visibles les états calculés',
    level: 1,
    kind: 'compléter',
    prompt: `Écris <code>etats_escalier(n)</code> qui renvoie la liste complète <code>[dp[0], dp[1], ..., dp[n]]</code> pour le problème de l’escalier. On utilise <code>dp[0] = 1</code>, <code>dp[1] = 1</code> et, pour chaque <code>i >= 2</code>, <code>dp[i] = dp[i-1] + dp[i-2]</code>. Pour <code>n = 4</code>, le résultat attendu est <code>[1, 1, 2, 3, 5]</code>.`,
    starter: `def etats_escalier(n):\n    if n == 0:\n        return [1]\n    dp = [1, 1]\n    # complète la construction\n    return dp`,
    tests: [
      {label:'état 0', expr:'etats_escalier(0) == [1]'},
      {label:'jusqu’à 4', expr:'etats_escalier(4) == [1,1,2,3,5]'},
      {label:'jusqu’à 6', expr:'etats_escalier(6) == [1,1,2,3,5,8,13]'}
    ],
    hints: ['Construis les indices de 2 à n inclus.', 'Chaque nouvelle valeur est la somme des deux dernières valeurs déjà présentes.'],
    solution: `def etats_escalier(n):\n    if n == 0:\n        return [1]\n    dp = [1, 1]\n    for i in range(2, n + 1):\n        dp.append(dp[i - 1] + dp[i - 2])\n    return dp`,
    tags: ['programmation dynamique','état','bottom-up']
  });

  const x2 = byId(practiceBank, 'T10-X2');
  Object.assign(x2, {
    title: 'Déboguer un cache qui n’est pas partagé',
    level: 2,
    kind: 'déboguer',
    prompt: `La fonction <code>constructions(n, memo=None)</code> calcule le nombre de constructions de longueur <code>n</code> obtenues avec des blocs de longueur 1 ou 2. Elle crée bien un dictionnaire <code>memo</code>, mais les appels récursifs n’utilisent pas ce même dictionnaire : les résultats mémorisés sont donc perdus entre les branches. Corrige la fonction pour que chaque état <code>n</code> soit réutilisable. Le résultat attendu est 1 pour 0, 1 pour 1, 5 pour 4 et 8 pour 5.`,
    starter: `def constructions(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n <= 1:\n        return 1\n    if n in memo:\n        return memo[n]\n    memo[n] = constructions(n - 1) + constructions(n - 2)\n    return memo[n]`,
    tests: [
      {label:'base 0', expr:'constructions(0) == 1'},
      {label:'longueur 4', expr:'constructions(4) == 5'},
      {label:'longueur 5', expr:'constructions(5) == 8'},
      {label:'cache partagé', expr:"(lambda m: (constructions(5, m), 5 in m and 4 in m and 3 in m and 2 in m)[1])({})"}
    ],
    hints: [
      'Le défaut n’est pas dans la formule n-1 / n-2.',
      'Transmets memo comme deuxième argument dans les deux appels récursifs.'
    ],
    solution: `def constructions(n, memo=None):\n    if memo is None:\n        memo = {}\n    if n <= 1:\n        return 1\n    if n in memo:\n        return memo[n]\n    memo[n] = constructions(n - 1, memo) + constructions(n - 2, memo)\n    return memo[n]`,
    tags: ['mémoïsation','cache','débogage']
  });

  const x3 = byId(practiceBank, 'T10-X3');
  Object.assign(x3, {
    title: 'Robot sur une grille : un état à deux indices',
    level: 2,
    kind: 'transfert',
    prompt: `Un robot part de la case en haut à gauche d’une grille de <code>lignes</code> × <code>colonnes</code> et ne peut se déplacer que d’une case vers la droite ou d’une case vers le bas. Écris <code>chemins(lignes, colonnes)</code>. Définis <code>dp[i][j]</code> comme le nombre de chemins permettant d’atteindre la case de ligne <code>i</code> et de colonne <code>j</code>. La première ligne et la première colonne valent 1 ; toute autre case dépend de la case du haut et de celle de gauche. Les paramètres sont toujours au moins égaux à 1.`,
    starter: `def chemins(lignes, colonnes):\n    # dp[i][j] = nombre de chemins jusqu'à la case (i, j)\n    pass`,
    tests: [
      {label:'1×1', expr:'chemins(1,1) == 1'},
      {label:'2×2', expr:'chemins(2,2) == 2'},
      {label:'3×3', expr:'chemins(3,3) == 6'},
      {label:'2×4', expr:'chemins(2,4) == 4'}
    ],
    hints: [
      'Crée une grille remplie de 1 : la première ligne et la première colonne sont ainsi déjà correctes.',
      'Pour i >= 1 et j >= 1 : dp[i][j] = dp[i-1][j] + dp[i][j-1].'
    ],
    solution: `def chemins(lignes, colonnes):\n    dp = []\n    for i in range(lignes):\n        ligne = []\n        for j in range(colonnes):\n            ligne.append(1)\n        dp.append(ligne)\n    for i in range(1, lignes):\n        for j in range(1, colonnes):\n            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]\n    return dp[lignes - 1][colonnes - 1]`,
    tags: ['programmation dynamique','état 2D','grille']
  });

  const x4 = byId(practiceBank, 'T10-X4');
  Object.assign(x4, {
    title: 'Bonus non voisins : choisir avec une dépendance',
    level: 3,
    kind: 'transfert',
    prompt: `Dans un jeu, une ligne contient des bonus de valeurs positives. Deux bonus placés sur des positions voisines ne peuvent pas être pris ensemble. Écris <code>score_max(scores)</code>. Définis <code>dp[i]</code> comme le meilleur score obtenu avec les <code>i</code> premiers bonus. Pour chaque nouveau bonus, compare deux possibilités : ne pas le prendre, ou le prendre en ajoutant sa valeur au meilleur score disponible deux positions plus tôt. Renvoie 0 pour une liste vide.`,
    starter: `def score_max(scores):\n    # dp[i] = meilleur score avec les i premiers bonus\n    pass`,
    tests: [
      {label:'vide', expr:'score_max([]) == 0'},
      {label:'un bonus', expr:'score_max([7]) == 7'},
      {label:'choix', expr:'score_max([4,1,6,3]) == 10'},
      {label:'alternance', expr:'score_max([2,7,9,3,1]) == 12'}
    ],
    hints: [
      'Tu peux créer dp de longueur len(scores) + 1 avec dp[0] = 0 et dp[1] = scores[0].',
      'Pour i >= 2 : dp[i] = max(dp[i-1], dp[i-2] + scores[i-1]).'
    ],
    solution: `def score_max(scores):\n    if len(scores) == 0:\n        return 0\n    dp = [0, scores[0]]\n    for i in range(2, len(scores) + 1):\n        sans_prendre = dp[i - 1]\n        en_prenant = dp[i - 2] + scores[i - 1]\n        dp.append(max(sans_prendre, en_prenant))\n    return dp[len(scores)]`,
    tags: ['programmation dynamique','optimisation','jeu']
  });

  const x5 = byId(practiceBank, 'T10-X5');
  Object.assign(x5, {
    title: 'Robot : conserver seulement les états encore utiles',
    level: 3,
    kind: 'écrire',
    prompt: `Un robot traverse une suite de bornes dont les niveaux d’énergie sont donnés par <code>valeurs</code>. Depuis la borne <code>i</code>, il peut aller à <code>i+1</code> ou <code>i+2</code>. Le coût d’un saut entre deux bornes est la différence absolue de leurs valeurs. Écris <code>energie_min(valeurs)</code> qui renvoie le coût total minimal pour atteindre la dernière borne. Comme l’état courant ne dépend que des deux coûts précédents, n’utilise pas une liste <code>dp</code> complète : conserve seulement deux résultats précédents. Une liste vide ou à une borne coûte 0.`,
    starter: `def energie_min(valeurs):\n    # conserver seulement les deux coûts précédents\n    pass`,
    tests: [
      {label:'vide', expr:'energie_min([]) == 0'},
      {label:'une borne', expr:'energie_min([8]) == 0'},
      {label:'deux bornes', expr:'energie_min([4,9]) == 5'},
      {label:'choix de saut', expr:'energie_min([10,30,20,10]) == 20'}
    ],
    hints: [
      'Pour deux bornes, le coût connu est abs(valeurs[1] - valeurs[0]).',
      'À l’indice i, compare : arriver depuis i-1 ou arriver depuis i-2 ; puis décale les deux valeurs mémorisées.'
    ],
    solution: `def energie_min(valeurs):\n    if len(valeurs) <= 1:\n        return 0\n    precedent2 = 0\n    precedent1 = abs(valeurs[1] - valeurs[0])\n    for i in range(2, len(valeurs)):\n        depuis_precedent = precedent1 + abs(valeurs[i] - valeurs[i - 1])\n        depuis_deux_avant = precedent2 + abs(valeurs[i] - valeurs[i - 2])\n        courant = min(depuis_precedent, depuis_deux_avant)\n        precedent2 = precedent1\n        precedent1 = courant\n    return precedent1`,
    tags: ['programmation dynamique','mémoire','robot']
  });

  const primm = primmBank.find(item => item.moduleId === 'T10');
  if (primm) {
    Object.assign(primm, {
      title: 'Pourquoi le même sous-problème revient-il ?',
      seed: `appels = []\n\ndef facons_naif(n):\n    appels.append(n)\n    if n <= 1:\n        return 1\n    return facons_naif(n - 1) + facons_naif(n - 2)\n\nprint(facons_naif(4))\nprint(appels)`,
      predict: 'Sans exécuter, prédis la valeur renvoyée par facons_naif(4), puis écris dans l’ordre la liste des valeurs de n enregistrées dans appels.',
      investigate: [
        'Quelles valeurs de n apparaissent plusieurs fois dans appels ? Chaque répétition correspond-elle au même sous-problème ?',
        'Compare avec le tri fusion de T9 : les deux moitiés du tri fusion sont-elles le même sous-problème, ou des portions différentes de la liste ?',
        'Si le résultat de facons_naif(2) était mémorisé après son premier calcul, que pourrait-on éviter lors de sa seconde apparition ?'
      ],
      modify: 'Ajoute un dictionnaire memo et transforme facons_naif en version mémoïsée. Vérifie que le résultat reste 5 pour n = 4, puis observe que chaque état non trivial n’est calculé qu’une fois.',
      make: 'Écris ensuite une version bottom-up du même problème : définis clairement ce que signifie dp[i], donne les deux cas initiaux et construis les états jusqu’à n sans récursion.'
    });
  }

  const novice = noviceBank.find(item => item.moduleId === 'T10');
  if (novice) {
    Object.assign(novice, {
      goal: 'Reconnaître les sous-problèmes répétés, donner un sens précis à un état et choisir un ordre de calcul qui permet de réutiliser les réponses déjà obtenues.',
      prerequisites: [
        'Savoir lire une fonction récursive simple et ses cas de base',
        'Savoir parcourir et modifier une liste ou un dictionnaire',
        'Aucune spécialité mathématiques requise : une relation comme dp[i] = dp[i-1] + dp[i-2] est lue comme une règle de dépendance, pas comme une suite à résoudre'
      ],
      vocabulary: [
        ['état','Question précise représentant un sous-problème, par exemple « meilleur coût pour atteindre la position i ».'],
        ['sous-problèmes qui se chevauchent','Sous-problèmes identiques qui réapparaissent dans plusieurs branches du calcul.'],
        ['mémoïsation','Calculer un état à la demande, mémoriser sa réponse, puis la réutiliser si le même état réapparaît.'],
        ['bottom-up','Construire les états des plus simples vers l’état demandé, dans un ordre compatible avec leurs dépendances.'],
        ['relation de dépendance','Règle indiquant quelles réponses déjà connues permettent de calculer un nouvel état.']
      ],
      harness: 'Student Zero T9 → T10 : ne commence pas par écrire memo = {} ou dp = [...]. Commence par une phrase qui définit l’état. Puis donne les cas initiaux, la relation de dépendance et l’ordre de calcul. La programmation dynamique n’est ni « de la récursivité avec un dictionnaire » ni « un tableau nommé dp ».',
      worked: {
        title: 'Escalier : construire une table qui a un sens',
        problem: 'Un personnage peut avancer de 1 ou 2 marches. On veut compter les façons d’atteindre la marche 5.',
        steps: [
          ['1 · Définir l’état','dp[i] = nombre de façons d’atteindre exactement la marche i.'],
          ['2 · Donner les cas initiaux','dp[0] = 1 et dp[1] = 1.'],
          ['3 · Écrire la dépendance','Pour i >= 2 : dp[i] = dp[i-1] + dp[i-2].'],
          ['4 · Choisir l’ordre','Calculer 2, puis 3, puis 4, puis 5 : chaque dépendance est déjà connue.'],
          ['5 · Lire le résultat','La table devient [1, 1, 2, 3, 5, 8], donc la réponse est 8.']
        ],
        code: `def facons(n):\n    if n <= 1:\n        return 1\n    dp = [1, 1]\n    for i in range(2, n + 1):\n        dp.append(dp[i - 1] + dp[i - 2])\n    return dp[n]`
      },
      checks: [
        {q:'Quel est le premier travail à faire avant de créer une table dp ?',options:['Choisir un nom de variable court','Définir précisément ce que représente un état','Importer math','Écrire une double boucle'],answer:1,explain:'Sans sens précis de l’état, les cases de la table ne représentent rien de contrôlable.'},
        {q:'Pourquoi la mémoïsation accélère-t-elle une récursion avec des sous-problèmes qui se chevauchent ?',options:['Elle change Python en langage compilé','Elle évite de recalculer un état déjà résolu','Elle supprime tous les appels récursifs','Elle trie automatiquement les données'],answer:1,explain:'Le même état peut être demandé plusieurs fois ; sa réponse mémorisée est alors réutilisée.'},
        {q:'Si dp[i] dépend de dp[i-1] et dp[i-2], quel ordre bottom-up est naturel ?',options:['n, n-1, ..., 0','0, 1, 2, ..., n','Un ordre aléatoire','Calculer i avant ses dépendances'],answer:1,explain:'On calcule des petits indices vers les grands pour disposer des dépendances au moment voulu.'}
      ]
    });
  }
}
