import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true}),p=await b.newPage({viewport:{width:844,height:390},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>{const v=new EventTarget();Object.assign(v,{width:844,height:390,offsetTop:0,offsetLeft:0,scale:1});Object.defineProperty(window,'visualViewport',{value:v});window.setVisible=(h,top=0)=>{v.height=h;v.offsetTop=top;v.dispatchEvent(new Event('resize'));};});
try{
for(const route of ['/','/world/ocean','/animal/seal','/animal/trex/actions/clip0','/animal/shark/topics/size']){
await p.goto('http://127.0.0.1:4175'+route);if(route.includes('/animal/'))await p.waitForFunction(()=>window.dinoGame?.state&&document.querySelector('#load-status').hidden,null,{timeout:90000});
for(const h of [260,310,390]){await p.evaluate(h=>setVisible(h,7),h);await p.waitForTimeout(250);const bounds=await p.evaluate(()=>({body:document.body.getBoundingClientRect().toJSON(),tray:[...document.querySelectorAll('.catalog-tray,#topic-hub,#action-tray')].filter(e=>e.getClientRects().length).map(e=>e.getBoundingClientRect().toJSON())}));assert.equal(Math.round(bounds.body.height),h);for(const t of bounds.tray)assert.ok(t.bottom<=h+8&&t.top>=7,JSON.stringify({route,h,t}));}
await p.evaluate(()=>setVisible(260));await p.waitForTimeout(300);await p.screenshot({path:'artifacts/mobile-refresh/viewport-'+(route.replaceAll('/','-')||'home')+'.png'});console.log('PASS visible area',route);
}
await p.goto('http://127.0.0.1:4175/animal/shark/actions/drift');await p.waitForFunction(()=>window.dinoGame?.screen==='learn',null,{timeout:90000});await p.waitForTimeout(3000);const before=await p.evaluate(()=>dinoGame.state.camera);await p.mouse.move(400,130);await p.mouse.down();await p.mouse.move(490,155,{steps:12});await p.mouse.up();await p.waitForTimeout(200);assert.notDeepEqual(await p.evaluate(()=>dinoGame.state.camera),before);assert.deepEqual(errors,[]);console.log('PASS drag and no runtime errors');
}finally{await b.close();}
