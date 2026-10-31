const fs = require('fs');
const path = require('path');

// Release dates for course files without editorial.authoredAt. None left: the
// last one, marx-wages-and-programme, was rewritten with its own date (2026-10-31).
const COURSES = [];

function getCourseMetadata(id) {
    return COURSES.find(course => course.id === id) || null;
}

// Course files that carry editorial.authoredAt date themselves; COURSES only
// supplies the date for older files that have none. Loaded on call, not at the
// top, because course files require this module.
function courseFileMetadata() {
    const dir = path.join(__dirname, 'courses');
    return fs.readdirSync(dir).filter(name => name.endsWith('.js')).sort()
        .map(name => require(path.join(dir, name)))
        .filter(course => course && course.id && course.visibility !== 'private'
            && course.editorial && course.editorial.authoredAt)
        .map(course => ({
            id: course.id,
            releasedAt: course.editorial.authoredAt,
            title: course.title,
            description: course.description,
        }));
}

function getLatestCourseMetadata() {
    const files = courseFileMetadata();
    return [...files, ...COURSES.filter(course => !files.some(file => file.id === course.id))]
        .filter(course => Number.isFinite(Date.parse(`${course.releasedAt}T00:00:00Z`)))
        .sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))[0] || null;
}

module.exports = { getCourseMetadata, getLatestCourseMetadata };
