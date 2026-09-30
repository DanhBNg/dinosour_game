import {createFreeRoam} from './free-roam.js';
import {previewKey,shuffledCycle} from './preview-species.js';
import {createMobileUI,createModelLoading} from './mobile-ui.js';
import {catalog,ids as dinosaurIds} from './catalog.js';
import {marine,hiddenMarineIds,visibleMarineIds} from './marine.js';
import {oceanTopicButtons,oceanContent,createOceanKnowledge} from './ocean-knowledge.js';
import {speciesKnowledge} from './species-knowledge-data.js';
import {speciesTopicButtons,createSpeciesKnowledge} from './species-knowledge-view.js';
import {createHabitat} from './scene.js';
import {topicButtons,topics,createKnowledgeView} from './knowledge.js';
import {previewMarkup,framePreview,createActionPreviews} from './action-previews.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seaIds=visibleMarineIds,all={...catalog,...marine};let selected='trex',world='dinosaurs',screen='home',habitat,ticket=0,loading=false,currentAction='',defs={};
const previews=createActionPreviews(),knowledge=createKnowledgeView({speak}),oceanKnowledge=createOceanKnowledge({speak}),speciesView=createSpeciesKnowledge({speak});
const hasTopic=(id,key)=>!!(speciesKnowledge[id]?.topics[key]||(id==='trex'&&topics[key])||oceanContent[id]?.[key]);
function speak(text,lang='vi-VN'){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang;speechSynthesis.speak(u);}
const group=id=>marine[id]?'ocean':'dinosaurs',list=()=>world==='ocean'?seaIds:dinosaurIds;
const portrait=id=>'/assets/portraits/'+id+'.webp';
const environment=id=>id==='trex'?'/assets/knowledge/trex/habitat.png':'/assets/worlds/'+(marine[id]?.env||({mosa:'deep',ptero:'cliffs'}[id]||'forest'))+'.png';
function imageMarkup(id){return `<img src="${portrait(id)}" alt="${esc(all[id].name)}" onerror="this.onerror=null;this.src='/assets/${marine[id]?'knowledge/trex/icon-range.png':id+'.png'}'">`;}
function notify(text){$('notice').textContent=text;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('notice').textContent='',2400);}
const modelLoading=createModelLoading($('load-status'));
let loadedId=null,currentTopic='habitat',roam;
const roamScreen=document.createElement('section');roamScreen.id='roam-screen';roamScreen.hidden=true;document.querySelector('main').append(roamScreen);
const gameButton=document.createElement('button');gameButton.id='explore-game';gameButton.className='round';gameButton.hidden=true;gameButton.setAttribute('aria-label','Khám phá tự do');gameButton.innerHTML='<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M9 4h14c4 0 7 12 5 15-2 3-6-3-8-3h-8c-2 0-6 6-8 3C2 16 5 4 9 4Z"/><path d="M10 7v7M6.5 10.5h7"/><circle cx="22" cy="9" r="1"/><circle cx="25" cy="12" r="1"/></svg>';$('stage').querySelector('.stage-tools').prepend(gameButton);gameButton.onclick=()=>navigate('/animal/'+selected+'/explore');
function openRoam(id){ticket++;loading=false;modelLoading.end();selected=id;world=group(id);route('explore');roam??=createFreeRoam(roamScreen);roam.load(id);}
createMobileUI({notify});
function route(next){roamScreen.hidden=next!=='explore';if(next!=='explore')roam?.setActive(false);gameButton.hidden=next!=='learn'||!['trex','loggerhead'].includes(selected);$('notice').textContent='';screen=next;document.body.dataset.screen=next;document.body.dataset.world=world;$('home-screen').hidden=next!=='home';$('map-screen').hidden=next!=='map';$('experience').hidden=['home','map','explore'].includes(next);$('action-tray').hidden=next!=='learn';$('topic-hub').hidden=!['intro','topic'].includes(next);$('knowledge-view').hidden=next!=='topic';$('learn-panel').hidden=true;$('back').hidden=next==='home';$('say-name').hidden=!['intro','topic'].includes(next);habitat?.setActive(next==='learn');previews.setActive(['home','intro','learn','topic','map'].includes(next));previews.refresh();}
function navigate(path,replace=false){history[replace?'replaceState':'pushState']({},'',path);readRoute();}
function showMap(){ticket++;loading=false;modelLoading.end();route('map');
 $('island').innerHTML='<img class="island-art" src="/assets/'+(world==='ocean'?'worlds/ocean.png':'prehistoric-island.png')+'" alt="">'+list().map(id=>{
 const pos=world==='ocean'?({seal:[12,28],squid:[30,44],loggerhead:[54,32],tuna:[77,33],slug:[50,51],shark:[85,57],fish:[38,51],amplectobelua:[66,64]})[id]:catalog[id].pos;
 return '<button class="map-pin '+id+'" style="--px:'+pos[0]/100+';--py:'+pos[1]/100+'" data-species="'+id+'" aria-label="'+esc(all[id].name)+'"><span class="pin-orb">'+previewMarkup(id,previewKey(id))+'</span></button>';
 }).join('');previews.refresh();$('island').querySelectorAll('[data-species]').forEach(b=>b.onclick=()=>navigate('/animal/'+b.dataset.species));layoutMap();$('world-title').textContent=world==='ocean'?'OCEAN WORLD':'DINOSAUR WORLD';
}
function setupAnimal(id){selected=id;world=group(id);document.body.dataset.species=id;document.body.dataset.marine=String(!!marine[id]);$('experience').style.setProperty('--environment','url("'+environment(id)+'")');$('hero-image').hidden=true;$('hero-backdrop').style.backgroundImage='url("'+environment(id)+'")';
 $('topic-hub').innerHTML=(speciesKnowledge[id]?speciesTopicButtons(id):marine[id]?oceanTopicButtons():topicButtons())+'<button class="action-orb" data-enter-3d aria-label="Xem model 3D">'+previewMarkup(id,previewKey(id))+'<span class="orb-play">▶</span></button>';
 $('topic-hub').querySelector('[data-enter-3d]').onclick=()=>navigate('/animal/'+id+'/actions');
 $('topic-hub').querySelectorAll('[data-topic]').forEach(b=>{b.setAttribute('aria-disabled',String(!hasTopic(id,b.dataset.topic)));b.onclick=()=>hasTopic(id,b.dataset.topic)?navigate('/animal/'+id+'/topics/'+b.dataset.topic):notify('Mục này chưa có nội dung');});previews.refresh();
}
function showTopic(id,key='habitat'){++ticket;loading=false;modelLoading.end();setupAnimal(id);currentTopic=key;route('topic');
 if(hasTopic(id,key)){if(speciesKnowledge[id])speciesView.show(id,key);else if(marine[id])oceanKnowledge.show(id,key);else{$('knowledge-view').dataset.owner='dinosaur';knowledge.show(key);}}
 else{$('knowledge-view').hidden=true;}
 $('topic-hub').querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===key)));
 $('knowledge-prev').disabled=topicKeys().indexOf(currentTopic)<=0;
}
async function open(id,action){const request=++ticket;setupAnimal(id);loading=true;route('learn');$('stage').style.opacity='0';$('action-picker').innerHTML='';modelLoading.begin(id,!!marine[id],action);previews.refresh();
 try{habitat??=createHabitat($('stage'));if(loadedId!==id){loadedId=null;await habitat.load(id);if(request!==ticket)return;loadedId=id;}if(request!==ticket)return;
 defs=habitat.definitions;loading=false;
 $('action-picker').innerHTML=Object.entries(defs).map(([key,spec])=>'<button class="action-orb" data-action="'+esc(key)+'" aria-label="'+esc(spec[1])+'" title="'+esc(spec[1])+'">'+previewMarkup(id,key)+'<span class="orb-play">▶</span><span class="action-label">'+esc(spec[1])+'</span></button>').join('');
 $('action-picker').querySelectorAll('button').forEach(b=>b.onclick=()=>navigate('/animal/'+id+'/actions/'+encodeURIComponent(b.dataset.action)));previews.refresh();showAction(action);habitat.fit(false);
 await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));if(request!==ticket)return;$('stage').style.opacity='1';modelLoading.end();
 }catch(e){if(request!==ticket)return;loading=false;loadedId=null;modelLoading.fail(()=>open(id,action));console.error(e);}}
