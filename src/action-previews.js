// Offline-rendered alpha sprites; visible map cards all animate together.
export function previewMarkup(id,key){return `<span class="action-sprite" data-preview="${id}/${key}" style="background-image:url('assets/action-previews/${id}-${key}.webp')" aria-hidden="true"></span>`;}
export function createActionPreviews(){
 let active=false,items=[],videos=[],preferred=null,last=0,clock=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function syncVideo(video){
  if(active&&!document.hidden&&!reduced.matches&&video._visible){video.muted=true;video.play().catch(()=>{});}
  else video.pause();
 }
 const observer=new IntersectionObserver(entries=>{for(const e of entries){e.target._visible=e.isIntersecting&&e.intersectionRect.width>1&&e.intersectionRect.height>1;if(e.target.tagName==='VIDEO')syncVideo(e.target);}},{threshold:[0,.01]});
 function syncVideos(){videos.forEach(syncVideo);}
 function refresh(){
  videos.forEach(v=>v.pause());observer.disconnect();
  items=[...document.querySelectorAll('#action-picker [data-preview], #topic-hub [data-preview], #cards [data-preview]')];
  videos=[...document.querySelectorAll('#cards video')];
  for(const item of [...items,...videos]){item._visible=false;observer.observe(item);}
  preferred=null;clock=0;
 }
 function tick(now){
  requestAnimationFrame(tick);if(now-last<100)return;last=now;
  if(!active||document.hidden||reduced.matches)return;clock++;
  const shown=items.filter(x=>x._visible),others=shown.filter(x=>!x.closest('#cards'));
  const chosen=preferred?others.filter(x=>x.parentElement===preferred):others.slice(Math.floor(clock/64)%Math.max(1,others.length),Math.floor(clock/64)%Math.max(1,others.length)+2);
  for(const item of shown){if(!item.closest('#cards')&&!chosen.includes(item))continue;const frame=clock%48;item.style.backgroundPosition=`${frame%8/7*100}% ${Math.floor(frame/8)/5*100}%`;}
 }
 document.addEventListener('visibilitychange',syncVideos);reduced.addEventListener('change',syncVideos);
 requestAnimationFrame(tick);
 return {refresh,focus(button){preferred=button;clock=0;},setActive(value){active=value;preferred=null;syncVideos();}};
}
