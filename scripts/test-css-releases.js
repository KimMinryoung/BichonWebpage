const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { buildRelease, verifyRelease, atomicJson, safeFile } = require('./lib/css-release');
const { createCssReleases } = require('../config/css-releases');
const { localizeHtmlLinks } = require('../utils/seo');
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
    const html = '<link href="/css/main.css?v=old"><link rel="preload" href="/css/import.css?v=old"><script src="/js/common.js?v=old"></script>';
    const oldHtml = runtime.rewrite(html, captured);
    assert(oldHtml.includes(`/assets/${first.release}/css/main.css`));
    assert(runtime.rewrite(oldHtml, second).includes(`/assets/${second.release}/css/main.css`));
    assert(oldHtml.includes('/js/common.js?v=old'));
    assert.equal(localizeHtmlLinks(oldHtml, 'en'), oldHtml);
    const css = fs.readFileSync(path.join(root, 'releases', first.release, 'public/css/main.css'), 'utf8');
    assert(css.includes(`/assets/${first.release}/fonts/test.woff2`));
    assert(css.includes(`/assets/${first.release}/css/import.css`));
    assert(css.includes('url(#pattern)'));
    // Bad/missing pointers and incomplete releases retain last good selection.
    fs.writeFileSync(pointer, '{broken');
    assert.equal(runtime.snapshot().release, second.release);
    fs.unlinkSync(pointer);
    assert.equal(runtime.snapshot().release, second.release);
    atomicJson(pointer, { ...first, appRevision: 'd'.repeat(40) });
    assert.equal(runtime.snapshot().release, second.release);
    fs.writeFileSync(path.join(root, 'releases', first.release, 'public/css/main.css'), 'corrupt');
    atomicJson(pointer, first);
    assert.equal(runtime.snapshot().release, second.release);
    assert.throws(() => verifyRelease(root, first), /Corrupt/);
    fs.writeFileSync(path.join(root, 'releases', first.release, 'public/css/main.css'), css);
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
    const bad = spawnSync(process.execPath, [path.join(__dirname, 'css-release-cli.js'), 'rollback', app, second.release], { env: { ...process.env, CSS_RELEASE_HOST_DIR: root }, encoding: 'utf8' });
    assert.equal(bad.status, 0, bad.stderr);
    assert.equal(runtime.snapshot().release, second.release);
    const foreign = spawnSync(process.execPath, [path.join(__dirname, 'css-release-cli.js'), 'rollback', 'd'.repeat(40), first.release], { env: { ...process.env, CSS_RELEASE_HOST_DIR: root }, encoding: 'utf8' });
    assert.equal(foreign.status, 1);
    assert.equal(runtime.snapshot().release, second.release);
    process.env.CSS_RELEASE_DIR = root;
    const express = require('express');
    const { releasedAssets } = require('../config/static-assets');
    const server = express().use(releasedAssets).listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    try {
        const base = `http://127.0.0.1:${server.address().port}`;
        const response = await fetch(`${base}/assets/${first.release}/css/main.css`);
        assert.equal(response.status, 200);
        assert.equal(await response.text(), css);
        assert.match(response.headers.get('cache-control'), /31536000, immutable/);
        assert.match(response.headers.get('content-type'), /text\/css/);
        const newer = await fetch(`${base}/assets/${second.release}/css/main.css`);
        assert.equal(newer.status, 200);
        assert((await newer.text()).includes('.new'));
        for (const url of [`/assets/${first.release}/manifest.json`, `/assets/${first.release}/css/%2e%2e/manifest.json`, '/assets/not-a-release/css/main.css']) {
            assert.equal((await fetch(base + url)).status, 404);
        }
    } finally { await new Promise(resolve => server.close(resolve)); }
    console.log('CSS releases: dependencies, immutability, response snapshot, corrupt/missing manifests, rollback and lock passed');
} finally { fs.rmSync(scratch, { recursive: true, force: true }); }

}
main().catch(err => { console.error(err); process.exitCode = 1; });
