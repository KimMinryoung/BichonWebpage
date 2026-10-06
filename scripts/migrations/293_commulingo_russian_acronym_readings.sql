-- 293: Korean readers meet Russian security and state acronyms (NKVD, OGPU, KGB …)
-- without knowing how they are said. Each term's Korean definition now ends with
-- the Russian letter-name reading (НКВД 엔카베데, ГПУ 게페우, КГБ 카게베; letter
-- names г 게, к 카, в 베, д 데, ч 체, п 페, р 에르, с 에스, м 엠, н 엔, х 하).
-- VSNKh's definition is at the 400-character limit, so its reading opens the body.
-- 2026-10-06 user request.

BEGIN;
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 GPU(ГПУ)는 러시아어로 '게페우', OGPU(ОГПУ)는 '오게페우'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'ogpu' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 NKVD(НКВД)는 러시아어로 '엔카베데'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'nkvd' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 KGB(КГБ)는 러시아어로 '카게베'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'kgb' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 MGB(МГБ)는 러시아어로 '엠게베'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'mgb' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 GKChP(ГКЧП)는 러시아어로 '게카체페'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'gkchp' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 GKO(ГКО)는 러시아어로 '게카오'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'state-defense-committee-gko' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 체카는 약칭 ЧК를 읽은 이름이고, 전러시아 비상위원회의 약칭 ВЧК는 '베체카'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'cheka' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 ВКВС는 러시아어로 '베카베에스'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'military-collegium-ussr' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 PGU(ПГУ)는 러시아어로 '페게우'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'first-chief-directorate-pgu' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ 약칭 OSO(ОСО)는 러시아어로 '오소'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'special-conference-of-the-mgb-oso' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET definition_ko = definition_ko || $q$ RBMK(РБМК)는 러시아어로 '에르베엠카'라고 읽는다.$q$, updated_at = now()
    WHERE id = 'rbmk-reactor' AND definition_ko NOT LIKE '%라고 읽는다.%';
UPDATE commulingo_terms SET body_ko = replace(body_ko, $q$## 두 기관

최고국민경제회의라는 이름은$q$, $q$## 두 기관

약칭 VSNKh(ВСНХ)는 러시아어로 '베에스엔하'라고 읽는다. 최고국민경제회의라는 이름은$q$), updated_at = now()
    WHERE id = 'supreme-council-of-the-national-economy-vsnkh' AND body_ko NOT LIKE '%베에스엔하%';
COMMIT;
