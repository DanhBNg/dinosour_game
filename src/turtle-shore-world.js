import * as T from 'three';
import {sampleShore} from './turtle-shore-state.js';
export function createTurtleShoreWorld(){
 const group=new T.Group(),obstacles=[],geometries=new Set(),materials=new Set();
 function add(geo,mat,x=0,y=0,z=0){geometries.add(geo);materials.add(mat);const m=new T.Mesh(geo,mat);m.position.set(x,y,z);group.add(m);return m;}
 const sandTexture=new T.TextureLoader().load('/assets/textures/shore-sand-v2.webp');sandTexture.wrapS=sandTexture.wrapT=T.MirroredRepeatWrapping;sandTexture.repeat.set(24,24);sandTexture.colorSpace=T.SRGBColorSpace;sandTexture.anisotropy=4;
 const sand=new T.MeshStandardMaterial({map:sandTexture,bumpMap:sandTexture,bumpScale:.035,vertexColors:true,roughness:1,flatShading:true});
 const nestHole={value:new T.Vector3(0,0,0)};
 sand.onBeforeCompile=shader=>{shader.uniforms.nestHole=nestHole;shader.vertexShader='varying vec3 nestWorld;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nnestWorld=(modelMatrix*vec4(position,1.0)).xyz;');shader.fragmentShader='uniform vec3 nestHole; varying vec3 nestWorld;\n'+shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(nestHole.z>0.0 && distance(nestWorld.xz,nestHole.xy)<nestHole.z) discard;');};
 const geo=new T.PlaneGeometry(120,120,60,120);geo.rotateX(-Math.PI/2);
 const pos=geo.attributes.position,colors=[];
 for(let i=0;i<pos.count;i++){const z=pos.getZ(i),h=sampleShore(pos.getX(i),z).height;pos.setY(i,h);const color=new T.Color(h<-.1?0x82aaa3:h<.25?0xbdb4a4:0xffffff);color.multiplyScalar(.97+.03*Math.sin(pos.getX(i)*1.8+z*2.7));colors.push(color.r,color.g,color.b);}
 geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();add(geo,sand);
 const waterMat=new T.MeshPhysicalMaterial({color:0x149cae,transparent:true,opacity:.48,roughness:.25,metalness:.05,depthWrite:false,side:T.DoubleSide});
 const water=add(new T.PlaneGeometry(120,60),waterMat,0,0,30);water.rotation.x=-Math.PI/2;
 const foamMat=new T.MeshBasicMaterial({color:0xe5fff1,transparent:true,opacity:.5,depthWrite:false});
 const foam=[];for(let i=0;i<4;i++){const points=[];for(let x=-60;x<=60;x+=1)points.push(new T.Vector3(x,.025,.6+i*2.4+Math.sin(x*.16+i)*.32));const curve=new T.CatmullRomCurve3(points);const m=add(new T.TubeGeometry(curve,120,.035+i*.012,4,false),foamMat);foam.push(m);}
 // Deterministic scenery framing the playable beach; collision sampling stays unchanged.
 let seed=71;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const duneMat=new T.MeshStandardMaterial({color:0xdab780,roughness:1,flatShading:true});
 const leafMat=new T.MeshStandardMaterial({color:0x387f68,roughness:1,side:T.DoubleSide});
 const trunkMat=new T.MeshStandardMaterial({color:0x987451,roughness:1,flatShading:true});
 for(let i=0;i<14;i++){const x=-48+i*7.5,z=-24-rnd()*12;const dune=add(new T.SphereGeometry(1,10,5),duneMat,x,1.2,z);dune.scale.set(6+rnd()*3,1+rnd()*2.8,5+rnd()*3);obstacles.push({x,z,r:Math.max(dune.scale.x,dune.scale.z)+1});}
 for(const [x,z]of [[-17,-14],[18,-19],[-26,-5],[28,-28],[-12,-30],[33,-9]]){const h=6+rnd()*3,y=sampleShore(x,z).height;const trunk=add(new T.CylinderGeometry(.15,.35,h,7),trunkMat,x,y+h/2,z);trunk.rotation.z=.08;obstacles.push({x,z,r:.55});for(let j=0;j<7;j++){const ang=j*Math.PI*2/7,verts=[0,0,0,Math.cos(ang-.25)*2,-.15,Math.sin(ang-.25)*2,Math.cos(ang)*4,-1.4,Math.sin(ang)*4,Math.cos(ang+.25)*2,-.15,Math.sin(ang+.25)*2];const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();add(g,leafMat,x-h*.04,y+h,z);}}
 const shellMat=new T.MeshStandardMaterial({color:0xffead0,roughness:.8});
 for(let i=0;i<70;i++){const x=(rnd()-.5)*45,z=-3-rnd()*19;const m=add(new T.SphereGeometry(.06+rnd()*.07,5,3),shellMat,x,sampleShore(x,z).height+.025,z);m.scale.y=.35;}
 const cloudMat=new T.MeshBasicMaterial({color:0xeaf4eb,transparent:true,opacity:.8});
 for(let i=0;i<9;i++){const m=add(new T.SphereGeometry(1,8,5),cloudMat,-65+i*16,22+rnd()*7,-53);m.scale.set(5+rnd()*4,1.2,2.2);}
 const rockMat=new T.MeshStandardMaterial({color:0x78908b,roughness:1,flatShading:true});
 const grassMat=new T.MeshStandardMaterial({color:0x789776,roughness:1,side:T.DoubleSide});
 for(let i=0;i<30;i++){const side=i%2?-1:1,x=side*(26+(i%5)*5),z=-32+(i%11)*7,r=1.2+i%3;const m=add(new T.DodecahedronGeometry(r,0),rockMat,x,sampleShore(x,z).height+r*.5,z);m.scale.y=.65;obstacles.push({x,z,r:r*.85});}
 for(let i=0;i<65;i++){const x=Math.sin(i*13.3)*45,z=-27-(i%9)*2.8;const m=add(new T.ConeGeometry(.4,1.5,4),grassMat,x,sampleShore(x,z).height+.6,z);m.rotation.z=Math.sin(i)*.3;}
 const marker=add(new T.RingGeometry(2.5,2.65,48),new T.MeshBasicMaterial({color:0xffe7a1,side:T.DoubleSide,transparent:true,opacity:.8}),0,sampleShore(0,-15).height+.035,-15);marker.rotation.x=-Math.PI/2;
 return {group,obstacles,sandTexture,sample:sampleShore,marker,setNestHole(hole){nestHole.value.set(hole?.x||0,hole?.z||0,hole?.radius||0);},update(t){foam.forEach((m,i)=>{m.position.z=Math.sin(t*.7+i)*.4;});},dispose(){sandTexture.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
