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
  var help=(document.getElementById("f-help")?document.getElementById("f-help").value:"").trim();
  var state=(document.getElementById("f-state")?document.getElementById("f-state").value:"").trim();
  var note=(document.getElementById("f-msg")?document.getElementById("f-msg").value:"").trim();
  if(!email){msg.style.color="var(--accent)";msg.textContent="Please add an email so we can reply.";return;}
  var to=emailEl?emailEl.textContent.trim():"AmericansAgainstNFD@gmail.com";
  var subject="Website contact"+(name?" from "+name:"");
  var body="Name: "+name+"\nEmail: "+email+"\nHow they would like to help: "+help+"\nState: "+state+"\n\n"+note;
  window.location.href="mailto:"+to+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
  msg.style.color="var(--muted)";
  msg.textContent=(name?name.split(" ")[0]+", ":"")+"thank you. Your email app should open with your note ready to send to us.";
});}

/* state map */
var mapBox=document.getElementById("mapsvg-host");
if(mapBox&&window.US_MAP){

var MODEL={SD:1,MS:1};
var HYBRID={OH:1,TN:1,WV:1};
var FOCUS={TX:1,SD:1,IA:1,WV:1,OK:1,NE:1,LA:1,NY:1};

var DATA={
AL:{noFault:"Ala. Code § 30-2-1(a)(7),(9). “Complete incompatibility of temperament” or “irretrievable breakdown.” Unilateral: one spouse's allegation dissolves the marriage for any reason and for no reason at all.",
    constProhibition:"Ala. Const. § 104. The legislature shall not pass a special, private, or local law “(1) Granting a divorce.”"},
AK:{noFault:"Alaska Stat. § 25.24.050(5). “Incompatibility of temperament.” Unilateral. Separate joint-dissolution track at § 25.24.200.",
    constProhibition:"Alaska Const. art. II, § 19. The legislature shall pass no local or special act if a general act can be made applicable."},
AZ:{noFault:"A.R.S. § 25-312. “Irretrievably broken.” Unilateral.",
    constProhibition:"Ariz. Const. art. IV, pt. 2, § 19. “No local or special laws shall be enacted in any of the following cases: 1. Granting divorces.”",
    particular:"Covenant-marriage option (A.R.S. § 25-901) restricts available grounds for the covenant track."},
AR:{noFault:"Ark. Code § 9-12-301. Living separate and apart for 18 continuous months. Unilateral, separation-based.",
    constProhibition:"Ark. Const. art. V, § 24. The General Assembly shall not pass any local or special law “granting divorces.”",
    particular:"Covenant marriage available."},
CA:{noFault:"Cal. Fam. Code §§ 2310, 2311. “Irreconcilable differences which have caused the irremediable breakdown of the marriage.” Unilateral.",
    constProhibition:"Cal. Const. art. IV, § 16. Laws of a general nature must have uniform operation. No divorce-specific clause.",
    particular:"First pure no-fault statute in the United States (Family Law Act of 1969, effective January 1, 1970). California's experiment set the template; every state followed within fifteen years.",
    history:"The California Governor's Commission on the Family (1966) proposed eliminating the concept of fault. Assemblyman James A. Hayes carried the bill; Governor Ronald Reagan, himself the first divorced U.S. president, signed it into law on September 4, 1969.",
    caseLaw:"In re Marriage of Walton, 28 Cal.App.3d 108 (1972). Rejects facial constitutional challenge. The court treats marriage as a status regulated by the State and holds that the defending spouse has no vested interest in its continuation. In re Marriage of McKim, 6 Cal.3d 673 (1972). Trial court must find that irreconcilable differences actually exist (not a bare petition). In practice, California courts accept one spouse's testimony as sufficient."},
CO:{noFault:"C.R.S. §§ 14-10-106, 14-10-110. “Irretrievably broken.” Unilateral; court may continue the matter 30 to 60 days if one party denies the breakdown.",
    constProhibition:"Colo. Const. art. V, § 25. The General Assembly shall not pass local or special laws “for granting divorces.”",
    caseLaw:"In re Marriage of Franks, 189 Colo. 499, 542 P.2d 845 (1975). Rejects due-process and vagueness challenges to the no-fault statute. [VERIFY]"},
CT:{noFault:"Conn. Gen. Stat. § 46b-40(c)(1),(2). “The marriage has broken down irretrievably,” or 18-month separation. Unilateral.",
    constProhibition:"Connecticut's constitution lacks an express special-laws prohibition on divorce."},
DE:{noFault:"13 Del. C. §§ 1503, 1505. “Irretrievably broken,” generally requiring 6 months of separation.",
    constProhibition:"Del. Const. art. II, § 18. “No divorce shall be granted, nor alimony allowed, except by the judgment of a court, as shall be prescribed by general and uniform law.”"},
DC:{noFault:"D.C. Code § 16-904. Six-month mutual separation or one-year separation. Unilateral after one year.",
    constProhibition:"The District of Columbia has no state constitution; federal equal protection applies.",
    particular:"Separation-only regime; no abstract “breakdown” ground."},
FL:{noFault:"Fla. Stat. § 61.052. “Irretrievably broken.” Unilateral; court may order counseling or continuance up to three months if one party denies breakdown.",
    constProhibition:"Fla. Const. art. III, § 11. No special law or general law of local application pertaining to “(15) divorce.”",
    history:"Adopted 1971.",
    caseLaw:"Ryan v. Ryan, 277 So.2d 266 (Fla. 1973). Upholds the 1971 Act against constitutional challenge. [VERIFY]"},
GA:{noFault:"O.C.G.A. § 19-5-3(13). “Irretrievably broken.” The thirteenth of thirteen grounds; fault grounds retained.",
    constProhibition:"Ga. Const. art. III, § VI, ¶ IV. “No special law relating to the rights or status of private persons shall be enacted.”"},
HI:{noFault:"HRS § 580-41(a)(1). “Irretrievably broken.” Unilateral.",
    constProhibition:"Haw. Const. art. I, § 21. Bars irrevocable grants of special privileges or immunities. No divorce-specific clause."},
ID:{noFault:"Idaho Code §§ 32-603(8), 32-616. “Irreconcilable differences.” Unilateral.",
    constProhibition:"Idaho Const. art. III, § 19. The legislature shall not pass local or special laws “Granting divorces.”"},
IL:{noFault:"750 ILCS 5/401(a). “Irreconcilable differences have caused the irretrievable breakdown of the marriage.” Sole ground since 2016. A 6-month separation creates an irrebuttable presumption of breakdown.",
    constProhibition:"Ill. Const. art. IV, § 13. The General Assembly shall pass no special or local law when a general law is or can be made applicable."},
IN:{noFault:"Ind. Code § 31-15-2-3(1). “Irretrievable breakdown of the marriage.” Unilateral.",
    constProhibition:"Ind. Const. art. III, § 22. The General Assembly shall not pass local or special laws “granting divorces.”"},
IA:{noFault:"Iowa Code § 598.17. “Breakdown of the marriage relationship to the extent that the legitimate objects of matrimony have been destroyed.” Sole ground. Unilateral.",
    constProhibition:"Iowa Const. art. III, § 27. “No divorce shall be granted by the general assembly.” A direct bar on legislative divorces.",
    particular:"Priority state. Iowa's single-ground structure makes it a natural fit for the Mutual Consent Divorce Act."},
KS:{noFault:"K.S.A. 23-2701(a)(1). “Incompatibility.” Unilateral.",
    constProhibition:"Kan. Const. art. II, § 17. Uniform operation of general laws. No divorce-specific clause."},
KY:{noFault:"KRS 403.170. “Irretrievably broken.” Sole ground; 60-day post-separation wait (KRS 403.044).",
    constProhibition:"Ky. Const. § 59. “The General Assembly shall not pass local or special acts … Tenth: To grant divorces.”"},
LA:{noFault:"La. Civ. Code arts. 102, 103(1). Living separate and apart for 180 days (365 with minor children). Unilateral, separation-based.",
    constProhibition:"La. Const. art. III, § 12. “The legislature shall not pass a local or special law … (2) … granting divorces.”",
    particular:"Priority state. Covenant marriage (La. R.S. 9:307) is the first American statute to offer a binding alternative to the default no-fault regime, though uptake has been low."},
ME:{noFault:"19-A M.R.S. § 902(1)(H). “Irreconcilable marital differences.” Unilateral.",
    constProhibition:"Me. Const. art. IV, pt. 3, § 13. General legislation for matters usually appertaining to special or private legislation. No express divorce clause."},
MD:{noFault:"Md. Code, Fam. Law § 7-103. 6-month separation; “irreconcilable differences”; mutual consent. Fault grounds repealed effective October 1, 2023. [VERIFY]",
    constProhibition:"Md. Const. art. III, § 33. The General Assembly shall not pass local or special laws “granting divorces.”"},
MA:{noFault:"M.G.L. c. 208, §§ 1A (joint), 1B (contested). “Irretrievable breakdown of the marriage.” Unilateral via § 1B.",
    constProhibition:"Massachusetts has no express constitutional prohibition on special divorce laws."},
MI:{noFault:"MCL 552.6. “Breakdown of the marriage relationship.” Sole ground. Unilateral.",
    constProhibition:"Mich. Const. art. IV, § 29. The legislature shall pass no local or special act where a general act can be made applicable."},
MN:{noFault:"Minn. Stat. §§ 518.06, 518.13. “Irretrievable breakdown of the marriage relationship.” Sole ground. Unilateral.",
    constProhibition:"Minn. Const. art. XII, §§ 1 to 2. Prohibition of special legislation.",
    caseLaw:"Hagerty v. Hagerty, 281 N.W.2d 386 (Minn. 1979). The courts look at the existing subjective attitude of the petitioner. Richter v. Richter, 625 N.W.2d 490 (Minn. Ct. App. 2001). Rejects Contract-Clause theory; the court emphasizes that Minnesota requires a finding of irretrievable breakdown. Olson v. Olson (Minn. Ct. App. 2016, unpublished). Constitutional arguments not reached because the attorney general was not notified. Procedural lesson: always serve the AG."},
MS:{noFault:"Miss. Code § 93-5-2. Irreconcilable differences, available only on joint complaint or where the defendant appears or waives. A contest bars the ground.",
    constProhibition:"Miss. Const. art. IV, §§ 87 to 90. Legislature shall not pass local, private, or special laws “(a) Granting divorces.”",
    particular:"MUTUAL-CONSENT STATE. One of only two (with South Dakota) where an appearing, objecting spouse can block the no-fault ground. CAVEAT: in practice, attorneys often file alternative fault grounds (habitual cruel and inhuman treatment) to pressure the respondent into agreeing to the irreconcilable-differences ground."},
MO:{noFault:"Mo. Rev. Stat. §§ 452.305, 452.320. “Irretrievably broken.” Unilateral; if respondent denies breakdown under oath, petitioner must prove one of five statutory facts (including 24-month separation).",
    constProhibition:"Mo. Const. art. III, § 40. The general assembly shall not pass any local or special law “(2) granting divorces.”"},
MT:{noFault:"MCA § 40-4-104(1)(b). “Irretrievably broken” (180 days separation or serious marital discord).",
    constProhibition:"Mont. Const. art. V, § 12. The legislature shall not pass a special or local act when a general act is, or can be made, applicable “(2) granting divorces.”"},
NE:{noFault:"Neb. Rev. Stat. §§ 42-347, 42-361. “Irretrievably broken.” Sole ground. Unilateral: “The allegation that a marriage is irretrievably broken is the sole allegation necessary for dissolution.” (Else v. Else, 219 Neb. 878 (1985).)",
    constProhibition:"Neb. Const. art. III, § 18. “Local or special laws prohibited … for granting divorces.”",
    particular:"Priority state. Site of Dycus v. Dycus. The Nebraska GOP adopted our policy item into the state platform in the wake of that litigation.",
    history:"No-fault adopted 1972 (confirmed in Dycus).",
    caseLaw:"Dycus v. Dycus, 307 Neb. 426, 949 N.W.2d 357 (2020). Nebraska Supreme Court rejects procedural due-process and special-legislation challenges; holds marriage is “not an ordinary civil contract” and that defendants receive their “day in court.” Declines to reach separation-of-powers and religion-clause theories (not preserved on appeal). The most significant modern adverse precedent on the facial challenge; it dodged the structural question. Else v. Else, 219 Neb. 878, 367 N.W.2d 701 (1985). The sole-allegation case."},
NV:{noFault:"NRS 125.010. “Incompatibility” or one-year separation. Unilateral.",
    constProhibition:"Nev. Const. art. IV, §§ 20 to 21. Certain local and special laws prohibited (enumerates divorces)."},
NH:{noFault:"RSA 458:7-a. “Irreconcilable differences which have caused the irremediable breakdown of the marriage.”",
    constProhibition:"New Hampshire's constitution lacks an express special-laws clause on divorces."},
NJ:{noFault:"N.J.S.A. 2A:34-2(i),(d). “Irreconcilable differences” for 6 months, or 18-month separation. Unilateral.",
    constProhibition:"N.J. Const. art. IV, § 7, ¶ 1. “No divorce shall be granted by the Legislature.”",
    history:"Separation ground 1971; irreconcilable differences 2007. [VERIFY]"},
NM:{noFault:"NMSA 1978, § 40-4-1(A). “Incompatibility.” Unilateral.",
    constProhibition:"N.M. Const. art. IV, § 24. The legislature shall not pass local or special laws “granting divorces.”",
    history:"New Mexico's incompatibility ground is often described as the earliest in the United States (1933). [VERIFY]"},
NY:{noFault:"N.Y. Dom. Rel. Law § 170(7). “The relationship between husband and wife has broken down irretrievably for a period of at least six months, provided that one party has so stated under oath.” Unilateral; incontestable per Palermo and Trbovich.",
    constProhibition:"N.Y. Const. art. I, § 9. “Nor shall any divorce be granted otherwise than by due judicial proceedings.” A direct bar on legislative divorces.",
    particular:"Priority state. Last state to adopt pure no-fault. Prior to 2010, New York had a mutual no-fault statute (1966); the 2010 amendment converted mutual to unilateral. The press misleadingly called the 2010 law the state's “first” no-fault statute; what changed was the removal of the consent requirement.",
    history:"Mutual no-fault adopted 1966 (D.R.L. § 170(5) and (6)). Unilateral no-fault adopted 2010 (ch. 384; actions filed on or after October 12, 2010).",
    caseLaw:"Fearon v. Treanor, 272 N.Y. 268 (1936). The Legislature controls marriage-related causes of action; no vested property right. Gleason v. Gleason, 26 N.Y.2d 28 (1970). Marital status is subject to legislative change. Townes v. Coker, 35 Misc.3d 543 (2012). “No defense to DRL § 170(7).” Palermo v. Palermo, 35 Misc.3d 1211(A), aff'd 100 A.D.3d 1453 (4th Dep't 2012). The verified statement alone suffices; no trial on breakdown; the court itself notes that New York “extends no-fault beyond that permitted in other states.” Trbovich v. Trbovich, 122 A.D.3d 1381 (4th Dep't 2014). The opposing spouse is “not entitled to litigate” the sworn statement. A dissent would have preserved D.R.L. § 173's jury-trial right."},
NC:{noFault:"N.C. Gen. Stat. § 50-6. One-year separation. Unilateral, separation-based.",
    constProhibition:"N.C. Const. art. II, § 24(1)(m). The General Assembly shall not enact any local, private, or special act “granting a divorce or securing alimony in any individual case.”"},
ND:{noFault:"N.D.C.C. §§ 14-05-03(7), 14-05-09.1. “Irreconcilable differences.” Unilateral.",
    constProhibition:"N.D. Const. art. IV, § 13. No local or special laws may be enacted."},
OH:{noFault:"Ohio Rev. Code § 3105.01(K). “Incompatibility, unless denied by either party.” Also § 3105.01(J): one-year separation. Separate joint-dissolution track (§ 3105.61 et seq.).",
    constProhibition:"Ohio Const. art. II, § 32. “The general assembly shall grant no divorce, nor exercise any judicial power not herein expressly conferred.” A direct bar on legislative divorces.",
    particular:"HYBRID. The incompatibility ground is consent-dependent (denial defeats it), but unilateral divorce remains available after one year of separation."},
OK:{noFault:"Okla. Stat. tit. 43, § 101(7). “Incompatibility.” Unilateral.",
    constProhibition:"Okla. Const. art. V, § 46. The Legislature shall not pass any local or special law authorizing “Granting divorces.”",
    particular:"Priority state. Mandatory parenting program for incompatibility cases involving minor children (§ 107.2).",
    history:"Incompatibility ground long-standing (commonly dated to 1953). [VERIFY]",
    caseLaw:"Williams v. Williams, 1975 OK 163, 543 P.2d 1401. “Actionable incompatibility” requires objective proof. The statute “does not permit the court to dissolve a marriage merely because its termination is desired by one or both parties.” A useful textual limit for advocacy. Vandervort v. Vandervort, 2006 OK CIV APP 34. Applies Williams; sham-incompatibility divorces may be set aside. Aikins v. Aikins (Okla. Civ. App. Div. IV, 2025). Facial challenge to § 101(7); affirmed below. [VERIFY OSCN docket]"},
OR:{noFault:"ORS 107.025(1). “Irreconcilable differences between the parties have caused the irremediable breakdown of the marriage.” Sole ground.",
    constProhibition:"Or. Const. art. IV, § 23. The Legislative Assembly shall not pass special or local laws “Granting divorces.”"},
PA:{noFault:"23 Pa.C.S. § 3301(c),(d). (c) mutual consent; (d) “irretrievably broken” after one year of living separate and apart.",
    constProhibition:"Pa. Const. art. III, § 32. The General Assembly shall pass no local or special law in any case which has been or can be provided for by general law.",
    history:"1980 Divorce Code; separation period reduced from two years to one year in 2016. [VERIFY]",
    caseLaw:"Pankoe v. Pankoe, 222 A.3d 443 (Pa. Super. Ct. 2019), allocatur denied, cert. denied, No. 20-590, 141 S. Ct. 1063 (2021). Superior Court rejects pro se challenge; U.S. Supreme Court declines review."},
RI:{noFault:"R.I. Gen. Laws §§ 15-5-3.1, 15-5-3. “Irreconcilable differences” or three-year separation.",
    constProhibition:"Rhode Island's constitution has no express divorce-specific prohibition."},
SC:{noFault:"S.C. Code § 20-3-10(5). One-year separation. Separation-based.",
    constProhibition:"S.C. Const. art. III, § 34. Special laws prohibited on enumerated subjects, with a residual catch-all."},
SD:{noFault:"SDCL §§ 25-4-2(7), 25-4-17.1, 25-4-17.2. “Irreconcilable differences, which have caused the irremediable breakdown of the marriage.” May not be granted without the consent of both parties unless the other party has not made a general appearance.",
    constProhibition:"S.D. Const. art. III, § 23. “Private and special laws prohibited. The Legislature is prohibited from enacting any private or special laws in the following cases: 1. Granting divorces.”",
    particular:"MUTUAL-CONSENT STATE and a priority state. A living model for the central reform. CAVEAT: in practice, attorneys sometimes file alternative fault grounds (cruelty, for example) to pressure the respondent into consent. The structural reform is sound; the enforcement culture around it varies.",
    history:"Mutual-consent structure codified 1985. [VERIFY] 2022 HB 1199 proposed repeal of the ground entirely."},
TN:{noFault:"Tenn. Code §§ 36-4-101(a), 36-4-103. “Irreconcilable differences.” A contest bars this ground unless a properly executed marital dissolution agreement is presented. Separate two-year-separation ground where no minor children. [VERIFY subsection]",
    constProhibition:"Tenn. Const. art. XI, § 4. “The Legislature shall have no power to grant divorces; but may authorize the Courts of Justice to grant them for such causes as may be specified by law; but such laws shall be general and uniform in their operation throughout the State.”",
    particular:"HYBRID. The breakdown-type ground is consent-dependent; a separation-based unilateral ground exists."},
TX:{noFault:"Tex. Fam. Code § 6.001. “Insupportable because of discord or conflict of personalities that destroys the legitimate ends of the marital relationship and prevents any reasonable expectation of reconciliation.” Unilateral: on the petition of either party. Three-year living-apart ground at § 6.006.",
    constProhibition:"Tex. Const. art. III, § 56(a)(13). “The Legislature shall not … pass any local or special law, authorizing: (13) granting divorces.”",
    particular:"Priority state and lead jurisdiction for our constitutional challenge (Morgan v. Morgan, Dallas County). The Texas GOP Platform (Item 211) targets unilateral no-fault and has elevated it to a legislative priority.",
    history:"Adopted 1969 (effective January 1, 1970). H.B. 4093 (2015) would have repealed § 6.001; did not pass. Senate interim testimony on no-fault, 2026.",
    caseLaw:"Cusack v. Cusack, 491 S.W.2d 714 (Tex. Civ. App. Corpus Christi 1973). Insupportability makes divorce mandatory once proven, but Texas requires evidence rather than a bare oath. Waite v. Waite, 64 S.W.3d 217 (Tex. App. Houston [14th Dist.] 2001, pet. denied). PLURALITY rejects First-Amendment and Texas “rights of conscience” challenge; a concurring-and-dissenting opinion (Tex. Const. art. I, § 6) would have held the statute compels courts into impermissible religious inquiries. Lecuona v. Lecuona, cert. denied, No. 18-869 (U.S. Mar. 18, 2019). Religion Clauses theory presented to and declined by SCOTUS. Morgan v. Morgan, Cause No. DF-25-09534 (Dallas Cnty., pending). Facial challenge to § 6.001; frames the structural (jurisdictional) rather than rights-based question."},
UT:{noFault:"Utah Code § 30-3-1(3)(h),(j). “Irreconcilable differences of the marriage.” Unilateral.",
    constProhibition:"Utah Const. art. VI, § 26. No private or special law shall be enacted where a general law can apply."},
VT:{noFault:"15 V.S.A. § 551(7). Lived apart six consecutive months with no reasonable probability of resumption. Separation-based.",
    constProhibition:"Vermont's constitution lacks an express prohibition on special divorce laws."},
VA:{noFault:"Va. Code § 20-91(A)(9). One-year separation (six months if no minor children and a separation agreement). Separation-based: “On the application of either party.”",
    constProhibition:"Va. Const. art. IV, § 14. The General Assembly shall confer on the courts the power to grant divorces. § 15 bars special laws where general laws can apply."},
WA:{noFault:"RCW 26.09.030. “Irretrievably broken.” Unilateral.",
    constProhibition:"Wash. Const. art. II, § 24. “LOTTERIES AND DIVORCE. The legislature shall never grant any divorce.” A direct bar on legislative divorces."},
WV:{noFault:"W. Va. Code §§ 48-5-201, 48-5-202. § 201: “irreconcilable differences” requires an answer admitting the allegation. § 202: one-year voluntary separation (unilateral).",
    constProhibition:"W. Va. Const. art. VI, § 39. The Legislature shall not pass local or special laws “for granting divorces.”",
    particular:"Priority state. HYBRID: the breakdown ground requires an admitting answer; the separation ground is unilateral."},
WI:{noFault:"Wis. Stat. § 767.315. “Irretrievably broken.” Unilateral; if not jointly stated or 12 months apart, court may continue or refer to counseling.",
    constProhibition:"Wis. Const. art. IV, § 31. “Special and private laws prohibited … (1) … granting any divorce.”"},
WY:{noFault:"Wyo. Stat. § 20-2-104. “Irreconcilable differences in the marital relationship.” Unilateral.",
    constProhibition:"Wyo. Const. art. III, § 27. The legislature shall not pass local or special laws “For granting divorces.”"}
};

var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
svg.setAttribute("viewBox",window.US_MAP.viewBox);
svg.setAttribute("class","ussvg");
svg.setAttribute("role","group");
svg.setAttribute("aria-label","Map of the United States. Select a state.");

var tip=document.createElement("div");
tip.className="maptip"; tip.hidden=true; document.body.appendChild(tip);

var pname=document.getElementById("pname"),
    ptags=document.getElementById("ptags"),
    pbody=document.getElementById("pbody"),
    curEl=null;

function field(label,val,cite){
  var filled=val&&val.length;
  var cls=(filled&&cite?"cite":"")+(filled?"":" empty");
  var text=filled?val:"Not yet documented. Help us research this.";
  return '<div class="field"><div class="fl">'+label+'</div><p class="'+cls+'">'+text+'</p></div>';
}

function select(code,name,el){
  if(curEl) curEl.classList.remove("sel");
  el.classList.add("sel"); curEl=el;
  var d=DATA[code]||{};
  if(pname) pname.textContent=name;
  var tags="";
  if(MODEL[code]) tags+='<span class="ptag model">Mutual consent</span>';
  else if(HYBRID[code]) tags+='<span class="ptag hybrid">Hybrid</span>';
  else tags+='<span class="ptag unilateral">Unilateral</span>';
  if(FOCUS[code]) tags+='<span class="ptag focus">Priority state</span>';
  if(ptags) ptags.innerHTML=tags;
  var html="";
  html+=field("No-fault statute",d.noFault,true);
  html+=field("Constitutional prohibition on legislative divorces",d.constProhibition,true);
  html+=field("Particularities",d.particular,false);
  html+=field("Legislative history",d.history,false);
  html+=field("Key case law",d.caseLaw,false);
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
  else p.classList.add("unilateral");
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
