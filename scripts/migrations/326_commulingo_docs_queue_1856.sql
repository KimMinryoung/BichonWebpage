-- 2026-10-07 owner decision: the Vietnam–Laos treaty of 18 July 1977 is published from the
-- seven articles (Vietnamese) available; the missing title, preamble and signatures are marked.
UPDATE commulingo_curation_gaps SET status='done', resolved_id='vietnam-laos-friendship-treaty-1977',
       resolution='2026-10-07 베트남어 원문 제1~7조 완역 게재(정식 제목·전문·서명란 결락 표시)', updated_at=now()
 WHERE id=1856 AND status='pending';
