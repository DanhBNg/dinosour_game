import {createNestModel} from './turtle-nest-model.js';
import * as T from 'three';
import {createNestState,NEST_STAGES} from './turtle-nest-state.js';
import {sampleShore} from './turtle-shore-state.js';

export function createTurtleNesting(scene,host,actor,world){
 const state=createNestState(),panel=document.createElement('div');panel.className='nesting-ui';
 panel.innerHTML='<div class="nesting-guide" role="status"><strong>Lên bờ đẻ trứng</strong><div class="nesting-progress"><i></i></div><span></span></div><div class="nesting-controls"><button data-nest-action><span></span><kbd>1</kbd></button><button data-nest-cancel hidden>Dừng<kbd>2</kbd></button><button data-nest-reset aria-label="Chơi lại map làm tổ">↻</button></div>';
 host.append(panel);
 const action=panel.querySelector('[data-nest-action]'),cancel=panel.querySelector('[data-nest-cancel]'),reset=panel.querySelector('[data-nest-reset]'),message=panel.querySelector('.nesting-guide>span');
 const nestModel=createNestModel(scene,world);
 const group=new T.Group();scene.add(group);
 const grains=new T.InstancedMesh(new T.IcosahedronGeometry(.055,0),new T.MeshStandardMaterial({color:0xe6c68f}),20);grains.visible=false;grains.frustumCulled=false;group.add(grains);const dummy=new T.Object3D();
 let onReset=()=>{},enabled=true,land=0;
 function act(){if(!enabled)return;if(state.start(actor.position))actor.rotation.y=state.site.yaw??=(actor.rotation.y);}
 action.onclick=act;cancel.onclick=()=>state.cancel();reset.onclick=()=>{state.reset();onReset();};
 return {state,set onReset(fn){onReset=fn;},setActive(value){enabled=value;panel.hidden=!value;if(!value)state.cancel();},fire(slot){if(slot===0)act();else if(slot===1)state.cancel();},
  update(dt,moving,shore){
   land=shore.land;state.update(dt);state.returnToSea(shore.mode==='swim'&&actor.position.z>12);
   action.disabled=!state.canStart(actor.position)||land<.98;action.querySelector('span').textContent=state.busy?NEST_STAGES[state.stage].label:state.stage==='bodyPit'&&!state.time?'Làm tổ':state.stage==='return'?'Về biển':state.stage==='complete'?'Hoàn thành':'Tiếp tục';panel.querySelector('.nesting-progress i').style.width=(Math.min(5,['bodyPit','dig','lay','cover','disguise','return','complete'].indexOf(state.stage)+state.progress)/5*100)+'%';cancel.hidden=!state.busy;
   message.textContent=state.stage==='complete'?'Rùa mẹ đã trở lại biển. Trứng tiếp tục phát triển trong cát.':state.stage==='return'?'Đã che kín tổ. Đưa rùa về phía biển.':state.busy?NEST_STAGES[state.stage].label+'…':!sampleShore(actor.position.x,actor.position.z).dry?'Đi lên bãi cát khô phía trước.':state.site&&!state.canStart(actor.position)?'Trở lại vị trí tổ để tiếp tục.':'Chọn Làm tổ. Rùa sẽ tự hoàn thành các bước.';
   nestModel.update(state);
   grains.visible=state.busy&&['bodyPit','dig','cover','disguise'].includes(state.stage);
   if(grains.visible){for(let i=0;i<20;i++){const p=(state.time*1.4+i/20)%1,side=Math.floor(state.time*1.4+i/20)%2?1:-1;dummy.position.set(side*(.8+p*1.4),.12+Math.sin(p*Math.PI)*.6,(state.stage==='dig'||state.stage==='cover'?1.3:-.5)+p*.6);dummy.position.applyAxisAngle(new T.Vector3(0,1,0),actor.rotation.y).add(new T.Vector3(actor.position.x,sampleShore(actor.position.x,actor.position.z).height,actor.position.z));dummy.scale.setScalar(1-p);dummy.updateMatrix();grains.setMatrixAt(i,dummy.matrix);}grains.instanceMatrix.needsUpdate=true;}
  },dispose(){panel.remove();group.removeFromParent();nestModel.dispose();grains.geometry.dispose();grains.material.dispose();grains.dispose();}
 };
}
