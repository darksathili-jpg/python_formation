import fs from 'node:fs';

const css = fs.readFileSync(new URL('../assets/visual-contrast.css', import.meta.url), 'utf8');

function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`Bloc CSS introuvable: ${selector}`);
  return match[1];
}

function vars(selector) {
  const out = {};
  for (const match of block(selector).matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) out[match[1]] = match[2];
  return out;
}

function channel(v) {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = channel((n >> 16) & 255);
  const g = channel((n >> 8) & 255);
  const b = channel(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function requireRatio(name, foreground, background, minimum) {
  const value = ratio(foreground, background);
  if (value < minimum) throw new Error(`${name}: ${value.toFixed(2)}:1 < ${minimum}:1 (${foreground} sur ${background})`);
  console.log(`✓ ${name}: ${value.toFixed(2)}:1`);
}

const light = vars('html[data-theme="light"]');
const projector = vars('html.projector');

for (const [name, palette] of [['clair', light], ['projection', projector]]) {
  requireRatio(`${name} · champ éditable`, palette['field-text'], palette['field-bg'], 4.5);
  requireRatio(`${name} · code principal`, palette['code-text'], palette['code-bg'], 7);
  requireRatio(`${name} · barre/outils code`, palette['code-muted'], palette['code-bg-2'], 4.5);
  requireRatio(`${name} · succès`, palette['code-pass'], palette['code-bg-2'], 4.5);
  requireRatio(`${name} · erreur`, palette['code-fail'], palette['code-bg-2'], 4.5);
}

requireRatio('projection · texte principal', projector.text, projector.bg, 7);
requireRatio('projection · texte secondaire', projector.muted, projector.bg, 4.5);
requireRatio('projection · accent', projector.accent, projector.bg, 4.5);
requireRatio('projection · bordure de composant', projector['code-border'], projector['code-bg'], 3);

for (const selector of ['.reflection-editor', '.code-editor,.runner-status', 'html.projector']) {
  if (!css.includes(selector)) throw new Error(`Garde-fou visuel manquant: ${selector}`);
}

console.log('Contraste V1.5: profils clair et vidéoprojecteur validés.');
