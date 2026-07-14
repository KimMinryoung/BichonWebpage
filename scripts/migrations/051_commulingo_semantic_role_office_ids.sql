UPDATE commulingo_role_categories
SET id = CASE id
        WHEN 'old-regime' THEN 'imperial-white'
        WHEN 'intl-revolutionary' THEN 'non-soviet-revolutionary'
        WHEN 'bloc-reformer' THEN 'socialist-bloc-reform-leader'
        ELSE id
    END,
    updated_at = NOW()
WHERE id IN ('old-regime', 'intl-revolutionary', 'bloc-reformer');

UPDATE commulingo_offices
SET id = CASE id
        WHEN 'heavy-industry-mic' THEN 'heavy-military-industry'
        WHEN 'security' THEN 'state-security'
        WHEN 'government' THEN 'head-of-government'
        WHEN 'planning' THEN 'central-planning'
        ELSE id
    END,
    updated_at = NOW()
WHERE id IN ('heavy-industry-mic', 'security', 'government', 'planning');
