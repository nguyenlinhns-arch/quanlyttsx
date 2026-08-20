(() => {
  const MASTER_ID = '1QPJ0ZUYJZNB1GpUyKa04uOMkRPzUR_vwG-fizIxn7Ac';
  const SHEETS = { summary: 'WEB_DATA', ph: 'WEB_THEO_PH', dn: 'WEB_THEO_DN', dv: 'WEB_THEO_DV' };
  const nf = new Intl.NumberFormat('vi-VN');
  const timeFmt = new Intl.DateTimeFormat('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });

  const FALLBACK_SUMMARY = {
    schema_version:'2', data_version:'20260818-2737-472-4-121', cutoff_date:'29/07/2026', latest_admission_date:'18/08/2026',
    total_records:2737, inactive_records:472, active_records:2265, new_since_cutoff:150, new_active_since_cutoff:134,
    today_count:0, duplicate_new:4, incomplete_new:121, source_system_status:'HỆ THỐNG NGUỒN OK', source_mismatch_count:0,
    PHCP_total:1037, PHCP_active:843, PHHB_total:506, PHHB_active:431, PHHN_total:676, PHHN_active:573,
    PHVB_total:288, PHVB_active:238, PHMC_total:228, PHMC_active:178, missing_campus_total:2,
    web_source:'DSHS_TONG_ONLY', valid_date_total:2656, missing_date_total:81, missing_company_total:2, missing_recruit_unit_total:0
  };

  const F = (tt,code,name,m,total,active,inactive) => ({tt:String(tt),code,name,m:m.map(Number),total:+total,active:+active,inactive:+inactive,isTotal:false});
  const T = (m,total,active,inactive) => ({tt:'TỔNG CỘNG',code:'',name:'TỔNG CỘNG',m:m.map(Number),total:+total,active:+active,inactive:+inactive,isTotal:true});
  const FALLBACK_TABLES = {
    ph:[
      F(1,'PHCP','Phân hiệu Cẩm Phả',[75,96,288,125,120,153,116,57,0,0,0,0],1037,843,194),
      F(2,'PHHB','Phân hiệu Hoành Bồ',[28,35,187,55,34,47,55,19,0,0,0,0],506,431,75),
      F(3,'PHHN','Phân hiệu Hữu Nghị',[28,119,195,69,45,113,71,35,0,0,0,0],676,573,103),
      F(4,'PHVB','Phân hiệu Việt Bắc',[101,25,42,18,38,18,27,14,0,0,0,0],288,238,50),
      F(5,'PHMC','Phân hiệu Móng Cái',[49,60,67,0,32,0,0,0,0,0,0,0],228,178,50),
      T([281,335,779,267,269,331,269,125,0,0,0,0],2735,2263,472)
    ],
    dn:[
      F(1,'DH','Dương Huy',[20,25,77,18,19,28,9,7,0,0,0,0],207,185,22),F(2,'HG','Hòn Gai',[35,46,64,46,35,26,18,11,0,0,0,0],282,224,58),
      F(3,'HLẦM','Hà Lầm',[2,7,23,13,20,23,16,6,0,0,0,0],111,93,18),F(4,'HLONG','Hạ Long',[14,46,108,49,61,39,21,14,0,0,0,0],361,291,70),
      F(5,'KC','Khe Chàm',[9,43,88,21,29,23,26,7,0,0,0,0],289,232,57),F(6,'MD','Mông Dương',[6,10,26,6,4,2,4,0,0,0,0,0],60,48,12),
      F(7,'MK','Mạo Khê',[14,32,29,13,6,17,8,9,0,0,0,0],129,104,25),F(8,'NB','Núi Béo',[10,36,113,21,4,11,7,5,0,0,0,0],215,177,38),
      F(9,'NM','Nam Mẫu',[3,26,53,20,12,16,14,5,0,0,0,0],149,130,19),F(10,'QH','Quang Hanh',[3,9,29,10,48,87,62,33,0,0,0,0],283,240,43),
      F(11,'SQ','Mỏ tuyển đồng',[97,0,0,0,0,0,0,0,0,0,0,0],101,86,15),F(12,'TN','Thống Nhất',[4,9,43,18,15,19,65,18,0,0,0,0],192,156,36),
      F(13,'UB','Uông Bí',[0,3,13,6,1,5,2,2,0,0,0,0],32,29,3),F(14,'VD','Vàng Danh',[12,33,79,19,14,30,17,6,0,0,0,0],212,178,34),
      F(15,'XH','XH',[0,0,0,0,0,3,0,0,0,0,0,0],3,3,0),F(16,'XLM','Xây lắp mỏ',[52,10,32,7,1,2,0,2,0,0,0,0],109,88,21),
      T([281,335,777,267,269,331,269,125,0,0,0,0],2735,2264,471)
    ],
    dv:[
      F(1,'HLO 1','HLO 1',[0,0,0,0,0,0,0,1,0,0,0,0],1,1,0),F(2,'TSCL','Phòng Chiến lược',[12,16,67,18,21,15,21,8,0,0,0,0],179,150,29),
      F(3,'TSCP','TS PH Cẩm Phả',[59,83,116,22,44,56,26,14,0,0,0,0],437,342,95),F(4,'TSDN1','Phòng TSDN1',[55,52,205,85,75,81,72,32,0,0,0,0],664,573,91),
      F(5,'TSDN2','Phòng TSDN2',[0,0,0,0,0,3,0,0,0,0,0,0],3,3,0),F(6,'TSDN3','Phòng TSDN3',[20,0,0,0,0,0,0,0,0,0,0,0],21,19,2),
      F(7,'TSĐB','Phòng TSĐB',[0,0,0,7,8,11,6,4,0,0,0,0],69,64,5),F(8,'TSĐB1','Phòng TSĐB1',[1,12,22,3,0,0,0,0,0,0,0,0],42,31,11),
      F(9,'TSĐB2','Phòng TSĐB2',[14,10,20,0,1,0,0,0,0,0,0,0],45,35,10),F(10,'TSHB','TS PH Hoành Bồ',[28,28,86,40,19,13,17,2,0,0,0,0],235,182,53),
      F(11,'TSHN','TS PH Hữu Nghị',[13,57,61,27,18,35,16,12,0,0,0,0],240,193,47),F(12,'TSKTNV','Phòng KT-NV',[0,0,0,0,0,1,0,0,0,0,0,0],1,1,0),
      F(13,'TSMT','Phòng TSMT',[6,20,69,16,29,33,37,16,0,0,0,0],229,191,38),F(14,'TSTB1','Phòng TSTB1',[5,4,18,4,3,11,9,6,0,0,0,0],61,51,10),
      F(15,'TSTB2','Phòng TSTB2',[8,35,88,22,18,50,36,21,0,0,0,0],279,238,41),F(16,'TSTKV','Trường TKV',[0,0,0,0,0,0,0,0,0,0,0,0],8,8,0),
      F(17,'TSTN','TSTN',[0,0,0,0,0,0,1,0,0,0,0,0],1,0,1),F(18,'TSVB','TS PH Việt Bắc',[60,18,27,23,32,22,28,9,0,0,0,0],221,182,39),
      F(19,'TSVP','TSVP',[0,0,0,0,1,0,0,0,0,0,0,0],1,1,0),T([281,335,779,267,269,331,269,125,0,0,0,0],2737,2265,472)
    ]
  };

  const TITLE = {
    ph:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH NĂM 2026 THEO PHÂN HIỆU / TRUNG TÂM',
    dn:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH NĂM 2026 THEO DOANH NGHIỆP',
    dv:'TỔNG HỢP KẾT QUẢ NHẬP HỌC HỌC SINH NĂM 2026 THEO ĐƠN VỊ TUYỂN SINH'
  };
  const numericKeys = new Set(['total_records','inactive_records','active_records','new_since_cutoff','new_active_since_cutoff','today_count','duplicate_new','incomplete_new','source_mismatch_count','missing_campus_total','valid_date_total','missing_date_total','missing_company_total','missing_recruit_unit_total']);
  const state = { summary:{...FALLBACK_SUMMARY}, tables:{ph:FALLBACK_TABLES.ph,dn:FALLBACK_TABLES.dn,dv:FALLBACK_TABLES.dv}, live:{summary:false,ph:false,dn:false,dv:false}, active:'ph' };

  function cellVal(cell){ return cell && cell.f != null ? cell.f : (cell && cell.v != null ? cell.v : ''); }
  function parseSummary(response){ const out={}; (response?.table?.rows||[]).forEach(r=>{const c=r.c||[];const k=String(cellVal(c[0])||'');if(k) out[k]=cellVal(c[1]);}); return out; }
  function parseTable(response){
    const rows=[];
    (response?.table?.rows||[]).forEach(r=>{
      const c=r.c||[]; const tt=cellVal(c[0]); const code=String(cellVal(c[1])||''); const name=String(cellVal(c[2])||'');
      if(!tt && !code && !name) return;
      const isTotal=String(tt).toUpperCase().includes('TỔNG');
      rows.push({tt:String(tt||''),code,name:isTotal?'TỔNG CỘNG':(name||code),m:Array.from({length:12},(_,i)=>Number(cellVal(c[i+3])||0)),total:Number(cellVal(c[15])||0),active:Number(cellVal(c[16])||0),inactive:Number(cellVal(c[17])||0),isTotal});
    });
    return rows;
  }
  function loadGviz(sheet, parser, timeoutMs=7000){
    return new Promise((resolve,reject)=>{
      const cb='__nh_'+sheet.replace(/[^A-Za-z0-9]/g,'_')+'_'+Math.random().toString(36).slice(2);
      const script=document.createElement('script'); let done=false;
      const finish=(ok,val)=>{if(done)return;done=true;clearTimeout(timer);delete window[cb];script.remove();ok?resolve(val):reject(val);};
      window[cb]=res=>{try{const parsed=parser(res);finish(true,parsed);}catch(e){finish(false,e);}};
      const tqx=encodeURIComponent(`out:json;responseHandler:${cb}`);
      script.src=`https://docs.google.com/spreadsheets/d/${MASTER_ID}/gviz/tq?sheet=${encodeURIComponent(sheet)}&headers=1&tqx=${tqx}&_=${Date.now()}`;
      script.async=true;script.onerror=()=>finish(false,new Error('load'));document.head.appendChild(script);
      const timer=setTimeout(()=>finish(false,new Error('timeout')),timeoutMs);
    });
  }
  function renderSummary(){
    const map=state.summary;
    document.querySelectorAll('[data-key]').forEach(el=>{const k=el.dataset.key;if(!(k in map))return;let v=map[k];if(numericKeys.has(k)&&v!==''&&!Number.isNaN(Number(v)))v=nf.format(Number(v));el.textContent=v;});
    const sourceOk=String(map.source_system_status||'').includes('OK')&&Number(map.source_mismatch_count||0)===0;
    const master=document.getElementById('masterStatus'), source=document.getElementById('sourceStatus'), notice=document.getElementById('dataNotice'), updated=document.getElementById('updatedText');
    if(master){master.textContent=state.live.summary?'DSHS TỔNG · LIVE':'DSHS TỔNG · SNAPSHOT';master.className=`source-chip ${state.live.summary?'live':'snapshot'}`;}
    if(source){source.textContent=map.source_system_status||'CHƯA XÁC ĐỊNH NGUỒN';source.className=`source-health ${sourceOk?'ok':'warn'}`;}
    if(updated)updated.textContent=`${state.live.summary?'Đồng bộ trực tiếp':'Ảnh chụp DSHS Tổng'} · ${timeFmt.format(new Date())}`;
    if(notice)notice.className=`status-line ${state.live.summary?'live':'warning'}`;
  }
  function renderTable(kind){
    state.active=kind; const body=document.getElementById('reportBody'), title=document.getElementById('reportTitle'), note=document.getElementById('tableQualityNote'); if(!body)return;
    title.textContent=TITLE[kind]; body.innerHTML='';
    const rows=state.tables[kind]||[]; const currentMonth=new Date().getFullYear()===2026?new Date().getMonth()+1:0;
    rows.forEach(row=>{
      const tr=document.createElement('tr'); if(row.isTotal)tr.classList.add('total-row'); if(!row.isTotal&&row.code&&row.name===row.code)tr.classList.add('unmapped-row');
      const tt=document.createElement('td');tt.textContent=row.tt;tr.appendChild(tt);
      const entity=document.createElement('td');entity.className='entity';entity.textContent=row.name;if(row.code&&!row.isTotal){const s=document.createElement('small');s.textContent=row.code;entity.appendChild(s);}tr.appendChild(entity);
      row.m.forEach((v,i)=>{const td=document.createElement('td');td.textContent=nf.format(v);if(i+1===currentMonth)td.classList.add('current-month');tr.appendChild(td);});
      [row.total,row.active,row.inactive].forEach(v=>{const td=document.createElement('td');td.textContent=nf.format(v);tr.appendChild(td);}); body.appendChild(tr);
    });
    const total=rows.find(r=>r.isTotal); const masterTotal=Number(state.summary.total_records||0); const validDate=Number(state.summary.valid_date_total||0); const missingDate=Number(state.summary.missing_date_total||0);
    const unmapped=rows.filter(r=>!r.isTotal&&r.code&&r.name===r.code).map(r=>r.code);
    let parts=[];
    if(total){const gap=masterTotal-total.total;if(gap>0)parts.push(kind==='ph'?`${nf.format(gap)} hồ sơ chưa có mã phân hiệu`:kind==='dn'?`${nf.format(gap)} hồ sơ chưa có mã doanh nghiệp`:`Chênh Master: ${nf.format(gap)}`);const monthSum=total.m.reduce((a,b)=>a+b,0);if(monthSum!==validDate)parts.push(`Tổng 12 tháng của biểu: ${nf.format(monthSum)}/${nf.format(validDate)} hồ sơ có ngày hợp lệ`);}
    if(missingDate>0)parts.push(`${nf.format(missingDate)} hồ sơ thiếu/sai ngày nhập học 2026 nên không nằm trong cột tháng`);
    if(unmapped.length)parts.push(`Mã chưa chuẩn cần rà nguồn: ${unmapped.join(', ')}`);
    if(note){note.textContent=parts.length?parts.join(' · '):'Biểu khớp DSHS Tổng.';note.className=parts.length?'warning':'';}
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.report===kind));
  }
  function markCurrentMonth(){
    const m=new Date().getFullYear()===2026?new Date().getMonth()+1:0;
    document.querySelectorAll('.report-table thead tr:nth-child(2) th').forEach((th,i)=>th.classList.toggle('current-month',i+1===m));
  }

  document.querySelectorAll('.tab-btn').forEach(btn=>btn.addEventListener('click',()=>renderTable(btn.dataset.report)));
  renderSummary(); markCurrentMonth(); renderTable('ph');

  loadGviz(SHEETS.summary,parseSummary).then(map=>{if(map.web_source==='DSHS_TONG_ONLY'&&map.total_records!=null){state.summary={...state.summary,...map};state.live.summary=true;renderSummary();renderTable(state.active);}}).catch(()=>{});
  ['ph','dn','dv'].forEach(kind=>loadGviz(SHEETS[kind],parseTable).then(rows=>{if(rows.length){state.tables[kind]=rows;state.live[kind]=true;if(state.active===kind)renderTable(kind);}}).catch(()=>{}));
})();
