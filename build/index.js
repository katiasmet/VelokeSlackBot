'use strict';

var _botkit = require('botkit');

var _botkit2 = _interopRequireDefault(_botkit);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = _botkit2.default.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.BOT_API_KEY
}).startRTM();

var stations;

controller.hears(['hello', 'hi', 'hallo', 'yo', 'ieps', 'hoi', 'hey', 'allo'], 'direct_message,direct_mention,mention', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, 'Allez ' + user.name + ', hebde eindelijk u kaartje te pakken? Welkom bij het Antwaarps Veloken dat u van de groenplaats naar het zuid brengt.');
        } else {
            bot.reply(message, 'Eindelijk dat kaartje te pakken! Welkom bij het Antwaarps veloke dat u van de groenplaats naar het zuid brengt.');
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
    getVelokes('street', message);
});

getVelokes = function getVelokes(information, message) {
    (0, _nodeFetch2.default)('https://www.velo-antwerpen.be/availability_map/getJsonObject').then(function (res) {
        return res.json();
    }).then(function (json) {
        stations = json;
        if (information === 'street') {
            stations = getVelokeByStreet(message);
            handleStations(message);
        }
    });
};

getVelokeByStreet = function getVelokeByStreet(message) {
    console.log('get veloken by street');
    stations.forEach(function (station) {
        console.log(station.address);
        if (station.address.includes('Astrid') || station.name.includes('Astrid')) return station;
        return false;
    });
};

handleStations = function handleStations(message) {

    console.log('handle stations');

    if (stations) {
        if (stations.length > 1) {
            stations.forEach(function (station) {
                handleReplies(station, message);
            });
        } else {
            handleReplies(stations, message);
        }
    } else {
        bot.reply(message, 'Er is daar geen velostationeke.');
    }
};

handleReplies = function handleReplies(station, message) {
    if (station.bikes > 0) {

        if (station.bikes < 5) {
            bot.reply(message, 'Haast u! Er zijn nog maar ' + station.bikes + 'in het rek van ' + station.address);
        } else {
            bot.reply(message, 'Op het gemakske, er zijn ' + station.bikes + 'in het rek van ' + station.address);
        }
    } else {
        bot.reply(message, 'Tis weer van dat! Er zijn geen velokes meer in ' + station.address);
    }
};

