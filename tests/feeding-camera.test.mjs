import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,Vector3,Quaternion} from 'three';
import {createFeedingCamera} from '../src/core/feeding-camera.js';

test('feeding camera focuses on the mouth and restores the previous orbit relative to player',()=>{
 const camera=new PerspectiveCamera();camera.position.set(0,8,14);
 const controls={target:new Vector3(0,3,0),enabled:true},player=new Vector3(0,2,0),mouth=new Vector3(0,3,-1);
 const focus=createFeedingCamera(camera,controls);
 focus.update(0,3.8,player,new Quaternion(),mouth);assert.deepEqual(camera.position.toArray(),[0,8,14]);
 focus.update(1.3,3.8,player,new Quaternion(),mouth);
 assert.ok(camera.position.distanceTo(mouth)<4.1);assert.ok(controls.target.distanceTo(mouth)<.1);assert.equal(controls.enabled,false);
 player.x=2;focus.update(null,3.8,player,new Quaternion(),mouth);
 assert.deepEqual(camera.position.toArray(),[2,8,14]);assert.deepEqual(controls.target.toArray(),[2,3,0]);assert.equal(controls.enabled,true);
});

test('user interaction cancels the close-up and reduced motion leaves camera alone',()=>{
 const camera=new PerspectiveCamera();camera.position.set(0,8,14);
 const controls={target:new Vector3(),enabled:true},player=new Vector3(),mouth=new Vector3(0,1,-1);
 const focus=createFeedingCamera(camera,controls);
 focus.update(1,3.8,player,new Quaternion(),mouth);focus.cancel(player);
 assert.equal(focus.update(2,3.8,player,new Quaternion(),mouth),false);assert.equal(controls.enabled,true);
 assert.deepEqual(camera.position.toArray(),[0,8,14]);
 const reduced=createFeedingCamera(camera,controls,{reducedMotion:true});
 assert.equal(reduced.update(1,3.8,player,new Quaternion(),mouth),false);assert.deepEqual(camera.position.toArray(),[0,8,14]);
});
