import {testModule,categoryNames,learningCards,makeLearningRound,makeTest} from './src/content/test-2026-11-09.js';
import {createSession,submitResponse,advanceSession,previousActivity} from './src/core/session.js';
import {freshProgress,loadProgress,persistProgress} from './src/core/progress.js';
import {scoreAnswers,shuffle} from './engine.js';
import {icon,pitch,scene} from './art.js';

const app=document.querySelector('#app'),storageKey='anglicka-liga-v1';
let progress=freshProgress(),storageOK=true,view='home',session=null,toastTimer,confirmReset=false,reviewIndex=0;
try{progress=loadProgress(localStorage,storageKey);}catch{storageOK=false;}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attempts=()=>progress.attempts.filter(a=>a.moduleId===testModule.id);
const current=()=>session.items[session.index];
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,5000);}
function save(){try{persistProgress(localStorage,storageKey,progress);return true;}catch{storageOK=false;toast('Pokrok se nepodařilo uložit. Hrát můžeš dál.');return false;}}
function speak(text){
 if(!progress.sound){toast('Výslovnost zapneš tlačítkem ♫ nahoře.');return;}
 if(!('speechSynthesis' in window)){toast('Výslovnost není v tomto prohlížeči dostupná. Můžeš hrát dál.');return;}
 speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(text);speech.lang='en-GB';speech.rate=.82;
 const voice=speechSynthesis.getVoices().find(v=>v.lang==='en-GB')||speechSynthesis.getVoices().find(v=>v.lang.startsWith('en'));if(voice)speech.voice=voice;
 speech.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('Zkontroluj hlasitost a anglický hlas v nastavení zařízení.');};speechSynthesis.speak(speech);
}
function soundUI(){const b=document.querySelector('#sound-toggle');b.textContent=progress.sound?'♫':'♫̸';b.setAttribute('aria-pressed',String(progress.sound));b.setAttribute('aria-label',progress.sound?'Vypnout výslovnost':'Zapnout výslovnost');}
function go(next){view=next;render();app.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
function render(){app.dataset.view=view;app.innerHTML=view==='home'?home():view==='play'?play():view==='result'?result():leave();soundUI();}
function home(){
 const best=attempts().length?Math.max(...attempts().map(a=>a.percent)):null;
 return `<section class="simple-hero"><div><span class="eyebrow">⚽ ANGLICKÁ LIGA</span><h1>Na test <br>s úsměvem<span>.</span></h1><p>Trocha hraní. Spousta angličtiny. <br>Každá přihrávka tě posune dál.</p></div><div class="simple-pitch">${pitch()}</div></section>
 <section class="single-module" data-module="${testModule.id}"><div class="module-intro"><span class="date-badge">TEST · ${testModule.dateLabel}</span><h2>Angličtina</h2><p class="module-subtitle">Příprava na test 9. 11. 2026</p><p>Čísla 11–20, školní potřeby, barvy, předložky a věty.<br>Všechno učivo najdeš tady, pohromadě.</p></div><div class="main-actions"><button class="start-card learn-start" data-action="learn"><span class="start-emoji">🃏</span><span><strong>Učit se hrou</strong><small>Otáčej, spojuj a skládej.</small></span><span class="start-arrow">→</span></button><button class="start-card test-start" data-action="test"><span class="start-emoji">⚽</span><span><strong>Vyzkoušet se</strong><small>20 otázek. Řešení hned po odpovědi.</small></span><span class="start-arrow">→</span></button></div><div class="small-progress"><span>★ ${progress.goals} gólů</span><span>✓ ${progress.rounds} herních kol</span><span>⚑ Nejlepší test: ${best===null?'zatím žádný':best+' %'}</span></div></section><p class="home-note">Bez stopek. Bez obav z chyb. Vlastním tempem.</p>`;
}
function back(){return '<button class="back-button" data-action="home">← Zpátky</button>';}
function cardVisual(c){
 if(c.category==='positions')return scene({type:'position',position:c.id});
 if(c.category==='sentences'){
  if(c.kind==='count')return scene({type:'count',count:11,item:'pencil'});
  if(c.kind==='where')return scene({type:'position',position:'under'});
  return scene(c.kind==='is-question'?{type:'ruler'}:c.kind==='are-question'?{type:'two-books'}:{type:'grammar',kind:c.kind});
 }
 return c.number?`<div class="study-number">${c.number}</div>`:`<div class="study-art">${icon(c.icon)}</div>`;
}
function flipView(item){
 const c=item.card,toEnglish=item.toEnglish;
 return `<p class="activity-label">🃏 Otoč kartičku</p><p class="question-task">${toEnglish?'Jak se to řekne anglicky?':'Co to znamená česky?'}</p><div class="flip-layout"><div class="card-illustration">${cardVisual(c)}</div><button class="flip-card ${session.revealed?'flipped':''}" data-action="flip" aria-label="${session.revealed?'Zobrazit zadání':'Otočit kartičku a ukázat řešení'}"><span class="card-language">${session.revealed?(toEnglish?'ANGLICKY':'ČESKY'):(toEnglish?'ČESKY':'ANGLICKY')}</span><strong>${esc(session.revealed?(toEnglish?(c.sentence||c.en):(c.translation||c.cs)):(toEnglish?(c.translation||c.cs):(c.sentence||c.en)))}</strong><small>${session.revealed?'✓ Už znáš druhou stranu.':'Klepni a otoč ↻'}</small></button></div>${session.revealed?`<div class="learning-tip">${esc(c.note||`${c.en} = ${c.cs}`)}</div><button class="listen-button" data-action="speak">♫ Poslechnout anglicky</button>`:''}`;
}
function matchView(item){
 const column=(items,side)=>items.map(c=>`<button class="pair ${session.matched.includes(c.id)?'matched':''} ${session[side]===c.id?'selected':''}" data-action="pair" data-side="${side}" data-id="${esc(c.id)}" ${session.matched.includes(c.id)||session.feedback?'disabled':''} aria-pressed="${session[side]===c.id}">${esc(side==='left'?c.cs:c.en)}${session.matched.includes(c.id)?' ✓':''}</button>`).join('');
 return `<p class="activity-label">🤝 Spoj spoluhráče</p><h1 class="question-prompt">Co patří k sobě?</h1><p class="question-task">Klepni na české a anglické slovíčko. Můžeš začít na kterékoliv straně.</p><div class="pair-columns"><div><span class="eyebrow">ČESKY</span>${column(item.pairs,'left')}</div><div><span class="eyebrow">ENGLISH</span>${column(item.right,'right')}</div></div><p class="pair-feedback" role="status">${session.pairError?`Tahle dvojice nesedí. ${esc(session.pairError)} Zkus to znovu.`:session.matched.length?`Povedená přihrávka! Spojeno ${session.matched.length} ze 4.`:'Najdi čtyři dvojice se stejným významem.'}</p>`;
}
function questionView(q){
 const f=session.feedback;
 const input=q.type==='order'?`<div class="sentence-builder" aria-label="Skládaná odpověď">${session.selectedTokens.length?session.selectedTokens.map(i=>`<span>${esc(q.tokens[i])}</span>`).join(''):'Tady bude tvoje odpověď…'}</div><div class="word-bank">${q.tokens.map((token,i)=>`<button class="word-token" data-action="token" data-index="${i}" ${f||session.selectedTokens.includes(i)?'disabled':''}>${esc(token)}</button>`).join('')}</div>${!f?'<button class="text-button" data-action="undo">↶ Vrátit poslední slovo</button>':''}`:
 `<div class="answer-grid">${q.options.map((answer,i)=>`<button class="answer ${f&&answer===q.answer?'correct':''} ${f&&answer===session.answers[session.index]&&!f.correct?'incorrect':''}" data-action="answer" data-index="${i}" ${f?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${esc(answer)}</span>${f&&answer===q.answer?'<span class="answer-mark">✓</span>':''}</button>`).join('')}</div>`;
 return `<p class="activity-label">${q.type==='order'?'🧩 Poskládej odpověď':q.scene?.type==='count'?'🔢 Spočítej obrázky':q.scene?.type==='position'?'🔎 Najdi správné místo':q.prompt.includes('___')?'✏ Doplň větu':q.options?.length===2?'✓ Ano, nebo ne?':'⚽ Vyber správnou přihrávku'}</p><div class="question-layout ${q.scene?'with-picture':''}">${q.scene?`<div class="question-picture">${scene(q.scene)}</div>`:''}<div class="question-body"><p class="question-task">${esc(q.task)}</p><h1 class="question-prompt">${esc(q.prompt)}</h1>${q.speak?'<button class="listen-button" data-action="speak">♫ Přečíst zadání</button>':''}${input}</div></div>`;
}
function feedbackView(){
 const f=session.feedback;if(!f)return '';
 return `<div class="feedback ${f.correct?'success':'try-again'}" role="status" tabindex="-1"><strong>${f.correct?'Gól! To je správně.':'Tohle spolu natrénujeme.'}</strong><p class="correct-answer">Správná odpověď: <b>${esc(f.answer)}</b></p>${!f.correct?`<p>Tvoje odpověď: ${esc(f.selectedTranslation||session.answers[session.index]||'Zatím nevím')}</p>`:''}<p>${esc(f.explanation)}</p></div>`;
}
function play(){
 const item=current(),canNext=session.feedback||(item.type==='flip'&&session.revealed),learning=session.kind==='learn';
 return `<div class="game-page">${back()}<div class="game-heading"><span class="eyebrow">${learning?(session.cardsOnly?'KARTIČKY':'UČENÍ HROU'):session.kind==='retry'?'PROCVIČENÍ CHYB':'ZKOUŠENÍ'} · ANGLIČTINA</span>${learning?`<button class="mode-button" data-action="${session.cardsOnly?'learn':'cards'}">${session.cardsOnly?'Střídat hry':'Jen kartičky ↔'}</button>`:''}<span>${session.index+1} / ${session.items.length}</span></div><div class="progress-track"><span style="width:${100*session.index/session.items.length}%"></span></div><section class="white-panel activity-panel ${item.type==='flip'?'flip-panel':item.type==='match'?'matching-panel':'question-panel-compact'} ${session.feedback?'has-feedback':''}">${item.type==='flip'?flipView(item):item.type==='match'?matchView(item):questionView(item)}${feedbackView()}</section><div class="game-controls">${learning?`<button class="button button-outline arrow-control" data-action="previous" aria-label="Předchozí úloha" ${session.index===0?'disabled':''}>← Zpět</button>`:''}<span class="quiet-note">${learning?'← zpět · mezerník otočit · → dál':'Test 9. 11. 2026 · Žádný spěch.'}</span>${canNext?`<button class="button button-dark arrow-control" data-action="next">${session.index===session.items.length-1?'Dokončit':'Další'} →</button>`:item.type==='flip'?'<button class="button button-dark arrow-control" data-action="card-forward">Otočit →</button>':item.type!=='match'?'<button class="text-button" data-action="skip">Zatím nevím</button>':''}</div></div>`;
}
function start(kind,items=null,cardsOnly=false){
 const list=items||(kind==='learn'?makeLearningRound(progress.learnCursor):makeTest());let flipIndex=0;
 list.forEach(item=>{if(item.type==='match')item.right=shuffle(item.pairs);if(item.type==='flip'){const cursor=progress.learnCursor+flipIndex++;item.toEnglish=(cursor+Math.floor(cursor/learningCards.length))%2===0;}});
 session=createSession(kind,list);session.cardsOnly=cardsOnly;reviewIndex=0;go('play');
}
function startCards(){start('learn',Array.from({length:learningCards.length},(_,i)=>({type:'flip',card:learningCards[(progress.learnCursor+i)%learningCards.length]})),true);}
function previous(){if(previousActivity(session))go('play');}

function answer(value){
 if(!submitResponse(session,value))return;
 if(session.feedback.correct){progress.goals++;save();}
 render();const el=app.querySelector('.feedback');el?.focus({preventScroll:true});
}
function next(){
 if(current().type==='flip'&&session.revealed&&!session.seenFlips.includes(session.index)){session.seenFlips.push(session.index);progress.learnCursor++;save();}
 if(!advanceSession(session))return;
 if(session.index===session.items.length){
  if(session.kind==='learn'){progress.rounds++;save();}
  else{session.result=scoreAnswers(session.items,session.answers);if(session.kind==='test'){progress.attempts.push({...session.result,moduleId:testModule.id,date:new Date().toISOString()});progress.attempts=progress.attempts.slice(-10);save();}}
  go('result');
 }else go('play');
}
function pair(side,id){
 if(session.feedback||session.matched.includes(id))return;
 if(session.pairError){session.left=null;session.right=null;session.pairError=false;}
 session[side]=id;
 if(session.left&&session.right){
  if(session.left===session.right){session.matched.push(id);session.left=null;session.right=null;progress.goals++;save();
   if(session.matched.length===4)session.feedback={correct:true,answer:'4 správné dvojice',explanation:'Parádní spolupráce! Každé slovíčko našlo svůj český význam.'};
  }else{const c=current().pairs.find(p=>p.id===session.left);session.pairError=`${c.en} znamená ${c.cs}.`;}
 }
 render();
}
function result(){
 if(session.kind==='learn')return `<div class="result-page">${back()}<section class="result-hero"><span class="result-cup">🏆</span><span class="eyebrow">UČENÍ HROU</span><h1>Parádní trénink!</h1><p>Dnes ses zase naučil něco nového.<br>Můžeš pokračovat hraním nebo zkusit test.</p><div class="result-actions"><button class="button button-lime" data-action="learn">Ještě si hrát →</button><button class="button button-dark" data-action="test">Vyzkoušet se →</button></div></section></div>`;
 const r=session.result,missed=session.items.filter((q,i)=>q.answer!==session.answers[i]);
 return `<div class="result-page">${back()}<section class="result-hero"><span class="result-cup">${r.percent>=80?'🏆':'⚽'}</span><span class="eyebrow">ANGLIČTINA · TEST 9. 11. 2026</span><h1>${r.percent===100?'Výkon šampiona!':r.percent>=80?'Skvělá hra!':'Každým pokusem se učíš.'}</h1><div class="result-score"><strong>${r.correct}<span> / ${r.total}</span></strong><span>správných odpovědí · ${r.percent} %</span></div><p>Každou odpověď jsme si společně vysvětlili.</p></section>${missed.length?`<section class="white-panel review-panel"><div class="review-heading"><h2>Ještě potrénujeme</h2><span data-review-count="${missed.length}">${reviewIndex+1} / ${missed.length}</span></div><p class="review-prompt">${esc(missed[reviewIndex].prompt)}</p><p>Správně: <strong>${esc(missed[reviewIndex].answer)}</strong></p><p>${esc(missed[reviewIndex].explanation)}</p>${missed[reviewIndex].optionTranslations?.[session.answers[session.items.indexOf(missed[reviewIndex])]]?`<p>Tvoje odpověď: ${esc(missed[reviewIndex].optionTranslations[session.answers[session.items.indexOf(missed[reviewIndex])]])}</p>`:''}<div class="review-controls"><button class="button button-outline" data-action="review-prev" aria-label="Předchozí chyba" ${reviewIndex===0?'disabled':''}>←</button><button class="button button-dark" data-action="retry">Procvičit chyby</button><button class="button button-outline" data-action="review-next" aria-label="Další chyba" ${reviewIndex===missed.length-1?'disabled':''}>→</button></div></section>`:'<p class="home-note">Všechny přihrávky byly správně. Výborně!</p>'}<div class="result-actions"><button class="button button-outline" data-action="home">Zpátky na začátek</button><button class="button button-dark" data-action="learn">Učit se hrou →</button></div></div>`;
}
function leave(){return '<div class="game-page"><section class="white-panel leave-panel"><h1>Vrátit se na začátek?</h1><p>Rozpracovaný test se neuloží. Získané góly a prohlédnuté kartičky ti zůstanou.</p><div class="result-actions"><button class="button button-outline" data-action="resume">Pokračovat</button><button class="button button-dark" data-action="leave">Vrátit se</button></div></section></div>';}
let parentTab='content';
function renderParent(){
 const tabs=[['content','Učivo'],['results','Výsledky'],['settings','Nastavení']];
 const content=parentTab==='content'?`<h3>${testModule.title}</h3><p>Čísla 11–20, škola, barvy, předložky a věty. Všechno dosavadní učivo je v jednom modulu.</p><p>Učení střídá 12 aktivit nebo umožňuje listovat 52 kartičkami. Šipky ←/→ slouží k návratu a pokračování; mezerník otočí kartičku. Prohlédnutí není ověřením znalostí.</p><p>Zkoušení má 20 otázek s okamžitou zpětnou vazbou a uzamčením první odpovědi. Jeden test neobsáhne každé slovíčko.</p>`:parentTab==='results'?`<h3>Výsledky aktuálního modulu</h3>${attempts().length?`<ul class="attempt-list">${attempts().slice().reverse().map(a=>`<li>${new Intl.DateTimeFormat('cs-CZ',{dateStyle:'short',timeStyle:'short',timeZone:'Europe/Prague'}).format(new Date(a.date))}<b>${a.correct}/${a.total} · ${a.percent} %</b></li>`).join('')}</ul>`:'<p>Zatím žádný dokončený test.</p>'}`:`<h3>Ukládání a zvuk</h3><p>Pokrok zůstává na tomto zařízení. ${storageOK?'Ukládání je dostupné.':'Ukládání není dostupné.'} Starší výsledky se nepočítají do nejlepšího skóre tohoto modulu.</p><p>Výslovnost používá hlas zařízení, nejde o audio z učebnice.</p><button class="button button-outline" id="reset-progress">Smazat pokrok</button><p id="reset-note"></p>`;
 document.querySelector('#parent-content').innerHTML=`<nav class="parent-tabs" aria-label="Rodičovský přehled">${tabs.map(([id,label])=>`<button data-parent-tab="${id}" aria-pressed="${parentTab===id}">${label}</button>`).join('')}</nav>${content}`;
 document.querySelectorAll('[data-parent-tab]').forEach(b=>b.onclick=()=>{parentTab=b.dataset.parentTab;confirmReset=false;renderParent();});
 const reset=document.querySelector('#reset-progress');if(reset)reset.onclick=()=>{if(!confirmReset){confirmReset=true;document.querySelector('#reset-note').textContent='Smažou se uložené výsledky a pokrok. Potvrď dalším klepnutím.';return;}progress=freshProgress();const ok=save();document.querySelector('#parent-dialog').close();go('home');if(ok)toast('Začínáme znovu.');};
}
function openParent(){confirmReset=false;parentTab='content';renderParent();document.querySelector('#parent-dialog').showModal();}
app.addEventListener('click',event=>{
 const b=event.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action;
 if(a==='learn')start('learn');
 else if(a==='cards')startCards();
 else if(a==='previous')previous();
 else if(a==='card-forward'){session.revealed=true;render();}
 else if(a==='review-prev'){reviewIndex--;render();}
 else if(a==='review-next'){reviewIndex++;render();}
 else if(a==='test')start('test');
 else if(a==='home'){go(view==='play'?'leave':'home');}
 else if(a==='leave'){session=null;go('home');}
 else if(a==='resume')go('play');
 else if(a==='flip'){session.revealed=!session.revealed;render();}
 else if(a==='next')next();
 else if(a==='answer')answer(current().options[Number(b.dataset.index)]);
 else if(a==='skip')answer('');
 else if(a==='token'){
  if(session.feedback)return;const i=Number(b.dataset.index);if(session.selectedTokens.includes(i))return;session.selectedTokens.push(i);
  if(session.selectedTokens.length===current().tokens.length)answer(session.selectedTokens.map(j=>current().tokens[j]).join(' '));else render();
 }
 else if(a==='undo'){session.selectedTokens.pop();render();}
 else if(a==='pair')pair(b.dataset.side,b.dataset.id);
 else if(a==='retry')start('retry',session.items.filter((q,i)=>q.answer!==session.answers[i]));
 else if(a==='speak'){const item=current();speak(item.type==='flip'?(item.card.sentence||item.card.en):item.speak);}
});
document.addEventListener('keydown',event=>{
 if(event.repeat||event.altKey||event.ctrlKey||event.metaKey||document.querySelector('#parent-dialog').open||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 if(view==='play'){
  if(event.key==='ArrowLeft'&&session.kind==='learn'){event.preventDefault();previous();}
  else if(event.key==='ArrowRight'){
   const item=current();event.preventDefault();
   if(item.type==='flip'&&!session.revealed){session.revealed=true;render();}
   else if(session.feedback||item.type==='flip'&&session.revealed)next();
  }else if(event.code==='Space'&&current().type==='flip'&&(!event.target.closest('button')||event.target.closest('.flip-card'))){event.preventDefault();session.revealed=!session.revealed;render();}
 }else if(view==='result'&&session?.kind!=='learn'){
  const missed=session.items.filter((q,i)=>q.answer!==session.answers[i]);
  if(event.key==='ArrowLeft'&&reviewIndex>0){event.preventDefault();reviewIndex--;render();}
  if(event.key==='ArrowRight'&&reviewIndex+1<missed.length){event.preventDefault();reviewIndex++;render();}
 }
});
document.querySelector('.brand').onclick=e=>{e.preventDefault();go(view==='play'?'leave':'home');};
document.querySelector('#sound-toggle').onclick=()=>{progress.sound=!progress.sound;if('speechSynthesis' in window)speechSynthesis.cancel();save();soundUI();};
document.querySelector('#parent-open').onclick=openParent;
document.querySelector('#parent-close').onclick=()=>document.querySelector('#parent-dialog').close();
// Old topic links now enter the same unified module instead of separate modules.
const route=new URLSearchParams(location.search).get('module');
if(route==='exam')start('test');else if(route==='learn')start('learn');else render();
let reloading=false;
if('serviceWorker' in navigator&&location.protocol!=='file:'){
 const hadController=Boolean(navigator.serviceWorker.controller);
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!reloading){if(view==='home'){reloading=true;location.reload();}else toast('Nová verze je připravená. Po dokončení hry stránku znovu otevři.');}});
 navigator.serviceWorker.register('./sw.js').catch(()=>toast('Offline uložení není dostupné. S připojením můžeš hrát dál.'));
}
