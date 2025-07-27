const CACHE_NAME = 'my-pwa-cache-v1'; // Increment this version number when you update files
const urlsToCache = [
  '/', // The root of your website
  '/index.html',
  '/style.css',
  '/script.js', // If you have a main JavaScript file
  '/images/logo.png', // Add other essential assets like images, fonts etc.
  // Add all static assets your website needs to function offline
];

// Installation: Cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activates the new service worker immediately
  );
});

// Activation: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('my-pwa-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim()) // Takes control of pages immediately
  );
});

// Fetch: Serve from cache first, then fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If resource is in cache, return it
        if (response) {
          return response;
        }
        // Otherwise, fetch from network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response (it's a stream!)
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
      .catch(() => {
        // This catch handles network errors (e.g., offline) and also
        // cases where caches.match() or fetch() throws an error.
        // You might want to serve an offline page here.
        // For example:
        // return caches.match('/offline.html');
      })
  );
});