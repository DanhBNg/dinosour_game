import * as T from 'three';
import {loadMarine} from '../../pages/ocean-world/marine.js';

export function createBossModel(mesh,parent){
 const body=new T.Group();body.name='survival-shark-boss';parent.add(body);
 const blue=0x426e8a,ivory=0xe2eee7;
 const proceduralMeshes=[];
 function ellipsoid(name,position,scale,color,owner=body){
  const part=mesh(new T.SphereGeometry(1,24,16),color,owner);
  part.name=name;part.position.set(...position);part.scale.set(...scale);
  part.material.flatShading=false;part.material.roughness=.38;
  proceduralMeshes.push(part);
  return part;
 }
 function fin(name,points,thickness,color,owner=body){
  const outline=points.map(point=>new T.Vector3(...point));
  const center=outline.reduce((sum,point)=>sum.add(point),new T.Vector3()).divideScalar(outline.length);
  const normal=new T.Vector3().subVectors(outline[1],outline[0]).cross(new T.Vector3().subVectors(outline[2],outline[0])).normalize().multiplyScalar(thickness);
  const vertices=[];
  for(let index=0;index<outline.length;index++){
   const next=(index+1)%outline.length;
   for(const point of [outline[index],outline[next],center.clone().add(normal),outline[next],outline[index],center.clone().sub(normal)])vertices.push(...point.toArray());
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();
  const part=mesh(geometry,color,owner);part.name=name;part.material.side=T.DoubleSide;
  proceduralMeshes.push(part);
  return part;
 }
 const profile=[[-3.7,.12],[-3.2,.24],[-2.5,.48],[-1.7,.85],[-.7,1.13],[.4,1.2],[1.35,1.03],[2,.72],[2.55,.38],[2.75,0]];
 const geometry=new T.LatheGeometry(profile.map(([length,radius])=>new T.Vector2(radius,length)),48);
 geometry.rotateX(Math.PI/2);geometry.scale(1,.82,1);
 const colors=[],normals=geometry.getAttribute('normal'),upper=new T.Color(blue),lower=new T.Color(ivory);
 for(let index=0;index<normals.count;index++){
  const blend=T.MathUtils.smoothstep(-normals.getY(index),.05,.55);
  colors.push(...upper.clone().lerp(lower,blend).toArray());
 }
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
 const skin=mesh(geometry,0xffffff,body);skin.name='shark-skin';skin.material.vertexColors=true;skin.material.flatShading=false;skin.material.roughness=.42;skin.material.metalness=.08;
 proceduralMeshes.push(skin);
 ellipsoid('shark-snout',[0,.04,2.18],[.76,.36,.7],blue);
 const mouth=ellipsoid('shark-mouth',[0,-.29,2.48],[.65,.32,.28],0x142636);
 const jaw=new T.Group();jaw.name='shark-jaw';jaw.position.set(0,-.27,1.55);body.add(jaw);
 ellipsoid('shark-lower-jaw',[0,-.23,.63],[.65,.18,.73],ivory,jaw);
 ellipsoid('shark-inner-jaw',[0,-.09,.68],[.53,.04,.58],0x334652,jaw);
 for(let index=0;index<11;index++){
  const fraction=(index-5)/5,forward=2.51+.21*(1-fraction*fraction);
  const height=.16+(1-Math.abs(fraction))*.12;
  const upperTooth=mesh(new T.ConeGeometry(.073,height,3),0xfff9df,body);
  upperTooth.position.set(fraction*.57,-.17,forward);upperTooth.rotation.z=Math.PI;upperTooth.rotation.y=index*.23;
  const lowerTooth=mesh(new T.ConeGeometry(.063,height*.8,3),0xfff9df,jaw);
  lowerTooth.position.set(fraction*.52,-.015,forward-1.6);lowerTooth.rotation.y=index*.23;
  proceduralMeshes.push(upperTooth,lowerTooth);
 }
 const pectorals=[];
 for(const side of [-1,1]){
  ellipsoid('shark-eye-socket',[side*.78,.23,1.88],[.22,.19,.2],0x294b61);
  ellipsoid('shark-eye',[side*.9,.25,1.97],[.095,.115,.12],0x071b28).material.roughness=.12;
  ellipsoid('shark-eye-glint',[side*.96,.29,2.01],[.024,.029,.026],0xffffff);
  ellipsoid('shark-nostril',[side*.42,.08,2.69],[.085,.035,.02],0x223c4b);
  for(let index=0;index<5;index++){
   const length=.75-index*.22,width=1.13+index*.008;
   const curve=new T.CatmullRomCurve3([new T.Vector3(side*width,.36,length),new T.Vector3(side*(width+.045),.04,length-.09),new T.Vector3(side*(width-.09),-.35,length-.03)]);
   const gill=mesh(new T.TubeGeometry(curve,8,.025,4,false),0x234352,body);gill.name='shark-gill';
   proceduralMeshes.push(gill);
  }
  const flipper=new T.Group();flipper.position.set(side*.94,-.38,.15);body.add(flipper);
  fin('shark-pectoral-fin',[[0,0,.5],[side*.9,-.12,-.15],[side*1.9,-.48,-1.6],[side*.7,-.1,-1],[0,0,-.7]],.09,blue,flipper);pectorals.push(flipper);
  fin('shark-pelvic-fin',[[side*.52,-.4,-1.7],[side*1.1,-.55,-2.55],[side*.38,-.42,-2.25]],.06,blue);
 }
 fin('shark-dorsal-fin',[[0,.77,.1],[0,2.35,-.75],[0,1.4,-.8],[0,.7,-1.75]],.14,0x365c78);
 fin('shark-rear-dorsal',[[0,.42,-2.05],[0,.96,-2.48],[0,.23,-2.8]],.065,blue);
 const tail=new T.Group();tail.name='shark-tail';tail.position.z=-3.3;body.add(tail);
 ellipsoid('shark-tail-stock',[0,0,-.12],[.2,.2,.56],blue,tail);
 fin('shark-caudal-fin',[[0,0,.15],[0,.6,-.55],[0,1.95,-1.65],[0,1.23,-1.64],[0,.22,-.95],[0,-.18,-.85],[0,-1.45,-1.55],[0,-1.05,-.85],[0,-.32,-.1]],.13,blue,tail);

 let realShark=null;
 if(typeof window!=='undefined'){
  loadMarine('shark').then(res=>{
   realShark=res.model;
   realShark.name='realistic-great-white-shark';
   realShark.rotation.y=-Math.PI/2;
   realShark.scale.setScalar(1.35);
   body.add(realShark);
   proceduralMeshes.forEach(part=>{part.visible=false;});
  }).catch(()=>{});
 }

 return {body,update(time,warning){
  tail.rotation.y=Math.sin(time*3.8)*.3;
  pectorals.forEach((flipper,index)=>flipper.rotation.z=Math.sin(time*2.4+index*Math.PI)*.055);
  jaw.rotation.x=warning?.48:.12+Math.sin(time*2)*.035;
  mouth.scale.y=warning?.45:.32;
  skin.material.emissive.setHex(warning?0x55262a:0x000000);skin.material.emissiveIntensity=warning?.2:0;

  if(realShark){
   realShark.rotation.set(0,-Math.PI/2,0);
   realShark.position.set(0,0,0);
  }
 }};
}
