const CACHE_NAME = 'camer-codex-cache-v1';
const MANIFEST_URL = '/cache-files.json';
// Los archivos listados en cache-files.json se precargan durante la
// instalación. Cualquier otro recurso solicitado se añadirá al caché de
// forma dinámica a través del manejador `fetch`.

// Instalación del Service Worker y cacheo inicial
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(async (cache) => {
        try {
          // Leer listado completo de archivos y agregarlos al caché
          const response = await fetch(MANIFEST_URL);
          const files = await response.json();
          await cache.addAll([...files, MANIFEST_URL]);
        } catch (err) {
          console.error('[ServiceWorker] Error caching files:', err);
        }
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

