'use strict';

const SUBJECTS={
  math:{name:'Toán',icon:'∑',topics:[
    ['sqrt','Căn bậc hai & căn thức'],['radical','Biến đổi căn thức'],['system','Hệ phương trình'],['triangle','Hệ thức lượng tam giác vuông'],['circle','Đường tròn']
  ]},
  english:{name:'Tiếng Anh',icon:'EN',topics:[
    ['tenses','Thì & dạng động từ'],['passive','Câu bị động'],['relative','Mệnh đề quan hệ'],['conditional','Câu điều kiện'],['vocab','Từ loại & từ vựng']
  ]},
  physics:{name:'Vật lí',icon:'Ω',topics:[
    ['ohm','Điện trở & định luật Ôm'],['circuit','Mạch nối tiếp/song song'],['power','Công suất điện'],['energy','Điện năng'],['joule','Jun–Len-xơ']
  ]},
  chemistry:{name:'Hóa học',icon:'H₂',topics:[
    ['oxide','Oxit'],['acid','Axit'],['base','Bazơ'],['salt','Muối'],['exchange','Phản ứng trao đổi']
  ]}
};

const STARTER={math:['sqrt','radical'],english:['tenses','passive'],physics:['ohm','circuit'],chemistry:['oxide','acid']};

function Q(id,topic,text,options,answer,explain){return{id:id,topic:topic,text:text,options:options,answer:answer,explain:explain};}

