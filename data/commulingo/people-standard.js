const { hasFlag, flagLabel } = require('./flag-icons');
const { localize } = require('./localize');

const SCHEMA_VERSION = 'commulingo.people.v1';

// Flatten a stored {code, label:{ko,en}} nationality into a localized card field,
// dropping codes we have no vendored flag for and falling back to the flag's
// default localized name when the row carries no explicit label.
function normalizeFlag(raw, lang) {
    const code = raw && typeof raw.code === 'string' ? raw.code : '';
    if (!hasFlag(code)) return null;
    const label = (raw.label && localize(raw.label, lang)) || flagLabel(code, lang);
    return { code, label };
}

// The order role sections take on the person list, by institutional weight.
// Deliberately NOT commulingo_offices.sort_order, which orders the office index
// chronologically — the two answer different questions, and
// scripts/check-commulingo-code-db-drift.js checks membership, not order.
const OFFICE_DISPLAY_ORDER = [
    'party-leadership',
    'party-secretariat-cadres',
    'head-of-government',
    'defence',
    'state-security',
    'ideology-propaganda',
    'culture-literature',
    'state-head',
    'foreign-affairs',
    'nationalities-federal',
    'central-planning',
    'economic-management',
    'heavy-military-industry',
    'agriculture',
    'science-nuclear-space',
    'comintern',
];

// FALLBACK ONLY — the office title a card shows comes from commulingo_offices
// (see the `officeTitles[officeId] ||` below); this copy is read only when the
// database is unreachable. Renaming an office means UPDATE commulingo_offices,
// which needs no deploy; editing the line here changes nothing on a healthy
// site and makes the two disagree during an outage. The drift check fails if
// they stop matching.
const ROLE_OFFICE_TITLES = {
    'party-leadership': { ko: '당 최고 지도자', en: 'Party leadership' },
    'party-secretariat-cadres': { ko: '당 서기국 · 조직인사', en: 'Party Secretariat and cadres' },
    'head-of-government': { ko: '정부 수반', en: 'Heads of government' },
    defence: { ko: '군사 · 국방', en: 'Military and defence' },
    'state-security': { ko: '국가보안 기관', en: 'State security agencies' },
    'ideology-propaganda': { ko: '이념 · 선전', en: 'Ideology and propaganda' },
    'culture-literature': { ko: '문화 · 문학예술 통제', en: 'Culture and literary control' },
    'state-head': { ko: '국가원수', en: 'Formal heads of state' },
    'foreign-affairs': { ko: '외교', en: 'Foreign affairs' },
    'nationalities-federal': { ko: '민족문제 · 연방 관리', en: 'Nationalities and federal management' },
    'central-planning': { ko: '중앙계획 기관', en: 'Central planning agencies' },
    'economic-management': { ko: '경제 운영', en: 'Economic management' },
    'heavy-military-industry': { ko: '중공업 · 군수공업', en: 'Heavy industry and military industry' },
    agriculture: { ko: '농업', en: 'Agriculture' },
    'science-nuclear-space': { ko: '과학 · 원자력 · 우주 개발', en: 'Science, nuclear and space development' },
    comintern: { ko: '코민테른', en: 'Comintern' },
};

// Person→role mappings live ONLY in the commulingo_person_roles DB table
// (edited via the admin API or the leninbot agent). OFFICE_ICON seeds
// commulingo_offices.icon and is the last-resort icon fallback; on DB
// outage the file-fallback path renders default icons (crown/circle-help).
// Changing which icon an office uses is an UPDATE on commulingo_offices.icon,
// not an edit here — only a NEW glyph needs code (role-icons.js holds the SVG
// paths, which are the one genuinely code-shaped thing in this area).
const OFFICE_ICON = {
    'state-security': 'eye',
    defence: 'star',
    'foreign-affairs': 'handshake',
    'ideology-propaganda': 'megaphone',
    'culture-literature': 'paintbrush',
    'heavy-military-industry': 'factory',
    'science-nuclear-space': 'atom',
    agriculture: 'corn',
    'state-head': 'landmark',
    'nationalities-federal': 'map',
    'party-leadership': 'flag',
    'party-secretariat-cadres': 'folder',
    'head-of-government': 'briefcase',
    'central-planning': 'chart',
    'economic-management': 'coins',
    comintern: 'globe',
};

