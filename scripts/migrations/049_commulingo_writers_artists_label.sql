UPDATE commulingo_role_categories
SET label_ko = '작가·예술가',
    label_en = 'Writers and artists',
    updated_at = NOW()
WHERE id = 'writer';
