import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await browser.newPage({viewport:{width:1100,height:700}});
 await p.goto('http://127.0.0.1:4175/animal/trex/explore');
 await p.waitForFunction(()=>window.dinoGame?.roam?.active,null,{timeout:90000});
 const before=await p.evaluate(()=>dinoGame.roam);
 await p.mouse.move(650,300);await p.mouse.down();await p.mouse.move(870,350,{steps:16});await p.mouse.up();await p.waitForTimeout(400);
 const orbit=await p.evaluate(()=>dinoGame.roam);
 assert.ok(Math.hypot(...orbit.camera.map((x,i)=>x-before.camera[i]))>1,'drag must orbit camera');
 assert.deepEqual([orbit.position[0],orbit.position[2]],[before.position[0],before.position[2]],'drag must not move animal');
 await p.keyboard.down('w');await p.waitForTimeout(300);await p.keyboard.press('1');await p.waitForTimeout(250);
 const jump=await p.evaluate(()=>dinoGame.roam);
 assert.ok(jump.jumpHeight>.3,'jump while moving');
 assert.ok(jump.groundY>.3,'feet airborne');
 await p.waitForTimeout(1200);await p.keyboard.up('w');await p.waitForTimeout(700);
 const land=await p.evaluate(()=>dinoGame.roam);
 assert.equal(land.jumpHeight,0);assert.ok(Math.abs(land.groundY-.03)<.04,'feet grounded');
 assert.ok(Math.hypot(land.position[0]-jump.position[0],land.position[2]-jump.position[2])>1,'movement continues during jump');
 await p.keyboard.press('1');await p.waitForTimeout(250);assert.ok((await p.evaluate(()=>dinoGame.roam)).jumpHeight>.3,'idle jump');
 await p.waitForTimeout(1500);await p.screenshot({path:'artifacts/roam/roam-fixed.png'});
 console.log('PASS orbit, stationary pointer input, moving jump, landing, idle jump');
}finally{await browser.close();}
