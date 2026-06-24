# Noor Quiz — volledige projectoverdracht

> Technische en functionele documentatie voor ontwikkelaars  
> Versie document: 1.0  
> Documentdatum: 24 juni 2026  
> Projectfase: werkende MVP / technisch prototype  
> Primaire taal van de applicatie: Nederlands

---

## Inhoudsopgave

1. [Doel van dit document](#1-doel-van-dit-document)
2. [Project in één oogopslag](#2-project-in-één-oogopslag)
3. [Visie, missie en ontwerpprincipes](#3-visie-missie-en-ontwerpprincipes)
4. [Doelgroepen en gebruikssituaties](#4-doelgroepen-en-gebruikssituaties)
5. [Huidige functionele scope](#5-huidige-functionele-scope)
6. [Volledige gebruikersflows](#6-volledige-gebruikersflows)
7. [Spelregels en quizlogica](#7-spelregels-en-quizlogica)
8. [Islamitische inhoud en bronnenbeleid](#8-islamitische-inhoud-en-bronnenbeleid)
9. [Technische architectuur](#9-technische-architectuur)
10. [Projectstructuur en bestanden](#10-projectstructuur-en-bestanden)
11. [Backend in detail](#11-backend-in-detail)
12. [Frontend in detail](#12-frontend-in-detail)
13. [API-referentie](#13-api-referentie)
14. [Datamodellen](#14-datamodellen)
15. [Statusmachine van een quizkamer](#15-statusmachine-van-een-quizkamer)
16. [Realtime synchronisatie](#16-realtime-synchronisatie)
17. [Vormgeving en responsive gedrag](#17-vormgeving-en-responsive-gedrag)
18. [Lokaal ontwikkelen en starten](#18-lokaal-ontwikkelen-en-starten)
19. [Teststrategie en handmatige acceptatietests](#19-teststrategie-en-handmatige-acceptatietests)
20. [Deployment naar productie](#20-deployment-naar-productie)
21. [Beveiliging, privacy en misbruikpreventie](#21-beveiliging-privacy-en-misbruikpreventie)
22. [Toegankelijkheid](#22-toegankelijkheid)
23. [Performance en schaalbaarheid](#23-performance-en-schaalbaarheid)
24. [Bekende beperkingen en technische schuld](#24-bekende-beperkingen-en-technische-schuld)
25. [Aanbevolen productiearchitectuur](#25-aanbevolen-productiearchitectuur)
26. [Aanbevolen databaseontwerp](#26-aanbevolen-databaseontwerp)
27. [Roadmap](#27-roadmap)
28. [Definitie van gereed voor een productieversie](#28-definitie-van-gereed-voor-een-productieversie)
29. [Onderhoudsprocedures](#29-onderhoudsprocedures)
30. [Beslislogboek en uitgangspunten](#30-beslislogboek-en-uitgangspunten)
31. [Snelle overnamechecklist](#31-snelle-overnamechecklist)
32. [Woordenlijst](#32-woordenlijst)

---

## 1. Doel van dit document

Dit document stelt een andere ontwikkelaar in staat om Noor Quiz over te nemen zonder afhankelijk te zijn van mondelinge uitleg van de oorspronkelijke maker.

Het beschrijft:

- waarom het product bestaat;
- welke ervaring het moet bieden;
- wat momenteel daadwerkelijk is geïmplementeerd;
- hoe de code en gegevensstromen zijn opgebouwd;
- hoe de API werkt;
- hoe quizvragen en bronnen worden beheerd;
- welke beperkingen bewust bij de MVP horen;
- wat vóór publieke lancering moet worden verbeterd;
- hoe het project logisch kan doorgroeien.

Dit document maakt nadrukkelijk onderscheid tussen:

- **huidige werkelijkheid:** functionaliteit die nu in de code aanwezig is;
- **productieadvies:** verbeteringen die nog niet zijn geïmplementeerd;
- **productvisie:** mogelijke toekomstige functionaliteit.

---

## 2. Project in één oogopslag

### 2.1 Productnaam

**Noor Quiz**

“Noor” betekent licht. De naam verwijst naar kennis als licht en naar het gezamenlijk groeien in islamitische kennis.

### 2.2 Kernpropositie

Noor Quiz is een laagdrempelige, islamitische multiplayerquiz voor familie, vrienden en kleine groepen. Eén persoon maakt een kamer aan en deelt een link of kamercode. Maximaal vier spelers nemen deel onder een nickname of kunya.

De ervaring lijkt qua basismechaniek op Kahoot:

- samen deelnemen aan een quiz;
- antwoorden kiezen;
- punten verdienen;
- een live tussenstand zien;
- eindigen met een podium.

Het onderscheidende element is de islamitische leerwaarde:

- iedere vraag hoort inhoudelijk onderbouwd te zijn;
- na het antwoord wordt een uitleg getoond;
- de speler krijgt een bronverwijzing naar de Qur’an of een authentieke hadith;
- de toon is warm, respectvol en gericht op gezamenlijke groei, niet uitsluitend op competitie.

### 2.3 Huidige technische status

De huidige versie is een werkende MVP:

- één Node.js-server;
- geen externe runtime-dependencies;
- een frontend in HTML, CSS en vanilla JavaScript;
- kamers in tijdelijk servergeheugen;
- synchronisatie via HTTP-polling;
- 18 hardcoded quizvragen;
- vijf vragen per ronde;
- maximaal vier spelers;
- desktop- en mobiele layout.

### 2.4 Wat deze versie nog niet is

De huidige versie is nog geen volledig productieplatform:

- geen database;
- geen gebruikersaccounts;
- geen beheeromgeving;
- geen WebSockets;
- geen automatische back-ups;
- geen formeel redactioneel goedkeuringsproces;
- geen uitgebreide geautomatiseerde testset;
- geen moderatie of geavanceerde abuse-preventie;
- geen analytics of monitoring;
- geen persistentie na een serverherstart.

---

## 3. Visie, missie en ontwerpprincipes

### 3.1 Visie

Islamitische kennis opdoen kan sociaal, toegankelijk en plezierig zijn zonder de inhoud te versimpelen of bronnen los te laten.

### 3.2 Missie

Noor Quiz brengt mensen samen rond betrouwbare islamitische kennis door een eenvoudige spelervaring te combineren met heldere bronvermelding en positieve competitie.

### 3.3 Kernwaarden

#### Betrouwbaarheid

Een juist antwoord is niet voldoende. De gebruiker moet kunnen begrijpen waarom het antwoord juist is en waarop die conclusie is gebaseerd.

#### Adab

De applicatie dient een respectvolle toon te behouden. Verkeerde antwoorden worden niet bestraffend of vernederend gebracht.

Voorbeeld uit de huidige interface:

> “Niet juist — maar wel iets geleerd”

#### Gezamenlijke groei

De ervaring benadrukt dat kenniswinst belangrijker is dan alleen de eindscore.

Voorbeeld uit het huidige eindscherm:

> “Vandaag ging niet alleen om winnen. Iedere bron die je onthoudt is winst.”

#### Laagdrempeligheid

Een deelnemer hoeft geen account aan te maken. Een link of zescijferige code en een nickname zijn voldoende.

#### Transparantie

Bronnen zijn zichtbaar en aanklikbaar. Bij toekomstige uitbreiding moet ook zichtbaar worden:

- welke geleerde of redacteur een vraag heeft gecontroleerd;
- wanneer een vraag is gecontroleerd;
- welke authenticiteitsclassificatie bij een hadith hoort;
- of er legitieme verschillen van mening bestaan.

### 3.4 Ontwerpprincipes

- Warm en uitnodigend, niet schools of klinisch.
- Islamitische sfeer zonder overmatige decoratie.
- Duidelijke hiërarchie en grote klikvlakken.
- Mobiel eerst bruikbaar.
- Geen onnodige registratiebarrières.
- Het antwoord en de bron pas onthullen nadat spelers hebben geantwoord.
- De server is leidend voor score, juistheid en spelstatus.

---

## 4. Doelgroepen en gebruikssituaties

### 4.1 Primaire doelgroep

- Moslimgezinnen;
- vriendengroepen;
- jongeren;
- bekeerlingen;
- kleine studiegroepen;
- islamitische verenigingen;
- docenten of begeleiders die een korte kennisactiviteit willen organiseren.

### 4.2 Secundaire doelgroep

- moskeeën;
- scholen;
- weekendonderwijs;
- jeugdorganisaties;
- online communities;
- deelnemers aan een ifṭār, familiedag of kennisavond.

### 4.3 Voornaamste gebruikssituaties

1. Een ouder maakt thuis een quiz voor het gezin.
2. Een vriend deelt een link in een groepschat.
3. Een docent start een korte quiz als herhaling van een les.
4. Een jeugdgroep speelt gezamenlijk op afzonderlijke telefoons.
5. Eén gebruiker speelt alleen om kennis te oefenen.

### 4.4 Huidige groepsgrootte

Maximaal vier spelers per kamer.

Deze grens is op meerdere plaatsen functioneel en visueel verwerkt:

- backend weigert de vijfde deelnemer;
- lobby toont vier spelersslots;
- marketingtekst noemt maximaal vier spelers.

Wanneer de limiet later verandert, moeten al deze plaatsen gezamenlijk worden aangepast.

---

## 5. Huidige functionele scope

### 5.1 Startscherm

Het startscherm bevat:

- merknaam Noor Quiz;
- korte productbelofte;
- knop om een quizkamer te maken;
- knop om via een code deel te nemen;
- drie kernkenmerken:
  - maximaal vier spelers;
  - authentieke bronnen;
  - meerdere niveaus.

### 5.2 Kamer aanmaken

De toekomstige host:

1. kiest “Maak een quiz”;
2. vult een nickname of kunya in;
3. verstuurt het formulier;
4. ontvangt een unieke kamercode;
5. wordt als eerste speler en host toegevoegd.

### 5.3 Deelnemen

Een speler kan deelnemen via:

- een gedeelde URL met `?room=KAMERCODE`;
- handmatig invoeren van de zescijferige kamercode.

De speler vult ook een nickname of kunya in.

### 5.4 Lobby

De lobby toont:

- kamercode;
- deelbare URL;
- knop om de URL te kopiëren;
- huidige spelers;
- lege spelersslots;
- kennisniveau;
- onderwerp;
- hoststatus;
- startknop voor de host.

### 5.5 Beschikbare niveaus

| Interne waarde | Label | Omschrijving |
|---|---|---|
| `beginner` | Beginner | Een rustige start met de basis |
| `intermediate` | Gevorderd | Meer verdieping en verbanden |
| `advanced` | Uitdaging | Voor de serieuze kenniszoeker |

### 5.6 Beschikbare onderwerpen

| Interne waarde | Label |
|---|---|
| `mixed` | Alles door elkaar |
| `aqidah` | ‘Aqīdah |
| `quran` | Qur’an |
| `worship` | Aanbidding |
| `seerah` | Sīrah |
| `character` | Adab & karakter |

### 5.7 Quizronde

Een huidige ronde bestaat uit vijf vragen.

Per vraag ziet de speler:

- onderwerp en niveau;
- voortgang;
- vraagtekst;
- vier antwoordopties;
- aantal spelers dat heeft geantwoord;
- tussenstand.

### 5.8 Antwoordfase

- Een speler kan precies één antwoord indienen.
- Na verzending is het antwoord geblokkeerd.
- De server berekent juistheid en punten.
- Als alle spelers hebben geantwoord, wordt het antwoord automatisch onthuld.
- De host kan het antwoord ook voortijdig onthullen.

### 5.9 Uitleg- en bronfase

Na onthulling ziet de speler:

- welk antwoord juist is;
- indien van toepassing welk gekozen antwoord fout was;
- een korte inhoudelijke uitleg;
- een bronlabel;
- een externe bronlink;
- toegekende punten;
- de actuele tussenstand.

### 5.10 Eindstand

Na vijf vragen toont de applicatie:

- een podium voor maximaal de beste drie spelers;
- score per podiumplaats;
- een volledige gerangschikte lijst;
- een knop om een nieuwe quiz te maken.

---

## 6. Volledige gebruikersflows

### 6.1 Flow: host maakt een kamer

1. Gebruiker opent `/`.
2. Gebruiker klikt op “Maak een quiz”.
3. Frontend rendert het invoerscherm.
4. Gebruiker voert nickname of kunya in.
5. Frontend stuurt `POST /api/rooms`.
6. Server:
   - valideert de naam;
   - genereert een kamercode;
   - genereert een speler-ID;
   - maakt een kamer in de `rooms`-Map;
   - maakt de eerste speler host.
7. Frontend bewaart het speler-ID in `sessionStorage`.
8. URL wordt gewijzigd naar `?room=CODE`.
9. Frontend haalt de kamerstatus op.
10. Polling start.
11. Lobby wordt weergegeven.

### 6.2 Flow: speler volgt een gedeelde link

1. Speler opent `/?room=CODE`.
2. Frontend leest de `room` queryparameter.
3. Als voor deze kamer geen speler-ID in `sessionStorage` bestaat:
   - deelnamescherm wordt getoond;
   - kamercode is vooraf ingevuld.
4. Speler voert een nickname of kunya in.
5. Frontend stuurt `POST /api/rooms/:code/join`.
6. Server controleert:
   - bestaat de kamer;
   - is de kamer nog in de lobby;
   - zijn er minder dan vier spelers;
   - is de naam niet leeg;
   - is de naam nog niet in gebruik.
7. Server maakt een speler-ID.
8. Frontend bewaart de sessie lokaal en opent de lobby.

### 6.3 Flow: host configureert de quiz

1. Host kiest een niveau.
2. Host kiest een onderwerp.
3. Iedere wijziging stuurt `POST /api/rooms/:code/config`.
4. Server controleert of de uitvoerende speler de host is.
5. Server slaat niveau en onderwerp op.

Niet-hostspelers zien de velden uitgeschakeld.

### 6.4 Flow: quiz starten

1. Host klikt op “Start de quiz”.
2. Frontend stuurt `POST /api/rooms/:code/start`.
3. Server selecteert vijf vragen.
4. Kamerfase wordt `question`.
5. `questionStartedAt` wordt ingesteld.
6. Alle clients zien via het antwoord of polling de eerste vraag.

### 6.5 Flow: antwoord indienen

1. Speler kiest A, B, C of D.
2. Frontend blokkeert onmiddellijk alle antwoordknoppen.
3. Frontend stuurt keuze-index en speler-ID naar de server.
4. Server controleert:
   - kamerfase is `question`;
   - speler bestaat;
   - speler heeft nog niet geantwoord;
   - keuze is een geldige index.
5. Server berekent:
   - juist of fout;
   - verstreken tijd;
   - aantal punten.
6. Antwoord wordt opgeslagen bij de speler.
7. Score wordt verhoogd.
8. Als iedereen antwoordde, gaat de kamer naar `reveal`.
9. Frontend rendert de actuele status.

### 6.6 Flow: antwoord onthullen

Automatisch:

- zodra iedere huidige speler een antwoord heeft ingediend.

Handmatig:

- host klikt op “Antwoord onthullen”;
- server zet de fase op `reveal`.

### 6.7 Flow: volgende vraag

1. Alleen de host ziet de vervolgknop.
2. Host klikt op “Volgende vraag”.
3. Frontend stuurt `POST /api/rooms/:code/next`.
4. Server:
   - verhoogt `questionIndex`; of
   - zet de fase op `finished` na de laatste vraag.
5. Voor een nieuwe vraag wordt `questionStartedAt` opnieuw ingesteld.

### 6.8 Flow: sessie hervatten

Het speler-ID wordt opgeslagen onder:

```text
noor-KAMERCODE
```

in `sessionStorage`.

Gevolgen:

- verversen in hetzelfde tabblad herstelt de sessie;
- een nieuw tabblad heeft normaal gesproken geen toegang tot dezelfde `sessionStorage`;
- na sluiten van de browsersessie kan herstel verloren gaan;
- er bestaat geen servergestuurde reconnect-token of accountkoppeling.

---

## 7. Spelregels en quizlogica

### 7.1 Aantal vragen

Iedere ronde bevat momenteel maximaal vijf vragen:

```js
return [...new Map(pool.map(q => [q.id, q])).values()].slice(0, 5);
```

Als de totale geselecteerde pool minder dan vijf unieke vragen bevat, kan de ronde in theorie korter worden. Met de huidige verzameling en fallbacklogica worden normaal vijf vragen gevonden.

### 7.2 Vraagselectie

De functie `selectQuestions(level, topic)` werkt in deze volgorde:

1. exacte vragen voor niveau plus onderwerp;
2. overige vragen van hetzelfde niveau, willekeurig gesorteerd;
3. overige vragen van hetzelfde onderwerp, willekeurig gesorteerd;
4. duplicaten verwijderen;
5. de eerste vijf nemen.

Belangrijke nuance:

- een quiz met een specifiek onderwerp kan door de fallback ook vragen uit andere onderwerpen bevatten;
- een quiz met een specifiek niveau kan door de laatste fallback vragen van een ander niveau bevatten;
- “Alles door elkaar” gebruikt vragen van hetzelfde niveau als primaire pool;
- `Array.sort(() => Math.random() - .5)` is voldoende voor een MVP, maar geen statistisch sterke shuffle.

Voor productie wordt een expliciete en voorspelbare selectiestrategie aanbevolen.

### 7.3 Scoreberekening

Een fout antwoord levert nul punten op.

Een juist antwoord levert minimaal 1000 en maximaal ongeveer 1500 punten op:

```js
const points = correct
  ? 1000 + Math.max(0, Math.round(500 - elapsed / 40))
  : 0;
```

Waarbij:

- `elapsed` het aantal milliseconden sinds `questionStartedAt` is;
- de snelheidsbonus start rond 500;
- iedere 40 milliseconden ongeveer één bonuspunt verdwijnt;
- na ongeveer 20 seconden is de bonus nul;
- een juist antwoord blijft daarna 1000 punten waard.

### 7.4 Gelijke scores

Er bestaat momenteel geen aparte tie-breaker.

Spelers worden gesorteerd op:

```js
b.score - a.score
```

Bij exact gelijke scores hangt de volgorde af van de stabiele sorteervolgorde van de JavaScript-runtime en de oorspronkelijke spelersvolgorde.

Productieadvies:

- leg expliciet vast of totale antwoordtijd, aantal juiste antwoorden of een gedeelde positie de tie-breaker bepaalt.

### 7.5 Geen timer in de interface

Er wordt wel een snelheidsbonus berekend, maar er is momenteel:

- geen zichtbare countdown;
- geen automatische timeout;
- geen maximale antwoordduur;
- geen indicator van resterende bonus.

Dit is een belangrijke UX-keuze voor een volgende versie.

---

## 8. Islamitische inhoud en bronnenbeleid

### 8.1 Huidige vragenbank

De huidige MVP bevat 18 vragen:

| Onderwerp | Aantal |
|---|---:|
| ‘Aqīdah | 4 |
| Qur’an | 4 |
| Aanbidding | 4 |
| Sīrah | 4 |
| Adab & karakter | 2 |
| **Totaal** | **18** |

De vragen zijn direct opgenomen in `server.js`.

### 8.2 Huidig vraagschema

Iedere vraag heeft:

```js
{
  id: "aq-b-1",
  level: "beginner",
  topic: "aqidah",
  question: "Vraagtekst",
  options: ["A", "B", "C", "D"],
  correct: 1,
  explanation: "Korte uitleg",
  source: "Leesbaar bronlabel",
  sourceUrl: "https://..."
}
```

### 8.3 Betekenis van velden

| Veld | Betekenis |
|---|---|
| `id` | Unieke, stabiele identificatie |
| `level` | Moeilijkheidscategorie |
| `topic` | Onderwerpcategorie |
| `question` | Vraag in het Nederlands |
| `options` | Exact vier antwoordmogelijkheden |
| `correct` | Nulgebaseerde index van het juiste antwoord |
| `explanation` | Beknopte inhoudelijke onderbouwing |
| `source` | Menselijk leesbare bronverwijzing |
| `sourceUrl` | Externe URL naar bron |

### 8.4 Huidige bronsoorten

- Qur’anverzen via `quran.com`;
- overleveringen via `sunnah.com`;
- verwijzingen naar Ṣaḥīḥ al-Bukhārī;
- verwijzingen naar Ṣaḥīḥ Muslim.

### 8.5 Kritieke redactionele waarschuwing

De huidige vragen zijn bruikbaar als prototype-inhoud, maar vóór een publieke inhoudelijke claim moet de volledige vragenbank onafhankelijk worden gecontroleerd door een daarvoor geschikte islamitische inhoudsredacteur of betrouwbare student van kennis.

Technische aanwezigheid van een bronlink is niet hetzelfde als:

- correcte toepassing van de bron;
- volledige context;
- correcte Nederlandse formulering;
- juiste authenticiteitsclassificatie;
- correcte omgang met verschillen van mening;
- toestemming om een complexe fiqhkwestie als enkelvoudig quizantwoord weer te geven.

### 8.6 Aanbevolen bronhiërarchie

Voor toekomstige redactie:

1. Qur’an;
2. authentieke Sunnah;
3. uitleg van erkende vroege en klassieke geleerden;
4. praktijk en uitspraken van de ṣaḥābah en vrome voorgangers, met traceerbare bron;
5. betrouwbare hedendaagse uitleg waar nodig.

### 8.7 Aanbevolen inhoudelijke statussen

Voeg in een database minstens toe:

- `draft`;
- `needs_review`;
- `approved`;
- `rejected`;
- `archived`.

### 8.8 Aanbevolen aanvullende velden

```text
source_type
source_collection
source_reference
hadith_grade
arabic_text
dutch_translation
review_notes
reviewed_by
reviewed_at
school_of_thought_scope
difference_of_opinion_note
content_version
```

### 8.9 Vragen die beter vermeden worden

Vermijd zonder zorgvuldige redactie:

- controversiële kwesties als simpele waar/onwaarvraag;
- takfīr-gerelateerde vragen;
- geopolitieke stellingnames;
- persoonlijke fatwa’s;
- medische of juridische claims;
- kwesties met bekende legitieme meningsverschillen zonder context;
- losse citaten zonder traceerbare primaire bron;
- zwakke of verzonnen overleveringen zonder expliciete educatieve context.

### 8.10 Transliteration en schrijfwijze

De huidige interface gebruikt diakritische transliteratie, zoals:

- ‘Aqīdah;
- Sīrah;
- Ramaḍān;
- ṣalāh;
- īmān.

Bij uitbreiding moet één stijlgids worden gekozen en consequent worden toegepast. Let ook op:

- schrijfwijze van “Qur’an”;
- gebruik van `ﷺ` versus tekstuele vredesgroet;
- consistente namen van metgezellen;
- juiste apostroftekens;
- correcte Unicode-normalisatie.

---

## 9. Technische architectuur

### 9.1 Overzicht

De applicatie gebruikt een eenvoudige client-serverarchitectuur:

```text
Browser
  |
  | HTTP/JSON + periodieke polling
  v
Node.js HTTP-server
  |
  | in-memory Map
  v
Tijdelijke kamers en spelers
```

### 9.2 Technologieën

#### Server

- Node.js;
- ingebouwde module `node:http`;
- ingebouwde module `node:fs`;
- ingebouwde module `node:path`;
- ingebouwde module `node:crypto`.

#### Client

- HTML5;
- CSS3;
- vanilla JavaScript;
- Fetch API;
- `sessionStorage`;
- Clipboard API.

#### Externe frontendbronnen

- Google Fonts:
  - DM Sans;
  - Playfair Display.

### 9.3 Geen frameworks

De huidige versie gebruikt geen:

- Express;
- React;
- Vue;
- Svelte;
- TypeScript;
- ORM;
- databaseclient;
- WebSocket-bibliotheek;
- buildtool.

Voordelen:

- zeer kleine codebasis;
- vrijwel geen installatietijd;
- geen dependency-risico;
- eenvoudig lokaal starten.

Nadelen:

- weinig scheiding tussen domeinlogica en transport;
- handmatige rendering;
- handmatige statusafhandeling;
- beperkt schaalbaar;
- minder typeveilig;
- moeilijker om een grote beheeromgeving toe te voegen.

### 9.4 Server als bron van waarheid

De server bepaalt:

- kamerfase;
- host;
- spelers;
- vraagselectie;
- juiste antwoord;
- score;
- antwoordstatus;
- voortgang.

De client bepaalt alleen presentatie en stuurt gebruikersintenties.

Dit principe moet behouden blijven bij verdere ontwikkeling. De client mag nooit zelf betrouwbare scores of juiste antwoorden bepalen.

---

## 10. Projectstructuur en bestanden

```text
project-root/
├── package.json
├── README.md
├── server.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── outputs/
    ├── noor-quiz-mvp.zip
    └── NOOR_QUIZ_PROJECT_OVERDRACHT.md
```

### 10.1 `package.json`

Bevat:

- projectmetadata;
- startscript;
- ontwikkelscript;
- minimale Node-versie.

Scripts:

```bash
npm start
npm run dev
```

`npm run dev` gebruikt Node’s ingebouwde watchmodus.

### 10.2 `server.js`

Bevat momenteel:

- volledige vragenbank;
- kamergeheugen;
- domeinlogica;
- validatie;
- API-routering;
- statische bestandsserver;
- serverbootstrap.

Dit bestand heeft daardoor meerdere verantwoordelijkheden. Voor de MVP is dat acceptabel, maar bij uitbreiding moet het worden opgesplitst.

### 10.3 `public/index.html`

Bevat:

- documentmetadata;
- fontimports;
- vaste header;
- hoofdcontainer `#app`;
- toastcontainer;
- koppeling naar CSS en JavaScript.

### 10.4 `public/styles.css`

Bevat de volledige visuele stijl:

- kleuren;
- typografie;
- componenten;
- lobby;
- antwoordkaarten;
- podium;
- responsive breakpoints;
- achtergrondpatroon;
- animaties.

### 10.5 `public/app.js`

Bevat:

- clientstatus;
- API-helper;
- HTML-escaping;
- alle schermrenderers;
- alle event handlers;
- polling;
- sessieherstel;
- routering op basis van applicatiestatus.

### 10.6 `README.md`

Korte start- en featurehandleiding. Dit overdrachtsdocument is de uitgebreide aanvulling.

---

## 11. Backend in detail

### 11.1 Configuratie

```js
const PORT = process.env.PORT || 4173;
const HOST = process.env.HOST || "127.0.0.1";
```

Lokale standaard:

```text
http://127.0.0.1:4173
```

Voor deployment in een container moet `HOST` doorgaans `0.0.0.0` zijn.

### 11.2 Kameropslag

```js
const rooms = new Map();
```

De sleutel is de kamercode. De waarde is het volledige kamerobject.

Gevolgen:

- snelle toegang;
- geen database nodig;
- alle gegevens verdwijnen bij procesherstart;
- meerdere serverinstances delen geen kamers;
- horizontale scaling werkt niet zonder gedeelde opslag.

### 11.3 Kamercodes

Kamercodes bestaan uit zes tekens.

Gebruikt alfabet:

```text
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

Verwarrende tekens zoals `I`, `O`, `0` en `1` zijn bewust weggelaten.

Botsingen worden voorkomen door opnieuw te genereren zolang een code al bestaat.

### 11.4 Speler-ID’s

```js
crypto.randomBytes(12).toString("hex")
```

Resultaat:

- 24 hexadecimale tekens;
- cryptografisch sterke willekeur;
- fungeert in de MVP feitelijk als sessietoken.

### 11.5 Naamvalidatie

```js
String(value || "")
  .trim()
  .replace(/[<>]/g, "")
  .slice(0, 24);
```

Huidige regels:

- voor- en achterliggende witruimte wordt verwijderd;
- `<` en `>` worden verwijderd;
- maximaal 24 tekens;
- lege naam wordt geweigerd;
- dubbele naam binnen dezelfde kamer wordt hoofdletterongevoelig geweigerd.

Aanvullend beschermt de frontend output met `escapeHtml`.

### 11.6 Requestbody

De server leest JSON handmatig en stopt bij meer dan 50.000 tekens.

Er is momenteel geen:

- formele controle van `Content-Type`;
- JSON-schema;
- specifieke foutmelding voor ongeldige JSON;
- rate limiting.

### 11.7 Kameropruiming

Iedere vijftien minuten wordt gezocht naar kamers die zes uur niet zijn bijgewerkt.

```text
controle-interval: 15 minuten
vervaltijd: 6 uur
```

Iedere geldige API-interactie met een kamer vernieuwt `updatedAt`, inclusief polling.

Praktische nuance:

- zolang minstens één client blijft pollen, blijft de kamer actief;
- een verlaten kamer wordt maximaal ongeveer zes uur en vijftien minuten bewaard;
- na procesherstart is iedere kamer direct weg.

### 11.8 Room view / veilige response

`roomView(room, playerId)` maakt een clientweergave.

Belangrijk:

- vóór onthulling wordt `correct` niet meegestuurd;
- uitleg en bron worden vóór onthulling niet meegestuurd;
- alleen het eigen opgeslagen antwoord staat in `me.answer`;
- andere spelers tonen alleen of ze hebben geantwoord;
- spelers worden voor de response op score gesorteerd.

Dit voorkomt eenvoudige onthulling van het juiste antwoord via de normale API-response vóór de reveal-fase.

### 11.9 Statische bestandsserver

De server levert bestanden uit `public/`.

Voor onbekende paden wordt `index.html` teruggegeven. Dit ondersteunt in beginsel client-side routes, hoewel de huidige applicatie alleen queryparameters gebruikt.

Beperking:

- een ontbrekend CSS-, JS- of afbeeldingsbestand kan eveneens `index.html` terugkrijgen;
- een productie-statische server moet onderscheid maken tussen asset-404’s en SPA-routes.

---

## 12. Frontend in detail

### 12.1 Globale clientstatus

```js
const state = {
  roomCode: "...",
  playerId: "",
  room: null,
  poller: null,
  mode: "home"
};
```

### 12.2 Renderingmodel

Er is geen componentframework. Ieder scherm vervangt `app.innerHTML`.

Belangrijkste renderfuncties:

| Functie | Verantwoordelijkheid |
|---|---|
| `home()` | Landingspagina |
| `nameScreen(mode)` | Kamer maken of deelnemen |
| `lobby(room)` | Lobby en instellingen |
| `quiz(room)` | Vraag- en revealweergave |
| `finished(room)` | Eindstand |
| `render()` | Kiest scherm op basis van kamerfase |

Na iedere volledige render worden event handlers opnieuw gekoppeld.

### 12.3 API-helper

`request(url, options)`:

- gebruikt `fetch`;
- stuurt standaard JSON-contenttype;
- leest response als JSON;
- gooit een `Error` bij niet-successtatus;
- gebruikt serverfoutmelding voor de interface.

### 12.4 XSS-bescherming

Dynamische gebruikers- en contenttekst wordt doorgaans door `escapeHtml()` gehaald.

Dit is belangrijk omdat rendering via `innerHTML` gebeurt.

Bij toekomstige wijzigingen geldt:

- nooit onbetrouwbare waarden direct in templates plaatsen;
- URLs afzonderlijk valideren;
- bij voorkeur overstappen op DOM-elementcreatie of een framework met standaard escaping.

### 12.5 Sessiebeheer

Het speler-ID wordt in `sessionStorage` geplaatst:

```js
sessionStorage.setItem(`noor-${code}`, playerId);
```

Er zijn geen cookies of lokale accounts.

### 12.6 URL-beheer

Na maken of deelnemen:

```js
history.replaceState({}, "", `?room=${result.code}`);
```

Hierdoor:

- is de kamerlink zichtbaar;
- ontstaat geen extra browsergeschiedenis-item;
- kan de URL worden gedeeld.

### 12.7 Clipboard

De lobby gebruikt:

```js
navigator.clipboard.writeText(shareUrl)
```

Clipboardtoegang kan in sommige browsers alleen werken:

- via HTTPS;
- op localhost;
- na een expliciete gebruikersactie.

Er is momenteel geen fallback als de Clipboard API niet beschikbaar is.

### 12.8 Betekenisvolle updatecontrole

Polling rendert alleen opnieuw wanneer:

- de fase verandert;
- de vraagindex verandert;
- de geserialiseerde spelerslijst verandert.

Dit voorkomt onnodige her-rendering.

Huidige beperking:

- wijzigingen aan niveau of onderwerp tellen niet zelfstandig als “meaningful change” voor niet-hostclients;
- de quizstart verandert wel de fase en wordt dus zichtbaar;
- een uitgebreidere vergelijking of eventgestuurde architectuur is aanbevolen.

### 12.9 Foutcommunicatie

Er bestaan twee manieren:

- inline foutmelding bij het naam-/deelnameformulier;
- tijdelijke toast voor overige fouten.

Er is geen centrale error boundary of offlineweergave.

---

## 13. API-referentie

Alle responses zijn JSON en bevatten:

```http
Cache-Control: no-store
Content-Type: application/json; charset=utf-8
```

### 13.1 Kamer maken

```http
POST /api/rooms
```

Body:

```json
{
  "nickname": "Umm Maryam"
}
```

Succes:

```json
{
  "code": "YL4D62",
  "playerId": "24-tekens-hexadecimaal"
}
```

Status:

- `201` aangemaakt;
- `400` lege naam;
- `500` onverwachte fout.

### 13.2 Kamer ophalen

```http
GET /api/rooms/:code?playerId=:playerId
```

Succes:

```json
{
  "code": "YL4D62",
  "phase": "lobby",
  "hostId": "...",
  "isHost": true,
  "level": "beginner",
  "topic": "mixed",
  "topicName": "Alles door elkaar",
  "players": [],
  "questionIndex": 0,
  "totalQuestions": 0,
  "me": {},
  "question": null
}
```

Status:

- `200` gevonden;
- `404` kamer bestaat niet.

### 13.3 Deelnemen

```http
POST /api/rooms/:code/join
```

Body:

```json
{
  "nickname": "Abu Yusuf"
}
```

Status:

- `201` deelnemer toegevoegd;
- `400` lege naam;
- `404` onbekende kamer;
- `409` quiz begonnen, kamer vol of naam al in gebruik.

### 13.4 Instellingen wijzigen

```http
POST /api/rooms/:code/config
```

Body:

```json
{
  "playerId": "...",
  "level": "intermediate",
  "topic": "quran"
}
```

Status:

- `200` gewijzigd;
- `403` geen geldige speler of geen host;
- `409` quiz al begonnen.

### 13.5 Quiz starten

```http
POST /api/rooms/:code/start
```

Body:

```json
{
  "playerId": "..."
}
```

Status:

- `200` gestart;
- `400` geen vragen beschikbaar;
- `403` geen host.

### 13.6 Antwoord indienen

```http
POST /api/rooms/:code/answer
```

Body:

```json
{
  "playerId": "...",
  "choice": 1
}
```

`choice` is nulgebaseerd:

- `0` = A;
- `1` = B;
- `2` = C;
- `3` = D.

Status:

- `200` opgeslagen;
- `400` ongeldige keuze;
- `403` ongeldige speler;
- `409` verkeerde fase of al geantwoord.

### 13.7 Antwoord onthullen

```http
POST /api/rooms/:code/reveal
```

Body:

```json
{
  "playerId": "..."
}
```

Alleen host.

### 13.8 Volgende vraag

```http
POST /api/rooms/:code/next
```

Body:

```json
{
  "playerId": "..."
}
```

Alleen host en alleen vanuit `reveal`.

### 13.9 Algemene foutvorm

```json
{
  "error": "Menselijk leesbare foutmelding."
}
```

---

## 14. Datamodellen

### 14.1 Intern kamerobject

```js
{
  code: "YL4D62",
  hostId: "player-id",
  phase: "lobby",
  level: "beginner",
  topic: "mixed",
  quiz: [],
  questionIndex: 0,
  questionStartedAt: null,
  updatedAt: 1750790000000,
  players: []
}
```

### 14.2 Intern spelerobject

```js
{
  id: "player-id",
  nickname: "Umm Maryam",
  score: 1388,
  answers: {
    "0": {
      choice: 1,
      correct: true,
      points: 1388
    }
  }
}
```

### 14.3 Clientkamerweergave

De response wordt beperkt ten opzichte van het interne object.

```js
{
  code,
  phase,
  hostId,
  isHost,
  level,
  topic,
  topicName,
  players,
  questionIndex,
  totalQuestions,
  me,
  question
}
```

### 14.4 Fasen

Toegestane huidige waarden:

```text
lobby
question
reveal
finished
```

Er is geen formele enum; dit zijn stringwaarden.

---

## 15. Statusmachine van een quizkamer

```text
                host maakt kamer
                       |
                       v
                    LOBBY
                       |
                  host start
                       |
                       v
                   QUESTION
                  /        \
     iedereen antwoordt    host onthult
                \           /
                 v         v
                    REVEAL
                       |
            host kiest volgende
                 /           \
       nog vragen             laatste vraag
           |                       |
           v                       v
        QUESTION                FINISHED
```

### 15.1 Toegestane mutaties per fase

| Actie | Lobby | Question | Reveal | Finished |
|---|---:|---:|---:|---:|
| Deelnemen | Ja | Nee | Nee | Nee |
| Config wijzigen | Ja | Nee | Nee | Nee |
| Starten | Ja | Niet bedoeld | Niet bedoeld | Niet bedoeld |
| Antwoorden | Nee | Ja | Nee | Nee |
| Onthullen | Nee | Ja | Geen wijziging | Nee |
| Volgende | Nee | Nee | Ja | Nee |

### 15.2 Huidige servervalidatie is niet overal maximaal strikt

Voorbeeld:

- de start-endpoint controleert host, maar niet expliciet of de fase `lobby` is.

Een host met directe API-toegang kan daardoor mogelijk opnieuw starten vanuit een andere fase.

Productieadvies:

- valideer voor iedere actie een expliciete toegestane fase;
- centraliseer transities in een domeinlaag;
- voeg tests toe voor ongeldige transities.

---

## 16. Realtime synchronisatie

### 16.1 Huidige techniek

De client vraagt ongeveer iedere 1,1 seconde de kamerstatus op:

```js
setInterval(refresh, 1100);
```

### 16.2 Voordelen voor de MVP

- zeer eenvoudig;
- werkt zonder WebSocketinfrastructuur;
- makkelijk te debuggen;
- voldoende voor maximaal vier spelers en weinig kamers.

### 16.3 Nadelen

- maximaal ongeveer 1,1 seconde zichtbare vertraging;
- veel herhaalde HTTP-verzoeken;
- polling houdt kamers actief;
- minder efficiënt bij veel gelijktijdige kamers;
- hostacties zijn niet onmiddellijk zichtbaar;
- netwerkonderbrekingen hebben geen robuuste reconnectflow.

### 16.4 Aanbevolen vervolgstap

Gebruik één van:

- WebSockets;
- Socket.IO;
- Server-Sent Events voor serverupdates plus HTTP voor commando’s;
- Supabase Realtime;
- een andere beheerde realtime-dienst.

### 16.5 Autoritatief eventmodel

Aanbevolen events:

```text
room.created
player.joined
player.left
room.config_updated
quiz.started
answer.submitted
answer.revealed
question.advanced
quiz.finished
host.transferred
```

Clients moeten na reconnect altijd een volledige roomsnapshot kunnen ophalen.

---

## 17. Vormgeving en responsive gedrag

### 17.1 Visuele richting

De interface combineert:

- crèmekleurige achtergrond;
- diepgroen als primaire kleur;
- goud als accent;
- zachte kaarten;
- islamitisch geometrisch patroon;
- grote serifkoppen;
- moderne sans-serif broodtekst.

### 17.2 Belangrijkste CSS-variabelen

```css
--ink: #15342d;
--cream: #f8f4e8;
--green: #1f6a56;
--green-dark: #144a3d;
--mint: #dcecdf;
--gold: #d5a84d;
--coral: #d77861;
--blue: #547e9a;
```

### 17.3 Typografie

- Koppen: Playfair Display;
- interface en broodtekst: DM Sans;
- Arabische decoratieve tekst: Georgia als systeemfallback.

### 17.4 Breakpoints

#### Tot 820 px

- hero wordt één kolom;
- quizonderdelen worden één kolom;
- antwoordopties worden onder elkaar gezet.

#### Tot 560 px

- compactere header;
- kleinere marges;
- knoppen vullen de breedte;
- lobbydelen stapelen;
- kleinere vraagtypografie;
- podium wordt compacter.

### 17.5 Reeds gecontroleerd

De MVP is handmatig gecontroleerd op:

- desktopweergave;
- mobiele breedte van 390 px;
- geen horizontale overflow bij 390 px;
- antwoordweergave;
- bronkaart;
- tussenstand.

### 17.6 Externe fontafhankelijkheid

Zonder netwerk vallen fonts terug op systeemfonts.

Voor productie kan men:

- fonts zelf hosten;
- correcte fontlicenties controleren;
- `font-display` en preloading optimaliseren;
- afhankelijkheid van Google verminderen.

---

## 18. Lokaal ontwikkelen en starten

### 18.1 Vereisten

- Node.js 20 of nieuwer;
- npm;
- moderne browser.

### 18.2 Installeren

Er zijn momenteel geen externe dependencies. Een `npm install` is daardoor niet noodzakelijk, maar kan zonder problemen worden uitgevoerd.

### 18.3 Starten

```bash
npm start
```

Open:

```text
http://127.0.0.1:4173
```

### 18.4 Ontwikkelmodus

```bash
npm run dev
```

De server wordt opnieuw gestart wanneer bestanden wijzigen.

De browser heeft geen hot module reload; ververs de pagina handmatig.

### 18.5 Andere poort

```bash
PORT=3000 npm start
```

### 18.6 Luisteren op alle interfaces

Bijvoorbeeld in een container:

```bash
HOST=0.0.0.0 PORT=4173 npm start
```

Doe dit alleen in een passend beveiligde omgeving.

### 18.7 Snelle syntaxcontrole

```bash
node --check server.js
node --check public/app.js
```

---

## 19. Teststrategie en handmatige acceptatietests

### 19.1 Huidige testsituatie

Er is nog geen geautomatiseerd testframework geconfigureerd.

Wel zijn reeds handmatig gecontroleerd:

- app start;
- landingspagina rendert;
- kamer aanmaken;
- lobby tonen;
- quiz starten;
- juist antwoord indienen;
- automatische reveal bij één speler;
- uitleg en bron tonen;
- score bijwerken;
- mobiele layout.

### 19.2 Minimale acceptatietest: hostflow

1. Start de server.
2. Open de homepagina.
3. Klik “Maak een quiz”.
4. Vul een geldige nickname in.
5. Maak de kamer.
6. Controleer:
   - code bevat zes tekens;
   - hostlabel is zichtbaar;
   - er zijn drie lege slots.
7. Kies een ander niveau en onderwerp.
8. Start de quiz.
9. Geef antwoord.
10. Controleer:
    - knoppen worden geblokkeerd;
    - antwoord wordt onthuld;
    - uitleg en bron verschijnen;
    - score verandert bij een juist antwoord.
11. Doorloop alle vragen.
12. Controleer eindstand en podium.

### 19.3 Minimale acceptatietest: multiplayer

1. Maak een kamer in browser A.
2. Kopieer de deel-URL.
3. Open de URL in browser B of een privésessie.
4. Neem deel met een andere nickname.
5. Controleer in beide browsers dat twee spelers verschijnen.
6. Probeer dezelfde nickname opnieuw; verwacht fout.
7. Voeg speler drie en vier toe.
8. Probeer speler vijf toe te voegen; verwacht “kamer vol”.
9. Start de quiz.
10. Laat spelers in verschillende volgorde antwoorden.
11. Controleer:
    - teller geantwoord wordt bijgewerkt;
    - reveal pas automatisch komt als iedereen antwoordde;
    - host eerder kan onthullen;
    - punten per speler verschillen door snelheid;
    - scoreboard in alle browsers gelijk wordt.

### 19.4 Negatieve tests

Test minstens:

- lege nickname;
- naam langer dan 24 tekens;
- naam met `<script>`;
- onbekende kamercode;
- deelnemen nadat quiz is gestart;
- direct opnieuw antwoorden via API;
- ongeldige keuze `-1`;
- ongeldige keuze `4`;
- niet-host probeert te starten;
- niet-host probeert instellingen te wijzigen;
- niet-host probeert volgende vraag;
- `next` vóór reveal;
- refresh tijdens lobby;
- refresh tijdens vraag;
- serverherstart tijdens quiz;
- verloren netwerkverbinding.

### 19.5 Aanbevolen geautomatiseerde testlagen

#### Unit tests

- codegeneratie;
- naamsanitisatie;
- vraagselectie;
- scoreformule;
- room view masking;
- fasevalidatie.

#### Integratietests

- alle API-endpoints;
- twee tot vier spelers;
- race rond gelijktijdige antwoorden;
- automatische reveal;
- kamerschoonmaak.

#### End-to-endtests

Bijvoorbeeld met Playwright:

- host plus gast in twee browsercontexts;
- volledige ronde;
- responsive checks;
- sessieherstel;
- foutmeldingen.

### 19.6 Aanbevolen tooling

Mogelijke keuzes:

- Node’s ingebouwde test runner;
- Vitest;
- Jest;
- Supertest als Express later wordt gebruikt;
- Playwright voor browserflows;
- axe-core voor toegankelijkheid.

---

## 20. Deployment naar productie

### 20.1 Huidige deploybaarheid

De applicatie kan als één Node-proces worden gehost op onder andere:

- Render;
- Railway;
- Fly.io;
- een VPS;
- een Dockerplatform;
- een traditionele Node-host.

### 20.2 Essentiële omgevingsvariabelen

```text
HOST=0.0.0.0
PORT=<door platform verstrekte poort>
```

### 20.3 Huidige belangrijke beperking

Omdat kamers in geheugen staan:

- deploymentrestarts verwijderen alle kamers;
- autoscaling naar meerdere instances breekt kamersynchronisatie;
- rolling deploys verbreken actieve quizzen;
- een crash beëindigt iedere sessie.

### 20.4 Minimale tijdelijke MVP-deployment

Voor een beperkte proef:

- gebruik exact één serverinstance;
- schakel autoscaling uit;
- communiceer dat actieve kamers tijdelijk zijn;
- gebruik HTTPS;
- configureer health checks;
- verzamel serverlogs;
- stel redelijke requestlimieten in via reverse proxy.

### 20.5 Aanbevolen productie-deployment

- statische frontend via CDN;
- API als schaalbare dienst;
- PostgreSQL voor persistentie;
- Redis of realtime-provider voor live kamers;
- WebSocketondersteuning;
- centrale logging;
- foutmonitoring;
- rate limiting;
- back-ups;
- aparte stagingomgeving.

### 20.6 Domein en deel-URL

De frontend bouwt de deel-URL uit:

```js
location.origin + location.pathname + "?room=" + code
```

Bij een correct publiek domein werkt dit automatisch.

Let bij reverse proxies op:

- juiste origin;
- HTTPS-redirect;
- forwarded headers;
- geen ongewenste subpaden.

### 20.7 Dockeradvies

Een toekomstige Dockerfile kan:

- een officiële Node LTS-image gebruiken;
- alleen projectbestanden kopiëren;
- een niet-rootgebruiker gebruiken;
- `HOST=0.0.0.0` instellen;
- poort documenteren;
- healthcheck toevoegen.

---

## 21. Beveiliging, privacy en misbruikpreventie

### 21.1 Huidig beveiligingsniveau

Passend voor een lokaal prototype, niet voldoende voor een grote publieke productieomgeving.

### 21.2 Authenticatie

Er is geen gebruikersauthenticatie.

Het `playerId` fungeert als bearer token:

- wie het kent kan als die speler handelen;
- het staat in requestbody of queryparameter;
- er is geen vervaldatum of rotatie;
- er is geen cryptografische kamerautorisatie naast willekeur.

### 21.3 Hostautorisatie

Een actie is toegestaan wanneer:

```js
room.hostId === data.playerId
```

Dit is server-side en daarmee beter dan alleen frontendverbergen, maar vereist bescherming van het speler-ID.

### 21.4 Kamercode niet als geheim beschouwen

Een kamercode is deelbaar en relatief kort. Deze mag niet worden gezien als sterke authenticatie.

Productieadvies:

- gebruik een apart lang sessietoken;
- sla alleen een hash van gevoelige tokens op;
- gebruik veilige cookies of Authorization headers;
- roteer tokens;
- voeg reconnecttokens toe.

### 21.5 Rate limiting

Ontbreekt momenteel.

Nodig voor:

- kamercreatie;
- joinpogingen;
- antwoordrequests;
- code-enumeratie;
- misbruik van polling.

### 21.6 Inputvalidatie

Huidig:

- minimale nicknamevalidatie;
- geldige antwoordindex;
- allowlist voor niveau en onderwerp.

Aanbevolen:

- schema-validatie;
- Unicode-normalisatie;
- controle op alleen toegestane lengte en tekencategorieën;
- verboden woorden/moderatie indien publiek;
- maximum aantal requests per IP, kamer en token.

### 21.7 Security headers

De server stelt momenteel geen aanvullende securityheaders in.

Voeg minstens toe:

- Content-Security-Policy;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- Strict-Transport-Security op HTTPS;
- framebeleid via CSP.

### 21.8 Content Security Policy

Let erop dat de huidige app:

- Google Fonts laadt;
- inline `style` gebruikt bij enkele elementen;
- dynamisch `innerHTML` gebruikt.

Een strikte CSP vereist aanpassingen:

- inline stijlen verwijderen;
- fonts zelf hosten of domeinen toestaan;
- scripts uitsluitend uit eigen origin laden.

### 21.9 Privacy

De MVP verzamelt alleen:

- gekozen nickname of kunya;
- antwoorden;
- scores;
- tijdelijke sessie-identificatie;
- technische requestinformatie die de hostingprovider mogelijk logt.

Er is geen account, e-mail of profiel.

Voor productie:

- stel een privacyverklaring op;
- bepaal bewaartermijnen;
- minimaliseer IP-logging;
- geef verwijderingsbeleid;
- behandel kindergebruik zorgvuldig;
- vermijd advertentietracking;
- documenteer externe dienstverleners.

### 21.10 Cheats en manipulatie

Huidige bescherming:

- juiste antwoord wordt vóór reveal niet meegestuurd;
- score wordt server-side berekend;
- dubbel antwoorden wordt server-side geweigerd.

Huidige zwaktes:

- speler-ID kan worden gestolen of gedeeld;
- geen request signing;
- host kan vroeg onthullen;
- geen bescherming tegen bots;
- timing is gebaseerd op serverontvangst, maar netwerklatency beïnvloedt score;
- geen anti-enumeratie voor kamers;
- geen auditlog.

---

## 22. Toegankelijkheid

### 22.1 Huidige positieve punten

- semantische knoppen;
- labels bij invoervelden;
- hoofdcontainer met `aria-live="polite"`;
- toast met `role="status"`;
- grote klikvlakken;
- duidelijke tekstlabels naast kleur;
- responsieve layout;
- zichtbare focusstijl voor invoervelden.

### 22.2 Verbeterpunten

- focus wordt na volledige schermrender niet actief beheerd;
- knopfocusstijl kan explicieter;
- dynamische fasewissels moeten met screenreaders worden getest;
- kleurcontrast moet formeel worden gemeten;
- podiumvolgorde moet semantisch duidelijk blijven;
- disabled antwoordknoppen kunnen uitleg voor screenreaders nodig hebben;
- countdown, indien toegevoegd, mag niet storend worden aangekondigd;
- animaties moeten `prefers-reduced-motion` respecteren;
- externe bronlinks moeten hun externe karakter toegankelijk aankondigen.

### 22.3 Taal

Voeg aan individuele Arabische of getranslitereerde passages waar nuttig `lang`-attributen toe.

### 22.4 Toetsenbordtest

Controleer:

- volledige flow zonder muis;
- logische tabvolgorde;
- Enter voor formulieren;
- zichtbare focus;
- geen focusverlies na render.

---

## 23. Performance en schaalbaarheid

### 23.1 Huidige schaal

Voor vier spelers en een beperkt aantal kamers is de huidige oplossing licht.

### 23.2 Requestvolume door polling

Elke actieve speler doet ongeveer:

```text
60 / 1,1 ≈ 54,5 requests per minuut
```

Een volle kamer met vier spelers:

```text
ongeveer 218 GET-requests per minuut
```

Honderd volle kamers:

```text
ongeveer 21.800 GET-requests per minuut
```

Hieruit blijkt waarom polling niet de gewenste eindarchitectuur is.

### 23.3 Geheugen

Iedere kamer bewaart:

- alle spelers;
- alle antwoorden;
- vijf volledige vraagobjecten;
- tijdelijke metadata.

Bij de huidige aantallen is dit klein, maar zonder harde kamerlimiet kan kamercreatie geheugenmisbruik veroorzaken.

### 23.4 Frontendperformance

De frontend:

- heeft geen bundler;
- bestaat uit kleine bestanden;
- rendert per statuswijziging de relevante hoofdweergave opnieuw;
- gebruikt geen zware bibliotheken.

Dit is snel voor de huidige omvang.

### 23.5 Verbeteringen bij groei

- eventgestuurde realtime updates;
- database-indexen;
- CDN voor statische assets;
- server-side caching van vraagcatalogus;
- paginering in adminomgeving;
- gescheiden read/write-modellen indien nodig;
- observability voor latency en foutpercentage.

---

## 24. Bekende beperkingen en technische schuld

Deze sectie is essentieel bij overname.

### 24.1 Geen persistentie

Alle kamers verdwijnen bij serverherstart.

### 24.2 Eén instance vereist

Meerdere Node-processen hebben ieder hun eigen `rooms`-Map.

### 24.3 Geen echte realtimeverbinding

Updates arriveren via polling met vertraging.

### 24.4 Vragen zijn hardcoded

Iedere inhoudswijziging vereist een codewijziging en herdeployment.

### 24.5 Geen adminomgeving

Er is geen interface voor:

- vraag toevoegen;
- bron controleren;
- vraag goedkeuren;
- onderwerp beheren;
- statistieken bekijken.

### 24.6 Vraagselectie is een fallbackmix

Gekozen onderwerp of niveau wordt niet altijd strikt gehandhaafd als er onvoldoende exacte vragen zijn.

### 24.7 Herstartendpoint onvoldoende begrensd

`POST /start` controleert niet expliciet of de kamer in de lobby is.

### 24.8 Hostuitval

Als de host het tabblad sluit:

- blijft host-ID bestaan;
- wordt geen nieuwe host toegewezen;
- andere spelers kunnen niet doorgaan;
- er is geen presence- of disconnectdetectie.

### 24.9 Speleruitval blokkeert automatische reveal

Een speler die na start verdwijnt, blijft onderdeel van `room.players`.

Gevolg:

- `every()` wordt niet waar zolang die speler niet antwoordt;
- de host moet handmatig onthullen.

### 24.10 Geen speler verlaten of verwijderen

Er is geen:

- leave-endpoint;
- kickfunctie;
- banfunctie;
- hostoverdracht.

### 24.11 Geen antwoorddeadline

Een vraag kan onbeperkt open blijven.

### 24.12 Timing en eerlijkheid

Netwerklatency telt mee in de verstreken servertijd. Spelers met slechtere verbinding kunnen iets minder bonus krijgen.

### 24.13 Sessies zijn tabgebonden

`sessionStorage` is beperkt tot de browsersessie/tabcontext.

### 24.14 Geen offline- of reconnectscherm

Bij pollfout stopt polling en verschijnt alleen een toast.

### 24.15 Configuratiewijziging niet direct zichtbaar bij gasten

De updatevergelijking kijkt niet naar niveau en onderwerp.

### 24.16 Onbekende assets krijgen mogelijk HTML

De statische fallback stuurt bij ieder ontbrekend bestand `index.html`.

### 24.17 Beperkte HTTP-afhandeling

Geen:

- gzip/brotli;
- ETags;
- assetcache;
- uitgebreide MIME-map;
- HEAD-afhandeling;
- OPTIONS/CORS-beleid.

### 24.18 Geen formele logging

Alleen onverwachte fouten gaan via `console.error`.

### 24.19 Geen monitoring

Er zijn geen:

- health endpoint;
- metrics;
- traces;
- alerts;
- uptimechecks.

### 24.20 Geen formeel inhoudelijk reviewbewijs

Bronlinks zijn aanwezig, maar er is geen opgeslagen reviewstatus of redacteur.

### 24.21 Geen meertaligheid

Alle UI-tekst staat direct in JavaScript en HTML.

### 24.22 Geen geautomatiseerde tests

Regressies moeten momenteel handmatig worden gevonden.

---

## 25. Aanbevolen productiearchitectuur

### 25.1 Logische lagen

```text
Frontend
  ├── publieke quizinterface
  └── beveiligde admininterface

API
  ├── room commands
  ├── question catalog
  ├── authentication
  └── admin/content workflow

Realtime gateway
  ├── room presence
  ├── broadcasts
  └── reconnect

Data
  ├── PostgreSQL
  ├── Redis/realtime state
  └── object storage indien media wordt toegevoegd
```

### 25.2 Mogelijke pragmatische stack

Een logische, niet verplichte keuze:

- Next.js of een andere moderne webstack;
- TypeScript;
- PostgreSQL;
- Supabase voor database/auth/realtime;
- schema-validatie met Zod;
- Playwright;
- Sentry of vergelijkbare foutmonitoring;
- hosting op Vercel plus Supabase, of alles op een containerplatform.

Alternatief:

- behoud vanilla frontend;
- Express/Fastify backend;
- PostgreSQL;
- Socket.IO;
- Redis.

### 25.3 Domeinmodules

Splits minimaal:

```text
rooms/
players/
questions/
scoring/
content-review/
realtime/
auth/
admin/
```

### 25.4 Servercommando’s

Maak expliciete domeinfuncties:

```text
createRoom
joinRoom
updateRoomConfig
startQuiz
submitAnswer
revealAnswer
advanceQuestion
finishQuiz
leaveRoom
transferHost
```

Iedere functie:

- valideert input;
- controleert autorisatie;
- controleert fase;
- muteert atomair;
- schrijft auditinformatie;
- publiceert een event.

---

## 26. Aanbevolen databaseontwerp

Onderstaand ontwerp is een voorstel, geen huidige implementatie.

### 26.1 `questions`

```text
id                  uuid primary key
slug                text unique
status              enum
level               enum
topic_id            uuid
question_text_nl    text
explanation_nl      text
correct_option      smallint
source_label        text
source_url          text
source_type         enum
hadith_grade        text nullable
reviewed_by         uuid nullable
reviewed_at         timestamptz nullable
created_at          timestamptz
updated_at          timestamptz
version             integer
```

### 26.2 `question_options`

```text
id                  uuid primary key
question_id         uuid foreign key
position            smallint
option_text_nl      text
```

### 26.3 `topics`

```text
id                  uuid primary key
slug                text unique
label_nl            text
description_nl      text
active              boolean
```

### 26.4 `rooms`

```text
id                  uuid primary key
code                varchar(6) unique
host_player_id      uuid nullable
phase               enum
level               enum
topic_id            uuid nullable
current_question    integer
created_at          timestamptz
updated_at          timestamptz
expires_at          timestamptz
```

### 26.5 `room_questions`

```text
room_id             uuid
question_id         uuid
position            integer
started_at          timestamptz nullable
revealed_at         timestamptz nullable
```

Belangrijk: sla de geselecteerde vraagset en zo nodig een inhoudssnapshot op, zodat latere wijzigingen aan een vraag geen lopende of historische ronde veranderen.

### 26.6 `players`

```text
id                  uuid primary key
room_id             uuid
nickname            varchar(24)
session_token_hash  text
score               integer
joined_at           timestamptz
last_seen_at        timestamptz
left_at             timestamptz nullable
is_connected        boolean
```

### 26.7 `answers`

```text
id                  uuid primary key
room_id             uuid
player_id           uuid
question_id         uuid
choice              smallint
is_correct          boolean
points              integer
response_ms         integer
submitted_at        timestamptz
```

Unieke constraint:

```text
(player_id, question_id)
```

### 26.8 `content_reviews`

```text
id                  uuid primary key
question_id         uuid
reviewer_id         uuid
decision            enum
notes               text
reviewed_at         timestamptz
question_version    integer
```

### 26.9 Transacties

Antwoord opslaan en score verhogen moet atomair gebeuren.

Voorkom:

- dubbel antwoord door gelijktijdige requests;
- score-update zonder opgeslagen antwoord;
- reveal voordat het antwoord is gecommit.

---

## 27. Roadmap

### Fase 0 — huidige MVP

- [x] Landingspagina
- [x] Kamer maken
- [x] Deellink en code
- [x] Maximaal vier spelers
- [x] Nickname/kunya
- [x] Niveaukeuze
- [x] Onderwerpkeuze
- [x] Vijf vragen per ronde
- [x] Server-side scoring
- [x] Snelheidsbonus
- [x] Uitleg en bron
- [x] Tussenstand
- [x] Eindpodium
- [x] Responsive interface

### Fase 1 — MVP hardening

- [ ] Code opdelen in modules
- [ ] TypeScript of JSDoc-types
- [ ] Expliciete fasevalidatie
- [ ] Unit- en API-tests
- [ ] Health endpoint
- [ ] Gestructureerde logging
- [ ] Security headers
- [ ] Rate limiting
- [ ] Betere reconnectmelding
- [ ] Clipboardfallback
- [ ] Strikte vraagselectie
- [ ] Vragen inhoudelijk laten reviewen
- [ ] Zelf gehoste fonts

### Fase 2 — persistente pilot

- [ ] PostgreSQL
- [ ] Persistent rooms
- [ ] Reconnecttokens
- [ ] Presence
- [ ] Hostoverdracht
- [ ] Speler verlaten/kicken
- [ ] Realtime via WebSockets of beheerde dienst
- [ ] Staging- en productieomgeving
- [ ] Foutmonitoring
- [ ] Privacyverklaring
- [ ] Back-ups

### Fase 3 — contentplatform

- [ ] Adminlogin
- [ ] Vraagbeheer
- [ ] Reviewworkflow
- [ ] Versiebeheer van vragen
- [ ] Bronmetadata
- [ ] Import/export
- [ ] Zoek- en filterfuncties
- [ ] Vragenpakketten
- [ ] Meer onderwerpen
- [ ] Meer talen

### Fase 4 — rijkere spelervaring

- [ ] Zichtbare timer
- [ ] Instelbare vraagduur
- [ ] Afbeeldingsvragen
- [ ] Audiovragen, bijvoorbeeld recitatieherkenning
- [ ] Teammodus
- [ ] Solo-oefenmodus
- [ ] Dagelijkse quiz
- [ ] Badges of leerdoelen
- [ ] Herhaal fout beantwoorde vragen
- [ ] Moeilijkheid automatisch aanpassen

### Fase 5 — organisaties

- [ ] Docentdashboard
- [ ] Klassen of groepen
- [ ] Privévragenpakketten
- [ ] Resultaten per sessie
- [ ] Anonieme leeranalytics
- [ ] Organisatiebeheer
- [ ] Moderatie en rollen

---

## 28. Definitie van gereed voor een productieversie

Een publieke productieversie is pas gereed wanneer minimaal:

### Inhoud

- iedere actieve vraag inhoudelijk is beoordeeld;
- bronverwijzingen zijn gecontroleerd;
- complexe meningsverschillen correct worden behandeld;
- transliteratie en spelling consistent zijn;
- reviewmetadata bewaard wordt.

### Techniek

- kamers persistent of betrouwbaar herstelbaar zijn;
- realtime synchronisatie robuust is;
- alle kritieke domeinregels tests hebben;
- gelijktijdige antwoorden veilig worden verwerkt;
- reconnect werkt;
- hostuitval wordt afgehandeld;
- monitoring en logging actief zijn.

### Security

- sessietokens veilig zijn;
- rate limiting actief is;
- security headers zijn ingesteld;
- input schema-gevalideerd wordt;
- secrets veilig worden beheerd;
- dependency- en kwetsbaarheidsscans bestaan.

### Privacy

- gegevensminimalisatie is vastgelegd;
- bewaartermijnen zijn ingesteld;
- privacyverklaring beschikbaar is;
- kindergebruik is beoordeeld;
- externe verwerkers zijn gedocumenteerd.

### UX en toegankelijkheid

- mobiel en desktop zijn getest;
- keyboardflow werkt;
- contrast voldoet;
- screenreaderflow getest is;
- fout- en reconnectsituaties duidelijk zijn;
- trage verbindingen redelijk worden behandeld.

### Operations

- staging bestaat;
- deployment reproduceerbaar is;
- back-ups getest zijn;
- rollbackprocedure bestaat;
- health checks en alerts actief zijn;
- verantwoordelijke eigenaar bekend is.

---

## 29. Onderhoudsprocedures

### 29.1 Nieuwe vraag toevoegen in de huidige MVP

1. Open `server.js`.
2. Zoek de array `questions`.
3. Voeg een object met alle vereiste velden toe.
4. Gebruik een unieke ID volgens bestaand patroon.
5. Controleer dat `correct` nulgebaseerd is.
6. Controleer dat exact vier opties bestaan.
7. Open bron-URL handmatig.
8. Laat inhoud onafhankelijk controleren.
9. Voer syntaxcontrole uit.
10. Start app en test de relevante niveau-/onderwerpcombinatie.

### 29.2 ID-conventie

Huidig patroon:

```text
onderwerp-niveau-volgnummer
```

Voorbeelden:

```text
aq-b-1
qu-i-1
fi-a-1
se-b-2
ad-i-1
```

Afkortingen:

- `aq` = aqidah;
- `qu` = quran;
- `fi` = worship/fiqh-gerelateerd;
- `se` = seerah;
- `ad` = adab;
- `b` = beginner;
- `i` = intermediate;
- `a` = advanced.

### 29.3 Nieuw onderwerp toevoegen

Wijzig minimaal:

1. `topicNames` in `server.js`;
2. `topics` in `public/app.js`;
3. vragen met de nieuwe interne waarde;
4. eventueel styling of marketingtekst;
5. dit document;
6. tests.

### 29.4 Nieuw niveau toevoegen

Wijzig minimaal:

1. allowlist in configendpoint;
2. `levels` in frontend;
3. vraagdata;
4. vraagselectie;
5. documentatie en tests.

### 29.5 Maximum spelers wijzigen

De waarde `4` is momenteel niet als centrale configuratieconstant gedefinieerd.

Zoek en wijzig:

- backendcontrole `room.players.length >= 4`;
- foutmelding;
- lobbyslots;
- marketingtekst;
- documentatie;
- tests;
- mogelijk podium- en layoutaannames.

Aanbevolen refactor:

```js
const MAX_PLAYERS = 4;
```

en deze waarde waar passend via serverconfig/clientresponse gebruiken.

### 29.6 Scoreformule wijzigen

Pas scoreberekening server-side aan en documenteer:

- basispunten;
- maximale bonus;
- vervalsnelheid;
- timeout;
- tie-breaker.

Voeg unit tests toe vóór wijziging.

### 29.7 Releasecontrole

Voor iedere release:

1. syntaxcontrole;
2. tests;
3. handmatige multiplayerflow;
4. mobiele check;
5. bronlinks controleren;
6. securityscan;
7. changelog;
8. deployment naar staging;
9. smoke test;
10. productie-uitrol;
11. monitoring controleren.

---

## 30. Beslislogboek en uitgangspunten

### 30.1 Maximaal vier spelers

Gekozen als overzichtelijke beginomvang voor familie en kleine groepen.

### 30.2 Geen account nodig

Vermindert instapfrictie en persoonsgegevens.

### 30.3 Host bepaalt tempo

De host start, onthult indien nodig en gaat naar de volgende vraag.

### 30.4 Bron na antwoord

Voorkomt dat broninformatie het antwoord vooraf verklapt en maakt ieder quizmoment ook een leermoment.

### 30.5 Score op juistheid én snelheid

Geeft speelse spanning, terwijl een juist laat antwoord nog steeds substantiële punten krijgt.

### 30.6 Dependency-vrije MVP

Gekozen om snel een complete werkende ervaring te kunnen demonstreren en overdragen.

### 30.7 Polling in plaats van WebSockets

Gekozen voor implementatiesnelheid en eenvoud bij een maximum van vier spelers.

### 30.8 Kamers tijdelijk in geheugen

Gekozen voor prototypefase. Niet bedoeld als eindarchitectuur.

### 30.9 Warme, niet-bestraffende feedback

Past bij het educatieve doel en de gewenste adab.

---

## 31. Snelle overnamechecklist

Een nieuwe ontwikkelaar kan onderstaande volgorde gebruiken.

### Eerste uur

- [ ] Lees dit document volledig.
- [ ] Start de app lokaal.
- [ ] Maak een kamer.
- [ ] Open een tweede browsersessie.
- [ ] Speel één volledige ronde.
- [ ] Bekijk `server.js`.
- [ ] Bekijk `public/app.js`.
- [ ] Bekijk `public/styles.css`.

### Eerste dag

- [ ] Maak een architectuurdiagram van de gewenste productiefase.
- [ ] Bevestig hosting- en databasekeuze.
- [ ] Bespreek inhoudelijk reviewproces.
- [ ] Zet repository en branchestrategie vast.
- [ ] Voeg linting, formattering en tests toe.
- [ ] Leg environmentconfiguratie vast.
- [ ] Registreer bekende technische schuld als issues.

### Eerste sprint

- [ ] Splits servercode op.
- [ ] Centraliseer configuratie.
- [ ] Voeg expliciete statusvalidatie toe.
- [ ] Voeg API-tests toe.
- [ ] Implementeer databasebasis.
- [ ] Ontwerp reconnect en hostoverdracht.
- [ ] Ontwerp contentmodel en reviewstatus.
- [ ] Maak stagingdeployment.

### Voor publieke pilot

- [ ] Alle vragen inhoudelijk goedgekeurd.
- [ ] Privacy en security beoordeeld.
- [ ] Rate limiting actief.
- [ ] Logging en monitoring actief.
- [ ] Mobiele multiplayer getest.
- [ ] Herstart en reconnect getest.
- [ ] Misbruikscenario’s getest.
- [ ] Back-up- en rollbackproces getest.

---

## 32. Woordenlijst

| Term | Betekenis binnen dit project |
|---|---|
| Host | Speler die de kamer heeft gemaakt en de quiz bestuurt |
| Kamer | Tijdelijke multiplayercontext met code, spelers en quizstatus |
| Kamercode | Zes tekens waarmee een speler een kamer vindt |
| Kunya | Respectvolle aanspreeknaam, bijvoorbeeld Abu of Umm gevolgd door een naam |
| Reveal | Fase waarin het juiste antwoord, uitleg en bron zichtbaar zijn |
| Polling | Periodiek ophalen van de actuele serverstatus |
| Room view | Beperkte, voor de client veilige representatie van een kamer |
| MVP | Minimum Viable Product; kleinste werkende productversie |
| ‘Aqīdah | Islamitische geloofsleer |
| Sīrah | Levensgeschiedenis van de Profeet Muhammad ﷺ |
| Adab | Goede manieren, omgangsvormen en karakter |
| Ṣaḥīḥ | Authentiek/betrouwbaar in hadithterminologie, afhankelijk van classificatie en context |
| Vrome voorgangers | Vroege generaties moslims; brongebruik vereist exacte en controleerbare verwijzing |

---

## Slotnotitie voor de overnemende ontwikkelaar

Noor Quiz heeft bewust een kleine technische basis, maar een serieuze inhoudelijke ambitie. De huidige code bewijst dat de kernervaring werkt: mensen kunnen samen een kamer delen, antwoorden, leren van bronnen en een score bijhouden.

De belangrijkste opdracht bij verdere ontwikkeling is niet simpelweg “meer features toevoegen”. De drie centrale verantwoordelijkheden zijn:

1. **inhoudelijke betrouwbaarheid bewaken;**
2. **multiplayer technisch betrouwbaar maken;**
3. **de warme, eenvoudige gebruikerservaring behouden.**

Als een technische keuze één van deze drie punten aantast, moet die keuze opnieuw worden beoordeeld.

De code is klein genoeg om snel te begrijpen. De volgende volwassenheidsstap is het aanbrengen van duidelijke domeinmodules, persistente opslag, realtime events, geautomatiseerde tests en een formeel inhoudelijk reviewproces.

