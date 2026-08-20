(function(){
  'use strict';

  async function loadCoreChunked(feedId, expectedRows){
    const chunkSize=400;
    const lastSheetRow=expectedRows+1;
    const firstEnd=Math.min(lastSheetRow,chunkSize+1);
    const first=await loadGviz(CFG.rawSheet,`A1:G${firstEnd}`,parseRawTable,30000,feedId,1);
    const headers=first.headers;
    const rows=[...first.rows];
    for(let start=firstEnd+1;start<=lastSheetRow;start+=chunkSize){
      const end=Math.min(lastSheetRow,start+chunkSize-1);
      const part=await loadGviz(CFG.rawSheet,`A${start}:G${end}`,t=>parseRawTable(t,headers),30000,feedId,0);
      rows.push(...part.rows);
    }
    if(rows.length!==expectedRows)throw new Error(`Feed lõi không đủ dòng (${rows.length}/${expectedRows})`);
    return {headers,rows};
  }

  loadFeed=async function(feedId){
    state.feedId=feedId;
    const [companies,provinces]=await Promise.all([
      loadGviz(CFG.companySheet,CFG.companyRange,parseCompanySummary,30000,feedId),
      loadGviz(CFG.provinceSheet,CFG.provinceRange,parseProvinceSummary,30000,feedId)
    ]);
    if(!companies.length)throw new Error('Không đọc được bảng thống kê doanh nghiệp.');
    const s=summaryMetrics(companies);
    const expectedRows=s.total+s.grad;
    if(expectedRows<1)throw new Error('Bảng thống kê doanh nghiệp không có số liệu.');

    const core=await loadCoreChunked(feedId,expectedRows);
    let raw=core,coreOnly=true;
    try{
      const full=await loadFullRawChunked(feedId,expectedRows);
      raw=mergeCoreAndDaily(core,full);
      coreOnly=false;
    }catch(e){
      console.warn('Daily feed unavailable; keep full core rows',e);
    }
    return {raw,coreOnly,companies,provinces};
  };

  function rerunWithV2(){
    if(state.refreshing){setTimeout(rerunWithV2,500);return;}
    refresh();
  }
  setTimeout(rerunWithV2,750);
})();
