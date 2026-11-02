// Chat while an answer streams: the send button stops it (keeping the part
// that arrived, without the dropped-connection recovery), and the view
// follows new text only while the reader is at the bottom. The chat API is
// mocked here; marked/DOMPurify (CDN) are stubbed in the page.
const assert = require('node:assert/strict');
const { launchChromium } = require('../lib/browser');
const { createGameTestServer } = require('../lib/game-test-server');
const strings = require('../../config/strings');
const { siteStyleModules } = require('../../utils/site-stylesheets');
/* global document, window */

const PARA = '스트리밍 시험 문단입니다. 긴 답변이 조금씩 도착하는 동안 화면이 어떻게 움직이는지 확인합니다. ';
const streams = [];
let chunksPerAnswer = 80;

function routes(app) {
    app.get('/chat', (req, res) => res.render('public/chat', {
        chatApiUrl: '/api/proxy', pageTitle: 'chat', pageDescription: 'chat', pagePath: '/chat',
        withPersona: strings.withPersona, siteStyleModules,
    }));
    app.get('/api/proxy/personas', (req, res) => res.json({ personas: [{ id: 'cyber-lenin', name: '사이버-레닌' }], default: 'cyber-lenin' }));
    app.post('/api/proxy/chat', (req, res) => {
        const stream = { closedEarly: false, finished: false };
        streams.push(stream);
        res.writeHead(200, { 'Content-Type': 'text/event-stream' });
        const send = event => res.write(`data: ${JSON.stringify(event)}\n\n`);
        send({ type: 'run_started', request_id: `r${streams.length}` });
        let sent = 0, text = '';
        const total = chunksPerAnswer;
        const timer = setInterval(() => {
            if (sent < total) {
                const chunk = sent % 4 === 3 ? `${PARA}\n\n` : PARA;
                text += chunk; send({ type: 'chunk', content: chunk }); sent++;
                return;
            }
            clearInterval(timer);
            send({ type: 'answer', content: text, message_id: 100 + streams.length });
            stream.finished = true;
            res.end();
        }, 40);
        res.on('close', () => { if (!stream.finished) { stream.closedEarly = true; clearInterval(timer); } });
    });
    app.use('/api/proxy', (req, res) => res.json({ history: [], sessions: [] }));
    app.post('/commulingo/chat-links', (req, res) => res.json({ items: null }));
    app.post('/metrics/menu-view', (req, res) => res.status(204).end());
}

