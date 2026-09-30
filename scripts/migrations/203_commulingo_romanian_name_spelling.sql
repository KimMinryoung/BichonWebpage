-- 203: Romanian names in the Korean prose follow 국립국어원 루마니아어 표기법
-- (ă 어, ș before a consonant or word-final 슈, c/g before e/i ㅊ/ㅈ):
--   Lucrețiu Pătrășcanu  파트라슈카누·파트러슈카누·푸트러슈카누·퍼트러셰카누·퍼트러셰아누 → 퍼트러슈카누
--   Emil Bodnăraș        보드너라시 → 보드너라슈
--   Nicolae Rădescu      라데스쿠 → 러데스쿠
--   Teohari Georgescu    게오르게스쿠 → 제오르제스쿠
--   Gheorghiu-Dej        게오르지우데지 → 게오르기우데지 (ghi is 기)
-- Vasile Luca's Hungarian birth name Luka László is 루커 라슬로 under the
-- Hungarian table (short a is 어), and the misspelled Tismăneanu alias
-- 티슈머네아누 is dropped (s is 스). Particles are unchanged: every
-- replacement keeps the final syllable open.

BEGIN;
CREATE TEMP TABLE ro_fix (wrong text, fixed text) ON COMMIT DROP;
INSERT INTO ro_fix VALUES
    ('파트라슈카누', '퍼트러슈카누'), ('파트러슈카누', '퍼트러슈카누'), ('푸트러슈카누', '퍼트러슈카누'),
    ('퍼트러셰카누', '퍼트러슈카누'), ('퍼트러셰아누', '퍼트러슈카누'),
    ('보드너라시', '보드너라슈'), ('라데스쿠', '러데스쿠'),
    ('게오르게스쿠', '제오르제스쿠'), ('게오르지우데지', '게오르기우데지');
CREATE FUNCTION pg_temp.ro_fix(t text) RETURNS text LANGUAGE plpgsql AS $f$
DECLARE r record;
BEGIN
    IF t IS NULL THEN RETURN t; END IF;
    FOR r IN SELECT * FROM ro_fix LOOP t := replace(t, r.wrong, r.fixed); END LOOP;
    RETURN t;
END $f$;

UPDATE commulingo_person_sections SET body_ko = pg_temp.ro_fix(body_ko) WHERE id IN (2488, 2496, 4066, 5306);
UPDATE commulingo_history_events SET body_ko = pg_temp.ro_fix(body_ko), outcome_ko = pg_temp.ro_fix(outcome_ko),
    timeline = pg_temp.ro_fix(timeline::text)::jsonb
    WHERE id IN ('eastern-europe-peoples-democracies', 'romania-1944-1948');
UPDATE commulingo_history_event_people SET note_ko = pg_temp.ro_fix(note_ko)
    WHERE person_id = 'gheorghe-gheorghiu-dej' AND event_id IN ('eastern-europe-peoples-democracies', 'romania-1944-1948');
UPDATE commulingo_terms SET body_ko = pg_temp.ro_fix(body_ko) WHERE id = 'titoism';
UPDATE commulingo_people SET moment_ko = pg_temp.ro_fix(moment_ko) WHERE id = 'petru-groza';

UPDATE commulingo_people SET bio_ko = replace(bio_ko, '루카 라슬로', '루커 라슬로') WHERE id = 'vasile-luca';
UPDATE commulingo_person_aliases SET alias = '루커 라슬로' WHERE person_id = 'vasile-luca' AND lang = 'ko' AND alias = '루카 라슬로';
DELETE FROM commulingo_person_aliases WHERE person_id = 'vladimir-tismaneanu' AND lang = 'ko' AND alias = '블라디미르 티슈머네아누';
COMMIT;
