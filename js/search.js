let dictionary = [];

fetch("data/database.json")
  .then(response => response.json())
  .then(data => {
    dictionary = data;
    document.getElementById("wordCount").textContent = dictionary.length;
  });

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const keyword = this.value.trim();

    if(keyword===""){
        console.clear();
        return;
    }

    const result = dictionary.filter(item =>

        item.word.includes(keyword) ||

        item.plain.includes(keyword) ||

        item.pronunciation_gu.includes(keyword) ||

        item.meaning_gu.includes(keyword)

    );

    console.clear();

    console.table(result);

});
