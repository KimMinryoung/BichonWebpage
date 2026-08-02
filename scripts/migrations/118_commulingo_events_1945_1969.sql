-- Four postwar events, chosen by which cards had nothing to link to.
--
-- On 2026-08-02 the dictionary held 1,236 people and 25 events, and 488 people
-- were complete in every other field with no event link at all. The enrich
-- lane's EVENTS step promotes exactly those cards to the front of its queue,
-- so the step it promoted them for was the step that could not fire: the 25
-- events were all political peaks, and the unlinked were administrators of
-- industry, science, defence and foreign affairs. By office the gap was
-- defence 65, heavy military industry 44, science/nuclear/space 41, state
-- security 34, party cadres 34; by era, thaw 170 and stalin-era 112.
--
-- These four cover the largest of those clusters:
--   soviet-atomic-project     science/nuclear/space, heavy industry, security
--   korean-war                defence, foreign affairs, international revolutionaries
--   twentieth-party-congress  the whole thaw generation, party cadres, ideology
--   sino-soviet-split         international revolutionaries, foreign affairs
--
-- The Twentieth Congress (1956.02) has to sit between the fall of Beria (86)
-- and the Hungarian Revolution (1956.10), where no integer was free, so two
-- existing rows shift up by one. Idempotent.
--
-- Korean naming follows the site rule: 조선민주주의인민공화국 on first
-- reference, then 조선. Never 북한.

UPDATE commulingo_history_events SET sort_order = 89, updated_at = NOW()
 WHERE id = 'anti-party-group' AND sort_order <> 89;
