// Register Service Worker (works for all browsers)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then(reg => {
        console.log('✅ Service Worker registered:', reg);
    }).catch(err => console.log('❌ Service Worker registration failed:', err));
}

// Detect PWA installation status (Safari & general)
function checkPWAStatus() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        console.log('📱 Running as PWA');
    } else {
        console.log('ℹ️ Not installed as PWA');
        showInstallPopup();
    }
}

// Show install popup only for Safari & Firefox users
function showInstallPopup() {
    const browser = detectBrowser();
    if (browser === 'safari' || browser === 'firefox') {
        document.getElementById('custom-install-popup').style.display = 'block';
    }
}

// Detect browser type (Safari, Firefox, etc.)
function detectBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
    return 'other';
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

// Attach event listeners for manual install instructions
document.getElementById('install-app-button').addEventListener('click', showManualInstallInstructions);
document.getElementById('close-popup').addEventListener('click', () => {
    console.log('❌ Install pop-up closed');
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Run check on page load
document.addEventListener('DOMContentLoaded', checkPWAStatus);
