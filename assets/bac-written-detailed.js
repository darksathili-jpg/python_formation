import { bacWrittenCorpus } from './bac-written-corpus.js';
import { bacWritten2021 } from './bac-written-2021.js';
import { bacWritten2022 } from './bac-written-2022.js';
import { bacWritten2023 } from './bac-written-2023.js';
import { bacWritten2024 } from './bac-written-2024.js';
import { bacWritten2025 } from './bac-written-2025.js';

const current2026 = bacWrittenCorpus.filter(subject => subject.year === 2026);
const detailed = [
  ...current2026,
  ...bacWritten2025,
  ...bacWritten2024,
  ...bacWritten2023,
  ...bacWritten2022,
  ...bacWritten2021
];

const byId = new Map();
for (const subject of detailed) byId.set(subject.id, subject);

bacWrittenCorpus.splice(
  0,
  bacWrittenCorpus.length,
  ...[...byId.values()].sort((a, b) => b.year - a.year || a.zone.localeCompare(b.zone, 'fr') || a.session.localeCompare(b.session, 'fr'))
);

export const BAC_WRITTEN_SUBJECT_COUNT = bacWrittenCorpus.length;
export const BAC_WRITTEN_THEME_COUNT = bacWrittenCorpus.reduce((sum, subject) => sum + subject.themes.length, 0);
