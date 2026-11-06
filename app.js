import {englishCourse} from './src/content/english-course.js';
import {loadProgress,persistProgress,freshProgress} from './src/core/progress.js';
import {modules,decks,numbers,school,positions,grammar,extras} from './content.js';
import {shuffle,makePractice,makeExam,scoreAnswers,makePairs} from './engine.js';
import {icon,pitch,scene} from './art.js';

const app=document.querySelector('#app');
const storageKey='anglicka-liga-v1';
const fresh=freshProgress;
let progress=fresh(), storageOK=true;
try { progress=loadProgress(localStorage,storageKey); }catch{storageOK=false;}
let state={view:'home'},session=null,study=null,matching=null,toastTimer;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const moduleName=id=>modules.find(m=>m.id===id)?.name||'Bonusová slovíčka';
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4500);}
function save(){try{persistProgress(localStorage,storageKey,progress);return true;}catch{storageOK=false;toast('Prohlížeč neuložil pokrok. Hrát můžeš dál; po zavření se nemusí zachovat.');return false;}}
function speak(text){
  if(!progress.sound){toast('Výslovnost je vypnutá. Zapni ji tlačítkem ♫ nahoře.');return;}
  if(!('speechSynthesis' in window)){toast('Tento prohlížeč neumí výslovnost. Slovíčka můžeš dál číst a procvičovat.');return;}
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-GB';utterance.rate=.82;
  const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'));if(voice)utterance.voice=voice;
  utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('Výslovnost se nepodařila. Zkontroluj zvuk a anglický hlas v nastavení iPadu.');};
  speechSynthesis.speak(utterance);
}
function soundUI(){const b=document.querySelector('#sound-toggle');b.setAttribute('aria-pressed',String(progress.sound));b.setAttribute('aria-label',progress.sound?'Vypnout výslovnost':'Zapnout výslovnost');b.textContent=progress.sound?'♫':'♫̸';}
function navigate(view){state={view};render();app.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
function render(){
  app.innerHTML=state.view==='home'?home():state.view==='lesson'?lesson():state.view==='study'?studyView():state.view==='quiz'?quizView():state.view==='result'?resultView():state.view==='match'?matchView():'';
  soundUI();
}
function home(){
  const completed=modules.filter(m=>progress.completed.includes(m.id)).length;
  const best=progress.attempts.length?Math.max(...progress.attempts.map(a=>a.percent)):null;
  return `<section class="hero"><div class="hero-copy"><span class="eyebrow hero-eyebrow"><span class="live-dot"></span> NOVÁ SEZÓNA · TVOJE ANGLIČTINA</span><h1>Malý hráč.<br>Velká <span>angličtina.</span></h1><p>Každé slovíčko je přihrávka.<br>Trénuj, hraj a staň se šampionem!</p><button class="button button-lime" data-action="continue">Jdeme trénovat <span>→</span></button><div class="hero-note"><span>✦</span> Pro malé šampiony od 7 let</div></div><div class="hero-art">${pitch()}<div class="floating-label"><span class="tiny-ball">⚽</span><div>Tvůj další gól?<small>Nové anglické slovíčko.</small></div></div></div></section>
  <section class="season-stats" aria-label="Tvůj pokrok"><div><span class="stat-icon">⚑</span><span><strong>${completed}<small> / 4</small></strong><small>Dokončené tréninky</small></span></div><div><span class="stat-icon gold">★</span><span><strong>${progress.goals}</strong><small>Tréninkové góly</small></span></div><div><span class="stat-icon blue-ink">${icon('trophy')}</span><span><strong>${best===null?'—':`${best} %`}</strong><small>Nejlepší zápas</small></span></div><span class="stats-note">Vlastním tempem.<br><b>Bez časového limitu.</b></span></section>
  <section class="training-section"><div class="section-heading"><div><span class="eyebrow dark-eyebrow">01 / UČENÍ A PROCVIČOVÁNÍ</span><h2>Nejdřív trénink <span class="heading-star">✦</span></h2><p>Čtyři malé kroky k velkému zápasu.</p></div><span class="section-tag">TVŮJ TRÉNINKOVÝ PLÁN</span></div><div class="module-grid">${modules.map((m,i)=>`<button class="module-card ${m.color}" data-action="lesson" data-id="${m.id}"><div class="module-top"><span class="module-number">0${i+1}</span><span class="module-status">${progress.completed.includes(m.id)?'✓ Naučeno':'TRÉNINK'}</span></div><div class="module-art">${m.icon==='11'?'<span class="number-art">11<span>20</span></span>':icon(m.icon)}</div><h3>${m.name}</h3><p>${m.subtitle}</p><span class="module-bottom">${progress.completed.includes(m.id)?'Ještě si zahraju':'Jdu se učit'} <span>→</span></span></button>`).join('')}</div></section>
  <section class="match-banner"><div class="trophy-art">${icon('trophy')}<span>★</span></div><div class="match-copy"><span class="eyebrow dark-eyebrow">02 / OVĚŘENÍ ZNALOSTÍ</span><h2>Připravený na zápas?</h2><p>20 otázek. Čtyři dovednosti. Ukaž, co už umíš.</p><small>${completed===4?'Tréninky máš za sebou. Teď je tvůj čas!':'Nejdřív doporučujeme projít všechny čtyři tréninky.'}</small></div><button class="button button-dark" data-action="exam-intro">Jdu do zápasu <span>→</span></button></section>
  <section class="bonus-row"><span>✧</span><div><h3>Ještě jedna přihrávka?</h3><p>Barvy a další slovíčka z učebnice jako bonus.</p></div><button class="text-button" data-action="lesson" data-id="extras">Bonusový trénink →</button></section>
  <div class="coach-note"><span>☺</span><p>„Každý šampion byl jednou začátečník. Chyby jsou součást hry.“<small>TVŮJ ANGLICKÝ TRENÉR</small></p></div>`;
}
function back(action='home',id=''){return `<button class="back-button" data-action="${action}" data-id="${id}">← ${action==='home'?'Zpátky do klubu':'Zpátky na trénink'}</button>`;}
function lesson(){
  const id=state.id||'numbers', m=modules.find(x=>x.id===id)||{name:'Bonusová přihrávka',description:'Barvy a další slovíčka z nových stránek. Tato část se do zápasu nepočítá.',color:'peach',icon:'book'};
  const isWords=englishCourse.topic(id).kind==='vocabulary';
  return `<div class="inner-page">${back()}<div class="lesson-heading"><span class="lesson-symbol ${m.color}">${icon(m.icon)}</span><div><span class="eyebrow dark-eyebrow">TRÉNINKOVÉ HŘIŠTĚ</span><h1>${m.name}</h1><p>${m.description}</p></div></div><div class="lesson-layout"><section class="white-panel"><h2>Nejdřív se seznámíme</h2><p>Otoč si všechny kartičky. Anglická slovíčka si můžeš nechat přečíst.</p>${isWords?'<label class="field-label" for="direction">Směr přihrávek</label><select id="direction"><option value="both">Střídavě oba směry ↔</option><option value="cs-en">Čeština → angličtina</option><option value="en-cs">Angličtina → čeština</option></select>':''}<button class="button button-dark full-width" data-action="study" data-id="${id}">Prohlédnout kartičky <span>→</span></button><div class="mini-deck">${decks[id].slice(0,6).map(c=>`<span>${esc(c.en)}</span>`).join('')}<span>…</span></div></section><section class="white-panel practice-panel"><span class="eyebrow dark-eyebrow">TEĎ SI ZAHRAJ</span><h2>Přihrávky bez obav</h2><p>Po každé odpovědi zjistíš, jak na to. Za správnou přihrávku získáš gól.</p><button class="button button-lime full-width" data-action="practice" data-id="${id}">Vybrat správnou odpověď <span>→</span></button>${isWords?`<button class="button button-outline full-width" data-action="match" data-id="${id}">Přiřadit dvojice <span>⇄</span></button>`:''}<small>Žádné stopky. Když se spleteš, zkusíme to znovu.</small></section></div>${id==='sentences'?'<aside class="grammar-note"><b>Malá trenérská rada</b><p>There’s = There is. Isn’t = is not. Aren’t = are not.<br>U záporu vybíráme podle jednotného nebo množného čísla: a pencil → isn’t; any pencils → aren’t.</p></aside>':''}</div>`;
}
function startStudy(id){
  const direction=document.querySelector('#direction')?.value||'both';
  study={id,index:0,revealed:false,direction};navigate('study');
}
function studyView(){
  const deck=decks[study.id], c=deck[study.index]; const toEnglish=study.direction==='cs-en'||(study.direction==='both'&&study.index%2===0);
  const isScene=study.id==='positions'||study.id==='sentences';
  let visual='';
  if(study.id==='positions')visual=scene({type:'position',position:c.id});
  else if(study.id==='sentences')visual=c.kind==='count'?scene({type:'count',count:11,item:'pencil'}):c.kind==='where'?scene({type:'position',position:'under'}):scene(c.kind==='is-question'?{type:'ruler'}:c.kind==='are-question'?{type:'two-books'}:{type:'grammar',kind:c.kind});
  else visual=c.number?`<div class="study-number">${c.number}</div>`:`<div class="study-art">${icon(c.icon)}</div>`;
  return `<div class="game-page">${back('lesson',study.id)}<div class="game-heading"><span class="eyebrow dark-eyebrow">KARTIČKY · ${moduleName(study.id)}</span><span>${study.index+1} / ${deck.length}</span></div><div class="progress-track"><span style="width:${100*(study.index+1)/deck.length}%"></span></div><section class="study-panel white-panel">${visual}<span class="eyebrow dark-eyebrow">${isScene?'PROHLÉDNI SI OBRÁZEK':toEnglish?'JAK SE ŘEKNE ANGLICKY?':'CO TO ZNAMENÁ ČESKY?'}</span><h1 class="card-word">${esc(isScene?c.en:toEnglish?c.cs:c.en)}</h1>${study.revealed?`<div class="card-reveal"><h2>${esc(isScene?c.cs:toEnglish?c.en:c.cs)}</h2>${isScene?`<p>${esc(c.sentence)}</p><p>${esc(c.translation)}</p>`:''}${c.note?`<p class="learning-note">${esc(c.note)}</p>`:''}<button class="listen-button" data-action="speak-card">♫ Poslechnout anglicky</button></div>`:`<button class="button button-outline" data-action="reveal">Otočit kartičku <span>↻</span></button>`}</section><div class="game-controls"><button class="text-button" data-action="previous-card" ${study.index===0?'disabled':''}>← Předchozí</button><button class="button button-dark" data-action="next-card" ${study.revealed?'':'disabled'}>${study.index===deck.length-1?'Dokončit trénink ✓':'Další kartička →'}</button></div></div>`;
}
function startQuiz(category,exam=false,questions=null){
  const dir=document.querySelector('#direction')?.value||'both';
  let qs=questions|| (exam?makeExam():makePractice(category,dir).slice(0,10));
  session={exam,category,questions:qs,index:0,answers:[],selected:null,submitted:false};navigate('quiz');
}
function quizView(){
  const q=session.questions[session.index],chosen=session.selected;const feedback=session.submitted&&!session.exam; const correct=chosen===q.answer;
  return `<div class="game-page">${back()}<div class="game-heading"><span class="eyebrow dark-eyebrow">${session.exam?'⚑ ZÁPAS O POHÁR':`⚽ TRÉNINK · ${moduleName(session.category)}`}</span><span>Otázka ${session.index+1} / ${session.questions.length}</span></div><div class="progress-track"><span style="width:${100*session.index/session.questions.length}%"></span></div><section class="question-panel white-panel"><p class="question-task">${esc(q.task)}</p>${q.scene?scene(q.scene):''}<h1 class="question-prompt">${esc(q.prompt)}</h1>${q.speak?`<button class="listen-button" data-action="speak-question">♫ Přečíst zadání</button>`:''}<div class="answer-grid">${q.options.map((o,i)=>`<button class="answer ${chosen===o?'selected':''} ${feedback&&o===q.answer?'correct':''} ${feedback&&chosen===o&&!correct?'incorrect':''}" data-action="answer" data-index="${i}" aria-pressed="${chosen===o}" ${session.submitted?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${esc(o)}</span>${feedback&&o===q.answer?'<span class="answer-mark">✓</span>':''}</button>`).join('')}</div>${feedback?`<div class="feedback ${correct?'success':'try-again'}" role="status"><strong>${correct?'Góóól! Skvělá přihrávka.':'Tohle spolu natrénujeme.'}</strong><p>${esc(q.explanation)}</p></div>`:''}</section><div class="game-controls"><span class="quiet-note">${session.exam?'Řešení uvidíš po celém zápase.':'Chyba nevadí. Tady se učíme.'}</span><div class="control-buttons">${!session.submitted?'<button class="text-button" data-action="skip">Zatím nevím</button>':''}<button class="button button-dark" data-action="submit-answer" ${!session.submitted&&chosen===null?'disabled':''}>${session.submitted?(session.index===session.questions.length-1?'Zobrazit výsledek →':'Další přihrávka →'):session.exam?'Potvrdit odpověď →':'Zkontrolovat ✓'}</button></div></div></div>`;
}
function submitAnswer(skip=false){
  if(session.submitted){nextQuestion();return;}
  if(!skip&&session.selected===null)return;
  if(skip)session.selected='';
  session.answers[session.index]=session.selected;session.submitted=true;
  if(session.exam){nextQuestion();return;}
  if(session.selected===session.questions[session.index].answer){progress.goals++;save();}
  render();
  document.querySelector('.feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function nextQuestion(){
  if(session.index+1===session.questions.length){
    session.result=scoreAnswers(session.questions,session.answers);
    if(session.exam){progress.attempts.push({...session.result,date:new Date().toISOString()});progress.attempts=progress.attempts.slice(-10);save();}
    navigate('result');return;
  }
  session.index++;session.selected=null;session.submitted=false;render();app.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
function resultView(){
  const r=session.result,missed=session.questions.filter((q,i)=>q.answer!==session.answers[i]);
  return `<div class="result-page">${back()}<section class="result-hero"><span class="result-cup">${r.percent>=80?'🏆':'⚽'}</span><span class="eyebrow dark-eyebrow">${session.exam?'ZÁPAS JE ZA TEBOU':'TRÉNINK DOKONČEN'}</span><h1>${r.percent===100?'Výkon šampiona!':r.percent>=80?'To byla parádní hra!':'Každý trénink tě posouvá.'}</h1><p>${session.exam?'Tady vidíš, co už umíš a co spolu ještě procvičíme.':'Dobrá práce! Za každou správnou odpověď máš tréninkový gól.'}</p><div class="result-score"><strong>${r.correct}<span> / ${r.total}</span></strong><span>správných odpovědí · ${r.percent} %</span></div></section><div class="result-categories">${Object.entries(r.categories).map(([id,v])=>`<div class="white-panel"><h3>${moduleName(id)}</h3><strong>${v.correct} / ${v.total}</strong><div class="progress-track"><span style="width:${100*v.correct/v.total}%"></span></div><small>${v.correct===v.total?'Skvěle zvládnuto ✓':'Ještě trochu potrénujeme'}</small></div>`).join('')}</div>${missed.length?`<section class="white-panel review-panel"><h2>Další tréninkové přihrávky</h2><p>Tohle nejsou prohry. Tohle je tvůj plán na příště.</p>${session.questions.map((q,i)=>q.answer===session.answers[i]?'':`<details><summary>${esc(q.prompt)}</summary>${q.scene?scene(q.scene):''}<p>Tvoje odpověď: <b>${esc(session.answers[i]||'Zatím nevím')}</b></p><p>Správně: <strong>${esc(q.answer)}</strong></p><p>${esc(q.explanation)}</p></details>`).join('')}<button class="button button-dark" data-action="retry-missed">Procvičit moje chyby →</button></section>`:''}<div class="result-actions"><button class="button button-outline" data-action="home">Zpátky do klubu</button><button class="button button-dark" data-action="${session.exam?'exam-intro':'practice'}" data-id="${session.category}">${session.exam?'Nový zápas →':'Ještě jeden trénink →'}</button></div></div>`;
}
function startMatch(id){
  const pairs=makePairs(decks[id]);matching={id,pairs,right:shuffle(pairs),left:null,selectedRight:null,matched:[],wrong:false,tries:0};navigate('match');
}
function matchView(){const m=matching,done=m.matched.length===m.pairs.length;
 return `<div class="game-page">${back('lesson',m.id)}<div class="game-heading"><span class="eyebrow dark-eyebrow">PŘIHRÁVKY VE DVOJICÍCH</span><span>${m.matched.length} / ${m.pairs.length} dvojic</span></div><section class="white-panel match-panel"><h1>${done?'Tým je kompletní!':'Najdi spoluhráče'}</h1><p>${done?'Skvěle! Všechna slovíčka mají svou dvojici.':'Klepni na české a pak na anglické slovíčko. Nebo naopak.'}</p><div class="pair-columns"><div><span class="eyebrow dark-eyebrow">ČESKY</span>${m.pairs.map(p=>`<button class="pair ${m.matched.includes(p.id)?'matched':''} ${m.left===p.id?'selected':''} ${m.wrong&&m.left===p.id?'incorrect':''}" data-action="pair-left" data-id="${p.id}" ${m.matched.includes(p.id)?'disabled':''} aria-pressed="${m.left===p.id}">${esc(p.cs)} ${m.matched.includes(p.id)?'✓':''}</button>`).join('')}</div><div><span class="eyebrow dark-eyebrow">ENGLISH</span>${m.right.map(p=>`<button class="pair ${m.matched.includes(p.id)?'matched':''} ${m.selectedRight===p.id?'selected':''} ${m.wrong&&m.selectedRight===p.id?'incorrect':''}" data-action="pair-right" data-id="${p.id}" ${m.matched.includes(p.id)?'disabled':''} aria-pressed="${m.selectedRight===p.id}">${esc(p.en)} ${m.matched.includes(p.id)?'✓':''}</button>`).join('')}</div></div><p class="pair-feedback" role="status">${done?'Čtyři povedené přihrávky. Čtyři góly!':m.wrong?'Tyhle kartičky k sobě nepatří. Vyber jinou dvojici.':m.matched.length?'Správná dvojice! Najdi další.':'Hledej slova se stejným významem.'}</p></section>${done?`<div class="result-actions"><button class="button button-outline" data-action="lesson" data-id="${m.id}">Zpátky na trénink</button><button class="button button-dark" data-action="match" data-id="${m.id}">Nové dvojice →</button></div>`:''}</div>`;
}
function choosePair(side,id){
  const m=matching;if(m.matched.includes(id))return;
  if(m.wrong){m.left=null;m.selectedRight=null;m.wrong=false;}
  m[side==='left'?'left':'selectedRight']=id;
  if(m.left&&m.selectedRight){m.tries++;if(m.left===m.selectedRight){m.matched.push(id);m.left=null;m.selectedRight=null;progress.goals++;save();}else m.wrong=true;}
  render();
}
function examIntro(){
  state={view:'exam-intro'};
  app.innerHTML=`<div class="game-page">${back()}<section class="white-panel exam-intro"><span class="result-cup">⚑</span><span class="eyebrow dark-eyebrow">TVŮJ VELKÝ ZÁPAS</span><h1>Ukaž, co už umíš.</h1><p>Čeká tě 20 otázek: pět z každé dovednosti.</p><div class="exam-list">${modules.map(m=>`<span>${icon(m.icon)} ${m.name}</span>`).join('')}</div><ul class="exam-rules"><li>Žádné stopky. Dej si tolik času, kolik potřebuješ.</li><li>Správné odpovědi a vysvětlení uvidíš až na konci.</li><li>Když nevíš, zvol „Zatím nevím“. To je taky v pořádku.</li></ul><button class="button button-dark" data-action="start-exam">Výkop! Začít zápas <span>→</span></button></section></div>`;
  app.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
function parentContent(){
 return `<p>Hlavní učivo: čísla 11–20, školní potřeby, in/on/under/next to a there is/isn’t/are/aren’t. Nové stránky doplňují How many…?, Where’s…?, Is there…? a opravování chybných vět.</p><p>Bonus: barvy, computer, television, whiteboard, wall, poster a tree. Bonus se do zápasu nepočítá.</p><h3>Jak číst výsledky</h3><p>Zápas má 20 otázek, po pěti ze čtyř oblastí. Výběr se mění; jeden zápas nepokrývá každé slovíčko. K ověření celého učiva pomůže více zápasů. Dokončený trénink znamená prohlédnutí všech kartiček, nikoli ověřené zvládnutí.</p><p>Pokrok zůstává v tomto prohlížeči na tomto zařízení. ${storageOK?'Nesynchronizuje se a nic se neposílá na server.':'Ukládání nyní není dostupné.'} Výslovnost zajišťuje anglický hlas zařízení, nejde o nahrávky z učebnice; dostupnost bez internetu závisí na zařízení.</p><h3>Poslední zápasy</h3>${progress.attempts.length?`<ul class="attempt-list">${progress.attempts.slice().reverse().map(a=>`<li><span>${new Intl.DateTimeFormat('cs-CZ',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Prague'}).format(new Date(a.date))}</span><b>${a.correct} / ${a.total} · ${a.percent} %</b></li>`).join('')}</ul>`:'<p>Zatím žádný dokončený zápas.</p>'}<h3>Na iPadu</h3><p>Otevřete web v Safari. V nabídce Sdílet zvolte Přidat na plochu. Po prvním úplném načtení je hra dostupná i bez internetu, pokud prohlížeč uchová její data. Výslovnost může vyžadovat stažený anglický hlas.</p><button class="button button-outline" id="reset-progress">Smazat pokrok na tomto zařízení</button><p id="reset-note" class="quiet-note"></p>`;
}
function parentOpen(){document.querySelector('#parent-content').innerHTML=parentContent();document.querySelector('#parent-dialog').showModal();let confirmReset=false;document.querySelector('#reset-progress').onclick=()=>{if(!confirmReset){confirmReset=true;document.querySelector('#reset-note').textContent='Smažou se výsledky, góly a dokončené tréninky. Pro potvrzení klepněte na tlačítko ještě jednou.';return;}progress=fresh();const persisted=save();document.querySelector('#parent-dialog').close();navigate('home');if(persisted)toast('Pokrok byl smazán. Začíná nová sezóna.');};}
app.addEventListener('click',e=>{
 const button=e.target.closest('[data-action]');if(!button||button.disabled)return;
 const a=button.dataset.action,id=button.dataset.id;
 if(a==='home') {if(session&&state.view==='quiz'){state.view='leave';app.innerHTML=`<div class="game-page"><section class="white-panel exam-intro"><h1>Vrátit se do klubu?</h1><p>Rozpracované otázky se neuloží. Získané tréninkové góly ti zůstanou.</p><div class="result-actions"><button class="button button-outline" data-action="resume">Pokračovat ve hře</button><button class="button button-dark" data-action="leave-confirm">Vrátit se do klubu</button></div></section></div>`;}else navigate('home');}
 else if(a==='resume')navigate('quiz');
 else if(a==='leave-confirm'){session=null;navigate('home');}
 else if(a==='continue'){state={view:'lesson',id:modules.find(m=>!progress.completed.includes(m.id))?.id||'numbers'};render();app.focus();}
 else if(a==='lesson'){state={view:'lesson',id};render();window.scrollTo(0,0);app.focus({preventScroll:true});}
 else if(a==='study')startStudy(id);
 else if(a==='reveal'){study.revealed=true;render();}
 else if(a==='previous-card'){study.index--;study.revealed=false;render();}
 else if(a==='next-card'){
   if(study.index===decks[study.id].length-1){if(!progress.completed.includes(study.id))progress.completed.push(study.id);const persisted=save();const sid=study.id;state={view:'lesson',id:sid};render();if(persisted)toast('Trénink kartiček je hotový. Teď si zkus přihrávky!');window.scrollTo(0,0);}
   else{study.index++;study.revealed=false;render();}
 }
 else if(a==='speak-card'){const c=decks[study.id][study.index];speak(c.sentence||c.en);}
 else if(a==='speak-question')speak(session.questions[session.index].speak);
 else if(a==='practice')startQuiz(id);
 else if(a==='exam-intro')examIntro();
 else if(a==='start-exam')startQuiz('all',true);
 else if(a==='answer'){if(!session.submitted){session.selected=session.questions[session.index].options[Number(button.dataset.index)];render();}}
 else if(a==='submit-answer')submitAnswer();
 else if(a==='skip')submitAnswer(true);
 else if(a==='retry-missed'){const missed=session.questions.filter((q,i)=>q.answer!==session.answers[i]);startQuiz(session.category,false,shuffle(missed));}
 else if(a==='match')startMatch(id);
 else if(a==='pair-left')choosePair('left',id);
 else if(a==='pair-right')choosePair('right',id);
});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();if(state.view==='quiz'){app.querySelector('[data-action="home"]')?.click();}else navigate('home');});
document.querySelector('#sound-toggle').onclick=()=>{progress.sound=!progress.sound;if('speechSynthesis' in window)speechSynthesis.cancel();save();soundUI();};
document.querySelector('#parent-open').onclick=parentOpen;
document.querySelector('#parent-close').onclick=()=>document.querySelector('#parent-dialog').close();
if('speechSynthesis' in window)speechSynthesis.getVoices();
render();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>toast('Offline uložení není dostupné. S připojením můžeš hrát dál.'));
