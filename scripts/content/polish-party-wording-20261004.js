// 1945년 이후의 폴란드 집권당을 「폴란드 공산당」으로 느슨하게 쓴 곳을 고친다(2026-10-04 정당 용어
// 등록 때 「폴란드 공산당」이 1918–1938년 KPP 항목으로 자동 링크되면서 드러남). 사건 본문 두 곳은
// polish-party-wording-20261004.json(apply-event-text-fixes)으로 고쳤다.
//   docker exec -w /app leninbot-frontend node /tmp/pw/fix.js [--apply]
const people = require('/app/data/commulingo/person-editorial-service');
const terms = require('/app/data/commulingo/term-editorial-service');
const db = require('/app/config/database');
const apply = process.argv.includes('--apply');
const ACTOR = 'claude-polish-party-wording';
const NOTE = '표기만 고침: 1945년 이후 폴란드 집권당(폴란드 통일노동자당)을 1918–1938년 폴란드 공산당과 구분. 내용 변경 없음';
const BIO = {
    'mark-kramer': ['1956년 흐루쇼프 비밀연설이 폴란드 공산당 지도부와', '1956년 흐루쇼프 비밀연설이 폴란드 통일노동자당 지도부와'],
    'roman-fideliski': ['폴란드 공산당 출신의 기계공학 배경 기술관료', '폴란드 공산주의자 출신의 기계공학 배경 기술관료'],
};
const SECTION = { id: 'jan-pauer', slug: 'government-historians-commission-and-rewriting-1968', from: '헝가리, 폴란드 공산당 중앙위원회', to: '헝가리 공산당과 폴란드 통일노동자당 중앙위원회' };
const TERM = { id: 'oder-neisse-line', from: '전후 폴란드 공산당은', to: '전후 폴란드 공산 정권은' };

(async () => {
    const out = [];
    for (const [id, [from, to]] of Object.entries(BIO)) {
        const p = await people.readPersonEditorial(id);
        if (!p.bio.ko.includes(from)) { out.push([id, 'unchanged']); continue; }
        const source = (p.evidence || []).map(e => e.source).find(Boolean) || p.activities.flatMap(a => a.evidence || []).map(e => e.source).find(Boolean);
        out.push([id, (await people.submitPersonEdit({ target: 'person', action: 'update', id, sources: [source], dryRun: !apply, changedBy: ACTOR,
            fields: { expectedRevision: p.revision, bio: { ...p.bio, ko: p.bio.ko.replace(from, to) },
                evidence: [{ field: 'bio', claim: NOTE, source, locator: '폴란드 집권당 표기', stance: 'supports' }] } })).status]);
    }
    {
        const p = await people.readPersonEditorial(SECTION.id);
        const s = p.sections.find(x => x.slug === SECTION.slug);
        if (s.body.ko.includes(SECTION.from)) out.push([`${SECTION.id}§${s.slug}`, (await people.submitPersonEdit({ target: 'person_section', action: 'update', id: SECTION.id,
            fields: { slug: s.slug, sortOrder: s.sortOrder, heading: s.heading, body: { ...s.body, ko: s.body.ko.replace(SECTION.from, SECTION.to) }, sources: s.sources, expectedRevision: p.revision,
                evidence: [{ field: 'body', claim: NOTE, source: s.sources[0], locator: '폴란드 집권당 표기', stance: 'supports' }] },
            sources: s.sources, dryRun: !apply, changedBy: ACTOR })).status]);
    }
    {
        const t = await terms.readTermEditorial(TERM.id);
        if (t.body.ko.includes(TERM.from)) {
            const req = { id: TERM.id, action: 'update', sources: t.sources, changedBy: ACTOR,
                fields: { expectedRevision: t.revision, body: { ko: t.body.ko.replace(TERM.from, TERM.to) }, evidence: [{ field: 'body', claim: NOTE, source: t.sources[0], locator: '폴란드 집권당 표기' }] } };
            if (!apply) out.push([TERM.id, (await terms.submitTermEdit({ ...req, dryRun: true })).status]);
            else { const r = await terms.submitTermEdit(req); out.push([TERM.id, (await terms.reviewTermSuggestion(r.suggestionId, true, '표기 정정(정당 용어 등록 후속)', { changedBy: ACTOR })).status]); }
        }
    }
    console.log(JSON.stringify(out));
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
