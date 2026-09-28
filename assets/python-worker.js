import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs';

let pyodide;
let bootError = null;

function asError(error) {
  return String(error?.message || error || 'Erreur Python inconnue').replace(/^PythonError:\s*/, '');
}

const ready = (async () => {
  try {
    pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/' });
    pyodide.setStdin({ error: true });
    self.postMessage({ type: 'ready' });
  } catch (error) {
    bootError = asError(error);
    self.postMessage({ type: 'boot-error', error: bootError });
    throw error;
  }
})();

self.addEventListener('message', async event => {
  const { type, requestId, code = '', tests = [] } = event.data || {};
  if (type !== 'run') return;
  try { await ready; } catch {
    self.postMessage({ type: 'result', requestId, ok: false, error: bootError || 'Moteur Python indisponible.', stdout: '', stderr: '', tests: [] });
    return;
  }

  let stdout = '';
  let stderr = '';
  pyodide.setStdout({ batched: msg => { stdout += msg.endsWith('\n') ? msg : `${msg}\n`; } });
  pyodide.setStderr({ batched: msg => { stderr += msg.endsWith('\n') ? msg : `${msg}\n`; } });
  const namespace = pyodide.runPython('dict()');
  const testResults = [];
  let executionError = '';

  try { await pyodide.runPythonAsync(code, { globals: namespace }); }
  catch (error) { executionError = asError(error); }

  if (!executionError) {
    for (const test of tests) {
      if (test.raises) {
        let raised = '';
        try { await pyodide.runPythonAsync(test.expr, { globals: namespace }); }
        catch (error) { raised = asError(error); }
        const pass = raised.includes(test.raises);
        testResults.push({ label: test.label, pass, error: pass ? '' : (raised ? `exception reçue : ${raised.split('\n')[0]}` : `aucune ${test.raises} levée`) });
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
  pyodide.setStdout();
  pyodide.setStderr();
  self.postMessage({ type: 'result', requestId, ok: !executionError && testResults.every(test => test.pass), error: executionError, stdout, stderr, tests: testResults });
});
