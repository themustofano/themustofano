const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp=require(process.env.SHARP_MODULE || 'sharp');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:2});await p.goto(process.env.QA_URL || 'http://127.0.0.1:4174',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
for(const id of ['date','voice','nav','composer','agent']){
 const card=p.locator(`[data-showcase=${id}]`);await card.scrollIntoViewIfNeeded();const board=card.locator('.artboard');
 const off=await sharp(await board.screenshot()).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 await card.locator('input[type=checkbox]').check();await p.mouse.move(0,0);
 const on=await sharp(await board.screenshot()).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const lines=await card.locator('line').evaluateAll(es=>es.map(e=>[+e.getAttribute('x1'),+e.getAttribute('x2'),+e.getAttribute('y1'),+e.getAttribute('y2')]));let changed=0;
 assert.equal(lines.length,{date:4,voice:3,nav:3,composer:5,agent:4}[id]);
 let redPixels=0;
 for(let i=0;i<on.data.length;i+=4)if(on.data[i]>off.data[i] || on.data[i+1]<off.data[i+1])redPixels++;
 assert(redPixels>100,`${id}: enabling rulers must visibly paint red guides`);
 for(let y=0;y<off.info.height;y++)for(let x=0;x<off.info.width;x++){
  if(lines.some(l=>l[0]===l[1]?Math.abs(x-l[0]*2)<3:Math.abs(y-l[2]*2)<3))continue;
  const i=(y*off.info.width+x)*4;if([0,1,2,3].some(c=>off.data[i+c]!==on.data[i+c]))changed++;
 }
 assert.equal(changed,0,`${id} pixels outside guide lines changed`); console.log(`${id}: zero changed artwork pixels outside guides`);
 await card.locator('input[type=checkbox]').uncheck();await card.screenshot({path:`/private/tmp/latest-${id}.png`});
}
await p.locator('.voice-panel').screenshot({path:'/private/tmp/latest-voice-modal.png'});await b.close();})();
