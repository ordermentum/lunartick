'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = require('./constants');
var TimezoneDate = require('./timezone_date');

/*
  Results are given as:
  {
    frequency = int [0..5]
    interval = int
    count = int
    bySetPos = array of integer
    byMonth = array of integer [1..12]
    byMonthDay = array of integer [1..28] & [-1]
    byYearDay = array of integer [0..364]
    byEaster = array of integer
    byWeekNo = array of integer [0..51]
    byDay = array of integer [0..6]
    byHour = array of integer [0..23]
    byMinute = array of integer [0..59]
    bySecond = array of integer [0..59]
    tzId = shortened stringified TZ.
  }
*/

var Parse = function () {
  function Parse(string) {
    _classCallCheck(this, Parse);

    this.string = string;
  }

  _createClass(Parse, [{
    key: 'checkNaN',
    value: function checkNaN(value, field) {
      if (isNaN(+value)) {
        throw new Error('Invalid value "' + value + '" given for ' + field + '.');
      }
    }
  }, {
    key: 'validString',
    value: function validString() {
      if (typeof this.string !== 'string' || this.string.length === 0) {
        throw new Error('Invalid string provided.');
      }
    }
  }, {
    key: 'handleFreq',
    value: function handleFreq(arg) {
      var value = constants.FREQUENCIES[arg];
      if (!value) {
        throw new Error('Invalid value "' + arg + '" given for FREQ.');
      }

      return { frequency: value };
    }
  }, {
    key: 'validateInterval',
    value: function validateInterval(arg) {
      this.checkNaN(arg, 'INTERVAL');

      if (+arg < 1) {
        throw new Error('Out of range value "' + arg + '" given for INTERVAL.');
      }
    }
  }, {
    key: 'handleInterval',
    value: function handleInterval(arg) {
      this.validateInterval(arg);
      var value = +arg;
      return { interval: value };
    }
  }, {
    key: 'validateCount',
    value: function validateCount(arg) {
      this.checkNaN(arg, 'COUNT');

      if (+arg < 1) {
        throw new Error('Out of range value "' + arg + '" given for COUNT.');
      }
    }
  }, {
    key: 'handleCount',
    value: function handleCount(arg) {
      this.validateCount(arg);
      var value = +arg;
      return { count: value };
    }
  }, {
    key: 'validateEaster',
    value: function validateEaster(arg) {
      this.checkNaN(arg, 'BYEASTER');
    }
  }, {
    key: 'handleByEaster',
    value: function handleByEaster(arg) {
      var _this = this;

      var split = arg.split(',');
      return { byEaster: split.map(function (s) {
          _this.validateEaster(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateYearDay',
    value: function validateYearDay(arg) {
      this.checkNaN(arg, 'BYYEARDAY');

      if (+arg < 0 || +arg > 364) {
        throw new Error('Out of range value "' + arg + '" given for BYYEARDAY.');
      }
    }
  }, {
    key: 'handleByYearDay',
    value: function handleByYearDay(arg) {
      var _this2 = this;

      var split = arg.split(',');
      return { byYearDay: split.map(function (s) {
          _this2.validateYearDay(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateMonthDay',
    value: function validateMonthDay(arg) {
      this.checkNaN(arg, 'BYMONTHDAY');
      if (+arg < -1 || +arg > 28 || +arg === 0) {
        throw new Error('Out of range value "' + arg + '" given for BYMONTHDAY.');
      }
    }
  }, {
    key: 'handleByMonthDay',
    value: function handleByMonthDay(arg) {
      var _this3 = this;

      var split = arg.split(',');
      return { byMonthDay: split.map(function (s) {
          _this3.validateMonthDay(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateWeekNo',
    value: function validateWeekNo(arg) {
      this.checkNaN(arg, 'BYWEEKNO');
      if (+arg < 0 || +arg > 51) {
        throw new Error('Out of range value "' + arg + '" given for BYWEEKNO.');
      }
    }
  }, {
    key: 'handleByWeekNo',
    value: function handleByWeekNo(arg) {
      var _this4 = this;

      var split = arg.split(',');
      return { byWeekNo: split.map(function (s) {
          _this4.validateWeekNo(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateMonth',
    value: function validateMonth(arg) {
      this.checkNaN(arg, 'BYMONTH');
      if (+arg < 0 || +arg > 11) {
        throw new Error('Out of range value "' + arg + '" given for BYMONTH.');
      }
    }
  }, {
    key: 'handleByMonth',
    value: function handleByMonth(arg) {
      var _this5 = this;

      var split = arg.split(',');
      return { byMonth: split.map(function (s) {
          _this5.validateMonth(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateDay',
    value: function validateDay(day) {
      if (constants.WEEK_DAYS[day] === undefined) {
        throw new Error('Invalid value "' + day + '" given for BYDAY.');
      }
    }
  }, {
    key: 'handleByDay',
    value: function handleByDay(arg) {
      var _this6 = this;

      var split = arg.split(',');
      return { byDay: split.map(function (s) {
          _this6.validateDay(s);
          return constants.WEEK_DAYS[s];
        }) };
    }
  }, {
    key: 'validateHour',
    value: function validateHour(arg) {
      this.checkNaN(arg, 'BYHOUR');
      if (+arg < 0 || +arg > 23) {
        throw new Error('Out of range value "' + arg + '" given for BYHOUR.');
      }
    }
  }, {
    key: 'handleByHour',
    value: function handleByHour(arg) {
      var _this7 = this;

      var split = arg.split(',');
      return { byHour: split.map(function (s) {
          _this7.validateHour(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateMinute',
    value: function validateMinute(arg) {
      this.checkNaN(arg, 'BYMINUTE');
      if (+arg < 0 || +arg > 59) {
        throw new Error('Out of range value "' + arg + '" given for BYMINUTE.');
      }
    }
  }, {
    key: 'handleByMinute',
    value: function handleByMinute(arg) {
      var _this8 = this;

      var split = arg.split(',');
      return { byMinute: split.map(function (s) {
          _this8.validateMinute(s);
          return +s;
        }) };
    }
  }, {
    key: 'validateSecond',
    value: function validateSecond(arg) {
      this.checkNaN(arg, 'BYSECOND');
      if (+arg < 0 || +arg > 59) {
        throw new Error('Out of range value "' + arg + '" given for BYSECOND.');
      }
    }
  }, {
    key: 'handleBySecond',
    value: function handleBySecond(arg) {
      var _this9 = this;

      var split = arg.split(',');
      return { bySecond: split.map(function (s) {
          _this9.validateSecond(s);
          return +s;
        }) };
    }
  }, {
    key: 'handleInvalid',
    value: function handleInvalid(key) {
      throw new Error('Invalid key ' + key + ' provided in RRULE string.');
    }
  }, {
    key: 'validateSetPos',
    value: function validateSetPos(arg) {
      this.checkNaN(arg, 'BYSETPOS');
    }
  }, {
    key: 'handleBySetPos',
    value: function handleBySetPos(arg) {
      var _this10 = this;

      var split = arg.split(',');
      return { bySetPos: split.map(function (s) {
          _this10.validateSetPos(s);
          return +s;
        }) };
    }
  }, {
    key: 'handleDtStart',
    value: function handleDtStart(arg) {
      var dtStart = void 0;
      try {
        dtStart = new TimezoneDate(arg);
      } catch (ex) {
        throw new Error('Invalid DTSTART provided.');
      }
      return { dtStart: dtStart };
    }
  }, {
    key: 'handleTzId',
    value: function handleTzId(arg) {
      var tz = arg;
      var match = arg.match(/.+?(?=:)/);
      if (match) {
        tz = match[0];
      }

      return { tzId: tz };
    }
  }, {
    key: 'handleSplit',
    value: function handleSplit() {
      var _this11 = this;

      var pairs = this.split.map(function (s) {
        var pair = s.split('=');

        if (!pair[1]) {
          throw new Error('No value given for ' + pair[0] + ' parameter.');
        } else {
          return _this11.pairs[pair[0]] ? _this11.pairs[pair[0]](pair[1]) : _this11.handleInvalid(pair[0]);
        }
      });

      return pairs && pairs.length > 0 ? Object.assign.apply(Object, _toConsumableArray(pairs)) : {};
    }
  }, {
    key: 'parse',
    value: function parse() {
      this.validString();

      this.split = this.string.split(';');
      return this.handleSplit();
    }
  }, {
    key: 'pairs',
    get: function get() {
      return {
        FREQ: this.handleFreq.bind(this),
        INTERVAL: this.handleInterval.bind(this),
        COUNT: this.handleCount.bind(this),
        BYEASTER: this.handleByEaster.bind(this),
        BYYEARDAY: this.handleByYearDay.bind(this),
        BYMONTHDAY: this.handleByMonthDay.bind(this),
        BYWEEKNO: this.handleByWeekNo.bind(this),
        BYMONTH: this.handleByMonth.bind(this),
        BYDAY: this.handleByDay.bind(this),
        BYHOUR: this.handleByHour.bind(this),
        BYMINUTE: this.handleByMinute.bind(this),
        BYSECOND: this.handleBySecond.bind(this),
        BYSETPOS: this.handleBySetPos.bind(this),
        DTSTART: this.handleDtStart.bind(this),
        TZID: this.handleTzId.bind(this)
      };
    }
  }]);

  return Parse;
}();

module.exports = Parse;