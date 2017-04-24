'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var REPLY_hello = exports.REPLY_hello = 'Eindelijk dat kaartje te pakken! Welkom bij het Antwaarps veloke dat u van de groenplaats naar het zuid brengt.';
var REPLY_hello_user = exports.REPLY_hello_user = function REPLY_hello_user(name) {
  return 'Allez ' + name + ', hebde eindelijk u kaartje te pakken? Welkom bij het Antwaarps Veloken dat u van de groenplaats naar het zuid brengt.';
};

var REPLY_full = exports.REPLY_full = function REPLY_full(bikes, address) {

  var replies = ['Op het gemakske, er zijn `' + bikes + '` velokes in het rek van ' + address + '.', 'Chill, er zijn `' + bikes + '` velokes in het rek van ' + address + '.', 'Amai, in het rek van ' + address + ' zijn er nog `' + bikes + '` velokes.', 'Geen stress! In het rek van ' + address + ' zijn er nog `' + bikes + '` velokes.'];

  return replies[Math.floor(Math.random() * (replies.length - 0) + 0)];
};

var REPLY_almost_empty = exports.REPLY_almost_empty = function REPLY_almost_empty(bikes, address) {
  return 'Haast u! Er zijn nog maar `' + bikes + '` velokes in het rek van ' + address + '.';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXR0aW5ncy9yZXBsaWVzLmpzIl0sIm5hbWVzIjpbIlJFUExZX2hlbGxvIiwiUkVQTFlfaGVsbG9fdXNlciIsIm5hbWUiLCJSRVBMWV9mdWxsIiwiYmlrZXMiLCJhZGRyZXNzIiwicmVwbGllcyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsIlJFUExZX2FsbW9zdF9lbXB0eSIsIlJFUExZX2VtcHR5IiwiUkVQTFlfbm9fc3RhdGlvbnMiLCJSRVBMWV9tb3JlX3N0YXRpb25zIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFPLElBQU1BLG9DQUFjLGlIQUFwQjtBQUNBLElBQU1DLDhDQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNDLElBQUQsRUFBVTtBQUN4QyxvQkFBZ0JBLElBQWhCO0FBQ0QsQ0FGTTs7QUFJQSxJQUFNQyxrQ0FBYSxTQUFiQSxVQUFhLENBQUNDLEtBQUQsRUFBUUMsT0FBUixFQUFvQjs7QUFFNUMsTUFBTUMsVUFBVSxnQ0FDZ0JGLEtBRGhCLGlDQUNrREMsT0FEbEQsNkJBRU1ELEtBRk4saUNBRXdDQyxPQUZ4QyxrQ0FHVUEsT0FIVixzQkFHbUNELEtBSG5DLGtEQUlpQkMsT0FKakIsc0JBSTBDRCxLQUoxQyxnQkFBaEI7O0FBT0EsU0FBT0UsUUFBUUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLE1BQWlCSCxRQUFRSSxNQUFSLEdBQWlCLENBQWxDLElBQXVDLENBQWxELENBQVIsQ0FBUDtBQUNELENBVk07O0FBWUEsSUFBTUMsa0RBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ1AsS0FBRCxFQUFRQyxPQUFSLEVBQW9CO0FBQ3BELHlDQUFzQ0QsS0FBdEMsaUNBQXdFQyxPQUF4RTtBQUNELENBRk07O0FBSUEsSUFBTU8sb0NBQWMsU0FBZEEsV0FBYyxDQUFDUCxPQUFELEVBQWE7QUFDdEMsNkRBQXlEQSxPQUF6RDtBQUNELENBRk07O0FBSUEsSUFBTVEsZ0RBQW9CLG1EQUExQjs7QUFFQSxJQUFNQyxvREFBc0IsU0FBdEJBLG1CQUFzQixDQUFDVixLQUFELEVBQVFDLE9BQVIsRUFBb0I7QUFDckQsU0FBVUEsT0FBVixXQUF3QkQsS0FBeEI7QUFDRCxDQUZNOztrQkFJUTtBQUNiSiwwQkFEYTtBQUViQyxvQ0FGYTtBQUdiRSx3QkFIYTtBQUliUSx3Q0FKYTtBQUtiQywwQkFMYTtBQU1iQyxzQ0FOYTtBQU9iQztBQVBhLEMiLCJmaWxlIjoicmVwbGllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBSRVBMWV9oZWxsbyA9ICdFaW5kZWxpamsgZGF0IGthYXJ0amUgdGUgcGFra2VuISBXZWxrb20gYmlqIGhldCBBbnR3YWFycHMgdmVsb2tlIGRhdCB1IHZhbiBkZSBncm9lbnBsYWF0cyBuYWFyIGhldCB6dWlkIGJyZW5ndC4nO1xuZXhwb3J0IGNvbnN0IFJFUExZX2hlbGxvX3VzZXIgPSAobmFtZSkgPT4ge1xuICByZXR1cm4gYEFsbGV6ICR7bmFtZX0sIGhlYmRlIGVpbmRlbGlqayB1IGthYXJ0amUgdGUgcGFra2VuPyBXZWxrb20gYmlqIGhldCBBbnR3YWFycHMgVmVsb2tlbiBkYXQgdSB2YW4gZGUgZ3JvZW5wbGFhdHMgbmFhciBoZXQgenVpZCBicmVuZ3QuYDtcbn07XG5cbmV4cG9ydCBjb25zdCBSRVBMWV9mdWxsID0gKGJpa2VzLCBhZGRyZXNzKSA9PiB7XG5cbiAgY29uc3QgcmVwbGllcyA9IFtcbiAgICBgT3AgaGV0IGdlbWFrc2tlLCBlciB6aWpuIFxcYCR7YmlrZXN9XFxgIHZlbG9rZXMgaW4gaGV0IHJlayB2YW4gJHthZGRyZXNzfS5gLFxuICAgIGBDaGlsbCwgZXIgemlqbiBcXGAke2Jpa2VzfVxcYCB2ZWxva2VzIGluIGhldCByZWsgdmFuICR7YWRkcmVzc30uYCxcbiAgICBgQW1haSwgaW4gaGV0IHJlayB2YW4gJHthZGRyZXNzfSB6aWpuIGVyIG5vZyBcXGAke2Jpa2VzfVxcYCB2ZWxva2VzLmAsXG4gICAgYEdlZW4gc3RyZXNzISBJbiBoZXQgcmVrIHZhbiAke2FkZHJlc3N9IHppam4gZXIgbm9nIFxcYCR7YmlrZXN9XFxgIHZlbG9rZXMuYFxuICBdO1xuXG4gIHJldHVybiByZXBsaWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyZXBsaWVzLmxlbmd0aCAtIDApICsgMCldO1xufVxuXG5leHBvcnQgY29uc3QgUkVQTFlfYWxtb3N0X2VtcHR5ID0gKGJpa2VzLCBhZGRyZXNzKSA9PiB7XG4gIHJldHVybiBgSGFhc3QgdSEgRXIgemlqbiBub2cgbWFhciBcXGAke2Jpa2VzfVxcYCB2ZWxva2VzIGluIGhldCByZWsgdmFuICR7YWRkcmVzc30uYDtcbn07XG5cbmV4cG9ydCBjb25zdCBSRVBMWV9lbXB0eSA9IChhZGRyZXNzKSA9PiB7XG4gIHJldHVybiBgVGlzIHdlZXIgdmFuIGRhdCEgRXIgemlqbiBnZWVuIHZlbG9rZXMgbWVlciBpbiAke2FkZHJlc3N9LmA7XG59O1xuXG5leHBvcnQgY29uc3QgUkVQTFlfbm9fc3RhdGlvbnMgPSAnRGFhciB6aWpuIGdlZW4gc3RhdGlvbnMuIFByb2JlZXIgZWVuIGFuZGVyIGFkcmVzLic7XG5cbmV4cG9ydCBjb25zdCBSRVBMWV9tb3JlX3N0YXRpb25zID0gKGJpa2VzLCBhZGRyZXNzKSA9PiB7XG4gIHJldHVybiBgJHthZGRyZXNzfTogXFxgJHtiaWtlc31cXGAgdmVsb2tlc1xcbmA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIFJFUExZX2hlbGxvLFxuICBSRVBMWV9oZWxsb191c2VyLFxuICBSRVBMWV9mdWxsLFxuICBSRVBMWV9hbG1vc3RfZW1wdHksXG4gIFJFUExZX2VtcHR5LFxuICBSRVBMWV9ub19zdGF0aW9ucyxcbiAgUkVQTFlfbW9yZV9zdGF0aW9uc1xufTtcbiJdfQ==