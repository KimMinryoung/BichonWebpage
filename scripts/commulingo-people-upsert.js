#!/usr/bin/env node
// Register or update CommuLingo people through the Admin store — the same
// validation the /admin/api/commulingo/people endpoints run (native script,
// name parts, patronymic separation, nationality codes, role required, short
// card labels) — instead of hand-written INSERT statements, which bypass all of
// it (migration 167, 2026-09-05: voldemar-ulmer landed with no role row and a
// sentence for a fate label).
//
// Usage:
//   scripts/commulingo-people-upsert <spec.json> [--dry-run] [--changed-by who]
//   (wrapper: runs this file inside leninbot-frontend; `-` reads the spec from stdin)
//
// Spec: { "people": [ <person>, ... ] } where <person> is the Admin API create
// payload plus an optional "sections" array:
// {
//   "id": "voldemar-ulmer", "groupId": "stalin-era",
//   "givenName": {"ko": "볼데마르", "en": "Voldemar"}, "familyName": {"ko": "울메르", "en": "Ulmer"},
//   "cyrillic": "Вольдемар Ульмер",                      // native name WITHOUT the patronymic
//   "patronymic": {"ko": "아우구스토비치", "en": "Avgustovich"}, "cyrillicPatronymic": "Августович",
//   "years": "1896–1945",
//   "citizenship": {"code": "soviet"}, "nationalOrigin": {"code": "estonia", "label": {"ko": "에스토니아 (스웨덴계)", "en": "Estonia (Swedish descent)"}},
//   "epithet": {"ko": "...", "en": "..."}, "bio": {"ko": "...", "en": "..."},
//   "fate": {"kind": "natural", "label": {"ko": "수용소에서 사망", "en": "Died in a labour camp"}},
//   "role": {"officeId": "state-security"},              // or {"category": "..."} / {"icon": "..."}
//   "aliases": {"ko": ["울메르", "V.A. 울메르"], "en": ["Ulmer", "V. A. Ulmer"]},
//   "career": [...], "scenes": [...],
//   "sections": [{"slug": "great-terror", "sortOrder": 193704, "heading": {"ko": "...", "en": "..."}, "body": {"ko": "...", "en": "..."}, "sources": [...]}]
// }
// An existing id is PATCHed with the fields given; a new id is created. Every
// person in the spec is applied in one transaction; --dry-run validates and
// rolls back. Exit 1 on any rejection, with the store's message.

const fs = require('fs');
const { db } = require('./lib/bootstrap');
const { getPersonAdmin, createPersonAdmin, updatePersonAdmin } = require('../data/commulingo/people-admin-store');
const { upsertPersonSectionAdmin } = require('../data/commulingo/people-sections-store');
const { clearCommuLingoPeopleCache } = require('../data/commulingo/people-store');

function readSpec(arg) {
    const raw = arg === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(arg, 'utf8');
    const spec = JSON.parse(raw);
    const people = Array.isArray(spec) ? spec : spec.people;
    if (!Array.isArray(people) || !people.length) throw new Error('spec must be { "people": [ ... ] } with at least one person');
    return { people, changedBy: spec.changedBy };
}

(async () => {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const cbIndex = args.indexOf('--changed-by');
    const positional = args.filter((a, i) => !a.startsWith('--') && (cbIndex < 0 || i !== cbIndex + 1));
    if (!positional.length) {
        console.error('usage: commulingo-people-upsert.js <spec.json|-> [--dry-run] [--changed-by who]');
        process.exit(2);
    }
    let exitCode = 0;
    let client;
    try {
        const { people, changedBy: specChangedBy } = readSpec(positional[0]);
        const changedBy = cbIndex >= 0 ? args[cbIndex + 1] : (specChangedBy || `commulingo-people-upsert:${process.env.USER || 'cli'}`);
        client = await db.connect();
        await client.query('BEGIN');
        for (const entry of people) {
            const { sections, ...payload } = entry;
            if (!payload.id) throw new Error('every person needs an id');
            const existing = await getPersonAdmin(payload.id, { client });
            if (existing) {
                await updatePersonAdmin(payload.id, payload, { client, changedBy });
                console.log(`updated ${payload.id}`);
            } else {
                await createPersonAdmin(payload, { client, changedBy });
                console.log(`created ${payload.id}`);
            }
            for (const section of sections || []) {
                await upsertPersonSectionAdmin(payload.id, section.slug, section, { client, changedBy });
                console.log(`  section ${section.slug} (sort ${section.sortOrder})`);
            }
        }
        if (dryRun) {
            await client.query('ROLLBACK');
            console.log(`dry run: ${people.length} person(s) validated, nothing written`);
        } else {
            await client.query('COMMIT');
            clearCommuLingoPeopleCache();
            console.log(`committed ${people.length} person(s); the site picks it up on the next people-store refresh (~60s)`);
        }
    } catch (err) {
        if (client) await client.query('ROLLBACK').catch(() => {});
        console.error(`rejected: ${err.message}`);
        exitCode = 1;
    } finally {
        if (client) client.release();
        await db.end().catch(() => {});
        process.exit(exitCode);
    }
})();
