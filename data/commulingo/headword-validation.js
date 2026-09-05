// Storage syntax only: semantic ambiguity is handled by the linking policy.
// Do not silently repair names; a caller must see and correct invalid input.
function fail(message) {
    const error = new Error(message);
    error.status = 400;
    throw error;
}

function assertHeadword(value, field, { allowEmpty = false } = {}) {
    if (allowEmpty && value === '') return;
    if (typeof value !== 'string' || !value.length) fail(`${field}: non-empty text required`);
    if (value !== value.normalize('NFC')) fail(`${field}: use NFC Unicode`);
    if (value !== value.trim() || / {2}|[^\S ]/u.test(value)) fail(`${field}: use single ordinary spaces, without leading/trailing space`);
    if (/[\p{Cc}\p{Cf}<>]/u.test(value) || /&(?:#\d+|#x[\da-f]+|[a-z]+);/iu.test(value)) {
        fail(`${field}: plain text required; no markup, HTML entities or invisible control characters`);
    }
}

function assertStringList(values, field) {
    if (!Array.isArray(values)) fail(`${field}: array required`);
    const seen = new Set();
    values.forEach((value, i) => {
        assertHeadword(value, `${field}[${i}]`);
        if ([...value].length < 2) fail(`${field}[${i}]: at least two characters required for auto-link aliases`);
        if (seen.has(value)) fail(`${field}: duplicate '${value}'`);
        seen.add(value);
    });
}

function assertAliases(aliases, field = 'aliases') {
    if (!aliases || typeof aliases !== 'object' || Array.isArray(aliases)) fail(`${field}: {ko: [], en: []} required`);
    for (const [lang, values] of Object.entries(aliases)) {
        if (!['ko', 'en'].includes(lang)) fail(`${field}: unsupported language '${lang}'`);
        assertStringList(values, `${field}.${lang}`);
    }
}

function assertPersonHeadwords(payload) {
    for (const field of ['name', 'givenName', 'familyName']) {
        const node = payload[field];
        if (node === undefined) continue;
        if (typeof node === 'string') assertHeadword(node, field, { allowEmpty: true });
        else {
            if (!node || typeof node !== 'object' || Array.isArray(node)) fail(`${field}: localized text required`);
            for (const [lang, value] of Object.entries(node)) {
                if (!['ko', 'en'].includes(lang)) fail(`${field}: unsupported language '${lang}'`);
                assertHeadword(value, `${field}.${lang}`, { allowEmpty: true });
            }
        }
    }
    if (payload.aliases !== undefined) assertAliases(payload.aliases);
}

module.exports = { assertHeadword, assertAliases, assertStringList, assertPersonHeadwords };
