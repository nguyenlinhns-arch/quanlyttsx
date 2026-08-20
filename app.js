const FALLBACK={
  asOf:'20/08/2026',
  totals:{total:1432,active:1123,drop:309,grad:133},
  companies:[
    ['Dương Huy',73,55,18,13],['Hà Lầm',73,52,21,0],['Hạ Long',128,106,22,58],['Hòn Gai',134,121,13,0],
    ['Khe Chàm',208,155,53,0],['Mạo Khê',64,52,12,0],['Mông Dương',75,54,21,0],['Nam Mẫu',116,92,24,0],
    ['Núi Béo',110,82,28,0],['Quang Hanh',53,40,13,7],['Sin Quyền',97,96,1,0],['Thống Nhất',58,29,29,43],
    ['Uông Bí',47,42,5,0],['Vàng Danh',166,139,27,0],['Xây Lắp Mỏ',30,8,22,12]
  ].map(([name,total,active,drop,grad])=>({name,total,active,drop,grad,dropRate:total?drop/total:0,activeRate:total?active/total:0})),
  provinces:[
    ['Quảng Ninh',573,481,92],['Lào Cai',131,122,9],['Tuyên Quang',76,57,19],['Hưng Yên',34,28,6],
    ['Thái Nguyên',30,23,7],['Hải Phòng',29,23,6],['Lai Châu',29,22,7],['Ninh Bình',28,22,6],
    ['Quảng Ngãi',28,11,17],['Thanh Hóa',27,21,6],['Lạng Sơn',25,19,6],['Cao Bằng',22,20,2],
    ['Điện Biên',22,18,4],['Sơn La',21,16,5],['Nghệ An',17,14,3],['Phú Thọ',16,10,6],
    ['Bắc Ninh',12,10,2],['Gia Lai',12,8,4],['Đắk Lắk',6,3,3],['Quảng Trị',6,4,2],
    ['Cần Thơ',4,2,2],['Hà Nội',4,1,3],['Lâm Đồng',4,2,2],['Đà Nẵng',3,3,0],['Hà Tĩnh',3,2,1],
    ['An Giang',2,1,1],['Đồng Nai',2,0,2],['Huế',2,1,1],['Vĩnh Long',2,1,1],['Khánh Hòa',1,1,0],
    ['TP. Hồ Chí Minh',1,0,1],['Chưa rõ tỉnh',260,177,83]
  ].map(([name,total,active,drop])=>({name,total,active,drop,dropRate:total?drop/total:0,activeRate:total?active/total:0}))
};

const CFG={
  sheetId:'1dePuxVQBhOFCynpRmVDcxnHi5aoR-UtwZWwn2Y7GkDs',
  publicSheetId:'1dePuxVQBhOFCynpRmVDcxnHi5aoR-UtwZWwn2Y7GkDs',
  rawSheet:'_WEB_DATA',rawRange:'A1:AW5000',rawCoreRange:'A1:G5000',
  companySheet:'TK theo doanh nghiệp',companyRange:'A4:F20',
  provinceSheet:'TK theo tỉnh',provinceRange:'A4:E100',
  autoRefreshMs:300000
};
const state={rows:[],scopeRows:[],dates:[],live:false,coreOnly:false,companySummary:[],provinceSummary:[],audit:{ok:false,message:''},feedId:CFG.sheetId,refreshing:false,lastRefresh:0};
const $=id=>document.getElementById(id);
const nf=new Intl.NumberFormat('vi-VN');
const pf=v=>new Intl.NumberFormat('vi-VN',{style:'percent',maximumFractionDigits:1}).format(Number.isFinite(v)?v:0);

