-- 218: the world shelf of the people page sorted by era, like the Soviet one.
--
-- The Soviet shelf reads as a sequence (1905 → 1991) and the China shelf was
-- built the same way (migration 182), but everyone else sat in three camp
-- groups with no time axis: 비소련 혁명가 held 407 people from 62 countries,
-- born 1760–1957, so Saint-Simon, Luxemburg and Guevara shared one list, and
-- 소련을 상대한 정치가들 / 비소련 반혁명 진영 split the rest by side.
-- Camp is no longer the group's job: the primary activity carries function
-- and affiliation, and the position collections (반혁명 세력, 반체제 인사, ...)
-- carry the side. So the three camp groups become three era groups:
--
--   world-before-1917  1820–1917  early socialism, the Internationals, the
--                                 Paris Commune and the imperial age
--   world-interwar     1917–1945  the revolutionary wave, the Comintern era,
--                                 fascism and the Second World War
--   world-cold-war     1945–현재   people's democracies, decolonization,
--                                 the Cold War and after
--
-- An era before 1871 alone would have held 16 people, so it is part of the
-- first group. Assignment follows the Soviet shelf rule: the era in which the
-- public role a person is in the dictionary for peaked, not birth or death
-- (Hindenburg and Pétain interwar, Luxemburg with Liebknecht in the German
-- revolution, Bevin and MacArthur after 1945). 732 people, reviewed from each
-- epithet, primary activity and bio on 2026-09-30.
--
-- 이 역사를 연구한 사람들 (scholar) stays: it is not a camp but later
-- scholarship about the history, the same line the event pages draw between
-- the 'historian' relation and contemporaries.
--
-- Retired ids 301 to the era group that received most of their people.
-- The leninbot classifier (commulingo/classify.py GROUP_RULES/GROUP_ERAS)
-- offers the new ids from the same day.

BEGIN;
SET LOCAL lock_timeout = '5s';

INSERT INTO commulingo_people_groups
    (id, shelf, sort_order, range_label, title_ko, title_en, blurb_ko, blurb_en)
VALUES
    ('world-before-1917', 'world', 96, '1820–1917',
     '인터내셔널과 제국의 시대', 'The age of the Internationals and empires',
     '초기 사회주의와 1848년, 제1·제2인터내셔널과 파리 코뮌의 사회주의자와 아나키스트, 그리고 그들이 맞선 제국 시대의 정치가와 장군들.',
     'Early socialists and 1848, the socialists and anarchists of the First and Second Internationals and the Paris Commune, and the statesmen and generals of the imperial age they confronted.'),
    ('world-interwar', 'world', 97, '1917–1945',
     '혁명의 물결과 세계대전', 'The revolutionary wave and the world war',
     '10월 혁명 뒤 유럽과 아시아로 번진 혁명의 물결, 코민테른 시대의 공산주의자와 사회주의자, 전간기 각국의 정치가, 파시즘과 스페인 내전, 제2차 세계대전의 지도자와 지휘관들.',
     'The revolutionary wave that spread from October across Europe and Asia, the communists and socialists of the Comintern era, interwar statesmen, fascism and the Spanish Civil War, and the leaders and commanders of the Second World War.'),
    ('world-cold-war', 'world', 98, '1945–현재',
     '냉전과 탈식민', 'The Cold War and decolonization',
     '인민민주주의 국가와 그 개혁가·반체제 인사, 탈식민과 민족해방 운동, 냉전기 각국의 정치가와 반공 정권, 1956·1968·1989년과 그 이후의 사람들.',
     'The people''s democracies with their reformers and dissidents, decolonization and national liberation, Cold War statesmen and anti-communist regimes, 1956, 1968, 1989 and after.');

UPDATE commulingo_people_groups SET sort_order = 99, updated_at = NOW() WHERE id = 'scholar';

