import {build} from 'esbuild';
import {chromium} from 'playwright';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=process.cwd();
await mkdir('assets/action-previews',{recursive:true});
await build({entryPoints:['src/scene.js'],bundle:true,format:'esm',outfile:'dist/_sprite.js'});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-background-timer-throttling']});
try{
 const page=await browser.newPage({viewport:{width:512,height:512}});
 await page.goto('http://127.0.0.1:4175');
 await page.evaluate(async()=>{document.body.innerHTML='<div id="capture" style="width:256px;height:256px"></div>';const {createHabitat}=await import('/_sprite.js');window.captureHabitat=createHabitat(document.getElementById('capture'));});
 for(const id of (process.argv.slice(2).length?process.argv.slice(2):['trex','stego','trice','ptero','mosa','deino','seal','squid','isopod','hawksbill','whale','loggerhead','tuna','slug','shark','paShark','fish','amplectobelua'])){
  const keys=await page.evaluate(async id=>{await captureHabitat.load(id);return Object.keys(captureHabitat.definitions);},id);
  for(const key of keys){const data=await page.evaluate(key=>captureHabitat.captureAction(key),key);await writeFile(resolve(root,'assets/action-previews',id+'-'+key+'.webp'),Buffer.from(data.split(',')[1],'base64'));console.log(id+'/'+key);}
 }
}finally{await browser.close();await rm('dist/_sprite.js',{force:true});}
