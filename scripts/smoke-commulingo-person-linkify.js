#!/usr/bin/env node
const assert = require('assert');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');
const { createLinker } = require('../data/commulingo/linkify');
function linkedPeople(text, indexes) {
    const linker = createLinker(indexes, { surface: 'report' });
    linker.plain(text);
    return new Set(linker.found.people.map(entry => entry.id));
}
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');

// '레비' is a never-link alias (commulingo_link_blocklist, kind='alias'), which
// is what the first assertion below turns on. Installed directly so this file
// keeps running with no database.
installLinkBlocklist([{ kind: 'alias', lang: 'ko', phrase: '레비' },
                      { kind: 'alias', lang: 'en', phrase: 'levi' }]);

// The alias rules below are about the index alone, so one bare person surface
// is enough; the policy the surfaces share is covered by
// scripts/smoke-commulingo-linkify-policy.js.
const linkPlain = (text, index) => createLinker({ person: index }, { surface: 'person' }).plain(text);

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
assert.doesNotMatch(linkPlain('비센테 데 라 오 레비 장관', koIndex), /paul-levi/);
assert.match(linkPlain('파울 레비는 독일 공산주의자였다.', koIndex), /paul-levi/);
assert.strictEqual(
    linkedPeople('비센테 데 라 오 레비 장관', { person: koIndex }).has('paul-levi'),
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
    linkedPeople('Isaac Levi authored the report.', { person: enIndex }).has('paul-levi'),
    false
);
assert.strictEqual(
    linkedPeople('Paul Levi opposed the March Action.', { person: enIndex }).has('paul-levi'),
    true
);

console.log('OK — CommuLingo person linkify smoke passed.');
