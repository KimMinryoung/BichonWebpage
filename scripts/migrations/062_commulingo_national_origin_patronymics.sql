-- Correct national-background fields and repair patronymic rows that were
-- partially overwritten by PATCH. `origin` is the person's national/ethnic
-- background, not the modern country containing their birthplace.

UPDATE commulingo_people p
SET origin_code = v.code,
    origin_label_ko = v.label_ko,
    origin_label_en = v.label_en,
    updated_at = NOW()
FROM (VALUES
    -- Polish-Jewish revolutionary born in Austro-Hungarian Lemberg (now Lviv).
    ('radek',  'poland', '폴란드', 'Poland'),
    -- Russian paternal family and Russian public identity; born in Lithuania.
    ('yezhov', 'russia', '러시아', 'Russia')
) AS v(id, code, label_ko, label_en)
WHERE p.id = v.id;

-- Gorky's familiar first name is part of his pen name. Russian institutions
-- also conventionally file him as Алексей Максимович Горький; his birth name
-- was Алексей Максимович Пешков. Keep the pen surname, store the real given
-- name/patronymic, and retain both familiar and birth names as aliases.
UPDATE commulingo_people
SET name_ko = '알렉세이 고리키',
    name_en = 'Alexei Gorky',
    given_name_ko = '알렉세이',
    given_name_en = 'Alexei',
    family_name_ko = '고리키',
    family_name_en = 'Gorky',
    cyrillic = 'Алексей Горький',
    updated_at = NOW()
WHERE id = 'gorky';

INSERT INTO commulingo_person_patronymics
    (person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at)
VALUES ('gorky', '막시모비치', 'Maximovich', 'Максимович', NOW())
ON CONFLICT (person_id) DO UPDATE SET
    patronymic_ko = EXCLUDED.patronymic_ko,
    patronymic_en = EXCLUDED.patronymic_en,
    cyrillic_patronymic = EXCLUDED.cyrillic_patronymic,
    updated_at = NOW();

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order)
VALUES
    ('gorky', 'ko', '막심 고리키', 10),
    ('gorky', 'ko', '알렉세이 막시모비치 페시코프', 11),
    ('gorky', 'en', 'Maxim Gorky', 10),
    ('gorky', 'en', 'Alexei Maximovich Peshkov', 11)
ON CONFLICT (person_id, lang, alias) DO UPDATE SET sort_order = EXCLUDED.sort_order;

-- Cyrillic-native names with localized patronymics but a missing native form.
UPDATE commulingo_person_patronymics pp
SET cyrillic_patronymic = v.native,
    patronymic_ko = v.ko,
    patronymic_en = v.en,
    updated_at = NOW()
FROM (VALUES
    ('anatoly-esaulov',    '알렉산드로비치', 'Alexandrovich', 'Александрович'),
    ('dinmukhamed-kunaev', '아흐메트울리',   'Akhmetuly',     'Ахметұлы'),
    ('mrachkovsky',        '비탈리예비치',   'Vitalyevich',   'Витальевич')
) AS v(id, ko, en, native)
WHERE pp.person_id = v.id;

-- Radek and Smilga are Polish/Latvian figures. Their own-script line should be
-- Latin and therefore does not carry the Russian-style patronymic that remains
-- useful in the localized Soviet-context display.
UPDATE commulingo_people
SET cyrillic = CASE id
        WHEN 'radek' THEN 'Karol Radek'
        WHEN 'smilga' THEN 'Ivars Smilga'
    END,
    updated_at = NOW()
WHERE id IN ('radek', 'smilga');

UPDATE commulingo_person_patronymics
SET cyrillic_patronymic = '', updated_at = NOW()
WHERE person_id IN ('radek', 'smilga');

-- Native patronymics that had no Korean/English partner. All three columns are
-- now an atomic display unit, so fill the localized forms instead of silently
-- omitting the middle name from one language.
UPDATE commulingo_person_patronymics pp
SET patronymic_ko = v.ko,
    patronymic_en = v.en,
    updated_at = NOW()
FROM (VALUES
    ('aleksandr-tvardovsky', '트리포노비치',          'Trifonovich'),
    ('alexander-bogdanov',   '알렉산드로비치',        'Alexandrovich'),
    ('emelyan-yaroslavsky',  '미하일로비치',          'Mikhailovich'),
    ('faizulla-khodzhayev',  '구바이둘라예비치',      'Gubaidullayevich'),
    ('fyodor-konstantinov',  '바실리예비치',          'Vasilyevich'),
    ('heydar-aliyev',        '아리르자 오글루',       'Alirza oghlu'),
    ('mir-jafar-bagirov',    '아바소비치',            'Abbasovich'),
    ('nikolai-sukhanov',     '니콜라예비치',          'Nikolaevich'),
    ('postyshev',            '페트로비치',            'Petrovich'),
    ('preobrazhensky',       '알렉세예비치',          'Alexeyevich'),
    ('roy-medvedev',         '알렉산드로비치',        'Alexandrovich'),
    ('yevsei-liberman',      '그리고리예비치',        'Grigoryevich')
) AS v(id, ko, en)
WHERE pp.person_id = v.id;

-- Wille is a Finnish middle given name, not a patronymic.
UPDATE commulingo_people
SET name_ko = '오토 빌레 쿠시넨',
    name_en = 'Otto Wille Kuusinen',
    given_name_ko = '오토 빌레',
    given_name_en = 'Otto Wille',
    family_name_ko = '쿠시넨',
    family_name_en = 'Kuusinen',
    cyrillic = 'Otto Wille Kuusinen',
    updated_at = NOW()
WHERE id = 'kuusinen';
DELETE FROM commulingo_person_patronymics WHERE person_id = 'kuusinen';

-- Three legacy rows embedded the native patronymic in the base name (two also
-- stored the given name inside the patronymic column), causing duplication.
UPDATE commulingo_people SET cyrillic = 'Израиль Дагин', updated_at = NOW()
WHERE id = 'izrail-dagin';

UPDATE commulingo_people SET cyrillic = 'Михаил Рюмин', updated_at = NOW()
WHERE id = 'ryumin';
UPDATE commulingo_person_patronymics
SET patronymic_ko = '드미트리예비치', patronymic_en = 'Dmitrievich',
    cyrillic_patronymic = 'Дмитриевич', updated_at = NOW()
WHERE person_id = 'ryumin';

UPDATE commulingo_people SET cyrillic = 'Лев Шварцман', updated_at = NOW()
WHERE id = 'shvartsman';
UPDATE commulingo_person_patronymics
SET patronymic_ko = '레오니도비치 (아로노비치)',
    patronymic_en = 'Leonidovich (Aronovich)',
    cyrillic_patronymic = 'Леонидович (Аронович)', updated_at = NOW()
WHERE person_id = 'shvartsman';

-- Empty legacy rows have no semantic content and should behave like no row.
DELETE FROM commulingo_person_patronymics
WHERE person_id IN ('bela-kun', 'gyorgy-lukacs')
  AND patronymic_ko = '' AND patronymic_en = '' AND cyrillic_patronymic = '';
