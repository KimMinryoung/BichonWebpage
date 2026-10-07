// 발칸 전쟁 (1912–1913): queue 2064. Sections come from sec-…-a (마케도니아 문제와
// 동맹 → 트라키아 전선 → 서부 전선과 알바니아 → 런던 회의·쿠데타·런던 조약) and sec-…-b
// (제2차 발칸 전쟁과 부쿠레슈티 조약 → 사회주의자들의 대응과 바젤 → 평가). Timeline,
// locations and person relations are kept here. `links` carries the link-review
// decisions for the event title and the new glossary terms (terms-balkan-wars-1912-1913.js).
const { event: buildEvent, P } = require('./lib');

const parts = ['a', 'b'].map(slug => require(`./sec-balkan-wars-1912-1913-${slug}`));
const sections = parts.flatMap(p => p.sections);

const SOFIA = P(42.6977, 23.3219, '소피아', 'Sofia');
const ISTANBUL = P(41.0082, 28.9784, '이스탄불', 'Istanbul');
const EDIRNE = P(41.6771, 26.5557, '에디르네', 'Edirne');
const BUCHAREST = P(44.4268, 26.1025, '부쿠레슈티', 'Bucharest');
const THESSALONIKI = P(40.6401, 22.9444, '테살로니키', 'Thessaloniki');

