const Parse = require('./parse');
const Iterator = require('./iterator');
const constants = require('./constants');

class Rule {
  constructor({
    frequency,
    interval,
    count,
    bySetPos,
    byYearDay,
    byMonth,
    byMonthDay,
    byWeekNo,
    byEaster,
    byDay,
    byHour,
    byMinute,
    bySecond,
    tzId,
  } = {}) {
    this.frequency = frequency;
    this.interval = interval;
    this.count = count;
    this.bySetPos = bySetPos;
    this.byYearDay = byYearDay;
    this.byMonth = byMonth;
    this.byMonthDay = byMonthDay;
    this.byWeekNo = byWeekNo;
    this.byEaster = byEaster;
    this.byDay = byDay;
    this.byHour = byHour;
    this.byMinute = byMinute;
    this.bySecond = bySecond;
    this.tzId = tzId;
  }

  static parse(string) {
    return new Rule(new Parse(string).parse());
  }

  static legacyParse(recurrence) {
    const result = {};

    Object.keys(recurrence).forEach((key) => {
      if (key === 'freq') {
        result.frequency = constants.FREQUENCIES[recurrence.freq.toUpperCase()];
      } else if (constants.LEGACY[key] && recurrence[key] !== null) {
        result[constants.LEGACY[key]] = recurrence[key];
      } else if (recurrence[key] !== null) {
        result[key] = recurrence[key];
      }
    });

    return new Rule(result);
  }

  toString() {
    // TODO: Return the RRuleString
  }

  iterator(start = null) {
    return new Iterator(this, start);
  }
}

module.exports = Rule;
