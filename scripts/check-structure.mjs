import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name==='.git'?[]:e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);
const files=walk(root).filter(f=>f.endsWith('.js')&&!f.includes('/tests/'));
const sw=readFileSync(resolve(root,'sw.js'),'utf8');
for(const file of files){
 for(const match of readFileSync(file,'utf8').matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)){
  if(!existsSync(resolve(dirname(file),match[1])))throw Error(`Missing import in ${relative(root,file)}: ${match[1]}`);
 }
 if(!file.endsWith('/sw.js')&&!sw.includes(`'./${relative(root,file)}'`))throw Error(`Offline cache missing ${relative(root,file)}`);
}
const list=sw.match(/const ASSETS=(\[[^;]+\]);/)[1];
for(const match of list.matchAll(/'([^']+)'/g))if(!existsSync(resolve(root,match[1])))throw Error(`Missing asset: ${match[1]}`);
console.log(`Structure OK: ${files.length} runtime JS files; relative imports and offline assets resolve.`);
