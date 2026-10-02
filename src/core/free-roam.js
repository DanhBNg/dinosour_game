import {TURTLE_ACTIVITIES} from '../pages/ocean-world/loggerhead/turtle-activities.js';
import {createSurvivalJourney} from './survival/journey.js';
import {clampDepth} from '../pages/ocean-world/ocean-play-state.js';
import {createJoystick} from '../components/joystick.js';
import {createHoldActions} from '../components/hold-actions.js';
import {createDepthMotion} from './depth-motion.js';
import {createCameraMovement} from './camera-movement.js';
import {TURTLE_TURN_DURATION} from '../pages/ocean-world/loggerhead/turtle-turn.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createRoamWorld,moveWithinMap} from './roam-world.js';
import {createTrexModel} from './creatures/model.js';
import {createTrexActions,ACTIONS} from './creatures/actions.js';
import {loadMarine} from '../pages/ocean-world/marine.js';
import {createLoggerheadGameplay} from '../pages/ocean-world/loggerhead/gameplay.js';
import {getLoading3DHtml,dismissLoading3D} from '../components/loading-3d.js';
export function createFreeRoam(host){
 let loggerheadGame=null;
 host.innerHTML='<div class="roam-canvas"></div><div class="roam-joystick"></div><div class="roam-actions"><button class="roam-action" aria-label="Thực hiện hành động"><span class="roam-action-icon" aria-hidden="true"></span><small></small><kbd>1</kbd></button></div><div class="roam-status" role="status" style="display:none"></div>'+getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi');
 const joystick=createJoystick(host.querySelector('.roam-joystick')),actionButton=host.querySelector('.roam-action');let turnTime=-1,activity='',quest=null,depthStart=2,depthTarget=2,baseScale=1;const actionKeys=['context','boost','dive','rise'];
 function fireAction(key='context'){if(!active)return;if(id==='trex'){jump();return;}if(turnTime>=0)return;if(key==='context'){quest?.act();return;}if(key==='boost'&&!quest?.boost())return;depthStart=actor.position.y;depthTarget=Math.max(quest?.stage.maxDepth??0,clampDepth(depthStart+(key==='rise'?2:key==='dive'?-2:0)));if((key==='dive'||key==='rise')&&Math.abs(depthTarget-depthStart)<.001)return;if(key==='dive'||key==='rise')depthMotion.begin(key,depthStart,depthTarget);activity=key;turnTime=0;actions.play(key);}
 actionButton.onclick=()=>fireAction();
 const depthHold=createHoldActions(key=>fireAction(key));
 const depthMotion=createDepthMotion();
 const cameraMovement=createCameraMovement(),worldInput=new T.Vector2();
 function buttons(sea){depthHold.dispose();host.querySelectorAll('.extra-action').forEach(b=>b.remove());actionButton.hidden=sea;actionButton.dataset.roamAction=sea?'context':'jump';if(!sea)return;const icons={boost:'»',dive:'↓',rise:'↑'};for(const [index,key]of actionKeys.entries()){if(!index)continue;const button=document.createElement('button');button.className='roam-action extra-action';button.dataset.roamAction=key;button.setAttribute('aria-label',TURTLE_ACTIVITIES[key].label);button.innerHTML=`<span class="roam-action-icon" aria-hidden="true">${icons[key]}</span><small>${TURTLE_ACTIVITIES[key].label}</small><kbd>${index+1}</kbd>`;if(key==='dive'||key==='rise'){button.style.touchAction='none';depthHold.bind(button,key);}else button.onclick=()=>fireAction(key);host.querySelector('.roam-actions').append(button);}}

 const mount=host.querySelector('.roam-canvas'),status=host.querySelector('.roam-status');
 const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;mount.append(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(52,1,.1,180);let world,animal,actions,active=false,serial=0,id='',moving=false,frameId;
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.1;controls.minDistance=5;controls.maxDistance=65;controls.maxPolarAngle=Math.PI/2-.06;controls.enabled=false;
 const actor=new T.Group();scene.add(actor);
 const footBox=new T.Box3(),followPosition=new T.Vector3(),followDelta=new T.Vector3();
 const mouthPosition=new T.Vector3();
 let jumpHeight=0,jumpVelocity=0,groundY=0;const poseRestore=[];
 function restorePose(){for(const [bone,q]of poseRestore)bone.quaternion.copy(q);poseRestore.length=0;}
 function jump(){if(active&&id==='trex'&&jumpHeight===0){jumpVelocity=6;}}
 function tuckLegs(){const amount=Math.min(1,jumpHeight/.6);for(const [name,angle]of [['jt_Knee_L',.32],['jt_Knee_R',.32],['jt_Thigh_L',-.18],['jt_Thigh_R',-.18]]){const bone=animal.userData.sculptRuntime.nodes[name];if(bone){poseRestore.push([bone,bone.quaternion.clone()]);bone.rotateX(angle*amount);}}}
 function groundAnimal(){animal.updateWorldMatrix(true,true);animal.traverse(n=>n.skeleton?.update());footBox.setFromObject(animal,true);actor.position.y+=.03+jumpHeight-footBox.min.y;actor.updateMatrixWorld(true);groundY=.03+jumpHeight;}

 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const context=shadowCanvas.getContext('2d'),gradient=context.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(10,25,22,.4)');gradient.addColorStop(1,'rgba(10,25,22,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);const shadowTexture=new T.CanvasTexture(shadowCanvas),shadow=new T.Mesh(new T.PlaneGeometry(8,8),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;scene.add(shadow);const target=new T.Vector3(),offset=new T.Vector3(0,8,14),keys=new Set(),pointers=new Map();let velocity=new T.Vector2();
 scene.add(new T.HemisphereLight(0xe4fffa,0x435b38,2.6));const sun=new T.DirectionalLight(0xffedce,3);sun.position.set(15,30,12);scene.add(sun);
 function clear(){depthHold.reset();joystick.reset();keys.clear();pointers.clear();velocity.set(0,0);host.querySelectorAll('[data-direction]').forEach(b=>b.removeAttribute('data-held'));}
 const codes={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
 function keydown(e){if(!active||e.target.closest?.('input,textarea,select'))return;if(id==='loggerhead'&&/^(Digit|Numpad)[5-6]$/.test(e.code)){e.preventDefault();if(!e.repeat&&turnTime<0)quest?.useSkill(['ram','shield'][Number(e.code.slice(-1))-5]);return;}if(/^(Digit|Numpad)[1-4]$/.test(e.code)){e.preventDefault();const slot=Number(e.code.slice(-1))-1;if(id==='loggerhead'&&slot>=2)depthHold.press(e.code,actionKeys[slot]);else if(!e.repeat&&(id==='loggerhead'||slot===0))fireAction(actionKeys[slot]);return;}if(!codes[e.code])return;e.preventDefault();keys.add(e.code);}
 function keyup(e){keys.delete(e.code);depthHold.release(e.code);}
 addEventListener('keydown',keydown);addEventListener('keyup',keyup);addEventListener('blur',clear);const visibility=()=>{if(document.hidden)clear();};document.addEventListener('visibilitychange',visibility);
 for(const button of host.querySelectorAll('[data-direction]')){button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,button.dataset.direction);button.dataset.held='true';};const release=e=>{pointers.delete(e.pointerId);button.removeAttribute('data-held');};button.onpointerup=release;button.onpointercancel=release;button.onlostpointercapture=release;}
 function disposeModel(model){const geometries=new Set(),materials=new Set(),textures=new Set();model.traverse(n=>{if(n.geometry)geometries.add(n.geometry);for(const m of (Array.isArray(n.material)?n.material:[n.material]).filter(Boolean)){materials.add(m);Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}
 function disposeAnimal(){actions?.dispose();actions=null;if(animal){actor.remove(animal);disposeModel(animal);animal=null;}}

 async function load(next){
  if(next==='loggerhead'){
   disposeAnimal();quest?.dispose();quest=null;
   loggerheadGame?.dispose();
   loggerheadGame=createLoggerheadGameplay(host);
   id='loggerhead';
   await loggerheadGame.load();
   return;
  }
  loggerheadGame?.dispose();loggerheadGame=null;
  const token=++serial;clear();active=false;  let loader=host.querySelector('.loading-3d-screen');if(!loader){host.insertAdjacentHTML('beforeend',getLoading3DHtml('AI đang tạo mô hình 3d, vui lòng đợi'));loader=host.querySelector('.loading-3d-screen');}if(loader){loader.classList.remove('fade-out');loader.style.display='';}status.hidden=true;restorePose();disposeAnimal();quest?.dispose();quest=null;actor.position.set(0,0,0);actor.rotation.set(0,0,0);actor.scale.setScalar(1);actor.updateMatrixWorld(true);jumpHeight=jumpVelocity=0;controls.enabled=false;world?.dispose();if(world)scene.remove(world.group);const sea=next==='loggerhead';world=createRoamWorld(sea);scene.add(world.group);scene.background=new T.Color(sea?0x176a86:0xa5cbd0);scene.fog=new T.Fog(sea?0x176a86:0xa5cbd0,sea?22:48,sea?88:135);id=next;turnTime=-1;activity='';buttons(sea);if(sea)quest=createSurvivalJourney(scene,host);actionButton.querySelector('.roam-action-icon').innerHTML=sea?'<svg class="turtle-action-icon" viewBox="0 0 64 64" aria-hidden="true"><g fill="#ffd66b" stroke="#9c6826" stroke-width="1.5" stroke-linejoin="round"><path d="M22 23C10 13 3 18 9 27L21 33M42 23C54 13 61 18 55 27L43 33M23 43C12 43 10 52 16 52L26 47M41 43C52 43 54 52 48 52L38 47M29 48L32 57L35 48"/><ellipse cx="32" cy="14" rx="8" ry="10"/><ellipse cx="32" cy="34" rx="17" ry="20" fill="#ebba45"/><path d="M32 21L41 27V39L32 46L23 39V27Z" fill="#ffe18a"/><path d="M23 27L18 24M41 27L46 24M23 39L18 43M41 39L46 43M32 21V15M32 46V53" fill="none"/><circle cx="29" cy="10" r="1" fill="#44361c"/><circle cx="35" cy="10" r="1" fill="#44361c"/></g></svg>':'↟';actionButton.querySelector('small').textContent=sea?'Lộn một vòng':'Nhảy';actionButton.setAttribute('aria-label',sea?'Lộn một vòng':'Nhảy');
 let result;
 try{if(sea)result=await loadMarine(next);else{const response=await fetch('/assets/trex.json');if(!response.ok)throw Error('model');result={model:await createTrexModel({data:await response.json(),diffuse:'/assets/diffuse.jpeg',normal:'/assets/normal.jpeg'})};}
 if(token!==serial){result.createActions?.().dispose();disposeModel(result.model);return;}
 animal=result.model;actor.add(animal);actions=sea?result.createActions():createTrexActions(animal,ACTIONS);actions.play(sea?'clip0':'idle');restorePose();actions.setSpeed(sea?.35:1);actions.update(.001);animal.updateMatrixWorld(true);
 const box=new T.Box3().setFromObject(animal,true),size=box.getSize(new T.Vector3()),scale=(sea?4.5:8)/Math.max(size.x,size.y,size.z);baseScale=scale;actor.scale.setScalar(scale*(quest?.stage.scale??1));actor.position.set(0,sea?2:-box.min.y*scale,0);actor.rotation.set(0,sea?0:Math.PI,0);depthStart=depthTarget=2;moving=false;offset.set(0,sea?5:8,sea?11:15);target.copy(actor.position).add(new T.Vector3(0,sea?1:2.5,0));camera.position.copy(target).add(offset);camera.lookAt(target);controls.target.copy(target);controls.enabled=true;controls.update();followPosition.copy(actor.position);if(!sea)groundAnimal();if(loader)dismissLoading3D(loader,400);status.hidden=true;active=true;resize();
 }catch(e){if(token!==serial)return;const ldr=host.querySelector('.loading-3d-screen');if(ldr){ldr.innerHTML='<div class="loading-3d-box video-loading-3d-box"><p class="loading-3d-title" style="margin-bottom:14px">Không thể tải vùng khám phá</p><button class="round" aria-label="Thử tải lại" style="font-size:24px;width:52px;height:52px">↻</button></div>';ldr.querySelector('button').onclick=()=>load(next);}console.error(e);}}
 function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}const observer=new ResizeObserver(resize);observer.observe(mount);
 let last=performance.now();function frame(now){frameId=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;if(!active||document.hidden||document.body.classList.contains('orientation-blocked')){clear();return;}
 controls.update();
 const held=new Set([...keys].map(k=>codes[k]).concat([...pointers.values()])),dx=Number(held.has('right'))-Number(held.has('left')),dz=Number(held.has('down'))-Number(held.has('up')),input=new T.Vector2(dx+joystick.value.x,dz+joystick.value.y);if(input.lengthSq()>1)input.normalize();cameraMovement(input,camera,worldInput);velocity.lerp(worldInput,1-Math.exp(-dt*10));const walking=velocity.length()>.04,sea=id==='loggerhead';
 restorePose();
 if(walking!==moving){moving=walking;if(!sea)actions.play(moving?'walk':'idle');}
 const isDepthAction=sea&&(activity==='dive'||activity==='rise');
 const depthRate=isDepthAction&&depthHold.action?1.6:1;
 if(sea)actions.setDepthHeld(isDepthAction&&!!depthHold.action);
 actions.setSpeed(sea?(turnTime>=0?depthRate:moving?1:.3):moving?Math.max(.3,velocity.length()):1);actions.update(dt);
 if(sea&&turnTime>=0){
  turnTime+=dt*depthRate;
  const duration=activity==='turn360'?TURTLE_TURN_DURATION:TURTLE_ACTIVITIES[activity].duration;
  let finished=turnTime>=duration;
  if(isDepthAction){
   const motion=depthMotion.update(dt,actor.position.y,depthHold.action,quest.stage.maxDepth,6);
   actor.position.y=motion.height;finished=motion.finished;
   if(activity!==motion.action){activity=motion.action;actions.play(activity);}
  }
  if(finished){actions.setDepthHeld(false);actions.play('clip0');turnTime=-1;activity='';}
 }
 if(sea&&turnTime<0)depthHold.repeat();
 host.querySelectorAll('.roam-action').forEach(b=>{b.disabled=sea?turnTime>=0&&!['dive','rise'].includes(b.dataset.roamAction):jumpHeight>0;if(sea&&b.dataset.roamAction==='boost')b.disabled||=!quest.canBoost();if(sea&&b.dataset.roamAction==='context'){const action=quest.context;b.hidden=!action.enabled;b.disabled||=!action.enabled;b.querySelector('.roam-action-icon').textContent=action.icon;b.querySelector('small').textContent=action.label;b.setAttribute('aria-label',action.label);b.classList.toggle('ready',action.enabled);}b.classList.toggle('playing',b.dataset.roamAction===activity);});
 if((walking||activity==='boost')&&activity!=='eat'){const vx=walking?velocity.x:-Math.sin(actor.rotation.y),vz=walking?velocity.y:-Math.cos(actor.rotation.y);const desired=Math.atan2(vx,vz)+(sea?Math.PI:0),delta=Math.atan2(Math.sin(desired-actor.rotation.y),Math.cos(desired-actor.rotation.y));actor.rotation.y+=delta*(1-Math.exp(-dt*8));const boost=activity==='boost'?1+.6*Math.sin(Math.PI*Math.min(1,turnTime/3)):1;moveWithinMap(actor.position,vx*dt*(sea?quest.speed:6.375)*boost,vz*dt*(sea?quest.speed:6.375)*boost,world.obstacles,sea?1.4:2);}
 if(sea&&activity==='eat'&&turnTime<.65&&quest.feedingTarget){
  const food=quest.feedingTarget,desired=Math.atan2(food.x-actor.position.x,food.z-actor.position.z)+Math.PI;
  const delta=Math.atan2(Math.sin(desired-actor.rotation.y),Math.cos(desired-actor.rotation.y));actor.rotation.y+=delta*(1-Math.exp(-dt*12));
  actions.getMouthPosition(mouthPosition);
  const reach=Math.min(1,dt*5);
  moveWithinMap(actor.position,(food.x-mouthPosition.x)*reach,(food.z-mouthPosition.z)*reach,world.obstacles,1.4);
  actor.position.y=Math.max(quest.stage.maxDepth,clampDepth(actor.position.y+(food.y-mouthPosition.y)*reach));
 }
 if(sea)actions.getMouthPosition(mouthPosition,true);
 const automaticAction=quest?.update(dt,actor.position,activity==='boost',turnTime<0,mouthPosition);
 if(automaticAction==='recover'||automaticAction==='hurt'&&activity==='eat'){actions.play('clip0');activity='';turnTime=-1;}
 const skillAction=quest?.takeSkillAction();
 if(skillAction&&turnTime<0){activity=skillAction;turnTime=0;actions.play(skillAction);}
 if(automaticAction==='eat')fireAction('eat');
 if(sea)actor.scale.setScalar(baseScale*quest.stage.scale);

 if(!sea){if(jumpVelocity!==0||jumpHeight>0){jumpHeight+=jumpVelocity*dt-7*dt*dt;jumpVelocity-=14*dt;if(jumpHeight<=0){jumpHeight=0;jumpVelocity=0;}}if(jumpHeight>0)tuckLegs();groundAnimal();}
 shadow.material.opacity=1/(1+jumpHeight*.4);
 shadow.position.set(actor.position.x,sea?-2.97:.03,actor.position.z);shadow.scale.set(sea?.65:1,sea?.65:1,1);followDelta.set(actor.position.x-followPosition.x,sea?actor.position.y-followPosition.y:0,actor.position.z-followPosition.z);camera.position.add(followDelta);controls.target.add(followDelta);followPosition.copy(actor.position);renderer.render(scene,camera);
 }frameId=requestAnimationFrame(frame);
 return {load,setActive(value){if(id==='loggerhead'&&loggerheadGame)return loggerheadGame.setActive(value);active=value&&!!animal;controls.enabled=active;clear();if(!value){serial++;status.hidden=true;const ldr=host.querySelector('.loading-3d-screen');if(ldr)ldr.style.display='none';}},get state(){if(id==='loggerhead'&&loggerheadGame)return loggerheadGame.state;return {id,active,moving,turnTime,activity,quest:quest?.state,action:actions?.state.id,jumpHeight,groundY:animal?new T.Box3().setFromObject(animal,true).min.y:groundY,position:actor.position.toArray(),camera:camera.position.toArray(),obstacles:world?.obstacles};},dispose(){loggerheadGame?.dispose();loggerheadGame=null;serial++;cancelAnimationFrame(frameId);controls.dispose();observer.disconnect();clear();depthHold.dispose();disposeAnimal();quest?.dispose();world?.dispose();shadow.geometry.dispose();shadow.material.dispose();shadowTexture.dispose();renderer.dispose();removeEventListener('keydown',keydown);removeEventListener('keyup',keyup);removeEventListener('blur',clear);document.removeEventListener('visibilitychange',visibility);}};
}
