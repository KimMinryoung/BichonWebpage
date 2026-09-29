#!/usr/bin/env node
// German Revolution 1918–1919 event batch (2026-09-29). Source of truth for
// ../german-revolution-20260929.json (event + relations) and
// ../german-revolution-20260929-people.json (new people for commulingo-people-upsert).
// Edit here, run `node build.js`, commit the JSON with it.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const S = {
    gr: W('German_revolution_of_1918%E2%80%931919'),
    grKo: 'https://ko.wikipedia.org/wiki/%EB%8F%85%EC%9D%BC_11%EC%9B%94_%ED%98%81%EB%AA%85',
    kiel: W('Kiel_mutiny'),
    maxBaden: W('Prince_Maximilian_of_Baden'),
    armistice: W('Armistice_of_11_November_1918'),
    peopleState: W('People%27s_State_of_Bavaria'),
    scheidemann: W('Philipp_Scheidemann'),
    liebknecht: W('Karl_Liebknecht'),
    cpd: W('Council_of_the_People%27s_Deputies'),
    pact: W('Ebert%E2%80%93Groener_pact'),
    muller: W('Richard_M%C3%BCller_(socialist)'),
    stinnes: W('Stinnes%E2%80%93Legien_Agreement'),
    stab: W('Stab-in-the-back_myth'),
    xmas: W('1918_Christmas_crisis'),
    kpd: W('Communist_Party_of_Germany'),
    luxProgram: 'https://www.marxists.org/archive/luxemburg/1918/12/31.htm',
    luxWant: 'https://www.marxists.org/archive/luxemburg/1918/12/14.htm',
    freikorps: W('Freikorps'),
    spartacist: W('Spartacist_uprising'),
    luxOrder: 'https://www.marxists.org/archive/luxemburg/1919/01/14.htm',
    liebInspite: 'https://www.marxists.org/archive/liebknecht-k/works/1919/01/inspite.html',
    pabst: W('Waldemar_Pabst'),
    luxemburg: W('Rosa_Luxemburg'),
    march: W('Berlin_March_Battles'),
    jogiches: W('Leo_Jogiches'),
    bremen: W('Bremen_Soviet_Republic'),
    eisner: W('Kurt_Eisner'),
    bavaria: W('Bavarian_Soviet_Republic'),
    levine: W('Eugen_Levin%C3%A9'),
    election: W('1919_German_federal_election'),
    assembly: W('Weimar_National_Assembly'),
    constitution: W('Weimar_Constitution'),
    versailles: W('Treaty_of_Versailles'),
    kapp: W('Kapp_Putsch'),
    broue: W('Pierre_Brou%C3%A9'),
};

