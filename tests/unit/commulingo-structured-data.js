// schema.org nodes on the CommuLingo detail pages: exact dates at the
// precision the data has, plain-text descriptions, URLs in the page language.
const assert = require('node:assert/strict');
const seo = require('../../utils/seo');
const { isoDate, personJsonLd, termJsonLd, eventJsonLd, courseJsonLd } = require('../../data/commulingo/structured-data');

assert.equal(isoDate([1870, 4, 22]), '1870-04-22');
assert.equal(isoDate([1917, 11, 0]), '1917-11');
assert.equal(isoDate([1917, 0, 0]), '1917');
assert.equal(isoDate([1917]), '1917');
assert.equal(isoDate([null]), null);
assert.equal(isoDate([800, 1, 1]), null);
assert.equal(isoDate(null), null);

const person = personJsonLd({
    id: 'lenin', displayName: '블라디미르 레닌', cyrillic: 'Владимир Ленин',
    names: { ko: '블라디미르 레닌', en: 'Vladimir Lenin' },
    bio: '**볼셰비키** 지도자', lifeDates: { birth: [1870, 4, 22], death: null },
    yearsData: { birthYear: 1870, deathYear: 1924 },
}, { lang: 'ko', urlLang: 'ko' });
assert.equal(person['@type'], 'Person');
assert.equal(person.birthDate, '1870-04-22');
assert.equal(person.deathDate, '1924', 'the year when no exact date');
assert.deepEqual(person.alternateName, ['Vladimir Lenin', 'Владимир Ленин']);
assert.equal(person.description, '볼셰비키 지도자');
assert.equal(person.url, `${seo.SITE_ORIGIN}/commulingo/people/lenin`);

const living = personJsonLd({ id: 'x', displayName: 'X', yearsData: { birthYear: 1950, deathYear: null } }, { lang: 'en', urlLang: 'en' });
assert.equal(living.deathDate, undefined);
assert.equal(living.alternateName, undefined);
assert.equal(living.url, `${seo.SITE_ORIGIN}/en/commulingo/people/x`);

const term = termJsonLd({ id: 'soviet', term: '소비에트', definition: '평의회.' }, { lang: 'ko', urlLang: 'ko' });
assert.equal(term['@type'], 'DefinedTerm');
assert.equal(term.inDefinedTermSet.url, `${seo.SITE_ORIGIN}/commulingo/terms`);

const event = eventJsonLd({ id: 'oct', title: '10월 혁명', summary: '', startDate: [1917, 11, 7], endDate: [1917, 11, 8] }, { lang: 'ko', urlLang: 'ko' });
assert.equal(event.startDate, '1917-11-07');
assert.equal(event.endDate, '1917-11-08');
assert.equal(event.description, undefined);

const course = courseJsonLd({ id: 'capital-vol1' }, { title: '『자본』 1권', text: '설명', lang: 'ko', urlLang: 'ko' });
assert.deepEqual(course['@type'], ['Course', 'LearningResource']);
assert.equal(course.provider.name, 'Cyber-Lenin');

// Beside the breadcrumb in one graph.
const graph = seo.graphJsonLd(seo.breadcrumbJsonLd([{ name: 'a', href: '/' }]), person);
assert.equal(graph['@graph'].length, 2);
assert.equal(graph['@graph'][1]['@context'], undefined);
console.log('commulingo structured data ok');
