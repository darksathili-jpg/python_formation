// V1.15 — Student Zero Gate T2 → T3
// Build the abstract-data-type model before implementation details.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT2T3(modules, practiceBank, primmBank, noviceBank) {
  const t3 = modules.find(module => module.id === 'T3');
  if (!t3) return;

  t3.duration = '125 min';
  t3.summary = 'Passer des objets aux types abstraits : raisonner d’abord sur les opérations promises, puis choisir une implémentation sans confondre pile/file et liste Python.';
  t3.bo = 'Structures de données : interface et implémentation ; listes, piles, files ; FIFO et LIFO';
  t3.objectives = [
    'Distinguer un type abstrait de son implémentation concrète',
    'Lire et écrire une interface minimale pour une pile ou une file',
    'Reconnaître et simuler précisément LIFO et FIFO',
    'Utiliser une pile ou une file sans dépendre de sa représentation interne',
    'Comparer deux implémentations qui offrent la même interface',
    'Choisir pile ou file à partir du comportement demandé'
  ];

  t3.lessons = [
    {
      title: 'Transition T2 → T3 : de l’objet concret au contrat d’utilisation',
      html: 'En T2, une classe servait surtout à représenter un objet avec son état. En T3, une classe peut aussi servir à <strong>cacher une représentation</strong> derrière un ensemble d’opérations. Pour une pile, ce qui compte d’abord n’est pas la liste interne éventuelle : c’est le contrat « empiler, dépiler, savoir si c’est vide ».',
      code: "# Côté utilisateur : on ne regarde pas comment la pile est stockée.\npile.empiler('A')\npile.empiler('B')\nif not pile.est_vide():\n    x = pile.depiler()"
    },
    {
      title: 'Type abstrait = valeurs possibles + opérations promises',
      html: 'Un <strong>type abstrait de données</strong> décrit ce que l’on peut faire avec une structure sans imposer la façon dont elle est codée. Son <strong>interface</strong> est le jeu des opérations visibles. Son <strong>implémentation</strong> est le choix concret des attributs et algorithmes qui réalisent ces opérations.',
      points: [
        'Interface : ce que le code utilisateur a le droit de demander.',
        'Implémentation : comment ces opérations sont réalisées en interne.',
        'Deux implémentations différentes peuvent respecter exactement la même interface.'
      ]
    },
    {
      title: 'Pile : LIFO — le dernier entré sort en premier',
      html: 'Dans une pile, on ajoute et on retire du même côté logique, appelé le sommet. L’ordre est <strong>LIFO</strong> : Last In, First Out. Une pile convient par exemple à un historique de retour arrière, des parenthèses ou certains parcours.',
      code: "# Vue abstraite\nempiler('A')   # pile : A\nempiler('B')   # pile : A, B   (B est au sommet)\ndepiler()      # renvoie B\ndepiler()      # renvoie A"
    },
    {
      title: 'File : FIFO — le premier entré sort en premier',
      html: 'Dans une file, les nouveaux éléments arrivent à l’arrière et les éléments sont servis à l’avant. L’ordre est <strong>FIFO</strong> : First In, First Out. Une file convient à une file d’attente, des tickets de support ou un parcours en largeur.',
      code: "# Vue abstraite\nenfiler('A')   # file : A\nenfiler('B')   # file : A, B\ndefiler()      # renvoie A\ndefiler()      # renvoie B"
    },
    {
      title: 'Une liste Python peut implémenter une pile — mais la pile n’est pas « une liste »',
      html: 'Le type Python <code>list</code> est une structure concrète très pratique pour réaliser une pile. Par exemple, <code>append</code> et <code>pop()</code> permettent une implémentation simple. Mais le code utilisateur d’une pile devrait raisonner avec <code>empiler</code> et <code>depiler</code>, pas avec la représentation interne. C’est cette séparation qui matérialise l’abstraction.',
      code: "class Pile:\n    def __init__(self):\n        self._data = []\n\n    def empiler(self, x):\n        self._data.append(x)\n\n    def depiler(self):\n        assert not self.est_vide()\n        return self._data.pop()\n\n    def est_vide(self):\n        return len(self._data) == 0"
    },
    {
      title: 'Précondition : on ne dépile pas ou ne défile pas une structure vide',
      html: 'L’interface doit aussi préciser les cas où une opération est autorisée. Dans ce parcours, <code>depiler</code> et <code>defiler</code> supposent la structure non vide. Avant d’appeler ces opérations dans un algorithme, on vérifie donc le vide lorsque cela est nécessaire.',
      code: "if not pile.est_vide():\n    element = pile.depiler()"
    },
    {
      title: 'Même interface, autre implémentation',
      html: 'On peut changer la représentation interne sans réécrire le code client, à condition de conserver la même interface. C’est précisément l’intérêt pédagogique de l’abstraction : le programme qui utilise <code>empiler</code>, <code>depiler</code> et <code>est_vide</code> n’a pas besoin de savoir si l’implémentation utilise une liste, deux listes ou une autre structure.',
      code: "def vider(pile):\n    resultat = []\n    while not pile.est_vide():\n        resultat.append(pile.depiler())\n    return resultat\n\n# vider(...) ne dépend pas de l’attribut interne de la pile."
    },
    {
      title: 'File simple et file avec deux piles : le comportement reste FIFO',
      html: 'Une file peut être réalisée de plusieurs façons. Une version simple peut utiliser une liste et retirer en tête. Une autre peut utiliser deux piles : <code>entree</code> reçoit les nouveaux éléments ; lorsque <code>sortie</code> est vide, on y transfère les éléments d’<code>entree</code>. Les performances internes changent, mais l’interface <code>enfiler / defiler / est_vide</code> reste la même.',
      code: "# Interface commune attendue\nf.enfiler('A')\nf.enfiler('B')\nassert f.defiler() == 'A'\nassert f.defiler() == 'B'"
    },
    {
      title: 'Choisir la structure par la règle de sortie',
      html: 'Avant de coder, pose une question simple : <strong>quel élément doit sortir maintenant ?</strong> Si c’est le dernier ajouté, pense pile/LIFO. Si c’est le plus ancien encore présent, pense file/FIFO. Le choix se fait sur le comportement attendu, pas sur le nom d’une variable ou sur une représentation Python particulière.'
    }
  ];

  const e1 = byId(t3.exercises, 'T3-E1');
  Object.assign(e1, {
    title: 'Pile : implémenter une interface minimale',
    level: 1,
    prompt: 'Complète la classe <code>Pile</code>. Son interface visible doit proposer <code>empiler(x)</code>, <code>depiler()</code> et <code>est_vide()</code>. L’attribut interne <code>_data</code> est une liste Python utilisée seulement comme implémentation. <code>depiler()</code> suppose la pile non vide et doit renvoyer le dernier élément empilé.',
    starter: "class Pile:\n    def __init__(self):\n        self._data = []\n\n    def empiler(self, x):\n        # Ajoute x au sommet logique.\n        pass\n\n    def depiler(self):\n        # Précondition : la pile n'est pas vide.\n        assert not self.est_vide()\n        pass\n\n    def est_vide(self):\n        pass",
    tests: [
      {label:'vide au départ', expr:'Pile().est_vide() is True'},
      {label:'LIFO', expr:"(lambda p: (p.empiler('A'), p.empiler('B'), p.depiler())[2])(Pile()) == 'B'"},
      {label:'état après un dépilement', expr:"(lambda p: (p.empiler(1), p.empiler(2), p.depiler(), p.depiler())[3])(Pile()) == 1"},
      {label:'pile vide refusée', expr:'Pile().depiler()', raises:'AssertionError'}
    ],
    hints: [
      'Avec l’implémentation choisie, empiler peut utiliser self._data.append(x).',
      'Le sommet est en fin de liste : pop() sans argument convient.',
      'est_vide renvoie len(self._data) == 0.'
    ],
    solution: "class Pile:\n    def __init__(self):\n        self._data = []\n\n    def empiler(self, x):\n        self._data.append(x)\n\n    def depiler(self):\n        assert not self.est_vide()\n        return self._data.pop()\n\n    def est_vide(self):\n        return len(self._data) == 0"
  });

  const e2 = byId(t3.exercises, 'T3-E2');
  Object.assign(e2, {
    title: 'Parenthèses : utiliser une pile par son interface',
    level: 2,
    prompt: 'La classe <code>Pile</code> est fournie. Écris <code>equilibrees(texte)</code> pour les seuls caractères <code>(</code> et <code>)</code>. À chaque <code>(</code>, empile une marque. À chaque <code>)</code>, il doit exister une ouverture encore en attente : sinon renvoie immédiatement <code>False</code>. À la fin, renvoie <code>True</code> seulement si la pile est vide. Dans cette fonction, n’accède jamais à l’attribut interne de <code>Pile</code> : utilise uniquement son interface.',
    starter: "class Pile:\n    def __init__(self):\n        self._data = []\n    def empiler(self, x):\n        self._data.append(x)\n    def depiler(self):\n        assert not self.est_vide()\n        return self._data.pop()\n    def est_vide(self):\n        return len(self._data) == 0\n\ndef equilibrees(texte):\n    pile = Pile()\n    # Utilise seulement empiler / depiler / est_vide.\n    pass",
    tests: [
      {label:'équilibré', expr:"equilibrees('(())()') is True"},
      {label:'fermeture trop tôt', expr:"equilibrees(')(') is False"},
      {label:'ouverture restante', expr:"equilibrees('(()') is False"},
      {label:'vide', expr:"equilibrees('') is True"}
    ],
    hints: [
      'Sur (, appelle pile.empiler(c).',
      'Sur ), teste pile.est_vide() avant de dépiler.',
      'À la fin, renvoie pile.est_vide().'
    ],
    solution: "class Pile:\n    def __init__(self):\n        self._data = []\n    def empiler(self, x):\n        self._data.append(x)\n    def depiler(self):\n        assert not self.est_vide()\n        return self._data.pop()\n    def est_vide(self):\n        return len(self._data) == 0\n\ndef equilibrees(texte):\n    pile = Pile()\n    for c in texte:\n        if c == '(':\n            pile.empiler(c)\n        elif c == ')':\n            if pile.est_vide():\n                return False\n            pile.depiler()\n    return pile.est_vide()"
  });

  const e3 = byId(t3.exercises, 'T3-E3');
  Object.assign(e3, {
    title: 'File FIFO avec deux piles : changer l’implémentation, garder le contrat',
    level: 3,
    prompt: 'Implémente <code>File2Piles</code> avec l’interface <code>enfiler(x)</code>, <code>defiler()</code> et <code>est_vide()</code>. Les nouveaux éléments sont empilés dans <code>entree</code>. Pour défiler, si <code>sortie</code> est vide, transfère tous les éléments d’<code>entree</code> vers <code>sortie</code> ; ce renversement place alors le plus ancien élément au sommet de <code>sortie</code>. <code>defiler()</code> suppose la file non vide. Le comportement observable doit rester FIFO.',
    starter: "class File2Piles:\n    def __init__(self):\n        self.entree = []\n        self.sortie = []\n\n    def enfiler(self, x):\n        pass\n\n    def est_vide(self):\n        pass\n\n    def defiler(self):\n        assert not self.est_vide()\n        if len(self.sortie) == 0:\n            # Transfère entree vers sortie.\n            pass\n        pass",
    tests: [
      {label:'vide au départ', expr:'File2Piles().est_vide() is True'},
      {label:'FIFO', expr:"(lambda f: (f.enfiler('A'), f.enfiler('B'), f.enfiler('C'), f.defiler(), f.defiler())[4])(File2Piles()) == 'B'"},
      {label:'ajout après un retrait', expr:"(lambda f: (f.enfiler(1), f.enfiler(2), f.defiler(), f.enfiler(3), f.defiler(), f.defiler())[5])(File2Piles()) == 3"},
      {label:'file vide refusée', expr:'File2Piles().defiler()', raises:'AssertionError'}
    ],
    hints: [
      'enfiler ajoute dans entree avec append.',
      'La file est vide seulement si entree ET sortie sont vides.',
      'Transférer : sortie.append(entree.pop()) tant que entree n’est pas vide.',
      'Après le transfert éventuel, sortie.pop() renvoie le plus ancien élément.'
    ],
    solution: "class File2Piles:\n    def __init__(self):\n        self.entree = []\n        self.sortie = []\n\n    def enfiler(self, x):\n        self.entree.append(x)\n\n    def est_vide(self):\n        return len(self.entree) == 0 and len(self.sortie) == 0\n\n    def defiler(self):\n        assert not self.est_vide()\n        if len(self.sortie) == 0:\n            while len(self.entree) > 0:\n                self.sortie.append(self.entree.pop())\n        return self.sortie.pop()"
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T3');
  const x1 = byId(practice, 'T3-X1');
  Object.assign(x1, {
    title: 'Pile de cartes : compléter l’interface',
    kind: 'compléter', level: 1,
    prompt: 'Complète <code>PileCartes</code>. La classe utilise une liste interne <code>_cartes</code>, mais le code utilisateur ne doit voir que <code>empiler</code>, <code>depiler</code> et <code>est_vide</code>. Le dernier élément empilé doit être le premier dépilé.',
    starter: "class PileCartes:\n    def __init__(self):\n        self._cartes = []\n    def empiler(self, carte):\n        ____________\n    def depiler(self):\n        assert not self.est_vide()\n        return ____________\n    def est_vide(self):\n        return ____________",
    tests: [
      {label:'LIFO', expr:"(lambda p: (p.empiler('A'), p.empiler('B'), p.depiler())[2])(PileCartes()) == 'B'"},
      {label:'vide', expr:'PileCartes().est_vide() is True'}
    ],
    hints: ['append pour empiler, pop() pour dépiler en fin, len(...) == 0 pour le vide.'],
    solution: "class PileCartes:\n    def __init__(self):\n        self._cartes = []\n    def empiler(self, carte):\n        self._cartes.append(carte)\n    def depiler(self):\n        assert not self.est_vide()\n        return self._cartes.pop()\n    def est_vide(self):\n        return len(self._cartes) == 0"
  });

  const x2 = byId(practice, 'T3-X2');
  Object.assign(x2, {
    title: 'Guichet : une file simple',
    kind: 'écrire', level: 1,
    prompt: 'Écris la classe <code>FileGuichet</code>. <code>enfiler(personne)</code> ajoute une personne à l’arrière. <code>defiler()</code> retire et renvoie la personne arrivée depuis le plus longtemps. <code>est_vide()</code> indique si personne n’attend. L’implémentation demandée ici utilise une liste Python ; le comportement observable doit être FIFO.',
    starter: "class FileGuichet:\n    def __init__(self):\n        self._attente = []\n\n    def enfiler(self, personne):\n        pass\n\n    def defiler(self):\n        assert not self.est_vide()\n        pass\n\n    def est_vide(self):\n        pass",
    tests: [
      {label:'FIFO', expr:"(lambda f: (f.enfiler('Ada'), f.enfiler('Alan'), f.defiler())[2])(FileGuichet()) == 'Ada'"},
      {label:'vide', expr:'FileGuichet().est_vide() is True'}
    ],
    hints: ['Ajoute avec append.', 'Dans cette implémentation simple, le plus ancien est à l’indice 0.'],
    solution: "class FileGuichet:\n    def __init__(self):\n        self._attente = []\n    def enfiler(self, personne):\n        self._attente.append(personne)\n    def defiler(self):\n        assert not self.est_vide()\n        return self._attente.pop(0)\n    def est_vide(self):\n        return len(self._attente) == 0"
  });

  const x3 = byId(practice, 'T3-X3');
  Object.assign(x3, {
    title: 'Déboguer une file servie comme une pile',
    kind: 'déboguer', level: 2,
    prompt: 'Cette classe est censée représenter une file FIFO, mais <code>defiler()</code> retire actuellement le dernier arrivé. Corrige uniquement l’opération responsable pour que le premier arrivé soit servi en premier.',
    starter: "class File:\n    def __init__(self):\n        self._data = []\n    def enfiler(self, x):\n        self._data.append(x)\n    def defiler(self):\n        assert len(self._data) > 0\n        return self._data.pop()",
    tests: [
      {label:'premier arrivé', expr:"(lambda f: (f.enfiler('A'), f.enfiler('B'), f.defiler())[2])(File()) == 'A'"},
      {label:'deuxième ensuite', expr:"(lambda f: (f.enfiler('A'), f.enfiler('B'), f.defiler(), f.defiler())[3])(File()) == 'B'"}
    ],
    hints: ['pop() retire en fin : c’est un comportement LIFO.', 'Avec cette représentation, le plus ancien est en position 0.'],
    solution: "class File:\n    def __init__(self):\n        self._data = []\n    def enfiler(self, x):\n        self._data.append(x)\n    def defiler(self):\n        assert len(self._data) > 0\n        return self._data.pop(0)"
  });

  const x4 = byId(practice, 'T3-X4');
  Object.assign(x4, {
    title: 'Annuler sans connaître l’implémentation',
    kind: 'écrire', level: 2,
    prompt: 'La fonction <code>annuler(pile)</code> reçoit un objet respectant l’interface d’une pile : <code>empiler</code>, <code>depiler</code>, <code>est_vide</code>. Elle doit renvoyer <code>None</code> si la pile est vide ; sinon elle retire et renvoie le dernier état. N’accède à aucun attribut interne de la pile.',
    starter: "def annuler(pile):\n    pass",
    tests: [
      {label:'pile vide', expr:"annuler(Pile()) is None"},
      {label:'dernier état', expr:"(lambda p: (p.empiler('v1'), p.empiler('v2'), annuler(p))[2])(Pile()) == 'v2'"}
    ],
    hints: ['Commence par pile.est_vide().', 'Si elle n’est pas vide, l’interface fournit pile.depiler().'],
    solution: "def annuler(pile):\n    if pile.est_vide():\n        return None\n    return pile.depiler()"
  });

  const x5 = byId(practice, 'T3-X5');
  Object.assign(x5, {
    title: 'Tickets : transférer entre deux piles',
    kind: 'transfert', level: 3,
    prompt: 'Complète <code>FileTickets</code> avec deux piles internes représentées ici par des listes Python <code>entree</code> et <code>sortie</code>. <code>ajouter(ticket)</code> place le ticket dans <code>entree</code>. <code>retirer()</code> doit respecter FIFO : si <code>sortie</code> est vide, transfère tous les tickets d’<code>entree</code> vers <code>sortie</code>, puis retire dans <code>sortie</code>.',
    starter: "class FileTickets:\n    def __init__(self):\n        self.entree = []\n        self.sortie = []\n    def ajouter(self, ticket):\n        pass\n    def retirer(self):\n        assert len(self.entree) > 0 or len(self.sortie) > 0\n        pass",
    tests: [
      {label:'ordre FIFO', expr:"(lambda f: (f.ajouter('T1'), f.ajouter('T2'), f.ajouter('T3'), f.retirer(), f.retirer())[4])(FileTickets()) == 'T2'"},
      {label:'nouveau ticket après service', expr:"(lambda f: (f.ajouter('T1'), f.ajouter('T2'), f.retirer(), f.ajouter('T3'), f.retirer(), f.retirer())[5])(FileTickets()) == 'T3'"}
    ],
    hints: ['Transfère avec sortie.append(entree.pop()).', 'Ne transfère que lorsque sortie est vide.'],
    solution: "class FileTickets:\n    def __init__(self):\n        self.entree = []\n        self.sortie = []\n    def ajouter(self, ticket):\n        self.entree.append(ticket)\n    def retirer(self):\n        assert len(self.entree) > 0 or len(self.sortie) > 0\n        if len(self.sortie) == 0:\n            while len(self.entree) > 0:\n                self.sortie.append(self.entree.pop())\n        return self.sortie.pop()"
  });

  const primm = primmBank.find(item => item.moduleId === 'T3');
  if (primm) Object.assign(primm, {
    title: 'Même interface, deux représentations',
    seed: "class Pile:\n    def __init__(self):\n        self._data = []\n    def empiler(self, x):\n        self._data.append(x)\n    def depiler(self):\n        return self._data.pop()\n    def est_vide(self):\n        return len(self._data) == 0\n\ndef ordre_sortie(pile):\n    resultat = []\n    while not pile.est_vide():\n        resultat.append(pile.depiler())\n    return resultat\n\np = Pile()\np.empiler('A')\np.empiler('B')\np.empiler('C')\nprint(ordre_sortie(p))",
    predict: "Sans exécuter, prédis exactement la liste affichée. Explique le résultat uniquement avec la règle LIFO, sans t’appuyer sur le nom _data.",
    investigate: [
      'Quelles sont les seules opérations utilisées par ordre_sortie sur l’objet pile ?',
      'Si l’implémentation interne de Pile change mais conserve empiler, depiler et est_vide, faut-il modifier ordre_sortie ?',
      'À quel moment le dernier élément ajouté devient-il observable ?'
    ],
    modify: 'Ajoute une méthode sommet() à la classe, qui renvoie le sommet sans le retirer, puis utilise-la dans un petit test.',
    make: 'Écris une classe File avec l’interface enfiler / defiler / est_vide puis une fonction client qui vide la file sans accéder à sa représentation interne.'
  });

  const novice = noviceBank.find(item => item.moduleId === 'T3');
  if (novice) Object.assign(novice, {
    goal: 'Choisir et utiliser une pile ou une file à partir de son interface, sans confondre la structure abstraite avec sa représentation Python.',
    prerequisites: ['Classes, attributs et méthodes du module T2', 'Listes Python comme outil d’implémentation', 'Boucles while simples'],
    vocabulary: [
      ['type abstrait', 'Description d’un ensemble de valeurs et d’opérations, indépendante du détail du code qui les réalise.'],
      ['interface', 'Opérations visibles promises au code utilisateur.'],
      ['implémentation', 'Représentation interne et algorithmes choisis pour réaliser l’interface.'],
      ['LIFO', 'Dernier entré, premier sorti : comportement d’une pile.'],
      ['FIFO', 'Premier entré, premier sorti : comportement d’une file.']
    ],
    harness: 'Dans T3, demande-toi toujours d’abord quel élément doit sortir, puis quelles opérations l’interface autorise. Une liste Python peut servir à implémenter la structure, mais les exercices importants doivent raisonner avec empiler/depiler ou enfiler/defiler.',
    worked: {
      title: 'Retour arrière : raisonner sans voir la liste interne',
      problem: 'Un historique doit fournir en premier la dernière page ajoutée.',
      steps: [
        ['1 · Identifier la règle de sortie', 'La dernière page visitée doit être récupérée en premier : LIFO.'],
        ['2 · Choisir le type abstrait', 'Une pile correspond à cette règle.'],
        ['3 · Utiliser l’interface', 'Le code client appelle empiler, depiler et est_vide ; il n’a pas besoin de connaître l’attribut interne.']
      ],
      code: "pile.empiler('accueil')\npile.empiler('cours')\npile.empiler('exercice')\nprint(pile.depiler())  # exercice"
    },
    checks: [
      {q:'Une pile doit rendre quel élément en premier ?', options:['Le plus ancien', 'Le dernier ajouté', 'Toujours le plus petit', 'Un élément aléatoire'], answer:1, explain:'LIFO signifie dernier entré, premier sorti.'},
      {q:'Si deux classes proposent empiler, depiler et est_vide avec le même contrat, le code client doit-il connaître leurs attributs internes ?', options:['Oui', 'Non'], answer:1, explain:'L’interface permet justement de découpler le code client de l’implémentation.'},
      {q:'Une file de personnes arrivées A puis B puis C doit servir…', options:['C puis B puis A', 'A puis B puis C', 'B puis A puis C', 'au hasard'], answer:1, explain:'FIFO signifie premier entré, premier sorti.'}
    ]
  });
}
