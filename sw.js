const CACHE_NAME = 'bloom-block-v46-clean-structure';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Core Dependencies
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone@7.24.0/babel.min.js',
  // App Source Files
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './hooks/useGameLogic.ts',
  './components/StartScreen.tsx',
  './components/Game.tsx',
  './components/GameBoard.tsx',
  './components/PiecePreview.tsx',
  './components/InfoPanel.tsx',
  './components/Controls.tsx',
  './components/MessageBox.tsx'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll with a catch to prevent install failure if one resource fails
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Failed to cache one or more resources during install:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
