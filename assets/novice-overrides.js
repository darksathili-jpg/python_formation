export function applyNoviceContentFixes(modules, practiceBank, noviceBank) {
  const core = new Map(modules.flatMap(module => module.exercises.map(ex => [ex.id, ex])));
  const extra = new Map(practiceBank.map(ex => [ex.id, ex]));

  // Première P1 : ne pas introduire str() ni les tuples avant leur étude.
  Object.assign(extra.get('P1-X2'), {
    title: 'Groupes complets',
    level: 1,
    kind: 'écrire',
    prompt: 'Écris <code>groupes_complets(effectif, taille)</code> qui renvoie le nombre de groupes complets que l’on peut former. La taille est strictement positive.',
    starter: 'def groupes_complets(effectif, taille):\n    pass',
    tests: [
      { label: '17 élèves par 4', expr: 'groupes_complets(17, 4) == 4' },
      { label: '8 élèves par 4', expr: 'groupes_complets(8, 4) == 2' },
      { label: 'moins d’un groupe', expr: 'groupes_complets(3, 4) == 0' }
    ],
    hints: ['La division entière // renvoie le quotient entier.', 'Utilise effectif // taille.'],
    solution: 'def groupes_complets(effectif, taille):\n    return effectif // taille',
    tags: ['division entière','expression','progression']
  });

  Object.assign(extra.get('P1-X4'), {
    title: 'Éléments restants',
    level: 2,
    kind: 'transfert',
    prompt: 'Écris <code>reste_apres_groupes(effectif, taille)</code> qui renvoie combien d’éléments restent après avoir formé le maximum de groupes complets de taille donnée.',
    starter: 'def reste_apres_groupes(effectif, taille):\n    pass',
    tests: [
      { label: '17 par 4 → 1 restant', expr: 'reste_apres_groupes(17, 4) == 1' },
      { label: '8 par 4 → aucun', expr: 'reste_apres_groupes(8, 4) == 0' },
      { label: '3 par 4 → 3 restants', expr: 'reste_apres_groupes(3, 4) == 3' }
    ],
    hints: ['Le reste d’une division entière est donné par %.', 'Utilise effectif % taille.'],
    solution: 'def reste_apres_groupes(effectif, taille):\n    return effectif % taille',
    tags: ['modulo','expression','transfert']
  });

  // Première : les slices sont explicitement non exigibles ; même la solution de référence les évite.
  const minimum = core.get('P9-E1');
  if (minimum) {
    minimum.solution = 'def minimum(tab):\n    assert len(tab) > 0\n    m = tab[0]\n    for i in range(1, len(tab)):\n        if tab[i] < m:\n            m = tab[i]\n    return m';
    minimum.hints = ['Initialise avec tab[0].', 'Parcours ensuite les indices de 1 à len(tab)-1.'];
  }

  // P3 reste centré sur les boucles : def/return sont un cadre fourni, pas un prérequis caché.
  const p3 = noviceBank?.find(item => item.moduleId === 'P3');
  if (p3) {
    p3.harness = 'Les lignes def ... et return sont encore fournies comme cadre de test. Tu n’as pas à les produire seul ici : la compétence visée est la boucle, avec son initialisation, sa mise à jour et son arrêt. Les fonctions seront étudiées en P4.';
  }
}
