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

/* join form */
var form=document.getElementById("joinForm"), msg=document.getElementById("formMsg");
if(form&&msg){form.addEventListener("submit",function(ev){
  ev.preventDefault();
  var name=(document.getElementById("f-name").value||"").trim();
  var email=(document.getElementById("f-email").value||"").trim();
  if(!email){msg.style.color="var(--accent)";msg.textContent="Please add an email so we can reply.";return;}
  msg.style.color="var(--muted)";
  msg.textContent=(name?name.split(" ")[0]+", ":"")+"thank you — copy your note and email it to us at "+(emailEl?emailEl.textContent.trim():"our address")+" and we’ll reply personally.";
});}

/* ---------- state map ---------- */
var mapBox=document.getElementById("mapsvg-host");
if(mapBox&&window.US_MAP){

var MODEL={SD:1,MS:1};
var HYBRID={OH:1,TN:1,WV:1};
var FOCUS={TX:1,SD:1,IA:1,WV:1,OK:1};

// State data atlas. Fields: noFault (statute), constProhibition (special-laws clause),
// particular (what's notable), history (adoption year / reform activity),
// caseLaw (key precedents). Items flagged [VERIFY] require manual confirmation.
var DATA={
AL:{noFault:"Ala. Code § 30-2-1(a)(7),(9) — “complete incompatibility of temperament” or “irretrievable breakdown.” Unilateral.",
    constProhibition:"Ala. Const. § 104 — “The legislature shall not pass a special, private, or local law in any of the following cases: (1) Granting a divorce.”",
    history:"No-fault adopted 1971 [VERIFY]. 30-day post-filing wait."},
AK:{noFault:"Alaska Stat. § 25.24.050(5); joint dissolution under § 25.24.200.",
    constProhibition:"Alaska Const. art. II, § 19 — “The legislature shall pass no local or special act if a general act can be made applicable.”",
    particular:"Separate joint “dissolution” track alongside unilateral divorce."},
AZ:{noFault:"A.R.S. § 25-312 — “irretrievably broken.” Unilateral.",
    constProhibition:"Ariz. Const. art. IV, pt. 2, § 19 — “No local or special laws shall be enacted in any of the following cases, that is to say: 1. Granting divorces …”",
    particular:"Covenant-marriage option (A.R.S. § 25-901 et seq.) restricts available grounds."},
AR:{noFault:"Ark. Code § 9-12-301 — living separate and apart for 18 continuous months. No breakdown ground.",
    constProhibition:"Ark. Const. art. V, §§ 24, 25 — § 24 forbids local or special laws “granting divorces”; § 25 bars special laws where a general law can apply.",
    particular:"Covenant marriage available."},
CA:{noFault:"Cal. Fam. Code §§ 2310, 2311 — “irreconcilable differences, which have caused the irremediable breakdown of the marriage.” Unilateral.",
    constProhibition:"Cal. Const. art. IV, § 16 — “All laws of a general nature have uniform operation. A local or special statute is invalid in any case if a general statute can be made applicable.” (no divorce-specific clause).",
    particular:"First pure no-fault statute in the United States (Family Law Act 1969, effective Jan. 1, 1970).",
    history:"Family Law Act of 1969. Recodified into Fam. Code 1992 (operative 1994).",
    caseLaw:"In re Marriage of McKim, 6 Cal.3d 673 (1972) — trial court must find irreconcilable differences actually exist [VERIFY holding details]. In re Marriage of Walton, 28 Cal.App.3d 108 (1972) — rejects facial constitutional challenge to the Family Law Act; marriage is a status regulated by the State and the defending spouse has no vested interest in its continuation. (Adverse controlling precedent.)"},
CO:{noFault:"C.R.S. §§ 14-10-106, 14-10-110 — “irretrievably broken.” Unilateral; court may continue the matter 30–60 days if one party denies breakdown.",
    constProhibition:"Colo. Const. art. V, § 25 — “The general assembly shall not pass local or special laws in any of the following enumerated cases, that is to say; for granting divorces …”",
    history:"Adopted 1971 (effective 1972) [VERIFY].",
    caseLaw:"In re Marriage of Franks, 189 Colo. 499, 542 P.2d 845 (1975) — rejects due-process and vagueness challenges to the no-fault statute [VERIFY]."},
CT:{noFault:"Conn. Gen. Stat. § 46b-40(c)(1),(2) — “the marriage has broken down irretrievably” or 18-month separation. Unilateral.",
    constProhibition:"Connecticut's constitution lacks an express special-laws prohibition on granting divorces."},
DE:{noFault:"13 Del. C. §§ 1503, 1505 — “irretrievably broken,” generally requiring 6 months of separation.",
    constProhibition:"Del. Const. art. II, § 18 — “No divorce shall be granted, nor alimony allowed, except by the judgment of a court, as shall be prescribed by general and uniform law.”"},
DC:{noFault:"D.C. Code § 16-904 — 6-month mutual separation or 1-year separation. Unilateral after 1 year.",
    constProhibition:"District of Columbia; no state constitution. Equal protection applies via federal law.",
    particular:"Separation-only regime; no abstract “breakdown” ground."},
FL:{noFault:"Fla. Stat. § 61.052 — “irretrievably broken.” Unilateral; court may order counseling or continuance up to 3 months if one party denies breakdown.",
    constProhibition:"Fla. Const. art. III, § 11 — “There shall be no special law or general law of local application pertaining to: … (15) divorce.”",
    history:"Adopted 1971.",
    caseLaw:"Ryan v. Ryan, 277 So.2d 266 (Fla. 1973) — upholds the 1971 no-fault act against constitutional challenge [VERIFY]."},
GA:{noFault:"O.C.G.A. § 19-5-3(13) — “irretrievably broken.” 13th of 13 grounds; fault grounds retained.",
    constProhibition:"Ga. Const. art. III, § VI, ¶ IV — “Laws of a general nature shall have uniform operation … No special law relating to the rights or status of private persons shall be enacted.”"},
HI:{noFault:"HRS § 580-41(a)(1) — “irretrievably broken.” Unilateral.",
    constProhibition:"Haw. Const. art. I, § 21 bars irrevocable grants of special privileges or immunities (no explicit divorce clause)."},
ID:{noFault:"Idaho Code §§ 32-603(8), 32-616 — “irreconcilable differences.” Unilateral.",
    constProhibition:"Idaho Const. art. III, § 19 — “The legislature shall not pass local or special laws in any of the following enumerated cases, that is to say: … Granting divorces …”"},
IL:{noFault:"750 ILCS 5/401(a) — “irreconcilable differences have caused the irretrievable breakdown of the marriage.” Sole ground since 2016. 6-month separation creates irrebuttable presumption.",
    constProhibition:"Ill. Const. art. IV, § 13 — “The General Assembly shall pass no special or local law when a general law is or can be made applicable.”"},
IN:{noFault:"Ind. Code § 31-15-2-3(1) — “irretrievable breakdown of the marriage.” Unilateral.",
    constProhibition:"Ind. Const. art. III, § 22 — “The General Assembly shall not pass local or special laws … granting divorces.”"},
IA:{noFault:"Iowa Code § 598.17 — “breakdown of the marriage relationship to the extent that the legitimate objects of matrimony have been destroyed.” Sole ground. Unilateral.",
    constProhibition:"Iowa Const. art. III, § 27 — “No divorce shall be granted by the general assembly.” (A direct bar on legislative divorces.)",
    particular:"Priority state. Our proposed Mutual Consent Divorce Act is drafted to drop into Iowa's single-ground structure."},
KS:{noFault:"K.S.A. 23-2701(a)(1) — “incompatibility.” Unilateral.",
    constProhibition:"Kan. Const. art. II, § 17 — uniform operation of general laws (no divorce-specific clause)."},
KY:{noFault:"KRS 403.170 — “irretrievably broken.” Sole ground; 60-day post-separation wait (KRS 403.044).",
    constProhibition:"Ky. Const. § 59 — “The General Assembly shall not pass local or special acts concerning any of the following subjects … Tenth: To grant divorces.”"},
LA:{noFault:"La. Civ. Code arts. 102, 103(1) — living separate and apart 180 days (365 with minor children). Unilateral; separation-based.",
    constProhibition:"La. Const. art. III, § 12 — “(A) … the legislature shall not pass a local or special law … (2) … granting divorces.”",
    particular:"Covenant marriage (La. R.S. 9:307) restricts grounds for the covenant-marriage track."},
ME:{noFault:"19-A M.R.S. § 902(1)(H) — “irreconcilable marital differences.” Unilateral.",
    constProhibition:"Me. Const. art. IV, pt. 3, § 13 — Legislature shall provide, by general law, for matters usually appertaining to special or private legislation (no express divorce clause)."},
MD:{noFault:"Md. Code, Fam. Law § 7-103 — 6-month separation; “irreconcilable differences”; mutual consent. Fault grounds repealed effective Oct. 1, 2023 [VERIFY]. Unilateral available.",
    constProhibition:"Md. Const. art. III, § 33 — “The General Assembly shall not pass local, or special Laws … granting divorces.”"},
MA:{noFault:"M.G.L. c. 208, §§ 1A (joint), 1B (contested) — “irretrievable breakdown of the marriage.” § 1B requires 6 months after filing before judgment. Unilateral via 1B.",
    constProhibition:"Massachusetts has no express constitutional prohibition on special divorce laws."},
MI:{noFault:"MCL 552.6 — “breakdown of the marriage relationship.” Sole ground. Unilateral.",
    constProhibition:"Mich. Const. art. IV, § 29 — “The legislature shall pass no local or special act in any case where a general act can be made applicable …”"},
MN:{noFault:"Minn. Stat. §§ 518.06, 518.13 — “irretrievable breakdown of the marriage relationship.” Sole ground.",
    constProhibition:"Minn. Const. art. XII, §§ 1–2 — “Prohibition of special legislation; particular subjects.”",
    caseLaw:"Richter v. Richter, 625 N.W.2d 490 (Minn. Ct. App. 2001) — rejects Contract-Clause / “divorce on demand” theory; the court emphasizes that Minnesota requires a finding of irretrievable breakdown. Olson v. Olson, No. A15-0900 (Minn. Ct. App. 2016, unpublished) — constitutional arguments not reached because the attorney general was not notified. (Lesson: AG notice is procedurally essential.)"},
MS:{noFault:"Miss. Code § 93-5-2 — irreconcilable differences, available only on joint complaint or where the defendant appears/waives. A contest bars the ground.",
    constProhibition:"Miss. Const. art. IV, §§ 87–90 — Legislature shall not pass local, private, or special laws “(a) Granting divorces.”",
    particular:"MUTUAL-CONSENT state. One of only two (with South Dakota) where an appearing, objecting spouse can block every no-fault ground. No separation ground.",
    history:"Adopted 1978 [VERIFY]."},
MO:{noFault:"Mo. Rev. Stat. §§ 452.305, 452.320 — “irretrievably broken.” Unilateral; if respondent denies breakdown under oath, petitioner must prove one of five statutory facts (incl. 24-month separation).",
    constProhibition:"Mo. Const. art. III, § 40 — “The general assembly shall not pass any local or special law: … (2) granting divorces …”"},
MT:{noFault:"MCA § 40-4-104(1)(b) — “irretrievably broken” (180 days separation or serious marital discord).",
    constProhibition:"Mont. Const. art. V, § 12 — “The legislature shall not pass a special or local act when a general act is, or can be made, applicable … (2) granting divorces …”"},
NE:{noFault:"Neb. Rev. Stat. §§ 42-347, 42-361 — “irretrievably broken.” Sole ground. Unilateral.",
    constProhibition:"Neb. Const. art. III, § 18 — “Local or special laws prohibited … for granting divorces.”",
    particular:"Site of Dycus v. Dycus (2020). Legacy: the Nebraska GOP adopted our policy item into the state platform.",
    history:"No-fault adopted 1972 (confirmed in Dycus).",
    caseLaw:"Dycus v. Dycus, 307 Neb. 426, 949 N.W.2d 357 (2020) — Nebraska Supreme Court rejects procedural due-process and special-legislation challenges; holds marriage is “not an ordinary civil contract” and that defendants receive their “day in court.” Declines to reach separation-of-powers and religion-clause theories (not preserved on appeal). (Most significant modern adverse precedent on the facial challenge.)"},
NV:{noFault:"NRS 125.010 — “incompatibility” or 1-year separation. Unilateral.",
    constProhibition:"Nev. Const. art. IV, §§ 20–21 — “Certain local and special laws prohibited. The legislature shall not pass local or special laws …” (enumerates divorces among subjects, within art. IV, § 20)."},
NH:{noFault:"RSA 458:7-a — “irreconcilable differences which have caused the irremediable breakdown of the marriage.”",
    constProhibition:"New Hampshire's constitution lacks an express special-laws clause on divorces."},
NJ:{noFault:"N.J.S.A. 2A:34-2(i),(d) — “irreconcilable differences” for 6 months; or 18-month separation.",
    constProhibition:"N.J. Const. art. IV, § 7, ¶ 1 — “No divorce shall be granted by the Legislature.”",
    history:"Separation ground 1971; irreconcilable differences 2007 [VERIFY]."},
NM:{noFault:"NMSA 1978, § 40-4-1(A) — “incompatibility.” Unilateral.",
    constProhibition:"N.M. Const. art. IV, § 24 — “The legislature shall not pass local or special laws in any of the following cases … nor in the following cases: granting divorces …”",
    history:"New Mexico's incompatibility ground is often described as the earliest in the United States (1933) [VERIFY]."},
NY:{noFault:"N.Y. Dom. Rel. Law § 170(7) — “The relationship between husband and wife has broken down irretrievably for a period of at least six months, provided that one party has so stated under oath.” Unilateral; incontestable per Palermo / Trbovich.",
    constProhibition:"N.Y. Const. art. I, § 9 — “… nor shall any divorce be granted otherwise than by due judicial proceedings …” (direct bar on legislative divorces).",
    particular:"Last state to adopt pure no-fault. Judgment requires ancillary issues resolved first.",
    history:"Adopted 2010 (L. 2010, ch. 384; actions filed on/after Oct. 12, 2010).",
    caseLaw:"Fearon v. Treanor, 272 N.Y. 268 (1936) — Legislature controls marriage-related causes of action; no vested property right. Gleason v. Gleason, 26 N.Y.2d 28 (1970) — marital status is subject to legislative change; no due-process bar to new divorce grounds. Townes v. Coker, 35 Misc.3d 543 (Sup. Ct. Nassau 2012) — “No defense to DRL § 170(7); due-process claims unavailing.” Palermo v. Palermo, 35 Misc.3d 1211(A), aff'd 100 A.D.3d 1453 (4th Dep't 2012) — verified statement alone suffices; no trial on breakdown. Trbovich v. Trbovich, 122 A.D.3d 1381 (4th Dep't 2014) — the opposing spouse is “not entitled to litigate” the sworn statement. (Dissent urged DRL § 173 jury-trial right.)"},
NC:{noFault:"N.C. Gen. Stat. § 50-6 — 1-year separation. Unilateral; separation-based.",
    constProhibition:"N.C. Const. art. II, § 24(1)(m) — “The General Assembly shall not enact any local, private, or special act or resolution … Granting a divorce or securing alimony in any individual case.”"},
ND:{noFault:"N.D.C.C. §§ 14-05-03(7), 14-05-09.1 — “irreconcilable differences.” Unilateral.",
    constProhibition:"N.D. Const. art. IV, § 13 — “… no local or special laws may be enacted, nor may the legislative assembly indirectly enact special or local laws by the partial repeal of a general law …”"},
OH:{noFault:"Ohio Rev. Code § 3105.01(K) — “Incompatibility, unless denied by either party.” § 3105.01(J) — one-year separation. Separate joint “dissolution” track (§ 3105.61 et seq.).",
    constProhibition:"Ohio Const. art. II, § 32 — “The general assembly shall grant no divorce, nor exercise any judicial power not herein expressly conferred.” (A direct bar on legislative divorces.)",
    particular:"HYBRID: incompatibility ground is consent-dependent (denial defeats it), but unilateral divorce remains available after one year of separation."},
OK:{noFault:"Okla. Stat. tit. 43, § 101(7) — “incompatibility.” Unilateral.",
    constProhibition:"Okla. Const. art. V, § 46 — “The Legislature shall not, except as otherwise provided … pass any local or special law authorizing: … Granting divorces …”",
    particular:"Priority state. Mandatory parenting program for incompatibility cases involving minor children (§ 107.2).",
    history:"Incompatibility ground long-standing (commonly dated to 1953 [VERIFY]).",
    caseLaw:"Williams v. Williams, 1975 OK 163, 543 P.2d 1401 — “Actionable incompatibility” requires objective proof: “such a conflict of personalities as to destroy the legitimate ends of matrimony and the possibility of reconciliation.” (Does not permit dissolution merely because termination is desired.) Vandervort v. Vandervort, 2006 OK CIV APP 34 — applies Williams; sham-incompatibility divorces may be set aside. Aikins v. Aikins (Okla. Civ. App. Div. IV, 2025) — facial challenge to § 101(7); affirmed below [VERIFY against OSCN docket]."},
OR:{noFault:"ORS 107.025(1) — “irreconcilable differences between the parties have caused the irremediable breakdown of the marriage.” Sole ground.",
    constProhibition:"Or. Const. art. IV, § 23 — “The Legislative Assembly, shall not pass special or local laws, in any of the following enumerated cases, that is to say: … Granting divorces …”"},
PA:{noFault:"23 Pa.C.S. § 3301(c),(d) — (c) mutual consent; (d) “irretrievably broken” after 1 year living separate and apart.",
    constProhibition:"Pa. Const. art. III, § 32 — “The General Assembly shall pass no local or special law in any case which has been or can be provided for by general law …”",
    history:"1980 Divorce Code; (d)-ground separation period reduced from 2 years to 1 year in 2016 [VERIFY].",
    caseLaw:"Pankoe v. Pankoe, 222 A.3d 443 (Pa. Super. Ct. 2019), allocatur denied, cert. denied, No. 20-590, 141 S. Ct. 1063 (2021) — Superior Court rejects pro se challenge to § 3301(d); U.S. Supreme Court declines review."},
RI:{noFault:"R.I. Gen. Laws §§ 15-5-3.1, 15-5-3 — “irreconcilable differences which have caused the irremediable breakdown of the marriage”; or 3-year separation.",
    constProhibition:"R.I. Gen. Laws § 15-6-4 — statutory uniformity-of-construction clause (not a constitutional bar)."},
SC:{noFault:"S.C. Code § 20-3-10(5) — 1-year separation without cohabitation. Separation-based.",
    constProhibition:"S.C. Const. art. III, § 34 — “Special laws prohibited. The General Assembly … shall not enact local or special laws concerning any of the following subjects …” (clause IX catches residual special laws where a general law applies)."},
SD:{noFault:"SDCL §§ 25-4-2(7), 25-4-17.1, 25-4-17.2 — “irreconcilable differences, which have caused the irremediable breakdown of the marriage.” May not be granted without consent of both parties unless the other party has not made a general appearance.",
    constProhibition:"S.D. Const. art. III, § 23 — “Private and special laws prohibited. The Legislature is prohibited from enacting any private or special laws in the following cases: 1. Granting divorces.”",
    particular:"MUTUAL-CONSENT state. A living model for the central reform. No separation ground; 30-day continuance where reconciliation is possible.",
    history:"Mutual-consent structure codified 1985 [VERIFY]. 2022 HB 1199 proposed repeal of the ground."},
TN:{noFault:"Tenn. Code §§ 36-4-101(a), 36-4-103 — “irreconcilable differences.” § 36-4-103(e): no divorce on this ground if denied/contested absent a properly executed marital dissolution agreement. Separate 2-year-separation ground where no minor children [VERIFY].",
    constProhibition:"Tenn. Const. art. XI, § 4 — “The Legislature shall have no power to grant divorces; but may authorize the Courts of Justice to grant them for such causes as may be specified by law; but such laws shall be general and uniform in their operation throughout the State.”",
    particular:"HYBRID: breakdown-type ground is consent-dependent; a separation-based unilateral ground exists."},
TX:{noFault:"Tex. Fam. Code § 6.001 — “insupportable because of discord or conflict of personalities that destroys the legitimate ends of the marital relationship and prevents any reasonable expectation of reconciliation.” Unilateral on petition of either party. 3-year living-apart ground at § 6.006.",
    constProhibition:"Tex. Const. art. III, § 56(a)(13) — “The Legislature shall not, except as otherwise provided in this Constitution, pass any local or special law, authorizing: (13) granting divorces.”",
    particular:"Priority state and lead jurisdiction for our constitutional challenge (Morgan v. Morgan, Dallas County). The Texas GOP Platform (Item 211) targets unilateral no-fault and has elevated it to a legislative priority.",
    history:"Adopted 1969 (effective Jan. 1, 1970). 2015 H.B. 4093 would have repealed § 6.001; did not pass. Senate interim testimony on no-fault, 2026.",
    caseLaw:"Cusack v. Cusack, 491 S.W.2d 714 (Tex. Civ. App.—Corpus Christi 1973) — insupportability makes divorce mandatory once proven, but Texas requires evidence (not a bare oath). Waite v. Waite, 64 S.W.3d 217 (Tex. App.—Houston [14th Dist.] 2001, pet. denied) — PLURALITY rejects First-Amendment / Texas “rights of conscience” challenge; concurring-and-dissenting opinion (Art. I, § 6) would have held the statute compels courts into impermissible religious inquiries. Lecuona v. Lecuona, cert. denied, No. 18-869 (U.S. Mar. 18, 2019) — Religion Clauses theory presented to and declined by SCOTUS. Morgan v. Morgan, Cause No. DF-25-09534 (Dallas Cnty., pending) — facial challenge to § 6.001; no ruling as of 2026."},
UT:{noFault:"Utah Code § 30-3-1(3)(h),(j) — “irreconcilable differences of the marriage.” Unilateral.",
    constProhibition:"Utah Const. art. VI, § 26 — “No private or special law shall be enacted where a general law can be applicable.”"},
VT:{noFault:"15 V.S.A. § 551(7) — lived apart 6 consecutive months with no reasonable probability of resumption. Separation-based.",
    constProhibition:"Vermont's constitution lacks an express special-laws prohibition on divorces."},
VA:{noFault:"Va. Code § 20-91(A)(9) — separation of 1 year (or 6 months if no minor children and a separation agreement). Separation-based.",
    constProhibition:"Va. Const. art. IV, § 14 — “The General Assembly shall confer on the courts the power to grant divorces …” (and § 15 bars special laws where general laws can apply)."},
WA:{noFault:"RCW 26.09.030 — “irretrievably broken.” Unilateral.",
    constProhibition:"Wash. Const. art. II, § 24 — “LOTTERIES AND DIVORCE. The legislature shall never grant any divorce.” (Direct bar on legislative divorces.)"},
WV:{noFault:"W. Va. Code §§ 48-5-201, 48-5-202 — § 201: “irreconcilable differences” requires an answer admitting the allegation. § 202: 1-year voluntary separation (unilateral).",
    constProhibition:"W. Va. Const. art. VI, § 39 — “The Legislature shall not pass local or special laws in any of the following enumerated cases … for granting divorces …”",
    particular:"Priority state. HYBRID: breakdown ground requires an admitting answer; separation ground is unilateral."},
WI:{noFault:"Wis. Stat. § 767.315 — “irretrievably broken.” Unilateral; if not jointly stated or 12 months apart, court may continue or refer to counseling.",
    constProhibition:"Wis. Const. art. IV, § 31 — “Special and private laws prohibited … (1) For changing the names of persons, constituting one person the heir at law of another, or granting any divorce.”"},
WY:{noFault:"Wyo. Stat. § 20-2-104 — “irreconcilable differences in the marital relationship.” Unilateral.",
    constProhibition:"Wyo. Const. art. III, § 27 — “The legislature shall not pass local or special laws in any of the following enumerated cases, that is to say: For granting divorces …”"}
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
  else if(HYBRID[code]) tags+='<span class="ptag">Hybrid</span>';
  if(FOCUS[code]) tags+='<span class="ptag focus">Priority state</span>';
  if(DATA[code]&&!MODEL[code]&&!HYBRID[code]&&!FOCUS[code]) tags+='<span class="ptag">Documented</span>';
  if(!DATA[code]) tags+='<span class="ptag">Not yet documented</span>';
  if(ptags) ptags.innerHTML=tags;
  var html="";
  html+=field("No-fault statute",d.noFault,true);
  html+=field("Constitutional prohibition",d.constProhibition,true);
  html+=field("Particularities",d.particular,false);
  html+=field("Legislative history",d.history,false);
  html+=field("Key case law",d.caseLaw,false);
  html+='<div class="panel-cta"><a href="/">View proposed bill language &rarr;</a></div>';
  if(pbody) pbody.innerHTML=html;
}

window.US_MAP.states.forEach(function(st){
  var p=document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d",st.d);
  p.setAttribute("tabindex","0");
  p.setAttribute("role","button");
  p.setAttribute("aria-label",st.name);
  if(MODEL[st.id]) p.classList.add("model");
  else if(HYBRID[st.id]) p.classList.add("hybrid");
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
