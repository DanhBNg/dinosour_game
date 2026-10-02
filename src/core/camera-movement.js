import {Vector3} from 'three';

export function createCameraMovement(){
 const right=new Vector3(),lastRight=new Vector3(1,0,0);
 return (input,camera,output)=>{
  right.set(1,0,0).applyQuaternion(camera.quaternion);right.y=0;
  if(right.lengthSq()>1e-8)lastRight.copy(right).normalize();
  return output.set(lastRight.x*input.x-lastRight.z*input.y,lastRight.z*input.x+lastRight.x*input.y);
 };
}
