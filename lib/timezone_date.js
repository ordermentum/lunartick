'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');

/*
  moment's days range from:
  Sunday(0) -> Saturday(6)
  rrule's days range from:
  Monday(0) -> Sunday(6)
  const day = this.date.day();
*/

var TimezoneDate = function () {
  function TimezoneDate() {
    var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
    var timezone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Australia/Sydney';

    _classCallCheck(this, TimezoneDate);

    if (timestamp instanceof TimezoneDate) {
      timestamp = timestamp.date; // eslint-disable-line
    }

    if (!timezone) {
      this.date = moment(timestamp);
    } else {
      this.date = moment.tz(timestamp, timezone);
    }
  }

  _createClass(TimezoneDate, [{
    key: 'addYear',
    value: function addYear() {
      this.date.add(1, 'year');
    }
  }, {
    key: 'addMonth',
    value: function addMonth() {
      this.date.add(1, 'month').startOf('month');
    }
  }, {
    key: 'addWeek',
    value: function addWeek() {
      this.date.add(7, 'day').startOf('day');
    }
  }, {
    key: 'addDay',
    value: function addDay() {
      this.date.add(1, 'day').startOf('day');
    }
  }, {
    key: 'addHour',
    value: function addHour() {
      var prev = this.getTime();
      this.date.add(1, 'hour').startOf('hour');

      if (this.getTime() <= prev) {
        this.date.add(1, 'hour');
      }
    }
  }, {
    key: 'addMinute',
    value: function addMinute() {
      var prev = this.getTime();
      this.date.add(1, 'minute').startOf('minute');

      if (this.getTime() < prev) {
        this.date.add(1, 'hour');
      }
    }
  }, {
    key: 'addSecond',
    value: function addSecond() {
      var prev = this.getTime();
      this.date.add(1, 'second').startOf('second');

      if (this.getTime() < prev) {
        this.date.add(1, 'hour');
      }
    }
  }, {
    key: 'getDate',
    value: function getDate() {
      return this.date.date();
    }
  }, {
    key: 'getFullYear',
    value: function getFullYear() {
      return this.date.year();
    }
  }, {
    key: 'getDay',
    value: function getDay() {
      var day = this.date.day();
      var result = day - 1;
      if (day === 0) {
        result = 6;
      }

      return result;
    }
  }, {
    key: 'getMonth',
    value: function getMonth() {
      return this.date.month();
    }
  }, {
    key: 'getHours',
    value: function getHours() {
      return this.date.hours();
    }
  }, {
    key: 'getMinutes',
    value: function getMinutes() {
      return this.date.minute();
    }
  }, {
    key: 'getSeconds',
    value: function getSeconds() {
      return this.date.second();
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      return this.date.valueOf();
    }
  }, {
    key: 'getUTCDate',
    value: function getUTCDate() {
      return this.getUTC().date();
    }
  }, {
    key: 'getUTCFullYear',
    value: function getUTCFullYear() {
      return this.getUTC().year();
    }
  }, {
    key: 'getUTCDay',
    value: function getUTCDay() {
      return this.getUTC().day();
    }
  }, {
    key: 'getUTCMonth',
    value: function getUTCMonth() {
      return this.getUTC().month();
    }
  }, {
    key: 'getUTCHours',
    value: function getUTCHours() {
      return this.getUTC().hours();
    }
  }, {
    key: 'getUTCMinutes',
    value: function getUTCMinutes() {
      return this.getUTC().minute();
    }
  }, {
    key: 'getUTCSeconds',
    value: function getUTCSeconds() {
      return this.getUTC().second();
    }
  }, {
    key: 'toISOString',
    value: function toISOString() {
      return this.date.toISOString();
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.date.toJSON();
    }
  }, {
    key: 'setDate',
    value: function setDate(d) {
      return this.date.date(d);
    }
  }, {
    key: 'setFullYear',
    value: function setFullYear(y) {
      return this.date.year(y);
    }
  }, {
    key: 'setDay',
    value: function setDay(d) {
      var result = this.date.day(d + 1);
      if (d === 6) {
        result = this.date.day(0);
      }

      return result;
    }
  }, {
    key: 'setMonth',
    value: function setMonth(m) {
      return this.date.month(m);
    }
  }, {
    key: 'setHours',
    value: function setHours(h) {
      return this.date.hour(h);
    }
  }, {
    key: 'setMinutes',
    value: function setMinutes(m) {
      return this.date.minute(m);
    }
  }, {
    key: 'setSeconds',
    value: function setSeconds(s) {
      return this.date.second(s);
    }
  }, {
    key: 'getTime',
    value: function getTime() {
      return this.date.valueOf();
    }
  }, {
    key: 'getUTC',
    value: function getUTC() {
      return moment.utc(this.date);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.date.toString();
    }
  }, {
    key: 'toDate',
    value: function toDate() {
      return this.date.toDate();
    }
  }]);

  return TimezoneDate;
}();

module.exports = TimezoneDate;