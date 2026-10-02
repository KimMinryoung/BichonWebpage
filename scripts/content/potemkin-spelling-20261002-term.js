// 용어 피의 일요일 본문의 「포템킨 반란」 → 「포툠킨 반란」. node potemkin-term.js [--apply]
const service = require('/app/data/commulingo/term-editorial-service');
const db = require('/app/config/database');
const apply = process.argv.includes('--apply');
(async () => {
  const t = await service.readTermEditorial('bloody-sunday');
  const ko = t.body.ko.replace(/포템킨/g, '포툠킨');
  if (ko === t.body.ko) return console.log('unchanged');
  const sources = t.sources.length ? t.sources : [];
  const req = { id: 'bloody-sunday', action: 'update', sources, changedBy: 'claude-potemkin-spelling',
    fields: { body: { ko }, expectedRevision: t.revision,
      evidence: [{ field: 'body', claim: '표기만 고침: 포템킨 → 국립국어원 러시아어 표기 포툠킨(Потёмкин). 내용 변경 없음', source: sources[0], locator: 'Potemkin mutiny 언급' }] } };
  if (!apply) return console.log(await service.submitTermEdit({ ...req, dryRun: true }));
  const r = await service.submitTermEdit(req);
  console.log(r, await service.reviewTermSuggestion(r.suggestionId, true, '표기 통일(사용자 지시)', { changedBy: 'claude-potemkin-spelling' }));
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
