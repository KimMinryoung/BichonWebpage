#!/usr/bin/env node
// Wording fixes inside existing glossary terms through the term editorial
// service (submitTermEdit + reviewTermSuggestion), so each change carries a
// revision, evidence and an approved suggestion like an Admin edit.
//   docker exec -i leninbot-frontend node /app/scripts/apply-term-text-fixes.js - [--apply] < spec.json
// Spec: { id: "<batch>-YYYYMMDD", source: "<url>", claim: "...",
//         fixes: [{ id, from, to, lang?: "ko", source?: <url>, aliasesAdd?: { ko: [...], en: [...] } }] }
// The source (fix.source, else spec.source) must be external to the dictionary.
// `from` must occur in the term's term/definition/body text for that language;
// every occurrence there is replaced. Without --apply the writes roll back.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.env.APP_ROOT || path.join(__dirname, '..');

async function main() {
    const args = process.argv.slice(2);
    const apply = args.includes('--apply');
    const files = args.filter(a => !a.startsWith('--'));
    assert.equal(files.length, 1, 'one spec.json (or -) required');
    const spec = JSON.parse(fs.readFileSync(files[0] === '-' ? 0 : files[0], 'utf8'));
    assert(/^[a-z0-9-]+-\d{8}$/.test(spec.id) && spec.source && spec.claim && Array.isArray(spec.fixes), 'spec { id, source, claim, fixes }');
    const db = require(path.join(root, 'config/database'));
    const { readTermEditorial, submitTermEdit, reviewTermSuggestion } = require(path.join(root, 'data/commulingo/term-editorial-service'));
    const byTerm = new Map();
    for (const fix of spec.fixes) byTerm.set(fix.id, [...(byTerm.get(fix.id) || []), fix]);
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        for (const [id, fixes] of byTerm) {
            const current = await readTermEditorial(id, { client });
            assert(current, `missing term ${id}`);
            const fields = { expectedRevision: current.revision }, evidence = [], sources = new Set();
            for (const fix of fixes) {
                const lang = fix.lang || 'ko', source = fix.source || spec.source;
                sources.add(source);
                let hit = false;
                for (const field of ['term', 'definition', 'body']) {
                    const value = fields[field] || { ...current[field] };
                    if (!value[lang].includes(fix.from)) continue;
                    value[lang] = value[lang].split(fix.from).join(fix.to);
                    fields[field] = value;
                    hit = true;
                    if (!evidence.some(e => e.field === field && e.source === source)) evidence.push({ field, claim: spec.claim, source, locator: 'published translation, whole document', stance: 'supports' });
                }
                if (fix.aliasesAdd) {
                    const aliases = fields.aliases || { ko: [...current.aliases.ko], en: [...current.aliases.en] };
                    for (const [l, list] of Object.entries(fix.aliasesAdd)) for (const a of list) if (!aliases[l].includes(a)) aliases[l].push(a);
                    fields.aliases = aliases;
                    hit = true;
                }
                assert(hit, `${id}: "${fix.from}" not found`);
            }
            fields.evidence = evidence;
            const submitted = await submitTermEdit({ id, action: 'update', fields, sources: [...sources], changedBy: spec.id }, { client });
            const reviewed = await reviewTermSuggestion(submitted.suggestionId, true, `${spec.id}: wording fix`, { client, changedBy: spec.id });
            assert.equal(reviewed.status, 'approved', `${id}: ${reviewed.status}`);
            console.log(`${apply ? 'updated' : 'ok'} ${id} (${Object.keys(fields).filter(k => !['expectedRevision', 'evidence'].includes(k)).join(', ')})`);
        }
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
        console.log(apply ? `committed ${byTerm.size} term(s)` : `dry run: ${byTerm.size} term(s) validated, rolled back`);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await db.end();
    }
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
