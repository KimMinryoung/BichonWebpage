-- Expand the Great Terror's related-people mapping: many well-documented
-- victims and cultural witnesses already exist in commulingo_people but were
-- not linked to the event. Adds ~20 targets and a witness bucket (previously
-- empty). The WHERE EXISTS guard skips any id not present, and the upsert keeps
-- it idempotent. sort_order 50+ keeps these after the existing rows.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'great-terror', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('alexander-yegorov', 50, 'target', '군 숙청의 표적', 'Target of the military purge', '데니킨을 무너뜨린 남부전선 사령관이자 초대 원수 5인 중 한 명으로 투하쳅스키 사건 뒤 1939년 처형됐다.', 'A southern-front commander who broke Denikin and one of the first five marshals, executed in 1939 after the Tukhachevsky affair.'),
    ('andrei-bubnov', 51, 'target', '표적', 'Target', '10월 봉기의 군사조직 지도자 출신 계몽인민위원으로 1938년 처형됐다.', 'A military-organization leader of October who became Commissar of Enlightenment, executed in 1938.'),
    ('nikolai-krylenko', 52, 'target', '표적', 'Target', '혁명 법의 설계자이자 법무인민위원이었으나 1938년 자신이 20분 재판 끝에 처형됐다.', 'An architect of revolutionary law and Commissar of Justice, himself executed in 1938 after a twenty-minute trial.'),
    ('antonov-ovseenko', 53, 'target', '표적', 'Target', '겨울궁전 습격을 지휘한 볼셰비키였으나 21년 뒤인 1938년 처형됐다.', 'The Bolshevik who led the storming of the Winter Palace, executed twenty-one years later in 1938.'),
    ('kosior', 54, 'target', '표적', 'Target', '우크라이나 당 제1서기이자 정치국원이었으나 1939년 체포·처형됐다.', 'First secretary of the Ukrainian party and a Politburo member, arrested and executed in 1939.'),
    ('postyshev', 55, 'target', '집행자이자 표적', 'Enforcer turned target', '우크라이나 숙청을 주도한 스탈린의 특사였으나 자신도 1939년 처형됐다.', 'A Stalin envoy who drove the Ukrainian purge and was himself executed in 1939.'),
    ('avel-yenukidze', 56, 'target', '표적', 'Target', '17년간 소비에트 국가기구의 중추였던 옛 볼셰비키로 1937년 처형됐다.', 'An Old Bolshevik at the center of the Soviet state apparatus for seventeen years, executed in 1937.'),
    ('alexander-chayanov', 57, 'target', '표적', 'Target', '농민경제 이론가로 조작된 「노동농민당」 사건에 몰려 1937년 처형됐다.', 'An agrarian economist framed in the fabricated Labour Peasant Party case and executed in 1937.'),
    ('nikolai-kondratiev', 58, 'target', '표적', 'Target', '장기 경기순환 이론으로 알려진 경제학자로 수감 끝에 1938년 처형됐다.', 'The economist known for long-wave cycles, executed in 1938 after imprisonment.'),
    ('akmal-ikramov', 59, 'target', '표적', 'Target', '우즈베크 당 제1서기로 1938년 모스크바 재판에 연루되어 처형됐다.', 'First secretary of the Uzbek party, implicated in the 1938 Moscow Trial and executed.'),
    ('faizulla-khodzhayev', 60, 'target', '표적', 'Target', '소비에트 우즈베키스탄 정부 수반으로 1938년 모스크바 재판에서 처형됐다.', 'Head of the Soviet Uzbek government, executed after the 1938 Moscow Trial.'),
    ('mirsaid-sultangaliev', 61, 'target', '표적', 'Target', '무슬림 민족공산주의를 대표한 인물로 오랜 탄압 끝에 1940년 처형됐다.', 'A leading figure of Muslim national communism, executed in 1940 after years of repression.'),
    ('david-riazanov', 62, 'target', '표적', 'Target', '마르크스-엥겔스 연구소를 세운 학자로 추방된 뒤 1938년 처형됐다.', 'The scholar who founded the Marx-Engels Institute, exiled and then executed in 1938.'),
    ('pavel-dybenko', 63, 'target', '표적', 'Target', '10월 혁명의 수병 지도자이자 군사령관이었으나 1938년 처형됐다.', 'A sailor leader of October and army commander, executed in 1938.'),
    ('yakov-peters', 64, 'target', '표적', 'Target', '체카 창설 부의장이었으나 대테러기에 체포·처형됐다.', 'A founding deputy chairman of the Cheka, arrested and executed during the terror.'),
    ('sergei-syrtsov', 65, 'target', '표적', 'Target', '러시아 인민위원회의 의장을 지낸 뒤 「우익」 낙인으로 1937년 처형됐다.', 'A former head of the Russian Council of Commissars, branded a rightist and executed in 1937.'),
    ('nikolai-uglanov', 66, 'target', '표적', 'Target', '부하린계 모스크바 당 지도자로 1937년 처형됐다.', 'A Moscow party leader aligned with Bukharin, executed in 1937.'),
    ('tomsky', 67, 'target', '표적', 'Target', '노동조합 지도자로 체포가 다가오자 1936년 스스로 목숨을 끊었다.', 'The trade-union leader who took his own life in 1936 as arrest approached.'),
    ('sokolnikov', 68, 'target', '표적', 'Target', '네프 화폐 안정화를 이끈 재무인민위원으로 재판 뒤 1939년 옥중에서 살해됐다.', 'The finance commissar behind NEP monetary stabilization, killed in prison in 1939 after trial.'),
    ('vlas-chubar', 69, 'target', '표적', 'Target', '부총리와 정치국원을 지낸 우크라이나 경제행정가로 1939년 처형됐다.', 'A deputy premier and Politburo member from Ukraine, executed in 1939.'),
    ('akhmatova', 80, 'witness', '증언의 시인', 'Poet of witness', '아들이 체포된 시인으로 감옥 앞 줄에서 얻은 기억을 연작시 『레퀴엠』에 새겼다.', 'A poet whose son was arrested and who inscribed the prison queues into her cycle Requiem.'),
    ('dmitri-shostakovich', 81, 'witness', '압박받은 작곡가', 'Composer under pressure', '공식 비판과 체포의 공포 속에서 작곡을 이어간 소비에트 작곡가였다.', 'A Soviet composer who kept working under official denunciation and the fear of arrest.'),
    ('boris-pasternak', 82, 'witness', '살아남은 작가', 'A writer who survived', '동료들이 사라지는 가운데 침묵과 증언 사이에서 살아남은 시인이었다.', 'A poet who survived between silence and testimony as colleagues vanished.'),
    ('marina-tsvetaeva', 83, 'witness', '귀환한 시인', 'The poet who returned', '남편과 딸이 체포된 뒤 귀국해 1941년 스스로 목숨을 끊은 시인이었다.', 'A poet who returned after her husband and daughter were arrested and took her own life in 1941.'),
    ('platonov', 84, 'witness', '침묵당한 작가', 'A silenced writer', '출판을 거부당한 작가로 그의 아들은 10대에 수용소로 보내졌다.', 'A writer denied publication whose teenage son was sent to the camps.'),
    ('ilya-ehrenburg', 85, 'witness', '기억의 전달자', 'Carrier of memory', '숙청의 시대를 지나 살아남아 훗날 회고록으로 그 기억을 전한 작가였다.', 'A writer who survived the purge years and later transmitted their memory in his memoirs.'),
    ('sholokhov', 86, 'witness', '개입한 작가', 'A writer who intervened', '고향 지역의 체포 피해자들을 위해 스탈린에게 직접 편지를 보내 개입한 작가였다.', 'A writer who intervened by writing directly to Stalin on behalf of arrested people in his home region.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
