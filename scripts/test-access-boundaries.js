// Access boundaries that route-level tests would miss:
// - the admin IP allowlist fails closed in production when it is empty
//   (the CommuLingo admin API authenticates by IP alone), open in dev;
// - CommuLingo's short public cache is never applied to a request carrying a
//   session cookie, whose HTML can hold the account menu and CSRF token;
// - during a Redis outage only account features are refused: which requests
//   need the session store (route-policy requiresSessionStore).
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

const { requiresSessionStore } = require('../config/route-policy');
const needs = (method, path) => requiresSessionStore({ method, path });
for (const [method, path] of [
    ['GET', '/auth/login'], ['GET', '/admin'], ['POST', '/admin/webauthn/auth/options'], ['GET', '/writer'],
    ['POST', '/api/proxy/writer/save'], ['GET', '/commulingo/progress'], ['POST', '/commulingo/progress/answers'],
    ['POST', '/ai-diary/3/delete'], ['POST', '/auth/logout'], ['GET', '/commulingo/admin/link-reviews'],
]) assert.strictEqual(needs(method, path), true, `${method} ${path} needs the session store`);
for (const [method, path] of [
    ['GET', '/'], ['GET', '/posts'], ['GET', '/chat'], ['GET', '/commulingo/people/stalin'], ['GET', '/authors'],
    ['POST', '/api/proxy/chat'], ['GET', '/api/proxy/history'], ['POST', '/commulingo/measurement'],
    ['POST', '/commulingo/chat-links'], ['PATCH', '/commulingo/admin/api/docs/x'],
]) assert.strictEqual(needs(method, path), false, `${method} ${path} works without the session store`);
console.log('access boundaries ok');
