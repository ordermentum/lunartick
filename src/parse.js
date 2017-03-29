const constants = require('./constants');
const TimezoneDate = require('./timezone_date');

/*
  Results are given as:
  {
    frequency = int [0..5]
    interval = int
    count = int
    bySetPos = array of integer
    byMonth = array of integer [1..12]
    byMonthDay = array of integer [1..28] & [-1]
    byYearDay = array of integer [0..364]
    byEaster = array of integer
    byWeekNo = array of integer [0..51]
    byDay = array of integer [0..6]
    byHour = array of integer [0..23]
    byMinute = array of integer [0..59]
    bySecond = array of integer [0..59]
    tzId = shortened stringified TZ.
  }
*/

class Parse {
  constructor(string) {
    this.string = string;
  }

  checkNaN(value, field) {
    if (isNaN(+value)) {
      throw new Error(`Invalid value "${value}" given for ${field}.`);
    }
  }

  validString() {
    if (typeof this.string !== 'string' || this.string.length === 0) {
      throw new Error('Invalid string provided.');
    }
  }

  handleFreq(arg) {
    const value = constants.FREQUENCIES[arg];
    if (!value) {
      throw new Error(`Invalid value "${arg}" given for FREQ.`);
    }

    return { frequency: value };
  }

  validateInterval(arg) {
    this.checkNaN(arg, 'INTERVAL');

    if (+arg < 1) {
      throw new Error(`Out of range value "${arg}" given for INTERVAL.`);
    }
  }

  handleInterval(arg) {
    this.validateInterval(arg);
    const value = +arg;
    return { interval: value };
  }

  validateCount(arg) {
    this.checkNaN(arg, 'COUNT');

    if (+arg < 1) {
      throw new Error(`Out of range value "${arg}" given for COUNT.`);
    }
  }

  handleCount(arg) {
    this.validateCount(arg);
    const value = +arg;
    return { count: value };
  }

  validateEaster(arg) {
    this.checkNaN(arg, 'BYEASTER');
  }

  handleByEaster(arg) {
    const split = arg.split(',');
    return { byEaster: split.map((s) => {
      this.validateEaster(s);
      return +s;
    }) };
  }

  validateYearDay(arg) {
    this.checkNaN(arg, 'BYYEARDAY');

    if (+arg < 0 || +arg > 364) {
      throw new Error(`Out of range value "${arg}" given for BYYEARDAY.`);
    }
  }

  handleByYearDay(arg) {
    const split = arg.split(',');
    return { byYearDay: split.map((s) => {
      this.validateYearDay(s);
      return +s;
    }) };
  }

  validateMonthDay(arg) {
    this.checkNaN(arg, 'BYMONTHDAY');
    if (+arg < -1 || +arg > 28 || +arg === 0) {
      throw new Error(`Out of range value "${arg}" given for BYMONTHDAY.`);
    }
  }

  handleByMonthDay(arg) {
    const split = arg.split(',');
    return { byMonthDay: split.map((s) => {
      this.validateMonthDay(s);
      return +s;
    }) };
  }

  validateWeekNo(arg) {
    this.checkNaN(arg, 'BYWEEKNO');
    if (+arg < 0 || +arg > 51) {
      throw new Error(`Out of range value "${arg}" given for BYWEEKNO.`);
    }
  }

  handleByWeekNo(arg) {
    const split = arg.split(',');
    return { byWeekNo: split.map((s) => {
      this.validateWeekNo(s);
      return +s;
    }) };
  }

  validateMonth(arg) {
    this.checkNaN(arg, 'BYMONTH');
    if (+arg < 0 || +arg > 11) {
      throw new Error(`Out of range value "${arg}" given for BYMONTH.`);
    }
  }

  handleByMonth(arg) {
    const split = arg.split(',');
    return { byMonth: split.map((s) => {
      this.validateMonth(s);
      return +s;
    }) };
  }

