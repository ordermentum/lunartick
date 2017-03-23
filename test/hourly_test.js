const sinon = require('sinon');
const { expect } = require('chai');

const Iterator = require('../src/iterator');

describe('Hourly RRule iterations', () => {
  it('Should return correctly for a valid request between hours', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 22));

    const iterator = new Iterator({
      frequency: 2,
      interval: 1,
      byMinute: [30],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(22);
    expect(next[0].getHours()).to.equal(22);
    expect(next[0].getMinutes()).to.equal(30);

    expect(next[1].getDate()).to.equal(22);
    expect(next[1].getHours()).to.equal(23);
    expect(next[1].getMinutes()).to.equal(30);

    expect(next[2].getDate()).to.equal(23);
    expect(next[2].getHours()).to.equal(0);
    expect(next[2].getMinutes()).to.equal(30);

    expect(next[3].getDate()).to.equal(23);
    expect(next[3].getHours()).to.equal(1);
    expect(next[3].getMinutes()).to.equal(30);

    expect(next[4].getDate()).to.equal(23);
    expect(next[4].getHours()).to.equal(2);
    expect(next[4].getMinutes()).to.equal(30);

    timer.restore();
  });

  it('Should return correctly for a valid request on the hour', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 21, 30));

    const iterator = new Iterator({
      frequency: 2,
      interval: 1,
      byMinute: [30],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(22);
    expect(next[0].getHours()).to.equal(22);
    expect(next[0].getMinutes()).to.equal(30);

    expect(next[1].getDate()).to.equal(22);
    expect(next[1].getHours()).to.equal(23);
    expect(next[1].getMinutes()).to.equal(30);

    expect(next[2].getDate()).to.equal(23);
    expect(next[2].getHours()).to.equal(0);
    expect(next[2].getMinutes()).to.equal(30);

    expect(next[3].getDate()).to.equal(23);
    expect(next[3].getHours()).to.equal(1);
    expect(next[3].getMinutes()).to.equal(30);

    expect(next[4].getDate()).to.equal(23);
    expect(next[4].getHours()).to.equal(2);
    expect(next[4].getMinutes()).to.equal(30);

    timer.restore();
  });
});
