const GID_ROSTER = "416625956";

async function init() {
    // Draw immediately
    loadLogo();
    buildNavigation();

    // Load config
    const config = await loadConfig();

    // Update with config values
    loadLogo(config);
    buildNavigation(config);

    fetchRoster();
}

function showTab(t) {
    document.querySelectorAll('[id^="panel-"]').forEach(p =>
        p.classList.add('hidden')
    );

    document
        .getElementById('panel-' + t)
        .classList.remove('hidden');

    document
        .querySelectorAll('#tab-group button')
        .forEach(b => {
            b.className =
                b.id === 'btn-' + t
                    ? "flex-1 px-3 py-3 rounded-md bg-white text-blue-600 shadow-sm transition-all whitespace-nowrap"
                    : "flex-1 px-3 py-3 rounded-md text-slate-600 transition-all whitespace-nowrap";
        });
}

async function fetchRoster() {
    const res = await fetch(`${CSV_URL}&gid=${GID_ROSTER}`);
    const rows = (await res.text())
        .split('\n')
        .map(r => r.split(','));

    document
        .getElementById('loader')
        .classList.add('hidden');

    let execs = [];
    let reps = {
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: []
    };
    let comms = {};

    for (let i = 1; i < rows.length; i++) {
        let [
            name,
            role,
            img,
            commRaw
        ] = [
            rows[i][0]?.trim(),
            rows[i][1]?.trim(),
            rows[i][2]?.trim(),
            rows[i][3]?.trim()
        ];

        if (!name) continue;

        let rl = role.toLowerCase();

        if (
            rl.match(
                /president|secretary|treasurer|auditor|public information officer|protocol|vice/
            )
        ) {
            execs.push({ name, role, img });
        } else if (rl.includes('grade')) {
            let g = rl.match(/\d+/);
            if (g && reps[g[0]]) {
                reps[g[0]].push(name);
            }
        }

        if (commRaw) {
            let parts = commRaw.split(' ');
            let pos = parts.pop();
            let cName = parts.join(' ');

            if (!comms[cName]) {
                comms[cName] = {
                    Chair: [],
                    Co: [],
                    Mem: []
                };
            }

            if (pos === 'Chairperson') {
                comms[cName].Chair.push(name);
            } else if (pos === 'Co-Chairperson') {
                comms[cName].Co.push(name);
            } else {
                comms[cName].Mem.push(name);
            }
        }
    }

    const pPanel =
        document.getElementById('panel-executive');

    const pres = execs.find(e =>
        e.role.toLowerCase().includes('president')
    );

    pPanel.innerHTML = pres
        ? `<div class="bg-white p-6 rounded-2xl border text-center mx-auto w-64 hover:scale-105 transition-transform">
                <img src="${pres.img}" class="w-24 h-24 rounded-lg mx-auto mb-4 object-cover">
                <p class="font-black text-lg">${pres.name}</p>
                <p class="text-blue-600 font-bold text-sm">${pres.role}</p>
           </div>
           <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${execs
                    .filter(e => e !== pres)
                    .map(e => `
                        <div class="bg-white p-4 rounded-xl border text-center hover:scale-105 transition-transform">
                            <img src="${e.img}" class="w-16 h-16 rounded-lg mx-auto mb-2 object-cover">
                            <p class="font-bold text-sm">${e.name}</p>
                            <p class="text-blue-600 font-bold text-[10px] uppercase">${e.role}</p>
                        </div>
                    `)
                    .join('')}
           </div>`
        : "";

    const rPanel =
        document.getElementById(
            'panel-representatives'
        );

    [[7, 8], [9, 10], [11, 12]].forEach(pair => {
        rPanel.innerHTML += `
            <div class="bg-white p-6 rounded-2xl border">
                ${pair
                    .map(g => `
                        <h3 class="text-blue-600 font-black text-sm uppercase mb-2">
                            Grade ${g}
                        </h3>
                        <ul class="mb-4">
                            ${reps[g]
                                .map(n => `
                                    <li class="py-1 text-sm list-disc ml-4">
                                        ${n}
                                    </li>
                                `)
                                .join('')}
                        </ul>
                    `)
                    .join('')}
            </div>`;
    });

    const cPanel =
        document.getElementById(
            'panel-committees'
        );

    for (let name in comms) {
        cPanel.innerHTML += `
            <div class="bg-white p-6 rounded-2xl border hover:shadow-lg transition-shadow">
                <h4 class="font-black text-lg mb-4">${name}</h4>

                <p class="font-bold text-sm">
                    Chair:
                    <span class="text-blue-600">
                        ${comms[name].Chair.join(', ') || 'TBD'}
                    </span>
                </p>

                <p class="font-bold text-sm mb-4">
                    Co-Chair:
                    <span class="text-blue-600">
                        ${comms[name].Co.join(', ') || 'TBD'}
                    </span>
                </p>

                <p class="text-xs font-bold text-slate-400 uppercase mb-2">
                    Members
                </p>

                <ul class="list-disc pl-5 text-sm">
                    ${comms[name].Mem
                        .map(m => `<li>${m}</li>`)
                        .join('')}
                </ul>
            </div>`;
    }

    lucide.createIcons();
}

init();
