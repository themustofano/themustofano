const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const output = 'artifacts/qa';
const expected = { date: [[131,558],[111,225]], voice: [[246,454],[154]], nav: [[94],[55.65,151]], composer: [[149,155,243,249],[340]], agent: [[137,145,563],[343]] };
(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const report={checks:[],errors:[],responsive:[]};
  const check=(value,message)=>{assert(value,message);report.checks.push(message)};
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('console',e=>{if(e.type()==='error')report.errors.push(e.text())});
  page.on('response',r=>{if(r.status()>=400)report.errors.push(`${r.status()} ${r.url()}`)});
  try {
    await page.goto(process.env.QA_URL||'http://127.0.0.1:4174',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const origin=await page.evaluate(()=>performance.timeOrigin);
    const geometry=await page.locator('.profile,.mode-toggle,.showcase-list,footer').evaluateAll(es=>es.map(e=>{const {x,y,width,height}=e.getBoundingClientRect();return {x,y,width,height}}));
    assert.deepEqual(geometry,[{x:450,y:120,width:540,height:949},{x:633.5,y:1149,width:173,height:33},{x:370,y:1222,width:700,height:2634},{x:370,y:3896,width:700,height:21}]);
    check(true,'Existing desktop geometry preserved exactly');
    check(await page.locator('.demo-canvas').count()===5,'Five Static compositions rendered as code');
    check(await page.locator('.static-artwork').count()===0,'No whole-composition images');
    check(await page.locator('.card-controls input:checked,.ruler-overlay:visible').count()===0,'All rulers initially off');
    check(await page.locator('.coded-artwork[inert]').count()===5,'Static compositions preserve their illustrated state');
    const requests=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
    check(!requests.some(r=>/(date|voice|nav|composer|agent)-(700|1050|1400)\.webp/.test(r)),'No retired raster composition downloads');
    for(const link of await page.locator('.socials a').all()){
      await link.hover();await page.waitForTimeout(150);
      const s=await link.evaluate(e=>{const s=getComputedStyle(e);return [s.color,s.backgroundColor,getComputedStyle(e.firstElementChild).maskImage]});
      check(s[0]==='rgb(0, 0, 0)'&&s[1]==='rgba(0, 0, 0, 0)'&&s[2].includes('.svg'),'Social hover only colors SVG icon black');
    }
    const text=page.getByRole('link',{name:'Selected work',exact:true});
    await page.mouse.move(0,0);await page.waitForTimeout(450);
    const before=await text.boundingBox();
    await text.hover();await page.waitForTimeout(60);
    const middle=await text.evaluate(e=>getComputedStyle(e).backgroundSize);
    check(middle!=='100% 1px, 100% 1px'&&middle!=='0% 1px, 100% 1px','Underline animates progressively over light track');
    await page.waitForTimeout(450);
    check(await text.evaluate(e=>getComputedStyle(e).backgroundSize)==='100% 1px, 100% 1px','Underline fully reveals on hover');
    assert.deepEqual(await text.boundingBox(),before);check(true,'Link hover causes no text movement or layout shift');
    await page.mouse.move(0,0);await page.waitForTimeout(450);
    check(await text.evaluate(e=>getComputedStyle(e).backgroundSize)==='0% 1px, 100% 1px','Underline retracts left on hover out');
    check(await page.locator('.profile a:not(.socials a):not(.text-link)').count()===0,'All normal profile links share underline treatment');
    await page.screenshot({path:`${output}/static-desktop.png`,fullPage:true});
    for(const [id,positions] of Object.entries(expected)){
      const card=page.locator(`[data-showcase=${id}]`),box=await card.boundingBox();
      await card.locator('input[type=checkbox]').check();await page.waitForTimeout(50);
      const lines=await card.locator('line').evaluateAll(es=>es.map(e=>['x1','x2','y1','y2'].map(a=>Number(e.getAttribute(a)))));
      const actual=[lines.filter(l=>l[0]===l[1]).map(l=>l[0]),lines.filter(l=>l[2]===l[3]).map(l=>l[2])];
      assert.equal(lines.length,positions[0].length+positions[1].length,'Ruler SVG must contain every configured guide');
      actual.forEach((axis,a)=>axis.forEach((v,i)=>assert(Math.abs(v-positions[a][i])<.02)));
      check(true,`${id}: element-anchored guides match Figma`);
      check(await card.locator('.ruler-overlay').evaluate(e=>getComputedStyle(e).pointerEvents)==='none',`${id}: overlay never intercepts pointer events`);
      const after=await card.boundingBox();check(box.width===after.width&&box.height===after.height,`${id}: overlay does not alter layout`);
    }
    await page.locator('.showcase-list').screenshot({path:`${output}/rulers-desktop.png`});
    check(await page.locator('.note-popover,.voice-panel,.navigation-menu,.aspect-menu,.agent-menu').count()===5,'Ruler controls do not dismiss illustrated floating panels');
    for(const checkbox of await page.locator('.card-controls input').all())await checkbox.uncheck();
    check(await page.locator('.ruler-overlay:visible').count()===0,'Disabling rulers hides every overlay');
    const first=page.locator('.card-controls input').first();await first.focus();await page.keyboard.press('Space');
    check(await first.isChecked(),'Rulers support keyboard toggling');
    check(await first.evaluate(e=>e.matches(':focus-visible')),'Checkbox has visible keyboard focus');await page.keyboard.press('Space');
    const disabled=page.getByRole('tab',{name:'Interaction',exact:true});
    check(await disabled.isDisabled(),'Interaction uses native disabled semantics');
    await disabled.hover();await page.waitForTimeout(150);
    const disabledStyle=await disabled.evaluate(e=>{const s=getComputedStyle(e);return [s.color,s.backgroundColor,s.cursor,s.opacity]});
    assert.deepEqual(disabledStyle,['rgb(145, 145, 145)','rgba(0, 0, 0, 0)','default','1']);
    await disabled.click({force:true});
    await page.getByRole('tab',{name:'Static',exact:true}).focus();
    for(const key of ['ArrowRight','End','Enter','Space'])await page.keyboard.press(key);
    check(await page.getByRole('tab',{name:'Static',exact:true}).getAttribute('aria-selected')==='true'&&await page.locator('.showcase-card').count()===5,'Clicking or keyboard activation cannot leave Static');
    check(await page.evaluate(()=>performance.timeOrigin)===origin,'No page reload');
    check(await page.locator('.intro .section-heading').textContent()==='Hello, Ciao, 안녕하세요, Hai, こんにちは','Greeting matches latest Figma');
    for(const card of await page.locator('.showcase-card').all()){
      await card.scrollIntoViewIfNeeded();
      const read=()=>card.evaluate(e=>{const base=e.getBoundingClientRect();return {scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,rects:[...e.querySelectorAll('.coded-artwork *,.card-controls *')].map(n=>{const r=n.getBoundingClientRect();return [r.x-base.x,r.y-base.y,r.width,r.height]})}});
      const snapshot=await read();
      for(let i=0;i<6;i++){await card.locator('input[type=checkbox]').click();assert.deepEqual(await read(),snapshot);}
      check(true,`${await card.getAttribute('data-showcase')}: every content and control rectangle stays stationary through six toggles`);
    }
    await text.click();check(page.url().endsWith('#selected-work'),'Selected work anchor works');
    check(await page.getByRole('link',{name:'themustofano@gmail.com'}).getAttribute('href')==='mailto:themustofano@gmail.com','Email destination preserved');
    for(const width of [320,390,768]){
      await page.setViewportSize({width,height:900});for(const c of await page.locator('.card-controls input').all())await c.check();await page.waitForTimeout(100);
      const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,ratios:[...document.querySelectorAll('.artboard')].map(e=>{const r=e.getBoundingClientRect();return r.width/r.height}),guides:[...document.querySelectorAll('.ruler-overlay line')].map(e=>[Number(e.getAttribute('x1')),Number(e.getAttribute('y1'))])}));
      check(!result.overflow&&result.ratios.every(r=>Math.abs(r-700/450)<.002),`${width}px: proportional artwork without overflow`);
      const reference=Object.values(expected).flatMap(([xs,ys])=>[...xs.map(x=>[x,0]),...ys.map(y=>[0,y])]);
      check(result.guides.every((g,i)=>g.every((v,a)=>Math.abs(v-reference[i][a])<.06)),`${width}px: guides remain aligned to content`);
      report.responsive.push({width,...result});if(width===390)await page.screenshot({path:`${output}/rulers-mobile.png`,fullPage:true});
    }
    check(report.errors.length===0,'No browser errors or failed assets');
    await fs.writeFile(`${output}/report.json`,JSON.stringify(report,null,2));console.log(`${report.checks.length} browser checks passed; screenshots in ${output}`);
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
