// =====================================
// Quranic Arabic Gujarati Dictionary
// Version 2
// Part 1
// =====================================

// Database
let dictionary = [];

// DOM
const resultBox = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const surahFilter = document.getElementById("surahFilter");
const paraFilter = document.getElementById("paraFilter");

// ----------------------------
// Load Database
// ----------------------------

async function loadDatabase(){

    try{

        const response = await fetch("data/database.json");

        dictionary = await response.json();

        document.getElementById("wordCount").textContent = dictionary.length;

      // populateFilters();

        applyFilters();

    }

    catch(error){

        console.error("Database Error:", error);

    }

}

loadDatabase();
// =====================================
// Part 2
// Search + Filters
// =====================================

function applyFilters(){

    const keyword = searchInput.value.trim().toLowerCase();

    const selectedSurah = surahFilter.value;

    const selectedPara = paraFilter.value;

    let results = dictionary;

   // ------------------------
// Search
// ------------------------

if (keyword !== "") {

    results = results.filter(item => {

        const arabic = String(item.word || "");
        const plain = String(item.plain || "");
        const guPron = String(item.pronunciation_gu || "");
        const guMeaning = String(item.meaning_gu || "");

        return (

            arabic.includes(keyword) ||
            plain.includes(keyword) ||
            guPron.includes(keyword) ||
            guMeaning.includes(keyword)

        );

    });

}

    // ------------------------
    // Surah Filter
    // ------------------------

    if(selectedSurah !== ""){

        results = results.filter(item=>

            String(item.chapter)===selectedSurah

        );

    }

    // ------------------------
    // Para Filter
    // ------------------------

    if(selectedPara !== ""){

        results = results.filter(item=>

            String(item.para)===selectedPara

        );

    }
console.log(results);
    showResults(results);

}
// Events

searchInput.addEventListener("input",applyFilters);

surahFilter.addEventListener("change",applyFilters);

paraFilter.addEventListener("change",applyFilters);
// =====================================
// Part 3
// Show Results
// =====================================

function showResults(results){

    // اگر کوئی Result نہ ہو
    if(results.length===0){

        resultBox.innerHTML=`

        <div class="no-result">

            <h3>No Result Found</h3>

        </div>

        `;

        return;

    }

    let html="";

    results.slice(0,50).forEach(item=>{

        html+=`

<div class="result-card">

    <div class="arabic-word">

        ${item.word}

    </div>

    <div class="result-row">

        <strong>🔊 ગુજરાતી ઉચ્ચાર :</strong>

        ${item.pronunciation_gu || "-"}

    </div>

    <div class="result-row">

        <strong>📖 ગુજરાતી અર્થ :</strong>

        ${item.meaning_gu || "-"}

    </div>

    <div class="result-row">

        <strong>📚 Surah :</strong>

        ${item.chapter}

    </div>

    <div class="result-row">

        <strong>🕌 Para :</strong>

        ${item.para}

    </div>

</div>

`;

    });

    resultBox.innerHTML=html;

}
