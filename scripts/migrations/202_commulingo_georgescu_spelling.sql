-- 202: Teohari Georgescu is 테오하리 제오르제스쿠 (루마니아어 표기법: ge before e
-- is 제), as his card already has it; Vasile Luca's section still carried
-- 게오르제스쿠 twice. Gheorghiu-Dej stays 게오르기우데지 (ghe is 게).

BEGIN;
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '게오르제스쿠', '제오르제스쿠') WHERE id = 5306;
COMMIT;
