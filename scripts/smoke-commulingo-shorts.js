const assert = require('node:assert/strict');
const { leadSentences } = require('../data/commulingo/shorts');
const { isPublicCommuLingoDataPath, isSessionFreeRequest } = require('../config/route-policy');

// 한도 안이면 그대로, 넘치면 문장 경계에서 자르고, 첫 문장부터 넘치면 뺀다.
assert.equal(leadSentences('짧은 정의다.', 50), '짧은 정의다.');
assert.equal(leadSentences('첫 문장이다. 둘째 문장은 길어서 한도를 넘는다.', 12), '첫 문장이다.');
assert.equal(leadSentences('One sentence. Two sentences here.', 20), 'One sentence.');
assert.equal(leadSentences('끝없이 이어지는 한 문장이라 한도 안에서 자를 곳이 없다', 10), null);

// 카드 묶음은 세션 없는 공개 데이터 경로, 쇼츠 페이지는 HTML이다.
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3'), true);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts/feed/3/x'), false);
assert.equal(isPublicCommuLingoDataPath('/commulingo/drill/shorts'), false);
assert.equal(isSessionFreeRequest({ method: 'GET', path: '/commulingo/drill/shorts/feed/0', cookies: {} }), true);

console.log('shorts sentence trimming and feed path policy passed');
