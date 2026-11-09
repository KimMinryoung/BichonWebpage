const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Module = require('node:module');

// Courses are ordered by their last document write, so new chapters in an
// existing course surface (2026-11-09: two expanded courses never showed
// because only the newest editorial.authoredAt was read).
{
    const indexPath = require.resolve('../../data/commulingo/index');
    const metadataPath = require.resolve('../../data/commulingo/course-metadata');
    const course = (id, authoredAt, extra = {}) => ({ id, title: { ko: id }, publicChapterLimit: 3,
        editorial: authoredAt ? { authoredAt } : undefined, ...extra });
    require.cache[indexPath] = Object.assign(new Module(indexPath), { loaded: true, exports: {
        loadCommuLingoBundle: () => ({ signature: 'sig', modifiedAt: {
            'old-course-expanded': '2026-11-09T12:55:45Z', 'new-course': '2026-11-01T00:00:00Z',
            'same-write-a': '2026-10-01T00:00:00Z', 'same-write-b': '2026-10-01T00:00:00Z',
            'hidden': '2026-11-10T00:00:00Z',
        }, bundle: { collections: [
            course('new-course', '2026-11-05'),
            course('old-course-expanded', '2026-09-01'),
            course('same-write-a', '2026-09-01'),
            course('same-write-b', '2026-09-02'),
            course('hidden', '2026-11-10', { visibility: 'private' }),
        ] } }),
    } });
    delete require.cache[metadataPath];
    const { listCourseUpdates, courseUpdatesVersion } = require(metadataPath);
    const list = listCourseUpdates();
    assert.deepEqual(list.map(item => item.id), ['old-course-expanded', 'new-course', 'same-write-b', 'same-write-a']);
    assert.equal(list[0].updatedAt, Date.parse('2026-11-09T12:55:45Z'));
    // A release day later than the document write still counts.
    assert.equal(list[1].updatedAt, Date.parse('2026-11-05T00:00:00Z'));
    assert.equal(courseUpdatesVersion(), 'sig');
    delete require.cache[indexPath];
    delete require.cache[metadataPath];
}

function loadService(rows, people = [{
    id: 'person', name: { ko: '인물', en: 'Person' }, epithet: { ko: '소개' },
    // The snapshot timestamp includes section edits even when the base row is older.
    updatedAt: '2026-09-06T00:00:00Z',
}]) {
    const dependencies = {
        '../utils/public-model-cache': require('../../utils/public-model-cache'),
        '../utils/sanitize': require('../../utils/sanitize'),
        '../utils/truncate-html': require('../../utils/truncate-html'),
        '../config/database': { query: async (sql, params) => {
            // A global LIMIT can drop an entire kind before the UI sees it.
            assert.match(sql, /PARTITION BY kind ORDER BY updated_at DESC NULLS LAST, id/);
            assert.match(sql, /WHERE update_rank <= \$1/);
            assert.doesNotMatch(sql, /FROM commulingo_people\b/);
            assert.equal(params[0], 10);
            assert.doesNotMatch(sql, /LIMIT/);
            if (rows instanceof Error) throw rows;
            return { rows };
        } },
        '../data/commulingo/docs-store': { listCommuLingoDocs: () => [
            { id: 'old-doc', title: { ko: '이전 문헌' }, addedAt: '2026-09-01' },
            { id: 'new-doc', title: { ko: '최신 문헌' }, addedAt: '2026-09-05' },
        ] },
        '../data/commulingo/course-metadata': {
            listCourseUpdates: () => [
                { id: 'course', title: { ko: '학습' }, updatedAt: Date.parse('2026-09-05T00:00:00Z') },
                { id: 'older-course', title: { ko: '이전 학습' }, updatedAt: Date.parse('2026-09-01T00:00:00Z') },
            ],
            courseUpdatesVersion: () => 'v1',
        },
        '../data/commulingo/localize': require('../../data/commulingo/localize'),
        '../data/commulingo/indicators': { expandIndicators: text => text },
        '../utils/db-change-listener': { onTableChange: () => {} },
        '../data/commulingo/people-store': { loadCommuLingoPeople: async () => ({ data: { people } }) },
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
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../services/commulingo-updates.js'), 'utf8'), sandbox);
    return sandbox.module.exports;
}

(async () => {
    // The event must survive even when both other dictionary kinds are newer.
    const rows = ['event', 'term'].map((kind, index) => ({
        kind, id: kind, title_ko: kind, title_en: `English ${kind}`,
        updated_at: `2026-09-0${index + 1}T00:00:00Z`,
    }));
    const { loadRecentCommuLingoItems: load } = loadService(rows);
    const items = Array.from(await load('ko'));
    assert.equal(items.length, 5);
    assert.deepEqual(items.map(item => item.type).sort(), ['course', 'doc', 'event', 'person', 'term']);
    assert.equal(items.find(item => item.type === 'doc').title, '최신 문헌');
    assert.equal(items.find(item => item.type === 'event').href, '/commulingo/events/event');
    assert.equal(items.find(item => item.type === 'person').modified, Date.parse('2026-09-06T00:00:00Z'));
    assert.equal(items.find(item => item.type === 'course').href, '/commulingo/book/course');
    const courseGroup = Array.from(await loadService(rows).loadCommuLingoUpdateGroups('ko')).find(group => group.type === 'course');
    assert.deepEqual(Array.from(courseGroup.items, item => item.title), ['학습', '이전 학습']);
    const english = Array.from(await load('en'));
    assert.equal(english.find(item => item.type === 'event').title, 'English event');

    // Missing or unavailable dictionary content leaves the other kinds usable.
    for (const result of [[], new Error('DB unavailable')]) {
        const remaining = Array.from(await loadService(result).loadRecentCommuLingoItems('ko'));
        assert.deepEqual(remaining.map(item => item.type).sort(), ['course', 'doc', 'person']);
    }
    const historyRows = Array.from({ length: 10 }, (_, index) => ({
        ...rows[0], id: `event-${index}`, updated_at: `2026-09-05T09:${String(59 - index).padStart(2, '0')}:00Z`,
    }));
    const history = loadService([...historyRows, rows[1]]);
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
