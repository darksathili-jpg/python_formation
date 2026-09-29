/* PYTHON//FORGE V1.13 — Student Zero Gate, Première P9 → Terminale T1
   Transition from iterative algorithmic reasoning to recursion.
   The gate makes the recursive mental model explicit: base case, progress measure,
   descent, pending calls, unwinding, and deliberate choice between iteration/recursion.
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

export function applyStudentZeroP9T1(modules, practiceBank, primmBank, noviceBank) {
  const p9 = modules.find(module => module.id === 'P9');
  const t1 = modules.find(module => module.id === 'T1');
  if (!p9 || !t1) return;

  if (!p9.lessons.some(lesson => lesson.title.includes('Transition P9 → T1'))) {
    p9.lessons.push({
      title:'Transition P9 → T1 · du variant de boucle à la mesure récursive',
      html:'En Première, tu as appris qu’une boucle <code>while</code> doit faire évoluer une quantité vers l’arrêt. En récursivité, la même exigence réapparaît sous une autre forme : <strong>chaque appel doit recevoir un problème plus proche d’un cas de base</strong>. La grande nouveauté n’est donc pas la terminaison, mais le fait que plusieurs appels restent en attente pendant la descente puis terminent en sens inverse pendant la remontée.',
      code:"# Itération : la variable n évolue dans le même appel\ndef descendre_iter(n):\n    while n > 0:\n        n -= 1\n\n# Récursion : chaque appel reçoit une nouvelle valeur de n\ndef descendre_rec(n):\n    if n == 0:\n        return\n    descendre_rec(n - 1)",
      points:[
        'Boucle : un même appel fait évoluer son état.',
        'Récursion : chaque appel crée un nouveau contexte avec ses propres paramètres.',
        'Dans les deux cas, une quantité doit progresser vers l’arrêt.'
      ]
    });
  }

  t1.duration = '155 min';
  t1.summary = 'Construire un modèle mental fiable de la récursivité : cas de base, mesure de progression, descente des appels, pile d’appels, remontée des résultats et choix raisonné entre itération et récursion.';
  t1.bo = 'Récursivité — écrire un programme récursif ; analyser le fonctionnement d’un programme récursif';
  t1.objectives = [
    'Identifier sans ambiguïté le ou les cas de base',
    'Nommer une mesure qui rapproche chaque appel du cas de base',
    'Tracer la descente des appels sans exécuter le programme',
    'Expliquer ce qui reste en attente dans la pile d’appels',
    'Reconstituer la remontée des valeurs dans l’ordre correct',
    'Écrire des fonctions récursives sans slice caché',
    'Comparer une solution récursive à une solution itérative et justifier le choix'
  ];

  t1.lessons = [
    {
      title:'1 · Récursion : même problème, instance plus petite',
      html:'Une fonction récursive est une fonction qui s’appelle elle-même. Cette définition ne suffit pourtant pas pour programmer correctement. Il faut pouvoir reformuler le problème courant à l’aide d’une <strong>instance plus petite du même problème</strong>, jusqu’à atteindre une situation que l’on sait résoudre directement : le cas de base.',
      code:"def repete(c, n):\n    assert n >= 0\n    if n == 0:          # cas de base\n        return ''\n    return c + repete(c, n - 1)  # problème plus petit",
      points:[
        'Le cas de base donne une réponse sans nouvel appel récursif.',
        'L’appel récursif doit porter sur un état plus proche du cas de base.',
        'Il faut aussi savoir combiner le résultat du sous-problème avec le problème courant.'
      ]
    },
    {
      title:'2 · Itération et récursion : deux organisations du calcul',
      html:'Une boucle et une fonction récursive peuvent résoudre le même problème. Avec une boucle, on met à jour des variables dans un même appel. Avec la récursion, plusieurs appels de la même fonction existent successivement, chacun avec ses propres paramètres. Il ne faut donc pas lire un appel récursif comme un simple « retour au début de la fonction ».',
      code:"def somme_iter(n):\n    total = 0\n    while n > 0:\n        total += n\n        n -= 1\n    return total\n\ndef somme_rec(n):\n    if n == 0:\n        return 0\n    return n + somme_rec(n - 1)",
      points:[
        'Les deux versions calculent le même résultat.',
        'La version itérative mémorise explicitement un accumulateur.',
        'La version récursive confie le reste du calcul à un nouvel appel.'
      ]
    },
    {
      title:'3 · La règle des trois questions : base, progrès, combinaison',
      html:'Avant d’écrire une fonction récursive, réponds toujours à trois questions. <strong>1. Quand puis-je répondre directement ? 2. Quelle donnée prouve que le problème devient plus petit ? 3. Comment utiliser le résultat du sous-problème ?</strong> Si l’une de ces réponses manque, le programme est fragile ou incomplet.',
      code:"# Pour somme_n(n) :\n# 1. base       : n == 0 -> 0\n# 2. progrès    : n devient n - 1\n# 3. combinaison: n + résultat du sous-problème",
      points:[
        'Le cas de base n’est pas une décoration : il arrête les appels.',
        'La mesure de progression joue un rôle analogue au variant d’une boucle.',
        'La combinaison peut être une addition, une concaténation, un booléen, une construction de structure, etc.'
      ]
    },
    {
      title:'4 · Descente : chaque appel attend le suivant',
      html:'Lors de la <strong>descente</strong>, Python crée un contexte pour chaque appel. Si le résultat dépend de l’appel suivant, l’appel courant reste en attente. Pour <code>somme_n(3)</code>, les appels <code>somme_n(3)</code>, <code>somme_n(2)</code> et <code>somme_n(1)</code> ne sont pas terminés quand on atteint <code>somme_n(0)</code>.',
      code:"somme_n(3)\n  attend 3 + somme_n(2)\n             attend 2 + somme_n(1)\n                        attend 1 + somme_n(0)\n                                   renvoie 0",
      points:[
        'Chaque appel possède sa propre valeur de n.',
        'Un appel peut rester suspendu en attendant le résultat d’un autre appel.',
        'La pile d’appels mémorise ces calculs encore inachevés.'
      ]
    },
    {
      title:'5 · Remontée : les résultats reviennent en sens inverse',
      html:'Après le cas de base commence la <strong>remontée</strong>. Le dernier appel créé est le premier à pouvoir se terminer. Les résultats sont donc combinés dans l’ordre inverse de la descente. Tracer seulement les appels descendants ne suffit pas : il faut aussi savoir reconstruire cette remontée.',
      code:"somme_n(0) -> 0\nsomme_n(1) -> 1 + 0 = 1\nsomme_n(2) -> 2 + 1 = 3\nsomme_n(3) -> 3 + 3 = 6",
      points:[
        'Descente : 3, 2, 1, 0.',
        'Remontée : résultat de 0, puis de 1, puis de 2, puis de 3.',
        'C’est la raison pour laquelle du code placé après l’appel récursif s’exécute à la remontée.'
      ]
    },
    {
      title:'6 · Récursion sur une séquence sans slice : rendre l’état visible',
      html:'Pour parcourir récursivement une liste ou une chaîne, un indice explicite rend la progression visible et évite de dépendre des slices. Par exemple, <code>i</code> désigne la prochaine position à examiner ; l’appel suivant utilise <code>i + 1</code>. Le cas de base est atteint lorsque <code>i == len(tab)</code>.',
      code:"def compte(tab, x, i):\n    if i == len(tab):\n        return 0\n    if tab[i] == x:\n        return 1 + compte(tab, x, i + 1)\n    return compte(tab, x, i + 1)",
      points:[
        'Aucun slice n’est nécessaire pour exprimer « le reste de la séquence ».',
        'L’indice i joue le rôle de mesure de progression.',
        'L’appel initial utilise i = 0.'
      ]
    },
    {
      title:'7 · Tracer avant d’écrire',
      html:'Pour analyser un programme récursif, écris d’abord quelques appels à la main. Note pour chacun les paramètres reçus, le prochain appel et ce qui reste à calculer après son retour. Cette discipline évite deux confusions fréquentes : croire que toutes les variables partagent une seule valeur, ou oublier le travail qui reste à faire pendant la remontée.',
      code:"# Exemple de fiche de trace\n# appel       prochain appel       en attente\n# f(3)        f(2)                 3 + ...\n# f(2)        f(1)                 2 + ...\n# f(1)        f(0)                 1 + ...\n# f(0)        aucun                renvoie 0",
      points:[
        'Toujours commencer par identifier le cas de base.',
        'Vérifier ensuite que chaque appel s’en rapproche réellement.',
        'Enfin seulement, reconstruire les valeurs renvoyées.'
      ]
    },
    {
      title:'8 · Quand choisir la récursion ? Et quelles limites ?',
      html:'La récursion est particulièrement naturelle lorsqu’un problème se décrit lui-même à partir de sous-problèmes de même nature : dossiers contenant des dossiers, arbres, diviser pour régner. Elle n’est pas automatiquement meilleure qu’une boucle. En Python, une profondeur d’appels excessive finit par provoquer <code>RecursionError</code>. Il faut donc choisir la méthode qui exprime le problème clairement et garantir la progression vers un cas de base.',
      points:[
        'Récursif et itératif sont deux stratégies possibles, pas deux niveaux de qualité.',
        'Une récursion mal conçue peut ne jamais atteindre son cas de base.',
        'La récursivité terminale et ses optimisations ne constituent pas un attendu du parcours NSI.'
      ]
    }
  ];

  Object.assign(byId(t1.exercises, 'T1-E1'), {
    title:'Somme récursive guidée', level:1,
    prompt:'Complète <code>somme_n(n)</code> pour un entier <code>n >= 0</code>. La fonction doit calculer <code>0 + 1 + ... + n</code> récursivement. Le cas de base <code>n == 0</code> renvoie 0. Pour <code>n > 0</code>, le résultat est <code>n</code> plus le résultat du même problème pour <code>n - 1</code>. Aucune formule mathématique n’est à connaître.',
    starter:'def somme_n(n):\n    assert n >= 0\n    if n == 0:\n        return 0\n    # Combine n avec le résultat du sous-problème n - 1\n    return ____________',
    tests:[
      {label:'cas de base',expr:'somme_n(0) == 0'},
      {label:'un',expr:'somme_n(1) == 1'},
      {label:'cinq',expr:'somme_n(5) == 15'}
    ],
    hints:['Écris d’abord l’appel qui travaille sur un problème plus petit : somme_n(n - 1).','Il reste ensuite à ajouter n devant ce résultat.','La ligne attendue est return n + somme_n(n - 1).'],
    solution:'def somme_n(n):\n    assert n >= 0\n    if n == 0:\n        return 0\n    return n + somme_n(n - 1)'
  });

  Object.assign(byId(t1.exercises, 'T1-E2'), {
    title:'Compter depuis un indice', level:2,
    prompt:'Écris récursivement <code>compte(tab, x, i)</code>. <code>tab</code> est une liste, <code>x</code> la valeur à compter et <code>i</code> le premier indice encore à examiner. L’appel initial utilise <code>i = 0</code>. Quand <code>i == len(tab)</code>, aucune case ne reste à examiner et la fonction renvoie 0. Sinon, elle examine <code>tab[i]</code> puis appelle le même problème avec <code>i + 1</code>. Aucun slice ne doit être utilisé.',
    starter:'def compte(tab, x, i):\n    if i == len(tab):\n        return 0\n    # Examine tab[i], puis poursuis avec i + 1\n    pass',
    tests:[
      {label:'occurrences',expr:'compte([1,2,1,1],1,0) == 3'},
      {label:'vide',expr:'compte([],5,0) == 0'},
      {label:'depuis indice 2',expr:'compte([1,2,1,1],1,2) == 2'},
      {label:'absent',expr:"compte(['a','b'],'z',0) == 0"}
    ],
    hints:['Si tab[i] == x, le résultat vaut 1 + compte(tab, x, i + 1).','Sinon, l’élément courant ne compte pas : renvoie seulement compte(tab, x, i + 1).','Le cas de base est déjà écrit : i == len(tab).'],
    solution:'def compte(tab, x, i):\n    if i == len(tab):\n        return 0\n    if tab[i] == x:\n        return 1 + compte(tab, x, i + 1)\n    return compte(tab, x, i + 1)'
  });

  Object.assign(byId(t1.exercises, 'T1-E3'), {
    title:'Palindrome par rapprochement des indices', level:3,
    prompt:'Écris récursivement <code>palindrome(texte, g, d)</code>. <code>texte</code> est une chaîne, <code>g</code> l’indice gauche et <code>d</code> l’indice droit de la zone encore à vérifier. L’appel initial utilise <code>g = 0</code> et <code>d = len(texte) - 1</code>. Si <code>g >= d</code>, la zone restante contient au plus un caractère : renvoie <code>True</code>. Si <code>texte[g] != texte[d]</code>, renvoie <code>False</code>. Sinon rapproche les deux indices avec <code>g + 1</code> et <code>d - 1</code>. Aucun slice n’est nécessaire.',
    starter:'def palindrome(texte, g, d):\n    # Cas de base, comparaison des extrémités, puis appel sur la zone intérieure\n    pass',
    tests:[
      {label:'kayak',expr:"palindrome('kayak',0,4) is True"},
      {label:'python',expr:"palindrome('python',0,5) is False"},
      {label:'vide',expr:"palindrome('',0,-1) is True"},
      {label:'deux identiques',expr:"palindrome('aa',0,1) is True"}
    ],
    hints:['Premier cas : si g >= d, renvoie True.','Deuxième cas : si texte[g] != texte[d], renvoie False.','Sinon renvoie palindrome(texte, g + 1, d - 1).'],
    solution:'def palindrome(texte, g, d):\n    if g >= d:\n        return True\n    if texte[g] != texte[d]:\n        return False\n    return palindrome(texte, g + 1, d - 1)'
  });

  assignById(practiceBank, 'T1-X1', {
    title:'Répéter un symbole', level:1, kind:'compléter',
    prompt:'Complète récursivement <code>repete(c, n)</code>. <code>c</code> est la chaîne à répéter et <code>n</code> un entier supérieur ou égal à 0 indiquant combien de répétitions produire. Pour <code>n == 0</code>, renvoie la chaîne vide. Sinon, place <code>c</code> devant le résultat obtenu pour <code>n - 1</code>.',
    starter:"def repete(c, n):\n    assert n >= 0\n    if n == 0:\n        return ''\n    return ____________",
    tests:[{label:'trois',expr:"repete('x',3) == 'xxx'"},{label:'zéro',expr:"repete('a',0) == ''"},{label:'un',expr:"repete('NSI',1) == 'NSI'"}],
    hints:['Le sous-problème est repete(c, n - 1).','Combine c avec ce résultat à l’aide de +.'],
    solution:"def repete(c, n):\n    assert n >= 0\n    if n == 0:\n        return ''\n    return c + repete(c, n - 1)",
    tags:['récursivité','chaîne','cas de base']
  });

  assignById(practiceBank, 'T1-X2', {
    title:'Longueur depuis une position', level:1, kind:'écrire',
    prompt:'Écris récursivement <code>longueur_depuis(tab, i)</code>. <code>tab</code> est une liste et <code>i</code> le premier indice encore à compter. Si <code>i == len(tab)</code>, renvoie 0. Sinon l’élément courant compte pour 1 et l’appel suivant commence à <code>i + 1</code>. L’appel initial se fait avec <code>i = 0</code>. N’utilise aucun slice.',
    starter:'def longueur_depuis(tab, i):\n    pass',
    tests:[{label:'trois',expr:'longueur_depuis([4,8,2],0) == 3'},{label:'vide',expr:'longueur_depuis([],0) == 0'},{label:'depuis 2',expr:'longueur_depuis([4,8,2,7],2) == 2'}],
    hints:['Cas de base : i == len(tab).','Sinon renvoie 1 + longueur_depuis(tab, i + 1).'],
    solution:'def longueur_depuis(tab, i):\n    if i == len(tab):\n        return 0\n    return 1 + longueur_depuis(tab, i + 1)',
    tags:['récursivité','liste','indice']
  });

  assignById(practiceBank, 'T1-X3', {
    title:'Déboguer une récursion qui s’éloigne', level:2, kind:'déboguer',
    prompt:'La fonction <code>somme_n(n)</code> doit calculer <code>0 + 1 + ... + n</code> pour <code>n >= 0</code>, mais l’appel récursif s’éloigne du cas de base et finit par provoquer une erreur de récursion. Corrige uniquement la progression de l’appel récursif.',
    starter:'def somme_n(n):\n    assert n >= 0\n    if n == 0:\n        return 0\n    return n + somme_n(n + 1)',
    tests:[{label:'base',expr:'somme_n(0) == 0'},{label:'quatre',expr:'somme_n(4) == 10'}],
    hints:['Observe la distance entre n et 0.','À chaque appel, n doit se rapprocher de 0 : utilise n - 1.'],
    solution:'def somme_n(n):\n    assert n >= 0\n    if n == 0:\n        return 0\n    return n + somme_n(n - 1)',
    tags:['récursivité','débogage','terminaison']
  });

  assignById(practiceBank, 'T1-X4', {
    title:'Puissance rapide — règle fournie', level:3, kind:'transfert',
    prompt:'Écris <code>puissance_rapide(a, n)</code> pour <code>n >= 0</code>. Aucune formule n’est à retrouver : utilise exactement les règles fournies. Si <code>n == 0</code>, renvoie 1. Si <code>n</code> est pair, calcule une seule fois <code>p = puissance_rapide(a, n // 2)</code> puis renvoie <code>p * p</code>. Si <code>n</code> est impair, renvoie <code>a * puissance_rapide(a, n - 1)</code>.',
    starter:'def puissance_rapide(a, n):\n    assert n >= 0\n    pass',
    tests:[{label:'base',expr:'puissance_rapide(7,0) == 1'},{label:'pair',expr:'puissance_rapide(3,8) == 6561'},{label:'impair',expr:'puissance_rapide(2,9) == 512'}],
    hints:['Commence par le cas n == 0.','Teste ensuite n % 2 == 0.','Dans le cas pair, stocke le résultat récursif dans p pour ne pas le calculer deux fois.'],
    solution:'def puissance_rapide(a, n):\n    assert n >= 0\n    if n == 0:\n        return 1\n    if n % 2 == 0:\n        p = puissance_rapide(a, n // 2)\n        return p * p\n    return a * puissance_rapide(a, n - 1)',
    tags:['récursivité','division du problème','transfert']
  });

  assignById(practiceBank, 'T1-X5', {
    title:'Explorer une arborescence de dossiers', level:3, kind:'transfert',
    prompt:'Un dossier est représenté par un dictionnaire contenant une clé <code>nom</code> et une clé <code>enfants</code>, dont la valeur est une liste de sous-dossiers de même forme. Écris récursivement <code>nb_dossiers(dossier)</code> pour compter le dossier courant et tous ses descendants. Une feuille possède une liste <code>enfants</code> vide. Cette activité prépare les parcours récursifs d’arbres.',
    starter:'def nb_dossiers(dossier):\n    pass',
    tests:[{label:'feuille',expr:"nb_dossiers({'nom':'A','enfants':[]}) == 1"},{label:'arbre',expr:"nb_dossiers({'nom':'A','enfants':[{'nom':'B','enfants':[]},{'nom':'C','enfants':[{'nom':'D','enfants':[]}]}]}) == 4"}],
    hints:['Compte d’abord 1 pour le dossier courant.','Pour chaque sous-dossier de dossier[\'enfants\'], ajoute récursivement son nombre de dossiers.'],
    solution:"def nb_dossiers(dossier):\n    total = 1\n    for enfant in dossier['enfants']:\n        total += nb_dossiers(enfant)\n    return total",
    tags:['récursivité','structure hiérarchique','arbres']
  });

  reorderPractice(practiceBank, ['T1-X1','T1-X2','T1-X3','T1-X4','T1-X5']);

  const primm = byModule(primmBank, 'T1');
  if (primm) Object.assign(primm, {
    title:'Descente et remontée visibles',
    seed:"def explorer(n):\n    print('descente', n)\n    if n == 0:\n        print('base')\n        return\n    explorer(n - 1)\n    print('remontee', n)\n\nexplorer(3)",
    predict:'Sans exécuter, écris exactement les huit lignes affichées. Sépare mentalement la descente jusqu’au cas de base puis la remontée.',
    investigate:[
      'Pourquoi les lignes remontee 1, remontee 2, remontee 3 apparaissent-elles dans cet ordre ?',
      'Au moment où explorer(0) est appelé, quels appels plus anciens attendent encore de terminer ?',
      'Quelle quantité prouve que chaque nouvel appel se rapproche du cas de base ?'
    ],
    modify:'Remplace explorer(3) par explorer(2), prédis le nouvel affichage puis vérifie. Ensuite déplace le print de remontée avant l’appel récursif et explique ce qui disparaît du modèle « descente / remontée ».',
    make:'Écris une petite fonction récursive sans slice qui parcourt une liste à l’aide d’un indice i. Avant de coder, donne son cas de base et explique comment i progresse.'
  });

  const novice = byModule(noviceBank, 'T1');
  if (novice) Object.assign(novice, {
    goal:'Comprendre une récursion comme une descente de problèmes plus petits suivie d’une remontée de résultats, et non comme une boucle écrite autrement.',
    prerequisites:['Fonctions et return','Conditions','Variant d’une boucle while','Indices de listes et chaînes'],
    vocabulary:[
      ['cas de base','Situation résolue directement, sans nouvel appel récursif.'],
      ['mesure de progression','Quantité qui prouve que chaque appel se rapproche d’un cas de base.'],
      ['pile d’appels','Ensemble ordonné des appels commencés mais pas encore terminés.']
    ],
    harness:'Lien avec P9 : le variant d’une boucle garantissait sa terminaison ; en récursivité, on cherche de la même façon une mesure qui se rapproche du cas de base. Pour analyser une fonction, sépare toujours la descente des appels et la remontée des résultats.',
    worked:{
      title:'Répéter sans slice ni boucle',
      problem:'Construire trois fois le caractère x avec une fonction récursive.',
      steps:[
        ['1 · Cas de base','repete("x", 0) renvoie la chaîne vide sans nouvel appel.'],
        ['2 · Descente','3 devient 2, puis 1, puis 0 : la mesure n diminue strictement.'],
        ['3 · Remontée','Le résultat devient "x", puis "xx", puis "xxx" en revenant vers le premier appel.']
      ],
      code:"def repete(c, n):\n    assert n >= 0\n    if n == 0:\n        return ''\n    return c + repete(c, n - 1)\n\nprint(repete('x', 3))"
    },
    checks:[
      {q:'Dans return n + f(n - 1), que fait l’appel f(n) tant que f(n - 1) n’a pas renvoyé de valeur ?',options:['Il est terminé','Il reste en attente','Il devient une boucle','Il oublie n'],answer:1,explain:'Le contexte de l’appel courant reste dans la pile d’appels jusqu’au retour du sous-problème.'},
      {q:'Si le cas de base est n == 0, quel appel montre une progression correcte pour n positif ?',options:['f(n + 1)','f(n)','f(n - 1)','f(2 * n)'],answer:2,explain:'n - 1 rapproche strictement la mesure n de 0.'},
      {q:'Pourquoi du code placé après l’appel récursif s’exécute-t-il souvent dans l’ordre inverse ?',options:['Python trie les lignes','Les appels se terminent du plus récent au plus ancien','return inverse automatiquement les listes','À cause de range'],answer:1,explain:'Le dernier appel créé atteint son retour en premier ; les appels en attente reprennent ensuite dans l’ordre inverse de leur création.'}
    ]
  });
}
