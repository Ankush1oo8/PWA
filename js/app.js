let deferredPrompt;

// Register Service Worker if supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(reg => {
        console.log('✅ Service Worker registered:', reg);
    }).catch(err => console.log('❌ Service Worker registration failed:', err));
}

// Detect beforeinstallprompt (for Chrome, Edge, etc.)
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
    } else {
        console.log('ℹ️ No deferredPrompt available. Guide the user manually.');
        showManualInstallInstructions();
    }
    
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Close the pop-up if dismissed
document.getElementById('close-popup').addEventListener('click', () => {
    console.log('❌ Install pop-up closed');
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Detect app installation (for Safari)
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 App is running as a PWA');
} else if (navigator.standalone !== undefined) { // iOS Safari detection
    console.log(navigator.standalone ? '📱 App installed as a PWA' : '🛑 App not installed');
}

// Detect browser type for custom install instructions
function getBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
    return 'other';
}

// Show manual installation instructions
function showManualInstallInstructions() {
    const browser = getBrowser();
    let message = "To install this app, use your browser's 'Add to Home Screen' feature.";

    if (browser === 'firefox') {
        message = "📌 In Firefox, tap the **three-dot menu** and select **'Install'** or **'Add to Home screen'**.";
    } else if (browser === 'safari') {
        message = "📌 In Safari, tap the **share button** (⤴️) and select **'Add to Home Screen'**.";
    }

    alert(message);
}
