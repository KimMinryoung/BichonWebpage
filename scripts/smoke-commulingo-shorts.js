const assert = require('node:assert/strict');
const { leadSentences, needsLessonContext } = require('../data/commulingo/shorts');
const { isPublicCommuLingoDataPath, isSessionFreeRequest } = require('../config/route-policy');

// 한도 안이면 그대로, 넘치면 문장 경계에서 자르고, 첫 문장부터 넘치면 뺀다.
assert.equal(leadSentences('짧은 정의다.', 50), '짧은 정의다.');
assert.equal(leadSentences('첫 문장이다. 둘째 문장은 길어서 한도를 넘는다.', 12), '첫 문장이다.');
assert.equal(leadSentences('One sentence. Two sentences here.', 20), 'One sentence.');
assert.equal(leadSentences('끝없이 이어지는 한 문장이라 한도 안에서 자를 곳이 없다', 10), null);

// 레슨 맥락을 가리키거나 장 사이 연결을 묻는 문항은 카드에서 뺀다. 질문 안의
// 「이 장면」, 장 번호로 개념을 짚는 질문은 장 제목을 붙이면 풀리므로 남긴다.
const q = (ko, en) => ({ prompt: { ko, en }, choices: { ko: ['가', '나'], en: ['a', 'b'] } });
assert.equal(needsLessonContext(q('레닌은 1917년에 이 문서를 어떻게 이어받았는가?', 'How did Lenin take up this document in 1917?')), true);
assert.equal(needsLessonContext(q('33장은 34장의 은행법 비판으로 어떻게 이어지는가?', 'How does Chapter 33 lead into Chapter 34?')), true);
assert.equal(needsLessonContext(q('이 장이 다음 “제국주의 비판” 장으로 이어지는 이유는?', 'Why does it lead on?')), true);
assert.equal(needsLessonContext(q('목수가 책상을 만든다. 마르크스가 이 장면에서 꼽는 요소는?', 'In this scene, what elements?')), false);
assert.equal(needsLessonContext(q('27장에서 신용제도의 기본 역할은 무엇인가?', 'What is the role of credit in Chapter 27?')), false);
assert.equal(needsLessonContext(q('공장 밖의 이 생활이 자본의 재생산과 이어지는 고리는?', 'What links it?')), false);

// 카드 묶음은 세션 없는 공개 데이터 경로, 쇼츠 페이지는 HTML이다.
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3'), true);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3/x'), false);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts'), false);
assert.equal(isSessionFreeRequest({ method: 'GET', path: '/commulingo/drill/shorts/feed/0', cookies: {} }), true);

console.log('shorts sentence trimming and feed path policy passed');
