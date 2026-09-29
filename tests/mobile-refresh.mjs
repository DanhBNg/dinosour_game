import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true}),p=await browser.newPage({hasTouch:true}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
await fs.mkdir('artifacts/mobile-refresh',{recursive:true});
const routes=['/','/world/dinosaurs','/world/ocean','/animal/brachio','/animal/seal','/animal/trex/actions/clip0','/animal/shark/actions/drift','/animal/shark/topics/size','/animal/squid/topics/habitat','/animal/trex/topics/growth','/animal/loggerhead/topics/growth'];
try{
 for(const viewport of process.argv.includes('--interaction-only')?[]:[{width:844,height:390},{width:667,height:375},{width:932,height:430}]){
  await p.setViewportSize(viewport);
  for(const route of routes){
   await p.goto('http://127.0.0.1:4175'+route);
   if(route.startsWith('/animal')){await p.locator('[data-enter-3d]:enabled').waitFor({state:'attached',timeout:90000});await p.waitForFunction(()=>document.querySelector('#load-status').hidden);}
   await p.waitForTimeout(route.includes('/actions/')?3000:250);
   if(route.includes('/actions/'))assert.equal(await p.locator('#topic-hub').isVisible(),false);
   const bounds=await p.evaluate(()=>({width:innerWidth,height:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,screen:document.body.dataset.screen,tray:[...document.querySelectorAll('#topic-hub,#action-tray,.catalog-tray')].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none').map(e=>({id:e.id||e.className,x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,right:e.getBoundingClientRect().right,bottom:e.getBoundingClientRect().bottom}))}));
   assert.ok(bounds.sw<=viewport.width+1&&bounds.sh<=viewport.height+1,JSON.stringify({route,viewport,bounds}));
   for(const t of bounds.tray)assert.ok(t.x>=0&&t.right<=viewport.width+1&&t.y>=0&&t.bottom<=viewport.height+1,JSON.stringify({route,viewport,t}));
   await p.screenshot({path:'artifacts/mobile-refresh/'+viewport.width+'-'+(route.slice(1).replaceAll('/','-')||'home')+'.png'});
   console.log('PASS layout',viewport.width,route);
  }
 }
 // Orientation changes in place must retain the selected model and running action.
 await p.goto('http://127.0.0.1:4175/animal/brachio/actions/clip0');await p.waitForFunction(()=>window.dinoGame?.screen==='learn',null,{timeout:90000});
 await p.setViewportSize({width:390,height:844});await p.setViewportSize({width:844,height:390});await p.waitForTimeout(400);assert.equal(await p.evaluate(()=>dinoGame.state.id),'brachio');assert.equal(await p.evaluate(()=>dinoGame.state.held),false);
 // A slow request shows the selected subject immediately; navigation cancels its UI ownership.
 const slow=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});let release;const gate=new Promise(r=>release=r);await slow.route('**/assets/brachio.glb',async r=>{await gate;await r.continue();});
 await slow.goto('http://127.0.0.1:4175/animal/brachio');await slow.locator('.loading-subject img').evaluate(i=>i.decode());assert.equal(await slow.locator('.loading-ring').isVisible(),true);assert.equal(await slow.locator('#load-status').evaluate(e=>{const copy=e.cloneNode(true);copy.querySelectorAll('.sr-only').forEach(n=>n.remove());return copy.textContent.trim();}),'');await slow.screenshot({path:'artifacts/mobile-refresh/loading.png'});await slow.locator('#back').click();release();await slow.waitForTimeout(1000);assert.equal(await slow.evaluate(()=>dinoGame.screen),'map');assert.equal(await slow.locator('#load-status').isVisible(),false);await slow.close();
 const failed=await browser.newPage({viewport:{width:844,height:390},hasTouch:true});let fail=true;await failed.route('**/assets/brachio.glb',r=>fail?r.abort():r.continue());await failed.goto('http://127.0.0.1:4175/animal/brachio');await failed.locator('.loading-retry').waitFor();fail=false;await failed.locator('.loading-retry').click();await failed.locator('[data-enter-3d]:enabled').waitFor({timeout:90000});await failed.close();
 // Portrait is blocked on touch devices for every entry route, and returns after rotation.
 const blocked=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await blocked.addInitScript(()=>{Element.prototype.requestFullscreen=async()=>{throw Error('unsupported');};Object.defineProperty(screen.orientation,'lock',{value:async()=>{throw Error('unsupported');}});});
 for(const path of ['/','/world/ocean','/animal/seal','/animal/trex/actions/clip0','/animal/shark/topics/size']){await blocked.goto('http://127.0.0.1:4175'+path);await blocked.locator('#landscape-gate').waitFor();assert.equal(await blocked.locator('main').evaluate(e=>e.inert),true);assert.equal(await blocked.locator('#settings').count(),0);}
 await blocked.locator('#landscape-start').click();assert.equal(await blocked.locator('#landscape-gate').isVisible(),true);await blocked.screenshot({path:'artifacts/mobile-refresh/portrait-gate.png'});
 await blocked.setViewportSize({width:844,height:390});await blocked.waitForFunction(()=>document.querySelector('#landscape-gate').hidden);assert.equal(await blocked.locator('main').evaluate(e=>e.inert),false);await blocked.setViewportSize({width:390,height:844});await blocked.locator('#landscape-gate').waitFor();await blocked.keyboard.press('Tab');assert.equal(await blocked.evaluate(()=>document.activeElement.id),'landscape-start');await blocked.close();
 const orientation=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await orientation.addInitScript(()=>{window.__orientation=[];Element.prototype.requestFullscreen=async()=>{__orientation.push('fullscreen');};Object.defineProperty(screen.orientation,'lock',{value:async v=>__orientation.push(v)});});await orientation.goto('http://127.0.0.1:4175');await orientation.locator('#landscape-start').click();assert.deepEqual(await orientation.evaluate(()=>__orientation),['landscape','fullscreen','landscape']);await orientation.close();
 const desktop=await browser.newPage({viewport:{width:1366,height:768}});await desktop.goto('http://127.0.0.1:4175');assert.equal(await desktop.locator('#landscape-gate').isVisible(),false);assert.equal(await desktop.locator('#settings').count(),0);await desktop.close();
 assert.deepEqual(errors,[]);console.log('PASS mobile layouts, orientation resize, slow loading/back, failure/retry and fullscreen feature detection');
}finally{await browser.close();}
