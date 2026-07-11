INSERT INTO commulingo_role_categories
    (id, sort_order, icon, label_ko, label_en, updated_at)
VALUES ('socialist-bloc-leader', 6, 'landmark', '사회주의권 지도자', 'Socialist-bloc leader', NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko, label_en = EXCLUDED.label_en, updated_at = NOW();
