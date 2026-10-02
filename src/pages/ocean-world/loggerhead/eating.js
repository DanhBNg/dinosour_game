import {Box3,Vector3,Mesh,SphereGeometry,MeshBasicMaterial,Quaternion} from 'three';

export const EAT_DURATION=3.8;
const smooth=value=>{const phase=Math.max(0,Math.min(1,value));return phase*phase*(3-2*phase);};
export function turtleEatPose(time){
 const reach=smooth(time/.65)*(1-smooth((time-2.8)/.8));
 const bite=smooth((time-.65)/.25);
 const chewing=time>=1.05&&time<2.65;
 const chew=chewing?Math.pow(Math.sin((time-1.05)/1.6*Math.PI*3),2):0;
 const swallow=Math.sin(Math.PI*smooth((time-2.65)/.65));
 const jaw=time<1.05?smooth(time/.45)*(1-smooth((time-.8)/.25)):.65*chew;
 const preyScale=time<2.65?1-.22*smooth((time-.9)/.3)+.08*chew:Math.max(.02,.78*(1-smooth((time-2.65)/.5)));
 const mouthOffset=(.36+.12*chew)*(1-smooth((time-2.65)/.5));
 return {reach,bite,chew,swallow,jaw,preyScale,mouthOffset,swallowed:time>=3.15,phase:time<.65?'approach':time<1.05?'bite':time<2.65?'chew':time<3.3?'swallow':'settle'};
}

export function createTurtleJaw(root){
 const targets=[];
 root.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  const existing=mesh.geometry.morphAttributes.position?.findIndex(attribute=>attribute.name==='feeding-jaw')??-1;
  if(existing>=0){targets.push({mesh,index:existing});return;}
  const headIndex=mesh.skeleton.bones.findIndex(bone=>bone.name==='head001');if(headIndex<0)return;
  const {position,skinIndex,skinWeight}=mesh.geometry.attributes;if(!skinIndex||!skinWeight)return;
  const weights=new Float32Array(position.count),bounds=new Box3(),point=new Vector3();
  for(let index=0;index<position.count;index++){
   for(let slot=0;slot<4;slot++)if(skinIndex.getComponent(index,slot)===headIndex)weights[index]+=skinWeight.getComponent(index,slot);
   if(weights[index]>.4)bounds.expandByPoint(point.fromBufferAttribute(position,index).applyMatrix4(mesh.bindMatrix));
  }
  if(bounds.isEmpty())return;
  const size=bounds.getSize(new Vector3()),center=bounds.getCenter(new Vector3()),morph=position.clone();
  if(size.y<1e-6||size.z<1e-6)return;
  const original=mesh.geometry.morphAttributes.position||[],relative=mesh.geometry.morphTargetsRelative;
  for(let index=0;index<position.count;index++){
   point.fromBufferAttribute(position,index).applyMatrix4(mesh.bindMatrix);
   const lower=1-smooth((point.y-(center.y-size.y*.18))/(size.y*.25));
   const front=smooth((bounds.max.z-point.z)/size.z);
   point.y-=size.y*.72*lower*front*weights[index];
   point.z+=size.z*.07*lower*front*weights[index];
   point.applyMatrix4(mesh.bindMatrixInverse);
   if(relative)point.sub(new Vector3().fromBufferAttribute(position,index));
   morph.setXYZ(index,point.x,point.y,point.z);
  }
  morph.name='feeding-jaw';mesh.geometry.morphAttributes.position=[...original,morph];
  const previous=[...(mesh.morphTargetInfluences||[])];mesh.updateMorphTargets();previous.forEach((value,index)=>mesh.morphTargetInfluences[index]=value);
  targets.push({mesh,index:original.length});
 });
 const head=root.getObjectByName('head001'),tip=root.getObjectByName('head001_end');
 const cavity=new Mesh(new SphereGeometry(1,16,8),new MeshBasicMaterial({color:0x30221d,transparent:true}));
 cavity.name='feeding-mouth-interior';cavity.visible=false;root.add(cavity);
 const start=new Vector3(),end=new Vector3(),forward=new Vector3(),scale=new Vector3(),rotation=new Quaternion(),parentRotation=new Quaternion();
 const facing=new Vector3(0,0,-1);
 return {
  set(amount){
   for(const target of targets)target.mesh.morphTargetInfluences[target.index]=amount;
   cavity.visible=amount>.02&&!!head&&!!tip;
   if(!cavity.visible)return;
   root.updateWorldMatrix(true,true);head.getWorldPosition(start);tip.getWorldPosition(end);
   forward.copy(end).sub(start);const length=forward.length();forward.normalize();
   end.addScaledVector(forward,length*.06);end.y-=length*(.14+amount*.08);
   cavity.position.copy(root.worldToLocal(end));root.getWorldScale(scale);
   cavity.scale.set(length*.46/scale.x,length*.27*amount/scale.y,length*.09/scale.z);
   root.getWorldQuaternion(parentRotation);rotation.setFromUnitVectors(facing,forward);
   cavity.quaternion.copy(parentRotation.invert().multiply(rotation));cavity.material.opacity=Math.min(1,amount*5);
  },
  dispose(){this.set(0);cavity.removeFromParent();cavity.geometry.dispose();cavity.material.dispose();}
 };
}
