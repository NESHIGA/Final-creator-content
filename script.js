var authToken=null;
try{authToken=localStorage.getItem("token")}catch(error){}
if(!authToken){
window.location.replace("login.html");
}else{
var API_BASE=(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")?"http://localhost:5000":"";
var C=[
{n:"Neshiga AI Studio",ct:["AI Video","Image / Graphics"],c:"Chennai",t:["Midjourney","Runway","Flux"],a:{lux:96,food:70,shoe:60,tech:40,anim:30},p:22000,d:3,tr:97,ev:"4 samples reproduced, metadata matched, no duplicates",pr:[["P1","Noir Perfume Film","lux"],["P2","Gold Watch Reel","lux"],["P3","Saffron Tea Ad","food"]]},
{n:"Karthik Raja",ct:["AI Video","Social Reel"],c:"Chennai",t:["Sora","ComfyUI","Runway"],a:{lux:55,food:92,shoe:88,tech:60,anim:50},p:15000,d:4,tr:94,ev:"3 samples reproduced, metadata matched, no duplicates",pr:[["P4","Filter Coffee Story","food"],["P5","Street Sneaker Drop","shoe"],["P6","Bakery Reel","food"]]},
{n:"Meera Nair",ct:["AI Animation","Image / Graphics"],c:"Kochi",t:["Midjourney","ElevenLabs","Claude"],a:{lux:60,food:60,shoe:40,tech:95,anim:90},p:12000,d:5,tr:94,ev:"3 samples reproduced, metadata matched, 1 near-duplicate reviewed",pr:[["P7","Mascot Explainer","anim"],["P8","SaaS Launch Film","tech"],["P9","Kids Brand Animation","anim"]]},
{n:"Dev Patel",ct:["AI Video","Image / Graphics"],c:"Ahmedabad",t:["Flux","ComfyUI"],a:{lux:80,food:50,shoe:94,tech:70,anim:40},p:28000,d:2,tr:96,ev:"4 samples reproduced, metadata matched, no duplicates",pr:[["P10","Sneaker Cinematic","shoe"],["P11","Streetwear Lookbook","shoe"],["P12","Jewelry Macro","lux"]]},
{n:"Sana Iqbal",ct:["Social Reel","AI Video"],c:"Hyderabad",t:["Runway","ChatGPT","ElevenLabs"],a:{lux:65,food:88,shoe:50,tech:75,anim:60},p:9000,d:3,tr:91,cm:0,ev:"2 samples reproduced, metadata matched, no duplicates",pr:[["P13","Cafe Menu Reels","food"],["P14","Gadget Unboxing","tech"]]},
{n:"Rohan Das",ct:["AI Video","AI Animation"],c:"Kolkata",t:["Sora","Midjourney"],a:{lux:70,food:65,shoe:72,tech:85,anim:55},p:18000,d:4,tr:96,ev:"3 samples reproduced, metadata matched, no duplicates",pr:[["P15","Fintech Explainer","tech"],["P16","Smartwatch Teaser","tech"]]}
];
var CAT={lux:"luxury",food:"food and beverage",shoe:"fashion and footwear",tech:"tech",anim:"animation"};
var NEAR={lux:["shoe"],food:["lux"],shoe:["lux"],tech:["anim"],anim:["tech"]};
function $(i){return document.getElementById(i)}
function cat(s){s=s.toLowerCase();
if(/perfume|luxury|premium|watch|jewel|fragrance/.test(s))return"lux";
if(/coffee|food|cafe|restaurant|tea|bakery/.test(s))return"food";
if(/sneaker|shoe|fashion|streetwear/.test(s))return"shoe";
if(/tech|app|gadget|saas|phone|fintech/.test(s))return"tech";
if(/animat|cartoon|mascot/.test(s))return"anim";return null}
var AIK=null;
function briefCat(){if(AIK&&AIK[0]==$("idea").value)return AIK[1];var s=$("idea").value.toLowerCase();
if(/coffee|food|cafe|restaurant|tea|bakery/.test(s))return"food";
return cat(s)}
var K=null;
function score(c,k){var st=k?c.a[k]:75,b=$("bud").value*1||c.p,d=$("dl").value*1||c.d;
var bs=c.p<=b?100:Math.max(0,100-(c.p-b)/b*200);
var sp=c.d<=d?100:Math.max(0,100-(c.d-d)*25);
var ws=+$("ws").value,wb=+$("wb").value,wd=+$("wd").value,tot=(ws+wb+wd)||1;
var pen=($("cu").value.indexOf("Paid")==0&&c.cm===0)?15:0;
if(c.ms!=null&&isFinite(c.ms))return{m:Math.round(c.ms),st:st,bs:bs,sp:sp};
return{m:Math.round((st*ws+bs*wb+sp*wd)/tot)-pen,st:st,bs:bs,sp:sp}}
function reasons(c,s,k){if(c.mr&&c.mr.length&&c.ms!=null)return [["ok","Match "+Math.round(c.ms)+"%"]].concat(c.mr.map(function(r){return["ok",r]})).slice(0,6);
var r=[];
if(k&&s.st>=85){var p=c.pr.filter(function(x){return x[2]==k})[0];r.push(["ok","Strong "+CAT[k]+" work"+(p?" ("+p[0]+": "+p[1]+")":"")])}
else if(k)r.push(["warn","Style fit "+s.st+"% for "+CAT[k]]);
r.push(s.bs>=100?["ok","Within budget"]:["warn","₹"+(c.p-$("bud").value).toLocaleString("en-IN")+" over budget"]);
r.push(s.sp>=100?["ok","Delivers in "+c.d+" days"]:["warn","Needs "+c.d+" days"]);
r.push(["ok","Trust "+c.tr+"%"]);if($("cu").value.indexOf("Paid")==0)r.push(c.cm===0?["warn","Rights not cleared for paid ads"]:["ok","Commercial rights cleared"]);return r}
function rank(){K=briefCat();return C.map(function(c,i){return{c:c,i:i,s:score(c,K)}}).sort(function(a,b){return b.s.m-a.s.m})}
function render(){
if(CMP&&CMP.length)relink();
["s","b","d"].forEach(function(x){$("v"+x).textContent=$("w"+x).value});
var R=rank(),h="";
var F=R.filter(function(o){var q=($("srch").value||"").toLowerCase(),c=o.c,x=(c.n+" "+c.c+" "+c.t.join(" ")+" "+c.pr.map(function(p){return p[1]}).join(" ")).toLowerCase();return(!q||x.indexOf(q)>-1)&&(!FC||c.a[FC]>=85)&&(!$("ft").value||c.t.indexOf($("ft").value)>-1)&&(!$("fc").value||c.ct.indexOf($("fc").value)>-1)});
F.forEach(function(o){var c=o.c;var sel=cSel(cKey(c));
h+='<div class="cr"><div class="mr" style="--p:'+o.s.m+'"><i>'+o.s.m+'</i></div><div class="th">'+(TH[o.i]?'<img src="'+TH[o.i]+'" alt="">':SV(c.pr[0][2]))+'<span class="play">▶</span></div><div><h3><span class="av2" style="background:hsl('+(o.i*57+250)+',55%,50%)">'+c.n[0]+'</span>'+c.n+(o===R[0]?'<span class="best">Best match</span>':'')+'</h3><p>'+c.c+' · '+c.t.join(", ")+'</p><div class="chips">'+reasons(c,o.s,K).map(function(r){return'<span class="chip '+r[0]+'">'+r[1]+'</span>'}).join("")+'</div></div><div style="text-align:right"><b>₹'+c.p.toLocaleString("en-IN")+'</b><p>'+c.d+' days</p><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end"><button class="ghost" data-i="'+o.i+'">Ask twin</button><button '+(sel?'':'class="outline" ')+'data-c="'+he(cKey(c))+'">'+(sel?"✓ Selected":"Compare")+'</button><button class="ghost" data-p="'+he(cKey(c))+'">Start Project</button><button data-h="'+o.i+'">Hire</button></div></div></div>'});
$("list").innerHTML=h||'<div class="empty">No creators match these filters. Try another tool or type, or <button id="clr" class="ghost">Clear filters</button></div>';if(!F.length)$("clr").onclick=function(){$("srch").value="";$("ft").value="";$("fc").value="";FC=null;document.querySelectorAll("#fchips button").forEach(function(y,i){y.className=i?"":"on"});render()};$("cnt").textContent=F.length+" of "+C.length+" creators · sorted by match";
var t;
if(CMP.length>=2){t=cmpTable()}
else{
var T=R.slice(0,3),best=T[0],cheap=T.slice().sort(function(a,b){return a.c.p-b.c.p})[0],fast=T.slice().sort(function(a,b){return a.c.d-b.c.d})[0];
var mm=Math.max.apply(0,T.map(function(o){return o.s.m})),mp=Math.min.apply(0,T.map(function(o){return o.c.p})),md=Math.min.apply(0,T.map(function(o){return o.c.d})),mt=Math.max.apply(0,T.map(function(o){return o.c.tr}));
t='<table><tr><th>Creator</th><th>Match</th><th>Price</th><th>Delivery</th><th>Trust</th><th>Verification evidence</th><th></th></tr>';
T.forEach(function(o){t+='<tr><td><b>'+o.c.n+'</b></td><td'+W(o.s.m==mm)+'>'+o.s.m+'</td><td'+W(o.c.p==mp)+'>₹'+o.c.p.toLocaleString("en-IN")+'</td><td'+W(o.c.d==md)+'>'+o.c.d+' days</td><td'+W(o.c.tr==mt)+'>'+o.c.tr+'%</td><td>'+o.c.ev+'</td><td><button class="ghost" data-h="'+o.i+'">Hire</button></td></tr>'});
t+='</table><p class="note"><b>Recommendation:</b> '+best.c.n+' is the best overall match. '+cheap.c.n+' is the lowest price and '+fast.c.n+' is the fastest of these three. Verification evidence is sample data for this demo.'+(CMP.length===1?' Select one more creator to compare them side by side.':'')+'</p>'}
$("cmp").innerHTML=t;document.querySelectorAll("#cmp [data-h],#list [data-h]").forEach(function(b){b.onclick=function(){hire(+b.dataset.h)}});
document.querySelectorAll("#list [data-i]").forEach(function(b){b.onclick=function(){$("tw").value=b.dataset.i;$("twin").scrollIntoView({behavior:"smooth"})}});
document.querySelectorAll("#list [data-c]").forEach(function(b){b.onclick=function(){toggleCompare(b.dataset.c)}});
document.querySelectorAll("#list [data-p],#cmp [data-p]").forEach(function(b){b.onclick=function(){startProject(b.dataset.p)}});
var cc=$("cmpClear");if(cc)cc.onclick=function(){CMP=[];render();toast("Compare cleared")}}
var CMP=[];
function cKey(c){return c.id||c.n}
function cSel(k){for(var i=0;i<CMP.length;i++)if(CMP[i].k===k)return true;return false}
function relink(){for(var i=0;i<CMP.length;i++){var x=CMP[i],f=null;for(var j=0;j<C.length;j++){var y=C[j];if(cKey(y)===x.k||y.n===x.c.n)f=y}if(f){x.c=f;x.k=cKey(f)}}}
function toggleCompare(k){var i=-1;for(var j=0;j<CMP.length;j++)if(CMP[j].k===k)i=j;
if(i>-1){CMP.splice(i,1);render();return}
if(CMP.length>=3){toast("Compare up to 3 creators");return}
var c=null;for(var j=0;j<C.length;j++)if(cKey(C[j])===k)c=C[j];
if(!c)return;CMP.push({k:k,c:c});render()}
function cmpTable(){
var cols=[];for(var i=0;i<CMP.length;i++)cols.push(CMP[i].c);
function mv(c){return c.ms!=null&&isFinite(c.ms)?Math.round(c.ms):score(c,K).m}
var best=Math.max.apply(0,cols.map(mv)),lowD=Math.min.apply(0,cols.map(function(c){return c.d})),hiT=Math.max.apply(0,cols.map(function(c){return c.tr}));
var t='<table><tr><th>Creator</th>';
cols.forEach(function(c,i){var live=false;for(var j=0;j<C.length;j++)if(cKey(C[j])===cKey(c)||C[j].n===c.n)live=true;
t+='<th><span class="av2" style="background:hsl('+(i*57+250)+',55%,50%)">'+he(c.n[0])+'</span>'+he(c.n)+(live?"":' <small class="note" style="font-weight:400">not in results</small>')+'</th>'});
t+='</tr>';
function row(label,cells){t+='<tr><td><b>'+label+'</b></td>'+cells.join('')+'</tr>'}
row("Match %",cols.map(function(c){var m=mv(c);return'<td'+W(m===best)+'><b>'+m+'%</b></td>'}));
row("Match reasons",cols.map(function(c){var rs=(c.mr&&c.mr.length&&c.ms!=null)?c.mr.map(function(r){return["ok",r]}):reasons(c,score(c,K),K);return'<td><div class="chips">'+rs.map(function(r){return'<span class="chip '+r[0]+'">'+he(r[1])+'</span>'}).join("")+'</div></td>'}));
row("Bio",cols.map(function(c){return'<td>'+he(c.bio||"—")+'</td>'}));
row("Skills",cols.map(function(c){return'<td>'+he((c.skills&&c.skills.length)?c.skills.join(", "):(c.t&&c.t.length?c.t.join(", "):"—"))+'</td>'}));
row("Tools",cols.map(function(c){return'<td>'+he((c.t&&c.t.length)?c.t.join(", "):"—")+'</td>'}));
row("Style",cols.map(function(c){return'<td>'+he(c.style||"—")+'</td>'}));
row("Industries",cols.map(function(c){return'<td>'+he((c.industries&&c.industries.length)?c.industries.join(", "):"—")+'</td>'}));
row("Platforms",cols.map(function(c){return'<td>'+he((c.platforms&&c.platforms.length)?c.platforms.join(", "):"—")+'</td>'}));
row("Budget",cols.map(function(c){return'<td>'+(c.budgetMax&&c.budgetMax>c.p?"₹"+c.p.toLocaleString("en-IN")+" – ₹"+c.budgetMax.toLocaleString("en-IN"):"₹"+c.p.toLocaleString("en-IN"))+'</td>'}));
row("Turnaround",cols.map(function(c){return'<td'+W(c.d==lowD)+'>'+c.d+' days</td>'}));
row("Trust",cols.map(function(c){return'<td'+W(c.tr==hiT)+'>'+c.tr+'%</td>'}));
row("Verification",cols.map(function(c){return'<td>'+he(c.verificationStatus?c.verificationStatus.charAt(0).toUpperCase()+c.verificationStatus.slice(1):(c.ev||"—"))+'</td>'}));
row("Commercial experience",cols.map(function(c){return'<td>'+he(c.commercialExperience||(c.cm===1?"Commercial rights cleared":c.cm===0?"Rights not cleared":"—"))+'</td>'}));
row("Portfolio",cols.map(function(c){return'<td>'+he((c.pr&&c.pr.length)?c.pr.map(function(p){return p[0]+" "+p[1]}).join(", "):"—")+'</td>'}));
row("Action",cols.map(function(c){return'<td><button class="ghost" data-p="'+he(cKey(c))+'">Start Project</button></td>'}));
return t+'</table><p class="note">Comparing '+CMP.length+' creators · Match % uses the AI Match Engine result when available, otherwise demo matching. Comparison is temporary and not saved. <button class="ghost" id="cmpClear">Clear selection</button></p>'}
var LASTBRIEF=null,LASTPROJECT=null,LASTREASONS=[];
function projEsc(s){return he(String(s==null?"":s))}
function demoWorkspace(c){H=c;try{wsRender()}catch(x){}setStep(3);try{$("workspace").scrollIntoView({behavior:"smooth"})}catch(x){}}
function ensureBriefId(cb){
if(LASTBRIEF&&LASTBRIEF._id){cb(LASTBRIEF._id,null);return}
var token=null;try{token=localStorage.getItem("token")}catch(x){}
var headers={};if(token)headers["Authorization"]="Bearer "+token;
fetch(API_BASE+"/api/briefs?limit=1",{headers:headers})
.then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok,j:j,status:r.status}})})
.then(function(res){
var arr=(res.j&&(res.j.data||res.j.briefs))||[];
var b=arr[0]||(res.j&&res.j.brief)||null;
if(res.ok&&b&&b._id){LASTBRIEF=b;cb(b._id,null);return}
cb(null,{message:(res.j&&res.j.message)||"",status:res.status})})
.catch(function(){cb(null,{offline:true})})}
function ensureReasons(bid,cid,cb){
var c=null;for(var i=0;i<C.length;i++)if(cKey(C[i])===cid)c=C[i];
if(c&&c.mr&&c.mr.length&&c.ms!=null){LASTREASONS=c.mr.slice();cb(LASTREASONS);return}
if(!bid||!cid){LASTREASONS=[];cb([]);return}
fetch(API_BASE+"/api/matches",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({briefId:bid})})
.then(function(r){return r.json().catch(function(){return{}})})
.then(function(j){
var arr=(j&&j.matches)||[],m=null;
for(var i=0;i<arr.length;i++){var id=arr[i].creator&&(arr[i].creator._id||arr[i].creator);if(String(id)===String(cid))m=arr[i]}
LASTREASONS=(m&&Array.isArray(m.reasons))?m.reasons:[];
cb(LASTREASONS)})
.catch(function(){LASTREASONS=(c&&c.mr)||[];cb(LASTREASONS)})}
function renderProject(p,rs){
var o=$("wsCard");if(!o||!p)return;
rs=Array.isArray(rs)?rs:[];
var ms=(p.matchScore!=null&&isFinite(p.matchScore))?Math.round(p.matchScore):(H&&H.ms!=null&&isFinite(H.ms)?Math.round(H.ms):null);
var stages=["Pending","In Progress","Review","Completed"];
var st=stages.indexOf(p.status)>-1?p.status:"Pending";
function kv(l,v){return'<div class="kv"><small>'+projEsc(l)+'</small>'+projEsc(v)+'</div>'}
var left='<div><h3>'+projEsc(p.title||p.name||"Project")+'</h3><p class="note">Creator: <b>'+projEsc(p.creatorName||(H&&H.n)||"—")+'</b>'+(p.platform?' · '+projEsc(p.platform):'')+'</p><div class="grid">'+kv("Brief idea",p.idea||"—")+kv("Platform",p.platform||"—")+kv("Content type",p.contentType||"—")+kv("Style",p.style||"—")+kv("Budget",(typeof p.budget==="number"?"₹"+p.budget.toLocaleString("en-IN"):"—"))+kv("Deadline",(p.deadline?p.deadline+" days":"—"))+kv("Project ID",p._id||"—")+'</div></div>';
var right='<div><b>Status</b><div class="qs" id="wsStatus">'+stages.map(function(x){return'<button class="'+(x===st?"on":"")+'" data-st="'+x+'">'+x+'</button>'}).join("")+'</div>';
if(ms!=null)right+='<div class="mr" style="--p:'+ms+'"><i>'+ms+'</i></div>';
if(rs.length)right+='<div class="chips">'+rs.map(function(r){return'<span class="chip ok">'+projEsc(r)+'</span>'}).join("")+'</div>';
right+='</div>';
o.innerHTML=left+right;
document.querySelectorAll("#wsStatus button").forEach(function(b){b.onclick=function(){if(LASTPROJECT)updateProjectStatus(LASTPROJECT,b.dataset.st)}})}
function updateProjectStatus(p,st){
if(!p||!p._id)return;
var token=null;try{token=localStorage.getItem("token")}catch(x){}
var headers={"Content-Type":"application/json"};if(token)headers["Authorization"]="Bearer "+token;
fetch(API_BASE+"/api/projects/"+p._id,{method:"PATCH",headers:headers,body:JSON.stringify({status:st})})
.then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok,j:j,status:r.status}})})
.then(function(res){
var np=res.j&&(res.j.project||res.j.data);
if(res.ok&&np){LASTPROJECT=np;renderProject(np,LASTREASONS||[]);toast("Status updated to "+st);return}
toast("Could not update status"+((res.j&&res.j.message)?" — "+res.j.message:" (HTTP "+res.status+")"))})
.catch(function(){toast("Could not update status — could not reach the CreatorOS API")})}
function startProject(key){
var c=null,i;
for(i=0;i<C.length;i++)if(cKey(C[i])===key)c=C[i];
if(!c)for(i=0;i<CMP.length;i++)if(CMP[i].k===key||cKey(CMP[i].c)===key)c=CMP[i].c;
if(!c){toast("Creator not found");return}
ensureBriefId(function(bid,meta){
if(!bid){
if(meta&&meta.offline){demoWorkspace(c);toast("You are offline — showing the demo workspace");return}
toast((meta&&meta.message)||"Create a brief before starting a project");
if(!(meta&&meta.message))try{$("brief").scrollIntoView({behavior:"smooth"})}catch(x){}
return}
if(!c.id){demoWorkspace(c);toast("Project started in demo mode");return}
var token=null;try{token=localStorage.getItem("token")}catch(x){}
var headers={"Content-Type":"application/json"};if(token)headers["Authorization"]="Bearer "+token;
var body={briefId:bid,creatorId:c.id};
if(c.ms!=null&&isFinite(c.ms))body.matchScore=Math.round(c.ms);
fetch(API_BASE+"/api/projects",{method:"POST",headers:headers,body:JSON.stringify(body)})
.then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok,j:j,status:r.status}})})
.then(function(res){
var p=res.j&&(res.j.project||res.j.data);
if(res.ok&&p){LASTPROJECT=p;H=c;setStep(3);ensureReasons(bid,c.id,function(rs){renderProject(p,rs)});toast("Project started");try{$("workspace").scrollIntoView({behavior:"smooth"})}catch(x){}return}
demoWorkspace(c);
toast("Could not start project"+((res.j&&res.j.message)?" — "+res.j.message:" (HTTP "+res.status+")"))})
.catch(function(){demoWorkspace(c);toast("Could not reach the CreatorOS API — demo workspace shown")})})}
function buildBrief(e){
var s=$("idea").value.trim(),k=briefCat(),miss=[];
if(!s)miss.push("Describe what you need");
if(!k)miss.push("Say what product or industry this is for");
if(!/audience|for (men|women|kids|young|teen|students)|gen ?z/i.test(s))miss.push("Add a target audience");
var fields=[["Content type",$("ct").value],["Style",$("sty").value],["Aspect ratio",$("ar2").value],["Commercial use",$("cu").value],["Industry",k?CAT[k]+" advertisement":"Not detected"],["Platform",$("plat").value],["Tone",$("tone").value],["Budget","₹"+(+$("bud").value).toLocaleString("en-IN")],["Deadline",$("dl").value+" days"],["Suggested format",/Instagram/.test($("plat").value)?"9:16 vertical, 15-30 sec":$("plat").value=="YouTube"?"16:9, 30-60 sec":"16:9 master + 1:1 cut"],["Suggested skills",k?{lux:"Cinematic lighting, Midjourney, Runway",food:"Macro product shots, motion design",shoe:"Dynamic camera, ComfyUI",tech:"Explainer, UI animation",anim:"Character design, animation"}[k]:"Add a product to get a suggestion"]];
var q=Math.max(40,100-miss.length*20);
$("briefOut").innerHTML='<div class="grid">'+fields.map(function(f){return'<div class="kv"><small>'+f[0]+'</small>'+f[1]+'</div>'}).join("")+'</div><div class="chips"><span class="chip '+(q>=80?"ok":"warn")+'">Brief quality '+q+'%</span>'+miss.map(function(m){return'<span class="chip warn">'+m+'</span>'}).join("")+'</div>';
render();if(e){$("tw").value=rank()[0].i;$("match").scrollIntoView({behavior:"smooth"})}}
function twinRule(){
var c=C[+$("tw").value],q=$("q").value,k=cat(q),o=$("ansOut");
if(!k){o.innerHTML='<div class="ans no"></div>';o.firstChild.textContent="I couldn't tell which kind of work you mean. Try naming a product, like perfume, coffee, sneakers or an app.";return}
var hit=c.pr.filter(function(x){return x[2]==k}),h;
if(hit.length){h='<div class="ans"><b>Yes, '+c.n+' has done this.</b> Evidence: '+hit.map(function(x){return x[0]+" "+x[1]}).join(", ")+'. Style fit for '+CAT[k]+': '+c.a[k]+'%. Tools: '+c.t.join(", ")+'.</div>'}
else{var nr=[];NEAR[k].forEach(function(n){c.pr.forEach(function(x){if(x[2]==n)nr.push(x)})});
h='<div class="ans no"><b>No direct '+CAT[k]+' project in '+c.n+"'s portfolio.</b> "+(nr.length?'Closest work: '+nr.map(function(x){return x[0]+" "+x[1]}).join(", ")+'. ':'')+'Style fit is '+c.a[k]+'%, so consider a paid test task first.</div>'}
o.innerHTML=h}
function fbRule(){
var s=$("fb").value.toLowerCase(),L=[],M={premium:["Lower saturation and deepen the blacks","Slow camera moves by about 20%","Add more whitespace around the logo"],pop:["Raise contrast by one step","Add one accent color from the brand palette"],energetic:["Shorten cuts to under 1.5 seconds","Increase motion speed"],warm:["Shift color temperature warmer by about 500K","Add soft golden highlights"],logo:["Increase logo size by 10%","Keep the logo in the safe area"],clean:["Remove background clutter","Limit text to one headline"],dark:["Lower exposure by half a stop","Use rim lighting for separation"]};
Object.keys(M).forEach(function(k){if(s.indexOf(k)>-1)L=L.concat(M[k])});
$("fbOut").innerHTML=L.length?'<div class="ans">'+L.map(function(x){return'<div class="li"><span>☐</span><span>'+x+'</span></div>'}).join("")+'</div>':'<div class="empty">No known phrases found. Try words like premium, pop, warm, energetic, clean, dark or logo.</div>'}
function qc(){
var w=+$("w").value,h=+$("h").value,ar=$("ar").value.split(":"),want=ar[0]/ar[1],got=w/h,ff=$("ff").value;
var T=[[Math.min(w,h)>=1080,"Resolution "+w+"×"+h+" (short side needs 1080 or more)"],[Math.abs(got-want)<0.02,"Aspect ratio matches "+$("ar").value],[["mp4","mov","png"].indexOf(ff)>-1,"Format ."+ff+" is accepted for delivery"],[$("rt").value=="1","Commercial rights declared by creator"]];
var p=T.filter(function(x){return x[0]}).length,sc=Math.round(p/T.length*100);
$("qOut").innerHTML='<div class="ans '+(sc==100?"":"no")+'"><b>Quality score '+sc+'%</b>'+T.map(function(x){return'<div class="li"><span>'+(x[0]?"✅":"⚠️")+'</span><span>'+x[1]+'</span></div>'}).join("")+'</div>'}

