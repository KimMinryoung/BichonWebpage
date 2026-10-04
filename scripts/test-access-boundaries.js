// Two access boundaries that unit-free route tests would miss:
// - the admin IP allowlist fails closed in production when it is empty
//   (the CommuLingo admin API authenticates by IP alone), open in dev;
// - CommuLingo's short public cache is never applied to a request carrying a
//   session cookie, whose HTML can hold the account menu and CSRF token.
const assert = require('node:assert');

function loadAuth(env) {
    for (const mod of ['../config/env', '../middleware/auth']) delete require.cache[require.resolve(mod)];
    Object.assign(process.env, env);
    return require('../middleware/auth');
}
const req = ip => ({ ip });

let auth = loadAuth({ NODE_ENV: 'production', ADMIN_ALLOWED_IPS: ' , ' });
assert.strictEqual(auth.isAllowedIp(req('203.0.113.7')), false);
auth = loadAuth({ NODE_ENV: 'production', ADMIN_ALLOWED_IPS: '127.0.0.1, 100.64.0.2' });
assert.strictEqual(auth.isAllowedIp(req('127.0.0.1')), true);
assert.strictEqual(auth.isAllowedIp(req('::ffff:100.64.0.2')), true);
assert.strictEqual(auth.isAllowedIp(req('203.0.113.7')), false);
auth = loadAuth({ NODE_ENV: 'development', ADMIN_ALLOWED_IPS: '' });
assert.strictEqual(auth.isAllowedIp(req('203.0.113.7')), true);

const { setShortPublicCache } = require('../data/commulingo/page-helpers');
function cacheHeaders(cookies) {
    const headers = {};
    const res = {
        req: { cookies },
        setHeader: (k, v) => { headers[k.toLowerCase()] = v; },
        getHeader: k => headers[k.toLowerCase()],
        vary: v => { headers.vary = headers.vary ? `${headers.vary}, ${v}` : v; },
    };
    setShortPublicCache(res);
    return headers;
}
assert.match(cacheHeaders({})['cache-control'], /^public, max-age=30/);
const signedIn = cacheHeaders({ 'connect.sid': 's:abc' });
assert.match(signedIn['cache-control'], /^private, no-cache/);
assert.match(signedIn.vary, /Cookie/);
console.log('access boundaries ok');
