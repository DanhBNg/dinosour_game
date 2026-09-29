import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const p=await browser.newPage({viewport:{width:1366,height:768}});
try {
for(const id of ['seal','squid','loggerhead','tuna','slug','shark','fish','amplectobelua']){
 await p.goto('http://127.0.0.1:4175/animal/'+id);
 await p.locator('[data-enter-3d]:enabled').waitFor({timeout:90000});
 await p.waitForFunction(()=>!dinoGame.state.cameraMoving);
 for(const screen of ['intro','learn']){
  if(screen==='learn'){await p.locator('[data-enter-3d]').click();await p.waitForFunction(()=>!dinoGame.state.cameraMoving);}
  const before=await p.evaluate(()=>dinoGame.state.camera);
  const rect=await p.locator('#stage canvas').boundingBox();assert.ok(rect,'visible canvas');
  await p.mouse.move(rect.x+rect.width*.45,rect.y+rect.height*.45);await p.mouse.down();await p.mouse.move(rect.x+rect.width*.6,rect.y+rect.height*.5,{steps:12});await p.mouse.up();await p.waitForTimeout(250);
  const after=await p.evaluate(()=>dinoGame.state.camera);assert.ok(Math.hypot(...after.map((v,i)=>v-before[i]))>.1,id+' '+screen+' drag');
  await p.mouse.wheel(0,-300);await p.waitForTimeout(400);const zoom=await p.evaluate(()=>dinoGame.state.camera);assert.ok(Math.hypot(...zoom.map((v,i)=>v-after[i]))>.1,id+' '+screen+' zoom');
 }
 await p.locator('#back').click();assert.equal(new URL(p.url()).pathname,'/animal/'+id);
 await p.locator('#back').click();assert.equal(new URL(p.url()).pathname,'/world/ocean');
 await p.locator('#back').click();assert.equal(new URL(p.url()).pathname,'/');
 console.log('PASS drag, zoom, back:',id);
}
await p.goto('http://127.0.0.1:4175/world/ocean');
const rows=await p.locator('#cards button').evaluateAll(es=>new Set(es.map(e=>Math.round(e.getBoundingClientRect().top))).size);assert.equal(rows,1);
await p.locator('#cards-next').click();await p.waitForTimeout(650);assert.ok(await p.locator('#cards').evaluate(e=>e.scrollLeft>0));
await p.screenshot({path:'artifacts/world/ocean-fixed.png'});
await p.goto('http://127.0.0.1:4175/world/dinosaurs');assert.ok(await p.locator('#island .map-pin img').evaluateAll(es=>es.every(e=>e.src.includes('/heroes/'))));await p.screenshot({path:'artifacts/world/dinosaurs-fixed.png'});
for(const [name,size]of [['desktop',{width:1366,height:768}],['mobile',{width:390,height:844}]]){await p.setViewportSize(size);await p.goto('http://127.0.0.1:4175/animal/trex/actions/idle');await p.waitForFunction(()=>dinoGame.screen==='learn'&&!dinoGame.state.cameraMoving,null,{timeout:90000});await p.screenshot({path:'artifacts/world/trex-ground-'+name+'.png'});}
console.log('PASS map trays and restored artwork');
}finally{await browser.close();}
