// 발칸 전쟁: 앞 4개 절 (마케도니아 문제와 동맹 → 트라키아 전선 → 서부 전선과 알바니아 →
// 런던 회의·쿠데타·런던 조약). Sources are read as plain-text extracts of the cited pages.
const E = t => 'https://en.wikipedia.org/wiki/' + encodeURI(t);
const DE = t => 'https://de.wikipedia.org/wiki/' + encodeURI(t);
const RU = t => 'https://ru.wikipedia.org/wiki/' + encodeURI(t);
const BG = t => 'https://bg.wikipedia.org/wiki/' + encodeURI(t);
const S = {
  balkan: E('Balkan_Wars'),
  first: E('First_Balkan_War'),
  second: E('Second_Balkan_War'),
  league: E('Balkan_League'),
  macstr: E('Macedonian_Struggle'),
  imro: E('Internal_Macedonian_Revolutionary_Organization'),
  london: E('Treaty_of_London_(1913)'),
  londonconf: E('London_Conference_of_1912–1913'),
  bucharest: E('Treaty_of_Bucharest_(1913)'),
  constantinople: E('Treaty_of_Constantinople_(1913)'),
  albania: E('Albanian_Declaration_of_Independence'),
  adrianople: E('Siege_of_Adrianople_(1912–1913)'),
  kumanovo: E('Battle_of_Kumanovo'),
  lule: E('Battle_of_Lule_Burgas'),
  scutari: E('Siege_of_Scutari_(1912–1913)'),
  coup: E('1913_Ottoman_coup_d\'état'),
  kilkis: E('Battle_of_Kilkis–Lachanas'),
  carnegie: E('Report_of_the_International_Commission_to_Inquire_into_the_Causes_and_Conduct_of_the_Balkan_Wars'),
  secint: E('Second_International'),
  basel: E('Basel_manifesto'),
  baselde: DE('Internationaler_Sozialistenkongress_(1912)'),
  blagoev: E('Dimitar_Blagoev'),
  tucovic: E('Dimitrije_Tucović'),
  lapcevic: E('Dragiša_Lapčević'),
  trotsky: E('Leon_Trotsky'),
  trotskyru: RU('Троцкий_о_Балканских_войнах'),
  rakovsky: E('Christian_Rakovsky'),
  narrowbg: BG('Българска_работническа_социалдемократическа_партия_(тесни_социалисти)'),
  lenin1912: 'https://www.marxists.org/archive/lenin/works/1912/nov/07.htm',
  enver: E('Enver_Pasha'),
  ataturk: E('Mustafa_Kemal_Atatürk'),
  metaxas: E('Ioannis_Metaxas'),
  geshov: E('Ivan_Evstratiev_Geshov'),
  ferdinand: E('Ferdinand_I_of_Bulgaria'),
};

