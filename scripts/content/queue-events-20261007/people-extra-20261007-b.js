// Extra person cards for the Balkan Wars event (balkan-wars-1912-1913, already
// applied), batch b of 2026-10-07: Dimitrije Tucović, Talat Pasha and
// Constantine I of Greece. See lib.js person(). Excerpts are verbatim from the
// cited English Wikipedia pages (plain-text extracts, 2026-10-07). The Serbian
// Social Democratic Party and the Kingdom of Serbia have no catalog affiliation
// and stay unresolved; the CUP (party-cup), the Ottoman state (state-turkey,
// as on the enver-pasha card) and Greece (state-greece) are in the catalog.
// The Korean forms follow the event body: 투초비치, 탈라트, 콘스탄티노스.
const { person } = require('./lib');

const E = t => 'https://en.wikipedia.org/wiki/' + encodeURI(t);
const S = {
  tucovic: E('Dimitrije_Tucović'),
  talat: E('Talaat_Pasha'),
  constantine: E('Constantine_I_of_Greece'),
};

const unaffiliated = card => ({
  ...card,
  activities: card.activities.map(a => (a.affiliationId ? a : { ...a, affiliationStatus: 'unresolved', relation: 'unresolved' })),
});
const withNative = card => ({ ...card, cyrillic: card.nativeName });

