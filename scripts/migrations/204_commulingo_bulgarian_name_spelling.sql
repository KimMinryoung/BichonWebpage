-- 204: Bulgarian names follow one Korean spelling. There is no 국립국어원 table
-- for Bulgarian, so the dictionary keeps what its cards already do: the
-- Russian table for Cyrillic, with ъ as 어 (디미터르 블라고예프, 페터르 믈라데노프).
--   Кръстев / Кръстева    크라스테프·크라스테바 → 크러스테프·크러스테바
--   Александър            알렉산다르 → 알렉산더르 (Stamboliyski)
--   Георгиев / Георгиева  게오르기에프·게오르기에바 → 게오르기예프·게오르기예바 (e after a vowel is 예)
--   Дамян Велчев          다미안 → 다먄
-- Christian Rakovsky (Раковский) is 라콥스키 on his card; the prose that named
-- him 라코프스키 was linking to the Polish premier Mieczysław Rakowski, whose
-- Polish spelling 라코프스키 is right and stays. Ivan Krastev's Korean
-- translations print 이반 크라스테프, so that spelling is kept as an alias.
-- Evidence rows (quoted claims) are left alone.

BEGIN;
UPDATE commulingo_people SET name_ko = '이반 크러스테프', family_name_ko = '크러스테프' WHERE id = 'ivan-krastev';
UPDATE commulingo_person_aliases SET alias = '이반 요토프 크러스테프' WHERE person_id = 'ivan-krastev' AND lang = 'ko' AND alias = '이반 요토프 크라스테프';
UPDATE commulingo_person_aliases SET alias = '이반 크라스테프' WHERE person_id = 'ivan-krastev' AND lang = 'ko' AND alias = '이반 크러스테프';
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '크라스테', '크러스테') WHERE id = 4105;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '크라스테프', '크러스테프') WHERE id = 'revolutions-1989';
UPDATE commulingo_curation_gaps SET label_ko = '이반 크러스테프' WHERE id = 1082;

UPDATE commulingo_history_events SET
    body_ko = replace(replace(replace(body_ko, '게오르기에프', '게오르기예프'), '다미안 벨체프', '다먄 벨체프'), '알렉산다르 스탐볼리스키', '알렉산더르 스탐볼리스키'),
    timeline = replace(replace(replace(timeline::text, '게오르기에프', '게오르기예프'), '다미안 벨체프', '다먄 벨체프'), '알렉산다르 스탐볼리스키', '알렉산더르 스탐볼리스키')::jsonb
    WHERE id = 'bulgaria-1944-1949';
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '게오르기에프', '게오르기예프') WHERE id = 2132;
UPDATE commulingo_terms SET body_ko = replace(body_ko, '게오르기에바', '게오르기예바') WHERE id = 'ai-bubble';

UPDATE commulingo_people SET bio_ko = replace(bio_ko, '라코프스키', '라콥스키'), moment_ko = replace(moment_ko, '라코프스키', '라콥스키') WHERE id = 'afanasi-matushenko';
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '라코프스키', '라콥스키') WHERE id IN (2448, 4851);
UPDATE commulingo_terms SET body_ko = replace(body_ko, '라코프스키', '라콥스키') WHERE id = 'united-opposition';
UPDATE commulingo_person_career_entries SET role_ko = replace(role_ko, '라코프스키', '라콥스키') WHERE id = 2228;
COMMIT;
