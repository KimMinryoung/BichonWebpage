#!/usr/bin/env node
// Audit the CommuLingo people dictionary for display names that disagree with
// the name-order standard (FAMILY_FIRST in data/commulingo/native-script.js).
//
// The full name is never stored (migration 361): data/commulingo/person-name.js
// composes it from given/family parts under the citizenship's rule, so parts
// filed in the wrong slot, or a nation missing from FAMILY_FIRST, show up
// wrong for every reader at once. This is what happened to the 28 Hungarians
// on 2026-09-01 (then as a stored name typed in the other order).
//
// Checks, per person:
//   1. Every row carries name parts (the table's CHECK also requires a family
//      name, so this only reports drift from a hand-written statement).
//   2. No row is given-only: a single token or a mononym lives in family,
//      never given (히로히토). A Korean/Chinese/Vietnamese name the Korean text
//      fuses is still split (마오 + 쩌둥, like Mao + Zedong): both languages
//      agree on whether there is a given part, and a Korean name always has
//      one (허 + 가이). Only a mononym or pen name stays whole (푸이, 또흐우).
//   3. The native-name line (`cyrillic`) matches the family-first shape:
//      Latin-script family-first nations (hungary, vietnam) lead with the family
//      name — 'Király Béla', not 'Béla Király'; CJK-script names carry no
//      internal space — '近衞文麿', not '近衞 文麿'.
//   4. No-surname nations (Mongolia, Ethiopia, Eritrea, Somalia) carry no
//      given part (수흐바타르, not 수흐바타르 수흐바타르; 아트나푸 아바테 whole);
//      monarchs keep the regnal shape (하일레 셀라시에 + 1세).
//   5. No patronymic on a family-first or no-surname name (호른 줄러 with János
//      rendered 줄러 야노시 호른), nor on a row with no given name.
//   6. Cards that share a stored name each carry a distinct name_qualifier
//      (migration 360), the only thing that tells them apart in lists.
//
// Usage (inside the frontend container):
//   node scripts/audit-person-name-order.js
// Exits 1 when problems remain, so it can gate a deploy.

require('dotenv').config();
const db = require('../config/database');
const { familyFirstJoiner, isSingleNameNation, isRegnalNumber, scriptsFor, detectScripts } = require('../data/commulingo/native-script');
const { personName } = require('../data/commulingo/person-name');
const { familyFirstPartsProblem } = require('../data/commulingo/people-admin-validation');

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
            `SELECT p.id, p.name_qualifier_ko, p.name_qualifier_en, p.cyrillic,
                    p.given_name_ko, p.given_name_en, p.family_name_ko, p.family_name_en,
                    p.citizenship_code, p.origin_code,
                    pa.patronymic_ko, pa.patronymic_en, pa.cyrillic_patronymic
             FROM commulingo_people p
             LEFT JOIN commulingo_person_patronymics pa ON pa.person_id = p.id
             ORDER BY p.id`
        );

        const problems = [];
        for (const row of rows) {
            const code = row.citizenship_code || '';
            const tag = `${row.id} (${personName(row, 'en') || personName(row, 'ko')}, '${code}')`;
            let anyParts = false;
            for (const lang of ['ko', 'en']) {
                const given = (row[`given_name_${lang}`] || '').trim();
                const family = (row[`family_name_${lang}`] || '').trim();
                if (!given && !family) continue;
                anyParts = true;
                // A lone token is a family name (or a mononym) by convention —
                // splitFullName in the admin store files it there, and
                // people-linkify offers the family part as the bare alias. A
                // given-only row (히로히토) is the shape a curator reaches for
                // when the order rule does not fit.
                if (given && !family) {
                    problems.push(`${tag}: given_name_${lang} "${given}" with no family_name_${lang}`
                        + ' — a single token, mononym or fused name goes in family, not given');
                }
                // A no-surname nation keeps the name whole in family: a given
                // part is a father's name split off as if it were a surname.
                if (given && isSingleNameNation(code) && !isRegnalNumber(family)) {
                    problems.push(`${tag}: given_name_${lang} "${given}" — '${code}' names have no surname;`
                        + ' the name as people call it goes whole in family (체렌도르지, 멩기스투 하일레 마리암)');
                }
            }
            if (!anyParts) problems.push(`${row.id}: no name parts at all`);
            const partsProblem = anyParts && familyFirstPartsProblem(
                { given: (row.given_name_ko || '').trim(), family: (row.family_name_ko || '').trim() },
                { given: (row.given_name_en || '').trim(), family: (row.family_name_en || '').trim() },
                code);
            if (partsProblem) problems.push(`${tag}: ${partsProblem}`);

            // 5. Patronymics render between given and family in Western order.
            const patronymic = [row.patronymic_ko, row.patronymic_en, row.cyrillic_patronymic]
                .map(v => (v || '').trim()).find(Boolean);
            if (patronymic && (familyFirstJoiner(code, 'ko') !== null || familyFirstJoiner(code, 'en') !== null
                || isSingleNameNation(code))) {
                problems.push(`${tag}: patronymic "${patronymic}" on a '${code}' name — it would render`
                    + ' Western-style (줄러 야노시 호른); a second given name or courtesy name goes to aliases');
            }
            for (const lang of ['ko', 'en']) {
                const pat = (row[`patronymic_${lang}`] || '').trim();
                if (pat && !(row[`given_name_${lang}`] || '').trim()) {
                    problems.push(`${tag}: patronymic_${lang} "${pat}" with no given name — it would lead`
                        + ' the name (아르샤코비치 카모)');
                }
            }

            // 3. Native-name line shape.
            const native = (row.cyrillic || '').trim();
            if (!native) continue; // audit-person-native-names.js reports the blank.
            const found = detectScripts(native);
            const familyFirstAtHome = familyFirstJoiner(code, 'ko') !== null;
            // Each form is checked on its own: a parenthesised second form —
            // the hanja beside the hangul, '최창익 (崔昌益)' — is set off by a
            // space, and that space is not inside either name.
            const forms = [native.replace(/\s*\([^)]*\)/g, ''), ...[...native.matchAll(/\(([^)]*)\)/g)].map(m => m[1])]
                .map(form => form.trim()).filter(Boolean);
            if (found.length && found.every(script => CJK.has(script)) && forms.some(form => /\s/.test(form))) {
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

        // 6. A shared name is told apart in lists only by name_qualifier_*:
        //    every card of the name carries one, and no two are the same.
        for (const lang of ['ko', 'en']) {
            const byName = new Map();
            for (const row of rows) {
                const name = personName(row, lang);
                if (name) byName.set(name, [...(byName.get(name) || []), row]);
            }
            for (const [name, group] of byName) {
                if (group.length < 2) continue;
                const qualifiers = group.map(row => row[`name_qualifier_${lang}`] || '');
                if (qualifiers.some(q => !q) || new Set(qualifiers).size < group.length) {
                    problems.push(`shared name_${lang} "${name}": ${group.map(row => `${row.id} "${row[`name_qualifier_${lang}`] || ''}"`).join(', ')}`
                        + ' — each card needs its own name_qualifier');
                }
            }
        }

        if (!problems.length) {
            console.log(`OK — ${rows.length} people checked: name parts follow the name-order standard`
                + ' and every shared name carries its own qualifier.');
            process.exit(0);
        }
        console.log(`${problems.length} name-order problem(s):\n`);
        for (const line of problems) console.log(`  ${line}`);
        console.log('\nFix the parts (or the citizenship code) through the Admin store; the name every page'
            + ' shows is composed from them.');
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
