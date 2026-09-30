// V1.23 — Student Zero Gate T10 → T11
// Move from dynamic programming to text search by making every skipped alignment
// explainable: text, pattern, alignment, mismatch, preprocessing and safe shift.

function byId(list, id) {
  return list.find(item => item.id === id);
}

export function applyStudentZeroT10T11(modules, practiceBank, primmBank, noviceBank) {
  const t11 = modules.find(module => module.id === 'T11');
  if (!t11) return;

  t11.duration = '210 min';
  t11.title = 'Recherche textuelle : du test naïf au saut sûr';
  t11.summary = 'Comprendre comment une recherche de motif passe de l’essai systématique de chaque alignement à l’exploitation d’un échec de comparaison, grâce au prétraitement du motif et à des décalages justifiés.';
  t11.bo = 'Recherche textuelle ; étudier l’algorithme de Boyer-Moore pour la recherche d’un motif dans un texte ; mettre en avant l’intérêt du prétraitement du motif ; l’étude détaillée du coût ne peut être exigée';
  t11.objectives = [
    'Distinguer texte, motif, indice dans le texte et indice dans le motif',
    'Définir un alignement comme la position de départ du motif dans le texte',
    'Écrire et tracer une recherche naïve caractère par caractère sans utiliser find',
    'Expliquer pourquoi comparer le motif de droite vers la gauche rend certains échecs plus informatifs',
    'Prétraiter le motif en mémorisant la position la plus à droite de chaque caractère',
    'Calculer un décalage sûr à partir du caractère qui provoque l’échec sans risquer de manquer une occurrence',
    'Mettre en œuvre une version pédagogique de Boyer-Moore fondée sur la règle du mauvais caractère',
    'Expliquer pourquoi un prétraitement peut être réutilisé pour plusieurs recherches avec le même motif',
    'Comparer des traces de comparaisons sans exiger une analyse formelle de complexité'
  ];

  t11.lessons = [
    {
      title: 'Transition T10 → T11 : éviter du travail, mais autrement',
      html: 'En T10, on évitait du travail en <strong>réutilisant la réponse d’un sous-problème déjà résolu</strong>. En T11, on ne cherche plus à mémoriser des solutions intermédiaires : on exploite ce qu’un <strong>échec de comparaison</strong> nous apprend pour décider que certains alignements ne peuvent pas conduire à une occurrence. Le point commun est l’économie de travail ; le raisonnement qui justifie cette économie est différent.',
      points: [
        'Programmation dynamique : un même état réapparaît → réutiliser son résultat.',
        'Recherche textuelle : une comparaison échoue → utiliser l’information acquise pour déplacer le motif.',
        'Un dictionnaire apparaît dans les deux chapitres, mais il ne représente pas la même chose.'
      ]
    },
    {
      title: 'Le vocabulaire avant l’algorithme : texte, motif, alignement',
      html: 'On appelle <strong>texte</strong> la chaîne dans laquelle on cherche et <strong>motif</strong> la chaîne recherchée. Un <strong>alignement</strong> d’indice <code>i</code> signifie que le caractère <code>motif[0]</code> est placé sous <code>texte[i]</code>. Si le motif a une longueur <code>p</code>, l’alignement est valide tant que <code>i + p <= len(texte)</code>.',
      code: `texte : X Y Z A B C D\nindice: 0 1 2 3 4 5 6\n\nmotif :       A B C D\n               ↑\n             i = 3\n\n# motif[j] est comparé à texte[i + j]`
    },
    {
      title: 'Recherche naïve : la référence correcte et visible',
      html: 'La recherche naïve essaie chaque alignement possible, de gauche à droite. Pour chaque <code>i</code>, elle compare le motif caractère par caractère. Dès qu’une différence apparaît, cet alignement est abandonné et on essaie <code>i + 1</code>. Cette version est volontairement simple : elle sert de référence pour comprendre ensuite ce que Boyer-Moore évite réellement.',
      code: `def premiere_naive(texte, motif):\n    p = len(motif)\n    for i in range(len(texte) - p + 1):\n        ok = True\n        for j in range(p):\n            if texte[i + j] != motif[j]:\n                ok = False\n                break\n        if ok:\n            return i\n    return -1`
    },
    {
      title: 'Mesurer les comparaisons sans transformer T11 en cours de complexité',
      html: 'Pour observer un gain, on peut compter les <strong>comparaisons de caractères</strong> ou tracer les alignements visités. Cela permet de comparer deux exécutions concrètes. Le programme demande de mettre en avant l’intérêt du prétraitement du motif, mais précise que l’étude détaillée du coût de Boyer-Moore est difficile et ne peut pas être exigée. On ne cherchera donc pas une formule de complexité à réciter.',
      points: [
        'Une trace explique ce que l’algorithme a réellement fait.',
        'Moins de comparaisons sur un exemple ne constitue pas une preuve générale de coût.',
        'L’objectif est de justifier les sauts, pas de mémoriser une classe de complexité.'
      ]
    },
    {
      title: 'Pourquoi comparer de droite vers la gauche ?',
      html: 'Boyer-Moore aligne toujours le motif sur le texte, mais commence les comparaisons par la <strong>droite du motif</strong>. Lorsqu’un échec apparaît à l’indice <code>j</code>, on connaît le caractère du texte responsable de l’échec. Sa position éventuelle dans le motif peut alors indiquer un déplacement supérieur à 1. La comparaison de droite vers la gauche ne rend pas magiquement la recherche plus rapide : elle rend certains échecs plus exploitables.',
      code: `texte : X Y Z A B C D\nmotif : A B C D\n              ↑\n              j = 3\n\n# D est comparé à A : échec.\n# Le caractère A existe dans le motif, à l'indice 0.\n# On peut réfléchir à un déplacement qui aligne ces deux A.`
    },
    {
      title: 'Prétraiter le motif : construire aDroite une seule fois',
      html: 'La ressource Éduscol note <code>aDroite</code> la structure qui donne, pour un caractère, sa position la plus à droite dans le motif. En Python, un dictionnaire convient bien : une affectation plus tardive remplace l’ancienne et conserve donc naturellement le dernier indice rencontré. Ce dictionnaire dépend uniquement du motif : il peut être calculé <strong>avant</strong> la recherche.',
      code: `def calcule_a_droite(motif):\n    a_droite = {}\n    for j in range(len(motif)):\n        a_droite[motif[j]] = j\n    return a_droite\n\n# pour 'ABCD' : {'A': 0, 'B': 1, 'C': 2, 'D': 3}`
    },
    {
      title: 'Du mauvais caractère au saut sûr',
      html: 'Supposons un échec entre <code>motif[j]</code> et le caractère <code>x = texte[i+j]</code>. Si <code>x</code> apparaît dans le motif à l’indice <code>k</code>, le déplacement <code>j-k</code> cherche à aligner cette occurrence du motif avec le caractère du texte déjà observé. Si <code>x</code> est absent, on peut utiliser <code>k = -1</code>. Dans la version pédagogique étudiée ici, on impose toujours un déplacement d’au moins 1 : <code>max(1, j-k)</code>.',
      code: `k = a_droite.get(x, -1)\ndecalage = max(1, j - k)\n\n# exemple : j = 3 et x = 'A' dans le motif 'ABCD'\n# k = 0, donc decalage = 3`
    },
    {
      title: 'Trois cas à savoir expliquer',
      html: 'Le calcul du décalage doit rester interprétable. Il ne s’agit pas d’appliquer une formule aveuglément : on doit pouvoir expliquer ce qu’elle signifie sur l’alignement courant.',
      points: [
        'Le caractère fautif est absent du motif : <code>k = -1</code>, le déplacement peut être important.',
        'Sa dernière occurrence est à gauche de <code>j</code> : on tente de l’aligner avec le caractère observé dans le texte.',
        'Sa dernière occurrence est à droite de <code>j</code> : le calcul donnerait 0 ou une valeur négative, donc <code>max(1, ...)</code> garantit une progression sûre.'
      ]
    },
    {
      title: 'Une version pédagogique de Boyer-Moore par le mauvais caractère',
      html: 'Le schéma complet devient lisible si chaque variable garde un sens précis : <code>i</code> est l’alignement dans le texte, <code>j</code> l’indice actuellement comparé dans le motif, et <code>a_droite</code> provient du prétraitement. On compare de droite vers la gauche ; en cas d’échec, on calcule un saut justifié ; si <code>j</code> devient négatif, tout le motif correspond.',
      code: `def cherche_boyer_moore(texte, motif):\n    if motif == '':\n        return 0\n    p = len(motif)\n    a_droite = calcule_a_droite(motif)\n    i = 0\n    while i + p <= len(texte):\n        j = p - 1\n        while j >= 0 and texte[i + j] == motif[j]:\n            j -= 1\n        if j < 0:\n            return i\n        x = texte[i + j]\n        i += max(1, j - a_droite.get(x, -1))\n    return -1`
    },
    {
      title: 'Boyer-Moore complet : deux informations possibles',
      html: 'L’algorithme de Boyer-Moore complet peut exploiter notamment la règle du <strong>mauvais caractère</strong> et la règle du <strong>bon suffixe</strong>. La ressource d’accompagnement Éduscol présente ces idées puis une programmation simplifiée. Dans ce module, la mise en œuvre demandée se concentre sur la règle du mauvais caractère afin que chaque saut puisse être justifié par l’élève ; le bon suffixe est identifié comme une autre source d’information, pas comme une recette supplémentaire à mémoriser.',
      points: [
        'Mauvais caractère : exploiter le caractère du texte qui provoque l’échec.',
        'Bon suffixe : exploiter une partie du motif déjà reconnue avant l’échec.',
        'Comprendre le principe passe avant l’accumulation de règles de décalage.'
      ]
    },
    {
      title: 'Le prétraitement devient rentable lorsqu’on réutilise le motif',
      html: 'Le dictionnaire <code>a_droite</code> dépend du motif, pas du texte. Si on cherche le même motif dans plusieurs textes, ou plusieurs occurrences dans un même grand texte, le prétraitement peut être effectué une seule fois puis réutilisé. C’est exactement l’intérêt souligné par la ressource Éduscol : accepter un petit travail préparatoire pour éviter de refaire ce travail à chaque recherche.',
      code: `motif = 'ABCD'\na_droite = calcule_a_droite(motif)\n\n# même prétraitement réutilisé\ncherche_preparee('XYZABCD', motif, a_droite)\ncherche_preparee('---ABCD---', motif, a_droite)`
    },
    {
      title: 'Un saut doit être justifié, jamais deviné',
      html: 'Le principal danger conceptuel est de remplacer « avancer de 1 » par un grand saut arbitraire. Un décalage n’est correct que si l’information déjà obtenue permet d’écarter les alignements sautés. Dans la version étudiée, le caractère fautif et sa position la plus à droite dans le motif fournissent cette justification. Le <code>max(1, ...)</code> garantit en plus que l’algorithme progresse.',
      points: [
        'Un saut trop petit peut être moins efficace mais rester correct.',
        'Un saut trop grand sans justification peut manquer une occurrence réelle.',
        'Un saut nul peut bloquer la boucle : toujours garantir une progression strictement positive.'
      ]
    },
    {
      title: 'Checklist Student Zero : lire une recherche textuelle sans magie',
      html: 'Avant de coder ou de corriger une recherche, il faut pouvoir répondre à quelques questions simples. Si l’une d’elles reste floue, la table de décalage risque de devenir une recette opaque.',
      points: [
        'Quel est le texte ? Quel est le motif ?',
        'Que représente exactement l’alignement <code>i</code> ?',
        'Quels caractères sont comparés à l’indice <code>j</code> ?',
        'Pourquoi parcourt-on ici le motif de droite vers la gauche ?',
        'Que contient <code>a_droite</code> et quand est-il calculé ?',
        'Quel caractère a provoqué l’échec et pourquoi le saut choisi ne peut-il pas être inférieur à 1 ?',
        'Quels alignements ont réellement été visités ?'
      ]
    }
  ];

  const e1 = byId(t11.exercises, 'T11-E1');
  Object.assign(e1, {
    title: 'Référence : première occurrence par recherche naïve',
    level: 1,
    prompt: 'Écris <code>premiere_naive(texte, motif)</code> qui renvoie l’indice de la première occurrence de <code>motif</code> dans <code>texte</code>, ou <code>-1</code> si le motif est absent. Le motif vide est trouvé à la position 0. N’utilise ni <code>find</code>, ni <code>index</code>, ni découpage de chaîne pour comparer un alignement : compare explicitement <code>texte[i+j]</code> et <code>motif[j]</code>.',
    starter: `def premiere_naive(texte, motif):\n    # i = alignement du motif dans le texte\n    # j = indice comparé dans le motif\n    pass`,
    tests: [
      {label:'présent', expr:"premiere_naive('banane', 'an') == 1"},
      {label:'absent', expr:"premiere_naive('python', 'java') == -1"},
      {label:'motif vide', expr:"premiere_naive('abc', '') == 0"},
      {label:'motif plus long', expr:"premiere_naive('ab', 'abcd') == -1"}
    ],
    hints: [
      'Essaie i de 0 à len(texte) - len(motif) inclus.',
      'Pour un alignement i, compare texte[i+j] à motif[j] et abandonne l’alignement dès la première différence.'
    ],
    solution: `def premiere_naive(texte, motif):\n    p = len(motif)\n    for i in range(len(texte) - p + 1):\n        ok = True\n        for j in range(p):\n            if texte[i + j] != motif[j]:\n                ok = False\n                break\n        if ok:\n            return i\n    return -1`
  });

  const e2 = byId(t11.exercises, 'T11-E2');
  Object.assign(e2, {
    title: 'Prétraitement : construire aDroite',
    level: 2,
    prompt: 'Écris <code>calcule_a_droite(motif)</code>. Le dictionnaire renvoyé doit associer chaque caractère présent dans <code>motif</code> à son indice le plus à droite. Par exemple, pour <code>"ABACA"</code>, le dernier <code>A</code> est à l’indice 4. Ce dictionnaire dépend uniquement du motif : il sera calculé avant la recherche.',
    starter: `def calcule_a_droite(motif):\n    a_droite = {}\n    # Parcours tous les indices du motif.\n    # Une occurrence plus à droite doit remplacer l’ancienne.\n    return a_droite`,
    tests: [
      {label:'répétitions', expr:"calcule_a_droite('ABACA') == {'A':4,'B':1,'C':3}"},
      {label:'tous distincts', expr:"calcule_a_droite('ABCD') == {'A':0,'B':1,'C':2,'D':3}"},
      {label:'motif vide', expr:"calcule_a_droite('') == {}"}
    ],
    hints: [
      'Parcours j dans range(len(motif)).',
      'Affecte a_droite[motif[j]] = j : une nouvelle occurrence du même caractère remplacera l’indice précédent.'
    ],
    solution: `def calcule_a_droite(motif):\n    a_droite = {}\n    for j in range(len(motif)):\n        a_droite[motif[j]] = j\n    return a_droite`
  });

  const e3 = byId(t11.exercises, 'T11-E3');
  Object.assign(e3, {
    title: 'Boyer-Moore pédagogique : comparer à droite et sauter',
    level: 3,
    prompt: 'Écris <code>cherche_boyer_moore(texte, motif)</code> qui renvoie la première position du motif, ou <code>-1</code> s’il est absent. Le motif vide renvoie 0. Construis d’abord <code>a_droite</code>. À chaque alignement <code>i</code>, compare le motif de droite vers la gauche. Lors du premier échec à l’indice <code>j</code> contre le caractère <code>x = texte[i+j]</code>, décale de <code>max(1, j - a_droite.get(x, -1))</code>.',
    starter: `def calcule_a_droite(motif):\n    a_droite = {}\n    for j in range(len(motif)):\n        a_droite[motif[j]] = j\n    return a_droite\n\ndef cherche_boyer_moore(texte, motif):\n    if motif == '':\n        return 0\n    p = len(motif)\n    a_droite = calcule_a_droite(motif)\n    i = 0\n    # Compare de droite vers la gauche puis calcule un saut sûr.\n    pass`,
    tests: [
      {label:'saut utile', expr:"cherche_boyer_moore('XYZABCD', 'ABCD') == 3"},
      {label:'répétitions', expr:"cherche_boyer_moore('ABABAC', 'ABAC') == 2"},
      {label:'absent', expr:"cherche_boyer_moore('PYTHON', 'JAVA') == -1"},
      {label:'motif vide', expr:"cherche_boyer_moore('ABC', '') == 0"},
      {label:'fin du texte', expr:"cherche_boyer_moore('---MOTIF', 'MOTIF') == 3"}
    ],
    hints: [
      'À chaque alignement : j = p - 1 puis diminue j tant que texte[i+j] == motif[j].',
      'Si j < 0, tout le motif correspond. Sinon x = texte[i+j] et i augmente de max(1, j - a_droite.get(x, -1)).'
    ],
    solution: `def calcule_a_droite(motif):\n    a_droite = {}\n    for j in range(len(motif)):\n        a_droite[motif[j]] = j\n    return a_droite\n\ndef cherche_boyer_moore(texte, motif):\n    if motif == '':\n        return 0\n    p = len(motif)\n    a_droite = calcule_a_droite(motif)\n    i = 0\n    while i + p <= len(texte):\n        j = p - 1\n        while j >= 0 and texte[i + j] == motif[j]:\n            j -= 1\n        if j < 0:\n            return i\n        x = texte[i + j]\n        i += max(1, j - a_droite.get(x, -1))\n    return -1`
  });

  const practice = practiceBank.filter(item => item.moduleId === 'T11');

  const x1 = byId(practice, 'T11-X1');
  Object.assign(x1, {
    title: 'Compléter un alignement naïf',
    level: 1,
    kind: 'compléter',
    prompt: 'Complète <code>premiere_position(texte, motif)</code>. Pour chaque alignement <code>i</code>, la boucle interne compare <code>motif[j]</code> avec le caractère du texte situé à la même position relative. La fonction renvoie la première position trouvée, 0 pour un motif vide et -1 si le motif est absent.',
    starter: `def premiere_position(texte, motif):\n    for i in range(len(texte) - len(motif) + 1):\n        ok = True\n        for j in range(len(motif)):\n            if __________________________:\n                ok = False\n                break\n        if ok:\n            return i\n    return -1`,
    tests: [
      {label:'présent', expr:"premiere_position('abracadabra', 'cada') == 4"},
      {label:'motif vide', expr:"premiere_position('abc', '') == 0"},
      {label:'absent', expr:"premiere_position('abc', 'z') == -1"}
    ],
    hints: [
      'À l’alignement i, motif[j] est placé sous texte[i+j].',
      'L’échec se produit lorsque texte[i+j] != motif[j].'
    ],
    solution: `def premiere_position(texte, motif):\n    for i in range(len(texte) - len(motif) + 1):\n        ok = True\n        for j in range(len(motif)):\n            if texte[i + j] != motif[j]:\n                ok = False\n                break\n        if ok:\n            return i\n    return -1`,
    tags: ['recherche textuelle','alignement','naïf']
  });

  const x2 = byId(practice, 'T11-X2');
  Object.assign(x2, {
    title: 'Déboguer un saut qui peut bloquer',
    level: 2,
    kind: 'déboguer',
    prompt: 'La fonction <code>saut_sur_echec(a_droite, j, x)</code> reçoit le dictionnaire des dernières positions du motif, l’indice <code>j</code> où la comparaison a échoué et le caractère <code>x</code> lu dans le texte. Elle doit toujours renvoyer un déplacement strictement positif. Corrige le code : si la dernière occurrence de <code>x</code> est à droite de <code>j</code>, <code>j - k</code> peut être négatif.',
    starter: `def saut_sur_echec(a_droite, j, x):\n    k = a_droite.get(x, -1)\n    return j - k`,
    tests: [
      {label:'caractère à gauche', expr:"saut_sur_echec({'A':0,'B':1}, 3, 'A') == 3"},
      {label:'caractère absent', expr:"saut_sur_echec({'A':0,'B':1}, 2, 'X') == 3"},
      {label:'occurrence à droite', expr:"saut_sur_echec({'A':0,'B':3}, 1, 'B') == 1"}
    ],
    hints: [
      'Le déplacement ne doit jamais être inférieur à 1.',
      'Encadre j - k avec max(1, ...).'
    ],
    solution: `def saut_sur_echec(a_droite, j, x):\n    k = a_droite.get(x, -1)\n    return max(1, j - k)`,
    tags: ['Boyer-Moore','débogage','décalage sûr']
  });

  const x3 = byId(practice, 'T11-X3');
  Object.assign(x3, {
    title: 'Observer un alignement de droite vers la gauche',
    level: 2,
    kind: 'écrire',
    prompt: 'Écris <code>compare_alignement(texte, motif, i)</code>. À l’alignement <code>i</code>, compare le motif de droite vers la gauche. Si tout correspond, renvoie <code>(True, -1, "")</code>. Au premier échec, renvoie <code>(False, j, x)</code> où <code>j</code> est l’indice du motif qui échoue et <code>x = texte[i+j]</code> le mauvais caractère observé dans le texte.',
    starter: `def compare_alignement(texte, motif, i):\n    # Commence à j = len(motif) - 1.\n    pass`,
    tests: [
      {label:'échec immédiat à droite', expr:"compare_alignement('XYZABCD', 'ABCD', 0) == (False, 3, 'A')"},
      {label:'alignement correct', expr:"compare_alignement('XYZABCD', 'ABCD', 3) == (True, -1, '')"},
      {label:'suffixe déjà reconnu', expr:"compare_alignement('ABXDE', 'ABCDE', 0) == (False, 2, 'X')"}
    ],
    hints: [
      'Initialise j = len(motif) - 1.',
      'Tant que j >= 0 et que les caractères sont égaux, diminue j. Après la boucle, j < 0 signifie succès.'
    ],
    solution: `def compare_alignement(texte, motif, i):\n    j = len(motif) - 1\n    while j >= 0 and texte[i + j] == motif[j]:\n        j -= 1\n    if j < 0:\n        return True, -1, ''\n    return False, j, texte[i + j]`,
    tags: ['Boyer-Moore','droite vers gauche','mauvais caractère']
  });

  const x4 = byId(practice, 'T11-X4');
  Object.assign(x4, {
    title: 'Tracer les alignements réellement visités',
    level: 2,
    kind: 'transfert',
    prompt: 'Écris <code>alignements_bm(texte, motif)</code> qui applique la version pédagogique par mauvais caractère et renvoie la liste des alignements <code>i</code> effectivement examinés jusqu’à la première occurrence ou jusqu’à la fin. Cette trace doit rendre visibles les positions sautées. Le motif est non vide.',
    starter: `def alignements_bm(texte, motif):\n    a_droite = {}\n    for j in range(len(motif)):\n        a_droite[motif[j]] = j\n    visites = []\n    i = 0\n    p = len(motif)\n    # Ajoute chaque i visité puis compare de droite vers la gauche.\n    pass`,
    tests: [
      {label:'saut de trois', expr:"alignements_bm('XYZABCD', 'ABCD') == [0,3]"},
      {label:'présent immédiatement', expr:"alignements_bm('ABCDXYZ', 'ABCD') == [0]"},
      {label:'absent', expr:"alignements_bm('XXXXXX', 'ABC') == [0,3]"}
    ],
    hints: [
      'Ajoute i dans visites au début de chaque alignement examiné.',
      'Sur échec, utilise i += max(1, j - a_droite.get(texte[i+j], -1)).'
    ],
    solution: `def alignements_bm(texte, motif):\n    a_droite = {}\n    for j in range(len(motif)):\n        a_droite[motif[j]] = j\n    visites = []\n    i = 0\n    p = len(motif)\n    while i + p <= len(texte):\n        visites.append(i)\n        j = p - 1\n        while j >= 0 and texte[i + j] == motif[j]:\n            j -= 1\n        if j < 0:\n            return visites\n        i += max(1, j - a_droite.get(texte[i + j], -1))\n    return visites`,
    tags: ['Boyer-Moore','trace','alignements']
  });

  const x5 = byId(practice, 'T11-X5');
  Object.assign(x5, {
    title: 'Réutiliser un motif déjà prétraité',
    level: 3,
    kind: 'écrire',
    prompt: 'Écris <code>cherche_preparee(texte, motif, a_droite)</code>. Le dictionnaire <code>a_droite</code> est fourni : il a déjà été calculé pour <code>motif</code> et associe chaque caractère du motif à sa position la plus à droite. La fonction doit renvoyer la première position ou -1, et ne doit pas reconstruire ce dictionnaire. Le motif vide renvoie 0.',
    starter: `def cherche_preparee(texte, motif, a_droite):\n    # Ne reconstruis pas a_droite : il est déjà prêt.\n    pass`,
    tests: [
      {label:'prétraitement réutilisé', expr:"cherche_preparee('XYZABCD', 'ABCD', {'A':0,'B':1,'C':2,'D':3}) == 3"},
      {label:'absent', expr:"cherche_preparee('PYTHON', 'JAVA', {'J':0,'A':3,'V':2}) == -1"},
      {label:'motif vide', expr:"cherche_preparee('ABC', '', {}) == 0"},
      {label:'répétitions', expr:"cherche_preparee('ABABAC', 'ABAC', {'A':2,'B':1,'C':3}) == 2"}
    ],
    hints: [
      'La boucle de recherche est la même que dans l’exercice cœur ; seule la phase de prétraitement a déjà été faite.',
      'Compare de droite vers la gauche et utilise a_droite.get(x, -1) au premier échec.'
    ],
    solution: `def cherche_preparee(texte, motif, a_droite):\n    if motif == '':\n        return 0\n    p = len(motif)\n    i = 0\n    while i + p <= len(texte):\n        j = p - 1\n        while j >= 0 and texte[i + j] == motif[j]:\n            j -= 1\n        if j < 0:\n            return i\n        x = texte[i + j]\n        i += max(1, j - a_droite.get(x, -1))\n    return -1`,
    tags: ['Boyer-Moore','prétraitement','réutilisation']
  });

  const primm = primmBank.find(item => item.moduleId === 'T11');
  if (primm) {
    Object.assign(primm, {
      title: 'De l’échec visible au saut justifié',
      seed: `texte = 'XYZABCD'\nmotif = 'ABCD'\n\na_droite = {}\nfor j in range(len(motif)):\n    a_droite[motif[j]] = j\n\ni = 0\nj = len(motif) - 1\nx = texte[i + j]\nk = a_droite.get(x, -1)\ndecalage = max(1, j - k)\n\nprint('mauvais caractère :', x)\nprint('dernier indice dans le motif :', k)\nprint('décalage :', decalage)`,
      predict: 'Sans exécuter, prédis les trois valeurs affichées. Explique pourquoi le premier alignement peut passer directement de i = 0 à i = 3.',
      investigate: [
        'À l’alignement i = 0, quels caractères sont comparés si on commence à droite du motif ?',
        'Pourquoi le caractère A observé dans le texte permet-il d’aligner le A du motif situé à l’indice 0 ?',
        'Quels alignements la recherche naïve aurait-elle essayés entre 0 et 3 ?',
        'Pourquoi max(1, ...) est-il nécessaire si la dernière occurrence du mauvais caractère est située à droite de j ?'
      ],
      modify: 'Transforme le programme pour effectuer le deuxième alignement i = 3 et comparer le motif de droite vers la gauche jusqu’au succès.',
      make: 'Écris une fonction qui renvoie la liste des alignements visités pour un texte et un motif, puis compare cette trace à celle de la recherche naïve sans chercher à démontrer une complexité générale.'
    });
  }

  const novice = noviceBank.find(item => item.moduleId === 'T11');
  if (novice) {
    Object.assign(novice, {
      goal: 'Comprendre comment un échec de comparaison peut justifier un déplacement du motif sans tester toutes les positions intermédiaires.',
      prerequisites: [
        'Savoir lire les indices d’une chaîne avec texte[i] et motif[j]',
        'Savoir utiliser une boucle while simple et un dictionnaire',
        'Aucune formule de complexité avancée n’est requise'
      ],
      vocabulary: [
        ['texte','Chaîne dans laquelle on recherche une occurrence.'],
        ['motif','Chaîne que l’on souhaite retrouver dans le texte.'],
        ['alignement','Position i du texte sous laquelle est placé le premier caractère du motif.'],
        ['mauvais caractère','Caractère du texte rencontré au premier échec de comparaison.'],
        ['prétraitement','Calcul effectué une fois à partir du motif avant de parcourir le texte.'],
        ['décalage','Nombre strictement positif de positions dont on avance le motif après un échec.']
      ],
      harness: 'Dans T11, i désigne toujours l’alignement du motif dans le texte et j un indice du motif. La comparaison met donc motif[j] face à texte[i+j]. Commence toujours par redire cette phrase avant d’interpréter un saut.',
      worked: {
        title: 'Pourquoi peut-on sauter de 0 à 3 ?',
        problem: 'On cherche le motif ABCD dans le texte XYZABCD. Le motif est d’abord aligné à i = 0.',
        steps: [
          ['1 · Comparer à droite','motif[3] vaut D et texte[3] vaut A : la comparaison échoue immédiatement.'],
          ['2 · Interroger le motif','Le caractère fautif A existe dans le motif ; sa position la plus à droite est 0.'],
          ['3 · Calculer le déplacement','j - k = 3 - 0 = 3. Le prochain alignement testé est donc i = 3.'],
          ['4 · Vérifier le nouvel alignement','À i = 3, ABCD est exactement placé sous ABCD : l’occurrence commence à la position 3.']
        ],
        code: `texte = 'XYZABCD'\nmotif = 'ABCD'\na_droite = {'A':0, 'B':1, 'C':2, 'D':3}\n\ni = 0\nj = 3\nx = texte[i + j]        # 'A'\nk = a_droite.get(x, -1) # 0\ni += max(1, j - k)       # i devient 3\nprint(i)`
      },
      checks: [
        {
          q: 'À l’alignement i, motif[j] est comparé à quel caractère du texte ?',
          options: ['texte[j]','texte[i]','texte[i+j]','texte[i-j]'],
          answer: 2,
          explain: 'L’alignement décale tout le motif de i positions : motif[j] se trouve donc sous texte[i+j].'
        },
        {
          q: 'Que contient a_droite pour chaque caractère du motif ?',
          options: ['Le nombre total de caractères','Sa position la plus à droite dans le motif','Sa position dans le texte','Le nombre de comparaisons'],
          answer: 1,
          explain: 'Le prétraitement mémorise l’indice le plus à droite de chaque caractère dans le motif.'
        },
        {
          q: 'Pourquoi utilise-t-on max(1, j-k) pour le déplacement ?',
          options: ['Pour trier le motif','Pour garantir un déplacement strictement positif','Pour rendre le texte plus court','Pour mémoriser un sous-problème'],
          answer: 1,
          explain: 'Si k est à droite de j, j-k peut être nul ou négatif ; un déplacement d’au moins 1 garantit la progression de la recherche.'
        }
      ]
    });
  }
}
