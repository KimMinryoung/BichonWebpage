-- 222: national-liberation, revolutionary-democrat and western-marxist collections;
-- additions to left-opposition (Trotskyists, Trotsky himself, Left SRs, council
-- communists) and counterrevolution (Cold War officials, colonial and anti-communist
-- regimes). Sources, cited sentences and exclusions:
-- scripts/content/person-collection-*-20261001.json.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('national-liberation', 10, 'globe', '민족해방·반식민 운동', 'National liberation and anti-colonial movements',
    '20세기 아시아·아프리카·라틴아메리카에서 식민 지배와 외세에 맞서 독립과 해방을 이끈 지도자와 투사들입니다. 기니비사우의 카브랄, 콩고의 루뭄바, 앙골라·모잠비크의 해방운동, 니카라과의 산디노, 엘살바도르의 파라분도 마르티, 조선의 독립운동가가 여기에 속합니다. 해방운동을 이끈 공산주의자(호찌민)도 넣었고, 그 카드 색은 공산주의 붉은색입니다.',
    'Leaders and militants who led independence and liberation struggles against colonial rule and foreign domination in twentieth-century Asia, Africa and Latin America: Cabral of Guinea-Bissau, Lumumba of the Congo, the Angolan and Mozambican liberation movements, Sandino of Nicaragua, Farabundo Martí of El Salvador, and the Korean independence movement. Communists who led liberation movements (Ho Chi Minh) are included; their cards keep the communist red.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('national-liberation', 'agostinho-neto'),
    ('national-liberation', 'augusto-cesar-sandino'),
    ('national-liberation', 'cabral'),
    ('national-liberation', 'cho-mansik'),
    ('national-liberation', 'chris-hani'),
    ('national-liberation', 'eduardo-mondlane'),
    ('national-liberation', 'fanon'),
    ('national-liberation', 'farabundo-marti'),
    ('national-liberation', 'george-padmore'),
    ('national-liberation', 'ho-chi-minh'),
    ('national-liberation', 'iko-carreira'),
    ('national-liberation', 'jawaharlal-nehru'),
    ('national-liberation', 'julius-nyerere'),
    ('national-liberation', 'kim-chaek'),
    ('national-liberation', 'kim-il-sung'),
    ('national-liberation', 'kim-tu-bong'),
    ('national-liberation', 'kim-won-bong'),
    ('national-liberation', 'kwame-nkrumah'),
    ('national-liberation', 'le-duan'),
    ('national-liberation', 'lucio-lara'),
    ('national-liberation', 'lumumba'),
    ('national-liberation', 'mn-roy'),
    ('national-liberation', 'monja-jaona'),
    ('national-liberation', 'mu-chong'),
    ('national-liberation', 'nguyen-thi-binh'),
    ('national-liberation', 'norodom-sihanouk'),
    ('national-liberation', 'ruth-first'),
    ('national-liberation', 'samora-machel'),
    ('national-liberation', 'tan-malaka'),
    ('national-liberation', 'vo-nguyen-giap'),
    ('national-liberation', 'yeo-un-hyeong'),
    ('national-liberation', 'yi-dong-hwi')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('revolutionary-democrat', 11, 'feather', '러시아 혁명적 민주주의자', 'Russian revolutionary democrats',
    '1840~60년대 나로드니키에 앞서 전제정과 농노제에 맞선 러시아의 급진 인텔리겐치야입니다. 망명지에서 《콜로콜》을 펴낸 게르첸과 오가료프, 비평가 벨린스키, 《무엇을 할 것인가》의 체르니솁스키, 도브롤류보프와 피사레프가 여기에 속합니다. 슬라브주의자, 자유주의자, 《이정표》의 종교철학자는 넣지 않았습니다.',
    'The radical Russian intelligentsia of the 1840s–60s who opposed autocracy and serfdom before the Narodniks: Herzen and Ogarev, who published The Bell in exile, the critic Belinsky, Chernyshevsky of What Is to Be Done?, Dobrolyubov and Pisarev. Slavophiles, liberals and the religious philosophers of Vekhi are not included.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('revolutionary-democrat', 'alexander-herzen'),
    ('revolutionary-democrat', 'chernyshevsky'),
    ('revolutionary-democrat', 'dmitry-pisarev'),
    ('revolutionary-democrat', 'nikolai-dobrolyubov'),
    ('revolutionary-democrat', 'nikolai-ogarev'),
    ('revolutionary-democrat', 'vissarion-belinsky')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('western-marxist', 12, 'book-open', '서구 마르크스주의 이론가', 'Western Marxist theorists',
    '소련 공식 교의 밖에서 마르크스주의 이론을 새로 쓴 사상가들입니다. 루카치와 코르슈, 그람시, 프랑크푸르트학파(마르쿠제, 벤야민), 블로흐, 알튀세르, 마리아테기, 앤절라 데이비스가 여기에 속합니다. 당원이었던 사람도 이 모음의 색을 받습니다. 공식 당 이념가와, 마르크스주의를 연구한 역사가는 넣지 않았습니다.',
    'Thinkers who reworked Marxist theory outside the official Soviet doctrine: Lukács and Korsch, Gramsci, the Frankfurt School (Marcuse, Benjamin), Bloch, Althusser, Mariátegui and Angela Davis. Party members among them take this collection''s colour. Official party ideologues and historians of Marxism are not included.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('western-marxist', 'angela-davis'),
    ('western-marxist', 'anton-pannekoek'),
    ('western-marxist', 'c-l-r-james'),
    ('western-marxist', 'ernst-bloch'),
    ('western-marxist', 'gramsci'),
    ('western-marxist', 'gyorgy-lukacs'),
    ('western-marxist', 'herbert-marcuse'),
    ('western-marxist', 'karl-korsch'),
    ('western-marxist', 'louis-althusser'),
    ('western-marxist', 'mariategui'),
    ('western-marxist', 'raya-dunayevskaya'),
    ('western-marxist', 'walter-benjamin')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('left-opposition', 'alexander-voronsky'),
    ('left-opposition', 'alfred-rosmer'),
    ('left-opposition', 'andreu-nin'),
    ('left-opposition', 'anton-pannekoek'),
    ('left-opposition', 'boris-donskoy'),
    ('left-opposition', 'boris-souvarine'),
    ('left-opposition', 'c-l-r-james'),
    ('left-opposition', 'grace-lee-boggs'),
    ('left-opposition', 'irina-kakhovskaya'),
    ('left-opposition', 'prosh-proshian'),
    ('left-opposition', 'raya-dunayevskaya'),
    ('left-opposition', 'sylvia-pankhurst'),
    ('left-opposition', 'tony-cliff'),
    ('left-opposition', 'trotsky')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('counterrevolution', 'allen-dulles'),
    ('counterrevolution', 'chiang-kai-shek'),
    ('counterrevolution', 'dwight-d-eisenhower'),
    ('counterrevolution', 'george-f-kennan'),
    ('counterrevolution', 'harry-s-truman'),
    ('counterrevolution', 'hermann-von-eichhorn'),
    ('counterrevolution', 'john-f-kennedy'),
    ('counterrevolution', 'john-foster-dulles'),
    ('counterrevolution', 'karl-doenitz'),
    ('counterrevolution', 'lon-nol'),
    ('counterrevolution', 'lyndon-b-johnson'),
    ('counterrevolution', 'miklos-horthy'),
    ('counterrevolution', 'raoul-salan'),
    ('counterrevolution', 'robert-mcnamara'),
    ('counterrevolution', 'ronald-reagan'),
    ('counterrevolution', 'son-sann'),
    ('counterrevolution', 'wilhelm-keitel'),
    ('counterrevolution', 'winston-churchill'),
    ('counterrevolution', 'zbigniew-brzezinski')
ON CONFLICT DO NOTHING;

COMMIT;
