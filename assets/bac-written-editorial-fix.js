import { writtenSkillTracks } from './bac-written-corpus.js';

// Patch éditorial V1.31.1 : formulation positive, précise et adaptée à une préparation au Bac.
const justificationSkill = writtenSkillTracks.find(skill => skill.id === 'justifier');
if (justificationSkill) {
  justificationSkill.title = 'Justifier avec précision';
}
