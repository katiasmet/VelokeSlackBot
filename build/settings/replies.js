'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var REPLY_hello = exports.REPLY_hello = 'Eindelijk dat kaartje te pakken! Welkom bij het Antwaarps veloke dat u van de groenplaats naar het zuid brengt.';
var REPLY_hello_user = exports.REPLY_hello_user = function REPLY_hello_user(name) {
  return 'Allez ' + name + ', hebde eindelijk u kaartje te pakken? Welkom bij het Antwaarps Veloken dat u van de groenplaats naar het zuid brengt.';
};

var REPLY_full = exports.REPLY_full = function REPLY_full(bikes, address) {

  var replies = ['Op het gemakske, er zijn ' + bikes + ' velokes in het rek van ' + address + '.', 'Chill, er zijn ' + bikes + ' velokes in het rek van ' + address + '.', 'Amai, in het rek van ' + address + ' zijn er nog ' + bikes + ' velokes.', 'Geen stress! In het rek van ' + address + ' zijn er nog ' + bikes + ' velokes.'];

  return replies[Math.floor(Math.rnd() * (replies.length - 0) + 0)];
};

var REPLY_almost_empty = exports.REPLY_almost_empty = function REPLY_almost_empty(bikes, address) {
  return 'Haast u! Er zijn nog maar ' + bikes + ' velokes in het rek van ' + address + '.';
};

var REPLY_empty = exports.REPLY_empty = function REPLY_empty(address) {
  return 'Tis weer van dat! Er zijn geen velokes meer in ' + address + '.';
};

var REPLY_no_stations = exports.REPLY_no_stations = 'Daar zijn geen stations. Probeer een ander adres.';

var REPLY_more_stations = exports.REPLY_more_stations = function REPLY_more_stations(bikes, address) {
  return address + ': `' + bikes + '` velokes\n';
};

