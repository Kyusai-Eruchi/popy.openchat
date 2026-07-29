/* ==========================================
   Announcement Checker
   script.js
   Part 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       Elements
    ========================================== */

    const originalText = document.getElementById("originalText");
    const compareText = document.getElementById("compareText");

    const leftCount = document.getElementById("leftCount");
    const rightCount = document.getElementById("rightCount");

    const pasteLeft = document.getElementById("pasteLeft");
    const pasteRight = document.getElementById("pasteRight");

    const clearLeft = document.getElementById("clearLeft");
    const clearRight = document.getElementById("clearRight");

    const themeToggle = document.getElementById("themeToggle");

    const toast = document.getElementById("toast");

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

    originalText.addEventListener("input", updateCounter);
    compareText.addEventListener("input", updateCounter);

    updateCounter();

    /* ==========================================
       Paste
    ========================================== */

    async function pasteTo(textarea){

        try{

            const text =
                await navigator.clipboard.readText();

            textarea.value = text;

            updateCounter();

            showToast("貼り付けました");

        }

        catch(error){

            showToast("貼り付けに失敗しました");

        }

    }

    pasteLeft.addEventListener("click", () => {

        pasteTo(originalText);

    });

    pasteRight.addEventListener("click", () => {

        pasteTo(compareText);

    });

    /* ==========================================
       Clear
    ========================================== */

    function clearTextarea(textarea){

        textarea.value = "";

        updateCounter();

        showToast("クリアしました");

    }

    clearLeft.addEventListener("click", () => {

        clearTextarea(originalText);

    });

    clearRight.addEventListener("click", () => {

        clearTextarea(compareText);

    });

    /* ==========================================
       Dark Mode
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

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const darkMode =
            document.body.classList.contains("dark");

        if(darkMode){

            localStorage.setItem("theme","dark");

            themeToggle.textContent = "☀️";

            showToast("ダークモード");

        }

        else{

            localStorage.setItem("theme","light");

            themeToggle.textContent = "🌙";

            showToast("ライトモード");

        }

    });

});

