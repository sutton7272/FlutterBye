// Flutterbye PWA Service Worker
const CACHE_NAME = 'flutterbye-v1.0.0';
const STATIC_CACHE_NAME = 'flutterbye-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'flutterbye-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core CSS and JS will be added dynamically
];

// API endpoints that can be cached
const CACHEABLE_APIS = [
  '/api/tokens',
  '/api/marketplace',
  '/api/portfolio'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle page requests
  event.respondWith(handlePageRequest(request));
});

// API request handler - network first, cache second
async function handleApiRequest(request) {
  const cacheable = CACHEABLE_APIS.some(api => request.url.includes(api));
  
  try {
    // Always try network first for API requests
    const networkResponse = await fetch(request);
    
    // Cache successful responses for cacheable APIs
    if (cacheable && networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached response if available
    if (cacheable) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return offline fallback for critical APIs
    return new Response(
      JSON.stringify({ error: 'Offline', cached: false }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Static asset handler - cache first
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    throw error;
  }
}

// Page request handler - network first with cache fallback
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Serve offline page
    const offlineResponse = await caches.match('/index.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Utility functions
function isStaticAsset(request) {
  return request.url.includes('.js') ||
         request.url.includes('.css') ||
         request.url.includes('.png') ||
         request.url.includes('.jpg') ||
         request.url.includes('.jpeg') ||
         request.url.includes('.gif') ||
         request.url.includes('.svg') ||
         request.url.includes('.ico') ||
         request.url.includes('.woff') ||
         request.url.includes('.woff2');
}

// Background sync (for offline actions)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-token-mint') {
    event.waitUntil(processOfflineTokenMints());
  }
});

async function processOfflineTokenMints() {
  // Process any offline token minting requests
  // This would integrate with your token minting logic
  console.log('Processing offline token mints...');
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});