var H=null,step=0;
function setStep(n){step=Math.max(step,n);document.querySelectorAll(".st").forEach(function(e,i){e.className="st"+(i<step?" done":"")+(i==step?" on":"")})}
function toast(m){var t=$("toast");t.textContent=m;t.className="show";clearTimeout(toast.t);toast.t=setTimeout(function(){t.className=""},2400)}
function he(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function renderSavedBrief(b){var f=[["Idea",b.idea],["Content type",b.contentType],["Style",b.style],["Aspect ratio",b.aspectRatio],["Commercial use",b.commercialUse],["Platform",b.platform],["Tone",b.tone],["Budget",b.budget?"₹"+Number(b.budget).toLocaleString("en-IN"):"—"],["Deadline",b.deadline?b.deadline+" days":"—"],["Status",b.status||"draft"]];$("briefOut").innerHTML='<div class="grid">'+f.map(function(x){return'<div class="kv"><small>'+he(x[0])+'</small>'+he(x[1]==null||x[1]===""?"—":x[1])+'</div>'}).join("")+'</div><div class="chips"><span class="chip ok">Brief saved to your account</span><span class="chip">MongoDB · ID '+he(String(b._id||"").slice(-8))+'</span></div>'}
function brief(e){$("briefOut").innerHTML='<div class="think"><i></i><i></i><i></i>&nbsp;AI is reading your idea...</div>';
if(!e){buildBrief(e);return}
var token=null;try{token=localStorage.getItem("token")}catch(x){}
var payload={idea:$("idea").value.trim(),budget_inr:Number($("bud").value)||0,deadline_days:Number($("dl").value)||0,platform:$("plat").value,tone:$("tone").value,content_type:$("ct").value,style:$("sty").value,aspect_ratio:$("ar2").value,commercial_use:$("cu").value};
var headers={"Content-Type":"application/json"};if(token)headers["Authorization"]="Bearer "+token;
var ctrl=window.AbortController?new AbortController():null;var timer=setTimeout(function(){if(ctrl)ctrl.abort()},8000);
fetch(API_BASE+"/api/briefs",{method:"POST",headers:headers,body:JSON.stringify(payload),signal:ctrl?ctrl.signal:undefined})
.then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:!!(r.ok&&j&&j.brief),brief:j&&j.brief,message:j&&j.message,errors:(j&&j.errors)||[],status:r.status}})})
.catch(function(){return{ok:false,offline:true}})
.then(function(res){clearTimeout(timer);
if(res.ok&&res.brief){LASTBRIEF=res.brief;renderSavedBrief(res.brief);clearMatches();render();$("tw").value=rank()[0].i;runMatches(res.brief);$("match").scrollIntoView({behavior:"smooth"});save();setStep(1);aiBrief();return}
var msg=res.offline?"Could not reach the CreatorOS API"+(API_BASE?" at "+API_BASE:"")+" — showing your brief locally.":(res.message||("Brief could not be saved (HTTP "+res.status+")"))+((res.errors&&res.errors.length)?" — "+res.errors.map(function(x){return x.message}).join(", "):"");
buildBrief(e);
$("briefOut").insertAdjacentHTML("afterbegin",'<div class="ans no" style="margin:0 0 12px">⚠️ '+he(msg)+'</div>');
save();setStep(1);aiBrief();
})}
function hire(i){H=C[i];wsRender();setStep(3);toast(H.n+" hired. Project tracker is ready.");$("workspace").scrollIntoView({behavior:"smooth"})}
function wsRender(){var c=H,o=$("wsCard");
if(!c){o.innerHTML='<div class="empty">No creator hired yet. Compare creators above and press Hire.</div>';return}
var d=+$("dl").value,k=briefCat(),late=c.d-d;
var ms=[["Brief approved","Day 0"],["Concept and mood board","Day 1"],["First draft","Day "+Math.max(1,c.d-1)],["Final delivery","Day "+c.d]];
o.innerHTML='<div><h3>'+(k?CAT[k]+" campaign":"Campaign")+'</h3><p class="note">Creator: <b>'+c.n+'</b> · Quote ₹'+c.p.toLocaleString("en-IN")+'</p>'+ms.map(function(m,i){return'<div class="li"><span>'+(i==0?"✅":"⚪")+'</span><span>'+m[0]+' <small style="color:var(--mute)">'+m[1]+'</small></span></div>'}).join("")+'</div><div><b>Schedule check</b><div class="chips"><span class="chip '+(late<=0?"ok":"warn")+'">'+(late<=0?"Fits your "+d+"-day deadline":"Over deadline by "+late+" days")+'</span><span class="chip ok">Trust '+c.tr+'%</span></div><div class="prog"><i style="width:25%"></i></div><p class="note">Progress moves as milestones complete.</p><button id="toQc">Upload final file for quality check</button></div>';
$("toQc").onclick=function(){$("qc").scrollIntoView({behavior:"smooth"})}}
function save(){try{localStorage.setItem("cos",JSON.stringify({i:$("idea").value,b:$("bud").value,d:$("dl").value,p:$("plat").value,t:$("tone").value,c:$("ct").value,y:$("sty").value,a:$("ar2").value,u:$("cu").value}));mem()}catch(x){}}
function mem(){try{var m=JSON.parse(localStorage.getItem("cos")||"null");if(m){$("memTxt").textContent='Last brief: "'+m.i.slice(0,70)+'" · ₹'+m.b+' · '+m.p+' · '+m.t;$("reuse").hidden=false;$("reuse").onclick=function(){$("idea").value=m.i;$("bud").value=m.b;$("dl").value=m.d;$("plat").value=m.p;$("tone").value=m.t;if(m.c){$("ct").value=m.c;$("sty").value=m.y;$("ar2").value=m.a;$("cu").value=m.u}toast("Brief restored");$("brief").scrollIntoView({behavior:"smooth"})}}}catch(x){}}
function demo(){$("idea").value="I need a premium advertisement for my perfume brand on Instagram.";$("bud").value=25000;$("dl").value=3;$("tone").value="Premium";brief(true);
setTimeout(function(){hire(rank()[0].i)},3200);
setTimeout(function(){$("qc").scrollIntoView({behavior:"smooth"});qc();setStep(4);toast("Delivery checked")},6200)}
["Can this creator make a luxury perfume advertisement?","Do you have coffee or food ad experience?","Can you make a sneaker launch film?","Can you do a 3D animation mascot?"].forEach(function(q){var b=document.createElement("button");b.textContent=q;b.onclick=function(){$("q").value=q;twin()};$("qs").appendChild(b)});
$("demo").onclick=demo;

