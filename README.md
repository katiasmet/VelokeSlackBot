# Antwaarps Veloke Slackbot :bike:
Een prachtige slackbot zodat je nooit meer voor een leeg rek velokes komt te staan.<br />

:full_moon: *In opdracht van www.lunargravity.be*

# Settings
Maak een .env file aan waarin je enkele zaken kunt instellen. Er is een .env.sample toegevoegd met voorbeeldsettings.

### BOT_API_KEY
Api key die je kunt aanmaken op https://yourchannel.slack.com/apps/new/bot

### MAIN_CHANNEL
:speech_balloon: Jouw basis slack channel, waarin je op een bepaald moment een update kunt geven

### BASE_CAMP
:office: Naam van je bedrijf / hoofdplaats

### BASE_STATIONS
:bike: Stations rond je basecamp, gescheiden door een komma en spatie <br />
bv. Meir, Astrid, Groenplaats

### AUTO_TIMER
:clock: Instellen van een timer op een bepaald uur, bepaalde dag. Syntax: https://github.com/kelektiv/node-cron <br />
vb. 00 45 17 * * 1-5 : Elke werkdag om 17:45

### AUTO_CHECKER
:clock: Instellen van een checker tussen een bepaald tijdstip. Als de base_stations leeg zijn, zal er automatisch een melding worden gegeven. Syntax: https://github.com/kelektiv/node-cron <br />
vb. 00 30-59 17 * * 1-5 : Elke werkdag tussen 17:30 en 17:59 om de minuut

# Commando's
### Direct message
veloke + adres of naam van het station bv. veloke groenplaats <br />
veloke + basecamp bv. veloke Zara

### Channel message
Mention de bot bv. @veloke veloke groenplaats

# Custom replies :lipstick:
Replies kun je aanpassen in ./src/settings/replies.js <br />
Drunk replies op vrijdag kun je aanpassen in ./src/settings/drunk_replies.js

# Deployment :rocket:
Bot moet op een nodeserver draaien. Om de bot op te starten en te laten runnen, kun je forever gebruiken. https://github.com/foreverjs/forever <br />
run het commando: `forever start server.js`
