import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createNestModel} from '../src/turtle-nest-model.js';
test('3D nest opens terrain, lays eggs below its rim, fills and resets',()=>{
 const scene=new T.Scene();let hole=null;const model=createNestModel(scene,{setNestHole(h){hole=h;}}),state={site:{x:0,z:-15,yaw:0},stage:'dig',progress:.5,time:2};
 model.update(state);assert.ok(hole?.radius>0);const bowl=scene.getObjectByName('nest-cavity');assert.ok(bowl.visible);
 state.stage='lay';state.progress=.9;state.time=4.9;model.update(state);const eggs=scene.getObjectByName('turtle-nest').children.filter(x=>x.name.startsWith('nest-egg-'));assert.equal(eggs.filter(x=>x.visible).length,8);for(const e of eggs){assert.ok(e.position.y<1.8);assert.ok(Math.hypot(e.position.x-hole.x,e.position.z-hole.z)<hole.radius);}
 state.stage='cover';state.progress=.5;model.update(state);assert.ok(hole);state.stage='return';state.progress=0;model.update(state);assert.equal(hole,null);assert.ok(eggs.every(e=>!e.visible));assert.equal(bowl.visible,false);
 state.site=null;model.update(state);assert.equal(scene.getObjectByName('turtle-nest').visible,false);model.dispose();assert.equal(scene.children.length,0);
});
