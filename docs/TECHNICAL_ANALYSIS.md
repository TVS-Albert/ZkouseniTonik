# Technická analýza – 8. listopadu 2026

## Aktuální rozhraní a chování

Aplikace nově obsahuje jediný viditelný modul **Angličtina – příprava na test 9. 11. 2026**. Dvě hlavní akce spouštějí učení hrou a smíšené zkoušení. Původní čtyři témata a bonusová slovíčka jsou interní banky stejného učiva. Další moduly se mají přidávat až k dalšímu učivu a testům; na úvodu nejsou nefunkční zástupné moduly.

Učení má 12 aktivit v kole: čtyři otáčecí kartičky, dvě sady přiřazování, počítání obrázků, obrázkové předložky, doplnění gramatiky, slovíčko a dvě skládací aktivity. 52 kartiček se interleavuje napříč původními tématy; kurzor se ukládá po prohlédnutí karty a přechodu dál. Za 13 dokončených kol se představí celá sada karet, nikoli jen náhodný podvýběr. Čísla, tvary i předložky se střídají mezi koly. Český a anglický směr se u kartiček střídá a při dalším průchodu bankou obrací.

Test má 20 otázek: překlady oběma směry, počítání obrázků, ano/ne, předložky, všechny čtyři slovesné tvary, krátkou odpověď na otázku, barvy/další slovíčka a dvě skládání. V každém sestavení jsou všechny předložky a základní slovesné tvary, avšak jeden test nezahrnuje každé slovíčko. Odpověď se vyhodnotí ihned a nelze ji přepsat. Vysvětlení i správná odpověď zůstávají do klepnutí na Další. Výsledek proto není nezávislý test bez nápovědy – průběžná zpětná vazba je záměrná výuková součást.

## Struktura a rozšiřování

| Vrstva | Soubor/adresář | Odpovědnost |
| --- | --- | --- |
| Datovaný modul | `src/content/test-2026-11-09.js` | Metadata testu, sestavení herního kola, smíšený test |
| Podklady | `src/content/english-school.js` | Všechna dosavadní slova, čísla, věty a předložky |
| Generátory | `src/exercises/` | Slovíčka, párování, počítání, předložky, gramatika a nové skládání |
| Relace | `src/core/session.js` | Uzamčení první odpovědi a přechod pouze po vyhodnocení |
| Persistence | `src/core/progress.js` | Validace, migrace, výsledky, kurzor a počet kol |
| Obecné kurzy | `src/core/curriculum.js`, `english-course.js`, `engine.js` | Kompatibilní API a banky pro budoucí použití |
| UI | `app.js`, `style.css`, `art.js` | Dva vstupy, renderery interakcí, původní SVG |
| Offline | `sw.js` | Verze v4 a úplný seznam runtime souborů |

Generátory a stav relace jsou oddělené od DOM. Obecné typy výběr a skládání mají validaci: jednoznačné možnosti nebo shodný multiset tokenů správné věty. U opakovaných slov mají tokeny samostatné indexy. Vyhodnocení celé věty nastává po posledním tokenu; předtím lze poslední slovo vrátit. Nový výukový modul bude mít vlastní metadata/data a oddělené výsledky; přepínač pro více modulů se doplní, až další modul skutečně existuje.

## Migrace a offline aktualizace

Původní klíč úložiště zůstává zachován. Nová pole `learnCursor` a `rounds` mají bezpečné nuly, neplatná data se validují. Nové výsledky nesou `moduleId: english-2026-11-09`; staré výsledky zůstávají dostupné v uložených datech, ale nemíchají se do nejlepšího skóre aktuálního modulu. Udržuje se nejvýše deset výsledků celkem. Nejde o cloudovou synchronizaci ani zaručené dlouhodobé uložení.

SW v4 obsahuje nové tři runtime moduly, instaluje nejprve kompletní sadu a poté aktivuje novou verzi. Při aktualizaci na úvodní stránce nový klient obnoví stránku; v rozehrané nové relaci jen upozorní na aktualizaci. Starší klient může vyžadovat zavření a nové otevření všech oken aplikace. Offline výslovnost závisí na hlasu zařízení.

## Provedené kontroly

- 17 jednotkových testů prošlo: dosavadní generátory, přidání jiného předmětu, migrace pokroku a skóre; dále nový modul, 100 generovaných smíšených testů, 52 karet během 13 kol, střídání všech předložek/tvarů/počtů, okamžité uzamčení odpovědí a validace skládání.
- Statická kontrola importů a offline souborů prošla pro 19 runtime JS souborů.
- Kompletní prohlížečový průchod v izolovaném podadresáři prošel: jeden modul a datum, všechny typy aktivit, chybná dvojice, zpětná vazba bez potvrzovacího tlačítka, zkouška 18/20, vysvětlení chyb, jejich opakování, pokrok po reloadu, dotyk, tři rozměry, offline a nedostupný hlas/úložiště.
- Prohlížeč kontroluje nezachycené JS výjimky. Náhled úvodu byl vizuálně zkontrolován.
- Produkční nasazení a jeho kontrola jsou samostatný krok. Výsledky se mají hlásit až po skutečném dokončení GitHub Pages a testech veřejné URL.

## Soukromí, bezpečnost a omezení

Repozitář i web jsou veřejné na základě předchozího výslovného souhlasu. Aplikace neobsahuje klíče, účty, reklamu ani analytiku. Fotografie a CD nahrávky učebnice se nedistribuují. Textové hodnoty se před vložením do HTML escapují. Řešení jsou v klientském JS a lokální skóre lze změnit přes nástroje prohlížeče; nejde o zabezpečený školní zkušební systém.

Hlas používá systémové Web Speech API. Skutečné Safari na fyzickém iPadu, poslech hlasu, úplný audit WCAG a výkonnostní benchmark nebyly provedeny. Prohlížečové testy emulují dotyk a rozměry iPadu v Chromium. K ovládání není třeba psaní, přetahování ani časově omezená reakce. Vysvětlení je textové; nečtenář může potřebovat pomoc dospělého. Podporován je omezený pohyb animací.
