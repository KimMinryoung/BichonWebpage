// Dates for the learning group of the CommuLingo update notes and the home
// card. A course counts as updated whenever its data document is written
// (chapters added, intros or questions revised), not only on first release:
// on 2026-11-09 new chapters in two existing courses never showed because
// only editorial.authoredAt was read and only the newest course was listed.
// The date is the latest of the document's updatedAt and the editorial
// authoredAt/revisedAt days.

function dayTime(value) {
    if (!value) return NaN;
    return Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
}

// Loaded on call: index.js reads the data documents, which load lazily.
function listCourseUpdates() {
    const { loadCommuLingoBundle } = require('./index');
    const { bundle, modifiedAt } = loadCommuLingoBundle();
    return (bundle.collections || [])
        .filter(course => course && course.id && course.visibility !== 'private'
            && Number(course.publicChapterLimit) > 0)
        .map(course => {
            const editorial = course.editorial || {};
            const times = [modifiedAt[course.id], editorial.authoredAt, editorial.revisedAt]
                .map(dayTime).filter(Number.isFinite);
            return {
                id: course.id,
                updatedAt: times.length ? Math.max(...times) : NaN,
                releasedAt: dayTime(editorial.authoredAt),
                title: course.title,
                description: course.description,
            };
        })
        .filter(course => Number.isFinite(course.updatedAt))
        // Same-moment writes (bulk migrations) fall back to the newer release.
        .sort((a, b) => (b.updatedAt - a.updatedAt)
            || ((b.releasedAt || 0) - (a.releasedAt || 0)) || a.id.localeCompare(b.id));
}

// Changes whenever any course document is written; keys the preview cache.
function courseUpdatesVersion() {
    const { loadCommuLingoBundle } = require('./index');
    return loadCommuLingoBundle().signature;
}

module.exports = { listCourseUpdates, courseUpdatesVersion };
