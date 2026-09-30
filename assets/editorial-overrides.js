import { buildExerciseBrief, exerciseBriefHTML } from './exercise-brief.js';

/* Human-reviewed residuals found by the editorial gates.
   These overrides are deliberately exercise-specific: they replace the last
   generic formulations that cannot be inferred safely from syntax alone. */
const RESULT_OVERRIDES = {
  'P1-E1':'La fonction doit renvoyer un nombre égal au prix unitaire multiplié par la quantité achetée. Si la quantité vaut 0, le résultat doit être 0.',
  'P1-E3':'La fonction doit renvoyer un booléen : True lorsque n est divisible par 2, et False lorsqu’il ne l’est pas.',
  'P4-E1':'La fonction doit renvoyer la plus grande des deux valeurs a et b. Si a et b sont égales, elle renvoie cette valeur commune.',
  'P5-E1':'La fonction doit renvoyer un entier égal au nombre d’occurrences du caractère lettre dans texte. Si texte est vide ou si lettre n’apparaît pas, le résultat doit être 0.',
  'P5-X2':'La fonction doit renvoyer un entier égal au nombre de caractères # présents dans message. Un message vide ou ne contenant aucun # doit renvoyer 0.',
  'T1-E1':'La fonction doit renvoyer la somme des entiers de 0 à n inclus. Ainsi somme_n(0) renvoie 0, somme_n(1) renvoie 1 et somme_n(5) renvoie 15.',
  'T1-E2':'La fonction doit renvoyer le nombre d’occurrences de x parmi les éléments de tab situés de l’indice i jusqu’à la fin. Si i vaut len(tab), le résultat est 0.',
  'T1-E3':'La fonction doit renvoyer True si la portion de texte comprise entre les indices g et d inclus se lit de la même façon dans les deux sens, et False dès qu’une paire de caractères diffère. Si g >= d, elle renvoie True.',
  'T1-X1':'La fonction doit renvoyer une chaîne constituée de n répétitions successives de c. Lorsque n vaut 0, elle doit renvoyer la chaîne vide.',
  'T1-X2':'La fonction doit renvoyer le nombre d’éléments de tab restant à compter à partir de l’indice i inclus. Si i vaut len(tab), elle renvoie 0.',
  'T1-X4':'La fonction doit renvoyer la puissance entière a exposant n selon les règles récursives fournies. Pour n égal à 0, le résultat doit être 1.',
  'T3-E1':'La classe doit respecter l’ordre LIFO : depiler() renvoie le dernier élément empilé. est_vide() vaut True au départ et une tentative de dépiler une pile vide déclenche AssertionError.',
  'T3-E2':'La fonction doit renvoyer True seulement si toutes les parenthèses ouvrantes et fermantes de texte sont correctement appariées et imbriquées ; une fermeture trop tôt ou une ouverture restante donne False.',
  'T3-E3':'La file doit respecter FIFO : defiler() renvoie toujours l’élément présent depuis le plus longtemps. est_vide() est vrai seulement lorsque les deux piles internes sont vides.',
  'T3-X1':'PileCartes doit respecter LIFO : après avoir empilé A puis B, depiler() renvoie B ; est_vide() doit être vrai pour une nouvelle pile.',
  'T3-X2':'FileGuichet doit respecter FIFO : après l’arrivée de Ada puis Alan, le premier appel à defiler() renvoie Ada ; est_vide() décrit correctement l’absence de personne en attente.',
  'T3-X3':'Après correction, la classe File doit servir les éléments dans leur ordre d’arrivée : A puis B lorsque A a été enfilé avant B.',
  'T3-X4':'annuler(pile) doit renvoyer None si la pile est vide ; sinon la fonction retire et renvoie le dernier état empilé sans accéder aux attributs internes de la pile.',
  'T3-X5':'FileTickets doit conserver un comportement FIFO malgré ses deux piles internes : les tickets ressortent dans leur ordre d’arrivée, y compris après alternance d’ajouts et de retraits.',
  'T8-E1':'La fonction doit renvoyer f(f(x)) : elle applique une première fois f à x, puis applique une seconde fois la même fonction au résultat obtenu.',
  'T4-X5':'La fonction doit renvoyer la racine de l’ABR après insertion de x. Si l’arbre initial est vide, le nouveau nœud contenant x devient la racine ; sinon la racine existante est conservée.',
  'T11-X5':'La fonction doit renvoyer True si le motif apparaît dans le texte et False sinon. Le motif vide est considéré comme présent. La recherche doit utiliser la stratégie de Horspool simplifiée demandée.'
};

