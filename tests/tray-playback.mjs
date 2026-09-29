import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1600,height:900}});
try{
await p.goto('http://127.0.0.1:4175/world/dinosaurs');await p.waitForTimeout(1200);assert.equal(await p.locator('.mystery-card').count(),1);assert.equal(await p.locator('.mystery-card').textContent(),'?');assert.ok(await p.locator('#cards').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
const videoTimes=await p.locator('#cards video').evaluateAll(es=>es.filter(e=>e._visible).map(e=>e.currentTime));await p.waitForTimeout(500);const next=await p.locator('#cards video').evaluateAll(es=>es.filter(e=>e._visible).map(e=>({time:e.currentTime,paused:e.paused})));assert.ok(next.every((v,i)=>!v.paused&&v.time!==videoTimes[i]));
await p.screenshot({path:'artifacts/world/mystery-tray.png'});
await p.setViewportSize({width:1000,height:700});await p.waitForTimeout(400);assert.equal(await p.locator('.mystery-card').count(),0);
await p.setViewportSize({width:1600,height:900});await p.goto('http://127.0.0.1:4175/world/ocean');await p.waitForTimeout(800);assert.equal(await p.locator('.mystery-card').count(),0);
const sample=()=>p.locator('#cards [data-preview]').evaluateAll(es=>es.filter(e=>e._visible).map(e=>({id:e.dataset.preview,frame:e.style.backgroundPosition})));
const a=await sample();assert.ok(a.length>2);await p.waitForTimeout(250);const z=await sample();assert.ok(z.every((v,i)=>v.frame!==a[i].frame));
await p.locator('#cards-next').click();await p.waitForTimeout(700);const aa=await sample();await p.waitForTimeout(250);const zz=await sample();assert.ok(zz.every((v,i)=>v.frame!==aa[i].frame));
await p.goto('http://127.0.0.1:4175/world/dinosaurs');await p.waitForTimeout(500);await p.locator('#back').click();assert.ok(await p.locator('#cards video').evaluateAll(es=>es.every(e=>e.paused)));
console.log('PASS mystery only in spare dinosaur space; all visible MP4s and sprites play; newly revealed sprites play; videos pause off map');
}finally{await b.close();}