function showAction(key){selected=loadedId||selected;setupAnimal(selected);if(!defs[key])key=Object.keys(defs)[0];currentAction=key;route('learn');habitat.play(key);habitat.fit(true);document.querySelectorAll('[data-action]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.action===key)));updateTray();}
function readRoute(){window.speechSynthesis?.cancel();const p=decodeURIComponent(location.pathname).split('/').filter(Boolean);
 if(!p.length){ticket++;loading=false;modelLoading.end();route('home');return;}
 if(p[0]==='world'&&['dinosaurs','ocean'].includes(p[1])){world=p[1];showMap();return;}
 if(p[0]==='animal'&&hiddenMarineIds.has(p[1])){navigate('/world/ocean',true);return;}
 if(p[0]==='animal'&&all[p[1]]){if(p[2]==='explore'&&['trex','loggerhead'].includes(p[1])){openRoam(p[1]);return;}if(p[2]==='actions'){if(p[1]===loadedId&&!loading){ticket++;showAction(p[3]);$('stage').style.opacity='1';modelLoading.end();}else open(p[1],p[3]);}else showTopic(p[1],p[2]==='topics'&&hasTopic(p[1],p[3])?p[3]:'habitat');return;}navigate('/',true);
}
$('home-screen').innerHTML='<img class="home-art" src="/assets/worlds/home.png" alt="Bản đồ thế giới động vật">'+[{id:'dinosaurs',name:'THẾ GIỚI CỔ ĐẠI',x:23,y:36,art:'/assets/heroes/trex.png'},{id:'ocean',name:'ĐẠI DƯƠNG',x:80,y:46,art:'/assets/map-portraits/loggerhead.png'},{model:'elephant',name:'ĐỒNG CỎ',x:13,y:64},{model:'gorilla',name:'RỪNG NHIỆT ĐỚI',x:46,y:44},{model:'wolf',name:'NÚI & BẦU TRỜI',x:72,y:23},{model:'cow',name:'NÔNG TRẠI',x:42,y:81},{name:'VÙNG ĐẤT MỚI',x:88,y:82}].map(v=>`<button class="world-badge ${v.id?'available':'locked'}" style="left:${v.x}%;top:${v.y}%" ${v.id?'data-world="'+v.id+'"':'aria-disabled="true"'} aria-label="${v.name}"><span>${v.id?previewMarkup(v.id==='dinosaurs'?'trex':'loggerhead',v.id==='dinosaurs'?'roar':'clip0'):v.model?previewMarkup(v.model,'clip0')+'<i class="badge-lock" aria-hidden="true">🔒</i>':'🔒'}</span><b>${v.name}</b></button>`).join('');
$('home-screen').innerHTML='<div class="home-canvas">'+$('home-screen').innerHTML+'</div>';
$('home-screen').querySelectorAll('button[data-world]').forEach(b=>b.onclick=()=>navigate('/world/'+b.dataset.world));document.querySelectorAll('.world-badge.locked').forEach(b=>b.onclick=()=>notify('Vùng này sẽ được mở sau'));
$('back').onclick=()=>navigate(screen==='explore'?'/animal/'+selected+'/actions':screen==='home'?'/':screen==='map'?'/':screen==='topic'||screen==='intro'?'/world/'+world:'/animal/'+selected);document.querySelector('.brand').onclick=e=>{e.preventDefault();navigate('/');};$('say-name').onclick=()=>screen==='topic'?(speciesKnowledge[selected]?speciesView:marine[selected]?oceanKnowledge:knowledge).narrate():speak(all[selected].name);$('reset-camera').onclick=()=>habitat?.fit(true);$('info').onclick=()=>notify(marine[selected]?'Model minh hoạ · animation gốc nếu có':'Chọn biểu tượng ở trang giới thiệu để xem thông tin');document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>b.closest('dialog').close());
function updateTray(){const e=$('action-picker');$('actions-prev').disabled=e.scrollLeft<=2;$('actions-next').disabled=e.scrollLeft+e.clientWidth>=e.scrollWidth-2;}
for(const [id,d]of [['actions-prev',-1],['actions-next',1]])$(id).onclick=()=>$('action-picker').scrollBy({left:d*300,behavior:'smooth'});$('action-picker').onscroll=updateTray;new ResizeObserver(updateTray).observe($('action-picker'));

// Keep marine pins and the painting in the same coordinate system, including on phones.
function layoutMap(){const e=$('island');if(!e.querySelector('.island-art'))return;const w=Math.max(e.clientWidth,e.clientHeight*1.777),h=w/1.777;e.style.setProperty('--map-width',w+'px');e.style.setProperty('--map-height',h+'px');}
new ResizeObserver(layoutMap).observe($('island'));
function topicKeys(){return [...$('topic-hub').querySelectorAll('[data-topic]')].filter(b=>b.getAttribute('aria-disabled')!=='true').map(b=>b.dataset.topic);}
function stepTopic(d){if(screen!=='topic')return;const keys=topicKeys(),i=keys.indexOf(currentTopic)+d;if(i>=keys.length){navigate('/animal/'+selected+'/actions');}else if(i>=0)navigate('/animal/'+selected+'/topics/'+keys[i]);}
for(const [id,d]of [['knowledge-prev',-1],['knowledge-next',1]]){const button=document.createElement('button');button.id=id;button.className='round knowledge-step';button.textContent=d<0?'‹':'›';button.setAttribute('aria-label',d<0?'Mục kiến thức trước':'Mục tiếp theo hoặc model 3D');button.onclick=()=>stepTopic(d);$('experience').append(button);}
let gesture=null,suppressSceneClick=false;
const swipeView=$('knowledge-view');
swipeView.addEventListener('dragstart',e=>e.preventDefault());
swipeView.addEventListener('pointerdown',e=>{
 if(screen!=='topic'||!e.isPrimary||e.button!==0||e.target.closest('details,a,input,#topic-options'))return;
 // Scene hotspots cover much of the artwork: they must support both taps and swipes.
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY,swiping:false};
},true);
swipeView.addEventListener('pointermove',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
 if(!gesture.swiping&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3){gesture.swiping=true;swipeView.setPointerCapture(e.pointerId);}
 if(gesture.swiping)e.preventDefault();
},true);
swipeView.addEventListener('pointerup',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;
 const g=gesture;gesture=null;const dx=e.clientX-g.x,dy=e.clientY-g.y;
 if(g.swiping){suppressSceneClick=true;setTimeout(()=>suppressSceneClick=false,350);}
 if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){e.preventDefault();stepTopic(dx<0?1:-1);}
},true);
swipeView.addEventListener('click',e=>{if(suppressSceneClick){e.preventDefault();e.stopImmediatePropagation();}},true);
swipeView.addEventListener('pointercancel',()=>gesture=null,true);
for(const [name,ids,initial]of [['dinosaurs',dinosaurIds,'trex'],['ocean',seaIds,'loggerhead']]){const next=shuffledCycle(ids,initial);setInterval(async()=>{if(screen!=='home'||document.hidden)return;const id=next(),key=previewKey(id),img=new Image();img.src='/assets/action-previews/'+id+'-'+key+'.webp';try{await img.decode();}catch{return;}if(screen!=='home')return;const sprite=document.querySelector('button[data-world='+name+'] [data-preview]');if(!sprite)return;sprite.dataset.preview=id+'/'+key;sprite.style.cssText=framePreview(id,key)+'background-image:url("'+img.src+'")';},9600);}
window.addEventListener('popstate',readRoute);if(location.hash){const [page,id,key]=location.hash.slice(1).split('/');history.replaceState({},'',all[id]?'/animal/'+id+(page==='learn'?'/actions/'+key:page==='topic'?'/topics/'+key:''):'/world/dinosaurs');}readRoute();window.dinoGame={get roam(){return roam?.state},get screen(){return screen},get selected(){return selected},get state(){return habitat?.state},get lessons(){return Object.entries(defs).map(([actionKey,s])=>({actionKey,word:s[1]}))},capture:async id=>{await habitat.load(id);return habitat.capturePortrait();}};
