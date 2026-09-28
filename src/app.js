import {topics,topicButtons,createKnowledgeView} from './knowledge.js';
import {buildActionLessons} from './action-lessons.js';
import {catalog,ids,matchesWord} from './catalog.js';
import {createHabitat} from './scene.js';
import {createActionPreviews,previewMarkup} from './action-previews.js';

const $=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const originals=Object.fromEntries(ids.map(id=>[id,catalog[id].lessons.slice()]));
let saved={};try{saved=JSON.parse(localStorage.getItem('dino-island-progress')||'{}');if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};}catch{}
let selected='trex',screen='map',lessonIndex=0,habitat,loading=false,request=0,recognition=null;
const knowledge=createKnowledgeView({speak}),previews=createActionPreviews(),lesson=()=>catalog[selected].lessons[lessonIndex];
function progress(){const count=Object.values(saved).filter(Boolean).length;$('progress').textContent=count+' ★';}
function mark(){saved[selected+':'+lesson().actionKey]=true;try{localStorage.setItem('dino-island-progress',JSON.stringify(saved));}catch{}progress();}
function cancelVoice(){const r=recognition;recognition=null;r?.abort();$('mic').classList.remove('listening');$('mic').setAttribute('aria-pressed','false');window.speechSynthesis?.cancel();}
function feedback(text,kind=''){ $('feedback').textContent=text;$('feedback').dataset.kind=kind;}
function speak(text,lang='en-US'){if(!$('sound').checked)return;if(!window.speechSynthesis){feedback('Trình duyệt chưa hỗ trợ đọc mẫu. Bạn vẫn có thể xem hành động.');return;}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=.82;const voice=speechSynthesis.getVoices().find(v=>v.lang===lang);if(voice)u.voice=voice;speechSynthesis.speak(u);}
function route(next){screen=next;document.body.dataset.screen=next;$('map-screen').hidden=next!=='map';$('experience').hidden=next==='map';$('action-tray').hidden=next!=='learn';$('topic-hub').hidden=!['intro','topic'].includes(next);$('knowledge-view').hidden=next!=='topic';$('learn-panel').hidden=next!=='learn';$('back').hidden=next==='map';$('say-name').hidden=!['intro','topic'].includes(next);habitat?.setActive(next==='learn');previews.setActive(next!=='map');previews.refresh();updateCards();}
function map(){request++;loading=false;cancelVoice();habitat?.stop();route('map');location.hash='map';}
async function openSpecies(id,{action=null,writeHash=true,topic=null}={}){
 if(id!=='trex'){cancelVoice();location.href='legacy.html#intro/'+id;return;}
 const ticket=++request;cancelVoice();selected=id;loading=true;document.querySelector('[data-enter-3d]').disabled=true;route('intro');if(writeHash)location.hash='intro/'+id;
 document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed','false'));
 $('hero-image').src='assets/heroes/'+id+'.png';$('hero-image').alt=catalog[id].name;$('hero-backdrop').style.backgroundImage=`url("assets/heroes/${id}.png")`;
 $('action-picker').replaceChildren();previews.refresh();$('load-status').hidden=false;$('load-status').innerHTML='<span class="spinner" aria-hidden="true"></span><span class="sr-only">Đang tải hành động</span>';
 try{
  habitat??=createHabitat($('stage'));await habitat.load(id);if(ticket!==request)return;
  catalog[id].lessons=buildActionLessons(catalog[id].name,habitat.definitions,originals[id]);
  $('action-picker').innerHTML=catalog[id].lessons.map((l,i)=>`<button class="action-orb" data-action-index="${i}" data-word="${esc(l.word)}" aria-label="${esc(l.actionLabel)}" style="--orb-hue:${[38,160,205,345,275,85][i%6]}">${previewMarkup(id,l.actionKey)}<span class="orb-play" aria-hidden="true">▶</span></button>`).join('');
  $('action-picker').querySelectorAll('button').forEach(b=>{b.onclick=()=>learn(Number(b.dataset.actionIndex));b.onfocus=()=>previews.focus(b);b.onpointerenter=()=>previews.focus(b);});
  loading=false;document.querySelector('[data-enter-3d]').disabled=false;$('load-status').hidden=true;previews.refresh();
  updateTray();if(topic&&topics[topic]){showTopic(topic);return;}
  if(action!==null){const i=catalog[id].lessons.findIndex(l=>l.actionKey===action);learn(i<0?0:i);}
 }catch(e){if(ticket!==request)return;loading=false;$('load-status').innerHTML='<button id="retry-load" class="round" aria-label="Thử tải lại">↻</button><span class="sr-only">Không tải được model</span>';$('retry-load').onclick=()=>openSpecies(id,{action});console.error(e);}
}
function showTopic(key){cancelVoice();route('topic');location.hash='topic/trex/'+key;knowledge.show(key);}
function learn(i){if(loading||!habitat)return;cancelVoice();lessonIndex=i;route('learn');location.hash='learn/'+selected+'/'+encodeURIComponent(lesson().actionKey);const l=lesson();
 $('word').textContent=l.word;$('meaning').textContent=l.meaning;$('example').textContent=l.example;$('translation').textContent=l.translation;$('translation').hidden=true;$('lesson-details').open=false;
 document.querySelectorAll('[data-action-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.actionIndex)===i)));updateTray();
 $('current-action').innerHTML=previewMarkup(selected,l.actionKey);$('current-action').setAttribute('aria-label','Phát lại '+l.word);feedback('');
 requestAnimationFrame(()=>{if(screen!=='learn')return;perform();habitat.fit(true);});speak(l.word);
}
function perform(){if(!habitat?.play(lesson().clip)){feedback('Chưa tải được hành động. Hãy thử lại.');return;}feedback('');}
const normalize=s=>s.toLowerCase().replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim();
function recognized(text){if(screen!=='learn')return;const ok=$('sentence-mode').checked?normalize(text)===normalize(lesson().example):matchesWord(text,lesson().word);if(ok){mark();perform();feedback('✓ '+lesson().word,'success');}else feedback('Thử lại: '+lesson().word,'retry');}
function mic(){if(recognition){cancelVoice();return;}const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Speech){feedback('Micro chưa được hỗ trợ. Dùng nút ▶ hoặc thử Chrome.');return;}window.speechSynthesis?.cancel();const r=new Speech();recognition=r;r.lang='en-US';r.interimResults=false;r.maxAlternatives=3;const id=selected,index=lessonIndex;
 r.onstart=()=>{$('mic').classList.add('listening');$('mic').setAttribute('aria-pressed','true');feedback('…');};
 r.onresult=e=>{if(recognition!==r||screen!=='learn'||id!==selected||index!==lessonIndex)return;const candidates=Array.from(e.results[0]).map(a=>a.transcript);recognized(candidates.find(t=>$('sentence-mode').checked?normalize(t)===normalize(lesson().example):matchesWord(t,lesson().word))||candidates[0]);};
 r.onerror=e=>{if(recognition!==r)return;feedback(e.error==='not-allowed'?'Cho phép micro để nói, hoặc dùng nút ▶.':e.error==='no-speech'?'Chưa nghe thấy. Chạm micro để thử lại.':'Không nhận được giọng nói. Bạn vẫn có thể dùng nút ▶.');};
 r.onend=()=>{if(recognition===r){recognition=null;$('mic').classList.remove('listening');$('mic').setAttribute('aria-pressed','false');}};try{r.start();}catch{cancelVoice();feedback('Không mở được micro. Dùng nút ▶ để xem.');}
}
function info(){const s=catalog[selected].info;$('info-content').innerHTML=`<h2>${esc(catalog[selected].name)}</h2><p>${esc(s.scientificName)}</p><p>${esc(s.summary)}</p><p>${esc(s.identityNote)}</p><p>${s.taxonomy.map(esc).join(' → ')}</p><dl>${s.attributes.map(a=>`<div><dt>${esc(a.label)}</dt><dd>${esc(a.display||String(a.value)+(a.unit?' '+a.unit:''))}</dd></div>`).join('')}</dl><h3>Nguồn tham khảo</h3>${s.sources.filter(s=>/^https?:\/\//.test(s.url)).map(s=>`<p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></p>`).join('')}`;cancelVoice();habitat.stop();$('info-dialog').showModal();}
$('island').innerHTML='<img class="island-art" src="assets/prehistoric-island.png" alt="">'+ids.map(id=>`<button class="map-pin ${id}" style="--x:${catalog[id].pos[0]}%;--y:${catalog[id].pos[1]}%" data-species="${id}" aria-label="${esc(catalog[id].name)}"><img src="assets/heroes/${id}.png" alt=""></button>`).join('');
$('cards').innerHTML=ids.map(id=>`<button class="creature-card" data-species="${id}" aria-label="${esc(catalog[id].name)}"><div><video muted playsinline loop preload="none" data-id="${id}" poster="assets/${id}.png"></video></div></button>`).join('');
const visible=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
function updateCards(){document.querySelectorAll('#cards video').forEach(v=>v.pause());if(screen!=='map'||document.hidden||reduced.matches)return;for(const v of [...visible].slice(0,3)){v.src||='assets/'+v.dataset.id+'-1.mp4';v.playbackRate=1.25;v.play().catch(()=>{});}}
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&e.intersectionRatio>=.5)visible.add(e.target);else visible.delete(e.target);}updateCards();},{threshold:.5});document.querySelectorAll('#cards video').forEach(v=>observer.observe(v));reduced.addEventListener('change',updateCards);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelVoice();updateCards();});
document.querySelectorAll('[data-species]').forEach(b=>b.onclick=()=>openSpecies(b.dataset.species));
$('back').onclick=()=>['learn','topic'].includes(screen)?openSpecies(selected):map();$('say-name').onclick=()=>screen==='topic'?knowledge.narrate():speak(catalog[selected].info.scientificName);$('hear-word').onclick=()=>speak(lesson().word);$('hear-sentence').onclick=()=>speak(lesson().example);$('translate').onclick=()=>{$('translation').hidden=!$('translation').hidden;};$('perform').onclick=perform;$('current-action').onclick=perform;$('mic').onclick=mic;$('info').onclick=info;$('reset-camera').onclick=()=>habitat?.fit(true);
$('previous-species').onclick=()=>openSpecies(ids[(ids.indexOf(selected)+ids.length-1)%ids.length]);$('next-species').onclick=()=>openSpecies(ids[(ids.indexOf(selected)+1)%ids.length]);
$('settings').onclick=()=>{cancelVoice();$('settings-dialog').showModal();};document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('reset-progress').onclick=()=>{if(confirm('Xóa tiến trình học trên trình duyệt này?')){saved={};try{localStorage.removeItem('dino-island-progress');}catch{}progress();}};
$('topic-hub').innerHTML='<button class="action-orb" data-enter-3d disabled aria-label="Xem model 3D" style="--orb-hue:32">'+previewMarkup('trex','roar')+'</button>'+topicButtons();
document.querySelector('[data-enter-3d]').onclick=()=>learn(0);
document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>showTopic(b.dataset.topic));
function updateTray(){const el=$('action-picker');$('actions-prev').disabled=el.scrollLeft<=2;$('actions-next').disabled=el.scrollLeft+el.clientWidth>=el.scrollWidth-2;}
function scrollTray(direction){const el=$('action-picker');el.scrollBy({left:direction*Math.max(150,el.clientWidth*.7),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
$('actions-prev').onclick=()=>scrollTray(-1);$('actions-next').onclick=()=>scrollTray(1);$('action-picker').addEventListener('scroll',updateTray);new ResizeObserver(updateTray).observe($('action-picker'));
function fromHash(){const [page,id,key]=location.hash.slice(1).split('/');if(catalog[id]&&['intro','learn','topic'].includes(page))openSpecies(id,{writeHash:false,action:page==='learn'?decodeURIComponent(key||''):null,topic:page==='topic'?key:null});else map();}
window.addEventListener('popstate',()=>{const expected=screen==='map'?'#map':screen==='intro'?'#intro/'+selected:screen==='topic'?'#topic/trex/'+$('knowledge-view').dataset.topic:'#learn/'+selected+'/'+encodeURIComponent(lesson().actionKey);if(location.hash!==expected)fromHash();});document.querySelector('.brand').onclick=e=>{e.preventDefault();map();};progress();route('map');if(location.hash&&location.hash!=='#map')fromHash();
window.dinoGame={get screen(){return screen;},get selected(){return selected;},get state(){return habitat?.state;},get lessons(){return catalog[selected].lessons;}};
