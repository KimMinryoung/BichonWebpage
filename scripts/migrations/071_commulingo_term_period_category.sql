-- Glossary data model, two fixes.
--
-- 1. period_label was one non-localized free-text string, so Korean leaked onto
--    the English page (11 rows) and English onto the Korean page (31 rows), and
--    nothing could sort chronologically because every value was unique prose.
--    Split it into period_ko / period_en for display plus start_year / end_year
--    for ordering. period_label is left in place as a frozen legacy column; no
--    code reads it after this migration.
-- 2. category groups the entries so Soviet history and contemporary Korean
--    political economy stop sharing one undifferentiated grid. Labels live in
--    data/commulingo/term-categories.js; this column holds the slug only.

ALTER TABLE commulingo_terms
    ADD COLUMN IF NOT EXISTS period_ko  TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS period_en  TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS start_year INTEGER,
    ADD COLUMN IF NOT EXISTS end_year   INTEGER,
    ADD COLUMN IF NOT EXISTS category   TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS commulingo_terms_category_idx ON commulingo_terms (category);

-- ── period_ko / period_en / start_year / end_year ───────────────────────
-- Years follow what each label actually states: a label that gives only an end
-- ('~1930년대') leaves start_year NULL rather than inventing a start, and an
-- open-ended label leaves end_year NULL. Decade labels resolve to the decade
-- bounds, century labels to the century start.

UPDATE commulingo_terms AS t SET
    period_ko  = v.period_ko,
    period_en  = v.period_en,
    start_year = v.start_year,
    end_year   = v.end_year
