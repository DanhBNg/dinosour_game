import {Quaternion,Vector3} from 'three';
export const TURTLE_ACTIVITIES={boost:{duration:3,label:'Tăng tốc'},dive:{duration:1.6,label:'Lặn'},rise:{duration:1.6,label:'Nổi'},eat:{duration:2.4,label:'Ăn'}};
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function createTurtleActivities(base,root){
 const bones={};root.traverse(n=>{if(n.isBone)bones[n.name]=n;});let key='',time=0,pose=[],orientation=null,position=null,entry=[];
 const axis=new Vector3(),parentQ=new Quaternion(),rootQ=new Quaternion(),delta=new Quaternion(),pivot=new Vector3(),shift=new Vector3();
 function restore(){pose.forEach(([b,q])=>b.quaternion.copy(q));pose=[];if(orientation){root.quaternion.copy(orientation);root.position.copy(position);orientation=null;}}
 function rotate(name,x,y,z){const b=bones[name];if(!b)return;pose.push([b,b.quaternion.clone()]);const angle=Math.hypot(x,y,z);if(!angle)return;root.getWorldQuaternion(rootQ);b.parent.getWorldQuaternion(parentQ);axis.set(x,y,z).divideScalar(angle).applyQuaternion(rootQ).applyQuaternion(parentQ.invert());b.quaternion.premultiply(delta.setFromAxisAngle(axis,angle));b.updateWorldMatrix(false,true);}
 function apply(){const p=time/TURTLE_ACTIVITIES[key].duration,e=smooth(p/.2)*(1-smooth((p-.72)/.28));orientation=root.quaternion.clone();position=root.position.clone();root.updateWorldMatrix(true,true);bones.Main.getWorldPosition(pivot);root.worldToLocal(pivot);
  const pitch=key==='dive'?-.32*e:key==='rise'?.32*e:key==='boost'?-.055*e:-.1*e;root.rotateX(pitch);
  shift.copy(pivot).multiply(root.scale).applyQuaternion(orientation);root.position.add(shift);shift.copy(pivot).multiply(root.scale).applyQuaternion(root.quaternion);root.position.sub(shift);root.updateWorldMatrix(true,true);
  if(key==='eat'){
   const reach=smooth(p/.38)*(1-smooth((p-.65)/.35));const peck=Math.sin(Math.PI*Math.max(0,Math.min(1,(p-.35)/.32)))*e;
   rotate('Spine001',-.07*reach,0,0);rotate('head002',-.18*reach+.10*peck,0,0);rotate('head001',-.10*reach+.13*peck,0,0);
   rotate('flipper-left001',0,.09*e,-.12*e);rotate('flipper-right001',0,-.09*e,.12*e);rotate('hind-left001',.07*e,0,0);rotate('hind-right001',.07*e,0,0);
  }else{
   const thrust=key==='boost'?.18: .10;
   rotate('head002',-pitch*.35,0,0);rotate('head001',-pitch*.15,0,0);
   rotate('flipper-left001',-.05*e,-thrust*e,-.12*e);rotate('flipper-right001',-.05*e,thrust*e,.12*e);
   rotate('flipper-left002',0,.06*e,-.06*e);rotate('flipper-right002',0,-.06*e,.06*e);
   rotate('hind-left001',pitch*.35,0,-.06*e);rotate('hind-right001',pitch*.35,0,.06*e);rotate('tail001',pitch*.15,0,0);
  }
 }
 return {...base,get state(){return {...base.state,id:key||base.state.id};},play(next){restore();key=TURTLE_ACTIVITIES[next]?next:'';entry=key?Object.values(bones).map(b=>[b,b.quaternion.clone()]):[];time=0;return base.play(key?'clip0':next);},update(dt){if(base.state.paused)return;restore();const duration=TURTLE_ACTIVITIES[key]?.duration;const phase=duration?time/duration:0;const envelope=smooth(phase/.2)*(1-smooth((phase-.72)/.28));base.update(dt*(key==='boost'?1+1.3*envelope:key==='eat'?.4:1));if(key){time=(time+Math.min(dt,.05)*base.state.speed)%duration;if(entry.length){const blend=smooth(time/.25);for(const [bone,q]of entry)bone.quaternion.slerpQuaternions(q,bone.quaternion.clone(),blend);if(blend>=1)entry=[];}apply();}},get progress(){return key?time/TURTLE_ACTIVITIES[key].duration:base.progress;},dispose(){restore();base.dispose();}};
}