exports.default = {
  REPLY_hello: REPLY_hello,
  REPLY_hello_user: REPLY_hello_user,
  REPLY_full: REPLY_full,
  REPLY_almost_empty: REPLY_almost_empty,
  REPLY_empty: REPLY_empty,
  REPLY_no_stations: REPLY_no_stations,
  REPLY_more_stations: REPLY_more_stations
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXR0aW5ncy9yZXBsaWVzLmpzIl0sIm5hbWVzIjpbIlJFUExZX2hlbGxvIiwiUkVQTFlfaGVsbG9fdXNlciIsIm5hbWUiLCJSRVBMWV9mdWxsIiwiYmlrZXMiLCJhZGRyZXNzIiwicmVwbGllcyIsIk1hdGgiLCJmbG9vciIsInJuZCIsImxlbmd0aCIsIlJFUExZX2FsbW9zdF9lbXB0eSIsIlJFUExZX2VtcHR5IiwiUkVQTFlfbm9fc3RhdGlvbnMiLCJSRVBMWV9tb3JlX3N0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFPLElBQU1BLG9DQUFjLGlIQUFwQjtBQUNBLElBQU1DLDhDQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNDLElBQUQsRUFBVTtBQUN4QyxvQkFBZ0JBLElBQWhCO0FBQ0QsQ0FGTTs7QUFJQSxJQUFNQyxrQ0FBYSxTQUFiQSxVQUFhLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFvQjs7QUFFNUMsTUFBTUMsVUFBVSwrQkFDY0YsS0FEZCxnQ0FDOENDLE9BRDlDLDRCQUVJRCxLQUZKLGdDQUVvQ0MsT0FGcEMsa0NBR1VBLE9BSFYscUJBR2lDRCxLQUhqQyxpREFJaUJDLE9BSmpCLHFCQUl3Q0QsS0FKeEMsZUFBaEI7O0FBT0EsU0FBT0UsUUFBUUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxHQUFMLE1BQWNILFFBQVFJLE1BQVIsR0FBaUIsQ0FBL0IsSUFBb0MsQ0FBL0MsQ0FBUixDQUFQO0FBQ0QsQ0FWTTs7QUFZQSxJQUFNQyxrREFBcUIsU0FBckJBLGtCQUFxQixDQUFDUCxLQUFELEVBQVFDLE9BQVIsRUFBb0I7QUFDcEQsd0NBQW9DRCxLQUFwQyxnQ0FBb0VDLE9BQXBFO0FBQ0QsQ0FGTTs7QUFJQSxJQUFNTyxvQ0FBYyxTQUFkQSxXQUFjLENBQUNQLE9BQUQsRUFBYTtBQUN0Qyw2REFBeURBLE9BQXpEO0FBQ0QsQ0FGTTs7QUFJQSxJQUFNUSxnREFBb0IsbURBQTFCOztBQUVBLElBQU1DLG9EQUFzQixTQUF0QkEsbUJBQXNCLENBQUNWLEtBQUQsRUFBUUMsT0FBUixFQUFvQjtBQUNyRCxTQUFVQSxPQUFWLFdBQXdCRCxLQUF4QjtBQUNELENBRk07O2tCQUlRO0FBQ2JKLDBCQURhO0FBRWJDLG9DQUZhO0FBR2JFLHdCQUhhO0FBSWJRLHdDQUphO0FBS2JDLDBCQUxhO0FBTWJDLHNDQU5hO0FBT2JDO0FBUGEsQyIsImZpbGUiOiJyZXBsaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFJFUExZX2hlbGxvID0gJ0VpbmRlbGlqayBkYXQga2FhcnRqZSB0ZSBwYWtrZW4hIFdlbGtvbSBiaWogaGV0IEFudHdhYXJwcyB2ZWxva2UgZGF0IHUgdmFuIGRlIGdyb2VucGxhYXRzIG5hYXIgaGV0IHp1aWQgYnJlbmd0Lic7XG5leHBvcnQgY29uc3QgUkVQTFlfaGVsbG9fdXNlciA9IChuYW1lKSA9PiB7XG4gIHJldHVybiBgQWxsZXogJHtuYW1lfSwgaGViZGUgZWluZGVsaWprIHUga2FhcnRqZSB0ZSBwYWtrZW4/IFdlbGtvbSBiaWogaGV0IEFudHdhYXJwcyBWZWxva2VuIGRhdCB1IHZhbiBkZSBncm9lbnBsYWF0cyBuYWFyIGhldCB6dWlkIGJyZW5ndC5gO1xufTtcblxuZXhwb3J0IGNvbnN0IFJFUExZX2Z1bGwgPSAoYmlrZXMsIGFkZHJlc3MpID0+IHtcblxuICBjb25zdCByZXBsaWVzID0gW1xuICAgIGBPcCBoZXQgZ2VtYWtza2UsIGVyIHppam4gJHtiaWtlc30gdmVsb2tlcyBpbiBoZXQgcmVrIHZhbiAke2FkZHJlc3N9LmAsXG4gICAgYENoaWxsLCBlciB6aWpuICR7YmlrZXN9IHZlbG9rZXMgaW4gaGV0IHJlayB2YW4gJHthZGRyZXNzfS5gLFxuICAgIGBBbWFpLCBpbiBoZXQgcmVrIHZhbiAke2FkZHJlc3N9IHppam4gZXIgbm9nICR7YmlrZXN9IHZlbG9rZXMuYCxcbiAgICBgR2VlbiBzdHJlc3MhIEluIGhldCByZWsgdmFuICR7YWRkcmVzc30gemlqbiBlciBub2cgJHtiaWtlc30gdmVsb2tlcy5gXG4gIF07XG5cbiAgcmV0dXJuIHJlcGxpZXNbTWF0aC5mbG9vcihNYXRoLnJuZCgpICogKHJlcGxpZXMubGVuZ3RoIC0gMCkgKyAwKV07XG59XG5cbmV4cG9ydCBjb25zdCBSRVBMWV9hbG1vc3RfZW1wdHkgPSAoYmlrZXMsIGFkZHJlc3MpID0+IHtcbiAgcmV0dXJuIGBIYWFzdCB1ISBFciB6aWpuIG5vZyBtYWFyICR7YmlrZXN9IHZlbG9rZXMgaW4gaGV0IHJlayB2YW4gJHthZGRyZXNzfS5gO1xufTtcblxuZXhwb3J0IGNvbnN0IFJFUExZX2VtcHR5ID0gKGFkZHJlc3MpID0+IHtcbiAgcmV0dXJuIGBUaXMgd2VlciB2YW4gZGF0ISBFciB6aWpuIGdlZW4gdmVsb2tlcyBtZWVyIGluICR7YWRkcmVzc30uYDtcbn07XG5cbmV4cG9ydCBjb25zdCBSRVBMWV9ub19zdGF0aW9ucyA9ICdEYWFyIHppam4gZ2VlbiBzdGF0aW9ucy4gUHJvYmVlciBlZW4gYW5kZXIgYWRyZXMuJztcblxuZXhwb3J0IGNvbnN0IFJFUExZX21vcmVfc3RhdGlvbnMgPSAoYmlrZXMsIGFkZHJlc3MpID0+IHtcbiAgcmV0dXJuIGAke2FkZHJlc3N9OiBcXGAke2Jpa2VzfVxcYCB2ZWxva2VzXFxuYDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgUkVQTFlfaGVsbG8sXG4gIFJFUExZX2hlbGxvX3VzZXIsXG4gIFJFUExZX2Z1bGwsXG4gIFJFUExZX2FsbW9zdF9lbXB0eSxcbiAgUkVQTFlfZW1wdHksXG4gIFJFUExZX25vX3N0YXRpb25zLFxuICBSRVBMWV9tb3JlX3N0YXRpb25zXG59O1xuIl19