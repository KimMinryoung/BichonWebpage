-- 2026-10-07 docs queue Asia and 1799 (dev_docs/commulingo-queue-docs-20261007/PLAN.md):
-- four documents published; 1843 (about 286,000 characters) and 1813 (Korean translation in
-- the Selected Works vol. 5) skipped; 1856 (treaty articles only, title/preamble/signatures
-- not found) stays pending for the owner's decision.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (1799, 'ethiopia-rural-land-proclamation-1975', '2026-10-07 관보 영어 공식본에서 완역 게재(정본은 암하라어, 소유자 결정)'),
    (1795, 'vietnam-national-assembly-resolution-1976-07-02', '2026-10-07 베트남어 원문 완역 게재(사이공 개칭은 같은 날 별도 결의)'),
    (1870, 'cppcc-common-program-1949', '2026-10-07 중국어 원문 완역 게재'),
    (1318, 'kwantung-army-border-dispute-guidelines-1939', '2026-10-07 일본어 원문(JACAR C13010596700) 완역 게재 — 정식 제목 「만·소 국경분쟁 처리 요강」')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution=v.note, updated_at=now()
  FROM (VALUES
    (1843, '2026-10-07 제외: 분량(원문 약 28.6만 자), 발췌 불가'),
    (1813, '2026-10-07 제외: 한국어 번역 기존재(『모택동선집』 제5권 조선어판, 1977)')
  ) AS v(id, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
