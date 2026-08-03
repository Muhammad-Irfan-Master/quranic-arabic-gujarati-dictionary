// ----------------------------
// Get Para Number
// ----------------------------

const params = new URLSearchParams(window.location.search);

const para = params.get("para");

if (!para) {

    document.getElementById("paraTitle").innerHTML = "Para Not Found";

    throw new Error("No para selected");

}

// ----------------------------
// Load Database
// ----------------------------

fetch("data/database.json")

.then(response => response.json())

.then(data => {

    // صرف منتخب پارہ

    data = data.filter(item => String(item.para) === para);

    if(data.length === 0){

        document.getElementById("paraTitle").innerHTML = "No Data Found";

        return;

    }

    // ---------- Title ----------

    document.getElementById("paraTitle").innerHTML =
        `📖 Para ${para}`;

    document.getElementById("paraNumber").innerHTML =
        `Para : ${para}`;

    document.getElementById("paraWords").innerHTML =
        `Words : ${data.length}`;

    // ---------- Total Ayat ----------

    const ayat = [...new Set(data.map(item => item.verse_key))];

    document.getElementById("paraAyat").innerHTML =
        `Ayat : ${ayat.length}`;

    // ---------- Total Surahs ----------

    const surahs = [...new Set(data.map(item => item.chapter))];

    document.getElementById("paraSurahs").innerHTML =
        `Surahs : ${surahs.length}`;

    // ---------- Ruku ----------

    const rukus = [...new Set(data.map(item => item.para_ruku))];

    rukus.sort((a,b)=>a-b);

    document.getElementById("paraRuku").innerHTML =
        `Ruku : ${rukus.length}`;

    // ---------- Ruku Filter ----------

    const rukuFilter = document.getElementById("rukuFilter");

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

            String(item.para_ruku)===ruku

        );

    }

    showTable(results);

}
