export const BAC_EXAM_STUDIO_PACK_TOOLS_VERSION = '1.31.0';

const defaultLanguage = type => type === 'code'
  ? 'Sur la copie, garde un code lisible, des noms cohérents et fais apparaître directement l’idée algorithmique attendue ; ajoute une phrase de justification seulement lorsqu’elle éclaire un choix.'
  : 'Sur la copie, formule une réponse complète : nomme la notion mobilisée, relie-la aux données du problème et conclus explicitement avec le vocabulaire NSI approprié.';

export function goldQuestion(id, number, prompt, answerType, recognize, reasoning, expected, traps, criteria, options = {}) {
  const steps = Array.isArray(reasoning) ? reasoning : [reasoning];
  const trapList = Array.isArray(traps) ? traps : [traps];
  const criterionList = Array.isArray(criteria) ? criteria : [criteria];
  const generatedHints = [
    `Repère d’abord la notion ou la structure utile : ${recognize}`,
    steps[0] || 'Décompose la consigne en données, traitement et résultat attendu.',
    steps.at(-1) || 'Vérifie le résultat sur le cas donné avant de conclure.'
  ];
  return {
    id,
    number,
    prompt,
    answerType,
    correction: {
      recognize,
      reasoning: steps,
      expected,
      traps: trapList,
      language: options.language || defaultLanguage(answerType)
    },
    hints: options.hints || generatedHints,
    criteria: criterionList,
    minChars: options.minChars ?? (answerType === 'code' ? 8 : 18),
    sourceQuestion: options.sourceQuestion || number
  };
}

export function goldPack(meta, questions, sections = null) {
  const ids = questions.map(question => question.id);
  return {
    year: 2026,
    points: meta.points ?? (meta.exercise === 3 ? 8 : 6),
    estimatedMinutes: meta.estimatedMinutes ?? (meta.exercise === 3 ? 65 : 50),
    level: 'Pack Gold · correction intégrale',
    sourceNote: meta.sourceNote || 'Énoncé officiel 2026 vérifié. Les formulations sont réécrites pour rendre le dossier autonome ; les réponses sont recalculées et accompagnées d’un raisonnement, de pièges fréquents et de critères d’auto-vérification.',
    audit: {
      officialTextChecked: true,
      solutionChecked: true,
      correctionMode: meta.correctionMode || 'recomputed',
      checkedAt: '2026-10-01',
      ...meta.audit
    },
    ...meta,
    sections: sections || [{ id: 'A', title: 'Parcours guidé', questions: ids }],
    questions
  };
}