-- 47 people
UPDATE commulingo_people SET group_id = 'world-before-1917', updated_at = NOW()
 WHERE group_id IN ('international-revolutionary', 'foreign-statesmen', 'international-counterrevolutionary')
   AND id IN (
    'adolphe-thiers', 'alexander-berkman', 'alexander-parvus', 'alexander-potresov', 'august-bebel',
    'bogd-khan', 'camille-huysmans', 'charles-delescluze', 'charles-fourier', 'connolly',
    'dimitar-blagoev', 'eduard-bernstein', 'elisabeth-dmitrieff', 'elizabeth-gurley-flynn',
    'emile-vandervelde', 'emma-goldman', 'etienne-cabet', 'eugene-pottier', 'eugene-v-debs',
    'eugene-varlin', 'ferdinand-lassalle', 'franz-mehring', 'friedrich-engels', 'fyodor-dan',
    'gustave-courbet', 'gustave-herve', 'henri-de-saint-simon', 'jaroslaw-dabrowski', 'jean-jaures',
    'jules-guesde', 'karl-kautsky', 'karl-marx', 'keir-hardie', 'leo-frankel',
    'louis-auguste-blanqui', 'louise-michel', 'martov', 'mikhail-bakunin', 'patrice-de-mac-mahon',
    'paul-lafargue', 'pavel-akselrod', 'prosper-olivier-lissagaray', 'pyotr-kropotkin',
    'robert-owen', 'victor-adler', 'wilhelm-liebknecht', 'zetkin');

