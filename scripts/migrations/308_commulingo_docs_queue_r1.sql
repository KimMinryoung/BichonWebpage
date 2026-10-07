-- 2026-10-07 docs queue R1 (dev_docs/commulingo-queue-docs-20261007/PLAN.md): six Russian
-- documents translated and published under data/commulingo/docs; queue items marked done.
-- february-revolution: the quoted conditional-support phrase now matches the published translation (owner decision).
-- warsaw-pact: the 1955 Soviet draft (art. 1) names the United States, not Canada.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id='stalin-gottwald-letter-1950', resolution='2026-10-07 러시아어 원문 완역 게재', updated_at=now() WHERE id=566 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='petrograd-soviet-conditional-support-1917', resolution='2026-10-07 러시아어 원문 완역 게재', updated_at=now() WHERE id=613 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='molotov-paris-statement-1947', resolution='2026-10-07 러시아어 원문 완역 게재', updated_at=now() WHERE id=337 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='soviet-draft-european-collective-security-treaty-1955', resolution='2026-10-07 러시아어 원문 완역 게재', updated_at=now() WHERE id=1494 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='trotsky-1913-chkheidze-letter', resolution='2026-10-07 러시아어 원문 완역 게재(올민스키 앞 편지·회보 머리말 포함)', updated_at=now() WHERE id=1306 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='belgrade-declaration-1955', resolution='2026-10-07 러시아어 원문 완역 게재', updated_at=now() WHERE id=1014 AND status='pending';
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '"신생 권력이 그 의무를 수행하고 구체제와 단호히 싸우는 한도 내에서."', '"생겨나고 있는 이 권력이 이 약속들을 실현하고 구권력과 단호히 싸우는 방향으로 행동하는 그만큼."'), updated_at=now()
 WHERE id='february-revolution' AND body_ko LIKE '%"신생 권력이 그 의무를 수행하고 구체제와 단호히 싸우는 한도 내에서."%';
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko, '미국과 캐나다를 포함한 유럽 집단안보조약', '미국을 포함한 유럽 집단안보조약'),
       body_en = replace(body_en, 'including the United States and Canada,', 'including the United States,'), updated_at=now()
 WHERE id='warsaw-pact';
COMMIT;
