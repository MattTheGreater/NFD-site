(function(){
"use strict";
var root=document.documentElement;

/* theme */
var btn=document.getElementById("themeBtn");
function sysDark(){return window.matchMedia&&window.matchMedia("(prefers-color-scheme:dark)").matches;}
try{var s=localStorage.getItem("nfd-theme"); if(s==="dark"||s==="light") root.setAttribute("data-theme",s);}catch(e){}
if(btn){btn.addEventListener("click",function(){
  var cur=root.getAttribute("data-theme");
  var next=(cur?cur==="dark":sysDark())?"light":"dark";
  root.setAttribute("data-theme",next);
  try{localStorage.setItem("nfd-theme",next);}catch(e){}
});}

/* year */
Array.prototype.forEach.call(document.querySelectorAll(".yr"),function(el){el.textContent=new Date().getFullYear();});

/* copy email */
var copyBtn=document.getElementById("copyEmail"), emailEl=document.getElementById("orgEmail");
if(copyBtn&&emailEl){copyBtn.addEventListener("click",function(){
  var t=emailEl.textContent.trim();
  function done(){copyBtn.textContent="Copied";setTimeout(function(){copyBtn.textContent="Copy";},1600);}
  function sel(){var r=document.createRange();r.selectNodeContents(emailEl);var g=window.getSelection();g.removeAllRanges();g.addRange(r);done();}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done).catch(sel);}else{sel();}
});}

/* join form (front-end only) */
var form=document.getElementById("joinForm"), msg=document.getElementById("formMsg");
if(form&&msg){form.addEventListener("submit",function(ev){
  ev.preventDefault();
  var name=(document.getElementById("f-name").value||"").trim();
  var email=(document.getElementById("f-email").value||"").trim();
  if(!email){msg.style.color="var(--accent)";msg.textContent="Please add an email so we can reply.";return;}
  msg.style.color="var(--muted)";
  msg.textContent=(name?name.split(" ")[0]+", ":"")+"thank you — copy your note and email it to us at "+(emailEl?emailEl.textContent.trim():"our address")+" and we’ll reply personally.";
});}

