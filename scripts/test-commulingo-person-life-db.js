// Run where the DB is reachable. Copies only life metadata to temporary tables,
// rehearses migration 167 and tests SQL constraints; always rolls back.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { db } = require('./lib/bootstrap');
const { parseLifeYears, personLifeProblems } = require('../data/commulingo/person-life-years');

async function main() {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query(`CREATE TEMP TABLE commulingo_people (
            id text PRIMARY KEY, years_label text NOT NULL DEFAULT '', birth_year integer, death_year integer,
            fate_kind text NOT NULL DEFAULT '', fate_label_ko text NOT NULL DEFAULT '', fate_label_en text NOT NULL DEFAULT '', updated_at timestamptz
        ) ON COMMIT DROP`);
        await client.query(`INSERT INTO commulingo_people SELECT id, years_label, birth_year, death_year,
            fate_kind, fate_label_ko, fate_label_en, updated_at FROM public.commulingo_people`);
        await client.query(`CREATE TEMP TABLE commulingo_people_revisions (
            entity_type text, entity_id text, revision_note text, snapshot jsonb, changed_by text
        ) ON COMMIT DROP`);
        const migration = fs.readFileSync(path.join(__dirname, 'migrations/167_commulingo_person_life_years.sql'), 'utf8');
        await client.query(migration.replace(/^BEGIN;$/m, '').replace(/^COMMIT;$/m, ''));
        const { rows } = await client.query('SELECT * FROM commulingo_people');
        for (const row of rows) {
            assert.deepEqual(personLifeProblems(row.years_label, { kind: row.fate_kind, label: { ko: row.fate_label_ko, en: row.fate_label_en } }), [], row.id);
            const years = parseLifeYears(row.years_label);
            assert.equal(row.birth_year, years.birthYear, row.id);
            assert.equal(row.death_year, years.deathYear, row.id);
        }
        const revisions = await client.query('SELECT count(*)::int AS count FROM commulingo_people_revisions');
        console.log(`Migration rehearsal: ${rows.length} rows valid, ${revisions.rows[0].count} audited changes`);

        for (const patch of [
            "years_label = '현재'", "years_label = '1987–present'", "years_label = '1987–현재'", "years_label = '1987– '",
            "fate_kind = 'natural'", "fate_label_ko = '생존'", "fate_label_en = 'Died'",
            'death_year = 2020', 'birth_year = NULL',
        ]) {
            await client.query('SAVEPOINT invalid_write');
            await assert.rejects(client.query(`UPDATE commulingo_people SET ${patch} WHERE id = 'alexei-safronov'`), { code: '23514' });
            await client.query('ROLLBACK TO SAVEPOINT invalid_write');
        }
        await client.query('SAVEPOINT invalid_insert');
        await assert.rejects(client.query("INSERT INTO commulingo_people (id, years_label, birth_year, fate_kind) VALUES ('invalid-living', '1987–', 1987, 'natural')"), { code: '23514' });
        await client.query('ROLLBACK TO SAVEPOINT invalid_insert');
        await client.query('SAVEPOINT invalid_status');
        await assert.rejects(client.query("UPDATE commulingo_people SET fate_label_en = 'Living' WHERE id = 'lenin'"), { code: '23514' });
        await client.query('ROLLBACK TO SAVEPOINT invalid_status');
        await client.query("INSERT INTO commulingo_people (id, years_label, birth_year) VALUES ('valid-living', '1987–', 1987)");
        await client.query("UPDATE commulingo_people SET years_label = '1987–2026', death_year = 2026, fate_label_ko = '사망' WHERE id = 'valid-living'");
        await client.query("UPDATE commulingo_people SET years_label = '1987–', death_year = NULL, fate_label_ko = '' WHERE id = 'valid-living'");
        console.log('SQL constraints: invalid INSERT/PATCH rejected, atomic life-status changes accepted');
    } finally {
        await client.query('ROLLBACK');
        client.release();
        await db.end();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
