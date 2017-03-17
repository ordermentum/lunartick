'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parse = require('./parse');
var Iterator = require('./iterator');
var constants = require('./constants');

var Rule = function () {
  function Rule() {
    var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Rule);

    this.rule = rule;
  }

  _createClass(Rule, [{
    key: 'iterator',
    value: function iterator() {
      var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      return new Iterator(this.rule, start);
    }
  }], [{
    key: 'parse',
    value: function parse(string) {
      return new Rule(new Parse(string).parse());
    }
  }, {
    key: 'legacyParse',
    value: function legacyParse(recurrence) {
      var result = {};

      Object.keys(recurrence).forEach(function (key) {
        if (key === 'freq') {
          result.frequency = constants.FREQUENCIES[recurrence.freq.toUpperCase()];
        } else if (constants.LEGACY[key] && recurrence[key] !== null) {
          result[constants.LEGACY[key]] = recurrence[key];
        } else if (recurrence[key] !== null) {
          result[key] = recurrence[key];
        }
      });

      return new Rule(result);
    }
  }]);

  return Rule;
}();

module.exports = Rule;