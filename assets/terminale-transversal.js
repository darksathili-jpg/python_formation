export const terminaleDependencies = [
  { id:'T1', recall:['P4 · fonctions et contrats','P6 · parcours de listes'], unlocks:['T4','T9','T10'], bridge:'La récursion sera réutilisée pour les arbres, le diviser pour régner et certaines formulations top-down.' },
  { id:'T2', recall:['P4 · fonctions','P6 · objets mutables'], unlocks:['T3','T4'], bridge:'Les objets servent ensuite à représenter proprement une structure abstraite ou un nœud d’arbre.' },
  { id:'T3', recall:['T2 · classe / instance / méthode','P6 · listes'], unlocks:['T4','T5'], bridge:'Pile et file deviennent des outils de parcours ; l’interface reste distincte de son implémentation.' },
  { id:'T4', recall:['T1 · cas de base et sous-appel','T2 · objets','T3 · file'], unlocks:['T5'], bridge:'Un arbre prépare au raisonnement récursif sur des structures, mais un graphe pourra contenir cycles et chemins multiples.' },
  { id:'T5', recall:['T3 · pile / file','P7 · dictionnaires et ensembles'], unlocks:[], bridge:'DFS et BFS réinvestissent pile/file ; l’ensemble des visités devient indispensable à cause des cycles.' },
  { id:'T6', recall:['P7 · clés / valeurs','P8 · données tabulaires'], unlocks:['T7'], bridge:'Le modèle relationnel n’est ni une liste de dictionnaires Python ni une feuille de calcul ; SQL exprime des opérations sur des relations.' },
  { id:'T7', recall:['P4 · contrats et tests','P6 · alias / effets de bord'], unlocks:['T9','T10','T11'], bridge:'Une méthode de test et de diagnostic devient un outil transversal pour tous les algorithmes avancés.' },
  { id:'T8', recall:['P4 · fonctions','T7 · contrat / raisonnement'], unlocks:[], bridge:'Ce module est volontairement conceptuel : distinguer paradigmes, programme comme donnée et décidabilité sans surcharge syntaxique.' },
  { id:'T9', recall:['T1 · récursivité','P9 · coût et dichotomie'], unlocks:['T10'], bridge:'On découpe en sous-problèmes puis on combine ; le coût se justifie par tailles, niveaux et travail effectué.' },
  { id:'T10', recall:['T1 · récursivité','T9 · sous-problèmes'], unlocks:[], bridge:'La programmation dynamique devient pertinente lorsque des états identiques se répètent et que leurs résultats peuvent être réutilisés.' },
  { id:'T11', recall:['P5 · indices de chaînes','P7 · dictionnaires','T7 · tests'], unlocks:[], bridge:'On n’enregistre plus une solution de sous-problème : on exploite l’information d’un échec pour choisir un prochain alignement sûr.' }
];

export const canonicalVocabulary = [
  ['T1','cas de base','condition qui arrête la chaîne d’appels récursifs'],
  ['T2','instance / objet','objet concret créé à partir d’une classe'],
  ['T3','interface / implémentation','opérations promises / manière choisie pour les réaliser'],
  ['T4','sous-arbre','arbre formé à partir d’un fils et de tous ses descendants'],
  ['T5','visités','sommets déjà découverts, mémorisés pour éviter les revisites'],
  ['T6','relation','ensemble de tuples respectant un même schéma relationnel'],
  ['T7','test de régression','test conservé parce qu’il a déjà révélé un défaut'],
  ['T8','décidable','problème de décision pour lequel un algorithme termine sur toute entrée valide avec la bonne réponse'],
  ['T9','combiner','construire la réponse du problème à partir des réponses des sous-problèmes'],
  ['T10','état','description minimale d’un sous-problème dont on veut connaître la solution'],
  ['T11','alignement','position i du début du motif relativement au texte']
];

export const bac2027 = {
  written: {
    duration:'3 h 30',
    exercises:3,
    weight:'75 % de la note de spécialité',
    language:'2 points sur 20 portent sur la maîtrise de la langue, le raisonnement et un vocabulaire adapté.'
  },
  practical: {
    duration:'1 h',
    weight:'25 % de la note de spécialité',
    format:'Programmer sur ordinateur une application à partir d’un document fourni, avec dialogue avec un professeur-examinateur.'
  },
  scope:'PYTHON//FORGE prépare les compétences Python, structures de données, SQL et algorithmique couvertes par le site. Il ne remplace pas la préparation des rubriques systèmes, architectures et réseaux du programme.'
};

