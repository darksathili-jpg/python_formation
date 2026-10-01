import { bacWrittenCorpus } from './bac-written-corpus.js';
import { bacWritten2021 } from './bac-written-2021.js';
import { bacWritten2022 } from './bac-written-2022.js';
import { bacWritten2023 } from './bac-written-2023.js';
import { bacWritten2024 } from './bac-written-2024.js';
import { bacWritten2025 } from './bac-written-2025.js';
import { bacWrittenCorpusPdfIndex } from './bac-written-pdf-index.js';

export const BAC_WRITTEN_CORPUS_INDEX_VERSION = '1.28.0';

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
for (const subject of detailed) {
  const verified = bacWrittenCorpusPdfIndex[subject.id];
  byId.set(subject.id, verified ? {
    ...subject,
    exerciseCount: verified.exerciseCount,
    themes: verified.themes,
    corpusVerified: true
  } : subject);
}

bacWrittenCorpus.splice(
  0,
  bacWrittenCorpus.length,
  ...[...byId.values()].sort((a, b) => b.year - a.year || a.zone.localeCompare(b.zone, 'fr') || a.session.localeCompare(b.session, 'fr'))
);

export const BAC_WRITTEN_SUBJECT_COUNT = bacWrittenCorpus.length;
export const BAC_WRITTEN_THEME_COUNT = bacWrittenCorpus.reduce((sum, subject) => sum + subject.themes.length, 0);
export const BAC_WRITTEN_VERIFIED_COUNT = bacWrittenCorpus.filter(subject => subject.corpusVerified).length;
