-- 201: Ana Pauker is 아나 파우케르 (국립국어원 루마니아어 표기법: word-final r is
-- 르), not 파우커. The card, the Romanian prose that names her or her husband
-- Marcel, and the event texts move to 파우케르; the misspelled aliases are
-- dropped, as in 196. Particles stay as they are (커 and 르 both end open).
-- The NKVD officer Karl Pauker (id pauker) is already 카를 파우케르; the 파우커
-- in the Yezhov document is his and is left for the Soviet pass.

BEGIN;
DELETE FROM commulingo_person_aliases WHERE person_id = 'ana-pauker' AND lang = 'ko' AND alias IN ('아나 파우커', '안나 파우커');
UPDATE commulingo_people SET name_ko = '아나 파우케르', family_name_ko = '파우케르' WHERE id = 'ana-pauker';
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '파우커', '파우케르'),
    moment_ko = replace(moment_ko, '파우커', '파우케르'),
    epithet_ko = replace(epithet_ko, '파우커', '파우케르')
    WHERE id IN ('ana-pauker', 'teohari-georgescu', 'vasile-luca');
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '파우커', '파우케르') WHERE id IN (2837, 3176, 5207, 5306);
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '파우커', '파우케르'),
    timeline = replace(timeline::text, '파우커', '파우케르')::jsonb
    WHERE id IN ('eastern-europe-peoples-democracies', 'romania-1944-1948');
UPDATE commulingo_history_event_people SET note_ko = replace(note_ko, '파우커', '파우케르') WHERE event_id = 'romania-1944-1948' AND person_id = 'vasile-luca';
COMMIT;
