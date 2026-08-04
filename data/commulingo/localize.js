// The one localize() for CommuLingo's bilingual values ({ ko, en } objects or
// plain strings). Was previously defined identically in nine files.
function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

module.exports = { localize };
