import fs from 'node:fs/promises';
await fs.mkdir('artifacts/mobile-refresh',{recursive:true});
﻿import {chromium} from 'playwright';import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{for(const height of [260,310,390]){const p=await browser.newPage({viewport:{width:844,height},hasTouch:true,isMobile:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4175/');
 const home=await p.locator('#home-screen').evaluate(e=>{e.scrollTop=e.scrollHeight;const r=e.getBoundingClientRect();return {scroll:e.scrollTop,max:e.scrollHeight-e.clientHeight,bottom:r.bottom,children:[...e.querySelectorAll('.world-badge')].map(n=>n.getBoundingClientRect().bottom)};});assert.ok(home.scroll>0);assert.ok(Math.abs(home.scroll-home.max)<2);assert.ok(Math.max(...home.children)<home.bottom);
 await p.goto('http://127.0.0.1:4175/animal/seal');await p.locator('#tray-handle').waitFor();assert.equal(await p.locator('#tray-handle').getAttribute('aria-expanded'),'true');const before=await p.locator('#topic-hub').boundingBox();assert.ok(Math.abs(before.y+before.height-height)<2);
 await p.locator('#tray-handle').click();await p.waitForTimeout(300);assert.equal(await p.locator('#topic-hub').evaluate(e=>e.inert),true);assert.equal(await p.locator('#tray-handle').getAttribute('aria-expanded'),'false');
 await p.locator('#knowledge-next').click();assert.equal(await p.locator('#tray-handle').getAttribute('aria-expanded'),'false');
 await p.waitForTimeout(300);const cdp=await p.context().newCDPSession(p),r=await p.locator('#tray-handle').boundingBox(),x=r.x+r.width/2,y=r.y+r.height/2;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-60}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(400);assert.equal(await p.locator('#tray-handle').getAttribute('aria-expanded'),'true');
 await p.locator('[data-enter-3d]').click();await p.waitForFunction(()=>dinoGame.state?.id==='seal'&&document.querySelector('#load-status').hidden,null,{timeout:90000});const first=await p.locator('#stage').boundingBox();await p.locator('#tray-handle').click();await p.waitForTimeout(300);const second=await p.locator('#stage').boundingBox();assert.ok(second.height>first.height);await p.screenshot({path:'artifacts/mobile-refresh/dock-'+height+'.png'});assert.deepEqual(errors,[]);console.log('PASS home scroll, dock tap/drag, persistence, stage expansion',height);await p.close();}
}finally{await browser.close();}

