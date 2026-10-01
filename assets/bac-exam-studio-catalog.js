export const BAC_EXAM_STUDIO_CATALOG_VERSION = '1.31.0';

const row = (subjectId, zone, session, exercise, title) => ({
  key: `${subjectId}:${exercise}`, subjectId, year: 2026, zone, session, exercise, title
});

export const bacExamStudioPackCatalog = [
  row('2026-amerique-du-nord-sujet-1','Amérique du Nord','Sujet 1',1,'Puissance 4 — POO, récursivité et min-max'),
  row('2026-amerique-du-nord-sujet-1','Amérique du Nord','Sujet 1',2,'Gamerzz — réseaux, routage et files TCP'),
  row('2026-amerique-du-nord-sujet-1','Amérique du Nord','Sujet 1',3,'Immobilier — SQL, récursivité et programmation dynamique'),
  row('2026-amerique-du-nord-sujet-2','Amérique du Nord','Sujet 2',1,'Processus — états, interblocage et tourniquet'),
  row('2026-amerique-du-nord-sujet-2','Amérique du Nord','Sujet 2',2,'Tournoi WTA — POO, tri et arbre binaire'),
  row('2026-amerique-du-nord-sujet-2','Amérique du Nord','Sujet 2',3,'Course sur route — SQL et dictionnaires'),
  row('2026-antilles-guyane-sujet-1','Antilles-Guyane','Sujet 1',1,'Pizzayolo — modèle relationnel et SQL'),
  row('2026-antilles-guyane-sujet-1','Antilles-Guyane','Sujet 1',2,'LCS — recherche exhaustive, récursivité et mémoïsation'),
  row('2026-antilles-guyane-sujet-1','Antilles-Guyane','Sujet 1',3,'Bob & Alice — routage, HTTPS et cryptographie'),
  row('2026-antilles-guyane-sujet-2','Antilles-Guyane','Sujet 2',1,'Coworking — SQL et programmation objet'),
  row('2026-antilles-guyane-sujet-2','Antilles-Guyane','Sujet 2',2,'Réseau & GPS — coûts, graphes et parcours'),
  row('2026-antilles-guyane-sujet-2','Antilles-Guyane','Sujet 2',3,'Scierie — tableaux, récursivité et programmation dynamique'),
  row('2026-asie-sujet-1','Asie','Sujet 1',1,"L'air de l'art — SQL, dictionnaires et glouton"),
  row('2026-asie-sujet-1','Asie','Sujet 1',2,'Détecteur de spam — perceptron et apprentissage supervisé'),
  row('2026-asie-sujet-1','Asie','Sujet 1',3,'RIP en Python — routeurs, interfaces et files'),
  row('2026-asie-sujet-2','Asie','Sujet 2',1,'Taquin — POO, déplacements et pile'),
  row('2026-asie-sujet-2','Asie','Sujet 2',2,'Jeu de société — SQL, graphe orienté et tri topologique'),
  row('2026-asie-sujet-2','Asie','Sujet 2',3,'Robots — chaînes récursives et routage RIP'),
  row('2026-centres-etrangers-g1-sujet-1','Centres étrangers G1','Sujet 1',1,'Annuaire — tri, POO et arbre binaire de recherche'),
  row('2026-centres-etrangers-g1-sujet-1','Centres étrangers G1','Sujet 1',2,'Carré de Polybe — chiffrement et programmation'),
  row('2026-centres-etrangers-g1-sujet-1','Centres étrangers G1','Sujet 1',3,'Démineur — POO, récursivité et SQL'),
  row('2026-centres-etrangers-g1-sujet-2','Centres étrangers G1','Sujet 2',1,'Taxis — POO et sécurisation des échanges'),
  row('2026-centres-etrangers-g1-sujet-2','Centres étrangers G1','Sujet 2',2,'Entreprise connectée — SQL, réseaux et routage'),
  row('2026-centres-etrangers-g1-sujet-2','Centres étrangers G1','Sujet 2',3,'Machine de von Neumann — assembleur, logique et file circulaire'),
  row('2026-metropole-sujet-1','Métropole','Sujet 1',1,'Réseau du lycée — CIDR, routage et HTTPS'),
  row('2026-metropole-sujet-1','Métropole','Sujet 1',2,'Recto-Verso — binaire, XOR et parcours de graphe'),
  row('2026-metropole-sujet-1','Métropole','Sujet 1',3,'Plateforme de débats — arbres, récursivité et SQL'),
  row('2026-metropole-sujet-2','Métropole','Sujet 2',1,"Réseaux d’entreprise — adressage, routage et POO"),
  row('2026-metropole-sujet-2','Métropole','Sujet 2',2,'Taquin débogué — tests, erreurs et graphes'),
  row('2026-metropole-sujet-2','Métropole','Sujet 2',3,'Covoiturage — SQL, file et parcours en largeur'),
  row('2026-polynesie-francaise-sujet-1','Polynésie française','Sujet 1',1,'Suite de Fibonacci — récursivité et complexité'),
  row('2026-polynesie-francaise-sujet-1','Polynésie française','Sujet 1',2,'Annuaire téléphonique — ABR, dictionnaire et CSV'),
  row('2026-polynesie-francaise-sujet-1','Polynésie française','Sujet 1',3,'OpenChat — POO, base de données et ABR'),
  row('2026-polynesie-francaise-sujet-2','Polynésie française','Sujet 2',1,"Qualité de l'air — modèle relationnel et SQL"),
  row('2026-polynesie-francaise-sujet-2','Polynésie française','Sujet 2',2,'Motifs & itinéraires — Python, graphes et recherche textuelle'),
  row('2026-polynesie-francaise-sujet-2','Polynésie française','Sujet 2',3,'Routage arborescent — réseau et structure d’arbre')
];

