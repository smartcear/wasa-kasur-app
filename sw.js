/* ============================================================
   WASA KASUR - Service Worker v2.8.1.0
   Offline + Push Notifications + Background Call Support
   ============================================================ */

const CACHE_NAME = 'wasa-kasur-v2.8.1.0';
const OFFLINE_URLS = [
  './',
  './index.html',
  './officer-app.html',
  './admin-panel.html',
  './manifest.json',
  './privacy-policy.html',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// INSTALL - Cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET and chrome-extension
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension')) return;

  // API / Firebase / Cloudinary → Network only
  const url = event.request.url;
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase') ||
    url.includes('cloudinary.com') ||
    url.includes('googleapis.com')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone & cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('./index.html');
        });
      })
  );
});

// PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  let data = { title: 'WASA Kasur', body: 'New notification', url: './index.html' };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    data.body = event.data ? event.data.text() : data.body;
  }

  const options = {
    body: data.body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    vibrate: data.type === 'call' ? [300, 100, 300, 100, 300] : [200, 100, 200],
    tag: data.tag || 'wasa-notification',
    renotify: true,
    requireInteraction: data.type === 'call' || data.urgent === true,
    data: {
      url: data.url || './index.html',
      type: data.type || 'general'
    },
    actions: data.type === 'call'
      ? [
          { action: 'accept', title: '✅ Accept' },
          { action: 'reject', title: '❌ Reject' }
        ]
      : [
          { action: 'open', title: 'Open' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// NOTIFICATION CLICK → Deep link
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = data.url || './index.html';

  if (event.action === 'accept' && data.type === 'call') {
    targetUrl = data.url || './officer-app.html#call';
  } else if (event.action === 'reject') {
    return; // Just close
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('wasa') && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', data });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// BACKGROUND SYNC (for offline queue)
self.addEventListener('sync', (event) => {
  if (event.tag === 'wasa-sync-queue') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_NOW' });
        });
      })
    );
  }
});

// MESSAGE from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});