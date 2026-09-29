export default [
  {
    moduleId:'P1',
    goal:'Comprendre ce que Python calcule puis mémorise, sans apprendre des recettes par cœur.',
    prerequisites:['Savoir lire une opération simple','Aucun prérequis de spécialité mathématiques'],
    vocabulary:[['affectation','Python calcule d’abord la partie droite, puis associe le résultat au nom de gauche.'],['expression','Un morceau de code qui produit une valeur.'],['type','La nature d’une valeur : entier, flottant, booléen, chaîne…']],
    harness:'Dans les exercices, les lignes def ... et return servent parfois de cadre de test. Tu n’as pas encore à savoir écrire une fonction seul : concentre-toi sur l’expression à compléter. Les fonctions seront étudiées en P4.',
    worked:{title:'Énergie d’un robot',problem:'Un robot possède 12 unités d’énergie et dépense 5 unités.',steps:[['1 · Repérer les données','Deux valeurs sont connues : 12 et 5.'],['2 · Choisir l’opération','L’énergie restante est obtenue par une soustraction.'],['3 · Nommer le résultat','Un nom lisible permet de suivre l’état du programme.']],code:'energie = 12\ncout = 5\nreste = energie - cout\nprint(reste)'},
    checks:[
      {q:'Après x = 3 puis x = x + 2, quelle est la valeur de x ?',options:['2','3','5','Erreur'],answer:2,explain:'La partie droite x + 2 est évaluée avec l’ancienne valeur 3, puis x reçoit 5.'},
      {q:'Dans score = bonus + 10, que fait Python en premier ?',options:['Il modifie score','Il calcule bonus + 10','Il affiche score','Il compare score et bonus'],answer:1,explain:'Une affectation se lit de droite à gauche : calculer, puis affecter.'},
      {q:'Le signe == sert à…',options:['affecter','comparer','additionner','convertir'],answer:1,explain:'= affecte une valeur ; == compare deux valeurs.'}
    ]
  },
  {
    moduleId:'P2',
    goal:'Transformer une règle en question vraie/fause puis choisir une branche.',
    prerequisites:['Affectations et comparaisons simples','Aucun calcul avancé'],
    vocabulary:[['booléen','Une valeur True ou False.'],['condition','Une expression booléenne utilisée pour décider.'],['branche','Le bloc de code exécuté selon le résultat du test.']],
    harness:'Le cadre def ... / return est fourni pour permettre les tests automatiques. Pour l’instant, focalise-toi sur les conditions if / elif / else et les expressions booléennes.',
    worked:{title:'Accès à une salle',problem:'L’accès est autorisé à partir de 16 ans, ou avec une autorisation.',steps:[['1 · Dire la règle en français','âge suffisant OU autorisation présente'],['2 · Traduire en booléen','age >= 16 or autorisation'],['3 · Tester les frontières','15, 16 et un cas avec autorisation']],code:"age = 15\nautorisation = True\nif age >= 16 or autorisation:\n    print('accès')\nelse:\n    print('refus')"},
    checks:[
      {q:'Avec age = 16, l’expression age >= 16 vaut…',options:['True','False','16','Erreur'],answer:0,explain:'La borne 16 est incluse grâce à >=.'},
      {q:'Dans if / elif / else, combien de branches sont exécutées au maximum ?',options:['Toutes','Deux','Une','Aucune dans tous les cas'],answer:2,explain:'Python s’arrête à la première condition vraie ; sinon il exécute else s’il existe.'},
      {q:'not True vaut…',options:['True','False','1','None'],answer:1,explain:'not inverse une valeur booléenne.'}
    ]
  },
  {
    moduleId:'P3',
    goal:'Répéter une action en sachant ce qui change à chaque tour et pourquoi la boucle s’arrête.',
    prerequisites:['Conditions simples','Listes déjà données dans les exemples'],
    vocabulary:[['compteur','Variable qui compte des événements.'],['accumulateur','Variable qui construit progressivement un total.'],['variant','Quantité qui évolue vers la fin d’une boucle while.']],
    harness:'Le cadre de fonction est encore fourni. La compétence visée ici est le raisonnement sur la boucle : initialisation, répétition, mise à jour et arrêt.',
    worked:{title:'Compter les messages non lus',problem:'Une liste contient les états de plusieurs messages.',steps:[['1 · Initialiser','Le compteur commence à 0.'],['2 · Parcourir','Examiner chaque état une fois.'],['3 · Mettre à jour seulement si nécessaire','Incrémenter uniquement pour "non lu".']],code:"etats = ['lu','non lu','lu','non lu']\ncompteur = 0\nfor etat in etats:\n    if etat == 'non lu':\n        compteur += 1\nprint(compteur)"},
    checks:[
      {q:'Un accumulateur de somme commence le plus souvent à…',options:['0','1','-1','la dernière valeur'],answer:0,explain:'0 est l’élément neutre de l’addition.'},
      {q:'Dans une boucle while, que faut-il vérifier en priorité ?',options:['Que rien ne change','Qu’une quantité rapproche de l’arrêt','Que print est utilisé','Que la liste est triée'],answer:1,explain:'Sans progression vers une condition fausse, la boucle peut être infinie.'},
      {q:'for x in [4,7,2] exécute son corps combien de fois ?',options:['2','3','4','7'],answer:1,explain:'Une fois par élément de la liste.'}
    ]
  },
  {
    moduleId:'P4',
    goal:'Décomposer un problème en fonctions avec un contrat clair et des tests utiles.',
    prerequisites:['Expressions, conditions et boucles','Lire un appel comme f(valeur)'],
    vocabulary:[['paramètre','Nom utilisé par la fonction pour recevoir une donnée.'],['return','Renvoie le résultat à l’endroit où la fonction a été appelée.'],['précondition','Hypothèse qui doit être vraie avant l’appel.']],
    worked:{title:'Nombre de points après bonus',problem:'On veut isoler le calcul dans une fonction réutilisable.',steps:[['1 · Définir les entrées','score et bonus deviennent des paramètres.'],['2 · Définir la sortie','La fonction renvoie une valeur, elle ne se contente pas de l’afficher.'],['3 · Tester','Choisir un cas normal et un cas frontière comme bonus = 0.']],code:'def score_final(score, bonus):\n    return score + bonus\n\nassert score_final(10, 4) == 14\nassert score_final(3, 0) == 3'},
    checks:[
      {q:'print(...) et return ont-ils le même rôle ?',options:['Oui','Non'],answer:1,explain:'print affiche ; return produit une valeur réutilisable par le programme.'},
      {q:'Quel test est particulièrement utile pour une fonction moyenne(tab) ?',options:['Seulement [10,12]','La liste vide','Seulement 1000 valeurs','Aucun'],answer:1,explain:'Le cas vide oblige à expliciter le contrat.'},
      {q:'assert sert principalement à…',options:['répéter','exprimer et vérifier une condition attendue','trier','convertir'],answer:1,explain:'Une assertion signale immédiatement qu’une hypothèse ou une propriété n’est pas respectée.'}
    ]
  },
  {
    moduleId:'P5',
    goal:'Parcourir un texte caractère par caractère et construire un nouveau résultat.',
    prerequisites:['Boucles for','Conditions simples'],
    vocabulary:[['indice','Position d’un caractère, à partir de 0.'],['immuable','Une chaîne existante ne se modifie pas caractère par caractère.'],['encodage','Façon de représenter les caractères par des nombres en mémoire.']],
    worked:{title:'Retirer les tirets',problem:'Construire une nouvelle chaîne sans modifier l’originale.',steps:[['1 · Préparer un résultat vide','On part de "".'],['2 · Examiner chaque caractère','La boucle for fournit les caractères un à un.'],['3 · Garder seulement ce qui convient','On concatène les caractères différents de "-".']],code:"texte = 'nsi-python'\nresultat = ''\nfor c in texte:\n    if c != '-':\n        resultat += c\nprint(resultat)"},
    checks:[
      {q:"'python'[0] vaut…",options:["'p'","'y'","'python'","Erreur"],answer:0,explain:'Le premier indice est 0.'},
      {q:'Pour transformer une chaîne, la stratégie la plus simple est souvent de…',options:['modifier chaque caractère sur place','construire une nouvelle chaîne','supprimer len','utiliser SQL'],answer:1,explain:'Les chaînes Python sont immuables.'},
      {q:'len("nsi") vaut…',options:['2','3','4','0'],answer:1,explain:'La chaîne contient trois caractères.'}
    ]
  },
  {
    moduleId:'P6',
    goal:'Manipuler une liste en comprenant les indices, la mutabilité et les copies.',
    prerequisites:['Boucles','Indices sur une séquence'],
    vocabulary:[['liste','Collection ordonnée et modifiable.'],['alias','Deux noms qui désignent le même objet.'],['compréhension','Écriture compacte pour construire une nouvelle liste à partir d’un parcours.']],
    worked:{title:'Augmenter tous les scores',problem:'Créer une nouvelle liste sans modifier la liste de départ.',steps:[['1 · Préparer une nouvelle liste','Le résultat est indépendant.'],['2 · Parcourir les valeurs','Chaque score est lu une fois.'],['3 · Ajouter la valeur transformée','append construit progressivement la nouvelle liste.']],code:'scores = [10, 12, 8]\nnouveaux = []\nfor score in scores:\n    nouveaux.append(score + 1)\nprint(scores)\nprint(nouveaux)'},
    checks:[
      {q:'Si b = a pour une liste, puis b.append(3), que devient a ?',options:['Elle ne change pas','Elle voit aussi le 3','Elle devient None','Erreur'],answer:1,explain:'a et b sont alors deux noms pour le même objet liste.'},
      {q:'Quel indice désigne le premier élément ?',options:['0','1','-1 uniquement','len(tab)'],answer:0,explain:'Les indices Python commencent à 0.'},
      {q:'Une compréhension de liste sert surtout à…',options:['déclarer une classe','construire une liste par parcours','ouvrir un fichier','faire une jointure SQL'],answer:1,explain:'Elle condense un schéma de construction de liste ; la boucle explicite reste la bonne base mentale.'}
    ]
  },
  {
    moduleId:'P7',
    goal:'Choisir entre tuple et dictionnaire selon la manière dont on veut retrouver les données.',
    prerequisites:['Listes et boucles','Fonctions simples'],
    vocabulary:[['tuple','Petit regroupement ordonné de valeurs.'],['dictionnaire','Association entre des clés et des valeurs.'],['clé','Identifiant utilisé pour retrouver une valeur.']],
    worked:{title:'Compter des rôles',problem:'Construire des fréquences à partir d’une liste de mots.',steps:[['1 · Partir d’un dictionnaire vide','Aucune fréquence n’est connue au départ.'],['2 · Initialiser une nouvelle clé','La première occurrence crée la clé avec 0.'],['3 · Incrémenter','Chaque occurrence ajoute 1.']],code:"roles = ['mage','tank','mage']\nf = {}\nfor role in roles:\n    if role not in f:\n        f[role] = 0\n    f[role] += 1\nprint(f)"},
    checks:[
      {q:'Dans d["Ada"] = 17, "Ada" est…',options:['une valeur','une clé','un indice obligatoire','un booléen'],answer:1,explain:'Le dictionnaire utilise une clé pour retrouver une valeur.'},
      {q:'Que renvoie typiquement une fonction qui écrit return a, b ?',options:['Deux fonctions','Un tuple','Un dictionnaire','Une erreur'],answer:1,explain:'Python regroupe ces valeurs dans un tuple.'},
      {q:'Pour parcourir à la fois clés et valeurs, on utilise souvent…',options:['d.items()','len(d) seulement','range(0)','sorted obligatoire'],answer:0,explain:'items() fournit des paires clé/valeur.'}
    ]
  },
  {
    moduleId:'P8',
    goal:'Passer de lignes de données à des opérations de filtrage, recherche et rapprochement.',
    prerequisites:['Listes','Dictionnaires','Boucles et conditions'],
    vocabulary:[['table','Collection de lignes partageant les mêmes champs.'],['CSV','Format texte où chaque ligne contient des champs séparés.'],['filtrer','Conserver seulement les lignes qui respectent un critère.']],
    worked:{title:'Lire un petit CSV',problem:'Observer comment un CSV devient une collection de dictionnaires.',steps:[['1 · Lire le texte CSV','Le module csv connaît la première ligne comme en-têtes.'],['2 · Construire les lignes','DictReader associe chaque champ à son nom.'],['3 · Convertir si nécessaire','Les nombres lus depuis le CSV arrivent d’abord sous forme de chaînes.']],code:"import csv, io\ndonnees = 'nom,note\\nAda,17\\nAlan,9'\ntable = list(csv.DictReader(io.StringIO(donnees)))\nadmis = [ligne['nom'] for ligne in table if int(ligne['note']) >= 10]\nprint(admis)"},
    checks:[
      {q:'Filtrer une table signifie…',options:['changer toutes les valeurs','conserver certaines lignes','trier obligatoirement','supprimer les clés'],answer:1,explain:'Un filtre sélectionne les lignes vérifiant un critère.'},
      {q:'Une ligne représentée par un dictionnaire permet d’accéder à note avec…',options:["ligne['note']",'ligne.note obligatoire','note(ligne)','ligne[0] uniquement'],answer:0,explain:'La clé du dictionnaire donne accès au champ.'},
      {q:'Après lecture CSV, faut-il parfois convertir un champ numérique ?',options:['Oui','Non, jamais'],answer:0,explain:'Un lecteur CSV fournit généralement du texte ; int(...) ou float(...) peut être nécessaire.'}
    ]
  },
  {
    moduleId:'P9',
    goal:'Reconnaître les grands schémas algorithmiques : parcours, recherche, tri et coût.',
    prerequisites:['Boucles','Listes','Fonctions'],
    vocabulary:[['parcours linéaire','Examiner les éléments les uns après les autres.'],['dichotomie','Éliminer une moitié de la zone de recherche à chaque étape.'],['coût','Nombre d’opérations qui grandit avec la taille des données.']],
    worked:{title:'Chercher un minimum',problem:'Trouver la plus petite valeur d’une liste non vide sans min().',steps:[['1 · Choisir un meilleur courant','Le premier élément est une référence valide.'],['2 · Parcourir le reste','Chaque nouvelle valeur est comparée au meilleur.'],['3 · Mettre à jour seulement si mieux','Le minimum courant diminue éventuellement.']],code:'tab = [7, 3, 9, 2]\nminimum = tab[0]\nfor i in range(1, len(tab)):\n    if tab[i] < minimum:\n        minimum = tab[i]\nprint(minimum)'},
    checks:[
      {q:'La dichotomie exige principalement que les données soient…',options:['triées','toutes positives','toutes différentes','dans un dictionnaire'],answer:0,explain:'Sans ordre, on ne sait pas quelle moitié éliminer.'},
      {q:'Un parcours qui regarde chaque élément une fois a un coût…',options:['constant','linéaire','toujours logarithmique','nul'],answer:1,explain:'Le nombre d’étapes grandit proportionnellement au nombre d’éléments.'},
      {q:'Dans un tri par sélection, à chaque position on cherche…',options:['le minimum de la partie restante','un mot','une clé SQL','une récursion'],answer:0,explain:'On place progressivement le bon élément à chaque position.'}
    ]
  },
  {
    moduleId:'T1',
    goal:'Voir la récursion comme une succession de problèmes plus petits, puis une remontée des résultats.',
    prerequisites:['Fonctions et conditions','Savoir identifier un cas simple'],
    vocabulary:[['cas de base','Situation qui arrête les appels.'],['appel récursif','La fonction s’appelle elle-même sur un problème plus petit.'],['pile d’appels','Mémoire des appels encore en attente de leur résultat.']],
    worked:{title:'Répéter un caractère',problem:'Construire récursivement une chaîne contenant n fois le même caractère.',steps:[['1 · Cas de base','Pour n = 0, le résultat est la chaîne vide.'],['2 · Réduire','Chaque appel travaille avec n - 1.'],['3 · Combiner','Ajouter un caractère au résultat du sous-problème.']],code:"def repete(c, n):\n    if n == 0:\n        return ''\n    return c + repete(c, n - 1)\n\nprint(repete('A', 3))"},
    checks:[
      {q:'Sans cas de base, une fonction récursive risque surtout…',options:['de trier','de ne jamais s’arrêter correctement','de devenir une classe','de lire un CSV'],answer:1,explain:'Il faut une situation qui cesse les appels.'},
      {q:'Dans repete(c, n-1), quel élément montre le progrès ?',options:['c','n-1','return seulement','le nom repete'],answer:1,explain:'n diminue et se rapproche du cas n == 0.'},
      {q:'La remontée commence…',options:['avant le premier appel','après avoir atteint le cas de base','uniquement avec for','jamais'],answer:1,explain:'Les appels en attente peuvent alors recevoir et combiner les résultats.'}
    ]
  },
  {
    moduleId:'T2',
    goal:'Modéliser un objet avec son état et les opérations qui agissent sur cet état.',
    prerequisites:['Fonctions','Listes utiles mais pas toujours nécessaires'],
    vocabulary:[['classe','Description commune à une famille d’objets.'],['attribut','Donnée stockée dans un objet.'],['méthode','Fonction attachée à une classe et appelée sur un objet.']],
    worked:{title:'Playlist',problem:'Représenter une playlist par son nom et ses titres.',steps:[['1 · Identifier l’état','nom et titres deviennent des attributs.'],['2 · Initialiser dans __init__','Chaque nouvel objet reçoit son propre état.'],['3 · Ajouter un comportement','Une méthode ajouter modifie la liste de l’objet courant.']],code:"class Playlist:\n    def __init__(self, nom):\n        self.nom = nom\n        self.titres = []\n\n    def ajouter(self, titre):\n        self.titres.append(titre)"},
    checks:[
      {q:'self désigne…',options:['la classe entière','l’objet courant','toujours une liste','Python lui-même'],answer:1,explain:'Une méthode utilise self pour accéder aux attributs de l’instance concernée.'},
      {q:'Deux instances d’une même classe peuvent-elles avoir des attributs différents ?',options:['Oui','Non'],answer:0,explain:'La classe donne la structure ; chaque instance possède son propre état.'},
      {q:'L’héritage est-il nécessaire pour réussir ce module NSI ?',options:['Oui','Non'],answer:1,explain:'Le cœur du programme porte sur classes, attributs, méthodes et objets.'}
    ]
  },
  {
    moduleId:'T3',
    goal:'Choisir une structure LIFO ou FIFO à partir du comportement attendu, pas de son nom.',
    prerequisites:['Listes','Classes simples'],
    vocabulary:[['pile','Dernier entré, premier sorti : LIFO.'],['file','Premier entré, premier sorti : FIFO.'],['interface','Ensemble des opérations promises indépendamment de l’implémentation.']],
    worked:{title:'Historique de navigation',problem:'Le bouton Retour doit reprendre la dernière page visitée.',steps:[['1 · Observer le besoin','On veut récupérer le dernier élément ajouté.'],['2 · Choisir LIFO','Une pile correspond au comportement recherché.'],['3 · Implémenter simplement','append empile et pop() dépile en fin de liste.']],code:"pile = []\npile.append('accueil')\npile.append('cours')\npile.append('exercice')\nprint(pile.pop())"},
    checks:[
      {q:'Une pile suit l’ordre…',options:['FIFO','LIFO','aléatoire','trié'],answer:1,explain:'Le dernier élément empilé est le premier dépilé.'},
      {q:'Une file convient mieux à…',options:['un bouton Annuler','une file d’attente de tickets','un appel récursif seulement','un ABR'],answer:1,explain:'Les tickets doivent généralement être traités dans l’ordre d’arrivée.'},
      {q:'Deux implémentations différentes peuvent-elles respecter la même interface ?',options:['Oui','Non'],answer:0,explain:'C’est précisément l’intérêt d’un type abstrait.'}
    ]
  },
  {
    moduleId:'T4',
    goal:'Lire un arbre comme un nœud plus deux sous-arbres et exploiter cette structure récursivement.',
    prerequisites:['Récursivité','Classes simples'],
    vocabulary:[['racine','Premier nœud de l’arbre.'],['feuille','Nœud sans enfant.'],['sous-arbre','Arbre situé à gauche ou à droite d’un nœud.']],
    worked:{title:'Compter les nœuds',problem:'Calculer la taille d’un arbre binaire.',steps:[['1 · Traiter le vide','Un arbre None contient 0 nœud.'],['2 · Compter le nœud courant','Un nœud non vide compte pour 1.'],['3 · Ajouter les sous-arbres','La taille totale est 1 + gauche + droite.']],code:'def taille(a):\n    if a is None:\n        return 0\n    return 1 + taille(a.gauche) + taille(a.droite)'},
    checks:[
      {q:'La taille de l’arbre vide vaut…',options:['0','1','-1','None'],answer:0,explain:'Il ne contient aucun nœud.'},
      {q:'Un parcours infixe traite dans l’ordre…',options:['nœud-gauche-droite','gauche-nœud-droite','gauche-droite-nœud','largeur seulement'],answer:1,explain:'Infixe = gauche, nœud, droite.'},
      {q:'Dans un ABR, si x est plus petit que le nœud courant, on poursuit…',options:['à gauche','à droite','des deux côtés obligatoirement','nulle part'],answer:0,explain:'La propriété d’ordre permet d’éliminer l’autre sous-arbre.'}
    ]
  },
  {
    moduleId:'T5',
    goal:'Parcourir un réseau sans revisiter indéfiniment les mêmes sommets.',
    prerequisites:['Dictionnaires','Piles et files'],
    vocabulary:[['sommet','Élément du graphe.'],['arête','Lien entre deux sommets.'],['visités','Ensemble qui mémorise les sommets déjà découverts.']],
    worked:{title:'Explorer par niveaux',problem:'Visiter un graphe non pondéré avec un parcours en largeur.',steps:[['1 · Initialiser la frontière','La file contient le départ.'],['2 · Marquer les découvertes','Un sommet est enregistré comme visité avant de l’enfiler.'],['3 · Développer les voisins','Chaque sommet sort de la file puis ajoute ses voisins nouveaux.']],code:"g = {'A':['B','C'],'B':['D'],'C':[],'D':[]}\nfile = ['A']\nvisites = {'A'}\nwhile file:\n    s = file.pop(0)\n    for v in g[s]:\n        if v not in visites:\n            visites.add(v)\n            file.append(v)"},
    checks:[
      {q:'BFS utilise naturellement…',options:['une pile','une file','un entier seulement','une requête SQL'],answer:1,explain:'La file conserve l’ordre de découverte par niveaux.'},
      {q:'Pourquoi mémoriser les sommets visités ?',options:['Pour trier','Pour éviter revisites et cycles infinis','Pour convertir en chaîne','Pour créer une classe'],answer:1,explain:'Un graphe peut contenir des cycles.'},
      {q:'Dans un graphe non pondéré, BFS permet notamment de trouver…',options:['une distance minimale en nombre d’arêtes','la moyenne','une clé primaire','un tri fusion'],answer:0,explain:'La première découverte d’un sommet se fait par un chemin de longueur minimale.'}
    ]
  },
  {
    moduleId:'T6',
    goal:'Relier le modèle relationnel à des requêtes précises et sûres.',
    prerequisites:['Tables et dictionnaires','Lire une expression booléenne'],
    vocabulary:[['clé primaire','Attribut qui identifie de manière unique une ligne.'],['clé étrangère','Attribut qui référence une ligne d’une autre relation.'],['jointure','Opération qui rapproche des lignes liées par des clés.']],
    worked:{title:'Retrouver un élève par identifiant',problem:'Construire une requête paramétrée plutôt que concaténer une saisie.',steps:[['1 · Choisir les colonnes','SELECT nom limite le résultat à l’information utile.'],['2 · Filtrer','WHERE id = ? place un paramètre.'],['3 · Séparer donnée et requête','La valeur est transmise à execute séparément.']],code:"requete = 'SELECT nom FROM eleve WHERE id = ?'\ncur.execute(requete, (7,))\nligne = cur.fetchone()"},
    checks:[
      {q:'Une clé primaire sert à…',options:['identifier une ligne','chiffrer','trier automatiquement','remplacer SQL'],answer:0,explain:'Elle fournit un identifiant unique au sein de la relation.'},
      {q:'Une clé étrangère sert à…',options:['relier des relations','faire une boucle','créer une classe','calculer une moyenne'],answer:0,explain:'Elle référence une clé d’une autre relation.'},
      {q:'Pourquoi utiliser des paramètres SQL ?',options:['Pour séparer les données de la requête','Pour rendre SQL récursif','Pour supprimer WHERE','Pour éviter les tables'],answer:0,explain:'On évite de fabriquer la requête en concaténant directement une entrée utilisateur.'}
    ]
  },
  {
    moduleId:'T7',
    goal:'Déboguer méthodiquement : reproduire, réduire, localiser, corriger puis protéger par un test.',
    prerequisites:['Fonctions','Objets mutables','Tests'],
    vocabulary:[['régression','Bug qui réapparaît après une modification.'],['effet de bord','Modification d’un état extérieur au résultat retourné.'],['cas minimal','Plus petite entrée qui reproduit le problème.']],
    worked:{title:'Bug d’alias',problem:'Une fonction double des valeurs mais ne doit pas modifier sa liste d’entrée.',steps:[['1 · Reproduire','Choisir une petite liste [1,2].'],['2 · Observer l’état avant/après','Vérifier aussi la liste d’origine, pas seulement le résultat.'],['3 · Corriger la cause','Créer une copie indépendante avant modification.']],code:'def double_sans_modifier(tab):\n    resultat = list(tab)\n    for i in range(len(resultat)):\n        resultat[i] *= 2\n    return resultat'},
    checks:[
      {q:'Quand un test échoue, la meilleure première action est…',options:['tout réécrire','reproduire avec un petit cas et lire l’écart','supprimer les tests','ajouter des lignes au hasard'],answer:1,explain:'Un cas minimal réduit l’incertitude.'},
      {q:'Un test de régression sert à…',options:['empêcher le retour d’un bug connu','accélérer Internet','créer SQL','remplacer le code'],answer:0,explain:'On conserve un test qui échouait avant la correction.'},
      {q:'resultat = tab crée souvent…',options:['une copie profonde','un alias','un tuple','une exception'],answer:1,explain:'Les deux noms peuvent désigner le même objet mutable.'}
    ]
  },
  {
    moduleId:'T8',
    goal:'Comprendre qu’une fonction peut être manipulée comme une donnée et comparer plusieurs styles de programmation.',
    prerequisites:['Fonctions','Boucles'],
    vocabulary:[['fonction comme valeur','On peut stocker ou transmettre une fonction sans l’appeler immédiatement.'],['paradigme','Style d’organisation d’un programme.'],['indécidable','Problème pour lequel aucun algorithme universel ne peut toujours répondre correctement.']],
    worked:{title:'Appliquer une fonction',problem:'Passer une fonction de transformation à une autre fonction.',steps:[['1 · Recevoir la fonction','Le paramètre f contient une fonction, pas son résultat.'],['2 · Parcourir les données','Chaque valeur est traitée.'],['3 · Appeler f(x)','Le comportement dépend de la fonction fournie.']],code:'def applique(f, valeurs):\n    resultat = []\n    for x in valeurs:\n        resultat.append(f(x))\n    return resultat\n\ndef double(x):\n    return 2*x'},
    checks:[
      {q:'Dans applique(double, [1,2]), double est transmis…',options:['sans être appelé immédiatement','comme une chaîne','comme une classe obligatoirement','comme une erreur'],answer:0,explain:'Le nom de la fonction désigne une valeur fonction.'},
      {q:'compose(f,g)(x) signifie généralement…',options:['f(g(x))','f(x)+g(x) toujours','g seulement','aucun appel'],answer:0,explain:'La composition applique d’abord g puis f.'},
      {q:'Le problème de l’arrêt montre qu’il existe des problèmes…',options:['toujours faciles','indécidables','uniquement numériques','sans programmes'],answer:1,explain:'Il n’existe pas d’algorithme universel décidant correctement l’arrêt pour tout programme et toute entrée.'}
    ]
  },
  {
    moduleId:'T9',
    goal:'Découper un problème en sous-problèmes, puis recombiner sans perdre de vue le coût.',
    prerequisites:['Récursivité','Listes','Boucles'],
    vocabulary:[['diviser','Découper le problème en parties plus petites.'],['régner','Résoudre les sous-problèmes.'],['combiner','Assembler les solutions partielles.']],
    worked:{title:'Fusionner deux listes triées',problem:'Construire une seule liste triée à partir de deux listes déjà triées.',steps:[['1 · Pointer les deux débuts','i et j désignent les éléments courants.'],['2 · Prendre le plus petit','Une comparaison décide quel pointeur avance.'],['3 · Ajouter les restes','Quand une liste est épuisée, recopier l’autre.']],code:'def fusion(a, b):\n    i = j = 0\n    r = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            r.append(a[i]); i += 1\n        else:\n            r.append(b[j]); j += 1\n    return r + a[i:] + b[j:]'},
    checks:[
      {q:'Le tri fusion suit principalement quelle stratégie ?',options:['Diviser pour régner','Recherche linéaire uniquement','FIFO','SQL'],answer:0,explain:'Il découpe, trie récursivement puis fusionne.'},
      {q:'Pourquoi fusion est-elle efficace sur deux listes déjà triées ?',options:['On compare seulement les éléments courants','On retrie tout à chaque étape','On utilise une base SQL','On ignore l’ordre'],answer:0,explain:'L’ordre permet d’avancer sans revenir en arrière.'},
      {q:'n log n grandit généralement moins vite que…',options:['n²','n','1','0'],answer:0,explain:'C’est l’intérêt du tri fusion face à des tris quadratiques pour de grandes tailles.'}
    ]
  },
  {
    moduleId:'T10',
    goal:'Éviter les recalculs en mémorisant les solutions de sous-problèmes déjà rencontrés.',
    prerequisites:['Listes ou dictionnaires','Boucles ou récursivité'],
    vocabulary:[['mémoïsation','Mémoriser les résultats calculés à la demande.'],['bottom-up','Construire les solutions des petits cas vers les grands.'],['sous-problème','Version plus petite d’un problème dont la solution peut être réutilisée.']],
    worked:{title:'Nombre de façons d’atteindre une étape',problem:'On fournit la règle : chaque état dépend des deux états précédents.',steps:[['1 · Donner les cas initiaux','Les deux premières valeurs sont connues.'],['2 · Construire dans l’ordre','Chaque nouvelle valeur réutilise deux valeurs déjà calculées.'],['3 · Ne calculer qu’une fois','La liste dp mémorise les résultats.']],code:'def suite(n):\n    if n <= 1:\n        return n\n    dp = [0, 1]\n    for i in range(2, n + 1):\n        dp.append(dp[i-1] + dp[i-2])\n    return dp[n]'},
    checks:[
      {q:'La programmation dynamique est utile surtout quand…',options:['les mêmes sous-problèmes reviennent','aucune donnée ne se répète','on interdit toute mémoire','on ne peut pas boucler'],answer:0,explain:'Mémoriser évite de recalculer les mêmes résultats.'},
      {q:'Dans une approche bottom-up, on commence par…',options:['les petits cas connus','le cas le plus grand uniquement','SQL','une pile vide sans règle'],answer:0,explain:'On construit progressivement les solutions.'},
      {q:'Un tableau dp sert principalement à…',options:['mémoriser des résultats intermédiaires','afficher du HTML','déclarer une classe','trier des chaînes automatiquement'],answer:0,explain:'Les sous-solutions restent disponibles pour les étapes suivantes.'}
    ]
  },
  {
    moduleId:'T11',
    goal:'Comprendre comment l’information d’un échec peut éviter des comparaisons inutiles en recherche textuelle.',
    prerequisites:['Chaînes','Dictionnaires','Boucles'],
    vocabulary:[['motif','Chaîne recherchée dans un texte.'],['alignement','Position à laquelle on compare le motif au texte.'],['décalage','Nombre de positions dont on avance le motif après un échec.']],
    worked:{title:'Recherche naïve sans slice',problem:'Trouver toutes les positions d’un motif par comparaison caractère par caractère.',steps:[['1 · Essayer chaque départ possible','i parcourt les alignements valides.'],['2 · Comparer les caractères','j parcourt le motif.'],['3 · Exploiter le premier échec','On arrête l’alignement courant dès qu’un caractère diffère.']],code:"def positions(texte, motif):\n    resultat = []\n    for i in range(len(texte)-len(motif)+1):\n        ok = True\n        for j in range(len(motif)):\n            if texte[i+j] != motif[j]:\n                ok = False\n                break\n        if ok:\n            resultat.append(i)\n    return resultat"},
    checks:[
      {q:'La recherche naïve avance généralement le motif de…',options:['une position','toujours dix','la moitié du texte','zéro'],answer:0,explain:'Elle teste les alignements successifs.'},
      {q:'Boyer-Moore cherche à utiliser…',options:['l’information fournie par les échecs','une base SQL','une pile obligatoire','des flottants'],answer:0,explain:'Les caractères ayant provoqué un échec peuvent permettre un décalage plus grand.'},
      {q:'Une table de dernière occurrence associe un caractère à…',options:['son dernier indice dans le motif','la longueur du texte uniquement','un booléen aléatoire','une ligne SQL'],answer:0,explain:'Cette information sert à calculer certains décalages.'}
    ]
  }
];
