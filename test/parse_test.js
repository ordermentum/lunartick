const { expect } = require('chai');

const Parse = require('../src/parse');
const fixtures = require('./fixtures.json');

describe('Parse', () => {
  const keys = Object.keys(fixtures);
  keys.forEach((key) => {
    it(`Parsing ${key} matches expected object`, () => {
      const parsed = new Parse(key).parse();

      expect(parsed.result).to.deep.equal(fixtures[key]);
    });
  });

  it('should return an error if an invalid parameter is given', () => {
    const parsed = new Parse(42).parse();

    expect(parsed.errors).to.include('Invalid string provided.');
  });

  describe('frequencies', () => {
    it('should return an error for an invalid FREQ', () => {
      const parsed = new Parse('FREQ=MEOWLY').parse();

      expect(parsed.errors).to.include('Invalid value "MEOWLY" given for FREQ.')
      expect(parsed.result.frequency).to.equal(null);
    });
  });

  describe('intervals', () => {
    it('should return an error for an invalid INTERVAL', () => {
      const parsed = new Parse('FREQ=WEEKLY;INTERVAL=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for INTERVAL.')
      expect(parsed.result.interval).to.equal(null);
    });

    it('should return an out of range error for a negative INTERVAL', () => {
      const parsed = new Parse('FREQ=WEEKLY;INTERVAL=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for INTERVAL.')
      expect(parsed.result.interval).to.equal(null);
    });
  });

  describe('count', () => {
    it('should return an error for an invalid COUNT', () => {
      const parsed = new Parse('FREQ=WEEKLY;COUNT=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for COUNT.')
      expect(parsed.result.count).to.equal(null);
    });

    it('should return an out of range error for a negative COUNT', () => {
      const parsed = new Parse('FREQ=WEEKLY;COUNT=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for COUNT.')
      expect(parsed.result.count).to.equal(null);
    });
  });

  describe('bySetPos', () => {
    it('should return an error for an invalid FREQ', () => {
      const parsed = new Parse('FREQ=WEEKLY;BYSETPOS=LEO').parse();

      expect(parsed.errors).to.include('Invalid value "LEO" given for BYSETPOS.')
      expect(parsed.result.bySetPos).to.include(null);
    });
  });

  describe('byMonth', () => {
    it('should return an error for an invalid BYMONTH', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTH=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYMONTH.')
      expect(parsed.result.byMonth).to.include(null);
    });

    it('should return a out of range error for a BYMONTH value less than 0', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTH=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for BYMONTH.')
      expect(parsed.result.byMonth).to.include(null);
    });

    it('should return a out of range error for a BYMONTH value more than 11', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTH=12').parse();

      expect(parsed.errors).to.include('Out of range value "12" given for BYMONTH.')
      expect(parsed.result.byMonth).to.include(null);
    });
  });

  describe('byMonthDay', () => {
    it('should return an error for an invalid BYMONTHDAY', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTHDAY=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYMONTHDAY.')
      expect(parsed.result.byMonthDay).to.include(null);
    });

    it('should return a out of range error for a BYMONTHDAY value less than -1', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTHDAY=-2').parse();

      expect(parsed.errors).to.include('Out of range value "-2" given for BYMONTHDAY.')
      expect(parsed.result.byMonthDay).to.include(null);
    });

    it('should return a out of range error for a BYMONTHDAY equal to 0', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTHDAY=0').parse();

      expect(parsed.errors).to.include('Out of range value "0" given for BYMONTHDAY.')
      expect(parsed.result.byMonthDay).to.include(null);
    });

    it('should return a out of range error for a BYMONTHDAY value more than 28', () => {
      const parsed = new Parse('FREQ=MONTHLY;BYMONTHDAY=29').parse();

      expect(parsed.errors).to.include('Out of range value "29" given for BYMONTHDAY.')
      expect(parsed.result.byMonthDay).to.include(null);
    });
  });

  describe('byYearDay', () => {
    it('should return an error for an invalid BYYEARDAY', () => {
      const parsed = new Parse('FREQ=YEARLY;BYYEARDAY=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYYEARDAY.')
      expect(parsed.result.byYearDay).to.include(null);
    });

    it('should return a out of range error for a BYYEARDAY value less than 0', () => {
      const parsed = new Parse('FREQ=YEARLY;BYYEARDAY=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for BYYEARDAY.')
      expect(parsed.result.byYearDay).to.include(null);
    });

    it('should return a out of range error for a BYYEARDAY value more than 364', () => {
      const parsed = new Parse('FREQ=YEARLY;BYYEARDAY=365').parse();

      expect(parsed.errors).to.include('Out of range value "365" given for BYYEARDAY.')
      expect(parsed.result.byYearDay).to.include(null);
    });
  });

  describe('byEaster', () => {
    it('should return an error for an invalid BYEASTER', () => {
      const parsed = new Parse('FREQ=WEEKLY;BYEASTER=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYEASTER.')
      expect(parsed.result.byEaster).to.include(null);
    });
  });

  describe('byWeekNo', () => {
    it('should return an error for an invalid BYWEEKNO', () => {
      const parsed = new Parse('FREQ=YEARLY;BYWEEKNO=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYWEEKNO.')
      expect(parsed.result.byWeekNo).to.include(null);
    });

    it('should return a out of range error for a BYWEEKNO value less than 0', () => {
      const parsed = new Parse('FREQ=YEARLY;BYWEEKNO=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for BYWEEKNO.')
      expect(parsed.result.byWeekNo).to.include(null);
    });

    it('should return a out of range error for a BYWEEKNO value more than 51', () => {
      const parsed = new Parse('FREQ=YEARLY;BYWEEKNO=52').parse();

      expect(parsed.errors).to.include('Out of range value "52" given for BYWEEKNO.')
      expect(parsed.result.byWeekNo).to.include(null);
    });
  });

  describe('byDay', () => {
    it('should return an error for an invalid BYDAY', () => {
      const parsed = new Parse('FREQ=WEEKLY;BYDAY=CA').parse();

      expect(parsed.errors).to.include('Invalid value "CA" given for BYDAY.')
      expect(parsed.result.byDay).to.include(null);
    });
  });

  describe('byHour', () => {
    it('should return an error for an invalid BYHOUR', () => {
      const parsed = new Parse('FREQ=YEARLY;BYHOUR=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYHOUR.')
      expect(parsed.result.byHour).to.include(null);
    });

    it('should return a out of range error for a BYHOUR value less than 0', () => {
      const parsed = new Parse('FREQ=YEARLY;BYHOUR=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for BYHOUR.')
      expect(parsed.result.byHour).to.include(null);
    });

    it('should return a out of range error for a BYHOUR value more than 23', () => {
      const parsed = new Parse('FREQ=YEARLY;BYHOUR=24').parse();

      expect(parsed.errors).to.include('Out of range value "24" given for BYHOUR.')
      expect(parsed.result.byHour).to.include(null);
    });
  });

  describe('byMinute', () => {
    it('should return an error for an invalid BYMINUTE', () => {
      const parsed = new Parse('FREQ=YEARLY;BYMINUTE=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYMINUTE.')
      expect(parsed.result.byMinute).to.include(null);
    });

    it('should return a out of range error for a BYMINUTE value less than 0', () => {
      const parsed = new Parse('FREQ=YEARLY;BYMINUTE=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for BYMINUTE.')
      expect(parsed.result.byMinute).to.include(null);
    });

    it('should return a out of range error for a BYMINUTE value more than 59', () => {
      const parsed = new Parse('FREQ=YEARLY;BYMINUTE=60').parse();

      expect(parsed.errors).to.include('Out of range value "60" given for BYMINUTE.')
      expect(parsed.result.byMinute).to.include(null);
    });
  });

  describe('bySecond', () => {
    it('should return an error for an invalid BYSECOND', () => {
      const parsed = new Parse('FREQ=YEARLY;BYSECOND=CAT').parse();

      expect(parsed.errors).to.include('Invalid value "CAT" given for BYSECOND.')
      expect(parsed.result.bySecond).to.include(null);
    });

    it('should return a out of range error for a BYSECOND value less than 0', () => {
      const parsed = new Parse('FREQ=YEARLY;BYSECOND=-1').parse();

      expect(parsed.errors).to.include('Out of range value "-1" given for BYSECOND.')
      expect(parsed.result.bySecond).to.include(null);
    });

    it('should return a out of range error for a BYSECOND value more than 59', () => {
      const parsed = new Parse('FREQ=YEARLY;BYSECOND=60').parse();

      expect(parsed.errors).to.include('Out of range value "60" given for BYSECOND.')
      expect(parsed.result.bySecond).to.include(null);
    });
  });
});
