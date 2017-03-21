const moment = require('moment-timezone');

const constants = require('./constants');
const TimezoneDate = require('./timezone_date');

class Iterator {
  constructor(rule = {}, start, count = null) {
    this.rule = rule;
    if (!this.rule || !this.rule.frequency) {
      throw new Error('Invalid rule, no frequency property on rule.');
    }

    this.rule.interval = this.rule.interval ? this.rule.interval : 1;

    if (count) {
      this.count = count;
    } else if (this.rule.count) {
      this.count = this.rule.count;
    } else {
      this.count = 52;
    }

    const timezone = this.rule.tzId || 'UTC';
    this.start = new TimezoneDate(start || new Date(), timezone);
  }

  * [Symbol.iterator]() {
    let limit = this.count;
    while (limit > 0) {
      const value = this.getNext(this.start || new Date());
      yield value;
      this.start = value;
      limit -= 1;
    }
  }

  setLowerIntervals(intervalTime, intervals) {
    if (this.rule.frequency > 0) {
      const seconds = this.rule.bySecond ? this.rule.bySecond[0] : intervals.getSeconds();
      intervalTime.setSeconds(seconds);
    }
    if (this.rule.frequency > 1) {
      const minutes = this.rule.byMinute ? this.rule.byMinute[0] : intervals.getMinutes();
      intervalTime.setMinutes(minutes);
    }
    if (this.rule.frequency > 2) {
      const hours = this.rule.byHour ? this.rule.byHour[0] : intervals.getHours();
      intervalTime.setHours(hours);
    }
    if (this.rule.frequency > 3) {
      const day = this.rule.byDay ? this.rule.byDay[0] : intervals.getDay();
      intervalTime.setDay(day);
    }

    return intervalTime;
  }

  getLowerIntervals(fromDate) {
    const timezone = this.rule.tzId || 'UTC';
    const intervalTime = new TimezoneDate(fromDate || new Date(), timezone);
    return this.setLowerIntervals(intervalTime, intervalTime);
  }

  getNext(fromDate) {
    const intervalTime = this.getLowerIntervals(fromDate);
    let result;

    if (fromDate.toISOString) fromDate = fromDate.toISOString(); // eslint-disable-line

    if (moment(fromDate).isBefore(intervalTime.date.toISOString())) {
      result = intervalTime;
    } else {
      const intervals = this.getLowerIntervals(intervalTime);
      for (let i = 0; i < this.rule.interval; i++) {
        intervalTime[constants.ADD_FREQUENCY[this.rule.frequency]]();
      }

      result = this.setLowerIntervals(intervalTime, intervals);
    }

    return result;
  }
}

module.exports = Iterator;
