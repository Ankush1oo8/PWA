if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('Service Worker registered', reg);

    // Detect if user is on a mobile device
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // If on mobile, ask service worker to show a notification
    if (isMobile) {
      reg.active?.postMessage({ type: 'SHOW_INSTALL_PROMPT' });
    }
  }).catch(err => console.log('Service Worker registration failed', err));
}
