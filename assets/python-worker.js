import { PYODIDE_VERSION, runtimeBaseURL, runtimeURL } from './runtime-config.js?v=1.1.0';

let pyodide;
let bootError = null;

function asError(error) {
  return String(error?.message || error || 'Erreur Python inconnue').replace(/^PythonError:\s*/, '');
}

const ready = (async () => {
  try {
    const { loadPyodide } = await import(runtimeURL('pyodide.mjs'));
    pyodide = await loadPyodide({ indexURL: runtimeBaseURL });
    pyodide.setStdin({ error: true });
    const pythonVersion = pyodide.runPython('import platform; platform.python_version()');
    self.postMessage({
      type: 'ready',
      version: String(pythonVersion),
      pyodideVersion: PYODIDE_VERSION,
      source: 'same-origin'
    });
  } catch (error) {
    bootError = asError(error);
    self.postMessage({ type: 'boot-error', error: bootError });
    throw error;
  }
})();

function configureStdin(input = '') {
  const normalized = String(input).replace(/\r\n?/g, '\n');
  const lines = normalized === '' ? [] : normalized.split('\n');
  let cursor = 0;
  pyodide.setStdin({
    autoEOF: false,
    stdin: () => cursor < lines.length ? `${lines[cursor++]}\n` : null
  });
}

self.addEventListener('message', async event => {
  const { type, requestId, code = '', tests = [], stdin = '' } = event.data || {};
  if (type !== 'run') return;

  try {
    await ready;
  } catch {
    self.postMessage({
      type: 'result',
      requestId,
      ok: false,
      error: bootError || 'Moteur Python indisponible.',
      stdout: '',
      stderr: '',
      tests: []
    });
    return;
  }

  let stdout = '';
  let stderr = '';
  pyodide.setStdout({ batched: msg => { stdout += msg; } });
  pyodide.setStderr({ batched: msg => { stderr += msg; } });
  configureStdin(stdin);

  const namespace = pyodide.runPython('dict()');
  const testResults = [];
  let executionError = '';

  try {
    await pyodide.runPythonAsync(code, { globals: namespace });
  } catch (error) {
    executionError = asError(error);
  }

  if (!executionError) {
    for (const test of tests) {
      if (test.raises) {
        let raised = '';
        try {
          await pyodide.runPythonAsync(test.expr, { globals: namespace });
        } catch (error) {
          raised = asError(error);
        }
        const pass = raised.includes(test.raises);
        testResults.push({
          label: test.label,
          pass,
          error: pass ? '' : (raised ? `exception reçue : ${raised.split('\n')[0]}` : `aucune ${test.raises} levée`)
        });
        continue;
      }
      try {
        const result = await pyodide.runPythonAsync(test.expr, { globals: namespace });
        const pass = result === true || result === 1;
        if (result && typeof result.destroy === 'function') result.destroy();
        testResults.push({ label: test.label, pass, error: pass ? '' : 'résultat faux' });
      } catch (error) {
        testResults.push({ label: test.label, pass: false, error: asError(error).split('\n')[0] });
      }
    }
  }

  try { namespace.destroy(); } catch {}
  pyodide.setStdin({ error: true });
  pyodide.setStdout();
  pyodide.setStderr();
  self.postMessage({
    type: 'result',
    requestId,
    ok: !executionError && testResults.every(test => test.pass),
    error: executionError,
    stdout,
    stderr,
    tests: testResults
  });
});
