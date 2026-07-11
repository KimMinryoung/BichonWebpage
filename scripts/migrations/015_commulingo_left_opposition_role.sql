INSERT INTO commulingo_role_categories
    (id, sort_order, icon, label_ko, label_en, updated_at)
VALUES ('left-opposition', 5, 'git-branch', '좌익 반대파', 'Left Opposition', NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko, label_en = EXCLUDED.label_en, updated_at = NOW();

INSERT INTO commulingo_person_roles
    (person_id, icon, office_id, category_id, label_ko, label_en, updated_at)
VALUES
    ('ivan-smirnov', '', NULL, 'left-opposition', '', '', NOW()),
    ('varvara-yakovleva', '', 'economic-management', NULL, '', '', NOW())
ON CONFLICT (person_id) DO UPDATE SET
    icon = EXCLUDED.icon, office_id = EXCLUDED.office_id, category_id = EXCLUDED.category_id,
    label_ko = EXCLUDED.label_ko, label_en = EXCLUDED.label_en, updated_at = NOW();
