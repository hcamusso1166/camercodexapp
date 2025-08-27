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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => caches.match('/index.html'));
    })
  );
});

