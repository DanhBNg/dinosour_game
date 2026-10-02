import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
await fs.mkdir('artifacts/whale',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const viewport of [{width:1366,height:768},{width:844,height:390}]){
  const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4175/world/ocean');
  const pin=page.locator('[data-species="blueWhale"]');await pin.waitFor();
  assert.equal(await page.locator('.journey-pin').last().getAttribute('data-species'),'blueWhale');
  assert.equal(await pin.getAttribute('aria-disabled'),'true');
  await pin.scrollIntoViewIfNeeded();await pin.locator('.badge-lock').waitFor();
  await page.waitForTimeout(1000);await pin.click({force:true});assert.equal(new URL(page.url()).pathname,'/world/ocean');
  await page.screenshot({path:`artifacts/whale/whale-${viewport.width}.png`});
  await page.goto('http://127.0.0.1:4175/animal/blueWhale/actions');await page.waitForURL('**/world/ocean');
  assert.deepEqual(errors,[]);console.log(viewport.width,'locked final whale + direct route guard passed');await page.close();
 }
}finally{await browser.close();}
