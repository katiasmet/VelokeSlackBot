'use strict';

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _toLower2 = require('lodash/toLower');

var _toLower3 = _interopRequireDefault(_toLower2);

var _uniq2 = require('lodash/uniq');

var _uniq3 = _interopRequireDefault(_uniq2);

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _cron = require('cron');

var _replies = require('./settings/replies');

var _drunk_replies = require('./settings/drunk_replies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = _botkit2.default.slackbot({
  debug: true
}); //D4NP461K6

var bot = controller.spawn({
  token: process.env.BOT_API_KEY
}).startRTM();

var stations = void 0,
    reply = void 0;
var drunkFriday = false;

controller.hears(['hello', 'hi', 'hallo', 'yo', 'ieps', 'hoi', 'hey', 'allo'], 'direct_message,direct_mention,mention', function (bot, message) {
  controller.storage.users.get(message.user, function (err, user) {
    if (user && user.name) {
      drunkFriday ? bot.reply(message, (0, _drunk_replies.DRUNK_REPLY_hello_user)(user.name)) : bot.reply(message, (0, _replies.REPLY_hello_user)(user.name));
    } else {
      drunkFriday ? bot.reply(message, _drunk_replies.DRUNK_REPLY_hello) : bot.reply(message, _replies.REPLY_hello);
    }
  });
});

controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function (bot, message) {

  bot.startConversation(message, function (err, convo) {

    convo.ask('Ben je zeker dat je me wilt afsluiten?', [{
      pattern: bot.utterances.yes,
      callback: function callback(response, convo) {
        convo.say('Salukes!');
        convo.next();
        setTimeout(function () {
          process.exit();
        }, 3000);
      }
    }, {
      pattern: bot.utterances.no,
      default: true,
      callback: function callback(response, convo) {
        convo.say('*Fiew!*');
        convo.next();
      }
    }]);
  });
});

controller.hears(['velo'], 'direct_message,direct_mention,mention', function (bot, message) {
  getVelokes(message);
});

/* Handle Velokes Replies */
var getVelokes = function getVelokes(message) {
  var automatic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var checkEmpty = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


  (0, _nodeFetch2.default)('https://www.velo-antwerpen.be/availability_map/getJsonObject').then(function (res) {
    return res.json();
  }).then(function (json) {
    stations = json;

    var checks = handleChecks(message.text);
    checks = (0, _remove3.default)(checks, function (check) {
      return check !== 'velo' || check !== 'veloke';
    });

    stations = handleSelectStations(checks);
    handleStations(message, automatic, checkEmpty);
  });
};

var handleChecks = function handleChecks(input) {

  if (input.includes(process.env.BASE_CAMP)) return process.env.BASE_STATIONS.split(', '); //check if the basecamp is called
  else return input.split(' ');
};

var handleSelectStations = function handleSelectStations(checks) {

  var selectedStations = [];

  stations.forEach(function (station) {
    checks.forEach(function (check) {

      check = (0, _toLower3.default)(check);
      var address = (0, _toLower3.default)(station.address);
      var name = (0, _toLower3.default)(station.name);
      if (address.includes(check) || name.includes(check)) selectedStations.push(station);
    });
  });

  return (0, _uniq3.default)(selectedStations);
};

/* check if there are multiple stations, 1 station or no stations */
var handleStations = function handleStations(message, automatic, checkEmpty) {

  if (!(0, _isEmpty3.default)(stations)) {

    if (checkEmpty) {
      handleCheckStations(stations, message, automatic);
    } //handles function to check if a station is empty
    else if (stations.length > 1) {
        handleReplies(stations, message, true, automatic);
      } else {
        handleReplies(stations[0], message, automatic);
      }
  } else {
    drunkFriday ? bot.reply(message, _drunk_replies.DRUNK_REPLY_no_stations) : bot.reply(message, _replies.REPLY_no_stations);
  }
};

