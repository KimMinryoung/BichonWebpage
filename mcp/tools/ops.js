// `ops` scope: operator diagnostics. Never deploys, migrates or purges.
const fs = require('fs');
const path = require('path');
const { str, int, arr, object } = require('../schema');

const ROOT = path.join(__dirname, '..', '..');
const AUDIT_NAME = /^audit-[a-z0-9-]+$/;
const AUDIT_ARG = /^[A-Za-z0-9_.,:=@/+-]{1,200}$/;
const READ_SQL = /^\s*(select|with|explain|table|values)\b/i;

function badRequest(message) {
    return Object.assign(new Error(message), { status: 400 });
}

function cut(text, maxChars) {
    return text.length > maxChars ? `${text.slice(0, maxChars)}…[+${text.length - maxChars} chars]` : text;
}

function auditScripts() {
    return fs.readdirSync(path.join(ROOT, 'scripts')).filter(name => name.endsWith('.js') && AUDIT_NAME.test(name.slice(0, -3)))
        .map(name => name.slice(0, -3)).sort();
}

module.exports = [
    {
        scope: 'ops',
        name: 'service_status',
        description: 'Running frontend revision, uptime, Postgres/Redis readiness and memory.',
        inputSchema: object({}),
        async handler() {
            const { readiness } = require('../../utils/readiness');
            const memory = process.memoryUsage();
            return {
                revision: process.env.GIT_SHA || null,
                nodeEnv: process.env.NODE_ENV || 'development',
                uptimeSeconds: Math.round(process.uptime()),
                ready: await readiness(),
                memoryMb: { rss: Math.round(memory.rss / 1048576), heapUsed: Math.round(memory.heapUsed / 1048576) },
            };
        },
    },
    {
        scope: 'ops',
        name: 'sql_read',
        description: 'One read-only SQL statement against the production database (SELECT/WITH/EXPLAIN), for checks no typed read tool '
            + 'covers. Runs as a single prepared statement in a READ ONLY transaction on its own connection, 10 s timeout, rows capped. '
            + 'Prefer the typed tools (person_get, registry_get, aliases_lookup, dataset_rows); this never writes.',
        inputSchema: object({
            sql: str('One SELECT/WITH/EXPLAIN statement; $1… placeholders for params', { maxLength: 20000 }),
            params: arr('Placeholder values', 50),
            limit: int('Max rows returned (default 200)', 1, 5000, { default: 200 }),
        }, ['sql']),
        async handler({ sql, params = [], limit }) {
            if (!READ_SQL.test(sql)) throw badRequest('sql must start with SELECT, WITH, EXPLAIN, TABLE or VALUES');
            if (params.some(value => value !== null && typeof value === 'object')) throw badRequest('params must be scalars');
            const { Client } = require('pg');
            // A connection of its own, closed afterwards, so nothing the statement
            // leaves behind (a session advisory lock, a setting) reaches the pool.
            const client = new Client(require('../../config/database').options);
            await client.connect();
            try {
                await client.query("BEGIN TRANSACTION READ ONLY");
                await client.query("SET LOCAL statement_timeout = '10s'");
                // A named query is a prepared statement: exactly one statement, so
                // "...; COMMIT; DELETE ..." cannot ride along.
                const name = `mcp-sql-read-${require('node:crypto').createHash('sha256').update(sql).digest('hex').slice(0, 16)}`;
                const result = await client.query({ name, text: sql, values: params });
                await client.query('ROLLBACK');
                const rows = result.rows || [];
                return { rowCount: rows.length, truncated: rows.length > limit, fields: (result.fields || []).map(f => f.name), rows: rows.slice(0, limit) };
            } catch (err) {
                err.status = err.status || 400;
                throw err;
            } finally {
                await client.end().catch(() => {});
            }
        },
    },
    {
        scope: 'ops',
        name: 'audit_run',
        description: 'Run one of the deployed scripts/audit-*.js checks in the app container (the deployed release: a script added or '
            + 'changed since the last deploy is not there yet) and return its exit code and output. name without .js; omit it to list them. '
            + 'Example: audit-link-fires with args [ko].',
        inputSchema: object({
            name: str('Audit script name, e.g. audit-person-card-fields'),
            args: arr('Arguments (letters, digits, _ . , : = @ / + -)', 20),
            maxChars: int('Cut stdout/stderr at this length (default 60000)', 1000, 2000000, { default: 60000 }),
            timeoutSeconds: int('Kill after (default 300)', 10, 900, { default: 300 }),
        }),
        async handler({ name, args = [], maxChars, timeoutSeconds }) {
            const available = auditScripts();
            if (!name) return { available };
            if (!available.includes(name)) throw badRequest(`unknown audit: ${name}; available: ${available.join(', ')}`);
            if (!args.every(arg => typeof arg === 'string' && AUDIT_ARG.test(arg))) throw badRequest('args must be plain tokens');
            const { execFile } = require('child_process');
            const started = Date.now();
            const outcome = await new Promise(resolve => {
                execFile(process.execPath, [path.join(ROOT, 'scripts', `${name}.js`), ...args],
                    { cwd: ROOT, timeout: timeoutSeconds * 1000, maxBuffer: 64 * 1024 * 1024, env: process.env },
                    (err, stdout, stderr) => resolve({ err, stdout: String(stdout || ''), stderr: String(stderr || '') }));
            });
            return {
                name, args,
                exitCode: outcome.err ? (Number.isInteger(outcome.err.code) ? outcome.err.code : null) : 0,
                killed: !!(outcome.err && outcome.err.killed),
                seconds: Math.round((Date.now() - started) / 1000),
                stdout: cut(outcome.stdout, maxChars),
                stderr: cut(outcome.stderr, maxChars),
            };
        },
    },
    {
        scope: 'ops',
        name: 'stores_refresh',
        description: 'Reload the CommuLingo stores of the serving process now (people, terms, events, documents, data documents, link reviews, '
            + 'blocklist) instead of waiting up to a minute for their refresh, so a check right after a write sees it. The public URL can still '
            + 'serve Cloudflare\'s copy for 60 s; check through 127.0.0.1:3000 or ?verify=<timestamp>.',
        inputSchema: object({}),
        async handler() {
            const steps = {
                people: () => require('../../data/commulingo/people-store').loadCommuLingoPeople({ fresh: true }),
                terms: () => require('../../data/commulingo/terms-store').loadCommuLingoTerms({ fresh: true }),
                events: () => require('../../data/commulingo/history-events-store').loadCommuLingoHistoryEvents({ fresh: true }),
                docs: () => require('../../data/commulingo/docs-store').refreshCommuLingoDocs(),
                dataDocuments: () => require('../../data/commulingo/data-documents').refreshDataDocuments(),
                linkReviews: () => require('../../data/commulingo/link-reviews-store').refreshLinkReviews(),
                blocklist: () => require('../../data/commulingo/link-blocklist').refreshLinkBlocklist(),
            };
            const result = {};
            for (const [label, step] of Object.entries(steps)) {
                try {
                    await step();
                    result[label] = 'ok';
                } catch (err) {
                    result[label] = `failed: ${err.message}`;
                }
            }
            return result;
        },
    },
];
