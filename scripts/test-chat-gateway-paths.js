// The chat gateway's file closure (scripts/lib/chat-gateway-paths.js) decides
// when scripts/deploy restarts it. It must cover the proxy stack and stay
// clear of the site's page rendering, whose frequent edits (strings, icons)
// would otherwise restart the gateway on most deploys.
const assert = require('node:assert');
const { gatewayFiles } = require('./lib/chat-gateway-paths');

const files = new Set(gatewayFiles());
for (const file of ['chat-gateway.js', 'config/chat-proxy.js', 'config/proxies.js', 'config/session.js',
    'middleware/chat-identity.js', 'routes/chat-history.js', 'package-lock.json']) {
    assert.ok(files.has(file), `closure includes ${file}`);
}
for (const file of ['server.js', 'utils/error-page.js', 'config/strings.js', 'data/icons.js', 'middleware/auth.js']) {
    assert.ok(!files.has(file), `closure leaves out ${file}`);
}
console.log(`chat gateway closure: ${files.size} files`);
