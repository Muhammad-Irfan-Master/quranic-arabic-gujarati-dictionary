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

});
    .catch(error => {

        console.error("❌ Database Error:", error);

    });

// Search
searchInput.addEventListener("input", function () {

    const keyword = this.value.trim();

    if (keyword === "") {

        resultBox.innerHTML = "";

        return;

    }

    const results = dictionary.filter(item =>

        (item.word || "").includes(keyword) ||

        (item.plain || "").includes(keyword) ||

        (item.pronunciation || "").includes(keyword) ||

        (item.meaning || "").includes(keyword)

    );

    showResults(results);

});


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

<div class="plain">

${item.plain}

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
