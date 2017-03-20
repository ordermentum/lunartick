# Lunartick
[![npm version](https://badge.fury.io/js/lunartick.svg)](https://badge.fury.io/js/lunartick)
[![Build Status](https://travis-ci.org/ordermentum/lunartick.svg?branch=master)](https://travis-ci.org/ordermentum/lunartick)
[![npm](https://img.shields.io/npm/l/lunartick.svg)]()
[![npm](https://img.shields.io/npm/dt/lunartick.svg)]()

### Description

Based on the [RFC5545](https://tools.ietf.org/html/rfc5545) spec for Internet Calendaring and Scheduling Core Object Specification.

Lunartick!! ... get it!?

It's a pun on lunar and a crazy person, because that's what I feel like after working on this. It's a joke.

Anyway...

Lunartick allows you to parse an RRULE string to return an object of the properties in JS format. The returned object has an iterator() to either get the next run time based on a start time passed in (.getNext())or over the next `X` instances based on the RRULE COUNT or defaults to 1000 if no COUNT is present. If no start date is given, it will fetch the next run time based on the current time.

Originally developed by [Michael Cooper](https://www.github.com/scoutski) - Development sponsored by [Ordermentum](https://www.github.com/ordermentum).

### Usage

NPM users

```js
npm i lunartick
```

Yarn users

```js
yarn add lunartick
```

Import the library and pass in an RRULE string to the `.parse()` method. The resulting instance supports the following properties:
`frequency, interval, count, bySetPos, byYearDay, byMonth, byMonthDay, byWeekNo, byEaster, byDay, byHour,  byMinute, bySecond, tzId and dtStart.`

```js
const Rule = require('lunartick');
const rruleString = 'FREQ=DAILY;INTERVAL=1;BYHOUR=14;BYMINUTE=3;BYSECOND=0;DTSTART=19701101T020000';
const rule = Rule.parse(rruleString);
 /*{
   frequency: 2,
   interval: 1,
   byHour: [14],
   byMinute: [3],
   bySecond: [0],
   dtStart: '19701101T020000'
}*/
```

Once a string has been parsed, it can be converted back to an RRULE string using the `.toString()` method. This method does not take any parameters.

```js
const string = rule.toString();
// 'FREQ=DAILY;INTERVAL=1;BYHOUR=14;BYMINUTE=3;BYSECOND=0;DTSTART=19701101T020000'
```

To fetch the next run time for this schedule call the `.getNext()` method with an optional from date, you can pass in the `.dtStart` property if you want to use it. If no from date is passed in, it will fetch the next run time base on the current time.

```js
const nextRun = rule.getNext(rule.dtStart);
// Sun Nov 01 1970 14:03:00 GMT+1000
```

The rule instance will also have an iterator to fetch the next `X` runtimes for the rule. You can use a `for-of` loop on rule.iterator() which takes two optional parameters. The first one is the from date (default is also the current time). The second parameter is how many iterations should be fetched. If a number is passed in, it will take precedence, if a `.count` property exists in the rule, it will be used next and if neither are available it will default to 52 iterations.

```js
for (const nextDate of rule.iterator(rule.dtStart, 5)) {
  console.log(nextDate.toString());
}
/*
  Sun Nov 01 1970 14:03:00 GMT+1000
  Mon Nov 02 1970 14:03:00 GMT+1000
  Tue Nov 03 1970 14:03:00 GMT+1000
  Wed Nov 04 1970 14:03:00 GMT+1000
  Thu Nov 05 1970 14:03:00 GMT+1000
*/
```

### Limitations

- Currently does not support multiple values for byDay, byHour, byMinute and bySecond.

### Licensing

Lunartick is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.