const sections = [
    {
        heading: { ko: '패전과 킬 수병 봉기', en: 'Defeat and the Kiel mutiny' },
        paragraphs: [
            {
                ko: '1918년 가을 독일군의 패배가 분명해지자, 10월 초 자유주의 성향의 막스 폰 바덴 공이 재상이 되어 사회민주당(SPD)을 처음으로 내각에 들이고 연합국에 휴전을 요청했다. 10월 28일의 헌법 개정으로 제국은 의회에 책임지는 입헌군주제가 되었다. 개혁은 위에서 이루어졌고, 전쟁에 지친 병사와 노동자는 아직 움직이기 전이었다.',
                en: 'As German defeat became clear in autumn 1918, the liberal-minded Prince Max of Baden became chancellor in early October, brought the Social Democrats (SPD) into government for the first time and asked the Allies for an armistice. The constitutional amendment of 28 October made the Empire a monarchy responsible to parliament. Reform came from above, before the war-weary soldiers and workers had moved.',
                sources: [S.maxBaden, S.gr, S.armistice],
            },
            {
                ko: '그러나 해군 지휘부는 10월 24일 정부 몰래 영국 함대와의 마지막 결전을 명령했다. 휴전을 코앞에 두고 목숨을 버릴 생각이 없던 빌헬름스하펜의 수병들이 출항을 거부했고, 해군은 작전을 취소한 뒤 수백 명을 체포했다. 11월 3일 킬에서 동료의 석방을 요구하며 행진하던 수병과 노동자에게 군이 발포해 최소 9명이 죽었다. 이튿날 노동자는 총파업에 들어갔고, 진압에 나선 병사들까지 합류하면서 킬은 노동자·병사 평의회의 손에 들어갔다.',
                en: 'But on 24 October the naval command, without the government’s knowledge, ordered a last battle with the British fleet. Sailors at Wilhelmshaven, unwilling to die on the eve of an armistice, refused to sail; the navy called off the operation and arrested hundreds. On 3 November troops in Kiel fired on sailors and workers marching for their comrades’ release, killing at least nine. The next day the workers struck, soldiers sent to suppress them joined in, and Kiel passed into the hands of a workers’ and soldiers’ council.',
                sources: [S.kiel, S.gr],
            },
        ],
    },
    {
        heading: { ko: '평의회의 확산과 11월 9일', en: 'The spread of the councils and 9 November' },
        paragraphs: [
            {
                ko: '베를린 정부는 SPD의 구스타프 노스케를 킬에 보내 사면을 약속하게 했지만, 수병들은 이미 이웃 도시로 흩어져 봉기를 퍼뜨리고 있었다. 11월 7일까지 뤼베크·브레멘·함부르크에서 쾰른과 뮌헨까지 평의회가 권력을 잡았다. 뮌헨에서는 독립사회민주당(USPD)의 쿠르트 아이스너가 11월 8일 바이에른 인민국을 선포했고, 월말까지 모든 연방 군주가 피 흘림 없이 물러났다. 평의회는 대부분 SPD·USPD 당원으로 채워졌고, 군 지휘부의 권한은 빼앗았지만 사유재산과 관료 조직은 건드리지 않았다.',
                en: 'Berlin sent the SPD’s Gustav Noske to Kiel to promise an amnesty, but the sailors had already fanned out to neighbouring cities. By 7 November councils held power from Lübeck, Bremen and Hamburg to Cologne and Munich. In Munich Kurt Eisner of the Independent Social Democrats (USPD) proclaimed the People’s State of Bavaria on 8 November, and by the end of the month every German prince had abdicated without bloodshed. The councils, mostly SPD and USPD members, stripped military commands of their power but left private property and the civil service untouched.',
                sources: [S.gr, S.kiel, S.peopleState],
            },
            {
                ko: 'SPD 지도자 프리드리히 에베르트는 막스 공에게 「황제가 퇴위하지 않으면 사회혁명은 피할 수 없다. 나는 그것을 원하지 않는다. 죄악처럼 증오한다」고 말했다. 11월 9일 베를린 거리가 시위대로 가득 차자 막스 공은 권한 없이 황제의 퇴위를 발표하고 재상직을 에베르트에게 넘겼다. 같은 날 오후 필리프 샤이데만이 제국의회 창문에서 공화국을 선포했고, 몇 시간 뒤 카를 리프크네히트가 왕궁 발코니에서 「자유 사회주의 공화국」을 선포했다. 빌헬름 2세는 이튿날 네덜란드로 망명했다.',
                en: 'The SPD leader Friedrich Ebert told Prince Max: “If the Emperor does not abdicate, the social revolution is unavoidable. But I do not want it, indeed I hate it like sin.” On 9 November, with Berlin’s streets full of demonstrators, Max announced the emperor’s abdication without authority and handed the chancellorship to Ebert. That afternoon Philipp Scheidemann proclaimed a republic from a window of the Reichstag, and hours later Karl Liebknecht proclaimed a “free socialist republic” from a balcony of the royal palace. Wilhelm II went into exile in the Netherlands the next day.',
                sources: [S.gr, S.scheidemann, S.liebknecht],
            },
        ],
    },
    {
        heading: { ko: '인민대표평의회와 에베르트–그뢰너 협약', en: 'The Council of People’s Deputies and the Ebert–Groener pact' },
        paragraphs: [
            {
                ko: '11월 9일 밤 리하르트 뮐러와 에밀 바르트가 이끄는 베를린 대공장의 혁명적 직장위원들이 제국의회를 점거하고 이튿날 평의회 선거를 소집했다. 11월 10일 SPD의 에베르트·샤이데만·란즈베르크와 USPD의 후고 하제·디트만·바르트가 동수로 참여한 인민대표평의회가 구성되었고, 부슈 서커스장에 모인 베를린 평의회가 이를 승인했다. 대베를린 노동자·병사 평의회 집행위원회가 형식상 최고 기관이었으나 실권은 에베르트 정부에 있었다.',
                en: 'On the night of 9 November the Revolutionary Stewards of Berlin’s big factories, led by Richard Müller and Emil Barth, occupied the Reichstag and called council elections for the next day. On 10 November a Council of People’s Deputies was formed with equal numbers from the SPD (Ebert, Scheidemann, Landsberg) and the USPD (Hugo Haase, Dittmann, Barth), and the Berlin councils assembled in the Circus Busch endorsed it. The Executive Council of the Greater Berlin workers’ and soldiers’ councils was formally the highest body, but real power lay with Ebert’s government.',
                sources: [S.gr, S.cpd, S.muller],
            },
            {
                ko: '같은 날 밤 에베르트는 비밀 전화선으로 최고사령부의 빌헬름 그뢰너 장군과 합의했다. 군은 새 정부를 지지하고, 정부는 장교단의 지휘 체계를 건드리지 않는다는 것이었다. 그뢰너는 회고록에 「옛 프로이센주의의 가장 좋고 강한 요소가 새 독일을 위해 구제되었다」고 썼다. 11월 11일 에르츠베르거가 콩피에뉴에서 휴전 협정에 서명해 전쟁이 끝났다.',
                en: 'That night Ebert reached an agreement over a secret telephone line with General Wilhelm Groener of the Supreme Army Command: the army would support the new government, and the government would leave the officer corps’ chain of command intact. Groener wrote in his memoirs that “the best and strongest element of the old Prussianism was saved for the new Germany.” On 11 November Erzberger signed the armistice at Compiègne and the war ended.',
                sources: [S.pact, S.gr, S.armistice],
            },
            {
                ko: '11월 12일 인민대표평의회는 계엄과 검열을 풀고 정치범을 사면했으며, 결사·집회·언론의 자유를 보장하고 20세 이상 모든 남녀의 보통선거와 8시간 노동제를 약속했다. 여성 참정권이 처음으로 약속된 것이다. 제정기의 관료·법원·학교는 거의 그대로 남았다.',
                en: 'On 12 November the Council of People’s Deputies lifted the state of siege and censorship, amnestied political prisoners, guaranteed freedom of association, assembly and the press, and promised universal suffrage for all men and women over twenty and the eight-hour day — the first promise of votes for women. The imperial civil service, courts and schools remained almost unchanged.',
                sources: [S.gr, S.cpd],
            },
        ],
    },
    {
        heading: { ko: '사회화의 좌절과 평의회 대회', en: 'Socialisation stalled and the Congress of Councils' },
        paragraphs: [
            {
                ko: 'USPD의 요구로 카를 카우츠키와 루돌프 힐퍼딩 등이 참여한 사회화위원회가 꾸려졌지만, 석탄 산업 국유화를 검토하다 1919년 4월 아무 성과 없이 해산했다. 그사이 11월 15일 노조 지도자 카를 레기엔과 중공업계의 후고 슈티네스는 노조를 교섭 상대로 인정하고 8시간 노동제와 사업장 노동자위원회를 두는 협정을 맺었다. 노조는 오랜 요구를 얻었지만, 사기업을 인정함으로써 생산수단의 사회화는 더 멀어졌다.',
                en: 'At the USPD’s insistence a Socialisation Commission including Karl Kautsky and Rudolf Hilferding was set up, but it studied the nationalisation of coal and dissolved in April 1919 without result. Meanwhile, on 15 November, the union leader Carl Legien and the industrialist Hugo Stinnes signed an agreement recognising the unions as bargaining partners, with the eight-hour day and works councils. The unions won long-standing demands, but by accepting private enterprise they made socialisation of the means of production more remote.',
                sources: [S.gr, S.stinnes],
            },
            {
                ko: '12월 6일 무장 학생과 병사들이 에베르트를 대통령으로 추대하려는 쿠데타를 시도했고, 같은 날 근위 연대가 스파르타쿠스단 시위에 발포해 16명이 죽었다. 12월 10일 에베르트는 귀환 부대를 맞으며 「어떤 적도 여러분을 이기지 못했다」고 연설해 뒷날 「등 뒤의 칼」 신화의 빌미가 되었다. 12월 16일 베를린에서 열린 전국 노동자·병사 평의회 대회는 평의회에 전권을 주자는 스파르타쿠스단·USPD의 동의를 부결하고, 1919년 1월 19일 국민의회 선거를 결정했다. 대회는 계급장 폐지와 장교 선출 등 군 민주화를 담은 「함부르크 조항」을 만장일치로 채택했으나 최고사령부의 반대로 시행되지 않았다.',
                en: 'On 6 December armed students and soldiers attempted a coup to make Ebert president, and the same day a Guards regiment fired on a Spartacist demonstration, killing 16. On 10 December Ebert greeted returning troops with the words “No enemy overcame you”, later fuel for the stab-in-the-back myth. The Reich Congress of Workers’ and Soldiers’ Councils, which opened in Berlin on 16 December, rejected a Spartacist–USPD motion to vest all power in the councils and set elections to a National Assembly for 19 January 1919. It unanimously adopted the “Hamburg Points” for democratising the army — no rank insignia, elected officers — but the Army Command blocked them.',
                sources: [S.gr, S.stab],
            },
        ],
    },
    {
        heading: { ko: '크리스마스 위기와 공산당 창당', en: 'The Christmas crisis and the founding of the KPD' },
        paragraphs: [
            {
                ko: '킬에서 올라와 정부 청사를 지키던 인민해군사단이 좌파 쪽으로 기울자 정부는 12월 23일 부대 축소와 급여 중단을 명령했다. 수병들이 총리 청사를 점거하고 SPD의 오토 벨스를 인질로 잡자, 에베르트는 비밀 전화선으로 최고사령부와 연락해 24일 아침 왕궁 마구간을 공격하게 했다. 무장 노동자들이 수병 편에 서면서 정부군은 56명을 잃고 물러났다. USPD는 12월 29일 항의하며 정부에서 탈퇴했고, 그 자리에 들어온 노스케는 국내의 적을 상대할 자유군단을 키우기 시작했다.',
                en: 'When the People’s Navy Division, brought from Kiel to guard the government quarter, leaned towards the left, the government ordered it on 23 December to shrink and stopped its pay. The sailors occupied the Chancellery and took the SPD’s Otto Wels hostage; Ebert, in contact with the Army Command by secret line, had the Royal Stables attacked on the morning of the 24th. Armed workers joined the sailors and the government troops withdrew with 56 dead. The USPD left the government in protest on 29 December, and Noske, who took one of its places, began building up Freikorps units against internal enemies.',
                sources: [S.xmas, S.gr, S.freikorps],
            },
            {
                ko: '12월 30일부터 스파르타쿠스단과 좌파 사회주의자들이 모여 독일 공산당(KPD)을 창당했다. 창당 강령이 된 로자 룩셈부르크의 「스파르타쿠스단은 무엇을 원하는가」는 「독일 전체 프롤레타리아 대중의 대다수가 분명하고 명확하게 원하지 않는 한」 결코 권력을 잡지 않겠다고 밝혔다. 룩셈부르크는 국민의회 선거 참여를 제안했지만, 대회는 62 대 23으로 선거 거부를 결의했다. 혁명적 직장위원들은 새 당에 합류하지 않고 USPD에 남았다.',
                en: 'From 30 December the Spartacus League and other left socialists met to found the Communist Party of Germany (KPD). Rosa Luxemburg’s “What Does the Spartacus League Want?”, adopted as its programme, promised never to take power “except in response to the clear, unambiguous will of the great majority of the proletarian mass of all of Germany”. Luxemburg proposed taking part in the National Assembly elections, but the congress voted 62 to 23 to boycott them. The Revolutionary Stewards stayed in the USPD rather than join the new party.',
                sources: [S.kpd, S.luxWant, S.luxProgram, S.gr],
            },
        ],
    },
    {
        heading: { ko: '1월 봉기와 룩셈부르크·리프크네히트 살해', en: 'The January rising and the murders of Luxemburg and Liebknecht' },
        paragraphs: [
            {
                ko: '1919년 1월 4일 프로이센 정부가 USPD 소속 베를린 경찰청장 에밀 아이히호른을 해임하자, 이튿날 수십만 명이 거리로 나왔고 일부는 기차역과 SPD 기관지 『포어베르츠』 사옥 등 신문사 구역을 점거했다. 53명의 임시혁명위원회는 정부 타도를 선언했지만 방향을 제시하지 못했다. 리프크네히트는 무장 봉기를 지지했고, 룩셈부르크와 요기헤스, 라데크는 시기상조라고 보았다. 인민해군사단조차 중립을 선언했다.',
                en: 'When the Prussian government dismissed the USPD Berlin police chief Emil Eichhorn on 4 January 1919, hundreds of thousands poured into the streets the next day, and some occupied railway stations and the newspaper district, including the SPD’s Vorwärts. A 53-member Revolutionary Committee declared the government deposed but gave no direction. Liebknecht backed an armed rising; Luxemburg, Jogiches and Radek thought it premature. Even the People’s Navy Division declared itself neutral.',
                sources: [S.gr, S.spartacist],
            },
            {
                ko: '1월 8일 정부는 「폭력에는 폭력으로 맞설 수밖에 없다」고 선언했다. 11일 자유군단이 중화기로 『포어베르츠』 건물을 탈환했고, 항복 협상을 하러 나온 여섯 명을 즉결 처형했다. 12일까지 봉기는 끝났고 사망자는 156명으로 추산된다. 룩셈부르크는 14일 「베를린에 질서가 섰다」에서 「너희의 질서는 모래 위에 세워졌다」고 썼고, 리프크네히트의 마지막 글은 「그럼에도 불구하고!」였다.',
                en: 'On 8 January the government declared that “force can be fought only with force.” On the 11th Freikorps troops retook the Vorwärts building with heavy weapons and summarily shot six men who came out to negotiate a surrender. By the 12th the rising was over, with an estimated 156 dead. On the 14th Luxemburg wrote in “Order prevails in Berlin” that “your order is built on sand”; Liebknecht’s last article was “In spite of everything!”',
                sources: [S.gr, S.luxOrder, S.liebInspite],
            },
            {
                ko: '1월 15일 저녁 두 사람은 빌머스도르프의 은신처에서 붙잡혀 근위기병소총사단에 넘겨졌다. 참모 장교 발데마르 파프스트의 명령으로 둘은 개머리판으로 구타당한 뒤 머리에 총을 맞았고, 룩셈부르크의 시신은 란트베어 운하에 버려져 7월 1일에야 발견되었다. 가해자들은 대부분 처벌받지 않았다. 파프스트는 1962년 노스케와 에베르트가 자신의 행동을 승인했다고 주장했으나 확인된 적은 없다.',
                en: 'On the evening of 15 January the two were caught in a flat in Wilmersdorf and handed to the Guards Cavalry Rifle Division. On the orders of its staff officer, Waldemar Pabst, both were clubbed with rifle butts and shot in the head; Luxemburg’s body was thrown into the Landwehr Canal and found only on 1 July. The killers went largely unpunished. Pabst claimed in 1962 that Noske and Ebert had approved his action, a claim never confirmed.',
                sources: [S.gr, S.pabst, S.luxemburg],
            },
        ],
    },
    {
        heading: { ko: '3월 투쟁과 평의회 공화국들', en: 'The March battles and the council republics' },
        paragraphs: [
            {
                ko: '11월에 기대한 사회화와 평의회 인정이 이루어지지 않자 1919년 1~3월 상부 슐레지엔, 루르, 작센과 튀링겐에서 총파업이 이어졌다. 베를린에서는 3월 4일 USPD와 KPD가 부른 총파업이 시가전으로 번졌고, 9일 노스케는 무기를 든 자를 발견 즉시 사살하라고 명령했다. 16일까지 최소 1,200명이 죽었다. 요기헤스는 3월 10일 감옥에서 살해되었다. 1월 10일 선포된 브레멘 평의회 공화국은 2월 4일 정부군과 자유군단에 진압되었다.',
                en: 'With the socialisation and recognition of councils hoped for in November not forthcoming, general strikes followed from January to March 1919 in Upper Silesia, the Ruhr, Saxony and Thuringia. In Berlin a general strike called by the USPD and KPD on 4 March turned into street fighting, and on the 9th Noske ordered anyone found carrying a weapon shot on sight. At least 1,200 had died by the 16th. Jogiches was murdered in prison on 10 March. The Bremen Soviet Republic, declared on 10 January, was crushed by army and Freikorps troops on 4 February.',
                sources: [S.march, S.gr, S.jogiches, S.bremen],
            },
            {
                ko: '바이에른에서는 1월 선거에서 참패한 아이스너가 사임하러 의회로 가던 2월 21일 극우 청년 장교 아르코발라이 백작에게 암살되었다. 4월 6~7일 밤 헝가리 평의회 공화국 소식에 고무된 독립사회민주당원과 아나키스트들이 에른스트 톨러를 앞세워 바이에른 평의회 공화국을 선포했고, 호프만 정부는 밤베르크로 피했다. KPD 의장 파울 레비는 이를 「혁명적 모험주의」라 비판했지만, 13일 KPD가 권력을 잡아 오이겐 레비네가 이끌었다.',
                en: 'In Bavaria Eisner, heavily defeated in the January election, was assassinated on 21 February by the far-right young officer Count Arco-Valley as he went to parliament to resign. On the night of 6–7 April USPD members and anarchists, encouraged by the Hungarian Soviet Republic, proclaimed a Bavarian Soviet Republic headed by Ernst Toller, and the Hoffmann government fled to Bamberg. The KPD chairman Paul Levi denounced it as “revolutionary adventurism”, but on the 13th the KPD took over under Eugen Leviné.',
                sources: [S.eisner, S.bavaria, S.gr],
            },
            {
                ko: '레비네 정부는 붉은 군대를 조직하고 공장을 노동자 관리에 넘겼지만, 식량 부족이 심해졌다. 4월 말 붉은 군대 측이 인질들을 처형했고, 5월 1~3일 국방군과 자유군단이 뮌헨을 점령했다. 이 진압에서 약 600명이 죽었다. 레비네는 군사 법정에서 「우리 공산주의자는 모두 휴가 중인 죽은 사람들이다」라고 말했고, 6월 5일 슈타델하임 감옥에서 총살되었다.',
                en: 'Leviné’s government raised a Red Army and put factories under workers’ control, but food shortages worsened. At the end of April Red forces executed hostages, and from 1 to 3 May the Reichswehr and Freikorps took Munich; about 600 died in the suppression. Leviné told the court martial that “we communists are all dead men on leave” and was shot in Stadelheim prison on 5 June.',
                sources: [S.bavaria, S.levine, S.gr],
            },
        ],
    },
    {
        heading: { ko: '바이마르 국민의회와 헌법', en: 'The Weimar National Assembly and constitution' },
        paragraphs: [
            {
                ko: '1919년 1월 19일 여성이 처음으로 투표한 국민의회 선거에서 SPD가 약 38%로 제1당이 되어 가톨릭 중앙당, 독일민주당과 「바이마르 연정」을 꾸렸다. USPD는 7.6%에 그쳤고 KPD는 참여하지 않았다. 혼란한 베를린을 피해 2월 6일 바이마르에서 개원한 의회는 11일 에베르트를 임시 대통령으로, 13일 샤이데만을 총리로 뽑았다.',
                en: 'In the National Assembly election of 19 January 1919, the first in which women voted, the SPD came first with about 38 per cent and formed the “Weimar coalition” with the Catholic Centre and the German Democratic Party. The USPD won only 7.6 per cent and the KPD stayed out. Meeting in Weimar from 6 February to escape the turmoil of Berlin, the Assembly elected Ebert provisional president on the 11th and Scheidemann head of government on the 13th.',
                sources: [S.election, S.assembly, S.gr],
            },
            {
                ko: '샤이데만은 베르사유 조약 조건을 받아들일 수 없다며 사임했지만, 의회는 연합국의 압박 속에 6월 조약 수락을 결의했고 6월 28일 조약이 서명되었다. 7월 31일 의회는 새 헌법을 262 대 75로 채택했고, 에베르트가 8월 11일 서명해 14일 발효되었다. 헌법은 기본권 목록과 의회 책임 내각을 두었지만, 대통령에게 비상사태를 선포하고 긴급명령을 내릴 수 있는 제48조의 권한을 주었다.',
                en: 'Scheidemann resigned rather than accept the terms of the Treaty of Versailles, but under Allied pressure the Assembly voted in June to accept, and the treaty was signed on 28 June. On 31 July the Assembly adopted the new constitution by 262 votes to 75; Ebert signed it on 11 August and it took effect on the 14th. It set out a catalogue of basic rights and a cabinet responsible to parliament, but gave the president, under Article 48, power to declare an emergency and rule by decree.',
                sources: [S.scheidemann, S.versailles, S.constitution],
            },
        ],
    },
    {
        heading: { ko: '혁명의 결과와 해석', en: 'Outcome and interpretations' },
        paragraphs: [
            {
                ko: '혁명은 제정을 무너뜨리고 여성 참정권, 8시간 노동제, 의회 민주주의를 남겼지만, 군과 관료, 사법부, 대기업은 거의 그대로 살아남았다. 공화국을 지키려 불러낸 자유군단은 1920년 카프 폭동으로 공화국 자체를 겨누었고, 그 대원들 상당수는 뒤에 나치 운동으로 흘러갔다. 룩셈부르크·리프크네히트 살해와 노스케의 진압은 SPD와 공산주의자 사이에 메울 수 없는 골을 남겼다.',
                en: 'The revolution toppled the monarchy and left women’s suffrage, the eight-hour day and parliamentary democracy, but the army, civil service, judiciary and big business survived almost intact. The Freikorps called in to defend the republic turned on it in the Kapp Putsch of 1920, and many of their men later drifted into the Nazi movement. The murders of Luxemburg and Liebknecht and Noske’s repression left an unbridgeable gulf between the SPD and the communists.',
                sources: [S.gr, S.kapp, S.freikorps],
            },
            {
                ko: '해석은 오래 갈렸다. 서독의 다수 역사가는 당시 선택지가 의회 민주주의와 볼셰비키식 독재뿐이었다고 보고 에베르트의 선택을 옹호했지만, 1960년대 이후 연구는 평의회 운동의 온건한 다수와 민주적 개혁의 여지를 재평가했다. 직장위원 지도자 리하르트 뮐러는 1920년대에 세 권짜리 혁명사를 썼고, 피에르 브루에는 1971년 『독일 혁명 1917~1923』에서 이를 유럽 혁명의 좌절이라는 시각으로 다시 서술했다.',
                en: 'Interpretations long diverged. Many West German historians held that the only choice was between parliamentary democracy and Bolshevik dictatorship and defended Ebert, but research from the 1960s re-examined the moderate majority of the council movement and the room for democratic reform. The shop stewards’ leader Richard Müller wrote a three-volume history of the revolution in the 1920s, and Pierre Broué retold it in The German Revolution 1917–1923 (1971) as the defeat of a European revolution.',
                sources: [S.gr, S.muller, S.broue],
            },
        ],
    },
];

