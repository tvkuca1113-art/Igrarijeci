# Riječ po riječ

Igra slaganja riječi na bosanskom: 240 riječi, tri težine i 60 nivoa po težini. Prilagođena dodiru i tastaturi.

## Nova pravila

| Težina | Vrijeme po pokušaju | Trag | Bodovi po preostaloj ★ |
| --- | --- | --- | --- |
| Lahko | Bez ograničenja | Jasniji trag i oblast | 50 |
| Srednje | 24 sekunde | Jasniji trag i oblast | 100 |
| Teško | 12 sekundi | Kratak trag, teže riječi | 150 |

- Na svakom nivou oko 20% slova (zaokruženo na cijelo polje) otkriveno je besplatno; dodatna pomoć i dalje troši zvjezdicu. Lahko i srednje imaju opisnije tragove, a teško kratak trag.
- Svaki pokušaj počinje s tri zvjezdice.
- Potpuno složena pogrešna riječ i otkrivanje slova troše po jednu zvjezdicu. Vraćanje i miješanje slova su besplatni.
- Nula zvjezdica ili istek vremena znači poraz. Otkrivanje slova s posljednjom zvjezdicom također završava pokušaj.
- Ponovni pokušaj zadržava isti nivo, daje drugu riječ, tri nove zvjezdice i puno vrijeme.
- Riječi se izvlače bez ponavljanja unutar fonda težine dok se fond ne iscrpi. Uzastopni pokušaji nikada ne dobijaju istu riječ.
- Sat kreće tek pritiskom na „Pokreni nivo“. Riječ se do tada ne prikazuje.
- Odbrojavanje se ne zaustavlja u pomoći, drugoj kartici, pri promjeni težine ili nakon osvježavanja stranice. Rok završetka pokušaja čuva se lokalno.
- Rezultati i otključani nivoi odvojeni su po težini. Ponovljeni nivo može poboljšati rezultat; bodovi se ne mogu skupljati ponovnim rješavanjem istog nivoa.
- Napredak prethodne verzije migrira se pod Lahko. Izvorni zapis ostaje netaknut kao rezervna kopija.
- LJ, NJ i DŽ zauzimaju jedno polje. Za tastaturu upiši oba znaka; Enter potvrđuje samostalno D, L ili N kada se čeka drugi znak.

## Pokretanje i provjera

Otvori `dist/index.html` u pregledniku ili posluži direktorij `dist` lokalnim HTTP serverom. Nisu potrebni paketi, API ključevi niti baza podataka.

Za provjeru pravila igre, uz Node.js 20 ili noviji:

```sh
node --test tests/game.test.cjs
```

`dist/words.js` sadrži fond riječi, `dist/engine.js` pravila i stanje, a `dist/game.js` prikaz i interakcije.

## Vercel

Uvezi ovaj repozitorij kao novi projekt. `vercel.json` postavlja statički izlazni direktorij na `dist`; instalacija i build nisu potrebni. Produkcijska grana je `main`. Povezani Vercel projekt automatski objavljuje promjene poslane na `main`.

## Lokalni podaci

Napredak je vezan za preglednik i domenu. Brisanje podataka preglednika uklanja napredak; druga domena ne preuzima podatke automatski. Igra radi i kada preglednik zabrani čuvanje, uz obavijest da se napredak neće sačuvati.

Google Fonts ima sistemske zamjenske fontove ako nije dostupan. Zvuk je isključen dok ga igrač ne uključi.
