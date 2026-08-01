// ----------------------------
// Get Chapter Number
// ----------------------------

const params = new URLSearchParams(window.location.search);

const chapter = params.get("chapter");

if (!chapter) {

    document.getElementById("surahTitle").innerHTML = "Surah Not Found";

    throw new Error("No chapter selected");

}

// ----------------------------
// Load Surah JSON
// ----------------------------

const fileName = chapter.padStart(3, "0");

fetch(`data/surahs/${fileName}.json`)

.then(response => response.json())

.then(data => {

    // ---------- Title ----------

    document.getElementById("surahTitle").innerHTML =
        `📖 ${data[0].surah_name}`;

   document.getElementById("surahNumber").innerHTML =
`Surah : ${chapter}`;

document.getElementById("surahWords").innerHTML =
`Words : ${data.length}`;

document.getElementById("surahPara").innerHTML =
`Para : ${data[0].para}`;

document.getElementById("surahRuku").innerHTML =
`Ruku : ${data[data.length-1].surah_ruku}`;

// آیات کی تعداد

const ayat = [...new Set(data.map(item => item.verse_key))];

document.getElementById("surahAyat").innerHTML =
`Ayat : ${ayat.length}`;

    // ---------- Ruku Filter ----------

    const rukuFilter = document.getElementById("rukuFilter");

    const rukus = [...new Set(data.map(item => item.surah_ruku))];

    rukus.sort((a,b)=>a-b);

    rukus.forEach(ruku=>{

        const option = document.createElement("option");

        option.value = ruku;

        option.textContent = "Ruku " + ruku;

        rukuFilter.appendChild(option);

    });

    // ---------- Show Table ----------

    showTable(data);

    // ---------- Search ----------

    document.getElementById("searchInput")

    .addEventListener("input",()=>{

        applyFilters(data);

    });

    rukuFilter.addEventListener("change",()=>{

        applyFilters(data);

    });

})

// ----------------------------
// Show Table
// ----------------------------

function showTable(rows){

    let html="";

    rows.forEach(item=>{

        html += `
<tr>

<td>${item.verse_key}</td>

<td>${item.word}</td>

<td>${item.meaning_gu}</td>

</tr>
`;

    });

    document.getElementById("wordTable").innerHTML = html;

}

// ----------------------------
// Search + Ruku
// ----------------------------

function applyFilters(data){

    const keyword = document

    .getElementById("searchInput")

    .value

    .trim();

    const ruku = document

    .getElementById("rukuFilter")

    .value;

    let results = data;

    if(keyword!=""){

        results = results.filter(item=>

            (item.word||"").includes(keyword) ||

            (item.meaning_gu||"").includes(keyword) ||

            (item.plain||"").includes(keyword)

        );

    }

    if(ruku!=""){

        results = results.filter(item=>

            String(item.surah_ruku)===ruku

        );

    }

    showTable(results);

}
