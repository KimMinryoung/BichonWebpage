-- 세 헌법 항목을 「소련 헌법」 하나로 통합하고, 연도별 헌법은 참고 문헌으로 보낸다.
--
-- 1918·1936·1977년 헌법이 각각 사전 항목으로 서 있었다. 셋은 같은 이야기의 세
-- 토막이다. 권력이 어디에 있다고 적었는가, 누가 투표하는가, 당은 헌법 몇 조에
-- 나오는가. 나란히 놓아야 보이는 변화를 각자의 페이지에서는 말할 수 없었고,
-- 세 항목의 정의는 서로를 참조하지 않은 채 같은 이야기를 세 번 시작했다.
--
-- 이제 사전에는 「소련 헌법」 하나가 서서 네 헌법(1918·1924·1936·1977)의 계승과
-- 단절을 다루고, 개별 연도의 헌법은 참고 문헌 서가의 번역 전문으로 바로 간다.
-- 본문의 '1936년 헌법'은 문헌 별칭으로 자동 링크된다. linkify.js의 KIND_ORDER가
-- doc을 term보다 먼저 돌리므로 문헌 별칭이 '소련 헌법' 표제어보다 앞서 잡히고,
-- 연도가 없는 맨 '소련 헌법'만 이 항목으로 온다. 계보도 노드도 문헌을 가리킨다.
--
-- 폐기된 세 id는 commulingo_id_redirects로 통합 항목에 넘긴다. 관계 행은
-- 외래키가 ON DELETE CASCADE라 옛 항목과 함께 사라지므로, 옮길 것은 삭제 뒤에
-- 다시 넣는다.

BEGIN;