const BANK={
math:[
Q('m1','sqrt','Điều kiện để √(x − 3) có nghĩa là:',['x > 3','x ≥ 3','x ≤ 3','x ≠ 3'],1,'Dưới dấu căn phải không âm: x − 3 ≥ 0.'),
Q('m2','sqrt','Giá trị của √49 là:',['±7','7','−7','49'],1,'√49 là căn bậc hai số học nên bằng 7.'),
Q('m3','sqrt','Với a là số thực, √(a²) bằng:',['a','−a','|a|','a²'],2,'√(a²)=|a| vì căn bậc hai số học không âm.'),
Q('m4','radical','Rút gọn √75 được:',['15√5','5√3','3√5','25√3'],1,'√75=√(25×3)=5√3.'),
Q('m5','radical','√12 + √27 bằng:',['5√3','3√3','5√2','√39'],0,'√12=2√3 và √27=3√3.'),
Q('m6','radical','1/(√x − 2) xác định khi:',['x≥0','x>4','x≥0 và x≠4','x≠4'],2,'Cần x≥0 và mẫu khác 0, tức x≠4.'),
Q('m7','system','Nghiệm của hệ x+y=5; x−y=1 là:',['(2;3)','(3;2)','(4;1)','(1;4)'],1,'Cộng hai phương trình được 2x=6, suy ra x=3; y=2.'),
Q('m8','system','Hệ x+y=4; 2x+2y=8 có:',['Vô nghiệm','Một nghiệm','Vô số nghiệm','Hai nghiệm'],2,'Phương trình thứ hai là 2 lần phương trình thứ nhất.'),
Q('m9','system','Nếu 2x+y=7 và x−y=2 thì x bằng:',['2','3','4','5'],1,'Cộng hai phương trình: 3x=9 nên x=3.'),
Q('m10','triangle','Trong tam giác vuông, sin của góc nhọn bằng:',['cạnh kề/cạnh huyền','cạnh đối/cạnh huyền','cạnh đối/cạnh kề','cạnh huyền/cạnh đối'],1,'sin A = cạnh đối chia cạnh huyền.'),
Q('m11','triangle','Tam giác vuông có cạnh huyền 5, cạnh đối góc A là 3. sin A bằng:',['3/4','4/5','3/5','5/3'],2,'sin A=3/5.'),
Q('m12','triangle','Tam giác vuông có hai cạnh góc vuông 6 và 8. Cạnh huyền là:',['10','12','14','15'],0,'Theo Pitago: √(36+64)=10.'),
Q('m13','circle','Bán kính đi qua tiếp điểm với tiếp tuyến:',['song song tiếp tuyến','vuông góc tiếp tuyến','tạo góc 45°','không cố định'],1,'Bán kính tại tiếp điểm vuông góc tiếp tuyến.'),
Q('m14','circle','Đường tròn bán kính 4 cm có đường kính:',['2 cm','4 cm','8 cm','16 cm'],2,'d=2R=8 cm.'),
Q('m15','circle','Điểm cách tâm O một khoảng nhỏ hơn bán kính R nằm:',['ngoài đường tròn','trên đường tròn','trong đường tròn','không xác định'],2,'Khoảng cách tới tâm nhỏ hơn R thì điểm nằm trong đường tròn.')
],
english:[
Q('e1','tenses','She ___ English every day.',['study','studies','studied','studying'],1,'Present simple with she: studies.'),
Q('e2','tenses','I have lived here ___ 2022.',['for','since','from','at'],1,'Use since with a starting point.'),
Q('e3','tenses','Yesterday, we ___ to the library.',['go','went','have gone','are going'],1,'Yesterday signals the past simple.'),
Q('e4','passive','People grow rice here. Rice ___ here.',['grows','is grown','was grow','has grow'],1,'Present simple passive: is/are + past participle.'),
Q('e5','passive','They built this bridge in 2020. This bridge ___ in 2020.',['is built','was built','has built','built'],1,'Past simple passive: was/were + past participle.'),
Q('e6','passive','The work must ___ today.',['finish','be finished','finished','be finish'],1,'Modal passive: modal + be + past participle.'),
Q('e7','relative','The boy ___ won the prize is my friend.',['which','where','who','when'],2,'Use who for a person.'),
Q('e8','relative','This is the book ___ I bought yesterday.',['who','which','where','when'],1,'Use which for a thing.'),
Q('e9','relative','That is the school ___ my mother works.',['who','which','where','whose'],2,'Use where for a place.'),
Q('e10','conditional','If it rains, we ___ at home.',['stay','stayed','will stay','would stay'],2,'First conditional: If + present, will + verb.'),
Q('e11','conditional','If I ___ enough time, I would learn another language.',['have','had','will have','am having'],1,'Second conditional uses past simple after if.'),
Q('e12','conditional','If you heat ice, it ___.',['melts','will melted','would melt','melted'],0,'A scientific fact uses the zero conditional.'),
Q('e13','vocab','He is a very ___ student.',['success','successful','successfully','succeed'],1,'An adjective is needed before student.'),
Q('e14','vocab','We should protect the ___.',['environment','environmental','environmentally','environ'],0,'A noun is needed after the.'),
Q('e15','vocab','She answered the question ___.',['correct','correction','correctly','correctness'],2,'An adverb modifies answered.')
],
physics:[
Q('p1','ohm','Định luật Ôm cho đoạn mạch được viết:',['I=U/R','I=UR','U=I/R','R=IU'],0,'I=U/R.'),
Q('p2','ohm','Điện trở 10 Ω đặt vào 20 V. Cường độ dòng điện là:',['0,5 A','2 A','10 A','200 A'],1,'I=U/R=20/10=2 A.'),
Q('p3','ohm','Đơn vị của điện trở là:',['Vôn','Ampe','Ôm','Oát'],2,'Điện trở đo bằng ôm (Ω).'),
Q('p4','circuit','Hai điện trở mắc nối tiếp có R tương đương:',['R=R₁+R₂','1/R=1/R₁+1/R₂','R=R₁R₂','R=R₁−R₂'],0,'Mạch nối tiếp: Rtd=R1+R2.'),
Q('p5','circuit','Trong mạch nối tiếp, cường độ dòng điện qua các điện trở:',['khác nhau','bằng nhau','luôn bằng 0','tỉ lệ nghịch R'],1,'Mạch nối tiếp chỉ có một đường đi.'),
Q('p6','circuit','Hai điện trở 6 Ω và 3 Ω mắc song song. R tương đương là:',['9 Ω','3 Ω','2 Ω','18 Ω'],2,'1/R=1/6+1/3=1/2 nên R=2 Ω.'),
Q('p7','power','Công suất điện được tính bằng:',['P=UI','P=U/I','P=I/R','P=Rt'],0,'P=UI.'),
Q('p8','power','Thiết bị dùng 220 V, I=0,5 A có công suất:',['44 W','110 W','220 W','440 W'],1,'P=UI=110 W.'),
Q('p9','power','Đơn vị công suất điện là:',['Jun','Oát','Vôn','Culông'],1,'Công suất đo bằng oát (W).'),
Q('p10','energy','Bóng đèn 100 W dùng 2 giờ tiêu thụ:',['0,02 kWh','0,2 kWh','2 kWh','200 kWh'],1,'0,1 kW × 2 h = 0,2 kWh.'),
Q('p11','energy','1 kWh bằng:',['3,6×10³ J','3,6×10⁴ J','3,6×10⁵ J','3,6×10⁶ J'],3,'1000 W × 3600 s = 3,6×10⁶ J.'),
Q('p12','energy','Công tơ điện gia đình đo:',['cường độ','hiệu điện thế','điện năng tiêu thụ','điện trở'],2,'Công tơ đo điện năng, thường tính bằng kWh.'),
Q('p13','joule','Định luật Jun–Len-xơ:',['Q=I²Rt','Q=U/R','Q=Pt²','Q=IR/t'],0,'Q=I²Rt.'),
Q('p14','joule','Giữ R,t không đổi, I tăng gấp đôi thì Q:',['gấp đôi','gấp 4','giảm nửa','không đổi'],1,'Q tỉ lệ I² nên tăng 4 lần.'),
Q('p15','joule','Dây đốt nóng bếp điện dựa chủ yếu vào:',['tác dụng nhiệt','tác dụng từ','tác dụng hóa','khúc xạ'],0,'Dòng điện làm dây dẫn tỏa nhiệt.')
],
chemistry:[
Q('c1','oxide','Oxit là hợp chất của:',['hai nguyên tố, một là oxi','hiđro và kim loại','kim loại và gốc axit','ba nguyên tố'],0,'Oxit gồm hai nguyên tố, trong đó có oxi.'),
Q('c2','oxide','Chất nào là oxit bazơ?',['CO₂','SO₂','CaO','P₂O₅'],2,'CaO là oxit bazơ.'),
Q('c3','oxide','CaO tác dụng với nước tạo:',['CaCO₃','Ca(OH)₂','CaCl₂','CaSO₄'],1,'CaO + H₂O → Ca(OH)₂.'),
Q('c4','acid','Dung dịch axit làm quỳ tím chuyển:',['xanh','đỏ','đen','không đổi'],1,'Axit làm quỳ tím hóa đỏ.'),
Q('c5','acid','Công thức axit clohiđric là:',['H₂SO₄','HCl','NaOH','NaCl'],1,'Axit clohiđric là HCl.'),
Q('c6','acid','HCl + NaOH tạo:',['NaCl + H₂O','Na + Cl₂','Na₂O + HCl','H₂ + NaClO'],0,'Phản ứng trung hòa tạo muối và nước.'),
Q('c7','base','Chất nào là bazơ?',['H₂SO₄','NaOH','SO₂','NaCl'],1,'NaOH là bazơ.'),
Q('c8','base','Dung dịch bazơ tan làm quỳ tím:',['đỏ','xanh','đen','không đổi'],1,'Bazơ tan làm quỳ tím hóa xanh.'),
Q('c9','base','Đun nóng Cu(OH)₂ tạo chất rắn:',['Cu','CuO','Cu₂O','CuCl₂'],1,'Cu(OH)₂ → CuO + H₂O.'),
Q('c10','salt','Chất nào là muối?',['HCl','KOH','Na₂SO₄','CO₂'],2,'Na₂SO₄ là muối.'),
Q('c11','salt','AgNO₃ + NaCl tạo kết tủa:',['AgCl','NaNO₃','Ag₂O','Cl₂'],0,'AgCl là kết tủa trắng.'),
Q('c12','salt','Muối cacbonat tác dụng axit mạnh thường giải phóng:',['H₂','O₂','CO₂','N₂'],2,'Cacbonat + axit tạo CO₂.'),
Q('c13','exchange','Phản ứng trao đổi trong dung dịch xảy ra khi tạo:',['kết tủa, khí hoặc nước','chỉ chất tan','chỉ kim loại','chỉ oxit'],0,'Một sản phẩm phải tách khỏi môi trường dung dịch hoặc là chất điện li yếu.'),
Q('c14','exchange','BaCl₂ + Na₂SO₄ tạo kết tủa:',['BaSO₄','NaCl','BaCl','SO₂'],0,'BaSO₄ không tan tạo kết tủa.'),
Q('c15','exchange','Na₂CO₃ + 2HCl tạo khí:',['H₂','CO₂','O₂','Cl₂'],1,'Phản ứng giải phóng CO₂.')
]
};



