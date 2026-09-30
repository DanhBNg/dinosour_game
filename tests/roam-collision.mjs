import assert from 'node:assert/strict';
import {createRoamWorld,moveWithinMap} from '../src/roam-world.js';
for(const sea of [false,true]){
 const world=createRoamWorld(sea);
 for(let angle=0;angle<Math.PI*2;angle+=.04){
  const p={x:0,z:0};
  for(let i=0;i<1500;i++){
   moveWithinMap(p,Math.cos(angle)*.13,Math.sin(angle)*.13,world.obstacles,sea?1.4:2);
   assert.ok(Math.hypot(p.x,p.z)<=55.001,'boundary');
   for(const o of world.obstacles)assert.ok(Math.hypot(p.x-o.x,p.z-o.z)>=o.r+(sea?1.4:2)-.01,'obstacle');
  }
 }
 world.dispose();console.log('PASS boundaries and obstacles',sea?'sea':'land');
}
