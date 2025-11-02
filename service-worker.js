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

const APP_STORAGE_KEY = 'garden-service-tracker';
const TIMER_STORAGE = {
  START_TIME: 'timer_startTime',
  BASE_TIME: 'timer_baseTime',
};
const NOTIFICATION_TAG = 'garden-timer';
const REMINDER_NOTIFICATION_TAG = 'garden-daily-reminder';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  notification.close();

  // Handle reminder notifications
  if (notification.tag === REMINDER_NOTIFICATION_TAG) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
    return;
  }

  // Handle timer notifications
  if (notification.tag === NOTIFICATION_TAG) {
    const handleAction = async (action) => {
      const startTime = localStorage.getItem(TIMER_STORAGE.START_TIME);
      const baseTime = parseFloat(localStorage.getItem(TIMER_STORAGE.BASE_TIME) || '0');

      if (!startTime) return; // Timer wasn't running

      const elapsed = (Date.now() - parseFloat(startTime)) / 1000;
      const newBaseTime = baseTime + elapsed;

      if (action === 'pause') {
        localStorage.setItem(TIMER_STORAGE.BASE_TIME, String(newBaseTime));
        localStorage.removeItem(TIMER_STORAGE.START_TIME);
      } else if (action === 'finish') {
        const hoursToAdd = newBaseTime / 3600;
        
        // Reset timer
        localStorage.removeItem(TIMER_STORAGE.BASE_TIME);
        localStorage.removeItem(TIMER_STORAGE.START_TIME);

        if (hoursToAdd <= 0.01) return;

        // Update main app state
        const appStateString = localStorage.getItem(APP_STORAGE_KEY);
        if (appStateString) {
          try {
            const appState = JSON.parse(appStateString);
            
            const formatDateKey = (date) => {
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              return `${year}-${month}-${day}`;
            };
            
            const dateKey = formatDateKey(new Date());
            
            appState.currentHours = (appState.currentHours || 0) + hoursToAdd;
            appState.history = appState.history || {};
            appState.history[dateKey] = (appState.history[dateKey] || 0) + hoursToAdd;
            
            localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
          } catch(e) {
            console.error("SW: Failed to update app state.", e);
          }
        }
      }
    };
    event.waitUntil(handleAction(event.action));
    return;
  }
});