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
    cronTime: '* * * * * 5',
    onTick: function onTick() {
      drunkFriday = true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5lczYiXSwibmFtZXMiOlsiY29udHJvbGxlciIsInNsYWNrYm90IiwiZGVidWciLCJib3QiLCJzcGF3biIsInRva2VuIiwicHJvY2VzcyIsImVudiIsIkJPVF9BUElfS0VZIiwic3RhcnRSVE0iLCJzdGF0aW9ucyIsInJlcGx5IiwiZHJ1bmtGcmlkYXkiLCJoZWFycyIsIm1lc3NhZ2UiLCJzdG9yYWdlIiwidXNlcnMiLCJnZXQiLCJ1c2VyIiwiZXJyIiwibmFtZSIsInN0YXJ0Q29udmVyc2F0aW9uIiwiY29udm8iLCJhc2siLCJwYXR0ZXJuIiwidXR0ZXJhbmNlcyIsInllcyIsImNhbGxiYWNrIiwicmVzcG9uc2UiLCJzYXkiLCJuZXh0Iiwic2V0VGltZW91dCIsImV4aXQiLCJubyIsImRlZmF1bHQiLCJnZXRWZWxva2VzIiwiYXV0b21hdGljIiwiY2hlY2tFbXB0eSIsInRoZW4iLCJyZXMiLCJqc29uIiwiY2hlY2tzIiwiaGFuZGxlQ2hlY2tzIiwidGV4dCIsImNoZWNrIiwiaGFuZGxlU2VsZWN0U3RhdGlvbnMiLCJoYW5kbGVTdGF0aW9ucyIsImlucHV0IiwiaW5jbHVkZXMiLCJCQVNFX0NBTVAiLCJCQVNFX1NUQVRJT05TIiwic3BsaXQiLCJzZWxlY3RlZFN0YXRpb25zIiwiZm9yRWFjaCIsImFkZHJlc3MiLCJzdGF0aW9uIiwicHVzaCIsImhhbmRsZUNoZWNrU3RhdGlvbnMiLCJsZW5ndGgiLCJoYW5kbGVSZXBsaWVzIiwibXVsdGlwbGVTdGF0aW9ucyIsInN0YXRpb25zUmVwbHkiLCJoYW5kbGVNdWx0aXBsZVN0YXRpb25zUmVwbHkiLCJoYW5kbGVBdXRvbWF0aWNSZXBseSIsImJpa2VzIiwiY2hhbm5lbCIsIk1BSU5fQ0hBTk5FTCIsImVtcHR5U3RhdGlvbiIsInJlcGxpZXMiLCJjb25jYXQiLCJoYW5kbGVDcm9uSm9icyIsImhhbmRsZURhaWx5VXBkYXRlIiwiaGFuZGxlRHJ1bmtGcmlkYXkiLCJoYW5kbGVDaGVja2VyIiwiQVVUT19USU1FUiIsImpvYiIsImNyb25UaW1lIiwib25UaWNrIiwic3RhcnQiLCJ0aW1lWm9uZSIsIkFVVE9fQ0hFQ0tFUiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7OztBQUVBOztBQUVBOztBQVFBOzs7O0FBUUEsSUFBTUEsYUFBYSxpQkFBT0MsUUFBUCxDQUFnQjtBQUMvQkMsU0FBTztBQUR3QixDQUFoQixDQUFuQixDLENBdkJBOztBQTJCQSxJQUFNQyxNQUFNSCxXQUFXSSxLQUFYLENBQWlCO0FBQ3pCQyxTQUFPQyxRQUFRQyxHQUFSLENBQVlDO0FBRE0sQ0FBakIsRUFFVEMsUUFGUyxFQUFaOztBQUlBLElBQUlDLGlCQUFKO0FBQUEsSUFBY0MsY0FBZDtBQUNBLElBQUlDLGNBQWMsS0FBbEI7O0FBRUFaLFdBQVdhLEtBQVgsQ0FDRSxDQUFDLE9BQUQsRUFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCLElBQXpCLEVBQStCLE1BQS9CLEVBQXVDLEtBQXZDLEVBQThDLEtBQTlDLEVBQXFELE1BQXJELENBREYsRUFFRSx1Q0FGRixFQUdFLFVBQUNWLEdBQUQsRUFBTVcsT0FBTixFQUFrQjtBQUNoQmQsYUFBV2UsT0FBWCxDQUFtQkMsS0FBbkIsQ0FBeUJDLEdBQXpCLENBQTZCSCxRQUFRSSxJQUFyQyxFQUEyQyxVQUFTQyxHQUFULEVBQWNELElBQWQsRUFBb0I7QUFDN0QsUUFBSUEsUUFBUUEsS0FBS0UsSUFBakIsRUFBdUI7QUFDckJSLG9CQUFjVCxJQUFJUSxLQUFKLENBQVVHLE9BQVYsRUFBbUIsMkNBQXVCSSxLQUFLRSxJQUE1QixDQUFuQixDQUFkLEdBQXNFakIsSUFBSVEsS0FBSixDQUFVRyxPQUFWLEVBQW1CLCtCQUFpQkksS0FBS0UsSUFBdEIsQ0FBbkIsQ0FBdEU7QUFDRCxLQUZELE1BRU87QUFDTFIsb0JBQWNULElBQUlRLEtBQUosQ0FBVUcsT0FBVixtQ0FBZCxHQUFzRFgsSUFBSVEsS0FBSixDQUFVRyxPQUFWLHVCQUF0RDtBQUNEO0FBQ0Ys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a0JBQVc7QUFDakIxQyxtQkFBVyxFQUFDUSxNQUFNckMsUUFBUUMsR0FBUixDQUFZMEMsU0FBbkIsRUFBWCxFQUEwQyxJQUExQyxFQUFnRCxJQUFoRDtBQUNELE9BSnFCO0FBS3RCNkIsYUFBTyxLQUxlO0FBTXRCQyxnQkFBVTtBQU5ZLEtBQVosQ0FBWjs7QUFTQUosUUFBSUcsS0FBSjtBQUVEO0FBQ0YsQ0FoQkQ7O0FBa0JBUiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vRDROUDQ2MUs2XG5cbmltcG9ydCBCb3RraXQgZnJvbSAnYm90a2l0JztcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcbmltcG9ydCB7dW5pcSwgdG9Mb3dlciwgcmVtb3ZlLCBpc0VtcHR5fSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtDcm9uSm9ifSBmcm9tICdjcm9uJztcblxuaW1wb3J0IHtSRVBMWV9oZWxsbyxcbiAgICAgICAgUkVQTFlfaGVsbG9fdXNlcixcbiAgICAgICAgUkVQTFlfZnVsbCxcbiAgICAgICAgUkVQTFlfYWxtb3N0X2VtcHR5LFxuICAgICAgICBSRVBMWV9lbXB0eSxcbiAgICAgICAgUkVQTFlfbm9fc3RhdGlvbnMsXG4gICAgICAgIFJFUExZX21vcmVfc3RhdGlvbnN9IGZyb20gJy4vc2V0dGluZ3MvcmVwbGllcyc7XG5cbmltcG9ydCB7RFJVTktfUkVQTFlfaGVsbG8sXG4gICAgICAgIERSVU5LX1JFUExZX2hlbGxvX3VzZXIsXG4gICAgICAgIERSVU5LX1JFUExZX2Z1bGwsXG4gICAgICAgIERSVU5LX1JFUExZX2FsbW9zdF9lbXB0eSxcbiAgICAgICAgRFJVTktfUkVQTFlfZW1wdHksXG4gICAgICAgIERSVU5LX1JFUExZX25vX3N0YXRpb25zLFxuICAgICAgICBEUlVOS19SRVBMWV9tb3JlX3N0YXRpb25zfSBmcm9tICcuL3NldHRpbmdzL2RydW5rX3JlcGxpZXMnO1xuXG5jb25zdCBjb250cm9sbGVyID0gQm90a2l0LnNsYWNrYm90KHtcbiAgICBkZWJ1ZzogdHJ1ZSxcbn0pO1xuXG5jb25zdCBib3QgPSBjb250cm9sbGVyLnNwYXduKHtcbiAgICB0b2tlbjogcHJvY2Vzcy5lbnYuQk9UX0FQSV9LRVlcbn0pLnN0YXJ0UlRNKCk7XG5cbmxldCBzdGF0aW9ucywgcmVwbHk7XG5sZXQgZHJ1bmtGcmlkYXkgPSBmYWxzZTtcblxuY29udHJvbGxlci5oZWFycyhcbiAgWydoZWxsbycsICdoaScsICdoYWxsbycsICd5bycsICdpZXBzJywgJ2hvaScsICdoZXknLCAnYWxsbyddLFxuICAnZGlyZWN0X21lc3NhZ2UsZGlyZWN0X21lbnRpb24sbWVudGlvbicsXG4gIChib3QsIG1lc3NhZ2UpID0+IHtcbiAgICBjb250cm9sbGVyLnN0b3JhZ2UudXNlcnMuZ2V0KG1lc3NhZ2UudXNlciwgZnVuY3Rpb24oZXJyLCB1c2VyKSB7XG4gICAgICBpZiAodXNlciAmJiB1c2VyLm5hbWUpIHtcbiAgICAgICAgZHJ1bmtGcmlkYXkgPyBib3QucmVwbHkobWVzc2FnZSwgRFJVTktfUkVQTFlfaGVsbG9fdXNlcih1c2VyLm5hbWUpKSA6IGJvdC5yZXBseShtZXNzYWdlLCBSRVBMWV9oZWxsb191c2VyKHVzZXIubmFtZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJ1bmtGcmlkYXkgPyBib3QucmVwbHkobWVzc2FnZSwgRFJVTktfUkVQTFlfaGVsbG8pIDogYm90LnJlcGx5KG1lc3NhZ2UsIFJFUExZX2hlbGxvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuKTtcblxuY29udHJvbGxlci5oZWFycyhcbiAgWydzaHV0ZG93biddLFxuICAnZGlyZWN0X21lc3NhZ2UsZGlyZWN0X21lbnRpb24sbWVudGlvbicsXG4gIChib3QsIG1lc3NhZ2UpID0+IHtcblxuICAgIGJvdC5zdGFydENvbnZlcnNhdGlvbihtZXNzYWdlLCBmdW5jdGlvbihlcnIsIGNvbnZvKSB7XG5cbiAgICAgICAgY29udm8uYXNrKCdCZW4gamUgemVrZXIgZGF0IGplIG1lIHdpbHQgYWZzbHVpdGVuPycsIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuOiBib3QudXR0ZXJhbmNlcy55ZXMsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BvbnNlLCBjb252bykge1xuICAgICAgICAgICAgICAgICAgICBjb252by5zYXkoJ1NhbHVrZXMhJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnZvLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBwYXR0ZXJuOiBib3QudXR0ZXJhbmNlcy5ubyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcG9uc2UsIGNvbnZvKSB7XG4gICAgICAgICAgICAgICAgY29udm8uc2F5KCcqRmlldyEqJyk7XG4gICAgICAgICAgICAgICAgY29udm8ubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF0pO1xuICAgIH0pO1xuICB9XG4pO1xuXG5jb250cm9sbGVyLmhlYXJzKFxuICBbJ3ZlbG8nXSxcbiAgJ2RpcmVjdF9tZXNzYWdlLGRpcmVjdF9tZW50aW9uLG1lbnRpb24nLFxuICAoYm90LCBtZXNzYWdlKSA9PiB7XG4gICAgZ2V0VmVsb2tlcyhtZXNzYWdlKTtcbiAgfVxuKTtcblxuLyogSGFuZGxlIFZlbG9rZXMgUmVwbGllcyAqL1xuY29uc3QgZ2V0VmVsb2tlcyA9IChtZXNzYWdlLCBhdXRvbWF0aWMgPSBmYWxzZSwgY2hlY2tFbXB0eSA9IGZhbHNlKSA9PiB7XG5cbiAgZmV0Y2goJ2h0dHBzOi8vd3d3LnZlbG8tYW50d2VycGVuLmJlL2F2YWlsYWJpbGl0eV9tYXAvZ2V0SnNvbk9iamVjdCcpXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgIHN0YXRpb25zID0ganNvbjtcblxuICAgICAgbGV0IGNoZWNrcyA9IGhhbmRsZUNoZWNrcyhtZXNzYWdlLnRleHQpO1xuICAgICAgY2hlY2tzID0gcmVtb3ZlKGNoZWNrcywgY2hlY2sgPT4ge1xuICAgICAgICByZXR1cm4gY2hlY2sgIT09ICd2ZWxvJyB8fCBjaGVjayAhPT0gJ3ZlbG9rZSc7XG4gICAgICB9KTtcblxuICAgICAgc3RhdGlvbnMgPSBoYW5kbGVTZWxlY3RTdGF0aW9ucyhjaGVja3MpO1xuICAgICAgaGFuZGxlU3RhdGlvbnMobWVzc2FnZSwgYXV0b21hdGljLCBjaGVja0VtcHR5KTtcbiAgICB9KTtcbn07XG5cbmNvbnN0IGhhbmRsZUNoZWNrcyA9IChpbnB1dCkgPT4ge1xuXG4gIGlmKGlucHV0LmluY2x1ZGVzKHByb2Nlc3MuZW52LkJBU0VfQ0FNUCkpIHJldHVybiBwcm9jZXNzLmVudi5CQVNFX1NUQVRJT05TLnNwbGl0KCcsICcpOyAvL2NoZWNrIGlmIHRoZSBiYXNlY2FtcCBpcyBjYWxsZWRcbiAgZWxzZSByZXR1cm4gaW5wdXQuc3BsaXQoJyAnKTtcbn1cblxuY29uc3QgaGFuZGxlU2VsZWN0U3RhdGlvbnMgPSAoY2hlY2tzKSA9PiB7XG5cbiAgY29uc3Qgc2VsZWN0ZWRTdGF0aW9ucyA9IFtdO1xuXG4gIHN0YXRpb25zLmZvckVhY2goc3RhdGlvbiA9PiB7XG4gICAgY2hlY2tzLmZvckVhY2goY2hlY2sgPT4ge1xuXG4gICAgICBjaGVjayA9IHRvTG93ZXIoY2hlY2spO1xuICAgICAgY29uc3QgYWRkcmVzcyA9IHRvTG93ZXIoc3RhdGlvbi5hZGRyZXNzKTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0b0xvd2VyKHN0YXRpb24ubmFtZSk7XG4gICAgICBpZihhZGRyZXNzLmluY2x1ZGVzKGNoZWNrKSB8fCBuYW1lLmluY2x1ZGVzKGNoZWNrKSkgc2VsZWN0ZWRTdGF0aW9ucy5wdXNoKHN0YXRpb24pO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB1bmlxKHNlbGVjdGVkU3RhdGlvbnMpO1xufTtcblxuLyogY2hlY2sgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHN0YXRpb25zLCAxIHN0YXRpb24gb3Igbm8gc3RhdGlvbnMgKi9cbmNvbnN0IGhhbmRsZVN0YXRpb25zID0gKG1lc3NhZ2UsIGF1dG9tYXRpYywgY2hlY2tFbXB0eSkgPT4ge1xuXG4gIGlmKCFpc0VtcHR5KHN0YXRpb25zKSkge1xuXG4gICAgaWYoY2hlY2tFbXB0eSkgeyBoYW5kbGVDaGVja1N0YXRpb25zKHN0YXRpb25zLCBtZXNzYWdlLCBhdXRvbWF0aWMpIH0gLy9oYW5kbGVzIGZ1bmN0aW9uIHRvIGNoZWNrIGlmIGEgc3RhdGlvbiBpcyBlbXB0eVxuICAgIGVsc2UgaWYoc3RhdGlvbnMubGVuZ3RoID4gMSkgeyBoYW5kbGVSZXBsaWVzKHN0YXRpb25zLCBtZXNzYWdlLCB0cnVlLCBhdXRvbWF0aWMpOyB9XG4gICAgZWxzZSB7IGhhbmRsZVJlcGxpZXMoc3RhdGlvbnNbMF0sIG1lc3NhZ2UsIGF1dG9tYXRpYykgfVxuXG4gIH0gZWxzZSB7XG4gICAgZHJ1bmtGcmlkYXkgPyBib3QucmVwbHkobWVzc2FnZSwgRFJVTktfUkVQTFlfbm9fc3RhdGlvbnMpIDogYm90LnJlcGx5KG1lc3NhZ2UsIFJFUExZX25vX3N0YXRpb25zKTtcbiAgfVxuXG59O1xuXG4vKiBoYW5kbGUgYW5zd2VycyAqL1xuY29uc3QgaGFuZGxlUmVwbGllcyA9IChzdGF0aW9uLCBtZXNzYWdlLCBtdWx0aXBsZVN0YXRpb25zID0gZmFsc2UsIGF1dG9tYXRpYykgPT4ge1xuICAvL2F1dG9tYXRpYyBoYXBwZW5zIHdoZW4gYSBjcm9uIGpvYiBpcyBzZXRcblxuICBpZihtdWx0aXBsZVN0YXRpb25zKSB7XG5cbiAgICAvKiBoYW5kbGUgbXVsdGlwbGUgc3RhdGlvbnMgKi9cbiAgICBjb25zdCBzdGF0aW9uc1JlcGx5ID0gaGFuZGxlTXVsdGlwbGVTdGF0aW9uc1JlcGx5KCk7XG4gICAgaWYoYXV0b21hdGljKSBoYW5kbGVBdXRvbWF0aWNSZXBseShzdGF0aW9uc1JlcGx5KTtcbiAgICBlbHNlIGJvdC5yZXBseShtZXNzYWdlLCBzdGF0aW9uc1JlcGx5KTtcblxuICB9IGVsc2UgaWYoc3RhdGlvbi5iaWtlcyA+IDApIHtcblxuICAgIGlmKHN0YXRpb24uYmlrZXMgPCA1KSB7XG5cbiAgICAgIC8qIGhhbmRsZSBhbG1vc3QgZW1wdHkgc3RhdGlvbiAqL1xuICAgICAgaWYoYXV0b21hdGljKSB7XG4gICAgICAgIGRydW5rRnJpZGF5ID8gaGFuZGxlQXV0b21hdGljUmVwbHkoRFJVTktfUkVQTFlfYWxtb3N0X2VtcHR5KHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpIDogaGFuZGxlQXV0b21hdGljUmVwbHkoUkVQTFlfYWxtb3N0X2VtcHR5KHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJ1bmtGcmlkYXkgPyBib3QucmVwbHkobWVzc2FnZSwgRFJVTktfUkVQTFlfYWxtb3N0X2VtcHR5KHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpIDogYm90LnJlcGx5KG1lc3NhZ2UsIFJFUExZX2FsbW9zdF9lbXB0eShzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKTtcbiAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvKiBoYW5kbGUgc3RhdGlvbiAqL1xuICAgICAgaWYoYXV0b21hdGljKSB7XG4gICAgICAgIGRydW5rRnJpZGF5ID8gaGFuZGxlQXV0b21hdGljUmVwbHkoRFJVTktfUkVQTFlfZnVsbChzdGF0aW9uLmJpa2VzLCBzdGF0aW9uLmFkZHJlc3MpKSA6IGhhbmRsZUF1dG9tYXRpY1JlcGx5KFJFUExZX2Z1bGwoc3RhdGlvbi5iaWtlcywgc3RhdGlvbi5hZGRyZXNzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkcnVua0ZyaWRheSA/IGJvdC5yZXBseShtZXNzYWdlLCBEUlVOS19SRVBMWV9mdWxsKHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpIDogYm90LnJlcGx5KG1lc3NhZ2UsIFJFUExZX2Z1bGwoc3RhdGlvbi5iaWtlcywgc3RhdGlvbi5hZGRyZXNzKSk7XG4gICAgICB9O1xuICAgIH1cblxuICB9IGVsc2Uge1xuXG4gICAgLyogaGFuZGxlIGVtcHR5IHN0YXRpb24gKi9cbiAgICBpZihhdXRvbWF0aWMpIHtcbiAgICAgIGRydW5rRnJpZGF5ID8gaGFuZGxlQXV0b21hdGljUmVwbHkoRFJVTktfUkVQTFlfZW1wdHkoc3RhdGlvbi5hZGRyZXNzKSkgOiBoYW5kbGVBdXRvbWF0aWNSZXBseShSRVBMWV9lbXB0eShzdGF0aW9uLmFkZHJlc3MpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZHJ1bmtGcmlkYXkgPyBib3QucmVwbHkobWVzc2FnZSwgRFJVTktfUkVQTFlfZW1wdHkoc3RhdGlvbi5hZGRyZXNzKSkgOiBib3QucmVwbHkobWVzc2FnZSwgUkVQTFlfZW1wdHkoc3RhdGlvbi5hZGRyZXNzKSk7XG4gICAgfTtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlQXV0b21hdGljUmVwbHkgPSByZXBseSA9PiB7XG4gIGJvdC5zYXkoe1xuICAgIHRleHQ6IHJlcGx5LFxuICAgIGNoYW5uZWw6IHByb2Nlc3MuZW52Lk1BSU5fQ0hBTk5FTFxuICB9KTtcbn07XG5cbmNvbnN0IGhhbmRsZUNoZWNrU3RhdGlvbnMgPSAoc3RhdGlvbnMsIG1lc3NhZ2UsIGF1dG9tYXRpYykgPT4ge1xuICAvKiBDaGVja3MgaWYgb25lIG9mIHlvdXIgYmFzZSBzdGF0aW9ucyBpcyBlbXB0eSwgaWYgc28gc2VuZCBhIG1lc3NhZ2UgKi9cbiAgbGV0IGVtcHR5U3RhdGlvbiA9IGZhbHNlO1xuXG4gIHN0YXRpb25zLmZvckVhY2goc3RhdGlvbiA9PiB7XG4gICAgaWYoc3RhdGlvbi5iaWtlcyA9PT0gMCkgZW1wdHlTdGF0aW9uID0gdHJ1ZTtcbiAgfSk7XG5cbiAgaWYoZW1wdHlTdGF0aW9uKSB7XG4gICAgKHN0YXRpb25zLmxlbmd0aCA+IDEpID8gaGFuZGxlUmVwbGllcyhzdGF0aW9ucywgbWVzc2FnZSwgdHJ1ZSwgYXV0b21hdGljKSA6IGhhbmRsZVJlcGxpZXMoc3RhdGlvbnMsIG1lc3NhZ2UsIGZhbHNlLCBhdXRvbWF0aWMpO1xuICB9XG59O1xuXG5jb25zdCBoYW5kbGVNdWx0aXBsZVN0YXRpb25zUmVwbHkgPSAoKSA9PiB7XG4gIGNvbnN0IHJlcGxpZXMgPSBbXTtcbiAgc3RhdGlvbnMuZm9yRWFjaChzdGF0aW9uID0+IHtcbiAgICBkcnVua0ZyaWRheSA/IHJlcGxpZXMucHVzaChEUlVOS19SRVBMWV9tb3JlX3N0YXRpb25zKHN0YXRpb24uYmlrZXMsIHN0YXRpb24uYWRkcmVzcykpIDogcmVwbGllcy5wdXNoKFJFUExZX21vcmVfc3RhdGlvbnMoc3RhdGlvbi5iaWtlcywgc3RhdGlvbi5hZGRyZXNzKSk7XG4gIH0pO1xuXG4gIHJldHVybiBcIlwiLmNvbmNhdCguLi5yZXBsaWVzKTtcbn07XG5cbi8qIENyb24gSm9iICovXG5jb25zdCBoYW5kbGVDcm9uSm9icyA9ICgpID0+IHtcblxuICBoYW5kbGVEYWlseVVwZGF0ZSgpO1xuICBoYW5kbGVEcnVua0ZyaWRheSgpO1xuICBoYW5kbGVDaGVja2VyKCk7XG5cbn07XG5cbmNvbnN0IGhhbmRsZURhaWx5VXBkYXRlID0gKCkgPT4ge1xuICAvKiB1cGRhdGUgb24gYSBjZXJ0YWluIHRpbWUgICovXG5cbiAgaWYocHJvY2Vzcy5lbnYuQVVUT19USU1FUikge1xuXG4gICAgY29uc3Qgam9iID0gbmV3IENyb25Kb2Ioe1xuICAgICAgY3JvblRpbWU6IHByb2Nlc3MuZW52LkFVVE9fVElNRVIsXG4gICAgICBvblRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBnZXRWZWxva2VzKHt0ZXh0OiBwcm9jZXNzLmVudi5CQVNFX0NBTVB9LCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBzdGFydDogZmFsc2UsXG4gICAgICB0aW1lWm9uZTogJ0V1cm9wZS9BbXN0ZXJkYW0nXG4gICAgfSk7XG5cbiAgICBqb2Iuc3RhcnQoKTtcblxuICB9XG59O1xuXG5jb25zdCBoYW5kbGVEcnVua0ZyaWRheSA9ICgpID0+IHtcbiAgLyogZHJ1bmsgbWVzc2FnZXMgb24gZnJpZGF5ICovXG5cbiAgY29uc3Qgam9iID0gbmV3IENyb25Kb2Ioe1xuICAgIGNyb25UaW1lOiAnKiAqICogKiAqIDUnLFxuICAgIG9uVGljazogZnVuY3Rpb24oKSB7XG4gICAgICBkcnVua0ZyaWRheSA9IHRydWU7XG4gICAgfSxcbiAgICBzdGFydDogZmFsc2UsXG4gICAgdGltZVpvbmU6ICdFdXJvcGUvQW1zdGVyZGFtJ1xuICB9KTtcblxuICBqb2Iuc3RhcnQoKTtcblxufTtcblxuY29uc3QgaGFuZGxlQ2hlY2tlciA9ICgpID0+IHtcbiAgLyogY2hlY2tzIGJldHdlZW4gY2VydGFpbiB0aW1lIGlmIHRoZSBiYXNlIHN0YXRpb25zIGFyZSBlbXRweSAqL1xuICBpZihwcm9jZXNzLmVudi5BVVRPX0NIRUNLRVIpIHtcblxuICAgIGNvbnN0IGpvYiA9IG5ldyBDcm9uSm9iKHtcbiAgICAgIGNyb25UaW1lOiBwcm9jZXNzLmVudi5BVVRPX0NIRUNLRVIsXG4gICAgICBvblRpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICBnZXRWZWxva2VzKHt0ZXh0OiBwcm9jZXNzLmVudi5CQVNFX0NBTVB9LCB0cnVlLCB0cnVlKTtcbiAgICAgIH0sXG4gICAgICBzdGFydDogZmFsc2UsXG4gICAgICB0aW1lWm9uZTogJ0V1cm9wZS9BbXN0ZXJkYW0nXG4gICAgfSk7XG5cbiAgICBqb2Iuc3RhcnQoKTtcblxuICB9XG59O1xuXG5oYW5kbGVDcm9uSm9icygpO1xuIl19