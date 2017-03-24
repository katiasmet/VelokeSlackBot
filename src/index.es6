//D4NP461K6

import Botkit from 'botkit';
import fetch from 'node-fetch';
import {uniq, toLower, remove, isEmpty} from 'lodash';
import {CronJob} from 'cron';

import {REPLY_hello,
        REPLY_hello_user,
        REPLY_full,
        REPLY_almost_empty,
        REPLY_empty,
        REPLY_no_stations,
        REPLY_more_stations} from './settings/replies';

const controller = Botkit.slackbot({
    debug: true,
});

const bot = controller.spawn({
    token: process.env.BOT_API_KEY
}).startRTM();

let stations, reply;

controller.hears(
  ['hello', 'hi', 'hallo', 'yo', 'ieps', 'hoi', 'hey', 'allo'],
  'direct_message,direct_mention,mention',
  (bot, message) => {
    controller.storage.users.get(message.user, function(err, user) {
      if (user && user.name) { bot.reply(message, REPLY_hello_user(user.name));
      } else { bot.reply(message, REPLY_hello); }
    });
  }
);

controller.hears(
  ['shutdown'],
  'direct_message,direct_mention,mention',
  (bot, message) => {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Ben je zeker dat je me wilt afsluiten?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Salukes!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Fiew!*');
                convo.next();
            }
        }
        ]);
    });
  }
);

controller.hears(
  ['velo'],
  'direct_message,direct_mention,mention',
  (bot, message) => {
    getVelokes(message);
  }
);

/* Handle Velokes Replies */
const getVelokes = (message, automatic = false) => {
  fetch('https://www.velo-antwerpen.be/availability_map/getJsonObject')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      stations = json;

      let checks = handleChecks(message.text);
      checks = remove(checks, function(check) {
        return check !== 'velo' || check !== 'veloke';
      });

      stations = handleSelectStations(checks);
      handleStations(message, automatic);
    });
};

const handleChecks = (input) => {


  if(input.includes(process.env.BASE_CAMP)) return process.env.BASE_STATIONS.split(', '); //check if the basecamp is called
  else return input.split(' ');
}

const handleSelectStations = (checks) => {

  const selectedStations = [];

  stations.forEach(station => {
    checks.forEach(check => {

      check = toLower(check);
      const address = toLower(station.address);
      const name = toLower(station.name);
      if(address.includes(check) || name.includes(check)) selectedStations.push(station);

    });
  });

  return uniq(selectedStations);
};

/* check if there are multiple stations, 1 station or no stations */
const handleStations = (message, automatic) => {

  if(!isEmpty(stations)) {
    if(stations.length > 0) {
      handleReplies(stations, message, true, automatic);
    } else {
      handleReplies(stations, message, automatic);
    }
  } else {
    bot.reply(message, REPLY_no_stations);
  }

};

/* handle answers */
const handleReplies = (station, message, multipleStations = false, automatic) => {
  //automatic happens when a cron job is set

  if(multipleStations) {

    const stationsReply = handleMultipleStationsReply();
    if(automatic) reply = stationsReply;
    else bot.reply(message, stationsReply);

  } else if(station.bikes > 0) {

    if(station.bikes < 5) {

      if(automatic) reply = REPLY_almost_empty(station.bikes, station.address);
      else bot.reply(message, REPLY_almost_empty(station.bikes, station.address) );

    } else {

      if(automatic) reply = REPLY_full(station.bikes, station.address);
      else bot.reply(message, REPLY_full(station.bikes, station.address) );
    }

  } else {

    if(automatic) reply = REPLY_empty(station.address);
    else bot.reply(message, REPLY_empty(station.address) );
  }
};

const handleMultipleStationsReply = () => {
  const replies = [];
  stations.forEach(station => {
    replies.push(REPLY_more_stations(station.bikes, station.address));
  });

  return "".concat(...replies);
}

/* Cron Job */
const handleCronJob = () => {
  if(process.env.AUTO_TIMER) {

    const job = new CronJob({
      cronTime: process.env.AUTO_TIMER, //elke weekdag om 17:45
      onTick: function() {
        getVelokes({text: process.env.BASE_CAMP}, true)
        bot.say({
          text: reply,
          channel: process.env.MAIN_CHANNEL
        });
      },
      start: false,
      timeZone: 'Europe/Amsterdam'
    });

    job.start();

  }
}

handleCronJob();
