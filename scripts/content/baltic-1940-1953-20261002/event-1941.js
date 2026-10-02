// The Baltic states under German occupation, June 1941 – November 1944
// (Baltic 1940–1953 batch, 2026-10-02). Exports { event, people, terms } built
// with ./lib.js. Person cards live in ./people-1941.js.
const { W, P, event: buildEvent, term } = require('./lib');

const E = t => W(encodeURI(t));
const ET = t => 'https://et.wikipedia.org/wiki/' + encodeURI(t);
const US = slug => 'https://encyclopedia.ushmm.org/content/en/article/' + slug;
const S = {
    juneUprising: E('June_Uprising_in_Lithuania'),
    provGov: E('Provisional_Government_of_Lithuania'),
    ltOcc: E('German_occupation_of_Lithuania_during_World_War_II'),
    lvOcc: E('German_occupation_of_Latvia_during_World_War_II'),
    eeOcc: E('German_occupation_of_Estonia_during_World_War_II'),
    summerWar: E('Summer_War'),
    omakaitse: E('Omakaitse'),
    ostland: E('Reichskommissariat_Ostland'),
    lohse: E('Hinrich_Lohse'),
    rosenberg: E('Alfred_Rosenberg'),
    uluots: E('Jüri_Uluots'),
    mae: E('Hjalmar_Mäe'),
    deMae: 'https://de.wikipedia.org/wiki/' + encodeURI('Hjalmar_Mäe'),
    lvLipke: 'https://lv.wikipedia.org/wiki/' + encodeURI('Žanis_Lipke'),
    holoLt: E('The_Holocaust_in_Lithuania'),
    holoLv: E('The_Holocaust_in_Latvia'),
    holoEe: E('The_Holocaust_in_Estonia'),
    kaunas: E('Kaunas_pogrom'),
    stahlecker: E('Walter_Stahlecker'),
    ninth: E('Ninth_Fort'),
    kovno: E('Kovno_Ghetto'),
    ponary: E('Ponary_massacre'),
    yb: E('Ypatingasis_būrys'),
    rumbula: E('Rumbula_massacre'),
    rigaGhetto: E('Riga_Ghetto'),
    jagerReport: E('Jäger_Report'),
    arajsK: E('Arajs_Kommando'),
    vilna: E('Vilna_Ghetto'),
    fpo: E('Fareynikte_Partizaner_Organizatsye'),
    siauliai: E('Šiauliai_Ghetto'),
    kaiserwald: E('Kaiserwald_concentration_camp'),
    vaivara: E('Vaivara_concentration_camp'),
    salaspils: E('Salaspils_concentration_camp'),
    klooga: E('Klooga_concentration_camp'),
    lipke: E('Žanis_Lipke'),
    latLegion: E('Latvian_Legion'),
    estLegion: E('Estonian_Legion'),
    ltdf: E('Lithuanian_Territorial_Defense_Force'),
    partisans: E('Soviet_partisans'),
    narva: E('Battle_of_Narva_(1944)'),
    tannenberg: E('Battle_of_Tannenberg_Line'),
    balticOff: E('Baltic_offensive'),
    courland: E('Courland_Pocket'),
    tallinnOff: E('Tallinn_offensive'),
    tief: E('Otto_Tief'),
    etFlight: ET('Suur_põgenemine'),
    usLt: US('lithuania'),
    usLv: US('latvia'),
    usEe: US('estonia'),
    usEinsatz: US('einsatzgruppen'),
    usKovno: US('kovno'),
    usVilna: US('vilna'),
    usRiga: US('riga'),
};

