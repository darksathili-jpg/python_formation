const MODULE_GUIDE = {
  P1:{focus:'valeurs, variables, types et expressions',before:'Repère les données disponibles, puis écris l’expression qui transforme ces données en résultat. Ne cherche pas une formule non donnée : ici on évalue la traduction en Python.',check:'Peux-tu expliquer la valeur calculée par chaque expression avant de lancer le programme ?'},
  P2:{focus:'conditions et logique booléenne',before:'Traduis d’abord la règle en une phrase logique. Repère les cas frontières et l’ordre des tests avant d’écrire if / elif / else.',check:'Quels cas doivent donner True, False ou déclencher chaque branche ?'},
  P3:{focus:'boucles, compteurs et accumulateurs',before:'Décide ce qui doit être répété, quelle variable évolue à chaque tour et quelle condition garantit l’arrêt. Pour un parcours, identifie aussi la valeur accumulée.',check:'Quelle variable change à chaque tour et pourquoi la boucle finit-elle ?'},
  P4:{focus:'fonctions, contrats et tests',before:'Énonce le contrat avant le code : paramètres, résultat, précondition éventuelle, puis au moins un cas normal et un cas frontière.',check:'Quels tests distingueraient une solution correcte d’une solution presque correcte ?'},
  P5:{focus:'chaînes de caractères',before:'Détermine si tu dois lire les caractères, leurs indices ou construire une nouvelle chaîne. Vérifie toujours les cas chaîne vide et longueur 1 lorsque cela a du sens.',check:'As-tu besoin de la valeur du caractère, de sa position, ou des deux ?'},
  P6:{focus:'listes et tableaux',before:'Repère si l’algorithme doit lire la liste, la modifier ou construire une nouvelle liste. Prévois le comportement pour une liste vide et pour un seul élément.',check:'La fonction doit-elle modifier la liste reçue ou seulement produire un résultat ?'},
  P7:{focus:'tuples et dictionnaires',before:'Pour un dictionnaire, identifie clairement ce qui joue le rôle de clé et ce qui joue le rôle de valeur. Pour un tuple, repère les informations regroupées et leur ordre.',check:'Quelle information permet de retrouver directement la donnée recherchée ?'},
  P8:{focus:'données tabulaires et CSV',before:'Repère ce que représente une ligne, ce que représente une colonne et le champ qui sert de critère. Sépare lecture, filtrage, transformation et agrégation.',check:'Quelle colonne est l’entrée de la décision et quelle donnée doit être produite ?'},
  P9:{focus:'algorithmes classiques de recherche et de tri',before:'Écris l’invariant ou l’idée de l’algorithme en français avant le code. Pour une recherche dichotomique, vérifie explicitement que la collection est triée et que l’intervalle de recherche rétrécit.',check:'Après une étape, quelle partie du problème reste encore à traiter ?'},
  T1:{focus:'récursivité',before:'Identifie le cas de base puis la transformation qui rapproche strictement l’appel récursif de ce cas. Un appel récursif sans diminution mesurable est suspect.',check:'Quel est le cas de base et quelle quantité diminue à chaque appel ?'},
  T2:{focus:'programmation objet',before:'Distingue état de l’objet et comportement. Repère les attributs qui appartiennent à chaque instance et les méthodes qui doivent les lire ou les modifier.',check:'Quel état chaque objet doit-il mémoriser indépendamment des autres ?'},
  T3:{focus:'types abstraits, piles et files',before:'Commence par les opérations abstraites attendues : empiler/dépiler ou enfiler/défiler. Ensuite seulement, regarde comment la structure est implantée.',check:'Quelle opération doit être réalisée en premier : LIFO ou FIFO ?'},
  T4:{focus:'arbres binaires et ABR',before:'Raisonne sur un nœud puis sur ses sous-arbres. Pour un ABR, utilise la propriété d’ordre pour choisir le sous-arbre à explorer.',check:'Que faut-il faire lorsque le nœud courant est vide, puis lorsqu’il ne l’est pas ?'},
  T5:{focus:'graphes et parcours',before:'Identifie les sommets, les arêtes et la structure des voisins. Prévois un ensemble de sommets visités pour éviter répétitions et cycles.',check:'Comment garantis-tu qu’un sommet ne sera pas traité indéfiniment ?'},
  T6:{focus:'modèle relationnel et SQL',before:'Sépare la question métier de la requête : tables utiles, colonnes nécessaires, condition de sélection, jointure éventuelle, puis paramètres transmis depuis Python.',check:'Quelles lignes doivent être conservées et quelles colonnes doivent être renvoyées ?'},
  T7:{focus:'modularité, tests et débogage',before:'Isole le comportement fautif, formule le résultat attendu, puis choisis le plus petit test qui reproduit le défaut. Corrige la cause, pas seulement le symptôme.',check:'Quel test minimal échoue avant la correction et réussit après ?'},
  T8:{focus:'paradigmes et calculabilité',before:'Repère ce qui est donné comme fonction, donnée ou transformation. Ne confonds pas le mécanisme Python avec la propriété informatique que l’exercice veut faire observer.',check:'Quelle propriété informatique est réellement étudiée derrière la syntaxe Python ?'},
  T9:{focus:'diviser pour régner et complexité',before:'Décompose le problème en sous-problèmes plus petits, identifie le cas de base et la phase de combinaison. Vérifie que la taille diminue réellement.',check:'Quelles sont les trois étapes : diviser, résoudre, combiner ?'},
  T10:{focus:'programmation dynamique',before:'Définis précisément l’état mémorisé et ce qu’il signifie. Cherche ensuite la relation entre un état et des états plus petits déjà calculés.',check:'Que signifie une case de la table ou une entrée du mémo ?'},
  T11:{focus:'recherche textuelle',before:'Distingue texte, motif, position courante et règle de décalage. Lors d’un échec, précise ce que l’on sait déjà pour éviter de recommencer inutilement.',check:'Après une comparaison, de combien peut-on avancer sans manquer une occurrence ?'}
};

