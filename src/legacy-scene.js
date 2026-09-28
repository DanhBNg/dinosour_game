import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createTrexModel} from './creatures/model.js';
import {createImportedCreature} from './creatures/imported-creature.js';
import {createPterosaurModel} from './creatures/pterosaur.js';
import {ACTIONS,createTrexActions} from './creatures/legacy-actions.js';
import {createHuntActions} from './creatures/hunt.js';
import {createEntranceCamera} from './creatures/entrance-camera.js';

export function createHabitat(host){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.prepend(renderer.domElement);
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
  if(next==='trex'){
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
  const base=createTrexActions(root,next==='trex'?ACTIONS:definitions);base.setSpeed(1.25);
  actions=prey?createHuntActions({base,predator:root,prey,scene,camera,controls,floor,ring}):base;
  actions.update(.001);actions.pause();lastKey=null;resize();return true;
 }
 function play(key){if(!actions)return false;entrance.cancel();const ok=actions.play(key);if(ok){lastKey=key;if(!actions.hunt?.active)fit(false);}return ok;}
 function stop(){if(actions&&!actions.state.paused)actions.pause();}
 function fit(animate=true){if(!root)return;if(actions?.hunt?.active){actions.frameView('hero');return;}entrance.frame(root,id,{animate});}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(root&&active)fit(false);}
 new ResizeObserver(resize).observe(host);
 let last=performance.now();function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;if(!active||document.hidden)return;actions?.update(dt);entrance.update(dt);controls.update();renderer.render(scene,camera);}requestAnimationFrame(frame);
 return {load,play,fit,stop,setActive(value){active=value;if(!value){entrance.cancel();stop();}},get definitions(){return definitions;},get state(){return {id,held:actions?.state.paused,clip:lastKey,cameraMoving:entrance.active,camera:camera.position.toArray()};}};
}
