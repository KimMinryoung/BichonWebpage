#!/usr/bin/env node
// A person link must stand alone: not the front of a longer word, not a place
// or institution named after the person, and in English not a one-word name
// followed by someone else's name. Every case below was found linked wrongly
// on the production site on 2026-11-01 (sample of 559 Korean and 559 English
// dictionary pages), or is the correct link those rules must keep.
const assert = require('assert');
const { buildPersonLinkIndex } = require('../../data/commulingo/people-linkify');
const { createLinker, createCardTextLinker, clientPersonLinkPayload } = require('../../data/commulingo/linkify');
const { installLinkBlocklist } = require('../../data/commulingo/link-blocklist');
const { renderDocPersonLinks } = require('../../data/commulingo/doc-person-links');
const nameContext = require('../../public/js/commulingo-name-context');

// No blocklist: the rules must hold without hand-listed compounds.
installLinkBlocklist([]);
const person = (id, given, family, { names = {}, ...extra } = {}) => ({
    id, displayName: given + ' ' + family, years: '1900–1980',
    names: { given, family, short: given + ' ' + family, display: given + ' ' + family, ...names },
    ...extra,
});
const identity = (lang, text) => ({ linkExpressions: [{ lang, text, role: 'identity', policy: 'auto' }] });

const ko = buildPersonLinkIndex([
    person('mikhail-romm', '미하일', '롬'),
    { id: 'pan-fu', displayName: '판푸', citizenship: { code: 'CN' }, names: { display: '판푸', short: '판푸' } },
    person('fidel-castro', '피델', '카스트로', { aliases: { ko: ['피델'] } }),
    person('diego-velazquez', '디에고', '벨라스케스'),
    person('gorky', '막심', '고리키'),
    person('yezhov', '니콜라이', '예조프'),
    person('jan-domani', '얀', '도마니', identity('ko', '도마니')),
    person('stalin', '이오시프', '스탈린', identity('ko', '스탈린')),
    person('john-f-kennedy', '존', '케네디', identity('ko', '케네디')),
    person('robert-f-kennedy', '로버트', '케네디'),
    person('edward-heath', '에드워드', '히스'),
    person('boris-donskoy', '보리스', '돈스코이'),
], { lang: 'ko' });
const link = (text, index = ko, surface = 'learning') => createLinker({ person: index }, { surface }).plain(text);
const linksTo = (text, id, index) => new RegExp('people/' + id + '"').test(link(text, index));

// The front of a longer word. A one-word representative surname (identity)
// used to skip this check altogether, which is why 스탈린그라드 needed a
// blocklist row; here there is none.
for (const [text, id] of [
    ['미하일 롬니체아누가 왔다.', 'mikhail-romm'], ['판푸성이 말했다.', 'pan-fu'], ['피델리스는 말했다.', 'fidel-castro'],
    ['막심 고리키호가 떴다.', 'gorky'], ['도마니스키가 말했다.', 'jan-domani'], ['스탈린그라드 전투', 'stalin'],
    ['스탈린상 수상자', 'stalin'], ['스탈린주의 비판', 'stalin'], ['케네디스쿨', 'john-f-kennedy'],
]) assert(!linksTo(text, id), text);
// Particles, the copula's endings and the reviewed suffixes still link.
for (const [text, id] of [
    ['미하일 롬이었고', 'mikhail-romm'], ['판푸가 말했다.', 'pan-fu'], ['피델은 말했다.', 'fidel-castro'],
    ['니콜라이 예조프였고', 'yezhov'], ['예조프였으나', 'yezhov'], ['예조프뿐이었다', 'yezhov'], ['예조프였다고', 'yezhov'],
    ['예조프이었던', 'yezhov'], ['예조프에게서였다', 'yezhov'], ['도마니가 말했다.', 'jan-domani'],
    ['스탈린식 계획', 'stalin'], ['스탈린이었다', 'stalin'], ['스탈린들의 시대', 'stalin'], ['고리키는 썼다.', 'gorky'],
]) assert(linksTo(text, id), text);
// A place or institution named after the person.
assert(!linksTo('모스크바 돈스코이 수도원에 묻혔다.', 'boris-donskoy'));
assert(!linksTo('고리키 공원에서', 'gorky'));
assert(linksTo('돈스코이의 폭탄', 'boris-donskoy'));
// A representative surname reads the given name around it like any surname:
// 에드워드 is someone's given name and not JFK's, 존 is his.
assert(!linksTo('에드워드 케네디는 상원의원이었다.', 'john-f-kennedy'));
assert(linksTo('존 케네디는 대통령이었다.', 'john-f-kennedy'));
assert(linksTo('케네디는 대통령이었다.', 'john-f-kennedy'));
assert(linksTo('로버트 케네디는 법무장관이었다.', 'robert-f-kennedy'));
assert(!linksTo('피델 벨라스케스가 왔다.', 'fidel-castro'));

