const sinon = require('sinon');
const { expect } = require('chai');

const Iterator = require('../src/iterator');

describe('Daily RRule iterations', () => {
  it('Should return correctly for iterations before the time that day', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 11));

    const iterator = new Iterator({
      frequency: 3,
      interval: 1,
      byHour: [12],
      byMinute: [0],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(22);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(1);
    expect(next[1].getDate()).to.equal(23);

    expect(next[2].getMonth()).to.equal(1);
    expect(next[2].getDate()).to.equal(24);

    expect(next[3].getMonth()).to.equal(1);
    expect(next[3].getDate()).to.equal(25);

    expect(next[4].getMonth()).to.equal(1);
    expect(next[4].getDate()).to.equal(26);

    timer.restore();
  });

  it('Should return correctly for iterations on the day of after the time', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 13));

    const iterator = new Iterator({
      frequency: 3,
      interval: 1,
      byHour: [12],
      byMinute: [0],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(23);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(1);
    expect(next[1].getDate()).to.equal(24);

    expect(next[2].getMonth()).to.equal(1);
    expect(next[2].getDate()).to.equal(25);

    expect(next[3].getMonth()).to.equal(1);
    expect(next[3].getDate()).to.equal(26);

    expect(next[4].getMonth()).to.equal(1);
    expect(next[4].getDate()).to.equal(27);

    timer.restore();
  });

  it('Should return correctly for iterations at the exact time', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 12));

    const iterator = new Iterator({
      frequency: 3,
      interval: 1,
      byHour: [12],
      byMinute: [0],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(23);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(1);
    expect(next[1].getDate()).to.equal(24);

    expect(next[2].getMonth()).to.equal(1);
    expect(next[2].getDate()).to.equal(25);

    expect(next[3].getMonth()).to.equal(1);
    expect(next[3].getDate()).to.equal(26);

    expect(next[4].getMonth()).to.equal(1);
    expect(next[4].getDate()).to.equal(27);

    timer.restore();
  });
});
