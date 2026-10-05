#!/usr/bin/env node
// CommuLingo admin MCP protocol, auth, origin, scope and argument checks.
// Runs the HTTP app on an ephemeral port with stub tools; no DB.
const assert = require('node:assert/strict');
const { createMcpApp } = require('../mcp/server');
const { parseClients, hashToken } = require('../mcp/auth');
const { object, str, int, obj } = require('../mcp/schema');
const { tools: realTools } = require('../mcp');

const READ_TOKEN = 'r'.repeat(43), OPS_TOKEN = 'o'.repeat(43);
const clients = parseClients([
    `reader:read:${hashToken(READ_TOKEN).toString('hex')}`,
    `operator:read,edit,ops:${hashToken(OPS_TOKEN).toString('hex')}`,
].join(';'));
const logs = [], audited = [];
const tools = [
    { scope: 'read', name: 'echo', description: 'echo', inputSchema: object({ q: str('q'), n: int('n', 1, 5, { default: 2 }) }, ['q']),
        handler: async args => ({ args }) },
    { scope: 'read', name: 'missing', description: 'missing', inputSchema: object({}),
        handler: async () => { const err = new Error('nope not found'); err.status = 404; throw err; } },
    { scope: 'read', name: 'boom', description: 'boom', inputSchema: object({}),
        handler: async () => { throw new Error('secret internals'); } },
    { scope: 'edit', name: 'write', description: 'write', inputSchema: object({ request: obj('r') }, ['request']),
        audit: args => ({ command: 'submit', targetType: 'person', targetId: args.request.id, actor: 'tester' }),
        summarize: value => ({ status: value.status }),
        handler: async ({ request }) => {
            if (request.conflict) throw Object.assign(new Error('stale'), { status: 409, code: 'revision_conflict', currentRevision: 'v1-x' });
            return { status: 'approved', value: { big: 'payload' } };
        } },
    { scope: 'ops', name: 'status', description: 'status', inputSchema: object({}), handler: async () => ({ ok: true }) },
];

