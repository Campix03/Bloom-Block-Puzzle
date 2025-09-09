onst CACHE_NAME = 'bloom-block-v18-final-fix'; // Incremented version to force update
const urlsToCache = [
  '../', // Go up one level to cache from the root
  '../index.html',
  '../index.tsx',
  '../App.tsx',
  '../types.ts',
  '../constants.ts',
  '../hooks/useGameLogic.ts',
  '../hooks/useAds.ts',
  '../components/StartScreen.tsx',
  '../components/Game.tsx',
  '../components/GameBoard.tsx',
  '../components/PiecePreview.tsx',
  '../components/InfoPanel.tsx',
  '../components/Controls.tsx',
  '../components/MessageBox.tsx',
  '../components/AdBanner.tsx',
  './manifest.json', // These are relative to the sw.js file
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.12.4/babel.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(err => console.error('Cache addAll failed:', err))
  );
});

self.addEventListener('fetch', event => {
  // We don't want to cache AdSense scripts or other external resources that might change
  if (event.request.url.includes('google') || event.request.url.includes('ad')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all clients as soon as the SW is activated.
  );
});