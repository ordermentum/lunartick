const moment = require('moment-timezone');

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
    dtStart,
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
    this.dtStart = dtStart;
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
    const rule = JSON.parse(JSON.stringify(this));

    let result = '';
    for (const prop in rule) { // eslint-disable-line
      result = `${result}${constants.STRINGS[prop]}=`;
      if (prop === 'frequency') {
        const freqName = constants.STRING_FREQUENCIES[rule[prop]];
        result = `${result}${freqName};`;
      } else if (prop === 'dtStart') {
        const javaDate = moment(rule[prop]).format('YYYYMMDDTHHmmsss');
        result = `${result}${javaDate}`;
      } else {
        result = `${result}${rule[prop]};`;
      }
    }

    return result.slice(0, -1);
  }

  iterator(start = null) {
    return new Iterator(this, start);
  }
}

module.exports = Rule;
