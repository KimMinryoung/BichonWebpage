const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { createGameTestServer } = require('./lib/game-test-server');
/* global document, window, localStorage */
async function main() {
    const { server, origin } = await createGameTestServer();
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('dialog', dialog => dialog.accept());
        await page.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
        await page.goto(origin + '/games/');
        const choices = page.locator('.game-cta');
        assert.equal(await choices.count(), 2);
        for (const choice of await choices.all()) assert.ok((await choice.boundingBox()).y + (await choice.boundingBox()).height <= 844, 'both play choices fit mobile');
        await page.goto(origin + '/nonogram/');
        await page.waitForSelector('#grid .cell');
        assert.equal(await page.locator('#puzzleSize').textContent(), '5 × 5');
        await page.locator('#nonoGuide summary').click();
        assert.equal(await page.locator('#nonoGuide').getAttribute('open'), '');
        await page.locator('#nonoGuide summary').click();
        // Keyboard movement and mode toggle, stroke undo/redo, reload.
        const cell = (r, c) => page.locator(`.cell[data-row="${r}"][data-col="${c}"]`);
        await cell(0, 0).focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Space');
        assert.ok(await cell(0, 1).evaluate(n => n.classList.contains('filled')));
        await page.click('#nonoUndo'); assert.equal(await page.locator('.cell.filled').count(), 0);
        await page.click('#nonoRedo'); assert.equal(await page.locator('.cell.filled').count(), 1);
        await page.reload(); await page.waitForSelector('.cell.filled');
        await page.click('#resetButton');
        const first = await cell(0, 0).boundingBox(), last = await cell(0, 4).boundingBox();
        await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2); await page.mouse.down();
        await page.mouse.move(last.x + last.width / 2, last.y + last.height / 2, { steps: 12 }); await page.mouse.up();
        assert.equal(await page.locator('.cell.filled').count(), 5);
        await page.click('#nonoUndo'); assert.equal(await page.locator('.cell.filled').count(), 0, 'one undo removes whole stroke');
        await page.click('#nonoRedo'); assert.equal(await page.locator('.cell.filled').count(), 5);
        // Right mouse always marks empty, and incorrect markings prevent hints.
        await cell(1, 0).click({ button: 'right' });
        assert.ok(await cell(1, 0).evaluate(n => n.classList.contains('marked')));
        await page.click('#nonoHint'); assert.match(await page.locator('#nonoHintMessage').textContent(), /맞지 않/);
        assert.equal(await page.locator('.cell.filled').count(), 5);
        await page.click('#nonoUndo'); await page.click('#nonoHint');
        assert.match(await page.locator('#nonoHintMessage').textContent(), /배치에서/);
        assert.equal(await page.locator('.cell.filled').count(), 6);
        // Solve through the UI, then preserve the question stage across reloads.
        const puzzle = require('../public/puzzles/workers-hammer/puzzle.json');
        for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
            if (puzzle.solution[r][c] && !await cell(r, c).evaluate(n => n.classList.contains('filled'))) await cell(r, c).click();
        }
        assert.equal(await page.locator('#solutionPanel').isVisible(), true);
        assert.equal(await page.locator('#complete').isVisible(), false);
        assert.match(await page.locator('[data-puzzle-id="workers-hammer"]').getAttribute('aria-label'), /질문 남음/);
        await page.locator('.nono-question').nth(0).locator('button').nth(puzzle.questions[0].correct).click();
        await page.reload(); await page.waitForSelector('.nono-answer.correct');
        assert.equal(await page.locator('.nono-answer.correct').count(), 1);
        await page.locator('.nono-question').nth(1).locator('button').nth(puzzle.questions[1].correct).click();
        assert.equal(await page.locator('#complete').isVisible(), true);
        await page.reload(); await page.waitForSelector('#complete:not([hidden])');
        assert.equal(await page.locator('.nono-answer.correct').count(), 2);
        await page.goto(origin + '/games/');
        assert.match(await page.locator('#gamesNonogramProgress').textContent(), /1개 완료/);
        // Last unfinished is used unless an explicit deep link is provided.
        await page.goto(origin + '/nonogram/?p=workers-banner'); await page.waitForSelector('#grid .cell');
        await cell(0, 0).click();
        await page.goto(origin + '/nonogram/'); await page.waitForSelector('.cell.filled');
        assert.equal(await page.locator('#puzzleHintTitle').textContent(), '함께 드는 표식');
        await page.goto(origin + '/nonogram/?p=workers-factory'); await page.waitForSelector('#grid .cell');
        assert.equal(await page.locator('#puzzleSize').textContent(), '10 × 10');
        // Legacy solved IDs reveal the picture, never claim quiz completion.
        await page.evaluate(() => { localStorage.setItem('nonogram-solved-v1', '["cyber-hammer"]'); });
        await page.goto(origin + '/nonogram/?p=cyber-hammer'); await page.waitForSelector('#solutionPanel:not([hidden])');
        assert.equal(await page.locator('#complete').isVisible(), false);
        // Failed fetch retries the requested puzzle, and late responses cannot win.
        let fail = true;
        await page.route('**/puzzles/workers-school/puzzle.json', r => fail ? r.fulfill({ status: 503, body: '{}' }) : r.continue());
        await page.goto(origin + '/nonogram/?p=workers-school'); await page.waitForSelector('#nonoRetry:not([hidden])');
        fail = false; await page.click('#nonoRetry'); await page.waitForSelector('#grid .cell');
        assert.equal(await page.locator('#puzzleSize').textContent(), '15 × 15');
        await page.route('**/puzzles/workers-globe/puzzle.json', async r => { await new Promise(resolve => setTimeout(resolve, 500)); await r.continue(); });
        await page.locator('[data-puzzle-id="workers-globe"]').click();
        if (await page.locator('[data-level="beginner"]').getAttribute('open') === null) await page.locator('[data-level="beginner"] summary').click();
        await page.locator('[data-puzzle-id="workers-banner"]').click();
        await page.waitForFunction(() => document.getElementById('puzzleHintTitle').textContent === '함께 드는 표식');
        await page.waitForTimeout(650);
        assert.equal(await page.locator('#puzzleHintTitle').textContent(), '함께 드는 표식');
        // Responsive visuals and enlarged board remain inside a scroll container.
        for (const theme of ['dark', 'light']) for (const width of [360, 390, 1280]) {
            await page.setViewportSize({ width, height: 844 });
            for (const route of ['/games/', '/nonogram/?p=workers-school', '/games/strike/']) {
                await page.goto(origin + route);
                await page.evaluate(value => document.documentElement.setAttribute('data-theme', value), theme);
                if (route.includes('nonogram')) {
                    await page.waitForSelector('#grid .cell'); await page.click('#nonoZoom');
                    await page.waitForFunction(() => Math.round(document.querySelector('.cell').getBoundingClientRect().width) === 36);
                }
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} ${theme} ${width} overflow`);
                await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
                if (width === 390 || width === 1280) await page.screenshot({ path: `/tmp/games-new-${route.includes('nonogram') ? 'nonogram' : route.includes('strike') ? 'strike' : 'catalog'}-${theme}-${width}.png`, fullPage: true });
            }
        }
        // Scenario setup, placement persistence, migration, and overwrite protection.
        await page.goto(origin + '/games/strike/');
        await page.selectOption('#strikeScenario', 'rebuild'); await page.click('#strikeStart');
        assert.match(await page.locator('#strikeObjectives').textContent(), /70%/);
        await page.locator('[data-map-job="rest"]').click({ position: { x: 16, y: 12 } });
        await page.reload(); await page.click('#strikeContinue');
        assert.match(await page.locator('[data-crew="0"]').textContent(), /휴식처/);
        await page.goto(origin + '/games/'); await page.click('#gamesStrikeResume');
        assert.equal(await page.locator('#strikePlay').isVisible(), true);
        await page.evaluate(save => { localStorage.removeItem('strike-game-v4-save'); localStorage.setItem('strike-game-v3-save', JSON.stringify(save)); }, require('./fixtures/strike-v3-save.json'));
        await page.goto(origin + '/games/strike/'); await page.click('#strikeContinue');
        assert.match(await page.locator('#strikeDay').textContent(), /DAY 05/);
        assert.ok(await page.evaluate(() => localStorage.getItem('strike-game-v3-save')), 'legacy original is preserved');
        await page.goto(origin + '/games/strike/');
        page.removeAllListeners('dialog'); page.once('dialog', d => d.dismiss());
        await page.click('#strikeStart'); assert.equal(await page.locator('#strikeSetup').isVisible(), true);
        // Corrupt board/answer records are ignored and reset to a playable board.
        await page.evaluate(() => localStorage.setItem('nonogram-progress-v2', JSON.stringify({ 'workers-hammer': { cells: [[999]], answers: { 0: 999 }, completed: true } })));
        await page.goto(origin + '/nonogram/?p=workers-hammer'); await page.waitForSelector('#grid .cell');
        assert.equal(await page.locator('.cell.filled').count(), 0);
        assert.equal(await page.locator('#complete').isVisible(), false);
        await page.evaluate(() => localStorage.setItem('nonogram-progress-v2', '{broken'));
        await page.reload(); await page.waitForSelector('#grid .cell');
        assert.equal(await page.locator('.cell').count(), 25);
        const noScript = await browser.newContext({ javaScriptEnabled: false });
        const staticPage = await noScript.newPage();
        await staticPage.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
        await staticPage.goto(origin + '/games/'); await staticPage.locator('.game-cta').last().click();
        assert.ok(staticPage.url().endsWith('/nonogram/'));
        assert.match(await staticPage.locator('noscript').textContent(), /JavaScript/);
        await noScript.close();
        // Touch mode and disabled storage are checked in an isolated context.
        const touch = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
        await touch.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
        const phone = await touch.newPage(); phone.on('pageerror', e => errors.push(e.message));
        await phone.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
        await phone.goto(origin + '/nonogram/'); await phone.waitForSelector('#grid .cell');
        await phone.tap('#modeMark'); await phone.locator('.cell').first().tap();
        assert.equal(await phone.locator('.cell.marked').count(), 1);
        assert.match(await phone.locator('#nonoSaveNotice').textContent(), /저장할 수 없/);
        assert.equal(await phone.locator('#touchGuide').isVisible(), true);
        await phone.tap('#nonoUndo'); assert.equal(await phone.locator('.cell.marked').count(), 0);
        await touch.close();
        assert.deepEqual(errors, []);
        console.log('Games UI: catalog, onboarding, puzzle strokes/hints/progress/retries, migration, scenarios, responsive themes, touch and blocked storage passed.');
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
