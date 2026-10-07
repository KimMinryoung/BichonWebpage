-- 2026-10-07: the Quiberon prisoners were shot at Auray and Vannes; Sombreuil himself was
-- tried at Auray and shot at Vannes on 28 July 1795 (fr.wikipedia «Charles Eugène Gabriel de
-- Virot de Sombreuil»; people-extra-20261007-e REPORT).
UPDATE commulingo_history_events
   SET body_ko = replace(body_ko,
         '솜브뢰유와 동료 748~750명이 군사위원회의 판결로 오레에서 총살되었고,',
         '솜브뢰유와 동료 748~750명이 군사위원회의 판결로 오레와 반에서 총살되었고(솜브뢰유는 7월 28일 반에서),'),
       body_en = replace(body_en,
         'Sombreuil and 748 to 750 companions were shot at Auray on the verdict of a military commission,',
         'Sombreuil and 748 to 750 companions were shot at Auray and Vannes on the verdict of a military commission (Sombreuil at Vannes on 28 July),'),
       updated_at = now()
 WHERE id = 'vendee-war-1793-1796' AND strpos(body_ko, '판결로 오레에서 총살되었고') > 0;