const PARAM_OVERRIDES = {
  'P1-X4':{
    effectif:'nombre total d’éléments disponibles avant de former les groupes complets',
    taille:'nombre d’éléments que doit contenir chaque groupe complet ; cette valeur est strictement positive'
  },
  'P2-E1':{
    x:'valeur numérique dont on vérifie qu’elle est comprise entre les deux bornes incluses a et b',
    a:'borne gauche ; elle est incluse dans les valeurs acceptées',
    b:'borne droite ; elle est incluse dans les valeurs acceptées'
  },
  'P3-E2':{
    valeurs:'liste dans laquelle on veut compter le nombre d’occurrences de la valeur cible',
    cible:'valeur recherchée ; chaque élément égal à cette valeur augmente le compteur'
  },
  'P6-X3':{
    objet:'nouvel élément à ajouter uniquement dans la copie de l’inventaire ; la liste inventaire reçue doit rester inchangée'
  },
  'P7-X2':{
    fichiers:'liste de chaînes contenant déjà les extensions à compter, par exemple ["py", "html", "py"] ; aucune extraction depuis des noms de fichiers complets n’est demandée'
  },
  'P7-X3':{
    scores:'dictionnaire associant le nom de chaque joueur à son score actuel',
    joueur:'nom du joueur dont le score doit être augmenté ; ce nom sert de clé dans scores',
    points:'nombre de points à ajouter au score actuel du joueur'
  },
  'P7-X5':{
    categories:'liste non vide de chaînes représentant les catégories observées ; en cas d’égalité de fréquence, la première catégorie rencontrée doit être conservée'
  },
  'P8-X1':{
    texte_csv:'chaîne contenant le texte CSV complet, avec une première ligne d’en-têtes ; les champs lus par DictReader restent des chaînes de caractères'
  },
  'P8-X5':{
    eleves:'table représentée par une liste de dictionnaires ; chaque ligne possède au minimum les champs id et nom',
    badges:'seconde table représentée par une liste de dictionnaires ; chaque ligne possède au minimum les champs id et badge, avec des id comparables à ceux de eleves'
  },
  'T1-E2':{
    tab:'liste dans laquelle la fonction récursive compte les occurrences de x sans utiliser de slice',
    x:'valeur dont on veut compter le nombre d’occurrences dans la partie de tab encore à examiner',
    i:'premier indice encore à examiner ; l’appel initial utilise normalement 0 et chaque appel récursif augmente i de 1'
  },
  'T1-E3':{
    texte:'chaîne de caractères dont on vérifie récursivement la symétrie entre deux indices',
    g:'indice gauche de la zone encore à vérifier ; il augmente de 1 lorsque les deux extrémités sont égales',
    d:'indice droit de la zone encore à vérifier ; il diminue de 1 lorsque les deux extrémités sont égales'
  },
  'T2-E3':{
    x:'abscisse numérique du point, stockée dans l’attribut self.x',
    y:'ordonnée numérique du point, stockée dans l’attribut self.y',
    a:'premier objet Point qui constitue une extrémité du segment',
    b:'second objet Point qui constitue l’autre extrémité du segment'
  },
  'T3-E1':{
    x:'élément quelconque à placer au sommet de la pile ; il doit devenir le prochain élément dépilé'
  },
  'T3-E2':{
    texte:'chaîne de caractères à analyser ; seuls les caractères parenthèse ouvrante et parenthèse fermante influencent la pile'
  },
  'T3-E3':{
    x:'élément à ajouter à l’arrière logique de la file ; il doit ressortir après les éléments enfilés avant lui'
  },
  'T3-X1':{
    carte:'valeur représentant la carte à placer au sommet de PileCartes ; la dernière carte empilée doit être la première dépilée'
  },
  'T3-X2':{
    personne:'valeur représentant la personne qui rejoint l’arrière de la file ; les personnes doivent être servies selon leur ordre d’arrivée'
  },
  'T3-X3':{
    x:'élément ajouté à la file par enfiler ; il doit être retiré après tous les éléments arrivés avant lui'
  },
  'T3-X4':{
    pile:'objet respectant l’interface empiler, depiler et est_vide ; la fonction annuler ne doit dépendre d’aucun attribut interne'
  },
  'T3-X5':{
    ticket:'ticket à placer dans la file ; les tickets doivent ressortir dans leur ordre d’arrivée'
  },
  'T5-E3':{
    g:'graphe non pondéré représenté par un dictionnaire sommet → liste de voisins',
    depart:'sommet à partir duquel commence le parcours en largeur',
    arrivee:'sommet cible dont on cherche la distance minimale depuis depart'
  },
  'P2-X1':{
    urgent:'booléen indiquant si la notification est urgente et doit donc être envoyée même en mode silencieux',
    silencieux:'booléen indiquant si le mode silencieux est actuellement activé'
  },
  'P2-X2':{
    age:'âge entier du joueur que l’on compare au seuil de 16 ans',
    autorisation:'booléen indiquant si le joueur possède une autorisation permettant l’accès malgré son âge'
  },
  'P2-X5':{
    longueur:'nombre de caractères du mot de passe à vérifier',
    chiffre:'booléen indiquant si le mot de passe contient au moins un chiffre',
    interdit:'booléen indiquant si le mot de passe est marqué comme interdit'
  },
  'T6-X3':{
    cur:'curseur de base de données sur lequel exécuter la requête paramétrée',
    nom:'nom du joueur recherché ; cette valeur doit être transmise séparément de la chaîne SQL via le paramètre ?'
  },
  'T10-X3':{
    n:'longueur restante à construire avec des blocs de taille 1 ou 2',
    memo:'dictionnaire de mémoïsation associant une longueur déjà calculée au nombre de constructions correspondant'
  },
  'CAP-3':{
    g:'graphe non pondéré du réseau, représenté par un dictionnaire salle → liste des salles voisines',
    depart:'salle de départ à partir de laquelle le parcours en largeur commence',
    arrivee:'salle cible dont on veut calculer la distance minimale en nombre de portes'
  }
};

