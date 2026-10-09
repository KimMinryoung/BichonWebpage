#!/usr/bin/env node
// Hub entries (link-hubs.js) stay plain in dictionary and document prose, and
// nothing links inside them; office/classification strings (NKVD, 코민테른) go
// to their office page, not to the glossary entry of the same name.
const assert = require('assert');
const { buildTermLinkIndex } = require('../data/commulingo/term-linkify');
const { buildTopicLinkIndex } = require('../data/commulingo/topic-linkify');
const { createLinker, topicStrings } = require('../data/commulingo/linkify');
const { installLinkBlocklist } = require('../data/commulingo/link-blocklist');
const { isLinkHub } = require('../data/commulingo/link-hubs');

installLinkBlocklist([]);
const topic = buildTopicLinkIndex({ offices: [{ id: 'comintern', title: '코민테른' }, { id: 'state-security', title: '국가보안' }] }, { lang: 'ko' });
const terms = [
    { id: 'comintern', term: { ko: '코민테른' }, aliases: { ko: ['코민테른 집행위원회'] } },
    { id: 'bolshevik', term: { ko: '볼셰비키' }, aliases: { ko: [] } },
    { id: 'kronstadt', term: { ko: '크론시타트 반란' }, aliases: { ko: [] } },
];
const term = buildTermLinkIndex(terms, { lang: 'ko', legacyReview: true, yieldTo: topicStrings(topic) });
const render = (text, surface) => createLinker({ term, topic }, { surface }).plain(text);

assert(isLinkHub('term', 'bolshevik') && !isLinkHub('term', 'kronstadt'));
// A hub stays plain on dictionary and document surfaces; others still link.
const page = render('볼셰비키는 크론시타트 반란을 진압했다.', 'event');
assert.doesNotMatch(page, /terms\/bolshevik/);
assert.match(page, /terms\/kronstadt/);
assert.doesNotMatch(page, /cmplain/);
for (const surface of ['person', 'term', 'doc']) assert.doesNotMatch(render('볼셰비키.', surface), /bolshevik/);
// Reports and learning keep the link.
assert.match(render('볼셰비키.', 'report'), /terms\/bolshevik/);
// Nothing links inside a hub name: 코민테른 집행위원회 is the (hub) glossary
// entry, so the office pass does not take its 코민테른.
assert.doesNotMatch(render('코민테른 집행위원회가 열렸다.', 'event'), /<a /);
// The bare name goes to the office page, never to the glossary entry.
const bare = render('코민테른이 결정했다.', 'event');
assert.match(bare, /offices\/comintern/);
assert.doesNotMatch(bare, /terms\/comintern/);
assert.match(render('NKVD가 체포했다.', 'report'), /offices\/state-security/);

console.log('smoke-commulingo-link-hubs: ok');