const people = [
  unaffiliated(person({
    id: 'dimitrije-tucovic',
    given: ['디미트리예', 'Dimitrije'], family: ['투초비치', 'Tucović'], nativeName: 'Димитрије Туцовић', years: '1881–1914',
    citizenship: 'serbia', origin: 'serbia',
    epithet: ['발칸 전쟁 중 세르비아군의 알바니아인 학살을 고발한 세르비아 사회민주당의 지도자',
      'Serbian Social Democratic leader who denounced the Serbian army\'s massacres of Albanians in the Balkan Wars'],
    bio: ['즐라티보르 산의 고스틸레에서 태어났다. 1903년 3월 알렉산다르 오브레노비치 왕에 반대하는 시위를 이끌고 오스트리아-헝가리로 망명했다가, 같은 해 8월 드라기샤 라프체비치와 함께 세르비아 사회민주당을 세웠다. 당 기관지 『노동자 신문』을 편집하고 당 서기로 일하며 라프체비치의 기회주의 노선과 맞섰다. 1910년 발칸 연방을 목표로 한 첫 발칸 사회민주당 대회를 베오그라드에서 조직했다. 1912년 세르비아군에 동원되어 알바니아 원정에 나섰고, 전선에서 민간인에 대한 전쟁범죄를 고발하는 편지를 『노동자 신문』에 보냈으며, 돌아와 『세르비아와 알바니아』를 펴냈다. 1914년 11월 콜루바라 전투에서 전사했다.',
      'Born in Gostilje on Mount Zlatibor, he led the demonstrations against King Aleksandar Obrenović on 5 March 1903 and had to emigrate to Austria-Hungary; on 2 August 1903 he and Dragiša Lapčević became leaders of the new Serbian Social Democratic Party. He edited its Workers\' Newspaper, served as party secretary and opposed Lapčević\'s opportunist positions. In January 1910 he organised the first Balkan Socialist Conference in Belgrade, aimed at a Balkan federation, and at the Copenhagen congress attacked the Austrian Social Democrats\' stand on the annexation of Bosnia. Mobilised in 1912, he took part in the Serbian campaign in Albania and sent letters on war crimes against civilians to the Workers\' Newspaper; back home he published Serbia and Albania. He was killed in the Battle of Kolubara in November 1914.'],
    fate: ['killed', '전사', 'Killed in action'],
    aliases: { ko: ['미타 투초비치'], en: ['Dimitrije Tucovic', 'Mita Tucović'] },
    sources: [S.tucovic],
    facts: {
      years: { claim: '1881–1914', locator: 'lead', excerpt: '13 May 1881 – November 1914' },
      citizenship: { claim: 'Serbian socialist politician', locator: 'lead', excerpt: 'was a Serbian theorist of the socialist movement, politician, writer and publisher' },
      nationalOrigin: { claim: 'born on Mount Zlatibor in Serbia', locator: 'Life', excerpt: 'Tucović was born 13 May 1881 in the Gostilje village on Mount Zlatibor, near Čajetina.' },
      bio: [
        { claim: 'led the March 1903 demonstrations and emigrated', locator: 'Life', excerpt: 'Tucović led the March demonstrations against King Aleksandar Obrenović on 5 March 1903. He was forced to emigrate to Zemun in the neighbouring Austria-Hungary and later to Vienna.' },
        { claim: 'co-leader of the party founded in 1903, editor of its paper', locator: 'Life', excerpt: 'On 2 August 1903, the Social-Democratic Party was formed, with Tucović and Dragiša Lapčević as one of the leaders. The editor of their newspaper, "Worker\'s Newspaper" was Tucović.' },
        { claim: 'opposed Lapčević', locator: 'Life', excerpt: 'Tucović confronted Dragiša Lapčević, who adopted centralist and right-wing opportunist positions.' },
        { claim: 'party secretary', locator: 'Life', excerpt: 'he gave up on his doctorate and started spending his time in socialist and labour movement, as a secretary of the SSDP' },
        { claim: 'first Balkan Socialist Conference, 1910', locator: 'Life', excerpt: 'Tucović was the organizer and leader of the first Balkan Socialist Conference, held in Belgrade from 7-9. January 1910, aimed at creating a Balkan federation.' },
        { claim: 'Copenhagen congress speech on Bosnia', locator: 'Life', excerpt: 'He participated at the International Socialist Congress in Copenhagen the same year and gave an important speech criticizing the position that Austrian social-democrats took on the national issue, especially the Austro-Hungarian annexation of Bosnia and Herzegovina.' },
        { claim: 'mobilised in 1912; letters on war crimes', locator: 'Life', excerpt: 'After the outbreak of the Balkan Wars 1912, he was mobilized in the Serbian army and participated in the Serbian military campaign in Albania. He sent letters from the front about war crimes against civil population which were regularly published in the Worker\'s Newspaper.' },
        { claim: 'published Serbia and Albania', locator: 'Life', excerpt: 'After returning from the Balkan War, he published his influential book Serbia and Albania: A Contribution to the Critique of the Conqueror Policy of the Serbian Bourgeoisie' },
        { claim: 'killed at Kolubara, November 1914', locator: 'Life', excerpt: 'He died as a member of Morava division in November 1914 in a Battle of Kolubara against Austro-Hungarian army at Ljig\'s bank.' },
      ],
    },
    activities: [
      { functionId: 'political-leadership', affiliationId: null, startYear: 1903, endYear: 1914, primary: true, claim: 'Co-founder, leader and secretary of the Serbian Social Democratic Party; no catalog affiliation', locator: 'Life', excerpt: 'On 2 August 1903, the Social-Democratic Party was formed, with Tucović and Dragiša Lapčević as one of the leaders.' },
      { functionId: 'propaganda', affiliationId: null, startYear: 1903, endYear: 1914, claim: 'Editor of the party paper Radničke novine (Workers\' Newspaper) and of the theoretical review Borba; no catalog affiliation', locator: 'Life', excerpt: 'The editor of their newspaper, "Worker\'s Newspaper" was Tucović.' },
      { functionId: 'organizing', affiliationId: null, startYear: 1910, endYear: 1910, claim: 'Organiser of the first Balkan Socialist Conference (Belgrade, January 1910); no catalog affiliation', locator: 'Life', excerpt: 'Tucović was the organizer and leader of the first Balkan Socialist Conference, held in Belgrade from 7-9. January 1910, aimed at creating a Balkan federation.' },
      { functionId: 'military', affiliationId: null, startYear: 1912, endYear: 1914, claim: 'Mobilised soldier of the Serbian army in the Balkan Wars and the First World War; the Kingdom of Serbia has no catalog affiliation', locator: 'Life', excerpt: 'After the outbreak of the Balkan Wars 1912, he was mobilized in the Serbian army and participated in the Serbian military campaign in Albania.' },
    ],
    career: [
      ['1903', '반오브레노비치 3월 시위 주도, 오스트리아-헝가리로 망명', 'Led the March demonstrations against King Aleksandar Obrenović; emigrated to Austria-Hungary'],
      ['1903', '세르비아 사회민주당 창당, 『노동자 신문』 편집', 'Co-founded the Serbian Social Democratic Party; editor of the Workers\' Newspaper'],
      ['1910', '첫 발칸 사회민주당 대회 조직 (베오그라드)', 'Organised the first Balkan Socialist Conference (Belgrade)'],
      ['1912–1913', '세르비아군 동원, 알바니아 원정의 전쟁범죄 고발', 'Mobilised in the Serbian army; reported war crimes in the Albanian campaign'],
      ['1914', '『세르비아와 알바니아』 출간, 콜루바라 전투에서 전사', 'Published Serbia and Albania; killed in the Battle of Kolubara'],
    ],
  })),
  person({
    id: 'talat-pasha',
    given: ['', ''], family: ['탈라트 파샤', 'Talat Pasha'], nativeName: 'Mehmed Talât Paşa', years: '1874–1921',
    citizenship: 'turkey', origin: 'turkey',
    epithet: ['발칸 전쟁 중 정변으로 권력을 잡고 아르메니아인 집단 학살을 지휘한 통일진보위원회의 지도자',
      'Leader of the Committee of Union and Progress who seized power by a coup during the Balkan Wars and directed the Armenian genocide'],
    bio: ['에디르네 주 크르잘리에서 태어나 우편 사무원으로 일하며 통일진보위원회에 들어갔다가 투옥되었다. 1908년 혁명 뒤 의원이 되었고 1909년 내무장관에 올랐다. 제1차 발칸 전쟁 중 에디르네 할양 소문이 돌자 1913년 1월 23일 엔베르와 함께 정부 청사를 습격해 카밀 파샤 내각을 무너뜨렸고, 다시 내무장관이 되어 엔베르·제말과 「세 파샤」 독재를 이끌었다. 1915년 4월 24일 아르메니아 지식인 체포·추방을 명령하고 5월 강제이주법을 공포해 아르메니아인 집단 학살을 일으켰다. 1917년 대재상이 되어 브레스트-리토프스크 조약을 교섭했고 1918년 독일로 달아났다. 궐석 사형 선고를 받았고 1921년 베를린에서 아르메니아 혁명연맹의 테힐리리안에게 암살되었다.',
      'Born in Kırcaali in the vilayet of Adrianople, a postal clerk, he joined the Committee of Union and Progress and was imprisoned for it. After the 1908 revolution he was elected deputy for Adrianople and in 1909 became interior minister. When rumours spread in the First Balkan War that Adrianople would be surrendered, he and Enver stormed the Sublime Porte on 23 January 1913 and brought down Kâmil Pasha\'s cabinet; back as interior minister, he led the rule of the Three Pashas with Enver and Cemal. On 24 April 1915 he ordered the arrest and deportation of Armenian intellectuals and on 30 May promulgated the deportation law, initiating the Armenian genocide. Grand Vizier from 1917, he negotiated the Brest-Litovsk treaty himself, fled to Germany in November 1918, was sentenced to death in absentia, and was shot in Berlin in 1921 by Soghomon Tehlirian, a Dashnak.'],
    fate: ['assassinated', '베를린에서 암살', 'Assassinated in Berlin'],
    aliases: { ko: ['메흐메트 탈라트', '메흐메트 탈라트 파샤'], en: ['Talaat Pasha', 'Talât Pasha', 'Mehmed Talat', 'Mehmed Talaat', 'Mehmed Talât Pasha'] },
    linkExpressions: [['ko', '탈라트'], ['en', 'Talat'], ['en', 'Talaat']],
    sources: [S.talat],
    facts: {
      years: { claim: '1874–1921', locator: 'lead', excerpt: '1 September 1874 – 15 March 1921' },
      citizenship: { claim: 'Ottoman statesman, de facto leader 1913–1918', locator: 'lead', excerpt: 'was a Turkish activist, revolutionary, politician, and convicted war criminal who served as the de facto leader of the Ottoman Empire from 1913 to 1918' },
      nationalOrigin: { claim: 'Turkish', locator: 'lead', excerpt: 'was a Turkish activist, revolutionary, politician, and convicted war criminal' },
      bio: [
        { claim: 'born in Kırcaali, Adrianople vilayet', locator: 'Early life: 1874–1908 – Childhood', excerpt: 'Mehmed Talaat was born in 1874 in Kırcaali, Adrianople (Edirne) Vilayet' },
        { claim: 'postal clerk', locator: 'Early life: 1874–1908 – Childhood', excerpt: 'he joined the staff of a telegraph company as a postal clerk in Adrianople to provide for his family' },
        { claim: 'joined the CUP, imprisoned, exiled to Salonika', locator: 'Early life: 1874–1908 – Activism against Abdul Hamid II', excerpt: 'Sentenced to three years in jail, Talaat was pardoned after serving two years but exiled to Salonika (Thessaloniki), where he became a postal clerk in July 1898.' },
        { claim: 'deputy for Adrianople, then interior minister', locator: 'lead', excerpt: 'he was elected as a deputy from Adrianople to the Chamber of Deputies and later became Minister of the Interior' },
        { claim: 'coup of 23 January 1913', locator: 'Rise to power: 1908–1913 – Crisis for the committee', excerpt: 'Following rumors that the government was willing to surrender Adrianople which was still under siege, Talaat and Enver began plotting a coup. The coup launched on 23 January 1913, known as the Raid on the Sublime Porte, succeeded in overthrowing the government' },
        { claim: 'Three Pashas', locator: 'lead', excerpt: 'an autocratic triumvirate of CUP Central Committee members lead the Ottoman Empire, consisting of himself, Enver, and Ahmed Cemal (known as the Three Pashas) of whom Talaat was its civilian leader' },
        { claim: 'orders of April and May 1915', locator: 'lead', excerpt: 'he ordered on 24 April 1915 the arrest and deportation of Armenian intellectuals in Constantinople (now Istanbul), most of them being ultimately murdered, and on 30 May 1915 promulgated the Temporary Law of Deportation; these events initiated the Armenian genocide' },
        { claim: 'Grand Vizier, Brest-Litovsk', locator: 'lead', excerpt: 'Talaat Pasha became Grand Vizier in 1917. He personally negotiated the Treaty of Brest-Litovsk with the Bolsheviks' },
        { claim: 'flight and death sentence in absentia', locator: 'lead', excerpt: 'On the night of 2–3 November 1918, Talaat Pasha and other members of the CUP\'s central committee fled the country. The Ottoman Special Military Tribunal convicted and sentenced him to death in absentia' },
        { claim: 'killed in Berlin by Tehlirian', locator: 'lead', excerpt: 'He was killed in Berlin in 1921 by Soghomon Tehlirian, a member of the Armenian Revolutionary Federation, as part of Operation Nemesis.' },
      ],
    },
    activities: [
      { functionId: 'government', affiliationId: 'state-turkey', startYear: 1913, endYear: 1918, primary: true, claim: 'Ottoman Minister of the Interior 1913–1918 (also 1909–1911) and Grand Vizier 1917–1918', locator: 'Union and Progress regime: 1913–1918 – Consolidating power', excerpt: 'Talaat returned as interior minister in Said Halim Pasha\'s cabinet. He kept this post until the CUP\'s fall from power following Turkey\'s surrender in World War I in 1918.' },
      { functionId: 'political-leadership', affiliationId: 'party-cup', relation: 'membership', startYear: 1896, endYear: 1918, claim: 'Member of the Committee of Union and Progress from the 1890s, later chairman of the Union and Progress Party', locator: 'Early life: 1874–1908 – Activism against Abdul Hamid II', excerpt: 'In 1896 he was imprisoned for having been part of a CUP cell together with his brother-in-law.' },
    ],
    career: [
      ['1896', '통일진보위원회 세포 활동으로 투옥', 'Imprisoned for membership of a CUP cell'],
      ['1908', '오스만 의회 의원 (에디르네)', 'Deputy for Adrianople in the Ottoman parliament'],
      ['1909–1911', '오스만 내무장관', 'Ottoman Minister of the Interior'],
      ['1913', '바브알리 습격 정변 주도', 'Led the Raid on the Sublime Porte'],
      ['1913–1918', '오스만 내무장관', 'Ottoman Minister of the Interior'],
      ['1917–1918', '오스만 대재상', 'Grand Vizier of the Ottoman Empire'],
      ['1918', '독일로 망명', 'Fled to Germany'],
    ],
  }),
  person({
    id: 'constantine-i-of-greece',
    given: ['', ''], family: ['콘스탄티노스 1세', 'Constantine I of Greece'], nativeName: 'Κωνσταντίνος Αʹ', years: '1868–1923',
    citizenship: 'greece', origin: 'greece',
    epithet: ['발칸 전쟁에서 그리스군을 이끌고 1차 세계대전 참전 문제로 베니젤로스와 갈라선 그리스 국왕',
      'King of Greece who led the Greek army in the Balkan Wars and broke with Venizelos over entering the First World War'],
    bio: ['게오르기오스 1세의 맏아들로 아테네에서 태어나 독일에서 교육받았고 프로이센 군국주의를 동경했다. 왕세자로서 1897년 그리스-튀르크 전쟁의 패전을 지휘했다. 1912년 테살리아군 총사령관으로 사란다포로를 넘었고, 모나스티르로 북진하려다 베니젤로스의 요구로 테살로니키를 먼저 차지했다. 1913년 3월 아버지가 암살되자 즉위했고, 제2차 발칸 전쟁에서 킬키스-라하나스와 크레스나 협곡 전투를 지휘해 원수가 되었다. 1차 세계대전에서 친독일 중립을 고집해 베니젤로스를 해임함으로써 국가분열을 낳았고 1917년 퇴위했다. 1920년 복위했으나 소아시아 패전 뒤 1922년 다시 퇴위해 망명했고, 1923년 팔레르모에서 죽었다.',
      'The eldest son of George I, born in Athens and educated in Germany, he admired Prussian militarism and as crown prince commanded the army in the lost Greco-Turkish War of 1897. In 1912 he led the Army of Thessaly to victory at Sarantaporos and, after clashing with Venizelos, who demanded the swift capture of Thessaloniki over his wish to push north to Monastir, took the city. He succeeded his assassinated father in March 1913, commanded at Kilkis-Lahanas and the Kresna Gorge in the Second Balkan War and was made a field marshal. His pro-German neutrality in the First World War led him to dismiss Venizelos, causing the National Schism, and he abdicated in 1917. Restored in 1920, he abdicated again after the defeat in Asia Minor in 1922 and died in exile in Palermo in 1923.'],
    fate: ['exile', '망명지에서 사망', 'Died in exile'],
    aliases: { ko: ['그리스 국왕 콘스탄티노스 1세'], en: ['Konstantinos I', 'King Constantine I of Greece'] },
    linkExpressions: [['ko', '콘스탄티노스 왕'], ['ko', '왕세자 콘스탄티노스'], ['en', 'King Constantine'], ['en', 'Crown Prince Constantine']],
    sources: [S.constantine],
    facts: {
      years: { claim: '1868–1923', locator: 'lead', excerpt: '2 August [O.S. 21 July] 1868 – 11 January 1923' },
      citizenship: { claim: 'King of Greece', locator: 'lead', excerpt: 'was King of Greece from 18 March 1913 to 11 June 1917 and again from 19 December 1920 to 27 September 1922' },
      nationalOrigin: { claim: 'born in Athens, first Greek-born member of the dynasty', locator: 'Early life', excerpt: 'the new heir apparent to the throne was the first Greek-born member of the family' },
      bio: [
        { claim: 'eldest son of George I, born in Athens', locator: 'Early life', excerpt: 'Constantine was born on 2 August 1868 in Athens. He was the eldest son of King George I and Queen Olga.' },
        { claim: 'educated in Germany, admirer of Prussian militarism; 1897 command', locator: 'lead', excerpt: 'Educated in Greece and later in Germany, Constantine was an admirer of Prussian militarism. As the crown prince, he was commander-in-chief of the Hellenic Army during the unsuccessful Greco-Turkish War of 1897.' },
        { claim: 'Army of Thessaly 1912, Sarantaporos, clash with Venizelos', locator: 'Balkan Wars – Macedonian Front', excerpt: 'He led the Army of Thessaly to victory at Sarantaporos. At this point, his first clash with Venizelos occurred, as Constantine desired to press north, towards Monastir' },
        { claim: 'accession; Kilkis-Lahanas and Kresna; field marshal', locator: 'Balkan Wars – Accession to the Throne and Second Balkan War', excerpt: 'King Constantine led the Greek Army in its counterattack in the battles of Kilkis-Lahanas and the Kresna Gorge.' },
        { claim: 'field marshal', locator: 'Balkan Wars – Accession to the Throne and Second Balkan War', excerpt: 'On the initiative of Prime Minister Venizelos, Constantine was also awarded the rank and baton of a Field Marshal.' },
        { claim: 'National Schism and 1917 abdication', locator: 'lead', excerpt: 'Constantine unconstitutionally dismissed his Prime Minister, causing the National Schism.' },
        { claim: 'restored 1920, abdicated 1922, died in exile', locator: 'lead', excerpt: 'Constantine I abdicated the throne  in favor of his eldest son George II in September 1922, after an army revolt of Venizelist officers. He went to exile, dying in Sicily, Italy on 11 January 1923.' },
        { claim: 'died at Palermo', locator: 'Second exile and death', excerpt: 'died at 1:30 am on 11 January 1923 at Palermo, Sicily of heart failure' },
      ],
    },
    activities: [
      { functionId: 'monarchy', affiliationId: 'state-greece', startYear: 1913, endYear: 1922, primary: true, claim: 'King of Greece 1913–1917 and 1920–1922', locator: 'lead', excerpt: 'was King of Greece from 18 March 1913 to 11 June 1917 and again from 19 December 1920 to 27 September 1922' },
      { functionId: 'military', affiliationId: 'state-greece', startYear: 1912, endYear: 1913, claim: 'Commander-in-chief of the Army of Thessaly and of the Greek army in the Balkan Wars (also in 1897)', locator: 'Balkan Wars – Macedonian Front', excerpt: 'Constantine was appointed commander-in-chief of the "Army of Thessaly" when the First Balkan War broke out in October 1912.' },
    ],
    career: [
      ['1897', '그리스-튀르크 전쟁 테살리아군 지휘', 'Commanded the Army of Thessaly in the Greco-Turkish War'],
      ['1912–1913', '발칸 전쟁 그리스군 총사령관', 'Commander-in-chief of the Greek army in the Balkan Wars'],
      ['1913–1917', '그리스 국왕', 'King of Greece'],
      ['1917', '협상국의 압력으로 퇴위', 'Abdicated under Allied pressure'],
      ['1920–1922', '복위, 그리스 국왕', 'Restored as King of Greece'],
      ['1922', '퇴위, 이탈리아 망명', 'Abdicated; exile in Italy'],
    ],
  }),
].map(withNative);

