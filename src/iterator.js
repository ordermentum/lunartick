const TimezoneDate = require('./timezone_date');

class Iterator {
  constructor(rule = {}, start) {
    this.rule = rule;
    if (!this.rule.frequency) {
      throw new Error('Invalid rule, no frequency property on rule.')
    }

    if (!this.rule.interval) {
      this.rule.interval = 1;
    }

    this.start = new TimezoneDate(start);
  }

  get addFrequency() {
    return {
      0: 'addSecond',
      1: 'addMinute',
      2: 'addHour',
      3: 'addDay',
      4: 'addWeek',
      5: 'addMonth',
      6: 'addYear',
    }
  }

  // [Symbol.iterator]() {
  //   let limit = this.rule.count || 20;
  //   while (limit > 1) {
  //     // need to advance to the next instance of this
  //     // get next instance as TimezoneDate.date()
  //     // yield the new date.
  //     yield new TimezoneDate(this.start + this.rule.interval);
      
  //     limit = limit - 1;
  //   }
  // }

  getLowerIntervals(fromDate) {
    const intervalTime = new TimezoneDate(fromDate);

    if (this.rule.frequency > 0) {
      const seconds = (this.rule.bySecond && this.rule.bySecond[0]) || this.start.getSeconds();
      intervalTime.setSeconds(seconds);
    }
    if (this.rule.frequency > 1) {
      const minutes = (this.rule.byMinute && this.rule.byMinute[0]) || this.start.getMinutes();
      intervalTime.setMinutes(minutes);
    }
    if (this.rule.frequency > 2) {
      const hours = (this.rule.byHour && this.rule.byHour[0]) || this.start.getHours();
      intervalTime.setHours(hours);
    }
    if (this.rule.frequency > 3) {
      const day = (this.rule.byDay && this.rule.byDay[0]) || this.start.getDay();
      intervalTime.setDay(day);
    }

    return intervalTime;
  }

  getNext(fromDate) {
    let nextRun = new TimezoneDate(fromDate);

    const currentTime = new TimezoneDate();
    const intervalTime = this.getLowerIntervals(fromDate);

    if (currentTime.date < intervalTime.date) {
      return intervalTime.date;
    } else {
      for (let i = 0; i < this.rule.interval; i++) {
        intervalTime[this.addFrequency[this.rule.frequency]]();
      }

      return intervalTime.date;
    }

    // Check the interval type directly below to see if the
    // schedule has run for this frequency yet.

    // if the current time is less than the next run time
    // of the interval, it means it needs to run now.

    // Compile all the lower time units from the start time for
    // FIRST: CHECK bySecond, byMinute, byHour, byDay
    // IF those are set, check if based on the frequency,
    // has it gone past those times. 
    // FIRST: CHECK this.start
    // IF THIS.START

    // If the smaller time intervals are not specified
    // (e.g. byHour on a Daily schedule), the schedule
    // run time should be based on the intervals on the
    // start date time.

    // So if I have a 'FREQ=DAILY' schedule, and I first
    // kick it off at 2pm, it should then be run every day
    // at 2pm unless the schedule changes to specify the
    // byHour property.

    // The first version here will advance based on the frequency
    // and will only support a single specified smaller increment.
    // which would make this invalid initially:
    // "FREQ=DAILY;BYHOUR=14;BYMINUTE=30;BYSECOND=30;TZID=Australia/Sydney"

    // for (let i = 0; i < this.rule.interval; i++) {
    //   nextRun[this.addFrequency[this.rule.frequency]]();
    // }

    // return nextRun.date;
  }
}

module.exports = Iterator;
