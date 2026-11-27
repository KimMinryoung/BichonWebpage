const assert = require('node:assert/strict');
const { termPeriodLabelProblems } = require('../../data/commulingo/term-period-label');

// A term period label replaces only the numbers that cannot say the period
// (owner's decision 2026-11-27); a remark beside the dates is refused.
const pass = [
    { ko: '개념', en: 'Concept' },
    { ko: '냉전기', en: 'Cold War period' },
    { ko: '1924–1927, 1937–1945', en: '1924–1927, 1937–1945' },
    { ko: '19세기 말–현재', en: 'late 19th century–present' },
    { ko: '1917–1937/1938', en: '1917–1937/1938' },
    { ko: '1918년 6월 ~ 1919년 초', en: 'Jun 1918 – early 1919' },
    { ko: '1917년 10월 10일(구력)~11월 6일(신력)', en: '10 October (O.S.) – 6 November 1917' },
    { ko: '고대부터 현대까지', en: 'Antiquity to the present' },
    { ko: '1916년 겨울–1917년 봄', en: 'winter 1916 – spring 1917' },
];
for (const label of pass) assert.deepEqual(termPeriodLabelProblems(label), [], label.ko);

const refuse = [
    { ko: '1793년 6월 24일 채택, 시행되지 않음', en: 'Adopted 24 June 1793; never applied' },
    { ko: '1791년 프랑스 헌법', en: '1791 French Constitution' },
    { ko: '1921년 이후의 역사서술', en: 'Historiography since 1921' },
    { ko: '개념', en: '개념' },
];
for (const label of refuse) assert.ok(termPeriodLabelProblems(label).length, label.ko);
