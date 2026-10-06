// The Central Committee bodies with a membership roster page. Each roster is
// a host-mounted JSON file in the Politburo schema (politburo.json: members
// registry with spans, eras, per-congress tables), so a corrected date needs no
// deploy. A body's office line links to its roster from the office page.
const BODIES = {
    politburo: {
        file: 'politburo.json',
        path: '/commulingo/politburo',
        officeId: 'party-leadership',
        range: '1917–1991',
        title: { ko: '소련 정치국', en: 'The Soviet Politburo' },
        description: {
            ko: '1917년부터 1991년까지 소련 공산당 정치국·간부회의 구성원을 시기별·당대회 기수별로 정리한 표.',
            en: 'Membership of the Politburo and Presidium of the CPSU, 1917–1991, by era and by party congress.',
        },
        spans: {
            full: { ko: '정위원', en: 'Full member' },
            cand: { ko: '후보위원', en: 'Candidate' },
            orig: { ko: '1917.10 봉기 정치국', en: 'October 1917 Politburo' },
        },
        buckets: {
            full: { ko: '정위원', en: 'Full members' },
            candidates: { ko: '후보위원', en: 'Candidate members' },
        },
        counts: {
            full: { ko: '정위원', en: 'Full' },
            candidates: { ko: '후보', en: 'Candidates' },
        },
    },
    secretariat: {
        file: 'secretariat.json',
        path: '/commulingo/secretariat',
        officeId: 'party-secretariat-cadres',
        range: '1917–1991',
        title: { ko: '중앙위원회 서기국', en: 'The Central Committee Secretariat' },
        description: {
            ko: '1917년부터 1991년까지 소련 공산당 중앙위원회 서기국의 서기들을 시기별·당대회 기수별로 정리한 표.',
            en: 'The secretaries of the Central Committee of the CPSU, 1917–1991, by era and by party congress.',
        },
        spans: {
            full: { ko: '서기', en: 'Secretary' },
            cand: { ko: '후보 서기', en: 'Candidate secretary' },
        },
        buckets: {
            full: { ko: '서기', en: 'Secretaries' },
            candidates: { ko: '후보 서기', en: 'Candidate secretaries' },
        },
        counts: {
            full: { ko: '서기', en: 'Secretaries' },
            candidates: { ko: '후보', en: 'Candidates' },
        },
    },
    orgburo: {
        file: 'orgburo.json',
        path: '/commulingo/orgburo',
        officeId: 'party-secretariat-cadres',
        range: '1919–1952',
        title: { ko: '중앙위원회 조직국', en: 'The Central Committee Orgburo' },
        description: {
            ko: '1919년 창설부터 1952년 폐지까지 소련 공산당 중앙위원회 조직국의 구성원을 시기별·당대회 기수별로 정리한 표.',
            en: 'Membership of the Organisational Bureau of the Central Committee, from its creation in 1919 to its abolition in 1952, by era and by party congress.',
        },
        spans: {
            full: { ko: '위원', en: 'Member' },
            cand: { ko: '후보위원', en: 'Candidate' },
        },
        buckets: {
            full: { ko: '위원', en: 'Members' },
            candidates: { ko: '후보위원', en: 'Candidate members' },
        },
        counts: {
            full: { ko: '위원', en: 'Members' },
            candidates: { ko: '후보', en: 'Candidates' },
        },
    },
};

module.exports = { BODIES, BODY_IDS: Object.keys(BODIES) };
