/* PYTHON//FORGE V1.7 — Editorial Reference Bank
   Goal: an exercise must be understandable without guessing from a function name,
   starter code, or hidden tests. Every brief makes the data, operation, result,
   edge cases and first reasoning step explicit.
*/

const MODULE_GUIDE = {
  P1:{focus:'valeurs, variables, types et expressions',before:'Repère les données déjà disponibles. Dis ensuite, en français, quelle opération transforme ces données en résultat. Si une formule extérieure à la programmation est utile, elle doit être donnée dans l’énoncé.',check:'Peux-tu calculer à la main le résultat d’un exemple très simple avant d’exécuter Python ?',mistake:'Confondre affectation (=) et comparaison (==), ou appliquer une opération sans avoir identifié le type des valeurs.'},
  P2:{focus:'conditions et logique booléenne',before:'Écris d’abord la règle sous forme d’une phrase : « le résultat est vrai si… ». Repère ensuite les seuils et les cas frontières avant d’écrire if / elif / else.',check:'Que doit-il se passer juste avant le seuil, exactement au seuil et juste après ?',mistake:'Oublier une borne incluse, inverser and/or, ou tester les cas dans un ordre qui rend une branche inaccessible.'},
  P3:{focus:'boucles, compteurs et accumulateurs',before:'Identifie ce qui doit être répété, la donnée examinée à chaque tour et la variable qui mémorise l’avancement ou le résultat. Pour while, précise ce qui rapproche de l’arrêt.',check:'Après un tour de boucle, que représente exactement le compteur ou l’accumulateur ?',mistake:'Modifier la mauvaise variable dans la boucle ou oublier de faire progresser un while vers sa condition d’arrêt.'},
  P4:{focus:'fonctions, contrats et tests',before:'Sépare le contrat de l’algorithme : paramètres reçus, précondition éventuelle, valeur renvoyée. Prépare ensuite un cas normal, un cas frontière et un cas qui ferait échouer une solution presque correcte.',check:'Peux-tu décrire la fonction sans montrer son code : « elle reçoit…, elle renvoie… » ?',mistake:'Écrire du code avant d’avoir fixé le contrat, ou ne tester que le cas le plus facile.'},
  P5:{focus:'chaînes de caractères',before:'Décide si tu dois parcourir les caractères, leurs indices, ou construire une nouvelle chaîne. Écris ce que représente chaque caractère traité.',check:'Que doit produire la fonction pour une chaîne vide, un seul caractère ou un caractère particulier ?',mistake:'Confondre un caractère et son indice, ou supposer qu’une chaîne se modifie comme une liste.'},
  P6:{focus:'listes et tableaux',before:'Repère si la liste reçue doit rester intacte, être modifiée, ou servir à construire une nouvelle liste. Décide si tu parcours les valeurs, les indices, ou les deux.',check:'Que vaut le résultat pour une liste vide ou réduite à un seul élément ?',mistake:'Modifier involontairement la liste d’entrée, mal gérer les indices ou oublier le premier/dernier élément.'},
  P7:{focus:'tuples et dictionnaires',before:'Pour un dictionnaire, nomme explicitement ce qui joue le rôle de clé et ce qui joue le rôle de valeur. Pour un tuple, précise l’ordre et le sens de chaque composante.',check:'Quelle information permet d’accéder directement à la donnée recherchée ?',mistake:'Confondre clé et valeur, oublier d’initialiser une nouvelle clé, ou inverser les composantes d’un tuple.'},
  P8:{focus:'données tabulaires et CSV',before:'Décris une ligne de la table : quelles clés existent et que signifie chaque champ ? Puis sépare clairement filtrer, chercher, trier ou associer.',check:'La fonction doit-elle renvoyer une ligne, plusieurs lignes, un résumé ou None ?',mistake:'Modifier la table source alors qu’une nouvelle table est attendue, ou utiliser la mauvaise clé de dictionnaire.'},
  P9:{focus:'algorithmes classiques de recherche et de tri',before:'Écris l’idée de l’algorithme en français avant le code. Pour la dichotomie, vérifie la précondition de tri et précise comment l’intervalle de recherche rétrécit.',check:'Après une étape, quelle partie des données reste encore pertinente ?',mistake:'Oublier une précondition, ne pas réduire strictement la zone de recherche, ou modifier l’original lorsqu’une copie est demandée.'},
  T1:{focus:'récursivité',before:'Écris le cas de base avant l’appel récursif. Identifie ensuite une quantité qui diminue strictement à chaque appel et explique comment le résultat remonte.',check:'Quel appel atteint le cas de base et quelle valeur est alors renvoyée ?',mistake:'Appeler récursivement avec un problème de même taille ou oublier le cas de base.'},
  T2:{focus:'programmation objet',before:'Sépare l’état de l’objet (attributs) de ses actions (méthodes). Pour chaque méthode, précise quels attributs elle lit ou modifie.',check:'Deux instances différentes conservent-elles bien des états indépendants ?',mistake:'Oublier self, stocker une donnée dans une variable locale au lieu d’un attribut, ou partager accidentellement un état.'},
  T3:{focus:'types abstraits, piles et files',before:'Commence par l’ordre de sortie attendu : LIFO pour une pile, FIFO pour une file. Ensuite seulement choisis comment la liste Python réalise ces opérations.',check:'Quel élément doit sortir en premier après trois ajouts successifs ?',mistake:'Mélanger FIFO et LIFO ou raisonner sur la représentation interne avant l’interface abstraite.'},
  T4:{focus:'arbres binaires et ABR',before:'Traite d’abord le cas arbre vide. Pour un arbre non vide, sépare la valeur du nœud courant et les deux sous-arbres. Pour un ABR, utilise explicitement la propriété d’ordre.',check:'Que renvoie la fonction pour None, puis pour un arbre réduit à sa racine ?',mistake:'Oublier le cas None, inverser gauche/droite ou parcourir inutilement les deux côtés d’un ABR.'},
  T5:{focus:'graphes et parcours',before:'Identifie les sommets, les voisins et la représentation du graphe. Prévois une structure visites avant de parcourir afin d’éviter les cycles.',check:'À quel moment marques-tu un sommet comme visité, et pourquoi ?',mistake:'Marquer trop tard les sommets visités et provoquer des doublons, ou confondre pile DFS et file BFS.'},
  T6:{focus:'modèle relationnel, SQL et Python',before:'Écris d’abord la question sur les données : table(s), colonne(s), lignes à conserver, relation de jointure éventuelle. Ensuite seulement traduis-la en SQL.',check:'Quelles lignes doivent être conservées et quelles colonnes doivent apparaître dans le résultat ?',mistake:'Confondre nom de table et nom de colonne, oublier la condition de jointure ou concaténer un paramètre SQL au lieu de le transmettre séparément.'},
  T7:{focus:'modularité, tests et débogage',before:'Formule le comportement attendu, puis construis le plus petit exemple qui reproduit le défaut. Ne change qu’une cause à la fois.',check:'Quel test échoue avant la correction et réussit après ?',mistake:'Corriger au hasard plusieurs lignes ou masquer le symptôme sans traiter la cause.'},
  T8:{focus:'paradigmes et fonctions comme données',before:'Repère quelles valeurs sont elles-mêmes des fonctions. Écris l’ordre exact des appels avant de programmer.',check:'À quel moment une fonction est-elle appelée, et à quel moment est-elle seulement transmise ou renvoyée ?',mistake:'Écrire f au lieu de f(x), ou appeler une fonction que l’on devait seulement renvoyer comme valeur.'},
  T9:{focus:'diviser pour régner et complexité',before:'Décris les trois phases : diviser en sous-problèmes plus petits, résoudre, puis combiner. Vérifie que la taille diminue réellement.',check:'Quel est le cas de base et comment les résultats partiels sont-ils combinés ?',mistake:'Découper sans cas de base, recombiner dans le mauvais ordre ou modifier les listes sources alors qu’un nouveau résultat est attendu.'},
  T10:{focus:'programmation dynamique',before:'Définis en une phrase ce que signifie un état mémorisé. Identifie ensuite les états plus petits nécessaires pour le calculer.',check:'Que signifie exactement une case de la table ou une entrée du mémo ?',mistake:'Mémoriser une valeur sans savoir ce qu’elle représente ou recalculer les mêmes sous-problèmes au lieu de réutiliser leur résultat.'},
  T11:{focus:'recherche textuelle',before:'Distingue le texte, le motif et la position courante. Lors d’un échec de comparaison, précise l’information déjà acquise qui autorise un décalage.',check:'À partir de quelle position du texte compare-t-on le motif, et comment décide-t-on du prochain décalage ?',mistake:'Confondre indice dans le motif et indice dans le texte, ou avancer d’une valeur qui peut faire manquer une occurrence.'}
};

