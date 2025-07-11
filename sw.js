// Service Worker for IPM Package Release Notes Viewer

const CACHE_NAME = 'ipm-release-notes-cache-v1';
const OFFLINE_URL = './offline.html';
const CACHED_FILES = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Install event - cache basic files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(CACHED_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
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
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Skip CORS requests to feed.ipmhub.io
  // This allows the app to handle CORS issues itself
  if (requestUrl.hostname === 'feed.ipmhub.io') {
    return;
  }
  
  // Handle navigation requests - return cached index.html for all navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For all other requests, try network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
