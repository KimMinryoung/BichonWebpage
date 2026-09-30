-- 200: The 1948–1956 ruling party (Magyar Dolgozók Pártja, MDP) is
-- 헝가리 노동인민당 in the prose too, matching its term headword
-- (hungarian-working-peoples-party). 헝가리근로자당 and 헝가리 노동자당 stay only
-- as search aliases. Leo Frankel's 1880 General Workers' Party rows are a
-- different party and are left alone.

BEGIN;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '헝가리근로자당', '헝가리 노동인민당') WHERE id IN ('eastern-europe-peoples-democracies', 'hungary-1945-1949');
UPDATE commulingo_history_events SET outcome_ko = replace(outcome_ko, '헝가리근로자당', '헝가리 노동인민당'),
    timeline = replace(timeline::text, '헝가리근로자당', '헝가리 노동인민당')::jsonb WHERE id = 'hungary-1945-1949';
UPDATE commulingo_person_career_entries SET role_ko = replace(role_ko, '헝가리 노동자당(MDP)', '헝가리 노동인민당(MDP)') WHERE id = 2202;
UPDATE commulingo_person_sections SET body_ko = replace(body_ko, '헝가리 노동자당(MDP)', '헝가리 노동인민당(MDP)') WHERE id = 357;
UPDATE commulingo_terms SET body_ko = replace(body_ko, '헝가리 노동자당', '헝가리 노동인민당') WHERE id IN ('salami-tactics', 'sixteen-points-1956');
COMMIT;
