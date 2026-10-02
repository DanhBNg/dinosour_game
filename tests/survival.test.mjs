import test from 'node:test';
import assert from 'node:assert/strict';
import {createSurvivalProgress} from '../src/core/survival/progress.js';
import {loggerheadConfig as config} from '../src/core/survival/loggerhead.js';
import * as T from 'three';
import {createSurvivalJourney} from '../src/core/survival/journey.js';
import {createPreyModels} from '../src/core/survival/prey-models.js';
import {minimapPoint} from '../src/core/survival/minimap.js';
import {createSurvivalCombat} from '../src/core/survival/combat.js';
import {createBossModel} from '../src/core/survival/boss-model.js';

test('detailed shark has finite geometry, colored skin, animated jaw and tail',()=>{
 const scene=new T.Scene(),resources=[];
 const model=createBossModel((geometry,color,parent)=>{
  const material=new T.MeshStandardMaterial({color}),part=new T.Mesh(geometry,material);
  resources.push(geometry,material);parent.add(part);return part;
 },scene);
 try{
  const skin=model.body.getObjectByName('shark-skin');
  assert.equal(skin.material.flatShading,false);assert.ok(skin.geometry.getAttribute('color'));
  assert.equal(model.body.children.filter(part=>part.name==='shark-gill').length,10);
  model.body.traverse(part=>{if(part.isMesh)assert.ok([...part.geometry.getAttribute('position').array].every(Number.isFinite));});
  model.update(0,false);const jaw=model.body.getObjectByName('shark-jaw'),rest=jaw.rotation.x;
  model.update(.3,true);assert.ok(jaw.rotation.x>rest);assert.notEqual(model.body.getObjectByName('shark-tail').rotation.y,0);
  const size=new T.Box3().setFromObject(model.body).getSize(new T.Vector3());
  assert.ok(size.z>7&&size.z<9);assert.ok(size.x>5&&size.x<7);
 }finally{resources.forEach(resource=>resource.dispose());}
});

function encounter(exp=30,hp=80){
 const {game,reload}=setup(JSON.stringify({version:2,exp,hp}));
 const combat=createSurvivalCombat(config,game),player={x:0,y:2,z:0};
 const tick=seconds=>{for(let step=0;step<Math.round(seconds*100);step++)combat.update(.01,player);};
 return {game,reload,combat,player,tick};
}

test('levels have cumulative thresholds and attack gains',()=>{
 const {game}=setup();assert.equal(game.state.level,1);assert.equal(game.state.nextLevelExp,30);
 game.reward(30);assert.equal(game.state.level,2);assert.equal(game.state.levelExp,0);assert.equal(game.state.attack,12);
 game.reward(50);assert.equal(game.state.level,3);assert.equal(game.state.attack,14);
});

test('boss is level gated and announces before chasing',()=>{
 const {game,combat,tick}=encounter(0);tick(10);assert.equal(combat.state.phase,'dormant');
 game.reward(30);tick(6.1);assert.equal(combat.state.phase,'warning');
 assert.equal(combat.drainEvents().filter(event=>event.type==='spawn').length,1);
 tick(2.6);assert.equal(combat.state.phase,'chase');
});

test('skills enforce range, depth, busy state and cooldown; shield blocks bites',()=>{
 assert.deepEqual(config.skills.map(skill=>skill.name),['Tấn công','Phòng thủ']);
 const {combat,player,tick,game}=encounter();tick(8.7);
 assert.equal(combat.use('ram',player),false);
 Object.assign(player,combat.state.position);player.y+=10;assert.equal(combat.use('ram',player),false);
 Object.assign(player,combat.state.position);assert.equal(combat.use('ram',player,true),false);
 assert.equal(combat.use('ram',player),true);assert.equal(combat.state.hp,276);assert.equal(combat.use('ram',player),false);
 tick(1.3);assert.equal(combat.state.phase,'windup');
 assert.equal(combat.use('shield',player),true);tick(1.2);
 assert.equal(game.state.hp,80);assert.ok(combat.drainEvents().some(event=>event.type==='blocked'));
 tick(4);assert.equal(combat.state.cooldowns.ram,0);
});

