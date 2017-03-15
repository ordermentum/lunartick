'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rule = function () {
  function Rule() {
    _classCallCheck(this, Rule);
  }

  _createClass(Rule, [{
    key: 'constuctor',
    value: function constuctor(args) {
      this._args = args;
      this._errors = [];

      return this._parse();
    }
  }, {
    key: '_validateFreq',
    value: function _validateFreq() {
      if (!this._args.freq) {
        this.errors.push('No { freq } argument provided.');
      }

      if (this._frequencies.indexOf(this._args.freq.toUpperCase()) === -1) {
        this.errors.push('Invalid { freq } argument provided.');
      }
    }
  }, {
    key: '_getFreq',
    value: function _getFreq() {
      this._validateFreq();

      return 'FREQ=' + this._args.freq.toUpperCase();
    }
  }, {
    key: '_parse',
    value: function _parse() {
      var freq = getFreq();
    }
  }, {
    key: 'frequencies',
    get: function get() {
      return ['DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY'];
    }
  }], [{
    key: 'parse',
    value: function parse(string) {
      return new Rule(Parser.parse(string));
    }
  }]);

  return Rule;
}();

// args:
// [freq, dtstart, interval, wkst, count, until,
// bysetpos, bymonth, bymonthday, byyearday, byeaster,
// byweekno, byweekday, byhour, byminute, bysecond, cache.
// timezone]