const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timeline = [
    ['1918.10.03', '막스 폰 바덴 내각', 'Prince Max of Baden’s cabinet', '자유주의 성향의 재상이 SPD를 입각시키고 휴전을 요청했다.', 'The liberal-minded chancellor brought in the SPD and asked for an armistice.', ['germany']],
    ['1918.10.29', '빌헬름스하펜 수병 항명', 'Wilhelmshaven mutiny', '마지막 출격 명령에 수병들이 출항을 거부했다.', 'Sailors refused to sail on a last sortie.', ['germany'], P(53.53, 8.11, '빌헬름스하펜', 'Wilhelmshaven')],
    ['1918.11.03', '킬의 발포와 봉기', 'Shooting and rising in Kiel', '수병 행진에 발포해 최소 9명이 죽었고, 이튿날 평의회가 도시를 장악했다.', 'Troops fired on a sailors’ march, killing at least nine; the next day a council took the city.', ['germany'], P(54.32, 10.14, '킬', 'Kiel')],
    ['1918.11.08', '바이에른 인민국 선포', 'People’s State of Bavaria', '쿠르트 아이스너가 뮌헨에서 왕정 폐지를 선포했다.', 'Kurt Eisner proclaimed the end of the monarchy in Munich.', ['germany'], P(48.137, 11.575, '뮌헨', 'Munich')],
    ['1918.11.09', '공화국 선포', 'Republic proclaimed', '샤이데만이 제국의회에서, 리프크네히트가 왕궁에서 각각 공화국을 선포했다.', 'Scheidemann proclaimed a republic at the Reichstag, Liebknecht a socialist republic at the palace.', ['germany'], P(52.5186, 13.3762, '베를린 제국의회', 'Reichstag, Berlin')],
    ['1918.11.10', '인민대표평의회와 에베르트–그뢰너 협약', 'People’s Deputies and the Ebert–Groener pact', 'SPD·USPD 동수 정부가 서고, 에베르트가 최고사령부와 비밀 합의를 맺었다.', 'An SPD–USPD government was formed and Ebert struck a secret deal with the Army Command.', ['germany']],
    ['1918.11.11', '콩피에뉴 휴전', 'Armistice at Compiègne', '에르츠베르거가 휴전 협정에 서명해 전쟁이 끝났다.', 'Erzberger signed the armistice and the war ended.', ['france', 'germany'], P(49.43, 2.83, '콩피에뉴', 'Compiègne')],
    ['1918.11.15', '슈티네스–레기엔 협정', 'Stinnes–Legien Agreement', '노조 인정과 8시간 노동제를 맞바꾼 노사 협정이 맺어졌다.', 'Unions and employers traded recognition for the eight-hour day.', ['germany']],
    ['1918.12.16', '전국 평의회 대회', 'Reich Congress of Councils', '평의회 전권안을 부결하고 국민의회 선거를 결정했다.', 'The congress rejected all power to the councils and called National Assembly elections.', ['germany']],
    ['1918.12.24', '크리스마스 위기', 'Christmas crisis', '정부군의 인민해군사단 공격이 실패하고 USPD가 정부를 떠났다.', 'The government’s attack on the People’s Navy Division failed and the USPD left the government.', ['germany']],
    ['1918.12.30', '독일 공산당 창당', 'Founding of the KPD', '스파르타쿠스단이 좌파 그룹들과 공산당을 세웠다.', 'The Spartacus League and other left groups founded the Communist Party.', ['germany']],
    ['1919.01.05', '1월 봉기', 'January rising', '아이히호른 해임에 항의한 시위가 신문사 구역 점거로 번졌다.', 'Protests at Eichhorn’s dismissal grew into the occupation of the newspaper district.', ['germany']],
    ['1919.01.15', '룩셈부르크·리프크네히트 살해', 'Luxemburg and Liebknecht murdered', '자유군단 장교들이 두 지도자를 붙잡아 살해했다.', 'Freikorps officers seized and killed the two leaders.', ['germany']],
    ['1919.01.19', '국민의회 선거', 'National Assembly election', '여성이 처음으로 투표했고 SPD가 제1당이 되었다.', 'Women voted for the first time; the SPD came first.', ['germany']],
    ['1919.02.04', '브레멘 평의회 공화국 진압', 'Bremen Soviet Republic crushed', '정부군과 자유군단이 도시를 점령했다.', 'Army and Freikorps troops occupied the city.', ['germany'], P(53.08, 8.8, '브레멘', 'Bremen')],
    ['1919.02.06', '바이마르 국민의회 개원', 'National Assembly opens in Weimar', '의회는 11일 에베르트를 임시 대통령으로 뽑았다.', 'On the 11th it elected Ebert provisional president.', ['germany'], P(50.98, 11.33, '바이마르', 'Weimar')],
    ['1919.02.21', '아이스너 암살', 'Eisner assassinated', '바이에른 총리가 극우 장교의 총에 맞았다.', 'The Bavarian premier was shot by a far-right officer.', ['germany']],
    ['1919.03.09', '베를린 3월 투쟁', 'Berlin March battles', '노스케가 무장자 즉결 사살을 명령했고 최소 1,200명이 죽었다.', 'Noske ordered armed men shot on sight; at least 1,200 died.', ['germany']],
    ['1919.04.07', '바이에른 평의회 공화국', 'Bavarian Soviet Republic', '톨러를 앞세운 평의회 공화국이 선포되고, 13일 레비네의 KPD가 권력을 잡았다.', 'A council republic under Toller was proclaimed; on the 13th Leviné’s KPD took over.', ['germany']],
    ['1919.05.03', '뮌헨 점령', 'Munich taken', '국방군과 자유군단의 진압으로 약 600명이 죽었다.', 'About 600 died as the Reichswehr and Freikorps retook the city.', ['germany']],
    ['1919.06.28', '베르사유 조약 서명', 'Treaty of Versailles signed', '국민의회가 연합국의 압박 속에 조약을 수락했다.', 'The Assembly accepted the treaty under Allied pressure.', ['germany', 'france'], P(48.8049, 2.1204, '베르사유', 'Versailles')],
    ['1919.08.11', '바이마르 헌법', 'Weimar Constitution', '에베르트가 서명한 헌법이 14일 발효되었다.', 'Signed by Ebert, the constitution took effect on the 14th.', ['germany']],
].map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben }, country, ...(geo ? { geo } : {}),
}));

