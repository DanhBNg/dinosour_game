import test from 'node:test';
import assert from 'node:assert/strict';
import {installContentInteractionPolicy} from '../src/components/content-interaction.js';

function setup(){
 const listeners=new Map();
 const dispose=installContentInteractionPolicy({addEventListener:(type,listener)=>listeners.set(type,listener),removeEventListener:type=>listeners.delete(type)});
 const fire=(type,options={})=>{
  const event={target:{closest:()=>null},preventDefault(){this.defaultPrevented=true;},defaultPrevented:false,...options};
  listeners.get(type)?.(event);return event.defaultPrevented;
 };
 return {fire,dispose,listeners};
}

test('blocks selection, clipboard, native dragging and context menus on game UI',()=>{
 const {fire,dispose,listeners}=setup();
 for(const type of ['selectstart','copy','cut','contextmenu','dragstart'])assert.equal(fire(type),true);
 for(const key of ['a','c','x','A','C']){
  assert.equal(fire('keydown',{ctrlKey:true,key}),true);
  assert.equal(fire('keydown',{metaKey:true,key}),true);
 }
 for(const key of ['ArrowUp','a','1','Tab','Enter'])assert.equal(fire('keydown',{key}),false);
 assert.equal(fire('keydown',{ctrlKey:true,key:'+'}),false);
 dispose();assert.equal(listeners.size,0);
});

test('text fields and editable content retain normal editing',()=>{
 const {fire}=setup();
 for(const target of [{closest:()=>({})},{isContentEditable:true},{nodeType:3,parentElement:{isContentEditable:true}}]){
  for(const type of ['selectstart','copy','cut','contextmenu','dragstart'])assert.equal(fire(type,{target}),false);
  assert.equal(fire('keydown',{target,ctrlKey:true,key:'a'}),false);
 }
});
