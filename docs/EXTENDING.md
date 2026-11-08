# Jak rozšířit hru

## Nová slovíčka v existujícím tématu

Upravte `src/content/english-school.js`. Kartička má unikátní `id`, zobrazovaný anglický tvar `en`, český tvar `cs` a podle potřeby `icon`, `plural` nebo `number`. Nové slovíčko se automaticky objeví v kartičkách, procvičování i párování. Pro kresbu lze doplnit `art.js`; při neznámé ikoně se zobrazí neutrální fotbalový symbol. Otázka musí mít alespoň dvě různé možnosti a jednu správnou odpověď.

## Nové téma nebo předmět

`defineCourse` v `src/core/curriculum.js` přijímá `id`, `title`, `topics` a továrnu `exam`. Téma obsahuje `id`, `deck`, `practice(direction)` a metadata pro UI. `createCourseRegistry` udržuje více kurzů bez kolizí identifikátorů. Praktický spustitelný příklad nového matematického předmětu je v `tests/architecture.test.js`.

`makePractice(topicId, direction, course)` a `makeExam(course)` přijímají libovolný validní kurz. `makePairs(deck)` nemá závislost na konkrétním kurzu. Původní anglický kurz je výchozí, takže staré importy dál fungují.

Pro nové párovací předměty jsou `cs` a `en` historické názvy levého a pravého popisku; nevyžadují angličtinu. `vocabularyPractice` má anglické instruktážní texty, které nový kurz může přepsat v otázce. Otázka má `id`, `category`, `type: 'choice'`, `task`, `prompt`, `answer`, `options`, `explanation` a nepovinné `scene`/`speak`. Data jsou důvěryhodný lokální JS modul; nejde o import libovolného kódu od uživatele.

Pro zapojení nového kurzu do grafického rozhraní je třeba přidat výběr předmětu, jeho názvy, lokalizované instrukce, identifikátor úložiště a rozložení zkoušky. Současné UI záměrně zobrazuje jen Anglickou ligu; samotný registr není hotový uživatelský přepínač předmětů. English-specific gramatické šablony jsou v samostatném modulu; například matematika je nepřebírá.

## Nový typ úlohy

Přidejte modul do `src/exercises/`. Generátor nesmí přistupovat k DOM ani úložišti. Standardní otázka `choice` využije existující renderer; nový způsob interakce vyžaduje renderer a obsluhu v UI. Pro nové obrázkové scény rozšiřte `art.js`. Přidejte jednotkové i prohlížečové scénáře.

Po přidání modulu aktualizujte `ASSETS` a verzi cache v `sw.js`, spusťte `npm run check`, `npm test` a `python tests/run_browser.py`. Upravte `CONTENT.md` a popis testového pokrytí, pokud se změní učivo nebo počet otázek.

## Aktuální modul přípravy na test

Od 8. listopadu se hlavní UI opírá o `src/content/test-2026-11-09.js`. Obsahuje metadata jediného testu, interleavovanou banku všech karet a továrny `makeLearningRound(cursor)` a `makeTest()`. Původní banky zůstávají opakovaně použitelné interně. Budoucí modul pro další test založte v samostatném datovaném souboru; teprve při jeho přidání doplňte volbu mezi skutečnými testovými moduly. `src/core/session.js` lze použít pro oba režimy; první odpověď je definitivní a další otázka se otevře až po explicitním přechodu.

Nový typ `order` poskytuje `tokens`, `answer` a `explanation`, ne `options`. Tokeny musí odpovídat slovům správné odpovědi i počtem výskytů. Renderer používá indexy, aby se nezaměňovala opakovaná slova. Testy sestavuje nový modul; původní `makeExam` z `engine.js` je kompatibilní bankové API a není aktuální zkouškou v UI.
