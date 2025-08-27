const CACHE_NAME = 'camer-codex-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/js/main.js',
  '/js/config.js',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/img/servidor.gif',
  '/img/sprite.png',
  '/audios/cartas.json'
];
// Los recursos listados arriba se precargan durante la instalación.
// Cualquier otro archivo se almacenará en caché la primera vez que se
// solicite, gracias al manejador `fetch` definido más abajo.

// Instalación del Service Worker y cacheo inicial
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[ServiceWorker] Caching app shell');
        await cache.addAll(urlsToCache);

        // Precargar archivos de audio listados en cartas.json
        try {
          const response = await fetch('/audios/cartas.json');
          const audioMap = await response.json();
          const audioFiles = Object.values(audioMap).map((file) => `/audios/${file}`);
          await cache.addAll(audioFiles);
        } catch (err) {
          console.error('[ServiceWorker] Error caching audio files:', err);
        }
      })
      .catch((err) => {
        console.error('[ServiceWorker] Error caching app shell:', err);
      })
  );
});

// Activación y limpieza de cachés viejas
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Interceptar fetch y responder con caché si está disponible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const rangeHeader = request.headers.get('range');

  // Manejo de peticiones con Rangos (audio/video)
  if (rangeHeader) {
    const url = new URL(request.url);
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        let response = await cache.match(url.pathname);

        if (!response) {
          // Si no está en caché, obtener el archivo completo de la red
          const networkResponse = await fetch(url.pathname);
          await cache.put(url.pathname, networkResponse.clone());
          response = networkResponse;
        }

        const buffer = await response.arrayBuffer();
        const bytes = /bytes=(\d+)-(?:(\d+))?/.exec(rangeHeader);
        const start = Number(bytes[1]);
        const end = bytes[2] ? Number(bytes[2]) : buffer.byteLength - 1;
        const chunk = buffer.slice(start, end + 1);
        const headers = [
          ['Content-Range', `bytes ${start}-${end}/${buffer.byteLength}`],
          ['Accept-Ranges', 'bytes'],
          ['Content-Length', chunk.byteLength],
          ['Content-Type', response.headers.get('Content-Type') || 'audio/mpeg']
        ];

        return new Response(chunk, {
          status: 206,
          statusText: 'Partial Content',
          headers
        });
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});

