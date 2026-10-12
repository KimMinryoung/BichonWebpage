// Browser smoke test against the real game routes/templates, without DB/Redis.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { createGameTestServer } = require('./lib/game-test-server');
/* global window, document, localStorage */

async function main() {
    const { server, origin } = await createGameTestServer();
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        page.on('dialog', dialog => dialog.accept());
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        for (const url of ['/games/', '/games/strike/', '/nonogram/', '/en/games/', '/en/games/strike/']) {
            const response = await page.goto(origin + url);
            assert.equal(response.status(), 200, url);
        }
        for (const url of ['/games', '/games/strike']) {
            const response = await page.request.get(origin + url + '?x=1', { maxRedirects: 0 });
            assert.equal(response.status(), 301);
            assert.equal(response.headers().location, url + '/?x=1');
        }
        // Korean-only menus have no English URL; /en/ sends the visitor to the Korean page.
        const english = await page.request.get(origin + '/en/games/strike/', { maxRedirects: 0 });
        assert.ok([301, 302].includes(english.status()));
        assert.match(english.headers().location, /^\/games\/strike\/?$/);
        await page.goto(origin + '/games/');
        assert.equal(await page.locator('.game-card').count(), 2);
        await page.locator('.game-card h2 a').first().click();
        assert.ok(page.url().endsWith('/games/strike/'));
        await page.emulateMedia({ reducedMotion: 'reduce' });
        // Every generated location asset is served and decodes successfully.
        for (const job of ['organize', 'solidarity', 'picket', 'rest']) {
            const asset = await page.request.get(origin + '/images/strike/' + job + '-v1.webp');
            assert.equal(asset.status(), 200);
            assert.match(asset.headers()['content-type'], /image\/webp/);
        }
        // Direct map input: real mouse dragging, touch dragging, tap/tap and cancellation.
        async function mapPoint(target, x, y) {
            return target.locator('#strikeScene svg').evaluate((root, coords) => {
                const p = root.createSVGPoint(); p.x = coords.x; p.y = coords.y;
                const screen = p.matrixTransform(root.getScreenCTM()); return { x: screen.x, y: screen.y };
            }, { x, y });
        }
        // Centre of a location tile; the map layout differs between phones and wide screens.
        async function zonePoint(target, job) {
            return target.locator(`[data-map-job="${job}"] .strike-place-ground`).evaluate(n => {
                const b = n.getBBox(), root = n.ownerSVGElement, p = root.createSVGPoint();
                p.x = b.x + b.width / 2; p.y = b.y + b.height * .75;
                const screen = p.matrixTransform(root.getScreenCTM()); return { x: screen.x, y: screen.y };
            });
        }
        async function personPoint(target, id) {
            const person = target.locator('[data-crew-sprite="' + id + '"]');
            return mapPoint(target, Number(await person.getAttribute('data-x')), Number(await person.getAttribute('data-y')));
        }
        // The reader strategy from test-strike.js, run in the page, returns the jobs to place.
        const planDay = target => target.evaluate(() => {
            const g = window.StrikeGame; let s = JSON.parse(localStorage.getItem('strike-game-v5-save'));
            s.crews.filter(c => !c.injured).forEach(c => { s = g.assign(s, c.id, 'rest'); });
            const pool = trait => s.crews.filter(c => !c.injured && c.job === 'rest' && c.fatigue < 60).sort((a, b) => (b.trait === trait) - (a.trait === trait) || a.fatigue - b.fatigue);
            const fill = (job, done, trait) => { while (!done()) { const c = pool(trait)[0]; if (!c) return; s = g.assign(s, c.id, job); } };
            const target = { scabs: ['picket', 'vanguard'], thugs: ['picket', 'vanguard'], buyout: ['organize', 'orator'], smear: ['solidarity', 'publicist'], seizure: ['solidarity', 'treasurer'], lockout: ['organize', 'orator'] };
            for (const move of g.threats(s)) fill(target[move][0], () => g.counter(s, move).ok, target[move][1]);
            fill('picket', () => g.effects(s).counts.picket >= 2, 'vanguard');
            fill('organize', () => g.effects(s).counts.organize >= 1, 'orator');
            fill('solidarity', () => g.effects(s).counts.solidarity >= (s.fund < 60 ? 2 : 1), 'treasurer');
            return s.crews.map(c => c.injured ? null : c.job);
        });
        const planTable = target => target.evaluate(() => {
            const g = window.StrikeGame; let s = JSON.parse(localStorage.getItem('strike-game-v5-save'));
            const used = new Set(), moves = [];
            for (const d of ['intensity', 'wage', 'hours', 'wage', 'hours', 'suit', 'wage', 'hours']) {
                const pv = g.preview(s)[d];
                if (pv.to >= g.demands[d].tiers.length) continue;
                const need = g.resistance(s, d, pv.to) - pv.left;
                const cards = s.table.hand.filter(c => !used.has(c.id)).sort((a, b) => g.cardValue(s.table, b, d) - g.cardValue(s.table, a, d));
                let sum = 0; const pick = [];
                for (const c of cards) { if (sum >= need) break; sum += g.cardValue(s.table, c, d); pick.push(c); }
                if (sum < need) continue;
                pick.forEach(c => { used.add(c.id); s = g.place(s, c.id, d); moves.push([c.id, d]); });
            }
            return moves;
        });
        async function placeAll(target, jobs) {
            for (const [id, job] of jobs.entries()) {
                if (!job) continue;
                await target.click('[data-crew="' + id + '"]');
                await target.locator('[data-map-job="' + job + '"]').click({ position: { x: 16, y: 12 } });
            }
        }
        // Plays a campaign through the page controls. Returns once the result is shown.
        async function playCampaign(target, settleWhenWon = true) {
            for (let guard = 0; guard < 14; guard++) {
                await placeAll(target, await planDay(target));
                await target.click('#strikeAdvance');
                assert.equal(await target.locator('#strikeSheet').isVisible(), true, 'evening sheet opens');
                if (await target.locator('#strikeResult').isVisible()) return;
                const toTable = target.locator('#strikeSheet .strike-sheet-actions button', { hasText: '교섭 테이블로' });
                if (await toTable.count()) {
                    await toTable.click();
                    for (const [card, demand] of await planTable(target)) {
                        await target.locator('.strike-cards .strike-card').nth(card).click();
                        await target.locator('[data-demand="' + demand + '"]').click();
                    }
                    await target.locator('#strikeSheet .strike-sheet-actions .strike-primary').click();
                    if (await target.locator('#strikeResult').isVisible()) return;
                    const settle = target.locator('#strikeSheet button', { hasText: '타결하기' });
                    if (settleWhenWon && await settle.evaluate(n => n.classList.contains('strike-primary'))) { await settle.click(); return; }
                    await target.locator('#strikeSheet button', { hasText: '파업 이어가기' }).click();
                } else await target.locator('#strikeSheet .strike-sheet-actions .strike-primary').click();
            }
            throw new Error('campaign did not end');
        }
        assert.equal(await page.locator('#strikeStart').textContent(), '새 게임 시작');
        await page.click('#strikeStart');
        assert.equal(await page.locator('#strikeScene image.strike-location-art').count(), 4);
        assert.match(await page.locator('#strikeThreat').innerText(), /지켜보고/, 'day one explains the threat panel');
        assert.equal(await page.locator('#strikeForecast dd').count(), 5, 'live forecast');
        await page.locator('#strikeScene').scrollIntoViewIfNeeded();
        let source = await personPoint(page, 0), dest = await zonePoint(page, 'organize');
        await page.mouse.move(source.x, source.y); await page.mouse.down();
        await page.mouse.move(dest.x, dest.y, { steps: 8 });
        assert.equal(await page.locator('[data-map-job="organize"].is-drop-target').count(), 1);
        await page.mouse.up();
        assert.match(await page.locator('[data-crew="0"]').textContent(), /조직 천막/);
        assert.match(await page.locator('[data-label-job="organize"] .strike-place-count').textContent(), /2조 · \+\d+%p/, 'zone shows its live output');
        source = await personPoint(page, 0); dest = await mapPoint(page, 5, 5);
        await page.mouse.move(source.x, source.y); await page.mouse.down(); await page.mouse.move(dest.x, dest.y, { steps: 8 }); await page.mouse.up();
        assert.match(await page.locator('[data-crew="0"]').textContent(), /조직 천막/, 'outside drop keeps original assignment');
        source = await personPoint(page, 0); dest = await zonePoint(page, 'rest');
        await page.mouse.move(source.x, source.y); await page.mouse.down(); await page.mouse.move(dest.x, dest.y, { steps: 8 });
        await page.keyboard.press('Escape'); await page.mouse.up();
        assert.match(await page.locator('[data-crew="0"]').textContent(), /조직 천막/, 'escape cancels drag');
        // Keyboard selection and reassignment work without dragging.
        await page.locator('[data-crew-handle="1"]').focus(); await page.keyboard.press('Enter');
        await page.locator('[data-map-job="rest"]').focus(); await page.keyboard.press('Enter');
        assert.match(await page.locator('[data-crew="1"]').textContent(), /휴식처/);
        // Day two telegraphs a threat on the road and on its target, with a live counter check.
        await page.click('#strikeAdvance');
        assert.equal(await page.locator('#strikeSheet').isVisible(), true);
        assert.equal(await page.locator('#strikeSheet .strike-day-metric').count(), 5);
        await page.locator('#strikeSheet .strike-primary').click();
        assert.equal(await page.locator('#strikeSheet').isVisible(), false);
        const threat = await page.evaluate(() => window.StrikeGame.threats(JSON.parse(localStorage.getItem('strike-game-v5-save')))[0]);
        assert.equal(await page.locator(`.strike-threat-token[data-threat="${threat}"]`).count(), 1);
        const target = await page.evaluate(m => window.StrikeGame.moves[m].target, threat);
        assert.equal(await page.locator(`[data-map-job="${target}"].is-event-target`).count(), 1);
        assert.match(await page.locator('#strikeThreat .strike-threat-status b').innerText(), /막을 수 있음|부족/);
        // Touch: tap placement, drag, cancelled drag, and no page scroll while dragging.
        const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
        const touch = await touchContext.newPage();
        touch.on('pageerror', e => errors.push(e.message));
        await touch.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
        await touch.goto(origin + '/games/strike/'); await touch.click('#strikeStart');
        await touch.locator('#strikeScene').evaluate(n => n.scrollIntoView({ block: 'center' }));
        source = await personPoint(touch, 0); dest = await zonePoint(touch, 'organize');
        await touch.touchscreen.tap(source.x, source.y); await touch.touchscreen.tap(dest.x, dest.y);
        assert.match(await touch.locator('[data-crew="0"]').textContent(), /조직 천막/, 'tap crew then tap location');
        const cdp = await touchContext.newCDPSession(touch);
        source = await personPoint(touch, 0); dest = await zonePoint(touch, 'rest');
        const scrollBefore = await touch.evaluate(() => window.scrollY);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...source, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...dest, id: 1 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        assert.match(await touch.locator('[data-crew="0"]').textContent(), /휴식처/, 'touch drag');
        assert.equal(await touch.evaluate(() => window.scrollY), scrollBefore, 'drag does not scroll page');
        source = await personPoint(touch, 0); dest = await zonePoint(touch, 'organize');
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...source, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...dest, id: 2 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
        assert.match(await touch.locator('[data-crew="0"]').textContent(), /휴식처/, 'cancelled touch restores position');
        for (let id = 0; id < 6; id++) {
            source = await personPoint(touch, id); dest = await zonePoint(touch, 'rest');
            await touch.touchscreen.tap(source.x, source.y); await touch.touchscreen.tap(dest.x, dest.y);
        }
        for (let id = 0; id < 6; id++) {
            source = await personPoint(touch, id); await touch.touchscreen.tap(source.x, source.y);
            assert.equal(await touch.locator('[data-crew-sprite="' + id + '"]').getAttribute('aria-pressed'), 'true', 'six crews in one place stay touchable');
        }
        const sticky = await touch.locator('#strikeCommand').evaluate(n => window.getComputedStyle(n).position);
        assert.equal(sticky, 'sticky', 'mobile keeps the day button in reach');
        // Injured crews are locked to the rest area and shown with a bandage.
        await touch.evaluate(() => {
            const g = window.StrikeGame;
            for (let seed = 0; seed < 400; seed++) {
                let s = g.next(g.advance(g.start('normal', seed)).state);
                if (g.threats(s)[0] !== 'thugs') continue;
                s.crews.forEach(c => { s = g.assign(s, c.id, c.id === 1 ? 'picket' : 'rest'); });
                s = g.next(g.advance(s).state);
                localStorage.setItem('strike-game-v5-save', JSON.stringify(s)); return;
            }
            throw new Error('No thug seed found');
        });
        await touch.reload(); await touch.click('#strikeContinue');
        await touch.locator('#strikeScene').evaluate(n => n.scrollIntoView({ block: 'center' }));
        assert.equal(await touch.locator('[data-crew-sprite="1"].is-injured').count(), 1);
        assert.match(await touch.locator('[data-crew="1"]').textContent(), /부상/);
        source = await personPoint(touch, 1); dest = await zonePoint(touch, 'picket');
        await touch.touchscreen.tap(source.x, source.y); await touch.touchscreen.tap(dest.x, dest.y);
        assert.match(await touch.locator('[data-crew="1"]').textContent(), /부상/, 'an injured crew cannot be moved');
        await touch.screenshot({ path: '/tmp/strike-touch-injured.png', fullPage: true });
        await touchContext.close();
        // Full campaigns through the UI: bargaining cards, reload mid-table, settlement and the result.
        await page.goto(origin + '/games/strike/');
        await page.selectOption('#strikeMode', 'normal');
        await page.click('#strikeStart');
        for (let day = 1; day <= 3; day++) { await placeAll(page, await planDay(page)); await page.click('#strikeAdvance'); await page.locator('#strikeSheet .strike-primary').click(); }
        await placeAll(page, await planDay(page)); await page.click('#strikeAdvance');
        await page.locator('#strikeSheet button', { hasText: '교섭 테이블로' }).click();
        assert.ok(await page.locator('.strike-demand-row').count() === 4);
        assert.ok(await page.locator('.strike-tactic').isVisible());
        const firstMove = (await planTable(page))[0];
        if (firstMove) {
            await page.locator('.strike-cards .strike-card').nth(firstMove[0]).click();
            await page.locator('[data-demand="' + firstMove[1] + '"]').click();
            assert.equal(await page.locator(`[data-demand="${firstMove[1]}"] .strike-placed-card`).count(), 1);
            await page.reload(); await page.click('#strikeContinue');
            await page.locator('#strikeSheet button', { hasText: '교섭 테이블로' }).click();
            assert.equal(await page.locator(`[data-demand="${firstMove[1]}"] .strike-placed-card`).count(), 1, 'placed cards survive a reload');
            await page.locator('.strike-cards .strike-card').nth(firstMove[0]).click();
            assert.equal(await page.locator('.strike-placed-card').count(), 0, 'tapping a placed card takes it back');
        }
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#strikeAdvance').textContent(), '교섭 테이블 열기', 'a closed table can be reopened');
        await page.click('#strikeAdvance');
        await page.locator('#strikeSheet .strike-sheet-actions .strike-primary').click();
        await page.locator('#strikeSheet button', { hasText: '파업 이어가기' }).click();
        await playCampaign(page);
        assert.equal(await page.locator('#strikeResult').isVisible(), true);
        assert.match(await page.locator('#strikeResult').innerText(), /요구 달성|승리/);
        assert.match(await page.locator('.strike-stars').textContent(), /★/);
        await page.screenshot({ path: '/tmp/strike-result.png', fullPage: true });
        await page.locator('#strikeResult button', { hasText: '다른 시나리오' }).click();
        await page.selectOption('#strikeMode', 'hard'); await page.selectOption('#strikeScenario', 'rebuild');
        await page.click('#strikeStart');
        await playCampaign(page, false);
        assert.equal(await page.locator('#strikeResult').isVisible(), true, 'a hard campaign reaches its end');
        assert.ok(await page.evaluate(() => JSON.parse(localStorage.getItem('strike-game-v5-save')).phase) === 'done');
        // Animated progression is locked, skippable, and stored before playback finishes.
        await page.locator('#strikeResult button', { hasText: '같은 조건' }).click();
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.click('#strikeAdvance');
        assert.equal(await page.locator('#strikeSkip').isVisible(), true);
        assert.equal(await page.locator('[data-crew="0"]').isDisabled(), true);
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('strike-game-v5-save')).phase), 'review', 'saved before the animation ends');
        await page.click('#strikeSkip');
        assert.equal(await page.locator('#strikeSheet').isVisible(), true);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const theme of ['dark', 'light']) {
            await page.evaluate(value => localStorage.setItem('theme', value), theme);
            for (const width of [360, 390, 1280]) {
                await page.setViewportSize({ width, height: 900 });
                for (const url of ['/games/', '/games/strike/']) {
                    await page.goto(origin + url);
                    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'setup ' + theme + ' ' + width);
                    if (url.includes('strike')) {
                        await page.click('#strikeContinue');
                        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'play ' + theme + ' ' + width);
                    }
                }
            }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/tmp/strike-mobile.png', fullPage: true });
        await page.setViewportSize({ width: 1280, height: 1000 });
        await page.screenshot({ path: '/tmp/strike-desktop.png', fullPage: true });
        // Corrupted, legacy and disabled storage cannot prevent play.
        await page.evaluate(() => { localStorage.setItem('strike-game-v5-save', '{bad'); localStorage.setItem('strike-game-v4-save', JSON.stringify({ version: 4 })); });
        await page.goto(origin + '/games/strike/');
        assert.equal(await page.locator('#strikeContinue').isVisible(), false);
        assert.match(await page.locator('#strikeSaveNote').textContent(), /새 규칙/);
        assert.ok(await page.evaluate(() => localStorage.getItem('strike-game-v4-save')), 'old save remains intact');
        await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('disabled'); } }); });
        await page.goto(origin + '/games/strike/');
        await page.click('#strikeStart');
        await page.click('#strikeAdvance');
        assert.equal(await page.locator('#strikeSheet').isVisible(), true);
        assert.match(await page.locator('#strikeAnnouncement').textContent(), /저장/);
        assert.deepEqual(errors, []);
        console.log('Strike v5 UI: drag/touch/keyboard placement, telegraphed threats, injuries, bargaining cards with reload, full campaigns, animation lock, responsive layouts and storage fallbacks passed.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
