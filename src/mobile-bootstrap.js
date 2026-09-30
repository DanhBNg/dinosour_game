// A real landscape viewport keeps pointer coordinates, media queries and WebGL
// consistent when only the app (not the browser) is rotated.
const embedded=window.parent!==window&&window.frameElement?.hasAttribute('data-animal-app');
const touch=navigator.maxTouchPoints>0&&Math.min(innerWidth,innerHeight)<=1024;
if(embedded){
 const replace=history.replaceState.bind(history);
 for(const method of ['pushState','replaceState']){
  const original=replace;
  history[method]=(...args)=>{original(...args);parent.postMessage({type:'animal-route',path:location.pathname+location.search,replace:method==='replaceState'},location.origin);};
 }
 addEventListener('message',event=>{if(event.source!==parent||event.origin!==location.origin)return;if(event.data?.type==='animal-back'){history.replaceState({},'',event.data.path);dispatchEvent(new PopStateEvent('popstate'));}});
 document.addEventListener('click',event=>{if(event.target.closest('#orientation-toggle')){event.preventDefault();event.stopImmediatePropagation();parent.postMessage({type:'animal-fullscreen'},location.origin);}},true);
 import('./app.js');
}else if(touch){
 document.body.replaceChildren();document.body.className='landscape-shell';
 const frame=document.createElement('iframe');frame.dataset.animalApp='true';frame.title='Animal World';frame.allow='fullscreen; autoplay';frame.setAttribute('allowfullscreen','');
 Object.assign(frame.style,{position:'absolute',border:'0',transformOrigin:'0 0',display:'block'});
 Object.assign(document.body.style,{position:'fixed',inset:'0',margin:'0',overflow:'hidden',background:'#122b25'});
 const gate=document.createElement('div');gate.id='landscape-gate';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-labelledby','rotate-title');gate.innerHTML='<div class="rotate-card"><div class="rotate-illustration" aria-hidden="true"><span class="rotate-phone"></span></div><h1 id="rotate-title">Xoay ngang điện thoại</h1><p>Cùng khám phá thế giới động vật!</p><button id="landscape-start">Bắt đầu</button><p id="rotate-hint">Nếu điện thoại đang khóa xoay, đặt máy nằm ngang rồi bấm Bắt đầu.</p></div>';document.body.append(gate);
 let acceptedPortrait=false,wasPortrait=null;
 gate.querySelector('button').onclick=()=>{acceptedPortrait=true;fit();frame.focus();};
 function fit(){const vv=visualViewport;if(vv&&Math.abs(vv.scale-1)>.02)return;const w=vv?.width||innerWidth,h=vv?.height||innerHeight,portrait=h>w;frame.style.width=(portrait?h:w)+'px';frame.style.height=(portrait?w:h)+'px';frame.style.left=(vv?.offsetLeft||0)+'px';frame.style.top=(vv?.offsetTop||0)+'px';frame.style.transform=portrait?'translateX('+w+'px) rotate(90deg)':'none';document.body.dataset.appRotated=String(portrait);if(!portrait)acceptedPortrait=false;const blocked=portrait&&!acceptedPortrait;gate.hidden=!blocked;frame.inert=blocked;frame.style.visibility=blocked?'hidden':'visible';if(blocked&&wasPortrait!==true)gate.querySelector('button').focus();wasPortrait=portrait;}
 fit();frame.src=location.href;document.body.append(frame);
 window.addEventListener('resize',fit);visualViewport?.addEventListener('resize',fit);visualViewport?.addEventListener('scroll',fit);
 addEventListener('message',async event=>{
  if(event.source!==frame.contentWindow||event.origin!==location.origin)return;const data=event.data;
  if(data?.type==='animal-route'&&typeof data.path==='string'&&data.path.startsWith('/')&&!data.path.startsWith('//')){if(location.pathname+location.search!==data.path)history[data.replace?'replaceState':'pushState']({},'',data.path);}
  if(data?.type==='animal-fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{/* App rotation works without browser fullscreen. */}fit();}
 });
 addEventListener('popstate',()=>frame.contentWindow.postMessage({type:'animal-back',path:location.pathname+location.search},location.origin));
}else import('./app.js');