const en = buildPersonLinkIndex([
    person('frunze', 'Mikhail', 'Frunze'),
    person('lenin', 'Vladimir', 'Lenin'),
    person('lucius-d-clay', 'Lucius', 'Clay'),
    person('juri-mikk', 'Jüri', 'Mikk'),
    person('kantaro-suzuki', 'Kantaro', 'Suzuki'),
    person('blagoy-popov', 'Blagoy', 'Popov', { names: { patronymic: 'Simeonov' } }),
    person('harry-hopkins', 'Harry', 'Hopkins'),
    person('aleksei-brusilov', 'Aleksei', 'Brusilov'),
    person('walter-ulbricht', 'Walter', 'Ulbricht'),
], { lang: 'en' });
for (const [text, id] of [
    ['He graduated from the Frunze Academy.', 'frunze'], ['awarded the Lenin Prize', 'lenin'],
    ['the Gdańsk Lenin Shipyard', 'lenin'], ['gathered on Lenin Square', 'lenin'], ['in 1975 Clay Blair defended him', 'lucius-d-clay'],
    ['Tiit Made and Mikk Titma.', 'juri-mikk'], ['the A. S. Popov Scientific Society', 'blagoy-popov'], ['A. S. Popov wrote.', 'blagoy-popov'],
    ['she moved to Johns Hopkins University', 'harry-hopkins'], ['Michael Cox and Caroline Lenin-Pipe argued', 'lenin'],
]) assert(!linksTo(text, id, en), text);
for (const [text, id] of [
    ['Frunze died in 1925.', 'frunze'], ["Frunze's reforms", 'frunze'], ['Lenin, Trotsky and Stalin', 'lenin'],
    ['post-Lenin Moscow', 'lenin'], ['General Clay ordered the airlift.', 'lucius-d-clay'], ['Mikk argued.', 'juri-mikk'],
    ['The Suzuki Kantarō government', 'kantaro-suzuki'], ['B. S. Popov wrote.', 'blagoy-popov'],
    ['The Brusilov Offensive began.', 'aleksei-brusilov'], ['the Ulbricht Group returned', 'walter-ulbricht'],
    ['Lenin Soviet power', 'lenin'], ['the Frunze-Lenin line', 'frunze'],
]) assert(linksTo(text, id, en), text);

// The decision-history book applies the same rules in the browser from the
// payload the server ships it.
for (const [index, text, alias] of [[ko, '판푸성이', '판푸'], [ko, '도마니스키', '도마니'], [ko, '에드워드 케네디', '케네디'], [en, 'the Frunze Academy', 'Frunze']]) {
    const payload = clientPersonLinkPayload({ person: index });
    const data = nameContext.compile(payload.contextData);
    const start = text.indexOf(alias);
    const owner = payload.people.find(p => p.aliases.includes(alias));
    assert.strictEqual(nameContext.resolve(alias, owner && owner.id, start, text, data, nameContext.analyze(text, data)), null, text);
}

// Cards: a text outside the card's own context is judged on its own.
const card = createCardTextLinker({ person: ko });
assert.doesNotMatch(card('판푸성이 말했다.', 'gorky'), /people\/pan-fu/);
assert.match(card('판푸가 말했다.', 'gorky'), /people\/pan-fu/);

// Reference documents refuse the same mentions and their audit says why.
const doc = renderDocPersonLinks('<p>미하일 롬니체아누가 왔고 미하일 롬이 말했다. 모스크바 돈스코이 수도원.</p>',
    { id: 'source', people: ['mikhail-romm', 'boris-donskoy'], date: '1960' }, { lang: 'ko', person: ko }, { audit: true });
assert.match(doc.html, /people\/mikhail-romm"[^>]*>미하일 롬<\/a>이 말했다/);
assert(doc.mentions.some(m => m.text === '미하일 롬' && m.decision === 'not-a-standalone-name'));
assert(doc.mentions.some(m => m.text === '돈스코이' && m.decision === 'place-or-institution'));
assert.doesNotMatch(doc.html, /people\/boris-donskoy/);

console.log('OK — names stand alone: longer words, named places, following names, initials, client and documents');