test('telegraphed attacks can be dodged and unblocked attacks deal damage',()=>{
 const {combat,player,tick,game,reload}=encounter();tick(8.7);Object.assign(player,combat.state.position);
 tick(.02);assert.equal(combat.state.phase,'windup');player.x+=6;tick(1.2);
 assert.equal(game.state.hp,80);assert.ok(combat.drainEvents().some(event=>event.type==='dodge'));
 Object.assign(player,combat.state.position);tick(4);assert.equal(game.state.hp,72);assert.equal(reload().state.hp,72);
});

test('boss defeat grants rewards once and schedules respawn',()=>{
 const {combat,player,tick,game}=encounter(100000);tick(8.7);Object.assign(player,combat.state.position);
 const before=game.state.exp;assert.equal(combat.use('ram',player),true);
 assert.equal(combat.state.phase,'defeated');assert.equal(combat.state.hp,0);assert.equal(game.state.bossWins,1);
 assert.ok(game.state.exp>=before+50);const earned=game.state.exp;
 assert.equal(combat.use('bite',player),false);tick(2);assert.equal(game.state.exp,earned);
 tick(64);assert.equal(combat.state.active,true);assert.equal(combat.state.hp,300);
});

test('shelter requires matching depth, heals actual damage, and stops attacks',()=>{
 const {combat,player,tick,game}=encounter();tick(8.7);
 const home=config.landmarks.find(mark=>mark.id==='cave').position;
 Object.assign(player,{x:home[0],y:home[1]+4,z:home[2]});tick(2.1);assert.equal(game.state.hp,80);assert.equal(combat.state.safe,false);
 player.y=home[1];tick(2.1);assert.equal(combat.state.safe,true);assert.equal(game.state.hp,95);
 assert.equal(combat.use('shield',player),false);tick(2.1);assert.equal(game.state.hp,100);
 const exp=game.state.exp;tick(5);assert.equal(game.state.exp,exp);assert.equal(game.state.hp,100);
 assert.equal(game.state.missions.find(mission=>mission.type==='heal').progress,1);
});

test('zero HP returns turtle safely to shelter without losing progress',()=>{
 const {combat,player,tick,game}=encounter(30,1);tick(8.7);Object.assign(player,combat.state.position);tick(1.2);
 assert.ok(game.state.hp>=35);assert.equal(combat.state.safe,true);assert.equal(combat.state.phase,'retreat');
 assert.equal(game.state.exp,30);assert.ok(combat.drainEvents().some(event=>event.type==='recover'));
});

function setup(initial){
 let value=initial,day=new Date(2026,9,2,12);
 const storage={getItem:()=>value,setItem:(key,next)=>{value=next;}};
 const options={storage,now:()=>day,random:()=>.4};
 return {game:createSurvivalProgress(config,options),reload:()=>createSurvivalProgress(config,options),tomorrow:()=>{day=new Date(2026,9,3,12);}};
}

test('three unique, achievable daily missions survive reload',()=>{
 const {game,reload}=setup();
 assert.equal(game.state.missions.length,3);
 assert.equal(new Set(game.state.missions.map(mission=>mission.id)).size,3);
 assert.ok(game.state.missions.every(mission=>mission.minStage===0));
 assert.deepEqual(reload().state.missions,game.state.missions);
});

test('daily rewards are granted once and normal prey rewards continue',()=>{
 const {game,reload}=setup();
 for(const mission of game.state.missions){for(let count=0;count<mission.count;count++)game.record(mission.type,mission.target);}
 const earned=game.state.exp;game.reward(100);assert.equal(game.state.exp,earned+100);assert.equal(game.state.bonus,true);
 const restored=reload();
 const before=restored.state.exp;restored.record('heal','cave');assert.equal(restored.state.exp,before);
 restored.record('eat','fish');assert.equal(restored.state.exp,before+8);
});

test('existing EXP migrates and increases across days',()=>{
 const {game,tomorrow}=setup(JSON.stringify({version:1,exp:99}));game.reward(99);tomorrow();game.refreshDay();
 assert.equal(game.state.exp,198);assert.ok(game.state.level>1);
 game.reward(1);assert.equal(game.state.exp,199);
 game.reward(160);assert.equal(game.state.stage.id,'adult');assert.equal(game.state.exp,359);
});

