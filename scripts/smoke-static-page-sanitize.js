#!/usr/bin/env node
// Static page bodies (/p/:slug) are sanitized on the server by
// services/static-page-render.js. Pinned here: scripts, event handlers,
// script URLs, frames and form controls go; sections, tables, inline SVG with
// its case-sensitive attributes and page-scoped <style> blocks stay.
//   node scripts/smoke-static-page-sanitize.js
const assert = require('assert');
const { renderStaticPageBody } = require('../services/static-page-render');

const hostile = renderStaticPageBody([
    '<p onclick="alert(1)">a</p>',
    '<img src="x" onerror="alert(1)">',
    '<a href="javascript:alert(1)">b</a>',
    '<iframe src="https://evil.example/"></iframe>',
    '<svg><script>alert(1)</script></svg>',
    '<form action="/x"><input type="checkbox"></form>',
    '<script>alert(1)</script>',
].join('\n'));
assert.ok(!/\son[a-z]+=|javascript:|<(iframe|script|form|input)\b|alert|evil/i.test(hostile), hostile);

const kept = renderStaticPageBody([
    '<style>.chart { color: red; } .a > .b { margin: 0 }</style>',
    '<section class="s" id="one"><h2 style="color:#333">제목</h2>',
    '<figure aria-label="도표"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img">',
    '<g transform="translate(1,1)"><rect x="0" y="0" width="5" height="5" rx="1" fill="#000" stroke-dasharray="2 1"/>',
    '<text x="1" y="2" text-anchor="middle" font-size="3">가</text></g></svg></figure>',
    '<table class="t"><thead><tr><th scope="col">a</th></tr></thead><tbody><tr><td colspan="2">b</td></tr></tbody></table>',
    '<a href="https://example.org/" target="_blank" rel="noopener">c</a></section>',
].join(''));
for (const fragment of ['<style>.chart { color: red; } .a > .b { margin: 0 }</style>', 'viewBox="0 0 10 10"',
    'text-anchor="middle"', 'stroke-dasharray="2 1"', '<td colspan="2">', 'target="_blank"', 'style="color:#333"']) {
    assert.ok(kept.includes(fragment), `kept: ${fragment}\n${kept}`);
}
assert.strictEqual(renderStaticPageBody(null), '');
console.log('ok: static page sanitize');
