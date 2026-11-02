const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const { buildRelease, verifyRelease, atomicJson, safeFile, assetId } = require('../../scripts/lib/css-release');
const { createCssReleases } = require('../../config/css-releases');
const { localizeHtmlLinks } = require('../../utils/seo');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'css-release-test-'));
const app = 'a'.repeat(40);
async function main() {
try {
    const root = path.join(scratch, 'releases');
    const publicDir = path.join(scratch, 'public');
    fs.mkdirSync(root);
    fs.mkdirSync(path.join(publicDir, 'css'), { recursive: true });
    fs.mkdirSync(path.join(publicDir, 'fonts'));
    fs.writeFileSync(path.join(publicDir, 'fonts', 'test.woff2'), 'font-v1');
    fs.writeFileSync(path.join(publicDir, 'css', 'import.css'), '.import{color:red}');
    fs.writeFileSync(path.join(publicDir, 'css', 'main.css'), '@import "import.css"; @font-face{src:url(../fonts/test.woff2)} .a{fill:url(#pattern)}');
    const first = buildRelease(publicDir, root, app, 'b'.repeat(40));
    const pointer = path.join(root, 'active', `${app}.json`);
    atomicJson(pointer, first);
    const runtime = createCssReleases(root, app);
    const captured = runtime.snapshot();
    fs.appendFileSync(path.join(publicDir, 'css', 'main.css'), '.new{color:green}');
    const second = buildRelease(publicDir, root, app, 'c'.repeat(40));
    assert.notEqual(first.release, second.release);
    atomicJson(pointer, second);
    assert.equal(runtime.snapshot().release, second.release);
    const html = '<link href="/css/main.css?v=old"><link rel="preload" href="/css/import.css?v=old"><link rel="preload" href="/fonts/test.woff2" as="font"><script src="/js/common.js?v=old"></script>';
    const url = (m, file) => `/assets/${assetId(m, file)}/${file}`;
    const stored = (m, file) => fs.readFileSync(path.join(root, 'content', assetId(m, file), file), 'utf8');
    const oldHtml = runtime.rewrite(html, captured);
    assert(oldHtml.includes(url(first, 'css/main.css')));
    assert(runtime.rewrite(oldHtml, second).includes(url(second, 'css/main.css')));
    assert(oldHtml.includes(url(first, 'fonts/test.woff2')));
    assert(oldHtml.includes('/js/common.js?v=old'));
    assert.equal(localizeHtmlLinks(oldHtml, 'en'), oldHtml);
    // Each file's URL is its own content ID: only the changed CSS moves, the
    // font and the untouched import keep theirs (and browser caches).
    assert.equal(assetId(first, 'fonts/test.woff2'), crypto.createHash('sha256').update('font-v1').digest('hex').slice(0, 32));
    assert.equal(url(second, 'fonts/test.woff2'), url(first, 'fonts/test.woff2'));
    assert.equal(url(second, 'css/import.css'), url(first, 'css/import.css'));
    assert.notEqual(url(second, 'css/main.css'), url(first, 'css/main.css'));
    // A new app revision over the same files is a new release with every URL
    // unchanged; this used to re-send every font after each deploy.
    const redeployed = buildRelease(publicDir, root, 'f'.repeat(40), 'c'.repeat(40));
    assert.notEqual(redeployed.release, second.release);
    for (const file of Object.keys(second.files)) assert.equal(url(redeployed, file), url(second, file));
    const css = stored(first, 'css/main.css');
    assert(css.includes(url(first, 'fonts/test.woff2')));
    assert(css.includes(url(first, 'css/import.css')));
    assert(css.includes('url(#pattern)'));
    assert(!fs.existsSync(path.join(root, 'releases', first.release, 'public')));
    // Bad/missing pointers and incomplete releases retain last good selection.
    fs.writeFileSync(pointer, '{broken');
    assert.equal(runtime.snapshot().release, second.release);
    fs.unlinkSync(pointer);
    assert.equal(runtime.snapshot().release, second.release);
    atomicJson(pointer, { ...first, appRevision: 'd'.repeat(40) });
    assert.equal(runtime.snapshot().release, second.release);
    const firstMain = path.join(root, 'content', assetId(first, 'css/main.css'), 'css/main.css');
    fs.writeFileSync(firstMain, 'corrupt');
    atomicJson(pointer, first);
    assert.equal(runtime.snapshot().release, second.release);
    assert.throws(() => verifyRelease(root, first), /Corrupt/);
    fs.writeFileSync(firstMain, css);
    atomicJson(pointer, first);
    assert.equal(runtime.snapshot().release, first.release);
    verifyRelease(root, second); // Old and new releases survive rollback.
    assert(!safeFile('css/../../secret.css'));
    assert(!safeFile('css/.private.css'));
    assert(!safeFile('css/leak.json'));
    fs.writeFileSync(path.join(publicDir, 'css', 'main.css'), '.x{background:url(../../secret.png)}');
    assert.throws(() => buildRelease(publicDir, root, app, 'e'.repeat(40)), /Unsafe/);
    assert.equal(runtime.snapshot().release, first.release);
    // Shared nonblocking lock excludes simultaneous app/CSS publication.
    const lock = path.join(root, 'deploy.lock');
    execFileSync('flock', [lock, 'sh', '-c', `flock -n '${lock}' true && exit 1; exit 0`]);
    // CLI rollback checks compatibility before activation.
    const bad = spawnSync(process.execPath, [path.join(__dirname, '../../scripts/css-release-cli.js'), 'rollback', app, second.release], { env: { ...process.env, CSS_RELEASE_HOST_DIR: root }, encoding: 'utf8' });
    assert.equal(bad.status, 0, bad.stderr);
    assert.equal(runtime.snapshot().release, second.release);
    const foreign = spawnSync(process.execPath, [path.join(__dirname, '../../scripts/css-release-cli.js'), 'rollback', 'd'.repeat(40), first.release], { env: { ...process.env, CSS_RELEASE_HOST_DIR: root }, encoding: 'utf8' });
    assert.equal(foreign.status, 1);
    assert.equal(runtime.snapshot().release, second.release);
    process.env.CSS_RELEASE_DIR = root;
    const express = require('express');
    const { releasedAssets } = require('../../config/static-assets');
    const server = express().use(releasedAssets).listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    try {
        const base = `http://127.0.0.1:${server.address().port}`;
        const response = await fetch(base + url(first, 'css/main.css'));
        assert.equal(response.status, 200);
        assert.equal(await response.text(), css);
        assert.match(response.headers.get('cache-control'), /31536000, immutable/);
        assert.match(response.headers.get('content-type'), /text\/css/);
        const newer = await fetch(base + url(second, 'css/main.css'));
        assert.equal(newer.status, 200);
        assert((await newer.text()).includes('.new'));
        const font = await fetch(base + url(first, 'fonts/test.woff2'));
        assert.equal(font.status, 200);
        assert.equal(await font.text(), 'font-v1');
        // HTML cached before this change names schema 1 releases: their
        // per-release copies are still served and rewritten.
        const legacyId = '1'.repeat(32);
        const legacyCss = '.legacy{color:blue}';
        fs.mkdirSync(path.join(root, 'releases', legacyId, 'public/css'), { recursive: true });
        fs.writeFileSync(path.join(root, 'releases', legacyId, 'public/css/main.css'), legacyCss);
        const legacy = { schema: 1, release: legacyId, appRevision: app, sourceRevision: 'b'.repeat(40), files: { 'css/main.css': crypto.createHash('sha256').update(legacyCss).digest('hex') } };
        atomicJson(path.join(root, 'releases', legacyId, 'manifest.json'), legacy);
        verifyRelease(root, legacy);
        assert(runtime.rewrite(html, legacy).includes(`/assets/${legacyId}/css/main.css`));
        const legacyResponse = await fetch(`${base}/assets/${legacyId}/css/main.css`);
        assert.equal(legacyResponse.status, 200);
        assert.equal(await legacyResponse.text(), legacyCss);
        assert.equal((await fetch(`${base}/assets/${legacyId}/css/missing.css`)).status, 404);
        for (const blocked of [`/assets/${first.release}/manifest.json`, `/assets/${first.release}/css/%2e%2e/manifest.json`, '/assets/not-a-release/css/main.css']) {
            assert.equal((await fetch(base + blocked)).status, 404);
        }
    } finally { await new Promise(resolve => server.close(resolve)); }
    console.log('CSS releases: content-addressed URLs, legacy releases, dependencies, immutability, response snapshot, corrupt/missing manifests, rollback and lock passed');
} finally { fs.rmSync(scratch, { recursive: true, force: true }); }

}
main().catch(err => { console.error(err); process.exitCode = 1; });
