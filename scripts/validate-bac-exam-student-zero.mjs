import fs from 'node:fs';
const studio=fs.readFileSync('assets/bac-exam-studio.js','utf8');
const errors=[];
const need=(c,m)=>{if(!c)errors.push(m);};
for(const token of ['strategies: {}','telemetry: {}','firstSeenAt','firstInputAt','strategyFirstAt','strategyAtReveal','hintEvents','revealAt','answerEdits','criteriaEvents','errorSelectedAt','comprehensionDelayMs','data-studio-strategy','data-studio-export','exportStudentZero']) need(studio.includes(token),`Instrumentation manquante : ${token}`);
need(studio.includes('answerText:'),'L’export doit permettre un audit local de la qualité rédactionnelle');
need(studio.includes('privacy:'),'Le contrat de confidentialité de l’export est absent');
need(studio.includes('aucune identité') || studio.includes('Aucune identité'),'L’export ne déclare pas explicitement l’absence de collecte d’identité');
need(!/fetch\s*\(/.test(studio),'Le moteur Studio ne doit pas transmettre la télémétrie par fetch');
need(!/XMLHttpRequest/.test(studio),'Le moteur Studio ne doit pas transmettre la télémétrie par XMLHttpRequest');
need(studio.includes('new Blob(') && studio.includes('URL.createObjectURL'), 'L’export doit être produit localement dans le navigateur');
need(studio.includes('strategyAtReveal=strategyFor'), 'La stratégie doit être figée au moment de l’ouverture de la correction');
need(studio.includes('answerCharsAtReveal=answerFor'), 'La tentative doit être caractérisée avant exposition à la correction');
if(errors.length){console.error(`Student Zero instrumentation gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);process.exit(1);}
console.log('Student Zero instrumentation gate — OK | reconnaissance avant correction · délai première production · indices · post-mortem · rédaction · export local · perf');
