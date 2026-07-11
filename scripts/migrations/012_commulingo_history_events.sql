CREATE TABLE IF NOT EXISTS commulingo_history_events (
    id TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    period_label TEXT NOT NULL DEFAULT '',
    title_ko TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    question_ko TEXT NOT NULL DEFAULT '',
    question_en TEXT NOT NULL DEFAULT '',
    summary_ko TEXT NOT NULL DEFAULT '',
    summary_en TEXT NOT NULL DEFAULT '',
    outcome_ko TEXT NOT NULL DEFAULT '',
    outcome_en TEXT NOT NULL DEFAULT '',
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commulingo_history_event_people (
    event_id TEXT NOT NULL REFERENCES commulingo_history_events(id) ON DELETE CASCADE ON UPDATE CASCADE,
    person_id TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE ON UPDATE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    relation_ko TEXT NOT NULL DEFAULT '',
    relation_en TEXT NOT NULL DEFAULT '',
    note_ko TEXT NOT NULL DEFAULT '',
    note_en TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (event_id, person_id)
);

CREATE INDEX IF NOT EXISTS commulingo_history_event_people_person_idx
    ON commulingo_history_event_people(person_id, sort_order, event_id);

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('great-terror', 0, '1937–1938',
     '대테러', 'The Great Terror',
     '대테러는 누가, 어떤 기구로, 무엇을 가능하게 했는가?',
     'Who made the Great Terror possible, through which institutions, and at what cost?',
     '1937–38년의 대테러는 NKVD·당 조직·검찰이 결합해 대규모 체포와 처형을 수행한 국가폭력이었다. 그것은 단일 명령이 아니라 할당량, 작전명령, 자백 강요, 지방의 경쟁과 공포가 서로 증폭한 과정이었다.',
     'The Great Terror of 1937–38 was state violence carried out through the combined machinery of the NKVD, party organizations, and prosecution. It was not one order alone, but a process in which quotas, operational orders, coerced confessions, local competition, and fear amplified one another.',
     '수십만 명이 처형되고 훨씬 더 많은 사람이 수감·추방되었다. 국가보안기관의 집행자들 역시 차례로 숙청되었으며, 그 상처는 가족·문화·정치 기억에 오래 남았다.',
     'Hundreds of thousands were executed and many more imprisoned or deported. The security officials who implemented the terror were themselves purged in turn, while its wounds endured in families, culture, and political memory.',
     '[{"date":"1937.07","title":{"ko":"NKVD 작전명령 제00447호","en":"NKVD Operational Order No. 00447"},"body":{"ko":"전직 쿨라크와 이른바 반소비에트 요소를 겨냥한 대규모 작전이 시작됐다.","en":"A mass operation targeting former kulaks and other alleged anti-Soviet elements began."}},{"date":"1937–1938","title":{"ko":"할당량과 트로이카","en":"Quotas and troikas"},"body":{"ko":"지방 NKVD·당·검찰의 트로이카가 신속한 체포와 형량을 처리했다.","en":"Local NKVD, party, and prosecution troikas processed arrests and sentences at speed."}},{"date":"1938.11","title":{"ko":"예조프의 해임","en":"Yezhov removed"},"body":{"ko":"예조프가 해임되고 베리야가 NKVD를 장악하면서 대규모 작전은 종결 국면으로 들어갔다.","en":"Yezhov was removed and Beria took control of the NKVD, bringing the mass operations toward their end."}}]'::jsonb,
     '["https://www.wilsoncenter.org/publication/stalins-great-terror-1937-1938", "https://www.loc.gov/exhibits/archives/intro.html"]'::jsonb,
     NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, period_label = EXCLUDED.period_label,
    title_ko = EXCLUDED.title_ko, title_en = EXCLUDED.title_en,
    question_ko = EXCLUDED.question_ko, question_en = EXCLUDED.question_en,
    summary_ko = EXCLUDED.summary_ko, summary_en = EXCLUDED.summary_en,
    outcome_ko = EXCLUDED.outcome_ko, outcome_en = EXCLUDED.outcome_en,
    timeline = EXCLUDED.timeline, sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_ko, relation_en, note_ko, note_en)
SELECT 'great-terror', v.person_id, v.sort_order, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('yezhov', 0, '집행 총책', 'Operational chief', 'NKVD 수장으로 대규모 작전의 핵심 집행을 지휘했다.', 'As NKVD chief, he directed the core implementation of the mass operations.'),
    ('frinovsky', 1, '제1부관', 'First deputy', '예조프의 제1부관으로 국가보안기구의 작전과 인사 숙청을 맡았다.', 'As Yezhov’s first deputy, he handled security operations and personnel purges.'),
    ('agranov', 2, '전임 보안 지도자', 'Predecessor in security', '야고다 체제의 부관이었고, 예조프 체제에서 체포·처형됐다.', 'A deputy under Yagoda, he was arrested and executed under Yezhov.'),
    ('beria', 3, '후임 수장', 'Successor', '1938년 말 NKVD를 넘겨받아 예조프 체제의 청산을 지휘했다.', 'He took over the NKVD in late 1938 and directed the purge of the Yezhov apparatus.'),
    ('bukharin', 4, '표적', 'Target', '모스크바 재판 뒤 처형된 옛 볼셰비키 지도자였다.', 'An Old Bolshevik leader executed after the Moscow Trial.'),
    ('tukhachevsky', 5, '표적', 'Target', '군 지휘관 숙청의 상징적 표적 가운데 한 명이었다.', 'One of the emblematic targets of the purge of military commanders.'),
    ('mandelstam', 6, '표적·증언의 시인', 'Target and poetic witness', '재체포 뒤 극동 수용소 이송 중 사망했다.', 'He died in transit to a Far Eastern camp after rearrest.'),
    ('pilnyak', 7, '표적', 'Target', '1937년 체포되어 1938년 처형된 작가였다.', 'A writer arrested in 1937 and executed in 1938.')
) AS v(person_id, sort_order, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
