#!/usr/bin/env node
// Reports pages that scroll horizontally, and the elements responsible.
//
// Reports and glossary entries are written by an agent, so a new document can
// bring a wide table, a bare source URL or an oversized image at any time. The
// CSS in style.css is the generic net (overflow-wrap on the prose containers,
// max-width on media, .table-scroll around tables); this is the check that
// catches whatever the net misses.
//
// Usage:
//   node scripts/audit-overflow.js                      # default page sample
//   node scripts/audit-overflow.js /reports/research/x  # specific paths
//   BASE_URL=http://100.122.248.77:3001 node scripts/audit-overflow.js
//
// Exits 1 if any page scrolls horizontally, so it can gate a deploy.

const { chromium } = require('playwright');

const BASE = process.env.BASE_URL || 'https://cyber-lenin.com';
const VIEWPORTS = [
    { label: 'phone', width: 390, height: 844 },
    { label: 'tablet', width: 768, height: 1024 },
    { label: 'desktop', width: 1440, height: 900 },
];

// Listing pages plus the newest article from each, which is where fresh
// agent-written markdown lands.
const LISTINGS = [
    { path: '/reports', linkPattern: /^\/reports\/[a-z]+\/[a-z0-9-]+$/i },
    { path: '/posts', linkPattern: /^\/post\/\d+$/ },
    { path: '/ai-diary', linkPattern: /^\/ai-diary\/\d+$/ },
    { path: '/commulingo/terms', linkPattern: /^\/commulingo\/terms\/[a-z0-9-]+$/i },
    { path: '/commulingo/docs', linkPattern: /^\/commulingo\/docs\/[a-z0-9-]+$/i },
];
const ALWAYS = ['/', '/hub', '/commulingo', '/commulingo/people', '/commulingo/events'];

// An element inside a scroll container is meant to be wider than its box, so
// only report the ones nothing is scrolling or clipping. Subtrees a browser is
// skipping are excluded too: inside a closed <details> the boxes keep whatever
// size they were last laid out at, which had the collapsed person groups
// reporting 445px cards on a 390px page that were not on screen at all.
function collectOffenders() {
    const viewport = document.documentElement.clientWidth;
    const scrollable = value => /auto|scroll|hidden|clip/.test(value);
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.right <= viewport + 1) return;
        for (let node = el.parentElement; node; node = node.parentElement) {
            const style = getComputedStyle(node);
            if (scrollable(style.overflowX)) return;
            if (style.contentVisibility === 'hidden') return;
            if (node.tagName === 'DETAILS' && !node.open) return;
        }
        out.push({
            tag: el.tagName.toLowerCase(),
            cls: String(el.className || '').split(' ').filter(Boolean).slice(0, 2).join('.'),
            width: Math.round(rect.width),
            right: Math.round(rect.right),
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50),
        });
    });
    // Deepest elements repeat their ancestors' overflow; keep the widest few.
    return out.sort((a, b) => b.right - a.right).slice(0, 5);
}

function pageState() {
    const before = window.scrollX;
    window.scrollTo(300, 0);
    const scrolled = window.scrollX > before;
    window.scrollTo(before, 0);
    return {
        scrollWidth: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        scrolls: scrolled,
    };
}

async function discoverPaths(browser) {
    const paths = [...ALWAYS];
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    for (const listing of LISTINGS) {
        paths.push(listing.path);
        try {
            await page.goto(BASE + listing.path, { waitUntil: 'load', timeout: 30000 });
            const found = await page.evaluate(pattern => {
                const re = new RegExp(pattern.source, pattern.flags);
                const hrefs = [...document.querySelectorAll('a[href]')]
                    .map(a => a.getAttribute('href'))
                    .filter(href => href && re.test(href));
                return hrefs.slice(0, 2);
            }, { source: listing.linkPattern.source, flags: listing.linkPattern.flags });
            paths.push(...found);
        } catch (err) {
            console.error(`  ! could not read ${listing.path}: ${err.message}`);
        }
    }
    await page.close();
    return [...new Set(paths)];
}

async function main() {
    const argPaths = process.argv.slice(2).filter(arg => arg.startsWith('/'));
    const browser = await chromium.launch();
    const paths = argPaths.length ? argPaths : await discoverPaths(browser);
    console.log(`Checking ${paths.length} paths on ${BASE} at ${VIEWPORTS.length} widths\n`);

    const failures = [];
    for (const path of paths) {
        const results = [];
        for (const viewport of VIEWPORTS) {
            const page = await browser.newPage({ viewport });
            try {
                await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
                await page.waitForTimeout(250);
                const state = await page.evaluate(pageState);
                if (state.scrolls) {
                    const offenders = await page.evaluate(collectOffenders);
                    failures.push({ path, viewport: viewport.label, state, offenders });
                    results.push(`${viewport.label}: SCROLLS ${state.scrollWidth}>${state.viewport}`);
                } else {
                    results.push(`${viewport.label}: ok`);
                }
            } catch (err) {
                results.push(`${viewport.label}: error ${err.message.split('\n')[0]}`);
            }
            await page.close();
        }
        const bad = results.some(r => r.includes('SCROLLS'));
        console.log(`${bad ? 'FAIL' : 'ok  '}  ${path.padEnd(52)} ${results.join('  ')}`);
    }
    await browser.close();

    if (!failures.length) {
        console.log('\nNo page scrolls horizontally.');
        return 0;
    }
    console.log(`\n${failures.length} page/width combinations scroll horizontally:\n`);
    failures.forEach(f => {
        console.log(`${f.path}  (${f.viewport}, ${f.state.scrollWidth}px in ${f.state.viewport}px)`);
        if (!f.offenders.length) {
            console.log('    no element accounts for it: look for a rotated or absolutely'
                + ' positioned pseudo-element, a negative margin, or a transform');
        }
        f.offenders.forEach(o => {
            console.log(`    ${o.tag}${o.cls ? '.' + o.cls : ''}  width=${o.width} right=${o.right}  ${o.text}`);
        });
        console.log('');
    });
    return 1;
}

main().then(code => process.exit(code)).catch(err => {
    console.error(err);
    process.exit(2);
});
