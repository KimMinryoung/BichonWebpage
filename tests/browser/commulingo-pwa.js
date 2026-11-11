// CommuLingo as an app: commulingo pages link the manifest and register the
// service worker for their language scope; a page opened once comes back
// offline, an unopened one shows the offline notice, lesson data is kept,
// and pages outside the scope are left alone.
const assert = require('node:assert/strict');
const { launchChromium } = require('../lib/browser');
const { createGameTestServer } = require('../lib/game-test-server');
const strings = require('../../config/strings');
const { siteStyleModules } = require('../../utils/site-stylesheets');
/* global navigator, fetch */

const page = (title, extra = '') => `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${title}</title>
<link rel="manifest" href="/commulingo/manifest.webmanifest"><script src="/js/commulingo-pwa.js" defer></script></head>
<body><h1 id="title">${title}</h1>${extra}</body></html>`;

function routes(app) {
    app.use('/commulingo', require('../../routes/commulingo-pwa'));
    app.get('/commulingo', (req, res) => res.send(page('home')));
    app.get('/commulingo/a', (req, res) => res.send(page('a')));
    app.get('/commulingo/b', (req, res) => res.send(page('b')));
    app.get('/commulingo/lesson/l1', (req, res) => res.json({ id: 'l1' }));
    app.get('/reports', (req, res) => res.send('<p id="title">reports</p>'));
    app.get('/chat-as-commulingo', (req, res) => res.render('public/chat', {
        chatApiUrl: '/api/proxy', pageTitle: 'x', pageDescription: 'x', pagePath: '/commulingo/x',
        withPersona: strings.withPersona, siteStyleModules,
    }));
}

async function main() {
    const { server, origin } = await createGameTestServer({ routes });
    let browser;
    try {
        // The head partial links the manifest and the registration on commulingo pages only.
        const head = await (await fetch(origin + '/chat-as-commulingo')).text();
        assert.match(head, /<link rel="manifest" href="\/commulingo\/manifest.webmanifest">/);
        assert.match(head, /commulingo-pwa\.js/);

        const manifest = await fetch(origin + '/en/commulingo/manifest.webmanifest');
        assert.equal(manifest.headers.get('content-type').split(';')[0], 'application/manifest+json');
        const m = await manifest.json();
        assert.equal(m.start_url, '/en/commulingo');
        assert.equal(m.scope, '/en/commulingo');
        assert.equal(m.name, strings.en.commuLingo.name);
        assert.ok(m.icons.some(icon => icon.purpose === 'maskable'));
        const sw = await fetch(origin + '/commulingo/sw.js');
        assert.equal(sw.headers.get('service-worker-allowed'), '/commulingo');
        assert.match(sw.headers.get('cache-control'), /no-cache/);

        browser = await launchChromium({ headless: true });
        const context = await browser.newContext();
        const tab = await context.newPage();
        const errors = [];
        tab.on('pageerror', e => errors.push(e.message));
        await tab.goto(origin + '/commulingo');
        await tab.evaluate(() => navigator.serviceWorker.ready);
        // The first load is not controlled yet; reload so the worker sees pages.
        await tab.reload();
        assert.equal(await tab.evaluate(() => !!navigator.serviceWorker.controller), true, 'controlled after reload');
        assert.equal(await tab.evaluate(() => navigator.serviceWorker.controller.scriptURL.endsWith('/commulingo/sw.js')), true);
        await tab.goto(origin + '/commulingo/a');
        await tab.evaluate(() => fetch('/commulingo/lesson/l1').then(r => r.json()));
        await tab.waitForTimeout(300);

        // Offline: the origin goes away (context.setOffline does not reach a
        // service worker's own fetches).
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        await tab.goto(origin + '/commulingo/a');
        assert.equal(await tab.textContent('#title'), 'a', 'an opened page comes back offline');
        await tab.goto(origin + '/commulingo');
        assert.equal(await tab.textContent('#title'), 'home');
        assert.deepEqual(await tab.evaluate(() => fetch('/commulingo/lesson/l1').then(r => r.json())), { id: 'l1' }, 'lesson data kept');
        await tab.goto(origin + '/commulingo/b');
        assert.equal(await tab.textContent('h1'), '오프라인', 'an unopened page shows the notice');
        const outside = await tab.goto(origin + '/reports').then(() => 'loaded', () => 'failed');
        assert.equal(outside, 'failed', 'pages outside the scope are not served by the worker');
        assert.deepEqual(errors, []);
        console.log('CommuLingo PWA: manifest, worker scope, offline pages and data, outside scope untouched passed.');
    } finally {
        if (browser) await browser.close();
        if (server.listening) server.close();
    }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
