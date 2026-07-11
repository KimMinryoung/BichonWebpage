ALTER TABLE commulingo_history_event_people
    ADD COLUMN IF NOT EXISTS relation_kind TEXT NOT NULL DEFAULT 'target';

UPDATE commulingo_history_event_people
SET relation_kind = 'executor'
WHERE event_id = 'great-terror'
  AND person_id IN ('stalin', 'molotov', 'kaganovich', 'vyshinsky', 'yezhov', 'frinovsky', 'agranov', 'beria');

UPDATE commulingo_history_event_people
SET relation_kind = 'target'
WHERE event_id = 'great-terror'
  AND person_id NOT IN ('stalin', 'molotov', 'kaganovich', 'vyshinsky', 'yezhov', 'frinovsky', 'agranov', 'beria');

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'great-terror', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('stalin', 0, 'executor', '최고 결정권자', 'Supreme decision-maker', '대규모 탄압 정책과 NKVD 작전의 최종 정치적 권위를 행사했다.', 'He exercised the ultimate political authority over mass-repression policy and NKVD operations.'),
    ('molotov', 1, 'executor', '정치국 승인자', 'Politburo approver', '정치국 지도부의 일원으로 숙청 정책과 처형 명단 승인에 관여했다.', 'As a Politburo leader, he participated in approving purge policy and execution lists.'),
    ('kaganovich', 2, 'executor', '정치국 집행자', 'Politburo enforcer', '정치국 지도부의 일원으로 숙청 정책의 집행과 승인에 관여했다.', 'As a Politburo leader, he participated in enforcing and approving purge policy.'),
    ('vyshinsky', 3, 'executor', '국가 검찰', 'State prosecutor', '모스크바 재판에서 국가 검찰로 핵심 피고인들을 기소했다.', 'As state prosecutor at the Moscow Trials, he prosecuted leading defendants.'),
    ('yagoda', 8, 'executor', '전임 집행자', 'Predecessor and executor', '전임 NKVD 수장이었으며, 대테러기에는 자신도 재판과 처형의 표적이 되었다.', 'A former NKVD chief, he became a target of trial and execution during the terror.'),
    ('zinoviev', 20, 'target', '표적', 'Target', '1936년 첫 모스크바 재판에서 사형을 선고받은 옛 볼셰비키 지도자였다.', 'An Old Bolshevik leader sentenced to death at the first Moscow Trial in 1936.'),
    ('kamenev', 21, 'target', '표적', 'Target', '1936년 첫 모스크바 재판에서 처형된 옛 볼셰비키 지도자였다.', 'An Old Bolshevik leader executed after the first Moscow Trial in 1936.'),
    ('rykov', 22, 'target', '표적', 'Target', '1938년 모스크바 재판 뒤 처형된 전 정부수반이었다.', 'A former head of government executed after the 1938 Moscow Trial.'),
    ('krestinsky', 23, 'target', 'Target', 'Target', '1938년 모스크바 재판에서 유죄 판결 뒤 처형된 옛 볼셰비키였다.', 'An Old Bolshevik convicted and executed after the 1938 Moscow Trial.'),
    ('mezhlauk', 24, 'target', '표적', 'Target', '국가계획위원장 출신으로 1938년 처형됐다.', 'A former head of Gosplan executed in 1938.'),
    ('yakov-yakovlev', 25, 'target', '표적', 'Target', '농업 정책을 맡았던 당 지도자로 1938년 처형됐다.', 'A party leader associated with agricultural policy who was executed in 1938.'),
    ('babel', 26, 'target', '표적', 'Target', '1939년 체포되어 1940년 처형된 작가였다.', 'A writer arrested in 1939 and executed in 1940.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
