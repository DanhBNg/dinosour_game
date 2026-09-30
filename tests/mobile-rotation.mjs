import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';await fs.mkdir('artifacts/mobile-rotation',{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4175/');const frame=await (await p.waitForSelector('iframe')).contentFrame();await frame.waitForFunction(()=>window.dinoGame?.screen==='home');
 assert.deepEqual(await frame.evaluate(()=>[innerWidth,innerHeight]),[844,390]);assert.equal(await frame.locator('#landscape-gate').isVisible(),false);
 await p.screenshot({path:'artifacts/mobile-rotation/rotated-home.png'});
 await frame.locator('[data-world=ocean]').click();await p.waitForURL('**/world/ocean');
 assert.deepEqual(await frame.locator('.map-pin').evaluateAll(es=>es.slice(0,2).map(e=>e.dataset.species)),['loggerhead','squid']);
 await frame.locator('[data-species=loggerhead]').click();await p.waitForURL('**/animal/loggerhead');
 await frame.locator('#back').click();await p.waitForURL('**/world/ocean');
 await p.goBack();await p.waitForTimeout(500);assert.ok(p.url().endsWith('/animal/loggerhead'));await p.goBack();await p.waitForURL('**/world/ocean');await frame.waitForFunction(()=>dinoGame.screen==='map');await p.goBack();await p.waitForURL('http://127.0.0.1:4175/');await frame.waitForFunction(()=>dinoGame.screen==='home');const scroll=await frame.evaluate(()=>{const e=document.querySelector('#home-screen');e.scrollTop=e.scrollHeight;return [e.scrollTop,e.clientHeight,e.scrollHeight];});assert.ok(scroll[0]+scroll[1]>=scroll[2]-2,'home scroll reaches bottom');
 await p.setViewportSize({width:844,height:390});await frame.waitForFunction(()=>innerWidth===844&&innerHeight===390);
 await p.screenshot({path:'artifacts/mobile-rotation/rotated-landscape.png'});
 assert.deepEqual(errors,[]);console.log('PASS rotated viewport, pins, tap navigation, back, physical orientation');
}finally{await b.close();}
