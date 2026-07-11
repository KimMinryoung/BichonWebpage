#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const data = require('../data/commulingo/people');
const { parsePeriod, validateCommuLingoPeople } = require('../data/commulingo/people-standard');
const { applyPersonRolesMigration, seedCommuLingoPersonRoles } = require('./seed-commulingo-person-roles');

const replaceExisting = process.argv.includes('--replace');
const forceReplace = process.argv.includes('--force');

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function parseLifeYears(label) {
    const match = /^(\d{3,4})[–-](\d{3,4})$/.exec(label || '');
    if (!match) return { birthYear: null, deathYear: null };
    return {
        birthYear: Number.parseInt(match[1], 10),
        deathYear: Number.parseInt(match[2], 10),
    };
}

function periodColumns(label) {
    const period = parsePeriod(label || '');
    return [
        period.start ? period.start.year : null,
        period.start ? period.start.month : null,
        period.end ? period.end.year : null,
        period.end ? period.end.month : null,
    ];
}

async function insertGroups(client) {
    for (const [index, group] of (data.groups || []).entries()) {
        await client.query(
            `INSERT INTO commulingo_people_groups
                (id, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
                group.id,
                index,
                group.range || '',
                localize(group.title, 'ko'),
                localize(group.title, 'en'),
                localize(group.blurb, 'ko'),
                localize(group.blurb, 'en'),
            ]
        );
    }
}

async function insertPeople(client) {
    for (const [index, person] of (data.people || []).entries()) {
        const years = parseLifeYears(person.years || '');
        await client.query(
            `INSERT INTO commulingo_people
                (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
                 name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
                 fate_kind, fate_label_ko, fate_label_en, updated_at)
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8,
                 $9, $10, $11, $12, $13, $14,
                 $15, $16, $17, NOW())`,
            [
                person.id,
                person.group,
                index,
                person.initial || '',
                person.cyrillic || '',
                person.years || '',
                years.birthYear,
                years.deathYear,
                localize(person.name, 'ko'),
                localize(person.name, 'en'),
                localize(person.epithet, 'ko'),
                localize(person.epithet, 'en'),
                localize(person.bio, 'ko'),
                localize(person.bio, 'en'),
                person.fate ? person.fate.kind || '' : '',
                person.fate ? localize(person.fate.label, 'ko') : '',
                person.fate ? localize(person.fate.label, 'en') : '',
            ]
        );

        const patronymic = (data.patronymics || {})[person.id] || {};
        const cyrillicPatronymic = (data.cyrillicPatronymics || {})[person.id] || '';
        if (localize(patronymic, 'ko') || localize(patronymic, 'en') || cyrillicPatronymic) {
            await client.query(
                `INSERT INTO commulingo_person_patronymics
                    (person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at)
                 VALUES ($1, $2, $3, $4, NOW())`,
                [
                    person.id,
                    localize(patronymic, 'ko'),
                    localize(patronymic, 'en'),
                    cyrillicPatronymic,
                ]
            );
        }

        const aliases = person.aliases || {};
        for (const lang of ['ko', 'en']) {
            for (const [aliasIndex, alias] of (aliases[lang] || []).entries()) {
                await client.query(
                    `INSERT INTO commulingo_person_aliases
                        (person_id, lang, alias, sort_order)
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT (person_id, lang, alias)
                     DO UPDATE SET sort_order = EXCLUDED.sort_order`,
                    [person.id, lang, alias, aliasIndex]
                );
            }
        }

        for (const [sceneIndex, scene] of (person.scenes || []).entries()) {
            await client.query(
                `INSERT INTO commulingo_person_scenes
                    (person_id, collection_id, episode_id, sort_order)
                 VALUES ($1, $2, $3, $4)`,
                [person.id, scene[0], scene[1], sceneIndex]
            );
        }
    }
}

async function insertCareers(client) {
    for (const [personId, entries] of Object.entries(data.careers || {})) {
        for (const [index, entry] of (entries || []).entries()) {
            const [startYear, startMonth, endYear, endMonth] = periodColumns(entry.y || '');
            await client.query(
                `INSERT INTO commulingo_person_career_entries
                    (person_id, sort_order, period_label, start_year, start_month, end_year, end_month,
                     role_ko, role_en, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
                [
                    personId,
                    index,
                    entry.y || '',
                    startYear,
                    startMonth,
                    endYear,
                    endMonth,
                    localize(entry.r, 'ko'),
                    localize(entry.r, 'en'),
                ]
            );
        }
    }
}

