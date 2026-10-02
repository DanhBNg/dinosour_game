import test from 'node:test';
import assert from 'node:assert/strict';
import {createHoldActions} from '../src/components/hold-actions.js';

function button(){
 const listeners=new Map(),captured=new Set();
 return {disabled:false,addEventListener:(name,handler)=>listeners.set(name,handler),removeEventListener:name=>listeners.delete(name),setPointerCapture:id=>captured.add(id),hasPointerCapture:id=>captured.has(id),releasePointerCapture:id=>captured.delete(id),
  fire(name,options={}){listeners.get(name)?.({button:0,pointerId:1,detail:1,preventDefault(){},...options});},listeners,captured};
}

test('pointer hold triggers immediately, repeats, then stops without an extra click',()=>{
 const calls=[],hold=createHoldActions(action=>calls.push(action)),control=button();hold.bind(control,'dive');
 control.fire('pointerdown');assert.equal(hold.action,'dive');hold.repeat();
 assert.deepEqual(calls,['dive','dive']);
 control.fire('pointerup');control.fire('click');hold.repeat();assert.equal(calls.length,2);assert.equal(control.captured.size,0);
 control.fire('click',{detail:0});assert.equal(calls.length,3);
 hold.dispose();assert.equal(control.listeners.size,0);
});

test('cancel, lost capture, blur reset and disposal stop repeats',()=>{
 for(const finish of ['pointercancel','lostpointercapture','reset','dispose']){
  const calls=[],hold=createHoldActions(action=>calls.push(action)),control=button();hold.bind(control,'rise');control.fire('pointerdown');
  if(finish==='reset'||finish==='dispose')hold[finish]();else control.fire(finish);
  hold.repeat();assert.deepEqual(calls,['rise']);assert.equal(hold.action,undefined);
 }
});

test('latest pointer or keyboard direction wins and keyboard autorepeat does not double-trigger',()=>{
 const calls=[],hold=createHoldActions(action=>calls.push(action));
 hold.press('Digit3','dive');hold.press('Digit3','dive');hold.press('pointer:2','rise');hold.repeat();
 assert.deepEqual(calls,['dive','rise','rise']);hold.release('pointer:2');assert.equal(hold.action,'dive');
 hold.reset();assert.equal(hold.action,undefined);
});
