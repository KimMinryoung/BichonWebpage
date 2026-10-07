-- 2026-10-07 docs queue E and 150 (dev_docs/commulingo-queue-docs-20261007/PLAN.md):
-- three documents translated from the original language and published under
-- data/commulingo/docs; 1908 (full Korean translation exists) and 1928 (no
-- original-language text found) skipped. 1799 and 1367 stay pending (owner decision).
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (150,  'cpsu-basic-provisions-economic-management-1987', '2026-10-07 러시아어 원문 완역 게재'),
    (1905, 'un-cambodia-eccc-agreement-2003', '2026-10-07 영어 정본 완역 게재'),
    (1851, 'gromyko-toon-telegram-1977-12-12', '2026-10-07 영어 원문(FRUS 1977–80 vol. VI doc. 65) 완역 게재')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution=v.note, updated_at=now()
  FROM (VALUES
    (1908, '2026-10-07 제외: 한국어 전문 번역 기존재(국사편찬위원회 『자료대한민국사』 제11권)'),
    (1928, '2026-10-07 제외: 암하라어 원문·영어 전문 모두 입수 불가')
  ) AS v(id, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
