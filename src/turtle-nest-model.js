import * as T from 'three';
import {sampleShore,smooth} from './turtle-shore-state.js';

// A real cavity: the terrain material opens here and this bowl supplies its walls.
export function createNestModel(scene,world){
 const group=new T.Group();group.name='turtle-nest';scene.add(group);group.visible=false;
 const sand=new T.MeshStandardMaterial({color:0xc6b395,map:world.sandTexture||null,roughness:1,side:T.DoubleSide});
 const segments=64,rings=12,verts=[],indices=[];
 for(let j=0;j<=rings;j++)for(let i=0;i<=segments;i++){const r=j/rings,a=i/segments*Math.PI*2;verts.push(Math.cos(a)*r,0,Math.sin(a)*r);if(j<rings&&i<segments){const k=j*(segments+1)+i;indices.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}}
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(verts,3));geometry.setIndex(indices);geometry.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array((rings+1)*(segments+1)*2),2));
 const bowl=new T.Mesh(geometry,sand);bowl.name='nest-cavity';group.add(bowl);
 const eggGeo=new T.SphereGeometry(.12,20,14),eggMat=new T.MeshStandardMaterial({color:0xfff0d7,roughness:.72});
 const eggs=Array.from({length:8},(_,i)=>{const m=new T.Mesh(eggGeo,eggMat);m.name=`nest-egg-${i}`;m.scale.set(1,.98,1);group.add(m);return m;});
 const rim=new T.Mesh(new T.TorusGeometry(.74,.055,8,64),sand);rim.rotation.x=-Math.PI/2;group.add(rim);
 let lastShape='';
 return {update(state){
  group.visible=!!state.site;if(!state.site){world.setNestHole(null);return;}
  const site=state.site,yaw=site.yaw||0,cx=site.x+Math.sin(yaw)*2.05,cz=site.z+Math.cos(yaw)*2.05;
  const order=['bodyPit','dig','lay','cover','disguise','return','complete'].indexOf(state.stage);
  const dug=order===0?0:order===1?smooth(state.progress):1,fill=order===3?smooth(state.progress):order>3?1:0;
  const depth=.58*dug*(1-fill),radius=.70;
  world.setNestHole(depth>.005?{x:cx,z:cz,radius}:null);
  const signature=[cx,cz,depth.toFixed(4)].join(':');
  if(signature!==lastShape){lastShape=signature;const pos=geometry.attributes.position;for(let j=0;j<=rings;j++)for(let i=0;i<=segments;i++){const r=j/rings,a=i/segments*Math.PI*2,x=cx+Math.cos(a)*r*radius,z=cz+Math.sin(a)*r*radius;geometry.attributes.uv.setXY(j*(segments+1)+i,x/120+.5,.5-z/120);pos.setXYZ(j*(segments+1)+i,x,sampleShore(x,z).height-depth*(1-smooth((r-.45)/.55))+.003,z);}pos.needsUpdate=true;geometry.attributes.uv.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();}
  bowl.visible=depth>.005;
  rim.position.set(cx,sampleShore(cx,cz).height+.025,cz);rim.scale.setScalar(.6+.4*dug);rim.visible=order<5&&dug>0;rim.material.color.setHex(fill>.5?0xcfb78f:0xbca078);
  eggs.forEach((egg,i)=>{const a=i*2.39996,r=.10+Math.sqrt(i)*.087;const x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;const t=state.stage==='lay'?Math.max(0,Math.min(1,(state.time-i*5/8)/.5)):order>2?1:0;egg.visible=order>=2&&t>0&&fill<.99;egg.position.set(x-Math.sin(yaw)*.40*(1-t),sampleShore(x,z).height-.58+.13+(1-t)**2*.52,z-Math.cos(yaw)*.40*(1-t));});
 },dispose(){world.setNestHole(null);group.removeFromParent();geometry.dispose();sand.dispose();eggGeo.dispose();eggMat.dispose();rim.geometry.dispose();}};
}
