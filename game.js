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

function triggerSecret(){
 started=false;active=false;target.hidden=true;result.hidden=true;message.hidden=false;message.style.display="flex";
 field.classList.add("corrupted");
 message.innerHTML='<span class="terminal-title">10 / 10 COMPLETE</span><div class="terminal-log" id="terminalLog" role="status" aria-live="polite">照合中...</div>';
 const log=$("terminalLog");
 const steps=["認証パターンが一致しました。","11 / 10","次のおもちゃを準備しています。","ERROR: TARGET NOT FOUND","観測者を確認しました。","あなたは、どうしてその操作を知っているのですか？"];
 const token=session;let index=0;
 const next=()=>{if(token!==session||index>=steps.length)return;const line=document.createElement("div");line.textContent=steps[index++];log.appendChild(line);setTimeout(next,index===2?1100:850);};
 setTimeout(next,1200);
}
const oldBegin=begin;
begin=function(){field.classList.remove("corrupted");oldBegin();};
