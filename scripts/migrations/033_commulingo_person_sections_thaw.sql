-- 033: Person detail sections for seven Thaw-era figures who had none:
-- sakharov, korolev, gagarin, solzhenitsyn, suslov, shepilov, varlam-shalamov.
-- Two narrative sections per person, bilingual ko/en, markdown bodies, real sources.
-- Idempotent: ON CONFLICT (person_id, slug) DO UPDATE; every insert guarded by
-- WHERE EXISTS on commulingo_people.

-- ============================================================
-- 안드레이 사하로프 / Andrei Sakharov (1921–1989)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'sakharov', 'semipalatinsk-1953', 0,
    '1953년 8월 12일, 세미팔라틴스크의 섬광',
    'August 12, 1953: The Flash over Semipalatinsk',
    $body$1953년 8월 12일 새벽, 카자흐스탄 세미팔라틴스크 실험장 위로 소련 최초의 수소폭탄 RDS-6s가 섬광을 뿜었다. 핵분열 물질과 융합 연료를 겹겹이 쌓은 이른바 「슬로이카(층쌓기 케이크)」 설계의 핵심 착상을 내놓은 사람은 서른두 살의 물리학자 안드레이 사하로프였다. 그는 1948년 이고리 탐의 그룹에 합류한 이래 열핵무기 이론에 몰두했고, 실험 성공 직후 소련 과학아카데미 역사상 가장 젊은 축에 드는 정회원으로 선출됐다.

미국이 히로시마와 나가사키로 핵 독점을 과시하던 시대에, 소련의 수소폭탄은 일방적 핵 위협의 시대를 끝내고 전략적 균형을 세운 사건이었다. 사하로프 자신도 당시에는 이 일을 평화를 지키는 노동으로 이해했고, 1955년의 2단계 열핵폭탄 RDS-37 실험까지 설계의 중심에 서 있었다. 국가는 그에게 사회주의노력영웅 칭호를 세 차례 수여했다.

그러나 바로 그 실험들이 그를 다른 길로 이끌었다. 그는 1950년대 후반 대기권 핵실험의 방사성 낙진이 문턱값 없이 세계 인구에 누적 피해를 준다는 계산을 발표했고, 1961년 초대형 폭탄 실험 재개를 둘러싸고 흐루쇼프와 공개적으로 충돌했다. 대기권·수중·우주 핵실험을 금지한 1963년 모스크바 조약의 성립에는 실험 당사자였던 사하로프의 집요한 문제 제기가 한몫을 했다. 무기를 만든 손이 무기를 묶는 조약을 도운 셈이었다.$body$,
    $body$At dawn on August 12, 1953, the first Soviet hydrogen bomb, RDS-6s, flashed over the Semipalatinsk test site in Kazakhstan. The core idea of the so-called "sloika" (layer cake) design, alternating fission material and fusion fuel, came from a thirty-two-year-old physicist, Andrei Sakharov. He had worked on thermonuclear theory since joining Igor Tamm's group in 1948, and shortly after the test he was elected a full member of the Academy of Sciences, among the youngest in its history.

In an era when the United States had displayed its nuclear monopoly at Hiroshima and Nagasaki, the Soviet hydrogen bomb ended the age of one-sided nuclear threat and established strategic balance. Sakharov himself understood the work at the time as labor in defense of peace, and he remained at the center of design through the 1955 test of the two-stage thermonuclear device RDS-37. The state made him a Hero of Socialist Labour three times.

