(function(){
  'use strict';
  const BASE_RENDER_DAILY=renderDaily;

  function parseHotspotSummary(table){
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

  function canonicalRateBars(el,arr,limit=15){
    const a=arr.slice(0,limit);
    el.innerHTML=a.length?a.map(x=>{
      const rate=x.total?x.drop/x.total:0;
      const pct=Math.max(0,Math.min(100,rate*100));
      const title=`${x.drop} HS bỏ / ${x.total} HS đi TTSX = ${pf(rate)}`;
      return `<div class="bar-row"><div class="bar-name" title="${escapeHtml(title)}">${escapeHtml(x.name)}</div><div class="track"><div class="fill red" style="width:${pct}%"></div></div><div class="bar-value" title="${escapeHtml(title)}">${pf(rate)}</div></div>`;
    }).join(''):'<div class="notice">Không có dữ liệu trong phạm vi lọc.</div>';
  }
  rateBars=canonicalRateBars;

  function rawHotspotGroups(rows){
    const drops=rows.filter(r=>r.status==='dropped'&&r.unit&&r.company),pairMap=new Map;
    for(const r of drops){
      const company=String(r.company).trim(),unit=String(r.unit).trim(),key=norm(company)+'\u0000'+norm(unit);
      if(!pairMap.has(key))pairMap.set(key,{company,unit,count:0});
      pairMap.get(key).count++;
    }
    const pairs=[...pairMap.values()].filter(x=>x.count>=3),companyMap=new Map;
    for(const x of pairs){
      const key=norm(x.company);
      if(!companyMap.has(key))companyMap.set(key,{company:x.company,total:0,units:[]});
      const g=companyMap.get(key);g.total+=x.count;g.units.push({unit:x.unit,count:x.count});
    }
    return [...companyMap.values()].map(g=>({...g,units:g.units.sort((a,b)=>b.count-a.count||a.unit.localeCompare(b.unit,'vi'))})).sort((a,b)=>b.total-a.total||a.company.localeCompare(b.company,'vi'));
  }

  function renderHotspotGroups(groups){
    $('hotspots').innerHTML=groups.length?groups.map(g=>`<div class="hot-company-row"><div class="hot-company-box"><strong>${escapeHtml(g.company)}</strong><span>${nf.format(g.total)} HS bỏ tại ${g.units.length} công trường cảnh báo</span></div><div class="hot-unit-list">${g.units.map(u=>`<div class="hot-unit"><span>${escapeHtml(u.unit)}</span><b>${nf.format(u.count)} HS bỏ</b></div>`).join('')}</div></div>`).join(''):'<div class="notice ok">Không có công trường nào đạt ngưỡng ≥3 HS bỏ trong phạm vi lọc.</div>';
  }

  renderHotspots=function(){
    const groups=isUnfiltered()&&Array.isArray(state.hotspotSummary)&&state.hotspotSummary.length?state.hotspotSummary:rawHotspotGroups(state.scopeRows);
    renderHotspotGroups(groups);
  };

  function hasDailyData(){
    return !state.coreOnly&&state.dates.length>0&&state.rows.some(r=>state.dates.some(d=>classifyDay(r.daily[d])!=='blank'));
  }

  function toggleDaily(){
    state.dailyAvailable=hasDailyData();
    const dailySection=$('day')?.closest('section');
    const coveragePanel=$('coverage')?.closest('.panel');
    const bottomGrid=coveragePanel?.parentElement;
    if(dailySection)dailySection.style.display=state.dailyAvailable?'':'none';
    if(coveragePanel)coveragePanel.style.display=state.dailyAvailable?'':'none';
    if(bottomGrid)bottomGrid.style.gridTemplateColumns=state.dailyAvailable?'':'1fr';
    if(!state.dailyAvailable){
      ['dExpected','dEntered','dScore','dSick','dLeave','dKld','dMissing'].forEach(id=>$(id).textContent='—');
      $('coverage').innerHTML='<div class="notice">Chưa có dữ liệu theo ngày trong nguồn nên không tính tỷ lệ cập nhật.</div>';
    }
  }

  renderDaily=function(){
    if(!state.live)return;
    state.dailyAvailable=hasDailyData();
    if(!state.dailyAvailable){toggleDaily();return;}
    BASE_RENDER_DAILY();
    const rows=state.scopeRows.filter(r=>r.status==='active');
    const day=$('day').value;
    const cov=group(rows,'company').map(([name,a])=>{
      const entered=a.filter(r=>classifyDay(r.daily[day])!=='blank').length;
      return {name,expected:a.length,entered,rate:a.length?entered/a.length:0};
    }).sort((a,b)=>b.rate-a.rate||b.expected-a.expected);
    if(!cov.length){$('coverage').innerHTML='<div class="notice">Không có HS đang thực tập trong phạm vi lọc.</div>';return;}
    $('coverage').innerHTML=cov.slice(0,15).map(x=>{
      const title=`${x.entered}/${x.expected} HS đã nhập ngày ${day}`;
      return `<div class="bar-row"><div class="bar-name" title="${escapeHtml(title)}">${escapeHtml(x.name)}</div><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,x.rate*100))}%"></div></div><div class="bar-value" title="${escapeHtml(title)}">${pf(x.rate)}</div></div>`;
    }).join('');
  };

  function auditDashboard(){
    if(!state.live||!state.rows.length||!state.companySummary?.length)return {ok:false,message:'Chưa đủ dữ liệu trực tiếp để đối soát.'};
    const diffs=[];
    const rawCompanies=new Map(deriveCompanies(state.rows).map(x=>[norm(x.name),x]));
    for(const s of state.companySummary){
      const r=rawCompanies.get(norm(s.name));
      if(!r||r.total!==s.total||r.active!==s.active||r.drop!==s.drop||r.grad!==s.grad){diffs.push(`DN ${s.name} không khớp`);break;}
    }
    const sum=summaryMetrics(state.companySummary),raw=metrics(state.rows);
    if(raw.total!==sum.total||raw.active!==sum.active||raw.drop!==sum.drop||raw.grad!==sum.grad)diffs.push(`Tổng raw ${raw.total}/${raw.active}/${raw.drop}/${raw.grad} ≠ chuẩn ${sum.total}/${sum.active}/${sum.drop}/${sum.grad}`);
    if(state.provinceSummary?.length){
      const rawP=new Map(deriveProvinces(state.rows).map(x=>[norm(x.name),x]));
      for(const s of state.provinceSummary){const r=rawP.get(norm(s.name));if(!r||r.total!==s.total||r.active!==s.active||r.drop!==s.drop){diffs.push(`Tỉnh ${s.name} không khớp`);break;}}
    }
    if(state.hotspotSummary?.length){
      const rawGroups=rawHotspotGroups(state.rows),rawPairs=new Map;
      rawGroups.forEach(g=>g.units.forEach(u=>rawPairs.set(norm(g.company)+'\u0000'+norm(u.unit),u.count)));
      outer:for(const g of state.hotspotSummary){for(const u of g.units){const n=rawPairs.get(norm(g.company)+'\u0000'+norm(u.unit))||0;if(n!==u.count){diffs.push(`CT ${g.company} → ${u.unit}: ${n} ≠ ${u.count}`);break outer;}}}
    }
    return diffs.length?{ok:false,message:'Có chênh lệch: '+diffs.join('; ')}:{ok:true,message:`Đối soát đạt: ${nf.format(sum.total)} HS = ${nf.format(sum.active)} đang TT + ${nf.format(sum.drop)} bỏ; doanh nghiệp, tỉnh và công trường khớp nguồn chuẩn.`};
  }

  async function activateAudit(){
    if(!state.live)return;
    try{
      const [companies,provinces,hotspots]=await Promise.all([
        loadGviz(CFG.companySheet,CFG.companyRange,parseCompanySummary).catch(()=>FALLBACK.companies),
        loadGviz(CFG.provinceSheet,CFG.provinceRange,parseProvinceSummary).catch(()=>FALLBACK.provinces),
        loadGviz('TK theo doanh nghiệp','A24:F40',parseHotspotSummary).catch(()=>[])
      ]);
      state.companySummary=companies.length?companies:FALLBACK.companies;
      state.provinceSummary=provinces.length?provinces:FALLBACK.provinces;
      state.hotspotSummary=hotspots;
      renderLive();
      toggleDaily();
      const audit=auditDashboard();
      $('notice').className=audit.ok?'notice ok':'notice err';
      $('notice').textContent=(audit.ok?'Dữ liệu đã đối soát. ':'Cảnh báo đối soát. ')+audit.message+(!state.dailyAvailable?' Dữ liệu theo ngày hiện chưa có nên phần theo dõi ngày được ẩn để tránh báo cáo sai.':'');
    }catch(e){console.error('Audit patch',e);}
  }

  setTimeout(activateAudit,1200);
  setTimeout(activateAudit,4500);
  ['company','province','campus','recruitment','unit'].forEach(id=>$(id).addEventListener('change',()=>setTimeout(()=>{renderLive();toggleDaily();},0)));
  $('refresh').addEventListener('click',()=>setTimeout(activateAudit,2500));
})();
