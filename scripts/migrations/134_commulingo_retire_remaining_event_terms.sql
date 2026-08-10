-- 사건을 통째로 표제어로 삼은 나머지 네 항목을 정리한다. 132·133과 같은 원칙:
-- 서사는 사건에 두고, 용어 사전에는 사전에서 실제로 찾을 낱말만 남긴다.
--
--   레닌 사후 권력투쟁과 좌익 반대파 (1923~1927)
--     좌익반대파·통합반대파·신반대파·트로이카·일국사회주의가 이미 모두 개별
--     항목으로 있어 새로 만들 것이 없다. 지우고 좌익반대파로 넘긴다.
--   독소 불가침조약과 폴란드 분할 (1939.08~09)
--     제 부모인 「독소불가침조약」과 형제인 「비밀의정서」, 「독소 우호·국경
--     조약」이 이미 있다. 지우고 부모로 넘긴다.
--   소련의 대일 참전과 만주 작전 (1945.08)
--     사건에 없는 낱말은 관동군 하나다. 그것만 새로 세운다.
--   폴란드 연대노조와 계엄 (1980~1981)
--     연대와 그단스크 협정은 낱말이고, 계엄은 사건이다. 앞의 둘만 세운다.
--
-- 크론시타트 봉기와 반알코올 캠페인은 표제어가 사건 제목과 정확히 같아
-- same_subject 짝짓기가 걸린다. 한 페이지의 두 탭으로 붙어 있어 중복으로 보이지
-- 않으므로(대숙청·레닌그라드 사건과 같은 꼴) 그대로 둔다.

BEGIN;

-- 1. 이미 개별 항목이 다 있는 둘은 지우기만 한다.
DELETE FROM commulingo_terms WHERE id IN (
    'the-succession-struggle-and-the-left-opposition-1923-1927',
    'the-nazi-soviet-pact-and-the-partition-of-poland-august-sept'
);

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('term', 'the-succession-struggle-and-the-left-opposition-1923-1927', 'left-opposition',
     '사건 「레닌 사후 권력투쟁과 좌익 반대파」와 겹치던 복합 표제어를 폐기'),
    ('term', 'the-nazi-soviet-pact-and-the-partition-of-poland-august-sept', 'molotov-ribbentrop-pact',
     '사건 「독소 불가침조약과 폴란드 분할」과 겹치던 복합 표제어를 폐기');

-- 2. 만주 작전 쪽: 관동군.
DELETE FROM commulingo_terms WHERE id = 'soviet-entry-into-the-war-against-japan-and-the-manchurian-o';

INSERT INTO commulingo_terms
    (id, sort_order, term_ko, term_en, original,
     period_label, period_ko, period_en, start_year, end_year, category,
     definition_ko, definition_en, body_ko, body_en, sources)
VALUES (
    'kwantung-army', 19565345,
    '관동군', 'Kwantung Army',
    '関東軍 (Kantōgun)',
    '1906–1945', '1906~1945', '1906–1945', 1906, 1945, 'international',
    '러일전쟁으로 얻은 랴오둥반도 조차지(관동주)와 남만주 철도를 지키기 위해 1906년 뤼순에 둔 일본 육군 부대. 1928년 장쭤린 폭살과 1931년 류탸오후 사건처럼 도쿄의 승인 없이 벌인 작전이 잇달아 사후 추인되면서 사실상 독자적인 정치 세력이 되었고, 만주국을 세운 뒤로는 그 나라의 실질적인 통치 기구 노릇을 했다. 소련을 먼저 쳐야 한다는 북진론의 본거지여서 1938년 하산 호와 1939년 할힌골에서 소련군과 부딪쳤고 두 번 다 졌다. 태평양 전쟁이 길어지며 정예 부대와 장비가 남방으로 빠져나간 뒤, 1945년 8월 소련의 만주 작전 앞에서는 두 주를 버티지 못하고 무너졌다.',
    'The Japanese army formation stationed at Port Arthur from 1906 to guard the Kwantung Leased Territory on the Liaodong peninsula and the South Manchuria Railway, both won in the Russo-Japanese War. Operations it launched without Tokyo''s approval, the assassination of Zhang Zuolin in 1928 and the Liutiaohu incident of 1931, were ratified after the fact, and it became in effect a political power of its own; after Manchukuo was founded it governed that state in all but name. As the home of the Strike North doctrine it clashed with Soviet forces at Lake Khasan in 1938 and Khalkhin Gol in 1939, losing both times. Once its best units and equipment had been drawn south by the widening Pacific war, it collapsed in under two weeks against the Soviet Manchurian operation of August 1945.',
    '', '',
    '["Alvin D. Coox, Nomonhan: Japan Against Russia, 1939 (Stanford University Press, 1990)", "Yoshihisa Tak Matsusaka, The Making of Japanese Manchuria, 1904–1932 (Harvard University Asia Center, 2001)", "David M. Glantz, Soviet Operational and Tactical Combat in Manchuria, 1945 (Frank Cass, 2003)"]'::jsonb
);

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('kwantung-army', 'ko', '관동군', 0),
    ('kwantung-army', 'en', 'Kwantung Army', 0);

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
    ('kwantung-army', 'soviet-japanese-border-wars', 0),
    ('kwantung-army', 'manchurian-operation', 1);

