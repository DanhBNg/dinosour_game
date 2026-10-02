export function createJoystick(host){
 host.innerHTML='<div class="joystick-arrows" aria-hidden="true">'
  + '<span class="joystick-arrow joystick-arrow-up"><svg viewBox="0 0 24 24"><polygon points="12,6 4,17 20,17"/></svg></span>'
  + '<span class="joystick-arrow joystick-arrow-right"><svg viewBox="0 0 24 24"><polygon points="18,12 7,4 7,20"/></svg></span>'
  + '<span class="joystick-arrow joystick-arrow-down"><svg viewBox="0 0 24 24"><polygon points="12,18 4,7 20,7"/></svg></span>'
  + '<span class="joystick-arrow joystick-arrow-left"><svg viewBox="0 0 24 24"><polygon points="6,12 17,4 17,20"/></svg></span>'
  + '</div><span class="joystick-thumb"></span>';
 host.setAttribute('aria-label','Cần điều khiển di chuyển');
 const thumb=host.querySelector('.joystick-thumb');
 const value={x:0,y:0};let pointer=null,center=null;
 function reset(){pointer=null;value.x=value.y=0;thumb.style.transform='translate(0,0)';host.removeAttribute('data-held');}
 function move(e){if(pointer!==e.pointerId)return;e.preventDefault();const dx=e.clientX-center.x,dy=e.clientY-center.y,d=Math.hypot(dx,dy),radius=34,factor=d>radius?radius/d:1;value.x=Math.abs(dx*factor)<3?0:dx*factor/radius;value.y=Math.abs(dy*factor)<3?0:dy*factor/radius;thumb.style.transform=`translate(${dx*factor}px,${dy*factor}px)`;}
 // offsetX/Y are in local CSS coordinates, including in the rotated app iframe.
 host.onpointerdown=e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;center={x:e.clientX-e.offsetX+host.clientWidth/2,y:e.clientY-e.offsetY+host.clientHeight/2};host.setPointerCapture(pointer);host.dataset.held='true';move(e);};host.onpointermove=move;
 host.onpointerup=host.onpointercancel=host.onlostpointercapture=e=>{if(e.pointerId===pointer)reset();};
 return {value,reset};
}
