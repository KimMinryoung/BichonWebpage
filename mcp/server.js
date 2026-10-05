// CommuLingo admin MCP: stateless Streamable HTTP on an internal listener
// (dev_docs/commulingo-admin-mcp.md). One JSON-RPC message per POST, one JSON
// response; no SSE stream and no session id.
const { createHash } = require('node:crypto');
const express = require('express');
const { authenticate } = require('./auth');
const { validateArguments } = require('./schema');

const PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const SERVER_INFO = { name: 'commulingo-admin', version: '1.0.0' };
const INSTRUCTIONS = 'CommuLingo (cyber-lenin.com) admin data: people, terms, history events, offices, '
    + 'suggestions, curation gaps, link reviews and reference documents. Tools are scoped per client token.';
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

function rpcError(id, code, message) {
    return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

function allowedTools(tools, client) {
    return tools.filter(tool => client.scopes.has(tool.scope));
}

function argsHash(args) {
    return createHash('sha256').update(JSON.stringify(args ?? {})).digest('hex').slice(0, 16);
}

function audit(log, entry) {
    log(`[mcp-audit] ${JSON.stringify({ ts: new Date().toISOString(), ...entry })}`);
}

async function callTool(tools, client, params, log) {
    const name = params && params.name;
    const tool = allowedTools(tools, client).find(t => t.name === name);
    const started = Date.now();
    const entry = { client: client.name, tool: String(name || '').slice(0, 80), args: argsHash(params && params.arguments) };
    if (!tool) {
        audit(log, { ...entry, outcome: 'denied', ms: 0 });
        return { error: { code: -32602, message: `unknown tool: ${entry.tool}` } };
    }
    try {
        const args = validateArguments(tool.inputSchema, params.arguments);
        const value = await tool.handler(args, { client: client.name });
        audit(log, { ...entry, outcome: 'ok', ms: Date.now() - started });
        return { result: { content: [{ type: 'text', text: JSON.stringify(value ?? null) }],
            structuredContent: value && typeof value === 'object' && !Array.isArray(value) ? value : { value } } };
    } catch (err) {
        const known = err.code === 'invalid_arguments' || (err.status && err.status < 500);
        if (!known) console.error(`[mcp] ${entry.tool} failed:`, err);
        audit(log, { ...entry, outcome: known ? 'rejected' : 'error', ms: Date.now() - started });
        return { result: { content: [{ type: 'text', text: known ? err.message : 'internal error' }], isError: true } };
    }
}

async function handleMessage(message, client, tools, log) {
    if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
        return rpcError(message && message.id, -32600, 'invalid request');
    }
    const { id, method, params } = message;
    if (id === undefined) return null; // notification (initialized, cancelled…)
    if (method === 'initialize') {
        const requested = params && params.protocolVersion;
        return { jsonrpc: '2.0', id, result: {
            protocolVersion: PROTOCOL_VERSIONS.includes(requested) ? requested : PROTOCOL_VERSIONS[0],
            capabilities: { tools: { listChanged: false } },
            serverInfo: SERVER_INFO,
            instructions: INSTRUCTIONS,
        } };
    }
    if (method === 'ping') return { jsonrpc: '2.0', id, result: {} };
    if (method === 'tools/list') {
        return { jsonrpc: '2.0', id, result: { tools: allowedTools(tools, client).map(tool => ({
            name: tool.name, description: tool.description, inputSchema: tool.inputSchema,
        })) } };
    }
    if (method === 'tools/call') {
        const outcome = await callTool(tools, client, params, log);
        return outcome.error ? rpcError(id, outcome.error.code, outcome.error.message) : { jsonrpc: '2.0', id, result: outcome.result };
    }
    return rpcError(id, -32601, `method not found: ${method}`);
}

function createMcpApp({ clients, tools, log = console.log }) {
    const app = express();
    app.disable('x-powered-by');
    app.use('/mcp', (req, res, next) => {
        const origin = req.get('origin');
        if (origin && !LOCAL_ORIGIN.test(origin)) return res.status(403).json(rpcError(null, -32000, 'origin not allowed'));
        const client = authenticate(clients, req.get('authorization'));
        if (!client) return res.status(401).json(rpcError(null, -32001, 'unauthorized'));
        req.mcpClient = client;
        next();
    });
    app.post('/mcp', express.json({ limit: '1mb' }), async (req, res) => {
        if (Array.isArray(req.body)) return res.status(400).json(rpcError(null, -32600, 'batch requests are not supported'));
        const response = await handleMessage(req.body, req.mcpClient, tools, log);
        if (!response) return res.status(202).end();
        res.setHeader('Cache-Control', 'no-store');
        res.json(response);
    });
    app.all('/mcp', (req, res) => res.set('Allow', 'POST').status(405).end());
    app.use((req, res) => res.status(404).end());
    // Malformed JSON bodies land here from express.json.
    app.use((err, req, res, next) => res.status(err.status || 400).json(rpcError(null, -32700, 'parse error')));
    return app;
}

module.exports = { createMcpApp, handleMessage, PROTOCOL_VERSIONS };
