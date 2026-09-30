import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';await fs.mkdir('artifacts/journey',{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await p.goto('http://127.0.0.1:4175/world/ocean');const f=await(await p.waitForSelector('iframe')).contentFrame();await f.waitForSelector('.journey-map-image');await f.waitForFunction(()=>document.querySelector('.journey-map-image').naturalWidth>0);
 const dims=await f.locator('.journey-map-image').evaluate(e=>({ratio:e.clientWidth/e.clientHeight,natural:e.naturalWidth/e.naturalHeight,height:e.clientHeight,viewport:innerHeight}));assert.ok(Math.abs(dims.ratio-dims.natural)<.01);assert.equal(dims.height,dims.viewport);
 const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:140,y:700}]});for(let i=1;i<=12;i++){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:140,y:700-i*25}]});await p.waitForTimeout(15);}await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(await f.locator('#island').evaluate(e=>e.scrollLeft)>100,'portrait browser swipe must pan landscape map');assert.ok(p.url().endsWith('/world/ocean'),'swipe must not open an animal');
 await p.screenshot({path:'artifacts/journey/destinations-portrait.png'});
 await f.locator('#back').click();await p.waitForURL('http://127.0.0.1:4175/');
 const scales=await f.evaluate(()=>({locked:getComputedStyle(document.querySelector('.world-badge.locked .action-sprite')).transform,dino:getComputedStyle(document.querySelector('[data-world=dinosaurs] .action-sprite')).transform}));assert.ok(scales.locked.includes('0.95625'));assert.ok(Math.abs(Number(scales.dino.match(/[\d.]+/)[0])-1.12)<.001);
 await f.locator('[data-world=dinosaurs]').click();await f.waitForSelector('.map-pin.trex');const ds=await f.evaluate(()=>Object.fromEntries(['trex','stego','mosa','ptero'].map(id=>[id,getComputedStyle(document.querySelector('.map-pin.'+id+' .action-sprite')).transform])));assert.ok(ds.trex.includes('1.5'));assert.equal(ds.mosa,ds.ptero);assert.ok(ds.mosa.includes('1.875'));console.log('PASS full-height artwork, rotated touch swipe, no accidental navigation, per-group sizing');
}finally{await b.close();}
