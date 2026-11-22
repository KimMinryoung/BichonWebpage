#!/usr/bin/env node
const assert = require('assert');
const { fateLabelProblems, nationalityLabelProblems, isLongFateLabel } = require('../../data/commulingo/person-card-validation');

assert.deepStrictEqual(fateLabelProblems({ ko: '옥사', en: 'Died in prison' }), []);
assert.deepStrictEqual(fateLabelProblems({ ko: '수용소에서 사망', en: 'Died in a labour camp' }), []);
assert.match(fateLabelProblems({ ko: '1945년 크라스노야르스크 수용소에서 작업 중 급사', en: 'x' }).join(' | '), /fate\.label\.ko is a sentence/);
assert.match(fateLabelProblems({ ko: 'x', en: 'Died in a Krasnoyarsk camp while at work in the spring of 1945' }).join(' | '), /fate\.label\.en is a sentence/);
assert.strictEqual(isLongFateLabel('자연사'), false);
assert.strictEqual(isLongFateLabel('퇴위 강요 후 망명, 스위스에서 사망'), true);

assert.deepStrictEqual(nationalityLabelProblems({ citizenshipKo: '소련', citizenshipEn: 'Soviet Union', originKo: '에스토니아 (스웨덴계)', originEn: 'Estonia (Swedish descent)' }), []);
assert.deepStrictEqual(nationalityLabelProblems({ originKo: '러시아 (우크라이나 출생, 유대인)', originEn: 'Russia (born in Ukraine, Jewish)' }), []);
const birthplace = nationalityLabelProblems({ originKo: '에스토니아 레발 출생(스웨덴계)', originEn: 'Born in Reval, Estonia (Swedish family)' });
assert.strictEqual(birthplace.length, 2);
assert.match(birthplace[0], /nationalOrigin\.label\.ko is a birthplace/);
assert.match(nationalityLabelProblems({ citizenshipKo: '레발 출생' })[0], /citizenship\.label\.ko is a birthplace/);

// Label form, checked when the codes are given (2026-11-22 rule).
const form = labels => nationalityLabelProblems(labels);
assert.deepStrictEqual(form({ citizenshipCode: 'soviet', citizenshipKo: '소련', citizenshipEn: 'Soviet Union',
    originCode: 'russia', originKo: '러시아 (유대계)', originEn: 'Russia (Jewish)' }), []);
assert.deepStrictEqual(form({ citizenshipCode: 'russia', citizenshipKo: '러시아 제국', citizenshipEn: 'Russian Empire' }), []);
assert.match(form({ citizenshipCode: 'soviet', citizenshipKo: '러시아 제국 → 소련', citizenshipEn: 'Soviet Union' })[0], /must name one state/);
assert.match(form({ citizenshipCode: 'usa', citizenshipKo: '미국 (1943년 귀화)', citizenshipEn: 'United States' })[0], /must name one state/);
assert.match(form({ citizenshipCode: 'uk', citizenshipKo: '영국인', citizenshipEn: 'United Kingdom' })[0], /write the state/);
assert.match(form({ originCode: 'russia', originKo: '러시아인', originEn: 'Russia' })[0], /must start with the code's country/);
assert.match(form({ originCode: 'germany', originKo: '유대계 독일인', originEn: 'Germany (Jewish)' })[0], /must start with the code's country/);
assert.match(form({ originCode: 'france', originKo: '프랑스 (아버지는 폴란드계)', originEn: 'France (Polish descent)' })[0], /not a family remark/);
assert.match(form({ originCode: 'russia', originKo: '러시아', originEn: 'Russian' })[0], /nationalOrigin\.label\.en/);

// Fate kinds come from the shared contract; a label names the cause only.
const { fateDefaultLabel } = require('../../data/commulingo/person-card-validation');
assert.deepStrictEqual(fateLabelProblems({ kind: 'custody', ko: '수용소에서 사망', en: 'Died in a labour camp' }), []);
assert.deepStrictEqual(fateLabelProblems({ kind: 'unknown', ko: '', en: '' }), []);
assert.match(fateLabelProblems({ kind: 'deposed', ko: '실각', en: 'Deposed' })[0], /not one of/);
assert.match(fateLabelProblems({ kind: 'executed', ko: '교수형, 2007년 재심 무죄', en: 'Hanged' })[0], /names the cause only/);
assert.match(fateLabelProblems({ kind: 'suicide', ko: '자살(이설 있음)', en: 'Suicide' })[0], /names the cause only/);
assert.strictEqual(fateDefaultLabel('accident', 'ko'), '사고사');
assert.strictEqual(fateDefaultLabel('unknown', 'en'), 'Cause unknown');

// Career rows: one post or event per period, a noun phrase (2026-11-22).
const { careerRoleProblems } = require('../../data/commulingo/person-card-validation');
const row = (start, end, ko, en) => careerRoleProblems({ period: { start: [start], end: end ? [end] : null }, r: { ko, en } });
assert.deepStrictEqual(row(1905, 1907, '1905년 혁명 참가', 'Took part in the 1905 Revolution'), []);
assert.deepStrictEqual(row(1934, null, '부편집장, 문학대학 강사', 'Deputy editor; lecturer'), []);
assert.match(row(1934, null, 'US스틸 이사, 1938년 이사회 의장', 'Director; chairman from 1938')[0], /names 1938/);
assert.match(row(1937, null, '작전과장 → 사령관', 'Ops chief → commander')[0], /→/);
assert.match(row(1934, 1938, '내무인민위원을 지냈다.', "People's Commissar")[0], /sentence/);
assert.deepStrictEqual(row(1950, null, '이사', 'Director, Ford Motor Co.'), []);

console.log('smoke-commulingo-person-card-validation: ok');
