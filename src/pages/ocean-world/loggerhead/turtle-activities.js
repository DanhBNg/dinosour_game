import {Quaternion,Vector3} from 'three';
import {EAT_DURATION,turtleEatPose,createTurtleJaw} from './eating.js';
export const TURTLE_ACTIVITIES={boost:{duration:3,label:'Tăng tốc'},dive:{duration:1.6,label:'Lặn'},rise:{duration:1.6,label:'Nổi'},eat:{duration:EAT_DURATION,label:'Ăn'},ram:{duration:.65,label:'Húc'},bite:{duration:.85,label:'Cắn'},shield:{duration:.7,label:'Mai chắn'}};
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function createTurtleActivities(base,root){
 const bones={};root.traverse(n=>{if(n.isBone)bones[n.name]=n;});let key='',time=0,pose=[],orientation=null,position=null,entry=[];
 const axis=new Vector3(),parentQ=new Quaternion(),rootQ=new Quaternion(),delta=new Quaternion(),pivot=new Vector3(),shift=new Vector3();
 const jaw=createTurtleJaw(root);
 const mouthBase=new Vector3(),mouthForward=new Vector3();
 let depthHeld=false;
 function restore(){jaw.set(0);pose.forEach(([b,q])=>b.quaternion.copy(q));pose=[];if(orientation){root.quaternion.copy(orientation);root.position.copy(position);orientation=null;}}
 function rotate(name,x,y,z){const b=bones[name];if(!b)return;pose.push([b,b.quaternion.clone()]);const angle=Math.hypot(x,y,z);if(!angle)return;root.getWorldQuaternion(rootQ);b.parent.getWorldQuaternion(parentQ);axis.set(x,y,z).divideScalar(angle).applyQuaternion(rootQ).applyQuaternion(parentQ.invert());b.quaternion.premultiply(delta.setFromAxisAngle(axis,angle));b.updateWorldMatrix(false,true);}
 function apply(){const p=time/TURTLE_ACTIVITIES[key].duration,e=depthHeld&&(key==='dive'||key==='rise')?1:smooth(p/.2)*(1-smooth((p-.72)/.28));orientation=root.quaternion.clone();position=root.position.clone();root.updateWorldMatrix(true,true);bones.Main.getWorldPosition(pivot);root.worldToLocal(pivot);
  const pitch=key==='dive'?-.32*e:key==='rise'?.32*e:key==='boost'?-.055*e:-.1*e;root.rotateX(pitch);
  shift.copy(pivot).multiply(root.scale).applyQuaternion(orientation);root.position.add(shift);shift.copy(pivot).multiply(root.scale).applyQuaternion(root.quaternion);root.position.sub(shift);root.updateWorldMatrix(true,true);
  if(key==='eat'){
   const {reach,bite,chew,swallow,jaw:opening}=turtleEatPose(time);
   rotate('Spine001',-.12*reach+.09*swallow,0,0);rotate('head002',-.26*reach+.16*bite*e+.12*swallow,0,.035*chew);
   rotate('head001',-.16*reach+.26*chew+.27*swallow,0,0);
   jaw.set(opening);
   rotate('flipper-left001',0,.09*e,-.12*e);rotate('flipper-right001',0,-.09*e,.12*e);rotate('hind-left001',.07*e,0,0);rotate('hind-right001',.07*e,0,0);
  }else if(key==='ram'||key==='bite'||key==='shield'){
   const thrust=Math.sin(Math.PI*p);
   rotate('Spine001',(key==='shield'?.16:-.18)*thrust,0,0);
   rotate('head002',(key==='shield'?.28:-.25)*thrust,0,0);
   rotate('head001',(key==='bite'?-.2:.12)*thrust,0,0);
   rotate('flipper-left001',0,.25*thrust,-.25*thrust);rotate('flipper-right001',0,-.25*thrust,.25*thrust);
   if(key==='bite')jaw.set(Math.sin(Math.PI*Math.min(1,p/.7))*.9);
  }else{
   const thrust=key==='boost'?.18: .10;
   rotate('head002',-pitch*.35,0,0);rotate('head001',-pitch*.15,0,0);
   rotate('flipper-left001',-.05*e,-thrust*e,-.12*e);rotate('flipper-right001',-.05*e,thrust*e,.12*e);
   rotate('flipper-left002',0,.06*e,-.06*e);rotate('flipper-right002',0,-.06*e,.06*e);
   rotate('hind-left001',pitch*.35,0,-.06*e);rotate('hind-right001',pitch*.35,0,.06*e);rotate('tail001',pitch*.15,0,0);
  }
 }
 return {...base,setDepthHeld(value){depthHeld=value;},getMouthPosition(out,showPrey=false){root.updateWorldMatrix(true,true);const tip=bones.head001_end||bones.head001;if(!tip)return root.getWorldPosition(out);tip.getWorldPosition(out);bones.head001.getWorldPosition(mouthBase);mouthForward.copy(out).sub(mouthBase);const length=mouthForward.length();out.y-=length*.18;if(showPrey&&key==='eat')out.addScaledVector(mouthForward,turtleEatPose(time).mouthOffset);return out;},get state(){return {...base.state,id:key||base.state.id};},play(next){restore();key=TURTLE_ACTIVITIES[next]?next:'';entry=key?Object.values(bones).map(b=>[b,b.quaternion.clone()]):[];time=0;return base.play(key?'clip0':next);},update(dt){if(base.state.paused)return;restore();const duration=TURTLE_ACTIVITIES[key]?.duration;const phase=duration?time/duration:0;const envelope=smooth(phase/.2)*(1-smooth((phase-.72)/.28));base.update(dt*(key==='boost'?1+1.3*envelope:key==='eat'?.4:1));if(key){time=(time+Math.min(dt,.05)*base.state.speed)%duration;if(entry.length){const blend=smooth(time/.25);for(const [bone,q]of entry)bone.quaternion.slerpQuaternions(q,bone.quaternion.clone(),blend);if(blend>=1)entry=[];}apply();}},get progress(){return key?time/TURTLE_ACTIVITIES[key].duration:base.progress;},dispose(){restore();jaw.dispose();base.dispose();}};
}
