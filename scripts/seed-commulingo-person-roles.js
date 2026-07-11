#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { ROLE_RULES } = require('../data/commulingo/people-standard');

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

async function applyPersonRolesMigration(client) {
    const schemaPath = path.join(__dirname, 'migrations', '008_commulingo_person_roles.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
}

async function seedCommuLingoPersonRoles(client) {
    let inserted = 0;
    let skipped = 0;
    let officeIconsUpdated = 0;

    const officeIcons = new Map();
    for (const rule of ROLE_RULES) {
        if (rule.officeId && rule.icon && !officeIcons.has(rule.officeId)) {
            officeIcons.set(rule.officeId, rule.icon);
        }
    }

    for (const [officeId, icon] of officeIcons.entries()) {
        const result = await client.query(
            `UPDATE commulingo_offices
             SET icon = $2
             WHERE id = $1
               AND icon = ''`,
            [officeId, icon]
        );
        officeIconsUpdated += result.rowCount;
    }

    for (const rule of ROLE_RULES) {
        for (const personId of rule.people || []) {
            const result = await client.query(
                `INSERT INTO commulingo_person_roles
                    (person_id, icon, office_id, label_ko, label_en, updated_at)
                 SELECT id, $2, NULLIF($3, ''), $4, $5, NOW()
                 FROM commulingo_people
                 WHERE id = $1
                 ON CONFLICT (person_id) DO NOTHING
                 RETURNING person_id`,
                [
                    personId,
                    rule.officeId ? '' : rule.icon || '',
                    rule.officeId || '',
                    rule.label ? localize(rule.label, 'ko') : '',
                    rule.label ? localize(rule.label, 'en') : '',
                ]
            );
            if (result.rows.length) {
                inserted += 1;
            } else {
                skipped += 1;
            }
        }
    }

    return { inserted, skipped, officeIconsUpdated };
}

async function main() {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await applyPersonRolesMigration(client);
        const summary = await seedCommuLingoPersonRoles(client);
        await client.query('COMMIT');
        console.log(JSON.stringify(summary, null, 2));
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await db.end();
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    applyPersonRolesMigration,
    seedCommuLingoPersonRoles,
};