const timeline = [
  ['1908-10', '보스니아 병합과 불가리아 독립', 'Annexation of Bosnia and Bulgarian independence', '청년 튀르크 혁명의 혼란을 틈타 오스트리아-헝가리가 보스니아·헤르체고비나를 병합하고 불가리아가 독립을 선언했다.', 'Exploiting the upheaval of the Young Turk Revolution, Austria-Hungary annexed Bosnia and Herzegovina and Bulgaria declared independence.', ['bulgaria', 'turkey'], SOFIA],
  ['1910-01-07', '첫 발칸 사회민주당 회의', 'First Balkan Social Democratic Conference', '투초비치가 조직하고 블라고예프의 협의파 대표단이 참석한 베오그라드 회의가 열강의 간섭과 발칸 국가들의 패권 추구를 규탄했다.', 'The Belgrade conference organised by Tucović, attended by Blagoev\'s Narrow Socialist delegation, condemned Great Power interference and the Balkan states\' quest for hegemony.', ['serbia', 'bulgaria'], P(44.7866, 20.4489, '베오그라드', 'Belgrade')],
  ['1912-03-13', '세르비아-불가리아 동맹 조약', 'Serbo-Bulgarian treaty of alliance', '러시아의 감독 아래 맺은 조약의 비밀 부속서가 마케도니아를 무쟁 지역과 쟁점 지역으로 나누고 러시아 황제의 중재를 정했다.', 'The secret annex of the treaty, concluded under Russian supervision, divided Macedonia into Uncontested and Contested Zones subject to the Russian Emperor\'s arbitration.', ['serbia', 'bulgaria'], SOFIA],
  ['1912-05-29', '그리스-불가리아 동맹', 'Greco-Bulgarian alliance', '영토 분할 규정 없이 맺은 조약으로 그리스가 발칸 동맹에 들어왔다.', 'A treaty without any provision for the division of territory brought Greece into the Balkan League.', ['greece', 'bulgaria'], SOFIA],
  ['1912-10-08', '몬테네그로의 선전포고', 'Montenegro declares war', '국경 교섭이 깨진 몬테네그로가 동맹국 가운데 맨 먼저 오스만 제국에 선전포고했다.', 'After border negotiations failed, Montenegro was the first of the allies to declare war on the Ottoman Empire.', ['montenegro', 'turkey'], P(42.3931, 18.9116, '체티네', 'Cetinje')],
  ['1912-10-17', '전면전 개시', 'General war begins', '13일의 공동 최후통첩이 거부된 뒤 세르비아·불가리아·그리스가 오스만 제국과 전쟁에 들어갔다.', 'After their common ultimatum of the 13th was rejected, Serbia, Bulgaria and Greece went to war with the Ottoman Empire.', ['bulgaria', 'serbia', 'greece', 'turkey'], ISTANBUL],
  ['1912-10-23', '쿠마노보 전투', 'Battle of Kumanovo', '23~24일 세르비아군이 오스만 바르다르군을 꺾고 북마케도니아로 진격했다.', 'On 23–24 October the Serbian army defeated the Ottoman Vardar Army and advanced into northern Macedonia.', ['serbia', 'turkey'], P(42.1322, 21.7144, '쿠마노보', 'Kumanovo')],
  ['1912-10-28', '뤼레부르가즈 전투', 'Battle of Lule Burgas', '11월 2일까지 이어진 전투에서 불가리아군이 오스만군을 차탈자 선까지 밀어냈다.', 'In a battle lasting until 2 November the Bulgarians drove the Ottomans back to the Çatalca Line.', ['bulgaria', 'turkey'], P(41.4045, 27.3567, '뤼레부르가즈', 'Lüleburgaz')],
  ['1912-11-08', '테살로니키 항복', 'Surrender of Thessaloniki', '하산 타흐신 파샤가 수비대 2만 6천 명과 함께 도시를 그리스군에 넘겼다(출처에 따라 9일).', 'Hasan Tahsin Pasha surrendered the city and its 26,000-man garrison to the Greeks (9 November in some sources).', ['greece', 'turkey'], THESSALONIKI],
  ['1912-11-17', '차탈자 공격 실패', 'Assault on the Çatalca Line fails', '콜레라에 시달린 불가리아군의 공격이 콘스탄티노폴리스 앞 방어선에서 막혔다.', 'The cholera-stricken Bulgarian assault was stopped at the defences before Constantinople.', ['bulgaria', 'turkey'], P(41.1436, 28.4614, '차탈자', 'Çatalca')],
  ['1912-11-24', '바젤 임시대회', 'Extraordinary congress at Basel', '23개국 대표 555명이 모인 제2인터내셔널 임시대회가 25일 반전 선언을 만장일치로 채택했다.', 'The extraordinary congress of the Second International, with 555 delegates from 23 countries, unanimously adopted its anti-war manifesto on the 25th.', 'switzerland'],
  ['1912-11-28', '알바니아 독립 선언', 'Albanian Declaration of Independence', '이스마일 케말리가 이끈 블로러 회의가 알바니아 독립을 선언했다.', 'The assembly at Vlorë led by Ismail Qemali proclaimed Albanian independence.', 'albania', P(40.4667, 19.4897, '블로러', 'Vlorë')],
  ['1912-12-03', '휴전', 'Armistice', '오스만과 불가리아(세르비아·몬테네그로 대표)가 휴전했고, 그리스는 서명하지 않았다.', 'The Ottomans and Bulgaria, also representing Serbia and Montenegro, agreed an armistice; Greece did not sign.', ['bulgaria', 'turkey'], P(41.1436, 28.4614, '차탈자', 'Çatalca')],
  ['1912-12-16', '런던 강화 회의', 'London peace conference', '열강 대사회의와 함께 교전국 대표들의 강화 회의가 런던에서 열렸다.', 'Alongside the ambassadors\' conference of the Great Powers, the belligerents\' peace conference opened in London.', 'uk'],
  ['1913-01-23', '바브알리 습격', 'Raid on the Sublime Porte', '엔베르와 탈라트가 이끄는 통일진보위원회가 정부를 무너뜨리고 런던 회의에서 철수했다.', 'The Committee of Union and Progress under Enver and Talât overthrew the government and withdrew from the London conference.', 'turkey', ISTANBUL],
  ['1913-03-06', '이오아니나 함락', 'Fall of Ioannina', '그리스군이 비자니 요새를 뚫고 이오아니나를 차지했다.', 'The Greeks broke through at Bizani and took Ioannina.', ['greece', 'turkey'], P(39.6650, 20.8537, '이오아니나', 'Ioannina')],
  ['1913-03-26', '에디르네 함락', 'Fall of Edirne', '불가리아 제2군과 세르비아 2개 사단이 다섯 달 포위 끝에 요새를 함락했다.', 'The Bulgarian Second Army and two Serbian divisions took the fortress after a five-month siege.', ['bulgaria', 'serbia', 'turkey'], EDIRNE],
  ['1913-04-23', '슈코드라 항복', 'Surrender of Shkodër', '열강의 해상 봉쇄 속에서 에사드 파샤가 몬테네그로군에 항복했으나 몬테네그로는 도시를 내놓아야 했다.', 'Under a Great Power blockade Essad Pasha surrendered to the Montenegrins, who were later made to give the city up.', ['montenegro', 'albania', 'turkey'], P(42.0693, 19.5033, '슈코드라', 'Shkodër')],
  ['1913-05-30', '런던 조약', 'Treaty of London', '에노스-미디아 선 서쪽 오스만 영토가 발칸 동맹에 넘어갔다. 같은 날 게쇼프가 사임했다.', 'Ottoman territory west of the Enos-Midia line passed to the Balkan League; Geshov resigned the same day.', ['turkey', 'bulgaria', 'serbia', 'greece', 'montenegro', 'albania']],
  ['1913-06-01', '세르비아-그리스 동맹', 'Serbo-Greek alliance', '두 나라가 공동 국경과 불가리아에 맞선 상호 지원을 약속했다.', 'The two countries agreed a common border and mutual support against Bulgaria.', ['serbia', 'greece'], THESSALONIKI],
  ['1913-06-29', '불가리아의 기습', 'Bulgarian surprise attack', '차르의 명령을 받은 사보프 장군이 선전포고 없이 세르비아·그리스군 공격을 명령했다(율리우스력 6월 16일).', 'On the tsar\'s orders General Savov launched attacks on the Serbian and Greek armies without a declaration of war (16 June O.S.).', ['bulgaria', 'serbia', 'greece'], P(41.7333, 22.2000, '브레갈니차강', 'Bregalnica')],
  ['1913-07-02', '킬키스-라하나스 전투', 'Battle of Kilkis-Lachanas', '4일까지 이어진 전투에서 그리스군이 불가리아군을 물리쳤고 킬키스는 불탔다.', 'In fighting until 4 July the Greeks defeated the Bulgarians, and Kilkis was burned.', ['greece', 'bulgaria'], P(40.9937, 22.8754, '킬키스', 'Kilkis')],
  ['1913-07-10', '루마니아의 참전', 'Romania enters the war', '실리스트라를 거절당한 루마니아가 선전포고하고 소피아 11킬로미터 앞까지 진격했다.', 'Refused Silistra, Romania declared war and advanced to within 11 km of Sofia.', ['romania', 'bulgaria'], SOFIA],
  ['1913-07-23', '오스만의 에디르네 탈환', 'Ottoman recapture of Edirne', '엔베르가 이끄는 오스만군이 불가리아군이 버린 에디르네를 다시 차지했다.', 'Ottoman forces under Enver reoccupied Edirne, which the Bulgarians had abandoned.', ['turkey', 'bulgaria'], EDIRNE],
  ['1913-07-31', '부쿠레슈티 휴전', 'Armistice at Bucharest', '30일 부쿠레슈티에 모인 대표단이 31일부터 휴전하기로 했다.', 'The delegations that met in Bucharest on the 30th agreed an armistice from the 31st.', ['bulgaria', 'serbia', 'greece', 'montenegro', 'romania'], BUCHAREST],
  ['1913-08-10', '부쿠레슈티 조약', 'Treaty of Bucharest', '마케도니아가 분할되고 남도브루자가 루마니아에 넘어갔다(출처에 따라 12일).', 'Macedonia was partitioned and Southern Dobruja passed to Romania (12 August in some sources).', ['bulgaria', 'serbia', 'greece', 'montenegro', 'romania'], BUCHAREST],
  ['1913-09-29', '콘스탄티노폴리스 조약', 'Treaty of Constantinople', '불가리아가 에디르네와 크르클라렐리를 오스만에 돌려주었다(출처에 따라 30일).', 'Bulgaria returned Edirne and Kırklareli to the Ottomans (30 September in some sources).', ['bulgaria', 'turkey'], ISTANBUL],
  ['1913-11-14', '아테네 조약', 'Treaty of Athens', '그리스와 오스만이 강화했으나 에게해 섬들의 지위는 미해결로 남았다.', 'Greece and the Ottomans made peace, leaving the status of the Aegean islands unresolved.', ['greece', 'turkey'], P(37.9838, 23.7275, '아테네', 'Athens')],
];

