import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1366,height:641}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
for(const size of [{width:1366,height:641},{width:390,height:844},{width:844,height:390}]){
 await p.setViewportSize(size);await p.goto('http://127.0.0.1:4175/world/ocean');await p.waitForTimeout(400);assert.equal(await p.locator('#cards button').count(),8);
 const bounds=await p.evaluate(()=>{const tray=document.querySelector('.catalog-tray').getBoundingClientRect();return [...document.querySelectorAll('.map-pin')].map(e=>({id:e.dataset.species,bottom:e.getBoundingClientRect().bottom,tray:tray.top}));});assert.ok(bounds.every(v=>v.bottom<v.tray),JSON.stringify(bounds));
 await p.screenshot({path:`artifacts/world/ocean-map-${size.width}.png`});
}
for(const id of ['isopod','hawksbill','whale','paShark']){await p.goto('http://127.0.0.1:4175/animal/'+id+'/actions/clip0');await p.waitForURL('**/world/ocean');}
await p.setViewportSize({width:1366,height:768});
await p.goto('http://127.0.0.1:4175/animal/loggerhead');await p.locator('[data-enter-3d]:enabled').waitFor({timeout:90000});const icons=await p.locator('.ocean-topic-orb img').evaluateAll(es=>es.map(e=>e.src));assert.equal(icons.length,6);
await p.screenshot({path:'artifacts/world/loggerhead-intro.png'});
for(const key of ['habitat','diet','movement','size','growth','range']){await p.locator(`[data-topic=${key}]`).click();await p.waitForFunction(()=>dinoGame.screen==='topic');await p.locator('.ocean-scene').evaluate(img=>img.decode());await p.screenshot({path:`artifacts/world/loggerhead-${key}.png`});const btn=p.locator('#knowledge-overlay [data-voice]').first();if(await btn.count()){await btn.click();assert.equal(await btn.getAttribute('aria-pressed'),'true');}assert.equal(new URL(p.url()).hash,'');}
await p.reload();await p.waitForFunction(()=>dinoGame.screen==='topic');assert.equal(await p.locator('#knowledge-view').getAttribute('data-owner'),'ocean');await p.locator('#back').click();await p.waitForFunction(()=>dinoGame.screen==='intro');
await p.goto('http://127.0.0.1:4175/animal/seal');await p.locator('[data-enter-3d]:enabled').waitFor({timeout:90000});assert.deepEqual(await p.locator('.ocean-topic-orb img').evaluateAll(es=>es.map(e=>e.src)),icons);await p.locator('[data-topic=habitat]').click({force:true});assert.equal(new URL(p.url()).pathname,'/animal/seal');
await p.goto('http://127.0.0.1:4175/animal/trex/topics/growth');await p.waitForFunction(()=>dinoGame.screen==='topic',null,{timeout:90000});assert.equal(await p.locator('#knowledge-view').getAttribute('data-owner'),'dinosaur');assert.equal(await p.locator('.ocean-topic-orb').count(),0);assert.deepEqual(errors,[]);
console.log('PASS: 8 visible species, 4 hidden routes, map bounds at 3 sizes, shared icons, 6 loggerhead topics, hotspots, reload/back and T-Rex separation');
}finally{await b.close();}
