// Handle touch explicitly: native pan-x uses the physical screen's axis when
// the app's landscape iframe is rotated in a portrait browser.
export function createMapPan(element){
 let drag=null,suppress=false;
 function down(e){if(drag||e.button!==0)return;suppress=false;drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:element.scrollLeft,top:element.scrollTop};}
 function move(e){if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>7){suppress=true;element.setPointerCapture(e.pointerId);}if(suppress){e.preventDefault();element.scrollLeft=drag.left-dx;element.scrollTop=drag.top-dy;}}
 function up(e){if(drag?.id===e.pointerId)drag=null;}
 function click(e){if(suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false;}}
 const handlers={pointerdown:down,pointermove:move,pointerup:up,pointercancel:up,lostpointercapture:e=>{if(e.target===element)up(e);}};
 for(const [name,fn]of Object.entries(handlers))element.addEventListener(name,fn);element.addEventListener('click',click,true);
 return ()=>{for(const [name,fn]of Object.entries(handlers))element.removeEventListener(name,fn);element.removeEventListener('click',click,true);};
}
