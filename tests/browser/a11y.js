// @requires server:BASE_URL=http://127.0.0.1:3001
// Accessibility (axe-core, WCAG 2.1 A/AA) on representative pages in both
// themes. Serious and critical violations fail; the site wordmark in the
// toolbar is a logo, which WCAG exempts from contrast. Read-only: BASE_URL
// selects the preview or production.
const assert = require('node:assert/strict');
const { AxeBuilder } = require('@axe-core/playwright');
const { launchChromium } = require('../lib/browser');

const PATHS = [
    '/', '/commulingo', '/commulingo/learn', '/commulingo/people', '/commulingo/people/lenin',
    '/commulingo/terms/soviet', '/commulingo/events', '/reports', '/chat', '/search?q=%EB%A0%88%EB%8B%8C',
    '/en/commulingo/people/lenin',
];

(async () => {
    const origin = (process.env.BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
    const browser = await launchChromium({ headless: true });
    const failures = [];
    try {
        for (const theme of ['dark', 'light']) {
            const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: theme });
            const page = await context.newPage();
            for (const path of PATHS) {
                const verify = (path.includes('?') ? '&' : '?') + 'verify=' + Date.now();
                await page.goto(origin + path + verify, { waitUntil: 'networkidle' });
                const result = await new AxeBuilder({ page })
                    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                    .exclude('.toolbar-logo')
                    .analyze();
                for (const v of result.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')) {
                    failures.push(`${theme} ${path} ${v.id} ×${v.nodes.length}: ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(', ')}`);
                }
            }
            await context.close();
        }
    } finally {
        await browser.close();
    }
    assert.deepEqual(failures, [], failures.join('\n'));
    console.log(`Accessibility: ${PATHS.length} pages × 2 themes, no serious or critical axe violations.`);
})().catch(err => { console.error(err); process.exitCode = 1; });