test('life mission requires adulthood and correct site; badge persists',()=>{
 const young=setup().game;assert.equal(young.dig(),false);assert.equal(young.layEggs(),false);
 assert.equal(young.discover('beach'),false);
 const {game,reload}=setup(JSON.stringify({version:1,exp:260}));
 assert.equal(game.dig(),false);game.discover('beach');
 for(let count=0;count<3;count++)assert.equal(game.dig(),true);
 const before=game.state.exp;assert.equal(game.layEggs(),true);assert.equal(game.layEggs(),false);
 assert.equal(game.state.exp,before+config.lifeMission.rewardExp);assert.equal(reload().state.complete,true);
});

test('bad saves and unavailable storage do not crash gameplay',()=>{
 for(const value of ['broken','null','{"version":1,"exp":"bad","missions":{},"dig":-9}']){
  const {game}=setup(value);assert.equal(game.state.exp,0);assert.equal(game.state.missions.length,3);
 }
 const game=createSurvivalProgress(config,{storage:{getItem(){throw Error('denied');},setItem(){throw Error('quota');}}});
 game.reward(5);assert.equal(game.state.exp,5);assert.equal(game.state.storageFailed,true);
});

test('daily rollover clears counts without resetting growth or discoveries',()=>{
 const {game,tomorrow}=setup();game.reward(100);game.discover('feeding');
 const mission=game.state.missions[0];game.record(mission.type,mission.target);
 const exp=game.state.exp;tomorrow();game.refreshDay();
 assert.ok(game.state.missions.every(item=>item.progress===0));assert.equal(game.state.exp,exp);assert.deepEqual(game.state.discoveries,['feeding']);
});

function withJourney(exp,run){
 const oldDocument=globalThis.document,oldWindow=globalThis.window;
 function element(){const children=new Map();return {style:{},dataset:{},setAttribute(){},remove(){},querySelector(selector){if(!children.has(selector))children.set(selector,element());return children.get(selector);}};}
 let saved=JSON.stringify({version:1,exp});
 globalThis.document={createElement:element};globalThis.window={localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value;}}};
 const elements=[],scene=new T.Scene(),journey=createSurvivalJourney(scene,{append(element){elements.push(element);}});
 try{run(journey,scene,elements);}finally{journey.dispose();assert.equal(scene.children.length,0);globalThis.document=oldDocument;globalThis.window=oldWindow;}
}

test('skill HUD shows a radial countdown and clears it when cooldown finishes',()=>{
 withJourney(30,(journey,scene,elements)=>{
  const player=new T.Vector3(30,2,20);
  for(let tick=0;tick<90;tick++)journey.update(.1,player);
  const skills=elements.find(element=>element.className==='journey-skills');
  const shield=skills.querySelector('[data-skill="shield"]');
  assert.equal(journey.useSkill('shield'),true);journey.takeSkillAction();journey.update(.1,player);
  assert.equal(shield.dataset.cooling,'true');assert.equal(shield.disabled,true);
  assert.equal(shield.querySelector('.skill-countdown').textContent,'9');
  assert.match(shield.querySelector('.skill-cooldown-shade').style.background,/conic-gradient/);
  for(let tick=0;tick<95;tick++)journey.update(.1,player);
  assert.equal(shield.dataset.cooling,'false');assert.equal(shield.querySelector('.skill-countdown').textContent,'');
 });
});

test('eaten counter is uncapped, persistent and not reset each day',()=>{
 const {game,reload,tomorrow}=setup();
 for(let count=0;count<8;count++)game.record('eat','fish');
 game.record('eat','crab');game.record('eat','unknown');game.record('hide','cave');
 assert.equal(game.state.eaten,9);assert.equal(reload().state.eaten,9);
 const exp=game.state.exp;tomorrow();game.refreshDay();assert.equal(game.state.eaten,9);assert.equal(game.state.exp,exp);
 const snapshot=game.state;snapshot.eaten=100;assert.equal(game.state.eaten,9);
});