var S=null;
(async function(){try{S=await window.claude.use("sample")}catch(x){S=null}
$("aib").textContent=S?"✦ Live Claude AI connected":"✦ Offline demo mode (rule-based)"})();
function tx(p,t,c){var e=document.createElement(p);if(c)e.className=c;e.textContent=t;return e}
function aiBrief(){if(!S)return;var id=$("idea").value;
S.json("Turn this ad idea into a structured creative brief for AI creators. Idea: "+id+". Platform: "+$("plat").value+". Budget INR: "+$("bud").value+". Deadline days: "+$("dl").value+". Tone: "+$("tone").value+". Content type: "+$("ct").value+". Style: "+$("sty").value+". Aspect ratio: "+$("ar2").value+". Commercial use: "+$("cu").value+'. Return JSON only: {"category":"lux|food|shoe|tech|anim|other","title":"","summary":"1-2 sentences","audience":"","visual_style":"","duration":"","deliverables":["",""],"questions":["max 3 missing-info questions"]}').then(function(r){
if(["lux","food","shoe","tech","anim"].indexOf(r.category)>-1){AIK=[id,r.category];render();$("tw").value=rank()[0].i}
var d=document.createElement("div");d.className="ans";d.appendChild(tx("b","AI brief: "+(r.title||"")));
[["Summary",r.summary],["Audience",r.audience],["Visual style",r.visual_style],["Duration",r.duration],["Deliverables",(r.deliverables||[]).join(", ")]].forEach(function(x){if(x[1])d.appendChild(tx("div",x[0]+": "+x[1],"li"))});
if((r.questions||[]).length){var q=document.createElement("div");q.className="chips";r.questions.forEach(function(t){q.appendChild(tx("span",String(t),"chip warn"))});d.appendChild(q)}
$("briefOut").appendChild(d)}).catch(function(){})}
function twin(){var c=C[+$("tw").value],q=$("q").value,o=$("ansOut");
if(!S||!q.trim())return twinRule();
o.innerHTML='<div class="think"><i></i><i></i><i></i>&nbsp;Reading the portfolio...</div>';
S.json("You are the Creative Twin of an AI creator on a marketplace. Answer ONLY from this data. If no project directly proves the skill, say so plainly and name the closest project. Never invent projects. Data: "+JSON.stringify({name:c.n,tools:c.t,projects:c.pr.map(function(x){return{id:x[0],title:x[1],type:CAT[x[2]]}}),priceINR:c.p,days:c.d})+" Question: "+q+' Return JSON only: {"direct":true or false,"fit":0-100,"answer":"2-3 sentences","cited":["P1"]}').then(function(r){
var d=document.createElement("div");d.className="ans"+(r.direct?"":" no");
d.appendChild(tx("b",(r.direct?"Evidence found. ":"No direct evidence. ")+"Fit "+(+r.fit||0)+"%"));d.appendChild(document.createElement("br"));d.appendChild(document.createTextNode(String(r.answer||"")));
var ch=document.createElement("div");ch.className="chips";(r.cited||[]).forEach(function(id){var p=c.pr.filter(function(x){return x[0]==id})[0];if(p)ch.appendChild(tx("span",p[0]+" · "+p[1],"chip ok"))});d.appendChild(ch);
o.innerHTML="";o.appendChild(d)}).catch(function(){twinRule()})}
function fb(){var v=$("fb").value;if(!S||!v.trim())return fbRule();
$("fbOut").innerHTML='<div class="think"><i></i><i></i><i></i>&nbsp;Translating...</div>';
S.json("A brand gave vague feedback on an AI-generated ad. Translate it into 3-6 specific, actionable revision instructions that a creator using AI tools can execute (settings, lighting, color, pacing, logo). Feedback: "+v+' Return JSON only: {"revisions":["..."]}').then(function(r){var d=document.createElement("div");d.className="ans";(r.revisions||[]).forEach(function(t){var l=document.createElement("div");l.className="li";l.appendChild(tx("span","☐"));l.appendChild(tx("span",String(t)));d.appendChild(l)});$("fbOut").innerHTML="";$("fbOut").appendChild(d)}).catch(function(){fbRule()})}


