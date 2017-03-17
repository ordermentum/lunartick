const constants = require('./constants');

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
  }
*/

class Parse {
  constructor(string) {
    this.string = string;
  }

  checkNaN(value, field) {
    if (isNaN(+value)) {
      throw new Error(`Invalid value "${value}" given for ${field}.`);
      return true;
    }

    return false
  }

  validString() {
    if (typeof this.string !== 'string' || this.string.length === 0) {
      throw new Error('Invalid string provided.');
      return false;
    }

    return true;
  }

  handleFreq(arg) {
    let value = constants.FREQUENCIES[arg];
    if (!value) {
      throw new Error(`Invalid value "${arg}" given for FREQ.`);
      return { frequency: null };
    }

    return { frequency: value };
  }

  validateInterval(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'INTERVAL')) {
      valid = false;
    }

    if (+arg < 1) {
      throw new Error(`Out of range value "${arg}" given for INTERVAL.`);
      valid = false;
    }

    return valid;
  }

  handleInterval(arg) {
    const value = +arg;
    return { interval: this.validateInterval(arg) ? value : null };
  }

  validateCount(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'COUNT')) {
      valid = false;
    }

    if (+arg < 1) {
      throw new Error(`Out of range value "${arg}" given for COUNT.`);
      valid = false;
    }

    return valid;
  }

  handleCount(arg) {
    const value = +arg;
    return { count: this.validateCount(arg) ? value : null };
  }

  validateEaster(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYEASTER')) {
      valid = false;
    }

    return valid;
  }

  handleByEaster(arg) {
    const split = arg.split(',');
    return { byEaster: split.map(s => {
              return this.validateEaster(s) ? +s : null;
            }) };
  }

  validateYearDay(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYYEARDAY')) {
      valid = false;
    } else if (+arg < 0 || +arg > 364) {
      valid = false;
      throw new Error(`Out of range value "${arg}" given for BYYEARDAY.`);
    }

    return valid;
  }

  handleByYearDay(arg) {
    const split = arg.split(',');
    return { byYearDay: split.map(s => {
              return this.validateYearDay(s) ? +s : null;
            }) };
  }

  validateMonthDay(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYMONTHDAY')) {
      valid = false;
    } else if (+arg < -1 || +arg > 28 || +arg === 0) {
      valid = false;
      throw new Error(`Out of range value "${arg}" given for BYMONTHDAY.`);
    }

    return valid;
  }

  handleByMonthDay(arg) {
    const split = arg.split(',');
    return { byMonthDay: split.map(s => {
              return this.validateMonthDay(s) ? +s : null;
            }) };
  }

  validateWeekNo(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYWEEKNO')) {
      valid = false;
    } else if (+arg < 0 || +arg > 51) {
      valid = false;
      throw new Error(`Out of range value "${arg}" given for BYWEEKNO.`);
    }

    return valid;
  }

  handleByWeekNo(arg) {
    const split = arg.split(',');
    return { byWeekNo: split.map(s => {
              return this.validateWeekNo(s) ? +s : null;
            }) };
  }

  validateMonth(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYMONTH')) {
      valid = false;
    } else if (+arg < 0 || +arg > 11) {
      valid = false;
      throw new Error(`Out of range value "${arg}" given for BYMONTH.`);
    }

    return valid;
  }

  handleByMonth(arg) {
    const split = arg.split(',');
    return { byMonth: split.map(s => {
              return this.validateMonth(s) ? +s : null;
            }) };
  }

  validateDay(day) {
    let valid = true;
    if (constants.WEEK_DAYS[day] === undefined) {
      valid = false;
      throw new Error(`Invalid value "${day}" given for BYDAY.`);
    };

    return valid;
  }

  handleByDay(arg) {
    const split = arg.split(',');
    return { byDay: split.map(s => {
              return this.validateDay(s) ? constants.WEEK_DAYS[s] : null;
            }) };
  }

  validateHour(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYHOUR')) {
      valid = false;
    } else if (+arg < 0 || +arg > 23) {
      valid = false;
      throw new Error(`Out of range value "${arg}" given for BYHOUR.`);
    }

    return valid;
  }

  handleByHour(arg) {
    const split = arg.split(',');
    return { byHour: split.map(s => {
              return this.validateHour(s) ? +s : null;
            }) };
  }

  validateMinute(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYMINUTE')) {
      valid = false;
    }
    if (+arg < 0 || +arg > 59) {
      throw new Error(`Out of range value "${arg}" given for BYMINUTE.`);
      valid = false;
    }

    return valid;
  }

  handleByMinute(arg) {
    const split = arg.split(',');
    return { byMinute: split.map(s => {
              return this.validateMinute(s) ? +s : null;
            }) };
  }

  validateSecond(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYSECOND')) {
      valid = false;
    };
    if (+arg < 0 || +arg > 59) {
      valid = false;
      throw new Error(`Out of range value "${arg}" given for BYSECOND.`);
    }

    return valid;
  }

  handleBySecond(arg) {
    const split = arg.split(',');
    return { bySecond: split.map(s => {
              return this.validateSecond(s) ? +s : null;
            }) };
  }

  handleInvalid(key) {
    throw new Error(`Invalid key ${key} provided in RRULE string.`);
  }

  validateSetPos(arg) {
    let valid = true;
    if (this.checkNaN(arg, 'BYSETPOS')) {
      valid = false;
    }

    return valid;
  }

  handleBySetPos(arg) {
    const split = arg.split(',');
    return { bySetPos: split.map(s => {
              return this.validateSetPos(s) ? +s : null;
            }) };
  }

  handleDtStart(arg) {
    return { dtStart: arg };
  }

  handleTzId(arg) {
    return { tzId: arg };
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
    }
  }

  handleSplit() {
    const pairs = this.split.map(s => {
      const pair = s.split('=');

      if (!pair[1]) {
        throw new Error(`No value given for ${pair[0]} parameter.`);
        return { [pair[0]]: null };
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
    if (!this.validString()) {
      return {
        result: {},
        errors: this.errors,
      }
    };

    this.split = this.string.split(';');
    return this.handleSplit();
  }
}

module.exports = Parse;
