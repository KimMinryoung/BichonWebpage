// Release dates for the "new course" notice: each public course carries its
// own editorial.authoredAt. COURSES supplies a date for a course that has
// none (none left since marx-wages-and-programme was rewritten, 2026-10-31).
const COURSES = [];

function getCourseMetadata(id) {
    return COURSES.find(course => course.id === id) || null;
}

// Loaded on call: index.js reads the data documents, which load lazily.
function courseDocumentMetadata() {
    const { loadCommuLingoBundle } = require('./index');
    return (loadCommuLingoBundle().bundle.collections || [])
        .filter(course => course && course.id && course.visibility !== 'private'
            && Number(course.publicChapterLimit) > 0
            && course.editorial && course.editorial.authoredAt)
        .map(course => ({
            id: course.id,
            releasedAt: course.editorial.authoredAt,
            title: course.title,
            description: course.description,
        }));
}

function getLatestCourseMetadata() {
    const own = courseDocumentMetadata();
    return [...own, ...COURSES.filter(course => !own.some(item => item.id === course.id))]
        .filter(course => Number.isFinite(Date.parse(`${course.releasedAt}T00:00:00Z`)))
        .sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))[0] || null;
}

module.exports = { getCourseMetadata, getLatestCourseMetadata };