test('minimap positions track relative world coordinates without clamping distant prey',()=>{
 const player={x:12,z:20};
 assert.deepEqual(minimapPoint(player,player),{left:50,top:50,visible:true});
 assert.deepEqual(minimapPoint({x:26,z:6},player),{left:75,top:25,visible:true});
 assert.equal(minimapPoint({x:100,z:20},player).visible,false);
 assert.equal(minimapPoint({x:36,z:44},player).visible,false);
});

test('minimap prey markers follow movement, disappear when eaten and return on respawn',()=>{
 withJourney(0,(journey,scene,elements)=>{
  const map=elements.find(element=>element.className==='survival-minimap');
  const marker=map.querySelector('[data-prey="0"]');
  const player=new T.Vector3(0,2,0);journey.update(.1,player,false,false);
  const prey=journey.state.prey[0],expected=minimapPoint({x:prey.position[0],z:prey.position[2]},player);
  assert.equal(marker.style.left,`${expected.left}%`);assert.equal(marker.hidden,false);
  player.set(...prey.position);assert.equal(journey.update(.01,player),'eat');assert.equal(marker.hidden,false);
  journey.update(3.2,player,false,false);assert.equal(marker.hidden,true);
  for(let tick=0;tick<150;tick++)journey.update(.1,player,false,false);
  assert.equal(marker.hidden,false);
  player.set(40,2,25);journey.update(.2,player,false,false);assert.equal(marker.hidden,true);
 });
});

test('older and malformed saves initialize a safe eaten counter',()=>{
 for(const eaten of [undefined,-1,'3',1.5]){
  const {game}=setup(JSON.stringify({version:1,exp:10,eaten}));
  assert.equal(game.state.eaten,0);game.record('eat','crab');assert.equal(game.state.eaten,1);assert.equal(game.state.exp,20);
 }
});

test('per-species counters persist independently across reloads and days',()=>{
 const {game,reload,tomorrow}=setup();
 game.record('eat','fish');game.record('eat','fish');game.record('eat','crab');
 assert.deepEqual(game.state.eatenByType,{fish:2,crab:1,snail:0});
 assert.deepEqual(reload().state.eatenByType,game.state.eatenByType);
 tomorrow();game.refreshDay();game.record('eat','snail');game.record('eat','unknown');
 assert.deepEqual(game.state.eatenByType,{fish:2,crab:1,snail:1});
 const snapshot=game.state;snapshot.eatenByType.fish=50;
 assert.equal(game.state.eatenByType.fish,2);assert.equal(game.state.exp,32);
});

test('old totals are retained without inventing per-species counts',()=>{
 const {game}=setup(JSON.stringify({version:1,eaten:20,eatenByType:{fish:-1,crab:'4',snail:1.5}}));
 assert.equal(game.state.eaten,20);assert.deepEqual(game.state.eatenByType,{fish:0,crab:0,snail:0});
 game.record('eat','snail');assert.equal(game.state.eatenByType.snail,1);
});

test('food consists of fish, crabs and snails with species EXP rewards',()=>{
 assert.deepEqual(config.preyTypes.map(type=>type.id),['fish','crab','snail']);
 const {game}=setup();
 for(const type of config.preyTypes)game.record('eat',type.id);
 game.record('eat','jellyfish');
 assert.equal(game.state.eaten,3);assert.equal(game.state.exp,24);
 withJourney(0,journey=>assert.deepEqual([...new Set(journey.state.prey.map(prey=>prey.type))],['fish','crab','snail']));
});

test('detailed prey models animate with finite bounds and release shared resources',()=>{
 const models=createPreyModels(),resources=new Set();
 for(const type of config.preyTypes){
  const model=models.create(type);assert.equal(model.body.name,`prey-${type.id}`);
  let meshes=0;model.body.traverse(node=>{if(node.isMesh){meshes++;resources.add(node.geometry);resources.add(node.material);}});
  assert.ok(meshes>=9);model.animate(0);model.body.updateMatrixWorld(true);
  const before=[];model.body.traverse(node=>before.push(...node.matrixWorld.elements));
  model.animate(.3);model.body.updateMatrixWorld(true);
  const after=[];model.body.traverse(node=>after.push(...node.matrixWorld.elements));
  assert.notDeepEqual(after,before);
  const bounds=new T.Box3().setFromObject(model.body),size=bounds.getSize(new T.Vector3());
  assert.ok(size.toArray().every(value=>Number.isFinite(value)&&value>0&&value<3));
 }
 let disposed=0;for(const resource of resources)resource.addEventListener('dispose',()=>disposed++);
 models.dispose();assert.equal(disposed,resources.size);
});

