-- Great Terror: the earlier pass over-weighted people who were executed. Add
-- those who were imprisoned and SURVIVED (Rokossovsky, Tupolev, Korolev), the
-- military-purge victims still missing (Uborevich, Blyukher, Gamarnik), further
-- high-ranking victims (Rudzutak, Eikhe), the geneticist Vavilov, and one more
-- NKVD executioner (Zakovsky). WHERE EXISTS + idempotent upsert.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'great-terror', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('zakovsky', 15, 'executor', 'NKVD 집행자', 'NKVD executioner', '레닌그라드와 모스크바에서 대량 작전을 지휘한 NKVD 간부로, 자신도 1938년 처형됐다.', 'An NKVD officer who ran the mass operations in Leningrad and Moscow, himself executed in 1938.'),
    ('ieronim-uborevich', 90, 'target', '군 숙청의 표적', 'Target of the military purge', '붉은 군대 기계화를 설계한 천재 지휘관으로 투하쳅스키와 함께 1937년 처형됐다.', 'A brilliant commander who designed the Red Army’s mechanization, executed with Tukhachevsky in 1937.'),
    ('vasily-blyukher', 91, 'target', '군 숙청의 표적', 'Target of the military purge', '내전의 영웅이자 첫 원수 5인 중 하나였으나 1938년 심문 중 사망했다.', 'A civil-war hero and one of the first five marshals, he died under interrogation in 1938.'),
    ('gamarnik', 92, 'target', '표적', 'Target', '붉은 군대 정치총국장으로, 군 숙청이 닥치자 1937년 스스로 목숨을 끊었다.', 'Head of the Red Army political directorate, he took his own life in 1937 as the military purge closed in.'),
    ('rudzutak', 93, 'target', '표적', 'Target', '정치국원을 지낸 최고위 볼셰비키로 법정에서 NKVD의 조작을 고발했으나 1938년 처형됐다.', 'A top Bolshevik and former Politburo member who denounced the NKVD’s fabrications in court but was executed in 1938.'),
    ('robert-eikhe', 94, 'target', '집행자이자 표적', 'Enforcer turned target', '시베리아 대테러를 설계한 지방 당수였으나 고문 속에서 자백을 철회하고 1940년 처형됐다.', 'A regional party boss who designed the Siberian terror, he retracted his confession under torture and was executed in 1940.'),
    ('konstantin-rokossovsky', 95, 'target', '투옥된 지휘관', 'Imprisoned commander', '1937년 체포되어 고문 끝에 투옥되었다가 1940년 석방되어 복귀한 미래의 원수였다.', 'A future marshal arrested in 1937, imprisoned under torture, and released in 1940 to return to command.'),
    ('andrei-tupolev', 96, 'target', '옥중 설계자', 'Designer imprisoned', '1937년 체포되어 옥중 설계국(샤라시카)에서 항공기를 설계하다 1941년 석방됐다.', 'Arrested in 1937, he designed aircraft inside a prison bureau (sharashka) until his release in 1941.'),
    ('korolev', 97, 'target', '수용소로 보내진 설계자', 'Designer sent to the camps', '1938년 체포되어 콜리마 수용소를 거쳐 옥중 설계국에서 일한 뒤에야 풀려난 미래의 우주계획 설계자였다.', 'The future chief designer of the space program, arrested in 1938 and freed only after the Kolyma camps and a prison bureau.'),
    ('nikolai-vavilov', 98, 'target', '표적', 'Target', '세계 최대 종자은행을 세운 유전학자로 리센코와의 대립 끝에 1940년 체포되어 1943년 옥사했다.', 'A geneticist who built the world’s largest seed bank; after his clash with Lysenko he was arrested in 1940 and died in prison in 1943.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