module.exports = people;
// Proposed political-position collections (commulingo_person_collections).
module.exports.collections = {
  'dimitrije-tucovic': 'communist',
  'talat-pasha': 'nationalist',
  'constantine-i-of-greece': 'monarchist',
};
// Event relation rows: [eventId, personId, kind, relationKo, relationEn, noteKo, noteEn, sideId].
module.exports.relations = [
  ['balkan-wars-1912-1913', 'dimitrije-tucovic', 'participant', '세르비아 사회민주당 지도자', 'Leader of the Serbian Social Democratic Party',
    '1910년 첫 발칸 사회민주당 대회를 조직했고, 1912년 세르비아군에 동원되어 알바니아 원정의 민간인 학살을 『노동자 신문』에 고발했으며, 돌아와 『세르비아와 알바니아』를 썼다.',
    'Organised the first Balkan Socialist Conference in 1910; mobilised in 1912, he reported the massacres of civilians in the Albanian campaign to the Workers\' Newspaper and afterwards wrote Serbia and Albania.',
    'anti-war-socialists'],
  ['balkan-wars-1912-1913', 'talat-pasha', 'leader', '통일진보위원회 지도자, 오스만 내무장관', 'Leader of the Committee of Union and Progress; Ottoman interior minister',
    '에디르네 할양을 막으려고 1913년 1월 23일 엔베르와 함께 정부 청사를 습격해 카밀 파샤 내각을 무너뜨렸다. 제2차 전쟁에서 에디르네 탈환을 밀어붙였고, 콘스탄티노폴리스 회의에서 불가리아와의 강화를 교섭했다.',
    'To prevent the surrender of Adrianople he and Enver stormed the government offices on 23 January 1913 and brought down Kâmil Pasha\'s cabinet. In the second war he pressed for the recapture of Adrianople and negotiated the peace with Bulgaria at the Constantinople conference.',
    'ottoman-empire'],
  ['balkan-wars-1912-1913', 'constantine-i-of-greece', 'leader', '그리스군 총사령관, 1913년 3월부터 그리스 국왕', 'Commander-in-chief of the Greek army; King of Greece from March 1913',
    '왕세자로서 사란다포로와 야니차를 넘어 테살로니키를 차지했고, 1913년 3월 즉위한 뒤 제2차 전쟁에서 킬키스-라하나스와 크레스나 협곡 전투를 지휘하다 베니젤로스의 제안으로 휴전에 동의했다.',
    'As crown prince he forced the Sarantaporo pass and won at Giannitsa to take Thessaloniki; king from March 1913, he commanded at Kilkis-Lahanas and the Kresna Gorge in the second war and agreed to an armistice on Venizelos\'s proposal.',
    'serbia-greece-montenegro'],
  // Proposed rows on other existing events (their bodies do not name these people).
  ['world-war-i', 'talat-pasha', 'leader', '오스만 내무장관·대재상', 'Ottoman interior minister and Grand Vizier',
    '엔베르와 함께 독일과의 비밀 동맹을 맺어 오스만 제국을 참전시켰고, 1915년 아르메니아 지식인 체포와 강제이주법으로 아르메니아인 집단 학살을 일으켰다. 1917년 대재상이 되었다.',
    'With Enver he concluded the secret alliance with Germany that brought the Ottoman Empire into the war, and in 1915 the arrests of Armenian intellectuals and the deportation law began the Armenian genocide. He became Grand Vizier in 1917.',
    'central-powers'],
  ['world-war-i', 'dimitrije-tucovic', 'participant', '세르비아 사회민주당 지도자', 'Leader of the Serbian Social Democratic Party',
    '1914년 11월 콜루바라 전투에서 세르비아군 병사로 전사했다. 트로츠키는 그의 죽음을 세르비아와 발칸 사회민주주의가 전쟁에서 입은 가장 큰 타격이라 썼다.',
    'Killed as a Serbian soldier in the Battle of Kolubara in November 1914; Trotsky called his death the heaviest blow the war dealt to Serbian and Balkan social democracy.',
    'antiwar-socialists'],
  ['brest-litovsk', 'talat-pasha', 'participant', '오스만 대재상, 강화 교섭 대표', 'Ottoman Grand Vizier and peace negotiator',
    '오스만 제국 대표로 조약을 직접 교섭해 1878년 러시아에 잃은 카르스·바투미·아르다한을 되찾았다.',
    'Negotiated the treaty for the Ottoman Empire himself, regaining Kars, Batumi and Ardahan, lost to Russia in 1878.',
    'germany-and-allies'],
];
