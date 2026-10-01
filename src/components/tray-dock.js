// One persistent mobile dock state shared by knowledge and animation screens.
export function createTrayDock(){
 const body=document.body,experience=document.getElementById('experience'),hub=document.getElementById('topic-hub'),actions=document.getElementById('action-tray');
 const query=matchMedia('(max-width:1024px), (pointer:coarse) and (max-width:1600px)');
 const handle=document.createElement('button');handle.id='tray-handle';handle.type='button';handle.setAttribute('aria-controls','topic-hub action-tray');handle.innerHTML='<svg viewBox="0 0 68 32" class="handle-shape" aria-hidden="true"><path d="M2 31 12 7Q14 2 21 2H47Q54 2 56 7L66 31Z"/></svg><svg class="handle-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';experience.append(handle);
 let collapsed=false,drag=null,ignoreClick=false;
 function sync(){const active=['topic','intro','learn'].includes(body.dataset.screen);handle.hidden=!active;body.dataset.trayCollapsed=String(active&&collapsed);handle.setAttribute('aria-expanded',String(!collapsed));handle.setAttribute('aria-label',collapsed?'Mở khay lựa chọn':'Thu gọn khay lựa chọn');
  hub.inert=actions.inert=active&&collapsed;
  if(active&&collapsed&&(hub.contains(document.activeElement)||actions.contains(document.activeElement)))handle.focus({preventScroll:true});
 }
 function set(value){collapsed=value;sync();}
 handle.onclick=()=>{if(ignoreClick)return;set(!collapsed);};
 handle.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;drag={y:e.clientY,id:e.pointerId};handle.setPointerCapture(e.pointerId);});
 handle.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const dy=e.clientY-drag.y;drag=null;if(Math.abs(dy)>16){ignoreClick=true;set(dy>0);setTimeout(()=>ignoreClick=false,350);}});
 handle.addEventListener('pointercancel',()=>drag=null);
 handle.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();set(e.key==='ArrowDown');}});
 query.addEventListener('change',sync);new MutationObserver(sync).observe(body,{attributes:true,attributeFilter:['data-screen']});sync();
}
