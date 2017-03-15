class Rule {
  constuctor(args) {
    this._args = args;
    this._errors = [];

    return this._parse();
  }

  get frequencies() {
    return ['DAILY', 'WEEKLY', 'FORTNIGHTLY', 'MONTHLY'];
  }

  static parse(string) {
    return new Rule(Parser.parse(string));
  }

  _validateFreq() {
    if (!this._args.freq) {
      this.errors.push('No { freq } argument provided.');
    }

    if (this._frequencies.indexOf(this._args.freq.toUpperCase()) === -1) {
      this.errors.push('Invalid { freq } argument provided.');
    }
  }

  _getFreq() {
    this._validateFreq();

    return `FREQ=${this._args.freq.toUpperCase()}`;
  }

  _parse() {
    const freq = getFreq();
  }
}

// args:
// [freq, dtstart, interval, wkst, count, until,
// bysetpos, bymonth, bymonthday, byyearday, byeaster,
// byweekno, byweekday, byhour, byminute, bysecond, cache.
// timezone]