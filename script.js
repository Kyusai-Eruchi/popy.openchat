const MAINTENANCE_MODE = false; // ← 本番時は false

document.addEventListener("DOMContentLoaded", () => {

  // --- 開発者用メンテ解除 (?dev=1 でメンテ無効)
  const urlParams = new URLSearchParams(window.location.search);
  const isDev = urlParams.get("dev") === "1";

  // --- メンテナンスモード ---
  if (MAINTENANCE_MODE && !isDev) {
    document.body.innerHTML = `
      <div style="text-align:center;margin-top:100px;font-size:24px;">
        <h1>サービス終了のお知らせ</h1>
        <p></p>
      </div>`;
    return;
  }

  // =========================
  // 🎨 カラーカスタム機能
  // =========================
  const textColorInput = document.getElementById("textColor");
  const diffColorInput = document.getElementById("diffColor");
  const diffBgInput = document.getElementById("diffBg");
  const btnColorInput = document.getElementById("btnColor");
  const btnTextColorInput = document.getElementById("btnTextColor");

  function applyColors() {
    document.documentElement.style.setProperty("--text-color", textColorInput.value);
    document.documentElement.style.setProperty("--diff-text", diffColorInput.value);
    document.documentElement.style.setProperty("--diff-bg", diffBgInput.value);
    document.documentElement.style.setProperty("--btn-bg", btnColorInput.value);
    document.documentElement.style.setProperty("--btn-text", btnTextColorInput.value);
  }

  function saveColors() {
    localStorage.setItem("textColor", textColorInput.value);
    localStorage.setItem("diffColor", diffColorInput.value);
    localStorage.setItem("diffBg", diffBgInput.value);
    localStorage.setItem("btnColor", btnColorInput.value);
    localStorage.setItem("btnTextColor", btnTextColorInput.value);
  }

  function loadColors() {
    const text = localStorage.getItem("textColor");
    const diff = localStorage.getItem("diffColor");
    const bg   = localStorage.getItem("diffBg");
    const btn  = localStorage.getItem("btnColor");
    const btnText = localStorage.getItem("btnTextColor");

    if (text) textColorInput.value = text;
    if (diff) diffColorInput.value = diff;
    if (bg) diffBgInput.value = bg;
    if (btn) btnColorInput.value = btn;
    if (btnText) btnTextColorInput.value = btnText;

    applyColors();
  }

  // 初期読み込み
  loadColors();

  // 入力時に即反映＆保存
  [
    textColorInput,
    diffColorInput,
    diffBgInput,
    btnColorInput,
    btnTextColorInput
  ].forEach(el => {
    el.addEventListener("input", () => {
      applyColors();
      saveColors();
    });
  });

  // =========================
  // 🔍 照合処理
  // =========================
  const announceEl = document.getElementById("announce");
  const btn = document.getElementById("my-btn");

  btn.addEventListener("click", () => {
    const announce = announceEl.value || announceEl.placeholder;
    const message = document.getElementById("message").value;
    const result  = document.getElementById("result");
    const diffEl  = document.getElementById("diff");

    result.style.display = "block";
    diffEl.innerHTML = "";

    if (message.trim() === "") {
      result.textContent = "照合したいアナウンスを入力してください ⚠️";
      result.style.color = "yellow";
      return;
    }

    if (announce.trim() === message.trim()) {
      result.textContent = "一致しています ✅";
      result.style.color = "lime";
      diffEl.innerHTML = "";
    } else {
      result.textContent = "一致していません ❌";
      result.style.color = "red";

      let html = "";
      const maxLen = Math.max(announce.length, message.length);

      for (let i = 0; i < maxLen; i++) {
        const a = announce[i] || "";
        if (a === message[i]) {
          html += a;
        } else {
          html += `<span class="diff-wrong">${a || "□"}</span>`;
        }
      }
      diffEl.innerHTML = html;
    }
  });

  // =========================
  // 🔐 管理者ログイン
  // =========================
  const ADMIN_PASSWORD_HASH =
    "ab15b78885d5043704c07d8ffa7266baecf94064c072186a9a348a1831c7aa8a";

  const loginBtn = document.getElementById("login-btn");
  const passInput = document.getElementById("admin-pass");

  async function sha256(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  loginBtn.addEventListener("click", async () => {
    if (!passInput.value.trim()) {
      alert("パスワードを入力してください");
      return;
    }

    const inputHash = await sha256(passInput.value);
    if (inputHash !== ADMIN_PASSWORD_HASH) {
      alert("パスワードが一致しません");
      return;
    }

    window.location.href = "admin.html";
  });

});
