'use strict';
const LEVELS = [
['KAMEN','Priroda','Čvrst komadić prirode koji često pronađeš pored rijeke.'],
['MOST','Građevine','Spaja dvije obale i skraćuje put.'],
['MORE','Priroda','Slano je, plavo i puno valova.'],
['RIBA','Životinje','Pliva, ima peraje i živi u vodi.'],
['SAT','Predmeti','Njegove kazaljke pokazuju vrijeme.'],
['KUĆA','Svakodnevica','Ima krov, vrata i prostor za život.'],
['ŠUMA','Priroda','Mnogo stabala, hlada i svježeg zraka.'],
['NEBO','Priroda','Iznad nas je, s oblacima danju i zvijezdama noću.'],
['VODA','Priroda','Gasi žeđ i teče iz česme.'],
['SOVA','Životinje','Noćna ptica poznata po velikim očima.'],
['SUNCE','Priroda','Zvijezda koja nam daje svjetlost i toplinu.'],
['OBLAK','Priroda','Putuje nebom i ponekad donosi kišu.'],
['RIJEKA','Priroda','Teče kroz korito prema drugoj rijeci ili moru.'],
['TRAVA','Priroda','Zelena je i prekriva livadu.'],
['VATRA','Priroda','Grije, svijetli i pucketa dok gori.'],
['VRATA','Svakodnevica','Otvaraš ih kada ulaziš u sobu.'],
['PTICA','Životinje','Ima kljun, perje i krila.'],
['TORBA','Predmeti','U njoj nosiš stvari kada kreneš od kuće.'],
['ZUBAR','Zanimanja','Brine o zdravlju tvojih zuba.'],
['ŠEĆER','Hrana','Slatki kristali koje dodajemo u čaj ili kolače.'],
['JEZERO','Priroda','Velika vodena površina okružena kopnom.'],
['PROZOR','Svakodnevica','Kroz njega u sobu ulaze svjetlost i svjež zrak.'],
['CVIJET','Priroda','Ima latice i često lijepo miriše.'],
['JABUKA','Voće','Voće koje može biti crveno, zeleno ili žuto.'],
['LISICA','Životinje','Šumska životinja s riđim krznom i raskošnim repom.'],
['MJESTO','Pojmovi','Može biti prazno u autobusu ili omiljeno za odmor.'],
['PEKARA','Grad','Mjesto koje ujutro miriše na svjež hljeb i peciva.'],
['PROLJEĆE','Godišnja doba','Dolazi poslije zime, kada priroda počne cvjetati.'],
['SNIJEG','Priroda','Bijele pahuljice koje zimi prekrivaju tlo.'],
['VJETAR','Priroda','Ne vidiš ga, ali osjetiš kako pomjera zrak i lišće.'],
['PLANINA','Priroda','Visoko uzvišenje na koje se planinari penju.'],
['MOSTAR','Bosna i Hercegovina','Grad na Neretvi poznat po Starom mostu.'],
['BOSNA','Bosna i Hercegovina','Rijeka koja izvire kod Ilidže i dijeli ime s dijelom države.'],
['NERETVA','Bosna i Hercegovina','Smaragdna rijeka koja protiče kroz Konjic i Mostar.'],
['ĆILIM','Tradicija','Tkani ukrasni prekrivač s prepoznatljivim šarama.'],
['SEVDAH','Tradicija','Osjećaj ljubavi i čežnje utkan u bosansku pjesmu.'],
['ČARŠIJA','Tradicija','Stari trgovački dio grada, pun dućana i susreta.'],
['AVLIJA','Tradicija','Dvorište ispred kuće, često puno cvijeća.'],
['SARAJEVO','Bosna i Hercegovina','Glavni grad Bosne i Hercegovine.'],
['TRAVNIK','Bosna i Hercegovina','Vezirski grad pod Vlašićem, poznat i po Plavoj vodi.'],
['BIBLIOTEKA','Mjesta','Mjesto u kojem posuđuješ knjige.'],
['RAČUNAR','Tehnologija','Uređaj na kojem pišeš, radiš i igraš ovu igru.'],
['OGLEDALO','Predmeti','U njemu vidiš svoj odraz.'],
['ČOKOLADA','Hrana','Slatkiš od kakaa, često podijeljen na kockice.'],
['KIŠOBRAN','Predmeti','Otvaraš ga iznad glave kada pada kiša.'],
['BICIKL','Prijevoz','Prevozno sredstvo s dva točka i pedalama.'],
['LEPTIR','Životinje','Kukac sa šarenim krilima koji nastaje iz gusjenice.'],
['HORIZONT','Priroda','Daleka linija na kojoj se naizgled spajaju nebo i zemlja.'],
['PUTOVANJE','Doživljaji','Odlazak u druga mjesta radi odmora, istraživanja ili posla.'],
['USPOMENA','Osjećaji','Ono što u sjećanju čuvaš od važnog trenutka.'],
['RADOST','Osjećaji','Osjećaj sreće koji ti izmami osmijeh.'],
['HRABROST','Osobine','Pomaže ti da djeluješ i onda kada te je strah.'],
['SLOBODA','Vrijednosti','Mogućnost da biraš i živiš bez prisile.'],
['MAŠTA','Pojmovi','U njoj nastaju svjetovi koji još ne postoje.'],
['ZNATIŽELJA','Osobine','Želja da istražuješ, pitaš i saznaš više.'],
['RAVNOTEŽA','Pojmovi','Pomaže ti da ostaneš uspravno na jednoj nozi.'],
['POVJERENJE','Odnosi','Gradiš ga kada vjeruješ da će neko održati riječ.'],
['PRIJATELJ','Odnosi','Osoba s kojom dijeliš i radost i teške trenutke.'],
['BUDUĆNOST','Vrijeme','Vrijeme koje tek dolazi.'],
['POBJEDA','Uspjeh','Uspješan završetak takmičenja — ili svih ovih nivoa.']
].map(([word,category,clue],i)=>({id:i,word,category,clue}));
const CHAPTERS=['Zagrijavanje','Hvataj ritam','Oštri um','Naše riječi','Korak više','Majstor riječi'];
const ICONS={volume:'<path d="m11 5-6 4H2v6h3l6 4z"/><path d="M15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>',mute:'<path d="m11 5-6 4H2v6h3l6 4z"/><path d="m16 9 5 6m0-6-5 6"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4m.1 3h.01"/>',sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Zm7-2v4m-2-2h4"/>',shuffle:'<path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 4-2 5-5m3-4c1-2 2-3 4-3h3m-4-4 4 4-4 4"/>',undo:'<path d="m9 4-6 6 6 6M3 10h12a6 6 0 0 1 0 12"/>',bulb:'<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4Z"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',keyboard:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 15h10"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',check:'<path d="m5 12 4 4L19 6"/>',star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const $=id=>document.getElementById(id);
function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||'')+'</svg>';}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const KEY='rijec-po-rijec-v1';
let saved={results:{},current:0,sound:false,round:null},canSave=true;
try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&typeof v==='object'){saved.sound=v.sound===true;for(let i=0;i<60;i++){const n=v.results?.[i];if(!Number.isInteger(n)||n<1||n>3)break;saved.results[i]=n;}saved.current=Number.isInteger(v.current)?Math.max(0,Math.min(v.current,Math.min(Object.keys(saved.results).length,59))):0;saved.round=v.round;}}catch{canSave=false;}
let current=saved.current,letters=[],slots=[],fixed=new Set(),hints=0,solved=false,audioCtx;
function unlocked(){return Math.min(Object.keys(saved.results).length,59);}
function storeGame(){saved.current=current;saved.round={current,letters,slots,fixed:[...fixed],hints,solved};try{localStorage.setItem(KEY,JSON.stringify(saved));canSave=true;}catch{canSave=false;}$('save-status').innerHTML=icon(canSave?'check':'help')+(canSave?' Napredak se čuva na ovom uređaju':' Čuvanje nije dostupno u ovom pregledniku');}
function shuffleArray(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function splitWord(word){return word.match(/DŽ|LJ|NJ|./gu);}
function makeLetters(word){const parts=splitWord(word);let shuffled=shuffleArray(parts);if(shuffled.join('')===word)shuffled=[...parts.slice(1),parts[0]];return shuffled.map((text,id)=>({text,id}));}
function validRound(r){const target=splitWord(LEVELS[current].word);if(!r||r.current!==current||!Array.isArray(r.letters)||r.letters.length!==target.length||!Array.isArray(r.slots)||r.slots.length!==target.length||!Array.isArray(r.fixed)||!Number.isInteger(r.hints)||r.hints<0||r.hints>target.length)return false;const ls=r.letters;if(ls.some(x=>!x||!Number.isInteger(x.id)||x.id<0||x.id>=ls.length||typeof x.text!=='string')||new Set(ls.map(x=>x.id)).size!==ls.length||ls.map(x=>x.text).sort().join('|')!==[...target].sort().join('|'))return false;const used=r.slots.filter(x=>x!==null);if(used.some(x=>!Number.isInteger(x)||x<0||x>=ls.length)||new Set(used).size!==used.length)return false;return new Set(r.fixed).size===r.fixed.length&&r.fixed.length===r.hints&&r.fixed.every(i=>Number.isInteger(i)&&i>=0&&i<target.length&&r.slots[i]!==null&&ls.find(l=>l.id===r.slots[i]).text===target[i]);}
function startLevel(id,restore=false){if(!Number.isInteger(id)||id<0||id>unlocked())return false;current=id;pendingKey='';solved=false;letters=makeLetters(LEVELS[id].word);slots=Array(letters.length).fill(null);fixed=new Set();hints=0;if(restore&&validRound(saved.round)){letters=saved.round.letters;slots=saved.round.slots;fixed=new Set(saved.round.fixed);hints=saved.round.hints;}$('message').textContent='';$('message').className='message';$('game').classList.remove('solved');$('success').hidden=true;$('tap-tip').textContent='Dodirni slova i složi riječ.';$('level-label').textContent='NIVO '+String(id+1).padStart(2,'0');$('difficulty').textContent=CHAPTERS[Math.floor(id/10)];$('category').textContent=LEVELS[id].category.toLocaleUpperCase('bs');$('clue').textContent=LEVELS[id].clue;$('question').textContent='Koju riječ tražimo?';$('word-length').textContent=letters.length+' slova';render();renderProgress();if(restore&&!slots.includes(null))checkAnswer();storeGame();return true;}
function currentStars(){return Math.max(1,3-hints);}
function render(){const n=slots.length;$('answer').className='tile-row answer-row'+(n>7?' long':'');$('letters').className='tile-row letter-row'+(n>7?' long':'');$('answer').innerHTML='';slots.forEach((id,i)=>{const b=document.createElement('button');b.className='tile answer-tile'+(id!==null?' filled':'')+(fixed.has(i)?' locked':'');b.style.setProperty('--i',i);b.textContent=id===null?'':letters.find(l=>l.id===id).text;b.setAttribute('aria-label',id===null?'Prazno polje '+(i+1):b.textContent+(fixed.has(i)?', otkriveno slovo':', vrati slovo'));b.disabled=solved||fixed.has(i)||id===null;b.onclick=()=>removeAt(i);$('answer').append(b);});$('letters').innerHTML='';letters.forEach(l=>{const used=slots.includes(l.id);const b=document.createElement('button');b.textContent=l.text;b.className='tile letter-tile'+(used?' used':'');b.style.setProperty('--tilt',((l.id%3)-1)*2+'deg');b.setAttribute('aria-label','Slovo '+l.text);b.disabled=used||solved;b.onclick=()=>selectLetter(l.id);$('letters').append(b);});$('round-stars').innerHTML=[0,1,2].map(i=>'<span'+(i>=currentStars()?' class="dim"':'')+'>★</span>').join(' ');$('round-stars').setAttribute('aria-label','Moguće zvjezdice: '+currentStars());$('hint').disabled=solved;$('shuffle').disabled=solved;$('undo').disabled=solved||!slots.some((id,i)=>id!==null&&!fixed.has(i));}
function tone(success=false){if(!saved.sound)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();const now=audioCtx.currentTime;(success?[523.25,659.25,783.99]:[440]).forEach((frequency,i)=>{const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(0,now+i*.12);gain.gain.linearRampToValueAtTime(.08,now+i*.12+.01);gain.gain.exponentialRampToValueAtTime(.001,now+i*.12+.18);osc.start(now+i*.12);osc.stop(now+i*.12+.2);});}catch{}}
function selectLetter(id){if(solved||slots.includes(id)||!letters.some(l=>l.id===id))return false;const pos=slots.indexOf(null);if(pos<0)return false;slots[pos]=id;$('message').textContent='';tone();render();checkAnswer();storeGame();return true;}
function removeAt(i){if(solved||fixed.has(i))return;slots[i]=null;$('message').textContent='';render();storeGame();}
function undo(){for(let i=slots.length-1;i>=0;i--)if(slots[i]!==null&&!fixed.has(i)){removeAt(i);return;}}
function checkAnswer(){if(slots.includes(null))return;const answer=slots.map(id=>letters.find(l=>l.id===id).text).join('');if(answer===LEVELS[current].word){solved=true;const stars=currentStars(),previous=saved.results[current]||0,gain=Math.max(0,stars-previous)*50;saved.results[current]=Math.max(previous,stars);$('game').classList.add('solved');$('message').textContent='Bravo! '+answer+' je tačan odgovor.';$('message').className='message positive';$('success').hidden=false;$('success-kicker').textContent=current===59?'SVIH 60 NIVOA JE IZA TEBE!':'ODLIČNO SLOŽENO!';$('success-title').textContent=current===59?'Ti si majstor riječi.':current%10===9?'Nova etapa je otključana.':'To je ta riječ.';$('reward').textContent=stars+' '+(stars===1?'zvjezdica':'zvjezdice')+' · '+(gain?'+'+gain+' bodova':'Najbolji rezultat je sačuvan');$('next').innerHTML=(current===59?'Pogledaj svoj put':'Sljedeći nivo')+' '+icon('arrow');$('tap-tip').textContent='Sjajno! Spreman za novu riječ?';tone(true);render();renderProgress();$('next').focus({preventScroll:true});}else{$('message').textContent='Još nije ta riječ. Vrati slovo i probaj ponovo.';$('message').className='message';$('answer').classList.remove('shake');void $('answer').offsetWidth;$('answer').classList.add('shake');}}
function reveal(){if(solved)return;const target=splitWord(LEVELS[current].word);let pos=target.findIndex((text,i)=>!fixed.has(i)&&(slots[i]===null||letters.find(l=>l.id===slots[i]).text!==text));if(pos<0)pos=target.findIndex((_,i)=>!fixed.has(i));if(pos<0)return;const letter=letters.find(l=>l.text===target[pos]&&![...fixed].some(i=>slots[i]===l.id));const other=slots.indexOf(letter.id);if(other>=0&&other!==pos)slots[other]=slots[pos];slots[pos]=letter.id;fixed.add(pos);hints++;render();$('message').textContent='Otkriveno slovo '+target[pos]+'. Nastavi slagati.';$('message').className='message positive';checkAnswer();storeGame();}
function renderProgress(){const count=Object.keys(saved.results).length,stars=Object.values(saved.results).reduce((a,b)=>a+b,0);$('total-stars').textContent=stars;$('total-points').textContent=(stars*50).toLocaleString('bs');$('progress-label').textContent=count+' / 60';$('progress').value=count;$('progress').textContent=count+' / 60';$('chapters').innerHTML='';CHAPTERS.forEach((name,c)=>{const start=c*10,finished=Array.from({length:10},(_,i)=>saved.results[start+i]).filter(Boolean).length,locked=start>unlocked(),active=Math.floor(current/10)===c;const b=document.createElement('button');b.className='chapter'+(active?' current':'')+(locked?' locked':'')+(finished===10?' complete':'');b.disabled=locked;b.setAttribute('aria-label',name+', nivoi '+(start+1)+' do '+(start+10)+(locked?', zaključano':''));b.innerHTML='<span class="chapter-symbol">'+(finished===10?icon('check'):String(c+1).padStart(2,'0'))+'</span><span class="chapter-copy"><strong>'+name+'</strong><small>Nivoi '+(start+1)+'–'+(start+10)+' · '+finished+'/10</small></span>'+icon(locked?'lock':'arrow');b.onclick=()=>openLevels(c);$('chapters').append(b);});}
function openLevels(chapter){const root=$('level-grid');root.innerHTML='';CHAPTERS.forEach((name,c)=>{const section=document.createElement('section');section.className='level-section';section.id='chapter-'+c;section.innerHTML='<h3>'+String(c+1).padStart(2,'0')+' · '+name+'</h3>';const grid=document.createElement('div');grid.className='levels-grid';for(let i=c*10;i<c*10+10;i++){const b=document.createElement('button');b.className='level-button'+(saved.results[i]?' finished':'')+(i===current?' active':'');b.disabled=i>unlocked();b.setAttribute('aria-label','Nivo '+(i+1)+(saved.results[i]?', '+saved.results[i]+' zvjezdice':b.disabled?', zaključan':', otključan'));b.innerHTML=(i+1)+(b.disabled?icon('lock'):'<small>'+(saved.results[i]?'★'.repeat(saved.results[i]):'•')+'</small>');b.onclick=()=>{$('levels-dialog').close();startLevel(i);$('game').scrollIntoView({block:'start',behavior:'smooth'});$('game').focus({preventScroll:true});};grid.append(b);}section.append(grid);root.append(section);});$('levels-dialog').showModal();if(Number.isInteger(chapter))$('chapter-'+chapter).scrollIntoView({block:'start'});}
$('shuffle').onclick=()=>{if(solved)return;letters=shuffleArray(letters);render();storeGame();$('message').textContent='Novi raspored, ista riječ.';$('message').className='message positive';};
$('undo').onclick=undo;$('hint').onclick=reveal;$('next').onclick=()=>{if(!solved)return;if(current===59)openLevels();else{startLevel(current+1);$('game').focus({preventScroll:true});}};$('levels').onclick=()=>openLevels();$('help').onclick=()=>$('help-dialog').showModal();
function renderSound(){$('sound').innerHTML=icon(saved.sound?'volume':'mute');$('sound').setAttribute('aria-label',saved.sound?'Isključi zvuk':'Uključi zvuk');$('sound').setAttribute('aria-pressed',String(saved.sound));}
$('sound').onclick=()=>{saved.sound=!saved.sound;renderSound();tone();storeGame();};
document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>b.closest('dialog').close());document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
let pendingKey='';
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;if(e.key==='Backspace'){e.preventDefault();pendingKey='';undo();return;}if(e.key==='Escape'){e.preventDefault();pendingKey='';slots.forEach((id,i)=>{if(!fixed.has(i)&&!solved)slots[i]=null;});render();storeGame();$('message').textContent='';return;}if(e.key.length!==1||!/[a-zčćšđž]/i.test(e.key)||solved)return;e.preventDefault();const key=e.key.toLocaleUpperCase('bs');const free=letters.filter(l=>!slots.includes(l.id));const combo=free.find(l=>l.text===pendingKey+key);const single=free.find(l=>l.text===key);if(pendingKey&&combo){selectLetter(combo.id);pendingKey='';return;}if(single){selectLetter(single.id);pendingKey='';return;}if(free.some(l=>l.text.length===2&&l.text.startsWith(key))){pendingKey=key;$('message').textContent='Upiši drugo slovo: '+key+'…';}else pendingKey='';});
renderSound();startLevel(current,true);
if(document.modelContext?.registerTool){for(const tool of [{name:'get_word_game_state',description:'Read the visible puzzle, available tiles, level, score and device-local progress. Does not reveal the solution.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({level:current+1,clue:LEVELS[current].clue,tiles:letters.map(l=>({id:l.id,text:l.text,used:slots.includes(l.id)})),answer:slots.map(id=>id===null?null:letters.find(l=>l.id===id).text),solved,completed:Object.keys(saved.results).length})},{name:'place_word_game_tiles',description:'Place available tiles by their IDs, in order, using the same rules as clicking tiles. A complete correct answer completes the level.',inputSchema:{type:'object',properties:{tileIds:{type:'array',items:{type:'integer'},minItems:1,maxItems:12}},required:['tileIds'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{const ids=input?.tileIds;if(!Array.isArray(ids)||!ids.length||ids.length>slots.filter(x=>x===null).length||new Set(ids).size!==ids.length||ids.some(id=>!Number.isInteger(id)||!letters.some(l=>l.id===id)||slots.includes(id))||solved)throw new Error('Nevažeći ili nedostupni ID slova.');ids.forEach(selectLetter);return{level:current+1,solved};}}])try{Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{});}catch{}}
