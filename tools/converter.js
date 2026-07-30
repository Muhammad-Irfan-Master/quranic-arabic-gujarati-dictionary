const fileInput = document.getElementById("excelFile");
const button = document.getElementById("convertBtn");
const status = document.getElementById("status");

button.addEventListener("click", () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("پہلے Excel فائل منتخب کریں۔");
        return;
    }

    status.innerHTML = "📖 Excel پڑھا جا رہا ہے...";

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const data = new Uint8Array(e.target.result);

            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(worksheet, {
                defval: ""
            });

            status.innerHTML = `
                ✅ Total Rows : ${rows.length}
                <br>
                📄 Sheet : ${sheetName}
            `;

            // ===============================
            // Clean Data
            // ===============================

            const cleanData = cleanRows(rows);

            // ===============================
            // Validation
            // ===============================

            validateData(cleanData);

            // ===============================
            // Search Index
            // ===============================

            const indexData = buildIndex(cleanData);

            status.innerHTML += `<br>🔍 Search Index : ${indexData.length}`;

            // ===============================
            // Surah Files
            // ===============================

            const surahFiles = buildSurahFiles(cleanData);

            status.innerHTML += `<br>📖 Surahs : ${Object.keys(surahFiles).length}`;
            // ===============================
// Download Buttons for Surah JSON
// ===============================

let downloadHTML = "<hr><h3>📥 Download Surah JSON Files</h3>";

Object.keys(surahFiles).sort().forEach(chapter => {

    const jsonData = JSON.stringify(surahFiles[chapter], null, 2);

    const blob = new Blob([jsonData], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    downloadHTML += `
        <div style="margin:6px 0;">
            <a href="${url}"
               download="${chapter}.json"
               style="
                    display:inline-block;
                    padding:8px 14px;
                    background:#0d6efd;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                ">
                ⬇ ${chapter}.json
            </a>
        </div>
    `;

});

status.innerHTML += downloadHTML;

            // ===============================
            // Download database.json
            // ===============================

            const jsonData = JSON.stringify(cleanData, null, 2);

            const blob = new Blob(
                [jsonData],
                { type: "application/json" }
            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;
            a.download = "database.json";

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);

            URL.revokeObjectURL(url);

            status.innerHTML += "<br>✅ database.json Downloaded";

        } catch (err) {

            console.error(err);

            status.innerHTML = "❌ Error : " + err.message;

        }

    };

    reader.readAsArrayBuffer(file);

});


// =====================================
// Clean Rows
// =====================================

function cleanRows(rows) {

    return rows.filter(row => {

        const chapter = Number(row["chapter"]);

        return (

            row["word"] !== "" &&
            row["plain"] !== "" &&
            chapter >= 1 &&
            chapter <= 114

        );

    });

}


// =====================================
// Validation
// =====================================

function validateData(rows) {

    status.innerHTML += `<br>✅ Valid Records : ${rows.length}`;

}


// =====================================
// Search Index
// =====================================

function buildIndex(rows) {

   return rows.map(row => ({

    word_id: Number(row["word_id"]),

    verse_id: row["verse_id"],

    verse_key: row["verse_key"],

    word: row["word"],

    plain: row["plain"],

    pronunciation_gu: row["pronunciation_gu"],

    meaning_gu: row["meaning_gu"],

    chapter: Number(row["chapter"]),

    para: Number(row["para"]),

    surah_ruku: Number(row["surah_ruku"]),

    para_ruku: Number(row["para_ruku"])

}));

}


// =====================================
// Build Surah Files
// =====================================

function buildSurahFiles(rows) {

    const surahs = {};

    rows.forEach(row => {

        const chapter = String(row["chapter"]).padStart(3, "0");

        if (!surahs[chapter]) {

            surahs[chapter] = [];

        }

        surahs[chapter].push(row);

    });

    return surahs;

}
