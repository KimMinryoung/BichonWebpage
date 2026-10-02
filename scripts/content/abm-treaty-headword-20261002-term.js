// 용어 abm-treaty의 한국어 표제어 「ABM 조약」 → 위키백과 표기 「탄도탄 요격미사일 조약」.
// 옛 표제어는 별칭으로 남긴다. docker exec -i leninbot-frontend node - [--apply] < 이 파일
const service = require('/app/data/commulingo/term-editorial-service');
const db = require('/app/config/database');
const apply = process.argv.includes('--apply');
const WIKI = 'https://ko.wikipedia.org/wiki/탄도탄_요격미사일_조약';
(async () => {
  const t = await service.readTermEditorial('abm-treaty');
  if (t.term.ko === '탄도탄 요격미사일 조약') return console.log('unchanged');
  const ko = [t.term.ko, ...t.aliases.ko.filter(alias => alias !== t.term.ko)];
  const sources = [...new Set([...t.sources, WIKI])];
  const req = { id: 'abm-treaty', action: 'update', sources, changedBy: 'claude-abm-headword',
    fields: { term: { ko: '탄도탄 요격미사일 조약' }, aliases: { ko, en: t.aliases.en }, expectedRevision: t.revision,
      evidence: [{ field: 'term', claim: '표제어를 한국어 위키백과 표기 「탄도탄 요격미사일 조약」으로 바꾸고 옛 표제어 「ABM 조약」은 별칭으로 둠', source: WIKI, locator: '문서 제목' }] } };
  console.log({ before: t.term, aliases: { ko, en: t.aliases.en } });
  if (!apply) return console.log(await service.submitTermEdit({ ...req, dryRun: true }));
  const r = await service.submitTermEdit(req);
  console.log(r, await service.reviewTermSuggestion(r.suggestionId, true, '표제어를 표준 번역어로(사용자 지시)', { changedBy: 'claude-abm-headword' }));
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
