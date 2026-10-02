import {createTurtleActivities,TURTLE_ACTIVITIES} from './loggerhead/turtle-activities.js';
import {createTurtleTurnActions} from './loggerhead/turtle-turn.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
const base='/assets/sea/';
export const marine={
 blueWhale:{name:'Cá voi xanh',file:'blue-whale/source/Kit anime.fbx',texture:'blue-whale/textures/material_Base_Color.jpg',env:'deep'},
 seal:{name:'Hải cẩu',file:'aniamted-seal/source/seal.glb',env:'coast'},
 squid:{name:'Mực đuôi cộc',file:'bobtail_squid/bobtail_squid.glb',env:'reef'},
 isopod:{name:'Bọ chân đều khổng lồ',file:'giant_isopod/giant_isopod.glb',env:'deep',bottom:true},
 hawksbill:{name:'Đồi mồi',file:'model_50a_-_hawksbill_sea_turtle/model_50a_-_hawksbill_sea_turtle.glb',env:'reef'},
 whale:{name:'Cá voi',file:'whale/whale.glb',env:'deep'},
 loggerhead:{name:'Rùa quản đồng',file:'model-47a-loggerhead-sea-turtle/source/Loggerhead 18.fbx',texture:'model-47a-loggerhead-sea-turtle/textures/loggerhead_8bit_albedo2.png',env:'reef'},
 tuna:{name:'Cá ngừ',file:'tuna-fish/source/TUNAFBX.fbx',texture:'tuna-fish/textures/MA_Material.001_BaseColor.png',env:'deep'},
 slug:{name:'Sên biển',file:'sea-slug-chromodoris-annae/source/ChromodorisAnnae.fbx',texture:'sea-slug-chromodoris-annae/textures/Chromodoris_Annae_diff.png',env:'reef',bottom:true},
 shark:{name:'Cá mập trắng',file:'great-white-shark-in-realistic-swimming-pose/source/Zyklus2_Zeile9/tripo_convert_d34d014d-90e9-4667-9776-9e1f64ac179d.fbx',texture:'great-white-shark-in-realistic-swimming-pose/textures/Zyklus2_Zeile9_basecolor.jpeg',env:'coast'},
 paShark:{name:'Cá mập',file:'pa-shark/source/PA Shark/Models/PA_Shark.fbx',texture:'pa-shark/textures/PA_SharkDiffuse.png',env:'coast'},
 fish:{name:'Cá biển',file:'sea-fish-with-anim/source/Black_White_Fish.FBX',texture:'sea-fish-with-anim/textures/Black_White_Fish.png',env:'reef'},
 amplectobelua:{name:'Amplectobelua',file:'amplectobelua-symbrachiata/source/amplectobelua/amplectobelua_anim.fbx',texture:'amplectobelua-symbrachiata/textures/amplectobelua_diffuse.png',env:'deep'}
};
// Temporarily hidden at the user's request; keep source assets for repair.
export const hiddenMarineIds=new Set(['isopod','hawksbill','whale','paShark','amplectobelua']);
export const lockedMarineIds=new Set(['blueWhale']);
export const visibleMarineIds=['loggerhead','tuna','shark','fish',...Object.keys(marine).filter(id=>!hiddenMarineIds.has(id)&&!['loggerhead','tuna','shark','fish','blueWhale'].includes(id)),'blueWhale'];
export async function loadMarine(id){
 const spec=marine[id],manager=new T.LoadingManager();
 // FBX files carry author-machine texture paths. Resolve the supplied diffuse explicitly.
 manager.setURLModifier(url=>/\.(png|jpe?g|tga|bmp)$/i.test(url)&&!url.startsWith('blob:')?base+spec.texture:url);
 let source,clips;
 if(/\.glb$/i.test(spec.file)){const g=await new GLTFLoader(manager).loadAsync(base+spec.file);source=g.scene;clips=g.animations;}
 else{source=await new FBXLoader(manager).loadAsync(base+spec.file);clips=source.animations||[];if(spec.texture){const map=await new T.TextureLoader().loadAsync(base+spec.texture);map.colorSpace=T.SRGBColorSpace;source.traverse(o=>{if(o.isMesh){o.material=new T.MeshStandardMaterial({map,roughness:.75,side:T.DoubleSide});}});}}
 // Strip exported rig curves without changing their hierarchy or animation targets.
 if(id==='blueWhale')source.traverse(o=>{if(o.isLine){o.geometry.dispose();o.geometry=new T.BufferGeometry();}});
 const remove=[];source.traverse(o=>{if(o.isCamera||o.isLight)remove.push(o);if(o.isMesh){o.castShadow=o.receiveShadow=true;o.frustumCulled=false;}});remove.forEach(o=>o.removeFromParent());
 const mixer=new T.AnimationMixer(source);if(clips[0]){mixer.clipAction(clips[0]).play();mixer.update(.001);}
 source.updateMatrixWorld(true);const box=new T.Box3().setFromObject(source,true),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3()),scale=6/Math.max(size.x,size.y,size.z);
 if(!Number.isFinite(scale))throw Error('Model has no visible geometry');
 const root=new T.Group(),visual=new T.Group();root.add(visual);visual.add(source);visual.scale.setScalar(scale);visual.position.set(-center.x*scale,-box.min.y*scale+(spec.bottom?0:1),-center.z*scale);
 mixer.stopAllAction();const animations={},definitions={};clips.forEach((clip,i)=>{const k='clip'+i;animations[k]=clip;definitions[k]=[k,(id==='slug'?(/move/i.test(clip.name)?'Di chuyển':/pose/i.test(clip.name)?'Tư thế gốc':'Nghỉ'):'Bơi')+(clips.length>1?' '+(i+1):''), 'Animation gốc',true];});
 if(!clips.length){const k='drift';animations[k]=new T.AnimationClip(k,6,[]);definitions[k]=[k,spec.bottom?'Quan sát':'Lướt trong nước','Chuyển động trình diễn; model chưa có animation khớp.',true];}
 if(id==='loggerhead')definitions.turn360=[null,'Lộn một vòng','Lăn quanh trục đầu–đuôi; vây tạo lực, thu gọn rồi mở ra hãm.',true];
 root.userData.sculptRuntime={source,animations,nodes:{},meshes:{}};
 if(id==='loggerhead')for(const [key,value] of Object.entries(TURTLE_ACTIVITIES))definitions[key]=[null,value.label,'',true];
 return {model:root,definitions,createActions(){let key=Object.keys(definitions)[0],time=0;const state={paused:true,speed:1,id:key};function play(k){if(!definitions[k])return false;mixer.stopAllAction();key=k;time=0;root.position.set(0,0,0);root.rotation.set(0,0,0);mixer.clipAction(animations[k]).reset().setLoop(T.LoopRepeat,Infinity).play();mixer.update(.001);source.updateMatrixWorld(true);source.traverse(o=>o.skeleton?.update());state.paused=false;state.id=k;return true;}const baseActions={state,mixer,play,update(dt){if(state.paused)return;time+=dt*state.speed;mixer.update(dt*state.speed);if(!clips.length&&!spec.bottom){root.position.y=.08*Math.sin(time*1.4);root.rotation.y=.06*Math.sin(time*.7);}},pause(){state.paused=!state.paused;},setSpeed(s){state.speed=s;},get progress(){return time/animations[key].duration%1;},dispose(){mixer.stopAllAction();}};return id==='loggerhead'?createTurtleActivities(createTurtleTurnActions(baseActions,root),root):baseActions;}};
}