const PARAM_HINTS = [
  [/^(tab|tableau|valeurs|points|etats|notes|liste|donnees|lignes|mots)$/i,'collection Python à parcourir'],
  [/^(texte|chaine|mot|pseudo|couleur|motif|message)$/i,'chaîne de caractères'],
  [/^(n|age|annee|duree|taille|longueur|niveau|quantite|indice|seuil|depart|cout|bonus|numero)$/i,'valeur numérique utilisée par l’algorithme'],
  [/^(urgent|silencieux|autorisation|chiffre|interdit|actif|valide)$/i,'booléen (True / False)'],
  [/^(graphe|reseau)$/i,'structure représentant les voisins d’un graphe'],
  [/^(arbre|racine|noeud)$/i,'nœud ou arbre fourni par l’exercice'],
  [/^(connexion|conn|db|base)$/i,'connexion à la base de données']
];

const KIND_GUIDE = {
  'compléter':'Une partie du programme est déjà fournie. Complète uniquement ce qui manque en conservant le rôle des lignes existantes.',
  'déboguer':'Le programme fourni est volontairement incorrect. Repère la cause du défaut, explique-la, puis modifie le minimum de code nécessaire.',
  'écrire':'Construis toi-même le corps de la fonction en respectant exactement le contrat ci-dessous.',
  'transfert':'Réutilise les notions du module dans une situation un peu différente. Commence par reformuler le problème avant de coder.',
  'application':'Traite l’exercice comme une petite application : lis tout le document, découpe le travail en sous-problèmes, puis implémente et teste progressivement.'
};

