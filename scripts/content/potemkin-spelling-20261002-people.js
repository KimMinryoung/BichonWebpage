// 인물 카드의 「포템킨」을 표준 표기 「포툠킨」으로: 활동 근거 claim과 뮌첸베르크 절 본문.
// 근거 excerpt(원문 인용)는 고치지 않는다. node potemkin-people.js [--apply]
const service = require('/app/data/commulingo/person-editorial-service');
const db = require('/app/config/database');
const apply = process.argv.includes('--apply');
const fix = s => s.replace(/포템킨/g, '포툠킨').replace(/쓰베트날카/g, '젠트랄카');
(async () => {
  const out = [];
  for (const id of ['grigory-vakulinchuk', 'afanasi-matushenko']) {
    const p = await service.readPersonEditorial(id);
    const activities = p.activities.map(a => ({ ...a, evidence: (a.evidence || []).map(e => e.claim && e.claim.includes('포템킨') ? { ...e, claim: fix(e.claim) } : e) }));
    const changed = JSON.stringify(activities) !== JSON.stringify(p.activities);
    const src = p.activities.flatMap(a => a.evidence || []).find(e => e.claim && e.claim.includes('포템킨')).source;
    out.push([id, changed, await service.submitPersonEdit({ target: 'person', action: 'update', id, fields: { activities, expectedRevision: p.revision }, sources: [src], dryRun: !apply, changedBy: 'claude-potemkin-spelling' })]);
  }
  const m = await service.readPersonEditorial('willi-muenzenberg');
  const s = m.sections.find(x => x.slug === 'muenzenberg-media-empire');
  const body = { ...s.body, ko: fix(s.body.ko) };
  out.push(['willi-muenzenberg§', body.ko !== s.body.ko, await service.submitPersonEdit({ target: 'person_section', action: 'update', id: 'willi-muenzenberg', fields: { slug: s.slug, sortOrder: s.sortOrder, heading: s.heading, body, sources: s.sources, expectedRevision: m.revision, evidence: [{ field: 'body', claim: '표기만 고침: 전함 이름 포템킨 → 국립국어원 러시아어 표기 포툠킨(Потёмкин). 내용 변경 없음', source: s.sources[0], locator: 'Battleship Potemkin 언급', stance: 'supports' }] }, sources: s.sources, dryRun: !apply, changedBy: 'claude-potemkin-spelling' })]);
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