const STORAGE_HISTORY='kenWeekly.history.v3';

const MODES={
  month:{name:'Ôn tháng',short:'Tháng',questions:10,minutes:25,desc:'Kiểm tra phần vừa học trong tháng và lặp lại lỗi cũ.',tone:'blue'},
  midterm:{name:'Ôn giữa kỳ',short:'Giữa kỳ',questions:12,minutes:40,desc:'Cộng dồn kiến thức từ đầu học kỳ, tăng câu vận dụng.',tone:'warn'},
  final:{name:'Ôn cuối kỳ',short:'Cuối kỳ',questions:15,minutes:55,desc:'Bao phủ toàn học kỳ, ưu tiên chuyên đề từng mất điểm.',tone:'good'}
};

const STUDY_WEEK=[
  {day:1,label:'Thứ 2',items:['Ngày đệm','Chữa lỗi 15–20 phút']},
  {day:2,label:'Thứ 3',items:['Tiếng Anh 16:15–18:15','Ôn nhanh 10 phút sau buổi học']},
  {day:3,label:'Thứ 4',items:['Hóa 16:30–18:30','Ôn công thức/phản ứng 15 phút']},
  {day:4,label:'Thứ 5',items:['Tiếng Anh 16:15–18:15','Quiz ngắn 8–10 câu']},
  {day:5,label:'Thứ 6',items:['Ngày đệm','Chữa phần yếu nhất tuần']},
  {day:6,label:'Thứ 7',items:['Toán 09:00–11:00','Cuối tháng: làm bài Toán tháng']},
  {day:0,label:'Chủ nhật',items:['Lý 07:00–09:00','Toán 09:00–11:00','Tổng kết tuần 15 phút']}
];

