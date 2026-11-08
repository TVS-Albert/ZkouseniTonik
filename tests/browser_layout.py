"""Viewport fit + keyboard navigation; detects overflow instead of hiding it."""
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

BASE=os.environ.get('APP_TEST_URL','http://127.0.0.1:4173/')
OUT=Path('/tmp/anglicka-liga-layout');OUT.mkdir(exist_ok=True)
proxy=os.environ.get('HTTPS_PROXY') if urlsplit(BASE).hostname not in ('127.0.0.1','localhost') else None
sizes=[(1366,768),(1280,720),(1024,768),(768,1024),(1180,820),(1024,600),(1366,600)]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path),args=['--no-sandbox'],**({'proxy':{'server':proxy}} if proxy else {}))
 errors=[];checks=0
 for width,height in sizes:
  context=browser.new_context(viewport={'width':width,'height':height},locale='cs-CZ',reduced_motion='reduce',has_touch=True)
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  def fit(label):
   global checks
   result=page.evaluate('''()=>{
    const d=document.documentElement,p=document.querySelector('.activity-panel'),c=document.querySelector('.game-controls');
    const bad=[];
    if(d.scrollHeight>innerHeight+1||d.scrollWidth>innerWidth+1)bad.push(`document ${d.scrollWidth}x${d.scrollHeight} vs ${innerWidth}x${innerHeight}`);
    if(p){
     const rect=p.getBoundingClientRect();
     for(const el of p.children){const r=el.getBoundingClientRect();if(getComputedStyle(el).display!=='none'&&(r.top<rect.top+3||r.bottom>rect.bottom-3))bad.push(el.className+' outside activity panel');}
     if(p.scrollHeight>p.clientHeight+1)bad.push('activity content overflows');
    }
    if(c){const r=c.getBoundingClientRect();if(r.bottom>innerHeight||r.top<0)bad.push('navigation outside screen');}
    return bad;
   }''')
   if result:
    page.screenshot(path=str(OUT/f'FAIL-{width}-{height}.png'),full_page=True)
    raise AssertionError(f'{width}x{height} {label}: {result}')
   checks+=1
  page.goto(BASE,wait_until='networkidle');fit('home')
  page.screenshot(path=str(OUT/f'home-{width}-{height}.png'),full_page=True)
  page.evaluate('Math.random=()=>0.27')
  page.locator('[data-action="learn"]').click();fit('first flip')
  page.locator('[data-action="cards"]').click();fit('cards browser')
  page.keyboard.press('ArrowLeft');assert page.locator('.game-heading>span').last.inner_text()=='1 / 52'
  page.keyboard.press('ArrowRight');assert page.locator('.flip-card.flipped').count()==1
  page.keyboard.press('ArrowRight');assert page.locator('.game-heading>span').last.inner_text()=='2 / 52'
  cursor=page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).learnCursor")
  page.keyboard.press('ArrowLeft');assert page.locator('.game-heading>span').last.inner_text()=='1 / 52'
  page.keyboard.press('ArrowRight');assert page.locator('.game-heading>span').last.inner_text()=='2 / 52'
  assert page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).learnCursor")==cursor
  # Every flashcard, including the long grammar translations, fits on the short laptop.
  count=51 if (width,height)==(1024,600) else 7
  for i in range(count):
   fit(f'card {i} front')
   page.keyboard.press('ArrowRight');fit(f'card {i} back')
   if i==4:page.screenshot(path=str(OUT/f'card-{width}-{height}.png'),full_page=True)
   page.keyboard.press('ArrowRight')
  page.locator('[data-action="home"]').first.click()
  if page.locator('[data-action="leave"]').count():page.locator('[data-action="leave"]').click()
  # Keep the entire learning round visible, before and after all answers.
  page.evaluate('Math.random=()=>0.27')
  cursor=page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).learnCursor")
  plan=page.evaluate("async cursor=>(await import('./src/content/test-2026-11-09.js')).makeLearningRound(cursor)",cursor)
  page.locator('[data-action="learn"]').click()
  def order(q):
   for index in range(len(q['tokens'])):page.locator(f'[data-action="token"][data-index="{index}"]').click()
  for i,item in enumerate(plan):
   fit(f'learning {i} {item["type"]} before')
   if item['type']=='flip':page.locator('.flip-card').click()
   elif item['type']=='match':
    ids=page.locator('[data-side="left"]').evaluate_all('(els)=>els.map(e=>e.dataset.id)')
    page.locator(f'[data-side="left"][data-id="{ids[0]}"]').click();page.locator(f'[data-side="right"][data-id="{ids[1]}"]').click();fit('wrong pair')
    for id in ids:
     page.locator(f'[data-side="left"][data-id="{id}"]').click();page.locator(f'[data-side="right"][data-id="{id}"]').click()
   elif item['type']=='order':order(item)
   else:page.locator('[data-action="skip"]').click()
   fit(f'learning {i} {item["type"]} after')
   page.locator('[data-action="next"]').click()
  fit('learning result');page.locator('[data-action="home"]').click()
  page.evaluate('Math.random=()=>0.27')
  questions=page.evaluate("async()=>(await import('./src/content/test-2026-11-09.js')).makeTest()")
  page.locator('[data-action="test"]').click()
  for i,q in enumerate(questions):
   fit(f'test {i} before')
   page.keyboard.press('ArrowRight');assert page.locator('.feedback').count()==0
   if q['type']=='order':order(q)
   else:page.locator('[data-action="skip"]').click()
   fit(f'test {i} feedback')
   if i==0:page.screenshot(path=str(OUT/f'feedback-{width}-{height}.png'),full_page=True)
   page.keyboard.press('ArrowRight')
  fit('test result')
  if page.locator('[data-review-count]').count():
   total=int(page.locator('[data-review-count]').get_attribute('data-review-count'))
   for i in range(total):fit(f'review {i}');page.keyboard.press('ArrowRight')
   page.keyboard.press('ArrowLeft');fit('review backwards')
  page.screenshot(path=str(OUT/f'result-{width}-{height}.png'),full_page=True)
  page.locator('#parent-open').click()
  for tab in ['content','results','settings']:
   page.locator(f'[data-parent-tab="{tab}"]').click()
   assert page.locator('#parent-dialog').evaluate('(el)=>el.scrollHeight<=el.clientHeight+1'),f'parent tab {tab} overflows'
  page.locator('#parent-close').click()
  context.close()
 assert not errors,errors
 browser.close()
 print(json.dumps({'status':'passed','viewports':sizes,'fit_checks':checks,'keyboard':'arrows and locked answers; revisits preserve progress'},ensure_ascii=False))
