#!/usr/bin/env node
// Every CommuLingo value that exists in BOTH the code and the database, checked
// against each other.
//
//   docker exec leninbot-frontend node /app/scripts/check-commulingo-code-db-drift.js
//
// The registries that used to be arrays are tables now: role categories, term
// categories, the link blocklist, retired-id redirects. What remains in code is
// one of two things, and neither is a place to edit content:
//
//   * a FALLBACK the DB overrides at runtime (office titles and icons) — used
//     only when the database is unreachable, so a rename here changes nothing
//     while the site is healthy and silently disagrees when it is not;
//   * a SEED that only runs on a fresh database (the role-category list in
//     seed-commulingo-person-roles.js).
//
// Both look authoritative to whoever opens the file next. This script is the
// tripwire: it fails when a copy stops matching the table it shadows, which is
// exactly the moment someone edited the wrong one.
//
// It does NOT check display order, where the code deliberately differs:
// OFFICE_DISPLAY_ORDER groups roles on the person list by institutional weight,
// commulingo_offices.sort_order orders the office index chronologically.

const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { ROLE_OFFICE_TITLES, OFFICE_DISPLAY_ORDER, OFFICE_ICON } = require('../data/commulingo/people-standard');
const { flagLabel } = require('../data/commulingo/flag-icons');

const problems = [];
const checks = [];

function report(name, detail) {
    problems.push(`${name}: ${detail}`);
}

async function checkOfficeTitlesAndIcons() {
    const { rows } = await db.query('SELECT id, title_ko, title_en, icon, sort_order FROM commulingo_offices');
    checks.push(`offices: ${rows.length}`);
    rows.forEach(office => {
        const title = ROLE_OFFICE_TITLES[office.id];
        if (!title) {
            return report('ROLE_OFFICE_TITLES', `${office.id} is in the DB but has no fallback title in people-standard.js`);
        }
        if (title.ko !== office.title_ko) {
            report('ROLE_OFFICE_TITLES', `${office.id} ko — DB "${office.title_ko}" vs code "${title.ko}"`);
        }
        if (title.en !== office.title_en) {
            report('ROLE_OFFICE_TITLES', `${office.id} en — DB "${office.title_en}" vs code "${title.en}"`);
        }
        if (office.icon && OFFICE_ICON[office.id] && OFFICE_ICON[office.id] !== office.icon) {
            report('OFFICE_ICON', `${office.id} — DB "${office.icon}" vs code "${OFFICE_ICON[office.id]}"`);
        }
    });
    const dbIds = new Set(rows.map(office => office.id));
    Object.keys(ROLE_OFFICE_TITLES).forEach(id => {
        if (!dbIds.has(id)) report('ROLE_OFFICE_TITLES', `${id} is in the code but not in commulingo_offices`);
    });
    OFFICE_DISPLAY_ORDER.forEach(id => {
        if (!dbIds.has(id)) report('OFFICE_DISPLAY_ORDER', `${id} is ordered but does not exist`);
    });
    dbIds.forEach(id => {
        if (!OFFICE_DISPLAY_ORDER.includes(id)) {
            report('OFFICE_DISPLAY_ORDER', `${id} exists but is unordered — it sorts last on the person list`);
        }
    });
}

async function checkRoleCategorySeed() {
    const seedPath = path.join(__dirname, 'seed-commulingo-person-roles.js');
    const src = fs.readFileSync(seedPath, 'utf8');
    const block = src.split('const roleCategories = [')[1].split('];')[0];
    const seeded = [...block.matchAll(/\['([a-z-]+)',\s*\d+,\s*'[^']*',\s*'([^']*)',\s*'([^']*)'\]/g)]
        .map(m => ({ id: m[1], ko: m[2], en: m[3] }));
    const { rows } = await db.query('SELECT id, label_ko, label_en FROM commulingo_role_categories');
    checks.push(`role categories: ${rows.length} in DB, ${seeded.length} seeded`);
    const byId = {};
    rows.forEach(row => { byId[row.id] = row; });
    seeded.forEach(entry => {
        const row = byId[entry.id];
        if (!row) {
            return report('seed-commulingo-person-roles.js',
                `${entry.id} would be re-created by a re-seed but is not in commulingo_role_categories (retired?)`);
        }
        if (row.label_ko !== entry.ko || row.label_en !== entry.en) {
            report('seed-commulingo-person-roles.js',
                `${entry.id} — DB "${row.label_ko}/${row.label_en}" vs seed "${entry.ko}/${entry.en}"`);
        }
    });
}

async function checkFlags() {
    const flagDir = path.join(__dirname, '..', 'public', 'flags');
    const files = fs.readdirSync(flagDir).filter(name => name.endsWith('.svg')).map(name => name.replace(/\.svg$/, ''));
    checks.push(`flags: ${files.length} svg files`);
    files.forEach(code => {
        if (!flagLabel(code, 'ko')) report('flag-icons.js', `public/flags/${code}.svg exists but ${code} is not in FLAG_NAMES — the flag never renders`);
    });
    const { rows } = await db.query(
        `SELECT DISTINCT code FROM (
             SELECT citizenship_code AS code FROM commulingo_people WHERE citizenship_code <> ''
             UNION SELECT origin_code FROM commulingo_people WHERE origin_code <> ''
         ) used`
    );
    rows.forEach(row => {
        if (!flagLabel(row.code, 'ko')) {
            report('flag-icons.js', `people carry nationality "${row.code}" but it has no flag — the card shows none`);
        }
    });
    checks.push(`nationality codes in use: ${rows.length}`);
}

(async () => {
    try {
        await checkOfficeTitlesAndIcons();
        await checkRoleCategorySeed();
        await checkFlags();
    } catch (err) {
        console.error('drift check failed to run:', err.message);
        process.exit(2);
    }
    checks.forEach(line => console.log(`  ${line}`));
    if (!problems.length) {
        console.log('OK — every code copy still matches the table it shadows.');
        process.exit(0);
    }
    console.error('\nDRIFT — a code copy disagrees with the database:');
    problems.forEach(line => console.error(`  - ${line}`));
    console.error('\nThe database is the source of truth for all of these. Fix the row,');
    console.error('then bring the fallback/seed back in line — never the other way round.');
    process.exit(1);
})();