/* handle answers */
var handleReplies = function handleReplies(station, message) {
  var multipleStations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var automatic = arguments[3];

  //automatic happens when a cron job is set

  if (multipleStations) {

    /* handle multiple stations */
    var stationsReply = handleMultipleStationsReply();
    if (automatic) handleAutomaticReply(stationsReply);else bot.reply(message, stationsReply);
  } else if (station.bikes > 0) {

    if (station.bikes < 5) {

      /* handle almost empty station */
      if (automatic) {
        drunkFriday ? handleAutomaticReply((0, _drunk_replies.DRUNK_REPLY_almost_empty)(station.bikes, station.address)) : handleAutomaticReply((0, _replies.REPLY_almost_empty)(station.bikes, station.address));
      } else {
        drunkFriday ? bot.reply(message, (0, _drunk_replies.DRUNK_REPLY_almost_empty)(station.bikes, station.address)) : bot.reply(message, (0, _replies.REPLY_almost_empty)(station.bikes, station.address));
      };
    } else {

      /* handle station */
      if (automatic) {
        drunkFriday ? handleAutomaticReply((0, _drunk_replies.DRUNK_REPLY_full)(station.bikes, station.address)) : handleAutomaticReply((0, _replies.REPLY_full)(station.bikes, station.address));
      } else {
        drunkFriday ? bot.reply(message, (0, _drunk_replies.DRUNK_REPLY_full)(station.bikes, station.address)) : bot.reply(message, (0, _replies.REPLY_full)(station.bikes, station.address));
      };
    }
  } else {

    /* handle empty station */
    if (automatic) {
      drunkFriday ? handleAutomaticReply((0, _drunk_replies.DRUNK_REPLY_empty)(station.address)) : handleAutomaticReply((0, _replies.REPLY_empty)(station.address));
    } else {
      drunkFriday ? bot.reply(message, (0, _drunk_replies.DRUNK_REPLY_empty)(station.address)) : bot.reply(message, (0, _replies.REPLY_empty)(station.address));
    };
  }
};

var handleAutomaticReply = function handleAutomaticReply(reply) {
  bot.say({
    text: reply,
    channel: process.env.MAIN_CHANNEL
  });
};

var handleCheckStations = function handleCheckStations(stations, message, automatic) {
  /* Checks if one of your base stations is empty, if so send a message */
  var emptyStation = false;

  stations.forEach(function (station) {
    if (station.bikes === 0) emptyStation = true;
  });

  if (emptyStation) {
    stations.length > 1 ? handleReplies(stations, message, true, automatic) : handleReplies(stations, message, false, automatic);
  }
};

var handleMultipleStationsReply = function handleMultipleStationsReply() {
  var _ref;

  var replies = [];
  stations.forEach(function (station) {
    drunkFriday ? replies.push((0, _drunk_replies.DRUNK_REPLY_more_stations)(station.bikes, station.address)) : replies.push((0, _replies.REPLY_more_stations)(station.bikes, station.address));
  });

  return (_ref = "").concat.apply(_ref, replies);
};

/* Cron Job */
var handleCronJobs = function handleCronJobs() {

  handleDailyUpdate();
  handleDrunkFriday();
  handleUnsetDrunkFriday();
  handleChecker();
};

var handleDailyUpdate = function handleDailyUpdate() {
  /* update on a certain time  */

  if (process.env.AUTO_TIMER) {

    var job = new _cron.CronJob({
      cronTime: process.env.AUTO_TIMER,
      onTick: function onTick() {
        getVelokes({ text: process.env.BASE_CAMP }, true);
      },
      start: false,
      timeZone: 'Europe/Amsterdam'
    });

    job.start();
  }
};

var handleDrunkFriday = function handleDrunkFriday() {
  /* drunk messages on friday */

  var job = new _cron.CronJob({
    cronTime: '00 00 16 * * 5',
    onTick: function onTick() {
      drunkFriday = true;
    },
    start: false,
    timeZone: 'Europe/Amsterdam'
  });

  job.start();
};

var handleUnsetDrunkFriday = function handleUnsetDrunkFriday() {

  var job = new _cron.CronJob({
    cronTime: '00 00 9 * * 1',
    onTick: function onTick() {
      drunkFriday = false;
    },
    start: false,
    timeZone: 'Europe/Amsterdam'
  });

  job.start();
};

var handleChecker = function handleChecker() {
  /* checks between certain time if the base stations are emtpy */
  if (process.env.AUTO_CHECKER) {

    var job = new _cron.CronJob({
      cronTime: process.env.AUTO_CHECKER,
      onTick: function onTick() {
        getVelokes({ text: process.env.BASE_CAMP }, true, true);
      },
      start: false,
      timeZone: 'Europe/Amsterdam'
    });

    job.start();
  }
};

