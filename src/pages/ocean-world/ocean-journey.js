export const oceanDestinations={loggerhead:[10,42],tuna:[21,70],shark:[33,30],fish:[44,58],seal:[59,34],squid:[68,65],slug:[83,31],amplectobelua:[92,73]};
let savedLeft=0,cleanup=()=>{};
export function stopOceanJourney(){cleanup();cleanup=()=>{};}
export function oceanJourneyMarkup(ids,preview,label){
 const pts=ids.map(id=>oceanDestinations[id]);const path=pts.reduce((d,p,i)=>i?d+' C'+((pts[i-1][0]+p[0])/2)+','+pts[i-1][1]+' '+((pts[i-1][0]+p[0])/2)+','+p[1]+' '+p[0]+','+p[1]:'M'+p[0]+','+p[1],'');
 const links='<svg class="journey-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="trail-shadow" d="'+path+'"/><path class="trail-light" d="'+path+'"/></svg>';

 const unlocked=new Set(['loggerhead','tuna']);
 return `<div class="ocean-journey"><img class="journey-map-image" src="/assets/worlds/ocean-destinations.png" alt="Bản đồ các vùng khám phá: cỏ biển, bãi cát, đảo đá, rạn san hô và biển sâu" draggable="false">${links}${ids.map(id=>{const [x,y]=oceanDestinations[id];const isLocked=!unlocked.has(id);const lockBadge=isLocked?'<i class="badge-lock" aria-hidden="true">🔒</i>':'';return `<button class="map-pin journey-pin ${id} ${isLocked?'locked':'available'}" style="--journey-x:${x}%;--journey-y:${y}%" data-species="${id}" aria-label="${label(id)}"><span class="pin-orb">${preview(id)}${lockBadge}</span></button>`;}).join('')}</div>`;
}
export function startOceanJourney(island){
 const nav=document.createElement('nav');nav.className='journey-navigation';nav.setAttribute('aria-label','Di chuyển bản đồ');nav.innerHTML='<button class="round" aria-label="Khám phá phía trước">‹</button><button class="round" aria-label="Khám phá tiếp">›</button>';island.parentElement.append(nav);
 const [prev,next]=nav.children;prev.onclick=()=>island.scrollBy({left:-island.clientWidth*.65,behavior:'smooth'});next.onclick=()=>island.scrollBy({left:island.clientWidth*.65,behavior:'smooth'});
 function scroll(){savedLeft=island.scrollLeft;prev.disabled=savedLeft<2;next.disabled=savedLeft+island.clientWidth>=island.scrollWidth-2;}
 function wheel(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){const left=Math.max(0,Math.min(island.scrollWidth-island.clientWidth,island.scrollLeft+e.deltaY));if(left!==island.scrollLeft){e.preventDefault();island.scrollLeft=left;}}}
 const art=island.querySelector('.journey-map-image'),board=island.querySelector('.ocean-journey');
 function fit(){const ratio=art.naturalWidth/art.naturalHeight||3;const h=island.clientHeight;const w=Math.max(island.clientWidth,Math.round(h*ratio));const finalH=Math.max(h,Math.round(w/ratio));board.style.width=w+'px';board.style.height=finalH+'px';scroll();}
 // Fit from native image dimensions; no cover crop or nonuniform stretching.
 const restoreLeft=savedLeft;art.addEventListener('load',fit);fit();island.scrollLeft=restoreLeft;
 island.addEventListener('scroll',scroll);island.addEventListener('wheel',wheel,{passive:false});const observer=new ResizeObserver(fit);observer.observe(island);
 cleanup=()=>{nav.remove();observer.disconnect();art.removeEventListener('load',fit);island.removeEventListener('scroll',scroll);island.removeEventListener('wheel',wheel);};
}