function composePersonName(name, patronymic) {
    if (!name || !patronymic) return name || '';
    const parts = name.split(' ');
    if (parts.length < 2) return name;
    // Legacy bad data guard: if the full name already embeds the patronymic,
    // inserting it again would double it (오토 율리예비치 율리예비치 시미트).
    if (parts.includes(patronymic)) return name;
    return [parts[0], patronymic, ...parts.slice(1)].join(' ');
}

// Preferred composition when structured name parts exist (given/family columns,
// migration 060): the patronymic sits between given and family names, which
// also places it correctly after multi-word given names where the legacy
// insert-after-first-token compose cannot.
function composeFromParts(given, patronymic, family) {
    return [given, patronymic, family].filter(Boolean).join(' ');
}

function parseLifeYears(label) {
    const match = /^(\d{3,4})[–-](\d{3,4})$/.exec(label || '');
    if (!match) return { label: label || '', birthYear: null, deathYear: null };
    return {
        label,
        birthYear: Number.parseInt(match[1], 10),
        deathYear: Number.parseInt(match[2], 10),
    };
}

// Fate labels carry the cause of death only — the death year already lives in
// `years` / deathYear, so it must not be repeated here. Political-event years
// (실각 1964) differ from the death year and are preserved; only the death-year
// token is stripped, then dangling separators / legacy "d." tails are tidied.
// See data/commulingo/people.js for the standard this enforces.
function normalizeFateLabel(label, deathYear) {
    const text = typeof label === 'string' ? label.trim() : '';
    if (!text || !deathYear) return text;
    const y = String(deathYear);
    let out = text;
    // Parenthesized death year: "(1980)".
    out = out.replace(new RegExp('\\(\\s*' + y + '\\s*\\)', 'g'), '');
    // Korean date headed by the death year: "1956년 4월 20일", "1957년".
    out = out.replace(new RegExp(y + '\\s*년(?:\\s*\\d{1,2}\\s*월)?(?:\\s*\\d{1,2}\\s*일)?', 'g'), '');
    // English dates around the death year: "20 April 1956", "April 20, 1956".
    out = out.replace(new RegExp('\\d{1,2}\\s+[A-Z][a-z]+\\s+' + y, 'g'), '');
    out = out.replace(new RegExp('[A-Z][a-z]+\\s+\\d{1,2},?\\s+' + y, 'g'), '');
    // Bare death year token, and the legacy EN "d." that prefixed it.
    out = out.replace(new RegExp('\\b' + y + '\\b', 'g'), '');
    out = out.replace(/\bd\.\s*/g, '');
    // Artifacts left behind: empty parens, an orphaned Korean "년".
    out = out.replace(/\(\s*\)/g, '');
    out = out.replace(/(^|[\s·,])년(?=[\s·,]|$)/g, '$1');
    // Normalize separators and collapse runs left by the removals.
    out = out.replace(/\s*·\s*/g, ' · ');
    out = out.replace(/\s*,\s*/g, ', ');
    out = out.replace(/([·,])(?:\s*[·,])+/g, '$1');
    out = out.replace(/\s{2,}/g, ' ');
    out = out.replace(/^[\s·,]+|[\s·,]+$/g, '').trim();
    return out;
}

function parseDateToken(token, fallbackYear) {
    if (!token) return null;
    const cleaned = token.trim();
    if (/^\d{1,2}$/.test(cleaned) && fallbackYear) {
        return { year: fallbackYear, month: Number.parseInt(cleaned, 10) };
    }
    const match = /^(\d{3,4})(?:\.(\d{1,2}))?$/.exec(cleaned);
    if (!match) return null;
    return {
        year: Number.parseInt(match[1], 10),
        month: match[2] ? Number.parseInt(match[2], 10) : null,
    };
}

