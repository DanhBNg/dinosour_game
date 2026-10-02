import * as T from 'three';

export function createPreyModels(){
 const sphere=new T.SphereGeometry(1,16,10),rod=new T.CylinderGeometry(1,1,1,6);
 const geometries=[sphere,rod],materials=new Map();
 function material(color){
  if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.38,metalness:.08}));
  return materials.get(color);
 }
 function part(parent,geometry,color,position,scale=[1,1,1]){
  const mesh=new T.Mesh(geometry,material(color));mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;
 }
 function oval(parent,color,position,scale){return part(parent,sphere,color,position,scale);}
 function link(parent,color,start,end,radius){
  const from=new T.Vector3(...start),to=new T.Vector3(...end),direction=to.clone().sub(from);
  const mesh=part(parent,rod,color,from.add(to).multiplyScalar(.5).toArray(),[radius,direction.length(),radius]);
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return mesh;
 }
 function fin(parent,color,points){
  const shape=new T.Shape();shape.moveTo(...points[0]);for(const point of points.slice(1))shape.lineTo(...point);shape.closePath();
  const geometry=new T.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.02});
  geometries.push(geometry);return part(parent,geometry,color,[0,0,-.022]);
 }
 function eyes(parent,position,size=.1){
  for(const side of [-1,1]){
   oval(parent,0xfff9e9,[position[0],position[1],side*position[2]],[size,size,size*.65]);
   oval(parent,0x112c3c,[position[0]+size*.22,position[1],side*(position[2]+size*.5)],[size*.56,size*.64,size*.28]);
   oval(parent,0xffffff,[position[0]+size*.36,position[1]+size*.3,side*(position[2]+size*.67)],[size*.19,size*.19,size*.13]);
  }
 }
 function fish(color){
  const body=new T.Group();body.name='prey-fish';
  oval(body,color,[0,0,0],[.66,.32,.24]);
  oval(body,0xc4f5ed,[.06,-.12,0],[.52,.18,.225]);
  oval(body,0x207c9f,[-.08,.18,0],[.46,.14,.18]);
  const tail=new T.Group();tail.position.x=-.56;body.add(tail);
  fin(tail,0xffcc68,[[0,0],[-.42,.34],[-.32,0],[-.42,-.34]]);
  fin(body,0x3bbec9,[[-.32,.21],[-.19,.54],[.13,.28]]);
  fin(body,0xffdc91,[[-.22,-.21],[-.34,-.4],[.13,-.24]]);
  const flippers=[];
  for(const side of [-1,1]){
   const wing=fin(body,0xffcf77,[[0,0],[-.26,-.18],[-.3,.06]]);wing.position.set(.12,-.05,side*.2);wing.rotation.x=side*.6;flippers.push(wing);
   for(let stripe=0;stripe<3;stripe++)oval(body,0x2a9faa,[-.28+stripe*.18,.035,side*.222],[.035,.19,.013]);
  }
  eyes(body,[.4,.1,.185],.115);
  oval(body,0x19516c,[.635,-.025,0],[.025,.045,.07]);
  return {body,animate(time){tail.rotation.y=Math.sin(time*9)*.4;flippers.forEach((wing,index)=>{wing.rotation.y=Math.sin(time*7+index)*.25;});body.rotation.z=Math.sin(time*3)*.04;}};
 }
 function crab(color){
  const body=new T.Group();body.name='prey-crab';
  oval(body,0xffd5a0,[0,-.07,0],[.45,.16,.34]);
  oval(body,color,[0,.04,0],[.52,.25,.38]);
  oval(body,0xffb46e,[0,.2,0],[.34,.065,.24]);
  const legs=[],claws=[];
  for(const side of [-1,1]){
   for(let index=0;index<4;index++){
    const leg=new T.Group();leg.position.set(side*.35,-.03,-.26+index*.17);body.add(leg);
    const bend=[side*.35,-.07,(index-1.5)*.08],tip=[side*.51,-.32,(index-1.5)*.15];
    link(leg,color,[0,0,0],bend,.047);link(leg,0xd75b3d,bend,tip,.032);oval(leg,0xffc181,bend,[.065,.06,.065]);legs.push(leg);
   }
   const claw=new T.Group();claw.position.set(side*.4,.04,.28);body.add(claw);
   link(claw,color,[0,0,0],[side*.18,.08,.22],.09);
   oval(claw,0xf87d50,[side*.2,.1,.32],[.18,.14,.21]);
   for(const finger of [-1,1]){
    link(claw,0xffbb7e,[side*.2+finger*.1,.1,.39],[side*.2+finger*.12,.1,.58],.055);
    link(claw,0xffd4a0,[side*.2+finger*.12,.1,.58],[side*.2+finger*.035,.1,.65],.033);
   }
   claws.push(claw);
   link(body,color,[side*.19,.19,.22],[side*.22,.4,.29],.045);
   oval(body,0xfff7dd,[side*.22,.41,.29],[.105,.11,.095]);
   oval(body,0x172d37,[side*.22,.42,.367],[.056,.066,.03]);
   oval(body,0xffffff,[side*.205,.45,.391],[.021,.022,.012]);
  }
  for(const side of [-1,1])oval(body,0x9d4936,[side*.08,.01,.362],[.055,.025,.025]);
  return {body,animate(time){legs.forEach((leg,index)=>{leg.rotation.z=Math.sin(time*8+index*Math.PI*.7)*.15;});claws.forEach((claw,index)=>{claw.rotation.y=Math.sin(time*2.5+index)*.13;});}};
 }
 function snail(color){
  const body=new T.Group();body.name='prey-snail';
  oval(body,0x85bba0,[.08,-.24,0],[.58,.14,.26]);
  oval(body,0xc3ddab,[.39,-.13,0],[.21,.2,.2]);
  oval(body,color,[-.13,.13,0],[.41,.44,.32]);
  const points=[];
  for(let index=0;index<=100;index++){
   const fraction=index/100,angle=fraction*Math.PI*5,radius=.025+fraction*.36;
   points.push(new T.Vector3(-.13+Math.cos(angle)*radius,.13+Math.sin(angle)*radius,.325-Math.pow(fraction,2)*.12));
  }
  const spiral=new T.TubeGeometry(new T.CatmullRomCurve3(points),80,.035,5,false);geometries.push(spiral);
  part(body,spiral,0xffe2a2,[0,0,0]);const reverse=part(body,spiral,0xffe2a2,[0,0,0]);reverse.scale.z=-1;
  const feelers=[];
  for(const side of [-1,1]){
   const feeler=new T.Group();feeler.position.set(.44,-.04,side*.12);body.add(feeler);
   link(feeler,0xa3c798,[0,0,0],[.16,.29,side*.05],.025);
   oval(feeler,0x173c38,[.16,.29,side*.05],[.05,.055,.045]);feelers.push(feeler);
  }
  return {body,animate(time){feelers.forEach((feeler,index)=>{feeler.rotation.z=Math.sin(time*2+index)*.09;});}};
 }
 return {
  create(type){if(type.id==='fish')return fish(type.color);if(type.id==='crab')return crab(type.color);if(type.id==='snail')return snail(type.color);throw new Error(`Unknown prey model: ${type.id}`);},
  dispose(){geometries.forEach(geometry=>geometry.dispose());materials.forEach(value=>value.dispose());}
 };
}
