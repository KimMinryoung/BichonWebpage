-- 2026-10-07 docs queue F2 (dev_docs/commulingo-queue-docs-20261007/PLAN.md): three documents
-- translated from Italian, Spanish and Portuguese and published; three skipped.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (1675, 'italian-ultimatum-to-greece-1940', '2026-10-07 이탈리아어 원문(DDI 9계열 5권 문서 789) 완역 게재'),
    (1819, 'castro-1961-04-16-socialist-declaration', '2026-10-07 스페인어 속기본 완역 게재'),
    (1939, 'mpla-politburo-statement-27-may-1977', '2026-10-07 포르투갈어 원문 책자 전문 완역 게재')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution=v.note, updated_at=now()
  FROM (VALUES
    (1914, '2026-10-07 제외: 스페인어 원문 미확보, 영역만 약 22만 자(분량)'),
    (1919, '2026-10-07 제외: 포르투갈어 원문 온라인 없음, 영어 발췌본뿐'),
    (1920, '2026-10-07 제외: 조항 하나만 요청(발췌 금지), 1978-02-07 개정법 원문 미확보')
  ) AS v(id, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
