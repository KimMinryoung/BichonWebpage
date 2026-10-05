// Each app revision has its own compatible CSS pointer. A response captures
// it once, including responses retrieved from HTML/render caches.
const fs = require('node:fs');
const path = require('node:path');
const { DEV_MODE } = require('./env');
const { validManifest, verifyRelease } = require('../scripts/lib/css-release');
function createCssReleases(root, appRevision) {
    let lastGood = null;
    function snapshot() {
        try {
            const manifest = JSON.parse(fs.readFileSync(path.join(root, 'active', `${appRevision}.json`), 'utf8'));
            if (!validManifest(manifest, appRevision)) throw Error('Invalid CSS manifest');
            if (!lastGood || JSON.stringify(manifest) !== JSON.stringify(lastGood)) verifyRelease(root, manifest);
            lastGood = manifest;
        } catch { /* Atomic publication failures keep the last known good release. */ }
        return lastGood;
    }
    function rewrite(html, manifest) {
        if (!manifest) return html;
        return html.replace(/(["'])\/(?:assets\/[a-f0-9]{32}\/)?(css\/[\w./-]+\.css)(?:\?[^"']*)?\1/g,
            (match, quote, file) => manifest.files[file]
                ? `${quote}/assets/${manifest.release}/${file}${quote}` : match);
    }
    return { snapshot, rewrite };
}
const cssReleases = createCssReleases(process.env.CSS_RELEASE_DIR || '/app/css-releases', process.env.GIT_SHA || '');
module.exports = { createCssReleases, cssReleases, cssReleaseEnabled: !DEV_MODE && Boolean(process.env.CSS_RELEASE_DIR) };
