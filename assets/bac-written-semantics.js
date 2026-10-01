export const BAC_WRITTEN_SEMANTICS_VERSION = '1.29.0';

export const bacWrittenDomains = [
  { id:'structures', label:'Structures de données' },
  { id:'bdd', label:'Bases de données' },
  { id:'architectures', label:'Architectures matérielles, systèmes d’exploitation et réseaux' },
  { id:'langages', label:'Langages et programmation' },
  { id:'algorithmique', label:'Algorithmique' },
  { id:'premiere', label:'Notions de Première mobilisables' }
];

export const bacWrittenTopics = [
  { id:'linear', domain:'structures', label:'Listes, piles, files et dictionnaires' },
  { id:'trees', domain:'structures', label:'Arbres binaires et arbres binaires de recherche' },
  { id:'graphs', domain:'structures', label:'Graphes' },
  { id:'oop', domain:'structures', label:'Vocabulaire de la programmation objet' },
  { id:'relational', domain:'bdd', label:'Modèle relationnel et bases de données relationnelles' },
  { id:'sql', domain:'bdd', label:'Langage SQL : interrogation et mise à jour' },
  { id:'processes', domain:'architectures', label:'Gestion des processus et des ressources' },
  { id:'routing', domain:'architectures', label:'Protocoles de routage' },
  { id:'security', domain:'architectures', label:'Sécurisation des communications' },
  { id:'recursion', domain:'langages', label:'Récursivité' },
  { id:'modularity', domain:'langages', label:'Modularité' },
  { id:'debugging', domain:'langages', label:'Mise au point des programmes et gestion des bugs' },
  { id:'tree-algorithms', domain:'algorithmique', label:'Algorithmes sur les arbres binaires et les ABR' },
  { id:'graph-algorithms', domain:'algorithmique', label:'Algorithmes sur les graphes' },
  { id:'divide-conquer', domain:'algorithmique', label:'Méthode « diviser pour régner »' },
  { id:'dynamic-programming', domain:'algorithmique', label:'Programmation dynamique' },
  { id:'text-search', domain:'algorithmique', label:'Recherche textuelle' },
  { id:'sorting-complexity', domain:'algorithmique', label:'Algorithmes de tri et complexité' },
  { id:'binary', domain:'premiere', label:'Représentation binaire des données' },
  { id:'tables-csv', domain:'premiere', label:'Traitement de données en tables et CSV' },
  { id:'python-foundations', domain:'premiere', label:'Fondamentaux Python et structures séquentielles' },
  { id:'ip-networking', domain:'premiere', label:'Adressage IP et protocoles réseau' },
  { id:'transversal', domain:'premiere', label:'Notions transversales mobilisables' }
];

const topicById = new Map(bacWrittenTopics.map(topic => [topic.id, topic]));
const domainById = new Map(bacWrittenDomains.map(domain => [domain.id, domain]));

function fold(value='') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function has(text, pattern) { return pattern.test(text); }

