import {Quaternion,Vector3} from 'three';
export const TURTLE_TURN_DURATION=4.2;
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*x*(x*(x*6-15)+10);};
const pulse=(t,a,b)=>t<=a||t>=b?0:Math.sin(Math.PI*(t-a)/(b-a))**2;
export function createTurtleTurnActions(base,root){
 const bones={};root.traverse(n=>{if(n.isBone)bones[n.name]=n;});
 let turning=false,time=0,pose=[],origin=null,entry=[];
 const axis=new Vector3(),parentQ=new Quaternion(),rootQ=new Quaternion(),q=new Quaternion();
 function restore(){for(const [bone,rotation]of pose)bone.quaternion.copy(rotation);pose=[];if(origin){root.quaternion.copy(origin);origin=null;}}
 function rotate(name,x,y,z){const bone=bones[name];if(!bone)return;pose.push([bone,bone.quaternion.clone()]);const angle=Math.hypot(x,y,z);if(!angle)return;root.getWorldQuaternion(rootQ);bone.parent.getWorldQuaternion(parentQ);axis.set(x,y,z).divideScalar(angle).applyQuaternion(rootQ).applyQuaternion(parentQ.invert());q.setFromAxisAngle(axis,angle);bone.quaternion.premultiply(q);bone.updateWorldMatrix(false,true);}
 function apply(t){
  origin=root.quaternion.clone();const envelope=smooth(t/.45)*(1-smooth((t-3.35)/.85)),drive=pulse(t,.45,1.55)+pulse(t,1.65,2.85),brake=pulse(t,3,3.9);
  root.rotateY(2*Math.PI*smooth((t-.4)/3.35));root.rotateZ(.11*envelope);root.updateWorldMatrix(true,true);
  rotate('head002',-.035*envelope,.24*pulse(t,0,3.6),0);rotate('head001',0,.09*pulse(t,.15,3.65),0);
  rotate('flipper-left001',0,-.22*drive,.24*drive-.10*brake);rotate('flipper-left002',0,.09*drive,.10*pulse(t,.65,3));
  rotate('flipper-right001',0,.12*drive,-.12*drive+.18*brake);rotate('flipper-right002',0,-.05*drive,-.08*pulse(t,.85,3.2));
  rotate('hind-left001',0,.16*envelope,.09*brake);rotate('hind-right001',0,.13*envelope,-.12*brake);rotate('tail001',0,.10*pulse(t,.6,3.85),0);
 }
 return {...base,play(key){restore();turning=key==='turn360';entry=turning?Object.values(bones).map(b=>[b,b.quaternion.clone()]):[];time=0;return base.play(turning?'clip0':key);},get state(){return {...base.state,id:turning?'turn360':base.state.id};},update(dt){if(base.state.paused)return;restore();base.update(turning?dt*(3.5/TURTLE_TURN_DURATION):dt);if(turning){time=(time+Math.min(dt,.05)*base.state.speed)%TURTLE_TURN_DURATION;if(entry.length){const blend=smooth(time/.35);for(const [bone,rotation]of entry)bone.quaternion.slerpQuaternions(rotation,bone.quaternion.clone(),blend);if(blend===1)entry=[];}apply(time);}},get progress(){return turning?time/TURTLE_TURN_DURATION:base.progress;},dispose(){restore();base.dispose();}};
}
