#!/usr/bin/env node
const assert = require('assert');
const { fateLabelProblems, nationalityLabelProblems, isLongFateLabel } = require('../data/commulingo/person-card-validation');

assert.deepStrictEqual(fateLabelProblems({ ko: '옥사', en: 'Died in prison' }), []);
assert.deepStrictEqual(fateLabelProblems({ ko: '수용소에서 사망', en: 'Died in a labour camp' }), []);
assert.match(fateLabelProblems({ ko: '1945년 크라스노야르스크 수용소에서 작업 중 급사', en: 'x' })[0], /fate\.label\.ko is a sentence/);
assert.match(fateLabelProblems({ ko: 'x', en: 'Died in a Krasnoyarsk camp while at work in the spring of 1945' })[0], /fate\.label\.en is a sentence/);
assert.strictEqual(isLongFateLabel('자연사'), false);
assert.strictEqual(isLongFateLabel('퇴위 강요 후 망명, 스위스에서 사망'), true);

assert.deepStrictEqual(nationalityLabelProblems({ citizenshipKo: '소련', citizenshipEn: 'Soviet Union', originKo: '에스토니아 (스웨덴계)', originEn: 'Estonia (Swedish descent)' }), []);
assert.deepStrictEqual(nationalityLabelProblems({ originKo: '러시아 (우크라이나 출생, 유대인)', originEn: 'Russia (born in Ukraine, Jewish)' }), []);
const birthplace = nationalityLabelProblems({ originKo: '에스토니아 레발 출생(스웨덴계)', originEn: 'Born in Reval, Estonia (Swedish family)' });
assert.strictEqual(birthplace.length, 2);
assert.match(birthplace[0], /nationalOrigin\.label\.ko is a birthplace/);
assert.match(nationalityLabelProblems({ citizenshipKo: '레발 출생' })[0], /citizenship\.label\.ko is a birthplace/);

console.log('smoke-commulingo-person-card-validation: ok');
