import * as T from 'three';
export function createRoamWorld(sea){
 const group=new T.Group(),obstacles=[];let seed=731;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const materials=new Map(),geometries=[];
 const mat=color=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:1,flatShading:true}));return materials.get(color);};
 function mesh(geo,color,x,y,z,sx=1,sy=1,sz=1){geometries.push(geo);const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.receiveShadow=true;group.add(m);return m;}
 const ground=mesh(new T.PlaneGeometry(132,132,30,30),sea?0x95b9a4:0x719850,0,sea?-3:0,0);ground.rotation.x=-Math.PI/2;
 // Broad winding trail / shallow sand channel, safely traversable and easy to follow.
 for(let i=-12;i<=12;i++){const z=i*4.8,x=Math.sin(i*.36)*13;const p=mesh(new T.CircleGeometry(6.5,9),sea?0xc5cfb0:0xbba779,x,(sea?-3:0)+.025,z);p.rotation.x=-Math.PI/2;}
 function rock(x,z,r,boundary=false){const y=sea?-3:0,height=boundary?8+random()*10:2+random()*3;
 mesh(new T.DodecahedronGeometry(1,0),sea?0x436f77:0x687564,x,y+height*.35,z,r,height,r*.85).rotation.y=random()*6;
 obstacles.push({x,z,r:r*.85});
 }
 for(let i=0;i<44;i++){const a=i/44*Math.PI*2;rock(Math.sin(a)*61,Math.cos(a)*61,5+random()*4,true);}
 for(let i=0;i<38;i++){const x=(random()-.5)*108,z=(random()-.5)*108;if(Math.hypot(x,z)<12||Math.abs(x-Math.sin(z/4.8*.36)*13)<9)continue;
 if(sea){rock(x,z,1.8+random()*2);for(let j=0;j<4;j++){const height=1.6+random()*3;mesh(new T.ConeGeometry(.6, height,5),[0xe29679,0xb397d1,0x69bda2][i%3],x+j*.7-1,-3+height/2,z+random()*2);}}
 else if(i%3===0)rock(x,z,2+random()*2);else{const h=5+random()*4;mesh(new T.CylinderGeometry(.35,.6,h,5),0x71553d,x,h/2,z);mesh(new T.ConeGeometry(3.5,h*.85,6),i%2?0x315f40:0x467b46,x,h*.9,z);mesh(new T.ConeGeometry(2.5,h*.65,6),0x63954d,x,h*1.25,z);obstacles.push({x,z,r:1.1});}
 }
 // Landmarks break up the horizon without cluttering the play area.
 if(sea){for(const x of [-25,25]){mesh(new T.CylinderGeometry(2,3,12,7),0x426e78,x,3,-34);obstacles.push({x,z:-34,r:3});}mesh(new T.BoxGeometry(54,3,5),0x4f8186,0,10,-34);}
 else{mesh(new T.ConeGeometry(16,25,7),0x6d7470,-38,12,-43);mesh(new T.ConeGeometry(10,18,6),0x839485,38,9,-46);}
 if(sea){const positions=[];for(let i=0;i<160;i++)positions.push((random()-.5)*115,random()*18-1,(random()-.5)*115);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometries.push(geo);const m=new T.PointsMaterial({color:0xb1eeee,size:.12,transparent:true,opacity:.45});const particles=new T.Points(geo,m);group.add(particles);materials.set('particles',m);}
 return {group,obstacles,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
export function moveWithinMap(position,dx,dz,obstacles,radius=1.4){
 let x=position.x+dx,z=position.z+dz;
 const limit=55;if(Math.hypot(x,z)>limit){const scale=limit/Math.hypot(x,z);x*=scale;z*=scale;}
 for(let pass=0;pass<3;pass++)for(const o of obstacles){let a=x-o.x,b=z-o.z,d=Math.hypot(a,b),r=o.r+radius;if(d<r){if(d<.0001){a=1;b=0;d=1;}x=o.x+a/d*r;z=o.z+b/d*r;}}
 position.x=x;position.z=z;
}
