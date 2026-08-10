-- 홀로도모르: 사건 항목의 중복 용어를 개별 표제어로 바꾸고, 「의도적으로 유발한
-- 민족 절멸」이라는 해석이 학계의 다수설인 것처럼 읽히던 대목을 고친다.
--
-- 1932~1933년 기근이 정책이 부른 재난이라는 데는 이견이 거의 없지만, 그것이
-- 우크라이나인을 민족으로서 겨냥한 집단학살이었는가는 지금도 갈리는 쟁점이다.
-- 사건 쪽 연표의 12월 14일 법령 항목은 제노사이드론의 독법을 사실처럼 단정하고
-- 있었고, 총평은 30여 개국의 승인만 나열해 정치적 결의와 사학사의 다수 견해가
-- 구분되지 않았다. 양쪽 논거를 함께 싣는다.
--
-- 용어 쪽은 사건 제목을 그대로 옮긴 「홀로도모르와 집단화 기근 (1932~1933)」을
-- 버리고, 사전에서 실제로 찾을 낱말인 「홀로도모르」만 남긴다. 서사는 사건에
-- 두고, 용어에는 이름의 유래와 해석 논쟁을 담는다.

BEGIN;

-- 1. 개별 표제어 「홀로도모르」.
INSERT INTO commulingo_terms
    (id, sort_order, term_ko, term_en, original,
     period_label, period_ko, period_en, start_year, end_year, category,
     definition_ko, definition_en, body_ko, body_en, sources)
