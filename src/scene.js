import {viewDirection} from './creatures/view-directions.js';
import {marine,loadMarine} from './marine.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createTrexModel} from './creatures/model.js';
import {createImportedCreature} from './creatures/imported-creature.js';
import {createPterosaurModel} from './creatures/pterosaur.js';
import {ACTIONS,createTrexActions} from './creatures/actions.js';
import {createHuntActions} from './creatures/hunt.js';
import {CUSTOM} from './creatures/authored-motion.js';
import {ROAR_SWEEP_DURATION} from './creatures/roar-sweep.js';
import {createEntranceCamera} from './creatures/entrance-camera.js';

export function createHabitat(host){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.prepend(renderer.domElement);
 const scene=new T.Scene();
 const camera=new T.PerspectiveCamera(37,1,.05,150),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=2;controls.maxDistance=32;controls.maxPolarAngle=Math.PI*.49;
 const entrance=createEntranceCamera(camera,controls,host);
 scene.add(new T.HemisphereLight(0xe4f3df,0x38432a,2.5));
 const sun=new T.DirectionalLight(0xffe3c3,3.2);sun.position.set(6,12,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14});sun.shadow.normalBias=.025;scene.add(sun);
 const rim=new T.DirectionalLight(0xc4efff,1.5);rim.position.set(-7,5,-6);scene.add(rim);
 const floor=new T.Mesh(new T.PlaneGeometry(150,150),new T.ShadowMaterial({opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
 const ring=new T.Group();scene.add(ring);

 const cache=new Map();let root,actions,id,active=false,token=0,definitions={},lastKey=null;
 async function obtain(next){
  if(cache.has(next))return cache.get(next);
  let result;
  if(marine[next]){result=await loadMarine(next);}else if(next==='trex'){
   const response=await fetch('assets/trex.json');if(!response.ok)throw Error('Không tải được T-Rex');
   result={model:await createTrexModel({data:await response.json(),diffuse:'assets/diffuse.jpeg',normal:'assets/normal.jpeg'}),definitions:{...ACTIONS,hunt:[null,'Săn đuổi','Đuổi và bắt Deinonychus.',false]}};
  }else{
   const response=await fetch('assets/'+next+'.glb');if(!response.ok)throw Error('Không tải được model');
   const bytes=new Uint8Array(await response.arrayBuffer());result=next==='ptero'?await createPterosaurModel(bytes):await createImportedCreature(bytes,next);
  }
  cache.set(next,result);return result;
 }
 async function load(next){
  const request=++token;const result=await obtain(next);const prey=next==='trex'?(await obtain('deino')).model:null;
  if(request!==token)return false;
  entrance.cancel();actions?.dispose();if(root)scene.remove(root);
  id=next;root=result.model;definitions=result.definitions;scene.add(root);
  for(const [old,entry] of cache){if(cache.size<=4)break;if(old===next||old==='deino'||old==='trex')continue;entry.model.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]).filter(Boolean)){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}});cache.delete(old);}
  floor.visible=!marine[next]&&next!=='mosa';const base=result.createActions?result.createActions():createTrexActions(root,next==='trex'?ACTIONS:definitions,{once:false});base.setSpeed(1.25);
  actions=prey?createHuntActions({base,predator:root,prey,scene,camera,controls,floor,ring}):base;
  actions.update(.001);actions.pause();lastKey=null;resize();return true;
 }
 function play(key){if(!actions)return false;entrance.cancel();const ok=actions.play(key);if(ok){lastKey=key;if(!actions.hunt?.active)fit(false);}return ok;}
 function stop(){if(actions&&!actions.state.paused)actions.pause();}
 function fit(animate=true){if(!root)return;if(actions?.hunt?.active){actions.frameView('hero');return;}entrance.frame(root,id,{animate,distanceScale:id==='mosa'?1.65:1.16});}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.clearViewOffset();if(matchMedia("(max-width:650px)").matches)camera.setViewOffset(w,h,0,-h*.07,w,h);camera.updateProjectionMatrix();if(root&&active)fit(false);}
 new ResizeObserver(resize).observe(host);
 let last=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;if(!active||document.hidden)return;actions?.update(dt);if(actions?.hunt?.active&&actions.progress>=1&&!actions.state.paused)actions.play("hunt");entrance.update(dt);controls.update();renderer.render(scene,camera);}requestAnimationFrame(frame);

 // Build-time alpha sprite generation, using the same model and action controller.
 async function captureAction(key,{resolution=256,frames=48,columns=8,closeup=false}={}){
  active=false;entrance.cancel();floor.visible=false;ring.visible=false;renderer.setPixelRatio(1);renderer.setSize(resolution,resolution);camera.aspect=1;camera.clearViewOffset();camera.updateProjectionMatrix();
  const animation=root.userData.sculptRuntime.animations[definitions[key]?.[0]];
  const duration=key==='hunt'?10:key==='roarSweep'?ROAR_SWEEP_DURATION:CUSTOM[key]?.duration||animation?.duration||6;
  const step=duration/1.25/frames;
  function advance(){let left=step;while(left>0){const dt=Math.min(.025,left);actions.update(dt);left-=dt;}root.updateMatrixWorld(true);root.traverse(n=>n.skeleton?.update());}
  const box=new T.Box3();actions.mixer.stopAllAction();actions.play(key);
  for(let i=0;i<frames;i++){advance();box.union(new T.Box3().setFromObject(root,true));}
  const target=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
  const direction=new T.Vector3(...viewDirection(id));
  let distance=Math.max(size.x,size.y,size.z)*1.65;
  if(closeup){const forward=direction.clone().normalize(),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),forward).normalize(),up=new T.Vector3().crossVectors(forward,right),tan=Math.tan(T.MathUtils.degToRad(camera.fov/2));distance=0;
   for(const x of [-.5,.5])for(const y of [-.5,.5])for(const z of [-.5,.5]){const v=new T.Vector3(size.x*x,size.y*y,size.z*z);distance=Math.max(distance,Math.max(Math.abs(v.dot(right)),Math.abs(v.dot(up)))/tan+v.dot(forward));}distance*=1.12;
  }
  const atlas=document.createElement('canvas');atlas.width=columns*resolution;atlas.height=Math.ceil(frames/columns)*resolution;const ctx=atlas.getContext('2d');
  actions.mixer.stopAllAction();actions.play(key);
  for(let i=0;i<frames;i++){
   advance();if(key!=='hunt'){controls.target.copy(target);camera.position.copy(target).add(direction.clone().normalize().multiplyScalar(distance));controls.update();}
   renderer.render(scene,camera);ctx.drawImage(renderer.domElement,(i%columns)*resolution,Math.floor(i/columns)*resolution,resolution,resolution);
  }
  stop();floor.visible=true;ring.visible=true;resize();return atlas.toDataURL('image/webp',closeup?.94:.88);
 }

 return {capturePortrait(){fit(false);renderer.render(scene,camera);return renderer.domElement.toDataURL("image/webp",.9);},captureAction,load,play,fit,stop,setActive(value){active=value;if(!value){entrance.cancel();stop();}},get definitions(){return definitions;},get state(){return {id,held:actions?.state.paused,clip:lastKey,pedestal:false,cameraMoving:entrance.active,camera:camera.position.toArray()};}};
}
