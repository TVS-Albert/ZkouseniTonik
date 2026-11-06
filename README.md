# Anglická liga ⚽

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

```sh
npm test
```

Testy obsahu a generování otázek vyžadují Node.js 24+. Web samotný Node nepotřebuje. Prohlížečové ověření v izolovaném podadresáři lze spustit příkazem `npm run test:browser`, pokud je v prostředí Python Playwright a Chromium. Tento nástroj není závislostí aplikace.

Ověřeno: 12 automatizovaných testů obsahu a vyhodnocení; v Chromium všechny kartičky, párování i chybné dvojice, celý trénink, zápas s výsledkem 18/20, přehled a opakování chyb, uchování pokroku, dotykové ovládání, rozměry iPadu a telefonu, chování bez úložiště a bez hlasového API. Ověřeno také spuštění i offline načtení pod podadresářem `/anglicka-liga/`. Skutečné Safari na iPadu a veřejné nasazení ještě ověřeny nebyly.

## GitHub Pages (ruční zveřejnění, až bude schváleno)

1. Použijte pouze soukromý repozitář `TVS-Albert/ZkouseniTonik`. Pokud tarif nepodporuje požadované Pages ze soukromého repozitáře, nepřevádějte ho na veřejný. Před aktivací webu zvlášť ověřte jeho přístupový režim; soukromý repozitář nemusí znamenat soukromý web.
2. Nahrajte soubory projektu do větve `main` (včetně souboru `.nojekyll`). Fotky učebnice nenahrávejte.
3. V repozitáři otevřete **Settings → Pages → Build and deployment → Deploy from a branch**. Vyberte **main** a **/(root)** a uložte.
4. Po dokončení nasazení otevřete GitHubem zobrazenou HTTPS adresu v Safari. Všechny cesty jsou relativní, takže web podporuje i podadresář `/anglicka-liga/`.
5. Na iPadu: **Sdílet → Přidat na plochu**. Po prvním úplném načtení se soubory ukládají pro offline použití. Prohlížeč může cache i lokální pokrok vymazat; výslovnost offline závisí na staženém hlasu. Zvuk spusťte klepnutím, zkontrolujte hlasitost a anglické hlasy zařízení.

Service worker ukládá pouze vlastní statické soubory. Při změně vzájemně závislých souborů změňte verzi cache v `sw.js`; po aktualizaci zavřete stará okna aplikace. První načtení musí být online.

Kód je určen pro soukromý repozitář TVS-Albert/ZkouseniTonik. GitHub Pages nebyly aktivovány. Soukromý repozitář automaticky neznamená soukromý web Pages; dostupnost i přístupový režim závisejí na tarifu a konfiguraci GitHubu.

## Úpravy

Slovní zásoba: `src/content/english-school.js`; definice kurzu: `src/content/english-course.js`; jednotlivé generátory: `src/exercises/`; registr, skóre a úložiště: `src/core/`. `content.js` a `engine.js` jsou kompatibilní vstupy; vlastní SVG obrázky: `art.js`; rozhraní: `app.js` a `style.css`. Pro nové úlohy zachovejte jednoznačné možnosti odpovědí a oddělení zkoušky od nápověd tréninku. Již existující pracovní kopie je izolované prostředí; není potřeba vytvářet další Git worktree.

Architektura a rozšiřování: [docs/EXTENDING.md](docs/EXTENDING.md). Strategie: [docs/STRATEGY.md](docs/STRATEGY.md). Technická analýza: [docs/TECHNICAL_ANALYSIS.md](docs/TECHNICAL_ANALYSIS.md).
