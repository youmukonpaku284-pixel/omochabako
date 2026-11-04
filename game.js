"use strict";
const TOTAL=10,TOYS=["🧸","🐰","🐻","🐱","🐼","🦊","🐣","🐸","🦄","🐶"];
const $=id=>document.getElementById(id);
const field=$("field"),target=$("target"),message=$("message"),result=$("result"),pop=$("pop");
let times=[],misses=0,active=false,started=false,waiting=null,shownAt=0,round=0,session=0;
let intervalMisses=0,secretPossible=true;
// After 3 hits: exactly 2 misses before hit 4; after 8 hits: exactly 4 before hit 9.
const SECRET_MISSES={3:2,8:4};
const random=(a,b)=>Math.random()*(b-a)+a;
function update(){ $("remaining").textContent=TOTAL-round;$("misses").textContent=misses;$("average").textContent=times.length?Math.round(times.reduce((a,b)=>a+b,0)/times.length):"—";}
function begin(){session++;clearTimeout(waiting);times=[];misses=0;round=0;intervalMisses=0;secretPossible=true;active=false;started=true;target.hidden=true;message.hidden=true;message.style.display="none";result.hidden=true;pop.hidden=true;update();schedule(session);}
function schedule(token){active=false;target.hidden=true;waiting=setTimeout(()=>{if(!started||token!==session)return;const size=target.offsetWidth||76;const x=random(8,Math.max(9,field.clientWidth-size-8));const y=random(20,Math.max(21,field.clientHeight-size-8));target.style.left=x+"px";target.style.top=y+"px";target.textContent=TOYS[Math.floor(Math.random()*TOYS.length)];target.hidden=false;shownAt=performance.now();active=true;},random(550,1350));}
function finish(){if(secretPossible){triggerSecret();return;}started=false;active=false;target.hidden=true;const total=times.reduce((a,b)=>a+b,0),avg=Math.round(total/times.length),best=Math.round(Math.min(...times));$("resultText").innerHTML="平均 <b>"+avg+" ms</b> ／ 最速 <b>"+best+" ms</b><br>合計 <b>"+Math.round(total)+" ms</b> ／ 空振り <b>"+misses+" 回</b>";result.hidden=false;message.style.display="flex";message.hidden=false;message.innerHTML='<span class="big">🎀</span><h2>10こぜんぶ、ぽんっ！</h2><p>結果は下を見てね♡</p>';}
target.addEventListener("pointerdown",e=>{e.stopPropagation();if(!active)return;const elapsed=performance.now()-shownAt;
const expected=SECRET_MISSES[round]??0;
if(intervalMisses!==expected)secretPossible=false;
intervalMisses=0;
active=false;times.push(elapsed);round++;target.hidden=true;pop.style.left=target.style.left;pop.style.top=target.style.top;pop.hidden=false;pop.getAnimations().forEach(a=>a.cancel());pop.animate([{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-25px)"}],{duration:400});setTimeout(()=>pop.hidden=true,400);update();if(round>=TOTAL)finish();else schedule(session);});
field.addEventListener("pointerdown",e=>{if(started&&e.target!==target){misses++;intervalMisses++;if(intervalMisses>(SECRET_MISSES[round]??0))secretPossible=false;update();}});
$("start").addEventListener("click",begin);$("retry").addEventListener("click",begin);
update();
// Prototype entry point: replace with an actual ranking/puzzle mechanism later.
$("nameForm").addEventListener("submit",event=>{event.preventDefault();const name=$("playerName").value.trim();if(!name)return;if(name.toUpperCase()==="TEST"){window.location.href="secret/";return;}$("nameStatus").textContent="登録ありがとう！ ランキングの公開機能は準備中だよ ♡";});

let eleventhWindow=false,eleventhTimer=null,eleventhLogTimer=null;
const bear=$("eleventhToy");
const TERMINAL_UNLOCK_KEY="omochabako_terminal_discovered_v1";
const terminalUnlocked=()=>{try{return localStorage.getItem(TERMINAL_UNLOCK_KEY)==="1";}catch{return false;}};
function saveTerminalUnlock(){try{localStorage.setItem(TERMINAL_UNLOCK_KEY,"1");}catch{}}
function updateBearAccess(){bear.tabIndex=(eleventhWindow||terminalUnlocked())?0:-1;bear.style.cursor=terminalUnlocked()?"pointer":"default";}
updateBearAccess();
function stopEleventh(){
 eleventhWindow=false;
 clearTimeout(eleventhTimer);
 clearTimeout(eleventhLogTimer);
 updateBearAccess();
}
function triggerSecret(){
 started=false;active=false;target.hidden=true;result.hidden=true;
 message.hidden=false;message.style.display="flex";
 field.classList.add("corrupted");
 message.innerHTML='<span class="terminal-title">10 / 10 COMPLETE</span><div class="terminal-log" id="terminalLog" role="status" aria-live="polite"></div>';
 const token=session;
 const log=$("terminalLog");
 // The 4-second window starts when 11 / 10 becomes visible.
 eleventhLogTimer=setTimeout(()=>{
   if(token!==session)return;
   const line=document.createElement("div");
   line.textContent="11 / 10";
   log.appendChild(line);
   eleventhWindow=true;
   updateBearAccess();
   eleventhTimer=setTimeout(()=>{
     if(token!==session||!eleventhWindow)return;
     stopEleventh();
     const error=document.createElement("div");
     error.textContent="ERROR: TARGET NOT FOUND";
     log.appendChild(error);
     setTimeout(()=>{
       if(token!==session)return;
       field.classList.remove("corrupted");
       secretPossible=false;
       finish();
     },1100);
   },4000);
 },950);
}
function handleBearAccess(event){
 if(!eleventhWindow&&!terminalUnlocked())return;
 event.preventDefault();
 if(eleventhWindow){acceptEleventh();return;}
 if(document.getElementById("remoteConsole"))return;
 session++;
 started=false;active=false;target.hidden=true;
 openRemoteConsole(session,true);
}
bear.addEventListener("pointerdown",handleBearAccess);
bear.addEventListener("click",event=>{if(event.detail===0)handleBearAccess(event);});
function acceptEleventh(){
 if(!eleventhWindow)return;
 stopEleventh();
 document.body.classList.add("site-breached");
 message.innerHTML='<span class="terminal-title">TARGET FOUND</span><div class="terminal-log" id="terminalLog" role="status" aria-live="polite"></div>';
 const log=$("terminalLog");
 const lines=["11 / 11","管理領域の整合性を確認中...","外部入力を検出しました。","接続を維持しています。"];
 const token=session;
 lines.forEach((line,i)=>setTimeout(()=>{
   if(token!==session)return;
   const el=document.createElement("div");
   el.textContent=line;
   log.appendChild(el);
 },(i+1)*900));
 setTimeout(()=>{if(token===session)openRemoteConsole(token);},5100);
}
const oldBegin=begin;
begin=function(){
 stopEleventh();
 document.body.classList.remove("site-breached");
 document.getElementById("remoteConsole")?.remove();
 field.classList.remove("corrupted");
 oldBegin();
};

function openRemoteConsole(token,skipIntro=false){
 if(token!==session)return;
 saveTerminalUnlock();
 updateBearAccess();
 const screen=document.createElement("section");
 screen.id="remoteConsole";
 screen.className="remote-console";
 screen.setAttribute("aria-label","接続されたコンソール");
 screen.innerHTML='<pre class="remote-logs" id="remoteLogs"></pre><div class="remote-directory" id="remoteDirectory" hidden></div>';
 document.body.appendChild(screen);
 requestAnimationFrame(()=>screen.classList.add("visible"));
 if(skipIntro){showRemoteDirectory(screen,token);return;}
 const log=document.getElementById("remoteLogs");
 const verbs=["init","exec","mount","read","write","verify","scan","bind","resolve","connect","sync","load","decode","handshake","route","open"];
 const paths=["/sys/core","/dev/tty0","/proc/session","/var/remote","/mnt/bridge","/usr/local/bin","/net/relay","/etc/runtime"];
 const randomHex=()=>Math.floor(Math.random()*0xffffffff).toString(16).padStart(8,"0");
 let lineNumber=0;
 const burst=setInterval(()=>{
  if(token!==session||!screen.isConnected){clearInterval(burst);return;}
  let chunk="";
  for(let i=0;i<8;i++){
   const verb=verbs[Math.floor(Math.random()*verbs.length)];
   const path=paths[Math.floor(Math.random()*paths.length)];
   chunk+="["+String(++lineNumber).padStart(5,"0")+"] $ "+verb+" "+path+" --id=0x"+randomHex()+"  "+(Math.random()>.17?"OK":"PENDING")+"\n";
  }
  log.textContent+=chunk;
  if(log.textContent.length>18000)log.textContent=log.textContent.slice(-13000);
  log.scrollTop=log.scrollHeight;
 },85);
 setTimeout(()=>{
  if(token!==session||!screen.isConnected)return;
  clearInterval(burst);
  showRemoteDirectory(screen,token);
 },4300);
}

function showRemoteDirectory(screen,token){
 if(token!==session||!screen.isConnected)return;
 screen.classList.add("remote-cut");
 const panel=$("remoteDirectory");
 panel.hidden=false;
 panel.replaceChildren();
 const history=document.createElement("div");
 history.className="terminal-history";
 panel.appendChild(history);
 const form=document.createElement("form");
 form.className="terminal-command-form";
 const label=document.createElement("label");
 label.className="terminal-prompt-label";
 const input=document.createElement("input");
 input.className="terminal-command-input";
 input.autocomplete="off";input.autocapitalize="off";input.spellcheck=false;
 input.setAttribute("aria-label","コマンドを入力");
 form.append(label,input);panel.appendChild(form);
 let cwd="C:\\",busy=false;
 const folders={
  "C:\\":{dirs:["ARCHIVE","SYSTEM"],files:[]},
  "C:\\ARCHIVE":{dirs:["BACKUP"],files:["INDEX.HTML","DIARY.LOG","SYSTEM.DAT"]},
  "C:\\ARCHIVE\\BACKUP":{dirs:[],files:["NOTICE.TXT"]},
  "C:\\SYSTEM":{dirs:[],files:["STATUS.LOG"]}
 };
 const documents={
  "C:\\ARCHIVE\\INDEX.HTML":"ARCHIVE INDEX / 保管領域の索引\nSTATUS: INCOMPLETE / 状態：未完成",
  "C:\\ARCHIVE\\DIARY.LOG":"DIARY RECORD / 日記記録\nSOURCE: UNKNOWN / 記録元：不明\nREAD ACCESS: LIMITED / 読み取り制限あり",
  "C:\\ARCHIVE\\SYSTEM.DAT":"ACCESS DENIED / アクセスが拒否されました。",
  "C:\\ARCHIVE\\BACKUP\\NOTICE.TXT":"BACKUP AVAILABLE / バックアップが存在します。\nORIGINAL NOT FOUND / 元データが見つかりません。",
  "C:\\SYSTEM\\STATUS.LOG":"SESSION ACTIVE / セッション稼働中\nLOCAL INTERFACE / ローカル接続"
 };
 function print(value=""){
  const line=document.createElement("div");
  line.textContent=value;
  history.appendChild(line);
  panel.scrollTop=panel.scrollHeight;
 }
 function updatePrompt(){label.textContent=cwd+">";}
 updatePrompt();
 print("REMOTE SESSION ESTABLISHED / リモートセッションが確立されました。");
 print("COMMAND INTERFACE READY / コマンド入力を受け付けています。");
 function execute(raw){
  const parts=raw.trim().split(/\s+/);
  const cmd=(parts.shift()||"").toUpperCase(),arg=parts.join(" ").toUpperCase();
  if(!cmd)return;
  print(cwd+"> "+raw);
  if(cmd==="CLS"||cmd==="CLEAR"){history.replaceChildren();return;}
  if(cmd==="HELP"){print("AVAILABLE COMMANDS / 利用可能なコマンド\nHELP  DIR  CD  TYPE  CLS  STATUS  CONNECT  RESTART");return;}
  if(cmd==="DIR"){
   const data=folders[cwd];print("Directory of "+cwd+" / ディレクトリ一覧");
   [...data.dirs.map(x=>"<DIR> "+x),...data.files].forEach(print);
   if(!data.dirs.length&&!data.files.length)print("(EMPTY) / ファイルなし");
   return;
  }
  if(cmd==="CD"){
   if(!arg){print(cwd);return;}
   const next=arg===".."?(cwd==="C:\\"?"C:\\":cwd.slice(0,cwd.lastIndexOf("\\"))||"C:\\"):arg==="\\"?"C:\\":(cwd==="C:\\"?cwd:cwd+"\\")+arg;
   if(folders[next]){cwd=next;updatePrompt();}else print("PATH NOT FOUND / 指定された場所が見つかりません。");
   return;
  }
  if(cmd==="TYPE"){
   if(!arg){print("USAGE: TYPE [FILE] / ファイル名を指定してください。");return;}
   const key=(cwd==="C:\\"?cwd:cwd+"\\")+arg;
   print(documents[key]||"FILE NOT FOUND / ファイルが見つかりません。");return;
  }
  if(cmd==="STATUS"){print("SESSION: ACTIVE / セッション：稼働中\nACCESS: LIMITED / 権限：制限あり\nINTERFACE: LOCAL / 接続：ローカル");return;}
  if(cmd==="RESTART"){window.location.href="./";return;}
  if(cmd==="CONNECT"){
   if(!arg){print("USAGE: CONNECT [DESTINATION] / 接続先を指定してください。");return;}
   if(arg==="GAME"||arg==="TOYBOX"){navigate("./");return;}
   if(arg==="ARCHIVE"){navigate("terminal/archive.html");return;}
   print("DESTINATION NOT FOUND / 接続先が見つかりません。");return;
  }
  print("UNKNOWN COMMAND / 不明なコマンドです。");
 }
 function navigate(url){
  if(busy)return;busy=true;input.disabled=true;
  print("CONNECTING... / 接続しています...");
  setTimeout(()=>{if(screen.isConnected)window.location.href=url;},1100);
 }
 form.addEventListener("submit",event=>{
  event.preventDefault();
  if(busy)return;
  const raw=input.value;input.value="";
  execute(raw);
 });
 input.focus();
}
