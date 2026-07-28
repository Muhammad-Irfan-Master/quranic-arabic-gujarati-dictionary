// =====================================
// Quranic Arabic Gujarati Dictionary
// Version 2 (Fixed & Corrected)
// =====================================

// Database
let dictionary = [];

// DOM Elements
const resultBox = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const surahFilter = document.getElementById("surahFilter");
const paraFilter = document.getElementById("paraFilter");

// ----------------------------
// 1. Load Database & Populate Filters
// ----------------------------
async function loadDatabase() {
    try {
        const response = await fetch("data/database.json");
        dictionary = await response.json();

        // کولیکشن میں کُل الفاظ کی تعداد دکھائیں
        const wordCountElem = document.getElementById("wordCount");
        if (wordCountElem) {
            wordCountElem.textContent = dictionary.length;
        }

        // Dropdowns کو ڈیٹا بیس سے خودکار طریقے سے بھریں
        populateFilters();

        // شروعاتی رزلٹ دکھائیں
        applyFilters();
    } catch (error) {
        console.error("Database Error:", error);
        resultBox.innerHTML = `<div class="no-result"><h3>డేటా لوڈ کرنے میں خطا آئے ہے (Database Error)</h3></div>`;
    }
}

// Dropdowns (Surah & Para) میں اختیارات (Options) بھرنے کا فنکشن
function populateFilters() {
    if (!surahFilter || !paraFilter) return;

    // تمام سورتیں اور پارے نکال کر Unique (Unique List) بنائیں
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

loadDatabase();

// ----------------------------
// 2. Search & Apply Filters
// ----------------------------
function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedSurah = surahFilter.value;
    const selectedPara = paraFilter.value;

    let results = dictionary;

    // --- Search Input (الفاظ، گجراتی تلفظ، معنی، سورت یا پارہ نمبر) ---
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
                chapter === keyword || // سرچ بار میں سورت نمبر لکھنے پر
                para === keyword      // سرچ بار میں پارہ نمبر لکھنے پر
            );
        });
    }

    // --- Surah Filter ---
    if (selectedSurah !== "") {
        results = results.filter(item => String(item.chapter) === String(selectedSurah));
    }

    // --- Para Filter ---
    if (selectedPara !== "") {
        results = results.filter(item => String(item.para) === String(selectedPara));
    }

    showResults(results);
}

// Event Listeners
searchInput.addEventListener("input", applyFilters);
surahFilter.addEventListener("change", applyFilters);
paraFilter.addEventListener("change", applyFilters);

// ----------------------------
// 3. Display Results
// ----------------------------
function showResults(results) {
    if (!resultBox) return;

    // اگر کوئی Result نہ ملے
    if (results.length === 0) {
        resultBox.innerHTML = `
            <div class="no-result">
                <h3>No Result Found / کوئی نتیجہ نہیں ملا</h3>
            </div>
        `;
        return;
    }

    let html = "";

    // شروعاتی 50 نتائج دکھائیں تاکہ پیج ہینگ (Hang) نہ ہو
    results.slice(0, 50).forEach(item => {
        html += `
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
                ${item.chapter || "-"}
            </div>
            <div class="result-row">
                <strong>🕌 Para :</strong>
                ${item.para || "-"}
            </div>
        </div>
        `;
    });

    resultBox.innerHTML = html;
}
