// V1.19 — Student Zero Gate T6 → T7
// From "it works" to explicit responsibilities, stable interfaces, tests and reproducible debugging.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT6T7(modules, practiceBank, primmBank, noviceBank) {
  const t7 = modules.find(module => module.id === 'T7');
  if (!t7) return;

  t7.duration = '165 min';
  t7.title = 'Modularité, tests & mise au point';
  t7.summary = 'Passer d’un programme qui semble fonctionner à un programme organisé en responsabilités, doté d’une interface explicite, de tests discriminants et d’une méthode de diagnostic reproductible.';
  t7.bo = 'Langages et programmation : modularité ; mise au point des programmes et gestion des bugs ; écriture et utilisation de tests';
  t7.objectives = [
    'Distinguer le comportement attendu d’un programme de son organisation interne',
    'Découper un problème en fonctions ayant chacune une responsabilité compréhensible',
    'Décrire une API par des noms, signatures, effets et résultats attendus',
    'Construire des tests nominaux, frontières et discriminants',
    'Transformer un bug corrigé en test de régression',
    'Diagnostiquer un défaut par une démarche reproductible plutôt que par essais au hasard'
  ];

  t7.lessons = [
    {
      title: 'Transition T6 → T7 : une requête correcte ne suffit pas à faire un programme robuste',
      html: 'En T6, une fonction pouvait construire ou exécuter une requête SQL correcte. Dans une application réelle, plusieurs responsabilités apparaissent : valider les données, construire la requête, l’exécuter, interpréter le résultat et présenter l’information. T7 apprend à <strong>séparer ces responsabilités</strong> afin de pouvoir comprendre, tester et corriger chaque partie sans tout modifier à la fois.',
      code: `def requete_par_id():\n    return 'SELECT nom FROM eleve WHERE id = ?'\n\ndef cherche_eleve(cur, identifiant):\n    cur.execute(requete_par_id(), (identifiant,))\n    return cur.fetchone()`
    },
    {
      title: '« Ça marche sur mon exemple » n’est pas encore un contrat',
      html: 'Un programme fiable commence par une phrase vérifiable : <strong>quelles données reçoit-il, que renvoie-t-il, quelles préconditions faut-il respecter, quels effets de bord sont autorisés ?</strong> Sans ce contrat, un test qui passe peut simplement confirmer un cas particulier mal choisi.',
      points: [
        'Entrées : paramètres et préconditions.',
        'Sortie : valeur renvoyée ou effet attendu.',
        'Effets de bord : ce qui peut être modifié en dehors de la fonction.',
        'Cas frontières : valeurs proches des limites du contrat.'
      ]
    },
    {
      title: 'Module et API : exposer ce qui est utile, masquer les détails',
      html: 'Un <strong>module</strong> regroupe des fonctions, classes ou constantes cohérentes. Son <strong>API</strong> est l’interface que le reste du programme est censé utiliser : noms publics, signatures et comportement promis. L’implémentation interne peut changer tant que le contrat de l’API reste respecté.',
      code: `# fichier temperatures.py\ndef celsius_vers_fahrenheit(c):\n    return 1.8 * c + 32\n\n# autre fichier\n# from temperatures import celsius_vers_fahrenheit`
    },
    {
      title: 'Une fonction, une responsabilité lisible',
      html: 'Découper ne signifie pas créer beaucoup de petites fonctions arbitraires. Une fonction utile correspond à une responsabilité que l’on peut nommer et tester indépendamment. Si une fonction valide une donnée, calcule un résultat, modifie une structure et affiche un message en même temps, localiser une erreur devient plus difficile.',
      code: `def note_valide(note):\n    return 0 <= note <= 20\n\ndef est_admis(note):\n    assert note_valide(note)\n    return note >= 10`
    },
    {
      title: 'Un test est un exemple exécutable du contrat',
      html: 'Un test prépare une entrée, appelle le programme puis compare le résultat obtenu au résultat attendu. Un test réussi <strong>augmente la confiance</strong>, mais ne prouve pas qu’aucun bug n’existe. La qualité vient surtout du choix des cas testés.',
      code: `assert dans_zone(0) is True       # frontière basse\nassert dans_zone(9) is True       # frontière haute\nassert dans_zone(10) is False     # juste après la frontière`
    },
    {
      title: 'Choisir les tests : nominal, frontière, invalide, contre-exemple',
      html: 'Un bon jeu de tests ne répète pas plusieurs fois le même cas. Il vise des situations capables de distinguer une solution correcte d’une solution presque correcte. Pour une condition <code>0 <= x <= 9</code>, tester seulement <code>5</code> est faible ; tester <code>0</code>, <code>9</code> et <code>10</code> révèle les erreurs classiques sur les bornes.',
      points: [
        'Cas nominal : situation ordinaire.',
        'Cas frontière : exactement sur une limite.',
        'Cas invalide : précondition non respectée lorsque le contrat le prévoit.',
        'Cas discriminant : fait échouer une solution plausible mais incorrecte.'
      ]
    },
    {
      title: 'Test de régression : transformer un ancien bug en garde-fou',
      html: 'Lorsqu’un bug est compris puis corrigé, conserve le plus petit exemple qui le révélait sous forme de <strong>test de régression</strong>. Si une modification future réintroduit le même défaut, ce test doit échouer immédiatement.',
      code: `# Ancien bug : 0 était considéré strictement positif.\nassert nb_positifs([-1, 0, 2]) == 1`
    },
    {
      title: 'Déboguer = réduire l’incertitude',
      html: 'La mise au point suit une méthode. <strong>1. Reproduire</strong> le défaut avec le plus petit cas possible. <strong>2. Observer</strong> l’écart entre attendu et obtenu. <strong>3. Formuler une hypothèse</strong> sur la cause. <strong>4. Instrumenter</strong> temporairement le programme si nécessaire. <strong>5. Corriger une seule cause</strong>. <strong>6. Ajouter un test de régression</strong>. Modifier plusieurs lignes au hasard empêche de savoir ce qui a réellement résolu le problème.'
    },
    {
      title: 'Trois familles d’erreurs à ne pas confondre',
      html: 'Une <strong>erreur de syntaxe</strong> empêche Python de comprendre le programme. Une <strong>erreur à l’exécution</strong> apparaît pendant un cas particulier, par exemple un indice hors limites. Une <strong>erreur logique</strong> laisse le programme s’exécuter mais produit un résultat faux. La stratégie de diagnostic dépend de la famille rencontrée.',
      code: `# Syntaxe : if x > 0        # ':' manquant\n# Exécution : tab[len(tab)] # IndexError\n# Logique : x >= 0          # faux si le contrat dit strictement positif`
    },
    {
      title: 'Instrumenter sans transformer le programme en forêt de print',
      html: 'Un affichage temporaire peut montrer la valeur d’une variable ou le passage dans une branche. Utilise-le pour tester une hypothèse précise, puis retire-le. Une <code>assert</code> est utile lorsqu’une propriété doit toujours être vraie à un endroit donné. L’objectif n’est pas d’ajouter des traces partout, mais de rendre une cause observable.',
      code: `def indice_valide(tab, i):\n    print('DEBUG', i, len(tab))   # temporaire\n    return 0 <= i < len(tab)`
    }
  ];

  const e1 = byId(t7.exercises, 'T7-E1');
  Object.assign(e1, {
    title: 'Contrat et effet de bord : corriger un alias',
    level: 1,
    prompt: 'La fonction <code>double_sans_modifier(tab)</code> doit renvoyer une <strong>nouvelle liste</strong> contenant chaque valeur de <code>tab</code> multipliée par 2, tout en laissant la liste reçue totalement inchangée. Le code fourni crée actuellement un alias avec <code>resultat = tab</code> : corrige uniquement cette cause du défaut, puis vérifie à la fois le résultat et l’absence d’effet de bord.',
    starter: `def double_sans_modifier(tab):\n    resultat = tab\n    for i in range(len(resultat)):\n        resultat[i] *= 2\n    return resultat`,
    tests: [
      {label:'résultat calculé', expr:'double_sans_modifier([1,2,3]) == [2,4,6]'},
      {label:'entrée intacte', expr:'(lambda a: (double_sans_modifier(a), a)[1])([1,2]) == [1,2]'},
      {label:'liste vide', expr:'double_sans_modifier([]) == []'}
    ],
    hints: [
      'Le calcul est correct ; le défaut vient de la relation entre resultat et tab.',
      'Crée une nouvelle liste avec list(tab), puis conserve le reste de l’algorithme.'
    ],
    solution: `def double_sans_modifier(tab):\n    resultat = list(tab)\n    for i in range(len(resultat)):\n        resultat[i] *= 2\n    return resultat`
  });

  const e2 = byId(t7.exercises, 'T7-E2');
  Object.assign(e2, {
    title: 'Cas frontière : 0 et 9 doivent être inclus',
    level: 2,
    prompt: 'Le contrat de <code>dans_zone(x)</code> est : renvoyer <code>True</code> exactement pour les entiers compris entre 0 et 9 <strong>bornes incluses</strong>, et <code>False</code> sinon. Le code fourni exclut les deux bornes. Reproduis d’abord le défaut avec <code>x = 0</code> ou <code>x = 9</code>, puis corrige uniquement les comparaisons.',
    starter: `def dans_zone(x):\n    return 0 < x < 9`,
    tests: [
      {label:'frontière basse incluse', expr:'dans_zone(0) is True'},
      {label:'frontière haute incluse', expr:'dans_zone(9) is True'},
      {label:'juste avant', expr:'dans_zone(-1) is False'},
      {label:'juste après', expr:'dans_zone(10) is False'}
    ],
    hints: [
      'Un cas nominal comme 5 ne révèle pas le bug : choisis une frontière.',
      'Les deux comparaisons doivent inclure leur borne.'
    ],
    solution: `def dans_zone(x):\n    return 0 <= x <= 9`
  });

  const e3 = byId(t7.exercises, 'T7-E3');
  Object.assign(e3, {
    title: 'Jeu de tests discriminant : croissance stricte',
    level: 3,
    prompt: 'Écris <code>est_strictement_croissante(tab)</code>. La fonction renvoie <code>True</code> si chaque élément après le premier est strictement supérieur au précédent. Les listes vide et à un élément sont acceptées. Une égalité entre deux voisins doit donc produire <code>False</code>. Avant de coder, explique pourquoi le test <code>[1, 3, 3]</code> distingue « croissante » de « strictement croissante ».',
    starter: `def est_strictement_croissante(tab):\n    # Contrat : toute paire voisine doit vérifier précédent < suivant.\n    pass`,
    tests: [
      {label:'vide', expr:'est_strictement_croissante([]) is True'},
      {label:'un élément', expr:'est_strictement_croissante([4]) is True'},
      {label:'croissance stricte', expr:'est_strictement_croissante([1,3,8]) is True'},
      {label:'égalité refusée', expr:'est_strictement_croissante([1,3,3]) is False'},
      {label:'descente refusée', expr:'est_strictement_croissante([1,4,2]) is False'}
    ],
    hints: [
      'Parcours les indices à partir de 1 et compare tab[i-1] à tab[i].',
      'Dès que tab[i-1] >= tab[i], le contrat est violé.'
    ],
    solution: `def est_strictement_croissante(tab):\n    for i in range(1, len(tab)):\n        if tab[i-1] >= tab[i]:\n            return False\n    return True`
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T7');

  const x1 = byId(practice, 'T7-X1');
  Object.assign(x1, {
    title: 'Débogage ciblé : préserver l’entrée',
    kind: 'déboguer', level: 1,
    prompt: 'Le contrat de <code>ajoute_fin(tab, x)</code> exige une nouvelle liste contenant les éléments de <code>tab</code> suivis de <code>x</code>, sans modifier <code>tab</code>. Le défaut vient de <code>resultat = tab</code>, qui crée un alias. Corrige cette seule cause et conserve le reste de la fonction.',
    hints: ['Avant de modifier, explique combien d’objets liste existent après resultat = tab.', 'Utilise list(tab) pour obtenir une copie indépendante.']
  });

  const x2 = byId(practice, 'T7-X2');
  Object.assign(x2, {
    title: 'Cas frontière : dernier indice valide',
    kind: 'déboguer', level: 1,
    prompt: 'La fonction <code>indice_valide(tab, i)</code> doit renvoyer <code>True</code> exactement lorsque <code>i</code> désigne un élément existant de <code>tab</code>. Pour une liste de longueur <code>n</code>, les indices valides vont de 0 à <code>n-1</code>. Le code fourni accepte par erreur <code>i == len(tab)</code>. Corrige la borne supérieure.',
    hints: ['Teste mentalement une liste de longueur 2 : les indices valides sont 0 et 1.', 'La condition supérieure doit être stricte : i < len(tab).']
  });

  const x3 = byId(practice, 'T7-X3');
  Object.assign(x3, {
    title: 'Test de régression : doublons seulement consécutifs',
    kind: 'écrire', level: 2,
    prompt: 'Un ancien bug supprimait toutes les répétitions d’une valeur, même lorsqu’elles n’étaient pas consécutives. Écris <code>sans_doublons_consecutifs(tab)</code> pour conserver le premier élément de chaque série consécutive identique. Le test <code>[1,1,2,1] → [1,2,1]</code> est un <strong>test de régression</strong> : il garantit que le dernier <code>1</code>, séparé par <code>2</code>, n’est pas supprimé.',
    tests: [
      {label:'séries consécutives', expr:'sans_doublons_consecutifs([1,1,2,2,2,3,1,1]) == [1,2,3,1]'},
      {label:'régression non consécutive', expr:'sans_doublons_consecutifs([1,1,2,1]) == [1,2,1]'},
      {label:'vide', expr:'sans_doublons_consecutifs([]) == []'}
    ],
    hints: ['Compare chaque nouvelle valeur au dernier élément déjà ajouté au résultat.', 'Ne construis pas un ensemble : il supprimerait aussi les répétitions non consécutives.']
  });

  const x4 = byId(practice, 'T7-X4');
  Object.assign(x4, {
    title: 'Deux hypothèses, deux corrections',
    kind: 'déboguer', level: 2,
    prompt: 'La fonction <code>nb_positifs(tab)</code> doit compter uniquement les valeurs <strong>strictement positives</strong>. Deux défauts indépendants sont présents : le compteur démarre avec une mauvaise valeur et la condition accepte 0. Utilise les tests <code>[]</code> puis <code>[-1,0,2,4]</code> pour isoler les deux causes avant de les corriger.',
    hints: ['Le cas vide révèle immédiatement la mauvaise initialisation.', 'Le cas contenant 0 révèle ensuite la mauvaise comparaison.']
  });

  const x5 = byId(practice, 'T7-X5');
  Object.assign(x5, {
    title: 'API stable : formater un nombre d’octets',
    kind: 'transfert', level: 3,
    prompt: 'Construis l’API <code>format_octets(n)</code>. Le paramètre <code>n</code> est un entier positif ou nul représentant un nombre d’octets. Si <code>n < 1000</code>, renvoie la chaîne <code>"n o"</code>. À partir de 1000 inclus, renvoie une valeur en kilo-octets avec exactement une décimale selon la formule fournie <code>n / 1000</code>, par exemple <code>1500 → "1.5 ko"</code>. Le cas <code>1000</code> est la frontière du contrat.',
    hints: ['Décide d’abord quelle branche contient exactement la frontière 1000.', "Le format f'{n/1000:.1f} ko' impose une décimale."]
  });

  const primm = primmBank.find(item => item.moduleId === 'T7');
  if (primm) Object.assign(primm, {
    title: 'Du symptôme au test de régression',
    seed: `def premier_negatif(tab):\n    for i in range(len(tab)):\n        if tab[i] <= 0:\n            return i\n    return -1\n\nprint(premier_negatif([4, 0, 3]))`,
    predict: 'Sans exécuter, prédis la valeur affichée. Compare-la ensuite au contrat : « renvoyer l’indice de la première valeur strictement négative, ou -1 s’il n’y en a pas ».',
    investigate: [
      'Quel est le plus petit cas qui reproduit le défaut ? Essaie de raisonner avec [0].',
      'Le programme plante-t-il, ou produit-il un résultat logique incorrect ?',
      'Quelle hypothèse précise peux-tu formuler sur l’opérateur de comparaison ?',
      'Quel test faut-il conserver après la correction pour empêcher le retour de ce bug ?'
    ],
    modify: 'Remplace uniquement la comparaison fautive, puis ajoute mentalement le test de régression premier_negatif([0]) == -1.',
    make: 'Écris une petite fonction contenant une condition frontière, choisis volontairement un bug plausible (> au lieu de >= ou inversement), puis donne le plus petit test qui révèle ce bug et la correction associée.'
  });

  const novice = noviceBank.find(item => item.moduleId === 'T7');
  if (novice) Object.assign(novice, {
    goal: 'Passer de « modifier jusqu’à ce que ça marche » à une méthode reproductible : contrat, cas minimal, observation, hypothèse, correction ciblée et test de régression.',
    prerequisites: ['Fonctions et contrats', 'Listes et effets de bord', 'Savoir lire un message d’erreur Python'],
    vocabulary: [
      ['API', 'Partie publique d’un module : noms, signatures et comportements que le reste du programme peut utiliser.'],
      ['test de régression', 'Test conservé après la correction d’un bug pour empêcher que le même défaut réapparaisse.'],
      ['instrumentation', 'Ajout temporaire d’observations ciblées, par exemple un print, pour vérifier une hypothèse pendant le débogage.']
    ],
    harness: 'Dans ce module, le but n’est pas d’apprendre un framework de test professionnel. Les assert et les tests automatiques de PYTHON//FORGE suffisent pour construire les raisonnements attendus en NSI.',
    worked: {
      title: 'Une frontière mal écrite',
      problem: 'Une fonction doit accepter les indices valides d’une liste mais accepte aussi len(tab), qui est déjà hors de la liste.',
      steps: [
        ['1 · Reproduire avec le plus petit cas', 'Pour une liste [8], le seul indice valide est 0 ; tester 1 suffit à révéler le bug.'],
        ['2 · Comparer attendu et obtenu', 'On attend False pour i = len(tab), mais le programme renvoie True.'],
        ['3 · Formuler une hypothèse', 'La borne supérieure utilise <= alors qu’elle doit être stricte.'],
        ['4 · Corriger et figer le bug', 'Remplacer <= par <, puis conserver le cas i == len(tab) comme test de régression.']
      ],
      code: `def indice_valide(tab, i):\n    return 0 <= i < len(tab)\n\nassert indice_valide([8], 0) is True\nassert indice_valide([8], 1) is False`
    },
    checks: [
      {q:'Un test qui passe prouve-t-il qu’aucun bug n’existe ?',options:['Oui, toujours','Non, il vérifie seulement les cas couverts','Oui si Python ne signale aucune erreur','Seulement avec une boucle'],answer:1,explain:'Un jeu de tests augmente la confiance mais ne constitue pas une preuve générale de correction.'},
      {q:'Après avoir corrigé un bug, que faire du plus petit exemple qui le révélait ?',options:['Le supprimer','Le conserver comme test de régression','Le remplacer par un très grand exemple','Le transformer en commentaire uniquement'],answer:1,explain:'Le test de régression doit échouer si le même défaut est réintroduit plus tard.'},
      {q:'Quelle est la meilleure première action face à un bug reproductible ?',options:['Modifier plusieurs lignes','Réduire à un petit cas et comparer attendu/obtenu','Réécrire tout le programme','Ajouter des print partout'],answer:1,explain:'Un cas minimal réduit l’incertitude et permet de tester une hypothèse précise sur la cause.'}
    ]
  });
}