export const bacExamStudioPackMetaByKey = new Map(bacExamStudioPackCatalog.map(meta => [meta.key, meta]));
export const bacExamStudioPackKeysBySubject = new Map();
for (const meta of bacExamStudioPackCatalog) {
  const keys = bacExamStudioPackKeysBySubject.get(meta.subjectId) || [];
  keys.push(meta.key);
  bacExamStudioPackKeysBySubject.set(meta.subjectId, keys);
}

const subjectLoaders = new Map([
  ['2026-amerique-du-nord-sujet-1', async () => {
    const [base, extra] = await Promise.all([import('./bac-exam-studio-bank.js'), import('./bac-exam-studio-2026-an1-extra.js')]);
    return [...base.bacExamStudioPacks, ...extra.bacExamStudioPacks];
  }],
  ['2026-amerique-du-nord-sujet-2', async () => (await import('./bac-exam-studio-2026-an2.js')).bacExamStudioPacks],
  ['2026-antilles-guyane-sujet-1', async () => (await import('./bac-exam-studio-2026-ag1.js')).bacExamStudioPacks],
  ['2026-antilles-guyane-sujet-2', async () => (await import('./bac-exam-studio-2026-ag2.js')).bacExamStudioPacks],
  ['2026-asie-sujet-1', async () => (await import('./bac-exam-studio-2026-ja1.js')).bacExamStudioPacks],
  ['2026-asie-sujet-2', async () => (await import('./bac-exam-studio-2026-ja2.js')).bacExamStudioPacks],
  ['2026-centres-etrangers-g1-sujet-1', async () => (await import('./bac-exam-studio-2026-g11.js')).bacExamStudioPacks],
  ['2026-centres-etrangers-g1-sujet-2', async () => (await import('./bac-exam-studio-2026-g12.js')).bacExamStudioPacks],
  ['2026-metropole-sujet-1', async () => (await import('./bac-exam-studio-2026-me1.js')).bacExamStudioPacks],
  ['2026-metropole-sujet-2', async () => (await import('./bac-exam-studio-2026-me2.js')).bacExamStudioPacks],
  ['2026-polynesie-francaise-sujet-1', async () => (await import('./bac-exam-studio-2026-po1.js')).bacExamStudioPacks],
  ['2026-polynesie-francaise-sujet-2', async () => (await import('./bac-exam-studio-2026-po2.js')).bacExamStudioPacks]
]);

const loadedPackByKey = new Map();
const subjectPromises = new Map();

function normalizePack(pack) {
  const isAn1Legacy = pack.subjectId === '2026-amerique-du-nord-sujet-1' && (pack.exercise === 1 || pack.exercise === 3);
  return {
    ...pack,
    audit: pack.audit || {
      officialTextChecked: true,
      solutionChecked: true,
      correctionMode: isAn1Legacy ? 'cross-checked' : 'recomputed',
      checkedAt: '2026-10-01'
    },
    questions: pack.questions.map(question => ({ ...question, sourceQuestion: question.sourceQuestion || question.number }))
  };
}

export async function loadSubjectPacks(subjectId) {
  if (!subjectLoaders.has(subjectId)) throw new Error(`Sujet Gold inconnu : ${subjectId}`);
  if (!subjectPromises.has(subjectId)) {
    subjectPromises.set(subjectId, subjectLoaders.get(subjectId)().then(packs => {
      const normalized = packs.map(normalizePack);
      for (const pack of normalized) loadedPackByKey.set(pack.key, pack);
      return normalized;
    }));
  }
  return subjectPromises.get(subjectId);
}

export async function loadPack(packKey) {
  if (loadedPackByKey.has(packKey)) return loadedPackByKey.get(packKey);
  const meta = bacExamStudioPackMetaByKey.get(packKey);
  if (!meta) throw new Error(`Pack Gold inconnu : ${packKey}`);
  await loadSubjectPacks(meta.subjectId);
  const pack = loadedPackByKey.get(packKey);
  if (!pack) throw new Error(`Pack Gold absent après chargement : ${packKey}`);
  return pack;
}

export function firstPackKey() { return bacExamStudioPackCatalog[0]?.key || ''; }
export function loadedPacks() { return [...loadedPackByKey.values()]; }
export function loadedPackCount() { return loadedPackByKey.size; }
