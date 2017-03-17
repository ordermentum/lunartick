'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');

var constants = require('./constants');
var TimezoneDate = require('./timezone_date');

var Iterator = function () {
  function Iterator() {
    var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var start = arguments[1];

    _classCallCheck(this, Iterator);

    this.rule = rule;
    if (!this.rule || !this.rule.frequency) {
      throw new Error('Invalid rule, no frequency property on rule.');
    }

    if (!this.rule.interval) {
      this.rule.interval = 1;
    }

    this.start = new TimezoneDate(start || new Date(), this.rule.tzId);
  }

  _createClass(Iterator, [{
    key: Symbol.iterator,
    value: regeneratorRuntime.mark(function value() {
      var limit, value;
      return regeneratorRuntime.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              limit = this.rule.count || 100;

            case 1:
              if (!(limit > 0)) {
                _context.next = 9;
                break;
              }

              value = this.getNext(this.start);
              _context.next = 5;
              return value;

            case 5:
              this.start = value;
              limit = limit - 1;
              _context.next = 1;
              break;

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: 'setLowerIntervals',
    value: function setLowerIntervals(intervalTime) {
      if (this.rule.frequency > 0) {
        var seconds = this.rule.bySecond ? this.rule.bySecond[0] : intervalTime.getSeconds();
        intervalTime.setSeconds(seconds);
      }
      if (this.rule.frequency > 1) {
        var minutes = this.rule.byMinute ? this.rule.byMinute[0] : intervalTime.getMinutes();
        intervalTime.setMinutes(minutes);
      }
      if (this.rule.frequency > 2) {
        var hours = this.rule.byHour ? this.rule.byHour[0] : intervalTime.getHours();
        intervalTime.setHours(hours);
      }
      if (this.rule.frequency > 3) {
        var day = this.rule.byDay ? this.rule.byDay[0] : intervalTime.getDay();
        intervalTime.setDay(day);
      }

      return intervalTime;
    }
  }, {
    key: 'getLowerIntervals',
    value: function getLowerIntervals(fromDate) {
      var intervalTime = new TimezoneDate(fromDate || new Date(), this.rule.tzId);
      return this.setLowerIntervals(intervalTime);
    }
  }, {
    key: 'getNext',
    value: function getNext(fromDate) {
      var intervalTime = this.getLowerIntervals(fromDate);
      var result = void 0;

      if (fromDate.toISOString) fromDate = fromDate.toISOString(); // eslint-disable-line

      if (moment(fromDate).isBefore(intervalTime.date.toISOString())) {
        result = intervalTime;
      } else {
        for (var i = 0; i < this.rule.interval; i++) {
          intervalTime[constants.ADD_FREQUENCY[this.rule.frequency]]();
        }

        this.setLowerIntervals(intervalTime);
        result = intervalTime;
      }

      return result;
    }
  }]);

  return Iterator;
}();

module.exports = Iterator;