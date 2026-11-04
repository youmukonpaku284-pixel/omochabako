"use strict";
(() => {
  const UNLOCK_KEY = "omochabako:secret:diary05:erased:v1";
  const RETURN_KEY = "omochabako:secret:counter-return:v1";
  const page = location.pathname.match(/\/(0[1-5])\.html$/)?.[1] || null;
  let unlocked = false;
  try { unlocked = localStorage.getItem(UNLOCK_KEY) === "true"; } catch {}
  if (page && unlocked && page !== "05") {
    const post = document.querySelector(".post");
    if (post) {
      const nav = document.createElement("p");
      nav.className = "next-diary";
      const link = document.createElement("a");
      link.href = page === "01" || page === "04" ? "index.html" : String(Number(page) + 1).padStart(2, "0") + ".html";
      link.textContent = "次の日記へ →";
      if (page === "01" || page === "04") {
        link.addEventListener("click", () => {
          try { sessionStorage.setItem(RETURN_KEY, page === "01" ? "4" : "3"); } catch {}
        });
      }
      nav.appendChild(link);
      post.appendChild(nav);
    }
  }
  if (!page) {
    const counter = document.querySelector(".counter");
    if (!counter) return;
    try {
      const value = sessionStorage.getItem(RETURN_KEY);
      if (value === "4" || value === "3") counter.textContent = value.padStart(6, "0");
      sessionStorage.removeItem(RETURN_KEY);
    } catch {}
  }
})();
