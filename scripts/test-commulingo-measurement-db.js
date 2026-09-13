// Integration test against a real DB; all test writes are rolled back.
require('./lib/bootstrap');
const assert = require('node:assert/strict');
const express = require('express');
const crypto = require('node:crypto');
const db = require('../config/database');
(async () => {
    const client = await db.connect();
    await client.query('BEGIN');
    const originalQuery = db.query;
    db.query = (...args) => client.query(...args);
    // Import without starting the production retention timer.
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const router = require('../routes/commulingo-measurement');
    process.env.NODE_ENV = 'production';
    const oldDev = process.env.DEV_MODE;
    process.env.DEV_MODE = '0';
    const app = express();
    app.use(express.json());
    app.use(require('cookie-parser')());
    app.use((req, res, next) => { req.session = req.headers['x-test-admin'] ? { adminUser: {} } : {}; next(); });
    app.use(router);
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const url = 'http://127.0.0.1:' + server.address().port;
    const runId = crypto.randomUUID();
    const base = { runId, eventId: crypto.randomUUID(), kind: 'lesson', contentId: 'capital-v1-ch01-basic', version: 'integration-test', lang: 'ko', mode: 'lesson', event: 'started', step: 0 };
    async function send(body, extra = {}) {
        return new Promise((resolve, reject) => {
            const req = require('node:http').request(url, { method: 'POST', headers: { host: 'cyber-lenin.com', origin: 'https://cyber-lenin.com', 'user-agent': 'Mozilla/5.0 Integration', 'content-type': 'application/json', 'x-commulingo-measurement': '1', ...extra } }, res => {
                res.resume();
                res.on('end', () => resolve(res.statusCode));
            });
            req.on('error', reject);
            req.end(JSON.stringify(body));
        });
    }
    try {
        assert.equal(await send(base, { origin: 'https://evil.example' }), 403);
        assert.equal(await send(base, { cookie: 'commulingo_test=1' }), 204);
        assert.equal(await send(base, { cookie: 'commulingo_measurement_off=1' }), 204);
        assert.equal(await send(base, { 'user-agent': 'HeadlessChrome' }), 204);
        assert.equal(await send(base, { 'x-test-admin': '1' }), 204);
        assert.equal((await client.query('SELECT count(*) FROM commulingo_learning_events WHERE run_id=$1', [runId])).rows[0].count, '0');
        assert.equal(await send({ ...base, contentId: 'not-a-real-lesson' }), 400);
        assert.equal(await send(base), 204);
        assert.equal(await send(base), 204);
        assert.equal(await send({ ...base, eventId: crypto.randomUUID() }), 204);
        const answer = { ...base, eventId: crypto.randomUUID(), event: 'answered', step: 1, correct: true };
        assert.equal(await send(answer), 204);
        assert.equal(await send({ ...answer, eventId: crypto.randomUUID() }), 204);
        assert.equal(await send({ ...answer, eventId: crypto.randomUUID(), version: 'wrong-version', step: 2 }), 204);
        assert.equal(await send({ ...base, eventId: crypto.randomUUID(), event: 'completed', step: 1 }), 204);
        const rows = (await client.query('SELECT event FROM commulingo_learning_events WHERE run_id=$1 ORDER BY event', [runId])).rows;
        assert.deepEqual(rows.map(r => r.event), ['answered', 'completed', 'started']);
        console.log('DB integration: exclusion, cross-origin, content validation, metadata binding and duplicate delivery passed; rolling back.');
    } finally {
        await new Promise(resolve => server.close(resolve));
        db.query = originalQuery;
        await client.query('ROLLBACK');
        client.release();
        process.env.NODE_ENV = oldEnv;
        if (oldDev === undefined) delete process.env.DEV_MODE; else process.env.DEV_MODE = oldDev;
        await db.end();
    }
})().catch(err => { console.error(err); process.exitCode = 1; });