const MONTH_SCOPE={
  9:{math:['sqrt','radical'],english:['tenses','vocab'],physics:['ohm','circuit'],chemistry:['oxide','acid']},
  10:{math:['sqrt','radical','system'],english:['tenses','passive','vocab'],physics:['ohm','circuit','power'],chemistry:['oxide','acid','base']},
  11:{math:['radical','system','triangle'],english:['passive','relative','vocab'],physics:['circuit','power','energy'],chemistry:['acid','base','salt']},
  12:{math:['system','triangle','circle'],english:['relative','conditional','vocab'],physics:['power','energy','joule'],chemistry:['base','salt','exchange']},
  1:{math:['sqrt','radical','system','triangle','circle'],english:['tenses','passive','relative','conditional','vocab'],physics:['ohm','circuit','power','energy','joule'],chemistry:['oxide','acid','base','salt','exchange']}
};

const TIMELINE=[
  {label:'Tháng 9',range:'07–30/09',kind:'month',text:'Khởi động HKI • củng cố nền tảng • lấy mốc năng lực ban đầu.'},
  {label:'Tháng 10',range:'01–18/10',kind:'month',text:'Ôn tháng 10 • tăng dần vận dụng.'},
  {label:'Giữa kỳ I',range:'19/10–08/11',kind:'midterm',text:'Cửa sổ ôn giữa kỳ I • cộng dồn tháng 9–10.'},
  {label:'Tháng 11',range:'09–30/11',kind:'month',text:'Chữa lỗi giữa kỳ • học tiếp kiến thức mới.'},
  {label:'Tháng 12',range:'01–20/12',kind:'month',text:'Ôn tháng 12 • chuẩn bị tổng hợp HKI.'},
  {label:'Cuối kỳ I',range:'21/12–10/01',kind:'final',text:'Ôn toàn HKI • kiểm tra đủ 4 môn.'},
  {label:'Giữa kỳ II',range:'01–21/03',kind:'midterm',text:'Cộng dồn nội dung HKII đã học; ưu tiên lỗi lặp.'},
  {label:'Cuối kỳ II',range:'19/04–09/05',kind:'final',text:'Hoàn tất kiến thức năm học trước giai đoạn nước rút.'},
  {label:'Vào 10',range:'10–19/05',kind:'entrance',text:'Chuyển sang đề thi thật, ưu tiên Toán và Tiếng Anh.'}
];

let selectedSubject='math';
let selectedMode='month';
let activeQuiz=null;
let timer=null;
const $=id=>document.getElementById(id);

function read(key,def){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(def));}catch(e){return def;}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val));}
function history(){return read(STORAGE_HISTORY,[]);}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function topicName(subject,key){const t=SUBJECTS[subject].topics.find(x=>x[0]===key);return t?t[1]:key;}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function fmt(sec){const m=Math.floor(sec/60),s=sec%60;return m?m+' phút '+String(s).padStart(2,'0')+' giây':s+' giây';}
function level(p){return p>=90?'Vững':p>=75?'Khá':p>=60?'Đạt':'Cần củng cố';}
function toast(msg){const x=document.createElement('div');x.className='toast';x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),2200);}
function today(){const d=new Date();return{d,month:d.getMonth()+1,day:d.getDay(),date:d.getDate()};}
function term(){const m=today().month;return (m>=9||m===1)?1:2;}

