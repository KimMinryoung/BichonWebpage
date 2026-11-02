// schema.org nodes for the CommuLingo detail pages, set beside the page's
// BreadcrumbList in one @graph (seo.graphJsonLd). Only facts the page itself
// shows go in: names, the short description, dates where they are exact.
const seo = require('../../utils/seo');

const pad = n => String(n).padStart(2, '0');

// [year, month?, day?] with 0 or a missing part for unknown, to the ISO 8601
// precision the data has: 1870-04-22, 1870-04, 1870. Years before 1000 or
// after 9999 have no plain ISO form and are left out.
function isoDate(parts) {
    if (!Array.isArray(parts)) return null;
    const [year, month, day] = parts;
    if (!Number.isInteger(year) || year < 1000 || year > 9999) return null;
    if (!month) return String(year);
    return day ? `${year}-${pad(month)}-${pad(day)}` : `${year}-${pad(month)}`;
}

function pageUrl(path, urlLang) {
    return seo.absoluteUrl(seo.languagePath(path, urlLang));
}

function description(text) {
    const plain = seo.excerpt(text || '', 300);
    return plain ? { description: plain } : {};
}

function personJsonLd(person, { lang, urlLang }) {
    const url = pageUrl(`/commulingo/people/${person.id}`, urlLang);
    const dates = person.lifeDates || {};
    const years = person.yearsData || {};
    const birthDate = isoDate(dates.birth) || isoDate([years.birthYear]);
    const deathDate = isoDate(dates.death) || isoDate([years.deathYear]);
    const alternateName = [...new Set([person.names && person.names.ko, person.names && person.names.en, person.cyrillic]
        .filter(name => name && name !== person.displayName))];
    return {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: person.displayName,
        ...(alternateName.length ? { alternateName } : {}),
        ...description(person.bio || person.epithet),
        ...(birthDate ? { birthDate } : {}),
        ...(deathDate ? { deathDate } : {}),
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
    };
}

function termJsonLd(term, { lang, urlLang }) {
    const url = pageUrl(`/commulingo/terms/${term.id}`, urlLang);
    return {
        '@type': 'DefinedTerm',
        '@id': `${url}#term`,
        name: term.term,
        ...description(term.definition),
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
        inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: lang === 'en' ? 'CommuLingo Glossary' : '공산링고 용어 사전',
            url: pageUrl('/commulingo/terms', urlLang),
        },
    };
}

// A past event: schema.org Event with its dates; no location or offers,
// which are for events one can attend.
function eventJsonLd(event, { lang, urlLang }) {
    const url = pageUrl(`/commulingo/events/${event.id}`, urlLang);
    const startDate = isoDate(event.startDate);
    const endDate = isoDate(event.endDate);
    return {
        '@type': 'Event',
        '@id': `${url}#event`,
        name: event.title,
        ...description(event.summary),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
    };
}

function courseJsonLd(collection, { title, text, lang, urlLang }) {
    const url = pageUrl(`/commulingo/book/${collection.id}`, urlLang);
    return {
        '@type': ['Course', 'LearningResource'],
        '@id': `${url}#course`,
        name: title,
        ...description(text),
        url,
        mainEntityOfPage: url,
        inLanguage: lang,
        isAccessibleForFree: true,
        provider: { '@type': 'Organization', '@id': `${seo.SITE_ORIGIN}/#organization`, name: 'Cyber-Lenin', url: seo.SITE_ORIGIN },
    };
}

module.exports = { isoDate, personJsonLd, termJsonLd, eventJsonLd, courseJsonLd };
