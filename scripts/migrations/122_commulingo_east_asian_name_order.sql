-- 122: East Asian display names follow their own name order.
--
-- The derived full name was assembled "given family" (Western order) for
-- everyone, so people submitted with structured givenName/familyName came out
-- reversed: 김무정 was showing as "무정 김", 펑더화이 as "더화이 펑",
-- Lê Duẩn as "Duan Le". People submitted as a single fused token (마오쩌둥)
-- escaped, but many of those carry mislabeled parts instead — the English
-- surname stored in given_name_en ("Mao" as a given name, family "Zedong").
--
-- The standard, now enforced by composeFullName in people-admin-store.js and
-- _compose_full_name in leninbot runtime_tools/commulingo_people.py:
--   * Korean / Chinese / Vietnamese names: family first; Korean text fuses the
--     parts (김무정, 펑더화이, 호찌민), English keeps the space (Kim Mu-chong,
--     Peng Dehuai, Le Duan).
--   * Japanese names: family first with a space in Korean (도쿠다 규이치),
--     given first in English (Sen Katayama).
--   * Everyone else: unchanged Western "given family".
--
-- This migration repairs the stored rows: reversed full names, mislabeled
-- given/family parts, and the native-script line the curator left empty (or
-- filled with Russian Cyrillic) after wrong-script rejections on 2026-08-04.

-- Reversed display names (and, where noted, parts / native-script fixes).
UPDATE commulingo_people p
SET name_ko = v.name_ko,
    name_en = v.name_en,
    updated_at = NOW()
FROM (VALUES
    -- Korea
    ('yeo-un-hyeong',  '여운형',      'Yeo Un-hyeong'),
    ('mu-chong',       '김무정',      'Kim Mu-chong'),
    ('kim-jong-suk',   '김정숙',      'Kim Jong-suk'),
    ('yi-dong-hwi',    '이동휘',      'Yi Dong-hwi'),
    -- China
    ('peng-dehuai',    '펑더화이',    'Peng Dehuai'),
    ('liu-shaoqi',     '류사오치',    'Liu Shaoqi'),
    ('qu-qiubai',      '취추바이',    'Qu Qiubai'),
    ('wang-ming',      '왕밍',        'Wang Ming'),
    ('zhang-chunqiao', '장춘차오',    'Zhang Chunqiao'),
    -- Vietnam
    ('vo-nguyen-giap', '보응우옌잡',  'Võ Nguyên Giáp'),
    ('le-duan',        '레주언',      'Le Duan'),
    -- Japan (family first with a space in Korean; English stays given-first)
    ('sen-katayama',   '가타야마 센', 'Sen Katayama'),
    ('tokuda-kyuichi', '도쿠다 규이치', 'Kyuichi Tokuda'),
    ('sanzo-nosaka',   '노사카 산조', 'Sanzo Nosaka')
) AS v(id, name_ko, name_en)
WHERE p.id = v.id;

-- Mislabeled English parts: the surname was stored as given_name_en.
UPDATE commulingo_people p
SET given_name_en = v.given_en,
    family_name_en = v.family_en,
    updated_at = NOW()
FROM (VALUES
    ('ho-chi-minh',   'Chi Minh', 'Ho'),
    ('deng-xiaoping', 'Xiaoping', 'Deng'),
    ('zhou-enlai',    'Enlai',    'Zhou'),
    ('mao-zedong',    'Zedong',   'Mao'),
    ('li-dazhao',     'Dazhao',   'Li'),
    ('chen-duxiu',    'Duxiu',    'Chen'),
    ('lin-biao',      'Biao',     'Lin'),
    ('zhu-de',        'De',       'Zhu'),
    ('kim-tu-bong',   'Tu-bong',  'Kim'),
    ('kim-il-sung',   'Il Sung',  'Kim'),
    ('kim-jong-il',   'Jong Il',  'Kim'),
    ('pak-hon-yong',  'Hon-yong', 'Pak'),
    ('kim-chaek',     'Chaek',    'Kim'),
    ('choe-yong-gon', 'Yong-gon', 'Choe'),
    ('mu-chong',      'Mu-chong', 'Kim')
) AS v(id, given_en, family_en)
WHERE p.id = v.id;

-- Native-script line: left empty after wrong-script rejections, or filled
-- with a Russian transliteration (Во Нгуен Зяп) a Vietnamese never wrote.
UPDATE commulingo_people p
SET cyrillic = v.native,
    updated_at = NOW()
FROM (VALUES
    ('mu-chong',       '金武亭'),
    ('choe-yong-gon',  '최용건'),
    ('kim-jong-suk',   '김정숙'),
    ('zhang-chunqiao', '张春桥'),
    ('wang-ming',      '王明'),
    ('tokuda-kyuichi', '徳田球一'),
    ('vo-nguyen-giap', 'Võ Nguyên Giáp')
) AS v(id, native)
WHERE p.id = v.id;