function currentAutoMode(){
  const {month,date}=today();
  if(month===10&&date>=19)return'midterm';
  if(month===11&&date<=8)return'midterm';
  if(month===12&&date>=21)return'final';
  if(month===1&&date<=10)return'final';
  if(month===3&&date<=21)return'midterm';
  if(month===4&&date>=19)return'final';
  if(month===5&&date<=9)return'final';
  return'month';
}

function currentMonthLabel(){
  const m=today().month;
  return m===1?'Tháng 1 • cuối HKI':'Tháng '+m;
}

function weakTopicsFor(subject){
  const scores={};
  history().filter(x=>x.subject===subject).slice(0,8).forEach(r=>{
    Object.entries(r.topicStats||{}).forEach(([t,v])=>{
      if(!scores[t])scores[t]={c:0,n:0};
      scores[t].c+=v.correct;scores[t].n+=v.total;
    });
  });
  return Object.keys(scores).filter(t=>scores[t].n&&scores[t].c/scores[t].n<.7);
}

function monthTopics(subject){
  const m=today().month;
  const map=MONTH_SCOPE[m]||null;
  return map?map[subject]:SUBJECTS[subject].topics.map(x=>x[0]);
}

function scopeFor(subject,mode){
  if(mode==='month'){
    const base=monthTopics(subject);
    return Array.from(new Set([...base,...weakTopicsFor(subject)]));
  }
  if(mode==='midterm'){
    const t=term();
    if(t===1){
      const months=[9,10,11].filter(m=>MONTH_SCOPE[m]);
      return Array.from(new Set(months.flatMap(m=>MONTH_SCOPE[m][subject]).concat(weakTopicsFor(subject))));
    }
    return SUBJECTS[subject].topics.map(x=>x[0]);
  }
  return SUBJECTS[subject].topics.map(x=>x[0]);
}

function candidates(subject=selectedSubject,mode=selectedMode){
  const scope=scopeFor(subject,mode);
  return BANK[subject].filter(q=>scope.includes(q.topic));
}

function renderToday(){
  const t=today(),study=STUDY_WEEK.find(x=>x.day===t.day);
  $('todayBox').innerHTML='<label>Hôm nay</label><div class="today-main">'+study.label+'</div><div class="week-text">'+study.items.join(' • ')+'</div>';
}

function renderCurrentCycle(){
  const mode=currentAutoMode(),m=MODES[mode];
  $('currentCycle').innerHTML='<div><div class="eyebrow">CHẾ ĐỘ ĐƯỢC ĐỀ XUẤT HÔM NAY</div><h2>'+m.name+' • '+currentMonthLabel()+'</h2><p>'+m.desc+'</p></div><button class="btn primary no-print" id="goCurrent">Làm bài '+m.short.toLowerCase()+'</button>';
  $('goCurrent').onclick=()=>{selectedMode=mode;switchView('quiz');};
}

function renderCycleCards(){
  $('cycleCards').innerHTML=Object.entries(MODES).map(([k,m])=>'<article class="cycle-card '+m.tone+'"><div class="cycle-badge">'+m.short+'</div><h3>'+m.name+'</h3><p>'+m.desc+'</p><div class="cycle-meta"><b>'+m.questions+' câu/môn</b><span>≈ '+m.minutes+' phút</span></div><button class="btn secondary no-print" data-cycle="'+k+'">Chọn dạng này</button></article>').join('');
  document.querySelectorAll('[data-cycle]').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.cycle;switchView('quiz');});
}

function renderStudyWeek(){
  const td=today().day;
  $('studyWeek').innerHTML=STUDY_WEEK.map(x=>'<article class="day-card '+(x.day===td?'today':'')+'"><h3>'+x.label+(x.day===td?' • Hôm nay':'')+'</h3>'+x.items.map(i=>'<p>'+escapeHtml(i)+'</p>').join('')+'</article>').join('');
}

function renderTimeline(){
  $('yearTimeline').innerHTML=TIMELINE.map(x=>'<div class="timeline-item '+x.kind+'"><div class="timeline-dot"></div><div><div class="timeline-head"><strong>'+x.label+'</strong><span>'+x.range+'</span></div><p>'+x.text+'</p></div></div>').join('');
}

function switchView(v){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+v));
  if(v==='quiz'){renderModePicker();renderQuizSubjects();renderQuizSetup();}
  if(v==='report')renderReport();
  window.scrollTo({top:0,behavior:'smooth'});
}

function latest(subject,mode=null){
  return history().find(x=>x.subject===subject&&(!mode||x.mode===mode))||null;
}

