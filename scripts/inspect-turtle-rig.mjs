import fs from 'node:fs';
import * as T from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
T.TextureLoader.prototype.load=function(){return new T.Texture();};
const b=fs.readFileSync('assets/sea/model-47a-loggerhead-sea-turtle/source/Loggerhead 18.fbx');
const root=new FBXLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');root.updateMatrixWorld(true);
console.log('clips',root.animations.map(c=>({name:c.name,duration:c.duration,tracks:c.tracks.map(t=>t.name)})));
root.traverse(n=>{if(n.isBone)console.log(n.name,'parent',n.parent.name,'local',n.position.toArray(),'q',n.quaternion.toArray(),'world',n.getWorldPosition(new T.Vector3()).toArray());if(n.isMesh)console.log('mesh',n.name,n.geometry.attributes.position.count,n.skeleton?.bones.length);});
console.log('bounds',new T.Box3().setFromObject(root,true));