function parsePeriod(label) {
    const value = label || '';
    const first = value.split(',')[0].trim();
    const parts = first.split(/[–-]/).map(part => part.trim()).filter(Boolean);
    if (!parts.length) return { label: value, start: null, end: null };
    const start = parseDateToken(parts[0], null);
    const end = parseDateToken(parts[1], start ? start.year : null);
    return { label: value, start, end };
}

function buildSceneIndex(catalog, lang) {
    const sceneIndex = {};
    (catalog && catalog.collections || []).forEach(collection => {
        const timeline = collection.decisionTimeline;
        if (!timeline) return;
        (timeline.eras || []).forEach(era => {
            (era.episodes || []).forEach(episode => {
                sceneIndex[collection.id + '/' + episode.id] = {
                    bookId: collection.id,
                    episodeId: episode.id,
                    title: localize(episode.title, lang),
                    bookTitle: localize(collection.bookTitle || collection.title, lang),
                };
            });
        });
    });
    return sceneIndex;
}

function roleForPerson(person, lang, data, officeTitles, officeIcons) {
    const id = person.id || '';
    if (data && Object.prototype.hasOwnProperty.call(data, 'personRoles')) {
        const mappedRole = (data.personRoles || {})[id];
        if (!mappedRole && person.group === 'old-regime') {
            const category = (data.roleCategories || {})['imperial-white'];
            return {
                icon: category && category.icon || 'crown',
                officeId: '',
                categoryId: category ? 'imperial-white' : '',
                label: category ? localize(category.label, lang) : '',
            };
        }
        if (!mappedRole) return { icon: 'circle-help', officeId: '', label: '' };

        const officeId = mappedRole.officeId || '';
        const categoryId = mappedRole.categoryId || '';
        const category = categoryId ? (data.roleCategories || {})[categoryId] : null;
        const categoryLabel = category ? localize(category.label, lang) : '';
        const explicitLabel = mappedRole.label ? localize(mappedRole.label, lang) : '';
        const officeLabel = officeId ? localize(officeTitles[officeId] || ROLE_OFFICE_TITLES[officeId], lang) : '';
        return {
            icon: category && category.icon || mappedRole.icon || officeIcons[officeId] || OFFICE_ICON[officeId] || 'circle-help',
            officeId,
            categoryId,
            label: categoryLabel || explicitLabel || officeLabel || '',
        };
    }

    // File-fallback path (DB unavailable): role mappings live only in the DB,
    // so default icons are all we can offer.
    if (person.group === 'old-regime') return { icon: 'crown', officeId: '', label: '' };
    return { icon: 'circle-help', officeId: '', label: '' };
}

