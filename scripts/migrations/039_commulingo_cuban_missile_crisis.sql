-- The Cuban Missile Crisis (1962), placed at sort_order 93 between the space
-- program (90) and the Prague Spring (95). Idempotent.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('cuban-missile-crisis', 93, '1962',
     '쿠바 미사일 위기', 'The Cuban Missile Crisis',
     '세계는 어떻게 핵전쟁의 문턱까지 갔다가 되돌아왔는가?',
     'How did the world come to the brink of nuclear war and step back?',
     '쿠바 미사일 위기는 1962년 소련이 쿠바에 핵미사일을 배치하면서 미국과 정면충돌한 13일간의 대치다. 미국의 쿠바 침공 위협과 튀르키예에 배치된 미국 미사일에 대응해, 흐루쇼프는 혁명 쿠바를 지키고 전략적 균형을 맞추려 미사일을 들여보냈다. 미국이 이를 정찰기로 포착해 해상 봉쇄로 맞서면서 세계는 핵전쟁의 문턱에 섰다.',
     'The Cuban Missile Crisis was a thirteen-day confrontation in 1962, when the Soviet Union placed nuclear missiles in Cuba and collided head-on with the United States. Responding to the U.S. threat of invading Cuba and to American missiles deployed in Turkey, Khrushchev sent the missiles to defend revolutionary Cuba and balance the strategic scales. When U.S. reconnaissance discovered them and answered with a naval blockade, the world stood at the threshold of nuclear war.',
     '비밀 협상 끝에 소련은 쿠바에서 미사일을 철수하고, 미국은 쿠바를 침공하지 않으며 튀르키예의 미사일을 조용히 철거하기로 했다. 위기는 핵전쟁 직전에서 멈췄고, 이후 미소는 직통전화(핫라인)와 부분핵실험금지조약으로 위기관리에 나섰다. 자신을 건너뛴 합의에 카스트로는 분노했다.',
     'After secret negotiations the Soviet Union withdrew its missiles from Cuba, while the United States pledged not to invade Cuba and quietly removed its missiles from Turkey. The crisis stopped just short of nuclear war, and afterward the superpowers moved toward managing such risks with a direct hotline and the Partial Test Ban Treaty. Castro was furious at a deal that had gone over his head.',
     $$[
       {"date":"1961","title":{"ko":"위기의 배경","en":"The background"},"body":{"ko":"미국의 피그만 침공 실패와 쿠바 압박, 튀르키예의 미국 미사일 배치가 위기의 토대가 됐다.","en":"The failed Bay of Pigs invasion, pressure on Cuba, and U.S. missiles in Turkey set the stage for the crisis."}},
       {"date":"1962 여름","title":{"ko":"아나디르 작전","en":"Operation Anadyr"},"body":{"ko":"소련이 비밀리에 쿠바로 핵미사일과 병력을 실어 날랐다.","en":"The Soviet Union secretly shipped nuclear missiles and troops to Cuba."}},
       {"date":"1962.10.16","title":{"ko":"미사일 발견","en":"The missiles discovered"},"body":{"ko":"미국 정찰기가 쿠바의 미사일 기지를 촬영했다.","en":"U.S. reconnaissance photographed the missile sites in Cuba."}},
       {"date":"1962.10.22","title":{"ko":"해상 봉쇄","en":"The naval blockade"},"body":{"ko":"미국이 「격리」 봉쇄를 선언하며 대치가 절정에 달했다.","en":"The United States declared a quarantine blockade, and the standoff peaked."}},
       {"date":"1962.10.28","title":{"ko":"철수 합의","en":"The withdrawal agreement"},"body":{"ko":"소련이 미사일 철수에 합의하며 위기가 풀렸다.","en":"The Soviet Union agreed to withdraw the missiles, and the crisis was resolved."}}
     ]$$::jsonb,
     '["Michael Dobbs, One Minute to Midnight", "Encyclopaedia Britannica: Cuban Missile Crisis"]'::jsonb,
     NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, period_label = EXCLUDED.period_label,
    title_ko = EXCLUDED.title_ko, title_en = EXCLUDED.title_en,
    question_ko = EXCLUDED.question_ko, question_en = EXCLUDED.question_en,
    summary_ko = EXCLUDED.summary_ko, summary_en = EXCLUDED.summary_en,
    outcome_ko = EXCLUDED.outcome_ko, outcome_en = EXCLUDED.outcome_en,
    timeline = EXCLUDED.timeline, sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'cuban-missile-crisis', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('khrushchev', 0, 'leader', '대치를 이끈 소련 지도자', 'Soviet leader in the standoff', '쿠바에 미사일을 배치하는 결단을 내렸다가 핵전쟁 직전에 철수를 택했다.', 'He made the decision to place missiles in Cuba, then chose withdrawal at the edge of nuclear war.'),
    ('fidel-castro', 1, 'leader', '쿠바의 지도자', 'Leader of Cuba', '미국의 침공 위협에 맞서 소련 미사일 배치를 받아들인 혁명 쿠바의 지도자였다.', 'The leader of revolutionary Cuba who accepted the Soviet missiles against the threat of a U.S. invasion.'),
    ('malinovsky', 2, 'executor', '국방장관 · 아나디르 작전', 'Defense minister, Operation Anadyr', '국방장관으로 미사일과 병력을 쿠바로 실어 나른 아나디르 작전을 지휘했다.', 'As defense minister, he directed Operation Anadyr, which shipped the missiles and troops to Cuba.'),
    ('gromyko', 3, 'participant', '외교', 'Diplomacy', '외무장관으로 케네디를 만나 미사일 배치를 부인하며 위기의 외교전에 나섰다.', 'As foreign minister, he met Kennedy and denied the missile deployment amid the diplomatic struggle.'),
    ('mikoyan', 4, 'participant', '카스트로 설득', 'Persuading Castro', '철수 합의 뒤 쿠바로 날아가 분노한 카스트로를 여러 주에 걸쳐 설득했다.', 'After the withdrawal deal, he flew to Cuba and spent weeks persuading a furious Castro.'),
    ('che-guevara', 5, 'participant', '쿠바 지도부', 'Cuban leadership', '쿠바 지도부의 일원으로 미사일 철수에 반대하며 제국주의에 맞선 저항을 주장했다.', 'A member of the Cuban leadership, he opposed the missiles’ withdrawal and argued for defiance of imperialism.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