const people = [
    ['friedrich-ebert', 'leader', 'SPD 대표 · 인민대표평의회 공동의장', 'SPD leader, co-chair of the People’s Deputies', '혁명정부를 이끌며 최고사령부와 손잡고 평의회 운동을 의회 민주주의로 돌렸다.', 'Led the revolutionary government, allied with the Army Command and steered the councils into parliamentary democracy.'],
    ['philipp-scheidemann', 'leader', '공화국 선포 · 초대 총리', 'Proclaimed the republic, first head of government', '11월 9일 제국의회 창문에서 공화국을 선포했고 베르사유 조약에 반대해 사임했다.', 'Proclaimed the republic from the Reichstag on 9 November and resigned over Versailles.'],
    ['hugo-haase', 'leader', 'USPD 의장 · 인민대표평의회 공동의장', 'USPD chairman, co-chair of the People’s Deputies', '에베르트와 공동의장을 맡았으나 크리스마스 위기 뒤 정부를 떠났다.', 'Co-chaired with Ebert but left the government after the Christmas crisis.'],
    ['richard-muller', 'leader', '혁명적 직장위원 · 베를린 집행평의회 의장', 'Revolutionary Stewards, chair of the Berlin Executive Council', '11월 9일 제국의회를 점거한 직장위원을 이끌었고 평의회 정권의 형식상 수반이었다.', 'Led the stewards who occupied the Reichstag and was formal head of the council regime.'],
    ['luxemburg', 'leader', '스파르타쿠스단 · 독일 공산당 창당', 'Spartacus League, founder of the KPD', '공산당 강령을 쓰고 1월 봉기를 시기상조로 보았으나 봉기 뒤 살해되었다.', 'Wrote the KPD programme, thought the January rising premature and was murdered after it.'],
    ['liebknecht', 'leader', '사회주의 공화국 선포 · 1월 봉기', 'Proclaimed the socialist republic, January rising', '11월 9일 왕궁에서 사회주의 공화국을 선포했고 1월 봉기를 지지하다 살해되었다.', 'Proclaimed a socialist republic on 9 November, backed the January rising and was murdered.'],
    ['kurt-eisner', 'leader', '바이에른 인민국 총리', 'Premier of the People’s State of Bavaria', '11월 8일 뮌헨에서 왕정 폐지를 선포했고 1919년 2월 암살되었다.', 'Proclaimed the end of the Bavarian monarchy on 8 November and was assassinated in February 1919.'],
    ['eugen-levine', 'leader', '바이에른 평의회 공화국 지도자', 'Leader of the Bavarian Soviet Republic', 'KPD가 권력을 잡은 평의회 공화국을 이끌었고 진압 뒤 총살되었다.', 'Led the KPD phase of the council republic and was shot after its fall.'],
    ['gustav-noske', 'executor', '인민대표 · 국방 담당', 'People’s Deputy for military affairs', '자유군단을 키워 1월 봉기와 3월 투쟁을 진압했다.', 'Built up the Freikorps and crushed the January rising and the March battles.'],
    ['wilhelm-groener', 'executor', '최고사령부 제1병참감', 'First Quartermaster General', '에베르트와 비밀 협약을 맺어 장교단의 지휘 체계를 지켰다.', 'Struck the secret pact with Ebert that kept the officer corps intact.'],
    ['waldemar-pabst', 'executor', '근위기병소총사단 참모 장교', 'Staff officer, Guards Cavalry Rifle Division', '룩셈부르크와 리프크네히트의 살해를 명령했다.', 'Ordered the killing of Luxemburg and Liebknecht.'],
    ['max-von-baden', 'participant', '마지막 제국 재상', 'Last imperial chancellor', '황제의 퇴위를 발표하고 재상직을 에베르트에게 넘겼다.', 'Announced the emperor’s abdication and handed the chancellorship to Ebert.'],
    ['paul-von-hindenburg', 'participant', '최고사령부 참모총장', 'Chief of the General Staff', '그뢰너와 함께 최고사령부를 이끌며 새 정부와 협력했다.', 'Headed the Army Command with Groener in co-operation with the new government.'],
    ['leo-jogiches', 'participant', '독일 공산당 조직가', 'KPD organiser', '1월 봉기를 시기상조로 보았고 1919년 3월 감옥에서 살해되었다.', 'Thought the January rising premature and was murdered in prison in March 1919.'],
    ['radek', 'participant', '공산당 창당 대회의 볼셰비키 사절', 'Bolshevik envoy at the KPD founding congress', '창당 대회에 참석하고 1월 봉기에 반대했으며 1919년 2월 체포되었다.', 'Attended the founding congress, opposed the January rising and was arrested in February 1919.'],
    ['wilhelm-pieck', 'participant', '독일 공산당 지도부', 'KPD leadership', '1월 봉기를 호소했고 룩셈부르크·리프크네히트와 함께 체포되었으나 살아남았다.', 'Called for the January demonstration and was arrested with Luxemburg and Liebknecht but survived.'],
    ['paul-levi', 'participant', '독일 공산당 의장', 'KPD chairman', '룩셈부르크 사후 당을 이끌며 바이에른 평의회 공화국을 모험주의로 비판했다.', 'Led the party after Luxemburg and denounced the Bavarian council republic as adventurism.'],
    ['franz-mehring', 'participant', '스파르타쿠스단 창립자', 'Founder of the Spartacus League', '공산당 창당을 함께했고 1919년 1월 말 숨졌다.', 'Joined in founding the KPD and died at the end of January 1919.'],
    ['zetkin', 'participant', 'USPD · 뒤에 독일 공산당', 'USPD, later KPD', '스파르타쿠스단과 함께했고 1919년 공산당에 합류했다.', 'Stood with the Spartacists and joined the KPD in 1919.'],
    ['karl-kautsky', 'participant', '사회화위원회 위원', 'Member of the Socialisation Commission', 'USPD 이론가로 사회화위원회에 참여했으나 성과를 내지 못했다.', 'USPD theorist on the Socialisation Commission, which produced no result.'],
    ['pierre-broue', 'historian', '『독일 혁명 1917~1923』', 'The German Revolution 1917–1923', '혁명을 유럽 혁명의 좌절이라는 시각으로 서술했다.', 'Told the revolution as the defeat of a European revolution.'],
].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en,
}));

