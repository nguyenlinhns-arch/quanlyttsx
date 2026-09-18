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







const KEY='kenSimple.history.v1';
const MODES={
  month:{name:'Tháng',full:'Ôn tháng'},
  midterm:{name:'Giữa kỳ',full:'Giữa kỳ'},
  final:{name:'Cuối kỳ',full:'Cuối kỳ'}
};
const MONTH_SCOPE={
  math:['sqrt','radical'],
  english:['tenses','vocab'],
  physics:['ohm','circuit'],
  chemistry:['oxide','acid']
};
const MID_SCOPE={
  math:['sqrt','radical','system','triangle'],
  english:['tenses','passive','vocab'],
  physics:['ohm','circuit','power'],
  chemistry:['oxide','acid','base']
};

let mode='month',subject='math',state=null,timer=null;
const $=id=>document.getElementById(id);
function hist(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function topicName(s,t){const x=SUBJECTS[s].topics.find(v=>v[0]===t);return x?x[1]:t}
function scope(s,m){if(m==='month')return MONTH_SCOPE[s];if(m==='midterm')return MID_SCOPE[s];return SUBJECTS[s].topics.map(x=>x[0])}
function qs(){const sc=scope(subject,mode);return BANK[subject].filter(q=>sc.includes(q.topic))}
function latest(s){return hist().find(x=>x.subject===s)||null}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function grade(p){return p>=85?'Vững':p>=70?'Khá':p>=55?'Đạt':'Cần học lại'}

function renderSelectors(){
  $('milestones').innerHTML=Object.entries(MODES).map(([k,v])=>'<button class="'+(k===mode?'active':'')+'" data-mode="'+k+'">'+v.name+'</button>').join('');
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;renderSelectors();renderReady()});
  $('subjects').innerHTML=Object.keys(SUBJECTS).map(k=>{const s=SUBJECTS[k],l=latest(k);return'<button class="subject '+(k===subject?'active':'')+'" data-sub="'+k+'"><div class="subject-icon">'+s.icon+'</div>'+s.name+'<small>'+(l?l.percent+'% gần nhất':'Chưa làm')+'</small></button>'}).join('');
  document.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{subject=b.dataset.sub;renderSelectors();renderReady()});
}

function renderReady(){
  const c=qs(),names=scope(subject,mode).map(t=>topicName(subject,t)).join(' • ');
  $('ready').classList.remove('hidden');$('quiz').classList.add('hidden');$('result').classList.add('hidden');
  $('ready').innerHTML='<div class="ready-top"><div><h2>'+MODES[mode].full+' • '+SUBJECTS[subject].name+'</h2><p>'+c.length+' câu kiểm tra</p></div><button id="start" class="btn primary">Bắt đầu</button></div><div class="topics">'+esc(names)+'</div>';
  $('start').onclick=startQuiz;
}

function startQuiz(){
  clearInterval(timer);
  const questions=shuffle(qs());
  state={questions,answers:Array(questions.length).fill(null),index:0,started:Date.now()};
  $('ready').classList.add('hidden');$('result').classList.add('hidden');$('quiz').classList.remove('hidden');
  timer=setInterval(()=>{if($('clock')&&state)$('clock').textContent=Math.floor((Date.now()-state.started)/1000)+'s'},1000);
  renderQuestion();
}

function renderQuestion(){
  const q=state.questions[state.index],sel=state.answers[state.index];
  $('quiz').innerHTML='<div class="quiz-head"><span>'+SUBJECTS[subject].name+' • '+MODES[mode].name+'</span><span>'+(state.index+1)+'/'+state.questions.length+' • <span id="clock">'+Math.floor((Date.now()-state.started)/1000)+'s</span></span></div><div class="question">'+esc(q.text)+'</div><div class="answers">'+q.options.map((o,i)=>'<label class="answer '+(sel===i?'selected':'')+'"><input type="radio" name="a" value="'+i+'" '+(sel===i?'checked':'')+'><span><b>'+String.fromCharCode(65+i)+'.</b> '+esc(o)+'</span></label>').join('')+'</div><div class="quiz-nav"><button id="prev" class="btn secondary" '+(state.index===0?'disabled':'')+'>←</button><button id="next" class="btn primary">'+(state.index===state.questions.length-1?'Nộp bài':'Tiếp →')+'</button></div>';
  document.querySelectorAll('input[name=a]').forEach(r=>r.onchange=()=>{state.answers[state.index]=Number(r.value);renderQuestion()});
  $('prev').onclick=()=>{if(state.index>0){state.index--;renderQuestion()}};
  $('next').onclick=()=>{if(state.index<state.questions.length-1){state.index++;renderQuestion()}else submit()};
}

