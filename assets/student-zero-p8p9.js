/* PYTHON//FORGE V1.12 — Student Zero Gate, Première P8 → P9
   Transition from tabular data to classical algorithms.
   The objective is to prevent hidden prerequisites: slices, implicit sortedness,
   opaque cost claims, or memorized sorting recipes without invariants.
*/

function byId(list, id) { return list.find(item => item.id === id); }
function byModule(list, id) { return list.find(item => item.moduleId === id); }
function assignById(list, id, patch) { const item = byId(list, id); if (item) Object.assign(item, patch); }

function reorderPractice(bank, orderedIds) {
  const wanted = new Set(orderedIds);
  const positions = bank.map((item, index) => wanted.has(item.id) ? index : -1).filter(index => index >= 0);
  if (!positions.length) return;
  const first = Math.min(...positions);
  const selected = new Map(bank.filter(item => wanted.has(item.id)).map(item => [item.id, item]));
  const rest = bank.filter(item => !wanted.has(item.id));
  const beforeCount = bank.slice(0, first).filter(item => !wanted.has(item.id)).length;
  const ordered = orderedIds.map(id => selected.get(id)).filter(Boolean);
  bank.splice(0, bank.length, ...rest.slice(0, beforeCount), ...ordered, ...rest.slice(beforeCount));
}

