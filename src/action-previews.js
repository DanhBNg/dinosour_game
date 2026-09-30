import {previewBounds} from './preview-framing.js';
// Offline-rendered alpha sprites; visible map cards all animate together.
export function framePreview(id,key){
 const [x0,y0,x1,y1]=previewBounds[id+'-'+key]||[.2,.2,.8,.8];
 const land=['trex','stego','trice','deino','brachio','elephant','gorilla','cow','wolf','slug'].includes(id);
 // Keep the complete animated silhouette centered horizontally; feet have a stable baseline.
 const scale=Math.min(1.28/(x1-x0),1.16/(y1-y0),5);
 const left=.5-(x0+x1)*scale/2,top=land?.98-y1*scale:.48-(y0+y1)*scale/2;
 return '--preview-anchor-x:'+((x0+x1)/2*100)+'%;--preview-anchor-y:'+((land?y1:(y0+y1)/2)*100)+'%;--preview-scale:'+scale*100+'%;--preview-left:'+left*100+'%;--preview-top:'+top*100+'%;';
}
export function previewMarkup(id,key){return '<span class="action-sprite" data-preview="'+id+'/'+key+'" style="'+framePreview(id,key)+'background-image:url(\'/assets/action-previews/'+id+'-'+key+'.webp\')" aria-hidden="true"></span>';}
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
  items=[...document.querySelectorAll('#action-picker [data-preview], #topic-hub [data-preview], #cards [data-preview], #home-screen [data-preview], #island [data-preview], #load-status [data-preview]')];
  videos=[...document.querySelectorAll('#cards video')];
  for(const item of [...items,...videos]){item._visible=false;observer.observe(item);}
  preferred=null;clock=0;
 }
 function tick(now){
  requestAnimationFrame(tick);if(now-last<100)return;last=now;
  if(!active||document.hidden||reduced.matches)return;clock++;
  // Every visible preview loops independently of hover/focus, without a held final frame.
  for(const item of items){if(!item._visible)continue;const count=Number(item.dataset.frames)||48,cols=Number(item.dataset.columns)||8,rows=Math.ceil(count/cols),frame=(clock+(item.dataset.preview.startsWith('loggerhead')?24:0))%count;item.style.backgroundPosition=`${frame%cols/(cols-1)*100}% ${Math.floor(frame/cols)/(rows-1)*100}%`;}

 }
 document.addEventListener('visibilitychange',syncVideos);reduced.addEventListener('change',syncVideos);
 requestAnimationFrame(tick);
 return {refresh,focus(button){preferred=button;clock=0;},setActive(value){active=value;preferred=null;syncVideos();}};
}
