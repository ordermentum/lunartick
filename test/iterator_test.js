const moment = require('moment-timezone');
const { expect } = require('chai');
const sinon = require('sinon');

const Iterator = require('../src/iterator');

describe('Iterator', () => {
  it.skip('freezes time', () => {
    // TZ=America/Chicago yarn test
    // TZ=Australia/Sydney yarn test
    const timer = sinon.useFakeTimers(new Date(2016, 3, 12, 11).getTime());
    const iterator = new Iterator({
      frequency: 3,
      byHour: [10],
      byDay: [12],
      byMinute: [30],
      tzId: 'America/Chicago',
    });

    const next = iterator.getNext(new Date());

    expect(next.toISOString()).to.equal('2016-04-13T00:30:00.000Z');
    expect(next.getDate()).to.equal(13);
    expect(next.getHours()).to.equal(10);
    expect(next.getMinutes()).to.equal(30);

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