export const bacWrittenPrompts = [
  { id:'BAC-T1', moduleId:'T1', title:'Récursivité · expliquer la terminaison', prompt:'Une fonction récursive traite n puis appelle la même fonction avec n-1 jusqu’à 0. Explique pourquoi elle termine et ce que représente la remontée des appels.', criteria:['nommer le cas de base','identifier la diminution de n','distinguer descente des appels et remontée des résultats'] },
  { id:'BAC-T2', moduleId:'T2', title:'POO · vocabulaire précis', prompt:'À partir d’une classe Compte et de l’instruction c = Compte(50), explique la différence entre classe, instance, attribut et méthode.', criteria:['classe = modèle','c = instance / objet','attribut = état de l’objet','méthode = opération appelée sur l’objet'] },
  { id:'BAC-T3', moduleId:'T3', title:'Type abstrait · ne pas confondre interface et liste', prompt:'Pourquoi dire « une pile est une liste Python » est-il incorrect ? Donne les opérations qui caractérisent la pile et une implémentation possible.', criteria:['définir la pile par son interface','rappeler LIFO','présenter la liste comme une implémentation possible et non comme la définition'] },
  { id:'BAC-T4', moduleId:'T4', title:'Arbre · justifier un appel récursif', prompt:'Dans taille(a), que calcule exactement taille(a.gauche) ? Pourquoi le cas a is None doit-il être traité ?', criteria:['identifier le sous-arbre gauche complet','arbre vide comme cas de base','combinaison 1 + gauche + droite'] },
  { id:'BAC-T5', moduleId:'T5', title:'Graphe · visites et BFS', prompt:'Explique pourquoi on marque un sommet visité au moment où on l’enfile dans un BFS. Dans quel cadre ce BFS fournit-il une distance minimale ?', criteria:['éviter plusieurs insertions du même sommet','cycles / chemins multiples','graphe non pondéré pour la distance minimale en nombre d’arêtes'] },
  { id:'BAC-T6', moduleId:'T6', title:'SQL · clé étrangère et jointure', prompt:'Une relation eleve contient groupe_id et une relation groupe contient id. Explique le rôle des deux clés et ce que signifie la condition eleve.groupe_id = groupe.id dans une jointure.', criteria:['clé primaire groupe.id','clé étrangère eleve.groupe_id','jointure par égalité des valeurs liées'] },
  { id:'BAC-T7', moduleId:'T7', title:'Tests · du bug à la régression', prompt:'Un cas minimal révèle un bug de frontière. Décris une démarche de mise au point qui évite de corriger au hasard et explique pourquoi ce cas doit rester dans le jeu de tests.', criteria:['reproduire attendu / obtenu','formuler une hypothèse','instrumenter ou isoler','corriger une cause','conserver un test de régression'] },
  { id:'BAC-T8', moduleId:'T8', title:'Calculabilité · portée du problème de l’arrêt', prompt:'Explique pourquoi « on ne sait pas toujours rapidement si un programme termine » n’est pas une formulation suffisante du problème de l’arrêt.', criteria:['portée universelle : tout programme et toute entrée','absence d’algorithme décideur correct dans tous les cas','ne pas confondre indécidable et simplement lent ou difficile'] },
  { id:'BAC-T9', moduleId:'T9', title:'Diviser pour régner · justifier n log n', prompt:'Sans démonstration formelle, explique pourquoi le tri fusion effectue environ log₂(n) niveaux et un travail proportionnel à n à chaque niveau.', criteria:['taille divisée approximativement par deux','nombre de niveaux','tous les éléments sont fusionnés sur un niveau','produit qualitatif n × log₂(n)'] },
  { id:'BAC-T10', moduleId:'T10', title:'Programmation dynamique · définir l’état', prompt:'Avant d’écrire dp[i], quelles questions dois-tu être capable de résoudre ? Explique pourquoi un dictionnaire dans une fonction récursive ne suffit pas à caractériser la programmation dynamique.', criteria:['sens précis de l’état','cas initiaux','dépendances','ordre ou stratégie de calcul','réutilisation de résultats de sous-problèmes répétés'] },
  { id:'BAC-T11', moduleId:'T11', title:'Recherche textuelle · justifier un saut', prompt:'Lors d’un échec à l’indice j du motif, explique comment la dernière occurrence du mauvais caractère dans le motif peut justifier un décalage supérieur à 1 sans reprendre la recherche naïve.', criteria:['identifier i, j et le mauvais caractère','utiliser le prétraitement du motif','justifier un saut strictement positif','ne pas présenter le saut comme une formule magique'] }
];