test('scene allows crossing the former reef barrier and eats prey only once per action',()=>{
 withJourney(0,journey=>{
  const player=new T.Vector3(0,2,-20);journey.update(.01,player,false,false);
  assert.equal(player.z,-20);assert.equal(journey.canBoost(),true);assert.equal(journey.boost(),true);
  const target=journey.state.prey[0];player.set(...target.position);const before=journey.state.exp;
  assert.equal(journey.update(.01,player),'eat');assert.notEqual(journey.context.id,'eat');
  assert.equal(journey.state.eaten,0);assert.equal(journey.state.prey[0].active,true);
  journey.update(3.2,player,false,false);
  assert.equal(journey.state.exp,before+8);assert.equal(journey.state.eaten,1);assert.equal(journey.state.eatenByType.fish,1);
  assert.equal(journey.state.prey[0].active,false);assert.equal(journey.update(.01,player),undefined);assert.equal(journey.state.eaten,1);
 });
});

test('auto eating respects distance, depth, animation lock and cooldown',()=>{
 withJourney(0,journey=>{
  const player=new T.Vector3(30,2,20);journey.update(.01,player);assert.equal(journey.state.eaten,0);
  const fish=journey.state.prey[0];player.set(fish.position[0],6,fish.position[2]);
  assert.equal(journey.update(.01,player),undefined);assert.equal(journey.state.eaten,0);
  player.set(...fish.position);assert.equal(journey.update(.01,player,false,false),undefined);
  assert.equal(journey.state.eaten,0);assert.equal(journey.update(.01,player),'eat');
  const crab=journey.state.prey[1];player.set(...crab.position);
  assert.equal(journey.update(.1,player),undefined);assert.equal(journey.state.eaten,0);
  journey.update(3.8,player,false,false);journey.update(.3,player,false,false);player.set(...journey.state.prey[1].position);
  assert.equal(journey.update(.01,player),'eat');journey.update(3.2,player,false,false);assert.equal(journey.state.eatenByType.crab,1);
  assert.equal(journey.state.exp,18);
 });
});

test('prey remains visible through bite and chew, follows mouth and counts once after swallow',()=>{
 withJourney(0,(journey,scene)=>{
  const player=new T.Vector3(...journey.state.prey[0].position),mouth=player.clone().add(new T.Vector3(0,.3,-.5));
  assert.equal(journey.update(.01,player),'eat');
  const fish=scene.getObjectByName('prey-fish');
  journey.update(.75,player,false,false,mouth);assert.equal(journey.state.feeding.phase,'bite');assert.equal(fish.visible,true);assert.equal(journey.state.eaten,0);
  journey.update(.5,player,false,false,mouth);assert.equal(journey.state.feeding.phase,'chew');assert.ok(fish.position.distanceTo(mouth)<.001);
  assert.equal(fish.visible,true);assert.equal(journey.state.eaten,0);
  journey.update(1.5,player,false,false,mouth);assert.equal(journey.state.feeding.phase,'swallow');assert.equal(journey.state.eaten,0);
  journey.update(.45,player,false,false,mouth);assert.equal(journey.state.eaten,1);assert.equal(fish.visible,false);
  journey.update(1,player,false,false,mouth);assert.equal(journey.state.eaten,1);assert.equal(journey.state.feeding,null);
 });
});

test('adult scene completes nesting through context actions and releases resources',()=>{
 withJourney(260,journey=>{
  assert.equal(journey.canBoost(),true);
  const player=new T.Vector3(-6,6,8);journey.update(1,player);
  assert.equal(journey.context.enabled,false);journey.act();assert.equal(journey.state.dig,0);
  player.set(0,6,12);
  for(let count=0;count<3;count++){journey.update(1,player);assert.equal(journey.context.id,'dig');journey.act();}
  journey.update(1,player);assert.equal(journey.context.id,'eggs');journey.act();assert.equal(journey.state.complete,true);
 });
});
