# Noor Quiz lokaal spelen

Noor Quiz draait volledig op één laptop. Er is geen abonnement, cloudaccount of betaling nodig.

## Starten

1. Open een terminal in de projectmap.
2. Voer uit:

```bash
npm start
```

3. Open op de laptop:

```text
http://127.0.0.1:4173
```

## Familie en vrienden laten deelnemen

Na het starten toont de terminal een tweede adres, bijvoorbeeld:

```text
http://192.168.1.25:4173
```

De lobby gebruikt dit adres automatisch in de deellink.

Voor deelname:

- de laptop en telefoons moeten met hetzelfde wifi-netwerk verbonden zijn;
- de terminal moet open blijven;
- de laptop mag niet in slaapstand gaan;
- deelnemers openen de link en kiezen een nickname of kunya.

## Als een telefoon de app niet kan openen

Controleer:

1. Zit de telefoon echt op dezelfde wifi en niet alleen op mobiel internet?
2. Staat de server nog aan?
3. Is het lokale IP-adres sinds de vorige keer veranderd?
4. Vraagt macOS toestemming voor inkomende netwerkverbindingen? Sta dit toe voor Node.
5. Heeft het wifi-netwerk “client isolation” ingeschakeld? Een gastnetwerk blokkeert apparaten vaak onderling.

## Privé en offline

- Er worden geen accounts, e-mails of analytics gebruikt.
- Spelersgegevens blijven tijdelijk in het geheugen van de laptop.
- Na stoppen van de server verdwijnen actieve kamers.
- De ingebouwde uitleg werkt zonder internet.
- Externe Qur’an- en hadithlinks vereisen internet.

## Stoppen

Ga naar de terminal waarin Noor Quiz draait en druk:

```text
Control + C
```

## Inhoudelijke waarschuwing

De huidige vragen zijn prototype-inhoud met bronverwijzingen. Laat de vragen voor uitgebreider gebruik inhoudelijk controleren door een geschikte islamitische reviewer.
