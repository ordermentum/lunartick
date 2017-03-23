const moment = require('moment-timezone');

/*
  moment's days range from:
  Sunday(0) -> Saturday(6)
  rrule's days range from:
  Monday(0) -> Sunday(6)
  const day = this.date.day();
*/

class TimezoneDate {
  constructor(timestamp = new Date(), timezone = 'UTC') {
    if (timestamp instanceof TimezoneDate) {
      timestamp = timestamp.date; // eslint-disable-line
    }

    if (!timezone || typeof timezone !== 'string') {
      throw new Error('Invalid timezone provided');
    }

    this.date = moment.tz(timestamp, timezone);
  }

  addYear() {
    this.date.add(1, 'year');
  }

  addMonth() {
    this.date.add(1, 'month').startOf('month');
  }

  addRemainingMonth(m) {
    return this.date.add(m, 'month').date(0);
  }

  addWeek() {
    this.date.add(7, 'day').startOf('day');
  }

  addWeeks(w) {
    this.date.add(w, 'weeks');
  }

  addFortnight() {
    this.date.add(14, 'days').startOf('day');
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

  getDaysInMonth() {
    return this.date.daysInMonth();
  }

  getWeekDiff(d) {
    if (d instanceof TimezoneDate) {
      return this.date.diff(d.date, 'weeks');
    }

    return this.date.diff(d, 'weeks');
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

  toUTCString() {
    return this.date.utc().toString();
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

  isBefore(d) {
    if (d instanceof TimezoneDate) {
      return this.date.isBefore(d.date);
    }

    return this.date.isBefore(d);
  }

  isSameOrBefore(d) {
    if (d instanceof TimezoneDate) {
      return this.date.isSameOrBefore(d.date);
    }

    return this.date.isSameOrBefore(d);
  }

  isSameOrAfter(d) {
    if (d instanceof TimezoneDate) {
      return this.date.isSameOrAfter(d.date);
    }

    return this.date.isSameOrAfter(d);
  }
}

module.exports = TimezoneDate;
