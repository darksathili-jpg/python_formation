export const PYODIDE_VERSION = '314.0.7';
export const APP_VERSION = '1.1.0';
export const PYODIDE_CORE_FILES = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json'
];

export const runtimeBaseURL = new URL(`../vendor/pyodide/${PYODIDE_VERSION}/`, import.meta.url).href;
export const runtimeURL = file => new URL(file, runtimeBaseURL).href;
export const PYODIDE_CORE_URLS = PYODIDE_CORE_FILES.map(runtimeURL);
