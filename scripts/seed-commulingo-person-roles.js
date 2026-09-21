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

    // SEED ONLY — commulingo_role_categories is the source of truth and is
    // edited with UPDATE/INSERT (no deploy). This list exists to populate a
    // fresh database; the ON CONFLICT DO NOTHING below means editing a label
    // here does nothing to a live one. Retired categories must be removed from
    // this list or a re-seed brings them back — that is why
    // 'russian-republic-leader' is gone. Drift is caught by
    // scripts/check-commulingo-code-db-drift.js.
    const roleCategories = [
        ['imperial-white', 1, 'crown', '제정·백색진영', 'Imperial establishment and White movement'],
        ['writer-artist', 2, 'feather', '작가·예술가', 'Writers and artists'],
        ['theorist', 3, 'book-open', '이론가', 'Theorist'],
        ['non-soviet-revolutionary', 4, 'flame', '비소련 혁명가', 'Non-Soviet revolutionary'],
        ['socialist-bloc-reform-leader', 5, 'dove', '사회주의권 개혁 지도자', 'Socialist-bloc reform leader'],
        // 'russian-republic-leader' was retired on 2026-07-30. It was meant for
        // post-Soviet Russian leadership, but its label read as the RSFSR and the
        // curator filled it with 34 Soviet-era officials whose offices already
        // held their predecessors; Yeltsin, the only figure it was made for, sits
        // in state-head (최고소비에트 → 대통령직). Re-seeding it would bring it back.
        // Added 2026-08-09 (migration 127). Without these two the only
        // non-Soviet slots were 제정·백색진영 and 비소련 혁명가, so Franco sat
        // under a label about the Russian imperial establishment and Syngman
        // Rhee displayed as a revolutionary.
        ['counterrevolution', 6, 'swords', '반혁명 세력', 'Counter-revolutionary forces'],
        ['left-opposition', 7, 'git-branch', '좌익 반대파', 'Left Opposition'],
        ['socialist-bloc-leader', 8, 'orbit', '사회주의권 지도자', 'Socialist-bloc leader'],
        ['foreign-statesman', 9, 'scroll-text', '외국 정치가', 'Foreign statesman'],
        // Added 2026-08-09 (migration 129). 이론가 is the movement's own
        // theorists; this is for the academics who study the movement, whom the
        // event lane's historiography sections name and who otherwise had to be
        // filed as revolutionaries or counter-revolutionaries.
        ['scholar', 10, 'library', '연구자', 'Scholar'],
        // Added 2026-09-21 (migration 182). A commander outside the Soviet
        // army (Zhu De, Peng Dehuai, Giap) had to wear 비소련 혁명가 or
        // 사회주의권 지도자; the Soviet marshals keep the 군사·국방 office.
        ['military-commander', 11, 'shield', '군 지휘관', 'Military commander'],
        // Added 2026-09-21 (migration 183). The Chinese party-state by
        // function, the way the offices split the Soviet one; plus 반체제 인사.
        ['ccp-leadership', 12, 'flag', '중공 당 지도부', 'CCP party leadership'],
        ['prc-government', 13, 'briefcase', '국무원·정부', 'PRC government'],
        ['ccp-security', 14, 'eye', '중공 보안·정보', 'CCP security and intelligence'],
        ['ccp-ideology-propaganda', 15, 'megaphone', '중공 이념·선전', 'CCP ideology and propaganda'],
        ['prc-economy-planning', 16, 'chart', '중국 경제·계획', 'PRC economy and planning'],
        ['prc-foreign-affairs', 17, 'handshake', '중국 외교', 'PRC foreign affairs'],
        ['qing-kuomintang-warlords', 18, 'landmark', '청·국민당·군벌', 'Qing, Kuomintang and warlords'],
        ['dissident', 19, 'rose', '반체제 인사', 'Dissident'],
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