Yet those very tests led him elsewhere. In the late 1950s he published calculations showing that radioactive fallout from atmospheric testing inflicted cumulative, no-threshold harm on the world's population, and in 1961 he clashed openly with Khrushchev over the resumption of giant test explosions. The 1963 Moscow treaty banning tests in the atmosphere, underwater, and in space owed something to the persistent objections of Sakharov, a man who had conducted the tests himself. The hands that built the weapon helped bind it.$body$,
    $$["David Holloway, Stalin and the Bomb: The Soviet Union and Atomic Energy, 1939-1956 (Yale University Press, 1994)","Andrei Sakharov, Memoirs, trans. Richard Lourie (Knopf, 1990)","Gennady Gorelik with Antonina W. Bouis, The World of Andrei Sakharov: A Russian Physicist's Path to Freedom (Oxford University Press, 2005)","A. D. Sakharov, Radioactive Carbon from Nuclear Explosions and Nonthreshold Biological Effects, Soviet Journal of Atomic Energy 4 (1958)","Treaty Banning Nuclear Weapon Tests in the Atmosphere, in Outer Space and Under Water (Moscow, August 5, 1963)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'sakharov', 'gorky-to-congress-1989', 1,
    '1989년 6월, 인민대의원대회의 연단에서',
    'June 1989: At the Rostrum of the Congress of People''s Deputies',
    $body$1968년 사하로프는 논문 「진보, 평화공존, 지적 자유에 관한 성찰」을 지하출판으로 내놓았고, 그 글은 그해 7월 뉴욕타임스에 전문이 실렸다. 핵전쟁의 공멸 위험 앞에서 자본주의와 사회주의가 서로의 장점을 흡수하며 수렴해야 한다는 주장이었다. 그는 즉시 무기 연구에서 배제됐고, 1970년 인권위원회를 공동 창설하며 반체제 인사의 길로 들어섰다. 1975년 노벨평화상을 받았으나 출국이 허용되지 않아 아내 옐레나 본네르가 대신 수상했고, 1980년 1월 아프가니스탄 개입을 공개 비판한 직후 재판 없이 고리키시로 유형됐다. 7년의 유형은 1986년 12월, 고르바초프가 직접 전화를 걸어 모스크바 귀환을 청하면서 끝났다.

1989년 봄 그는 과학아카데미 몫의 인민대의원으로 선출됐고, 제1차 인민대의원대회의 연단에 거듭 올랐다. 당의 지도적 역할을 규정한 헌법 6조의 폐지와 「권력에 관한 법령」을 요구하던 그는 야유와 박수를 동시에 받았고, 아프가니스탄 전쟁에 관한 발언 때는 회의장의 성난 함성에 말이 묻히기도 했다. 그는 지역간대의원그룹의 공동의장이 되어 합법적 야당의 초석을 놓았고, 그해 12월 14일 새 헌법 초안을 다듬던 중 심장마비로 숨졌다.

이 아카이브는 그의 도덕적 진지함을 있는 그대로 기록한다. 그는 안락한 특권 대신 양심을 택했고, 개별 수감자들의 이름을 하나하나 부르며 싸웠다. 동시에 그의 정치 강령은 비판적으로 평가할 필요가 있다. 그가 꿈꾼 것은 강한 사회보장을 갖춘 수렴형 사회였으나, 그의 권위가 정당성을 실어 준 정치 흐름은 그의 사후 소련 해체와 1990년대의 충격요법으로 귀착했다. 산업 붕괴와 평균수명의 급락이라는 그 결과는 사하로프 자신의 인도주의적 전망과 정면으로 배치되는 것이었다.$body$,
    $body$In 1968 Sakharov released his essay "Reflections on Progress, Peaceful Coexistence, and Intellectual Freedom" in samizdat, and that July the New York Times printed it in full. Facing the risk of mutual annihilation, he argued, capitalism and socialism should converge, each absorbing the other's strengths. He was immediately removed from weapons work, co-founded the Human Rights Committee in 1970, and entered the dissident path. He received the Nobel Peace Prize in 1975 but was not allowed to travel, so his wife Yelena Bonner accepted it; in January 1980, immediately after he publicly condemned the intervention in Afghanistan, he was exiled without trial to the city of Gorky. Seven years of exile ended in December 1986 when Gorbachev personally telephoned and invited him back to Moscow.

In the spring of 1989 he was elected a People's Deputy on the Academy of Sciences slate and mounted the rostrum of the First Congress of People's Deputies again and again. Demanding the repeal of Article 6, which enshrined the party's leading role, and a "Decree on Power", he drew jeers and applause at once; when he spoke on the Afghan war, angry shouting from the hall drowned out his words. He became a co-chairman of the Inter-Regional Deputies Group, laying a cornerstone for legal opposition, and died of heart failure on December 14, 1989, while working on a draft of a new constitution.

This archive records his moral seriousness as it was. He chose conscience over comfortable privilege and fought for individual prisoners by name. At the same time, his political program needs critical assessment. What he envisioned was a convergent society with strong social guarantees, yet the political current his authority helped legitimize ended, after his death, in the dissolution of the USSR and the shock therapy of the 1990s. That outcome, industrial collapse and a plunge in life expectancy, stood in direct contradiction to Sakharov's own humanist vision.$body$,
    $$["Andrei Sakharov, Reflections on Progress, Peaceful Coexistence, and Intellectual Freedom (1968; full text in the New York Times, July 22, 1968)","Andrei Sakharov, Memoirs, trans. Richard Lourie (Knopf, 1990)","The Nobel Peace Prize 1975, nobelprize.org/prizes/peace/1975/","Richard Lourie, Sakharov: A Biography (Brandeis University Press, 2002)","First Congress of People's Deputies of the USSR, stenographic record (Moscow, 1989)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- 세르게이 코롤료프 / Sergei Korolev (1907–1966)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'korolev', 'arrest-kolyma-1938', 0,
    '1938년 6월 27일, 체포와 콜리마',
    'June 27, 1938: Arrest and Kolyma',
    $body$세르게이 코롤료프는 1931년 모스크바의 반응추진연구그룹(GIRD)에서 로켓 개발을 시작한 개척자 세대였다. 1933년 8월 GIRD는 소련 최초의 액체연료 계열 로켓 GIRD-09를 쏘아 올렸고, 그해 통합된 반응추진연구소(RNII)에서 코롤료프는 부소장을 맡아 유익 비행체와 로켓 글라이더를 설계했다. 서른 살이 되기 전에 그는 이미 소련 로켓공학의 중심 인물 중 하나였다.

대테러는 이 연구소도 비껴가지 않았다. 소장 클레이묘노프와 랑게마크가 처형되고 발렌틴 글루시코가 체포된 뒤, 1938년 6월 27일 코롤료프도 「반혁명 조직 가담」 혐의로 체포됐다. 그는 구타 속에 조작된 혐의를 시인했고 10년형을 선고받아 콜리마의 말디야크 금광으로 보내졌다. 그곳에서 그는 괴혈병으로 이빨을 잃고 죽음의 문턱까지 갔다. 이 아카이브는 이를 에두르지 않고 기록한다. 코롤료프의 체포는 무고한 것이었고, 대테러가 소비에트 과학에 입힌 손실의 상징적 사례였다.

1939년 재심이 결정되어 그는 콜리마에서 소환됐고, 형기는 8년으로 감형되어 투폴레프가 이끄는 수감 설계국 TsKB-29, 이른바 샤라시카에서 복역하게 됐다. 그는 그곳에서 Tu-2 폭격기 작업에 참여했고, 1942년 카잔의 로켓엔진 설계국으로 옮겨 글루시코와 다시 일했으며, 1944년 7월 석방됐다. 완전한 복권은 1957년에야 이루어졌다. 그는 이 세월에 대해 공개적으로 말하는 일이 거의 없었으나, 일을 놓은 적은 한 번도 없었다.$body$,
    $body$Sergei Korolev belonged to the pioneer generation that began rocket development in 1931 at the Moscow Group for the Study of Reactive Motion (GIRD). In August 1933 GIRD launched GIRD-09, the first Soviet rocket of the liquid-fuel family, and at the consolidated Reactive Scientific Research Institute (RNII) formed that year Korolev served as deputy director, designing winged craft and rocket gliders. Before turning thirty he was already one of the central figures of Soviet rocketry.

The Great Terror did not spare the institute. After director Kleimenov and Langemak were executed and Valentin Glushko arrested, Korolev too was arrested on June 27, 1938, charged with membership in a counter-revolutionary organization. Under beatings he confessed to the fabricated charges, was sentenced to ten years, and was sent to the Maldyak gold mine in Kolyma, where scurvy cost him his teeth and brought him to the edge of death. This archive records this plainly: Korolev's arrest was groundless, an emblematic case of the losses the Terror inflicted on Soviet science.

In 1939 a review of his case was ordered and he was recalled from Kolyma; his sentence was reduced to eight years, to be served in TsKB-29, the prison design bureau led by Tupolev, the so-called sharashka. There he worked on the Tu-2 bomber, moved in 1942 to a rocket-engine bureau in Kazan where he worked with Glushko again, and was released in July 1944. Full rehabilitation came only in 1957. He rarely spoke publicly of those years, but he never once put down the work.$body$,
    $$["James Harford, Korolev: How One Man Masterminded the Soviet Drive to Beat America to the Moon (Wiley, 1997)","Yaroslav Golovanov, Korolev: fakty i mify (Nauka, 1994)","Boris Chertok, Rockets and People, Vol. 1 (NASA SP-4110, 2005)","Asif A. Siddiqi, Challenge to Apollo: The Soviet Union and the Space Race, 1945-1974 (NASA SP-2000-4408, 2000)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'korolev', 'chief-designer-1957', 1,
    '1957년 10월 4일, 익명의 수석설계사',
    'October 4, 1957: The Anonymous Chief Designer',
    $body$전후 코롤료프는 NII-88 연구소의 장거리 미사일 수석설계사가 되어 독일 A-4의 복제에서 출발해 독자 설계로 나아갔다. 1957년 8월 세계 최초의 대륙간탄도미사일 R-7이 비행에 성공했고, 그는 이 로켓의 탄두 자리에 인공위성을 얹자고 정부를 설득했다. 1957년 10월 4일 스푸트니크 1호가 궤도에 올랐다. 지구 최초의 인공위성이 사회주의 국가의 손으로, 그것도 20년 전 금광 수인이었던 사람의 설계로 올라간 것이다.

살아 있는 동안 그의 이름은 국가기밀이었다. 신문은 그를 다만 「수석설계사」라고 불렀고, 노벨위원회가 스푸트니크의 설계자를 문의하자 흐루쇼프는 「소비에트 인민 전체」라고 답했다고 전해진다. 익명의 그늘에서 그는 최초의 생명체 탑승 위성, 달과 금성을 향한 탐사선, 그리고 1961년 4월 12일 가가린의 보스토크 1호까지 인류 우주시대의 첫 장을 연달아 써 냈다. 동료들의 회고에 따르면 그는 불같은 성미와 수인 시절의 조용한 상처를 함께 지닌, 설계국 전체를 홀로 끌고 가는 기관차 같은 사람이었다.

1966년 1월 14일, 코롤료프는 종양 제거 수술 중 숨졌다. 콜리마가 남긴 쇠약한 몸은 수술을 버티지 못했다. 이틀 뒤 프라우다는 전면 부고를 실었고, 소련 인민과 세계는 그제서야 「수석설계사」의 이름이 세르게이 파블로비치 코롤료프였음을 알았다. 그의 유해는 크렘린 벽에 안장됐다. 무명 속에서 우주시대를 연 사람의 이름은 죽음과 함께 공개되어, 이후 소련 우주계획 전체의 상징이 됐다.$body$,
    $body$After the war Korolev became chief designer of long-range missiles at the NII-88 institute, moving from copies of the German A-4 to original designs. In August 1957 the R-7, the world's first intercontinental ballistic missile, flew successfully, and he persuaded the government to put a satellite where its warhead would sit. On October 4, 1957, Sputnik 1 reached orbit: the Earth's first artificial satellite, launched by a socialist state, on a design by a man who twenty years earlier had been a prisoner in a gold mine.

While he lived, his name was a state secret. The newspapers called him only "the Chief Designer", and when the Nobel committee asked who had designed Sputnik, Khrushchev is said to have answered: the entire Soviet people. From that anonymity he wrote the opening chapters of the space age one after another: the first satellite carrying a living creature, probes toward the Moon and Venus, and on April 12, 1961, Gagarin's Vostok 1. Colleagues remembered him as a locomotive pulling the whole design bureau alone, a man of volcanic temper who carried the quiet scars of his prisoner years.

On January 14, 1966, Korolev died during surgery to remove a tumor; a body weakened by Kolyma did not survive the operation. Two days later Pravda carried a full obituary, and the Soviet people and the world learned at last that the Chief Designer's name was Sergei Pavlovich Korolev. His ashes were interred in the Kremlin Wall. The name of the man who opened the space age in obscurity was revealed with his death, and became the emblem of the entire Soviet space program.$body$,
    $$["James Harford, Korolev: How One Man Masterminded the Soviet Drive to Beat America to the Moon (Wiley, 1997)","Asif A. Siddiqi, Challenge to Apollo: The Soviet Union and the Space Race, 1945-1974 (NASA SP-2000-4408, 2000)","Boris Chertok, Rockets and People, Vols. 1-2 (NASA SP-4110, 2005-2006)","Obituary of S. P. Korolev, Pravda, January 16, 1966","Yaroslav Golovanov, Korolev: fakty i mify (Nauka, 1994)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- 유리 가가린 / Yuri Gagarin (1934–1968)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'gagarin', 'vostok-1961', 0,
    '1961년 4월 12일, 「포예할리!」',
    'April 12, 1961: "Poyekhali!"',
    $body$유리 가가린은 1934년 스몰렌스크주의 농촌 마을 클루시노에서 콜호스 목수의 아들로 태어났다. 1941년 가을 마을은 나치군에 점령됐고, 가족은 집에서 쫓겨나 뒤뜰의 토굴에서 겨울을 났으며, 형과 누나는 강제노동에 끌려갔다. 해방 뒤 소년은 소비에트 교육 체계가 놓아 준 사다리를 하나씩 밟았다. 류베르치의 직업학교에서 주물공 자격을 땄고, 사라토프의 공업전문학교에서 공부하며 지역 항공클럽에서 처음 조종간을 잡았다. 이어 오렌부르크 군사비행학교를 거쳐 북극권의 해군 항공대 전투기 조종사가 됐다.

1960년 그는 최초의 우주비행사 선발대에 뽑혔다. 그리고 1961년 4월 12일 아침, 바이코누르 발사대의 보스토크 1호 안에서 로켓이 점화되는 순간, 그는 무전에 특유의 활달한 한마디를 남겼다. 「포예할리!(갑시다!)」 인류 최초의 우주비행은 108분간 지구를 한 바퀴 돌았고, 가가린은 계획대로 캡슐에서 사출되어 사라토프 근교 스멜롭카 마을의 밭에 낙하산으로 내려섰다. 처음 그를 맞은 것은 감자밭의 한 여성과 아이였다.

주물공 출신의 스물일곱 살 청년이 인류의 첫 우주인이 된 것은 우연이 아니었다. 점령지의 토굴에서 자란 농민의 아들에게 기술학교와 항공클럽, 군사학교의 문을 차례로 열어 준 것은 소비에트 체제의 교육과 상승의 경로였고, 소련은 가가린을 바로 그 가능성의 증거로 세계에 내보였다.$body$,
    $body$Yuri Gagarin was born in 1934 in Klushino, a farming village in Smolensk oblast, the son of a kolkhoz carpenter. In the autumn of 1941 the village was occupied by the Nazis; the family was turned out of its house and wintered in a dugout in the yard, and his elder brother and sister were taken for forced labor. After liberation the boy climbed, rung by rung, the ladder the Soviet education system set before him: a foundryman's qualification at the vocational school in Lyubertsy, studies at an industrial technicum in Saratov where he first took the controls at the local aeroclub, then the Orenburg military aviation school and service as a naval fighter pilot above the Arctic Circle.

In 1960 he was selected for the first cosmonaut group. And on the morning of April 12, 1961, inside Vostok 1 on the Baikonur pad, at the moment of ignition he left one buoyant word on the radio: "Poyekhali!", "Let's go!" The first human spaceflight circled the Earth in 108 minutes; Gagarin ejected from the capsule as planned and came down by parachute in a field near the village of Smelovka outside Saratov, where the first to greet him were a woman and a child in a potato field.

That a twenty-seven-year-old former foundryman became humanity's first spacefarer was no accident. What opened, one after another, the doors of the technical school, the aeroclub, and the military academy to a peasant's son raised in an occupation-era dugout was the Soviet path of education and advancement, and the USSR presented Gagarin to the world as living proof of exactly that possibility.$body$,
    $$["Yuri Gagarin, Doroga v kosmos (Road to the Stars) (Moscow, 1961)","Andrew L. Jenks, The Cosmonaut Who Couldn't Stop Smiling: The Life and Legend of Yuri Gagarin (Northern Illinois University Press, 2012)","Asif A. Siddiqi, Challenge to Apollo: The Soviet Union and the Space Race, 1945-1974 (NASA SP-2000-4408, 2000)","TASS communique on the flight of Vostok 1, April 12, 1961"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'gagarin', 'world-tour-1961', 1,
    '1961년 7월, 맨체스터의 빗속에서',
    'July 1961: In the Manchester Rain',
    $body$비행 직후 가가린은 「평화의 사절」로 세계를 돌았다. 순방은 냉전의 진영을 가리지 않았다. 1961년 7월 그는 영국 주물노동자합동노조(AUFW)의 초청으로 맨체스터를 찾았다. 주물공 출신 우주인을 동료로 맞겠다는 노조의 초청이었다. 그날 맨체스터에는 비가 쏟아졌지만 가가린은 오픈카의 지붕을 닫지 않았다. 나를 보러 빗속에 서 있는 사람들이 젖는데 나만 마를 수는 없다는 것이 이유였다. 노조는 그에게 명예 조합원 메달을 걸어 주었고, 그는 트래퍼드 파크의 공장 노동자들 앞에서 자신도 용해로 앞에서 일을 배운 사람이라고 말했다.

그해 여름 아바나에서는 피델 카스트로가 그를 껴안고 신생 혁명 쿠바의 훈장을 수여했다. 맨체스터의 산업노동자와 아바나의 혁명 군중이 같은 사람을 같은 마음으로 환영한 것이다. 체제 경쟁의 한복판에서 가가린의 미소는 이념의 경계를 넘는 드문 통화였고, 소련으로서는 사회주의가 길러 낸 인간형을 보여 주는 살아 있는 대사였다. 그는 수십 개 나라를 돌며 왕과 대통령, 부두 노동자와 학생 들을 똑같은 태도로 만났다.

이후 그는 우주비행사 훈련센터의 지도부에서 일했고, 1967년 소유스 1호의 예비 조종사로서 동료 코마로프의 죽음을 지켜보았다. 1968년 3월 27일, 비행 자격 회복을 위한 훈련 비행 중 그가 탄 미그-15UTI가 블라디미르주 노보숄로보 인근에 추락해 교관 블라디미르 세료긴과 함께 사망했다. 나이 서른넷이었다. 소련 전역이 애도했고, 그의 유해는 크렘린 벽에 안장됐다. 고향 마을 클루시노가 속한 도시는 이제 가가린이라는 이름을 갖고 있다.$body$,
    $body$Right after the flight Gagarin toured the world as an envoy of peace, and the tour ignored Cold War lines. In July 1961 he came to Manchester at the invitation of the Amalgamated Union of Foundry Workers, a union welcoming a foundryman-cosmonaut as one of their own. Rain poured on Manchester that day, but Gagarin refused to close the roof of the open car: if the people standing in the rain to see him were getting wet, he reasoned, he could not stay dry. The union hung an honorary member's medal on him, and at Trafford Park he told factory workers that he too had learned his trade in front of a furnace.

That same summer in Havana, Fidel Castro embraced him and decorated him with an order of the young revolutionary republic. The industrial workers of Manchester and the revolutionary crowds of Havana welcomed the same man with the same warmth. In the middle of the contest of systems, Gagarin's smile was a rare currency that crossed ideological borders, and for the USSR he was a living ambassador of the kind of human being socialism could raise. He visited dozens of countries, meeting kings and presidents, dockers and students, in exactly the same manner.

He later served in the leadership of the cosmonaut training center, and as backup pilot for Soyuz 1 in 1967 he witnessed the death of his comrade Komarov. On March 27, 1968, during a training flight to requalify for flying, his MiG-15UTI crashed near Novosyolovo in Vladimir oblast, killing him together with instructor Vladimir Seryogin. He was thirty-four. The whole Soviet Union mourned, and his ashes were interred in the Kremlin Wall. The town nearest his native Klushino now bears the name Gagarin.$body$,
    $$["Gurbir Singh, Yuri Gagarin in London and Manchester: A Smile that Changed the World? (Astrotalkuk Publications, 2011)","Andrew L. Jenks, The Cosmonaut Who Couldn't Stop Smiling: The Life and Legend of Yuri Gagarin (Northern Illinois University Press, 2012)","The Guardian, coverage of Gagarin's Manchester visit, July 13, 1961","Asif A. Siddiqi, Challenge to Apollo: The Soviet Union and the Space Race, 1945-1974 (NASA SP-2000-4408, 2000)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- 알렉산드르 솔제니친 / Aleksandr Solzhenitsyn (1918–2008)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'solzhenitsyn', 'ivan-denisovich-1962', 0,
    '1962년 11월, 노비 미르의 지면에서',
    'November 1962: In the Pages of Novy Mir',
    $body$알렉산드르 솔제니친은 대조국전쟁에서 포병 대위로 복무하던 1945년 2월, 친구에게 보낸 편지에서 스탈린을 은어로 비판한 일로 전선에서 체포됐다. 8년형을 선고받은 그는 모스크바 근교 마르피노의 수감 연구소(샤라시카)를 거쳐 카자흐스탄 에키바스투스의 특별수용소에서 형기를 마쳤고, 이어 유형 생활 중 암을 앓았다. 이 체험이 훗날 「제1원」과 「암병동」, 그리고 벽돌공 이반 데니소비치의 하루가 됐다.

1962년 11월, 트바르돕스키가 이끄는 문예지 노비 미르 11호에 「이반 데니소비치의 하루」가 실렸다. 수용소의 하루를 수인의 눈높이에서 담담하게 그린 이 중편의 게재는 흐루쇼프가 직접 당 간부회의 승인을 밀어붙여 성사시킨 것이었다. 20차 당대회에서 시작된 탈스탈린화 노선 위에서, 당 스스로 수용소라는 주제를 공식 문학의 영역으로 끌어낸 순간이었다. 잡지는 순식간에 매진됐고 무명의 지방 교사는 하루아침에 전국적 작가가 됐다.

이 아카이브의 관점에서 이 출판은 이중의 의미를 갖는다. 그것은 해빙기 소비에트 체제가 자기 역사의 어두운 장을 스스로 공론화할 수 있음을 보여 준 사건이었고, 동시에 그 공론화의 주도권이 곧 당의 손을 떠나 다른 정치적 목적지로 향하게 되는 출발점이기도 했다.$body$,
    $body$Aleksandr Solzhenitsyn, serving as an artillery captain in the Great Patriotic War, was arrested at the front in February 1945 for criticizing Stalin in coded language in letters to a friend. Sentenced to eight years, he passed through the prison research institute (sharashka) at Marfino near Moscow and finished his term in the special camp at Ekibastuz in Kazakhstan, then suffered cancer in internal exile. That experience later became The First Circle, Cancer Ward, and one day in the life of the bricklayer Ivan Denisovich.

In November 1962, issue No. 11 of the journal Novy Mir, edited by Tvardovsky, carried One Day in the Life of Ivan Denisovich. The publication of this novella, which rendered a single camp day evenly and without rhetoric from a prisoner's eye level, was pushed through the party Presidium by Khrushchev personally. On the de-Stalinization course begun at the Twentieth Congress, this was the moment the party itself brought the subject of the camps into official literature. The issue sold out instantly, and an unknown provincial teacher became a national writer overnight.

From this archive's perspective the publication carries a double meaning. It showed that the Soviet system of the Thaw could bring the dark chapters of its own history into public discussion by its own hand; and it was also the starting point from which control of that discussion soon left the party's hands and moved toward other political destinations.$body$,
    $$["Aleksandr Solzhenitsyn, One Day in the Life of Ivan Denisovich, Novy Mir No. 11 (1962)","Aleksandr Tvardovsky, foreword to One Day in the Life of Ivan Denisovich, Novy Mir No. 11 (1962)","Michael Scammell, Solzhenitsyn: A Biography (W. W. Norton, 1984)","William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'solzhenitsyn', 'gulag-archipelago-1974', 1,
    '1974년 2월, 추방과 그 뒤의 수치들',
    'February 1974: Expulsion, and the Numbers That Followed',
    $body$1973년 12월 파리에서 「수용소군도」 제1권이 출간됐다. 227명의 증언과 자신의 체험을 엮은 이 방대한 「문학적 탐구의 시도」는 수용소 세계의 내부를 서방 독자 앞에 펼쳐 놓았고, 1974년 2월 솔제니친은 체포되어 시민권을 박탈당하고 서독으로 추방됐다. 책의 세계적 반향은 냉전기 소련 인식을 결정지은 사건 중 하나였다.

다만 문학적 증언과 통계는 구별해야 한다. 솔제니친은 문서고 접근이 불가능한 조건에서 망명 통계학자 쿠르가노프의 외삽에 기대어 수천만 명 규모의 희생을 말했고, 「수용소군도」의 수치들은 그 위에 서 있다. 1991년 이후 공개된 내무인민위원부·굴라크 문서고의 기록은 다른 크기를 보여 준다. 젬스코프와 게티, 리터스포른의 연구에 따르면 1930–1953년 사이 굴라크 수용소와 노동거류지를 거쳐 간 사람은 연인원 약 1,800만 명, 같은 기간 정치 혐의 사형 선고는 약 78만 6천 건이며 그 대부분인 약 68만 2천 건이 1937–1938년 대테러기에 집중됐고, 수용소 내 문서 기록상 사망자는 약 160만 명이다. 이 수치들은 그 자체로 무거운 역사적 사실이지만, 솔제니친이 제시한 규모와는 자릿수가 다르다.

추방 이후의 궤적도 기록해 둘 필요가 있다. 1978년 하버드 연설에서 그는 서방의 자유주의와 물질주의 역시 신랄하게 비판해 미국 여론을 당혹시켰고, 정교회와 농촌 공동체에 기반한 러시아 민족주의로 기울었다. 1994년 귀국한 그는 옐친 시대의 사유화와 과두 지배를 「러시아의 대파국」이라 부르며 1998년 국가 훈장을 거부했고, 만년에는 푸틴 정부와 화해하여 2007년 국가상을 받았다. 2008년 8월 모스크바에서 사망했다. 수용소 문학의 기념비를 세운 작가이자, 그 증언의 수치가 문서고 앞에서 수정된 저자, 그리고 자신이 무너뜨리는 데 일조한 체제의 후계 질서에 다시 환멸을 느낀 민족주의자. 이 세 층위를 함께 적는 것이 공정한 기록일 것이다.$body$,
    $body$In December 1973 the first volume of The Gulag Archipelago appeared in Paris. This vast "experiment in literary investigation", woven from the testimony of 227 witnesses and his own experience, laid the interior of the camp world before Western readers, and in February 1974 Solzhenitsyn was arrested, stripped of citizenship, and deported to West Germany. The book's worldwide echo was one of the defining events in Cold War perceptions of the USSR.

Literary testimony and statistics, however, must be distinguished. Writing without any access to archives, Solzhenitsyn relied on the extrapolations of the emigre statistician Kurganov and spoke of victims in the tens of millions; the figures in The Gulag Archipelago rest on that basis. The NKVD and Gulag records opened after 1991 show different magnitudes. According to the work of Zemskov, Getty, and Rittersporn, some 18 million people passed through Gulag camps and colonies between 1930 and 1953; death sentences for political offenses in that period totaled about 786,000, of which the great majority, about 682,000, were concentrated in the Terror years 1937–38; and documented deaths in the camps number about 1.6 million. These figures are heavy historical facts in their own right, but they differ from Solzhenitsyn's scale by an order of magnitude.

The trajectory after expulsion also belongs in the record. In his 1978 Harvard address he startled American opinion by attacking Western liberalism and materialism with equal severity, and he leaned toward a Russian nationalism grounded in Orthodoxy and the rural commune. Returning in 1994, he called the privatization and oligarchic rule of the Yeltsin years a great catastrophe for Russia, refused a state decoration in 1998, and in old age reconciled with the Putin government, accepting the State Prize in 2007. He died in Moscow in August 2008. A writer who raised the monument of camp literature; an author whose numbers were corrected by the archives; a nationalist disillusioned once more by the successor order of the system he had helped bring down: a fair record writes down all three layers together.$body$,
    $$["Aleksandr Solzhenitsyn, The Gulag Archipelago, Vol. 1 (YMCA-Press, Paris, 1973)","J. Arch Getty, Gabor T. Rittersporn, Viktor N. Zemskov, Victims of the Soviet Penal System in the Pre-war Years: A First Approach on the Basis of Archival Evidence, American Historical Review 98:4 (1993), pp. 1017-1049","V. N. Zemskov, GULAG (istoriko-sotsiologicheskii aspekt), Sotsiologicheskie issledovaniya, Nos. 6-7 (1991)","Michael Scammell, Solzhenitsyn: A Biography (W. W. Norton, 1984)","Aleksandr Solzhenitsyn, Rebuilding Russia (1990)","Aleksandr Solzhenitsyn, A World Split Apart, Harvard commencement address (June 8, 1978)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- 미하일 수슬로프 / Mikhail Suslov (1902–1982)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'suslov', 'grey-cardinal', 0,
    '스타라야 광장의 회색 추기경',
    'The Grey Cardinal of Staraya Square',
    $body$미하일 수슬로프는 1902년 사라토프현의 가난한 농민 가정에서 태어나 1921년 입당했고, 노동자예비학부(라브파크)와 플레하노프 경제대학, 붉은 교수단 경제연구소를 거치며 당이 길러 낸 첫 세대 이론 간부가 됐다. 1930년대에는 당 통제기관과 로스토프·스타브로폴의 지역 당 조직에서 일했는데, 이는 대숙청기의 지방 당 지도부라는 자리가 뜻하는 책임까지 포함하는 경력이었다. 전쟁 중에는 스타브로폴 지역 파르티잔 운동의 지도를 맡았고, 1944년부터는 리투아니아 문제를 다루는 중앙위 특별국을 이끌었다.

1947년 그는 중앙위원회 서기로 선출되어 죽는 날까지 35년간 그 자리를 지켰고, 프라우다 편집장과 코민포름 업무를 겸하며 스탈린 말년의 이데올로기 부문을 총괄했다. 1949년 코민포름 회의에서 「평화 옹호와 전쟁 방화자들에 대한 투쟁」 보고를 한 것도 그였다. 흐루쇼프 아래에서도, 브레즈네프 아래에서도 그는 마르크스레닌주의 정통의 최종 심급이자 선전·문화·교육·국제공산주의운동을 관장하는 「제2서기」로 남았다. 사람들은 그를 「회색 추기경」이라 불렀다.

권력의 정점 곁에서 산 세월에 견주면 그의 생활은 유별나게 검소했다. 유행이 지난 양복과 덧신, 규정 속도 아래로 달리게 한 관용차, 선물을 되돌려 보내는 습관은 모스크바 관가의 전설이 됐다. 그는 개인숭배도, 축재도, 파벌도 만들지 않았고, 원고 없이 말하는 일도 드물었다. 검열과 반체제 문제에서 그의 손은 단호했고, 그 단호함은 문화의 생동성에 값을 치르게 했다. 그러나 그 자신에게 그것은 사욕이 아니라 신념의 집행이었다. 혁명이 만든 제도를 지키는 일에 삶 전체를 바친, 금욕적 정통의 화신이었다.$body$,
    $body$Mikhail Suslov was born in 1902 to a poor peasant family in Saratov province, joined the party in 1921, and passed through a workers' preparatory faculty (rabfak), the Plekhanov economics institute, and the economics section of the Institute of Red Professors, becoming one of the first generation of theoretical cadres the party raised for itself. In the 1930s he worked in the party control organs and in the regional party organizations of Rostov and Stavropol, a career that includes the responsibility implied by regional party leadership in the purge years. During the war he directed the partisan movement in the Stavropol region, and from 1944 he headed the Central Committee's special bureau for Lithuania.

In 1947 he was elected a Secretary of the Central Committee and held the post for thirty-five years, until the day he died, doubling as editor-in-chief of Pravda and overseeing Cominform affairs, in charge of the ideological sector in Stalin's last years. It was Suslov who delivered the report "The Defense of Peace and the Struggle Against the Warmongers" at the 1949 Cominform meeting. Under Khrushchev as under Brezhnev he remained the court of final appeal on Marxist-Leninist orthodoxy and the "second secretary" managing propaganda, culture, education, and the international communist movement. People called him the grey cardinal.

Measured against his decades beside the summit of power, his life was strikingly austere. The out-of-fashion suits and galoshes, the official car ordered to drive below the speed limit, the habit of sending gifts back: these became legends of official Moscow. He built no personality cult, no fortune, no faction, and rarely spoke without a prepared text. In censorship and dissident affairs his hand was unbending, and that severity exacted a price from the vitality of Soviet culture. But to him it was not self-interest; it was the execution of a creed. He was the ascetic embodiment of orthodoxy, a man who gave his entire life to guarding the institutions the revolution had made.$body$,
    $$["Roy Medvedev, All Stalin's Men (Basil Blackwell, 1983)","Yoram Gorlizki and Oleg Khlevniuk, Cold Peace: Stalin and the Soviet Ruling Circle, 1945-1953 (Oxford University Press, 2004)","Giuliano Procacci et al., eds., The Cominform: Minutes of the Three Conferences 1947/1948/1949 (Fondazione Giangiacomo Feltrinelli, 1994)","William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'suslov', 'plenum-1964', 1,
    '1964년 10월 14일, 전원회의의 보고자',
    'October 14, 1964: Rapporteur of the Plenum',
    $body$1964년 10월, 흑해 연안에서 휴가 중이던 흐루쇼프는 모스크바로 소환됐다. 간부회 동료들은 그의 즉흥적 통치, 농업 실패, 행정 개편의 혼란, 커져 가는 개인숭배를 조목조목 비판하며 사임을 요구했고, 10월 14일 중앙위원회 전원회의에서 이 결정을 추인하는 공식 보고를 맡은 사람이 수슬로프였다. 그는 특유의 건조한 어조로 흐루쇼프의 과오 목록을 낭독했다. 1957년 「반당그룹」 사건 때 흐루쇼프를 지켜 냈던 바로 그 사람이, 이번에는 그의 퇴장을 집행한 것이다.

주목할 것은 방식이다. 1964년 10월의 교체는 체포도 유혈도 없이, 당 규약의 절차를 밟아 이루어졌고 흐루쇼프는 연금과 다차를 받고 물러났다. 실각한 지도자가 목숨과 자유를 지킨 채 은퇴한 이 사건은, 소비에트 정치가 1930년대의 관행에서 얼마나 멀리 왔는지를 보여 주는 지표이기도 했다. 수슬로프 자신은 1인자의 자리를 원하지 않았고, 서기장직이 브레즈네프에게 가도록 힘을 실었다. 그는 평생 두 번째 자리의 권력을 선호했고, 바로 그 때문에 어떤 파벌에게도 위협이 되지 않는 중재자로서 오래 살아남았다.

브레즈네프 시대 내내 수슬로프는 이데올로기와 인사의 문지기로서 체제의 항상성을 지켰다. 1982년 1월 25일 그가 사망하자 그 항상성 자체가 흔들리기 시작했다. 비어 버린 이데올로기 서기 자리로 그해 5월 안드로포프가 국가보안위원회에서 옮겨 왔고, 이는 브레즈네프 사후 승계 구도를 사실상 결정지었다. 회색 추기경의 죽음은 그가 평생 봉인해 온 변화의 문이 열리는 신호였던 셈이다.$body$,
    $body$In October 1964 Khrushchev, on holiday by the Black Sea, was summoned back to Moscow. His Presidium colleagues criticized his improvised governance, the agricultural failures, the chaos of his administrative reorganizations, and his growing cult point by point, and demanded his resignation; at the Central Committee plenum on October 14 the man entrusted with the official report ratifying the decision was Suslov. In his characteristically dry tone he read out the catalogue of Khrushchev's errors. The very man who had saved Khrushchev during the "Anti-Party Group" affair of 1957 now executed his exit.

The manner of it deserves attention. The October 1964 change of leadership took place without arrests or blood, through the procedures of the party statute, and Khrushchev retired with a pension and a dacha. That a fallen leader withdrew with his life and liberty intact was itself a measure of how far Soviet politics had traveled from the practices of the 1930s. Suslov did not want the top position for himself and threw his weight behind Brezhnev for the General Secretaryship. All his life he preferred the power of the second seat, and precisely for that reason he survived for decades as an arbiter who threatened no faction.

Throughout the Brezhnev era Suslov guarded the system's equilibrium as gatekeeper of ideology and cadres. When he died on January 25, 1982, that equilibrium itself began to shift. Into the vacant ideology secretaryship moved Andropov from the KGB that May, a transfer that effectively settled the succession after Brezhnev. The death of the grey cardinal was the signal that the door of change he had spent a lifetime sealing was coming open.$body$,
    $$["Nikita Khrushchev. 1964: Stenogrammy plenuma TsK KPSS i drugie dokumenty, eds. A. N. Artizov et al. (Mezhdunarodnyi fond Demokratiya, 2007)","William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)","Roy Medvedev, All Stalin's Men (Basil Blackwell, 1983)","Susanne Schattenberg, Brezhnev: The Making of a Statesman (I.B. Tauris, 2021)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- 드미트리 셰필로프 / Dmitri Shepilov (1905–1995)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'shepilov', 'cairo-1956', 0,
    '1956년 6월, 카이로의 소련 외무장관',
    'June 1956: The Soviet Foreign Minister in Cairo',
    $body$드미트리 셰필로프는 당 지도부에서 보기 드문 학자형 인물이었다. 모스크바대학 법학부를 나온 경제학자로서 정치경제학 교과서 편찬을 이끌었고, 1941년에는 병역 면제 대상이었음에도 민병대에 자원해 전쟁을 정치장교로 마쳤으며 종전 무렵에는 소장 계급에 이르렀다. 전후에는 당 선전 부문을 거쳐 1952년부터 프라우다 편집장을 지냈다. 스탈린이 말년의 경제 토론에서 그의 필력과 학식을 높이 샀다는 것은 본인 회고록의 중심 일화이기도 하다.

1956년 6월 그는 몰로토프의 후임으로 외무장관이 됐다. 첫 주요 행선지는 카이로였다. 그는 영국군의 수에즈 기지 철수 완료를 기념하는 행사에 참석해 나세르와 회담했고, 아스완 하이댐 건설 지원 의사를 전하며 서방의 금융 봉쇄에 갇혀 있던 이집트에 다른 선택지를 보여 주었다. 전해에 프라우다 편집장 자격으로 카이로를 방문해 길을 닦아 둔 그에게 이는 낯선 무대가 아니었다. 몰로토프 시대의 유럽 중심 외교에서 벗어나, 탈식민 세계의 신생 국가들을 소련 외교의 지평 안으로 끌어들이는 전환이 그의 짧은 임기의 표지였다.

1956년 가을 수에즈 위기가 터지자 그는 런던의 수에즈 운하 회의에 소련 대표로 참석해 이집트의 주권을 옹호했다. 헝가리 사태와 수에즈 전쟁이 겹친 그 험한 계절을 지나 1957년 2월 외무장관직은 그로미코에게 넘어갔고, 셰필로프는 중앙위 서기로 돌아왔다. 반년 남짓한 임기였지만, 제3세계를 향한 개방이라는 방향은 이후 수십 년 소련 외교의 상수가 됐다.$body$,
    $body$Dmitri Shepilov was a rare scholar among the party leadership. An economist trained in the law faculty of Moscow University, he led the compilation of the political economy textbook; in 1941, though exempt from service, he volunteered for the people's militia and finished the war as a political officer with the rank of major general. After the war he rose through the party's propaganda apparatus and edited Pravda from 1952. That Stalin prized his pen and erudition in the economic discussions of his last years is a central episode of Shepilov's own memoirs.

In June 1956 he succeeded Molotov as Foreign Minister. His first major destination was Cairo. He attended the celebrations marking the completed withdrawal of British forces from the Suez base, conferred with Nasser, and conveyed Soviet willingness to help build the Aswan High Dam, showing an Egypt hemmed in by Western financial blockade that another option existed. Having visited Cairo the year before as editor of Pravda, he was no stranger to the stage. The mark of his short tenure was the turn away from the Europe-centered diplomacy of the Molotov era toward drawing the new states of the decolonizing world into the horizon of Soviet foreign policy.

When the Suez crisis broke in the autumn of 1956 he represented the USSR at the Suez Canal conference in London and defended Egypt's sovereignty. Past that harsh season, in which the Hungarian events and the Suez war overlapped, the ministry passed to Gromyko in February 1957 and Shepilov returned to the Central Committee Secretariat. His term had lasted barely half a year, but the opening to the third world became a constant of Soviet diplomacy for decades after.$body$,
    $$["Dmitrii Shepilov, The Kremlin's Scholar: A Memoir of Soviet Politics under Stalin and Khrushchev, ed. Stephen V. Bittner, trans. Anthony Austin (Yale University Press, 2007)","Aleksandr Fursenko and Timothy Naftali, Khrushchev's Cold War: The Inside Story of an American Adversary (W. W. Norton, 2006)","William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'shepilov', 'anti-party-1957', 1,
    '1957년 6월, 「그리고 그들에게 가담한 셰필로프」',
    'June 1957: "And Shepilov Who Joined Them"',
    $body$1957년 6월 18일, 당 간부회에서 몰로토프·말렌코프·카가노비치를 축으로 한 다수파가 흐루쇼프의 해임을 시도했다. 나흘간의 간부회 공방에서 셰필로프도 흐루쇼프의 독단적 작풍과 새로운 개인숭배의 조짐을 비판하며 다수파 쪽에 섰다. 그러나 주코프와 세로프의 도움으로 지방 중앙위원들이 군용기로 모스크바에 집결했고, 6월 22일부터 열린 중앙위원회 전원회의는 형세를 뒤집었다. 승리한 흐루쇼프 진영은 패자들에게 「몰로토프, 말렌코프, 카가노비치, 그리고 그들에게 가담한 셰필로프의 반당그룹」이라는 공식 명칭을 붙였다.

이 문구는 셰필로프의 이름을 역사에 고정시켰다. 핵심 3인과 달리 그는 스탈린 시대 대숙청의 책임자도 아니었고 음모의 주모자도 아니었으나, 명칭의 꼬리에 붙은 「가담한」이라는 한 단어 때문에 러시아어에는 「셰필로프는 러시아에서 가장 긴 성씨」라는 농담이 생겼다. 「그리고그들에게가담한셰필로프」가 통째로 하나의 성처럼 불렸기 때문이다. 그는 모든 직위를 잃고 프룬제의 키르기스 과학아카데미 경제연구소로 보내졌고, 이후 모스크바로 돌아와 국가문서고 기관에서 일했다. 1962년에는 출당까지 당했다.

여기서도 1930년대와의 차이는 뚜렷하다. 패배한 「반당그룹」의 누구도 체포되거나 처형되지 않았다. 셰필로프는 문서고의 연구자로 조용한 세월을 보냈고, 1976년 복당됐으며, 소련 해체 뒤인 1995년 아흔 살로 사망했다. 그가 남긴 회고록은 2001년 「가담하지 않은 자」라는 제목으로 출간됐다. 평생 붙어 다닌 낙인을 뒤집은 이 제목의 책은, 스탈린 말기와 흐루쇼프 시대 최고 지도부의 내부를 담은 가장 생생한 증언록 중 하나로 꼽힌다.$body$,
    $body$On June 18, 1957, a majority of the party Presidium, centered on Molotov, Malenkov, and Kaganovich, moved to remove Khrushchev. In four days of Presidium argument Shepilov too sided with the majority, criticizing Khrushchev's arbitrary style and the signs of a new personality cult. But with the help of Zhukov and Serov, provincial Central Committee members were flown to Moscow on military aircraft, and the Central Committee plenum that opened on June 22 reversed the field. The victorious Khrushchev camp fixed on the losers the official designation: "the anti-party group of Molotov, Malenkov, Kaganovich, and Shepilov who joined them."

The phrase fastened Shepilov's name to history. Unlike the core three he bore no responsibility for the purges of the Stalin era and was no ringleader of the plot, but the single trailing word "joined" gave Russian a standing joke, that Shepilov had the longest surname in Russia, since "AndShepilovWhoJoinedThem" was pronounced as one name. He lost every post and was sent to direct economics research at the Kirghiz Academy of Sciences in Frunze, later returning to Moscow to work in the state archives administration. In 1962 he was expelled from the party altogether.

Here too the distance from the 1930s is unmistakable: no one in the defeated "anti-party group" was arrested or shot. Shepilov passed quiet decades as a researcher among the archives, was readmitted to the party in 1976, and died at ninety in 1995, after the Soviet Union itself was gone. His memoirs appeared in 2001 under the title Neprimknuvshii, "The Man Who Did Not Join", a title that overturned the label he had carried all his life, and the book stands among the most vivid insider testimonies of the late Stalin and Khrushchev leadership.$body$,
    $$["Molotov, Malenkov, Kaganovich. 1957: Stenogramma iyun'skogo plenuma TsK KPSS i drugie dokumenty, eds. N. Kovaleva et al. (Mezhdunarodnyi fond Demokratiya, 1998)","Dmitrii Shepilov, The Kremlin's Scholar: A Memoir of Soviet Politics under Stalin and Khrushchev (Yale University Press, 2007)","William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- 바를람 샬라모프 / Varlam Shalamov (1907–1982)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'varlam-shalamov', 'arrests-kolyma-1937', 0,
    '1937년 1월 12일, 두 번째 체포',
    'January 12, 1937: The Second Arrest',
    $body$바를람 샬라모프는 1907년 볼로그다의 사제 가정에서 태어나 모스크바대학 법학부에서 공부했다. 1920년대의 그는 당내 좌익반대파에 공감하는 청년이었고, 1929년 2월 19일 레닌의 「대회에 보내는 편지」, 이른바 유언장을 인쇄하던 지하 인쇄소에서 체포됐다. 트로츠키 지지 활동 혐의로 받은 3년형을 그는 북부 우랄의 비셰라 수용소에서 치렀다. 이 첫 체포의 사유가 다름 아닌 레닌의 마지막 문서였다는 사실은, 그의 생애를 관통하는 비극의 예고편과 같았다.

풀려난 그는 모스크바에서 기자와 작가로 일했으나, 대테러가 절정으로 치닫던 1937년 1월 12일 「반혁명 트로츠키주의 활동」(KRTD) 혐의로 다시 체포됐다. 5년형을 받고 그해 8월 콜리마의 마가단에 내려진 그는 파르티잔 금광의 채굴 막장에 배치됐다. 영하 50도의 갱도, 기아 배급, 12시간 노동의 세계였다. 1943년에는 부닌을 러시아의 고전 작가라고 말한 것이 반소 선동으로 몰려 10년형이 추가됐다.

그를 살린 것은 1946년 수인 의사 판튜호프의 도움으로 들어간 의무보조원(펠셰르) 과정이었다. 병원 근무는 막장 노동으로부터의 구원이었다. 1951년 형기가 끝났으나 콜리마를 떠날 권리는 1953년에야 주어졌고, 완전한 복권은 1956년에 이루어졌다. 첫 체포부터 치면 스무 해 가까이, 콜리마에서만 열일곱 해 가까이를 그는 수용소 세계에서 보냈다. 이 아카이브는 좌익반대파 청년에서 콜리마의 수인이 된 그의 궤적을, 혁명이 제 자식들에게 입힌 상처의 기록으로서 정직하게 남긴다.$body$,
    $body$Varlam Shalamov was born in 1907 into a priest's family in Vologda and studied law at Moscow University. In the 1920s he was a young sympathizer of the Left Opposition inside the party, and on February 19, 1929, he was arrested in an underground print shop that was reproducing Lenin's Letter to the Congress, the so-called Testament. For Trotskyist activity he served a three-year sentence in the Vishera camps of the northern Urals. That the occasion of his first arrest was none other than Lenin's final document reads like a foreshadowing of the tragedy that would run through his life.

Released, he worked in Moscow as a journalist and writer, but on January 12, 1937, as the Great Terror climbed toward its peak, he was arrested again for "counter-revolutionary Trotskyist activity" (KRTD). Sentenced to five years, he was landed at Magadan in Kolyma that August and assigned to the diggings of the Partizan gold mine: a world of minus-fifty-degree pit faces, starvation rations, and twelve-hour shifts. In 1943 a remark that Bunin was a classic of Russian literature was construed as anti-Soviet agitation and brought him ten more years.

What saved him was the feldsher (medical assistant) course he entered in 1946 with the help of the prisoner-doctor Pantyukhov; hospital work was deliverance from the mine face. His sentence ended in 1951, but the right to leave Kolyma came only in 1953, and full rehabilitation in 1956. Counting from the first arrest he spent nearly twenty years in the camp world, close to seventeen of them in Kolyma. This archive sets down honestly the arc that took a young Left Oppositionist to the Kolyma diggings, as a record of the wounds the revolution inflicted on its own children.$body$,
    $$["Valery Esipov, Shalamov (Molodaya gvardiya, Zhizn zamechatelnykh lyudei series, 2012)","Varlam Shalamov, Kolyma Stories, trans. Donald Rayfield (New York Review Books, 2018)","Varlam Shalamov, Vishera: An Anti-Novel (written 1970-1971)","Varlam Shalamov archive and documentation site, shalamov.ru"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES (
    'varlam-shalamov', 'kolyma-tales-letter-1972', 1,
    '1972년 2월 23일, 문학신문에 실린 편지',
    'February 23, 1972: The Letter in Literaturnaya Gazeta',
    $body$콜리마에서 돌아온 샬라모프는 1954년부터 「콜리마 이야기」를 쓰기 시작해 20년 가까이 여섯 연작으로 다듬었다. 그의 산문은 수용소 문학 가운데서도 가장 가차 없다. 구원의 서사도, 시련을 통한 성장도 없다. 「수용소는 처음부터 끝까지 부정적 경험의 학교」라는 것이 그의 결론이었고, 그는 이를 장식 없는 짧은 문장의 「새로운 산문」으로 기록했다. 원고는 지하출판으로 돌았고, 1966년부터 뉴욕의 노비 주르날이 그의 동의 없이 조각조각 연재하기 시작했다. 국내에서는 시집만이 출간될 수 있었다.

1972년 2월 23일, 문학신문에 샬라모프 명의의 편지가 실렸다. 반소 선전에 자신의 이름을 이용하는 서방·망명계 출판을 규탄하고, 「콜리마 이야기의 문제의식은 이미 삶에 의해 해소됐다」고 선언하며 자신을 정직한 소비에트 작가로 규정한 글이었다. 반체제 진영은 이를 배신이자 문학적 죽음으로 읽었다. 그러나 기록은 더 복잡한 그림을 보여 준다. 샬라모프는 수첩과 지인들에게, 편지는 자신이 쓴 것이며 동의 없이 작품을 조각내 정치 상품으로 소비하는 망명 출판에 대한 분노가 진심이었다고 남겼다. 그는 반체제 운동의 상징이 되기를 원한 적이 없었고, 자신의 증언이 냉전의 탄약으로 쓰이는 것을 거부했다. 이 아카이브는 이 편지를 강요된 굴복설로 단순화하지도, 순수한 자발성으로 미화하지도 않고, 본인의 설명 그대로 기록한다.

솔제니친이 「수용소군도」의 공저를 제안했을 때도 그는 거절했다. 두 증언자의 미학과 정치는 갈라섰고, 샬라모프는 끝까지 문서적 정확성과 문학적 절제의 길을 택했다. 만년의 그는 시력과 청력을 잃은 채 1979년 문학기금 양로원에 들어갔고, 1982년 1월 정신신경 요양시설로 강제 이송된 지 사흘 만인 1월 17일 폐렴으로 숨졌다. 「콜리마 이야기」가 조국에서 온전히 출간된 것은 1988–1989년, 페레스트로이카의 지면에서였다. 오늘날 이 연작은 20세기 러시아 산문의 가장 준엄한 성취 중 하나로 읽힌다.$body$,
    $body$Back from Kolyma, Shalamov began writing the Kolyma Tales in 1954 and shaped them over nearly twenty years into six cycles. His prose is the most unsparing in all camp literature: no narrative of redemption, no growth through ordeal. "The camp is a school of the negative from first day to last" was his conclusion, and he set it down in the stripped short sentences of his "new prose". The manuscripts circulated in samizdat, and from 1966 the New York journal Novy Zhurnal began serializing them piecemeal without his consent. At home, only his poetry could be published.

On February 23, 1972, Literaturnaya Gazeta carried a letter over Shalamov's name. It denounced Western and emigre publications for using his name in anti-Soviet propaganda, declared that "the problems of the Kolyma Tales have long been removed by life", and defined him as an honest Soviet writer. Dissident circles read it as betrayal and literary suicide. The record, however, shows a more complicated picture. In his notebooks and to friends Shalamov maintained that he had written the letter himself and that his anger was real: anger at emigre publishers who cut his work into fragments and consumed it as a political commodity without his consent. He had never wished to be a symbol of the dissident movement, and he refused to let his testimony serve as Cold War ammunition. This archive records the letter as he explained it, neither reduced to a story of forced capitulation nor embellished as pure spontaneity.

When Solzhenitsyn proposed co-authorship of The Gulag Archipelago, he declined; the aesthetics and politics of the two witnesses had parted, and Shalamov held to documentary exactness and literary restraint to the end. In old age, losing sight and hearing, he entered the Literary Fund's home for the aged in 1979, and on January 17, 1982, three days after being forcibly transferred to a psychoneurological institution, he died of pneumonia. The Kolyma Tales were published whole in his homeland only in 1988–1989, in the pages of perestroika. Today the cycle is read as one of the sternest achievements of twentieth-century Russian prose.$body$,
    $$["Varlam Shalamov, Pis'mo v redaktsiyu, Literaturnaya Gazeta, February 23, 1972","Varlam Shalamov, Kolyma Stories and Sketches of the Criminal World, trans. Donald Rayfield (New York Review Books, 2018-2020)","Valery Esipov, Shalamov (Molodaya gvardiya, Zhizn zamechatelnykh lyudei series, 2012)","John Glad, introduction to Varlam Shalamov, Kolyma Tales (W. W. Norton, 1980)","Varlam Shalamov archive and documentation site, shalamov.ru"]$$
)) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();
