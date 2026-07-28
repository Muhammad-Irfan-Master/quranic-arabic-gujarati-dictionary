alert("search.js Loaded");
let dictionary = [];

// Result Box
const resultBox = document.getElementById("results");

// Search Input
const searchInput = document.getElementById("searchInput");

// Database Load
fetch("data/database.json")
    .then(response => response.json())
  .then(data => {

    dictionary = data;

    document.getElementById("wordCount").textContent = dictionary.length;

    // صفحہ کھلتے ہی پہلے 100 الفاظ دکھاؤ
    showResults(dictionary.slice(0,100));
populateFilters();
})
    .catch(error => {

        console.error("❌ Database Error:", error);

    });

// Search

searchInput.addEventListener("input", applyFilters);

// ---------------------------
// Show Results
// ---------------------------

function showResults(results){

    if(results.length===0){

        resultBox.innerHTML="<h3>No Result Found</h3>";

        return;

    }

    let html="";

    results.slice(0,30).forEach(item=>{

        html+=`

<div class="result-card">

<div class="arabic">

${item.word}

</div>



<div class="result-row">

<strong>🔊 ઉચ્ચાર :</strong>

${item.pronunciation || "-"}

</div>

<div class="result-row">

<strong>📖 ગુજરાતી અર્થ :</strong>

${item.meaning || "-"}

</div>

<div class="result-row">

<strong>📚 Surah :</strong>

${item.chapter}

</div>

<div class="result-row">

<strong>🕌 Para :</strong>

${item.para || "-"}

</div>

</div>

`;

    });

    resultBox.innerHTML=html;

}
function populateFilters() {
console.log(dictionary[0]);
console.log(dictionary.length);
    const surahSelect = document.getElementById("surahFilter");
    const paraSelect = document.getElementById("paraFilter");

    if (!surahSelect || !paraSelect) return;

    // ===== Surahs =====

    const surahs = [...new Set(dictionary.map(item => item.chapter))]
        .sort((a,b)=>a-b);

    surahs.forEach(chapter => {

        const option = document.createElement("option");

        option.value = chapter;

        option.textContent = "Surah " + chapter;

        surahSelect.appendChild(option);

    });

    // ===== Paras =====

    const paras = [...new Set(dictionary.map(item => item.para))]
        .sort((a,b)=>a-b);

    paras.forEach(para => {

        const option = document.createElement("option");

        option.value = para;

        option.textContent = "Para " + para;

        paraSelect.appendChild(option);

    });
surahSelect.addEventListener("change", applyFilters);
paraSelect.addEventListener("change", applyFilters);
}
function applyFilters() {

    const selectedSurah = document.getElementById("surahFilter").value;
    const selectedPara = document.getElementById("paraFilter").value;
    const keyword = document.getElementById("searchInput").value.trim();

    let results = dictionary;

    // Search Filter
    if (keyword !== "") {

        results = results.filter(item =>

            (item.word || "").includes(keyword) ||
            (item.plain || "").includes(keyword) ||
            (item.pronunciation || "").includes(keyword) ||
            (item.meaning || "").includes(keyword)

        );

    }

    // Surah Filter
    if (selectedSurah !== "") {

        results = results.filter(item =>

            String(item.chapter) === selectedSurah

        );

    }

    // Para Filter
    if (selectedPara !== "") {

        results = results.filter(item =>

            String(item.para) === selectedPara

        );

    }
console.log(results.length);
console.log(results);
    showResults(results);

}
