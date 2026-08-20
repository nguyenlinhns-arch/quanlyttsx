(function(){
'use strict';
const CORE_SHEET='_WEB_CORE';
const CORE_RANGE='A1:G2000';
let recovering=false;

async function recoverCore(){
  if(recovering)return;
  recovering=true;
  try{
    const [raw,companies,provinces]=await Promise.all([
      loadGviz(CORE_SHEET,CORE_RANGE,parseRawTable,30000,CFG.sheetId),
      loadGviz(CFG.companySheet,CFG.companyRange,parseCompanySummary,30000,CFG.sheetId),
      loadGviz(CFG.provinceSheet,CFG.provinceRange,parseProvinceSummary,30000,CFG.sheetId)
    ]);
    const expected=summaryMetrics(companies);
    const expectedRows=expected.total+expected.grad;
    const companyCount=new Set(raw.rows.map(r=>norm(r.company)).filter(Boolean)).size;
    if(raw.rows.length!==expectedRows||companyCount!==15){
      throw new Error(`Feed lõi chưa đủ: ${raw.rows.length}/${expectedRows} bản ghi; ${companyCount}/15 DN`);
    }
    state.rows=raw.rows;
    state.scopeRows=raw.rows;
    state.companySummary=companies;
    state.provinceSummary=provinces;
    state.live=true;
    state.coreOnly=true;
    state.dates=[];
    state.lastRefresh=Date.now();
    hydrate();
    state.audit=auditConsistency();
    apply();
    setSync('ok','Feed ẩn danh · trực tiếp');
    $('notice').className='notice ok';
    $('notice').textContent=`Feed public đã đối soát: ${nf.format(expected.total)} HS = ${nf.format(expected.active)} đang TT + ${nf.format(expected.drop)} bỏ; ${nf.format(expected.grad)} tốt nghiệp; 15/15 DN khớp.`;
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
