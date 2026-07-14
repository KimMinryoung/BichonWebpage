UPDATE commulingo_role_categories
SET icon = CASE id
        WHEN 'russian-republic-leader' THEN 'building'
        WHEN 'socialist-bloc-leader' THEN 'orbit'
        ELSE icon
    END,
    updated_at = NOW()
WHERE id IN ('russian-republic-leader', 'socialist-bloc-leader');

UPDATE commulingo_offices
SET icon = 'corn', updated_at = NOW()
WHERE id = 'agriculture';
