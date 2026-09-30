import {createTrayDock} from './tray-dock.js';
import {loadingBounds} from './loading-framing.js';
import {previewBounds} from './preview-framing.js';
import {previewMarkup} from './action-previews.js';
import {previewKey} from './preview-species.js';
// Mobile chrome follows viewport geometry; no CSS rotation of the 3D canvas.
export function createMobileUI({notify}){
 createTrayDock();
 const $=id=>document.getElementById(id),mobile=()=>matchMedia('(max-width:1024px)').matches||(navigator.maxTouchPoints>0&&innerWidth<=1600),portraitPhone=()=>navigator.maxTouchPoints>0&&innerHeight>innerWidth;
 const gate=document.createElement('div');gate.id='landscape-gate';gate.hidden=true;gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-labelledby','rotate-title');gate.innerHTML='<div class="rotate-card"><div class="rotate-illustration" aria-hidden="true"><span class="rotate-phone"></span><span class="rotate-arrow">↻</span></div><h1 id="rotate-title">Xoay ngang điện thoại</h1><p>Cùng khám phá thế giới động vật!</p><button id="landscape-start">Bắt đầu <span aria-hidden="true">→</span></button><p id="rotate-hint">Giữ điện thoại nằm ngang để tiếp tục.</p></div>';document.body.append(gate);
 let previousFocus=null;
 function gateLayout(){const blocked=portraitPhone();if(blocked===!gate.hidden)return;gate.hidden=!blocked;document.body.classList.toggle('orientation-blocked',blocked);document.querySelector('header').inert=blocked;document.querySelector('main').inert=blocked;rotate.inert=blocked;if(blocked){previousFocus=document.activeElement;$('landscape-start').focus();}else if(previousFocus?.isConnected&&!previousFocus.closest('#landscape-gate'))previousFocus.focus({preventScroll:true});else document.querySelector('.brand').focus({preventScroll:true});}
 gate.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('landscape-start').focus();}});
 const rotate=document.createElement('button');rotate.id='orientation-toggle';rotate.className='round';rotate.setAttribute('aria-label','Mở ngang toàn màn hình');rotate.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 3H3v4M17 21h4v-4"/></svg>';document.body.append(rotate);
 let attempted=false;
 async function landscape(explicit=false,fromGate=false){
  attempted=true;
  if(document.fullscreenElement&&explicit&&!fromGate){screen.orientation?.unlock?.();await document.exitFullscreen?.();return;}
  try{
   if(!document.fullscreenElement){if(!document.documentElement.requestFullscreen)throw Error('unsupported');await document.documentElement.requestFullscreen();}
   if(screen.orientation?.lock)await screen.orientation.lock('landscape');
   else if(fromGate)$('rotate-hint').textContent='Hãy xoay ngang điện thoại. Bật tự xoay nếu máy đang khóa.';else if(explicit)notify('Xoay ngang điện thoại để tiếp tục');
  }catch{if(fromGate)$('rotate-hint').textContent='Hãy xoay ngang điện thoại. Bật tự xoay nếu máy đang khóa.';else if(explicit)notify('Xoay ngang điện thoại; bật tự xoay nếu máy đang khóa');}
 }
 rotate.onclick=()=>landscape(true);$('landscape-start').onclick=()=>landscape(true,true);
 // Browsing stays in the tab; fullscreen is an explicit optional control.
 document.addEventListener('fullscreenchange',()=>{rotate.setAttribute('aria-label',document.fullscreenElement?'Thoát toàn màn hình':'Mở ngang toàn màn hình');if(!document.fullscreenElement)screen.orientation?.unlock?.();});
 const hub=$('topic-hub');
 for(const [id,label,d]of [['topics-prev','Mục trước',-1],['topics-next','Mục tiếp theo',1]]){
  const b=document.createElement('button');b.id=id;b.className='round topic-scroll';b.setAttribute('aria-label',label);b.textContent=d<0?'‹':'›';$('experience').append(b);b.onclick=()=>hub.scrollBy({left:d*hub.clientWidth*.65,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }
 function tray(){const visible=['intro','topic'].includes(document.body.dataset.screen);for(const [id,edge]of [['topics-prev',hub.scrollLeft<=2],['topics-next',hub.scrollLeft+hub.clientWidth>=hub.scrollWidth-2]]){$(id).hidden=!mobile()||!visible||hub.scrollWidth<=hub.clientWidth+2;$(id).disabled=edge;}}
 hub.addEventListener('scroll',tray);new ResizeObserver(tray).observe(hub);
 new MutationObserver(()=>{requestAnimationFrame(()=>{const selected=hub.querySelector('[aria-pressed=true]');if(selected&&!hub.inert){const a=selected.getBoundingClientRect(),r=hub.getBoundingClientRect();if(a.left<r.left+48)hub.scrollLeft-=r.left+48-a.left;else if(a.right>r.right-48)hub.scrollLeft+=a.right-r.right+48;}tray();});}).observe(hub,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed']});
 new MutationObserver(tray).observe(document.body,{attributes:true,attributeFilter:['data-screen']});
 let viewportFrame=0;
 function viewport(){
  const vv=window.visualViewport,unzoomed=!vv||Math.abs(vv.scale-1)<.02;
  // Do not counteract accessibility pinch zoom. Browser bars change the visual viewport at scale 1.
  if(unzoomed){const h=Math.round(vv?.height||innerHeight),w=Math.round(vv?.width||innerWidth),root=document.documentElement;
   root.style.setProperty('--app-height',h+'px');root.style.setProperty('--app-width',w+'px');root.style.setProperty('--app-top',(vv?.offsetTop||0)+'px');root.style.setProperty('--app-left',(vv?.offsetLeft||0)+'px');
   document.body.dataset.compact=String(mobile()&&w>h&&h<350);
  }
  gateLayout();tray();
 }
 function scheduleViewport(){cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(viewport);}
 addEventListener('resize',scheduleViewport);window.visualViewport?.addEventListener('resize',scheduleViewport);window.visualViewport?.addEventListener('scroll',scheduleViewport);screen.orientation?.addEventListener('change',scheduleViewport);document.addEventListener('fullscreenchange',scheduleViewport);addEventListener('pageshow',scheduleViewport);viewport();
 // Best effort on entry; gesture-only browsers keep the gate until physical rotation or a tap.
 if(portraitPhone()&&screen.orientation?.lock)screen.orientation.lock('landscape').catch(()=>{});
}

export function createModelLoading(host){
 let generation=0,currentId=null;
 function layout(){const sprite=host.querySelector('[data-preview]');if(!sprite||host.hidden||!currentId)return;
  const bounds=host.dataset.quality==='high'?loadingBounds[currentId]:previewBounds[currentId+'-'+previewKey(currentId)];
  const [x0,y0,x1,y1]=bounds||[.1,.1,.9,.9],w=host.clientWidth,h=host.clientHeight,size=.82*Math.min(w*.82/(x1-x0),h*.86/(y1-y0));
  Object.assign(sprite.style,{width:size+'px',height:size+'px',left:(w/2-(x0+x1)/2*size)+'px',top:(h/2-(y0+y1)/2*size)+'px'});
 }
 new ResizeObserver(layout).observe(host);
 function begin(id,marine,action){
  currentId=id;const request=++generation;host.hidden=false;host.dataset.failed='false';host.setAttribute('aria-busy','true');host.onclick=null;
  host.innerHTML=`<div class="loading-subject">${previewMarkup(id,previewKey(id))}<span class="sr-only">Đang chuẩn bị mô hình</span></div>`;
  const sprite=host.querySelector('[data-preview]'),image=new Image(),small=matchMedia('(max-width:1024px), (pointer:coarse)').matches;
  image.src='/assets/loading-previews/'+id+(small?'-512':'-768')+'.webp';
  image.decode().then(()=>{if(generation!==request||host.hidden)return;sprite.style.backgroundImage='url("'+image.src+'")';sprite.style.backgroundSize='600% 400%';sprite.style.backgroundPosition='0% 0%';sprite.dataset.frames='24';sprite.dataset.columns='6';host.dataset.quality='high';layout();}).catch(()=>{});
  host.dataset.quality='fallback';layout();
 }
 function end(){generation++;host.hidden=true;host.setAttribute('aria-busy','false');host.onclick=null;}
 function fail(retry){host.dataset.failed='true';host.setAttribute('aria-busy','false');host.querySelector('.loading-ring')?.remove();const b=document.createElement('button');b.className='round loading-retry';b.textContent='↻';b.setAttribute('aria-label','Tải model chưa thành công. Chạm để thử lại');b.onclick=retry;host.querySelector('.loading-subject')?.append(b);const hint=host.querySelector('.sr-only');if(hint)hint.textContent='Tải chưa thành công. Có thể thử lại hoặc quay về.';}
 return {begin,end,fail};
}
