import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const arg=process.argv.indexOf('--port');
const port=Number(arg>=0?process.argv[arg+1]:4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.woff2':'font/woff2'};
try{await stat(resolve(root,'index.html'))}catch{console.error('Falta dist/. Ejecutá npm run build primero.');process.exit(1)}
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const path=resolve(root,`.${pathname==='/'?'/index.html':pathname}`);if(!path.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403);return res.end('Forbidden')}const data=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`TerraMax: http://127.0.0.1:${port} (sin conexión externa)`));
