import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';await fs.mkdir('artifacts/journey',{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});
try{for(const mobile of [false,true]){
 const p=await b.newPage({viewport:mobile?{width:844,height:390}:{width:1366,height:768},hasTouch:mobile});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4175/world/ocean');const f=mobile?await(await p.waitForSelector('iframe')).contentFrame():p;await f.waitForSelector('.journey-pin');
 assert.equal(await f.locator('.journey-pin').count(),8);assert.equal(await f.locator('.journey-pin').first().getAttribute('data-species'),'loggerhead');
 await p.waitForTimeout(1000);await p.screenshot({path:'artifacts/journey/journey-'+mobile+'.png'});
 if(mobile){const c=await p.context().newCDPSession(p);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:700,y:300}]});for(let i=1;i<=12;i++){await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:700-i*30,y:300}]});await p.waitForTimeout(15);}await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(600);}else{await p.mouse.move(750,600);await p.mouse.down();await p.mouse.move(380,600,{steps:12});await p.mouse.up();}assert.ok(await f.locator('#island').evaluate(e=>e.scrollLeft)>150,'drag/swipe pans map');await f.locator('#island').evaluate(e=>e.scrollLeft=0);await p.waitForTimeout(300);
 await f.locator('.journey-navigation button').last().click();await p.waitForTimeout(700);const left=await f.locator('#island').evaluate(e=>e.scrollLeft);assert.ok(left>300);
 const pin=f.locator('[data-species=squid]');await pin.click();await p.waitForURL('**/animal/squid');await f.locator('#back').click();await p.waitForURL('**/world/ocean');assert.ok(Math.abs(await f.locator('#island').evaluate(e=>e.scrollLeft)-left)<2,'remember position');
 await f.locator('#island').evaluate(e=>e.scrollLeft=e.scrollWidth);await p.waitForTimeout(200);assert.ok(await f.locator('.journey-navigation button').last().isDisabled());await f.locator('[data-species=amplectobelua]').click();await p.waitForURL('**/animal/amplectobelua');assert.deepEqual(errors,[]);console.log('PASS journey',mobile?'mobile':'desktop');await p.close();
}}finally{await b.close();}
