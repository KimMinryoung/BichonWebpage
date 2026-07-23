-- 059: Soviet republic figures follow the Stalin convention — citizenship
-- 'soviet', origin = the republic/nation they came from.
--
-- These eleven were filed with the republic (or, for Kuusinen and Varga, the
-- country they emigrated from) in the citizenship slot, so a Latvian Chekist
-- carried a Latvian flag and no Soviet one while Stalin carries 소련 + 조지아.
-- Their careers were wholly Soviet, so citizenship becomes 'soviet' and the
-- nationality moves to origin, where it still renders as the second flag.
--
-- Not touched on purpose: Shevardnadze (georgia) and Aliyev (azerbaijan) led
-- independent states for a decade after 1991, so their own nation is the right
-- citizenship; Dimitrov, Bierut, Gomułka, Kádár, Nagy, Dubček, Gierek and the
-- other foreign party leaders belong to their own countries.
--
-- The native-name script check reads citizenship AND origin as a union
-- (data/commulingo/native-script.js), so the Latin/Latvian/Lithuanian names set
-- by migration 057 stay valid under the new codes.

UPDATE commulingo_people p
SET citizenship_code = 'soviet',
    citizenship_label_ko = '소련',
    citizenship_label_en = 'Soviet Union',
    origin_code = v.origin_code,
    origin_label_ko = v.origin_ko,
    origin_label_en = v.origin_en,
    updated_at = NOW()
FROM (VALUES
    ('dinmukhamed-kunaev',   'kazakhstan', '카자흐스탄', 'Kazakhstan'),
    ('martin-lacis',         'latvia',     '라트비아',   'Latvia'),
    ('asja-lacis',           'latvia',     '라트비아',   'Latvia'),
    ('yan-berzin',           'latvia',     '라트비아',   'Latvia'),
    ('voss',                 'latvia',     '라트비아',   'Latvia'),
    ('paleckis',             'lithuania',  '리투아니아', 'Lithuania'),
    ('antanas-snieckus',     'lithuania',  '리투아니아', 'Lithuania'),
    ('nuritdin-mukhitdinov', 'uzbekistan', '우즈베키스탄', 'Uzbekistan'),
    ('nishonov',             'uzbekistan', '우즈베키스탄', 'Uzbekistan'),
    -- Finnish Red leader who spent his whole later career in Moscow as a Soviet
    -- Politburo member, and the Hungarian economist who ran IMEL/Varga Institute
    -- in Moscow until his death there.
    ('kuusinen',             'finland',    '핀란드',     'Finland'),
    ('evgeny-varga',         'hungary',    '헝가리',     'Hungary')
) AS v(id, origin_code, origin_ko, origin_en)
WHERE p.id = v.id;
