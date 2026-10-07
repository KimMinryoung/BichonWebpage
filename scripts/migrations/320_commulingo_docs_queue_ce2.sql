-- 2026-10-07 docs queue CE2 (dev_docs/commulingo-queue-docs-20261007/PLAN.md): Hungarian,
-- Albanian and Czech documents translated and published; 1918 (four articles of the 1946
-- Albanian constitution) is resolved by the full translation of 1882.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (884,  'budapest-central-workers-council-resolution-1956', '2026-10-07 헝가리어 원문 완역 게재'),
    (1882, 'albania-constitution-1946', '2026-10-07 알바니아어 원문 완역 게재(96개 조와 공포 명령)'),
    (1918, 'albania-constitution-1946', '2026-10-07 헌법 전문 완역으로 해소(요청한 제7·8·11·12조는 1950년 개정 헌법 번호, 1946년 헌법에서는 제5·6·9·10조)'),
    (557,  'lessons-crisis-development-1970', '2026-10-07 체코어 원문 완역 게재')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
