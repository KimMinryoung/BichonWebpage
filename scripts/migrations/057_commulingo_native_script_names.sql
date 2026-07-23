-- 057: Native-script names for non-Russian / non-Soviet figures.
--
-- commulingo_people.cyrillic is the "name in the person's own script" line under
-- the display name (see composePersonName in data/commulingo/people-standard.js).
-- Historically every entry was filled with a Russian-Cyrillic transliteration,
-- which is wrong for figures whose own nation does not write in Cyrillic:
-- 박헌영 was showing as "Пак Хон Ён", Kádár János as "Янош Кадар", and so on.
--
-- This migration rewrites those entries in the correct script: Latin for
-- European/American/African/Latin-American figures, Hangul for Korean, Hanzi
-- for Chinese, Kanji for Japanese, Bengali for M. N. Roy, Georgian for
-- Georgians, Uzbek/Azerbaijani Latin for those republics, Kazakh Cyrillic
-- orthography for Kunaev. Hungarians follow the family-name-first convention
-- already used for Nagy Imre and Németh Miklós.
--
-- Figures who are Soviet/Russian, or whose own nation writes in Cyrillic
-- (Bulgarians, Rakovsky), keep their Cyrillic form and are not touched.

UPDATE commulingo_people p
SET cyrillic = v.native
FROM (VALUES
    -- Hungary (family name first)
    ('bela-kun',                'Kun Béla'),
    ('gyorgy-lukacs',           'Lukács György'),
    ('matyas-rakosi',           'Rákosi Mátyás'),
    ('janos-kadar',             'Kádár János'),
    ('evgeny-varga',            'Varga Jenő'),
    -- Yugoslavia (Croat, Latin script)
    ('josip-broz-tito',         'Josip Broz Tito'),
    -- Finland
    ('carl-manner',             'Kullervo Manner'),
    ('kuusinen',                'Otto Kuusinen'),
    -- Czechoslovakia
    ('klement-gottwald',        'Klement Gottwald'),
    ('rudolf-slansky',          'Rudolf Slánský'),
    -- Poland
    ('wladyslaw-gomulka',       'Władysław Gomułka'),
    ('edward-gierek',           'Edward Gierek'),
    ('boleslaw-bierut',         'Bolesław Bierut'),
    ('michal-kalecki',          'Michał Kalecki'),
    -- Germany / Austria
    ('walter-ulbricht',         'Walter Ulbricht'),
    ('wilhelm-pieck',           'Wilhelm Pieck'),
    ('willi-muenzenberg',       'Willi Münzenberg'),
    ('karl-kautsky',            'Karl Kautsky'),
    -- France
    ('louis-auguste-blanqui',   'Louis Blanqui'),
    ('maurice-thorez',          'Maurice Thorez'),
    ('paul-lafargue',           'Paul Lafargue'),
    ('boris-souvarine',         'Boris Souvarine'),
    -- Spain / Catalonia
    ('andres-nin',              'Andreu Nin'),
    ('dolores-ibarruri',        'Dolores Ibárruri'),
    -- Netherlands
    ('henk-sneevliet',          'Henk Sneevliet'),
    ('anton-pannekoek',         'Anton Pannekoek'),
    -- United States
    ('john-reed',               'John Reed'),
    ('william-z-foster',        'William Foster'),
    ('earl-browder',            'Earl Browder'),
    ('elizabeth-gurley-flynn',  'Elizabeth Flynn'),
    ('raya-dunayevskaya',       'Raya Dunayevskaya'),
    -- Africa / Latin America
    ('samora-machel',           'Samora Machel'),
    ('agostinho-neto',          'Agostinho Neto'),
    ('kwame-nkrumah',           'Kwame Nkrumah'),
    ('salvador-allende',        'Salvador Allende'),
    -- Baltic republics (Latin script)
    ('martin-lacis',            'Mārtiņš Lācis'),
    ('asja-lacis',              'Asja Lācis'),
    ('yan-berzin',              'Jānis Bērziņš'),
    ('voss',                    'Augusts Voss'),
    ('paleckis',                'Justas Paleckis'),
    ('antanas-snieckus',        'Antanas Sniečkus'),
    -- Caucasus / Central Asia
    ('shevardnadze',            'ედუარდ შევარდნაძე'),
    ('irakli-tsereteli',        'ირაკლი წერეთელი'),
    ('heydar-aliyev',           'Heydər Əliyev'),
    ('nishonov',                'Rafiq Nishonov'),
    ('nuritdin-mukhitdinov',    'Nuritdin Muhitdinov'),
    ('dinmukhamed-kunaev',      'Дінмұхамед Қонаев'),
    -- East and South Asia
    ('pak-hon-yong',            '박헌영'),
    ('sen-katayama',            '片山潜'),
    ('li-dazhao',               '李大钊'),
    ('chen-duxiu',              '陈独秀'),
    ('mn-roy',                  'মানবেন্দ্র নাথ রায়')
) AS v(id, native)
WHERE p.id = v.id;

-- The middle-name slot on the native line follows the same rule. Western middle
-- names are restored in Latin; Russian-style patronymics attached to Georgians,
-- Balts, Hungarians and the French are dropped from the native line (the
-- localized ko/en patronymics are left untouched).
UPDATE commulingo_person_patronymics pp
SET cyrillic_patronymic = v.native
FROM (VALUES
    ('earl-browder',            'Russell'),
    ('william-z-foster',        'Zebulon'),
    ('elizabeth-gurley-flynn',  'Gurley'),
    ('salvador-allende',        'Guillermo'),
    ('louis-auguste-blanqui',   'Auguste'),
    ('karl-kautsky',            'Johann'),
    ('samora-machel',           'Moisés'),
    ('carl-manner',             'Achilles'),
    ('kuusinen',                'Wille'),
    ('heydar-aliyev',           'Əlirza oğlu'),
    ('nishonov',                'Nishonovich'),
    ('nuritdin-mukhitdinov',    'Akramovich'),
    ('bela-kun',                ''),
    ('gyorgy-lukacs',           ''),
    ('evgeny-varga',            ''),
    ('boris-souvarine',         ''),
    ('shevardnadze',            ''),
    ('irakli-tsereteli',        ''),
    ('dinmukhamed-kunaev',      ''),
    ('martin-lacis',            ''),
    ('asja-lacis',              ''),
    ('yan-berzin',              ''),
    ('voss',                    ''),
    ('paleckis',                ''),
    ('antanas-snieckus',        '')
) AS v(id, native)
WHERE pp.person_id = v.id;
