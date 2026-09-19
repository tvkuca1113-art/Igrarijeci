(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RPR_WORDS = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Five bands of difficulty; each row has a word, broad category and a brief easy-mode clue.
  const bands = [
    [
      ['OBALA','Priroda','Uz vodu'],['ISKRA','Priroda','Trenutak sjaja'],['MAGLA','Priroda','Slaba vidljivost'],
      ['KROŠNJA','Priroda','Iznad debla'],['IZVOR','Priroda','Početak toka'],['BISER','Priroda','Skriven sjaj'],
      ['ŠKOLJKA','Priroda','Morski trag'],['KORALJ','Priroda','Morski svijet'],['JAVOR','Priroda','Vrsta stabla'],
      ['JASEN','Priroda','Vrsta stabla'],['POTOK','Priroda','Mali tok'],['UVALA','Priroda','Mirna obala'],
      ['TKANJE','Zanati','Niti zajedno'],['VEZIVO','Materijali','Drži zajedno'],['KALUP','Zanati','Daje oblik'],
      ['ZANAT','Rad','Vješte ruke'],['OKLOP','Predmeti','Čvrsta zaštita'],['KOPČA','Predmeti','Drži zatvoreno'],
      ['PEČAT','Predmeti','Službeni trag'],['BAKAR','Materijali','Crvenkasti metal'],['ČELIK','Materijali','Čvrst metal'],
      ['SUTON','Priroda','Kraj dana'],['ODMOR','Svakodnevica','Predah'],['PONOS','Osjećaji','Uzdignuta glava'],
      ['ZAVIST','Osjećaji','Tuđi uspjeh'],['UMIJEĆE','Osobine','Naučena vještina'],['POLET','Osjećaji','Nova energija'],
      ['PRKOS','Osobine','Uprkos svemu'],['NEMIR','Osjećaji','Bez spokoja'],['NAGON','Pojmovi','Unutrašnji poriv'],
      ['ZAPLET','Književnost','Stvari se komplikuju'],['NASLOV','Književnost','Iznad teksta'],['ZAPIS','Jezik','Ostaje na papiru'],
      ['UZORAK','Pojmovi','Mali dio cjeline'],['RAZMAK','Pojmovi','Između dvije stvari'],['OBRUB','Predmeti','Uz rub'],
      ['PRIZOR','Pojmovi','Pred očima'],['PUTOKAZ','Predmeti','Pravi smjer'],['DODIR','Osjeti','Kontakt'],
      ['ODJEK','Zvuk','Zvuk se vraća'],['ŠAPAT','Zvuk','Gotovo nečujno'],['ŠUMOR','Zvuk','Tihi zvuk prirode'],
      ['DŽEMPER','Odjeća','Za hladnije dane'],['ČEŽNJA','Osjećaji','Neko nedostaje'],['NJEGA','Briga','Pažnja i pomoć'],
      ['LJEPOTA','Pojmovi','U oku posmatrača'],['RIZIK','Pojmovi','Neizvjestan ishod'],['ZAČIN','Hrana','Malo za okus']
    ],
    [
      ['OBZIR','Osobine','Misliš na druge'],['NAGOVOR','Odnosi','Riječi uvjeravaju'],['NAMJERA','Pojmovi','Prije odluke'],
      ['ZAGONETKA','Jezik','Skriven odgovor'],['ZAVJESA','Predmeti','Zaklanja pogled'],['KLATNO','Predmeti','Tamo pa nazad'],
      ['SVITAK','Predmeti','Smotani zapis'],['OBZOR','Priroda','Daljina pred očima'],['ZRAČENJE','Fizika','Prijenos energije'],
      ['TRENJE','Fizika','Otpor kretanju'],['PRITISAK','Fizika','Sila na površinu'],['TOPLOTA','Fizika','Prijenos energije'],
      ['ZAPREMINA','Matematika','Zauzeti prostor'],['POVRŠINA','Matematika','Dvije dimenzije'],['KOLIČNIK','Matematika','Rezultat dijeljenja'],
      ['RAZLOMAK','Matematika','Dio cjeline'],['SLOVNICA','Jezik','Jezička pravila'],['NARJEČJE','Jezik','Jezička raznolikost'],
      ['PRIDJEV','Jezik','Kakav je?'],['GLAGOL','Jezik','Radnja ili stanje'],['IMENICA','Jezik','Ime pojma'],
      ['ZAMJENICA','Jezik','Umjesto imena'],['POREĐENJE','Jezik','Slično nečemu'],['RAZMJENA','Odnosi','Daješ i dobijaš'],
      ['POSREDNIK','Odnosi','Između dvije strane'],['SAVEZNIK','Odnosi','Na tvojoj strani'],['SABRANOST','Osobine','Mirna glava'],
      ['UPORNOST','Osobine','Ne odustaješ'],['SKROMNOST','Osobine','Bez hvalisanja'],['ISKRENOST','Osobine','Bez pretvaranja'],
      ['ODANOST','Osobine','Ostaješ uz nekoga'],['OPREZNOST','Osobine','Prije svakog koraka'],['DOSJETKA','Jezik','Duhovita misao'],
      ['PODUHVAT','Rad','Velik zadatak'],['PREPREKA','Pojmovi','Nešto na putu'],['NAPREDAK','Pojmovi','Korak dalje'],
      ['ZAOKRET','Kretanje','Novi smjer'],['PREOKRET','Događaji','Sve se mijenja'],['ODLOMAK','Književnost','Dio teksta'],
      ['RUKOPIS','Književnost','Lični potez'],['BILJEŠKA','Književnost','Kratak zapis'],['PREDGOVOR','Književnost','Prije glavnog teksta'],
      ['ZNAČENJE','Jezik','Iza riječi'],['PITANJE','Jezik','Traži odgovor'],['ODGOVOR','Jezik','Nakon pitanja'],
      ['RAZLOG','Pojmovi','Zašto?'],['OSNOVA','Pojmovi','Na njoj gradimo'],['POTREBA','Pojmovi','Nešto nedostaje']
    ],
    [
      ['DVOZNAČNOST','Jezik','Dva moguća tumačenja'],['PROTURJEČJE','Logika','Nespojive tvrdnje'],['PRETPOSTAVKA','Logika','Još nije dokazano'],
      ['ZAKLJUČAK','Logika','Na kraju razmišljanja'],['DOSLJEDNOST','Osobine','Ista načela'],['SNALAŽLJIVOST','Osobine','Nađeš način'],
      ['RADOZNALOST','Osobine','Želiš saznati'],['STRPLJENJE','Osobine','Možeš sačekati'],['SAOSJEĆANJE','Odnosi','Osjećaš tuđu bol'],
      ['POŠTOVANJE','Odnosi','Uvažavanje drugih'],['POVJERENJE','Odnosi','Možeš se osloniti'],['PRAVEDNOST','Vrijednosti','Jednaka mjerila'],
      ['ODGOVORNOST','Osobine','Stojiš iza postupaka'],['SAMOSTALNOST','Osobine','Svojim snagama'],['PRONICLJIVOST','Osobine','Vidiš ispod površine'],
      ['SMIŠLJENOST','Osobine','Nije slučajno'],['SAŽETOST','Jezik','Malo riječi'],['JEZGROVITOST','Jezik','Mnogo u malom'],
      ['RAVNOTEŽA','Fizika','Ni na jednu stranu'],['POKRETLJIVOST','Kretanje','Lako mijenja položaj'],['ELASTIČNOST','Fizika','Vraća se obliku'],
      ['PROVODNIK','Fizika','Put za struju'],['IZOLATOR','Fizika','Sprečava prolaz'],['USMJERENJE','Pojmovi','Odabrani pravac'],
      ['PRILAGODBA','Pojmovi','Prema novim uslovima'],['ODSTUPANJE','Pojmovi','Izvan očekivanog'],['POVEZANOST','Pojmovi','Niti među stvarima'],
      ['RAZLIČITOST','Pojmovi','Nismo svi isti'],['JEDNAKOST','Vrijednosti','Bez razlike'],['BLAGOSTANJE','Društvo','Dobri životni uslovi'],
      ['PRAVOVREMEN','Osobine','U pravi čas'],['DOSTOJANSTVO','Vrijednosti','Lična vrijednost'],['SAMOKONTROLA','Osobine','Vladaš svojim reakcijama'],
      ['NEIZVJESNOST','Osjećaji','Ishod nije poznat'],['ZAPREPAŠTENJE','Osjećaji','Naglo iznenađenje'],['ODUŠEVLJENJE','Osjećaji','Velika radost'],
      ['NESTRPLJENJE','Osjećaji','Teško je čekati'],['RAZOČARENJE','Osjećaji','Manje od očekivanog'],['IŠČEKIVANJE','Osjećaji','Još malo'],
      ['RASPOLOŽENJE','Osjećaji','Kako se osjećaš'],['PREDOSJEĆAJ','Osjećaji','Prije nego saznaš'],['NADAHNUĆE','Stvaralaštvo','Izvor ideje'],
      ['STVARALAŠTVO','Umjetnost','Nastaje nešto novo'],['KNJIŽEVNOST','Umjetnost','Svijet pisanih djela'],['SLIKARSTVO','Umjetnost','Boje na podlozi'],
      ['VAJARSTVO','Umjetnost','Oblik u prostoru'],['GRADITELJSTVO','Zanati','Od temelja naviše'],['DOBRODOŠLICA','Odnosi','Dolazak gosta']
    ],
    [
      ['APSTRAKCIJA','Filozofija','Iza konkretnog'],['PARADOKS','Logika','Naizgled nemoguće'],['HIPOTEZA','Nauka','Čeka provjeru'],
      ['DEDUKCIJA','Logika','Od općeg ka posebnom'],['INDUKCIJA','Logika','Od primjera ka pravilu'],['ANALOGIJA','Logika','Slični odnosi'],
      ['SINTEZA','Nauka','Dijelovi postaju cjelina'],['ANALIZA','Nauka','Cjelina na dijelove'],['METAFORA','Jezik','Preneseno značenje'],
      ['ALEGORIJA','Književnost','Skriveni sloj priče'],['IRONIJA','Jezik','Kažeš suprotno'],['HIPERBOLA','Jezik','Namjerno pretjerivanje'],
      ['ALITERACIJA','Jezik','Ponavljanje suglasnika'],['ASONANCA','Jezik','Ponavljanje samoglasnika'],['SINONIM','Jezik','Slično značenje'],
      ['ANTONIM','Jezik','Suprotno značenje'],['HOMONIM','Jezik','Isti oblik'],['ETIMOLOGIJA','Jezik','Porijeklo riječi'],
      ['MORFOLOGIJA','Jezik','Oblici riječi'],['SINTAKSA','Jezik','Slaganje rečenice'],['SEMANTIKA','Jezik','Proučava značenje'],
      ['FONETIKA','Jezik','Govorni glasovi'],['FRAZEOLOGIJA','Jezik','Ustaljeni izrazi'],['LEKSIKA','Jezik','Skup riječi'],
      ['GRAVITACIJA','Fizika','Privlačenje masa'],['INERCIJA','Fizika','Otpor promjeni kretanja'],['REZONANCA','Fizika','Pojačane oscilacije'],
      ['FREKVENCIJA','Fizika','Koliko puta u sekundi'],['AMPLITUDA','Fizika','Najveći otklon'],['REFRAKCIJA','Fizika','Prelamanje talasa'],
      ['DIFRAKCIJA','Fizika','Savijanje talasa'],['OSCILACIJA','Fizika','Oko ravnotežnog položaja'],['ENTROPIJA','Fizika','Broj mogućih stanja'],
      ['MAGNETIZAM','Fizika','Polovi privlače'],['KONDENZACIJA','Fizika','Iz plina u tečnost'],['SUBLIMACIJA','Fizika','Čvrsto postaje plin'],
      ['ISPARAVANJE','Fizika','Tečnost postaje para'],['DESTILACIJA','Hemija','Razdvajanje isparavanjem'],['OKSIDACIJA','Hemija','Gubitak elektrona'],
      ['KATALIZATOR','Hemija','Ubrzava reakciju'],['ELEKTROLIZA','Hemija','Struja razlaže'],['FOTOSINTEZA','Biologija','Svjetlost u hranu'],
      ['METABOLIZAM','Biologija','Promjene u organizmu'],['SIMBIOZA','Biologija','Život u zajednici'],['HROMOZOM','Biologija','Nosilac nasljeđa'],
      ['EKOSISTEM','Biologija','Živa zajednica'],['ADAPTACIJA','Biologija','Prilagođavanje okolini'],['EVOLUCIJA','Biologija','Promjene kroz generacije']
    ],
    [
      ['AUTONOMIJA','Pojmovi','Samostalno odlučivanje'],['OBJEKTIVNOST','Osobine','Bez lične pristrasnosti'],['INTEGRITET','Osobine','Dosljedna načela'],
      ['SPONTANOST','Osobine','Bez unaprijed plana'],['KONCIZNOST','Jezik','Kratko i jasno'],['ANTITEZA','Jezik','Suprotstavljeni pojmovi'],
      ['SAMOPOUZDANJE','Osobine','Vjeruješ u sebe'],['STOICIZAM','Filozofija','Mir pred teškoćama'],['ALTRUIZAM','Osobine','Dobrobit drugih'],
      ['INTUICIJA','Pojmovi','Bez svjesnog zaključivanja'],['TELEOLOGIJA','Filozofija','Objašnjenje kroz svrhu'],['EGALITARNOST','Vrijednosti','Načelo jednakosti'],
      ['SIMETRIJA','Matematika','Podudarnost dijelova'],['ORTOGONALAN','Matematika','Pod pravim uglom'],['PERMUTACIJA','Matematika','Drugačiji raspored'],
      ['KOTANGENS','Matematika','Trigonometrijska funkcija'],['LOGARITAM','Matematika','Traženi eksponent'],['VJEROVATNOĆA','Matematika','Kolika je šansa'],
      ['DERIVACIJA','Matematika','Brzina promjene'],['INTEGRACIJA','Matematika','Sabiranje malih dijelova'],['EKSPONENT','Matematika','Iznad osnovice'],
      ['ALGORITAM','Tehnologija','Postupak korak po korak'],['ENKRIPCIJA','Tehnologija','Šifriranje poruke'],['IDENTITET','Pojmovi','Ono što jesi'],
      ['IZOMORFIZAM','Matematika','Ista struktura'],['MODULARNOST','Tehnologija','Odvojive cjeline'],['PARAMETAR','Tehnologija','Zadana vrijednost'],
      ['TOPOLOGIJA','Matematika','Odnosi u prostoru'],['EMULACIJA','Tehnologija','Oponašanje drugog sistema'],['PROTOKOL','Tehnologija','Pravila komunikacije'],
      ['ARHITEKTURA','Umjetnost','Prostor i oblik'],['PERSPEKTIVA','Umjetnost','Tačka gledišta'],['KOMPOZICIJA','Umjetnost','Raspored cjeline'],
      ['KUBIZAM','Umjetnost','Geometrijski oblici'],['SIMBOLIZAM','Umjetnost','Značenje iza znaka'],['NADREALIZAM','Umjetnost','Iza jave'],
      ['EGZISTENCIJA','Filozofija','Samo postojanje'],['ONTOLOGIJA','Filozofija','Proučavanje bića'],['HERMENEUTIKA','Filozofija','Umijeće tumačenja'],
      ['METAFIZIKA','Filozofija','Temelji stvarnosti'],['DETERMINIZAM','Filozofija','Sve ima uzrok'],['RACIONALIZAM','Filozofija','Razum kao temelj'],
      ['EMPIRIZAM','Filozofija','Iskustvo kao temelj'],['SKEPTICIZAM','Filozofija','Propitivanje tvrdnji'],['PLURALIZAM','Društvo','Više različitih gledišta'],
      ['SOLIDARNOST','Društvo','Zajedno u teškoći'],['FEDERALIZAM','Društvo','Podijeljene nadležnosti'],['AUTENTIČNOST','Osobine','Vjernost sebi']
    ]
  ];
  return bands.flatMap((rows, band) => rows.map(([word, category, clue]) => ({word, category, clue, band})));
});
