import { modules, practiceBank, primmBank, noviceBank } from '../assets/content.js';

const t4 = modules.find(m => m.id === 'T4');
if (!t4) throw new Error('T4 introuvable');
const practice = practiceBank.filter(ex => ex.moduleId === 'T4');
const primm = primmBank.find(item => item.moduleId === 'T4');
const novice = noviceBank.find(item => item.moduleId === 'T4');

const text = JSON.stringify(t4);
for (const word of ['racine','nœud','feuille','fils','sous-arbre','arbre vide']) {
  if (!text.includes(word)) throw new Error(`T4: vocabulaire manquant — ${word}`);
}
if (!text.includes('structure récursive')) throw new Error('T4: définition récursive de l’arbre insuffisante');
if (!text.includes('hauteur est le nombre de nœuds du plus long chemin racine-feuille')) throw new Error('T4: convention de hauteur non verrouillée');
for (const order of ['Préfixe','Infixe','Suffixe']) {
  if (!text.includes(order)) throw new Error(`T4: parcours ${order} absent`);
}
if (!text.includes('parcours en largeur') || !text.includes('file')) throw new Error('T4: lien parcours en largeur ↔ file absent');
if (!text.includes('arbre binaire de recherche') || !text.includes('strictement plus petites') || !text.includes('strictement plus grandes')) {
  throw new Error('T4: propriété d’ordre de l’ABR insuffisamment explicite');
}

const e1 = t4.exercises.find(ex => ex.id === 'T4-E1');
const e2 = t4.exercises.find(ex => ex.id === 'T4-E2');
const e3 = t4.exercises.find(ex => ex.id === 'T4-E3');
if (!e1?.prompt.includes('sous-arbre') || !e1?.solution.includes('1 + taille(a.gauche) + taille(a.droite)')) throw new Error('T4-E1: sens des sous-appels / taille non conforme');
if (!e2?.prompt.includes('ordre infixe') || !e2?.solution.includes('infixe(a.gauche) + [a.valeur] + infixe(a.droite)')) throw new Error('T4-E2: parcours infixe non conforme');
if (!e3?.prompt.includes('uniquement à gauche ou uniquement à droite') || !e3?.solution.includes('if x < a.valeur')) throw new Error('T4-E3: recherche ABR ne force pas le choix d’un seul sous-arbre');

if (practice.length !== 5) throw new Error(`T4: ${practice.length} entraînements au lieu de 5`);
const x2 = practice.find(ex => ex.id === 'T4-X2');
if (!x2?.prompt.includes('arbre vide → 0, feuille → 1') || !x2?.solution.includes('1 + max(hg, hd)')) throw new Error('T4-X2: convention/algorithme de hauteur non conforme');
const x4 = practice.find(ex => ex.id === 'T4-X4');
if (!x4?.prompt.includes('fils gauches') || x4?.solution.includes('infixe(')) throw new Error('T4-X4: minimum ABR doit suivre la propriété d’ordre sans parcours complet');
const x5 = practice.find(ex => ex.id === 'T4-X5');
if (!x5?.solution.includes('a.gauche = insere(a.gauche, x)') || !x5?.solution.includes('return a')) throw new Error('T4-X5: insertion ABR ne reconstruit pas correctement le sous-arbre');

if (!primm?.predict.includes('quel sous-arbre') || !primm?.investigate.some(q => q.includes('représente exactement'))) {
  throw new Error('PRIMM T4: chaque appel récursif doit être relié au sous-arbre traité');
}
if (!novice?.harness.includes('cet appel calcule')) throw new Error('Passerelle novice T4: anti-recette récursive absente');
if (novice?.checks?.length !== 3) throw new Error('Passerelle novice T4: exactement 3 micro-questions attendues');

const codes = [
  ...t4.exercises.flatMap(ex => [ex.starter, ex.solution]),
  ...practice.flatMap(ex => [ex.starter, ex.solution])
].join('\n');
if (/\[[^\]]*:[^\]]*\]/.test(codes)) throw new Error('T4: slice détecté dans les codes pédagogiques');

console.log('Student Zero T3/T4 gate: OK — vocabulaire, structure récursive, sens des sous-appels, hauteur, parcours, largeur/file et ABR verrouillés.');