function renderModePicker(){
  $('modePicker').innerHTML=Object.entries(MODES).map(([k,m])=>'<button class="mode-btn '+(selectedMode===k?'active':'')+'" data-mode="'+k+'"><strong>'+m.name+'</strong><span>'+m.questions+' câu • '+m.minutes+' phút</span></button>').join('');
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{selectedMode=b.dataset.mode;renderModePicker();renderQuizSubjects();renderQuizSetup();});
}

function renderQuizSubjects(){
  $('quizSubjectCards').innerHTML=Object.keys(SUBJECTS).map(k=>{
    const s=SUBJECTS[k],l=latest(k,selectedMode),scope=scopeFor(k,selectedMode);
    return '<article class="subject-card '+(selectedSubject===k?'active':'')+'" data-subject="'+k+'"><div class="subject-icon">'+s.icon+'</div><h3>'+s.name+'</h3><p>'+scope.length+' chủ đề trong phạm vi</p><div class="latest">'+(l?l.percent+'% • '+l.level:'Chưa làm dạng này')+'</div></article>';
  }).join('');
  document.querySelectorAll('.subject-card').forEach(c=>c.onclick=()=>{selectedSubject=c.dataset.subject;renderQuizSubjects();renderQuizSetup();});
}

function renderQuizSetup(){
  const s=SUBJECTS[selectedSubject],m=MODES[selectedMode],scope=scopeFor(selectedSubject,selectedMode),cs=candidates();
  const weak=weakTopicsFor(selectedSubject);
  $('quizSetup').innerHTML='<div class="quiz-setup-grid"><div><h3 style="margin-top:0">'+s.name+' • '+m.name+'</h3><div class="scope-box"><strong>Phạm vi tự động</strong><div class="scope-tags">'+scope.map(t=>'<span class="pill blue">'+escapeHtml(topicName(selectedSubject,t))+'</span>').join('')+'</div>'+(weak.length?'<p class="muted"><strong>Được cài lại vì từng yếu:</strong> '+weak.map(t=>escapeHtml(topicName(selectedSubject,t))).join(', ')+'</p>':'')+'</div></div><div><div class="exam-spec"><div><b>'+Math.min(m.questions,cs.length)+'</b><span>Câu</span></div><div><b>'+m.minutes+'</b><span>Phút gợi ý</span></div></div><p class="muted">'+m.desc+'</p><button id="startQuizBtn" class="btn primary" style="width:100%">Bắt đầu '+m.name.toLowerCase()+'</button></div></div>';
  $('startQuizBtn').onclick=startQuiz;
}

function startQuiz(){
  const cs=candidates(),m=MODES[selectedMode],n=Math.min(m.questions,cs.length);
  if(!n){toast('Chưa có câu hỏi phù hợp.');return;}
  clearInterval(timer);
  activeQuiz={subject:selectedSubject,mode:selectedMode,questions:shuffle(cs).slice(0,n),answers:Array(n).fill(null),index:0,started:Date.now()};
  $('quizSetup').classList.add('hidden');$('quizResult').classList.add('hidden');$('quizRunner').classList.remove('hidden');
  timer=setInterval(()=>{if(activeQuiz&&$('quizTimer'))$('quizTimer').textContent=fmt(Math.floor((Date.now()-activeQuiz.started)/1000));},1000);
  renderQuestion();
}

function renderQuestion(){
  const z=activeQuiz,q=z.questions[z.index],sel=z.answers[z.index],answered=z.answers.filter(x=>x!==null).length;
  const opts=q.options.map((o,i)=>'<label class="answer '+(sel===i?'selected':'')+'"><input type="radio" name="answer" value="'+i+'" '+(sel===i?'checked':'')+'><span><b>'+String.fromCharCode(65+i)+'.</b> '+escapeHtml(o)+'</span></label>').join('');
  $('quizRunner').innerHTML='<div class="quiz-toolbar"><div><strong>'+SUBJECTS[z.subject].name+' • '+MODES[z.mode].name+'</strong><div class="progress" style="width:230px;max-width:55vw"><div style="width:'+Math.round((z.index+1)/z.questions.length*100)+'%"></div></div></div><div class="progress-meta"><span>'+answered+'/'+z.questions.length+' đã trả lời</span><span id="quizTimer">'+fmt(Math.floor((Date.now()-z.started)/1000))+'</span></div></div><div class="q-number">CÂU '+(z.index+1)+' / '+z.questions.length+' • '+escapeHtml(topicName(z.subject,q.topic))+'</div><div class="q-text">'+escapeHtml(q.text)+'</div><div class="answers">'+opts+'</div><div class="quiz-nav"><button id="prevBtn" class="btn secondary" '+(z.index===0?'disabled':'')+'>← Câu trước</button><div><button id="finishBtn" class="btn secondary">Nộp bài</button> <button id="nextBtn" class="btn primary">'+(z.index===z.questions.length-1?'Nộp bài':'Câu tiếp →')+'</button></div></div>';
  document.querySelectorAll('input[name=answer]').forEach(r=>r.onchange=()=>{z.answers[z.index]=Number(r.value);renderQuestion();});
  $('prevBtn').onclick=()=>{if(z.index>0){z.index--;renderQuestion();}};
  $('nextBtn').onclick=()=>{if(z.index<z.questions.length-1){z.index++;renderQuestion();}else submitQuiz();};
  $('finishBtn').onclick=submitQuiz;
}

