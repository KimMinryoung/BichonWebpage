// New person cards for the Balkan Wars event (queue 2064, 2026-10-07), see
// lib.js person(). Excerpts are verbatim from the cited English Wikipedia
// pages (plain-text extracts). The Kingdoms of Serbia and Montenegro, the
// People's Radical Party, the Bulgarian People's Party and the Serbian Social
// Democratic Party have no catalog affiliation and stay unresolved. The Admin
// store reads the native name from `cyrillic`, so it is copied from nativeName.
const { person } = require('./lib');

const E = t => 'https://en.wikipedia.org/wiki/' + encodeURI(t);
const RU = t => 'https://ru.wikipedia.org/wiki/' + encodeURI(t);
const S = {
  ferdinand: E('Ferdinand_I_of_Bulgaria'),
  venizelos: E('Eleftherios_Venizelos'),
  pasic: E('Nikola_Pašić'),
  geshov: E('Ivan_Evstratiev_Geshov'),
  nikola: E('Nicholas_I_of_Montenegro'),
  qemali: E('Ismail_Qemali'),
  albania: E('Albanian_Declaration_of_Independence'),
  lapcevic: E('Dragiša_Lapčević'),
  lapcevicRu: RU('Лапчевич,_Драгиша'),
  ssdp: E('Serbian_Social_Democratic_Party_(Kingdom_of_Serbia)'),
};

const unaffiliated = card => ({
  ...card,
  activities: card.activities.map(a => (a.affiliationId ? a : { ...a, affiliationStatus: 'unresolved', relation: 'unresolved' })),
});
const withNative = card => ({ ...card, cyrillic: card.nativeName });

