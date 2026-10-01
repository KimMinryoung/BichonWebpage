-- 221: four new political-position collections and six counterrevolution additions.
--
-- Card colours follow political position (data/commulingo/person-position.js);
-- these collections give most of the people left grey a documented position.
-- non-bolshevik-socialist, narodnik and jacobin colour a card only when the
-- person's affiliation does not make it red. Sources, cited sentences and
-- exclusions: scripts/content/person-collection-*-20261001.json.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('non-bolshevik-socialist', 6, 'landmark', '비볼셰비키 사회주의자', 'Non-Bolshevik socialists',
    '볼셰비키·공산주의 전통 밖에서 사회주의를 추구한 사람들입니다. 플레하노프의 노동해방단과 멘셰비키, 사회혁명당(좌파 사회혁명당 제외), 분트, 그리고 제2인터내셔널의 사회민주주의자(독일 사민당, 프랑스 SFIO, 영국 노동당 등)가 여기에 속합니다. 뒤에 공산당을 세우거나 공산당·사회주의 국가에 복무한 사람은 넣지 않았습니다.',
    'People who pursued socialism outside the Bolshevik and communist tradition: Plekhanov''s Emancipation of Labour and the Mensheviks, the Socialist Revolutionaries (not the Left SRs), the Bund, and the social democrats of the Second International (the German SPD, the French SFIO, British Labour and others). People who went on to found or lead a communist party or to serve a communist party-state are not included.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('non-bolshevik-socialist', 'abram-gots'),
    ('non-bolshevik-socialist', 'alexander-parvus'),
    ('non-bolshevik-socialist', 'alexander-potresov'),
    ('non-bolshevik-socialist', 'angelica-balabanova'),
    ('non-bolshevik-socialist', 'arthur-crispien'),
    ('non-bolshevik-socialist', 'arthur-henderson'),
    ('non-bolshevik-socialist', 'august-bebel'),
    ('non-bolshevik-socialist', 'boris-savinkov'),
    ('non-bolshevik-socialist', 'camille-huysmans'),
    ('non-bolshevik-socialist', 'catherine-breshkovsky'),
    ('non-bolshevik-socialist', 'clement-attlee'),
    ('non-bolshevik-socialist', 'eduard-bernstein'),
    ('non-bolshevik-socialist', 'emile-vandervelde'),
    ('non-bolshevik-socialist', 'ernst-reuter'),
    ('non-bolshevik-socialist', 'ernst-toller'),
    ('non-bolshevik-socialist', 'eugene-v-debs'),
    ('non-bolshevik-socialist', 'ferdinand-lassalle'),
    ('non-bolshevik-socialist', 'friedrich-ebert'),
    ('non-bolshevik-socialist', 'friedrich-ebert-jr'),
    ('non-bolshevik-socialist', 'fyodor-dan'),
    ('non-bolshevik-socialist', 'george-orwell'),
    ('non-bolshevik-socialist', 'giacinto-menotti-serrati'),
    ('non-bolshevik-socialist', 'grigory-gershuni'),
    ('non-bolshevik-socialist', 'gustav-noske'),
    ('non-bolshevik-socialist', 'gustave-herve'),
    ('non-bolshevik-socialist', 'hermann-muller'),
    ('non-bolshevik-socialist', 'hugo-haase'),
    ('non-bolshevik-socialist', 'irakli-tsereteli'),
    ('non-bolshevik-socialist', 'ivan-kalyaev'),
    ('non-bolshevik-socialist', 'ivanoe-bonomi'),
    ('non-bolshevik-socialist', 'jean-jaures'),
    ('non-bolshevik-socialist', 'jozef-pilsudski'),
    ('non-bolshevik-socialist', 'juan-negrin'),
    ('non-bolshevik-socialist', 'jules-guesde'),
    ('non-bolshevik-socialist', 'julian-besteiro'),
    ('non-bolshevik-socialist', 'karl-kautsky'),
    ('non-bolshevik-socialist', 'keir-hardie'),
    ('non-bolshevik-socialist', 'kerensky'),
    ('non-bolshevik-socialist', 'kurt-eisner'),
    ('non-bolshevik-socialist', 'largo-caballero'),
    ('non-bolshevik-socialist', 'leon-blum'),
    ('non-bolshevik-socialist', 'lev-deitch'),
    ('non-bolshevik-socialist', 'ludovic-oscar-frossard'),
    ('non-bolshevik-socialist', 'marceau-pivert'),
    ('non-bolshevik-socialist', 'mark-natanson'),
    ('non-bolshevik-socialist', 'martov'),
    ('non-bolshevik-socialist', 'matvey-skobelev'),
    ('non-bolshevik-socialist', 'mikhail-liber'),
    ('non-bolshevik-socialist', 'nikolai-avksentiev'),
    ('non-bolshevik-socialist', 'nikolai-chkheidze'),
    ('non-bolshevik-socialist', 'nikolai-sukhanov'),
    ('non-bolshevik-socialist', 'paul-lafargue'),
    ('non-bolshevik-socialist', 'paul-levi'),
    ('non-bolshevik-socialist', 'pavel-akselrod'),
    ('non-bolshevik-socialist', 'philipp-scheidemann'),
    ('non-bolshevik-socialist', 'pitirim-sorokin'),
    ('non-bolshevik-socialist', 'plekhanov'),
    ('non-bolshevik-socialist', 'ramsay-macdonald'),
    ('non-bolshevik-socialist', 'robert-grimm'),
    ('non-bolshevik-socialist', 'vaino-tanner'),
    ('non-bolshevik-socialist', 'vaino-voionmaa'),
    ('non-bolshevik-socialist', 'vera-zasulich'),
    ('non-bolshevik-socialist', 'victor-adler'),
    ('non-bolshevik-socialist', 'victor-chernov'),
    ('non-bolshevik-socialist', 'vladimir-groman'),
    ('non-bolshevik-socialist', 'vladimir-voitinsky'),
    ('non-bolshevik-socialist', 'vladimir-zenzinov'),
    ('non-bolshevik-socialist', 'volodymyr-vynnychenko'),
    ('non-bolshevik-socialist', 'wilhelm-liebknecht'),
    ('non-bolshevik-socialist', 'willy-brandt')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('narodnik', 7, 'flame', '나로드니키', 'Narodniks',
    '1860~80년대 러시아의 혁명적 인민주의자들입니다. 차이콥스키 서클과 ''브나로드'' 운동, 토지와 자유, 인민의 의지, 흑토재분배에서 활동했습니다. 뒤에 마르크스주의나 사회혁명당으로 간 사람도 이 시기를 근거로 넣었고, 이들에게 영감을 준 선행 사상가(게르첸, 체르니솁스키)와 이들을 연구한 역사가는 넣지 않았습니다.',
    'The revolutionary populists of 1860s–80s Russia: the Chaikovsky Circle and the ''going to the people'' movement, Land and Liberty, People''s Will and Black Repartition. People who later became Marxists or Socialist Revolutionaries are included for that period; the precursors who inspired them (Herzen, Chernyshevsky) and historians of the movement are not.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('narodnik', 'alexander-ulyanov'),
    ('narodnik', 'andrei-zhelyabov'),
    ('narodnik', 'catherine-breshkovsky'),
    ('narodnik', 'lev-deitch'),
    ('narodnik', 'mark-natanson'),
    ('narodnik', 'nikolai-kibalchich'),
    ('narodnik', 'nikolai-mikhailovsky'),
    ('narodnik', 'nikolai-morozov'),
    ('narodnik', 'pavel-akselrod'),
    ('narodnik', 'plekhanov'),
    ('narodnik', 'pyotr-lavrov'),
    ('narodnik', 'pyotr-tkachev'),
    ('narodnik', 'sergei-stepniak-kravchinsky'),
    ('narodnik', 'sofia-perovskaya'),
    ('narodnik', 'stepan-khalturin'),
    ('narodnik', 'vera-figner'),
    ('narodnik', 'vera-zasulich'),
    ('narodnik', 'vladimir-burtsev')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('jacobin', 8, 'scale', '자코뱅·프랑스 혁명 급진파', 'Jacobins and French revolutionary radicals',
    '프랑스 혁명의 급진파입니다. 자코뱅 클럽과 산악파, 공안위원회, 코르들리에와 에베르파, 앙라제, 그리고 바뵈프의 평등파 음모가 여기에 속합니다. 지롱드파와 푀양파 같은 온건파, 나폴레옹, 19세기의 블랑키·코뮌 세대는 넣지 않았습니다.',
    'The radical wing of the French Revolution: the Jacobin Club and the Montagnards, the Committee of Public Safety, the Cordeliers and Hébertists, the Enragés, and Babeuf''s Conspiracy of the Equals. Moderates such as the Girondins and Feuillants, Napoleon, and the nineteenth-century generation of Blanqui and the Commune are not included.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('jacobin', 'antoine-francois-momoro'),
    ('jacobin', 'bertrand-barere'),
    ('jacobin', 'camille-desmoulins'),
    ('jacobin', 'charles-philippe-ronsin'),
    ('jacobin', 'francois-nicolas-vincent'),
    ('jacobin', 'georges-couthon'),
    ('jacobin', 'georges-danton'),
    ('jacobin', 'gracchus-babeuf'),
    ('jacobin', 'jacques-louis-david'),
    ('jacobin', 'jacques-rene-hebert'),
    ('jacobin', 'jacques-roux'),
    ('jacobin', 'jean-francois-varlet'),
    ('jacobin', 'jean-paul-marat'),
    ('jacobin', 'jean-pierre-andre-amar'),
    ('jacobin', 'lazare-carnot'),
    ('jacobin', 'louis-antoine-de-saint-just'),
    ('jacobin', 'maximilien-robespierre'),
    ('jacobin', 'pierre-gaspard-chaumette'),
    ('jacobin', 'sylvain-marechal')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collections (id, sort_order, icon, title_ko, title_en, intro_ko, intro_en)
VALUES ('fascist', 9, 'shield', '파시스트·나치', 'Fascists and Nazis',
    '파시스트·나치 운동과 체제의 당원·지도자입니다. 나치당과 SS, 이탈리아 국가파시스트당, 그리고 다른 나라의 파시스트 정당이 여기에 속합니다. 당원이라는 근거가 없는 국방군 지휘관이나 협력 정권 인사는 넣지 않았습니다. 이들 대부분은 반혁명 세력 모음에도 있습니다.',
    'Members and leaders of fascist and Nazi movements and regimes: the Nazi Party and the SS, the National Fascist Party of Italy, and fascist parties elsewhere. Wehrmacht commanders and collaborationist officials without a documented party identity are not included. Most of these people are also in the counter-revolutionary forces collection.')
ON CONFLICT (id) DO UPDATE SET intro_ko = EXCLUDED.intro_ko, intro_en = EXCLUDED.intro_en, updated_at = now();

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('fascist', 'adolf-hitler'),
    ('fascist', 'benito-mussolini'),
    ('fascist', 'dino-grandi'),
    ('fascist', 'francisco-franco'),
    ('fascist', 'galeazzo-ciano'),
    ('fascist', 'heinrich-himmler'),
    ('fascist', 'heinz-reinefarth'),
    ('fascist', 'hermann-goring'),
    ('fascist', 'jacques-doriot'),
    ('fascist', 'joachim-von-ribbentrop'),
    ('fascist', 'joseph-goebbels'),
    ('fascist', 'karl-wolff'),
    ('fascist', 'klaus-barbie'),
    ('fascist', 'oskar-dirlewanger'),
    ('fascist', 'otto-skorzeny'),
    ('fascist', 'pavel-bermondt-avalov'),
    ('fascist', 'radola-gajda'),
    ('fascist', 'reinhard-heydrich'),
    ('fascist', 'rudolf-hess')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_person_collection_members (collection_id, person_id)
VALUES
    ('counterrevolution', 'duong-van-minh'),
    ('counterrevolution', 'kazimierz-sosnkowski'),
    ('counterrevolution', 'lucjan-zeligowski'),
    ('counterrevolution', 'petr-zenkl'),
    ('counterrevolution', 'vang-pao'),
    ('counterrevolution', 'wladyslaw-sikorski')
ON CONFLICT DO NOTHING;

COMMIT;
