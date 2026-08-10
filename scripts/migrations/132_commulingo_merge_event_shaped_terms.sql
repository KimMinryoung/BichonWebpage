-- 사건과 같은 것을 두 번 등록한 용어를 정리한다.
--
-- 결손 큐가 사건 본문에서 뽑아낸 표제어를 그대로 용어로 만든 탓에, 「소련-일본
-- 국경 전쟁과 중립조약 (1938~1941)」처럼 사건 제목에 연도만 붙인 항목이 용어
-- 사전에 생겼다. 사건 쪽에 이미 같은 서술이 있으니 독자에게는 같은 내용이 두
-- 항목으로 보인다. 게다가 표제어 끝의 괄호 때문에 사건 제목과 글자가 달라
-- same_subject 자동 짝짓기도 걸리지 않아, 한 페이지의 두 탭이 아니라 서로
-- 경쟁하는 두 페이지가 되었다.
--
-- 서사는 사건 쪽에 두고, 용어 사전에는 하산 호 전투·할힌골 전투·중립조약처럼
-- 실제로 사전에서 찾을 만한 개별 항목만 남긴다. 자동 링크는 용어 별칭에만
-- 걸리므로(사건은 링크 대상이 아니다) 별칭은 새 항목들이 나눠 물려받는다.

BEGIN;

-- 1. 사건과 겹치는 복합 표제어를 지운다. 별칭·인물·사건 링크는 CASCADE로 함께
--    사라진다.
DELETE FROM commulingo_terms
WHERE id = 'soviet-japanese-border-wars-and-the-neutrality-pact-1938-1941';

-- 2. 그 자리에 개별 용어 셋을 등록한다.
INSERT INTO commulingo_terms
    (id, sort_order, term_ko, term_en, original,
     period_label, period_ko, period_en, start_year, end_year, category,
     definition_ko, definition_en, body_ko, body_en, sources)