  validateDay(day) {
    if (constants.WEEK_DAYS[day] === undefined) {
      throw new Error(`Invalid value "${day}" given for BYDAY.`);
    }
  }

  handleByDay(arg) {
    const split = arg.split(',');
    return { byDay: split.map((s) => {
      this.validateDay(s);
      return constants.WEEK_DAYS[s];
    }) };
  }

  validateHour(arg) {
    this.checkNaN(arg, 'BYHOUR');
    if (+arg < 0 || +arg > 23) {
      throw new Error(`Out of range value "${arg}" given for BYHOUR.`);
    }
  }

  handleByHour(arg) {
    const split = arg.split(',');
    return { byHour: split.map((s) => {
      this.validateHour(s);
      return +s;
    }) };
  }

  validateMinute(arg) {
    this.checkNaN(arg, 'BYMINUTE');
    if (+arg < 0 || +arg > 59) {
      throw new Error(`Out of range value "${arg}" given for BYMINUTE.`);
    }
  }

  handleByMinute(arg) {
    const split = arg.split(',');
    return { byMinute: split.map((s) => {
      this.validateMinute(s);
      return +s;
    }) };
  }

  validateSecond(arg) {
    this.checkNaN(arg, 'BYSECOND');
    if (+arg < 0 || +arg > 59) {
      throw new Error(`Out of range value "${arg}" given for BYSECOND.`);
    }
  }

  handleBySecond(arg) {
    const split = arg.split(',');
    return { bySecond: split.map((s) => {
      this.validateSecond(s);
      return +s;
    }) };
  }

  handleInvalid(key) {
    throw new Error(`Invalid key ${key} provided in RRULE string.`);
  }

  validateSetPos(arg) {
    this.checkNaN(arg, 'BYSETPOS');
  }

  handleBySetPos(arg) {
    const split = arg.split(',');
    return { bySetPos: split.map((s) => {
      this.validateSetPos(s);
      return +s;
    }) };
  }

  handleDtStart(arg) {
    let dtStart;
    const tzMatch = this.string.match(/TZID=(.*?);/);
    try {
      const timezone = tzMatch && tzMatch[1] ? tzMatch[1] : 'UTC';
      dtStart = new TimezoneDate(arg, timezone);
    } catch (ex) {
      throw new Error('Invalid DTSTART provided.');
    }
    return { dtStart };
  }

  handleTzId(arg) {
    let tz = arg;
    const match = arg.match(/.+?(?=:)/);
    if (match) {
      tz = match[0];
    }

    return { tzId: tz };
  }

  get pairs() {
    return {
      FREQ: this.handleFreq.bind(this),
      INTERVAL: this.handleInterval.bind(this),
      COUNT: this.handleCount.bind(this),
      BYEASTER: this.handleByEaster.bind(this),
      BYYEARDAY: this.handleByYearDay.bind(this),
      BYMONTHDAY: this.handleByMonthDay.bind(this),
      BYWEEKNO: this.handleByWeekNo.bind(this),
      BYMONTH: this.handleByMonth.bind(this),
      BYDAY: this.handleByDay.bind(this),
      BYHOUR: this.handleByHour.bind(this),
      BYMINUTE: this.handleByMinute.bind(this),
      BYSECOND: this.handleBySecond.bind(this),
      BYSETPOS: this.handleBySetPos.bind(this),
      DTSTART: this.handleDtStart.bind(this),
      TZID: this.handleTzId.bind(this),
    };
  }

  handleSplit() {
    const pairs = this.split.map((s) => {
      const pair = s.split('=');

      if (!pair[1]) {
        throw new Error(`No value given for ${pair[0]} parameter.`);
      } else {
        return this.pairs[pair[0]] ?
          this.pairs[pair[0]](pair[1])
        :
          this.handleInvalid(pair[0]);
      }
    });

    return (pairs && pairs.length > 0) ? Object.assign(...pairs) : {};
  }

  parse() {
    this.validString();

    this.split = this.string.split(';');
    return this.handleSplit();
  }
}

module.exports = Parse;