VALUES (
    'holodomor', 19565335,
    '홀로도모르', 'Holodomor',
    'Голодомор',
    '1932–1933', '1932~1933', '1932–1933', 1932, 1933, 'repression',
    '1932년부터 1933년까지 소비에트 우크라이나를 덮친 대기근을 가리키는 우크라이나어 낱말. 굶주림을 뜻하는 голод와 몰살을 뜻하는 мор을 합친 말로, 기근 당시가 아니라 1980년대에 자리 잡았다. 강제 집단화와 감당할 수 없는 곡물 공출 할당이 기근을 불렀다는 데는 사실상 이견이 없고, 우크라이나에서만 350만~390만 명이 굶어 죽은 것으로 추계된다. 다만 이 낱말은 사건과 함께 「우크라이나 민족을 겨냥한 의도적 절멸」이라는 해석까지 담고 있어, 그 해석의 타당성을 두고 학계가 갈린다. 문서고 사료를 다룬 다수 연구는 기근을 카자흐스탄·볼가·북캅카스까지 덮친 전 소련적 재난으로 보고 민족 절멸 계획의 증거는 확인되지 않는다고 보며, 제노사이드론은 우크라이나 의회와 30여 개국 의회의 결의로 뒷받침되지만 학계에서는 소수 견해에 가깝다.',
    'The Ukrainian word for the famine that struck Soviet Ukraine in 1932 and 1933, formed from holod (hunger) and mor (extermination, plague). It was not current during the famine itself but took hold in the 1980s. That forced collectivisation and unmeetable grain procurement quotas produced the famine is essentially undisputed, and demographic work puts excess deaths in Ukraine alone at 3.5 to 3.9 million. The word carries an interpretation as well as an event, however: that the famine was a deliberate extermination aimed at Ukrainians as a nation. Scholarship divides on that reading. Most archive-based work treats the famine as a Union-wide catastrophe that also devastated Kazakhstan, the Volga, and the North Caucasus, and finds no document establishing a plan to destroy Ukrainians as a nation; the genocide reading is affirmed by the Ukrainian parliament and by some thirty other legislatures, but remains a minority position among historians.',
    '## 이 낱말은 어디서 왔나

홀로도모르는 기근을 겪은 사람들이 쓰던 말이 아니다. 소련 당국은 1987년 말까지 기근의 존재 자체를 공식적으로 부인했고, 그동안 북아메리카의 우크라이나 이민 사회에서 이 기근을 부르는 이름이 다듬어졌다. голод(굶주림)와 мор(몰살)을 합친 이 낱말은 1980년대에 널리 퍼졌고, 1991년 독립 뒤 우크라이나의 공식 명칭이 되었다.

그래서 이 말은 처음부터 두 가지를 함께 담고 있다. 하나는 1932~1933년에 실제로 일어난 일, 다른 하나는 그 일을 우크라이나 민족을 겨눈 의도적 절멸로 읽는 해석이다. 사실과 해석이 한 낱말에 붙어 있다는 점이, 이 항목의 논쟁이 좀처럼 정리되지 않는 이유의 하나다.

## 몇 명이 죽었나

인구학 연구는 대체로 우크라이나의 초과 사망을 350만~390만 명으로 본다. 소련 전체로는 1930~1933년에 500만~700만 명 규모다. 같은 시기 카자흐스탄에서는 약 150만 명이 죽어 카자흐인 인구의 3분의 1 가까이가 사라졌는데, 비율로만 보면 소련에서 가장 큰 피해였다. 볼가 중·하류, 북캅카스, 서시베리아의 곡창지대도 함께 굶었다. 2003년 25개국이 유엔에 낸 공동 성명은 700만~1,000만 명을 언급했으나, 문서고 자료로 인구를 다시 계산한 연구들은 이 수치를 과대 추정으로 본다.

## 왜 해석이 갈리는가

**의도치 않은 재앙으로 보는 쪽.** 로버트 데이비스와 스티븐 휘트크로프트는 『기아의 해』(2004)에서, 스탈린 지도부의 정책은 「그릇되었으나」 기근은 그들이 예상하지도 원하지도 않은 결과였다고 본다. 마크 타우거는 1932년 수확 자체가 공식 통계보다 훨씬 나빴다는 점(병해, 잡초, 기상)을 강조한다. 아치 게티는 우크라이나인을 민족으로서 절멸시키라는 지시를 담은 문서가 문서고에서 확인되지 않는다는 점을 든다. 이들은 공출 할당이 1932년 가을부터 여러 차례 하향 조정되었고 종자·식량 대여가 이루어졌다는 점, 그리고 기근이 민족 경계를 따라가지 않고 곡창지대를 따라갔다는 점을 근거로 삼는다.

**제노사이드로 보는 쪽.** 로버트 콘퀘스트의 『슬픔의 수확』(1986)은 기근이 우크라이나 민족운동을 분쇄하기 위한 고의적 정책이었다고 주장했고, 라파엘 렘킨은 1953년 강연에서 이를 「소비에트 제노사이드의 전형」이라 불렀다. 최근에는 티머시 스나이더와 앤 애플바움이 1932년 말의 조치들, 곧 마을 블랙리스트, 국경 봉쇄, 우크라이나화 정책의 역전이 겹친 시점을 들어 우크라이나를 겨눈 의도가 이때 형성되었다고 본다. 다만 콘퀘스트 자신은 만년에 데이비스와의 서신에서, 스탈린이 기근을 「일부러 일으켰다」기보다 막을 수 있었는데도 소련의 이해를 앞세워 방치했다는 쪽으로 표현을 고쳤다.

**가운데에 서는 쪽.** 안드레아 그라치오지는 기근의 발생은 집단화와 공출의 산물이었지만, 일단 굶주림이 시작된 뒤로는 그것이 우크라이나 농민의 저항과 민족운동을 꺾는 데 선택적으로 이용되었다고 정리한다. 기근의 계급적 차원과 민족적 차원을 함께 붙잡는 이 해석은 오늘날 연구에서 가장 널리 받아들여지는 절충이다.

쟁점은 사람이 얼마나 죽었는가가 아니라 무엇을 노렸는가다. 어느 해석을 따르더라도 곡물이 굶주리는 마을에서 계속 실려 나갔고, 이동이 봉쇄되었으며, 모스크바가 구호 요청에 답하지 않았다는 사실은 달라지지 않는다.

## 의회의 결의는 무엇을 정하는가

2006년 우크라이나 최고라다는 홀로도모르를 우크라이나 민족에 대한 집단학살로 규정하는 법을 통과시켰고, 이후 30개국 이상과 유럽의회가 같은 취지의 결의를 채택했다. 2008년 러시아 국가두마는 「경제·정치적 목표를 위해 국민의 생명을 경시한」 체제를 규탄하면서도 기근의 우크라이나 특수성은 인정하지 않았다.

이런 결의는 의회의 정치적 판단이지 사학사의 결론이 아니다. 특히 2014년 이후 우크라이나와 러시아의 관계 속에서 이 문제는 외교 사안이 되었고, 승인국 수의 증가는 학계의 합의가 아니라 그 외교의 결과에 가깝다. 두 층위를 구분하지 않으면 「30개국이 인정했으니 학계도 그렇게 본다」는 잘못된 추론에 이르기 쉽다.',
    '## Where the word comes from

Holodomor was not the word used by the people who lived through the famine. Soviet authorities officially denied that it had happened at all until late 1987, and in the meantime the name took shape among Ukrainian emigre communities in North America. Formed from holod (hunger) and mor (extermination), it spread in the 1980s and became Ukraine''s official designation after independence in 1991.

The word therefore carries two things at once: the events of 1932 and 1933, and a reading of those events as a deliberate extermination aimed at Ukrainians as a nation. That fact and interpretation travel together in a single word is one reason the argument never quite settles.

## How many died

Demographic studies generally put excess deaths in Ukraine at 3.5 to 3.9 million, and Union-wide deaths for 1930 to 1933 at 5 to 7 million. In the same years roughly 1.5 million died in Kazakhstan, close to a third of the Kazakh population, proportionally the heaviest loss anywhere in the USSR. The middle and lower Volga, the North Caucasus, and western Siberia starved alongside Ukraine. A joint statement submitted to the UN by 25 countries in 2003 cited 7 to 10 million deaths; work that recalculates the population from archival records treats that range as inflated.

## Why the interpretations differ

**The unintended catastrophe.** In *The Years of Hunger* (2004) Robert Davies and Stephen Wheatcroft argue that the Stalin leadership''s policies were "wrongheaded" but that the famine was neither expected nor wanted by them. Mark Tauger stresses that the 1932 harvest itself was far worse than official figures show, owing to plant disease, weeds, and weather. J. Arch Getty notes that no document ordering the destruction of Ukrainians as a nation has emerged from the archives. This position rests on the fact that procurement quotas were revised downward several times from autumn 1932, that seed and food loans were issued, and that the famine followed the grain-growing regions rather than national boundaries.

**The genocide reading.** Robert Conquest''s *The Harvest of Sorrow* (1986) argued that the famine was a deliberate policy to break the Ukrainian national movement, and Raphael Lemkin in a 1953 lecture called it "the classic example of Soviet genocide." More recently Timothy Snyder and Anne Applebaum point to the convergence of measures in late 1932, the village blacklists, the sealing of the borders, and the reversal of Ukrainisation, as the moment at which an intent aimed at Ukraine took form. Conquest himself, however, later told Davies in correspondence that he did not hold that Stalin "purposely inflicted" the famine, but that he could have prevented it and put Soviet interest ahead of feeding the starving.

**The middle position.** Andrea Graziosi holds that the famine arose from collectivisation and procurement, but that once hunger had set in it was selectively instrumentalised to break peasant resistance and Ukrainian nationalism. Capturing both the class and the national dimension, this is the most widely accepted compromise in current scholarship.

The dispute is not about how many died but about what was intended. On any of these readings, grain continued to leave starving villages, movement was sealed off, and Moscow did not answer the appeals for relief.

## What a parliamentary resolution settles

In 2006 Ukraine''s Verkhovna Rada passed a law defining the Holodomor as genocide against the Ukrainian people, and more than thirty states and the European Parliament have since adopted resolutions to the same effect. In 2008 the Russian State Duma condemned a regime that "neglected the lives of people for the achievement of economic and political goals" while declining to accept that the famine was specifically Ukrainian.

These are political judgements by legislatures, not conclusions of historiography. Since 2014 in particular the question has become a matter of diplomacy between Ukraine and Russia, and the growing count of recognising states reflects that diplomacy rather than a scholarly consensus. Keeping the two levels apart avoids the false inference that thirty parliaments settle what historians dispute.',
    '["Robert W. Davies and Stephen G. Wheatcroft, The Years of Hunger: Soviet Agriculture, 1931–1933 (Palgrave Macmillan, 2004)", "Andrea Graziosi, ''The Soviet 1931–1933 Famines and the Ukrainian Holodomor: Is a New Interpretation Possible?'', Harvard Ukrainian Studies 27 (2004–2005)", "Robert Conquest, The Harvest of Sorrow: Soviet Collectivisation and the Terror-Famine (Oxford University Press, 1986)", "Anne Applebaum, Red Famine: Stalin''s War on Ukraine (Doubleday, 2017)", "Mark B. Tauger, ''The 1932 Harvest and the Famine of 1933'', Slavic Review 50:1 (1991)", "Sarah Cameron, The Hungry Steppe: Famine, Violence, and the Making of Soviet Kazakhstan (Cornell University Press, 2018)", "Nicolas Werth, ''The Great Ukrainian Famine of 1932-33'' (Sciences Po, Mass Violence and Resistance, 2008)", "Oleh Wolowyna et al., ''Regional variations of 1932–34 famine losses in Ukraine'', Canadian Studies in Population 43 (2016)"]'::jsonb
);

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
    ('holodomor', 'ko', '홀로도모르', 0),
    ('holodomor', 'ko', '홀로도모르 대기근', 1),
    ('holodomor', 'ko', '우크라이나 대기근', 2),
    ('holodomor', 'ko', '1932-1933년 우크라이나 대기근', 3),
    ('holodomor', 'en', 'Holodomor', 0),
    ('holodomor', 'en', 'the Holodomor', 1),
    ('holodomor', 'en', 'Ukrainian famine', 2),
    ('holodomor', 'en', 'Ukrainian famine of 1932–1933', 3),
    ('holodomor', 'en', 'Great Ukrainian Famine', 4);

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
    ('holodomor', 'holodomor', 0),
    ('holodomor', 'five-year-plans', 1);

INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
    ('holodomor', 'stalin', 0),
    ('holodomor', 'molotov', 1),
    ('holodomor', 'kaganovich', 2),
    ('holodomor', 'postyshev', 3),
    ('holodomor', 'vlas-chubar', 4),
    ('holodomor', 'grigory-petrovsky', 5);

INSERT INTO commulingo_term_relations (term_id, related_id, sort_order) VALUES
    ('holodomor', 'collectivization', 0),
    ('holodomor', 'dekulakization', 1),
    ('holodomor', 'kulak', 2),
    ('holodomor', 'ukrainizatsiya', 3);

-- 2. 사건 제목을 그대로 옮긴 복합 표제어를 버리고 주소를 넘긴다.
DELETE FROM commulingo_terms
WHERE id = 'the-holodomor-and-the-collectivisation-famine-1932-1933';

INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note) VALUES
    ('term', 'the-holodomor-and-the-collectivisation-famine-1932-1933', 'holodomor',
     '사건 「홀로도모르와 집단화 기근」과 겹치던 복합 표제어를 낱말 항목으로 정리');

-- 3. 사건 연표: 12월 14일 법령을 「기근과 민족 문제가 결합된 결정적 문서」라고
--    단정하던 대목에 반론을 함께 싣는다.
UPDATE commulingo_history_events
SET timeline = (
    SELECT jsonb_agg(
        CASE WHEN item->>'date' = '1932.12.14'
            THEN jsonb_set(jsonb_set(item,
                '{body,ko}', to_jsonb('스탈린과 몰로토프가 서명한 비밀 법령이 우크라이나와 북캅카스의 곡물 공출 완수를 독려하는 동시에, ''페틀류라 분자들과 부르주아 민족주의자들''을 당과 소비에트 기관에서 제거하고 우크라이나화 정책을 시정할 것을 지시한다. 제노사이드론을 펴는 연구자들은 이 문서를 기근과 민족 문제가 맞물린 증거로 든다. 반대쪽에서는 같은 법령이 북캅카스(쿠반)에도 나란히 적용되었고 지시의 중심이 공출 실적에 있었다는 점을 들어, 민족을 표적으로 삼은 증거로 읽기는 어렵다고 본다.'::text)),
                '{body,en}', to_jsonb('A secret decree signed by Stalin and Molotov demands fulfilment of grain procurement plans in Ukraine and the North Caucasus while ordering the removal of "Petlyurites and bourgeois nationalists" from Party and Soviet institutions and the correction of Ukrainisation policy. Historians who argue for genocide cite this document as evidence that the famine and the national question were joined. Others note that the same decree applied equally to the North Caucasus (the Kuban) and that its focus was procurement performance, and hold that it cannot be read as evidence of national targeting.'::text))
            ELSE item
        END ORDER BY ord)
    FROM jsonb_array_elements(timeline) WITH ORDINALITY AS t(item, ord)
),
    outcome_ko = '홀로도모르는 우크라이나 인구 구조에 돌이킬 수 없는 타격을 남겼다. 1926~1939년 사이 소비에트 우크라이나 인구 증가율은 6.6%에 그친 반면 RSFSR은 16.9% 증가했고, 우크라이나 민족 인구는 약 10% 감소했다. 1933년 5월 스탈린 지도부는 고정된 현물세 제도를 도입하며 무제한적 공출을 중단했고, 1933년 풍작으로 기근은 가라앉았다. 그러나 기근의 기억은 소련 붕괴 때까지 공론장에서 철저히 배제되었고, 1980년대 말 글라스노스트 이후에야 문서고가 개방되며 학문적 규명이 시작되었다. 이 기근을 무엇이라 부를 것인가는 아직 결론이 나지 않았다. 2006년 우크라이나 의회는 홀로도모르를 우크라이나 민족에 대한 집단학살로 규정했고 이후 30개국 이상이 같은 취지의 결의를 채택했으나, 이는 의회의 정치적 판단이지 사학사의 합의가 아니다. 문서고 사료를 다룬 연구의 다수는 다른 그림을 그린다. 로버트 데이비스와 스티븐 휘트크로프트는 스탈린 지도부의 정책이 그릇되었으나 기근은 그들이 예상하지도 원하지도 않은 결과였다고 보고, 마크 타우거는 1932년 수확 자체가 공식 통계보다 훨씬 나빴다는 점을, 아치 게티는 우크라이나인을 민족으로서 절멸시키라는 지시가 문서고에서 확인되지 않는다는 점을 든다. 기근은 우크라이나만의 일도 아니어서, 같은 시기 카자흐스탄에서는 카자흐인의 3분의 1 가까이가 죽어 비율로는 가장 큰 피해를 입었고 볼가와 북캅카스, 서시베리아도 함께 굶었다. 제노사이드론의 출발점이었던 로버트 콘퀘스트조차 만년에는 스탈린이 기근을 일부러 일으켰다기보다 막을 수 있었는데도 소련의 이해를 앞세워 방치했다는 쪽으로 표현을 고쳤다. 오늘날 가장 널리 받아들여지는 것은 안드레아 그라치오지의 절충으로, 기근의 발생은 집단화와 공출의 산물이었으나 일단 굶주림이 시작된 뒤에는 그것이 우크라이나 농민의 저항과 민족운동을 꺾는 데 선택적으로 이용되었다는 해석이다. 2008년 러시아 국가두마는 ''경제·정치적 목표를 위해 국민의 생명을 경시한 체제''라고 규탄하면서도 기근의 우크라이나 특수성은 인정하지 않았다. 어느 해석을 따르든, 굶주리는 마을에서 곡물이 계속 실려 나갔고 농민의 이동이 봉쇄되었으며 모스크바가 구호 요청에 답하지 않았다는 사실은 달라지지 않는다.',
    outcome_en = 'The Holodomor left an irreversible mark on Ukraine''s demographic structure. Between 1926 and 1939 the population of Soviet Ukraine grew by only 6.6%, while the RSFSR grew by 16.9%; the ethnic Ukrainian population declined by roughly 10%. In May 1933 the Stalin leadership introduced a fixed in-kind tax system, ending unlimited requisitioning, and a bumper 1933 harvest brought the famine to a close. Yet memory of the famine was rigorously excluded from public discourse until the late-1980s glasnost era, when archives opened and scholarly investigation became possible. What to call the famine remains unsettled. In 2006 the Ukrainian parliament recognised the Holodomor as genocide against the Ukrainian people, and more than thirty states have since passed resolutions to the same effect, but these are political judgements by legislatures rather than a settled finding of historiography. Most archive-based scholarship draws a different picture. Robert Davies and Stephen Wheatcroft hold that the leadership''s policies were wrongheaded but that the famine was neither expected nor wanted by them; Mark Tauger stresses that the 1932 harvest was far worse than official figures show; J. Arch Getty notes that no order to destroy Ukrainians as a nation has emerged from the archives. Nor was the famine confined to Ukraine: in the same years close to a third of the Kazakh population died, proportionally the heaviest loss in the USSR, and the Volga, the North Caucasus, and western Siberia starved as well. Even Robert Conquest, whose work launched the genocide argument, later revised his formulation to say that Stalin did not purposely inflict the famine but could have prevented it and put Soviet interest ahead of feeding the starving. The most widely accepted position today is Andrea Graziosi''s compromise: the famine arose from collectivisation and procurement, but once hunger had set in it was selectively instrumentalised to break peasant resistance and Ukrainian nationalism. In 2008 the Russian State Duma condemned a regime that "neglected the lives of people for the achievement of economic and political goals" while declining to accept the specifically Ukrainian character of the famine. On any of these readings, grain continued to leave starving villages, peasant movement was sealed off, and Moscow did not answer the appeals for relief.',
    updated_at = now()
WHERE id = 'holodomor';

COMMIT;
