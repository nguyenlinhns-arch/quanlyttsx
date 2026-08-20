(function(){
  'use strict';
  const BASE_RENDER_LIVE=renderLive;

  function parseRecruitmentSummary(table){
    return table.rows.map(row=>{
      const name=cellText(row.c?.[0]);
      if(!name||norm(name)==='don vi tuyen')return null;
      const total=num(cellRaw(row.c?.[1])),active=num(cellRaw(row.c?.[2])),drop=num(cellRaw(row.c?.[3]));
      return {name,total,active,drop,dropRate:total?drop/total:0,activeRate:total?active/total:0};
    }).filter(Boolean);
  }

  function ensurePanels(){
    if(document.getElementById('statusStructure'))return;
    const firstGrid=document.querySelector('.section.grid2');
    if(!firstGrid)return;
    const st=document.createElement('style');st.id='dashboard-complete-style';st.textContent=`
      .dual-row{display:grid;grid-template-columns:minmax(125px,190px) 1fr 104px;gap:12px;align-items:center;font-size:13px}
      .dual-track{height:14px;display:flex;background:#eaf0f4;border-radius:999px;overflow:hidden}.dual-active{background:#16845b;height:100%}.dual-drop{background:#d64545;height:100%}
      .dual-value{text-align:right;font-weight:800;white-space:nowrap}.dual-value .a{color:#16845b}.dual-value .d{color:#d64545}
      .status-row{display:grid;grid-template-columns:150px 1fr 96px;gap:12px;align-items:center;margin:12px 0}.status-label{font-weight:750}.status-track{height:14px;background:#eaf0f4;border-radius:999px;overflow:hidden}.status-fill{height:100%;border-radius:999px}.status-active{background:#16845b}.status-drop{background:#d64545}.status-grad{background:#d59a24}.status-other{background:#7b8996}.status-value{text-align:right;font-weight:800}
      @media(max-width:720px){.dual-row{grid-template-columns:100px 1fr 90px;gap:8px;font-size:12px}.status-row{grid-template-columns:100px 1fr 82px;gap:8px}}
    `;document.head.appendChild(st);
    const s1=document.createElement('section');s1.className='section grid2 dashboard-extra';s1.innerHTML=`<div class="panel"><h3>Cơ cấu tình trạng học sinh</h3><p class="panel-note">Cơ cấu trên tổng bản ghi có trạng thái. KPI tỷ lệ bỏ vẫn dùng mẫu số Đang TT + Bỏ.</p><div id="statusStructure"></div></div><div class="panel"><h3>Đang thực tập / Bỏ theo doanh nghiệp</h3><p class="panel-note">Hai trạng thái dùng cùng tổng HS đi TTSX của từng doanh nghiệp.</p><div id="activeDropBars" class="bars"></div></div>`;
    const s2=document.createElement('section');s2.className='section grid2 dashboard-extra';s2.innerHTML=`<div class="panel"><h3>Top đơn vị tuyển theo HS đi TTSX</h3><p class="panel-note">Chỉ xếp hạng đơn vị tuyển đã xác định; trường hợp thiếu nằm ở Chất lượng dữ liệu.</p><div id="recruitBars" class="bars"></div></div><div class="panel"><h3>Top doanh nghiệp có HS bỏ nhiều</h3><p class="panel-note">Xếp theo số HS bỏ TTSX, không phải tỷ lệ.</p><div id="dropCountBars" class="bars"></div></div>`;
    firstGrid.insertAdjacentElement('afterend',s2);firstGrid.insertAdjacentElement('afterend',s1);
  }

  function renderStatus(m){
    const total=m.active+m.drop+m.grad+(m.other||0),rows=[['Đang thực tập',m.active,'status-active'],['Bỏ TTSX',m.drop,'status-drop'],['Đã tốt nghiệp',m.grad,'status-grad']];
    if(m.other)rows.push(['Khác/Chưa rõ',m.other,'status-other']);
    $('statusStructure').innerHTML=rows.map(([label,val,cls])=>{const rate=total?val/total:0;return `<div class="status-row"><div class="status-label">${label}</div><div class="status-track"><div class="status-fill ${cls}" style="width:${rate*100}%"></div></div><div class="status-value">${nf.format(val)} · ${pf(rate)}</div></div>`}).join('');
  }

  function renderActiveDrop(companies){
    const a=companies.slice().sort((x,y)=>y.total-x.total).slice(0,15);
    $('activeDropBars').innerHTML=a.map(x=>{const total=Math.max(1,x.total),ap=x.active/total*100,dp=x.drop/total*100;return `<div class="dual-row"><div class="bar-name">${escapeHtml(x.name)}</div><div class="dual-track"><div class="dual-active" style="width:${ap}%"></div><div class="dual-drop" style="width:${dp}%"></div></div><div class="dual-value"><span class="a">${x.active}</span> / <span class="d">${x.drop}</span></div></div>`}).join('');
  }

  function deriveRecruitment(rows){return group(rows.filter(r=>r.recruitment),'recruitment').map(([name,a])=>({name,...metrics(a)}))}
  function renderRecruitment(items){countBars($('recruitBars'),items.filter(x=>x.name).slice().sort((a,b)=>b.total-a.total),x=>x.total,x=>x.name,x=>nf.format(x.total),12)}
  function renderDropCount(companies){const a=companies.slice().sort((x,y)=>y.drop-x.drop).slice(0,12),mx=Math.max(1,...a.map(x=>x.drop));$('dropCountBars').innerHTML=a.map(x=>`<div class="bar-row"><div class="bar-name">${escapeHtml(x.name)}</div><div class="track"><div class="fill red" style="width:${x.drop?Math.max(1,x.drop/mx*100):0}%"></div></div><div class="bar-value">${nf.format(x.drop)}</div></div>`).join('')}

  renderProvinceBlocks=function(provinces){
    const known=provinces.filter(x=>x.name&&norm(x.name)!=='chua ro tinh');
    countBars($('provinceBars'),known.slice().sort((a,b)=>b.total-a.total),x=>x.total,x=>x.name,x=>nf.format(x.total),12);
  };

  renderLive=function(){
    BASE_RENDER_LIVE();
    ensurePanels();
    const unfiltered=isUnfiltered(),baseRows=state.scopeRows;
    const companies=unfiltered&&state.companySummary?.length?state.companySummary:deriveCompanies(baseRows);
    const m=unfiltered&&state.companySummary?.length?summaryMetrics(state.companySummary):metrics(baseRows);
    renderStatus(m);renderActiveDrop(companies);
    const recruit=unfiltered&&state.recruitmentSummary?.length?state.recruitmentSummary:deriveRecruitment(baseRows);
    renderRecruitment(recruit);renderDropCount(companies);
  };

  function auditRecruitment(){
    if(!state.live||!state.recruitmentSummary?.length)return '';
    const raw=new Map(deriveRecruitment(state.rows).map(x=>[norm(x.name),x]));
    for(const s of state.recruitmentSummary){const r=raw.get(norm(s.name));if(!r||r.total!==s.total||r.active!==s.active||r.drop!==s.drop)return ` Cảnh báo: đơn vị tuyển ${s.name} chưa khớp nguồn chuẩn.`}
    return '';
  }

  async function activate(){
    if(!state.live)return;
    try{state.recruitmentSummary=await loadGviz('TK theo đơn vị TS','A4:E60',parseRecruitmentSummary).catch(()=>[]);renderLive();const w=auditRecruitment();if(w&&$('notice')){$('notice').className='notice err';$('notice').textContent+='. '+w.trim()}}catch(e){console.error('Dashboard complete',e)}
  }
  setTimeout(activate,1800);setTimeout(activate,5200);
  $('refresh').addEventListener('click',()=>setTimeout(activate,3000));
})();
