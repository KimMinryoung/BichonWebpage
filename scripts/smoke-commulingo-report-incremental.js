const assert = require('node:assert/strict');
const { compileResearchBody } = require('../services/research-body');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { buildPersonLinkIndex, buildAliasPattern } = require('../data/commulingo/people-linkify');
const { ResearchLinkCache } = require('../services/research-link-cache');
const makeTerm = (id, label, aliases = []) => ({ id, term: { en: label, ko: label }, aliases: { en: aliases, ko: aliases } });
const indexes = (terms, lang = 'en') => ({ lang, term: buildTermLinkIndex(terms, { lang, legacyReview: true }) });
const render = (text, ctx) => compileResearchBody({ html_body: '<p>' + text + '</p>' }, ctx, new Set());
const terms = [makeTerm('alpha', 'Alpha'), makeTerm('beta', 'Beta')];
let before = indexes(terms);
const alpha = render('Alpha and Anew.', before);
const beta = render('Beta only.', before);
const manual = render('<a href="commulingo/terms/%61lpha">manual</a>', before);
const renamed = indexes([makeTerm('alpha', 'Anew'), terms[1]]);
assert.notStrictEqual(render('Alpha and Anew.', renamed), alpha);
assert.strictEqual(render('Beta only.', renamed), beta, 'unaffected reports survive dictionary replacement');
assert.notStrictEqual(render('<a href="commulingo/terms/%61lpha">manual</a>', renamed), manual);
assert.equal(render('Alpha and Anew.', renamed).terms[0].label, 'Anew');
const stable = render('Beta only.', renamed);
assert.strictEqual(render('Beta only.', indexes([makeTerm('alpha', 'Anew'), terms[1]])), stable, 'identical new snapshots reuse results');

// New entries and aliases must invalidate reports that previously had no link.
before = indexes(terms);
const unlinked = render('Gamma &amp; Delta.', before);
const added = indexes([...terms, makeTerm('gamma', 'Gamma')]);
const linked = render('Gamma &amp; Delta.', added);
assert.notStrictEqual(linked, unlinked);
assert.equal(linked.terms[0].id, 'gamma');
assert.equal(render('Gamma &amp; Delta.', before).terms.length, 0, 'deletion removes stale links');
const unknownManual = render('<a href="/commulingo/terms/new">link</a>', before);
const known = indexes([...terms, makeTerm('new', 'New thing')]);
assert.equal(unknownManual.terms.length, 0);
assert.equal(render('<a href="/commulingo/terms/new">link</a>', known).terms.length, 1);

// Blocked phrases are dependencies even though they have no byAlias entry.
before = indexes(terms);
const free = render('Alpha compounds', before);
const blocked = indexes(terms);
blocked.term.pattern = buildAliasPattern(['Alpha', 'Beta'], ['Alpha compounds'], true);
assert.equal(render('Alpha compounds', blocked).terms.length, 0);
assert.equal(render('Alpha compounds', before).terms.length, 1);
assert.equal(free.terms.length, 1);

// Search-only/context decisions and alias reassignment affect the old owner.
const explicit = policy => ({ ...terms[0], linkExpressions: [{ lang: 'en', text: 'Alpha', role: 'identity', policy }] });
before = indexes([explicit('auto'), terms[1]]);
assert.equal(render('Alpha', before).terms.length, 1);
assert.equal(render('Alpha', indexes([explicit('search'), terms[1]])).terms.length, 0);
const reassigned = indexes([makeTerm('beta', 'Alpha')]);
assert.equal(render('Alpha', reassigned).terms[0].id, 'beta');

// Whole-name context, new given names and ambiguous surnames can veto a link.
const person = (id, given, family) => ({ id, displayName: given + ' ' + family, names: { given, family, short: given + ' ' + family, display: given + ' ' + family } });
const peopleContext = people => ({ lang: 'en', person: buildPersonLinkIndex(people, { lang: 'en' }) });
const ford = person('ford', 'Gerald', 'Ford');
before = peopleContext([ford]);
const original = render('Henry Ford', before);
const unaffected = render('No person named here.', before);
const extra = peopleContext([ford, person('black', 'Henry', 'Black')]);
assert.notStrictEqual(render('Henry Ford', extra), original);
assert.equal(render('Henry Ford', extra).people.length, 0);
assert.strictEqual(render('No person named here.', extra), unaffected);
const collision = peopleContext([ford, person('henry-ford', 'Henry', 'Ford')]);
assert.equal(render('Henry Ford', collision).people[0].id, 'henry-ford');

// Old generations may finish in flight; returning to one must diff again.
assert.equal(render('Henry Ford', before).people[0].id, 'ford');
assert.equal(render('Henry Ford', extra).people.length, 0);

// Language caches are independent, including edits in the other language.
const english = indexes(terms, 'en');
const englishResult = render('Alpha', english);
render('Alpha', indexes([makeTerm('other', 'Alpha')], 'ko'));
assert.strictEqual(render('Alpha', english), englishResult);

// Bounded eviction and conservative fallback for an unrecognized matcher.
const emptyCache = new ResearchLinkCache();
assert.equal(emptyCache.forIndexes(undefined).size, 0);
assert.equal(render('No dictionaries available', null).terms.length, 0);
const cache = new ResearchLinkCache(2);
const ctx = indexes(terms);
const entries = cache.forIndexes(ctx);
for (const key of ['a', 'b', 'c']) cache.put(entries, key, key, {});
assert.equal(entries.size, 2);
assert.ok(!entries.has('a'));
assert.equal(cache.forIndexes({ lang: 'en', term: { pattern: /Alpha/g, byAlias: {} } }).size, 0);
console.log('OK — incremental report renders cover additions, removals, policy, manual links, blocked phrases, context and bounded reuse');
