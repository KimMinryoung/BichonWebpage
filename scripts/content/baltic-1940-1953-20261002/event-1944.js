// The Soviet reoccupation of the Baltic states, 1944–1953 (Baltic 1940–1953 batch, 2026-10-02).
// Exports { event, people, terms } built with ./lib.js. Person cards live in ./people-1944.js.
const { W, P, event: buildEvent, term } = require('./lib');

const E = t => W(encodeURI(t));
const ET = t => 'https://et.wikipedia.org/wiki/' + encodeURI(t);
const LT = t => 'https://lt.wikipedia.org/wiki/' + encodeURI(t);
const RU = t => 'https://ru.wikipedia.org/wiki/' + encodeURI(t);
const KO = t => 'https://ko.wikipedia.org/wiki/' + encodeURI(t);
const S = {
    vilnius: E('Vilnius_offensive'),
    balticOff: E('Baltic_offensive'),
    tallinn: E('Tallinn_offensive'),
    riga: E('Riga_offensive_(1944)'),
    courland: E('Courland_Pocket'),
    occupation: E('Occupation_of_the_Baltic_states'),
    estSSR: E('Estonian_Soviet_Socialist_Republic'),
    latSSR: E('Latvian_Soviet_Socialist_Republic'),
    litSSR: E('Lithuanian_Soviet_Socialist_Republic'),
    snieckus: E('Antanas_Sniečkus'),
    etKarotamm: ET('Nikolai_Karotamm'),
    ruKalnberzin: RU('Калнберзинь,_Ян_Эдуардович'),
    lacis: E('Vilis_Lācis'),
    veimer: E('Arnold_Veimer'),
    etBureau: ET('ÜK(b)P_KK_Eesti_büroo'),
    suslov: E('Mikhail_Suslov'),
    cpl: E('Communist_Party_of_Lithuania'),
    cpe: E('Communist_Party_of_Estonia'),
    guerrilla: E('Guerrilla_war_in_the_Baltic_states'),
    koForest: KO('숲의_형제들'),
    litPartisans: E('Lithuanian_partisans'),
    latPartisans: E('Latvian_partisans'),
    llks: E('Union_of_Lithuanian_Freedom_Fighters'),
    ltLLKS: LT('Lietuvos_laisvės_kovos_sąjūdis'),
    zemaitis: E('Jonas_Žemaitis'),
    ramanauskas: E('Adolfas_Ramanauskas'),
    luksa: E('Juozas_Lukša'),
    destruction: E('Extermination_battalion'),
    deportLt: E('Soviet_deportations_from_Lithuania'),
    deportEe: E('Soviet_deportations_from_Estonia'),
    deportLv: E('Soviet_deportations_from_Latvia'),
    vesna: E('Operation_Vesna'),
    priboi: E('Operation_Priboi'),
    martsi: ET('Märtsipleenum'),
    kabin: E('Johannes_Käbin'),
    catholicLt: E('Catholic_Church_in_Lithuania'),
    borisevicius: E('Vincentas_Borisevičius'),
    matulionis: E('Teofilius_Matulionis'),
    stateCont: E('State_continuity_of_the_Baltic_states'),
    beria: E('Lavrentiy_Beria'),
    ruBeria: RU('Берия,_Лаврентий_Павлович'),
};

