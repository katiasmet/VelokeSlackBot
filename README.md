# Antwaarps Veloke Slackbot
Een prachtige slackbot zodat je nooit meer voor een leeg rek velokes komt te staan.

# Settings
Maak een .env file aan waarin je enkele zaken kunt instellen. Er is een .env.sample toegevoegd met voorbeeldsettings.

### BOT_API_KEY
Api key die je kunt aanmaken op https://yourchannel.slack.com/apps/new/bot

### MAIN_CHANNEL
Jouw basis slack channel, waarin je op een bepaald moment een update kunt geven

### BASE_CAMP
Naam van je bedrijf / hoofdplaats

### BASE_STATIONS
Stations rond je basecamp, gescheiden door een komma en spatie
bv. Meir, Astrid, Groenplaats

### AUTO_TIMER
Instellen van een timer op een bepaald uur, bepaalde dag. Syntax: https://github.com/kelektiv/node-cron
vb. 00 45 17 * * 1-5 : Elke werkdag om 17:45

# Commando's
### Direct message
veloke + adres of naam van het station bv. veloke groenplaats
veloke + basecamp bv. veloke Zara

### Channel message
Mention de bot bv. @veloke veloke groenplaats

# Custom replies
Replies kun je aanpassen in ./src/settings/replies.js

# Deployment
Bot moet op een nodeserver draaien.
