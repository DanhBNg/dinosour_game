import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});try{
const p=await b.newPage({viewport:{width:844,height:310},hasTouch:true});let release;const hold=new Promise(r=>release=r);await p.route('**/assets/trex.json',async r=>{await hold;await r.continue().catch(()=>{});});
await p.goto('http://127.0.0.1:4175/animal/trex/actions');await p.locator('#load-status [data-preview="trex/roar"]').waitFor();const before=await p.locator('#load-status [data-preview]').evaluate(e=>e.style.backgroundPosition);await p.waitForTimeout(400);assert.notEqual(await p.locator('#load-status [data-preview]').evaluate(e=>e.style.backgroundPosition),before);
await p.locator('#back').click();assert.equal(await p.evaluate(()=>dinoGame.screen),'topic');release();await p.waitForTimeout(3500);assert.equal(await p.evaluate(()=>dinoGame.screen),'topic');assert.equal(await p.locator('#load-status').isVisible(),false);
await p.goto('http://127.0.0.1:4175/animal/trex');await p.mouse.move(650,180);await p.mouse.down();await p.mouse.move(420,180,{steps:8});await p.mouse.up();
await p.waitForURL('**/topics/diet');
await p.goto('http://127.0.0.1:4175/');const first=await p.locator('button[data-world=dinosaurs] [data-preview]').getAttribute('data-preview');await p.waitForTimeout(10100);assert.notEqual(await p.locator('button[data-world=dinosaurs] [data-preview]').getAttribute('data-preview'),first);
console.log('PASS animated delayed load, back cancellation, swipe, random home change');
}finally{await b.close();}
