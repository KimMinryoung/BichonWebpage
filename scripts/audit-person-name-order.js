#!/usr/bin/env node
// Audit the CommuLingo people dictionary for display names that disagree with
// the name-order standard (FAMILY_FIRST in data/commulingo/native-script.js).
//
// The public page never prints name_ko/name_en: people-standard.js recomposes
// the display name from given/family parts under the citizenship's rule. So a
// stored name that was typed in the other order (name_ko '카다르 야노시', page
// '야노시 카다르') is invisible in admin and wrong for readers, and a nation
// missing from FAMILY_FIRST flips every one of its people at once. This is what
// happened to the 28 Hungarians on 2026-09-01.
//
// Checks, per person:
//   1. name_ko / name_en equal composeFromParts(given, family) whenever the row
//      carries parts (the patronymic is inserted at render time, so the stored
//      string never holds it; rows with no parts at all are counted, not
//      failed — the legacy full name is what the page shows for them).
//   2. No row is given-only: a single token, a mononym or a fused East Asian
//      name lives in family, never given (허가이, 히로히토).
//   3. The native-name line (`cyrillic`) matches the family-first shape:
//      Latin-script family-first nations (hungary, vietnam) lead with the family
//      name — 'Király Béla', not 'Béla Király'; CJK-script names carry no
//      internal space — '近衞文麿', not '近衞 文麿'.
//
// Usage (inside the frontend container):
//   node scripts/audit-person-name-order.js
// Exits 1 when problems remain, so it can gate a deploy.

require('dotenv').config();
const db = require('../config/database');
const { familyFirstJoiner, scriptsFor, detectScripts } = require('../data/commulingo/native-script');
const { composeFromParts } = require('../data/commulingo/people-standard');

const CJK = new Set(['han', 'kana', 'hangul']);

function foldLatin(text) {
    return String(text || '')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[ĐđŁłØø]/g, ch => ({ Đ: 'D', đ: 'd', Ł: 'L', ł: 'l', Ø: 'O', ø: 'o' }[ch]))
        .toLowerCase();
}

function firstToken(text) {
    return String(text || '').trim().split(/\s+/)[0] || '';
}

(async () => {
    try {
        const { rows } = await db.query(
            `SELECT p.id, p.name_ko, p.name_en, p.cyrillic,
                    p.given_name_ko, p.given_name_en, p.family_name_ko, p.family_name_en,
                    p.citizenship_code, p.origin_code
             FROM commulingo_people p
             ORDER BY p.id`
        );

        const problems = [];
        let withoutParts = 0;
        for (const row of rows) {
            const code = row.citizenship_code || '';
            const tag = `${row.id} (${row.name_en || row.name_ko}, '${code}')`;
            let anyParts = false;
            for (const lang of ['ko', 'en']) {
                const given = (row[`given_name_${lang}`] || '').trim();
                const family = (row[`family_name_${lang}`] || '').trim();
                const stored = (row[`name_${lang}`] || '').trim();
                if (!given && !family) continue;
                anyParts = true;
                // The stored name never carries the patronymic (it is inserted
                // at render time from commulingo_person_patronymics), so the
                // comparison composes given + family only.
                // A trailing "(qualifier)" — "(spy)", "(Oppokov)" — is a
                // disambiguator the parts never hold, so it is ignored here.
                const composed = composeFromParts(given, '', family, lang, code);
                if (composed !== stored.replace(/\s*\([^)]*\)\s*$/, '')) {
                    problems.push(`${tag}: name_${lang} "${stored}" but parts compose to "${composed}"`
                        + ` (given "${given}", family "${family}")`);
                }
                // A lone token is a family name (or a mononym / fused East
                // Asian name) by convention — splitFullName in the admin store
                // files it there, and people-linkify offers the family part as
                // the bare alias. A given-only row (허가이, 히로히토) is the
                // shape a curator reaches for when the order rule does not fit.
                if (given && !family) {
                    problems.push(`${tag}: given_name_${lang} "${given}" with no family_name_${lang}`
                        + ' — a single token, mononym or fused name goes in family, not given');
                }
            }
            if (!anyParts) withoutParts += 1;

            // 3. Native-name line shape.
            const native = (row.cyrillic || '').trim();
            if (!native) continue; // audit-person-native-names.js reports the blank.
            const found = detectScripts(native);
            const familyFirstAtHome = familyFirstJoiner(code, 'ko') !== null;
            if (found.length && found.every(script => CJK.has(script)) && /\s/.test(native)) {
                problems.push(`${tag}: native name "${native}" has an internal space; CJK names are written solid`);
            }
            const allowed = scriptsFor(code) || [];
            if (familyFirstAtHome && allowed.includes('latin') && found.includes('latin')) {
                const familyEn = firstToken(row.family_name_en);
                if (familyEn && foldLatin(firstToken(native)) !== foldLatin(familyEn)) {
                    problems.push(`${tag}: native name "${native}" should lead with the family name`
                        + ` (family_name_en "${row.family_name_en}") — Hungarian and Vietnamese write family first`);
                }
            }
        }

        if (!problems.length) {
            console.log(`OK — ${rows.length} people checked, stored names match their parts under the name-order`
                + ` standard (${withoutParts} legacy row(s) carry no parts).`);
            process.exit(0);
        }
        console.log(`${problems.length} name-order problem(s):\n`);
        for (const line of problems) console.log(`  ${line}`);
        console.log('\nFix the parts (or the citizenship code), then set name_ko/name_en to what the parts'
            + ' compose to — the public page renders the composition, never the stored string.');
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
