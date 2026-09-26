-- 189: one French Revolution group instead of two.
--
-- Migration 188 split the French shelf at 18 Brumaire (구체제와 대혁명,
-- 통령정부·제정과 복고 왕정). The operator merged them the same day: 41 cards
-- read as one sequence from Louis XVI to the July Revolution, and a second
-- group of five added a boundary without helping anyone find a person. The
-- surviving id keeps its URL; the retired one 301s through
-- commulingo_id_redirects, which gains the 'people-group' entity type.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_id_redirects DROP CONSTRAINT commulingo_id_redirects_entity_type_check;
ALTER TABLE commulingo_id_redirects ADD CONSTRAINT commulingo_id_redirects_entity_type_check
    CHECK (entity_type = ANY (ARRAY['person'::text, 'office'::text, 'role-category'::text, 'term'::text, 'people-group'::text]));

UPDATE commulingo_people_groups
   SET range_label = '1774–1830',
       title_ko = '대혁명과 나폴레옹 시대',
       title_en = 'The Revolution and the Napoleonic era',
       blurb_ko = '루이 16세의 왕정에서 1789년 삼부회, 공포정치와 테르미도르, 나폴레옹 제정과 부르봉 복고를 거쳐 1830년 7월 혁명까지 — 혁명을 일으키고 이끈 사람들, 혁명을 끝낸 사람들, 그리고 그에 맞선 국왕·망명귀족·방데 봉기와 대불동맹의 지휘관들.',
       blurb_en = 'From Louis XVI''s monarchy through the Estates-General of 1789, the Terror and Thermidor, Napoleon''s Empire and the Bourbon Restoration to the July Revolution of 1830 — those who made the Revolution, those who ended it, and the king, émigrés, Vendée rebels and coalition commanders who fought it.',
       updated_at = NOW()
 WHERE id = 'france-revolution';

UPDATE commulingo_people
   SET group_id = 'france-revolution', updated_at = NOW()
 WHERE group_id = 'france-napoleon';

DELETE FROM commulingo_people_groups WHERE id = 'france-napoleon';

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note)
VALUES ('people-group', 'france-napoleon', 'france-revolution', 'migration 189: French groups merged')
ON CONFLICT (entity_type, from_id) DO UPDATE SET to_id = EXCLUDED.to_id, note = EXCLUDED.note;

COMMIT;
