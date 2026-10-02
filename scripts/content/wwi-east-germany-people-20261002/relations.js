// Event links for the people registered from the queue in
// dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md, keyed by event.
// rows: [personId, relationKind, relationKo, relationEn, noteKo, noteEn, side?]
// sort_order is set per event in build.js. A person registered earlier (EXISTING
// in build.js) may be linked too. Events with sides take no opponent.
module.exports = {
    'world-war-i': [
        ['wilhelm-ii', 'leader', '독일 황제', 'German Emperor', '1918년 11월 9일 공화국이 선포되면서 퇴위했다.', 'Abdicated as the republic was proclaimed on 9 November 1918.', 'central-powers'],
        ['woodrow-wilson', 'leader', '미국 대통령', 'President of the United States', '1917년 4월 참전을 이끌고 1918년 1월 14개조를 내놓았으며, 독일은 이를 근거로 휴전을 청했다.', 'Took the United States into the war in April 1917 and set out the Fourteen Points in January 1918, on which Germany asked for an armistice.', 'entente'],
        ['erich-ludendorff', 'leader', '독일군 병참총감', 'First Quartermaster General of the German army', '1916년 8월 힌덴부르크와 함께 참모본부를 넘겨받았고, 1918년 3월 미하엘 작전으로 춘계 공세를 열었다.', 'Took over the General Staff with Hindenburg in August 1916 and opened the spring offensive with Operation Michael in March 1918.', 'central-powers'],
        ['ferdinand-foch', 'leader', '연합군 총사령관', 'Allied supreme commander', '1918년 3월부터 연합군을 지휘했고, 춘계 공세가 멎은 7월부터 반격을 이끌었다.', 'Commanded the Allied armies from March 1918 and led the counter-attack after the spring offensive stalled in July.', 'entente'],
        ['enver-pasha', 'leader', '오스만 제국 육군장관', 'Ottoman war minister', '1914년 12월 사르카미시에서 10만 병력의 86%를 잃었다.', 'Lost 86% of his 100,000-strong force at Sarıkamış in December 1914.', 'central-powers'],
        ['georges-clemenceau', 'leader', '프랑스 총리', 'French prime minister', '전쟁이 가장 어려웠던 1917년 11월 총리가 되어 독일에 대한 완전한 승리를 요구했다.', 'Became prime minister in November 1917, at one of the darkest hours of the war, and demanded total victory over Germany.', 'entente'],
        ['mustafa-kemal-ataturk', 'executor', '오스만군 지휘관', 'Ottoman commander', '갈리폴리 전투에서 이름을 떨쳤고, 뒤에 튀르키예 공화국을 세웠다.', 'Rose to prominence at Gallipoli and later founded the Republic of Turkey.', 'central-powers'],
        ['gavrilo-princip', 'executor', '사라예보 암살자', 'Sarajevo assassin', '1914년 6월 28일 사라예보에서 프란츠 페르디난트 대공 부부를 쏘아 죽였다.', 'Shot dead Archduke Franz Ferdinand and his wife in Sarajevo on 28 June 1914.'],
        ['franz-ferdinand', 'target', '오스트리아-헝가리 황위 계승자', 'Heir to the Austro-Hungarian throne', '사라예보에서 암살되어 7월 위기의 발단이 되었다.', 'His assassination in Sarajevo set off the July Crisis.', 'central-powers'],
        ['alfred-von-tirpitz', 'executor', '독일 해군 장관', 'German naval secretary', '영국 해군에 맞설 함대 건설을 이끌었다.', 'Led the fleet-building programme meant to rival the Royal Navy.', 'central-powers'],
        ['robert-nivelle', 'executor', '프랑스군 총사령관', 'French commander-in-chief', '1917년 4월 니벨 공세가 큰 손실만 남겨 프랑스군 항명 사태를 불렀다.', 'His April 1917 offensive produced only heavy losses and set off the French army mutinies.', 'entente'],
        ['luigi-cadorna', 'executor', '이탈리아군 참모총장', 'Italian chief of staff', '1915~1917년 이손초 강을 따라 정면 공격을 되풀이했다.', 'Repeated frontal assaults along the Isonzo in 1915–1917.', 'entente'],
    ],
    'world-war-i-aftermath-1918-1923': [
        ['woodrow-wilson', 'leader', '미국 대통령, 「4거두」', 'US President; one of the Big Four', '14개조로 강화의 출발점을 놓고 국제연맹 창설을 이끌었지만, 미국 상원이 조약 비준을 거부했다.', 'Set the starting point of the peace with the Fourteen Points and championed the League of Nations, but the US Senate refused to ratify the treaty.'],
        ['david-lloyd-george', 'leader', '영국 총리, 「4거두」', 'British prime minister; one of the Big Four', '프랑스의 패권을 막고 볼셰비키 러시아에 대한 방벽으로 독일을 어느 정도 되살려 두려 했다.', 'Sought to prevent French domination and keep a revived Germany as a bulwark against Bolshevik Russia.'],
        ['vittorio-emanuele-orlando', 'leader', '이탈리아 총리, 「4거두」', 'Italian prime minister; one of the Big Four', '참전 대가로 약속받은 영토를 요구했으나 이루지 못하고 한때 회의를 떠났다.', 'Pressed for the territory promised for Italy’s entry into the war, failed, and at one point left the conference.'],
        ['mustafa-kemal-ataturk', 'leader', '튀르키예 민족운동 지도자', 'Leader of the Turkish national movement', '1919년 그리스군의 스미르나 상륙 뒤 민족운동을 이끌었고, 앙카라의 대국민의회는 세브르 조약 서명자들의 시민권을 박탈했다.', 'Led the national movement after the Greek landing at Smyrna in 1919; the Grand National Assembly in Ankara stripped the signatories of Sèvres of their citizenship.'],
        ['karl-renner', 'leader', '독일-오스트리아 총리', 'Chancellor of German-Austria', '사회민주당이 이끈 연립정부의 총리로, 1919년 9월 10일 연합국의 최후통첩 아래 생제르맹 조약에 서명했다.', 'Chancellor of the Social Democrat-led coalition, he signed the Treaty of Saint-Germain under an Allied ultimatum on 10 September 1919.'],
        ['gustav-stresemann', 'leader', '독일 총리', 'German chancellor', '1923년 9월 26일 소극적 저항을 끝냈고, 두 달 뒤 렌텐마르크를 도입해 통화를 안정시켰다.', 'Ended passive resistance on 26 September 1923 and two months later stabilised the currency with the Rentenmark.'],
        ['ferdinand-foch', 'participant', '연합군 총사령관', 'Allied supreme commander', '독일에 대한 휴전 조건을 작성했고, 베르사유 조약이 독일에 너무 관대하다고 비판했다.', 'Drew up the armistice terms for Germany and criticised the Treaty of Versailles as too lenient.'],
        ['erich-ludendorff', 'participant', '맥주홀 폭동의 공동 지도자', 'Co-leader of the Beer Hall Putsch', '1923년 11월 히틀러와 함께 뮌헨 맥주홀 폭동을 이끌었다.', 'Led the Munich Beer Hall Putsch with Hitler in November 1923.'],
        ['gustav-bauer', 'leader', '독일 총리', 'German chancellor', '샤이데만의 뒤를 이어 연합국의 최후통첩에 굴복해 베르사유 조약을 받아들였다.', 'Succeeded Scheidemann and gave way to the Allied ultimatum to accept the Treaty of Versailles.'],
        ['wilhelm-cuno', 'leader', '독일 총리', 'German chancellor', '1923년 루르 점령에 맞서 「소극적 저항」을 호소했다.', 'Called for “passive resistance” to the occupation of the Ruhr in 1923.'],
        ['george-curzon', 'participant', '영국 외무장관', 'British Foreign Secretary', '로잔 회의에서 이뇌뉘와 8개월 동안 협상했다.', 'Negotiated with İnönü for eight months at the Lausanne conference.'],
        ['ismet-inonu', 'participant', '튀르키예 대표', 'Turkish delegate', '로잔 회의의 협상 대표로 1923년 로잔 조약을 이끌어 냈다.', 'Chief negotiator at Lausanne, he secured the Treaty of Lausanne in 1923.'],
        ['lucjan-zeligowski', 'participant', '폴란드 장군', 'Polish general', '1920년 10월 피우수트스키가 꾸민 「반란」으로 빌뉴스를 점령했다.', 'Took Vilnius in the “mutiny” staged by Piłsudski in October 1920.'],
        ['john-maynard-keynes', 'historian', '경제학자, 『평화의 경제적 귀결』 저자', 'Economist; author of The Economic Consequences of the Peace', '파리 회의의 영국 재무부 대표로, 조약을 「카르타고식 강화」라 부르며 배상이 유럽 경제를 흔들 것이라 경고했다.', 'Principal British Treasury representative at Paris, he called the treaty a “Carthaginian peace” and warned that reparations would destabilise Europe’s economy.'],
    ],
    'soviet-zone-gdr-1945-1949': [
        ['sergei-tiulpanov', 'executor', '소련 군정청 선전국장', 'Head of the SMAD Propaganda Administration', '시민 정당의 지부를 여러 핑계로 묶어 두라고 비밀리에 지시했고, 네이마크는 그를 사회주의통일당을 「새로운 형태의 당」으로 만든 소련 측 인물로 꼽는다.', 'Secretly instructed SMAD offices to limit the bourgeois parties’ local groups on formal pretexts; Naimark identifies him as the Soviet official who shaped the SED into “a party of a new type”.'],
        ['anton-ackermann', 'participant', '작센 파견 공산당 그룹 지도자', 'Leader of the KPD group sent to Saxony', '1945년 6월 11일 공산당 호소문을 써서 소비에트 체제 대신 「반파시즘 민주공화국」을 목표로 내걸었다.', 'Wrote the KPD appeal of 11 June 1945, which set “an anti-fascist, democratic republic” rather than the Soviet system as the aim.'],
        ['hermann-matern', 'participant', '작센 공산당 지도자', 'Saxon KPD leader', '대기업 몰수를 주민투표에 부치자고 제안했다.', 'Proposed putting the expropriation to a popular vote.'],
        ['max-fechner', 'participant', '사회주의통일당 부의장', 'Deputy chairman of the SED', '사회민주당 출신으로 울브리히트와 함께 통합당의 부의장이 되었다.', 'A Social Democrat, he became deputy chairman of the merged party alongside Ulbricht.'],
        ['kurt-schumacher', 'opponent', '서방 점령지구 사회민주당 지도자', 'SPD leader in the western zones', '공산당과 사회민주당의 통합에 반대했다.', 'Opposed the merger of the Communists and Social Democrats.'],
        ['jakob-kaiser', 'opponent', '소련 점령지구 기독교민주연합 대표', 'CDU leader in the Soviet zone', '공산당을 비판했다는 이유로 1947년 12월 에른스트 레머와 함께 군정청에 의해 물러났다.', 'Removed by SMAD with Ernst Lemmer in December 1947 for criticising the Communists.'],
        ['otto-nuschke', 'participant', '기독교민주연합 대표', 'CDU leader', '카이저의 뒤를 이은 고분고분한 후임이었다.', 'Kaiser’s more pliant successor.'],
    ],
    'east-german-uprising-1953': [
        ['rudolf-herrnstadt', 'participant', '《노이에스 도이칠란트》 편집장', 'Editor-in-chief of Neues Deutschland', '새 노선 공보문을 썼고 7월 정치국에서 집단지도 방안을 내놓았으나, 베리야와 이어진 「분파」로 몰려 숙청되었다.', 'Wrote the New Course communiqué and proposed collective leadership in the July Politburo, but was purged as a “faction” linked to Beria.', 'regime'],
        ['wilhelm-zaisser', 'executor', '국가보안부 장관', 'Minister of State Security', '헤른슈타트와 함께 당 개편을 밀어붙였다가 7월 장관직을 잃고 정치국에서 쫓겨났다.', 'Pressed with Herrnstadt for a reorganisation of the party, then lost his ministry and his Politburo seat in July.', 'regime'],
        ['max-fechner', 'participant', '법무장관', 'Minister of Justice', '파업 노동자 처벌을 누그러뜨리려 하다 7월 14일 해임되어 투옥되었다.', 'Tried to moderate the prosecution of striking workers and was dismissed on 14 July and imprisoned.', 'regime'],
        ['ernst-wollweber', 'executor', '국가보안청장', 'Head of the State Secretariat for State Security', '내무부 산하로 격하된 국가보안 기구를 넘겨받았다.', 'Took over the state security apparatus after it was downgraded to a State Secretariat within the Interior Ministry.', 'regime'],
        ['hermann-matern', 'participant', '정치국원', 'Politburo member', '7월 7~8일 정치국 회의에서 호네커와 함께 울브리히트 편에 섰다.', 'Sided with Ulbricht, together with Honecker, at the Politburo session of 7–8 July.', 'regime'],
    ],
    'eastern-europe-crisis-1953-1956': [
        ['rudolf-herrnstadt', 'participant', '동독 반대파', 'East German oppositionist', '1953년 7월 말 차이서와 함께 정치국에서 쫓겨났다.', 'Expelled from the Politburo with Zaisser at the end of July 1953.'],
        ['wilhelm-zaisser', 'executor', '동독 국가보안부 장관', 'East German Minister of State Security', '1953년 7월 말 헤른슈타트와 함께 정치국에서 쫓겨났다.', 'Expelled from the Politburo with Herrnstadt at the end of July 1953.'],
    ],
};
