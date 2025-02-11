let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('🔥 beforeinstallprompt event detected');

    event.preventDefault(); // Prevent auto-showing
    deferredPrompt = event; // Store the event for later

    // Show the install button
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'block';

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt(); // Show install prompt
            const choice = await deferredPrompt.userChoice;
            console.log('✅ User choice:', choice.outcome);
            deferredPrompt = null; // Clear the event
            installButton.style.display = 'none'; // Hide button after interaction
        }
    });
});

// Hide the button if already installed
window.addEventListener('appinstalled', () => {
    console.log('🎉 App successfully installed');
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'none';
});
