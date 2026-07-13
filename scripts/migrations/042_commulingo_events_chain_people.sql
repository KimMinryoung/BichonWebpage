-- Supplement events with downfall / chain-reaction figures, in the spirit of
-- adding Abakumov to the Doctors' Plot: the trigger of the Great Terror and
-- purge victims still unmapped, the 1918 assassinations that sparked the Red
-- Terror and the Left SR revolt, and the security chief swept away after Beria.
-- WHERE EXISTS + idempotent upsert.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    -- Great Terror: the trigger and further purge victims
    ('great-terror','kirov',120,'target','대숙청의 방아쇠가 된 죽음','The murder that triggered the terror','1934년 그의 암살이 대숙청의 구실이 되었고, 이후의 재판들이 그의 죽음을 명분으로 삼았다.','His 1934 assassination became the pretext for the Great Terror, and the later trials invoked his death as their justification.'),
    ('great-terror','nikolai-muralov',121,'target','표적','Target','제2차 모스크바 재판의 피고로 몰려 1937년 처형된 내전의 혁명 군인이었다.','A revolutionary soldier of the civil war, condemned as a defendant in the second Moscow Trial and executed in 1937.'),
    ('great-terror','georgy-lomov-oppokov',122,'target','표적','Target','초대 법무인민위원과 고스플란 부의장을 지낸 뒤 1937년 처형됐다.','A former first commissar of justice and deputy head of Gosplan, executed in 1937.'),
    ('great-terror','evgeny-pashukanis',123,'target','표적','Target','소련의 대표적 마르크스주의 법학자였으나 「법의 소멸」론을 이유로 1937년 처형됐다.','The leading Soviet Marxist legal theorist, executed in 1937 over his doctrine of the withering away of law.'),
    ('great-terror','vladimir-nevsky',124,'target','표적','Target','10월 혁명의 참가자이자 혁명사가였으나 1937년 처형됐다.','A participant in October and a historian of the revolution, executed in 1937.'),
    -- Civil War: the 1918 assassinations that sparked the chain of terror and revolt
    ('civil-war','v-volodarsky',120,'participant','붉은 테러의 도화선','A spark of the Red Terror','페트로그라드의 선전 인민위원으로, 1918년 그의 암살이 붉은 테러의 불씨가 됐다.','Petrograd’s commissar for the press, whose 1918 assassination helped ignite the Red Terror.'),
    ('civil-war','yakov-blumkin',121,'opponent','좌파 SR의 총격','The Left SR’s gunshot','좌파 사회혁명당원으로 1918년 독일 대사 미르바흐를 쏘아 좌파 SR 봉기의 방아쇠를 당겼다.','A Left SR who shot the German ambassador Mirbach in 1918, triggering the Left SR uprising.'),
    -- Fall of Beria: the Stalin-era security chief swept away in the same reckoning
    ('beria-purge','abakumov',11,'target','함께 청산된 보안 수장','A security chief swept away','전임 MGB 장관으로, 베리야의 몰락에 이은 스탈린기 보안기구 청산 속에서 1954년 처형됐다.','The former MGB minister, executed in 1954 amid the dismantling of the Stalin-era security apparatus that followed Beria’s fall.')
) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