module.exports = {
  S,
  sections: [
    {
      heading: { ko: '마케도니아 문제와 발칸 동맹 {bulgaria serbia greece montenegro turkey}', en: 'The Macedonian question and the Balkan League {bulgaria serbia greece montenegro turkey}' },
      paragraphs: [
        {
          ko: '19세기 후반 오스만 제국의 유럽 영토에서 민족국가들이 생겨났지만 그 형성은 끝나지 않았다. 세르비아는 1877~1878년 러시아-튀르크 전쟁으로 영토를 넓혔고, 그리스는 1881년 테살리아를 얻었으며, 1878년 자치공국이 된 불가리아는 1885년 동루멜리아를 합쳤다. 세 나라와 몬테네그로는 모두 아직 오스만이 다스리는 루멜리아, 곧 알바니아·마케도니아·트라키아에 남은 동족을 내세워 더 많은 땅을 노렸다. 그 한가운데가 마케도니아였다. 1893년부터 1912년까지 그리스계와 불가리아계 주민 사이에 학교와 교회를 둘러싼 경쟁이 무장 투쟁으로 번졌고, 1904년부터 1908년까지는 그리스·불가리아·세르비아의 무장대가 마케도니아의 기독교 농민, 특히 슬라브어를 쓰는 주민의 민족 귀속을 놓고 게릴라전을 벌였다. 영어 위키백과의 「마케도니아 투쟁」 항목은 20세기 초까지 이 지역 주민 대부분이 뚜렷한 민족 정체성을 갖지 않았고 민족주의 교육과 선전, 테러에 떠밀려 한쪽을 택해야 했다고 쓴다.',
          en: 'In the late nineteenth century nation-states emerged on the Ottoman Empire\'s European territory, but the process was incomplete. Serbia gained land in the Russo-Turkish War of 1877–1878, Greece acquired Thessaly in 1881, and Bulgaria, an autonomous principality from 1878, absorbed Eastern Rumelia in 1885. All three, together with Montenegro, sought more of Ottoman Rumelia, that is Albania, Macedonia and Thrace, where many of their co-nationals still lived. Macedonia was at the centre. Between 1893 and 1912 rivalry between Greek and Bulgarian subjects over schools and churches turned into armed conflict, and from 1904 to 1908 Greek, Bulgarian and Serbian bands fought a guerrilla war over the Christian peasants of Macedonia, above all over the national allegiance of the Slavic-speaking population. The English Wikipedia article on the Macedonian Struggle notes that at the dawn of the twentieth century most of the local population had no clear national identity and took one only when forced by nationalist education, propaganda and terror.',
          sources: [S.balkan, S.macstr],
        },
        {
          ko: '불가리아 쪽 운동의 중심은 1893년 살로니카에서 생긴 내부 마케도니아 혁명기구였다. 처음에는 마케도니아와 아드리아노플 지역의 자치를 목표로 했으나 1903년 일린덴-프레오브라제니예 봉기가 오스만군에 짓밟혀 마을 100여 곳이 불탄 뒤, 자치와 장래의 발칸 연방을 바라는 좌파 「연방파」와 불가리아와의 통합을 바라는 우파 「중앙파」로 갈라졌다. 1908년 청년 튀르크 혁명은 1876년 헌법과 의회를 되살려 발칸의 여러 민족에게 개혁과 자치의 기대를 주었지만, 1909년 반혁명이 실패한 뒤 청년 튀르크 안에서는 민족주의 분파가 우세해졌다. 같은 해 10월 오스트리아-헝가리는 보스니아·헤르체고비나를 병합했고 불가리아는 독립을 선언했다. 북쪽 길이 막힌 세르비아의 파시치 정부는 노비파자르 산자크와 코소보 같은 「옛 세르비아」로 눈을 돌렸고, 1911년 이탈리아-튀르크 전쟁에서 오스만이 리비아를 잃고 알바니아에서 잇단 봉기가 일어나자 발칸 국가들은 지금이 기회라고 판단했다.',
          en: 'The Bulgarian side of the movement was led by the Internal Macedonian Revolutionary Organization, founded in Salonica in 1893. It first sought autonomy for the Macedonia and Adrianople regions, but after the Ottomans crushed the Ilinden-Preobrazhenie Uprising of 1903 and destroyed some 100 villages, it split into a left-wing "federalist" faction that favoured autonomy and a future Balkan federation and a right-wing "centralist" faction that wanted union with Bulgaria. The Young Turk Revolution of 1908 restored the constitution of 1876 and the parliament and raised hopes of reform and autonomy among the Balkan peoples, but after the failed counter-coup of 1909 the nationalist element of the Young Turks became dominant. In October 1908 Austria-Hungary annexed Bosnia and Herzegovina and Bulgaria declared its independence. Blocked in the north, Pašić\'s Serbian government turned to "Old Serbia", the Sanjak of Novi Pazar and Kosovo, and when the Ottomans lost Libya in the Italo-Turkish War of 1911 and Albania rose in a series of revolts, the Balkan states judged that their moment had come.',
          sources: [S.imro, S.balkan],
        },
        {
          ko: '동맹 교섭은 1911년 하반기부터 모두 비밀리에 진행되었다. 러시아의 감독 아래 세르비아와 불가리아가 1912년 3월 13일 조약을 맺었다. 겉으로는 오스트리아-헝가리를 겨냥했으나 비밀 부속서는 오스만 제국에 맞선 전쟁과 영토 분할을 정했다. 마케도니아는 오흐리드에서 크리바팔랑카에 이르는 선의 동쪽을 불가리아 몫으로 인정한 「무쟁 지역」과 약 1만 1천 제곱킬로미터의 「쟁점 지역」으로 나뉘었고, 쟁점 지역의 귀속은 동맹의 보증인인 러시아 황제가 중재하기로 했다. 1912년 5월 29일 그리스-불가리아 동맹이 영토 분할 규정 없이 맺어졌고, 몬테네그로는 불가리아·세르비아와 차례로 동맹했으며 그리스는 세르비아·몬테네그로와 구두 「신사협정」을 맺었다. 그리스의 가치는 육군보다 에게해를 지배해 오스만의 증원을 막을 해군에 있었다. 이렇게 9월 말까지 발칸 동맹이 갖추어졌지만, 동맹국끼리도 열강과도 오스만 영토를 어떻게 나눌지에 대한 합의는 없었다.',
          en: 'The negotiations, begun in the latter part of 1911, were all conducted in secret. Under close Russian supervision Serbia and Bulgaria signed a treaty on 13 March 1912, ostensibly directed against Austria-Hungary but with a secret annex that redirected it against the Ottoman Empire and set out a partition. Macedonia was divided into an "Uncontested Zone" east of the Ohrid-Kriva Palanka line, recognised as Bulgarian, and a "Contested Zone" of some 11,000 km², whose fate was to be decided by the Russian Emperor as arbiter and guarantor of the alliance. The Greco-Bulgarian alliance of 29 May 1912 made no provision for the division of territory; Montenegro allied with Bulgaria and then Serbia, and Greece reached oral "gentlemen\'s agreements" with Serbia and Montenegro. Greece\'s value lay less in its army than in a navy that could dominate the Aegean and cut off Ottoman reinforcements. By the end of September the Balkan League was complete, but its members had not agreed, either among themselves or with the Great Powers, on how Ottoman territory would be divided.',
          sources: [S.balkan, S.league],
        },
      ],
    },
    {
      heading: { ko: '제1차 발칸 전쟁: 트라키아에서 차탈자까지 {bulgaria turkey}', en: 'The First Balkan War: from Thrace to Çatalca {bulgaria turkey}' },
      paragraphs: [
        {
          ko: '9월 26일 오스만 제국이 트라키아에서 동원하자 세르비아와 불가리아가, 30일에는 그리스가 동원령을 내렸다. 국경 문제 교섭이 깨진 몬테네그로가 10월 8일 맨 먼저 선전포고했고, 세르비아·불가리아·그리스는 10월 13일 공동 최후통첩을 보낸 뒤 17일 전쟁에 들어갔다. 영어 위키백과의 「제1차 발칸 전쟁」은 오스만 정부가 10월 1일에 시작한 동원을 다 마치지 못한 채 서둘러 선전포고한 것을 패전의 주원인으로 꼽는다. 개전 때 발칸 동맹군 91만 2천 명이 오스만군 58만 명과 맞섰고, 오스만의 여러 사단은 아직 리비아에서 이탈리아와 싸우고 있었다. 인구 약 2,600만의 제국이었지만 그 4분의 3이 아시아에 살아 증원은 바다를 건너야 했는데, 엘리와 렘노스 해전에서 그리스 해군에 두 번 진 오스만 함대는 에게해를 내주었다.',
          en: 'When the Ottoman Empire mobilised in Thrace on 26 September, Serbia and Bulgaria ordered mobilisation, followed by Greece on the 30th. Montenegro, whose border negotiations had failed, declared war first on 8 October; Serbia, Bulgaria and Greece delivered a common ultimatum on 13 October and went to war on the 17th. The English Wikipedia article on the First Balkan War names as the principal reason for the Ottoman defeat the government\'s decision to declare war before the mobilisation ordered on 1 October was complete. At the outbreak 912,000 soldiers of the Balkan League faced 580,000 Ottoman troops, while many Turkish divisions were still fighting Italy in Libya. The empire had about 26 million people, but three-quarters lived in Asia and reinforcements had to come by sea; twice defeated by the Greek navy at Elli and Lemnos, the Ottoman fleet gave up the Aegean.',
          sources: [S.balkan, S.first],
        },
        {
          ko: '동맹의 주력은 불가리아군이었다. 불가리아는 개전 때 모두 59만 9,878명을 동원했고, 페르디난드 1세는 이 전쟁을 「초승달에 맞선 십자가의 정의롭고 위대하며 신성한 투쟁」이라 선언했다. 동부 트라키아에 투입된 29만 7천여 명의 불가리아 3개 군은 오스만군의 공세 계획을 무너뜨리고 크르크킬리세를 저항 없이 차지했으며, 10월 28일부터 11월 2일까지 뤼레부르가즈-프나르히사르 전투에서 12만 6천 명의 오스만군을 격파했다. 투입 병력으로 보아 보불전쟁과 1차 세계대전 사이에 유럽에서 벌어진 가장 큰 전투였다. 요새 에디르네(아드리아노플)에는 6만 1,250명의 수비대가 고립되었다. 오스만군은 수도에서 30킬로미터 떨어진 차탈자 방어선까지 물러났다.',
          en: 'The Bulgarian army was the leading army of the coalition. At the outbreak Bulgaria mobilised 599,878 men in all, and Ferdinand I proclaimed the war "a just, great and sacred struggle of the Cross against the Crescent". Three Bulgarian armies of some 297,000 men in eastern Thrace wrecked the Ottoman offensive plan and took Kirk Kilisse without resistance and, from 28 October to 2 November, defeated an Ottoman army of 126,000 riflemen at Lule Burgas-Bunarhisar, in terms of forces engaged the largest battle fought in Europe between the Franco-Prussian War and the First World War. The fortress of Adrianople (Edirne), with some 61,250 men, was cut off and besieged. The Ottomans fell back to the Çatalca Line, 30 km from their capital.',
          sources: [S.first, S.second, S.lule, S.ferdinand],
        },
        {
          ko: '11월 17일 불가리아군은 러시아가 콘스탄티노폴리스를 점령하면 공격하겠다고 경고했는데도 17만 6,351명과 대포 462문으로 차탈자 선을 공격했으나, 아시아에서 온 증원군으로 보강한 14만 571명의 오스만군에 막혔다. 뤼레부르가즈 전투 뒤 불가리아군에는 콜레라가 퍼져 있었다. 12월 3일 오스만과 불가리아(세르비아·몬테네그로 대표)는 휴전에 합의했고 강화 교섭은 런던으로 넘어갔다. 그리스는 휴전에 서명하지 않고 에페이로스에서 작전을 이어 갔다. 불가리아가 제1차 전쟁에서 잃은 회복 불가능한 인명은 전사 1만 4천 명, 병사 1만 9천 명으로 모두 3만 3천 명이었다.',
          en: 'On 17 November, despite clear warnings that Russia would attack the Bulgarians if they occupied Constantinople, 176,351 Bulgarian troops with 462 guns assaulted the Çatalca Line, but 140,571 Ottoman troops, stiffened by fresh reinforcements from Asia, threw them back. Cholera had spread among the Bulgarian soldiers after Lule Burgas. On 3 December the Ottomans and Bulgaria, representing Serbia and Montenegro as well, agreed to an armistice and peace negotiations moved to London. Greece did not sign the truce and continued operations in Epirus. Bulgaria\'s non-recoverable losses in the First Balkan War were 33,000 men, 14,000 killed and 19,000 dead of disease.',
          sources: [S.first, S.second, S.londonconf],
        },
      ],
    },
    {
      heading: { ko: '마케도니아·알바니아 전선과 알바니아 독립 {serbia greece montenegro albania}', en: 'The Macedonian and Albanian fronts and Albanian independence {serbia greece montenegro albania}' },
      paragraphs: [
        {
          ko: '세르비아의 주목표는 바르다르 마케도니아였다. 라도미르 푸트니크가 이끄는 세르비아군은 10월 23~24일 쿠마노보 전투에서 오스만 바르다르군을 꺾었고, 비톨라(모나스티르) 전투로 그 잔존 부대를 알바니아 중부로 몰아냈다. 그 뒤 파시치가 테살로니키 경쟁에 끼라고 요구했으나 푸트니크는 그리스와 불가리아가 테살로니키를 두고 싸우는 편이 세르비아의 바르다르 마케도니아 계획에 유리하다고 보고 군대를 서쪽 알바니아로 돌려 아드리아해에 이르렀다. 그리스군은 왕세자 콘스탄티노스의 지휘로 사란다포로 협곡과 야니차를 넘었고, 11월 8일(영어 「제1차 발칸 전쟁」 항목은 9일) 하산 타흐신 파샤가 테살로니키와 수비대 2만 6천 명을 그리스에 넘겼다. 북쪽에서 서둘러 내려온 불가리아 제7릴라 사단은 하루 늦게 도착했다. 총리 베니젤로스는 왕세자에게 「무슨 대가를 치르더라도 살로니카를」 차지하라고 압박했었다.',
          en: 'Serbia\'s primary objective was Vardar Macedonia. Under Radomir Putnik the Serbian army beat the Ottoman Vardar Army at Kumanovo on 23–24 October and drove its remnants into central Albania after the battle of Monastir (Bitola). When Pašić then asked Putnik to join the race for Thessaloniki, Putnik declined, judging that a Greek-Bulgarian war over the city would help Serbia\'s plans for Vardar Macedonia, and turned his army west into Albania, reaching the Adriatic. The Greek army under Crown Prince Constantine forced the Sarantaporo pass and won at Giannitsa, and on 8 November (9 November in the English First Balkan War article) Hasan Tahsin Pasha surrendered Thessaloniki and its garrison of 26,000 men to the Greeks. The Bulgarian 7th Rila Division, hurrying from the north, arrived a day later. Prime Minister Venizelos had pressed the crown prince to take "Salonique à tout prix".',
          sources: [S.first, S.balkan, S.kumanovo],
        },
        {
          ko: '알바니아인 대부분은 개전 때 자기 땅이 분할되지 않도록 오스만 편에 섰지만, 오스만 군대와 행정은 그들을 지키지 못했다. 세르비아는 알바니아 자치주 구상에 반대하며 오스만 유럽 영토를 동맹 네 나라가 나눠 갖기를 바랐다. 알바니아 영토가 분할될 위기에 놓이자 이스마일 케말리는 빈에서 오스트리아-헝가리의 지지를 얻고 블로러로 가서, 1912년 11월 28일 40명의 대표가 모인 블로러 회의에서 알바니아 독립을 선언했다. 12월 4일 그를 수반으로 하는 정부가 섰다. 선언 당시 대표들이 실제로 장악한 도시는 블로러 하나뿐이었지만 권력 공백 속에서 효과가 있었다. 런던 대사회의는 12월 17일 알바니아 독립을 사실상 인정했고, 국제 사회가 알바니아를 중립 세습 공국으로 승인한 것은 제2차 전쟁 뒤인 1913년 7월 29일이었다.',
          en: 'At the outbreak of the war most Albanians sided with the Ottomans to keep their lands from being partitioned, but the Ottoman army and administration failed to protect them. Serbia opposed the plan for an Albanian vilayet and preferred a partition of Ottoman Europe among the four allies. With Albanian lands facing partition, Ismail Qemali secured Austro-Hungarian backing in Vienna and went to Vlorë, where on 28 November 1912 an assembly of 40 delegates declared Albania independent; on 4 December a government under him was formed. Vlorë was the only town the delegates actually controlled, yet the declaration proved effective in the vacuum of power. The London Conference of Ambassadors recognised Albanian independence de facto on 17 December, and the international community recognised Albania as a neutral, sovereign and hereditary principality only on 29 July 1913, after the Second Balkan War.',
          sources: [S.first, S.albania],
        },
        {
          ko: '서부 전선의 점령에는 민간인 학살이 뒤따랐다. 영어 위키백과는 당대 기록을 들어 개전 뒤 두세 달에서 넉 달 사이 코소보주에서 알바니아인 2만~2만 5천 명이 살해되었고, 제2차 전쟁이 끝날 때까지 알바니아인 사망자가 12만 명을 넘었다고 적는다. 몬테네그로는 슈코드라(스쿠타리)를 1912년 10월 28일부터 포위했다. 열강이 1913년 4월 10일부터 몬테네그로 해안을 봉쇄했는데도 니콜라 1세는 포위를 이어 갔고, 4월 23일 에사드 파샤가 항복했다. 그러나 독립 알바니아를 앞세운 열강의 압력으로 몬테네그로는 이 도시를 내놓아야 했다. 아드리아해 항구를 얻지 못한 세르비아도 오스트리아-헝가리의 최후통첩을 받고 알바니아에서 물러났다. 세르비아 사회민주당의 디미트리예 투초비치는 이 원정에 병사로 동원되어 전선에서 민간인에 대한 전쟁범죄를 고발하는 편지를 당 기관지 『노동자 신문』에 보냈다.',
          en: 'Occupation on the western front brought massacres of civilians. Citing contemporary accounts, English Wikipedia states that some 20,000–25,000 Albanians in the Kosovo Vilayet were killed in the first two to four months of the conflict and that Albanian deaths exceeded 120,000 by the end of the Second Balkan War. Montenegro besieged Shkodër (Scutari) from 28 October 1912. Although the Great Powers blockaded the Montenegrin coast from 10 April 1913, Nikola I pressed the siege, and on 23 April Essad Pasha surrendered; but the Powers, set on an independent Albania, made Montenegro give the city up. Denied an Adriatic port, Serbia too withdrew from Albania after an Austro-Hungarian ultimatum. Dimitrije Tucović of the Serbian Social Democratic Party, mobilised for the campaign, sent letters from the front about war crimes against civilians to the party paper, the Workers\' Newspaper.',
          sources: [S.first, S.scutari, S.balkan, S.tucovic],
        },
      ],
    },
    {
      heading: { ko: '런던 회의, 1913년 쿠데타와 런던 조약 {turkey bulgaria serbia greece}', en: 'The London Conference, the coup of 1913 and the Treaty of London {turkey bulgaria serbia greece}' },
      paragraphs: [
        {
          ko: '오스트리아-헝가리·프랑스·영국·독일·이탈리아·러시아의 대사들이 1912년 12월 런던 세인트제임스 궁전에서 에드워드 그레이를 의장으로 모였고, 12월 16일부터 교전국 대표들의 강화 회의가 열렸다. 쟁점은 알바니아의 지위, 노비파자르 산자크, 그리고 코소보·마케도니아·트라키아의 귀속이었다. 아드리아해를 세르비아에 내주지 않으려는 오스트리아-헝가리와 이탈리아는 독립 알바니아를 강하게 밀었고, 러시아는 세르비아와 몬테네그로를 지지했다. 교섭의 고비는 에디르네였다. 불가리아의 에디르네 할양 요구가 다가오고 대재상 카밀 파샤가 강화 교섭을 이어 가자, 1913년 1월 23일 엔베르 파샤와 탈라트가 이끄는 통일진보위원회 회원 약 50명이 정부 청사(바브알리)를 습격했다. 육군장관 나즘 파샤가 살해되고 카밀 파샤는 총구 앞에서 사임했다. 새 정부는 런던 회의에서 철수하고 2월 3일 전쟁을 재개했다.',
          en: 'The ambassadors of Austria-Hungary, France, Britain, Germany, Italy and Russia met at St James\'s Palace in London in December 1912 under Sir Edward Grey, and from 16 December the peace conference of the belligerents sat there. The issues were the status of Albania, the Sanjak of Novi Pazar, and the fate of Kosovo, Macedonia and Thrace. Austria-Hungary and Italy, unwilling to let Serbia reach the Adriatic, strongly supported an independent Albania, while Russia backed Serbia and Montenegro. The sticking point was Edirne. With the Bulgarian demand for its cession looming and Grand Vizier Kâmil Pasha pursuing the peace talks, about fifty members of the Committee of Union and Progress led by Enver and Talât raided the Sublime Porte on 23 January 1913. War Minister Nazım Pasha was killed and Kâmil Pasha resigned at gunpoint. The new government withdrew from the London conference and hostilities resumed on 3 February.',
          sources: [S.londonconf, S.london, S.coup, S.enver],
        },
        {
          ko: '열강은 공식적으로는 오스만 제국의 영토 보전에 합의하고 발칸 국가들에 엄중히 경고했지만, 비공식적으로는 저마다 다른 신호를 보내 그 경고를 스스로 무력화했다. 러시아는 발칸 동맹 결성의 주역으로서 동맹을 오스트리아-헝가리와의 장래 전쟁에 쓸 도구로 보았으나, 자기들이 오래 노려 온 콘스탄티노폴리스와 해협을 향한 불가리아의 계획은 알지 못했다. 1912년의 프랑스는 독일과 싸울 준비가 안 되었다고 보고, 발칸 동맹의 행동에서 비롯된 러시아와 오스트리아-헝가리의 충돌에는 끼지 않겠다고 동맹국 러시아에 통보했다. 영국은 러시아의 영향력을 견제하려고 그리스의 동맹 가입을 은밀히 부추겼다. 오스트리아-헝가리는 세르비아의 팽창 자체를 적대시했다. 빌헬름 2세는 처음에 프란츠 페르디난트 대공에게 세계대전의 위험을 무릅쓰고라도 오스트리아를 지원하겠다고 말했지만, 1912년 12월 8일 독일 제국 전쟁회의는 독일이 적어도 1914년 중반까지는 전쟁 준비가 안 된다고 결론짓고 그 뜻을 빈에 전했다.',
          en: 'Officially the Great Powers agreed on the territorial integrity of the Ottoman Empire and sternly warned the Balkan states, but unofficially each sent different signals that cancelled the warning. Russia, a prime mover in the founding of the League, saw it as a tool for a future war against Austria-Hungary, yet was unaware of Bulgarian plans for Constantinople and the Straits, on which it had long-held ambitions. France, not feeling ready for war with Germany in 1912, firmly told its Russian ally that it would not join a Russo-Austrian conflict arising from the League\'s actions. Britain secretly encouraged Greek entry into the League to counteract Russian influence. Austria-Hungary was opposed to Serbian expansion as such. Wilhelm II at first told Archduke Franz Ferdinand that Germany would support Austria even at the risk of a world war, but the German Imperial War Council of 8 December 1912 concluded that Germany would not be ready for war until at least mid-1914 and passed that view on to Vienna.',
          sources: [S.balkan],
        },
        {
          ko: '재개된 전쟁은 오스만에 아무것도 돌려주지 못했다. 2월 오스만군은 갈리폴리 반도의 볼라이르와 마르마라해 연안 샤르쾨이에서 상륙 협공을 시도했으나 엔베르·알리 페트히·무스타파 케말 사이의 연락 부족으로 실패했다. 3월 6일 그리스군이 비자니 요새를 뚫고 이오아니나를 차지했다. 3월 26일에는 불가리아 제2군 10만 6,425명과 세르비아 2개 사단 4만 7,275명이 에디르네를 함락했다. 최종 공격에서 불가리아군 8,093명, 세르비아군 1,462명이 사상했다. 에디르네에서 소령으로 싸운 카즘 카라베키르도 포로가 되어 1913년 10월에야 풀려났다. 불가리아의 검열은 외국 특파원의 전보에서 세르비아군의 참여를 지웠고, 세르비아는 자기들이 조약에도 없던 불가리아의 영토를 위해 피를 흘렸다고 항의했다. 영어 위키백과는 이 전투가 두 나라 대결의 씨앗을 뿌렸다고 평가한다.',
          en: 'The resumed war gave the Ottomans nothing back. In February they tried a combined landing at Bulair on the Gallipoli peninsula and at Şarköy on the Sea of Marmara, but it was bungled through poor communication between Enver, Ali Fethi and Mustafa Kemal. On 6 March the Greeks broke through at Bizani and took Ioannina. On 26 March 106,425 men of the Bulgarian Second Army and 47,275 men of two Serbian divisions captured Edirne; the final assault cost the Bulgarians 8,093 and the Serbs 1,462 casualties. Kâzım Karabekir, a major at Edirne, was taken prisoner and held until October 1913. The Bulgarian censor cut every reference to Serbian participation from foreign correspondents\' telegrams, and Serbia protested that it had shed blood for Bulgarian territory never foreseen in their treaty. English Wikipedia judges that the battle planted the seeds of the two countries\' confrontation.',
          sources: [S.first, S.enver, S.adrianople],
        },
        {
          ko: '1913년 런던 조약은 5월 30일 오스만 대표단 없이 서명되었다. 에게해의 에노스와 흑해의 미디아를 잇는 선의 서쪽 오스만 유럽 영토 전부가 알바니아를 빼고 발칸 동맹에 넘어갔고, 크레타도 동맹국 군주들에게 양도되었다. 알바니아의 국경과 그 밖의 알바니아 문제는 열강이 정하기로 했다. 그러나 조약은 넘겨받은 땅을 동맹국끼리 어떻게 나눌지 정하지 않았다. 세르비아는 1912년 3월 불가리아와 합의한 분할을 이행하지 않겠다고 했고, 그리스와 세르비아는 마케도니아에서 공동 국경을 만들려 했다. 바로 그날 불가리아 총리 이반 게쇼프는 옛 동맹국과 전쟁을 벌이려는 차르의 정책에 반대해 사임했다.',
          en: 'The 1913 Treaty of London was signed on 30 May without the Ottoman delegation. All Ottoman territory in Europe west of the line from Enos on the Aegean to Midia on the Black Sea, except Albania, was ceded to the Balkan League, and Crete was ceded to the allied sovereigns. The borders of Albania and all other Albanian questions were left to the Great Powers. But the treaty did not decide how the ceded land was to be divided among the allies. Serbia refused to carry out the division agreed with Bulgaria in March 1912, and Greece and Serbia sought a common border in Macedonia. That same day the Bulgarian prime minister Ivan Geshov resigned, opposing the tsar\'s policy of making war on the allies.',
          sources: [S.london, S.balkan, S.geshov],
        },
      ],
    },
  ],
};
