const staticCacheName = 'site-static-v5';
const dynamicCacheName = 'site-dynamic-v6';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/install.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/js/notifications.js',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Function to request notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in self) {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }
};

// Function to show notification
const showNotification = (title, options) => {
  if ('Notification' in self && Notification.permission === 'granted') {
    self.registration.showNotification(title, options);
  }
};

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    Promise.all([
      caches.open(staticCacheName).then((cache) => {
        console.log('caching shell assets');
        return cache.addAll(assets);
      }),
      requestNotificationPermission()
    ])
  );
});

// notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'install') {
    event.waitUntil(
      clients.openWindow('/pages/install.html')
    );
  } else {
    // Handle default click (focus or open main page)
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/pages/fallback.html');
        }
      });
    })
  );
});

// Example push event handler
self.addEventListener('push', event => {
  const title = 'New Update Available';
  const options = {
    body: 'There is new content available on the site!',
    icon: '/img/dish.png',
    badge: '/img/dish.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };
  
  event.waitUntil(
    showNotification(title, options)
  );
});
