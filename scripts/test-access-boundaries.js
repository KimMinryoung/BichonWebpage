// Access boundaries that route-level tests would miss:
// - the admin IP allowlist fails closed in production when it is empty
//   (the CommuLingo admin API authenticates by IP alone), open in dev;
// - CommuLingo's short public cache is never applied to a request carrying a
//   session cookie, whose HTML can hold the account menu and CSRF token;
// - during a Redis outage only account features are refused: which requests
//   need the session store (route-policy requiresSessionStore);
// - Cloudflare's edge may cache only anonymous public HTML answered 200/404
//   without a cookie, never a degraded or session response.
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
const { cachePolicy } = require('../middleware/cache-policy');
const { setNoStore } = require('../utils/http');
function edgeHeader({ path = '/posts', cookies = {}, locals = {}, status = 200, setCookie = false, degrade = false } = {}) {
    const headers = {};
    let written = null;
    const res = {
        locals,
        statusCode: status,
        setHeader: (k, v) => { headers[k.toLowerCase()] = v; },
        getHeader: k => headers[k.toLowerCase()],
        removeHeader: k => { delete headers[k.toLowerCase()]; },
        vary: () => {},
        writeHead: function () { written = { ...headers }; },
    };
    cachePolicy({ method: 'GET', path, cookies }, res, () => {});
    if (setCookie) res.setHeader('Set-Cookie', 'lang=en');
    if (degrade) setNoStore(res);
    res.writeHead(status);
    return written['cloudflare-cdn-cache-control'];
}
assert.match(edgeHeader(), /^public, max-age=60/);
assert.match(edgeHeader({ path: '/commulingo/people/stalin', status: 404 }), /max-age=60/);
for (const [label, opts] of [
    ['session cookie', { cookies: { 'connect.sid': 's:x' } }],
    ['login outage notice', { locals: { loginUnavailable: true } }],
    ['server error', { status: 500 }], ['unavailable', { status: 503 }],
    ['cookie set', { setCookie: true }], ['degraded page', { degrade: true }],
    ['versioned data endpoint', { path: '/commulingo/catalog.json' }], ['admin', { path: '/admin' }],
]) assert.strictEqual(edgeHeader(opts), undefined, `no edge cache: ${label}`);
console.log('access boundaries ok');
