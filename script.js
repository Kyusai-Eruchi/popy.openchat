/* ==========================================
   Announcement Checker
   script.js

   Version:
   Part 1 + Part 2
========================================== */


document.addEventListener("DOMContentLoaded", () => {

   const baseAnnouncement = `
      はい！僕たち私たちはぽぴぃ様が純粋であることをここに誓います✨️可愛くて優しいぽぴぃ大好き！

      ぽぴぃRIP
   `;

    /* ==========================================
       Elements
    ========================================== */

   
    const originalText =
        document.getElementById("originalText");

    const compareText =
        document.getElementById("compareText");


    const leftCount =
        document.getElementById("leftCount");

    const rightCount =
        document.getElementById("rightCount");


    const pasteLeft =
        document.getElementById("pasteLeft");

    const pasteRight =
        document.getElementById("pasteRight");


    const clearLeft =
        document.getElementById("clearLeft");

    const clearRight =
        document.getElementById("clearRight");


    const themeToggle =
        document.getElementById("themeToggle");


    const toast =
        document.getElementById("toast");


    const compareBtn =
        document.getElementById("compareBtn");


    const loading =
        document.getElementById("loading");


    const matchRate =
        document.getElementById("matchRate");


    const progressBar =
        document.getElementById("progressBar");

   　let diffResult = {
      　added:0,
      　removed:0,
      　changed:0
   　};

    originalText.textContent =
    baseAnnouncement.trim();

    /* ==========================================
       Toast
    ========================================== */

    function showToast(message){

        toast.textContent = message;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        },2000);

    }



    /* ==========================================
       Character Counter
    ========================================== */

    function updateCounter(){

        leftCount.textContent =
            `${baseAnnouncement.length}文字`;


        rightCount.textContent =
            `${compareText.value.length}文字`;

    }


    originalText.addEventListener(
        "input",
        updateCounter
    );


    compareText.addEventListener(
        "input",
        updateCounter
    );


    updateCounter();



    /* ==========================================
       Clipboard Paste
    ========================================== */

    async function pasteText(target){


        try{

            const text =
                await navigator.clipboard.readText();


            target.value = text;


            updateCounter();


            showToast("貼り付けました");

        }

        catch(error){

            showToast(
                "貼り付けできませんでした"
            );

        }

    }



    pasteLeft.addEventListener(
        "click",
        () => pasteText(originalText)
    );


    pasteRight.addEventListener(
        "click",
        () => pasteText(compareText)
    );



    /* ==========================================
       Clear
    ========================================== */

    function clearText(target){


        target.value = "";


        updateCounter();


        showToast("クリアしました");

    }



    clearLeft.addEventListener(
        "click",
        () => clearText(originalText)
    );


    clearRight.addEventListener(
        "click",
        () => clearText(compareText)
    );



    /* ==========================================
       Theme
    ========================================== */


    const savedTheme =
        localStorage.getItem("theme");


    if(savedTheme === "dark"){

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    }
    else{

        themeToggle.textContent = "🌙";

    }



    themeToggle.addEventListener(
        "click",
        () => {


            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            if(isDark){

                localStorage.setItem(
                    "theme",
                    "dark"
                );


                themeToggle.textContent =
                    "☀️";


                showToast(
                    "ダークモード"
                );

            }

            else{

                localStorage.setItem(
                    "theme",
                    "light"
                );


                themeToggle.textContent =
                    "🌙";


                showToast(
                    "ライトモード"
                );

            }


        }
    );



    /* ==========================================
       Compare
    ========================================== */


    function compareAnnouncement(){


        const text1 =
            originalText.trim();


        const text2 =
            compareText.value.trim();

       diffView.innerHTML = "";

      diffSummary.textContent =
          "変更はありません";


      matchRate.textContent =
          "0%";


      progressBar.style.width =
          "0%";


      diffResult = {

          added:0,

          removed:0,

          changed:0

      };

        if(
            text1 === "" ||
            text2 === ""
        ){

            showToast(
                "文章を入力してください"
            );

            return;

        }



        loading.classList.remove(
            "hidden"
        );



        setTimeout(() => {


            const score =
               calculateSimilarity(
                  text1,
                  text2
            );


            displayScore(score);


            generateDiff(
                text1,
                text2
            );

            loading.classList.add(
                "hidden"
            );


        },800);


    }



    /* ==========================================
       Similarity
    ========================================== */


    function calculateSimilarity(
        text1,
        text2
    ){


        const lines1 =
            text1.split("\n");


        const lines2 =
            text2.split("\n");



        const max =
            Math.max(
                lines1.length,
                lines2.length
            );


        let same = 0;



        for(
            let i = 0;
            i < max;
            i++
        ){


            if(
                lines1[i] &&
                lines1[i] === lines2[i]
            ){

                same++;

            }


        }



        return Math.round(
            (same / max) * 100
        );


    }



    /* ==========================================
       Display Score
    ========================================== */


    function displayScore(score){


        matchRate.textContent =
            `${score}%`;



        progressBar.style.width =
            `${score}%`;



        if(score === 100){

            showToast(
                "完全一致しました"
            );

        }
        else{

            showToast(
                "照合完了"
            );

        }

    }

   /* ==========================================
   Diff Viewer
   ========================================== */

   const diffView =
      document.getElementById("diffView");

   const diffSummary =
      document.getElementById("diffSummary");

   function generateDiff(text1,text2){

   const lines1 =
      text1.split("\n");

    const lines2 =
        text2.split("\n");

    let html = "";

    let added = 0;
    let removed = 0;
    let changed = 0;

    const max =
        Math.max(
            lines1.length,
            lines2.length
        );

    for(
        let i = 0;
        i < max;
        i++
    ){
       
        const oldLine =
            lines1[i];


        const newLine =
            lines2[i];



        // 両方存在して同じ

        if(
            oldLine &&
            newLine &&
            oldLine === newLine
        ){

            html += createDiffLine(
                i + 1,
                oldLine,
                "normal"
            );

        }



        // 変更

        else if(
            oldLine &&
            newLine
        ){

            changed++;


            html += createDiffLine(
                i + 1,
                "- " + oldLine,
                "remove"
            );


            html += createDiffLine(
                i + 1,
                "+ " + newLine,
                "add"
            );

        }



        // 削除

        else if(oldLine){


            removed++;


            html += createDiffLine(
                i + 1,
                "- " + oldLine,
                "remove"
            );


        }



        // 追加

        else if(newLine){


            added++;


            html += createDiffLine(
                i + 1,
                "+ " + newLine,
                "add"
            );


        }


    }



    diffView.innerHTML =
        html;

    diffResult.added = added;

    diffResult.removed = removed;

    diffResult.changed = changed;

    diffSummary.textContent =
       `追加 ${added}件 / 削除 ${removed}件 / 変更 ${changed}件`;



}



function createDiffLine(
    number,
    text,
    type
){


    return `

    <div class="diff-line diff-${type}">

        <span class="line-number">
            ${number}
        </span>


        <span class="line-content">
            ${escapeHTML(text)}
        </span>


    </div>

    `;


}



function escapeHTML(text){

    return text
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");

}

    compareBtn.addEventListener(
        "click",
        compareAnnouncement
    );

/* ==========================================
   Copy Result
========================================== */


const copyResult =
    document.getElementById("copyResult");



copyResult.addEventListener(
    "click",
    async()=>{


        const resultText =

`アナウンス照合結果

一致率：
${matchRate.textContent}

追加：
${diffResult.added}件

削除：
${diffResult.removed}件

変更：
${diffResult.changed}件


----------------

${diffView.innerText}
`;



        try{

            await navigator.clipboard.writeText(
                resultText
            );


            showToast(
                "結果をコピーしました"
            );

        }

        catch(error){

            showToast(
                "コピーできませんでした"
            );

        }


    }
  );
   
});
