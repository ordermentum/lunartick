const Parse = require('./parse');
const Iterator = require('./iterator');
const constants = require('./constants');

class Rule {
  constructor(rule = {}) {
    this.rule = rule;
  }

  static parse(string) {
    return new Rule(new Parse(string).parse());
  }

  static legacyParse(recurrence) {
    const result = {};

    Object.keys(recurrence).forEach((key) => {
      if (key === 'freq') {
        result.frequency = constants.FREQUENCIES[recurrence.freq.toUpperCase()];
      } else if (constants.LEGACY[key] && recurrence[key] !== null) {
        result[constants.LEGACY[key]] = recurrence[key];
      } else if (recurrence[key] !== null) {
        result[key] = recurrence[key];
      }
    });

    return new Rule(result);
  }

  iterator(start = null) {
    return new Iterator(this.rule, start);
  }
}

module.exports = Rule;
