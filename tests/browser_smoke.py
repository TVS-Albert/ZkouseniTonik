"""Run against `npm start`. Uses the environment's Playwright and Chromium."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('APP_TEST_URL', 'http://127.0.0.1:4173/')
OUT = Path(os.environ.get('APP_TEST_OUTPUT', '/tmp/anglicka-liga-checks'))
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else p.chromium.executable_path), args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1100}, locale='cs-CZ')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE, wait_until='networkidle')
    page.screenshot(path=str(OUT/'desktop.png'), full_page=True)
    assert page.locator('.module-card').count() == 4
    assert page.locator('h1').inner_text() == 'Malý hráč.\nVelká angličtina.'

    # README links must open the requested lesson, not just the home screen.
    for module, title in [('numbers', 'Čísla 11–20'), ('school', 'Ve škole'), ('positions', 'Kde to je?'), ('sentences', 'Poskládej větu'), ('extras', 'Bonusová přihrávka'), ('exam', 'Ukaž, co už umíš.')]:
        page.goto(BASE + '?module=' + module, wait_until='networkidle')
        assert page.locator('h1').inner_text() == title
    for invalid in ['unknown', '__proto__', 'toString']:
        page.goto(BASE + '?module=' + invalid, wait_until='networkidle')
        assert page.locator('.module-card').count() == 4
    page.goto(BASE, wait_until='networkidle')

    # Every lesson loads its study illustrations and explanations.
    for category, length in [('school', 15), ('positions', 4), ('sentences', 8), ('extras', 15)]:
        page.locator(f'[data-action="lesson"][data-id="{category}"]').click()
        page.locator('[data-action="study"]').click()
        for i in range(length):
            assert page.locator('[data-action="next-card"]').is_disabled()
            page.locator('[data-action="reveal"]').click()
            assert page.locator('.card-reveal').is_visible()
            page.locator('[data-action="next-card"]').click()
        page.locator('[data-action="home"]').click()

    # Complete a lesson, both translation directions; retain it after reload.
    page.locator('[data-action="lesson"][data-id="numbers"]').click()
    page.locator('[data-action="study"]').click()
    for i in range(10):
        assert page.locator('[data-action="next-card"]').is_disabled()
        if i == 0:
            assert page.locator('.card-word').inner_text() == 'jedenáct'
        if i == 1:
            assert page.locator('.card-word').inner_text() == 'twelve'
        page.locator('[data-action="reveal"]').click()
        page.locator('[data-action="next-card"]').click()
    page.reload(wait_until='networkidle')
    assert 'numbers' in page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).completed")

    # Pair matching: a mismatch earns no goal; each matched pair earns exactly one.
    page.locator('[data-action="lesson"][data-id="school"]').click()
    page.locator('[data-action="match"]').click()
    left = page.locator('[data-action="pair-left"]').evaluate_all('(els)=>els.map(e=>e.dataset.id)')
    page.locator(f'[data-action="pair-left"][data-id="{left[0]}"]').click()
    page.locator(f'[data-action="pair-right"][data-id="{left[1]}"]').click()
    assert page.locator('.pair.incorrect').count() == 2
    assert page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).goals") == 0
    for word in left:
        page.locator(f'[data-action="pair-right"][data-id="{word}"]').click()
        page.locator(f'[data-action="pair-left"][data-id="{word}"]').click()
    assert page.locator('.pair.matched').count() == 8
    assert page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).goals") == 4
    page.locator('[data-action="lesson"]').first.click()

    # Full practice run: select correct translations using the content bank.
    words = page.evaluate("async()=> (await import('./content.js')).school")
    translations = {x['en']: x['cs'] for x in words} | {x['cs']: x['en'] for x in words}
    page.locator('[data-action="practice"]').click()
    for i in range(10):
        word = page.locator('.question-prompt').inner_text()
        answer = translations[word]
        answers = page.locator('.answer').all_inner_texts()
        idx = next(i for i, text in enumerate(answers) if text.split('\n')[-1] == answer)
        page.locator(f'[data-action="answer"][data-index="{idx}"]').click()
        page.locator('[data-action="submit-answer"]').click()
        assert page.locator('.feedback.success').is_visible()
        assert page.locator('.answer.correct').count() == 1
        page.locator('[data-action="submit-answer"]').click()
    assert page.locator('.result-score strong').inner_text() == '10 / 10'
    page.locator('[data-action="home"]').first.click()

    # Deterministic exam: 18 correct, 1 wrong, 1 skipped, no feedback before end.
    page.evaluate('Math.random = () => 0.27')
    questions = page.evaluate("async()=> (await import('./engine.js')).makeExam()")
    page.locator('[data-action="exam-intro"]').click()
    page.locator('[data-action="start-exam"]').click()
    for i, q in enumerate(questions):
        assert page.locator('.question-prompt').inner_text() == q['prompt']
        assert page.locator('.feedback, .answer.correct').count() == 0
        if i == 1:
            page.locator('[data-action="skip"]').click()
            continue
        idx = q['options'].index(q['answer'])
        if i == 0:
            idx = (idx + 1) % len(q['options'])
        page.locator(f'[data-action="answer"][data-index="{idx}"]').click()
        page.locator('[data-action="submit-answer"]').click()
    assert page.locator('.result-score strong').inner_text() == '18 / 20'
    assert page.locator('.result-categories .white-panel').count() == 4
    assert page.locator('.review-panel details').count() == 2
    attempt = page.evaluate("JSON.parse(localStorage.getItem('anglicka-liga-v1')).attempts.at(-1)")
    assert attempt['percent'] == 90
    assert all(v['total'] == 5 for v in attempt['categories'].values())
    page.screenshot(path=str(OUT/'results.png'), full_page=True)
    page.locator('[data-action="retry-missed"]').click()
    assert '1 / 2' in page.locator('.game-heading').inner_text()
    page.locator('[data-action="home"]').click()
    page.locator('[data-action="resume"]').click()
    assert page.locator('.question-prompt').is_visible()
    page.locator('[data-action="home"]').click()
    page.locator('[data-action="leave-confirm"]').click()

    # Parent dialog and touch-size viewports; no horizontal scrolling.
    page.locator('#parent-open').click()
    assert page.locator('#parent-dialog').is_visible()
    assert '90 %' in page.locator('.attempt-list').inner_text()
    page.locator('#parent-close').click()
    for name, width, height in [('ipad-portrait', 768, 1024), ('ipad-landscape', 1024, 768), ('phone', 390, 844)]:
        page.set_viewport_size({'width': width, 'height': height})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.screenshot(path=str(OUT/f'{name}.png'), full_page=True)
        page.locator('[data-action="lesson"][data-id="positions"]').click()
        page.locator('[data-action="practice"]').click()
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert page.locator('.answer').first.bounding_box()['height'] >= 44
        page.screenshot(path=str(OUT/f'{name}-question.png'), full_page=True)
        page.locator('[data-action="home"]').click()
        page.locator('[data-action="leave-confirm"]').click()

    # Speech API absent: text learning remains functional.
    page.evaluate('delete window.speechSynthesis')
    page.locator('[data-action="lesson"][data-id="school"]').click()
    page.locator('[data-action="study"]').click()
    page.locator('[data-action="reveal"]').click()
    page.locator('[data-action="speak-card"]').click()
    assert 'neumí výslovnost' in page.locator('#toast').inner_text()
    page.locator('[data-action="lesson"]').first.click()
    page.locator('[data-action="home"]').click()

    # Offline launch, including under a GitHub Pages-like subpath, is checked
    # by rerunning this script with APP_TEST_URL ending in that subdirectory.
    page.evaluate('async()=>{await navigator.serviceWorker.ready}')
    page.reload(wait_until='networkidle')
    context.set_offline(True)
    page.reload(wait_until='networkidle')
    assert page.locator('.module-card').count() == 4
    page.locator('[data-action="lesson"][data-id="positions"]').click()
    page.locator('[data-action="practice"]').click()
    assert page.locator('.scene').is_visible()
    touch = browser.new_context(viewport={'width': 768, 'height': 1024}, is_mobile=True, has_touch=True)
    touch.add_init_script("Storage.prototype.getItem = function(){throw new Error('Storage unavailable')}; Storage.prototype.setItem = function(){throw new Error('Storage unavailable')}")
    tablet = touch.new_page()
    tablet.on('pageerror', lambda e: errors.append(str(e)))
    tablet.goto(BASE, wait_until='networkidle')
    tablet.locator('[data-action="lesson"][data-id="positions"]').tap()
    tablet.locator('[data-action="study"]').tap()
    for i in range(4):
        tablet.locator('[data-action="reveal"]').tap()
        tablet.locator('[data-action="next-card"]').tap()
    assert 'neuložil pokrok' in tablet.locator('#toast').inner_text()
    tablet.locator('[data-action="practice"]').tap()
    tablet.locator('[data-action="answer"][data-index="0"]').tap()
    tablet.locator('[data-action="submit-answer"]').tap()
    assert tablet.locator('.feedback').is_visible()
    assert tablet.evaluate('document.documentElement.scrollWidth <= innerWidth')
    touch.close()
    assert not errors, errors
    print(json.dumps({'status':'passed','checks':['all study cards','bidirectional learning','persistence','matching and mismatch','practice scoring','20-question exam:18/20','error review and retry','parent summary','tablet and phone layouts','touch interaction','storage unavailable fallback','speech fallback','offline reload'],'screenshots':str(OUT)}, ensure_ascii=False))
    browser.close()
