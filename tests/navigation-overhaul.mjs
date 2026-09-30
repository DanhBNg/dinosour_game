import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await browser.newPage({viewport:{width:844,height:310},hasTouch:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4175/');
 assert.equal(await p.locator('.world-badge [data-preview]').count(),6,'six animated home branches');
 assert.ok(await p.locator('#home-screen').evaluate(e=>e.scrollHeight>e.clientHeight),'short mobile home scrolls');
 await p.locator('button[data-world=dinosaurs]').click();
 assert.equal(await p.locator('.catalog-tray').count(),0,'map tray removed');
 assert.equal(await p.locator('.map-pin [data-preview]').count(),7);
 await p.locator('.map-pin.trex').click();await p.waitForFunction(()=>dinoGame.screen==='topic');
 assert.equal(await p.locator('#topic-hub button').last().getAttribute('data-enter-3d'),'');
 assert.equal(await p.locator('.species-navigation').count(),0);
 assert.equal(await p.locator('button[data-topic=habitat]').getAttribute('aria-pressed'),'true');
 assert.equal(await p.locator('#stage canvas').count(),0,'knowledge does not load WebGL');
 await p.locator('button[data-topic=range]').click();
 await p.locator('#knowledge-next').click();await p.waitForFunction(()=>dinoGame.screen==='learn');
 await p.waitForFunction(()=>dinoGame.state?.id==='trex'&&!document.querySelector('#load-status').hidden===false,null,{timeout:90000});
 await p.locator('#back').click();await p.waitForFunction(()=>dinoGame.screen==='topic');
 await p.locator('#back').click();await p.waitForFunction(()=>dinoGame.screen==='map');
 assert.deepEqual(errors,[]);console.log('PASS new navigation/mobile flow');
}finally{await browser.close();}

