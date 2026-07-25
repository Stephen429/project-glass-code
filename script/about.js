async function init() {

    /* -----------------------------
       Header
    ----------------------------- */

    // Draw immediately
    loadLogo();
    buildNavigation();

    // Load config
    const config = await loadConfig();

    // Update with config values
    loadLogo(config);
    buildNavigation(config);

    if (config.FB_SSLG_URL) {
        document.getElementById('fb-link-1').href =
            config.FB_SSLG_URL;
    }

    document.getElementById('gm-link-1').href =
        'mailto:ldvtssslg@gmail.com';

    lucide.createIcons();
}

init();