const SIDES = {
  bulgaria: 'bulgaria-1912-1913',
  allies: 'serbia-greece-montenegro',
  ottoman: 'ottoman-empire',
  socialists: 'anti-war-socialists',
};

// [personId, kind, relationKo, relationEn, noteKo, noteEn, side]
const people = [
  ['ferdinand-i-of-bulgaria', 'leader', '불가리아 차르', 'Tsar of Bulgaria', '1912년 전쟁을 「초승달에 맞선 십자가의 투쟁」이라 선언했고, 1913년 6월 정부와 협의 없이 사보프 장군을 통해 옛 동맹국 공격을 명령해 제2차 전쟁을 일으켰다.', 'Proclaimed the war of 1912 a struggle "of the Cross against the Crescent", and in June 1913, without consulting the government, ordered through General Savov the attack on his former allies that began the second war.', SIDES.bulgaria],
  ['ivan-geshov', 'leader', '불가리아 총리', 'Prime minister of Bulgaria', '발칸 동맹 정책을 추진하고 제1차 전쟁을 이끌었으나, 동맹국과의 전쟁에 반대해 런던 조약이 서명된 1913년 5월 30일 사임했다.', 'Pursued the Balkan League policy and led Bulgaria through the first war, but resigned on 30 May 1913, the day the Treaty of London was signed, in opposition to war on the allies.', SIDES.bulgaria],
  ['nikola-pasic', 'leader', '세르비아 총리', 'Prime minister of Serbia', '발칸 동맹 결성의 주역이었고, 알바니아를 잃은 뒤 마케도니아 분할 조항의 재조정을 요구했다. 1913년 부쿠레슈티 회의에서 세르비아 대표단을 이끌었다.', 'A major architect of the Balkan League, he demanded revision of the Macedonian partition after Serbia lost Albania, and led the Serbian delegation at Bucharest in 1913.', SIDES.allies],
  ['eleftherios-venizelos', 'leader', '그리스 총리', 'Prime minister of Greece', '그리스를 발칸 동맹에 넣고 테살로니키 선점을 재촉했다. 1913년 세르비아와 동맹을 맺고 부쿠레슈티 회의에서 그리스 대표단을 이끌었다.', 'Brought Greece into the Balkan League and pressed for the capture of Thessaloniki; in 1913 concluded the alliance with Serbia and led the Greek delegation at Bucharest.', SIDES.allies],
  ['nikola-i-of-montenegro', 'leader', '몬테네그로 국왕', 'King of Montenegro', '1912년 10월 8일 맨 먼저 선전포고했고, 열강의 봉쇄에도 슈코드라를 포위해 1913년 4월 차지했으나 열강의 압력으로 내놓았다.', 'Declared war first on 8 October 1912 and, defying a Great Power blockade, took Shkodër in April 1913, only to give it up under pressure from the Powers.', SIDES.allies],
  ['ioannis-metaxas', 'executor', '그리스군 참모 장교', 'Greek staff officer', '1912년 소피아에서 그리스-불가리아 군사 조약을 교섭했고, 테살리아군 작전 참모로 싸운 뒤 런던 회의의 군사 전문가, 1913년 5월 세르비아-그리스 동맹 군사 조항의 전권 교섭자가 되었다.', 'Negotiated the Greco-Bulgarian military treaty in Sofia in 1912, served on the operations staff of the Army of Thessaly, then acted as military expert at the London Conference and in May 1913 as plenipotentiary for the military terms of the Serbo-Greek alliance.', SIDES.allies],
  ['enver-pasha', 'leader', '통일진보위원회 지도자', 'Leader of the Committee of Union and Progress', '1913년 1월 23일 바브알리 습격으로 정부를 무너뜨리고 전쟁을 재개했으며, 제2차 전쟁 중 에디르네를 되찾아 「에디르네의 정복자」로 불렸다.', 'Overthrew the government in the Raid on the Sublime Porte of 23 January 1913 and resumed the war; in the second war he recovered Edirne and was hailed as its "conqueror".', SIDES.ottoman],
  ['mustafa-kemal-ataturk', 'executor', '오스만군 참모 장교', 'Ottoman staff officer', '1913년 2월 볼라이르 상륙 작전에 참여했으나 실패했고, 제2차 전쟁 때 엔베르의 부대에서 디메토카와 에디르네 탈환에 참여했다.', 'Took part in the failed landing at Bulair in February 1913 and, in the second war, in the recovery of Dimetoka and Edirne with Enver\'s force.', SIDES.ottoman],
  ['kazim-karabekir', 'participant', '에디르네 수비 장교', 'Officer in the defence of Edirne', '소령으로 에디르네에서 불가리아군과 싸우다 포로가 되어 1913년 10월 휴전 뒤에야 풀려났다.', 'Fought the Bulgarians at Edirne as a major, was taken prisoner and remained in captivity until the armistice of October 1913.', SIDES.ottoman],
  ['ismail-qemali', 'leader', '알바니아 독립 선언 주도자', 'Leader of the Albanian declaration of independence', '빈에서 오스트리아-헝가리의 지지를 얻은 뒤 1912년 11월 28일 블로러 회의에서 알바니아 독립을 선언하고 첫 정부를 이끌었다.', 'Having secured Austro-Hungarian support in Vienna, proclaimed Albanian independence at the Vlorë assembly on 28 November 1912 and led its first government.'],
  ['nicholas-ii', 'participant', '러시아 황제, 동맹의 중재자', 'Russian Emperor, arbiter of the alliance', '1912년 세르비아-불가리아 조약의 중재자로 지정되었고, 1913년 6월 8일 두 나라 국왕에게 중재를 제안했으나 불가리아의 조건부 응답으로 무산되었다.', 'Named arbiter in the Serbo-Bulgarian treaty of 1912, he offered on 8 June 1913 to arbitrate between the two kings, an offer Bulgaria\'s conditional reply effectively rejected.'],
  ['wilhelm-ii', 'participant', '독일 황제', 'German Emperor', '처음에는 세계대전의 위험을 무릅쓰고 오스트리아를 지원하겠다고 했으나, 1912년 12월 8일 전쟁회의는 독일이 1914년 중반까지 전쟁 준비가 안 된다고 결론지었다.', 'At first promised to back Austria even at the risk of a world war, but the war council of 8 December 1912 concluded that Germany would not be ready for war before mid-1914.'],
  ['franz-ferdinand', 'witness', '오스트리아-헝가리 황위 계승자', 'Heir to the Austro-Hungarian throne', '빌헬름 2세에게서 독일의 전면 지원 약속을 들었으나 오스트리아-헝가리는 개입을 망설였다. 1914년 그의 암살이 발칸 전쟁이 남긴 긴장을 세계대전으로 키웠다.', 'Heard Wilhelm II promise full German support, but Austria-Hungary hesitated to intervene; his assassination in 1914 turned the tensions left by the Balkan Wars into a world war.'],
  ['dragisa-lapcevic', 'participant', '세르비아 사회민주당 의원', 'Serbian Social Democratic deputy', '발칸 전쟁 직전 세르비아 의회에서 전쟁 예산에 반대표를 던져 국제적 명성을 얻었고 발칸 연방을 주장했다.', 'Won international renown by voting against war budgets in the Serbian Skupština on the eve of the Balkan Wars, and advocated a Balkan federation.', SIDES.socialists],
  ['dimitar-blagoev', 'participant', '불가리아 협의파 지도자', 'Leader of the Bulgarian Narrow Socialists', '제1차 발칸 전쟁을 열강의 제국주의와 발칸 부르주아지의 배외주의가 낳은 것이라 규탄했고, 협의파는 두 전쟁에 반대하며 발칸 연방 공화국을 내세웠다.', 'Condemned the First Balkan War as the product of Great Power imperialism and Balkan bourgeois chauvinism; his Narrow Socialists opposed both wars and called for a Balkan federative republic.', SIDES.socialists],
  ['christian-rakovsky', 'participant', '루마니아 사회민주주의자', 'Romanian Social Democrat', '전쟁 중 평화를 호소했고 제2차 전쟁 때 루마니아의 불가리아 침공과 남도브루자 병합에 반대했다. 1913년 그의 영지에 트로츠키가 머물렀다.', 'Called for peace during the wars and opposed Romania\'s invasion of Bulgaria and annexation of Southern Dobruja; Trotsky stayed at his estate in 1913.', SIDES.socialists],
  ['trotsky', 'witness', '『키옙스카야 미슬』 종군 기자', 'War correspondent of Kievskaya Mysl', '「안티드 오토」라는 필명으로 두 전쟁을 취재하며 발칸 연방을 주장하고 세르비아군의 알바니아인 민족 청소와 전쟁 잔학 행위를 기록했다.', 'Covered both wars under the pen name "Antid Oto", argued for a Balkan federation and chronicled atrocities, including the Serbian army\'s ethnic cleansing of Albanians.', SIDES.socialists],
  ['lenin', 'participant', '『프라우다』 논설 필자', 'Writer in Pravda', '1912년 11월 「세르비아-불가리아 승리의 사회적 의미」에서 마케도니아 정복을 부르주아 혁명에 견주면서 발칸 연방 공화국을 대안으로 내세웠고, 1915년 바젤 선언으로 사회배외주의를 고발했다.', 'In "The Social Significance of the Serbo-Bulgarian Victories" (November 1912) likened the conquest of Macedonia to a bourgeois revolution while naming a Balkan federal republic as the alternative; in 1915 used the Basel Manifesto to indict social-chauvinism.', SIDES.socialists],
  ['jean-jaures', 'participant', '바젤 임시대회 연설자', 'Speaker at the Basel congress', '바젤 대성당에서 연설하며 인터내셔널이 권력자들에게 명령조로 말하고 필요하면 행동으로 뒷받침할 만큼 강하다고 선언했다.', 'Spoke at Basel Minster, declaring the International strong enough to speak in a tone of command to those in power and, if necessary, to follow words with deeds.', SIDES.socialists],
  ['august-bebel', 'participant', '바젤 임시대회 연설자', 'Speaker at the Basel congress', '독일 사회민주당 대표로 바젤 대성당과 광장의 집회에서 연설했다.', 'Spoke for the German Social Democrats at the rally in and around Basel Minster.', SIDES.socialists],
  ['hugo-haase', 'participant', '바젤 임시대회 연설자', 'Speaker at the Basel congress', '바젤에서 연설했고, 1914년 7월 국제사회주의사무국 회의에서 바젤 결의를 재확인했다.', 'Spoke at Basel, and reaffirmed the Basel resolutions at the International Socialist Bureau meeting of July 1914.', SIDES.socialists],
  ['zetkin', 'participant', '바젤 임시대회 연설자', 'Speaker at the Basel congress', '바젤 대성당 집회의 연설자 가운데 하나였다.', 'One of the speakers at the Basel Minster rally.', SIDES.socialists],
  ['keir-hardie', 'participant', '바젤 임시대회 연설자', 'Speaker at the Basel congress', '영국 노동당 대표로 바젤 집회에서 연설했다.', 'Spoke at the Basel rally for British Labour.', SIDES.socialists],
  ['victor-adler', 'participant', '바젤 임시대회 연설자', 'Speaker at the Basel congress', '오스트리아 사회민주당 대표로 바젤에서 연설했고, 1914년 7월에는 오스트리아 당이 전쟁 열기에 맞설 힘이 없다고 고백했다.', 'Spoke at Basel for the Austrian Social Democrats; in July 1914 he confessed the Austrian party\'s powerlessness against war fever.', SIDES.socialists],
  ['karl-kautsky', 'historian', '「초제국주의」론자', 'Theorist of "ultra-imperialism"', '발칸 전쟁이 대전으로 번지지 않자 열강의 경제적 상호의존이 전쟁을 비합리적으로 만든다는 초제국주의론을 펴 1913년의 낙관을 뒷받침했다.', 'When the Balkan Wars did not spread, advanced the theory of ultra-imperialism, that the economic interdependence of the powers made war irrational, feeding the optimism of 1913.'],
  ['zinoviev', 'historian', '바젤 선언 해석자', 'Interpreter of the Basel Manifesto', '바젤 선언이 「방어 전쟁」과 「조국 방위」를 명시적으로 거부했다며 슈투트가르트 결의보다 낫다고 평가했다.', 'Stressed that the Basel Manifesto explicitly rejected "defensive war" and "defending the fatherland", calling it "better than Stuttgart".'],
];

