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
            row["Plan Arabic"] !== "" &&
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

        word: row["word"],

        plain: row["Plan Arabic"],

        pronunciation: row["pronunciation"],

        meaning: row["meaning"],

        chapter: Number(row["chapter"]),

        verse_key: row["verse_key"]

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
