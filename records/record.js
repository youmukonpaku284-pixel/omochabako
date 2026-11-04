"use strict";
const button=document.getElementById("readButton");
const image=document.getElementById("recordImage");
const page=document.querySelector(".record");
const content=document.getElementById("recordContent");
const warning=document.getElementById("warning");
const blackout=document.getElementById("blackout");
button.addEventListener("click",()=>{
 button.disabled=true;
 if(window.OmoAccess&&OmoAccess.canAccess(1)){
  content.innerHTML='<h1>RECORD_001</h1><p>DESCRIPTION: AVAILABLE / 説明文：閲覧可能</p><p>この絵は、サイトが最初に公開された日に保存されたものです。</p><p>管理人は、すべてのおもちゃに名前を付けるつもりだったようです。<br>ただし、一つだけ名前が記録されていません。</p><p>ENTRY STATUS: INCOMPLETE / 記録状態：未完了</p><p class="return"><a href="../terminal/">RETURN TO TERMINAL / 管理端末に戻る</a></p>';
  return;
 }
 button.textContent="READING... / 読み込み中...";
 setTimeout(()=>{
  image.src="corrupted.svg";
  image.alt="赤黒く破損したクレヨン画";
  page.classList.add("broken");
 },850);
 setTimeout(()=>{content.hidden=true;warning.hidden=false;warning.textContent="くるべきじゃない";},1500);
 setTimeout(()=>{blackout.hidden=false;},3000);
 setTimeout(()=>{window.location.replace("../");},3900);
});
