const sinon = require('sinon');
const { expect } = require('chai');

const Iterator = require('../src/iterator');

describe('Monthly RRule iterations', () => {
  it('Should return correctly for a given month day on the day', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 20, 11));

    const iterator = new Iterator({
      frequency: 5,
      byMonthDay: [20],
      byHour: [12],
      byMinute: [0],
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(20);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(2);
    expect(next[1].getDate()).to.equal(20);

    expect(next[2].getMonth()).to.equal(3);
    expect(next[2].getDate()).to.equal(20);

    expect(next[3].getMonth()).to.equal(4);
    expect(next[3].getDate()).to.equal(20);

    expect(next[4].getMonth()).to.equal(5);
    expect(next[4].getDate()).to.equal(20);

    timer.restore();
  });

  it('Should return correctly for a given month day', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 20, 11));

    const iterator = new Iterator({
      frequency: 5,
      byMonthDay: [15],
      byHour: [12],
      byMinute: [0],
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(2);
    expect(next[0].getDate()).to.equal(15);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(3);
    expect(next[1].getDate()).to.equal(15);

    expect(next[2].getMonth()).to.equal(4);
    expect(next[2].getDate()).to.equal(15);

    expect(next[3].getMonth()).to.equal(5);
    expect(next[3].getDate()).to.equal(15);

    expect(next[4].getMonth()).to.equal(6);
    expect(next[4].getDate()).to.equal(15);

    timer.restore();
  });

  it('Should return correctly for the last day of the month', () => {
    // TZ=America/Chicago yarn test
    // TZ=Australia/Sydney yarn test
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 20, 11));

    const iterator = new Iterator({
      frequency: 5,
      byMonthDay: [-1],
      byHour: [12],
      byMinute: [0],
    }, new Date(), 5);

    const next = [];
    for (const date of iterator) { // eslint-disable-line
      next.push(date);
    }

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(28);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(2);
    expect(next[1].getDate()).to.equal(31);

    expect(next[2].getMonth()).to.equal(3);
    expect(next[2].getDate()).to.equal(30);

    expect(next[3].getMonth()).to.equal(4);
    expect(next[3].getDate()).to.equal(31);

    expect(next[4].getMonth()).to.equal(5);
    expect(next[4].getDate()).to.equal(30);

    timer.restore();
  });
});