const sections = [
    {
        heading: { ko: '6월 봉기와 「여름 전쟁」 (1941년 6–8월)', en: 'The June Uprising and the Summer War (June–August 1941)' },
        paragraphs: [
            {
                ko: '1941년 6월 22일 새벽 독일군 북부집단군과 중부집단군이 소비에트 리투아니아로 밀고 들어왔다. 불과 한 주 전 약 1만 7,000명이 시베리아로 강제 이송된 일은 봉기에 대한 지지와 독일군에 대한 호감을 키운 가장 큰 계기였다. 1940년 가을 베를린에서 카지스 시키르파가 세운 리투아니아 행동주의 전선은 이날 준비해 온 봉기를 일으켰고, 6월 23일 아침 카우나스 방송국에서 레오나스 프라푸올레니스가 독립 선언과 임시정부 각료 명단을 읽었다. 봉기군은 독일군이 오기 전에 카우나스와 빌뉴스를 장악했고, 한 주 만에 리투아니아 전역에서 붉은군대가 물러났다. 1990년 이후 역사가들은 망명 사회가 9만 명 이상이라고 부풀린 참가자를 1만 6,000~2만 명, 사상자를 약 600명으로 고쳐 잡았다. 퇴각하던 내무인민위원부는 라이니아이·프라비에니슈케스 등지에서 수감자들을 학살했다.',
                en: 'Before dawn on 22 June 1941 the German Army Groups North and Centre drove into Soviet Lithuania. The deportation of some 17,000 people to Siberia only a week earlier was the single most important event that rallied support for an uprising and goodwill towards the invaders. The Lithuanian Activist Front, founded in Berlin by Kazys Škirpa in the autumn of 1940, launched the revolt it had been preparing, and on the morning of 23 June Leonas Prapuolenis read the declaration of independence and the list of the provisional government over Kaunas radio. The insurgents took Kaunas and Vilnius before the Wehrmacht arrived, and within a week the Red Army was gone from the whole country. After 1990 historians revised the émigré figures of 90,000 or more participants down to 16,000–20,000, with some 600 dead. The retreating NKVD massacred prisoners at Rainiai, Pravieniškės and elsewhere.',
                sources: [S.juneUprising, S.ltOcc],
            },
            {
                ko: '베를린에서 가택연금된 시키르파 대신 유오자스 암브라제비추스가 총리 대행을 맡은 임시정부는 6주 동안 국유화된 토지와 기업을 되돌리는 법령 등 100여 개를 냈다. 독일은 정부를 승인하지 않았지만 무력으로 해산하지도 않았고, 7월 17일 민정 기구를 세운 뒤 신문과 방송에 법령을 싣지 못하게 하는 식으로 권한을 빼앗았다. 정부는 꼭두각시가 되기를 거부하고 독일의 권한 찬탈에 항의하는 문서에 서명한 뒤 8월 5일 스스로 해산했고, 행동주의 전선도 9월에 금지되었다. 그러나 이 정부는 8월 1일의 「유대인 지위 규정」 같은 반유대 법령으로 비판받으며, 정부가 만든 국민노동방위대대(TDA)는 곧 독일 특무부대에 동원되어 카우나스 요새에서 유대인을 총살했다.',
                en: 'With Škirpa under house arrest in Berlin, Juozas Ambrazevičius became acting prime minister of a government that issued over 100 laws in six weeks, among them decrees returning nationalised land and enterprises. The Germans did not recognise it but did not dissolve it by force either; after setting up their civil administration on 17 July they stripped its powers step by step, for instance by barring its decrees from the newspapers and the radio. Refusing to become a puppet, the government signed a protest against the Germans’ usurpation of its powers and disbanded itself on 5 August; the Activist Front was banned in September. The government has been criticised for antisemitic decrees such as the Regulations on the Status of Jews of 1 August, and its National Labour Defence Battalion (TDA) was soon employed by German commandos to shoot Jews at the forts of Kaunas.',
                sources: [S.juneUprising, S.provGov, S.ltOcc],
            },
            {
                ko: '라트비아 점령은 7월 10일 끝났다. 독일군이 가장 늦게 닿은 에스토니아에서는 7월 3일 이오시프 스탈린이 초토화를 지시한 뒤 소련 섬멸대대가 마을을 불태우고 주민을 죽였고, 숲으로 들어간 「숲의 형제들」이 이들과 싸웠다. 숲의 형제들의 규모는 문헌에 따라 약 1만 2,000명에서 5만 명까지로 적힌다. 7월 3일 킬링기뇌메에서 처음 조직된 향토방위대(오마카이트세)는 쿠르크 소령의 지휘로 2주 동안의 전투 끝에 소련군을 타르투에서 몰아냈고, 에스토니아·독일군은 8월 17일 나르바, 8월 28일 탈린을 점령했다. 마지막 헌법상 총리였던 위리 울루오츠는 7월 29일 독일군에 독립 정부 수립을 청했다가 거절당했고, 자치행정을 맡아 달라는 제안도 거부했다. 독일군은 무장 집단을 해산시키고 에스토니아 국기를 독일 국기로 바꾸었다.',
                en: 'The occupation of Latvia was complete on 10 July. In Estonia, the last to be reached, Soviet destruction battalions burned villages and killed civilians after Joseph Stalin’s call of 3 July for scorched earth, and Forest Brothers who had taken to the woods fought them; their strength is given as anywhere from about 12,000 to 50,000. The Omakaitse (Home Guard), first organised at Kilingi-Nõmme on 3 July, drove the Soviets out of Tartu after two weeks of fighting under Major Friedrich Kurg, and Estonian and German forces took Narva on 17 August and Tallinn on 28 August. Jüri Uluots, the last constitutional prime minister, asked the Germans on 29 July to let him form an independent government and was refused, and he declined their offer to head a self-administration. The Germans disarmed the partisan groups and replaced the Estonian flag with the German one.',
                sources: [S.lvOcc, S.eeOcc, S.summerWar, S.omakaitse, S.uluots],
            },
        ],
    },
    {
        heading: { ko: '오스트란트 국가판무관부와 「자치행정」', en: 'Reichskommissariat Ostland and the self-administrations' },
        paragraphs: [
            {
                ko: '1941년 7월 17일 히틀러의 포고로 동부 점령지 장관에 레발(탈린) 태생의 발트 독일인 알프레트 로젠베르크가 임명되었고, 그 아래 발트 3국과 벨라루스 서부를 묶은 오스트란트 국가판무관부가 세워졌다. 7월 25일 국가판무관에 임명된 힌리히 로제는 슐레스비히홀슈타인 대관구장 자리를 유지한 채 리가와 킬을 오갔다. 판무관부는 에스토니아(총판무관 카를지크문트 리츠만), 라트비아(오토하인리히 드레흐슬러), 리투아니아(테오도어 아드리안 폰 렌텔른), 백루테니아(빌헬름 쿠베)의 네 총관구로 나뉘었다. 그러나 군사와 치안은 국방군과 친위대가, 노동력과 경제는 다른 중앙 기관이 쥐었고, 친위대는 민정이 들어서기 전의 공백기에 치안 권한을 먼저 차지했다.',
                en: 'A decree of Hitler’s on 17 July 1941 made Alfred Rosenberg, a Baltic German born in Reval (Tallinn), minister for the occupied eastern territories, and under him Reichskommissariat Ostland was formed from the Baltic states and western Belarus. Hinrich Lohse, appointed Reichskommissar on 25 July, kept his post as Gauleiter of Schleswig-Holstein and shuttled between Riga and Kiel. The Reichskommissariat was divided into four general districts: Estonia under Generalkommissar Karl-Siegmund Litzmann, Latvia under Otto-Heinrich Drechsler, Lithuania under Theodor Adrian von Renteln and White Ruthenia under Wilhelm Kube. But the Wehrmacht and the SS controlled military and security matters and other central agencies controlled labour and the economy, and the SS seized police powers in the vacuum before the civil administration arrived.',
                sources: [S.ostland, S.rosenberg, S.lohse],
            },
            {
                ko: '나치의 동부 종합 계획에서 발트 지역은 독일화된 보호령을 거쳐 독일에 합쳐질 땅이었다. 로젠베르크는 1941년 4월 「인종적으로 적합한」 주민의 독일화, 게르만인 식민, 바람직하지 않은 주민의 추방을 구상했고, 에스토니아인은 이미 50% 독일화된 「가장 게르만적인」 민족이라 보았다. 계획에는 에스토니아인과 라트비아인의 절반을 「제거」하는 내용이 들어 있었고, 에스토니아를 「파이푸스란트」, 라트비아를 「뒤나란트」로 부르자는 제안도 나왔다. 로제는 1941년 11월 15일 소련 국가·당 재산을 몰수했고, 판무관부는 소련이 국유화한 농지와 작은 기업을 옛 주인에게 돌려주었지만 유대인 재산은 몰수했다.',
                en: 'Under the Nazi Generalplan Ost the Baltic lands were to become a Germanised protectorate and then part of Germany. In April 1941 Rosenberg envisaged the Germanisation of “racially suitable” elements, colonisation by Germanic settlers and the removal of undesirables, and he considered the Estonians “the most Germanic” of the Baltic peoples, already 50 per cent Germanised. The plan called for the “removal” of half of the Estonians and Latvians, and there were proposals to call Estonia “Peipusland” and Latvia “Dünaland”. Lohse confiscated Soviet state and party property on 15 November 1941; the administration returned nationalised farmland and small businesses to their former owners but confiscated Jewish property.',
                sources: [S.eeOcc, S.ostland, S.lvOcc],
            },
            {
                ko: '독일은 각국에 현지인 자치기구를 두었다. 에스토니아에서는 1930년대 파시스트 성향의 해방전쟁참전자동맹(밥스) 활동으로 투옥되었다가 독일로 건너갔던 햘마르 매에가 독일군과 함께 돌아와 「에스토니아 자치행정」의 수장이 되었고, 라트비아에서는 독일계 혈통이 절반인 장군 오스카르스 단케르스, 리투아니아에서는 첫째 총고문 페트라스 쿠빌리우나스가 비슷한 역할을 맡았다. 에스토니아의 국제 조사위원회는 자치행정이 독일 정책의 틀 안에서 상당한 자율을 누렸다고 보았다. 리투아니아의 총고문들은 독일이 인기 없는 결정의 책임을 떠넘기는 거수기에 가까웠고, 독일 정책에 항의한 네 명은 슈투트호프 수용소로 보내졌다. 그래도 리투아니아인 하급 관리들은 무장친위대 사단 편성과 독일 강제노동 할당을 방해하기도 했다.',
                en: 'The Germans set up native self-administrations. In Estonia Hjalmar Mäe, who had been imprisoned in the 1930s for his part in the fascist-leaning Vaps movement and had gone to Germany, returned with the German army to head the Estonian Self-Administration; in Latvia the half-German General Oskars Dankers and in Lithuania the First General Adviser Petras Kubiliūnas played similar roles. The Estonian International Commission found that the Estonian directorate exercised a significant measure of autonomy within the framework of German policy. Lithuania’s General Advisers were largely a rubber stamp that the Germans used as scapegoats for unpopular decisions, and four who protested against German policies were deported to the Stutthof concentration camp. Even so, Lithuanian local officials helped obstruct the raising of a Waffen-SS division and the forced-labour quotas for Germany.',
                sources: [S.eeOcc, S.ostland, S.rigaGhetto, S.ltOcc, S.mae, S.deMae, S.ltdf],
            },
        ],
    },
    {
        heading: { ko: '「자기 정화」: 학살의 시작 (1941년 6–7월)', en: '“Self-cleansing”: the killings begin (June–July 1941)' },
        paragraphs: [
            {
                ko: '친위대 보안경찰·정보부(SD)의 특수작전집단 가운데 발터 슈탈레커가 이끈 A집단이 북부집단군을 따라 발트 3국에 들어왔다. 첫 학살은 6월 22일 국경 마을 가르그주다이에서 유대인 약 200명을 쏜 것이었다. 슈탈레커는 6월 25일 카우나스에 와서 반유대 연설을 했고, 리투아니아인들이 선뜻 나서지 않자 알기르다스 클리마이티스의 부대에 포그롬을 시켰다. 6월 25~29일의 카우나스 포그롬에서 27일 리에투키스 차고에서는 수십 명의 유대인 남성이 군중 앞에서 쇠막대에 맞아 죽었다. 희생자 수는 슈탈레커의 보고(카우나스 3,800명, 주변 1,200명)부터 1,500~3,800명까지 문헌마다 다르고, 슈탈레커의 수치는 부풀려졌다는 의심을 받는다. 그는 10월 15일 보고에서 「해방된 주민이 스스로」 공산주의자와 유대인이라는 적에게 가장 가혹한 조치를 한 것처럼 보이게 했고 독일의 지시는 밖에서 알아챌 수 없었다고 썼다.',
                en: 'Of the Einsatzgruppen of the SS Security Police and SD, Einsatzgruppe A under Walter Stahlecker followed Army Group North into the Baltic states. Its first massacre, at the border town of Gargždai on 22 June, killed some 200 Jews. Stahlecker came to Kaunas on 25 June and made antisemitic speeches, and when local Lithuanians proved unenthusiastic he had the unit of Algirdas Klimaitis start a pogrom. In the Kaunas pogrom of 25–29 June, several dozen Jewish men were beaten to death with a metal bar before a crowd at the Lietūkis garage on the 27th. Figures range from Stahlecker’s report of 3,800 dead in Kaunas and 1,200 in nearby towns to 1,500–3,800 in other sources, and Stahlecker is suspected of exaggerating. In his report of 15 October he wrote that it had been made to look as though “the liberated populations themselves” took the most severe measures against their Communist and Jewish enemies, so that German direction could not be found out.',
                sources: [S.holoLt, S.kaunas, S.stahlecker, S.usEinsatz],
            },
            {
                ko: '라트비아에서는 6월 23~24일 밤 그로비냐 묘지에서 첫 살해가 있었다. 7월 1일 슈탈레커를 만난 전직 경찰 빅토르스 아라이스는 대학생 단체와 극우 「뇌성십자」 출신을 모아 이른바 아라이스 특공대를 꾸렸고, 슈탈레커는 이 부대에 자발적으로 보이는 포그롬을 일으키라고 지시했다. 7월 4일 리가의 회당들이 불탔고 안에 갇힌 유대인들이 산 채로 타 죽었다. 이날은 오늘날 라트비아의 홀로코스트 추모일이다. 7월 리가 비케르니에키 숲에서 약 4,000명이 살해되었고, 리에파야와 다우가프필스, 레제크네의 유대인들도 독일 친위대 정보부(SD)와 라트비아 자위대·보조경찰의 손에 죽었다. 나치는 현지인에게 학살 책임을 돌리려 했으나 슈탈레커 스스로 라트비아에서는 「자기 정화」 선동이 실패했다고 인정했다.',
                en: 'In Latvia the first killings took place in the Grobiņa cemetery on the night of 23–24 June. On 1 July the former policeman Viktors Arājs met Stahlecker and assembled a unit from student fraternities and the far-right Pērkonkrusts — the Arajs Kommando — which Stahlecker told to unleash a pogrom that looked spontaneous. On 4 July Riga’s synagogues were set on fire with Jews trapped inside; the date is now Latvia’s Holocaust Memorial Day. In July some 4,000 Jews were murdered in the Biķernieki forest outside Riga, and the Jews of Liepāja, Daugavpils and Rēzekne died at the hands of the German SD and Latvian Selbstschutz and auxiliary police. The Nazis tried to make the local population appear responsible, but Stahlecker himself acknowledged that the incitement to “self-cleansing actions” had failed in Latvia.',
                sources: [S.holoLv, S.arajsK, S.rumbula],
            },
            {
                ko: '에스토니아에서는 마르틴 잔트베르거의 특수부대 1a가 향토방위대와 현지 경찰의 도움을 받아 7월부터 유대인과 로마인, 공산주의자로 지목된 사람들을 잡아 죽였다. 1939년 약 4,500명이던 에스토니아 유대인은 대부분 소련 지배기와 전쟁 초기에 나라를 떠났고, 남은 950~1,000명(잔트베르거 921명, 슈탈레커 963명 등)은 거의 모두 1941년 말까지 살해되었다. 전쟁을 국내에서 살아남은 에스토니아 유대인은 12명이 채 안 된다. 1942년 1월 반제 회의에서 에스토니아는 이미 「유대인 없는 땅」으로 보고되었다. 점령 당국은 이와 별도로 공산주의자나 그 동조자라는 이유로 에스토니아인 약 6,000명과 러시아인 약 1,000명을 죽였다.',
                en: 'In Estonia Martin Sandberger’s Sonderkommando 1a, helped by the Omakaitse and local police, began rounding up and killing Jews, Roma and alleged Communists in July. Most of Estonia’s roughly 4,500 Jews of 1939 had left during Soviet rule and the first weeks of the war, and the 950–1,000 who remained (921 by Sandberger’s count, 963 by Stahlecker’s) were almost all killed by the end of 1941; fewer than a dozen Estonian Jews are known to have survived the war in the country. At the Wannsee Conference of January 1942 Estonia was already reported “judenfrei”. Separately, the occupiers killed some 6,000 ethnic Estonians and 1,000 Russians as alleged Communists or Communist sympathisers.',
                sources: [S.holoEe, S.eeOcc, S.usEe, S.summerWar],
            },
        ],
    },
    {
        heading: { ko: '제9요새, 포나리, 룸불라 (1941년 7–12월)', en: 'The Ninth Fort, Ponary and Rumbula (July–December 1941)' },
        paragraphs: [
            {
                ko: '리투아니아에서는 다른 점령지처럼 권리 박탈과 게토 수용을 거쳐 수용소로 보내는 단계 없이, 전쟁 첫날부터 유대인을 집 근처 구덩이에서 총살했다. 카를 예거의 특무부대 3과 요아힘 하만의 기동 살해대가 리투아니아 경찰대대와 함께 시골 마을을 돌았고, 8월 말까지 시골의 유대인 대부분이 살해되었다. 카우나스 근교 제9요새에서는 10월 28일 게토 광장에서 9,200여 명(어린이 약 4,300명)을 골라 이튿날 총살한 「대작전」 등으로, 문헌에 따라 3만 명 이상(현장 추모비)에서 4만 5,000~5만 명이 살해되었다. 미국 홀로코스트 기념관에 따르면 카우나스 게토에 갇혔던 약 3만 명 가운데 전쟁에서 살아남은 이는 약 2,500명이다.',
                en: 'In Lithuania there was no gradual sequence of stripping rights, ghettoisation and deportation to camps, as elsewhere: from the first days of the war Jews were shot in pits near their homes. Karl Jäger’s Einsatzkommando 3 and Joachim Hamann’s mobile killing squad swept the countryside with Lithuanian police battalions, and by the end of August most rural Jews had been shot. At the Ninth Fort outside Kaunas, where on 28 October more than 9,200 people, nearly 4,300 of them children, were selected in the ghetto square and shot the next morning in the “Great Action”, the dead numbered more than 30,000 according to the memorial on the site and 45,000–50,000 according to other accounts. According to the US Holocaust Memorial Museum, only around 2,500 of the some 30,000 people imprisoned in the Kaunas ghetto survived the war.',
                sources: [S.ltOcc, S.usLt, S.ninth, S.usKovno, S.kovno, S.jagerReport],
            },
            {
                ko: '빌뉴스 근교 포나리(파네리아이)에서는 7월 2일 특무부대 9가 도착하면서 총살이 시작되었고, 대부분의 사격은 리투아니아인 자원자로 이루어진 「특수소대」가 맡았다. 소련이 기름 탱크 자리로 파 둔 커다란 구덩이 여섯 개가 무덤이 되었다. 1941년 말까지 포나리에서 살해된 유대인 수는 2만 1,700명(스나이더)부터 3만 3,500명(아라드), 약 4만 명(미국 홀로코스트 기념관)까지 추정이 엇갈린다. 1944년까지 포나리의 희생자는 7만~10만 명으로 추정되며, 그 가운데 유대인이 약 7만 명이고 나머지는 폴란드인과 소련군 포로 등이었다. 1943년부터 나치는 시신을 파내 태우는 작업으로 흔적을 지우려 했다.',
                en: 'At Ponary (Paneriai) outside Vilnius the shootings began when Einsatzkommando 9 arrived on 2 July, with most of the killing done by the Ypatingasis būrys, a squad of Lithuanian volunteers; six large pits dug by the Soviets for oil tanks became the graves. Estimates of the Jews killed at Ponary by the end of 1941 diverge widely, from 21,700 (Timothy Snyder) to 33,500 (Yitzhak Arad) and about 40,000 (US Holocaust Memorial Museum). By 1944 the victims of Ponary numbered an estimated 70,000–100,000, about 70,000 of them Jews and the rest mainly Poles and Soviet prisoners of war. From 1943 the Nazis tried to erase the evidence by exhuming and burning the bodies.',
                sources: [S.ponary, S.yb, S.usVilna],
            },
            {
                ko: '리가에서는 10월 말 약 3만 명의 유대인이 게토에 갇혔다. 로제는 유대인의 재산을 빼앗고 게토에 가두어 노동력으로 쓰려 했고, 슈탈레커는 이에 항의하며 절멸을 계속하라고 요구했다. 로제는 11월 15일 경제적 고려와 상관없이 모든 유대인을 죽이라는 것인지 로젠베르크에게 물었다. 독일·오스트리아 유대인을 리가로 보낼 자리를 마련하려고, 하인리히 힘러는 우크라이나에서 학살을 지휘한 프리드리히 예켈른을 불러 「로제에게 이것이 나의 명령이며 총통의 뜻이라고 전하라」고 지시했다. 11월 30일과 12월 8일 리가 남쪽 룸불라 숲에서 리가 게토의 라트비아 유대인 약 2만 4,000명과 베를린에서 막 실려 온 유대인 약 1,000명, 모두 약 2만 5,000명이 총살되었다. 베를린 유대인을 죽이지 말라는 힘러의 전화는 그들이 이미 살해된 뒤에야 왔다. 사격은 예켈른의 독일인 대원들이 했고, 아라이스 특공대는 행렬을 구덩이로 몰았다.',
                en: 'In Riga some 30,000 Jews were shut into a ghetto at the end of October. Lohse wanted to seize Jewish property, confine the Jews to ghettos and use them as labour; Stahlecker protested and demanded that the extermination continue, and on 15 November Lohse asked Rosenberg whether all Jews were to be killed regardless of economic considerations. To make room for German and Austrian Jews to be deported to Riga, Heinrich Himmler brought in Friedrich Jeckeln, who had directed massacres in Ukraine: “Tell Lohse it is my order, which is also the Führer’s wish.” On 30 November and 8 December some 24,000 Latvian Jews from the Riga ghetto and about 1,000 Jews just transported from Berlin — some 25,000 people in all — were shot in the Rumbula forest south of Riga. Himmler’s telephone order not to kill the Berlin transport came after they were already dead. The shooting was done by Jeckeln’s German men, and the Arajs Kommando drove the columns to the pits.',
                sources: [S.holoLv, S.rumbula, S.usRiga, S.arajsK],
            },
            {
                ko: '예거는 1941년 12월 1일 7월 2일 이후 자기 부대 관할에서 13만 7,346명을 처형했다는 9쪽짜리 보고서를 썼고, 1942년 2월 슈탈레커에게 유대인 13만 6,421명을 포함한 13만 8,272명으로 숫자를 고쳐 보고했다. 보고서는 빌뉴스·카우나스·샤울레이 게토의 약 3만 4,500명을 빼면 리투아니아에 유대인이 없다고 결론지었지만, 다른 부대의 학살은 넣지 않았다. 슈탈레커는 1941년 겨울까지 A집단이 유대인 24만 9,420명을 죽였다고 보고했다. 미국 홀로코스트 기념관에 따르면 독소전 첫 아홉 달 동안 특수작전집단은 50만 명이 넘는 사람을 총살하는 데 관여했고, 그 대다수가 유대인이었다.',
                en: 'On 1 December 1941 Jäger wrote a nine-page report tallying 137,346 people executed in his unit’s zone since 2 July; in February 1942 he updated the total for Stahlecker to 138,272, including 136,421 Jews. The report concluded that Lithuania was free of Jews apart from some 34,500 in the Vilnius, Kaunas and Šiauliai ghettos, though it left out killings by other units. Stahlecker reported that by the winter of 1941 Einsatzgruppe A had murdered some 249,420 Jews. According to the US Holocaust Memorial Museum, the Einsatzgruppen organised and helped carry out the shooting of more than half a million people, the vast majority of them Jews, in the first nine months of the war against the Soviet Union.',
                sources: [S.jagerReport, S.stahlecker, S.usEinsatz],
            },
        ],
    },
    {
        heading: { ko: '게토와 수용소, 그리고 저항 (1941–1944)', en: 'Ghettos, camps and resistance (1941–1944)' },
        paragraphs: [
            {
                ko: '1941년 말 리투아니아에 살아남은 약 4만~4만 3,000명의 유대인은 빌뉴스, 카우나스, 샤울레이, 슈벤치오니스 게토와 노동수용소에 갇혀 독일 군수에 동원되었다. 카우나스 게토는 빌리얌폴레의 낡은 주거지에 약 2만 9,000명을 몰아넣었고, 의사 엘하난 엘케스가 이끈 유대인 평의회는 군용 비행장 공사 등에 노동자를 보내며 생산성이 학살을 막아 주기를 바랐다. 빌뉴스 게토의 지도자 야코프 겐스는 극장을 열었고, 1943년 1월까지 공연 111회에 표 3만 4,804장이 팔렸다. 리가에서는 룸불라에서 살아남은 4,000~5,000명이 「작은 게토」에 갇혔고, 나머지 구역에는 독일·오스트리아·보헤미아에서 실려 온 약 2만 명의 유대인이 들어갔다. 1942년부터 1943년 봄까지는 대량 학살이 멈춘 「게토 안정기」였다.',
                en: 'The 40,000–43,000 or so Jews left alive in Lithuania at the end of 1941 were confined in the Vilnius, Kaunas, Šiauliai and Švenčionys ghettos and labour camps and worked for the German war economy. The Kaunas ghetto crammed some 29,000 people into the run-down houses of Vilijampolė, and its Jewish council under the physician Elkhanan Elkes sent labourers to build a military airfield, hoping productivity would forestall killing. Jacob Gens, the head of the Vilnius ghetto, opened a theatre that had given 111 performances and sold 34,804 tickets by January 1943. In Riga the 4,000–5,000 Jews who survived Rumbula were held in a “small ghetto”, and some 20,000 Jews deported from Germany, Austria and Bohemia filled the rest. From 1942 to the spring of 1943 the mass killings paused in a period of “ghetto stabilisation”.',
                sources: [S.usLt, S.ltOcc, S.kovno, S.usKovno, S.vilna, S.usRiga],
            },
            {
                ko: '1943년 6월 21일 힘러가 동부의 남은 게토를 모두 없애라고 명령했다. 빌뉴스 게토는 9월 23~24일 해체되어 주민들이 에스토니아의 노동수용소로 보내지거나 포나리에서 총살되었고, 노약자는 절멸수용소로 보내졌다(영어 위키백과는 트레블링카, 미국 홀로코스트 기념관은 소비보르). 카우나스와 샤울레이 게토는 강제수용소로 바뀌었다. 리가 교외에는 1943년 3월 카이저발트 수용소가 세워져 최대 1만 2,000명을 가두었고, 에스토니아에는 1943년 8월부터 바이바라를 중심으로 22개의 수용소가 세워져 약 2만 명의 유대인이 셰일유 채굴 등에 끌려갔다. 1942년 9월에는 체코와 베를린에서 온 유대인 1,700여 명이 도착하자마자 칼레비리바 모래언덕에서 총살되었다. 리가 근처 살라스필스 수용소에서는 2,000~3,000명이 열악한 환경으로 죽었다.',
                en: 'On 21 June 1943 Himmler ordered all remaining ghettos in the east liquidated. The Vilnius ghetto was destroyed on 23–24 September: its inhabitants were sent to labour camps in Estonia or shot at Ponary, and the old and sick were sent to a killing centre (Treblinka according to English Wikipedia, Sobibor according to the US Holocaust Memorial Museum). The Kaunas and Šiauliai ghettos became concentration camps. Kaiserwald, opened on the edge of Riga in March 1943, held up to 12,000 prisoners, and from August 1943 a complex of 22 camps centred on Vaivara put some 20,000 Jews to work in Estonia’s oil-shale industry. In September 1942 some 1,700 Jews from Czechoslovakia and Berlin were shot on arrival in the sand dunes of Kalevi-Liiva. At Salaspils near Riga an estimated 2,000–3,000 people died of the appalling conditions.',
                sources: [S.vilna, S.usVilna, S.ltOcc, S.kaiserwald, S.vaivara, S.holoEe, S.salaspils],
            },
            {
                ko: '빌뉴스 게토에서는 1942년 1월 21일 「우리는 도살장의 양처럼 가지 않을 것이다」라는 아바 코브네르의 구호 아래 공산주의자와 좌우파 시온주의자가 연합 파르티잔 조직(FPO)을 세웠다. 1943년 지도자 이츠하크 비텐베르크가 게슈타포에 넘겨졌고, 게토 해체 때 대원들은 봉기 대신 숲으로 빠져나가 파르티잔이 되었다. 카우나스 게토에서도 약 500명이 탈출해 남동부 숲의 유대인·소련 파르티잔에 합류했다. 시신을 태우는 일에 동원된 수감자들은 1943년 말 제9요새에서 64명이, 1944년 4월 19일 포나리에서는 숟가락으로 판 굴로 80명이 탈출했고, 포나리 탈출자 가운데 살아남은 11명의 증언이 학살을 알렸다.',
                en: 'In the Vilnius ghetto, Communists and left- and right-wing Zionists founded the United Partisan Organisation (FPO) on 21 January 1942 under Abba Kovner’s watchword “We will not go like sheep to the slaughter”. In 1943 its commander Yitzhak Wittenberg was handed over to the Gestapo, and when the ghetto was liquidated the fighters slipped out to the forests to join the partisans rather than revolt. Some 500 Jews also escaped from the Kaunas ghetto to the Jewish and Soviet partisans in the forests of the south-east. Prisoners forced to burn the bodies broke out too: 64 escaped from the Ninth Fort on the eve of 1944, and on 19 April 1944 80 escaped from Ponary through a tunnel dug with spoons; the testimony of the 11 who survived helped reveal the massacre.',
                sources: [S.fpo, S.vilna, S.usVilna, S.kovno, S.ninth, S.ponary],
            },
        ],
    },
    {
        heading: { ko: '협력과 구조', en: 'Collaboration and rescue' },
        paragraphs: [
            {
                ko: '발트 3국의 홀로코스트는 현지인의 대규모 참여로 규정된다. 리투아니아에서는 26개 경찰대대 1만 2,000~1만 3,000명 가운데 10개 대대가 독일 특무부대와 함께 약 7만 8,000명을 처형한 것으로 추정되며, 독일 보안경찰 밑의 리투아니아 보안경찰과 「특수소대」가 체포와 총살을 도왔다. 라트비아의 아라이스 특공대는 학살기 300~500명(전성기 1,500명)으로 약 2만 6,000명의 유대인을 죽였다. 에스토니아 향토방위대 약 4만 명 가운데 1,000~1,200명이 유대인과 로마인을 잡아들이고 수용소를 지키거나 학살에 직접 가담했고, 에스토니아 경찰대대는 리가와 빌뉴스, 벨라루스의 학살에도 나섰다. 역사가들은 유대인을 공산주의와 동일시하며 소련 지배의 책임을 돌린 선전, 오래된 반유대주의, 재산에 대한 탐욕 등을 원인으로 꼽지만 그 이유는 지금도 논쟁 중이다.',
                en: 'Large-scale local participation is a defining feature of the Holocaust in the Baltic states. In Lithuania ten of the 26 police battalions, with 12,000–13,000 men in all, are thought to have executed some 78,000 people together with German commandos, and the Lithuanian Security Police, subordinate to the German Security Police, and the Ypatingasis būrys helped arrest and shoot victims. In Latvia the Arajs Kommando, 300–500 strong during the killings and up to 1,500 at its peak, murdered some 26,000 Jews. Of Estonia’s roughly 40,000 Omakaitse members, 1,000–1,200 were directly involved in rounding up, guarding or killing Jews and Roma, and Estonian police battalions took part in killings in Riga, Vilnius and Belarus. Historians cite propaganda that equated Jews with communism and blamed them for Soviet rule, older antisemitism and greed for property, but the reasons for the collaboration are still debated.',
                sources: [S.ltOcc, S.holoLt, S.arajsK, S.omakaitse, S.holoEe],
            },
            {
                ko: '희생자 수는 범위로만 말할 수 있다. 독일 침공 당시 리투아니아의 유대인 약 20만 8,000~21만 명 가운데 19만~19만 5,000명이 살해되어 95% 이상이 죽었고, 역사가들의 추정은 16만 5,000명에서 25만 4,000명까지 벌어진다. 라트비아에서는 전쟁 전 약 9만 3,000명 가운데 약 7만 명(아라드는 7만 3,000~7만 4,000명)이 살해되었고, 독일 점령기 라트비아에서 살해된 사람은 유대인과 로마인 약 2,000명을 포함해 약 9만 명이었다. 에스토니아에서는 남아 있던 유대인 950~1,000명 외에 다른 나라에서 끌려온 유대인 약 1만 명이 살해되었다. 오스트란트 전체에서 특수작전집단과 질서경찰, 현지 보조경찰은 유대인 등 100만 명이 넘는 사람을 죽였다.',
                en: 'The number of victims can only be given as ranges. Of the roughly 208,000–210,000 Jews in Lithuania at the German invasion, 190,000–195,000 were killed — more than 95 per cent — and historians’ estimates range from 165,000 to 254,000. In Latvia about 70,000 of some 93,000 prewar Jews were murdered (73,000–74,000 according to Arad), and the German occupation killed some 90,000 people in Latvia in all, among them about 2,000 Roma. In Estonia, besides the 950–1,000 Jews who had remained, some 10,000 Jews deported there from elsewhere were killed. Across Ostland the Einsatzgruppen, Order Police battalions and local auxiliaries killed over a million Jews and others.',
                sources: [S.holoLt, S.holoLv, S.lvOcc, S.holoEe, S.ostland],
            },
            {
                ko: '목숨을 걸고 유대인을 숨긴 사람들도 있었다. 이스라엘은 2017년까지 리투아니아인 891명을 「열방의 의인」으로 인정했고, 리투아니아의 폴란드계 주민도 많이 도왔다. 리가 항구의 하역 노동자였던 자니스 립케는 루프트바페 창고의 하청 일을 하며 게토와 수용소에서 유대인 노동자를 빼내 아내 요한나와 함께 집 마당에 판 은신처 등에 숨겼고, 그렇게 살린 사람은 문헌에 따라 40~55명이다. 빌뉴스에서는 국방군 소령 카를 플라게가 자동차 수리 작업장의 유대인 노동자들을 보호했다. 이와 별개로 카우나스 주재 일본 부영사 스기하라 지우네는 통과 비자를 발급해 약 6,000명의 유대인이 유럽을 빠져나가도록 도왔다. 에스토니아에서는 우쿠 마싱 부부 등 세 명이 의인으로 인정되었다.',
                en: 'Some risked their lives to hide Jews. By 2017 Israel had recognised 891 Lithuanians as Righteous Among the Nations, and many members of Lithuania’s Polish minority also helped. Žanis Lipke, a docker in the port of Riga, took on contract work for the Luftwaffe and used it to smuggle Jewish workers out of the ghetto and camps, hiding them with his wife Johanna in places such as a bunker dug in their yard; the number he saved is given as 40 to about 55. In Vilnius the Wehrmacht major Karl Plagge shielded the Jewish workers of his vehicle repair camp. Separately, the Japanese vice-consul in Kaunas, Chiune Sugihara, helped some 6,000 Jews flee Europe by issuing transit visas. Three Estonians, among them Uku Masing and his wife, have been recognised as Righteous.',
                sources: [S.holoLt, S.lipke, S.lvLipke, S.lvOcc, S.vilna, S.eeOcc],
            },
        ],
    },
    {
        heading: { ko: '군단·보이콧·파르티잔 (1942–1944)', en: 'Legions, boycott and partisans (1942–1944)' },
        paragraphs: [
            {
                ko: '병력이 모자라게 된 독일은 발트인을 무장친위대에 끌어들였다. 1942년 8월 28일 「에스토니아 군단」 창설이 발표되었고, 1943년 3월의 강제 동원으로 5,300명이 군단에, 6,800명이 국방군 지원 부대에 들어갔다. 동원을 피해 수천 명이 핀란드로 건너가 핀란드군 제200보병연대가 되었다. 라트비아에서는 힘러의 요청을 받은 히틀러의 명령으로 1943년 2월 「라트비아 군단」이 만들어졌다. 1919~1924년생부터 시작된 징집은 점점 넓어졌고, 1944년 7월 군단 병력은 8만 7,550명이었으나 자원자는 약 15%에 그쳤다. 군단원 다수는 소련보다 독일을 「덜 나쁜 쪽」으로 보고 독립 라트비아를 바랐다.',
                en: 'Short of troops, Germany drew the Balts into the Waffen-SS. The formation of an “Estonian Legion” was announced on 28 August 1942, and the forced mobilisation of March 1943 put 5,300 men into the Legion and 6,800 into Wehrmacht support units; thousands fled to Finland to avoid the draft and formed the Finnish Army’s Infantry Regiment 200. In Latvia the Latvian Legion was created in February 1943 on Hitler’s orders at Himmler’s request. Conscription, starting with men born in 1919–1924, was steadily widened; by July 1944 the Legion had 87,550 men, only about 15 per cent of whom had volunteered. Many legionnaires wanted an independent Latvia and saw German rule as the lesser of two evils.',
                sources: [S.estLegion, S.eeOcc, S.latLegion],
            },
            {
                ko: '리투아니아인은 1943년 무장친위대 동원을 보이콧해 300명도 응하지 않았다. 독일은 보복으로 지식인 46명을 슈투트호프로 보내고 3월 리투아니아의 모든 대학을 닫았다. 1944년 2월 포빌라스 플레하비추스 장군 휘하의 「리투아니아 향토방위군」이 리투아니아 안에서만 활동할 민족 부대로 기대를 모으며 만들어졌지만, 5월 독일이 직접 지휘하고 국외로 보내려 하자 장군은 부대 해산을 명령했다. 독일은 지휘부를 체포하고 86명을 파네리아이에서 처형했으며 1,089명을 수용소로 보냈다. 에스토니아에서는 1944년 2월 7일 울루오츠가 라디오로 1904~1923년생 남성에게 징집에 응하라고 호소했고, 3만 8,000명이 등록소로 몰려들었다. 그는 붉은군대의 재점령을 막아 내면 연합국이 독립을 지지해 주리라 기대했다.',
                en: 'Lithuanians boycotted the Waffen-SS mobilisation of 1943; fewer than 300 men reported. In reprisal the Germans deported 46 prominent intellectuals to Stutthof and in March closed all Lithuanian universities. In February 1944 the Lithuanian Territorial Defence Force was formed under General Povilas Plechavičius, which its organisers saw as a national force that would operate only in Lithuania, but in May, when the Germans tried to take direct command and send its men abroad, the general ordered his units to disperse. The Germans arrested its leaders, executed 86 of its men at Paneriai and deported 1,089 to concentration camps. In Estonia Uluots appealed by radio on 7 February 1944 for men born in 1904–1923 to answer the call-up, and 38,000 jammed the registration centres; he hoped that holding off a Soviet reoccupation would win Western support for independence.',
                sources: [S.ltdf, S.ltOcc, S.eeOcc, S.uluots],
            },
            {
                ko: '소련 파르티잔은 주로 라트비아 동부의 라트갈레와 빌뉴스 지방에서 활동했다. 1942년 11월 모스크바에 리투아니아 공산당 제1서기 안타나스 스니에치쿠스가 이끄는 리투아니아 파르티잔 운동 본부가 세워졌고, 라트비아 파르티잔은 1943년부터 아르투르스 스프로기스 아래 모스크바 본부에 직속되었다. 에스토니아에서는 1944년까지도 소련 파르티잔이 234명뿐이었고 모두 낙하산으로 들어온 내무인민위원부·붉은군대 요원이었다. 1943년 초 독일의 「겨울 마법 작전」은 라트비아 동부 국경 지대에서 마을 99곳을 불태우고 주민 6,000명을 강제노동에 끌고 가며 3,600명을 쏘았고, 아라이스 특공대가 여기에 앞장섰다. 리투아니아 남동부에서는 소련 파르티잔과 폴란드 국내군이 충돌했고, 독일 편 리투아니아 부대와 국내군 사이의 보복으로 1944년 6월 글리티슈케스와 두빙갸이에서 민간인 학살이 벌어졌다.',
                en: 'Soviet partisans operated mainly in Latgale in eastern Latvia and in the Vilnius region. In November 1942 a Lithuanian partisan headquarters was set up in Moscow under Antanas Sniečkus, first secretary of the Lithuanian Communist Party, and from 1943 the Latvian partisans were directly subordinated to the Moscow headquarters under Arturs Sproģis. In Estonia there were only 234 partisans even in 1944, all NKVD or Red Army personnel parachuted in. Germany’s Operation Winterzauber in early 1943 destroyed 99 villages in the eastern Latvian borderland, deported 6,000 villagers for forced labour and shot 3,600, with the Arajs Kommando in a leading role. In south-eastern Lithuania Soviet partisans clashed with the Polish Home Army, and reprisals between German-sponsored Lithuanian units and the Home Army ended in the massacres of civilians at Glitiškės and Dubingiai in June 1944.',
                sources: [S.partisans, S.ltOcc, S.lvOcc, S.arajsK],
            },
        ],
    },
    {
        heading: { ko: '나르바에서 쿠를란트까지: 1944년의 퇴각', en: 'From Narva to Courland: the retreat of 1944' },
        paragraphs: [
            {
                ko: '1944년 1월 레닌그라드 봉쇄가 풀리자 레오니트 고보로프의 레닌그라드 전선군이 2월 에스토니아 국경의 나르바강에 이르렀다. 독일 「나르바 분견군」은 북부집단군 사령관 발터 모델 아래 다른 나라 의용병과 에스토니아 징집병으로 반년 동안 교두보를 지켰고, 7월 26일 나르바를 내주고 16km 서쪽 시니매에드 언덕의 탄넨베르크 방어선으로 물러났다. 7월 25일부터 8월 10일까지의 전투에서 2만 2,250명의 독일군(보병의 약 절반이 에스토니아 사단)이 13만 6,830명의 소련군을 막아 냈고, 에스토니아 역사가 마르트 라르는 소련군 사상자를 약 17만 명으로 추산한다. 에스토니아를 빨리 되찾으려던 스탈린의 목표는 이루어지지 않았다.',
                en: 'After the siege of Leningrad was lifted in January 1944, Leonid Govorov’s Leningrad Front reached the Narva River on the Estonian border in February. The German Army Detachment “Narwa”, under Army Group North’s commander Walter Model, held the bridgehead for half a year with foreign volunteers and Estonian conscripts, then gave up Narva on 26 July and fell back 16 km west to the Tannenberg Line in the Sinimäed Hills. In the battle of 25 July – 10 August 22,250 German troops, roughly half of the infantry from the Estonian division, held off 136,830 Soviet soldiers; the Estonian historian Mart Laar puts Soviet casualties at about 170,000. Stalin’s aim of a quick recovery of Estonia was not achieved.',
                sources: [S.eeOcc, S.lvOcc, S.narva, S.tannenberg, S.etFlight],
            },
            {
                ko: '남쪽에서는 6월 22일 시작된 바그라티온 작전이 독일 중부집단군을 무너뜨렸다. 소련군은 7월 시가전 끝에 빌뉴스를, 8월 1일 카우나스를 되찾았고, 7월 말에는 리가만 해안에 닿아 북부집단군을 잠시 고립시켰다. 퇴각하던 독일군은 7월 초 카우나스 강제수용소를 비우고 수감자를 슈투트호프와 다하우로 보냈으며, 숨은 유대인을 찾아내려 게토 터를 폭파했다. 9월 14일부터 11월 24일까지의 발트 공세에서 이반 바그라먄의 제1발트 전선군 등이 진격해 10월 13일 리가를 점령했고, 10월 9일 클라이페다 근처에서 바다에 닿아 북부집단군을 쿠를란트반도에 가두었다. 국가판무관 로제는 8월 13일 허가 없이 리가를 떠났다가 해임되었다.',
                en: 'In the south, Operation Bagration, launched on 22 June, shattered Army Group Centre. Soviet forces retook Vilnius after street fighting in July and Kaunas on 1 August, and at the end of July they reached the coast of the Gulf of Riga, briefly cutting off Army Group North. Retreating, the Germans emptied the Kaunas concentration camp in early July, sending its prisoners to Stutthof and Dachau, and dynamited the former ghetto to drive out the Jews in hiding. In the Baltic offensive of 14 September – 24 November, Ivan Bagramyan’s 1st Baltic Front and other fronts advanced, took Riga on 13 October and, reaching the sea near Klaipėda on 9 October, trapped Army Group North on the Courland Peninsula. Reichskommissar Lohse fled Riga without authorisation on 13 August and was removed.',
                sources: [S.lvOcc, S.usLt, S.usKovno, S.balticOff, S.courland, S.lohse],
            },
            {
                ko: '9월 4일 핀란드가 전쟁에서 빠지자 독일은 에스토니아 본토를 포기하는 「아스터 작전」에 들어갔다. 9월 18일 울루오츠는 오토 티에프를 총리 대행으로 하는 정부를 세웠고, 티에프는 법적 연속성에 바탕을 둔 독립 회복을 선언했다. 에스토니아 군인들은 탈린 톰페아의 정부 청사를 장악했고 9월 20일 피크헤르만 탑에 에스토니아 국기를 올렸지만, 9월 22일 붉은군대가 탈린에 들어와 소련 국기로 바꾸어 달았다. 클루가 수용소에서는 이 무렵인 9월 19~22일 남은 수감자 약 2,000명이 총살되어 불태워졌고, 2,400명 가운데 85명만 살아남았다. 독일군은 11월 23일 사아레마섬 쇠르베반도에서 마지막으로 물러났다. 쿠를란트의 독일군은 1945년 5월 항복할 때까지 버텼다.',
                en: 'When Finland left the war on 4 September, Germany began abandoning mainland Estonia in Operation Aster. On 18 September Uluots formed a government under Otto Tief as acting prime minister, and Tief proclaimed the restoration of independence on the basis of legal continuity. Estonian troops seized the government buildings on Toompea in Tallinn and raised the Estonian flag on the Pikk Hermann tower on 20 September, but on 22 September the Red Army entered Tallinn and replaced it with the Soviet flag. At the Klooga camp some 2,000 remaining prisoners were shot and burned on 19–22 September; only 85 of 2,400 survived. The Germans evacuated their last foothold, the Sõrve Peninsula on Saaremaa, on 23 November. The Germans in Courland held out until the surrender of May 1945.',
                sources: [S.eeOcc, S.tallinnOff, S.tief, S.uluots, S.klooga, S.courland],
            },
            {
                ko: '붉은군대가 다가오자 대규모 피난이 이어졌다. 에스토니아어로 「대탈출」이라 불리는 피난에서 1944년 에스토니아를 떠난 사람은 약 8만 명이었고 그 가운데 6~9%가 도중에 죽었다. 약 4만 명은 배나 육로로 독일로, 약 3만 명은 작은 배로 발트해를 건너 스웨덴으로 갔다. 피난은 9월 19~23일에 절정에 이르렀고, 9월 22일 소련 비행기의 어뢰에 맞은 병원선 모에로가 가라앉아 1,237명이 죽었다. 라트비아에서도 약 15만 명이 서방으로 망명했다. 첫 소련 점령의 기억이 이들을 떠나게 했고, 남은 사람들에게는 재점령과 숲의 형제들의 저항, 새로운 이송이 기다리고 있었다.',
                en: 'As the Red Army approached, a mass exodus followed. In what Estonians call the Great Flight, some 80,000 people left Estonia in 1944, of whom 6–9 per cent died on the way; about 40,000 reached Germany by ship or overland and nearly 30,000 crossed the Baltic in small boats to Sweden. The flight peaked on 19–23 September, and on 22 September the hospital ship Moero sank after a torpedo from a Soviet aircraft hit it, killing 1,237 people. Some 150,000 Latvians also went into exile in the West. The memory of the first Soviet occupation drove them out; those who stayed faced reoccupation, the resistance of the Forest Brothers and new deportations.',
                sources: [S.etFlight, S.lvOcc],
            },
        ],
    },
];

