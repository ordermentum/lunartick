const { expect } = require('chai');

const Parse = require('../src/parse');
const fixtures = require('./fixtures.json');

describe('Parse', () => {
  const keys = Object.keys(fixtures);
  keys.forEach((key) => {
    it(`Parsing ${key} matches expected object`, () => {
      const parsed = new Parse(key).parse();

      expect(parsed).to.deep.equal(fixtures[key]);
    });
  });

  it('should return an error if an invalid parameter is given', () => {
    let err;
    try {
      new Parse(42).parse();
    } catch (ex) {
      err = ex;
    }

    expect(err.message).to.equal('Invalid string provided.');
  });

  describe('frequencies', () => {
    it('should return an error for an invalid FREQ', () => {
      let err;
      try {
        new Parse('FREQ=MEOWLY').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "MEOWLY" given for FREQ.');
    });
  });

  describe('intervals', () => {
    it('should return an error for an invalid INTERVAL', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;INTERVAL=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for INTERVAL.');
    });

    it('should return an out of range error for a negative INTERVAL', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;INTERVAL=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for INTERVAL.');
    });
  });

  describe('count', () => {
    it('should return an error for an invalid COUNT', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;COUNT=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for COUNT.');
    });

    it('should return an out of range error for a negative COUNT', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;COUNT=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for COUNT.');
    });
  });

  describe('bySetPos', () => {
    it('should return an error for an invalid FREQ', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;BYSETPOS=LEO').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "LEO" given for BYSETPOS.');
    });
  });

  describe('byMonth', () => {
    it('should return an error for an invalid BYMONTH', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTH=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYMONTH.');
    });

    it('should return a out of range error for a BYMONTH value less than 0', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTH=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for BYMONTH.');
    });

    it('should return a out of range error for a BYMONTH value more than 11', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTH=12').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "12" given for BYMONTH.');
    });
  });

  describe('byMonthDay', () => {
    it('should return an error for an invalid BYMONTHDAY', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTHDAY=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYMONTHDAY.');
    });

    it('should return a out of range error for a BYMONTHDAY value less than -1', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTHDAY=-2').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-2" given for BYMONTHDAY.');
    });

    it('should return a out of range error for a BYMONTHDAY equal to 0', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTHDAY=0').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "0" given for BYMONTHDAY.');
    });

    it('should return a out of range error for a BYMONTHDAY value more than 28', () => {
      let err;
      try {
        new Parse('FREQ=MONTHLY;BYMONTHDAY=29').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "29" given for BYMONTHDAY.');
    });
  });

  describe('byYearDay', () => {
    it('should return an error for an invalid BYYEARDAY', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYYEARDAY=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYYEARDAY.');
    });

    it('should return a out of range error for a BYYEARDAY value less than 0', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYYEARDAY=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for BYYEARDAY.');
    });

    it('should return a out of range error for a BYYEARDAY value more than 364', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYYEARDAY=365').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "365" given for BYYEARDAY.');
    });
  });

  describe('byEaster', () => {
    it('should return an error for an invalid BYEASTER', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;BYEASTER=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYEASTER.');
    });
  });

  describe('byWeekNo', () => {
    it('should return an error for an invalid BYWEEKNO', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYWEEKNO=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYWEEKNO.');
    });

    it('should return a out of range error for a BYWEEKNO value less than 0', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYWEEKNO=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for BYWEEKNO.');
    });

    it('should return a out of range error for a BYWEEKNO value more than 51', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYWEEKNO=52').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "52" given for BYWEEKNO.');
    });
  });

  describe('byDay', () => {
    it('should return an error for an invalid BYDAY', () => {
      let err;
      try {
        new Parse('FREQ=WEEKLY;BYDAY=CA').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CA" given for BYDAY.');
    });
  });

  describe('byHour', () => {
    it('should return an error for an invalid BYHOUR', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYHOUR=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYHOUR.');
    });

    it('should return a out of range error for a BYHOUR value less than 0', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYHOUR=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for BYHOUR.');
    });

    it('should return a out of range error for a BYHOUR value more than 23', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYHOUR=24').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "24" given for BYHOUR.');
    });
  });

  describe('byMinute', () => {
    it('should return an error for an invalid BYMINUTE', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYMINUTE=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYMINUTE.');
    });

    it('should return a out of range error for a BYMINUTE value less than 0', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYMINUTE=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for BYMINUTE.');
    });

    it('should return a out of range error for a BYMINUTE value more than 59', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYMINUTE=60').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "60" given for BYMINUTE.');
    });
  });

  describe('bySecond', () => {
    it('should return an error for an invalid BYSECOND', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYSECOND=CAT').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Invalid value "CAT" given for BYSECOND.');
    });

    it('should return a out of range error for a BYSECOND value less than 0', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYSECOND=-1').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "-1" given for BYSECOND.');
    });

    it('should return a out of range error for a BYSECOND value more than 59', () => {
      let err;
      try {
        new Parse('FREQ=YEARLY;BYSECOND=60').parse();
      } catch (ex) {
        err = ex;
      }

      expect(err.message).to.equal('Out of range value "60" given for BYSECOND.');
    });
  });
});
