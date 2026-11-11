// Browser scripts are linked as /js/<file>.js?v=<assetVersion> (the deployed
// commit), so every deploy changed every script's address and every visitor
// downloaded all of them again. HTML responses get each script's own content
// hash instead: an unchanged script keeps its address, and its immutable
// one-year cache (config/static-assets.js), across deploys.
//
// The code release under /app is read-only, so a file is hashed once per
// process. A missing file keeps the commit version.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function createJsVersions(publicDir, assetVersion) {
    const hashes = new Map();
    function versionOf(file) {
        if (!hashes.has(file)) {
            let hash = null;
            try {
                hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(publicDir, file))).digest('hex').slice(0, 16);
            } catch { /* not a file of this release */ }
            hashes.set(file, hash);
        }
        return hashes.get(file);
    }
    const escaped = String(assetVersion).replace(/[^\w]/g, '\\$&');
    const pattern = new RegExp(`/(js/[\\w./-]+\\.js)\\?v=${escaped}(?![\\w-])`, 'g');
    function rewrite(html) {
        if (!assetVersion || !html.includes('.js?v=')) return html;
        return html.replace(pattern, (match, file) => {
            if (file.includes('..')) return match;
            const hash = versionOf(file);
            return hash ? `/${file}?v=${hash}` : match;
        });
    }
    return { rewrite, versionOf };
}

module.exports = { createJsVersions };
