const APP_VERSION = '1.22.0';
const PYODIDE_VERSION = '314.0.7';
const SHELL_CACHE = `python-forge-shell-v${APP_VERSION}`;
const RUNTIME_CACHE = `python-forge-pyodide-${PYODIDE_VERSION}`;
const RUNTIME_MARKER = `/vendor/pyodide/${PYODIDE_VERSION}/`;

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/styles.css?v=1.17.0',
  './assets/classroom-reliability.css?v=1.17.0',
  './assets/pedagogy.css?v=1.17.0',
  './assets/novice-gate.css?v=1.17.0',
  './assets/branding.css?v=1.17.0',
  './assets/visual-contrast.css?v=1.17.0',
  './assets/exercise-brief.css?v=1.17.0',
  './assets/app.js?v=1.17.0',
  './assets/pedagogy-bootstrap.js?v=1.17.0',
  './assets/pedagogy-engine.js?v=1.17.0',
  './assets/novice-gate.js?v=1.17.0',
  './assets/statement-enhancer.js?v=1.17.0',
  './assets/exercise-brief.js',
  './assets/editorial-overrides.js',
  './assets/student-zero-p1p2.js',
  './assets/student-zero-p3p4.js',
  './assets/student-zero-p5p6.js',
  './assets/student-zero-p7p8.js',
  './assets/student-zero-p8p9.js',
  './assets/student-zero-p9t1.js',
  './assets/student-zero-t1t2.js',
  './assets/student-zero-t2t3.js',
  './assets/student-zero-t3t4.js',
  './assets/student-zero-t4t5.js',
  './assets/student-zero-t5t6.js',
  './assets/student-zero-t6t7.js',
  './assets/student-zero-t7t8.js',
  './assets/student-zero-t7t8-editorial.js',
  './assets/student-zero-t8t9.js',
  './assets/student-zero-t8t9-editorial.js',
  './assets/student-zero-t9t10.js',
  './assets/student-zero-t9t10-editorial.js',
  './assets/app-shell.js',
  './assets/content.js',
  './assets/content-meta.js',
  './assets/content-p1.js',
  './assets/content-p2.js',
  './assets/content-t1.js',
  './assets/content-t2.js',
  './assets/practice-bank.js',
  './assets/primm-bank.js',
  './assets/capstone-bank.js',
  './assets/novice-bank.js',
  './assets/novice-overrides.js',
  './assets/runtime-config.js?v=1.1.0',
  './assets/python-worker.js?v=1.1.0',
  './assets/branding/logo-watteau.jpg',
  './assets/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes(RUNTIME_MARKER)) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(cacheFirst(request, SHELL_CACHE));
});
