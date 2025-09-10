const CACHE_NAME = 'bloom-block-v45-final';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './metadata.json',
  './index.tsx',
  './App.tsx',
  './constants.ts',
  './types.ts',
  './hooks/useGameLogic.ts',
  './components/App.tsx',
  './components/Controls.tsx',
  './components/Game.tsx',
  './components/GameBoard.tsx',
  './components/InfoPanel.tsx',
  './components/MessageBox.tsx',
  './components/PiecePreview.tsx',
  './components/StartScreen.tsx',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone@7.24.0/babel.min.js'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      // Clone the request because it's a stream and can only be consumed once.
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response because it's a stream and can only be consumed once.
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
            // We don't cache everything, just the assets we defined.
            // This is a simple strategy. A more robust one would check the request URL.
        });

        return response;
      });
    })
  );
});