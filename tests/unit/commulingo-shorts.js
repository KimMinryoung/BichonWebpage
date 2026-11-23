const assert = require('node:assert/strict');
const { personCards, todayIndex, sceneCards } = require('../../data/commulingo/shorts');
const { needsLessonContext } = require('../../data/commulingo/lesson-context');
const { isPublicCommuLingoDataPath, isSessionFreeRequest } = require('../../config/route-policy');

// 장면 카드: 두 언어 카드 수가 같아야 하고, 등장 세력 카드(lines 없음)는 빼며, 세력 표식은 지운다.
const story = {
    ko: { cards: [{ title: '등장 세력', cast: [] }, { when: '1905년', title: '장면', lines: ['{{flag:russia}}차르가 물러섰다.'] }] },
    en: { cards: [{ title: 'Cast', cast: [] }, { when: '1905', title: 'Scene', lines: ['{{flag:russia}}The tsar gave way.'] }] },
};
assert.deepEqual(sceneCards(story), [{ when: { ko: '1905년', en: '1905' }, title: { ko: '장면', en: 'Scene' }, lines: { ko: ['차르가 물러섰다.'], en: ['The tsar gave way.'] } }]);
assert.deepEqual(sceneCards({ ko: story.ko, en: { cards: [] } }), []);

// 인물: 결정적 순간이 두 언어로 있고 길이가 한 화면 안(40~260자)인 사람만.
const person = (id, ko) => ({ id, name: { ko: '이름', en: 'Name' }, years: '1900–1950', moment: { ko, en: 'x' }, citizenship: { code: '' } });
assert.deepEqual(personCards([person('a', '짧다'), person('b', '가'.repeat(80)), person('c', '가'.repeat(300))]).map(p => p.id), ['b']);

// 오늘의 역사: 시작일이 년·월·일까지 있는 줄만, 월-일 키로, 해 순서대로.
const days = todayIndex([{ id: 'ev', title: { ko: '사건', en: 'Event' }, timeline: [
    { title: { ko: '나중', en: 'Later' }, body: { ko: '본문', en: 'Body' }, period: { start: [1920, 11, 23] } },
    { title: { ko: '먼저', en: 'Earlier' }, body: { ko: '본문', en: 'Body' }, period: { start: [1905, 11, 23] } },
    { title: { ko: '달만', en: 'Month' }, body: { ko: '본문', en: 'Body' }, period: { start: [1905, 11] } },
] }]);
assert.deepEqual(Array.from(days.keys()), ['11-23']);
assert.deepEqual(days.get('11-23').map(r => r.date[0]), [1905, 1920]);

// 기준점(『저작』·장 번호) 없이 레슨을 가리키는 문항만 잡는다. 기준점이 있으면
// 「이 책」「다음 장」은 그것을 받는 말이고, 질문 안의 「이 장면」은 해당하지 않는다.
const q = (ko, en) => ({ prompt: { ko, en }, choices: { ko: ['가', '나'], en: ['a', 'b'] } });
assert.equal(needsLessonContext(q('레닌은 1917년에 이 문서를 어떻게 이어받았는가?', 'How did Lenin take up this document in 1917?')), true);
assert.equal(needsLessonContext(q('유통시간 장은 2권의 전체 논지에 무엇을 보태는가?', 'What does the chapter on circulation time add?')), true);
assert.equal(needsLessonContext(q('이 장이 다음 “제국주의 비판” 장으로 이어지는 이유는?', 'Why does this chapter lead on?')), true);
assert.equal(needsLessonContext(q('레닌은 1917년에 마르크스의 『고타강령 비판』을 어떻게 이어받았는가?', 'How did Lenin take up the Critique of the Gotha Programme?')), false);
assert.equal(needsLessonContext(q('『자본론』 3권 33장은 34장의 은행법 비판으로 어떻게 이어지는가?', 'How does Capital, Volume III, Chapter 33 lead into Chapter 34?')), false);
assert.equal(needsLessonContext(q('『국가와 혁명』 1장이 이 책 전체에서 맡는 역할은?', 'What role does Chapter 1 play in the book?')), false);
assert.equal(needsLessonContext(q('목수가 책상을 만든다. 마르크스가 이 장면에서 꼽는 요소는?', 'In this scene, what elements?')), false);

// 카드 묶음은 세션 없는 공개 데이터 경로, 쇼츠 페이지는 HTML이다.
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/e3'), true);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/d11-23'), true);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3/x'), false);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts'), false);
assert.equal(isSessionFreeRequest({ method: 'GET', path: '/commulingo/drill/shorts/feed/0', cookies: {} }), true);

console.log('shorts story cards and feed path policy passed');
