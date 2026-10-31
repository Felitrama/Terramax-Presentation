import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const url=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const requests=[];page.on('request',request=>requests.push(request.url()));
await mkdir('test-results',{recursive:true});
try{
 for(const [width,height] of [[1920,1080],[1366,768],[390,844]]){
  await page.setViewportSize({width,height});
  await page.goto(url+'/#1');
  for(let index=0;index<10;index++){
   await page.locator('.slide-count').filter({hasText:`${index+1}/10`}).waitFor();
   await page.waitForTimeout(230);
   const problems=await page.evaluate(()=>{
    const issues=[];const article=document.querySelector('.slide');const rect=article.getBoundingClientRect();
    for(const el of article.querySelectorAll('h1,h3,p,li,td,th,.team-list>div,.takeaway,.cash-timeline')){
     const r=el.getBoundingClientRect();
     if(r.left<rect.left-1||r.right>rect.right+1||r.top<rect.top-1||r.bottom>rect.bottom-95*(rect.width/1600))issues.push('Outside safe area: '+el.textContent);
     if(el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2)issues.push('Overflow: '+el.textContent);
     const range=document.createRange();range.selectNodeContents(el);const rr=range.getBoundingClientRect();
     if(rr.right>r.right+2||rr.bottom>r.bottom+2)issues.push('Text clipped: '+el.textContent);
    }
    if(document.documentElement.scrollHeight>innerHeight||document.documentElement.scrollWidth>innerWidth)issues.push('Document scroll');
    return issues;
   });
   assert.deepEqual(problems,[],`Slide ${index+1} at ${width}x${height}`);
   assert.equal(await page.locator('article.slide').count(),1);
   if(width!==390)await page.screenshot({path:`test-results/${width}-slide-${index+1}.png`});
   if(index===9){const image=page.locator('.farewell-visual img');await image.evaluate(async img=>{await img.decode()});assert.ok(await image.evaluate(img=>img.naturalWidth>0));}
   if(index<9)await page.keyboard.press('ArrowRight');
  }
 }
 await page.setViewportSize({width:1366,height:768});
 await page.goto(url+'/#1');
 await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.slide-count').innerText(),'1/10');
 await page.keyboard.press('Space');assert.equal(await page.locator('.slide-count').innerText(),'2/10');
 await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('.slide-count').innerText(),'1/10');
 await page.getByRole('button',{name:'Diapositiva siguiente',exact:true}).click();assert.equal(await page.locator('.slide-count').innerText(),'2/10');
 await page.keyboard.press('f');await page.waitForFunction(()=>!!document.fullscreenElement);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.fullscreenElement);
 await page.getByRole('button',{name:'Activar pantalla completa',exact:true}).click();await page.waitForFunction(()=>!!document.fullscreenElement);
 await page.keyboard.press('f');await page.waitForFunction(()=>!document.fullscreenElement);
 const popupPromise=page.waitForEvent('popup');await page.keyboard.press('p');const popup=await popupPromise;
 await popup.locator('.spoken-note').waitFor();assert.match(await popup.locator('.speaker-time').innerText(),/Nicolás/);
 await page.keyboard.press('ArrowRight');await popup.waitForFunction(()=>document.querySelector('.slide-count').textContent==='3/10');
 await popup.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.slide-count').textContent==='4/10');await popup.waitForFunction(()=>document.querySelector('.slide-count').textContent==='4/10');
 await page.keyboard.press('f');await page.waitForFunction(()=>!!document.fullscreenElement);
 await popup.keyboard.press('ArrowLeft');await page.waitForFunction(()=>document.querySelector('.slide-count').textContent==='3/10');assert.ok(await page.evaluate(()=>!!document.fullscreenElement));
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.fullscreenElement);
 assert.equal(await page.locator('.presenter-notes').count(),0);
 await popup.screenshot({path:'test-results/presenter.png'});await popup.close();
 await page.goto(url+'/#8');assert.match(await page.locator('table').innerText(),/-14,52/);assert.match(await page.locator('table').innerText(),/58,80/);
 await page.reload();assert.equal(await page.locator('.slide-count').innerText(),'8/10');
 await context.setOffline(true);await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.slide-count').innerText(),'9/10');
 await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.slide-count').innerText(),'10/10');
 await page.keyboard.press('ArrowRight');assert.equal(await page.locator('.slide-count').innerText(),'10/10');
 assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r.startsWith(url)||r.startsWith('data:')),'External request detected');
 await writeFile('test-results/report.txt','PASS: 30 slide/viewport checks; 20 screenshots; safe bounds; one slide mounted; arrows, space, buttons, fullscreen F/Escape, notes window synchronization, hash/reload, offline navigation, financial figures, no external requests or JS errors.\n');
 console.log('PASS: all presentation checks.');
}finally{await browser.close()}
