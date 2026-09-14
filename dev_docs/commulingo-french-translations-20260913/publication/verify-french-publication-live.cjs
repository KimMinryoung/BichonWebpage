const {chromium}=require('/home/grass/frontend/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const P='/home/grass/frontend/dev_docs/commulingo-french-translations-20260913/publication';
(async()=>{const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const id='france-rights-and-emancipation-1789-1794';const response=await page.goto('http://127.0.0.1:3000/commulingo/docs/'+id,{waitUntil:'networkidle'});assert.equal(response.status(),200);
const check=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,ids:[...document.querySelectorAll('[id]')].map(x=>x.id),broken:[...document.querySelectorAll('.note-ref,.back-link')].filter(a=>!document.getElementById(a.hash.slice(1))).length,title:document.querySelector('h1').textContent,bodyChars:document.querySelector('.book').textContent.length}));
assert(!check.overflow);assert.equal(check.ids.length,new Set(check.ids).size);assert.equal(check.broken,0);for(const m of ['sonthonax-emancipation-proclamation-1793','france-womens-clubs-ban-1793'])assert(check.ids.includes(m));
await page.locator('.note-ref').first().click();assert(await page.evaluate(()=>!!document.getElementById(location.hash.slice(1))));
await page.screenshot({path:'/tmp/french-publication-production.png'});assert.equal(errors.length,0);fs.writeFileSync(P+'/browser-production.json',JSON.stringify({url:response.url(),check,errors},null,2)+'\n');console.log(JSON.stringify({status:200,overflow:check.overflow,brokenNotes:check.broken,newMembers:2,errors}));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
