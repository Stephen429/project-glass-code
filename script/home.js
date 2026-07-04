const MASTER_SHEET_URL =
    `${BASE_URL}?output=csv`;

const MASTER_TSV_URL =
    `${BASE_URL}?output=tsv`;

const NEWS_GID = "1683102947";
const METRICS_GID = "1647929887";
const ROSTER_GID = "416625956";

async function init() {
    const config = await loadConfig();
    
    loadLogo(config);
    buildNavigation(config);

    const linkMap = {
        'LINK_2_PATH': ['btn-roster'],
        'LINK_1_PATH': ['btn-docs'],
        'LINK_3_PATH': ['btn-feedback'],
        'LINK_4_PATH': ['btn-clubs'],
        'LINK_5_PATH': ['btn-about']
    };

    Object.keys(linkMap).forEach(key => {
        linkMap[key].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.href = config[key] || '#';
            }
        });
    });

    fetch(`${MASTER_SHEET_URL}&gid=${METRICS_GID}`)
        .then(r => r.text())
        .then(t => {
            t.split('\n').slice(1).forEach(r => {
                const [label, val] = r.split(',');

                if (label) {
                    document.getElementById('metrics-container').innerHTML += `
                        <div class="text-center">
                            <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">
                                ${label}
                            </div>
                            <div class="text-2xl font-black text-blue-600">
                                ${val}
                            </div>
                        </div>`;
                }
            });
        });

    fetch(`${MASTER_SHEET_URL}&gid=${ROSTER_GID}`)
        .then(r => r.text())
        .then(t => {
            const stack =
                document.getElementById('officers-roster-stack');

            t.split('\n').slice(1).forEach(r => {
                const [name, role, img] = r.split(',');

                if (!name) return;

                if (
                    role.trim().toLowerCase() === 'president'
                ) {
                    document
                        .getElementById('president-spotlight')
                        .classList.remove('hidden');

                    document.getElementById('pres-name')
                        .innerText = name;

                    document.getElementById('pres-img')
                        .innerHTML = img
                            ? `<img src="${img.trim()}" class="w-full h-full object-cover">`
                            : name[0];
                }
                else if (
                    ['vice president', 'secretary', 'treasurer']
                        .includes(role.trim().toLowerCase())
                ) {
                    stack.innerHTML += `
                        <div class="p-3 border border-slate-100 rounded-xl flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                                <img src="${img?.trim()}" class="w-full h-full object-cover">
                            </div>
                            <div class="text-xs">
                                <div class="font-bold">${name}</div>
                                <div class="text-blue-600 uppercase font-bold text-[9px]">
                                    ${role}
                                </div>
                            </div>
                        </div>`;
                }
            });
        });

    fetch(`${MASTER_TSV_URL}&gid=${NEWS_GID}`)
        .then(r => r.text())
        .then(t => {
            const grid =
                document.getElementById('news-grid');

            const rows = t
                .split('\n')
                .slice(1)
                .filter(row => row.trim() !== "");

            grid.innerHTML = "";

            rows.forEach(row => {
                const [headline, desc, link] =
                    row.split('\t');

                if (headline) {
                    grid.innerHTML += `
                        <a href="${link ? link.trim() : '#'}"
                           class="group block p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-600 transition-all">

                            <div class="text-[10px] uppercase font-bold text-blue-600 mb-2 tracking-widest">
                                Latest News
                            </div>

                            <h3 class="font-bold text-lg mb-2 group-hover:text-blue-600">
                                ${headline.trim()}
                            </h3>

                            <p class="text-sm text-slate-500">
                                ${desc ? desc.trim() : ''}
                            </p>
                        </a>`;
                }
            });
        });

const carousel = document.getElementById('action-carousel');
const imgs = [...(config.ACTION_IMAGES?.split('|') || [])];
const duplicated = [...imgs, ...imgs];

duplicated.forEach(name => {
    name = name.trim();
    if (!name) return;

    carousel.innerHTML += `
        <div class="flex-shrink-0 w-[300px] h-56 rounded-2xl overflow-hidden bg-slate-200">
            <img src="assets/carousel/${name}.png"
                 onerror="this.onerror=null;this.src='assets/carousel/${name}.jpg';"
                 class="w-full h-full object-cover">
        </div>
    `;
});
    lucide.createIcons();
}

init();
