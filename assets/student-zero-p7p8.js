/* PYTHON//FORGE V1.11 — Student Zero Gate, Première P7 + P8
   Human-reviewed transition from tuples/dictionaries to tabular data and CSV.
   The goal is to make the data model explicit before compact syntax or file mechanics.
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

export function applyStudentZeroP7P8(modules, practiceBank, primmBank, noviceBank) {
  const p7 = modules.find(module => module.id === 'P7');
  const p8 = modules.find(module => module.id === 'P8');
  if (!p7 || !p8) return;

  /* ------------------------------------------------------------------
     P7 — choose the structure before manipulating it.
     ------------------------------------------------------------------ */
  p7.duration = '90 min';
  p7.summary = 'Choisir entre liste, tuple et dictionnaire, puis raisonner explicitement en termes de position, clé, valeur et effet de bord.';
  p7.objectives = [
    'Choisir une structure selon la manière dont on veut retrouver les données',
    'Construire, lire et mettre à jour une entrée de dictionnaire',
    'Distinguer clé, valeur et indice',
    'Parcourir un dictionnaire avec keys(), values() et items() sans prérequis caché'
  ];
  p7.lessons = [
    {
      title:'1 · Liste, tuple, dictionnaire : trois questions différentes',
      html:'Une <strong>liste</strong> convient à une collection ordonnée que l’on parcourt et que l’on peut modifier. Un <strong>tuple</strong> regroupe quelques valeurs ordonnées dont les positions ont un sens stable ; le tuple est immuable. Un <strong>dictionnaire</strong> associe des <strong>clés</strong> à des valeurs lorsque l’on veut retrouver une information par un nom ou un identifiant plutôt que par sa position.',
      code:"position = [3, 5]\nbornes = (2, 9)\nprofil = {'nom':'Ada', 'niveau':3}\nprint(bornes[0])\nprint(profil['nom'])",
      points:[
        'Liste ou tuple : on retrouve une valeur par un indice numérique.',
        'Dictionnaire : on retrouve une valeur par une clé.',
        'Avant de coder, demande-toi comment l’information devra être retrouvée.'
      ]
    },
    {
      title:'2 · Un dictionnaire associe une clé unique à une valeur',
      html:'Dans <code>profil["niveau"]</code>, <code>"niveau"</code> est une clé, pas un indice. Affecter <code>profil["niveau"] = 4</code> remplace la valeur associée à cette clé ; affecter une clé absente crée une nouvelle entrée. Une même clé ne peut pas désigner simultanément deux valeurs différentes.',
      code:"profil = {'nom':'Ada', 'niveau':3}\nprofil['niveau'] = 4      # mise à jour\nprofil['badge'] = 'bronze' # nouvelle entrée\nprint(profil['nom'], profil['niveau'])",
      points:[
        'Une clé n’est pas un indice de position.',
        'd[cle] lit ou écrit la valeur associée à cle.',
        'Accéder avec d[cle] à une clé absente provoque KeyError.'
      ]
    },
    {
      title:'3 · Tester une clé avant de la lire',
      html:'L’expression <code>cle in d</code> teste si <strong>la clé</strong> est présente dans le dictionnaire. C’est le bon réflexe lorsqu’une entrée peut ne pas encore exister, par exemple pour construire un dictionnaire de fréquences.',
      code:"frequences = {}\nmot = 'python'\nif mot not in frequences:\n    frequences[mot] = 0\nfrequences[mot] += 1",
      points:[
        '<code>cle in d</code> teste les clés, pas les valeurs.',
        'On peut initialiser une nouvelle entrée avant de l’incrémenter.',
        'Ce schéma sera réutilisé pour compter des catégories ou des occurrences.'
      ]
    },
    {
      title:'4 · Parcourir keys(), values() ou items()',
      html:'Un dictionnaire peut être parcouru de plusieurs façons. <code>d.keys()</code> fournit les clés, <code>d.values()</code> les valeurs et <code>d.items()</code> fournit des paires <code>(clé, valeur)</code>. Lorsque les deux informations sont utiles, <code>items()</code> évite de retrouver ensuite la valeur par une seconde écriture.',
      code:"notes = {'Ada':17, 'Alan':14}\nfor nom, note in notes.items():\n    print(nom, note)",
      points:[
        'for cle in d parcourt déjà les clés.',
        'items() fournit à chaque tour un couple clé/valeur que l’on peut décomposer en deux noms.',
        'Ne confonds pas la clé du dictionnaire avec la position d’un élément dans une liste.'
      ]
    },
    {
      title:'5 · Mutabilité : annoncer clairement si une fonction modifie le dictionnaire reçu',
      html:'Comme une liste, un dictionnaire Python est mutable. Une fonction peut donc modifier le dictionnaire qu’elle reçoit. Ce n’est pas une erreur si le contrat l’annonce clairement. Si l’on veut préserver l’original, on peut créer une copie indépendante avec <code>dict(source)</code>, exactement comme <code>list(source)</code> en P6.',
      code:"def ajoute_badge(profil):\n    copie = dict(profil)\n    copie['badge'] = 'python'\n    return copie",
      points:[
        'Modifier une entrée produit un effet de bord sur l’objet dictionnaire.',
        'Le contrat doit dire si cet effet est voulu.',
        'dict(source) crée un nouveau dictionnaire pour les cas simples étudiés ici.'
      ]
    },
    {
      title:'6 · Préparer P8 : une ligne de données peut être un dictionnaire',
      html:'Un dictionnaire dont les clés nomment des champs est une représentation naturelle d’une ligne de données : <code>{"nom":"Ada", "note":17}</code>. En P8, plusieurs lignes partageant les mêmes noms de champs seront regroupées dans une liste pour former une table.',
      code:"ligne = {'nom':'Ada', 'note':17, 'groupe':'A'}\nprint(ligne['note'])",
      points:[
        'Les clés jouent le rôle de noms de champs ou descripteurs.',
        'La valeur d’un champ conserve son type Python.',
        'P8 ajoutera une collection de lignes et la question du passage depuis un fichier CSV.'
      ]
    }
  ];

  Object.assign(byId(p7.exercises, 'P7-E1'), {
    title:'Construire et décomposer un tuple', level:1, kind:'écrire',
    prompt:'Écris entièrement <code>bornes(a, b)</code>. La fonction doit renvoyer un tuple de deux valeurs <code>(plus_petit, plus_grand)</code>, sans utiliser <code>min</code> ni <code>max</code>. Si les deux valeurs sont égales, le tuple contient deux fois cette valeur. Le but est de manipuler un petit résultat ordonné dont les deux positions ont un sens précis.',
    starter:'def bornes(a, b):\n    # Compare a et b puis renvoie un tuple de deux valeurs\n    pass',
    hints:['Si a <= b, le bon résultat est (a, b).', 'Sinon, renvoie (b, a).', 'Les parenthèses rendent visible le tuple renvoyé.']
  });
  Object.assign(byId(p7.exercises, 'P7-E2'), {
    title:'Construire un dictionnaire de fréquences', level:2, kind:'écrire',
    prompt:'Écris <code>frequences(tab)</code>. Pour chaque valeur de la liste <code>tab</code>, le dictionnaire résultat doit associer cette valeur au nombre de fois où elle apparaît. Commence avec <code>{}</code>. Si la valeur courante n’est pas encore une clé, crée l’entrée avec 0, puis incrémente-la. La liste vide doit produire <code>{}</code>.',
    starter:'def frequences(tab):\n    d = {}\n    for valeur in tab:\n        # Crée éventuellement la clé puis incrémente sa valeur\n        pass\n    return d',
    hints:['Teste valeur not in d.', 'Si elle est absente : d[valeur] = 0.', 'Ensuite seulement : d[valeur] += 1.']
  });
  Object.assign(byId(p7.exercises, 'P7-E3'), {
    title:'Parcourir des couples clé / valeur', level:3, kind:'compléter',
    prompt:'Complète <code>meilleur(notes)</code>. <code>notes</code> est un dictionnaire non vide associant chaque prénom à une note. Parcours les couples avec <code>notes.items()</code> et renvoie le prénom associé à la plus grande note. Le booléen <code>premier</code> permet d’initialiser le meilleur candidat au premier couple rencontré, sans supposer une valeur minimale particulière pour les notes.',
    starter:"def meilleur(notes):\n    assert len(notes) > 0\n    premier = True\n    meilleur_nom = ''\n    meilleure_note = 0\n    for nom, note in notes.items():\n        # Mets à jour lors du premier tour ou si note est meilleure\n        pass\n    return meilleur_nom",
    solution:"def meilleur(notes):\n    assert len(notes) > 0\n    premier = True\n    meilleur_nom = ''\n    meilleure_note = 0\n    for nom, note in notes.items():\n        if premier or note > meilleure_note:\n            meilleur_nom = nom\n            meilleure_note = note\n            premier = False\n    return meilleur_nom",
    hints:['Au premier tour, il faut obligatoirement mémoriser le couple courant.', 'Utilise if premier or note > meilleure_note.', 'Après la première mémorisation, affecte premier = False.']
  });

  assignById(practiceBank, 'P7-X1', {
    level:1, kind:'compléter',
    prompt:'Complète uniquement les deux valeurs du dictionnaire renvoyé par <code>profil(nom, niveau)</code>. Les chaînes <code>"nom"</code> et <code>"niveau"</code> sont les clés ; les paramètres <code>nom</code> et <code>niveau</code> sont les valeurs à leur associer.',
    hints:['À gauche des deux-points se trouvent les clés.', 'À droite des deux-points place les paramètres nom puis niveau.']
  });
  assignById(practiceBank, 'P7-X3', {
    title:'Mettre à jour un score — effet de bord annoncé', level:2, kind:'déboguer',
    prompt:'La fonction <code>ajoute_score(scores, joueur, points)</code> doit <strong>modifier le dictionnaire scores reçu</strong> puis le renvoyer. Si <code>joueur</code> n’est pas encore une clé, crée d’abord son score à 0. Ensuite ajoute <code>points</code>. Ici l’effet de bord est volontaire et fait partie du contrat.',
    tests:[
      {label:'joueur existant',expr:"ajoute_score({'Ada':10},'Ada',5) == {'Ada':15}"},
      {label:'nouveau joueur',expr:"ajoute_score({},'Linus',3) == {'Linus':3}"},
      {label:'le dictionnaire reçu est bien modifié',expr:"(lambda d: (ajoute_score(d,'Ada',2), d)[1])({'Ada':5}) == {'Ada':7}"}
    ],
    hints:['Teste joueur not in scores.', 'Si la clé est absente, crée scores[joueur] = 0.', 'Puis exécute scores[joueur] += points.']
  });
  assignById(practiceBank, 'P7-X4', {
    level:2, kind:'écrire',
    prompt:'Écris <code>inverse(annuaire)</code>. Le dictionnaire reçu associe un identifiant à un pseudo et les pseudos sont garantis uniques. Crée un nouveau dictionnaire ; parcours <code>annuaire.items()</code> pour obtenir à la fois identifiant et pseudo, puis utilise le pseudo comme nouvelle clé et l’identifiant comme nouvelle valeur. Le dictionnaire reçu reste inchangé.',
    hints:['Prépare resultat = {}.', 'for identifiant, pseudo in annuaire.items():', 'Ajoute resultat[pseudo] = identifiant.']
  });
  assignById(practiceBank, 'P7-X2', {
    level:2, kind:'transfert',
    prompt:'Écris <code>extensions(fichiers)</code>. <code>fichiers</code> contient déjà les extensions sous forme de chaînes, par exemple <code>["py", "html", "py"]</code>. Construis un dictionnaire de fréquences : chaque extension devient une clé et sa valeur est son nombre d’occurrences. N’utilise ni <code>count</code> ni méthode non introduite.',
    hints:['Reprends exactement le schéma clé absente → initialiser à 0 → incrémenter.', 'Le résultat pour une liste vide est {}.']
  });
  assignById(practiceBank, 'P7-X5', {
    level:3, kind:'transfert',
    prompt:'Écris <code>categorie_majoritaire(categories)</code> pour une liste de chaînes non vide. Première étape : construis un dictionnaire de fréquences. Deuxième étape : reparcours la liste d’origine et mémorise la catégorie dont la fréquence est strictement supérieure à celle du meilleur courant. En cas d’égalité, le test strict <code>></code> conserve la catégorie rencontrée en premier.',
    hints:['Commence par construire f, le dictionnaire des fréquences.', 'Initialise meilleur = categories[0].', 'Dans le second parcours, remplace meilleur seulement si f[c] > f[meilleur].']
  });
  reorderPractice(practiceBank, ['P7-X1','P7-X3','P7-X4','P7-X2','P7-X5']);

  const noviceP7 = byModule(noviceBank, 'P7');
  if (noviceP7) {
    noviceP7.goal = 'Choisir une structure en fonction de l’accès voulu, puis distinguer sans ambiguïté indice, clé, valeur et effet de bord.';
    noviceP7.prerequisites = ['Listes et copies de P6','Fonctions de P4','Boucles for'];
    noviceP7.vocabulary = [
      ['tuple','Petit regroupement ordonné et immuable ; chaque position a un sens.'],
      ['dictionnaire','Objet mutable qui associe des clés uniques à des valeurs.'],
      ['clé','Nom ou identifiant utilisé pour retrouver une valeur ; ce n’est pas une position.'],
      ['items()','Méthode qui permet de parcourir simultanément les clés et les valeurs.']
    ];
    noviceP7.harness = 'Dans P7, ne cherche pas une méthode compliquée : commence par dire si tu veux retrouver une donnée par sa position ou par une clé. Les exercices rappellent explicitement les opérations de dictionnaire nécessaires.';
    noviceP7.worked = {
      title:'Construire une fiche de jeu',
      problem:'On veut retrouver le titre et l’année d’un jeu par des noms de champs lisibles.',
      steps:[
        ['1 · Choisir les clés','Les champs s’appellent titre et annee : ces noms deviennent les clés.'],
        ['2 · Construire la ligne','Chaque clé est associée à une valeur.'],
        ['3 · Lire par clé','On écrit jeu["annee"] et non jeu[1] si l’on veut raisonner avec le nom du champ.']
      ],
      code:"jeu = {'titre':'Algo Quest', 'annee':2026}\nprint(jeu['titre'])\nprint(jeu['annee'])"
    };
    noviceP7.checks = [
      {q:'Dans profil["niveau"], "niveau" est…',options:['un indice','une clé','une valeur','une boucle'],answer:1,explain:'Le dictionnaire retrouve la valeur associée à la clé "niveau".'},
      {q:'Que teste "Ada" in scores ?',options:['si "Ada" est une clé','si "Ada" est forcément une valeur','la longueur du dictionnaire','un indice'],answer:0,explain:'Sur un dictionnaire, in teste la présence d’une clé.'},
      {q:'Quand clé et valeur sont toutes deux utiles pendant le parcours, quelle écriture est adaptée ?',options:['d.items()','range(d)','d[0]','len uniquement'],answer:0,explain:'items() fournit à chaque tour une paire clé/valeur.']}
    ];
  }

  const primmP7 = byModule(primmBank, 'P7');
  if (primmP7) {
    primmP7.title = 'Clés, valeurs et mise à jour';
    primmP7.seed = "profil = {'nom':'Ada', 'niveau':3}\nprint(profil['nom'])\nprofil['niveau'] = 4\nprofil['badge'] = 'bronze'\nprint(profil['niveau'], profil['badge'])";
    primmP7.predict = 'Sans exécuter, prédis exactement les deux affichages. Indique pour chaque accès ce qui est une clé et ce qui est une valeur.';
    primmP7.investigate = [
      'Pourquoi profil["niveau"] = 4 remplace-t-il une valeur existante ?',
      'Pourquoi profil["badge"] = "bronze" crée-t-il une nouvelle entrée ?',
      'Que vaut l’expression "nom" in profil ?'
    ];
    primmP7.modify = 'Ajoute une clé score valant 100, puis augmente ce score de 25 sans créer un second champ.';
    primmP7.make = 'Crée un dictionnaire représentant un objet de ton choix avec trois clés lisibles, affiche une valeur par sa clé puis modifie explicitement une entrée.';
  }

  /* ------------------------------------------------------------------
     P8 — a table is a list of rows; CSV import is a supplied mechanism.
     ------------------------------------------------------------------ */
  p8.duration = '115 min';
  p8.summary = 'Passer d’une ligne dictionnaire à une table, puis importer, convertir, rechercher, filtrer, trier et fusionner sans confondre structure, types et mécanique du fichier CSV.';
  p8.objectives = [
    'Reconnaître une table comme une collection de lignes partageant les mêmes descripteurs',
    'Importer une table depuis un CSV et identifier les types réellement obtenus',
    'Rechercher ou filtrer des lignes selon un critère explicite',
    'Trier suivant une colonne et fusionner deux tables sur une clé commune'
  ];
  p8.lessons = [
    {
      title:'1 · Transition P7 → P8 : une table est une liste de lignes',
      html:'En P7, un dictionnaire pouvait représenter une seule fiche. En P8, une <strong>table</strong> regroupe plusieurs lignes qui partagent les mêmes descripteurs. Dans PYTHON//FORGE, une ligne est représentée par un dictionnaire et la table par une liste de ces dictionnaires. Il faut donc raisonner sur deux niveaux : la position de la ligne dans la liste, puis la clé du champ dans le dictionnaire.',
      code:"table = [\n    {'nom':'Ada', 'note':17},\n    {'nom':'Alan', 'note':9}\n]\nprint(table[0])\nprint(table[0]['note'])",
      points:[
        'table[0] désigne une ligne entière.',
        'table[0]["note"] désigne le champ note de cette ligne.',
        'Les lignes d’une même table doivent partager les descripteurs attendus.'
      ]
    },
    {
      title:'2 · Rechercher une ligne ou filtrer plusieurs lignes',
      html:'Une <strong>recherche</strong> peut s’arrêter dès qu’une ligne convient. Un <strong>filtre</strong> doit au contraire construire une nouvelle table contenant toutes les lignes qui respectent le critère. On commence par une boucle explicite : la compréhension de liste n’est jamais nécessaire pour réussir P8.',
      code:"admis = []\nfor ligne in table:\n    if ligne['note'] >= 10:\n        admis.append(ligne)",
      points:[
        'Recherche d’une première ligne : return dès qu’elle est trouvée.',
        'Filtrage : append chaque ligne retenue dans une nouvelle liste.',
        'Le critère porte sur un champ, donc sur une valeur lue avec une clé.'
      ]
    },
    {
      title:'3 · Importer un CSV : le lecteur est un mécanisme fourni',
      html:'Le programme demande de savoir importer une table depuis un fichier CSV. Dans le navigateur, <code>io.StringIO</code> simule simplement un petit fichier texte afin que l’exemple soit exécutable ; ce nom n’est pas à mémoriser. Le mécanisme important est <code>csv.DictReader</code> : la première ligne fournit les noms de colonnes et chaque ligne lue devient un dictionnaire.',
      code:"import csv, io\ntexte_csv = 'nom,note\\nAda,17\\nAlan,9\\n'\nlecteur = csv.DictReader(io.StringIO(texte_csv))\ntable = list(lecteur)\nprint(table[0])  # {'nom': 'Ada', 'note': '17'}",
      points:[
        'DictReader utilise les en-têtes comme clés des dictionnaires.',
        'Dans un vrai script, le lecteur peut recevoir un fichier ouvert ; StringIO sert seulement à la simulation dans le navigateur.',
        'L’import produit une structure de données : les traitements viennent ensuite.'
      ]
    },
    {
      title:'4 · Après lecture CSV, les champs sont d’abord des chaînes de caractères',
      html:'Une valeur qui ressemble à un nombre dans le fichier n’est pas automatiquement un entier Python. Après <code>DictReader</code>, <code>"17"</code> reste une chaîne. Avant une comparaison numérique ou un calcul, il faut convertir explicitement avec <code>int(...)</code> ou <code>float(...)</code> lorsque le domaine de valeurs le demande.',
      code:"ligne = {'nom':'Ada', 'note':'17'}\nprint(type(ligne['note']))\nligne['note'] = int(ligne['note'])\nprint(type(ligne['note']))",
      points:[
        '"17" et 17 ne sont pas la même valeur Python.',
        'Convertis seulement les colonnes dont le sens est numérique.',
        'Une comparaison numérique doit porter sur des nombres, pas sur du texte qui ressemble à un nombre.'
      ]
    },
    {
      title:'5 · Trier suivant une colonne sans introduire lambda',
      html:'Pour trier une table selon un champ, Python peut utiliser <code>sorted</code> avec une petite fonction qui indique la valeur à comparer. On emploie ici une fonction nommée afin de ne pas introduire prématurément <code>lambda</code>. <code>sorted</code> renvoie une nouvelle liste et préserve la table reçue.',
      code:"def cle_note(ligne):\n    return ligne['note']\n\ntriee = sorted(table, key=cle_note)",
      points:[
        'La fonction cle_note reçoit une ligne et renvoie la valeur du champ utilisé pour le tri.',
        'sorted construit une nouvelle liste triée.',
        'Aucune connaissance de lambda n’est nécessaire dans P8.'
      ]
    },
    {
      title:'6 · Fusion : rapprocher deux tables grâce à une clé commune',
      html:'Fusionner deux tables consiste à construire une nouvelle table ou une nouvelle collection en rapprochant les lignes qui représentent le même objet. Un identifiant commun comme <code>id</code> sert de clé de rapprochement. Au niveau Première, deux boucles imbriquées suffisent pour rendre le mécanisme visible.',
      code:"resultat = []\nfor eleve in eleves:\n    for groupe in groupes:\n        if eleve['id'] == groupe['id']:\n            resultat.append((eleve['nom'], groupe['groupe']))",
      points:[
        'La valeur du champ id doit appartenir au même domaine dans les deux tables.',
        'On ne fusionne que les lignes dont les identifiants correspondent.',
        'Le résultat est une nouvelle collection : les tables sources restent disponibles.'
      ]
    },
    {
      title:'7 · Cohérence et doublons : vérifier les hypothèses sur les données',
      html:'Une table n’est fiable que si ses lignes respectent les descripteurs et les domaines attendus. Selon la situation, un identifiant peut devoir être unique. Rechercher des doublons ou une valeur d’un type inattendu permet de détecter une incohérence avant de filtrer, trier ou fusionner.',
      code:"vus = {}\ndoublon = False\nfor ligne in table:\n    identifiant = ligne['id']\n    if identifiant in vus:\n        doublon = True\n    vus[identifiant] = True",
      points:[
        'Un même nom de champ doit avoir le même sens dans toutes les lignes.',
        'Une clé d’identification annoncée unique ne doit pas apparaître deux fois.',
        'Les contrôles de cohérence précèdent les traitements qui supposent ces propriétés.'
      ]
    }
  ];

  Object.assign(byId(p8.exercises, 'P8-E1'), {
    title:'Filtrer une table par un critère', level:1, kind:'compléter',
    prompt:'Complète <code>admis(table)</code>. La table est déjà chargée et chaque ligne est un dictionnaire contenant une note <strong>déjà de type numérique</strong>. Construis une nouvelle liste contenant toutes les lignes dont <code>ligne["note"] >= 10</code>, dans le même ordre. N’utilise pas de compréhension : le but est de voir explicitement le parcours, le test et l’ajout.',
    starter:"def admis(table):\n    resultat = []\n    for ligne in table:\n        # Si la note est au moins 10, ajoute la ligne\n        pass\n    return resultat",
    solution:"def admis(table):\n    resultat = []\n    for ligne in table:\n        if ligne['note'] >= 10:\n            resultat.append(ligne)\n    return resultat",
    hints:['Lis la note avec ligne["note"].', 'Teste >= 10.', 'Si le test est vrai, ajoute la ligne entière avec resultat.append(ligne).']
  });
  Object.assign(byId(p8.exercises, 'P8-E2'), {
    title:'Rechercher une ligne par identifiant', level:2, kind:'écrire',
    prompt:'Écris <code>cherche(table, identifiant)</code>. Chaque ligne possède une clé <code>"id"</code>. Parcours les lignes et renvoie immédiatement la première ligne telle que <code>ligne["id"] == identifiant</code>. Si aucune ligne ne correspond après tout le parcours, renvoie <code>None</code>.',
    starter:'def cherche(table, identifiant):\n    # Parcours les lignes une par une\n    pass',
    hints:['Teste ligne["id"] == identifiant.', 'Quand la ligne est trouvée : return ligne.', 'Le return None vient après la boucle.']
  });
  Object.assign(byId(p8.exercises, 'P8-E3'), {
    title:'Fusionner deux tables sur la clé id', level:3, kind:'compléter',
    prompt:'Complète <code>associe(noms, groupes)</code>. Les deux tables sont des listes de dictionnaires et utilisent le même champ <code>"id"</code>. Pour chaque ligne de <code>noms</code>, cherche une ligne de <code>groupes</code> ayant le même identifiant. Ajoute alors le tuple <code>(nom, groupe)</code> au résultat. Les tables reçues ne doivent pas être modifiées.',
    starter:"def associe(noms, groupes):\n    resultat = []\n    for n in noms:\n        for g in groupes:\n            # Compare les identifiants puis ajoute le tuple demandé\n            pass\n    return resultat",
    hints:['Compare n["id"] et g["id"].', 'Si les identifiants sont égaux, ajoute (n["nom"], g["groupe"]).', 'Deux boucles imbriquées suffisent ici.']
  });

  assignById(practiceBank, 'P8-X1', {
    title:'Importer un petit CSV dans le navigateur', level:1, kind:'compléter',
    prompt:'Le texte <code>texte_csv</code> représente un petit fichier CSV et la ligne <code>csv.DictReader(io.StringIO(texte_csv))</code> est fournie. Complète seulement le <code>return</code> pour transformer le lecteur en liste de dictionnaires. Les valeurs lues restent des chaînes : la note <code>17</code> du texte devient <code>"17"</code>.',
    starter:"import csv, io\n\ndef importe(texte_csv):\n    lecteur = csv.DictReader(io.StringIO(texte_csv))\n    return ____________",
    tests:[
      {label:'deux lignes',expr:"importe('nom,note\\nAda,17\\nAlan,9\\n') == [{'nom':'Ada','note':'17'},{'nom':'Alan','note':'9'}]"},
      {label:'table vide avec en-tête',expr:"importe('nom,note\\n') == []"}
    ],
    hints:['Un lecteur peut être transformé en liste avec list(...).', 'Écris return list(lecteur).', 'Ne convertis encore aucun champ : observe d’abord la structure obtenue.'],
    solution:"import csv, io\n\ndef importe(texte_csv):\n    lecteur = csv.DictReader(io.StringIO(texte_csv))\n    return list(lecteur)",
    tags:['CSV','DictReader','import']
  });
  assignById(practiceBank, 'P8-X3', {
    title:'Déboguer un filtre après lecture CSV', level:2, kind:'déboguer',
    prompt:'La table provient d’un CSV : chaque <code>ligne["note"]</code> est donc une chaîne comme <code>"12"</code>. La fonction doit créer une nouvelle table avec les notes strictement supérieures au seuil numérique. Corrige le test pour convertir la note avec <code>int(...)</code> avant la comparaison. Le seuil lui-même n’est pas conservé.',
    starter:"def au_dessus(table, seuil):\n    resultat = []\n    for ligne in table:\n        if ligne['note'] > seuil:\n            resultat.append(ligne)\n    return resultat",
    tests:[
      {label:'conversion puis filtre',expr:"au_dessus([{'note':'8'},{'note':'12'},{'note':'10'}],10) == [{'note':'12'}]"},
      {label:'vide',expr:'au_dessus([],10) == []'}
    ],
    hints:['Après DictReader, la note est du texte.', 'Compare int(ligne["note"]) > seuil.', 'La ligne elle-même peut rester inchangée dans le résultat.'],
    solution:"def au_dessus(table, seuil):\n    resultat = []\n    for ligne in table:\n        if int(ligne['note']) > seuil:\n            resultat.append(ligne)\n    return resultat",
    tags:['CSV','conversion','filtrage']
  });
  assignById(practiceBank, 'P8-X2', {
    level:2, kind:'écrire',
    prompt:'Écris <code>stand_par_nom(table, nom)</code>. La table est déjà chargée. Chaque ligne possède une clé <code>"nom"</code>. Renvoie la première ligne dont ce champ est égal au paramètre <code>nom</code>, sinon <code>None</code>. Cet exercice distingue une recherche qui s’arrête au premier résultat d’un filtre qui construit plusieurs lignes.',
    hints:['Parcours for ligne in table.', 'Si ligne["nom"] == nom : return ligne.', 'Si toute la boucle se termine : return None.']
  });
  assignById(practiceBank, 'P8-X4', {
    title:'Trier une table suivant la colonne age', level:2, kind:'écrire',
    prompt:'Écris <code>trie_par_age(table)</code> qui renvoie une <strong>nouvelle liste</strong> triée par âge croissant sans modifier <code>table</code>. Définis d’abord une petite fonction <code>cle_age(ligne)</code> qui renvoie <code>ligne["age"]</code>, puis utilise <code>sorted(table, key=cle_age)</code>. Aucune lambda n’est nécessaire.',
    starter:"def cle_age(ligne):\n    # renvoie la valeur utilisée pour comparer les lignes\n    pass\n\ndef trie_par_age(table):\n    # sorted construit une nouvelle liste\n    pass",
    tests:[
      {label:'tri croissant',expr:"trie_par_age([{'nom':'A','age':17},{'nom':'B','age':15},{'nom':'C','age':16}]) == [{'nom':'B','age':15},{'nom':'C','age':16},{'nom':'A','age':17}]"},
      {label:'source préservée',expr:"(lambda t: (trie_par_age(t), t)[1])([{'age':2},{'age':1}]) == [{'age':2},{'age':1}]"}
    ],
    hints:['cle_age(ligne) doit seulement renvoyer ligne["age"].', 'Dans trie_par_age : return sorted(table, key=cle_age).', 'sorted ne modifie pas la liste reçue.'],
    solution:"def cle_age(ligne):\n    return ligne['age']\n\ndef trie_par_age(table):\n    return sorted(table, key=cle_age)",
    tags:['table','tri','colonne']
  });
  assignById(practiceBank, 'P8-X5', {
    level:3, kind:'transfert',
    prompt:'Écris <code>badges_eleves(eleves, badges)</code>. Les deux tables utilisent le champ <code>"id"</code> avec le même type de valeur. Pour chaque élève, cherche le badge ayant le même identifiant et ajoute <code>(nom, badge)</code> au résultat. Si un identifiant n’existe pas dans les deux tables, aucun tuple n’est ajouté pour lui. Les tables sources restent inchangées.',
    hints:['Pour chaque ligne e, parcours les lignes b.', 'Compare e["id"] == b["id"].', 'En cas d’égalité, ajoute (e["nom"], b["badge"]).']
  });
  reorderPractice(practiceBank, ['P8-X1','P8-X3','P8-X2','P8-X4','P8-X5']);

  const noviceP8 = byModule(noviceBank, 'P8');
  if (noviceP8) {
    noviceP8.goal = 'Passer d’une ligne dictionnaire à une table puis à un CSV, sans confondre niveau de structure, nom de champ et type des valeurs.';
    noviceP8.prerequisites = ['Dictionnaires, clés et items() de P7','Listes et copies de P6','Boucles et conditions'];
    noviceP8.vocabulary = [
      ['ligne','Un enregistrement de la table ; ici un dictionnaire champ → valeur.'],
      ['descripteur','Nom d’un champ partagé par les lignes, par exemple nom, note ou id.'],
      ['table','Liste de lignes qui partagent les descripteurs attendus.'],
      ['CSV','Format texte tabulaire ; après lecture, les champs sont d’abord du texte.']
    ];
    noviceP8.harness = 'La mécanique d’ouverture d’un fichier n’est pas un prérequis caché. Dans le navigateur, le lecteur CSV est fourni avec un petit texte simulant le fichier. Ton travail est d’abord de comprendre la table obtenue, puis les conversions et traitements.';
    noviceP8.worked = {
      title:'Filtrer une table déjà chargée',
      problem:'Conserver toutes les lignes dont la note numérique est au moins 10.',
      steps:[
        ['1 · Identifier les deux niveaux','table est une liste ; ligne est un dictionnaire.'],
        ['2 · Lire le bon champ','ligne["note"] fournit la valeur à tester.'],
        ['3 · Construire un nouveau résultat','Chaque ligne admise est ajoutée à une nouvelle liste.']
      ],
      code:"table = [{'nom':'Ada','note':17},{'nom':'Alan','note':9}]\nadmis = []\nfor ligne in table:\n    if ligne['note'] >= 10:\n        admis.append(ligne)\nprint(admis)"
    };
    noviceP8.checks = [
      {q:'Si table est une liste de dictionnaires, que représente table[0] ?',options:['une colonne entière','la première ligne','une clé','le fichier CSV brut'],answer:1,explain:'Le premier indice sélectionne une ligne de la liste.'},
      {q:'Après csv.DictReader, la valeur 17 écrite dans le fichier est généralement obtenue comme…',options:['l’entier 17 automatiquement','la chaîne "17"','un booléen','None'],answer:1,explain:'Le CSV est du texte ; une conversion explicite est nécessaire pour un usage numérique.'},
      {q:'Pour conserver toutes les lignes satisfaisant un critère, il faut…',options:['retourner dès la première','construire une nouvelle liste de lignes','modifier obligatoirement les clés','trier avant tout'],answer:1,explain:'Un filtre parcourt toute la table et construit la collection des lignes retenues.']}
    ];
  }

  const primmP8 = byModule(primmBank, 'P8');
  if (primmP8) {
    primmP8.title = 'Types après CSV et filtrage explicite';
    primmP8.seed = "table = [\n    {'nom':'A','note':'12'},\n    {'nom':'B','note':'9'},\n    {'nom':'C','note':'15'}\n]\nadmis = []\nfor ligne in table:\n    if int(ligne['note']) >= 10:\n        admis.append(ligne['nom'])\nprint(admis)";
    primmP8.predict = 'Sans exécuter, prédis la liste affichée. Pour chaque ligne, indique la chaîne lue dans le champ note puis l’entier obtenu par int(...).';
    primmP8.investigate = [
      'Pourquoi int(ligne["note"]) est-il nécessaire dans cet exemple ?',
      'La boucle ajoute-t-elle la ligne entière ou seulement le champ nom ?',
      'La table d’origine est-elle modifiée ?'
    ];
    primmP8.modify = 'Change le seuil à 13 puis modifie le programme pour conserver les lignes entières au lieu des seuls noms.';
    primmP8.make = 'Crée une petite table de trois lignes contenant un champ numérique stocké sous forme de chaîne, puis construis par une boucle explicite une nouvelle liste selon un critère numérique après conversion.';
  }
}
