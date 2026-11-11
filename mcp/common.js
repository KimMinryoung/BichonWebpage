// Helpers every MCP tool module shares: request errors, the actor a write is
// recorded as, and the lazily loaded database (loading the tool list needs no DB).
const { str } = require('./schema');

function badRequest(message, status = 400) {
    return Object.assign(new Error(message), { status });
}

function notFound(what, id) {
    return badRequest(`${what} not found: ${id}`, 404);
}

// The actor (changedBy) is the caller's own label, kept verbatim because the
// editorial queues key on it (e.g. suggested_by='commulingo-pipeline').
const ACTOR = /^[A-Za-z0-9_.:@/-]{1,120}$/;
const changedBy = str('Actor recorded on the edit (default mcp:<client>)', { maxLength: 120 });

function actorOf(given, client) {
    const actor = given || `mcp:${client}`;
    if (!ACTOR.test(actor)) throw badRequest('changedBy must be 1–120 of A-Z a-z 0-9 _ . : @ / -');
    return actor;
}

function db() {
    return require('../config/database');
}

module.exports = { badRequest, notFound, actorOf, changedBy, db };
