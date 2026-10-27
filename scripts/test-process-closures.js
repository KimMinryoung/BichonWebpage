// The file closures of the separate processes (scripts/lib/require-closure.js)
// decide which containers scripts/deploy replaces. The chat gateway must cover
// the proxy stack and stay clear of the site's page rendering, whose frequent
// edits (strings, icons) would otherwise restart it on most deploys. The
// website must stay clear of the editing code, so that a change to it
// deploys the admin process alone.
const assert = require('node:assert');
const { entryFiles, adminOnlyFiles } = require('./lib/require-closure');

const gateway = new Set(entryFiles('gateway'));
for (const file of ['chat-gateway.js', 'config/chat-proxy.js', 'config/proxies.js', 'config/session.js',
    'middleware/chat-identity.js', 'routes/chat-history.js', 'package-lock.json']) {
    assert.ok(gateway.has(file), `gateway closure includes ${file}`);
}
for (const file of ['server.js', 'utils/error-page.js', 'config/strings.js', 'data/icons.js', 'middleware/auth.js']) {
    assert.ok(!gateway.has(file), `gateway closure leaves out ${file}`);
}

const web = new Set(entryFiles('web'));
const admin = new Set(entryFiles('admin'));
const editing = ['data/commulingo/person-editorial-service.js', 'data/commulingo/term-editorial-service.js',
    'data/commulingo/content-editorial-service.js', 'data/commulingo/people-admin-store.js', 'data/commulingo/registry-edits.js',
    'data/commulingo/link-review-service.js', 'services/commulingo-pipeline/tick.js', 'mcp/tools/edit.js'];
for (const file of editing) {
    assert.ok(admin.has(file), `admin closure includes ${file}`);
    assert.ok(!web.has(file), `website closure leaves out ${file}`);
}
assert.ok(web.has('data/commulingo/people-store.js') && admin.has('data/commulingo/people-store.js'), 'the read stores are shared');
assert.deepEqual(adminOnlyFiles([...editing, 'data/commulingo/people-store.js', 'scripts/audit-link-fires.js',
    'data/commulingo/person-editorial-contract.json', 'views/admin/dashboard.ejs']), [...editing, 'scripts/audit-link-fires.js']);
console.log(`closures: gateway ${gateway.size}, admin ${admin.size}, website ${web.size} files`);