function stripMarkup(value='') {
  return String(value)
    .replace(/<code>(.*?)<\/code>/g,'`$1`')
    .replace(/<[^>]+>/g,'')
    .replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&')
    .replace(/\s+/g,' ').trim();
}
function esc(value='') { return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function code(value='') { return `<code>${esc(value)}</code>`; }

function signatures(starter='') {
  const funcs = [...String(starter).matchAll(/^\s*def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:/gm)].map(m=>({type:'function',name:m[1],args:m[2].split(',').map(x=>x.trim().split('=')[0].trim()).filter(Boolean)}));
  const classes = [...String(starter).matchAll(/^\s*class\s+([A-Za-z_]\w*)/gm)].map(m=>({type:'class',name:m[1],args:[]}));
  return [...classes,...funcs];
}
function describeParam(name) {
  for (const [re,text] of PARAM_HINTS) if (re.test(name)) return text;
  return 'paramètre fourni à la fonction ; son rôle est précisé par la consigne et les cas de test';
}
function constraints(prompt='') {
  const text = stripMarkup(prompt);
  const parts = text.split(/(?<=[.!?])\s+/);
  const keys = /(sans |ne .* pas|aucun |strictement|inclus|interdit|assert|trié|triée|vide|premi|dernier|exactement|au moins|au plus|seuil|ordre)/i;
  const found = parts.filter(p=>keys.test(p));
  return [...new Set(found)].slice(0,4);
}
function examples(tests=[]) {
  return tests.slice(0,4).map(t=>{
    if (t.raises) return `${t.label} → doit provoquer ${t.raises}`;
    return t.label || 'cas de validation';
  });
}
function moduleIdOf(ex,module) { return module?.id || ex.moduleId || String(ex.id||'').split('-')[0]; }

export function buildExerciseBrief(ex,module=null) {
  const id = moduleIdOf(ex,module);
  const guide = MODULE_GUIDE[id] || {focus:'programmation Python',before:'Reformule le problème avec tes propres mots, repère les entrées, le résultat attendu et les cas limites avant de coder.',check:'Peux-tu annoncer le résultat attendu pour un exemple simple avant d’exécuter ?'};
  const sigs = signatures(ex.starter);
  const kind = ex.kind || 'écrire';
  const task = stripMarkup(ex.prompt);
  const params = sigs.flatMap(s=>s.args.map(name=>({name,description:describeParam(name)})));
  const uniqueParams = [...new Map(params.map(p=>[p.name,p])).values()];
  return {
    id:ex.id,
    task,
    focus:guide.focus,
    kind,
    kindInstruction:KIND_GUIDE[kind] || KIND_GUIDE['écrire'],
    signatures:sigs,
    params:uniqueParams,
    constraints:constraints(ex.prompt),
    examples:examples(ex.tests || []),
    before:guide.before,
    check:guide.check,
    testCount:(ex.tests || []).length
  };
}

export function exerciseBriefHTML(ex,module=null) {
  const b = buildExerciseBrief(ex,module);
  const sigHtml = b.signatures.length
    ? b.signatures.map(s=>s.type==='class'
      ? `<li><strong>Classe attendue :</strong> ${code(s.name)}</li>`
      : `<li><strong>Fonction attendue :</strong> ${code(`${s.name}(${s.args.join(', ')})`)}</li>`).join('')
    : '<li><strong>Programme attendu :</strong> complète le code fourni sans changer son interface extérieure.</li>';
  const paramsHtml = b.params.length
    ? `<div class="brief-sub"><strong>Entrées</strong><ul>${b.params.map(p=>`<li>${code(p.name)} — ${esc(p.description)}</li>`).join('')}</ul></div>`
    : '';
  const constraintsHtml = b.constraints.length
    ? `<div class="brief-sub"><strong>Contraintes à respecter</strong><ul>${b.constraints.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div>`
    : `<div class="brief-sub"><strong>Contraintes à respecter</strong><ul><li>Conserve les noms de fonctions, paramètres et classes déjà fournis.</li><li>Ne modifie pas les tests pour faire croire à une réussite.</li></ul></div>`;
  const examplesHtml = b.examples.length
    ? b.examples.map(x=>`<li>${esc(x)}</li>`).join('')
    : '<li>Commence par inventer un exemple simple dont tu connais le résultat à la main.</li>';
  return `<section class="exercise-brief" aria-label="Énoncé détaillé de ${esc(ex.title)}">
    <div class="brief-kicker">ÉNONCÉ DÉTAILLÉ · ${esc(b.focus)}</div>
    <div class="brief-task"><strong>Mission</strong><p>${esc(b.task)}</p><p class="brief-kind">${esc(b.kindInstruction)}</p></div>
    <div class="brief-grid">
      <div class="brief-panel"><strong>Contrat du programme</strong><ul>${sigHtml}</ul>${paramsHtml}<div class="brief-sub"><strong>Résultat attendu</strong><p>Le résultat renvoyé ou affiché doit respecter exactement la règle décrite dans la mission. La signature fournie fait partie du contrat : elle ne doit pas être renommée.</p></div></div>
      <div class="brief-panel"><strong>Avant de coder</strong><ol><li>Reformule la mission sans utiliser de syntaxe Python.</li><li>${esc(b.before)}</li><li>${esc(b.check)}</li><li>Prédis le résultat d’au moins un cas ci-dessous avant de cliquer sur « Tester ».</li></ol></div>
      <div class="brief-panel">${constraintsHtml}<div class="brief-sub"><strong>Cas que la validation vérifie</strong><ul>${examplesHtml}</ul><p class="brief-note">Les ${b.testCount} test${b.testCount>1?'s':''} automatiques vérifient le contrat ; ils ne remplacent pas ton explication.</p></div></div>
    </div>
    <details class="brief-success"><summary>Quand puis-je considérer l’exercice comme réussi ?</summary><ul><li>Je peux expliquer avec mes mots ce que reçoit le programme et ce qu’il doit produire.</li><li>Mon code respecte la signature et les contraintes de l’énoncé.</li><li>Les tests passent sans être modifiés.</li><li>Je sais expliquer pourquoi mon algorithme fonctionne sur un cas normal et sur un cas frontière.</li></ul></details>
  </section>`;
}
