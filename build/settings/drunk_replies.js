'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DRUNK_REPLY_hello = exports.DRUNK_REPLY_hello = 'TGIF, biatch! Eindelijk kun je wat blijven plakken vanavond. Nu je toch met het veloke gaat.';
var DRUNK_REPLY_hello_user = exports.DRUNK_REPLY_hello_user = function DRUNK_REPLY_hello_user(name) {
  return 'Allez ' + name + ', hebde eindelijk u kaartje te pakken? Welkom bij het Antwaarps Veloken dat u van de groenplaats naar het zuid brengt.';
};

var DRUNK_REPLY_full = exports.DRUNK_REPLY_full = function DRUNK_REPLY_full(bikes, address) {

  var replies = ['Jupi jupi jupi! Ah de velokes? Denk dat er nog `' + bikes + '` zijn in ' + address + '.', 'Waren het nu `' + bikes + '` of `' + bikes * 2 + '` velokes?', 'Wacht ze, oei tga wat moeilijk. Ik moet mij effe zetten. Ja eum `' + bikes + '`. * blurp *'];

  return replies[Math.floor(Math.random() * (replies.length - 0) + 0)];
};

var DRUNK_REPLY_almost_empty = exports.DRUNK_REPLY_almost_empty = function DRUNK_REPLY_almost_empty(bikes, address) {
  return 'Blijf nog maar effe plakken! Het rek is toch bekan leeg. Ik zie er maar `' + bikes + '`';
};

var DRUNK_REPLY_empty = exports.DRUNK_REPLY_empty = function DRUNK_REPLY_empty(address) {
  return 'Jeuj nog een pintje! Het rek is toch leeg van ' + address + '.';
};

var DRUNK_REPLY_no_stations = exports.DRUNK_REPLY_no_stations = 'Al zat zeker? Zatlap. Chance da ge met het veloke gaat eh.';

var DRUNK_REPLY_more_stations = exports.DRUNK_REPLY_more_stations = function DRUNK_REPLY_more_stations(bikes, address) {

  var replies = [address + ': `' + bikes + '` velokes, zie ik dat nu dubbel?\n', 'Jupi jupi jupi! Ah de velokes? Denk dat er nog `' + bikes + '` zijn in ' + address + '.\n', 'Waren het er nu `' + bikes + '` of `' + bikes * 2 + '`\n', 'Wacht ze, oei tga wat moeilijk. Ik moet mij effe zetten. Ja eum `' + bikes + '` in ' + address + '. * blurp *\n', 'Ga jij al naar huis? TGIF! Maar om naar dat ander feestje te geraken staan er nog `' + bikes + '` in het rek van ' + address + '.\n'];

  return replies[Math.floor(Math.random() * (replies.length - 0) + 0)];
};

