-- 199: The Hungarian New Course is 새 노선 across the dictionary (term
-- new-course-hungary-1953; 신방침 is Trotsky's 1923 New Course), so the
-- people rows of the new hungary-new-course-1953 event follow its body.

BEGIN;
UPDATE commulingo_history_event_people
   SET relation_ko = replace(relation_ko, '신노선', '새 노선'), note_ko = replace(note_ko, '신노선', '새 노선')
 WHERE event_id = 'hungary-new-course-1953' AND (relation_ko LIKE '%신노선%' OR note_ko LIKE '%신노선%');
COMMIT;
