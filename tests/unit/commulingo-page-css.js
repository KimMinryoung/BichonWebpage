#!/usr/bin/env node
// The CommuLingo page sheets split from commulingo.css
// (scripts/build-commulingo-list-css.js): the feature class list is current,
// the generated sheets are, every rule of the source lands in exactly one of
// them in source order, and each feature's views load its sheet.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');

const root = path.join(__dirname, '..', '..');
process.chdir(root);
const features = require('../../scripts/commulingo-css-features');
const { buildPageCss, PAGE_SHEETS } = require('../../scripts/build-commulingo-list-css');
const { PAGE_FEATURES } = require('../../config/commulingo-page-css');

// A class used outside its feature (or a new feature-only one) changes the list.
assert.equal(fs.readFileSync(features.OUTPUT, 'utf8'), features.serialize(features.computeFeatureClasses()),
    'scripts/commulingo-css-features.json is stale: node scripts/commulingo-css-features.js && node scripts/build-commulingo-list-css.js');

const generated = Object.fromEntries(PAGE_SHEETS.map(kind => [kind, buildPageCss(kind)]));
for (const [kind, css] of Object.entries(generated)) {
    assert.equal(fs.readFileSync(`public/css/commulingo-${kind}.css`, 'utf8'), css, `commulingo-${kind}.css is stale: node scripts/build-commulingo-list-css.js`);
}

// Every selector with its media context and declarations, in order: the
// sheets together hold the source exactly once.
const contexts = rule => {
    const result = [];
    for (let parent = rule.parent; parent.type !== 'root'; parent = parent.parent) result.unshift(`${parent.name}:${parent.params}`);
    return result.join('/');
};
const entries = css => {
    const out = [];
    postcss.parse(css).walkRules(rule => {
        if (rule.parent.name === 'keyframes') return;
        const body = rule.nodes.filter(node => node.type === 'decl').map(node => node.toString()).join(';');
        for (const selector of rule.selectors) out.push(`${contexts(rule)}|${selector}|${body}`);
    });
    return out;
};
const source = entries(fs.readFileSync('public/css/commulingo.css', 'utf8'));
const split = Object.values(generated).flatMap(entries);
assert.deepEqual([...split].sort(), [...source].sort(), 'every source rule is in exactly one page sheet');
for (const css of Object.values(generated)) {
    const mine = entries(css);
    const order = source.filter(entry => mine.includes(entry));
    assert.deepEqual(mine, order, 'a page sheet keeps source order');
}
assert.match(generated.core, /@keyframes/, 'animations stay in the core sheet');

// A view whose markup a feature's classes come from loads that feature's sheet.
const views = fs.readdirSync('views/public').map(name => `views/public/${name}`);
for (const file of views) {
    const owner = Object.keys(features.FEATURE_FILES)
        .find(name => features.FEATURE_FILES[name].some(rx => rx.test(file)));
    if (!owner) continue;
    const view = file.replace(/^views\//, '').replace(/\.ejs$/, '');
    assert.ok((PAGE_FEATURES[view] || []).includes(owner), `${view} must load commulingo-${owner}.css (config/commulingo-page-css.js)`);
}
for (const list of Object.values(PAGE_FEATURES)) for (const name of list) assert.ok(PAGE_SHEETS.includes(name), `unknown feature ${name}`);

console.log(`test-commulingo-page-css: core ${generated.core.length} B + ${PAGE_SHEETS.slice(1).map(k => `${k} ${generated[k].length} B`).join(', ')}`);
