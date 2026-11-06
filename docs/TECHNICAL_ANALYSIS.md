# Technická analýza – 6. listopadu 2026

## Závěr a rozsah

Lokální aplikace podporuje požadované učení a ověřování angličtiny pro sedmileté dítě. Refaktoring zachoval vzhled, učivo, způsob bodování i původní vstupní importy a oddělil obsah od typů úloh. Rozšiřitelnost jádra je ověřena dalším, matematickým kurzem v testech. UI je stále konkrétní Anglická liga, nikoliv hotový univerzální katalog předmětů. Pro všechny provedené lokální kontroly byl výsledek úspěšný. Přenos do GitHubu je ověřován samostatně, neodvozuje se z lokálních testů.

## Struktura a závislosti

| Vrstva | Umístění | Odpovědnost |
| --- | --- | --- |
| Spuštění | `index.html`, `manifest.webmanifest` | Český dokument, mobilní viewport, metadata, ikony a PWA |
| UI | `app.js`, `style.css` | Klub, lekce, kartičky, výběr odpovědí, párování, výsledky, rodičovský přehled |
| Ilustrace | `art.js` | Původní SVG ikony a prostorové scény, nezávislé na fotografiích učebnice |
| Obsah | `src/content/english-school.js` | Kartičky, české významy, čísla, předložky, gramatika a dvojice z říkanky |
| Kurikulum | `src/content/english-course.js` | Sestavení témat, pravidla tréninku a vyvážené zkoušky |
| Typy úloh | `src/exercises/` | Samostatné vocabulary, matching, counting, positions a grammar moduly |
| Jádro | `src/core/` | Registr/validace kurzu, míchání, skóre a persistence |
| Kompatibilita | `content.js`, `engine.js` | Stabilní veřejné importy pro UI a existující testy |
| Offline | `sw.js` | Úplná verzovaná sada souborů, cache oddělená podle scope |
| Kontroly | `scripts/`, `tests/`, `.github/workflows/test.yml` | Struktura, jednotkové a prohlížečové testy, opakovatelná CI |

V prohlížeči nejsou externí JS knihovny, CDN, balíčky ani build. Runtime používá nativní ES moduly, SVG, localStorage, Service Worker a Web Speech API. Node 24 je potřeba pro testovací nástroje; Python pro lokální server; Playwright a Chromium pouze pro vývojové testy. Závislosti testovacího prohlížeče nejsou závislostmi samotné hry.

## Datový tok a pravidla hry

Definice kurzu poskytne téma a továrnu na otázky. Generátor vytvoří otázky bez DOM a úložiště; registr ověří existenci zadání, jedinečnost možností a přítomnost správné odpovědi. UI drží rozpracovanou relaci pouze v paměti. Trénink poskytuje okamžité vysvětlení; zkouška nezobrazuje správné řešení před koncem. Vyhodnocení porovnává odpovědi a vrací celkový výsledek a výsledky podle oblastí. Do úložiště jde jen pokrok a nejvýše deset dokončených zápasů.

Zkouška má 20 otázek, pět v každé ze čtyř oblastí. Obsahuje všechny čtyři předložky i všechny základní tvary is/isn't/are/aren't. Čísla a školní slovíčka jsou v obou překladových směrech. Jedna zkouška je výběrová: nepokrývá všechna slovíčka. Skóre je vzdělávací pomůcka, ne standardizované hodnocení. Dokončené kartičky nejsou důkazem zvládnutí látky. Doplňková slovíčka se do povinného testu nezapočítávají.

## Provedené opravy a architektonická rozhodnutí

- Původní generátory v jednom `engine.js` byly rozděleny do pěti modulů. Registr umožňuje nahradit kurz bez úprav skórovacího jádra.
- Bonusové procvičování bylo přesunuto z UI do datového kurikula a sdílí obousměrný generátor slovní zásoby.
- Neznámé téma už tiše nespouští gramatické úlohy; je odmítnuto. Chybné či nejednoznačné otázky jsou zachyceny před zobrazením.
- Uložené výsledky se kontrolují: neplatná data, neplatná data konání zápasů, záporné góly a nekonzistentní skóre nemají způsobit pád rodičovského přehledu. Platný starý pokrok se zachovává pod původním klíčem.
- Upozornění na selhání ukládání nepřekrývá zpráva o dokončení či resetování.
- Offline cache zahrnuje nové moduly. Cache-first přístup zachovává soubory jedné verze pohromadě; aktualizace vyžaduje změnu verze a zavření starých oken. Scope zabraňuje mazání jiné instalace na stejném originu.

## Výsledky testování

| Kontrola | Skutečný výsledek |
| --- | --- |
| `npm run check` | Úspěch: 16 runtime JS souborů, relativní importy a soubory offline cache existují |
| `npm test` | 12 testů úspěšných, žádné selhání ani přeskočení; zahrnuto 150 sestavení zkoušky |
| Přidání jiného předmětu | Matematický kurz úspěšně využil stejný registr, procvičování, párování i API zkoušky |
| Chromium, běžný kořen aplikace | Úspěšný celý průchod po refaktoringu |
| `python tests/run_browser.py` | Úspěch v izolovaném `/anglicka-liga/`, stejné relativní cesty jako u Pages |
| Karty a párování | Všechny karty prohlédnuty, oba směry, chybná dvojice neboduje, správná dvojice boduje jednou |
| Trénink a zkouška | Celý trénink 10/10; řízená zkouška 18/20 s jednou chybou a jedním přeskočením; čtyři výsledkové oblasti po pěti otázkách |
| Zpětná vazba | Řešení v testu skryté do konce, dvě chyby v přehledu, opakování chyb, odchod a pokračování |
| Úložiště a hlas | Zachování pokroku po reloadu; hra pokračuje při zablokovaném úložišti i nedostupném hlasovém API |
| Dotyk a layout | Emulované dotykové ovládání, 768×1024, 1024×768 a 390×844 bez horizontálního přetečení |
| Offline | Opětovné načtení a spuštění obrázkové úlohy při odpojeném připojení |

