import fs from 'node:fs';

const errors = [];
const need = (condition, message) => { if (!condition) errors.push(message); };
const globalCss = fs.readFileSync('assets/styles.css', 'utf8');
const studioCss = fs.readFileSync('assets/bac-exam-studio.css', 'utf8');
const safetyCss = fs.readFileSync('assets/bac-exam-studio-contrast.css', 'utf8');

function block(pattern, label) {
  const match = globalCss.match(pattern);
  need(Boolean(match), `${label}: bloc CSS introuvable`);
  return match?.[1] || '';
}
function cssVar(css, name) {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+)`));
  need(Boolean(match), `Variable CSS --${name} introuvable`);
  return match?.[1]?.trim() || '';
}
function normalizeHex(value) {
  const raw = value.trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(raw)) return `#${[...raw.slice(1)].map(c => c + c).join('')}`;
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  throw new Error(`Couleur non hexadécimale non prise en charge par le gate: ${value}`);
}
function luminance(hex) {
  const h = normalizeHex(hex).slice(1);
  const channels = [0,2,4].map(i => parseInt(h.slice(i,i+2),16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(a,b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la,lb) + 0.05) / (Math.min(la,lb) + 0.05);
}
function assertContrast(label, foreground, background, minimum = 4.5) {
  const ratio = contrast(foreground, background);
  need(ratio >= minimum, `${label}: contraste ${ratio.toFixed(2)}:1 < ${minimum}:1 (${foreground} / ${background})`);
  return ratio;
}

const dark = block(/:root\{([^}]*)\}/s, 'Thème sombre');
const light = block(/html\[data-theme="light"\]\{([^}]*)\}/s, 'Thème clair');
const darkColors = {
  panel: cssVar(dark,'panel-solid'), panel2: cssVar(dark,'panel-2'), text: cssVar(dark,'text'), muted: cssVar(dark,'muted'), accent: cssVar(dark,'accent')
};
const lightColors = {
  panel: cssVar(light,'panel-solid'), panel2: cssVar(light,'panel-2'), text: cssVar(light,'text'), muted: cssVar(light,'muted'), accent: '#07765f'
};

const ratios = [
  ['sombre texte / panneau', darkColors.text, darkColors.panel],
  ['sombre secondaire / panneau', darkColors.muted, darkColors.panel],
  ['sombre texte / panneau secondaire', darkColors.text, darkColors.panel2],
  ['sombre secondaire / panneau secondaire', darkColors.muted, darkColors.panel2],
  ['sombre accent / panneau', darkColors.accent, darkColors.panel],
  ['clair texte / panneau', lightColors.text, lightColors.panel],
  ['clair secondaire / panneau', lightColors.muted, lightColors.panel],
  ['clair texte / panneau secondaire', lightColors.text, lightColors.panel2],
  ['clair secondaire / panneau secondaire', lightColors.muted, lightColors.panel2],
  ['clair accent Studio / panneau', lightColors.accent, lightColors.panel],
  ['clair accent Studio / panneau secondaire', lightColors.accent, lightColors.panel2],
  ['clair texte blanc / bouton accent', '#ffffff', lightColors.accent],
  ['sombre texte bouton / bouton accent', '#041116', darkColors.accent]
].map(([label,fg,bg]) => [label, assertContrast(label,fg,bg)]);

need(safetyCss.includes('--w-accent:#07765f'), 'Le Written Lab doit utiliser l’accent clair renforcé #07765f');
need(safetyCss.includes('--studio-accent:#07765f'), 'Le Bac Exam Studio doit utiliser l’accent clair renforcé #07765f');
need(safetyCss.includes('.written-tabs button.active') && safetyCss.includes('color:#fff'), 'Contraste de l’onglet actif Written en mode clair non verrouillé');
need(safetyCss.includes('.bac-exam-studio-shell .btn.primary'), 'Contraste des boutons primaires Studio non verrouillé');
need(safetyCss.includes('.studio-pane-index') && safetyCss.includes('.studio-correction-step'), 'Contraste des marqueurs numérotés Studio non verrouillé');
need(studioCss.includes('outline:3px solid var(--studio-accent)') && studioCss.includes('outline-offset:3px'), 'Indicateur de focus renforcé absent');
need(studioCss.includes('min-height:44px'), 'Garde-fou de taille tactile 44 px absent');

if (errors.length) {
  console.error(`Bac Exam Studio contrast gate FAILED (${errors.length})\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Bac Exam Studio contrast gate — OK | ${ratios.map(([label,ratio]) => `${label} ${ratio.toFixed(2)}:1`).join(' · ')}`);
