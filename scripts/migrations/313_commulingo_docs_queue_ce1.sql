-- 2026-10-07 docs queue CE1 (dev_docs/commulingo-queue-docs-20261007/PLAN.md): PKWN July
-- Manifesto (Polish) and the Tito–Šubašić agreement of 1 November 1944 (Serbo-Croatian)
-- translated and published; 1372 (Stolice: no resolution, only the Supreme HQ bulletin) stays pending.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id=v.doc, resolution=v.note, updated_at=now()
  FROM (VALUES
    (1705, 'pkwn-july-manifesto-1944', '2026-10-07 폴란드어 원문 완역 게재'),
    (1552, 'tito-subasic-agreement-1944-11-01', '2026-10-07 세르보크로아트어 원문 완역 게재(저본에 날짜·서명 줄 없음)')
  ) AS v(id, doc, note)
 WHERE commulingo_curation_gaps.id = v.id AND status = 'pending';
COMMIT;
