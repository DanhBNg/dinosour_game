import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {triceExploration} from '../src/pages/home/dinosour/trice/trice-exploration.js';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:1366,height:641}});const errors=[],missing=[];
p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
await p.addInitScript(()=>{window.__spoken=[];speechSynthesis.speak=u=>__spoken.push(u.text);});
await fs.mkdir('artifacts/trice',{recursive:true});
try{
 for(const viewport of [{width:1366,height:641},{width:1440,height:900},{width:390,height:844}]){
  await p.setViewportSize(viewport);
  for(const [key,scene]of Object.entries(triceExploration)){
   await p.goto('http://127.0.0.1:4175/animal/trice/topics/'+key);
   await p.waitForFunction(()=>window.dinoGame?.screen==='topic',null,{timeout:90000});await p.locator('.explore-art').evaluate(i=>i.decode());
   assert.equal(await p.locator('.species-fact').count(),0,'No generic text card');
   assert.equal(await p.locator('.explore-point').count(),scene.points.length);
   const size=await p.locator('.explore-art').evaluate(i=>({actual:i.clientWidth/i.clientHeight,natural:i.naturalWidth/i.naturalHeight}));assert.ok(Math.abs(size.actual-size.natural)<.02,'No stretching');
   await p.screenshot({path:`artifacts/trice/${key}-${viewport.width}.png`});
   for(const [index,point]of scene.points.entries()){
    const button=p.locator(`[data-point="${index}"]`);await button.click();
    assert.equal(await button.getAttribute('aria-pressed'),'true');assert.equal(await p.locator('.explore-point[aria-pressed=true]').count(),1);
    assert.equal(await p.evaluate(()=>__spoken.at(-1)),point.voice);
    await p.locator('#say-name').click();assert.equal(await p.evaluate(()=>__spoken.at(-1)),point.voice);
   }
   if(key==='growth')await p.screenshot({path:`artifacts/trice/growth-selected-${viewport.width}.png`});
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   console.log('PASS',viewport.width,key,'image and',scene.points.length,'targets');
  }
 }
 await p.reload();await p.waitForFunction(()=>dinoGame.screen==='topic',null,{timeout:90000});assert.equal(await p.locator('#knowledge-view').getAttribute('data-owner'),'illustrated');
 await p.locator('#back').click();await p.waitForFunction(()=>dinoGame.screen==='intro');await p.locator('[data-enter-3d]').click();await p.waitForFunction(()=>dinoGame.screen==='learn');assert.equal(await p.locator('#action-picker button').count(),10);
 await p.goto('http://127.0.0.1:4175/animal/trex/topics/growth');await p.waitForFunction(()=>dinoGame.screen==='topic',null,{timeout:90000});assert.equal(await p.locator('.growth-region').count(),4);assert.equal(await p.locator('.explore-art').count(),0);
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS six separate scenes, all hotspots at three sizes, narration, reload/back, 10 actions, T-Rex unchanged');
}finally{await b.close();}