const event = buildEvent({
    id: 'baltic-german-occupation-1941-1944',
    title: { ko: '독일 점령하의 발트 3국: 6월 봉기에서 홀로코스트와 1944년 퇴각까지', en: 'The Baltic states under German occupation: from the June Uprising through the Holocaust to the retreat of 1944' },
    period: '1941.06–1944.11',
    sortOrder: 109,
    question: {
        ko: '소련 지배에서 「해방」을 기대한 발트 3국에서 어떻게 3년 사이에 유대인 공동체가 거의 모두 학살되었고, 독일 점령은 왜 독립 회복이 아니라 소련의 재점령으로 끝났는가?',
        en: 'How, in Baltic states that had hoped for “liberation” from Soviet rule, were their Jewish communities almost entirely destroyed within three years, and why did the German occupation end not in restored independence but in Soviet reoccupation?',
    },
    summary: {
        ko: '1941년 6월 독일의 소련 침공과 함께 리투아니아에서는 6월 봉기와 임시정부, 에스토니아에서는 숲의 형제들의 「여름 전쟁」이 일어났지만, 독일은 독립을 인정하지 않고 세 나라를 오스트란트 국가판무관부에 넣었다. 슈탈레커의 특수작전집단 A와 예거의 특무부대 3, 예켈른의 부대는 리투아니아·라트비아의 경찰대대와 아라이스 특공대 같은 현지 협력자와 함께 카우나스 포그롬, 제9요새, 포나리, 룸불라에서 유대인을 총살했고, 대부분의 희생자는 1941년 말 이전에 죽었다. 1943년 남은 게토가 해체되었고, 독일은 무장친위대 군단으로 발트인을 동원했지만 리투아니아인은 이를 보이콧했다. 1944년 나르바와 탄넨베르크선의 방어 끝에 붉은군대가 발트 3국을 되찾았고, 독립 회복을 꾀한 티에프 정부는 나흘 만에 무너졌으며 수만 명이 서방으로 피난했다.',
        en: 'When Germany invaded the Soviet Union in June 1941, the June Uprising and a provisional government arose in Lithuania and the Forest Brothers fought the Summer War in Estonia, but Germany refused to recognise independence and placed the three countries in Reichskommissariat Ostland. Stahlecker’s Einsatzgruppe A, Jäger’s Einsatzkommando 3 and Jeckeln’s men, with local collaborators such as Lithuanian and Latvian police battalions and the Arajs Kommando, shot Jews in the Kaunas pogrom and at the Ninth Fort, Ponary and Rumbula; most of the victims died before the end of 1941. The remaining ghettos were liquidated in 1943, and Germany mobilised Balts into Waffen-SS legions, though the Lithuanians boycotted the call-up. In 1944, after the defence of Narva and the Tannenberg Line, the Red Army retook the Baltic states; the Tief government’s attempt to restore independence collapsed within four days, and tens of thousands fled west.',
    },
    outcome: {
        ko: '리투아니아에서는 독일 침공 당시 유대인의 95% 이상인 19만~19만 5,000명이, 라트비아에서는 약 7만 명(아라드는 7만 3,000~7만 4,000명)이, 에스토니아에서는 남아 있던 950~1,000명 거의 전부와 끌려온 외국 유대인 약 1만 명이 살해되었다. 리투아니아의 비율은 유럽에서 가장 높은 축에 든다. 1944년 말 쿠를란트를 뺀 발트 3국은 다시 소련 지배 아래 들어갔다.',
        en: 'In Lithuania 190,000–195,000 Jews, more than 95 per cent of those present at the German invasion, were murdered; in Latvia some 70,000 (73,000–74,000 according to Arad); in Estonia almost all of the 950–1,000 who had remained, along with some 10,000 Jews deported there from abroad. Lithuania’s rate was among the highest in Europe. By the end of 1944 the Baltic states, except Courland, were again under Soviet rule.',
    },
    sections,
    timeline: [
        ['1941.06.22', '독소전 개전과 첫 학살', 'Invasion and the first massacre', '독일군이 리투아니아로 들어왔고 가르그주다이에서 유대인 약 200명이 총살되었다.', 'German troops entered Lithuania; some 200 Jews were shot at Gargždai.', ['germany', 'soviet', 'lithuania'], P(55.7128, 21.3953, '가르그주다이', 'Gargždai')],
        ['1941.06.23', '리투아니아 독립 선언', 'Lithuanian declaration of independence', '6월 봉기 중 카우나스 방송이 독립 선언과 임시정부 명단을 내보냈다.', 'During the June Uprising, Kaunas radio broadcast the declaration and the provisional government.', 'lithuania', P(54.8985, 23.9036, '카우나스', 'Kaunas')],
        ['1941.06.25', '카우나스 포그롬', 'Kaunas pogrom', '슈탈레커의 부추김 속에 29일까지 유대인 수천 명이 살해되었다.', 'Incited by Stahlecker, local militias killed thousands of Jews by the 29th.', ['lithuania', 'germany']],
        ['1941.07.04', '리가 회당 방화', 'Riga synagogues burned', '아라이스 특공대가 회당에 갇힌 유대인들을 불태워 죽였다.', 'The Arajs Kommando burned Jews trapped in the synagogues.', ['latvia', 'germany'], P(56.9496, 24.1052, '리가', 'Riga')],
        ['1941.07.17', '오스트란트 수립 포고', 'Ostland decreed', '히틀러가 로젠베르크를 동부 점령지 장관으로 하는 민정을 포고했다.', 'Hitler decreed civil administration under Rosenberg’s eastern ministry.', 'germany'],
        ['1941.07.29', '울루오츠의 요청 거부', 'Uluots turned down', '독일이 에스토니아 독립 정부 수립 요청을 거절했다.', 'The Germans refused his request to form an Estonian government.', ['estonia', 'germany']],
        ['1941.08.05', '임시정부 해산', 'Provisional government disbands', '리투아니아 임시정부가 독일의 권한 찬탈에 항의하고 해산했다.', 'The Lithuanian government protested German usurpation and disbanded.', 'lithuania'],
        ['1941.08.28', '탈린 함락', 'Tallinn falls', '에스토니아·독일군이 탈린을 점령했다.', 'Estonian and German forces took Tallinn.', ['estonia', 'germany', 'soviet']],
        ['1941.10.29', '제9요새 「대작전」', 'The “Great Action”', '카우나스 게토에서 골라낸 9,200여 명이 제9요새에서 총살되었다.', 'Over 9,200 people selected in the Kaunas ghetto were shot at the Ninth Fort.', ['lithuania', 'germany'], P(54.9419, 23.8786, '제9요새', 'Ninth Fort')],
        ['1941.11.30', '룸불라 학살', 'Rumbula massacre', '12월 8일까지 리가 게토의 유대인 등 약 2만 5,000명이 총살되었다.', 'By 8 December some 25,000 Jews, mostly from the Riga ghetto, were shot.', ['latvia', 'germany'], P(56.8836, 24.2467, '룸불라', 'Rumbula')],
        ['1941.12.01', '예거 보고서', 'Jäger Report', '특무부대 3이 13만 7,346명을 처형했다고 집계했다.', 'Einsatzkommando 3 tallied 137,346 executions.', ['lithuania', 'germany']],
        ['1942.01.21', '연합 파르티잔 조직', 'United Partisan Organisation', '빌뉴스 게토에서 유대인 저항 조직이 결성되었다.', 'A Jewish resistance organisation was founded in the Vilnius ghetto.', 'lithuania'],
        ['1942.08.28', '에스토니아 군단', 'Estonian Legion', '무장친위대 에스토니아 군단 창설이 발표되었다.', 'The formation of a Waffen-SS Estonian Legion was announced.', ['estonia', 'germany']],
        ['1943.02', '라트비아 군단', 'Latvian Legion', '히틀러의 명령으로 라트비아 군단이 창설되었다.', 'The Latvian Legion was created on Hitler’s orders.', ['latvia', 'germany']],
        ['1943.03', '리투아니아의 보이콧', 'Lithuanian boycott', '무장친위대 동원이 보이콧되자 독일이 대학을 닫고 지식인을 이송했다.', 'After the SS call-up was boycotted, the Germans closed the universities and deported intellectuals.', ['lithuania', 'germany']],
        ['1943.09.23', '빌뉴스 게토 해체', 'Vilnius ghetto liquidated', '주민들이 에스토니아 수용소와 포나리, 절멸수용소로 보내졌다.', 'Its inhabitants were sent to Estonian camps, to Ponary and to killing centres.', ['lithuania', 'germany'], P(54.6264, 25.1886, '포나리(파네리아이)', 'Ponary (Paneriai)')],
        ['1944.02.07', '울루오츠의 징집 호소', 'Uluots’s call-up appeal', '라디오 호소 뒤 3만 8,000명이 징집에 응했다.', 'After his radio appeal 38,000 men answered the call-up.', 'estonia'],
        ['1944.07.26', '탄넨베르크선', 'Tannenberg Line', '나르바를 내준 독일군이 시니매에드 언덕에서 8월 10일까지 버텼다.', 'Having given up Narva, the Germans held the Sinimäed Hills until 10 August.', ['estonia', 'germany', 'soviet'], P(59.3786, 27.6744, '시니매에드', 'Sinimäed')],
        ['1944.08.01', '카우나스 탈환', 'Kaunas retaken', '7월의 빌뉴스에 이어 소련군이 카우나스를 되찾았다.', 'After Vilnius in July, Soviet forces retook Kaunas.', ['soviet', 'lithuania', 'germany']],
        ['1944.09.18', '티에프 정부', 'Tief government', '울루오츠가 티에프 정부를 세웠으나 22일 붉은군대가 탈린에 들어왔다.', 'Uluots formed the Tief government; the Red Army entered Tallinn on the 22nd.', ['estonia', 'soviet'], P(59.4370, 24.7536, '탈린', 'Tallinn')],
        ['1944.09.19', '클루가 학살', 'Klooga massacre', '22일까지 수감자 약 2,000명이 총살되었다.', 'Some 2,000 prisoners were shot by the 22nd.', ['estonia', 'germany'], P(59.3097, 24.2306, '클루가', 'Klooga')],
        ['1944.10.13', '리가 점령', 'Riga taken', '발트 공세 중 소련군이 리가를 점령했고 북부집단군은 쿠를란트에 갇혔다.', 'Soviet forces took Riga; Army Group North was trapped in Courland.', ['soviet', 'latvia', 'germany']],
        ['1944.11.23', '쇠르베 철수', 'Sõrve evacuated', '독일군이 에스토니아의 마지막 거점에서 물러났다.', 'The Germans left their last foothold in Estonia.', ['estonia', 'germany', 'soviet']],
    ],
    locations: [
        ['리가', 'Riga', 56.9496, 24.1052, 'main'],
        ['카우나스', 'Kaunas', 54.8985, 23.9036, 'place'],
        ['빌뉴스', 'Vilnius', 54.6872, 25.2797, 'place'],
        ['탈린', 'Tallinn', 59.4370, 24.7536, 'place'],
        ['포나리(파네리아이)', 'Ponary (Paneriai)', 54.6264, 25.1886, 'place'],
        ['룸불라', 'Rumbula', 56.8836, 24.2467, 'place'],
        ['나르바', 'Narva', 59.3797, 28.1791, 'place'],
        ['클루가', 'Klooga', 59.3097, 24.2306, 'place'],
    ],
    countries: ['lithuania', 'latvia', 'estonia', 'germany', 'soviet', 'belarus', 'finland', 'sweden', 'poland'],
    relations: { related: ['baltic-soviet-occupation-1940-1941', 'baltic-sovietisation-1944-1953', 'great-patriotic-war', 'siege-of-leningrad', 'nazi-soviet-pact'] },
    focus: { ko: '독일 점령기의 발트 3국', en: 'The Baltic states under German occupation' },
    people: [
        ['adolf-hitler', 'leader', '독일 총통', 'German Führer', '오스트란트 수립을 포고하고 라트비아 군단 창설을 명령했다.', 'Decreed the creation of Ostland and ordered the formation of the Latvian Legion.'],
        ['alfred-rosenberg', 'leader', '동부 점령지 장관', 'Reich Minister for the Occupied Eastern Territories', '발트 지역의 독일화와 식민을 구상했고, 유대인 살해의 범위를 묻는 로제의 질의를 받았다.', 'Planned the Germanisation and colonisation of the Baltic lands, and received Lohse’s query on the scope of the killing of Jews.'],
        ['hinrich-lohse', 'executor', '오스트란트 국가판무관', 'Reichskommissar for Ostland', '유대인 명부 작성·노란 별·재산 몰수·게토 수용을 명령했고, 1944년 8월 허가 없이 리가를 떠났다.', 'Ordered the registration, yellow badge, expropriation and ghettoisation of Jews, and fled Riga without authorisation in August 1944.'],
        ['heinrich-himmler', 'leader', '친위대 전국지도자', 'Reichsführer-SS', '예켈른에게 리가 게토 학살을 명령했고, 1943년 6월 남은 게토의 해체를 지시했다.', 'Ordered Jeckeln to destroy the Riga ghetto and in June 1943 ordered the remaining ghettos liquidated.'],
        ['walter-stahlecker', 'executor', '특수작전집단 A 사령관', 'Commander, Einsatzgruppe A', '카우나스 포그롬을 부추기고 아라이스 특공대를 세우게 했으며, 1941년 겨울까지 유대인 24만 9,420명 살해를 보고했다.', 'Instigated the Kaunas pogrom, had the Arajs Kommando formed, and reported 249,420 Jews killed by the winter of 1941.'],
        ['karl-jager', 'executor', '특무부대 3 지휘관', 'Commander, Einsatzkommando 3', '리투아니아 유대인의 대량 총살을 지휘하고 13만 7,346명을 집계한 예거 보고서를 썼다.', 'Directed the mass shooting of Lithuania’s Jews and wrote the Jäger Report tallying 137,346 executions.'],
        ['friedrich-jeckeln', 'executor', '오스트란트 친위대·경찰 고위 지도자', 'Higher SS and Police Leader, Ostland', '1941년 11–12월 룸불라 학살을 지휘했다.', 'Commanded the Rumbula massacre of November–December 1941.'],
        ['viktors-arajs', 'executor', '아라이스 특공대 지휘관', 'Commander of the Arajs Kommando', '리가 회당 방화와 룸불라 학살, 겨울 마법 작전에 부대를 이끌었다.', 'Led his unit in the burning of Riga’s synagogues, the Rumbula massacre and Operation Winterzauber.'],
        ['reinhard-heydrich', 'participant', '국가보안본부장', 'Head of the Reich Security Main Office', '베를린 유대인 수송자를 죽이지 말라는 힘러의 전화 지시를 받았으나 그들은 이미 룸불라에서 살해된 뒤였다.', 'Received Himmler’s telephone order not to kill the Berlin transport, whose passengers had already been shot at Rumbula.'],
        ['hjalmar-mae', 'participant', '에스토니아 자치행정 수장', 'Head of the Estonian Self-Administration', '독일군과 함께 돌아와 점령기 내내 에스토니아 자치행정을 이끌었다.', 'Returned with the German army and headed the Estonian Self-Administration throughout the occupation.'],
        ['kazys-skirpa', 'participant', '리투아니아 행동주의 전선 창설자', 'Founder of the Lithuanian Activist Front', '6월 봉기를 준비하고 임시정부 총리로 지명되었으나 베를린에서 가택연금되었다.', 'Prepared the June Uprising and was named prime minister of the provisional government, but was held under house arrest in Berlin.'],
        ['juri-uluots', 'participant', '총리, 대통령 직무대행', 'Prime minister acting as president', '1941년 독일에 독립 정부를 청했다 거절당했고, 1944년 징집을 호소했으며 티에프 정부를 세웠다.', 'Asked the Germans in 1941 for an independent government and was refused; in 1944 he backed the call-up and formed the Tief government.'],
        ['zanis-lipke', 'participant', '구조자', 'Rescuer', '리가 게토와 수용소에서 유대인 40~55명을 빼내 숨겼다.', 'Smuggled 40 to about 55 Jews out of the Riga ghetto and camps and hid them.'],
        ['stalin', 'opponent', '소련 지도자', 'Soviet leader', '1941년 7월 3일 초토화를 지시했고, 에스토니아를 빨리 되찾으려 했다.', 'Called for scorched earth on 3 July 1941 and sought a quick recovery of Estonia.'],
        ['antanas-snieckus', 'opponent', '리투아니아 파르티잔 운동 본부장', 'Head of the Lithuanian partisan headquarters', '1942년 11월 모스크바에 세워진 리투아니아 파르티잔 운동 본부를 이끌었다.', 'Headed the Lithuanian partisan headquarters set up in Moscow in November 1942.'],
        ['leonid-govorov', 'opponent', '레닌그라드 전선군 사령관', 'Commander, Leningrad Front', '나르바 공세와 탄넨베르크선 전투를 지휘했다.', 'Commanded the Narva offensives and the battle of the Tannenberg Line.'],
        ['walter-model', 'participant', '북부집단군 사령관', 'Commander, Army Group North', '1944년 초 나르바 방어 시기에 북부집단군을 지휘했다.', 'Commanded Army Group North during the defence of Narva in early 1944.'],
        ['ivan-bagramyan', 'opponent', '제1발트 전선군 사령관', 'Commander, 1st Baltic Front', '발트 공세와 리가 공세에서 제1발트 전선군을 이끌었다.', 'Led the 1st Baltic Front in the Baltic and Riga offensives.'],
    ],
});

