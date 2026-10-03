#!/usr/bin/env node
// New glossary terms of a history batch (scripts/content/<batch>-terms.json:
// { id, terms: [{ id, sources, fields, noOriginal? }] }) through the term editorial service
// — submitTermEdit + reviewTermSuggestion, the same validation and revision
// trail as the admin UI. Every term is written in one transaction; without
// --apply the writes run and are rolled back, so a dry run exercises the real
// checks (name/alias collisions, generic-alias trigger, unknown people/events).
//   docker exec -i leninbot-frontend node /app/scripts/apply-history-terms.js - [--apply] < spec.json
// Existing ids are refused, never overwritten. People cards and events must exist first.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = process.env.APP_ROOT || path.resolve(__dirname, '..');

async function main() {
    const args = process.argv.slice(2);
    assert(args.every(a => !a.startsWith('--') || a === '--apply'), 'unknown argument');
    const files = args.filter(a => !a.startsWith('--'));
    assert.equal(files.length, 1, 'one spec.json (or -) required');
    const apply = args.includes('--apply');
    const spec = JSON.parse(fs.readFileSync(files[0] === '-' ? 0 : files[0], 'utf8'));
    assert(/^[a-z0-9-]+-\d{8}$/.test(spec.id) && Array.isArray(spec.terms) && spec.terms.length, 'spec { id: <batch>, terms: [...] }');
    const db = require(path.join(root, 'config/database'));
    const { submitTermEdit, reviewTermSuggestion } = require(path.join(root, 'data/commulingo/term-editorial-service'));
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SET LOCAL lock_timeout='3s'");
        for (const entry of spec.terms) {
            assert.equal((await client.query('SELECT 1 FROM commulingo_terms WHERE id=$1', [entry.id])).rowCount, 0, `term exists: ${entry.id}`);
            // The term page heads with the original-language form; batches
            // without it left 104 terms headless (2026-10-03). A purely
            // descriptive heading with no original name says why instead.
            assert(String(entry.fields.original || '').trim() || String(entry.noOriginal || '').trim(),
                `${entry.id}: fields.original (native-script name) is required, or noOriginal: "<reason>"`);
            for (const id of entry.fields.people || []) assert.equal((await client.query('SELECT 1 FROM commulingo_people WHERE id=$1', [id])).rowCount, 1, `${entry.id}: missing person ${id}`);
            for (const id of entry.fields.events || []) assert.equal((await client.query('SELECT 1 FROM commulingo_history_events WHERE id=$1', [id])).rowCount, 1, `${entry.id}: missing event ${id}`);
            const submitted = await submitTermEdit({ id: entry.id, action: 'create', fields: entry.fields, sources: entry.sources, changedBy: spec.id }, { client });
            assert.equal(submitted.status, 'pending', `${entry.id}: unexpected ${submitted.status}`);
            const reviewed = await reviewTermSuggestion(submitted.suggestionId, true, `${spec.id}: reviewed batch entry`, { client, changedBy: spec.id });
            assert.equal(reviewed.status, 'approved', `${entry.id}: ${reviewed.status}`);
            console.log(`${apply ? 'created' : 'ok'} ${entry.id}`);
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        console.log(apply ? `committed ${spec.terms.length} term(s)` : `dry run: ${spec.terms.length} term(s) validated, rolled back`);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await db.end();
    }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
