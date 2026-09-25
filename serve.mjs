import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {dirname,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'dist');
createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost'),file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+'/')&&!file.startsWith(root+'\\')){res.writeHead(403).end();return;}const data=await readFile(file);res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpeg':'image/jpeg','.mp4':'video/mp4','.json':'application/json','.glb':'model/gltf-binary'}[extname(file)]||'application/octet-stream','Content-Length':data.length});res.end(data);}catch{res.writeHead(404).end('Not found');}}).listen(4175,'127.0.0.1',()=>console.log('http://127.0.0.1:4175'));
