import * as T from 'three';
import {sampleShore,smooth} from './turtle-shore-state.js';

// Adapter for Loggerhead 18.fbx only. Never changes bind matrices, hierarchy or bone lengths.
export function createTurtleShoreMotion(root,actor){
 const bones={},nodes=[],meshes=[];
 root.traverse(n=>{if(n.isBone)bones[n.name]=n;if(n.isBone||n.name==='loggerheadarmature')nodes.push({node:n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()});if(n.isSkinnedMesh)meshes.push(n);});
 const mesh=meshes[0],v=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),axis=new T.Vector3(),q=new T.Quaternion(),parentQ=new T.Quaternion();
 const limbs=[];let phase=0,restore=[],lastPosition=actor.position.clone(),activityTime=0,previousLand=null;
 function sync(){actor.updateMatrixWorld(true);meshes.forEach(m=>m.skeleton.update());}
 function vertex(index,out){mesh.getVertexPosition(index,out);return mesh.localToWorld(out);}
 const bodySamples=[],groups={};
 for(const kind of ['flipper','hind'])for(const side of ['left','right'])groups[`${kind}-${side}`]=[];
 const weights=mesh.geometry.attributes.skinWeight,indices=mesh.geometry.attributes.skinIndex,positions=mesh.geometry.attributes.position,seen=new Set();
 for(let i=0;i<positions.count;i++){
  const key=[positions.getX(i),positions.getY(i),positions.getZ(i)].map(x=>x.toFixed(3)).join(',');if(seen.has(key))continue;seen.add(key);
  let best=0,name='';for(let j=0;j<4;j++)if(weights.getComponent(i,j)>best){best=weights.getComponent(i,j);name=mesh.skeleton.bones[indices.getComponent(i,j)].name;}
  const group=Object.keys(groups).find(k=>name.startsWith(k));if(group)groups[group].push(i);else if(!name.startsWith('head')&&!name.startsWith('tail'))bodySamples.push(i);
 }
 function reduce(list,count){return list.filter((_,i)=>i%Math.max(1,Math.floor(list.length/count))===0);}
 const body=reduce(bodySamples,100);
 const normalSigns=new Map();root.updateWorldMatrix(true,true);
 for(const bone of Object.values(bones))normalSigns.set(bone,new T.Vector3(0,0,1).applyQuaternion(bone.getWorldQuaternion(new T.Quaternion())).y<0?-1:1);
 for(const kind of ['flipper','hind'])for(const [side,sign]of [['left',-1],['right',1]]){
  const prefix=`${kind}-${side}`,chain=(kind==='flipper'?['001','002','004','005']:['001','002','003']).map(s=>bones[prefix+s]);
  const samples=reduce(groups[prefix],60);limbs.push({kind,side,sign,chain,samples,anchor:null,stance:false,contactIndex:samples[0]});
 }
 function rotateWorld(bone,rotation){bone.parent.getWorldQuaternion(parentQ);q.copy(parentQ).invert().multiply(rotation).multiply(parentQ);bone.quaternion.premultiply(q);bone.updateWorldMatrix(false,true);}
 function aim(bone,child,direction){
  // Skin measurements show local Z is the thin axis of the paddle. Set its roll
  // explicitly so contact correction cannot leave a flipper standing on edge.
  const y=direction.applyQuaternion(actor.quaternion).normalize();
  const z=new T.Vector3(0,normalSigns.get(bone),0).addScaledVector(y,-y.y*normalSigns.get(bone)).normalize();
  const x=new T.Vector3().crossVectors(y,z).normalize();z.crossVectors(x,y);
  bone.parent.getWorldQuaternion(parentQ);
  bone.quaternion.copy(parentQ.invert().multiply(new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z))));
  bone.updateWorldMatrix(false,true);
 }
 function setLandPose(moving,nest){
  for(const n of nodes){n.node.position.copy(n.p);n.node.quaternion.copy(n.q);n.node.scale.copy(n.s);}root.updateWorldMatrix(true,true);
  const work=nest?.busy?nest.stage:'';activityTime=nest?.time||0;
  for(const limb of limbs){const {chain,kind,sign}=limb,p=(phase+(sign===1?.5:0)+(kind==='hind'?.12:0))%1;
   const stance=p<.64,stroke=stance?1-2*smooth(p/.64):-1+2*smooth((p-.64)/.36),lift=stance?0:Math.sin(Math.PI*(p-.64)/.36);
   const digging=kind==='hind'&&['dig','cover'].includes(work),sweep=kind==='flipper'&&['bodyPit','disguise'].includes(work);
   const workWave=Math.sin(activityTime*(digging?4:3)+sign*Math.PI/2);

   for(let j=0;j<chain.length;j++){
    const bone=chain[j],child=chain[j+1]||bone.children.find(n=>n.isBone);if(!child)continue;
    let direction;
    if(kind==='flipper')direction=new T.Vector3(sign*(j===0?1:.85),j===0?-.30:-.035,j===0?-.18:.28);
    else direction=new T.Vector3(sign*(j===0?.9:.65),j===0?-.32:-.035,.65);
    // Reach toward the head (-Z), plant, pull back past the shoulder,
    // then fold and recover. Distal joints follow instead of a rigid side sweep.
    if(moving){
     const reach=kind==='flipper'?.46:.22;
     direction.z-=stroke*reach*(j===0?1:.65);
     direction.x*=1-lift*(kind==='flipper'?.08:.06);
     direction.y+=lift*(j===0?.20:.08);
    }
    if(digging){direction.x*=.7+.4*workWave;direction.y+=.3*Math.max(0,workWave);direction.z+=.35*workWave;}
    if(sweep){direction.z+=.5*workWave;direction.y+=.15*Math.max(0,workWave);}
    aim(bone,child,direction);
   }
   limb.nextStance=stance&&moving&&!work;
  }
  // Small neck compensation keeps the head clear while shoulders carry the load.
  bones.head002.rotateX(moving?.012*Math.sin(phase*Math.PI*2):0);
 }
 function minGap(samples){let min=Infinity;for(const index of samples){vertex(index,v);min=Math.min(min,v.y-sampleShore(v.x,v.z).height);}return min;}
 function groundFlipper(limb,height){
  // Rotate at the shoulder/hip to support the lowest skin, not just the end bone.
  const axis=new T.Vector3(0,0,1).applyQuaternion(actor.quaternion),bone=limb.chain[0],baseQ=bone.quaternion.clone();
  for(let i=0;i<5;i++){
   sync();const gap=minGap(limb.samples),error=height-gap;if(Math.abs(error)<.003)break;
   const saved=bone.quaternion.clone();rotateWorld(bone,new T.Quaternion().setFromAxisAngle(axis,.015));sync();
   const derivative=(minGap(limb.samples)-gap)/.015;bone.quaternion.copy(saved);bone.updateWorldMatrix(false,true);
   if(Math.abs(derivative)<.05)break;
   rotateWorld(bone,new T.Quaternion().setFromAxisAngle(axis,T.MathUtils.clamp(error/derivative,-.08,.08)));const total=baseQ.angleTo(bone.quaternion);if(total>.25)bone.quaternion.slerpQuaternions(baseQ,bone.quaternion.clone(),.25/total);bone.updateWorldMatrix(false,true);
  }
 }
 function restoreSwim(){for(const n of restore){n.node.position.copy(n.p);n.node.quaternion.copy(n.q);n.node.scale.copy(n.s);}restore=[];root.rotation.set(0,0,0);}
 return {
  restore:restoreSwim,
  update(dt,land,moving,nest){
   const previousY=actor.position.y;
   const distance=Math.hypot(actor.position.x-lastPosition.x,actor.position.z-lastPosition.z);lastPosition.copy(actor.position);phase=(phase+distance/2.7)%1;
   restore=nodes.map(({node})=>({node,p:node.position.clone(),q:node.quaternion.clone(),s:node.scale.clone()}));
   const slope=sampleShore(actor.position.x,actor.position.z).slope;
   root.rotation.set(-slope*Math.cos(actor.rotation.y)*land,0,-slope*Math.sin(actor.rotation.y)*land);
   setLandPose(moving,nest);
   if(previousLand)for(let i=0;i<nodes.length;i++)nodes[i].node.quaternion.slerpQuaternions(previousLand[i],nodes[i].node.quaternion.clone(),1-Math.exp(-dt*22));
   previousLand=nodes.map(n=>n.node.quaternion.clone());sync();
   // Body support uses skinned underside samples, not rest bounds or a bone proxy.
   const groundCorrection=.055-minGap(body);actor.position.y+=groundCorrection;sync();
   const groundedY=actor.position.y;
   for(const limb of limbs){
    if(land<.98){limb.anchor=null;limb.stance=false;}
    if(!limb.stance){let lowest=Infinity;for(const index of limb.samples){vertex(index,v);if(v.y<lowest){lowest=v.y;limb.contactIndex=index;}}}
    vertex(limb.contactIndex,v);
    // Do not use unconstrained CCD on paddle bones: it folds the paddle through
    // the shell to chase an obsolete ground anchor. Keep the authored lateral
    // clearance and adjust only bounded shoulder/hip elevation below.
    const working=nest?.busy&&((limb.kind==='hind'&&['dig','cover'].includes(nest.stage))||(limb.kind==='flipper'&&['bodyPit','disguise'].includes(nest.stage)));
    const scoopLift=working?.16*Math.max(0,Math.sin(activityTime*(limb.kind==='hind'?4:3)+limb.sign*Math.PI/2)):0;
    groundFlipper(limb,moving&&!limb.nextStance?.035+.165*Math.sin(Math.PI*((phase+(limb.sign===1?.5:0)+(limb.kind==='hind'?.12:0))%1-.64)/.36)**2:.035+scoopLift);
    sync();vertex(limb.contactIndex,v);
    if(limb.nextStance&&!limb.stance)limb.anchor=v.clone();
    if(!limb.nextStance)limb.anchor=null;limb.stance=limb.nextStance;
   }
   // Keep sampled skin above terrain, including the recovery flipper edges.
   sync();const clearance=Math.min(minGap(body),...limbs.map(l=>minGap(l.samples)));
   actor.position.y+=Math.max(0,.012-clearance);
   const landY=actor.position.y;
   for(const n of restore){n.node.position.lerpVectors(n.p,n.node.position,land);n.node.quaternion.slerpQuaternions(n.q,n.node.quaternion.clone(),land);n.node.scale.lerpVectors(n.s,n.node.scale,land);}
   // Float at a fixed waterline. Offset comes from measured neutral body support.
   actor.position.y=landY+(1-land)*(-.58-sampleShore(actor.position.x,actor.position.z).height);
   sync();
   // The blended swimming paddle can reach lower than the solved land pose.
   // Enforce clearance after blending too, while crossing shallow water.
   const blendedGap=Math.min(minGap(body),...limbs.map(l=>minGap(l.samples)));
   if(blendedGap<.012){actor.position.y+=.012-blendedGap;sync();}
   // Settle after releasing support; a lifted paddle must not drop the body.
   if(dt>0&&actor.position.y<previousY-dt*2){actor.position.y=previousY-dt*2;sync();}
   this.contact={bodyGap:minGap(body),flipperGaps:limbs.map(l=>minGap(l.samples)),phase,groundedY};
  },
  contact:null,
  dispose(){restoreSwim();limbs.forEach(l=>l.anchor=null);}
 };
}
