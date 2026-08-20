(function(){
'use strict';
const CORE_SHEET='_WEB_CORE';
const CORE_CHUNK=400;
let recovering=false;

async function loadCoreChunked(expectedRows){
  const lastSheetRow=expectedRows+1;
  const firstEnd=Math.min(lastSheetRow,CORE_CHUNK+1);
  const first=await loadGviz(CORE_SHEET,`A1:G${firstEnd}`,parseRawTable,30000,CFG.sheetId,1);
  const headers=first.headers;
  const rows=[...first.rows];
  for(let start=firstEnd+1;start<=lastSheetRow;start+=CORE_CHUNK){
    const end=Math.min(lastSheetRow,start+CORE_CHUNK-1);
    const part=await loadGviz(CORE_SHEET,`A${start}:G${end}`,t=>parseRawTable(t,headers),30000,CFG.sheetId,0);
    rows.push(...part.rows);
  }
  return {headers,rows};
}

function parseHotspotSummaryLocal(table){
  return table.rows.map(row=>{
    const company=cellText(row.c?.[0]);
    if(!company||norm(company)==='doanh nghiep')return null;
    const detail=cellText(row.c?.[2]);
    const units=detail.split(';').map(x=>x.trim()).map(part=>{
      const m=part.match(/^(.*?):\s*(\d+)\s*HS/i);
      return m?{unit:m[1].trim(),count:Number(m[2])}:null;
    }).filter(x=>x&&x.count>=3);
    if(!units.length)return null;
    return {company,total:units.reduce((a,x)=>a+x.count,0),units:units.sort((a,b)=>b.count-a.count||a.unit.localeCompare(b.unit,'vi'))};
  }).filter(Boolean);
}

function renderHotspotSummaryLocal(groups){
  const el=$('hotspots');
  if(!el)return;
  el.innerHTML=groups.length?groups.map(g=>`<div class="hot-company-row"><div class="hot-company-box"><strong>${escapeHtml(g.company)}</strong><span>${nf.format(g.total)} HS bỏ tại ${g.units.length} công trường cảnh báo</span></div><div class="hot-unit-list">${g.units.map(u=>`<div class="hot-unit"><span>${escapeHtml(u.unit)}</span><b>${nf.format(u.count)} HS bỏ</b></div>`).join('')}</div></div>`).join(''):'<div class="notice ok">Không có công trường nào đạt ngưỡng ≥3 HS bỏ.</div>';
}

async function recoverHotspots(){
  try{
    const groups=await loadGviz('TK theo doanh nghiệp','A24:F40',parseHotspotSummaryLocal,30000,CFG.sheetId);
    state.hotspotSummary=groups;
    renderHotspotSummaryLocal(groups);
  }catch(e){
    console.warn('Hotspot recovery unavailable',e);
    if(state.live&&typeof renderHotspots==='function')renderHotspots();
  }
}

async function recoverCore(){
  if(recovering)return;
  recovering=true;
  try{
    const [companies,provinces]=await Promise.all([
      loadGviz(CFG.companySheet,CFG.companyRange,parseCompanySummary,30000,CFG.sheetId),
      loadGviz(CFG.provinceSheet,CFG.provinceRange,parseProvinceSummary,30000,CFG.sheetId)
    ]);
    const expected=summaryMetrics(companies);
    const expectedRows=expected.total+expected.grad;
    if(expectedRows<1)throw new Error('Bảng thống kê doanh nghiệp không có số liệu.');

    const core=await loadCoreChunked(expectedRows);
    const companyCount=new Set(core.rows.map(r=>norm(r.company)).filter(Boolean)).size;
    if(core.rows.length!==expectedRows||companyCount!==15){
      throw new Error(`Feed lõi chưa đủ: ${core.rows.length}/${expectedRows} bản ghi; ${companyCount}/15 DN`);
    }

    let raw=core,coreOnly=true,dates=[];
    try{
      if(typeof loadFullRawChunked==='function'&&typeof mergeCoreAndDaily==='function'){
        const full=await loadFullRawChunked(CFG.sheetId,expectedRows);
        raw=mergeCoreAndDaily(core,full);
        dates=full.headers.slice(7);
        coreOnly=false;
      }
    }catch(e){
      console.warn('Daily recovery unavailable; keep core live',e);
    }

    state.rows=raw.rows;
    state.scopeRows=raw.rows;
    state.companySummary=companies;
    state.provinceSummary=provinces;
    state.live=true;
    state.coreOnly=coreOnly;
    state.dates=dates;
    state.lastRefresh=Date.now();
    hydrate();
    state.audit=auditConsistency();
    apply();
    await recoverHotspots();
    setSync('ok',coreOnly?'Feed ẩn danh · lõi':'Feed ẩn danh · trực tiếp');
    $('notice').className='notice ok';
    $('notice').textContent=`Feed public đã đối soát: ${nf.format(expected.total)} HS = ${nf.format(expected.active)} đang TT + ${nf.format(expected.drop)} bỏ; ${nf.format(expected.grad)} tốt nghiệp; 15/15 DN khớp.${coreOnly?' Dữ liệu ngày chưa tải được nên chỉ ẩn phần theo dõi ngày.':''}`;
    $('updated').textContent='Đồng bộ '+new Date().toLocaleString('vi-VN',{hour12:false});
  }catch(e){
    console.error('Core recovery',e);
    await recoverHotspots();
  }finally{
    recovering=false;
  }
}

// Khôi phục ngay sau loader cũ, lặp lại sau các mốc để tránh race với các patch cũ.
setTimeout(recoverHotspots,600);
setTimeout(recoverCore,1000);
setTimeout(recoverCore,4000);
setTimeout(recoverCore,10000);
const btn=document.getElementById('refresh');
if(btn)btn.addEventListener('click',()=>setTimeout(recoverCore,300));
window.addEventListener('focus',()=>{if(Date.now()-state.lastRefresh>60000)setTimeout(recoverCore,250)});
})();