export function applyStudentZeroP8P9(modules, practiceBank, primmBank, noviceBank) {
  const p8 = modules.find(module => module.id === 'P8');
  const p9 = modules.find(module => module.id === 'P9');
  if (!p8 || !p9) return;

  if (!p8.lessons.some(lesson => lesson.title.includes('Transition P8 → P9'))) {
    p8.lessons.push({
      title:'Transition P8 → P9 · des données préparées vers l’algorithme',
      html:'En P8, tu as appris à obtenir une table propre, à rechercher des lignes, à filtrer, trier ou rapprocher des données. P9 change de question : une fois les données disponibles dans une liste, <strong>comment l’algorithme les parcourt-il et combien de comparaisons effectue-t-il ?</strong> On ne confondra donc plus la structure des données avec la stratégie utilisée pour les traiter.',
      code:"table = [\n    {'nom':'Ada', 'note':17},\n    {'nom':'Alan', 'note':9},\n    {'nom':'Grace', 'note':14}\n]\nnotes = []\nfor ligne in table:\n    notes.append(ligne['note'])\nprint(notes)",
      points:[
        'P8 prépare et organise les données ; P9 étudie les étapes de l’algorithme qui les traite.',
        'Une colonne extraite d’une table redevient une liste ordinaire que l’on peut parcourir.',
        'Le nombre d’étapes dépend de la stratégie choisie et des préconditions disponibles.'
      ]
    });
  }

  p9.duration = '130 min';
  p9.summary = 'Passer d’une liste de données à un algorithme explicable : parcours linéaire, extremum, précondition de tri, dichotomie, tris par sélection et insertion, puis comparaison qualitative des coûts.';
  p9.objectives = [
    'Écrire un parcours linéaire sans slice ni fonction qui cache l’algorithme',
    'Maintenir un meilleur courant pour calculer un extremum',
    'Expliquer pourquoi la dichotomie exige une liste triée',
    'Tracer les bornes gauche, droite et milieu jusqu’à la terminaison',
    'Implémenter les tris par sélection et insertion en identifiant leur invariant',
    'Comparer des algorithmes à partir d’un nombre d’étapes ou de comparaisons, pas du temps d’une machine particulière'
  ];
  p9.lessons = [
    {
      title:'1 · Parcours linéaire : une stratégie avant d’être une boucle',
      html:'Quand aucune organisation particulière n’aide la recherche, l’algorithme examine les valeurs l’une après l’autre. Cette stratégie convient pour chercher une valeur, compter, calculer une somme ou maintenir un extremum. Une boucle <code>for</code> n’est que l’écriture Python de cette idée. Aucun slice n’est nécessaire.',
      code:"tab = [7, 3, 9, 2]\nminimum = tab[0]\nfor i in range(1, len(tab)):\n    if tab[i] < minimum:\n        minimum = tab[i]\nprint(minimum)",
      points:[
        'Pour un extremum, la liste doit être non vide afin de disposer d’un premier meilleur courant.',
        'range(1, len(tab)) parcourt les indices restant à examiner sans créer une sous-liste.',
        'À chaque étape, minimum représente la plus petite valeur déjà rencontrée.'
      ]
    },
    {
      title:'2 · Coût : compter des opérations pertinentes',
      html:'Dire qu’un algorithme est « rapide » sans préciser ce que l’on compte est trop vague. Ici, on compte surtout les comparaisons ou les éléments examinés. Pour une liste de taille <code>n</code>, chercher un minimum effectue <code>n - 1</code> comparaisons. Une recherche séquentielle peut examiner jusqu’à <code>n</code> valeurs. On raisonne ainsi indépendamment de la vitesse du navigateur ou de l’ordinateur.',
      code:"def contient_compte(tab, x):\n    comparaisons = 0\n    for valeur in tab:\n        comparaisons += 1\n        if valeur == x:\n            return True, comparaisons\n    return False, comparaisons",
      points:[
        'Le coût décrit la croissance du travail lorsque la taille des données augmente.',
        'Un parcours complet est linéaire : doubler le nombre de valeurs double approximativement le travail.',
        'Le chronométrage réel dépend de la machine ; ce n’est pas notre outil principal ici.'
      ]
    },
    {
      title:'3 · Dichotomie : la liste triée est une précondition',
      html:'La recherche dichotomique ne fonctionne correctement que si la liste est <strong>triée par ordre croissant</strong>. Cette propriété est une précondition, pas un détail. Après avoir comparé la cible à la valeur du milieu, l’ordre permet d’éliminer toute une moitié de la zone encore possible. Sur une liste non triée, cette élimination n’est pas justifiée.',
      code:"tab = [2, 5, 8, 12, 20]\nx = 12\ng = 0\nd = len(tab) - 1\nwhile g <= d:\n    m = (g + d) // 2\n    print(g, d, m, tab[m])\n    if tab[m] == x:\n        break\n    elif tab[m] < x:\n        g = m + 1\n    else:\n        d = m - 1",
      points:[
        'Zone de recherche : indices compris entre g et d inclus.',
        'Si tab[m] < x, les indices jusqu’à m peuvent être exclus grâce au tri.',
        'Si tab[m] > x, les indices à partir de m peuvent être exclus grâce au tri.'
      ]
    },
    {
      title:'4 · Terminaison de la dichotomie : exclure le milieu déjà testé',
      html:'Après avoir testé l’indice <code>m</code>, il ne doit plus appartenir à la nouvelle zone de recherche. C’est pourquoi on écrit <code>g = m + 1</code> ou <code>d = m - 1</code>. La zone diminue strictement ; quand <code>g > d</code>, elle est vide et la valeur est absente. Cette trace est plus importante à comprendre qu’une formule apprise par cœur.',
      code:"def indice_dicho(tab, x):\n    g = 0\n    d = len(tab) - 1\n    while g <= d:\n        m = (g + d) // 2\n        if tab[m] == x:\n            return m\n        elif tab[m] < x:\n            g = m + 1\n        else:\n            d = m - 1\n    return -1",
      points:[
        'La liste vide fonctionne naturellement : d vaut -1 et la boucle ne démarre pas.',
        'Le milieu testé est toujours retiré de la zone suivante.',
        'Le coût diminue très vite car la zone restante est approximativement divisée par deux à chaque étape.'
      ]
    },
    {
      title:'5 · Tri par sélection : fixer une position après l’autre',
      html:'Le tri par sélection construit une zone triée au début de la liste. À l’étape <code>i</code>, on cherche l’indice du plus petit élément parmi les positions <code>i</code> à la fin, puis on l’échange avec la position <code>i</code>. Après cet échange, la position <code>i</code> est définitivement correcte.',
      code:"t = [5, 2, 4, 1]\nfor i in range(len(t)):\n    imin = i\n    for j in range(i + 1, len(t)):\n        if t[j] < t[imin]:\n            imin = j\n    t[i], t[imin] = t[imin], t[i]\nprint(t)",
      points:[
        'Invariant : avant l’étape i, les positions 0 à i-1 sont déjà triées et contiennent les plus petites valeurs.',
        'La recherche du minimum de la zone restante utilise elle-même un parcours linéaire.',
        'Le nombre total de comparaisons grandit comme le carré de la taille : ce tri devient coûteux sur de grandes listes.'
      ]
    },
    {
      title:'6 · Tri par insertion : insérer une valeur dans une zone déjà triée',
      html:'Le tri par insertion maintient également une zone triée au début de la liste, mais il prend la valeur suivante et la décale vers la gauche jusqu’à sa bonne position. On mémorise la valeur avant de décaler les éléments plus grands. Aucun <code>sorted</code>, <code>sort</code> ou slice n’est nécessaire pour comprendre l’algorithme.',
      code:"t = [5, 2, 4, 1]\nfor i in range(1, len(t)):\n    valeur = t[i]\n    j = i\n    while j > 0 and t[j - 1] > valeur:\n        t[j] = t[j - 1]\n        j -= 1\n    t[j] = valeur\nprint(t)",
      points:[
        'Invariant : avant d’insérer t[i], les positions 0 à i-1 sont triées.',
        'Le while décale seulement les valeurs strictement supérieures à la valeur à insérer.',
        'Dans le pire cas, le nombre de comparaisons et déplacements croît lui aussi quadratiquement.'
      ]
    }
  ];

  Object.assign(byId(p9.exercises, 'P9-E1'), {
    title:'Minimum par parcours sans slice', level:1,
    prompt:'Écris <code>minimum(tab)</code>. Le paramètre <code>tab</code> est une liste non vide de nombres. La fonction doit renvoyer sa plus petite valeur sans utiliser <code>min</code>, sans <code>sorted</code> et sans slice. Initialise le meilleur courant avec <code>tab[0]</code>, puis examine les indices de 1 à <code>len(tab)-1</code>.',
    starter:'def minimum(tab):\n    assert len(tab) > 0\n    m = tab[0]\n    # Parcours les indices restant à examiner\n    pass',
    tests:[
      {label:'simple',expr:'minimum([4,1,9]) == 1'},
      {label:'négatif',expr:'minimum([4,-3,9]) == -3'},
      {label:'un seul élément',expr:'minimum([7]) == 7'},
      {label:'minimum répété',expr:'minimum([2,1,3,1]) == 1'}
    ],
    hints:['Commence la boucle à i = 1 avec range(1, len(tab)).','Compare tab[i] au meilleur courant m.','Mets m à jour uniquement si une valeur plus petite est rencontrée.'],
    solution:'def minimum(tab):\n    assert len(tab) > 0\n    m = tab[0]\n    for i in range(1, len(tab)):\n        if tab[i] < m:\n            m = tab[i]\n    return m'
  });

  Object.assign(byId(p9.exercises, 'P9-E2'), {
    title:'Recherche dichotomique avec précondition explicite', level:2,
    prompt:'Complète <code>indice_dicho(tab, x)</code>. Le paramètre <code>tab</code> est une liste triée par ordre croissant et <code>x</code> est la valeur recherchée. La fonction renvoie un indice où <code>x</code> apparaît, ou <code>-1</code> si elle est absente. À chaque tour, le milieu déjà testé doit être exclu de la zone suivante.',
    starter:'def indice_dicho(tab, x):\n    g = 0\n    d = len(tab) - 1\n    while g <= d:\n        m = (g + d) // 2\n        # Compare tab[m] à x et réduis strictement la zone\n        pass\n    return -1',
    tests:[
      {label:'trouvé',expr:'indice_dicho([1,4,7,9,13],9) == 3'},
      {label:'absent',expr:'indice_dicho([1,4,7,9,13],8) == -1'},
      {label:'extrémité gauche',expr:'indice_dicho([1,4,7],1) == 0'},
      {label:'liste vide',expr:'indice_dicho([],5) == -1'},
      {label:'un élément absent',expr:'indice_dicho([6],5) == -1'}
    ],
    hints:['Si tab[m] == x, renvoie m immédiatement.','Si tab[m] < x, la nouvelle borne gauche est m + 1.','Sinon, la nouvelle borne droite est m - 1.'],
    solution:'def indice_dicho(tab, x):\n    g = 0\n    d = len(tab) - 1\n    while g <= d:\n        m = (g + d) // 2\n        if tab[m] == x:\n            return m\n        elif tab[m] < x:\n            g = m + 1\n        else:\n            d = m - 1\n    return -1'
  });

  Object.assign(byId(p9.exercises, 'P9-E3'), {
    title:'Tri par sélection expliqué', level:3,
    prompt:'Écris <code>tri_selection(tab)</code>. Le paramètre <code>tab</code> est une liste de nombres. La fonction doit renvoyer une copie triée par ordre croissant sans modifier <code>tab</code>, sans utiliser <code>min</code>, <code>sorted</code>, <code>sort</code> ni slice. À l’étape <code>i</code>, cherche l’indice du minimum entre <code>i</code> et la fin, puis échange les deux valeurs.',
    starter:'def tri_selection(tab):\n    t = list(tab)\n    # À chaque i, cherche imin puis échange t[i] et t[imin]\n    pass',
    tests:[
      {label:'tri',expr:'tri_selection([5,2,4,1]) == [1,2,4,5]'},
      {label:'doublons',expr:'tri_selection([3,1,3,2]) == [1,2,3,3]'},
      {label:'vide',expr:'tri_selection([]) == []'},
      {label:'déjà trié',expr:'tri_selection([1,2,3]) == [1,2,3]'}
    ],
    hints:['Pour chaque i, initialise imin = i.','Parcours j de i + 1 jusqu’à la fin et compare t[j] à t[imin].','Après la boucle interne, échange t[i] et t[imin].'],
    solution:'def tri_selection(tab):\n    t = list(tab)\n    for i in range(len(t)):\n        imin = i\n        for j in range(i + 1, len(t)):\n            if t[j] < t[imin]:\n                imin = j\n        t[i], t[imin] = t[imin], t[i]\n    return t'
  });

  assignById(practiceBank, 'P9-X1', {
    level:1, kind:'compléter',
    prompt:'Complète <code>contient(tab, x)</code>. Le paramètre <code>tab</code> est une liste qui peut être non triée et <code>x</code> est la valeur recherchée. Sans utiliser <code>in</code>, parcours les valeurs de gauche à droite et renvoie <code>True</code> dès que <code>x</code> est trouvé, sinon <code>False</code> après le parcours complet.',
    tests:[
      {label:'présent',expr:'contient([3,8,1],8) is True'},
      {label:'absent',expr:'contient([3,8,1],9) is False'},
      {label:'vide',expr:'contient([],4) is False'}
    ],
    hints:['La variable valeur contient l’élément courant.','Compare valeur == x.','Le return False doit rester après la boucle : avant, tous les éléments n’auraient pas été examinés.']
  });

  assignById(practiceBank, 'P9-X4', {
    level:1, kind:'écrire',
    prompt:'Écris <code>est_trie(tab)</code>. Le paramètre <code>tab</code> est une liste de valeurs comparables. Renvoie <code>True</code> si elle est croissante au sens large : pour tout indice à partir de 1, la valeur courante ne doit pas être plus petite que la précédente. La liste vide et une liste d’un élément sont considérées triées.',
    hints:['Commence à l’indice 1.','Si tab[i] < tab[i-1], la précondition de tri est violée : renvoie False.','Si aucune descente n’est rencontrée, renvoie True après la boucle.']
  });

  assignById(practiceBank, 'P9-X2', {
    level:2, kind:'déboguer',
    prompt:'La fonction <code>contient_dicho(tab, x)</code> reçoit une liste <code>tab</code> triée par ordre croissant et une valeur <code>x</code>. Elle peut boucler car, après avoir testé le milieu <code>m</code>, elle garde actuellement <code>m</code> dans la zone de recherche. Corrige seulement la mise à jour des bornes afin d’exclure le milieu déjà testé.',
    tests:[
      {label:'présent',expr:'contient_dicho([1,4,7,9],9) is True'},
      {label:'absent',expr:'contient_dicho([1,4,7,9],8) is False'},
      {label:'premier',expr:'contient_dicho([1,4,7,9],1) is True'},
      {label:'vide',expr:'contient_dicho([],5) is False'}
    ],
    hints:['Après tab[m] < x, m est déjà exclu : utilise m + 1.','Dans l’autre cas, utilise m - 1.','La zone doit devenir strictement plus petite à chaque tour où la valeur n’est pas trouvée.']
  });

  assignById(practiceBank, 'P9-X3', {
    level:2, kind:'écrire',
    prompt:'Écris <code>tri_durees(tab)</code>. Le paramètre <code>tab</code> est une liste de durées numériques. Renvoie une copie triée par ordre croissant avec le tri par insertion, sans modifier <code>tab</code>, sans utiliser <code>sorted</code>, <code>sort</code> ni slice. À l’étape <code>i</code>, mémorise <code>t[i]</code>, décale vers la droite les valeurs précédentes plus grandes, puis insère la valeur mémorisée.',
    hints:['Commence à i = 1 : la zone d’un seul élément est déjà triée.','Mémorise valeur = t[i] avant de déplacer quoi que ce soit.','Tant que j > 0 et t[j-1] > valeur, décale t[j-1] vers t[j].']
  });

  assignById(practiceBank, 'P9-X5', {
    level:3, kind:'transfert',
    prompt:'Écris <code>rendu(montant)</code>. Le paramètre <code>montant</code> est un entier positif ou nul. Avec les pièces fixées <code>[50,20,10,5,2,1]</code>, construis une liste de pièces en prenant à chaque étape la plus grande pièce qui ne dépasse pas le montant restant, jusqu’à obtenir 0. Cet exercice illustre ensuite une stratégie gloutonne ; il vient après les parcours, la dichotomie et les tris.'
  });

  reorderPractice(practiceBank, ['P9-X1','P9-X4','P9-X2','P9-X3','P9-X5']);

  const noviceP9 = byModule(noviceBank, 'P9');
  if (noviceP9) {
    noviceP9.goal = 'Choisir et expliquer un algorithme sur une liste : parcours linéaire, meilleur courant, précondition de tri, réduction de zone et premiers tris, en reliant chaque stratégie à son coût.';
    noviceP9.prerequisites = ['Boucles for et while de P3','Listes et indices de P6','Fonctions de P4','P8 seulement pour comprendre d’où peuvent venir les listes de données ; aucun CSV n’est nécessaire dans P9'];
    noviceP9.vocabulary = [
      ['parcours linéaire','Examen des éléments l’un après l’autre ; dans le pire cas, tous peuvent être examinés.'],
      ['meilleur courant','Valeur ou indice qui représente le meilleur résultat parmi les éléments déjà parcourus.'],
      ['précondition','Propriété supposée vraie avant d’exécuter l’algorithme ; la dichotomie exige ici une liste triée.'],
      ['zone de recherche','Intervalle d’indices dans lequel la valeur recherchée peut encore se trouver.'],
      ['invariant','Propriété qui reste vraie au cours des étapes et aide à expliquer pourquoi l’algorithme fonctionne.'],
      ['coût','Nombre d’opérations pertinentes, par exemple comparaisons ou éléments examinés, en fonction de la taille des données.']
    ];
    noviceP9.harness = 'Avant de coder, nomme la stratégie : parcours complet, maintien d’un meilleur, réduction de moitié, sélection ou insertion. Ensuite seulement traduis cette stratégie avec les boucles. Les slices, min, max, sorted et sort ne sont jamais nécessaires pour réussir les exercices cœur de P9.';
    noviceP9.worked = {
      title:'Du tableau de notes au minimum',
      problem:'Une table P8 a déjà fourni la liste notes = [17, 9, 14, 12]. On cherche maintenant sa plus petite valeur en explicitant le travail effectué.',
      steps:[
        ['1 · Poser la précondition','La liste doit être non vide pour initialiser un meilleur courant avec notes[0].'],
        ['2 · Maintenir le meilleur courant','À chaque nouvel indice, comparer la valeur au minimum connu et mettre à jour seulement si elle est plus petite.'],
        ['3 · Compter le travail','Avec 4 valeurs, 3 comparaisons suffisent après l’initialisation : une pour chaque valeur restante.']
      ],
      code:'notes = [17, 9, 14, 12]\nminimum = notes[0]\nfor i in range(1, len(notes)):\n    if notes[i] < minimum:\n        minimum = notes[i]\nprint(minimum)'
    };
    noviceP9.checks = [
      {q:'Pour chercher un minimum dans une liste non triée de n valeurs, que doit-on généralement faire ?',options:['Examiner les valeurs','Regarder uniquement le milieu','Trier obligatoirement avant','Utiliser un CSV'],answer:0,explain:'Sans information supplémentaire, une valeur plus petite peut se trouver n’importe où.'},
      {q:'Pourquoi la dichotomie exige-t-elle une liste triée ?',options:['Pour utiliser append','Pour justifier l’élimination d’une moitié','Pour éviter les fonctions','Pour transformer les nombres en chaînes'],answer:1,explain:'L’ordre permet de conclure que toute une moitié ne peut plus contenir la cible.'},
      {q:'Après avoir testé le milieu m sans trouver x, pourquoi utilise-t-on m+1 ou m-1 ?',options:['Pour exclure le milieu déjà testé et réduire strictement la zone','Pour recopier la liste','Pour trier automatiquement','Pour créer une slice'],answer:0,explain:'Conserver m pourrait empêcher la zone de diminuer et provoquer une boucle infinie.'},
      {q:'Dans un tri par sélection, que devient la position i après l’étape i ?',options:['Elle est définitivement correcte','Elle est supprimée','Elle devient toujours 0','Elle n’a aucune propriété'],answer:0,explain:'On y place le minimum de la zone restante ; cette position n’a plus besoin d’être modifiée.'}
    ];
  }

  const primmP9 = byModule(primmBank, 'P9');
  if (primmP9) {
    primmP9.title = 'Tracer une dichotomie sans oublier sa précondition';
    primmP9.seed = "tab = [2, 5, 8, 12, 20]\nx = 12\ng = 0\nd = len(tab) - 1\nwhile g <= d:\n    m = (g + d) // 2\n    print(g, d, m, tab[m])\n    if tab[m] == x:\n        break\n    elif tab[m] < x:\n        g = m + 1\n    else:\n        d = m - 1";
    primmP9.predict = 'Sans exécuter, écris les lignes affichées successivement sous la forme g, d, m, tab[m]. Indique la précondition indispensable sur tab.';
    primmP9.investigate = [
      'Quelle zone d’indices reste possible après chaque comparaison ?',
      'Pourquoi peut-on éliminer une moitié entière seulement parce que tab est triée ?',
      'Pourquoi m est-il exclu avec m + 1 ou m - 1 après une comparaison non concluante ?'
    ];
    primmP9.modify = 'Remplace x par 9 puis par 6. Trace les bornes et explique dans le second cas pourquoi la boucle termine avec une zone vide.';
    primmP9.make = 'Écris contient_dicho(tab, x) pour une liste tab triée par ordre croissant. La fonction doit renvoyer True ou False et réduire strictement la zone de recherche à chaque tour.';
  }
}
