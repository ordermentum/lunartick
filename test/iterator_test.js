const moment = require('moment-timezone');
const { expect } = require('chai');
const sinon = require('sinon');

const Iterator = require('../src/iterator');

describe('Iterator', () => {
  it('freezes time', () => {
    // TZ=America/Chicago yarn test
    // TZ=Australia/Sydney yarn test
    const timer = sinon.useFakeTimers(Date.UTC(2016, 3, 12, 11));

    const iterator = new Iterator({
      frequency: 3,
      byDay: [12],
      byHour: [10],
      byMinute: [30],
      tzId: 'America/Los_Angeles',
    });

    const next = iterator.getNext(new Date());
    console.log('Next Run (as UTC)', next.toUTCString());
    expect(next.toISOString()).to.equal('2016-04-12T17:30:00.000Z');
    expect(next.getDate()).to.equal(12);
    expect(next.getHours()).to.equal(17);
    expect(next.getMinutes()).to.equal(30);

    timer.restore();
  });

  it('hours should stay the same local time when given a DST timezone', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 02, 25, 0));

    const iterator = new Iterator({
      frequency: 4,
      byDay: [2],
      byHour: [10],
      byMinute: [30],
      tzId: 'Australia/Sydney',
      count: 2,
    });

    const nextEvents = []
    for (const iteration of iterator) {
      nextEvents.push(iteration);
    }

    expect(nextEvents[0].getHours()).to.equal(10);
    expect(nextEvents[0].date.format('ZZ')).to.equal('+1100');
    expect(nextEvents[1].getHours()).to.equal(10);
    expect(nextEvents[1].date.format('ZZ')).to.equal('+1000');

    timer.restore();
  });

  it('hours should change local time when given a DST timezone', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 02, 25, 0));

    const iterator = new Iterator({
      frequency: 4,
      byDay: [2],
      byHour: [10],
      byMinute: [30],
      count: 2,
    });

    const nextEvents = []
    for (const iteration of iterator) {
      nextEvents.push(iteration);
    }

    expect(nextEvents[0].date.tz('Australia/Sydney').hours()).to.equal(21);
    expect(nextEvents[0].date.format('ZZ')).to.equal('+1100');
    expect(nextEvents[1].date.tz('Australia/Sydney').hours()).to.equal(20);
    expect(nextEvents[1].date.format('ZZ')).to.equal('+1000');

    timer.restore();
  });

  it('must throw an error for an invalid rule passed in', () => {
    let err;
    try {
      new Iterator('chiasson');
    } catch (ex) {
      err = ex;
    }

    expect(err.message).to.equal('Invalid rule, no frequency property on rule.');
  });

  it('must throw an error for a rule with no frequency', () => {
    let err;
    try {
      new Iterator({ interval: 6 });
    } catch (ex) {
      err = ex;
    }

    expect(err.message).to.equal('Invalid rule, no frequency property on rule.');
  });

  it('must create a valid instance with a valid rule', () => {
    const iterator = new Iterator({ frequency: 1 });

    expect(iterator instanceof Iterator).to.equal(true);
  });

  it('must return a valid getNext date for a valid iterator with a start date', () => {
    const iterator = new Iterator({
      frequency: 3,
      byHour: [10],
      byMinute: [30],
      tzId: 'America/Los_Angeles',
    }, moment.tz('1988-02-10T00:00:00', 'America/Los_Angeles').toISOString());

    const nextRun = iterator.getNext(moment.tz('1988-02-10T00:00:00', 'America/Los_Angeles')
      .toISOString());

    expect(nextRun.getDate()).to.equal(10);
    expect(nextRun.getHours()).to.equal(10);
    expect(nextRun.getMinutes()).to.equal(30);
  });

  it('must return the next valid dates when the iterating over the instance', () => {
    const interval = 2;
    const count = 5;
    const iterator = new Iterator({
      interval,
      count,
      frequency: 3,
      byHour: [10],
      byMinute: [30],
      tzId: 'America/Los_Angeles',
    }, moment.tz('1988-02-10T00:00:00', 'America/Los_Angeles').toISOString());

    let initialDate = 10;
    for (const iteration of iterator) {
      expect(iteration.getDate()).to.equal(initialDate);
      initialDate += interval;
    }

    expect(initialDate).to.equal(10 + (interval * count));
  });
});