FROM (VALUES
    ('two-camps-doctrine', '1947–1953', '1947–1953', 1947, 1953),
    ('nepman', '1921–1929', '1921–1929', 1921, 1929),
    ('kulak', '~1930년대', 'up to the 1930s', NULL, 1939),
    ('kolkhoz', '1929–1991', '1929–1991', 1929, 1991),
    ('nep', '1921–1928', '1921–1928', 1921, 1928),
    ('1987-system', '1987–현재', '1987–present', 1987, NULL),
    ('prodrazvyorstka', '1918–1921 (전시 공산주의)', '1918–1921 (War Communism)', 1918, 1921),
    ('gulag', '1930–1960', '1930–1960', 1930, 1960),
    ('war-communism', '1918–1921', '1918–1921', 1918, 1921),
    ('economic-security', '2020년대–현재', '2020s–present', 2020, NULL),
    ('article-58', '1927–1961', '1927–1961', 1927, 1961),
    ('bonapartism', '19세기–현재', '19th century–present', 1800, NULL),
    ('little-october', '1926–1928', '1926–1928', 1926, 1928),
    ('nomenklatura', '1920년대~', 'from the 1920s', 1920, NULL),
    ('state-capitalism', '19세기 말–현재', 'late 19th century–present', 1880, NULL),
    ('soviet-thermidor', '개념', 'Concept', NULL, NULL),
    ('liquidationism', '1907–1914', '1907–1914', 1907, 1914),
    ('socialism-in-one-country', '1924~', 'from 1924', 1924, NULL),
    ('permanent-revolution', '1905~', 'from 1905', 1905, NULL),
    ('socialist-legality', '1930년대–1991', '1930s–1991', 1930, 1991),
    ('anti-imperialist-anti-monopoly', '1980년대–현재', '1980s–present', 1980, NULL),
    ('democratic-centralism', '개념', 'Concept', NULL, NULL),
    ('socialist-realism', '1932–1988', '1932–1988', 1932, 1988),
    ('anti-insurrection-shield', '2024년 이후 한국', 'post-2024 South Korea', 2024, NULL),
    ('control-figures', '1925–1928 (예시적); 1928–1991 (구속적)', '1925–1928 (indicative); 1928–1991 (binding)', 1925, 1991),
    ('dictatorship-of-the-proletariat', '개념', 'Concept', NULL, NULL),
    ('digital-communism', '21세기', '21st century', 2000, NULL),
    ('gap-investment', '2010년대–현재', '2010s–present', 2010, NULL),
    ('great-russian-chauvinism', '1920–1930년대 소련 민족문제 논쟁', '1920s–1930s Soviet nationalities debate', 1920, 1939),
    ('left-communists', '1918', '1918', 1918, 1918),
    ('mass-strike', '1905–현재', '1905–present', 1905, NULL),
    ('national-delimitation', '1920–1930년대', '1920s–1930s', 1920, 1939),
    ('semiconductor-supercycle', '1990년대–현재', '1990s–present', 1990, NULL),
    ('sharashka', '1930–1953', '1930–1953', 1930, 1953),
    ('stakhanovite-movement', '1935~', 'from 1935', 1935, NULL),
    ('super-corporate-union', '2011–현재 (복수노조 허용 이후)', '2011–present (after union pluralism)', 2011, NULL),
    ('sovnarkom', '1917–1946', '1917–1946', 1917, 1946),
    ('developmental-state', '20세기 중후반', 'mid–late 20th century', 1950, 1999),
    ('korenizatsiya', '1923–1938', '1923–1938', 1923, 1938),
    ('yezhovshchina', '1937–1938', '1937–1938', 1937, 1938),
    ('community-wealth-building', '2005–현재', '2005–present', 2005, NULL),
    ('smychka', '1921–1928', '1921–1928', 1921, 1928),
    ('left-opposition', '1923–1933', '1923–1933', 1923, 1933),
    ('comprador-monopoly-capitalism', '20세기–현재', '20th century–present', 1900, NULL),
    ('perestroika', '1985–1991', '1985–1991', 1985, 1991),
    ('old-bolshevik', '1922–1938', '1922–1938', 1922, 1938),
    ('chaebol-state', '1960년대–현재', '1960s–present', 1960, NULL),
    ('glasnost', '1985–1991', '1985–1991', 1985, 1991),
    ('right-opposition', '1928–1939', '1928–1939', 1928, 1939),
    ('precariat', '2004–현재', '2004–present', 2004, NULL),
    ('great-break', '1928–1934', '1928–1934', 1928, 1934),
    ('proletkult', '1917–1932', '1917–1932', 1917, 1932),
    ('real-financial-divergence', '20세기 말–21세기', 'late 20th–21st century', 1980, NULL),
    ('red-terror', '1917–1922', '1917–1922', 1917, 1922),
    ('troika', '1918, 1930, 1937–1938', '1918, 1930, 1937–1938', 1918, 1938),
    ('reformism', '19세기 말–현재', 'late 19th century–present', 1880, NULL),
    ('likbez', '1919–1939', '1919–1939', 1919, 1939),
    ('public-concept-of-land-ownership', '1989–현재 (한국)', '1989–present (ROK)', 1989, NULL),
    ('collectivization', '1928–1937', '1928–1937', 1928, 1937),
    ('free-association-of-producers', '19세기–현재', '19th century–present', 1800, NULL),
    ('khozraschet', '1921–1991', '1921–1991', 1921, 1991),
    ('zveno', '1930년대–1980년대', '1930s–1980s', 1930, 1989),
    ('great-purge', '1936–1938', '1936–1938', 1936, 1938),
    ('food-sovereignty', '1996–현재', '1996–present', 1996, NULL),
    ('moscow-trials', '1936–1938', '1936–1938', 1936, 1938),
    ('primitive-socialist-accumulation', '1920년대 (네프 논쟁)', '1920s (NEP debate)', 1920, 1929),
    ('goelro', '1920–1931', '1920–1931', 1920, 1931),
    ('chervonets', '1922–1947', '1922–1947', 1922, 1947),
    ('juche', '1955–현재', '1955–present', 1955, NULL),
    ('law-of-the-tendency-of-the-rate-of-profit-to-fall', '19세기 후반 고전 정치경제학', 'late 19th-century classical political economy', 1850, NULL),
    ('brezhnev-doctrine', '1968–1989', '1968–1989', 1968, 1989),
    ('workers-opposition', '1919–1922', '1919–1922', 1919, 1922),
    ('autonomization', '1922', '1922', 1922, 1922),
    ('menshevizing-idealism', '1930–1931', '1930–1931', 1930, 1931),
    ('division-system', '1953–현재 (1980년대 개념화)', '1953–present (concept formalized in the 1980s)', 1953, NULL),
    ('jobless-growth', '1990년대–현재', '1990s–present', 1990, NULL),
    ('revolutionary-legal-consciousness', '1917–1930년대 (초기 소비에트)', '1917–1930s (early Soviet period)', 1917, 1939),
    ('chayanovshchina', '1929–1930년대', '1929–1930s', 1929, 1939),
    ('food-dictatorship', '1918–1921', '1918–1921', 1918, 1921),
    ('declaration-of-46', '1923', '1923', 1923, 1923),
    ('ecosocialism', '1970년대–현재', '1970s–present', 1970, NULL),
    ('kondratievshchina', '1928–1930', '1928–1930', 1928, 1930),
    ('dual-power', '1917.02–1917.10', 'February–October 1917', 1917, 1917),
    ('eurocommunism', '1970년대–1980년대', '1970s–1980s', 1970, 1989),
    ('hukou-system', '1958–현재 (중국)', '1958–present (PRC)', 1958, NULL)
) AS v(id, period_ko, period_en, start_year, end_year)
WHERE t.id = v.id;