function submitQuiz(){
  const z=activeQuiz,missing=z.answers.filter(x=>x===null).length;
  if(missing&&!confirm('Còn '+missing+' câu chưa trả lời. Vẫn nộp bài?'))return;
  clearInterval(timer);
  let correct=0;const stats={},wrong=[];
  z.questions.forEach((q,i)=>{const ok=z.answers[i]===q.answer;if(ok)correct++;else wrong.push({q,chosen:z.answers[i],num:i+1});if(!stats[q.topic])stats[q.topic]={correct:0,total:0};stats[q.topic].total++;if(ok)stats[q.topic].correct++;});
  const pct=Math.round(correct/z.questions.length*100),weak=Object.keys(stats).filter(t=>Math.round(stats[t].correct/stats[t].total*100)<70),elapsed=Math.floor((Date.now()-z.started)/1000);
  const res={date:new Date().toISOString(),mode:z.mode,cycleLabel:MODES[z.mode].name,subject:z.subject,score:correct,total:z.questions.length,percent:pct,level:level(pct),elapsed,weakTopics:weak,topicStats:stats};
  const h=history();h.unshift(res);write(STORAGE_HISTORY,h.slice(0,300));
  $('quizRunner').classList.add('hidden');$('quizResult').classList.remove('hidden');renderResult(res,wrong);renderQuizSubjects();activeQuiz=null;
}

function advice(r){
  const names=r.weakTopics.map(t=>topicName(r.subject,t)).join(', ');
  if(r.percent>=90)return r.mode==='final'?'Đã vững ở mức cuối kỳ. Chuyển sang đề tổng hợp có giới hạn thời gian.':'Duy trì, tháng sau tăng tỷ lệ câu vận dụng.';
  if(r.percent>=75)return'Chữa toàn bộ câu sai; sau 2–3 ngày làm lại 5 câu ở '+(names||'phần vừa sai')+'.';
  if(r.percent>=60)return'Ôn lại công thức/quy tắc, rồi làm 8–10 câu cơ bản ở '+(names||'chuyên đề chưa chắc')+'.';
  return'Chưa tăng độ khó. Học lại nền tảng '+(names||'các phần sai')+' và kiểm tra lại bằng Quiz tháng trước khi chuyển tầng.';
}