const sections = [
    {
        heading: { ko: '붉은군대의 귀환과 쿠를란트 (1944–1945)', en: 'The Red Army returns, and Courland (1944–1945)' },
        paragraphs: [
            {
                ko: '1944년 여름 바그라티온 작전으로 독일 중부집단군이 벨라루스에서 밀려나자 붉은군대는 다시 발트 지역으로 들어왔다. 빌뉴스는 7월 5일 시작된 공세 끝에 13일 저녁 함락되었고, 뒤이은 샤울랴이 공세의 선두는 7월 31일 리가만 해안에 닿았다. 9월 14일부터 11월 24일까지 벌어진 발트 전략 공세에는 이반 바그라먄의 제1발트 전선군, 안드레이 예료멘코의 제2발트 전선군, 이반 마슬렌니코프의 제3발트 전선군과 레오니트 고보로프의 레닌그라드 전선군 일부가 나섰다. 에스토니아에서는 독일군이 물러나던 9월 18일 헌정 정부가 탈린의 정부 청사를 장악했으나, 22일 레닌그라드 전선군이 수도를 점령했고 대통령 직무대행 위리 울루오츠는 스웨덴으로 피신했다. 리가는 10월 13일 제3발트 전선군에 점령되었다.',
                en: 'In the summer of 1944, after Operation Bagration had thrown Germany’s Army Group Centre back out of Belorussia, the Red Army re-entered the Baltic region. Vilnius fell on the evening of 13 July after an offensive that began on the 5th, and the spearhead of the follow-up Šiauliai offensive reached the Gulf of Riga on 31 July. The Baltic strategic offensive of 14 September to 24 November committed Ivan Bagramyan’s 1st Baltic Front, Andrei Yeryomenko’s 2nd Baltic Front, Ivan Maslennikov’s 3rd Baltic Front and part of Leonid Govorov’s Leningrad Front. In Estonia the constitutional government seized the government buildings in Tallinn on 18 September as the Germans withdrew, but on the 22nd the Leningrad Front took the capital, and the acting president, Jüri Uluots, fled to Sweden. Riga fell to the 3rd Baltic Front on 13 October.',
                sources: [S.vilnius, S.balticOff, S.tallinn, S.riga],
            },
            {
                ko: '10월 9일 붉은군대가 메멜(클라이페다) 근처에서 발트해에 닿자 독일 북부집단군은 라트비아 서부의 쿠를란트 반도에 갇혔다. 독일군 참모총장 하인츠 구데리안 등은 이 병력을 빼내 중부 유럽 전선에 쓰자고 건의했으나 아돌프 히틀러는 거부했고, 1945년 1월 25일 쿠를란트 집단군으로 이름을 바꾼 이 부대는 붉은군대의 공세를 여섯 차례 막아 냈다. 통신이 끊긴 쿠를란트 집단군은 5월 8일 독일 항복 문서가 서명된 뒤인 5월 10일에야 명령을 받아 항복했다. 5월 12일까지 약 13만 5,000명이, 발트 지역 전체로는 약 18만 명의 독일군이 포로가 되었다. 리투아니아에서는 클라이페다 전투가 1945년 1월에 끝났다.',
                en: 'On 9 October the Red Army reached the Baltic Sea near Memel (Klaipėda), trapping Germany’s Army Group North on the Courland Peninsula in western Latvia. Heinz Guderian, the chief of the German General Staff, and others urged an evacuation so that the troops could stabilise the front in Central Europe, but Adolf Hitler refused; renamed Army Group Courland on 25 January 1945, the force held off six Red Army offensives. Cut off from communications, Army Group Courland received its orders only on 10 May, two days after the German Instrument of Surrender was signed, and then surrendered. By 12 May some 135,000 German troops had surrendered in Courland, and about 180,000 were taken prisoner in the Baltic area as a whole. In Lithuania the last battle, at Klaipėda, ended in January 1945.',
                sources: [S.courland, S.deportLt],
            },
            {
                ko: '새 점령을 피해 많은 사람이 서쪽으로 떠났다. 1944년 에스토니아에서는 8만 명이 바다를 건너 핀란드와 스웨덴으로 피난했고, 라트비아에서는 쿠를란트 전선이 버티는 사이 약 13만 명이 스웨덴과 독일로 빠져나갔으며, 리투아니아에서는 정치·문화계 인사를 중심으로 약 7만 명이 독일로 물러났다. 돌아온 붉은군대는 약탈과 폭력을 저질렀다. 안타나스 스니에치쿠스조차 7월 23일 라브렌티 베리야에게 「카우나스에서 이런 강도와 폭력이 계속되면 붉은군대에 대한 마지막 공감마저 사라질 것」이라고 항의했고, 베리야는 이를 스탈린에게 전했다. 국경도 바뀌어, 1944년 라트비아 영토의 약 2%인 아브레네 지구 일부가, 1945년에는 에스토니아의 페체리 군과 나르바강 동쪽의 이반고로드가 러시아 SFSR로 넘어갔다. 라트비아는 전쟁 동안 인구의 약 20%를 잃었다.',
                en: 'Many fled west ahead of the new occupation. In 1944 some 80,000 people fled Estonia by sea to Finland and Sweden; in Latvia, while the Courland front held, some 130,000 escaped to Sweden and Germany; and about 70,000 Lithuanians, largely political and cultural figures, retreated into Germany. The returning Red Army looted and committed violence, and even Antanas Sniečkus complained to Lavrentiy Beria on 23 July that “if such robbery and violence continues in Kaunas, this will burst our last sympathy for the Red Army”; Beria passed the complaint on to Stalin. Borders changed too: in 1944 part of Abrene District, about 2% of Latvia’s territory, was ceded to the Russian SFSR, and in 1945 Estonia’s Petseri County and Ivangorod, east of the Narva River, went the same way. Latvia lost some 20% of its population during the war.',
                sources: [S.estSSR, S.latSSR, S.deportLt, S.litSSR],
            },
        ],
    },
    {
        heading: { ko: '소비에트 공화국의 복원과 모스크바의 뷰로', en: 'Restoring the Soviet republics under Moscow’s bureaus' },
        paragraphs: [
            {
                ko: '1941년 동쪽으로 물러났던 공화국 지도자들이 붉은군대와 함께 돌아왔다. 리투아니아 공산당 제1서기 안타나스 스니에치쿠스는 1944년 러시아에서 돌아왔는데, 그의 어머니와 형제자매 다섯은 서방으로 피난했고 어머니는 아들과 의절했다. 에스토니아에서는 전쟁 중 사실상 당을 이끈 니콜라이 카로탐이 탈린 점령 뒤인 9월 28일 전원회의에서 제1서기로 선출되었고, 라트비아에서는 야니스 칼른베르진슈가 1940년부터 1959년까지 제1서기 자리를 지켰다. 정부 쪽에서는 라트비아의 빌리스 라치스, 에스토니아의 아르놀트 베이메르 등이 각료회의(1946년까지 인민위원회의) 의장을 맡았지만 실권은 당 제1서기에게 있었다. 리투아니아 SSR 최고소비에트를 이끈 유스타스 팔레츠키스는 형식상의 최고 권위였을 뿐이고, 빌리스 라치스도 대체로 허수아비로 여겨졌다.',
                en: 'The republican leaders who had retreated east in 1941 came back with the Red Army. Antanas Sniečkus, First Secretary of the Communist Party of Lithuania, returned from Russia in 1944; his mother and five of his siblings had fled to the West, and his mother disowned him. In Estonia Nikolai Karotamm, who had led the party de facto during the war, was elected First Secretary at a plenum on 28 September, after the capture of Tallinn, and in Latvia Jānis Kalnbērziņš remained First Secretary from 1940 to 1959. On the government side Vilis Lācis in Latvia, Arnold Veimer in Estonia and their Lithuanian counterpart chaired the Councils of Ministers (Councils of People’s Commissars until 1946), but real power lay with the party first secretaries. Justas Paleckis, who headed the Supreme Council of the Lithuanian SSR, was only the formal supreme authority, and Vilis Lācis too was regarded mostly as a figurehead.',
                sources: [S.snieckus, S.etKarotamm, S.ruKalnberzin, S.lacis, S.veimer, S.litSSR],
            },
            {
                ko: '모스크바는 새 공화국마다 전연방공산당(볼셰비키) 중앙위원회 뷰로를 두어 현지 당을 감독했다. 1944년 11월 11일 설치되어 1947년 6월 해체된 에스토니아 뷰로는 게오르기 말렌코프의 측근 니콜라이 샤탈린이, 1946년 3월부터는 게오르기 페로프가 이끌었고, 중요한 문제는 먼저 이 뷰로에서 논의된 뒤에야 에스토니아 당 중앙위원회 뷰로에 올라갔다. 1945년 6월 5일 이 뷰로는 에스토니아 SSR과 스웨덴의 외교 관계 수립을 제안한 카로탐의 편지를 잘못으로 규정했다. 리투아니아 뷰로는 1944~1946년 미하일 수슬로프가 이끌었는데, 1970년대의 지하 출판물은 그가 리투아니아 민족주의자들의 추방과 살해에 개인적 책임이 있다고 고발했다. 공화국 당의 제2서기 자리에는 거의 언제나 러시아인이나 다른 슬라브계가 앉았다. 라트비아에는 1937~1938년 대숙청의 「라트비아 작전」에서 살아남은 러시아의 라트비아계 공산주의자들이 대거 보내졌으나, 이들 대부분은 라트비아어를 하지 못했다.',
                en: 'Moscow set up a bureau of the Central Committee of the All-Union Communist Party (Bolsheviks) for each new republic to supervise the local party. The Estonian Bureau, created on 11 November 1944 and dissolved in June 1947, was chaired by Georgy Malenkov’s associate Nikolai Shatalin and from March 1946 by Georgi Perov, and important questions went to it before they reached the Bureau of the Estonian party’s Central Committee. On 5 June 1945 it ruled mistaken a letter in which Karotamm had proposed diplomatic relations between the Estonian SSR and Sweden. The Lithuanian Bureau was chaired in 1944–1946 by Mikhail Suslov, whom anti-Soviet samizdat of the 1970s accused of personal responsibility for the deportation and killing of Lithuanian nationalists. The second secretary of each republican party was almost always a Russian or another Slav. Latvia received many Russian Latvian communists who had survived the “Latvian Operation” of the Great Purge, but most of them did not speak Latvian.',
                sources: [S.etBureau, S.suslov, S.occupation, S.cpl, S.latSSR],
            },
            {
                ko: '현지 당은 작고 이질적이었다. 1944년 마지막 분기에 에스토니아 공산당의 당원은 56명뿐이었고, 1946년 당원 가운데 에스토니아인은 42%였다. 라트비아 당은 1949년 라트비아인이 52%였고, 리투아니아 당은 1953년에도 리투아니아인이 38%에 그쳤다. 에스토니아는 전후 첫 10년 동안 러시아에서 나고 자라 에스토니아어를 잘 못하는 에스토니아계 간부들이 다스렸는데, 사람들은 그들의 러시아식 억양을 비꼬아 「예스토니아인」이라 불렀다. 소비에트 제도는 선거로 다시 세워졌다. 라트비아에서는 1946년 2월 연방 최고소비에트, 1947년 2월 공화국 최고소비에트, 1948년 1월에야 지방 소비에트 선거가 치러졌고, 1946년 리투아니아 선거의 투표율 90% 이상이라는 결과는 조작되었을 가능성이 크다. 리투아니아 파르티잔들은 1946년과 1947년의 선거에 항의하며 이를 방해했다.',
                en: 'The local parties were small and largely imported. In the last quarter of 1944 the Estonian Communist Party had only 56 members, and in 1946 Estonians made up 42% of it; the Latvian party was 52% Latvian in 1949, and the Lithuanian party was still only 38% Lithuanian in 1953. For the first postwar decade Estonia was governed by ethnic Estonian functionaries born and raised in Russia, few of whom had mastered Estonian; mocking their Russian accent, people called them “Yestonians”. Soviet institutions were rebuilt through elections: in Latvia to the Supreme Soviet of the USSR in February 1946, to the republic’s Supreme Soviet in February 1947 and to local soviets only in January 1948, while Lithuania’s 1946 result of over 90% attendance was likely falsified. The Lithuanian partisans protested and disrupted the elections of 1946 and 1947.',
                sources: [S.occupation, S.estSSR, S.latSSR, S.litSSR, S.litPartisans],
            },
        ],
    },
    {
        heading: { ko: '숲으로 간 사람들 (1944–1946)', en: 'Into the forests (1944–1946)' },
        paragraphs: [
            {
                ko: '다시 점령당하기를 거부한 많은 사람이 숲으로 들어갔다. 에스토니아와 라트비아에서는 이들을 1905년 혁명 때부터 쓰인 말인 「숲의 형제들」이라 불렀고, 리투아니아에서는 「초록 사람들」(žaliukai)이나 그냥 파르티잔이라 불렀다. 리투아니아에서는 1944년 독일이 해산한 리투아니아 지역방위군 병력의 절반가량이 유격대를 이루어 시골로 흩어졌고, 리투아니아 자유군(LLA)은 7월 1일 소련에 대한 전쟁 상태를 선포하며 대원들에게 숲에 머물라고 명령했다. 에스토니아와 라트비아에서는 독일군 편에서 싸운 병사들이 붙잡히지 않고 숲으로 들어갔는데, 라트비아에서는 1945년 5월 독일 항복 뒤 군단병 약 4,000명이 숲으로 갔다. 무엇보다 전후 붉은군대 징집이 대열을 키웠다. 일부 지역에서는 등록된 징집 대상자의 절반도 나타나지 않았고, 사라진 징집 대상자의 가족에 대한 괴롭힘이 더 많은 사람을 숲으로 몰았다.',
                en: 'Many who refused another occupation went into the forests. In Estonia and Latvia they were called the “Forest Brothers”, a term first used in the 1905 revolution; in Lithuania they were the žaliukai (“green ones”) or simply partisans. In Lithuania about half of the Lithuanian Territorial Defense Force, disbanded by the Germans in 1944, formed guerrilla units and dissolved into the countryside, and on 1 July the Lithuanian Liberty Army (LLA) declared a state of war against the Soviet Union and ordered its members to stay in the forests. In Estonia and Latvia soldiers who had fought on the German side evaded capture and took to the woods; in Latvia some 4,000 legionaries went into the forests after Germany’s surrender in May 1945. Above all, postwar Red Army conscription swelled the ranks: in some districts fewer than half the registered conscripts reported, and harassment of the families of those who disappeared drove still more people into the forests.',
                sources: [S.guerrilla, S.litPartisans, S.latPartisans],
            },
            {
                ko: '리투아니아 파르티잔들이 벌인 싸움은 첫해가 가장 격렬했다. 이 한 해 동안 약 1만 명의 리투아니아인이 죽었는데, 전쟁 전체 사망자의 약 절반이다. 100명이 넘는 큰 부대들이 칼니슈케, 세다, 파나라 마을 등에서 NKVD와 정면으로 싸웠고, 소련의 통제가 미치지 않은 마을과 소도시를 파르티잔이 장악했다. 남부에서는 교사였던 아돌파스 라마나우스카스가 1945년 초 「바나가스」(매)라는 가명으로 합류해 140명 규모의 메르키네 중대를 꾸렸고, 1945년 6월 바르치아 숲의 전투에서는 파르티잔 30~47명이 죽었다. 1945년 7월 소련 당국은 숲에 숨은 사람들에게 「사면」과 「합법화」를 내걸었고, 1957년의 소련 보고에 따르면 모두 3만 8,838명이 나왔다(「무장 민족주의 도적」 8,350명, 징집 기피자 3만 488명). 그래도 1945년 말 리투아니아의 숲에는 약 3만 명의 무장 인원이 있었다.',
                en: 'The first year of the Lithuanian partisans’ fight was the fiercest: about 10,000 Lithuanians were killed in it, roughly half of all the war’s dead. Large units of 100 men or more fought open battles with the NKVD at Kalniškė, Seda, the village of Panara and elsewhere, and where the Soviets had not established control the partisans held whole villages and towns. In the south the teacher Adolfas Ramanauskas joined in early 1945 under the nom de guerre Vanagas (“Hawk”) and organised the 140-man Merkinė company; in the fighting in the Varčia forest in June 1945, 30–47 partisans were killed. In July 1945 the Soviet authorities announced an “amnesty” and “legalisation” for those hiding in the forests, and according to a Soviet report of 1957, 38,838 people came forward (8,350 classed as “armed nationalist bandits” and 30,488 as draft evaders). Even so, some 30,000 armed people lived in the Lithuanian forests at the end of 1945.',
                sources: [S.litPartisans, S.ramanauskas],
            },
            {
                ko: '저항에 참여한 인원은 추정마다 다르다. 적어도 5만 명(에스토니아 1만, 라트비아 1만, 리투아니아 3만)이라는 추정이 있고, 미시우나스와 타게페라는 리투아니아 3만, 라트비아 1만~1만 5,000, 에스토니아 1만 명으로 본다. 에스토니아에 대해서는 1944~1953년 1만 4,000~1만 5,000명이 싸웠다는 추정과, 독일군이 물러난 뒤 약 3만 명이 숲에 숨었다는 서술이 함께 있다. 라트비아에서는 실제 전투원이 가장 많을 때 1만~1만 5,000명, 저항 참여자 전체는 4만 명에 이르렀다고 하며, 1945~1955년 700개 무리에 최대 1만 2,000명이었다는 추정도 있다. 세 나라의 비중은 손실에서도 드러난다. 역사가 하인리흐스 스트로즈는 NKVD 보고를 근거로 1945년 한 해에 리투아니아에서 8,916명, 라트비아에서 715명, 에스토니아에서 270명의 파르티잔이 죽었다고 보았다.',
                en: 'Estimates of how many took part vary. One puts the figure at no fewer than 50,000 (10,000 in Estonia, 10,000 in Latvia and 30,000 in Lithuania); Misiunas and Taagepera estimate 30,000 in Lithuania, 10,000–15,000 in Latvia and 10,000 in Estonia. For Estonia there is both an estimate of 14,000–15,000 fighters in 1944–1953 and an account of some 30,000 partisans hiding in the forests after the German retreat. In Latvia active combatants peaked at 10,000–15,000 and all resisters may have numbered 40,000, while one author gives up to 12,000 in 700 bands over 1945–1955. The losses show the relative weight of the three countries: on the basis of NKVD reports the historian Heinrihs Strods counted 8,916 partisans killed in Lithuania in 1945, 715 in Latvia and 270 in Estonia.',
                sources: [S.guerrilla, S.estSSR, S.latPartisans],
            },
        ],
    },
    {
        heading: { ko: '리투아니아 자유 전사 연합 (1946–1952)', en: 'The Union of Lithuanian Freedom Fighters (1946–1952)' },
        paragraphs: [
            {
                ko: '1946년 여름부터 리투아니아 파르티잔은 작지만 더 잘 조직된 부대로 바뀌었다. 전국을 남부(네무나스), 북동부(산악), 서부(바다)의 세 지역과 아홉 개 군관구로 나누었고, 정면 전투 대신 벙커에 숨어 정치·선전 활동을 벌이며 80종 가까운 정기간행물을 냈다. MGB도 전술을 바꿔 첩자를 모으고 섬멸대대를 조직했으며, 파르티잔은 소련 협력자에 대한 보복으로 맞섰다. 아돌파스 라마나우스카스는 1947년 9월 다이나바 군관구 사령관, 1948년 남부 리투아니아 지역 사령관이 되었고, 소련 병사들을 위한 러시아어 신문 『자유로운 말』을 비롯한 여러 지하 신문을 쓰고 엮고 펴냈다.',
                en: 'From the summer of 1946 the Lithuanian partisans regrouped into smaller but better-organised units. They divided the country into three regions — southern (Nemunas), north-eastern (Mountains) and western (Sea) — and nine military districts, and instead of open battle they hid in bunkers and carried on political and propaganda work, publishing almost 80 periodicals. The MGB changed its tactics too, recruiting agents and organising destruction battalions, and the partisans answered with reprisals against collaborators. Adolfas Ramanauskas became commander of the Dainava military district in September 1947 and of the Southern Lithuania Region in 1948, and wrote, edited and published a number of underground newspapers, among them the Russian-language Svobodnoye slovo (The Free Word) for Soviet soldiers.',
                sources: [S.litPartisans, S.ramanauskas],
            },
            {
                ko: '파르티잔은 서방의 지원에 희망을 걸었다. 건축학도 출신으로 1946년 무장 저항에 들어가 타우라스 군관구의 비루테 여단을 이끌던 유오자스 룩샤는 1947년 말 동료 둘과 함께 철의 장막을 넘어, 파르티잔이 모은 소련의 탄압·살해·추방에 관한 자료와 교황 비오 12세에게 지원을 청하는 편지를 서방에 전했다. 그는 스웨덴을 거쳐 프랑스와 서독에서 프랑스 정보기관과 CIA의 훈련을 받았고, 서방에 머무는 동안 1944~1947년 파르티잔 활동의 기록 『자유를 위한 투사들』을 썼다. 1949~1950년 사이 CIA의 낙하산으로 리투아니아에 돌아온 그는 1951년 가을 MGB에 살해되었다. 한편 여러 목격자는 그가 1941년 카우나스의 리에투키스 차고 학살에 가담했다고 증언했으나, 리투아니아 정부는 이를 부인한다.',
                en: 'The partisans pinned their hopes on Western support. Juozas Lukša, a former architecture student who had joined the armed resistance in 1946 and commanded the Birutė brigade of the Tauras military district, crossed the Iron Curtain with two comrades at the end of 1947, carrying the partisans’ documentation of Soviet repressions, killings and deportations and a letter asking Pope Pius XII for support. Travelling via Sweden to France and West Germany, he was trained by French intelligence and the CIA and, while in the West, wrote Fighters for Freedom, a first-hand account of partisan activity in 1944–1947. Parachuted back into Lithuania by the CIA in 1949–1950, he was killed by the MGB in the autumn of 1951. According to several witnesses he had taken part in the Lietūkis garage massacre in Kaunas in 1941; the Lithuanian government denies this.',
                sources: [S.luksa, S.litPartisans],
            },
            {
                ko: '1949년 2월 미나이치아이 마을의 벙커에 모든 파르티잔 지휘관이 모여 중앙 지휘부인 리투아니아 자유 전사 연합(LLKS)을 세우고, 직업 장교 출신 요나스 제마이티스를 간부회 의장으로 뽑았다. 1918년 독립선언 31주년인 2월 16일 연합은 스스로를 리투아니아의 최고 정치·군사 권력으로 선포하는 선언을 채택했다. 선언은 회복될 리투아니아가 모든 시민에게 평등한 권리를 보장하는 민주국가여야 한다고 하면서 공산당을 범죄 조직으로 규정했고, 의장의 제1대리가 된 아돌파스 라마나우스카스도 서명자의 한 사람이었다. 선언 문서는 KGB가 보관한 덕에 남았고, 독립 회복 뒤 리투아니아 의회는 이를 공식 법령으로 인정했다. 제마이티스는 2009년 리투아니아의 제4대 대통령으로 공식 인정되었다.',
                en: 'In February 1949 all the partisan commanders met in a bunker in the village of Minaičiai, founded a central command, the Union of Lithuanian Freedom Fighters (LLKS), and elected the career officer Jonas Žemaitis as its chairman. On 16 February, the 31st anniversary of the 1918 Act of Independence, the Union adopted a declaration proclaiming itself the supreme political and military authority in Lithuania. It stated that the restored Lithuania should be a democratic state granting equal rights to every citizen and declared the Communist Party a criminal organisation; among its signatories was Adolfas Ramanauskas, who became the chairman’s first deputy. The document survived because the KGB preserved it, and after independence was restored the Lithuanian parliament recognised it as an official act. In 2009 Žemaitis was officially named the fourth President of Lithuania.',
                sources: [S.llks, S.ltLLKS, S.litPartisans, S.ramanauskas, S.zemaitis],
            },
        ],
    },
    {
        heading: { ko: '진압: MGB, 섬멸대대, 침투 공작', en: 'Suppression: the MGB, the destruction battalions and infiltration' },
        paragraphs: [
            {
                ko: '독일군이 물러난 뒤 섬멸대대가 다시 만들어졌다. 1941년 독일의 침공 직후 NKVD 아래 창설된 이 준군사 조직은 전후에 현지 지원자로 꾸려졌고, 1941년의 악명 때문에 1945~1946년 「인민 방위」로 이름을 바꾸었다. 리투아니아인들은 러시아어 「이스트레비텔리」(파괴자)에서 따 이들을 「스트리바이」라 불렀다. 섬멸대대는 숲의 형제들을 돕거나 도울 만한 민간인을 위협하고 매복과 수색에 나섰으며, 농민들에게 벌목·토탄 채굴·도로 공사 의무를 강요하는 등 농촌에서 소비에트 정책을 집행하는 무력이었다. 저항을 빠르게 없애는 효율적인 전투 부대는 되지 못했지만, 말과 사람과 지형을 아는 현지인으로서 보안기관과 내무군에 귀중한 보조 전력이 되었다. 조직은 1954년 해체되었고, 에스토니아 의회는 2002년 이를 범죄 조직으로 규정했다.',
                en: 'After the German retreat the destruction battalions were restored. Created under the NKVD right after the German invasion of 1941, these paramilitary units were now formed from local volunteers, and because of the notoriety of their old name they were renamed “people’s defence” in 1945–1946; Lithuanians called them stribai, from the Russian istrebiteli (“destroyers”). They terrorised actual or potential supporters of the Forest Brothers, joined ambushes and search patrols, and were the armed force that carried out Soviet policy in the countryside, for instance forcing farmers to fulfil forestry, peat-cutting and road-building obligations. They never became the efficient fighting force expected to eradicate the resistance, but as locals who knew the language, the people and the landscape they gave invaluable help to the security organs and internal troops. The organisation was dissolved in 1954, and in 2002 the Estonian parliament declared it a criminal organisation.',
                sources: [S.destruction, S.litPartisans],
            },
            {
                ko: 'MGB는 고문과 즉결 처형, 가족 추방으로 파르티잔을 압박했고, 처형한 파르티잔의 시신을 마을 마당에 전시해 주민을 겁주었다. 붙잡히면 고문을 당하고 가족이 화를 입을 것을 알았던 파르티잔은 수류탄 하나를 자폭용으로 남겨 두곤 했다. 결정적인 무기는 침투였다. 1940년대 말부터 영국 MI6과 미국·스웨덴 정보기관이 숲의 형제들에게 물자와 연락원을 보냈으나, 소련을 위해 일한 영국 정보기관원들이 정보를 넘기면서 MI6의 정글 작전은 크게 무너졌고, MGB는 많은 부대를 찾아내 침투하고 없앨 수 있었다. 1945~1954년 서방이 라트비아로 보낸 요원 약 25명도 대부분 체포되었다. 서방에 있는 소련 첩자들과 저항 조직 안의 침투자가 모은 정보에 1952년의 대규모 작전이 더해져, 1950년대 초에는 저항 대부분이 꺾였다.',
                en: 'The MGB pressed the partisans with torture, summary execution and the deportation of their families, and displayed the corpses of executed partisans in village courtyards to frighten the population. Knowing what capture meant for themselves and their relatives, partisans usually kept one grenade to blow themselves up. The decisive weapon was infiltration. From the late 1940s British MI6 and American and Swedish intelligence sent the Forest Brothers supplies and liaison officers, but MI6’s Operation Jungle was badly compromised by British intelligence officers spying for the Soviets, which let the MGB identify, infiltrate and eliminate many units. Most of the roughly 25 agents the Western services sent to Latvia in 1945–1954 were arrested. Intelligence from Soviet spies in the West and from infiltrators inside the resistance, combined with large-scale operations in 1952, had broken most of the resistance by the early 1950s.',
                sources: [S.litPartisans, S.guerrilla, S.latPartisans],
            },
            {
                ko: '1944~1953년의 테러는 누구도 안전하다고 느낄 수 없게 했다. 이 기간 리투아니아에서는 18만 3,000명이 체포되어 14만 2,000명이 굴라크로 보내졌고, 라트비아에서는 8만 8,000명이 감옥과 수용소로 보내져 적어도 2,321명이 처형되었으며, 에스토니아에서는 적어도 3만 4,800명이 정치적 이유로 체포되고 900명이 처형되었다. 소련 자료에 따르면 에스토니아에서는 1953년까지 파르티잔 2만 351명이 「제압」되어 그 가운데 1,510명이 전투에서 죽었고, 숲의 형제들의 손에 붉은군대·NKVD·에스토니아 경찰 1,728명이 죽었다. 라트비아 당국은 저항 기간 전체에 소련 측 1,562명이 죽고 560명이 다쳤다고 보고했다. 리투아니아의 희생은 파르티잔과 지지자를 합쳐 약 3만 명으로 추산되며, 파르티잔 전사만 2만 명이 넘는다는 서술도 있다. 발트 숲속 전쟁 전체의 사망자는 적어도 5만 명이다.',
                en: 'The terror of 1944–1953 left no one certain of safety. In those years 183,000 residents of Lithuania were arrested and 142,000 sent to the Gulag; in Latvia 88,000 were sent to prisons and labour camps and at least 2,321 executed; in Estonia no fewer than 34,800 were arrested for political reasons and 900 executed. According to Soviet data, 20,351 partisans in Estonia had been “defeated” by 1953, 1,510 of them killed in battle, while the Forest Brothers killed 1,728 members of the Red Army, the NKVD and the Estonian police. The Latvian authorities reported 1,562 Soviet personnel killed and 560 wounded over the whole period. Lithuania’s losses are estimated at some 30,000 partisans and supporters killed, and another account counts more than 20,000 fighters alone. The forest war as a whole cost at least 50,000 lives.',
                sources: [S.guerrilla, S.estSSR, S.litPartisans, S.litSSR],
            },
        ],
    },
    {
        heading: { ko: '토지에서 콜호스로: 추방의 물결 (1945–1951)', en: 'From land to kolkhoz: the waves of deportation (1945–1951)' },
        paragraphs: [
            {
                ko: '재점령 뒤 1940년의 국유화가 되살아났다. 에스토니아에서는 몇 해 사이 90만 헥타르가 넘는 땅이 몰수되어 상당 부분이 러시아 등지에서 온 새 정착민에게 넘어갔고, 라트비아에서는 피난민의 농장이 몰수되고 독일 지지자의 농지가 크게 줄었으며 남은 농민의 세금과 의무 공출량이 개인 영농을 할 수 없을 만큼 올랐다. 1947년 5월 21일 전연방공산당 중앙위원회가 에스토니아 농업의 집단화를 승인했고, 리투아니아에서도 1947년 집단화가 시작되었다. 그러나 무거운 세금과 선전에도 1948년 말까지 콜호스에 들어간 농가는 리투아니아와 에스토니아에서 약 3%에 그쳤다. 당국은 1930년대 초의 집단화 경험을 빌려 쿨라크를 주된 장애물로 지목하고 탄압했다.',
                en: 'Reoccupation brought back the nationalisation of 1940. In Estonia more than 900,000 hectares were expropriated within a few years, much of it handed to new settlers from Russia and elsewhere; in Latvia the farms of refugees were confiscated, the holdings of German supporters sharply reduced, and the taxes and compulsory delivery quotas of the remaining farmers raised until individual farming became impossible. On 21 May 1947 the Central Committee of the All-Union Communist Party authorised the collectivisation of Estonian agriculture, and collectivisation began in Lithuania in 1947 as well. Yet despite heavy taxes and propaganda only about 3% of farms in Lithuania and Estonia had joined kolkhozes by the end of 1948. Borrowing from the collectivisation of the early 1930s, the authorities named the kulaks as the main obstacle and made them targets of repression.',
                sources: [S.estSSR, S.latSSR, S.litSSR, S.priboi],
            },
            {
                ko: '추방도 곧 다시 시작되었다. 1944년 10월 체첸인과 인구시인의 추방을 겪어 본 세르게이 크루글로프 등은 징집을 피해 파르티잔에 들어간 「도적」의 가족을 추방하자는 구상을 돌렸다. 1945년 5월에는 리투아니아의 독일계 주민 약 1,000명이 타지키스탄 바흐시강 유역의 목화 농장으로 보내져 첫 두 해에 약 580명이 죽었고, 에스토니아에서도 8월 독일계를 중심으로 407명이 페름주로 옮겨졌다. 리투아니아에서는 1946년 2월 네 개 군에서 추방이 시작되었고 1947년 12월과 1948년 1~2월에도 이어졌다. 1948년 5월 22~24일 MGB는 베스나(봄) 작전으로 숲의 형제들과 그 가족, 「쿨라크」를 포함한 조력자를 리투아니아에서 추방했다. 공식 집계는 4만 9,331명이지만 3만 9,766명이나 4만 7,534명이라는 수치도 있으며, 이들은 특별이주민 신분으로 크라스노야르스크 지방, 이르쿠츠크주 등지로 보내졌다.',
                en: 'The deportations soon resumed. In October 1944 Soviet officials, among them Sergey Kruglov, who had experience of deporting the Chechens and Ingush, began circulating the idea of deporting the families of “bandits” — men who had joined the partisans to avoid conscription. In May 1945 about 1,000 Lithuanian Germans were sent to cotton plantations in the Vakhsh valley in Tajikistan, where some 580 died in the first two years, and in August 407 people, most of them of German descent, were moved from Estonia to Perm Oblast. In Lithuania deportations began in four counties in February 1946 and continued in December 1947 and January–February 1948. On 22–24 May 1948 the MGB’s Operation Vesna (“Spring”) deported Forest Brothers, their families and helpers, “kulaks” included, from Lithuania. The official tally was 49,331, though other figures of 39,766 and 47,534 are given; as special settlers they were sent to Krasnoyarsk Krai, Irkutsk Oblast and elsewhere.',
                sources: [S.deportLt, S.deportEe, S.litSSR, S.vesna],
            },
            {
                ko: '1949년 1월 18일 스탈린은 세 공화국 지도자들을 불러 보고를 받았고, 그날 정치국은 대규모 추방을 결정했다. 1월 29일 소련 각료회의는 극비 결정 제390-138ss호로 「쿨라크, 민족주의자, 도적」과 그 지지자·가족의 추방을 승인하며 리투아니아 2만 5,500명, 라트비아 3만 9,000명, 에스토니아 2만 2,500명의 할당량을 정했다. 2월 28일 국가보안장관 빅토르 아바쿠모프가 MGB 명령 제0068호에 서명했고, MGB 차관 세르게이 오골초프가 MGB의 역할 전체를, 표트르 부르마크 중장이 리가에 본부를 두고 MGB 부대를 지휘했다. 「군사 훈련」을 구실로 8,850명의 병력이 더 들어왔다. 3월 25일 새벽부터 MGB 요원 셋, 섬멸대대원 둘, MGB가 무장시킨 현지 당 활동가 넷이나 다섯으로 이루어진 작전조가 가족들을 끌어냈고, 화물열차는 평균 2주, 길게는 한 달 가까이 달렸다.',
                en: 'On 18 January 1949 Stalin summoned the leaders of the three republics to report, and the same day the Politburo decided on a mass deportation. On 29 January the USSR Council of Ministers adopted the top-secret decision No. 390-138ss approving the deportation of “kulaks, nationalists, bandits”, their supporters and families, with quotas of 25,500 people for Lithuania, 39,000 for Latvia and 22,500 for Estonia. On 28 February the Minister of State Security, Viktor Abakumov, signed MGB Order No. 0068; Deputy Minister Sergei Ogoltsov was in charge of the MGB’s overall role and Lieutenant General Pyotr Burmak commanded the MGB troops from headquarters in Riga. An additional 8,850 soldiers arrived under cover of “military exercises”. From dawn on 25 March teams of three MGB agents, two destruction battalion members and four or five local party activists armed by the MGB took families from their homes; the freight trains took two weeks on average, and up to almost a month.',
                sources: [S.priboi],
            },
            {
                ko: '3월 25~28일의 프리보이 작전으로 9만 명이 넘는 사람이 시베리아 등지로 추방되었다. 공화국별 수치는 자료마다 다르다. 리투아니아는 2만 8,656명 또는 2만 8,981명(4월의 추가 추방까지 약 3만 2,000명), 라트비아는 4만 2,113~4만 3,000명, 에스토니아는 2만 722명이다. 추방자의 약 72%가 여성과 16세 미만 어린이였고, 내무장관 세르게이 크루글로프는 5월 18일 스탈린에게 의지할 데 없는 노인 2,850명과 부양할 부모가 없는 어린이 1,785명이 포함되었다고 보고했다. 추방은 「영구」였고 탈출 시도에는 20년 중노동이 걸렸으며, 1950년 말까지 4,123명(4.5%)이 죽었는데 그 가운데 2,080명이 어린이였다. 에스토니아의 집단화율은 3월 20일 8%에서 4월 20일 64%로, 라트비아는 11%에서 50% 이상으로 뛰었고, 그해 말 에스토니아는 80%, 라트비아는 93%에 이르렀다. 62%에 머문 리투아니아에서는 1951년 가을 2만 명이 넘는 사람을 다시 추방한 오센(가을) 작전이 이어졌다.',
                en: 'Operation Priboi of 25–28 March deported more than 90,000 people to Siberia and other remote regions. The figures by republic differ between sources: 28,656 or 28,981 for Lithuania (about 32,000 including a follow-up deportation in April), 42,113–43,000 for Latvia and 20,722 for Estonia. Some 72% of the deportees were women and children under 16; Interior Minister Sergey Kruglov reported to Stalin on 18 May that they included 2,850 “decrepit solitary old people” and 1,785 children without parents to support them. The deportation was “for eternity”, attempted escape was punished with twenty years of hard labour, and by the end of 1950, 4,123 deportees (4.5%) had died, 2,080 of them children. Collectivisation in Estonia jumped from 8% on 20 March to 64% on 20 April and in Latvia from 11% to more than 50%, reaching 80% and 93% by the end of the year. Lithuania stood at 62%, and in the autumn of 1951 Operation Osen (“Autumn”) deported more than 20,000 more people.',
                sources: [S.priboi, S.deportLt, S.litSSR, S.deportLv, S.deportEe],
            },
        ],
    },
    {
        heading: { ko: '「부르주아 민족주의」와의 싸움 (1949–1952)', en: 'The struggle against “bourgeois nationalism” (1949–1952)' },
        paragraphs: [
            {
                ko: '1949년 스탈린은 중앙에서 더 독립하려 한다는 의심을 받는 지방 지도부를 다잡으려 새 숙청에 나섰다. 러시아 역사가 옐레나 주브코바는 크렘린의 전후 발트 정책을 집단화를 미루고 탄압을 주로 저항 운동에 겨누었던 1944~1947년과, 1947년 중반부터 스탈린이 죽을 때까지 직접적인 획일화와 대규모 탄압이 이루어진 시기로 나눈다. 레닌그라드 사건의 여파 속에서 레닌그라드 당 지도부와 가깝다고 여겨진 에스토니아 당 지도부도 표적이 되었다. 한 개인의 거듭된 투서를 계기로 중앙위원회가 조사를 시작했고, 1949년 12월 파견된 조사단은 카로탐이 「정치적 신뢰를 얻지 못한 옛 부르주아 간부」에 기대고 쿨라크를 비호한다고 보고했다. 조사단에 가장 깊은 인상을 준 것은 공화국 지도부에 부르주아 민족주의 성향의 인물이 많다고 거듭 경고했다는 요한네스 캐빈의 진술이었다. 카로탐은 말렌코프와 스탈린에게 편지를 써 간부 선발의 잘못을 인정하면서, 세 해 동안 교사 1,022명을 정치적 이유로 해임하고 1만 2,000명을 체포·처벌했으며 1949년 3월 「쿨라크·민족주의 분자」를 추방했다고 내세웠다.',
                en: 'In 1949 Stalin launched a new purge to discipline local leaderships suspected of seeking more independence from the centre. The Russian historian Elena Zubkova divides the Kremlin’s postwar Baltic policy into two periods: 1944–1947, when collectivisation was put off and repression aimed mainly at the resistance, and the time from mid-1947 to Stalin’s death, marked by direct unification and mass repression. In the wake of the Leningrad Affair the Estonian party leadership, considered close to Leningrad’s, became a target. Repeated letters of complaint from one individual prompted a Central Committee investigation, and a commission sent in December 1949 reported that Karotamm relied on “old bourgeois cadres who do not merit political trust” and defended kulaks. What impressed the commission most was the testimony of Johannes Käbin, who said he had repeatedly warned that the republic’s leadership was full of people of bourgeois-nationalist outlook. Karotamm wrote to Malenkov and Stalin admitting mistakes in the choice of cadres while pointing out that in three years 1,022 teachers had been dismissed for political reasons, 12,000 people arrested and convicted, and the “kulak-nationalist element” deported in March 1949.',
                sources: [S.martsi],
            },
            {
                ko: '1950년 1월 공화국 국가보안장관 보리스 쿰이 해임되었고, 3월 7일 정치국은 에스토니아 지도부가 부르주아 민족주의와의 싸움에 소홀했다는 결정을 승인했다. 3월 21~26일 탈린에서 열린 에스토니아 공산당 제8차 전원회의에서는 중앙위원회를 대표한 판텔레이몬 포노마렌코가 고발 연설을 했고, 카로탐은 제1서기에서 물러나 요한네스 캐빈으로 교체되었다. 곧바로 숙청이 시작되어 3월 24일 니골 안드레센이 체포되어 25년형을 받았고, 한스 크루스와 헨드리크 알리크 등이 당에서 쫓겨난 뒤 체포되었다. 과학아카데미에서는 한 해 동안 100명 넘게 정치적 이유로 해고되었고, 타르투 대학에서는 교수진 약 200명이 고발되고 학생 약 100명이 제적되었다. 아르놀트 베이메르도 1951년 3월 각료회의 의장에서 해임되었다. 카로탐은 체포를 면하고 5월 모스크바의 사회과학아카데미로 보내졌으나 캐빈의 반대로 다시는 에스토니아로 돌아오지 못했다. 캐빈은 1978년까지 당을 이끌었다.',
                en: 'In January 1950 the republic’s Minister of State Security, Boris Kumm, was dismissed, and on 7 March the Politburo approved a decision that the Estonian leadership had neglected the struggle against bourgeois nationalism. At the Eighth Plenum of the Estonian Communist Party, held in Tallinn on 21–26 March 1950, Panteleimon Ponomarenko delivered the indictment on behalf of the Central Committee, and Karotamm was removed as First Secretary and replaced by Johannes Käbin. The purge began at once: Nigol Andresen was arrested on 24 March and given 25 years, and Hans Kruus, Hendrik Allik and others were expelled from the party and arrested. More than a hundred people were dismissed from the Academy of Sciences on political grounds within a year, and at Tartu University about 200 teaching staff were accused and nearly 100 students expelled. Arnold Veimer was removed as chairman of the Council of Ministers in March 1951. Karotamm escaped arrest and in May was sent to the Academy of Social Sciences in Moscow, but Käbin’s opposition kept him from ever returning to Estonia. Käbin led the party until 1978.',
                sources: [S.martsi, S.kabin, S.etKarotamm, S.veimer],
            },
            {
                ko: '다른 두 공화국은 사정이 달랐다. 스니에치쿠스는 1949~1950년 지하 시절의 옛 공산주의자 동지들을 박해에서 지켜 내며 처음으로 모스크바와 맞섰고, 리투아니아는 옛 공산주의자에 대한 대규모 박해가 없었을 뿐 아니라 소비에트 이전 시기의 공산주의자가 단 한 명도 기소되거나 체포되지 않은 소련의 유일한 공화국이 되었다. 라트비아에서는 칼른베르진슈와 빌리스 라치스가 자리를 지켰지만, 1949년 3월 리가시 선전선동부의 비전임 강사 30명 가운데 라트비아어를 아는 사람이 8명뿐이었을 만큼 바깥에서 온 간부가 많았다. 1949년 무렵 세 나라 모두에서 토박이 공산주의자는 당원의 약 3분의 1이었고, 다섯 해의 점령 뒤에도 당에 들어간 사람은 리투아니아인의 0.3%, 라트비아인과 에스토니아인의 0.7%에 그쳤다.',
                en: 'The other two republics fared differently. In 1949–1950 Sniečkus had his first confrontation with Moscow when he defended old communist friends from his underground years against persecution, and Lithuania became the only Soviet republic where there was no mass persecution of old communists and not a single communist of pre-Soviet times was accused or arrested. In Latvia Kalnbērziņš and Vilis Lācis kept their posts, but outside cadres were so numerous that in March 1949 only 8 of the 30 non-staff lecturers in the Riga city agitprop department knew Latvian. Around 1949 home-grown communists made up about a third of the membership in all three countries, and after five years of occupation only 0.3% of Lithuanians and 0.7% of Latvians and Estonians had joined the party.',
                sources: [S.snieckus, S.occupation],
            },
        ],
    },
    {
        heading: { ko: '이주, 산업, 교회 — 그리고 1953년', en: 'Immigration, industry, the church — and 1953' },
        paragraphs: [
            {
                ko: '전후 재건은 대규모 이주와 함께 왔다. 「스탈린 민족 정책에 따른 형제적 도움」이라는 이름으로 수십만 명의 러시아어 사용자가 주로 도시로 옮겨 와, 에스토니아의 도시 인구는 1945~1950년 26만 7,000명에서 51만 6,000명으로 늘었고 그 증가분의 90% 이상이 새 이주민이었다. 주택은 돌아온 전쟁 피난민보다 이주민에게 먼저 배정되었다. 소련 계획가들은 에스토니아 북동부의 오일셰일 채굴을 키워 제4차 5개년 계획의 에스토니아 투자 가운데 40%를 그 기반 시설에 배정했는데, 1948년부터 오일셰일 가스가 전용 관을 따라 레닌그라드로 보내진 반면 탈린에는 1953년에야 들어왔다. 라트비아에는 1945~1955년에만 53만 5,000명의 이주민이 들어왔고, 리가는 군사 도시가 되었다. 에스토니아인의 비율은 1934년 88%에서 1959년 75%로, 라트비아인의 비율은 1940년 약 79%에서 1989년 52%로 떨어졌다.',
                en: 'Postwar reconstruction came with mass immigration. Under the label of “brotherly aid under Stalinist nationality policies” hundreds of thousands of Russian speakers were moved in, mainly to the cities: Estonia’s urban population grew from 267,000 to 516,000 in 1945–1950, more than 90% of the increase being new immigrants, and immigrants were given housing before returning war refugees. Soviet planners expanded oil shale mining in north-eastern Estonia, assigning it 40% of the capital investment planned for Estonia under the fourth Five-Year Plan; from 1948 oil shale gas went to Leningrad by a specially built pipeline, while Tallinn received it only in 1953. Latvia took in 535,000 immigrants between 1945 and 1955 alone, and Riga became heavily militarised. The Estonian share of Estonia’s population fell from 88% in 1934 to 75% in 1959, and the Latvian share of Latvia’s from about 79% in 1940 to 52% in 1989.',
                sources: [S.estSSR, S.occupation, S.latSSR],
            },
            {
                ko: '교회도 탄압을 받았다. 리투아니아에서는 국가 무신론과 파르티잔 투쟁에 대한 가톨릭교회의 관여 때문에 박해가 거세져, 사제와 신자가 체포·추방되고 교회가 문을 닫았으며 새 사제의 양성이 특히 제한되었다. 텔샤이의 빈첸타스 보리세비추스 주교는 서방으로 피하지 않고 남았다가 1945년 12월과 1946년 2월 NKVD에 체포되었고, 협력하면 사면하겠다는 제안을 거절했다. 그는 파르티잔에게 가짜 서류를 주었다는 등의 혐의로 8월 28일 사형을 선고받았고 11월에 처형된 것으로 여겨진다. 테오필리우스 마툴리오니스 주교는 1946년 사목 서한을 냈다는 이유로 다시 10년형을 받았고, 빌뉴스 대주교 메치슬로바스 레이니스도 투옥되었으며, 1950년 국가는 빌뉴스 대성당을 교회에서 빼앗았다. 1951년에는 여호와의 증인 등 금지된 종교 집단의 신자들이 발트 3국과 몰도바, 서부 우크라이나, 벨라루스에서 강제 이주되었고, 라트비아에서는 칼른베르진슈가 정교회의 베니아민(페드첸코프) 수도대주교를 리가에서 물러나게 했다.',
                en: 'The churches were repressed too. In Lithuania state atheism and the Catholic Church’s involvement in the partisans’ fight intensified persecution: priests and believers were arrested and deported, churches closed and the training of new clergy especially restricted. Vincentas Borisevičius, bishop of Telšiai, refused to flee to the West; arrested by the NKVD in December 1945 and again in February 1946, he turned down a pardon in exchange for cooperation, was sentenced to death on 28 August on charges that included giving partisans false papers, and is believed to have been executed in November. Teofilius Matulionis, another bishop, was sentenced to another ten years for issuing a pastoral letter in 1946, Archbishop Mečislovas Reinys of Vilnius was imprisoned as well, and in 1950 the state seized Vilnius Cathedral from the Church. In 1951 members of prohibited religious groups such as the Jehovah’s Witnesses were deported from the Baltic states, Moldavia, western Ukraine and Belarus, and in Latvia Kalnbērziņš secured the removal of the Orthodox Metropolitan Veniamin (Fedchenkov) from Riga.',
                sources: [S.catholicLt, S.borisevicius, S.matulionis, S.deportEe, S.ruKalnberzin],
            },
            {
                ko: '서방은 병합을 끝내 법적으로 승인하지 않았다. 미국과 영국은 1945년 얄타 회담에서 소련의 발트 점령을 사실상 인정했지만, 1940년 7월 23일의 웰스 선언에 따라 대부분의 서방 민주국가와 함께 병합을 법적으로는 승인하지 않았고, 옛 정부의 이름으로 활동하는 발트 3국의 외교관과 영사를 계속 인정했다. 1947년 망명 외교관들은 점령에 관한 공동 서한을 유엔에 보냈고, 1949년 3월 26일 미 국무부는 발트 3국이 여전히 자신의 외교 대표를 둔 독립국이라는 회람을 냈으며, 1950년 7월 27일 망명 외교관들은 「집단 학살적 대량 추방」에 대한 유엔 조사를 지지해 달라고 미국에 호소했다. 그러나 소련이 안전보장이사회에 있는 한 발트 문제는 유엔의 공식 의제에 오르지 못했다. 서방이 소련과 전쟁을 벌여 발트를 해방하리라는 숲의 형제들의 희망도 끝내 이루어지지 않았다.',
                en: 'The West never recognised the annexation in law. The United States and Britain implicitly acknowledged the Soviet occupation of the Baltic states de facto at the Yalta Conference in 1945, but in line with the Welles Declaration of 23 July 1940 they and most other Western democracies withheld de jure recognition and continued to recognise Baltic diplomats and consuls acting in the name of the former governments. In 1947 the exiled diplomats of the three countries together sent a communication on the occupation to the United Nations; on 26 March 1949 the US State Department issued a circular stating that the Baltic states were still independent nations with their own diplomatic representatives; and on 27 July 1950 the diplomats-in-exile appealed to the United States to support a UN investigation of the “genocidal mass deportations”. With the Soviet Union on the Security Council, however, the Baltic question never reached the UN’s official agenda, and the Forest Brothers’ hope that a war between the West and the Soviet Union would liberate the Baltic states never materialised.',
                sources: [S.estSSR, S.stateCont, S.deportEe, S.guerrilla],
            },
            {
                ko: '1953년 3월 스탈린이 죽자 내무장관이 된 라브렌티 베리야는 비러시아 민족의 처우 개선을 내세웠다. 그가 준비한 초안에 따라 소련공산당 중앙위원회 간부회는 5월 26일 리투아니아, 6월 12일 라트비아에 관한 비밀 결정을 내려 토착 간부의 등용을 서두르게 했고, 6월 전반 라트비아·에스토니아·리투아니아 공산당이 이를 받아들이는 전원회의를 열었다. 베리야는 라트비아와 리투아니아 내무부의 지도부를 모두 민족 간부로 바꾸라고 지시했고, 라트비아에서는 러시아인 관리 여럿이 해임되었다. 같은 무렵인 5월 30일, 뇌출혈로 마비된 채 숨어 지내던 요나스 제마이티스가 체포되어 모스크바에서 베리야에게 직접 심문을 받았다. 그러나 베리야는 6월 26일 체포되었고, 그의 「민족」 결정들은 7월 중앙위원회 전원회의에서 철회되었다. 파르티잔 지도부는 1953년에 무너졌는데, 1952년 연합을 이어받은 아돌파스 라마나우스카스는 이미 무장 투쟁을 멈추고 수동적 저항으로 돌아서라고 명령한 뒤였다. 제마이티스는 1954년 부티르카 감옥에서 처형되었다.',
                en: 'When Stalin died in March 1953, Lavrentiy Beria, now Minister of Internal Affairs, advocated better treatment of the non-Russian nationalities. On drafts he had prepared, the Presidium of the CPSU Central Committee adopted secret decisions on Lithuania on 26 May and on Latvia on 12 June to speed up the promotion of native cadres, and in the first half of June the Latvian, Estonian and Lithuanian parties held plenums endorsing them. Beria ordered the entire leadership of the Latvian and Lithuanian interior ministries replaced with national cadres, and in Latvia a number of Russian officials were dismissed. At about the same time, on 30 May, Jonas Žemaitis, paralysed by a cerebral haemorrhage and in hiding, was arrested and interrogated in Moscow by Beria himself. But Beria was arrested on 26 June, and his “national” decisions were revoked at the Central Committee plenum in July. The partisan leadership was destroyed in 1953; Adolfas Ramanauskas, who had taken over the Union in 1952, had already ordered an end to armed struggle in favour of passive resistance. Žemaitis was executed in Butyrka prison in 1954.',
                sources: [S.beria, S.ruBeria, S.latSSR, S.zemaitis, S.litPartisans, S.ramanauskas],
            },
        ],
    },
];

