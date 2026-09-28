import {chromium} from 'playwright';import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome',headless:true});
try{const p=await b.newPage({viewport:{width:1366,height:640}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));
await p.goto('http://127.0.0.1:4175/#intro/trex');await p.waitForFunction(()=>dinoGame.lessons.length===12);
assert.equal(await p.locator('#topic-hub button').count(),7,'Profile contains exactly seven exploration icons');
await mkdir('artifacts/knowledge',{recursive:true});await p.screenshot({path:'artifacts/knowledge/hub.png'});
for(const key of ['habitat','diet','footprints','size','growth','range']){
 await p.locator('[data-topic='+key+']').click();await p.waitForFunction(()=>dinoGame.screen==='topic');await p.locator('#knowledge-image').evaluate(e=>e.decode());
 assert.ok(await p.locator('#knowledge-view').isVisible());assert.equal(await p.locator('#stage').isVisible(),false);
 if(key==='growth'||key==='size'){const tabs=p.locator(key==='size'?'[data-measure-index]':'[data-growth-step]');assert.ok(await tabs.count()>=2);await tabs.last().click();if(key==='growth')assert.equal(await tabs.last().getAttribute('aria-pressed'),'true');}
 await p.screenshot({path:'artifacts/knowledge/'+key+'.png'});await p.reload();await p.waitForFunction(()=>dinoGame.screen==='topic');await p.locator('#back').click();await p.locator('#topic-hub').waitFor();
}
await p.locator('[data-enter-3d]').click();await p.waitForFunction(()=>dinoGame.screen==='learn');assert.equal(await p.locator('#action-picker button').count(),12);assert.ok(await p.locator('#action-tray').isVisible());assert.equal(await p.evaluate(()=>dinoGame.state.pedestal),false);
await p.locator('#actions-next').click();await p.waitForFunction(()=>document.getElementById('action-picker').scrollLeft>0);
await p.locator('[data-action-index="11"]').click();await p.waitForFunction(()=>dinoGame.state.clip==='hunt');await p.locator('[data-action-index="0"]').click();await p.waitForTimeout(3000);await p.screenshot({path:'artifacts/knowledge/learn.png'});
await p.setViewportSize({width:390,height:844});await p.screenshot({path:'artifacts/knowledge/mobile-learn.png',fullPage:true});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await p.locator('#back').click();await p.screenshot({path:'artifacts/knowledge/mobile-hub.png'});assert.equal(await p.locator('#topic-hub button').count(),7);
assert.deepEqual(errors,[]);console.log('PASS 7 icons, 6 topic pages, deep links, comparison/stages, 12 actions and pedestal');
}finally{await b.close();}
