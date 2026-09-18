# Riječ po riječ

Igra slaganja riječi na bosanskom: 60 nivoa u šest etapa, tragovi, pomoć, bodovi, zvjezdice i napredak sačuvan u pregledniku.

## Pokretanje

Otvori `dist/index.html` u pregledniku ili posluži direktorij `dist` lokalnim HTTP serverom. Nisu potrebne zavisnosti, API ključevi ni baza podataka.

## Vercel

Uvezi ovaj repozitorij kao novi projekt. `vercel.json` postavlja statički izlazni direktorij na `dist`; instalacija i build nisu potrebni. Produkcijska grana: `main`.

Nakon povezivanja Vercel automatski objavljuje izmjene poslane na `main`.

## Podaci

Napredak se čuva lokalno, na istom uređaju i u istom pregledniku. Prelazak na novu domenu ne prenosi napredak s prethodne domene.

Fontovi se učitavaju preko Google Fonts; sistemski fontovi koriste se kada servis nije dostupan.
