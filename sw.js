
 * A basic service worker.
 * This file is included to make the application progressive web app (PWA) capable
 * and to prevent service worker registration errors. It provides a minimal implementation
 * of install, activate, and fetch event listeners.
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Take control of all clients as soon as the service worker is activated.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // A basic "network falling back to cache" strategy is not implemented.
  // For now, it just fetches from the network. This is a placeholder for
  // a real caching strategy.
  event.respondWith(fetch(event.request));
});
