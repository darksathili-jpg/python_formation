/* PYTHON//FORGE V1.9 — Student Zero Gate, Première P3 + P4
   Human-reviewed transition from loop reasoning to genuine function writing.
   The goal is to remove hidden prerequisites while transferring responsibility
   progressively from a supplied function shell (P3) to full functions (P4).
*/

function byId(list, id) { return list.find(item => item.id === id); }
function byModule(list, id) { return list.find(item => item.moduleId === id); }

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

export function applyStudentZeroP3P4(modules, practiceBank, primmBank, noviceBank) {
  const p3 = modules.find(module => module.id === 'P3');
  const p4 = modules.find(module => module.id === 'P4');
  if (!p3 || !p4) return;

  /* ------------------------------------------------------------------
     P3 — reason about loops without also asking for function design.
     ------------------------------------------------------------------ */
  p3.duration = '85 min';
  p3.summary = 'Comprendre ce qui se répète, ce qui change à chaque tour et pourquoi la boucle finit, sans ajouter encore la difficulté de concevoir une fonction complète.';
  p3.objectives = [
    'Tracer une boucle tour par tour',
    'Distinguer compteur et accumulateur',
    'Parcourir des valeurs directement ou par leurs indices',
    'Choisir for ou while et justifier la terminaison'
  ];
  p3.lessons = [
    {
      title:'1 · for : une action répétée pour chaque valeur',
      html:'Dans ce module, certaines listes sont déjà fournies. Tu n’as pas encore à étudier toutes les opérations sur les listes : retiens simplement qu’une écriture comme <code>[4, 7, 2]</code> contient plusieurs valeurs et que <code>for valeur in ...</code> les fournit une par une, de gauche à droite.',
      code:'valeurs = [4, 7, 2]\nfor valeur in valeurs:\n    print(valeur)',
      points:[
        'Le corps indenté est exécuté une fois pour chaque valeur.',
        'La variable de boucle prend successivement chaque valeur de la collection.',
        'Avant de coder, demande-toi ce qui doit être fait une fois par élément.'
      ]
    },
    {
      title:'2 · Compteur et accumulateur : deux rôles à ne pas confondre',
      html:'Une boucle a souvent besoin d’une variable qui évolue. Un <strong>compteur</strong> dénombre des événements ; un <strong>accumulateur</strong> construit progressivement un résultat, par exemple une somme. Dans les deux cas, on choisit une valeur initiale puis on la met à jour à chaque tour utile.',
      code:"points = [5, 10, 3]\ntotal = 0\nfor p in points:\n    total = total + p\nprint(total)",
      points:[
        'Avant le premier tour, total vaut 0.',
        'Après chaque tour, total représente la somme des valeurs déjà parcourues.',
        '<code>total += p</code> est une écriture abrégée de <code>total = total + p</code>.'
      ]
    },
    {
      title:'3 · Valeur ou indice : choisir le bon parcours',
      html:'Si tu as seulement besoin des valeurs, parcours-les directement. Si tu dois connaître leur position, utilise les indices. Pour une liste <code>tab</code>, <code>len(tab)</code> est son nombre d’éléments et <code>range(len(tab))</code> produit les indices de 0 à <code>len(tab)-1</code>. L’étude complète des listes viendra en P6 ; ici on utilise seulement ce minimum nécessaire.',
      code:"tab = [8, 4, 9]\nfor i in range(len(tab)):\n    print(i, tab[i])",
      points:[
        'Le premier indice vaut 0.',
        'Le dernier indice valide vaut len(tab) - 1.',
        'N’utilise les indices que si la position fait partie du résultat demandé.'
      ]
    },
    {
      title:'4 · while : répéter tant qu’une condition reste vraie',
      html:'Avec <code>while</code>, Python ne sait pas à l’avance combien de tours seront nécessaires. Il faut donc identifier une quantité qui évolue vers l’arrêt. Cette quantité sert de <strong>variant</strong> : si elle ne progresse pas dans le bon sens, la boucle peut devenir infinie.',
      code:'n = 13\netapes = 0\nwhile n > 0:\n    n = n // 2\n    etapes += 1\nprint(etapes)',
      points:[
        'Écris d’abord la condition d’arrêt en français.',
        'Repère ensuite la variable qui doit évoluer.',
        'Vérifie sur papier un ou deux tours avant d’exécuter.'
      ]
    },
    {
      title:'5 · Dans P3, le cadre def / return reste fourni',
      html:'Les exercices doivent encore être testés automatiquement, donc ils sont placés dans une fonction. <strong>Tu n’as toujours pas à construire seul cette fonction dans P3.</strong> Le nom, les paramètres et le <code>return</code> final sont fournis autant que possible. Ton travail porte sur la boucle. En P4, ce cadre sera volontairement retiré : tu apprendras alors à écrire une fonction complète.',
      code:'def somme(valeurs):\n    total = 0\n    # Ton travail de P3 commence ici : la boucle\n    for valeur in valeurs:\n        total += valeur\n    return total',
      points:[
        'Ne change pas la signature de la fonction.',
        'Concentre-toi sur initialiser, répéter, mettre à jour et arrêter.',
        'P4 expliquera précisément paramètres, arguments, return, contrats et tests.'
      ]
    }
  ];

  Object.assign(byId(p3.exercises, 'P3-E1'), {
    title:'Construire une somme avec un accumulateur', level:1, kind:'compléter',
    prompt:'Le cadre de fonction et l’accumulateur <code>total</code> sont fournis. Complète seulement la boucle pour ajouter chaque valeur de <code>valeurs</code> à <code>total</code>, sans utiliser <code>sum</code>. Pour la liste vide, la boucle ne fait aucun tour et le résultat reste 0.',
    starter:'def somme(valeurs):\n    total = 0\n    for valeur in valeurs:\n        # Ajoute valeur à total\n        pass\n    return total',
    hints:['Avant le premier tour, total vaut 0.', 'À chaque tour, remplace pass par total += valeur.', 'Pour [], aucun tour n’est exécuté : total reste 0.']
  });
  Object.assign(byId(p3.exercises, 'P3-E2'), {
    title:'Compter les occurrences d’une valeur', level:2, kind:'compléter',
    prompt:'Le cadre est fourni. La fonction doit compter combien de fois <code>cible</code> apparaît dans <code>valeurs</code>. Le compteur commence à 0 ; il augmente de 1 uniquement lorsque la valeur courante est égale à <code>cible</code>. Complète le corps sans utiliser <code>list.count</code>.',
    starter:'def compte(valeurs, cible):\n    n = 0\n    for valeur in valeurs:\n        if valeur == cible:\n            # Incrémente n ici\n            pass\n    return n',
    hints:['Le compteur n doit changer seulement quand valeur == cible.', 'Remplace pass par n += 1.', 'Teste mentalement [1, 2, 1] avec cible = 1 : n doit évoluer 0 → 1 → 1 → 2.']
  });
  Object.assign(byId(p3.exercises, 'P3-E3'), {
    title:'Faire terminer une boucle while', level:3, kind:'compléter',
    prompt:'Le cadre est fourni. Pour un entier <code>n</code> strictement positif, compte le nombre de divisions entières par 2 nécessaires pour atteindre 0. À chaque tour, <code>n</code> doit devenir <code>n // 2</code> et le compteur <code>etapes</code> doit augmenter de 1. Complète uniquement les deux mises à jour.',
    starter:'def divisions_par_2(n):\n    etapes = 0\n    while n > 0:\n        # 1. fais diminuer n\n        # 2. augmente etapes\n        pass\n    return etapes',
    hints:['Le variant est n : il doit diminuer jusqu’à 0.', 'Utilise n //= 2.', 'Ajoute ensuite etapes += 1 dans la boucle.']
  });

  const p3x1 = byId(practiceBank, 'P3-X1');
  if (p3x1) Object.assign(p3x1, {
    kind:'compléter', level:1,
    prompt:'Le cadre est fourni. Complète une seule ligne dans la boucle : à chaque tour, ajoute les points de la quête <code>p</code> à l’accumulateur <code>total</code>. Sans <code>sum</code>.',
    hints:['Repère l’accumulateur : total.', 'À chaque tour : total += p.']
  });
  const p3x2 = byId(practiceBank, 'P3-X2');
  if (p3x2) Object.assign(p3x2, {
    kind:'compléter', level:1,
    prompt:'Le cadre de fonction est fourni. Compte les chaînes exactement égales à <code>"non lu"</code>. Initialise le compteur, parcours les états, puis incrémente uniquement lorsque l’état courant correspond.',
    starter:"def compte_non_lus(etats):\n    n = 0\n    for etat in etats:\n        if etat == 'non lu':\n            # Incrémente le compteur\n            pass\n    return n",
    hints:['Le compteur commence à 0.', 'Remplace pass par n += 1.']
  });
  const p3x3 = byId(practiceBank, 'P3-X3');
  if (p3x3) Object.assign(p3x3, {
    title:'Déboguer une boucle infinie', level:2, kind:'déboguer',
    prompt:'La fonction doit compter combien de décréments sont nécessaires pour faire passer un entier <code>n >= 0</code> à 0. Le programme fourni ne termine pas pour n > 0 car la variable évolue dans le mauvais sens. Corrige uniquement la mise à jour de <code>n</code>.',
    starter:'def compte_a_rebours(n):\n    tours = 0\n    while n > 0:\n        n += 1\n        tours += 1\n    return tours',
    tests:[
      {label:'3 → 3 tours',expr:'compte_a_rebours(3) == 3'},
      {label:'0 → aucun tour',expr:'compte_a_rebours(0) == 0'},
      {label:'5 → 5 tours',expr:'compte_a_rebours(5) == 5'}
    ],
    hints:['Observe la condition while n > 0 : pour finir, n doit se rapprocher de 0.', 'Remplace n += 1 par n -= 1.'],
    solution:'def compte_a_rebours(n):\n    tours = 0\n    while n > 0:\n        n -= 1\n        tours += 1\n    return tours',
    tags:['while','variant','débogage']
  });
  const p3x4 = byId(practiceBank, 'P3-X4');
  if (p3x4) Object.assign(p3x4, {
    level:3, kind:'transfert',
    prompt:'Le cadre est fourni. Renvoie l’indice de la première valeur strictement supérieure à <code>seuil</code>, ou -1 si elle n’existe pas. Ici la position fait partie du résultat : parcours donc les indices avec <code>range(len(valeurs))</code>, puis examine <code>valeurs[i]</code>. Une valeur exactement égale au seuil ne déclenche pas d’alerte.',
    hints:['La position est demandée : parcours i avec range(len(valeurs)).', 'Teste valeurs[i] > seuil.', 'Dès le premier dépassement, return i ; si la boucle finit, return -1.']
  });
  const p3x5 = byId(practiceBank, 'P3-X5');
  if (p3x5) Object.assign(p3x5, {
    level:2, kind:'compléter',
    prompt:'Le cadre est fourni. Tant que <code>taille > 1</code>, remplace taille par sa moitié entière <code>taille // 2</code> et compte un tour. L’objectif est de travailler la terminaison d’un while ; aucune notion de logarithme n’est nécessaire.',
    starter:'def reductions(taille):\n    n = 0\n    while taille > 1:\n        # Réduis taille puis compte un tour\n        pass\n    return n',
    hints:['À chaque tour : taille //= 2.', 'Puis n += 1.']
  });
  reorderPractice(practiceBank, ['P3-X1','P3-X2','P3-X3','P3-X5','P3-X4']);

  const noviceP3 = byModule(noviceBank, 'P3');
  if (noviceP3) {
    noviceP3.goal = 'Savoir expliquer une boucle tour par tour avant de devoir construire seul une fonction.';
    noviceP3.prerequisites = ['Conditions simples de P2','Lire une petite liste déjà fournie ; aucune manipulation avancée de liste'];
    noviceP3.vocabulary = [
      ['itération','Un passage complet dans le corps d’une boucle.'],
      ['compteur','Variable qui dénombre des événements ou des tours.'],
      ['accumulateur','Variable qui construit progressivement un résultat comme une somme.'],
      ['variant','Quantité qui évolue vers l’arrêt d’une boucle while.']
    ];
    noviceP3.harness = 'Dans tout P3, def ... et return restent un cadre fourni pour les tests. Tu n’as pas encore à inventer la signature d’une fonction : concentre-toi sur la boucle. La responsabilité de construire une fonction complète commence en P4.';
  }

  const primmP3 = byModule(primmBank, 'P3');
  if (primmP3) {
    primmP3.predict = 'Sans exécuter, construis un petit tableau de trace : valeur de action puis valeur de combo après chacun des 4 tours. Termine par la valeur affichée.';
    primmP3.investigate = ['Quelle variable parcourt la liste ?','Quelle variable joue le rôle de compteur ?','À quels tours le compteur change-t-il ?','Combien de tours sont exécutés au total ?'];
    primmP3.modify = 'Ajoute un second compteur pour compter les actions B sans supprimer le compteur des A.';
    primmP3.make = "À partir de la liste fournie ['A','B','B','A','B'], écris uniquement une boucle for qui compte les 'B' et affiche 3. Ne crée pas encore de fonction.";
  }

  /* ------------------------------------------------------------------
     P4 — explicit transfer of responsibility: write complete functions.
     ------------------------------------------------------------------ */
  p4.duration = '100 min';
  p4.summary = 'Passer du code placé dans un cadre fourni à une fonction complète : signature, paramètres, résultat, contrat et tests.';
  p4.objectives = [
    'Écrire une signature de fonction complète avec def',
    'Distinguer paramètre et argument',
    'Distinguer return et print',
    'Formuler une précondition et construire des tests nominaux, frontières et invalides'
  ];
  p4.lessons = [
    {
      title:'1 · Anatomie d’une fonction : pour la première fois, tu construis le cadre',
      html:'Jusqu’ici, le cadre <code>def ...</code> était fourni. À partir de P4, tu apprends à l’écrire. Une fonction possède un <strong>nom</strong>, des <strong>paramètres</strong>, un corps indenté et, lorsqu’elle doit produire une valeur, un <code>return</code>.',
      code:'def double(n):\n    resultat = n * 2\n    return resultat',
      points:[
        '<code>def</code> annonce la définition de la fonction.',
        'Les deux-points terminent la ligne d’en-tête.',
        'Tout le corps de la fonction est indenté.'
      ]
    },
    {
      title:'2 · Paramètre dans la définition, argument dans l’appel',
      html:'Dans <code>def double(n)</code>, <code>n</code> est un <strong>paramètre</strong> : un nom local utilisé par la fonction. Dans <code>double(7)</code>, <code>7</code> est un <strong>argument</strong> : la valeur fournie au moment de l’appel. Cette distinction permet de lire précisément un programme.',
      code:'def ajouter_bonus(score, bonus):\n    return score + bonus\n\nresultat = ajouter_bonus(10, 4)\nprint(resultat)',
      points:[
        'score et bonus sont les paramètres de la définition.',
        '10 et 4 sont les arguments de cet appel.',
        'À chaque nouvel appel, les paramètres reçoivent les nouveaux arguments.'
      ]
    },
    {
      title:'3 · return produit une valeur ; print l’affiche',
      html:'C’est une confusion très fréquente chez les débutants. <code>print</code> montre quelque chose à l’écran ; <code>return</code> renvoie une valeur au programme qui a appelé la fonction. Les tests automatiques ont besoin de la valeur renvoyée, pas d’un simple affichage.',
      code:"def carre(n):\n    return n * n\n\nx = carre(5)\nprint(x)",
      points:[
        'Après return, l’exécution de la fonction s’arrête.',
        'Une valeur renvoyée peut être stockée, comparée ou utilisée dans un autre calcul.',
        'Remplacer return par print change le contrat de la fonction.'
      ]
    },
    {
      title:'4 · Le contrat : ce qui entre, ce qui sort, ce qui doit être vrai',
      html:'Avant de coder, écris le contrat en français : données reçues, résultat renvoyé et hypothèses nécessaires. Une <strong>précondition</strong> décrit ce qui doit être vrai avant l’appel ; une <strong>postcondition</strong> décrit la propriété du résultat.',
      code:"def premier(tab):\n    assert len(tab) > 0\n    return tab[0]",
      points:[
        'Ici la précondition est : tab doit être non vide.',
        '<code>assert</code> permet de vérifier explicitement une précondition simple.',
        'Le résultat attendu est le premier élément de la liste.'
      ]
    },
    {
      title:'5 · Tester avant de déclarer la fonction terminée',
      html:'Un bon jeu de tests ne se contente pas d’un exemple confortable. Prépare au minimum un <strong>cas nominal</strong>, un <strong>cas frontière</strong> et, si le contrat l’exige, un <strong>cas invalide</strong>. Les tests aident à préciser le problème avant même d’écrire tout le code.',
      code:'assert maximum(7, 2) == 7\nassert maximum(4, 4) == 4\n# pour une précondition : vérifier aussi le cas interdit',
      points:[
        'Nominal : situation ordinaire.',
        'Frontière : égalité, seuil, vide, première ou dernière position.',
        'Invalide : entrée qui viole explicitement la précondition.'
      ]
    },
    {
      title:'6 · Méthode P4 : contrat → signature → corps → tests',
      html:'Pour éviter la page blanche, utilise toujours le même ordre : <strong>1. reformuler le contrat, 2. écrire la signature, 3. programmer le corps avec les notions déjà connues, 4. exécuter les cas tests.</strong> Dans les premiers exercices, des commentaires t’aident encore ; progressivement, le cadre disparaît.',
      code:'# Contrat : renvoyer le plus grand de a et b\ndef maximum(a, b):\n    if a >= b:\n        return a\n    return b',
      points:[
        'N’écris pas le corps avant de savoir ce que la fonction doit renvoyer.',
        'Vérifie que tous les chemins d’exécution renvoient bien le résultat attendu.',
        'Un test vert n’explique pas ton programme : tu dois aussi pouvoir justifier sa logique.'
      ]
    }
  ];

  Object.assign(byId(p4.exercises, 'P4-E1'), {
    title:'Écrire sa première fonction complète', level:1, kind:'écrire',
    prompt:'Écris entièrement la fonction <code>maximum(a, b)</code>, sans utiliser <code>max</code>. Elle reçoit deux nombres et renvoie le plus grand. Si les deux valeurs sont égales, elle renvoie cette valeur. Cette fois, le mot <code>def</code> n’est plus fourni : commence par écrire la signature exacte <code>def maximum(a, b):</code>.',
    starter:'# 1. Écris la signature : def maximum(a, b):\n# 2. Compare a et b\n# 3. Renvoie la bonne valeur\n',
    hints:['Commence par : def maximum(a, b):', 'Dans le corps indenté, teste si a >= b.', 'Si le test est vrai, return a ; sinon return b.']
  });
  Object.assign(byId(p4.exercises, 'P4-E2'), {
    title:'Fonction complète avec parcours et retour anticipé', level:2, kind:'écrire',
    prompt:'Écris entièrement <code>indice_premier(tab, cible)</code>. La fonction reçoit une liste et une valeur cible. Elle renvoie l’indice de la première occurrence de cible ; si cible est absente, elle renvoie -1. Utilise le parcours par indices appris en P3 : <code>range(len(tab))</code>. Le <code>return</code> peut arrêter immédiatement la fonction dès la première occurrence trouvée.',
    starter:'# Écris ici toute la fonction indice_premier(tab, cible)\n',
    hints:['Écris d’abord la signature exacte.', 'Parcours i avec for i in range(len(tab)):', 'Si tab[i] == cible, return i. Le return -1 vient après la boucle.']
  });
  Object.assign(byId(p4.exercises, 'P4-E3'), {
    title:'Fonction avec précondition et tests frontières', level:3, kind:'écrire',
    prompt:'Écris entièrement <code>moyenne(tab)</code>. Précondition : <code>tab</code> doit être non vide, vérifiée avec <code>assert len(tab) > 0</code>. Sans utiliser <code>sum</code>, calcule le total avec une boucle puis renvoie <code>total / len(tab)</code>. La formule est donnée : aucune connaissance mathématique supplémentaire n’est attendue.',
    starter:'# Écris ici toute la fonction moyenne(tab)\n# Pense : précondition → accumulateur → boucle → résultat\n',
    hints:['Commence par def moyenne(tab): puis assert len(tab) > 0.', 'Initialise total = 0 puis additionne chaque valeur.', 'Termine par return total / len(tab).']
  });

  const p4x1 = byId(practiceBank, 'P4-X1');
  if (p4x1) Object.assign(p4x1, {
    title:'Score dans le domaine valide', level:1, kind:'compléter',
    prompt:'Complète <code>score_valide(score)</code>. Un score est valide s’il est compris entre 0 et 100, bornes incluses. L’objectif est de relier un contrat très court à une expression booléenne renvoyée par la fonction.',
    starter:'def score_valide(score):\n    return ____ <= score <= ____',
    tests:[
      {label:'borne basse',expr:'score_valide(0) is True'},
      {label:'borne haute',expr:'score_valide(100) is True'},
      {label:'trop petit',expr:'score_valide(-1) is False'},
      {label:'trop grand',expr:'score_valide(101) is False'}
    ],
    hints:['Les deux bornes sont 0 et 100.', 'Complète avec 0 et 100.'],
    solution:'def score_valide(score):\n    return 0 <= score <= 100',
    tags:['fonction','contrat','frontière']
  });
  const p4x2 = byId(practiceBank, 'P4-X2');
  if (p4x2) Object.assign(p4x2, {
    level:1, kind:'déboguer',
    prompt:'La fonction existe déjà, mais son contrat dit que <code>tab</code> doit être non vide. Ajoute une précondition explicite avec <code>assert</code> avant d’accéder à <code>tab[0]</code>. L’objectif n’est pas de changer le résultat normal, mais de rendre le cas interdit explicite.',
    hints:['Écris assert len(tab) > 0 avant le return.', 'Le test sur [] doit produire AssertionError.']
  });
  const p4x3 = byId(practiceBank, 'P4-X3');
  if (p4x3) Object.assign(p4x3, {
    level:2, kind:'écrire',
    prompt:'Écris entièrement <code>maximum3(a, b, c)</code> sans utiliser <code>max</code>. Les trois valeurs peuvent être égales. Une stratégie lisible consiste à mémoriser un meilleur courant <code>m</code>, initialisé avec a, puis à le comparer successivement à b et c.',
    starter:'# Écris ici toute la fonction maximum3(a, b, c)\n',
    hints:['Commence par la signature puis m = a.', 'Si b > m, remplace m par b ; fais ensuite la même chose avec c.', 'Termine par return m.']
  });
  const p4x4 = byId(practiceBank, 'P4-X4');
  if (p4x4) Object.assign(p4x4, {
    title:'Borner une valeur', level:3, kind:'transfert',
    prompt:'Écris entièrement <code>borner(x, mini, maxi)</code>. Précondition : <code>mini <= maxi</code>. Si x est plus petit que mini, renvoie mini ; s’il est plus grand que maxi, renvoie maxi ; sinon renvoie x. Cette activité réutilise conditions et contrat sans introduire de méthode de chaîne encore non étudiée.',
    starter:'# Écris ici toute la fonction borner(x, mini, maxi)\n# Commence par la précondition mini <= maxi\n',
    tests:[
      {label:'dans l’intervalle',expr:'borner(7, 0, 10) == 7'},
      {label:'sous la borne',expr:'borner(-3, 0, 10) == 0'},
      {label:'au-dessus',expr:'borner(15, 0, 10) == 10'},
      {label:'précondition invalide',expr:'borner(5, 10, 0)',raises:'AssertionError'}
    ],
    hints:['Commence par assert mini <= maxi.', 'Traite x < mini, puis x > maxi.', 'Si aucun de ces cas ne s’applique, return x.'],
    solution:'def borner(x, mini, maxi):\n    assert mini <= maxi\n    if x < mini:\n        return mini\n    if x > maxi:\n        return maxi\n    return x',
    tags:['fonction','précondition','conditions','transfert']
  });
  const p4x5 = byId(practiceBank, 'P4-X5');
  if (p4x5) Object.assign(p4x5, {
    level:2, kind:'écrire',
    prompt:'Écris entièrement <code>tarif(age)</code>. Précondition : age doit être supérieur ou égal à 0. Moins de 12 ans → 5 ; de 12 à 17 inclus → 8 ; à partir de 18 → 12. Avant de coder, repère les deux frontières 12 et 18 et prépare les cas 11/12 puis 17/18.',
    starter:'# Écris ici toute la fonction tarif(age)\n# Précondition, puis seuil 12, puis seuil 18\n',
    hints:['Commence par def tarif(age): puis assert age >= 0.', 'Si age < 12, return 5.', 'Sinon si age < 18, return 8 ; sinon return 12.']
  });
  reorderPractice(practiceBank, ['P4-X1','P4-X2','P4-X3','P4-X5','P4-X4']);

  const noviceP4 = byModule(noviceBank, 'P4');
  if (noviceP4) {
    noviceP4.goal = 'Construire une fonction complète à partir d’un contrat, puis prouver par des tests qu’elle respecte les cas attendus.';
    noviceP4.prerequisites = ['Expressions et conditions de P1/P2','Boucles et indices minimaux de P3'];
    noviceP4.vocabulary = [
      ['paramètre','Nom écrit dans la définition et utilisé localement pour recevoir une donnée.'],
      ['argument','Valeur fournie à un paramètre lors d’un appel.'],
      ['return','Instruction qui termine la fonction et renvoie une valeur au programme appelant.'],
      ['précondition','Propriété exigée sur les arguments avant l’exécution de la fonction.']
    ];
    noviceP4.harness = 'P4 marque un changement volontaire : le cadre def ... / return n’est plus systématiquement fourni. Tu apprends maintenant à construire la fonction complète avec la méthode contrat → signature → corps → tests. Les premiers exercices gardent des commentaires de guidage, puis ils disparaissent.';
    noviceP4.worked = {
      title:'Construire une fonction de A à Z',
      problem:'On veut une fonction double(n) qui renvoie le double du nombre reçu.',
      steps:[
        ['1 · Contrat','Entrée : un nombre n. Sortie : n multiplié par 2.'],
        ['2 · Signature','Écrire def double(n):'],
        ['3 · Corps et résultat','Calculer puis return n * 2.'],
        ['4 · Tests','Vérifier par exemple double(3) == 6 et double(0) == 0.']
      ],
      code:'def double(n):\n    return n * 2\n\nassert double(3) == 6\nassert double(0) == 0'
    };
  }

  const primmP4 = byModule(primmBank, 'P4');
  if (primmP4) {
    primmP4.predict = 'Sans exécuter : que renvoie badge(120) ? Que se passe-t-il pour badge(-1) ? Dans l’appel badge(120), distingue le paramètre de la définition et l’argument fourni.';
    primmP4.investigate = ['Quelle précondition est exprimée par assert ?','Quelle différence vois-tu entre return et le print final ?','Quel cas frontière faut-il tester autour de 100 ?','Pourquoi points est-il un paramètre alors que 120 est un argument ?'];
    primmP4.modify = 'Ajoute un niveau argent à partir de 50 points, puis écris trois tests : 49, 50 et 100.';
    primmP4.make = "À partir d’une page vide, écris entièrement la fonction est_valide(score) qui renvoie True si 0 <= score <= 100, puis ajoute trois assert pour -1, 0 et 100.";
  }
}
