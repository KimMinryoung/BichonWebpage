const assert = require('node:assert/strict');
const { periodColumns, periodFromRow, formatPeriod, PERIOD_COLUMNS, periodValues } = require('../data/commulingo/career-period');

// Career/office periods are columns; the label is formatted, never parsed.
const shown = [
    [{ start: [1917], end: [1918] }, '1917–1918', '1917–1918'],
    [{ start: [1918, 7], end: [1918, 9] }, '1918.07–09', '1918.07–09'],
    [{ start: [1918, 9], end: [1919, 7] }, '1918.09–1919.07', '1918.09–1919.07'],
    [{ start: [1965, 3, 18], end: [1965, 3, 19] }, '1965.03.18–19', '1965.03.18–19'],
    [{ start: [1938, 10, 25] }, '1938.10.25', '1938.10.25'],
    [{ start: [1920], startQual: 'decade', end: [1930], endQual: 'decade' }, '1920년대–1930년대', '1920s–1930s'],
    [{ start: [1920], startQual: 'late' }, '1920년대 후반', 'late 1920s'],
    [{ start: [1990], startQual: 'circa', end: [1991] }, '1990년경–1991', 'c. 1990–1991'],
    [{ start: [1989], startQual: 'after' }, '1989 이후', 'after 1989'],
    [{ end: [1968], endQual: 'until' }, '–1968', '–1968'],
    [{ start: [2017], ongoing: true }, '2017–현재', '2017–present'],
    [{ ongoing: true }, '현재', 'present'],
    [{ start: [1945], endQual: 'open' }, '1945–', '1945–'],
    [{ start: [1979], endQual: 'unknown' }, '1979–?', '1979–?'],
    [{ start: [1956], startQual: 'summer' }, '1956 여름', 'summer 1956'],
    [{ start: [1963], label: { ko: '1963 또는 1964', en: '1963 or 1964' } }, '1963 또는 1964', '1963 or 1964'],
];
for (const [input, ko, en] of shown) {
    assert.equal(formatPeriod(input, 'ko'), ko);
    assert.equal(formatPeriod(input, 'en'), en);
    // Columns → row → input round trip is lossless.
    const vals = periodValues(periodColumns(input));
    const row = Object.fromEntries(PERIOD_COLUMNS.map((c, i) => [c, vals[i]]));
    assert.equal(formatPeriod(periodFromRow(row), 'ko'), ko);
}
for (const bad of ['1917–1918', null, {}, { start: 1917 }, { start: [1917, 13] }, { start: [1917, 2, 30] },
    { start: [1917, null, 3] }, { start: [1920], end: [1910] }, { start: [1923], startQual: 'decade' },
    { start: [1917], startQual: 'until' }, { start: [1917], end: [1918], endQual: 'open' }, { start: [1917], ongoing: true, end: [1918] },
    { start: [1917], label: { ko: '1917' } }, { start: [1917], extra: 1 }]) {
    assert.throws(() => periodColumns(bad), { status: 400 }, JSON.stringify(bad));
}
console.log('structured periods format both languages and reject strings, bad dates and contradictions');
