import fs from 'node:fs';
import { writtenSkillTracks } from '../assets/bac-written-corpus.js';
await import('../assets/bac-written-editorial-fix.js');

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const patch = fs.readFileSync('assets/bac-written-layout-fix.css', 'utf8');
const base = fs.readFileSync('assets/styles.css', 'utf8');
const written = fs.readFileSync('assets/bac-written.css', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

const justification = writtenSkillTracks.find(skill => skill.id === 'justifier');
need(justification?.title === 'Justifier avec précision', 'Libellé académique de la compétence de justification absent');
need(!justification?.title?.toLowerCase().includes('bavarder'), 'Le libellé familier « bavarder » ne doit plus être affiché');

// Hiérarchie : seul le sélecteur est un contrôle ; la compétence reste une information statique.
need(patch.includes('.written-filterbar>label:last-child .written-badge'), 'Traitement visuel distinct de la compétence absent');
need(patch.includes('border-radius:12px'), 'La compétence conserve encore une apparence de grande pilule');
need(patch.includes('min-height:44px'), 'Cibles de 44 px absentes du correctif Écrit Bac');
need(patch.includes('text-overflow:ellipsis'), 'Protection des intitulés longs du sélecteur absente');

// Breakpoints : desktop → tablette → mobile, sans compression du troisième bloc.
need(patch.includes('@media(max-width:920px)'), 'Breakpoint tablette 920 px absent');
need(patch.includes('grid-column:1/-1'), 'La compétence ne passe pas sur une ligne dédiée en tablette');
need(patch.includes('@media(max-width:760px)') && patch.includes('grid-template-columns:1fr'), 'Repli mobile mono-colonne absent');
need(patch.includes('#written-training-lab .section-head') && patch.includes('flex-direction:column'), 'Entêtes de section non protégés sur mobile');
need(patch.includes('html.projector #written-training-lab'), 'Mode vidéoprojecteur non traité par le correctif');

// Les fondations générales doivent rester présentes : thèmes, clavier, mobile et réduction des animations.
need(base.includes('html[data-theme="light"]') && written.includes('html[data-theme="light"] #written-training-lab'), 'Mode clair incomplet');
need(base.includes(':focus-visible'), 'Focus clavier global absent');
need(base.includes('@media(max-width:980px)') && base.includes('@media(max-width:620px)'), 'Breakpoints généraux du site absents');
need(base.includes('@media(prefers-reduced-motion:reduce)'), 'Préférence reduced-motion non respectée');

// Intégration et hors-ligne : nouveaux correctifs à URL versionnée.
for (const asset of ['assets/bac-written-layout-fix.css?v=1.31.1','assets/bac-written-editorial-fix.js?v=1.31.1']) {
  need(index.includes(asset), `index.html ne charge pas ${asset}`);
}
for (const asset of ['bac-written-layout-fix.css?v=1.31.1','bac-written-editorial-fix.js?v=1.31.1']) {
  need(sw.includes(asset), `Cache hors ligne incomplet : ${asset}`);
}

if (errors.length) {
  console.error(`Layout Quality Gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Layout Quality Gate — OK | libellé académique · hiérarchie des contrôles · 44 px · tablette 920 px · mobile 760 px · clair/sombre · vidéoprojecteur · clavier · hors-ligne');
