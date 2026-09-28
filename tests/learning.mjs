import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await b.newPage();await p.addInitScript(()=>{window.spoken='roar';window.SpeechRecognition=class{start(){this.onstart?.();setTimeout(()=>{this.onresult?.({results:[[{transcript:window.spoken}]]});this.onend?.();},30);}abort(){this.onend?.();}};});
 await p.goto('http://127.0.0.1:4175');await p.locator('#cards [data-species=trex]').click();await p.locator('[data-enter-3d]').click();await p.locator('[data-word=Roar]').first().click();
 await p.waitForTimeout(12000);assert.equal(await p.evaluate(()=>dinoGame.state.held),false);assert.equal(await p.evaluate(()=>dinoGame.state.clip),'roar');
 await p.locator('#mic').click();await p.waitForFunction(()=>document.getElementById('feedback').dataset.kind==='success');assert.equal(await p.evaluate(()=>dinoGame.state.held),false);
 await p.locator('#lesson-details summary').click();await p.locator('#translate').click();assert.ok(await p.locator('#translation').isVisible());
 await p.reload();await p.waitForFunction(()=>dinoGame.screen==='learn');assert.equal(await p.locator('#word').innerText(),'Roar');assert.ok((await p.locator('#progress').textContent()).startsWith('1'));
 await p.evaluate(()=>{window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined;});await p.locator('#mic').click();assert.ok((await p.locator('#feedback').innerText()).includes('Chrome'));
 console.log('PASS loops continuously, voice replays, persisted action/progress, details and mic fallback');
}finally{await b.close();}