const KIND_GUIDE = {
  'compléter':'Le squelette contient déjà une partie de l’algorithme. Tu dois uniquement remplacer les zones manquantes ou incomplètes, sans changer l’interface fournie.',
  'déboguer':'Le programme fourni contient volontairement un défaut. Commence par expliquer ce qui ne respecte pas le contrat, puis corrige la cause avec le minimum de modifications.',
  'écrire':'Tu dois écrire le corps de la fonction ou des méthodes demandées en respectant exactement le contrat décrit ci-dessous.',
  'transfert':'Le contexte est différent des exemples du cours, mais les mêmes idées informatiques s’appliquent. Reformule d’abord le problème puis choisis la structure adaptée.',
  'application':'Lis l’ensemble de la mission avant de coder. Découpe l’application en sous-problèmes, valide chaque partie séparément puis vérifie leur coopération.'
};

/* Hand-curated meanings for names that are otherwise too opaque for a novice. */
const EXACT_PARAM = {
  'total:prix':'prix unitaire d’un article (nombre)', 'total:quantite':'nombre d’articles achetés',
  'celsius:f':'température exprimée en degrés Fahrenheit',
  'est_pair:n':'entier dont on veut déterminer la parité',
  'dans_intervalle:x':'valeur à tester', 'dans_intervalle:a':'borne gauche de l’intervalle', 'dans_intervalle:b':'borne droite de l’intervalle',
  'mention:note':'note numérique à classer selon les seuils donnés',
  'bissextile:annee':'année entière dont on teste le caractère bissextile',
  'somme:valeurs':'liste des nombres à additionner',
  'compte:valeurs':'liste à parcourir', 'compte:cible':'valeur dont on veut compter les occurrences',
  'compte:tab':'liste à parcourir', 'compte:x':'valeur recherchée dans la liste', 'compte:i':'indice courant utilisé par la récursion',
  'divisions_par_2:n':'entier positif que l’on divise successivement par 2',
  'maximum:a':'première valeur à comparer', 'maximum:b':'seconde valeur à comparer',
  'indice_premier:tab':'liste dans laquelle chercher', 'indice_premier:cible':'valeur dont on cherche la première occurrence',
  'moyenne:tab':'liste non vide des valeurs dont on calcule la moyenne',
  'carres:n':'nombre d’entiers à traiter ; on considère 0, 1, …, n-1',
  'indice_max:tab':'liste non vide dans laquelle on cherche la position du maximum',
  'diagonale:m':'matrice carrée représentée par une liste de listes',
  'bornes:a':'première valeur à ordonner', 'bornes:b':'seconde valeur à ordonner',
  'frequences:tab':'collection dont chaque valeur doit être comptée',
  'meilleur:notes':'dictionnaire prénom → note, supposé non vide',
  'admis:table':'table représentée par une liste de dictionnaires possédant notamment les clés nom et note',
  'cherche:table':'liste de dictionnaires représentant les lignes de la table', 'cherche:identifiant':'identifiant à comparer avec la clé id de chaque ligne',
  'associe:noms':'première table contenant les clés id et nom', 'associe:groupes':'seconde table contenant les clés id et groupe',
  'minimum:tab':'liste non vide de valeurs comparables',
  'indice_dicho:tab':'liste triée par ordre croissant', 'indice_dicho:x':'valeur recherchée dans la liste triée',
  'tri_selection:tab':'liste à trier ; la liste originale doit rester inchangée',
  'somme_n:n':'entier supérieur ou égal à 0 ; on veut additionner les entiers de 1 à n',
  'puissance:a':'base de la puissance', 'puissance:n':'exposant entier supérieur ou égal à 0',
  'equilibrees:texte':'chaîne dans laquelle seules les parenthèses ( et ) sont significatives',
  'taille:a':'racine de l’arbre binaire, ou None pour l’arbre vide',
  'infixe:a':'racine de l’arbre binaire à parcourir en ordre infixe',
  'applique_deux_fois:f':'fonction à appliquer deux fois', 'applique_deux_fois:x':'valeur de départ passée à la fonction',
  'garde:f':'fonction prédicat : elle renvoie True pour les valeurs à conserver', 'garde:tab':'liste des valeurs à filtrer',
  'compose:f':'fonction appliquée en second', 'compose:g':'fonction appliquée en premier',
  'fusion:a':'première liste déjà triée', 'fusion:b':'seconde liste déjà triée',
  'tri_fusion:tab':'liste à trier par la stratégie diviser pour régner',
  'moities:n':'entier positif que l’on remplace successivement par n // 2',
  'sql_par_id:cur':'curseur de base de données compatible sqlite3', 'sql_par_id:identifiant':'identifiant transmis comme paramètre de la requête SQL',
  'double_sans_modifier:tab':'liste source qui doit rester inchangée',
  'dans_zone:x':'entier à tester par rapport à l’intervalle 0..9',
  'est_strictement_croissante:tab':'liste dont on compare chaque paire de voisins',
  'normalise:texte':'texte du message à mettre en minuscules et dont les tirets deviennent des espaces',
  'frequences_mots:texte':'texte déjà séparé en mots par des espaces',
  'a_revoir:messages':'liste de dictionnaires contenant auteur et texte', 'a_revoir:interdits':'ensemble des mots qui déclenchent un signalement',
  'accessibles:g':'graphe représenté par un dictionnaire sommet → liste de voisins', 'accessibles:depart':'sommet à partir duquel lancer le parcours',
  'distance:g':'graphe non pondéré représenté par les listes de voisins', 'distance:depart':'sommet de départ', 'distance:arrivee':'sommet dont on cherche la distance minimale',
  'compte_niveaux:journal':'liste chronologique de dictionnaires heure/niveau/message',
  'erreurs:journal':'journal d’événements dont on ne garde que les lignes ERROR',
  'premiere_heure:journal':'journal à parcourir dans son ordre actuel', 'premiere_heure:niveau':'niveau recherché, par exemple ERROR ou INFO'
};

