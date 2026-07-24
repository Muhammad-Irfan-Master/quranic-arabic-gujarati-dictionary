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

        console.log("✅ Database Loaded:", dictionary.length);

        document.getElementById("wordCount").textContent = dictionary.length;

    })
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

        resultBox.innerHTML="<p>No Result Found</p>";

        return;

    }

    let html="";

    results.slice(0,30).forEach(item=>{

        html+=`

        <div class="result-card">

            <h2>${item.word}</h2>

            <p><strong>Gujarati :</strong> ${item.meaning || "-"}</p>

            <p><strong>Pronunciation :</strong> ${item.pronunciation || "-"}</p>

            <p><strong>Verse :</strong> ${item.verse_key}</p>

        </div>

        `;

    });

    resultBox.innerHTML=html;

}