/* ---------- geographic state map ---------- */
var mapBox=document.getElementById("mapsvg-host");
if(mapBox&&window.US_MAP){
  var MODEL={SD:1,MS:1};
  var FOCUS={TX:1,SD:1,IA:1,WV:1,OK:1};
  var DATA={
    TX:{
      noFault:"Tex. Fam. Code § 6.001 — “insupportability.” A court may grant divorce without regard to fault on the petition of either party, making Texas a unilateral no-fault state.",
      constProhibition:"Tex. Const. art. III, § 56 bars special or local laws “granting divorces.” This anchors the argument that no-fault reduces the court to a legislative, rubber-stamping role.",
      particular:"Lead jurisdiction for our constitutional challenge (Morgan v. Morgan, Dallas County). The Texas GOP Platform (Item 211) targets unilateral no-fault and has elevated it to a legislative priority.",
      history:"No-fault “insupportability” adopted in the 1969–70 era and still governs. Repeal and reform bills have been introduced in recent sessions; the Senate took interim testimony on no-fault in 2026.",
      billLink:"bills.html"},
    OK:{
      noFault:"43 O.S. § 101(7) — “incompatibility.” One spouse’s allegation suffices; courts recognize no defense to the ground.",
      constProhibition:"",
      particular:"Site of Aikins v. Aikins — a facial constitutional challenge to § 101(7) litigated through the Court of Civil Appeals (2024–2026). See the Cases page.",
      history:"Challenge rejected on appeal Nov. 3, 2025 (Okla. Civ. App. Div. IV, not for official publication); rehearing denied Jan. 5, 2026. The appellate record and briefing now frame the question for other courts.",
      billLink:"bills.html"},
    SD:{
      noFault:"S.D. Codified Laws § 25-4-17.2 — a no-fault (irreconcilable-differences) divorce requires the consent of both parties, or the other spouse’s default. One of two states that already require mutual consent.",
      constProhibition:"",
      particular:"A living model for our central reform: mutual consent works in practice, and the overwhelming majority of South Dakota divorces still proceed — by agreement.",
      history:"",
      billLink:"bills.html"},
    MS:{
      noFault:"Miss. Code § 93-5-2 — divorce on the ground of irreconcilable differences requires both spouses’ written consent (with unresolved issues submitted to the court by agreement). The second mutual-consent state.",
      constProhibition:"",
      particular:"Alongside South Dakota, demonstrates that a consent requirement is workable, not hypothetical.",
      history:"",
      billLink:"bills.html"},
    NE:{
      noFault:"",
      constProhibition:"",
      particular:"Site of Dycus v. Dycus, a constitutional challenge to no-fault divorce we were involved with for a time. Its legacy: the Nebraska GOP adopted our policy item into the state platform.",
      history:"",
      billLink:null}
  };
  var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox",window.US_MAP.viewBox);
  svg.setAttribute("class","ussvg");
  svg.setAttribute("role","group");
  svg.setAttribute("aria-label","Map of the United States — select a state");
  var tip=document.createElement("div");
  tip.className="maptip"; tip.hidden=true; document.body.appendChild(tip);
  var pname=document.getElementById("pname"),
      ptags=document.getElementById("ptags"),
      pbody=document.getElementById("pbody"),
      curEl=null;
  function field(label,val,cite){
    var filled=val&&val.length;
    var cls=(filled&&cite?"cite":"")+(filled?"":" empty");
    var text=filled?val:"Not yet documented. Help us research this — see Get Involved.";
    return '<div class="field"><div class="fl">'+label+'</div><p class="'+cls+'">'+text+'</p></div>';
  }
  function select(code,name,el){
    if(curEl) curEl.classList.remove("sel");
    el.classList.add("sel"); curEl=el;
    var d=DATA[code]||{};
    if(pname) pname.textContent=name;
    var tags="";
    if(MODEL[code]) tags+='<span class="ptag model">Mutual consent</span>';
    if(FOCUS[code]) tags+='<span class="ptag focus">Priority state</span>';
    if(DATA[code]&&!MODEL[code]) tags+='<span class="ptag">Documented</span>';
    if(!DATA[code]&&!MODEL[code]) tags+='<span class="ptag">Not yet documented</span>';
    if(ptags) ptags.innerHTML=tags;
    var html="";
    html+=field("No-fault statute",d.noFault,true);
    html+=field("Constitutional prohibition",d.constProhibition,true);
    html+=field("Particularities",d.particular,false);
    html+=field("Legislative history",d.history,false);
    if(d.billLink){
      html+='<div class="panel-cta"><a href="'+d.billLink+'">View proposed bill language &rarr;</a></div>';
    }else{
      html+='<div class="field"><div class="fl">Proposed bill language</div><p class="empty">Model bill in development — see the Bills page.</p></div>';
    }
    if(pbody) pbody.innerHTML=html;
  }
  window.US_MAP.states.forEach(function(st){
    var p=document.createElementNS("http://www.w3.org/2000/svg","path");
    p.setAttribute("d",st.d);
    p.setAttribute("tabindex","0");
    p.setAttribute("role","button");
    p.setAttribute("aria-label",st.name);
    if(MODEL[st.id]) p.classList.add("model");
    else if(DATA[st.id]) p.classList.add("documented");
    if(FOCUS[st.id]) p.classList.add("focus");
    p.addEventListener("mousemove",function(ev){
      tip.textContent=st.name; tip.hidden=false;
      tip.style.left=ev.clientX+"px"; tip.style.top=ev.clientY+"px";
    });
    p.addEventListener("mouseleave",function(){tip.hidden=true;});
    p.addEventListener("click",function(){select(st.id,st.name,p);});
    p.addEventListener("keydown",function(ev){
      if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();select(st.id,st.name,p);}
    });
    svg.appendChild(p);
  });
  mapBox.appendChild(svg);
}
})();
