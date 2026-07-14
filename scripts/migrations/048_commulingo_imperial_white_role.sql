UPDATE commulingo_role_categories
SET label_ko = '제정·백색진영',
    label_en = 'Imperial establishment and White movement',
    updated_at = NOW()
WHERE id = 'old-regime';

UPDATE commulingo_person_roles
SET icon = '',
    office_id = NULL,
    category_id = CASE person_id
        WHEN 'gapon' THEN 'intl-revolutionary'
        WHEN 'kerensky' THEN 'intl-revolutionary'
        WHEN 'kornilov' THEN 'old-regime'
        ELSE category_id
    END,
    label_ko = '',
    label_en = '',
    updated_at = NOW()
WHERE person_id IN ('gapon', 'kerensky', 'kornilov');
