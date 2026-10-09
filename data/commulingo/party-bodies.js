// The Central Committee bodies with a membership roster page. Each roster is
// a database document keyed by the body id (data-documents.js) in the
// Politburo schema (members registry with spans, eras, per-congress tables),
// so a corrected date needs no commit or deploy. A body's office line links to its roster from the office page.
// termIds are the glossary entries the roster links to (first = the body's own
// entry), as commulingo_offices.term_ids does for an office page; every one of
// them names the Central Committee too, so its entry gathers the rosters.
// The glossary entry the office index's Central Committee rosters head with.
const CENTRAL_COMMITTEE_TERM_ID = 'central-committee-of-the-cpsu';

const BODIES = {
    politburo: {
        path: '/commulingo/politburo',
        termIds: ['politburo-of-the-cpsu', 'presidium-of-the-cpsu-central-committee', CENTRAL_COMMITTEE_TERM_ID],
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
        path: '/commulingo/secretariat',
        termIds: ['secretariat-of-the-cpsu-central-committee', CENTRAL_COMMITTEE_TERM_ID],
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
        path: '/commulingo/orgburo',
        termIds: ['orgburo-of-the-cpsu-central-committee', CENTRAL_COMMITTEE_TERM_ID],
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

module.exports = { BODIES, BODY_IDS: Object.keys(BODIES), CENTRAL_COMMITTEE_TERM_ID };