-- ── category ───────────────────────────────────────────────────────────

UPDATE commulingo_terms AS t SET category = v.category
FROM (VALUES
    ('theory', ARRAY[
        'bonapartism', 'state-capitalism', 'soviet-thermidor', 'socialism-in-one-country',
        'permanent-revolution', 'democratic-centralism', 'dictatorship-of-the-proletariat',
        'mass-strike', 'comprador-monopoly-capitalism', 'reformism',
        'free-association-of-producers', 'juche',
        'law-of-the-tendency-of-the-rate-of-profit-to-fall', 'dual-power']),
    ('economy', ARRAY[
        'nepman', 'kulak', 'kolkhoz', 'nep', 'prodrazvyorstka', 'war-communism',
        'control-figures', 'stakhanovite-movement', 'smychka', 'great-break',
        'collectivization', 'khozraschet', 'zveno', 'primitive-socialist-accumulation',
        'goelro', 'chervonets', 'food-dictatorship']),
    ('party-state', ARRAY[
        'little-october', 'nomenklatura', 'sovnarkom', 'perestroika', 'old-bolshevik',
        'glasnost']),
    ('factions', ARRAY[
        'liquidationism', 'left-communists', 'left-opposition', 'right-opposition',
        'workers-opposition', 'menshevizing-idealism', 'chayanovshchina',
        'declaration-of-46', 'kondratievshchina']),
    ('repression', ARRAY[
        'gulag', 'article-58', 'socialist-legality', 'sharashka', 'yezhovshchina',
        'red-terror', 'troika', 'great-purge', 'moscow-trials',
        'revolutionary-legal-consciousness']),
    ('nationalities', ARRAY[
        'great-russian-chauvinism', 'national-delimitation', 'korenizatsiya',
        'autonomization']),
    ('culture', ARRAY['socialist-realism', 'proletkult', 'likbez']),
    ('international', ARRAY['two-camps-doctrine', 'brezhnev-doctrine', 'eurocommunism']),
    ('korea', ARRAY[
        '1987-system', 'anti-imperialist-anti-monopoly', 'anti-insurrection-shield',
        'gap-investment', 'super-corporate-union', 'chaebol-state',
        'public-concept-of-land-ownership', 'division-system']),
    ('contemporary', ARRAY[
        'economic-security', 'digital-communism', 'semiconductor-supercycle',
        'developmental-state', 'community-wealth-building', 'precariat',
        'real-financial-divergence', 'food-sovereignty', 'jobless-growth',
        'ecosocialism', 'hukou-system'])
) AS v(category, ids)
WHERE t.id = ANY(v.ids);
