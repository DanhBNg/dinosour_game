export function createHoldActions(trigger){
 const held=new Map(),bindings=[];
 function press(source,action){if(held.has(source))return;held.set(source,action);trigger(action);}
 function release(source){held.delete(source);}
 function reset(){
  held.clear();
  for(const {button,pointers} of bindings){
   for(const pointer of pointers)if(button.hasPointerCapture(pointer))button.releasePointerCapture(pointer);
   pointers.clear();
  }
 }
 return {
  press,release,reset,
  get action(){return [...held.values()].at(-1);},
  repeat(){const action=this.action;if(action)trigger(action);},
  bind(button,action){
   const pointers=new Set();
   const down=event=>{
    if(event.button!==0||button.disabled)return;
    event.preventDefault();button.setPointerCapture(event.pointerId);pointers.add(event.pointerId);
    press(`pointer:${event.pointerId}`,action);
   };
   const up=event=>{
    release(`pointer:${event.pointerId}`);pointers.delete(event.pointerId);
    if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);
   };
   const click=event=>{if(event.detail===0&&!button.disabled)trigger(action);};
   const handlers={pointerdown:down,pointerup:up,pointercancel:up,lostpointercapture:up,click};
   for(const [name,handler]of Object.entries(handlers))button.addEventListener(name,handler);
   bindings.push({button,pointers,handlers});
  },
  dispose(){reset();for(const {button,handlers}of bindings)for(const [name,handler]of Object.entries(handlers))button.removeEventListener(name,handler);bindings.length=0;}
 };
}