function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function num(v){if(typeof v==='number'&&Number.isFinite(v))return v;const n=Number(String(v??'').replace(/,/g,'').replace('%','').trim());return Number.isFinite(n)?n:0}
function statusOf(v){const n=norm(v);if(n==='dang thuc tap'||n==='dang tt')return'active';if(n==='bo'||n==='bo hoc'||n==='bo ttsx')return'dropped';if(n.includes('tot nghiep'))return'graduated';return'other'}
function isUnknown(v){const n=norm(v);return !n||n.includes('chua ro')}
function setSync(cls,text){$('sync').className='sync '+cls;$('sync').querySelector('span:last-child').textContent=text}
function metrics(rows){let active=0,drop=0,grad=0,other=0;for(const r of rows){if(r.status==='active')active++;else if(r.status==='dropped')drop++;else if(r.status==='graduated')grad++;else other++}const total=active+drop;return{total,active,drop,grad,other,dropRate:total?drop/total:0,activeRate:total?active/total:0}}
function summaryMetrics(companies){const m=companies.reduce((a,x)=>({total:a.total+x.total,active:a.active+x.active,drop:a.drop+x.drop,grad:a.grad+x.grad}),{total:0,active:0,drop:0,grad:0});return{...m,other:0,dropRate:m.total?m.drop/m.total:0,activeRate:m.total?m.active/m.total:0}}
function group(rows,key){const m=new Map;for(const r of rows){const k=r[key]||'Chưa rõ';if(!m.has(k))m.set(k,[]);m.get(k).push(r)}return[...m.entries()]}
function currentFilters(){return{company:$('company').value,province:$('province').value,campus:$('campus').value,recruitment:$('recruitment').value,unit:$('unit').value}}
function isUnfiltered(){return Object.values(currentFilters()).every(v=>!v)}

