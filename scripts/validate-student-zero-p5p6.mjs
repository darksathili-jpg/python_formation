import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const errors = [];
const p5 = modules.find(m => m.id === 'P5');
const p6 = modules.find(m => m.id === 'P6');
const get = (list, id) => list.find(x => x.id === id);
const getModule = (list, id) => list.find(x => x.moduleId === id);

if (!p5 || !p6) errors.push('P5 ou P6 introuvable');

if (p5) {
  if (p5.exercises.length !== 3) errors.push(`P5: ${p5.exercises.length} exercices cœur au lieu de 3`);
  const lessonText = p5.lessons.map(l => `${l.title} ${l.html}`).join('\n');
  for (const marker of ['séquence de caractères indexée à partir de 0','ne se modifie pas par indice','Parcourir directement ou utiliser les indices','Aucune slice n’est nécessaire']) {
    if (!lessonText.includes(marker)) errors.push(`P5: notion manquante — ${marker}`);
  }
  const p5all = [...p5.exercises, ...practiceBank.filter(x => x.moduleId === 'P5')];
  for (const ex of p5all) {
    const code = `${ex.starter || ''}\n${ex.solution || ''}`;
    if (/\[[^\]\n]*:[^\]\n]*\]/.test(code)) errors.push(`${ex.id}: slice détectée dans le code attendu`);
  }
  const x4 = get(practiceBank, 'P5-X4');
  if (!x4 || /caractere\s*=/.test(`${x4.starter}\n${x4.solution}`)) errors.push('P5-X4: paramètre par défaut encore présent');
  const e3 = get(p5.exercises, 'P5-E3');
  if (!e3 || !e3.prompt.includes('len(texte)-1-i')) errors.push('P5-E3: symétrie des indices insuffisamment explicite');
}

if (p6) {
  if (p6.exercises.length !== 3) errors.push(`P6: ${p6.exercises.length} exercices cœur au lieu de 3`);
  const lessonText = p6.lessons.map(l => `${l.title} ${l.html}`).join('\n');
  for (const marker of ['Transition P5 → P6','Alias : deux noms peuvent désigner la même liste','Copier : créer une nouvelle liste','Compréhension : compacter un schéma déjà compris','Tableau 2D']) {
    if (!lessonText.includes(marker)) errors.push(`P6: notion manquante — ${marker}`);
  }
  const e1 = get(p6.exercises, 'P6-E1');
  if (!e1 || !/\[.*for i in range\(n\)\]/s.test(e1.solution)) errors.push('P6-E1: compréhension simple absente de la solution');
  const e3 = get(p6.exercises, 'P6-E3');
  if (!e3 || !e3.solution.includes('resultat.append(m[i][i])')) errors.push('P6-E3: lecture 2D explicite avec append absente');
  const x2 = get(practiceBank, 'P6-X2');
  if (!x2 || /\[[^\]]+for\s+/.test(x2.solution)) errors.push('P6-X2: compréhension complexe encore utilisée');
  const x3 = get(practiceBank, 'P6-X3');
  if (!x3 || !x3.prompt.includes('alias') || !x3.solution.includes('list(inventaire)')) errors.push('P6-X3: alias/copie non verrouillé');
}

const p5Order = practiceBank.filter(x => x.moduleId === 'P5').map(x => x.id).join(',');
if (p5Order !== 'P5-X2,P5-X1,P5-X4,P5-X3,P5-X5') errors.push(`Ordre P5 inattendu: ${p5Order}`);
const p6Order = practiceBank.filter(x => x.moduleId === 'P6').map(x => x.id).join(',');
if (p6Order !== 'P6-X1,P6-X3,P6-X2,P6-X5,P6-X4') errors.push(`Ordre P6 inattendu: ${p6Order}`);

const noviceP5 = getModule(noviceBank, 'P5');
const noviceP6 = getModule(noviceBank, 'P6');
if (!noviceP5 || !noviceP5.goal.includes('modifier la chaîne')) errors.push('Passerelle novice P5 non recalibrée');
if (!noviceP6 || !noviceP6.goal.includes('alias et copie')) errors.push('Passerelle novice P6 non recalibrée');

const primmP5 = getModule(primmBank, 'P5');
const primmP6 = getModule(primmBank, 'P6');
if (!primmP5 || !primmP5.make.includes('nouvelle chaîne')) errors.push('PRIMM P5: Make ne verrouille pas la construction immuable');
if (!primmP6 || !primmP6.make.includes('list(tab)') || !primmP6.make.includes('reste inchangée')) errors.push('PRIMM P6: Make ne verrouille pas copie + préservation');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Student Zero Gate P5/P6 OK : indices et immutabilité explicites en P5 ; mutabilité, alias, copie, compréhension graduée et tableaux 2D explicites en P6 ; aucun slice requis.');
