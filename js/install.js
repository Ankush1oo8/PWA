let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('🔥 Custom install prompt event detected');

    event.preventDefault(); // Prevent default banner
    deferredPrompt = event; // Store the event

    // Show the custom install pop-up
    document.getElementById('custom-install-popup').style.display = 'block';
});

// Handle install button click
document.getElementById('install-app-button').addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt(); // Show install prompt

        const choice = await deferredPrompt.userChoice;
        console.log('✅ User choice:', choice.outcome);

        if (choice.outcome === 'accepted') {
            console.log('🎉 App installed!');
        }

        deferredPrompt = null;
        document.getElementById('custom-install-popup').style.display = 'none';
    }
});

// Hide pop-up if user dismisses
document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('custom-install-popup').style.display = 'none';
});

// Hide pop-up after app installation
window.addEventListener('appinstalled', () => {
    console.log('🎉 App successfully installed');
    document.getElementById('custom-install-popup').style.display = 'none';
});
