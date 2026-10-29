const plan = [
 {n:1,km:"24–27 km",sessions:[["Easy run","7 km easy"],["Quality run","6 × 2 min comfortably hard; 2 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","12 km easy"],["Optional run","5 km easy (optional)"]]},
 {n:2,km:"26–29 km",sessions:[["Easy run","7–8 km easy"],["Quality run","3 × 6 min tempo; 2 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","13 km easy"],["Optional run","5–6 km easy (optional)"]]},
 {n:3,km:"28–31 km",sessions:[["Easy run","8 km easy"],["Quality run","5 × 3 min tempo; 2 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","14 km easy"],["Optional run","5–6 km easy (optional)"]]},
 {n:4,km:"23–26 km",sessions:[["Easy run","7 km easy"],["Easy run + strides","6–7 km easy, with 4–6 relaxed strides"],["Strength","30–45 min, moderate effort"],["Long run","11 km easy"],["Optional run","5 km easy (optional)"]]},
 {n:5,km:"29–32 km",sessions:[["Easy run","8 km easy"],["Quality run","3 × 8 min tempo; 2 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","15 km · 11 km easy + 4 km steady (5:05–5:20/km)"],["Optional run","5–6 km easy (optional)"]]},
 {n:6,km:"31–34 km",sessions:[["Easy run","8 km easy"],["Intervals","5 × 1 km at controlled 10 km effort; 2 min jog recovery"],["Strength","30–45 min, moderate effort"],["Long run","16 km easy"],["Optional run","6 km easy (optional)"]]},
 {n:7,km:"33–36 km",sessions:[["Easy run","8 km easy"],["Tempo run","2 × 15 min tempo; 3 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","17 km · 12 km easy + 3 × 1 km at HM pace, with 500 m easy between"],["Optional run","6 km easy (optional)"]]},
 {n:8,km:"27–30 km",sessions:[["Easy run","7 km easy"],["Easy run + strides","7 km relaxed, including 6 strides"],["Strength","30–45 min, moderate effort"],["Long run","13 km easy"],["Optional run","5 km easy (optional)"]]},
 {n:9,km:"34–38 km",sessions:[["Easy run","8 km easy"],["Goal-pace intervals","3 × 2 km at 4:40–4:45/km; 3 min jog recovery"],["Strength","30–45 min, moderate effort"],["Long run","18 km · 12 km easy + 2 × 2 km at HM pace, with 1 km easy between"],["Optional run","6 km easy (optional)"]]},
 {n:10,km:"36–40 km",sessions:[["Easy run","8 km easy"],["Goal-pace intervals","2 × 3 km at 4:40–4:45/km; 4 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","19 km · 14 km easy + 3 km at HM pace + 2 km easy"],["Optional run","6–7 km easy (optional)"]]},
 {n:11,km:"38–42 km",sessions:[["Easy run","8–9 km easy"],["Goal-pace intervals","3 × 2 km at goal half-marathon pace; 3 min jog recovery"],["Strength","30–45 min, lighter if fatigued"],["Long run","17 km · 4 km easy + 2 × 3 km at HM pace, with 1 km easy between + 6 km easy"],["Optional run","6 km easy (optional)"]]},
 {n:12,km:"32–36 km",sessions:[["Easy run","8 km easy"],["Goal-pace intervals","2 × 3 km at goal half-marathon pace; 4 min easy between"],["Strength","30–45 min, moderate effort"],["Long run","16 km · 11 km easy + 3 km at HM pace + 2 km easy"],["Optional run","5–6 km easy (optional)"]]},
 {n:13,km:"25–30 km",sessions:[["Easy run","7 km easy"],["Goal-pace intervals","3 × 1 km at goal pace; 2–3 min jog recovery"],["Strength","Light session, avoid soreness"],["Long run","13–14 km easy"],["Optional run","5 km easy (optional)"]]},
 {n:14,km:"Race week",sessions:[["Easy run","6–7 km easy"],["Race-pace tune-up","5–6 km including 3 × 2 min at goal pace early in the week"],["Strength","Optional light mobility only"],["Race day","Half marathon · 21.1 km · Sunday 7 February"],["Optional run","4–5 km very easy early in the week (optional)"]]}
];
const START = new Date(2026,10,2); // Monday of week 1
function weekDates(w){
 const a=new Date(START); a.setDate(a.getDate()+(w.n-1)*7);
 const b=new Date(a); b.setDate(b.getDate()+6);
 const m=d=>d.toLocaleDateString("en-GB",{month:"short"});
 return a.getMonth()===b.getMonth()?`${a.getDate()}–${b.getDate()} ${m(b)}`:`${a.getDate()} ${m(a)}–${b.getDate()} ${m(b)}`;
}
const RACE = new Date(2027,1,7);
function renderDaysLeft(){
 const now=new Date(), days=Math.round((RACE-new Date(now.getFullYear(),now.getMonth(),now.getDate()))/864e5);
 document.getElementById("daysLeft").textContent=days>1?`${days} days`:days===1?"1 day":days===0?"Today!":"";
}
const KEY = "halfMarathonPlanProgress_v1";
let progress = loadProgress();
function loadProgress(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { return {}; } }
function save(){ localStorage.setItem(KEY, JSON.stringify(progress)); renderProgress(); }
function weekDone(w){ return w.sessions.filter((s,i)=>progress[w.n+"-"+i]).length === w.sessions.length; }
function currentWeek(){ return plan.find(w=>!weekDone(w)); }
let openWeeks = new Set(); // weeks opened by hand on the Training tab
function syncWeek(w){
 const card=document.getElementById("week-"+w.n); if(!card)return;
 card.classList.toggle("open",openWeeks.has(w.n)); card.classList.toggle("current",w===currentWeek());
 card.querySelector(".week-head").setAttribute("aria-expanded",openWeeks.has(w.n));
}
function setOpen(w,open){ if(open) openWeeks.add(w.n); else openWeeks.delete(w.n); syncWeek(w); }
function longRun(w){
 const [name,detail]=w.sessions.find(s=>s[0]==="Long run"||s[0]==="Race day");
 return `${name==="Race day"?"Race":"Long run"} ${detail.match(/(\d[\d.–]*) km/)[1]} km`;
}
// Builds a week card; the focus copy (Week tab) is always open and has no toggle
function weekCard(w,focus){
 const card=document.createElement("section"); card.className="week"+(focus?" focus open":""); card.dataset.week=w.n;
 if(!focus) card.id="week-"+w.n;
 const head=document.createElement(focus?"div":"button"); head.className="week-head";
 const title=document.createElement("div"); title.style.flex="1";
 title.innerHTML=`<h3>Week ${w.n}</h3><div class="week-date"><span>${weekDates(w)}</span> · <span>${w.km}</span><span class="long">${longRun(w)}</span></div>`;
 const count=document.createElement("div"); count.className="week-count";
 head.append(title,count); card.append(head);
 if(!focus){
   const chev=document.createElement("span"); chev.className="chev"; chev.setAttribute("aria-hidden","true");
   chev.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
   head.append(chev); head.addEventListener("click",()=>setOpen(w,!openWeeks.has(w.n)));
 }
 const body=document.createElement("div"); body.className="week-body";
 w.sessions.forEach((s,i)=>{
   const key=w.n+"-"+i, row=document.createElement("div"); row.className="day";
   const cb=document.createElement("input"); cb.type="checkbox"; cb.id=(focus?"focus-":"session-")+key;
   cb.setAttribute("aria-label",s[0]+" completed");
   const label=document.createElement("label"); label.htmlFor=cb.id;
   const name=document.createElement("span"); name.className="day-name"; name.textContent=s[0];
   const detail=document.createElement("span"); detail.className="day-detail"; detail.textContent=s[1];
   const feel=document.createElement("button"); feel.className="feel"; feel.dataset.key=key;
   feel.addEventListener("click",()=>askFeeling(key,s[0]));
   label.append(name,detail);
   if(s[0]==="Strength"&&w.n<plan.length){
     const links=document.createElement("span"); links.className="day-links";
     links.innerHTML=`<button type="button">Home timer</button><button type="button">Gym list</button>`;
     const [home,gym]=links.children;
     home.addEventListener("click",e=>{ e.preventDefault(); openWorkout(key); });
     gym.addEventListener("click",e=>{ e.preventDefault(); gymDialog.showModal(); });
     label.append(links);
   }
   row.append(cb,label,feel); body.append(row);
   cb.addEventListener("change",()=>{
     if(cb.checked) progress[key]=true; else { delete progress[key]; delete feelings[key]; saveFeelings(); }
     save(); updateWeek(w);
     if(cb.checked) askFeeling(key,s[0]);
   });
 });
 card.append(body);
 const actions=document.createElement("div"); actions.className="week-actions";
 const btn=document.createElement("button"); btn.className="small"; btn.textContent="Mark week complete";
 btn.addEventListener("click",()=>{ const all=weekDone(w); w.sessions.forEach((s,i)=>{const k=w.n+"-"+i;if(all){ delete progress[k]; delete feelings[k]; } else progress[k]=true;}); save(); saveFeelings(); render(); });
 actions.append(btn); card.append(actions);
 return card;
}
function render(){
 const root=document.getElementById("weeks");
 root.innerHTML="";
 plan.forEach(w=>{ root.append(weekCard(w)); updateWeek(w); syncWeek(w); });
 renderFocus(true);
 renderProgress();
}
// Week tab: only the current week; swaps to the next one once it is complete
let focusWeek=null;
function renderFocus(force){
 const w=currentWeek(), root=document.getElementById("focus");
 if(!force && w===focusWeek) return;
 focusWeek=w; root.innerHTML="";
 if(w){ root.append(weekCard(w,true)); updateWeek(w); }
 else root.innerHTML=`<section class="week all-done"><h3>All 14 weeks done</h3><p class="muted">Rest up. Race day is Sunday 7 February.</p></section>`;
}
// Keeps every copy of a week (Training and Week tabs) in step with the saved data
function updateWeek(w){
 const n=w.sessions.filter((s,i)=>progress[w.n+"-"+i]).length;
 document.querySelectorAll(`.week[data-week="${w.n}"]`).forEach(card=>{
   card.querySelector(".week-count").textContent=n===w.sessions.length?"Done":`${n}/${w.sessions.length}`;
   card.classList.toggle("complete",n===w.sessions.length);
   card.querySelectorAll(".day").forEach((row,i)=>{
     const on=!!progress[w.n+"-"+i]; row.querySelector("input").checked=on; row.classList.toggle("done",on);
     paintFeel(row.querySelector(".feel"),w.n+"-"+i);
   });
 });
}
function renderProgress(){
 const total=plan.reduce((a,w)=>a+w.sessions.length,0);
 const done=Object.keys(progress).filter(k=>progress[k]).length;
 const weeks=plan.filter(weekDone).length;
 document.getElementById("overallText").textContent=`${weeks} / ${plan.length} weeks`;
 renderFeelChart();
 plan.forEach(syncWeek);
 renderFocus();
 document.getElementById("workoutText").textContent=`${done} of ${total} sessions`;
 renderDots(weeks);
}
function renderDots(weeks){
 const cur=currentWeek();
 document.querySelectorAll(".dots-text").forEach(t=>t.textContent=`${weeks} / ${plan.length}`);
 document.querySelectorAll(".dots").forEach(root=>{
   root.innerHTML="";
   plan.forEach(w=>{
     const dot=document.createElement("button"); dot.className="dot";
     dot.classList.toggle("done",weekDone(w)); dot.classList.toggle("current",w===cur);
     dot.setAttribute("aria-label",`Week ${w.n}${weekDone(w)?" (completed)":""}`);
     dot.addEventListener("click",()=>goToWeek(w));
     root.append(dot);
   });
 });
}
// Opens a week on the Training tab and scrolls to it
let scrollTarget=null;
function goToWeek(w){
 setOpen(w,true);
 if(location.hash==="#training") document.getElementById("week-"+w.n).scrollIntoView({behavior:"smooth",block:"start"});
 else { scrollTarget=w.n; location.hash="training"; }
}
const FEEL_KEY = "halfMarathonFeelings_v1";
const FEELS = {
 good:{label:"Strong",mouth:"M8 14.5c1 1.3 2.3 2 4 2s3-.7 4-2"},
 meh:{label:"Meh",mouth:"M8.5 15.5h7"},
 bad:{label:"Struggling",mouth:"M8 16.5c1-1.3 2.3-2 4-2s3 .7 4 2"}
};
function face(f){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.1" fill="currentColor" stroke="none"/><path d="${f?FEELS[f].mouth:"M12 15.5h0"}"/></svg>`; }
let feelings = loadFeelings();
function loadFeelings(){ try { const f=JSON.parse(localStorage.getItem(FEEL_KEY)); return f&&typeof f==="object"?f:{}; } catch(e) { return {}; } }
function saveFeelings(){ localStorage.setItem(FEEL_KEY, JSON.stringify(feelings)); renderFeelChart(); }
function renderRowFeel(key){ document.querySelectorAll(`.feel[data-key="${key}"]`).forEach(b=>paintFeel(b,key)); }
function paintFeel(b,key){
 const f=feelings[key];
 if(f) b.dataset.feel=f; else delete b.dataset.feel;
 b.innerHTML=f?face(f):`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 8v8M8 12h8"/></svg>`;
 b.setAttribute("aria-label",f?`Felt ${FEELS[f].label.toLowerCase()}. Change`:"Add how it felt");
}
const feelDialog=document.getElementById("feelDialog");
let pendingFeel=null;
Object.keys(FEELS).forEach(f=>{
 const b=document.createElement("button"); b.type="button";
 b.innerHTML=`<span class="face" style="background:var(--${f})">${face(f)}</span>${FEELS[f].label}`;
 b.addEventListener("click",()=>{ feelings[pendingFeel]=f; saveFeelings(); renderRowFeel(pendingFeel); feelDialog.close(); });
 document.getElementById("feelOptions").append(b);
});
document.getElementById("feelSkip").addEventListener("click",()=>feelDialog.close());
feelDialog.addEventListener("click",e=>{ if(e.target===feelDialog) feelDialog.close(); });
function askFeeling(key,name){
 pendingFeel=key; document.getElementById("feelSession").textContent=name;
 if(!feelDialog.open) feelDialog.showModal();
}
function renderFeelChart(){
 const root=document.getElementById("feelChart"), counts={good:0,meh:0,bad:0};
 root.innerHTML="";
 plan.forEach(w=>{
   const done=w.sessions.map((s,j)=>w.n+"-"+j).filter(k=>progress[k]);
   const col=document.createElement("div"); col.className="col";
   w.sessions.forEach((s,j)=>{
     const seg=document.createElement("div"), k=done[j], f=k&&feelings[k];
     seg.className="seg"+(k?" "+(f||"unrated"):"");
     if(f){ seg.innerHTML=face(f); counts[f]++; }
     else if(k) seg.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 12.5 3 3 6-6.5"/></svg>`;
     col.append(seg);
   });
   root.append(col);
 });
 document.getElementById("feelLegend").innerHTML=Object.keys(FEELS).map(f=>`<span title="${FEELS[f].label}"><i style="background:var(--${f})">${face(f)}</i>${counts[f]}</span>`).join("");
}
const TEMPO_KEY = "halfMarathonTempo_v1";
let tempo = loadTempo();
function loadTempo(){ try { const t=JSON.parse(localStorage.getItem(TEMPO_KEY)); return Array.isArray(t)?t:[]; } catch(e) { return []; } }
function saveTempo(){ tempo.sort((a,b)=>b.date.localeCompare(a.date)); localStorage.setItem(TEMPO_KEY, JSON.stringify(tempo)); renderTempo(); }
function parsePace(v){ const m=v.trim().match(/^(\d{1,2})[:.,'](\d{2})$/); if(!m||+m[2]>59)return null; const s=+m[1]*60+ +m[2]; return s>=150&&s<600?s:null; }
function fmtPace(s){ return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function fmtDay(iso){ const [y,m,d]=iso.split("-"); return new Date(y,m-1,d).toLocaleDateString("en-GB",{day:"numeric",month:"short"}); }
function today(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function renderTempo(){
 const [latest,prev]=tempo, delta=document.getElementById("tempoDelta");
 document.getElementById("tempoNow").textContent=latest?fmtPace(latest.sec):"–:––";
 const diff=latest&&prev?latest.sec-prev.sec:null;
 delta.textContent=diff===null?"":diff===0?"Same as last":`${diff<0?"−":"+"}${Math.abs(diff)}s vs last`;
 delta.classList.toggle("faster",diff<0);
 const list=document.getElementById("tempoLog"); list.innerHTML="";
 tempo.forEach(t=>{
   const li=document.createElement("li");
   const when=document.createElement("span"); when.className="when"; when.textContent=fmtDay(t.date);
   const pace=document.createElement("span"); pace.className="pace"; pace.textContent=fmtPace(t.sec)+"/km";
   const del=document.createElement("button"); del.textContent="×"; del.setAttribute("aria-label","Delete "+fmtDay(t.date)+" entry");
   del.addEventListener("click",()=>{ tempo=tempo.filter(x=>x!==t); saveTempo(); });
   li.append(when,pace,del); list.append(li);
 });
}
document.getElementById("tempoDate").value=today();
document.getElementById("tempoPace").addEventListener("input",e=>e.target.setCustomValidity(""));
document.getElementById("tempoForm").addEventListener("submit",e=>{
 e.preventDefault();
 const input=document.getElementById("tempoPace"), sec=parsePace(input.value);
 if(!sec){ input.setCustomValidity("Enter a pace like 4:45"); input.reportValidity(); return; }
 tempo.push({date:document.getElementById("tempoDate").value||today(),sec}); saveTempo();
 input.value=""; input.blur();
});
// Home / Gym tabs in the strength card
const strengthTabs=[...document.querySelectorAll(".strength [role=tab]")];
function selectStrength(tab){
 strengthTabs.forEach(t=>{ const on=t===tab; t.setAttribute("aria-selected",on); t.tabIndex=on?0:-1; document.getElementById(t.getAttribute("aria-controls")).hidden=!on; });
}
strengthTabs.forEach((t,i)=>{
 t.addEventListener("click",()=>selectStrength(t));
 t.addEventListener("keydown",e=>{ if(e.key!=="ArrowLeft"&&e.key!=="ArrowRight")return; const next=strengthTabs[(i+(e.key==="ArrowRight"?1:-1)+strengthTabs.length)%strengthTabs.length]; selectStrength(next); next.focus(); });
});
// Home strength timer: 1 min per exercise, 15 s rest between, read from the Home list in the strength card
const WORK=60, REST=15;
const homeExercises=[...document.querySelectorAll("#panel-home li")].map(li=>li.textContent);
const gymDialog=document.getElementById("gymDialog");
document.getElementById("gymList").innerHTML=document.querySelector("#panel-gym ol").innerHTML;
document.getElementById("gymClose").addEventListener("click",()=>gymDialog.close());
gymDialog.addEventListener("click",e=>{ if(e.target===gymDialog) gymDialog.close(); });
const $=id=>document.getElementById(id);
const RING=2*Math.PI*54;
let rounds=3, wk=null, wkKey=null, wkReturn="#week", wkTimer=null, wakeLock=null, audio=null;
$("wkList").innerHTML=homeExercises.map(n=>`<li>${n}</li>`).join("");
function setRounds(n){
 rounds=n;
 document.querySelectorAll("#wkRounds button").forEach(b=>b.setAttribute("aria-checked",+b.dataset.rounds===n));
 $("wkLength").textContent=`${homeExercises.length} exercises × ${n} = about ${Math.round(n*(homeExercises.length*(WORK+REST))/60)} min`;
}
document.querySelectorAll("#wkRounds button").forEach(b=>b.addEventListener("click",()=>setRounds(+b.dataset.rounds)));
setRounds(3);
function wkScreen(name){ ["wkIntro","wkRun","wkDone"].forEach(id=>$(id).hidden=id!==name); }
function openWorkout(key){
 wkKey=key||null; wkReturn=location.hash&&location.hash!=="#workout"?location.hash:"#week";
 if(!wk) { wkScreen("wkIntro"); $("wkStatus").textContent="Home workout"; }
 location.hash="workout";
}
document.querySelectorAll("[data-start-workout]").forEach(b=>b.addEventListener("click",()=>openWorkout()));
function strengthKey(){
 if(wkKey) return wkKey;
 const w=currentWeek(); if(!w) return null;
 return w.n+"-"+w.sessions.findIndex(s=>s[0]==="Strength");
}
function beep(freq=880,len=.12){
 if(!audio) return;
 const o=audio.createOscillator(), g=audio.createGain(), t=audio.currentTime;
 o.frequency.value=freq; g.gain.setValueAtTime(.25,t); g.gain.exponentialRampToValueAtTime(.001,t+len);
 o.connect(g).connect(audio.destination); o.start(t); o.stop(t+len);
}
async function keepAwake(on){
 try { if(on&&!wakeLock&&"wakeLock" in navigator) wakeLock=await navigator.wakeLock.request("screen"); else if(!on&&wakeLock){ await wakeLock.release(); wakeLock=null; } } catch(e) { wakeLock=null; }
}
document.addEventListener("visibilitychange",()=>{ wakeLock=null; if(document.visibilityState==="visible"&&wk&&!wk.paused) keepAwake(true); });
$("wkStart").addEventListener("click",()=>{
 try { audio=audio||new (window.AudioContext||window.webkitAudioContext)(); audio.resume(); } catch(e) {}
 const steps=[];
 for(let r=0;r<rounds;r++) homeExercises.forEach((name,j)=>{
   steps.push({type:"work",name,sec:WORK,r,j});
   steps.push({type:"rest",name:homeExercises[(j+1)%homeExercises.length],sec:REST});
 });
 steps.pop(); // no rest after the last exercise
 wk={steps,i:0,endsAt:Date.now()+WORK*1000,paused:false,remaining:0,last:null};
 wkScreen("wkRun"); $("wkPause").textContent="Pause"; beep(1046,.25); keepAwake(true); runTimer();
});
function runTimer(){ clearInterval(wkTimer); wkTimer=setInterval(tick,200); tick(); }
function tick(){
 if(!wk||wk.paused) return;
 let left=wk.endsAt-Date.now();
 while(left<=0){ // move on, catching up if the phone slept
   wk.i++;
   if(wk.i>=wk.steps.length) return endWorkout(true);
   wk.endsAt+=wk.steps[wk.i].sec*1000; left=wk.endsAt-Date.now();
   beep(wk.steps[wk.i].type==="work"?1046:660,.25); if(navigator.vibrate) navigator.vibrate(200);
 }
 drawStep(left);
}
function drawStep(left){
 const step=wk.steps[wk.i], secs=Math.ceil(left/1000), exNo=wk.steps.slice(0,wk.i+1).filter(x=>x.type==="work").length;
 if(secs!==wk.last&&secs<=3&&secs>0&&wk.last!==null) beep(); wk.last=secs;
 $("wkTime").textContent=fmtPace(secs);
 $("wkBar").style.strokeDashoffset=RING*(1-left/(step.sec*1000));
 $("wkRun").dataset.phase=step.type;
 $("wkPhase").textContent=step.type==="work"?"Exercise":"Rest";
 $("wkName").textContent=step.type==="work"?step.name:"Rest";
 $("wkNext").textContent=step.type==="work"?(wk.steps[wk.i+2]?`Next: ${wk.steps[wk.i+2].name}`:"Last one"):`Next: ${step.name}`;
 $("wkStatus").textContent=`${exNo} / ${homeExercises.length*rounds}${rounds>1?` · Round ${Math.floor((exNo-1)/homeExercises.length)+1} of ${rounds}`:""}`;
}
function pauseWorkout(){
 if(!wk||wk.paused) return;
 wk.paused=true; wk.remaining=wk.endsAt-Date.now(); clearInterval(wkTimer); keepAwake(false);
 $("wkPause").textContent="Resume"; $("wkRun").classList.add("paused");
}
$("wkPause").addEventListener("click",()=>{
 if(!wk) return;
 if(wk.paused){ wk.paused=false; wk.endsAt=Date.now()+wk.remaining; $("wkPause").textContent="Pause"; $("wkRun").classList.remove("paused"); keepAwake(true); runTimer(); }
 else pauseWorkout();
});
$("wkFinish").addEventListener("click",()=>{ pauseWorkout(); if(confirm("Finish the workout now?")) endWorkout(false); });
function endWorkout(complete){
 const done=wk.steps.slice(0,wk.i).filter(x=>x.type==="work").length; // exercises fully finished
 clearInterval(wkTimer); keepAwake(false); wk=null;
 if(complete) beep(1318,.4);
 $("wkDoneTitle").textContent=complete?"Workout done":"Workout ended";
 $("wkSummary").textContent=`${done} of ${homeExercises.length*rounds} exercises completed`;
 $("wkStatus").textContent="Home workout";
 const key=strengthKey(), btn=$("wkMark");
 btn.hidden=!key; btn.disabled=!!(key&&progress[key]);
 if(key) btn.textContent=progress[key]?"Strength already marked done":`Mark week ${key.split("-")[0]} strength done`;
 wkScreen("wkDone");
}
$("wkMark").addEventListener("click",()=>{
 const key=strengthKey(); if(!key) return;
 const w=plan[+key.split("-")[0]-1];
 progress[key]=true; save(); updateWeek(w);
 location.hash=wkReturn.slice(1); wkScreen("wkIntro"); askFeeling(key,"Strength");
});
$("wkBack").addEventListener("click",()=>{ wkScreen("wkIntro"); location.hash=wkReturn.slice(1); });
$("wkClose").addEventListener("click",()=>{
 if(wk){ pauseWorkout(); if(!confirm("Leave the workout? Your progress in it will be lost.")){ return; } clearInterval(wkTimer); wk=null; }
 wkScreen("wkIntro"); location.hash=wkReturn.slice(1);
});
const views={week:"Week",training:"Training",goal:"Goal",workout:"Workout"};
function showView(){
 const name=views[location.hash.slice(1)]?location.hash.slice(1):"week";
 Object.keys(views).forEach(v=>document.getElementById("view-"+v).hidden=v!==name);
 document.querySelectorAll(".tabbar a").forEach(a=>{ if(a.dataset.view===name) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
 document.body.classList.toggle("workout-mode",name==="workout");
 if(name!=="workout") { document.querySelector(".tabbar").style.setProperty("--tab",Object.keys(views).indexOf(name)); pauseWorkout(); }
 window.scrollTo(0,0);
 if(scrollTarget&&name==="training") document.getElementById("week-"+scrollTarget).scrollIntoView({block:"start"});
 scrollTarget=null;
}
window.addEventListener("hashchange",showView);
document.getElementById("exportBtn").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify({version:3,progress,feelings,tempo},null,2)],{type:"application/json"});
 const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="half-marathon-progress.json"; a.click(); URL.revokeObjectURL(a.href);
});
document.getElementById("importBtn").addEventListener("click",()=>document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change",async e=>{
 const file=e.target.files[0]; if(!file)return;
 try { const data=JSON.parse(await file.text()); const incoming=data.progress||data; if(!incoming||typeof incoming!=="object")throw Error(); progress=incoming; feelings=data.feelings&&typeof data.feelings==="object"?data.feelings:{}; saveFeelings(); save(); if(Array.isArray(data.tempo)){ tempo=data.tempo; saveTempo(); } openWeeks=new Set(); render(); alert("Progress imported."); }
 catch(err){alert("That file could not be imported.");} e.target.value="";
});
document.getElementById("resetBtn").addEventListener("click",()=>{
 if(confirm("Reset all completed sessions and feelings? This cannot be undone unless you exported a backup.")){progress={};feelings={};saveFeelings();save();openWeeks=new Set();render();}
});
renderDaysLeft();
render();
renderTempo();
showView();
setTimeout(()=>document.querySelector(".tabbar").classList.add("ready"),100); // slide the tab highlight on changes, not on first load
if("serviceWorker" in navigator && location.protocol.startsWith("http")) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
