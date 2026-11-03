// Every integrated search box answers as one types (public/js/site-search-suggest.js),
// with the suggest endpoint mocked:
// - the toolbar dialog (on the chat page): "/" and Ctrl+K open it ("/" typed in
//   a text field does not), debounced results, arrow keys, Escape and the
//   close button, a reopened dialog that asks nothing again, Enter to the full
//   search page;
// - the home page's box: a dropdown under it, arrow keys, Escape closes the
//   dropdown and a press outside does too, focus reopens it from memory;
// - the search page: its results follow the box with the address and scope
//   tabs, the shortcuts focus that box instead of opening the dialog, Enter
//   settles a history entry and Back restores the earlier query.
const assert = require('node:assert/strict');
const { launchChromium } = require('../lib/browser');
const { createGameTestServer } = require('../lib/game-test-server');
const strings = require('../../config/strings');
const { siteStyleModules } = require('../../utils/site-stylesheets');
const { highlightTerms, searchTerms } = require('../../utils/text-search');
/* global document, location */

const asked = [];
const rows = q => `<section class="site-search-group" aria-label="x"><ul class="site-search-list">
    <li><a class="site-search-row" href="/a">${q} 하나</a></li>
    <li><a class="site-search-row" href="/b">${q} 둘</a></li></ul></section>`;
function routes(app) {
    app.use((req, res, next) => { res.locals.siteStyleModules = siteStyleModules; next(); });
    app.get('/chat', (req, res) => res.render('public/chat', {
        chatApiUrl: '/api/proxy', pageTitle: 'chat', pageDescription: 'chat', pagePath: '/chat',
        withPersona: strings.withPersona, siteStyleModules,
    }));
    app.get('/', (req, res) => res.render('public/index', {
        recentPosts: [], recentDiaries: [], recentResearch: [], recentHub: [], recentCommuLingo: [],
        partlyFailed: false, pageTitle: 'home', pagePath: '/',
    }));
    app.get('/search/suggest', (req, res) => {
        asked.push(req.query.q);
        res.json({ query: req.query.q, count: 2, html: rows(req.query.q) });
    });
    app.get('/search', (req, res) => {
        const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
        const result = { query: q, terms: searchTerms(q), failed: [], sections: q ? [{ key: 'reports', total: 1, moreHref: '',
            items: [{ title: `${q} 처음`, href: '/first' }] }] : [] };
        res.render('public/search', {
            scope: 'all', scopes: { all: { path: '/search' }, commulingo: { path: '/commulingo/search' } },
            result, searchValue: q, highlightTerms, pageTitle: q ? `${q} — 검색` : '검색', pagePath: '/search',
        });
    });
    app.use('/api/proxy', (req, res) => res.json({ personas: [], history: [], sessions: [] }));
}