var IMG={hero:"images/hero.jpg",bottle:"images/bottle.jpg",avatar:"images/avatar.jpg",n:"images/n.jpg",d:"images/d.jpg",p:"images/p.jpg",car:"images/car.jpg",anim:"images/anim.jpg",land:"images/land.jpg",fig:"images/fig.jpg"};var TH=[IMG.n,IMG.car,IMG.anim,IMG.p,IMG.d,IMG.fig];
function IK(k){var m={lux:"bottle",fash:"fig",shoe:"car"}[k];return m?'<img class="ti" alt="" src="'+IMG[m]+'">':SV(k)}
var AN=0;
function SV(k){var n=++AN,p={lux:["#ffb36b","#6a2fa0"],food:["#ffd9a8","#b4642e"],shoe:["#7be0ff","#7b3fe4"],tech:["#1b1f6b","#6d3bdc"],anim:["#ffe29a","#ff8fb1"],fash:["#ffd1e0","#9a8cff"]}[k]||["#ffd9a8","#8a6cff"];
var h='<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="g'+n+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient><radialGradient id="r'+n+'"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="200" height="150" fill="url(#g'+n+')"/><circle cx="100" cy="72" r="64" fill="url(#r'+n+')"/>';
var S={
lux:'<ellipse cx="100" cy="120" rx="50" ry="7" fill="#000" opacity=".25"/><rect x="96" y="48" width="8" height="8" fill="#e9b949"/><rect x="90" y="36" width="20" height="14" rx="3" fill="#f5c451"/><rect x="78" y="54" width="44" height="64" rx="11" fill="#fff" opacity=".3" stroke="#fff" stroke-width="1.5"/><rect x="83" y="78" width="34" height="34" rx="7" fill="#ffd27a" opacity=".95"/><path d="M86 62v40" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/><circle cx="150" cy="40" r="2.5" fill="#fff"/><circle cx="52" cy="58" r="2" fill="#fff"/><circle cx="140" cy="100" r="1.8" fill="#fff"/>',
food:'<ellipse cx="100" cy="128" rx="60" ry="8" fill="#fff" opacity=".55"/><path d="M60 74h80l-8 44q-2 10-14 10H82q-12 0-14-10z" fill="#fff"/><path d="M140 84h8a11 11 0 010 24h-14" stroke="#fff" stroke-width="6" fill="none"/><ellipse cx="100" cy="74" rx="40" ry="9" fill="#6b3a1e"/><path d="M88 60q-9-12 0-22t0-18M110 60q-9-12 0-22t0-18" stroke="#fff" stroke-width="4" fill="none" opacity=".75" stroke-linecap="round"/>',
shoe:'<ellipse cx="100" cy="128" rx="68" ry="7" fill="#000" opacity=".22"/><path d="M34 96q0-26 24-30l24-3q10 18 32 21 38 5 56 22v10H34z" fill="#fff"/><path d="M34 108h140v10q0 8-8 8H42q-8 0-8-8z" fill="#ff4f9a"/><path d="M62 84l14-6M74 88l14-6M86 92l14-6" stroke="#7b3fe4" stroke-width="3" stroke-linecap="round"/><path d="M60 100q50-4 100 8" stroke="#7b3fe4" stroke-width="4" fill="none" stroke-linecap="round"/>',
tech:'<ellipse cx="100" cy="74" rx="76" ry="22" fill="none" stroke="#fff" opacity=".4" transform="rotate(-18 100 74)"/><rect x="74" y="20" width="52" height="104" rx="11" fill="#0e1030" stroke="#9fb0ff" stroke-width="2"/><rect x="82" y="32" width="36" height="14" rx="4" fill="#6d5cff"/><rect x="82" y="52" width="36" height="8" rx="4" fill="#fff" opacity=".7"/><rect x="82" y="66" width="26" height="8" rx="4" fill="#fff" opacity=".4"/><rect x="82" y="86" width="36" height="22" rx="5" fill="#f59e2c"/><circle cx="160" cy="48" r="4" fill="#fff"/><circle cx="40" cy="96" r="3" fill="#fff"/>',
anim:'<circle cx="100" cy="82" r="40" fill="#6d5cff"/><circle cx="66" cy="50" r="12" fill="#6d5cff"/><circle cx="134" cy="50" r="12" fill="#6d5cff"/><circle cx="86" cy="76" r="10" fill="#fff"/><circle cx="114" cy="76" r="10" fill="#fff"/><circle cx="88" cy="78" r="5" fill="#17153b"/><circle cx="116" cy="78" r="5" fill="#17153b"/><path d="M86 98q14 14 28 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM160 112l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/>',
fash:'<circle cx="138" cy="52" r="28" fill="#ffb86b" opacity=".85"/><path d="M100 62q-34 22-38 84h76q-4-62-38-84z" fill="#17153b"/><path d="M84 96q16 8 32 0" stroke="#f59e2c" stroke-width="4" fill="none"/><ellipse cx="100" cy="44" rx="13" ry="15" fill="#f3c9b0"/><path d="M86 42q0-20 16-18 14 2 12 20-4-12-14-12-8 0-14 10z" fill="#2a1a3a"/><rect x="88" y="42" width="24" height="6" rx="3" fill="#17153b"/>'};
return h+(S[k]||S.lux)+'</svg>'}
function PO(){return '<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc3a0"/><stop offset="1" stop-color="#8a6cff"/></linearGradient></defs><rect width="200" height="150" fill="url(#pg)"/><path d="M24 150q0-40 44-44h64q44 4 44 44z" fill="#3b2a6b"/><rect x="88" y="90" width="24" height="22" fill="#e9b295"/><ellipse cx="100" cy="68" rx="25" ry="29" fill="#f0bd9f"/><path d="M72 66q-2-38 30-38 30 0 28 38-8-20-30-20-20 0-28 20z" fill="#1a1030"/><rect x="77" y="62" width="19" height="10" rx="5" fill="#17153b"/><rect x="104" y="62" width="19" height="10" rx="5" fill="#17153b"/><path d="M92 86q8 6 16 0" stroke="#c0505f" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'}
$("tl").innerHTML=[["lux","Luxury perfume ad"],["shoe","Sneaker film"],["food","Coffee story"],["fash","Fashion campaign"]].map(function(x){return'<div class="tile" data-k="'+x[0]+'" data-t="'+x[1]+'"></div>'}).join("");
document.querySelectorAll(".tile[data-k]").forEach(function(t){t.innerHTML=IK(t.dataset.k)+'<span class="tl"></span><span class="play">▶</span>';t.querySelector(".tl").textContent=t.dataset.t});
$("tl").innerHTML='<div class="hw"><div class="nf"><img class="hi" src="'+IMG.hero+'" alt="AI creative collage"></div><div class="mc" style="top:-9%;right:-5%;--r:8deg"><img src="'+IMG.car+'" alt=""></div><div class="mc" style="bottom:-11%;left:-4%;--r:-8deg"><img src="'+IMG.anim+'" alt=""></div><span class="gc" style="top:5%;left:-3%">✦ 96% match</span><span class="gc" style="bottom:-7%;right:8%;animation-delay:-2s">✔ Verified · Trust 97%</span></div>';spark(document.querySelector(".hw"),14);
$("pav").innerHTML='<img src="'+IMG.avatar+'" alt="Neshiga AI Studio">';

