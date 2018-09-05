const sinon = require('sinon');
const { expect } = require('chai');

const TimezoneDate = require('../src/timezone_date');
const Iterator = require('../src/iterator');

describe('Sundays', () => {
  it('should not skip a week before the right time for weekly intervals', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 3, 16, 11));

    const now = new TimezoneDate();
    expect(now.getDay()).to.equal(6);

    const iterator = new Iterator({
      frequency: 4,
      interval: 1,
      byDay: [6],
      byHour: [12],
      byMinute: [0],
      timezone: 'Australia/Sydney',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(3);
    expect(next[0].getDate()).to.equal(16);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(3);
    expect(next[1].getDate()).to.equal(23);

    expect(next[2].getMonth()).to.equal(3);
    expect(next[2].getDate()).to.equal(30);

    expect(next[3].getMonth()).to.equal(4);
    expect(next[3].getDate()).to.equal(7);

    expect(next[4].getMonth()).to.equal(4);
    expect(next[4].getDate()).to.equal(14);

    timer.restore();
  });

  it('should calculate weekly intervals correctly when the time has passed', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 3, 16, 13));

    const now = new TimezoneDate();
    expect(now.getDay()).to.equal(6);

    const iterator = new Iterator({
      frequency: 4,
      interval: 1,
      byDay: [6],
      byHour: [12],
      byMinute: [0],
      timezone: 'Australia/Sydney',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(3);
    expect(next[0].getDate()).to.equal(23);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(3);
    expect(next[1].getDate()).to.equal(30);

    expect(next[2].getMonth()).to.equal(4);
    expect(next[2].getDate()).to.equal(7);

    expect(next[3].getMonth()).to.equal(4);
    expect(next[3].getDate()).to.equal(14);

    expect(next[4].getMonth()).to.equal(4);
    expect(next[4].getDate()).to.equal(21);

    timer.restore();
  });

  it('should not skip a fortnight before the right time for fortnightly intervals', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 3, 16, 11));

    const now = new TimezoneDate();
    expect(now.getDay()).to.equal(6);

    const iterator = new Iterator({
      frequency: 4,
      interval: 2,
      byHour: [12],
      byMinute: [0],
      dtStart: new TimezoneDate('2017-04-16T00:00:00', 'UTC'),
      timezone: 'Australia/Sydney',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(3);
    expect(next[0].getDate()).to.equal(16);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(3);
    expect(next[1].getDate()).to.equal(30);

    expect(next[2].getMonth()).to.equal(4);
    expect(next[2].getDate()).to.equal(14);

    expect(next[3].getMonth()).to.equal(4);
    expect(next[3].getDate()).to.equal(28);

    expect(next[4].getMonth()).to.equal(5);
    expect(next[4].getDate()).to.equal(11);

    timer.restore();
  });

  it('should advance correctly after the right time for fortnightly intervals', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 3, 16, 13));

    const now = new TimezoneDate();
    expect(now.getDay()).to.equal(6);

    const iterator = new Iterator({
      frequency: 4,
      interval: 2,
      byHour: [12],
      byMinute: [0],
      dtStart: new TimezoneDate('2017-04-16T00:00:00', 'UTC'),
      timezone: 'Australia/Sydney',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(3);
    expect(next[0].getDate()).to.equal(30);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(4);
    expect(next[1].getDate()).to.equal(14);

    expect(next[2].getMonth()).to.equal(4);
    expect(next[2].getDate()).to.equal(28);

    expect(next[3].getMonth()).to.equal(5);
    expect(next[3].getDate()).to.equal(11);

    expect(next[4].getMonth()).to.equal(5);
    expect(next[4].getDate()).to.equal(25);

    timer.restore();
  });
});
