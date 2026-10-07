-- 2026-10-07 owner decisions: 188 published from the surviving pages of the only copy
-- (gap 214–247 marked in the text); 1367 published from The Hinge of Fate regardless of
-- copyright. Both translated from the original language.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (188,  'politburo-1985-04-04-anti-alcohol', '2026-10-07 러시아어 원문 완역 게재(볼코고노프 사본 잔존 18쪽, 214–247쪽 결락 표시)'),
    (1367, 'churchill-roosevelt-1942-07-08-sledgehammer', '2026-10-07 영어 원문(『The Hinge of Fate』 391–392쪽) 완역 게재 — 소유자 결정으로 저작권 판단 생략')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
