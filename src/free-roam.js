import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createRoamWorld,moveWithinMap} from './roam-world.js';
import {createTrexModel} from './creatures/model.js';
import {createTrexActions,ACTIONS} from './creatures/actions.js';
import {loadMarine} from './marine.js';
export function createFreeRoam(host){
 host.innerHTML='<div class="roam-canvas"></div><p class="roam-hint">WASD / phím mũi tên · Giữ nút để di chuyển</p><div class="roam-pad" aria-label="Điều khiển di chuyển">'+[['up','↑','Tiến'],['left','←','Sang trái'],['down','↓','Lùi'],['right','→','Sang phải']].map(([key,icon,label])=>'<button data-direction="'+key+'" aria-label="'+label+'">'+icon+'</button>').join('')+'</div><div class="roam-status" role="status">Đang chuẩn bị vùng khám phá…</div>';
 const mount=host.querySelector('.roam-canvas'),status=host.querySelector('.roam-status');
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;mount.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(52,1,.1,180);let world,animal,actions,active=false,serial=0,id='',moving=false,frameId;
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.1;controls.minDistance=5;controls.maxDistance=65;controls.maxPolarAngle=Math.PI/2-.06;controls.enabled=false;
 const actor=new T.Group();scene.add(actor);
 const footBox=new T.Box3(),followPosition=new T.Vector3(),followDelta=new T.Vector3();
 let jumpHeight=0,jumpVelocity=0,groundY=0;const poseRestore=[];
 function restorePose(){for(const [bone,q]of poseRestore)bone.quaternion.copy(q);poseRestore.length=0;}
 function jump(){if(active&&id==='trex'&&jumpHeight===0){jumpVelocity=6;}}
 function tuckLegs(){const amount=Math.min(1,jumpHeight/.6);for(const [name,angle]of [['jt_Knee_L',.32],['jt_Knee_R',.32],['jt_Thigh_L',-.18],['jt_Thigh_R',-.18]]){const bone=animal.userData.sculptRuntime.nodes[name];if(bone){poseRestore.push([bone,bone.quaternion.clone()]);bone.rotateX(angle*amount);}}}
 function groundAnimal(){animal.updateWorldMatrix(true,true);animal.traverse(n=>n.skeleton?.update());footBox.setFromObject(animal,true);actor.position.y+=.03+jumpHeight-footBox.min.y;actor.updateMatrixWorld(true);groundY=.03+jumpHeight;}

 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const context=shadowCanvas.getContext('2d'),gradient=context.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(10,25,22,.4)');gradient.addColorStop(1,'rgba(10,25,22,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);const shadowTexture=new T.CanvasTexture(shadowCanvas),shadow=new T.Mesh(new T.PlaneGeometry(8,8),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;scene.add(shadow);const target=new T.Vector3(),offset=new T.Vector3(0,8,14),keys=new Set(),pointers=new Map();let velocity=new T.Vector2();
 scene.add(new T.HemisphereLight(0xe4fffa,0x435b38,2.6));const sun=new T.DirectionalLight(0xffedce,3);sun.position.set(15,30,12);scene.add(sun);
 function clear(){keys.clear();pointers.clear();velocity.set(0,0);host.querySelectorAll('[data-direction]').forEach(b=>b.removeAttribute('data-held'));}
 const codes={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
 function keydown(e){if(!active||e.target.closest?.('input,textarea,select'))return;if(e.code==='Digit1'||e.code==='Numpad1'){e.preventDefault();if(!e.repeat)jump();return;}if(!codes[e.code])return;e.preventDefault();keys.add(e.code);}
 function keyup(e){keys.delete(e.code);}
 addEventListener('keydown',keydown);addEventListener('keyup',keyup);addEventListener('blur',clear);const visibility=()=>{if(document.hidden)clear();};document.addEventListener('visibilitychange',visibility);
 for(const button of host.querySelectorAll('[data-direction]')){button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,button.dataset.direction);button.dataset.held='true';};const release=e=>{pointers.delete(e.pointerId);button.removeAttribute('data-held');};button.onpointerup=release;button.onpointercancel=release;button.onlostpointercapture=release;}
 function disposeModel(model){const geometries=new Set(),materials=new Set(),textures=new Set();model.traverse(n=>{if(n.geometry)geometries.add(n.geometry);for(const m of (Array.isArray(n.material)?n.material:[n.material]).filter(Boolean)){materials.add(m);Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
 function disposeAnimal(){actions?.dispose();actions=null;if(animal){actor.remove(animal);disposeModel(animal);animal=null;}}

 async function load(next){const token=++serial;clear();active=false;status.hidden=false;status.textContent='Đang chuẩn bị vùng khám phá…';restorePose();disposeAnimal();actor.position.set(0,0,0);actor.rotation.set(0,0,0);actor.scale.setScalar(1);actor.updateMatrixWorld(true);jumpHeight=jumpVelocity=0;controls.enabled=false;world?.dispose();if(world)scene.remove(world.group);const sea=next==='loggerhead';world=createRoamWorld(sea);scene.add(world.group);scene.background=new T.Color(sea?0x176a86:0xa5cbd0);scene.fog=new T.Fog(sea?0x176a86:0xa5cbd0,sea?22:48,sea?88:135);id=next;host.querySelector('.roam-hint').textContent='WASD / ↑↓←→: di chuyển'+(sea?'':' · 1: nhảy')+' · Kéo: xoay · Cuộn: zoom · Chuột phải: dịch';
 let result;
 try{if(sea)result=await loadMarine(next);else{const response=await fetch('/assets/trex.json');if(!response.ok)throw Error('model');result={model:await createTrexModel({data:await response.json(),diffuse:'/assets/diffuse.jpeg',normal:'/assets/normal.jpeg'})};}
 if(token!==serial){result.createActions?.().dispose();disposeModel(result.model);return;}
 animal=result.model;actor.add(animal);actions=sea?result.createActions():createTrexActions(animal,ACTIONS);actions.play(sea?'clip0':'idle');restorePose();actions.setSpeed(sea?.35:1);actions.update(.001);animal.updateMatrixWorld(true);
 const box=new T.Box3().setFromObject(animal,true),size=box.getSize(new T.Vector3()),scale=(sea?4.5:8)/Math.max(size.x,size.y,size.z);actor.scale.setScalar(scale);actor.position.set(0,sea?2:-box.min.y*scale,0);actor.rotation.set(0,sea?0:Math.PI,0);moving=false;offset.set(0,sea?5:8,sea?11:15);target.copy(actor.position).add(new T.Vector3(0,sea?1:2.5,0));camera.position.copy(target).add(offset);camera.lookAt(target);controls.target.copy(target);controls.enabled=true;controls.update();followPosition.copy(actor.position);if(!sea)groundAnimal();status.hidden=true;active=true;resize();
 }catch(e){if(token!==serial)return;status.innerHTML='<button class="round" aria-label="Thử tải lại">↻</button>';status.querySelector('button').onclick=()=>load(next);console.error(e);}}
 function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}const observer=new ResizeObserver(resize);observer.observe(mount);
 let last=performance.now();function frame(now){frameId=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;if(!active||document.hidden||document.body.classList.contains('orientation-blocked')){clear();return;}
 const held=new Set([...keys].map(k=>codes[k]).concat([...pointers.values()])),dx=Number(held.has('right'))-Number(held.has('left')),dz=Number(held.has('down'))-Number(held.has('up')),input=new T.Vector2(dx,dz);if(input.lengthSq()>1)input.normalize();velocity.lerp(input,1-Math.exp(-dt*10));const walking=velocity.length()>.04,sea=id==='loggerhead';
 restorePose();
 if(walking!==moving){moving=walking;if(!sea)actions.play(moving?'walk':'idle');}
 actions.setSpeed(sea?(moving?1:.3):moving?Math.max(.3,velocity.length()):1);actions.update(dt);
 if(walking){const desired=Math.atan2(velocity.x,velocity.y)+(sea?Math.PI:0),delta=Math.atan2(Math.sin(desired-actor.rotation.y),Math.cos(desired-actor.rotation.y));actor.rotation.y+=delta*(1-Math.exp(-dt*8));moveWithinMap(actor.position,velocity.x*dt*(sea?7.5:6.375),velocity.y*dt*(sea?7.5:6.375),world.obstacles,sea?1.4:2);}
 if(!sea){if(jumpVelocity!==0||jumpHeight>0){jumpHeight+=jumpVelocity*dt-7*dt*dt;jumpVelocity-=14*dt;if(jumpHeight<=0){jumpHeight=0;jumpVelocity=0;}}if(jumpHeight>0)tuckLegs();groundAnimal();}
 shadow.material.opacity=1/(1+jumpHeight*.4);
 shadow.position.set(actor.position.x,sea?-2.97:.03,actor.position.z);shadow.scale.set(sea?.65:1,sea?.65:1,1);followDelta.set(actor.position.x-followPosition.x,0,actor.position.z-followPosition.z);camera.position.add(followDelta);controls.target.add(followDelta);followPosition.copy(actor.position);controls.update();renderer.render(scene,camera);
 }frameId=requestAnimationFrame(frame);
 return {load,setActive(value){active=value&&!!animal;controls.enabled=active;clear();if(!value){serial++;status.hidden=true;}},get state(){return {id,active,moving,jumpHeight,groundY:animal?new T.Box3().setFromObject(animal,true).min.y:groundY,position:actor.position.toArray(),camera:camera.position.toArray(),obstacles:world?.obstacles};},dispose(){serial++;cancelAnimationFrame(frameId);controls.dispose();observer.disconnect();clear();disposeAnimal();world?.dispose();shadow.geometry.dispose();shadow.material.dispose();shadowTexture.dispose();renderer.dispose();removeEventListener('keydown',keydown);removeEventListener('keyup',keyup);removeEventListener('blur',clear);document.removeEventListener('visibilitychange',visibility);}};
}
