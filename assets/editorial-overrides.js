import { buildExerciseBrief, exerciseBriefHTML } from './exercise-brief.js';

/* Human-reviewed residuals found by the editorial gates.
   These overrides are deliberately exercise-specific: they replace the last
   generic formulations that cannot be inferred safely from syntax alone. */
const RESULT_OVERRIDES = {
  'P1-E1':'La fonction doit renvoyer un nombre égal au prix unitaire multiplié par la quantité achetée. Si la quantité vaut 0, le résultat doit être 0.',
  'P1-E3':'La fonction doit renvoyer un booléen : True lorsque n est divisible par 2, et False lorsqu’il ne l’est pas.',
  'P4-E1':'La fonction doit renvoyer la plus grande des deux valeurs a et b. Si a et b sont égales, elle renvoie cette valeur commune.',
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
  'T1-E2':{
    tab:'liste dans laquelle la fonction récursive compte les occurrences de x sans utiliser de slice',
    x:'valeur dont on veut compter le nombre d’occurrences dans tab',
    i:'indice courant de la récursion ; il commence à 0 et avance jusqu’à len(tab)'
  },
  'T1-E3':{
    a:'base numérique de la puissance aⁿ',
    n:'exposant entier supérieur ou égal à 0 ; il diminue à chaque appel récursif'
  },
  'T2-E3':{
    x:'abscisse numérique du point, stockée dans l’attribut self.x',
    y:'ordonnée numérique du point, stockée dans l’attribut self.y',
    a:'premier objet Point qui constitue une extrémité du segment',
    b:'second objet Point qui constitue l’autre extrémité du segment'
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
  'P7-X3':{
    scores:'dictionnaire associant le nom de chaque joueur à son score actuel',
    joueur:'nom du joueur dont le score doit être augmenté ; ce nom sert de clé dans scores',
    points:'nombre de points à ajouter au score actuel du joueur'
  },
  'T3-X5':{
    ticket:'ticket à placer dans la file ; les tickets doivent ressortir dans leur ordre d’arrivée'
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