function renderResult(r,wrong){
  const stats=Object.keys(r.topicStats).map(t=>{const v=r.topicStats[t],p=Math.round(v.correct/v.total*100),cl=p>=80?'good':p>=60?'warn':'bad';return'<div class="topic-stat"><span>'+escapeHtml(topicName(r.subject,t))+'</span><span class="pill '+cl+'">'+v.correct+'/'+v.total+' • '+p+'%</span></div>';}).join('');
  const weak=r.weakTopics.length?r.weakTopics.map(t=>'<span class="pill bad">'+escapeHtml(topicName(r.subject,t))+'</span>').join(' '):'<span class="pill good">Không có nhóm lỗi nổi bật</span>';
  const review=wrong.length?wrong.map(w=>'<div class="review-item"><h4>Câu '+w.num+'. '+escapeHtml(w.q.text)+'</h4><p><strong>Ken chọn:</strong> '+(w.chosen===null?'Chưa trả lời':escapeHtml(w.q.options[w.chosen]))+'</p><p><strong>Đáp án đúng:</strong> '+escapeHtml(w.q.options[w.q.answer])+'</p><div class="explain"><strong>Giải thích:</strong> '+escapeHtml(w.q.explain)+'</div></div>').join(''):'<div class="notice"><strong>Tốt:</strong> Không có câu sai trong lượt này.</div>';
  $('quizResult').innerHTML='<div class="result-hero"><div class="result-top"><div><div class="eyebrow">'+r.cycleLabel.toUpperCase()+' • '+SUBJECTS[r.subject].name.toUpperCase()+'</div><div class="score-big">'+r.score+'/'+r.total+' • '+r.percent+'%</div><div class="result-level">'+r.level+'</div></div><button id="againBtn" class="btn secondary no-print">Làm bài khác</button></div><div class="metrics"><div class="metric"><b>'+r.score+'/'+r.total+'</b><span>Câu đúng</span></div><div class="metric"><b>'+r.percent+'%</b><span>Chính xác</span></div><div class="metric"><b>'+fmt(r.elapsed)+'</b><span>Thời gian</span></div><div class="metric"><b>'+r.weakTopics.length+'</b><span>Nhóm cần củng cố</span></div></div></div><div class="result-grid"><div class="result-box"><h3>Theo từng chủ đề</h3>'+stats+'</div><div class="result-box"><h3>Cần học nhiều hơn</h3><div>'+weak+'</div><h3 style="margin-top:16px">Nhiệm vụ tiếp theo</h3><p>'+escapeHtml(advice(r))+'</p></div></div><div class="review-list"><h3>Chữa câu sai</h3>'+review+'</div>';
  $('againBtn').onclick=()=>{$('quizResult').classList.add('hidden');$('quizSetup').classList.remove('hidden');renderQuizSetup();};
  $('quizResult').scrollIntoView({behavior:'smooth'});
}

function renderWeaknessBoard(){
  let rows=[];
  Object.keys(SUBJECTS).forEach(s=>{
    const ws=weakTopicsFor(s);
    if(ws.length)rows.push('<div class="weak-row"><strong>'+SUBJECTS[s].name+'</strong><div>'+ws.map(t=>'<span class="pill bad">'+escapeHtml(topicName(s,t))+'</span>').join(' ')+'</div></div>');
  });
  $('weaknessBoard').innerHTML='<div class="panel-head" style="padding:0 0 12px"><h3>Chuyên đề cần quay lại</h3><span class="muted">Tính từ các bài gần nhất</span></div>'+(rows.length?rows.join(''):'<p class="muted">Chưa có đủ dữ liệu để xác định điểm yếu.</p>');
}

function renderReport(){
  const h=history();
  $('summaryCards').innerHTML=Object.keys(SUBJECTS).map(k=>{const l=latest(k);return'<article class="summary-card"><h3>'+SUBJECTS[k].name+'</h3><div class="summary-score">'+(l?l.percent+'%':'—')+'</div><p>'+(l?l.level+' • '+(l.cycleLabel||'Bài kiểm tra'):'Chưa có bài kiểm tra')+'</p>'+(l?'<p style="margin-top:5px">Cần chú ý: '+escapeHtml((l.weakTopics||[]).map(t=>topicName(k,t)).join(', ')||'Không có nhóm lỗi nổi bật')+'</p>':'')+'</article>';}).join('');
  renderWeaknessBoard();
  $('historyCount').textContent=h.length+' lượt kiểm tra';
  $('historyBody').innerHTML=h.length?h.map(x=>{const w=(x.weakTopics||[]).map(t=>topicName(x.subject,t)).join(', ')||'—',cl=x.percent>=80?'good':x.percent>=60?'warn':'bad';return'<tr><td>'+new Date(x.date).toLocaleDateString('vi-VN')+'</td><td>'+(x.cycleLabel||x.mode||'Theo tuần')+'</td><td><strong>'+SUBJECTS[x.subject].name+'</strong></td><td>'+x.score+'/'+x.total+' • '+x.percent+'%</td><td><span class="pill '+cl+'">'+x.level+'</span></td><td>'+escapeHtml(w)+'</td></tr>';}).join(''):'<tr><td colspan="6" class="empty">Chưa có dữ liệu. Hãy làm bài đầu tiên.</td></tr>';
}

function exportData(){
  const data={exportedAt:new Date().toISOString(),history:history(),studyWeek:STUDY_WEEK,timeline:TIMELINE};
  const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download='ken-study-cycle-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);
}

document.addEventListener('DOMContentLoaded',()=>{
  selectedMode=currentAutoMode();
  renderToday();renderCurrentCycle();renderCycleCards();renderStudyWeek();renderTimeline();
  renderModePicker();renderQuizSubjects();renderQuizSetup();renderReport();
  document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchView(b.dataset.view));
  $('printBtn').onclick=()=>window.print();
  $('exportBtn').onclick=exportData;
});