const event = buildEvent({
    id: 'baltic-sovietisation-1944-1953',
    title: { ko: '발트 3국의 재점령: 숲의 형제들과 1949년의 추방', en: 'The Soviet reoccupation of the Baltic states: the Forest Brothers and the deportations of 1949' },
    period: '1944–1953',
    sortOrder: 123,
    question: {
        ko: '전쟁이 끝난 뒤에도 발트 3국에서는 왜 10년 가까이 숲속의 전쟁이 이어졌고, 소련은 추방과 집단화, 이주로 이 땅을 어떻게 바꾸었는가?',
        en: 'Why did a war in the forests go on in the Baltic states for almost a decade after World War II, and how did the Soviet Union remake the region through deportation, collectivisation and immigration?',
    },
    summary: {
        ko: '1944년 여름부터 1945년 5월 쿠를란트의 항복까지 붉은군대는 발트 3국을 다시 점령했고, 돌아온 공화국 지도자들은 모스크바의 중앙위원회 뷰로 감독 아래 소비에트 체제를 복원했다. 징집과 탄압을 피해 숲으로 들어간 수만 명의 숲의 형제들은 특히 리투아니아에서 1949년 리투아니아 자유 전사 연합으로 뭉쳐 싸웠으나, MGB와 섬멸대대, 침투 공작에 차례로 꺾였다. 1948년 베스나 작전과 1949년 3월 9만여 명을 시베리아 등지로 보낸 프리보이 작전은 저항의 기반을 무너뜨리고 집단화를 밀어붙였다. 1950년 에스토니아에서는 제8차 전원회의가 「부르주아 민족주의」를 이유로 지도부를 숙청했고, 러시아어 사용 이주민의 유입과 산업화, 교회 탄압이 이어졌다. 1953년 스탈린이 죽은 뒤 베리야의 민족 정책은 석 달 만에 뒤집혔다.',
        en: 'Between the summer of 1944 and the surrender in Courland in May 1945 the Red Army reoccupied the Baltic states, and the returning republican leaders rebuilt the Soviet system under the supervision of Central Committee bureaus in Moscow. Tens of thousands of Forest Brothers who had fled conscription and repression into the forests fought on — in Lithuania united from 1949 in the Union of Lithuanian Freedom Fighters — but were worn down by the MGB, the destruction battalions and infiltration. Operation Vesna in 1948 and Operation Priboi, which sent more than 90,000 people to Siberia and other remote regions in March 1949, destroyed the resistance’s base and forced through collectivisation. In 1950 Estonia’s Eighth Plenum purged the leadership for “bourgeois nationalism”, while Russian-speaking immigration, industrialisation and the repression of the churches went on. After Stalin’s death in 1953 Beria’s nationality policy was reversed within three months.',
    },
    outcome: {
        ko: '1953년 파르티잔 지도부는 무너졌고, 마지막 지휘관 라마나우스카스는 1956년에 체포되었다. 1944~1955년의 추방자는 에스토니아 12만 4,000명, 라트비아 13만 6,000명, 리투아니아 24만 5,000명으로 모두 50만 명이 넘는다는 추정이 있다. 에스토니아와 라트비아의 민족 구성은 이주로 크게 바뀌었고, 서방의 병합 불승인은 발트 3국의 법적 연속성 원칙으로 남아 1991년의 독립 회복으로 이어졌다.',
        en: 'The partisan leadership was destroyed in 1953, and the last commander, Ramanauskas, was arrested in 1956. One estimate puts those deported in 1944–1955 at over half a million: 124,000 from Estonia, 136,000 from Latvia and 245,000 from Lithuania. Immigration transformed the ethnic make-up of Estonia and Latvia, and Western non-recognition of the annexation survived as the principle of the Baltic states’ legal continuity, carried through to the restoration of independence in 1991.',
    },
    sections,
    timeline: [
        ['1944.07.13', '빌뉴스 함락', 'Vilnius taken', '바그라티온 작전의 빌뉴스 공세 끝에 붉은군대가 빌뉴스를 점령했다.', 'The Red Army took Vilnius at the end of the Vilnius offensive of Operation Bagration.', ['soviet', 'germany', 'lithuania'], P(54.6872, 25.28, '빌뉴스', 'Vilnius')],
        ['1944.09.14', '발트 전략 공세', 'The Baltic offensive', '네 개 전선군이 11월 24일까지 독일 북부집단군을 몰아냈다.', 'Four fronts drove back Army Group North until 24 November.', ['soviet', 'germany', 'estonia', 'latvia', 'lithuania']],
        ['1944.09.22', '탈린 점령', 'Tallinn taken', '레닌그라드 전선군이 탈린에 들어왔고 울루오츠는 스웨덴으로 피신했다.', 'The Leningrad Front entered Tallinn; Uluots fled to Sweden.', ['soviet', 'estonia', 'sweden'], P(59.4372, 24.7453, '탈린', 'Tallinn')],
        ['1944.09.28', '카로탐 제1서기', 'Karotamm First Secretary', '에스토니아 공산당 전원회의가 카로탐을 제1서기로 뽑았다.', 'A plenum of the Estonian Communist Party elected Karotamm First Secretary.', 'estonia'],
        ['1944.10.13', '리가 점령', 'Riga taken', '제3발트 전선군이 리가를 점령했다.', 'The 3rd Baltic Front took Riga.', ['soviet', 'latvia'], P(56.9489, 24.1064, '리가', 'Riga')],
        ['1944.11.11', '에스토니아 뷰로', 'The Estonian Bureau', '중앙위원회가 에스토니아 당을 감독할 뷰로를 세웠다(1947년 6월 해체).', 'The Central Committee set up a bureau to supervise the Estonian party (dissolved June 1947).', ['soviet', 'estonia']],
        ['1945.05.10', '쿠를란트 항복', 'Courland surrenders', '독일 항복 이틀 뒤 쿠를란트 집단군이 항복했다.', 'Army Group Courland surrendered two days after Germany’s capitulation.', ['germany', 'soviet', 'latvia'], P(56.5117, 21.0139, '리에파야 (쿠를란트)', 'Liepāja (Courland)')],
        ['1945.07', '「사면」과 합법화', '“Amnesty” and legalisation', '1957년의 소련 보고에 따르면 리투아니아에서 3만 8,838명이 숲에서 나왔다.', 'According to a Soviet report of 1957, 38,838 people in Lithuania came out of the forests.', 'lithuania'],
        ['1945.12.15', '메르키네 습격', 'Attack on Merkinė', '라마나우스카스가 이끈 파르티잔이 메르키네를 공격해 소련 기록을 없앴다.', 'Partisans led by Ramanauskas attacked Merkinė and destroyed Soviet records.', 'lithuania', P(54.161, 24.183, '메르키네', 'Merkinė')],
        ['1946.11', '보리세비추스 처형', 'Borisevičius executed', '텔샤이 교구장 보리세비추스가 처형된 것으로 여겨진다.', 'Borisevičius, bishop of Telšiai, is believed to have been executed.', 'lithuania'],
        ['1947.05.21', '에스토니아 집단화 승인', 'Estonian collectivisation authorised', '전연방공산당 중앙위원회가 에스토니아 농업의 집단화를 승인했다.', 'The All-Union Party Central Committee authorised the collectivisation of Estonian agriculture.', ['soviet', 'estonia']],
        ['1948.05.22', '베스나 작전', 'Operation Vesna', '24일까지 약 4만~4만 9,000명이 리투아니아에서 추방되었다.', 'By the 24th some 40,000–49,000 people were deported from Lithuania.', ['soviet', 'lithuania'], P(56.0089, 92.8719, '크라스노야르스크', 'Krasnoyarsk')],
        ['1949.01.29', '결정 제390-138ss호', 'Decision No. 390-138ss', '소련 각료회의가 세 공화국의 추방 할당량을 정했다.', 'The USSR Council of Ministers set deportation quotas for the three republics.', ['soviet', 'estonia', 'latvia', 'lithuania']],
        ['1949.02.16', '2월 16일 선언', 'The Declaration of 16 February', '리투아니아 자유 전사 연합이 최고 정치·군사 권력임을 선포했다.', 'The Union of Lithuanian Freedom Fighters proclaimed itself the supreme political and military authority.', 'lithuania', P(55.631, 23.55, '미나이치아이', 'Minaičiai')],
        ['1949.03.25', '프리보이 작전', 'Operation Priboi', '28일까지 9만 명이 넘는 사람이 추방되었다.', 'More than 90,000 people were deported by the 28th.', ['soviet', 'estonia', 'latvia', 'lithuania']],
        ['1950.03.21', '에스토니아 제8차 전원회의', 'Estonia’s Eighth Plenum', '26일까지 이어진 전원회의에서 카로탐이 물러나고 캐빈이 제1서기가 되었다.', 'At the plenum, which lasted until the 26th, Karotamm was removed and Käbin became First Secretary.', 'estonia'],
        ['1951.09.04', '룩샤 사망', 'Lukša killed', '서방에서 돌아온 룩샤가 MGB에 살해되었다.', 'Lukša, back from the West, was killed by the MGB.', 'lithuania', P(54.824, 23.749, '파바르투피스', 'Pabartupis')],
        ['1951.10', '오센 작전', 'Operation Osen', '리투아니아에서 2만 명이 넘는 사람이 다시 추방되었다.', 'More than 20,000 more people were deported from Lithuania.', ['soviet', 'lithuania']],
        ['1952', '라마나우스카스의 지휘', 'Ramanauskas takes command', '제마이티스가 건강 때문에 물러나자 연합을 이끌며 무장 투쟁 중단을 명령했다.', 'Taking over the Union when Žemaitis stepped down for health reasons, he ordered an end to armed struggle.', 'lithuania'],
        ['1953.03', '스탈린 사망', 'Stalin dies', '베리야가 내무장관이 되었다.', 'Beria became Minister of Internal Affairs.', 'soviet'],
        ['1953.05.26', '리투아니아에 관한 결정', 'The decision on Lithuania', '중앙위원회 간부회가 베리야의 초안대로 토착 간부 등용을 서두르게 했다.', 'On Beria’s draft, the Central Committee Presidium ordered faster promotion of native cadres.', ['soviet', 'lithuania']],
        ['1953.05.30', '제마이티스 체포', 'Žemaitis arrested', '마비된 채 숨어 지내던 제마이티스가 체포되었다.', 'Žemaitis, paralysed and in hiding, was arrested.', ['soviet', 'lithuania']],
        ['1953.06.26', '베리야 체포', 'Beria arrested', '7월 전원회의가 그의 민족 결정을 철회했다.', 'The July plenum revoked his nationality decisions.', 'soviet'],
    ],
    locations: [
        ['빌뉴스', 'Vilnius', 54.6872, 25.28, 'main'],
        ['리가', 'Riga', 56.9489, 24.1064, 'place'],
        ['탈린', 'Tallinn', 59.4372, 24.7453, 'place'],
        ['리에파야 (쿠를란트)', 'Liepāja (Courland)', 56.5117, 21.0139, 'place'],
        ['미나이치아이', 'Minaičiai', 55.631, 23.55, 'place'],
        ['메르키네', 'Merkinė', 54.161, 24.183, 'place'],
        ['파바르투피스', 'Pabartupis', 54.824, 23.749, 'place'],
        ['크라스노야르스크', 'Krasnoyarsk', 56.0089, 92.8719, 'place'],
        ['모스크바', 'Moscow', 55.7558, 37.6173, 'place'],
    ],
    countries: ['lithuania', 'latvia', 'estonia', 'soviet', 'germany', 'sweden', 'finland', 'usa', 'uk'],
    relations: { related: ['baltic-german-occupation-1941-1944', 'baltic-soviet-occupation-1940-1941', 'great-patriotic-war', 'eastern-europe-peoples-democracies', 'baltic-independence'] },
    linkExpressions: [['ko', '발트 3국의 재점령'], ['en', 'Soviet reoccupation of the Baltic states']],
    focus: { ko: '소련의 발트 재점령과 전후 스탈린 체제', en: 'The Soviet reoccupation and postwar Stalinist rule in the Baltic states' },
    people: [
        ['stalin', 'leader', '소련 지도자', 'Soviet leader', '1949년 1월 세 공화국 지도자들의 보고를 받고 그날 정치국이 대규모 추방을 결정했으며, 1950년 에스토니아 숙청 때 카로탐의 해명 편지를 받았다.', 'Received the reports of the three republican leaders in January 1949, the day the Politburo decided on mass deportation, and in 1950 received Karotamm’s letter of self-justification.'],
        ['antanas-snieckus', 'leader', '리투아니아 공산당 제1서기', 'First Secretary of the Communist Party of Lithuania', '1944년 러시아에서 돌아와 리투아니아를 다스렸고, 붉은군대의 약탈에 항의했으며, 1949~1950년 옛 공산주의자 동지들을 박해에서 지켜 냈다.', 'Returned from Russia in 1944 to rule Lithuania, protested the Red Army’s looting, and in 1949–1950 shielded his old communist comrades from persecution.'],
        ['nikolai-karotamm', 'leader', '에스토니아 공산당 제1서기(1944–1950)', 'First Secretary of the Communist Party of Estonia, 1944–1950', '1944년 9월 제1서기가 되어 집단화와 1949년 추방을 이끌었으나, 1950년 제8차 전원회의에서 부르주아 민족주의자를 비호했다는 이유로 해임되었다.', 'Became First Secretary in September 1944 and led collectivisation and the 1949 deportation, but was removed at the Eighth Plenum of 1950 for allegedly shielding bourgeois nationalists.'],
        ['janis-kalnberzins', 'leader', '라트비아 공산당 제1서기', 'First Secretary of the Communist Party of Latvia', '1940년부터 1959년까지 라트비아 당을 이끌었고, 1951년 정교회 수도대주교 베니아민을 리가에서 물러나게 했다.', 'Led the Latvian party from 1940 to 1959 and in 1951 secured the removal of the Orthodox Metropolitan Veniamin from Riga.'],
        ['johannes-kabin', 'leader', '에스토니아 공산당 선전 비서, 1950년부터 제1서기', 'Estonian party propaganda secretary, First Secretary from 1950', '중앙위원회 조사단에 지도부의 부르주아 민족주의를 고발했고, 제8차 전원회의에서 카로탐을 대신해 제1서기가 되었으며 카로탐의 귀국을 막았다.', 'Denounced the leadership’s bourgeois nationalism to the Central Committee commission, replaced Karotamm as First Secretary at the Eighth Plenum and kept him from returning.'],
        ['vilis-lacis', 'participant', '라트비아 SSR 각료회의 의장', 'Chairman of the Latvian SSR Council of Ministers', '1940년부터 1959년까지 정부 수반이었으나 대체로 허수아비로 여겨졌고, 라트비아 숲의 형제들의 암살 표적이 되었다.', 'Head of government from 1940 to 1959 but regarded mostly as a figurehead; a target of assassination attempts by Latvian Forest Brothers.'],
        ['paleckis', 'participant', '리투아니아 SSR 최고소비에트 의장', 'Head of the Lithuanian SSR Supreme Council', '형식상 리투아니아 SSR의 최고 권위였지만 실권은 당 제1서기 스니에치쿠스에게 있었다.', 'Formally the supreme authority of the Lithuanian SSR, while real power lay with First Secretary Sniečkus.'],
        ['suslov', 'executor', '중앙위원회 리투아니아 뷰로 의장(1944–1946)', 'Chairman of the Central Committee’s Lithuanian Bureau, 1944–1946', '전후 리투아니아의 소비에트화를 감독했고, 1970년대 지하 출판물은 그가 리투아니아 민족주의자들의 추방과 살해에 책임이 있다고 고발했다.', 'Supervised the postwar Sovietisation of Lithuania; 1970s samizdat accused him of responsibility for the deportation and killing of Lithuanian nationalists.'],
        ['nikolai-shatalin', 'executor', '중앙위원회 에스토니아 뷰로 의장(1944–1946)', 'Chairman of the Central Committee’s Estonian Bureau, 1944–1946', '말렌코프의 측근으로 1944년 11월부터 1946년 3월까지 에스토니아 뷰로를 이끌며 에스토니아 당을 감독했다.', 'An associate of Malenkov, he chaired the Estonian Bureau from November 1944 to March 1946, supervising the Estonian party.'],
        ['beria', 'participant', '소련 부총리, 1953년 내무장관', 'Soviet deputy premier; Minister of Internal Affairs in 1953', '1944년 스니에치쿠스의 항의를 스탈린에게 전했고, 1953년 토착 간부 등용 결정을 밀어붙였으며 체포된 제마이티스를 직접 심문했다.', 'Passed Sniečkus’s 1944 complaint to Stalin; in 1953 pushed through the decisions promoting native cadres and personally interrogated the captured Žemaitis.'],
        ['abakumov', 'executor', '소련 국가보안장관', 'USSR Minister of State Security', '1949년 2월 28일 프리보이 작전을 준비하고 실행하는 MGB 명령 제0068호에 서명했다.', 'Signed MGB Order No. 0068 of 28 February 1949 for the preparation and execution of Operation Priboi.'],
        ['sergei-ogoltsov', 'executor', '소련 국가보안부 차관', 'USSR Deputy Minister of State Security', '프리보이 작전에서 MGB의 역할 전체를 맡았다.', 'Was in charge of the MGB’s overall role in Operation Priboi.'],
        ['sergey-kruglov', 'executor', '소련 내무장관', 'USSR Minister of Internal Affairs', '1944년 파르티잔 가족의 추방을 구상한 관리의 한 사람이었고, 1949년 5월 프리보이 작전의 추방자 구성을 스탈린에게 보고했다.', 'Was among the officials who proposed deporting partisans’ families in 1944, and in May 1949 reported to Stalin on the make-up of the Priboi deportees.'],
        ['panteleimon-ponomarenko', 'executor', '중앙위원회 서기, 에스토니아 조사위원장', 'Central Committee secretary; head of the Estonian investigation', '1950년 에스토니아 지도부 조사위원회를 이끌었고, 제8차 전원회의에서 중앙위원회를 대표해 고발 연설을 했다.', 'Headed the 1950 commission investigating the Estonian leadership and delivered the indictment on behalf of the Central Committee at the Eighth Plenum.'],
        ['ivan-bagramyan', 'participant', '제1발트 전선군 사령관', 'Commander of the 1st Baltic Front', '발트 전략 공세에서 제1발트 전선군을 지휘했다.', 'Commanded the 1st Baltic Front in the Baltic offensive.'],
        ['andrei-yeryomenko', 'participant', '제2발트 전선군 사령관', 'Commander of the 2nd Baltic Front', '발트 전략 공세에서 제2발트 전선군을 지휘했다.', 'Commanded the 2nd Baltic Front in the Baltic offensive.'],
        ['ivan-maslennikov', 'participant', '제3발트 전선군 사령관', 'Commander of the 3rd Baltic Front', '제3발트 전선군을 지휘해 1944년 10월 13일 리가를 점령했다.', 'Commanded the 3rd Baltic Front, which took Riga on 13 October 1944.'],
        ['leonid-govorov', 'participant', '레닌그라드 전선군 사령관', 'Commander of the Leningrad Front', '레닌그라드 전선군이 1944년 9월 탈린을 점령했고, 1945년 5월 쿠를란트 집단군 사령부의 항복을 받았다.', 'His Leningrad Front took Tallinn in September 1944, and in May 1945 the staff of Army Group Courland surrendered to him.'],
        ['adolf-hitler', 'participant', '독일 총통', 'German Führer', '쿠를란트에 갇힌 북부집단군을 철수시키자는 건의를 거부했다.', 'Refused advice to evacuate Army Group North from the Courland Pocket.'],
        ['heinz-guderian', 'participant', '독일 육군 참모총장', 'Chief of the German General Staff', '쿠를란트의 병력을 철수시켜 중부 유럽 전선에 쓰자고 건의했다.', 'Urged that the troops in Courland be evacuated to stabilise the front in Central Europe.'],
        ['juri-uluots', 'opponent', '에스토니아 대통령 직무대행', 'Acting President of Estonia', '1944년 9월 독일군이 물러나는 사이 헌정 정부가 탈린의 청사를 장악했으나, 레닌그라드 전선군이 수도를 점령하자 스웨덴으로 피신했다.', 'As the Germans withdrew in September 1944 the constitutional government seized the government buildings in Tallinn, but when the Leningrad Front took the capital he fled to Sweden.'],
        ['jonas-zemaitis', 'opponent', '리투아니아 자유 전사 연합 간부회 의장', 'Chairman of the Union of Lithuanian Freedom Fighters', '1949년 연합을 세워 파르티잔을 통합했고, 1953년 체포되어 베리야의 심문을 받은 뒤 1954년 처형되었다.', 'Founded the Union in 1949 and unified the partisans; arrested in 1953, interrogated by Beria and executed in 1954.'],
        ['adolfas-ramanauskas', 'opponent', '파르티잔 지휘관 「바나가스」, 1952년부터 연합 지도자', 'Partisan commander “Vanagas”, leader of the Union from 1952', '남부 리투아니아에서 부대를 이끌고 지하 신문을 펴냈으며, 1952년 연합을 이어받아 수동적 저항으로의 전환을 명령했다.', 'Led units and published underground newspapers in southern Lithuania, and on taking over the Union in 1952 ordered a turn to passive resistance.'],
        ['juozas-luksa', 'opponent', '파르티잔 지휘관, 서방 연락 담당', 'Partisan commander and envoy to the West', '1947년 철의 장막을 넘어 서방에 지원을 구했고, 돌아온 뒤 1951년 MGB에 살해되었다.', 'Crossed the Iron Curtain in 1947 to seek Western support and was killed by the MGB in 1951 after his return.'],
        ['vincentas-borisevicius', 'target', '텔샤이 교구장', 'Catholic bishop of Telšiai', '파르티잔 지원 등의 혐의로 체포되어 협력을 거부한 끝에 1946년 처형되었다.', 'Arrested on charges that included supporting the partisans, he refused to cooperate and was executed in 1946.'],
    ],
});