UPDATE commulingo_history_events SET sort_order = 88, updated_at = NOW()
 WHERE id = 'hungarian-revolution' AND sort_order <> 88;

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES

    ('soviet-atomic-project', 83, '1943–1949',
     '소련 원자폭탄 개발', 'The Soviet Atomic Project',
     '전쟁으로 폐허가 된 나라가 어떻게 4년 만에 핵을 손에 넣었는가?',
     'How did a country in ruins from the war hold a nuclear weapon within four years?',
     '소련의 원자폭탄 개발은 1943년 쿠르차토프를 책임자로 한 제2연구소에서 시작해 1949년 8월 29일 세미팔라틴스크의 RDS-1 실험으로 결실을 맺은 사업이다. 전쟁 중에는 자원이 전선에 묶여 소규모 연구에 그쳤으나, 1945년 8월 히로시마와 나가사키 이후 국가의 최우선 과제가 되어 베리야를 수반으로 하는 특별위원회가 설치되고 내무인민위원부의 조직·노동력·자원 동원 능력이 통째로 투입됐다. 사업은 두 축으로 굴러갔다. 클라우스 푹스를 비롯한 정보원이 넘긴 맨해튼 계획 설계 자료가 방향을 확인해 주었고, 쿠르차토프·하리톤·젤도비치·플료로프의 자체 연구가 그것을 소련의 산업 조건에서 실제로 만들 수 있는 물건으로 옮겼다. 우라늄 채굴과 폐쇄도시 건설에는 굴라크 수용자와 강제 노동이 대규모로 동원됐다.',
     'The Soviet atomic project ran from the founding of Laboratory No. 2 under Kurchatov in 1943 to the RDS-1 test at Semipalatinsk on 29 August 1949. During the war, with resources tied to the front, it stayed small. After Hiroshima and Nagasaki in August 1945 it became the state''s first priority: a Special Committee under Beria was created and the whole organizational, labour and material capacity of the NKVD was thrown behind it. The work ran on two tracks. Intelligence from Klaus Fuchs and others delivered Manhattan Project design material that confirmed the direction, while the domestic research of Kurchatov, Khariton, Zeldovich and Flyorov turned it into something buildable under Soviet industrial conditions. Uranium mining and the construction of the closed cities drew heavily on Gulag prisoners and forced labour.',
     '미국의 핵독점은 4년 만에 끝났고, 냉전은 두 초강대국이 서로를 절멸시킬 수 있는 국면으로 넘어갔다. 안으로는 물리학자들이 이례적인 지위와 자원을 얻어, 리센코주의가 생물학을 장악하던 시기에도 물리학은 이념적 개입을 상당 부분 막아냈다. 사업이 남긴 폐쇄도시와 원자력 산업은 이후 소련 과학기술의 축이 됐고, 마야크를 비롯한 시설의 방사능 오염과 노동자·주민 피폭은 오래 은폐된 대가였다. 1953년 수소폭탄 RDS-6s를 이끈 사하로프는 1960년대부터 핵실험과 체제 자체를 비판하는 자리로 옮겨 갔다.',
     'The American nuclear monopoly ended after four years, and the Cold War moved into the phase in which two superpowers could annihilate each other. At home physicists won unusual standing and resources: while Lysenkoism held biology, physics largely fended off ideological interference. The closed cities and the atomic industry the project left behind became a spine of later Soviet science and technology, and the radioactive contamination at Mayak and other sites, with the doses taken by workers and nearby residents, was the long concealed cost. Sakharov, who led the RDS-6s hydrogen bomb of 1953, moved from the 1960s to criticizing nuclear testing and eventually the system itself.',
     $$[
       {"date":"1940–1942","title":{"ko":"플료로프의 편지","en":"Flyorov''s letter"},"body":{"ko":"자발핵분열을 발견한 젊은 물리학자 플료로프는 서방 학술지에서 핵분열 논문이 사라진 것을 알아채고, 이것이 비밀 사업의 증거라며 스탈린에게 편지를 보냈다.","en":"Flyorov, the young physicist who had found spontaneous fission, noticed that fission papers had disappeared from Western journals, and wrote to Stalin that the silence was evidence of a secret programme."}},
       {"date":"1943.02","title":{"ko":"제2연구소","en":"Laboratory No. 2"},"body":{"ko":"쿠르차토프를 책임자로 한 제2연구소가 모스크바에 설치됐다. 전선이 우선이던 시기라 인원과 예산은 작았다.","en":"Laboratory No. 2 was established in Moscow under Kurchatov. With the front taking priority, its staff and budget were small."}},
       {"date":"1945.08","title":{"ko":"히로시마 이후","en":"After Hiroshima"},"body":{"ko":"히로시마와 나가사키 직후 사업은 국가 최우선 과제가 됐다. 베리야를 수반으로 한 특별위원회가 설치되고 반니코프가 실무를 총괄했다.","en":"Immediately after Hiroshima and Nagasaki the project became the state''s first priority. A Special Committee was formed under Beria, with Vannikov running the executive side."}},
       {"date":"1946.12.25","title":{"ko":"F-1 원자로 임계","en":"The F-1 reactor goes critical"},"body":{"ko":"쿠르차토프가 이끈 유럽 최초의 원자로 F-1이 임계에 도달해, 플루토늄 생산으로 가는 길이 열렸다.","en":"F-1, the first reactor in Europe, went critical under Kurchatov, opening the path to plutonium production."}},
       {"date":"1946–1948","title":{"ko":"폐쇄도시와 마야크","en":"The closed cities and Mayak"},"body":{"ko":"사로프(아르자마스-16)에 하리톤과 젤도비치의 설계국이, 첼랴빈스크에 마야크 플루토늄 공장이 세워졌다. 건설과 우라늄 채굴에 수용자 노동이 대규모로 쓰였다.","en":"The design bureau of Khariton and Zeldovich was set up at Sarov (Arzamas-16) and the Mayak plutonium works near Chelyabinsk. Prisoner labour was used on a large scale for construction and uranium mining."}},
       {"date":"1949.08.29","title":{"ko":"RDS-1","en":"RDS-1"},"body":{"ko":"세미팔라틴스크에서 첫 원자폭탄 RDS-1이 폭발했다. 미국이 이를 탐지해 9월 공표하면서 핵독점은 끝났다.","en":"The first Soviet atomic bomb, RDS-1, was detonated at Semipalatinsk. American detection and the September announcement ended the monopoly."}},
       {"date":"1953.08.12","title":{"ko":"RDS-6s","en":"RDS-6s"},"body":{"ko":"사하로프의 층상 설계에 기반한 RDS-6s가 실험됐다. 항공기로 투하 가능한 형태였다는 점에서 미국의 1952년 실험 장치와 성격이 달랐다.","en":"RDS-6s, based on Sakharov''s layer-cake design, was tested. Unlike the American device of 1952 it was in a form that could be dropped from an aircraft."}}
     ]$$,
     $$["David Holloway, Stalin and the Bomb (Yale University Press, 1994)", "Encyclopaedia Britannica: Igor Kurchatov", "Atomic Heritage Foundation: Soviet Atomic Program"]$$,
     NOW()),

    ('korean-war', 85, '1950–1953',
     '한국전쟁', 'The Korean War',
     '스탈린은 왜 승인했고, 왜 소련군을 보내지는 않았는가?',
     'Why did Stalin approve it, and why did he not send Soviet troops?',
     '한국전쟁은 1950년 6월 25일 조선민주주의인민공화국의 남진으로 시작해 1953년 7월 27일 정전협정으로 멎은 전쟁이다. 김일성은 1949년부터 여러 차례 무력 통일 승인을 요청했고, 스탈린은 미국이 개입하지 않으리라는 판단과 중화인민공화국 수립·소련의 핵실험 성공으로 힘의 균형이 바뀌었다는 계산 위에서 1950년 봄 이를 승인하되 소련군의 직접 참전은 배제했다. 미국이 유엔군을 조직해 개입하고 인천상륙으로 전세가 뒤집히자 중국이 인민지원군을 보냈고, 전선은 1951년 여름부터 38도선 부근에서 굳었다. 소련의 참여는 무기·고문단과, 만주 기지에서 미그-15로 싸운 조종사들에 한정됐으며 이들의 존재는 양측 모두 오래 공식적으로 부인했다.',
     'The Korean War began with the southward attack of the Democratic People''s Republic of Korea on 25 June 1950 and stopped with the armistice of 27 July 1953. Kim Il-sung had asked repeatedly from 1949 for approval to unify by force. Stalin gave it in the spring of 1950, judging that the United States would not intervene and reckoning that the founding of the People''s Republic of China and the Soviet atomic test had shifted the balance, but he ruled out direct Soviet participation. When the United States intervened under a UN command and the Inchon landing reversed the front, China sent the People''s Volunteer Army, and from the summer of 1951 the line hardened near the 38th parallel. Soviet involvement stayed limited to weapons, advisers, and the pilots who flew MiG-15s from Manchurian bases, a presence both sides long denied officially.',
     '전쟁은 통일을 이루지 못한 채 분단을 고착시켰고, 한반도 양쪽과 중국에 막대한 인명 손실을 남겼다. 소련에게는 직접 충돌 없이 미국의 자원을 묶어 두는 결과를 냈지만, 서방의 재무장을 앞당기고 나토를 군사기구로 굳혔다는 점에서 대가도 컸다. 중국은 미국과 맞서 싸운 경험으로 사회주의 진영 안의 위상을 크게 높였고, 이는 뒤에 중소분열의 배경 가운데 하나가 됐다. 스탈린이 죽은 1953년 3월 이후 정전 교섭이 빠르게 진전됐다는 사실은, 전쟁의 지속에 모스크바의 판단이 얼마나 결정적이었는지를 보여 준다.',
     'The war ended without unification and fixed the division in place, at an enormous cost in lives on both sides of the peninsula and in China. For the Soviet Union it tied down American resources without a direct clash, but the price was high: it accelerated Western rearmament and hardened NATO into a military organization. China''s standing in the socialist camp rose sharply on the strength of having fought the United States, which became one of the conditions for the later Sino-Soviet split. That armistice talks moved quickly after Stalin''s death in March 1953 shows how far the war''s continuation had rested on Moscow''s judgment.',
     $$[
       {"date":"1949–1950.04","title":{"ko":"거듭된 요청과 승인","en":"Repeated requests, and approval"},"body":{"ko":"김일성은 1949년부터 무력 통일 승인을 요청했고 스탈린은 거듭 미뤘다. 1950년 4월 모스크바 회담에서 최종 승인이 내려졌으나 소련군 파병은 배제됐다.","en":"Kim Il-sung had been asking since 1949; Stalin repeatedly put him off. Approval came at the Moscow talks of April 1950, with Soviet troops excluded."}},
       {"date":"1950.06.25","title":{"ko":"개전","en":"The attack"},"body":{"ko":"조선인민군이 38도선을 넘어 남진했다. 사흘 만에 서울이 함락됐다.","en":"The Korean People''s Army crossed the 38th parallel. Seoul fell within three days."}},
       {"date":"1950.06–07","title":{"ko":"안전보장이사회 결석","en":"The empty Security Council seat"},"body":{"ko":"중화인민공화국의 대표권 문제로 소련 대표 말리크가 안보리를 결석하던 중 유엔군 결의가 통과됐다. 거부권을 쓰지 않은 이 공백은 지금도 논쟁거리다.","en":"The Soviet delegate Malik was boycotting the Security Council over Chinese representation when the UN command resolutions passed. The unused veto is still debated."}},
       {"date":"1950.09–10","title":{"ko":"인천과 반격","en":"Inchon and the reversal"},"body":{"ko":"인천상륙으로 전세가 뒤집혀 유엔군이 38도선을 넘어 북상했다.","en":"The Inchon landing reversed the front and UN forces pushed north across the parallel."}},
       {"date":"1950.10","title":{"ko":"중국 인민지원군","en":"The Chinese People''s Volunteers"},"body":{"ko":"중국이 인민지원군을 보내 전선을 다시 남쪽으로 밀어냈다. 소련은 공중 엄호와 장비를 대는 데 그쳤다.","en":"China sent the People''s Volunteer Army and pushed the line south again. The Soviet contribution stopped at air cover and equipment."}},
       {"date":"1950.11–1953","title":{"ko":"미그 회랑","en":"MiG Alley"},"body":{"ko":"소련 조종사들이 만주 기지에서 미그-15로 출격했다. 소속을 감춘 이 참전은 냉전기 내내 공식적으로 부인됐다.","en":"Soviet pilots flew MiG-15s from Manchurian bases. Their participation, its identity concealed, was officially denied throughout the Cold War."}},
       {"date":"1953.03–07","title":{"ko":"스탈린의 죽음과 정전","en":"Stalin''s death and the armistice"},"body":{"ko":"스탈린이 죽은 뒤 소련 지도부가 종전으로 방향을 틀면서 교섭이 풀렸고, 7월 27일 정전협정이 조인됐다.","en":"After Stalin''s death the Soviet leadership turned toward ending the war, the talks unlocked, and the armistice was signed on 27 July."}}
     ]$$,
     $$["Kathryn Weathersby, Soviet Aims in Korea and the Origins of the Korean War (CWIHP Working Paper No. 8)", "Wilson Center Digital Archive: Korean War Origins", "Encyclopaedia Britannica: Korean War"]$$,
     NOW()),

    ('twentieth-party-congress', 87, '1956.02',
     '제20차 당대회와 비밀연설', 'The Twentieth Party Congress and the Secret Speech',
     '당이 스스로의 과거를 심판하기로 했을 때, 무엇이 열리고 무엇이 닫혔는가?',
     'When the party set out to judge its own past, what did that open, and what did it close?',
     '1956년 2월 14일부터 25일까지 모스크바에서 열린 소련공산당 제20차 당대회다. 공개 회기에서는 자본주의와의 평화공존, 전쟁은 불가피하지 않다는 명제, 사회주의로 가는 길이 나라마다 다를 수 있다는 노선이 제시됐다. 대회 마지막 날 비공개 회의에서 흐루쇼프는 「개인숭배와 그 결과에 대하여」를 낭독했다. 포스펠로프 위원회가 정리한 자료에 근거해, 1930년대 후반 당 간부와 군 지휘부에 가해진 대량 체포와 처형, 자백을 얻기 위한 고문, 전쟁 초기의 판단 착오, 민족 강제이주를 스탈린 개인의 책임으로 지목한 문서였다. 비판의 틀은 「개인숭배」에 한정됐다. 당의 노선과 체제 자체, 그리고 연설을 듣던 이들을 포함한 지도부의 공동 책임은 다뤄지지 않았다.',
     'The Twentieth Congress of the Communist Party of the Soviet Union met in Moscow from 14 to 25 February 1956. Its open sessions set out peaceful coexistence with capitalism, the thesis that war is not inevitable, and the line that the road to socialism could differ from country to country. In a closed session on the final day Khrushchev read "On the Cult of Personality and Its Consequences". Drawing on material assembled by the Pospelov commission, it charged Stalin personally with the mass arrests and executions of party cadres and military commanders in the later 1930s, with torture used to obtain confessions, with the misjudgements of the war''s opening, and with the deportation of whole nationalities. The frame of the criticism was the cult of personality, and it stopped there. The party''s line, the system itself, and the shared responsibility of a leadership that included the men listening were not addressed.',
     '연설문은 당 조직에 회람되고 곧 국외로 새어 나가 6월에는 서방 언론에 전문이 실렸다. 안으로는 굴라크 석방과 복권이 빠르게 진행되어 「해빙」이라 불리는 시기가 열렸고, 문학과 학문에서 스탈린 시기에 말할 수 없던 것이 발표되기 시작했다. 밖으로는 통제를 벗어났다. 폴란드의 10월과 헝가리 봉기가 같은 해 가을에 이어졌고, 헝가리는 소련군에 의해 진압됐다. 중국공산당과 알바니아는 스탈린 평가와 평화공존 노선을 수정주의로 규정하며 반발했고, 이는 중소분열의 출발점이 됐다. 연설이 개인의 죄로 좁혀 놓은 문제를 체제의 문제로 다시 여는 일은 30년 뒤 페레스트로이카의 과제로 남았다.',
     'The text circulated through party organizations, leaked abroad within months, and was published in full by the Western press in June. Inside the country releases from the Gulag and rehabilitations moved quickly, opening the period known as the Thaw, and literature and scholarship began to publish what could not be said under Stalin. Outside, it ran past control. The Polish October and the Hungarian uprising followed that autumn, and Hungary was put down by Soviet troops. The Chinese and Albanian parties rejected both the assessment of Stalin and the line of peaceful coexistence as revisionism, which became the starting point of the Sino-Soviet split. Reopening as a question about the system what the speech had narrowed to the guilt of one man was left to perestroika, thirty years later.',
     $$[
       {"date":"1953.03","title":{"ko":"스탈린의 죽음","en":"Stalin''s death"},"body":{"ko":"집단지도가 선언되고 베리야가 제거된 뒤, 탄압 사건의 재조사가 조심스럽게 시작됐다.","en":"Collective leadership was proclaimed, Beria was removed, and a cautious re-examination of the repression cases began."}},
       {"date":"1955.12–1956.02","title":{"ko":"포스펠로프 위원회","en":"The Pospelov commission"},"body":{"ko":"포스펠로프를 위원장으로 한 위원회가 1935년 이후 탄압을 조사해 보고서를 냈다. 비밀연설의 사실 근거는 대부분 여기서 왔다.","en":"A commission chaired by Pospelov investigated the repression from 1935 onward and reported. Most of the factual basis of the speech came from it."}},
       {"date":"1956.02.14","title":{"ko":"대회 개막","en":"The congress opens"},"body":{"ko":"공개 보고에서 평화공존과 다양한 이행 경로가 제시됐다. 이 노선 자체가 뒤에 중국과의 논쟁거리가 된다.","en":"The open report set out peaceful coexistence and a plurality of roads to socialism, a line that itself became the ground of the dispute with China."}},
       {"date":"1956.02.25","title":{"ko":"비밀연설","en":"The secret speech"},"body":{"ko":"비공개 회의에서 「개인숭배와 그 결과에 대하여」가 낭독됐다. 토론은 허용되지 않았고 표결도 없었다.","en":"\"On the Cult of Personality and Its Consequences\" was read to a closed session. No debate was allowed and no vote was taken."}},
       {"date":"1956.03","title":{"ko":"회람과 트빌리시","en":"Circulation, and Tbilisi"},"body":{"ko":"연설문이 당 조직에 회람됐다. 그루지야에서는 스탈린 격하에 반발한 시위가 일어나 군에 의해 유혈 진압됐다.","en":"The text was circulated to party organizations. In Georgia, protests against the demotion of Stalin were put down by troops with bloodshed."}},
       {"date":"1956.06","title":{"ko":"전문 공개","en":"The full text in print"},"body":{"ko":"서방 언론에 전문이 실리면서 연설은 국제 정치의 문서가 됐다.","en":"Publication of the full text in the Western press turned the speech into a document of international politics."}},
       {"date":"1956.10–11","title":{"ko":"폴란드와 헝가리","en":"Poland and Hungary"},"body":{"ko":"폴란드에서 고무우카가 복귀했고 헝가리에서는 봉기가 일어나 소련군에 진압됐다. 해빙의 한계가 그해 안에 드러났다.","en":"Gomułka returned in Poland; in Hungary an uprising was crushed by Soviet troops. The limits of the Thaw were visible within the year."}},
       {"date":"1961.10","title":{"ko":"제22차 당대회","en":"The Twenty-Second Congress"},"body":{"ko":"이번에는 공개 석상에서 비판이 이어졌고, 스탈린의 유해가 레닌묘에서 옮겨졌다.","en":"This time the criticism was made in open session, and Stalin''s body was moved out of the Lenin Mausoleum."}}
     ]$$,
     $$["Nikita Khrushchev, On the Cult of Personality and Its Consequences (1956)", "William Taubman, Khrushchev: The Man and His Era (Norton, 2003)", "Wilson Center Digital Archive: The Secret Speech and Its Consequences"]$$,
     NOW()),

    ('sino-soviet-split', 91, '1956–1969',
     '중소분열', 'The Sino-Soviet Split',
     '가장 큰 두 사회주의 국가는 왜 서로를 주적으로 부르게 됐는가?',
     'How did the two largest socialist states come to name each other the main enemy?',
     '중소분열은 소련과 중화인민공화국이 1950년대 후반부터 이념 논쟁을 거쳐 1960년대에 국가 관계 파탄으로, 1969년에는 국경 무력 충돌로까지 간 과정이다. 발단은 제20차 당대회였다. 중국공산당은 스탈린 격하와 평화공존 노선을 수정주의로 규정하고, 제국주의와의 타협이자 혁명 포기라고 비판했다. 여기에 국가 이익의 충돌이 겹쳤다. 소련은 중국의 핵무기 개발 지원을 1959년 중단했고, 1958년 대만해협 위기와 중국-인도 국경분쟁에서 중국이 기대한 지지를 보내지 않았다. 1960년 소련이 기술고문 1,300여 명을 일시에 철수시키면서 경제 협력의 축이 끊겼다. 논쟁은 국제 공산주의 운동 전체로 번져 각국 공산당이 노선을 골라야 하는 상황을 만들었다.',
     'The Sino-Soviet split is the process by which the Soviet Union and the People''s Republic of China moved from ideological dispute in the late 1950s to a rupture of state relations in the 1960s and to armed clashes on the border in 1969. It began with the Twentieth Congress. The Chinese party called the demotion of Stalin and the line of peaceful coexistence revisionism, a compromise with imperialism and an abandonment of revolution. Conflicts of state interest ran alongside. Moscow ended its help with Chinese nuclear weapons in 1959 and withheld the backing Beijing wanted in the 1958 Taiwan Strait crisis and the border dispute with India. In 1960 the Soviet Union withdrew more than 1,300 technical advisers at once, cutting the spine of economic cooperation. The argument spread through the international communist movement, forcing parties everywhere to choose a side.',
     '두 나라의 분열은 냉전을 양극에서 삼각 구도로 바꿨다. 1969년 우수리강 전바오섬(다만스키)에서 국경 충돌이 벌어지고 전면전 가능성까지 거론된 뒤, 중국은 미국과의 접근으로 방향을 틀어 1972년 닉슨의 방중으로 이어졌다. 국제 공산주의 운동에는 친소·친중 정당의 분열이 남아 여러 나라에서 좌파가 갈라섰고, 알바니아는 중국 편에, 대다수 유럽 정당은 소련 편에 섰다. 소련은 동쪽 국경에 대규모 병력을 상시 배치해야 했고, 이 부담은 소련 말기까지 이어졌다. 관계 정상화는 1989년 고르바초프의 베이징 방문으로 이루어졌는데, 그 방문은 톈안먼 시위와 시기가 겹쳤다.',
     'The split turned the Cold War from two poles into a triangle. After the border fighting at Zhenbao (Damansky) island on the Ussuri in 1969, when full war was openly discussed, China turned toward the United States, a course that led to Nixon''s visit in 1972. The international communist movement was left divided into pro-Soviet and pro-Chinese parties, splitting the left in many countries; Albania sided with China, most European parties with Moscow. The Soviet Union had to keep large forces permanently on its eastern border, a burden it carried to the end. Normalization came with Gorbachev''s visit to Beijing in 1989, which coincided with the Tiananmen demonstrations.',
     $$[
       {"date":"1956.02","title":{"ko":"제20차 당대회의 충격","en":"The shock of the Twentieth Congress"},"body":{"ko":"스탈린 격하와 평화공존 노선에 중국공산당이 반발했다. 협의 없이 발표된 것 자체도 문제로 삼았다.","en":"The Chinese party objected to the demotion of Stalin and to peaceful coexistence, and to the fact that neither had been discussed with them."}},
       {"date":"1958","title":{"ko":"연합함대와 대만해협","en":"The joint fleet and the Taiwan Strait"},"body":{"ko":"소련이 제안한 공동 잠수함 함대와 장파 무전소를 중국은 주권 침해로 받아들였다. 대만해협 위기에서도 소련의 지지는 미지근했다.","en":"Beijing read the proposed joint submarine fleet and long-wave radio station as an infringement of sovereignty, and found Soviet backing lukewarm in the Taiwan Strait crisis."}},
       {"date":"1959.06","title":{"ko":"핵 지원 중단","en":"The nuclear help ends"},"body":{"ko":"소련이 원자폭탄 시제품 제공 약속을 철회했다. 중국은 1964년 자력으로 핵실험에 성공한다.","en":"Moscow withdrew its promise of a sample atomic bomb. China tested its own device in 1964."}},
       {"date":"1960.07","title":{"ko":"고문단 철수","en":"The advisers leave"},"body":{"ko":"1,300여 명의 소련 기술고문이 설계도를 들고 한꺼번에 철수하면서 진행 중이던 사업들이 멈췄다.","en":"More than 1,300 Soviet technical advisers left at once, taking blueprints with them, and projects in progress stopped."}},
       {"date":"1960.11","title":{"ko":"모스크바 회의","en":"The Moscow conference"},"body":{"ko":"81개국 공산당 회의에서 논쟁이 공개적으로 벌어졌다. 문안은 타협으로 봉합됐으나 균열은 드러났다.","en":"The dispute broke into the open at the conference of eighty-one parties. The document was patched into a compromise, but the fracture was visible."}},
       {"date":"1963–1964","title":{"ko":"공개 논쟁","en":"The open polemic"},"body":{"ko":"중국이 「9평」 등 공개 논박을 잇달아 내면서 이념 논쟁이 국가 관계 단절로 굳었다.","en":"China issued the Nine Commentaries and other open rebuttals, hardening the ideological quarrel into a break between states."}},
       {"date":"1969.03–08","title":{"ko":"전바오섬","en":"Zhenbao island"},"body":{"ko":"우수리강 전바오섬에서 국경 충돌이 벌어지고 신장에서도 교전이 있었다. 소련이 핵 선제 타격을 검토했다는 정황이 이후 자료로 알려졌다.","en":"Border fighting broke out at Zhenbao island on the Ussuri, with further clashes in Xinjiang. Later material indicates the Soviet side weighed a pre-emptive nuclear strike."}},
       {"date":"1989.05","title":{"ko":"정상화","en":"Normalization"},"body":{"ko":"고르바초프의 베이징 방문으로 관계가 정상화됐다. 방문 시기는 톈안먼 시위와 겹쳤다.","en":"Relations were normalized by Gorbachev''s visit to Beijing, which fell during the Tiananmen demonstrations."}}
     ]$$,
     $$["Lorenz M. Lüthi, The Sino-Soviet Split: Cold War in the Communist World (Princeton University Press, 2008)", "Wilson Center Digital Archive: Sino-Soviet Relations", "Encyclopaedia Britannica: Sino-Soviet split"]$$,
     NOW())

ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, period_label = EXCLUDED.period_label,
    title_ko = EXCLUDED.title_ko, title_en = EXCLUDED.title_en,
    question_ko = EXCLUDED.question_ko, question_en = EXCLUDED.question_en,
    summary_ko = EXCLUDED.summary_ko, summary_en = EXCLUDED.summary_en,
    outcome_ko = EXCLUDED.outcome_ko, outcome_en = EXCLUDED.outcome_en,
    timeline = EXCLUDED.timeline, sources = EXCLUDED.sources, updated_at = NOW();


