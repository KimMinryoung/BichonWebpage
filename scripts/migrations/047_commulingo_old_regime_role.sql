INSERT INTO commulingo_role_categories
    (id, sort_order, icon, label_ko, label_en, updated_at)
VALUES ('old-regime', 1, 'crown', '구체제와 그 도전자들', 'The old regime and its challengers', NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();

UPDATE commulingo_role_categories
SET sort_order = CASE id
        WHEN 'old-regime' THEN 1
        WHEN 'writer' THEN 2
        WHEN 'theorist' THEN 3
        WHEN 'intl-revolutionary' THEN 4
        WHEN 'bloc-reformer' THEN 5
        WHEN 'russian-republic-leader' THEN 6
        WHEN 'left-opposition' THEN 7
        WHEN 'socialist-bloc-leader' THEN 8
        ELSE sort_order
    END,
    updated_at = NOW()
WHERE id IN (
    'old-regime',
    'writer',
    'theorist',
    'intl-revolutionary',
    'bloc-reformer',
    'russian-republic-leader',
    'left-opposition',
    'socialist-bloc-leader'
);

INSERT INTO commulingo_person_roles
    (person_id, icon, office_id, category_id, label_ko, label_en, updated_at)
VALUES
    ('nicholas-ii', '', NULL, 'old-regime', '', '', NOW()),
    ('gapon', '', NULL, 'old-regime', '', '', NOW()),
    ('witte', '', NULL, 'old-regime', '', '', NOW()),
    ('stolypin', '', NULL, 'old-regime', '', '', NOW()),
    ('kerensky', '', NULL, 'old-regime', '', '', NOW()),
    ('rasputin', '', NULL, 'old-regime', '', '', NOW())
ON CONFLICT (person_id) DO UPDATE SET
    icon = EXCLUDED.icon,
    office_id = EXCLUDED.office_id,
    category_id = EXCLUDED.category_id,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();