function normalizePerson(raw, data, lang, sceneIndex, officeTitles, officeIcons) {
    const patronymic = localize((data.patronymics || {})[raw.id], lang);
    const cyrillicPatronymic = (data.cyrillicPatronymics || {})[raw.id] || '';
    const years = parseLifeYears(raw.years);
    // Full name with patronymic per language: from structured parts when the
    // snapshot has them, else composed from the legacy full-name string.
    // Parts are read strictly per language — localize()'s ko/en fallback would
    // splice the other language's parts into the name (Kim Il 김일성).
    const fullName = l => {
        const given = (raw.givenName && raw.givenName[l]) || '';
        const family = (raw.familyName && raw.familyName[l]) || '';
        const pat = localize((data.patronymics || {})[raw.id], l);
        if (given || family) return composeFromParts(given, pat, family);
        return composePersonName(localize(raw.name, l), pat);
    };
    const career = ((data.careers || {})[raw.id] || []).map(entry => ({
        period: parsePeriod(entry.y),
        y: entry.y,
        r: localize(entry.r, lang),
        role: localize(entry.r, lang),
    }));
    return {
        schemaVersion: SCHEMA_VERSION,
        id: raw.id,
        group: raw.group,
        groupId: raw.group,
        initial: raw.initial || '',
        names: {
            ko: fullName('ko'),
            en: fullName('en'),
            ru: composePersonName(raw.cyrillic, cyrillicPatronymic),
            display: fullName(lang),
            short: localize(raw.name, lang),
            // The family name as its own part, read strictly per language. Prose
            // calls people by it (류시코프), and the last word of a display name
            // is not always it: 쿤 벨러 keeps the Hungarian order, and
            // 프라무디아 아난타 투르 has a two-word family name.
            family: (raw.familyName && raw.familyName[lang]) || '',
            cyrillic: composePersonName(raw.cyrillic, cyrillicPatronymic),
            patronymic,
            cyrillicPatronymic,
        },
        years: years.label,
        yearsData: years,
        yearsLabel: years.label,
        name: fullName(lang),
        displayName: fullName(lang),
        cyrillic: composePersonName(raw.cyrillic, cyrillicPatronymic),
        epithet: localize(raw.epithet, lang),
        moment: localize(raw.moment, lang),
        bio: localize(raw.bio, lang),
        fate: raw.fate ? {
            kind: raw.fate.kind || '',
            label: localize(raw.fate.label, lang),
        } : { kind: '', label: '' },
        fateKind: raw.fate ? raw.fate.kind || '' : '',
        fateLabel: raw.fate ? localize(raw.fate.label, lang) : '',
        citizenship: normalizeFlag(raw.citizenship, lang),
        origin: normalizeFlag(raw.origin, lang),
        aliases: {
            ko: raw.aliases && Array.isArray(raw.aliases.ko) ? raw.aliases.ko : [],
            en: raw.aliases && Array.isArray(raw.aliases.en) ? raw.aliases.en : [],
        },
        role: roleForPerson(raw, lang, data, officeTitles, officeIcons),
        hasDetail: !!((data.sectionCounts || {})[raw.id]),
        career,
        scenes: (raw.scenes || [])
            .map(scene => sceneIndex[scene[0] + '/' + scene[1]])
            .filter(Boolean),
    };
}

function normalizeOfficeRow(row, office, peopleById, lang) {
    const person = row.personId ? peopleById[row.personId] : null;
    return {
        officeId: office.id,
        personId: row.personId || '',
        period: parsePeriod(row.years || ''),
        years: row.years || '',
        body: localize(row.body, lang),
        role: localize(row.body, lang),
        name: person ? person.names.short : localize(row.name, lang),
        displayName: person ? person.names.display : localize(row.name, lang),
        note: localize(row.note, lang),
    };
}

