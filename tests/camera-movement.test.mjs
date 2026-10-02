import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,Vector2,Vector3} from 'three';
import {createCameraMovement} from '../src/core/camera-movement.js';

test('joystick up and right follow the screen after every quarter-turn',()=>{
 const convert=createCameraMovement(),camera=new PerspectiveCamera(),output=new Vector2();
 for(const [position,up,right] of [
  [[0,8,12],[0,-1],[1,0]],
  [[12,8,0],[-1,0],[0,-1]],
  [[0,8,-12],[0,1],[-1,0]],
  [[-12,8,0],[1,0],[0,1]]
 ]){
  camera.position.set(...position);camera.lookAt(0,0,0);
  convert(new Vector2(0,-1),camera,output);assert.ok(output.distanceTo(new Vector2(...up))<1e-8);
  convert(new Vector2(1,0),camera,output);assert.ok(output.distanceTo(new Vector2(...right))<1e-8);
 }
});

test('pitch and zoom preserve analog strength and diagonal speed',()=>{
 const convert=createCameraMovement(),camera=new PerspectiveCamera(),output=new Vector2();
 for(const position of [[8,.1,8],[8,80,8],[.01,30,.01],[80,5,80],[0,30,0]]){
  camera.position.set(...position);camera.lookAt(new Vector3());
  for(const input of [new Vector2(),new Vector2(.2,-.3),new Vector2(1,-1).normalize()]){
   convert(input,camera,output);assert.ok(output.toArray().every(Number.isFinite));assert.ok(Math.abs(output.length()-input.length())<1e-8);
  }
 }
});

test('releasing the joystick never creates movement when orbiting',()=>{
 const convert=createCameraMovement(),camera=new PerspectiveCamera(),output=new Vector2();
 for(let step=0;step<36;step++){
  const angle=step*Math.PI/18;camera.position.set(Math.sin(angle)*10,8,Math.cos(angle)*10);camera.lookAt(0,0,0);
  convert(new Vector2(),camera,output);assert.equal(output.length(),0);
 }
});
