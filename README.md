[README.md](https://github.com/user-attachments/files/29313940/README.md)
# Noor Quiz — local-first familie-editie

Een privé islamitische quiz voor maximaal vier spelers, met niveaus, onderwerpen, bronvermelding, timer en een live scoreboard. De app draait volledig op één laptop en heeft geen cloudaccount, abonnement of betaalde dienst nodig.

## Starten

```bash
npm start
```

Open daarna `http://127.0.0.1:4173`.

Bij het starten verschijnt ook een adres zoals:

```text
http://192.168.1.25:4173
```

Open dat adres op telefoons die met hetzelfde wifi-netwerk verbonden zijn. De lobby toont automatisch de juiste deelbare link.

## Wat werkt

- Kamer maken en via een URL of zescijferige code delen
- Maximaal vier spelers met nickname of kunya
- Host kiest niveau en onderwerp
- Instelbare rustige timer van 20, 30, 45 of 60 seconden
- Vijf vragen per ronde
- 103 vragen verdeeld over 13 specifieke onderwerpen en een gemengde ronde
- 11 lokale PDF-bronboeken met verwijzingen naar de gebruikte PDF-pagina
- Punten voor juistheid en snelheid
- Bron en uitleg na iedere vraag
- Live tussenstand en eindpodium
- Aantal juiste antwoorden in het eindresultaat
- Kamer verlaten en automatische hostoverdracht
- Automatische onthulling na het verlopen van de tijd
- Rematch met dezelfde groep
- Lokale verbindingsstatus en sessieherstel
- Mobiele en desktopweergave
- Geen externe fonts, accounts of analytics
- Basis securityheaders

## Belangrijk

- Laat de terminal en laptop aan zolang jullie spelen.
- Alle spelers moeten op hetzelfde lokale netwerk zitten.
- Kamers zijn tijdelijk en verdwijnen wanneer de server wordt gestopt.
- De externe bronlinks hebben internet nodig; de uitleg in de app zelf blijft beschikbaar.
- De ingebouwde vragen zijn prototype-inhoud. Laat vragen vóór breder gebruik inhoudelijk controleren door een geschikte islamitische reviewer.
- De nieuwe boekvragen zijn opnieuw geformuleerd op basis van de meegeleverde PDF's. Bij onderwerpen waar geleerden van inzicht kunnen verschillen, geeft de bronlink aan welke uitleg voor de vraag is gebruikt.

## Nieuwe brononderwerpen

- Tawḥīd en de drie fundamenten
- Īmān, Iḥsān en de geloofszuilen
- Het gebed volgens de Sunnah
- Wuḍūʾ en rituele reinheid
- Veelomvattende duʿā en adhkār
- Arabische woordenschat en Qurʾānlezen
- Voorwaarden van halal handel
- Kennis, handelen, daʿwah en geduld

## Gezondheidscontrole

De lokale serverstatus is beschikbaar op:

```text
http://127.0.0.1:4173/api/health
```
