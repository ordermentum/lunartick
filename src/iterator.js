const moment = require('moment-timezone');

const constants = require('./constants');
const TimezoneDate = require('./timezone_date');

class Iterator {
  constructor(rule = {}, start) {
    this.rule = rule;
    if (!this.rule || !this.rule.frequency) {
      throw new Error('Invalid rule, no frequency property on rule.');
    }

    if (!this.rule.interval) {
      this.rule.interval = 1;
    }

    this.start = new TimezoneDate(start || new Date(), this.rule.tzId);
  }

  *[Symbol.iterator]() {
    let limit = this.rule.count || 100;
    while (limit > 0) {
      const value = this.getNext(this.start);
      yield value;
      this.start = value;
      limit = limit - 1;
    }
  }

  setLowerIntervals(intervalTime) {
    if (this.rule.frequency > 0) {
      const seconds = this.rule.bySecond ? this.rule.bySecond[0] : intervalTime.getSeconds();
      intervalTime.setSeconds(seconds);
    }
    if (this.rule.frequency > 1) {
      const minutes = this.rule.byMinute ? this.rule.byMinute[0] : intervalTime.getMinutes();
      intervalTime.setMinutes(minutes);
    }
    if (this.rule.frequency > 2) {
      const hours = this.rule.byHour ? this.rule.byHour[0] : intervalTime.getHours();
      intervalTime.setHours(hours);
    }
    if (this.rule.frequency > 3) {
      const day = this.rule.byDay ? this.rule.byDay[0] : intervalTime.getDay();
      intervalTime.setDay(day);
    }

    return intervalTime;
  }

  getLowerIntervals(fromDate) {
    const intervalTime = new TimezoneDate(fromDate || new Date(), this.rule.tzId);
    return this.setLowerIntervals(intervalTime);
  }

  getNext(fromDate) {
    const intervalTime = this.getLowerIntervals(fromDate);
    let result;

    if (fromDate.toISOString) fromDate = fromDate.toISOString(); // eslint-disable-line

    if (moment(fromDate).isBefore(intervalTime.date.toISOString())) {
      result = intervalTime;
    } else {
      for (let i = 0; i < this.rule.interval; i++) {
        intervalTime[constants.ADD_FREQUENCY[this.rule.frequency]]();
      }

      this.setLowerIntervals(intervalTime);
      result = intervalTime;
    }

    return result;
  }
}

module.exports = Iterator;
