const MASTER_SHEET_URL = `${BASE_URL}?output=csv`;
const MASTER_TSV_URL = `${BASE_URL}?output=tsv`;

const NEWS_GID = "1683102947";
const METRICS_GID = "1647929887";
const ROSTER_GID = "416625956";

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

    /* -----------------------------
       Homepage Buttons
    ----------------------------- */

    const linkMap = {
        LINK_2_PATH: ["btn-roster"],
        LINK_1_PATH: ["btn-docs"],
        LINK_3_PATH: ["btn-feedback"],
        LINK_4_PATH: ["btn-clubs"],
        LINK_5_PATH: ["btn-about"]
    };

    Object.entries(linkMap).forEach(([key, ids]) => {
        ids.forEach(id => {
            const el = document.getElementById(id);

            if (el)
                el.href = config[key] || "#";
        });
    });

    /* -----------------------------
       Fetch Everything Together
    ----------------------------- */

    const [
        metricsText,
        rosterText,
        newsText
    ] = await Promise.all([

        fetch(`${MASTER_SHEET_URL}&gid=${METRICS_GID}`)
            .then(r => r.text()),

        fetch(`${MASTER_SHEET_URL}&gid=${ROSTER_GID}`)
            .then(r => r.text()),

        fetch(`${MASTER_TSV_URL}&gid=${NEWS_GID}`)
            .then(r => r.text())
    ]);

    /* -----------------------------
       Metrics
    ----------------------------- */

    const metrics =
        document.getElementById("metrics-container");

    metrics.innerHTML = "";

    metricsText
        .split("\n")
        .slice(1)
        .forEach(row => {

            const [label, value] =
                row.split(",");

            if (!label) return;

            metrics.innerHTML += `
                <div class="text-center">
                    <div class="text-[10px] uppercase font-bold text-slate-400 mb-1">
                        ${label}
                    </div>

                    <div class="text-2xl font-black text-blue-600">
                        ${value}
                    </div>
                </div>
            `;
        });

    /* -----------------------------
       Officers
    ----------------------------- */

    const stack =
        document.getElementById("officers-roster-stack");

    const presidentSpotlight =
        document.getElementById("president-spotlight");

    stack.innerHTML = "";

    rosterText
        .split("\n")
        .slice(1)
        .forEach(row => {

            const [
                name,
                role,
                img
            ] = row.split(",");

            if (!name) return;

            const roleLower =
                role.trim().toLowerCase();

            const image =
                img?.trim() ||
                `assets/officers/${name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.png`;

            if (roleLower === "president") {

                presidentSpotlight.classList.remove("hidden");

                document.getElementById("pres-name")
                    .textContent = name;

                document.getElementById("pres-img")
                    .innerHTML = `
                        <img src="${image}"
                             class="w-full h-full object-cover">
                    `;

                return;
            }

            if (
                [
                    "vice president",
                    "secretary",
                    "treasurer"
                ].includes(roleLower)
            ) {

                stack.innerHTML += `
                    <div class="p-3 border border-slate-100 rounded-xl flex items-center gap-3">

                        <div class="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">

                            <img src="${image}"
                                 class="w-full h-full object-cover">

                        </div>

                        <div class="text-xs">

                            <div class="font-bold">
                                ${name}
                            </div>

                            <div class="text-blue-600 uppercase font-bold text-[9px]">
                                ${role}
                            </div>

                        </div>

                    </div>
                `;
            }

        });

    /* -----------------------------
       News
    ----------------------------- */

    const newsGrid =
        document.getElementById("news-grid");

    newsGrid.innerHTML = "";

    newsText
        .split("\n")
        .slice(1)
        .filter(r => r.trim())
        .forEach(row => {

            const [
                headline,
                desc,
                link
            ] = row.split("\t");

            if (!headline) return;

            newsGrid.innerHTML += `
                <a href="${link?.trim() || "#"}"
                   class="group block p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-blue-600 transition-all">

                    <div class="text-[10px] uppercase font-bold text-blue-600 mb-2 tracking-widest">
                        Latest News
                    </div>

                    <h3 class="font-bold text-lg mb-2 group-hover:text-blue-600">
                        ${headline.trim()}
                    </h3>

                    <p class="text-sm text-slate-500">
                        ${desc?.trim() || ""}
                    </p>

                </a>
            `;
        });

    /* -----------------------------
       Carousel
    ----------------------------- */

    const carousel =
        document.getElementById("action-carousel");

    carousel.innerHTML = "";

    const images =
        config.ACTION_IMAGES
            ?.split("|")
            .map(i => i.trim())
            .filter(Boolean) || [];

    [...images, ...images].forEach(name => {

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
