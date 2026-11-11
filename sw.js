// Matchday service worker: cache the built app, then serve it offline.
// The build fills in the version and the file list (see vite.config.ts).
const CACHE = 'matchday-mwcl1k2f';
const PRECACHE = ["./","manifest.webmanifest","icons/icon.svg","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","assets/index-C7iZSRIy.js","assets/barlow-condensed-latin-600-normal-DepVgxBB.woff2","assets/barlow-condensed-latin-800-normal-BKzMuPgK.woff2","assets/barlow-condensed-latin-ext-600-normal-18ESti3H.woff2","assets/barlow-condensed-latin-ext-800-normal-DGNyg4u8.woff2","assets/barlow-condensed-vietnamese-600-normal-A5AYRdjN.woff2","assets/barlow-condensed-vietnamese-800-normal-CpjukuLw.woff2","assets/index-CbGP6sX9.css"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // Pages: try the network for the latest version, fall back to the cached app.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./', { ignoreVary: true })));
    return;
  }

  // Files: cached first (their names change whenever their content does).
  // ignoreVary: some hosts send Vary headers that would stop cached files matching.
  event.respondWith(caches.match(request, { ignoreVary: true }).then((hit) => hit || fetch(request)));
});
