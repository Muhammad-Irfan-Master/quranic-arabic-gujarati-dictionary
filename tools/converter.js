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

    reader.onload = function(e){

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {type:"array"});

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet,{
            defval:""
        });

        status.innerHTML =
        `
        ✅ Total Rows : ${rows.length}
        <br>
        📄 Sheet : ${sheetName}
        `;

        const cleanData = cleanRows(rows);

        validateData(cleanData);

    };

    reader.readAsArrayBuffer(file);

});
function cleanRows(rows){

    return rows.filter(row=>{

        const chapter = Number(row["chapter"]);

        return (
            row["word"] !== "" &&
            row["Plan Arabic"] !== "" &&
            row["meaning"] !== "" &&
            chapter >=1 &&
            chapter <=114
        );

    });

}
function validateData(rows){

    status.innerHTML +=
    `<br>✅ Valid Records : ${rows.length}`;

}