-- People. WHERE EXISTS keeps a missing id from failing the migration, as in
-- 108_commulingo_event_winter_war.sql.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES

    ('soviet-atomic-project', 'kurchatov', 0, 'leader', '과학 총책임자', 'Scientific director',
     '제2연구소부터 RDS-1까지 사업의 과학 부문을 이끌었고, 원자로 F-1을 임계에 도달시켰다.',
     'He led the scientific side from Laboratory No. 2 through to RDS-1, and took the F-1 reactor critical.'),
    ('soviet-atomic-project', 'beria', 1, 'executor', '특별위원회 수반', 'Head of the Special Committee',
     '1945년 이후 사업 전체를 관장하며 내무인민위원부의 조직과 수용자 노동을 동원했다.',
     'From 1945 he ran the whole project, mobilizing the NKVD''s organization and its prisoner labour.'),
    ('soviet-atomic-project', 'vannikov', 2, 'executor', '제1총국장', 'Head of the First Main Directorate',
     '사업의 산업 부문을 총괄해 공장 건설과 자재 공급을 맡았다.',
     'He directed the industrial side, responsible for building the plants and supplying materials.'),
    ('soviet-atomic-project', 'yulii-khariton', 3, 'participant', '아르자마스-16 수석 설계자', 'Chief designer at Arzamas-16',
     '폭탄 설계국을 이끌며 RDS-1의 설계와 조립을 책임졌다.',
     'He led the weapons design bureau and was responsible for the design and assembly of RDS-1.'),
    ('soviet-atomic-project', 'sakharov', 4, 'participant', '수소폭탄 설계', 'Designer of the hydrogen bomb',
     '층상 설계로 1953년 RDS-6s를 이끌었고, 뒤에 핵실험 반대로 돌아섰다.',
     'His layer-cake design produced RDS-6s in 1953; he later turned against nuclear testing.'),
    ('soviet-atomic-project', 'yakov-zeldovich', 5, 'participant', '이론 부문', 'Theory',
     '연쇄반응과 폭발 이론을 맡아 설계의 물리적 근거를 세웠다.',
     'Working on chain reaction and detonation theory, he supplied the physical basis of the design.'),
    ('soviet-atomic-project', 'georgy-flyorov', 6, 'participant', '사업 착수의 계기', 'The reason the project started',
     '서방 학술지에서 핵분열 논문이 사라진 것을 근거로 스탈린에게 편지를 보냈다.',
     'He wrote to Stalin, arguing from the disappearance of fission papers from Western journals.'),
    ('soviet-atomic-project', 'avraami-zavenyagin', 7, 'executor', '건설과 수용자 노동', 'Construction and prisoner labour',
     '내무인민위원부 쪽에서 우라늄 채굴과 폐쇄도시 건설을 지휘했다.',
     'On the NKVD side he directed uranium mining and the building of the closed cities.'),
    ('soviet-atomic-project', 'malyshev', 8, 'executor', '중기계공업부', 'Medium Machine Building',
     '원자력 산업을 부처로 편제해 실험 이후의 생산 체계를 세웠다.',
     'He organized the atomic industry into a ministry, building the production system that followed the test.'),
    ('soviet-atomic-project', 'nikolai-dollezhal', 9, 'participant', '원자로 설계', 'Reactor design',
     'F-1에 이어 플루토늄 생산로를 설계해 원자로 계보의 출발점을 놓았다.',
     'After F-1 he designed the plutonium production reactors, setting the line Soviet reactors followed.'),
    ('soviet-atomic-project', 'kirill-shchelkin', 10, 'participant', '실험 책임', 'In charge of the test',
     '세미팔라틴스크에서 RDS-1의 조립과 기폭을 맡았다.',
     'At Semipalatinsk he was responsible for assembling and firing RDS-1.'),
    ('soviet-atomic-project', 'isaak-kikoin', 11, 'participant', '우라늄 농축', 'Uranium enrichment',
     '기체확산법 농축을 맡아 무기급 우라늄 확보를 담당했다.',
     'He led gaseous diffusion enrichment, the route to weapons-grade uranium.'),
    ('soviet-atomic-project', 'igor-tamm', 12, 'participant', '수소폭탄 이론진', 'Hydrogen bomb theory group',
     '사하로프가 속한 이론 그룹을 이끌었다.',
     'He led the theory group in which Sakharov worked.'),
    ('soviet-atomic-project', 'stalin', 13, 'leader', '최우선 과제로 지정', 'Who made it the first priority',
     '히로시마 직후 사업에 국가의 자원을 무제한 투입하도록 결정했다.',
     'Immediately after Hiroshima he ordered the state''s resources thrown at the project without limit.'),
    ('soviet-atomic-project', 'abram-alikhanov', 14, 'participant', '중수로 노선', 'The heavy water line',
     '중수 감속 원자로 연구를 이끌어 흑연로와 다른 경로를 맡았다.',
     'He led work on heavy water moderated reactors, the branch running alongside the graphite route.'),
    ('soviet-atomic-project', 'boris-muzrukov', 15, 'executor', '마야크와 아르자마스-16', 'Mayak, then Arzamas-16',
     '마야크 플루토늄 공장을 맡았고 뒤에 아르자마스-16의 핵탄두 생산을 지휘했다.',
     'He ran the Mayak plutonium works and later directed warhead production at Arzamas-16.'),
    ('soviet-atomic-project', 'alexander-komarovsky', 16, 'executor', '시설 건설', 'Building the sites',
     '군사 건설 조직을 이끌고 원자력 시설과 폐쇄도시 건설을 맡았다.',
     'He led the military construction organization that built the atomic sites and the closed cities.'),
    ('soviet-atomic-project', 'dmitri-yefremov', 17, 'participant', '동위원소 분리 설비', 'Isotope separation equipment',
     '전기공업 부문에서 동위원소 분리에 쓰인 설비 개발을 맡았다.',
     'From the electrical industry side he was responsible for developing the isotope separation equipment.'),
    ('soviet-atomic-project', 'vasily-sergeevich-emelyanov', 18, 'executor', '원자력 행정', 'Atomic administration',
     '제1총국에서 자재와 야금을 맡았고 뒤에 원자력 이용 부문을 이끌었다.',
     'He handled materials and metallurgy in the First Main Directorate and later led the atomic energy body.'),
    ('soviet-atomic-project', 'leonid-kvasnikov', 19, 'participant', '원자력 첩보 기획', 'Who put atomic intelligence on the list',
     '대외정보 쪽에서 핵 관련 첩보 수집을 일찍 제기하고 조직했다.',
     'On the foreign intelligence side he raised and organized the collection of atomic material early.'),
    ('soviet-atomic-project', 'vasily-zarubin', 20, 'participant', '대미 레지던트', 'Resident in the United States',
     '미국 주재 정보망을 운영해 맨해튼 계획 관련 자료 수집을 관장했다.',
     'Running the networks in the United States, he oversaw the collection of Manhattan Project material.'),
    ('soviet-atomic-project', 'vitaly-ginzburg', 21, 'participant', '수소폭탄의 두 번째 착상', 'The second idea',
     '리튬-6 중수소화물을 제안해 RDS-6s 설계를 가능하게 했다.',
     'His proposal of lithium-6 deuteride made the RDS-6s design workable.'),

    ('korean-war', 'stalin', 0, 'leader', '개전을 승인한 지도자', 'The leader who gave approval',
     '미국이 개입하지 않으리라 보고 승인했으나, 소련군의 직접 참전은 끝까지 배제했다.',
     'He approved on the judgment that the United States would not intervene, but ruled out direct Soviet participation throughout.'),
    ('korean-war', 'kim-il-sung', 1, 'leader', '무력 통일을 추진한 당사자', 'Who pressed for unification by force',
     '1949년부터 거듭 승인을 요청했고 개전 후 조선인민군을 지휘했다.',
     'He asked for approval repeatedly from 1949 and commanded the Korean People''s Army once the war began.'),
    ('korean-war', 'mao-zedong', 2, 'participant', '인민지원군 파병 결정', 'Who sent the People''s Volunteers',
     '유엔군이 북상하자 파병을 결정해 전선을 다시 남쪽으로 밀어냈다.',
     'When UN forces pushed north he decided to intervene, driving the line south again.'),
    ('korean-war', 'zhou-enlai', 3, 'participant', '파병 교섭', 'Negotiating the intervention',
     '모스크바를 오가며 공중 엄호와 장비 지원 조건을 놓고 협상했다.',
     'He travelled to Moscow to negotiate the terms of air cover and equipment.'),
    ('korean-war', 'yakov-malik', 4, 'participant', '안보리 결석과 정전 제안', 'The empty seat, and the ceasefire proposal',
     '중국 대표권 문제로 안보리를 결석했고, 1951년 정전 교섭을 공개 제안했다.',
     'He boycotted the Security Council over Chinese representation, and in 1951 publicly proposed ceasefire talks.'),
    ('korean-war', 'vasilevsky', 5, 'executor', '군사 지원 총괄', 'Overseeing the military assistance',
     '참모총장·국방상으로 무기 공급과 고문단 파견을 관장했다.',
     'As chief of staff and defence minister he oversaw weapons supply and the dispatch of advisers.'),

    ('twentieth-party-congress', 'khrushchev', 0, 'leader', '비밀연설을 낭독한 제1서기', 'The first secretary who read the speech',
     '마지막 날 비공개 회의에서 「개인숭배와 그 결과에 대하여」를 낭독했다.',
     'He read "On the Cult of Personality and Its Consequences" to the closed session on the final day.'),
    ('twentieth-party-congress', 'pyotr-pospelov', 1, 'executor', '조사위원회 위원장', 'Chair of the investigating commission',
     '1935년 이후 탄압을 조사한 위원회를 이끌었고, 연설의 사실 근거가 그 보고서에서 나왔다.',
     'He chaired the commission that investigated the repression from 1935 on; the speech''s factual basis came from its report.'),
    ('twentieth-party-congress', 'mikoyan', 2, 'participant', '공개 회기의 선제 비판', 'The first criticism, in open session',
     '비밀연설에 앞서 공개 회기에서 스탈린 시기를 비판해 길을 열었다.',
     'He criticized the Stalin period in open session before the secret speech, opening the way.'),
    ('twentieth-party-congress', 'molotov', 3, 'opponent', '격하에 반대', 'Against the demotion',
     '스탈린 평가와 새 노선에 반대했고, 1957년 반당 그룹으로 몰려 축출됐다.',
     'He opposed both the assessment of Stalin and the new line, and was expelled with the Anti-Party Group in 1957.'),
    ('twentieth-party-congress', 'kaganovich', 4, 'opponent', '격하에 반대', 'Against the demotion',
     '연설에 반대한 지도부의 한 사람으로, 이듬해 반당 그룹과 함께 밀려났다.',
     'One of the leaders who opposed the speech, he was pushed out the next year with the Anti-Party Group.'),
    ('twentieth-party-congress', 'malenkov', 5, 'opponent', '격하에 반대', 'Against the demotion',
     '탄압 문서에 서명이 남은 지도부의 한 사람으로 공개 비판에 반대했다.',
     'One of the leaders whose signatures were on the repression documents, he opposed making the criticism public.'),
    ('twentieth-party-congress', 'suslov', 6, 'participant', '이념 부문 관리', 'Managing the ideological side',
     '노선 전환을 이념적으로 정리하는 일을 맡았고, 뒤에 그 한계를 지키는 쪽에 섰다.',
     'He handled the ideological framing of the turn, and later stood on the side that held its limits.'),
    ('twentieth-party-congress', 'shepilov', 7, 'participant', '연설문 작성 참여', 'A hand in drafting',
     '연설문 준비에 참여했으나 1957년 반당 그룹 사건에 휘말려 축출됐다.',
     'He took part in preparing the text, but was swept out in the Anti-Party Group affair of 1957.'),
    ('twentieth-party-congress', 'stalin', 8, 'target', '비판의 대상', 'The subject of the criticism',
     '대량 탄압과 전쟁 초기 실책의 책임자로 지목됐고, 1961년 레닌묘에서 옮겨졌다.',
     'Named as responsible for the mass repression and the misjudgements of 1941, he was moved out of the Mausoleum in 1961.'),

    ('sino-soviet-split', 'khrushchev', 0, 'leader', '소련 쪽 당사자', 'The Soviet principal',
     '스탈린 격하와 평화공존 노선으로 논쟁을 열었고, 1960년 고문단을 철수시켰다.',
     'His demotion of Stalin and line of peaceful coexistence opened the quarrel; in 1960 he withdrew the advisers.'),
    ('sino-soviet-split', 'mao-zedong', 1, 'leader', '중국 쪽 당사자', 'The Chinese principal',
     '소련 노선을 수정주의로 규정하고 국제 공산주의 운동에서 대안을 자처했다.',
     'He named the Soviet line revisionism and put China forward as the alternative in the world movement.'),
    ('sino-soviet-split', 'suslov', 2, 'participant', '논쟁의 이론 담당', 'The theoretical case',
     '중국 비판에 대한 소련 측 이론적 반박을 정리하고 당 회의에 보고했다.',
     'He assembled the Soviet theoretical rebuttal and reported it to party gatherings.'),
    ('sino-soviet-split', 'zhou-enlai', 3, 'participant', '결렬의 무대', 'Present at the breaks',
     '1961년 제22차 당대회에서 항의 퇴장하는 등 결렬의 장면들에 섰다.',
     'He walked out of the Twenty-Second Congress in 1961, one of the scenes of the rupture.'),
    ('sino-soviet-split', 'deng-xiaoping', 4, 'participant', '공개 논쟁의 대표', 'China''s man in the polemic',
     '1963년 모스크바 회담에서 중국 대표단을 이끌고 논쟁했다.',
     'He led the Chinese delegation in the 1963 Moscow talks.'),
    ('sino-soviet-split', 'andropov', 5, 'participant', '사회주의국가 관계 담당', 'Handling relations with socialist states',
     '중앙위 사회주의국가연락부장으로 분열 초기의 관계 관리를 맡았다.',
     'As head of the Central Committee department for socialist countries he managed relations in the early phase.')

) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
