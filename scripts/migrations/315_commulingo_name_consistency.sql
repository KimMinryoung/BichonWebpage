-- 2026-10-07 owner request: one Korean name per body across the site.
-- Krajowa Rada Narodowa = 국가국민평의회; Milicja Obywatelska = 시민경찰 (term
-- milicja-obywatelska-citizens-militia); NKOJ = 유고슬라비아 민족해방위원회 (the published
-- Tito–Šubašić and PKWN translations). Terms and person sections were changed through the
-- editorial services (scripts/content/name-consistency-*-20261007.json).
BEGIN;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '7월 선언에서 국민평의회를', '7월 선언에서 국가국민평의회를'), updated_at = now()
 WHERE id = 'warsaw-uprising' AND strpos(body_ko, '7월 선언에서 국민평의회를') > 0;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '시민민병대', '시민경찰'), updated_at = now()
 WHERE id IN ('solidarity-martial-law', 'poland-1944-1948') AND strpos(body_ko, '시민민병대') > 0;
UPDATE commulingo_history_events
   SET body_ko = replace(replace(body_ko,
         '민족해방 유고슬라비아 국가위원회를 설치했다', '유고슬라비아 민족해방위원회(NKOJ)를 설치했다'),
         '당장 확정하지 않고, 민족해방위원회와 망명정부 인사를', '당장 확정하지 않고, 유고슬라비아 민족해방위원회와 망명정부 인사를'),
       updated_at = now()
 WHERE id = 'yugoslav-partisans' AND strpos(body_ko, '민족해방 유고슬라비아 국가위원회') > 0;
COMMIT;