-- 331 people
UPDATE commulingo_people SET group_id = 'world-interwar', updated_at = NOW()
 WHERE group_id IN ('international-revolutionary', 'foreign-statesmen', 'international-counterrevolutionary')
   AND id IN (
    'aarno-sakari-yrjo-koskinen', 'adolf-hitler', 'aime-doumenc', 'aimo-cajander', 'alan-brooke',
    'albert-kesselring', 'albert-lebrun', 'alexander-shapiro', 'alexander-vandegrift',
    'alexandros-koryzis', 'alexandros-svolos', 'alfred-jodl', 'alfred-rosmer', 'amadeo-bordiga',
    'andre-marty', 'andreu-nin', 'andrievs-niedra', 'andrija-hebrang', 'angelica-balabanova',
    'anna-louise-strong', 'antanas-smetona', 'anton-pannekoek', 'antoni-chrusciel',
    'apostolos-santas', 'aris-velouchiotis', 'arkadi-maslow', 'arso-jovanovic', 'arthur-crispien',
    'arthur-harris', 'arthur-henderson', 'august-thalheimer', 'augustinas-voldemaras',
    'augusto-cesar-sandino', 'balingiin-tserendorj', 'bela-kun', 'benito-mussolini',
    'bernard-montgomery', 'bertolt-brecht', 'bertram-ramsay', 'berty-albrecht', 'boris-souvarine',
    'buenaventura-durruti', 'c-l-r-james', 'carl-gustaf-emil-mannerheim', 'carl-manner',
    'charles-de-gaulle', 'charles-delestraint', 'charles-huntziger', 'charles-maurras',
    'charles-tillon', 'chester-w-nimitz', 'christopher-woodhouse', 'cipriano-mera', 'cordell-hull',
    'damdin-sukhbaatar', 'dietrich-von-choltitz', 'dimitrov', 'dino-grandi', 'dolores-ibarruri',
    'draza-mihailovic', 'dusan-simovic', 'dwight-d-eisenhower', 'earl-browder', 'edmund-myers',
    'edouard-daladier', 'edward-raczynski', 'elbegdorj-rinchino', 'eljas-erkko', 'emil-eichhorn',
    'erich-raeder', 'erich-von-manstein', 'erik-heinrichs', 'ernst-daeumig', 'ernst-toller',
    'eugen-levine', 'farabundo-marti', 'federica-montseny', 'feliks-kon', 'fernand-loriot',
    'francisco-franco', 'francois-coty', 'francois-de-la-rocque', 'frank-jack-fletcher',
    'franklin-d-roosevelt', 'franz-halder', 'frederick-lindemann', 'friedrich-ebert',
    'friedrich-paulus', 'fritz-platten', 'galeazzo-ciano', 'george-c-marshall',
    'george-ii-of-greece', 'george-orwell', 'george-s-patton', 'georgios-papagos',
    'georgios-papandreou', 'georgios-siantos', 'giacinto-menotti-serrati', 'giuseppe-castellano',
    'gjergj-kokoshi', 'gotthard-heinrici', 'gramsci', 'grigory-voitinsky', 'gustav-landauer',
    'gustav-noske', 'guy-moquet', 'gyorgy-lukacs', 'hans-von-manteuffel-szoege', 'harry-haywood',
    'harry-hopkins', 'harry-pollitt', 'heinrich-brandler', 'heinrich-himmler',
    'heinrich-von-vietinghoff', 'heinz-guderian', 'heinz-reinefarth', 'helmuth-weidling',
    'henk-sneevliet', 'henri-frenay', 'henri-rol-tanguy', 'henry-beeuwkes', 'herbert-hoover',
    'hermann-goring', 'hermann-hoth', 'hermann-muller', 'hideki-tojo', 'hirohito', 'hirota-koki',
    'hjalmar-siilasvuo', 'hotsumi-ozaki', 'hugh-dowding', 'hugh-lincoln-cooper', 'hugo-eberlein',
    'hugo-haase', 'ioannis-metaxas', 'ion-antonescu', 'isoroku-yamamoto', 'iuliu-maniu',
    'ivan-subasic', 'ivanoe-bonomi', 'jaan-anvelt', 'jaan-tonisson', 'jacques-doriot',
    'jakub-berman', 'james-p-cannon', 'james-stagg', 'jan-dabski', 'jean-chiappe',
    'jean-de-lattre-de-tassigny', 'jean-moulin', 'jimmy-durrant', 'joachim-von-ribbentrop',
    'joaquin-maurin', 'johan-laidoner', 'john-gort', 'john-p-lucas', 'john-reed', 'jose-diaz',
    'joseph-goebbels', 'jozef-pilsudski', 'juan-modesto', 'juan-negrin', 'juan-pujol-garcia-garbo',
    'jukka-rangell', 'julian-besteiro', 'julian-marchlewski', 'julio-antonio-mella',
    'kanji-ishiwara', 'kantaro-suzuki', 'karl-doenitz', 'karl-korsch', 'karl-wolff',
    'karlis-ulmanis', 'kazimierz-sosnkowski', 'keith-park', 'khorloogiin-choibalsan',
    'kim-alexandra-petrovna', 'kim-chaek', 'kim-jong-suk', 'kim-san', 'kim-won-bong',
    'klaus-barbie', 'koco-tashko', 'konoe-fumimaro', 'konstantin-pats', 'konstantinos-maniadakis',
    'kurt-eisner', 'kyosti-kallio', 'largo-caballero', 'leo-jogiches', 'leo-lagrange', 'leon-blum',
    'leon-daudet', 'leon-jouhaux', 'liebknecht', 'lucjan-zeligowski', 'ludovic-oscar-frossard',
    'luigi-longo', 'luis-carlos-prestes', 'luis-emilio-recabarren', 'luxemburg',
    'mamoru-shigemitsu', 'manuel-azana', 'marceau-pivert', 'marcel-cachin', 'mariategui',
    'mark-w-clark', 'masanobu-tsuji', 'maurice-gamelin', 'maurice-thorez', 'max-hoffmann',
    'max-von-baden', 'maxime-weygand', 'maximilian-von-weichs', 'michael-i-of-romania',
    'michal-kalecki', 'michitaro-komatsubara', 'mikhail-borodin', 'mitsuru-ushijima', 'mn-roy',
    'mu-chong', 'najati-sidqi', 'naotake-sato', 'napoleon-zervas', 'nazim-hikmet', 'nestor-makhno',
    'neville-chamberlain', 'nurija-pozderac', 'nykyfor-hryhoriv', 'omar-bradley',
    'oskar-dirlewanger', 'otozo-yamada', 'otto-braun', 'otto-skorzeny', 'paavo-talvela',
    'paul-levi', 'paul-reynaud', 'paul-robeson', 'paul-von-hindenburg', 'pavel-bermondt-avalov',
    'pavlo-skoropadskyi', 'pehr-evind-svinhufvud', 'peko-dapcevic', 'peter-ii-of-yugoslavia',
    'petre-dumitrescu', 'philipp-scheidemann', 'philippe-leclerc-de-hauteclocque',
    'philippe-petain', 'pierre-georges', 'pierre-laval', 'pierre-taittinger', 'pietro-badoglio',
    'prince-paul-of-yugoslavia', 'pyotr-vologodsky', 'radola-gajda', 'rajani-palme-dutt',
    'ramsay-macdonald', 'raoul-van-overstraeten', 'raymond-a-spruance', 'reginald-drax',
    'reinhard-heydrich', 'rene-bousquet', 'richard-muller', 'risto-ryti', 'robert-grimm',
    'robert-murphy', 'robert-touchon', 'roger-salengro', 'ronald-scobie', 'rudiger-von-der-goltz',
    'rudolf-hess', 'rudolf-luters', 'rudolf-walden', 'ruth-fischer', 'sadao-araki', 'sanzo-nosaka',
    'segismundo-casado', 'seishiro-itagaki', 'sen-katayama', 'soliin-danzan', 'solly-zuckerman',
    'stanislav-cecek', 'stanislaw-bulak-balachowicz', 'stanislaw-grabski', 'stefan-rowecki',
    'stepan-bandera', 'sylvia-pankhurst', 'symon-petliura', 'tadamichi-kuribayashi',
    'tadeusz-bor-komorowski', 'tan-malaka', 'thalmann', 'togo-shigenori', 'tomas-garrigue-masaryk',
    'trafford-leigh-mallory', 'tseren-ochiryn-dambadorj', 'vaino-tanner', 'vaino-voionmaa',
    'vasil-kolarov', 'vernon-kellogg', 'vicente-rojo', 'victor-emmanuel-iii', 'viktor-kingissepp',
    'vincas-kapsukas', 'vincent-badie', 'vittorio-ambrosio', 'volin', 'volodymyr-vynnychenko',
    'waldemar-pabst', 'walter-benjamin', 'walter-lyman-brown', 'walter-model', 'web-du-bois',
    'wilhelm-groener', 'wilhelm-keitel', 'wilhelm-ritter-von-leeb', 'willi-muenzenberg',
    'william-d-leahy', 'william-n-haskell', 'william-seeds', 'william-sholto-douglas',
    'william-z-foster', 'winston-churchill', 'wladyslaw-sikorski', 'yakov-slashchov',
    'yevhen-konovalets', 'yi-dong-hwi', 'yoshijiro-umezu', 'yosuke-matsuoka', 'zigfrids-meierovics',
    'zigmas-angarietis');

