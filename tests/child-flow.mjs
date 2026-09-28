import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const p=await browser.newPage({viewport:{width:1366,height:900}});
 await p.goto('http://127.0.0.1:4175');
 assert.equal(await p.locator('#map-screen').innerText(),'','Map must contain pictures only');
 await p.locator('#cards [data-species=trex]').click();
 await p.locator('[data-enter-3d]').click();await p.locator('[data-action-index]').first().waitFor({timeout:60000});
 assert.equal(await p.locator('.brand').isVisible(),false);
 assert.equal(await p.locator('#intro-panel').isVisible(),false);
 const button=p.locator('[data-action-index]').nth(3);
 const word=await button.getAttribute('data-word');
 await button.click();
 await p.waitForFunction(()=>dinoGame.screen==='learn');
 assert.equal(await p.locator('#word').innerText(),word);
 assert.equal(await p.locator('#action-tabs').count(),0);
 assert.ok(await p.locator('#mic').isVisible());
 await p.reload();
 await p.waitForFunction(()=>dinoGame.screen==='learn'&&document.getElementById('word').textContent);
 assert.equal(await p.locator('#word').innerText(),word,'reload preserves selected action');
 await p.locator('#back').click();
 await p.waitForFunction(()=>dinoGame.screen==='intro');
 await p.locator('#topic-hub').waitFor();
 await p.setViewportSize({width:390,height:844});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no mobile overflow');
 console.log('PASS picture map, action selection, single lesson, reload and mobile');
} finally {await browser.close();}