async function main() {
    const { server, origin } = await createGameTestServer({ routes });
    let browser;
    try {
        browser = await launchChromium({ headless: true });
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
        const active = () => page.evaluate(() => document.activeElement.getAttribute('href') || document.activeElement.name);

        // ── The toolbar dialog ──
        await page.goto(origin + '/chat');
        const isOpen = () => page.evaluate(() => document.getElementById('siteSearchDialog').open);

        // "/" in the chat box is text, not a shortcut.
        await page.focus('#chatInput');
        await page.keyboard.type('a/b');
        assert.equal(await isOpen(), false);
        assert.equal(await page.inputValue('#chatInput'), 'a/b');

        await page.evaluate(() => document.activeElement.blur());
        await page.keyboard.press('/');
        assert.equal(await isOpen(), true, '/ opens the dialog');
        await page.keyboard.type('레닌');
        await page.waitForSelector('#siteSearchDialog .site-search-row');
        assert.equal(asked[asked.length - 1], '레닌');
        assert.ok(asked.length <= 2, `typing is debounced (${asked.length} requests)`);
        assert.equal(await page.getAttribute('#siteSearchDialog [data-site-search-all]', 'href'), '/search?q=%EB%A0%88%EB%8B%8C');
        assert.equal(await page.textContent('#siteSearchDialog [data-site-search-status]'), strings.ko.search.resultCount.replace('{n}', 2));

        await page.keyboard.press('ArrowDown');
        assert.equal(await active(), '/a');
        await page.keyboard.press('ArrowDown');
        assert.equal(await active(), '/b');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        assert.equal(await active(), 'q', 'up from the first result returns to the box');

        await page.keyboard.press('Escape');
        assert.equal(await isOpen(), false, 'Escape closes');

        const before = asked.length;
        await page.keyboard.press('Control+k');
        assert.equal(await isOpen(), true, 'Ctrl+K opens');
        assert.equal(await page.isVisible('#siteSearchDialog .site-search-row'), true, 'the last results come back with the dialog');
        await page.click('#siteSearchDialog [data-search-clear]');
        assert.equal(await page.inputValue('#siteSearchDialog [data-search-input]'), '');
        assert.equal(await page.isHidden('#siteSearchDialog [data-site-search-panel]'), true, 'clearing empties the results');
        await page.keyboard.type('레닌');
        await page.waitForSelector('#siteSearchDialog .site-search-row');
        assert.equal(asked.length, before, 'a query asked before is answered from memory');
        await page.click('[data-search-close]');
        assert.equal(await isOpen(), false, 'the close button closes');

        await page.click('.toolbar-search-btn');
        assert.equal(await isOpen(), true, 'the magnifier opens the dialog instead of navigating');
        await page.keyboard.press('Enter');
        await page.waitForURL(url => url.pathname === '/search');
        assert.equal(new URL(page.url()).searchParams.get('q'), '레닌', 'Enter opens the full search page with the query');

        // ── The home page's box: a dropdown ──
        await page.goto(origin + '/');
        const inline = '.home-search';
        await page.click(`${inline} [data-search-input]`);
        await page.keyboard.type('엥겔스');
        await page.waitForSelector(`${inline} .site-search-row`);
        assert.equal(await page.isVisible(`${inline} [data-site-search-panel]`), true, 'the home box shows results under it');
        await page.keyboard.press('ArrowDown');
        assert.equal(await active(), '/a');
        await page.keyboard.press('Escape');
        assert.equal(await page.isHidden(`${inline} [data-site-search-panel]`), true, 'Escape closes the dropdown');
        assert.equal(await active(), 'q', 'and returns to the box');
        assert.equal(await page.inputValue(`${inline} [data-search-input]`), '엥겔스', 'keeping the words');
        const asked2 = asked.length;
        await page.evaluate(() => document.activeElement.blur());
        await page.click(`${inline} [data-search-input]`);
        assert.equal(await page.isVisible(`${inline} [data-site-search-panel]`), true, 'focus reopens the dropdown');
        assert.equal(asked.length, asked2, 'from what it already holds');
        await page.mouse.click(5, 700);
        assert.equal(await page.isHidden(`${inline} [data-site-search-panel]`), true, 'a press outside closes it');
        await page.click(`${inline} [data-search-input]`);
        await page.keyboard.press('Enter');
        await page.waitForURL(url => url.pathname === '/search');
        assert.equal(new URL(page.url()).searchParams.get('q'), '엥겔스');

        // ── The search page: results follow the box ──
        await page.waitForSelector('#site-search-results a[href="/first"]');
        await page.fill('.site-search-form--page [data-search-input]', '트로츠키');
        await page.waitForSelector('#site-search-results a[href="/a"]');
        assert.equal(new URL(page.url()).searchParams.get('q'), '트로츠키', 'the address follows the box');
        assert.match(await page.title(), /^트로츠키 — 검색/);
        assert.match(await page.getAttribute('.site-search-scopes a:last-child', 'href'), /q=%ED%8A%B8%EB%A1%9C%EC%B8%A0%ED%82%A4/, 'the scope tabs carry it');
        await page.keyboard.press('Enter');
        assert.equal(new URL(page.url()).pathname, '/search', 'Enter on the search page does not reload it');
        await page.evaluate(() => document.activeElement.blur());
        await page.keyboard.press('/');
        assert.equal(await page.evaluate(() => document.getElementById('siteSearchDialog').open), false, 'the search page does not open the dialog');
        assert.equal(await page.evaluate(() => document.activeElement.closest('.site-search-form--page') !== null), true, '/ focuses its own box');
        await page.goBack();
        await page.waitForFunction(() => new URL(location.href).searchParams.get('q') === '엥겔스');
        assert.equal(await page.inputValue('.site-search-form--page [data-search-input]'), '엥겔스', 'Back restores the earlier query');
        await page.click('.site-search-form--page [data-search-clear]');
        await page.waitForFunction(() => !new URL(location.href).searchParams.has('q'));
        assert.equal((await page.textContent('#site-search-results')).trim(), strings.ko.search.prompt, 'an empty box asks for words');

        assert.deepEqual(errors, []);
        console.log('Site search: dialog, home dropdown and live search page passed (shortcuts, debounce, arrows, memory, address).');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
