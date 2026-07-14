UPDATE commulingo_offices AS office
SET title_ko = replacement.title_ko,
    title_en = replacement.title_en,
    icon = replacement.icon,
    updated_at = NOW()
FROM (VALUES
    ('party-secretariat-cadres', '당 서기국 · 조직인사', 'Party Secretariat and cadres', 'folder'),
    ('defence', '군사 · 국방', 'Military and defence', 'star'),
    ('security', '국가보안 기관', 'State security agencies', 'eye'),
    ('ideology-propaganda', '이념 · 선전', 'Ideology and propaganda', 'megaphone'),
    ('foreign-affairs', '외교', 'Foreign affairs', 'handshake'),
    ('planning', '중앙계획 기관', 'Central planning agencies', 'chart'),
    ('economic-management', '경제 운영', 'Economic management', 'coins'),
    ('heavy-industry-mic', '중공업 · 군수공업', 'Heavy industry and military industry', 'factory'),
    ('agriculture', '농업', 'Agriculture', 'wheat'),
    ('comintern', '코민테른', 'Comintern', 'globe')
) AS replacement(id, title_ko, title_en, icon)
WHERE office.id = replacement.id;
