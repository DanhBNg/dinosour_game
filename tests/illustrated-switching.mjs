import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({viewport:{width:1366,height:641}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4175/animal/stego/topics/habitat');
 await page.waitForFunction(()=>window.dinoGame?.screen==='topic',null,{timeout:90000});
 for(const id of ['trice','deino','ptero','mosa','seal','squid','slug','shark','fish','tuna','amplectobelua','stego','trice']){
  await page.evaluate(id=>{history.pushState({},'',`/animal/${id}/topics/growth`);dispatchEvent(new PopStateEvent('popstate'));},id);
  await page.waitForFunction(id=>document.querySelector('#knowledge-view').dataset.record===id,id,{timeout:90000});
  {
   await page.locator('.explore-art').evaluate(i=>i.decode());
   assert.ok((await page.locator('.explore-art').getAttribute('src')).includes('/'+id+'/'));
   await page.setViewportSize({width:390,height:844});
   await page.locator('[data-point="1"]').click();
   assert.equal(await page.locator('[data-point="1"]').getAttribute('aria-pressed'),'true');
   await page.setViewportSize({width:1366,height:641});
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS same-document species switching and resizing');
}finally{await browser.close();}
