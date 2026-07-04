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
    const mobile = document.getElementById('mobile-menu');

    if (!nav || !mobile) return;

    nav.innerHTML = "";
    mobile.innerHTML = "";

    const currentPage =
        window.location.pathname.split('/').pop() ||
        'index.html';

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

        // Extract only the filename
        let pageName = url.split('/').pop();

        // Treat "/" as index.html
        if (pageName === '' || pageName === '/') {
            pageName = 'index.html';
        }

        const isActive =
            currentPage === pageName;

        const cls = isActive
            ? 'text-blue-600 font-bold'
            : 'text-slate-500 hover:text-blue-600';

        nav.innerHTML += `
            <a href="${url}"
               class="${cls} text-sm">
                ${p.name}
            </a>
        `;

        mobile.innerHTML += `
            <a href="${url}"
               class="block py-3 px-2 ${cls} border-b border-slate-50">
                ${p.name}
            </a>
        `;
    });

    lucide.createIcons();
        }
