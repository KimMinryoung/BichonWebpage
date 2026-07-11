-- Place existing heads of socialist states alongside newly added state leaders.
-- The role category itself is introduced by 017.
UPDATE commulingo_person_roles
SET category_id = 'socialist-bloc-leader',
    office_id = NULL,
    icon = '',
    label_ko = '',
    label_en = '',
    updated_at = NOW()
WHERE person_id IN ('mao-zedong', 'ho-chi-minh', 'fidel-castro');
