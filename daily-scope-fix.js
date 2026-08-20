(function(){
  'use strict';

  function dailyRows(){
    return state.scopeRows.filter(r=>r.status==='active'&&norm(r.company)!=='sin quyen');
  }

  renderDaily=function(){
    if(!state.live)return;
    if(state.coreOnly||!state.dates.length){
      ['dExpected','dEntered','dScore','dSick','dLeave','dKld','dMissing'].forEach(id=>$(id).textContent='—');
      $('coverage').innerHTML='<div class="notice">Chưa tải được dữ liệu theo ngày.</div>';
      return;
    }
    const day=$('day').value;
    if(!day)return;
    const rows=dailyRows();
    let score=0,sick=0,leave=0,kld=0,other=0;
    for(const r of rows){
      const t=classifyDay(r.daily[day]);
      if(t==='score')score++;
      else if(t==='sick')sick++;
      else if(t==='leave')leave++;
      else if(t==='kld')kld++;
      else if(t==='other')other++;
    }
    const entered=score+sick+leave+kld+other,missing=Math.max(0,rows.length-entered);
    [['dExpected',rows.length],['dEntered',entered],['dScore',score],['dSick',sick],['dLeave',leave],['dKld',kld],['dMissing',missing]].forEach(([id,v])=>$(id).textContent=nf.format(v));
    const cov=group(rows,'company').map(([name,a])=>{
      const enteredCount=a.filter(r=>classifyDay(r.daily[day])!=='blank').length;
      return{name,expected:a.length,entered:enteredCount,rate:a.length?enteredCount/a.length:0};
    }).sort((a,b)=>b.rate-a.rate||b.expected-a.expected);
    $('coverage').innerHTML=cov.length?cov.map(x=>{
      const title=`${x.entered}/${x.expected} HS đã nhập ngày ${day}`;
      return `<div class="bar-row"><div class="bar-name" title="${escapeHtml(title)}">${escapeHtml(x.name)}</div><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,x.rate*100))}%"></div></div><div class="bar-value" title="${escapeHtml(title)}">${pf(x.rate)}</div></div>`;
    }).join(''):'<div class="notice">Không có HS đang thực tập thuộc 14 doanh nghiệp áp dụng chấm ngày trong phạm vi lọc.</div>';
  };

  $('day').addEventListener('change',()=>setTimeout(renderDaily,0));
})();