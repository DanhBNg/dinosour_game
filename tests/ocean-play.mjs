import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:mobile?{width:844,height:390}:{width:1200,height:700},hasTouch:mobile,isMobile:mobile});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4175/animal/loggerhead/explore');
  const iframe=await page.$('iframe'),frame=iframe?await iframe.contentFrame():page;
  await frame.waitForFunction(()=>window.dinoGame?.roam?.active,null,{timeout:90000});
  assert.equal(await frame.locator('.roam-action').count(),4);
  assert.equal(await frame.locator('.survival-eaten').textContent(),'🐟 0   🦀 0   🐚 0');
  assert.equal(await frame.locator('.journey-hp').count(),1);
  assert.equal(await frame.locator('.journey-exp').count(),1);
  assert.equal(await frame.locator('.journey-mission').count(),3);
  assert.equal(await frame.locator('.journey-task-card').isVisible(),false);
  assert.equal(await frame.locator('.journey-task-shortcut').count(),0);
  assert.equal(await frame.locator('.journey-task-card').isVisible(),false);
  await frame.locator('.journey-task-menu > summary').click();
  assert.equal(await frame.locator('.journey-task-card').isVisible(),true);
  await frame.locator('.journey-task-menu > summary').click();
  assert.equal(await frame.locator('.journey-task-card').isVisible(),false);
  assert.equal(await frame.locator('.roam-actions .journey-skills').isVisible(),true);
  assert.equal(await frame.locator('.journey-skill').count(),2);
  assert.equal(await frame.locator('.survival-minimap').isVisible(),true);
  assert.equal(await frame.locator('[data-roam-action=boost]').isDisabled(),false);
  assert.equal(await frame.locator('[data-roam-action=context]').isVisible(),false);
  assert.equal(await frame.locator('[data-roam-action=rise] kbd').isVisible(),!mobile);
  assert.equal(await frame.evaluate(()=>dinoGame.roam.quest.stage.id),'hatchling');
  for(const depth of [4,6]){
   await frame.locator('[data-roam-action=rise]').press('Enter');
   await frame.waitForFunction(()=>dinoGame.roam.activity==='rise');
   await frame.waitForFunction(()=>dinoGame.roam.activity==='');
   assert.equal((await frame.evaluate(()=>dinoGame.roam.position))[1],depth);
  }
  const before=await frame.evaluate(()=>({exp:dinoGame.roam.quest.exp,missions:dinoGame.roam.quest.missions}));
  await page.reload();
  const reloadedIframe=await page.$('iframe'),reloaded=reloadedIframe?await reloadedIframe.contentFrame():page;
  await reloaded.waitForFunction(()=>window.dinoGame?.roam?.active,null,{timeout:90000});
  assert.deepEqual(await reloaded.evaluate(()=>({exp:dinoGame.roam.quest.exp,missions:dinoGame.roam.quest.missions})),before);
  await reloaded.evaluate(()=>{
   const key='animal-survival-v1:loggerhead',saved=JSON.parse(localStorage.getItem(key));
   saved.exp=30;saved.hp=80;localStorage.setItem(key,JSON.stringify(saved));
  });
  await page.reload();
  const combatIframe=await page.$('iframe'),combatFrame=combatIframe?await combatIframe.contentFrame():page;
  await combatFrame.waitForFunction(()=>window.dinoGame?.roam?.quest?.boss?.combat,null,{timeout:90000});
  assert.equal(await combatFrame.locator('.journey-boss').isVisible(),true);
  const hudBox=await combatFrame.locator('.journey-hud').boundingBox();
  const bossBox=await combatFrame.locator('.journey-boss').boundingBox();
  const mapBox=await combatFrame.locator('.survival-minimap').boundingBox();
  assert.ok(hudBox.x+hudBox.width<=bossBox.x,'Stats and boss bar must not overlap');
  assert.ok(bossBox.x+bossBox.width<=mapBox.x,'Boss bar and minimap must not overlap');
  const joystickBox=await combatFrame.locator('.roam-joystick').boundingBox();
  const actionsBox=await combatFrame.locator('.roam-actions').boundingBox();
  assert.ok(joystickBox.x+joystickBox.width<actionsBox.x,'Movement and action controls must not overlap');
  await combatFrame.locator('[data-skill=shield]').click();
  await combatFrame.waitForFunction(()=>dinoGame.roam.activity==='shield');
  assert.ok(await combatFrame.evaluate(()=>dinoGame.roam.quest.boss.shield>0));
  await combatFrame.waitForFunction(()=>document.querySelector('[data-skill=shield]').dataset.cooling==='true');
  assert.equal(await combatFrame.locator('[data-skill=shield]').isDisabled(),true);
  assert.equal(await combatFrame.locator('[data-skill=shield] .skill-countdown').isVisible(),true);
  assert.match(await combatFrame.locator('[data-skill=shield] .skill-countdown').textContent(),/^[1-9]$/);
  await combatFrame.waitForFunction(()=>dinoGame.roam.activity==='');
  assert.ok(await combatFrame.evaluate(()=>dinoGame.roam.quest.boss.cooldowns.shield>0));
  assert.deepEqual(errors,[]);console.log('PASS survival route',mobile?'mobile':'desktop');await page.close();
 }
}finally{await browser.close();}
