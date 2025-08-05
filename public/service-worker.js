// Flutterbye Service Worker for PWA functionality
const CACHE_NAME = 'flutterbye-v1';
const STATIC_CACHE_NAME = 'flutterbye-static-v1';
const DYNAMIC_CACHE_NAME = 'flutterbye-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/dashboard\/stats$/,
  /^\/api\/marketplace\/nfts$/,
  /^\/api\/admin\/features$/,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME;
            })
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Handle API requests with cache-first for specific endpoints
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const shouldCache = API_CACHE_PATTERNS.some(pattern => 
    pattern.test(url.pathname)
  );

  if (shouldCache && request.method === 'GET') {
    try {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      // Return cached response if available and fresh
      if (cachedResponse) {
        const cacheDate = new Date(cachedResponse.headers.get('date'));
        const now = new Date();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (now - cacheDate < fiveMinutes) {
          return cachedResponse;
        }
      }
      
      // Fetch fresh data
      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      // Return cached response if network fails
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      return cachedResponse || new Response('Offline', { status: 503 });
    }
  }

  // For non-cached API requests, try network only
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Network Error', { status: 503 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return cached version if available
    const cache = await caches.open(STATIC_CACHE_NAME);
    return await cache.match(request);
  }
}

// Handle navigation requests
async function handleNavigation(request) {
  try {
    return await fetch(request);
  } catch (error) {
    // Return offline page for navigation failures
    const cache = await caches.open(STATIC_CACHE_NAME);
    return await cache.match('/offline.html') || 
           await cache.match('/');
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('Performing background sync');
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Flutterbye', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});