const NAME_HINTS = [
  [/^(tab|tableau|liste|valeurs|points|etats|notes|donnees)$/i,'liste Python à parcourir ou analyser'],
  [/^(table|lignes|journal|messages)$/i,'collection de lignes structurées, le plus souvent des dictionnaires'],
  [/^(texte|chaine|mot|pseudo|couleur|message|motif)$/i,'chaîne de caractères utilisée par l’algorithme'],
  [/^(cible|x)$/i,'valeur recherchée, testée ou transformée selon la mission'],
  [/^(n|age|annee|duree|taille|longueur|niveau|quantite|indice|seuil|depart|cout|bonus|numero|montant|solde)$/i,'valeur numérique dont le rôle précis est donné dans la mission'],
  [/^(urgent|silencieux|autorisation|chiffre|interdit|actif|valide)$/i,'booléen : True ou False'],
  [/^(f|g|fonction|predicat)$/i,'fonction Python reçue comme donnée'],
  [/^(graphe|reseau|g)$/i,'graphe ou réseau fourni sous la représentation décrite par la mission'],
  [/^(arbre|racine|noeud|a)$/i,'structure ou valeur dont le sens dépend du contrat affiché'],
  [/^(cur|curseur)$/i,'curseur de base de données utilisé pour exécuter une requête SQL'],
  [/^(i|j|m)$/i,'indice entier utilisé pour parcourir ou découper une structure']
];

