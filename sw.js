const CACHE_NAME = 'jedo-nazir-v6';

self.addEventListener('install', (e) => e.waitUntil(self.skipWaiting()));

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// استقبال أمر إظهار الإشعار الكتابي من صفحة الموقع وعرضه على شاشة الموبايل
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const title = event.data.title || 'طلب جديد - جدو نظير 🛎️';
        const options = {
            body: event.data.body || 'تم استلام أوردر جديد الآن!',
            icon: 'images/lllogo.jpg',
            badge: 'images/lllogo.jpg',
            vibrate: [350, 150, 350, 150, 350],
            tag: 'order-alert-' + Date.now(),
            renotify: true,
            requireInteraction: true,
            data: { url: './' }
        };
        event.waitUntil(self.registration.showNotification(title, options));
    }
});

// فتح التطبيق فوراً عند ضغط صاحب المطعم على الإشعار
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./');
            }
        })
    );
});
