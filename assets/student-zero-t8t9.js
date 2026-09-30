// V1.21 — Student Zero Gate T8 → T9
// Rebuild the transition from computability to divide-and-conquer around concrete
// problem size, base cases, subproblems, combination and qualitative cost reasoning.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT8T9(modules, practiceBank, primmBank, noviceBank) {
  const t9 = modules.find(module => module.id === 'T9');
  if (!t9) return;

  t9.duration = '190 min';
  t9.title = 'Diviser pour régner & raisonner sur le coût';
  t9.summary = 'Passer de « un algorithme existe-t-il ? » à « comment son travail grandit-il avec la taille de l’entrée ? », puis construire la méthode diviser pour régner jusqu’au tri fusion.';
  t9.bo = 'Méthode « diviser pour régner » ; écrire un algorithme utilisant cette méthode ; tri fusion ; coût en n log n dans le pire des cas ; discussion possible du coût mémoire';
  t9.objectives = [
    'Distinguer calculabilité et efficacité : un problème calculable peut admettre des algorithmes de coûts très différents',
    'Définir concrètement la taille n d’une entrée avant de parler du coût',
    'Identifier cas de base, division, résolution des sous-problèmes et combinaison',
    'Tracer l’arbre des tailles d’un problème sans résoudre de récurrence mathématique',
    'Expliquer qualitativement pourquoi une réduction par moitié produit un nombre logarithmique de niveaux',
    'Expliquer pourquoi le tri fusion effectue un travail proportionnel à n sur chaque niveau et possède ainsi un coût en n log n',
    'Comprendre que « diviser » ne garantit pas automatiquement un algorithme plus rapide'
  ];

  t9.lessons = [
    {
      title: 'Transition T8 → T9 : existence ≠ efficacité',
      html: 'En T8, la question centrale était : <strong>existe-t-il un algorithme qui résout toujours ce problème ?</strong> T9 suppose maintenant que le problème est calculable et pose une autre question : <strong>comment organiser l’algorithme, et comment son travail grandit-il lorsque l’entrée devient plus grande ?</strong> Un problème peut être parfaitement calculable tout en étant traité par un algorithme très coûteux.',
      points: [
        'Calculabilité : existe-t-il un algorithme ?',
        'Complexité : comment le coût d’un algorithme évolue-t-il avec la taille de l’entrée ?',
        'Un algorithme lent n’est pas pour autant un algorithme « non calculable ».'
      ]
    },
    {
      title: 'Avant le coût : définir la taille n',
      html: 'Dire qu’un programme est « rapide » sans préciser la taille des données ne permet presque aucun raisonnement. On choisit d’abord une mesure simple de la taille de l’entrée, souvent notée <code>n</code>. Pour une liste, <code>n</code> peut être son nombre d’éléments ; pour une chaîne, son nombre de caractères. Le coût décrit ensuite le nombre d’opérations significatives lorsque <code>n</code> grandit.',
      code: `# Même opération, tailles différentes\npetite = [7, 2, 5, 1]          # n = 4\ngrande = list(range(1024))     # n = 1024`
    },
    {
      title: 'Diviser pour régner : quatre questions, pas trois slogans',
      html: 'La ressource Éduscol décrit les phases <strong>Diviser → Résoudre → Combiner</strong> et insiste sur un point facile à oublier : le <strong>cas de base</strong>. Pour analyser ou écrire un algorithme de ce type, on doit donc pouvoir répondre à quatre questions concrètes.',
      points: [
        'Cas de base : à partir de quelle taille sait-on répondre directement ?',
        'Diviser : comment l’entrée devient-elle plusieurs problèmes strictement plus petits ?',
        'Résoudre : quels appels récursifs traitent ces sous-problèmes ?',
        'Combiner : comment les réponses partielles deviennent-elles la réponse du problème initial ?'
      ]
    },
    {
      title: 'Voir les tailles avant de voir le code',
      html: 'Pour une entrée de taille 8 coupée en deux jusqu’à des morceaux de taille 1, les tailles suivent plusieurs niveaux. Ce dessin mental est plus important qu’une formule : chaque descente divise la taille par deux.',
      code: `taille 8\n├─ taille 4\n│  ├─ taille 2\n│  │  ├─ taille 1\n│  │  └─ taille 1\n│  └─ taille 2\n└─ taille 4\n   ├─ taille 2\n   └─ taille 2\n\n# Sur un chemin : 8 → 4 → 2 → 1, donc 3 divisions.`
    },
    {
      title: 'Le logarithme comme nombre de divisions par deux',
      html: 'Dans ce module, <code>log₂(n)</code> n’est pas une nouvelle technique de calcul à apprendre. Il sert d’abréviation pour une idée déjà connue avec la dichotomie : <strong>combien de fois peut-on diviser la taille par deux avant d’atteindre 1 ?</strong> Pour 8, il faut 3 divisions ; pour 1024, il en faut 10.',
      points: [
        '8 → 4 → 2 → 1 : 3 niveaux de réduction.',
        '1024 → 512 → … → 2 → 1 : 10 niveaux.',
        'On raisonne sur des ordres de grandeur, pas sur une démonstration mathématique du logarithme.'
      ]
    },
    {
      title: 'Une récurrence intuitive : décrire le travail, pas résoudre une équation',
      html: 'Une écriture comme <code>T(n) ≈ 2 × T(n/2) + travail_de_combinaison</code> peut servir de <strong>phrase compacte</strong> : pour traiter une entrée de taille n, on traite deux moitiés puis on paie le coût de leur combinaison. Il n’est pas demandé ici de résoudre formellement cette récurrence. L’élève doit surtout savoir relier chaque terme à une action de l’algorithme.',
      points: [
        '<code>T(n/2)</code> : coût d’un sous-problème deux fois plus petit.',
        '<code>2 × T(n/2)</code> : les deux moitiés sont réellement traitées.',
        'Le dernier terme représente le travail nécessaire pour combiner les résultats.'
      ]
    },
    {
      title: 'Attention : couper en deux ne signifie pas automatiquement aller plus vite',
      html: 'Deux algorithmes peuvent diviser par deux mais ne pas effectuer le même travail. Une recherche dichotomique <strong>ne poursuit qu’une moitié</strong> : la zone utile est divisée par deux à chaque étape. Un comptage par division traite au contraire <strong>les deux moitiés</strong> : tous les éléments finissent quand même par être examinés. Le découpage est une stratégie d’organisation, pas une garantie de gain.',
      code: `# Dichotomie : un seul appel récursif est poursuivi\n# compte_div : les deux appels récursifs sont effectués\n\n# C'est le travail réellement exécuté qui détermine le coût.`
    },
    {
      title: 'Fusion : comprendre le travail de combinaison',
      html: 'Le tri fusion repose sur une opération essentielle : fusionner deux listes <strong>déjà triées</strong>. On compare les deux premiers éléments encore disponibles, on ajoute le plus petit au résultat, puis on avance dans une seule des listes. Chaque élément est ajouté une fois : le travail de fusion est proportionnel au nombre total d’éléments à fusionner.',
      code: `a = [1, 4, 8]\nb = [2, 3, 9]\n# On compare 1 et 2, puis 4 et 2, puis 4 et 3...\n# À la fin : [1, 2, 3, 4, 8, 9]`
    },
    {
      title: 'Tri fusion : n éléments par niveau, environ log₂(n) niveaux',
      html: 'Le tri fusion divise la liste jusqu’aux listes de taille 0 ou 1, déjà triées, puis fusionne en remontant. Pour une taille puissance de deux, il y a environ <code>log₂(n)</code> niveaux de division. Lors de chaque niveau de fusion, l’ensemble des morceaux contient toujours n éléments : le travail total d’un niveau reste donc proportionnel à n. Cela explique qualitativement le coût en <strong>n log n</strong> dans le pire des cas.',
      points: [
        'Nombre de niveaux : environ log₂(n).',
        'Travail de fusion sur un niveau complet : proportionnel à n.',
        'Produit des deux idées : coût d’ordre n log n.'
      ]
    },
    {
      title: 'Pourquoi n log n n’est pas une étiquette à mémoriser',
      html: 'On doit pouvoir reconstruire le raisonnement. Pour <code>n = 1024</code>, une croissance quadratique évoque environ un million d’opérations élémentaires, tandis que <code>n log₂(n)</code> évoque environ dix mille unités de travail. Ces nombres ne donnent pas le temps exact en secondes : ils rendent visible le changement d’échelle lorsque n grandit.',
      points: [
        '<code>n²</code> : doubler n multiplie approximativement le travail par 4.',
        '<code>n log n</code> : la croissance reste plus forte que linéaire mais bien plus faible que quadratique.',
        'Une mesure de temps dépend de la machine ; l’ordre de grandeur décrit surtout la croissance avec n.'
      ]
    },
    {
      title: 'Coût en temps et coût en mémoire ne sont pas la même question',
      html: 'Deux implémentations du même principe peuvent avoir le même ordre de coût en temps mais utiliser des quantités de mémoire différentes. Par exemple, les découpages par slices <code>tab[:m]</code> et <code>tab[m:]</code> créent de nouvelles listes en Python. Le programme permet de discuter ce coût mémoire, sans exiger une analyse avancée.',
      points: [
        'Temps : combien de travail est effectué ?',
        'Mémoire : combien de données supplémentaires faut-il conserver ?',
        'La complexité ne se réduit donc pas à un chronomètre.'
      ]
    }
  ];

  const e1 = byId(t9.exercises, 'T9-E1');
  Object.assign(e1, {
    title: 'Combiner : fusionner deux listes déjà triées',
    level: 1,
    prompt: 'Écris <code>fusion(a, b)</code>. Les listes <code>a</code> et <code>b</code> sont déjà triées par ordre croissant. La fonction doit construire et renvoyer une <strong>nouvelle</strong> liste triée contenant tous leurs éléments, sans modifier <code>a</code> ni <code>b</code>. Utilise deux indices <code>i</code> et <code>j</code> : à chaque comparaison, avance uniquement dans la liste dont l’élément courant a été choisi.',
    starter: `def fusion(a, b):\n    i = 0\n    j = 0\n    resultat = []\n    # 1. comparer les éléments courants tant que les deux listes en possèdent\n    # 2. recopier ensuite ce qu'il reste dans a puis dans b\n    return resultat`,
    tests: [
      {label:'fusion alternée', expr:'fusion([1,4,8], [2,3,9]) == [1,2,3,4,8,9]'},
      {label:'liste gauche vide', expr:'fusion([], [1,2]) == [1,2]'},
      {label:'entrées intactes', expr:"(lambda a,b: (fusion(a,b), a, b)[1:])([1,3],[2,4]) == ([1,3],[2,4])"}
    ],
    hints: [
      'Tant que i < len(a) et j < len(b), compare a[i] et b[j].',
      'Quand une liste est épuisée, il faut encore recopier tous les éléments restants de l’autre.'
    ],
    solution: `def fusion(a, b):\n    i = 0\n    j = 0\n    resultat = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            resultat.append(a[i])\n            i += 1\n        else:\n            resultat.append(b[j])\n            j += 1\n    while i < len(a):\n        resultat.append(a[i])\n        i += 1\n    while j < len(b):\n        resultat.append(b[j])\n        j += 1\n    return resultat`
  });

  const e2 = byId(t9.exercises, 'T9-E2');
  Object.assign(e2, {
    title: 'Construire le tri fusion complet',
    level: 2,
    prompt: 'La fonction <code>fusion(a, b)</code> est fournie. Écris récursivement <code>tri_fusion(tab)</code>. Le cas de base est une liste de taille 0 ou 1 : elle est déjà triée. Sinon, coupe <code>tab</code> en deux moitiés strictement plus petites, trie récursivement les deux moitiés, puis combine les deux résultats avec <code>fusion</code>. La fonction doit renvoyer une nouvelle liste et laisser <code>tab</code> inchangée.',
    starter: `def fusion(a, b):\n    i = 0\n    j = 0\n    resultat = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            resultat.append(a[i])\n            i += 1\n        else:\n            resultat.append(b[j])\n            j += 1\n    while i < len(a):\n        resultat.append(a[i])\n        i += 1\n    while j < len(b):\n        resultat.append(b[j])\n        j += 1\n    return resultat\n\ndef tri_fusion(tab):\n    # cas de base, division, deux appels récursifs, combinaison\n    pass`,
    tests: [
      {label:'tri', expr:'tri_fusion([5,1,4,2,8,3]) == [1,2,3,4,5,8]'},
      {label:'vide', expr:'tri_fusion([]) == []'},
      {label:'un élément', expr:'tri_fusion([7]) == [7]'},
      {label:'entrée intacte', expr:'(lambda a: (tri_fusion(a), a)[1])([3,1,2]) == [3,1,2]'}
    ],
    hints: [
      'Commence obligatoirement par if len(tab) <= 1.',
      'Calcule m = len(tab) // 2, trie tab[:m] et tab[m:], puis fusionne les deux résultats.'
    ],
    solution: `def fusion(a, b):\n    i = 0\n    j = 0\n    resultat = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            resultat.append(a[i])\n            i += 1\n        else:\n            resultat.append(b[j])\n            j += 1\n    while i < len(a):\n        resultat.append(a[i])\n        i += 1\n    while j < len(b):\n        resultat.append(b[j])\n        j += 1\n    return resultat\n\ndef tri_fusion(tab):\n    if len(tab) <= 1:\n        return list(tab)\n    m = len(tab) // 2\n    gauche = tri_fusion(tab[:m])\n    droite = tri_fusion(tab[m:])\n    return fusion(gauche, droite)`
  });

  const e3 = byId(t9.exercises, 'T9-E3');
  Object.assign(e3, {
    title: 'Compter les niveaux de réduction par moitié',
    level: 2,
    prompt: 'Pour un entier <code>n >= 1</code>, écris <code>niveaux_moitie(n)</code> qui renvoie le nombre de divisions entières par 2 nécessaires pour atteindre une taille inférieure ou égale à 1. Exemples : <code>niveaux_moitie(1)</code> vaut 0, <code>niveaux_moitie(8)</code> vaut 3 et <code>niveaux_moitie(1024)</code> vaut 10. Ce compteur matérialise le nombre de niveaux logarithmiques ; aucun calcul de logarithme n’est demandé.',
    starter: `def niveaux_moitie(n):\n    assert n >= 1\n    niveaux = 0\n    # Réduire n jusqu'à 1 et compter les divisions.\n    return niveaux`,
    tests: [
      {label:'taille 1', expr:'niveaux_moitie(1) == 0'},
      {label:'taille 8', expr:'niveaux_moitie(8) == 3'},
      {label:'taille 1024', expr:'niveaux_moitie(1024) == 10'},
      {label:'taille 9', expr:'niveaux_moitie(9) == 3'}
    ],
    hints: [
      'Utilise while n > 1.',
      'À chaque tour, fais n //= 2 puis incrémente le compteur.'
    ],
    solution: `def niveaux_moitie(n):\n    assert n >= 1\n    niveaux = 0\n    while n > 1:\n        n //= 2\n        niveaux += 1\n    return niveaux`
  });

  const x1 = byId(practiceBank, 'T9-X1');
  Object.assign(x1, {
    title: 'Fusion de scores triés',
    level: 1,
    kind: 'compléter',
    prompt: 'Deux listes de scores <code>a</code> et <code>b</code> sont déjà triées. Complète <code>fusion(a, b)</code> pour obtenir une nouvelle liste contenant tous les scores dans l’ordre. Quand l’une des listes est épuisée, le reste de l’autre doit encore être recopié.',
    hints: ['Le cœur de la fusion choisit le plus petit élément courant.', 'N’oublie pas les deux boucles finales qui recopient les éléments restants.'],
    tags: ['fusion','combinaison','listes triées']
  });

  const x2 = byId(practiceBank, 'T9-X2');
  Object.assign(x2, {
    title: 'Déboguer le cas de base du tri fusion',
    level: 2,
    kind: 'déboguer',
    prompt: 'Ce tri fusion ne termine pas pour la liste vide car son cas de base ne couvre pas toutes les tailles déjà triviales. Corrige uniquement la condition d’arrêt afin que les listes de taille 0 ou 1 soient renvoyées immédiatement. Explique ensuite pourquoi cette correction garantit que la taille des sous-problèmes finit par atteindre un cas directement résolu.',
    hints: ['Une liste vide est déjà triée.', 'Le cas de base correct est len(tab) <= 1.'],
    tags: ['tri fusion','cas de base','récursivité','débogage']
  });

  const x3 = byId(practiceBank, 'T9-X3');
  Object.assign(x3, {
    title: 'Visualiser les tailles successives',
    level: 2,
    kind: 'écrire',
    prompt: 'Écris <code>tailles_moitie(n)</code> pour <code>n >= 1</code>. La fonction renvoie la liste des tailles obtenues en remplaçant successivement <code>n</code> par <code>n // 2</code> jusqu’à atteindre 1. Exemple : <code>tailles_moitie(8)</code> renvoie <code>[8, 4, 2, 1]</code>. Aucun logarithme n’est à calculer.',
    starter: `def tailles_moitie(n):\n    assert n >= 1\n    tailles = [n]\n    # À compléter\n    return tailles`,
    tests: [
      {label:'8', expr:'tailles_moitie(8) == [8,4,2,1]'},
      {label:'1', expr:'tailles_moitie(1) == [1]'},
      {label:'9', expr:'tailles_moitie(9) == [9,4,2,1]'}
    ],
    hints: ['Tant que n > 1, remplace n par n // 2.', 'Ajoute chaque nouvelle taille à la liste.'],
    solution: `def tailles_moitie(n):\n    assert n >= 1\n    tailles = [n]\n    while n > 1:\n        n //= 2\n        tailles.append(n)\n    return tailles`,
    tags: ['taille','moitiés','logarithmique','trace']
  });

  const x4 = byId(practiceBank, 'T9-X4');
  Object.assign(x4, {
    title: 'Diviser sans gagner automatiquement : compter des occurrences',
    level: 2,
    kind: 'transfert',
    prompt: 'Écris récursivement <code>compte_div(tab, x)</code>. Si <code>tab</code> est vide, renvoie 0 ; s’il contient un seul élément, renvoie 1 si cet élément vaut <code>x</code>, sinon 0. Pour une liste plus grande, coupe-la en deux, traite <strong>les deux moitiés</strong> et additionne les résultats. Cette stratégie divise bien le problème, mais tous les éléments sont finalement examinés : elle n’est pas automatiquement plus rapide qu’un parcours linéaire.',
    hints: ['Traite séparément les tailles 0 et 1.', 'Pour une taille supérieure à 1, additionne les résultats des deux appels récursifs.'],
    tags: ['diviser pour régner','deux sous-problèmes','coût linéaire','transfert']
  });

  const x5 = byId(practiceBank, 'T9-X5');
  Object.assign(x5, {
    title: 'Dichotomie récursive : ne garder qu’une moitié',
    level: 3,
    kind: 'écrire',
    prompt: 'La liste <code>tab</code> est triée par ordre croissant. Écris <code>dicho_rec(tab, x, g=0, d=None)</code> qui renvoie <code>True</code> si <code>x</code> est présent et <code>False</code> sinon, sans boucle. Après avoir comparé <code>x</code> à l’élément médian, l’appel récursif doit poursuivre <strong>une seule</strong> des deux moitiés. C’est cette élimination d’une moitié à chaque étape qui explique le nombre logarithmique de niveaux.',
    hints: ['Le cas d’arrêt est g > d.', 'Après la comparaison au milieu, choisis soit [g, m-1], soit [m+1, d], jamais les deux.'],
    tags: ['dichotomie','un sous-problème','logarithmique','récursivité']
  });

  const primm = primmBank.find(item => item.moduleId === 'T9');
  if (primm) {
    Object.assign(primm, {
      title: 'Découper, résoudre, combiner : suivre l’arbre des appels',
      seed: `def somme_div(tab):\n    if len(tab) == 0:\n        return 0\n    if len(tab) == 1:\n        return tab[0]\n    m = len(tab) // 2\n    gauche = somme_div(tab[:m])\n    droite = somme_div(tab[m:])\n    return gauche + droite\n\nprint(somme_div([2, 5, 1, 4]))`,
      predict: 'Sans exécuter, prédis la valeur affichée puis dessine les tailles des appels : 4, puis deux problèmes de taille 2, puis quatre problèmes de taille 1. Repère le cas de base et le moment où les résultats sont combinés.',
      investigate: [
        'Quelle quantité diminue strictement à chaque appel récursif ?',
        'Pourquoi len(tab) <= 1 constitue-t-il la frontière naturelle entre problème à découper et problème directement résolu ?',
        'La fonction traite-t-elle une seule moitié ou les deux ? Que cela implique-t-il sur le nombre total d’éléments finalement examinés ?',
        'Dans return gauche + droite, quelle opération joue le rôle de combinaison ?'
      ],
      modify: 'Ajoute un paramètre profondeur=0 et affiche, à chaque appel, la profondeur et len(tab). Vérifie sur une liste de 8 éléments qu’un chemin atteint une taille 1 après trois divisions.',
      make: 'Écris une fonction récursive maximum_div(tab) sur une liste non vide : taille 1 → son unique valeur ; sinon découpe en deux, calcule le maximum de chaque moitié puis combine avec max(gauche, droite). Explique pourquoi diviser le problème ne rend pas ici le coût sous-linéaire : les deux moitiés sont traitées.'
    });
  }

  const novice = noviceBank.find(item => item.moduleId === 'T9');
  if (novice) {
    Object.assign(novice, {
      goal: 'Passer d’un raisonnement sur l’existence d’un algorithme à un raisonnement concret sur sa structure et sur la croissance de son coût.',
      prerequisites: [
        'Comprendre un appel récursif simple et son cas de base',
        'Savoir manipuler une liste et sa longueur',
        'Connaître le principe de la recherche dichotomique vu en Première',
        'Aucune spécialité mathématiques requise : le logarithme est lu comme un nombre de divisions par deux'
      ],
      vocabulary: [
        ['taille n','Mesure simple de la quantité de données reçues par l’algorithme, par exemple le nombre d’éléments d’une liste.'],
        ['cas de base','Sous-problème assez petit pour être résolu directement sans nouvel appel récursif.'],
        ['diviser pour régner','Stratégie qui découpe un problème en sous-problèmes plus petits, les résout puis combine leurs résultats.'],
        ['combiner','Construire la réponse du problème initial à partir des réponses des sous-problèmes.'],
        ['coût','Quantité de travail significatif effectuée par l’algorithme en fonction de la taille de l’entrée.'],
        ['ordre n log n','Croissance obtenue, dans le tri fusion, par un travail proportionnel à n répété sur environ log₂(n) niveaux.']
      ],
      harness: 'Ici, aucun calcul avancé de logarithme et aucune résolution formelle de récurrence ne sont demandés. Tu dois savoir tracer les tailles, identifier les quatre rôles cas de base / diviser / résoudre / combiner, puis justifier qualitativement un ordre de grandeur. Le symbole log₂(n) signifie simplement « nombre de divisions par deux nécessaires pour atteindre 1 ».',
      worked: {
        title: 'De 8 éléments à des morceaux de taille 1',
        problem: 'Une méthode coupe une liste en deux moitiés jusqu’à ce que chaque morceau contienne au plus un élément.',
        steps: [
          ['1 · Fixer la taille','Au départ, n = 8.'],
          ['2 · Suivre un chemin','8 → 4 → 2 → 1 : trois divisions suffisent sur un chemin.'],
          ['3 · Observer tout un niveau','Même si le nombre de morceaux double, le total des éléments présents sur un niveau reste 8.'],
          ['4 · Relier au tri fusion','Si chaque niveau de combinaison traite environ les 8 éléments, trois niveaux donnent un travail de l’ordre de 8 × 3.']
        ],
        code: `# Pas besoin de math.log : on peut compter directement.\nn = 8\nniveaux = 0\nwhile n > 1:\n    n //= 2\n    niveaux += 1\nprint(niveaux)  # 3`
      },
      checks: [
        {q:'Pour passer de 8 à 1 en divisant la taille par 2, combien de divisions faut-il ?', options:['2','3','4','8'], answer:1, explain:'8 → 4 → 2 → 1 : trois divisions. C’est l’intuition de log₂(8) = 3.'},
        {q:'Dans le tri fusion, pourquoi apparaît un facteur n ?', options:['Parce qu’il y a n niveaux','Parce que sur un niveau complet les fusions traitent au total environ n éléments','Parce que Python impose n','Parce que chaque moitié est ignorée'], answer:1, explain:'Les morceaux d’un même niveau se partagent les n éléments ; leur fusion représente donc un travail total proportionnel à n.'},
        {q:'Un algorithme qui coupe toujours le problème en deux est-il automatiquement plus rapide ?', options:['Oui, toujours','Non : il faut regarder combien de sous-problèmes sont réellement traités et le coût de combinaison'], answer:1, explain:'La dichotomie ne poursuit qu’une moitié, tandis qu’un algorithme peut traiter les deux moitiés. Le découpage seul ne détermine pas le coût.'}
      ]
    });
  }
}
