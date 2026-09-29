/* PYTHON//FORGE V1.10 — Student Zero Gate, Première P5 + P6
   Human-reviewed transition from immutable text to mutable indexed collections.
   The goal is to build a correct mental model before adding compact syntax.
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

export function applyStudentZeroP5P6(modules, practiceBank, primmBank, noviceBank) {
  const p5 = modules.find(module => module.id === 'P5');
  const p6 = modules.find(module => module.id === 'P6');
  if (!p5 || !p6) return;

  /* ------------------------------------------------------------------
     P5 — strings: indexing is readable, mutation is impossible.
     ------------------------------------------------------------------ */
  p5.duration = '75 min';
  p5.summary = 'Lire une chaîne comme une séquence de caractères, choisir entre parcours direct et indices, puis construire un nouveau texte sans croire que la chaîne d’origine est modifiable.';
  p5.objectives = [
    'Relier longueur, indices et caractères sans dépasser les bornes',
    'Choisir entre parcours direct et parcours par indices',
    'Expliquer pourquoi une chaîne est immuable',
    'Construire une nouvelle chaîne sans slice ni méthode magique indispensable'
  ];
  p5.lessons = [
    {
      title:'1 · Une chaîne est une séquence de caractères indexée à partir de 0',
      html:'Dans <code>"python"</code>, chaque caractère possède une position. Le premier indice vaut 0 et le dernier indice valide vaut <code>len(texte) - 1</code>. Une chaîne vide a une longueur 0 et ne possède aucun indice valide. Avant d’utiliser <code>texte[i]</code>, demande-toi toujours si l’indice peut réellement exister.',
      code:"texte = 'python'\nprint(len(texte))      # 6\nprint(texte[0])        # p\nprint(texte[len(texte)-1])  # n",
      points:[
        'len(texte) donne le nombre de caractères, pas le dernier indice.',
        'Pour une chaîne non vide, le dernier indice est len(texte) - 1.',
        'texte[len(texte)] est hors de la chaîne et provoque IndexError.'
      ]
    },
    {
      title:'2 · Une chaîne se lit par indice, mais ne se modifie pas par indice',
      html:'Une chaîne Python est <strong>immuable</strong>. On peut lire <code>texte[0]</code>, mais une instruction comme <code>texte[0] = "N"</code> est interdite. Pour transformer un texte, on construit donc une <strong>nouvelle chaîne</strong>. Le nom de variable peut ensuite désigner cette nouvelle valeur, mais l’ancienne chaîne n’a pas été modifiée caractère par caractère.',
      code:"texte = 'nsi-python'\nresultat = ''\nfor c in texte:\n    if c != '-':\n        resultat += c\nprint(texte)      # nsi-python\nprint(resultat)   # nsipython",
      points:[
        'resultat += c construit progressivement une nouvelle chaîne.',
        'Le texte d’origine reste inchangé.',
        'Cette idée préparera le contraste avec les listes, qui sont modifiables en P6.'
      ]
    },
    {
      title:'3 · Parcourir directement ou utiliser les indices',
      html:'Si tu veux seulement examiner chaque caractère, préfère <code>for c in texte</code>. Utilise les indices lorsque la <strong>position</strong>, le voisin ou le caractère symétrique est nécessaire. Ce choix rend le programme plus simple et limite les erreurs de bord.',
      code:"mot = 'radar'\nfor c in mot:\n    print(c)\n\nfor i in range(len(mot) // 2):\n    print(i, mot[i], mot[len(mot)-1-i])",
      points:[
        'Parcours direct : on a besoin du caractère.',
        'Parcours par indice : on a besoin de sa position ou d’un autre caractère lié à cette position.',
        'Aucune slice n’est nécessaire pour réussir P5.'
      ]
    },
    {
      title:'4 · Construire un texte : partir de "" puis ajouter ce que l’on garde',
      html:'Beaucoup de traitements de chaînes suivent le même schéma : préparer une chaîne vide, parcourir le texte, décider si un caractère doit être gardé ou transformé, puis l’ajouter au nouveau résultat. Ce schéma est plus important à comprendre qu’une méthode toute faite.',
      code:"texte = 'a b c'\nresultat = ''\nfor c in texte:\n    if c != ' ':\n        resultat += c\nprint(resultat)",
      points:[
        'Initialise le résultat avant la boucle.',
        'Décide dans la boucle ce qui doit être ajouté.',
        'Renvoie le résultat après la boucle, pas à l’intérieur sauf si le problème demande un arrêt immédiat.'
      ]
    },
    {
      title:'5 · Méthodes de chaînes : un outil local, pas un prérequis caché',
      html:'Certaines méthodes créent une nouvelle chaîne. Par exemple <code>mot.upper()</code> renvoie une version en majuscules ; elle ne modifie pas <code>mot</code>. Dans ce module, lorsqu’une méthode particulière est utile à un exercice, son rôle est rappelé dans l’énoncé : tu n’as pas à deviner une méthode inconnue.',
      code:"mot = 'Ada'\nmaj = mot.upper()\nprint(mot)  # Ada\nprint(maj)  # ADA",
      points:[
        'upper() renvoie une nouvelle chaîne.',
        'Une méthode utilisée pour la première fois doit être explicitée dans l’activité.',
        'Les solutions cœur restent réalisables avec indexation, boucles, comparaisons et concaténation.'
      ]
    }
  ];

  Object.assign(byId(p5.exercises, 'P5-E1'), {
    title:'Compter une lettre dans un texte', level:1, kind:'écrire',
    prompt:'Écris entièrement <code>compte_lettre(texte, lettre)</code>. La fonction reçoit une chaîne <code>texte</code> et une chaîne <code>lettre</code> contenant un seul caractère. Elle doit parcourir <code>texte</code> de gauche à droite et renvoyer le nombre de caractères exactement égaux à <code>lettre</code>, sans utiliser <code>count</code>. Une chaîne vide doit produire 0.',
    starter:'def compte_lettre(texte, lettre):\n    n = 0\n    # Parcours texte caractère par caractère\n    pass',
    hints:['Le compteur n commence à 0.', 'Utilise for c in texte puis compare c == lettre.', 'Après la boucle, renvoie n.']
  });
  Object.assign(byId(p5.exercises, 'P5-E2'), {
    title:'Construire une chaîne sans espaces', level:2, kind:'compléter',
    prompt:'Complète <code>sans_espaces(texte)</code> sans utiliser <code>replace</code>. La fonction doit construire et renvoyer une nouvelle chaîne qui contient tous les caractères de <code>texte</code> sauf le caractère espace ordinaire <code>" "</code>, dans le même ordre. Le texte reçu ne doit pas être modifié.',
    starter:'def sans_espaces(texte):\n    resultat = ""\n    for c in texte:\n        # Ajoute c seulement si ce n’est pas un espace\n        pass\n    return resultat',
    hints:['Teste c != " ".', 'Si le test est vrai, ajoute c avec resultat += c.', 'La chaîne vide doit naturellement renvoyer "".']
  });
  Object.assign(byId(p5.exercises, 'P5-E3'), {
    title:'Comparer des caractères symétriques', level:3, kind:'compléter',
    prompt:'Complète <code>est_palindrome(texte)</code> sans slice. Un palindrome se lit de la même manière de gauche à droite et de droite à gauche. Pour chaque indice <code>i</code> de la première moitié, compare <code>texte[i]</code> au caractère symétrique <code>texte[len(texte)-1-i]</code>. Renvoie immédiatement <code>False</code> dès qu’une paire diffère ; si aucune paire ne diffère, renvoie <code>True</code>. La chaîne vide est considérée comme un palindrome.',
    starter:'def est_palindrome(texte):\n    for i in range(len(texte) // 2):\n        # Compare les deux caractères symétriques\n        pass\n    return True',
    hints:['Le caractère symétrique de texte[i] est texte[len(texte)-1-i].', 'Si les deux caractères sont différents : return False.', 'Si la boucle se termine sans différence, return True.']
  });

  assignById(practiceBank, 'P5-X1', {
    level:1, kind:'transfert',
    prompt:'Écris <code>initiales(prenom, nom)</code>. Les deux chaînes sont garanties non vides. Lis leur premier caractère avec l’indice 0. La méthode <code>upper()</code>, fournie ici comme outil, renvoie une nouvelle chaîne en majuscules. Le résultat doit contenir les deux initiales majuscules séparées par un point : <code>initiales("Ada", "Lovelace")</code> renvoie <code>"A.L"</code>.',
    hints:['Le premier caractère d’une chaîne non vide est à l’indice 0.', 'prenom[0].upper() renvoie l’initiale en majuscule.', 'Concatène la première initiale, ".", puis la seconde initiale.']
  });
  assignById(practiceBank, 'P5-X2', {
    level:1, kind:'compléter',
    prompt:'Complète la condition de la boucle pour compter le nombre de caractères <code>#</code> dans <code>message</code>. Le compteur <code>n</code> et le parcours sont déjà fournis. Une chaîne vide ou un message sans # doit produire 0.',
    hints:['La variable c contient le caractère courant.', 'La condition cherchée est c == "#".']
  });
  assignById(practiceBank, 'P5-X3', {
    level:2, kind:'déboguer',
    prompt:'La fonction doit renvoyer les caractères de <code>texte</code> dans l’ordre inverse, sans slice. Le programme fourni parcourt bien des indices mais relit actuellement les caractères dans l’ordre normal. Corrige uniquement l’indice utilisé pour lire le caractère symétrique depuis la fin. Pour <code>"abc"</code>, le résultat doit être <code>"cba"</code>.',
    hints:['Pour i = 0, il faut lire le dernier caractère.', 'Le dernier indice est len(texte)-1.', 'Utilise texte[len(texte)-1-i].']
  });
  assignById(practiceBank, 'P5-X4', {
    title:'Masquer un texte caractère par caractère', level:2, kind:'écrire',
    prompt:'Écris <code>masque(texte, caractere)</code>. La fonction reçoit le texte à masquer et un caractère de remplacement explicite. Elle doit renvoyer une nouvelle chaîne de même longueur contenant uniquement <code>caractere</code>. Aucun paramètre par défaut n’est utilisé afin de rester centré sur le parcours et la construction de chaîne.',
    starter:"def masque(texte, caractere):\n    resultat = ''\n    # Ajoute caractere une fois par caractère de texte\n    pass",
    tests:[
      {label:'secret avec *',expr:"masque('secret','*') == '******'"},
      {label:'autre caractère',expr:"masque('abc','#') == '###'"},
      {label:'vide',expr:"masque('','*') == ''"}
    ],
    hints:['Parcours texte uniquement pour connaître le nombre de caractères.', 'À chaque tour, ajoute caractere à resultat.', 'Renvoie resultat après la boucle.'],
    solution:"def masque(texte, caractere):\n    resultat = ''\n    for _ in texte:\n        resultat += caractere\n    return resultat",
    tags:['chaînes','construction','sécurité']
  });
  assignById(practiceBank, 'P5-X5', {
    level:3, kind:'transfert',
    prompt:'Écris <code>doublon_voisin(texte)</code> qui renvoie <code>True</code> si deux caractères consécutifs sont identiques, sinon <code>False</code>. Comme chaque caractère doit être comparé au précédent, commence les indices à 1 avec <code>range(1, len(texte))</code>. Les chaînes de longueur 0 ou 1 doivent renvoyer False.',
    hints:['À l’indice i, le caractère précédent est texte[i-1].', 'Renvoie True dès que texte[i] == texte[i-1].', 'Si toute la boucle se termine, renvoie False.']
  });
  reorderPractice(practiceBank, ['P5-X2','P5-X1','P5-X4','P5-X3','P5-X5']);

  const noviceP5 = byModule(noviceBank, 'P5');
  if (noviceP5) {
    noviceP5.goal = 'Lire et transformer du texte sans confondre « accéder à un caractère » et « modifier la chaîne ».';
    noviceP5.prerequisites = ['Fonctions de P4','Boucles for de P3','Aucune manipulation de listes avancée'];
    noviceP5.vocabulary = [
      ['indice','Position d’un caractère ; le premier indice est 0.'],
      ['immuable','Objet que l’on ne peut pas modifier en place caractère par caractère.'],
      ['concaténation','Construction d’une nouvelle chaîne en réunissant des chaînes.'],
      ['encodage','Convention qui associe des caractères à des représentations numériques.']
    ];
  }

  const primmP5 = byModule(primmBank, 'P5');
  if (primmP5) {
    primmP5.predict = 'Sans exécuter, trace chaque caractère de "nsi-python" et la valeur de compteur après son passage. Donne ensuite la valeur affichée.';
    primmP5.investigate = ['La boucle fournit-elle des indices ou des caractères ?','La chaîne texte change-t-elle à un moment ?','Pourquoi resultat += c construirait-il une nouvelle chaîne au lieu de modifier texte ?'];
    primmP5.modify = 'À partir du même parcours, construis une nouvelle chaîne qui conserve tous les caractères sauf les tirets. Ne modifie pas texte et n’utilise pas replace.';
    primmP5.make = 'Écris une fonction qui reçoit une chaîne et renvoie une nouvelle chaîne en supprimant un caractère précis donné en paramètre. Utilise seulement une boucle, une condition et la concaténation.';
  }

  /* ------------------------------------------------------------------
     P6 — lists: make mutation, aliasing and copying visible before compact syntax.
     ------------------------------------------------------------------ */
  p6.duration = '100 min';
  p6.summary = 'Passer d’une séquence immuable à une collection modifiable : lire et modifier par indice, distinguer alias et copie, puis seulement compacter certains parcours avec une compréhension.';
  p6.objectives = [
    'Expliquer la différence essentielle entre chaîne et liste',
    'Lire et modifier une liste par indice sans dépasser ses bornes',
    'Prédire les effets d’un alias et créer une copie indépendante',
    'Passer d’une boucle avec append à une compréhension simple',
    'Lire une liste de listes avec deux indices'
  ];
  p6.lessons = [
    {
      title:'1 · Transition P5 → P6 : même idée d’indice, comportement différent',
      html:'Chaînes et listes sont toutes deux des séquences indexées à partir de 0. La différence cruciale est la <strong>mutabilité</strong> : une chaîne ne se modifie pas par indice, alors qu’une liste le peut. Cette différence explique une grande partie des bugs rencontrés avec les listes.',
      code:"mot = 'nsi'\nnotes = [12, 9, 16]\nprint(mot[1])\nprint(notes[1])\nnotes[1] = 10\nprint(notes)\n# mot[1] = 'S' serait interdit",
      points:[
        'Même règle d’indice : 0 jusqu’à len(sequence)-1.',
        'Liste : tab[i] peut être lu ET remplacé.',
        'Chaîne : texte[i] peut être lu mais pas remplacé.'
      ]
    },
    {
      title:'2 · Modifier une liste : remplacement et append',
      html:'Une liste est modifiable en place. <code>tab[i] = valeur</code> remplace un élément existant ; <code>tab.append(valeur)</code> ajoute un nouvel élément à la fin. Ces opérations modifient l’objet liste lui-même.',
      code:"inventaire = ['clé', 'carte']\ninventaire[0] = 'badge'\ninventaire.append('lampe')\nprint(inventaire)",
      points:[
        'Un remplacement exige un indice déjà valide.',
        'append ajoute un élément ; il ne renvoie pas une nouvelle liste à utiliser.',
        'Après une mutation, tous les noms qui désignent cette même liste observent le changement.'
      ]
    },
    {
      title:'3 · Alias : deux noms peuvent désigner la même liste',
      html:'L’instruction <code>b = a</code> ne copie pas la liste. Elle donne un second nom au <strong>même objet</strong>. Si le programme modifie la liste via <code>b</code>, le changement est donc également visible via <code>a</code>. Avant de corriger un bug d’alias, dessine mentalement les noms comme des flèches vers les objets.',
      code:"a = [1, 2]\nb = a\nb.append(3)\nprint(a)  # [1, 2, 3]\nprint(b)  # [1, 2, 3]",
      points:[
        'Il n’existe ici qu’un seul objet liste.',
        'a et b sont deux noms pour cet objet.',
        'Le problème vient de la mutation partagée, pas de append lui-même.'
      ]
    },
    {
      title:'4 · Copier : créer une nouvelle liste avant de la modifier',
      html:'Lorsque tu veux préserver la liste reçue, crée une nouvelle liste avec <code>list(source)</code>, puis modifie cette copie. Pour les listes simples étudiées ici, cela suffit. Avec des listes imbriquées, cette copie ne duplique pas récursivement les sous-listes ; ce point sera signalé lorsqu’il devient pertinent.',
      code:"source = ['clé', 'carte']\ncopie = list(source)\ncopie.append('lampe')\nprint(source)\nprint(copie)",
      points:[
        'copie = source crée un alias.',
        'copie = list(source) crée une nouvelle liste extérieure.',
        'Décide explicitement si ta fonction doit modifier l’entrée ou renvoyer un nouveau résultat.'
      ]
    },
    {
      title:'5 · Compréhension : compacter un schéma déjà compris',
      html:'Une compréhension de liste ne doit pas être apprise comme une formule mystérieuse. Elle compacte un schéma que tu sais déjà écrire avec une boucle et <code>append</code>. Commence par la version longue, puis lis la compréhension de gauche à droite.',
      code:"carres = []\nfor i in range(5):\n    carres.append(i * i)\n\nmemes_carres = [i * i for i in range(5)]",
      points:[
        'Expression produite : i * i.',
        'Parcours : for i in range(5).',
        'La compréhension construit une nouvelle liste ; elle ne modifie pas une liste existante.'
      ]
    },
    {
      title:'6 · Tableau 2D : une liste dont chaque élément est lui-même une liste',
      html:'Dans une grille <code>m</code>, <code>m[i]</code> désigne une ligne et <code>m[i][j]</code> un élément de cette ligne. Pour débuter, lis toujours les deux indices en deux temps : choisir la ligne, puis choisir la colonne dans cette ligne.',
      code:"m = [[1, 2, 3],\n     [4, 5, 6]]\nprint(m[1])     # [4, 5, 6]\nprint(m[1][2])  # 6",
      points:[
        'Premier indice : ligne.',
        'Second indice : colonne dans la ligne choisie.',
        'Les exercices supposent la forme annoncée ; ne devine pas la taille sans lire le contrat.'
      ]
    }
  ];

  Object.assign(byId(p6.exercises, 'P6-E1'), {
    title:'Construire les carrés par compréhension', level:1, kind:'compléter',
    prompt:'Complète <code>carres(n)</code> pour construire une nouvelle liste contenant <code>0*0, 1*1, ..., (n-1)*(n-1)</code>. Utilise une compréhension simple, après avoir identifié son équivalent avec une boucle et <code>append</code>. Si n vaut 0, <code>range(0)</code> ne fournit aucune valeur et le résultat est la liste vide.',
    starter:'def carres(n):\n    return [__________ for i in range(n)]',
    hints:['La partie for i in range(n) fournit successivement 0, 1, ..., n-1.', 'Pour chaque i, la valeur produite est i * i.', 'La ligne complète est return [i * i for i in range(n)].']
  });
  Object.assign(byId(p6.exercises, 'P6-E2'), {
    title:'Mémoriser l’indice du maximum', level:2, kind:'écrire',
    prompt:'Écris <code>indice_max(tab)</code> pour une liste non vide. La fonction doit renvoyer l’indice de la première occurrence de la plus grande valeur, sans utiliser <code>max</code>. Commence avec <code>imax = 0</code>, puis compare chaque nouvelle valeur à <code>tab[imax]</code>. En cas d’égalité, ne change pas imax afin de conserver le premier maximum.',
    starter:'def indice_max(tab):\n    assert len(tab) > 0\n    imax = 0\n    # Parcours les indices suivants puis mets imax à jour si nécessaire\n    pass',
    hints:['Commence à i = 1, car l’indice 0 sert déjà de meilleur courant.', 'Teste tab[i] > tab[imax], pas >= si tu veux garder le premier maximum.', 'Renvoie imax après la boucle.']
  });
  Object.assign(byId(p6.exercises, 'P6-E3'), {
    title:'Lire la diagonale d’un tableau 2D', level:3, kind:'compléter',
    prompt:'Complète <code>diagonale(m)</code>. On garantit que <code>m</code> est une matrice carrée représentée par une liste de listes. Pour chaque indice de ligne <code>i</code>, l’élément de la diagonale principale est <code>m[i][i]</code>. Construis explicitement une nouvelle liste avec <code>append</code> ; l’objectif est ici de comprendre les deux indices, pas de compacter le code.',
    starter:'def diagonale(m):\n    resultat = []\n    for i in range(len(m)):\n        # Ajoute l’élément ligne i, colonne i\n        pass\n    return resultat',
    hints:['m[i] désigne la ligne i.', 'm[i][i] désigne dans cette ligne la colonne i.', 'Ajoute m[i][i] à resultat avec append.'],
    solution:'def diagonale(m):\n    resultat = []\n    for i in range(len(m)):\n        resultat.append(m[i][i])\n    return resultat'
  });

  assignById(practiceBank, 'P6-X1', {
    level:1, kind:'écrire',
    prompt:'Écris <code>objets_longs(objets)</code> qui construit une nouvelle liste contenant uniquement les chaînes dont la longueur est au moins 5, dans le même ordre que dans <code>objets</code>. Ne modifie pas la liste reçue : pars de <code>resultat = []</code>, parcours les objets puis utilise <code>append</code> quand <code>len(objet) >= 5</code>.',
    hints:['Le résultat est une nouvelle liste vide au départ.', 'Teste len(objet) >= 5.', 'Ajoute seulement les objets acceptés avec resultat.append(objet).']
  });
  assignById(practiceBank, 'P6-X2', {
    title:'Remplacer les valeurs négatives sans compréhension complexe', level:2, kind:'écrire',
    prompt:'Écris <code>normalise_pixels(valeurs)</code> qui renvoie une nouvelle liste de même longueur. Pour chaque valeur <code>x</code>, ajoute 0 si x est négative, sinon ajoute x. Ne modifie pas <code>valeurs</code>. Utilise volontairement une boucle explicite et <code>append</code> : l’objectif est de raisonner sur la construction d’une nouvelle liste avant toute écriture compacte.',
    starter:'def normalise_pixels(valeurs):\n    resultat = []\n    for x in valeurs:\n        # Ajoute 0 ou x selon le signe\n        pass\n    return resultat',
    tests:[
      {label:'normalisation',expr:'normalise_pixels([-2,5,-1,8]) == [0,5,0,8]'},
      {label:'vide',expr:'normalise_pixels([]) == []'},
      {label:'zéro conservé',expr:'normalise_pixels([0,-3]) == [0,0]'}
    ],
    hints:['Si x < 0, ajoute 0.', 'Sinon, ajoute x.', 'Dans les deux branches, utilise resultat.append(...).'],
    solution:'def normalise_pixels(valeurs):\n    resultat = []\n    for x in valeurs:\n        if x < 0:\n            resultat.append(0)\n        else:\n            resultat.append(x)\n    return resultat',
    tags:['liste','construction','image']
  });
  assignById(practiceBank, 'P6-X3', {
    level:1, kind:'déboguer',
    prompt:'La fonction veut renvoyer un inventaire enrichi sans modifier la liste <code>inventaire</code> reçue. Le bug vient de <code>copie = inventaire</code> : cette ligne crée un alias, pas une copie. Corrige uniquement cette ligne avec <code>copie = list(inventaire)</code>, puis vérifie à la fois le résultat et la préservation de l’entrée.',
    hints:['Dessine deux noms qui pointent actuellement vers une seule liste.', 'list(inventaire) crée une nouvelle liste extérieure.', 'Après la correction, append modifie copie mais pas inventaire.']
  });
  assignById(practiceBank, 'P6-X4', {
    level:3, kind:'transfert',
    prompt:'Une grille non vide est une liste de lignes, chaque ligne étant une liste de 0 et de 1. Écris <code>indice_ligne_max(grille)</code> qui renvoie l’indice de la première ligne contenant le plus de 1, sans utiliser <code>sum</code> ni <code>max</code>. Pour chaque ligne, compte ses 1 avec une boucle interne, puis compare ce score au meilleur score mémorisé.',
    hints:['Boucle externe : choisir une ligne par son indice i.', 'Boucle interne : compter les x égaux à 1 dans grille[i].', 'Utilise > et non >= pour conserver la première ligne en cas d’égalité.']
  });
  assignById(practiceBank, 'P6-X5', {
    level:2, kind:'transfert',
    prompt:'Une position est une liste <code>[ligne, colonne]</code>. Écris <code>deplace(position, direction)</code> qui renvoie une <strong>nouvelle</strong> position après un déplacement N, S, E ou O, sans modifier la liste reçue. Commence donc par <code>p = list(position)</code>. N/S modifient p[0] ; E/O modifient p[1].',
    hints:['Copie d’abord avec p = list(position).', 'N : p[0] -= 1 ; S : p[0] += 1.', 'E : p[1] += 1 ; O : p[1] -= 1.']
  });
  reorderPractice(practiceBank, ['P6-X1','P6-X3','P6-X2','P6-X5','P6-X4']);

  const noviceP6 = byModule(noviceBank, 'P6');
  if (noviceP6) {
    noviceP6.goal = 'Manipuler une liste sans confondre lecture, mutation, alias et copie.';
    noviceP6.prerequisites = ['Indices sur les chaînes vus en P5','Boucles et fonctions','Aucune slice nécessaire'];
    noviceP6.vocabulary = [
      ['mutable','Objet dont le contenu peut être modifié en place.'],
      ['alias','Deux noms qui désignent exactement le même objet liste.'],
      ['copie','Nouvel objet liste créé pour pouvoir le modifier indépendamment.'],
      ['compréhension','Écriture compacte d’un schéma de construction de liste déjà compris avec une boucle.']
    ];
  }

  const primmP6 = byModule(primmBank, 'P6');
  if (primmP6) {
    primmP6.predict = 'Sans exécuter, dessine un seul objet liste puis deux flèches nommées inventaire et copie vers cet objet. Prédis ensuite exactement la liste affichée après append.';
    primmP6.investigate = ['Combien d’objets liste existent après copie = inventaire ?','Pourquoi une mutation effectuée via copie est-elle visible via inventaire ?','Quelle différence ferait copie = list(inventaire) ?'];
    primmP6.modify = 'Remplace uniquement la création de copie afin que append ne modifie plus inventaire. Affiche ensuite les deux listes pour prouver qu’elles évoluent indépendamment.';
    primmP6.make = 'Écris une fonction ajoute_sans_modifier(tab, valeur) qui crée une copie avec list(tab), ajoute valeur à cette copie puis la renvoie. Ajoute un test qui vérifie aussi que tab reste inchangée.';
  }
}