function stripMarkup(value='') {
  return String(value)
    .replace(/<code>(.*?)<\/code>/g,'`$1`')
    .replace(/<[^>]+>/g,'')
    .replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&')
    .replace(/\s+/g,' ').trim();
}
function esc(value='') { return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function rich(value='') {
  return esc(value).replace(/`([^`]+)`/g,'<code>$1</code>');
}
function code(value='') { return `<code>${esc(value)}</code>`; }

function parseInterface(starter='') {
  const items=[];
  let currentClass=null;
  for(const raw of String(starter).split('\n')) {
    let m=raw.match(/^class\s+([A-Za-z_]\w*)/);
    if(m){ currentClass=m[1]; items.push({type:'class',name:m[1],args:[]}); continue; }
    m=raw.match(/^(\s*)def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:/);
    if(!m) continue;
    const indent=m[1].length;
    const args=m[3].split(',').map(x=>x.trim().split('=')[0].trim()).filter(x=>x && x!=='self');
    if(indent>0 && currentClass) items.push({type:'method',owner:currentClass,name:m[2],args});
    else { currentClass=null; items.push({type:'function',name:m[2],args}); }
  }
  return items;
}

function exactParamKey(item,name){ return `${item.name}:${name}`; }
function describeParam(name,item,task,moduleId) {
  const exact=EXACT_PARAM[exactParamKey(item,name)];
  if(exact) return exact;
  const lower=task.toLowerCase();
  if(name==='tab' && /trié/.test(lower)) return 'liste supposée triée selon la règle indiquée dans la mission';
  if(name==='table') return 'table représentée par une liste de dictionnaires ; les clés utiles sont précisées dans la mission';
  if(name==='a' || name==='b') {
    if(moduleId==='T9' || /liste/.test(lower)) return 'liste ou sous-liste utilisée par l’algorithme ; son rôle est précisé par la mission';
    return 'valeur à comparer ou combiner avec l’autre paramètre';
  }
  for(const [re,text] of NAME_HINTS) if(re.test(name)) return text;
  return `donnée nommée ${name}, fournie lors de l’appel ; sa signification est donnée par la mission ci-dessus`;
}

function extractResultRule(task,items) {
  const text=stripMarkup(task);
  const patterns=[
    /\bqui\s+(?:doit\s+)?(?:renvoie|retourne)\s+(.+?)(?:\.|$)/i,
    /\b(?:renvoie|retourne)\s+(.+?)(?:\.|$)/i,
    /\bdoit\s+(?:produire|donner)\s+(.+?)(?:\.|$)/i,
    /\bconserve\s+(.+?)(?:\.|$)/i
  ];
  for(const re of patterns){
    const m=text.match(re); if(m) return `La valeur produite doit être ${m[1].replace(/^un\s+/i,'un ').trim()}.`;
  }
  if(items.some(x=>x.type==='class')) return 'Le résultat attendu est le comportement observable de l’objet : ses attributs et méthodes doivent évoluer exactement comme l’indiquent la mission et les cas de validation.';
  if(/requête|sql/i.test(text)) return 'La fonction doit produire ou exécuter la requête SQL décrite, avec les colonnes, conditions et paramètres indiqués.';
  if(/corrige|débog/i.test(text)) return 'Après correction, le programme doit respecter tous les cas de validation sans modifier les tests.';
  return 'La fonction doit produire la valeur décrite par la mission ; les exemples de validation ci-dessous rendent ce résultat concret.';
}

function extractConstraints(task='') {
  const text=stripMarkup(task);
  const parts=text.split(/(?<=[.!?])\s+/);
  const keys=/(sans |ne .* pas|aucun |strictement|inclus|interdit|assert|trié|triée|vide|premi|dernier|exactement|au moins|au plus|seuil|ordre|copie|inchangé|inchangée|non vide)/i;
  const found=parts.filter(p=>keys.test(p));
  return [...new Set(found)].slice(0,5);
}

function friendlyExamples(tests=[]) {
  return tests.slice(0,4).map(t=>{
    const expr=String(t.expr||'').trim();
    const simple=expr && expr.length<=120 && !/(lambda|__import__|Mock\(|setattr\(|assert_called)/.test(expr);
    return {
      label:t.label || 'cas de validation',
      expression:simple ? expr : '',
      raises:t.raises || ''
    };
  });
}

function detectEdgeCases(tests=[]){
  const words=[];
  for(const t of tests){
    const l=String(t.label||'').toLowerCase();
    if(/vide/.test(l)) words.push('collection vide');
    if(/borne|seuil|extrémité|0 inclus|9 inclus|égalité/.test(l)) words.push('valeur frontière / égalité');
    if(/absent|aucun|inaccessible|inconnu/.test(l)) words.push('élément absent ou cas sans solution');
    if(/un seul|1×1|taille 1|cas base/.test(l)) words.push('cas minimal');
    if(/négatif/.test(l)) words.push('valeur négative');
    if(/original|entrée intacte|préserv/.test(l)) words.push('absence d’effet de bord sur l’entrée');
    if(t.raises) words.push(`erreur attendue : ${t.raises}`);
  }
  return [...new Set(words)].slice(0,4);
}

function interfaceParams(items,task,moduleId){
  const out=[];
  for(const item of items){
    for(const name of item.args){
      const key=`${item.type}:${item.owner||''}:${item.name}:${name}`;
      out.push({key,name,owner:item.owner||'',callable:item.name,description:describeParam(name,item,task,moduleId)});
    }
  }
  return [...new Map(out.map(x=>[x.key,x])).values()];
}

function actionNarrative(ex,items,resultRule){
  const task=stripMarkup(ex.prompt);
  const kind=ex.kind || 'écrire';
  const interfaceName=items.find(x=>x.type==='function')?.name || items.find(x=>x.type==='class')?.name || '';
  const start = kind==='déboguer'
    ? 'Le code affiché est volontairement incorrect : ton objectif est d’identifier précisément le défaut puis de rétablir le contrat.'
    : kind==='compléter'
      ? 'Une partie de la solution est déjà écrite : complète uniquement les éléments manquants.'
      : kind==='application'
        ? 'Cette activité assemble plusieurs compétences : traite-la comme un petit cahier des charges.'
        : `Tu dois construire${interfaceName ? ` ${interfaceName}` : ' le programme demandé'} à partir du contrat ci-dessous.`;
  return `${start} ${task} ${resultRule}`;
}

function moduleIdOf(ex,module) { return module?.id || ex.moduleId || String(ex.id||'').split('-')[0]; }

export function buildExerciseBrief(ex,module=null) {
  const moduleId=moduleIdOf(ex,module);
  const guide=MODULE_GUIDE[moduleId] || {focus:'programmation Python',before:'Reformule le problème, repère les entrées et la sortie attendue avant de coder.',check:'Peux-tu annoncer le résultat attendu pour un exemple simple ?',mistake:'Coder avant d’avoir compris les données et le résultat attendu.'};
  const task=stripMarkup(ex.prompt);
  const items=parseInterface(ex.starter);
  const params=interfaceParams(items,task,moduleId);
  const resultRule=extractResultRule(task,items);
  const constraints=extractConstraints(ex.prompt);
  const examples=friendlyExamples(ex.tests||[]);
  const edges=detectEdgeCases(ex.tests||[]);
  const kind=ex.kind||'écrire';
  return {
    id:ex.id,title:ex.title,moduleId,task,focus:guide.focus,kind,
    kindInstruction:KIND_GUIDE[kind]||KIND_GUIDE['écrire'],
    interface:items,params,resultRule,constraints,examples,edges,
    narrative:actionNarrative(ex,items,resultRule),
    before:guide.before,check:guide.check,mistake:guide.mistake,
    testCount:(ex.tests||[]).length
  };
}

function interfaceHTML(items){
  if(!items.length) return '<li><strong>Programme :</strong> complète le code fourni sans modifier son interface extérieure.</li>';
  return items.map(item=>{
    if(item.type==='class') return `<li><strong>Classe :</strong> ${code(item.name)}</li>`;
    if(item.type==='method') return `<li><strong>Méthode :</strong> ${code(`${item.owner}.${item.name}(${item.args.join(', ')})`)}</li>`;
    return `<li><strong>Fonction :</strong> ${code(`${item.name}(${item.args.join(', ')})`)}</li>`;
  }).join('');
}

export function exerciseBriefHTML(ex,module=null) {
  const b=buildExerciseBrief(ex,module);
  const paramsHtml=b.params.length
    ? `<div class="brief-sub"><strong>Données reçues</strong><ul>${b.params.map(p=>`<li>${code(p.name)} — ${esc(p.description)}</li>`).join('')}</ul></div>`
    : '<div class="brief-sub"><strong>Données reçues</strong><p>Aucun paramètre supplémentaire : utilise les données ou attributs déjà présents dans le squelette.</p></div>';
  const constraints=b.constraints.length
    ? b.constraints.map(x=>`<li>${rich(x)}</li>`).join('')
    : '<li>Conserve les noms et signatures fournis.</li><li>Ne modifie pas les tests pour obtenir artificiellement une réussite.</li>';
  const examples=b.examples.map(x=>{
    if(x.raises) return `<li><strong>${esc(x.label)} :</strong> l’appel doit provoquer ${code(x.raises)}.</li>`;
    if(x.expression) return `<li><strong>${esc(x.label)} :</strong> ${code(x.expression)}</li>`;
    return `<li><strong>${esc(x.label)} :</strong> vérifie ce cas avec les données correspondantes dans le test automatique.</li>`;
  }).join('') || '<li>Construis d’abord un exemple simple dont tu peux prévoir le résultat à la main.</li>';
  const edges=b.edges.length ? `<div class="brief-sub"><strong>Cas frontières à ne pas oublier</strong><ul>${b.edges.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>` : '';

  return `<section class="exercise-brief" aria-label="Énoncé détaillé de ${esc(ex.title)}">
    <div class="brief-kicker">ÉNONCÉ DE RÉFÉRENCE · ${esc(b.focus)}</div>
    <div class="brief-task"><strong>Ce que tu dois réellement faire</strong><p>${rich(b.narrative)}</p><p class="brief-kind">${esc(b.kindInstruction)}</p></div>
    <div class="brief-grid">
      <div class="brief-panel"><strong>1 · Contrat précis</strong><ul>${interfaceHTML(b.interface)}</ul>${paramsHtml}<div class="brief-sub"><strong>Valeur ou effet attendu</strong><p>${rich(b.resultRule)}</p></div></div>
      <div class="brief-panel"><strong>2 · Avant d’écrire du Python</strong><ol><li>Reformule en une phrase ce que reçoit le programme et ce qu’il doit produire.</li><li>${esc(b.before)}</li><li>${esc(b.check)}</li><li>Choisis un exemple ci-contre et prédis son résultat sans lancer le code.</li></ol><div class="brief-sub"><strong>Erreur classique à éviter</strong><p>${esc(b.mistake)}</p></div></div>
      <div class="brief-panel"><strong>3 · Vérifications concrètes</strong><div class="brief-sub brief-sub-first"><strong>Contraintes</strong><ul>${constraints}</ul></div>${edges}<div class="brief-sub"><strong>Exemples contrôlés</strong><ul>${examples}</ul><p class="brief-note">Les ${b.testCount} test${b.testCount>1?'s':''} automatiques vérifient le contrat. Lis leurs intitulés : ils servent aussi de documentation.</p></div></div>
    </div>
    <details class="brief-success"><summary>Critères de réussite — au-delà du bouton « Tester »</summary><ul><li>Je peux expliquer chaque paramètre sans me servir uniquement de son nom.</li><li>Je peux annoncer le type de résultat ou l’effet attendu avant d’exécuter.</li><li>Je sais justifier mon choix de condition, boucle, structure de données ou stratégie algorithmique.</li><li>Les tests passent sans être modifiés, y compris les cas frontières.</li><li>Je peux expliquer une erreur que mon code aurait pu produire et comment je l’ai évitée.</li></ul></details>
  </section>`;
}
