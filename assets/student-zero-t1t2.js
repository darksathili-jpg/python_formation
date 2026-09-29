// V1.14 — Student Zero Gate T1 → T2
// Transition from function/call reasoning to the object model required in Terminale NSI.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT1T2(modules, practiceBank, primmBank, noviceBank) {
  const t2 = modules.find(module => module.id === 'T2');
  if (!t2) return;

  t2.duration = '120 min';
  t2.summary = 'Passer des fonctions aux objets : distinguer classe et instance, stocker un état dans des attributs et écrire des méthodes qui agissent sur l’objet courant.';
  t2.bo = 'Vocabulaire de la programmation objet : classes, attributs, méthodes, objets';
  t2.objectives = [
    'Distinguer sans ambiguïté une classe et une instance (objet)',
    'Comprendre le rôle de __init__ et de self',
    'Distinguer paramètre, variable locale et attribut d’instance',
    'Écrire une méthode qui consulte ou modifie l’état de l’objet courant',
    'Vérifier que deux instances possèdent des états indépendants'
  ];

  t2.lessons = [
    {
      title: 'Transition T1 → T2 : on change de modèle mental',
      html: 'En T1, on suivait surtout des <strong>appels de fonctions</strong> et leurs paramètres temporaires. En T2, on veut représenter des entités qui conservent un <strong>état</strong> entre plusieurs opérations. Une classe regroupe alors les données utiles — les attributs — et les opérations qui leur donnent du sens — les méthodes.',
      code: "# En Première, tu utilisais déjà des objets sans les nommer ainsi.\nnotes = [12, 17]\nnotes.append(14)\n\n# notes est un objet de type list.\n# append est une méthode appelée sur cet objet."
    },
    {
      title: 'Classe ≠ objet : le plan et les exemplaires',
      html: 'Une <strong>classe</strong> décrit une famille d’objets. Une <strong>instance</strong> — ou objet — est un exemplaire concret créé à partir de cette classe. Le nom de la variable qui référence l’objet n’est pas le nom de la classe et deux instances d’une même classe peuvent contenir des valeurs différentes.',
      code: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np1 = Point(2, 3)\np2 = Point(8, 1)\n\nprint(p1.x)  # 2\nprint(p2.x)  # 8"
    },
    {
      title: '__init__ initialise chaque nouvel objet',
      html: 'Lorsqu’on écrit <code>Point(2, 3)</code>, Python crée une nouvelle instance puis exécute <code>__init__</code> pour lui donner son état initial. Les paramètres <code>x</code> et <code>y</code> n’existent que pendant cet appel ; les attributs <code>self.x</code> et <code>self.y</code> restent attachés à l’objet après la fin de l’appel.',
      code: "class Badge:\n    def __init__(self, nom, points):\n        self.nom = nom\n        self.points = points\n\nb = Badge('Python', 10)\nprint(b.nom, b.points)"
    },
    {
      title: 'self désigne l’objet courant',
      html: '<code>self</code> n’est ni la classe entière, ni un mot magique contenant tous les objets. Dans une méthode, <code>self</code> représente <strong>l’instance sur laquelle la méthode est appelée</strong>. Pour <code>a.ajouter(5)</code>, le <code>self</code> de <code>ajouter</code> désigne donc <code>a</code>.',
      code: "class Compteur:\n    def __init__(self, valeur):\n        self.valeur = valeur\n\n    def ajouter(self, n):\n        self.valeur = self.valeur + n\n\na = Compteur(10)\nb = Compteur(3)\na.ajouter(5)\nprint(a.valeur, b.valeur)  # 15 3"
    },
    {
      title: 'Variable locale ≠ attribut',
      html: 'Une variable locale vit pendant l’exécution d’une fonction ou d’une méthode. Un attribut d’instance appartient à l’objet et reste disponible après l’appel. Oublier <code>self.</code> peut donc faire calculer une valeur temporaire sans modifier l’état de l’objet.',
      code: "class Energie:\n    def __init__(self, niveau):\n        self.niveau = niveau\n\n    def depenser(self, cout):\n        niveau = self.niveau - cout   # local seulement : mauvais si l’on veut modifier l’objet\n        self.niveau = self.niveau - cout  # attribut : l’état de l’objet change"
    },
    {
      title: 'Une méthode agit sur le bon objet',
      html: 'Une méthode peut lire les attributs, en modifier certains et éventuellement renvoyer une valeur. Après <code>compte.deposer(7)</code>, on vérifie l’effet sur <code>compte.solde</code>. Il est important de distinguer <strong>modifier l’état</strong> et <strong>renvoyer un résultat</strong> : les deux ne sont pas synonymes.',
      code: "class Compte:\n    def __init__(self, solde):\n        self.solde = solde\n\n    def deposer(self, montant):\n        self.solde += montant\n\nc = Compte(10)\nc.deposer(7)\nprint(c.solde)  # 17"
    },
    {
      title: 'Deux instances : deux états à tester séparément',
      html: 'La classe est commune mais chaque instance doit posséder son propre état d’instance. Un bon test crée souvent deux objets, agit sur un seul et vérifie que l’autre n’a pas changé. Cela évite de confondre ce qui appartient à un objet précis avec ce qui serait partagé.',
      code: "a = Compte(10)\nb = Compte(10)\na.deposer(5)\nassert a.solde == 15\nassert b.solde == 10"
    },
    {
      title: 'Un objet peut contenir ou recevoir un autre objet',
      html: 'Les objets peuvent être composés : un segment peut mémoriser deux objets <code>Point</code>, et une méthode peut recevoir un autre objet en paramètre. On accède alors explicitement à l’état de chaque instance : <code>self.score</code> pour l’objet courant, <code>autre.score</code> pour l’autre objet.',
      code: "class Joueur:\n    def __init__(self, nom, score):\n        self.nom = nom\n        self.score = score\n\n    def gagne_contre(self, autre):\n        return self.score > autre.score"
    },
    {
      title: 'Périmètre NSI : rester sur le vocabulaire réellement attendu',
      html: 'Le cœur attendu ici est : <strong>classe, objet/instance, attribut, méthode, __init__, self</strong>. L’héritage et le polymorphisme sont explicitement hors du cœur du programme ; ils ne sont donc ni prérequis ni utilisés pour réussir les exercices. Les méthodes spéciales autres que <code>__init__</code> et les mécanismes complexes d’encapsulation ne sont pas nécessaires dans ce parcours.'
    }
  ];

  const e1 = byId(t2.exercises, 'T2-E1');
  Object.assign(e1, {
    title: 'Point : créer l’état d’une instance',
    level: 1,
    prompt: 'Complète <code>__init__</code> de la classe <code>Point</code>. À la création de <code>Point(x, y)</code>, l’objet doit conserver l’abscisse reçue dans <code>self.x</code> et l’ordonnée reçue dans <code>self.y</code>.',
    starter: "class Point:\n    def __init__(self, x, y):\n        self.x = ____________\n        self.y = ____________",
    tests: [
      {label:'abscisse', expr:'Point(2, 3).x == 2'},
      {label:'ordonnée', expr:'Point(2, 3).y == 3'},
      {label:'autre instance', expr:'Point(8, 1).x == 8 and Point(8, 1).y == 1'}
    ],
    hints: [
      'Le paramètre x doit être mémorisé dans l’attribut self.x.',
      'Même principe pour y : self.y = y.'
    ],
    solution: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y"
  });

  const e2 = byId(t2.exercises, 'T2-E2');
  Object.assign(e2, {
    title: 'Compte : une méthode modifie l’état',
    level: 2,
    prompt: 'La classe <code>Compte</code> possède un attribut d’instance <code>solde</code>. Complète la méthode <code>deposer(montant)</code> pour ajouter <code>montant</code> au solde de l’objet sur lequel la méthode est appelée. La méthode modifie l’objet ; aucun affichage n’est demandé.',
    starter: "class Compte:\n    def __init__(self, solde):\n        self.solde = solde\n\n    def deposer(self, montant):\n        # Modifie l'attribut de l'objet courant.\n        pass",
    tests: [
      {label:'état initial', expr:'Compte(10).solde == 10'},
      {label:'dépôt', expr:"(lambda c: (c.deposer(7), c.solde)[1])(Compte(10)) == 17"},
      {label:'instances indépendantes', expr:"(lambda a,b: (a.deposer(5), a.solde == 15 and b.solde == 10)[1])(Compte(10), Compte(10)) is True"}
    ],
    hints: [
      'Dans deposer, self désigne le Compte précis qui a reçu l’appel.',
      'Modifie self.solde avec le montant reçu : self.solde += montant.'
    ],
    solution: "class Compte:\n    def __init__(self, solde):\n        self.solde = solde\n\n    def deposer(self, montant):\n        self.solde += montant"
  });

  const e3 = byId(t2.exercises, 'T2-E3');
  Object.assign(e3, {
    title: 'Segment : composer des objets',
    level: 3,
    prompt: 'La classe <code>Point</code> est fournie. Crée la classe <code>Segment</code> : son constructeur reçoit deux objets <code>Point</code> nommés <code>a</code> et <code>b</code> et les mémorise dans <code>self.a</code> et <code>self.b</code>. La méthode <code>longueur_carre()</code> doit renvoyer <code>dx*dx + dy*dy</code> avec <code>dx = self.b.x - self.a.x</code> et <code>dy = self.b.y - self.a.y</code>. La formule est fournie : aucune connaissance de géométrie n’est évaluée.',
    starter: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\nclass Segment:\n    def __init__(self, a, b):\n        # Mémorise les deux objets Point.\n        pass\n\n    def longueur_carre(self):\n        # Utilise les attributs x et y des deux Points.\n        pass",
    tests: [
      {label:'points (0,0) et (3,4)', expr:'Segment(Point(0,0), Point(3,4)).longueur_carre() == 25'},
      {label:'segment horizontal', expr:'Segment(Point(2,5), Point(7,5)).longueur_carre() == 25'},
      {label:'même point', expr:'Segment(Point(4,4), Point(4,4)).longueur_carre() == 0'}
    ],
    hints: [
      'Dans __init__, écris self.a = a et self.b = b.',
      'Calcule dx et dy à partir des attributs des deux objets Point.',
      'La valeur demandée est dx*dx + dy*dy.'
    ],
    solution: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\nclass Segment:\n    def __init__(self, a, b):\n        self.a = a\n        self.b = b\n\n    def longueur_carre(self):\n        dx = self.b.x - self.a.x\n        dy = self.b.y - self.a.y\n        return dx * dx + dy * dy"
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T2');
  const x1 = byId(practice, 'T2-X1');
  Object.assign(x1, {
    title: 'Avatar : paramètres → attributs',
    kind: 'compléter',
    level: 1,
    prompt: 'Complète <code>Avatar.__init__</code> : chaque nouvel avatar doit conserver son <code>nom</code> et son <code>energie</code> dans deux attributs d’instance. Les paramètres disparaissent après l’appel ; les attributs doivent rester accessibles sur l’objet.',
    starter: "class Avatar:\n    def __init__(self, nom, energie):\n        self.nom = ____________\n        self.energie = ____________",
    tests: [
      {label:'nom', expr:"Avatar('Ada', 10).nom == 'Ada'"},
      {label:'énergie', expr:"Avatar('Ada', 10).energie == 10"}
    ],
    hints: ['À droite, utilise les paramètres reçus : nom puis energie.'],
    solution: "class Avatar:\n    def __init__(self, nom, energie):\n        self.nom = nom\n        self.energie = energie"
  });

  const x2 = byId(practice, 'T2-X2');
  Object.assign(x2, {
    title: 'Playlist : état + deux méthodes',
    kind: 'écrire',
    level: 2,
    prompt: 'Complète la classe <code>Playlist</code>. Chaque instance possède sa propre liste <code>titres</code>, vide au départ. <code>ajouter(titre)</code> ajoute un titre dans cette liste et <code>nb_titres()</code> renvoie le nombre de titres de cette instance.',
    starter: "class Playlist:\n    def __init__(self):\n        self.titres = []\n\n    def ajouter(self, titre):\n        pass\n\n    def nb_titres(self):\n        pass",
    tests: [
      {label:'vide au départ', expr:'Playlist().nb_titres() == 0'},
      {label:'deux titres', expr:"(lambda p: (p.ajouter('A'), p.ajouter('B'), p.nb_titres())[2])(Playlist()) == 2"},
      {label:'instances indépendantes', expr:"(lambda a,b: (a.ajouter('A'), a.nb_titres() == 1 and b.nb_titres() == 0)[1])(Playlist(), Playlist()) is True"}
    ],
    hints: ['ajouter agit sur self.titres.', 'nb_titres renvoie len(self.titres).'],
    solution: "class Playlist:\n    def __init__(self):\n        self.titres = []\n\n    def ajouter(self, titre):\n        self.titres.append(titre)\n\n    def nb_titres(self):\n        return len(self.titres)"
  });

  const x3 = byId(practice, 'T2-X3');
  Object.assign(x3, {
    title: 'Déboguer : local ou attribut ?',
    kind: 'déboguer',
    level: 2,
    prompt: 'Le constructeur crée actuellement une variable locale <code>valeurs</code> au lieu d’un attribut. Après la fin de <code>__init__</code>, la méthode <code>ajouter</code> ne trouve donc pas l’état attendu. Corrige le minimum de code afin que chaque <code>Compteur</code> possède sa propre liste <code>self.valeurs</code>.',
    starter: "class Compteur:\n    def __init__(self):\n        valeurs = []  # défaut : variable locale\n\n    def ajouter(self, x):\n        self.valeurs.append(x)",
    tests: [
      {label:'ajout mémorisé', expr:"(lambda c: (c.ajouter(4), c.valeurs == [4])[1])(Compteur()) is True"},
      {label:'deux objets indépendants', expr:"(lambda a,b: (a.ajouter(1), a.valeurs == [1] and b.valeurs == [])[1])(Compteur(), Compteur()) is True"}
    ],
    hints: ['Une variable locale valeurs n’est pas stockée dans l’objet.', 'Dans __init__, remplace valeurs = [] par self.valeurs = [].'],
    solution: "class Compteur:\n    def __init__(self):\n        self.valeurs = []\n\n    def ajouter(self, x):\n        self.valeurs.append(x)"
  });

  const x4 = byId(practice, 'T2-X4');
  Object.assign(x4, {
    title: 'Capteur : construire une petite classe complète',
    kind: 'écrire',
    level: 2,
    prompt: 'Complète <code>Capteur</code>. Le constructeur mémorise <code>nom</code> et crée une liste <code>mesures</code> vide. <code>ajouter(valeur)</code> ajoute une mesure. <code>derniere()</code> renvoie <code>None</code> si aucune mesure n’existe, sinon la dernière valeur enregistrée.',
    starter: "class Capteur:\n    def __init__(self, nom):\n        # Initialise les deux attributs.\n        pass\n\n    def ajouter(self, valeur):\n        pass\n\n    def derniere(self):\n        pass",
    tests: [
      {label:'aucune mesure', expr:"Capteur('T').derniere() is None"},
      {label:'dernière mesure', expr:"(lambda c: (c.ajouter(3), c.ajouter(8), c.derniere())[2])(Capteur('T')) == 8"}
    ],
    hints: ['self.mesures commence à [].', 'Si len(self.mesures) == 0, renvoie None.', 'Sinon, le dernier indice vaut len(self.mesures) - 1.'],
    solution: "class Capteur:\n    def __init__(self, nom):\n        self.nom = nom\n        self.mesures = []\n\n    def ajouter(self, valeur):\n        self.mesures.append(valeur)\n\n    def derniere(self):\n        if len(self.mesures) == 0:\n            return None\n        return self.mesures[len(self.mesures) - 1]"
  });

  const x5 = byId(practice, 'T2-X5');
  Object.assign(x5, {
    title: 'Deux objets : self et autre',
    kind: 'transfert',
    level: 3,
    prompt: 'Crée la classe <code>Joueur</code> avec les attributs d’instance <code>nom</code> et <code>score</code>. La méthode <code>gagne_contre(autre)</code> reçoit un second objet <code>Joueur</code> et renvoie <code>True</code> seulement si <code>self.score</code> est strictement supérieur à <code>autre.score</code>. En cas d’égalité, elle renvoie <code>False</code>.',
    starter: "class Joueur:\n    def __init__(self, nom, score):\n        pass\n\n    def gagne_contre(self, autre):\n        pass",
    tests: [
      {label:'victoire', expr:"Joueur('A', 10).gagne_contre(Joueur('B', 8)) is True"},
      {label:'défaite', expr:"Joueur('A', 6).gagne_contre(Joueur('B', 8)) is False"},
      {label:'égalité', expr:"Joueur('A', 10).gagne_contre(Joueur('B', 10)) is False"}
    ],
    hints: ['Dans __init__, mémorise nom et score avec self.', 'Dans la méthode, compare self.score à autre.score.'],
    solution: "class Joueur:\n    def __init__(self, nom, score):\n        self.nom = nom\n        self.score = score\n\n    def gagne_contre(self, autre):\n        return self.score > autre.score"
  });

  const primm = primmBank.find(item => item.moduleId === 'T2');
  if (primm) Object.assign(primm, {
    title: 'Deux objets, deux états',
    seed: "class Compteur:\n    def __init__(self, valeur):\n        self.valeur = valeur\n\n    def ajouter(self, n):\n        self.valeur += n\n\na = Compteur(10)\nb = Compteur(3)\na.ajouter(5)\nprint(a.valeur, b.valeur)",
    predict: 'Sans exécuter, prédis exactement les deux nombres affichés. Explique quel objet est désigné par self pendant l’appel a.ajouter(5).',
    investigate: [
      'Combien d’instances de Compteur existent après les deux constructions ?',
      'Pourquoi modifier a.valeur ne change-t-il pas b.valeur ?',
      'Quelle différence fais-tu entre le paramètre valeur de __init__ et l’attribut self.valeur ?'
    ],
    modify: 'Ajoute une méthode retirer(n) qui diminue uniquement la valeur de l’objet qui reçoit l’appel, puis vérifie-la sur a sans modifier b.',
    make: 'Crée une classe Badge avec un attribut nom, un attribut points et une méthode ajouter(points) ; crée deux badges et montre par un test que leurs états restent indépendants.'
  });

  const novice = noviceBank.find(item => item.moduleId === 'T2');
  if (novice) Object.assign(novice, {
    goal: 'Construire un modèle mental précis : une classe décrit, une instance existe, ses attributs mémorisent son état et ses méthodes agissent sur cet état via self.',
    prerequisites: ['Savoir écrire et appeler une fonction', 'Savoir lire une affectation et une liste', 'Aucun prérequis de spécialité mathématiques'],
    vocabulary: [
      ['classe', 'Description commune utilisée pour créer une famille d’objets.'],
      ['instance / objet', 'Exemplaire concret créé à partir d’une classe.'],
      ['attribut', 'Donnée attachée à une instance et accessible avec objet.nom.'],
      ['méthode', 'Fonction définie dans une classe et appelée sur une instance.'],
      ['self', 'Référence vers l’instance courante pendant l’exécution d’une méthode.']
    ],
    harness: 'Routine T2 : 1) nomme la classe ; 2) crée deux instances sur papier ; 3) écris leurs attributs séparément ; 4) pour chaque appel objet.methode(...), remplace mentalement self par cet objet ; 5) vérifie ensuite quel état a réellement changé.',
    worked: {
      title: 'Deux compteurs indépendants',
      problem: 'Comprendre pourquoi la même méthode peut modifier un objet sans toucher l’autre.',
      steps: [
        ['1 · Créer deux instances', 'a et b sont deux objets différents de la même classe Compteur.'],
        ['2 · Identifier self', 'Pendant a.ajouter(5), self désigne a.'],
        ['3 · Observer l’état persistant', 'self.valeur est un attribut : après l’appel, a garde 15 alors que b garde 3.']
      ],
      code: "class Compteur:\n    def __init__(self, valeur):\n        self.valeur = valeur\n\n    def ajouter(self, n):\n        self.valeur += n\n\na = Compteur(10)\nb = Compteur(3)\na.ajouter(5)\nprint(a.valeur, b.valeur)"
    },
    checks: [
      {q:'Dans p = Point(2, 3), que représente Point ?', options:['une instance','une classe','un attribut','self'], answer:1, explain:'Point est la classe utilisée pour créer l’instance référencée par p.'},
      {q:'Dans __init__(self, x), quelle donnée reste attachée à l’objet après l’appel ?', options:['le paramètre x tout seul','self.x si on l’affecte','le mot __init__','aucune'], answer:1, explain:'x est un paramètre local à l’appel ; self.x est un attribut stocké dans l’instance.'},
      {q:'Lors de a.ajouter(5), self désigne…', options:['tous les Compteur','la classe Compteur','l’objet a','le nombre 5'], answer:2, explain:'Une méthode agit sur l’instance qui reçoit l’appel ; ici self désigne a.'}
    ]
  });
}