INSERT INTO commulingo_terms (
    id, sort_order, term_ko, term_en, original,
    period_ko, period_en, start_year, end_year, category,
    definition_ko, definition_en, body_ko, body_en, sources
) VALUES (
    'soviet-constitution',
    10152,
    '소련 헌법',
    'Soviet constitutions',
    'Конституция СССР',
    '1918–1991년',
    '1918–1991',
    1918,
    1991,
    'party-state',
    '소비에트 국가가 채택한 헌법들. 러시아 소비에트 공화국의 1918년 헌법에서 시작해, 연방 결성을 담은 1924년 헌법, ''승리한 사회주의''를 선언한 1936년 헌법, ''발전된 사회주의''를 선언한 1977년 헌법으로 이어졌다. 모든 권력이 소비에트에 속한다는 원칙은 네 헌법에 공통되지만, 누가 투표하는가, 당이 헌법 어디에 적히는가, 국가를 무엇이라 부르는가는 시기마다 달라졌다.',
    'The constitutions adopted by the Soviet state: the 1918 Constitution of the Russian Soviet Republic, the 1924 constitution that gave the newly formed Union its shape, the 1936 Constitution that declared socialism victorious, and the 1977 Constitution that declared developed socialism achieved. All four vest power in the soviets, but who may vote, where the party appears in the text, and what the state is called change from one to the next.',
    '## 헌법이 네 번 바뀐 까닭은 무엇인가

소비에트 헌법은 통치 기구의 규칙만 적은 문서가 아니었다. 자본주의 국가의 헌법이 주로 권력 기관의 구성과 권한, 그리고 국가가 개인에게 함부로 하지 못할 일을 정한다면, 소비에트 헌법은 거기에 더해 사회 구조와 경제 제도를 함께 규정하고, 서문에서 사회가 어느 단계에 이르렀는지를 선언했다.

그래서 새 헌법은 대개 통치 규칙을 손보려고 나온 것이 아니라, 사회가 다음 단계에 이르렀다고 판단했을 때 나왔다. 소비에트 법학은 헌법을 이미 이룬 것의 기록이자 앞으로 이룰 것의 강령으로 보았고, 두 성격이 한 문서에 겹쳐 있다는 점이 소비에트 헌법을 읽을 때의 출발점이 된다.

## 1. 1918년 헌법: 권력은 소비에트에 있다

10월혁명 이듬해 제5차 전러시아 소비에트 대회가 채택한 러시아 소비에트 공화국의 첫 헌법이다. 소련은 아직 없었다. 연방은 1922년에 결성되므로, 이 헌법이 규율한 것은 러시아 공화국 하나였다.

첫머리에는 「근로 피착취 인민의 권리 선언」이 통째로 실렸다. 토지의 사적 소유 폐지, 은행과 공장의 이전, 일반 노동 의무처럼 혁명이 이미 취한 조치들이 그대로 헌법 조문이 되었다.

뒤의 헌법들과 가장 크게 다른 대목은 선거권이다. 선거는 평등하지 않았다. 전러시아 소비에트 대회의 대의원은 도시 소비에트에서 유권자 2만 5천 명당 1인, 농촌의 현 대회에서 주민 12만 5천 명당 1인의 비율로 뽑혔다(제25조). 노동자의 한 표가 농민의 한 표보다 무거웠다는 뜻이다. 이윤을 목적으로 남을 고용하는 사람, 불로소득으로 사는 사람, 상인, 성직자, 구 경찰과 헌병, 로마노프 황가 사람은 아예 선거권이 없었다(제65조).

당대의 논리는 이러했다. 지금은 계급 투쟁이 끝나지 않은 이행기이고 헌법은 그 이행기의 노동자·빈농 독재를 문서로 옮긴 것이므로(제9조), 막 무너진 착취계급에게 정치적 권리를 돌려줄 이유가 없다는 것이다. 제23조는 아예 혁명에 해가 되는 방식으로 권리를 쓰는 개인과 집단에게서 그 권리를 박탈한다고 명시했다.

## 2. 1924년 헌법: 연방을 만든 문서

1922년의 소련 결성 조약을 헌법으로 옮긴 것이 1924년 헌법이다. 여기에는 공민의 권리 조항이 거의 없다. 연방과 공화국이 무엇을 나누어 맡는지, 탈퇴권을 포함한 공화국의 지위가 어떠한지가 주된 내용이었고, 권리는 각 공화국 헌법의 몫으로 남았다. 소비에트 헌법사에서 이 문서는 새로운 사회를 선언한 헌법이 아니라 연방이라는 형식을 만든 헌법으로 읽힌다. 참고 문헌 서가에는 아직 이 헌법의 번역이 없다.

## 3. 1936년 헌법: 선거권이 넓어지고 당이 헌법에 들어오다

''스탈린 헌법''으로 불린다. 두 가지가 크게 바뀌었다.

하나는 선거다. 차등 선거와 선거권 박탈이 사라지고 보통·평등·직접·비밀 선거가 도입되었다. 소비에트 대회는 폐지되고 연방회의와 민족회의 양원으로 이루어진 최고소비에트가 들어섰다. 내재적 논리는 앞 절과 이어진다. 착취계급이 이미 소멸했다고 선언한 이상, 그들을 겨냥한 정치적 권리 제한을 유지할 근거도 사라진다는 것이다.

다른 하나는 사회적 권리의 명문화다. 노동권, 휴식권, 교육권, 노령과 질병 때 부양받을 권리가 조문이 되었고, 각 권리 옆에는 그것을 무엇으로 보장하는지가 함께 적혔다(제118~121조). 권리를 선언하는 데 그치지 않고 보장 수단을 나란히 적는 이 서술 방식은 이후 여러 나라의 사회주의 헌법이 따랐다.

그리고 제126조에서 소련공산당이 처음으로 헌법에 등장한다. 당은 근로자 단체들의 ''지도적 핵심''으로 규정되었다.

이 헌법을 둘러싼 논쟁의 핵심은 조문과 실제의 간극이다. 채택 이듬해에 대숙청이 정점에 이르렀고, 헌법이 보장한 인신의 불가침(제127조)과 공개 재판은 특별 트로이카의 약식 처리 앞에서 작동하지 않았다. 서구 학계가 이 헌법을 명목뿐인 헌법의 사례로 다루는 논의는 여기서 출발한다. 반면 조문의 상당 부분, 곧 무상 교육과 의료, 여성의 동등한 권리는 실제로 집행되었으며 이 헌법은 소비에트 사회의 자기 인식을 정확히 기록한 문서라는 반론도 함께 있다. 두 평가는 같은 문서의 다른 면을 보고 있다.

## 4. 1977년 헌법: 발전된 사회주의와 제6조

브레즈네프 시기에 채택되어 소련이 해체될 때까지 효력을 지녔다. 서문은 소련에 ''발전된 사회주의 사회''가 건설되었다고 선언하고, 프롤레타리아트 독재의 과업을 완수한 국가를 전인민국가로 규정한다. 계급의 독재를 수행하는 국가에서 전 인민의 국가로 성격 규정이 바뀐 것인데, 이 변경은 채택 당시부터 논쟁거리였다. 중국공산당과 알바니아 노동당은 이를 수정주의의 증거로 비판했고, 소련의 정통 해석은 적대 계급이 사라진 사회에서 국가의 계급적 성격이 달라지는 것은 마르크스주의 국가론의 귀결이라고 답했다.

가장 자주 인용되는 조항은 제6조다. 소련공산당을 ''소비에트 사회의 지도적·향도적 역량이며 그 정치 제도와 국가 기관·사회단체의 핵심''으로 규정했다. 1936년 헌법이 당을 여러 단체의 지도적 핵심으로 적었다면, 이 조항은 당을 국가 기관 위에 놓았다.

1988년부터 1990년 사이의 개헌은 이 구조를 되돌렸다. 인민대의원대회가 신설되고 대통령제가 도입되었으며, 1990년 3월 제6조가 개정되어 당의 독점적 지위가 사라졌다.

## 조문은 아무 힘도 없었는가

소비에트 헌법에는 흔히 문서일 뿐이었다는 평가가 붙는다. 조문이 정치 현실을 구속하지 못한 국면이 많았던 것은 사실이다. 그러나 조문이 뒤늦게 실효를 발휘한 대목도 있다. 1977년 헌법 제72조는 각 연방공화국에 ''소련에서 자유로이 탈퇴할 권리''를 유보해 두었다. 1990년과 1991년에 발트 삼국과 그루지야를 비롯한 공화국들이 독립을 선언하면서 근거로 든 것이 바로 이 조항이었다. 연방의 형식을 갖추려고 넣어 둔 문구가 연방을 푸는 절차의 출발점이 된 셈이다.',
    '## Why four constitutions?

A Soviet constitution was not only a rulebook for the machinery of government. Where a capitalist constitution mostly sets out how organs of power are composed and what the state may not do to a person, a Soviet constitution also fixed the social and economic order, and announced in its preamble how far society had come.

New constitutions therefore appeared not when the rules of government needed adjusting but when the leadership judged that society had reached a new stage. Soviet legal theory treated a constitution as both a record of what had been achieved and a programme for what was still to come, and that doubling is the place to start when reading one.

## 1. 1918: power belongs to the soviets

Adopted by the Fifth All-Russian Congress of Soviets the year after the October Revolution, this was the first constitution of the Russian Soviet Republic. There was as yet no USSR: the Union was formed in 1922, so this text governed the Russian republic alone.

It opens with the whole of the Declaration of Rights of the Working and Exploited People. Measures the revolution had already taken, the abolition of private property in land, the transfer of banks and factories, universal labour duty, became constitutional articles.

What separates it most sharply from its successors is the franchise, which was not equal. Delegates to the All-Russian Congress were returned by city soviets at one per 25,000 voters and by rural provincial congresses at one per 125,000 inhabitants (Article 25): a worker''s vote weighed more than a peasant''s. People who hired others for profit, lived on unearned income, traded privately, served as clergy, or had belonged to the old police, the gendarmerie or the Romanov house had no vote at all (Article 65).

The reasoning of the time ran as follows. This was a transitional period in which the class struggle was not over, and the constitution set down the dictatorship of the workers and poor peasants for that period (Article 9), so there was no reason to restore political rights to the exploiting classes just overthrown. Article 23 went further and withdrew rights from individuals and groups who used them to the detriment of the revolution.

## 2. 1924: the constitution that made a union

The 1924 constitution translated the 1922 treaty of union into constitutional form. It contains almost no articles on citizens'' rights. What it settles is the division of competence between the Union and the republics and the standing of the republics, including the right to secede; rights were left to the constitutions of the individual republics. In the history of Soviet constitutions this one reads as the document that created a federal form rather than one that proclaimed a new society. The reference library does not yet hold a translation of it.

## 3. 1936: a wider franchise, and the party enters the text

Known as the Stalin Constitution. Two things changed substantially.

The first was the franchise. Weighted voting and disenfranchisement disappeared, replaced by universal, equal, direct and secret suffrage. The Congress of Soviets gave way to a bicameral Supreme Soviet of the Soviet of the Union and the Soviet of Nationalities. The internal logic follows from the previous section: once the exploiting classes were declared to have ceased to exist, the restrictions aimed at them had lost their ground.

The second was the codification of social rights. The rights to work, to rest, to education and to maintenance in old age and sickness became articles, each stated together with the means by which it was guaranteed (Articles 118 to 121). This way of writing, a right and its material guarantee side by side, was followed by socialist constitutions elsewhere.

Article 126 brought the Communist Party into a Soviet constitution for the first time, as the "leading core" of the working people''s organisations.

The argument about this constitution turns on the gap between text and practice. The Great Terror reached its height the year after adoption, and the inviolability of the person (Article 127) and open trials counted for nothing before the summary work of the special troikas. This is where the Western scholarly treatment of the document as a sham constitution begins. Against it stands the argument that much of the text, free education and health care, equal rights for women, was in fact carried out, and that the constitution accurately records how Soviet society understood itself. The two verdicts are looking at different faces of the same document.

## 4. 1977: developed socialism and Article 6

Adopted under Brezhnev, in force until the Union dissolved. The preamble declares that a developed socialist society has been built in the USSR and defines the state, having completed the tasks of the dictatorship of the proletariat, as a state of all the people. The redefinition, from a state exercising the dictatorship of a class to a state of the whole people, was contested from the outset: the Chinese and Albanian parties read it as evidence of revisionism, while the orthodox Soviet answer was that in a society without antagonistic classes a change in the class character of the state follows from Marxist theory of the state.

The most quoted provision is Article 6, which made the CPSU "the leading and guiding force of Soviet society and the nucleus of its political system, of all state organisations and public organisations." Where the 1936 text had named the party the leading core of a set of associations, this one placed it above the organs of state.

The amendments of 1988 to 1990 reversed that structure. A Congress of People''s Deputies was created and a presidency introduced, and in March 1990 Article 6 was amended, ending the party''s monopoly position.

## Did the text count for nothing?

Soviet constitutions are often dismissed as paper. It is true that the text failed to bind political reality in many episodes. Yet there are places where it took effect late. Article 72 of the 1977 Constitution reserved to every union republic "the right freely to secede from the USSR." When the Baltic republics, Georgia and others declared independence in 1990 and 1991, that article was the ground they cited. A clause included to complete the federal form became the opening step in the procedure that undid the federation.',
    '["https://www.marxists.org/history/ussr/government/constitution/ — 1918·1936·1977년 헌법 영역 전문", "https://ru.wikisource.org/wiki/Конституция_РСФСР_(1918) — 1918년 헌법 러시아어 원문", "https://ru.wikisource.org/wiki/Конституция_СССР_(1924) — 1924년 연방 헌법 러시아어 원문", "https://ru.wikisource.org/wiki/Конституция_СССР_(1977) — 1977년 헌법 러시아어 원문과 1988~1990년 개정 판본", "https://en.wikipedia.org/wiki/1936_Constitution_of_the_Soviet_Union — 제정 경과, 51.5백만 명이 참여한 전 인민 토의, 제126조", "https://en.wikipedia.org/wiki/1977_Constitution_of_the_Soviet_Union — 전인민국가 규정, 제6조와 1990년 개정"]'::jsonb
);

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('soviet-constitution', 'ko', '소비에트 헌법', 10),
    ('soviet-constitution', 'ko', '소련의 헌법', 20),
    ('soviet-constitution', 'en', 'Soviet constitution', 10),
    ('soviet-constitution', 'en', 'Constitution of the USSR', 20);

