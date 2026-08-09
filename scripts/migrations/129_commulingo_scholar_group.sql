-- A place for the people who studied this history, as opposed to the people who
-- made it.
--
-- The event lane writes historiography: sections on how an episode has been
-- read, and those sections name the readers. The curator was told to file the
-- people its text leans on, so it filed them, and the person lane made them
-- cards. Correct on both sides — except that all eight groups are camps of
-- actors, so the classifier had to put an academic in one. Bruce Cumings,
-- Sheila Fitzpatrick and Ronald Suny landed in 비소련 혁명가, John Lewis Gaddis
-- and Nina Tumarkin in 소련을 상대한 정치가들, and Stanley Payne — a living
-- American historian — in 비소련 반혁명 진영.
--
-- The 49 moved here are observers: they wrote about the events rather than
-- appearing in them. Four cards that the same query caught stay where they are
-- because they are actors first: George Kennan (containment's author, a
-- diplomat), Ota Šik (deputy premier of the Prague Spring), Marju Lauristin and
-- Yuri Afanasyev (both elected in 1989 and central to what followed).
--
-- Movement thinkers are not touched either. Deutscher, Althusser, Marcuse,
-- Korsch, Kropotkin and Mariátegui belong to the intellectual history this site
-- narrates; they are part of the story, not commentary on it.

INSERT INTO commulingo_people_groups
    (id, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en)
VALUES (
    'scholar', 102, '1892–현재',
    '이 역사를 연구한 사람들', 'Scholars of this history',
    '사료를 읽고 이 역사를 해석해 온 역사가와 사회과학자들.',
    'The historians and social scientists who read the archives and interpreted this history.'
)
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    range_label = EXCLUDED.range_label,
    title_ko = EXCLUDED.title_ko,
    title_en = EXCLUDED.title_en,
    blurb_ko = EXCLUDED.blurb_ko,
    blurb_en = EXCLUDED.blurb_en,
    updated_at = NOW();

-- The role medal is a separate taxonomy from the group and has the same hole:
-- 이론가 is for the movement's own theorists, not for someone writing about it
-- from a university.
INSERT INTO commulingo_role_categories (id, sort_order, icon, label_ko, label_en)
VALUES ('scholar', 10, 'library', '연구자', 'Scholar')
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();

CREATE TEMP TABLE _scholars (id text PRIMARY KEY);
INSERT INTO _scholars (id) VALUES
    ('alan-s-milward'),
    ('alexander-rabinowitch'),
    ('alexandr-fursenko'),
    ('amy-knight'),
    ('andrei-sushkov'),
    ('archie-brown'),
    ('asif-siddiqi'),
    ('bruce-cumings'),
    ('daniel-kowalsky'),
    ('daron-acemoglu'),
    ('david-brandenberger'),
    ('e-h-carr'),
    ('francine-hirsch'),
    ('gennady-kostyrchenko'),
    ('graham-allison'),
    ('grigory-khanin'),
    ('helen-graham'),
    ('ivan-krastev'),
    ('jan-pauer'),
    ('jeronim-perovi'),
    ('john-lewis-gaddis'),
    ('jonathan-brent'),
    ('kate-brown'),
    ('leonid-gibianskii'),
    ('mark-r-beissinger'),
    ('mikhail-semiryaga'),
    ('ngel-vi-as'),
    ('nina-tumarkin'),
    ('p-o-moa'),
    ('rafael-reuveny'),
    ('robert-c-allen'),
    ('robert-w-davies'),
    ('ronald-grigor-suny'),
    ('rustem-nureyev'),
    ('serhii-plokhy'),
    ('sheila-fitzpatrick'),
    ('stanley-g-payne'),
    ('stephen-f-cohen'),
    ('stephen-g-wheatcroft'),
    ('stephen-kotkin'),
    ('terry-martin'),
    ('timothy-garton-ash'),
    ('vladimir-kontorovich'),
    ('vladimir-tismaneanu'),
    ('vladislav-kutuzov'),
    ('vladislav-zubok'),
    ('william-stueck'),
    ('yuly-olsevich'),
    ('yuri-goland');

UPDATE commulingo_people SET group_id = 'scholar', updated_at = NOW()
 WHERE id IN (SELECT id FROM _scholars);

UPDATE commulingo_person_roles SET category_id = 'scholar', updated_at = NOW()
 WHERE person_id IN (SELECT id FROM _scholars);

DROP TABLE _scholars;