async function insertOffices(client) {
    for (const [officeIndex, office] of (data.offices || []).entries()) {
        await client.query(
            `INSERT INTO commulingo_offices
                (id, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [
                office.id,
                officeIndex,
                office.range || '',
                localize(office.title, 'ko'),
                localize(office.title, 'en'),
                localize(office.blurb, 'ko'),
                localize(office.blurb, 'en'),
            ]
        );

        for (const [rowIndex, row] of (office.rows || []).entries()) {
            const [startYear, startMonth, endYear, endMonth] = periodColumns(row.years || '');
            await client.query(
                `INSERT INTO commulingo_office_rows
                    (office_id, sort_order, period_label, start_year, start_month, end_year, end_month,
                     body_ko, body_en, person_id, name_ko, name_en, note_ko, note_en, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
                         NULLIF($10, ''), $11, $12, $13, $14, NOW())`,
                [
                    office.id,
                    rowIndex,
                    row.years || '',
                    startYear,
                    startMonth,
                    endYear,
                    endMonth,
                    localize(row.body, 'ko'),
                    localize(row.body, 'en'),
                    row.personId || '',
                    localize(row.name, 'ko'),
                    localize(row.name, 'en'),
                    localize(row.note, 'ko'),
                    localize(row.note, 'en'),
                ]
            );
        }
    }
}

async function main() {
    const issues = validateCommuLingoPeople(data);
    const errors = issues.filter(issue => issue.level === 'error');
    if (errors.length) {
        console.error(JSON.stringify({ errors }, null, 2));
        process.exitCode = 1;
        return;
    }

    const schemaPath = path.join(__dirname, 'migrations', '007_commulingo_people.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query(schemaSql);
        await applyPersonRolesMigration(client);

        const existing = await client.query('SELECT COUNT(*)::int AS count FROM commulingo_people');
        if (existing.rows[0].count > 0 && !replaceExisting) {
            throw new Error('commulingo_people already has rows; rerun with --replace for bootstrap overwrite');
        }

        if (replaceExisting) {
            // DB rows edited after the last seed (admin API or AI agent edits,
            // both leave revisions) are NOT in people.js and would be lost.
            const revisions = await client.query(
                'SELECT COUNT(*)::int AS count FROM commulingo_people_revisions'
            );
            if (revisions.rows[0].count > 0 && !forceReplace) {
                throw new Error(
                    `refusing --replace: ${revisions.rows[0].count} revision(s) show the DB was edited ` +
                    'after seeding (admin/agent edits live only in the DB and would be overwritten). ' +
                    'Rerun with --replace --force to overwrite anyway.'
                );
            }
            await client.query(
                `TRUNCATE
                    commulingo_person_aliases,
                    commulingo_person_scenes,
                    commulingo_person_career_entries,
                    commulingo_person_roles,
                    commulingo_office_rows,
                    commulingo_person_patronymics,
                    commulingo_offices,
                    commulingo_people,
                    commulingo_people_groups
                 RESTART IDENTITY`
            );
        }

        await insertGroups(client);
        await insertPeople(client);
        await insertCareers(client);
        await insertOffices(client);
        const roleSeed = await seedCommuLingoPersonRoles(client);

        const counts = await client.query(
            `SELECT
                (SELECT COUNT(*)::int FROM commulingo_people_groups) AS groups,
                (SELECT COUNT(*)::int FROM commulingo_people) AS people,
                (SELECT COUNT(*)::int FROM commulingo_person_career_entries) AS career_entries,
                (SELECT COUNT(*)::int FROM commulingo_offices) AS offices,
                (SELECT COUNT(*)::int FROM commulingo_office_rows) AS office_rows,
                (SELECT COUNT(*)::int FROM commulingo_person_roles) AS person_roles`
        );
        await client.query('COMMIT');
        console.log(JSON.stringify({ migrated: true, replaceExisting, counts: counts.rows[0], roleSeed }, null, 2));
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await db.end();
    }
}

main();
