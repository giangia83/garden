const CACHE_NAME = 'garden-cache-v1';
// Lista completa de recursos necesarios para que la app funcione offline.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx', // Asumiendo que el bundler lo sirve en esta ruta
  '/assets/icon-192x192.svg',
  '/assets/icon-512x512.svg',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/react@^19.2.0/'
];

self.addEventListener('install', (event) => {
  // Realiza la instalación: abre la caché y añade los recursos.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Estrategia "Cache First": responde desde la caché si es posible.
  // Si no está en caché, va a la red.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si encontramos una respuesta en la caché, la devolvemos.
        if (response) {
          return response;
        }
        // Si no, intentamos obtenerla de la red.
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Limpia cachés antiguas para evitar conflictos.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});