function submit(){
  clearInterval(timer);
  let correct=0;const stats={},wrong=[];
  state.questions.forEach((q,i)=>{const ok=state.answers[i]===q.answer;if(ok)correct++;else wrong.push({q,chosen:state.answers[i],num:i+1});if(!stats[q.topic])stats[q.topic]={correct:0,total:0};stats[q.topic].total++;if(ok)stats[q.topic].correct++});
  const percent=Math.round(correct/state.questions.length*100);
  const strong=Object.keys(stats).filter(t=>stats[t].correct/stats[t].total>=.75);
  const weak=Object.keys(stats).filter(t=>stats[t].correct/stats[t].total<.6);
  const r={date:new Date().toISOString(),mode,subject,score:correct,total:state.questions.length,percent,level:grade(percent),strongTopics:strong,weakTopics:weak};
  const h=hist();h.unshift(r);save(h.slice(0,100));
  $('quiz').classList.add('hidden');$('result').classList.remove('hidden');
  renderResult(r,wrong);renderSelectors();renderRecent();state=null;
}

function nextTask(r){
  if(r.weakTopics.length)return'Học lại '+r.weakTopics.map(t=>topicName(r.subject,t)).join(', ')+' rồi kiểm tra lại.';
  if(r.percent>=85)return'Có thể chuyển sang mốc khó hơn.';
  return'Chữa câu sai và làm lại sau 2–3 ngày.';
}

function renderResult(r,wrong){
  const strong=r.strongTopics.length?r.strongTopics.map(t=>'<span class="pill good">'+esc(topicName(r.subject,t))+'</span>').join(' '):'<span class="pill warn">Chưa đủ dữ liệu</span>';
  const weak=r.weakTopics.length?r.weakTopics.map(t=>'<span class="pill bad">'+esc(topicName(r.subject,t))+'</span>').join(' '):'<span class="pill good">Không có phần yếu rõ</span>';
  const detail=wrong.length?wrong.map(w=>'<div class="wrong"><b>Câu '+w.num+'. '+esc(w.q.text)+'</b><p>Đáp án đúng: '+esc(w.q.options[w.q.answer])+'</p><p>'+esc(w.q.explain)+'</p></div>').join(''):'<p>Không có câu sai.</p>';
  $('result').innerHTML='<div class="score"><div class="eyebrow">'+MODES[r.mode].full.toUpperCase()+' • '+SUBJECTS[r.subject].name.toUpperCase()+'</div><b>'+r.percent+'%</b><span>'+r.score+'/'+r.total+' câu đúng • '+r.level+'</span></div><div class="result-cards"><div class="result-card"><h3>Đã vững</h3>'+strong+'</div><div class="result-card"><h3>Cần học lại</h3>'+weak+'</div><div class="result-card"><h3>Việc tiếp theo</h3><div>'+esc(nextTask(r))+'</div></div></div><details><summary>Xem câu sai ('+wrong.length+')</summary>'+detail+'</details><div style="margin-top:12px"><button id="again" class="btn primary">Làm lại</button></div>';
  $('again').onclick=renderReady;
}

function renderRecent(){
  $('recent').innerHTML='<h2>Kết quả gần nhất</h2><div class="recent-grid">'+Object.keys(SUBJECTS).map(k=>{const l=latest(k);return'<div class="recent-item"><span>'+SUBJECTS[k].name+'</span><b>'+(l?l.percent+'%':'—')+'</b><span>'+(l?l.level:'Chưa kiểm tra')+'</span></div>'}).join('')+'</div>';
}

document.addEventListener('DOMContentLoaded',()=>{renderSelectors();renderReady();renderRecent()});
