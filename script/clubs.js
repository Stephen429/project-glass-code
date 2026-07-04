const CLUBS_GID = "1803510665";

async function init() {
    const config = await loadConfig();

    loadLogo(config);
    buildNavigation(config);

    try {
        const clubsRes =
            await fetch(
                `${CSV_URL}&gid=${CLUBS_GID}`
            );

        const clubsText =
            await clubsRes.text();

        const clubsData =
            clubsText
                .split('\n')
                .slice(1);

        const container =
            document.getElementById(
                'clubs-container'
            );

        container.innerHTML = '';

        clubsData.forEach(row => {
            const columns =
                row
                    .split(',')
                    .map(item =>
                        item.trim()
                    );

            const name =
                columns[0];

            const fbUrl =
                columns[1];

            const logoUrl =
                columns[2];

            if (!name) return;

            container.innerHTML += `
                <a href="${fbUrl || '#'}"
                   target="_blank"
                   class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-blue-600 transition-colors group">

                    <div class="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                            src="${logoUrl}"
                            class="w-full h-full object-cover"
                            alt="${name}"
                            onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-200\\'><i data-lucide=\\'users\\' class=\\'w-6 h-6 text-slate-400\\'></i></div>'; lucide.createIcons();">
                    </div>

                    <div>
                        <h3 class="font-bold text-slate-800">
                            ${name}
                        </h3>

                        <p class="text-xs text-blue-600 font-bold uppercase mt-1">
                            Visit Page
                        </p>
                    </div>

                </a>
            `;
        });
    } catch (e) {
        console.error(
            'Error fetching clubs:',
            e
        );

        document.getElementById(
            'clubs-container'
        ).innerHTML =
            `<p class="text-red-500 text-sm col-span-full">
                Failed to load data.
            </p>`;
    }

    lucide.createIcons();
}

init();