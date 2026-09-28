import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const p=await b.newPage();
 await p.addInitScript(()=>{window.spoken='';window.SpeechRecognition=class{start(){this.onstart?.();setTimeout(()=>{this.onresult?.({results:[[{transcript:window.spoken}]]});this.onend?.();},20);}abort(){this.onend?.();}};});
 await p.goto('http://127.0.0.1:4175');let total=0;
 for(const id of ['trex','stego','trice','ptero','mosa','deino']){
  await p.locator('#cards [data-species='+id+']').click();await p.waitForFunction(()=>!document.getElementById('learn').disabled);await p.locator('#learn').click();
  const lessons=await p.evaluate(()=>dinoGame.lessons);
  for(let i=0;i<lessons.length;i++){
   await p.locator('[data-lesson="'+i+'"]').click();await p.locator('#sentence-mode').check();
   await p.evaluate(word=>window.spoken=word,lessons[i].word);await p.locator('#mic').click();await p.waitForTimeout(80);
   assert.equal(await p.locator('#completion').isVisible(),false);
   await p.evaluate(text=>window.spoken=text,lessons[i].example);await p.locator('#mic').click();await p.waitForFunction(()=>document.getElementById('feedback').textContent.startsWith('✓'));total++;
  }
  assert.equal(await p.locator('#completion').isVisible(),true);await p.locator('.brand').click();
 }
 assert.equal(total,50);console.log('PASS all 50 sentence lessons trigger animations and per-species completion; isolated words rejected in sentence mode');
}finally{await b.close();}
