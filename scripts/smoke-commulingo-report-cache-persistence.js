const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { ResearchLinkCache } = require('../services/research-link-cache');
const { ResearchCacheDisk } = require('../services/research-cache-disk');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { linkifyReportHtml } = require('../data/commulingo/report-links');
const { compileResearchBody } = require('../services/research-body');
const person = bio => ({ id: 'test-person', displayName: 'Sample Person', epithet: 'Writer', bio,
    names: { given: 'Sample', family: 'Person', short: 'Sample Person', display: 'Sample Person' } });
const context = record => ({ lang: 'en', person: buildPersonLinkIndex([record], { lang: 'en' }) });

(async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'report-cache-test-'));
    try {
        const filename = path.join(directory, 'cache.json');
        const ctx = context(person('OLD BIO MUST NOT BE PERSISTED'));
        const cache = new ResearchLinkCache();
        const entries = cache.forIndexes(ctx);
        const html = '<p>Sample Person</p>';
        const result = linkifyReportHtml(html, ctx);
        cache.put(entries, 'content', html, result, [['missing', false]]);
        cache.put(entries, 'private', html, result, [], false);
        const disk = new ResearchCacheDisk(cache, { filename, version: async () => 'v1' });
        await Promise.all([disk.save(), disk.save()]);
        const raw = await fs.readFile(filename, 'utf8');
        assert.ok(!raw.includes('OLD BIO MUST NOT BE PERSISTED'));
        assert.ok(!raw.includes('"private"'));
        assert.equal((await fs.stat(filename)).mode & 0o777, 0o600);

        const restarted = new ResearchLinkCache();
        await new ResearchCacheDisk(restarted, { filename, version: async () => 'v1' }).restore();
        const newer = context(person('NEW BIO'));
        const restored = restarted.forIndexes(newer).get('content');
        assert.ok(restored, 'biography edits do not invalidate saved links');
        assert.equal(restored.result.people[0].bio, 'NEW BIO');
        assert.deepEqual(restored.result, linkifyReportHtml(html, newer));
        assert.deepEqual(restored.reportStates, [['missing', false]]);
        const changed = context({ ...person('NEW BIO'), epithet: 'New tooltip' });
        assert.equal(restarted.forIndexes(changed).size, 0, 'tooltip edits invalidate affected renders');

        const differentVersion = new ResearchLinkCache();
        await new ResearchCacheDisk(differentVersion, { filename, version: async () => 'v2' }).restore();
        assert.equal(differentVersion.forIndexes(ctx).size, 0);
        await fs.writeFile(filename, '{broken');
        const broken = new ResearchLinkCache();
        await new ResearchCacheDisk(broken, { filename, version: async () => 'v1' }).restore();
        assert.equal(broken.forIndexes(ctx).size, 0);
        await fs.writeFile(filename, JSON.stringify({ version: 'v1', generations: [{ lang: 'en' }] }));
        const invalid = new ResearchLinkCache();
        await new ResearchCacheDisk(invalid, { filename, version: async () => 'v1' }).restore();
        assert.equal(invalid.forIndexes(ctx).size, 0);
        await new ResearchCacheDisk(cache, { filename: directory, version: async () => 'v1' }).save(); // write failure is nonfatal

        // Unrelated publication changes reuse a body; missing/removed links
        // restore/downgrade correctly, including .md URLs and lookup failures.
        const data = { content: '# Heading\n\n[other](/reports/research/other.md?x=1#part)\n\nSample Person' };
        const first = compileResearchBody(data, ctx, new Set(['other']));
        assert.strictEqual(compileResearchBody(data, ctx, new Set(['other', 'unrelated'])), first);
        assert.strictEqual(compileResearchBody(data, ctx, undefined), first);
        const missing = compileResearchBody(data, ctx, new Set(['unrelated']));
        assert.ok(!missing.html.includes('href="/reports/research/other'));
        const published = compileResearchBody(data, ctx, new Set(['other']));
        assert.equal(published.html, first.html);
        const renamed = compileResearchBody(data, ctx, new Set(['renamed']));
        assert.equal(renamed.html, missing.html);
        const plain = { content: 'Sample Person' };
        const noLinks = compileResearchBody(plain, ctx, new Set());
        assert.strictEqual(compileResearchBody(plain, ctx, undefined), noLinks);
        const newBio = context(person('Updated biography'));
        assert.strictEqual(compileResearchBody(plain, newBio, new Set()), noLinks);
        assert.equal(noLinks.people[0].bio, 'Updated biography');
        const newName = context({ ...person('Updated biography'), displayName: 'Changed Person' });
        assert.notStrictEqual(compileResearchBody(plain, newName, new Set()), noLinks);
        console.log('OK — restart restore, fresh metadata, policy/version invalidation, publication dependencies and disk failures');
    } finally { await fs.rm(directory, { recursive: true, force: true }); }
})().then(() => process.exit(0)).catch(error => { console.error(error); process.exit(1); });