const sources = [];
for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
const body = lang => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

const event = {
    id: 'german-revolution-1918-1919',
    expected: null,
    fields: {
        title_ko: '독일 11월 혁명',
        title_en: 'The German Revolution of 1918–1919',
        period_label: '1918.10–1919.08',
        sort_order: 37,
        question_ko: '제정을 무너뜨린 노동자·병사 평의회는 왜 사회주의 공화국이 아니라 바이마르 공화국으로 귀결되었는가?',
        question_en: 'Why did the workers’ and soldiers’ councils that toppled the monarchy end in the Weimar Republic rather than a socialist republic?',
        summary_ko: '1918년 11월 킬 수병 봉기가 전국의 노동자·병사 평의회로 번져 제정이 무너지고 공화국이 선포되었다. SPD의 에베르트는 최고사령부와 손잡고 평의회를 국민의회 선거로 이끌었고, 1919년 1월 봉기와 3월 투쟁, 바이에른 평의회 공화국은 자유군단에게 진압되었다. 그 과정에서 로자 룩셈부르크와 카를 리프크네히트가 살해되었고, 8월 바이마르 헌법이 발효되었다.',
        summary_en: 'In November 1918 the Kiel mutiny spread into workers’ and soldiers’ councils across Germany, the monarchy fell and a republic was proclaimed. The SPD’s Ebert allied with the Army Command and steered the councils towards a National Assembly; the January rising, the March battles and the Bavarian Soviet Republic of 1919 were crushed by the Freikorps. Rosa Luxemburg and Karl Liebknecht were murdered along the way, and the Weimar Constitution took effect in August.',
        outcome_ko: '제정이 끝나고 여성 참정권과 8시간 노동제, 의회 민주주의를 갖춘 바이마르 공화국이 섰다. 그러나 군·관료·사법부는 그대로 남았고, 자유군단은 뒤에 공화국을 겨누었다. 사회민주당과 공산당의 분열은 되돌릴 수 없게 되었다.',
        outcome_en: 'The monarchy ended and the Weimar Republic arose with women’s suffrage, the eight-hour day and parliamentary democracy. But the army, civil service and judiciary survived, the Freikorps later turned on the republic, and the split between Social Democrats and Communists became irreparable.',
        body_ko: body('ko'),
        body_en: body('en'),
        timeline,
        sources,
        locations: [
            { label: { ko: '베를린', en: 'Berlin' }, lat: 52.52, lng: 13.405, kind: 'main' },
            { label: { ko: '킬', en: 'Kiel' }, lat: 54.32, lng: 10.14, kind: 'place' },
            { label: { ko: '뮌헨', en: 'Munich' }, lat: 48.137, lng: 11.575, kind: 'place' },
            { label: { ko: '바이마르', en: 'Weimar' }, lat: 50.98, lng: 11.33, kind: 'place' },
            { label: { ko: '브레멘', en: 'Bremen' }, lat: 53.08, lng: 8.8, kind: 'place' },
        ],
        countries: ['germany', 'france'],
        relations: { related: ['world-war-i', 'october-revolution', 'paris-commune-1871'] },
        no_auto_link: [],
        link_expressions: [],
        focus: null,
    },
    sections,
    people,
};

fs.writeFileSync(path.join(__dirname, '..', 'german-revolution-20260929.json'),
    JSON.stringify({ id: 'german-revolution-20260929', events: [event] }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'german-revolution-20260929-people.json'),
    JSON.stringify({ changedBy: 'german-revolution-20260929', people: require('./people') }, null, 2) + '\n');
console.log(`event ${event.id}: ${sections.length} sections, ${sources.length} sources, ${timeline.length} timeline, ${people.length} relations`);
