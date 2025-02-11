let deferredPrompt;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('✅ Service Worker registered:', reg);
  }).catch(err => console.log('❌ Service Worker registration failed:', err));
}

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('🔥 beforeinstallprompt event detected');

    event.preventDefault(); // Stop default Chrome banner
    deferredPrompt = event; // Store event for later use

    // Show the custom install pop-up
    document.getElementById('custom-install-popup').style.display = 'block';
});

// Handle the install button click
document.getElementById('install-app-button').addEventListener('click', async () => {
    if (deferredPrompt) {
        console.log('🚀 Showing install prompt');
        deferredPrompt.prompt(); // Show the install prompt

        const choice = await deferredPrompt.userChoice;
        console.log('✅ User choice:', choice.outcome);

        if (choice.outcome === 'accepted') {
            console.log('🎉 App installed!');
        }

        deferredPrompt = null;
        document.getElementById('custom-install-popup').style.display = 'none';
    }
});

// Close the pop-up if dismissed
document.getElementById('close-popup').addEventListener('click', () => {
    console.log('❌ Install pop-up closed');
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Listen for app installation
window.addEventListener('appinstalled', () => {
    console.log('🎉 App successfully installed');
    document.getElementById('custom-install-popup').style.display = 'none';
});
