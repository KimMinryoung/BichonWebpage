-- 2026-10-07 owner decision: the Stolice conference (26 September 1941) issued no resolution;
-- the Supreme Staff bulletin Nos. 7–8 (conference report and Tito's orders) is published instead.
UPDATE commulingo_curation_gaps SET status='done', resolved_id='stolice-conference-bulletin-1941',
       resolution='2026-10-07 결의문 없음 — 『최고사령부 회보』 제7·8호의 회의 보고와 티토 명령을 세르보크로아트어 원문에서 완역 게재', updated_at=now()
 WHERE id=1372 AND status='pending';
