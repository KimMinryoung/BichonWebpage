// 용어 「적위대」(red-guards)의 「구별해야 할 대상」 끝 문장: 핀란드 적위대를 러시아 적위대의
// 일부처럼 읽히게 하던 서술을 고친다(사용자 지시 2026-10-04). 같은 이름의 부대가 구 제국
// 각지에 있었다는 사실은 남기고, 핀란드 적위대는 핀란드 노동운동이 따로 조직한 별개 조직으로
// 새 용어 「핀란드 적위대」(finnish-red-guards)에 넘긴다.
//   docker exec -w /app leninbot-frontend node /tmp/cw/red-guards.js [--apply]
const service = require('/app/data/commulingo/term-editorial-service');
const db = require('/app/config/database');
const apply = process.argv.includes('--apply');
const ACTOR = 'claude-red-guards-finland';
const FIN = 'https://en.wikipedia.org/wiki/Red_Guards_%28Finland%29';
const FROM = {
    ko: '러시아의 적위대는 중앙집권적 조직이 아니었고 핀란드, 폴란드, 에스토니아, 우크라이나를 포함한 구 러시아 제국의 대부분 지역에 걸쳐 있었다.',
    en: 'The Russian Red Guards were not a centralized body: they were organized across most of the former Russian Empire, including Finland, Poland, Estonia and Ukraine.',
};
const TO = {
    ko: '러시아의 적위대는 중앙집권적 조직이 아니었고, 대개 그 지역의 당 조직과 소비에트가 결정해 만들었다. 같은 이름의 무장 부대는 폴란드·에스토니아·우크라이나를 비롯한 구 러시아 제국 각지에 생겼다. 다만 핀란드 적위대는 핀란드 사회민주당 지역 조직과 노동조합이 모집하고 핀란드인 지휘관이 이끈 별개의 조직으로, 1918년 핀란드 내전에서 싸웠다(핀란드 적위대 항목).',
    en: 'The Russian Red Guards were not a centralized body; they were usually formed by decision of the local party organization and soviet. Formations of the same name arose across the former Russian Empire, in Poland, Estonia, Ukraine and elsewhere. The Finnish Red Guards, however, were a separate organization, recruited through the local sections of the Finnish Social Democratic Party and the labour unions and led by Finnish commanders, and they fought the Finnish Civil War of 1918 (see Finnish Red Guards).',
};
(async () => {
    const t = await service.readTermEditorial('red-guards');
    const body = {};
    for (const lang of ['ko', 'en']) {
        if (!t.body[lang].includes(FROM[lang])) throw new Error(`red-guards body.${lang}: sentence not found`);
        body[lang] = t.body[lang].replace(FROM[lang], TO[lang]);
    }
    const sources = t.sources.includes(FIN) ? t.sources : [...t.sources, FIN];
    const req = { id: 'red-guards', action: 'update', sources, changedBy: ACTOR,
        fields: { body, expectedRevision: t.revision, evidence: [
            { field: 'body', claim: 'Finnish Red Guards were recruited through local social democratic party sections and labour unions', source: FIN, locator: 'Workers\' Order Guards; 1918 Civil War — Commanders',
                excerpt: 'On 20 October, the Finnish Trade Union Federation urged the party and trade union locals to establishing Workers\' Order Guards throughout the country.' },
        ] } };
    if (!apply) return console.log(await service.submitTermEdit({ ...req, dryRun: true }));
    const r = await service.submitTermEdit(req);
    console.log(r.status, (await service.reviewTermSuggestion(r.suggestionId, true, '핀란드 적위대 구분(사용자 지시)', { changedBy: ACTOR })).status);
})().catch(e => { console.error(e.stack); process.exitCode = 1; }).finally(() => db.end());
