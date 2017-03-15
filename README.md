# Powerglide (Copyright pending)

### Usage

```js
const { Parse } = require('powerglide');

const rruleString = 'FREQ=DAILY;INTERVAL=1;BYHOUR=14;BYMINUTE=3;BYSECOND=0';
const parsed = new Parse(rruleString).parse();

console.log(parsed);

/*{
  frequency: 2,
  interval: 1,
  byHour: [14],
  byMinute: [3],
  bySecond: [0]
}*/
```