-- 세 항목을 지운다. 별칭·관계·인물·사건 행은 ON DELETE CASCADE로 함께 사라진다.
DELETE FROM commulingo_terms
 WHERE id IN ('1918-rsfsr-constitution', '1936-soviet-constitution', '1977-soviet-constitution');

-- 옛 항목이 들고 있던 연결을 통합 항목으로 옮긴다. 1936년 항목의 five-year-plans는
-- 옮기지 않는다. 헌법 하나가 아니라 계획경제 전반에 걸리는 연결이었고, 통합 항목의
-- 본문은 5개년 계획을 다루지 않는다.
INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
    ('soviet-constitution', 'all-peoples-state'),
    ('developed-socialism', 'soviet-constitution'),
    ('historical-materialism', 'soviet-constitution')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_term_people (term_id, person_id) VALUES
    ('soviet-constitution', 'lenin'),
    ('soviet-constitution', 'stalin'),
    ('soviet-constitution', 'brezhnev')
ON CONFLICT DO NOTHING;

INSERT INTO commulingo_term_events (term_id, event_id) VALUES
    ('soviet-constitution', 'great-terror')
ON CONFLICT DO NOTHING;

-- 폐기된 id는 통합 항목으로 넘긴다. 사전 URL은 사전 항목으로 보내고, 연도별
-- 헌법의 전문을 찾아온 독자는 그 항목의 참고 문헌 절에서 세 번역을 만난다.
-- 리다이렉트 표는 지금까지 인물과 직위, 역할 범주만 받았다. 용어를 합치는 일도
-- 같은 종류의 일이므로 entity_type에 'term'을 연다.
ALTER TABLE commulingo_id_redirects
    DROP CONSTRAINT IF EXISTS commulingo_id_redirects_entity_type_check;
ALTER TABLE commulingo_id_redirects
    ADD CONSTRAINT commulingo_id_redirects_entity_type_check
    CHECK (entity_type IN ('person', 'office', 'role-category', 'term'));

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('term', '1918-rsfsr-constitution', 'soviet-constitution', '세 헌법 항목을 「소련 헌법」으로 통합'),
    ('term', '1936-soviet-constitution', 'soviet-constitution', '세 헌법 항목을 「소련 헌법」으로 통합'),
    ('term', '1977-soviet-constitution', 'soviet-constitution', '세 헌법 항목을 「소련 헌법」으로 통합')
ON CONFLICT DO NOTHING;

COMMIT;