function normalizeCommuLingoPeople(data, options = {}) {
    const lang = options.lang || 'ko';
    const sceneIndex = buildSceneIndex(options.catalog, lang);
    const officeTitles = (data.offices || []).reduce((index, office) => {
        index[office.id] = office.title || {};
        return index;
    }, {});
    const officeIcons = (data.offices || []).reduce((index, office) => {
        index[office.id] = office.icon || '';
        return index;
    }, {});
    const people = (data.people || []).map(person => normalizePerson(person, data, lang, sceneIndex, officeTitles, officeIcons));
    const peopleById = people.reduce((index, person) => {
        index[person.id] = person;
        return index;
    }, {});
    const offices = (data.offices || []).map(office => ({
        schemaVersion: SCHEMA_VERSION,
        id: office.id,
        icon: office.icon || OFFICE_ICON[office.id] || 'circle-help',
        title: localize(office.title, lang),
        titleI18n: office.title || {},
        range: office.range || '',
        period: parsePeriod(office.range || ''),
        blurb: localize(office.blurb, lang),
        lineage: Array.isArray(office.lineage) ? office.lineage.map(step => ({
            period: step.period || '',
            name: localize(step.name, lang),
            body: localize(step.body, lang),
        })) : [],
        rows: (office.rows || []).map(row => normalizeOfficeRow(row, office, peopleById, lang)),
    })).filter(office => office.rows.length).sort((a, b) => {
        const aIndex = OFFICE_DISPLAY_ORDER.indexOf(a.id);
        const bIndex = OFFICE_DISPLAY_ORDER.indexOf(b.id);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
    const rolesByPersonId = {};
    offices.forEach(office => {
        office.rows.forEach(row => {
            if (!row.personId) return;
            if (!rolesByPersonId[row.personId]) rolesByPersonId[row.personId] = [];
            rolesByPersonId[row.personId].push({
                officeId: office.id,
                officeTitle: office.title,
                period: row.period,
                years: row.years,
                role: row.role,
                note: row.note,
            });
        });
    });
    people.forEach(person => {
        person.institutionRoles = rolesByPersonId[person.id] || [];
    });
    const groups = (data.groups || []).map(group => ({
        id: group.id,
        range: group.range || '',
        period: parsePeriod(group.range || ''),
        title: localize(group.title, lang),
        blurb: localize(group.blurb, lang),
        people: people.filter(person => person.groupId === group.id),
    })).filter(group => group.people.length);
    return {
        schemaVersion: SCHEMA_VERSION,
        lang,
        groups,
        offices,
        roleCategories: Object.entries(data.roleCategories || {}).reduce((index, [id, category]) => {
            index[id] = {
                id,
                icon: category.icon || '',
                label: localize(category.label, lang),
            };
            return index;
        }, {}),
        people,
        peopleById,
        officeDisplayOrder: OFFICE_DISPLAY_ORDER.slice(),
    };
}

function validateCommuLingoPeople(data) {
    const issues = [];
    const people = data.people || [];
    const offices = data.offices || [];
    const peopleIds = new Set();
    const officeIds = new Set(offices.map(office => office.id));
    people.forEach(person => {
        if (!person.id) issues.push({ level: 'error', code: 'person_missing_id' });
        if (peopleIds.has(person.id)) issues.push({ level: 'error', code: 'duplicate_person_id', id: person.id });
        peopleIds.add(person.id);
        ['ko', 'en'].forEach(lang => {
            if (!localize(person.name, lang)) issues.push({ level: 'error', code: 'person_missing_name', id: person.id, lang });
        });
        if (!person.years) issues.push({ level: 'warn', code: 'person_missing_years', id: person.id });
        if (!(((data.careers || {})[person.id] || []).length)) issues.push({ level: 'error', code: 'person_missing_career', id: person.id });
    });
    offices.forEach(office => {
        if (!office.id) issues.push({ level: 'error', code: 'office_missing_id' });
        (office.rows || []).forEach(row => {
            if (row.personId && !peopleIds.has(row.personId)) {
                issues.push({ level: 'error', code: 'office_row_unknown_person', officeId: office.id, personId: row.personId });
            }
        });
    });
    if (Object.prototype.hasOwnProperty.call(data, 'personRoles')) {
        Object.entries(data.personRoles || {}).forEach(([personId, role]) => {
            if (!peopleIds.has(personId)) issues.push({ level: 'error', code: 'person_role_unknown_person', personId });
            const officeId = role && role.officeId || '';
            const icon = role && role.icon || '';
            const categoryId = role && role.categoryId || '';
            if (!icon && !officeId && !categoryId) issues.push({ level: 'error', code: 'person_role_missing_icon', personId });
            if (officeId && !officeIds.has(officeId)) issues.push({ level: 'error', code: 'person_role_unknown_office', personId, officeId });
            if (categoryId && !(data.roleCategories || {})[categoryId]) {
                issues.push({ level: 'error', code: 'person_role_unknown_category', personId, categoryId });
            }
        });
    }
    return issues;
}

module.exports = {
    SCHEMA_VERSION,
    OFFICE_DISPLAY_ORDER,
    ROLE_OFFICE_TITLES,
    OFFICE_ICON,
    localize,
    composePersonName,
    parseLifeYears,
    parsePeriod,
    normalizeFateLabel,
    normalizeCommuLingoPeople,
    validateCommuLingoPeople,
};
