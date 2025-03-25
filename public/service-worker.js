// Service Worker for handling WhatsApp notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    if (data.type === 'whatsapp_message') {
      // Forward the message to the app
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'whatsapp_notification',
            text: data.text
          });
        });
      });

      // Show notification
      event.waitUntil(
        self.registration.showNotification('Nova mensagem do WhatsApp', {
          body: data.text,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'whatsapp-message',
          data: { url: data.url }
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});