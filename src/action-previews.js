// Offline-rendered alpha sprites: one image per action, no extra WebGL contexts.
export function previewMarkup(id,key){return `<span class="action-sprite" data-preview="${id}/${key}" style="background-image:url('assets/action-previews/${id}-${key}.webp')" aria-hidden="true"></span>`;}
export function createActionPreviews(){
 let active=false,items=[],preferred=null,last=0,clock=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const observer=new IntersectionObserver(entries=>{for(const e of entries)e.target._visible=e.isIntersecting&&e.intersectionRatio>.55;},{threshold:.55});
 function refresh(){observer.disconnect();items=[...document.querySelectorAll('#action-picker [data-preview], #topic-hub [data-preview]')];for(const item of items){item._visible=false;observer.observe(item);}preferred=null;clock=0;}
 function tick(now){requestAnimationFrame(tick);if(now-last<100)return;last=now;if(!active||document.hidden||reduced.matches)return;clock++;const shown=items.filter(x=>x._visible);const chosen=preferred?shown.filter(x=>x.parentElement===preferred):shown.slice(Math.floor(clock/64)%Math.max(1,shown.length),Math.floor(clock/64)%Math.max(1,shown.length)+2);for(const item of items){const frame=chosen.includes(item)?clock%48:0;item.style.backgroundPosition=`${frame%8/7*100}% ${Math.floor(frame/8)/5*100}%`;}}
 requestAnimationFrame(tick);
 return {refresh,focus(button){preferred=button;clock=0;},setActive(value){active=value;preferred=null;}};
}
