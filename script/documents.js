const DOCS_TSV_URL =
    `${BASE_URL}?output=tsv&gid=29363756`;

let fullData = [];
let currentCategory = 'RESOLUTION';

async function init() {
    const config = await loadConfig();

    loadLogo(config);
    buildNavigation(config);

    try {
        const docRes = await fetch(DOCS_TSV_URL);
        const docText = await docRes.text();

        fullData = docText
            .split('\n')
            .slice(1)
            .map(row => {
                const [type, code, year, title, link] =
                    row.split('\t');

                return {
                    type: type?.trim(),
                    code: code?.trim(),
                    year: year?.trim(),
                    title: title?.trim(),
                    link: link?.trim()
                };
            })
            .filter(d => d.type);

        const years =
            [...new Set(
                fullData
                    .map(d => d.year)
                    .filter(y => y)
            )].sort((a, b) => b - a);

        const yearSelect =
            document.getElementById('year-filter');

        years.forEach(y =>
            yearSelect.innerHTML +=
                `<option value="${y}">${y}</option>`
        );

        renderTable();
    } catch (e) {
        console.error("TSV Load Error:", e);
    }

    lucide.createIcons();
}

function setCategory(cat) {
    currentCategory = cat;

    document
        .querySelectorAll('#tab-group button')
        .forEach(b => {
            b.className =
                b.id === 'btn-' + cat
                    ? "py-3 rounded-lg bg-white border-2 border-blue-600 text-blue-600 shadow-sm text-xs"
                    : "py-3 rounded-lg bg-slate-100 border text-slate-600 text-xs";
        });

    renderTable();
}

function renderTable() {
    const tbody =
        document.getElementById('document-table-body');

    const search =
        document
            .getElementById('search-input')
            .value
            .toLowerCase();

    const year =
        document.getElementById('year-filter').value;

    const sort =
        document.getElementById('sort-filter').value;

    let filtered = fullData.filter(d =>
        d.type === currentCategory &&
        (year === 'ALL' || d.year === year) &&
        (
            d.title?.toLowerCase().includes(search) ||
            d.code?.toLowerCase().includes(search)
        )
    );

    filtered.sort((a, b) => {
        const yearDiff =
            sort === 'NEWEST'
                ? b.year - a.year
                : a.year - b.year;

        if (yearDiff !== 0)
            return yearDiff;

        const getSeq = d => {
            const match =
                (d.code || '')
                    .match(/(\d+)/);

            return match
                ? parseInt(match[0])
                : 0;
        };

        const seqA = getSeq(a);
        const seqB = getSeq(b);

        return sort === 'NEWEST'
            ? seqB - seqA
            : seqA - seqB;
    });

    tbody.innerHTML = filtered.map(d => `
        <tr class="hover:bg-slate-50">
            <td class="py-4 px-4 font-mono text-xs text-blue-600 font-bold">
                ${d.code || ''}
            </td>
            <td class="py-4 px-4 text-slate-800 font-medium">
                ${d.title || ''}
            </td>
            <td class="py-4 px-4 text-right">
                <a href="${d.link}"
                   target="_blank"
                   class="text-blue-600 font-bold underline text-xs">
                    VIEW
                </a>
            </td>
        </tr>
    `).join('');
}

init();