if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.ready.then(registration => {
    // Example function to trigger a notification
    function triggerNotification() {
      registration.showNotification('Hello!', {
        body: 'This is a test notification',
        icon: '/img/dish.png',
        badge: '/img/dish.png',
        actions: [
          { action: 'install', title: 'Install App' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });
    }
  });
}