const people = require('./people-1941');

const terms = [
    term({
        id: 'reichskommissariat-ostland', ko: '오스트란트 국가판무관부', en: 'Reichskommissariat Ostland', category: 'international', period: '1941–1945', startYear: 1941, endYear: 1945,
        definition: ['나치 독일이 1941~1945년 리투아니아·라트비아·에스토니아와 벨라루스 서부에 둔 민정 점령 기구. 동부 점령지 장관 알프레트 로젠베르크 아래 국가판무관 힌리히 로제가 리가에서 다스렸고, 이 땅에서 친위대와 특수작전집단, 현지 보조경찰이 유대인 등 100만 명이 넘는 사람을 죽였다.',
            'The German civil occupation regime of 1941–1945 in Lithuania, Latvia, Estonia and western Belarus. Ruled from Riga by Reichskommissar Hinrich Lohse under Alfred Rosenberg’s Reich Ministry for the Occupied Eastern Territories, it was the territory in which the SS, the Einsatzgruppen and local auxiliary police killed over a million Jews and others.'],
        body: ['1941년 7월 17일 히틀러의 포고로 설치가 정해졌고, 군정 시기를 거쳐 가을부터 민정이 들어섰다. 판무관부는 에스토니아(총판무관 카를지크문트 리츠만), 라트비아(오토하인리히 드레흐슬러), 리투아니아(테오도어 아드리안 폰 렌텔른), 백루테니아(빌헬름 쿠베)의 네 총관구로 나뉘었고, 각 총관구에는 현지인 협력 행정기구와 보조경찰이 있었다. 그러나 치안은 친위대·경찰 고위 지도자가, 경제와 노동력은 다른 중앙 기관이 쥐어 로젠베르크와 로제의 실권은 제한되었다.\n\n판무관부는 소련 국가·당 재산을 몰수하고 국유화된 농지를 옛 주인에게 돌려주었지만, 유대인 재산은 몰수했다. 동부 종합 계획은 이 지역을 독일화해 독일에 합치려 했다. 1943~1944년 붉은군대가 대부분을 되찾았고, 1944년 4월 백루테니아가 떨어져 나갔으며, 9월 로제 대신 에리히 코흐가 국가판무관이 되었다. 남은 행정기구는 1945년 5월까지 쿠를란트 포위망 안에서 버텼다.',
            'Its creation was decreed by Hitler on 17 July 1941, and after a period of military rule the civil administration took over from the autumn. It was divided into four general districts — Estonia under Generalkommissar Karl-Siegmund Litzmann, Latvia under Otto-Heinrich Drechsler, Lithuania under Theodor Adrian von Renteln and White Ruthenia under Wilhelm Kube — each with a native collaborationist administration and auxiliary police. But security lay with the Higher SS and Police Leader and the economy and labour with other central agencies, so Rosenberg and Lohse had limited real power.\n\nThe administration confiscated Soviet state and party property and returned nationalised farmland to its former owners, but confiscated Jewish property. Under Generalplan Ost the region was to be Germanised and joined to Germany. The Red Army recaptured most of it in 1943–1944; White Ruthenia was detached in April 1944, and in September Erich Koch replaced Lohse as Reichskommissar. The rump administration held out in the Courland Pocket until May 1945.'],
        aliases: { ko: ['오스트란트', '오스트란트 제국판무관부', '동방 국가판무관부'], en: ['Ostland', 'Reich Commissariat Ostland', 'RKO'] },
        people: ['hinrich-lohse', 'alfred-rosenberg', 'friedrich-jeckeln', 'hjalmar-mae', 'adolf-hitler'],
        events: ['baltic-german-occupation-1941-1944', 'great-patriotic-war'],
        sources: [S.ostland, S.lohse, S.usLv], locator: 'lead; After Operation Barbarossa; Administrative and territorial organization; Policies',
    }),
    term({
        id: 'einsatzgruppen', ko: '특수작전집단 (아인자츠그루펜)', en: 'Einsatzgruppen', category: 'repression', period: '1939–1945', startYear: 1939, endYear: 1945,
        definition: ['나치 독일 친위대 보안경찰과 정보부(SD)의 기동 부대. 독일군을 따라 점령지에 들어가 「적」을 제거하는 임무를 맡았고, 1941년 소련 침공 뒤 주로 총살로 유대인을 비롯한 민간인 100만 명이 훨씬 넘게 살해했다.',
            'Mobile units of the SS Security Police and SD that followed the German army into occupied territory to eliminate perceived enemies. After the invasion of the Soviet Union in 1941 they murdered well over a million civilians, above all Jews, mostly in mass shootings.'],
        body: ['특수작전집단은 1939년 폴란드 침공 때 이미 유대인 수천 명과 폴란드 엘리트 수만 명을 쏘았다. 1941년 6월 히틀러의 「절멸 전쟁」이 시작되자 A·B·C·D 네 집단, 약 3,000명이 공산당·소련 관리, 로마인, 그리고 무엇보다 나이와 성별을 가리지 않고 유대인을 겨냥했고, 첫 아홉 달 동안 50만 명이 넘는 사람을 총살하는 데 관여했다. 무장친위대, 질서경찰, 국방군과 현지 협력자들이 이들을 도왔다.\n\n북부집단군을 따라 발트 3국에 들어간 A집단은 발터 슈탈레커가 지휘했고, 1941년 겨울까지 유대인 24만 9,420명을 죽였다고 보고했다. 그 아래 카를 예거의 특무부대 3은 리투아니아에서 13만 7,346명의 처형을 집계한 「예거 보고서」를 남겼다. 총살의 부담을 줄이려 가스 트럭도 만들어졌지만, 소련 점령지에서는 끝까지 총살이 주된 방법이었다.',
            'The Einsatzgruppen had already shot thousands of Jews and tens of thousands of members of the Polish elite after the invasion of Poland in 1939. When Hitler’s “war of annihilation” began in June 1941, the four groups A, B, C and D, some 3,000 men, targeted Communist Party and Soviet state officials, Roma and above all Jews of any age or gender, and organised and helped carry out the shooting of more than half a million people in the first nine months. Units of the Waffen-SS, Order Police, Wehrmacht and local collaborators aided them.\n\nEinsatzgruppe A, which followed Army Group North into the Baltic states, was commanded by Walter Stahlecker and reported having murdered 249,420 Jews by the winter of 1941. Its Einsatzkommando 3 under Karl Jäger left the “Jäger Report”, tallying 137,346 executions in Lithuania. Gas vans were developed to spare the shooters, but mass shooting remained the main method throughout the occupied Soviet territories.'],
        aliases: { ko: ['아인자츠그루펜', '특수작전집단', '특별행동대', '기동 학살 부대'], en: ['Einsatzgruppe', 'mobile killing units', 'Einsatzgruppe A'] },
        people: ['walter-stahlecker', 'karl-jager', 'reinhard-heydrich', 'heinrich-himmler', 'friedrich-jeckeln'],
        events: ['baltic-german-occupation-1941-1944', 'great-patriotic-war'],
        sources: [S.usEinsatz, S.stahlecker, S.jagerReport], locator: 'Einsatzgruppen (USHMM); Einsatzgruppe A; Description',
    }),
    term({
        id: 'kaunas-pogrom', ko: '카우나스 포그롬', en: 'Kaunas pogrom', category: 'repression', period: '1941', startYear: 1941, endYear: 1941,
        definition: ['독소전 첫 주인 1941년 6월 25~29일 리투아니아 카우나스에서 리투아니아인 무장대가 유대인을 학살한 사건. 특수작전집단 A의 발터 슈탈레커가 독일의 지시가 드러나지 않게 알기르다스 클리마이티스의 부대를 부추겨 일으켰다.',
            'The massacre of Jews by Lithuanian militias in Kaunas on 25–29 June 1941, in the first week of the German invasion of the Soviet Union. Walter Stahlecker of Einsatzgruppe A had the unit of Algirdas Klimaitis start it in a way that concealed German instigation.'],
        body: ['리투아니아 행동주의 전선이 6월 23일 카우나스를 장악한 뒤, 25일 아침 도착한 슈탈레커는 리투아니아 보안경찰 본부에서 반유대 연설을 했다. 주민들이 선뜻 나서지 않자 그는 친위대 정보부(SD)가 틸지트에서 조직한 약 600명 규모의 클리마이티스 부대에 포그롬을 맡겼다. 25일 밤부터 유대인 교외 빌리얌폴레(슬로보트카)에서 살육이 시작되었고, 27일 리에투키스 차고에서는 수십 명의 유대인 남성이 군중 앞에서 쇠막대에 맞아 죽었다.\n\n희생자 수는 문헌마다 다르다. 슈탈레커는 6월 28일까지 카우나스에서 3,800명, 주변 마을에서 1,200명이 죽었다고 보고했지만 과장이라는 의심을 받고, 다른 문헌은 1,500~3,800명으로 적는다. 카를 예거는 6월 24일부터 7월 6일까지 카우나스에서 7,800명이 살해되었다고 기록했다. 책임이 현지인과 나치 가운데 어디에 먼저 있는지는 논쟁이 되어 왔고, 포그롬 뒤 체계적인 총살은 카우나스 요새의 제7·제9요새로 옮겨 갔다.',
            'After the Lithuanian Activist Front took control of Kaunas on 23 June, Stahlecker arrived on the morning of the 25th and delivered an antisemitic speech at the headquarters of the Lithuanian Security Police. When local Lithuanians proved unenthusiastic, he gave the task to Klimaitis’s unit of some 600 men, organised by the SD in Tilsit. The killing began on the night of the 25th in the Jewish suburb of Vilijampolė (Slobodka), and on the 27th several dozen Jewish men were beaten to death with a metal bar before a crowd at the Lietūkis garage.\n\nFigures differ. Stahlecker reported 3,800 dead in Kaunas and 1,200 in nearby towns by 28 June, though he is suspected of exaggerating, and other sources give 1,500–3,800. Karl Jäger recorded 7,800 Jews killed in Kaunas between 24 June and 6 July. Whether primary responsibility lay with local Lithuanians or with Nazi officials has been disputed. After the pogrom, systematic shootings moved to the Seventh and Ninth Forts of the Kaunas Fortress.'],
        aliases: { ko: ['코브노 포그롬', '리에투키스 차고 학살'], en: ['Kovno pogrom', 'Lietūkis Garage Massacre'] },
        people: ['walter-stahlecker', 'karl-jager'],
        events: ['baltic-german-occupation-1941-1944'],
        sources: [S.kaunas, S.holoLt, S.stahlecker], locator: 'lead; Background; Massacre; Responsibility',
    }),
    term({
        id: 'ponary-massacre', ko: '포나리 학살', en: 'Ponary massacre', category: 'repression', period: '1941–1944', startYear: 1941, endYear: 1944,
        definition: ['1941년 7월부터 1944년 8월까지 빌뉴스 근교 포나리(파네리아이)에서 독일 친위대와 정보부(SD), 리투아니아인 「특수소대」가 사람들을 총살한 대량 학살. 희생자는 7만~10만 명으로 추정되며, 그 가운데 약 7만 명이 유대인이었고 나머지는 폴란드인과 소련군 포로 등이었다.',
            'The mass murder of 70,000–100,000 people, about 70,000 of them Jews and the rest mainly Poles and Soviet prisoners of war, by the German SD and SS and the Lithuanian Ypatingasis būrys at Ponary (Paneriai) outside Vilnius between July 1941 and August 1944.'],
        body: ['총살은 1941년 7월 2일 특무부대 9가 빌뉴스에 오면서 시작되었고, 대부분의 사격은 80명가량의 리투아니아인 자원자 부대가 맡았다. 소련이 군용 비행장의 기름 저장고로 파 두었던 커다란 구덩이 여섯 개가 무덤이 되었다. 9월 빌뉴스 게토가 세워진 뒤에도 「작전」이 이어져, 1941년 말까지 포나리에서 살해된 유대인은 2만 1,700명(스나이더)부터 3만 3,500명(아라드), 약 4만 명(미국 홀로코스트 기념관)까지로 추정된다.\n\n1943년 소련군이 다가오자 나치는 「1005 작전」에 따라 수감자들로 「시신 부대」를 꾸려 시신을 파내 태우게 했다. 이들은 1944년 4월 19일 숟가락으로 판 굴로 탈출했고, 80명 가운데 살아남은 11명의 증언이 학살을 알렸다. 소련은 오랫동안 희생자를 「소련 시민」으로만 기렸고, 1991년에야 홀로코스트 희생자 기념비가 세워졌다.',
            'The shootings began when Einsatzkommando 9 arrived in Vilnius on 2 July 1941, with most of the killing done by a Lithuanian volunteer squad some 80 strong. Six large pits dug by the Soviets for the fuel tanks of a military airfield became the graves. The “actions” continued after the Vilnius ghetto was set up in September; estimates of the Jews killed at Ponary by the end of 1941 range from 21,700 (Timothy Snyder) to 33,500 (Yitzhak Arad) and about 40,000 (US Holocaust Memorial Museum).\n\nAs Soviet troops approached in 1943, the Nazis formed prisoners into “corpse units” under Aktion 1005 to dig up and burn the bodies. On 19 April 1944 they escaped through a tunnel dug with spoons, and the testimony of the 11 of the 80 who survived helped reveal the massacre. For decades the Soviet authorities commemorated the victims only as “Soviet citizens”; a monument to the Holocaust victims was erected only in 1991.'],
        aliases: { ko: ['파네리아이 학살', '포나리 숲 학살'], en: ['Paneriai massacre', 'Ponar massacre'] },
        people: ['karl-jager'],
        events: ['baltic-german-occupation-1941-1944'],
        sources: [S.ponary, S.yb, S.usVilna], locator: 'lead; Background; Massacres; Victims; Commemoration',
    }),
    term({
        id: 'rumbula-massacre', ko: '룸불라 학살', en: 'Rumbula massacre', category: 'repression', period: '1941', startYear: 1941, endYear: 1941,
        definition: ['1941년 11월 30일과 12월 8일 라트비아 리가 남쪽 룸불라 숲과 그곳으로 가는 길에서 유대인 약 2만 5,000명이 살해된 사건. 리가 게토의 라트비아 유대인 약 2만 4,000명과 베를린에서 실려 온 유대인 약 1,000명이 희생되었고, 친위대·경찰 고위 지도자 프리드리히 예켈른이 지휘했다.',
            'The murder of some 25,000 Jews in or on the way to the Rumbula forest south of Riga, Latvia, on 30 November and 8 December 1941: about 24,000 Latvian Jews from the Riga ghetto and about 1,000 Jews transported from Berlin. It was commanded by the Higher SS and Police Leader Friedrich Jeckeln.'],
        body: ['독일·오스트리아 유대인을 리가 게토로 보낼 자리를 마련하려고 하인리히 힘러는 우크라이나에서 바비 야르 학살 등을 지휘한 예켈른을 리가로 불렀다. 유대인을 노동력으로 쓰려던 국가판무관 힌리히 로제에게 힘러는 이것이 자기 명령이자 총통의 뜻이라고 전하게 했다. 일할 수 있는 남성은 「작은 게토」로 따로 갇혔고, 여성과 어린이, 노인은 10km를 걸어 미리 파 둔 구덩이로 끌려갔다. 사격은 예켈른의 독일인 대원 10~12명이 했고, 아라이스 특공대 등 라트비아 보조경찰은 행렬을 몰고 지켰다.\n\n바비 야르를 빼면 절멸수용소 가동 이전의 이틀간 학살로는 가장 컸다. 11월 30일 아침 가장 먼저 살해된 베를린 수송자 1,000명에 대해 힘러는 「청산하지 말라」고 전화로 지시했지만 이미 늦었다. 학살은 전후 뉘른베르크의 특수작전집단 재판의 근거가 되었고, 예켈른은 1946년 리가에서 교수형을 받았으며 빅토르스 아라이스는 1979년 서독 법원에서 종신형을 선고받았다.',
            'To make room in the Riga ghetto for Jews deported from Germany and Austria, Heinrich Himmler brought Jeckeln, who had directed Babi Yar and other massacres in Ukraine, to Riga, and told him to inform Reichskommissar Hinrich Lohse, who wanted to use the Jews as labour, that it was Himmler’s order and the Führer’s wish. Able-bodied men were separated into a “small ghetto”, while women, children and the elderly were marched ten kilometres to pits dug in advance. The shooting was done by 10 or 12 of Jeckeln’s German men; the Arajs Kommando and other Latvian auxiliaries drove and guarded the columns.\n\nExcept for Babi Yar, it was the biggest two-day Holocaust atrocity before the death camps began operating. Himmler telephoned an order that the 1,000 Berlin deportees, the first to be killed on the morning of 30 November, were not to be liquidated, but it came too late. The massacre formed part of the basis of the postwar Einsatzgruppen trial at Nuremberg; Jeckeln was hanged in Riga in 1946, and Viktors Arājs was sentenced to life imprisonment by a West German court in 1979.'],
        aliases: { ko: ['룸불라 작전', '예켈른 작전'], en: ['Rumbula Action', 'Jeckeln Action'] },
        people: ['friedrich-jeckeln', 'heinrich-himmler', 'hinrich-lohse', 'viktors-arajs', 'reinhard-heydrich'],
        events: ['baltic-german-occupation-1941-1944'],
        sources: [S.rumbula, S.usRiga, S.holoLv], locator: 'lead; Friedrich Jeckeln; First transport of German Jews arrives in Riga; Justice',
    }),
    term({
        id: 'arajs-kommando', ko: '아라이스 특공대', en: 'Arajs Kommando', category: 'repression', period: '1941–1943', startYear: 1941, endYear: 1943,
        definition: ['1941~1943년 독일 점령하 라트비아에서 활동한 친위대 정보부(SD) 소속 라트비아인 준군사 부대. 빅토르스 아라이스가 이끌었고, 라트비아 홀로코스트의 주요 가해자로 약 2만 6,000명의 유대인을 죽였다.',
            'A paramilitary unit of Latvian volunteers under the SS Security Service (SD) in German-occupied Latvia in 1941–1943. Led by Viktors Arājs, it was one of the main perpetrators of the Holocaust in Latvia and killed some 26,000 Jews.'],
        body: ['1941년 7월 1일 리가에서 특수작전집단 A의 발터 슈탈레커를 만난 아라이스는 이튿날 자발적으로 보이는 포그롬을 일으키라는 지시를 받았다. 대원은 대학생 단체, 해산된 라트비아군과 경찰, 아이즈사르기 출신 자원자였다. 부대는 7월 4일 밤 리가 회당 방화에 가담해 수백 명을 산 채로 태워 죽였고, 리에파야 학살에서는 직접 총살을 맡았고 룸불라 학살에서는 희생자를 구덩이로 몰고 지켰으며, 살라스필스 등 수용소 경비도 맡았다.\n\n1942년 중반부터는 벨라루스와 러시아의 대파르티잔 작전에 투입되어 1943년 「겨울 마법 작전」에서 파르티잔과 그 지지 혐의자 약 4,000명을 처형했다. 학살기에는 300~500명, 전성기에는 1,500명이었고, 1943년 말 해체되어 라트비아 군단에 편입되었다. 소련은 대원 352명을 처벌했고, 아라이스는 1979년 서독에서, 부지휘관 헤르베르츠 추쿠르스는 1965년 모사드에 암살되었다.',
            'Arājs met Walter Stahlecker of Einsatzgruppe A in Riga on 1 July 1941 and the next day was told to unleash a pogrom that would look spontaneous. Its members were volunteers from student fraternities, the disbanded Latvian army and police and the Aizsargi militia. On the night of 4 July it took part in burning Riga’s synagogues, where several hundred Jews were burned alive; at Liepāja it carried out shootings, at Rumbula it drove and guarded the victims, and it also guarded camps such as Salaspils.\n\nFrom mid-1942 it was used in anti-partisan operations in Belarus and Russia and in Operation Winterzauber in 1943 executed nearly 4,000 partisans or suspected supporters. It numbered 300–500 men during the killings of Latvian Jews and up to 1,500 at its peak, and was disbanded in late 1943 and merged into the Latvian Legion. The Soviets convicted 352 of its members; Arājs was sentenced in West Germany in 1979, and his deputy Herberts Cukurs was assassinated by the Mossad in 1965.'],
        aliases: { ko: ['아라이스 코만도', '아라이스 부대'], en: ['Sonderkommando Arajs', 'Arājs Kommando', 'Arāja komanda'] },
        people: ['viktors-arajs', 'walter-stahlecker', 'friedrich-jeckeln'],
        events: ['baltic-german-occupation-1941-1944'],
        sources: [S.arajsK, S.holoLv, S.rumbula], locator: 'lead; Formation; Activity; Prosecution',
    }),
];

module.exports = { event, people, terms };
