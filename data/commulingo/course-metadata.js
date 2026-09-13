const COURSES = [
    {
        id: 'french-revolution-intro',
        releasedAt: '2026-09-13',
        volumeNumber: 11,
        title: {
            ko: '프랑스 혁명사',
            en: 'History of the French Revolution',
        },
        bookTitle: {
            ko: '프랑스 혁명사',
            en: 'History of the French Revolution',
        },
        badge: {
            ko: '짧은 학습 · 8편',
            en: '8 short lessons',
        },
        description: {
            ko: '미국 독립전쟁의 파급부터 1799년 브뤼메르까지, 대외전쟁·공포정치·자유와 평등의 쟁점을 혁명의 흐름 속에서 배웁니다.',
            en: 'Trace the Revolution from the impact of the American War to Brumaire in 1799, connecting foreign war, the Terror, liberty, and equality.',
        },
    },
    {
        id: 'marx-wages-and-programme',
        releasedAt: '2026-07-29',
        volumeNumber: 0,
        title: {
            ko: '마르크스: 임금, 가격, 이윤 · 고타강령 비판',
            en: 'Marx: Value, Price and Profit · Critique of the Gotha Programme',
        },
        bookTitle: {
            ko: '임금 투쟁과 분배',
            en: 'Wage Struggle and Distribution',
        },
        badge: {
            ko: '두 저작 함께 읽기',
            en: 'Two works, one book',
        },
        description: {
            ko: '임금 인상은 왜 가능한지, 분배를 앞세운 사회주의는 왜 막다른 길인지 답하는 두 글을 한 권으로 읽는다. 결론은 하나, 문제는 임금제도 그 자체다.',
            en: 'Two texts read as one book: why a rise in wages is possible, and why a socialism built on distribution is a dead end. One conclusion: the wages system itself is the object.',
        },
    },
];

function getCourseMetadata(id) {
    return COURSES.find(course => course.id === id) || null;
}

function getLatestCourseMetadata() {
    return COURSES
        .filter(course => Number.isFinite(Date.parse(`${course.releasedAt}T00:00:00Z`)))
        .slice()
        .sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))[0] || null;
}

module.exports = { getCourseMetadata, getLatestCourseMetadata };
