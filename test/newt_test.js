const Newt = require('../src/newt');

describe.skip('new iterator', () => {
  describe('frequency 3', () => {
    it('foo', () => {
      const iterator = new Newt({
        frequency: 0,
        byMonth: [6, 7],
        byDay: [0, 1],
        byHour: [10],
        byMinute: [30],
        bySecond: [58, 59],
        count: 15,
      });

      console.log(Array.from(iterator).map(x => x.toISOString()));
    });
  });
});
