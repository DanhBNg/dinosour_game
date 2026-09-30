import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});
try{const p=await b.newPage({viewport:{width:844,height:390},hasTouch:true,isMobile:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));const cdp=await p.context().newCDPSession(p);
async function swipe(x,y,dx){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y}]});await p.waitForTimeout(30);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
for(const id of ['trex','stego','seal']){
await p.goto('http://127.0.0.1:4175/animal/'+id);await p.locator('#knowledge-view').waitFor();await p.waitForTimeout(350);
assert.equal(await p.locator('.explore-pan:visible').count(),0);assert.equal(await p.locator('#knowledge-next:visible').count(),1);
let xy={x:560,y:170};const hotspot=p.locator('.explore-point').first();if(await hotspot.count()){const r=await hotspot.boundingBox();if(r&&r.x+r.width/2>180&&r.x+r.width/2<750&&r.y+r.height/2<260)xy={x:r.x+r.width/2,y:r.y+r.height/2};}
await swipe(xy.x,xy.y,-150);await p.waitForURL('**/topics/diet');
await swipe(300,170,160);await p.waitForURL('**/topics/habitat');
await p.locator('button[data-topic=range]').click();await swipe(550,150,-170);await p.waitForFunction(()=>dinoGame.screen==='learn');
console.log('PASS touch both directions and last topic to 3D:',id);
}
await p.goto('http://127.0.0.1:4175/animal/stego');await p.mouse.move(540,170);await p.mouse.down();await p.mouse.move(300,170,{steps:12});await p.mouse.up();await p.waitForURL('**/topics/diet');assert.deepEqual(errors,[]);console.log('PASS mouse drag and no page errors');
}finally{await b.close();}
