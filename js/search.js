// =====================================
// Quranic Arabic Gujarati Dictionary
// Complete Search System
// =====================================


let dictionary = [];


// =====================================
// DOM Elements
// =====================================

const resultBox =
    document.getElementById("results");

const searchInput =
    document.getElementById("searchInput");

const surahFilter =
    document.getElementById("surahFilter");

const paraFilter =
    document.getElementById("paraFilter");

const suggestionBox =
    document.getElementById("suggestions");


// =====================================
// 1. DATABASE LOAD
// =====================================

async function loadDatabase() {

    try {

        console.log("Loading database...");


        // ---------------------------------
        // پہلے پرانی database.json load کریں
        // ---------------------------------

        const oldResponse = await fetch(
            "data/database.json?v=" + Date.now()
        );


        if (!oldResponse.ok) {

            throw new Error(
                "database.json load نہیں ہو سکی"
            );

        }


        const oldDatabase =
            await oldResponse.json();


        // ---------------------------------
        // صرف Surah 1 سے 88 تک پرانا data رکھیں
        // ---------------------------------

        const oldData =
            oldDatabase.filter(item => {

                const chapter =
                    Number(item.chapter);

                return chapter >= 1 &&
                       chapter <= 88;

            });


        console.log(
            "Old Database (Surah 1-88):",
            oldData.length
        );


        // ---------------------------------
        // نئی Surah JSON files
        // 089.json - 114.json
        // ---------------------------------

        const surahFiles = [];


        for (let i = 89; i <= 114; i++) {

            const surahNumber =
                String(i).padStart(3, "0");


            surahFiles.push(
                `data/surahs/${surahNumber}.json`
            );

        }


        // ---------------------------------
        // تمام نئی files ایک ساتھ Load کریں
        // ---------------------------------

        const responses =
            await Promise.all(

                surahFiles.map(file =>
                    fetch(
                        file + "?v=" + Date.now()
                    )
                )

            );


        // ---------------------------------
        // Check کریں کہ کوئی file missing نہ ہو
        // ---------------------------------

        responses.forEach(
            (response, index) => {

                if (!response.ok) {

                    throw new Error(
                        "File load نہیں ہوئی: " +
                        surahFiles[index]
                    );

                }

            }
        );


        // ---------------------------------
        // JSON Data حاصل کریں
        // ---------------------------------

        const newData =
            await Promise.all(

                responses.map(response =>
                    response.json()
                )

            );


        // ---------------------------------
        // تمام نئی Surah files کو ایک array بنائیں
        // ---------------------------------

        const newSurahData =
            newData.flat();


        console.log(
            "New Database (Surah 89-114):",
            newSurahData.length
        );


        // ---------------------------------
        // Old + New Data Combine
        // ---------------------------------

        dictionary = [

            ...oldData,

            ...newSurahData

        ];


        console.log(
            "TOTAL RECORDS:",
            dictionary.length
        );


        // ---------------------------------
        // Word Count
        // ---------------------------------

        const wordCountElem =
            document.getElementById("wordCount");


        if (wordCountElem) {

            wordCountElem.textContent =
                dictionary.length;

        }


        // ---------------------------------
        // Filters
        // ---------------------------------

        populateFilters();


        // ---------------------------------
        // Initial Results
        // ---------------------------------

        applyFilters();


    } catch (error) {

        console.error(
            "Database Error:",
            error
        );


        if (resultBox) {

            resultBox.innerHTML = `

                <div class="no-result"
                     style="text-align:center; padding:20px;">

                    <h3>
                        Database Load Error
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }

    }

}


// =====================================
// 2. SURAH & PARA FILTERS
// =====================================

function populateFilters() {


    if (!surahFilter || !paraFilter) {

        return;

    }


    // ---------------------------------
    // Surahs
    // ---------------------------------

    const surahs = [

        ...new Set(

            dictionary
                .map(item => item.chapter)
                .filter(Boolean)

        )

    ].sort(

        (a, b) =>
            Number(a) - Number(b)

    );


    // ---------------------------------
    // Paras
    // ---------------------------------

    const paras = [

        ...new Set(

            dictionary
                .map(item => item.para)
                .filter(Boolean)

        )

    ].sort(

        (a, b) =>
            Number(a) - Number(b)

    );


    // ---------------------------------
    // Surah Dropdown
    // ---------------------------------

    surahFilter.innerHTML =

        `<option value="">
            تمام سورتیں (All Surahs)
        </option>`;


    surahs.forEach(surah => {

        surahFilter.innerHTML +=

            `<option value="${surah}">
                Surah ${surah}
            </option>`;

    });


    // ---------------------------------
    // Para Dropdown
    // ---------------------------------

    paraFilter.innerHTML =

        `<option value="">
            تمام پارے (All Paras)
        </option>`;


    paras.forEach(para => {

        paraFilter.innerHTML +=

            `<option value="${para}">
                Para ${para}
            </option>`;

    });

}


// =====================================
// 3. SEARCH + FILTER
// =====================================

function applyFilters() {


    const keyword =

        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()

            : "";


    const selectedSurah =

        surahFilter
            ? surahFilter.value

            : "";


    const selectedPara =

        paraFilter
            ? paraFilter.value

            : "";


    let results =
        dictionary;


    // ---------------------------------
    // Search Box
    // ---------------------------------

    if (keyword !== "") {

        results =
            results.filter(item => {


                const arabic =

                    String(item.word || "")
                        .toLowerCase();


                const plain =

                    String(item.plain || "")
                        .toLowerCase();


                const guPron =

                    String(
                        item.pronunciation_gu || ""
                    )
                    .toLowerCase();


                const guMeaning =

                    String(
                        item.meaning_gu || ""
                    )
                    .toLowerCase();


                const chapter =

                    String(
                        item.chapter || ""
                    );


                const para =

                    String(
                        item.para || ""
                    );


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


    // ---------------------------------
    // Surah Filter
    // ---------------------------------

    if (selectedSurah !== "") {

        results =

            results.filter(item =>

                String(item.chapter) ===
                String(selectedSurah)

            );

    }


    // ---------------------------------
    // Para Filter
    // ---------------------------------

    if (selectedPara !== "") {

        results =

            results.filter(item =>

                String(item.para) ===
                String(selectedPara)

            );

    }


    // ---------------------------------
    // Show Results
    // ---------------------------------

    showResults(results);

}


// =====================================
// 4. SHOW RESULTS
// =====================================

function showResults(results) {


    if (!resultBox) {

        return;

    }


    // ---------------------------------
    // کوئی Result نہیں
    // ---------------------------------

    if (results.length === 0) {

        resultBox.innerHTML = `

            <div class="no-result"
                 style="text-align:center; padding:20px;">

                <h3>
                    No Result Found / کوئی نتیجہ نہیں ملا
                </h3>

            </div>

        `;

        return;

    }


    let html = "";


    // ---------------------------------
    // صرف پہلے 50 نتائج
    // ---------------------------------

    results
        .slice(0, 50)
        .forEach(item => {


            html += `

                <div class="result-card">


                    <!-- ===========================
                         ARABIC WORD
                    =========================== -->

                    <div class="arabic-word">
                        ${item.word || ""}
                    </div>


                    <!-- ===========================
                         GUJARATI PRONUNCIATION
                    =========================== -->

                    <div class="result-row">

                        <strong class="gujarati-label">
                            🔊 ગુજરાતી ઉચ્ચાર :
                        </strong>

                        <span class="gujarati-text">
                            ${item.pronunciation_gu || "-"}
                        </span>

                    </div>


                    <!-- ===========================
                         GUJARATI MEANING
                    =========================== -->

                    <div class="result-row">

                        <strong class="gujarati-label">
                            📖 ગુજરાતી અર્થ :
                        </strong>

                        <span class="gujarati-text">
                            ${item.meaning_gu || "-"}
                        </span>

                    </div>


                    <!-- ===========================
                         SURAH
                    =========================== -->

                    <div class="result-row">

                        <strong>
                            📚 Surah :
                        </strong>

                        <span>
                            ${item.chapter || "-"}
                        </span>

                    </div>


                    <!-- ===========================
                         PARA
                    =========================== -->

                    <div class="result-row">

                        <strong>
                            🕌 Para :
                        </strong>

                        <span>
                            ${item.para || "-"}
                        </span>

                    </div>


                </div>

            `;

        });


    resultBox.innerHTML =
        html;

}


// =====================================
// 5. AUTOCOMPLETE
// =====================================

function showSuggestions() {


    if (!searchInput || !suggestionBox) {

        return;

    }


    const keyword =

        searchInput.value
            .trim()
            .toLowerCase();


    // ---------------------------------
    // خالی search
    // ---------------------------------

    if (keyword === "") {

        suggestionBox.style.display =
            "none";

        suggestionBox.innerHTML =
            "";

        applyFilters();

        return;

    }


    // ---------------------------------
    // Search Suggestions
    // ---------------------------------

    const results =

        dictionary
            .filter(item => {


                const word =

                    String(item.word || "")
                        .toLowerCase();


                const plain =

                    String(item.plain || "")
                        .toLowerCase();


                const pronunciation =

                    String(
                        item.pronunciation_gu || ""
                    )
                    .toLowerCase();


                const meaning =

                    String(
                        item.meaning_gu || ""
                    )
                    .toLowerCase();


                return (

                    word.includes(keyword) ||

                    plain.includes(keyword) ||

                    pronunciation.includes(keyword) ||

                    meaning.includes(keyword)

                );

            })
            .slice(0, 10);


    // ---------------------------------
    // کوئی suggestion نہیں
    // ---------------------------------

    if (results.length === 0) {

        suggestionBox.style.display =
            "none";

        suggestionBox.innerHTML =
            "";

        return;

    }


    let html = "";


    results.forEach(item => {


        const word =

            String(item.word || "")
                .replace(/'/g, "\\'");


        html += `

            <div class="suggestion-item"
                 onclick="selectWord('${word}')">

                ${item.word || ""}

            </div>

        `;

    });


    suggestionBox.innerHTML =
        html;


    suggestionBox.style.display =
        "block";

}


// =====================================
// 6. SELECT AUTOCOMPLETE WORD
// =====================================

function selectWord(word) {


    if (!searchInput) {

        return;

    }


    searchInput.value =
        word;


    if (suggestionBox) {

        suggestionBox.style.display =
            "none";

    }


    applyFilters();

}


// =====================================
// 7. EVENT LISTENERS
// =====================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            showSuggestions();

            applyFilters();

        }
    );

}


if (surahFilter) {

    surahFilter.addEventListener(
        "change",
        applyFilters
    );

}


if (paraFilter) {

    paraFilter.addEventListener(
        "change",
        applyFilters
    );

}


// =====================================
// 8. OUTSIDE CLICK
// =====================================

document.addEventListener(
    "click",
    function (e) {


        if (

            !e.target.closest(".search-box") &&

            !e.target.closest("#suggestions")

        ) {


            if (suggestionBox) {

                suggestionBox.style.display =
                    "none";

            }

        }

    }
);


// =====================================
// 9. START APPLICATION
// =====================================

loadDatabase();
