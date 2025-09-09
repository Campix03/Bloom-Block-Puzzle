// Define a version for the cache
const CACHE_VERSION = 'v1.0.2'; // Incremented version to ensure update
const CACHE_NAME = `block-bloom-cache-${CACHE_VERSION}`;

// List of all the files and assets to be cached using relative paths
const urlsToCache = [
  '.',
  './index.html',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './constants.ts',
  './types.ts',
  './hooks/useGameLogic.ts',
  './hooks/useAds.ts',
  './components/Controls.tsx',
  './components/Game.tsx',
  './components/GameBoard.tsx',
  './components/InfoPanel.tsx',
  './components/MessageBox.tsx',
  './components/PiecePreview.tsx',
  './components/StartScreen.tsx',
  './components/AdBanner.tsx',
  './icon-192.png',
  './icon-512.png',
  // CDN assets
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap',
  'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2'
];

// Install event: triggered when the service worker is first installed
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        // Use addAll with a catch block to handle potential individual asset failures
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache some assets during install:', error);
        });
      })
  );
});

// Activate event: triggered when the service worker is activated
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: triggered for every network request made by the page
self.addEventListener('fetch', event => {
  // Don't cache ad-related scripts, always fetch from network
  if (event.request.url.includes('googlesyndication.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, then cache and return
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Exclude non-cacheable CDN responses
            if (networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
                return networkResponse;
            }

            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});