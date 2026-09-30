import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { bacReadinessFrame, readinessSessions, readinessGate } from '../assets/bac-readiness.js';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const expectedTargets = Array.from({ length: 11 }, (_, i) => `T${i + 1}`);

need(readinessSessions.length === 4, `4 parcours blancs attendus, trouvé ${readinessSessions.length}`);
need(bacReadinessFrame.sessionMinutes === 60, 'Le cadre doit annoncer des sessions de 60 minutes');
need(/3 h 30/.test(bacReadinessFrame.official2027) && /1 h/.test(bacReadinessFrame.official2027), 'Le rappel du cadre Bac 2027 doit mentionner 3 h 30 et 1 h');
need(/sans annoncer le chapitre/i.test(bacReadinessFrame.purpose), 'Le principe de mobilisation sans chapitre annoncé doit rester explicite');

const taskIds = new Set();
const coverage = new Set();
for (const session of readinessSessions) {
  need(session.duration === 60, `${session.id}: durée de 60 minutes attendue`);
  need(Array.isArray(session.tasks) && session.tasks.length === 2, `${session.id}: exactement 2 tâches de programmation attendues`);
  need(Array.isArray(session.targets) && session.targets.length >= 2, `${session.id}: couverture transversale insuffisante`);
  need(session.written?.prompt?.length >= 120, `${session.id}: justification écrite trop courte`);
  need(Array.isArray(session.written?.criteria) && session.written.criteria.length === 4, `${session.id}: 4 critères écrits attendus`);
  need(Array.isArray(session.dialogue) && session.dialogue.length === 3, `${session.id}: 3 questions de dialogue attendues`);
  for (const target of session.targets) coverage.add(target);
  for (const task of session.tasks) {
    need(!taskIds.has(task.id), `Identifiant de tâche dupliqué: ${task.id}`);
    taskIds.add(task.id);
    need(task.prompt.length >= 120, `${task.id}: énoncé insuffisamment explicite`);
    need(typeof task.starter === 'string' && task.starter.includes('pass'), `${task.id}: starter incomplet attendu`);
    need(Array.isArray(task.tests) && task.tests.length >= 3, `${task.id}: au moins 3 tests attendus`);
    need(task.debrief?.strategy?.length >= 100, `${task.id}: stratégie de débrief trop courte`);
    need(Array.isArray(task.debrief?.concepts) && task.debrief.concepts.length >= 3, `${task.id}: concepts de débrief insuffisants`);
  }
}
for (const id of expectedTargets) need(coverage.has(id), `Couverture Bac Readiness: ${id} absent des quatre parcours`);
need(taskIds.size === 8, `8 tâches de programmation attendues, trouvé ${taskIds.size}`);
need(readinessGate.sessionsRequired === 4, 'Le gate doit exiger les quatre sessions');
need(/Tous les tests/i.test(readinessGate.codeRule), 'Le gate doit conserver une exigence de validation de tous les tests');
need(/3 critères sur 4/i.test(readinessGate.reasoningRule), 'Le gate écrit doit conserver le seuil 3/4');
need(/pas une note prédictive/i.test(readinessGate.interpretation), 'Le gate ne doit pas être présenté comme une prédiction de résultat au Bac');

