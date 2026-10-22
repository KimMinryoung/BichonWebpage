#!/usr/bin/env node
// A person's related events are listed by date, not by the dictionary's
// editorial sort_order (Himmler's page put 1918 before 1897 and 1944.08
// before 1944.03).
const assert = require('node:assert/strict');
const { sortEventsByDate } = require('../data/commulingo/history-events-store');

const ids = events => sortEventsByDate(events).map(e => e.id);
assert.deepEqual(ids([
    { id: 'warsaw', startDate: [1944, 8, 1], endDate: [1944, 10, 2] },
    { id: 'revolution', startDate: [1918, 10, 0], endDate: [1919, 8, 0] },
    { id: 'hungary', startDate: [1944, 3, 19], endDate: [1945, 2, 13] },
    { id: 'reform', startDate: [1897, 5, 15], endDate: [1935, 9, 1] },
    { id: 'undated', startDate: null, endDate: null },
    { id: 'war-short', startDate: [1941, 0, 0], endDate: [1945, 0, 0] },
    { id: 'war-long', startDate: [1941, 0, 0], endDate: [1946, 0, 0] },
]), ['reform', 'revolution', 'war-short', 'war-long', 'hungary', 'warsaw', 'undated']);
// Snapshots from before startDate fall back to the year; ties keep input order.
assert.deepEqual(ids([
    { id: 'b', startYear: 1930, endYear: 1934 },
    { id: 'a', startYear: 1897, endYear: 1935 },
    { id: 'c', startYear: 1930, endYear: 1934 },
]), ['a', 'b', 'c']);
console.log('person event order: by start date, then end, undated last, stable ties OK');
