-- 058: Correct citizenship codes that held a birthplace or a place of death.
--
-- citizenship = the state the person belonged to for the work they are known
-- for; origin = birthplace. Neither is "where they happened to die". These eight
-- rows had one of the wrong things in the citizenship slot, which put a Polish
-- flag on a Soviet marshal, an Uzbek flag on the Leningrad Affair's Kuznetsov
-- and a Hungarian flag on Tito. Citizenship also drives the native-name script
-- check (see 057 and data/commulingo/native-script.js), so a wrong code here
-- produces a wrong name there.
--
-- Requires public/flags/yugoslavia.svg + the 'yugoslavia' entry in
-- data/commulingo/flag-icons.js, added with this change for Tito.

UPDATE commulingo_people p
SET citizenship_code = v.citizenship_code,
    citizenship_label_ko = v.citizenship_ko,
    citizenship_label_en = v.citizenship_en,
    origin_code = v.origin_code,
    origin_label_ko = v.origin_ko,
    origin_label_en = v.origin_en,
    updated_at = NOW()
FROM (VALUES
    -- Soviet marshal and Polish defence minister; born in Warsaw, raised in
    -- Velikiye Luki. Soviet citizenship, Polish origin.
    ('konstantin-rokossovsky', 'soviet', '소련', 'Soviet Union', 'poland',  '폴란드',   'Poland'),
    -- Born in Lemberg, Austria-Hungary (today Lviv); Soviet politician.
    ('radek',                  'soviet', '소련', 'Soviet Union', 'ukraine', '우크라이나', 'Ukraine'),
    -- Born in Paris, but her whole political life and death were Soviet.
    ('armand',                 'soviet', '소련', 'Soviet Union', 'france',  '프랑스',   'France'),
    -- Simon Ter-Petrosian: Armenian, born in Gori, died in Tiflis. Nothing
    -- Ukrainian about him; the code was simply wrong.
    ('kamo',                   'soviet', '소련', 'Soviet Union', 'georgia', '조지아',   'Georgia'),
    -- Born in Kotel, then Ottoman Bulgaria; Soviet diplomat and oppositionist.
    ('christian-rakovsky',     'soviet', '소련', 'Soviet Union', 'bulgaria', '불가리아', 'Bulgaria'),
    -- Georgian Menshevik leader who died in exile in New York — the USA is where
    -- he died, not what he was.
    ('irakli-tsereteli',       'georgia', '조지아', 'Georgia',    '',        '',        ''),
    -- Leningrad Affair; Soviet throughout, no Uzbek connection.
    ('alexei-kuznetsov',       'soviet', '소련', 'Soviet Union', '',        '',        ''),
    -- Born in Kumrovec in Austria-Hungary (today Croatia); led Yugoslavia.
    ('josip-broz-tito',        'yugoslavia', '유고슬라비아', 'Yugoslavia', 'austria', '오스트리아', 'Austria')
) AS v(id, citizenship_code, citizenship_ko, citizenship_en, origin_code, origin_ko, origin_en)
WHERE p.id = v.id;
