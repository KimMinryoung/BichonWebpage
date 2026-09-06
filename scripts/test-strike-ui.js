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
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const mode of ['normal', 'hard']) {
            await page.selectOption('#strikeMode', mode);
            await page.click('#strikeStart');
            for (let day = 1; day <= 12; day++) {
                const crews = await page.evaluate(() => JSON.parse(localStorage.getItem('strike-game-v2-save')).crews);
                crews.sort((a, b) => a.fatigue - b.fatigue);
                const jobs = ['picket', 'picket', 'picket', 'organize', 'solidarity', 'rest'];
                for (let i = 0; i < 6; i++) {
                    await page.click('[data-crew="' + crews[i].id + '"]');
                    await page.click('[data-job="' + jobs[i] + '"]');
                }
                assert.equal(await page.locator('[data-crew-sprite]').count(), 6);
                await page.click('#strikeAdvance');
                assert.equal(await page.locator('#strikeReview').isVisible(), true);
                if (day === 3) {
                    await page.reload();
                    await page.click('#strikeContinue');
                    assert.equal(await page.locator('#strikeReview').isVisible(), true);
                }
                if (day < 12) await page.click('#strikeNext');
            }
            assert.equal(await page.locator('#strikeOffers').isVisible(), true);
            await page.locator('#strikeOfferCards button').first().click();
            assert.match(await page.locator('#strikeResultTitle').textContent(), /세 가지 요구/);
            await page.click('#strikeRestart');
        }
        // A complete campaign without accepting an offer reaches the final deadline.
        await page.click('#strikeStart');
        for (let day = 1; day <= 12; day++) {
            const crews = await page.evaluate(() => JSON.parse(localStorage.getItem('strike-game-v2-save')).crews);
            crews.sort((a, b) => a.fatigue - b.fatigue);
            for (let i = 0; i < 6; i++) {
                await page.click('[data-crew="' + crews[i].id + '"]');
                await page.click('[data-job="' + ['picket', 'picket', 'picket', 'organize', 'solidarity', 'rest'][i] + '"]');
            }
            await page.click('#strikeAdvance');
            await page.click('#strikeNext');
        }
        assert.match(await page.locator('#strikeResultText').textContent(), /12일/);
        await page.click('#strikeRestart');
        // Animated progression is locked, skippable, and stored before playback finishes.
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.click('#strikeStart');
        await page.click('#strikeAdvance');
        assert.equal(await page.locator('#strikeSkip').isVisible(), true);
        assert.equal(await page.locator('[data-crew="0"]').isDisabled(), true);
        await page.click('#strikeSkip');
        assert.equal(await page.locator('#strikeReview').isVisible(), true);
        await page.click('#strikeNext');
        await page.locator('[data-map-job="organize"]').click();
        assert.match(await page.locator('[data-crew="0"]').textContent(), /조직 천막/);
        // Keyboard selection and reassignment work without dragging.
        await page.locator('[data-crew="0"]').focus();
        await page.keyboard.press('Enter');
        await page.locator('[data-job="rest"]').focus();
        await page.keyboard.press('Enter');
        assert.match(await page.locator('[data-crew="0"]').textContent(), /휴식처/);
        for (const theme of ['dark', 'light']) {
            await page.evaluate(value => localStorage.setItem('theme', value), theme);
            for (const width of [360, 390, 1280]) {
                await page.setViewportSize({ width, height: 900 });
                for (const url of ['/games/', '/games/strike/']) {
                    await page.goto(origin + url);
                    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'setup ' + theme + ' ' + width);
                    if (url.includes('strike')) {
                        await page.click('#strikeStart');
                        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'play ' + theme + ' ' + width);
                    }
                }
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/tmp/strike-mobile.png', fullPage: true });
        await page.setViewportSize({ width: 1280, height: 1000 });
        await page.screenshot({ path: '/tmp/strike-desktop.png', fullPage: true });
        // Corrupted and disabled storage cannot prevent play.
        await page.evaluate(() => localStorage.setItem('strike-game-v2-save', '{bad'));
        await page.reload();
        assert.equal(await page.locator('#strikeContinue').isVisible(), false);
        await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('disabled'); } }); });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(origin + '/games/strike/');
        await page.click('#strikeStart');
        await page.click('#strikeAdvance');
        await page.click('#strikeBargain');
        await page.locator('#strikeOfferCards button').last().click();
        assert.equal(await page.locator('#strikeResult').isVisible(), true);
        assert.match(await page.locator('#strikeAnnouncement').textContent(), /저장/);
        assert.deepEqual(errors, []);
        console.log('Strike v2 routes, both wins, deadline, restore, animation, keyboard, blocked storage and mobile/light/dark layouts passed.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
