let deferredPrompt = null; // Store Chrome install event

// Register Service Worker (works for all browsers)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(reg => {
        console.log('✅ Service Worker registered:', reg);
    }).catch(err => console.log('❌ Service Worker registration failed:', err));
}

// Detect browser type (Safari, Firefox, Chrome, etc.)
function detectBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
    if (ua.includes('chrome')) return 'chrome';
    return 'other';
}

// Handle Chrome PWA install prompt
window.addEventListener('beforeinstallprompt', (event) => {
    console.log('🔥 beforeinstallprompt event detected (Chrome)');

    event.preventDefault(); // Prevent auto-prompt
    deferredPrompt = event; // Store event for later

    // Show the custom install button for Chrome users
    if (detectBrowser() === 'chrome') {
        document.getElementById('custom-install-popup').style.display = 'block';
    }
});

// Handle install button click (Chrome)
document.getElementById('install-app-button').addEventListener('click', async () => {
    if (deferredPrompt) {
        console.log('🚀 Showing Chrome install prompt');
        deferredPrompt.prompt();

        const choice = await deferredPrompt.userChoice;
        console.log('✅ User choice:', choice.outcome);

        if (choice.outcome === 'accepted') {
            console.log('🎉 App installed!');
        }

        deferredPrompt = null;
        document.getElementById('custom-install-popup').style.display = 'none';
    } else {
        // If not Chrome, show manual install instructions
        showManualInstallInstructions();
    }
});

// Detect if app is already installed (all browsers)
function checkPWAStatus() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        console.log('📱 Running as PWA');
    } else {
        console.log('ℹ️ Not installed as PWA');
        showInstallPopup();
    }
}

// Show install popup only for Safari & Firefox users (but not every refresh)
function showInstallPopup() {
    const browser = detectBrowser();
    const dismissed = localStorage.getItem('installPromptDismissed');

    // Show for Safari & Firefox only, and if not dismissed before
    if (!dismissed && (browser === 'safari' || browser === 'firefox')) {
        document.getElementById('custom-install-popup').style.display = 'block';
    }
}

// Show manual installation instructions for Safari & Firefox
function showManualInstallInstructions() {
    const browser = detectBrowser();
    let message = "To install this app, use your browser's 'Add to Home Screen' feature.";

    if (browser === 'firefox') {
        message = "📌 In Firefox, tap the **three-dot menu** and select **'Install'** or **'Add to Home Screen'**.";
    } else if (browser === 'safari') {
        message = "📌 In Safari, tap the **Share button** (⤴️) and select **'Add to Home Screen'**.";
    }

    alert(message);
}

// Close the install popup & prevent it from showing again
document.getElementById('close-popup').addEventListener('click', () => {
    console.log('❌ Install pop-up closed');
    document.getElementById('custom-install-popup').style.display = 'none';
    localStorage.setItem('installPromptDismissed', 'true'); // Prevent showing again
});

// Run check on page load
document.addEventListener('DOMContentLoaded', checkPWAStatus);

// Listen for app installation event
window.addEventListener('appinstalled', () => {
    console.log('🎉 App successfully installed');
    document.getElementById('custom-install-popup').style.display = 'none';
});
