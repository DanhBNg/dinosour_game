import {Vector3} from 'three';

const smooth=value=>{const phase=Math.max(0,Math.min(1,value));return phase*phase*(3-2*phase);};
export function createFeedingCamera(camera,controls,{reducedMotion=false}={}){
 let saved=null,cancelled=false;
 const close=new Vector3(),focus=new Vector3(),home=new Vector3(),homeTarget=new Vector3();
 function restore(player){
  if(!saved)return;
  camera.position.copy(player).add(saved.camera);controls.target.copy(player).add(saved.target);
  controls.enabled=saved.enabled;camera.lookAt(controls.target);saved=null;
 }
 return {
  update(time,duration,player,orientation,mouth){
   if(time===null){restore(player);cancelled=false;return false;}
   if(cancelled||reducedMotion)return false;
   if(!saved)saved={camera:camera.position.clone().sub(player),target:controls.target.clone().sub(player),enabled:controls.enabled};
   controls.enabled=false;
   const blend=smooth(time/.6)*(1-smooth((time-(duration-.6))/.6));
   close.set(2.8,1.25,-2.6).applyQuaternion(orientation).add(mouth);
   focus.copy(mouth);focus.y+=.08;
   home.copy(player).add(saved.camera);homeTarget.copy(player).add(saved.target);
   camera.position.lerpVectors(home,close,blend);controls.target.lerpVectors(homeTarget,focus,blend);camera.lookAt(controls.target);
   return true;
  },
  cancel(player){restore(player);cancelled=true;},
  reset(player){restore(player);cancelled=false;}
 };
}
