"""Exercise the single dated module locally or on its HTTPS deployment."""
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

BASE=os.environ.get('APP_TEST_URL','http://127.0.0.1:4173/')
OUT=Path(os.environ.get('APP_TEST_OUTPUT','/tmp/anglicka-liga-checks'))
OUT.mkdir(parents=True,exist_ok=True)
proxy=os.environ.get('HTTPS_PROXY') if urlsplit(BASE).hostname not in ('127.0.0.1','localhost') else None
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path),args=['--no-sandbox'],**({'proxy':{'server':proxy}} if proxy else {}))
    context=browser.new_context(viewport={'width':1440,'height':1100},locale='cs-CZ',reduced_motion='reduce')
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE,wait_until='networkidle')
    assert page.locator('.single-module').count()==1
    assert '9. 11. 2026' in page.locator('.single-module').inner_text()
    assert page.locator('.start-card').count()==2
    page.screenshot(path=str(OUT/'desktop.png'),full_page=True)
    for old in ['numbers','school','positions','sentences','extras','unknown','__proto__']:
        page.goto(BASE+'?module='+old,wait_until='networkidle')
        assert page.locator('.single-module').count()==1
    page.goto(BASE,wait_until='networkidle')
    page.evaluate('Math.random=()=>0.27')
    plan=page.evaluate("async()=> (await import('./src/content/test-2026-11-09.js')).makeLearningRound(0)")
    page.locator('[data-action="learn"]').click()

    def choose_order(q,wrong=False):
        words=q['answer'].split(' ')
        if wrong:words=words[1:]+words[:1]
        used=set()
        for word in words:
            index=next(i for i,t in enumerate(q['tokens']) if t==word and i not in used)
            used.add(index)
            page.locator(f'[data-action="token"][data-index="{index}"]').click()

    # One mixed learning round, exercising every interaction and an incorrect pair.
    for step,item in enumerate(plan):
        if item['type']=='flip':
            assert page.locator('[data-action="next"]').count()==0
            page.locator('[data-action="flip"]').click()
            assert page.locator('.flip-card.flipped').is_visible()
        elif item['type']=='match':
            ids=page.locator('[data-action="pair"][data-side="left"]').evaluate_all('(els)=>els.map(e=>e.dataset.id)')
            before=page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).goals")
            page.locator(f'[data-side="left"][data-id="{ids[0]}"]').click()
            page.locator(f'[data-side="right"][data-id="{ids[1]}"]').click()
            assert 'nesedí' in page.locator('.pair-feedback').inner_text()
            assert page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).goals")==before
            for id in ids:
                page.locator(f'[data-side="right"][data-id="{id}"]').click()
                page.locator(f'[data-side="left"][data-id="{id}"]').click()
            assert page.locator('.pair.matched').count()==8
        elif item['type']=='order':choose_order(item)
        else:
            index=item['options'].index(item['answer'])
            page.locator(f'[data-action="answer"][data-index="{index}"]').click()
        if item['type']!='flip':
            assert page.locator('.feedback.success').is_visible()
            assert 'Správná odpověď:' in page.locator('.feedback').inner_text()
        page.locator('[data-action="next"]').click()
    assert page.locator('h1').inner_text()=='Parádní trénink!'
    stored=page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1'))")
    assert stored['learnCursor']==4 and stored['rounds']==1
    page.locator('[data-action="home"]').click()
    page.reload(wait_until='networkidle')
    assert '1 herních kol' in page.locator('.small-progress').inner_text()
    # The next round teaches different cards and new prepositions/forms.
    page.locator('[data-action="learn"]').click()
    assert page.locator('.card-language').inner_text()=='ČESKY'
    page.locator('[data-action="home"]').click()
    page.locator('[data-action="resume"]').click()
    assert page.locator('.flip-card').is_visible()
    page.locator('[data-action="home"]').click()
    page.locator('[data-action="leave"]').click()

    # Mixed test: immediate grading, no confirmation click, no early advancement.
    page.evaluate('Math.random=()=>0.27')
    questions=page.evaluate("async()=> (await import('./src/content/test-2026-11-09.js')).makeTest()")
    page.locator('[data-action="test"]').click()
    for i,q in enumerate(questions):
        assert page.locator('.question-prompt').inner_text()==q['prompt']
        assert page.locator('.feedback').count()==0
        if i==1:page.locator('[data-action="skip"]').click()
        elif q['type']=='order':choose_order(q,wrong=i==0)
        else:
            index=q['options'].index(q['answer'])
            if i==0:index=(index+1)%len(q['options'])
            page.locator(f'[data-action="answer"][data-index="{index}"]').click()
        assert page.locator('.feedback').is_visible()
        assert q['answer'] in page.locator('.correct-answer').inner_text()
        assert q['explanation'] in page.locator('.feedback').inner_text()
        assert page.locator('.game-heading>span').last.inner_text()==f'{i+1} / 20'
        assert page.locator('[data-action="answer"]:enabled').count()==0
        if i in (0,1):assert page.locator('.feedback.try-again').is_visible()
        else:assert page.locator('.feedback.success').is_visible()
        if i==0:page.screenshot(path=str(OUT/'immediate-feedback.png'),full_page=True)
        page.locator('[data-action="next"]').click()
    assert page.locator('.result-score strong').inner_text()=='18 / 20'
    assert page.locator('[data-review-count]').get_attribute('data-review-count')=='2'
    page.screenshot(path=str(OUT/'results.png'),full_page=True)
    page.locator('[data-action="retry"]').click()
    assert page.locator('.game-heading>span').last.inner_text()=='1 / 2'
    page.locator('[data-action="skip"]').click()
    assert page.locator('.feedback.try-again').is_visible()
    page.locator('[data-action="home"]').click()
    page.locator('[data-action="leave"]').click()
    page.locator('#parent-open').click()
    assert '9. 11. 2026' in page.locator('#parent-content').inner_text()
    page.locator('[data-parent-tab="results"]').click()
    assert '90 %' in page.locator('.attempt-list').inner_text()
    page.locator('#parent-close').click()
    for name,width,height in [('ipad-portrait',768,1024),('ipad-landscape',1024,768),('phone',390,844)]:
        page.set_viewport_size({'width':width,'height':height})
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.screenshot(path=str(OUT/f'{name}.png'),full_page=True)
        page.locator('[data-action="test"]').click()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        if page.locator('.answer').count():assert page.locator('.answer').first.bounding_box()['height']>=44
        page.locator('[data-action="home"]').click()
        page.locator('[data-action="leave"]').click()
    # All test entry links work; module aliases no longer split the curriculum.
    page.goto(BASE+'?module=exam',wait_until='networkidle')
    assert page.locator('.game-heading>span').last.inner_text()=='1 / 20'
    page.goto(BASE,wait_until='networkidle')
    page.evaluate('async()=>{await navigator.serviceWorker.ready}')
    page.reload(wait_until='networkidle')
    context.set_offline(True)
    page.reload(wait_until='networkidle')
    page.locator('[data-action="learn"]').click()
    assert page.locator('.flip-card').is_visible()
    # Device input and storage/voice failures cannot block learning.
    touch=browser.new_context(viewport={'width':768,'height':1024},is_mobile=True,has_touch=True)
    touch.add_init_script("Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')};delete window.speechSynthesis")
    tablet=touch.new_page();tablet.on('pageerror',lambda e:errors.append(str(e)))
    tablet.goto(BASE,wait_until='networkidle')
    tablet.locator('[data-action="learn"]').tap()
    tablet.locator('[data-action="flip"]').tap()
    tablet.locator('[data-action="speak"]').tap()
    assert 'není' in tablet.locator('#toast').inner_text()
    tablet.locator('[data-action="next"]').tap()
    assert 'nepodařilo uložit' in tablet.locator('#toast').inner_text()
    assert tablet.locator('.pair').count()==8
    assert not errors,errors
    print(json.dumps({'status':'passed','checks':['one dated module','legacy URL migration','all learning activities','wrong pair explanation','curriculum progression','immediate locked feedback','mixed test:18/20','error retry','persistence','tablet and phone','touch','storage/voice fallback','offline'],'screenshots':str(OUT)},ensure_ascii=False))
    browser.close()
