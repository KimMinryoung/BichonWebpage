// Private stdin/stdout RPC used by the local Python tools. No shell payloads,
// public HTTP endpoint, or DB credentials in process arguments.
console.info = (...args) => console.error(...args);
const fs = require('node:fs');
const service = require('../data/commulingo/person-editorial-service');
const db = require('../config/database');
(async () => {
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    let result;
    if (request.command === 'read') result = await service.readPersonEditorial(request.id);
    else if (request.command === 'submit') result = await service.submitPersonEdit(request);
    else if (request.command === 'review') result = await service.reviewPersonSuggestion(request.suggestionId, request.approve, request.note, { changedBy: request.changedBy });
    else if (request.command === 'enrichment') result = await service.saveEnrichment(request);
    else throw new Error('unsupported command');
    process.stdout.write(JSON.stringify({ ok: true, result }));
})().catch(error => {
    process.stdout.write(JSON.stringify({ ok: false, error: error.message, status: error.status || 500,
        code: error.code, currentRevision: error.currentRevision }));
    process.exitCode = 1;
}).finally(() => db.end());
