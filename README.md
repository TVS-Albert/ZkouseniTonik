# Anglická liga ⚽

**[Spustit online hru na iPadu nebo počítači](https://tvs-albert.github.io/ZkouseniTonik/)**

Česká fotbalová hra pro začínajícího školáka, připravená jako statický web pro Safari na iPadu a GitHub Pages. Bez placených služeb, účtu, závislostí a sestavování.

## Obsah

Čísla 11–20, školní předměty a vybavení třídy, in/on/under/next to, there is/isn't/are/aren't. Podle dodaných učebnic také How many…?, Where's…?, Is there…?, krátké odpovědi a oprava nepravdivého tvrzení. Podklady a přesný rozsah: [CONTENT.md](./CONTENT.md).

Nejprve obrázkové kartičky a trénink (výběr odpovědi i přiřazování), potom zápas o 20 otázkách se samostatným výsledkem pro každou oblast. Překlady slovíček v obou směrech. Test odhalí řešení až po dokončení. Výslovnost používá Web Speech API a dostupný anglický hlas zařízení; původní CD nahrávky nejsou přiloženy. Nepodporovaný či nefunkční hlas neblokuje hru.

## Lokální spuštění

```sh
cd /workspace/ZkouseniTonik
npm start
```

Server používá port 4173. Alternativně `python3 -m http.server 4173`. Nepotřebuje instalovat npm balíčky. Kvůli JS modulům nepoužívejte otevírání HTML přes `file://`.

## Spuštění jednotlivých modulů

Hra je dostupná online přes HTTPS na GitHub Pages. Následující odkazy otevřou jednotlivé moduly přímo v prohlížeči, bez lokální instalace.

| Modul | Odkaz na spuštění |
| --- | --- |
| Úvodní klub | [Otevřít aplikaci](https://tvs-albert.github.io/ZkouseniTonik/) |
| Čísla 11–20 | [Spustit čísla](https://tvs-albert.github.io/ZkouseniTonik/?module=numbers) |
| Školní potřeby a vybavení třídy | [Spustit školní slovíčka](https://tvs-albert.github.io/ZkouseniTonik/?module=school) |
| Předložky: in, on, under, next to | [Spustit předložky](https://tvs-albert.github.io/ZkouseniTonik/?module=positions) |
| Věty: there is / isn't / are / aren't | [Spustit věty](https://tvs-albert.github.io/ZkouseniTonik/?module=sentences) |
| Bonusová slovíčka a barvy | [Spustit bonus](https://tvs-albert.github.io/ZkouseniTonik/?module=extras) |
| Závěrečný zápas | [Spustit ověření znalostí](https://tvs-albert.github.io/ZkouseniTonik/?module=exam) |

Odkazy na témata otevřou nabídku jejich kartiček a procvičování; zápas otevře úvod před zkouškou. Repozitář i web jsou podle schváleného nastavení veřejné. Pro lokální vývoj nadále slouží `npm start` a port 4173.

## Testování

```sh
npm test
```

Testy obsahu a generování otázek vyžadují Node.js 24+. Web samotný Node nepotřebuje. Prohlížečové ověření v izolovaném podadresáři lze spustit příkazem `npm run test:browser`, pokud je v prostředí Python Playwright a Chromium. Tento nástroj není závislostí aplikace.

Ověřeno: 12 automatizovaných testů obsahu a vyhodnocení; v Chromium všechny kartičky, párování i chybné dvojice, celý trénink, zápas s výsledkem 18/20, přehled a opakování chyb, uchování pokroku, dotykové ovládání, rozměry iPadu a telefonu, chování bez úložiště a bez hlasového API. Ověřeno také spuštění i offline načtení pod podadresářem `/anglicka-liga/`. Skutečné Safari na iPadu zatím ověřené není. Veřejné nasazení používá GitHub Pages; všechny jeho runtime soubory byly ověřeny proti zdrojovým souborům.

## Online provoz a iPad

Web běží na **https://tvs-albert.github.io/ZkouseniTonik/**. GitHub Pages používají větev **main**, adresář **/(root)** a vynucené HTTPS. Repozitář je po výslovném schválení Public. Další push do `main` spustí aktualizaci webu; stav lze sledovat v [GitHub Actions](https://github.com/TVS-Albert/ZkouseniTonik/actions).

Na iPadu otevřete odkaz v Safari a případně zvolte **Sdílet → Přidat na plochu**. Po prvním úplném načtení se soubory ukládají pro offline použití. Prohlížeč může cache i lokální pokrok vymazat; výslovnost offline závisí na staženém anglickém hlasu. Zvuk spusťte klepnutím a zkontrolujte hlasitost zařízení.

Nasazenou verzi lze znovu ověřit:

```sh
python3 tests/check_online.py
APP_TEST_URL=https://tvs-albert.github.io/ZkouseniTonik/ python3 tests/browser_smoke.py
```

První kontrola porovná soubory online aplikace se zdrojovými soubory, druhá projde hru ve skutečném prohlížeči. Vyžaduje vývojové závislosti uvedené v části Testování. Pro HTTPS test se případná platformní proxy přebírá z prostředí; TLS ověřování se nevypíná.

Service worker ukládá pouze vlastní statické soubory. Při změně vzájemně závislých souborů změňte verzi cache v `sw.js`; po aktualizaci zavřete stará okna aplikace. První načtení musí být online.

Fotografie učebnice ani původní CD nahrávky nejsou součástí zveřejněného projektu. Výukový obsah vychází z dodaných podkladů a ilustrace jsou vytvořené pro tuto hru.

## Úpravy

Slovní zásoba: `src/content/english-school.js`; definice kurzu: `src/content/english-course.js`; jednotlivé generátory: `src/exercises/`; registr, skóre a úložiště: `src/core/`. `content.js` a `engine.js` jsou kompatibilní vstupy; vlastní SVG obrázky: `art.js`; rozhraní: `app.js` a `style.css`. Pro nové úlohy zachovejte jednoznačné možnosti odpovědí a oddělení zkoušky od nápověd tréninku. Již existující pracovní kopie je izolované prostředí; není potřeba vytvářet další Git worktree.

Architektura a rozšiřování: [docs/EXTENDING.md](docs/EXTENDING.md). Strategie: [docs/STRATEGY.md](docs/STRATEGY.md). Technická analýza: [docs/TECHNICAL_ANALYSIS.md](docs/TECHNICAL_ANALYSIS.md).
