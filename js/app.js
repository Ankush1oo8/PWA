let deferredPrompt;

// Register service worker if supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(reg => {
        console.log('✅ Service Worker registered:', reg);
    }).catch(err => console.log('❌ Service Worker registration failed:', err));
}

// Detect beforeinstallprompt (Chrome, Edge, etc.)
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('🔥 beforeinstallprompt event detected');

    event.preventDefault(); // Stop default Chrome banner
    deferredPrompt = event; // Store event for later use

    // Show the custom install pop-up
    document.getElementById('custom-install-popup').style.display = 'block';
});

// Handle install button click
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
    } else {
        console.log('ℹ️ No deferredPrompt available. Guide the user manually.');
        alert('To install this app, use your browser’s "Add to Home Screen" feature.');
    }
});

// Close the pop-up if dismissed
document.getElementById('close-popup').addEventListener('click', () => {
    console.log('❌ Install pop-up closed');
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Listen for app installation (all browsers)
window.addEventListener('appinstalled', () => {
    console.log('🎉 App successfully installed');
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Detect PWA install status (for Safari)
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 App is running as a PWA');
} else if (navigator.standalone !== undefined) { // iOS Safari detection
    console.log(navigator.standalone ? '📱 App installed as a PWA' : '🛑 App not installed');
}
