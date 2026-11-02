// The toolbar search dialog: "/" and Ctrl+K open it (but "/" typed in a text
// field does not), results arrive as one types, arrows move through them,
// Escape closes, Enter goes to the full search page. The suggest endpoint is
// mocked; any page with the nav will do (chat).
const assert = require('node:assert/strict');
const { launchChromium } = require('../lib/browser');
const { createGameTestServer } = require('../lib/game-test-server');
const strings = require('../../config/strings');
const { siteStyleModules } = require('../../utils/site-stylesheets');
/* global document */

const asked = [];
function routes(app) {
    app.get('/chat', (req, res) => res.render('public/chat', {
        chatApiUrl: '/api/proxy', pageTitle: 'chat', pageDescription: 'chat', pagePath: '/chat',
        withPersona: strings.withPersona, siteStyleModules,
    }));
    app.get('/search/suggest', (req, res) => {
        asked.push(req.query.q);
        res.json({ query: req.query.q, html: `<section class="site-search-group"><ul class="site-search-list">
            <li><a class="site-search-row" href="/a">${req.query.q} 하나</a></li>
            <li><a class="site-search-row" href="/b">${req.query.q} 둘</a></li></ul></section>` });
    });
    app.get('/search', (req, res) => res.send(`<p id="full">${req.query.q}</p>`));
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
        await page.waitForSelector('.site-search-dialog-results .site-search-row');
        assert.equal(asked[asked.length - 1], '레닌');
        assert.ok(asked.length <= 2, `typing is debounced (${asked.length} requests)`);

        await page.keyboard.press('ArrowDown');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '/a');
        await page.keyboard.press('ArrowDown');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '/b');
        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('ArrowUp');
        assert.equal(await page.evaluate(() => document.activeElement.name), 'q', 'up from the first result returns to the box');

        await page.keyboard.press('Escape');
        assert.equal(await isOpen(), false, 'Escape closes');

        await page.keyboard.press('Control+k');
        assert.equal(await isOpen(), true, 'Ctrl+K opens');
        await page.click('[data-search-close]');
        assert.equal(await isOpen(), false, 'the close button closes');

        await page.click('.toolbar-search-btn');
        assert.equal(await isOpen(), true, 'the magnifier opens the dialog instead of navigating');
        await page.keyboard.press('Enter');
        await page.waitForSelector('#full');
        assert.equal(await page.textContent('#full'), '레닌', 'Enter opens the full search page with the query');
        assert.deepEqual(errors, []);
        console.log('Site search dialog: shortcuts, debounced suggestions, arrow keys, close and full search passed.');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