const people = [
  person({
    id: 'ferdinand-i-of-bulgaria',
    given: ['', ''], family: ['페르디난드 1세', 'Ferdinand I'], nativeName: 'Фердинанд I', years: '1861–1948',
    citizenship: 'bulgaria', origin: { code: 'germany', label: { ko: '독일계 (작센코부르크고타 가)', en: 'German (House of Saxe-Coburg and Gotha)' } },
    epithet: ['발칸 전쟁을 「십자가의 성전」이라 부르고 옛 동맹국 공격을 명령한 불가리아 차르',
      'Bulgarian tsar who led his country into the Balkan League and then ordered the attack on his allies that began the Second Balkan War'],
    bio: ['빈에서 작센코부르크고타 가의 독일계 공자로 태어나 오스트리아-헝가리군 장교로 있다가 1887년 불가리아 공으로 뽑혔다. 1908년 독립을 선언하고 차르가 되었다. 1912년 오스만 제국에 맞선 전쟁을 「초승달에 맞선 십자가의 성전」이라 선언했고, 1913년 6월 사보프 장군을 통해 정부와 협의 없이 세르비아·그리스군 공격을 명령했다. 부쿠레슈티 조약으로 마케도니아 대부분을 잃었고, 1915년 동맹국 편으로 참전했다가 1918년 아들 보리스에게 양위하고 코부르크에서 죽었다.',
      'Born in Vienna a German prince of the House of Saxe-Coburg and Gotha-Koháry, he was an officer in the Austro-Hungarian army when the Grand National Assembly elected him Prince of Bulgaria in 1887; in 1908 he proclaimed independence and took the title of tsar. In 1912 he declared the war on the Ottoman Empire "a just, great and sacred struggle of the Cross against the Crescent", and in June 1913 General Savov, under his direct orders and without consulting the government, launched the attack on Serbia and Greece. The Treaty of Bucharest cost Bulgaria most of Macedonia. He took Bulgaria into the First World War on the side of the Central Powers, abdicated in favour of his son Boris III in October 1918 and died in exile in Coburg in 1948.'],
    fate: ['exile', '망명지에서 사망', 'Died in exile'],
    aliases: { ko: ['차르 페르디난드'], en: ['Tsar Ferdinand', 'Ferdinand of Saxe-Coburg and Gotha'] },
    sources: [S.ferdinand, E('Balkan_Wars')],
    facts: {
      years: { claim: '1861–1948', locator: 'lead', excerpt: '26 February 1861 – 10 September 1948' },
      citizenship: { claim: 'monarch of Bulgaria 1887–1918', locator: 'lead', excerpt: 'was the monarch of Bulgaria from 1887 to 1918, reigning as Prince of Bulgaria from 1887 to 1908 and Tsar of Bulgaria from 1908 until his abdication in 1918' },
      nationalOrigin: { claim: 'German prince of the House of Saxe-Coburg and Gotha', locator: 'Family background', excerpt: 'Ferdinand was born on 26 February 1861 in Vienna, a German prince of the House of Saxe-Coburg and Gotha-Koháry.' },
      bio: [
        { claim: 'officer elected prince in 1887', locator: 'Accession', excerpt: 'Ferdinand, who was an officer in the Austro-Hungarian Army, was elected Prince of autonomous Bulgaria by its Grand National Assembly on 7 July 1887' },
        { claim: 'the war as a crusade', locator: 'Balkan Wars (1912–1913)', excerpt: 'He saw this war as a new crusade declaring it, "a just, great and sacred struggle of the Cross against the Crescent."' },
        { claim: 'ordered the attack of June 1913', source: E('Balkan_Wars'), locator: 'Second Balkan War', excerpt: 'General Savov, under direct orders of Tsar Ferdinand I, issued attack orders against both Greece and Serbia without consulting the Bulgarian government and without an official declaration of war.' },
        { claim: 'abdicated for Boris III in 1918', locator: 'First World War and abdication (1915–1918)', excerpt: 'Tsar Ferdinand abdicated in favour of his eldest son, who became Tsar Boris III on 3 October 1918.' },
        { claim: 'died at Coburg', locator: 'Exile and death (1918–1948)', excerpt: 'Ferdinand died in Bürglass-Schlösschen on 10 September 1948 in Coburg, Germany' },
      ],
    },
    activities: [
      { functionId: 'monarchy', affiliationId: 'state-bulgaria', startYear: 1887, endYear: 1918, primary: true, claim: 'Prince (1887–1908) and Tsar (1908–1918) of Bulgaria', locator: 'lead', excerpt: 'was the monarch of Bulgaria from 1887 to 1918, reigning as Prince of Bulgaria from 1887 to 1908 and Tsar of Bulgaria from 1908 until his abdication in 1918' },
    ],
    career: [
      ['1887', '불가리아 공으로 선출', 'Elected Prince of Bulgaria'],
      ['1908', '독립 선언, 차르 즉위', 'Proclaimed independence and became tsar'],
      ['1912–1913', '제1·2차 발칸 전쟁', 'First and Second Balkan Wars'],
      ['1915–1918', '동맹국 편으로 1차 세계대전 참전', 'Entered the First World War with the Central Powers'],
      ['1918', '보리스 3세에게 양위', 'Abdicated in favour of Boris III'],
    ],
  }),
  person({
    id: 'eleftherios-venizelos',
    given: ['엘레프테리오스', 'Eleftherios'], family: ['베니젤로스', 'Venizelos'], nativeName: 'Ελευθέριος Βενιζέλος', years: '1864–1936',
    citizenship: 'greece', origin: { code: 'greece', label: { ko: '그리스 (크레타)', en: 'Greek (Crete)' } },
    epithet: ['그리스를 발칸 동맹에 끌어들이고 두 차례 발칸 전쟁으로 영토와 인구를 두 배로 늘린 자유당 총리',
      'Liberal prime minister who brought Greece into the Balkan League and doubled its territory in the Balkan Wars'],
    bio: ['오스만령 크레타에서 태어나 크레타 자치와 그리스 통합 운동을 이끌었다. 1909년 군사동맹의 쿠데타 뒤 아테네로 불려 와 1910년 총리가 되었고 1911년 헌법 개정과 군 개혁을 추진했다. 1912년 그리스를 발칸 동맹에 넣었고, 테살로니키를 「무슨 대가를 치르더라도」 먼저 차지하라고 왕세자 콘스탄티노스를 압박했다. 1913년 세르비아와 동맹을 맺고 부쿠레슈티 강화회의에 그리스 대표로 나갔다. 1차 세계대전 참전 문제로 국왕과 갈라서 국가분열을 낳았고, 1935년 쿠데타 실패 뒤 파리로 망명해 거기서 죽었다.',
      'Born in Ottoman Crete, he led the struggle for Cretan autonomy and union with Greece. Called to Athens after the Military League coup of 1909, he became prime minister in 1910 and pushed through the 1911 constitution and the reorganisation of the army and navy. In 1912 he brought Greece into the Balkan League, and he pressed Crown Prince Constantine to take Thessaloniki "à tout prix" before the Bulgarians. In 1913 he concluded the alliance with Serbia and led the Greek delegation at the Bucharest peace talks. His clash with King Constantine over entering the First World War produced the National Schism. Sentenced to death in absentia after a failed coup in 1935, he died in exile in Paris in 1936.'],
    fate: ['exile', '망명지에서 사망', 'Died in exile'],
    aliases: { ko: [], en: ['Eleutherios Venizelos'] },
    linkExpressions: [['ko', '베니젤로스'], ['en', 'Venizelos']],
    sources: [S.venizelos, E('Second_Balkan_War')],
    facts: {
      years: { claim: '1864–1936', locator: 'lead', excerpt: '23 August [O.S. 11 August] 1864 – 18 March 1936' },
      citizenship: { claim: 'Greek statesman', locator: 'lead', excerpt: 'was a Greek statesman and leader of the Greek national liberation movement' },
      nationalOrigin: { claim: 'born in Ottoman Crete', locator: 'Early life and education', excerpt: 'Venizelos was born in Mournies, near Chania (formerly known as Canea) in then Ottoman Crete' },
      bio: [
        { claim: 'Cretan autonomy and union', locator: 'lead', excerpt: 'Venizelos first made his mark on the international stage with his leading role in securing the autonomy of the Cretan State, and later in the island\'s union with Greece.' },
        { claim: 'prime minister from 1909/1910, 1911 constitution', locator: 'lead', excerpt: 'In 1909, he was invited to Athens to resolve the political deadlock and became Prime Minister.' },
        { claim: 'brought Greece into the Balkan League', locator: 'lead', excerpt: 'Before the Balkan Wars of 1912–1913, Venizelos\' catalytic role helped Greece to gain entrance to the Balkan League, an alliance of the Balkan states against the Ottoman Empire.' },
        { claim: 'Salonique à tout prix', locator: 'First Balkan War – The first conflict with Prince Constantine', excerpt: 'Salonique à tout prix!' },
        { claim: 'led the Greek delegation at Bucharest', source: E('Second_Balkan_War'), locator: 'Armistice', excerpt: 'the Greeks by Venizelos' },
        { claim: 'National Schism', locator: 'lead', excerpt: 'his pro-Allied foreign policy brought him into conflict with the nonaligned faction of Constantine I of Greece, causing the National Schism of the 1910s' },
        { claim: 'fled to Paris and died there', locator: 'lead', excerpt: 'In March 1935, after a second coup attempt, he was sentenced to death in absentia, after having fled to Paris, where he died.' },
      ],
    },
    activities: [
      { functionId: 'government', affiliationId: 'state-greece', startYear: 1910, endYear: 1933, primary: true, claim: 'Prime minister of Greece in eight terms between 1910 and 1933', locator: 'lead', excerpt: 'As the leader of the Liberal Party, Venizelos served as prime minister of Greece for over 12 years, spanning eight terms from 1910 to 1933.' },
      { functionId: 'political-leadership', affiliationId: 'party-greek-liberal', relation: 'membership', startYear: 1910, endYear: 1936, claim: 'Leader of the Liberal Party', locator: 'lead', excerpt: 'As the leader of the Liberal Party, Venizelos served as prime minister of Greece for over 12 years, spanning eight terms from 1910 to 1933.' },
    ],
    career: [
      ['1897', '크레타 봉기 참여', 'Took part in the Cretan Revolt'],
      ['1905', '테리소 봉기 지도', 'Led the Theriso revolt'],
      ['1910–1915', '그리스 총리 (첫 재임)', 'Prime minister of Greece (first tenure)'],
      ['1913', '부쿠레슈티 강화회의 그리스 대표', 'Greek delegate at the Bucharest peace conference'],
      ['1928–1932', '그리스 총리', 'Prime minister of Greece'],
      ['1935', '쿠데타 실패 뒤 파리 망명', 'Exile in Paris after a failed coup'],
    ],
  }),
  unaffiliated(person({
    id: 'nikola-pasic',
    given: ['니콜라', 'Nikola'], family: ['파시치', 'Pašić'], nativeName: 'Никола Пашић', years: '1845–1926',
    citizenship: 'serbia', origin: 'serbia',
    epithet: ['발칸 동맹을 맺고 두 차례 발칸 전쟁으로 세르비아 영토를 거의 두 배로 늘린 급진당 총리',
      'Radical prime minister who built the Balkan League and nearly doubled Serbia in the Balkan Wars'],
    bio: ['자예차르에서 태어나 취리히에서 공학을 공부하며 스베토자르 마르코비치 무리와 함께 사회주의·급진주의에 들어섰고, 인민급진당을 이끌었다. 티모크 반란 뒤 사형 선고를 피해 불가리아에서 망명했다. 1904년부터 세르비아 총리를 여러 번 지냈고 1912년 9월 다시 내각을 맡아 발칸 동맹과 두 차례 발칸 전쟁을 이끌었으며, 부쿠레슈티 회의에서 세르비아 대표단을 이끌었다. 1차 세계대전 중 코르푸 망명정부를 이끌었고 유고슬라비아 왕국의 총리를 지내다 1926년 베오그라드에서 죽었다.',
      'Born in Zaječar, he studied engineering in Zürich, where he joined Svetozar Marković\'s circle of socialist and radical students, and went on to lead the People\'s Radical Party. Sentenced to death after the Timok Rebellion, he escaped into exile in Bulgaria. He was prime minister of Serbia several times from 1904, and after forming a new cabinet in September 1912 led the country through the Balkan League and both Balkan Wars, heading the Serbian delegation at Bucharest. During the First World War he led the government in exile on Corfu, and after 1918 served as prime minister of the Kingdom of Serbs, Croats and Slovenes until shortly before his death in Belgrade in 1926.'],
    fate: ['natural', '자연사', 'Natural causes'],
    aliases: { ko: [], en: ['Nikola Pasic'] },
    sources: [S.pasic, E('Second_Balkan_War')],
    facts: {
      years: { claim: '1845–1926', locator: 'lead', excerpt: '18 December 1845 – 10 December 1926' },
      citizenship: { claim: 'Serbian and Yugoslav politician', locator: 'lead', excerpt: 'was a Serbian and Yugoslav politician and diplomat' },
      nationalOrigin: { claim: 'born in eastern Serbia', locator: 'lead', excerpt: 'Born in Zaječar, in eastern Serbia' },
      bio: [
        { claim: 'radical politics in Zürich', locator: 'lead', excerpt: 'Pašić studied engineering in Switzerland and embraced radical politics as a student at the Polytechnical School in Zürich.' },
        { claim: 'Marković circle', locator: 'Radical Party', excerpt: 'One of them was Svetozar Marković, who would become a major socialist ideologue in Serbia.' },
        { claim: 'death sentence and exile in Bulgaria', locator: 'lead', excerpt: 'After the failed Timok Rebellion against the government of King Milan I, he was sentenced to death but narrowly avoided capture and execution. He spent the next six years exiled in Bulgaria.' },
        { claim: 'cabinet from 12 September 1912, Balkan League', locator: 'Balkan Wars', excerpt: 'He was one of the major players in the formation of the Balkan League which later resulted in the First Balkan War (1912–13) and the Second Balkan War (1913) which almost doubled the size of Serbia' },
        { claim: 'led the Serbs at Bucharest', source: E('Second_Balkan_War'), locator: 'Armistice', excerpt: 'When the delegations met in Bucharest on 30 July, the Serbs were led by Pašić' },
        { claim: 'Corfu government in exile', locator: 'lead', excerpt: 'Pašić led the government in exile in the Greek island of Corfu, where the Corfu Declaration was signed' },
        { claim: 'died of a heart attack in Belgrade', locator: 'Death', excerpt: 'Nikola Pašić suffered a heart attack and died in Belgrade, at age 80.' },
      ],
    },
    activities: [
      { functionId: 'government', affiliationId: null, startYear: 1891, endYear: 1918, primary: true, claim: 'Prime minister of the Kingdom of Serbia (1891–1892, 1904–1905, 1906–1908, 1909–1911, 1912–1918); the Kingdom of Serbia has no catalog affiliation', locator: 'lead', excerpt: 'He served as prime minister from 1904 to 1905, 1906 to 1908, 1909 to 1911 and finally from 1912 to 1918' },
      { functionId: 'government', affiliationId: 'state-yugoslavia', startYear: 1921, endYear: 1926, claim: 'Prime minister of the Kingdom of Serbs, Croats and Slovenes', locator: 'lead', excerpt: 'He served as prime minister on two more occasions, from 1921 to July 1924 and from November 1924 to 1926.' },
      { functionId: 'political-leadership', affiliationId: null, startYear: 1878, endYear: 1926, claim: 'Leader of the People\'s Radical Party; no catalog affiliation', locator: 'lead', excerpt: 'he was elected to the National Assembly in 1878 as a member of the People\'s Radical Party, which was formally organised three years later' },
    ],
    career: [
      ['1878', '국민의회 의원 (인민급진당)', 'Deputy in the National Assembly (People\'s Radical Party)'],
      ['1891–1892', '세르비아 총리', 'Prime minister of Serbia'],
      ['1912–1918', '세르비아 총리 (발칸 전쟁과 1차 세계대전)', 'Prime minister of Serbia (Balkan Wars and First World War)'],
      ['1913', '부쿠레슈티 강화회의 세르비아 대표', 'Serbian delegate at the Bucharest peace conference'],
      ['1921–1926', '세르브·크로아트·슬로벤 왕국 총리', 'Prime minister of the Kingdom of Serbs, Croats and Slovenes'],
    ],
  })),
  unaffiliated(person({
    id: 'ivan-geshov',
    given: ['이반', 'Ivan'], family: ['게쇼프', 'Geshov'], nativeName: 'Иван Гешов', years: '1849–1924',
    citizenship: 'bulgaria', origin: 'bulgaria',
    epithet: ['제1차 발칸 전쟁을 이끌고 동맹국과의 전쟁에 반대해 물러난 불가리아 총리',
      'Prime minister who led Bulgaria through the Balkan League and the First Balkan War and resigned rather than fight the allies'],
    bio: ['플로브디프의 상인 집안에서 태어나 맨체스터 오언스 칼리지에서 정치경제학을 배웠다. 오스만 지배에 반대하는 글로 사형 선고를 받았다가 알레포 유배로 감형되었다. 1883년부터 불가리아 국립은행 총재, 여러 차례 재무장관을 지냈고 1901년 인민당 당수가 되었다. 1911년 3월 29일 총리가 되어 발칸 동맹 정책을 추진하고 제1차 발칸 전쟁을 이끌었으나, 동맹국에 전쟁을 거는 차르의 정책에 반대해 런던 조약이 서명된 1913년 5월 30일 사임했다.',
      'Born in Plovdiv to a merchant family, he studied political economy at Owens College in Manchester. Sentenced to death for his writings against Ottoman rule, he had the sentence commuted to exile in Aleppo. He was governor of the Bulgarian National Bank from 1883, finance minister several times, and leader of the People\'s Party from 1901. Prime minister from 29 March 1911, he pursued the policy of the Balkan League and led Bulgaria through the First Balkan War, but resigned on 30 May 1913, the day the Treaty of London was signed, because he opposed the tsar\'s policy of making war on the allies.'],
    fate: ['natural', '자연사', 'Natural causes'],
    aliases: { ko: [], en: ['Ivan Geshoff'] },
    sources: [S.geshov],
    facts: {
      years: { claim: '1849–1924', locator: 'lead', excerpt: '20 February 1849 – 11 March 1924' },
      citizenship: { claim: 'Bulgarian prime minister', locator: 'lead', excerpt: 'was a Bulgarian economist and politician who served as Governor of the Bulgarian National Bank, Bulgarian Prime Minister and Minister of Foreign Affairs' },
      nationalOrigin: { claim: 'born in Plovdiv', locator: 'Biography', excerpt: 'He was born in Plovdiv to a family of merchants originally from Karlovo.' },
      bio: [
        { claim: 'Owens College, Manchester', locator: 'Biography', excerpt: 'as well as at Owens College in Manchester (1866–1869), where he studied logic and political economy under William Stanley Jevons' },
        { claim: 'death sentence commuted to exile in Aleppo', locator: 'Biography', excerpt: 'He wrote a series of letters against the Ottomans and was sentenced to death, although this was later commuted to exile in Aleppo.' },
        { claim: 'governor of the National Bank', locator: 'Biography', excerpt: 'As governor of the Bulgarian National Bank from 1883 onwards he became recognized as one of the country\'s leading economic minds' },
        { claim: 'People\'s Party leader 1901', locator: 'Biography', excerpt: 'In 1901 he became President of the Sabranie (Assembly) and that same year was elected leader of the People\'s Party, following the death of Stoilov.' },
        { claim: 'government from 29 March 1911', locator: 'Biography', excerpt: 'Geshov finally formed a government on 29 March 1911, heading a moderate coalition of nationalists and Stoyan Danev\'s Russophile faction.' },
        { claim: 'resigned 30 May 1913', locator: 'Biography', excerpt: 'However, he resigned on 30 May 1913, the day that the Treaty of London was signed to end the War, as he opposed the Tsar\'s policy of making war on the Balkan League allies.' },
      ],
    },
    activities: [
      { functionId: 'government', affiliationId: 'state-bulgaria', startYear: 1911, endYear: 1913, primary: true, claim: 'Prime minister of Bulgaria 1911–1913', locator: 'Biography', excerpt: 'He also supported the policy of working through the Balkan League and led the country through the First Balkan War against Ottoman Empire.' },
      { functionId: 'economy', affiliationId: 'state-bulgaria', startYear: 1883, endYear: null, claim: 'Governor of the Bulgarian National Bank', locator: 'Biography', excerpt: 'As governor of the Bulgarian National Bank from 1883 onwards he became recognized as one of the country\'s leading economic minds' },
      { functionId: 'political-leadership', affiliationId: null, startYear: 1901, endYear: 1923, claim: 'Leader of the People\'s Party; no catalog affiliation', locator: 'Biography', excerpt: 'In 1901 he became President of the Sabranie (Assembly) and that same year was elected leader of the People\'s Party, following the death of Stoilov.' },
    ],
    career: [
      ['1883', '불가리아 국립은행 총재', 'Governor of the Bulgarian National Bank'],
      ['1894–1897', '재무장관', 'Finance minister'],
      ['1901', '국민의회 의장, 인민당 당수', 'President of the National Assembly and leader of the People\'s Party'],
      ['1911–1913', '불가리아 총리', 'Prime minister of Bulgaria'],
    ],
  })),
  unaffiliated(person({
    id: 'nikola-i-of-montenegro',
    given: ['', ''], family: ['니콜라 1세', 'Nikola I'], nativeName: 'Никола I', years: '1841–1921',
    citizenship: 'montenegro', origin: 'montenegro',
    epithet: ['오스만 제국에 맨 먼저 선전포고하고 슈코드라를 점령한 몬테네그로의 마지막 군주',
      'Last monarch of Montenegro, the first to declare war on the Ottomans in 1912, who took Scutari in defiance of the Great Powers'],
    bio: ['1860년 몬테네그로 공이 되었고 1910년 첫 국왕이 되었다. 1912년 발칸 전쟁이 터지자 동맹국 가운데 가장 열성적으로 오스만 제국을 유럽에서 몰아내려 했고, 10월 8일 맨 먼저 선전포고했다. 열강이 몬테네그로 해안 전체를 봉쇄했는데도 포위전 끝에 1913년 4월 슈코드라를 차지했으나, 알바니아 독립을 앞세운 열강의 압력으로 내놓아야 했다. 1916년 오스트리아-헝가리에 나라를 점령당해 이탈리아와 프랑스로 망명했고, 1918년 폐위된 뒤에도 왕위를 주장하다 1921년 앙티브에서 죽었다.',
      'Prince of Montenegro from 1860 and its first and only king from 1910. When the Balkan Wars broke out in 1912 he was the most enthusiastic of the allies, eager to drive the Ottomans out of Europe, and on 8 October Montenegro was the first to declare war. Defying the Concert of Europe, which blockaded the whole Montenegrin coast, he took Scutari after a siege in April 1913, but the Great Powers, set on an independent Albania, made him give it up. Montenegro was overrun by Austria-Hungary in 1916 and he fled to Italy and France; deposed in 1918, he went on claiming the throne until his death at Antibes in 1921.'],
    fate: ['exile', '망명지에서 사망', 'Died in exile'],
    aliases: { ko: ['니콜라 페트로비치녜고시'], en: ['Nikola Petrović-Njegoš', 'Nicholas I of Montenegro'] },
    sources: [S.nikola, E('Balkan_Wars')],
    facts: {
      years: { claim: '1841–1921', locator: 'lead', excerpt: '7 October [O.S. 25 September] 1841 – 1 March 1921' },
      citizenship: { claim: 'last monarch of Montenegro', locator: 'lead', excerpt: 'was the last monarch of Montenegro from 1860 to 1918, reigning as prince from 1860 to 1910 and as the country\'s first and only king from 1910 to 1918' },
      nationalOrigin: { claim: 'Petrović-Njegoš dynasty of Montenegro', locator: 'lead', excerpt: 'Nikola I Petrović-Njegoš (Serbian Cyrillic: Никола I Петровић-Његош' },
      bio: [
        { claim: 'the most enthusiastic ally', locator: 'Biography', excerpt: 'When the Balkan Wars broke out in 1912 King Nikola was one of the most enthusiastic of the allies. He wanted to drive the Ottomans completely out of Europe.' },
        { claim: 'Montenegro declared war first, 8 October', source: E('Balkan_Wars'), locator: 'First Balkan War', excerpt: 'Montenegro was the first to declare war on 8 October (25 September O.S.).' },
        { claim: 'took Scutari despite the blockade', locator: 'Biography', excerpt: 'He defied the Concert of Europe and captured Scutari after a siege, despite the fact that they blockaded the whole coast of Montenegro.' },
        { claim: 'exile after 1916', locator: 'Biography', excerpt: 'In January 1916, after the defeat of Serbia, Montenegro was also conquered by Austria-Hungary, and the King fled to Italy and then to France.' },
        { claim: 'died at Antibes', locator: 'Biography', excerpt: 'Nikola, who was in exile in France, continued to claim the throne until his death in Antibes in 1921.' },
      ],
    },
    activities: [
      { functionId: 'monarchy', affiliationId: null, startYear: 1860, endYear: 1918, primary: true, claim: 'Prince (1860–1910) and King (1910–1918) of Montenegro; Montenegro has no catalog affiliation', locator: 'lead', excerpt: 'was the last monarch of Montenegro from 1860 to 1918, reigning as prince from 1860 to 1910 and as the country\'s first and only king from 1910 to 1918' },
    ],
    career: [
      ['1860', '몬테네그로 공 즉위', 'Became Prince of Montenegro'],
      ['1910', '몬테네그로 국왕', 'King of Montenegro'],
      ['1912–1913', '제1차 발칸 전쟁, 슈코드라 포위', 'First Balkan War and siege of Scutari'],
      ['1916', '이탈리아·프랑스로 망명', 'Exile in Italy and France'],
      ['1918', '포드고리차 의회의 폐위 결정', 'Deposed by the Podgorica assembly'],
    ],
  })),
  person({
    id: 'ismail-qemali',
    given: ['이스마일', 'Ismail'], family: ['케말리', 'Qemali'], nativeName: 'Ismail Qemali', years: '1844–1919',
    citizenship: 'albania', origin: 'albania',
    epithet: ['1912년 11월 28일 블로러에서 알바니아 독립을 선언하고 임시정부를 이끈 알바니아의 첫 총리',
      'First prime minister of Albania, who proclaimed its independence at Vlorë on 28 November 1912'],
    bio: ['블로러의 알바니아 귀족 집안에서 태어나 이스탄불에서 법을 공부하고 오스만 행정관으로 일했다. 압뒬하미트 2세와 맞서 1900년 망명했고, 청년 튀르크 혁명 뒤 돌아와 베라트 선출 오스만 의회 의원이 되었다. 1912년 알바니아 봉기에서 큰 역할을 했고, 발칸 동맹군이 알바니아 땅을 나눠 가지려 하자 빈에서 오스트리아-헝가리의 지지를 확인한 뒤 블로러로 가 11월 28일 독립 선언을 주도했다. 임시정부 수반 겸 외무장관을 지내다 1914년 1월 사임했고, 1919년 이탈리아 페루자에서 망명 중 죽었다.',
      'Born in Vlorë to an Albanian noble family, he studied law in Istanbul and served in the Ottoman administration. Driven into exile by Abdul Hamid II in 1900, he returned after the Young Turk Revolution as deputy for Berat in the Ottoman parliament. He played a major part in the Albanian revolt of 1912, and when the Balkan allies moved to partition Albanian lands he secured Austro-Hungarian backing in Vienna and went to Vlorë, where he led the declaration of independence on 28 November 1912. He headed the provisional government as prime minister and foreign minister until resigning in January 1914, and died in exile at Perugia in Italy in 1919.'],
    fate: ['exile', '망명지에서 사망', 'Died in exile'],
    aliases: { ko: ['이스마일 케말 베이 블로라'], en: ['Ismail Kemal Bey Vlora', 'Ismail Kemal'] },
    sources: [S.qemali, S.albania],
    facts: {
      years: { claim: '1844–1919', locator: 'lead', excerpt: '16 January 1844 – 26 January 1919' },
      citizenship: { claim: 'Albanian statesman, first prime minister of Albania', locator: 'lead', excerpt: 'was an Albanian politician and statesman who is regarded as the founder of modern Albania' },
      nationalOrigin: { claim: 'Albanian noble family of Vlorë', locator: 'lead', excerpt: 'Born in Vlorë to an Albanian noble family' },
      bio: [
        { claim: 'law in Istanbul, Ottoman career', locator: 'lead', excerpt: 'Qemali developed an early interest in languages and later studied law in Istanbul.' },
        { claim: 'exile from 1900', locator: 'Exile', excerpt: 'In May 1900 Ismail Qemali boarded the British ambassador\'s yacht, claimed asylum and was conveyed out of the empire where for the next eight years he lived in exile.' },
        { claim: 'deputy for Berat after 1908', locator: 'Young Turk Revolution', excerpt: 'After the 1908 revolution and constitutional restoration Qemali returned from exile and became a deputy representing Berat in the restored Ottoman Parliament' },
        { claim: 'Albanian revolt of 1912', locator: 'lead', excerpt: 'He took part in the Congress of Ottoman Opposition and played a major role in the Albanian revolt of 1912.' },
        { claim: 'Vienna, Austro-Hungarian support', locator: 'Balkan Wars', excerpt: 'Later he departed for Vienna and kept in touch through telegram with Austro-Hungarian officials and supported as a solution their intervention in Albania.' },
        { claim: 'declaration of 28 November 1912', locator: 'Balkan Wars', excerpt: 'Qemali was the principal figure in the secession of Albania from the Ottoman Empire, in the Albanian Declaration of Independence and the formation of the independent Albania on 28 November 1912.' },
        { claim: 'died at Perugia', locator: 'Death', excerpt: 'remained as its involuntary guest at a hotel in Perugia, much to his irritation. He died of an apparent heart attack on 26 January 1919.' },
      ],
    },
    activities: [
      { functionId: 'government', affiliationId: 'state-albania', startYear: 1912, endYear: 1914, primary: true, claim: 'First prime minister and foreign minister of Albania', locator: 'lead', excerpt: 'He served as the first prime minister of Albania from December 1912 until his resignation in January 1914.' },
    ],
    career: [
      ['1900', '오스만 제국을 떠나 망명', 'Went into exile from the Ottoman Empire'],
      ['1908', '오스만 의회 의원 (베라트)', 'Deputy for Berat in the Ottoman parliament'],
      ['1912', '블로러 회의에서 알바니아 독립 선언', 'Proclaimed Albanian independence at the Vlorë assembly'],
      ['1912–1914', '알바니아 임시정부 총리 겸 외무장관', 'Prime minister and foreign minister of the provisional government of Albania'],
    ],
  }),
  unaffiliated(person({
    id: 'dragisa-lapcevic',
    given: ['드라기샤', 'Dragiša'], family: ['라프체비치', 'Lapčević'], nativeName: 'Драгиша Лапчевић', years: '1867–1939',
    citizenship: 'serbia', origin: 'serbia',
    epithet: ['발칸 전쟁 직전 의회에서 전쟁 예산에 반대한 세르비아 사회민주당 지도자',
      'Serbian Social Democratic leader who won international renown by voting against war budgets before the Balkan Wars'],
    bio: ['우지체에서 태어나 빵집과 기계 공장 노동자, 면사무소 서기로 일하며 독학으로 사회주의를 익혔다. 스베토자르 마르코비치의 영향을 받아 카우츠키의 노선을 따랐고, 1903년 디미트리예 투초비치와 함께 세르비아 사회민주당을 세웠다. 1905~1908년과 1912~1919년 의회 의원으로 발칸 전쟁과 1차 세계대전 직전 전쟁 예산에 반대표를 던지고 발칸 연방을 주장했다. 당 안에서는 투초비치의 좌파와 논쟁하며 중도적 입장에 섰다. 1919년 이후 볼셰비키와 코민테른 가입에 반대해 1920년 유고슬라비아 공산당에서 제명되었고, 개량주의 사회당을 만든 뒤 정치에서 물러나 노동운동사를 썼다.',
      'Born in Užice, he worked in a bakery and a mechanic shop and as a municipal clerk while teaching himself socialism. Influenced by Svetozar Marković, he followed Kautsky, and in 1903 founded the Serbian Social Democratic Party with Dimitrije Tucović. As a deputy in the Skupština in 1905–1908 and 1912–1919 he voted against war budgets before the Balkan Wars and the First World War and advocated a Balkan federation. Inside the party he took centrist positions against Tucović\'s left wing. After 1919 he opposed the Bolsheviks and affiliation to the Comintern, was expelled from the Yugoslav communist party in 1920, founded a reformist Socialist Party and then left politics to write the history of the Serbian labour movement.'],
    fate: ['natural', '자연사', 'Natural causes'],
    aliases: { ko: ['드라구틴 라프체비치'], en: ['Dragutin Lapčević', 'Dragisa Lapcevic'] },
    sources: [S.lapcevic, S.lapcevicRu, S.ssdp],
    facts: {
      years: { claim: '1867–1939', locator: 'lead', excerpt: '27 October 1867 – 14 August 1939' },
      citizenship: { claim: 'Serbian politician', locator: 'lead', excerpt: 'was a Serbian politician, journalist, and historian' },
      nationalOrigin: { claim: 'born in Užice', locator: 'Life', excerpt: 'Dragiša was born in Užice in 1867.' },
      bio: [
        { claim: 'worker and clerk, self-taught', locator: 'Life', excerpt: 'Initially, he worked as an unskilled laborer, first in a bakery and in a mechanic shop. Later, he was appointed as a municipal clerk.' },
        { claim: 'Marković, Kautsky', locator: 'Life', excerpt: 'Influenced by Svetozar Marković, he supported the ideas of Karl Kautsky and opposed those of Georgi Plekhanov.' },
        { claim: 'co-founder of the SSDP with Tucović', locator: 'lead', excerpt: 'He was one of the founders, alongside Dimitrije Tucović, of the Serbian Social Democratic Party (existed 1903–1918), that supported a Balkan Federation during the Kingdom of Serbia.' },
        { claim: 'voted against war budgets, Skupština deputy', locator: 'Life', excerpt: 'From 1905 to 1908 and again from 1912 to 1919, he was a deputy in the Skupština, where he won a great international  reputation by voting against war budgets ahead of the Balkan Wars of 1912–13 and World War I, advocating a Balkan Federation.' },
        { claim: 'centrist against Tucović\'s left', locator: 'Life', excerpt: 'In polemics with the left wing of the party, headed by Dimitrije Tucović, Lapčević often adopted centrist and right-opportunist positions.' },
        { claim: 'expelled 1920, reformist Socialist Party 1921', locator: 'Life', excerpt: 'In 1921 Dragiša Lapčević was one of the organizers of the reformist Socialist Party of Yugoslavia.' },
      ],
    },
    activities: [
      { functionId: 'political-leadership', affiliationId: null, startYear: 1903, endYear: 1919, primary: true, claim: 'Co-founder and chairman of the Serbian Social Democratic Party; no catalog affiliation', locator: 'Лапчевич, Драгиша (lead)', source: S.lapcevicRu, excerpt: 'совместно с Димитрие Туцовичем сооснователь и председатель Сербской социал-демократической партии' },
      { functionId: 'legislature', affiliationId: null, startYear: 1912, endYear: 1919, claim: 'Social Democratic deputy in the Serbian Skupština (also 1905–1908); the Kingdom of Serbia has no catalog affiliation', locator: 'Life', excerpt: 'From 1905 to 1908 and again from 1912 to 1919, he was a deputy in the Skupština' },
    ],
    career: [
      ['1903', '세르비아 사회민주당 창당', 'Co-founded the Serbian Social Democratic Party'],
      ['1905–1908', '세르비아 의회 의원', 'Deputy in the Serbian Skupština'],
      ['1912–1919', '세르비아 의회 의원, 전쟁 예산 반대', 'Deputy in the Skupština; voted against war budgets'],
      ['1920', '유고슬라비아 공산당에서 제명', 'Expelled from the Yugoslav communist party'],
      ['1921', '개량주의 유고슬라비아 사회당 창당', 'Co-founded the reformist Socialist Party of Yugoslavia'],
    ],
  })),
].map(withNative);

module.exports = people;
// Proposed political-position collections (commulingo_person_collections).
module.exports.collections = {
  'ferdinand-i-of-bulgaria': 'monarchist',
  'eleftherios-venizelos': 'liberal-republican',
  'nikola-pasic': 'nationalist',
  'ivan-geshov': 'conservative',
  'nikola-i-of-montenegro': 'monarchist',
  'ismail-qemali': 'national-liberation',
  'dragisa-lapcevic': 'non-bolshevik-socialist',
};
