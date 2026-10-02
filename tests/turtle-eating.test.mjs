import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {turtleEatPose,EAT_DURATION,createTurtleJaw} from '../src/pages/ocean-world/loggerhead/eating.js';
import {createTurtleActivities} from '../src/pages/ocean-world/loggerhead/turtle-activities.js';

test('eat timeline opens, bites, chews three times, swallows, and settles',()=>{
 assert.equal(turtleEatPose(0).jaw,0);
 assert.ok(turtleEatPose(.6).jaw>.9);
 assert.equal(turtleEatPose(.9).phase,'bite');
 for(let cycle=0;cycle<3;cycle++)assert.ok(turtleEatPose(1.05+(cycle+.5)*1.6/3).chew>.99);
 assert.equal(turtleEatPose(2.9).phase,'swallow');
 assert.equal(turtleEatPose(3).swallowed,false);assert.equal(turtleEatPose(3.2).swallowed,true);
 assert.equal(turtleEatPose(EAT_DURATION).jaw,0);assert.equal(turtleEatPose(EAT_DURATION).reach,0);
 assert.ok(turtleEatPose(1.3).preyScale>.75);assert.ok(turtleEatPose(1.3).mouthOffset>.35);
});

test('actual turtle mesh has a finite, reusable jaw morph and an animated mouth anchor',()=>{
 const originalLoad=T.TextureLoader.prototype.load;
 T.TextureLoader.prototype.load=()=>new T.Texture();
 let root;
 try{
  const buffer=readFileSync(new URL('../assets/sea/model-47a-loggerhead-sea-turtle/source/Loggerhead 18.fbx',import.meta.url));
  root=new FBXLoader().parse(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
 }finally{T.TextureLoader.prototype.load=originalLoad;}
 const mesh=root.getObjectByName('loggerheadbody'),original=mesh.geometry.attributes.position;
 const jaw=createTurtleJaw(root),morph=mesh.geometry.morphAttributes.position.at(-1);
 assert.equal(morph.name,'feeding-jaw');let changed=0;
 for(let index=0;index<original.count;index++){
  const before=new T.Vector3().fromBufferAttribute(original,index),after=new T.Vector3().fromBufferAttribute(morph,index);
  assert.ok(after.toArray().every(Number.isFinite));
  if(before.distanceTo(after)>1e-5)changed++;
 }
 assert.ok(changed>100);assert.ok(changed<original.count/2);
 const count=mesh.geometry.morphAttributes.position.length;createTurtleJaw(root);assert.equal(mesh.geometry.morphAttributes.position.length,count);
 const base={state:{paused:false,speed:1,id:'clip0'},play(){return true;},update(){},dispose(){}};
 const actions=createTurtleActivities(base,root),mouth=new T.Vector3();actions.play('eat');
 for(let tick=0;tick<24;tick++)actions.update(.025);
 assert.ok(mesh.morphTargetInfluences.at(-1)>.9);actions.getMouthPosition(mouth);assert.ok(mouth.toArray().every(Number.isFinite));
 const visibleMouth=[];root.traverse(node=>{if(node.name==='feeding-mouth-interior'&&node.visible)visibleMouth.push(node);});
 assert.equal(visibleMouth.length,1);assert.ok(visibleMouth[0].scale.y>0);
 const preyAnchor=actions.getMouthPosition(new T.Vector3(),true);assert.ok(preyAnchor.distanceTo(mouth)>0);
 actions.play('clip0');assert.equal(mesh.morphTargetInfluences.at(-1),0);actions.dispose();jaw.dispose();
 root.traverse(node=>{node.geometry?.dispose();if(node.material)for(const material of Array.isArray(node.material)?node.material:[node.material]){material.map?.dispose();material.dispose();}});
});