formatUptime = function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb250cm9sbGVyIiwic2xhY2tib3QiLCJkZWJ1ZyIsImJvdCIsInNwYXduIiwidG9rZW4iLCJwcm9jZXNzIiwiZW52IiwiQk9UX0FQSV9LRVkiLCJzdGFydFJUTSIsInN0YXRpb25zIiwiaGVhcnMiLCJtZXNzYWdlIiwic3RvcmFnZSIsInVzZXJzIiwiZ2V0IiwidXNlciIsImVyciIsIm5hbWUiLCJyZXBseSIsInN0YXJ0Q29udmVyc2F0aW9uIiwiY29udm8iLCJhc2siLCJwYXR0ZXJuIiwidXR0ZXJhbmNlcyIsInllcyIsImNhbGxiYWNrIiwicmVzcG9uc2UiLCJzYXkiLCJuZXh0Iiwic2V0VGltZW91dCIsImV4aXQiLCJubyIsImRlZmF1bHQiLCJnZXRWZWxva2VzIiwiaW5mb3JtYXRpb24iLCJ0aGVuIiwicmVzIiwianNvbiIsImdldFZlbG9rZUJ5U3RyZWV0IiwiaGFuZGxlU3RhdGlvbnMiLCJjb25zb2xlIiwibG9nIiwiZm9yRWFjaCIsInN0YXRpb24iLCJhZGRyZXNzIiwiaW5jbHVkZXMiLCJsZW5ndGgiLCJoYW5kbGVSZXBsaWVzIiwiYmlrZXMiLCJmb3JtYXRVcHRpbWUiLCJ1cHRpbWUiLCJ1bml0Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsaUJBQU9DLFFBQVAsQ0FBZ0I7QUFDL0JDLFdBQU87QUFEd0IsQ0FBaEIsQ0FBbkI7O0FBSUEsSUFBTUMsTUFBTUgsV0FBV0ksS0FBWCxDQUFpQjtBQUN6QkMsV0FBT0MsUUFBUUMsR0FBUixDQUFZQztBQURNLENBQWpCLEVBRVRDLFFBRlMsRUFBWjs7QUFJQSxJQUFJQyxRQUFKOztBQUVBVixXQUFXVyxLQUFYLENBQWlCLENBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFBeUIsSUFBekIsRUFBK0IsTUFBL0IsRUFBdUMsS0FBdkMsRUFBOEMsS0FBOUMsRUFBcUQsTUFBckQsQ0FBakIsRUFBK0Us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ImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCb3RraXQgZnJvbSAnYm90a2l0JztcbmltcG9ydCBmZXRjaCBmcm9tICdub2RlLWZldGNoJztcblxuY29uc3QgY29udHJvbGxlciA9IEJvdGtpdC5zbGFja2JvdCh7XG4gICAgZGVidWc6IHRydWUsXG59KTtcblxuY29uc3QgYm90ID0gY29udHJvbGxlci5zcGF3bih7XG4gICAgdG9rZW46IHByb2Nlc3MuZW52LkJPVF9BUElfS0VZXG59KS5zdGFydFJUTSgpO1xuXG52YXIgc3RhdGlvbnM7XG5cbmNvbnRyb2xsZXIuaGVhcnMoWydoZWxsbycsICdoaScsICdoYWxsbycsICd5bycsICdpZXBzJywgJ2hvaScsICdoZXknLCAnYWxsbyddLCAnZGlyZWN0X21lc3NhZ2UsZGlyZWN0X21lbnRpb24sbWVudGlvbicsIGZ1bmN0aW9uKGJvdCwgbWVzc2FnZSkge1xuXG4gIGNvbnRyb2xsZXIuc3RvcmFnZS51c2Vycy5nZXQobWVzc2FnZS51c2VyLCBmdW5jdGlvbihlcnIsIHVzZXIpIHtcbiAgICAgIGlmICh1c2VyICYmIHVzZXIubmFtZSkge1xuICAgICAgICAgIGJvdC5yZXBseShtZXNzYWdlLCAnQWxsZXogJyArIHVzZXIubmFtZSArICcsIGhlYmRlIGVpbmRlbGlqayB1IGthYXJ0amUgdGUgcGFra2VuPyBXZWxrb20gYmlqIGhldCBBbnR3YWFycHMgVmVsb2tlbiBkYXQgdSB2YW4gZGUgZ3JvZW5wbGFhdHMgbmFhciBoZXQgenVpZCBicmVuZ3QuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvdC5yZXBseShtZXNzYWdlLCAnRWluZGVsaWprIGRhdCBrYWFydGplIHRlIHBha2tlbiEgV2Vsa29tIGJpaiBoZXQgQW50d2FhcnBzIHZlbG9rZSBkYXQgdSB2YW4gZGUgZ3JvZW5wbGFhdHMgbmFhciBoZXQgenVpZCBicmVuZ3QuJyk7XG4gICAgICB9XG4gIH0pO1xufSk7XG5cbmNvbnRyb2xsZXIuaGVhcnMoWydzaHV0ZG93biddLCAnZGlyZWN0X21lc3NhZ2UsZGlyZWN0X21lbnRpb24sbWVudGlvbicsIGZ1bmN0aW9uKGJvdCwgbWVzc2FnZSkge1xuXG4gICAgYm90LnN0YXJ0Q29udmVyc2F0aW9uKG1lc3NhZ2UsIGZ1bmN0aW9uKGVyciwgY29udm8pIHtcblxuICAgICAgICBjb252by5hc2soJ0JlbiBqZSB6ZWtlciBkYXQgamUgbWUgd2lsdCBhZnNsdWl0ZW4/JywgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhdHRlcm46IGJvdC51dHRlcmFuY2VzLnllcyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcG9uc2UsIGNvbnZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnZvLnNheSgnU2FsdWtlcyEnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udm8ubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBhdHRlcm46IGJvdC51dHRlcmFuY2VzLm5vLFxuICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwb25zZSwgY29udm8pIHtcbiAgICAgICAgICAgICAgICBjb252by5zYXkoJypGaWV3ISonKTtcbiAgICAgICAgICAgICAgICBjb252by5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG59KTtcblxuY29udHJvbGxlci5oZWFycyhbJ3ZlbG8nXSwgJ2RpcmVjdF9tZXNzYWdlLGRpcmVjdF9tZW50aW9uLG1lbnRpb24nLCBmdW5jdGlvbihib3QsIG1lc3NhZ2UpIHtcbiAgICBnZXRWZWxva2VzKCdzdHJlZXQnLCBtZXNzYWdlKTtcbn0pO1xuXG5nZXRWZWxva2VzID0gKGluZm9ybWF0aW9uLCBtZXNzYWdlKSA9PiB7XG4gIGZldGNoKCdodHRwczovL3d3dy52ZWxvLWFudHdlcnBlbi5iZS9hdmFpbGFiaWxpdHlfbWFwL2dldEpzb25PYmplY3QnKVxuICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICBzdGF0aW9ucyA9IGpzb247XG4gICAgICBpZihpbmZvcm1hdGlvbiA9PT0gJ3N0cmVldCcpIHtcbiAgICAgICAgc3RhdGlvbnMgPSBnZXRWZWxva2VCeVN0cmVldChtZXNzYWdlKTtcbiAgICAgICAgaGFuZGxlU3RhdGlvbnMobWVzc2FnZSk7XG4gICAgICB9XG4gICAgfSk7XG59XG5cbmdldFZlbG9rZUJ5U3RyZWV0ID0gKG1lc3NhZ2UpID0+IHtcbiAgY29uc29sZS5sb2coJ2dldCB2ZWxva2VuIGJ5IHN0cmVldCcpO1xuICBzdGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHN0YXRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhzdGF0aW9uLmFkZHJlc3MpO1xuICAgIGlmKHN0YXRpb24uYWRkcmVzcy5pbmNsdWRlcygnQXN0cmlkJykgfHwgc3RhdGlvbi5uYW1lLmluY2x1ZGVzKCdBc3RyaWQnKSkgcmV0dXJuIHN0YXRpb247XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbn1cblxuXG5oYW5kbGVTdGF0aW9ucyA9IChtZXNzYWdlKSA9PiB7XG5cbiAgY29uc29sZS5sb2coJ2hhbmRsZSBzdGF0aW9ucycpO1xuXG4gIGlmKHN0YXRpb25zKSB7XG4gICAgaWYoc3RhdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgc3RhdGlvbnMuZm9yRWFjaChzdGF0aW9uID0+IHtcbiAgICAgICAgaGFuZGxlUmVwbGllcyhzdGF0aW9uLCBtZXNzYWdlKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVSZXBsaWVzKHN0YXRpb25zLCBtZXNzYWdlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYm90LnJlcGx5KG1lc3NhZ2UsICdFciBpcyBkYWFyIGdlZW4gdmVsb3N0YXRpb25la2UuJyk7XG4gIH1cblxuXG59XG5cbmhhbmRsZVJlcGxpZXMgPSAoc3RhdGlvbiwgbWVzc2FnZSkgPT4ge1xuICBpZihzdGF0aW9uLmJpa2VzID4gMCkge1xuXG4gICAgaWYoc3RhdGlvbi5iaWtlcyA8IDUpIHtcbiAgICAgIGJvdC5yZXBseShtZXNzYWdlLCAnSGFhc3QgdSEgRXIgemlqbiBub2cgbWFhciAnICsgc3RhdGlvbi5iaWtlcyArICdpbiBoZXQgcmVrIHZhbiAnICsgc3RhdGlvbi5hZGRyZXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm90LnJlcGx5KG1lc3NhZ2UsICdPcCBoZXQgZ2VtYWtza2UsIGVyIHppam4gJyArIHN0YXRpb24uYmlrZXMgKyAnaW4gaGV0IHJlayB2YW4gJyArIHN0YXRpb24uYWRkcmVzcyk7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgYm90LnJlcGx5KG1lc3NhZ2UsICdUaXMgd2VlciB2YW4gZGF0ISBFciB6aWpuIGdlZW4gdmVsb2tlcyBtZWVyIGluICcgKyBzdGF0aW9uLmFkZHJlc3MgKTtcbiAgfVxufVxuXG5mb3JtYXRVcHRpbWUgPSAodXB0aW1lKSA9PiB7XG4gICAgdmFyIHVuaXQgPSAnc2Vjb25kJztcbiAgICBpZiAodXB0aW1lID4gNjApIHtcbiAgICAgICAgdXB0aW1lID0gdXB0aW1lIC8gNjA7XG4gICAgICAgIHVuaXQgPSAnbWludXRlJztcbiAgICB9XG4gICAgaWYgKHVwdGltZSA+IDYwKSB7XG4gICAgICAgIHVwdGltZSA9IHVwdGltZSAvIDYwO1xuICAgICAgICB1bml0ID0gJ2hvdXInO1xuICAgIH1cbiAgICBpZiAodXB0aW1lICE9IDEpIHtcbiAgICAgICAgdW5pdCA9IHVuaXQgKyAncyc7XG4gICAgfVxuXG4gICAgdXB0aW1lID0gdXB0aW1lICsgJyAnICsgdW5pdDtcbiAgICByZXR1cm4gdXB0aW1lO1xufVxuIl19