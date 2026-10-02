import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {testTurtle} from './turtle-rig-fixture.mjs';import {createTurtleShoreMotion} from '../src/turtle-shore-motion.js';import {sampleShore,createShoreState} from '../src/turtle-shore-state.js';
test('real FBX crawling keeps skin above sand through strides, turns, stops and nesting poses',()=>{
const {actor,root,mixer,source}=testTurtle(),motion=createTurtleShoreMotion(root,actor),v=new T.Vector3();let minimum=Infinity,maximumBody=0,maxJump=0,prev=null;
for(const z of [-18,-7])for(const yaw of [0,.8,Math.PI]){actor.position.set(0,0,z);actor.rotation.y=yaw;prev=null;
for(let i=0;i<100;i++){motion.restore();mixer.update(.02);const moving=i<80;if(moving){actor.position.x-=Math.sin(yaw)*.018;actor.position.z-=Math.cos(yaw)*.018;}motion.update(.02,1,moving,null);if(prev!==null)maxJump=Math.max(maxJump,Math.abs(actor.position.y-prev));prev=actor.position.y;maximumBody=Math.max(maximumBody,motion.contact.bodyGap);if(i%20===19)source.traverse(m=>{if(!m.isSkinnedMesh)return;for(let j=0;j<m.geometry.attributes.position.count;j++){m.getVertexPosition(j,v);m.localToWorld(v);minimum=Math.min(minimum,v.y-sampleShore(v.x,v.z).height);}});}}
assert.ok(minimum>-.05,`skin penetration ${minimum}`);assert.ok(maximumBody<.2,`body floats ${maximumBody}`);assert.ok(maxJump<.15,`body jumps ${maxJump}`);
for(const stage of ['bodyPit','dig','lay','cover','disguise'])for(let i=0;i<90;i++){motion.restore();mixer.update(.02);motion.update(.02,1,false,{busy:true,stage,time:i*.02});assert.ok(Number.isFinite(actor.position.y));}
motion.restore();mixer.update(0);const saved=source.getObjectByName('flipper-left001').quaternion.clone();motion.update(.02,1,false,null);motion.restore();assert.deepEqual(saved.toArray(),source.getObjectByName('flipper-left001').quaternion.toArray());motion.dispose();console.log({minimum,maximumBody,maxJump});
});
test('shore entry and exit remain continuous with the real rig',()=>{const {actor,root,mixer}=testTurtle(),motion=createTurtleShoreMotion(root,actor),state=createShoreState();let prev=null,maxJump=0;for(let i=0;i<800;i++){actor.position.z=i<400?15-i*.055:-7+(i-400)*.055;motion.restore();mixer.update(.02);state.update(.02,actor.position.x,actor.position.z);motion.update(.02,state.land,true,null);assert.ok(Math.min(...motion.contact.flipperGaps,motion.contact.bodyGap)>-.02,'blended pose crosses terrain');if(prev!==null)maxJump=Math.max(maxJump,Math.abs(actor.position.y-prev));prev=actor.position.y;}assert.equal(state.mode,'swim');assert.ok(maxJump<.15,`shore jump ${maxJump}`);motion.dispose();});

test('crawl paddles remain outboard of shoulders through full strides and turns',()=>{
 const {actor,root,mixer,source}=testTurtle(),motion=createTurtleShoreMotion(root,actor),base=new T.Vector3(),tip=new T.Vector3();
 for(const yaw of [0,.8,Math.PI]){actor.rotation.y=yaw;
  for(let i=0;i<180;i++){motion.restore();mixer.update(.02);actor.position.x-=Math.sin(yaw)*.042;actor.position.z-=Math.cos(yaw)*.042;motion.update(.02,1,true,null);
   for(const [side,sign]of [['left',-1],['right',1]])for(const kind of ['flipper','hind']){
    const names=kind==='flipper'?['002','004','005']:['002','003'];
    source.getObjectByName(`${kind}-${side}001`).getWorldPosition(base);actor.worldToLocal(base);
    let previous=base.x;
    for(const suffix of names){source.getObjectByName(`${kind}-${side}${suffix}`).getWorldPosition(tip);actor.worldToLocal(tip);assert.ok(sign*(tip.x-previous)>.015,`${kind}-${side}${suffix} folds inward at frame ${i}`);previous=tip.x;}
   }
  }
 }motion.dispose();
});
