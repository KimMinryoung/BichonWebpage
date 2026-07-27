-- Four Hungarian names have their Korean given/family parts the wrong way
-- round. The Korean full name was written in Hungarian order (family first,
-- 쿤 벨러), and whatever filled the structured parts assigned them by position,
-- so 벨러 — the given name — is filed as the family name.
--
-- It shows up wherever the parts are read rather than the full string: the
-- display name is composed given + patronymic + family, and the linkifier offers
-- the family name as a bare alias (data/commulingo/people-linkify.js), so these
-- four would have linked 임레 and 벨러 as if they were surnames.
--
-- Swapping them also puts the displayed name in the same order as the
-- dictionary's other Hungarians (마차시 라코시, 미클로시 네메트): 벨러 쿤,
-- 임레 너지, 야노시 카다르, 죄르지 루카치. name_ko keeps the Hungarian-order
-- string, so prose and search that use it still match. Idempotent.

UPDATE commulingo_people SET given_name_ko = '벨러', family_name_ko = '쿤'
 WHERE id = 'bela-kun' AND family_name_ko = '벨러';

UPDATE commulingo_people SET given_name_ko = '임레', family_name_ko = '너지'
 WHERE id = 'nagy' AND family_name_ko = '임레';

UPDATE commulingo_people SET given_name_ko = '야노시', family_name_ko = '카다르'
 WHERE id = 'janos-kadar' AND family_name_ko = '야노시';

UPDATE commulingo_people SET given_name_ko = '죄르지', family_name_ko = '루카치'
 WHERE id = 'gyorgy-lukacs' AND family_name_ko = '죄르지';
