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

## Spuštění jednotlivých modulů

Následující odkazy míří na cílovou online aplikaci na GitHub Pages a jsou určené i pro iPad. **Web zatím není aktivovaný; do dokončení nasazení tyto adresy hru nespustí.** Přístup k nastavení Pages přes dostupnou GitHub integraci vrací HTTP 403. Veřejná dostupnost webu byla schválena při zachování soukromého repozitáře. Aktivaci nyní blokuje oprávnění GitHub integrace (HTTP 403), nikoli chybějící souhlas.

| Modul | Odkaz na spuštění |
| --- | --- |
| Úvodní klub | [Otevřít aplikaci](https://tvs-albert.github.io/ZkouseniTonik/) |
| Čísla 11–20 | [Spustit čísla](https://tvs-albert.github.io/ZkouseniTonik/?module=numbers) |
| Školní potřeby a vybavení třídy | [Spustit školní slovíčka](https://tvs-albert.github.io/ZkouseniTonik/?module=school) |
| Předložky: in, on, under, next to | [Spustit předložky](https://tvs-albert.github.io/ZkouseniTonik/?module=positions) |
| Věty: there is / isn't / are / aren't | [Spustit věty](https://tvs-albert.github.io/ZkouseniTonik/?module=sentences) |
| Bonusová slovíčka a barvy | [Spustit bonus](https://tvs-albert.github.io/ZkouseniTonik/?module=extras) |
| Závěrečný zápas | [Spustit ověření znalostí](https://tvs-albert.github.io/ZkouseniTonik/?module=exam) |

Po nasazení odkazy na témata otevřou nabídku jejich kartiček a procvičování; zápas otevře úvod před zkouškou. Samotné zobrazení `index.html` na GitHubu hru nespustí. Repozitář zůstává Private. Soukromý repozitář automaticky nezajišťuje soukromý web Pages; online zpřístupnění je samostatný krok. Pro lokální vývoj nadále slouží `npm start` a port 4173.

## Testování

```sh
npm test
```

Testy obsahu a generování otázek vyžadují Node.js 24+. Web samotný Node nepotřebuje. Prohlížečové ověření v izolovaném podadresáři lze spustit příkazem `npm run test:browser`, pokud je v prostředí Python Playwright a Chromium. Tento nástroj není závislostí aplikace.

Ověřeno: 12 automatizovaných testů obsahu a vyhodnocení; v Chromium všechny kartičky, párování i chybné dvojice, celý trénink, zápas s výsledkem 18/20, přehled a opakování chyb, uchování pokroku, dotykové ovládání, rozměry iPadu a telefonu, chování bez úložiště a bez hlasového API. Ověřeno také spuštění i offline načtení pod podadresářem `/anglicka-liga/`. Skutečné Safari na iPadu a veřejné nasazení ještě ověřeny nebyly.

## GitHub Pages – schválený veřejný web, soukromý repozitář

1. Ponechte repozitář `TVS-Albert/ZkouseniTonik` soukromý. Veřejně dostupný web hry byl schválen. Pokud tarif nepodporuje Pages ze soukromého repozitáře, nepřevádějte repozitář na veřejný; bude potřeba tarif podporující tuto kombinaci.
2. Soubory projektu už jsou ve větvi `main`, včetně `.nojekyll`. Fotky učebnice nejsou součástí repozitáře.
3. V přihlášeném GitHubu otevřete [Settings → Pages](https://github.com/TVS-Albert/ZkouseniTonik/settings/pages). V **Build and deployment → Source** vyberte **Deploy from a branch**, větev **main**, adresář **/(root)** a klikněte **Save**. Dostupná integrace tento administrativní krok nedokáže provést: API pro vytvoření Pages vrací `403 Resource not accessible by integration`.
4. Po dokončení nasazení otevřete GitHubem zobrazenou HTTPS adresu v Safari. Všechny cesty jsou relativní, takže web podporuje i podadresář `/anglicka-liga/`.
5. Na iPadu: **Sdílet → Přidat na plochu**. Po prvním úplném načtení se soubory ukládají pro offline použití. Prohlížeč může cache i lokální pokrok vymazat; výslovnost offline závisí na staženém hlasu. Zvuk spusťte klepnutím, zkontrolujte hlasitost a anglické hlasy zařízení.

Service worker ukládá pouze vlastní statické soubory. Při změně vzájemně závislých souborů změňte verzi cache v `sw.js`; po aktualizaci zavřete stará okna aplikace. První načtení musí být online.

Kód je určen pro soukromý repozitář TVS-Albert/ZkouseniTonik. GitHub Pages nebyly aktivovány. Soukromý repozitář automaticky neznamená soukromý web Pages; dostupnost i přístupový režim závisejí na tarifu a konfiguraci GitHubu.

## Úpravy

Slovní zásoba: `src/content/english-school.js`; definice kurzu: `src/content/english-course.js`; jednotlivé generátory: `src/exercises/`; registr, skóre a úložiště: `src/core/`. `content.js` a `engine.js` jsou kompatibilní vstupy; vlastní SVG obrázky: `art.js`; rozhraní: `app.js` a `style.css`. Pro nové úlohy zachovejte jednoznačné možnosti odpovědí a oddělení zkoušky od nápověd tréninku. Již existující pracovní kopie je izolované prostředí; není potřeba vytvářet další Git worktree.

Architektura a rozšiřování: [docs/EXTENDING.md](docs/EXTENDING.md). Strategie: [docs/STRATEGY.md](docs/STRATEGY.md). Technická analýza: [docs/TECHNICAL_ANALYSIS.md](docs/TECHNICAL_ANALYSIS.md).
