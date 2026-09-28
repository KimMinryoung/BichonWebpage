const assert = require('node:assert/strict');
const { leadSentences } = require('../data/commulingo/shorts');
const { needsLessonContext } = require('../data/commulingo/lesson-context');
const { isPublicCommuLingoDataPath, isSessionFreeRequest } = require('../config/route-policy');

// 한도 안이면 그대로, 넘치면 문장 경계에서 자르고, 첫 문장부터 넘치면 뺀다.
assert.equal(leadSentences('짧은 정의다.', 50), '짧은 정의다.');
assert.equal(leadSentences('첫 문장이다. 둘째 문장은 길어서 한도를 넘는다.', 12), '첫 문장이다.');
assert.equal(leadSentences('One sentence. Two sentences here.', 20), 'One sentence.');
assert.equal(leadSentences('끝없이 이어지는 한 문장이라 한도 안에서 자를 곳이 없다', 10), null);

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
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3'), true);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3/x'), false);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts'), false);
assert.equal(isSessionFreeRequest({ method: 'GET', path: '/commulingo/drill/shorts/feed/0', cookies: {} }), true);

console.log('shorts sentence trimming and feed path policy passed');