-- 354 people
UPDATE commulingo_people SET group_id = 'world-cold-war', updated_at = NOW()
 WHERE group_id IN ('international-revolutionary', 'foreign-statesmen', 'international-counterrevolutionary')
   AND id IN (
    'abdul-fattah-ismail', 'adam-michnik', 'adam-rapacki', 'adlai-stevenson',
    'agostinho-mendes-de-carvalho', 'agostinho-neto', 'ahmad-shah-massoud', 'aime-cesaire',
    'albert-tevoedjre', 'aleksandar-rankovic', 'aleksander-zawadzki', 'ali-abdullah-saleh',
    'ali-ahmed-nasser-antar', 'ali-nasir-muhammad', 'ali-salem-al-beidh', 'alina-pienkowska',
    'allen-dulles', 'alois-indra', 'alois-mock', 'ana-pauker', 'andras-hegedus', 'andre-milongo',
    'andrzej-gwiazda', 'angela-davis', 'anna-walentynowicz', 'annamarie-doherr', 'anthony-eden',
    'antonin-novotny', 'antonin-zapotocky', 'arnaldo-ochoa', 'arthur-lundahl', 'atnafu-abate',
    'babrak-karmal', 'balazs-nagy', 'bao-dai', 'bela-kiraly', 'bela-kovacs', 'bernard-kolelas',
    'bogdan-borusewicz', 'boleslaw-bierut', 'bongho-nouarra', 'boris-kidric', 'brent-scowcroft',
    'cabral', 'carlos-marighella', 'carlos-rocha-dilolwa', 'chae-byeong-deok', 'charles-e-bohlen',
    'charles-vanik', 'che-guevara', 'cho-mansik', 'choe-chang-ik', 'choe-yong-gon', 'chris-hani',
    'christian-de-castries', 'claudia-jones', 'clement-attlee', 'conrado-benitez', 'curtis-e-lemay',
    'czeslaw-kiszczak', 'dean-rusk', 'denis-sassou-nguesso', 'didier-ratsiraka', 'diego-cordovez',
    'dn-aidit', 'douglas-macarthur', 'dubcek', 'eduardo-mondlane', 'edvard-benes', 'edvard-kardelj',
    'edward-almond', 'edward-gierek', 'edward-lansdale', 'edward-ochab', 'edward-stettinius',
    'egon-krenz', 'elena-ceausescu', 'enrico-berlinguer', 'enver-hoxha', 'erich-honecker',
    'erich-mielke', 'ernest-a-gross', 'ernest-bevin', 'ernest-kombo', 'erno-gero', 'ernst-bloch',
    'ernst-reuter', 'eugenio-reale', 'fanon', 'ferenc-donath', 'ferenc-nagy', 'ferenc-vida',
    'fidel-castro', 'frantisek-kriegel', 'friedrich-ebert-jr', 'fulgencio-batista', 'gabor-peter',
    'gail-halvorsen', 'george-ball', 'george-f-kennan', 'george-h-w-bush', 'george-padmore',
    'george-shultz', 'georges-bidault', 'georges-thierry-dargenlieu', 'gerald-ford',
    'gerard-c-smith', 'gerhard-schurer', 'geza-jeszenszky', 'geza-losonczy',
    'gheorghe-gheorghiu-dej', 'grace-lee-boggs', 'gunter-schabowski', 'gus-hall', 'gustav-husak',
    'gyula-horn', 'hafizullah-amin', 'haidar-abu-bakr-al-attas', 'haile-fida', 'haile-selassie-i',
    'han-chae-dok', 'harald-jager', 'harry-s-truman', 'helmut-kohl', 'heng-samrin', 'henri-navarre',
    'henry-kissinger', 'henry-m-jackson', 'henryka-krzywonos', 'herbert-marcuse',
    'herbert-vere-evatt', 'ho-chi-minh', 'ho-hon', 'ho-ka-i', 'hoang-van-hoan', 'hubert-ripka',
    'hun-sen', 'hussein-kulmiye-afrah', 'iko-carreira', 'imre-pozsgay', 'ion-iliescu',
    'istvan-bibo', 'istvan-dobi', 'ivan-ribar', 'jacek-kuron', 'jack-matlock', 'jacques-duclos',
    'james-baker', 'james-f-byrnes', 'james-webb', 'jan-ludwiczak', 'jan-masaryk',
    'jan-nowak-jezioranski', 'jan-palach', 'jan-patocka', 'jan-rulewski', 'janos-kadar',
    'jarallah-omar', 'jaroslav-seifert', 'jawaharlal-nehru', 'jerzy-borowczak', 'jimmy-carter',
    'jiri-hajek', 'joaquim-chissano', 'john-f-kennedy', 'john-foster-dulles', 'john-j-mccloy',
    'john-mccone', 'john-paul-ii', 'jose-eduardo-dos-santos', 'jose-ramon-fernandez',
    'jose-van-dunem', 'josef-pavel', 'josef-smrkovsky', 'josip-broz-tito', 'jozef-cyrankiewicz',
    'jozsef-revai', 'jozsef-szilagyi', 'juho-kusti-paasikivi', 'julius-nyerere', 'kang-kon',
    'karoly-grosz', 'kaysone-phomvihane', 'khieu-samphan', 'kim-il-sung', 'kim-jong-il',
    'kim-tu-bong', 'klement-gottwald', 'koci-xoxe', 'konrad-adenauer', 'kwame-nkrumah',
    'laszlo-rajk', 'laszlo-tokes', 'le-duan', 'le-duc-tho', 'lech-walesa', 'leszek-balcerowicz',
    'llewellyn-thompson', 'louis-althusser', 'lubomir-strougal', 'lucio-lara', 'lucius-d-clay',
    'ludvik-svoboda', 'ludvik-vaculik', 'ludwig-erhard', 'lumumba', 'lyndon-b-johnson',
    'manandafy-rakotonirina', 'marian-jurczyk', 'marian-rybicki', 'marien-ngouabi', 'markus-wolf',
    'mathieu-kerekou', 'matyas-rakosi', 'maurice-ahanhanzo-glele', 'maurice-bishop',
    'maxwell-taylor', 'mcgeorge-bundy', 'mengistu-haile-mariam', 'micheline-ravololonarisoa',
    'mieczyslaw-jagielski', 'mieczyslaw-rakowski', 'mihaly-farkas', 'miklos-gimes', 'miklos-nemeth',
    'milada-horakova', 'milan-kundera', 'milovan-djilas', 'mohamed-siad-barre',
    'mohammad-ali-samatar', 'mohammad-daoud-khan', 'mohammad-najibullah', 'monja-jaona', 'nagy',
    'nako-spiru', 'nam-il', 'ngo-dinh-diem', 'nguyen-thi-binh', 'nguyen-van-thieu',
    'nicephore-soglo', 'nicolae-ceausescu', 'nikola-petkov', 'nito-alves', 'norodom-sihanouk',
    'nouhak-phoumsavan', 'nuon-chea', 'nur-muhammad-taraki', 'oldrich-cernik', 'oliver-p-smith',
    'omer-nishani', 'ota-sik', 'otto-grotewohl', 'pak-hon-yong', 'pal-maleter', 'pascal-lissouba',
    'paul-nitze', 'paulo-teixeira-jorge', 'pavel-auersperg', 'pen-sovann', 'petar-mladenov',
    'peter-fryer', 'petr-zenkl', 'petru-groza', 'pham-van-dong', 'pierre-mendes-france',
    'piotr-jaroszewicz', 'pol-pot', 'pramoedya-ananta-toer', 'radovan-richta', 'ramiz-alia',
    'raul-castro', 'raya-dunayevskaya', 'rezso-nyers', 'richard-heyser', 'richard-nixon',
    'richard-ratsimandrava', 'robert-f-kennedy', 'robert-mcnamara', 'rodric-braithwaite',
    'roman-bartoszcze', 'roman-brandstaetter', 'roman-fideliski', 'ronald-reagan', 'rudolf-slansky',
    'ruth-first', 'saleh-muslih-qasim', 'salvador-allende', 'samora-machel', 'sandor-kopacsi',
    'sankara', 'santiago-carrillo', 'saparmurat-niyazov', 'sita-valles', 'son-sann',
    'souphanouvong', 'souvanna-phouma', 'sreten-zujovic', 'stanislaw-hejmowski', 'stanislaw-kania',
    'stanislaw-matyja', 'stanislaw-mikolajczyk', 'stefan-staszewski', 'stefan-wyszynski',
    'syngman-rhee', 'tadeusz-fiszbach', 'tadeusz-mazowiecki', 'tafari-benti', 'ted-sorensen',
    'teohari-georgescu', 'thomas-brimelow', 'to-huu', 'todor-zhivkov', 'togliatti',
    'tokuda-kyuichi', 'tony-cliff', 'traicho-kostov', 'truong-chinh', 'u-thant', 'urho-kekkonen',
    'vaclav-havel', 'vaclav-klaus', 'vaclav-nosek', 'van-tien-dung', 'vang-pao', 'vasil-bilak',
    'vasile-luca', 'vasile-milea', 'victor-stanculescu', 'viktor-mihaly-orban', 'viliam-salgovic',
    'vladimir-bakaric', 'vladimir-clementis', 'vladimir-putin', 'vladimir-velebit',
    'vo-nguyen-giap', 'vo-van-kiet', 'walter-rodney', 'walter-stoessel', 'walter-ulbricht',
    'wilhelm-pieck', 'william-h-tunner', 'william-k-harrison-jr', 'william-l-clayton',
    'william-westmoreland', 'willy-brandt', 'wladyslaw-gomulka', 'wojciech-jaruzelski',
    'yeo-un-hyeong', 'yumjaagiin-tsedenbal', 'zbigniew-brzezinski', 'zdenek-fierlinger',
    'zdenek-mlynar', 'zdzislaw-kurowski', 'zoltan-tildy');

-- Anyone added to a retired group after this file was drafted stops the
-- migration instead of being dropped with the group.
DO $$
DECLARE left_over text;
BEGIN
    SELECT string_agg(id, ', ') INTO left_over FROM commulingo_people
     WHERE group_id IN ('international-revolutionary', 'foreign-statesmen', 'international-counterrevolutionary');
    IF left_over IS NOT NULL THEN
        RAISE EXCEPTION 'people still in retired world groups: %', left_over;
    END IF;
END $$;

DELETE FROM commulingo_people_groups
 WHERE id IN ('international-revolutionary', 'foreign-statesmen', 'international-counterrevolutionary');

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note)
VALUES
    ('people-group', 'international-revolutionary', 'world-cold-war', 'migration 218: world shelf sorted by era'),
    ('people-group', 'foreign-statesmen', 'world-interwar', 'migration 218: world shelf sorted by era'),
    ('people-group', 'international-counterrevolutionary', 'world-interwar', 'migration 218: world shelf sorted by era')
ON CONFLICT (entity_type, from_id) DO UPDATE SET to_id = EXCLUDED.to_id, note = EXCLUDED.note;

COMMIT;