function fillSelect(id,vals){const s=$(id),cur=s.value;const unique=[...new Set(vals.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'vi'));s.innerHTML='<option value="">Tất cả</option>'+unique.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');if([...s.options].some(o=>o.value===cur))s.value=cur}
function renderKpis(m){$('kTotal').textContent=nf.format(m.total);$('kActive').textContent=nf.format(m.active);$('kDrop').textContent=nf.format(m.drop);$('kGrad').textContent=nf.format(m.grad);$('kDropRate').textContent=pf(m.dropRate);$('kDropRateSub').textContent=pf(m.dropRate);$('kActiveRate').textContent=pf(m.activeRate);$('kActivePct').textContent=pf(m.activeRate)}
function countBars(el,arr,getVal,getName,getLabel,limit=15){const a=arr.slice(0,limit),mx=Math.max(1,...a.map(getVal));el.innerHTML=a.length?a.map(x=>{const val=getVal(x),name=getName(x);return `<div class="bar-row"><div class="bar-name" title="${escapeHtml(name)}">${escapeHtml(name)}</div><div class="track"><div class="fill" style="width:${val?Math.max(1,val/mx*100):0}%"></div></div><div class="bar-value">${getLabel(x)}</div></div>`}).join(''):'<div class="notice">Không có dữ liệu trong phạm vi lọc.</div>'}
function rateBars(el,arr,limit=15){const a=arr.slice(0,limit);el.innerHTML=a.length?a.map(x=>{const pct=Math.max(0,Math.min(100,x.dropRate*100)),title=`${x.drop} HS bỏ / ${x.total} HS đi TTSX = ${pf(x.dropRate)}`;return `<div class="bar-row"><div class="bar-name" title="${escapeHtml(title)}">${escapeHtml(x.name)}</div><div class="track"><div class="fill red" style="width:${pct}%"></div></div><div class="bar-value" title="${escapeHtml(title)}">${pf(x.dropRate)}</div></div>`}).join(''):'<div class="notice">Không có dữ liệu trong phạm vi lọc.</div>'}

function renderFallback(){renderKpis(summaryMetrics(FALLBACK.companies));renderCompanyBlocks(FALLBACK.companies);renderProvinceBlocks(FALLBACK.provinces);$('scope').textContent='Toàn bộ dữ liệu · snapshot dự phòng';$('updated').textContent='Snapshot '+FALLBACK.asOf;$('quality').innerHTML='<div class="quality-empty">Không đọc được feed public. Đang dùng snapshot dự phòng.</div>';['dExpected','dEntered','dScore','dSick','dLeave','dKld','dMissing'].forEach(id=>$(id).textContent='—');$('day').innerHTML='<option>Chưa có dữ liệu trực tiếp</option>';$('day').disabled=true;$('coverage').innerHTML='<div class="notice">Chưa kết nối dữ liệu theo ngày.</div>';$('hotspots').innerHTML='<div class="notice">Chưa kết nối dữ liệu chi tiết.</div>'}
function renderCompanyBlocks(companies){const arr=companies.slice();countBars($('companyBars'),arr.slice().sort((a,b)=>b.total-a.total),x=>x.total,x=>x.name,x=>nf.format(x.total));rateBars($('dropBars'),arr.slice().sort((a,b)=>b.dropRate-a.dropRate));$('companyTable').innerHTML=arr.slice().sort((a,b)=>a.name.localeCompare(b.name,'vi')).map(x=>`<tr><td>${escapeHtml(x.name)}</td><td>${nf.format(x.total)}</td><td>${nf.format(x.active)}</td><td class="${x.drop>=20?'danger':''}">${nf.format(x.drop)}</td><td class="${x.dropRate>=.3?'danger':''}" title="${x.drop} / ${x.total}">${pf(x.dropRate)}</td></tr>`).join('')}
function renderProvinceBlocks(provinces){countBars($('provinceBars'),provinces.slice().sort((a,b)=>b.total-a.total),x=>x.total,x=>x.name,x=>nf.format(x.total),12)}

function cellRaw(c){return c?.v??c?.f??''}
function cellText(c){return String(c?.f??c?.v??'').trim()}
function parseRawTable(t,forcedHeaders=null){const headers=forcedHeaders||t.cols.map((c,i)=>c.label||c.id||('C'+i));const rows=t.rows.map(row=>{const v=headers.map((_,i)=>cellRaw(row.c?.[i]));const r={id:v[0],company:String(v[1]??'').trim(),province:String(v[2]??'').trim(),campus:String(v[3]??'').trim(),recruitment:String(v[4]??'').trim(),unit:String(v[5]??'').trim(),statusRaw:String(v[6]??'').trim(),status:statusOf(v[6]),daily:{}};for(let i=7;i<headers.length;i++)r.daily[headers[i]]=v[i];return r}).filter(r=>r.company);return{headers,rows}}
function parseCompanySummary(t){return t.rows.map(row=>{const name=cellText(row.c?.[0]);if(!name||norm(name)==='tong cong')return null;const total=num(cellRaw(row.c?.[1])),active=num(cellRaw(row.c?.[2])),drop=num(cellRaw(row.c?.[3])),grad=num(cellRaw(row.c?.[4]));return{name,total,active,drop,grad,dropRate:total?drop/total:0,activeRate:total?active/total:0}}).filter(Boolean)}
function parseProvinceSummary(t){return t.rows.map(row=>{const name=cellText(row.c?.[0]);if(!name||norm(name)==='tong cong')return null;const total=num(cellRaw(row.c?.[1])),active=num(cellRaw(row.c?.[2])),drop=num(cellRaw(row.c?.[3]));return{name,total,active,drop,dropRate:total?drop/total:0,activeRate:total?active/total:0}}).filter(Boolean)}

function loadGviz(sheet,range,parser,timeout=30000,sheetId=state.feedId||CFG.sheetId,headerRows=1){return new Promise((resolve,reject)=>{const cb='__ttsx_'+Date.now()+'_'+Math.random().toString(36).slice(2),scriptId='s_'+cb;let done=false;const timer=setTimeout(()=>finish(new Error(`Quá thời gian tải ${sheet}`)),timeout);function finish(err,data){if(done)return;done=true;clearTimeout(timer);delete window[cb];document.getElementById(scriptId)?.remove();err?reject(err):resolve(data)}window[cb]=resp=>{if(resp?.status!=='ok'||!resp.table)return finish(new Error(resp?.errors?.[0]?.detailed_message||`Không đọc được ${sheet}`));try{finish(null,parser(resp.table))}catch(e){finish(e)}};const s=document.createElement('script');s.id=scriptId;const tqx=encodeURIComponent('out:json;responseHandler:'+cb);s.src=`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheet)}&range=${encodeURIComponent(range)}&headers=${headerRows}&tqx=${tqx}&_=${Date.now()}`;s.onerror=()=>finish(new Error(`Không tải được ${sheet}`));document.head.appendChild(s)})}

async function loadFullRawChunked(feedId,expectedRows){
  const chunkSize=600,lastSheetRow=expectedRows+1,firstEnd=Math.min(lastSheetRow,chunkSize+1);
  const first=await loadGviz(CFG.rawSheet,`A1:AW${firstEnd}`,parseRawTable,30000,feedId,1);
  const headers=first.headers,rows=[...first.rows];
  for(let start=firstEnd+1;start<=lastSheetRow;start+=chunkSize){
    const end=Math.min(lastSheetRow,start+chunkSize-1);
    const part=await loadGviz(CFG.rawSheet,`A${start}:AW${end}`,t=>parseRawTable(t,headers),30000,feedId,0);
    rows.push(...part.rows);
  }
  if(rows.length!==expectedRows)throw new Error(`Dải dữ liệu ngày không đủ dòng (${rows.length}/${expectedRows})`);
  return{headers,rows};
}
function mergeCoreAndDaily(core,full){
  const byId=new Map(full.rows.map(r=>[String(r.id),r]));
  return{headers:full.headers,rows:core.rows.map(r=>{const f=byId.get(String(r.id));return f?{...r,daily:f.daily}:{...r,daily:{}}})};
}

function hydrate(){fillSelect('company',state.rows.map(r=>r.company));fillSelect('province',state.rows.map(r=>r.province));fillSelect('campus',state.rows.map(r=>r.campus));fillSelect('recruitment',state.rows.map(r=>r.recruitment));fillSelect('unit',state.rows.map(r=>r.unit));if(state.dates.length){$('day').disabled=false;$('day').innerHTML=state.dates.map(d=>`<option>${escapeHtml(d)}</option>`).join('');const today=new Date().toLocaleDateString('vi-VN');if(state.dates.includes(today))$('day').value=today;else $('day').selectedIndex=Math.max(0,state.dates.length-1)}else{$('day').innerHTML='<option>Chưa tải dữ liệu theo ngày</option>';$('day').disabled=true}}
function deriveCompanies(rows){return group(rows,'company').map(([name,a])=>({name,...metrics(a)}))}
function deriveProvinces(rows){return group(rows,'province').map(([name,a])=>({name,...metrics(a)}))}
function auditConsistency(){if(!state.rows.length||!state.companySummary.length)return{ok:false,message:'Chưa đủ dữ liệu để đối soát.'};const rawMap=new Map(deriveCompanies(state.rows).map(x=>[norm(x.name),x])),diffs=[];for(const s of state.companySummary){const r=rawMap.get(norm(s.name));if(!r||r.total!==s.total||r.active!==s.active||r.drop!==s.drop||r.grad!==s.grad)diffs.push(`${s.name}: raw ${r?`${r.total}/${r.active}/${r.drop}/${r.grad}`:'thiếu'} ≠ chuẩn ${s.total}/${s.active}/${s.drop}/${s.grad}`)}const rawTotal=metrics(state.rows),sumTotal=summaryMetrics(state.companySummary);if(rawTotal.total!==sumTotal.total||rawTotal.active!==sumTotal.active||rawTotal.drop!==sumTotal.drop||rawTotal.grad!==sumTotal.grad)diffs.push(`Tổng: raw ${rawTotal.total}/${rawTotal.active}/${rawTotal.drop}/${rawTotal.grad} ≠ chuẩn ${sumTotal.total}/${sumTotal.active}/${sumTotal.drop}/${sumTotal.grad}`);return diffs.length?{ok:false,message:'Có chênh lệch nguồn: '+diffs.slice(0,3).join('; ')}:{ok:true,message:`Đối soát đạt: ${nf.format(sumTotal.total)} HS = ${nf.format(sumTotal.active)} đang TT + ${nf.format(sumTotal.drop)} bỏ; 15 DN khớp bảng thống kê chuẩn.`}}

function apply(){if(!state.live)return;const f=currentFilters();state.scopeRows=state.rows.filter(r=>Object.entries(f).every(([k,v])=>!v||r[k]===v));const m=metrics(state.scopeRows);$('scope').textContent=isUnfiltered()?'Toàn bộ dữ liệu':`${nf.format(state.scopeRows.length)} bản ghi · ${nf.format(m.total)} HS đi TTSX trong phạm vi lọc`;renderLive()}
function renderLive(){const unfiltered=isUnfiltered(),baseRows=state.scopeRows,companyData=unfiltered&&state.companySummary.length?state.companySummary:deriveCompanies(baseRows),provinceData=unfiltered&&state.provinceSummary.length?state.provinceSummary:deriveProvinces(baseRows),m=unfiltered&&state.companySummary.length?summaryMetrics(state.companySummary):metrics(baseRows);renderKpis(m);renderCompanyBlocks(companyData);renderProvinceBlocks(provinceData);const unknownProvince=baseRows.filter(r=>isUnknown(r.province)).length,unknownCampus=baseRows.filter(r=>isUnknown(r.campus)).length,unknownRecruit=baseRows.filter(r=>isUnknown(r.recruitment)).length,unknownUnit=baseRows.filter(r=>isUnknown(r.unit)).length;$('quality').innerHTML=[[unknownProvince,'Chưa rõ tỉnh'],[unknownCampus,'Thiếu/chưa rõ phân hiệu'],[unknownRecruit,'Thiếu/chưa rõ đơn vị tuyển'],[unknownUnit,'Thiếu/chưa rõ công trường']].map(([v,l])=>`<div class="q"><strong>${nf.format(v)}</strong><span>${l}</span></div>`).join('');renderDaily();renderHotspots()}

function classifyDay(v){if(typeof v==='number'&&Number.isFinite(v))return'score';const s=String(v??'').trim();if(!s)return'blank';if(Number.isFinite(Number(s.replace(',','.'))))return'score';if(s.toUpperCase()==='Ô')return'sick';if(s.toUpperCase()==='N')return'leave';if(s.toUpperCase()==='KLD')return'kld';return'other'}
function renderDaily(){if(!state.live)return;if(state.coreOnly||!state.dates.length){['dExpected','dEntered','dScore','dSick','dLeave','dKld','dMissing'].forEach(id=>$(id).textContent='—');$('coverage').innerHTML='<div class="notice">Đã kết nối dữ liệu thống kê nhưng chưa tải được dải theo dõi ngày.</div>';return}const day=$('day').value;if(!day){$('coverage').innerHTML='<div class="notice">Chưa chọn ngày theo dõi.</div>';return}const rows=state.scopeRows.filter(r=>r.status==='active');let score=0,sick=0,leave=0,kld=0,other=0;for(const r of rows){const t=classifyDay(r.daily[day]);if(t==='score')score++;else if(t==='sick')sick++;else if(t==='leave')leave++;else if(t==='kld')kld++;else if(t==='other')other++}const entered=score+sick+leave+kld+other,missing=Math.max(0,rows.length-entered);[['dExpected',rows.length],['dEntered',entered],['dScore',score],['dSick',sick],['dLeave',leave],['dKld',kld],['dMissing',missing]].forEach(([id,v])=>$(id).textContent=nf.format(v));const cov=group(rows,'company').map(([name,a])=>{const enteredCount=a.filter(r=>classifyDay(r.daily[day])!=='blank').length;return{name,expected:a.length,entered:enteredCount,rate:a.length?enteredCount/a.length:0}}).sort((a,b)=>b.rate-a.rate||b.expected-a.expected);$('coverage').innerHTML=cov.length?cov.slice(0,15).map(x=>{const title=`${x.entered}/${x.expected} HS đã nhập ngày ${day}`;return `<div class="bar-row"><div class="bar-name" title="${escapeHtml(title)}">${escapeHtml(x.name)}</div><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,x.rate*100))}%"></div></div><div class="bar-value" title="${escapeHtml(title)}">${pf(x.rate)}</div></div>`}).join(''):'<div class="notice">Không có HS đang thực tập trong phạm vi lọc.</div>'}
function renderHotspots(){const drops=state.scopeRows.filter(r=>r.status==='dropped'&&r.unit&&r.company&&!isUnknown(r.unit)),pairMap=new Map;for(const r of drops){const company=String(r.company).trim(),unit=String(r.unit).trim(),key=norm(company)+'\u0000'+norm(unit);if(!pairMap.has(key))pairMap.set(key,{company,unit,count:0});pairMap.get(key).count++}const pairs=[...pairMap.values()].filter(x=>x.count>=3),companyMap=new Map;for(const x of pairs){const key=norm(x.company);if(!companyMap.has(key))companyMap.set(key,{company:x.company,total:0,units:[]});const g=companyMap.get(key);g.total+=x.count;g.units.push({unit:x.unit,count:x.count})}const groups=[...companyMap.values()].map(g=>({...g,units:g.units.sort((a,b)=>b.count-a.count||a.unit.localeCompare(b.unit,'vi'))})).sort((a,b)=>b.total-a.total||a.company.localeCompare(b.company,'vi'));$('hotspots').innerHTML=groups.length?groups.map(g=>`<div class="hot-company-row"><div class="hot-company-box"><strong>${escapeHtml(g.company)}</strong><span>${nf.format(g.total)} HS bỏ tại ${g.units.length} công trường</span></div><div class="hot-unit-list">${g.units.map(u=>`<div class="hot-unit"><span>${escapeHtml(u.unit)}</span><b>${nf.format(u.count)} HS bỏ</b></div>`).join('')}</div></div>`).join(''):'<div class="notice ok">Không có công trường nào đạt ngưỡng ≥3 HS bỏ trong phạm vi lọc.</div>'}

async function loadFeed(feedId){
  state.feedId=feedId;
  const compP=loadGviz(CFG.companySheet,CFG.companyRange,parseCompanySummary,30000,feedId),provP=loadGviz(CFG.provinceSheet,CFG.provinceRange,parseProvinceSummary,30000,feedId);
  const core=await loadGviz(CFG.rawSheet,CFG.rawCoreRange,parseRawTable,30000,feedId);
  if(!core.rows.length)throw new Error('Feed lõi không có dữ liệu.');
  let raw=core,coreOnly=true;
  try{
    const full=await loadFullRawChunked(feedId,core.rows.length);
    raw=mergeCoreAndDaily(core,full);
    coreOnly=false;
  }catch(fullErr){
    console.warn('Daily feed failed; keep authoritative core rows',fullErr);
  }
  const [companies,provinces]=await Promise.all([compP,provP]);
  return{raw,coreOnly,companies,provinces};
}
async function refresh(){if(state.refreshing)return;state.refreshing=true;setSync('','Đang kết nối feed ẩn danh');$('notice').className='notice';$('notice').textContent='Đang nạp và đối soát dữ liệu từ TTSX_WEB_PUBLIC...';try{const {raw,coreOnly,companies,provinces}=await loadFeed(CFG.sheetId);state.rows=raw.rows;state.scopeRows=raw.rows;state.dates=coreOnly?[]:raw.headers.slice(7);state.live=true;state.coreOnly=coreOnly;state.companySummary=companies.length?companies:FALLBACK.companies;state.provinceSummary=provinces.length?provinces:FALLBACK.provinces;state.lastRefresh=Date.now();hydrate();state.audit=auditConsistency();apply();setSync('ok',coreOnly?'Feed ẩn danh · lõi':'Feed ẩn danh · trực tiếp');$('notice').className=state.audit.ok?'notice ok':'notice err';$('notice').textContent=(state.audit.ok?'Feed public đã đối soát. ':'Cảnh báo đối soát. ')+state.audit.message+(coreOnly?' Phần theo dõi ngày chưa tải được.':'');$('updated').textContent='Đồng bộ '+new Date().toLocaleString('vi-VN',{hour12:false})}catch(e){console.error(e);state.live=false;state.coreOnly=false;state.companySummary=FALLBACK.companies;state.provinceSummary=FALLBACK.provinces;renderFallback();setSync('err','Feed public lỗi · snapshot');$('notice').className='notice err';$('notice').textContent='Không kết nối được TTSX_WEB_PUBLIC: '+e.message+'. Dashboard đang dùng snapshot dự phòng.'}finally{state.refreshing=false}}

['company','province','campus','recruitment','unit'].forEach(id=>$(id).addEventListener('change',apply));
$('day').addEventListener('change',renderDaily);
$('clear').addEventListener('click',()=>{['company','province','campus','recruitment','unit'].forEach(id=>$(id).value='');apply()});
$('refresh').addEventListener('click',refresh);
setInterval(()=>{if(document.visibilityState==='visible')refresh()},CFG.autoRefreshMs);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&Date.now()-state.lastRefresh>60000)refresh()});
window.addEventListener('focus',()=>{if(Date.now()-state.lastRefresh>60000)refresh()});
renderFallback();refresh();