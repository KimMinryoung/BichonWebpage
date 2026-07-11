#!/usr/bin/env node
const data = require('../data/commulingo/people');
const { normalizeCommuLingoPeople, validateCommuLingoPeople } = require('../data/commulingo/people-standard');

const issues = validateCommuLingoPeople(data);
const normalized = normalizeCommuLingoPeople(data, { lang: 'ko' });
const errors = issues.filter(issue => issue.level === 'error');

console.log(JSON.stringify({
    schemaVersion: normalized.schemaVersion,
    people: normalized.people.length,
    offices: normalized.offices.length,
    officeRows: normalized.offices.reduce((sum, office) => sum + office.rows.length, 0),
    issues,
}, null, 2));

if (errors.length) process.exit(1);
