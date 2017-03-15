'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  }
*/

var Parse = function () {
  function Parse(string) {
    _classCallCheck(this, Parse);

    this.string = string;
    this.errors = [];
  }

  _createClass(Parse, [{
    key: 'checkNaN',
    value: function checkNaN(value, field) {
      if (isNaN(+value)) {
        this.errors.push('Invalid value "' + value + '" given for ' + field + '.');
        return true;
      }

      return false;
    }
  }, {
    key: 'validateString',
    value: function validateString() {
      if (typeof this.string !== 'string' || this.string.length === 0) {
        this.errors.push('Invalid string provided.');
      }
    }
  }, {
    key: 'handleFreq',
    value: function handleFreq(arg) {
      var value = this.frequencies[arg];
      if (!value) {
        this.errors.push('Invalid value ' + arg + ' given for FREQ.');
        return null;
      }

      return { frequency: value };
    }
  }, {
    key: 'handleInterval',
    value: function handleInterval(arg) {
      var value = +arg;
      return { interval: !this.checkNaN(arg, 'INTERVAL') ? value : null };
    }
  }, {
    key: 'handleCount',
    value: function handleCount(arg) {
      var value = +arg;
      return { count: !this.checkNaN(arg, 'COUNT') ? value : null };
    }
  }, {
    key: 'validateEaster',
    value: function validateEaster(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYEASTER')) {
        valid = false;
      }

      return valid;
    }
  }, {
    key: 'handleByEaster',
    value: function handleByEaster(arg) {
      var _this = this;

      var split = arg.split(',');
      return { byEaster: split.map(function (s) {
          return _this.validateEaster(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateYearDay',
    value: function validateYearDay(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYYEARDAY')) {
        valid = false;
      } else if (+arg < 0 || +arg > 364) {
        valid = false;
        this.errors.push('Out of range value ' + arg + ' given for BYYEARDAY.');
      }

      return valid;
    }
  }, {
    key: 'handleByYearDay',
    value: function handleByYearDay(arg) {
      var _this2 = this;

      var split = arg.split(',');
      return { byYearDay: split.map(function (s) {
          return _this2.validateYearDay(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateMonthDay',
    value: function validateMonthDay(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYMONTHDAY')) {
        valid = false;
      } else if (+arg < -1 || +arg > 28 || +arg === 0) {
        valid = false;
        this.errors.push('Out of range value ' + arg + ' given for BYMONTHDAY.');
      }

      return valid;
    }
  }, {
    key: 'handleByMonthDay',
    value: function handleByMonthDay(arg) {
      var _this3 = this;

      var split = arg.split(',');
      return { byMonthDay: split.map(function (s) {
          return _this3.validateMonthDay(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateWeekNo',
    value: function validateWeekNo(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYWEEKNO')) {
        valid = false;
      } else if (+arg < 0 || +arg > 51) {
        valid = false;
        this.errors.push('Out of range value ' + arg + ' given for BYWEEKNO.');
      }

      return valid;
    }
  }, {
    key: 'handleByWeekNo',
    value: function handleByWeekNo(arg) {
      var _this4 = this;

      var split = arg.split(',');
      return { byWeekNo: split.map(function (s) {
          return _this4.validateWeekNo(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateMonth',
    value: function validateMonth(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYMONTH')) {
        valid = false;
      } else if (+arg < 0 || +arg > 11) {
        valid = false;
        this.errors.push('Out of range value ' + arg + ' given for BYMONTH.');
      }

      return valid;
    }
  }, {
    key: 'handleByMonth',
    value: function handleByMonth(arg) {
      var _this5 = this;

      var split = arg.split(',');
      return { byMonth: split.map(function (s) {
          return _this5.validateMonth(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateDay',
    value: function validateDay(day) {
      var valid = true;
      if (this.checkNaN(this.weekDays[day])) {
        valid = false;
        this.errors.push('Invalid value ' + day + ' given for BYDAY.');
      };

      return valid;
    }
  }, {
    key: 'handleByDay',
    value: function handleByDay(arg) {
      var _this6 = this;

      var split = arg.split(',');
      return { byDay: split.map(function (s) {
          return _this6.validateDay(s) ? _this6.weekDays[s] : null;
        }) };
    }
  }, {
    key: 'validateHour',
    value: function validateHour(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYHOUR')) {
        valid = false;
      } else if (+arg < 0 || +arg > 23) {
        valid = false;
        this.errors.push('Out of range value ${arg} given for BYHOUR.');
      }

      return valid;
    }
  }, {
    key: 'handleByHour',
    value: function handleByHour(arg) {
      var _this7 = this;

      var split = arg.split(',');
      return { byHour: split.map(function (s) {
          return _this7.validateHour(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateMinute',
    value: function validateMinute(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYMINUTE')) {
        valid = false;
      }
      if (+arg < 0 || +arg > 59) {
        this.errors.push('Out of range value ${arg} given for BYMINUTE.');
        valid = false;
      }

      return valid;
    }
  }, {
    key: 'handleByMinute',
    value: function handleByMinute(arg) {
      var _this8 = this;

      var split = arg.split(',');
      return { byMinute: split.map(function (s) {
          return _this8.validateMinute(s) ? +s : null;
        }) };
    }
  }, {
    key: 'validateSecond',
    value: function validateSecond(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYSECOND')) {
        valid = false;
      };
      if (+arg < 0 || +arg > 59) {
        valid = false;
        this.errors.push('Out of range value ${arg} given for BYSECOND.');
      }

      return valid;
    }
  }, {
    key: 'handleBySecond',
    value: function handleBySecond(arg) {
      var _this9 = this;

      var split = arg.split(',');
      return { bySecond: split.map(function (s) {
          return _this9.validateSecond(s) ? +s : null;
        }) };
    }
  }, {
    key: 'handleInvalid',
    value: function handleInvalid(key) {
      this.errors.push('Invalid key ' + key + ' provided in RRULE string.');
    }
  }, {
    key: 'validateSetPos',
    value: function validateSetPos(arg) {
      var valid = true;
      if (this.checkNaN(arg, 'BYSETPOS')) {
        valid = false;
      }

      return valid;
    }
  }, {
    key: 'handleBySetPos',
    value: function handleBySetPos(arg) {
      var _this10 = this;

      var split = arg.split(',');
      return { bySetPos: split.map(function (s) {
          return _this10.validateSetPos(s) ? +s : null;
        }) };
    }
  }, {
    key: 'handleDtStart',
    value: function handleDtStart(arg) {
      return { dtStart: arg };
    }
  }, {
    key: 'handleSplit',
    value: function handleSplit() {
      var _this11 = this;

      return Object.assign.apply(Object, _toConsumableArray(this.split.map(function (s) {
        var pair = s.split('=');

        if (!pair[1]) {
          _this11.errors.push('No value given for ' + pair[0] + ' parameter.');
          return _defineProperty({}, pair[0], null);
        } else {
          return _this11.pairs[pair[0]] ? _this11.pairs[pair[0]](pair[1]) : _this11.handleInvalid(pair[0]);
        }
      })));
    }
  }, {
    key: 'parse',
    value: function parse() {
      this.validateString();

      this.split = this.string.split(';');
      var result = this.handleSplit();

      if (this.errors.length > 0) {
        console.log('Errors found:');
        this.errors.forEach(function (e) {
          return console.log('- ' + e);
        });
      }

      return result;
    }
  }, {
    key: 'weekDays',
    get: function get() {
      return {
        'MO': 0,
        'TU': 1,
        'WE': 2,
        'TH': 3,
        'FR': 4,
        'SA': 5,
        'SU': 6
      };
    }
  }, {
    key: 'frequencies',
    get: function get() {
      return {
        SECONDLY: 0,
        MINUTELY: 1,
        DAILY: 2,
        WEEKLY: 3,
        MONTHLY: 4,
        YEARLY: 5
      };
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
        DTSTART: this.handleDtStart.bind(this)
      };
    }
  }]);

  return Parse;
}();

module.exports = Parse;