import * as T from 'three';
import {createSurvivalProgress} from './progress.js';
import {loggerheadConfig} from './loggerhead.js';
import {createPreyModels} from './prey-models.js';
import {TURTLE_ACTIVITIES} from '../../pages/ocean-world/loggerhead/turtle-activities.js';
import {createSurvivalMinimap} from './minimap.js';
import {turtleEatPose} from '../../pages/ocean-world/loggerhead/eating.js';
import {createSurvivalCombat} from './combat.js';
import {createSurvivalHUD} from './hud.js';
import {createBossModel} from './boss-model.js';

export function createSurvivalJourney(scene,host,config=loggerheadConfig){
 let storage;try{storage=window.localStorage;}catch{}
 const progress=createSurvivalProgress(config,{storage}),group=new T.Group(),geometries=[],materials=[];
 scene.add(group);
 const combat=createSurvivalCombat(config,progress),hud=createSurvivalHUD(host,config,id=>useSkill(id));
 const position=new T.Vector3(0,2,0);
 let feeding=null,pendingSkill=null,skillTime=0,canAct=true,effectTime=0,effectKind='';
 let time=0,uiTimer=0,eventTimer=18+Math.random()*12,event=null,eventOrigin=new T.Vector3(),stamina=70,food=85,air=100,breathReady=true,actionCooldown=0,currentCrossed=false,lastStage=progress.state.stageIndex,lastLevel=progress.state.level;
 const prey=[],landmarks=[],preyModels=createPreyModels();
 function mesh(geometry,color,parent=group){
  const material=new T.MeshStandardMaterial({color,roughness:.65,flatShading:true});
  const result=new T.Mesh(geometry,material);parent.add(result);geometries.push(geometry);materials.push(material);return result;
 }
 function spawnPrey(type,index){
  const model=preyModels.create(type),body=model.body;group.add(body);
  const home=new T.Vector3((index%2?1:-1)*(2+index%3),type.height,-4-index*2.4);
  body.position.copy(home);prey.push({type,body,home,animate:model.animate,respawn:0,phase:Math.random()*6});
 }
 for(let index=0;index<9;index++)spawnPrey(config.preyTypes[index%config.preyTypes.length],index);
 const minimap=createSurvivalMinimap(host,config,prey);
 for(const mark of config.landmarks){
  const body=new T.Group();body.position.set(...mark.position);group.add(body);
  const ring=mesh(new T.TorusGeometry(mark.nest===undefined?2:1.6,.12,6,24),mark.id==='cave'?0x8dfff0:mark.nest===false?0xf8a56f:0xffdd85,body);ring.rotation.x=-Math.PI/2;
  const beacon=mesh(new T.OctahedronGeometry(.45),0xffe7a0,body);beacon.position.y=1.5;
  if(mark.id==='cave'){
   for(const side of [-1,1]){const pillar=mesh(new T.BoxGeometry(.7,3,3),0x406877,body);pillar.position.set(side*2,0,0);}
   mesh(new T.BoxGeometry(4.7,.6,3),0x406877,body).position.y=1.6;
   for(let index=0;index<7;index++){const angle=index/6*Math.PI;const rock=mesh(new T.DodecahedronGeometry(.9,0),0x356779,body);rock.position.set(Math.cos(angle)*2,Math.sin(angle)*1.6-.15,-.4);rock.scale.set(1,1,1.6);}
   const plus=new T.Group();body.add(plus);plus.position.set(0,2.5,0);
   mesh(new T.BoxGeometry(.8,.2,.15),0x9bffc4,plus);mesh(new T.BoxGeometry(.2,.8,.15),0x9bffc4,plus);
  }
  if(mark.nest!==undefined){const sand=mesh(new T.CylinderGeometry(2.6,3,.35,16),mark.nest?0xe9d49a:0xbca780,body);sand.position.y=-.8;}
  landmarks.push({mark,body,beacon});
 }
 const eggs=new T.Group();group.add(eggs);const beach=config.landmarks.find(mark=>mark.nest);eggs.position.set(...beach.position);
 for(let index=0;index<5;index++){const egg=mesh(new T.SphereGeometry(.22,8,6),0xfff5dc,eggs);egg.position.set(Math.sin(index*2)*.5,-.45,Math.cos(index*2)*.5);}
 const bossModel=createBossModel(mesh,group),shark=bossModel.body;
 const shieldVisual=mesh(new T.SphereGeometry(2.2,20,12),0x6dffc2);shieldVisual.material.transparent=true;shieldVisual.material.opacity=.18;shieldVisual.material.depthWrite=false;shieldVisual.visible=false;
 const attackFlash=mesh(new T.TorusGeometry(1,.1,6,20),0xffd780);attackFlash.visible=false;
 const dangerRing=mesh(new T.TorusGeometry(config.boss.attackRange,.1,6,32),0xff665c);dangerRing.rotation.x=-Math.PI/2;dangerRing.visible=false;dangerRing.material.transparent=true;
 const preyHalo=mesh(new T.TorusGeometry(.85,.07,6,24),0xffdc67);preyHalo.rotation.x=-Math.PI/2;preyHalo.visible=false;
 const current=mesh(new T.TorusGeometry(4,.16,6,32),0x9efffb);current.rotation.x=-Math.PI/2;current.visible=false;
 function distance(target){return Math.hypot(position.x-target.x,position.z-target.z);}
 function availablePrey(){return prey.find(item=>!item.captured&&item.respawn<=0&&distance(item.body.position)<2.7&&Math.abs(position.y-item.body.position.y)<1.5);}
 function nearbyMark(){return landmarks.find(item=>item.mark.minStage<=progress.state.stageIndex&&distance(item.body.position)<3&&Math.abs(position.y-item.body.position.y)<2);}
 function context(){
  const state=progress.state,landmark=nearbyMark();
  if(landmark?.mark.id==='cave')return {id:'hide',icon:'🏠',label:'Trú ẩn',enabled:true};
  if(landmark){
   if(landmark.mark.nest===false)return {id:'unsuitable',icon:'⚠️',label:'Kiểm tra cát',enabled:true};
   if(landmark.mark.nest&&!state.complete)return {id:state.dig<config.lifeMission.digCount?'dig':'eggs',icon:state.dig<config.lifeMission.digCount?'🕳️':'🥚',label:state.dig<config.lifeMission.digCount?`Đào ${state.dig}/${config.lifeMission.digCount}`:'Đẻ trứng',enabled:true};
   return {id:'explore',icon:'🔍',label:'Khám phá',enabled:!state.discoveries.includes(landmark.mark.id)};
  }
  return {id:'explore',icon:'🔍',label:'Đến gần vật thể',enabled:false};
 }
 function act(){
  const action=context();if(!action.enabled||actionCooldown>0)return false;actionCooldown=.7;
  const mark=nearbyMark()?.mark;
  if(action.id==='hide'){progress.discover(mark.id);stamina=progress.state.stage.stamina;hud.notify('🏠 Trong hang an toàn · +15 HP mỗi 2 giây','heal');}
  if(action.id==='explore'){progress.discover(mark.id);}
  if(action.id==='dig'){progress.discover(mark.id);progress.dig();}
  if(action.id==='eggs')progress.layEggs();
  return action.id;
 }
 function canUseSkill(id){return combat.canUse(id,position,!!feeding||!canAct||!!pendingSkill||skillTime>0);}
 function useSkill(id){if(!canUseSkill(id)||!combat.use(id,position))return false;pendingSkill=id;skillTime=TURTLE_ACTIVITIES[id].duration;return true;}
 function cancelFeeding(){if(!feeding)return;feeding.target.captured=false;feeding.target.body.scale.setScalar(1);feeding=null;actionCooldown=.5;}
 function updateUI(dt=0){
  const state=progress.state;
  hud.update(state,combat.state,canUseSkill,dt);
  minimap.update(position,{...state,boss:combat.state});
 }
 updateUI();
 return {
  get state(){return {...progress.state,food,air,stamina,event:event?.id||null,sharkMode:combat.state.phase,boss:combat.state,feeding:feeding?{phase:turtleEatPose(feeding.time).phase,time:feeding.time}:null,context:context(),prey:prey.map(item=>({type:item.type.id,position:item.body.position.toArray(),active:item.respawn<=0}))};},
  useSkill,canUseSkill,
  takeSkillAction(){const action=pendingSkill;pendingSkill=null;return action;},
  get feedingTarget(){return feeding?.origin;},
  get context(){return context();},get stage(){return progress.state.stage;},
  get speed(){return config.baseSpeed*progress.state.stage.speed*(food<15?.75:1);},
  canBoost(){return stamina>=24;},
  boost(){if(!this.canBoost())return false;stamina-=24;return true;},
  act,
  update(dt,player,boosting=false,canAutoEat=true,mouthPosition=null){
   time+=dt;uiTimer-=dt;skillTime=Math.max(0,skillTime-dt);canAct=canAutoEat;actionCooldown=Math.max(0,actionCooldown-dt);position.copy(player);
   const state=progress.state;
   if(state.stageIndex!==lastStage){lastStage=state.stageIndex;stamina=state.stage.stamina;}
   player.y=Math.max(state.stage.maxDepth,Math.min(6,player.y));
   food=Math.max(0,food-dt*.16);stamina=Math.min(state.stage.stamina,stamina+dt*(boosting?0:6));
   if(player.y>=5.5){air=Math.min(100,air+dt*35);if(breathReady){progress.record('surface','air');breathReady=false;}}else{air=Math.max(0,air-dt*.7);if(player.y<4)breathReady=true;}
   if(air===0){player.y=6;air=40;}
   for(const item of prey){
    if(item.captured)continue;
    item.respawn=Math.max(0,item.respawn-dt);item.body.visible=item.respawn===0;
    item.body.scale.setScalar(1);
    const phase=time*item.type.motionSpeed+item.phase,radius=item.type.motionRadius;
    item.body.position.set(item.home.x+Math.sin(phase)*radius,item.home.y+(item.type.id==='fish'?Math.sin(time*2+item.phase)*.08:0),item.home.z+Math.cos(phase)*radius*.6);
    if(item.type.id!=='crab')item.body.rotation.y=Math.atan2(Math.sin(phase)*.6,Math.cos(phase));
    if(item.body.visible)item.animate(time+item.phase);
   }
   for(const item of landmarks){item.body.visible=item.mark.minStage<=state.stageIndex;item.beacon.rotation.y+=dt;item.beacon.visible=!state.discoveries.includes(item.mark.id);}
   eggs.visible=state.complete;
   eventTimer-=dt;
   if(eventTimer<=0&&!event){const choices=config.events.filter(item=>item.minStage<=state.stageIndex);event=choices[Math.floor(Math.random()*choices.length)];eventTimer=event.duration;eventOrigin.copy(player);currentCrossed=false;
    if(event.id==='swarm')prey.filter(item=>item.type.id==='fish'&&!item.captured).forEach((item,index)=>{item.home.set(player.x+(index-1)*2,Math.max(2,player.y),player.z-3);const radius=Math.hypot(item.home.x,item.home.z);if(radius>48){item.home.x*=48/radius;item.home.z*=48/radius;}item.respawn=0;});
   }else if(event&&eventTimer<=0){event=null;eventTimer=25+Math.random()*20;}
   current.visible=event?.id==='current';
   if(current.visible){current.position.copy(eventOrigin);if(distance(eventOrigin)<4){player.x+=dt*1.6;currentCrossed=true;}else if(currentCrossed){progress.record('current','current');progress.reward(8);currentCrossed=false;event=null;eventTimer=30;}}
   position.copy(player);
   if(feeding){
    feeding.time=Math.min(TURTLE_ACTIVITIES.eat.duration,feeding.time+dt);
    const pose=turtleEatPose(feeding.time),target=feeding.target;
    const mouth=mouthPosition||position;
    target.body.position.lerpVectors(feeding.origin,mouth,pose.bite);
    target.body.scale.setScalar(pose.preyScale);
    if(pose.swallowed&&!feeding.counted){feeding.counted=true;target.respawn=14;target.body.visible=false;food=Math.min(100,food+target.type.food);const exp=progress.record('eat',target.type.id);hud.float(`+${exp} EXP`);updateUI();}
    if(feeding.time>=TURTLE_ACTIVITIES.eat.duration){target.captured=false;feeding=null;actionCooldown=.25;}
   }
   combat.update(dt,player);position.copy(player);
   const bossState=combat.state;
   shark.visible=bossState.active;shark.position.set(bossState.position.x,bossState.position.y,bossState.position.z);
   shark.lookAt(player);bossModel.update(time,bossState.warning);
   shieldVisual.visible=bossState.shield>0;shieldVisual.position.copy(player);shieldVisual.position.y+=1;
   shieldVisual.scale.setScalar(1+Math.sin(time*5)*.035);
   dangerRing.visible=bossState.warning;dangerRing.position.copy(shark.position);dangerRing.position.y-=.8;
   dangerRing.material.opacity=.6+.4*Math.sin(time*15);
   effectTime=Math.max(0,effectTime-dt);attackFlash.visible=effectTime>0;
   if(attackFlash.visible){attackFlash.position.copy(effectKind==='hit'?shark.position:player);attackFlash.position.y+=.8;attackFlash.scale.setScalar(1+(1-effectTime/.6)*1.8);attackFlash.rotation.z+=dt*8;}
   const nearby=availablePrey();preyHalo.visible=!!nearby&&!feeding&&!bossState.combat;
   if(nearby){preyHalo.position.copy(nearby.body.position);preyHalo.position.y-=.5;preyHalo.scale.setScalar(1+Math.sin(time*5)*.08);}
   let interruption=null;
   for(const event of combat.drainEvents()){
    if(event.type==='spawn')hud.notify('⚠ Cá mập khổng lồ xuất hiện!','danger');
    if(event.type==='warning')hud.notify('⚠ Né vòng đỏ hoặc dùng Mai chắn!','danger');
    if(event.type==='hit'){hud.float(`−${event.damage} HP`,'hit');effectKind='hit';effectTime=.6;}
    if(event.type==='damage'){hud.float(`−${event.damage} HP`,'damage');cancelFeeding();interruption='hurt';effectKind='damage';effectTime=.6;}
    if(event.type==='blocked')hud.notify('🛡️ Mai chắn đã đỡ đòn!','heal');
    if(event.type==='shield')hud.notify('🛡️ Bảo vệ trong 3 giây','heal');
    if(event.type==='dodge')hud.notify('✨ Né đòn thành công!');
    if(event.type==='shelter'||event.type==='escape')hud.notify('🏠 Ẩn náu an toàn · Đang hồi máu','heal');
    if(event.type==='heal')hud.float(`+${event.amount} HP`,'heal');
    if(event.type==='victory'){hud.notify('🏆 Đã đánh bại cá mập!');hud.float(`+${event.exp} EXP`);}
    if(event.type==='recover'){cancelFeeding();pendingSkill=null;skillTime=0;interruption='recover';hud.notify('🏠 Rùa đã về hang nghỉ ngơi','heal');}
   }
   const latest=progress.state;
   if(latest.level>lastLevel){hud.notify(`⭐ Lên Lv ${latest.level}! ⚔ ATK ${latest.attack}`);lastLevel=latest.level;}
   if(uiTimer<=0){uiTimer=.1;progress.refreshDay();updateUI(.1);}
   if(interruption)return interruption;
   if(canAutoEat&&!feeding&&skillTime<=0&&!pendingSkill&&!combat.state.combat&&!combat.state.safe&&actionCooldown<=0){
    const target=availablePrey();
    if(target){
     actionCooldown=TURTLE_ACTIVITIES.eat.duration;target.captured=true;
     feeding={target,time:0,origin:target.body.position.clone(),counted:false};return 'eat';
    }
   }
  },
  dispose(){progress.save();group.removeFromParent();preyModels.dispose();geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());hud.dispose();minimap.dispose();}
 };
}
