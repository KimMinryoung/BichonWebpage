// Bearer-token clients of the CommuLingo admin MCP. The server keeps only
// sha256 hashes: COMMULINGO_MCP_CLIENTS="name:scope,scope:hexhash;name:…".
// scripts/mcp-token makes a token and prints its entry.
const { createHash, timingSafeEqual } = require('node:crypto');

const SCOPES = new Set(['read', 'edit', 'ops']);
const NAME = /^[a-z][a-z0-9-]{0,31}$/;
const HASH = /^[0-9a-f]{64}$/;

function parseClients(spec) {
    const clients = [];
    for (const entry of String(spec || '').split(';').map(s => s.trim()).filter(Boolean)) {
        const [name, scopeList, hash] = entry.split(':');
        const scopes = String(scopeList || '').split(',').map(s => s.trim()).filter(Boolean);
        if (!NAME.test(name || '') || !HASH.test(hash || '') || !scopes.length || scopes.some(s => !SCOPES.has(s))) {
            throw new Error(`COMMULINGO_MCP_CLIENTS: invalid entry for "${name || '?'}"`);
        }
        if (clients.some(c => c.name === name)) throw new Error(`COMMULINGO_MCP_CLIENTS: duplicate client "${name}"`);
        clients.push({ name, scopes: new Set(scopes), hash: Buffer.from(hash, 'hex') });
    }
    return clients;
}

function hashToken(token) {
    return createHash('sha256').update(token, 'utf8').digest();
}

// The client whose hash matches the request's bearer token, or null. Every
// entry is compared so the timing does not reveal which one matched.
function authenticate(clients, authorization) {
    const match = /^Bearer ([A-Za-z0-9_-]{32,128})$/.exec(String(authorization || ''));
    if (!match) return null;
    const digest = hashToken(match[1]);
    let found = null;
    for (const client of clients) {
        if (timingSafeEqual(digest, client.hash) && !found) found = client;
    }
    return found;
}

module.exports = { parseClients, hashToken, authenticate, SCOPES };