function spark(el,n){for(var i=0;i<n;i++){var x=Math.random()*130-15,y=Math.random()*130-15;if(x>5&&x<95&&y>5&&y<95){x=x<50?-3-Math.random()*9:103+Math.random()*9}
var e=document.createElement("span");e.className="tw";e.textContent=i%3?"✦":"✧";e.style.cssText="left:"+x+"%;top:"+y+"%;font-size:"+(9+Math.random()*14)+"px;animation-delay:-"+(Math.random()*3).toFixed(1)+"s;animation-duration:"+(2+Math.random()*2.5).toFixed(1)+"s;color:"+["#ffc24a","#ff6fae","#9a86ff","#ffffff"][i%4];el.appendChild(e)}}
(function(){var tz=window.innerWidth<760?200:310,K=["bottle","n","land","p","car","anim","d","fig"],r=$("ring");K.forEach(function(k,i){var d=document.createElement("div");d.className="c3";d.style.transform="rotateY("+i*45+"deg) translateZ("+tz+"px)";var im=document.createElement("img");im.src=IMG[k];im.alt="";d.appendChild(im);r.appendChild(d)});spark($("c3"),16);
var Q=["Every great brand story starts with one idea.","Describe it. Match it. Ship it.","The right creator is the shortest path to a great campaign.","From rough idea to final frame, all in one place.","Trust is built on proof, not promises."],qi=0,q=$("qt");q.textContent="“"+Q[0]+"”";
setInterval(function(){q.style.opacity=0;setTimeout(function(){qi=(qi+1)%Q.length;q.textContent="“"+Q[qi]+"”";q.style.opacity=1},500)},4500)})();
var FC=null;
function W(b){return b?' class="w"':''}
[[null,"All"],["lux","Luxury"],["food","Food"],["shoe","Sneaker"],["tech","Tech"],["anim","Animation"]].forEach(function(x){var b=document.createElement("button");b.textContent=x[1];b.className=x[0]===null?"on":"";b.onclick=function(){FC=x[0];document.querySelectorAll("#fchips button").forEach(function(y){y.className=""});b.className="on";render()};$("fchips").appendChild(b)});
$("srch").oninput=render;$("ft").onchange=render;$("fc").onchange=render;
$("idea").onkeydown=function(e){if((e.ctrlKey||e.metaKey)&&e.key=="Enter")brief(true)};
function theme(t){document.documentElement.dataset.theme=t;$("theme").textContent=t=="dark"?"☀️":"🌙";try{localStorage.setItem("cth",t)}catch(x){}}
var th=null;try{th=localStorage.getItem("cth")}catch(x){}
theme(th||(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));
$("theme").onclick=function(){theme(document.documentElement.dataset.theme=="dark"?"light":"dark")};
var secs=[];document.querySelectorAll("header a[href^='#']").forEach(function(a){var e=document.querySelector(a.getAttribute("href"));if(e&&a.className!="btn")secs.push([a,e])});
function spy(){var y=window.innerHeight*.35,cur=null;secs.forEach(function(x){if(x[1].getBoundingClientRect().top<=y)cur=x[0]});secs.forEach(function(x){x[0].classList.toggle("on",x[0]===cur)})}
window.addEventListener("scroll",spy,{passive:true});spy();
$("go").onclick=brief;$("ask").onclick=twin;$("tr").onclick=fb;$("qb").onclick=function(){qc();setStep(4)};
["ws","wb","wd"].forEach(function(i){$(i).oninput=render});
function fromApi(c){var tools=(c.tools||[]).map(function(t){return typeof t==="string"?t:(t&&t.name)||""}).filter(Boolean);
var dna=(c.creativeDNA&&c.creativeDNA.categoryScores)||{};
var a={lux:dna.lux||0,food:dna.food||0,shoe:dna.shoe||0,tech:dna.tech||0,anim:dna.anim||0};
var pr=((c.portfolio||[]).filter(Boolean)).map(function(p,k){return["P"+(k+1),p.title||"Untitled work",(p.category||p.contentType||"tech")]});
if(!pr.length){var top="tech",mx=-1;for(var key in a){if(a[key]>mx){mx=a[key];top=key}}pr.push(["P1","Showcase reel",top])}
return{n:c.name||"Untitled Creator",ct:c.contentTypes||[],c:c.location||"India",t:tools,a:a,
p:c.budgetMin||c.startingPrice||0,d:c.turnaroundDays||c.deliveryDays||5,
tr:c.trustScore==null?50:c.trustScore,
ev:c.verificationStatus==="verified"?"Verified samples, metadata matched, no duplicates":"Verification "+(c.verificationStatus||"unverified")+", "+(c.projectsCompleted||0)+" projects delivered",
cm:(c.commercialReady||c.commercialExperience)?1:0,pr:pr,
style:c.style||"",industries:c.industries||[],platforms:c.platforms||[],
budgetMax:c.budgetMax||0,bio:c.bio||"",avatar:c.avatar||"",
skills:c.skills||[],commercialExperience:c.commercialExperience||"",
verificationStatus:c.verificationStatus||"unverified",source:"api",id:c._id}}
function loadCreators(){return fetch(API_BASE+"/api/creators?limit=50").then(function(r){if(!r.ok)throw 0;return r.json().catch(function(){throw 0})}).then(function(j){
var arr=j&&Array.isArray(j.creators)?j.creators:(j&&Array.isArray(j.data)?j.data:[]);
if(!arr.length)throw 0;
C=arr.map(fromApi);
$("tw").innerHTML=C.map(function(c,i){return'<option value="'+i+'">'+c.n+'</option>'}).join("");
render();return true}).catch(function(){return false})}
function clearMatches(){var changed=false;C.forEach(function(c){if(c.ms!=null||c.mr){delete c.ms;delete c.mr;changed=true}});return changed}
function applyMatches(ms){var next=[];
(ms||[]).forEach(function(m){if(!m||!m.creator)return;var c=fromApi(m.creator);c.ms=Math.round(m.matchScore);c.mr=Array.isArray(m.reasons)?m.reasons:[];next.push(c)});
if(!next.length)return false;
C=next;
$("tw").innerHTML=C.map(function(c,i){return'<option value="'+i+'">'+c.n+'</option>'}).join("");
render();$("tw").value=rank()[0].i;
toast("AI matched "+C.length+" creators to your brief");return true}
function runMatches(b){if(!b||!b._id)return Promise.resolve(false);
return fetch(API_BASE+"/api/matches",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({briefId:b._id})})
.then(function(r){if(!r.ok)throw 0;return r.json().catch(function(){throw 0})})
.then(function(j){if(!j||!j.success||!Array.isArray(j.matches)||!j.matches.length)throw 0;return applyMatches(j.matches)})
.catch(function(){return false})}
$("tw").innerHTML=C.map(function(c,i){return'<option value="'+i+'">'+c.n+'</option>'}).join("");
wsRender();mem();setStep(0);brief();window.scrollTo(0,0);loadCreators();
}
