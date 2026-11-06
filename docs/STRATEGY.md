# Implementační a testovací strategie

1. Zachovat existující pracovní kopii, vzhled, učivo a formát lokálního pokroku. Ověřit skutečnou viditelnost cílového repozitáře před přenosem souborů.
2. Oddělit obsah kurzu od generování úloh, registru kurzů, vyhodnocení a úložiště. Ponechat kompatibilní vstupní soubory `content.js` a `engine.js`.
3. Samostatné moduly úloh: slovní zásoba, párování, počítání, obrázkové předložky, gramatika/překlad vět. Obrázky zůstanou v `art.js`, rozhraní v `app.js`.
4. Definice kurzu obsahuje témata, kartičky a továrny na otázky. Nový předmět skládá existující typy úloh s novými daty; nový vizuální typ přidá také vlastní renderer. První verze UI zůstane anglickým kurzem. Vícepředmětový přepínač není součást této změny.
5. Validovat definice, neznámá témata a jednoznačnost otázek. Poškozené lokální výsledky nesmějí způsobit pád aplikace.
6. Udržovat explicitní úplný seznam offline souborů; při změně modulů zvýšit verzi cache. Automaticky zkontrolovat strukturu a existenci souborů v cache.
7. Spustit jednotkové testy: kurikulum, obousměrnost, 150 generovaných zkoušek, skóre, nové předměty a úložiště. Spustit prohlížečové testy celých průchodů v Chromium: karty, párování, chyby, test 18/20, výsledky, offline, dotyk, rozměry iPadu a chybějící hlas/úložiště. Ověřit cesty také v podadresáři.
8. Zapsat skutečné výsledky a omezení do technické analýzy. Zkontrolovat přesný seznam Git souborů; bez fotografií učebnice, přihlašovacích údajů a testovacích cache. Commit a běžný push do soukromého `TVS-Albert/ZkouseniTonik`, žádný force push ani veřejné Pages. Po přenosu znovu ověřit soukromí a vzdálený commit.

Aktualizace požadavku: uživatel následně výslovně schválil veřejný repozitář a veřejný web, protože jeho tarif nepodporoval Pages z Private repozitáře. Změnu provedl na GitHubu; tato novější instrukce nahrazuje původní omezení soukromí v bodech 1 a 8. Online nasazení bylo následně skutečně ověřeno, viz technická analýza.