exports.default = {
  DRUNK_REPLY_hello: DRUNK_REPLY_hello,
  DRUNK_REPLY_hello_user: DRUNK_REPLY_hello_user,
  DRUNK_REPLY_full: DRUNK_REPLY_full,
  DRUNK_REPLY_almost_empty: DRUNK_REPLY_almost_empty,
  DRUNK_REPLY_empty: DRUNK_REPLY_empty,
  DRUNK_REPLY_no_stations: DRUNK_REPLY_no_stations,
  DRUNK_REPLY_more_stations: DRUNK_REPLY_more_stations
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXR0aW5ncy9kcnVua19yZXBsaWVzLmpzIl0sIm5hbWVzIjpbIkRSVU5LX1JFUExZX2hlbGxvIiwiRFJVTktfUkVQTFlfaGVsbG9fdXNlciIsIm5hbWUiLCJEUlVOS19SRVBMWV9mdWxsIiwiYmlrZXMiLCJhZGRyZXNzIiwicmVwbGllcyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsIkRSVU5LX1JFUExZX2FsbW9zdF9lbXB0eSIsIkRSVU5LX1JFUExZX2VtcHR5IiwiRFJVTktfUkVQTFlfbm9fc3RhdGlvbnMiLCJEUlVOS19SRVBMWV9tb3JlX3N0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFPLElBQU1BLGdEQUFvQiw4RkFBMUI7QUFDQSxJQUFNQywwREFBeUIsU0FBekJBLHNCQUF5QixDQUFDQyxJQUFELEVBQVU7QUFDOUMsb0JBQWdCQSxJQUFoQjtBQUNELENBRk07O0FBSUEsSUFBTUMsOENBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsS0FBRCxFQUFRQyxPQUFSLEVBQW9COztBQUVsRCxNQUFNQyxVQUFVLHNEQUNzQ0YsS0FEdEMsa0JBQ3lEQyxPQUR6RCwyQkFFSUQsS0FGSixjQUVvQkEsUUFBUSxDQUY1Qix1RkFHdURBLEtBSHZELGtCQUFoQjs7QUFNQSxTQUFPRSxRQUFRQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsTUFBaUJILFFBQVFJLE1BQVIsR0FBaUIsQ0FBbEMsSUFBdUMsQ0FBbEQsQ0FBUixDQUFQO0FBQ0QsQ0FUTTs7QUFXQSxJQUFNQyw4REFBMkIsU0FBM0JBLHdCQUEyQixDQUFDUCxLQUFELEVBQVFDLE9BQVIsRUFBb0I7QUFDMUQsdUZBQW9GRCxLQUFwRjtBQUNELENBRk07O0FBSUEsSUFBTVEsZ0RBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBQ1AsT0FBRCxFQUFhO0FBQzVDLDREQUF3REEsT0FBeEQ7QUFDRCxDQUZNOztBQUlBLElBQU1RLDREQUEwQiw0REFBaEM7O0FBRUEsSUFBTUMsZ0VBQTRCLFNBQTVCQSx5QkFBNEIsQ0FBQ1YsS0FBRCxFQUFRQyxPQUFSLEVBQW9COztBQUUzRCxNQUFNQyxVQUFVLENBQ1hELE9BRFcsV0FDR0QsS0FESCw4RkFFc0NBLEtBRnRDLGtCQUV5REMsT0FGekQsZ0NBR09ELEtBSFAsY0FHdUJBLFFBQVEsQ0FIL0IsZ0ZBSXVEQSxLQUp2RCxhQUlxRUMsT0FKckUsNEdBS3lFRCxLQUx6RSx5QkFLbUdDLE9BTG5HLFNBQWhCOztBQVFBLFNBQU9DLFFBQVFDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxNQUFpQkgsUUFBUUksTUFBUixHQUFpQixDQUFsQyxJQUF1QyxDQUFsRCxDQUFSLENBQVA7QUFFRCxDQVpNOztrQkFjUTtBQUNiVixzQ0FEYTtBQUViQyxnREFGYTtBQUdiRSxvQ0FIYTtBQUliUSxvREFKYTtBQUtiQyxzQ0FMYTtBQU1iQyxrREFOYTtBQU9iQztBQVBhLEMiLCJmaWxlIjoiZHJ1bmtfcmVwbGllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBEUlVOS19SRVBMWV9oZWxsbyA9ICdUR0lGLCBiaWF0Y2ghIEVpbmRlbGlqayBrdW4gamUgd2F0IGJsaWp2ZW4gcGxha2tlbiB2YW5hdm9uZC4gTnUgamUgdG9jaCBtZXQgaGV0IHZlbG9rZSBnYWF0Lic7XG5leHBvcnQgY29uc3QgRFJVTktfUkVQTFlfaGVsbG9fdXNlciA9IChuYW1lKSA9PiB7XG4gIHJldHVybiBgQWxsZXogJHtuYW1lfSwgaGViZGUgZWluZGVsaWprIHUga2FhcnRqZSB0ZSBwYWtrZW4/IFdlbGtvbSBiaWogaGV0IEFudHdhYXJwcyBWZWxva2VuIGRhdCB1IHZhbiBkZSBncm9lbnBsYWF0cyBuYWFyIGhldCB6dWlkIGJyZW5ndC5gO1xufTtcblxuZXhwb3J0IGNvbnN0IERSVU5LX1JFUExZX2Z1bGwgPSAoYmlrZXMsIGFkZHJlc3MpID0+IHtcblxuICBjb25zdCByZXBsaWVzID0gW1xuICAgIGBKdXBpIGp1cGkganVwaSEgQWggZGUgdmVsb2tlcz8gRGVuayBkYXQgZXIgbm9nIFxcYCR7YmlrZXN9XFxgIHppam4gaW4gJHthZGRyZXNzfS5gLFxuICAgIGBXYXJlbiBoZXQgbnUgXFxgJHtiaWtlc31cXGAgb2YgXFxgJHtiaWtlcyAqIDJ9XFxgIHZlbG9rZXM/YCxcbiAgICBgV2FjaHQgemUsIG9laSB0Z2Egd2F0IG1vZWlsaWprLiBJayBtb2V0IG1paiBlZmZlIHpldHRlbi4gSmEgZXVtIFxcYCR7YmlrZXN9XFxgLiAqIGJsdXJwICpgLFxuICBdO1xuXG4gIHJldHVybiByZXBsaWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyZXBsaWVzLmxlbmd0aCAtIDApICsgMCldO1xufVxuXG5leHBvcnQgY29uc3QgRFJVTktfUkVQTFlfYWxtb3N0X2VtcHR5ID0gKGJpa2VzLCBhZGRyZXNzKSA9PiB7XG4gIHJldHVybiBgQmxpamYgbm9nIG1hYXIgZWZmZSBwbGFra2VuISBIZXQgcmVrIGlzIHRvY2ggYmVrYW4gbGVlZy4gSWsgemllIGVyIG1hYXIgXFxgJHtiaWtlc31cXGBgO1xufTtcblxuZXhwb3J0IGNvbnN0IERSVU5LX1JFUExZX2VtcHR5ID0gKGFkZHJlc3MpID0+IHtcbiAgcmV0dXJuIGBKZXVqIG5vZyBlZW4gcGludGplISBIZXQgcmVrIGlzIHRvY2ggbGVlZyB2YW4gJHthZGRyZXNzfS5gO1xufTtcblxuZXhwb3J0IGNvbnN0IERSVU5LX1JFUExZX25vX3N0YXRpb25zID0gJ0FsIHphdCB6ZWtlcj8gWmF0bGFwLiBDaGFuY2UgZGEgZ2UgbWV0IGhldCB2ZWxva2UgZ2FhdCBlaC4nO1xuXG5leHBvcnQgY29uc3QgRFJVTktfUkVQTFlfbW9yZV9zdGF0aW9ucyA9IChiaWtlcywgYWRkcmVzcykgPT4ge1xuXG4gIGNvbnN0IHJlcGxpZXMgPSBbXG4gICAgYCR7YWRkcmVzc306IFxcYCR7YmlrZXN9XFxgIHZlbG9rZXMsIHppZSBpayBkYXQgbnUgZHViYmVsP1xcbmAsXG4gICAgYEp1cGkganVwaSBqdXBpISBBaCBkZSB2ZWxva2VzPyBEZW5rIGRhdCBlciBub2cgXFxgJHtiaWtlc31cXGAgemlqbiBpbiAke2FkZHJlc3N9LlxcbmAsXG4gICAgYFdhcmVuIGhldCBlciBudSBcXGAke2Jpa2VzfVxcYCBvZiBcXGAke2Jpa2VzICogMn1cXGBcXG5gLFxuICAgIGBXYWNodCB6ZSwgb2VpIHRnYSB3YXQgbW9laWxpamsuIElrIG1vZXQgbWlqIGVmZmUgemV0dGVuLiBKYSBldW0gXFxgJHtiaWtlc31cXGAgaW4gJHthZGRyZXNzfS4gKiBibHVycCAqXFxuYCxcbiAgICBgR2EgamlqIGFsIG5hYXIgaHVpcz8gVEdJRiEgTWFhciBvbSBuYWFyIGRhdCBhbmRlciBmZWVzdGplIHRlIGdlcmFrZW4gc3RhYW4gZXIgbm9nIFxcYCR7YmlrZXN9XFxgIGluIGhldCByZWsgdmFuICR7YWRkcmVzc30uXFxuYFxuICBdO1xuXG4gIHJldHVybiByZXBsaWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyZXBsaWVzLmxlbmd0aCAtIDApICsgMCldO1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIERSVU5LX1JFUExZX2hlbGxvLFxuICBEUlVOS19SRVBMWV9oZWxsb191c2VyLFxuICBEUlVOS19SRVBMWV9mdWxsLFxuICBEUlVOS19SRVBMWV9hbG1vc3RfZW1wdHksXG4gIERSVU5LX1JFUExZX2VtcHR5LFxuICBEUlVOS19SRVBMWV9ub19zdGF0aW9ucyxcbiAgRFJVTktfUkVQTFlfbW9yZV9zdGF0aW9uc1xufTtcbiJdfQ==