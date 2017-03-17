const moment = require('moment-timezone');

/*
  moment's days range from:
  Sunday(0) -> Saturday(6)
  rrule's days range from:
  Monday(0) -> Sunday(6)
  const day = this.date.day();
*/

class TimezoneDate {
  constructor(timestamp = new Date(), timezone = 'Australia/Sydney') {
    if (timestamp instanceof TimezoneDate) {
      timestamp = timestamp.date; // eslint-disable-line
    }

    if (!timezone) {
      this.date = moment(timestamp);
    } else {
      this.date = moment.tz(timestamp, timezone);
    }
  }

  addYear() {
    this.date.add(1, 'year');
  }

  addMonth() {
    this.date.add(1, 'month').startOf('month');
  }

  addWeek() {
    this.date.add(7, 'day').startOf('day');
  }

  addDay() {
    this.date.add(1, 'day').startOf('day');
  }

  addHour() {
    const prev = this.getTime();
    this.date.add(1, 'hour').startOf('hour');

    if (this.getTime() <= prev) {
      this.date.add(1, 'hour');
    }
  }

  addMinute() {
    const prev = this.getTime();
    this.date.add(1, 'minute').startOf('minute');

    if (this.getTime() < prev) {
      this.date.add(1, 'hour');
    }
  }

  addSecond() {
    const prev = this.getTime();
    this.date.add(1, 'second').startOf('second');

    if (this.getTime() < prev) {
      this.date.add(1, 'hour');
    }
  }

  getDate() {
    return this.date.date();
  }

  getFullYear() {
    return this.date.year();
  }

  getDay() {
    const day = this.date.day();
    let result = day - 1;
    if (day === 0) {
      result = 6;
    }

    return result;
  }

  getMonth() {
    return this.date.month();
  }

  getHours() {
    return this.date.hours();
  }

  getMinutes() {
    return this.date.minute();
  }

  getSeconds() {
    return this.date.second();
  }

  getTime() {
    return this.date.valueOf();
  }

  getUTCDate() {
    return this.getUTC().date();
  }

  getUTCFullYear() {
    return this.getUTC().year();
  }

  getUTCDay() {
    return this.getUTC().day();
  }

  getUTCMonth() {
    return this.getUTC().month();
  }

  getUTCHours() {
    return this.getUTC().hours();
  }

  getUTCMinutes() {
    return this.getUTC().minute();
  }

  getUTCSeconds() {
    return this.getUTC().second();
  }

  toISOString() {
    return this.date.toISOString();
  }

  toJSON() {
    return this.date.toJSON();
  }

  setDate(d) {
    return this.date.date(d);
  }

  setFullYear(y) {
    return this.date.year(y);
  }

  setDay(d) {
    let result = this.date.day(d + 1);
    if (d === 6) {
      result = this.date.day(0);
    }

    return result;
  }

  setMonth(m) {
    return this.date.month(m);
  }

  setHours(h) {
    return this.date.hour(h);
  }

  setMinutes(m) {
    return this.date.minute(m);
  }

  setSeconds(s) {
    return this.date.second(s);
  }

  getTime() {
    return this.date.valueOf();
  }

  getUTC() {
    return moment.utc(this.date);
  }

  toString() {
    return this.date.toString();
  }

  toDate() {
    return this.date.toDate();
  }
}

module.exports = TimezoneDate;
