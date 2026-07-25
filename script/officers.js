const GID_ROSTER = "416625956";

/* -----------------------------
   Initialize Page
----------------------------- */

async function init() {
    try {

        // Show default header immediately
        loadLogo();
        buildNavigation();

        // Load configuration in the background
        const config = await loadConfig();

        // Update header using configuration
        loadLogo(config);
        buildNavigation(config);

        // Mobile menu
        document
            .getElementById("mobile-menu-btn")
            ?.addEventListener("click", toggleMobileMenu);

        // Load roster
        await fetchRoster();

    } catch (err) {
        console.error("Initialization Error:", err);

        document.getElementById("loader").innerHTML =
            "Unable to load roster data.";
    }

    lucide.createIcons();
}

init();

/* -----------------------------
   Tabs
----------------------------- */

function showTab(tab) {

    document
        .querySelectorAll('[id^="panel-"]')
        .forEach(panel =>
            panel.classList.add("hidden")
        );

    document
        .getElementById(`panel-${tab}`)
        .classList.remove("hidden");

    document
        .querySelectorAll("#tab-group button")
        .forEach(button => {

            const active =
                button.id === `btn-${tab}`;

            button.className = active
                ? "flex-1 py-3 rounded-lg bg-white text-blue-600 font-bold text-xs uppercase shadow transition-all"
                : "flex-1 py-3 rounded-lg text-slate-600 font-bold text-xs uppercase transition-all";

        });

}

/* -----------------------------
   Fetch Roster
----------------------------- */

async function fetchRoster() {

    const loader =
        document.getElementById("loader");

    const executivePanel =
        document.getElementById("panel-executive");

    const representativePanel =
        document.getElementById("panel-representatives");

    const committeePanel =
        document.getElementById("panel-committees");

    try {

        const res =
            await fetch(`${CSV_URL}&gid=${GID_ROSTER}`);

        const rows =
            (await res.text())
            .split("\n")
            .map(row => row.split(","));

        loader.classList.add("hidden");

        const executives = [];

        const representatives = {
            7: [],
            8: [],
            9: [],
            10: [],
            11: [],
            12: []
        };

        const committees = {};

        for (let i = 1; i < rows.length; i++) {

            const name =
                rows[i][0]?.trim();

            const role =
                rows[i][1]?.trim();

            const image =
                rows[i][2]?.trim();

            const committee =
                rows[i][3]?.trim();

            if (!name || !role)
                continue;

            const roleLower =
                role.toLowerCase();

            if (
                roleLower.match(
                    /president|vice|secretary|treasurer|auditor|public information officer|protocol/
                )
            ) {

                executives.push({
                    name,
                    role,
                    image
                });

            }

            else if (roleLower.includes("grade")) {

                const grade =
                    roleLower.match(/\d+/);

                if (
                    grade &&
                    representatives[grade[0]]
                ) {

                    representatives[grade[0]]
                        .push(name);

                }

            }

            if (committee) {

                const words =
                    committee.split(" ");

                const position =
                    words.pop();

                const committeeName =
                    words.join(" ");

                if (!committees[committeeName]) {

                    committees[committeeName] = {
                        Chair: [],
                        Co: [],
                        Mem: []
                    };

                }

                if (position === "Chairperson") {

                    committees[committeeName]
                        .Chair.push(name);

                }

                else if (position === "Co-Chairperson") {

                    committees[committeeName]
                        .Co.push(name);

                }

                else {

                    committees[committeeName]
                        .Mem.push(name);

                }

            }

        }

        /* -----------------------------
           Executive Officers
        ----------------------------- */

        const president =
            executives.find(e =>
                e.role
                    .toLowerCase()
                    .includes("president")
            );

        executivePanel.innerHTML = "";

        if (president) {

            executivePanel.innerHTML += `

<div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center max-w-xs mx-auto">

<img src="${president.image}" class="w-28 h-28 rounded-2xl object-cover mx-auto mb-4">

<h2 class="font-black text-xl">
${president.name}
</h2>

<p class="text-blue-600 font-bold uppercase text-sm">
${president.role}
</p>

</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

${executives
.filter(e => e !== president)
.map(e => `

<div class="bg-white rounded-2xl border border-slate-100 p-4 text-center">

<img src="${e.image}" class="w-16 h-16 rounded-xl object-cover mx-auto mb-3">

<div class="font-bold text-sm">
${e.name}
</div>

<div class="text-blue-600 text-[10px] uppercase font-bold">
${e.role}
</div>

</div>

`).join("")}

</div>`;

        }

        /* -----------------------------
           Representatives
        ----------------------------- */

        representativePanel.innerHTML = "";

        [[7,8],[9,10],[11,12]].forEach(pair=>{

            representativePanel.innerHTML += `

<div class="bg-white rounded-2xl border border-slate-100 p-6">

${pair.map(g=>`

<h3 class="font-black text-blue-600 uppercase text-sm mb-2">
Grade ${g}
</h3>

<ul class="list-disc ml-5 mb-5">

${representatives[g]
.map(name=>`<li>${name}</li>`)
.join("")}

</ul>

`).join("")}

</div>`;

        });

        /* -----------------------------
           Committees
        ----------------------------- */

        committeePanel.innerHTML = "";

        Object.keys(committees).forEach(name=>{

            const committee =
                committees[name];

            committeePanel.innerHTML += `

<div class="bg-white rounded-2xl border border-slate-100 p-6">

<h2 class="font-black text-lg mb-4">
${name}
</h2>

<p class="mb-2">
<strong>Chair:</strong>
<span class="text-blue-600">
${committee.Chair.join(", ") || "TBD"}
</span>
</p>

<p class="mb-4">
<strong>Co-Chair:</strong>
<span class="text-blue-600">
${committee.Co.join(", ") || "TBD"}
</span>
</p>

<p class="text-xs uppercase font-bold text-slate-400 mb-2">
Members
</p>

<ul class="list-disc ml-5">

${committee.Mem
.map(member=>`<li>${member}</li>`)
.join("")}

</ul>

</div>`;

        });

    }

    catch (err) {

        console.error(err);

        loader.innerHTML =
            "Unable to load roster data.";

    }

    lucide.createIcons();

}
