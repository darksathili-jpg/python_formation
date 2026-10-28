import { readinessSessions } from '../assets/bac-readiness.js';
import { efficacyPolicy, evaluateBacReadiness, BAC_READINESS_EFFICACY_VERSION } from '../assets/bac-readiness-efficacy-model.js';

const errors=[];
const need=(ok,msg)=>{if(!ok)errors.push(msg)};
need(BAC_READINESS_EFFICACY_VERSION==='1.32.0','Version V1.32 attendue');
need(readinessSessions.length===4,'4 sessions attendues');
need(efficacyPolicy.strategyMinChars>=50,'Seuil stratégie trop faible');
need(efficacyPolicy.writtenMinChars>=200,'Seuil raisonnement écrit trop faible');
need(efficacyPolicy.dialogueMinChars>=50,'Seuil dialogue trop faible');
need(efficacyPolicy.postmortemMinChars>=100,'Seuil post-mortem trop faible');

const now=1_000_000;
const core={}, evidence={}, reflections={};
for(const s of readinessSessions){
  core[s.id]={startedAt:now,endedAt:now+10_000,written:'x'.repeat(efficacyPolicy.writtenMinChars),writtenUpdatedAt:now+5_000,criteria:[0,1,2],dialogue:Object.fromEntries(s.dialogue.map((_,i)=>[String(i),'d'.repeat(efficacyPolicy.dialogueMinChars)])),passedTasks:{}};
  reflections[s.id]={postmortem:'p'.repeat(efficacyPolicy.postmortemMinChars)};
  for(const t of s.tasks){
    core[s.id].passedTasks[t.id]=now+4_000;
    evidence[t.id]={strategy:'s'.repeat(efficacyPolicy.strategyMinChars),lockedAt:now+1_000,firstTestAt:now+2_000,attemptCount:1};
  }
}
const good=evaluateBacReadiness(readinessSessions,core,evidence,reflections);
need(good.pass,'Un dossier complet doit franchir le gate');
const first=readinessSessions[0].tasks[0].id;
evidence[first].lockedAt=now+3_000;
const bad=evaluateBacReadiness(readinessSessions,core,evidence,reflections);
need(!bad.axes.recognition && !bad.pass,'Une stratégie formulée après le premier test doit échouer');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Bac Readiness efficacy V1.32: OK');
