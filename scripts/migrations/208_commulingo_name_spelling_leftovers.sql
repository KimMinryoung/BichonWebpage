-- 208: Columns 205/206 did not cover: the Prague Spring summary, focus and two
-- event-person relation lines still said 두브체크, and the Cvetković–Maček
-- agreement kept its misspelled headword as an alias. The spaced alias moves
-- to 츠베트코비치; the hyphenated one now equals the headword and is dropped.

BEGIN;
UPDATE commulingo_history_events SET summary_ko = replace(summary_ko, '두브체크', '둡체크'),
    focus = replace(focus::text, '두브체크', '둡체크')::jsonb WHERE id = 'prague-spring';
UPDATE commulingo_history_event_people SET relation_ko = replace(relation_ko, '두브체크', '둡체크')
    WHERE event_id = 'prague-spring' AND person_id IN ('josef-pavel', 'viliam-salgovic');
DELETE FROM commulingo_term_aliases WHERE term_id = 'cvetkovicmacek-agreement' AND alias = '크베트코비치-마체크 협정';
UPDATE commulingo_term_aliases SET alias = '츠베트코비치 마체크 협정' WHERE term_id = 'cvetkovicmacek-agreement' AND alias = '크베트코비치 마체크 협정';
COMMIT;
