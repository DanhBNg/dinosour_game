import * as T from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
window.renderRepresentative=async function(spec){
 const manager=new T.LoadingManager();manager.setURLModifier(url=>{if(url.startsWith('blob:')||url.startsWith('data:'))return url;if(/\.(png|jpe?g|tga)$/i.test(url))return '/_home-assets/'+spec.id+'/textures/'+(spec.texture||url.split(/[\\/]/).pop());return url;});
 let root,clips,baked;
 if(spec.file.endsWith('.json')){baked=await fetch('/_home-assets/'+spec.id+'/'+spec.file).then(r=>r.json());root=new T.Group();clips=[];for(const m of baked[0]){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(m.positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(m.uv,2));geo.computeVertexNormals();const map=await new T.TextureLoader().loadAsync('/_home-assets/'+spec.id+'/textures/'+(spec.texture||(m.name==='Wolf1'?'wolf_col_5.jpg':'Fur_Col_20.png')));map.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(geo,new T.MeshStandardMaterial({map,roughness:.9,side:T.DoubleSide}));root.add(mesh);}}
 else if(spec.file.endsWith('.glb')){const g=await new GLTFLoader(manager).loadAsync('/_home-assets/'+spec.id+'/'+spec.file);root=g.scene;clips=g.animations;}
 else{root=await new FBXLoader(manager).loadAsync('/_home-assets/'+spec.id+'/'+spec.file);clips=root.animations||[];}
 if(spec.texture){const tex=await new T.TextureLoader().loadAsync('/_home-assets/'+spec.id+'/textures/'+spec.texture);tex.colorSpace=T.SRGBColorSpace;root.traverse(n=>{if(n.isMesh)n.material=new T.MeshStandardMaterial({map:tex,roughness:.85,side:T.DoubleSide});});}
 root.traverse(n=>{if(n.isMesh)n.frustumCulled=false;});
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setSize(256,256);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;document.body.replaceChildren(renderer.domElement);
 const scene=new T.Scene();scene.add(new T.HemisphereLight(0xffffff,0x77715d,2.3));const light=new T.DirectionalLight(0xffeccf,3);light.position.set(5,9,6);scene.add(light);const rim=new T.DirectionalLight(0xdceeff,1.5);rim.position.set(-5,4,-5);scene.add(rim);
 const group=new T.Group(),normalizer=new T.Group();scene.add(group);group.add(normalizer);normalizer.add(root);const mixer=new T.AnimationMixer(root);
 const clip=clips.find(c=>/^(TRS\|)?idle$|gorillaidle/i.test(c.name))||clips.find(c=>/idle|breath|stand/i.test(c.name))||clips.find(c=>/walk/i.test(c.name))||clips[0];
 const action=clip?mixer.clipAction(clip).play():null;const duration=Math.min(clip?.duration||4.8,8);
 const box=new T.Box3();
 function pose(i){mixer.setTime(i/48*duration);if(baked)root.children.forEach((mesh,j)=>{mesh.geometry.attributes.position.array.set(baked[i][j].positions);mesh.geometry.attributes.position.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();});}
 for(let i=0;i<48;i++){pose(i);root.updateMatrixWorld(true);root.traverse(n=>n.skeleton?.update());root.traverse(n=>{if(n.isMesh){const v=new T.Vector3();for(let j=0;j<n.geometry.attributes.position.count;j++){n.getVertexPosition(j,v);v.applyMatrix4(n.matrixWorld);box.expandByPoint(v);}}});}
 const size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),scale=5/Math.max(...size.toArray());normalizer.scale.setScalar(scale);normalizer.position.addScaledVector(center,-scale);
 const camera=new T.PerspectiveCamera(35,1,.01,1000);camera.position.set(...(spec.direction||[7,3,8])).normalize().multiplyScalar(10);camera.lookAt(0,0,0);
 const atlas=document.createElement('canvas');atlas.width=2048;atlas.height=1536;const ctx=atlas.getContext('2d');
 for(let i=0;i<48;i++){pose(i);if(!clip&&!baked){group.rotation.y=Math.sin(i/48*Math.PI*2)*.12;group.scale.y=1+.009*Math.sin(i/48*Math.PI*2);}root.updateMatrixWorld(true);root.traverse(n=>n.skeleton?.update());renderer.render(scene,camera);ctx.drawImage(renderer.domElement,i%8*256,Math.floor(i/8)*256);}
 // Use projected pixels to exclude invisible helper geometry from the final camera crop.
 const pixels=ctx.getImageData(0,0,2048,1536).data;let x0=256,y0=256,x1=0,y1=0;
 for(let y=0;y<1536;y++)for(let x=0;x<2048;x++)if(pixels[(y*2048+x)*4+3]>40){x0=Math.min(x0,x%256);x1=Math.max(x1,x%256);y0=Math.min(y0,y%256);y1=Math.max(y1,y%256);}
 const side=Math.max(x1-x0+1,y1-y0+1)*1.24;
 camera.setViewOffset(256,256,(x0+x1)/2-side/2,(y0+y1)/2-side/2,side,side);
 ctx.clearRect(0,0,2048,1536);
 for(let i=0;i<48;i++){pose(i);root.updateMatrixWorld(true);root.traverse(n=>n.skeleton?.update());renderer.render(scene,camera);ctx.drawImage(renderer.domElement,i%8*256,Math.floor(i/8)*256);}
 const data=atlas.toDataURL('image/webp',.9);const poster=document.createElement('canvas');poster.width=256;poster.height=256;poster.getContext('2d').drawImage(atlas,0,0,256,256,0,0,256,256);
 const result={data,poster:poster.toDataURL(),clips:clips.map(c=>c.name),chosen:clip?.name||(baked?'02_walk (baked with ufbx)':'procedural gentle turn and breathing')};
 renderer.dispose();return result;
};
