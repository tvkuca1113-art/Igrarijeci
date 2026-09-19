(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RPR_WORDS = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Five bands of difficulty; each row has a word, broad category and a brief clue and a clearer description.
  const bands = [
    [
      ['OBALA','Priroda','Uz vodu','Kopno uz vodu'],['ISKRA','Priroda','Trenutak sjaja','Kratak trenutak sjaja'],['MAGLA','Priroda','Slaba vidljivost','Slaba vidljivost u zraku'],
      ['KROŠNJA','Priroda','Iznad debla','Grane iznad debla'],['IZVOR','Priroda','Početak toka','Početak vodenog toka'],['BISER','Priroda','Skriven sjaj','Skriven sjaj u ljušturi'],
      ['ŠKOLJKA','Priroda','Morski trag','Morski trag na pijesku'],['KORALJ','Priroda','Morski svijet','Razgranati morski svijet'],['JAVOR','Priroda','Vrsta stabla','Stablo dlanastih listova'],
      ['JASEN','Priroda','Vrsta stabla','Stablo elastičnog drveta'],['POTOK','Priroda','Mali tok','Mali vodeni tok'],['UVALA','Priroda','Mirna obala','Zaklonjena mirna obala'],
      ['TKANJE','Zanati','Niti zajedno','Isprepletene niti zajedno'],['VEZIVO','Materijali','Drži zajedno','Materijal drži zajedno'],['KALUP','Zanati','Daje oblik','Predmet daje oblik'],
      ['ZANAT','Rad','Vješte ruke','Rad uz vješte ruke'],['OKLOP','Predmeti','Čvrsta zaštita','Čvrsta zaštita tijela'],['KOPČA','Predmeti','Drži zatvoreno','Drži odjeću zatvorenom'],
      ['PEČAT','Predmeti','Službeni trag','Službeni trag na dokumentu'],['BAKAR','Materijali','Crvenkasti metal','Crvenkasti provodljivi metal'],['ČELIK','Materijali','Čvrst metal','Čvrst metal s ugljikom'],
      ['SUTON','Priroda','Kraj dana','Kraj dana prije tame'],['ODMOR','Svakodnevica','Predah','Predah od rada'],['PONOS','Osjećaji','Uzdignuta glava','Uzdignuta glava nakon uspjeha'],
      ['ZAVIST','Osjećaji','Tuđi uspjeh','Smeta tuđi uspjeh'],['UMIJEĆE','Osobine','Naučena vještina','Dobro naučena vještina'],['POLET','Osjećaji','Nova energija','Nova energija za djelovanje'],
      ['PRKOS','Osobine','Uprkos svemu','Otpor tuđoj volji'],['NEMIR','Osjećaji','Bez spokoja','Život bez spokoja'],['NAGON','Pojmovi','Unutrašnji poriv','Snažan unutrašnji poriv'],
      ['ZAPLET','Književnost','Stvari se komplikuju','Stvari se komplikuju u priči'],['NASLOV','Književnost','Iznad teksta','Ime iznad teksta'],['ZAPIS','Jezik','Ostaje na papiru','Ostaje napisano na papiru'],
      ['UZORAK','Pojmovi','Mali dio cjeline','Mali reprezentativni dio cjeline'],['RAZMAK','Pojmovi','Između dvije stvari','Praznina između dvije stvari'],['OBRUB','Predmeti','Uz rub','Ukras uz rub'],
      ['PRIZOR','Pojmovi','Pred očima','Slika pred očima'],['PUTOKAZ','Predmeti','Pravi smjer','Pokazuje pravi smjer'],['DODIR','Osjeti','Kontakt','Kontakt preko kože'],
      ['ODJEK','Zvuk','Zvuk se vraća','Zvuk se ponovo vraća'],['ŠAPAT','Zvuk','Gotovo nečujno','Govor gotovo nečujno'],['ŠUMOR','Zvuk','Tihi zvuk prirode','Tihi zvuk lišća'],
      ['DŽEMPER','Odjeća','Za hladnije dane','Pleteno za hladnije dane'],['ČEŽNJA','Osjećaji','Neko nedostaje','Neko veoma nedostaje'],['NJEGA','Briga','Pažnja i pomoć','Pažnja i pomoć drugome'],
      ['LJEPOTA','Pojmovi','U oku posmatrača','Sklad u oku posmatrača'],['RIZIK','Pojmovi','Neizvjestan ishod','Moguć neizvjestan ishod'],['ZAČIN','Hrana','Malo za okus','Dodatak za bolji okus']
    ],
    [
      ['OBZIR','Osobine','Misliš na druge','Pažljivo misliš na druge'],['NAGOVOR','Odnosi','Riječi uvjeravaju','Riječi nekoga uvjeravaju'],['NAMJERA','Pojmovi','Prije odluke','Plan prije odluke'],
      ['ZAGONETKA','Jezik','Skriven odgovor','Pitanje sa skrivenim odgovorom'],['ZAVJESA','Predmeti','Zaklanja pogled','Tkanina zaklanja pogled'],['KLATNO','Predmeti','Tamo pa nazad','Njiše se tamo-nazad'],
      ['SVITAK','Predmeti','Smotani zapis','Smotani stari zapis'],['OBZOR','Priroda','Daljina pred očima','Granica daljine pred očima'],['ZRAČENJE','Fizika','Prijenos energije','Prijenos energije talasima'],
      ['TRENJE','Fizika','Otpor kretanju','Otpor pri dodiru površina'],['PRITISAK','Fizika','Sila na površinu','Sila po jedinici površine'],['TOPLOTA','Fizika','Prijenos energije','Energija prelazi toplije–hladnije'],
      ['ZAPREMINA','Matematika','Zauzeti prostor','Mjera zauzetog prostora'],['POVRŠINA','Matematika','Dvije dimenzije','Prostiranje u dvije dimenzije'],['KOLIČNIK','Matematika','Rezultat dijeljenja','Broj nakon dijeljenja'],
      ['RAZLOMAK','Matematika','Dio cjeline','Broj kao dio cjeline'],['SLOVNICA','Jezik','Jezička pravila','Skup jezičkih pravila'],['NARJEČJE','Jezik','Jezička raznolikost','Govor određenog kraja'],
      ['PRIDJEV','Jezik','Kakav je?','Opisuje kakav je predmet'],['GLAGOL','Jezik','Radnja ili stanje','Izražava radnju ili stanje'],['IMENICA','Jezik','Ime pojma','Ime bića ili pojma'],
      ['ZAMJENICA','Jezik','Umjesto imena','Riječ umjesto imena'],['POREĐENJE','Jezik','Slično nečemu','Isticanje sličnosti među stvarima'],['RAZMJENA','Odnosi','Daješ i dobijaš','Drugome daješ i dobijaš'],
      ['POSREDNIK','Odnosi','Između dvije strane','Pregovara između dvije strane'],['SAVEZNIK','Odnosi','Na tvojoj strani','Bori se na tvojoj strani'],['SABRANOST','Osobine','Mirna glava','Mirna glava pod pritiskom'],
      ['UPORNOST','Osobine','Ne odustaješ','Ni tada ne odustaješ'],['SKROMNOST','Osobine','Bez hvalisanja','Uspjeh bez hvalisanja'],['ISKRENOST','Osobine','Bez pretvaranja','Govoriš bez pretvaranja'],
      ['ODANOST','Osobine','Ostaješ uz nekoga','Ostaješ vjeran nekome'],['OPREZNOST','Osobine','Prije svakog koraka','Promisliš prije svakog koraka'],['DOSJETKA','Jezik','Duhovita misao','Kratka duhovita misao'],
      ['PODUHVAT','Rad','Velik zadatak','Zahtjevan velik zadatak'],['PREPREKA','Pojmovi','Nešto na putu','Smetnja na tvom putu'],['NAPREDAK','Pojmovi','Korak dalje','Korak dalje prema cilju'],
      ['ZAOKRET','Kretanje','Novi smjer','Kretanje u novom smjeru'],['PREOKRET','Događaji','Sve se mijenja','Sve se naglo mijenja'],['ODLOMAK','Književnost','Dio teksta','Odvojeni dio teksta'],
      ['RUKOPIS','Književnost','Lični potez','Lični potez pri pisanju'],['BILJEŠKA','Književnost','Kratak zapis','Kratak podsjetnik na papiru'],['PREDGOVOR','Književnost','Prije glavnog teksta','Uvod prije glavnog teksta'],
      ['ZNAČENJE','Jezik','Iza riječi','Smisao iza riječi'],['PITANJE','Jezik','Traži odgovor','Rečenica koja traži odgovor'],['ODGOVOR','Jezik','Nakon pitanja','Dolazi nakon postavljenog pitanja'],
      ['RAZLOG','Pojmovi','Zašto?','Objašnjava nam zašto'],['OSNOVA','Pojmovi','Na njoj gradimo','Temelj na kojem gradimo'],['POTREBA','Pojmovi','Nešto nedostaje','Nedostaje nešto važno']
    ],
    [
      ['DVOZNAČNOST','Jezik','Dva moguća tumačenja','Izraz ima dva tumačenja'],['PROTURJEČJE','Logika','Nespojive tvrdnje','Međusobno nespojive tvrdnje'],['PRETPOSTAVKA','Logika','Još nije dokazano','Polazište još nije dokazano'],
      ['ZAKLJUČAK','Logika','Na kraju razmišljanja','Misao na kraju razmišljanja'],['DOSLJEDNOST','Osobine','Ista načela','Ista načela kroz postupke'],['SNALAŽLJIVOST','Osobine','Nađeš način','Uvijek nađeš način'],
      ['RADOZNALOST','Osobine','Želiš saznati','Želiš saznati nešto novo'],['STRPLJENJE','Osobine','Možeš sačekati','Mirno možeš sačekati'],['SAOSJEĆANJE','Odnosi','Osjećaš tuđu bol','Prepoznaješ i tuđu bol'],
      ['POŠTOVANJE','Odnosi','Uvažavanje drugih','Iskreno uvažavanje drugih'],['POVJERENJE','Odnosi','Možeš se osloniti','Na nekoga se oslanjaš'],['PRAVEDNOST','Vrijednosti','Jednaka mjerila','Jednaka mjerila za sve'],
      ['ODGOVORNOST','Osobine','Stojiš iza postupaka','Stojiš iza svojih postupaka'],['SAMOSTALNOST','Osobine','Svojim snagama','Djeluješ svojim snagama'],['PRONICLJIVOST','Osobine','Vidiš ispod površine','Vidiš ispod prividne površine'],
      ['SMIŠLJENOST','Osobine','Nije slučajno','Postupanje nije slučajno'],['SAŽETOST','Jezik','Malo riječi','Bitno u malo riječi'],['JEZGROVITOST','Jezik','Mnogo u malom','Mnogo smisla u malom'],
      ['RAVNOTEŽA','Fizika','Ni na jednu stranu','Sile se međusobno poništavaju'],['POKRETLJIVOST','Kretanje','Lako mijenja položaj','Lako mijenja svoj položaj'],['ELASTIČNOST','Fizika','Vraća se obliku','Vraća se izvornom obliku'],
      ['PROVODNIK','Fizika','Put za struju','Materijal kojim teče struja'],['IZOLATOR','Fizika','Sprečava prolaz','Materijal sprečava prolaz struje'],['USMJERENJE','Pojmovi','Odabrani pravac','Svjesno odabrani pravac'],
      ['PRILAGODBA','Pojmovi','Prema novim uslovima','Promjena prema novim uslovima'],['ODSTUPANJE','Pojmovi','Izvan očekivanog','Pomak izvan očekivanog'],['POVEZANOST','Pojmovi','Niti među stvarima','Niti među različitim stvarima'],
      ['RAZLIČITOST','Pojmovi','Nismo svi isti','Nismo svi sasvim isti'],['JEDNAKOST','Vrijednosti','Bez razlike','Ista prava za sve'],['BLAGOSTANJE','Društvo','Dobri životni uslovi','Povoljni uslovi za život'],
      ['PRAVOVREMEN','Osobine','U pravi čas','Dolazi u pravi čas'],['DOSTOJANSTVO','Vrijednosti','Lična vrijednost','Poštovanje lične vrijednosti'],['SAMOKONTROLA','Osobine','Vladaš svojim reakcijama','Vladaš svojim naglim reakcijama'],
      ['NEIZVJESNOST','Osjećaji','Ishod nije poznat','Konačan ishod nije poznat'],['ZAPREPAŠTENJE','Osjećaji','Naglo iznenađenje','Snažno i naglo iznenađenje'],['ODUŠEVLJENJE','Osjećaji','Velika radost','Velika radost zbog nečega'],
      ['NESTRPLJENJE','Osjećaji','Teško je čekati','Veoma teško je čekati'],['RAZOČARENJE','Osjećaji','Manje od očekivanog','Dobiješ manje od očekivanog'],['IŠČEKIVANJE','Osjećaji','Još malo','Čekaš da nešto dođe'],
      ['RASPOLOŽENJE','Osjećaji','Kako se osjećaš','Kako se trenutno osjećaš'],['PREDOSJEĆAJ','Osjećaji','Prije nego saznaš','Slutiš prije nego saznaš'],['NADAHNUĆE','Stvaralaštvo','Izvor ideje','Poticaj za novu ideju'],
      ['STVARALAŠTVO','Umjetnost','Nastaje nešto novo','Radom nastaje nešto novo'],['KNJIŽEVNOST','Umjetnost','Svijet pisanih djela','Umjetnost pisanih djela'],['SLIKARSTVO','Umjetnost','Boje na podlozi','Nanošenje boja na podlogu'],
      ['VAJARSTVO','Umjetnost','Oblik u prostoru','Umjetnički oblik u prostoru'],['GRADITELJSTVO','Zanati','Od temelja naviše','Izgradnja od temelja naviše'],['DOBRODOŠLICA','Odnosi','Dolazak gosta','Srdačan prijem gosta']
    ],
    [
      ['APSTRAKCIJA','Filozofija','Iza konkretnog','Opća ideja iza konkretnog'],['PARADOKS','Logika','Naizgled nemoguće','Naizgled nemoguća tvrdnja'],['HIPOTEZA','Nauka','Čeka provjeru','Naučna tvrdnja čeka provjeru'],
      ['DEDUKCIJA','Logika','Od općeg ka posebnom','Zaključivanje od općeg ka posebnom'],['INDUKCIJA','Logika','Od primjera ka pravilu','Od više primjera ka pravilu'],['ANALOGIJA','Logika','Slični odnosi','Slični odnosi različitih stvari'],
      ['SINTEZA','Nauka','Dijelovi postaju cjelina','Dijelovi postaju nova cjelina'],['ANALIZA','Nauka','Cjelina na dijelove','Raščlanjivanje cjeline na dijelove'],['METAFORA','Jezik','Preneseno značenje','Slikovito preneseno značenje'],
      ['ALEGORIJA','Književnost','Skriveni sloj priče','Skriveni smisao cijele priče'],['IRONIJA','Jezik','Kažeš suprotno','Kažeš suprotno od mišljenog'],['HIPERBOLA','Jezik','Namjerno pretjerivanje','Stilsko namjerno pretjerivanje'],
      ['ALITERACIJA','Jezik','Ponavljanje suglasnika','Ponavljanje sličnih suglasnika'],['ASONANCA','Jezik','Ponavljanje samoglasnika','Ponavljanje istih samoglasnika'],['SINONIM','Jezik','Slično značenje','Riječ sličnog značenja'],
      ['ANTONIM','Jezik','Suprotno značenje','Riječ suprotnog značenja'],['HOMONIM','Jezik','Isti oblik','Isti oblik, drugo značenje'],['ETIMOLOGIJA','Jezik','Porijeklo riječi','Istražuje porijeklo riječi'],
      ['MORFOLOGIJA','Jezik','Oblici riječi','Proučava oblike riječi'],['SINTAKSA','Jezik','Slaganje rečenice','Pravila slaganja rečenice'],['SEMANTIKA','Jezik','Proučava značenje','Proučava značenje izraza'],
      ['FONETIKA','Jezik','Govorni glasovi','Proučava govorne glasove'],['FRAZEOLOGIJA','Jezik','Ustaljeni izrazi','Proučava ustaljene izraze'],['LEKSIKA','Jezik','Skup riječi','Skup korištenih riječi'],
      ['GRAVITACIJA','Fizika','Privlačenje masa','Uzajamno privlačenje masa'],['INERCIJA','Fizika','Otpor promjeni kretanja','Otpor promjeni stanja kretanja'],['REZONANCA','Fizika','Pojačane oscilacije','Pojačanje pri usklađenim oscilacijama'],
      ['FREKVENCIJA','Fizika','Koliko puta u sekundi','Broj ponavljanja u sekundi'],['AMPLITUDA','Fizika','Najveći otklon','Najveći otklon pri osciliranju'],['REFRAKCIJA','Fizika','Prelamanje talasa','Prelamanje talasa između sredina'],
      ['DIFRAKCIJA','Fizika','Savijanje talasa','Savijanje talasa oko prepreke'],['OSCILACIJA','Fizika','Oko ravnotežnog položaja','Kretanje oko ravnotežnog položaja'],['ENTROPIJA','Fizika','Broj mogućih stanja','Mjera broja mogućih stanja'],
      ['MAGNETIZAM','Fizika','Polovi privlače','Suprotni polovi privlače'],['KONDENZACIJA','Fizika','Iz plina u tečnost','Prelazak plina u tečnost'],['SUBLIMACIJA','Fizika','Čvrsto postaje plin','Čvrsto direktno postaje plin'],
      ['ISPARAVANJE','Fizika','Tečnost postaje para','Zagrijana tečnost postaje para'],['DESTILACIJA','Hemija','Razdvajanje isparavanjem','Razdvajanje isparavanjem pa hlađenjem'],['OKSIDACIJA','Hemija','Gubitak elektrona','Hemijski gubitak elektrona'],
      ['KATALIZATOR','Hemija','Ubrzava reakciju','Ubrzava hemijsku reakciju'],['ELEKTROLIZA','Hemija','Struja razlaže','Struja razlaže jedinjenje'],['FOTOSINTEZA','Biologija','Svjetlost u hranu','Svjetlost omogućava stvaranje hrane'],
      ['METABOLIZAM','Biologija','Promjene u organizmu','Hemijske promjene u organizmu'],['SIMBIOZA','Biologija','Život u zajednici','Blizak suživot različitih organizama'],['HROMOZOM','Biologija','Nosilac nasljeđa','Ćelijski nosilac nasljeđa'],
      ['EKOSISTEM','Biologija','Živa zajednica','Živa zajednica i okolina'],['ADAPTACIJA','Biologija','Prilagođavanje okolini','Biološko prilagođavanje okolini'],['EVOLUCIJA','Biologija','Promjene kroz generacije','Nasljedne promjene kroz generacije']
    ],
    [
      ['AUTONOMIJA','Pojmovi','Samostalno odlučivanje','Pravo na samostalno odlučivanje'],['OBJEKTIVNOST','Osobine','Bez lične pristrasnosti','Procjena bez lične pristrasnosti'],['INTEGRITET','Osobine','Dosljedna načela','Dosljedna moralna načela'],
      ['SPONTANOST','Osobine','Bez unaprijed plana','Djelovanje bez prethodnog plana'],['KONCIZNOST','Jezik','Kratko i jasno','Izražavanje kratko i jasno'],['ANTITEZA','Jezik','Suprotstavljeni pojmovi','Stilski suprotstavljeni pojmovi'],
      ['SAMOPOUZDANJE','Osobine','Vjeruješ u sebe','Vjeruješ u vlastite sposobnosti'],['STOICIZAM','Filozofija','Mir pred teškoćama','Filozofski mir pred teškoćama'],['ALTRUIZAM','Osobine','Dobrobit drugih','Nesebična dobrobit drugih'],
      ['INTUICIJA','Pojmovi','Bez svjesnog zaključivanja','Uvid bez svjesnog zaključivanja'],['TELEOLOGIJA','Filozofija','Objašnjenje kroz svrhu','Objašnjenje pojava kroz svrhu'],['EGALITARNOST','Vrijednosti','Načelo jednakosti','Društveno načelo jednakosti'],
      ['SIMETRIJA','Matematika','Podudarnost dijelova','Pravilna podudarnost dijelova'],['ORTOGONALAN','Matematika','Pod pravim uglom','Postavljen pod pravim uglom'],['PERMUTACIJA','Matematika','Drugačiji raspored','Drugačiji raspored istih elemenata'],
      ['KOTANGENS','Matematika','Trigonometrijska funkcija','Odnos kosinusa i sinusa'],['LOGARITAM','Matematika','Traženi eksponent','Eksponent za zadanu osnovicu'],['VJEROVATNOĆA','Matematika','Kolika je šansa','Kolika je šansa događaja'],
      ['DERIVACIJA','Matematika','Brzina promjene','Trenutna brzina promjene'],['INTEGRACIJA','Matematika','Sabiranje malih dijelova','Sabiranje beskrajno malih dijelova'],['EKSPONENT','Matematika','Iznad osnovice','Stepen iznad osnovice'],
      ['ALGORITAM','Tehnologija','Postupak korak po korak','Postupak do rješenja koracima'],['ENKRIPCIJA','Tehnologija','Šifriranje poruke','Zaštita šifriranjem poruke'],['IDENTITET','Pojmovi','Ono što jesi','Ono što te određuje'],
      ['IZOMORFIZAM','Matematika','Ista struktura','Jednaka struktura različitih objekata'],['MODULARNOST','Tehnologija','Odvojive cjeline','Sistem od odvojivih cjelina'],['PARAMETAR','Tehnologija','Zadana vrijednost','Vrijednost koja određuje ponašanje'],
      ['TOPOLOGIJA','Matematika','Odnosi u prostoru','Prostorni odnosi uprkos deformaciji'],['EMULACIJA','Tehnologija','Oponašanje drugog sistema','Oponašanje rada drugog sistema'],['PROTOKOL','Tehnologija','Pravila komunikacije','Dogovorena pravila komunikacije'],
      ['ARHITEKTURA','Umjetnost','Prostor i oblik','Oblikovanje prostora i zgrada'],['PERSPEKTIVA','Umjetnost','Tačka gledišta','Tačka gledišta posmatrača'],['KOMPOZICIJA','Umjetnost','Raspored cjeline','Umjetnički raspored dijelova cjeline'],
      ['KUBIZAM','Umjetnost','Geometrijski oblici','Prikaz kroz geometrijske oblike'],['SIMBOLIZAM','Umjetnost','Značenje iza znaka','Umjetničko značenje iza znaka'],['NADREALIZAM','Umjetnost','Iza jave','Svijet sna iza jave'],
      ['EGZISTENCIJA','Filozofija','Samo postojanje','Činjenica samog postojanja'],['ONTOLOGIJA','Filozofija','Proučavanje bića','Filozofsko proučavanje bića'],['HERMENEUTIKA','Filozofija','Umijeće tumačenja','Umijeće tumačenja tekstova'],
      ['METAFIZIKA','Filozofija','Temelji stvarnosti','Istražuje temelje stvarnosti'],['DETERMINIZAM','Filozofija','Sve ima uzrok','Svaki događaj ima uzrok'],['RACIONALIZAM','Filozofija','Razum kao temelj','Spoznaja kroz razum'],
      ['EMPIRIZAM','Filozofija','Iskustvo kao temelj','Spoznaja kroz iskustvo'],['SKEPTICIZAM','Filozofija','Propitivanje tvrdnji','Kritičko propitivanje tvrdnji'],['PLURALIZAM','Društvo','Više različitih gledišta','Suživot više različitih gledišta'],
      ['SOLIDARNOST','Društvo','Zajedno u teškoći','Uzajamna podrška u teškoći'],['FEDERALIZAM','Društvo','Podijeljene nadležnosti','Podijeljene nadležnosti vlasti'],['AUTENTIČNOST','Osobine','Vjernost sebi','Iskrena vjernost sebi']
    ]
  ];
  return bands.flatMap((rows, band) => rows.map(([word, category, clue, description]) => ({word, category, clue, description, band})));
});
