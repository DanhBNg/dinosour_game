const positions=[.43,.65,.42,.64,.40,.64,.42,.61];
let savedLeft=0,cleanup=()=>{};
export function stopOceanJourney(){cleanup();cleanup=()=>{};}
export function oceanJourneyMarkup(ids,preview,label){
 const width=ids.length*340+160;
 const points=ids.map((id,i)=>({id,x:220+i*340,y:positions[i%positions.length]*700}));
 const path=points.reduce((d,p,i)=>i?d+` C${p.x-185},${points[i-1].y} ${p.x-155},${p.y} ${p.x},${p.y}`:`M${p.x},${p.y}`,'');
 return `<div class="ocean-journey" style="--journey-width:${width}px"><div class="journey-scenery"></div><svg class="journey-trail" viewBox="0 0 ${width} 700" preserveAspectRatio="none" aria-hidden="true"><path class="trail-shadow" d="${path}"/><path class="trail-light" d="${path}"/></svg>${points.map((p,i)=>`<button class="map-pin journey-pin ${p.id}" style="--journey-x:${p.x}px;--journey-y:${positions[i%positions.length]*100}%" data-species="${p.id}" aria-label="${label(p.id)}"><span class="pin-orb">${preview(p.id)}</span><span class="journey-stop" aria-hidden="true">${i+1}</span></button>`).join('')}<span class="journey-end" aria-hidden="true">✧</span></div>`;
}
export function startOceanJourney(island){
 const nav=document.createElement('nav');nav.className='journey-navigation';nav.setAttribute('aria-label','Di chuyển bản đồ');nav.innerHTML='<button class="round" aria-label="Khám phá phía trước">‹</button><button class="round" aria-label="Khám phá tiếp">›</button>';island.parentElement.append(nav);
 const [prev,next]=nav.children;prev.onclick=()=>island.scrollBy({left:-island.clientWidth*.7,behavior:'smooth'});next.onclick=()=>island.scrollBy({left:island.clientWidth*.7,behavior:'smooth'});
 function scroll(){savedLeft=island.scrollLeft;prev.disabled=savedLeft<2;next.disabled=savedLeft+island.clientWidth>=island.scrollWidth-2;}
 let drag=null,moved=false;
 function down(e){if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:island.scrollLeft,id:e.pointerId};moved=false;}
 function move(e){if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>7){moved=true;island.setPointerCapture(e.pointerId);}if(moved){e.preventDefault();island.scrollLeft=drag.left-dx;}}
 function up(){drag=null;}
 function click(e){if(moved){e.preventDefault();e.stopPropagation();moved=false;}}
 function wheel(e){if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){const nextLeft=Math.max(0,Math.min(island.scrollWidth-island.clientWidth,island.scrollLeft+e.deltaY));if(nextLeft!==island.scrollLeft){e.preventDefault();island.scrollLeft=nextLeft;}}}
 island.addEventListener('scroll',scroll);island.addEventListener('pointerdown',down);island.addEventListener('pointermove',move);island.addEventListener('pointerup',up);island.addEventListener('pointercancel',up);island.addEventListener('click',click,true);island.addEventListener('wheel',wheel,{passive:false});
 island.scrollLeft=savedLeft;scroll();const observer=new ResizeObserver(scroll);observer.observe(island);
 cleanup=()=>{nav.remove();observer.disconnect();island.removeEventListener('scroll',scroll);island.removeEventListener('pointerdown',down);island.removeEventListener('pointermove',move);island.removeEventListener('pointerup',up);island.removeEventListener('pointercancel',up);island.removeEventListener('click',click,true);island.removeEventListener('wheel',wheel);};
}
