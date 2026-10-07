// New glossary terms for the Balkan Wars event (queue 2064, 2026-10-07).
// Built with lib.js term(); fields.original (native form) and fields.region are
// added below because term() does not take them. Categories are the 12 of
// commulingo_term_categories; region is one of commulingo_term_regions.
// SEARCH_ONLY lists aliases that stay search-only in the link review
// (undated treaty names that other treaties share, and acronyms).
const { term } = require('./lib');

const E = t => 'https://en.wikipedia.org/wiki/' + encodeURI(t);
const S = {
  balkan: E('Balkan_Wars'),
  league: E('Balkan_League'),
  london: E('Treaty_of_London_(1913)'),
  londonconf: E('London_Conference_of_1912–1913'),
  bucharest: E('Treaty_of_Bucharest_(1913)'),
  second: E('Second_Balkan_War'),
  albania: E('Albanian_Declaration_of_Independence'),
  qemali: E('Ismail_Qemali'),
  imro: E('Internal_Macedonian_Revolutionary_Organization'),
  macstr: E('Macedonian_Struggle'),
  coup: E('1913_Ottoman_coup_d\'état'),
  enver: E('Enver_Pasha'),
};
const EVENTS = ['balkan-wars-1912-1913'];

// term() writes one period string to both languages; give each language its own.
const withMeta = (t, { original, region = 'europe', periodKo, periodEn }) => {
  t.fields.original = original;
  t.fields.region = region;
  if (periodKo || periodEn) t.fields.period = { ko: periodKo || t.fields.period.ko, en: periodEn || t.fields.period.en };
  return t;
};

