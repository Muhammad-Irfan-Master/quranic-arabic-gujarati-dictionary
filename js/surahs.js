fetch("data/database.json")
.then(response => response.json())
.then(data => {

    console.log("Database Loaded:", data.length);

    const surahs = {};

    data.forEach(item => {

        if (!surahs[item.chapter]) {

            surahs[item.chapter] = item.surah_name;

        }

    });

    let html = "";

    Object.keys(surahs)
        .sort((a,b)=>Number(a)-Number(b))
        .forEach(chapter => {

            html += `
            <a href="surah.html?chapter=${chapter}" class="surah-card">

                <span class="surah-number">
                    ${chapter}
                </span>

                <span class="surah-name">
                    ${surahs[chapter]}
                </span>

            </a>
            `;

        });

    document.getElementById("surahList").innerHTML = html;

})
.catch(error => {

    console.error(error);

});
