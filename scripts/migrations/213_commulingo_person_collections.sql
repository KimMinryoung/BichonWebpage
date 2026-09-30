-- 213: Curated person collections for political positions that are not a
-- function or an organization (counter-revolution, the imperial and White
-- camp, the left opposition, socialist-bloc reformers, dissidents).
--
-- These used to be commulingo_role_categories rows used as a person's single
-- role. Activities now carry function and affiliation, so the position lives
-- here: a titled list with an introduction, independent of the role, and a
-- person may be in several. Ids keep the category ids so /commulingo/roles/<id>
-- keeps serving them. Members are copied from commulingo_person_roles except
-- people the category plainly misfiled (listed below); the role rows stay
-- until the legacy role is retired.

BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE TABLE commulingo_person_collections (
    id text PRIMARY KEY,
    sort_order integer NOT NULL DEFAULT 0,
    icon text NOT NULL,
    title_ko text NOT NULL,
    title_en text NOT NULL,
    intro_ko text NOT NULL,
    intro_en text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE commulingo_person_collection_members (
    collection_id text NOT NULL REFERENCES commulingo_person_collections(id) ON UPDATE CASCADE ON DELETE CASCADE,
    person_id text NOT NULL REFERENCES commulingo_people(id) ON UPDATE CASCADE ON DELETE CASCADE,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (collection_id, person_id)
);
CREATE INDEX commulingo_person_collection_members_person ON commulingo_person_collection_members(person_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON commulingo_person_collections, commulingo_person_collection_members TO frontend;

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
SELECT c.id, v.sort_order, c.icon, COALESCE(v.title_ko, c.label_ko), COALESCE(v.title_en, c.label_en), v.intro_ko, v.intro_en
FROM (VALUES
    ('imperial-white', 0,
     '러시아 제국을 떠받친 황실·관료·장군, 1917년의 자유주의 정치가, 그리고 내전기에 볼셰비키와 싸운 백색운동과 망명 세력입니다. 각 인물의 실제 활동과 소속은 인물 카드에 따로 있습니다.',
     'The dynasty, officials and generals who upheld the Russian Empire, the liberal politicians of 1917, and the White movement and emigration that fought the Bolsheviks. Each person''s actual activities and affiliations are on their card.', NULL, NULL),
    ('counterrevolution', 1,
     '프랑스 혁명에서 20세기 후반까지, 혁명 운동이나 사회주의 국가에 무력·정치로 맞선 인물들입니다. 간섭군, 파시즘·나치 체제와 그 군 지휘관, 식민지·냉전기 반공 정권과 군이 포함됩니다.',
     'From the French Revolution to the late twentieth century, people who opposed revolutionary movements or socialist states by force or politics: interventionists, the fascist and Nazi regimes and their commanders, and colonial and Cold War anti-communist governments and armies.', NULL, NULL),
    ('left-opposition', 2,
     '레닌과 볼셰비키 지도부를 왼쪽에서 비판한 사람들입니다. 좌파 사회혁명당, 당내 분파(좌익공산주의자·민주집중파·노동자 반대파·좌익반대파), 크론시타트 반란, 그리고 뒤 시대의 트로츠키주의와 레닌주의 복귀 요구까지 이어집니다. 조직으로서의 각 분파와 그 구성원은 기능·활동 페이지의 국가·세력 필터에서 따로 찾을 수 있습니다.',
     'People who criticised Lenin and the Bolshevik leadership from the left: the Left Socialist Revolutionaries, the party factions (Left Communists, Democratic Centralists, Workers'' Opposition, Left Opposition), the Kronstadt rebellion, and later Trotskyism and calls to return to Leninist principles. Each faction as an organization, with its documented members, is a separate affiliation filter on the activities page.',
     '볼셰비키에 대한 좌파 비판', 'Left critics of Bolshevism'),
    ('socialist-bloc-reform-leader', 3,
     '사회주의권 안에서 개혁을 이끌거나 체제 전환을 주도한 사람들입니다. 1956년 헝가리와 1968년 프라하의 봄, 소련의 경제 개혁론과 페레스트로이카, 1980년대 동유럽·발트의 전환이 포함됩니다.',
     'People who led reform inside the socialist bloc or drove its transition: Hungary 1956 and the Prague Spring, Soviet economic reformers and perestroika, and the Eastern European and Baltic transitions of the 1980s.', NULL, NULL),
    ('dissident', 4,
     '사회주의 국가 안에서 체제를 공개적으로 비판하다 박해받은 인물들입니다.',
     'People who openly criticised the system inside a socialist state and were persecuted for it.', NULL, NULL)
) AS v(id, sort_order, intro_ko, intro_en, title_ko, title_en)
JOIN commulingo_role_categories c ON c.id = v.id;

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
SELECT r.category_id, r.person_id
FROM commulingo_person_roles r
WHERE r.category_id IN (SELECT id FROM commulingo_person_collections)
  AND r.person_id NOT IN (
    -- Allied commanders against the Axis, not against a revolution or socialist state.
    'alexander-vandegrift', 'keith-park', 'frank-jack-fletcher', 'arthur-harris', 'hugh-dowding', 'raymond-a-spruance',
    -- A French revolutionary general and the first chairman of the 1905 Petersburg Soviet.
    'francois-christophe-kellermann', 'boguslaw-zborowski',
    -- Killed resisting the 1991 coup, and a Bolshevik worker with no opposition record.
    'vladimir-usov', 'dmitry-komar', 'ilya-krichevsky', 'ivan-chugurin'
  );

COMMIT;