async function main() {
    const { server, origin } = await createGameTestServer({ routes });
    const ko = strings.ko.chat;
    let browser;
    try {
        browser = await launchChromium({ headless: true });
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        await context.addInitScript(() => {
            window.marked = { parse: text => String(text).split('\n\n').map(p => `<p>${p}</p>`).join('') };
            window.DOMPurify = { sanitize: html => html };
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
        await page.goto(origin + '/chat');
        const state = () => page.evaluate(() => {
            const box = document.getElementById('chatBox'), send = document.getElementById('chatSend');
            return {
                top: box.scrollTop, gap: box.scrollHeight - box.scrollTop - box.clientHeight,
                send: send.textContent.trim(), disabled: send.disabled, label: send.getAttribute('aria-label'),
                primary: send.classList.contains('btn-primary'), jump: !document.getElementById('chatJump').hidden,
                inputDisabled: document.getElementById('chatInput').disabled, text: box.innerText,
            };
        });

        // The empty box offers starter rows; they go with the first message.
        const starters = () => page.evaluate(() => {
            const el = document.getElementById('chatStarters');
            return { shown: getComputedStyle(el).display !== 'none', rows: [...el.querySelectorAll('button')].map(b => b.textContent) };
        });
        let st = await starters();
        assert.ok(st.shown, 'starters show under the empty box');
        assert.deepEqual(st.rows, ko.starters);
        assert.equal(await page.getAttribute('#chatBox', 'role'), 'log');

        await page.fill('#chatInput', '첫 질문');
        await page.click('#chatSend');
        await page.waitForTimeout(300);
        let s = await state();
        assert.ok(!(await starters()).shown, 'starters gone once a message is in');
        assert.equal(await page.getAttribute('#chatBox', 'aria-busy'), 'true', 'busy while streaming');
        assert.equal(s.send, ko.stop);
        assert.equal(s.label, ko.stopLabel);
        assert.ok(!s.disabled && !s.primary && s.inputDisabled, 'streaming: Stop is live, input waits');
        await page.waitForTimeout(1000);
        s = await state();
        assert.ok(s.gap < 48 && !s.jump, `follows at the bottom (gap ${s.gap})`);

        // The reader scrolls up: the view stays while text keeps arriving.
        await page.evaluate(() => { const box = document.getElementById('chatBox'); box.scrollTop -= 500; });
        await page.waitForTimeout(100);
        const before = await state();
        await page.waitForTimeout(600);
        s = await state();
        assert.ok(Math.abs(s.top - before.top) <= 1, `stays at ${before.top}, not ${s.top}`);
        assert.ok(s.gap > before.gap && s.jump, 'text keeps arriving below; the jump button shows');
        await page.click('#chatJump');
        await page.waitForTimeout(400);
        s = await state();
        assert.ok(s.gap < 48 && !s.jump, `jump returns to the bottom and follows (gap ${s.gap})`);

        // Stop keeps the partial answer and never recovers or errors.
        const partial = (await state()).text.length;
        await page.click('#chatSend');
        await page.waitForTimeout(200);
        s = await state();
        assert.ok(streams[0].closedEarly, 'Stop closes the stream');
        assert.ok(s.text.includes(ko.stopped) && s.text.length >= partial, 'partial answer kept with the stopped note');
        assert.equal(s.send, ko.send);
        assert.ok(!s.disabled && s.primary && s.label === null && !s.inputDisabled, 'Send is back');
        await page.waitForTimeout(2500);
        s = await state();
        assert.ok(!s.text.includes(ko.error) && !s.text.includes('연결이 끊겼습니다'), 'no recovery after Stop');

        // A full answer: Stop ends with it; the feedback bar appearing under
        // the box does not leave a following reader above the bottom.
        chunksPerAnswer = 8;
        await page.fill('#chatInput', '두 번째 질문');
        await page.click('#chatSend');
        await page.waitForFunction(stop => {
            const send = document.getElementById('chatSend');
            return send.textContent.trim() !== stop && !send.disabled;
        }, ko.stop, { timeout: 5000 });
        await page.waitForTimeout(100);
        s = await state();
        assert.ok(streams[1].finished && !streams[1].closedEarly, 'second answer completes');
        assert.equal(s.text.split(ko.stopped).length - 1, 1, 'no stopped note for a finished answer');
        assert.ok(s.gap < 48, `at the bottom after the answer (gap ${s.gap})`);
        assert.equal(await page.getAttribute('#chatBox', 'aria-busy'), 'false', 'not busy after the answer');

        // Each answer (the stopped partial one too) copies its markdown source.
        assert.equal(await page.locator('.chat-message-ai .chat-message-copy').count(), 2);
        await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
        await page.locator('.chat-message-ai .chat-message-copy').last().click();
        await page.waitForTimeout(100);
        assert.equal(await page.locator('.chat-message-ai .chat-message-copy').last().textContent(), ko.copied);
        const copied = await page.evaluate(() => navigator.clipboard.readText());
        assert.ok(copied.startsWith(PARA.trim().slice(0, 10)) && copied.includes('\n\n'), 'markdown source copied');

        // A new chat empties the box and the starters return; a row sends itself.
        await page.click('#newChatBtn');
        st = await starters();
        assert.ok(st.shown, 'starters return with an empty box');
        await page.locator('#chatStarters .chat-starter').nth(2).click();
        await page.waitForTimeout(200);
        assert.ok((await state()).text.includes(ko.starters[2]), 'a starter row sends its question');
        assert.deepEqual(errors, []);
        console.log('Chat UI: Stop while streaming, partial answer kept without recovery, scroll follows only at the bottom, jump to latest passed; starters, copy, log region and aria-busy passed.');
    } finally {
        if (browser) await browser.close();
        server.close();
    }
}
main().catch(err => { console.error(err); process.exitCode = 1; });
