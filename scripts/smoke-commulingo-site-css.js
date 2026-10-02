const assert = require('node:assert/strict');
const fs = require('node:fs');
const postcss = require('postcss');
const { buildSiteCss, moduleFor } = require('./build-site-css');
const { buildListCss } = require('./build-commulingo-list-css');
const { siteStyleModules } = require('../utils/site-stylesheets');
const generated = buildSiteCss();
for (const [name, css] of Object.entries(generated)) {
    assert.equal(fs.readFileSync(`public/css/site-${name}.css`, 'utf8'), css);
}
const declarations = rule => rule.nodes.filter(node => node.type === 'decl').map(node => node.toString()).join(';');
const contexts = rule => { const result = []; for (let parent = rule.parent; parent.type !== 'root'; parent = parent.parent) result.unshift(`${parent.name}:${parent.params}`); return result.join('/'); };
// Every selector and declaration survives in its module, including media
// variants; within each module source order must remain unchanged.
const expected = Object.fromEntries(Object.keys(generated).map(name => [name, []]));
postcss.parse(fs.readFileSync('public/css/style.css', 'utf8')).walkRules(rule => {
    if (rule.parent.name === 'keyframes') return;
    for (const selector of rule.selectors) expected[moduleFor(selector)].push([contexts(rule), selector, declarations(rule)]);
});
for (const [name, css] of Object.entries(generated)) {
    const actual = [];
    postcss.parse(css).walkRules(rule => {
        if (rule.parent.name === 'keyframes') return;
        for (const selector of rule.selectors) actual.push([contexts(rule), selector, declarations(rule)]);
    });
    assert.deepEqual(actual, expected[name]);
}
assert.doesNotMatch(generated.core, /\.chat-|\.posts-table|\.form-group|\.post-body|\.home-hero/);
assert.equal((generated.core.match(/@font-face/g) || []).length, 7);
const home = buildListCss('home');
assert.equal(fs.readFileSync('public/css/commulingo-home.css', 'utf8'), home);
assert.match(home, /\.commu-updates\[open\]/);
assert.match(home, /\.commulingo-home-progress/);
assert.match(home, /\.commu-book-progress-track/);
assert.doesNotMatch(home, /\.commu-person-|\.commu-people-|\.commu-search-|\.commu-office-/);
for (const [path, modules] of [
    ['/', ['lists', 'home']], ['/en/', ['lists', 'home']], ['/chat', ['chat']],
    ['/auth/login', ['auth']], ['/auth/account', ['auth']], ['/admin/posts', ['lists', 'prose', 'auth', 'admin']],
    ['/posts?page=2', ['lists', 'prose']], ['/hub/x', ['lists', 'prose', 'hub']],
    ['/commulingo', []], ['/commulingo/people', []], ['/en/commulingo/terms/', []],
    ['/commulingo/people/list/old-regime', []], ['/commulingo/events/october', ['prose']],
    ['/commulingo/docs/manifesto', ['prose']], ['/games/strike/', []],
]) assert.deepEqual(siteStyleModules(path), modules, path);
const ejs = require('ejs');
const seo = require('../utils/seo');
const strings = require('../config/strings');
for (const path of ['/', '/commulingo', '/chat', '/auth/login', '/hub', '/admin/posts']) {
    const html = ejs.render(fs.readFileSync('views/partials/head.ejs', 'utf8'), {
        pagePath: path, siteStyleModules, strings: strings.ko, assetVersion: 'check',
        siteOrigin: seo.SITE_ORIGIN, languageUrl: seo.languagePath,
    }, { filename: 'views/partials/head.ejs' });
    assert.match(html, /site-core\.css/);
    assert.doesNotMatch(html, /href="\/css\/style\.css/);
    for (const name of Object.keys(generated).filter(name => name !== 'core')) {
        assert.equal(html.includes(`/css/site-${name}.css`), siteStyleModules(path).includes(name), `${path}: ${name}`);
    }
    assert(html.indexOf('/css/site-core.css') < html.indexOf('/css/ui.css'));
}
console.log('site CSS: all selectors/declarations/media preserved, module order, IBM Plex, page routing and landing-only CSS OK');
