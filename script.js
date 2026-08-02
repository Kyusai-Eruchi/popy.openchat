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
      Maintenance Mode
   ========================================== */

   const maintenanceMode = true;

   if (maintenanceMode) {

    document.body.innerHTML = `
        <div class="maintenance-screen">

            <h1>🔧 メンテナンス中</h1>

            <p>
                現在、アナウンス照合ツールは
                メンテナンスを実施しています。
            </p>

            <p>
                ご不便をお掛けしますが、
                復旧までしばらくお待ちください。
            </p>

        </div>
    `;

    return;

}

    /* ==========================================
       Elements
    ========================================== */

   
    const originalText =
        document.getElementById("originalText");

    const compareText =
        document.getElementById("compareText");
   

    const rightCount =
        document.getElementById("rightCount");


    const pasteRight =
        document.getElementById("pasteRight");

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

    rightCount.textContent =
        `${compareText.value.length}文字`;

   }

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
          baseAnnouncement.trim();

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
   LCS (Longest Common Subsequence)
========================================== */

function getLCS(a, b){

    const dp = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
    );

    for(let i = 1; i <= a.length; i++){

        for(let j = 1; j <= b.length; j++){

            if(a[i - 1] === b[j - 1]){

                dp[i][j] = dp[i - 1][j - 1] + 1;

            }else{

                dp[i][j] = Math.max(
                    dp[i - 1][j],
                    dp[i][j - 1]
                );

            }

        }

    }

    return dp;

}
   
   /* ==========================================
   Diff Viewer
   ========================================== */

   const diffView =
      document.getElementById("diffView");

   const diffSummary =
      document.getElementById("diffSummary");


   
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