(async () => {
    const realError = console.error;
    console.error = () => {};
    const server = createMcpApp({ clients, tools, log: line => logs.push(line), recordAudit: async row => audited.push(row) }).listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}/mcp`;
    let id = 0;
    const post = (token, body, headers = {}) => fetch(url, { method: 'POST',
        headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
        body: typeof body === 'string' ? body : JSON.stringify(body) });
    const rpc = async (token, method, params) => (await post(token, { jsonrpc: '2.0', id: ++id, method, params })).json();
    try {
        // Auth and origin.
        assert.equal((await post(null, { jsonrpc: '2.0', id: 1, method: 'ping' })).status, 401);
        assert.equal((await post('x'.repeat(43), { jsonrpc: '2.0', id: 1, method: 'ping' })).status, 401);
        assert.equal((await post(READ_TOKEN, { jsonrpc: '2.0', id: 1, method: 'ping' }, { origin: 'https://evil.example' })).status, 403);
        assert.equal((await post(READ_TOKEN, { jsonrpc: '2.0', id: 1, method: 'ping' }, { origin: 'http://localhost:6274' })).status, 200);
        assert.equal((await fetch(url, { headers: { authorization: `Bearer ${READ_TOKEN}` } })).status, 405);

        // Lifecycle.
        const init = await rpc(READ_TOKEN, 'initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 't', version: '0' } });
        assert.equal(init.result.protocolVersion, '2025-03-26');
        assert.ok(init.result.capabilities.tools);
        assert.equal((await rpc(READ_TOKEN, 'initialize', { protocolVersion: '1999-01-01' })).result.protocolVersion, '2025-06-18');
        assert.equal((await post(READ_TOKEN, { jsonrpc: '2.0', method: 'notifications/initialized' })).status, 202);
        assert.equal((await rpc(READ_TOKEN, 'nope')).error.code, -32601);
        assert.equal((await post(READ_TOKEN, '{bad')).status, 400);
        assert.equal((await post(READ_TOKEN, [{ jsonrpc: '2.0', id: 1, method: 'ping' }])).status, 400);

        // Scope filtering.
        const readerTools = (await rpc(READ_TOKEN, 'tools/list')).result.tools.map(t => t.name);
        assert.deepEqual(readerTools, ['echo', 'missing', 'boom']);
        const operatorTools = (await rpc(OPS_TOKEN, 'tools/list')).result.tools.map(t => t.name);
        assert.ok(operatorTools.includes('status') && operatorTools.includes('write'));
        assert.equal((await rpc(READ_TOKEN, 'tools/call', { name: 'status', arguments: {} })).error.code, -32602);
        assert.deepEqual((await rpc(OPS_TOKEN, 'tools/call', { name: 'status', arguments: {} })).result.structuredContent, { ok: true });

        // Arguments and errors.
        const echo = await rpc(READ_TOKEN, 'tools/call', { name: 'echo', arguments: { q: 'x' } });
        assert.deepEqual(echo.result.structuredContent, { args: { q: 'x', n: 2 } });
        assert.deepEqual(JSON.parse(echo.result.content[0].text), { args: { q: 'x', n: 2 } });
        for (const bad of [{}, { q: 1 }, { q: 'x', n: 9 }, { q: 'x', n: 1.5 }, { q: 'x', extra: 1 }]) {
            const res = await rpc(READ_TOKEN, 'tools/call', { name: 'echo', arguments: bad });
            assert.equal(res.result.isError, true, JSON.stringify(bad));
        }
        assert.match((await rpc(READ_TOKEN, 'tools/call', { name: 'missing', arguments: {} })).result.content[0].text, /not found/);
        const boom = await rpc(READ_TOKEN, 'tools/call', { name: 'boom', arguments: {} });
        assert.deepEqual(boom.result.structuredContent, { error: 'secret internals', status: 500 });

        // Edit scope: hidden from read clients, DB audit rows with target/actor and a result summary only.
        assert.equal((await rpc(READ_TOKEN, 'tools/call', { name: 'write', arguments: { request: { id: 'a' } } })).error.code, -32602);
        const wrote = await rpc(OPS_TOKEN, 'tools/call', { name: 'write', arguments: { request: { id: 'lenin' } } });
        assert.equal(wrote.result.structuredContent.status, 'approved');
        const conflict = await rpc(OPS_TOKEN, 'tools/call', { name: 'write', arguments: { request: { id: 'lenin', conflict: true } } });
        assert.deepEqual(conflict.result.structuredContent, { error: 'stale', status: 409, code: 'revision_conflict', currentRevision: 'v1-x' });
        assert.equal((await rpc(OPS_TOKEN, 'tools/call', { name: 'write', arguments: { request: [] } })).result.isError, true);
        assert.equal(audited.length, 2, 'invalid arguments never reach the DB audit');
        assert.deepEqual(audited.map(a => [a.client, a.tool, a.targetId, a.actor, a.outcome]),
            [['operator', 'write', 'lenin', 'tester', 'ok'], ['operator', 'write', 'lenin', 'tester', 'rejected']]);
        assert.deepEqual(audited[0].result, { status: 'approved' });
        assert.equal(audited[1].error, 'stale');

        // Audit lines carry client, tool, outcome and an argument hash, never the arguments.
        const audits = logs.map(line => JSON.parse(line.replace(/^\[mcp-audit\] /, '')));
        assert.ok(audits.some(a => a.client === 'reader' && a.tool === 'status' && a.outcome === 'denied'));
        assert.ok(audits.some(a => a.tool === 'boom' && a.outcome === 'error'));
        assert.ok(audits.every(a => /^[0-9a-f]{16}$/.test(a.args)));
        assert.ok(!logs.join('\n').includes('"q"'));
    } finally {
        server.close();
        console.error = realError;
    }

    // Client config parsing.
    assert.deepEqual(parseClients(''), []);
    for (const bad of ['Bad:read:' + '0'.repeat(64), 'a:write:' + '0'.repeat(64), 'a:read:abc', `a:read:${'0'.repeat(64)};a:ops:${'1'.repeat(64)}`]) {
        assert.throws(() => parseClients(bad), /COMMULINGO_MCP_CLIENTS/, bad);
    }

    // The real tool set: unique names, known scopes, schemas the validator understands.
    const names = new Set();
    for (const tool of realTools) {
        assert.ok(!names.has(tool.name), tool.name);
        names.add(tool.name);
        assert.ok(['read', 'edit', 'ops'].includes(tool.scope), tool.name);
        assert.equal(tool.inputSchema.type, 'object');
        assert.equal(tool.inputSchema.additionalProperties, false);
        for (const [key, spec] of Object.entries(tool.inputSchema.properties)) {
            assert.ok(['string', 'integer', 'boolean', 'object', 'array'].includes(spec.type), `${tool.name}.${key}`);
            assert.ok(spec.description, `${tool.name}.${key}`);
        }
        assert.equal(typeof tool.handler, 'function');
        if (tool.scope === 'edit') assert.equal(typeof tool.audit, 'function', `${tool.name} names its audit target`);
    }
    console.log(`commulingo mcp ok (${realTools.length} tools)`);
})().catch(err => {
    console.error(err);
    process.exit(1);
});
