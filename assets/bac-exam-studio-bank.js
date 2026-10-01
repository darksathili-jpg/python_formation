export const BAC_EXAM_STUDIO_BANK_VERSION = '1.30.0';

const q = (id, number, prompt, answerType, correction, hints, criteria, extra = {}) => ({
  id, number, prompt, answerType, correction, hints, criteria, minChars: answerType === 'code' ? 8 : 18, ...extra
});

export const bacExamStudioPacks = [
  {
    key: '2026-amerique-du-nord-sujet-1:1',
    subjectId: '2026-amerique-du-nord-sujet-1',
    exercise: 1,
    year: 2026,
    zone: 'Amérique du Nord',
    session: 'Sujet 1',
    title: 'Puissance 4 — POO, récursivité et min-max',
    points: 6,
    estimatedMinutes: 50,
    level: 'Pack Gold · correction intégrale',
    sourceUrl: 'https://eduscol.education.gouv.fr/sites/default/files/document/26-nsij1an1-127703.pdf',
    correctionAuditUrl: 'https://www.math93.com/images/pdf/annales_bac/Bac_NSI/bac_NSI_2026/NSI_Epreuve_Ecrite-2026/BACNSI2026_AmeriqueNord_Sujet1_corr.pdf',
    sourceNote: 'Énoncé officiel 2026. Les formulations ci-dessous sont réécrites pour constituer un environnement d’entraînement autonome ; la correction pédagogique a été vérifiée contre une correction publiée puis réexpliquée.',
    concepts: ['POO', 'listes de listes', 'récursivité', 'arbres', 'min-max', 'complexité'],
    context: [
      'On modélise un Puissance 4 par une grille de 6 lignes et 7 colonnes. Une case vaut 0 si elle est vide, 1 si elle contient un pion du joueur 1 et 2 pour le joueur 2.',
      'Une fonction valeur_case(ligne, colonne) est fournie : elle mesure le nombre d’alignements de quatre cases passant par la case. Le score d’une grille additionne ces valeurs pour le joueur 2 et les soustrait pour le joueur 1.',
      'Pour choisir un coup, on construit un arbre de possibilités limité à une profondeur niveau_max. Une victoire du joueur 1 reçoit un score très négatif, une victoire du joueur 2 un score très positif ; à la profondeur limite on utilise le score de la grille. Le joueur 1 minimise, le joueur 2 maximise.'
    ],
    sections: [
      { id: 'A', title: 'A · Grille et score', questions: ['q1','q2','q3','q4','q5'] },
      { id: 'B', title: 'B · Arbre min-max', questions: ['q6','q7','q8','q9'] },
      { id: 'C', title: 'C · Choix du coup', questions: ['q10'] }
    ],
    questions: [
      q('q1','1','Écris le constructeur de la classe Grille. L’attribut self.grille doit contenir 6 lignes indépendantes de 7 zéros.', 'code', {
        recognize: 'Il faut construire une liste de listes sans partager la même sous-liste entre plusieurs lignes.',
        reasoning: ['La structure attendue possède 6 lignes.', 'Chaque ligne possède 7 cases initialisées à 0.', 'Les lignes doivent être des objets-listes distincts.'],
        expected: "def __init__(self):\n    self.grille = [[0 for _ in range(7)] for _ in range(6)]",
        traps: ['Écrire [[0] * 7] * 6 : les six lignes référencent alors la même liste.', 'Inverser 6 et 7.'],
        language: 'Sur copie, une courte phrase suffit : « chaque ligne est créée indépendamment ».'
      }, ['Quelle structure Python permet de représenter un tableau 2D ?', 'Crée d’abord une ligne de 7 zéros, puis répète la création de la ligne 6 fois.', 'Privilégie une compréhension imbriquée plutôt qu’une multiplication de listes.'], ['6 lignes sont créées','7 zéros par ligne','les lignes sont indépendantes']),
      q('q2','2','Complète mentalement puis écris la méthode joue(colonne, joueur) : on cherche une case libre de bas en haut. Si un pion peut être placé, la méthode modifie la grille et renvoie True ; sinon elle renvoie False.', 'code', {
        recognize: 'La recherche doit partir de la ligne 5 et remonter tant que la case est occupée.',
        reasoning: ['Initialiser ligne à 5.', 'Décrémenter ligne tant qu’elle reste valide et que la case n’est pas vide.', 'Placer joueur dans la première case vide trouvée.', 'Retourner False uniquement si la colonne est pleine.'],
        expected: "def joue(self, colonne, joueur):\n    ligne = 5\n    while ligne >= 0 and self.grille[ligne][colonne] != 0:\n        ligne -= 1\n    if ligne >= 0:\n        self.grille[ligne][colonne] = joueur\n        return True\n    return False",
        traps: ['Parcourir de haut en bas : le pion flotterait.', 'Accéder à la ligne -1 avant d’avoir vérifié la borne.'],
        language: 'La justification attendue relie le sens du parcours au fait que le pion tombe vers le bas.'
      }, ['Quel est l’indice de la ligne la plus basse ?', 'La boucle s’arrête soit sur une case vide, soit lorsque ligne devient négatif.', 'Après la boucle, un seul test suffit pour distinguer coup possible et colonne pleine.'], ['parcours de la ligne 5 vers 0','test de borne avant accès','retours booléens corrects']),
      q('q3','3','On veut obtenir une grille où le joueur 1 possède un pion en colonne 2, le joueur 2 un pion en bas de la colonne 3 et le joueur 1 un second pion juste au-dessus dans cette même colonne. Écris uniquement les appels nécessaires à partir d’un objet Grille vide.', 'code', {
        recognize: 'Il faut respecter l’ordre réel des coups : le pion supérieur de la colonne 3 ne peut être joué qu’après le pion inférieur.',
        reasoning: ['Créer une nouvelle Grille.', 'Jouer d’abord le pion du joueur 1 en colonne 2.', 'Jouer ensuite le joueur 2 en colonne 3.', 'Rejouer en colonne 3 avec le joueur 1.'],
        expected: "jeu1 = Grille()\njeu1.joue(2, 1)\njeu1.joue(3, 2)\njeu1.joue(3, 1)",
        traps: ['Confondre numéro de colonne et numéro de joueur.', 'Jouer le pion du haut avant celui du bas.'],
        language: 'Aucune longue rédaction n’est nécessaire : les trois appels dans le bon ordre constituent la réponse.'
      }, ['Commence par créer l’objet.', 'Dans la colonne 3, quel pion doit être présent avant de pouvoir en poser un au-dessus ?', 'La séquence de colonnes est 2, 3, 3.'], ['objet créé','ordre des trois coups correct','joueurs corrects']),
      q('q4','4','Pour la grille précédente, on te donne valeur_case(5,3)=7 pour le pion du joueur 2, valeur_case(5,2)=5 et valeur_case(4,3)=10 pour les deux pions du joueur 1. Calcule le score et justifie le signe de chaque terme.', 'text', {
        recognize: 'Le joueur 2 contribue positivement et le joueur 1 négativement.',
        reasoning: ['Contribution du joueur 2 : +7.', 'Contributions du joueur 1 : -5 et -10.', 'Somme : 7 - 5 - 10.'],
        expected: 'Le score vaut -8, car 7 - 5 - 10 = -8.',
        traps: ['Additionner les trois valeurs sans tenir compte du joueur.', 'Inverser la convention de signe.'],
        language: 'Écrire l’expression numérique rend la justification immédiatement vérifiable.'
      }, ['Relis la convention de score : quel joueur ajoute des points ?', 'Écris une expression avec trois termes signés.', 'Calcule 7 - 5 - 10.'], ['convention de signe respectée','calcul explicite','résultat -8']),
      q('q5','5','Écris la méthode score(self) qui parcourt toute la grille : elle ajoute valeur_case pour chaque pion du joueur 2, la soustrait pour chaque pion du joueur 1 et ignore les cases vides.', 'code', {
        recognize: 'C’est un double parcours de tableau avec un accumulateur.',
        reasoning: ['Initialiser total à 0.', 'Parcourir les 6×7 positions.', 'Tester la valeur 2 puis la valeur 1.', 'Retourner total après le double parcours.'],
        expected: "def score(self):\n    total = 0\n    for l in range(6):\n        for c in range(7):\n            if self.grille[l][c] == 2:\n                total += valeur_case(l, c)\n            elif self.grille[l][c] == 1:\n                total -= valeur_case(l, c)\n    return total",
        traps: ['Placer return à l’intérieur d’une boucle.', 'Appeler valeur_case sur les cases vides inutilement.'],
        language: 'Le code doit faire apparaître clairement la symétrie + pour le joueur 2 / − pour le joueur 1.'
      }, ['Quel schéma algorithmique convient pour visiter toutes les cases ?', 'Un accumulateur total est mis à jour selon la valeur de la case.', 'Le return doit être exécuté après les deux boucles.'], ['double boucle correcte','signes corrects','return placé après les boucles']),
      q('q6','6','Une classe Noeud représente un coup par trois attributs : colonne, score et suivants. Écris son constructeur sachant que score vaut initialement 0 et que la liste des fils est vide.', 'code', {
        recognize: 'Il s’agit d’un constructeur POO direct : trois affectations d’attributs.',
        reasoning: ['Conserver le paramètre colonne.', 'Initialiser score à 0.', 'Créer une nouvelle liste vide pour suivants.'],
        expected: "def __init__(self, colonne):\n    self.colonne = colonne\n    self.score = 0\n    self.suivants = []",
        traps: ['Utiliser une liste partagée comme valeur par défaut de paramètre.', 'Oublier self. devant un attribut.'],
        language: 'Le vocabulaire précis est « attribut d’instance ».'
      }, ['Chaque information doit devenir un attribut de self.', 'La liste de fils doit être propre à chaque nœud.', 'Trois affectations suffisent.'], ['colonne mémorisée','score initialisé à 0','liste de fils indépendante']),
      q('q7','7','Écris une méthode colonne_score_min qui suppose self.suivants non vide et renvoie le couple (colonne, score) d’un fils dont le score est minimal.', 'code', {
        recognize: 'Il faut effectuer une recherche de minimum dans une liste non vide.',
        reasoning: ['Prendre le premier fils comme meilleur courant.', 'Comparer les autres fils à ce minimum courant.', 'Conserver le fils lorsqu’un score plus petit est rencontré.', 'Retourner les deux attributs demandés.'],
        expected: "def colonne_score_min(self):\n    meilleur = self.suivants[0]\n    for fils in self.suivants[1:]:\n        if fils.score < meilleur.score:\n            meilleur = fils\n    return (meilleur.colonne, meilleur.score)",
        traps: ['Initialiser le minimum à 0 : tous les scores peuvent être positifs.', 'Retourner seulement le score alors que le couple est demandé.'],
        language: 'Une justification courte peut mentionner l’invariant : meilleur désigne le plus petit score déjà parcouru.'
      }, ['Pourquoi le premier fils est-il une bonne initialisation ?', 'Compare les attributs score, pas les objets eux-mêmes.', 'Le résultat demandé possède deux composantes.'], ['initialisation avec un vrai fils','mise à jour du minimum','couple colonne-score renvoyé']),
      q('q8','8','Écris le cœur récursif calcule_score(niveau, joueur, grille). Règles : victoire J1 → -(100+10×(niveau_max-niveau)); victoire J2 → valeur positive symétrique ; profondeur limite → grille.score(); sinon créer tous les coups possibles, appeler récursivement avec l’autre joueur, puis prendre le minimum pour J1 ou le maximum pour J2.', 'code', {
        recognize: 'La fonction suit quatre cas exclusifs : victoire 1, victoire 2, profondeur limite, expansion récursive.',
        reasoning: ['Traiter d’abord les cas terminaux pour arrêter la récursion.', 'Pour chaque colonne, travailler sur une copie de la grille.', 'Créer un fils uniquement si le coup est jouable.', 'L’autre joueur vaut 3 - joueur.', 'Après création des fils, propager min ou max selon le joueur courant.'],
        expected: "def calcule_score(self, niveau, joueur, grille):\n    g = grille.gagnant()\n    if g == 1:\n        self.score = -(100 + 10 * (niveau_max - niveau))\n    elif g == 2:\n        self.score = 100 + 10 * (niveau_max - niveau)\n    elif niveau == niveau_max:\n        self.score = grille.score()\n    else:\n        for colonne in range(7):\n            copie = grille.copie_grille()\n            if copie.joue(colonne, joueur):\n                fils = Noeud(colonne)\n                self.suivants.append(fils)\n                fils.calcule_score(niveau + 1, 3 - joueur, copie)\n        self.score = (self.colonne_score_min() if joueur == 1 else self.colonne_score_max())[1]",
        traps: ['Modifier la même grille pour plusieurs branches : les scénarios se contaminent.', 'Oublier d’alterner le joueur.', 'Développer des fils après un cas terminal.'],
        language: 'Dans une explication, employer « cas terminal », « appel récursif » et « propagation du score ».'
      }, ['Commence par écrire les trois cas où aucun fils ne doit être créé.', 'Chaque branche de l’arbre a besoin de sa propre copie de grille.', 'Le joueur suivant peut s’écrire 3 - joueur.'], ['cas terminaux avant la récursion','copie indépendante par branche','alternance du joueur','min/max cohérent']),
      q('q9','9','Explique pourquoi explorer l’arbre complet de toutes les parties jusqu’à 42 coups n’est pas réaliste, même si certaines branches s’arrêtent avant.', 'text', {
        recognize: 'Il faut raisonner sur la croissance combinatoire du nombre de positions explorées.',
        reasoning: ['Une partie peut durer jusqu’à 42 coups.', 'Au début, jusqu’à 7 colonnes sont possibles à chaque niveau.', 'Le nombre de branches croît de façon exponentielle ; une borne grossière du type 7^42 est déjà astronomique.', 'Temps de calcul et mémoire deviennent prohibitifs.'],
        expected: 'L’arbre a un facteur de branchement pouvant approcher 7 et une profondeur pouvant atteindre 42 : le nombre de scénarios explose exponentiellement. Une exploration exhaustive demanderait donc un temps et une mémoire irréalistes.',
        traps: ['Dire seulement « c’est long » sans relier la conclusion au facteur de branchement et à la profondeur.', 'Présenter 7^42 comme le nombre exact de parties : c’est seulement un ordre de grandeur grossier.'],
        language: 'Une bonne réponse associe cause (« croissance exponentielle ») et conséquence (« temps/mémoire prohibitifs »).'
      }, ['Quelle est la profondeur maximale ?', 'Combien de colonnes peuvent être candidates au début ?', 'Relie facteur de branchement et profondeur : on obtient une croissance exponentielle.'], ['profondeur 42 mentionnée','facteur de branchement expliqué','conséquence temps/mémoire justifiée']),
      q('q10','10','Écris choisit_coup(grille, joueur) : créer une racine fictive de colonne -1, lancer le calcul min-max depuis le niveau 0, puis renvoyer la colonne au score minimal pour J1 ou maximal pour J2.', 'code', {
        recognize: 'Cette fonction orchestre les méthodes déjà construites ; elle n’a pas à réimplémenter min-max.',
        reasoning: ['Créer Noeud(-1).', 'Calculer les scores à partir de la grille actuelle.', 'Choisir min ou max selon le joueur.', 'Extraire et renvoyer la colonne du couple.'],
        expected: "def choisit_coup(grille, joueur):\n    racine = Noeud(-1)\n    racine.calcule_score(0, joueur, grille)\n    if joueur == 1:\n        colonne, _ = racine.colonne_score_min()\n    else:\n        colonne, _ = racine.colonne_score_max()\n    return colonne",
        traps: ['Retourner le score au lieu de la colonne.', 'Commencer au niveau 1 alors que la racine fictive est au niveau 0.'],
        language: 'Pour expliquer le choix, utiliser explicitement « J1 minimise » et « J2 maximise ».'
      }, ['Quelle valeur de colonne désigne la racine qui ne correspond à aucun coup ?', 'Le calcul commence au niveau 0.', 'Les méthodes min/max renvoient un couple : quelle composante faut-il retourner ?'], ['racine -1','appel niveau 0','min pour J1 / max pour J2','colonne renvoyée'])
    ]
  },
  {
    key: '2026-amerique-du-nord-sujet-1:3',
    subjectId: '2026-amerique-du-nord-sujet-1',
    exercise: 3,
    year: 2026,
    zone: 'Amérique du Nord',
    session: 'Sujet 1',
    title: 'Immobilier — SQL, récursivité et programmation dynamique',
    points: 8,
    estimatedMinutes: 65,
    level: 'Pack Gold · correction intégrale',
    sourceUrl: 'https://eduscol.education.gouv.fr/sites/default/files/document/26-nsij1an1-127703.pdf',
    correctionAuditUrl: 'https://www.math93.com/images/pdf/annales_bac/Bac_NSI/bac_NSI_2026/NSI_Epreuve_Ecrite-2026/BACNSI2026_AmeriqueNord_Sujet1_corr.pdf',
    sourceNote: 'Énoncé officiel 2026. Le dossier intégré reformule les données nécessaires. Les réponses ont été recalculées puis confrontées à une correction publiée.',
    concepts: ['SQL', 'clé primaire', 'clé étrangère', 'jointure', 'récursivité', 'programmation dynamique'],
    context: [
      'Base immobilière : immeuble(id_immeuble, nb_etage_immeuble, numero_immeuble, rue_immeuble), avec id_immeuble comme clé primaire.',
      'appartement(id_appart, etage_appart, prix_appart, id_immeuble), avec id_appart comme clé primaire et id_immeuble comme clé étrangère vers immeuble.id_immeuble.',
      'Deuxième partie indépendante : pour une liste de hauteurs d’immeubles, on cherche une plus longue sous-séquence strictement croissante (LSSC). Une sous-séquence conserve l’ordre des éléments de la liste initiale.'
    ],
    sections: [
      { id: 'A', title: 'A · Base de données', questions: ['q1','q2','q3','q4','q5','q6','q7'] },
      { id: 'B', title: 'B · Sous-séquence croissante', questions: ['q8','q9','q10','q11','q12'] }
    ],
    questions: [
      q('q1','1','Explique pourquoi numero_immeuble (le numéro dans une rue) ne convient pas seul comme clé primaire de la table immeuble.', 'text', {
        recognize: 'Une clé primaire doit identifier chaque ligne de façon unique dans toute la relation.',
        reasoning: ['Un même numéro peut exister dans plusieurs rues.', 'Deux immeubles distincts pourraient donc partager la même valeur de numero_immeuble.', 'L’unicité n’est pas garantie.'],
        expected: 'Le numéro dans la rue n’est pas unique à l’échelle de la table : deux rues différentes peuvent chacune contenir, par exemple, un immeuble n°13. Il ne peut donc pas identifier à lui seul un immeuble.',
        traps: ['Répondre seulement « parce qu’il peut y avoir des doublons » sans expliquer d’où viennent ces doublons.', 'Confondre clé primaire et clé étrangère.'],
        language: 'Employer « unicité » et « identifier une ligne » renforce la précision de la réponse.'
      }, ['Quelle propriété fondamentale doit vérifier une clé primaire ?', 'Imagine deux rues différentes ayant toutes deux un numéro 13.', 'Conclue explicitement sur l’absence d’unicité.'], ['unicité définie','contre-exemple pertinent','conclusion sur la clé primaire']),
      q('q2','2','Écris une requête SQL qui renvoie uniquement les identifiants des immeubles situés rue « la mer », triés par identifiant croissant.', 'code', {
        recognize: 'La requête combine projection, sélection et tri.',
        reasoning: ['SELECT porte sur id_immeuble.', 'WHERE filtre la rue.', 'ORDER BY trie les identifiants dans l’ordre croissant.'],
        expected: "SELECT id_immeuble\nFROM immeuble\nWHERE rue_immeuble = 'la mer'\nORDER BY id_immeuble ASC;",
        traps: ['Faire SELECT * alors qu’un seul attribut est demandé.', 'Oublier les quotes autour de la chaîne.'],
        language: 'La requête doit répondre exactement à la projection demandée ; éviter les colonnes inutiles.'
      }, ['Quelle colonne doit apparaître après SELECT ?', 'Le filtre porte sur rue_immeuble.', 'ORDER BY est appliqué à id_immeuble.'], ['projection correcte','filtre sur la rue','tri croissant']),
      q('q3','3','Écris une requête SQL qui renvoie les identifiants des appartements appartenant à l’immeuble 16 et situés au 5e étage ou au-dessus.', 'code', {
        recognize: 'Deux contraintes doivent être vraies simultanément.',
        reasoning: ['Filtrer id_immeuble = 16.', 'Filtrer etage_appart >= 5.', 'Relier les deux conditions par AND.'],
        expected: "SELECT id_appart\nFROM appartement\nWHERE id_immeuble = 16\n  AND etage_appart >= 5;",
        traps: ['Utiliser OR : cela accepterait des appartements hors immeuble 16 ou sous le 5e.', 'Écrire > 5 et exclure le 5e étage.'],
        language: '« Au moins 5 » se traduit par >= 5.'
      }, ['Deux conditions sont imposées : doivent-elles être vraies ensemble ?', '« Au moins » inclut la valeur 5.', 'La table à interroger est appartement.'], ['table correcte','AND entre les conditions','opérateur >= correct']),
      q('q4','4','On tente de supprimer directement l’immeuble d’identifiant 16. Explique pourquoi cette opération peut violer l’intégrité référentielle si des appartements lui sont encore rattachés.', 'text', {
        recognize: 'appartement.id_immeuble est une clé étrangère vers immeuble.id_immeuble.',
        reasoning: ['Des lignes appartement peuvent contenir la valeur 16.', 'Supprimer la ligne immeuble 16 ferait alors pointer ces clés étrangères vers une ligne inexistante.', 'Il faut traiter les appartements liés avant, ou utiliser une politique de cascade prévue par le schéma.'],
        expected: 'La suppression peut laisser des appartements dont id_immeuble vaut 16 alors qu’aucun immeuble 16 n’existe plus. La référence étrangère devient invalide : l’intégrité référentielle est rompue.',
        traps: ['Parler de duplication alors que le problème est une référence orpheline.', 'Supposer qu’une suppression en cascade existe sans que le schéma le précise.'],
        language: 'Les termes « clé étrangère », « ligne référencée » et « intégrité référentielle » sont attendus.'
      }, ['Quel attribut relie appartement à immeuble ?', 'Que devient une clé étrangère si la ligne cible disparaît ?', 'Le problème est une référence orpheline.'], ['clé étrangère identifiée','référence orpheline expliquée','intégrité référentielle nommée']),
      q('q5','5','Ajoute en SQL un immeuble d’identifiant 140, de 6 étages, au numéro 13 de la rue « Turing ». Indique explicitement les colonnes pour rendre l’insertion robuste.', 'code', {
        recognize: 'Une nouvelle ligne se crée avec INSERT INTO ... (...) VALUES (...).',
        reasoning: ['Lister les quatre colonnes dans le même ordre que leurs valeurs.', 'Les nombres restent numériques.', 'La rue est une chaîne SQL.'],
        expected: "INSERT INTO immeuble (id_immeuble, nb_etage_immeuble, numero_immeuble, rue_immeuble)\nVALUES (140, 6, 13, 'Turing');",
        traps: ['Mélanger l’ordre des colonnes et des valeurs.', 'Oublier les quotes autour de Turing.'],
        language: 'Préciser les colonnes évite de dépendre de leur ordre physique dans la table.'
      }, ['Quel mot-clé crée une nouvelle ligne ?', 'Les colonnes et les valeurs doivent être dans le même ordre.', 'La valeur Turing est une chaîne.'], ['INSERT INTO utilisé','ordre colonnes/valeurs cohérent','chaîne correctement délimitée']),
      q('q6','6','Le prix de l’appartement 603 doit être doublé. Écris la requête SQL de mise à jour sans connaître sa valeur actuelle.', 'code', {
        recognize: 'Il faut modifier une ligne existante avec UPDATE et exprimer le nouveau prix à partir de l’ancien.',
        reasoning: ['UPDATE appartement.', 'SET prix_appart = 2 * prix_appart.', 'WHERE id_appart = 603 pour ne modifier qu’une ligne.'],
        expected: "UPDATE appartement\nSET prix_appart = 2 * prix_appart\nWHERE id_appart = 603;",
        traps: ['Oublier WHERE et doubler tous les prix.', 'Essayer d’utiliser une valeur numérique inconnue.'],
        language: 'La clause WHERE est essentielle : elle délimite précisément la ligne visée.'
      }, ['Quel mot-clé modifie une ligne existante ?', 'On peut utiliser la valeur courante de la colonne dans le SET.', 'Ne surtout pas oublier WHERE.'], ['UPDATE correct','doublement exprimé','WHERE sur id_appart']),
      q('q7','7','Écris une requête renvoyant le prix maximal parmi les appartements situés dans un immeuble de la rue « la mer ». Le prix est dans appartement, le nom de rue dans immeuble.', 'code', {
        recognize: 'Il faut à la fois une agrégation MAX et une jointure entre les deux tables.',
        reasoning: ['Joindre appartement et immeuble sur id_immeuble.', 'Filtrer rue_immeuble = la mer.', 'Projeter MAX(prix_appart).'],
        expected: "SELECT MAX(a.prix_appart)\nFROM appartement AS a\nJOIN immeuble AS i ON a.id_immeuble = i.id_immeuble\nWHERE i.rue_immeuble = 'la mer';",
        traps: ['Oublier la jointure et tenter de filtrer une colonne absente de appartement.', 'Appliquer MAX à l’identifiant au lieu du prix.'],
        language: 'Les alias a et i ne sont pas obligatoires mais rendent la jointure plus lisible.'
      }, ['Dans quelle table se trouve le prix ? Dans laquelle se trouve la rue ?', 'Quel attribut commun relie les deux tables ?', 'Utilise MAX sur prix_appart après la jointure.'], ['jointure sur id_immeuble','filtre sur la rue','MAX appliqué au prix']),
      q('q8','8','Pour L2 = [3, 1, 8, 2, 5], donne toutes les sous-séquences strictement croissantes de longueur 2 en respectant l’ordre des positions dans L2.', 'text', {
        recognize: 'On cherche des couples (L2[i], L2[j]) avec i < j et L2[i] < L2[j].',
        reasoning: ['Depuis 3 : 8 et 5 conviennent.', 'Depuis 1 : 8, 2 et 5 conviennent.', 'Depuis 8 : aucun élément suivant n’est plus grand.', 'Depuis 2 : 5 convient.'],
        expected: '[3, 8], [3, 5], [1, 8], [1, 2], [1, 5] et [2, 5].',
        traps: ['Trier la liste avant de chercher : une sous-séquence doit conserver l’ordre initial.', 'Oublier un couple valide lorsque les valeurs ne sont pas adjacentes.'],
        language: 'Préciser i < j montre que tu as compris la contrainte d’ordre.'
      }, ['Transforme le problème en couples d’indices i < j.', 'Depuis 3, quels éléments situés après lui sont plus grands ?', 'Procède de la même façon depuis 1 puis 2.'], ['ordre initial respecté','six couples trouvés','croissance stricte vérifiée']),
      q('q9','9','Détermine une plus longue sous-séquence strictement croissante de L2 = [3, 1, 8, 2, 5] et donne sa longueur.', 'text', {
        recognize: 'Il faut maximiser la longueur tout en conservant l’ordre et la croissance stricte.',
        reasoning: ['La chaîne 1 → 2 → 5 respecte les indices croissants et les valeurs croissantes.', 'Aucune sous-séquence de longueur 4 n’est possible dans cette petite liste.'],
        expected: 'Une LSSC est [1, 2, 5] et sa longueur vaut 3.',
        traps: ['Proposer [1,2,3,5] : 3 apparaît avant 1 dans la liste initiale.', 'Confondre sous-séquence et sous-liste contiguë.'],
        language: 'Donner à la fois un exemple de sous-séquence et sa longueur.'
      }, ['Cherche d’abord une chaîne croissante de trois valeurs.', '1 puis 2 puis 5 apparaissent-ils dans cet ordre ?', 'Vérifie ensuite si quatre valeurs pourraient satisfaire les deux contraintes.'], ['sous-séquence valide','longueur 3','maximalité justifiée']),
      q('q10','10','Écris est_strict_croissante(seq), qui renvoie True si chaque élément après le premier est strictement supérieur à son prédécesseur, False sinon.', 'code', {
        recognize: 'Il suffit de rechercher une violation locale de la croissance stricte.',
        reasoning: ['Parcourir les indices de 1 à len(seq)-1.', 'Si seq[i] <= seq[i-1], renvoyer False immédiatement.', 'Si aucune violation n’est trouvée, renvoyer True après la boucle.'],
        expected: "def est_strict_croissante(seq):\n    for i in range(1, len(seq)):\n        if seq[i] <= seq[i - 1]:\n            return False\n    return True",
        traps: ['Mettre return True dans la boucle : seul le premier couple serait testé.', 'Tester < au lieu de <= et accepter deux valeurs égales.'],
        language: '« Strictement » implique que l’égalité invalide la propriété.'
      }, ['Une seule paire mal ordonnée suffit à répondre False.', 'Quel opérateur détecte à la fois une baisse et une égalité ?', 'Le True n’arrive qu’après le parcours complet.'], ['test <= correct','False anticipé','True après la boucle']),
      q('q11','11','Complète la logique de llsc_fin(tab, i), qui renvoie la longueur maximale d’une sous-séquence strictement croissante se terminant exactement à l’indice i. Cas de base : i=0. Pour chaque j<i compatible, prolonge la meilleure sous-séquence finissant en j.', 'code', {
        recognize: 'La récurrence est : meilleur(i)=max(1, meilleur(j)+1 pour j<i et tab[j]<tab[i]).',
        reasoning: ['Au premier indice, la meilleure longueur vaut 1.', 'Initialiser max_len à 1 pour la sous-séquence contenant seulement tab[i].', 'Explorer tous les j antérieurs.', 'Un j est prolongeable seulement si tab[j] < tab[i].'],
        expected: "def llsc_fin(tab, i):\n    if i == 0:\n        return 1\n    max_len = 1\n    for j in range(i):\n        if tab[j] < tab[i]:\n            max_len = max(max_len, llsc_fin(tab, j) + 1)\n    return max_len",
        traps: ['Comparer tab[j] à tab[j-1] : la condition porte sur le dernier élément choisi, tab[i].', 'Oublier +1 lors de l’ajout de tab[i].'],
        language: 'Dans la justification, identifier explicitement le sous-problème « se terminant en i ».'
      }, ['Que vaut la meilleure longueur au premier élément ?', 'La sous-séquence précédente doit se terminer sur une valeur plus petite que tab[i].', 'Ajouter tab[i] augmente la longueur de 1.'], ['cas de base correct','condition tab[j] < tab[i]','appel récursif +1','maximum conservé']),
      q('q12','12','Écris la version dynamique llsc_dyn(tab) avec dyn[i] = longueur d’une meilleure sous-séquence strictement croissante se terminant en i. dyn est initialisé à 1 partout ; pour chaque i, examine tous les j<i compatibles, puis renvoie la meilleure valeur de dyn.', 'code', {
        recognize: 'On mémorise exactement les sous-problèmes que la version récursive recalculait.',
        reasoning: ['Chaque élément seul donne une longueur 1.', 'Pour j<i avec tab[j]<tab[i], une solution finissant en j peut être prolongée.', 'Mettre à jour dyn[i] avec max(dyn[i], dyn[j]+1).', 'Le résultat global est max(dyn).'],
        expected: "def llsc_dyn(tab):\n    n = len(tab)\n    dyn = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if tab[j] < tab[i]:\n                dyn[i] = max(dyn[i], dyn[j] + 1)\n    return max(dyn)",
        traps: ['Écraser dyn[i] sans prendre le maximum : une mauvaise transition pourrait remplacer une meilleure solution.', 'Retourner dyn[-1] : la meilleure sous-séquence ne se termine pas nécessairement au dernier élément.'],
        language: 'Le mot-clé conceptuel est « mémorisation des sous-problèmes » ; ici elle est réalisée par le tableau dyn.'
      }, ['Que signifie précisément dyn[i] ?', 'La transition possible depuis j ajoute 1 à dyn[j].', 'La meilleure LSSC globale peut finir à n’importe quel indice.'], ['initialisation à 1','transition max correcte','condition de croissance','maximum global renvoyé'])
    ]
  }
];

export const bacExamStudioPackByKey = new Map(bacExamStudioPacks.map(pack => [pack.key, pack]));
export const bacExamStudioPackKeysBySubject = new Map();
for (const pack of bacExamStudioPacks) {
  const keys = bacExamStudioPackKeysBySubject.get(pack.subjectId) || [];
  keys.push(pack.key);
  bacExamStudioPackKeysBySubject.set(pack.subjectId, keys);
}
