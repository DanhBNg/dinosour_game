import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'chrome',headless:true});
try{
 const p=await b.newPage();await p.addInitScript(()=>{window.spoken='';window.SpeechRecognition=class{start(){this.onstart?.();setTimeout(()=>{this.onresult?.({results:[[{transcript:window.spoken}]]});this.onend?.();},20);}abort(){this.onend?.();}};});
 await p.goto('http://127.0.0.1:4175');let total=0;
 for(const id of ['trex']){
  await p.locator('#cards [data-species='+id+']').click();await p.locator('[data-enter-3d]').click();await p.locator('[data-action-index]').first().waitFor({timeout:60000});const lessons=await p.evaluate(()=>dinoGame.lessons);
  for(let i=0;i<lessons.length;i++){
   await p.locator('[data-action-index="'+i+'"]').click();await p.waitForFunction(key=>dinoGame.state.clip===key,lessons[i].actionKey);
   await p.locator('#lesson-details summary').click();await p.locator('#sentence-mode').check();
   await p.evaluate(word=>window.spoken=word,lessons[i].word);await p.locator('#mic').click();await p.waitForFunction(()=>document.getElementById('feedback').dataset.kind==='retry');
   await p.evaluate(text=>window.spoken=text,lessons[i].example);await p.locator('#mic').click();await p.waitForFunction(()=>document.getElementById('feedback').dataset.kind==='success');total++;

  }
  await p.locator('#back').click();await p.locator('#back').click();
 }
 assert.equal(total,12);assert.equal(await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('dino-island-progress'))).length),12);
 console.log('PASS 12 action icons open correct clip; sentence recognition rejects word-only and saves all 12');
}finally{await b.close();}
