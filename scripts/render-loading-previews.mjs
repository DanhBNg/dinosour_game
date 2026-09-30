import {build} from 'esbuild';import {chromium} from 'playwright';import fs from 'node:fs/promises';
const ids=['trex','stego','trice','ptero','mosa','deino','brachio','seal','squid','loggerhead','tuna','slug','shark','fish','amplectobelua'];
await fs.mkdir('assets/loading-previews',{recursive:true});
await build({entryPoints:['src/scene.js'],bundle:true,format:'esm',outfile:'dist/_loading-render.js'});
const browser=await chromium.launch({channel:'chrome',headless:true});
try{const p=await browser.newPage({viewport:{width:800,height:800}});await p.goto('http://127.0.0.1:4175/');await p.evaluate(async()=>{document.body.innerHTML='<div id="capture" style="width:768px;height:768px"></div>';const {createHabitat}=await import('/_loading-render.js');window.h=createHabitat(document.querySelector('#capture'));});
for(const id of (process.argv.length>2?process.argv.slice(2):ids)){
 const images=await p.evaluate(async id=>{await h.load(id);const key=id==='trex'?'roar':Object.keys(h.definitions)[0],large=await h.captureAction(key,{resolution:768,frames:24,columns:6,closeup:true});const img=new Image();img.src=large;await img.decode();const c=document.createElement('canvas');c.width=3072;c.height=2048;const ctx=c.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,c.width,c.height);return [large,c.toDataURL('image/webp',.92)];},id);
 for(const [i,size]of [768,512].entries())await fs.writeFile('assets/loading-previews/'+id+'-'+size+'.webp',Buffer.from(images[i].split(',')[1],'base64'));
 console.log('Rendered',id,'768 + 512');
}
}finally{await browser.close();await fs.rm('dist/_loading-render.js',{force:true});}
