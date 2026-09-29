import { modules, practiceBank, noviceBank } from '../assets/content.js';

const fail = message => { throw new Error(message); };
const moduleIds = new Set(modules.map(m => m.id));
const noviceIds = new Set(noviceBank.map(n => n.moduleId));
if (noviceBank.length !== modules.length) fail(`noviceBank: ${noviceBank.length} entrées pour ${modules.length} modules`);
if (noviceIds.size !== noviceBank.length) fail('noviceBank contient des moduleId dupliqués');
for (const id of moduleIds) if (!noviceIds.has(id)) fail(`Passerelle novice manquante pour ${id}`);
for (const item of noviceBank) {
  if (!moduleIds.has(item.moduleId)) fail(`module inconnu dans noviceBank: ${item.moduleId}`);
  if (!item.goal || item.goal.length < 20) fail(`${item.moduleId}: objectif novice trop faible`);
  if (!Array.isArray(item.prerequisites) || item.prerequisites.length < 2) fail(`${item.moduleId}: prérequis insuffisants`);
  if (!Array.isArray(item.vocabulary) || item.vocabulary.length < 3) fail(`${item.moduleId}: vocabulaire insuffisant`);
  if (!item.worked?.code || !Array.isArray(item.worked.steps) || item.worked.steps.length < 3) fail(`${item.moduleId}: exemple résolu incomplet`);
  if (!Array.isArray(item.checks) || item.checks.length !== 3) fail(`${item.moduleId}: exactement 3 micro-questions attendues`);
  item.checks.forEach((q, index) => {
    if (!q.q || !Array.isArray(q.options) || q.options.length < 2) fail(`${item.moduleId} Q${index+1}: question invalide`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(`${item.moduleId} Q${index+1}: réponse invalide`);
    if (!q.explain || q.explain.length < 15) fail(`${item.moduleId} Q${index+1}: feedback trop faible`);
  });
}

const byId = new Map(practiceBank.map(e => [e.id, e]));
if (/str\s*\(/.test(byId.get('P1-X2')?.solution || '')) fail('P1-X2 réintroduit str() avant son enseignement explicite');
if (/return\s+[^\n]*,/.test(byId.get('P1-X4')?.solution || '')) fail('P1-X4 réintroduit un tuple avant P7');
const p9e1 = modules.flatMap(m => m.exercises).find(e => e.id === 'P9-E1');
if (/\[[^\]]*:[^\]]*\]/.test(p9e1?.solution || '')) fail('P9-E1 utilise encore une slice dans la solution de référence');

const earlyHarness = noviceBank.filter(n => ['P1','P2','P3'].includes(n.moduleId));
if (earlyHarness.some(n => !n.harness || !/def|return/.test(n.harness))) fail('Les modules P1-P3 doivent expliciter le rôle du cadre def/return');

console.log(`Novice Learning Gate OK : ${noviceBank.length} passerelles, ${noviceBank.length*3} micro-questions, exemples résolus et corrections de prérequis validés.`);