VALUES
(
    'battle-of-lake-khasan', 19565305,
    '하산 호 전투', 'Battle of Lake Khasan',
    'Хасанские бои / 張鼓峰事件',
    '1938', '1938년 7~8월', 'July–August 1938', 1938, 1938, 'international',
    '1938년 7월 29일부터 8월 11일까지 소련·만주국·조선의 국경이 만나는 자오제르나야 고지(중국·일본 이름 장고봉)에서 벌어진 국경 전투. 조선주둔군 소속 일본군 제19사단이 고지를 점령하자 소련 제39소총병군단이 8월 2일부터 반격해 고지를 되찾았고, 8월 11일 휴전이 성립했다. 소련군 792명, 일본군 526명이 전사했다. 관동군이 아니라 조선주둔군이 일으킨 충돌이었다는 점, 그리고 두 달 뒤 소련 극동전선 사령관 바실리 블류헤르 원수가 지휘 혼란을 이유로 체포되어 고문 끝에 사망했다는 점에서, 이 전투는 대숙청 직후 소련군의 상태를 드러낸 사건으로도 읽힌다.',
    'A border battle fought from 29 July to 11 August 1938 over Zaozernaya Heights (known in Chinese and Japanese as Changkufeng), where the Soviet, Manchukuoan, and Korean frontiers met. The Japanese 19th Division of the Korea Army seized the heights; the Soviet 39th Rifle Corps counterattacked from 2 August and retook them, and a ceasefire took effect on 11 August. Soviet dead: 792; Japanese dead: 526. That the clash was started by the Korea Army rather than the Kwantung Army, and that Marshal Vasily Blyukher, commander of the Soviet Far Eastern Front, was arrested two months later for his confused handling of it and died under torture, make the battle a reading of the Red Army''s condition in the immediate wake of the Great Purge.',
    '', '',
    '["Alvin D. Coox, The Anatomy of a Small War: The Soviet-Japanese Struggle for Changkufeng/Khasan, 1938 (Greenwood Press, 1977)", "Grigoriy Krivosheev, Soviet Casualties and Combat Losses in the Twentieth Century (Greenhill Books, 1997)"]'::jsonb
),
(
    'battles-of-khalkhin-gol', 19565315,
    '할힌골 전투', 'Battles of Khalkhin Gol',
    'Бои на Халхин-Голе / ノモンハン事件',
    '1939', '1939년 5~9월', 'May–September 1939', 1939, 1939, 'international',
    '1939년 5월부터 9월까지 몽골인민공화국 동부 할하 강(몽골어로 할힌골) 일대에서 소련·몽골 연합군과 일본 관동군·만주국군이 벌인 사단급 전투. 일본에서는 가까운 마을 이름을 따 노몬한 사건이라 부른다. 5월 국경 순찰대의 소규모 충돌로 시작해 7월 일본군의 도하 공세를 거쳐, 8월 20일 게오르기 주코프가 병력 5만 7천, 전차 498대, 항공기 557대로 총공세에 나섰다. 중앙에서 보병이 일본군을 붙들어 두는 동안 기갑부대가 양익으로 돌아 들어가는 이중 포위로 8월 31일까지 일본군 제23사단이 섬멸되었다. 소련·몽골군 전사·실종 9,703명, 일본군 전사 8,629명. 이 패배로 일본 육군 안에서 소련을 치자는 북진론이 무너지고 남진론이 자리를 잡았으며, 주코프가 여기서 처음 실행한 이중 포위 기동은 뒷날 스탈린그라드에서 되풀이된다.',
    'Division-scale fighting from May to September 1939 along the Khalkhin Gol (Halha River) in eastern Mongolia, between Soviet and Mongolian forces on one side and the Kwantung Army and Manchukuoan troops on the other. Japan named it the Nomonhan Incident after a nearby village. It began with small clashes between border patrols in May, passed through a Japanese river crossing in July, and culminated on 20 August when Georgy Zhukov attacked with 57,000 troops, 498 tanks, and 557 aircraft. Infantry pinned the Japanese in the centre while armour swung around both flanks, and the double envelopment destroyed the Japanese 23rd Division by 31 August. Soviet and Mongolian dead and missing: 9,703; Japanese dead: 8,629. The defeat broke the Imperial Japanese Army''s Strike North faction in favour of Strike South, and the double envelopment Zhukov first executed here was repeated at Stalingrad.',
    '', '',
    '["Alvin D. Coox, Nomonhan: Japan Against Russia, 1939 (Stanford University Press, 1990)", "Stuart D. Goldman, Nomonhan, 1939: The Red Army''s Victory That Shaped World War II (Naval Institute Press, 2012)", "Grigoriy Krivosheev, Soviet Casualties and Combat Losses in the Twentieth Century (Greenhill Books, 1997)"]'::jsonb
),
(
    'soviet-japanese-neutrality-pact', 19565325,
    '소련-일본 중립조약', 'Soviet-Japanese Neutrality Pact',
    'Пакт о нейтралитете между СССР и Японией / 日ソ中立条約',
    '1941–1945', '1941~1945', '1941–1945', 1941, 1945, 'international',
    '1941년 4월 13일 모스크바에서 일본 외상 마쓰오카 요스케와 소련 외상 뱌체슬라프 몰로토프가 서명한 5년 기한의 중립 조약. 한쪽이 제3국의 공격을 받으면 다른 쪽은 그 분쟁 내내 중립을 지킨다는 것이 요지이고, 부속 선언에서 소련은 만주국의, 일본은 몽골인민공화국의 영토 보전을 존중하기로 했다. 할힌골에서의 패배로 북진론이 무너진 일본과 서쪽 국경을 걱정하던 소련의 이해가 맞물린 결과였다. 두 달 뒤 독일이 소련을 침공했을 때 일본은 조약을 지켜 참전하지 않았고, 스탈린은 극동의 사단들을 모스크바 방어로 돌릴 수 있었다. 소련은 1945년 4월 5일 조약 파기를 통보하고 8월 9일 대일전에 들어갔다.',
    'A five-year neutrality treaty signed in Moscow on 13 April 1941 by Japanese Foreign Minister Yosuke Matsuoka and Soviet Foreign Minister Vyacheslav Molotov. Each side undertook to remain neutral for the duration of any conflict in which the other was attacked by a third power, and an attached declaration had the USSR respect the territorial integrity of Manchukuo and Japan that of the Mongolian People''s Republic. It matched a Japan whose Strike North faction had been broken at Khalkhin Gol with a USSR watching its western frontier. When Germany invaded two months later, Japan honoured the pact and stayed out, and Stalin was able to move Far Eastern divisions to the defence of Moscow. The USSR denounced the pact on 5 April 1945 and entered the war against Japan on 9 August.',
    '', '',
    '["Boris Slavinsky, The Japanese-Soviet Neutrality Pact: A Diplomatic History 1941–1945 (Routledge, 2003)", "Stuart D. Goldman, Nomonhan, 1939: The Red Army''s Victory That Shaped World War II (Naval Institute Press, 2012)"]'::jsonb
);

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('battle-of-lake-khasan', 'ko', '하산 호 전투', 0),
    ('battle-of-lake-khasan', 'ko', '하산호 전투', 1),
    ('battle-of-lake-khasan', 'ko', '장고봉 사건', 2),
    ('battle-of-lake-khasan', 'ko', '장고봉 전투', 3),
    ('battle-of-lake-khasan', 'en', 'Battle of Lake Khasan', 0),
    ('battle-of-lake-khasan', 'en', 'Lake Khasan', 1),
    ('battle-of-lake-khasan', 'en', 'Changkufeng Incident', 2),
    ('battles-of-khalkhin-gol', 'ko', '할힌골 전투', 0),
    ('battles-of-khalkhin-gol', 'ko', '할힌골', 1),
    ('battles-of-khalkhin-gol', 'ko', '노몬한 사건', 2),
    ('battles-of-khalkhin-gol', 'ko', '노몬한 전투', 3),
    ('battles-of-khalkhin-gol', 'en', 'Battles of Khalkhin Gol', 0),
    ('battles-of-khalkhin-gol', 'en', 'Battle of Khalkhin Gol', 1),
    ('battles-of-khalkhin-gol', 'en', 'Khalkhin Gol', 2),
    ('battles-of-khalkhin-gol', 'en', 'Nomonhan Incident', 3),
    ('soviet-japanese-neutrality-pact', 'ko', '소련-일본 중립조약', 0),
    ('soviet-japanese-neutrality-pact', 'ko', '일소 중립조약', 1),
    ('soviet-japanese-neutrality-pact', 'ko', '소일 중립조약', 2),
    ('soviet-japanese-neutrality-pact', 'en', 'Soviet-Japanese Neutrality Pact', 0),
    ('soviet-japanese-neutrality-pact', 'en', 'Japanese-Soviet Neutrality Pact', 1);

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
    ('battle-of-lake-khasan', 'soviet-japanese-border-wars', 0),
    ('battles-of-khalkhin-gol', 'soviet-japanese-border-wars', 0),
    ('soviet-japanese-neutrality-pact', 'soviet-japanese-border-wars', 0),
    ('soviet-japanese-neutrality-pact', 'manchurian-operation', 1);

INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
    ('battle-of-lake-khasan', 'vasily-blyukher', 0),
    ('battles-of-khalkhin-gol', 'zhukov', 0),
    ('soviet-japanese-neutrality-pact', 'molotov', 0),
    ('soviet-japanese-neutrality-pact', 'stalin', 1);

INSERT INTO commulingo_term_relations (term_id, related_id, sort_order) VALUES
    ('battle-of-lake-khasan', 'battles-of-khalkhin-gol', 0),
    ('battles-of-khalkhin-gol', 'soviet-japanese-neutrality-pact', 0),
    ('battles-of-khalkhin-gol', 'manchukuo', 1);

-- 3. 하루 살아 있던 복합 표제어의 주소는 할힌골 항목으로 보낸다.
INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('term', 'soviet-japanese-border-wars-and-the-neutrality-pact-1938-1941',
     'battles-of-khalkhin-gol',
     '사건 「소련-일본 국경 전쟁과 중립조약」과 겹치던 복합 표제어를 개별 용어로 분리');

COMMIT;
