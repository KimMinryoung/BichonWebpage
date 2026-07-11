const SCHEMA_VERSION = 'commulingo.people.v1';

const OFFICE_DISPLAY_ORDER = [
    'party-leadership',
    'party-secretariat-cadres',
    'government',
    'defence',
    'security',
    'ideology-propaganda',
    'culture-literature',
    'state-head',
    'foreign-affairs',
    'nationalities-federal',
    'planning',
    'economic-management',
    'heavy-industry-mic',
    'agriculture',
    'science-nuclear-space',
    'comintern',
];

const ROLE_OFFICE_TITLES = {
    'party-leadership': { ko: '당 최고 지도자', en: 'Party leadership' },
    'party-secretariat-cadres': { ko: '당 서기국 · 조직인사 지도부', en: 'Party Secretariat and cadres leadership' },
    government: { ko: '정부 수반', en: 'Heads of government' },
    defence: { ko: '군사 · 국방 지도부', en: 'Military and defence leadership' },
    security: { ko: '국가보안 기관 지도부', en: 'State security leadership' },
    'ideology-propaganda': { ko: '이념 · 선전 지도부', en: 'Ideology and propaganda leadership' },
    'culture-literature': { ko: '문화 · 문학예술 통제', en: 'Culture and literary control' },
    'state-head': { ko: '국가원수', en: 'Formal heads of state' },
    'foreign-affairs': { ko: '외교 지도부', en: 'Foreign affairs leadership' },
    'nationalities-federal': { ko: '민족문제 · 연방 관리', en: 'Nationalities and federal management' },
    planning: { ko: '중앙계획 기관 지도부', en: 'Central planning leadership' },
    'economic-management': { ko: '경제 운영 지도부', en: 'Economic management leadership' },
    'heavy-industry-mic': { ko: '중공업 · 군수공업 지도부', en: 'Heavy industry and military-industrial leadership' },
    agriculture: { ko: '농업 지도부', en: 'Agricultural leadership' },
    'science-nuclear-space': { ko: '과학 · 원자력 · 우주 개발', en: 'Science, nuclear and space development' },
    comintern: { ko: '코민테른 지도부', en: 'Comintern leadership' },
};

// Person→role mappings live ONLY in the commulingo_person_roles DB table
// (edited via the admin API or the leninbot agent). OFFICE_ICON seeds
// commulingo_offices.icon and is the last-resort icon fallback; on DB
// outage the file-fallback path renders default icons (crown/circle-help).
const OFFICE_ICON = {
    security: 'eye',
    defence: 'star',
    'foreign-affairs': 'handshake',
    'ideology-propaganda': 'megaphone',
    'culture-literature': 'paintbrush',
    'heavy-industry-mic': 'factory',
    'science-nuclear-space': 'atom',
    agriculture: 'wheat',
    'state-head': 'landmark',
    'nationalities-federal': 'map',
    'party-leadership': 'flag',
    'party-secretariat-cadres': 'folder',
    government: 'briefcase',
    planning: 'chart',
    'economic-management': 'chart',
    comintern: 'globe',
};

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function composePersonName(name, patronymic) {
    if (!name || !patronymic) return name || '';
    const parts = name.split(' ');
    if (parts.length < 2) return name;
    return [parts[0], patronymic, ...parts.slice(1)].join(' ');
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
        if (!mappedRole && person.group === 'old-regime') return { icon: 'crown', officeId: '', label: '' };
        if (!mappedRole) return { icon: 'circle-help', officeId: '', label: '' };

        const officeId = mappedRole.officeId || '';
        const explicitLabel = mappedRole.label ? localize(mappedRole.label, lang) : '';
        const officeLabel = officeId ? localize(officeTitles[officeId] || ROLE_OFFICE_TITLES[officeId], lang) : '';
        return {
            icon: mappedRole.icon || officeIcons[officeId] || OFFICE_ICON[officeId] || 'circle-help',
            officeId,
            label: explicitLabel || officeLabel || '',
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
            ko: composePersonName(localize(raw.name, 'ko'), localize((data.patronymics || {})[raw.id], 'ko')),
            en: composePersonName(localize(raw.name, 'en'), localize((data.patronymics || {})[raw.id], 'en')),
            ru: composePersonName(raw.cyrillic, cyrillicPatronymic),
            display: composePersonName(localize(raw.name, lang), patronymic),
            short: localize(raw.name, lang),
            cyrillic: composePersonName(raw.cyrillic, cyrillicPatronymic),
            patronymic,
            cyrillicPatronymic,
        },
        years: years.label,
        yearsData: years,
        yearsLabel: years.label,
        name: composePersonName(localize(raw.name, lang), patronymic),
        displayName: composePersonName(localize(raw.name, lang), patronymic),
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
        aliases: {
            ko: raw.aliases && Array.isArray(raw.aliases.ko) ? raw.aliases.ko : [],
            en: raw.aliases && Array.isArray(raw.aliases.en) ? raw.aliases.en : [],
        },
        role: roleForPerson(raw, lang, data, officeTitles, officeIcons),
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
        title: localize(office.title, lang),
        titleI18n: office.title || {},
        range: office.range || '',
        period: parsePeriod(office.range || ''),
        blurb: localize(office.blurb, lang),
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
            if (!icon && !officeId) issues.push({ level: 'error', code: 'person_role_missing_icon', personId });
            if (officeId && !officeIds.has(officeId)) issues.push({ level: 'error', code: 'person_role_unknown_office', personId, officeId });
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
    normalizeCommuLingoPeople,
    validateCommuLingoPeople,
};
