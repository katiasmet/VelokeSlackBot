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

import {DRUNK_REPLY_hello,
        DRUNK_REPLY_hello_user,
        DRUNK_REPLY_full,
        DRUNK_REPLY_almost_empty,
        DRUNK_REPLY_empty,
        DRUNK_REPLY_no_stations,
        DRUNK_REPLY_more_stations} from './settings/drunk_replies';

const controller = Botkit.slackbot({
    debug: true,
});

const bot = controller.spawn({
    token: process.env.BOT_API_KEY
}).startRTM();

let stations, reply;
let drunkFriday = false;

controller.hears(
  ['hello', 'hi', 'hallo', 'yo', 'ieps', 'hoi', 'hey', 'allo'],
  'direct_message,direct_mention,mention',
  (bot, message) => {
    controller.storage.users.get(message.user, function(err, user) {
      if (user && user.name) {
        drunkFriday ? bot.reply(message, DRUNK_REPLY_hello_user(user.name)) : bot.reply(message, REPLY_hello_user(user.name));
      } else {
        drunkFriday ? bot.reply(message, DRUNK_REPLY_hello) : bot.reply(message, REPLY_hello);
      }
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
const getVelokes = (message, automatic = false, checkEmpty = false) => {

  fetch('https://www.velo-antwerpen.be/availability_map/getJsonObject')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      stations = json;

      let checks = handleChecks(message.text);
      checks = remove(checks, check => {
        return check !== 'velo' || check !== 'veloke';
      });

      stations = handleSelectStations(checks);
      handleStations(message, automatic, checkEmpty);
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
const handleStations = (message, automatic, checkEmpty) => {

  if(!isEmpty(stations)) {

    if(checkEmpty) { handleCheckStations(stations, message, automatic) } //handles function to check if a station is empty
    else if(stations.length > 1) { handleReplies(stations, message, true, automatic); }
    else { handleReplies(stations[0], message, automatic) }

  } else {
    drunkFriday ? bot.reply(message, DRUNK_REPLY_no_stations) : bot.reply(message, REPLY_no_stations);
  }

};

/* handle answers */
const handleReplies = (station, message, multipleStations = false, automatic) => {
  //automatic happens when a cron job is set

  if(multipleStations) {

    /* handle multiple stations */
    const stationsReply = handleMultipleStationsReply();
    if(automatic) handleAutomaticReply(stationsReply);
    else bot.reply(message, stationsReply);

  } else if(station.bikes > 0) {

    if(station.bikes < 5) {

      /* handle almost empty station */
      if(automatic) {
        drunkFriday ? handleAutomaticReply(DRUNK_REPLY_almost_empty(station.bikes, station.address)) : handleAutomaticReply(REPLY_almost_empty(station.bikes, station.address));
      } else {
        drunkFriday ? bot.reply(message, DRUNK_REPLY_almost_empty(station.bikes, station.address)) : bot.reply(message, REPLY_almost_empty(station.bikes, station.address));
      };

    } else {

      /* handle station */
      if(automatic) {
        drunkFriday ? handleAutomaticReply(DRUNK_REPLY_full(station.bikes, station.address)) : handleAutomaticReply(REPLY_full(station.bikes, station.address));
      } else {
        drunkFriday ? bot.reply(message, DRUNK_REPLY_full(station.bikes, station.address)) : bot.reply(message, REPLY_full(station.bikes, station.address));
      };
    }

  } else {

    /* handle empty station */
    if(automatic) {
      drunkFriday ? handleAutomaticReply(DRUNK_REPLY_empty(station.address)) : handleAutomaticReply(REPLY_empty(station.address));
    } else {
      drunkFriday ? bot.reply(message, DRUNK_REPLY_empty(station.address)) : bot.reply(message, REPLY_empty(station.address));
    };
  }
};

const handleAutomaticReply = reply => {
  bot.say({
    text: reply,
    channel: process.env.MAIN_CHANNEL
  });
};

const handleCheckStations = (stations, message, automatic) => {
  /* Checks if one of your base stations is empty, if so send a message */
  let emptyStation = false;

  stations.forEach(station => {
    if(station.bikes === 0) emptyStation = true;
  });

  if(emptyStation) {
    (stations.length > 1) ? handleReplies(stations, message, true, automatic) : handleReplies(stations, message, false, automatic);
  }
};

const handleMultipleStationsReply = () => {
  const replies = [];
  stations.forEach(station => {
    drunkFriday ? replies.push(DRUNK_REPLY_more_stations(station.bikes, station.address)) : replies.push(REPLY_more_stations(station.bikes, station.address));
  });

  return "".concat(...replies);
};

/* Cron Job */
const handleCronJobs = () => {

  handleDailyUpdate();
  handleDrunkFriday();
  handleChecker();

};

const handleDailyUpdate = () => {
  /* update on a certain time  */

  if(process.env.AUTO_TIMER) {

    const job = new CronJob({
      cronTime: process.env.AUTO_TIMER,
      onTick: function() {
        getVelokes({text: process.env.BASE_CAMP}, true);
      },
      start: false,
      timeZone: 'Europe/Amsterdam'
    });

    job.start();

  }
};

const handleDrunkFriday = () => {
  /* drunk messages on friday */

  const job = new CronJob({
    cronTime: '* * * * * 5',
    onTick: function() {
      drunkFriday = true;
    },
    start: false,
    timeZone: 'Europe/Amsterdam'
  });

  job.start();

};

const handleChecker = () => {
  /* checks between certain time if the base stations are emtpy */
  if(process.env.AUTO_CHECKER) {

    const job = new CronJob({
      cronTime: process.env.AUTO_CHECKER,
      onTick: function() {
        getVelokes({text: process.env.BASE_CAMP}, true, true);
      },
      start: false,
      timeZone: 'Europe/Amsterdam'
    });

    job.start();

  }
};

handleCronJobs();
