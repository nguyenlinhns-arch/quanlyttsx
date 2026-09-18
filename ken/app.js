'use strict';

const STORAGE_PLAN='kenWeekly.plan.v3';
const STORAGE_HISTORY='kenWeekly.history.v3';

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

let selectedSubject='math';
let activeQuiz=null;
let timer=null;
const $=function(id){return document.getElementById(id);};

function read(key,def){try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(def));}catch(e){return def;}}
function write(key,val){localStorage.setItem(key,JSON.stringify(val));}
function plans(){return read(STORAGE_PLAN,{});}
function history(){return read(STORAGE_HISTORY,[]);}
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function topicName(subject,key){var t=SUBJECTS[subject].topics.find(function(x){return x[0]===key;});return t?t[1]:key;}
function weekNow(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+3-((d.getDay()+6)%7));var w1=new Date(d.getFullYear(),0,4);var w=1+Math.round(((d-w1)/86400000-3+((w1.getDay()+6)%7))/7);return d.getFullYear()+'-W'+String(w).padStart(2,'0');}
function weekLabel(v){if(!v)return'';var p=v.split('-W');return'Tuần '+Number(p[1])+' • '+p[0];}
function currentWeek(){return $('weekInput').value;}
function getPlan(subject){var p=plans();return(p[currentWeek()]&&p[currentWeek()][subject])||{topics:[],note:''};}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=a[i];a[i]=a[j];a[j]=x;}return a;}
function fmt(sec){var m=Math.floor(sec/60),s=sec%60;return m?m+' phút '+String(s).padStart(2,'0')+' giây':s+' giây';}
function level(p){return p>=90?'Vững':p>=75?'Khá':p>=60?'Đạt':'Cần củng cố';}
function toast(msg){var x=document.createElement('div');x.className='toast';x.textContent=msg;document.body.appendChild(x);setTimeout(function(){x.remove();},2200);}

