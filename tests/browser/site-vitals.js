// public/js/site-vitals.js in a page: one vitals beacon when the page goes
// away (LCP, CLS and, after a click, INP), and errors from the site's own
// scripts but not from elsewhere. Endpoints are mocked; the chat page serves
// as any page with the shared head.
const assert = require('node:assert/strict');
const { launchChromium } = require('../lib/browser');
const { createGameTestServer } = require('../lib/game-test-server');
const strings = require('../../config/strings');
const { siteStyleModules } = require('../../utils/site-stylesheets');

const vitals = [];
const errors = [];
function routes(app) {
    app.use(require('express').json());
    app.get('/chat', (req, res) => res.render('public/chat', {
        chatApiUrl: '/api/proxy', pageTitle: 'chat', pageDescription: 'chat', pagePath: '/chat',
        withPersona: strings.withPersona, siteStyleModules,
    }));
    app.get('/js/boom.js', (req, res) => res.type('application/javascript').send('setTimeout(function () { undefinedThing(); }, 0);'));
    app.post('/metrics/vitals', (req, res) => { vitals.push({ body: req.body, header: req.headers['x-commulingo-measurement'] }); res.status(204).end(); });
    app.post('/metrics/client-error', (req, res) => { errors.push(req.body); res.status(204).end(); });
    app.use('/api/proxy', (req, res) => res.json({ personas: [], history: [], sessions: [] }));
    app.post('/metrics/menu-view', (req, res) => res.status(204).end());
}

async function main() {
    const { server, origin } = await createGameTestServer({ routes });
    let browser;
    try {
        browser = await launchChromium({ headless: true });
        const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const page = await context.newPage();
        await page.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
        await page.goto(origin + '/chat');
        await page.addScriptTag({ url: '/js/boom.js' });
        // An inline script's error is not the site's file and is not sent.
        await page.addScriptTag({ content: 'setTimeout(function () { otherThing(); }, 0);' });
        await page.click('#newChatBtn');
        await page.waitForTimeout(500);
        await page.close({ runBeforeUnload: false });
        await new Promise(resolve => setTimeout(resolve, 500));

        assert.equal(vitals.length, 1, 'one vitals beacon');
        const v = vitals[0];
        assert.equal(v.header, '1');
        assert.equal(v.body.path, '/chat');
        assert.equal(v.body.device, 'mobile');
        assert.ok(Number.isInteger(v.body.lcp) && v.body.lcp > 0, `lcp ${v.body.lcp}`);
        assert.ok(Number.isInteger(v.body.cls) && v.body.cls >= 0);
        assert.ok(v.body.inp === undefined || Number.isInteger(v.body.inp));
        assert.equal(errors.length, 1, `only the site script's error (${JSON.stringify(errors)})`);
        assert.match(errors[0].message, /undefinedThing/);
        assert.equal(errors[0].source, origin + '/js/boom.js');
        console.log('Site vitals: one beacon on leaving with LCP/CLS, own-script errors only passed.');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