Prohlížečové scénáře kontrolují také nezachycené JS výjimky. Nejde o test ve fyzickém iPadu ani v Safari/WebKit; tyto kontroly neproběhly. Nová CI definice spouští stejné kontroly při pushi/PR; její běh na serveru je samostatný výsledek, který se nesmí zaměnit s lokálním průchodem.

## Bezpečnost a soukromí

Hra nemá backend, účty, reklamu ani analytiku. Neobsahuje tajné klíče. Fotografie učebnice a nahrávky CD nejsou v distribuovaných souborech. Textová data v UI se escapují před vložením do HTML; obsah se přidává jako důvěryhodný zdrojový modul, nikoliv vykonáváním uživatelského textu. Stav hry lze upravit vývojářskými nástroji a správné odpovědi jsou ve staženém JS: to je očekávaná vlastnost dětské offline hry, není to zabezpečený zkušební systém.

Pokrok existuje pouze v konkrétním prohlížeči a může být smazán OS nebo uživatelem. Systémový hlas může záviset na hlasovém balíčku či službě zařízení; aplikace nekontroluje chování hlasového poskytovatele. Service worker obsluhuje vlastní origin a jeho scope; izolovaný testovací server zpřístupňuje pouze veřejné aplikační soubory na loopbacku.

Původní přenos proběhl do soukromého repozitáře. Po potvrzení omezení tarifu uživatel výslovně schválil přepnutí na Public a změnu provedl. GitHub API nyní potvrzuje veřejný repozitář i veřejné Pages s vynuceným HTTPS. `private: true` v package.json pouze brání publikaci npm balíčku, neurčuje viditelnost GitHub repozitáře.

## Přístupnost, výkon a provoz

Interakce používají nativní tlačítka, viditelný focus, popisky a stavové zprávy. Obrázkové otázky mají alternativní popis; při asistivním ovládání může popis pomáhat s odpovědí, což je u této výukové hry přijatelné. Není vyžadováno přetahování, psaní ani rychlá reakce. Respektuje se omezení animací. Úplný audit WCAG a test se čtečkou obrazovky neproběhl.

Statický web nepotřebuje databázi ani build server. Vlastní vektorové ilustrace a systémové fonty omezují stahování. Výkonnostní benchmark, Lighthouse a měření na starším skutečném iPadu nebyly provedeny; analýza proto neuvádí smyšlené hodnoty výkonu.

## Zbývající omezení a doporučené další kroky

1. Před použitím dítětem vyzkoušet Safari na cílovém iPadu, anglický hlas, zvuk, přidání na plochu a offline spuštění. Automatizace ověřila Chromium, ne celý ekosystém iOS.
2. Pokud mají být přidány jiné předměty do UI, doplnit volbu kurzu, oddělené úložiště a lokalizované instrukce. Rozšiřitelnost jádra je hotová, tento produktový tok ještě ne.
3. Větší růst UI si vyžádá rozdělení `app.js` na renderery jednotlivých pohledů. Nynější oddělení typů úloh se týká jejich generování a logiky; není to kompletní framework UI pluginů. Gramatické šablony a část scén zůstávají anglickému kurzu specifické.
4. Případná synchronizace mezi zařízeními, export výsledků a chráněné webové hostování jsou samostatné budoucí funkce. Soukromý push nepublikuje web pro iPad.

## Ověření skutečného online nasazení

Web: https://tvs-albert.github.io/ZkouseniTonik/. GitHub Pages používají `main` a `/(root)`. První nasazení commitu `cc111bba245dc9b1248499efe6478320cdd709fd` úspěšně dokončilo [běh 42235305426](https://github.com/TVS-Albert/ZkouseniTonik/actions/runs/42235305426). Původní HTTP 404 zmizelo po dokončení zveřejnění.

`python tests/check_online.py` úspěšně ověřil HTTP 200 a přesnou shodu obsahu na 22 adresách runtime souborů se zdrojovým checkoutem. Úplný `browser_smoke.py` s `APP_TEST_URL` nastaveným na skutečné Pages také prošel: všech šest přímých modulových odkazů z README, bezpečný návrat na úvod při neznámém modulu, všechny kartičky, obousměrné učení, párování včetně chybného páru, trénink 10/10, zkouška 18/20, procvičení chyb, ukládání, rodičovský přehled, dotykové ovládání, tři mobilní/tabletové rozměry, nedostupné úložiště a hlasové API i reload po odpojení připojení. Nebyly zachyceny JS výjimky. HTTPS testy použily platformní proxy a zachované TLS ověřování.

Tato produkční kontrola proběhla v Chromium. Neznamená fyzické ověření Safari na iPadu ani poslech výslovnosti na konkrétním zařízení. Pozdější aktualizace dokumentace a testovacích nástrojů nemění runtime aplikace; ověření souborů lze opakovat skriptem uvedeným výše.
