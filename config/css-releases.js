// Each app revision has its own compatible CSS pointer. A response captures
// it once, including responses retrieved from HTML/render caches.
const fs = require('node:fs');
const path = require('node:path');
const { DEV_MODE } = require('./env');
const { validManifest, verifyRelease, assetId } = require('../scripts/lib/css-release');
function createCssReleases(root, appRevision) {
    const pointer = path.join(root, 'active', `${appRevision}.json`);
    let lastGood = null;
    let lastKey = '';
    // Called for every HTML response, so the pointer is only re-read and its
    // release re-verified when the file changes (publication renames a new
    // file into place). A failed read leaves lastKey alone so it is retried.
    function snapshot() {
        try {
            const stat = fs.statSync(pointer);
            const key = `${stat.ino}:${stat.mtimeMs}:${stat.size}`;
            if (key === lastKey) return lastGood;
            const manifest = JSON.parse(fs.readFileSync(pointer, 'utf8'));
            if (!validManifest(manifest, appRevision)) throw Error('Invalid CSS manifest');
            if (!lastGood || JSON.stringify(manifest) !== JSON.stringify(lastGood)) verifyRelease(root, manifest);
            lastGood = manifest;
            lastKey = key;
        } catch { /* Atomic publication failures keep the last known good release. */ }
        return lastGood;
    }
    function rewrite(html, manifest) {
        if (!manifest) return html;
        // Fonts too: a font preload must name the URL the released CSS loads,
        // or the browser downloads the same file twice.
        return html.replace(/(["'])\/(?:assets\/[a-f0-9]{32}\/)?((?:css\/[\w./-]+\.css)|(?:fonts\/[\w./-]+\.woff2))(?:\?[^"']*)?\1/g,
            (match, quote, file) => manifest.files[file]
                ? `${quote}/assets/${assetId(manifest, file)}/${file}${quote}` : match);
    }
    return { snapshot, rewrite };
}
const cssReleases = createCssReleases(process.env.CSS_RELEASE_DIR || '/app/css-releases', process.env.GIT_SHA || '');
module.exports = { createCssReleases, cssReleases, cssReleaseEnabled: !DEV_MODE && Boolean(process.env.CSS_RELEASE_DIR) };
