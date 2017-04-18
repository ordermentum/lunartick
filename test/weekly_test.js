const sinon = require('sinon');
const { expect } = require('chai');

const Iterator = require('../src/iterator');

describe('Weekly RRule iterations', () => {
  it('Should return correctly for iterations on the day of before the time', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 11));

    const iterator = new Iterator({
      frequency: 4,
      interval: 1,
      byDay: [2],
      byHour: [12],
      byMinute: [0],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(22);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(2);
    expect(next[1].getDate()).to.equal(1);

    expect(next[2].getMonth()).to.equal(2);
    expect(next[2].getDate()).to.equal(8);

    expect(next[3].getMonth()).to.equal(2);
    expect(next[3].getDate()).to.equal(15);

    expect(next[4].getMonth()).to.equal(2);
    expect(next[4].getDate()).to.equal(22);

    timer.restore();
  });

  it('Should return correctly for iterations on the day of after the time', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 22, 11));

    const iterator = new Iterator({
      frequency: 4,
      interval: 1,
      byDay: [2],
      byHour: [10],
      byMinute: [0],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(2);
    expect(next[0].getDate()).to.equal(1);
    expect(next[0].getHours()).to.equal(10);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(2);
    expect(next[1].getDate()).to.equal(8);

    expect(next[2].getMonth()).to.equal(2);
    expect(next[2].getDate()).to.equal(15);

    expect(next[3].getMonth()).to.equal(2);
    expect(next[3].getDate()).to.equal(22);

    expect(next[4].getMonth()).to.equal(2);
    expect(next[4].getDate()).to.equal(29);

    timer.restore();
  });

  it('Should return correctly for iterations before the day of', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 7, 11));

    const iterator = new Iterator({
      frequency: 4,
      interval: 1,
      byDay: [3],
      byHour: [12],
      byMinute: [0],
      timezone: 'UTC',
    }, new Date(), 5);

    const next = Array.from(iterator);

    expect(next[0].getMonth()).to.equal(1);
    expect(next[0].getDate()).to.equal(9);
    expect(next[0].getHours()).to.equal(12);
    expect(next[0].getMinutes()).to.equal(0);

    expect(next[1].getMonth()).to.equal(1);
    expect(next[1].getDate()).to.equal(16);

    expect(next[2].getMonth()).to.equal(1);
    expect(next[2].getDate()).to.equal(23);

    expect(next[3].getMonth()).to.equal(2);
    expect(next[3].getDate()).to.equal(2);

    expect(next[4].getMonth()).to.equal(2);
    expect(next[4].getDate()).to.equal(9);

    timer.restore();
  });

  it('Should return correctly for iterations after the day of', () => {
    const timer = sinon.useFakeTimers(Date.UTC(2017, 1, 20, 11));

    const iterator = new Iterator({
      frequency: 5,
      byMonthDay: [-1],
      byHour: [12],
      byMinute: [0],
    }, new Date(), 5);

    const next = Array.from(iterator);

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
