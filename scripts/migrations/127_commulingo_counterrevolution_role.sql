-- Two role categories the vocabulary was missing, and the people who were
-- filed under the wrong one because of it.
--
-- The role medal is what a person page actually shows, and it is a different
-- taxonomy from the group. Splitting the group on 2026-08-09 (migration 126)
-- left the roles untouched, so Syngman Rhee still displayed as 「비소련 혁명가」
-- while sitting in the counter-revolution group.
--
-- With only seven categories and no bucket for either a non-Soviet
-- counter-revolutionary or a foreign politician, the curator put Franco and
-- Mannerheim under 제정·백색진영 (a label about the Russian imperial
-- establishment and the White movement) and Roosevelt, Truman, Kennedy,
-- Reagan, Shultz, Marshall, Clayton, Churchill, Paasikivi and Erkko under it
-- too. Rhee and Petliura landed in 비소련 혁명가 because it was the only
-- remaining non-Soviet slot.
--
-- imperial-white keeps its own meaning: Kolchak, Denikin, Wrangel and the rest
-- of the Russian White movement stay exactly where they are.

INSERT INTO commulingo_role_categories (id, sort_order, icon, label_ko, label_en) VALUES
    ('counterrevolution', 6, 'shield', '반혁명 세력', 'Counter-revolutionary forces'),
    ('foreign-statesman', 9, 'handshake', '외국 정치가', 'Foreign statesman')
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    icon = EXCLUDED.icon,
    label_ko = EXCLUDED.label_ko,
    label_en = EXCLUDED.label_en,
    updated_at = NOW();

-- Took up arms against a revolution in their own country.
UPDATE commulingo_person_roles SET category_id = 'counterrevolution'
 WHERE person_id IN (
     'francisco-franco', 'carl-gustaf-emil-mannerheim', 'syngman-rhee',
     'pavlo-skoropadskyi'
 );

-- Negotiated with the USSR and stood against it from a foreign government.
-- Kennan is deliberately left as 이론가: he is on this site as the author of
-- containment before he is a diplomat.
UPDATE commulingo_person_roles SET category_id = 'foreign-statesman'
 WHERE person_id IN (
     'franklin-d-roosevelt', 'harry-s-truman', 'george-c-marshall',
     'john-f-kennedy', 'ronald-reagan', 'george-shultz', 'winston-churchill',
     'william-l-clayton', 'juho-kusti-paasikivi', 'eljas-erkko'
 );
