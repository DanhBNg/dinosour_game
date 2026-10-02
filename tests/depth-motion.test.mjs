import test from 'node:test';
import assert from 'node:assert/strict';
import {createDepthMotion} from '../src/core/depth-motion.js';

test('held movement stays constant across animation boundaries',()=>{
 const motion=createDepthMotion();motion.begin('rise',0,2);let height=0;
 for(let frame=0;frame<120;frame++){
  const next=motion.update(1/60,height,'rise');
  assert.ok(Math.abs(next.height-height-2.5/60)<1e-10);assert.equal(next.finished,false);height=next.height;
 }
 assert.ok(Math.abs(height-5)<1e-10);
 const stopped=motion.update(1/60,height,undefined);assert.equal(stopped.height,height);assert.equal(stopped.finished,true);
});

test('held direction can reverse immediately and respects both depth limits',()=>{
 const motion=createDepthMotion();motion.begin('rise',3,5);
 assert.equal(motion.update(.2,3,'rise').height,3.5);
 assert.equal(motion.update(.2,3.5,'dive').height,3);
 assert.deepEqual(motion.update(10,3,'dive'),{height:0,action:'dive',finished:true});
 assert.deepEqual(motion.update(10,0,'rise'),{height:6,action:'rise',finished:true});
});

test('single activation without holding preserves the original two-unit stroke',()=>{
 const motion=createDepthMotion();motion.begin('rise',2,4);
 assert.equal(motion.update(.8,2,undefined).height,3);
 assert.deepEqual(motion.update(.8,3,undefined),{height:4,action:'rise',finished:true});
});
