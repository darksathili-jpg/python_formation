export const BAC_READINESS_EFFICACY_VERSION = '1.32.0';

export const efficacyPolicy = {
  strategyMinChars: 50,
  writtenMinChars: 240,
  dialogueMinChars: 60,
  postmortemMinChars: 120,
  efficientAttemptsAverageMax: 3,
  efficientAttemptsSingleMax: 6
};

function textLen(value) {
  return String(value || '').trim().length;
}

export function evaluateBacReadiness(readinessSessions, coreStore = {}, evidenceStore = {}, reflectionStore = {}) {
  const tasks = readinessSessions.flatMap(session => session.tasks.map(task => ({ session, task })));
  let totalAttempts = 0;
  let maxAttempts = 0;

  const bySession = readinessSessions.map(session => {
    const core = coreStore[session.id] || {};
    const deadline = Number(core.startedAt || 0) + Number(session.duration || 60) * 60_000;
    const ended = Boolean(core.endedAt);
    const codeOnTime = ended && session.tasks.every(task => {
      const passedAt = Number(core.passedTasks?.[task.id] || 0);
      return passedAt > 0 && passedAt <= deadline;
    });
    const written = textLen(core.written) >= efficacyPolicy.writtenMinChars
      && Number(core.writtenUpdatedAt || 0) > 0
      && Number(core.writtenUpdatedAt || 0) <= deadline
      && (core.criteria || []).length >= 3;
    const dialogue = ended && session.dialogue.every((_, index) =>
      textLen(core.dialogue?.[String(index)]) >= efficacyPolicy.dialogueMinChars
    );
    const recognition = session.tasks.every(task => {
      const ev = evidenceStore[task.id] || {};
      const lockedAt = Number(ev.lockedAt || 0);
      const firstTestAt = Number(ev.firstTestAt || 0);
      return textLen(ev.strategy) >= efficacyPolicy.strategyMinChars
        && lockedAt >= Number(core.startedAt || 0)
        && lockedAt <= deadline
        && firstTestAt >= lockedAt;
    });
    const postmortem = textLen(reflectionStore[session.id]?.postmortem) >= efficacyPolicy.postmortemMinChars;

    return { id: session.id, ended, codeOnTime, written, dialogue, recognition, postmortem };
  });

  for (const { task } of tasks) {
    const attempts = Number(evidenceStore[task.id]?.attemptCount || 0);
    totalAttempts += attempts;
    maxAttempts = Math.max(maxAttempts, attempts);
  }
  const averageAttempts = tasks.length ? totalAttempts / tasks.length : 0;
  const efficiency = tasks.length > 0
    && averageAttempts <= efficacyPolicy.efficientAttemptsAverageMax
    && maxAttempts <= efficacyPolicy.efficientAttemptsSingleMax;

  const axes = {
    sessions: bySession.every(row => row.ended),
    recognition: bySession.every(row => row.recognition),
    code: bySession.every(row => row.codeOnTime),
    efficiency,
    written: bySession.every(row => row.written),
    dialogue: bySession.every(row => row.dialogue),
    postmortem: bySession.every(row => row.postmortem)
  };
  const passedAxes = Object.values(axes).filter(Boolean).length;
  const pass = Object.values(axes).every(Boolean);
  const status = pass ? 'ready' : axes.sessions ? 'consolidate' : 'incomplete';

  return {
    policy: efficacyPolicy,
    bySession,
    axes,
    passedAxes,
    totalAxes: Object.keys(axes).length,
    totalAttempts,
    averageAttempts,
    maxAttempts,
    pass,
    status
  };
}
