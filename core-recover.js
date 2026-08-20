(function(){
'use strict';
const CORE_SHEET='_WEB_CORE';
const CORE_RANGE='A1:G2000';
let recovering=false;

async function recoverCore(){
  if(recovering)return;
  recovering=true;
  try{
    const [core,companies,provinces]=await Promise.all([
      loadGviz(CORE_SHEET,CORE_RANGE,parseRawTable,30000,CFG.sheetId),
      loadGviz(CFG.companySheet,CFG.companyRange,parseCompanySummary,30000,CFG.sheetId),
      loadGviz(CFG.provinceSheet,CFG.provinceRange,parseProvinceSummary,30000,CFG.sheetId)
    ]);
    const expected=summaryMetrics(companies);
    const expectedRows=expected.total+expected.grad;
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
    setSync('ok',coreOnly?'Feed ẩn danh · lõi':'Feed ẩn danh · trực tiếp');
    $('notice').className='notice ok';
    $('notice').textContent=`Feed public đã đối soát: ${nf.format(expected.total)} HS = ${nf.format(expected.active)} đang TT + ${nf.format(expected.drop)} bỏ; ${nf.format(expected.grad)} tốt nghiệp; 15/15 DN khớp.${coreOnly?' Dữ liệu ngày chưa tải được nên chỉ ẩn phần theo dõi ngày.':''}`;
    $('updated').textContent='Đồng bộ '+new Date().toLocaleString('vi-VN',{hour12:false});
  }catch(e){
    console.error('Core recovery',e);
    // Giữ snapshot/guard hiện có nếu recovery thực sự thất bại.
  }finally{
    recovering=false;
  }
}

// app.js cũ có thể đang refresh ngay khi tải. Re-assert nguồn lõi sau các mốc ngắn và sau timeout cũ.
setTimeout(recoverCore,1200);
setTimeout(recoverCore,4500);
setTimeout(recoverCore,12000);
setTimeout(recoverCore,33000);
const btn=document.getElementById('refresh');
if(btn)btn.addEventListener('click',()=>setTimeout(recoverCore,1800));
window.addEventListener('focus',()=>{if(Date.now()-state.lastRefresh>60000)setTimeout(recoverCore,250)});
})();