const TREE_IDS = new Set(['T4-E1','T4-E2','T4-E3','T4-X1','T4-X2','T4-X3','T4-X4','T4-X5']);
const TREE_PARAMS = {
  valeur:'valeur stockée dans le nœud courant de l’arbre binaire',
  gauche:'sous-arbre gauche ; il vaut None lorsqu’aucun fils gauche n’existe',
  droite:'sous-arbre droit ; il vaut None lorsqu’aucun fils droit n’existe'
};

function escapeRegExp(value=''){return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function esc(value=''){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}

function overridesFor(ex){
  const params={...(PARAM_OVERRIDES[ex.id]||{})};
  if(TREE_IDS.has(ex.id)) Object.assign(params,TREE_PARAMS,params);
  return {result:RESULT_OVERRIDES[ex.id]||'',params};
}

export function buildEditorialBrief(ex,module=null){
  const brief=buildExerciseBrief(ex,module);
  const ov=overridesFor(ex);
  if(ov.result) brief.resultRule=ov.result;
  brief.params=brief.params.map(p=>ov.params[p.name]?{...p,description:ov.params[p.name]}:p);
  return brief;
}

export function exerciseEditorialBriefHTML(ex,module=null){
  const ov=overridesFor(ex);
  let html=exerciseBriefHTML(ex,module);
  if(ov.result){
    html=html.replace(/(<div class="brief-sub"><strong>Valeur ou effet attendu<\/strong><p>)(.*?)(<\/p><\/div>)/s,`$1${esc(ov.result)}$3`);
  }
  for(const [name,description] of Object.entries(ov.params)){
    const safeName=escapeRegExp(esc(name));
    const re=new RegExp(`(<li><code>${safeName}<\\/code> — )(.*?)(<\\/li>)`,'g');
    html=html.replace(re,`$1${esc(description)}$3`);
  }
  return html;
}

export const editorialOverrides={RESULT_OVERRIDES,PARAM_OVERRIDES,TREE_PARAMS};
