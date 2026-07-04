const BASE_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTIFgXyOttJeJGsVaLwfFtNWb-c1YCJiJ8R5siL32ykA47xYYY7b8KmPXm_42vNAbaHXOkcqEG3tRCu/pub";

const CSV_URL = `${BASE_URL}?output=csv`;
const CONFIG_GID = "229901204";

async function loadConfig() {
    const res = await fetch(`${CSV_URL}&gid=${CONFIG_GID}`);

    const rows = (await res.text())
        .split('\n')
        .map(r => r.split(','));

    return Object.fromEntries(
        rows.map(r => [r[0]?.trim(), r[1]?.trim()])
    );
}

function loadLogo(config) {
    const logo = document.getElementById('header-logo');
    const logoLink = document.getElementById('logo-link');

    if (!logo || !logoLink) return;

    if (config.IMG_LOGO_URL) {
        // Works with assets/sslg.png or any relative path
        logo.src = config.IMG_LOGO_URL;

        // Reveal the logo
        document.documentElement.classList.add('logo-loaded');
    }

    logoLink.href = config.LINK_0_PATH || 'index.html';
}

function buildNavigation(config) {
    const nav = document.getElementById('nav-links');
    const mobile =
        document.getElementById('mobile-menu');

    if (!nav || !mobile) return;

    const path =
        window.location.pathname.split('/').pop();

    const pages = [
        { name: 'Home', id: '0' },
        { name: 'Gazettes', id: '1' },
        { name: 'Officers', id: '2' },
        { name: 'Feedback', id: '3' },
        { name: 'About Us', id: '5' }
    ];

    pages.forEach(p => {
        const url =
            config[`LINK_${p.id}_PATH`] || '#';

        const isActive =
            url.includes(path) ||
            (p.name === 'Officers' &&
             path.includes('officers')) ||
            (p.name === 'Gazettes' &&
             path.includes('document'));
            (p.name === 'About Us' &&
             path.includes('about'));

        const cls = isActive
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-blue-600';

        nav.innerHTML +=
            `<a href="${url}" class="${cls} text-sm">${p.name}</a>`;

        mobile.innerHTML +=
            `<a href="${url}" class="block py-3 px-2 ${cls} border-b border-slate-50">${p.name}</a>`;
    });
    
    lucide.createIcons();
      }
