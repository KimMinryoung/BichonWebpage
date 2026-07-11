INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'great-terror', v.person_id, v.sort_order, 'target', '좌익 반대파 표적', 'Left Opposition target', v.note_ko, v.note_en
FROM (VALUES
    ('preobrazhensky', 29, '46인 선언의 발기인이자 좌익 반대파 경제 이론가로 1937년 처형됐다.', 'An initiator of the Declaration of 46 and Left Opposition economist, executed in 1937.'),
    ('rakovsky', 30, '통합 반대파 지도자로 1938년 수감형 뒤 1941년 오룔 근처에서 총살됐다.', 'A United Opposition leader imprisoned in 1938 and shot near Oryol in 1941.'),
    ('radek', 31, '1937년 재판 뒤 수감됐고 1939년 감옥에서 살해됐다.', 'Imprisoned after the 1937 trial, he was killed in prison in 1939.'),
    ('smilga', 32, '좌익 반대파에 가담한 혁명·내전기 지도자로 1937년 처형됐다.', 'A revolutionary and Civil War leader who joined the Left Opposition and was executed in 1937.'),
    ('mrachkovsky', 33, '1927년 반대파 활동으로 제명됐고 1936년 첫 모스크바 재판에서 처형됐다.', 'Expelled for opposition activity in 1927, he was executed at the first Moscow Trial in 1936.'),
    ('pyatakov', 34, '반대파 활동 뒤 1937년 두 번째 모스크바 재판에서 처형됐다.', 'After opposition activity, he was executed at the second Moscow Trial in 1937.')
) AS v(person_id, sort_order, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
