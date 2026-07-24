#!/usr/bin/env node
const assert = require('assert');
const { buildPersonLinkIndex, linkifyPlain } = require('../data/commulingo/people-linkify');
const { findEntityMentions } = require('../data/commulingo/report-links');

const paulLevi = {
    id: 'paul-levi',
    displayName: '파울 레비',
    names: { short: '파울 레비', display: '파울 레비' },
    aliases: {
        ko: ['파울 레비', '레비'],
        en: ['Paul Levi', 'Levi'],
    },
};

const koIndex = buildPersonLinkIndex([paulLevi], { lang: 'ko' });
assert.strictEqual(koIndex.byAlias['레비'], undefined);
assert.strictEqual(koIndex.byAlias['파울 레비'].id, 'paul-levi');
assert.doesNotMatch(linkifyPlain('비센테 데 라 오 레비 장관', koIndex), /paul-levi/);
assert.match(linkifyPlain('파울 레비는 독일 공산주의자였다.', koIndex), /paul-levi/);
assert.strictEqual(
    findEntityMentions('비센테 데 라 오 레비 장관', { personIndex: koIndex }).personIds.has('paul-levi'),
    false
);

const enPerson = {
    ...paulLevi,
    displayName: 'Paul Levi',
    names: { short: 'Paul Levi', display: 'Paul Levi' },
};
const enIndex = buildPersonLinkIndex([enPerson], { lang: 'en' });
assert.strictEqual(enIndex.byAlias.Levi, undefined);
assert.strictEqual(enIndex.byAlias['Paul Levi'].id, 'paul-levi');
assert.strictEqual(
    findEntityMentions('Isaac Levi authored the report.', { personIndex: enIndex }).personIds.has('paul-levi'),
    false
);
assert.strictEqual(
    findEntityMentions('Paul Levi opposed the March Action.', { personIndex: enIndex }).personIds.has('paul-levi'),
    true
);

console.log('OK — CommuLingo person linkify smoke passed.');