module.exports = [
  withMeta(term({
    id: 'balkan-league-1912', ko: '발칸 동맹 (1912)', en: 'Balkan League (1912)', category: 'diplomacy', period: '1912–1913', startYear: 1912, endYear: 1913,
    definition: ['1912년 불가리아·세르비아·그리스·몬테네그로가 오스만 제국에 맞서 맺은 양자 조약들의 연합. 러시아의 후원 아래 결성되어 제1차 발칸 전쟁에서 이겼으나, 마케도니아 분할을 두고 갈라져 1913년 제2차 발칸 전쟁으로 무너졌다.',
      'The coalition of bilateral treaties concluded in 1912 by Bulgaria, Serbia, Greece and Montenegro against the Ottoman Empire. Formed under Russian patronage, it won the First Balkan War but broke apart over the partition of Macedonia, collapsing in the Second Balkan War of 1913.'],
    body: ['동맹의 중심은 1912년 3월 13일 러시아의 감독 아래 맺은 세르비아-불가리아 조약이었다. 겉으로는 오스트리아-헝가리를 겨냥했지만 비밀 부속서는 오스만 제국에 맞선 전쟁과 마케도니아 분할을 정했다. 오흐리드-크리바팔랑카 선 동쪽은 불가리아 몫인 「무쟁 지역」, 약 1만 1천 제곱킬로미터의 북서부는 러시아 황제가 중재할 「쟁점 지역」이었다. 5월 29일 그리스-불가리아 조약은 영토 분할을 정하지 않았고, 몬테네그로는 불가리아·세르비아와 각각 동맹했으며 그리스와 세르비아·몬테네그로 사이에는 구두 「신사협정」만 있었다. 교섭은 모두 비밀이었고 조약문은 전쟁이 끝난 뒤 파리의 『르 마탱』에 프랑스어 번역으로 공개되었다.\n\n불가리아군이 동맹의 주력으로 트라키아 전선을, 세르비아군이 마케도니아 전선을 맡았고, 그리스는 에게해를 지배해 오스만의 증원을 끊을 해군 때문에 필요했다. 동맹군은 1912년 10월 개전 뒤 오스만의 유럽 영토 대부분을 차지했다. 그러나 알바니아 독립으로 아드리아해 항구를 잃은 세르비아가 마케도니아 분할 조항의 재조정을 요구하고, 그리스와 세르비아가 1913년 6월 1일 불가리아에 맞선 동맹을 맺으면서 동맹은 사실상 해체되었다. 영어 위키백과는 동맹의 붕괴가 러시아의 대오스트리아 방어 체계에 결정적 타격이 되었다고 평가한다.',
      'The core of the League was the Serbo-Bulgarian treaty signed under Russian supervision on 13 March 1912. Ostensibly directed against Austria-Hungary, its secret annex provided for war against the Ottoman Empire and a partition of Macedonia: the land east of the Ohrid-Kriva Palanka line was an "Uncontested Zone" recognised as Bulgarian, while some 11,000 km² in the northwest formed a "Contested Zone" to be arbitrated by the Russian Emperor. The Greco-Bulgarian treaty of 29 May set no division of territory; Montenegro allied separately with Bulgaria and Serbia, while Greece had only oral "gentlemen\'s agreements" with Serbia and Montenegro. All the negotiations were secret, and the treaties were published in French translation in Le Matin in Paris after the wars.\n\nThe Bulgarian army, the leading force of the coalition, took the Thracian front and the Serbian army the Macedonian front, while Greece was needed for a navy that could dominate the Aegean and cut off Ottoman reinforcements. After war began in October 1912 the allies seized most of the Ottoman Empire\'s European territory. But when Serbia, denied an Adriatic port by Albanian independence, demanded revision of the Macedonian partition and Greece and Serbia allied against Bulgaria on 1 June 1913, the League effectively dissolved. English Wikipedia judges its collapse a vital blow to Russia\'s system of defence against Austria-Hungary.'],
    aliases: { ko: ['발칸 동맹', '발칸 연합 (1912)'], en: ['Balkan League', 'Balkan Alliance (1912)'] },
    people: ['nikola-pasic', 'eleftherios-venizelos', 'ivan-geshov', 'ferdinand-i-of-bulgaria', 'nikola-i-of-montenegro', 'ioannis-metaxas', 'nicholas-ii'], events: EVENTS,
    sources: [S.league, S.balkan], locator: 'lead; Pre-War treaties',
  }), { original: 'Балкански съюз / Балкански савез / Βαλκανικός Σύνδεσμος', periodKo: '1912년 3월 ~ 1913년 6월', periodEn: 'March 1912 – June 1913' }),

  withMeta(term({
    id: 'treaty-of-london-1913', ko: '런던 조약 (1913)', en: 'Treaty of London (1913)', category: 'diplomacy', period: '30 May 1913', startYear: 1913, endYear: 1913,
    definition: ['1913년 5월 30일 런던 회의에서 발칸 동맹 4개국과 오스만 제국 사이에 맺어진 제1차 발칸 전쟁의 강화조약. 에노스-미디아 선 서쪽의 오스만 유럽 영토를 알바니아를 빼고 동맹에 넘기고, 알바니아 문제를 열강에 맡겼다.',
      'The peace treaty of the First Balkan War, concluded on 30 May 1913 at the London Conference between the four Balkan League states and the Ottoman Empire. It ceded Ottoman Europe west of the Enos-Midia line, except Albania, to the League and left the Albanian question to the Great Powers.'],
    body: ['1912년 12월 3일 휴전 뒤 런던에서 열강의 대사회의와 교전국의 강화 회의가 함께 열렸다. 쟁점은 대부분 세르비아가 점령한 알바니아의 지위, 1878년 이래 오스트리아-헝가리의 보호 아래 있던 노비파자르 산자크, 그리고 코소보·마케도니아·트라키아의 귀속이었다. 오스트리아-헝가리와 이탈리아는 세르비아의 아드리아해 진출을 막으려 독립 알바니아를 밀었고, 러시아는 세르비아와 몬테네그로를 지지했으며 독일과 영국은 중립을 지켰다. 1913년 1월 23일 엔베르 파샤의 쿠데타로 오스만은 회의에서 철수했고, 조약은 오스만 대표단 없이 서명되었다.\n\n조약에 따라 에게해의 에노스와 흑해의 미디아를 잇는 선 서쪽의 오스만 유럽 영토가 알바니아를 빼고 동맹국 군주들에게 넘어갔고, 술탄은 크레타에 대한 모든 주권을 포기했다. 알바니아의 국경과 그 밖의 알바니아 문제는 열강이 정하기로 했다. 그러나 넘겨받은 땅을 동맹국끼리 어떻게 나눌지는 정하지 않았다. 세르비아가 1912년 불가리아와 합의한 분할을 거부하자 불가리아는 6월 옛 동맹국을 공격했고, 국경은 8월 부쿠레슈티 조약과 9월 콘스탄티노폴리스 조약으로 다시 그어졌다. 불가리아 총리 이반 게쇼프는 조약이 서명된 날 사임했다.',
      'After the armistice of 3 December 1912, an ambassadors\' conference of the Great Powers and a peace conference of the belligerents met together in London. The disputes concerned the status of Albania, most of which Serbia had occupied, the Sanjak of Novi Pazar, under Austro-Hungarian protection since 1878, and the fate of Kosovo, Macedonia and Thrace. Austria-Hungary and Italy pressed for an independent Albania to keep Serbia from the Adriatic, Russia backed Serbia and Montenegro, and Germany and Britain stayed neutral. Enver Pasha\'s coup of 23 January 1913 withdrew the Ottomans from the conference, and the treaty was signed without the Ottoman delegation.\n\nUnder the treaty all Ottoman territory in Europe west of the line from Enos on the Aegean to Midia on the Black Sea, except Albania, passed to the allied sovereigns, and the sultan renounced all sovereignty over Crete. The borders of Albania and all other Albanian questions were left to the Great Powers. The treaty did not, however, say how the ceded land was to be divided among the allies. When Serbia refused the partition agreed with Bulgaria in 1912, Bulgaria attacked its former allies in June, and the borders were redrawn by the Treaty of Bucharest in August and the Treaty of Constantinople in September. The Bulgarian prime minister Ivan Geshov resigned on the day the treaty was signed.'],
    aliases: { ko: ['1913년 런던 조약', '런던 조약'], en: ['1913 Treaty of London', 'Treaty of London'] },
    people: ['nikola-pasic', 'eleftherios-venizelos', 'ivan-geshov', 'enver-pasha', 'ioannis-metaxas'], events: EVENTS,
    sources: [S.london, S.londonconf, S.balkan], locator: 'History; Terms',
  }), { original: 'Traité de Londres (1913)', periodKo: '1913년 5월 30일', periodEn: '30 May 1913' }),

  withMeta(term({
    id: 'treaty-of-bucharest-1913', ko: '부쿠레슈티 조약 (1913)', en: 'Treaty of Bucharest (1913)', category: 'diplomacy', period: '10 August 1913', startYear: 1913, endYear: 1913,
    definition: ['1913년 8월 10일 불가리아와 루마니아·세르비아·몬테네그로·그리스가 맺은 제2차 발칸 전쟁의 강화조약. 마케도니아를 세르비아·그리스·불가리아로 나누고 남도브루자를 루마니아에 넘겼다.',
      'The peace treaty of the Second Balkan War, concluded on 10 August 1913 by Bulgaria with Romania, Serbia, Montenegro and Greece. It partitioned Macedonia among Serbia, Greece and Bulgaria and gave Southern Dobruja to Romania.'],
    body: ['루마니아군이 소피아 가까이 다가오자 고립된 불가리아는 휴전과 강화 교섭에 응했다. 7월 30일 부쿠레슈티에 세르비아의 파시치, 몬테네그로의 부코티치, 그리스의 베니젤로스, 루마니아의 마요레스쿠, 불가리아의 재무장관 톤체프가 모여 31일부터 휴전하기로 했다. 루마니아가 오스만의 참가를 거부해 오스만은 회의에 끼지 못했다. 열강은 큰 영향력을 행사했지만 회의를 지배하지는 않았고, 그리스-불가리아 국경은 러시아와 오스트리아-헝가리가 회의에 낸 각서에 따라 그어졌다.\n\n세르비아는 오흐리드·비톨라·코소보·슈티프·코차니와 노비파자르 산자크 동쪽 절반을 얻어 영토가 4만 8,300제곱킬로미터에서 8만 7,780제곱킬로미터로 늘고 인구가 150만 명 넘게 불었다. 그리스는 테살로니키와 카발라를 포함한 남부 마케도니아와 남부 에페이로스를 얻어 면적이 6만 4,790제곱킬로미터에서 10만 8,610제곱킬로미터로, 인구가 266만 명에서 436만 3천 명으로 늘었다. 루마니아는 남도브루자를, 몬테네그로는 산자크 서쪽 절반을 얻었다. 불가리아에는 스트루미차 일대와 에게해 연안의 서트라키아만 남았다. 오스만은 따로 불가리아와 콘스탄티노폴리스 조약(9월), 그리스와 아테네 조약(11월 14일)을 맺었다. 서명일은 출처에 따라 8월 10일 또는 12일로 적힌다.',
      'With Romanian troops approaching Sofia, an isolated Bulgaria accepted an armistice and peace talks. On 30 July Pašić for Serbia, Vukotić for Montenegro, Venizelos for Greece, Maiorescu for Romania and the finance minister Tonchev for Bulgaria met in Bucharest and agreed to an armistice from the 31st. Romania refused to let the Ottomans take part. The Great Powers maintained a very influential presence but did not dominate the proceedings, and the Greco-Bulgarian border followed notes presented by Russia and Austria-Hungary.\n\nSerbia gained Ohrid, Monastir, Kosovo, Štip, Kočani and the eastern half of the Sanjak of Novi Pazar, growing from 48,300 to 87,780 km² and adding more than 1.5 million people. Greece gained southern Macedonia with Thessaloniki and Kavala and southern Epirus, growing from 64,790 to 108,610 km² and from 2,660,000 to 4,363,000 inhabitants. Romania took Southern Dobruja and Montenegro the western half of the Sanjak. Bulgaria kept only the Strumica district and western Thrace with its Aegean coast. The Ottomans made separate treaties with Bulgaria (Constantinople, September) and Greece (Athens, 14 November). Sources date the signature to 10 or 12 August.'],
    aliases: { ko: ['1913년 부쿠레슈티 조약', '부쿠레슈티 조약', '부쿠레슈티 강화 (1913)'], en: ['1913 Treaty of Bucharest', 'Treaty of Bucharest', 'Peace of Bucharest (1913)'] },
    people: ['nikola-pasic', 'eleftherios-venizelos', 'ferdinand-i-of-bulgaria'], events: EVENTS,
    sources: [S.bucharest, S.second, S.balkan], locator: 'Background; Gains in territory',
  }), { original: 'Tratatul de la București (1913)', periodKo: '1913년 8월 10일', periodEn: '10 August 1913' }),

  withMeta(term({
    id: 'albanian-declaration-of-independence-1912', ko: '알바니아 독립 선언 (1912)', en: 'Albanian Declaration of Independence (1912)', category: 'events', period: '28 November 1912', startYear: 1912, endYear: 1912,
    definition: ['1912년 11월 28일 블로러에 모인 알바니아 대표 40명이 이스마일 케말리의 주도로 오스만 제국으로부터 알바니아의 독립을 선언한 일. 발칸 동맹국들이 알바니아 땅을 나눠 가지려 하던 제1차 발칸 전쟁 중에 이루어졌다.',
      'The proclamation, on 28 November 1912 at Vlorë, of Albania\'s independence from the Ottoman Empire by an assembly of 40 Albanian delegates led by Ismail Qemali, made during the First Balkan War as the Balkan allies moved to partition Albanian lands.'],
    body: ['1912년 알바니아 봉기의 성공은 이웃 나라들에 오스만 제국이 약하다는 신호를 주었다. 세르비아는 알바니아 자치주 구상에 반대하고 오스만 유럽 영토를 동맹 네 나라가 나눠 갖기를 바랐다. 개전 뒤 동맹군이 알바니아 땅 대부분을 점령하자, 이스마일 케말리는 오스트리아-헝가리의 지지를 얻어 블로러로 돌아와 전 알바니아 회의를 소집했다. 11월 28일 오후 블로러의 제밀 베이 저택에서 열린 회의에서 대표들은 「알바니아는 오늘부터 스스로 서서 자유롭고 독립된다」고 결정했다. 선언문은 알바니아어의 게그·토스크 방언과 오스만 튀르크어로 쓰였고 서명자는 40명이었다.\n\n12월 4일 케말리를 수반으로 하는 정부와 원로회의가 섰다. 당시 대표들이 실제로 장악한 도시는 블로러뿐이었고 그리스 해군은 12월 3일부터 블로러 항을 봉쇄했지만, 선언은 권력 공백 속에서 효과를 냈다. 런던 대사회의는 12월 17일 독립을 사실상 인정했고, 제2차 발칸 전쟁과 슈코드라 문제가 정리된 뒤인 1913년 7월 29일 열강은 알바니아를 중립 세습 공국으로 승인했다.',
      'The success of the Albanian Revolt of 1912 signalled to the neighbouring states that the Ottoman Empire was weak. Serbia opposed the plan for an Albanian vilayet and preferred a partition of Ottoman Europe among the four allies. When the allied armies occupied most Albanian lands after the outbreak of war, Ismail Qemali returned to Vlorë with Austro-Hungarian support and convened an all-Albanian congress. On the afternoon of 28 November, meeting at the house of Xhemil Bey in Vlorë, the delegates decided "with one voice" that "Albania today is to be on its own, free and independent". The declaration, written in Gheg and Tosk Albanian and Ottoman Turkish, bore forty signatures.\n\nOn 4 December a government under Qemali and a Council of Elders were set up. Vlorë was the only town the delegates controlled, and the Greek navy blockaded its port from 3 December, yet the declaration proved effective in the vacuum of power. The London Conference of Ambassadors recognised independence de facto on 17 December, and on 29 July 1913, after the Second Balkan War and the settlement of the Shkodër question, the Powers recognised Albania as a neutral, sovereign and hereditary principality.'],
    aliases: { ko: ['알바니아 독립 선언', '블로러 독립 선언', '블로러 회의 (1912)'], en: ['Albanian Declaration of Independence', 'Vlorë Declaration of Independence', 'Assembly of Vlorë'] },
    people: ['ismail-qemali', 'nikola-pasic'], events: EVENTS,
    sources: [S.albania, S.qemali], locator: 'lead; Independence; Assembly of Vlorë',
  }), { original: 'Deklarata e Pavarësisë së Shqipërisë', periodKo: '1912년 11월 28일', periodEn: '28 November 1912' }),

  withMeta(term({
    id: 'internal-macedonian-revolutionary-organization', ko: '내부 마케도니아 혁명기구', en: 'Internal Macedonian Revolutionary Organization', category: 'nationalities', period: '1893–1934', startYear: 1893, endYear: 1934,
    definition: ['1893년 오스만령 살로니카에서 세워진 마케도니아·아드리아노플 지역의 비밀 혁명 조직. 처음에는 두 지역의 자치를 목표로 1903년 일린덴-프레오브라제니예 봉기를 일으켰고, 발칸 전쟁 때는 불가리아군을 도와 싸웠다.',
      'A secret revolutionary organisation of the Macedonia and Adrianople regions founded in Ottoman Salonica in 1893. It first sought autonomy for the two regions and led the Ilinden-Preobrazhenie Uprising of 1903; in the Balkan Wars it fought alongside the Bulgarian army.'],
    body: ['조직은 바실 레프스키의 불가리아 내부 혁명조직을 본떠 「자유냐 죽음이냐」를 구호로 삼았다. 1894년 규약은 회원을 불가리아인으로 한정했으나, 고체 델체프가 「마케도니아인을 위한 마케도니아」를 내걸고 유럽 튀르키예의 모든 주민에게 문을 열었다. 그래도 다른 민족은 이 조직을 「불가리아 위원회」로 보았고, 기반은 불가리아 정교회 관할에 속한 슬라브어 사용자들에 머물렀다. 1903년 8월 일린덴-프레오브라제니예 봉기에는 약 1만 5천 명의 무장대가 오스만군 4만 명과 7주 넘게 싸웠고, 봉기가 진압되며 마을 100여 곳이 불탔다.\n\n봉기 실패 뒤 조직은 자치와 장래의 발칸 연방을 바라는 좌파 연방파(야네 산단스키, 흐리스토 체르노페예프 등 사회주의의 영향을 받은 지도자들)와 불가리아와의 통합을 바라는 우파 중앙파로 갈라졌다. 1908년 청년 튀르크 혁명 뒤 두 파 모두 무기를 내려놓고 합법 활동에 들어갔다. 발칸 전쟁 때 좌우파의 옛 지도자들은 마케도니아-아드리아노플 의용군단에 들어가 불가리아군과 함께 싸웠고, 제2차 전쟁 중에는 세르비아 점령에 맞선 티크베시 봉기를 일으켰다. 조직은 발칸 전쟁의 분할을 「해방」이 아닌 마케도니아의 분할로 보았다. 영어 위키백과는 조직이 뒤에 불가리아의 이익에 봉사하는 도구가 되었다고 평가한다. 전간기에 암살을 일삼던 조직은 1934년 5월 19일 불가리아 군사 쿠데타 뒤 군대에 진압되어 정치 세력으로서는 사라졌다.',
      'The organisation modelled itself on Vasil Levski\'s Bulgarian Internal Revolutionary Organization and took up the motto "Freedom or Death". Its 1894 statute restricted membership to Bulgarians, but Gotse Delchev, under the slogan "Macedonia for the Macedonians", opened it to all inhabitants of European Turkey. Other groups still saw it as "the Bulgarian Committee", and its base remained among Slavic speakers of the Bulgarian millet. In the Ilinden-Preobrazhenie Uprising of August 1903 some 15,000 irregulars fought 40,000 Ottoman soldiers for over seven weeks, and the suppression destroyed about 100 villages.\n\nAfter the failure the organisation split between a left-wing federalist faction, favouring autonomy and a future Balkan federation and led by socialist-inspired figures such as Yane Sandanski and Hristo Chernopeev, and a right-wing centralist faction that wanted union with Bulgaria. After the Young Turk Revolution of 1908 both laid down their arms for legal politics. In the Balkan Wars former leaders of both wings joined the Macedonian-Adrianopolitan Volunteer Corps and fought with the Bulgarian army, and during the second war the organisation raised the Tikvesh Uprising against Serbian occupation. Its adherents saw the division of the region not as "liberation" but as the partition of Macedonia. English Wikipedia judges that it later became an agent serving Bulgarian interests. After years of interwar assassinations, it was suppressed by the army following the Bulgarian military coup of 19 May 1934 and ceased to be an active political force.'],
    aliases: { ko: ['내부 마케도니아·아드리아노플 혁명기구', 'IMRO', 'VMRO'], en: ['IMRO', 'VMRO', 'Internal Macedonian-Adrianople Revolutionary Organization'] },
    people: ['dimitar-blagoev'], events: EVENTS,
    sources: [S.imro, S.macstr], locator: 'lead; After Ilinden; Balkan Wars and World War I',
  }), { original: 'Вътрешна македонска революционна организация (ВМРО)', periodKo: '1893년 ~ 1934년', periodEn: '1893–1934' }),

  withMeta(term({
    id: 'raid-on-the-sublime-porte-1913', ko: '바브알리 습격 (1913)', en: 'Raid on the Sublime Porte (1913)', category: 'events', period: '23 January 1913', startYear: 1913, endYear: 1913,
    definition: ['1913년 1월 23일 엔베르와 탈라트가 이끄는 통일진보위원회 회원들이 오스만 정부 청사(바브알리)를 습격해 카밀 파샤 내각을 무너뜨린 쿠데타. 런던 강화 회의에서 철수하고 제1차 발칸 전쟁을 재개했으며, 통일진보위원회 독재의 길을 열었다.',
      'The coup of 23 January 1913 in which members of the Committee of Union and Progress led by Enver and Talât raided the Sublime Porte and overthrew Kâmil Pasha\'s cabinet. It withdrew the Ottomans from the London peace talks, renewed the First Balkan War and opened the way to CUP dictatorship.'],
    body: ['1912년 통일진보위원회는 부정 선거로 4월 총선에서 이겼다가 7월 군부의 반대로 권력을 잃었고, 10월 술탄 메흐메트 5세의 허락으로 카밀 파샤가 내각을 꾸렸다. 제1차 발칸 전쟁에서 패한 카밀 파샤 정부는 불가리아와 강화 교섭을 벌였고, 옛 수도 에디르네를 넘기라는 요구가 다가오자 위원회 지도부와 튀르크 대중의 분노가 커졌다. 리비아에서 돌아와 제10군단 참모장이 된 엔베르는 카밀 파샤를 물러나게 하려 애썼으나 술탄을 설득하지 못했다.\n\n1월 23일 엔베르와 탈라트는 50명가량의 위원회 회원과 함께 정부 청사에 들이닥쳐 총구를 겨누고 카밀 파샤의 사임을 받아 냈다. 육군장관 나즘 파샤는 이 과정에서 살해되었다. 마흐무트 셰브케트 파샤가 이끄는 새 정부는 런던 강화 회의에서 철수하고 2월 3일 전쟁을 재개했으나 에디르네를 지키지 못했다. 6월 셰브케트 파샤가 암살된 뒤 위원회는 반대파를 체포하거나 유럽으로 추방하고 제국 전체를 장악했으며, 엔베르·탈라트·제말의 「세 파샤」 체제가 섰다. 제2차 발칸 전쟁에서 에디르네를 되찾은 일은 위원회를 독일 쪽으로 더 가깝게 만들었다.',
      'In 1912 the Committee of Union and Progress won a fraudulent general election in April, lost power to a military coup in July, and in October Kâmil Pasha formed a cabinet with Sultan Mehmed V\'s permission. Defeated in the First Balkan War, Kâmil\'s government negotiated with Bulgaria, and the looming demand for the cession of the old capital, Edirne, outraged the CUP leadership and the Turkish public. Enver, back from Libya and made chief of staff of the Tenth Corps, tried to force Kâmil out but could not persuade the sultan to dismiss him.\n\nOn 23 January Enver and Talât stormed into the Sublime Porte with some fifty Unionists and made Kâmil Pasha resign at gunpoint; War Minister Nazım Pasha was killed in the raid. The new government under Mahmud Şevket Pasha withdrew from the London peace conference and resumed the war on 3 February, but could not save Edirne. After Şevket Pasha\'s assassination in June the CUP arrested or exiled opposition leaders and took full control of the empire under the triumvirate of the "Three Pashas", Enver, Talât and Cemal. The recovery of Edirne in the Second Balkan War moved the CUP closer to Germany.'],
    aliases: { ko: ['1913년 오스만 쿠데타', '바브알리 쿠데타'], en: ['1913 Ottoman coup d\'état', 'Raid on the Sublime Porte', 'Bâb-ı Âlî Baskını'] },
    people: ['enver-pasha'], events: EVENTS,
    sources: [S.coup, S.enver], locator: 'lead; Balkan Wars and 1913 coup',
  }), { original: 'Bâb-ı Âlî Baskını', region: 'middle-east-africa', periodKo: '1913년 1월 23일', periodEn: '23 January 1913' }),
];

module.exports.SEARCH_ONLY = new Set(['런던 조약', 'Treaty of London', '부쿠레슈티 조약', 'Treaty of Bucharest', 'IMRO', 'VMRO']);
