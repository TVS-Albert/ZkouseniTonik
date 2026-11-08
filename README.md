# Anglická liga ⚽

**[Spustit online aplikaci](https://tvs-albert.github.io/ZkouseniTonik/)**

Jeden modul: **Angličtina – příprava na test 9. 11. 2026**. Všechno dosavadní učivo je pohromadě. Další moduly přibudou až s novým učivem a dalšími testy.

## Dvě jednoduché volby

| Část | Odkaz | Jak funguje |
| --- | --- | --- |
| Úvodní stránka | [Otevřít modul](https://tvs-albert.github.io/ZkouseniTonik/) | Všechno učivo a dvě velká tlačítka |
| Učit se hrou | [Začít hraní](https://tvs-albert.github.io/ZkouseniTonik/?module=learn) | Otáčení kartiček, spojování dvojic, počítání obrázků, předložky a skládání slov i vět |
| Vyzkoušet se | [Začít zkoušení](https://tvs-albert.github.io/ZkouseniTonik/?module=exam) | 20 různorodých otázek, okamžitě vyhodnocených po každé odpovědi |

Ve zkoušení se po klepnutí na odpověď hned zobrazí správné řešení a vysvětlení, při chybě také zvolená odpověď. U skládání se odpověď vyhodnotí po vložení posledního slova. Řešení zůstává na obrazovce až do klepnutí na **Další**. První odpověď se do výsledku započítá jednou a nelze ji přepsat. Chybné otázky lze na konci procvičit znovu.

Učení střídá 12 aktivit v jednom kole. Další kola přinášejí další kartičky; 52 karet postupně pokryje celé dosavadní učivo. Začínající čtenář nepotřebuje psát ani přetahovat – všechno se ovládá klepnutím, bez časového limitu. Fotbal zůstává prostředím a motivací.

## Kompaktní zobrazení a šipky

Hlavička i úvodní část jsou zmenšené. Na běžných rozměrech iPadu a notebooku se úvod, učení, otázky i vyhodnocení vejdou do výšky okna bez posouvání. Obrázky a odpovědi jsou vedle sebe; přehled chyb je po jedné položce. Rodičovský přehled má krátké záložky Učivo / Výsledky / Nastavení. Na úzkých telefonech nebo při výrazném zvětšení zůstává přirozené posouvání dostupné, aby se obsah neořezal.

V učení zvolte **Jen kartičky ↔**, chcete-li přímo procházet všech 52 slovíček a vět. Fungují také tlačítka na obrazovce:

- **←**: předchozí kartička nebo aktivita; rozehrané dvojice i odpovědi zůstanou zachované.
- **→**: na neotočené kartičce ukáže řešení, dalším stiskem pokračuje. U ostatních úloh přejde dál až po vyhodnocení.
- **Mezerník**: otočí kartičku na druhou stranu.

Návrat k hotové úloze nepřičítá další góly ani znovu neposouvá uložený pokrok. Ve zkoušení nelze šipkou přeskočit nevyhodnocenou otázku. V přehledu chyb šipky přepínají jednotlivé chyby. V rodičovském dialogu se herní klávesové zkratky neuplatňují.

Ověřeno 830 kontrolami skutečného přetečení a viditelnosti obsahu na rozměrech 1366×768, 1280×720, 1024×768, 768×1024, 1180×820, 1024×600 a 1366×600 v Chromium. Nejde o ověření na fyzickém iPadu.

## Učivo

Čísla 11–20, školní potřeby a vybavení třídy, barvy a doplňková slovíčka z dodaných stránek, **in / on / under / next to**, **there is / isn't / are / aren't**, **How many…?**, **Where's…?**, **Is there…?**, krátké odpovědi a oprava nepravdivých tvrzení. Překlady slovíček jsou v obou směrech. Celé učivo včetně původně bonusových slovíček patří do stejného modulu a do výběru otázek.

Jeden náhodný test neověří každé slovíčko. Zpětná vazba během zkoušení je záměrná výuková pomůcka. Přehled **Pro rodiče** ukazuje výsledky tohoto testového modulu; starší výsledky se do jeho nejlepšího skóre nemíchají. Pokrok zůstává v tomto prohlížeči, nesynchronizuje se a může být prohlížečem smazán. Výslovnost využívá anglický hlas zařízení, nikoli CD z učebnice.

## iPad a online provoz

Otevřete hru v Safari; přes **Sdílet → Přidat na plochu** lze přidat ikonu. Po úplném prvním načtení funguje i offline, pokud prohlížeč uchová data. Dostupnost výslovnosti offline závisí na anglickém hlasu zařízení. Pokud po aktualizaci vidíte starý vzhled, zavřete všechna okna hry a otevřete ji znovu s připojením k internetu.

GitHub Pages používají veřejný repozitář `TVS-Albert/ZkouseniTonik`, větev `main`, `/(root)` a HTTPS. Další push spouští nasazení; [stav GitHub Actions](https://github.com/TVS-Albert/ZkouseniTonik/actions). Fotografie učebnice ani CD nahrávky nejsou distribuovány. Staré odkazy `?module=numbers`, `school`, `positions`, `sentences` a `extras` nyní otevřou stejnou úvodní stránku jednotného modulu.

## Lokální spuštění a testy

```sh
npm start
```

Lokální server používá port 4173; není třeba instalovat npm balíčky. Neotevírejte HTML přes `file://`, protože aplikace používá ES moduly. Web nevyžaduje Node; Node 24 je potřeba pro vývojové testy a Python pro lokální server.

```sh
npm run check
npm test
npm run test:browser
python3 tests/run_browser.py --layout
```

Prohlížečové testy potřebují Python Playwright a Chromium. Kontrolují nový modul, všechny herní aktivity, zpětnou vazbu ihned po odpovědi, nemožnost přepsat odpověď, test s výsledkem 18/20, opakování chyb, zachování pokroku, dotykové ovládání, tabletové a telefonní rozměry, offline a selhání úložiště/hlasu. 18 jednotkových testů ověřuje také pokrytí všech karet, střídání předložek a gramatiky, obousměrnost a přidání dalšího předmětu. Skutečné Safari a poslech na fyzickém iPadu nejsou součástí těchto automatizovaných kontrol.

Po dokončení nasazení:

```sh
python3 tests/check_online.py
APP_TEST_URL=https://tvs-albert.github.io/ZkouseniTonik/ python3 tests/browser_smoke.py
```

## Struktura

- `src/content/test-2026-11-09.js`: jeden datovaný výukový modul a sestavení smíšeného hraní i zkoušení.
- `src/content/english-school.js`: veškeré kartičky a jazykové podklady; původní témata jsou interní banky, nikoli samostatné moduly na úvodní stránce.
- `src/exercises/`: samostatné generátory slovíček, párování, počítání, předložek, gramatiky a skládání.
- `src/core/session.js`: okamžité vyhodnocení, uzamčení první odpovědi a ruční přechod na další úlohu.
- `src/core/progress.js`: validované lokální ukládání a zachování starého pokroku.
- `app.js`, `style.css`, `art.js`: rozhraní, styl a vlastní obrázky.

Při změně runtime souborů aktualizujte seznam i verzi cache v `sw.js`. Používejte existující pracovní kopii; další Git worktree není nutný. [Obsah učiva](CONTENT.md) · [Rozšiřování](docs/EXTENDING.md) · [Strategie](docs/STRATEGY.md) · [Technická analýza](docs/TECHNICAL_ANALYSIS.md).
