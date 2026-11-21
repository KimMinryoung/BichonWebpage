#!/usr/bin/env node
// Replace one office page's lineage from a reviewed spec file: the office's
// title, blurb, range, 조직 변천 nodes and tracks, and all of its holder rows.
//
//   node scripts/commulingo-office-lineage-apply.js <spec.json> [--apply] [--changed-by who]
//
// Run where the repo is mounted and the DB is reachable (the dev-preview
// container: docker exec leninbot-frontend-dev node scripts/...). Default is a
// dry run that validates the spec, resolves every personId and prints the
// rows; --apply replaces the office in one transaction. Rows go through the
// office store (people-offices-store.js), so period and track validation and
// the revision log are the Admin API's. Spec format: the office lineage files
// under scripts/content/office-lineages-20261006/ ({officeId, title, blurb,
// range, lineage[], tracks[], rows[]}; a row's optional `seat` is state or
// government, for tracks laid out in two columns). A lineage node's optional
// `structures` [{date [y,m,d], title, source, units [{name, role, trackId? | head?}]}]
// lists the whole organization at a date; a unit's trackId shows who held that
// track then, a unit outside the tracks names its head ({personId}, {name} or
// {vacant: true}, optional note). A track's optional `lead: true` puts it in
// the picker's top row (the office's leading posts).
const fs = require('fs');
const db = require('../config/database');
const { personName, nameColumns } = require('../data/commulingo/person-name');
const { withTransaction, writeRevision } = require('../data/commulingo/admin-tx');
const offices = require('../data/commulingo/people-offices-store');

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const byIndex = args.indexOf('--changed-by');
const changedBy = byIndex >= 0 ? args[byIndex + 1] : 'office-lineage-apply';
const file = args.find((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--changed-by');
if (!file) {
    console.error('usage: commulingo-office-lineage-apply.js <spec.json> [--apply] [--changed-by who]');
    process.exit(2);
}

const bilingual = (value, where, optional = false) => {
    if (optional && value == null) return null;
    if (!value || typeof value.ko !== 'string' || !value.ko.trim() || typeof value.en !== 'string' || !value.en.trim()) {
        throw new Error(`${where} needs ko and en text`);
    }
    return { ko: value.ko.trim(), en: value.en.trim() };
};

function validate(spec) {
    if (!spec.officeId) throw new Error('officeId missing');
    bilingual(spec.title, 'title');
    bilingual(spec.blurb, 'blurb');
    const trackIds = new Set();
    for (const track of spec.tracks || []) {
        if (!track.id || trackIds.has(track.id)) throw new Error(`track id missing or repeated: ${track.id}`);
        trackIds.add(track.id);
        bilingual(track.title, `track ${track.id} title`);
        bilingual(track.blurb, `track ${track.id} blurb`, true);
        if (track.lead !== undefined && typeof track.lead !== 'boolean') throw new Error(`track ${track.id} lead must be true or false`);
    }
    for (const node of spec.lineage || []) {
        bilingual(node.name, 'lineage name');
        bilingual(node.body, `lineage ${node.name.ko} body`);
        for (const [k, structure] of (node.structures || []).entries()) {
            const where = `lineage ${node.name.ko} structures[${k}]`;
            if (!Array.isArray(structure.date) || !structure.date[0]) throw new Error(`${where} date missing`);
            bilingual(structure.title, `${where} title`);
            for (const [u, unit] of (structure.units || []).entries()) {
                bilingual(unit.name, `${where} units[${u}] name`);
                bilingual(unit.role, `${where} units[${u}] role`, true);
                if (unit.trackId && !trackIds.has(unit.trackId)) throw new Error(`${where} units[${u}] track ${unit.trackId} not listed`);
                if (unit.head) {
                    if (unit.trackId) throw new Error(`${where} units[${u}] has both head and trackId`);
                    if (!unit.head.personId && !unit.head.vacant) bilingual(unit.head.name, `${where} units[${u}] head name`);
                    bilingual(unit.head.note, `${where} units[${u}] head note`, true);
                }
            }
        }
    }
    (spec.rows || []).forEach((row, i) => {
        const where = `rows[${i}]`;
        if (!trackIds.has(row.track)) throw new Error(`${where} track ${row.track} not listed`);
        bilingual(row.post, `${where} post`);
        if (!row.personId) bilingual(row.name, `${where} name`);
        bilingual(row.note, `${where} note`, true);
        if (row.seat != null && !['state', 'government'].includes(row.seat)) throw new Error(`${where} seat must be state or government`);
        if (!row.period || !Array.isArray(row.period.start)) throw new Error(`${where} period.start missing`);
    });
}

async function main() {
    const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
    validate(spec);
    const ids = [...new Set(spec.rows.map(row => row.personId).filter(Boolean))];
    const found = await db.query(`SELECT id, ${nameColumns()} FROM commulingo_people WHERE id = ANY($1)`, [ids]);
    const names = new Map(found.rows.map(row => [row.id, personName(row, 'ko')]));
    const missing = ids.filter(id => !names.has(id));
    if (missing.length) throw new Error(`unknown personId: ${missing.join(', ')}`);
    const terms = (spec.lineage || []).map(node => node.termId).filter(Boolean);
    const termRows = await db.query('SELECT id FROM commulingo_terms WHERE id = ANY($1)', [terms]);
    const badTerms = terms.filter(id => !termRows.rows.some(row => row.id === id));
    if (badTerms.length) throw new Error(`unknown termId: ${badTerms.join(', ')}`);

    for (const track of spec.tracks) {
        console.log(`\n# ${track.title.ko}`);
        for (const row of spec.rows.filter(r => r.track === track.id)) {
            const end = row.period.end ? row.period.end.join('.') : (row.period.ongoing ? '현재' : '');
            console.log(`  ${row.period.start.join('.')}–${end}  ${row.personId ? names.get(row.personId) : row.name.ko + ' (카드 없음)'}  ${row.post.ko}${row.note ? ' · ' + row.note.ko : ''}`);
        }
    }
    if (!apply) {
        console.log(`\n(dry run) ${spec.officeId}: ${spec.tracks.length} tracks, ${spec.rows.length} rows, ${(spec.lineage || []).length} lineage nodes`);
        return;
    }

    await withTransaction({}, async client => {
        await client.query('SELECT id FROM commulingo_offices WHERE id = $1 FOR UPDATE', [spec.officeId]);
        const before = await offices.getOfficeAdmin(spec.officeId, { client });
        if (!before) throw new Error(`office ${spec.officeId} not found`);
        const lineage = (spec.lineage || []).map(node => ({
            name: node.name, period: node.period || '', body: node.body, ...(node.termId ? { termId: node.termId } : {}),
            ...(node.structures && node.structures.length ? { structures: node.structures } : {}),
        }));
        const tracks = spec.tracks.map(track => ({ id: track.id, title: track.title, ...(track.blurb ? { blurb: track.blurb } : {}), ...(track.lead ? { lead: true } : {}) }));
        await client.query(
            `UPDATE commulingo_offices SET title_ko = $2, title_en = $3, blurb_ko = $4, blurb_en = $5,
                range_label = $6, lineage = $7::jsonb, tracks = $8::jsonb, updated_at = NOW() WHERE id = $1`,
            [spec.officeId, spec.title.ko, spec.title.en, spec.blurb.ko, spec.blurb.en, spec.range || before.range,
                JSON.stringify(lineage), JSON.stringify(tracks)]
        );
        await client.query('DELETE FROM commulingo_office_rows WHERE office_id = $1', [spec.officeId]);
        await writeRevision(client, 'office', spec.officeId, 'replace office lineage', { before }, changedBy);
        for (const [index, row] of spec.rows.entries()) {
            await offices.createOfficeRowAdmin(spec.officeId, {
                sortOrder: index,
                period: row.period,
                body: row.post,
                personId: row.personId || '',
                name: row.personId ? { ko: '', en: '' } : row.name,
                note: row.note || { ko: '', en: '' },
                trackId: row.track,
                seat: row.seat || '',
            }, { client, changedBy });
        }
    });
    console.log(`\napplied ${spec.officeId}: ${spec.rows.length} rows`);
}

main().then(() => db.end?.()).then(() => process.exit(0)).catch(err => {
    console.error(err.message);
    process.exit(1);
});
