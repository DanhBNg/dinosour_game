import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage(),errors=[],missing=[];
p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
await fs.mkdir('artifacts/brachio',{recursive:true});
try{
 for(const viewport of [{width:1366,height:768},{width:390,height:844}]){
  await p.setViewportSize(viewport);await p.goto('http://127.0.0.1:4175/world/dinosaurs');
  assert.equal(await p.locator('#cards button[data-species]').count(),7);
  await p.locator('#cards [data-species=brachio]').click();
  await p.locator('[data-enter-3d]:enabled').waitFor({timeout:90000});
  assert.equal(await p.locator('#topic-hub [aria-disabled=true]').count(),6);
  await p.locator('#hero-image').evaluate(i=>i.decode());
  await p.screenshot({path:`artifacts/brachio/intro-${viewport.width}.png`});
  await p.locator('[data-enter-3d]').click();await p.waitForFunction(()=>dinoGame.screen==='learn');
  assert.equal(await p.locator('#action-picker [data-action]').count(),1);
  await p.waitForTimeout(3200);
  assert.equal(await p.evaluate(()=>dinoGame.state.held),false);
  const first=await p.locator('#stage canvas').screenshot();await p.waitForTimeout(650);const next=await p.locator('#stage canvas').screenshot();assert.notDeepEqual(first,next,'original animation must change the pose');
  const before=await p.evaluate(()=>dinoGame.state.camera);const box=await p.locator('#stage canvas').boundingBox();
  await p.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await p.mouse.down();await p.mouse.move(box.x+box.width*.65,box.y+box.height*.55,{steps:12});await p.mouse.up();await p.waitForTimeout(350);
  assert.notDeepEqual(await p.evaluate(()=>dinoGame.state.camera),before);
  await p.locator('#reset-camera').click();await p.waitForTimeout(3200);await p.screenshot({path:`artifacts/brachio/model-${viewport.width}.png`});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.reload();await p.waitForFunction(()=>window.dinoGame?.screen==='learn',null,{timeout:90000});assert.equal(new URL(p.url()).hash,'');
  await p.locator('#back').click();await p.waitForFunction(()=>dinoGame.screen==='intro');await p.locator('#back').click();await p.waitForURL('**/world/dinosaurs');
  console.log('PASS Brachiosaurus',viewport.width,'map, textures, clip, camera, reload, back');
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
}finally{await b.close();}