handleCronJobs();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5lczYiXSwibmFtZXMiOlsiY29udHJvbGxlciIsInNsYWNrYm90IiwiZGVidWciLCJib3QiLCJzcGF3biIsInRva2VuIiwicHJvY2VzcyIsImVudiIsIkJPVF9BUElfS0VZIiwic3RhcnRSVE0iLCJzdGF0aW9ucyIsInJlcGx5IiwiZHJ1bmtGcmlkYXkiLCJoZWFycyIsIm1lc3NhZ2UiLCJzdG9yYWdlIiwidXNlcnMiLCJnZXQiLCJ1c2VyIiwiZXJyIiwibmFtZSIsInN0YXJ0Q29udmVyc2F0aW9uIiwiY29udm8iLCJhc2siLCJwYXR0ZXJuIiwidXR0ZXJhbmNlcyIsInllcyIsImNhbGxiYWNrIiwicmVzcG9uc2UiLCJzYXkiLCJuZXh0Iiwic2V0VGltZW91dCIsImV4aXQiLCJubyIsImRlZmF1bHQiLCJnZXRWZWxva2VzIiwiYXV0b21hdGljIiwiY2hlY2tFbXB0eSIsInRoZW4iLCJyZXMiLCJqc29uIiwiY2hlY2tzIiwiaGFuZGxlQ2hlY2tzIiwidGV4dCIsImNoZWNrIiwiaGFuZGxlU2VsZWN0U3RhdGlvbnMiLCJoYW5kbGVTdGF0aW9ucyIsImlucHV0IiwiaW5jbHVkZXMiLCJCQVNFX0NBTVAiLCJCQVNFX1NUQVRJT05TIiwic3BsaXQiLCJzZWxlY3RlZFN0YXRpb25zIiwiZm9yRWFjaCIsImFkZHJlc3MiLCJzdGF0aW9uIiwicHVzaCIsImhhbmRsZUNoZWNrU3RhdGlvbnMiLCJsZW5ndGgiLCJoYW5kbGVSZXBsaWVzIiwibXVsdGlwbGVTdGF0aW9ucyIsInN0YXRpb25zUmVwbHkiLCJoYW5kbGVNdWx0aXBsZVN0YXRpb25zUmVwbHkiLCJoYW5kbGVBdXRvbWF0aWNSZXBseSIsImJpa2VzIiwiY2hhbm5lbCIsIk1BSU5fQ0hBTk5FTCIsImVtcHR5U3RhdGlvbiIsInJlcGxpZXMiLCJjb25jYXQiLCJoYW5kbGVDcm9uSm9icyIsImhhbmRsZURhaWx5VXBkYXRlIiwiaGFuZGxlRHJ1bmtGcmlkYXkiLCJoYW5kbGVVbnNldERydW5rRnJpZGF5IiwiaGFuZGxlQ2hlY2tlciIsIkFVVE9fVElNRVIiLCJqb2IiLCJjcm9uVGltZSIsIm9uVGljayIsInN0YXJ0IiwidGltZVpvbmUiLCJBVVRPX0NIRUNLRVIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFFQTs7QUFRQTs7OztBQVFBLElBQU1BLGFBQWEsaUJBQU9DLFFBQVAsQ0FBZ0I7QUFDL0JDLFNBQU87QUFEd0IsQ0FBaEIsQ0FBbkIsQyxDQXZCQTs7QUEyQkEsSUFBTUMsTUFBTUgsV0FBV0ksS0FBWCxDQUFpQjtBQUN6QkMsU0FBT0MsUUFBUUMsR0FBUixDQUFZQztBQURNLENBQWpCLEVBRVRDLFFBRlMsRUFBWjs7QUFJQSxJQUFJQyxpQkFBSjtBQUFBLElBQWNDLGNBQWQ7QUFDQSxJQUFJQyxjQUFjLEtBQWxCOztBQUVBWixXQUFXYSxLQUFYLENBQ0UsQ0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QixJQUF6QixFQUErQixNQUEvQixFQUF1QyxLQUF2QyxFQUE4QyxLQUE5QyxFQUFxRCxNQUFyRCxDQURGLEVBRUUsdUNBRkYsRUFHRSxVQUFDVixHQUFELEVBQU1XLE9BQU4sRUFBa0I7QUFDaEJkLGFBQVdlLE9BQVgsQ0FBbUJDLEtBQW5CLENBQXlCQyxHQUF6QixDQUE2QkgsUUFBUUksSUFBckMsRUFBMkMsVUFBU0MsR0FBVCxFQUFjRCxJQUFkLEVBQW9CO0FBQzdELFFBQUlBLFFBQVFBLEtBQUtFLElBQWpCLEVBQXVCO0FBQ3JCUixvQkFBY1QsSUFBSVEsS0FBSixDQUFVRyxPQUFWLEVBQW1CLDJDQUF1QkksS0FBS0UsSUFBNUIsQ0FBbkIsQ0FBZCxHQUFzRWpCLElBQUlRLEtBQUosQ0FBVUcsT0FBVixFQUFtQiwrQkFBaUJJLEtBQUtFLElBQXRCLENBQW5CLENBQXRFO0FBQ0QsS0FGRCxNQUVPO0FBQ0xSLG9CQUFjVCxJQUFJUSxLQUFKLENBQVVHLE9BQVYsbUNBQWQsR0FBc0RYLElBQUlRLEtBQUosQ0FB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O0FBS3RCbUUsV0FBTyxLQUxlO0FBTXRCQyxjQUFVO0FBTlksR0FBWixDQUFaOztBQVNBSixNQUFJRyxLQUFKO0FBRUQsQ0FiRDs7QUFlQSxJQUFNTCxnQkFBZ0IsU0FBaEJBLGFBQWdCLEdBQU07QUFDMUI7QUFDQSxNQUFHcEUsUUFBUUMsR0FBUixDQUFZMEUsWUFBZixFQUE2Qjs7QUFFM0IsUUFBTUwsTUFBTSxrQkFBWTtBQUN0QkMsZ0JBQVV2RSxRQUFRQyxHQUFSLENBQVkwRSxZQURBO0FBRXRCSCxjQUFRLGtCQUFXO0FBQ2pCM0MsbUJBQVcsRUFBQ1EsTUFBTXJDLFFBQVFDLEdBQVIsQ0FBWTBDLFNBQW5CLEVBQVgsRUFBMEMsSUFBMUMsRUFBZ0QsSUFBaEQ7QUFDRCxPQUpxQjtBQUt0QjhCLGFBQU8sS0FMZTtBQU10QkMsZ0JBQVU7QUFOWSxLQUFaLENBQVo7O0FBU0FKLFFBQUlHLEtBQUo7QUFFRDtBQUNGLENBaEJEOztBQWtCQVQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL0Q0TlA0NjFLNlxuXG5pbXBvcnQgQm90a2l0IGZyb20gJ2JvdGtpdCc7XG5pbXBvcnQgZmV0Y2ggZnJvbSAnbm9kZS1mZXRjaCc7XG5pbXBvcnQge3VuaXEsIHRvTG93ZXIsIHJlbW92ZSwgaXNFbXB0eX0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7Q3JvbkpvYn0gZnJvbSAnY3Jvbic7XG5cbmltcG9ydCB7UkVQTFlfaGVsbG8sXG4gICAgICAgIFJFUExZX2hlbGxvX3VzZXIsXG4gICAgICAgIFJFUExZX2Z1bGwsXG4gICAgICAgIFJFUExZX2FsbW9zdF9lbXB0eSxcbiAgICAgICAgUkVQTFlfZW1wdHksXG4gICAgICAgIFJFUExZX25vX3N0YXRpb25zLFxuICAgICAgICBSRVBMWV9tb3JlX3N0YXRpb25zfSBmcm9tICcuL3NldHRpbmdzL3JlcGxpZXMnO1xuXG5pbXBvcnQge0RSVU5LX1JFUExZX2hlbGxvLFxuICAgICAgICBEUlVOS19SRVBMWV9oZWxsb191c2VyLFxuICAgICAgICBEUlVOS19SRVBMWV9mdWxsLFxuICAgICAgICBEUlVOS19SRVBMWV9hbG1vc3RfZW1wdHksXG4gICAgICAgIERSVU5LX1JFUExZX2VtcHR5LFxuICAgICAgICBEUlVOS19SRVBMWV9ub19zdGF0aW9ucyxcbiAgICAgICAgRFJVTktfUkVQTFlfbW9yZV9zdGF0aW9uc30gZnJvbSAnLi9zZXR0aW5ncy9kcnVua19yZXBsaWVzJztcblxuY29uc3QgY29udHJvbGxlciA9IEJvdGtpdC5zbGFja2JvdCh7XG4gICAgZGVidWc6IHRydWUsXG59KTtcblxuY29uc3QgYm90ID0gY29udHJvbGxlci5zcGF3bih7XG4gICAgdG9rZW46IHByb2Nlc3MuZW52LkJPVF9BUElfS0VZXG59KS5zdGFydFJUTSgpO1xuXG5sZXQgc3RhdGlvbnMsIHJlcGx5O1xubGV0IGRydW5rRnJpZGF5ID0gZmFsc2U7XG5cbmNvbnRyb2xsZXIuaGVhcnMoXG4gIFsnaGVsbG8nLCAnaGknLCAnaGFsbG8nLCAneW8nLCAnaWVwcycsICdob2knLCAnaGV5JywgJ2FsbG8nXSxcbiAgJ2RpcmVjdF9tZXNzYWdlLGRpcmVjdF9tZW50aW9uLG1lbnRpb24nLFxuICAoYm90LCBtZXNzYWdlKSA9PiB7XG4gICAgY29udHJvbGxlci5zdG9yYWdlLnVzZXJzLmdldChtZXNzYWdlLnVzZXIsIGZ1bmN0aW9uKGVyciwgdXNlcikge1xuICAgICAgaWYgKHVzZXIgJiYgdXNlci5uYW1lKSB7XG4gICAgICAgIGRydW5rRnJpZGF5ID8gYm90LnJlcGx5KG1lc3NhZ2UsIERSVU5LX1JFUExZX2hlbGxvX3VzZXIodXNlci5uYW1lKSkgOiBib3QucmVwbHkobWVzc2FnZSwgUkVQTFlfaGVsbG9fdXNlcih1c2VyLm5hbWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRydW5rRnJpZGF5ID8gYm90LnJlcGx5KG1lc3NhZ2UsIERSVU5LX1JFUExZX2hlbGxvKSA6IGJvdC5yZXBseShtZXNzYWdlLCBSRVBMWV9oZWxsbyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbik7XG5cbmNvbnRyb2xsZXIuaGVhcnMoXG4gIFsnc2h1dGRvd24nXSxcbiAgJ2RpcmVjdF9tZXNzYWdlLGRpcmVjdF9tZW50aW9uLG1lbnRpb24nLFxuICAoYm90LCBtZXNzYWdlKSA9PiB7XG5cbiAgICBib3Quc3RhcnRDb252ZXJzYXRpb24obWVzc2FnZSwgZnVuY3Rpb24oZXJyLCBjb252bykge1xuXG4gICAgICAgIGNvbnZvLmFzaygnQmVuIGplIHpla2VyIGRhdCBqZSBtZSB3aWx0IGFmc2x1aXRlbj8nLCBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0dGVybjogYm90LnV0dGVyYW5jZXMueWVzLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwb25zZSwgY29udm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udm8uc2F5KCdTYWx1a2VzIScpO1xuICAgICAgICAgICAgICAgICAgICBjb252by5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgcGF0dGVybjogYm90LnV0dGVyYW5jZXMubm8sXG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BvbnNlLCBjb252bykge1xuICAgICAgICAgICAgICAgIGNvbnZvLnNheSgnKkZpZXchKicpO1xuICAgICAgICAgICAgICAgIGNvbnZvLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcbiAgfVxuKTtcblxuY29udHJvbGxlci5oZWFycyhcbiAgWyd2ZWxvJ10sXG4gICdkaXJlY3RfbWVzc2FnZSxkaXJlY3RfbWVudGlvbixtZW50aW9uJyxcbiAgKGJvdCwgbWVzc2FnZSkgPT4ge1xuICAgIGdldFZlbG9rZXMobWVzc2FnZSk7XG4gIH1cbik7XG5cbi8qIEhhbmRsZSBWZWxva2VzIFJlcGxpZXMgKi9cbmNvbnN0IGdldFZlbG9rZXMgPSAobWVzc2FnZSwgYXV0b21hdGljID0gZmFsc2UsIGNoZWNrRW1wdHkgPSBmYWxzZSkgPT4ge1xuXG4gIGZldGNoKCdodHRwczovL3d3dy52ZWxvLWFudHdlcnBlbi5iZS9hdmFpbGFiaWxpdHlfbWFwL2dldEpzb25PYmplY3QnKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICBzdGF0aW9ucyA9IGpzb247XG5cbiAgICAgIGxldCBjaGVja3MgPSBoYW5kbGVDaGVja3MobWVzc2FnZS50ZXh0KTtcbiAgICAgIGNoZWNrcyA9IHJlbW92ZShjaGVja3MsIGNoZWNrID0+IHtcbiAgICAgICAgcmV0dXJuIGNoZWNrICE9PSAndmVsbycgfHwgY2hlY2sgIT09ICd2ZWxva2UnO1xuICAgICAgfSk7XG5cbiAgICAgIHN0YXRpb25zID0gaGFuZGxlU2VsZWN0U3RhdGlvbnMoY2hlY2tzKTtcbiAgICAgIGhhbmRsZVN0YXRpb25zKG1lc3NhZ2UsIGF1dG9tYXRpYywgY2hlY2tFbXB0eSk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBoYW5kbGVDaGVja3MgPSAoaW5wdXQpID0+IHtcblxuICBpZihpbnB1dC5pbmNsdWRlcyhwcm9jZXNzLmVudi5CQVNFX0NBTVApKSByZXR1cm4gcHJvY2Vzcy5lbnYuQkFTRV9TVEFUSU9OUy5zcGxpdCgnLCAnKTsgLy9jaGVjayBpZiB0aGUgYmFzZWNhbXAgaXMgY2FsbGVkXG4gIGVsc2UgcmV0dXJuIGlucHV0LnNwbGl0KCcgJyk7XG59XG5cbmNvbnN0IGhhbmRsZVNlbGVjdFN0YXRpb25zID0gKGNoZWNrcykgPT4ge1xuXG4gIGNvbnN0IHNlbGVjdGVkU3RhdGlvbnMgPSBbXTtcblxuICBzdGF0aW9ucy5mb3JFYWNoKHN0YXRpb24gPT4ge1xuICAgIGNoZWNrcy5mb3JFYWNoKGNoZWNrID0+IHtcblxuICAgICAgY2hlY2sgPSB0b0xvd2VyKGNoZWNrKTtcbiAgICAgIGNvbnN0IGFkZHJlc3MgPSB0b0xvd2VyKHN0YXRpb24uYWRkcmVzcyk7XG4gICAgICBjb25zdCBuYW1lID0gdG9Mb3dlcihzdGF0aW9uLm5hbWUpO1xuICAgICAgaWYoYWRkcmVzcy5pbmNsdWRlcyhjaGVjaykgfHwgbmFtZS5pbmNsdWRlcyhjaGVjaykpIHNlbGVjdGVkU3RhdGlvbnMucHVzaChzdGF0aW9uKTtcblxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gdW5pcShzZWxlY3RlZFN0YXRpb25zKTtcbn07XG5cbi8qIGNoZWNrIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBzdGF0aW9ucywgMSBzdGF0aW9uIG9yIG5vIHN0YXRpb25zICovXG5jb25zdCBoYW5kbGVTdGF0aW9ucyA9IChtZXNzYWdlLCBhdXRvbWF0aWMsIGNoZWNrRW1wdHkpID0+IHtcblxuICBpZighaXNFbXB0eShzdGF0aW9ucykpIHtcblxuICAgIGlmKGNoZWNrRW1wdHkpIHsgaGFuZGxlQ2hlY2tTdGF0aW9ucyhzdGF0aW9ucywgbWVzc2FnZSwgYXV0b21hdGljKSB9IC8vaGFuZGxlcyBmdW5jdGlvbiB0byBjaGVjayBpZiBhIHN0YXRpb24gaXMgZW1wdHlcbiAgICBlbHNlIGlmKHN0YXRpb25zLmxlbmd0aCA+IDEpIHsgaGFuZGxlUmVwbGllcyhzdGF0aW9ucywgbWVzc2FnZSwgdHJ1ZSwgYXV0b21hdGljKTsgfVxuICAgIGVsc2UgeyBoYW5kbGVSZXBsaWVzKHN0YXRpb25zWzBdLCBtZXNzYWdlLCBhdXRvbWF0aWMpIH1cblxuICB9IGVsc2Uge1xuICAgIGRydW5rRnJpZGF5ID8gYm90LnJlcGx5KG1lc3NhZ2UsIERSVU5LX1JFUExZX25vX3N0YXRpb25zKSA6IGJvdC5yZXBseShtZXNzYWdlLCBSRVBMWV9ub19zdGF0aW9ucyk7XG4gIH1cblxufTtcblxuLyogaGFuZGxlIGFuc3dlcnMgKi9cbmNvbnN0IGhhbmRsZVJlcGxpZXMgPSAoc3RhdGlvbiwgbWVzc2FnZSwgbXVsdGlwbGVTdGF0aW9ucyA9IGZhbHNlLCBhdXRvbWF0aWMpID0+IHtcbiAgLy9hdXRvbWF0aWMgaGFwcGVucyB3aGVuIGEgY3JvbiBqb2IgaXMgc2V0XG5cbiAgaWYobXVsdGlwbGVTdGF0aW9ucykge1xuXG4gICAgLyogaGFuZGxlIG11bHRpcGxlIHN0YXRpb25zICovXG4gICAgY29uc3Qgc3RhdGlvbnNSZXBseSA9IGhhbmRsZU11bHRpcGxlU3RhdGlvbnNSZXBseSgpO1xuICAgIGlmKGF1dG9tYXRpYykgaGFuZGxlQXV0b21hdGljUmVwbHkoc3RhdGlvbnNSZXBseSk7XG4gICAgZWxzZSBib3QucmVwbHkobWVzc2FnZSwgc3RhdGlvbnNSZXBseSk7XG5cbiAgfSBlbHNlIGlmKHN0YXRpb24uYmlrZXMgPiAwKSB7XG5cbiAgICBpZihzdGF0aW9uLmJpa2VzIDwgNSkge1xuXG4gICAgICAvKiBoYW5kbGUgYWxtb3N0IGVtcHR5IHN0YXRpb24gKi9cbiAgICAgIGlmKGF1dG9tYXRpYykge1xuICAgICAgICBkcnVua0ZyaWRheSA/IGhhbmRsZUF1dG9tYXRpY1JlcGx5KERSVU5LX1JFUExZX2FsbW9zdF9lbXB0eShzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKSA6IGhhbmRsZUF1dG9tYXRpY1JlcGx5KFJFUExZX2FsbW9zdF9lbXB0eShzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRydW5rRnJpZGF5ID8gYm90LnJlcGx5KG1lc3NhZ2UsIERSVU5LX1JFUExZX2FsbW9zdF9lbXB0eShzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKSA6IGJvdC5yZXBseShtZXNzYWdlLCBSRVBMWV9hbG1vc3RfZW1wdHkoc3RhdGlvbi5iaWtlcywgc3RhdGlvbi5hZGRyZXNzKSk7XG4gICAgICB9O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgLyogaGFuZGxlIHN0YXRpb24gKi9cbiAgICAgIGlmKGF1dG9tYXRpYykge1xuICAgICAgICBkcnVua0ZyaWRheSA/IGhhbmRsZUF1dG9tYXRpY1JlcGx5KERSVU5LX1JFUExZX2Z1bGwoc3RhdGlvbi5iaWtlcywgc3RhdGlvbi5hZGRyZXNzKSkgOiBoYW5kbGVBdXRvbWF0aWNSZXBseShSRVBMWV9mdWxsKHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJ1bmtGcmlkYXkgPyBib3QucmVwbHkobWVzc2FnZSwgRFJVTktfUkVQTFlfZnVsbChzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKSA6IGJvdC5yZXBseShtZXNzYWdlLCBSRVBMWV9mdWxsKHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcblxuICAgIC8qIGhhbmRsZSBlbXB0eSBzdGF0aW9uICovXG4gICAgaWYoYXV0b21hdGljKSB7XG4gICAgICBkcnVua0ZyaWRheSA/IGhhbmRsZUF1dG9tYXRpY1JlcGx5KERSVU5LX1JFUExZX2VtcHR5KHN0YXRpb24uYWRkcmVzcykpIDogaGFuZGxlQXV0b21hdGljUmVwbHkoUkVQTFlfZW1wdHkoc3RhdGlvbi5hZGRyZXNzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRydW5rRnJpZGF5ID8gYm90LnJlcGx5KG1lc3NhZ2UsIERSVU5LX1JFUExZX2VtcHR5KHN0YXRpb24uYWRkcmVzcykpIDogYm90LnJlcGx5KG1lc3NhZ2UsIFJFUExZX2VtcHR5KHN0YXRpb24uYWRkcmVzcykpO1xuICAgIH07XG4gIH1cbn07XG5cbmNvbnN0IGhhbmRsZUF1dG9tYXRpY1JlcGx5ID0gcmVwbHkgPT4ge1xuICBib3Quc2F5KHtcbiAgICB0ZXh0OiByZXBseSxcbiAgICBjaGFubmVsOiBwcm9jZXNzLmVudi5NQUlOX0NIQU5ORUxcbiAgfSk7XG59O1xuXG5jb25zdCBoYW5kbGVDaGVja1N0YXRpb25zID0gKHN0YXRpb25zLCBtZXNzYWdlLCBhdXRvbWF0aWMpID0+IHtcbiAgLyogQ2hlY2tzIGlmIG9uZSBvZiB5b3VyIGJhc2Ugc3RhdGlvbnMgaXMgZW1wdHksIGlmIHNvIHNlbmQgYSBtZXNzYWdlICovXG4gIGxldCBlbXB0eVN0YXRpb24gPSBmYWxzZTtcblxuICBzdGF0aW9ucy5mb3JFYWNoKHN0YXRpb24gPT4ge1xuICAgIGlmKHN0YXRpb24uYmlrZXMgPT09IDApIGVtcHR5U3RhdGlvbiA9IHRydWU7XG4gIH0pO1xuXG4gIGlmKGVtcHR5U3RhdGlvbikge1xuICAgIChzdGF0aW9ucy5sZW5ndGggPiAxKSA/IGhhbmRsZVJlcGxpZXMoc3RhdGlvbnMsIG1lc3NhZ2UsIHRydWUsIGF1dG9tYXRpYykgOiBoYW5kbGVSZXBsaWVzKHN0YXRpb25zLCBtZXNzYWdlLCBmYWxzZSwgYXV0b21hdGljKTtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlTXVsdGlwbGVTdGF0aW9uc1JlcGx5ID0gKCkgPT4ge1xuICBjb25zdCByZXBsaWVzID0gW107XG4gIHN0YXRpb25zLmZvckVhY2goc3RhdGlvbiA9PiB7XG4gICAgZHJ1bmtGcmlkYXkgPyByZXBsaWVzLnB1c2goRFJVTktfUkVQTFlfbW9yZV9zdGF0aW9ucyhzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKSA6IHJlcGxpZXMucHVzaChSRVBMWV9tb3JlX3N0YXRpb25zKHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpO1xuICB9KTtcblxuICByZXR1cm4gXCJcIi5jb25jYXQoLi4ucmVwbGllcyk7XG59O1xuXG4vKiBDcm9uIEpvYiAqL1xuY29uc3QgaGFuZGxlQ3JvbkpvYnMgPSAoKSA9PiB7XG5cbiAgaGFuZGxlRGFpbHlVcGRhdGUoKTtcbiAgaGFuZGxlRHJ1bmtGcmlkYXkoKTtcbiAgaGFuZGxlVW5zZXREcnVua0ZyaWRheSgpO1xuICBoYW5kbGVDaGVja2VyKCk7XG5cbn07XG5cbmNvbnN0IGhhbmRsZURhaWx5VXBkYXRlID0gKCkgPT4ge1xuICAvKiB1cGRhdGUgb24gYSBjZXJ0YWluIHRpbWUgICovXG5cbiAgaWYocHJvY2Vzcy5lbnYuQVVUT19USU1FUikge1xuXG4gICAgY29uc3Qgam9iID0gbmV3IENyb25Kb2Ioe1xuICAgICAgY3JvblRpbWU6IHByb2Nlc3MuZW52LkFVVE9fVElNRVIsXG4gICAgICBvblRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBnZXRWZWxva2VzKHt0ZXh0OiBwcm9jZXNzLmVudi5CQVNFX0NBTVB9LCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBzdGFydDogZmFsc2UsXG4gICAgICB0aW1lWm9uZTogJ0V1cm9wZS9BbXN0ZXJkYW0nXG4gICAgfSk7XG5cbiAgICBqb2Iuc3RhcnQoKTtcblxuICB9XG59O1xuXG5jb25zdCBoYW5kbGVEcnVua0ZyaWRheSA9ICgpID0+IHtcbiAgLyogZHJ1bmsgbWVzc2FnZXMgb24gZnJpZGF5ICovXG5cbiAgY29uc3Qgam9iID0gbmV3IENyb25Kb2Ioe1xuICAgIGNyb25UaW1lOiAnMDAgMDAgMTYgKiAqIDUnLFxuICAgIG9uVGljazogZnVuY3Rpb24oKSB7XG4gICAgICBkcnVua0ZyaWRheSA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydDogZmFsc2UsXG4gICAgdGltZVpvbmU6ICdFdXJvcGUvQW1zdGVyZGFtJ1xuICB9KTtcblxuICBqb2Iuc3RhcnQoKTtcblxufTtcblxuY29uc3QgaGFuZGxlVW5zZXREcnVua0ZyaWRheSA9ICgpID0+IHtcblxuICBjb25zdCBqb2IgPSBuZXcgQ3JvbkpvYih7XG4gICAgY3JvblRpbWU6ICcwMCAwMCA5ICogKiAxJyxcbiAgICBvblRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgZHJ1bmtGcmlkYXkgPSBmYWxzZTtcbiAgICB9LFxuICAgIHN0YXJ0OiBmYWxzZSxcbiAgICB0aW1lWm9uZTogJ0V1cm9wZS9BbXN0ZXJkYW0nXG4gIH0pO1xuXG4gIGpvYi5zdGFydCgpO1xuXG59O1xuXG5jb25zdCBoYW5kbGVDaGVja2VyID0gKCkgPT4ge1xuICAvKiBjaGVja3MgYmV0d2VlbiBjZXJ0YWluIHRpbWUgaWYgdGhlIGJhc2Ugc3RhdGlvbnMgYXJlIGVtdHB5ICovXG4gIGlmKHByb2Nlc3MuZW52LkFVVE9fQ0hFQ0tFUikge1xuXG4gICAgY29uc3Qgam9iID0gbmV3IENyb25Kb2Ioe1xuICAgICAgY3JvblRpbWU6IHByb2Nlc3MuZW52LkFVVE9fQ0hFQ0tFUixcbiAgICAgIG9uVGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgIGdldFZlbG9rZXMoe3RleHQ6IHByb2Nlc3MuZW52LkJBU0VfQ0FNUH0sIHRydWUsIHRydWUpO1xuICAgICAgfSxcbiAgICAgIHN0YXJ0OiBmYWxzZSxcbiAgICAgIHRpbWVab25lOiAnRXVyb3BlL0Ftc3RlcmRhbSdcbiAgICB9KTtcblxuICAgIGpvYi5zdGFydCgpO1xuXG4gIH1cbn07XG5cbmhhbmRsZUNyb25Kb2JzKCk7XG4iXX0=