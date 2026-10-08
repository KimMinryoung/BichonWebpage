#!/usr/bin/env node
// Data-only SQL belongs in scripts/migrations/data/ (gitignored, archived to R2
// by scripts/archive-work-r2.js); scripts/migrations/ keeps schema changes only.
// Files numbered at or below LEGACY_MAX predate this check and are left as is.
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'migrations');
const LEGACY_MAX = 338;
const DDL = /^\s*(create|alter|drop|comment\s+on|grant|revoke)\b/im;

const strip = sql => sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
const bad = fs.readdirSync(DIR)
    .filter(f => /^\d+_.*\.sql$/.test(f) && parseInt(f, 10) > LEGACY_MAX)
    .filter(f => !DDL.test(strip(fs.readFileSync(path.join(DIR, f), 'utf8'))));
if (bad.length) {
    console.error(`data-only migration(s) outside scripts/migrations/data/: ${bad.join(', ')}`);
    console.error('move them to scripts/migrations/data/ (archived to R2, not git)');
    process.exit(1);
}
console.log('migration kinds ok');
