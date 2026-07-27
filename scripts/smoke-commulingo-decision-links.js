#!/usr/bin/env node
// The decision-history book renders in the browser, so its person links are the
// one surface the server cannot check by rendering a page. This runs
// public/js/commulingo-decision.js against a stub DOM and a payload shaped like
// the one routes/commulingo.js ships, and asserts the three things that make it
// agree with the served learning content: the person page as destination, a new
// tab, and one link per passage per person.
//
//   node scripts/smoke-commulingo-decision-links.js

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const payload = {
    bookId: 'test-book',
    blocked: ['레닌그라드'],
    people: [
        { id: 'lenin', name: '블라디미르 레닌', epithet: '조타수', aliases: ['블라디미르 레닌', '레닌'] },
        { id: 'stalin', name: '이오시프 스탈린', epithet: '실무가', aliases: ['이오시프 스탈린', '스탈린'] },
    ],
    timeline: {
        question: { ko: '질문', en: 'Question' },
        thesis: { ko: '주장', en: 'Thesis' },
        eras: [{
            id: 'era-1',
            title: { ko: '시대', en: 'Era' },
            range: { ko: '1917–1924', en: '1917-1924' },
            episodes: [{
                id: 'ep-1',
                date: { ko: '1921', en: '1921' },
                title: { ko: '갈림길', en: 'Fork' },
                role: { ko: '역할', en: 'Role' },
                // 레닌 twice (the second stays plain), and 레닌그라드 never links.
                briefing: { ko: '레닌은 레닌그라드에서 레닌을 다시 만났다. 스탈린도 있었다.', en: 'x' },
                question: { ko: '무엇을 택할 것인가?', en: 'What now?' },
                actualId: 'a',
                options: [
                    { id: 'a', label: { ko: '선택 A', en: 'Choice A' }, stance: 'retreat' },
                    { id: 'b', label: { ko: '선택 B', en: 'Choice B' }, stance: 'advance' },
                ],
                outcome: { ko: '결과', en: 'Outcome' },
            }],
        }],
    },
};

// A DOM stub the script can run against: elements it creates keep a class list
// and children so its own querySelector('.commu-dc-head') finds them, and every
// node's innerHTML is kept so the assertions can read the rendered markup back.
const allNodes = [];

function node(className) {
    const self = {
        innerHTML: '',
        textContent: '',
        children: [],
        dataset: {},
        classes: new Set(String(className || '').split(/\s+/).filter(Boolean)),
        get className() { return [...self.classes].join(' '); },
        set className(value) { self.classes = new Set(String(value).split(/\s+/).filter(Boolean)); },
        getAttribute: () => 'ko',
        setAttribute() {},
        addEventListener() {},
        appendChild(child) { self.children.push(child); return child; },
        querySelector(selector) {
            const want = String(selector).replace(/^\./, '');
            for (const child of self.children) {
                if (child.classes && child.classes.has(want)) return child;
                const deeper = child.querySelector && child.querySelector(selector);
                if (deeper) return deeper;
            }
            return null;
        },
        querySelectorAll: () => [],
        classList: {
            add: name => self.classes.add(name),
            remove: name => self.classes.delete(name),
            toggle: name => (self.classes.has(name) ? (self.classes.delete(name), false) : (self.classes.add(name), true)),
            contains: name => self.classes.has(name),
        },
        closest: () => null,
        scrollIntoView() {},
        focus() {},
    };
    allNodes.push(self);
    return self;
}

const raw = node();
raw.textContent = JSON.stringify(payload);
const root = node();
const shell = node();

const document = {
    querySelector: selector => (selector === '.commulingo-shell' ? shell : null),
    querySelectorAll: () => [],
    getElementById: id => (id === 'commulingo-decision' ? raw : id === 'commuDecision' ? root : null),
    createElement: () => node(),
    createDocumentFragment: () => node(),
    addEventListener() {},
    body: node(),
};

const store = {};
const sandbox = {
    document,
    console,
    window: {
        COMMULINGO_STRINGS: {},
        addEventListener() {},
        location: { hash: '' },
        localStorage: null,
    },
    localStorage: {
        getItem: key => (key in store ? store[key] : null),
        setItem: (key, value) => { store[key] = String(value); },
    },
    setTimeout,
    clearTimeout,
};
sandbox.window.localStorage = sandbox.localStorage;
sandbox.globalThis = sandbox;

const source = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'commulingo-decision.js'), 'utf8');
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: 'commulingo-decision.js' });

// Everything the script wrote, wherever it wrote it.
const html = allNodes.map(item => item.innerHTML).join('\n');
assert.ok(html.includes('commu-dc-'), 'the script rendered nothing — the DOM stub or the script entry changed');

const links = html.match(/<a class="commu-person-link"[^>]*>/g) || [];
assert.ok(links.length >= 2, `expected the situation prose to link, got ${links.length}`);

// Destination: the person's own page, like every other surface.
assert.ok(links.every(a => /href="\/commulingo\/people\/[a-z-]+"/.test(a)), `bad hrefs: ${links.join(' ')}`);
// New tab: this is learning content, and leaving loses the reader's place.
assert.ok(links.every(a => a.includes('target="_blank"') && a.includes('rel="noopener"')), 'links must open in a new tab');
// First mention only, per passage.
const leninLinks = links.filter(a => a.includes('/people/lenin')).length;
assert.strictEqual(leninLinks, 1, `레닌 should link once per passage, got ${leninLinks}`);
// The blocked compound is not a link, and did not swallow the name inside it.
assert.doesNotMatch(html, /<a[^>]*>레닌<\/a>그라드/, '레닌그라드 must pass through untouched');

console.log('OK — CommuLingo decision-history link smoke passed.');
