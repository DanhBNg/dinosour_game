import {speciesKnowledge} from '../src/species-knowledge-data.js';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {marineExploration as records} from '../src/marine-exploration.js';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage(),errors=[],missing=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
await page.addInitScript(()=>{window.__spoken=[];speechSynthesis.speak=u=>__spoken.push(u.text);});
await fs.mkdir('artifacts/marine-exploration',{recursive:true});
try{
 for(const viewport of [{width:1366,height:641},{width:390,height:844},{width:844,height:390}]){
  await page.setViewportSize(viewport);
  for(const [id,scenes]of Object.entries(records)){
   await page.goto(`http://127.0.0.1:4175/animal/${id}/topics/habitat`);
   await page.waitForFunction(()=>window.dinoGame?.screen==='topic',null,{timeout:90000});
   for(const [key,scene]of Object.entries(scenes)){
    await page.locator(`#topic-hub [data-topic="${key}"]`).click();
    await page.locator('#knowledge-overlay img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
    assert.equal(await page.locator('#knowledge-view').getAttribute('data-record'),id);
    assert.equal(await page.locator('#knowledge-view').getAttribute('data-topic'),key);
    assert.equal(await page.locator('.species-fact').count(),0);
    assert.equal(await page.locator('.explore-point').count(),scene.points.length);
    assert.equal(new URL(page.url()).hash,'');
    await page.locator('#say-name').click();
    assert.equal(await page.evaluate(()=>__spoken.at(-1)),scene.voice||speciesKnowledge[id].topics[key].voice);
    await page.locator('#topic-notes summary').click();
    assert.ok((await page.locator('#topic-explanation').textContent()).includes(speciesKnowledge[id].identity));
    assert.equal(await page.locator('#topic-source').getAttribute('href'),(scene.source||speciesKnowledge[id].topics[key].source||speciesKnowledge[id].source).url);
    await page.locator('#topic-notes summary').click();
    const ratio=await page.locator('.explore-art').evaluate(i=>Math.abs(i.clientWidth/i.clientHeight-i.naturalWidth/i.naturalHeight));assert.ok(ratio<.02);
    await page.screenshot({path:`artifacts/marine-exploration/${id}-${key}-${viewport.width}.png`});
    for(const [i,p]of scene.points.entries()){
     const target=page.locator(`[data-point="${i}"]`);await target.click();
     assert.equal(await target.getAttribute('aria-pressed'),'true');
     assert.equal(await page.locator('.explore-point[aria-pressed=true]').count(),1);
     assert.equal(await page.evaluate(()=>__spoken.at(-1)),p.voice);
     await page.locator('#say-name').click();assert.equal(await page.evaluate(()=>__spoken.at(-1)),p.voice);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    console.log('PASS',viewport.width,id,key);
   }
   await page.reload();await page.waitForFunction(()=>dinoGame.screen==='topic',null,{timeout:90000});
   await page.locator('#back').click();await page.waitForFunction(()=>dinoGame.screen==='intro');
   await page.locator('[data-enter-3d]').click();await page.waitForFunction(()=>dinoGame.screen==='learn');
   assert.ok(await page.locator('#action-picker button').count()>0);
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS 42 dedicated marine scenes at 3 viewports, all targets, speech, clean routes and animation access');
}finally{await browser.close();}
