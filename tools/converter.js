const fileInput = document.getElementById("excelFile");
const button = document.getElementById("convertBtn");
const status = document.getElementById("status");

button.addEventListener("click", () => {

    const file = fileInput.files[0];

    if (!file) {
        alert("پہلے Excel فائل منتخب کریں");
        return;
    }

    status.innerHTML = "Reading Excel...";

    const reader = new FileReader();

    reader.onload = function(e){

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data,{type:"array"});

        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet);

        status.innerHTML =
        `
        ✅ Rows Read : ${json.length}
        <br><br>
        Sheet : ${sheetName}
        `;

        console.log(json);
const jsonString = JSON.stringify(json, null, 2);

const blob = new Blob([jsonString], {
    type: "application/json"
});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "database.json";

a.click();

URL.revokeObjectURL(url);

status.innerHTML += "<br><br>✅ database.json Downloaded";
    };

    reader.readAsArrayBuffer(file);

});
