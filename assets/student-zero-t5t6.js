// V1.18 — Student Zero Gate T5 → T6
// Build the relational model before SQL recipes.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT5T6(modules, practiceBank, primmBank, noviceBank) {
  const t6 = modules.find(module => module.id === 'T6');
  if (!t6) return;

  t6.duration = '165 min';
  t6.title = 'Modèle relationnel & SQL';
  t6.summary = 'Passer d’un réseau de liens à une base relationnelle en distinguant relation, schéma, attribut, domaine, tuple, clés et requêtes SQL.';
  t6.bo = 'Bases de données : modèle relationnel ; relation, attribut, domaine, clé primaire, clé étrangère, schéma relationnel ; SQL d’interrogation et de mise à jour';
  t6.objectives = [
    'Distinguer un graphe, une table Python, une feuille de calcul et une relation du modèle relationnel',
    'Lire un schéma relationnel et identifier relation, attribut, domaine et tuple',
    'Justifier le choix d’une clé primaire et le rôle d’une clé étrangère',
    'Relier deux relations par une jointure en suivant clé étrangère → clé primaire',
    'Écrire des requêtes SELECT / FROM / WHERE puis des mises à jour simples',
    'Exécuter une requête paramétrée en Python sans concaténer une saisie utilisateur'
  ];

  t6.lessons = [
    {
      title: 'Transition T5 → T6 : un lien de graphe n’est pas une clé étrangère',
      html: 'En T5, on représentait des <strong>liens</strong> entre sommets. Une base relationnelle organise des données dans plusieurs <strong>relations</strong> décrites par des schémas et reliées par des valeurs de clés. Une clé étrangère peut matérialiser un lien entre deux relations, mais elle n’est pas simplement une « arête stockée ». Le modèle, les contraintes et les requêtes sont différents.',
      code: `# Graphe : un sommet et ses voisins\ng = {'Ada': ['Alan', 'Grace']}\n\n# Modèle relationnel : deux schémas liés par une clé\n# groupe(id, nom)\n# eleve(id, nom, groupe_id)\n#                 ^ clé étrangère vers groupe.id`
    },
    {
      title: 'Relation ≠ table Python ≠ feuille de calcul',
      html: 'Le mot <strong>relation</strong> appartient ici au modèle relationnel. Une relation possède un schéma, des attributs et des tuples qui respectent des domaines et des contraintes. Une liste de dictionnaires Python peut servir à représenter des lignes en mémoire, et une feuille de calcul ressemble visuellement à un tableau, mais ni l’une ni l’autre ne définit à elle seule une base relationnelle. Le même mot « table » est souvent utilisé en SQL ; garde le modèle conceptuel en tête.',
      points: [
        'Python : structure de données en mémoire choisie par le programmeur.',
        'Feuille de calcul : grille de cellules destinée à la manipulation de documents.',
        'Relation : ensemble de tuples respectant un schéma et des contraintes.'
      ]
    },
    {
      title: 'Schéma, attribut, domaine, tuple : lire avant de requêter',
      html: 'Le <strong>schéma relationnel</strong> décrit la structure attendue. Une <strong>relation</strong> porte un nom. Ses <strong>attributs</strong> sont les champs nommés. Le <strong>domaine</strong> décrit les valeurs admissibles d’un attribut. Un <strong>tuple relationnel</strong> est une ligne de valeurs conforme au schéma. Attention : « tuple relationnel » est une notion du modèle ; ce n’est pas synonyme du type Python <code>tuple</code>.',
      code: `# Schéma conceptuel\n# eleve(\n#   id : entier,\n#   nom : texte,\n#   note : entier,\n#   groupe_id : entier\n# )\n#\n# (7, 'Ada', 17, 2) est un tuple de cette relation.`
    },
    {
      title: 'Clé primaire : identifier une ligne sans ambiguïté',
      html: 'Une <strong>clé primaire</strong> identifie de manière unique chaque tuple de la relation. Deux élèves peuvent porter le même nom : <code>nom</code> est donc un mauvais identifiant. Un attribut <code>id</code> conçu pour être unique est un choix classique. La clé n’est pas « la première colonne » : son rôle vient de la contrainte d’identification.',
      code: `# eleve\n# id | nom   | note\n#  7 | Ada   | 17\n# 12 | Ada   | 14\n#\n# Le nom n'identifie pas une ligne. L'id, oui.`
    },
    {
      title: 'Clé étrangère : référencer une ligne d’une autre relation',
      html: 'Une <strong>clé étrangère</strong> contient une valeur qui référence une clé d’une autre relation. Dans <code>eleve.groupe_id</code>, la valeur 2 signifie « ce tuple est lié au groupe dont la clé primaire vaut 2 ». Cette contrainte contribue à l’<strong>intégrité référentielle</strong> : on ne doit pas inventer un identifiant de groupe inexistant.',
      code: `# groupe                     # eleve\n# id | nom                   # id | nom  | groupe_id\n#  2 | TG1                   #  7 | Ada  | 2\n#       ^ clé primaire              ^       ^ clé étrangère\n#                                 Ada référence le groupe 2.`
    },
    {
      title: 'Une base relationnelle = plusieurs relations + des contraintes',
      html: 'Une base ne se réduit pas à « une grande table ». Séparer les informations évite de répéter inutilement les mêmes valeurs et permet de maintenir des liens cohérents. Pour raisonner, commence par lire les schémas et les clés avant d’écrire du SQL.',
      code: `# groupe(id, nom)\n# eleve(id, nom, note, groupe_id)\n#\n# PK : groupe.id, eleve.id\n# FK : eleve.groupe_id → groupe.id`
    },
    {
      title: 'SELECT / FROM / WHERE : projection puis sélection',
      html: '<code>SELECT</code> indique les attributs à obtenir, <code>FROM</code> la relation interrogée et <code>WHERE</code> la condition que doivent vérifier les tuples conservés. Commence toujours par dire en français : « je veux quelles colonnes, dans quelle relation, avec quelle condition ? ».',
      code: `SELECT nom\nFROM eleve\nWHERE note >= 10`
    },
    {
      title: 'JOIN ... ON : suivre la clé étrangère jusqu’à la clé référencée',
      html: 'Une jointure rapproche les tuples de deux relations lorsque la condition de liaison est vraie. Dans notre exemple, <code>eleve.groupe_id</code> est comparé à <code>groupe.id</code>. L’élève doit pouvoir expliquer les deux côtés de <code>ON</code> avant de recopier la syntaxe.',
      code: `SELECT eleve.nom, groupe.nom\nFROM eleve\nJOIN groupe ON eleve.groupe_id = groupe.id`
    },
    {
      title: 'Mettre à jour : INSERT, UPDATE et DELETE modifient la base',
      html: 'Une requête d’interrogation lit des données ; une requête de mise à jour les modifie. <code>INSERT</code> ajoute un tuple, <code>UPDATE</code> modifie des tuples existants et <code>DELETE</code> en supprime. Pour <code>UPDATE</code> et <code>DELETE</code>, relis toujours la clause <code>WHERE</code> : sans filtre, plusieurs lignes peuvent être touchées.',
      code: `UPDATE eleve\nSET note = 18\nWHERE id = 7`
    },
    {
      title: 'Python + SQL : la donnée utilisateur reste séparée de la requête',
      html: 'Avec <code>sqlite3</code>, Python envoie une chaîne SQL au moteur de base. Lorsqu’une valeur vient d’un paramètre du programme, utilise un marqueur <code>?</code> et transmets la donnée séparément. Ne fabrique pas la requête par concaténation : cela mélange le programme SQL et la donnée reçue.',
      code: `requete = 'SELECT nom FROM eleve WHERE id = ?'\ncur.execute(requete, (identifiant,))\nligne = cur.fetchone()`
    }
  ];

  const e1 = byId(t6.exercises, 'T6-E1');
  Object.assign(e1, {
    title: 'SELECT / WHERE : lire le schéma avant la requête',
    level: 1,
    prompt: 'On dispose de la relation <code>eleve(id, nom, note, groupe_id)</code>. <code>id</code> est la clé primaire et <code>groupe_id</code> une clé étrangère. Écris <code>requete_admis()</code> qui renvoie exactement la requête SQL sélectionnant uniquement l’attribut <code>nom</code> des élèves dont <code>note</code> est supérieure ou égale à 10 : <code>SELECT nom FROM eleve WHERE note >= 10</code>.',
    starter: `def requete_admis():\n    # 1. SELECT : quel attribut veut-on obtenir ?\n    # 2. FROM   : dans quelle relation ?\n    # 3. WHERE  : quelle condition ?\n    pass`,
    tests: [
      {label:'projection + filtre', expr:"requete_admis().strip().upper() == 'SELECT NOM FROM ELEVE WHERE NOTE >= 10'"}
    ],
    hints: [
      'SELECT nom choisit la colonne utile ; il ne modifie pas la relation.',
      'WHERE note >= 10 conserve uniquement les tuples qui vérifient la condition.'
    ],
    solution: `def requete_admis():\n    return 'SELECT nom FROM eleve WHERE note >= 10'`
  });

  const e2 = byId(t6.exercises, 'T6-E2');
  Object.assign(e2, {
    title: 'JOIN : suivre clé étrangère → clé primaire',
    level: 2,
    prompt: 'Deux relations sont données : <code>groupe(id, nom)</code>, où <code>id</code> est clé primaire, et <code>eleve(id, nom, groupe_id)</code>, où <code>groupe_id</code> est une clé étrangère vers <code>groupe.id</code>. Écris <code>requete_groupes()</code> qui renvoie une requête sélectionnant <code>eleve.nom</code> et <code>groupe.nom</code> en reliant les deux relations avec <code>JOIN groupe ON eleve.groupe_id = groupe.id</code>.',
    starter: `def requete_groupes():\n    # Explique d’abord : eleve.groupe_id référence groupe.id.\n    return ''`,
    tests: [
      {label:'colonnes utiles', expr:"'SELECT ELEVE.NOM, GROUPE.NOM' in requete_groupes().upper()"},
      {label:'relations', expr:"'FROM ELEVE' in requete_groupes().upper() and 'JOIN GROUPE' in requete_groupes().upper()"},
      {label:'liaison FK vers PK', expr:"'ELEVE.GROUPE_ID = GROUPE.ID' in requete_groupes().upper()"}
    ],
    hints: [
      'La jointure ne rapproche pas les lignes par position : elle compare des valeurs de clés.',
      'Écris : SELECT ... FROM eleve JOIN groupe ON eleve.groupe_id = groupe.id.'
    ],
    solution: `def requete_groupes():\n    return 'SELECT eleve.nom, groupe.nom FROM eleve JOIN groupe ON eleve.groupe_id = groupe.id'`
  });

  const e3 = byId(t6.exercises, 'T6-E3');
  Object.assign(e3, {
    title: 'Python + SQL : requête paramétrée',
    level: 3,
    prompt: 'Écris <code>sql_par_id(cur, identifiant)</code>. Le paramètre <code>cur</code> est un curseur SQLite déjà créé ; <code>identifiant</code> est la valeur de clé primaire recherchée. Exécute <code>SELECT nom FROM eleve WHERE id = ?</code> en transmettant <code>identifiant</code> séparément dans le tuple Python <code>(identifiant,)</code>, puis renvoie la première ligne avec <code>cur.fetchone()</code>. Ne concatène jamais <code>identifiant</code> dans la chaîne SQL.',
    starter: `def sql_par_id(cur, identifiant):\n    requete = 'SELECT nom FROM eleve WHERE id = ?'\n    # Transmets la donnée séparément de requete.\n    pass`,
    tests: [
      {label:'requête et paramètre séparés', expr:"(lambda cur: (setattr(cur.fetchone, 'return_value', ('Ada',)), sql_par_id(cur, 7) == ('Ada',) and (cur.execute.assert_called_once_with('SELECT nom FROM eleve WHERE id = ?', (7,)) is None))[1])(__import__('unittest.mock', fromlist=['Mock']).Mock())"}
    ],
    hints: [
      'cur.execute reçoit deux arguments : la chaîne SQL puis le tuple des paramètres.',
      'Pour un tuple Python à un seul élément, la virgule est nécessaire : (identifiant,).'
    ],
    solution: `def sql_par_id(cur, identifiant):\n    requete = 'SELECT nom FROM eleve WHERE id = ?'\n    cur.execute(requete, (identifiant,))\n    return cur.fetchone()`
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T6');

  const x1 = byId(practice, 'T6-X1');
  Object.assign(x1, {
    title: 'Projection : choisir les attributs utiles',
    kind: 'compléter', level: 1,
    prompt: 'La relation <code>joueur(id, nom, score)</code> possède trois attributs. Complète <code>requete()</code> pour sélectionner uniquement <code>nom</code> et <code>score</code>. Il n’est pas demandé de récupérer <code>id</code> : une requête ne doit pas sélectionner des données inutiles.',
    starter: `def requete():\n    return 'SELECT __________ FROM joueur'`,
    tests: [{label:'deux attributs', expr:"requete().strip().upper() == 'SELECT NOM, SCORE FROM JOUEUR'"}],
    hints: ['Après SELECT, écris nom, score.', 'FROM joueur indique la relation interrogée.'],
    solution: `def requete():\n    return 'SELECT nom, score FROM joueur'`
  });

  const x2 = byId(practice, 'T6-X2');
  Object.assign(x2, {
    title: 'WHERE paramétré : préparer un seuil',
    kind: 'écrire', level: 1,
    prompt: 'La relation <code>joueur(id, nom, score)</code> est interrogée avec un seuil qui sera fourni plus tard par Python. Écris <code>requete_score()</code> qui renvoie exactement <code>SELECT nom FROM joueur WHERE score >= ?</code>. Le caractère <code>?</code> représente une donnée future ; il ne faut pas écrire sa valeur dans la chaîne.',
    starter: `def requete_score():\n    pass`,
    tests: [{label:'marqueur de paramètre', expr:"requete_score().strip().upper() == 'SELECT NOM FROM JOUEUR WHERE SCORE >= ?'"}],
    hints: ['SELECT nom : attribut à obtenir.', 'WHERE score >= ? : condition avec une valeur fournie séparément.'],
    solution: `def requete_score():\n    return 'SELECT nom FROM joueur WHERE score >= ?'`
  });

  const x3 = byId(practice, 'T6-X3');
  Object.assign(x3, {
    title: 'Déboguer une concaténation SQL dangereuse',
    kind: 'déboguer', level: 2,
    prompt: 'La fonction <code>cherche_nom(cur, nom)</code> mélange actuellement la saisie <code>nom</code> avec le texte SQL par concaténation. Corrige uniquement l’exécution : la chaîne doit devenir <code>SELECT id FROM joueur WHERE nom = ?</code> et la valeur doit être transmise séparément sous la forme <code>(nom,)</code>. La fonction renvoie toujours <code>cur.fetchone()</code>.',
    starter: `def cherche_nom(cur, nom):\n    cur.execute("SELECT id FROM joueur WHERE nom = '" + nom + "'")\n    return cur.fetchone()`,
    tests: [{label:'donnée séparée du SQL', expr:"(lambda c: (setattr(c.fetchone,'return_value',(3,)), cherche_nom(c,'Ada') == (3,) and (c.execute.assert_called_once_with('SELECT id FROM joueur WHERE nom = ?', ('Ada',)) is None))[1])(__import__('unittest.mock',fromlist=['Mock']).Mock())"}],
    hints: ['La chaîne SQL contient le marqueur ? à la place du nom.', 'Le second argument de execute est le tuple (nom,).'],
    solution: `def cherche_nom(cur, nom):\n    cur.execute('SELECT id FROM joueur WHERE nom = ?', (nom,))\n    return cur.fetchone()`
  });

  const x4 = byId(practice, 'T6-X4');
  Object.assign(x4, {
    title: 'Jointure de playlists',
    kind: 'écrire', level: 2,
    prompt: 'Deux relations sont données : <code>artiste(id, nom)</code> et <code>morceau(id, titre, artiste_id)</code>. <code>morceau.artiste_id</code> est une clé étrangère vers <code>artiste.id</code>. Écris <code>requete_playlist()</code> qui sélectionne <code>morceau.titre</code> et <code>artiste.nom</code> en utilisant exactement cette liaison dans <code>JOIN ... ON</code>.',
    starter: `def requete_playlist():\n    pass`,
    tests: [
      {label:'projection', expr:"'SELECT MORCEAU.TITRE, ARTISTE.NOM' in requete_playlist().upper()"},
      {label:'jointure sur les clés', expr:"'JOIN ARTISTE ON MORCEAU.ARTISTE_ID = ARTISTE.ID' in requete_playlist().upper()"}
    ],
    hints: ['Commence par FROM morceau : chaque morceau porte la clé étrangère artiste_id.', 'JOIN artiste ON morceau.artiste_id = artiste.id.'],
    solution: `def requete_playlist():\n    return 'SELECT morceau.titre, artiste.nom FROM morceau JOIN artiste ON morceau.artiste_id = artiste.id'`
  });

  const x5 = byId(practice, 'T6-X5');
  Object.assign(x5, {
    title: 'UPDATE : modifier un seul ticket',
    kind: 'transfert', level: 3,
    prompt: 'Écris <code>ferme_ticket(cur, identifiant)</code>. <code>cur</code> est un curseur SQLite et <code>identifiant</code> la clé primaire du ticket à fermer. Exécute <code>UPDATE ticket SET statut = ? WHERE id = ?</code> avec les paramètres <code>("ferme", identifiant)</code>. La clause <code>WHERE id = ?</code> est indispensable : sans elle, plusieurs tickets pourraient être modifiés. Aucun <code>commit()</code> n’est demandé ici.',
    starter: `def ferme_ticket(cur, identifiant):\n    pass`,
    tests: [{label:'UPDATE ciblé et paramétré', expr:"(lambda c: (ferme_ticket(c,7), c.execute.assert_called_once_with('UPDATE ticket SET statut = ? WHERE id = ?', ('ferme',7)) is None)[1])(__import__('unittest.mock',fromlist=['Mock']).Mock())"}],
    hints: ['Premier ? → nouveau statut ; second ? → identifiant du ticket.', 'Transmets les deux valeurs dans un même tuple, dans le même ordre que les marqueurs.'],
    solution: `def ferme_ticket(cur, identifiant):\n    cur.execute('UPDATE ticket SET statut = ? WHERE id = ?', ('ferme', identifiant))`
  });

  const primm = primmBank.find(item => item.moduleId === 'T6');
  if (primm) Object.assign(primm, {
    title: 'Une jointure suit les clés, pas la position des lignes',
    seed: `import sqlite3\n\ncon = sqlite3.connect(':memory:')\ncur = con.cursor()\ncur.execute('CREATE TABLE groupe(id INTEGER PRIMARY KEY, nom TEXT)')\ncur.execute('CREATE TABLE eleve(id INTEGER PRIMARY KEY, nom TEXT, groupe_id INTEGER)')\ncur.executemany('INSERT INTO groupe VALUES (?, ?)', [(1, 'TG1'), (2, 'TG2')])\ncur.executemany('INSERT INTO eleve VALUES (?, ?, ?)', [(7, 'Ada', 2), (8, 'Alan', 1)])\n\ncur.execute('SELECT eleve.nom, groupe.nom FROM eleve JOIN groupe ON eleve.groupe_id = groupe.id ORDER BY eleve.id')\nprint(cur.fetchall())`,
    predict: 'Sans exécuter, prédis les deux couples affichés. Ne rapproche pas les lignes par leur position : suis la valeur de eleve.groupe_id jusqu’à groupe.id.',
    investigate: [
      'Pour Ada, quelle valeur contient groupe_id et quelle ligne de groupe possède cette clé primaire ?',
      'Pourquoi la jointure donnerait-elle encore le bon groupe si l’ordre physique des lignes de groupe était inversé ?',
      'Quel rôle différent jouent eleve.id et eleve.groupe_id ?'
    ],
    modify: 'Ajoute le groupe 3 « TG3 » puis une élève Grace dont groupe_id vaut 3. Vérifie que la jointure produit le nouveau couple sans modifier la requête.',
    make: 'Conçois deux petits schémas relationnels liés par une clé étrangère, écris une jointure qui suit cette clé et explique en français les deux attributs comparés dans ON.'
  });

  const novice = noviceBank.find(item => item.moduleId === 'T6');
  if (novice) Object.assign(novice, {
    goal: 'Lire le modèle relationnel avant d’écrire du SQL : comprendre ce que représentent les lignes, les attributs et surtout les clés qui relient les relations.',
    prerequisites: ['Distinguer clé et valeur dans un dictionnaire', 'Comprendre qu’un graphe modélise des liens sans supposer qu’une base relationnelle est un graphe', 'Aucune spécialité mathématiques nécessaire'],
    vocabulary: [
      ['relation', 'Structure du modèle relationnel composée de tuples conformes à un même schéma ; en SQL on parle couramment de table.'],
      ['clé primaire', 'Attribut ou ensemble d’attributs qui identifie sans ambiguïté chaque tuple d’une relation.'],
      ['clé étrangère', 'Attribut dont les valeurs référencent une clé d’une autre relation afin de matérialiser un lien cohérent.']
    ],
    harness: 'Dans ce module, ne confonds pas trois niveaux : le modèle relationnel (relation, attribut, tuple, clé), le langage SQL qui interroge ce modèle, et les objets Python utilisés pour envoyer des requêtes ou recevoir des résultats. Un tuple relationnel n’est pas défini par le type tuple de Python.',
    worked: {
      title: 'Relier un élève à son groupe',
      problem: 'Deux relations stockent séparément les élèves et les groupes. On veut afficher le nom de l’élève avec le nom de son groupe sans recopier le nom du groupe dans chaque ligne élève.',
      steps: [
        ['1 · Lire les schémas', 'groupe(id, nom) et eleve(id, nom, groupe_id).'],
        ['2 · Repérer les clés', 'groupe.id et eleve.id identifient les lignes ; eleve.groupe_id référence groupe.id.'],
        ['3 · Écrire la liaison', 'JOIN groupe ON eleve.groupe_id = groupe.id rapproche les tuples par égalité des clés.']
      ],
      code: `# groupe(id, nom)\n# eleve(id, nom, groupe_id)\n\nrequete = '''SELECT eleve.nom, groupe.nom\nFROM eleve\nJOIN groupe ON eleve.groupe_id = groupe.id'''\nprint(requete)`
    },
    checks: [
      {q:'Quel est le rôle d’une clé primaire ?', options:['Être toujours la première colonne','Identifier chaque tuple sans ambiguïté','Trier automatiquement les lignes','Relier forcément deux relations'], answer:1, explain:'La position visuelle de la colonne n’a aucune importance : la clé primaire sert à l’identification unique.'},
      {q:'Dans eleve.groupe_id → groupe.id, groupe_id est…', options:['une clé étrangère','la clé primaire de groupe','un indice Python','une arête de graphe stockée telle quelle'], answer:0, explain:'groupe_id porte une valeur qui référence la clé groupe.id ; c’est le rôle d’une clé étrangère.'},
      {q:'Une relation du modèle relationnel est-elle simplement une liste de dictionnaires Python ?', options:['Oui, toujours','Non : une liste de dictionnaires n’est qu’une représentation Python possible de lignes'], answer:1, explain:'Le modèle relationnel définit schéma, domaines et contraintes indépendamment de la structure Python choisie pour manipuler des données.'}
    ]
  });
}