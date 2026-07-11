INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'great-terror', v.person_id, v.sort_order, 'target', v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('ivan-smirnov', 27, '좌익 반대파 표적', 'Left Opposition target', '1936년 첫 모스크바 재판에서 처형된 좌익 반대파의 주요 지도자였다.', 'A leading Left Opposition figure executed at the first Moscow Trial in 1936.'),
    ('varvara-yakovleva', 28, '좌익 반대파 표적', 'Left Opposition target', '1937년 체포된 뒤 수감 생활을 거쳐 1941년 오룔 감옥에서 총살됐다.', 'Arrested in 1937, she was eventually shot at Oryol prison in 1941.')
) AS v(person_id, sort_order, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
