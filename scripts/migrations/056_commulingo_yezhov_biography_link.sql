-- 056: Link the Korean translation of Pavlyukov's Yezhov biography from the
-- CommuLingo person page for yezhov. The document itself is a static file
-- served from public/commulingo/docs/yezhov-pavlyukov.html.
-- Idempotent: ON CONFLICT (person_id, slug) DO UPDATE.

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'yezhov', 'pavlyukov-biography-translation', 4,
    '더 읽기 — 파블류코프 『예조프: 전기』 한국어 번역',
    'Further reading — Pavlyukov, Yezhov: A Biography (Korean translation)',
    $ko$알렉세이 파블류코프의 평전 『예조프: 전기』(2007)의 한국어 번역 전문을 별도 문서로 제공한다. 4부 구성으로 예조프의 유년기와 제정군 복무부터 당 인사기구에서의 부상, NKVD 수장 시기, 실각과 처형까지를 다룬다.

[전문 읽기 →](https://cyber-lenin.com/commulingo/docs/yezhov-pavlyukov.html)$ko$,
    $en$The full Korean translation of Aleksei Pavlyukov's biography Yezhov (2007) is available as a separate document. Its four parts follow Yezhov from his childhood and service in the imperial army through his rise in the party's personnel apparatus, his years as NKVD chief, and his fall and execution.

[Read the full text →](https://cyber-lenin.com/commulingo/docs/yezhov-pavlyukov.html)$en$,
    $src$["Алексей Павлюков, Ежов. Биография (Москва: Захаров, 2007)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'yezhov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();
