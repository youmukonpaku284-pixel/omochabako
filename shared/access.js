"use strict";
(function(g){
 const KEY="omochabako_access_level_v1";
 const MAX=4;
 function getLevel(){try{const n=Number(localStorage.getItem(KEY)||0);return Number.isInteger(n)?Math.max(0,Math.min(MAX,n)):0;}catch{return 0;}}
 function setLevel(value){const n=Math.max(0,Math.min(MAX,Math.trunc(Number(value)||0)));try{localStorage.setItem(KEY,String(n));}catch{}return n;}
 function canAccess(level){return getLevel()>=level;}
 g.OmoAccess=Object.freeze({getLevel,setLevel,canAccess,KEY});
})(window);
