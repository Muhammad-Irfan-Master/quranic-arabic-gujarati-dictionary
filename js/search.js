// =====================================
// Quranic Arabic Gujarati Dictionary
// Complete & Fixed search.js
// =====================================

// Global Database Variable
let dictionary = [];

// DOM Elements
const resultBox = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const surahFilter = document.getElementById("surahFilter");
const paraFilter = document.getElementById("paraFilter");

// -------------------------------------
// 1. Database Load & Initialize
// -------------------------------------
async function loadDatabase() {
    try {
        const response = await fetch("data/database.json");
        dictionary = await response.json();

        // کُل الفاظ کی تعداد اسکرین پر دکھائیں
        const wordCountElem = document.getElementById("wordCount");
        if (wordCountElem) {
            wordCountElem.textContent = dictionary.length;
        }

        // سورت اور پارہ کے ڈراپ ڈاؤن لسٹ تیار کریں
        populateFilters();

        // شروع میں تمام یا شروعاتی الفاظ اسکرین پر دکھائیں
        applyFilters();

    } catch (error) {
        console.error("Database Error:", error);
        if (resultBox) {
            resultBox.innerHTML = `
                <div class="no-result">
                    <h3>ڈیٹا بیس لوڈ کرنے میں مسئلہ آیا ہے (Database Load Error)</h3>
                </div>`;
        }
    }
}

// -------------------------------------
// 2. Populate Surah & Para Dropdowns
// -------------------------------------
function populateFilters() {
    if (!surahFilter || !paraFilter) return;

    // ڈیٹا بیس سے تمام سورتوں اور پاروں کی الگ لسٹ تیار کریں
    const surahs = [...new Set(dictionary.map(item => item.chapter))].filter(Boolean).sort((a, b) => a - b);
    const paras = [...new Set(dictionary.map(item => item.para))].filter(Boolean).sort((a, b) => a - b);

    // Surah Dropdown بھریں
    surahFilter.innerHTML = `<option value="">تمام سورتیں (All Surahs)</option>`;
    surahs.forEach(surah => {
        surahFilter.innerHTML += `<option value="${surah}">Surah ${surah}</option>`;
    });

    // Para Dropdown بھریں
    paraFilter.innerHTML = `<option value="">تمام پارے (All Paras)</option>`;
    paras.forEach(para => {
        paraFilter.innerHTML += `<option value="${para}">Para ${para}</option>`;
    });
}

// -------------------------------------
// 3. Search and Apply Filters
// -------------------------------------
function applyFilters() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedSurah = surahFilter ? surahFilter.value : "";
    const selectedPara = paraFilter ? paraFilter.value : "";

    let results = dictionary;

    // --- 1. سرچ بار فلٹر ---
    if (keyword !== "") {
        results = results.filter(item => {
            const arabic = String(item.word || "").toLowerCase();
            const plain = String(item.plain || "").toLowerCase();
            const guPron = String(item.pronunciation_gu || "").toLowerCase();
            const guMeaning = String(item.meaning_gu || "").toLowerCase();
            const chapter = String(item.chapter || "");
            const para = String(item.para || "");

            return (
                arabic.includes(keyword) ||
                plain.includes(keyword) ||
                guPron.includes(keyword) ||
                guMeaning.includes(keyword) ||
                chapter === keyword ||
                para === keyword
            );
        });
    }

    // --- 2. سورت فلٹر ---
    if (selectedSurah !== "") {
        results = results.filter(item => String(item.chapter) === String(selectedSurah));
    }

    // --- 3. پارہ فلٹر ---
    if (selectedPara !== "") {
        results = results.filter(item => String(item.para) === String(selectedPara));
    }

    // نتائج کو اسکرین پر شو کریں
    showResults(results);
}

// -------------------------------------
// 4. Display Results on Screen (UI)
// -------------------------------------
function showResults(results) {
    if (!resultBox) return;

    // اگر کوئی نتیجہ نہ ملے
    if (results.length === 0) {
        resultBox.innerHTML = `
            <div class="no-result" style="text-align:center; padding: 20px;">
                <h3>No Result Found / کوئی نتیجہ نہیں ملا</h3>
            </div>
        `;
        return;
    }

    let html = "";

    // صفحہ زیادہ بھاری نہ ہو، اس لیے شروعاتی 50 نتائج دکھائیں
    results.slice(0, 50).forEach(item => {
        html += `
        <div class="result-card">
            <div class="arabic-word">
                ${item.word || ""}
            </div>
            <div class="result-row">
                <strong>🔊 ગુજરાતી ઉચ્ચાર :</strong> ${item.pronunciation_gu || "-"}
            </div>
            <div class="result-row">
                <strong>📖 ગુજરાતી અર્થ :</strong> ${item.meaning_gu || "-"}
            </div>
            <div class="result-row">
                <strong>📚 Surah :</strong> ${item.chapter || "-"}
            </div>
            <div class="result-row">
                <strong>🕌 Para :</strong> ${item.para || "-"}
            </div>
        </div>
        `;
    });

    resultBox.innerHTML = html;
}

// -------------------------------------
// 5. Event Listeners & Start
// -------------------------------------
// if (searchInput) searchInput.addEventListener("input", applyFilters);
if (surahFilter) surahFilter.addEventListener("change", applyFilters);
if (paraFilter) paraFilter.addEventListener("change", applyFilters);

// ایپلیکیشن شروع کریں
loadDatabase();
// =====================================
// AUTOCOMPLETE
// =====================================

const suggestionBox = document.getElementById("suggestions");

searchInput.addEventListener("input", showSuggestions);

function showSuggestions() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {
        suggestionBox.style.display = "none";
        suggestionBox.innerHTML = "";
        applyFilters();
        return;
    }

    const results = dictionary.filter(item =>

        (item.word || "").includes(keyword) ||
        (item.plain || "").includes(keyword) ||
        (item.pronunciation_gu || "").includes(keyword) ||
        (item.meaning_gu || "").includes(keyword)

    ).slice(0,10);

    if (results.length === 0) {

        suggestionBox.style.display = "none";
        suggestionBox.innerHTML = "";
        return;

    }

    let html = "";

    results.forEach(item => {

        html += `
        <div class="suggestion-item"
             onclick="selectWord('${item.word.replace(/'/g,"\\'")}')">

            ${item.word}

        </div>
        `;

    });

    suggestionBox.innerHTML = html;
    suggestionBox.style.display = "block";

}

function selectWord(word){

    searchInput.value = word;

    suggestionBox.style.display = "none";

    applyFilters();

}

// باہر Click کرنے پر List بند ہو جائے

document.addEventListener("click",function(e){

    if(!e.target.closest(".search-box") &&
       !e.target.closest("#suggestions")){

        suggestionBox.style.display="none";

    }

});
