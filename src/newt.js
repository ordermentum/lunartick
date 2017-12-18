const moment = require('moment-timezone');
const { flow } = require('lodash');

const freqIncrs = {
  0: 'seconds',
  1: 'minutes',
  2: 'hours',
  3: 'days',
  4: 'weeks',
  5: 'months',
  6: 'years',
};

module.exports = class Newt {
  constructor(opts) {
    this.tzId = opts.tzId || 'Australia/Sydney';
    this.dtstart = (opts.dtstart || moment.tz(this.tzId)).startOf('second');

    this.frequency = opts.frequency || 0;
    this.freqIncr = freqIncrs[this.frequency];

    this.interval = opts.interval || 1;

    this.count = opts.count;
    this.until = opts.until;

    this.byMonth = opts.byMonth ? opts.byMonth.sort((a, b) => (a <= b ? -1 : 1)) : [];
    this.byDay = opts.byDay ? opts.byDay.sort((a, b) => (a <= b ? -1 : 1)) : [];
    this.byHour = opts.byHour ? opts.byHour.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.hour()];
    this.byMinute = opts.byMinute ? opts.byMinute.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.minute()];
    this.bySecond = opts.bySecond ? opts.bySecond.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.second()];
  }

  apply(date) {
    return flow(
      this.applyByMonth.bind(this),
      this.applyByDay.bind(this),
      this.applyByHour.bind(this),
      this.applyByMinute.bind(this),
      this.applyBySecond.bind(this),
    )(date);
  }

  applyByMonth(date) {
    if (this.byMonth.length === 0 || this.byMonth.includes(date.month())) {
      return moment(date);
    }

    const incr = Math.min(...this.byMonth.map(x => x < date.month() ? 12 + x - date.month() : x - date.month()));

    return moment(date).add(incr, 'months').startOf('month');
  }

  applyByDay(date) {
    if (this.byDay.length === 0 || this.byDay.includes(date.day())) {
      return moment(date);
    }

    const incr = Math.min(...this.byDay.map(x => (x <= date.day()) ? (7 + x - date.day()) : (x - date.day())));
    const nextDate = moment(date).add(incr, 'days').startOf('day');
    if (date.month() === nextDate.month()) return nextDate;
    return this.applyByDay(this.applyByMonth(nextDate));
  }

  applyByHour(date) {
    if (this.byHour.includes(date.hour())) {
      return moment(date);
    }

    const incr = Math.min(...this.byHour.map(x => x <= date.hour() ? 24 + x - date.hour() : x - date.hour()));

    const nextDate = moment(date).add(incr, 'hours').startOf('hour');

    if (date.day() === nextDate.day()) return nextDate;

    return this.applyByHour(this.applyByDay(nextDate));
  }

  applyByMinute(date) {
    if (this.byMinute.includes(date.minute())) {
      return moment(date);
    }

    const incr = Math.min(...this.byMinute.map(x => x <= date.minute() ? 60 + x - date.minute() : x - date.minute()));
    const nextDate = moment(date).add(incr, 'minutes').startOf('minute');

    if (date.hour() === nextDate.hour()) return nextDate;

    return this.applyByMinute(this.applyByHour(nextDate));
  }

  applyBySecond(date) {
    if (this.bySecond.includes(date.second())) {
      return date;
    }

    const incr = Math.min(...this.bySecond.map(x => x <= date.second() ? 60 + x - date.second() : x - date.second()));
    const nextDate = moment(date).add(incr, 'seconds').startOf('second');

    if (date.minute() === nextDate.minute()) return nextDate;

    return this.applyBySecond(this.applyByMinute(nextDate));
  }

  stopLoop(limit, date) {
    if ((limit != null) && (this.count != null)) {
      return (limit < this.count);
    } else if ((date != null) && (this.until != null)) {
      return (date.toDate() < this.until.toDate());
    }

    return false;
  }

  * [Symbol.iterator]() {
    let date = this.apply(moment(this.dtstart));
    let limit = 1;

    yield date;

    const shouldExpandSeconds = d => (this.bySecond.length > 0) && this.bySecond.some(x => x > d.second());
    const shouldExpandMinutes = d => (this.byMinute.length > 0) && this.byMinute.some(x => x > d.minute());
    const shouldExpandHours = d => (this.byHour.length > 0) && this.byHour.some(x => x > d.hour());
    const shouldExpandDays = d => (this.byDay.length > 0) && (this.byDay.some(x => x > d.day() && moment(d).day(x).month() === d.month()) || this.byDay.some(x => (x < d.day()) && moment(d).add(7 + x - d.day(), 'days').month() === d.month()));
    const shouldExpandMonths = d => (this.byMonth.length > 0) && this.byMonth.some(x => x > d.month());

    const expandSeconds = (d) => {
      if (this.bySecond.includes(d.second())) {
        return d;
      }

      const nextVal = this.bySecond.find(x => x > d.second());
      return nextVal ? moment(d).second(nextVal).startOf('seconds') : d;
    };

    const expandMinutes = (d) => {
      if (this.byMinute.includes(d.minute())) {
        return d;
      }

      const nextVal = this.byMinute.find(x => x > d.minute());
      return nextVal ? moment(d).minute(nextVal).startOf('minutes') : d;
    };

    const expandHours = (d) => {
      if (this.byHour.length === 0 || this.byHour.includes(d.hour())) {
        return d;
      }

      const nextVal = this.byHour.find(x => x > d.hour());
      return nextVal ? moment(d).hour(nextVal).startOf('hours') : d;
    };

    const expandDays = (d) => {
      if (this.byDay.length === 0 || this.byDay.includes(d.day())) {
        return d;
      }

      const nextVal = this.byDay.find(x => x > d.day());
      return nextVal ? moment(d).day(nextVal).startOf('days') : d;
    };

    const expandMonths = (d) => {
      if (this.byMonth.length === 0 || this.byMonth.includes(d.month())) {
        return d;
      }

      const nextVal = this.byMonth.find(x => x > d.month());
      return nextVal ? moment(d).month(nextVal).startOf('months') : d;
    };

    while (this.stopLoop(limit, date)) {
      if (shouldExpandSeconds(date)) {
        // console.log('expanding seconds', date, this.bySecond)
        const nextVal = this.bySecond.find(x => x > date.second()) || date.second();
        date = moment(date).second(nextVal).startOf('hours');
      } else if (shouldExpandMinutes(date)) {
        // console.log('expanding minutes', date, this.byMinute)
        const nextVal = this.byMinute.find(x => x > date.minute()) || date.minute();
        date = moment(date).minute(nextVal).startOf('hours');
        date = expandSeconds(date);
      } else if (shouldExpandHours(date)) {
        // console.log('expanding hours', date, this.byHour)
        const nextVal = this.byHour.find(x => x > date.hour()) || date.hour();
        date = moment(date).hour(nextVal).startOf('hours');
        date = expandSeconds(expandMinutes(date));
      } else if (shouldExpandDays(date)) {
        // console.log('expanding days', date, this.byDay)
        const incr = Math.min(...this.byDay.map(x => (x <= date.day()) ? (7 + x - date.day()) : (x - date.day())));
        date = moment(date).add(incr, 'days').startOf('days');
        date = expandSeconds(expandMinutes(expandHours(date)));
      } else if (shouldExpandMonths(date)) {
        // console.log('expanding months', date, this.byMonth)
        const nextVal = this.byMonth.find(x => x > date.month()) || date.month();
        date = moment(date).month(nextVal).startOf('months');
        date = expandSeconds(expandMinutes(expandHours(expandDays(expandMonths(date)))));
      } else {
        // console.log('incrementing', date, this.interval, this.freqIncr)
        date = this.apply(moment(date).add(this.interval, this.freqIncr).startOf(this.freqIncr));
        date = expandSeconds(expandMinutes(expandHours(expandDays(expandMonths(date)))));
      }

      yield date;
      limit += 1;
    }
  }
};
