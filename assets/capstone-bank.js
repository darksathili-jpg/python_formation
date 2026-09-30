export default [
  {
    id:'CAP-1', track:'terminale', title:'Modération d’un salon de discussion', duration:'60 min',
    focus:'chaînes · dictionnaires · listes · tests', level:3, kind:'application', modules:['T7'],
    document:'Une association organise un salon de discussion. Chaque message est représenté par un dictionnaire contenant les clés `auteur` et `texte`. L’outil doit normaliser certains éléments et repérer les messages contenant un mot signalé. Le travail demandé porte sur la transformation et l’analyse des données, pas sur une interface réseau.',
    prompt:'Complète les trois fonctions : <code>normalise(texte)</code> met les lettres en minuscules et remplace chaque tiret par un espace ; <code>frequences_mots(texte)</code> renvoie un dictionnaire des fréquences des mots séparés par des espaces ; <code>a_revoir(messages, interdits)</code> renvoie les auteurs des messages contenant au moins un mot interdit après normalisation.',
    starter:"def normalise(texte):\n    pass\n\ndef frequences_mots(texte):\n    pass\n\ndef a_revoir(messages, interdits):\n    pass",
    tests:[
      {label:'normalisation',expr:"normalise('NSI-Python') == 'nsi python'"},
      {label:'fréquences',expr:"frequences_mots('code code nsi') == {'code':2,'nsi':1}"},
      {label:'messages à revoir',expr:"a_revoir([{'auteur':'Ada','texte':'Salut-NSI'},{'auteur':'Linus','texte':'SPAM ici'},{'auteur':'Grace','texte':'code spam'}], {'spam'}) == ['Linus','Grace']"}
    ],
    hints:['Pour normalise, construis une nouvelle chaîne caractère par caractère ; <code>lower()</code> est autorisé ici.','Pour les fréquences, <code>split()</code> fournit les mots.','Dans a_revoir, arrête l’analyse d’un message dès qu’un mot interdit est trouvé.'],
    dialogue:['Quel est le contrat précis de chacune des trois fonctions ?','Quel cas de test ajouterais-tu pour éviter une régression sur un message sans mot interdit ?','Pourquoi a_revoir construit-elle une nouvelle liste au lieu de modifier messages ?'],
    solution:"def normalise(texte):\n    resultat = ''\n    for c in texte.lower():\n        resultat += ' ' if c == '-' else c\n    return resultat\n\ndef frequences_mots(texte):\n    d = {}\n    for mot in texte.split():\n        if mot not in d:\n            d[mot] = 0\n        d[mot] += 1\n    return d\n\ndef a_revoir(messages, interdits):\n    resultat = []\n    for message in messages:\n        mots = normalise(message['texte']).split()\n        signale = False\n        for mot in mots:\n            if mot in interdits:\n                signale = True\n                break\n        if signale:\n            resultat.append(message['auteur'])\n    return resultat"
  },
  {
    id:'CAP-2', track:'terminale', title:'Centre d’assistance : gérer une file de tickets', duration:'60 min',
    focus:'POO · file · contrats · état', level:3, kind:'application', modules:['T2','T3','T7'],
    document:'Un centre d’assistance reçoit des tickets dans l’ordre d’arrivée. Un ticket est un tuple `(identifiant, priorite)`, mais dans cette version simplifiée l’ordre FIFO doit toujours être respecté. La classe `CentreSupport` encapsule la file et conserve les identifiants déjà traités.',
    prompt:'Complète <code>CentreSupport</code> avec <code>ajouter(ticket)</code>, <code>prochain()</code> et <code>nb_en_attente()</code>. <code>prochain()</code> retire et renvoie le ticket le plus ancien et ajoute son identifiant à <code>traites</code>. Une file vide doit provoquer une <code>AssertionError</code>.',
    starter:"class CentreSupport:\n    def __init__(self):\n        self.file = []\n        self.traites = []\n\n    def ajouter(self, ticket):\n        pass\n\n    def prochain(self):\n        pass\n\n    def nb_en_attente(self):\n        pass",
    tests:[
      {label:'attente initiale',expr:'CentreSupport().nb_en_attente() == 0'},
      {label:'FIFO',expr:"(lambda c: (c.ajouter((10,'N')), c.ajouter((11,'H')), c.prochain())[2])(CentreSupport()) == (10,'N')"},
      {label:'historique',expr:"(lambda c: (c.ajouter((7,'N')), c.prochain(), c.traites)[2])(CentreSupport()) == [7]"},
      {label:'vide interdit',expr:'CentreSupport().prochain()',raises:'AssertionError'}
    ],
    hints:['Ajouter en fin : <code>append</code>.','Pour une implémentation pédagogique simple, retire l’élément d’indice 0.','Teste le vide avant de retirer.'],
    dialogue:['Qu’est-ce qui appartient à l’interface de la file et qu’est-ce qui relève de cette implémentation ?','Pourquoi l’ordre demandé est-il FIFO ?','Quel test de régression conserverais-tu après un bug sur une file vide ?'],
    solution:"class CentreSupport:\n    def __init__(self):\n        self.file = []\n        self.traites = []\n\n    def ajouter(self, ticket):\n        self.file.append(ticket)\n\n    def prochain(self):\n        assert len(self.file) > 0\n        ticket = self.file.pop(0)\n        self.traites.append(ticket[0])\n        return ticket\n\n    def nb_en_attente(self):\n        return len(self.file)"
  },
  {
    id:'CAP-3', track:'terminale', title:'Explorateur de réseau local', duration:'60 min',
    focus:'graphes · BFS · dictionnaire · chemin', level:3, kind:'application', modules:['T3','T5'],
    document:'Un réseau de salles est modélisé par un graphe non pondéré : chaque clé est une salle et sa valeur est la liste des salles directement accessibles. On veut aider un visiteur à connaître les salles atteignables et la distance minimale en nombre de portes.',
    prompt:'Complète <code>accessibles(g, depart)</code> qui renvoie l’ensemble des sommets accessibles par BFS, puis <code>distance(g, depart, arrivee)</code> qui renvoie la longueur d’un plus court chemin, ou -1 si l’arrivée est inaccessible.',
    starter:'def accessibles(g, depart):\n    pass\n\ndef distance(g, depart, arrivee):\n    pass',
    tests:[
      {label:'composante',expr:"accessibles({'A':['B'],'B':['A','C'],'C':['B'],'X':[]}, 'A') == {'A','B','C'}"},
      {label:'distance',expr:"distance({'A':['B','C'],'B':['D'],'C':[],'D':[]}, 'A', 'D') == 2"},
      {label:'même salle',expr:"distance({'A':[]}, 'A', 'A') == 0"},
      {label:'inaccessible',expr:"distance({'A':[],'B':[]}, 'A', 'B') == -1"}
    ],
    hints:['Un BFS utilise une file et un ensemble de visités.','Pour la distance, place des couples (sommet, distance) dans la file.','Marque un voisin visité au moment où tu l’enfiles.'],
    dialogue:['Pourquoi faut-il mémoriser les sommets visités dans ce graphe ?','Pourquoi un BFS convient-il ici pour obtenir une distance minimale ?','Que changerait un graphe pondéré ?'],
    solution:"def accessibles(g, depart):\n    visites = {depart}\n    file = [depart]\n    while file:\n        s = file.pop(0)\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                file.append(v)\n    return visites\n\ndef distance(g, depart, arrivee):\n    visites = {depart}\n    file = [(depart, 0)]\n    while file:\n        s, d = file.pop(0)\n        if s == arrivee:\n            return d\n        for v in g[s]:\n            if v not in visites:\n                visites.add(v)\n                file.append((v, d + 1))\n    return -1"
  },
  {
    id:'CAP-4', track:'terminale', title:'Analyseur de journal d’événements', duration:'60 min',
    focus:'tables · dictionnaires · fonctions · débogage', level:3, kind:'application', modules:['T7'],
    document:"Une application enregistre des événements sous forme de dictionnaires : `{'heure': ..., 'niveau': ..., 'message': ...}`. L’équipe veut produire un résumé et extraire les erreurs sans modifier le journal d’origine.",
    prompt:'Complète <code>compte_niveaux(journal)</code> qui associe chaque niveau à son nombre d’occurrences, <code>erreurs(journal)</code> qui renvoie une nouvelle liste ne contenant que les lignes de niveau <code>ERROR</code>, et <code>premiere_heure(journal, niveau)</code> qui renvoie l’heure de la première ligne du niveau demandé ou <code>None</code>.',
    starter:'def compte_niveaux(journal):\n    pass\n\ndef erreurs(journal):\n    pass\n\ndef premiere_heure(journal, niveau):\n    pass',
    tests:[
      {label:'compte',expr:"compte_niveaux([{'heure':'08:00','niveau':'INFO','message':'ok'},{'heure':'08:01','niveau':'ERROR','message':'x'},{'heure':'08:02','niveau':'INFO','message':'y'}]) == {'INFO':2,'ERROR':1}"},
      {label:'filtre',expr:"erreurs([{'heure':'1','niveau':'INFO','message':'a'},{'heure':'2','niveau':'ERROR','message':'b'}]) == [{'heure':'2','niveau':'ERROR','message':'b'}]"},
      {label:'première heure',expr:"premiere_heure([{'heure':'1','niveau':'INFO','message':'a'},{'heure':'2','niveau':'ERROR','message':'b'},{'heure':'3','niveau':'ERROR','message':'c'}], 'ERROR') == '2'"},
      {label:'absent',expr:"premiere_heure([], 'ERROR') is None"}
    ],
    hints:['Pour le comptage, initialise une clé lors de sa première rencontre.','erreurs doit construire une nouvelle liste.','Pour la première occurrence, retourne dès que le niveau correspond.'],
    dialogue:['Quelle fonction possède un cas frontière particulièrement important ?','Comment vérifier que journal n’est pas modifié ?','Quel petit cas utiliserais-tu pour reproduire un bug sur un niveau absent ?'],
    solution:"def compte_niveaux(journal):\n    d = {}\n    for ligne in journal:\n        niveau = ligne['niveau']\n        if niveau not in d:\n            d[niveau] = 0\n        d[niveau] += 1\n    return d\n\ndef erreurs(journal):\n    resultat = []\n    for ligne in journal:\n        if ligne['niveau'] == 'ERROR':\n            resultat.append(ligne)\n    return resultat\n\ndef premiere_heure(journal, niveau):\n    for ligne in journal:\n        if ligne['niveau'] == niveau:\n            return ligne['heure']\n    return None"
  },
  {
    id:'CAP-5', track:'terminale', title:'Arbre de diagnostic d’un robot', duration:'60 min',
    focus:'récursivité · arbres binaires · parcours', level:3, kind:'application', modules:['T1','T4'],
    document:'Un robot de maintenance utilise un arbre binaire de diagnostic. Chaque nœud contient un code. Un nœud sans fils est une feuille. L’arbre vide est représenté par None. La convention de hauteur de cette mission est : arbre vide = 0 et feuille = 1.',
    prompt:'Complète <code>taille(a)</code>, <code>hauteur(a)</code> et <code>prefixe(a)</code>. <code>taille</code> renvoie le nombre de nœuds, <code>hauteur</code> respecte la convention donnée, et <code>prefixe</code> renvoie les codes dans l’ordre nœud-gauche-droite.',
    starter:"class Noeud:\n    def __init__(self, code, gauche=None, droite=None):\n        self.code = code\n        self.gauche = gauche\n        self.droite = droite\n\ndef taille(a):\n    pass\n\ndef hauteur(a):\n    pass\n\ndef prefixe(a):\n    pass",
    tests:[
      {label:'arbre vide',expr:'taille(None) == 0 and hauteur(None) == 0 and prefixe(None) == []'},
      {label:'arbre complet',expr:"(lambda a: taille(a) == 5 and hauteur(a) == 3 and prefixe(a) == ['A','B','D','E','C'])(Noeud('A',Noeud('B',Noeud('D'),Noeud('E')),Noeud('C')))"}
    ],
    hints:['Pour None, renvoie immédiatement la valeur du cas de base.','Chaque sous-appel travaille sur un sous-arbre complet.','Préfixe : nœud, puis gauche, puis droite.'],
    dialogue:['Que calcule exactement hauteur(a.gauche) ?','Pourquoi None est-il un cas de base commun aux trois fonctions ?','Quelle différence y a-t-il entre la taille et la hauteur de cet arbre ?'],
    solution:"class Noeud:\n    def __init__(self, code, gauche=None, droite=None):\n        self.code = code\n        self.gauche = gauche\n        self.droite = droite\n\ndef taille(a):\n    if a is None:\n        return 0\n    return 1 + taille(a.gauche) + taille(a.droite)\n\ndef hauteur(a):\n    if a is None:\n        return 0\n    hg = hauteur(a.gauche)\n    hd = hauteur(a.droite)\n    return 1 + max(hg, hd)\n\ndef prefixe(a):\n    if a is None:\n        return []\n    return [a.code] + prefixe(a.gauche) + prefixe(a.droite)"
  },
  {
    id:'CAP-6', track:'terminale', title:'Médiathèque : requêtes sûres', duration:'60 min',
    focus:'modèle relationnel · SQL · paramètres · tests', level:3, kind:'application', modules:['T6','T7'],
    document:'Une médiathèque possède une relation lecteur(id, nom), une relation livre(id, titre, genre) et une relation emprunt(lecteur_id, livre_id). lecteur.id et livre.id sont des clés primaires ; emprunt.lecteur_id et emprunt.livre_id sont des clés étrangères. Le curseur SQL est fourni à la fonction.',
    prompt:'Écris <code>requete_emprunts()</code> qui renvoie une jointure listant <code>lecteur.nom</code> et <code>emprunt.livre_id</code>, puis <code>livres_du_genre(cur, genre)</code> qui exécute <code>SELECT titre FROM livre WHERE genre = ?</code> avec un paramètre séparé et renvoie <code>fetchall()</code>.',
    starter:"def requete_emprunts():\n    pass\n\ndef livres_du_genre(cur, genre):\n    pass",
    tests:[
      {label:'jointure',expr:"requete_emprunts().strip().upper() == 'SELECT LECTEUR.NOM, EMPRUNT.LIVRE_ID FROM LECTEUR JOIN EMPRUNT ON LECTEUR.ID = EMPRUNT.LECTEUR_ID'"},
      {label:'requête paramétrée',expr:"(lambda cur: (setattr(cur.fetchall, 'return_value', [('Dune',)]), livres_du_genre(cur, 'SF') == [('Dune',)] and (cur.execute.assert_called_once_with('SELECT titre FROM livre WHERE genre = ?', ('SF',)) is None))[1])(__import__('unittest.mock', fromlist=['Mock']).Mock())"}
    ],
    hints:['La condition de jointure relie une clé étrangère à la clé primaire référencée.','Le symbole ? reste dans la requête.','Le paramètre est transmis sous la forme (genre,).'],
    dialogue:['Quelle contrainte logique exprime lecteur.id = emprunt.lecteur_id ?','Pourquoi genre ne doit-il pas être concaténé dans la chaîne SQL ?','Que signifie la ligne renvoyée par fetchall() dans cette mission ?'],
    solution:"def requete_emprunts():\n    return 'SELECT lecteur.nom, emprunt.livre_id FROM lecteur JOIN emprunt ON lecteur.id = emprunt.lecteur_id'\n\ndef livres_du_genre(cur, genre):\n    cur.execute('SELECT titre FROM livre WHERE genre = ?', (genre,))\n    return cur.fetchall()"
  },
  {
    id:'CAP-7', track:'terminale', title:'Fusion de journaux triés', duration:'60 min',
    focus:'diviser pour régner · récursivité · combinaison', level:3, kind:'application', modules:['T1','T7','T9'],
    document:'Plusieurs capteurs ont produit des journaux déjà triés par instant. Chaque journal est une liste d’entiers. On veut fusionner tous les journaux en une seule liste triée. Pour éviter une longue fusion séquentielle, la liste des journaux est divisée en deux groupes jusqu’à n’en avoir qu’un, puis les résultats sont combinés.',
    prompt:'Écris <code>fusion(a, b)</code> qui fusionne deux listes triées, puis <code>fusion_blocs(blocs, g=0, d=None)</code> qui traite récursivement l’intervalle de blocs [g, d[. Aucun slice n’est nécessaire : utilise les indices g, m et d.',
    starter:"def fusion(a, b):\n    pass\n\ndef fusion_blocs(blocs, g=0, d=None):\n    pass",
    tests:[
      {label:'fusion simple',expr:'fusion([1,4,9],[2,3,8]) == [1,2,3,4,8,9]'},
      {label:'aucun bloc',expr:'fusion_blocs([]) == []'},
      {label:'quatre blocs',expr:'fusion_blocs([[1,7],[2,8],[3,9],[4,5,6]]) == [1,2,3,4,5,6,7,8,9]'}
    ],
    hints:['fusion parcourt les deux listes avec deux indices.','Cas de base : aucun bloc ou un seul bloc dans [g, d[.','Avec m = (g+d)//2, résous gauche et droite puis fusionne les deux résultats.'],
    dialogue:['Quels sont les cas de base de fusion_blocs ?','Que représente chacun des deux appels récursifs ?','Pourquoi la fonction fusion est-elle l’étape de combinaison ?'],
    solution:"def fusion(a, b):\n    i = 0\n    j = 0\n    r = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            r.append(a[i])\n            i += 1\n        else:\n            r.append(b[j])\n            j += 1\n    while i < len(a):\n        r.append(a[i])\n        i += 1\n    while j < len(b):\n        r.append(b[j])\n        j += 1\n    return r\n\ndef fusion_blocs(blocs, g=0, d=None):\n    if d is None:\n        d = len(blocs)\n    if g == d:\n        return []\n    if d - g == 1:\n        return list(blocs[g])\n    m = (g + d) // 2\n    gauche = fusion_blocs(blocs, g, m)\n    droite = fusion_blocs(blocs, m, d)\n    return fusion(gauche, droite)"
  },
  {
    id:'CAP-8', track:'terminale', title:'Parcours d’un drone avec zones bloquées', duration:'60 min',
    focus:'programmation dynamique · état · dépendances · tests', level:3, kind:'application', modules:['T7','T10'],
    document:'Un drone se déplace sur des positions numérotées de 0 à n. Depuis une position, il peut avancer de 1 ou 2. Certaines positions sont bloquées et ne peuvent pas être occupées. On veut compter le nombre de façons d’atteindre chaque position. L’état choisi est dp[i] = nombre de parcours qui atteignent exactement i.',
    prompt:'Écris <code>table_chemins(n, bloques)</code> qui construit les états de 0 à n, avec <code>dp[0] = 1</code> et <code>dp[i] = 0</code> si i est bloquée. Sinon, dp[i] dépend de dp[i-1] et, si i ≥ 2, de dp[i-2]. Écris ensuite <code>nb_chemins(n, bloques)</code> qui renvoie l’état final.',
    starter:'def table_chemins(n, bloques):\n    pass\n\ndef nb_chemins(n, bloques):\n    pass',
    tests:[
      {label:'sans blocage',expr:'table_chemins(5, set()) == [1,1,2,3,5,8]'},
      {label:'position 2 bloquée',expr:'table_chemins(5, {2}) == [1,1,0,1,1,2]'},
      {label:'résultat final',expr:'nb_chemins(5, {2}) == 2'},
      {label:'arrivée bloquée',expr:'nb_chemins(4, {4}) == 0'}
    ],
    hints:['Commence par une liste dp de longueur n+1 remplie de 0.','Le cas initial dp[0] vaut 1.','Pour une position non bloquée, ajoute les états précédents qui existent.'],
    dialogue:['Que signifie précisément dp[i] ?','Pourquoi l’ordre croissant des positions est-il compatible avec les dépendances ?','Pourquoi stocker les résultats évite-t-il des recalculs par rapport à une récursion naïve ?'],
    solution:"def table_chemins(n, bloques):\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    for i in range(1, n + 1):\n        if i in bloques:\n            dp[i] = 0\n        else:\n            dp[i] = dp[i - 1]\n            if i >= 2:\n                dp[i] += dp[i - 2]\n    return dp\n\ndef nb_chemins(n, bloques):\n    return table_chemins(n, bloques)[n]"
  },
  {
    id:'CAP-9', track:'terminale', title:'Scanner une signature dans un flux texte', duration:'60 min',
    focus:'recherche textuelle · prétraitement · mauvais caractère · tests', level:3, kind:'application', modules:['T7','T11'],
    document:'Un outil de supervision recherche une signature textuelle dans plusieurs messages. Le motif reste identique pendant plusieurs recherches : son prétraitement doit donc pouvoir être calculé une seule fois puis réutilisé. La stratégie compare le motif de droite vers la gauche et utilise la règle du mauvais caractère.',
    prompt:'Écris <code>a_droite(motif)</code>, puis <code>premiere_position_preparee(texte, motif, table)</code> qui renvoie la première position du motif ou -1 en utilisant la table déjà calculée. Enfin, <code>premiere_position(texte, motif)</code> construit la table une fois puis appelle la version préparée.',
    starter:'def a_droite(motif):\n    pass\n\ndef premiere_position_preparee(texte, motif, table):\n    pass\n\ndef premiere_position(texte, motif):\n    pass',
    tests:[
      {label:'prétraitement',expr:"a_droite('ABACA') == {'A':4,'B':1,'C':3}"},
      {label:'saut utile',expr:"premiere_position('XYZABCD','ABCD') == 3"},
      {label:'absent',expr:"premiere_position('NSI PYTHON','JAVA') == -1"},
      {label:'motif vide',expr:"premiere_position('abc','') == 0"},
      {label:'table réutilisable',expr:"(lambda t: premiere_position_preparee('---ABCD---','ABCD',t) == 3 and premiere_position_preparee('xxABCD','ABCD',t) == 2)(a_droite('ABCD'))"}
    ],
    hints:['a_droite associe chaque caractère à son dernier indice dans le motif.','À chaque alignement, commence avec j = len(motif)-1.','Après un échec sur x = texte[i+j], avance de max(1, j - table.get(x, -1)).'],
    dialogue:['Pourquoi le prétraitement dépend-il du motif plutôt que du texte ?','Que représentent i et j au moment d’une comparaison ?','Pourquoi max(1, ...) est-il nécessaire pour garantir la progression ?'],
    solution:"def a_droite(motif):\n    table = {}\n    for j in range(len(motif)):\n        table[motif[j]] = j\n    return table\n\ndef premiere_position_preparee(texte, motif, table):\n    if motif == '':\n        return 0\n    p = len(motif)\n    i = 0\n    while i <= len(texte) - p:\n        j = p - 1\n        while j >= 0 and texte[i + j] == motif[j]:\n            j -= 1\n        if j < 0:\n            return i\n        x = texte[i + j]\n        i += max(1, j - table.get(x, -1))\n    return -1\n\ndef premiere_position(texte, motif):\n    table = a_droite(motif)\n    return premiere_position_preparee(texte, motif, table)"
  }
];