const event = buildEvent({
  id: 'balkan-wars-1912-1913',
  title: { ko: '발칸 전쟁', en: 'The Balkan Wars' },
  period: '1912–1913',
  sortOrder: 14,
  question: {
    ko: '오스만 제국의 유럽 영토를 나눠 갖기로 한 발칸 동맹은 1912년 어떻게 제국을 거의 유럽에서 몰아냈고, 왜 여덟 달 만에 마케도니아를 두고 서로 싸웠으며, 이 두 전쟁은 어떻게 1차 세계대전의 무대를 만들었고, 바젤에 모인 제2인터내셔널과 발칸의 사회주의자들은 이 전쟁에 어떻게 맞섰나?',
    en: 'How did the Balkan League, formed to partition the Ottoman Empire\'s European lands, drive the empire almost out of Europe in 1912, why did its members turn on each other over Macedonia eight months later, how did the two wars set the stage for the First World War, and how did the Second International at Basel and the Balkan socialists stand against them?',
  },
  summary: {
    ko: '1912년 러시아의 후원 아래 불가리아·세르비아·그리스·몬테네그로가 비밀 조약으로 발칸 동맹을 맺었다. 10월 8일 몬테네그로가, 17일 나머지 세 나라가 오스만 제국과 전쟁에 들어갔고, 불가리아군은 뤼레부르가즈에서 이겨 콘스탄티노폴리스 앞 차탈자 선까지 진격했으며 세르비아군은 쿠마노보에서, 그리스군은 테살로니키에서 승리했다. 11월 28일 알바니아가 독립을 선언했고, 같은 달 바젤에서는 제2인터내셔널이 임시대회를 열어 전쟁이 유럽 전쟁으로 번지는 것을 막자는 선언을 채택했다. 1913년 1월 통일진보위원회의 쿠데타로 전쟁이 재개되었으나 에디르네·이오아니나·슈코드라가 차례로 함락되었고, 5월 30일 런던 조약으로 오스만은 에노스-미디아 선 서쪽 영토를 잃었다. 마케도니아 분할을 두고 6월 29일 불가리아가 옛 동맹국을 공격하자 세르비아·그리스에 루마니아와 오스만까지 가세했고, 8월 10일 부쿠레슈티 조약으로 불가리아는 마케도니아 대부분과 남도브루자를 잃었다.',
    en: 'In 1912, under Russian patronage, Bulgaria, Serbia, Greece and Montenegro formed the Balkan League by secret treaties. Montenegro went to war with the Ottoman Empire on 8 October and the other three on the 17th; the Bulgarians won at Lule Burgas and reached the Çatalca Line before Constantinople, the Serbs won at Kumanovo and the Greeks took Thessaloniki. Albania declared independence on 28 November, and that same month the Second International met in extraordinary congress at Basel and adopted a manifesto against the war\'s spreading into a European war. A coup by the Committee of Union and Progress in January 1913 renewed the fighting, but Edirne, Ioannina and Shkodër fell in turn, and by the Treaty of London of 30 May the Ottomans lost their territory west of the Enos-Midia line. When Bulgaria attacked its former allies over the partition of Macedonia on 29 June, Serbia and Greece were joined by Romania and the Ottomans, and by the Treaty of Bucharest of 10 August Bulgaria lost most of Macedonia and Southern Dobruja.',
  },
  outcome: {
    ko: '오스만 제국은 동트라키아를 빼고 유럽 영토를 잃었고, 세르비아와 그리스는 영토가 거의 두 배가 되었으며 알바니아가 독립국이 되었다. 마케도니아는 세르비아·그리스·불가리아로 나뉘었고 전쟁 내내 민간인 학살과 대규모 추방이 벌어졌다. 커진 세르비아를 경계한 오스트리아-헝가리와 독일, 패전 뒤 동맹국 쪽으로 돌아선 불가리아, 세르비아를 버릴 수 없게 된 러시아의 구도가 1914년 7월 위기를 세계대전으로 키웠다. 대전을 막았다는 착각 속에서 인터내셔널은 낙관에 빠졌지만, 바젤 선언은 1914년 이후 반전 사회주의자들의 기준이 되었고 전쟁 공채에 반대한 발칸 사회주의자들은 치머발트 좌파와 공산주의 운동으로 이어졌다.',
    en: 'The Ottoman Empire lost all its European territory except eastern Thrace, Serbia and Greece nearly doubled in size, and Albania became an independent state. Macedonia was partitioned among Serbia, Greece and Bulgaria, and both wars brought massacres of civilians and mass expulsions. Austria-Hungary and Germany, alarmed at an enlarged Serbia, a defeated Bulgaria turning to the Central Powers, and a Russia that could no longer abandon Serbia formed the configuration that let the July Crisis of 1914 grow into a world war. The International mistook the containment of the conflict for a lasting peace, but the Basel Manifesto became the touchstone of anti-war socialists after 1914, and the Balkan socialists who voted against war credits passed into the Zimmerwald Left and the communist movement.',
  },
  sections,
  timeline,
  locations: [
    ['마케도니아', 'Macedonia', 41.6086, 21.7453, 'main'],
    ['소피아', 'Sofia', 42.6977, 23.3219, 'place'],
    ['이스탄불', 'Istanbul', 41.0082, 28.9784, 'place'],
    ['에디르네', 'Edirne', 41.6771, 26.5557, 'place'],
    ['테살로니키', 'Thessaloniki', 40.6401, 22.9444, 'place'],
    ['쿠마노보', 'Kumanovo', 42.1322, 21.7144, 'place'],
    ['뤼레부르가즈', 'Lüleburgaz', 41.4045, 27.3567, 'place'],
    ['차탈자', 'Çatalca', 41.1436, 28.4614, 'place'],
    ['슈코드라', 'Shkodër', 42.0693, 19.5033, 'place'],
    ['블로러', 'Vlorë', 40.4667, 19.4897, 'place'],
    ['킬키스', 'Kilkis', 40.9937, 22.8754, 'place'],
    ['부쿠레슈티', 'Bucharest', 44.4268, 26.1025, 'place'],
  ],
  countries: ['bulgaria', 'serbia', 'greece', 'montenegro', 'turkey', 'romania', 'albania', 'switzerland', 'uk'],
  relations: { related: ['world-war-i', 'second-international-collapse-1914'] },
  sides: [
    { id: SIDES.bulgaria, label: { ko: '불가리아 (1912년 발칸 동맹의 주력, 1913년 고립)', en: 'Bulgaria (main force of the Balkan League in 1912, isolated in 1913)' } },
    { id: SIDES.allies, label: { ko: '세르비아·그리스·몬테네그로 (1912년 발칸 동맹, 1913년 반불가리아 연합)', en: 'Serbia, Greece and Montenegro (Balkan League in 1912, anti-Bulgarian coalition in 1913)' } },
    { id: SIDES.ottoman, label: { ko: '오스만 제국', en: 'The Ottoman Empire' } },
    { id: SIDES.socialists, label: { ko: '발칸과 국제 사회주의의 반전 세력', en: 'Balkan and international anti-war socialists' } },
  ],
  // 런던 조약 would otherwise be read as a bare generic; the new term is the
  // 1913 treaty (london-treaty-1913) with a dated headword. 임시정부 would link
  // to the Russian Provisional Government; the text avoids it but the guard stays.
  noAutoLink: ['임시정부', 'Provisional Government'],
  people,
});

