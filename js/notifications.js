document.addEventListener('DOMContentLoaded', () => {
  // Initialize Materialize side navigation
  const sideNav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sideNav);

  // Handle notification permission request
  const requestNotificationButton = document.getElementById('request-notification');
  if (requestNotificationButton) {
    requestNotificationButton.addEventListener('click', async (e) => {
      e.preventDefault(); // Prevent default link behavior
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            M.toast({ html: 'Notifications enabled! You’ll get updates on new recipes.', classes: 'green' });
            // Optionally trigger a test notification
            if (navigator.serviceWorker) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('Welcome to Food Ninja!', {
                  body: 'You’ll now receive updates on new recipes!',
                  icon: '/img/dish.png',
                  badge: '/img/dish.png',
                  actions: [
                    { action: 'dismiss', title: 'Dismiss' }
                  ]
                });
              });
            }
          } else {
            M.toast({ html: 'Notifications were denied or dismissed.', classes: 'red' });
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
          M.toast({ html: 'Error enabling notifications.', classes: 'red' });
        }
      } else {
        M.toast({ html: 'Notifications are not supported in this browser.', classes: 'red' });
      }
    });
  }
});
