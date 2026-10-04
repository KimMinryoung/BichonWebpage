// 그루지야 수도 표기를 「트빌리시」로 통일(사용자 지시 2026-10-04): 인물 소개·결정적 장면·
// 경력·활동 근거 claim·인물 절, 용어 본문의 「티플리스」. 근거 excerpt(원문 인용)와
// 용어 근거 기록은 고치지 않는다. 사건 본문은 tbilisi-spelling-20261004.json(apply-event-text-fixes).
//   docker exec -w /app leninbot-frontend node /tmp/tb/fix.js [--apply]
const people = require('/app/data/commulingo/person-editorial-service');
const terms = require('/app/data/commulingo/term-editorial-service');
const db = require('/app/config/database');
const apply = process.argv.includes('--apply');
const ACTOR = 'claude-tbilisi-spelling';
const OLD = '티플리스';
const fix = s => s.replace(/트빌리시\(티플리스\)/g, '트빌리시').replace(/티플리스\(트빌리시\)/g, '트빌리시').replace(/티플리스/g, '트빌리시');
const has = s => typeof s === 'string' && s.includes(OLD);
const NOTE = '표기만 고침: 그루지야 수도 티플리스 → 트빌리시(사용자 지시로 시대와 관계없이 통일). 내용 변경 없음';

const PEOPLE = ['nestor-lakoba', 'stepan-shaumyan', 'kamo', 'roy-medvedev', 'nikolai-gikalo', 'viktor-kurnatovsky', 'nikolai-danilevsky',
    'zhores-medvedev', 'nikolai-chkheidze', 'bogdan-knunyants', 'akaki-kabakhidze', 'litvinov', 'ordzhonikidze', 'sofia-perovskaya', 'gorky'];
const TERMS = ['bloody-sunday', 'bolshevik', 'okhrana', 'kavbiuro', 'acmeism'];

async function fixPerson(id) {
    const p = await people.readPersonEditorial(id);
    const out = [];
    const fields = { expectedRevision: p.revision };
    const sources = new Set();
    for (const key of ['bio', 'moment']) if (p[key] && has(p[key].ko)) fields[key] = { ...p[key], ko: fix(p[key].ko) };
    const activities = p.activities.map(a => ({ ...a, evidence: (a.evidence || []).map(e => (has(e.claim) ? { ...e, claim: fix(e.claim) } : e)) }));
    if (JSON.stringify(activities) !== JSON.stringify(p.activities)) {
        fields.activities = activities;
        // Every activity is resubmitted, so every activity source must be cited.
        p.activities.flatMap(a => a.evidence || []).forEach(e => sources.add(e.source));
    }
    const careerEdits = p.career.filter(c => has(c.r.ko)).map(c => ({ op: 'update', id: String(c.id), entry: { r: { ko: fix(c.r.ko) } } }));
    if (careerEdits.length) fields.careerEdits = careerEdits;
    const changedKeys = Object.keys(fields).filter(k => k !== 'expectedRevision');
    if (changedKeys.length) {
        const evSource = [...sources][0] || (p.evidence || []).map(e => e.source).find(Boolean)
            || p.activities.flatMap(a => a.evidence || []).map(e => e.source).find(Boolean);
        if (fields.bio || fields.moment) {
            fields.evidence = ['bio', 'moment'].filter(k => fields[k]).map(field => ({ field, claim: NOTE, source: evSource, locator: '티플리스 표기', stance: 'supports' }));
            sources.add(evSource);
        }
        if (!sources.size && evSource) sources.add(evSource);
        out.push([id, changedKeys, await people.submitPersonEdit({ target: 'person', action: 'update', id, fields, sources: [...sources].filter(Boolean), dryRun: !apply, changedBy: ACTOR })]);
    }
    // Sections are their own edit targets, each with its own revision check.
    for (const s of p.sections.filter(s => has(s.body.ko))) {
        const fresh = apply ? await people.readPersonEditorial(id) : p;
        out.push([`${id}§${s.slug}`, ['body'], await people.submitPersonEdit({ target: 'person_section', action: 'update', id,
            fields: { slug: s.slug, sortOrder: s.sortOrder, heading: s.heading, body: { ...s.body, ko: fix(s.body.ko) }, sources: s.sources, expectedRevision: fresh.revision,
                evidence: [{ field: 'body', claim: NOTE, source: s.sources[0], locator: '티플리스 표기', stance: 'supports' }] },
            sources: s.sources, dryRun: !apply, changedBy: ACTOR })]);
    }
    return out;
}

async function fixTerm(id) {
    const t = await terms.readTermEditorial(id);
    const ko = fix(t.body.ko);
    if (ko === t.body.ko) return [[id, 'unchanged']];
    const req = { id, action: 'update', sources: t.sources, changedBy: ACTOR,
        fields: { body: { ko }, expectedRevision: t.revision, evidence: [{ field: 'body', claim: NOTE, source: t.sources[0], locator: '티플리스 표기' }] } };
    if (!apply) return [[id, await terms.submitTermEdit({ ...req, dryRun: true })]];
    const r = await terms.submitTermEdit(req);
    return [[id, r.status, (await terms.reviewTermSuggestion(r.suggestionId, true, '표기 통일(사용자 지시)', { changedBy: ACTOR })).status]];
}

(async () => {
    const out = [];
    for (const id of PEOPLE) {
        try { out.push(...await fixPerson(id)); } catch (e) { out.push([id, 'FAILED', e.message]); if (apply) throw e; }
    }
    for (const id of TERMS) out.push(...await fixTerm(id));
    console.log(JSON.stringify(out.map(([id, what, r, r2]) => [id, what, r && (r.status || r.dryRun || r), r2].filter(x => x !== undefined)), null, 1));
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
