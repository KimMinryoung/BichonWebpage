// @requires server:PREVIEW_URL=http://127.0.0.1:3001
/* global document, innerWidth */
// The workshop activities in the lesson player, run against scripts/dev-preview.
// The sample lesson (tests/fixtures/commulingo-workshop-sample.json) is served
// in place of an existing lesson, so no course has to exist in the database.
// SHOTS=<dir> also saves a screenshot of every step.
const { launchChromium } = require('../lib/browser');
const assert = require('node:assert/strict');
const path = require('node:path');
const sample = require('../fixtures/commulingo-workshop-sample.json');

const BOOK = 'capital-vol1';
const LESSON = 'capital-v1-ch01-basic';

(async () => {
    const browser = await launchChromium({ headless: true });
    const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3001';
    const shots = process.env.SHOTS;
    const chapter = sample.chapters[0];
    try {
        for (const [width, name] of [[360, 'm'], [1280, 'd']]) {
            const context = await browser.newContext({ viewport: { width, height: 860 }, extraHTTPHeaders: { 'x-commulingo-test': '1' } });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.route('**/commulingo/lesson/' + LESSON + '*', async route => {
                const response = await route.fetch();
                const body = await response.json();
                body.lesson = { ...body.lesson, format: 'workshop', takeaway: chapter.takeaway, conceptBrief: null, conceptMap: null, diagram: null,
                    questions: JSON.parse(JSON.stringify(chapter.lessons[0].questions)) };
                await route.fulfill({ response, json: body });
            });
            await page.route('**/commulingo/progress**', route => route.request().method() === 'GET' ? route.continue() : route.fulfill({ status: 204 }));
            let step = 0;
            const shot = async label => {
                step += 1;
                if (shots) await page.locator('#commuQuiz').screenshot({ path: path.join(shots, `workshop-${name}-${String(step).padStart(2, '0')}-${label}.png`) });
            };
            const next = page.locator('#commuNextBtn');
            const fits = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no sideways scroll at ' + width);

            await page.goto(`${base}/commulingo/book/${BOOK}#lesson=${LESSON}`, { waitUntil: 'networkidle' });
            // No concept brief: the lesson opens on the first activity.
            await page.waitForSelector('#commuChoices.is-activity .commu-drill-order');
            assert.equal(await page.locator('#commuIntro:not(.is-hidden)').count(), 0);

            // q1 order: bubble the items into the stored order, then check.
            const wanted = chapter.lessons[0].questions[0].items.ko;
            assert.equal(await next.textContent(), '확인');
            await shot('order');
            for (let pass = 0; pass < wanted.length; pass += 1) {
                for (let target = 0; target < wanted.length; target += 1) {
                    const labels = await page.locator('.commu-drill-order-label').allTextContents();
                    const at = labels.indexOf(wanted[target]);
                    for (let i = at; i > target; i -= 1) await page.locator('.commu-drill-order-item').nth(i).locator('button').first().click();
                }
            }
            await next.click();
            assert.equal(await page.locator('.commu-drill-order-item.is-correct').count(), wanted.length);
            assert.equal(await page.locator('#commuFeedback.is-wrong').count(), 0);
            assert.equal(await page.locator('.commu-drill-order-reveal').count(), wanted.length, 'dates shown with the order');
            assert.equal(await page.locator('.commu-activity-answer').count(), 0, 'no second list when the order is right');
            await shot('order-checked');
            await fits();
            await next.click();

            // q2 multiple choice, answered wrong on purpose (retried later).
            await page.waitForSelector('#commuChoices:not(.is-activity) .commu-choice');
            const correctChoice = chapter.lessons[0].questions[1].choices.ko[0];
            await page.locator('.commu-choice').filter({ hasNotText: correctChoice }).first().click();
            assert.equal(await page.locator('#commuFeedback.is-wrong').count(), 1);
            await shot('choice-wrong');
            await next.click();

            // q3 sort: one item goes to the wrong group.
            await page.waitForSelector('.commu-sort-pool .commu-sort-item');
            assert.equal(await next.isDisabled(), true, 'check waits until every item is placed');
            await shot('sort');
            const sortItems = chapter.lessons[0].questions[2].items;
            for (const [index, item] of sortItems.entries()) {
                await page.locator('.commu-sort-pool .commu-sort-item', { hasText: item.ko }).click();
                const group = index === 0 ? 1 : item.group;
                await page.locator('.commu-sort-target').nth(group).click();
            }
            await shot('sort-placed');
            await next.click();
            assert.equal(await page.locator('.commu-sort-item.is-wrong').count(), 1);
            assert.equal(await page.locator('.commu-sort-item.is-correct').count(), sortItems.length - 1);
            assert.equal(await page.locator('#commuFeedback.is-wrong').count(), 1);
            await shot('sort-checked');
            await fits();
            await next.click();

            // q4 cloze: a wrong word first, taken back, then the right one.
            await page.waitForSelector('.commu-cloze-blank');
            assert.equal(await page.locator('#commuPassage .commu-passage-context').count(), 1, 'the scene line is shown');
            assert.equal(await next.isDisabled(), true);
            await shot('cloze');
            await page.locator('.commu-cloze-word', { hasText: '생산수단' }).click();
            assert.equal(await next.isDisabled(), false);
            await page.locator('.commu-cloze-blank').click();
            assert.equal(await next.isDisabled(), true, 'a cleared blank blocks the check again');
            await page.locator('.commu-cloze-word', { hasText: '국가기구' }).click();
            await next.click();
            assert.equal(await page.locator('.commu-cloze-blank.is-correct').count(), 1);
            assert.equal(await page.locator('#commuFeedback .commu-source a').count(), 1, 'the source link follows the explanation');
            await shot('cloze-checked');
            await fits();
            await next.click();

            // q5 multiple choice, right.
            await page.locator('.commu-choice', { hasText: chapter.lessons[0].questions[4].choices.ko[0] }).click();
            await next.click();

            // Result: 3 of 5, the takeaway, and a retry of the two missed.
            await page.waitForFunction(() => document.querySelector('#commuNextBtn').getAttribute('data-finished') === 'retry');
            assert.match(await page.locator('#commuFeedback').textContent(), /3 \/ 5/);
            assert.match(await page.locator('#commuFeedback').textContent(), /이번 편에서 구별한 것/);
            await shot('result');
            await next.click();
            await page.locator('.commu-choice', { hasText: correctChoice }).click();
            await next.click();
            await page.waitForSelector('.commu-sort-pool .commu-sort-item');
            for (const item of sortItems) {
                await page.locator('.commu-sort-pool .commu-sort-item', { hasText: item.ko }).click();
                await page.locator('.commu-sort-target').nth(item.group).click();
            }
            await next.click();
            await next.click();
            await page.waitForFunction(() => document.querySelector('#commuNextBtn').getAttribute('data-finished') === '1');
            await shot('retry-done');

            for (const theme of ['dark', 'light']) {
                await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
                await fits();
            }
            assert.deepEqual(errors, []);
            await context.close();
        }
        console.log('CommuLingo workshop activities: order, sort, cloze, retry and takeaway passed');
    } finally {
        await browser.close();
    }
})().catch(err => { console.error(err); process.exit(1); });
