-- 2026-10-07 reference-document and event queue (dev_docs/commulingo-queue-docs-20261007/PLAN.md).
-- Events 2061 (Franco-Prussian War) and 2062 (Haitian Revolution) are registered.
-- 1473 (SALT II) and 1531 (INF) asked for documents that already existed; they were
-- resolved by linking the documents to the events. The owner excluded 23 requests
-- (status skipped, reason in resolution): Korean-language originals, copyrighted
-- memoirs/scholarship/speeches, documents with no surviving text, requests that
-- do not name one document, and programmes too long to translate in full.
BEGIN;
UPDATE commulingo_curation_gaps SET status='done', resolved_id='haitian-revolution-1791-1804', resolution='2026-10-07 사건 등록 (scripts/content/queue-events-20261007)', updated_at=now() WHERE id=2062 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='franco-prussian-war-1870-1871', resolution='2026-10-07 사건 등록 (scripts/content/queue-events-20261007)', updated_at=now() WHERE id=2061 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='salt-ii-treaty-1979', resolution='2026-10-07 이미 등록된 문헌을 사건(detente-salt, war-scare-1983)에 연결해 해소', updated_at=now() WHERE id=1473 AND status='pending';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='inf-treaty-1987', resolution='2026-10-07 이미 등록된 문헌을 사건(new-thinking-diplomacy, war-scare-1983)에 연결해 해소', updated_at=now() WHERE id=1531 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 한국어로 작성된 원문(김일성 저작집 수록)이라 번역 대상이 아님', updated_at=now() WHERE id=1932 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 처칠 연설 저작권(2035년까지)·한국어 번역 다수', updated_at=now() WHERE id=1694 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 개인 회고록 저작권', updated_at=now() WHERE id=1735 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 연구 문서집 저작권', updated_at=now() WHERE id=1634 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 개인 수첩 저작권', updated_at=now() WHERE id=1611 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 러시아어 원문 미공개, 영역본만 존재(중역 불가)', updated_at=now() WHERE id=1240 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 할더 개인 전쟁일지, 저작권', updated_at=now() WHERE id=1789 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 교과서 저작권', updated_at=now() WHERE id=1875 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 구두 명령으로 문서 원문이 없음', updated_at=now() WHERE id=1769 AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 한 편의 문서로 특정할 수 없는 요청', updated_at=now() WHERE id IN (1643, 1728, 1758, 1937) AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 원문 공개가 불확실하고 문서 특정이 약함', updated_at=now() WHERE id IN (1712, 1748, 1442, 1525) AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 400쪽 분량이라 완역 비현실적(발췌 번역은 기준상 불가)', updated_at=now() WHERE id IN (785, 565) AND status='pending';
UPDATE commulingo_curation_gaps SET status='skipped', resolution='2026-10-07 소유자 제외: 분량이 크고 사회주의사와 거리가 멂', updated_at=now() WHERE id=1681 AND status='pending';
COMMIT;
