/* PYTHON//FORGE V1.8 — Student Zero Gate, Première P1 + P2
   This file contains deliberate, human-reviewed corrections after simulating the
   first two modules as a learner with no prior Python knowledge and no maths
   specialty. It must run after novice-overrides.js.
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

export function applyStudentZeroP1P2(modules, practiceBank, primmBank, noviceBank) {
  const p1 = modules.find(module => module.id === 'P1');
  const p2 = modules.find(module => module.id === 'P2');
  if (!p1 || !p2) return;

  /* P1 — remove prerequisite leaks and make the notional machine visible. */
  p1.duration = '70 min';
  p1.summary = 'Lire une affectation pas à pas, reconnaître les valeurs et leurs types, puis traduire une petite règle en expression Python.';
  p1.objectives = [
    'Lire une affectation de droite à gauche',
    'Distinguer nom, valeur et type',
    'Utiliser +, -, *, /, // et % dans des expressions simples',
    'Distinguer = (affecter) et == (comparer)'
  ];
  p1.lessons = [
    {
      title:'1 · Comment Python lit une affectation',
      html:'Pour débuter, imagine une règle très simple : <strong>Python calcule d’abord ce qui est à droite de <code>=</code>, puis associe le résultat au nom placé à gauche.</strong> Le signe <code>=</code> ne signifie donc pas « est égal à » comme en mathématiques : il réalise une affectation.',
      code:'score = 10\nbonus = 3\nscore = score + bonus\nprint(score)',
      points:[
        '<code>score = 10</code> associe le nom score à la valeur 10.',
        '<code>score + bonus</code> est calculé avec les valeurs actuelles.',
        'Ensuite seulement, le nouveau résultat est associé à score.'
      ]
    },
    {
      title:'2 · Nom, valeur et type : trois idées différentes',
      html:'Une <strong>valeur</strong> est une donnée manipulée par Python. Son <strong>type</strong> décrit sa nature. Un <strong>nom de variable</strong> permet de retrouver une valeur. Au début du parcours, quatre types suffisent : entier <code>int</code>, nombre décimal <code>float</code>, booléen <code>bool</code> et chaîne <code>str</code>.',
      code:"points = 12\nprix = 2.5\ntermine = False\nmatiere = 'NSI'\nprint(type(points), type(prix), type(termine), type(matiere))",
      points:[
        'Ne déduis pas le type à partir du nom de la variable : regarde la valeur.',
        '<code>True</code> et <code>False</code> sont des valeurs booléennes.',
        'Une chaîne de caractères est écrite entre guillemets.'
      ]
    },
    {
      title:'3 · Les opérateurs utiles dans ce module',
      html:'Une expression combine des valeurs et des opérateurs pour produire une nouvelle valeur. Tu n’as pas à mémoriser une longue table : commence par les opérateurs ci-dessous et vérifie-les avec de petits exemples.',
      code:'print(11 + 4)   # 15\nprint(11 - 4)   # 7\nprint(11 * 4)   # 44\nprint(11 / 4)   # 2.75\nprint(11 // 4)  # 2 : quotient entier\nprint(11 % 4)   # 3 : reste\nprint(11 == 4)  # False : comparaison',
      points:[
        '<code>//</code> donne le quotient entier d’une division.',
        '<code>%</code> donne le reste de cette division.',
        '<code>==</code> compare deux valeurs et produit <code>True</code> ou <code>False</code>.'
      ]
    },
    {
      title:'4 · Pourquoi vois-tu déjà def et return ?',
      html:'Les exercices sont vérifiés automatiquement. Pour cela, ils utilisent parfois un petit cadre commençant par <code>def ...</code> et contenant <code>return</code>. <strong>Tu n’as pas encore à savoir créer ce cadre seul.</strong> Dans P1, il est fourni : ton travail consiste à compléter l’expression demandée. Les fonctions seront étudiées en détail dans P4.',
      code:'def double(n):\n    return n * 2\n\n# Dans P1, retiens seulement :\n# n est la donnée reçue ; l’expression après return est le résultat produit.',
      points:[
        'Ne modifie pas le nom de la fonction ni ses paramètres.',
        'Concentre-toi sur la ligne à compléter.',
        'Si le mot <code>return</code> t’est encore nouveau, lis-le provisoirement comme « donner ce résultat ».'
      ]
    }
  ];

  Object.assign(byId(p1.exercises, 'P1-E1'), {
    title:'Calculer un total', level:1, kind:'compléter',
    prompt:'Le cadre de fonction est déjà fourni. Complète seulement son corps pour calculer le prix total : <code>prix</code> est le prix d’un article et <code>quantite</code> le nombre d’articles. Le résultat attendu est <code>prix * quantite</code>. Exemple : 2.5 € × 4 articles donne 10.0.',
    starter:'def total(prix, quantite):\n    # Remplace pass par une ligne return ...\n    pass',
    hints:['Repère d’abord les deux données reçues : prix et quantite.', 'Le calcul demandé est prix * quantite.', 'Dans le cadre fourni, écris : return prix * quantite.']
  });
  Object.assign(byId(p1.exercises, 'P1-E2'), {
    title:'Traduire une formule donnée', level:2, kind:'compléter',
    prompt:'Le cadre de fonction est fourni. Traduis exactement la formule donnée pour convertir <code>f</code> degrés Fahrenheit en degrés Celsius : <code>(f - 32) * 5 / 9</code>. Aucune connaissance sur les températures n’est demandée : l’objectif est uniquement de transformer une formule écrite en expression Python.',
    starter:'def celsius(f):\n    # La formule est donnée dans l’énoncé.\n    pass',
    hints:['Recopie d’abord la structure de la formule avec ses parenthèses.', 'Après return, écris exactement : (f - 32) * 5 / 9.', 'Les tests tolèrent la petite approximation habituelle des nombres décimaux.']
  });
  Object.assign(byId(p1.exercises, 'P1-E3'), {
    title:'Pair ou impair avec le reste', level:2, kind:'compléter',
    prompt:'Complète la fonction pour qu’elle renvoie <code>True</code> lorsque l’entier <code>n</code> est pair et <code>False</code> sinon. Un entier est pair lorsque le reste de sa division par 2 vaut 0. En Python, ce reste s’écrit <code>n % 2</code>. Aucun <code>if</code> n’est nécessaire.',
    starter:'def est_pair(n):\n    # Une comparaison produit déjà True ou False.\n    pass',
    hints:['Calcule mentalement le reste de 8 // 2 puis de -3 // 2.', 'Teste si n % 2 est égal à 0.', 'La ligne complète peut être : return n % 2 == 0.']
  });

  /* P2 — teach boolean meaning before branching and make threshold reasoning explicit. */
  p2.duration = '75 min';
  p2.summary = 'Transformer une règle écrite en condition booléenne, vérifier ses frontières, puis organiser des décisions avec if / elif / else.';
  p2.objectives = [
    'Lire une comparaison comme une question vraie ou fausse',
    'Combiner des conditions avec and, or et not',
    'Construire une décision if / elif / else dans le bon ordre',
    'Tester systématiquement les valeurs frontières'
  ];
  p2.lessons = [
    {
      title:'1 · Une condition est une question dont la réponse vaut True ou False',
      html:'Avant d’écrire <code>if</code>, formule la règle comme une question. Une comparaison telle que <code>age >= 16</code> produit directement un booléen : <code>True</code> si la condition est satisfaite, sinon <code>False</code>.',
      code:'age = 16\nprint(age >= 16)  # True\nprint(age < 16)   # False',
      points:[
        '<code>&gt;=</code> signifie « supérieur ou égal » : la borne est incluse.',
        '<code>==</code> compare deux valeurs ; il ne faut pas le confondre avec <code>=</code>.',
        'Pour un seuil, teste toujours une valeur juste avant, exactement au seuil et juste après.'
      ]
    },
    {
      title:'2 · Combiner des questions avec and, or et not',
      html:'Les mots <code>and</code>, <code>or</code> et <code>not</code> combinent ou inversent des booléens. Lis-les d’abord en français avant de chercher une écriture compacte.',
      code:"age = 15\nautorisation = True\nprint(age >= 16 or autorisation)\nprint(age >= 16 and autorisation)\nprint(not autorisation)",
      points:[
        '<code>A and B</code> est vrai seulement si A et B sont vrais.',
        '<code>A or B</code> est vrai si au moins l’une des deux conditions est vraie.',
        '<code>not A</code> inverse la valeur booléenne de A.'
      ]
    },
    {
      title:'3 · if / elif / else : Python teste de haut en bas',
      html:'Dans une chaîne <code>if / elif / else</code>, Python s’arrête à la première condition vraie. L’ordre des tests fait donc partie de la solution.',
      code:"note = 15\nif note >= 16:\n    print('TB')\nelif note >= 14:\n    print('B')\nelse:\n    print('autre')",
      points:[
        'Commence par le cas le plus exigeant lorsque les seuils sont emboîtés.',
        '<code>else</code> traite tous les cas qui n’ont pas été retenus avant.',
        'Une branche non exécutée n’est pas « fausse » : elle est simplement ignorée après le premier test vrai.'
      ]
    },
    {
      title:'4 · Méthode anti-erreur pour les frontières',
      html:'Pour chaque règle comportant un seuil, construis trois essais avant de coder : <strong>juste avant, exactement au seuil, juste après</strong>. Cette habitude détecte immédiatement beaucoup d’erreurs entre <code>&lt;</code> et <code>&lt;=</code>, ou entre <code>&gt;</code> et <code>&gt;=</code>.',
      code:"# Règle : admis à partir de 16 ans\n# 15 -> False\n# 16 -> True\n# 17 -> True",
      points:[
        'Les tests ne viennent pas après le programme : ils aident à construire la condition.',
        'Aucune connaissance de spécialité mathématiques n’est nécessaire pour appliquer cette méthode.'
      ]
    }
  ];

  Object.assign(byId(p2.exercises, 'P2-E1'), {
    title:'Valeur comprise entre deux bornes', level:1, kind:'compléter',
    prompt:'Complète la fonction pour qu’elle renvoie <code>True</code> lorsque <code>x</code> est compris entre <code>a</code> et <code>b</code>, bornes incluses. Autrement dit, il faut avoir simultanément <code>a <= x</code> et <code>x <= b</code>. Exemple : avec a = 2 et b = 5, les valeurs 2, 3, 4 et 5 sont acceptées ; 6 est refusée.',
    starter:'def dans_intervalle(x, a, b):\n    # Les deux bornes sont incluses.\n    pass',
    hints:['Écris d’abord les deux questions séparées : a <= x puis x <= b.', 'Elles doivent être vraies en même temps.', 'Python permet aussi l’écriture compacte : a <= x <= b.']
  });
  Object.assign(byId(p2.exercises, 'P2-E2'), {
    title:'Choisir une mention par seuils', level:2, kind:'écrire',
    prompt:'Complète le corps de la fonction <code>mention(note)</code>. Elle doit renvoyer <code>"TB"</code> à partir de 16, <code>"B"</code> à partir de 14, <code>"AB"</code> à partir de 12, et <code>"sans mention"</code> en dessous de 12. Teste les seuils du plus élevé au plus faible afin que chaque note entre dans la bonne branche.',
    starter:'def mention(note):\n    # Commence par le seuil 16, puis 14, puis 12.\n    pass',
    hints:['Avant de coder, classe 17, 16, 15, 14, 13, 12 et 11 dans les quatre catégories.', 'Commence par if note >= 16.', 'Poursuis avec elif note >= 14 puis elif note >= 12 ; le reste va dans else ou un return final.']
  });
  Object.assign(byId(p2.exercises, 'P2-E3'), {
    title:'Année bissextile : organiser trois règles', level:3, kind:'transfert',
    prompt:'On te donne entièrement la règle ; aucune connaissance de calendrier n’est nécessaire. Une année est bissextile si elle est divisible par 400. Sinon, si elle est divisible par 100, elle ne l’est pas. Sinon, elle est bissextile si elle est divisible par 4. Dans tous les autres cas elle ne l’est pas. Écris <code>bissextile(annee)</code> en suivant cet ordre de décisions.',
    starter:'def bissextile(annee):\n    # 1. divisible par 400 ?\n    # 2. sinon divisible par 100 ?\n    # 3. sinon divisible par 4 ?\n    pass',
    hints:['Commence par if annee % 400 == 0: return True.', 'Le cas divisible par 100 vient ensuite et renvoie False.', 'Après ces deux cas, il reste à tester la divisibilité par 4.'],
    solution:'def bissextile(annee):\n    if annee % 400 == 0:\n        return True\n    if annee % 100 == 0:\n        return False\n    if annee % 4 == 0:\n        return True\n    return False'
  });

  /* Practice order follows the smallest conceptual step first. */
  const p1x1 = byId(practiceBank, 'P1-X1');
  if (p1x1) Object.assign(p1x1, {kind:'compléter', level:1, prompt:'Complète seulement l’expression de retour : <code>depart</code> est l’énergie avant l’action et <code>cout</code> l’énergie dépensée. La fonction doit renvoyer <code>depart - cout</code>.'});
  const p1x2 = byId(practiceBank, 'P1-X2');
  if (p1x2) Object.assign(p1x2, {kind:'compléter', level:2, prompt:'Complète la fonction pour renvoyer le nombre de groupes complets de taille <code>taille</code> que l’on peut former avec <code>effectif</code> éléments. Utilise le quotient entier <code>//</code>. Exemple : 17 éléments par groupes de 4 donnent 4 groupes complets.'});
  const p1x3 = byId(practiceBank, 'P1-X3');
  if (p1x3) Object.assign(p1x3, {level:1, prompt:'Le programme doit ajouter <code>bonus</code> à <code>score</code>, mais une ligne compare au lieu de modifier la variable. Repère la confusion entre <code>==</code> et <code>=</code>, puis corrige uniquement cette ligne.'});
  const p1x4 = byId(practiceBank, 'P1-X4');
  if (p1x4) Object.assign(p1x4, {level:2, prompt:'Écris la fonction qui renvoie le nombre d’éléments restants après avoir formé le maximum de groupes complets. Le reste d’une division entière s’obtient avec <code>%</code>. Exemple : 17 éléments par groupes de 4 laissent 1 élément.'});
  const p1x5 = byId(practiceBank, 'P1-X5');
  if (p1x5) Object.assign(p1x5, {level:1, prompt:'Une image contient <code>largeur</code> colonnes et <code>hauteur</code> lignes de pixels. La formule est donnée : nombre de pixels = largeur × hauteur. Écris l’expression Python correspondante avec <code>*</code>.'});
  reorderPractice(practiceBank, ['P1-X1','P1-X3','P1-X5','P1-X2','P1-X4']);

  const p2x1 = byId(practiceBank, 'P2-X1');
  if (p2x1) Object.assign(p2x1, {level:2, prompt:'Complète l’expression booléenne : une notification est envoyée si elle est urgente, ou si le mode silencieux est désactivé. Commence par traduire « mode silencieux désactivé » par <code>not silencieux</code>, puis combine avec <code>urgent</code>.'});
  const p2x2 = byId(practiceBank, 'P2-X2');
  if (p2x2) Object.assign(p2x2, {level:1, prompt:'Écris une expression qui renvoie <code>True</code> si le joueur a au moins 16 ans, ou s’il possède une autorisation. Les deux moyens d’être admis sont indépendants : un seul suffit.'});
  const p2x3 = byId(practiceBank, 'P2-X3');
  if (p2x3) Object.assign(p2x3, {level:1, prompt:'La règle est « faible si le niveau de batterie est inférieur ou égal à 20 % ». Le programme fourni refuse à tort le cas exactement égal à 20. Corrige uniquement l’opérateur de comparaison.'});
  const p2x4 = byId(practiceBank, 'P2-X4');
  if (p2x4) Object.assign(p2x4, {level:2, prompt:'Écris une chaîne de décisions qui renvoie <code>"stop"</code> pour rouge, <code>"ralentir"</code> pour orange, <code>"passer"</code> pour vert et <code>"inconnu"</code> pour toute autre chaîne. Un seul résultat doit être renvoyé.'});
  const p2x5 = byId(practiceBank, 'P2-X5');
  if (p2x5) Object.assign(p2x5, {level:3, prompt:'Un mot de passe est accepté seulement si trois exigences sont vraies en même temps : au moins 8 caractères, présence d’un chiffre, et indicateur <code>interdit</code> faux. Traduis d’abord chacune des trois exigences, puis combine-les avec <code>and</code>.'});
  reorderPractice(practiceBank, ['P2-X3','P2-X2','P2-X1','P2-X4','P2-X5']);

  const np1 = byModule(noviceBank, 'P1');
  if (np1) {
    np1.goal = 'Lire une ligne Python sans deviner : identifier les données, calculer l’expression de droite, puis suivre la nouvelle valeur associée au nom.';
    np1.harness = 'Les exercices de P1 utilisent parfois def ... et return uniquement pour permettre les tests automatiques. Le cadre est toujours fourni. Ne cherche pas encore à écrire une fonction complète : lis les paramètres comme les données reçues et return comme « donner ce résultat ». Les fonctions seront apprises en P4.';
  }
  const np2 = byModule(noviceBank, 'P2');
  if (np2) {
    np2.goal = 'Transformer une règle en question vraie ou fausse, vérifier les valeurs frontières, puis choisir la bonne branche.';
    np2.harness = 'Le cadre def ... / return reste fourni. La compétence de P2 est la décision : comparer, combiner des booléens, puis organiser if / elif / else. Tu n’as pas encore à concevoir seul l’architecture d’une fonction.';
  }

  const primm1 = byModule(primmBank, 'P1');
  if (primm1) {
    primm1.predict = 'Sans exécuter, écris la valeur de score et de bonus après chaque ligne. Termine par les deux valeurs affichées.';
    primm1.investigate = ['Quelle valeur est calculée à droite de chaque signe = ?', 'À quel moment score change-t-il ?', 'Modifier bonus à la fin peut-il changer rétroactivement score ? Pourquoi ?'];
    primm1.modify = 'Change uniquement les deux valeurs initiales, puis vérifie si ta méthode de suivi fonctionne encore.';
    primm1.make = 'Écris un mini-programme de 5 lignes : énergie initiale 20, dépense 6, recharge 4, puis affiche l’énergie finale. Utilise uniquement des affectations et des opérations déjà vues.';
  }
  const primm2 = byModule(primmBank, 'P2');
  if (primm2) {
    primm2.predict = 'Sans exécuter, calcule d’abord la valeur de age >= 16, puis celle de la condition complète. Indique ensuite quelle branche sera exécutée.';
    primm2.investigate = ['Quelle valeur vaut age >= 16 ?', 'Quelle valeur vaut accompagne ?', 'Pourquoi or suffit-il ici pour obtenir True ?', 'Que se passe-t-il pour age = 15 et accompagne = False ?'];
    primm2.modify = 'Change successivement age en 16 puis accompagne en False. Avant chaque exécution, prédis le résultat.';
    primm2.make = 'Écris une règle d’accès simple : admis si age >= 18 OU si invitation vaut True. Teste mentalement 17/False, 17/True et 18/False avant d’exécuter.';
  }
}
