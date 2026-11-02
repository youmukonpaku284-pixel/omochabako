"use strict";
// Visual-only horror effect. Does not delete files or user data.
const lines=[...document.querySelectorAll(".glitch-line")];
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{await wait(6500);for(const line of [...lines].reverse()){if(!reduce){line.classList.add("flicker");await wait(110);line.classList.remove("flicker");}line.classList.add("erased");await wait(reduce?80:360);}await wait(650);document.getElementById("system-notice").classList.add("visible");})();