// Link-review decisions for the event title and the new glossary terms, in the
// shape of scripts/reviews/commulingo-links-20261004-transcaucasia.json decisions.
const NOTE_KO = '2026-10-07 발칸 전쟁 사건 등록과 함께 검토: 이 항목만 가리키는 고유 표제어·별칭이라 자동 연결. 연도 없는 조약명·약어는 검색 전용.';
const NOTE_EN = '2026-10-07 reviewed with the Balkan Wars event registration: unique headword or alias of a new entry, auto link. Undated treaty names and acronyms stay search-only.';
const decision = (kind, id, lang, text, policy = 'auto', note) => ({
  kind, id, lang, text, role: 'identity', policy,
  note: note || (lang === 'ko' ? NOTE_KO : NOTE_EN), original479: false, beforePolicy: 'search',
});
const terms = require('./terms-balkan-wars-1912-1913');
const { SEARCH_ONLY } = terms;
const links = [
  decision('event', event.id, 'ko', event.fields.title_ko, 'auto', '2026-10-07 사건 등록과 함께 검토: 사건 제목 전체 문자열이라 다른 대상과 겹치지 않음. 자동 연결.'),
  decision('event', event.id, 'en', event.fields.title_en, 'auto', '2026-10-07 reviewed with the event registration: the full event title, unique to this event. Auto link.'),
  ...terms.flatMap(t => [
    decision('term', t.id, 'ko', t.fields.term.ko),
    decision('term', t.id, 'en', t.fields.term.en),
    ...(t.fields.aliases.ko || []).map(a => decision('term', t.id, 'ko', a, SEARCH_ONLY.has(a) ? 'search' : 'auto')),
    ...(t.fields.aliases.en || []).map(a => decision('term', t.id, 'en', a, SEARCH_ONLY.has(a) ? 'search' : 'auto')),
  ]),
];

module.exports = { event, links };
