"use strict";
function showRemoteDirectory(){
 const screen=document.getElementById("remoteConsole");
 const panel=document.getElementById("remoteDirectory");
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
  if(cmd==="STATUS"){let patched=false;try{patched=localStorage.getItem("omochabako_patch_v1")==="1";}catch{}print("SESSION: ACTIVE / セッション：稼働中\nACCESS LEVEL: "+(window.OmoAccess?OmoAccess.getLevel():0)+" / 管理権限\nINTERFACE: LOCAL / 接続：ローカル\nPATCH: "+(patched?"APPLIED / 適用済み":"NONE / 未適用"));return;}
  if(cmd==="PATCH"){try{localStorage.setItem("omochabako_patch_v1","1");}catch{}print("PATCH APPLIED / 変更を適用しました。\nRESTART REQUIRED / 反映には再起動が必要です。");return;}
  if(cmd==="DEVLEVEL"){if(!/^[0-4]$/.test(arg)){print("USAGE: DEVLEVEL [0-4] / テスト用権限を指定してください。");return;}print("ACCESS LEVEL: "+OmoAccess.setLevel(Number(arg))+" / テスト用権限を変更しました。");return;}
  if(cmd==="RESET"&&arg==="PATCH"){try{localStorage.removeItem("omochabako_patch_v1");}catch{}print("PATCH RESET / 変更を解除しました。\nRESTART REQUIRED / 反映には再起動が必要です。");return;}
  if(cmd==="RESTART"){window.location.href="../";return;}
  if(cmd==="CONNECT"){
   if(!arg){print("USAGE: CONNECT [DESTINATION] / 接続先を指定してください。");return;}
   if(arg==="GAME"||arg==="TOYBOX"){navigate("../");return;}
   if(arg==="ARCHIVE"){navigate("archive.html");return;}
   if(arg==="RECORD_001"||arg==="RECORD001"){navigate("../records/001.html");return;}
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

showRemoteDirectory();
