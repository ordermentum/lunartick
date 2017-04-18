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
    const timezone = this.rule.tzId || 'UTC';
    let limit = this.count;
    while (limit > 0) {
      const value = this.getNext(this.start || new TimezoneDate(new Date(), timezone));
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

    return intervalTime;
  }

  getLowerIntervals(fromDate) {
    const timezone = this.rule.tzId || 'UTC';
    const intervalTime = new TimezoneDate(fromDate || new Date(), timezone);
    return this.setLowerIntervals(intervalTime, intervalTime);
  }

  calculateFortnight(intervalTime) {
    // calculate the difference in weeks between the dtStart
    // and the current date.
    const result = this.rule.dtStart;
    const weekDiff = result.getWeekDiff(intervalTime);
    // ensures that it only gets the even week amount to advance the time.
    const evenWeeks = weekDiff - (weekDiff % 2);
    // Adds the even weeks to the dtStart which gives the last run time before
    // the current date.

    result.addWeeks(Math.abs(evenWeeks));
    const timezone = this.rule.tzId || 'UTC';
    return new TimezoneDate(result, timezone);
  }

  handleFortnight(intervalTime, fromDate) {
    let lastRun = fromDate;
    // if the start date is before the from Date advance the fromDate
    // until it's within 2 weeks of the current date.
    const timezone = this.rule.tzId || 'UTC';
    const startDate = new TimezoneDate(this.rule.dtStart, timezone);
    const startTime = this.setLowerIntervals(startDate, intervalTime);
    const pastDtStart = startTime.isSameOrBefore(fromDate);

    if (pastDtStart) {
      lastRun = this.calculateFortnight(intervalTime);
      lastRun.addFortnight();
    } else {
      return startTime;
    }

    return this.setLowerIntervals(lastRun, intervalTime);
  }

  handleLastMonthDay(tzFromDate, intervalTime) {
    const timezone = this.rule.tzId || 'UTC';
    // Gets the last day of the current month
    if (tzFromDate.getDate() === tzFromDate.getDaysInMonth() &&
      tzFromDate.isBefore(intervalTime)) {
        // It's the last day of the month and just need to
        // advance the times to the rules or last run intervals.
      return intervalTime;
    }

    // Advance the fromDate to the last day of the month.
    let lastMonthDay = new TimezoneDate(tzFromDate.addRemainingMonth(1), timezone);

    // If it's equal to or after the run time and we are
    // on the actual day, add a month.
    if (tzFromDate.isSameOrAfter(intervalTime.addRemainingMonth(1))) {
      lastMonthDay = new TimezoneDate(tzFromDate.addRemainingMonth(2), timezone);
    }

    // Set the HH/MM/SS intervals on the correct day.
    return this.setLowerIntervals(lastMonthDay, intervalTime);
  }

  handleMonthly(intervalTime, fromDate) {
    const timezone = this.rule.tzId || 'UTC';
    const tzFromDate = new TimezoneDate(fromDate, timezone);

    // Is it earlier in the month than the byMonthDay rule?
    // Need to process last day of the month...
    if (this.rule.byMonthDay[0] === -1) {
      return this.handleLastMonthDay(tzFromDate, intervalTime);
    }

    const intervals = new TimezoneDate(intervalTime, timezone);

    if (tzFromDate.getDate() < this.rule.byMonthDay[0]) {
      // If the from day of the month is before the specified date.
      intervalTime.setDate(this.rule.byMonthDay[0]);
    } else if (tzFromDate.getDate() > this.rule.byMonthDay[0]) {
      // If the from date is after the specified date.
      intervalTime.addMonth();
      intervalTime.setDate(this.rule.byMonthDay[0]);
    } else if (tzFromDate.getDate() === this.rule.byMonthDay[0]) {
      // If the from date is the same day as the byMonthDay.
      if (tzFromDate.isSameOrAfter(intervalTime)) {
        // And the time is after the intervals run time
        // then we need to skip ahead to the day next month.
        intervalTime.addMonth();
        intervalTime.setDate(this.rule.byMonthDay[0]);
      }
    }

    return this.setLowerIntervals(intervalTime, intervals);
  }

  getNext(fromDate) {
    const timezone = this.rule.tzId || 'UTC';
    const tzFromDate = new TimezoneDate(fromDate, timezone);
    const intervalTime = this.getLowerIntervals(tzFromDate);

    // If this rule is monthly
    if (this.rule.frequency === 5) {
      return this.handleMonthly(intervalTime, tzFromDate);
    }

    // If this rule is fortnightly
    if (this.rule.frequency === 4 && this.rule.interval === 2) {
      return this.handleFortnight(intervalTime, tzFromDate);
    }

    // Daily/Hourly/Minutely/Secondly can all advance in a similar
    // predictable fashion and don't need to be handled separately.
    if (this.rule.frequency === 4 && this.rule.interval === 1) {
      const day = this.rule.byDay[0];

      if (day !== intervalTime.getDay()) {
        intervalTime.setDay(day);
      }
    }

    if (tzFromDate.isBefore(intervalTime)) {
      return intervalTime;
    }

    const intervals = this.getLowerIntervals(intervalTime);
    for (let i = 0; i < this.rule.interval; i++) { // eslint-disable-line
      intervalTime[constants.ADD_FREQUENCY[this.rule.frequency]]();
    }


    return this.setLowerIntervals(intervalTime, intervals);
  }
}

module.exports = Iterator;
