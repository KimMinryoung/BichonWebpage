-- 096 nested 트로이카 and 58조 under 대숙청. Both outlast it — the troika sat
-- under the Cheka in 1918 and returned for collectivization in 1930, and
-- Article 58 stood from 1927 to 1961 — so by the same rule that kept 굴라크 and
-- 샤라시카 flat, they are instruments the purge used rather than parts of it.
-- They stay linked as related terms; those rows already exist (article-58 →
-- great-purge, great-purge → troika) and the store mirrors them both ways, so
-- detaching the parent is the whole change.
--
-- 예조프시나, 모스크바 재판 and 민족 작전 remain nested: none of them names
-- anything outside the campaign.

UPDATE commulingo_terms SET parent_id = NULL
 WHERE id IN ('troika', 'article-58');
