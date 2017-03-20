const WEEK_DAYS = {
  MO: 0,
  TU: 1,
  WE: 2,
  TH: 3,
  FR: 4,
  SA: 5,
  SU: 6,
};

const STRING_WEEK_DAYS = {
  0: 'MO',
  1: 'TU',
  2: 'WE',
  3: 'TH',
  4: 'FR',
  5: 'SA',
  6: 'SU',
};

const FREQUENCIES = {
  SECONDLY: 0,
  MINUTELY: 1,
  HOURLY: 2,
  DAILY: 3,
  WEEKLY: 4,
  MONTHLY: 5,
  YEARLY: 6,
};

const STRING_FREQUENCIES = {
  0: 'SECONDLY',
  1: 'MINUTELY',
  2: 'HOURLY',
  3: 'DAILY',
  4: 'WEEKLY',
  5: 'MONTHLY',
  6: 'YEARLY',
};

const ADD_FREQUENCY = {
  0: 'addSecond',
  1: 'addMinute',
  2: 'addHour',
  3: 'addDay',
  4: 'addWeek',
  5: 'addMonth',
  6: 'addYear',
};

const LEGACY = {
  dayOfWeek: 'byDay',
  startdate: 'dtStart',
  byhour: 'byHour',
  byminute: 'byMinute',
  bysecond: 'bySecond',
};

const STRINGS = {
  frequency: 'FREQ',
  interval: 'INTERVAL',
  count: 'COUNT',
  bySetPos: 'BYSETPOS',
  byYearDay: 'BYYEARDAY',
  byMonth: 'BYMONTH',
  byMonthDay: 'BYMONTHDAY',
  byEaster: 'BYEASTER',
  byDay: 'BYDAY',
  byHour: 'BYHOUR',
  byMinute: 'BYMINUTE',
  bySecond: 'BYSECOND',
  tzId: 'TZID',
  dtStart: 'DTSTART',
};

module.exports = {
  FREQUENCIES,
  STRING_FREQUENCIES,
  WEEK_DAYS,
  STRING_WEEK_DAYS,
  LEGACY,
  ADD_FREQUENCY,
  STRINGS,
};