function renderPlan(){
  $('weekText').textContent=weekLabel(currentWeek());
  var out='';
  Object.keys(SUBJECTS).forEach(function(k){
    var s=SUBJECTS[k],p=getPlan(k);
    out+='<article class="plan-card" data-subject="'+k+'"><div class="plan-title"><div><h3>'+s.name+'</h3><div class="muted">'+p.topics.length+' chủ đề đã chọn</div></div><div class="subject-icon">'+s.icon+'</div></div><div class="topic-list">';
    s.topics.forEach(function(t){out+='<label class="topic-chip"><input type="checkbox" data-topic="'+t[0]+'" '+(p.topics.indexOf(t[0])>=0?'checked':'')+'><span>'+escapeHtml(t[1])+'</span></label>';});
    out+='</div><div class="plan-note"><label>Bài cụ thể / ghi chú tiến độ</label><textarea data-note placeholder="Ví dụ: bài đã học, dạng cô vừa chữa...">'+escapeHtml(p.note||'')+'</textarea></div></article>';
  });
  $('planGrid').innerHTML=out;
  document.querySelectorAll('.plan-card input').forEach(function(el){el.addEventListener('change',function(){var c=el.closest('.plan-card');c.querySelector('.muted').textContent=c.querySelectorAll('input:checked').length+' chủ đề đã chọn';});});
}
function savePlan(){
  var all=plans(),w=currentWeek();if(!all[w])all[w]={};
  document.querySelectorAll('.plan-card').forEach(function(card){
    var ts=Array.from(card.querySelectorAll('input:checked')).map(function(x){return x.dataset.topic;});
    all[w][card.dataset.subject]={topics:ts,note:card.querySelector('[data-note]').value.trim(),updatedAt:new Date().toISOString()};
  });
  write(STORAGE_PLAN,all);$('savePlanStatus').textContent='Đã lưu '+weekLabel(w).toLowerCase()+'.';renderQuizSubjects();renderQuizSetup();setTimeout(function(){$('savePlanStatus').textContent='';},2000);
}
function starter(){
  document.querySelectorAll('.plan-card').forEach(function(card){var list=STARTER[card.dataset.subject];card.querySelectorAll('input').forEach(function(cb){cb.checked=list.indexOf(cb.dataset.topic)>=0;});card.querySelector('.muted').textContent=list.length+' chủ đề đã chọn';});
  toast('Đã nạp gợi ý đầu năm. Hãy chỉnh lại theo đúng bài Ken đã học.');
}
function switchView(v){
  document.querySelectorAll('.tab').forEach(function(b){b.classList.toggle('active',b.dataset.view===v);});
  document.querySelectorAll('.view').forEach(function(x){x.classList.toggle('active',x.id==='view-'+v);});
  if(v==='report')renderReport();if(v==='quiz'){renderQuizSubjects();renderQuizSetup();}window.scrollTo({top:0,behavior:'smooth'});
}
function latest(subject,weekOnly){return history().filter(function(x){return x.subject===subject&&(!weekOnly||x.week===currentWeek());})[0]||null;}
function renderQuizSubjects(){
  var out='';
  Object.keys(SUBJECTS).forEach(function(k){var s=SUBJECTS[k],p=getPlan(k),l=latest(k,true);out+='<article class="subject-card '+(selectedSubject===k?'active':'')+'" data-subject="'+k+'"><div class="subject-icon">'+s.icon+'</div><h3>'+s.name+'</h3><p>'+(p.topics.length?p.topics.length+' chủ đề trong phạm vi':'Chưa chọn phạm vi tuần')+'</p><div class="latest">'+(l?l.percent+'% • '+l.level:'Chưa làm tuần này')+'</div></article>';});
  $('quizSubjectCards').innerHTML=out;
  document.querySelectorAll('.subject-card').forEach(function(c){c.addEventListener('click',function(){selectedSubject=c.dataset.subject;renderQuizSubjects();renderQuizSetup();});});
}
function candidates(){
  var p=getPlan(selectedSubject);if(!p.topics.length)return BANK[selectedSubject];
  return BANK[selectedSubject].filter(function(x){return p.topics.indexOf(x.topic)>=0;});
}
function renderQuizSetup(){
  var s=SUBJECTS[selectedSubject],p=getPlan(selectedSubject),cs=candidates(),topics=p.topics.length?p.topics:s.topics.map(function(t){return t[0];});
  var tags=topics.map(function(t){return'<span class="pill blue">'+escapeHtml(topicName(selectedSubject,t))+'</span>';}).join('');
  $('quizSetup').innerHTML='<div class="quiz-setup-grid"><div><h3 style="margin-top:0">'+s.name+' • '+weekLabel(currentWeek())+'</h3><div class="scope-box"><strong>Phạm vi Quiz</strong><div class="scope-tags">'+tags+'</div>'+(p.note?'<p class="muted"><strong>Ghi chú:</strong> '+escapeHtml(p.note)+'</p>':'')+(!p.topics.length?'<p class="muted">Chưa chọn chủ đề tuần này; hệ thống đang dùng toàn bộ ngân hàng môn. Nên cập nhật tiến độ để đánh giá chính xác.</p>':'')+'</div></div><div><div class="form-row"><label>Số câu</label><select id="questionCount"><option>8</option><option selected>10</option><option>12</option></select></div><p class="muted">Có '+cs.length+' câu phù hợp.</p><button id="startQuizBtn" class="btn primary" style="width:100%">Bắt đầu kiểm tra</button><button id="backPlanBtn" class="btn secondary" style="width:100%;margin-top:8px">Sửa phạm vi tuần</button></div></div>';
  $('startQuizBtn').onclick=startQuiz;$('backPlanBtn').onclick=function(){switchView('plan');};
}
function startQuiz(){
  var cs=candidates(),n=Math.min(Number($('questionCount').value),cs.length);if(!n){toast('Chưa có câu hỏi phù hợp.');return;}
  clearInterval(timer);activeQuiz={subject:selectedSubject,week:currentWeek(),questions:shuffle(cs).slice(0,n),answers:Array(n).fill(null),index:0,started:Date.now()};
  $('quizSetup').classList.add('hidden');$('quizResult').classList.add('hidden');$('quizRunner').classList.remove('hidden');
  timer=setInterval(function(){if(activeQuiz&&$('quizTimer'))$('quizTimer').textContent=fmt(Math.floor((Date.now()-activeQuiz.started)/1000));},1000);renderQuestion();
}
function renderQuestion(){
  var z=activeQuiz,q=z.questions[z.index],sel=z.answers[z.index],answered=z.answers.filter(function(x){return x!==null;}).length;
  var opts=q.options.map(function(o,i){return'<label class="answer '+(sel===i?'selected':'')+'"><input type="radio" name="answer" value="'+i+'" '+(sel===i?'checked':'')+'><span><b>'+String.fromCharCode(65+i)+'.</b> '+escapeHtml(o)+'</span></label>';}).join('');
  $('quizRunner').innerHTML='<div class="quiz-toolbar"><div><strong>'+SUBJECTS[z.subject].name+'</strong><div class="progress" style="width:230px;max-width:55vw"><div style="width:'+Math.round((z.index+1)/z.questions.length*100)+'%"></div></div></div><div class="progress-meta"><span>'+answered+'/'+z.questions.length+' đã trả lời</span><span id="quizTimer">'+fmt(Math.floor((Date.now()-z.started)/1000))+'</span></div></div><div class="q-number">CÂU '+(z.index+1)+' / '+z.questions.length+' • '+escapeHtml(topicName(z.subject,q.topic))+'</div><div class="q-text">'+escapeHtml(q.text)+'</div><div class="answers">'+opts+'</div><div class="quiz-nav"><button id="prevBtn" class="btn secondary" '+(z.index===0?'disabled':'')+'>← Câu trước</button><div><button id="finishBtn" class="btn secondary">Nộp bài</button> <button id="nextBtn" class="btn primary">'+(z.index===z.questions.length-1?'Nộp bài':'Câu tiếp →')+'</button></div></div>';
  document.querySelectorAll('input[name=answer]').forEach(function(r){r.onchange=function(){z.answers[z.index]=Number(r.value);renderQuestion();};});
  $('prevBtn').onclick=function(){if(z.index>0){z.index--;renderQuestion();}};
  $('nextBtn').onclick=function(){if(z.index<z.questions.length-1){z.index++;renderQuestion();}else submitQuiz();};$('finishBtn').onclick=submitQuiz;
}
function submitQuiz(){
  var z=activeQuiz,missing=z.answers.filter(function(x){return x===null;}).length;if(missing&&!confirm('Còn '+missing+' câu chưa trả lời. Vẫn nộp bài?'))return;
  clearInterval(timer);var correct=0,stats={},wrong=[];
  z.questions.forEach(function(q,i){var ok=z.answers[i]===q.answer;if(ok)correct++;else wrong.push({q:q,chosen:z.answers[i],num:i+1});if(!stats[q.topic])stats[q.topic]={correct:0,total:0};stats[q.topic].total++;if(ok)stats[q.topic].correct++;});
  var pct=Math.round(correct/z.questions.length*100),weak=Object.keys(stats).filter(function(t){return Math.round(stats[t].correct/stats[t].total*100)<70;}),elapsed=Math.floor((Date.now()-z.started)/1000);
  var res={date:new Date().toISOString(),week:z.week,subject:z.subject,score:correct,total:z.questions.length,percent:pct,level:level(pct),elapsed:elapsed,weakTopics:weak,topicStats:stats};
  var h=history();h.unshift(res);write(STORAGE_HISTORY,h.slice(0,200));$('quizRunner').classList.add('hidden');$('quizResult').classList.remove('hidden');renderResult(res,wrong);renderQuizSubjects();activeQuiz=null;
}
function advice(r){
  var names=r.weakTopics.map(function(t){return topicName(r.subject,t);}).join(', ');
  if(r.percent>=90)return'Giữ nhịp tốt; tăng dần câu vận dụng và kiểm tra lại có giới hạn thời gian.';
  if(r.percent>=75)return'Chữa kỹ câu sai; mỗi phần chưa chắc làm thêm 3–5 câu tương tự'+(names?': '+names:'')+'.';
  if(r.percent>=60)return'Ôn lại công thức/quy tắc và làm 8–10 câu cơ bản'+(names?' cho: '+names:'')+' trước khi tăng độ khó.';
  return'Tạm chưa làm bài khó. Học lại nền tảng'+(names?' của: '+names:'')+'; mỗi phần làm 5 câu nhận biết + 5 câu thông hiểu.';
}
function renderResult(r,wrong){
  var stats=Object.keys(r.topicStats).map(function(t){var v=r.topicStats[t],p=Math.round(v.correct/v.total*100),cl=p>=80?'good':p>=60?'warn':'bad';return'<div class="topic-stat"><span>'+escapeHtml(topicName(r.subject,t))+'</span><span class="pill '+cl+'">'+v.correct+'/'+v.total+' • '+p+'%</span></div>';}).join('');
  var weak=r.weakTopics.length?r.weakTopics.map(function(t){return'<span class="pill bad">'+escapeHtml(topicName(r.subject,t))+'</span>';}).join(' '):'<span class="pill good">Không có nhóm lỗi nổi bật</span>';
  var review=wrong.length?wrong.map(function(w){return'<div class="review-item"><h4>Câu '+w.num+'. '+escapeHtml(w.q.text)+'</h4><p><strong>Ken chọn:</strong> '+(w.chosen===null?'Chưa trả lời':escapeHtml(w.q.options[w.chosen]))+'</p><p><strong>Đáp án đúng:</strong> '+escapeHtml(w.q.options[w.q.answer])+'</p><div class="explain"><strong>Giải thích:</strong> '+escapeHtml(w.q.explain)+'</div></div>';}).join(''):'<div class="notice"><strong>Tốt:</strong> Không có câu sai trong lượt này.</div>';
  $('quizResult').innerHTML='<div class="result-hero"><div class="result-top"><div><div class="eyebrow">KẾT QUẢ '+SUBJECTS[r.subject].name.toUpperCase()+'</div><div class="score-big">'+r.score+'/'+r.total+' • '+r.percent+'%</div><div class="result-level">'+r.level+'</div></div><button id="againBtn" class="btn secondary no-print">Làm Quiz khác</button></div><div class="metrics"><div class="metric"><b>'+r.score+'/'+r.total+'</b><span>Câu đúng</span></div><div class="metric"><b>'+r.percent+'%</b><span>Chính xác</span></div><div class="metric"><b>'+fmt(r.elapsed)+'</b><span>Thời gian</span></div><div class="metric"><b>'+r.weakTopics.length+'</b><span>Nhóm cần củng cố</span></div></div></div><div class="result-grid"><div class="result-box"><h3>Theo từng chủ đề</h3>'+stats+'</div><div class="result-box"><h3>Cần học nhiều hơn</h3><div>'+weak+'</div><h3 style="margin-top:16px">Nhiệm vụ tiếp theo</h3><p>'+escapeHtml(advice(r))+'</p></div></div><div class="review-list"><h3>Chữa câu sai</h3>'+review+'</div>';
  $('againBtn').onclick=function(){$('quizResult').classList.add('hidden');$('quizSetup').classList.remove('hidden');renderQuizSetup();};$('quizResult').scrollIntoView({behavior:'smooth'});
}
function renderReport(){
  var h=history(),cards='';
  Object.keys(SUBJECTS).forEach(function(k){var l=latest(k,false);cards+='<article class="summary-card"><h3>'+SUBJECTS[k].name+'</h3><div class="summary-score">'+(l?l.percent+'%':'—')+'</div><p>'+(l?l.level+' • '+l.score+'/'+l.total:'Chưa có bài kiểm tra')+'</p>'+(l?'<p style="margin-top:5px">Cần chú ý: '+escapeHtml((l.weakTopics||[]).map(function(t){return topicName(k,t);}).join(', ')||'Không có nhóm lỗi nổi bật')+'</p>':'')+'</article>';});
  $('summaryCards').innerHTML=cards;$('historyCount').textContent=h.length+' lượt kiểm tra';
  $('historyBody').innerHTML=h.length?h.map(function(x){var w=(x.weakTopics||[]).map(function(t){return topicName(x.subject,t);}).join(', ')||'—',cl=x.percent>=80?'good':x.percent>=60?'warn':'bad';return'<tr><td>'+new Date(x.date).toLocaleDateString('vi-VN')+'</td><td>'+escapeHtml(x.week)+'</td><td><strong>'+SUBJECTS[x.subject].name+'</strong></td><td>'+x.score+'/'+x.total+' • '+x.percent+'%</td><td><span class="pill '+cl+'">'+x.level+'</span></td><td>'+escapeHtml(w)+'</td></tr>';}).join(''):'<tr><td colspan="6" class="empty">Chưa có dữ liệu. Hãy làm Quiz đầu tiên.</td></tr>';
}
function exportData(){var data={exportedAt:new Date().toISOString(),plans:plans(),history:history()},b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='ken-weekly-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);}

document.addEventListener('DOMContentLoaded',function(){
  $('weekInput').value=weekNow();renderPlan();renderQuizSubjects();renderQuizSetup();renderReport();
  document.querySelectorAll('.tab').forEach(function(b){b.onclick=function(){switchView(b.dataset.view);};});
  $('weekInput').onchange=function(){renderPlan();renderQuizSubjects();renderQuizSetup();renderReport();};
  $('savePlanBtn').onclick=savePlan;$('starterBtn').onclick=starter;$('printBtn').onclick=function(){window.print();};$('exportBtn').onclick=exportData;
});