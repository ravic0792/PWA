// public/service-worker.js

const CACHE_NAME = 'chat-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  // Add other files to cache (stylesheets, images, etc.)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cache
      if (response) {
        return response;
      }

      // Clone the request since it's a one-time-use
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response to store it in the cache
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
// Add the following code to the service-worker.js file

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: 'icon.png',
    badge: 'badge.png',
  };

  event.waitUntil(
    self.registration.showNotification('Chat App Notification', options)
  );
});
