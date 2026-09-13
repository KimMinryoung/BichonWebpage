const assert = require('node:assert/strict');
const { excluded, sameOrigin, normalize } = require('../services/commulingo-measurement');
const base = () => ({ headers: { host: 'cyber-lenin.com', origin: 'https://cyber-lenin.com', 'user-agent': 'Mozilla/5.0 Chrome/152', 'x-commulingo-measurement': '1', 'sec-fetch-site': 'same-origin' }, cookies: {}, session: {}, is: type => type === 'application/json' });
const env = { NODE_ENV: 'production' };
assert.equal(excluded(base(), env), false);
for (const field of ['isAuthenticated', 'adminUser']) { const req = base(); req.session[field] = true; assert.equal(excluded(req, env), true); }
for (const cookie of ['commulingo_test', 'commulingo_measurement_off']) { const req = base(); req.cookies[cookie] = '1'; assert.equal(excluded(req, env), true); }
for (const ua of ['Googlebot', 'HeadlessChrome', 'curl/8', 'python-requests', 'Playwright']) { const req = base(); req.headers['user-agent'] = ua; assert.equal(excluded(req, env), true); }
assert.equal(excluded(base(), { ...env, DEV_MODE: '1' }), true);
assert.equal(excluded(base(), { NODE_ENV: 'development' }), true);
assert.equal(sameOrigin(base()), true);
for (const origin of ['', 'https://evil.example', 'null', 'http://cyber-lenin.com']) { const req = base(); req.headers.origin = origin; assert.equal(sameOrigin(req), false); }
const cross = base(); cross.headers['sec-fetch-site'] = 'cross-site'; assert.equal(sameOrigin(cross), false);
const id = '12345678-1234-4234-8234-123456789abc';
const event = { runId: id, eventId: id, kind: 'lesson', contentId: 'capital-v1-ch01-basic', version: 'v1', lang: 'ko', mode: 'lesson', event: 'answered', step: 1, correct: false };
assert.ok(normalize(event));
for (const patch of [{ runId: '../etc' }, { step: -1 }, { step: 0 }, { step: 501 }, { correct: 'yes' }, { kind: 'unknown' }, { contentId: '../../x' }, { event: 'pageview' }, { version: 'x'.repeat(101) }]) assert.equal(normalize({ ...event, ...patch }), null);
assert.equal(normalize({ ...event, email: 'private@example.com' }).email, undefined);
console.log('measurement exclusion, origin, validation passed');
