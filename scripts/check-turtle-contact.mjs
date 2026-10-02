import * as T from 'three';
import {testTurtle} from '../tests/turtle-rig-fixture.mjs';
import {createTurtleShoreMotion} from '../src/turtle-shore-motion.js';
import {sampleShore} from '../src/turtle-shore-state.js';
const {actor,root,mixer,source}=testTurtle(),motion=createTurtleShoreMotion(root,actor);let min=1,max=0,maxY=0,prev=0,delta=0;
for(let frame=0;frame<240;frame++){motion.restore();mixer.update(1/60);actor.position.z-=.9/60;motion.update(1/60,1,true,null);min=Math.min(min,...motion.contact.flipperGaps);max=Math.max(max,motion.contact.bodyGap);maxY=Math.max(maxY,actor.position.y);if(frame)delta=Math.max(delta,Math.abs(actor.position.y-prev));prev=actor.position.y;if(frame%30===0)console.log(frame,JSON.stringify(motion.contact));}
console.log({min,max,maxY,delta});
let actual=Infinity;source.traverse(m=>{if(!m.isSkinnedMesh)return;const v=new T.Vector3();for(let i=0;i<m.geometry.attributes.position.count;i++){m.getVertexPosition(i,v);m.localToWorld(v);actual=Math.min(actual,v.y-sampleShore(v.x,v.z).height);}});console.log('full skin gap',actual);
