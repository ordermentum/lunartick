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
    this.count = opts.count || 1;
    this.byMonth = opts.byMonth ? opts.byMonth.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.month()];
    this.byWeekNo = opts.byWeekNo ? opts.byWeekNo.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.week()];
    this.byYearDay = opts.byYearDay ? opts.byYearDay.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.dayOfYear()];
    this.byMonthDay = opts.byMonthDay ? opts.byMonthDay.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.date()];
    this.byDay = opts.byDay ? opts.byDay.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.day()];
    this.byHour = opts.byHour ? opts.byHour.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.hour()];
    this.byMinute = opts.byMinute ? opts.byMinute.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.minute()];
    this.bySecond = opts.bySecond ? opts.bySecond.sort((a, b) => (a <= b ? -1 : 1)) : [this.dtstart.second()];
  }

  // xBYMONTH
  // BYWEEKNO
  // BYYEARDAY
  // BYMONTHDAY
  // xBYDAY
  // xBYHOUR
  // xBYMINUTE
  // xBYSECOND
  // BYSETPOS

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
    if (this.byMonth.includes(date.month())) {
      return moment(date);
    }

    const incr = Math.min(...this.byMonth.map(x => x < date.month() ? 12 + x - date.month() : x - date.month()));

    return moment(date).add(incr, 'months').startOf('month');
  }

  applyByDay(date) {
    if (this.byDay.includes(date.day())) {
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
      return moment(date);
    }

    const incr = Math.min(...this.bySecond.map(x => x <= date.second() ? 60 + x - date.second() : x - date.second()));
    const nextDate = moment(date).add(incr, 'seconds').startOf('second');

    if (date.minute() === nextDate.minute()) return nextDate;

    return this.applyBySecond(this.applyByMinute(nextDate));
  }


  * [Symbol.iterator]() {
    let date = this.dtstart;
    let nextDate = this.dtstart;

    let limit = this.count;

    while (limit > 0) {
      nextDate = this.apply(moment(date));

      if (nextDate.toISOString() === date.toISOString()) {
        nextDate = this.apply(moment(nextDate).add(1, 'seconds').startOf('seconds'));
      }

      if (nextDate.toISOString() === date.toISOString()) {
        nextDate = this.apply(moment(nextDate).add(this.interval, this.freqIncr).startOf(this.freqIncr));
      }

      date = nextDate;
      yield date;

      limit -= 1;
    }
  }
};
