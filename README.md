# Lunartick

### Description

Based on the [RFC5545](https://tools.ietf.org/html/rfc5545) spec for Internet Calendaring and Scheduling Core Object Specification.

Lunartick!! ... get it!?

It's a pun on lunar and a crazy person, because that's what I feel like after working on this. It's a joke.

Anyway...

You can parse an RRULE string to return an object of the properties in JS format as per the usage. This object can then be passed into the `Iterator` class to iterate based on a given start date (or the current date if none is provided).

Copyright Michael Cooper. Released under the Apache 2 license
Development sponsored by [Ordermentum](https://www.github.com/ordermentum)

### Usage

```js
const { Rule } = require('lunartick');

const rruleString = 'FREQ=DAILY;INTERVAL=1;BYHOUR=14;BYMINUTE=3;BYSECOND=0';
const rule = Rule.parse(rruleString);
for (const date of rule.iterator()) {
  console.log(date);
}


console.log(rule.rule);
/*{
  frequency: 2,
  interval: 1,
  byHour: [14],
  byMinute: [3],
  bySecond: [0]
}*/
```