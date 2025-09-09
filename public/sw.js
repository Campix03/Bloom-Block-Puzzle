const CACHE_NAME = 'bloom-block-v8'; // Incremented version to force update
const urlsToCache = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './hooks/useGameLogic.ts',
  './hooks/useAds.ts',
  './components/StartScreen.tsx',
  './components/Game.tsx',
  './components/GameBoard.tsx',
  './components/PiecePreview.tsx',
  './components/InfoPanel.tsx',
  './components/Controls.tsx',
  './components/MessageBox.tsx',
  './components/AdBanner.tsx',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  // NEW: Cache React and Babel scripts
  'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.12.4/babel.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // We use relative paths now, so we need to fetch them relative to the service worker's origin
        const cachePromises = urlsToCache.map(url => {
            // For external URLs, fetch them as is. For local URLs, construct the full path if needed.
            // In this setup, relative paths from root work correctly.
            return cache.add(new Request(url, {cache: 'reload'}));
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', event => {
  // We don't want to cache AdSense scripts
  if (event.request.url.includes('google')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
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
    })
  );
});