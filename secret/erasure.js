"use strict";
// Diary 05: the disappearance is remembered in this browser.
// This effect changes only the page display; it never deletes repository files.
const storageKey = "omochabako:secret:diary05:erased:v1";
const post = document.querySelector(".final-post");
const lines = [...document.querySelectorAll(".glitch-line")];
const notice = document.getElementById("system-notice");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function isErased() {
  try { return localStorage.getItem(storageKey) === "true"; }
  catch { return false; }
}
function rememberErasure() {
  try { localStorage.setItem(storageKey, "true"); }
  catch { /* Private browsing or disabled storage: current visit still empties. */ }
}
function emptyDiary() {
  post.classList.add("diary-empty");
  lines.forEach(line => line.classList.remove("flicker"));
  notice.classList.remove("visible");
}

if (post && notice) {
  if (isErased()) {
    emptyDiary();
  } else {
    (async () => {
      await wait(6500);
      for (const line of [...lines].reverse()) {
        if (!reduce) {
          line.classList.add("flicker");
          await wait(110);
          line.classList.remove("flicker");
        }
        line.classList.add("erased");
        await wait(reduce ? 80 : 360);
      }
      await wait(650);
      notice.classList.add("visible");
      await wait(reduce ? 500 : 2500);
      rememberErasure();
      emptyDiary();
    })();
  }
}
