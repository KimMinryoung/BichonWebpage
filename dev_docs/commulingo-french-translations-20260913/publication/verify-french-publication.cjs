const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root='/home/grass/frontend';const base=root+'/dev_docs/commulingo-french-translations-20260913/publication';
const prepared=JSON.parse(fs.readFileSync(base+'/documents.json'));const live=JSON.parse(fs.readFileSync(root+'/data/commulingo/docs/manifest.json'));
const targets=new Set(prepared.map(d=>d.id));const combined={...live,docs:live.docs.filter(d=>!targets.has(d.id)).concat(prepared)};
for(const r of JSON.parse(fs.readFileSync(base+'/queue-resolutions.json')))if(r.anchor)combined.redirects[r.member]={id:r.id,anchor:r.anchor};
fs.writeFileSync(base+'/manifest.verification.json',JSON.stringify(combined,null,2)+'\n');
const fakeFs={...fs,readFileSync(p,...args){if(p.endsWith('/docs/manifest.json'))return fs.readFileSync(base+'/manifest.verification.json',...args);const d=prepared.find(d=>p.endsWith('/docs/'+d.file));return fs.readFileSync(d?base+'/'+d.file:p,...args)},statSync(p,...args){const d=prepared.find(d=>p.endsWith('/docs/'+d.file));return fs.statSync(d?base+'/'+d.file:p,...args)}};
const sandbox={require:n=>n==='fs'?fakeFs:require(n),__dirname:root+'/data/commulingo',module:{exports:{}},console,Date,Map,Set};
vm.runInNewContext(fs.readFileSync(root+'/data/commulingo/docs-store.js','utf8'),sandbox);const store=sandbox.module.exports;
const results=[];for(const d of prepared){const content=store.getCommuLingoDocContent(d);assert(content);const ids=[...content.html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,d.id);for(const m of d.members||[])assert(content.toc.some(t=>t.id===m),m);results.push({id:d.id,toc:content.toc.length,htmlChars:content.html.length});}
for(const r of JSON.parse(fs.readFileSync(base+'/queue-resolutions.json')))if(r.anchor){const got=store.getCommuLingoDocRedirect(r.member);assert.equal(got.doc.id,r.id);assert.equal(got.anchor,r.anchor);}
fs.writeFileSync(base+'/store-verification.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({references:results.length,redirects:20,checks:'rendered heading uniqueness, collection TOC and redirects passed'}));
