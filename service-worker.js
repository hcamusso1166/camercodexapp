self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('ars-camer-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/favicon.ico',
        '/audios/2C.mp3',
        '/audios/2D.mp3',
        '/audios/2P.mp3',
        '/audios/2T.mp3',
        '/audios/3C.mp3',
        '/audios/3D.mp3',
        '/audios/3P.mp3',
        '/audios/3T.mp3'
        // Agregar más audios si es necesario
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