export function canonicalTopicIdsForTheme(rawTheme='') {
  const text = fold(rawTheme);
  const ids = new Set();
  const add = id => ids.add(id);

  if (has(text, /\b(base|bases) de donnees\b|relationnel|schema relationnel|clef? (primaire|etrangere)/)) add('relational');
  if (has(text, /\bsql\b|requete|select\b|insert\b|update\b|delete\b|jointure/)) add('sql');

  if (has(text, /\b(pile|piles|file|files|dictionnaire|dictionnaires|liste|listes|p-?uplet|tuple)\b/)) add('linear');
  if (has(text, /\barbre|arbres|abr\b/)) add('trees');
  if (has(text, /\bgraphe|graphes|sommet|sommets|arete|aretes\b/)) add('graphs');
  if (has(text, /programmation orientee objet|\bpoo\b|\bclasses?\b|\bobjets?\b|attributs?|methodes? de (classe|l'objet)|constructeur/)) add('oop');

  if (has(text, /processus|systeme d'exploitation|systemes d'exploitation|ordonnancement|ressource/)) add('processes');
  if (has(text, /routage|routeur|table de routage|rip\b|ospf\b/)) add('routing');
  if (has(text, /adressage ip|adresse ip|ipv4|masque|reseau local|protocoles? reseau/)) add('ip-networking');
  if (has(text, /securisation|securite des communications|chiffrement|cryptograph|cle publique|cle privee/)) add('security');

  if (has(text, /recursiv/)) add('recursion');
  if (has(text, /modularite|module\b|bibliotheque|api\b/)) add('modularity');
  if (has(text, /mise au point|\bbug|bugs\b|\btest|tests\b|assert/)) add('debugging');

  if (has(text, /diviser pour regner/)) add('divide-conquer');
  if (has(text, /programmation dynamique/)) add('dynamic-programming');
  if (has(text, /recherche textuelle|boyer|motif/)) add('text-search');
  if (has(text, /\btri|tris\b|complexit/)) add('sorting-complexity');
  if (ids.has('trees') && has(text, /algorith|parcours|prefix|infix|postfix/)) add('tree-algorithms');
  if (ids.has('graphs') && has(text, /algorith|parcours|chemin|distance|largeur|profondeur|dijkstra/)) add('graph-algorithms');

  if (has(text, /representation binaire|representations binaires|entier relatif|hexadecimal|encodage|ecriture binaire|codage binaire/)) add('binary');
  if (has(text, /\bcsv\b|table de donnees|tables de donnees|traitement de donnees|donnees en table/)) add('tables-csv');
  if (has(text, /programmation en python|programmation python|python \/ algorithmique|programmation de base|tableau|tableaux|chaine|chaines de caracteres|algorithmique et la programmation|algorithmes et la programmation/)) add('python-foundations');

  if (!ids.size && has(text, /bases? de donnees/)) add('relational');
  if (!ids.size && has(text, /structures? de donnees/)) add('linear');
  if (!ids.size && has(text, /reseau|architecture/)) add('ip-networking');
  if (!ids.size && has(text, /programmation|algorithmique/)) add('python-foundations');
  if (!ids.size) add('transversal');

  return [...ids];
}

export function canonicalizeTheme(rawTheme='') {
  return canonicalTopicIdsForTheme(rawTheme).map(id => {
    const topic = topicById.get(id);
    const domain = domainById.get(topic.domain);
    return { id: topic.id, label: topic.label, domain: topic.domain, domainLabel: domain.label };
  });
}

export function enrichWrittenTheme(theme) {
  const sourceTheme = String(theme?.sourceTheme || theme?.theme || '').trim();
  const canonical = canonicalizeTheme(sourceTheme);
  return {
    ...theme,
    sourceTheme,
    canonical,
    theme: canonical.map(item => item.label).join(' · ')
  };
}

export function buildWrittenExerciseIndex(corpus=[]) {
  const rows = [];
  for (const subject of corpus) {
    for (const theme of subject.themes || []) {
      rows.push({
        key:`${subject.id}:${theme.n}`,
        subjectId:subject.id,
        year:subject.year,
        zone:subject.zone,
        session:subject.session,
        exercise:Number(theme.n),
        sourceTheme:theme.sourceTheme || theme.theme || '',
        canonical:theme.canonical || canonicalizeTheme(theme.sourceTheme || theme.theme || ''),
        url:subject.url,
        alignment:subject.alignment
      });
    }
  }
  return rows;
}

export function buildWrittenSemanticStats(corpus=[]) {
  const rows = buildWrittenExerciseIndex(corpus);
  const byTopic = new Map(bacWrittenTopics.map(topic => [topic.id, { ...topic, count:0, years:new Set() }]));
  const byDomain = new Map(bacWrittenDomains.map(domain => [domain.id, { ...domain, count:0, years:new Set() }]));
  for (const row of rows) {
    const seenTopics = new Set();
    const seenDomains = new Set();
    for (const topic of row.canonical || []) {
      if (!seenTopics.has(topic.id) && byTopic.has(topic.id)) {
        const item = byTopic.get(topic.id); item.count += 1; item.years.add(row.year); seenTopics.add(topic.id);
      }
      if (!seenDomains.has(topic.domain) && byDomain.has(topic.domain)) {
        const item = byDomain.get(topic.domain); item.count += 1; item.years.add(row.year); seenDomains.add(topic.domain);
      }
    }
  }
  const topics = [...byTopic.values()].map(item => ({...item, years:[...item.years].sort()})).sort((a,b)=>b.count-a.count || a.label.localeCompare(b.label,'fr'));
  const domains = [...byDomain.values()].map(item => ({...item, years:[...item.years].sort()})).sort((a,b)=>b.count-a.count || a.label.localeCompare(b.label,'fr'));
  return { exerciseCount:rows.length, topics, domains };
}
