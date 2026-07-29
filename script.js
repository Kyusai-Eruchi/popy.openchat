/* ==========================================
   Announcement Checker
   script.js

   Version:
   Part 1 + Part 2
========================================== */


document.addEventListener("DOMContentLoaded", () => {


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
            `${originalText.value.length}文字`;


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
            originalText.value.trim();


        const text2 =
            compareText.value.trim();



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



    compareBtn.addEventListener(
        "click",
        compareAnnouncement
    );


});
