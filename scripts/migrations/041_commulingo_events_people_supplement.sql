-- Supplement related people on several events with well-documented figures
-- missing from the mapping. Notably Abakumov, the MGB minister whose 1951
-- downfall launched the Doctors' Plot. WHERE EXISTS + idempotent upsert.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    -- Doctors' Plot: Abakumov's fall was its origin
    ('doctors-plot','abakumov',7,'target','실각한 MGB 장관','The ousted MGB minister','전임 국가보안부 장관으로, 의사들의 음모 수사를 덮었다는 랴민의 고발로 1951년 체포되어 실각했다.','The former Minister of State Security, arrested in 1951 after Ryumin denounced him for suppressing the doctors’ plot investigation.'),
    -- Fall of Beria: Serov took part and became the first KGB chairman
    ('beria-purge','serov',10,'executor','베리야에 맞선 보안 간부','Security officer against Beria','베리야 체포에 가담하고 그 이듬해 초대 KGB 의장이 된 보안 간부였다.','A security officer who took part in Beria’s arrest and the next year became the first KGB chairman.'),
    -- Marshall Plan: bloc consolidation and the economic line behind rejection
    ('marshall-plan','walter-ulbricht',6,'participant','동독 진영화','Consolidating East Germany','소련 점령지의 통합사회당을 이끌며 동독의 진영화를 진행한 지도자였다.','The leader who ran the Socialist Unity Party in the Soviet zone, consolidating East Germany into the bloc.'),
    ('marshall-plan','evgeny-varga',7,'participant','경제 분석가','Economic analyst','전후 자본주의의 적응력을 인정한 마르크스주의 경제학자로, 「두 진영」 노선과 어긋나 1947년 연구소가 폐쇄됐다.','A Marxist economist who acknowledged postwar capitalism’s adaptability; clashing with the two-camps line, his institute was closed in 1947.'),
    -- Soviet-Afghan War: field command and the diplomacy of withdrawal
    ('afghanistan-war','sokolov',5,'executor','작전 지휘','Operational command','아프가니스탄 주둔군 작전집단을 이끈 뒤 국방장관이 된 원수였다.','A marshal who led the operational group for the Afghan deployment and later became defense minister.'),
    ('afghanistan-war','shevardnadze',6,'participant','철군 외교','Withdrawal diplomacy','외무장관으로 소련군 철수를 위한 제네바 협정 외교를 이끌었다.','As foreign minister, he led the Geneva-accords diplomacy for the Soviet withdrawal.'),
    -- Chernobyl: the Ukrainian leader and the May Day parade
    ('chernobyl','vladimir-shcherbitsky',3,'participant','우크라이나 지도자','Ukrainian leader','사고 직후에도 키이우의 노동절 행진을 강행한 우크라이나 당 제1서기였다.','The Ukrainian party first secretary who went ahead with the May Day parade in Kyiv even after the accident.'),
    -- Collapse of the USSR: Yakovlev warned of the coming reaction
    ('soviet-collapse','yakovlev',7,'participant','쿠데타를 경고','Warned of the coup','글라스노스트의 설계자로 쿠데타 직전 당을 떠나며 다가오는 반동을 경고했다.','The architect of glasnost, he left the party just before the coup, warning of the coming reaction.')
) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
