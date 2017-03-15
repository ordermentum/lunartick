const { expect } = require('chai');

const Parse = require('../src/parse');
const fixtures = require('./fixtures.json');

describe('Parse rules', () => {
  const keys = Object.keys(fixtures);
  keys.forEach((key) => {
    it(`Parsing ${key} matches expected object`, () => {
      const parsed = new Parse(key).parse();

      expect(parsed).to.deep.equal(fixtures[key]);
    });
  });
});
