# Lunartick
[![npm version](https://badge.fury.io/js/lunartick.svg)](https://badge.fury.io/js/lunartick)

### Description

Based on the [RFC5545](https://tools.ietf.org/html/rfc5545) spec for Internet Calendaring and Scheduling Core Object Specification.

Lunartick!! ... get it!?

It's a pun on lunar and a crazy person, because that's what I feel like after working on this. It's a joke.

Anyway...

Lunartick allows you to parse an RRULE string to return an object of the properties in JS format. The returned object has an iterator() to either get the next run time based on a start time passed in (.getNext())or over the next `X` instances based on the RRULE COUNT or defaults to 1000 if no COUNT is present. If no start date is given, it will fetch the next run time based on the current time.

Originally developed by [Michael Cooper](https://www.github.com/scoutski) - Development sponsored by [Ordermentum](https://www.github.com/ordermentum).

### Usage

```js
const { Rule } = require('lunartick');

const rruleString = 'FREQ=DAILY;INTERVAL=1;COUNT=5;BYHOUR=14;BYMINUTE=3;BYSECOND=0;DTSTART=19701101T020000';
const rule = Rule.parse(rruleString);

for (const nextDate of rule.iterator(rule.getRule().dtStart)) {
  console.log(nextDate.toString());
}
/*
  Sun Nov 01 1970 14:03:00 GMT+1000
  Mon Nov 02 1970 14:03:00 GMT+1000
  Tue Nov 03 1970 14:03:00 GMT+1000
  Wed Nov 04 1970 14:03:00 GMT+1000
  Thu Nov 05 1970 14:03:00 GMT+1000
*/

console.log(rule.getRule());
/*{
  frequency: 2,
  interval: 1,
  byHour: [14],
  byMinute: [3],
  bySecond: [0]
}*/
```

### Licensing

Lunartick is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.
