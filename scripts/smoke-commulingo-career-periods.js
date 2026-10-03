const assert = require('node:assert/strict');
const { parsePeriod } = require('../data/commulingo/people-standard');

// Career period labels → start/end year and month columns. A two-digit end
// after a plain year is the end year, not a month (1,196 rows stored
// "1953–58" as 1953-58 before 2026-10-03).
const cases = {
    '1917–18': [1917, null, 1918, null],
    '1952–84': [1952, null, 1984, null],
    '1921-24': [1921, null, 1924, null],
    '1918-11': [1918, 11, null, null],
    '1793-12': [1793, 12, null, null],
    '1918.07–09': [1918, 7, 1918, 9],
    '1991.1–8': [1991, 1, 1991, 8],
    '1918.09–1919.07': [1918, 9, 1919, 7],
    '1985–1991.1': [1985, null, 1991, 1],
    '1918–1934': [1918, null, 1934, null],
    '1920': [1920, null, null, null],
    '1953.3–55': [1953, 3, 1955, null],
    '1939–49, 1953–56': [1939, null, 1949, null],
};
for (const [label, expected] of Object.entries(cases)) {
    const { start, end } = parsePeriod(label);
    assert.deepEqual([start && start.year, start && start.month, end && end.year, end && end.month], expected, label);
}
assert.deepEqual(parsePeriod('1937/1957').start, null);
console.log('career periods ok');
