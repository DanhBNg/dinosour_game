import {Quaternion,Vector3} from 'three';
export const TURTLE_TURN_DURATION=4.2;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*x*(x*(x*6-15)+10);};
const pulse=(t,a,b)=>t<=a||t>=b?0:Math.sin(Math.PI*(t-a)/(b-a))**2;
export function createTurtleTurnActions(base,root){
 const bones={};root.traverse(n=>{if(n.isBone)bones[n.name]=n;});
 let turning=false,time=0,pose=[],origin=null,originPosition=null,entry=[];
 const pivot=new Vector3(),shift=new Vector3();
 const axis=new Vector3(),parentQ=new Quaternion(),rootQ=new Quaternion(),q=new Quaternion();
 function restore(){for(const [bone,rotation]of pose)bone.quaternion.copy(rotation);pose=[];if(origin){root.quaternion.copy(origin);root.position.copy(originPosition);origin=null;}}
 function rotate(name,x,y,z){const bone=bones[name];if(!bone)return;pose.push([bone,bone.quaternion.clone()]);const angle=Math.hypot(x,y,z);if(!angle)return;root.getWorldQuaternion(rootQ);bone.parent.getWorldQuaternion(parentQ);axis.set(x,y,z).divideScalar(angle).applyQuaternion(rootQ).applyQuaternion(parentQ.invert());q.setFromAxisAngle(axis,angle);bone.quaternion.premultiply(q);bone.updateWorldMatrix(false,true);}
 function apply(t){
  origin=root.quaternion.clone();originPosition=root.position.clone();root.updateWorldMatrix(true,true);
  // Roll around the shell center, not the root below the swimming model.
  bones.Main.getWorldPosition(pivot);root.worldToLocal(pivot);
  const prepare=pulse(t,0,.8),drive=pulse(t,.3,1.25),tuck=smooth((t-.75)/.55)*(1-smooth((t-2.85)/.55)),brake=pulse(t,2.9,4.15);
  root.rotateZ(-.09*prepare+2*Math.PI*smooth((t-.5)/3.15));
  shift.copy(pivot).multiply(root.scale).applyQuaternion(origin);root.position.add(shift);
  shift.copy(pivot).multiply(root.scale).applyQuaternion(root.quaternion);root.position.sub(shift);root.updateWorldMatrix(true,true);
  // Asymmetric front-flipper stroke initiates roll; tuck reduces drag,
  // rear flippers counter-steer and both fronts open to brake the roll.
  rotate('head002',.09*tuck,0,-.06*drive+.04*brake);rotate('head001',-.035*tuck,0,-.025*drive);
  rotate('flipper-left001',0,-.15*tuck,.30*drive-.20*tuck-.17*brake);
  rotate('flipper-right001',0,.15*tuck,.23*drive+.20*tuck+.17*brake);
  rotate('flipper-left002',0,.06*tuck,-.13*tuck+.08*brake);
  rotate('flipper-right002',0,-.06*tuck,.13*tuck-.08*brake);
  rotate('hind-left001',0,.05*tuck,.12*drive-.13*brake);
  rotate('hind-right001',0,-.05*tuck,.08*drive-.10*brake);
  rotate('tail001',0,0,-.07*pulse(t,.65,3.7));
 }
 return {...base,play(key){restore();turning=key==='turn360';entry=turning?Object.values(bones).map(b=>[b,b.quaternion.clone()]):[];time=0;return base.play(turning?'clip0':key);},get state(){return {...base.state,id:turning?'turn360':base.state.id};},update(dt){if(base.state.paused)return;restore();base.update(turning?dt*(3.5/TURTLE_TURN_DURATION):dt);if(turning){time=(time+Math.min(dt,.05)*base.state.speed)%TURTLE_TURN_DURATION;if(entry.length){const blend=smooth(time/.35);for(const [bone,rotation]of entry)bone.quaternion.slerpQuaternions(rotation,bone.quaternion.clone(),blend);if(blend===1)entry=[];}apply(time);}},get progress(){return turning?time/TURTLE_TURN_DURATION:base.progress;},dispose(){restore();base.dispose();}};
}