const references = {
  'BRG-A1': `def distance_securisee(g, depart, arrivee, interdites):\n    if depart in interdites:\n        return -1\n    visites = {depart}\n    file = [(depart, 0)]\n    while file:\n        sommet, distance = file.pop(0)\n        if sommet == arrivee:\n            return distance\n        for voisin in g.get(sommet, []):\n            if voisin not in visites and voisin not in interdites:\n                visites.add(voisin)\n                file.append((voisin, distance + 1))\n    return -1`,
  'BRG-A2': `class Noeud:\n    def __init__(self, valeur, gauche=None, droite=None):\n        self.valeur = valeur\n        self.gauche = gauche\n        self.droite = droite\n\ndef resume_arbre(a):\n    if a is None:\n        return (0, 0)\n    tg, fg = resume_arbre(a.gauche)\n    td, fd = resume_arbre(a.droite)\n    if a.gauche is None and a.droite is None:\n        return (1, 1)\n    return (1 + tg + td, fg + fd)`,
  'BRG-B1': `def titres_auteur(conn, nom):\n    cur = conn.execute(\"SELECT livre.titre FROM livre JOIN auteur ON livre.auteur_id = auteur.id WHERE auteur.nom = ? ORDER BY livre.titre\", (nom,))\n    return [ligne[0] for ligne in cur.fetchall()]`,
  'BRG-B2': `class FileDemandes:\n    def __init__(self):\n        self._data = []\n    def ajouter(self, x):\n        self._data.append(x)\n    def prochain(self):\n        assert not self.est_vide()\n        return self._data.pop(0)\n    def est_vide(self):\n        return len(self._data) == 0`,
  'BRG-C1': `def fusion(a, b):\n    i = 0\n    j = 0\n    resultat = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            resultat.append(a[i])\n            i += 1\n        else:\n            resultat.append(b[j])\n            j += 1\n    while i < len(a):\n        resultat.append(a[i])\n        i += 1\n    while j < len(b):\n        resultat.append(b[j])\n        j += 1\n    return resultat`,
  'BRG-C2': `def energie_min(couts):\n    if len(couts) == 0:\n        return 0\n    if len(couts) == 1:\n        return couts[0]\n    dp = [0] * len(couts)\n    dp[0] = couts[0]\n    dp[1] = couts[1]\n    for i in range(2, len(couts)):\n        dp[i] = couts[i] + min(dp[i-1], dp[i-2])\n    return dp[-1]`,
  'BRG-D1': `def derniere_occurrence(motif):\n    d = {}\n    for i in range(len(motif)):\n        d[motif[i]] = i\n    return d`,
  'BRG-D2': `def derniere_occurrence(motif):\n    d = {}\n    for i in range(len(motif)):\n        d[motif[i]] = i\n    return d\n\ndef cherche_motif(texte, motif):\n    if motif == '':\n        return 0\n    if len(motif) > len(texte):\n        return -1\n    last = derniere_occurrence(motif)\n    i = 0\n    while i <= len(texte) - len(motif):\n        j = len(motif) - 1\n        while j >= 0 and motif[j] == texte[i+j]:\n            j -= 1\n        if j < 0:\n            return i\n        mauvais = texte[i+j]\n        i += max(1, j - last.get(mauvais, -1))\n    return -1`
};

for (const session of readinessSessions) {
  for (const task of session.tasks) {
    const reference = references[task.id];
    need(Boolean(reference), `${task.id}: solution de référence CI absente`);
    if (!reference) continue;
    const checks = task.tests.map((test, index) => {
      if (test.raises) {
        return `\ntry:\n    ${test.expr}\nexcept ${test.raises}:\n    pass\nelse:\n    raise AssertionError('test ${index + 1} devait lever ${test.raises}')`;
      }
      return `\nassert (${test.expr}), 'échec test ${index + 1}: ${String(test.label).replaceAll("'", "\\'")}'`;
    }).join('');
    const run = spawnSync('python3', ['-c', `${reference}\n${checks}\nprint('OK')`], { encoding:'utf8' });
    if (run.status !== 0) errors.push(`${task.id}: la solution de référence ne passe pas les tests\n${run.stderr || run.stdout}`);
  }
}

const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
need(index.includes('bac-readiness.css?v=1.25.0'), 'CSS Bac Readiness absent de index.html');
need(index.includes('bac-readiness-ui.js?v=1.25.0'), 'UI Bac Readiness absente de index.html');
need(index.includes('bac-readiness-evidence.js?v=1.26.0'), 'Couche Recognition Evidence V1.26 absente de index.html');
need(sw.includes('bac-readiness.js') && sw.includes('bac-readiness-ui.js?v=1.25.0') && sw.includes('bac-readiness.css?v=1.25.0'), 'Assets Bac Readiness cœur absents du cache hors ligne');
need(sw.includes('bac-readiness-evidence.js?v=1.26.0'), 'Couche Recognition Evidence V1.26 absente du cache hors ligne');
need(index.includes('V1.26'), 'Footer V1.26 absent');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Bac Readiness Gate: cœur V1.25 + Recognition Evidence V1.26, 4 parcours chronométrés, 8 tâches testées, T1→T11 couvert, justification, dialogue, débrief différé et cache hors ligne — OK');