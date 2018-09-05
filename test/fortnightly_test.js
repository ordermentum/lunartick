const sinon = require('sinon');
const { expect } = require('chai');

const TimezoneDate = require('../src/timezone_date');
const Iterator = require('../src/iterator');

describe('Fortnightly RRule iterations', () => {
  it('Should return correctly for a future time on the day of', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 20, 11));

    const iterator = new Iterator({
      frequency: 4,
      interval: 2,
      byHour: [12],
      byMinute: [0],
      dtStart: new TimezoneDate('2017-02-20T00:00:00', 'UTC'),
    }, new TimezoneDate(new Date(), 'UTC'), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(20);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(2);
    expect(next[1].getDate()).to.equal(6);

    expect(next[2].getMonth()).to.equal(2);
    expect(next[2].getDate()).to.equal(20);

    expect(next[3].getMonth()).to.equal(3);
    expect(next[3].getDate()).to.equal(3);

    expect(next[4].getMonth()).to.equal(3);
    expect(next[4].getDate()).to.equal(17);

    timer.restore();
  });

  it('Should return correctly for a valid future fortnightly schedule', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 20, 11));

    const iterator = new Iterator({
      frequency: 4,
      interval: 2,
      byHour: [12],
      byMinute: [0],
      dtStart: new TimezoneDate('2017-03-03T12:00:00', 'UTC'),
    }, new TimezoneDate(new Date(), 'UTC'), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(2);
    expect(next[0].getDate()).to.equal(3);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(2);
    expect(next[1].getDate()).to.equal(17);

    expect(next[2].getMonth()).to.equal(2);
    expect(next[2].getDate()).to.equal(31);

    expect(next[3].getMonth()).to.equal(3);
    expect(next[3].getDate()).to.equal(14);

    expect(next[4].getMonth()).to.equal(3);
    expect(next[4].getDate()).to.equal(28);

    timer.restore();
  });

  it('Should return correctly for a valid past fortnightly schedule', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 2, 20, 11));

    const iterator = new Iterator({
      frequency: 4,
      interval: 2,
      byHour: [12],
      byMinute: [0],
      dtStart: new TimezoneDate('2017-03-03T12:00:00', 'UTC'),
    }, new TimezoneDate(new Date(), 'UTC'), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(2);
    expect(next[0].getDate()).to.equal(31);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(3);
    expect(next[1].getDate()).to.equal(14);

    expect(next[2].getMonth()).to.equal(3);
    expect(next[2].getDate()).to.equal(28);

    expect(next[3].getMonth()).to.equal(4);
    expect(next[3].getDate()).to.equal(12);

    expect(next[4].getMonth()).to.equal(4);
    expect(next[4].getDate()).to.equal(26);

    timer.restore();
  });
});
