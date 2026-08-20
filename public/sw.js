// sw.js version 1.0.1
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
  const options = {
    body: data.body || "Tienes un nuevo mensaje.",
    icon: data.icon || '/logo/cafe-happy-logo.png',
    badge: '/logo/cafe-happy-logo.png',
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
