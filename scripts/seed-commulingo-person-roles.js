#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { OFFICE_ICON } = require('../data/commulingo/people-standard');

async function applyPersonRolesMigration(client) {
    const schemaPath = path.join(__dirname, 'migrations', '008_commulingo_person_roles.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
}

async function seedCommuLingoPersonRoles(client) {
    // Person->role rows live only in the DB (created via admin API / agent);
    // this seed only fills office icons. After a --replace --force, restore
    // commulingo_person_roles from a DB backup.
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
    return { officeIconsUpdated };
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
