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

        populateFilters();

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

    if(keyword !== ""){

        results = results.filter(item=>{

            return (

                (item.word || "").includes(keyword) ||

                (item.plain || "").includes(keyword) ||

                (item.pronunciation_gu || "").toLowerCase().includes(keyword) ||

                (item.meaning_gu || "").toLowerCase().includes(keyword)

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

    showResults(results);

}
// Events

searchInput.addEventListener("input",applyFilters);

surahFilter.addEventListener("change",applyFilters);

paraFilter.addEventListener("change",applyFilters);
