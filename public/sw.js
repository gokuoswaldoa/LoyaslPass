// sw.js version 1.0.2
const CACHE_NAME = 'loyalpass-v1';
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/',
        '/logo/icono.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Solo interceptamos navegaciones (páginas HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});

self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data = { title: "LoyalPass", body: event.data.text() };
    }
  }

  const title = data.title || "Notificación";
  const iconUrl = data.icon ? new URL(data.icon, self.location.origin).href : new URL('/logo/cafe-happy-logo.png', self.location.origin).href;
  
  const options = {
    body: data.body || "Tienes un nuevo mensaje.",
    icon: iconUrl,
    badge: iconUrl,
    data: data.data || { url: '/' },
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