const people = require('./people-1944');

const terms = [
    term({
        id: 'forest-brothers', ko: '숲의 형제들', en: 'Forest Brothers', category: 'factions', period: '1944–1956', startYear: 1944, endYear: 1956,
        definition: ['제2차 세계대전 중과 그 뒤 소련의 점령에 맞서 숲을 근거지로 싸운 에스토니아·라트비아·리투아니아의 무장 파르티잔. 소련이 발트 3국을 다시 점령한 1944년부터 1956년 무렵까지 적어도 5만 명이 참여한 것으로 추정되며, 리투아니아에서 가장 조직적이었다.',
            'The Estonian, Latvian and Lithuanian armed partisans who fought the Soviet occupation from bases in the forests during and after World War II. At least 50,000 are estimated to have taken part between the Soviet reoccupation of 1944 and about 1956; the resistance was best organised in Lithuania.'],
        body: ['말 자체는 1905년 혁명 때 발트 지역에서 처음 쓰였고, 「숲의 형제들」이라는 이름은 에스토니아와 라트비아에서 주로 쓰였다. 리투아니아에서는 「초록 사람들」(žaliukai)이나 그냥 파르티잔이라 불렀다. 1941년 여름 독소전쟁이 시작될 때 에스토니아의 숲의 형제들은 퇴각하는 소련군과 싸웠다. 1944~1945년 소련이 다시 들어오자 붉은군대 징집을 피한 사람들, 독일 편에서 싸운 병사들, 해산된 리투아니아 지역방위군 대원들이 숲으로 들어갔다.\n\n추정 규모는 적어도 5만 명(에스토니아·라트비아 각 1만, 리투아니아 3만)이며, 다른 추정은 라트비아를 1만~1만 5,000명으로 본다. 리투아니아에서는 1949년 리투아니아 자유 전사 연합이 결성되었다. 숲의 형제들은 MGB와 섬멸대대의 진압, 1948~1949년의 대량 추방과 집단화, 정보기관의 침투로 1950년대 초 대부분 무너졌고, 1953년 스탈린 사후의 사면으로 많은 이가 무기를 내려놓았다. 이 전쟁의 사망자는 적어도 5만 명이다.',
            'The term was first used in the Baltic region in the 1905 revolution, and “Forest Brothers” was used mainly in Estonia and Latvia; in Lithuania the partisans were called žaliukai (“green ones”) or simply partisans. When the German-Soviet war began in the summer of 1941, Estonian Forest Brothers fought the retreating Soviet forces. When the Soviets returned in 1944–1945, men evading Red Army conscription, soldiers who had fought on the German side and members of the disbanded Lithuanian Territorial Defense Force went into the forests.\n\nEstimates put their number at no fewer than 50,000 (10,000 each in Estonia and Latvia and 30,000 in Lithuania), with other estimates giving 10,000–15,000 for Latvia. In Lithuania the Union of Lithuanian Freedom Fighters was founded in 1949. Suppression by the MGB and the destruction battalions, the mass deportations and collectivisation of 1948–1949 and infiltration by the intelligence services broke most of the resistance by the early 1950s, and many laid down their arms under the amnesty after Stalin’s death in 1953. The war cost at least 50,000 lives.'],
        aliases: { ko: ['숲의 형제', '숲의 수사', '발트 파르티잔'], en: ['Forest Brethren', 'Forest Brother', 'metsavennad', 'mežabrāļi', 'Brothers of the Wood', 'guerrilla war in the Baltic states'] },
        people: ['jonas-zemaitis', 'adolfas-ramanauskas', 'juozas-luksa'],
        events: ['baltic-sovietisation-1944-1953', 'baltic-independence'],
        sources: [S.guerrilla, S.koForest, S.litPartisans, S.latPartisans], locator: 'lead; Background; Summer war; Guerrilla war; Decline of the resistance movements',
    }),
    term({
        id: 'union-of-lithuanian-freedom-fighters', ko: '리투아니아 자유 전사 연합', en: 'Union of Lithuanian Freedom Fighters', category: 'factions', period: '1949–1953', startYear: 1949, endYear: 1953,
        definition: ['1949년 2월 리투아니아 파르티잔 지휘관들이 미나이치아이 마을에서 세운 무장 저항의 중앙 지휘 조직(LLKS). 요나스 제마이티스가 간부회 의장이었고, 2월 16일 스스로를 리투아니아의 최고 정치·군사 권력으로 선포했으나 1953년까지 소련 보안기관에 진압되었다.',
            'The central command of the Lithuanian armed resistance (LLKS), founded by the partisan commanders in the village of Minaičiai in February 1949. Chaired by Jonas Žemaitis, it proclaimed itself the supreme political and military authority in Lithuania on 16 February but was suppressed by the Soviet security agencies by 1953.'],
        body: ['리투아니아어 이름은 Lietuvos laisvės kovos sąjūdis로, 「리투아니아 자유 투쟁 운동」이라고도 옮긴다. 1949년 2월 프리시켈리마스 군관구 사령관의 벙커에서 열린 첫 전국 지휘관 회의에서 이름과 지도부, 강령, 규약, 계급장 등이 정해졌고 기관지도 창간되었다. 조직에는 다이나바, 타우라스, 비티스, 케스투티스 등 여러 군관구가 속했다.\n\n1918년 독립선언 31주년인 2월 16일 채택된 선언은 회복될 리투아니아가 모든 시민에게 평등한 권리를 보장하는 민주국가여야 한다고 하고 공산당을 범죄 조직으로 규정했다. 의장 제마이티스는 1953년 체포되어 1954년 처형되었고, 1952년 지휘를 이어받은 아돌파스 라마나우스카스는 무장 투쟁 중단을 명령했다. 독립 회복 뒤 리투아니아 의회는 선언을 공식 법령으로 인정했다.',
            'Its Lithuanian name is Lietuvos laisvės kovos sąjūdis, also translated as the Movement of the Struggle for the Freedom of Lithuania. At the first all-Lithuanian meeting of partisan commanders in February 1949, held in the bunker of the commander of the Prisikėlimas district, its name, leadership, programme, statute and insignia were adopted and a press organ founded. It embraced the Dainava, Tauras, Vytis, Kęstutis and other partisan districts.\n\nThe declaration adopted on 16 February, the 31st anniversary of the 1918 Act of Independence, stated that the restored Lithuania should be a democratic state granting equal rights to every citizen and declared the Communist Party a criminal organisation. Its chairman Žemaitis was arrested in 1953 and executed in 1954, and Adolfas Ramanauskas, who took over in 1952, ordered an end to armed struggle. After independence was restored the Lithuanian parliament recognised the declaration as an official act.'],
        aliases: { ko: ['LLKS', '리투아니아 자유 투쟁 운동', '리투아니아 자유투쟁운동'], en: ['LLKS', 'Lietuvos laisvės kovos sąjūdis', 'Movement of the Struggle for the Freedom of Lithuania', 'Movement for the Struggle for Lithuanian Freedom'] },
        people: ['jonas-zemaitis', 'adolfas-ramanauskas', 'juozas-luksa'],
        events: ['baltic-sovietisation-1944-1953'],
        sources: [S.llks, S.ltLLKS, S.litPartisans, S.ramanauskas], locator: 'lead; Pokario metais; Decline: 1949–1953; 1949–1952',
    }),
    term({
        id: 'destruction-battalions', ko: '섬멸대대 (NKVD)', en: 'Destruction battalions (NKVD)', category: 'repression', period: '1941–1954', startYear: 1941, endYear: 1954,
        definition: ['1941년 독일의 침공 직후 NKVD 아래 만들어져 소련이 점령한 발트 3국과 서부 지역에서 탄압과 치안을 맡은 준군사 부대. 1944년 이후 다시 조직되어 숲의 형제들과 그 지지자를 진압하는 보조 전력이 되었고, 1954년 해체되었다.',
            'Paramilitary units created under the NKVD right after the German invasion of 1941 for repression and internal security in the Soviet-occupied Baltic states and the western Soviet Union. Restored after 1944 as an auxiliary force against the Forest Brothers and their supporters, they were dissolved in 1954.'],
        body: ['러시아어로 「이스트레비텔리」(파괴자)라 불렸고, 리투아니아인은 이를 줄여 「스트리바이」라 했다. 1941년에는 붉은군대 후방의 안전을 지키고 옮길 수 없는 재산을 파괴하는 초토화 임무를 맡아 의심스러운 사람을 즉결 처형할 권한을 받았으며, 에스토니아에서는 이 해에 1,850명을 살해했다.\n\n독일군이 물러난 뒤 현지 지원자로 다시 만들어진 대대는 1945~1946년 「인민 방위」로 이름을 바꾸었다. 숲의 형제들의 실제·잠재적 지지자를 위협하고 매복과 수색에 나섰으며, 농민에게 벌목·토탄 채굴·도로 공사 의무를 강요하는 등 농촌에서 소비에트 정책을 집행했다. 에스토니아에서는 공산당 제1서기 니콜라이 카로탐이 섬멸대대 중앙참모부를 이끌었다. 1949년 3월 프리보이 작전의 작전조에도 섬멸대대원이 둘씩 들어갔다. 에스토니아 의회는 2002년 이를 범죄 조직으로 규정했다.',
            'Called istrebiteli (“destroyers”) in Russian, they were known to Lithuanians as stribai. In 1941 they secured the Red Army’s rear and destroyed property that could not be evacuated under the scorched-earth policy, with authority to execute suspicious persons summarily; in Estonia they murdered 1,850 people that year.\n\nRe-formed from local volunteers after the German retreat, the battalions were renamed “people’s defence” in 1945–1946. They terrorised actual and potential supporters of the Forest Brothers, joined ambushes and search patrols, and enforced Soviet policy in the countryside, for instance by forcing farmers to fulfil forestry, peat-cutting and road-building obligations. In Estonia the party’s First Secretary, Nikolai Karotamm, headed their central staff. Each operative team in Operation Priboi in March 1949 included two destruction battalion members. In 2002 the Estonian parliament declared the battalions a criminal organisation.'],
        aliases: { ko: ['섬멸대대', '구축대대', '이스트레비텔리', '스트리바이'], en: ['destruction battalions', 'extermination battalions', 'istrebiteli', 'stribai', 'istrebki'] },
        people: ['nikolai-karotamm'],
        events: ['baltic-sovietisation-1944-1953'],
        sources: [S.destruction, S.litPartisans, S.etKarotamm, S.priboi], locator: 'lead; Authority; Estonia; Post-war activities; Legal appraisal',
    }),
    term({
        id: 'eighth-plenum-estonian-communist-party-1950', ko: '에스토니아 공산당 제8차 전원회의 (1950)', en: 'Eighth Plenum of the Estonian Communist Party (1950)', category: 'party-state',
        period: '1950', startYear: 1950, endYear: 1950,
        definition: ['1950년 3월 21~26일 탈린에서 열린 에스토니아 공산당(볼셰비키) 중앙위원회 전원회의. 지도부가 부르주아 민족주의와의 싸움에 소홀했다는 모스크바의 결정에 따라 제1서기 니콜라이 카로탐을 요한네스 캐빈으로 바꾸었고, 작가·예술가·지식인을 「부르주아 민족주의자」로 몰아 숙청하는 계기가 되었다.',
            'The plenum of the Central Committee of the Communist Party (Bolsheviks) of Estonia held in Tallinn on 21–26 March 1950. Following a Moscow decision that the leadership had neglected the struggle against bourgeois nationalism, it replaced First Secretary Nikolai Karotamm with Johannes Käbin and opened a purge of writers, artists and intellectuals branded “bourgeois nationalists”.'],
        body: ['에스토니아에서는 「3월 전원회의」(Märtsipleenum)라고 부른다. 1949년 스탈린이 지방 지도부를 다잡는 새 숙청에 나선 가운데, 레닌그라드 사건의 여파로 레닌그라드 당과 가깝다고 여겨진 에스토니아 지도부가 표적이 되었다. 한 개인의 투서로 시작된 중앙위원회 조사는 카로탐이 옛 부르주아 간부에 기대고 쿨라크를 비호한다고 결론지었고, 1950년 3월 7일 정치국이 「에스토니아 당 중앙위원회 사업의 오류와 결함」 결정을 승인했다.\n\n전원회의에서는 판텔레이몬 포노마렌코가 중앙위원회를 대표해 고발 연설을 했다. 곧이어 니골 안드레센, 한스 크루스, 헨드리크 알리크 등이 체포되었고, 과학아카데미에서는 한 해 동안 100명 넘게 해고되었으며 타르투 대학에서는 교수진 약 200명이 고발되고 학생 약 100명이 제적되었다. 각료회의 의장 아르놀트 베이메르는 1951년 3월 해임되었다. 캐빈은 1978년까지 당을 이끌었다.',
            'In Estonia it is known as the March Plenum (Märtsipleenum). As Stalin opened a new purge to discipline local leaderships in 1949, the Estonian leadership, considered close to the Leningrad party, became a target in the wake of the Leningrad Affair. A Central Committee investigation set off by one individual’s complaints concluded that Karotamm relied on old bourgeois cadres and defended kulaks, and on 7 March 1950 the Politburo approved the decision “On errors and shortcomings in the work of the Central Committee of the Estonian party”.\n\nAt the plenum Panteleimon Ponomarenko delivered the indictment on behalf of the Central Committee. Nigol Andresen, Hans Kruus, Hendrik Allik and others were arrested soon afterwards, more than a hundred people were dismissed from the Academy of Sciences within a year, and at Tartu University about 200 teaching staff were accused and nearly 100 students expelled. Arnold Veimer, chairman of the Council of Ministers, was removed in March 1951. Käbin led the party until 1978.'],
        aliases: { ko: ['에스토니아 공산당 제8차 전원회의', '에스토니아 제8차 전원회의', '에스토니아 3월 전원회의'], en: ['Eighth Plenum of the Estonian Communist Party', 'March Plenum (Estonia)', 'Märtsipleenum', '8th Plenum of the Estonian Communist Party'] },
        people: ['nikolai-karotamm', 'johannes-kabin', 'panteleimon-ponomarenko'],
        events: ['baltic-sovietisation-1944-1953'],
        sources: [S.martsi, S.etKarotamm, S.kabin, S.cpe], locator: 'lead; Pleenumi eel; Pleenumi ja pleenumijärgsed otsused',
    }),
    term({
        id: 'operation-vesna', ko: '베스나 작전', en: 'Operation Vesna', category: 'repression', period: '1948', startYear: 1948, endYear: 1948,
        definition: ['1948년 5월 22~24일 소련 국가보안부(MGB)가 리투아니아에서 숲의 형제들과 그 가족, 조력자를 추방한 작전. 공식 집계 4만 9,331명(다른 수치 3만 9,766명·4만 7,534명)으로 리투아니아에서 가장 큰 소련의 추방이었다.',
            'The deportation of Forest Brothers, their families and helpers from Lithuania carried out by the Soviet Ministry of State Security (MGB) on 22–24 May 1948. With an official tally of 49,331 (other figures 39,766 and 47,534), it was the largest Soviet deportation from Lithuania.'],
        body: ['「베스나」는 러시아어로 봄이라는 뜻이다. 1948년 2월 21일 소련 각료회의 결정 제417-160ss호는 「숲의 형제들」과 그 가족, 「쿨라크」를 포함한 반소 파르티잔의 조력자를 추방 대상으로 정했다. 리투아니아인 외에 폴란드인과 벨라루스인도 추방되었다. 추방자는 이동이 엄격히 제한된 특별이주민 신분이 되었다.\n\n추방자는 주로 크라스노야르스크 지방(2만 3,467명), 이르쿠츠크주(1만 1,495명), 부랴트몽골 ASSR(4,038명)로 보내졌고, 약 2만 5,000명이 임업에, 나머지는 탄광과 콜호스에서 일했다. 어린이 약 1만 1,000명이 부모와 함께 추방되었다. 이가르카에서는 첫 몇 해 동안 리투아니아인 1,000~3,000명이 죽었고, 그곳의 리투아니아인 대부분은 1956~1961년에 돌아왔다.',
            '“Vesna” is Russian for spring. Decree No. 417-160ss of the USSR Council of Ministers of 21 February 1948 targeted the “forest brothers”, their families and “various helpers of anti-Soviet partisans, including kulaks”. Poles and Belarusians were deported as well as Lithuanians. The deportees became special settlers, severely restricted in movement.\n\nMost were sent to Krasnoyarsk Krai (23,467), Irkutsk Oblast (11,495) and the Buryat-Mongolian ASSR (4,038); about 25,000 worked in the forest industry and the rest in coal mines and kolkhozes. Some 11,000 children were deported with their parents. In Igarka 1,000–3,000 Lithuanians died in the first years, and most of the Lithuanians there returned between 1956 and 1961.'],
        aliases: { ko: ['봄 작전 (1948)', '오페라치야 베스나'], en: ['Operation Spring (1948)', 'Operatsiya Vesna', 'Operation Vesna (1948)'] },
        people: [],
        events: ['baltic-sovietisation-1944-1953'],
        sources: [S.vesna, S.deportLt, S.litSSR], locator: 'lead; Life in exile',
    }),
];

module.exports = { event, people, terms };
