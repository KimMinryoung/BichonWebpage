// Browser smoke test against the real game routes/templates, without DB/Redis.
const assert = require('node:assert/strict');
const path = require('node:path');
const express = require('express');
const { chromium } = require('playwright');
/* global window, document, localStorage */
const strings = require('../config/strings');
const seo = require('../utils/seo');
const { iconPaths } = require('../data/icons');
const { stripEnglishPrefix } = require('../middleware/language');

async function main() {
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));
    app.use(stripEnglishPrefix);
    app.use((req, res, next) => { req.cookies = {}; req.session = {}; next(); });
    app.use((req, res, next) => {
        const lang = req.urlLanguage === 'en' ? 'en' : 'ko';
        Object.assign(res.locals, { lang, strings: strings[lang], siteOrigin: 'https://cyber-lenin.com',
            languageUrl: seo.languagePath, languageSwitchUrl: seo.languageSwitchPath,
            jsonLdScript: seo.jsonLdScript, iconPaths, assetVersion: 'test', currentUser: null,
            isAuthenticated: false, urlLanguage: lang, pagePath: req.path });
        const send = res.send.bind(res);
        res.send = body => send(lang === 'en' && typeof body === 'string' ? seo.localizeHtmlLinks(body, 'en') : body);
        next();
    });
    app.use(require('../routes/redirects'));
    app.use(express.static(path.join(__dirname, '../public')));
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    const origin = 'http://127.0.0.1:' + server.address().port;
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        for (const url of ['/games/', '/games/strike/', '/nonogram/', '/en/games/', '/en/games/strike/']) {
            const response = await page.goto(origin + url);
            assert.equal(response.status(), 200, url);
        }
        for (const url of ['/games', '/games/strike', '/en/games/strike']) {
            const response = await page.request.get(origin + url + '?x=1', { maxRedirects: 0 });
            assert.equal(response.status(), 301);
            assert.equal(response.headers().location, url + '/?x=1');
        }
        await page.goto(origin + '/games/');
        assert.equal(await page.locator('.game-card').count(), 2);
        await page.locator('.game-card').first().click();
        assert.ok(page.url().endsWith('/games/strike/'));
        const strategy = ['organize', 'solidarity', 'organize', 'strike', 'rest', 'strike', 'solidarity', 'strike', 'bargain'];
        for (const mode of ['normal', 'hard']) {
            await page.selectOption('#strikeMode', mode);
            await page.click('#strikeStart');
            for (const action of strategy) await page.click('[data-action="' + action + '"]');
            assert.equal(await page.locator('#strikeOffers').isVisible(), true);
            await page.getByRole('button', { name: '노동시간도 지키는 안 수락' }).click();
            assert.match(await page.locator('#strikeResultTitle').textContent(), /세 가지 요구/);
            assert.match(await page.locator('#strikeScore').textContent(), /새 최고 기록/);
            await page.click('#strikeRestart');
            assert.match(await page.locator('#strikeBest').textContent(), /최고 합의 점수/);
        }
        await page.click('#strikeStart');
        for (let i = 0; i < 10; i++) {
            await page.click('[data-action="bargain"]');
            await page.click('#strikeReject');
        }
        assert.match(await page.locator('#strikeResultText').textContent(), /10턴/);
        await page.click('#strikeRestart');
        await page.selectOption('#strikeMode', 'normal');
        await page.click('#strikeStart');
        for (let i = 0; i < 4; i++) await page.click('[data-action="strike"]');
        assert.equal(await page.locator('[data-action="strike"]').isDisabled(), true);
        await page.click('[data-action="solidarity"]');
        assert.equal(await page.locator('[data-action="strike"]').isEnabled(), true);
        for (const theme of ['dark', 'light']) {
            await page.evaluate(value => localStorage.setItem('theme', value), theme);
            for (const width of [360, 390, 1280]) {
                await page.setViewportSize({ width, height: 900 });
                for (const url of ['/games/', '/games/strike/']) {
                    await page.goto(origin + url);
                    if (url.includes('strike')) await page.click('#strikeStart');
                    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), theme + ' ' + width + ' ' + url);
                }
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/tmp/strike-mobile.png', fullPage: true });
        await page.setViewportSize({ width: 1280, height: 1000 });
        await page.screenshot({ path: '/tmp/strike-desktop.png', fullPage: true });
        // Disabled storage must not prevent a complete game.
        await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('disabled'); } }); });
        await page.goto(origin + '/games/strike/');
        await page.click('#strikeStart');
        await page.click('[data-action="bargain"]');
        await page.getByRole('button', { name: '임금 중심의 안 수락' }).click();
        assert.equal(await page.locator('#strikeResult').isVisible(), true);
        assert.match(await page.locator('#strikeScore').textContent(), /저장/);
        assert.deepEqual(errors, []);
        console.log('Game routes, English entry links, both wins, deadline, affordability, replay, blocked storage and mobile/light/dark layouts passed.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
