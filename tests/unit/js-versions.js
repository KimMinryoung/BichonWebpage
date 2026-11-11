#!/usr/bin/env node
// Scripts in HTML get their content hash as version (config/js-versions.js),
// so a deploy that leaves a script alone keeps its cached address.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createJsVersions } = require('../../config/js-versions');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'js-versions-'));
fs.mkdirSync(path.join(dir, 'js', 'war'), { recursive: true });
fs.writeFileSync(path.join(dir, 'js', 'nav.js'), 'nav();');
fs.writeFileSync(path.join(dir, 'js', 'war', 'engine.js'), 'engine();');

const html = '<script src="/js/nav.js?v=abc123" defer></script>'
    + '<script data-war="/js/war/engine.js?v=abc123 /js/gone.js?v=abc123"></script>'
    + '<link href="/css/site.css?v=abc123"><script src="/js/nav.js?v=abc1234"></script>';
const first = createJsVersions(dir, 'abc123').rewrite(html);
const nav = first.match(/\/js\/nav\.js\?v=([0-9a-f]{16})/)[1];
assert.match(first, /\/js\/war\/engine\.js\?v=[0-9a-f]{16} /, 'scripts in subfolders and attribute lists');
assert.match(first, /\/js\/gone\.js\?v=abc123/, 'a missing file keeps the commit version');
assert.match(first, /\/css\/site\.css\?v=abc123/, 'CSS is left to the CSS release');
assert.match(first, /\/js\/nav\.js\?v=abc1234/, 'only the exact asset version is replaced');

// Another deploy (new commit), same file: same address. Changed file: new one.
assert.equal(createJsVersions(dir, 'def456').rewrite('/js/nav.js?v=def456'), `/js/nav.js?v=${nav}`);
fs.writeFileSync(path.join(dir, 'js', 'nav.js'), 'nav(2);');
assert.notEqual(createJsVersions(dir, 'def456').rewrite('/js/nav.js?v=def456'), `/js/nav.js?v=${nav}`);
assert.equal(createJsVersions(dir, '').rewrite(html), html, 'no asset version, nothing to replace');
fs.rmSync(dir, { recursive: true, force: true });
console.log('test-js-versions: ok');
