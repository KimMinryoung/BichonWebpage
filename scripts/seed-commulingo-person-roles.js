#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { OFFICE_ICON } = require('../data/commulingo/people-standard');

async function applyPersonRolesMigration(client) {
    const schemaPaths = [
        path.join(__dirname, 'migrations', '008_commulingo_person_roles.sql'),
        path.join(__dirname, 'migrations', '010_commulingo_role_categories.sql'),
    ];
    const schemaSql = schemaPaths.map(schemaPath => fs.readFileSync(schemaPath, 'utf8')).join('\n');
    await client.query(schemaSql);
}

async function seedCommuLingoPersonRoles(client) {
    // Person->role rows live only in the DB (created via admin API / agent);
    // this seed fills office icons and canonical office-less role categories.
    // After a --replace --force, restore commulingo_person_roles from a DB backup.
    let officeIconsUpdated = 0;
    for (const [officeId, icon] of Object.entries(OFFICE_ICON)) {
        const result = await client.query(
            `UPDATE commulingo_offices
             SET icon = $2
             WHERE id = $1
               AND icon = ''`,
            [officeId, icon]
        );
        officeIconsUpdated += result.rowCount;
    }

    const roleCategories = [
        ['writer', 1, 'feather', '작가', 'Writer'],
        ['intl-revolutionary', 2, 'flame', '비소련 혁명가', 'Non-Soviet revolutionary'],
        ['bloc-reformer', 3, 'dove', '사회주의권 개혁 지도자', 'Socialist-bloc reform leader'],
        ['russian-republic-leader', 4, 'landmark', '러시아 공화국 지도자', 'Russian republic leader'],
        ['left-opposition', 5, 'git-branch', '좌익 반대파', 'Left Opposition'],
    ];
    let roleCategoriesInserted = 0;
    for (const category of roleCategories) {
        const result = await client.query(
            `INSERT INTO commulingo_role_categories
                (id, sort_order, icon, label_ko, label_en, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (id) DO NOTHING`,
            category
        );
        roleCategoriesInserted += result.rowCount;
    }

    const backfill = await client.query(
        `UPDATE commulingo_person_roles r
         SET category_id = c.id,
             updated_at = NOW()
         FROM commulingo_role_categories c
         WHERE r.category_id IS NULL
           AND r.office_id IS NULL
           AND r.icon <> ''
           AND r.icon = c.icon`
    );

    return {
        officeIconsUpdated,
        roleCategoriesInserted,
        personRoleCategoriesBackfilled: backfill.rowCount,
    };
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