INSERT INTO commulingo_term_relations (term_id, related_id, sort_order) VALUES
    ('kwantung-army', 'manchukuo', 0),
    ('kwantung-army', 'battles-of-khalkhin-gol', 1),
    ('kwantung-army', 'battle-of-lake-khasan', 2);

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('term', 'soviet-entry-into-the-war-against-japan-and-the-manchurian-o', 'kwantung-army',
     '사건 「소련의 대일 참전과 만주 작전」과 겹치던 복합 표제어를 관동군으로 대체');

-- 3. 폴란드 쪽: 연대와 그단스크 협정. 계엄은 사건이 맡는다.
DELETE FROM commulingo_terms WHERE id = 'solidarity-and-martial-law-in-poland-1980-1981';

INSERT INTO commulingo_terms
    (id, sort_order, term_ko, term_en, original,
     period_label, period_ko, period_en, start_year, end_year, category,
     definition_ko, definition_en, body_ko, body_en, sources)
VALUES
(
    'solidarnosc', 19565355,
    '연대(솔리다르노시치)', 'Solidarność',
    'Niezależny Samorządny Związek Zawodowy „Solidarność”',
    '1980–1989', '1980~1989', '1980–1989', 1980, 1989, 'international',
    '1980년 8월 그단스크 레닌 조선소 파업에서 태어난 폴란드의 독립자치노동조합. 정식 이름은 「독립자치노동조합 연대」이고, 공산당의 통제를 받지 않는 대중조직으로는 동구권에서 처음이었다. 레흐 바웬사가 이끄는 공장간파업위원회의 21개 요구를 정부가 8월 31일 그단스크 협정으로 받아들이면서 합법화되었고, 1년 만에 조합원이 1천만 명에 이르렀다. 폴란드 통일노동자당 당원 백만 명이 함께 가입할 만큼 당과 사회의 경계가 무너졌다는 점에서, 이 조직은 노동조합인 동시에 체제 문제였다. 1981년 12월 13일 계엄과 함께 불법화되어 지도부가 구금되었으나 지하 조직망으로 살아남았고, 1989년 원탁회의와 6월 4일 반자유선거를 거쳐 동구권 최초의 비공산당 주도 정부를 세웠다.',
    'The independent self-governing trade union born in the strike at the Lenin Shipyard in Gdańsk in August 1980. Its full name was the Independent Self-Governing Trade Union "Solidarity", and it was the first mass organisation in the Eastern bloc outside communist party control. The government accepted the twenty-one demands of the inter-factory strike committee led by Lech Wałęsa in the Gdańsk Agreement of 31 August, legalising the union, and within a year it had ten million members. A million members of the Polish United Workers'' Party joined it as well, which is why it was a question about the system as much as a trade union. Outlawed with the declaration of martial law on 13 December 1981 and its leaders interned, it survived underground, and through the Round Table talks and the semi-free elections of 4 June 1989 it formed the first government in the bloc not led by communists.',
    '', '',
    '["Timothy Garton Ash, The Polish Revolution: Solidarity (Jonathan Cape, 1983)", "Andrzej Paczkowski and Malcolm Byrne (eds.), From Solidarity to Martial Law: The Polish Crisis of 1980–1981 (Central European University Press, 2007)", "Jan Kubik, The Power of Symbols Against the Symbols of Power (Pennsylvania State University Press, 1994)"]'::jsonb
),
(
    'gdansk-agreement', 19565365,
    '그단스크 협정', 'Gdańsk Agreement',
    'Porozumienia sierpniowe',
    '1980', '1980년 8월 31일', '31 August 1980', 1980, 1980, 'international',
    '1980년 8월 31일 그단스크 레닌 조선소에서 폴란드 정부의 미에치스와프 야기엘스키 부총리와 공장간파업위원회 대표 레흐 바웬사가 서명한 합의. 파업위원회가 내건 21개 요구 가운데 핵심이던 당의 통제를 받지 않는 노동조합을 만들 권리와 파업권을 정부가 인정했고, 검열 완화와 정치범 석방, 임금 인상, 토요 휴무 확대도 함께 담겼다. 사회주의 나라의 정부가 제 노동자에게 당 밖의 조직을 문서로 허용한 첫 사례였고, 이 합의에 따라 11월 10일 연대가 정식 등록되었다. 정부는 1981년 12월 계엄으로 이 약속을 사실상 되돌렸다.',
    'The agreement signed at the Lenin Shipyard in Gdańsk on 31 August 1980 by Deputy Prime Minister Mieczysław Jagielski for the Polish government and Lech Wałęsa for the inter-factory strike committee. The government conceded the central items among the strikers'' twenty-one demands, the right to form trade unions outside party control and the right to strike, along with relaxed censorship, the release of political prisoners, wage increases, and more free Saturdays. It was the first document in which a socialist government granted its own workers an organisation outside the party, and under it Solidarity was formally registered on 10 November. Martial law in December 1981 reversed the concession in practice.',
    '', '',
    '["Timothy Garton Ash, The Polish Revolution: Solidarity (Jonathan Cape, 1983)", "Andrzej Paczkowski and Malcolm Byrne (eds.), From Solidarity to Martial Law: The Polish Crisis of 1980–1981 (Central European University Press, 2007)"]'::jsonb
);

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('solidarnosc', 'ko', '연대노조', 0),
    ('solidarnosc', 'ko', '자유노조 연대', 1),
    ('solidarnosc', 'ko', '솔리다르노시치', 2),
    ('solidarnosc', 'ko', '폴란드 연대노조', 3),
    ('solidarnosc', 'en', 'Solidarność', 0),
    ('solidarnosc', 'en', 'NSZZ Solidarność', 1),
    ('solidarnosc', 'en', 'Polish Solidarity', 2),
    ('solidarnosc', 'en', 'Solidarity trade union', 3),
    ('gdansk-agreement', 'ko', '그단스크 협정', 0),
    ('gdansk-agreement', 'ko', '21개 요구', 1),
    ('gdansk-agreement', 'en', 'Gdańsk Agreement', 0),
    ('gdansk-agreement', 'en', 'Gdansk Agreement', 1),
    ('gdansk-agreement', 'en', 'August Agreements', 2);

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
    ('solidarnosc', 'solidarity-martial-law', 0),
    ('solidarnosc', 'revolutions-1989', 1),
    ('gdansk-agreement', 'solidarity-martial-law', 0);

INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
    ('solidarnosc', 'lech-wa-sa', 0),
    ('solidarnosc', 'wojciech-jaruzelski', 1),
    ('gdansk-agreement', 'lech-wa-sa', 0);

INSERT INTO commulingo_term_relations (term_id, related_id, sort_order) VALUES
    ('solidarnosc', 'gdansk-agreement', 0);

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('term', 'solidarity-and-martial-law-in-poland-1980-1981', 'solidarnosc',
     '사건 「폴란드 연대노조와 계엄」과 겹치던 복합 표제어를 연대·그단스크 협정으로 분리');

COMMIT;
