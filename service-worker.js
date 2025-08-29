const CACHE_NAME = 'camer-codex-cache-v2';
const MANIFEST_URL = '/cache-files.json';
//const CARTAS_URL = '/audios/cartas.json';

// Los archivos listados en cache-files.json se precargan durante la
// instalación. Cualquier otro recurso solicitado se añadirá al caché de
// forma dinámica a través del manejador `fetch`.

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(MANIFEST_URL);
        if (!response.ok) {
      console.warn('[ServiceWorker] No se pudo obtener el manifiesto de caché:', response.status);
      return;
    }
    let files;
    try {
      files = await response.json();
    } catch (err) {
      console.warn('[ServiceWorker] Manifiesto de caché inválido:', err);
      return;
    }

    await Promise.all(files.map(async (path) => {
      try {
        await cache.add(path);
      } catch (err) {
        console.warn('[ServiceWorker] Failed to cache', path, err);
      }
    }));

    await cache.add(MANIFEST_URL);
/*
    try {
      const cartasResp = await fetch(CARTAS_URL);
      const cartas = await cartasResp.json();
      await cache.add(CARTAS_URL);
      const audios = Object.values(cartas).map(name => `/audios/${name}`);
      await Promise.all(audios.map(async (path) => {
        try {
          await cache.add(path);
        } catch (err) {
          console.warn('[ServiceWorker] Failed to cache', path, err);
        }
      }));
    } catch (err) {
      console.error('[ServiceWorker] Error caching audios:', err);
    }
*/
    console.log('[ServiceWorker] Precache complete');
  } catch (err) {
    console.warn('[ServiceWorker] Error caching files:', err);
  }
}

// Instalación del Service Worker y cacheo inicial de todos los recursos
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(precache());
  self.skipWaiting();
});

// Activación y limpieza de cachés viejas
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
    event.waitUntil((async () => {
    const keyList = await caches.keys();
    await Promise.all(keyList.map((key) => {
      if (key !== CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache:', key);
        return caches.delete(key);
      }
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cache') {
    event.waitUntil(precache());
  }
});

// Interceptar fetch y responder con caché si está disponible
self.addEventListener('fetch', (event) => {
const { request } = event;
  const rangeHeader = request.headers.get('range');

  // Manejo de peticiones con Rangos (audio/video)
  if (rangeHeader) {
    const url = new URL(request.url);

    // Ignorar peticiones de otros orígenes
    if (url.origin !== self.location.origin) {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        let response = await cache.match(url.pathname);

        if (!response) {
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
      (async () => {
      const url = new URL(request.url);
      const cacheKey = url.origin === self.location.origin ? url.pathname : request.url;
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
      try {
        const networkResponse = await fetch(request);
        if (url.origin === self.location.origin) {
          cache.put(cacheKey, networkResponse.clone());
        }
        return networkResponse;
      } catch (err) {
        return cache.match('/index.html');
      }
    })()
  );
});