const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadService(rows) {
    const dependencies = {
        '../config/database': { query: async (sql, params) => {
            // A global LIMIT can drop an entire kind before the UI sees it.
            assert.match(sql, /PARTITION BY kind ORDER BY updated_at DESC NULLS LAST, id/);
            assert.match(sql, /WHERE update_rank <= \$1/);
            assert.equal(params[0], 10);
            assert.doesNotMatch(sql, /LIMIT/);
            if (rows instanceof Error) throw rows;
            return { rows };
        } },
        '../data/commulingo/docs-store': { listCommuLingoDocs: () => [
            { id: 'old-doc', title: { ko: '이전 문헌' }, addedAt: '2026-09-01' },
            { id: 'new-doc', title: { ko: '최신 문헌' }, addedAt: '2026-09-05' },
        ] },
        '../data/commulingo/course-metadata': { getLatestCourseMetadata: () => ({
            id: 'course', title: { ko: '학습' }, releasedAt: '2026-09-05',
        }) },
        '../data/commulingo/localize': require('../data/commulingo/localize'),
    };
    const sandbox = {
        require: name => {
            assert.ok(name in dependencies, name);
            return dependencies[name];
        },
        module: { exports: {} },
        process: { env: {} },
        console: { warn: () => {} },
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../services/commulingo-updates.js'), 'utf8'), sandbox);
    return sandbox.module.exports;
}

(async () => {
    // The event must survive even when both other dictionary kinds are newer.
    const rows = ['event', 'person', 'term'].map((kind, index) => ({
        kind, id: kind, title_ko: kind, title_en: `English ${kind}`,
        updated_at: `2026-09-0${index + 1}T00:00:00Z`,
    }));
    const { loadRecentCommuLingoItems: load } = loadService(rows);
    const items = Array.from(await load('ko'));
    assert.equal(items.length, 5);
    assert.deepEqual(items.map(item => item.type).sort(), ['course', 'doc', 'event', 'person', 'term']);
    assert.equal(items.find(item => item.type === 'doc').title, '최신 문헌');
    assert.equal(items.find(item => item.type === 'event').href, '/commulingo/events/event');
    const english = Array.from(await load('en'));
    assert.equal(english.find(item => item.type === 'event').title, 'English event');

    // Missing or unavailable dictionary content leaves the other kinds usable.
    for (const result of [[], new Error('DB unavailable')]) {
        const remaining = Array.from(await loadService(result).loadRecentCommuLingoItems('ko'));
        assert.deepEqual(remaining.map(item => item.type).sort(), ['course', 'doc']);
    }
    const historyRows = Array.from({ length: 10 }, (_, index) => ({
        ...rows[0], id: `event-${index}`, updated_at: `2026-09-05T09:${String(59 - index).padStart(2, '0')}:00Z`,
    }));
    const history = loadService([...historyRows, ...rows.slice(1)]);
    const groups = Array.from(await history.loadCommuLingoUpdateGroups('ko'));
    assert.equal(groups.find(group => group.type === 'event').items.length, 10);
    const homeItems = Array.from(await history.loadRecentCommuLingoItems('ko'));
    assert.equal(homeItems.length, 5);
    assert.equal(homeItems.find(item => item.type === 'event').href, '/commulingo/events/event-0');
    const failedGroups = Array.from(await loadService(new Error('offline')).loadCommuLingoUpdateGroups('ko'));
    assert.equal(failedGroups.find(group => group.type === 'event').unavailable, true);
    assert.equal(failedGroups.find(group => group.type === 'doc').unavailable, false);
    console.log('recent updates: one item for each of the five kinds OK');
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
