self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {
    title: 'Descanso encerrado!',
    body: 'Hora de voltar ao treino 💪',
  };

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        if (clients.some((c) => c.focused)) return;
        return self.registration.showNotification(data.title, {
          body: data.body,
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          tag: 'rest-timer',
          renotify: true,
        });
      }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((c) => 'focus' in c);
        if (existing) return existing.focus();
        return self.clients.openWindow('/');
      }),
  );
});
